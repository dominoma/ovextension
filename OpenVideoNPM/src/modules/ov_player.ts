

import * as VideoTypes from "./video_types";

import * as Tools from "./OV/tools";
import * as Analytics from "./OV/analytics";
import * as Environment from "./OV/environment";
import * as Page from "./OV/page";
import * as Messages from "./OV/messages";
import * as Storage from "./OV/storage";
import * as Languages from "./OV/languages";

import * as TheatreMode from "./Messages/theatremode";

import * as OVPlayerComponents from "./ov_player_components";

import videojs_raw from "video.js";

declare var videojs : typeof videojs_raw;

(window as any)["Worker"] = undefined;
Messages.setupMiddleware();
Page.wrapType(XMLHttpRequest, {
    open: {
        get: function(target) {
            return function(method : string, url : string) {
                if(getPlayer() && getPlayer().currentType().match(/application\//i) && !url.match(/OVReferer/i)) {
                    arguments[1] = url+(url.indexOf("?") == -1 ? "?" : "&")+"OVreferer="+encodeURIComponent(btoa(Page.getUrlObj().origin));
                }
                target.open.apply(target, arguments as any);
            }
        }   
    }
});
export interface Player extends videojs_raw.Player {
    hotkeys?: (obj : Object) => void;
    getActiveVideoSource?: () => VideoTypes.VideoSource;
    getVideoData?: () => VideoTypes.VideoData;
    setVideoData?: (videoData: VideoTypes.VideoData) => void;
    updateSrc?: (srces : Array<VideoTypes.VideoSource>) => void;
    saveToHistory?: () => void;
    loadFromHistory?: () => void;
}


let player : Player = null;
export function parseSrt(dataAndEvents: string, oncue: (cue: VideoTypes.VTTCue) => void) {

    function trim(dataAndEvents: string) {
        return (dataAndEvents + "").replace(/^\s+|\s+$/g, "");
    }
    function parseCueTime(dataAndEvents: string): number {
        var parts = dataAndEvents.split(":");
        /** @type {number} */
        var sum = 0;
        var minutes;
        var part;
        var url;
        var x;
        var i;
        if (parts.length == 3) {
            minutes = parts[0];
            part = parts[1];
            url = parts[2];
        } else {
            minutes = "0";
            part = parts[0];
            url = parts[1];
        }
        url = url.split(/\s+/);
        x = url.splice(0, 1)[0];
        x = x.split(/\.|,/);
        i = parseFloat(x[1]);
        x = x[0];
        sum += parseFloat(minutes) * 3600;
        sum += parseFloat(part) * 60;
        sum += parseFloat(x);
        if (i) {
            sum += i / 1E3;
        }
        return sum;
    }

    if (dataAndEvents == "") {
        alert("Invalid srt file!");
    }
    var tempData;
    var splitted;
    var collection;
    var nodes = dataAndEvents.split("\n");
    var resp = "";
    var user_id;
    var cuelength = 0;
    var n = nodes.length;
    for (var i = 1; i < n; ++i) {
        resp = trim(nodes[i]);
        if (resp) {
            if (resp.indexOf("-->") == -1) {
                user_id = resp;
                resp = trim(nodes[++i]);
            } else {
                user_id = cuelength;
            }
            tempData = {
                id: user_id,
                index: cuelength,
                startTime: undefined,
                endTime: undefined,
                text: ""
            };
            splitted = resp.split(/[\t ]+/);
            tempData.startTime = parseCueTime(splitted[0]);
            tempData.endTime = parseCueTime(splitted[2]);
            /** @type {Array} */
            collection = [];
            for (; nodes[++i] && (resp = trim(nodes[i]));) {
                collection.push(resp);
            }
            tempData.text = collection.join("\n");
            oncue({ id: "", startTime: tempData.startTime, endTime: tempData.endTime, text: tempData.text, pauseOnExit: false });
            cuelength += 1;
        }
    }
}
export function addTextTrack(player : Player, rawTrack : VideoTypes.SubtitleSource) {
    Tools.createRequest({ url: rawTrack.src }).then(function(xhr) {
        var srcContent = xhr.responseText;
        //function (srcContent) {
        if (srcContent.indexOf("-->") !== -1) {
            
            player.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
            let track = player.textTracks()[player.textTracks().length - 1];
            if(rawTrack.default) {
                track.mode = "showing";
            }
            parseSrt(srcContent, function(cue) {
                track.addCue(cue);
            });
            
        } else {
            throw Error("Invaid subtitle file");
        }
    });
}
export function getPlayer() {
    return player;
}
export function initPlayer(playerId : string, options: Object, videoData: VideoTypes.VideoData) : Player {
    
    OVPlayerComponents.register();
    options = Tools.merge(options, {
        plugins: {
            videoJsResolutionSwitcher: {
              dynamicLabel: true
            }
        },
        /*chromecast:{
             appId:'APP-ID'
        },*/
        playbackRates: [0.5, 1, 2],
        language: Languages.getMsg("video_player_locale")
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
        var FavButton = ControlBar.addChild('FavButton', {}) as OVPlayerComponents.FavButton;
        var DownloadButton = ControlBar.addChild('DownloadButton', {});
        var PatreonButton = ControlBar.addChild('PatreonButton', {});
        var FullscreenToggle = ControlBar.getChild('fullscreenToggle') as videojs_raw.FullscreenToggle;
        var CaptionsButton = ControlBar.getChild('SubsCapsButton') as videojs_raw.CaptionsButton;
        CaptionsButton.show();
        player.on("ratechange", function(){
            Analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
        });
        FullscreenToggle.on("click", function(){
            let fullscreen = player.isFullscreen();
            window.setTimeout(function(){
                if(Environment.browser() == Environment.Browsers.Chrome && !(document as any).fullscreen && player.isFullscreen()) {
                    console.log("FULLSCREEN ERROR");
                    Analytics.fireEvent("FullscreenError", "FullscreenError", "IFrame: '"+videoData.origin+"' Page: '<PAGE_URL>', Version: "+Environment.getManifest().version)
                }
            }, 1000);
        });
        player.controlBar.el().insertBefore(FavButton.el(), CaptionsButton.el());
        player.controlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
        player.controlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
        Storage.sync.get("PlayerVolume").then(function(volume){
            if(volume) {
                player.volume(volume);
            }
        });
        player.on('volumechange', function(){
            Storage.sync.set("PlayerVolume",player.volume());
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
       
        
        player.poster(Tools.addParamsToURL(videoData.poster, { OVReferer: encodeURIComponent(btoa(videoData.origin)) }));
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
            addTextTrack(player, track);
            //player.addRemoteTextTrack(<any>track, true);
        }
        
    }
    player.getVideoData = function() {
        return videoData;
    }
    player.setVideoData(videoData);
        
    //player.aspectRatio("0:0");
    
    player.saveToHistory = function(){
        Storage.sync.get("disableHistory").then(function(disabled){
            if(!disabled) {
                Storage.local.get("OpenVideoHistory").then(function(history : Array<VideoTypes.HistoryEntry>){
                    if(!history) {
                        history = [];
                    }
                    var itemIndex = history.indexOf(history.find(function(arrElem : VideoTypes.HistoryEntry){
                        return arrElem.origin == videoData.origin;
                    }));
                    if(itemIndex != -1) {
                        history.splice(itemIndex,1);
                    }
                    var histHash : VideoTypes.HistoryEntry = {
                            poster: videoData.poster,
                            title: videoData.title,
                            origin: videoData.origin,
                            stoppedTime: player.currentTime()
                    };
                    
                    
                    //player.getVideoFileHash(function(fileHash){
                        //HistHash.fileHash = fileHash;
                    history.unshift(histHash);
                    Storage.local.set("OpenVideoHistory", history);
                    //});
                });
            }
        });
    };
    player.loadFromHistory = function(){
        Storage.local.get("OpenVideoHistory").then(function(history : Array<VideoTypes.HistoryEntry>){
            if(history){
                //player.getVideoFileHash(function(fileHash){
                    var item = history.find(function(arrElem){
                        return arrElem.origin == videoData.origin;
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