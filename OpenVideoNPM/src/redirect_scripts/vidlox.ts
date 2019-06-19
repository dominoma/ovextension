import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class VidLoxScript extends RedirectScript {
    constructor(hostname : string, url : string, parentUrl : string | null) {
        super(hostname, url, parentUrl,  /https?:\/\/(www\.)?vidlox\.[^\/,^\.]{2,}\/embed\-.+/i)
    }
    async getVideoData() {
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.response;
        this.checkForSubtitles(HTML);
        console.log(HTML);
        let src = JSON.parse(HTML.match(/sources: (\[.*\]),/)[1])[0];
        //let title = HTML.match(/<title>([<"]*)<\/title>/i)[1];
        let poster = Tools.matchNull(HTML, /poster: "([^"]*)"/);
        return {
            src: [{ type: "application/x-mpegURL", src: src, label: "SD" }],
            poster: poster,
            title: "VidLox Video",
            tracks: []
        };
    }
}
export default class VidLox extends RedirectHost {
    getScripts() {
        return [VidLoxScript];
    }
}
