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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    return __awaiter(this, void 0, void 0, function* () {
        let xhr = yield createRequest({ url: url, type: "HEAD" /* HEAD */ });
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
    return __awaiter(this, void 0, void 0, function* () {
        let xhr = yield createRequest({ url: url, type: "HEAD" /* HEAD */ });
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
function removeParamsFromURL(url, params) {
    for (let param of params) {
        url = url.replace(new RegExp("[\\?&]" + param + "=[^\\?&]*", "i"), "");
    }
    return url;
}
exports.removeParamsFromURL = removeParamsFromURL;
function getParamFromURL(url, param) {
    var match = url.match(new RegExp("[\\?&]" + param + "=([^\\?&]*)", "i"));
    if (match) {
        return match[1];
    }
    else {
        return null;
    }
}
exports.getParamFromURL = getParamFromURL;
function addRefererToURL(url, referer) {
    return addParamsToURL(url, { OVReferer: encodeURIComponent(btoa(referer)) });
}
exports.addRefererToURL = addRefererToURL;
function getRefererFromURL(url) {
    var param = getParamFromURL(url, "OVReferer");
    if (param) {
        return atob(decodeURIComponent(param));
    }
    else {
        return null;
    }
}
exports.getRefererFromURL = getRefererFromURL;
function removeRefererFromURL(url) {
    return removeParamsFromURL(url, ["OVReferer"]);
}
exports.removeRefererFromURL = removeRefererFromURL;
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
/* 7 */,
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
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Storage = __webpack_require__(1);
const Proxy = __webpack_require__(13);
const Tools = __webpack_require__(3);
const Environment = __webpack_require__(4);
const Background = __webpack_require__(8);
const ScriptBase = __webpack_require__(9);
const RedirectScripts = __webpack_require__(24);
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
    Storage.sync.set("InstallDetails", details);
});
Storage.sync.get("ProxyEnabled").then(function (proxy) {
    if (proxy) {
        if (proxy.country === "Custom") {
            Proxy.setup(proxy);
        }
        else {
            Proxy.newProxy();
        }
    }
});
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    function getHeader(headers, name) {
        return headers.find(function (header) {
            return header.name.toLowerCase() == name.toLowerCase();
        });
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
    if (Environment.isExtensionPage(details.initiator || "")) {
        setHeader(details.responseHeaders, "Access-Control-Allow-Origin", details.url);
        setHeader(details.responseHeaders, "Access-Control-Allow-Credentials", "true");
        return { responseHeaders: details.responseHeaders };
    }
    return null;
}, {
    urls: ["*://*/*OVReferer=*", "*://*/*isOV*"]
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
        return headers.find(function (header) {
            return header.name.toLowerCase() == name.toLowerCase();
        });
    }
    function removeHeader(headers, name) {
        var header = getHeader(headers, name);
        headers.splice(headers.indexOf(header), 1);
    }
    var referer = Tools.getRefererFromURL(details.url);
    if (referer) {
        setHeader(details.requestHeaders, "Referer", referer);
        setHeader(details.requestHeaders, "Origin", "https://" + Tools.parseUrl(referer).host);
        let newURL = Tools.removeRefererFromURL(details.url);
        console.log(newURL);
        return { requestHeaders: details.requestHeaders };
    }
    else if (details.url.match(/[\?&]isOV=true/i)) {
        console.log(details.requestHeaders, details.url);
        setHeader(details.requestHeaders, "Origin", "*");
        removeHeader(details.requestHeaders, "Referer");
        console.log(details.requestHeaders);
        return { requestHeaders: details.requestHeaders };
    }
    return null;
}, {
    urls: ["*://*/*OVReferer=*", "*://*/*isOV*"]
}, ['blocking', 'requestHeaders'] //extraHeaders when chrome 72
);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ScriptBase = __webpack_require__(9);
const Analytics = __webpack_require__(5);
const Page = __webpack_require__(6);
const Tools = __webpack_require__(3);
function suspectSubtitledVideo(details, xhr) {
    if (xhr.response.match(/(<track[^>]*src=|\.vtt|"?tracks"?: \[\{)/)) {
        Analytics.fireEvent(details.hostname, "TracksFound", details.url);
    }
}
function getTracksFromHTML(html) {
    let subtitleTags = html.match(/<track(.*)\/>/g) || [];
    let subtitles = [];
    for (let subtitleTag of subtitleTags) {
        let label = Tools.matchNull(subtitleTag, /label="([^"]*)"/);
        let src = Tools.matchNull(subtitleTag, /src="([^"]*)"/);
        if (src) {
            subtitles.push({ kind: "captions", label: label, src: src, default: subtitleTag.indexOf("default") != -1 });
        }
    }
    return subtitles;
}
function install() {
    ScriptBase.addRedirectHost({
        name: "RapidVideo",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?rapidvideo\.[^\/,^\.]{2,}\/(\?v=[^&\?]*|e\/.+|v\/.+)/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                details.url = details.url.replace(/(\/?\?v=|\/v\/)/i, "/e/").replace(/[&\?]q=?[^&\?]*/i, "").replace(/[&\?]autostart=?[^&\?]*/i, "");
                                let parser = new DOMParser();
                                function checkResponse(xhr) {
                                    if (xhr.response.indexOf("To continue, please type the characters below") != -1) {
                                        location.href = Tools.addParamsToURL(location.href, { ovignore: "true" });
                                    }
                                }
                                function getVideoInfo() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        let xhr = yield Tools.createRequest({ url: details.url, referer: details.url });
                                        suspectSubtitledVideo(details, xhr);
                                        checkResponse(xhr);
                                        let html = parser.parseFromString(xhr.response, "text/html");
                                        let title = html.title;
                                        let videoTag = html.getElementsByTagName("video")[0];
                                        let poster = videoTag.poster;
                                        let tracksHTML = videoTag.getElementsByTagName("track");
                                        let tracks = [];
                                        for (let track of tracksHTML) {
                                            tracks.push({ src: track.src, label: track.label, kind: track.kind, default: track.default });
                                        }
                                        let urlsHTML = html.querySelectorAll('a[href*="https://www.rapidvideo.com/e/"]');
                                        let urls = [];
                                        for (let url of urlsHTML) {
                                            urls.push(url.href);
                                        }
                                        if (urls.length == 0) {
                                            urls.push(details.url);
                                        }
                                        return { title: title, poster: poster, tracks: tracks, urls: urls };
                                    });
                                }
                                function getVideoSrc(url) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        let xhr = yield Tools.createRequest({ url: url, referer: details.url });
                                        checkResponse(xhr);
                                        let html = parser.parseFromString(xhr.response, "text/html");
                                        let source = html.getElementsByTagName("source")[0];
                                        return {
                                            src: source.src,
                                            label: source.title,
                                            type: source.type,
                                            res: parseInt(source.dataset.res)
                                        };
                                    });
                                }
                                function getVideoSrces(info) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        let videos = yield Promise.all(info.urls.map(getVideoSrc));
                                        videos[videos.length - 1].default = true;
                                        return { src: videos, poster: info.poster, title: info.title, tracks: info.tracks };
                                    });
                                }
                                let info = yield getVideoInfo();
                                let srces = yield getVideoSrces(info);
                                return srces;
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "OpenLoad",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?(openload|oload)\.[^\/,^\.]{2,}\/(embed|f)\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (details.url.indexOf("openload.co") == -1) {
                                    details.url = details.url.replace(/(openload|oload)\.[^\/,^\.]{2,}/, "openload.co");
                                }
                                if (details.url.indexOf("/f/") != -1) {
                                    Analytics.fireEvent("OpenLoad over File", "Utils", details.url);
                                    details.url = details.url.replace("/f/", "/embed/");
                                }
                                function getStreamUrl(longString, varAtbytes, varAt_1x4bfb36) {
                                    let streamUrl = "";
                                    let hexByteArr = [];
                                    for (let i = 0; i < 9 * 8; i += 8) {
                                        hexByteArr.push(parseInt(longString.substring(i, i + 8), 16));
                                    }
                                    longString = longString.substring(9 * 8);
                                    let iterator = 0;
                                    for (let arrIterator = 0; iterator < longString.length; arrIterator++) {
                                        let maxHex = 64;
                                        let value = 0;
                                        let currHex = 255;
                                        for (let byteIterator = 0; currHex >= maxHex; byteIterator += 6) {
                                            if (iterator + 1 >= longString.length) {
                                                maxHex = 0x8F;
                                            }
                                            currHex = parseInt(longString.substring(iterator, iterator + 2), 16);
                                            value += (currHex & 63) << byteIterator;
                                            iterator += 2;
                                        }
                                        let bytes = value ^ hexByteArr[arrIterator % 9] ^ varAtbytes ^ varAt_1x4bfb36;
                                        let usedBytes = maxHex * 2 + 127;
                                        for (let i = 0; i < 4; i++) {
                                            let urlChar = String.fromCharCode(((bytes & usedBytes) >> 8 * i) - 1);
                                            if (urlChar != "$") {
                                                streamUrl += urlChar;
                                            }
                                            usedBytes = usedBytes << 8;
                                        }
                                    }
                                    //console.log(streamUrl)
                                    return streamUrl;
                                }
                                console.log(details.url);
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.responseText;
                                console.log(xhr.responseURL);
                                if (xhr.status != 200 || HTML.indexOf("We can't find the file you are looking for. It maybe got deleted by the owner or was removed due a copyright violation.") != -1 || HTML.indexOf("The file you are looking for was blocked.") != -1) {
                                    console.log(xhr.status, HTML);
                                    throw Error("No Video");
                                }
                                let thumbnailUrl = Tools.matchNull(HTML, /poster="([^"]*)"/);
                                let title = Tools.matchNull(HTML, /meta name="og:title" content="([^"]*)"/);
                                let subtitles = getTracksFromHTML(HTML);
                                let longString = HTML.match(/<p style=""[^>]*>([^<]*)<\/p>/)[1];
                                console.log(longString);
                                let keyNum1 = HTML.match(/\_0x45ae41\[\_0x5949\('0xf'\)\]\(_0x30725e,(.*)\),\_1x4bfb36/)[1];
                                let keyNum2 = HTML.match(/\_1x4bfb36=(.*);/)[1];
                                let keyResult1 = 0;
                                let keyResult2 = 0;
                                //console.log(longString, keyNum1, keyNum2);
                                try {
                                    let keyNum1_Oct = parseInt(keyNum1.match(/parseInt\('(.*)',8\)/)[1], 8);
                                    let keyNum1_Sub = parseInt(keyNum1.match(/\)\-([^\+]*)\+/)[1]);
                                    let keyNum1_Div = parseInt(keyNum1.match(/\/\(([^\-]*)\-/)[1]);
                                    let keyNum1_Sub2 = parseInt(keyNum1.match(/\+0x4\-([^\)]*)\)/)[1]);
                                    keyResult1 = (keyNum1_Oct - keyNum1_Sub + 4 - keyNum1_Sub2) / (keyNum1_Div - 8);
                                    let keyNum2_Oct = parseInt(keyNum2.match(/\('([^']*)',/)[1], 8);
                                    let keyNum2_Sub = parseInt(keyNum2.substr(keyNum2.indexOf(")-") + 2));
                                    keyResult2 = keyNum2_Oct - keyNum2_Sub;
                                    console.log(keyNum1, keyNum2);
                                }
                                catch (e) {
                                    //console.error(e.stack);
                                    throw Error("Key Numbers not parsed!");
                                }
                                return {
                                    src: [{
                                            type: "video/mp4",
                                            src: "https://"
                                                + Tools.parseUrl(details.url).host
                                                + "/stream/" + getStreamUrl(longString, keyResult1, keyResult2)
                                                + "?mime=true",
                                            label: "SD"
                                        }],
                                    poster: thumbnailUrl,
                                    title: title,
                                    tracks: subtitles
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "FruitStreams",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?(streamango|fruitstreams|streamcherry|fruitadblock|fruithosts)\.[^\/,^\.]{2,}\/(f|embed)\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                details.url = details.url.replace(/(streamango|fruitstreams|streamcherry|fruitadblock)\.[^\/,^\.]{2,}/, "fruitstreams.com").replace(/\/f\//, "/embed/");
                                function resolveVideo(hashCode, intVal) {
                                    let chars = "=/+9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA";
                                    let retVal = '';
                                    hashCode = hashCode.replace(/[^A-Za-z0-9\+\/\=]/g, '');
                                    for (let hashIndex = 0; hashIndex < hashCode.length; hashIndex += 4) {
                                        let hashCharCode_0 = chars.indexOf(hashCode.charAt(hashIndex));
                                        let hashCharCode_1 = chars.indexOf(hashCode.charAt(hashIndex + 1));
                                        let hashCharCode_2 = chars.indexOf(hashCode.charAt(hashIndex + 2));
                                        let hashCharCode_3 = chars.indexOf(hashCode.charAt(hashIndex + 3));
                                        retVal = retVal + String.fromCharCode(((hashCharCode_0 << 0x2) | (hashCharCode_1 >> 0x4)) ^ intVal);
                                        if (hashCharCode_2 != 0x40) {
                                            retVal = retVal + String.fromCharCode(((hashCharCode_1 & 0xf) << 0x4) | (hashCharCode_2 >> 0x2));
                                        }
                                        if (hashCharCode_3 != 0x40) {
                                            retVal = retVal + String.fromCharCode(((hashCharCode_2 & 0x3) << 0x6) | hashCharCode_3);
                                        }
                                    }
                                    return retVal;
                                }
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.responseText;
                                if (xhr.status != 200 || HTML.indexOf("We are unable to find the video you're looking for.") != -1) {
                                    throw Error("No Video!");
                                }
                                let funcParams = HTML.match(/src:d\('([^']*)',([^\)]*)/);
                                let funcStr = funcParams[1];
                                let funcInt = parseInt(funcParams[2]);
                                let src = { type: "video/mp4", src: "https:" + resolveVideo(funcStr, funcInt), label: "SD" };
                                let poster = Tools.matchNull(HTML, /poster="([^"]*)"/);
                                let title = Tools.matchNull(HTML, /meta name="og:title" content="([^"]*)"/);
                                let subtitles = getTracksFromHTML(HTML);
                                return { src: [src], poster: poster, title: title, tracks: subtitles };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "MyCloud",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?mcloud\.[^\/,^\.]{2,}\/embed\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield Page.isReady();
                                let HTML = document.documentElement.innerHTML;
                                let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
                                let rawsrces = JSON.parse(HTML.match(/sources: (\[\{.*\}\])/)[1]);
                                let srces = [];
                                for (let src of rawsrces) {
                                    srces.push({ src: src.file, type: "application/x-mpegURL", label: "SD" });
                                }
                                ;
                                let poster = Tools.matchNull(HTML, /image: '([^']*)'/);
                                let trackFile = Tools.getParamFromURL(details.url, "sub.file");
                                let trackLabel = Tools.getParamFromURL(details.url, "sub.label") || "English";
                                return {
                                    src: srces,
                                    poster: poster,
                                    title: title,
                                    tracks: trackFile ? [{ src: decodeURIComponent(decodeURIComponent(trackFile)), label: trackLabel, kind: "Captions", default: true }] : []
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "VidCloud",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?(vidcloud|vcstream|loadvid)\.[^\/,^\.]{2,}\/embed\/([a-zA-Z0-9]*)/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let embedID = details.match[3];
                                let xhrs = yield Promise.all([
                                    Tools.createRequest({ url: "https://vidcloud.co/player", data: { fid: embedID } }),
                                    Tools.createRequest({ url: "https://vidcloud.co/download", type: "POST" /* POST */, data: { file_id: embedID } })
                                ]);
                                suspectSubtitledVideo(details, xhrs[0]);
                                let html = JSON.parse(xhrs[0].response).html;
                                let dlhtml = JSON.parse(xhrs[1].response).html;
                                let rawRes = dlhtml.match(/href="([^"]*)" download="([^"]*)"[^>]*>([^<]*)</g);
                                let dlsrces = [];
                                for (let res of rawRes) {
                                    let matches = res.match(/href="([^"]*)" download="([^"]*)"[^>]*>([^<]*)</);
                                    dlsrces.push({ src: matches[1], filename: "[" + matches[3] + "]" + matches[2], type: "video/mp4" });
                                }
                                let rawSrces = JSON.parse("[" + html.match(/.*sources = \[([^\]]*)/)[1] + "]");
                                let rawTracks = JSON.parse("[" + Tools.matchNull(html, /.*tracks = \[([^\]]*)/) + "]");
                                let title = Tools.matchNull(html, /title: '([^']*)'/);
                                let poster = Tools.matchNull(html, /image: '([^']*)'/);
                                let srces = [];
                                for (let i = 0; i < rawSrces.length; i++) {
                                    srces.push({ src: rawSrces[i].file, type: "application/x-mpegURL", dlsrc: dlsrces[0], label: "SD" });
                                }
                                let tracks = [];
                                for (let track of rawTracks) {
                                    tracks.push({ src: track.file, label: track.label, default: track.default || false, kind: track.kind });
                                }
                                return {
                                    src: srces,
                                    tracks: tracks,
                                    title: title,
                                    poster: poster
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "Vidoza",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?vidoza\.[^\/,^\.]{2,}\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.response;
                                if (details.url.indexOf("/embed") == -1) {
                                    if (HTML.indexOf("videojs('player')") == -1) {
                                        throw Error("No Video!");
                                    }
                                    else {
                                        location.href = location.href.replace("vidoza.net/", "vidoza.net/embed-").replace(/\.html.*/, ".html");
                                        throw Error("No embed Video! Redirecting...");
                                    }
                                }
                                else {
                                    let rawsources = JSON.parse(HTML.match(/sourcesCode: (\[\{.*\}\])/)[1].replace(/src:/g, '"src":').replace(/type:/g, '"type":').replace(/label:/g, '"label":').replace(/res:/g, '"res":'));
                                    let sources = [];
                                    for (let src of rawsources) {
                                        sources.push({ src: src.src, label: src.res, type: src.type });
                                    }
                                    let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
                                    let poster = Tools.matchNull(HTML, /poster: "([^"]*)"/);
                                    return {
                                        src: sources,
                                        poster: poster,
                                        title: title,
                                        tracks: []
                                    };
                                }
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "MP4Upload",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?mp4upload\.[^\/,^\.]{2,}\/embed\-.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.response;
                                if (HTML.indexOf("File was deleted") != -1) {
                                    throw Error("No Video!");
                                }
                                let evalStr = HTML.match(/(eval\(function\(p,a,c,k,e,d\).*\.split\('\|'\)\)\))/)[1];
                                let code = Tools.unpackJS(evalStr);
                                let hash = JSON.parse(code.match(/player\.setup\((.*),"height"/)[1] + "}");
                                let src = hash.file;
                                let poster = hash.image;
                                return {
                                    src: [{ type: "video/mp4", src: src, label: "SD" }],
                                    poster: poster,
                                    title: "MP4Upload Video",
                                    tracks: []
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "Vivo",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?vivo\.[^\/,^\.]{2,}\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.response;
                                let videoURL = atob(HTML.match(/data-stream="([^"]*)"/)[1]);
                                let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
                                return {
                                    src: [{ type: "video/mp4", src: videoURL, label: "SD" }],
                                    title: title,
                                    tracks: [],
                                    poster: ""
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "VidTo",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?vidto\.[^\/,^\.]{2,}\//i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (details.url.indexOf("embed-") == -1 && details.url.indexOf(".html") != -1) {
                                    details.url = details.url.replace(/vidto\.[^\/,^\.]{2,}\//, "vidto.me/embed-");
                                }
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.responseText;
                                if (xhr.status != 200 || HTML.indexOf("File Does not Exist, or Has Been Removed") != -1) {
                                    throw Error("No Video!");
                                }
                                let playerHashStr = "{" + HTML.match(/\.setup\(\{(.*)duration:/)[1] + "}";
                                let sources = playerHashStr.match(/sources:(.*\}\]),/)[1];
                                sources = sources.replace(/file:/g, '"src":');
                                sources = sources.replace(/label:/g, '"label":');
                                let srcObj = JSON.parse(sources);
                                srcObj[0].default = true;
                                let image = Tools.matchNull(playerHashStr, /image: "([^"]*)"/);
                                return {
                                    src: srcObj,
                                    title: "VidTo.me video",
                                    poster: image,
                                    tracks: []
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "StreamCloud",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?streamcloud\.[^\/,^\.]{2,}\/([^\.]+)(\.html)?/i,
                runScopes: [{
                        run_at: "document_idle" /* document_idle */,
                        hide_page: false,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                return new Promise(function (resolve, reject) {
                                    let button = document.getElementsByName('imhuman')[0];
                                    if (button == undefined) {
                                        reject(Error("No Video!"));
                                    }
                                    else {
                                        Page.addAttributeListener(button, "class", function () {
                                            return __awaiter(this, void 0, void 0, function* () {
                                                if (button.className == 'button gray blue') {
                                                    let xhr = yield Tools.createRequest({
                                                        url: details.url,
                                                        type: "POST" /* POST */,
                                                        protocol: "http://",
                                                        formData: {
                                                            op: "download1",
                                                            id: details.match[2].match(/([^\/]*)(\/.*)?/)[1]
                                                        }
                                                    });
                                                    suspectSubtitledVideo(details, xhr);
                                                    let HTML = xhr.response;
                                                    console.log(HTML);
                                                    let videoHashStr = HTML.match(/jwplayer\("mediaplayer"\)\.setup\(([^\)]*)/)[1];
                                                    let src = videoHashStr.match(/file: "([^"]*)"/)[1];
                                                    let poster = Tools.matchNull(videoHashStr, /image: "([^"]*)"/);
                                                    let title = Tools.matchNull(HTML, /<title>([^<]*)<\/title>/);
                                                    return {
                                                        src: [{
                                                                type: "video/mp4",
                                                                src: src,
                                                                label: "SD"
                                                            }],
                                                        title: title,
                                                        poster: poster,
                                                        tracks: []
                                                    };
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "VevIO",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?vev\.[^\/,^\.]{2,}\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                function getVideoCode() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (details.url.indexOf("embed") == -1) {
                                            let xhr = yield Tools.createRequest({ url: details.url });
                                            suspectSubtitledVideo(details, xhr);
                                            if (xhr.response.indexOf('class="video-main"') != -1) {
                                                return details.url.substr(details.url.lastIndexOf("/"));
                                            }
                                            else {
                                                throw Error("Not a Video!");
                                            }
                                        }
                                        else {
                                            return details.url.substr(details.url.lastIndexOf("/") + 1);
                                        }
                                    });
                                }
                                let videoCode = yield getVideoCode();
                                let xhrs = yield Promise.all([
                                    Tools.createRequest({ url: "https://vev.io/api/serve/video/" + videoCode, type: "POST" /* POST */ }),
                                    Tools.createRequest({ url: "https://vev.io/api/serve/video/" + videoCode })
                                ]);
                                let videoJSON = JSON.parse(xhrs[0].response);
                                let videoDesc = JSON.parse(xhrs[1].response);
                                let srces = [];
                                for (let key in videoJSON.qualities) {
                                    srces.push({ label: key, src: videoJSON.qualities[key], type: "video/mp4" });
                                }
                                srces = srces.reverse();
                                srces[0].default = true;
                                return {
                                    src: srces,
                                    poster: videoJSON.poster,
                                    tracks: videoJSON.subtitles,
                                    title: videoDesc.video.title
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "Vidzi",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?vidzi\.[^\/,^\.]{2,}\/.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (details.url.indexOf("embed-") != -1) {
                                    if (details.url.indexOf("-") == details.url.lastIndexOf("-")) {
                                        details.url = details.url.replace("embed-", "");
                                    }
                                    else {
                                        details.url = "https://www.vidzi.tv/" + details.url.match(/embed\-([^\-]*)\-/)[1];
                                    }
                                    console.log(details.url);
                                }
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.responseText;
                                if (xhr.status != 200 || HTML.indexOf("file was deleted") != -1 || HTML.indexOf("yt-uix-form-textarea share-embed-code") == -1) {
                                    throw Error("No Video!");
                                }
                                let videoHash = HTML.match(/jwplayer\("vplayer"\)\.setup\(\{(.*)\}\);/)[1];
                                let image = Tools.matchNull(videoHash, /image: "([^"]*)"/);
                                let src = videoHash.match(/sources: \[\{file: "([^"]*)"/)[1];
                                let title = Tools.matchNull(HTML, /<title>([<"]*)<\/title>/i);
                                return {
                                    src: [{ src: src, type: "application/x-mpegURL", label: "SD" }],
                                    title: title,
                                    poster: image,
                                    tracks: []
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "SpeedVid",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?speedvid\.[^\/,^\.]{2,}\/[^\/]+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (details.url.indexOf("sn-") != -1) {
                                    details.url = "https://www.speedvid.net/" + details.url.match(/sn\-([^\-]*)\-/i)[1];
                                }
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.responseText;
                                if (xhr.status != 200 || HTML.indexOf("<Title>Watch </Title>") == -1) {
                                    throw Error("No Video!");
                                }
                                let image = Tools.matchNull(HTML, /image:'([^']*)'/);
                                let src = HTML.match(/file: '([^']*)'/)[1];
                                let title = Tools.matchNull(HTML, /div class="dltitre">([^<]*)<\/div>/);
                                return {
                                    src: [{ src: src, type: "video/mp4", label: "SD" }],
                                    title: title,
                                    poster: image,
                                    tracks: []
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "VidLox",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?vidlox\.[^\/,^\.]{2,}\/embed\-.+/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                let xhr = yield Tools.createRequest({ url: details.url, hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.response;
                                console.log(HTML);
                                let src = JSON.parse(HTML.match(/sources: (\[.*\]),/)[1])[0];
                                //let title = HTML.match(/<title>([<"]*)<\/title>/i)[1];
                                let poster = Tools.matchNull(HTML, /poster: "([^"]*)"/);
                                return {
                                    src: [{ type: "application/x-mpegURL", src: src, label: "SD" }],
                                    poster: poster,
                                    title: "VidLox Video",
                                    tracks: []
                                };
                            });
                        }
                    }]
            }]
    });
    ScriptBase.addRedirectHost({
        name: "FlashX",
        scripts: [{
                urlPattern: /https?:\/\/(www\.)?flashx\.[^\/,^\.]{2,}\/(embed.php\?c=(.*)|(.*)\.jsp|playvideo\-(.*)\.html\?playvid)/i,
                runScopes: [{
                        run_at: "document_start" /* document_start */,
                        script: function (details) {
                            return __awaiter(this, void 0, void 0, function* () {
                                function getVideoCode() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (details.match[5]) {
                                            return details.match[5];
                                        }
                                        else {
                                            yield Promise.all([
                                                Tools.createRequest({ url: "https://flashx.co/counter.cgi" }),
                                                Tools.createRequest({ url: "https://flashx.co/flashx.php?f=fail&fxfx=6" })
                                            ]);
                                            return details.match[3] || details.match[4];
                                        }
                                    });
                                }
                                let videoCode = yield getVideoCode();
                                let xhr = yield Tools.createRequest({ url: "https://flashx.co/playvideo-" + videoCode + ".html?playvid", hideRef: true });
                                suspectSubtitledVideo(details, xhr);
                                let HTML = xhr.responseText;
                                if (xhr.status != 200 || HTML.indexOf("Sorry, file was deleted or the link is expired!") != -1) {
                                    throw Error("No Video!");
                                }
                                let srcHashStr = HTML.match(/updateSrc\(([^\)]*)\)/)[1];
                                srcHashStr = srcHashStr.substr(0, srcHashStr.lastIndexOf(",")) + "]";
                                srcHashStr = srcHashStr.replace(/src:/g, '"src":');
                                srcHashStr = srcHashStr.replace(/label:/g, '"label":');
                                srcHashStr = srcHashStr.replace(/res:/g, '"res":');
                                srcHashStr = srcHashStr.replace(/type:/g, '"type":');
                                srcHashStr = srcHashStr.replace(/'/g, '"');
                                console.log(srcHashStr);
                                let src = JSON.parse(srcHashStr);
                                let poster = Tools.matchNull(HTML, /poster="([^"]*)"/);
                                return {
                                    src: [{ src: src[0].src, type: src[0].type, label: "SD" }],
                                    poster: poster,
                                    tracks: [],
                                    title: "FlashX Video"
                                };
                            });
                        }
                    }]
            }]
    });
}
exports.install = install;


/***/ })
/******/ ]);
//# sourceMappingURL=bg_script.js.map