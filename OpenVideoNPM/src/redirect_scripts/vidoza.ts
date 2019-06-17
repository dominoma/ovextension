import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class VidozaScript extends RedirectScript {
    constructor(hostname : string, url : string) {
        super(hostname, url, /https?:\/\/(www\.)?vidoza\.[^\/,^\.]{2,}\/.+/i)
    }
    async getVideoData() {
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.response;
        this.checkForSubtitles(HTML);

        if (this.details.url.indexOf("/embed") == -1) {
            if (HTML.indexOf("videojs('player')") == -1) {
                throw Error("No Video!");
            }
            else {
                location.href = location.href.replace("vidoza.net/", "vidoza.net/embed-").replace(/\.html.*/, ".html");
                throw Error("No embed Video! Redirecting...");
            }
        }
        else {
            let rawsources = JSON.parse(HTML.match(/sourcesCode: (\[\{.*\}\])/)[1].replace(/src:/g, '"src":').replace(/type:/g, '"type":').replace(/label:/g, '"label":').replace(/res:/g, '"res":'));
            let sources: VideoTypes.VideoSource[] = [];
            for (let src of rawsources) {
                sources.push({ src: src.src, label: src.res, type: src.type });
            }
            let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
            let poster = Tools.matchNull(HTML, /poster: "([^"]*)"/);
            return {
                src: sources,
                poster: poster,
                title: title,
                tracks: []
            };
        }
    }
}
export default class Vidoza extends RedirectHost {
    getScripts() {
        return [VidozaScript];
    }
}
