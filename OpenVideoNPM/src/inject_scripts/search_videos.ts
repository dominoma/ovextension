import * as Page from "OV/page";
import videojs from "video.js";
import * as VideoTypes from "video_types";

import * as VideoPopup from "Messages/videopopup";

import "./csVideoPopup.scss";

abstract class VideoSearcher {

    protected sendVideoData(videoData : VideoTypes.RawVideoData) {
        if(videoData.src.length > 0) {
            VideoPopup.addVideoToPopup(videoData);
        }
    }
    abstract canFindVideos() : boolean;
    protected abstract doSearch() : void;
    search() {
        if(this.canFindVideos()) {
            console.log("Search Videos with "+this.constructor.name);
            this.doSearch();
        }
    }
}

class VideoJSSearcher extends VideoSearcher {
    canFindVideos() {
        return (window as any)["videojs"] && (window as any)["videojs"]["players"];
    }
    private getSrces(player : videojs.Player) {
        let hash : Array<VideoTypes.VideoSource>;
        if((player as any).getGroupedSrc) {
            hash = ((Object as any).values((player as any).getGroupedSrc().label) as any[]).reduce((arr, srces)=>{
                return arr.concat(srces);
            }, []);
        }
        else if(player.options_.sources && player.options_.sources.length > 0) {
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
        if(!Array.isArray(hash)) {
            hash = [hash];
        }
        console.log(hash);
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
    private getTracks(player : videojs.Player) {
        var tracks : VideoTypes.SubtitleSource[] = [];
        for(let i = 0;i<player.textTracks().length;i++) {
            let textTrack = player.textTracks()[i] as any;
            var track = { src: "", kind: "", language: "", label: "", default: false, cues: [] as VideoTypes.VTTCue[] };
            let options = (textTrack.options_ || textTrack.options);
            let cues = textTrack.cues_ || textTrack.cues;
            if(options && options.src) {
                track.src = options.src;
            }
            else if(cues && cues.length != 0) {
                for(let cue of cues) {
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
    private getPlayers() : { [key:string]: videojs.Player }|null {
        if((<any>window)['videojs'] && (<any>window)['videojs'].players) {
            return (<any>window)['videojs'].players;
        }
        return null;
    }
    private extractData(player : videojs.Player) {
        let srces = this.getSrces(player);
        let tracks = this.getTracks(player);
        this.sendVideoData({ src: srces, tracks: tracks, poster: player.poster(), title: document.title });
    }
    private setupPlayer(player : videojs.Player) {
        let this_= this;
        player.on('loadedmetadata', function(){
            this_.extractData(player);
        });
        this_.extractData(player);
    }
    protected doSearch() {
        let players = this.getPlayers();
        for(let name in players) {
            this.setupPlayer(players[name]);
        }
        let this_ = this;
        if((window as any).videojs.hook) {
            (window as any).videojs.hook('setup', function(player : videojs.Player) {
                this_.setupPlayer(player);
            });
        }
    }
}
interface JWPlayer {
    getPlaylist: () => {
        sources: [VideoTypes.VideoSource & {file: string}];
        tracks: [VideoTypes.SubtitleSource & {file: string}];
        image: string;
    }[];
    on: (event: string, cb: () => void) => void;
    isSetup: boolean;
}
class JWPlayerSearcher extends VideoSearcher {
    canFindVideos() {
        return !!(window as any)["jwplayer"];
    }
    private getSrces(player : JWPlayer) : VideoTypes.VideoSource[] {
        return player.getPlaylist()[0].sources.map(function(src){
            return {
                src: src.file,
                type: src.type == "hls" ? "application/x-mpegURL" : "video/"+src.type,
                label: src.label || "SD"
            };
        });
    }
    private getTracks(player : JWPlayer) : VideoTypes.SubtitleSource[] {
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
    private getPlayers() {
        var arr = [];
        for(var i=0, player=(window as any)['jwplayer'](0);player.on;player=(window as any)['jwplayer'](++i)) {
            arr.push(player);
        }
        return arr as JWPlayer[];
    }
    private extractData(player : JWPlayer) {
        this.sendVideoData({
            src: this.getSrces(player),
            tracks: this.getTracks(player),
            poster: player.getPlaylist()[0].image,
            title: document.title
        });
    }
    private setupPlayer(player : JWPlayer) {
        let this_= this;
        player.on('meta', function(){
            this_.extractData(player);
        });
        this_.extractData(player);
        player.isSetup = true;
    }
    protected doSearch() {
        for(let player of this.getPlayers()) {
            this.setupPlayer(player);
        }
        let this_ = this;
        Page.onNodeInserted(document, function(target){
            if(target instanceof HTMLElement) {
                if(target instanceof HTMLVideoElement || target.getElementsByTagName("video").length > 0) {
                    for(let player of this_.getPlayers()) {
                        if(!player.isSetup) {
                            this_.setupPlayer(player);
                        }
                    }
                }
            }
        });
    }
}
class HTMLVideoSearcher extends VideoSearcher {

    canFindVideos() {
        return true;
    }
    private getSrces(videoNode: HTMLVideoElement) {
        var srces : VideoTypes.VideoSource[] = [];
        for(let source of videoNode.getElementsByTagName("source")){
            let hash: VideoTypes.VideoSource = { src: source.src, type: source.type, label: "SD" };
            if(source.hasAttribute("label")) {
                hash.label = source.getAttribute("label")!;
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
        }
        if(srces.length == 0 && videoNode.src) {
            srces = [{
                src: videoNode.src,
                type: "video/mp4",
                label: "SD"
            }];
        }
        return srces;
    }
    private getTracks(videoNode: HTMLVideoElement) {
        var tracks : VideoTypes.SubtitleSource[] = [];
        for(let track of videoNode.getElementsByTagName("track")){
            if(track.src) {
                tracks.push({
                    src: track.src,
                    kind: track.kind,
                    label: track.label,
                    default: track.default,
                    language: track.lang
                })
            }
        }
        return tracks;
    }
    private extractVideoData(videoNode: HTMLVideoElement) {
        this.sendVideoData({
            src: this.getSrces(videoNode),
            tracks: this.getTracks(videoNode),
            poster: videoNode.poster,
            title: document.title
        });
    }
    private setupPlayer(videoNode: HTMLVideoElement) {
        this.extractVideoData(videoNode);
        let this_ = this;
        videoNode.addEventListener("loadedmetadata", function(){
            this_.extractVideoData(videoNode);
        });
    }
    protected doSearch() {
        let this_ = this;
        for(let video of document.getElementsByTagName("video")) {
            this.setupPlayer(video);
        }
        Page.onNodeInserted(document, function(target){
            if(target instanceof HTMLElement) {
                if(target instanceof HTMLVideoElement) {
                    this_.setupPlayer(target as HTMLVideoElement);
                }
                else {
                    let videos = target.getElementsByTagName("video");
                    for(let video of videos) {
                        this_.setupPlayer(video);
                    }
                }
            }
        });
    }

}


console.log("OpenVideo Search is here!", location.href);
let videojsSearcher = new VideoJSSearcher();
let jwPlayerSearcher = new JWPlayerSearcher();
if(!videojsSearcher.canFindVideos() && !jwPlayerSearcher.canFindVideos()) {
    let videoNodeSearcher = new HTMLVideoSearcher();
    videoNodeSearcher.search();
}
else {
    videojsSearcher.search();
    jwPlayerSearcher.search();
}
