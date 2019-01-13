/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(4);
function setup() {
    Messages.setupBackground({
        getStorageData: function (msg, bgdata, sender, sendResponse) {
            chrome.storage.local.get(bgdata.name, function (item) {
                sendResponse(item[bgdata.name]);
            });
        },
        setStorageData: function (msg, bgdata, sender, sendResponse) {
            chrome.storage.local.set({ [bgdata.name]: bgdata.value }, function () {
                sendResponse({ success: true });
            });
        }
    });
}
exports.setup = setup;
var local;
(function (local) {
    function get(name) {
        if (Environment.isBackgroundPage()) {
            return new Promise(function (resolve, reject) {
                chrome.storage.local.get(name, function (item) {
                    resolve(item[name]);
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "getStorageData", data: { scope: "local", name: name } } }).then(function (response) {
                return response.data;
            });
        }
    }
    local.get = get;
    function set(name, value) {
        if (Environment.isBackgroundPage()) {
            return new Promise(function (resolve, reject) {
                chrome.storage.local.set({ [name]: value }, function () {
                    resolve({ success: true });
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "setStorageData", data: { scope: "local", name: name, value: value } } }).then(function () {
                return { success: true };
            });
        }
    }
    local.set = set;
})(local = exports.local || (exports.local = {}));
var sync;
(function (sync) {
    function get(name) {
        if (Environment.isBackgroundPage()) {
            return new Promise(function (resolve, reject) {
                chrome.storage.sync.get(name, function (item) {
                    resolve(item[name]);
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "getStorageData", data: { scope: "sync", name: name } } }).then(function (response) {
                return response.data;
            });
        }
    }
    sync.get = get;
    function set(name, value) {
        if (Environment.isBackgroundPage()) {
            return new Promise(function (resolve, reject) {
                chrome.storage.sync.set({ [name]: value }, function () {
                    resolve({ success: true });
                });
            });
        }
        else {
            return Messages.send({ bgdata: { func: "setStorageData", data: { scope: "sync", name: name, value: value } } }).then(function () {
                return { success: true };
            });
        }
    }
    sync.set = set;
})(sync = exports.sync || (exports.sync = {}));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
var State;
(function (State) {
    State["EvToMdw"] = "EvToMdw";
    State["MdwToBG"] = "MdwToBG";
    State["BGToMdw"] = "BGToMdw";
    State["MdwToEv"] = "MdwToEv";
    State["EvToMdwRsp"] = "EvToMdwRsp";
    State["MdwToBGRsp"] = "MdwToBGRsp";
    State["BGToMdwRsp"] = "BGToMdwRsp";
    State["MdwToEvRsp"] = "MdwToEvRsp";
})(State = exports.State || (exports.State = {}));
let lnfunctions = null;
let blockedFuncs = [];
function addListener(functions) {
    if (lnfunctions) {
        lnfunctions = Tools.merge(lnfunctions, functions);
    }
    else {
        lnfunctions = functions;
        document.addEventListener('ovmessage', function (ev) {
            let event = ev;
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
exports.addListener = addListener;
function send(obj) {
    return eventPingPong({
        func: obj.func || "NO_FUNCTION",
        data: obj.data || {},
        sender: { url: location.href },
        bgdata: obj.bgdata,
        state: State.EvToMdw
    }, true);
}
exports.send = send;
function eventPingPong(data, beforeBG) {
    return new Promise(function (resolve, reject) {
        data.state = beforeBG ? State.EvToMdw : State.MdwToEv;
        let hash = Tools.generateHash();
        let one = function (ev) {
            let event = ev;
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
exports.isMiddleware = isMiddleware;
function setupMiddleware() {
    if (isMiddleware_) {
        throw Error("Middleware already set up!");
    }
    else {
        isMiddleware_ = true;
        document.addEventListener('ovmessage', function (ev) {
            let event = ev;
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
exports.setupMiddleware = setupMiddleware;
let bgfunctions = null;
function setupBackground(functions) {
    if (bgfunctions) {
        bgfunctions = Tools.merge(bgfunctions, functions);
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
exports.setupBackground = setupBackground;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function generateHash() {
    var ts = Math.round(+new Date() / 1000.0);
    var rand = Math.round(Math.random() * 2147483647);
    return [rand, ts].join('.');
}
exports.generateHash = generateHash;
function merge(obj1, obj2) {
    return Object.assign({}, obj1, obj2);
}
exports.merge = merge;
function eventOne(elem, type) {
    return new Promise(function (resolve, reject) {
        elem.addEventListener(type, function one(e) {
            elem.removeEventListener(type, one);
            resolve(e);
        });
    });
}
exports.eventOne = eventOne;
function matchNull(str, regexp, index) {
    return (str.match(regexp) || [])[index || 1] || "";
}
exports.matchNull = matchNull;
function objToHash(obj) {
    if (obj) {
        return "?hash=" + encodeURIComponent(JSON.stringify(obj));
    }
    else {
        return "";
    }
}
exports.objToHash = objToHash;
function hashToObj(hashStr) {
    var hash = parseUrlQuery(hashStr).hash;
    if (hash == "" || hash == undefined) {
        return null;
    }
    else {
        return JSON.parse(decodeURIComponent(hash));
    }
}
exports.hashToObj = hashToObj;
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
exports.unpackJS = unpackJS;
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
exports.parseUrl = parseUrl;
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
exports.parseUrlQuery = parseUrlQuery;
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
exports.getUrlFileName = getUrlFileName;
function getRedirectedUrl(url) {
    return createRequest({ url: url, type: "HEAD" /* HEAD */ }).then(function (xhr) {
        return xhr.responseURL;
    });
}
exports.getRedirectedUrl = getRedirectedUrl;
function objToURLParams(url, obj) {
    var str = "";
    for (var key in obj) {
        if (!isParamInURL(url, key)) {
            console.log(url);
            str += "&" + key + "=" + encodeURIComponent(obj[key]);
        }
    }
    return str.substr(1);
}
function isParamInURL(url, param) {
    return new RegExp("[\\?|&]" + param + "=", "i").test(url);
}
exports.isParamInURL = isParamInURL;
function addParamsToURL(url, obj) {
    if (url && obj) {
        let query_str = objToURLParams(url, obj);
        if (query_str) {
            return url + (url.lastIndexOf("?") < url.lastIndexOf("/") ? "?" : "&") + query_str;
        }
        else {
            return url;
        }
    }
    else {
        return url;
    }
}
exports.addParamsToURL = addParamsToURL;
function addRefererToURL(url, referer) {
    return addParamsToURL(url, { OVReferer: encodeURIComponent(btoa(referer)) });
}
exports.addRefererToURL = addRefererToURL;
function getRefererFromURL(url) {
    var match = url.match(/[\?&]OVreferer=([^\?&]*)/i);
    if (match) {
        return atob(decodeURIComponent(match[1]));
    }
    else {
        return null;
    }
}
exports.getRefererFromURL = getRefererFromURL;
function createRequest(args) {
    return new Promise((resolve, reject) => {
        let xmlHttpObj = null;
        if (args.xmlHttpObj) {
            xmlHttpObj = args.xmlHttpObj;
        }
        else {
            xmlHttpObj = new XMLHttpRequest();
        }
        var type = args.type || "GET" /* GET */;
        var protocol = args.protocol || "https://";
        if (args.referer) {
            args.data = merge(args.data, { OVReferer: encodeURIComponent(btoa(args.referer)) });
        }
        else if (args.hideRef) {
            args.data = merge(args.data, { isOV: "true" });
        }
        var url = addParamsToURL(args.url, args.data).replace(/[^:]+:\/\//, protocol);
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
exports.createRequest = createRequest;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
let _isBGPage = false;
function declareBGPage() {
    _isBGPage = true;
}
exports.declareBGPage = declareBGPage;
function getVidPlaySiteUrl(vidHash) {
    return chrome.extension.getURL("/pages/videoplay/videoplay.html") + Tools.objToHash(vidHash);
}
exports.getVidPlaySiteUrl = getVidPlaySiteUrl;
function getVideoSearchUrl() {
    return chrome.extension.getURL("/pages/videosearch/videosearch.html");
}
exports.getVideoSearchUrl = getVideoSearchUrl;
function getVidPopupSiteUrl(vidHash) {
    return chrome.extension.getURL("/pages/videopopup/videopopup.html") + Tools.objToHash(vidHash);
}
exports.getVidPopupSiteUrl = getVidPopupSiteUrl;
function getOptionsSiteUrl() {
    return chrome.extension.getURL("/pages/options/options.html");
}
exports.getOptionsSiteUrl = getOptionsSiteUrl;
function getLibrarySiteUrl() {
    return chrome.extension.getURL("/pages/library/library.html");
}
exports.getLibrarySiteUrl = getLibrarySiteUrl;
function getErrorMsg(data) {
    return {
        version: getManifest().version,
        browser: browser(),
        data: data
    };
}
exports.getErrorMsg = getErrorMsg;
function isExtensionPage(url) {
    if (browser() == "chrome" /* Chrome */) {
        return url.indexOf("chrome-extension://") != -1;
    }
    else {
        return url.indexOf("moz-extension://") != -1;
    }
}
exports.isExtensionPage = isExtensionPage;
function getRoot() {
    return chrome.extension.getURL("");
}
exports.getRoot = getRoot;
function isBackgroundPage() {
    return _isBGPage;
}
exports.isBackgroundPage = isBackgroundPage;
function getManifest() {
    return chrome.runtime.getManifest();
}
exports.getManifest = getManifest;
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
exports.browser = browser;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(4);
const Storage = __webpack_require__(1);
function getCID() {
    return Storage.sync.get("AnalyticsCID").then(function (cid) {
        if (!cid) {
            cid = Tools.generateHash();
            Storage.sync.set("AnalyticsCID", cid);
        }
        return cid;
    });
}
exports.getCID = getCID;
function postData(data) {
    return Storage.sync.get("AnalyticsEnabled").then(function (value) {
        if (value || value == undefined) {
            return getCID().then(function (cid) {
                data = Object.assign({ v: 1, tid: "UA-118573631-1", cid: cid }, data);
                return Tools.createRequest({
                    url: "https://www.google-analytics.com/collect",
                    type: "POST" /* POST */,
                    data: data
                });
            });
        }
        return Promise.reject(Error("Analytics is disabled!"));
    });
}
exports.postData = postData;
function send(data) {
    if (Environment.isBackgroundPage()) {
        return postData(data).then(function () { return { success: true }; });
    }
    else {
        return Messages.send({ bgdata: { func: "analytics", data: data } }).then(function () { return { success: true }; });
    }
}
exports.send = send;
function fireEvent(category, action, label) {
    send({ t: "event", ec: category, ea: action, el: label });
}
exports.fireEvent = fireEvent;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
const Messages = __webpack_require__(2);
function getAbsoluteUrl(url) {
    let a = document.createElement('a');
    a.href = url;
    url = a.href;
    return url;
}
exports.getAbsoluteUrl = getAbsoluteUrl;
function getSafeURL(url) {
    return Tools.addRefererToURL(getAbsoluteUrl(url), location.href);
}
exports.getSafeURL = getSafeURL;
function isReady() {
    return new Promise(function (resolve, reject) {
        if (document.readyState.match(/(loaded|complete)/)) {
            return Promise.resolve();
        }
        else {
            return Tools.eventOne(document, "DOMContentLoaded").then(function (e) {
                resolve();
            });
        }
    });
}
exports.isReady = isReady;
function onNodeInserted(target, callback) {
    var observer = new MutationObserver(function (mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                callback(node);
            }
        }
    });
    observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });
    return observer;
}
exports.onNodeInserted = onNodeInserted;
function getNodesWithID() {
    let nodes = {};
    for (let elem of document.querySelectorAll('[id]')) {
        nodes[elem.id] = elem;
    }
    return nodes;
}
exports.getNodesWithID = getNodesWithID;
function getAttributes(elem) {
    let hash = {};
    for (let i = 0; i < elem.attributes.length; i++) {
        hash[elem.attributes[i].name] = elem.attributes[i].value;
    }
    return hash;
}
exports.getAttributes = getAttributes;
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
exports.addAttributeListener = addAttributeListener;
function injectScript(file) {
    return isReady().then(function () {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = chrome.extension.getURL("/inject_scripts/" + file + ".js");
            script.async = true;
            script.onload = function () {
                script.onload = null;
                resolve(script);
            };
            (document.body || document.head).appendChild(script);
        });
    });
}
exports.injectScript = injectScript;
function injectScripts(files) {
    return Promise.all(files.map(injectScript));
}
exports.injectScripts = injectScripts;
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
exports.injectRawJS = injectRawJS;
function execute(files, source, data) {
    return new Promise(function (resolve, reject) {
        if (files.indexOf("openvideo") == -1) {
            files.unshift("openvideo");
        }
        Messages.addListener({
            ovInjectResponse: function (request, sendResponse) {
                if (request.data.response) {
                    resolve(request.data.response);
                }
                return { blocked: true };
            }
        });
        var sendResponse = function (resData) {
            Messages.send({ func: "ovInjectResponse", data: { response: resData } });
        };
        injectScripts(files).then(function (scripts) {
            return injectRawJS("function(data){ (" + source + ")(data, (" + sendResponse + ")); }", data);
        });
    });
}
exports.execute = execute;
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
exports.lookupCSS = lookupCSS;
function getUrlObj() {
    return Tools.hashToObj(document.location.href);
}
exports.getUrlObj = getUrlObj;
function getObjUrl(obj) {
    return location.href.replace(/[\?|&]hash=[^\?|^&]*/, "") + Tools.objToHash(obj);
}
exports.getObjUrl = getObjUrl;
function isFrame() {
    try {
        return self !== top;
    }
    catch (e) {
        return true;
    }
}
exports.isFrame = isFrame;
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
exports.wrapType = wrapType;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getMsg(msgName, args) {
    var msg = chrome.i18n.getMessage(msgName);
    if (args) {
        for (var key in args) {
            msg = msg.replace("{" + key + "}", args[key]);
        }
    }
    return msg;
}
exports.getMsg = getMsg;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(4);
const Analytics = __webpack_require__(5);
const redirect_scripts_base_1 = __webpack_require__(9);
function toTopWindow(msg) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTopWindow", data: {} } });
}
exports.toTopWindow = toTopWindow;
function toActiveTab(msg) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toActiveTab", data: {} } });
}
exports.toActiveTab = toActiveTab;
function toTab(msg) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTab", data: msg.query } });
}
exports.toTab = toTab;
function openTab(url) {
    return Messages.send({ bgdata: { func: "openTab", data: { url: url } } });
}
exports.openTab = openTab;
function pauseAllVideos() {
    return Messages.send({ bgdata: { func: "pauseAllVideos", data: {} } });
}
exports.pauseAllVideos = pauseAllVideos;
function setIconPopup(url) {
    return Messages.send({ bgdata: { func: "setIconPopup", data: { url: url } } });
}
exports.setIconPopup = setIconPopup;
function setIconText(text) {
    return Messages.send({ bgdata: { func: "setIconText", data: { text: text } } });
}
exports.setIconText = setIconText;
function downloadFile(dl) {
    return Messages.send({ bgdata: { func: "downloadFile", data: dl } });
}
exports.downloadFile = downloadFile;
function analytics(data) {
    return Messages.send({ bgdata: { func: "analytics", data: data } });
}
exports.analytics = analytics;
function redirectHosts() {
    return Messages.send({ bgdata: { func: "redirectHosts", data: {} } });
}
exports.redirectHosts = redirectHosts;
function alert(msg) {
    if (Environment.browser() == "chrome" /* Chrome */) {
        Messages.send({ bgdata: { func: "alert", data: { msg: msg } } });
    }
    else {
        window.alert(msg);
    }
}
exports.alert = alert;
function confirm(msg) {
    if (Environment.browser() == "chrome" /* Chrome */) {
        return Messages.send({ bgdata: { func: "confirm", data: { msg: msg } } }).then(function (response) {
            return response.data;
        });
    }
    else {
        return Promise.resolve(window.confirm(msg));
    }
}
exports.confirm = confirm;
function prompt(data) {
    if (Environment.browser() == "chrome" /* Chrome */) {
        return Messages.send({ bgdata: { func: "prompt", data: data } }).then(function (response) {
            return { aborted: response.data.aborted, text: response.data.text };
        });
    }
    else {
        let value = window.prompt(data.msg, data.fieldText);
        return Promise.resolve({ aborted: !value, text: value });
    }
}
exports.prompt = prompt;
function sendMessage(tabid, msg) {
    return new Promise(function (response, reject) {
        chrome.tabs.sendMessage(tabid, {
            func: msg.func,
            data: msg.data,
            state: Messages.State.BGToMdw,
            sender: { url: location.href },
        }, {
            frameId: 0
        }, function (resData) {
            response(resData);
        });
    });
}
exports.sendMessage = sendMessage;
function setup() {
    Messages.setupBackground({
        toTopWindow: function (msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.sendMessage(tabid, msg, { frameId: 0 }, function (resData) {
                sendResponse(resData.data);
            });
        },
        toActiveTab: function (msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.query({ active: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, { frameId: 0 }, function (resData) {
                    if (resData) {
                        sendResponse(resData.data);
                    }
                });
            });
        },
        toTab: function (msg, bgdata, sender, sendResponse) {
            var tabid = sender.tab.id;
            chrome.tabs.query(bgdata, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, function (resData) {
                    if (resData) {
                        sendResponse(resData.data);
                    }
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
        analytics: function (msg, bgdata, sender, sendResponse) {
            if (bgdata["el"]) {
                bgdata["el"] = bgdata["el"].replace("<PAGE_URL>", sender.tab.url);
            }
            console.log(bgdata);
            Analytics.postData(bgdata);
        },
        redirectHosts: function (msg, bgdata, sender, sendResponse) {
            redirect_scripts_base_1.getRedirectHosts().then(function (redirectHosts) {
                sendResponse({ redirectHosts: redirectHosts });
            });
        },
        alert: function (msg, bgdata, sender, sendResponse) {
            window.alert(bgdata.msg);
        },
        prompt: function (msg, bgdata, sender, sendResponse) {
            var value = window.prompt(bgdata.msg, bgdata.fieldText);
            if (value == null || value == "") {
                sendResponse({ aborted: true, text: null });
            }
            else {
                sendResponse({ aborted: false, text: value });
            }
        },
        confirm: function (msg, bgdata, sender, sendResponse) {
            sendResponse(window.confirm(bgdata.msg));
        }
    });
}
exports.setup = setup;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VideoTypes = __webpack_require__(10);
const Tools = __webpack_require__(3);
const Analytics = __webpack_require__(5);
const Environment = __webpack_require__(4);
const Page = __webpack_require__(6);
const Messages = __webpack_require__(2);
const Storage = __webpack_require__(1);
let redirectHosts = [];
;
;
function addRedirectHost(redirectHost) {
    redirectHosts.push(redirectHost);
}
exports.addRedirectHost = addRedirectHost;
function isUrlRedirecting(url) {
    if (Tools.parseUrlQuery(url)["ovignore"] != "true") {
        return false;
    }
    else {
        for (let host of redirectHosts) {
            for (let script of host.scripts) {
                if (url.match(script.urlPattern)) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.isUrlRedirecting = isUrlRedirecting;
function startScripts(scope) {
    return new Promise(function (resolve, reject) {
        if (Tools.parseUrlQuery(location.href)["ovignore"] != "true") {
            for (let host of redirectHosts) {
                isScriptEnabled(host.name).then(function (isEnabled) {
                    if (isEnabled) {
                        for (let script of host.scripts) {
                            let match = location.href.match(script.urlPattern);
                            if (match) {
                                console.log("Redirect with " + host.name);
                                for (let runScope of script.runScopes) {
                                    if (runScope.run_at == scope) {
                                        if (Page.isFrame()) {
                                            resolve();
                                        }
                                        document.documentElement.hidden = runScope.hide_page !== false;
                                        runScope.script({ url: location.href, match: match, hostname: host.name, run_scope: runScope.run_at }).then(function (videoData) {
                                            videoData.origin = location.href;
                                            videoData.host = host.name;
                                            location.href = Environment.getVidPlaySiteUrl(VideoTypes.makeURLsSave(videoData));
                                        }).catch(function (error) {
                                            document.documentElement.hidden = false;
                                            console.error(error);
                                            Analytics.fireEvent(host.name, "Error", JSON.stringify(Environment.getErrorMsg({ msg: error.message, url: location.href, stack: error.stack })));
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    });
}
exports.startScripts = startScripts;
function isScriptEnabled(name) {
    return Storage.sync.get(name).then(function (value) {
        return value == true || value == undefined || value == null;
    });
}
exports.isScriptEnabled = isScriptEnabled;
function setScriptEnabled(name, enabled) {
    return Storage.sync.set(name, enabled);
}
exports.setScriptEnabled = setScriptEnabled;
function getRedirectHosts() {
    return Promise.resolve().then(function () {
        if (Environment.isBackgroundPage()) {
            return redirectHosts;
        }
        else {
            return Messages.send({ bgdata: { func: "redirectHosts", data: {} } }).then(function (response) {
                return response.data.redirectHosts;
            });
        }
    });
}
exports.getRedirectHosts = getRedirectHosts;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Page = __webpack_require__(6);
function makeURLsSave(videoData) {
    for (let track of videoData.tracks) {
        track.src = Page.getSafeURL(track.src);
    }
    for (let src of videoData.src) {
        src.src = Page.getSafeURL(src.src);
        if (src.dlsrc) {
            src.dlsrc.src = Page.getSafeURL(src.dlsrc.src);
        }
    }
    videoData.poster = Page.getSafeURL(videoData.poster);
    return videoData;
}
exports.makeURLsSave = makeURLsSave;


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(4);
const Storage = __webpack_require__(1);
function setupBG() {
    Messages.setupBackground({
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
exports.setupBG = setupBG;
let currentProxy = null;
function setup(proxy) {
    if (Environment.isBackgroundPage()) {
        return _setup(proxy);
    }
    else {
        return Messages.send({ bgdata: { func: "proxySetup", data: { proxy: proxy } } }).then(function (response) {
            return response.data;
        });
    }
}
exports.setup = setup;
function _setup(proxy) {
    return new Promise(function (resolve, reject) {
        remove();
        currentProxy = proxy;
        Storage.sync.set("ProxyEnabled", currentProxy);
        if (Environment.browser() == "chrome" /* Chrome */) {
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
function update() {
    if (Environment.isBackgroundPage()) {
        return _update();
    }
    else {
        return Messages.send({ bgdata: { func: "proxyUpdate", data: {} } }).then(function (response) {
            return response.data;
        });
    }
}
exports.update = update;
function _update() {
    if (_isEnabled()) {
        return setup(currentProxy);
    }
    else {
        return Promise.reject(Error("Proxy can't be updated not enabled!"));
    }
}
function newProxy() {
    if (Environment.isBackgroundPage()) {
        return _newProxy();
    }
    else {
        return Messages.send({ bgdata: { func: "proxyNewProxy", data: {} } }).then(function (response) {
            return response.data;
        });
    }
}
exports.newProxy = newProxy;
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
exports.isEnabled = isEnabled;
function _isEnabled() {
    return currentProxy != null;
}
function getCurrentProxy() {
    if (Environment.isBackgroundPage()) {
        return Promise.resolve(currentProxy);
    }
    else {
        return Messages.send({ bgdata: { func: "proxyGetCurrent", data: {} } }).then(function (response) {
            return response.data;
        });
    }
}
exports.getCurrentProxy = getCurrentProxy;
function remove() {
    if (Environment.isBackgroundPage()) {
        _remove();
    }
    else {
        Messages.send({ bgdata: { func: "proxyRemove", data: {} } });
    }
}
exports.remove = remove;
function _remove() {
    if (Environment.browser() == "chrome" /* Chrome */) {
        chrome.proxy.settings.clear({});
    }
    else {
        browser.proxy.unregister();
    }
    currentProxy = null;
    Storage.sync.set("ProxyEnabled", false);
}
function searchProxies() {
    var url = "https://free-proxy-list.net/anonymous-proxy.html";
    return Tools.createRequest({ url: url }).then(function (xhr) {
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
    if (Environment.isBackgroundPage()) {
        _addHostToList(host);
    }
    else {
        Messages.send({ bgdata: { func: "proxyAddHostToList", data: { host: host } } });
    }
}
exports.addHostToList = addHostToList;
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
exports.addHostsToList = addHostsToList;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Analytics = __webpack_require__(5);
const Page = __webpack_require__(6);
const Languages = __webpack_require__(7);
const Environment = __webpack_require__(4);
const Proxy = __webpack_require__(13);
const Metadata = __webpack_require__(15);
const OVPlayer = __webpack_require__(16);
//declare var videojs : typeof videojs.default;
Page.isReady().then(function (event) {
    //(window as any).video_js_1.default = (window as any).videojs;
    Metadata.requestPlayerCSS().then(function (css) {
        if (css && css.doChange) {
            Page.lookupCSS({ value: /rgba?\(141, 199, 63,?([^\)]*)?\)/ }, function (data) {
                data.cssRule.style[data.key] = css.color;
            });
            Page.lookupCSS({ value: /url\("\/assets\/icons\/playNormal\.png"\)/ }, function (data) {
                data.cssRule.style[data.key] = css.playimage;
            });
            Page.lookupCSS({ value: /url\("\/assets\/icons\/playHover\.png"\)/ }, function (data) {
                data.cssRule.style[data.key] = css.playhoverimage;
            });
            /*lookupCSS({ value: 'url("/assets/icons/reloadNormal.png")' }, function(data){
                data.cssRule.style[data.key] = response.reloadimage;
            });
            lookupCSS({ value: 'url("/assets/icons/reloadHover.png")' }, function(data){
                data.cssRule.style[data.key] = response.reloadhoverimage;
            });*/
        }
    });
    Proxy.getCurrentProxy().then(function (proxy) {
        var msg = "";
        if (proxy) {
            msg = Languages.getMsg("video_player_err_msg_proxy");
        }
        else {
            msg = Languages.getMsg("video_player_err_msg");
        }
        videojs.addLanguage('en', { "The media could not be loaded, either because the server or network failed or because the format is not supported.": msg });
    });
    document.getElementById("js_err_msg").innerText = Languages.getMsg("video_player_js_err_msg");
    var Hash = Page.getUrlObj();
    document.title = Hash.title + " - OpenVideo";
    Analytics.fireEvent(Hash.host, "HosterUsed", "");
    OVPlayer.initPlayer('openVideo', {}, Hash);
    //document.body.style.display = 'none'
    //document.body.style.display = 'block'
    if (Page.isFrame()) {
        var TheaterButton = OVPlayer.getPlayer().getChild('controlBar').addChild('TheaterButton', {});
        OVPlayer.getPlayer().on("ready", function () {
            /*TheatreMode.setupIframe({frameWidth: window.innerWidth, frameHeight: window.innerHeight}).then(function(data){
                if(data && data.reload) {
                    location.reload();
                }
            });*/
            OVPlayer.getPlayer().controlBar.el().insertBefore(TheaterButton.el(), OVPlayer.getPlayer().controlBar.fullscreenToggle.el());
        });
        OVPlayer.getPlayer().on("fullscreenchange", function () {
            TheaterButton.el().style.display = OVPlayer.getPlayer().isFullscreen() ? "none" : "inherit";
        });
    }
    OVPlayer.getPlayer().on('error', function () {
        if (OVPlayer.getPlayer().readyState() == 0) {
            //if(Response.status == 404 || Response.status == 400 || Response.status == 403) {
            Analytics.fireEvent(Hash.host, "Error", JSON.stringify(Environment.getErrorMsg({ msg: OVPlayer.getPlayer().error().message, url: Hash.origin })));
            //}
            //document.location.replace(Hash.vidSiteUrl + (Hash.vidSiteUrl.indexOf("?") == -1 ? "?" : "&") + "ignoreRequestCheck=true");
        }
        else {
            OVPlayer.getPlayer().bigPlayButton.on("click", function () {
                location.replace(OVPlayer.getPlayer().getVideoData().origin);
            });
            OVPlayer.getPlayer().bigPlayButton.addClass("reloadButton");
        }
    });
});


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(4);
const Page = __webpack_require__(6);
const Tools = __webpack_require__(3);
const Background = __webpack_require__(8);
function toDataURL(url) {
    return Tools.createRequest({
        url: url, beforeSend: function (xhr) {
            xhr.responseType = 'blob';
        }
    }).then(function (xhr) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve("url(" + reader.result + ")");
            };
            reader.readAsDataURL(xhr.response);
        });
    });
}
function requestPlayerCSS() {
    return Background.toTopWindow({ func: "requestPlayerCSS", data: {} }).then(function (response) {
        return response.data;
    });
}
exports.requestPlayerCSS = requestPlayerCSS;
function setup() {
    Page.isReady().then(function (event) {
        let ovtags = document.getElementsByTagName("openvideo");
        if (ovtags.length > 0) {
            let ovtag = ovtags[0];
            ovtag.innerText = Environment.getManifest().version;
            /*var reloadimage = null;
        if(ovtag.attributes.reloadimage) {
            reloadimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadimage.value, async: false}).response)+")";
        }
        var reloadhoverimage = null;
        if(ovtag.attributes.reloadhoverimage) {
            reloadhoverimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadhoverimage.value, async: false}).response)+")";
        }*/
            let metadata = null;
            Messages.addListener({
                requestPlayerCSS: function (request, sendResponse) {
                    if (metadata) {
                        sendResponse(metadata);
                    }
                    else {
                        Promise.all([toDataURL(ovtag.getAttribute("playimage")), toDataURL(ovtag.getAttribute("playhoverimage"))]).then(function (dataURLs) {
                            metadata = { doChange: true, color: ovtag.getAttribute("color"), playimage: dataURLs[0], playhoverimage: dataURLs[1] };
                            sendResponse(metadata);
                        });
                    }
                }
            });
            //alert("W2")
            ovtag.dispatchEvent(new Event("ov-metadata-received"));
        }
    });
}
exports.setup = setup;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
const Analytics = __webpack_require__(5);
const Environment = __webpack_require__(4);
const Page = __webpack_require__(6);
const Messages = __webpack_require__(2);
const Storage = __webpack_require__(1);
const Languages = __webpack_require__(7);
const OVPlayerComponents = __webpack_require__(17);
window["Worker"] = undefined;
Messages.setupMiddleware();
Page.wrapType(XMLHttpRequest, {
    open: {
        get: function (target) {
            return function (method, url) {
                if (getPlayer() && getPlayer().currentType().match(/application\//i)) {
                    arguments[1] = Tools.addRefererToURL(url, Page.getUrlObj().origin);
                }
                target.open.apply(target, arguments);
            };
        }
    }
});
let player = null;
function parseSrt(dataAndEvents, oncue) {
    function trim(dataAndEvents) {
        return (dataAndEvents + "").replace(/^\s+|\s+$/g, "");
    }
    function parseCueTime(dataAndEvents) {
        var parts = dataAndEvents.split(":");
        /** @type {number} */
        var sum = 0;
        var minutes;
        var part;
        var url;
        var x;
        var i;
        if (parts.length == 3) {
            minutes = parts[0];
            part = parts[1];
            url = parts[2];
        }
        else {
            minutes = "0";
            part = parts[0];
            url = parts[1];
        }
        url = url.split(/\s+/);
        x = url.splice(0, 1)[0];
        x = x.split(/\.|,/);
        i = parseFloat(x[1]);
        x = x[0];
        sum += parseFloat(minutes) * 3600;
        sum += parseFloat(part) * 60;
        sum += parseFloat(x);
        if (i) {
            sum += i / 1E3;
        }
        return sum;
    }
    if (dataAndEvents == "") {
        alert("Invalid srt file!");
    }
    var tempData;
    var splitted;
    var collection;
    var nodes = dataAndEvents.split("\n");
    var resp = "";
    var user_id;
    var cuelength = 0;
    var n = nodes.length;
    for (var i = 1; i < n; ++i) {
        resp = trim(nodes[i]);
        if (resp) {
            if (resp.indexOf("-->") == -1) {
                user_id = resp;
                resp = trim(nodes[++i]);
            }
            else {
                user_id = cuelength;
            }
            tempData = {
                id: user_id,
                index: cuelength,
                startTime: undefined,
                endTime: undefined,
                text: ""
            };
            splitted = resp.split(/[\t ]+/);
            tempData.startTime = parseCueTime(splitted[0]);
            tempData.endTime = parseCueTime(splitted[2]);
            /** @type {Array} */
            collection = [];
            for (; nodes[++i] && (resp = trim(nodes[i]));) {
                collection.push(resp);
            }
            tempData.text = collection.join("\n");
            oncue({ id: "", startTime: tempData.startTime, endTime: tempData.endTime, text: tempData.text, pauseOnExit: false });
            cuelength += 1;
        }
    }
}
exports.parseSrt = parseSrt;
function addTextTrack(player, rawTrack) {
    Tools.createRequest({ url: rawTrack.src }).then(function (xhr) {
        var srcContent = xhr.responseText;
        //function (srcContent) {
        if (srcContent.indexOf("-->") !== -1) {
            player.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
            let track = player.textTracks()[player.textTracks().length - 1];
            if (rawTrack.default) {
                track.mode = "showing";
            }
            parseSrt(srcContent, function (cue) {
                track.addCue(cue);
            });
        }
        else {
            throw Error("Invaid subtitle file");
        }
    });
}
exports.addTextTrack = addTextTrack;
function getPlayer() {
    return player;
}
exports.getPlayer = getPlayer;
function initPlayer(playerId, options, videoData) {
    OVPlayerComponents.register();
    options = Tools.merge(options, {
        plugins: {
            videoJsResolutionSwitcher: {
                dynamicLabel: true
            }
        },
        /*chromecast:{
             appId:'APP-ID'
        },*/
        playbackRates: [0.5, 1, 2],
        language: Languages.getMsg("video_player_locale")
    });
    player = videojs(playerId, options);
    player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false
    });
    player.getActiveVideoSource = function () {
        for (var src of videoData.src) {
            if (player.src().indexOf(src.src) == 0) {
                return src;
            }
        }
        return null;
    };
    player.on("ready", function () {
        player.el().style.width = "100%";
        player.el().style.height = "100%";
        let ControlBar = player.getChild('controlBar');
        var FavButton = ControlBar.addChild('FavButton', {});
        var DownloadButton = ControlBar.addChild('DownloadButton', {});
        var PatreonButton = ControlBar.addChild('PatreonButton', {});
        var FullscreenToggle = ControlBar.getChild('fullscreenToggle');
        var CaptionsButton = ControlBar.getChild('SubsCapsButton');
        CaptionsButton.show();
        player.on("ratechange", function () {
            Analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
        });
        FullscreenToggle.on("click", function () {
            let fullscreen = player.isFullscreen();
            window.setTimeout(function () {
                if (Environment.browser() == "chrome" /* Chrome */ && !document.fullscreen && player.isFullscreen()) {
                    console.log("FULLSCREEN ERROR");
                    Analytics.fireEvent("FullscreenError", "FullscreenError", "IFrame: '" + videoData.origin + "' Page: '<PAGE_URL>', Version: " + Environment.getManifest().version);
                }
            }, 1000);
        });
        player.controlBar.el().insertBefore(FavButton.el(), CaptionsButton.el());
        player.controlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
        player.controlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
        Storage.sync.get("PlayerVolume").then(function (volume) {
            if (volume) {
                player.volume(volume);
            }
        });
        player.on('volumechange', function () {
            Storage.sync.set("PlayerVolume", player.volume());
        });
        player.on('loadedmetadata', function () {
            player.loadFromHistory();
            FavButton.updateDesign();
        });
        document.body.onmouseleave = function () {
            if (player.currentTime() != 0) {
                player.saveToHistory();
            }
        };
    });
    player.setVideoData = function (videoData) {
        player.poster(Tools.addParamsToURL(videoData.poster, { OVReferer: encodeURIComponent(btoa(videoData.origin)) }));
        var srces = videoData.src;
        var checkedSrces = [];
        for (var src of srces) {
            if (src.src != "") {
                src.src = src.src + (src.src.indexOf("?") == -1 ? "?" : "&") + "isOV=true";
                checkedSrces.push(src);
            }
        }
        srces = checkedSrces;
        if (srces.length == 1) {
            player.src(srces[0]);
        }
        else {
            player.updateSrc(srces);
        }
        for (let track of videoData.tracks) {
            addTextTrack(player, track);
            //player.addRemoteTextTrack(<any>track, true);
        }
    };
    player.getVideoData = function () {
        return videoData;
    };
    player.setVideoData(videoData);
    //player.aspectRatio("0:0");
    player.saveToHistory = function () {
        Storage.sync.get("disableHistory").then(function (disabled) {
            if (!disabled) {
                Storage.local.get("OpenVideoHistory").then(function (history) {
                    if (!history) {
                        history = [];
                    }
                    var itemIndex = history.indexOf(history.find(function (arrElem) {
                        return arrElem.origin == videoData.origin;
                    }));
                    if (itemIndex != -1) {
                        history.splice(itemIndex, 1);
                    }
                    var histHash = {
                        poster: videoData.poster,
                        title: videoData.title,
                        origin: videoData.origin,
                        stoppedTime: player.currentTime()
                    };
                    //player.getVideoFileHash(function(fileHash){
                    //HistHash.fileHash = fileHash;
                    history.unshift(histHash);
                    Storage.local.set("OpenVideoHistory", history);
                    //});
                });
            }
        });
    };
    player.loadFromHistory = function () {
        Storage.local.get("OpenVideoHistory").then(function (history) {
            if (history) {
                //player.getVideoFileHash(function(fileHash){
                var item = history.find(function (arrElem) {
                    return arrElem.origin == videoData.origin;
                });
                if (item) {
                    player.currentTime(item.stoppedTime);
                }
                //});
            }
        });
    };
    return player;
}
exports.initPlayer = initPlayer;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const OVPlayer = __webpack_require__(16);
const Tools = __webpack_require__(3);
const Analytics = __webpack_require__(5);
const Storage = __webpack_require__(1);
const TheatreMode = __webpack_require__(18);
const Background = __webpack_require__(8);
function createDownloadButton(url, fileName, type) {
    var button = document.createElement("button");
    button.className = "vjs-menu-download-button-control";
    button.type = "button";
    button.setAttribute("aria-live", "polite");
    button.setAttribute("aria-disabled", "false");
    var span = document.createElement("span");
    span.className = "vjs-icon-placeholder";
    span.setAttribute('aria-hidden', "true");
    button.appendChild(span);
    button.addEventListener("click", function (event) {
        event.stopPropagation();
        if (type == null || type.indexOf("application/") == -1) {
            var dataHash = { url: url, fileName: "" };
            if (fileName) {
                dataHash.fileName = fileName.replace(/[/\\?%*:|"<>]/g, ' ').trim();
            }
            Background.downloadFile(dataHash);
        }
        else {
            Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
        }
    });
    return button;
}
exports.createDownloadButton = createDownloadButton;
function register() {
    let Button = videojs.getComponent("button");
    let favButton = videojs.extend(Button, {
        constructor: function (player, options) {
            Button.call(this, player, options);
            this.addClass('vjs-favbutton-disabled');
        },
        handleClick: function () {
            Analytics.fireEvent("Favorites", "PlayerEvent", "");
            this.isFavorite(!this.isFavorite());
        },
        isFavorite: function () {
            return !!this.isFavorite_;
        },
        setFavorite: function (value, dontSet) {
            this.isFavorite_ = value;
            if (value) {
                this.removeClass('vjs-favbutton-disabled');
                this.addClass('vjs-favbutton-enabled');
            }
            else {
                this.removeClass('vjs-favbutton-enabled');
                this.addClass('vjs-favbutton-disabled');
            }
            var _this = this;
            if (!dontSet) {
                Storage.local.get("OpenVideoFavorites").then(function (favorites) {
                    if (!favorites) {
                        favorites = [];
                    }
                    var entryIndex = favorites.findIndex(function (arrElem) {
                        return arrElem.origin == _this.player_.getVideoData().origin;
                    });
                    if (entryIndex != -1) {
                        favorites.splice(entryIndex, 1);
                    }
                    if (value) {
                        favorites.unshift(_this.player_.getVideoData());
                    }
                    Storage.local.set("OpenVideoFavorites", favorites);
                });
            }
        },
        updateDesign: function () {
            var _this = this;
            Storage.local.get("OpenVideoFavorites").then(function (favorites) {
                if (favorites) {
                    _this.setFavorite(favorites.findIndex(function (arrElem) {
                        return arrElem.origin == _this.player_.getVideoData().origin;
                    }) != -1, true);
                }
            });
        }
    });
    let theaterButton = videojs.extend(Button, {
        constructor: function (player, options) {
            Button.call(this, player, options);
            this.addClass('vjs-theaterbutton-disabled');
            this.theaterMode = false;
        },
        handleClick: function () {
            Analytics.fireEvent("TheaterMode", "PlayerEvent", "");
            this.setTheaterMode(!this.isTheaterMode());
        },
        isTheaterMode: function () {
            return this.theaterMode;
        },
        setTheaterMode: function (theaterMode) {
            this.theaterMode = theaterMode;
            if (this.theaterMode) {
                this.removeClass('vjs-theaterbutton-disabled');
                this.addClass('vjs-theaterbutton-enabled');
            }
            else {
                this.removeClass('vjs-theaterbutton-enabled');
                this.addClass('vjs-theaterbutton-disabled');
            }
            TheatreMode.setTheatreMode(this.theaterMode);
        }
    });
    let patreonButton = videojs.extend(Button, {
        constructor: function (player, options) {
            Button.call(this, player, options);
            this.addClass('vjs-patreonbutton');
            this.controlText('Become a Patron');
        },
        handleClick: function () {
            Analytics.fireEvent("PatreonButton", "PlayerEvent", "");
            Background.openTab("https://www.patreon.com/bePatron?u=13995915");
        }
    });
    let downloadButton = videojs.extend(Button, {
        constructor: function (player, options) {
            Button.call(this, player, options);
            this.addClass('vjs-download-button-control');
        },
        handleClick: function () {
            var src = this.player_.getActiveVideoSource();
            var file = Tools.merge(src.dlsrc || { src: src.src, type: src.type, filename: null }, { label: src.label });
            if (file.type.indexOf("application/") == -1) {
                var dlData = { url: file.src, fileName: "" };
                var label = file.label;
                dlData.fileName = file.filename || (this.player_.getVideoData().title + "." + file.type.substr(file.type.indexOf("/") + 1)).replace(/[/\\?%*:|"<>]/g, ' ').trim();
                if (label) {
                    dlData.fileName = "[" + label + "]" + dlData.fileName;
                }
                console.log(dlData);
                Background.downloadFile(dlData);
            }
            else {
                Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
            }
        }
    });
    let MenuItem = videojs.getComponent("MenuItem");
    let AddTracksFromFile = videojs.extend(MenuItem, {
        constructor: function (player, options) {
            MenuItem.call(this, player, { label: "load VTT/SRT from File" });
            this.controlText("load VTT/SRT from File");
            let srtSelector = document.createElement("input");
            srtSelector.type = "file";
            srtSelector.accept = ".vtt, .srt, .txt";
            srtSelector.style.display = "none";
            srtSelector.addEventListener("change", function () {
                var collection = new FileReader;
                collection.onload = function (dataAndEvents) {
                    let result = collection.result;
                    if (result.indexOf("-->") !== -1) {
                        player.addTextTrack("captions", srtSelector.files[0].name, "AddedFromUser");
                        var track = player.textTracks()[player.textTracks().length - 1];
                        OVPlayer.parseSrt(result, function (cue) {
                            track.addCue(cue);
                        });
                    }
                    else {
                        Background.alert("Invaid subtitle file");
                    }
                };
                collection.readAsText(srtSelector.files[0], "ISO-8859-1");
            });
            this.srtSelector_ = srtSelector;
        },
        handleClick: function () {
            var srtSelector = this.srtSelector_;
            srtSelector.click();
        }
    });
    let AddTracksFromURL = videojs.extend(MenuItem, {
        constructor: function (player, options) {
            MenuItem.call(this, player, { label: "load VTT/SRT from URL" });
            this.controlText("load VTT/SRT from URL");
        },
        handleClick: function () {
            let player = this.player_;
            Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" }).then(function (response) {
                if (!response.aborted) {
                    Tools.createRequest({ url: response.text }).then(function (xhr) {
                        var srcContent = xhr.responseText;
                        //function (srcContent) {
                        if (srcContent.indexOf("-->") !== -1) {
                            Tools.getUrlFileName(response.text).then(function (fn) {
                                player.addTextTrack("captions", fn, "AddedFromUser");
                                var track = player.textTracks()[player.textTracks().length - 1];
                                OVPlayer.parseSrt(srcContent, function (cue) {
                                    track.addCue(cue);
                                });
                            });
                        }
                        else {
                            Background.alert("Invaid subtitle file");
                        }
                    });
                }
            });
        }
    });
    let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    let oldCreateElrs = resolutionMenuItem.prototype.createEl;
    resolutionMenuItem.prototype.createEl = function () {
        let el = oldCreateElrs.apply(this, arguments);
        function getSrcElem(src, videoTitle) {
            return createDownloadButton(src.src, "[" + src.label + "]" + videoTitle + "." + src.type.substr(src.type.indexOf("/") + 1), src.type);
        }
        let videoTitle = this.player_.getVideoData().title;
        if (this.options_.src[0].dlsrc) {
            el.appendChild(getSrcElem(this.options_.src[0].dlsrc, videoTitle));
        }
        else {
            el.appendChild(getSrcElem(this.options_.src[0], videoTitle));
        }
        return el;
    };
    let subsCapsMenuItem = videojs.getComponent("SubsCapsMenuItem");
    let oldCreateEl = subsCapsMenuItem.prototype.createEl;
    subsCapsMenuItem.prototype.createEl = function () {
        let track = this.options_.track;
        let el = oldCreateEl.apply(this, arguments);
        if (track.language != "AddedFromUser") {
            let videoData = this.player_.getVideoData();
            let rawTrack = videoData.tracks.find(function (rawtrack) {
                return track.label == rawtrack.label;
            });
            if (rawTrack) {
                el.appendChild(createDownloadButton(rawTrack.src, "[" + rawTrack.label + "]" + videoData.title + ".vtt", "text/vtt"));
            }
            return el;
        }
    };
    let subsCapsButton = videojs.getComponent("SubsCapsButton");
    let oldCreateItems = subsCapsButton.prototype.createItems;
    subsCapsButton.prototype.createItems = function () {
        let items = oldCreateItems.apply(this, arguments);
        items.splice(2, 0, new (videojs.getComponent("AddTracksFromFile"))(this.player_, {}));
        items.splice(3, 0, new (videojs.getComponent("AddTracksFromURL"))(this.player_, {}));
        return items;
    };
    videojs.registerComponent('FavButton', favButton);
    videojs.registerComponent('TheaterButton', theaterButton);
    videojs.registerComponent('PatreonButton', patreonButton);
    videojs.registerComponent('DownloadButton', downloadButton);
    videojs.registerComponent('AddTracksFromURL', AddTracksFromURL);
    videojs.registerComponent('AddTracksFromFile', AddTracksFromFile);
}
exports.register = register;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Messages = __webpack_require__(2);
const Storage = __webpack_require__(1);
const Page = __webpack_require__(6);
const Tools = __webpack_require__(3);
const Background = __webpack_require__(8);
let iframes = [];
let activeEntry = null;
function checkCleanup(entry) {
    if (entry == null) {
        return false;
    }
    else if (!entry.iframe || !entry.iframe.parentElement) {
        entry.observer.disconnect();
        entry.shadow.remove();
        return true;
    }
    else {
        return false;
    }
}
function getActiveFrame() {
    if (isFrameActive()) {
        return activeEntry.entry;
    }
    else {
        throw Error("No IFrame in theatre mode!");
    }
}
exports.getActiveFrame = getActiveFrame;
function isFrameActive() {
    if (activeEntry && checkCleanup(activeEntry.entry)) {
        activeEntry = null;
    }
    return activeEntry != null;
}
exports.isFrameActive = isFrameActive;
function getEntry(frameid) {
    for (let i = 0; i < iframes.length; i++) {
        if (checkCleanup(iframes[i])) {
            iframes.splice(i, 1);
            i--;
        }
        else if (iframes[i].iframe.name === frameid) {
            return iframes[i];
        }
    }
    return null;
}
exports.getEntry = getEntry;
function registerIFrame(iframe) {
    function matchesSelector(selector, element) {
        var all = document.querySelectorAll(selector);
        for (var i = 0; i < all.length; i++) {
            if (all[i] === element) {
                return true;
            }
        }
        return false;
    }
    let shadow = document.createElement("ovshadow");
    Page.lookupCSS({}, function (obj) {
        if (obj.cssRule.selectorText.indexOf(" iframe") != -1) {
            if (matchesSelector(obj.cssRule.selectorText, iframe)) {
                if (obj.cssRule.style.width != "") {
                    obj.cssRule.style.setProperty("width", obj.cssRule.style.getPropertyValue("width"), "");
                    obj.cssRule.style.setProperty("height", obj.cssRule.style.getPropertyValue("height"), "");
                }
            }
        }
    });
    if (iframe.hasAttribute("allow")) {
        iframe.setAttribute("allow", iframe.getAttribute("allow").replace(/fullscreen[^;]*;?/i, "fullscreen *;")); //fullscreen *;
    }
    iframe.allowFullscreen = true;
    let observer = new MutationObserver(function (mutations) {
        if (isFrameActive() && getActiveFrame().iframe == iframe) {
            let newleft = Math.floor((window.innerWidth - iframe.clientWidth) / 2).toString() + "px";
            let newtop = Math.floor((window.innerHeight - iframe.clientHeight) / 2).toString() + "px";
            if (iframe.style.left != newleft) {
                iframe.style.setProperty("left", newleft);
                iframe.style.setProperty("top", newtop);
            }
        }
    });
    observer.observe(iframe, { attributes: true, attributeFilter: ["style"] });
    shadow.className = "ov-theaterMode";
    shadow.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    iframe.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    iframe.parentNode.appendChild(shadow);
    iframes.push({ shadow: shadow, iframe: iframe, observer: observer });
    return iframes[iframes.length - 1];
}
exports.registerIFrame = registerIFrame;
function nameIFrames() {
    function nameIFrame(iframe) {
        if (!iframe.hasAttribute("name")) {
            iframe.name = Tools.generateHash();
            if (iframe.width) {
                iframe.style.width = iframe.width;
                iframe.removeAttribute("width");
            }
            if (iframe.height) {
                iframe.style.height = iframe.height;
                iframe.removeAttribute("height");
            }
            let sibling = iframe.nextElementSibling;
            let parent = iframe.parentElement;
            iframe.remove();
            parent.insertBefore(iframe, sibling);
        }
    }
    Page.isReady().then(function () {
        for (let iframe of document.getElementsByTagName("iframe")) {
            nameIFrame(iframe);
        }
    });
    Page.onNodeInserted(document, function (tgt) {
        let target = tgt;
        if (target.getElementsByTagName) {
            let iframes = target.getElementsByTagName("iframe");
            if (target.nodeName.toLowerCase() === "iframe") {
                nameIFrame(target);
            }
            for (let iframe of iframes) {
                nameIFrame(iframe);
            }
        }
    });
}
exports.nameIFrames = nameIFrames;
function activateEntry(entry) {
    if (isFrameActive()) {
        console.log(activeEntry);
        throw Error("Some IFrame is already in theatre mode!");
    }
    else if (entry == null) {
        throw Error("Entry must not be null!");
    }
    else {
        document.body.style.overflow = "hidden";
        activeEntry = { oldCSS: entry.iframe.style.cssText, entry: entry };
        Storage.sync.get("TheatreModeFrameWidth").then(function (frameWidth) {
            setWrapperStyle(entry, frameWidth || 70);
        });
        entry.shadow.style.opacity = "1";
        entry.shadow.style.pointerEvents = "all";
    }
}
exports.activateEntry = activateEntry;
function deactivateEntry() {
    if (!isFrameActive()) {
        throw Error("No IFrame is in theatre mode!");
    }
    let entry = activeEntry;
    activeEntry = null;
    let newrelwidth = Math.floor((entry.entry.iframe.clientWidth / window.innerWidth) * 100);
    console.log(newrelwidth);
    Storage.sync.set("TheatreModeFrameWidth", newrelwidth);
    entry.entry.shadow.style.opacity = "0";
    entry.entry.shadow.style.removeProperty("pointer-events");
    window.setTimeout(function () {
        entry.entry.iframe.style.cssText = entry.oldCSS;
        document.body.style.removeProperty("overflow");
    }, 150);
}
exports.deactivateEntry = deactivateEntry;
function setWrapperStyle(entry, width) {
    width = width > 100 ? 100 : width;
    width = width < 50 ? 50 : width;
    entry.iframe.style.cssText = "padding-right:5px;padding-bottom:5px;display:block;overflow: hidden; resize: both;position: fixed !important;width: " + width + "vw !important;height: calc(( 9/ 16)*" + width + "vw) !important;top: calc((100vh - ( 9/ 16)*" + width + "vw)/2) !important;left: calc((100vw - " + width + "vw)/2) !important;z-index:2147483647 !important; border: 0px !important; max-width:100vw !important; min-width: 50vw !important; max-height: 100vh !important; min-height: 50vh !important";
}
function getIFrameByID(frameid) {
    let iframe = document.getElementsByName(frameid)[0];
    if (iframe) {
        return iframe;
    }
    else {
        throw Error("Could not find iframe with id '" + frameid + "'!");
    }
}
function setTheatreMode(enabled) {
    Background.toTopWindow({ data: { enabled: enabled, frameID: window.name }, func: "setTheatreMode" });
}
exports.setTheatreMode = setTheatreMode;
function setupIframe() {
    Background.toTopWindow({ data: { frameID: window.name, url: location.href }, func: "setupIframe" });
}
exports.setupIframe = setupIframe;
function setup() {
    nameIFrames();
    Messages.addListener({
        setTheatreMode: function (request, sendResponse) {
            var data = request.data;
            if (data.enabled) {
                var entry = getEntry(data.frameID);
                activateEntry(entry);
            }
            else {
                deactivateEntry();
            }
        },
        setupIframe: function (request, sendResponse) {
            let data = request.data;
            var entry = getEntry(data.frameID);
            if (!entry) {
                let iframe = getIFrameByID(data.frameID);
                //iframe.src = data.url;
                entry = registerIFrame(iframe);
            }
        }
    });
}
exports.setup = setup;


/***/ })
/******/ ]);
//# sourceMappingURL=videoplay.js.map