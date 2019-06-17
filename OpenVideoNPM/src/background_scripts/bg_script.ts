import * as Storage from "OV/storage";
import * as Proxy from "OV/proxy";
import * as Tools from "OV/tools";
import * as Environment from "OV/environment";
import * as Background from "Messages/background";
import * as Messages from "OV/messages";
import ScriptManager from "redirect_scripts_base";
import * as RedirectScripts from "../RedirectScripts";
import * as Analytics from "OV/analytics";
import * as VideoHistory from "Messages/videohistory";

async function LoadBGScripts() {
    //OV.proxy.addHostsFromScripts(ScriptBase.getRedirectHosts());
    Proxy.addHostsToList(["oloadcdn.", "198.16.68.146", "playercdn.", "fruithosted.", "fx.fastcontentdelivery."]);
    let scripts = await ScriptManager.hosts;
    Proxy.addHostsToList(scripts.map((el) => {
        return el.scripts.map((el) => {
            return el.url;
        })
    }).reduce((acc, el) => {
        return acc.concat(el);
    }));
}
Environment.declareBGPage();
Background.setup();
Proxy.setupBG();
Storage.setupBG();
RedirectScripts.install();
ScriptManager.setupBG();
Analytics.setupBG();

Proxy.loadFromStorage();

VideoHistory.convertOldPlaylists();
Storage.playlist_old.convertToNew();

LoadBGScripts();
chrome.runtime.setUninstallURL("https://goo.gl/forms/conIBydrACtZQR0A2");
chrome.browserAction.setBadgeBackgroundColor({ color: "#8dc73f" });
chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab.id) {
        throw new Error("Tab has no id!");
    }
    Messages.sendToTab(tab.id, { func: "videopopup_openPopup", data: {} });
});
chrome.runtime.onInstalled.addListener(async function(details) {
    if (details.reason == "install" || details.reason == "update") {
        let redirectHosts = await ScriptManager.hosts;
        for(let script of redirectHosts) {
            Storage.setScriptEnabled(script.name, true);
        }
    }
    //Storage.sync.set("InstallDetails", details);
});
function setHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string, value: string) {
    var header = getHeader(headers, name);
    if (header) {
        header.value = value;
    }
    else {
        headers.push({ name: name, value: value });
    }
}
function getHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string) {
    return headers.find(function(header) {
        return header.name.toLowerCase() == name.toLowerCase();
    });
}
function removeHeader(headers: Array<chrome.webRequest.HttpHeader>, name: string) {
    var header = getHeader(headers, name);
    if(header) {
        headers.splice(headers.indexOf(header), 1);
    }
}
chrome.webRequest.onHeadersReceived.addListener(function(details) {
    if(details.statusCode == 302) {
        let location = getHeader(details.responseHeaders!, "location");
        if(location) {
            if(Tools.isParamInURL(details.url, "OVReferer")) {
                let referer = Tools.getRefererFromURL(details.url);
                location.value = Tools.addRefererToURL(location.value!, referer!);
            }
            else if(Tools.getParamFromURL(details.url, "isOV") == "true") {
                location.value = Tools.addParamsToURL(location.value!, { isOV: "true" });
            }
            return { responseHeaders: details.responseHeaders };
        }
    }
    /*if (Environment.isExtensionPage(details.initiator || "")) {
        setHeader(details.responseHeaders!, "Access-Control-Allow-Origin", details.url);
        setHeader(details.responseHeaders!, "Access-Control-Allow-Credentials", "true");
        return { responseHeaders: details.responseHeaders }
    }*/
    return null;
},
    {
        urls: ["*://*/*OVReferer=*", "*://*/*isOV*", "*://*/*ovreferer=*", "*://*/*isov*"]
    },
    ['blocking', 'responseHeaders']
);
function beforeSendHeaders(details : chrome.webRequest.WebRequestHeadersDetails) {

    let refererHeader = getHeader(details.requestHeaders!, "OVReferer");
    if (refererHeader) {
        let referer = refererHeader.value!;
        removeHeader(details.requestHeaders!, "OVReferer");
        setHeader(details.requestHeaders!, "Referer", referer);
        setHeader(details.requestHeaders!, "Origin", "https://"+Tools.parseURL(referer).host);
        return { requestHeaders: details.requestHeaders }

    }
    else if (getHeader(details.requestHeaders!, "isOV")) {
        removeHeader(details.requestHeaders!, "Origin");
        removeHeader(details.requestHeaders!, "Referer");
        removeHeader(details.requestHeaders!, "isOV");
        return { requestHeaders: details.requestHeaders }

    }
    return null;


}
try {
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders,
        {
            urls: ["<all_urls>"]
        },
        ['blocking', 'requestHeaders', 'extraHeaders']
    );
}
catch(e) {
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders,
        {
            urls: ["*://*/*OVReferer=*", "*://*/*isOV*", "*://*/*ovreferer=*", "*://*/*isov*"]
        },
        ['blocking', 'requestHeaders']
    );
}
