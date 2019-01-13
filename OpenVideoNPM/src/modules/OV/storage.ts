import * as Messages from "./messages";
import * as Environment from "./environment";

export const enum StorageScopes {
    Local = "local",
    Sync = "sync"
}
export function setup() {
    Messages.setupBackground({
        getStorageData: function(msg, bgdata: any, sender, sendResponse) {
            chrome.storage.local.get(bgdata.name, function(item) {
                sendResponse(item[bgdata.name]);
            });

        },
        setStorageData: function(msg, bgdata: any, sender, sendResponse) {
            chrome.storage.local.set({ [bgdata.name]: bgdata.value }, function() {
                sendResponse({ success: true });
            });
        }
    });
}
export module local {
    export function get(name: string): Promise<any> {
        if (Environment.isBackgroundPage()) {
            return new Promise(function(resolve, reject) {
                chrome.storage.local.get(name, function(item) {
                    resolve(item[name]);
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "getStorageData", data: { scope: "local", name: name } } }).then(function(response) {
                return response.data;
            });
        }
    }
    export function set(name: string, value: any): Promise<{ success: boolean }> {
        if (Environment.isBackgroundPage()) {
            return new Promise(function(resolve, reject) {
                chrome.storage.local.set({ [name]: value }, function() {
                    resolve({ success: true });
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "setStorageData", data: { scope: "local", name: name, value: value } } }).then(function() {
                return { success: true };
            });
        }
    }
}
export module sync {
    export function get(name: string): Promise<any> {
        if (Environment.isBackgroundPage()) {
            return new Promise(function(resolve, reject) {
                chrome.storage.sync.get(name, function(item) {
                    resolve(item[name]);
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "getStorageData", data: { scope: "sync", name: name } } }).then(function(response) {
                return response.data;
            });
        }
    }
    export function set(name: string, value: any): Promise<{ success: boolean }> {
        if (Environment.isBackgroundPage()) {
            return new Promise(function(resolve, reject) {
                chrome.storage.sync.set({ [name]: value }, function() {
                    resolve({ success: true });
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "setStorageData", data: { scope: "sync", name: name, value: value } } }).then(function() {
                return { success: true };
            });
        }
    }
}