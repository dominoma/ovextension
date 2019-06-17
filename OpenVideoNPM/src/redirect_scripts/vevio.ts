import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";
import * as Page from "OV/page";

class VevIOScript extends RedirectScript {
    constructor(hostname : string, url : string) {
        super(hostname, url, /https?:\/\/(www\.)?vev\.[^\/,^\.]{2,}\/.+/i)
    }
    get runAsContentScript() {
        return true;
    }
    async getVideoData() {
        let getVideoCode = async () => {
            if (this.details.url.indexOf("embed") == -1) {

                let xhr = await Tools.createRequest({ url: this.details.url, hideRef: true })
                if (xhr.response.indexOf('class="video-main"') != -1) {
                    return this.details.url.substr(this.details.url.lastIndexOf("/"));
                }
                else {
                    throw Error("Not a Video!");
                }
            }
            else {
                return this.details.url.substr(this.details.url.lastIndexOf("/") + 1);
            }
        }
        let videoCode = await getVideoCode();
        let xhrs = await Promise.all([
            Page.injectFunction((sendMsg)=>{
                let open = XMLHttpRequest.prototype.open as any;
                XMLHttpRequest.prototype.open = function(method : string, url : string) {
                    if(method == "POST" && url.indexOf("/api/serve/video") != -1) {
                        this.addEventListener("readystatechange", ()=>{
                            if(this.readyState == 4) {
                                sendMsg(JSON.parse(this.response));
                            }
                        })
                    }
                    return open.apply(this, arguments);
                }
            }),
            Tools.createRequest({ url: "https://vev.io/api/serve/video/" + videoCode, hideRef: true })
        ]);

        let videoJSON = xhrs[0];
        let videoDesc = JSON.parse(xhrs[1].response);

        let srces: VideoTypes.VideoSource[] = [];
        for (let key in videoJSON.qualities) {
            srces.push({ label: key, src: videoJSON.qualities[key], type: "video/mp4" });
        }
        srces = srces.reverse();
        srces[0].default = true;
        return {

            src: srces,
            poster: videoJSON.poster,
            tracks: videoJSON.subtitles,
            title: videoDesc.video.title

        };
    }
}
export default class VevIO extends RedirectHost {
    getScripts() {
        return [VevIOScript];
    }
}
