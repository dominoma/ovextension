import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";
import * as Page  from "OV/page";
import * as VideoTypes from "video_types";

class MyCloudScript extends RedirectScript {
    constructor(hostname : string, url : string) {
        super(hostname, url, /https?:\/\/(www\.)?mcloud\.[^\/,^\.]{2,}\/embed\/.+/i)
    }

    get runAsContentScript() {
        return true;
    }

    async getVideoData() {

        await Page.isReady();

        let HTML = document.documentElement.innerHTML;
        let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
        let rawsrces = JSON.parse(HTML.match(/sources: (\[\{.*\}\])/)![1]);
        let srces: VideoTypes.VideoSource[] = [];
        for (let src of rawsrces) {
            srces.push({ src: src.file, type: "application/x-mpegURL", label: "SD" });
        };
        let poster = Tools.matchNull(HTML, /image: '([^']*)'/);


        let trackFile = Tools.getParamFromURL(this.details.url, "sub.file");
        let trackLabel = Tools.getParamFromURL(this.details.url, "sub.label") || "English";
        return {
            src: srces,
            poster: poster,
            title: title,
            tracks: trackFile ? [{ src: decodeURIComponent(decodeURIComponent(trackFile)), label: trackLabel, kind: "Captions", default: true }] : []
        };
    }
}
export default class MyCloud extends RedirectHost {
    getScripts() {
        return [MyCloudScript];
    }
}
