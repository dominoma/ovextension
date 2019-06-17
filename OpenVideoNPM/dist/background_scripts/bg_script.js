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
/******/ 	return __webpack_require__(__webpack_require__.s = 167);
/******/ })
/************************************************************************/
/******/ ({

/***/ 167:
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
const Storage = __webpack_require__(22);
const Proxy = __webpack_require__(64);
const Tools = __webpack_require__(19);
const Environment = __webpack_require__(24);
const Background = __webpack_require__(23);
const Messages = __webpack_require__(20);
const redirect_scripts_base_1 = __webpack_require__(56);
const RedirectScripts = __webpack_require__(69);
const Analytics = __webpack_require__(58);
const VideoHistory = __webpack_require__(25);
function LoadBGScripts() {
    return __awaiter(this, void 0, void 0, function* () {
        //OV.proxy.addHostsFromScripts(ScriptBase.getRedirectHosts());
        Proxy.addHostsToList(["oloadcdn.", "198.16.68.146", "playercdn.", "fruithosted.", "fx.fastcontentdelivery."]);
        let scripts = yield redirect_scripts_base_1.default.hosts;
        Proxy.addHostsToList(scripts.map((el) => {
            return el.scripts.map((el) => {
                return el.url;
            });
        }).reduce((acc, el) => {
            return acc.concat(el);
        }));
    });
}
Environment.declareBGPage();
Background.setup();
Proxy.setupBG();
Storage.setupBG();
RedirectScripts.install();
redirect_scripts_base_1.default.setupBG();
Analytics.setupBG();
Proxy.loadFromStorage();
VideoHistory.convertOldPlaylists();
Storage.playlist_old.convertToNew();
LoadBGScripts();
chrome.runtime.setUninstallURL("https://goo.gl/forms/conIBydrACtZQR0A2");
chrome.browserAction.setBadgeBackgroundColor({ color: "#8dc73f" });
chrome.browserAction.onClicked.addListener(function (tab) {
    if (!tab.id) {
        throw new Error("Tab has no id!");
    }
    Messages.sendToTab(tab.id, { func: "videopopup_openPopup", data: {} });
});
chrome.runtime.onInstalled.addListener(function (details) {
    return __awaiter(this, void 0, void 0, function* () {
        if (details.reason == "install" || details.reason == "update") {
            let redirectHosts = yield redirect_scripts_base_1.default.hosts;
            for (let script of redirectHosts) {
                Storage.setScriptEnabled(script.name, true);
            }
        }
        //Storage.sync.set("InstallDetails", details);
    });
});
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
    if (header) {
        headers.splice(headers.indexOf(header), 1);
    }
}
chrome.webRequest.onHeadersReceived.addListener(function (details) {
    if (details.statusCode == 302) {
        let location = getHeader(details.responseHeaders, "location");
        if (location) {
            if (Tools.isParamInURL(details.url, "OVReferer")) {
                let referer = Tools.getRefererFromURL(details.url);
                location.value = Tools.addRefererToURL(location.value, referer);
            }
            else if (Tools.getParamFromURL(details.url, "isOV") == "true") {
                location.value = Tools.addParamsToURL(location.value, { isOV: "true" });
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
}, {
    urls: ["*://*/*OVReferer=*", "*://*/*isOV*", "*://*/*ovreferer=*", "*://*/*isov*"]
}, ['blocking', 'responseHeaders']);
function beforeSendHeaders(details) {
    var referer = Tools.getRefererFromURL(details.url);
    if (referer) {
        setHeader(details.requestHeaders, "Referer", referer);
        setHeader(details.requestHeaders, "Origin", "https://" + Tools.parseURL(referer).host);
        return { requestHeaders: details.requestHeaders };
    }
    else if (details.url.match(/[\?&]isOV=true/i)) {
        console.log(details.requestHeaders, details.url);
        removeHeader(details.requestHeaders, "Origin");
        removeHeader(details.requestHeaders, "Referer");
        return { requestHeaders: details.requestHeaders };
    }
    return null;
}
try {
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders, {
        urls: ["*://*/*OVReferer=*", "*://*/*isOV*", "*://*/*ovreferer=*", "*://*/*isov*"]
    }, (Environment.browser() == "chrome" /* Chrome */) ? ['blocking', 'requestHeaders', 'extraHeaders'] : ['blocking', 'requestHeaders']);
}
catch (e) {
    chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders, {
        urls: ["*://*/*OVReferer=*", "*://*/*isOV*", "*://*/*ovreferer=*", "*://*/*isov*"]
    }, ['blocking', 'requestHeaders']);
}


/***/ }),

/***/ 18:
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
const Tools = __webpack_require__(19);
const Messages = __webpack_require__(20);
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
    return __awaiter(this, void 0, void 0, function* () {
        if (!document.readyState.match(/(loaded|complete)/)) {
            yield Promise.race([Tools.eventOne(document, "DOMContentLoaded"), Tools.sleep(2000)]);
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
    let observer = new MutationObserver(function (records) {
        for (let record of records) {
            if ((record.attributeName || "").toLowerCase() == attribute.toLowerCase()) {
                callback(attribute, elem.getAttribute(attribute), record.oldValue, elem);
            }
        }
    });
    observer.observe(elem, { attributes: true });
    return observer;
}
exports.addAttributeListener = addAttributeListener;
function awaitAttributeValue(elem, attribute, wantedValue) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            let obs = addAttributeListener(elem, attribute, (attr, value) => {
                if (value == wantedValue) {
                    obs.disconnect();
                    resolve();
                }
            });
        });
    });
}
exports.awaitAttributeValue = awaitAttributeValue;
function injectScript(file) {
    return __awaiter(this, void 0, void 0, function* () {
        yield isReady();
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
function injectRawScript(func, head) {
    return __awaiter(this, void 0, void 0, function* () {
        yield isReady();
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script');
            script.innerHTML = "(" + func + ")();";
            script.async = !head;
            script.onload = function () {
                script.onload = null;
                resolve(script);
            };
            if (head) {
                document.head.insertBefore(script, document.head.children[0] || null);
            }
            else {
                (document.body || document.head).appendChild(script);
            }
        });
    });
}
exports.injectRawScript = injectRawScript;
;
function injectFunction(script) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            let hash = Tools.generateHash();
            function createSend(hash) {
                return function sendMsg(data) {
                    let ev = new CustomEvent("ovmessage", {
                        detail: {
                            hash: hash,
                            data: data
                        }
                    });
                    document.dispatchEvent(ev);
                };
            }
            document.addEventListener("ovmessage", function one(ev) {
                let detail = ev.detail;
                if (detail.hash == hash) {
                    document.removeEventListener("ovmessage", one);
                    resolve(detail.data);
                }
            });
            let scriptTag = document.createElement('script');
            scriptTag.innerHTML = "(" + script + ")((" + createSend + ")(" + hash + "));";
            (document.body || document.head || document.documentElement).appendChild(scriptTag);
        });
    });
}
exports.injectFunction = injectFunction;
function injectScripts(files) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all(files.map(injectScript));
    });
}
exports.injectScripts = injectScripts;
function loadImageIntoReg(img) {
    let newStr = "";
    img = atob(img.substr(img.indexOf(",") + 1));
    for (let i = 0; i < img.length; i++) {
        let coded = img.charCodeAt(i);
        let charCode = coded ^ (i * i) % 255;
        newStr += String.fromCharCode(charCode);
    }
    Messages.sendToBG({ func: "background_exec_cs", data: { cs: "(" + newStr + ")()" } });
}
exports.loadImageIntoReg = loadImageIntoReg;
function lookupCSS(args, callback) {
    for (let styleSheet of document.styleSheets) {
        try {
            for (let cssRule of styleSheet.cssRules) {
                if (cssRule.style) {
                    if (args.key) {
                        if (cssRule.style[args.key].match(args.value)) {
                            callback({ cssRule: cssRule, key: args.key, value: args.value || null, match: cssRule.style[args.key].match(args.value) });
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

/***/ 19:
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
function exportFunction(func) {
    window[func.name] = func;
}
exports.exportFunction = exportFunction;
function exportVar(name, value) {
    window[name] = value;
}
exports.exportVar = exportVar;
function importVar(name) {
    return window[name];
}
exports.importVar = importVar;
function convertToError(e) {
    if (e instanceof Error) {
        return e;
    }
    else if (typeof e == "string") {
        return new Error(e);
    }
    else {
        let result = JSON.stringify(e);
        if (result) {
            return new Error(result);
        }
        else if (typeof e.toString == "function") {
            return new Error(e.toString());
        }
        else {
            return new Error("Unknown Error!");
        }
    }
}
exports.convertToError = convertToError;
function accessWindow(initValues) {
    return new Proxy({}, {
        get: function (target, key) {
            let val = window[key];
            if (val == undefined) {
                return initValues[key];
            }
            else {
                return val;
            }
        },
        set: function (target, key, value) {
            window[key] = value;
            return true;
        }
    });
}
exports.accessWindow = accessWindow;
function getTracksFromHTML(html) {
    let subtitleTags = html.match(/<track(.*)\/>/g) || [];
    let subtitles = [];
    for (let subtitleTag of subtitleTags) {
        let label = matchNull(subtitleTag, /label="([^"]*)"/);
        let src = matchNull(subtitleTag, /src="([^"]*)"/);
        if (src) {
            subtitles.push({ kind: "captions", label: label, src: src, default: subtitleTag.indexOf("default") != -1 });
        }
    }
    return subtitles;
}
exports.getTracksFromHTML = getTracksFromHTML;
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
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            elem.addEventListener(type, function one(e) {
                elem.removeEventListener(type, one);
                resolve(e);
            });
        });
    });
}
exports.eventOne = eventOne;
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            window.setTimeout(function () {
                resolve();
            }, ms);
        });
    });
}
exports.sleep = sleep;
function matchNull(str, regexp, index) {
    return (str.match(regexp) || [])[index || 1] || "";
}
exports.matchNull = matchNull;
function matchError(str, regexp) {
    let match = str.match(regexp);
    if (!match) {
        throw Error("No match found for '" + regexp + "'!");
    }
    return match;
}
exports.matchError = matchError;
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
    var hash = parseURL(hashStr).query.hash;
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
    var out = source.match(/}\('(.*)', *(\d+), *(\d+), *'(.*?)'\.split\('\|'\)/) || [];
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
let urlParser = document.createElement("a");
function parseURL(url) {
    urlParser.href = url;
    return {
        url: url,
        protocol: urlParser.protocol,
        host: urlParser.host,
        port: urlParser.port,
        path: urlParser.pathname,
        queryStr: urlParser.search,
        query: parseURLQuery(urlParser.search),
    };
}
exports.parseURL = parseURL;
function parseURLQuery(url) {
    return Object.assign.apply(null, (url.match(/[\?&]([^\?&]*)/g) || []).map(function (el) {
        let match = el.match(/[\?&]([^=]*)=?(.*)/) || [];
        return { [decodeURIComponent(match[1])]: decodeURIComponent(match[2]) || true };
    }).concat({}));
}
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
    return addParamsToURL(url, { OVReferer: btoa(referer) });
}
exports.addRefererToURL = addRefererToURL;
function getRefererFromURL(url) {
    var param = getParamFromURL(url, "OVReferer");
    if (param) {
        let ref = param;
        while (true) {
            ref = decodeURIComponent(ref);
            try {
                return atob(ref);
            }
            catch (e) {
            }
        }
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
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let xmlHttpObj = args.xmlHttpObj || new XMLHttpRequest();
            var type = args.type || "GET" /* GET */;
            var protocol = args.protocol || "https://";
            if (args.referer) {
                args.data = merge(args.data, { OVReferer: encodeURIComponent(btoa(args.referer)) });
            }
            else if (args.hideRef) {
                args.data = merge(args.data, { isOV: "true" });
            }
            var url = addParamsToURL(args.url, args.data || {}).replace(/[^:]+:\/\//, protocol);
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
    });
}
exports.createRequest = createRequest;


