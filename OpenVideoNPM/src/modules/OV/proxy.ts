import * as Tools from "./tools";
import * as Messages from "./messages";
import * as Environment from "./environment";
import * as Storage from "./storage";
import * as VideoTypes from "video_types";
import {StringMap} from "OV/types";

export type Proxy = Storage.Proxy;

export function canProxy() {
    return chrome.proxy != undefined;
}
export function setupBG(): void {
    Messages.setupBackground({
        proxy_setup: async function(data, bgdata: Proxy, sender) {
            return _setup({ ip: bgdata.ip, port: bgdata.port, country: bgdata.country });
        },
        proxy_update: async function(data, bgdata, sender) {
            return _update();
        },
        proxy_remove: async function(data, bgdata, sender) {
            _remove();
        },
        proxy_addHostsToList: async function(data, bgdata, sender) {
            return { added: _addHostsToList(bgdata.hosts) };
        },
        proxy_newProxy: async function(data, bgdata, sender) {
            return _newProxy();
        },
        proxy_getCurrent: async function(data, bgdata, sender) {
            return currentProxy;
        }
    });
}
function getChromePAC() {
    if(!currentProxy) {
        throw new Error("Can't setup chrome proxy!");
    }
    function replaceScriptMacros(script: string, macros : StringMap) {
        for(let macro in macros) {
            script = script.replace(new RegExp("(\\/\\*)?\\$"+macro+"\\$(\\*\\/)?", "gi"), macros[macro]);
        }
        return script;
    }

    let script = (function FindProxyForURL(url : string, host : string) {
        let hosts = [/*$HOSTS$*/] as RegExp[];
        for(let host of hosts) {
            if(host.test(url)) {
                return "PROXY $IP$:$PORT$";
            }
        }
        return "DIRECT";
    }).toString();
    let hostsarr = hosts.join(",");
    return replaceScriptMacros(script, { ip: currentProxy.ip, port: currentProxy.port.toString(), hosts: hostsarr });

}
export async function loadFromStorage() {
    let proxy = await Storage.getProxySettings();
    if(proxy) {
        if(proxy.country == "Custom") {
            return setup(proxy);
        }
        else {
            return newProxy();
        }
    }
    return null;
}
let currentProxy: Proxy | null = null;
export async function setup(proxy: Proxy): Promise<Proxy> {

    if (canProxy()) {
        return _setup(proxy);
    }
    else {
        let response = await Messages.sendToBG({ func: "proxy_setup", data: { proxy: proxy } });
        return response.data;
    }
}
async function _setup(proxy: Proxy): Promise<Proxy> {
    remove();
    currentProxy = proxy;
    Storage.setProxySettings(currentProxy);
    if (Environment.browser() == Environment.Browsers.Chrome) {
        let script  = await getChromePAC();
        console.log(script);
        var config = {
            mode: "pac_script",
            pacScript: {
                data: script
            }
        };
        chrome.proxy.settings.set({ value: config, scope: 'regular' });
    }
    else {
        browser.proxy.register("/proxy_scripts/pac_firefox.js");
        browser.runtime.sendMessage({ proxy: currentProxy, hosts: hosts }, { toProxyScript: true });
    }
    return currentProxy;
}
export async function update(): Promise<Proxy|null> {
    if (canProxy()) {
        return _update();
    }
    else {
        let response = await Messages.sendToBG({ func: "proxy_update", data: {} });
        return response.data;
    }
}
async function _update(): Promise<Proxy|null> {
    if (currentProxy) {
        return setup(currentProxy);
    }
    else {
        return null;
    }
}
export async function newProxy(): Promise<Proxy> {
    if (canProxy()) {
        return _newProxy();
    }
    else {
        let response = await Messages.sendToBG({ func: "proxy_newProxy", data: {} });
        return response.data;
    }
}
let triedProxies: Array<string> = [];
let proxies: Array<Proxy> = [];
async function _newProxy(): Promise<Proxy> {
    if (currentProxy) {
        triedProxies.push(currentProxy.ip);
    }
    if (proxies.length == 0 || triedProxies.length > 20 || triedProxies.length == proxies.length) {
        proxies = await searchProxies();
        triedProxies = [];

        for (var proxy of proxies) {
            if (triedProxies.indexOf(proxy.ip) == -1) {
                return _setup(proxy);
            }
        }
        throw Error("Something went wrong!");
    }
    else {
        for (var proxy of proxies) {
            if (triedProxies.indexOf(proxy.ip) == -1) {
                return _setup(proxy);
            }
        }
        throw Error("Something went wrong!");
    }

}
export async function isEnabled(): Promise<boolean> {
    let proxy = await getCurrentProxy();
    return proxy != null;
}
function _isEnabled(): boolean {
    return currentProxy != null;
}
export async function getCurrentProxy(): Promise<Proxy|null> {
    if (canProxy()) {
        return currentProxy;
    }
    else {
        let response = await Messages.sendToBG({ func: "proxy_getCurrent", data: {} });
        return response.data;
    }
}
export async function remove() {
    if (canProxy()) {
        _remove();
    }
    else {
        await Messages.sendToBG({ func: "proxy_remove", data: {} });
    }
}
function _remove() {
    if (Environment.browser() == Environment.Browsers.Chrome) {
        chrome.proxy.settings.clear({});
    }
    else {
        browser.proxy.unregister();
    }
    currentProxy = null;
    Storage.setProxySettings(null);
}
async function searchProxies(): Promise<Array<Proxy>> {
    var url = "https://free-proxy-list.net/anonymous-proxy.html";
    let xhr = await Tools.createRequest({ url: url });
    let HTML = (new DOMParser()).parseFromString(xhr.response, "text/html");

    var table = HTML.getElementsByTagName("table")[0];
    var tableRows = table.getElementsByTagName("tr");
    var proxies: Array<Proxy> = [];
    for (let row of tableRows) {
        if (row.cells[4].innerText == "elite proxy") {
            proxies.push({
                ip: row.cells[0].innerText,
                port: parseInt(row.cells[1].innerText),
                country: row.cells[3].innerText,
                anonymity: row.cells[4].innerText
            });
        }
    }
    return proxies;
}
export async function addHostsfromVideos(videoData: VideoTypes.VideoData) {
    addHostsToList(videoData.src.map((el) => {
        let hosts = [Tools.parseURL(el.src).host];
        if(el.dlsrc) {
            hosts.push(Tools.parseURL(el.dlsrc.src).host);
        }
        return hosts;
    }).reduce((acc, el) => {
        return acc.concat(el);
    }).concat(videoData.tracks.map((el) => {
        return Tools.parseURL(el.src).host;
    })).concat(Tools.parseURL(videoData.poster).host));
}
export async function addHostsToList(newHosts: RegExp[]|string[]) {
    if (canProxy()) {
        return _addHostsToList(newHosts);
    }
    else {
        let response = await Messages.sendToBG({ func: "proxy_addHostsToList", data: { hosts: newHosts } });
        return response.data.added;
    }
}
let hosts = [] as string[];
async function _addHostsToList(newHosts: RegExp[]|string[]) {
    let addedHosts = [] as string[];
    if(newHosts[0] instanceof RegExp) {
        addedHosts = (newHosts as RegExp[]).map((el) => el.toString() );
    }
    else {
        addedHosts = (newHosts as string[]).map((el) => new RegExp(el, "i").toString() );
    }
    let needsUpdate = false;
    for(let host of addedHosts) {
        if(hosts.indexOf(host) == -1) {
            hosts.push(host);
            needsUpdate = true;
        }
    }
    console.log(hosts);
    if(needsUpdate) {
        await _update();
        return true;
    }
    else {
        return false;
    }
}
