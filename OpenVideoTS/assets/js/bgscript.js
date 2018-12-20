var Background;
(function (Background) {
    function LoadBGScripts() {
        //OV.proxy.addHostsFromScripts(ScriptBase.getRedirectHosts());
        OV.proxy.addHostsToList(["oloadcdn.", "198.16.68.146", "playercdn.", "fruithosted.", "fx.fastcontentdelivery."]);
    }
    OV.environment.declareBGPage();
    OV.proxy.setupBG();
    OV.storage.setup();
    OV.messages.setupBackground({
        toTopWindow: function (msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.sendMessage(tabid, msg, function (resData) {
                sendResponse(resData);
            });
        },
        toActiveTab: function (msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.query({ active: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, function (resData) {
                    sendResponse(resData);
                });
            });
        },
        toTab: function (msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.query(bgdata, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, function (resData) {
                    sendResponse(resData);
                });
            });
        },
        openTab: function (msg, bgdata, sender, sendResponse) {
            chrome.tabs.create({ url: bgdata.url });
        },
        pauseAllVideos: function (msg, bgdata, sender, sendResponse) {
            chrome.tabs.sendMessage(sender.tab.id, { func: "pauseVideos" });
        },
        setIconPopup: function (msg, bgdata, sender, sendResponse) {
            chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: (bgdata && bgdata.url) ? bgdata.url : "" });
        },
        setIconText: function (msg, bgdata, sender, sendResponse) {
            chrome.browserAction.setBadgeText({ text: (bgdata && bgdata.text) ? bgdata.text : "", tabId: sender.tab.id });
        },
        downloadFile: function (msg, bgdata, sender, sendResponse) {
            chrome.downloads.download({ url: bgdata.url, saveAs: true, filename: bgdata.fileName });
        },
        reloadScripts: function (msg, bgdata, sender, sendResponse) {
            LoadBGScripts();
        },
        analytics: function (msg, bgdata, sender, sendResponse) {
            OV.analytics.postData(bgdata);
        },
        redirectHosts: function (msg, bgdata, sender, sendResponse) {
            ScriptBase.getRedirectHosts().then(function (redirectHosts) {
                sendResponse({ redirectHosts: redirectHosts });
            });
        },
        alert: function (msg, bgdata, sender, sendResponse) {
            alert(bgdata.msg);
        },
        prompt: function (msg, bgdata, sender, sendResponse) {
            var value = prompt(bgdata.msg, bgdata.fieldText);
            if (value == null || value == "") {
                sendResponse({ aborted: true, text: null });
            }
            else {
                sendResponse({ aborted: false, text: value });
            }
        }
    });
    LoadBGScripts();
    chrome.runtime.setUninstallURL("https://goo.gl/forms/conIBydrACtZQR0A2");
    chrome.browserAction.setBadgeBackgroundColor({ color: "#8dc73f" });
    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendMessage(tab.id, { func: "openPopup" });
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
        if (OV.tools.parseUrl(details.url).query.isOV) {
            setHeader(details.requestHeaders, "Origin", "*");
            setHeader(details.requestHeaders, "Referer", "*");
            //returnHash.redirectUrl = redirectUrl.replace(/[\?&]isOV=[^\?&]*/g, "");
        }
        var referer = (details.url.match(/[\?&]OVreferer=([^\?&]*)/) || [null, null])[1];
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