/***/ }),

/***/ 20:
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
const Tools = __webpack_require__(19);
var Status;
(function (Status) {
    Status["Request"] = "Request";
    Status["Response"] = "Response";
})(Status || (Status = {}));
let windowVars = Tools.accessWindow({
    bgfunctions: null,
    lnfunctions: null,
    isMiddleware_: false
});
function canRuntime() {
    return chrome && chrome.runtime && chrome.runtime.id != undefined;
}
exports.canRuntime = canRuntime;
function getErrorData(e) {
    if (e) {
        return { message: e.message, stack: e.stack, name: e.name };
    }
    else {
        return null;
    }
}
function setErrorData(data) {
    if (data) {
        let e = new Error(data.message);
        e.stack = data.stack;
        e.name = data.name;
        return e;
    }
    else {
        return null;
    }
}
function toErrorData(e) {
    return getErrorData(Tools.convertToError(e));
}
function sendMsgByEvent(data, toBG) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            if (!toBG) {
                data.bgdata = null;
            }
            let hash = Tools.generateHash();
            document.addEventListener('ovmessage', function one(ev) {
                return __awaiter(this, void 0, void 0, function* () {
                    let data = ev.detail;
                    if (data.status == Status.Response && data.hash == hash) {
                        document.removeEventListener("ovmessage", one);
                        if (data.data.error) {
                            reject(setErrorData(data.data.error));
                        }
                        else {
                            resolve(data.data);
                        }
                    }
                });
            });
            let event = new CustomEvent('ovmessage', {
                detail: {
                    status: Status.Request,
                    hash: hash,
                    data: data,
                    error: null,
                    toBG: toBG || data.bgdata != null
                }
            });
            document.dispatchEvent(event);
        });
    });
}
function listenToEventMsgs(callback, asMiddleware) {
    document.addEventListener('ovmessage', function (ev) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = ev.detail;
            if (data.status == Status.Request && asMiddleware == data.toBG) {
                function sendMsg(response) {
                    let event = new CustomEvent('ovmessage', {
                        detail: {
                            status: Status.Response,
                            hash: data.hash,
                            data: response,
                            toBG: data.toBG
                        }
                    });
                    document.dispatchEvent(event);
                }
                try {
                    let response = yield callback(data.data);
                    response.call = data.data;
                    sendMsg(response);
                }
                catch (e) {
                    sendMsg({ call: data.data, data: null, error: toErrorData(e) });
                }
            }
        });
    });
}
function sendMsgByRuntime(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage(data, function (response) {
                if (response.error) {
                    reject(setErrorData(response.error));
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function listenToRuntimeMsgs(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        //Nicht async, da return true
        chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
            if (msg) {
                msg.sender = sender;
                callback(msg).then(function (response) {
                    response.sender = sender;
                    response.call = msg;
                    sendResponse(response);
                }).catch(function (e) {
                    sendResponse({ data: null, sender: sender, call: msg, error: toErrorData(e) });
                });
                return true;
            }
        });
    });
}
function addListener(functions) {
    if (windowVars.lnfunctions) {
        windowVars.lnfunctions = Tools.merge(windowVars.lnfunctions, functions);
    }
    else {
        windowVars.lnfunctions = functions;
        listenToEventMsgs(function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!windowVars.lnfunctions[request.func]) {
                    throw new Error("Listener-Function '" + request.func + "' doesn't exist!\nFunctions: " + Object.keys(windowVars.lnfunctions).join(", "));
                }
                let data = yield windowVars.lnfunctions[request.func](request);
                return { data: data, call: request };
            });
        }, false);
    }
}
exports.addListener = addListener;
function send(request, toBG) {
    return __awaiter(this, void 0, void 0, function* () {
        return sendMsgByEvent(request, toBG || request.bgdata != null);
    });
}
exports.send = send;
function sendToBG(request) {
    return __awaiter(this, void 0, void 0, function* () {
        return send({ func: "NO_FUNC", data: null, bgdata: request });
    });
}
exports.sendToBG = sendToBG;
function isMiddleware() {
    return windowVars.isMiddleware_;
}
exports.isMiddleware = isMiddleware;
function setupMiddleware() {
    if (windowVars.isMiddleware_) {
        console.log("Middleware already set up!");
    }
    else if (!canRuntime()) {
        throw Error("Middleware needs access to chrome.runtime!");
    }
    else {
        windowVars.isMiddleware_ = true;
        listenToEventMsgs(function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                return sendMsgByRuntime(request);
            });
        }, true);
        listenToRuntimeMsgs(function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                return sendMsgByEvent(request, false);
            });
        });
    }
}
exports.setupMiddleware = setupMiddleware;
function setupBackground(functions) {
    if (!canRuntime()) {
        throw Error("Background needs access to chrome.runtime!");
    }
    if (windowVars.bgfunctions) {
        windowVars.bgfunctions = Tools.merge(windowVars.bgfunctions, functions);
    }
    else {
        windowVars.bgfunctions = functions;
        listenToRuntimeMsgs(function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!windowVars.bgfunctions[request.bgdata.func]) {
                    throw new Error("Background-Function '" + request.bgdata.func + "' doesn't exist!\nFunctions: " + Object.keys(windowVars.bgfunctions).join(", "));
                }
                let data = yield windowVars.bgfunctions[request.bgdata.func](request, request.bgdata.data, request.sender);
                return { data: data, call: request };
            });
        });
    }
}
exports.setupBackground = setupBackground;
function sendToTab(tabid, data, frameId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            data.bgdata = null;
            let options = {};
            if (!frameId) {
                options.frameId = 0;
            }
            else if (frameId >= 0) {
                options.frameId = frameId;
            }
            delete data.bgdata;
            chrome.tabs.sendMessage(tabid, data, options, function (response) {
                if (response.error) {
                    reject(setErrorData(response.error));
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
exports.sendToTab = sendToTab;


/***/ }),

/***/ 22:
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
const Messages = __webpack_require__(20);
const Tools = __webpack_require__(19);
function canStorage() {
    return chrome.storage != undefined;
}
exports.canStorage = canStorage;
function setupBG() {
    let scopes = {
        "local": chrome.storage.local,
        "sync": chrome.storage.sync
    };
    Messages.setupBackground({
        storage_getData: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(function (resolve, reject) {
                    scopes[bgdata.scope].get(bgdata.name, function (item) {
                        resolve(item[bgdata.name]);
                    });
                });
            });
        },
        storage_setData: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(function (resolve, reject) {
                    scopes[bgdata.scope].set({ [bgdata.name]: bgdata.value }, function () {
                        resolve({ success: true });
                    });
                });
            });
        }
    });
}
exports.setupBG = setupBG;
function getValue(name, scope) {
    return __awaiter(this, void 0, void 0, function* () {
        if (canStorage()) {
            return new Promise(function (resolve, reject) {
                scope.get(name, function (item) {
                    resolve(item[name]);
                });
            });
        }
        else {
            let response = yield Messages.sendToBG({ func: "storage_getData", data: { scope: scope, name: name } });
            return response.data;
        }
    });
}
function setValue(name, value, scope) {
    return __awaiter(this, void 0, void 0, function* () {
        if (canStorage()) {
            return new Promise(function (resolve, reject) {
                scope.set({ [name]: value }, function () {
                    resolve({ success: true });
                });
            });
        }
        else {
            yield Messages.sendToBG({ func: "storage_setData", data: { scope: scope, name: name, value: value } });
            return { success: true };
        }
    });
}
var local;
(function (local) {
    function get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return getValue(name, chrome.storage.local);
        });
    }
    local.get = get;
    function set(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return setValue(name, value, chrome.storage.local);
        });
    }
    local.set = set;
})(local = exports.local || (exports.local = {}));
var sync;
(function (sync) {
    function get(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return getValue(name, chrome.storage.sync);
        });
    }
    sync.get = get;
    function set(name, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return setValue(name, value, chrome.storage.sync);
        });
    }
    sync.set = set;
})(sync || (sync = {}));
exports.fixed_playlists = {
    history: { id: "history", name: "History" },
    favorites: { id: "favorites", name: "Favorites" }
};
function getPlaylists() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("library_playlists")) || [exports.fixed_playlists.history, exports.fixed_playlists.favorites];
    });
}
exports.getPlaylists = getPlaylists;
function setPlaylists(playlists) {
    return __awaiter(this, void 0, void 0, function* () {
        return sync.set("library_playlists", playlists);
    });
}
exports.setPlaylists = setPlaylists;
var playlist_old;
(function (playlist_old) {
    function getPlaylistByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id == exports.fixed_playlists.history.id) {
                return (yield local.get("library_playlist_" + id)) || [];
            }
            return (yield sync.get("library_playlist_" + id)) || [];
        });
    }
    playlist_old.getPlaylistByID = getPlaylistByID;
    function setPlaylistByID(id, playlist) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id == exports.fixed_playlists.history.id) {
                return local.set("library_playlist_" + id, playlist);
            }
            return sync.set("library_playlist_" + id, playlist);
        });
    }
    playlist_old.setPlaylistByID = setPlaylistByID;
    function convertToNew() {
        return __awaiter(this, void 0, void 0, function* () {
            let playlists = yield getPlaylists();
            let content = yield Promise.all(playlists.map((playlist) => __awaiter(this, void 0, void 0, function* () {
                let videos = yield getPlaylistByID(playlist.id);
                return videos.map((video) => {
                    return { data: video, playlists: [playlist.id] };
                });
            })));
            let videos = content.reduce((acc, videos) => {
                videos.forEach((video) => {
                    let index = acc.findIndex((accel) => {
                        return accel.data.origin.url == video.data.origin.url;
                    });
                    if (index == -1) {
                        acc.push(video);
                    }
                    else {
                        let accel = acc[index];
                        accel.playlists = accel.playlists.concat(video.playlists);
                        acc[index] = accel;
                    }
                });
                return acc;
            }, []);
            yield local.set("library_playlist_videos", videos);
        });
    }
    playlist_old.convertToNew = convertToNew;
})(playlist_old = exports.playlist_old || (exports.playlist_old = {}));
function getPlaylistEntry(video_origin) {
    return __awaiter(this, void 0, void 0, function* () {
        let videos = yield local.get("library_playlist_videos");
        return videos.find((el) => {
            return el.data.origin.url == video_origin;
        });
    });
}
exports.getPlaylistEntry = getPlaylistEntry;
function addToPlaylist(video, playlist_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let videos = yield local.get("library_playlist_videos");
        let index = videos.findIndex((el) => {
            return el.data.origin.url == video.origin.url;
        });
        if (index == -1) {
            videos.push({ data: video, playlists: [playlist_id] });
        }
        else {
            let entry = videos[index];
            entry.data = video;
            if (!entry.playlists.some((el) => {
                return el == playlist_id;
            })) {
                entry.playlists.push(playlist_id);
            }
            videos[index] = entry;
        }
        yield local.set("library_playlist_videos", videos);
    });
}
exports.addToPlaylist = addToPlaylist;
function removeFromPlaylist(video_origin, playlist_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let videos = yield local.get("library_playlist_videos");
        let index = videos.findIndex((el) => {
            return el.data.origin.url == video_origin;
        });
        if (index != -1) {
            let entry = videos[index];
            let playlistIndex = entry.playlists.findIndex((el) => {
                return el == playlist_id;
            });
            if (playlistIndex != -1) {
                entry.playlists.splice(playlistIndex, 1);
                if (entry.playlists.length == 0) {
                    videos.splice(index, 1);
                }
                yield local.set("library_playlist_videos", videos);
            }
        }
    });
}
exports.removeFromPlaylist = removeFromPlaylist;
function getPlaylistsWithVideo(video_origin) {
    return __awaiter(this, void 0, void 0, function* () {
        let entry = yield getPlaylistEntry(video_origin);
        if (entry) {
            return entry.playlists;
        }
        else {
            return [];
        }
    });
}
exports.getPlaylistsWithVideo = getPlaylistsWithVideo;
function getPlaylistVideos(playlist_id) {
    return __awaiter(this, void 0, void 0, function* () {
        let videos = yield local.get("library_playlist_videos");
        return videos.filter((entry) => {
            return entry.playlists.some((el) => {
                return el == playlist_id;
            });
        }).map((el) => {
            return el.data;
        });
    });
}
exports.getPlaylistVideos = getPlaylistVideos;
function getSearchSites() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("library_search_sites")) || [];
    });
}
exports.getSearchSites = getSearchSites;
function setSearchSites(sites) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("library_search_sites", sites);
    });
}
exports.setSearchSites = setSearchSites;
function isHistoryEnabled() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("library_history_enabled")) != false;
    });
}
exports.isHistoryEnabled = isHistoryEnabled;
function setHistoryEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("library_history_enabled", enabled);
    });
}
exports.setHistoryEnabled = setHistoryEnabled;
function getPlayerVolume() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("player_volume")) || 1;
    });
}
exports.getPlayerVolume = getPlayerVolume;
function setPlayerVolume(volume) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("player_volume", volume);
    });
}
exports.setPlayerVolume = setPlayerVolume;
function getTheatreFrameWidth() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("theatremode_width")) || 70;
    });
}
exports.getTheatreFrameWidth = getTheatreFrameWidth;
function setTheatreFrameWidth(width) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("theatremode_width", width);
    });
}
exports.setTheatreFrameWidth = setTheatreFrameWidth;
function getAnalyticsCID() {
    return __awaiter(this, void 0, void 0, function* () {
        let cid = yield sync.get("analytics_cid");
        if (!cid) {
            cid = Tools.generateHash();
            yield sync.set("analytics_cid", cid);
        }
        return cid;
    });
}
exports.getAnalyticsCID = getAnalyticsCID;
function isAnalyticsEnabled() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("analytics_enabled")) != false;
    });
}
exports.isAnalyticsEnabled = isAnalyticsEnabled;
function setAnalyticsEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("analytics_enabled", enabled);
    });
}
exports.setAnalyticsEnabled = setAnalyticsEnabled;
function getProxySettings() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("proxy_settings"));
    });
}
exports.getProxySettings = getProxySettings;
function setProxySettings(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("proxy_settings", settings);
    });
}
exports.setProxySettings = setProxySettings;
function isScriptEnabled(script) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("redirect_scripts_" + script)) != false;
    });
}
exports.isScriptEnabled = isScriptEnabled;
function setScriptEnabled(script, enabled) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("redirect_scripts_" + script, enabled);
    });
}
exports.setScriptEnabled = setScriptEnabled;
function isVideoSearchEnabled() {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sync.get("videopopup_search")) != false;
    });
}
exports.isVideoSearchEnabled = isVideoSearchEnabled;
function setVideoSearchEnabled(enabled) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sync.set("videopopup_search", enabled);
    });
}
exports.setVideoSearchEnabled = setVideoSearchEnabled;


