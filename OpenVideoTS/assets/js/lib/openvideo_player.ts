namespace OVPlayer {
    (window as any)["Worker"] = undefined;
    OV.messages.setupMiddleware();
    OV.page.wrapType(XMLHttpRequest, {
        open: {
            get: function(target) {
                return function(method : string, url : string) {
                    if(getPlayer() && getPlayer().currentType().match(/application\//i) && !url.match(/OVReferer/i)) {
                        arguments[1] = url+(url.indexOf("?") == -1 ? "?" : "&")+"OVreferer="+encodeURIComponent(btoa(OV.page.getUrlObj().origin));
                    }
                    target.open.apply(target, arguments);
                }
            }   
        }
    });
    export interface Player extends videojs.Player {
        hotkeys?: (obj : Object) => void;
        getActiveVideoSource?: () => VideoTypes.VideoSource;
        getVideoData?: () => VideoTypes.VideoData;
        setVideoData?: (videoData: VideoTypes.VideoData) => void;
        updateSrc?: (srces : Array<VideoTypes.VideoSource>) => void;
        saveToHistory?: () => void;
        loadFromHistory?: () => void;
    }
    
    export interface HistoryEntry { 
        poster: string;
        title: string;
        origin: string;
        stoppedTime: number;
    }
    let player : Player = null;
    export function getPlayer() {
        return player;
    }
    export function initPlayer(playerId : string, options: Object, videoData: VideoTypes.VideoData) : Player {
        
        options = OV.object.merge(options, {
            plugins: {
                videoJsResolutionSwitcher: {
                  dynamicLabel: true
                }
            },
            /*chromecast:{
                 appId:'APP-ID'
            },*/
            playbackRates: [0.5, 1, 2],
            language: OV.languages.getMsg("video_player_locale")
        });
        player = videojs(playerId,options); 
        player.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
        
        player.getActiveVideoSource = function() : VideoTypes.VideoSource { 
            for(var src of videoData.src) {
                if(player.src().indexOf(src.src) == 0) {
                    return src;
                }
            } 
            return null;
        }
        
        
        player.on("ready", function(){
            (player.el() as HTMLElement).style.width = "100%";
            (player.el() as HTMLElement).style.height = "100%";
            let ControlBar = player.getChild('controlBar');
            var FavButton = ControlBar.addChild('FavButton', {}) as FavButton;
            var DownloadButton = ControlBar.addChild('DownloadButton', {});
            var PatreonButton = ControlBar.addChild('PatreonButton', {});
            var FullscreenToggle = ControlBar.getChild('fullscreenToggle') as videojs.FullscreenToggle;
            var CaptionsButton = ControlBar.getChild('SubsCapsButton') as videojs.CaptionsButton;
            CaptionsButton.show();
            player.on("ratechange", function(){
                OV.analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
            });
            FullscreenToggle.on("click", function(){
                let fullscreen = player.isFullscreen();
                window.setTimeout(function(){
                    if(OV.environment.browser() == OV.environment.Browsers.Chrome && !(document as any).fullscreen && player.isFullscreen()) {
                        console.log("FULLSCREEN ERROR");
                        OV.analytics.fireEvent("FullscreenError", "FullscreenError", "IFrame: '"+videoData.origin+"' Page: '<PAGE_URL>'")
                    }
                }, 1000);
            });
            player.controlBar.el().insertBefore(FavButton.el(), CaptionsButton.el());
            player.controlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
            player.controlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
            OV.storage.sync.get("PlayerVolume").then(function(volume){
                if(volume) {
                    player.volume(volume);
                }
            });
            player.on('volumechange', function(){
                OV.storage.sync.set("PlayerVolume",player.volume());
            });
            player.on('loadedmetadata',function() {
                player.loadFromHistory();
                FavButton.updateDesign();
            });
            document.body.onmouseleave  = function() {
                if(player.currentTime() != 0) {
                    player.saveToHistory();
                }
            };
        });
        
        player.setVideoData = function(videoData : VideoTypes.VideoData) {
           
            
            player.poster(OV.tools.addParamsToURL(videoData.poster, { OVReferer: encodeURIComponent(btoa(videoData.origin)) }));
            var srces = videoData.src;
            
            var checkedSrces = [];
            for(var src of srces) {
                if(src.src != "") {
                    src.src = src.src + (src.src.indexOf("?") == -1 ? "?" : "&") + "isOV=true";
                    checkedSrces.push(src);
                }
            }
            srces = checkedSrces;
            if(srces.length == 1) {
                player.src(srces[0]);
            }
            else {
                player.updateSrc(srces);
            
                
            }
            for(let track of videoData.tracks) {
                OVPlayer.addTextTrack(player, track);
                //player.addRemoteTextTrack(<any>track, true);
            }
            
        }
        player.getVideoData = function() {
            return videoData;
        }
        player.setVideoData(videoData);
            
        //player.aspectRatio("0:0");
        
        player.saveToHistory = function(){
            OV.storage.sync.get("disableHistory").then(function(disabled){
                if(!disabled) {
                    OV.storage.local.get("OpenVideoHistory").then(function(history : Array<HistoryEntry>){
                        if(!history) {
                            history = [];
                        }
                        var itemIndex = history.indexOf(OV.array.search(videoData.origin, history, function(origin : string, arrElem : HistoryEntry){
                            return arrElem.origin == origin;
                        }));
                        if(itemIndex != -1) {
                            history.splice(itemIndex,1);
                        }
                        var histHash : HistoryEntry = {
                                poster: videoData.poster,
                                title: videoData.title,
                                origin: videoData.origin,
                                stoppedTime: player.currentTime()
                        };
                        
                        
                        //player.getVideoFileHash(function(fileHash){
                            //HistHash.fileHash = fileHash;
                        history.unshift(histHash);
                        OV.storage.local.set("OpenVideoHistory", history);
                        //});
                    });
                }
            });
        };
        player.loadFromHistory = function(){
            OV.storage.local.get("OpenVideoHistory").then(function(history : Array<HistoryEntry>){
                if(history){
                    //player.getVideoFileHash(function(fileHash){
                        var item = OV.array.search(videoData.origin, history, function(origin, arrElem){
                            return arrElem.origin == origin;
                        });
                        if(item) {
                            player.currentTime(item.stoppedTime);
                        }
                    //});
                }
            });
        };
        
        
        return player;
    }
}