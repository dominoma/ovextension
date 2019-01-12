import * as Tools from "./tools";
import * as VideoTypes from "./../video_types";
 
let _isBGPage = false;
export function declareBGPage() : void {
    _isBGPage = true;
}
export function getVidPlaySiteUrl(vidHash: VideoTypes.VideoData) : string {
    return chrome.extension.getURL("/pages/videoplay/videoplay.html")+Tools.objToHash(vidHash);
}
export function getVideoSearchUrl() : string {
    return chrome.extension.getURL("/pages/videosearch/videosearch.html");
}
export function getVidPopupSiteUrl(vidHash: Object) : string {
    return chrome.extension.getURL("/pages/videopopup/videopopup.html")+Tools.objToHash(vidHash);
}
export function getOptionsSiteUrl() : string {
    return chrome.extension.getURL("/pages/options/options.html");
}
export function getLibrarySiteUrl() : string {
    return chrome.extension.getURL("/pages/library/library.html");
}
export function getErrorMsg(data : any) {
    return {
        version: getManifest().version,
        browser: browser(),
        data: data
    };
}
export function isExtensionPage(url: string) : boolean {
    if(browser() == Browsers.Chrome) {
        return url.indexOf("chrome-extension://") != -1;
    }
    else {
        return url.indexOf("moz-extension://") != -1;
    }
}
export function getRoot() : string {
    return chrome.extension.getURL("");
}
export function isBackgroundPage() : boolean {
    return _isBGPage;
}
export function getManifest() : any {
    return chrome.runtime.getManifest();
}
export const enum Browsers {
    Chrome = "chrome",
    Firefox = "firefox"
}
export function browser() : Browsers {
    if(navigator.userAgent.search("Firefox") != -1) {
        return Browsers.Firefox;
    }
    else if(navigator.userAgent.search("Chrome") != -1) {
        return Browsers.Chrome;
    }
    else {
        throw Error("User agentis neither chrome nor Firefox");
    }
}