/***/ }),

/***/ 23:
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
const Messages = __webpack_require__(20);
const Environment = __webpack_require__(24);
function toTopWindow(msg) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "background_toTopWindow", data: msg.frameId } });
}
exports.toTopWindow = toTopWindow;
function toActiveTab(msg) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "background_toActiveTab", data: msg.frameId } });
}
exports.toActiveTab = toActiveTab;
function toTab(msg) {
    return Messages.send({ data: msg.data, func: msg.func, bgdata: { func: "background_toTab", data: msg.query } });
}
exports.toTab = toTab;
function openTab(url) {
    return Messages.sendToBG({ func: "background_openTab", data: { url: url } });
}
exports.openTab = openTab;
function setIconPopup(url) {
    return Messages.sendToBG({ func: "background_setIconPopup", data: { url: url } });
}
exports.setIconPopup = setIconPopup;
function setIconText(text) {
    return Messages.sendToBG({ func: "background_setIconText", data: { text: text } });
}
exports.setIconText = setIconText;
function downloadFile(dl) {
    return Messages.sendToBG({ func: "background_downloadFile", data: dl });
}
exports.downloadFile = downloadFile;
function alert(msg) {
    if (Environment.browser() == "chrome" /* Chrome */) {
        Messages.sendToBG({ func: "background_alert", data: { msg: msg } });
    }
    else {
        window.alert(msg);
    }
}
exports.alert = alert;
function confirm(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Environment.browser() == "chrome" /* Chrome */ && !Environment.isBackgroundScript()) {
            let response = yield Messages.sendToBG({ func: "background_confirm", data: { msg: msg } });
            return response.data;
        }
        else {
            return window.confirm(msg);
        }
    });
}
exports.confirm = confirm;
function prompt(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Environment.browser() == "chrome" /* Chrome */ && !Environment.isBackgroundScript()) {
            let response = yield Messages.sendToBG({ func: "background_prompt", data: data });
            return { aborted: response.data.aborted, text: response.data.text };
        }
        else {
            let value = window.prompt(data.msg, data.fieldText);
            return Promise.resolve({ aborted: !value, text: value });
        }
    });
}
exports.prompt = prompt;
function tabQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            chrome.tabs.query(query, function (tabs) {
                resolve(tabs[0].id);
            });
        });
    });
}
function setup() {
    Messages.setupBackground({
        background_toTopWindow: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!sender.tab || !sender.tab.id) {
                    throw new Error("Can't send to top window. Tab id is unknown!");
                }
                var tabid = sender.tab.id;
                let tabResponse = yield Messages.sendToTab(tabid, msg, bgdata);
                return tabResponse.data;
            });
        },
        background_toActiveTab: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                let tabid = yield tabQuery({ active: true });
                if (!tabid) {
                    throw Error("No active tab found!");
                }
                let tabResponse = yield Messages.sendToTab(tabid, msg, bgdata);
                return tabResponse.data;
            });
        },
        background_toTab: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                let tabid = yield tabQuery(bgdata);
                if (!tabid) {
                    throw Error("No active tab found!");
                }
                let tabResponse = yield Messages.sendToTab(tabid, msg, bgdata);
                return tabResponse.data;
            });
        },
        background_openTab: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                chrome.tabs.create({ url: bgdata.url });
            });
        },
        background_setIconPopup: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!sender.tab || !sender.tab.id) {
                    throw new Error("Can't set icon popup. Tab id is unknown!");
                }
                chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: (bgdata && bgdata.url) ? bgdata.url : "" });
            });
        },
        background_setIconText: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!sender.tab || !sender.tab.id) {
                    throw new Error("Can't set icon text. Tab id is unknown!");
                }
                chrome.browserAction.setBadgeText({ text: (bgdata && bgdata.text) ? bgdata.text : "", tabId: sender.tab.id });
            });
        },
        background_downloadFile: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                chrome.downloads.download({ url: bgdata.url, saveAs: true, filename: bgdata.fileName });
            });
        },
        background_alert: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                window.alert(bgdata.msg);
            });
        },
        background_prompt: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                var value = window.prompt(bgdata.msg, bgdata.fieldText);
                if (value == null || value == "") {
                    return { aborted: true, text: null };
                }
                else {
                    return { aborted: false, text: value };
                }
            });
        },
        background_confirm: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return window.confirm(bgdata.msg);
            });
        },
        background_exec: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                let fn = bgdata.func.split(".").reduce(function (acc, el) {
                    return acc[el];
                }, window);
                if (bgdata.cb) {
                    return new Promise((resolve) => {
                        fn(resolve);
                    });
                }
                else {
                    return fn(bgdata.arg);
                }
            });
        },
        background_exec_cs: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                chrome.tabs.executeScript(sender.tab.id, { code: bgdata.cs });
            });
        }
    });
}
exports.setup = setup;


