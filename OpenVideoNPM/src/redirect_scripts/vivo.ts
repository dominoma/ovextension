import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class VivoScript extends RedirectScript {
    constructor(hostname : string, url : string) {
        super(hostname, url, /https?:\/\/(www\.)?vivo\.[^\/,^\.]{2,}\/.+/i)
    }
    async getVideoData() {
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.response;
        this.checkForSubtitles(HTML);
        let videoURL = atob(HTML.match(/data-stream="([^"]*)"/)[1]);
        let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);

        return {
            src: [{ type: "video/mp4", src: videoURL, label: "SD" }],
            title: title,
            tracks: [],
            poster: ""
        };
    }
}
export default class Vivo extends RedirectHost {
    getScripts() {
        return [VivoScript];
    }
}
