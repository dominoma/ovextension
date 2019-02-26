import * as Messages from "./messages";

export const enum StorageScopes {
    Local = "local",
    Sync = "sync"
}
interface GetData {
    scope: StorageScopes;
    name: string;
}
interface SetData extends GetData {
    value: any;
}
export function canStorage() {
    return chrome.storage != undefined;
}
export function setupBG() {
    let scopes = {
        "local": chrome.storage.local,
        "sync": chrome.storage.sync
    }
    Messages.setupBackground({
        storage_getData: async function(msg, bgdata: GetData, sender) {
            return new Promise<any>(function(resolve, reject){
                scopes[bgdata.scope].get(bgdata.name, function(item) {
                    resolve(item[bgdata.name]);
                });
            });
        },
        storage_setData: async function(msg, bgdata: SetData, sender) {
            return new Promise<{ success: boolean }>(function(resolve, reject){
                scopes[bgdata.scope].set({ [bgdata.name]: bgdata.value }, function() {
                    resolve({ success: true });
                });
            });
        }
    });
}
type Scope = typeof chrome.storage.local | typeof chrome.storage.sync;
async function getValue(name: string, scope : Scope): Promise<any> {
    if (canStorage()) {
        return new Promise(function(resolve, reject) {
            scope.get(name, function(item) {
                resolve(item[name]);
            });
        });
    }
    else {
        let response = await Messages.sendToBG({ func: "storage_getData", data: { scope: scope, name: name } });
        return response.data;
    }
}
async function setValue(name: string, value: any, scope : Scope): Promise<{ success: boolean }> {
    if (canStorage()) {
        return new Promise(function(resolve, reject) {
            scope.set({ [name]: value }, function() {
                resolve({ success: true });
            });
        });
    }
    else {
        await Messages.sendToBG({ func: "storage_setData", data: { scope: scope, name: name, value: value } });
        return { success: true };
    }
}
export module local {
    export async function get(name: string): Promise<any> {
        return getValue(name, chrome.storage.local);
    }
    export async function set(name: string, value: any): Promise<{ success: boolean }> {
        return setValue(name, value, chrome.storage.local);
    }
}
export module sync {
    export async function get(name: string): Promise<any> {
        return getValue(name, chrome.storage.sync);
    }
    export async function set(name: string, value: any): Promise<{ success: boolean }> {
        return setValue(name, value, chrome.storage.sync);
    }
}