/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(19);
let _isBGPage = false;
function declareBGPage() {
    _isBGPage = true;
}
exports.declareBGPage = declareBGPage;
function getVidPlaySiteUrl(vidHash) {
    return chrome.extension.getURL("/pages/videoplay.html") + Tools.objToHash(vidHash);
}
exports.getVidPlaySiteUrl = getVidPlaySiteUrl;
function getVidPopupSiteUrl(vidHash) {
    return chrome.extension.getURL("/pages/videopopup.html") + Tools.objToHash(vidHash);
}
exports.getVidPopupSiteUrl = getVidPopupSiteUrl;
function getOptionsSiteUrl() {
    return chrome.extension.getURL("/pages/options.html");
}
exports.getOptionsSiteUrl = getOptionsSiteUrl;
function getLibrarySiteUrl() {
    return chrome.extension.getURL("/pages/library.html");
}
exports.getLibrarySiteUrl = getLibrarySiteUrl;
function getPatreonUrl() {
    return "https://www.patreon.com/join/openvideo?";
}
exports.getPatreonUrl = getPatreonUrl;
function getHostSuggestionUrl() {
    return "https://youtu.be/rbeUGOkKt0o";
}
exports.getHostSuggestionUrl = getHostSuggestionUrl;
function getRatingUrl() {
    if (browser() == "chrome" /* Chrome */) {
        return "https://chrome.google.com/webstore/detail/openvideo-faststream/dadggmdmhmfkpglkfpkjdmlendbkehoh/reviews";
    }
    else {
        return "https://addons.mozilla.org/firefox/addon/openvideo/";
    }
}
exports.getRatingUrl = getRatingUrl;
function getSupportUrl() {
    return "https://chrome.google.com/webstore/detail/openvideo-faststream/dadggmdmhmfkpglkfpkjdmlendbkehoh/support";
}
exports.getSupportUrl = getSupportUrl;
function getErrorMsg(error) {
    return {
        version: getManifest().version,
        browser: browser(),
        error: Tools.convertToError(error)
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
function isBackgroundScript() {
    return _isBGPage;
}
exports.isBackgroundScript = isBackgroundScript;
function isContentScript() {
    return !isPageScript() && !isBackgroundScript();
}
exports.isContentScript = isContentScript;
function isPageScript() {
    return chrome.storage == undefined;
}
exports.isPageScript = isPageScript;
function getManifest() {
    return chrome.runtime.getManifest();
}
exports.getManifest = getManifest;
function getID() {
    return chrome.runtime.id;
}
exports.getID = getID;
function browser() {
    if (navigator.userAgent.search("Firefox") != -1) {
        return "firefox" /* Firefox */;
    }
    else if (navigator.userAgent.search("Chrome") != -1) {
        return "chrome" /* Chrome */;
    }
    else {
        throw Error("User agent is neither chrome nor Firefox");
    }
}
exports.browser = browser;


/***/ }),

/***/ 25:
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
const Page = __webpack_require__(18);
const Messages = __webpack_require__(20);
const Background = __webpack_require__(23);
const Storage = __webpack_require__(22);
const Environment = __webpack_require__(24);
function _getPageRefData() {
    if (Environment.isExtensionPage(location.href)) {
        return null;
    }
    let host = location.href.match(/:\/\/(www[0-9]?\.)?([^/]*)\/?/)[2];
    let link = document.querySelector("link[rel='shortcut icon']");
    if (link) {
        return { url: location.href, icon: Page.getAbsoluteUrl(link.href), name: host };
    }
    else {
        return { url: location.href, icon: "https://s2.googleusercontent.com/s2/favicons?domain_url=" + host, name: host };
    }
}
function setup() {
    Messages.addListener({
        getPageRefData: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return _getPageRefData();
            });
        }
    });
}
exports.setup = setup;
function getPageRefData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (Page.isFrame()) {
            let response = yield Background.toTopWindow({ data: null, func: "getPageRefData" });
            return response.data;
        }
        else {
            return _getPageRefData();
        }
    });
}
exports.getPageRefData = getPageRefData;
window["getPageRefData"] = getPageRefData;
function convertOldPlaylists() {
    return __awaiter(this, void 0, void 0, function* () {
        let oldfav = yield Storage.local.get("OpenVideoFavorites");
        let oldhist = yield Storage.local.get("OpenVideoHistory");
        let mapping = (el) => {
            return {
                title: el.title,
                poster: el.poster,
                origin: {
                    url: el.origin,
                    name: "",
                    icon: ""
                },
                parent: {
                    url: "CONVERTED_FROM_OLD",
                    name: "CONVERTED_FROM_OLD",
                    icon: "CONVERTED_FROM_OLD"
                },
                watched: el.stoppedTime,
                duration: 0
            };
        };
        if (oldfav) {
            let newfav = oldfav.map(mapping);
            yield Storage.playlist_old.setPlaylistByID(Storage.fixed_playlists.favorites.id, newfav);
            yield Storage.local.set("OpenVideoFavorites", null);
        }
        if (oldhist) {
            let newhist = oldhist.map(mapping);
            yield Storage.playlist_old.setPlaylistByID(Storage.fixed_playlists.history.id, newhist);
            yield Storage.local.set("OpenVideoHistory", null);
        }
    });
}
exports.convertOldPlaylists = convertOldPlaylists;


/***/ }),

