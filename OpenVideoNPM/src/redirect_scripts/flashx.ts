import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class FlashXScript extends RedirectScript {
    constructor(hostname : string, url : string) {
        super(hostname, url, /https?:\/\/(www\.)?flashx\.[^\/,^\.]{2,}\/(embed.php\?c=(.*)|(.*)\.jsp|playvideo\-(.*)\.html\?playvid)/i)
    }
    async getVideoData() {
        let getVideoCode = async () => {
            if (this.details.match[5]) {
                return this.details.match[5];
            }
            else {
                await Promise.all([
                    Tools.createRequest({ url: "https://flashx.co/counter.cgi", hideRef: true }),
                    Tools.createRequest({ url: "https://flashx.co/flashx.php?f=fail&fxfx=6", hideRef: true })
                ]);
                return this.details.match[3] || this.details.match[4];
            }
        }
        let videoCode = await getVideoCode();
        let xhr = await Tools.createRequest({ url: "https://flashx.co/playvideo-" + videoCode + ".html?playvid", hideRef: true });
        let HTML = xhr.responseText;

        this.checkForSubtitles(HTML);

        if (xhr.status != 200 || HTML.indexOf("Sorry, file was deleted or the link is expired!") != -1) {
            throw Error("No Video!");
        }

        let srcHashStr = HTML.match(/updateSrc\(([^\)]*)\)/)![1];
        srcHashStr = srcHashStr.substr(0, srcHashStr.lastIndexOf(",")) + "]";
        srcHashStr = srcHashStr.replace(/src:/g, '"src":');
        srcHashStr = srcHashStr.replace(/label:/g, '"label":');
        srcHashStr = srcHashStr.replace(/res:/g, '"res":');
        srcHashStr = srcHashStr.replace(/type:/g, '"type":');
        srcHashStr = srcHashStr.replace(/'/g, '"');
        console.log(srcHashStr)
        let src = JSON.parse(srcHashStr);
        let poster = Tools.matchNull(HTML, /poster="([^"]*)"/);

        return {
            src: [{ src: src[0].src, type: src[0].type, label: "SD" }],
            poster: poster,
            tracks: [],
            title: "FlashX Video"
        };
    }
}
export default class FlashX extends RedirectHost {
    getScripts() {
        return [FlashXScript];
    }
}
