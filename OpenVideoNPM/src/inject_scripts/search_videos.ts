import * as Page from "OV/page";
import videojs from "video.js";
import * as VideoTypes from "video_types";

import * as VideoPopup from "Messages/videopopup";


function getVJSPlayerSrces(player : videojs.Player) {
    let hash : Array<VideoTypes.VideoSource>;
    if(player.options_.sources && player.options_.sources.length > 0) {
        hash = player.options_.sources as Array<VideoTypes.VideoSource>;
    }
    else if(player.getCache().sources) {
        hash = player.getCache().sources as Array<VideoTypes.VideoSource>;
    }
    else if(player.getCache().source) {
        hash = player.getCache().source as Array<VideoTypes.VideoSource>;
    }
    else if(player.getCache().src){
        hash = [player.getCache()] as Array<VideoTypes.VideoSource>;
    }
    else {
        hash = [{src: player.src(), type: "video/mp4", label: "SD" }];
    }

    for(let elem of hash) {
        if((elem as any)["data-res"]) {
            elem.label = (elem as any)["data-res"];
        }
        if(!elem.type) {
            elem.type = "video/mp4";
        }
    };
    return hash;
}
function getVJSPlayerCaptions(player : videojs.Player) {
    var tracks : VideoTypes.SubtitleSource[] = [];
    for(let i = 0;i<player.textTracks().length;i++) {
        let textTrack = player.textTracks()[i] as any;
        var track = { src: "", kind: "", language: "", label: "", default: false, cues: [] as VideoTypes.VTTCue[] };
        if(textTrack.options_ &&  textTrack.options_.src) {
            track.src = textTrack.options_.src;
        }
        else if(textTrack.cues_.length != 0) {
            for(let cue of textTrack.cues_) {
                track.cues.push({ startTime: cue.startTime, endTime: cue.endTime, text: cue.text, id: "", pauseOnExit: false });
            };
        }
        else {
            break;
        }
        if(typeof textTrack.kind == "function") {
            track.kind = textTrack.kind();
            track.language = textTrack.language();
            track.label = textTrack.label();
            if(textTrack.default) {
                track.default = textTrack.default();
            }
        }
        else {
            track.kind = textTrack.kind;
            track.language = textTrack.language;
            track.label = textTrack.label;
            track.default = textTrack.default;
        }

        tracks.push(track);
    };
    return tracks;
}
function getVideoJSPlayers() : Array<videojs.Player> {
    if((<any>window)['videojs'] != undefined) {
        console.log("VIDEOJS FOUND");
        return (<any>window)['videojs'].players;
    }
    return null;
}
interface JWPlayer {
    getPlaylist: () => {
        sources: [VideoTypes.VideoSource & {file: string}];
        tracks: [VideoTypes.SubtitleSource & {file: string}];
        image: string;
    }[];
}
function getJWPlayers() {
    if((<any>window)['jwplayer'] == undefined) {
        return null;
    }
    console.log("JWPLAYER FOUND");
    var arr = [];
    for(var i=0, player=(<any>window)['jwplayer'](0);player.on;player=(<any>window)['jwplayer'](++i)) {
        arr.push(player);
    }
    return arr;
}
function isPlayerLibrary() {
    return (<any>window)['jwplayer'] != null || (<any>window)['videojs'] != null;
}
function getJWPlayerSrces(player : JWPlayer) : VideoTypes.VideoSource[] {
    return player.getPlaylist()[0].sources.map(function(src){
        return {
            src: src.file,
            type: src.type == "hls" ? "application/x-mpegURL" : "video/"+src.type,
            label: src.label || "SD"
        };
    });
}
function getJWPlayerCaptions(player : JWPlayer) : VideoTypes.SubtitleSource[] {
    return player.getPlaylist()[0].tracks.map(function(track){
        return {
            src: track.file,
            label: track.label,
            kind: track.kind,
            language: track.language,
            default: track.default,
            cues: track.cues
        };
    });
}
function getSrc(videoNode : HTMLVideoElement) {
    var srces : VideoTypes.VideoSource[] = [];
    for(let source of videoNode.getElementsByTagName("source")){
        let hash: VideoTypes.VideoSource = { src: source.src, type: source.type, label: "SD" };
        if(source.hasAttribute("label")) {
            hash.label = source.getAttribute("label");
        }
        else if(source.dataset.res) {
            hash.label = source.dataset.res;
        }
        if(source.hasAttribute("default")) {
            hash.default = true;
            srces.unshift(hash);
        }
        else {
            srces.push(hash);
        }
    };
    if(srces.length == 0) {
        VideoPopup.addVideoToPopup({ src: [{ src: videoNode.src, type: "video/mp4", label: "SD" }], tracks: [], poster: videoNode.poster, title: "", origin: "" });
    }
    else {
        VideoPopup.addVideoToPopup({ src: srces, tracks: [], poster: videoNode.poster, title: "", origin: "" });
    }
}


console.log("OpenVideo Search is here!", location.href);

/*var videoArr = document.getElementsByTagName("video");
OV.tools.forEach(videoArr, function(videoNode){
    SetupVideo(videoNode);
});*/
var videoJSPlayers = getVideoJSPlayers();
console.log(videoJSPlayers)
if(videoJSPlayers) {
    function extractVJSVideoData(player : videojs.Player) {
        VideoPopup.addVideoToPopup({ src: getVJSPlayerSrces(player), tracks: getVJSPlayerCaptions(player), poster: player.poster(), title: "", origin: "" });
        player.on('loadstart', function(){
            VideoPopup.addVideoToPopup({ src: getVJSPlayerSrces(player), tracks: getVJSPlayerCaptions(player), poster: player.poster(), title: "", origin: "" });
        });
    }
    for(var player of videoJSPlayers) {
        extractVJSVideoData(player);
    }
    if(videojs.hook) {
        videojs.hook('setup', function(player) {
            extractVJSVideoData(player);
        });
    }
}
var jwPlayers = getJWPlayers();
if(jwPlayers) {
    for(let player of jwPlayers){
        VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
        player.on('meta', function(){
            VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
        });
    }
}
function setupPlainVideoListener(video : HTMLVideoElement) {
    //video.play();
    if(!isPlayerLibrary()) {
        getSrc(video);
        video.addEventListener('loadedmetadata', function(){
            getSrc(video);
        });
    }
    else {
        var jwPlayers = getJWPlayers();
        if(jwPlayers) {
            for(let player of jwPlayers){
                VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
                player.on('meta', function(){
                    VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
                });
            }
        }
    }
}
for(let videoNode of document.getElementsByTagName("video")) {
    setupPlainVideoListener(videoNode);
};
Page.onNodeInserted(document, function(tgt){
    let target = tgt as HTMLElement;
    if(target.tagName && target.tagName.toLowerCase() == "video") {
        setupPlainVideoListener(target as HTMLVideoElement);
    }
});
