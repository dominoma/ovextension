import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as Page from "OV/page";

class StreamCloudScript extends RedirectScript {
    constructor(hostname : string) {
        super(hostname, /https?:\/\/(www\.)?streamcloud\.[^\/,^\.]{2,}\/([^\.]+)(\.html)?/i)
    }
    get hidePage() {
        return false;
    }
    async document_idle() {
        let button = document.getElementsByName('imhuman')[0];
        if (button == undefined) {
            throw new Error("No Video!");
        }
        await Page.awaitAttributeValue(button, "class", "button gray blue");
        let xhr = await Tools.createRequest({
            url: this.details.url,
            type: Tools.HTTPMethods.POST,
            protocol: "http://",
            formData: {
                op: "download1",
                id: this.details.match[2].match(/([^\/]*)(\/.*)?/)![1]
            }
        });


        let HTML = xhr.response;
        this.checkForSubtitles(HTML);

        let videoHashStr = HTML.match(/jwplayer\("mediaplayer"\)\.setup\(([^\)]*)/)[1];
        let src = videoHashStr.match(/file: "([^"]*)"/)[1];
        let poster = Tools.matchNull(videoHashStr, /image: "([^"]*)"/);
        let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
        return {

            src: [{
                type: "video/mp4",
                src: src,
                label: "SD"
            }],
            title: title,
            poster: poster,
            tracks: []
        };
    }
}
export default class StreamCloud extends RedirectHost {
    getScripts() {
        return [StreamCloudScript];
    }
}
