import * as Storage from "OV/storage";
import * as Proxy from "OV/proxy";
import * as Tools from "OV/tools";
import * as Environment from "OV/environment";
import * as Background from "Messages/background";
import * as ScriptBase from "redirect_scripts_base";
import * as RedirectScripts from "../RedirectScripts";

function LoadBGScripts() {
    //OV.proxy.addHostsFromScripts(ScriptBase.getRedirectHosts());
    Proxy.addHostsToList(["oloadcdn.", "198.16.68.146", "playercdn.", "fruithosted.", "fx.fastcontentdelivery."]);
}
Background.setup();
Environment.declareBGPage();
Proxy.setupBG();
Storage.setup();
RedirectScripts.install();

LoadBGScripts();
chrome.runtime.setUninstallURL("https://goo.gl/forms/conIBydrACtZQR0A2");
chrome.browserAction.setBadgeBackgroundColor({ color: "#8dc73f" });
chrome.browserAction.onClicked.addListener(function(tab) {
    Background.sendMessage(tab.id, { func: "openPopup", data: {} });
    chrome.browserAction.setPopup({ tabId: tab.id, popup: "html/PopupMenu/PopupMenu.html" });
});
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install" || details.reason == "update") {
        ScriptBase.getRedirectHosts().then(function(redirectHosts) {
            redirectHosts.forEach(function(script) {
                ScriptBase.setScriptEnabled(script.name, true);
            });
        });
    }
    Storage.sync.set("InstallDetails", details);
});
Storage.sync.get("ProxyEnabled").then(function(proxy) {
    if (proxy) {
        if (proxy.country === "Custom") {
            Proxy.setup(proxy);
        }
        else {
            Proxy.newProxy();
        }
    }
})

chrome.webRequest.onHeadersReceived.addListener(function(details) {
    function getHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string): chrome.webRequest.HttpHeader {
        return headers.find(function(header) {
            return header.name.toLowerCase() == name.toLowerCase();
        });
    }
    function setHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string, value: string) {
        var header = getHeader(headers, name)
        if (header) {
            header.value = value;
        }
        else {
            headers.push({ name: name, value: value });
        }
    }
    if (Environment.isExtensionPage(details.initiator || "")) {
        setHeader(details.responseHeaders, "Access-Control-Allow-Origin", details.url);
        setHeader(details.responseHeaders, "Access-Control-Allow-Credentials", "true");
        return { responseHeaders: details.responseHeaders }
    }
    return null;
},
    {
        urls: ["<all_urls>"]
    },
    ['blocking', 'responseHeaders']
);
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    function setHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string, value: string) {
        var header = getHeader(headers, name);
        if (header) {
            header.value = value;
        }
        else {
            headers.push({ name: name, value: value });
        }
    }
    function getHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string): chrome.webRequest.HttpHeader {
        return headers.find(function(header) {
            return header.name.toLowerCase() == name.toLowerCase();
        });
    }
    function removeHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string) {
        var header = getHeader(headers, name);
        headers.splice(headers.indexOf(header), 1);
    }
    var referer = Tools.getRefererFromURL(details.url);
    if (referer) {

        setHeader(details.requestHeaders, "Referer", referer);
        return { requestHeaders: details.requestHeaders }
        //setHeader(requestHeaders, "Origin", "https://"+OV.tools.parseUrl(referer).host);
    }
    else if (details.url.match(/[\?&]isOV=true/i)) {
        console.log(details.requestHeaders, details.url)
        setHeader(details.requestHeaders, "Origin", "*");
        removeHeader(details.requestHeaders, "Referer");
        console.log(details.requestHeaders)
        return { requestHeaders: details.requestHeaders }
       
    }
    return null;


},
    {
        urls: ["<all_urls>"]
    },
    ['blocking', 'requestHeaders']
);
