import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";

class OpenLoadScript extends RedirectScript {
    constructor(hostname : string, url : string, parentUrl : string | null) {
        super(hostname, url, parentUrl,  /https?:\/\/(www\.)?(openload|oload)\.[^\/,^\.]{2,}\/(embed|f)\/.+/i);
    }
    async getVideoData() {
        if (this.details.url.indexOf("openload.co") == -1) {
            this.details.url = this.details.url.replace(/(openload|oload)\.[^\/,^\.]{2,}/, "oload.services");
        }

        if (this.details.url.indexOf("/f/") != -1) {
            this.details.url = this.details.url.replace("/f/", "/embed/");
        }

        function getStreamUrl(longString: string, varAtbytes: number, varAt_1x4bfb36: number): string {
            let streamUrl = "";
            let hexByteArr = [];
            for (let i = 0; i < 9 * 8; i += 8) {
                hexByteArr.push(parseInt(longString.substring(i, i + 8), 16));
            }
            longString = longString.substring(9 * 8);
            let iterator = 0;
            for (let arrIterator = 0; iterator < longString.length; arrIterator++) {
                let maxHex = 64;
                let value = 0;
                let currHex = 255;
                for (let byteIterator = 0; currHex >= maxHex; byteIterator += 6) {
                    if (iterator + 1 >= longString.length) {
                        maxHex = 0x8F;
                    }
                    currHex = parseInt(longString.substring(iterator, iterator + 2), 16);
                    value += (currHex & 63) << byteIterator;
                    iterator += 2;
                }
                let bytes = value ^ hexByteArr[arrIterator % 9] ^ varAtbytes ^ varAt_1x4bfb36;
                let usedBytes = maxHex * 2 + 127;
                for (let i = 0; i < 4; i++) {
                    let urlChar = String.fromCharCode(((bytes & usedBytes) >> 8 * i) - 1);
                    if (urlChar != "$") {
                        streamUrl += urlChar;
                    }
                    usedBytes = usedBytes << 8;
                }
            }
            //console.log(streamUrl)
            return streamUrl;
        }

        console.log(this.details.url);
        let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true });
        let HTML = xhr.responseText;

        this.checkForSubtitles(HTML)

        console.log(xhr.responseURL);
        if (xhr.status != 200 || HTML.indexOf("We can't find the file you are looking for. It maybe got deleted by the owner or was removed due a copyright violation.") != -1 || HTML.indexOf("The file you are looking for was blocked.") != -1) {
            console.log(xhr.status, HTML)
            throw Error("No Video");
        }

        let thumbnailUrl = Tools.matchNull(HTML, /poster="([^"]*)"/);
        let title = Tools.matchNull(HTML, /meta name="og:title" content="([^"]*)"/);


        let subtitles = Tools.getTracksFromHTML(HTML);

        console.log(HTML);
        let longString = HTML.match(/<p[^>]*>([^<]*)<\/p>/)![1];
        console.log(longString)

        let keyNum1 = HTML.match(/\_0x45ae41\[\_0x5949\('0xf'\)\]\(_0x30725e,(.*)\),\_1x4bfb36/)![1];
        let keyNum2 = HTML.match(/\_1x4bfb36=(.*);/)![1];

        let keyResult1 = 0;
        let keyResult2 = 0;
        //console.log(longString, keyNum1, keyNum2);
        try {
            let keyNum1_Oct = parseInt(keyNum1.match(/parseInt\('(.*)',8\)/)![1], 8);
            let keyNum1_Sub = parseInt(keyNum1.match(/\)\-([^\+]*)\+/)![1]);
            let keyNum1_Div = parseInt(keyNum1.match(/\/\(([^\-]*)\-/)![1]);
            let keyNum1_Sub2 = parseInt(keyNum1.match(/\+0x4\-([^\)]*)\)/)![1]);

            keyResult1 = (keyNum1_Oct - keyNum1_Sub + 4 - keyNum1_Sub2) / (keyNum1_Div - 8);

            let keyNum2_Oct = parseInt(keyNum2.match(/\('([^']*)',/)![1], 8);
            let keyNum2_Sub = parseInt(keyNum2.substr(keyNum2.indexOf(")-") + 2));

            keyResult2 = keyNum2_Oct - keyNum2_Sub;
            //console.log(keyNum1, keyNum2);

        }
        catch (e) {
            //console.error(e.stack);
            throw Error("Key Numbers not parsed!");
        }
        return {

            src: [{
                type: "video/mp4",
                src: "https://"
                + Tools.parseURL(this.details.url).host
                + "/stream/" + getStreamUrl(longString, keyResult1, keyResult2)
                + "?mime=true",
                label: "SD"
            }],
            poster: thumbnailUrl,
            title: title,
            tracks: subtitles

        };
    }
}
export default class OpenLoad extends RedirectHost {
    getScripts() {
        return [OpenLoadScript];
    }
}