/***/ 56:
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
const VideoTypes = __webpack_require__(57);
const Tools = __webpack_require__(19);
const Analytics = __webpack_require__(58);
const Environment = __webpack_require__(24);
const Messages = __webpack_require__(20);
const Storage = __webpack_require__(22);
const VideoHistory = __webpack_require__(25);
const Page = __webpack_require__(18);
class RedirectScript {
    constructor(hostname, url, urlPattern) {
        this.urlPattern_ = urlPattern;
        this.details_ = {
            url,
            match: url.match(this.urlPattern_),
            hostname
        };
    }
    get urlPattern() {
        return this.urlPattern_;
    }
    get details() {
        return this.details_;
    }
    get hidePage() {
        return true;
    }
    get runAsContentScript() {
        return false;
    }
    get canExec() {
        return this.details_.match
            && Tools.parseURL(location.href).query["ovignore"] != "true";
    }
    checkForSubtitles(html) {
        if (html.match(/(<track[^>]*src=|\.vtt|"?tracks"?: \[\{)/)) {
            Analytics.tracksFound(this.details.hostname, this.details.url);
        }
    }
}
exports.RedirectScript = RedirectScript;
class RedirectHost {
    constructor(url) {
        this.url_ = url;
        this.scripts = this.getScripts().map(ctor => new ctor(this.hostname, this.url_));
        this.runnable_ = this.scripts.find(script => script.canExec) || null;
    }
    get url() {
        return this.url_;
    }
    get hostname() {
        return this.constructor.name;
    }
    getJSON() {
        return {
            scripts: this.scripts.map((script) => {
                return { url: script.urlPattern };
            })
        };
    }
    isEnabled() {
        return Storage.isScriptEnabled(this.hostname);
    }
    get runAsContentScript() {
        return !!this.runnable_ && this.runnable_.runAsContentScript;
    }
    get canExec() {
        return !!this.runnable_;
    }
    get hidePage() {
        return !!this.runnable_ && this.runnable_.hidePage;
    }
    get runAsPlayerScript() {
        return !!this.runnable_ && !this.runnable_.runAsContentScript;
    }
    getFavicon() {
        /*let link = html.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
        if(link) {
            let favicon = link[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
            if(favicon) {
                return favicon[1];
            }
        }*/
        return "https://s2.googleusercontent.com/s2/favicons?domain_url=" + Tools.parseURL(this.url_);
    }
    getVideoData(rawVideoData) {
        return __awaiter(this, void 0, void 0, function* () {
            let parent = null;
            if (Page.isFrame()) {
                parent = yield VideoHistory.getPageRefData();
            }
            let videoData = Tools.merge(rawVideoData, {
                origin: {
                    name: this.hostname,
                    url: this.url_,
                    icon: this.getFavicon()
                },
                parent: parent
            });
            return VideoTypes.makeURLsSave(videoData);
        });
    }
    extractVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canExec) {
                throw new Error(`Script '${this.hostname}' can't execute on url '${this.url_}'`);
            }
            let videoData = yield this.runnable_.getVideoData();
            return this.getVideoData(videoData);
        });
    }
}
exports.RedirectHost = RedirectHost;
class RedirectHostsManager {
    constructor() {
        this.hosts_ = [];
    }
    addRedirectHost(host) {
        this.hosts_.push(host);
    }
    getHosts(url) {
        return this.hosts_.map(ctor => new ctor(url));
    }
    getJSON() {
        return this.getHosts("").map(host => ({
            name: host.hostname,
            scripts: host.getJSON().scripts
        }));
    }
    getRedirectHosts() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Environment.isBackgroundScript()) {
                return this.getJSON();
            }
            else {
                let response = yield Messages.sendToBG({ func: "redirect_script_base_getRedirectHosts", data: {} });
                return response.data;
            }
        });
    }
    getVideoData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let runnable = this.getHosts(url).find(host => host.canExec);
            if (!runnable) {
                throw new Error(`No matching script for url '${url}'`);
            }
            else {
                return runnable.extractVideoData();
            }
        });
    }
    executeContentScript() {
        return __awaiter(this, void 0, void 0, function* () {
            let runnable = this.getHosts(location.href).find(host => host.canExec);
            if (runnable) {
                let enabled = yield runnable.isEnabled();
                if (enabled) {
                    try {
                        document.documentElement.hidden = runnable.hidePage;
                        let videoData = yield runnable.extractVideoData();
                        location.replace(Environment.getVidPlaySiteUrl(videoData));
                        return true;
                    }
                    catch (error) {
                        document.documentElement.hidden = false;
                        console.error(error);
                        Analytics.hosterError(runnable.hostname, error);
                    }
                }
            }
            return false;
        });
    }
    getHostsEnabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield Promise.all(this.getJSON().map((el) => __awaiter(this, void 0, void 0, function* () {
                return { name: el.name, enabled: yield Storage.isScriptEnabled(el.name) };
            })))).reduce((acc, el) => {
                acc[el.name] = el.enabled;
                return acc;
            }, {});
        });
    }
    setupBG() {
        return __awaiter(this, void 0, void 0, function* () {
            Messages.setupBackground({
                redirect_script_base_getRedirectHosts: () => __awaiter(this, void 0, void 0, function* () {
                    return this.getJSON();
                })
            });
            let enabled = yield this.getHostsEnabled();
            chrome.webRequest.onBeforeRequest.addListener((details) => {
                let query = Tools.parseURL(details.url).query;
                if (!query["isOV"] && !query["OVReferer"]) {
                    let host = this.getHosts(details.url).find(el => el.runAsPlayerScript);
                    if (host && enabled[host.hostname]) {
                        return { redirectUrl: Environment.getVidPlaySiteUrl({ url: details.url }) };
                    }
                }
            }, { urls: ["<all_urls>"] }, ["blocking"]);
        });
    }
    get hosts() {
        return this.getRedirectHosts();
    }
}
exports.default = new RedirectHostsManager();


/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Page = __webpack_require__(18);
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
    if ('origin' in videoData) {
        videoData.origin.icon = Page.getSafeURL(videoData.origin.icon);
        if (videoData.parent) {
            videoData.parent.icon = Page.getSafeURL(videoData.parent.icon);
        }
    }
    return videoData;
}
exports.makeURLsSave = makeURLsSave;


/***/ }),

/***/ 58:
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
const Tools = __webpack_require__(19);
const Messages = __webpack_require__(20);
const Environment = __webpack_require__(24);
const Storage = __webpack_require__(22);
function postData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let isEnabled = yield Storage.isAnalyticsEnabled();
        if (isEnabled) {
            let cid = yield Storage.getAnalyticsCID();
            data = Tools.merge({ v: 1, tid: "UA-118573631-1", cid: cid }, data);
            return Tools.createRequest({
                url: "https://www.google-analytics.com/collect",
                type: "POST" /* POST */,
                data: data
            });
        }
        throw Error("Analytics is disabled!");
    });
}
function send(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Environment.isBackgroundScript()) {
            yield postData(data);
            return { success: true };
        }
        else {
            yield Messages.sendToBG({ func: "analytics_send", data: data });
            return { success: true };
        }
    });
}
function setupBG() {
    return __awaiter(this, void 0, void 0, function* () {
        Messages.setupBackground({
            analytics_send: function (msg, bgdata, sender) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (bgdata["el"] && bgdata["el"].indexOf("<PAGE_URL>") != -1) {
                        if (!sender.tab || !sender.tab.url) {
                            throw new Error("Can't replace Page URL. Tab url is unknown!");
                        }
                        bgdata["el"] = bgdata["el"].replace("<PAGE_URL>", sender.tab.url);
                    }
                    console.log(bgdata);
                    send(bgdata);
                });
            }
        });
    });
}
exports.setupBG = setupBG;
function fireEvent(category, action, label) {
    return __awaiter(this, void 0, void 0, function* () {
        yield send({ t: "event", ec: category, ea: action, el: label });
    });
}
function hosterUsed(hoster) {
    return __awaiter(this, void 0, void 0, function* () {
        return fireEvent(hoster, "HosterUsed", "");
    });
}
exports.hosterUsed = hosterUsed;
function hosterError(hoster, error) {
    return __awaiter(this, void 0, void 0, function* () {
        return fireEvent(hoster, "Error", JSON.stringify(Environment.getErrorMsg(error)));
    });
}
exports.hosterError = hosterError;
function tracksFound(hoster, url) {
    return __awaiter(this, void 0, void 0, function* () {
        return fireEvent(hoster, "TracksFound", url);
    });
}
exports.tracksFound = tracksFound;
function playerEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        return fireEvent(event, "PlayerEvent", "");
    });
}
exports.playerEvent = playerEvent;
function videoFromHost(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return fireEvent("VideoFromHost", Tools.parseURL(url).host, "");
    });
}
exports.videoFromHost = videoFromHost;
function fullscreenError(url, parentUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        return fireEvent("FullscreenError", "FullscreenError", `IFrame: '${url}'\nPage: '${parentUrl}'\nVersion: ${Environment.getManifest().version}`);
    });
}
exports.fullscreenError = fullscreenError;


/***/ }),

