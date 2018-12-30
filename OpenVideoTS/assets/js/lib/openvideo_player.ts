namespace OVPlayer {
    OV.messages.setupMiddleware();
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
        var Player : Player = videojs(playerId,options); 
        Player.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
        
        Player.getActiveVideoSource = function() : VideoTypes.VideoSource { 
            for(var src of videoData.src) {
                if(Player.src().indexOf(src.src) == 0) {
                    return src;
                }
            } 
            return null;
        }
        
        
        Player.on("ready", function(){
            (Player.el() as HTMLElement).style.width = "100%";
            (Player.el() as HTMLElement).style.height = "100%";
            let ControlBar = Player.getChild('controlBar');
            var FavButton = ControlBar.addChild('FavButton', {}) as FavButton;
            var DownloadButton = ControlBar.addChild('DownloadButton', {});
            var PatreonButton = ControlBar.addChild('PatreonButton', {});
            var FullscreenToggle = ControlBar.getChild('fullscreenToggle') as videojs.FullscreenToggle;
            var CaptionsButton = ControlBar.getChild('SubsCapsButton') as videojs.CaptionsButton;
            CaptionsButton.show();
            Player.on("ratechange", function(){
                OV.analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
            });
            Player.controlBar.el().insertBefore(FavButton.el(), CaptionsButton.el());
            Player.controlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
            Player.controlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
            OV.storage.sync.get("PlayerVolume").then(function(volume){
                if(volume) {
                    Player.volume(volume);
                }
            });
            Player.on('volumechange', function(){
                OV.storage.sync.set("PlayerVolume",Player.volume());
            });
            Player.on('loadedmetadata',function() {
                Player.loadFromHistory();
                FavButton.updateDesign();
            });
            document.body.onmouseleave  = function() {
                if(Player.currentTime() != 0) {
                    Player.saveToHistory();
                }
            };
        });
        
        Player.setVideoData = function(videoData : VideoTypes.VideoData) {
           
            
            Player.poster(videoData.poster);
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
                Player.src(srces[0]);
            }
            else {
                Player.updateSrc(srces);
            
                
            }
            for(let track of videoData.tracks) {
                OVPlayer.addTextTrack(Player, track);
                //Player.addRemoteTextTrack(<any>track, true);
            }
            
        }
        Player.getVideoData = function() {
            return videoData;
        }
        Player.setVideoData(videoData);
            
        //Player.aspectRatio("0:0");
        
        Player.saveToHistory = function(){
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
                                stoppedTime: Player.currentTime()
                        };
                        
                        
                        //Player.getVideoFileHash(function(fileHash){
                            //HistHash.fileHash = fileHash;
                        history.unshift(histHash);
                        OV.storage.local.set("OpenVideoHistory", history);
                        //});
                    });
                }
            });
        };
        Player.loadFromHistory = function(){
            OV.storage.local.get("OpenVideoHistory").then(function(history : Array<HistoryEntry>){
                if(history){
                    //Player.getVideoFileHash(function(fileHash){
                        var item = OV.array.search(videoData.origin, history, function(origin, arrElem){
                            return arrElem.origin == origin;
                        });
                        if(item) {
                            Player.currentTime(item.stoppedTime);
                        }
                    //});
                }
            });
        };
        
        
        return Player;
    }
}