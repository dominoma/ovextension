
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";
import * as Storage from "OV/storage";
import * as Page from "OV/page";
import * as Tools from "OV/tools";

import * as Background from "./background";

function toDataURL(url: string): Promise<string> {
    return Tools.createRequest({
        url: url, beforeSend: function(xhr) {
            xhr.responseType = 'blob';
        }
    }).then(function(xhr) {
        return new Promise<string>(function(resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function() {
                resolve("url(" + reader.result + ")");
            }
            reader.readAsDataURL(xhr.response);
        });
    });
}
export interface PlayerStyle {
    doChange: boolean;
    color: string;
    playimage: string;
    playhoverimage: string;
}
export function requestPlayerCSS() {
    return Background.toTopWindow({ func: "requestPlayerCSS", data: {} }).then(function(response) {
        return response.data as PlayerStyle;
    });
}
export function setup() {
    Page.isReady().then(function(event) {
        let ovtags = document.getElementsByTagName("openvideo");
        if (ovtags.length > 0) {
            let ovtag = ovtags[0] as HTMLElement;
            ovtag.innerText = Environment.getManifest().version;


            /*var reloadimage = null;
        if(ovtag.attributes.reloadimage) {
            reloadimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadimage.value, async: false}).response)+")";
        }
        var reloadhoverimage = null;
        if(ovtag.attributes.reloadhoverimage) {
            reloadhoverimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadhoverimage.value, async: false}).response)+")";
        }*/

            let metadata: PlayerStyle = null;
            Messages.addListener({
                requestPlayerCSS: function(request, sendResponse) {
                    if (metadata) {
                        sendResponse(metadata);
                    }
                    else {
                        Promise.all([toDataURL(ovtag.getAttribute("playimage")), toDataURL(ovtag.getAttribute("playhoverimage"))]).then(function(dataURLs) {
                            metadata = { doChange: true, color: ovtag.getAttribute("color"), playimage: dataURLs[0], playhoverimage: dataURLs[1] };
                            sendResponse(metadata);
                        });
                    }
                }
            });
            //alert("W2")
            ovtag.dispatchEvent(new Event("ov-metadata-received"));
        }
    });
}