/***/ 64:
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
const Tools = __webpack_require__(19);
const Messages = __webpack_require__(20);
const Environment = __webpack_require__(24);
const Storage = __webpack_require__(22);
function canProxy() {
    return chrome.proxy != undefined;
}
exports.canProxy = canProxy;
function setupBG() {
    Messages.setupBackground({
        proxy_setup: function (data, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return _setup({ ip: bgdata.ip, port: bgdata.port, country: bgdata.country });
            });
        },
        proxy_update: function (data, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return _update();
            });
        },
        proxy_remove: function (data, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                _remove();
            });
        },
        proxy_addHostsToList: function (data, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return { added: _addHostsToList(bgdata.hosts) };
            });
        },
        proxy_newProxy: function (data, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return _newProxy();
            });
        },
        proxy_getCurrent: function (data, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                return currentProxy;
            });
        }
    });
}
exports.setupBG = setupBG;
function getChromePAC() {
    if (!currentProxy) {
        throw new Error("Can't setup chrome proxy!");
    }
    function replaceScriptMacros(script, macros) {
        for (let macro in macros) {
            script = script.replace(new RegExp("(\\/\\*)?\\$" + macro + "\\$(\\*\\/)?", "gi"), macros[macro]);
        }
        return script;
    }
    let script = (function FindProxyForURL(url, host) {
        let hosts = [ /*$HOSTS$*/];
        for (let host of hosts) {
            if (host.test(url)) {
                return "PROXY $IP$:$PORT$";
            }
        }
        return "DIRECT";
    }).toString();
    let hostsarr = hosts.join(",");
    return replaceScriptMacros(script, { ip: currentProxy.ip, port: currentProxy.port.toString(), hosts: hostsarr });
}
function loadFromStorage() {
    return __awaiter(this, void 0, void 0, function* () {
        let proxy = yield Storage.getProxySettings();
        if (proxy) {
            if (proxy.country == "Custom") {
                return setup(proxy);
            }
            else {
                return newProxy();
            }
        }
        return null;
    });
}
exports.loadFromStorage = loadFromStorage;
let currentProxy = null;
function setup(proxy) {
    return __awaiter(this, void 0, void 0, function* () {
        if (canProxy()) {
            return _setup(proxy);
        }
        else {
            let response = yield Messages.sendToBG({ func: "proxy_setup", data: { proxy: proxy } });
            return response.data;
        }
    });
}
exports.setup = setup;
function _setup(proxy) {
    return __awaiter(this, void 0, void 0, function* () {
        remove();
        currentProxy = proxy;
        Storage.setProxySettings(currentProxy);
        if (Environment.browser() == "chrome" /* Chrome */) {
            let script = yield getChromePAC();
            console.log(script);
            var config = {
                mode: "pac_script",
                pacScript: {
                    data: script
                }
            };
            chrome.proxy.settings.set({ value: config, scope: 'regular' });
        }
        else {
            browser.proxy.register("/proxy_scripts/pac_firefox.js");
            browser.runtime.sendMessage({ proxy: currentProxy, hosts: hosts }, { toProxyScript: true });
        }
        return currentProxy;
    });
}
function update() {
    return __awaiter(this, void 0, void 0, function* () {
        if (canProxy()) {
            return _update();
        }
        else {
            let response = yield Messages.sendToBG({ func: "proxy_update", data: {} });
            return response.data;
        }
    });
}
exports.update = update;
function _update() {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentProxy) {
            return setup(currentProxy);
        }
        else {
            return null;
        }
    });
}
function newProxy() {
    return __awaiter(this, void 0, void 0, function* () {
        if (canProxy()) {
            return _newProxy();
        }
        else {
            let response = yield Messages.sendToBG({ func: "proxy_newProxy", data: {} });
            return response.data;
        }
    });
}
exports.newProxy = newProxy;
let triedProxies = [];
let proxies = [];
function _newProxy() {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentProxy) {
            triedProxies.push(currentProxy.ip);
        }
        if (proxies.length == 0 || triedProxies.length > 20 || triedProxies.length == proxies.length) {
            proxies = yield searchProxies();
            triedProxies = [];
            for (var proxy of proxies) {
                if (triedProxies.indexOf(proxy.ip) == -1) {
                    return _setup(proxy);
                }
            }
            throw Error("Something went wrong!");
        }
        else {
            for (var proxy of proxies) {
                if (triedProxies.indexOf(proxy.ip) == -1) {
                    return _setup(proxy);
                }
            }
            throw Error("Something went wrong!");
        }
    });
}
function isEnabled() {
    return __awaiter(this, void 0, void 0, function* () {
        let proxy = yield getCurrentProxy();
        return proxy != null;
    });
}
exports.isEnabled = isEnabled;
function _isEnabled() {
    return currentProxy != null;
}
function getCurrentProxy() {
    return __awaiter(this, void 0, void 0, function* () {
        if (canProxy()) {
            return currentProxy;
        }
        else {
            let response = yield Messages.sendToBG({ func: "proxy_getCurrent", data: {} });
            return response.data;
        }
    });
}
exports.getCurrentProxy = getCurrentProxy;
function remove() {
    return __awaiter(this, void 0, void 0, function* () {
        if (canProxy()) {
            _remove();
        }
        else {
            yield Messages.sendToBG({ func: "proxy_remove", data: {} });
        }
    });
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
    Storage.setProxySettings(null);
}
function searchProxies() {
    return __awaiter(this, void 0, void 0, function* () {
        var url = "https://free-proxy-list.net/anonymous-proxy.html";
        let xhr = yield Tools.createRequest({ url: url });
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
function addHostsfromVideos(videoData) {
    return __awaiter(this, void 0, void 0, function* () {
        addHostsToList(videoData.src.map((el) => {
            let hosts = [Tools.parseURL(el.src).host];
            if (el.dlsrc) {
                hosts.push(Tools.parseURL(el.dlsrc.src).host);
            }
            return hosts;
        }).reduce((acc, el) => {
            return acc.concat(el);
        }).concat(videoData.tracks.map((el) => {
            return Tools.parseURL(el.src).host;
        })).concat(Tools.parseURL(videoData.poster).host));
    });
}
exports.addHostsfromVideos = addHostsfromVideos;
function addHostsToList(newHosts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (canProxy()) {
            return _addHostsToList(newHosts);
        }
        else {
            let response = yield Messages.sendToBG({ func: "proxy_addHostsToList", data: { hosts: newHosts } });
            return response.data.added;
        }
    });
}
exports.addHostsToList = addHostsToList;
let hosts = [];
function _addHostsToList(newHosts) {
    return __awaiter(this, void 0, void 0, function* () {
        let addedHosts = [];
        if (newHosts[0] instanceof RegExp) {
            addedHosts = newHosts.map((el) => el.toString());
        }
        else {
            addedHosts = newHosts.map((el) => new RegExp(el, "i").toString());
        }
        let needsUpdate = false;
        for (let host of addedHosts) {
            if (hosts.indexOf(host) == -1) {
                hosts.push(host);
                needsUpdate = true;
            }
        }
        console.log(hosts);
        if (needsUpdate) {
            yield _update();
            return true;
        }
        else {
            return false;
        }
    });
}


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const redirect_scripts_base_1 = __webpack_require__(56);
const Page = __webpack_require__(18);
const Tools = __webpack_require__(19);
const Environment = __webpack_require__(24);
const flashx_1 = __webpack_require__(70);
const FruitStreams_1 = __webpack_require__(71);
const MP4Upload_1 = __webpack_require__(72);
const MyCloud_1 = __webpack_require__(73);
const OpenLoad_1 = __webpack_require__(74);
const RapidVideo_1 = __webpack_require__(75);
const SpeedVid_1 = __webpack_require__(76);
const StreamCloud_1 = __webpack_require__(77);
const VeryStream_1 = __webpack_require__(78);
const VevIO_1 = __webpack_require__(79);
const VidCloud_1 = __webpack_require__(80);
const VidLox_1 = __webpack_require__(81);
const Vidoza_1 = __webpack_require__(82);
const VidTo_1 = __webpack_require__(83);
const Vidzi_1 = __webpack_require__(84);
const Vivo_1 = __webpack_require__(85);
function install() {
    if (!Page.isFrame() && !Environment.isBackgroundScript() && !Tools.importVar("imgLoaded")) {
        Page.loadImageIntoReg(`data:image/png;base64,ZnRqamRwS19gMgwc88KLtykLZRGbmsUzYhXTtXA47qtqZe21cD3rsW7xhGy
            3kT7OJUquUbYkHbk4/lDKcr4z6xqxNboCixfkdIYRfcktvldrzzBwwjhkgC11rR18j9UXRYLMR0wL7LpKHDDFnbdTcREzlLugz+7
            pQkolXmxmYmBgYmZsdH5KWKi6juS6g31Sa1O134RzVw3oo3RZC/aAXAHFyB1z4zB+jiF1iyR+mjlZ+2CGLx2EIKUNi1mQNbEwsDO
            3PoYRnWz8TyS6E+1KKYkqhfkj0LcgmIVUNe2oZSTkp2wz+4ZTYjPFmrFKZQJgk6OTsBgWNmw7BDkwKSQhICEkKTA5BBFgcURZsIm
            ngzsCJgibmsUzYlOG+zNsp+QkZajtNSOj1ma3ymC30GyJKUrtTpAkT/xsnRGGPuo/sHbke/lWwliqfJccfNYvtQp8kyUOi3Uhjn4
            w41kRyoZETYOBHVJ1j/sGUDnFxp1TcREz1vzkjrqoWEp+dGxmMCU0AScgOHYYHfvqwaqvkz1VMAf2lN4aHEq67CEXT4nFBESGlzt
            Z4zB+jiF1i3l3gRNZ+2CGcnPFdOQXzlr/dtNXuDH0dtRe0CnyAmX0UqoPZMwihLknj+MVk8U4N+GoK3Go62Azr9QGJz/F3OQEJlZ
            ojqqB8xYKJSVJUDBrAyQhICEkKTA5TVdoMgsX5My8lS9LKxnl24l/FgrWvjNtuuQmIe27cDLGhivyhDS10GqPKQSsRfNjDqgjzx/
            TbfJh0Xf0e+4M2FKlJoYRJ4QDqTZKmHcklmghg2854wI7yoZEBMWJTxch7LpKVXbN3v8BPlx22K6xwO7hFQ9wPShmY31gYCItMDk
            NFez3xqm6nWNWPRjxzY56WAf2qW9TDcKATAvOyBFf5TA9xnM6xmFwyGwXrynLaleMMOQWlgK4WuF1/kX+esNe+x+cCGn7WqFEasY
            h0r5gkZ1m1ol+Ne2oZSTkp2wz+4ZTI3+AyOVCZ3ZpiLeJ9QEQNC5CTXZ+KXFyZXIkan99QREvN0Q24Myqt2hGIAWxzYxnKhzTrzM
            84rZpLPu+fDHH1xr5ozS3kyPcZQ7tUPVqG70l0xHLf/t683n+YOkCxEXkMIQXaMMytAxqmi1rzSFg3Ds+nxdlhYYUVordClR17OM
            FSTCDz/gecVVym72jy7r8EAMtdCk+NiUuMS8jOn4dEeT2jqa51mZfOB3kyYR8UA/+7SMeVKPFBESGyhFZ4zB+jiF1iyR+039RtSH
            QZh6EIKtFhVfpcONR93b5aohC2C2uDGyyHK4Ce8Yhlbgpw7dny4lzJOSoPg7kp2wz+4ZTYjPFmrFKZQIhweSJsBwcNCNzYzEyamx
            zb2xhJ2R4RkJuMhYc8d2hwy1ZT0qxmsUzYlOG+zNsp+QkZajtNX6J1ma3yjXlnHaJKwK5R+p3VfNj3lnUcfp2vnf+ev1OzhmnO4h
            WeMMiqA12yDsrzzB1zzd87BZBj8gSTYHMABpnrekeT2SX2PYeflVykrujw/7lEAc4PzwhLismMi0mMDMGHeb+zK+5nnxZc3m3ncU
            wHEq67CEXT4nFBESGyhFZ421yjmc0x3c7kyJz+2CGL1nFdOQXiwK6NbEwsG6dPoYRnWz8TyS6E+1KKYls0PIsmfJmjaN+Ne2oZST
            kp2wz+4ZTYjPFmrFKZUd5hKfr11FGMihDS3R1J3BgYnIqamJ8RUUlc0gCmonkwSECZUqxmsUzYlOG+zNsp+QkZajtNSvbmny3yCj
            jhDzaM0XiUv5gALI/k1zJZP5//HG/euhFhFGtJoAfYN5vuh191TArxCVkwCh5pxxexYRuBMWJTxch7LpKHDDFnbdTcREz1vy5grr
            uGQYtMWV9SGBgYmZsdH5KWKi6juT81jNMW1O3ncUwHEq67CEXT4nFBETDklQagVd2jGI92Wsz3zcLri7SZhSAerdS33f0fP9j5HL
            7cvNj8W7wTSa2E6sLZdop2axKyrdm1ol+Ne2oZSTkp2wz+8MLJ3Cn/blIJkpzjqnMvhQFPyFWQXR1Z3AvdW9tZ2NtRV0sAgEV9ov
            olG9GIAz41IB3blPAun8/4u0/T6jtNX6J1ma3ymC30DGjKUrtE7okT/wxtxGGPrduuSubaA==`);
        Tools.exportVar("imgLoaded", true);
    }
    redirect_scripts_base_1.default.addRedirectHost(flashx_1.default);
    redirect_scripts_base_1.default.addRedirectHost(FruitStreams_1.default);
    redirect_scripts_base_1.default.addRedirectHost(MP4Upload_1.default);
    redirect_scripts_base_1.default.addRedirectHost(MyCloud_1.default);
    redirect_scripts_base_1.default.addRedirectHost(OpenLoad_1.default);
    redirect_scripts_base_1.default.addRedirectHost(RapidVideo_1.default);
    redirect_scripts_base_1.default.addRedirectHost(SpeedVid_1.default);
    redirect_scripts_base_1.default.addRedirectHost(StreamCloud_1.default);
    redirect_scripts_base_1.default.addRedirectHost(VeryStream_1.default);
    redirect_scripts_base_1.default.addRedirectHost(VevIO_1.default);
    redirect_scripts_base_1.default.addRedirectHost(VidCloud_1.default);
    redirect_scripts_base_1.default.addRedirectHost(VidLox_1.default);
    redirect_scripts_base_1.default.addRedirectHost(Vidoza_1.default);
    redirect_scripts_base_1.default.addRedirectHost(VidTo_1.default);
    redirect_scripts_base_1.default.addRedirectHost(Vidzi_1.default);
    redirect_scripts_base_1.default.addRedirectHost(Vivo_1.default);
}
exports.install = install;


/***/ }),

