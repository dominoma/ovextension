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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
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
            if (details && lnfunctions[details.data.func] && details.data.state === State.MdwToEv && blockedFuncs.indexOf(details.data.func) == -1) {
                let sendMsg = function (data, error) {
                    let dtl = {
                        hash: details.hash,
                        data: {
                            data: data,
                            state: State.EvToMdwRsp,
                            call: details.data,
                            sender: { url: location.href }
                        }
                    };
                    if (error) {
                        dtl.data.error = error;
                        console.error(error);
                    }
                    ;
                    var event = new CustomEvent('ovmessage', {
                        detail: dtl
                    });
                    sendMsg = function (data, error) { };
                    document.dispatchEvent(event);
                };
                try {
                    var result = lnfunctions[details.data.func](details.data, function (data) {
                        sendMsg(data);
                    }, function (error) {
                        sendMsg(null, error);
                    });
                }
                catch (e) {
                    if (e instanceof Error) {
                        sendMsg(null, e);
                    }
                    else {
                        sendMsg(null, new Error(e));
                    }
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
    }, true).then(function (response) {
        if (response.error) {
            console.error(response.error);
            throw response.error;
        }
        else {
            return response;
        }
    });
}
exports.send = send;
function eventPingPong(data, beforeBG) {
    return new Promise(function (resolve, reject) {
        data.state = beforeBG ? State.EvToMdw : State.MdwToEv;
        let hash = Tools.generateHash();
        let one = function (ev) {
            let event = ev;
            var details = event.detail;
            if (details && details.hash === hash && details.data.state === (beforeBG ? State.MdwToEvRsp : State.EvToMdwRsp)) {
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
            if (details && details.data.state === State.EvToMdw) {
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
                    let sendMsg = function (data, error) {
                        let resp = { data: data, state: State.BGToMdwRsp, call: msg, sender: sender };
                        if (error) {
                            console.error(error);
                            resp.error = error;
                        }
                        sendMsg = function (data, error) { };
                        sendResponse(resp);
                    };
                    try {
                        bgfunctions[msg.bgdata.func]({ func: msg.func, data: msg.data, state: State.BGToMdw, sender: sender, bgdata: msg.bgdata }, msg.bgdata.data, sender, function (response) {
                            sendMsg(response);
                        }, function (error) {
                            sendMsg(null, error);
                        });
                    }
                    catch (e) {
                        if (e instanceof Error) {
                            sendMsg(null, e);
                        }
                        else {
                            sendMsg(null, new Error(e));
                        }
                    }
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
function send(data) {
    if (Environment.isBackgroundPage()) {
        return postData(data).then(function () { return { success: true }; });
    }
    else {
        return Messages.send({ bgdata: { func: "analytics", data: data } }).then(function () { return { success: true }; });
    }
}
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
            if (resData.error) {
                reject(resData.error);
            }
            else {
                response(resData);
            }
        });
    });
}
exports.sendMessage = sendMessage;
function setup() {
    Messages.setupBackground({
        toTopWindow: function (msg, bgdata, sender, sendResponse, sendError) {
            var tabid = sender.tab.id;
            chrome.tabs.sendMessage(tabid, msg, { frameId: 0 }, function (resData) {
                if (resData.error) {
                    sendError(resData.error);
                }
                else {
                    sendResponse(resData.data);
                }
            });
        },
        toActiveTab: function (msg, bgdata, sender, sendResponse, sendError) {
            var tabid = sender.tab.id;
            chrome.tabs.query({ active: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, { frameId: 0 }, function (resData) {
                    if (resData.error) {
                        sendError(resData.error);
                    }
                    else {
                        sendResponse(resData.data);
                    }
                });
            });
        },
        toTab: function (msg, bgdata, sender, sendResponse, sendError) {
            var tabid = sender.tab.id;
            chrome.tabs.query(bgdata, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, msg, function (resData) {
                    if (resData.error) {
                        sendError(resData.error);
                    }
                    else {
                        sendResponse(resData.data);
                    }
                });
            });
        },
        openTab: function (msg, bgdata, sender, sendResponse) {
            chrome.tabs.create({ url: bgdata.url });
        },
        pauseAllVideos: function (msg, bgdata, sender, sendResponse) {
            sendMessage(sender.tab.id, { func: "pauseVideos", data: null });
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
            Analytics.fireEvent(bgdata["ec"], bgdata["ea"], bgdata["el"]);
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Page = __webpack_require__(6);
const Languages = __webpack_require__(7);
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(4);
const Proxy = __webpack_require__(13);
const Background = __webpack_require__(8);
console.log("test");
Page.isReady().then(function () {
    Messages.setupMiddleware();
    document.getElementById('library').innerText = Languages.getMsg("popup_menu_library_btn");
    document.getElementById('options').innerText = Languages.getMsg("popup_menu_options_btn");
    document.getElementById('enableProxy').innerText = Languages.getMsg("popup_menu_proxy_btn_enable");
    document.getElementById('disableProxy').innerText = Languages.getMsg("popup_menu_proxy_btn_disable");
    document.getElementById('hostSuggest').innerText = Languages.getMsg("popup_menu_suggest_host_btn");
    document.getElementById('movieSearch').appendChild(document.createTextNode(Languages.getMsg("popup_menu_search_movie_btn")));
    document.getElementById('rate').innerHTML = Languages.getMsg("popup_menu_rating_btn");
    document.getElementById('support').innerText = Languages.getMsg("popup_menu_support_btn");
    document.getElementById('versionBox').innerText = Languages.getMsg("popup_menu_version_lbl");
    document.getElementById('hostSuggest').addEventListener("click", function () {
        Background.openTab("https://youtu.be/rbeUGOkKt0o");
        window.close();
    });
    document.getElementById('patreon').addEventListener("click", function () {
        Background.openTab("https://www.patreon.com/bePatron?u=13995915");
        window.close();
    });
    document.getElementById('movieSearch').addEventListener("click", function () {
        Background.openTab(Environment.getVideoSearchUrl());
        window.close();
    });
    document.getElementById('library').addEventListener("click", function () {
        Background.openTab(Environment.getLibrarySiteUrl());
        window.close();
    });
    document.getElementById('options').addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
        window.close();
    });
    document.getElementById('enableProxy').addEventListener("click", function () {
        Proxy.newProxy().then(function (proxy) {
            document.getElementById('proxyCountry').innerText = proxy.country;
        });
        document.getElementById('proxySettings').style.display = "flex";
        document.getElementById('enableProxy').hidden = true;
    });
    document.getElementById('newProxy').addEventListener("click", function () {
        Proxy.newProxy().then(function (proxy) {
            document.getElementById('proxyCountry').innerText = proxy.country;
        });
    });
    document.getElementById('proxyOptions').addEventListener("click", function () {
        Proxy.getCurrentProxy().then(function (proxy) {
            Background.prompt({
                msg: "Please enter the proxy IP and port of  the proxy you want to use.",
                fieldText: (proxy.country === "Custom" ? proxy.ip + ":" + proxy.port : "proxy-ip:port")
            }).then(function (response) {
                console.log(response);
                if (response.aborted) {
                    document.getElementById('proxyCountry').innerText = "Custom";
                    var data = response.text.split(":");
                    Proxy.setup({ ip: data[0], port: parseInt(data[1]), country: "Custom" });
                }
            });
        });
    });
    document.getElementById('disableProxy').addEventListener("click", function () {
        Proxy.remove();
        document.getElementById('proxySettings').style.display = "none";
        document.getElementById('enableProxy').hidden = false;
    });
    Proxy.getCurrentProxy().then(function (proxy) {
        console.log(proxy);
        if (proxy) {
            document.getElementById('proxySettings').style.display = "flex";
            document.getElementById('enableProxy').hidden = true;
            document.getElementById('proxyCountry').innerText = proxy.country;
        }
    });
    for (let elem of document.getElementsByClassName('links')) {
        elem.addEventListener('click', function () {
            Background.openTab(elem.dataset.href);
            window.close();
        });
    }
    ;
    document.getElementById('rate').addEventListener("click", function () {
        if (Environment.browser() == "chrome" /* Chrome */) {
            Background.openTab("https://chrome.google.com/webstore/detail/openvideo-faststream/dadggmdmhmfkpglkfpkjdmlendbkehoh/reviews");
        }
        else {
            Background.openTab("https://addons.mozilla.org/firefox/addon/openvideo/");
        }
        window.close();
    });
    document.getElementById('versionBox').innerHTML = "Version " + Environment.getManifest().version;
});


/***/ }),
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


/***/ })
/******/ ]);
//# sourceMappingURL=popupmenu.js.map