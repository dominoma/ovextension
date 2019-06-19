import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";

class FruitStreamsScript extends RedirectScript {
    constructor(hostname : string, url : string, parentUrl : string | null) {
        super(hostname, url, parentUrl,  /https?:\/\/(www\.)?(streamango|fruitstreams|streamcherry|fruitadblock|fruithosts)\.[^\/,^\.]{2,}\/(f|embed)\/.+/i)
    }
    async getVideoData() {
        function resolveVideo(hashCode: string, intVal: number) {
            let chars = "=/+9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA";
            let retVal = '';
            hashCode = hashCode.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            for (let hashIndex = 0; hashIndex < hashCode.length; hashIndex += 4) {
                let hashCharCode_0 = chars.indexOf(hashCode.charAt(hashIndex));
                let hashCharCode_1 = chars.indexOf(hashCode.charAt(hashIndex + 1));
                let hashCharCode_2 = chars.indexOf(hashCode.charAt(hashIndex + 2));
                let hashCharCode_3 = chars.indexOf(hashCode.charAt(hashIndex + 3));
                retVal = retVal + String.fromCharCode(((hashCharCode_0 << 0x2) | (hashCharCode_1 >> 0x4)) ^ intVal);
                if (hashCharCode_2 != 0x40) {
                    retVal = retVal + String.fromCharCode(((hashCharCode_1 & 0xf) << 0x4) | (hashCharCode_2 >> 0x2))
                }
                if (hashCharCode_3 != 0x40) {
                    retVal = retVal + String.fromCharCode(((hashCharCode_2 & 0x3) << 0x6) | hashCharCode_3)
                }
            }
            return retVal;
        }
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.responseText;
        this.checkForSubtitles(HTML);
        if (xhr.status != 200 || HTML.indexOf("We are unable to find the video you're looking for.") != -1) {
            throw Error("No Video!");
        }
        let funcParams = HTML.match(/src:d\('([^']*)',([^\)]*)/);
        let funcStr = funcParams![1];
        let funcInt = parseInt(funcParams![2]);

        let src = { type: "video/mp4", src: "https:" + resolveVideo(funcStr, funcInt), label: "SD" };
        let poster = Tools.matchNull(HTML, /poster="([^"]*)"/);
        let title = Tools.matchNull(HTML, /meta name="og:title" content="([^"]*)"/);

        let subtitles = Tools.getTracksFromHTML(HTML);

        return { src: [src], poster: poster, title: title, tracks: subtitles };
    }
}
export default class FruitStreams extends RedirectHost {
    getScripts() {
        return [FruitStreamsScript];
    }
}