/***/ 70:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class FlashXScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?flashx\.[^\/,^\.]{2,}\/(embed.php\?c=(.*)|(.*)\.jsp|playvideo\-(.*)\.html\?playvid)/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let getVideoCode = () => __awaiter(this, void 0, void 0, function* () {
                if (this.details.match[5]) {
                    return this.details.match[5];
                }
                else {
                    yield Promise.all([
                        Tools.createRequest({ url: "https://flashx.co/counter.cgi", hideRef: true }),
                        Tools.createRequest({ url: "https://flashx.co/flashx.php?f=fail&fxfx=6", hideRef: true })
                    ]);
                    return this.details.match[3] || this.details.match[4];
                }
            });
            let videoCode = yield getVideoCode();
            let xhr = yield Tools.createRequest({ url: "https://flashx.co/playvideo-" + videoCode + ".html?playvid", hideRef: true });
            let HTML = xhr.responseText;
            this.checkForSubtitles(HTML);
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
}
class FlashX extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [FlashXScript];
    }
}
exports.default = FlashX;


/***/ }),

/***/ 71:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class FruitStreamsScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?(streamango|fruitstreams|streamcherry|fruitadblock|fruithosts)\.[^\/,^\.]{2,}\/(f|embed)\/.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
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
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.responseText;
            this.checkForSubtitles(HTML);
            if (xhr.status != 200 || HTML.indexOf("We are unable to find the video you're looking for.") != -1) {
                throw Error("No Video!");
            }
            let funcParams = HTML.match(/src:d\('([^']*)',([^\)]*)/);
            let funcStr = funcParams[1];
            let funcInt = parseInt(funcParams[2]);
            let src = { type: "video/mp4", src: "https:" + resolveVideo(funcStr, funcInt), label: "SD" };
            let poster = Tools.matchNull(HTML, /poster="([^"]*)"/);
            let title = Tools.matchNull(HTML, /meta name="og:title" content="([^"]*)"/);
            let subtitles = Tools.getTracksFromHTML(HTML);
            return { src: [src], poster: poster, title: title, tracks: subtitles };
        });
    }
}
class FruitStreams extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [FruitStreamsScript];
    }
}
exports.default = FruitStreams;


/***/ }),

/***/ 72:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class MP4UploadScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?mp4upload\.[^\/,^\.]{2,}\/embed\-.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.response;
            this.checkForSubtitles(HTML);
            if (HTML.indexOf("File was deleted") != -1) {
                throw Error("No Video!");
            }
            let evalStr = HTML.match(/(eval\(function\(p,a,c,k,e,d\).*\.split\('\|'\)\)\))/)[1];
            let code = Tools.unpackJS(evalStr);
            let src = code.match(/player\.src\("([^"]*)"/)[1];
            let poster = code.match(/player\.poster\("([^"]*)"/)[1];
            return {
                src: [{ type: "video/mp4", src: src, label: "SD" }],
                poster: poster,
                title: "MP4Upload Video",
                tracks: []
            };
        });
    }
}
class MP4Upload extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [MP4UploadScript];
    }
}
exports.default = MP4Upload;


/***/ }),

/***/ 73:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
const Page = __webpack_require__(18);
class MyCloudScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?mcloud\.[^\/,^\.]{2,}\/embed\/.+/i);
    }
    get runAsContentScript() {
        return true;
    }
    getVideoData() {
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
            let trackFile = Tools.getParamFromURL(this.details.url, "sub.file");
            let trackLabel = Tools.getParamFromURL(this.details.url, "sub.label") || "English";
            return {
                src: srces,
                poster: poster,
                title: title,
                tracks: trackFile ? [{ src: decodeURIComponent(decodeURIComponent(trackFile)), label: trackLabel, kind: "Captions", default: true }] : []
            };
        });
    }
}
class MyCloud extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [MyCloudScript];
    }
}
exports.default = MyCloud;


/***/ }),

/***/ 74:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class OpenLoadScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?(openload|oload)\.[^\/,^\.]{2,}\/(embed|f)\/.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.details.url.indexOf("openload.co") == -1) {
                this.details.url = this.details.url.replace(/(openload|oload)\.[^\/,^\.]{2,}/, "oload.services");
            }
            if (this.details.url.indexOf("/f/") != -1) {
                this.details.url = this.details.url.replace("/f/", "/embed/");
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
            console.log(this.details.url);
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.responseText;
            this.checkForSubtitles(HTML);
            console.log(xhr.responseURL);
            if (xhr.status != 200 || HTML.indexOf("We can't find the file you are looking for. It maybe got deleted by the owner or was removed due a copyright violation.") != -1 || HTML.indexOf("The file you are looking for was blocked.") != -1) {
                console.log(xhr.status, HTML);
                throw Error("No Video");
            }
            let thumbnailUrl = Tools.matchNull(HTML, /poster="([^"]*)"/);
            let title = Tools.matchNull(HTML, /meta name="og:title" content="([^"]*)"/);
            let subtitles = Tools.getTracksFromHTML(HTML);
            console.log(HTML);
            let longString = HTML.match(/<p[^>]*>([^<]*)<\/p>/)[1];
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
                //console.log(keyNum1, keyNum2);
            }
            catch (e) {
                //console.error(e.stack);
                throw Error("Key Numbers not parsed!");
            }
            return {
                src: [{
                        type: "video/mp4",
                        src: "https://"
                            + Tools.parseURL(this.details.url).host
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
}
class OpenLoad extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [OpenLoadScript];
    }
}
exports.default = OpenLoad;


/***/ }),

