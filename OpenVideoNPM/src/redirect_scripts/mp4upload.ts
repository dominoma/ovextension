import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";

class MP4UploadScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?mp4upload\.[^\/,^\.]{2,}\/embed\-.+/i)
    }
    async document_start() {
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.response;
        this.checkForSubtitles(HTML);
        if (HTML.indexOf("File was deleted") != -1) {
            throw Error("No Video!");
        }
        let evalStr = HTML.match(/(eval\(function\(p,a,c,k,e,d\).*\.split\('\|'\)\)\))/)[1];
        let code = Tools.unpackJS(evalStr);
        let src = code.match(/player\.src\("([^"]*)"/)![1];
        let poster = code.match(/player\.poster\("([^"]*)"/)![1];

        return {
            src: [{ type: "video/mp4", src: src, label: "SD" }],
            poster: poster,
            title: "MP4Upload Video",
            tracks: []
        };
    }
}
export default class MP4Upload extends RedirectHost {
    getScripts() {
        return [MP4UploadScript];
    }
}
