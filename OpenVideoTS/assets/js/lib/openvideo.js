var OV;
(function (OV) {
    let array;
    (function (array) {
        function last(arr, value) {
            if (arguments.length > 1) {
                return fromEnd(arr, 0, value);
            }
            else {
                return fromEnd(arr, 0);
            }
        }
        array.last = last;
        function fromEnd(arr, index, value) {
            if (arguments.length > 2) {
                arr[arr.length - 1 - index] = value;
                return arr;
            }
            else {
                return arr[arr.length - 1 - index];
            }
        }
        array.fromEnd = fromEnd;
        function search(elem, arr, cmpre) {
            if (!cmpre) {
                cmpre = function (elem, arrItem) {
                    return arrItem === elem;
                };
            }
            for (let item of arr) {
                if (cmpre(elem, item)) {
                    return item;
                }
            }
            return null;
        }
        array.search = search;
    })(array = OV.array || (OV.array = {}));
    let object;
    (function (object) {
        function merge(obj1, obj2) {
            return Object.assign({}, obj1, obj2);
        }
        object.merge = merge;
    })(object = OV.object || (OV.object = {}));
    function toJSONString(obj) {
        if (Array.isArray(obj)) {
            var str = "";
            for (var elem of obj) {
                str += "," + OV.toJSONString(elem);
            }
            return "[" + str.substr(1) + "]";
        }
        else if (typeof obj == "object") {
            var str = "";
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    str += '"' + key + '": ' + OV.toJSONString(obj[key]) + ",\n";
                }
            }
            return "{\n" + str.substr(0, str.length - 2) + "\n}";
        }
        else if (typeof obj == "function") {
            return obj.toString();
        }
        else {
            return JSON.stringify(obj);
        }
    }
    OV.toJSONString = toJSONString;
    let tools;
    (function (tools) {
        function eventOne(elem, type) {
            return new Promise(function (resolve, reject) {
                elem.addEventListener(type, function one(e) {
                    elem.removeEventListener(type, one);
                    resolve(e);
                });
            });
        }
        tools.eventOne = eventOne;
        function matchNull(str, regexp, index) {
            return (str.match(regexp) || [])[index || 1] || "";
        }
        tools.matchNull = matchNull;
        function objToHash(obj) {
            if (obj) {
                return "?hash=" + encodeURIComponent(JSON.stringify(obj));
            }
            else {
                return "";
            }
        }
        tools.objToHash = objToHash;
        function hashToObj(hashStr) {
            var hash = parseUrlQuery(hashStr).hash;
            if (hash == "" || hash == undefined) {
                return null;
            }
            else {
                return JSON.parse(hash);
            }
        }
        tools.hashToObj = hashToObj;
        function getAbsoluteUrl(url) {
            let a = document.createElement('a');
            a.href = url;
            url = a.href;
            return url;
        }
        tools.getAbsoluteUrl = getAbsoluteUrl;
        function unpackJS(source) {
            function getUnbase(base) {
                var ALPHABET = "";
                if (base > 62)
                    ALPHABET = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
                else if (base > 54)
                    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                else if (base > 52)
                    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQR';
                else
                    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP';
                return function (val) {
                    if (2 <= base && base <= 36) {
                        return parseInt(val, base);
                    }
                    else {
                        var valArray = val.split('').reverse();
                        var ret = 0;
                        for (var i = 0; i < valArray.length; i++) {
                            var cipher = valArray[i];
                            ret += Math.pow(base, i) * ALPHABET.indexOf(cipher);
                        }
                        return ret;
                    }
                };
            }
            var out = source.match(/}\('(.*)', *(\d+), *(\d+), *'(.*?)'\.split\('\|'\)/);
            // Payload
            var payload = out[1];
            // Words
            var symtab = out[4].split(/\|/);
            // Radix
            var radix = parseInt(out[2]);
            // Words Count
            var count = parseInt(out[3]);
            if (count != symtab.length) {
                throw Error("Malformed p.a.c.k.e.r symtab !");
            }
            var unbase = getUnbase(radix);
            function lookup(matches) {
                var word = matches;
                var ub = symtab[unbase(word)];
                var ret = ub ? ub : word;
                return ret;
            }
            var result = payload.replace(/\b\w+\b/g, lookup);
            result = result.replace(/\\/g, '');
            return result;
        }
        tools.unpackJS = unpackJS;
        let parseUrlOptions = {
            strictMode: false,
            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };
        function parseUrl(str) {
            var o = parseUrlOptions, m = o.parser[o.strictMode ? "strict" : "loose"].exec(str), uri = {}, i = 14;
            while (i--)
                uri[o.key[i]] = m[i] || "";
            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                if ($1)
                    uri[o.q.name][$1] = $2;
            });
            uri.queryString = uri.query;
            uri.query = parseUrlQuery(str);
            return uri;
        }
        tools.parseUrl = parseUrl;
        function parseUrlQuery(url) {
            if (url.indexOf("?") == -1) {
                return {};
            }
            var query_string = {};
            var query = url.substr(url.indexOf("?") + 1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                }
                else if (typeof query_string[pair[0]] === "string") {
                    var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                }
                else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
            return query_string;
        }
        tools.parseUrlQuery = parseUrlQuery;
        function getUrlFileName(url) {
            return createRequest({ url: url, type: "HEAD" /* HEAD */ }).then(function (xhr) {
                var filename = ((xhr.getResponseHeader("content-disposition") || "").match(/filename="([^"]*)/) || [])[1];
                if (filename && filename != "") {
                    return filename;
                }
                else {
                    return decodeURIComponent(url.substring(url.lastIndexOf('/') + 1).replace(/[&\?].*/, ""));
                }
            });
        }
        tools.getUrlFileName = getUrlFileName;
        function getRedirectedUrl(url) {
            return createRequest({ url: url, type: "HEAD" /* HEAD */ }).then(function (xhr) {
                return xhr.responseURL;
            });
        }
        tools.getRedirectedUrl = getRedirectedUrl;
        function objToURLParams(obj) {
            var str = "";
            for (var key in obj) {
                str += "&" + key + "=" + encodeURIComponent(obj[key]);
            }
            return str.substr(1);
        }
        tools.objToURLParams = objToURLParams;
        function addParamsToURL(url, obj) {
            if (obj) {
                return url + (url.lastIndexOf("?") < url.lastIndexOf("/") ? "?" : "&") + objToURLParams(obj);
            }
            else {
                return url;
            }
        }
        tools.addParamsToURL = addParamsToURL;
        function createRequest(args) {
            return new Promise((resolve, reject) => {
                let xmlHttpObj = null;
                if (OV.environment.browser() == "firefox" /* Firefox */ && (args.referer || args.hideRef)) {
                    xmlHttpObj = new XMLHttpRequest(); //(window as any).XPCNativeWrapper(new (window as any).wrappedJSObject.XMLHttpRequest());
                }
                else if (args.xmlHttpObj) {
                    xmlHttpObj = args.xmlHttpObj;
                }
                else {
                    xmlHttpObj = new XMLHttpRequest();
                }
                var type = args.type || "GET" /* GET */;
                var protocol = args.protocol || "https://";
                if (args.referer) {
                    args.data = OV.object.merge(args.data, { OVReferer: encodeURIComponent(btoa(args.referer)) });
                }
                else if (args.hideRef) {
                    args.data = OV.object.merge(args.data, { isOV: "true" });
                }
                var url = OV.tools.addParamsToURL(args.url, args.data).replace(/[^:]+:\/\//, protocol);
                xmlHttpObj.open(type, url, true);
                xmlHttpObj.onload = function () {
                    if (xmlHttpObj.status == 200) {
                        resolve(xmlHttpObj);
                    }
                    else {
                        reject(Error(xmlHttpObj.statusText + " (url: '" + url + "')"));
                    }
                };
                xmlHttpObj.onerror = function () {
                    reject(Error("Network Error (url: '" + url + "')"));
                };
                if (args.headers) {
                    for (var key in args.headers) {
                        xmlHttpObj.setRequestHeader(key, args.headers[key]);
                    }
                }
                let formData = null;
                if (args.formData) {
                    formData = new FormData();
                    for (var key in args.formData) {
                        formData.append(key, args.formData[key]);
                    }
                }
                if (args.cache == false) {
                    xmlHttpObj.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
                    xmlHttpObj.setRequestHeader('cache-control', 'max-age=0');
                    xmlHttpObj.setRequestHeader('expires', '0');
                    xmlHttpObj.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
                    xmlHttpObj.setRequestHeader('pragma', 'no-cache');
                }
                if (args.beforeSend) {
                    args.beforeSend(xmlHttpObj);
                }
                xmlHttpObj.send(formData);
            });
        }
        tools.createRequest = createRequest;
    })(tools = OV.tools || (OV.tools = {}));
    let html;
    (function (html) {
        function getAttributes(elem) {
            let hash = {};
            for (let i = 0; i < elem.attributes.length; i++) {
                hash[elem.attributes[i].name] = elem.attributes[i].value;
            }
            return hash;
        }
        html.getAttributes = getAttributes;
        function addAttributeListener(elem, attribute, callback) {
            var lastValue = elem.getAttribute(attribute);
            setInterval(function () {
                var value = elem.getAttribute(attribute);
                if (value != lastValue) {
                    callback.call(elem, attribute, value, lastValue, elem);
                    lastValue = value;
                }
            }, 10);
        }
        html.addAttributeListener = addAttributeListener;
    })(html = OV.html || (OV.html = {}));
    let page;
    (function (page) {
        function isReady() {
            return new Promise(function (resolve, reject) {
                if (document.readyState.match(/(loaded|complete)/)) {
                    return Promise.resolve();
                }
                else {
                    return OV.tools.eventOne(document, "DOMContentLoaded").then(function (e) {
                        resolve();
                    });
                }
            });
        }
        page.isReady = isReady;
        function injectScript(file) {
            return new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = chrome.extension.getURL("/assets/js/lib/" + file + ".js");
                script.async = true;
                script.onload = function () {
                    script.onload = null;
                    resolve(script);
                };
                document.body.appendChild(script);
            });
        }
        page.injectScript = injectScript;
        function injectScripts(files) {
            return Promise.all(files.map(injectScript));
        }
        page.injectScripts = injectScripts;
        function injectRawJS(source, data) {
            return new Promise(function (resolve, reject) {
                var injectStr = source.toString();
                injectStr = "(" + source + ")(" + JSON.stringify(data || {}) + ");";
                var script = document.createElement('script');
                script.appendChild(document.createTextNode(injectStr));
                script.async = true;
                script.onload = function () {
                    script.onload = null;
                    resolve(script);
                };
                document.body.appendChild(script);
            });
        }
        page.injectRawJS = injectRawJS;
        function execute(files, source, data) {
            return new Promise(function (resolve, reject) {
                if (files.indexOf("openvideo") == -1) {
                    files.unshift("openvideo");
                }
                OV.messages.addListener({
                    ovInjectResponse: function (request, sendResponse) {
                        if (request.data.response) {
                            resolve(request.data.response);
                        }
                        return { blocked: true };
                    }
                });
                var sendResponse = function (resData) {
                    OV.messages.send({ func: "ovInjectResponse", data: { response: resData } });
                };
                injectScripts(files).then(function (scripts) {
                    return injectRawJS("function(data){ (" + source + ")(data, (" + sendResponse + ")); }", data);
                });
            });
        }
        page.execute = execute;
        function lookupCSS(args, callback) {
            for (let styleSheet of document.styleSheets) {
                try {
                    for (let cssRule of styleSheet.cssRules) {
                        if (cssRule.style) {
                            if (args.key) {
                                if (cssRule.style[args.key].match(args.value)) {
                                    callback({ cssRule: cssRule, key: args.key, value: args.value, match: cssRule.style[args.key].match(args.value) });
                                }
                            }
                            else if (args.value) {
                                for (var style of cssRule.style) {
                                    if (cssRule.style[style] && cssRule.style[style].match(args.value)) {
                                        callback({ cssRule: cssRule, key: style, value: args.value, match: cssRule.style[style].match(args.value) });
                                    }
                                }
                            }
                            else {
                                callback({ cssRule: cssRule, key: null, value: null, match: null });
                            }
                        }
                    }
                }
                catch (e) { }
                ;
            }
        }
        page.lookupCSS = lookupCSS;
        function getUrlObj() {
            return OV.tools.hashToObj(document.location.href);
        }
        page.getUrlObj = getUrlObj;
        function getObjUrl(obj) {
            return location.href.substr(location.href.indexOf("?hash=")) + OV.tools.objToHash(obj);
        }
        page.getObjUrl = getObjUrl;
        function isFrame() {
            try {
                return self !== top;
            }
            catch (e) {
                return true;
            }
        }
        page.isFrame = isFrame;
        function wrapType(origConstr, wrapper) {
            window[origConstr.name] = function (a, b, c, d, e, f) {
                var obj = new origConstr(a, b, c, d, e, f);
                var proxyWrapper = new Proxy(obj, {
                    get: function (target, name) {
                        if (wrapper[name]) {
                            return wrapper[name].get(target);
                        }
                        else if (typeof target[name] === "function") {
                            return target[name].bind(target);
                        }
                        else {
                            return target[name];
                        }
                    }, set: function (target, name, value) {
                        if (wrapper[name]) {
                            if (wrapper[name].set) {
                                wrapper[name].set(target, value);
                            }
                        }
                        else {
                            target[name] = value;
                        }
                        return true;
                    }
                });
                return proxyWrapper;
            };
        }
        page.wrapType = wrapType;
    })(page = OV.page || (OV.page = {}));
    /*OV.tab.setIconPopup = function(url) {
        OV.background.execute("setIconPopup", null, {url: url});
    }
    OV.tab.setIconText = function(text) {
        OV.background.execute("setIconText",null, {text: text});
    }*/
    let storage;
    (function (storage) {
        function get(scope, name) {
            return new Promise(function (resolve, reject) {
                if (scope == "local" /* Local */) {
                    chrome.storage.local.get(name, function (item) {
                        resolve(item[name]);
                    });
                }
                else if (scope == "sync" /* Sync */) {
                    chrome.storage.sync.get(name, function (item) {
                        resolve(item[name]);
                    });
                }
            });
        }
        storage.get = get;
        function set(scope, name, value) {
            return new Promise(function (resolve, reject) {
                if (scope == "local" /* Local */) {
                    chrome.storage.local.set({ [name]: value }, function () {
                        resolve({ success: true });
                    });
                }
                else if (scope == "sync" /* Sync */) {
                    chrome.storage.sync.set({ [name]: value }, function () {
                        resolve({ success: true });
                    });
                }
            });
        }
        storage.set = set;
        function setup() {
            OV.messages.setupBackground({
                getStorageData: function (msg, bgdata, sender, sendResponse) {
                    get(bgdata.scope, bgdata.name).then(sendResponse, sendResponse);
                },
                setStorageData: function (msg, bgdata, sender, sendResponse) {
                    set(bgdata.scope, bgdata.name, bgdata.value).then(sendResponse, sendResponse);
                }
            });
        }
        storage.setup = setup;
        let local;
        (function (local) {
            function get(name) {
                if (OV.environment.isBackgroundPage()) {
                    return OV.storage.get("local" /* Local */, name);
                }
                else {
                    return OV.messages.send({ bgdata: { func: "getStorageData", data: { scope: "local", name: name } } }).then(function (response) {
                        return response.data;
                    });
                }
            }
            local.get = get;
            function set(name, value) {
                if (OV.environment.isBackgroundPage()) {
                    return OV.storage.set("local" /* Local */, name, value);
                }
                else {
                    return OV.messages.send({ bgdata: { func: "setStorageData", data: { scope: "local", name: name, value: value } } }).then(function () {
                        return { success: true };
                    });
                }
            }
            local.set = set;
        })(local = storage.local || (storage.local = {}));
        let sync;
        (function (sync) {
            function get(name) {
                if (OV.environment.isBackgroundPage()) {
                    return OV.storage.get("sync" /* Sync */, name);
                }
                else {
                    return OV.messages.send({ bgdata: { func: "getStorageData", data: { scope: "sync", name: name } } }).then(function (response) {
                        return response.data;
                    });
                }
            }
            sync.get = get;
            function set(name, value) {
                if (OV.environment.isBackgroundPage()) {
                    return OV.storage.set("sync" /* Sync */, name, value);
                }
                else {
                    return OV.messages.send({ bgdata: { func: "setStorageData", data: { scope: "sync", name: name, value: value } } }).then(function () {
                        return { success: true };
                    });
                }
            }
            sync.set = set;
        })(sync = storage.sync || (storage.sync = {}));
    })(storage = OV.storage || (OV.storage = {}));
    let environment;
    (function (environment) {
        let _isBGPage = false;
        function declareBGPage() {
            _isBGPage = true;
        }
        environment.declareBGPage = declareBGPage;
        function getVidPlaySiteUrl(vidHash) {
            return chrome.extension.getURL("/html/VidPlaySite/VidPlaySite.html") + OV.tools.objToHash(vidHash);
        }
        environment.getVidPlaySiteUrl = getVidPlaySiteUrl;
        function getVidPopupSiteUrl(vidHash) {
            return chrome.extension.getURL("/html/VideoPopup/VideoPopup.html") + OV.tools.objToHash(vidHash);
        }
        environment.getVidPopupSiteUrl = getVidPopupSiteUrl;
        function getOptionsSiteUrl() {
            return chrome.extension.getURL("/html/OptionsSite/OptionsSite.html");
        }
        environment.getOptionsSiteUrl = getOptionsSiteUrl;
        function getLibrarySiteUrl() {
            return chrome.extension.getURL("/html/LibrarySite/librarySite.html");
        }
        environment.getLibrarySiteUrl = getLibrarySiteUrl;
        function isExtensionPage(url) {
            if (OV.environment.browser() == "chrome" /* Chrome */) {
                return url.indexOf("chrome-extension://") != -1;
            }
            else {
                return url.indexOf("moz-extension://") != -1;
            }
        }
        environment.isExtensionPage = isExtensionPage;
        function getRoot() {
            return chrome.extension.getURL("");
        }
        environment.getRoot = getRoot;
        function isBackgroundPage() {
            return _isBGPage;
        }
        environment.isBackgroundPage = isBackgroundPage;
        function getManifest() {
            return chrome.runtime.getManifest();
        }
        environment.getManifest = getManifest;
        function browser() {
            if (navigator.userAgent.search("Firefox") != -1) {
                return "firefox" /* Firefox */;
            }
            else if (navigator.userAgent.search("Chrome") != -1) {
                return "chrome" /* Chrome */;
            }
            else {
                throw Error("User agentis neither chrome nor Firefox");
            }
        }
        environment.browser = browser;
    })(environment = OV.environment || (OV.environment = {}));
    let analytics;
    (function (analytics) {
        function generateCID() {
            var ts = Math.round(+new Date() / 1000.0);
            var rand = Math.round(Math.random() * 2147483647);
            return [rand, ts].join('.');
        }
        function getCID() {
            return OV.storage.sync.get("AnalyticsCID").then(function (cid) {
                if (!cid) {
                    cid = generateCID();
                    OV.storage.sync.set("AnalyticsCID", cid);
                }
                return cid;
            });
        }
        analytics.getCID = getCID;
        function postData(data) {
            return OV.storage.sync.get("AnalyticsEnabled").then(function (value) {
                if (value || value == undefined) {
                    return getCID().then(function (cid) {
                        data = Object.assign({ v: 1, tid: "UA-118573631-1", cid: cid }, data);
                        return OV.tools.createRequest({
                            url: "https://www.google-analytics.com/collect",
                            type: "POST" /* POST */,
                            data: data
                        });
                    });
                }
                return Promise.reject(Error("Analytics is disabled!"));
            });
        }
        analytics.postData = postData;
        function send(data) {
            if (OV.environment.isBackgroundPage()) {
                return postData(data).then(function () { return { success: true }; });
            }
            else {
                return OV.messages.send({ bgdata: { func: "analytics", data: data } }).then(function () { return { success: true }; });
            }
        }
        analytics.send = send;
        function fireEvent(category, action, label) {
            send({ t: "event", ec: category, ea: action, el: label });
        }
        analytics.fireEvent = fireEvent;
    })(analytics = OV.analytics || (OV.analytics = {}));
    let proxy;
    (function (proxy_1) {
        function setupBG() {
            OV.messages.setupBackground({
                proxySetup: function (data, bgdata, sender, sendResponse) {
                    _setup({ ip: bgdata.ip, port: bgdata.port, country: bgdata.country }).then(sendResponse);
                },
                proxyUpdate: function (data, bgdata, sender, sendResponse) {
                    _update().then(sendResponse);
                },
                proxyRemove: function (data, bgdata, sender, sendResponse) {
                    _remove();
                },
                proxyAddHostToList: function (data, bgdata, sender, sendResponse) {
                    _addHostToList(bgdata.host);
                },
                proxyNewProxy: function (data, bgdata, sender, sendResponse) {
                    _newProxy().then(sendResponse);
                },
                proxyGetCurrent: function (data, bgdata, sender, sendResponse) {
                    sendResponse(currentProxy);
                }
            });
        }
        proxy_1.setupBG = setupBG;
        let currentProxy = null;
        function setup(proxy) {
            if (OV.environment.isBackgroundPage()) {
                return _setup(proxy);
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxySetup", data: { proxy: proxy } } }).then(function (response) {
                    return response.data;
                });
            }
        }
        proxy_1.setup = setup;
        function _setup(proxy) {
            return new Promise(function (resolve, reject) {
                remove();
                currentProxy = proxy;
                OV.storage.sync.set("ProxyEnabled", currentProxy);
                if (OV.environment.browser() == "chrome" /* Chrome */) {
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
                    browser.proxy.register("/assets/js/pacFF.js");
                    browser.runtime.sendMessage({ proxy: currentProxy, hosts: hosts }, { toProxyScript: true });
                }
                resolve(currentProxy);
            });
        }
        function update() {
            if (OV.environment.isBackgroundPage()) {
                return _update();
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxyUpdate", data: {} } }).then(function (response) {
                    return response.data;
                });
            }
        }
        proxy_1.update = update;
        function _update() {
            if (_isEnabled()) {
                return setup(currentProxy);
            }
            else {
                return Promise.reject(Error("Proxy can't be updated not enabled!"));
            }
        }
        function newProxy() {
            if (OV.environment.isBackgroundPage()) {
                return _newProxy();
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxyNewProxy", data: {} } }).then(function (response) {
                    return response.data;
                });
            }
        }
        proxy_1.newProxy = newProxy;
        let triedProxies = [];
        let proxies = [];
        function _newProxy() {
            if (_isEnabled()) {
                triedProxies.push(currentProxy.ip);
            }
            if (proxies.length == 0 || triedProxies.length > 20 || triedProxies.length == proxies.length) {
                return searchProxies().then(function (newproxies) {
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
        function isEnabled() {
            return getCurrentProxy().then(function (proxy) {
                return proxy != null;
            });
        }
        proxy_1.isEnabled = isEnabled;
        function _isEnabled() {
            return currentProxy != null;
        }
        function getCurrentProxy() {
            if (OV.environment.isBackgroundPage()) {
                return Promise.resolve(currentProxy);
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxyGetCurrent", data: {} } }).then(function (response) {
                    return response.data;
                });
            }
        }
        proxy_1.getCurrentProxy = getCurrentProxy;
        function remove() {
            if (OV.environment.isBackgroundPage()) {
                _remove();
            }
            else {
                OV.messages.send({ bgdata: { func: "proxyRemove", data: {} } });
            }
        }
        proxy_1.remove = remove;
        function _remove() {
            if (OV.environment.browser() == "chrome" /* Chrome */) {
                chrome.proxy.settings.clear({});
            }
            else {
                browser.proxy.unregister();
            }
            currentProxy = null;
            OV.storage.sync.set("ProxyEnabled", false);
        }
        function searchProxies() {
            var url = "https://free-proxy-list.net/anonymous-proxy.html";
            return OV.tools.createRequest({ url: url }).then(function (xhr) {
                let HTML = (new DOMParser()).parseFromString(xhr.response, "text/html");
                var table = HTML.getElementsByTagName("table")[0];
                var tableRows = table.getElementsByTagName("tr");
                var proxies = [];
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
        let hosts = [];
        function addHostToList(host) {
            if (OV.environment.isBackgroundPage()) {
                _addHostToList(host);
            }
            else {
                OV.messages.send({ bgdata: { func: "proxyAddHostToList", data: { host: host } } });
            }
        }
        proxy_1.addHostToList = addHostToList;
        function _addHostToList(host) {
            if (hosts.indexOf(host) == -1) {
                hosts.push(host);
            }
        }
        function addHostsToList(hosts) {
            for (var host of hosts) {
                _addHostToList(host);
            }
        }
        proxy_1.addHostsToList = addHostsToList;
    })(proxy = OV.proxy || (OV.proxy = {}));
    let languages;
    (function (languages) {
        function getMsg(msgName, args) {
            var msg = chrome.i18n.getMessage(msgName);
            if (args) {
                for (var key in args) {
                    msg = msg.replace("{" + key + "}", args[key]);
                }
            }
            return msg;
        }
        languages.getMsg = getMsg;
    })(languages = OV.languages || (OV.languages = {}));
    let messages;
    (function (messages) {
        let State;
        (function (State) {
            State["EvToMdw"] = "EvToMdw";
            State["MdwToBG"] = "MdwToBG";
            State["BGToMdw"] = "BGToMdw";
            State["MdwToEv"] = "MdwToEv";
            State["EvToMdwRsp"] = "EvToMdwRsp";
            State["MdwToBGRsp"] = "MdwToBGRsp";
            State["BGToMdwRsp"] = "BGToMdwRsp";
            State["MdwToEvRsp"] = "MdwToEvRsp";
        })(State = messages.State || (messages.State = {}));
        function generateHash() {
            var ts = Math.round(+new Date() / 1000.0);
            var rand = Math.round(Math.random() * 2147483647);
            return [rand, ts].join('.');
        }
        messages.generateHash = generateHash;
        let lnfunctions = null;
        let blockedFuncs = [];
        function addListener(functions) {
            if (lnfunctions) {
                lnfunctions = OV.object.merge(lnfunctions, functions);
            }
            else {
                lnfunctions = functions;
                document.addEventListener('ovmessage', function (event) {
                    var details = event.detail;
                    if (lnfunctions[details.data.func] && details.data.state === State.MdwToEv && blockedFuncs.indexOf(details.data.func) == -1) {
                        try {
                            var result = lnfunctions[details.data.func](details.data, function (data) {
                                var event = new CustomEvent('ovmessage', {
                                    detail: {
                                        hash: details.hash,
                                        data: {
                                            data: data,
                                            state: State.EvToMdwRsp,
                                            call: details.data,
                                            sender: { url: location.href }
                                        }
                                    }
                                });
                                document.dispatchEvent(event);
                            });
                        }
                        catch (e) {
                            throw { error: e, sender: details.data.sender };
                        }
                        if (result && result.blocked) {
                            blockedFuncs.push(details.data.func);
                        }
                    }
                });
            }
        }
        messages.addListener = addListener;
        function send(obj) {
            return eventPingPong({
                func: obj.func || "NO_FUNCTION",
                data: obj.data || {},
                sender: { url: location.href },
                bgdata: obj.bgdata,
                state: State.EvToMdw
            }, true);
        }
        messages.send = send;
        function eventPingPong(data, beforeBG) {
            return new Promise(function (resolve, reject) {
                data.state = beforeBG ? State.EvToMdw : State.MdwToEv;
                let hash = OV.messages.generateHash();
                let one = function (event) {
                    var details = event.detail;
                    if (details.hash === hash && details.data.state === (beforeBG ? State.MdwToEvRsp : State.EvToMdwRsp)) {
                        document.removeEventListener('ovmessage', one);
                        resolve(details.data);
                    }
                };
                document.addEventListener('ovmessage', one);
                let event = new CustomEvent('ovmessage', {
                    detail: {
                        hash: hash,
                        data: data
                    }
                });
                document.dispatchEvent(event);
            });
        }
        let isMiddleware_ = false;
        function isMiddleware() {
            return isMiddleware;
        }
        messages.isMiddleware = isMiddleware;
        function setupMiddleware() {
            if (isMiddleware_) {
                throw Error("Middleware already set up!");
            }
            else {
                isMiddleware_ = true;
                document.addEventListener('ovmessage', function (event) {
                    var details = event.detail;
                    if (details.data.state === State.EvToMdw) {
                        details.data.state = State.MdwToBG;
                        if (details.data.bgdata) {
                            chrome.runtime.sendMessage(details.data, function (resData) {
                                if (resData.state === State.BGToMdwRsp) {
                                    var event = new CustomEvent('ovmessage', {
                                        detail: {
                                            hash: details.hash,
                                            data: {
                                                data: resData.data,
                                                state: State.MdwToEvRsp,
                                                call: resData.call,
                                                sender: resData.sender
                                            }
                                        }
                                    });
                                    document.dispatchEvent(event);
                                }
                                else {
                                    throw Error("Wrong Response!");
                                }
                            });
                        }
                        else {
                            eventPingPong(details.data, false).then(function (response) {
                                var event = new CustomEvent('ovmessage', {
                                    detail: {
                                        hash: details.hash,
                                        data: {
                                            data: response.data,
                                            state: State.MdwToEvRsp,
                                            call: response.call,
                                            sender: response.sender
                                        }
                                    }
                                });
                                document.dispatchEvent(event);
                            });
                        }
                    }
                });
                chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
                    if (msg.state === State.BGToMdw) {
                        eventPingPong({
                            func: msg.func,
                            data: msg.data,
                            sender: sender,
                            state: State.MdwToEv,
                            bgdata: msg.bgdata
                        }, false).then(function (response) {
                            sendResponse({ data: response.data, state: State.MdwToBGRsp, call: response.call, sender: response.sender });
                        });
                        return true;
                    }
                    return false;
                });
            }
        }
        messages.setupMiddleware = setupMiddleware;
        let bgfunctions = null;
        function setupBackground(functions) {
            if (bgfunctions) {
                bgfunctions = OV.object.merge(bgfunctions, functions);
            }
            else {
                bgfunctions = functions;
                chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
                    if (msg.state === State.MdwToBG) {
                        if (bgfunctions[msg.bgdata.func]) {
                            bgfunctions[msg.bgdata.func]({ func: msg.func, data: msg.data, state: State.BGToMdw, sender: sender, bgdata: msg.bgdata }, msg.bgdata.data, sender, function (response) {
                                sendResponse({ data: response, state: State.BGToMdwRsp, call: msg, sender: sender });
                            });
                            return true;
                        }
                    }
                    return false;
                });
            }
        }
        messages.setupBackground = setupBackground;
    })(messages = OV.messages || (OV.messages = {}));
})(OV || (OV = {}));
//# sourceMappingURL=openvideo.js.map