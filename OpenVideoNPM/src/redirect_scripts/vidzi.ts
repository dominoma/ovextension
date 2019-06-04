import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class VidziScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?vidzi\.[^\/,^\.]{2,}\/.+/i)
    }
    async document_start() {
        if (this.details.url.indexOf("embed-") != -1) {
            if (this.details.url.indexOf("-") == this.details.url.lastIndexOf("-")) {
                this.details.url = this.details.url.replace("embed-", "");
            }
            else {
                this.details.url = "https://www.vidzi.tv/" + this.details.url.match(/embed\-([^\-]*)\-/)![1];
            }
            console.log(this.details.url);
        }
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.responseText;
        this.checkForSubtitles(HTML);

        if (xhr.status != 200 || HTML.indexOf("file was deleted") != -1 || HTML.indexOf("yt-uix-form-textarea share-embed-code") == -1) {
            throw Error("No Video!");
        }
        let videoHash = HTML.match(/jwplayer\("vplayer"\)\.setup\(\{(.*)\}\);/)![1];
        let image = Tools.matchNull(videoHash, /image: "([^"]*)"/);
        let src = videoHash.match(/sources: \[\{file: "([^"]*)"/)![1];
        let title = Tools.matchNull(HTML, /<title>([<"]*)<\/title>/i);

        return {
            src: [{ src: src, type: "application/x-mpegURL", label: "SD" }],
            title: title,
            poster: image,
            tracks: []
        }
    }
}
export default class Vidzi extends RedirectHost {
    getScripts() {
        return [VidziScript];
    }
}
