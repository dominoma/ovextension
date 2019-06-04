import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class SpeedVidScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?speedvid\.[^\/,^\.]{2,}\/[^\/]+/i)
    }
    async document_start() {
        if (this.details.url.indexOf("sn-") != -1) {
            this.details.url = "https://www.speedvid.net/" + this.details.url.match(/sn\-([^\-]*)\-/i)![1];
        }
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.responseText;
        this.checkForSubtitles(HTML)

        if (xhr.status != 200 || HTML.indexOf("<Title>Watch </Title>") == -1) {
            throw Error("No Video!");
        }
        let image = Tools.matchNull(HTML, /image:'([^']*)'/);
        let src = HTML.match(/file: '([^']*)'/)![1];
        let title = Tools.matchNull(HTML, /div class="dltitre">([^<]*)<\/div>/);

        return {
            src: [{ src: src, type: "video/mp4", label: "SD" }],
            title: title,
            poster: image,
            tracks: []
        }
    }
}
export default class SpeedVid extends RedirectHost {
    getScripts() {
        return [SpeedVidScript];
    }
}
