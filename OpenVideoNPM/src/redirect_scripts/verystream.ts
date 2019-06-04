import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";

class VeryStreamScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?(verystream)\.[^\/,^\.]{2,}\/e\/([a-zA-Z0-9]*)/i)
    }
    async document_start() {
        let xhr = await Tools.createRequest({
            url: this.details.url,
            hideRef: true
        });
        let html = xhr.response;
        this.checkForSubtitles(html);

        let videoLink = html.match(/<p.*id="videolink".*>([^<]*)<\/p>/)[1];

        let src = {
            src: "/gettoken/"+videoLink+"?mime=true",
            type: "video/mp4",
            label: "SD"
        }
        let title = Tools.matchNull(html, /<meta.*name="og:title".*content="([^"]*)".*>/);
        let poster = Tools.matchNull(html, /<video.*poster="([^"]*)".*>/);

        return {

            src: [src],
            tracks: [],
            title: title || "",
            poster: poster || ""
        };
    }
}
export default class VeryStream extends RedirectHost {
    getScripts() {
        return [VeryStreamScript];
    }
}
