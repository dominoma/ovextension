import "!style-loader!css-loader!video.js/dist/video-js.css";
import "./ov_player.scss";

import * as React from "react";
import * as VideoTypes from "video_types";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";
import * as Environment from "OV/environment";
import * as Page from "OV/page";
import * as Messages from "OV/messages";
import * as Storage from "OV/storage";
import * as Languages from "OV/languages";

import * as Background from "Messages/background";

(window as any)["Worker"] = undefined;
Messages.setupMiddleware();
/*Page.wrapType(XMLHttpRequest, {
    open: {
        get: function(target) {
            if(OVPlayer.getInstance()) {
                return OVPlayer.getInstance()!.httpReqOpenOverride(target);
            }
            else {
                return target.open;
            }
        }
    }
});*/
import videojs from "video.js";
import * as OVPlayerComponents from "./ov_player_components";
import "videojs-hotkeys/videojs.hotkeys.js";
OVPlayerComponents.setup();
type OVPlayerProps = {
    videoData: VideoTypes.VideoData
    options?: videojs.PlayerOptions
    isPopup: boolean;
    onError?: (player : Player) => any;
}
type OVPlayerState = {

}
export interface Player extends videojs.Player {
    hotkeys: (obj: Object) => void;
    updateSrc: (srces: Array<VideoTypes.VideoSource>) => void;
    execute: (cmd: string, data : any) => any;
}
export class OVPlayer extends React.Component<OVPlayerProps, OVPlayerState> {

    private player : Player | null = null;
    private videoNode : HTMLVideoElement | null = null;
    private srtSelector = document.createElement("input") as HTMLInputElement;

    private static instance : OVPlayer | null = null;

    static getInstance() {
        return OVPlayer.instance;
    }

    constructor(props : OVPlayerProps) {
        super(props);
        OVPlayer.instance = this;
    }

