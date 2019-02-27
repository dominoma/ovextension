
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";
import * as Storage from "OV/storage";
import * as Page from "OV/page";
import * as Tools from "OV/tools";

import * as Background from "./background";

async function toDataURL(url: string) {
    let xhr = await Tools.createRequest({
        url: url, beforeSend: function(xhr) {
            xhr.responseType = 'blob';
        }
    });
    return new Promise<string>(function(resolve, reject) {
        var reader = new FileReader();
        reader.onloadend = function() {
            resolve("url(" + reader.result + ")");
        }
        reader.onerror = function() {
            reject(reader.error);
        }
        reader.readAsDataURL(xhr.response);
    });
}
export interface PlayerStyle {
    doChange: boolean;
    color: string;
    playimage: string;
    playhoverimage: string;
}
export async function requestPlayerCSS() {
    let response = await Background.toTopWindow({ func: "metadata_requestPlayerCSS", data: {} });
    return response.data as PlayerStyle | null;
}
export async function setup() {
    await Page.isReady();
    let ovtags = document.getElementsByTagName("openvideo");
    let metadata: PlayerStyle | null = null;
    Messages.addListener({
        metadata_requestPlayerCSS: async function(request) {
            if (ovtags.length > 0) {
                if (metadata) {
                    return metadata;
                }
                else {
                    let ovtag = ovtags[0] as HTMLElement;
                    if(!ovtag.hasAttribute("playimage") || !ovtag.hasAttribute("playhoverimage")) {
                        throw Error("The openvideo tag has a wrong format!");
                    }
                    let dataURLs = await Promise.all([toDataURL(ovtag.getAttribute("playimage")!), toDataURL(ovtag.getAttribute("playhoverimage")!)]);
                    return { doChange: true, color: ovtag.getAttribute("color"), playimage: dataURLs[0], playhoverimage: dataURLs[1] };
                }
            }
            else {
                return null;
            }
        }
    });
    if (ovtags.length > 0) {
        let ovtag = ovtags[0] as HTMLElement;
        ovtag.innerText = Environment.getManifest().version;
        ovtag.dispatchEvent(new Event("ov-metadata-received"));
    }

}
