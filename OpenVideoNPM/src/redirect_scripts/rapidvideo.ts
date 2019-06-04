import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";
import * as VideoTypes from "video_types";

class RapidVideoScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?rapidvideo\.[^\/,^\.]{2,}\/(\?v=[^&\?]*|e\/.+|v\/.+)/i)
    }
    async document_start() {
        this.details.url = this.details.url.replace(/(\/?\?v=|\/v\/)/i, "/e/").replace(/[&\?]q=?[^&\?]*/i, "").replace(/[&\?]autostart=?[^&\?]*/i, "");
        let parser = new DOMParser();
        interface VideoInfo {
            title: string;
            poster: string;
            tracks: VideoTypes.SubtitleSource[];
            urls: string[];
        }
        function checkResponse(xhr: XMLHttpRequest) {
            if (xhr.response.indexOf("To continue, please type the characters below") != -1) {
                location.href = Tools.addParamsToURL(location.href, { ovignore: "true" });
            }
        }
        let getVideoInfo = async () => {
            let xhr = await Tools.createRequest({ url: this.details.url, referer: this.details.url });
            checkResponse(xhr);
            this.checkForSubtitles(xhr.response);
            let html = parser.parseFromString(xhr.response, "text/html");
            let title = html.title;
            let videoTag = html.getElementsByTagName("video")[0];
            let poster = videoTag.poster;
            let tracksHTML = videoTag.getElementsByTagName("track");
            let tracks = [];
            for (let track of tracksHTML) {
                tracks.push({ src: track.src, label: track.label, kind: track.kind, default: track.default });
            }
            let urlsHTML = html.querySelectorAll('a[href*="https://www.rapidvideo.com/e/"]') as NodeListOf<HTMLAnchorElement>;
            let urls: string[] = [];
            for (let url of urlsHTML) {
                urls.push(url.href);
            }
            if (urls.length == 0) {
                urls.push(this.details.url);
            }
            return { title: title, poster: poster, tracks: tracks, urls: urls };
        }
        let getVideoSrc = async (url: string) => {
            let xhr = await Tools.createRequest({ url: url, referer: this.details.url });
            checkResponse(xhr);
            let html = parser.parseFromString(xhr.response, "text/html");
            let source = html.getElementsByTagName("source")[0];
            return {
                src: source.src,
                label: source.title,
                type: source.type,
                res: parseInt(source.dataset.res!)
            } as VideoTypes.VideoSource;
        }
        async function getVideoSrces(info: VideoInfo) {
            let videos = await Promise.all(info.urls.map(getVideoSrc));
            videos[videos.length - 1].default = true;
            return { src: videos, poster: info.poster, title: info.title, tracks: info.tracks } as VideoTypes.VideoData;
        }
        let info = await getVideoInfo();
        let srces = await getVideoSrces(info);
        return srces;
    }
}
export default class RapidVideo extends RedirectHost {
    getScripts() {
        return [RapidVideoScript];
    }
}
