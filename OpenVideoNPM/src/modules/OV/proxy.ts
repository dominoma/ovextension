import * as Tools from "./tools";
import * as Messages from "./messages";
import * as Environment from "./environment";
import * as Storage from "./storage";

export function setupBG(): void {
    Messages.setupBackground({
        proxySetup: function(data, bgdata: Proxy, sender, sendResponse) {
            _setup({ ip: bgdata.ip, port: bgdata.port, country: bgdata.country }).then(sendResponse);
        },
        proxyUpdate: function(data, bgdata, sender, sendResponse) {
            _update().then(sendResponse);
        },
        proxyRemove: function(data, bgdata, sender, sendResponse) {
            _remove();
        },
        proxyAddHostToList: function(data, bgdata, sender, sendResponse) {
            _addHostToList(bgdata.host);
        },
        proxyNewProxy: function(data, bgdata, sender, sendResponse) {
            _newProxy().then(sendResponse);
        },
        proxyGetCurrent: function(data, bgdata, sender, sendResponse) {
            sendResponse(currentProxy);
        }
    });
}
export interface Proxy {
    ip: string;
    port: number;
    country?: string;
    anonymity?: string;
}
let currentProxy: Proxy | null = null;
export function setup(proxy: Proxy): Promise<Proxy> {

    if (Environment.isBackgroundPage()) {
        return _setup(proxy);
    }
    else {
        return Messages.send({ bgdata: { func: "proxySetup", data: { proxy: proxy } } }).then(function(response) {
            return response.data;
        });
    }
}
function _setup(proxy: Proxy): Promise<Proxy> {
    return new Promise(function(resolve, reject) {

        remove();
        currentProxy = proxy;
        Storage.sync.set("ProxyEnabled", currentProxy);
        if (Environment.browser() == Environment.Browsers.Chrome) {
            var config = {
                mode: "pac_script",
                pacScript: {
                    data: "function FindProxyForURL(url, host) {" +
                    "var hosts = " + JSON.stringify(hosts) + ";" +
                    "for(var host of hosts) {" +
                    "if(url.indexOf(host) != -1) {" +
                    "return 'PROXY " + proxy.ip + ":" + proxy.port + "';" +
                    "}" +
                    "}" +
                    "return 'DIRECT';" +
                    "}"
                }
            };
            chrome.proxy.settings.set({ value: config, scope: 'regular' });
        }
        else {
            browser.proxy.register("/proxy_scripts/pac_firefox.js");
            browser.runtime.sendMessage({ proxy: currentProxy, hosts: hosts }, { toProxyScript: true });
        }
        resolve(currentProxy);
    });
}
export function update(): Promise<Proxy> {
    if (Environment.isBackgroundPage()) {
        return _update();
    }
    else {
        return Messages.send({ bgdata: { func: "proxyUpdate", data: {} } }).then(function(response) {
            return response.data;
        });
    }
}
function _update(): Promise<Proxy> {
    if (_isEnabled()) {
        return setup(currentProxy);
    }
    else {
        return Promise.reject(Error("Proxy can't be updated not enabled!"));
    }
}
export function newProxy(): Promise<Proxy> {
    if (Environment.isBackgroundPage()) {
        return _newProxy();
    }
    else {
        return Messages.send({ bgdata: { func: "proxyNewProxy", data: {} } }).then(function(response) {
            return response.data;
        });
    }
}
let triedProxies: Array<string> = [];
let proxies: Array<Proxy> = [];
function _newProxy(): Promise<Proxy> {
    if (_isEnabled()) {
        triedProxies.push(currentProxy.ip);
    }
    if (proxies.length == 0 || triedProxies.length > 20 || triedProxies.length == proxies.length) {
        return searchProxies().then(function(newproxies) {
            proxies = newproxies;
            triedProxies = [];

            for (var proxy of proxies) {
                if (triedProxies.indexOf(proxy.ip) == -1) {
                    return _setup(proxy);
                }
            }
            throw Error("Something went wrong!");
        });
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
export function isEnabled(): Promise<boolean> {
    return getCurrentProxy().then(function(proxy) {

        return proxy != null;
    });
}
function _isEnabled(): boolean {
    return currentProxy != null;
}
export function getCurrentProxy(): Promise<Proxy> {
    if (Environment.isBackgroundPage()) {
        return Promise.resolve(currentProxy);
    }
    else {
        return Messages.send({ bgdata: { func: "proxyGetCurrent", data: {} } }).then(function(response) {
            return response.data;
        });
    }
}
export function remove() {
    if (Environment.isBackgroundPage()) {
        _remove();
    }
    else {
        Messages.send({ bgdata: { func: "proxyRemove", data: {} } });
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
    Storage.sync.set("ProxyEnabled", false);
}
function searchProxies(): Promise<Array<Proxy>> {
    var url = "https://free-proxy-list.net/anonymous-proxy.html";
    return Tools.createRequest({ url: url }).then(function(xhr) {
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
    });

}
let hosts: Array<string> = [];
export function addHostToList(host: string): void {
    if (Environment.isBackgroundPage()) {
        _addHostToList(host);
    }
    else {
        Messages.send({ bgdata: { func: "proxyAddHostToList", data: { host: host } } });
    }
}
function _addHostToList(host: string) {
    if (hosts.indexOf(host) == -1) {
        hosts.push(host);
    }
}
export function addHostsToList(hosts: Array<string>) {
    for (var host of hosts) {
        _addHostToList(host);
    }
}