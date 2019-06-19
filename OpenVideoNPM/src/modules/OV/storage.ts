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
export module playlist_old {

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
    export async function convertToNew() {
        let playlists = await getPlaylists();
        let content = await Promise.all(playlists.map(async (playlist)=>{
            let videos = await getPlaylistByID(playlist.id);
            return videos.map((video)=>{
                return { data: video, playlists: [playlist.id] };
            });
        }));
        let videos = content.reduce((acc, videos)=>{
            videos.forEach((video)=>{
                let index = acc.findIndex((accel)=>{
                    return accel.data.origin.url == video.data.origin.url;
                });
                if(index == -1) {
                    acc.push(video);
                }
                else {
                    let accel = acc[index];
                    accel.playlists = accel.playlists.concat(video.playlists);
                    acc[index] = accel;
                }
            })
            return acc;
        }, []);

        await local.set("library_playlist_videos", videos);
    }
}
export type PlayistVideo = {
    data: VideoTypes.VideoRefData,
    playlists: string[]
}
export async function getPlaylistEntry(video_origin : string) {
    let videos = await local.get("library_playlist_videos") as PlayistVideo[];
    return videos.find((el)=>{
        return el.data.origin.url == video_origin;
    })
}
export async function addToPlaylist(video : VideoTypes.VideoRefData, playlist_id : string) {
    let videos = await local.get("library_playlist_videos") as PlayistVideo[];
    let index = videos.findIndex((el)=>{
        return el.data.origin.url == video.origin.url;
    });
    if(index == -1) {
        videos.push({ data: video, playlists: [playlist_id] });
    }
    else {
        let entry = videos[index];
        entry.data = video;
        if(!entry.playlists.some((el)=>{
            return el == playlist_id;
        })) {
            entry.playlists.push(playlist_id);
        }
        videos[index] = entry;
    }
    await local.set("library_playlist_videos", videos);
}
export async function removeFromPlaylist(video_origin : string, playlist_id : string) {
    let videos = await local.get("library_playlist_videos") as PlayistVideo[];
    let index = videos.findIndex((el)=>{
        return el.data.origin.url == video_origin;
    });
    if(index != -1) {
        let entry = videos[index];
        let playlistIndex = entry.playlists.findIndex((el)=>{
            return el == playlist_id;
        });
        if(playlistIndex != -1) {
            entry.playlists.splice(playlistIndex, 1);
            if(entry.playlists.length == 0) {
                videos.splice(index, 1);
            }
            await local.set("library_playlist_videos", videos);
        }
    }
}
export async function getPlaylistsWithVideo(video_origin : string) {
    let entry = await getPlaylistEntry(video_origin);
    if(entry) {
        return entry.playlists;
    }
    else {
        return [];
    }
}
export async function getPlaylistVideos(playlist_id : string) {
    let videos = await local.get("library_playlist_videos") as PlayistVideo[];
    return videos.filter((entry)=>{
        return entry.playlists.some((el)=>{
            return el == playlist_id;
        })
    }).map((el)=>{
        return el.data;
    })
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