    httpReqOpenOverride(target : XMLHttpRequest) {
        return (method: string, url: string) => {
            console.log("HALLO");
            if (this.player && this.player.currentType().match(/application\//i) && /\.(ts|m3u8)$/.test(url)) {
                url = Tools.addRefererToURL(url, this.props.videoData.origin.url);
            }
            target.open(method, url);
        }
    }

    componentDidMount() {
        // instantiate Video.js
        this.setupSrtSelector();
        this.player = videojs(this.videoNode, Tools.merge(this.props.options, {
            plugins: {

            },
            playbackRates: [0.5, 1, 2],
            language: Languages.getMsg("video_player_locale")
        }), () => {
            this.playerReady();
        }) as Player;
    }

    // destroy player on unmount
    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
            this.player = null;
        }
    }
    componentDidUpdate(oldProps : OVPlayerProps) {
        this.setVideoData(this.props.videoData);
    }
    async execute(cmd : string, data: any) {
        if(cmd == "downloadSource") {
            this.downloadSource(data);
        }
        else if(cmd == "downloadActiveSource") {
            this.downloadSource(this.getActiveVideoSource());
        }
        else if(cmd == "downloadTrack") {
            this.downloadTrack(data);
        }
        else if(cmd == "loadSubtitlesFromFile") {
            this.srtSelector.click();
        }
        else if(cmd == "loadSubtitlesFromURL") {
            let response = await Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" });
            if (!response.aborted) {
                let fn = await Tools.getUrlFileName(response.text);
                this.appendTextTrack({ kind: "captions", label: fn, language: "AddedFromUser", src: response.text });
            }
        }
        else if(cmd == "addToPlaylist") {
            let id = (data as Storage.Playlist).id;
            await Storage.addToPlaylist(await this.getVideoRefData(), id);
        }
        else if(cmd == "removeFromPlaylist") {
            let id = (data as Storage.Playlist).id;
            Storage.removeFromPlaylist(this.props.videoData.origin.url, id);
        }
    }
    downloadSource(src : VideoTypes.VideoSource) {
        var file = Tools.merge(src.dlsrc || { src: src.src, type: src.type, filename: null }, { label: src.label });
        if (file.type.indexOf("application/") == -1) {
            var dlData = { url: file.src, fileName: "" };
            var label = file.label;
            dlData.fileName = file.filename || (this.props.videoData.title + "." + file.type.substr(file.type.indexOf("/") + 1)).replace(/[/\\?%*:|"<>]/g, ' ').trim();
            if (label) {
                dlData.fileName = "[" + label + "]" + dlData.fileName;
            }
            console.log(dlData);
            Background.downloadFile(dlData);
        } else {
            Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
        }
    }
    downloadTrack(label : string) {
        let trackSrc = this.props.videoData.tracks.find(function(src : VideoTypes.SubtitleSource) {
            return label == src.label;
        });
        if (trackSrc) {
            let filename = "["+trackSrc.label+"]"+this.props.videoData.title+".vtt".replace(/[/\\?%*:|"<>]/g, ' ').trim();
            Background.downloadFile({ url: trackSrc.src, fileName: filename });
        }
    }
    setupSrtSelector() {

        this.srtSelector.type = "file";
        this.srtSelector.accept = ".vtt, .srt, .txt";
        this.srtSelector.style.display = "none";
        this.srtSelector.addEventListener("change", () => {
            var collection = new FileReader;
            collection.onload = () => {
                let result = collection.result as string;
                if (result.indexOf("-->") !== -1) {
                    this.player!.addTextTrack("captions", this.srtSelector.files![0].name, "AddedFromUser");
                    var track = this.player!.textTracks()[this.player!.textTracks().length - 1];
                    parseSrt(result, function(cue) {
                        track.addCue(cue);
                    });
                } else {
                    Background.alert("Invaid subtitle file");
                }
            };
            collection.readAsText(this.srtSelector.files![0], "ISO-8859-1");
        });
    }
    async playerReady() {
        this.player!.execute = this.execute.bind(this);

        this.player!.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
        (this.player!.el() as HTMLElement).style.width = "100%";
        (this.player!.el() as HTMLElement).style.height = "100%";
        let ControlBar = this.player!.getChild('controlBar');
        if(!ControlBar) {
            throw new Error("Control bar is missing!");
        }
        var DownloadButton = ControlBar.addChild('vjsDownloadButton', {});
        var PatreonButton = ControlBar.addChild('vjsPatreonButton', {});
        var FullscreenToggle = ControlBar.getChild('fullscreenToggle') as videojs.FullscreenToggle;
        var CaptionsButton = ControlBar.getChild('SubsCapsButton') as videojs.CaptionsButton;
        CaptionsButton.show();
        let playlists = await Storage.getPlaylists();
        playlists.splice(0,1);
        let activeIds = await Storage.getPlaylistsWithVideo(this.props.videoData.origin.url);
        let active = playlists.filter((el)=>{
            return activeIds.some((id)=>{
                return id == el.id;
            })
        });
        var PlaylistButton = ControlBar.addChild("vjsPlaylistButton",{ playlists: playlists, active: active });


        console.log("player is ready");
        this.player!.on("ratechange", () => {
            Analytics.playerEvent("PlaybackRate");
        });
        FullscreenToggle.on("click", () => {
            window.setTimeout(() => {
                if (Environment.browser() == Environment.Browsers.Chrome && !(document as any).fullscreen && this.player!.isFullscreen()) {
                    console.log("FULLSCREEN ERROR");
                    Analytics.fullscreenError(this.props.videoData.origin.url, (this.props.videoData.parent || {} as any).url)
                }
            }, 1000);
        });
        ControlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
        ControlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
        ControlBar.el().insertBefore(PlaylistButton.el(), FullscreenToggle.el());
        if(!this.props.isPopup && Page.isFrame()) {
            var TheaterButton = ControlBar.addChild('vjsTheatreButton', {});
            ControlBar.el().insertBefore(TheaterButton.el(), FullscreenToggle.el());
            this.player!.on("fullscreenchange", () => {
                if(this.player!.isFullscreen()) {
                    (TheaterButton.el() as HTMLElement).style.display = "none";
                }
                else {
                    (TheaterButton.el() as HTMLElement).style.removeProperty("display");
                }
            });
        }
        let volume = await Storage.getPlayerVolume();
        this.player!.volume(volume);
        this.player!.on('volumechange', () => {
            Storage.setPlayerVolume(this.player!.volume());
        });
        this.player!.one('loadedmetadata', () => {
            this.loadFromHistory();
        });
        this.player!.on("play",()=>{
            if(this.props.isPopup) {
                Analytics.videoFromHost(this.props.videoData.origin.url, this.props.videoData.parent!.icon);
            }
        });
        this.player!.el().addEventListener("mouseleave", () => {
            if (this.player!.currentTime() != 0) {
                this.saveToHistory();
            }
        });
        if(this.props.onError) {
            this.player!.on('error', () => {
                if(this.props.onError) {
                    this.props.onError(this.player!);
                }
            });
        }
        if(!this.props.isPopup) {
            this.player!.on('error', () => {
                if ((this.player! as any).readyState() == 0) {
                    //if(Response.status == 404 || Response.status == 400 || Response.status == 403) {

                    Analytics.hosterError(this.props.videoData.origin.name,{ msg: this.player!.error()!.message, url: this.props.videoData.origin.url });
                    //}
                    //document.location.replace(Hash.vidSiteUrl + (Hash.vidSiteUrl.indexOf("?") == -1 ? "?" : "&") + "ignoreRequestCheck=true");
                }
                else {
                    /*OVPlayer.player!.bigPlayButton.on("click", () => {
                        location.replace(this.props.videoData.origin.url);
                    });
                    OVPlayer.player!.bigPlayButton.addClass("reloadButton");*/
                }

            });
        }
        this.setVideoData(this.props.videoData);
        this.player!.controls(true);
    }
    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        return (
            <div data-vjs-player>
                <video
                    ref={ node => this.videoNode = node }
                    className="video-js vjs-big-play-centered"
                    preload="auto"
                ></video>
            </div>
        )
    }

    async appendTextTrack(rawTrack: VideoTypes.SubtitleSource) {
        let convertToTrack = (srcContent : string) => {
            if (srcContent.indexOf("-->") !== -1) {

                this.player!.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
                let track = this.player!.textTracks()[this.player!.textTracks().length - 1];
                if (rawTrack.default) {
                    track.mode = "showing";
                }
                parseSrt(srcContent, function(cue) {
                    track.addCue(cue);
                });

            } else {
                throw Error("Invaid subtitle file");
            }
        }
        try {
            let xhr = await Tools.createRequest({ url: rawTrack.src });
            convertToTrack(xhr.responseText);
        }
        catch(e) {
            let xhr = await Tools.createRequest({ url: Tools.removeRefererFromURL(rawTrack.src) });
            convertToTrack(xhr.responseText);
        }
    }
    getActiveVideoSource(): VideoTypes.VideoSource {
        for (let src of this.props.videoData.src) {
            if (this.player!.src().indexOf(src.src) == 0) {
                return src;
            }
        }
        throw new Error("No video source active!");
    }
    setVideoData(videoData: VideoTypes.VideoData) {


        this.player!.poster(videoData.poster);
        var srces = videoData.src;
        if (srces.length == 1) {
            this.player!.src(srces[0]);
        }
        else {
            let quality = this.player!.controlBar.addChild("vjsQualityButton", { sources: srces });
            let button = this.player!.controlBar.getChild("vjsTheatreButton")
                || this.player!.controlBar.getChild("fullscreenToggle");
            this.player!.controlBar.el().insertBefore(quality.el(), button!.el());
        }
        for (let track of videoData.tracks) {
            this.appendTextTrack(track);
            //player.addRemoteTextTrack(<any>track, true);
        }

    }
    async getVideoRefData() {
        let entry = await Storage.getPlaylistEntry(this.props.videoData.origin.url);
        return {
            poster: this.props.videoData.poster,
            title: this.props.videoData.title,
            origin: this.props.videoData.origin,
            parent: this.props.videoData.parent || (entry ? entry.data.parent : null),
            watched: this.player!.currentTime() == this.player!.duration() ? 0 : this.player!.currentTime(),
            duration: this.player!.duration()
        };
    }
    async saveToHistory() {
        let isEnabled = await Storage.isHistoryEnabled();
        if (isEnabled) {
            var videoData = await this.getVideoRefData();
            Storage.addToPlaylist(videoData, Storage.fixed_playlists.history.id);
        }
    }
    async loadFromHistory() {
        let entry = await Storage.getPlaylistEntry(this.props.videoData.origin.url)
        if (entry) {
            this.player!.currentTime(entry.data.watched);
        }

    }
}
function parseSrt(dataAndEvents: string, oncue: (cue: VideoTypes.VTTCue) => void) {

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
                startTime: 0,
                endTime: 0,
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
