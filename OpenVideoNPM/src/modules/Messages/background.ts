
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";
import * as Analytics from "OV/analytics";
import {StringMap} from "OV/types";

import {getRedirectHosts} from "redirect_scripts_base";


interface OpenTab {
    url: string;
}

interface SetIconPopup {
    url?: string;
}

interface SetIconText {
    text?: string;
}

interface DownloadFile {
    url: string;
    fileName: string;
}

interface Alert {
    msg: string;
}

interface Promt extends Alert {
    fieldText: string;
}

export function toTopWindow(msg: { data: any, func: string }) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTopWindow", data: {} } });
}
export function toActiveTab(msg: { data: any, func: string }) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toActiveTab", data: {} } });
}
export function toTab(msg: { data: any, func: string, query: chrome.tabs.QueryInfo }) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTab", data: msg.query } });
}
export function openTab(url: string) {
    return Messages.send({ bgdata: { func: "openTab", data: { url: url } } });
}
export function pauseAllVideos() {
    return Messages.send({ bgdata: { func: "pauseAllVideos", data: {} } });
}
export function setIconPopup(url?: string) {
    return Messages.send({ bgdata: { func: "setIconPopup", data: { url: url } } });
}
export function setIconText(text?: string) {
    return Messages.send({ bgdata: { func: "setIconText", data: { text: text } } });
}
export function downloadFile(dl: DownloadFile) {
    return Messages.send({ bgdata: { func: "downloadFile", data: dl } });
}
export function analytics(data: StringMap) {
    return Messages.send({ bgdata: { func: "analytics", data: data } });
}
export function redirectHosts() {
    return Messages.send({ bgdata: { func: "redirectHosts", data: {} } });
}
export function alert(msg: string) {
    if(Environment.browser() == Environment.Browsers.Chrome) {
        Messages.send({ bgdata: { func: "alert", data: { msg: msg } } });
    }
    else {
        window.alert(msg);
    }
}
export function prompt(data: Promt) {
    if(Environment.browser() == Environment.Browsers.Chrome) {
        return Messages.send({ bgdata: { func: "prompt", data: data } }).then(function(response) {
            return { aborted: response.data.aborted, text: response.data.text };
        });
    }
    else {
        let value = window.prompt(data.msg, data.fieldText);
        return Promise.resolve({ aborted: !value, text: value });
    }
}
export function sendMessage(tabid: number, msg: { func: string; data: any; }) {
    return new Promise(function(response, reject) {
        chrome.tabs.sendMessage(tabid, {
            func: msg.func,
            data: msg.data,
            state: Messages.State.BGToMdw,
            sender: { url: location.href },
        } as Messages.Request, {
                frameId: 0
            }, function(resData: Messages.Response) {
                response(resData);
            });
    });
}

export function setup() {
    Messages.setupBackground({
        toTopWindow: function(msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.sendMessage(tabid, msg, { frameId: 0 }, function(resData: Messages.Response) {

                sendResponse(resData.data);

            });
        },
        toActiveTab: function(msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.query({ active: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, { frameId: 0 }, function(resData: Messages.Response) {
                    if (resData) {
                        sendResponse(resData.data);
                    }
                });
            });
        },
        toTab: function(msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.query(bgdata, function(tabs: chrome.tabs.Tab[]) {
                chrome.tabs.sendMessage(tabs[0].id, msg, function(resData: Messages.Response) {
                    if (resData) {
                        sendResponse(resData.data);
                    }
                });
            });
        },
        openTab: function(msg, bgdata: OpenTab, sender, sendResponse) {
            chrome.tabs.create({ url: bgdata.url });
        },
        pauseAllVideos: function(msg, bgdata, sender, sendResponse) {
            chrome.tabs.sendMessage(sender.tab.id, { func: "pauseVideos" });
        },
        setIconPopup: function(msg, bgdata: SetIconPopup, sender, sendResponse) {
            chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: (bgdata && bgdata.url) ? bgdata.url : "" });
        },
        setIconText: function(msg, bgdata: SetIconText, sender, sendResponse) {
            chrome.browserAction.setBadgeText({ text: (bgdata && bgdata.text) ? bgdata.text : "", tabId: sender.tab.id });
        },
        downloadFile: function(msg, bgdata: DownloadFile, sender, sendResponse) {
            chrome.downloads.download({ url: bgdata.url, saveAs: true, filename: bgdata.fileName });
        },
        analytics: function(msg, bgdata: StringMap, sender, sendResponse) {
            if(bgdata["el"]) {
                bgdata["el"] = bgdata["el"].replace("<PAGE_URL>", sender.tab.url);
            }
            console.log(bgdata)
            Analytics.postData(bgdata);
        },
        redirectHosts: function(msg, bgdata, sender, sendResponse) {
            getRedirectHosts().then(function(redirectHosts) {
                sendResponse({ redirectHosts: redirectHosts });
            });
        },
        alert: function(msg, bgdata: Alert, sender, sendResponse) {
            window.alert(bgdata.msg);
        },
        prompt: function(msg, bgdata: Promt, sender, sendResponse) {
            var value = window.prompt(bgdata.msg, bgdata.fieldText);

            if (value == null || value == "") {
                sendResponse({ aborted: true, text: null });
            } else {
                sendResponse({ aborted: false, text: value });
            }
        }
    });
}