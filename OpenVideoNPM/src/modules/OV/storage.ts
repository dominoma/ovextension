import * as Messages from "./messages";
import * as VideoTypes from "video_types";
import * as Tools from "./tools";

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
module sync {
    export async function get(name: string): Promise<any> {
        return getValue(name, chrome.storage.sync);
    }
    export async function set(name: string, value: any): Promise<{ success: boolean }> {
        return setValue(name, value, chrome.storage.sync);
    }
}
export const fixed_playlists = {
    history: { id: "history", name: "History" },
    favorites: { id: "favorites", name: "Favorites" }
}
export type Playlist = { id: string, name: string };
export async function getPlaylists() {
    return await sync.get("library_playlists") as Playlist[] || [fixed_playlists.history, fixed_playlists.favorites];
}
export async function setPlaylists(playlists : { id: string, name: string }[]) {
    return sync.set("library_playlists", playlists);
}
export async function getPlaylistByID(id : string) {
    if(id == fixed_playlists.history.id) {
        return await local.get("library_playlist_"+id) as VideoTypes.VideoRefData[] || [];
    }
    return await sync.get("library_playlist_"+id) as VideoTypes.VideoRefData[] || [];
}
export async function setPlaylistByID(id : string, playlist : VideoTypes.VideoRefData[]) {
    if(id == fixed_playlists.history.id) {
        return local.set("library_playlist_"+id, playlist);
    }
    return sync.set("library_playlist_"+id, playlist);
}
export async function getSearchSites() {
    return await sync.get("library_search_sites") as VideoTypes.PageRefData[] || [];
}
export async function setSearchSites(sites: VideoTypes.PageRefData[]) {
    return await sync.set("library_search_sites", sites);
}

export async function isHistoryEnabled() {
    return (await sync.get("library_history_enabled")) != false;
}
export async function setHistoryEnabled(enabled : boolean) {
    return await sync.set("library_history_enabled", enabled);
}

export async function getPlayerVolume() {
    return (await sync.get("player_volume")) || 1 as number;
}
export async function setPlayerVolume(volume : number) {
    return await sync.set("player_volume", volume);
}
export async function getTheatreFrameWidth() {
    return (await sync.get("theatremode_width")) || 70 as number;
}
export async function setTheatreFrameWidth(width : number) {
    return await sync.set("theatremode_width", width);
}
export async function getAnalyticsCID() {
    let cid = await sync.get("analytics_cid") as string | null;
    if(!cid) {
        cid = Tools.generateHash();
        await sync.set("analytics_cid", cid);
    }
    return cid;
}
export async function isAnalyticsEnabled() {
    return (await sync.get("analytics_enabled")) != false;
}
export async function setAnalyticsEnabled(enabled : boolean) {
    return await sync.set("analytics_enabled", enabled);
}
export interface Proxy {
    ip: string;
    port: number;
    country?: string;
    anonymity?: string;
}
export async function getProxySettings() {
    return (await sync.get("proxy_settings")) as Proxy | null;
}
export async function setProxySettings(settings : Proxy | null) {
    return await sync.set("proxy_settings", settings);
}
export async function isScriptEnabled(script : string) {
    return (await sync.get("redirect_scripts_"+script)) != false;
}
export async function setScriptEnabled(script : string, enabled : boolean) {
    return await sync.set("redirect_scripts_"+script, enabled);
}
export async function isVideoSearchEnabled() {
    return (await sync.get("videopopup_search")) != false;
}
export async function setVideoSearchEnabled(enabled : boolean) {
    return await sync.set("videopopup_search", enabled);
}
