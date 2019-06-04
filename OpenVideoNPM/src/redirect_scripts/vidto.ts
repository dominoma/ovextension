import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class VidToScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?vidto\.[^\/,^\.]{2,}\//i)
    }
    async document_start() {
        if (this.details.url.indexOf("embed-") == -1 && this.details.url.indexOf(".html") != -1) {
            this.details.url = this.details.url.replace(/vidto\.[^\/,^\.]{2,}\//, "vidto.me/embed-");
        }
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.responseText;
        if (xhr.status != 200 || HTML.indexOf("File Does not Exist, or Has Been Removed") != -1) {
            throw Error("No Video!");
        }
        this.checkForSubtitles(HTML);
        let playerHashStr = "{" + HTML.match(/\.setup\(\{(.*)duration:/)![1] + "}";

        let sources = playerHashStr.match(/sources:(.*\}\]),/)![1];
        sources = sources.replace(/file:/g, '"src":');
        sources = sources.replace(/label:/g, '"label":');
        let srcObj = JSON.parse(sources);
        srcObj[0].default = true;
        let image = Tools.matchNull(playerHashStr, /image: "([^"]*)"/);
        return {
            src: srcObj,
            title: "VidTo.me video",
            poster: image,
            tracks: []
        };
    }
}
export default class VidTo extends RedirectHost {
    getScripts() {
        return [VidToScript];
    }
}
