import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

let _isBGPage = false;
export function declareBGPage(): void {
    _isBGPage = true;
}
export function getVidPlaySiteUrl(vidHash: VideoTypes.VideoData): string {
    return chrome.extension.getURL("/pages/videoplay/videoplay.html") + Tools.objToHash(vidHash);
}
export function getVideoSearchUrl(): string {
    return chrome.extension.getURL("/pages/videosearch/videosearch.html");
}
export function getVidPopupSiteUrl(vidHash: Object): string {
    return chrome.extension.getURL("/pages/videopopup/videopopup.html") + Tools.objToHash(vidHash);
}
export function getOptionsSiteUrl(): string {
    return chrome.extension.getURL("/pages/options/options.html");
}
export function getLibrarySiteUrl(): string {
    return chrome.extension.getURL("/pages/library/library.html");
}
export function getPatreonUrl() {
    return "https://www.patreon.com/join/openvideo?";
}
export function getHostSuggestionUrl() {
    return "https://youtu.be/rbeUGOkKt0o";
}
export function getErrorMsg(data: any) {
    return {
        version: getManifest().version,
        browser: browser(),
        data: data
    };
}
export function isExtensionPage(url: string): boolean {
    if (browser() == Browsers.Chrome) {
        return url.indexOf("chrome-extension://") != -1;
    }
    else {
        return url.indexOf("moz-extension://") != -1;
    }
}
export function getRoot(): string {
    return chrome.extension.getURL("");
}
export function isBackgroundScript(): boolean {
    return _isBGPage;
}
export function isContentScript() {
    return !isPageScript() && !isBackgroundScript();
}
export function isPageScript() {
    return chrome.storage == undefined;
}
export function getManifest(): any {
    return chrome.runtime.getManifest();
}
export function getID() {
    return chrome.runtime.id;
}
export const enum Browsers {
    Chrome = "chrome",
    Firefox = "firefox"
}
export function browser(): Browsers {
    if (navigator.userAgent.search("Firefox") != -1) {
        return Browsers.Firefox;
    }
    else if (navigator.userAgent.search("Chrome") != -1) {
        return Browsers.Chrome;
    }
    else {
        throw Error("User agent is neither chrome nor Firefox");
    }
}
