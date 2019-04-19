import * as Storage from "OV/storage";
import * as Proxy from "OV/proxy";
import * as Tools from "OV/tools";
import * as Environment from "OV/environment";
import * as Background from "Messages/background";
import * as Messages from "OV/messages";
import * as ScriptBase from "redirect_scripts_base";
import * as RedirectScripts from "../RedirectScripts";
import * as Analytics from "OV/analytics";
import * as VideoHistory from "Messages/videohistory";

async function LoadBGScripts() {
    //OV.proxy.addHostsFromScripts(ScriptBase.getRedirectHosts());
    Proxy.addHostsToList(["oloadcdn.", "198.16.68.146", "playercdn.", "fruithosted.", "fx.fastcontentdelivery."]);
    let scripts = await ScriptBase.getRedirectHosts();
    Proxy.addHostsToList(scripts.map((el) => {
        return el.scripts.map((el) => {
            return el.urlPattern;
        })
    }).reduce((acc, el) => {
        return acc.concat(el);
    }));
}
Environment.declareBGPage();
Background.setup();
Proxy.setupBG();
Storage.setupBG();
ScriptBase.setupBG();
Analytics.setupBG();
RedirectScripts.install();

Proxy.loadFromStorage();

VideoHistory.convertOldPlaylists();

LoadBGScripts();
chrome.runtime.setUninstallURL("https://goo.gl/forms/conIBydrACtZQR0A2");
chrome.browserAction.setBadgeBackgroundColor({ color: "#8dc73f" });
chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab.id) {
        throw new Error("Tab has no id!");
    }
    Messages.sendToTab(tab.id, { func: "videopopup_openPopup", data: {} });
    chrome.browserAction.setPopup({ tabId: tab.id, popup: "pages/popupmenu/popupmenu.html" });
});
chrome.runtime.onInstalled.addListener(async function(details) {
    if (details.reason == "install" || details.reason == "update") {
        let redirectHosts = await ScriptBase.getRedirectHosts();
        for(let script of redirectHosts) {
            ScriptBase.setScriptEnabled(script.name, true);
        }
    }
    Storage.sync.set("InstallDetails", details);
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

    var referer = Tools.getRefererFromURL(details.url);
    if (referer) {

        setHeader(details.requestHeaders!, "Referer", referer);
        setHeader(details.requestHeaders!, "Origin", "https://"+Tools.parseURL(referer).host);
        return { requestHeaders: details.requestHeaders }

    }
    else if (details.url.match(/[\?&]isOV=true/i)) {
        console.log(details.requestHeaders, details.url)
        removeHeader(details.requestHeaders!, "Origin");
        removeHeader(details.requestHeaders!, "Referer");
        return { requestHeaders: details.requestHeaders }

    }
    return null;


}
try {
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders,
        {
            urls: ["*://*/*OVReferer=*", "*://*/*isOV*", "*://*/*ovreferer=*", "*://*/*isov*"]
        },
        (Environment.browser() == Environment.Browsers.Chrome) ? ['blocking', 'requestHeaders', 'extraHeaders'] : ['blocking', 'requestHeaders']
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