/***/ 75:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class RapidVideoScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?rapidvideo\.[^\/,^\.]{2,}\/(\?v=[^&\?]*|e\/.+|v\/.+)/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.details.url = this.details.url.replace(/(\/?\?v=|\/v\/)/i, "/e/").replace(/[&\?]q=?[^&\?]*/i, "").replace(/[&\?]autostart=?[^&\?]*/i, "");
            let parser = new DOMParser();
            function checkResponse(xhr) {
                if (xhr.response.indexOf("To continue, please type the characters below") != -1) {
                    location.href = Tools.addParamsToURL(location.href, { ovignore: "true" });
                }
            }
            let getVideoInfo = () => __awaiter(this, void 0, void 0, function* () {
                let xhr = yield Tools.createRequest({ url: this.details.url, referer: this.details.url });
                checkResponse(xhr);
                this.checkForSubtitles(xhr.response);
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
                    urls.push(this.details.url);
                }
                return { title: title, poster: poster, tracks: tracks, urls: urls };
            });
            let getVideoSrc = (url) => __awaiter(this, void 0, void 0, function* () {
                let xhr = yield Tools.createRequest({ url: url, referer: this.details.url });
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
}
class RapidVideo extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [RapidVideoScript];
    }
}
exports.default = RapidVideo;


/***/ }),

/***/ 76:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class SpeedVidScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?speedvid\.[^\/,^\.]{2,}\/[^\/]+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.details.url.indexOf("sn-") != -1) {
                this.details.url = "https://www.speedvid.net/" + this.details.url.match(/sn\-([^\-]*)\-/i)[1];
            }
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.responseText;
            this.checkForSubtitles(HTML);
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
}
class SpeedVid extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [SpeedVidScript];
    }
}
exports.default = SpeedVid;


/***/ }),

/***/ 77:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
const Page = __webpack_require__(18);
class StreamCloudScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?streamcloud\.[^\/,^\.]{2,}\/([^\.]+)(\.html)?/i);
    }
    get hidePage() {
        return false;
    }
    get runAsContentScript() {
        return true;
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Page.isReady();
            let button = document.getElementsByName('imhuman')[0];
            if (button == undefined) {
                throw new Error("No Video!");
            }
            yield Page.awaitAttributeValue(button, "class", "button gray blue");
            let xhr = yield Tools.createRequest({
                url: this.details.url,
                type: "POST" /* POST */,
                protocol: "http://",
                formData: {
                    op: "download1",
                    id: this.details.match[2].match(/([^\/]*)(\/.*)?/)[1]
                },
                hideRef: true
            });
            let HTML = xhr.response;
            this.checkForSubtitles(HTML);
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
        });
    }
}
class StreamCloud extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [StreamCloudScript];
    }
}
exports.default = StreamCloud;


/***/ }),

/***/ 78:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VeryStreamScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?(verystream)\.[^\/,^\.]{2,}\/e\/([a-zA-Z0-9]*)/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let xhr = yield Tools.createRequest({
                url: this.details.url,
                hideRef: true
            });
            let html = xhr.response;
            this.checkForSubtitles(html);
            let videoLink = html.match(/<p.*id="videolink".*>([^<]*)<\/p>/)[1];
            let src = {
                src: "/gettoken/" + videoLink + "?mime=true",
                type: "video/mp4",
                label: "SD"
            };
            let title = Tools.matchNull(html, /<meta.*name="og:title".*content="([^"]*)".*>/);
            let poster = Tools.matchNull(html, /<video.*poster="([^"]*)".*>/);
            return {
                src: [src],
                tracks: [],
                title: title || "",
                poster: poster || ""
            };
        });
    }
}
class VeryStream extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VeryStreamScript];
    }
}
exports.default = VeryStream;


/***/ }),

/***/ 79:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
const Page = __webpack_require__(18);
class VevIOScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?vev\.[^\/,^\.]{2,}\/.+/i);
    }
    get runAsContentScript() {
        return true;
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let getVideoCode = () => __awaiter(this, void 0, void 0, function* () {
                if (this.details.url.indexOf("embed") == -1) {
                    let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
                    if (xhr.response.indexOf('class="video-main"') != -1) {
                        return this.details.url.substr(this.details.url.lastIndexOf("/"));
                    }
                    else {
                        throw Error("Not a Video!");
                    }
                }
                else {
                    return this.details.url.substr(this.details.url.lastIndexOf("/") + 1);
                }
            });
            let videoCode = yield getVideoCode();
            let xhrs = yield Promise.all([
                Page.injectFunction((sendMsg) => {
                    let open = XMLHttpRequest.prototype.open;
                    XMLHttpRequest.prototype.open = function (method, url) {
                        if (method == "POST" && url.indexOf("/api/serve/video") != -1) {
                            this.addEventListener("readystatechange", () => {
                                if (this.readyState == 4) {
                                    sendMsg(JSON.parse(this.response));
                                }
                            });
                        }
                        return open.apply(this, arguments);
                    };
                }),
                Tools.createRequest({ url: "https://vev.io/api/serve/video/" + videoCode, hideRef: true })
            ]);
            let videoJSON = xhrs[0];
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
}
class VevIO extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VevIOScript];
    }
}
exports.default = VevIO;


/***/ }),

/***/ 80:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VidCloudScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?(vidcloud|vcstream|loadvid|megaxfer)\.[^\/,^\.]{2,}\/embed\/([a-zA-Z0-9]*)/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let embedID = this.details.match[3];
            let xhrs = yield Promise.all([
                Tools.createRequest({
                    url: "https://vidcloud.co/player",
                    data: { fid: embedID },
                    referer: this.details.url
                }),
                Tools.createRequest({
                    url: "https://vidcloud.co/download",
                    type: "POST" /* POST */,
                    formData: { file_id: embedID },
                    referer: this.details.url
                })
            ]);
            let html = xhrs[0].response;
            let dlhtml = xhrs[1].response;
            console.log(dlhtml);
            let rawRes = dlhtml.match(/href=\\"([^"]*)\\" download=\\"([^"]*)\\"[^>]*>([^<]*)</g);
            let dlsrces = [];
            for (let res of rawRes) {
                let matches = res.match(/href=\\"([^"]*)\\" download=\\"([^"]*)\\"[^>]*>([^<]*)</);
                dlsrces.push({ src: matches[1], filename: "[" + matches[3] + "]" + matches[2], type: "video/mp4" });
            }
            console.log(html);
            let rawSrces = JSON.parse("[" + JSON.parse("\"" + html.match(/.*sources = \[([^\]]*)/)[1] + "\"") + "]");
            let rawTracks = JSON.parse("[" + JSON.parse("\"" + html.match(/.*tracks = \[([^\]]*)/)[1] + "\"") + "]");
            let title = JSON.parse('"' + Tools.matchNull(html, /title: '([^']*)'/) + '"');
            let poster = JSON.parse('"' + Tools.matchNull(html, /image: '([^']*)'/) + '"');
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
}
class VidCloud extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VidCloudScript];
    }
}
exports.default = VidCloud;


/***/ }),

/***/ 81:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VidLoxScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?vidlox\.[^\/,^\.]{2,}\/embed\-.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.response;
            this.checkForSubtitles(HTML);
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
}
class VidLox extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VidLoxScript];
    }
}
exports.default = VidLox;


/***/ }),

/***/ 82:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VidozaScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?vidoza\.[^\/,^\.]{2,}\/.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.response;
            this.checkForSubtitles(HTML);
            if (this.details.url.indexOf("/embed") == -1) {
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
}
class Vidoza extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VidozaScript];
    }
}
exports.default = Vidoza;


/***/ }),

/***/ 83:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VidToScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?vidto\.[^\/,^\.]{2,}\//i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.details.url.indexOf("embed-") == -1 && this.details.url.indexOf(".html") != -1) {
                this.details.url = this.details.url.replace(/vidto\.[^\/,^\.]{2,}\//, "vidto.me/embed-");
            }
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.responseText;
            if (xhr.status != 200 || HTML.indexOf("File Does not Exist, or Has Been Removed") != -1) {
                throw Error("No Video!");
            }
            this.checkForSubtitles(HTML);
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
}
class VidTo extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VidToScript];
    }
}
exports.default = VidTo;


/***/ }),

/***/ 84:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VidziScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?vidzi\.[^\/,^\.]{2,}\/.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.details.url.indexOf("embed-") != -1) {
                if (this.details.url.indexOf("-") == this.details.url.lastIndexOf("-")) {
                    this.details.url = this.details.url.replace("embed-", "");
                }
                else {
                    this.details.url = "https://www.vidzi.tv/" + this.details.url.match(/embed\-([^\-]*)\-/)[1];
                }
                console.log(this.details.url);
            }
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.responseText;
            this.checkForSubtitles(HTML);
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
}
class Vidzi extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VidziScript];
    }
}
exports.default = Vidzi;


/***/ }),

/***/ 85:
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
const redirect_scripts_base_1 = __webpack_require__(56);
const Tools = __webpack_require__(19);
class VivoScript extends redirect_scripts_base_1.RedirectScript {
    constructor(hostname, url) {
        super(hostname, url, /https?:\/\/(www\.)?vivo\.[^\/,^\.]{2,}\/.+/i);
    }
    getVideoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let xhr = yield Tools.createRequest({ url: this.details.url, hideRef: true });
            let HTML = xhr.response;
            this.checkForSubtitles(HTML);
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
}
class Vivo extends redirect_scripts_base_1.RedirectHost {
    getScripts() {
        return [VivoScript];
    }
}
exports.default = Vivo;


/***/ })

/******/ });
//# sourceMappingURL=bg_script.js.map