var Background;
(function (Background) {
    function LoadBGScripts() {
        //OV.proxy.addHostsFromScripts(ScriptBase.getRedirectHosts());
        OV.proxy.addHostsToList(["oloadcdn.", "198.16.68.146", "playercdn.", "fruithosted.", "fx.fastcontentdelivery."]);
    }
    Background.setup();
    OV.environment.declareBGPage();
    OV.proxy.setupBG();
    OV.storage.setup();
    LoadBGScripts();
    chrome.runtime.setUninstallURL("https://goo.gl/forms/conIBydrACtZQR0A2");
    chrome.browserAction.setBadgeBackgroundColor({ color: "#8dc73f" });
    chrome.browserAction.onClicked.addListener(function (tab) {
        Background.sendMessage(tab.id, { func: "openPopup", data: {} });
        chrome.browserAction.setPopup({ tabId: tab.id, popup: "html/PopupMenu/PopupMenu.html" });
    });
    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason == "install" || details.reason == "update") {
            ScriptBase.getRedirectHosts().then(function (redirectHosts) {
                redirectHosts.forEach(function (script) {
                    ScriptBase.setScriptEnabled(script.name, true);
                });
            });
        }
        OV.storage.sync.set("InstallDetails", details);
    });
    OV.storage.sync.get("ProxyEnabled").then(function (proxy) {
        if (proxy) {
            if (proxy.country === "Custom") {
                OV.proxy.setup(proxy);
            }
            else {
                OV.proxy.newProxy();
            }
        }
    });
    chrome.webRequest.onHeadersReceived.addListener(function (details) {
        function getHeader(headers, name) {
            function searchHeader(search, header) {
                return search.toLowerCase() == header.name.toLowerCase();
            }
            return OV.array.search(name, headers, searchHeader);
        }
        function setHeader(headers, name, value) {
            var header = getHeader(headers, name);
            if (header) {
                header.value = value;
            }
            else {
                headers.push({ name: name, value: value });
            }
        }
        if (OV.environment.isExtensionPage(details.initiator || "")) {
            setHeader(details.responseHeaders, "Access-Control-Allow-Origin", details.url);
            setHeader(details.responseHeaders, "Access-Control-Allow-Credentials", "true");
            return { responseHeaders: details.responseHeaders };
        }
        return null;
    }, {
        urls: ["<all_urls>"]
    }, ['blocking', 'responseHeaders']);
    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        function setHeader(headers, name, value) {
            var header = getHeader(headers, name);
            if (header) {
                header.value = value;
            }
            else {
                headers.push({ name: name, value: value });
            }
        }
        function getHeader(headers, name) {
            function searchHeader(search, header) {
                return search.toLowerCase() == header.name.toLowerCase();
            }
            return OV.array.search(name, headers, searchHeader);
        }
        if (details.url.match(/[\?&]isOV=true/i)) {
            console.log("OV");
            setHeader(details.requestHeaders, "Origin", "*");
            setHeader(details.requestHeaders, "Referer", "*");
            console.log(details.requestHeaders);
            //returnHash.redirectUrl = redirectUrl.replace(/[\?&]isOV=[^\?&]*/g, "");
        }
        var referer = (details.url.match(/[\?&]OVreferer=([^\?&]*)/i) || [null, null])[1];
        if (referer) {
            referer = atob(decodeURIComponent(referer));
            //returnHash.redirectUrl = redirectUrl.replace(/[\?&]OVreferer=[^\?&]*/g, "");
            setHeader(details.requestHeaders, "Referer", referer);
            //setHeader(requestHeaders, "Origin", "https://"+OV.tools.parseUrl(referer).host);
        }
        return { requestHeaders: details.requestHeaders };
    }, {
        urls: ["<all_urls>"]
    }, ['blocking', 'requestHeaders']);
})(Background || (Background = {}));
//# sourceMappingURL=bgscript.js.map