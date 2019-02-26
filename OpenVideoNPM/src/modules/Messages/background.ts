
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";


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

export function toTopWindow(msg: { data: any, func: string, frameId?: number }) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "background_toTopWindow", data: msg.frameId } });
}
export function toActiveTab(msg: { data: any, func: string, frameId?: number }) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "background_toActiveTab", data:  msg.frameId } });
}
export function toTab(msg: { data: any, func: string, query: chrome.tabs.QueryInfo }) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "background_toTab", data: msg.query } });
}
export function openTab(url: string) {
    return Messages.sendToBG({ func: "background_openTab", data: { url: url } });
}
export function setIconPopup(url?: string) {
    return Messages.sendToBG({ func: "background_setIconPopup", data: { url: url } });
}
export function setIconText(text?: string) {
    return Messages.sendToBG({ func: "background_setIconText", data: { text: text } });
}
export function downloadFile(dl: DownloadFile) {
    return Messages.sendToBG({ func: "background_downloadFile", data: dl });
}
export function alert(msg: string) {
    if (Environment.browser() == Environment.Browsers.Chrome) {
        Messages.sendToBG({ func: "background_alert", data: { msg: msg } });
    }
    else {
        window.alert(msg);
    }
}
export async function confirm(msg: string) {
    if (Environment.browser() == Environment.Browsers.Chrome && !Environment.isBackgroundScript()) {
        let response = await Messages.sendToBG({ func: "background_confirm", data: { msg: msg } });
        return response.data as boolean;
    }
    else {
        return window.confirm(msg);
    }
}
export async function prompt(data: Promt) {
    if (Environment.browser() == Environment.Browsers.Chrome && !Environment.isBackgroundScript()) {
        let response = await Messages.sendToBG({ func: "background_prompt", data: data });
        return { aborted: response.data.aborted, text: response.data.text };
    }
    else {
        let value = window.prompt(data.msg, data.fieldText);
        return Promise.resolve({ aborted: !value, text: value });
    }
}

export function setup() {
    Messages.setupBackground({
        background_toTopWindow: async function(msg, bgdata, sender) {
            if(!sender.tab || !sender.tab.id) {
                throw new Error("Can't send to top window. Tab id is unknown!");
            }
            var tabid = sender.tab.id;
            return Messages.sendToTab(tabid, msg, bgdata);
        },
        background_toActiveTab: async function(msg, bgdata, sender) {
            chrome.tabs.query({ active: true }, function(tabs) {
                if(!tabs[0].id) {
                    throw Error("No active tab found!");
                }
                return Messages.sendToTab(tabs[0].id, msg, bgdata);
            });
        },
        background_toTab: async function(msg, bgdata, sender) {
            chrome.tabs.query(bgdata, function(tabs: chrome.tabs.Tab[]) {
                if(!tabs[0].id) {
                    throw Error("No active tab found!");
                }
                chrome.tabs.sendMessage(tabs[0].id, msg, function(resData: Messages.Response) {
                    if(resData.error) {
                        throw resData.error;
                    }
                    else {
                        return resData.data;
                    }
                });
            });
        },
        background_openTab: async function(msg, bgdata: OpenTab, sender) {
            chrome.tabs.create({ url: bgdata.url });
        },
        background_setIconPopup: async function(msg, bgdata: SetIconPopup, sender) {
            if(!sender.tab || !sender.tab.id) {
                throw new Error("Can't set icon popup. Tab id is unknown!");
            }
            chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: (bgdata && bgdata.url) ? bgdata.url : "" });
        },
        background_setIconText: async function(msg, bgdata: SetIconText, sender) {
            if(!sender.tab || !sender.tab.id) {
                throw new Error("Can't set icon text. Tab id is unknown!");
            }
            chrome.browserAction.setBadgeText({ text: (bgdata && bgdata.text) ? bgdata.text : "", tabId: sender.tab.id });
        },
        background_downloadFile: async function(msg, bgdata: DownloadFile, sender) {
            chrome.downloads.download({ url: bgdata.url, saveAs: true, filename: bgdata.fileName });
        },
        background_alert: async function(msg, bgdata: Alert, sender) {
            window.alert(bgdata.msg);
        },
        background_prompt: async function(msg, bgdata: Promt, sender) {
            var value = window.prompt(bgdata.msg, bgdata.fieldText);

            if (value == null || value == "") {
                 return { aborted: true, text: null };
            } else {
                return { aborted: false, text: value };
            }
        },
        background_confirm: async function(msg, bgdata: Alert, sender) {
            return window.confirm(bgdata.msg);
        },
        background_exec: async function(msg, bgdata : { arg: any, func: string, cb: boolean }, sender) {
            let fn = bgdata.func.split(".").reduce(function(acc, el){
                return acc[el];
            }, window as any);
            if(bgdata.cb) {
                return new Promise((resolve) => {
                    fn(resolve);
                });
            }
            else {
                return fn(bgdata.arg);
            }
        },
        background_exec_cs: async function(msg, bgdata : { cs: string }, sender) {
            chrome.tabs.executeScript(sender.tab!.id!, { code: bgdata.cs });
        }
    });
}
