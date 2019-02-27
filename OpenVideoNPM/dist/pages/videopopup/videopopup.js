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
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
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
const Messages = __webpack_require__(2);
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
})(sync = exports.sync || (exports.sync = {}));


/***/ }),
/* 2 */
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
    return getErrorData(convertToError(e));
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
/* 4 */
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
const Tools = __webpack_require__(3);
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(5);
const Storage = __webpack_require__(1);
function getCID() {
    return __awaiter(this, void 0, void 0, function* () {
        let cid = yield Storage.sync.get("AnalyticsCID");
        if (!cid) {
            cid = Tools.generateHash();
            Storage.sync.set("AnalyticsCID", cid);
        }
        return cid;
    });
}
exports.getCID = getCID;
function postData(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let isEnabled = yield Storage.sync.get("AnalyticsEnabled");
        if (isEnabled || isEnabled == undefined) {
            let cid = yield getCID();
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
exports.fireEvent = fireEvent;


/***/ }),
/* 5 */
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
function getPatreonUrl() {
    return "https://www.patreon.com/join/openvideo?";
}
exports.getPatreonUrl = getPatreonUrl;
function getHostSuggestionUrl() {
    return "https://youtu.be/rbeUGOkKt0o";
}
exports.getHostSuggestionUrl = getHostSuggestionUrl;
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
/* 6 */
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
function injectRawScript(func) {
    return __awaiter(this, void 0, void 0, function* () {
        yield isReady();
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.innerHTML = "(" + func + ")();";
            script.async = true;
            script.onload = function () {
                script.onload = null;
                resolve(script);
            };
            (document.body || document.head).appendChild(script);
        });
    });
}
exports.injectRawScript = injectRawScript;
;
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(5);
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
function setup() {
    Messages.setupBackground({
        background_toTopWindow: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!sender.tab || !sender.tab.id) {
                    throw new Error("Can't send to top window. Tab id is unknown!");
                }
                var tabid = sender.tab.id;
                return Messages.sendToTab(tabid, msg, bgdata);
            });
        },
        background_toActiveTab: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                chrome.tabs.query({ active: true }, function (tabs) {
                    if (!tabs[0].id) {
                        throw Error("No active tab found!");
                    }
                    return Messages.sendToTab(tabs[0].id, msg, bgdata);
                });
            });
        },
        background_toTab: function (msg, bgdata, sender) {
            return __awaiter(this, void 0, void 0, function* () {
                chrome.tabs.query(bgdata, function (tabs) {
                    if (!tabs[0].id) {
                        throw Error("No active tab found!");
                    }
                    chrome.tabs.sendMessage(tabs[0].id, msg, function (resData) {
                        if (resData.error) {
                            throw resData.error;
                        }
                        else {
                            return resData.data;
                        }
                    });
                });
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
/* 9 */,
/* 10 */,
/* 11 */
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
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
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
const Tools = __webpack_require__(3);
const Analytics = __webpack_require__(4);
const Environment = __webpack_require__(5);
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
                if (isInitialized() && getPlayer().currentType().match(/application\//i) && /\.(ts|m3u8)$/.test(url)) {
                    arguments[1] = Tools.addRefererToURL(url, Page.getUrlObj().origin);
                }
                target.open.apply(target, arguments);
            };
        }
    }
});
let player = null;
function getPlayer() {
    if (player == null) {
        throw Error("Player not initialized!");
    }
    return player;
}
exports.getPlayer = getPlayer;
function isInitialized() {
    return player != null;
}
exports.isInitialized = isInitialized;
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
    player.appendTextTrack = function (rawTrack) {
        return __awaiter(this, void 0, void 0, function* () {
            function convertToTrack(srcContent) {
                if (srcContent.indexOf("-->") !== -1) {
                    player.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
                    let track = player.textTracks()[player.textTracks().length - 1];
                    if (rawTrack.default) {
                        track.mode = "showing";
                    }
                    OVPlayerComponents.parseSrt(srcContent, function (cue) {
                        track.addCue(cue);
                    });
                }
                else {
                    throw Error("Invaid subtitle file");
                }
            }
            try {
                let xhr = yield Tools.createRequest({ url: rawTrack.src });
                convertToTrack(xhr.responseText);
            }
            catch (e) {
                let xhr = yield Tools.createRequest({ url: Tools.removeRefererFromURL(rawTrack.src) });
                convertToTrack(xhr.responseText);
            }
        });
    };
    player.getActiveVideoSource = function () {
        for (var src of videoData.src) {
            if (player.src().indexOf(src.src) == 0) {
                return src;
            }
        }
        throw new Error("No video source active!");
    };
    player.on("ready", function () {
        return __awaiter(this, void 0, void 0, function* () {
            player.el().style.width = "100%";
            player.el().style.height = "100%";
            let ControlBar = player.getChild('controlBar');
            if (!ControlBar) {
                throw new Error("Control bar is missing!");
            }
            var FavButton = ControlBar.addChild('FavButton', {});
            var DownloadButton = ControlBar.addChild('DownloadButton', {});
            var PatreonButton = ControlBar.addChild('PatreonButton', {});
            var FullscreenToggle = ControlBar.getChild('fullscreenToggle');
            var CaptionsButton = ControlBar.getChild('SubsCapsButton');
            CaptionsButton.show();
            console.log("player is ready");
            player.on("ratechange", function () {
                Analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
            });
            FullscreenToggle.on("click", function () {
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
            let volume = yield Storage.sync.get("PlayerVolume");
            if (volume) {
                player.volume(volume);
            }
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
            player.appendTextTrack(track);
            //player.addRemoteTextTrack(<any>track, true);
        }
    };
    player.getVideoData = function () {
        return videoData;
    };
    player.setVideoData(videoData);
    //player.aspectRatio("0:0");
    player.saveToHistory = function () {
        return __awaiter(this, void 0, void 0, function* () {
            let isDisabled = yield Storage.sync.get("disableHistory");
            if (!isDisabled) {
                let history = yield Storage.local.get("OpenVideoHistory");
                if (!history) {
                    history = [];
                }
                var itemIndex = history.findIndex(function (arrElem) {
                    return arrElem.origin == videoData.origin;
                });
                if (itemIndex != -1) {
                    history.splice(itemIndex, 1);
                }
                var histHash = {
                    poster: videoData.poster,
                    title: videoData.title,
                    origin: videoData.origin,
                    stoppedTime: player.currentTime() == player.duration() ? 0 : player.currentTime()
                };
                //player.getVideoFileHash(function(fileHash){
                //HistHash.fileHash = fileHash;
                history.unshift(histHash);
                Storage.local.set("OpenVideoHistory", history);
                //});
            }
        });
    };
    player.loadFromHistory = function () {
        return __awaiter(this, void 0, void 0, function* () {
            let history = yield Storage.local.get("OpenVideoHistory");
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(3);
const Analytics = __webpack_require__(4);
const Storage = __webpack_require__(1);
const TheatreMode = __webpack_require__(18);
const Background = __webpack_require__(8);
const Environment = __webpack_require__(5);
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
                startTime: 0,
                endTime: 0,
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
            this.setFavorite(!this.isFavorite());
        },
        isFavorite: function () {
            return !!this.isFavorite_;
        },
        setFavorite: function (value, dontSet) {
            return __awaiter(this, void 0, void 0, function* () {
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
                    let favorites = yield Storage.local.get("OpenVideoFavorites");
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
                    yield Storage.local.set("OpenVideoFavorites", favorites);
                }
            });
        },
        updateDesign: function () {
            return __awaiter(this, void 0, void 0, function* () {
                var _this = this;
                let favorites = yield Storage.local.get("OpenVideoFavorites");
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
            Background.openTab(Environment.getPatreonUrl());
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
                        parseSrt(result, function (cue) {
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
            return __awaiter(this, void 0, void 0, function* () {
                let player = this.player_;
                let response = yield Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" });
                if (!response.aborted) {
                    let fn = yield Tools.getUrlFileName(response.text);
                    player.appendTextTrack({ kind: "captions", label: fn, language: "AddedFromUser", src: response.text });
                }
            });
        }
    });
    function override(obj, method, createOverride) {
        let name = method.name;
        obj.prototype[name] = createOverride(obj.prototype[name]);
    }
    let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    override(resolutionMenuItem, resolutionMenuItem.prototype.createEl, function (method) {
        return function (tagName, properties, attributes) {
            let el = method.call(this, tagName, properties, attributes);
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
    });
    let subsCapsMenuItem = videojs.getComponent("SubsCapsMenuItem");
    override(subsCapsMenuItem, subsCapsMenuItem.prototype.createEl, function (method) {
        return function (tagName, properties, attributes) {
            let btn = this;
            let track = btn.options_.track;
            let el = method.call(this, tagName, properties, attributes);
            if (track.language != "AddedFromUser") {
                let videoData = btn.player_.getVideoData();
                let rawTrack = videoData.tracks.find(function (rawtrack) {
                    return track.label == rawtrack.label;
                });
                if (rawTrack) {
                    el.appendChild(createDownloadButton(rawTrack.src, "[" + rawTrack.label + "]" + videoData.title + ".vtt", "text/vtt"));
                }
            }
            return el;
        };
    });
    let subsCapsButton = videojs.getComponent("SubsCapsButton");
    override(subsCapsButton, subsCapsButton.prototype.createItems, function (method) {
        return function () {
            let items = method.call(this);
            items.splice(2, 0, new (videojs.getComponent("AddTracksFromFile"))(this.player_, {}));
            items.splice(3, 0, new (videojs.getComponent("AddTracksFromURL"))(this.player_, {}));
            return items;
        };
    });
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

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    if (!iframe.parentNode) {
        throw Error("IFrame is not part of the page!");
    }
    iframe.parentNode.appendChild(shadow);
    iframes.push({ shadow: shadow, iframe: iframe, observer: observer });
    return iframes[iframes.length - 1];
}
exports.registerIFrame = registerIFrame;
function nameIFrames() {
    return __awaiter(this, void 0, void 0, function* () {
        function nameIFrame(iframe) {
            function checkBounds(iframe) {
                if (iframe.offsetLeft < 0 || iframe.offsetTop < 0) {
                    return false;
                }
                else if ((iframe.offsetWidth / window.innerWidth) * 100 < 30 || (iframe.offsetHeight / window.innerHeight) * 100 < 30) {
                    return false;
                }
                else {
                    return true;
                }
            }
            if (!iframe.hasAttribute("name") && (checkBounds(iframe) || (iframe.hasAttribute("allow") && iframe.getAttribute("allow").indexOf("fullscreen") != -1))) {
                console.log(iframe);
                iframe.name = Tools.generateHash();
                if (iframe.width) {
                    iframe.style.width = iframe.width + (iframe.width.indexOf("%") == -1 ? "px" : "");
                    iframe.removeAttribute("width");
                }
                if (iframe.height) {
                    iframe.style.height = iframe.height + (iframe.height.indexOf("%") == -1 ? "px" : "");
                    iframe.removeAttribute("height");
                }
                if (iframe.hasAttribute("allow")) {
                    iframe.setAttribute("allow", iframe.getAttribute("allow").replace(/fullscreen[^;]*;?/i, "fullscreen *;")); //fullscreen *;
                }
                iframe.allowFullscreen = true;
                let sibling = iframe.nextElementSibling;
                let parent = iframe.parentElement;
                if (!parent) {
                    throw Error("IFrame is not part of the page!");
                }
                iframe.remove();
                parent.insertBefore(iframe, sibling);
            }
        }
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
        yield Page.isReady();
        for (let iframe of document.getElementsByTagName("iframe")) {
            nameIFrame(iframe);
        }
    });
}
exports.nameIFrames = nameIFrames;
function activateEntry(entry) {
    return __awaiter(this, void 0, void 0, function* () {
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
            let frameWidth = yield Storage.sync.get("TheatreModeFrameWidth");
            setWrapperStyle(entry, frameWidth || 70);
            entry.shadow.style.opacity = "1";
            entry.shadow.style.pointerEvents = "all";
        }
    });
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
    Background.toTopWindow({ data: { enabled: enabled, frameID: window.name }, func: "theatremode_setTheatreMode" });
}
exports.setTheatreMode = setTheatreMode;
function setupIframe() {
    Background.toTopWindow({ data: { frameID: window.name, url: location.href }, func: "theatremode_setupIframe" });
}
exports.setupIframe = setupIframe;
function setup() {
    nameIFrames();
    Messages.addListener({
        theatremode_setTheatreMode: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                var data = request.data;
                if (data.enabled) {
                    var entry = getEntry(data.frameID);
                    if (!entry) {
                        throw new Error("No IFrame with id '" + data.frameID + "' found!");
                    }
                    activateEntry(entry);
                }
                else {
                    deactivateEntry();
                }
            });
        },
        theatremode_setupIframe: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                let data = request.data;
                var entry = getEntry(data.frameID);
                if (!entry) {
                    let iframe = getIFrameByID(data.frameID);
                    //iframe.src = data.url;
                    entry = registerIFrame(iframe);
                }
            });
        }
    });
}
exports.setup = setup;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Page = __webpack_require__(6);
const Languages = __webpack_require__(7);
const VideoPopup = __webpack_require__(20);
const OVPlayer = __webpack_require__(16);
const Background = __webpack_require__(8);
class VideoPlaylist {
    constructor(popupData) {
        this.currentVideo_ = 0;
        this.popupData_ = null;
        this.popupData = popupData;
        this.loadVideo(0);
    }
    get popupData() {
        return this.popupData_;
    }
    set popupData(popupData) {
        this.popupData_ = popupData;
        this.update();
    }
    loadVideo(index) {
        if (index >= this.popupData.videos.length) {
            index = this.popupData.videos.length - 1;
        }
        else if (index < 0) {
            index = 0;
        }
        this.currentVideo_ = index;
        if (this.popupData.videos.length == 0) {
            this.currentVideo_ = -1;
        }
        else {
            if (!OVPlayer.isInitialized()) {
                OVPlayer.initPlayer('openVideo', { autoplay: this.popupData.autoplay }, this.popupData.videos[index]);
                let this_ = this;
                OVPlayer.getPlayer().on("error", function () {
                    if (OVPlayer.getPlayer().currentTime() == 0) {
                        this_.removeVideo(this_.currentVideo_);
                    }
                });
                OVPlayer.getPlayer().el().style.paddingTop = "unset";
            }
            else {
                OVPlayer.getPlayer().autoplay(!!this.popupData.autoplay);
                OVPlayer.getPlayer().setVideoData(this.popupData.videos[index]);
            }
        }
        this.update();
    }
    removeVideo(index) {
        this.popupData.videos.splice(index, 1);
        console.log("video deleted!");
        if (this.popupData.videos[index]) {
            OVPlayer.getPlayer().setVideoData(this.popupData.videos[index]);
        }
        this.loadVideo(index);
    }
    update() {
        Background.setIconText((this.popupData.videos.length || "").toString());
        if (this.popupData.videos.length == 0) {
            Background.setIconPopup("pages/popupmenu/popupmenu.html");
        }
        else {
            Background.setIconPopup();
        }
        document.getElementById("currentVideo").innerText = Languages.getMsg("video_popup_video_bar_lbl", { "curr_vid": (this.currentVideo_ + 1).toString(), "vid_count": this.popupData.videos.length.toString() });
    }
    nextVideo() {
        this.loadVideo(++this.currentVideo_);
        OVPlayer.getPlayer().play();
    }
    prevVideo() {
        this.loadVideo(--this.currentVideo_);
        OVPlayer.getPlayer().play();
    }
}
Page.isReady().then(function () {
    document.getElementById("title").innerText = Languages.getMsg("video_popup_msg_lbl");
    document.getElementById("js_err_msg").innerText = Languages.getMsg("video_player_js_err_msg");
    let playlist = new VideoPlaylist(Page.getUrlObj());
    document.getElementById("prevVideo").onclick = function () {
        playlist.prevVideo();
    };
    document.getElementById("nextVideo").onclick = function () {
        playlist.nextVideo();
    };
    document.getElementById("close").onclick = function () {
        OVPlayer.getPlayer().pause();
        VideoPopup.closePopup();
    };
});


/***/ }),
/* 20 */
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
const VideoTypes = __webpack_require__(11);
const Tools = __webpack_require__(3);
const Messages = __webpack_require__(2);
const Environment = __webpack_require__(5);
const Page = __webpack_require__(6);
const Background = __webpack_require__(8);
let videoArr = [];
let newVideos = 0;
function getPopupFrame() {
    let frame = document.getElementById("videoPopup");
    if (frame == undefined) {
        frame = document.createElement("iframe");
        frame.id = "videoPopup";
        frame.allowFullscreen = true;
        frame.className = "ov-popupFrame";
        document.body.appendChild(frame);
    }
    return frame;
}
function _isPopupVisible() {
    return isPopupCreated() && !getPopupFrame().hidden;
}
function isPopupCreated() {
    return document.getElementById("videoPopup") != undefined;
}
function _addVideoToPopup(videoData) {
    let src = videoData.src;
    let videoListEntry = videoArr.find(function (arrElem) {
        return arrElem.src[0].src == src[0].src;
    });
    if (videoListEntry == null) {
        videoArr.push(Tools.merge(videoData, {
            title: document.title,
            origin: location.href,
            host: "Popup"
        }));
        newVideos++;
        if (!isPopupCreated()) {
            getPopupFrame().hidden = true;
            getPopupFrame().style.setProperty("display", "none", "important");
        }
        getPopupFrame().src = Environment.getVidPopupSiteUrl({
            videos: videoArr,
            options: { autoplay: _isPopupVisible() }
        });
    }
}
function setupCS() {
    Messages.addListener({
        videopopup_pauseAllVideos: function () {
            return __awaiter(this, void 0, void 0, function* () {
                for (let video of document.getElementsByTagName("video")) {
                    video.pause();
                }
                ;
            });
        }
    });
}
exports.setupCS = setupCS;
function pauseAllVideos() {
    return __awaiter(this, void 0, void 0, function* () {
        return Background.toTopWindow({ data: null, func: "videopopup_pauseAllVideos", frameId: -1 });
    });
}
exports.pauseAllVideos = pauseAllVideos;
var firstpopup = true;
function isPopupVisible() {
    return __awaiter(this, void 0, void 0, function* () {
        if (Page.isFrame()) {
            let response = yield Background.toTopWindow({ data: {}, func: "videopopup_isPopupVisible" });
            return response.data.visible;
        }
        else {
            return _isPopupVisible();
        }
    });
}
exports.isPopupVisible = isPopupVisible;
function openPopup() {
    Background.toTopWindow({ data: {}, func: "videopopup_openPopup" });
}
exports.openPopup = openPopup;
function closePopup() {
    Background.toTopWindow({ data: {}, func: "videopopup_closePopup" });
}
exports.closePopup = closePopup;
function addVideoToPopup(videoData) {
    console.log(videoData);
    Background.toTopWindow({ data: { videoData: VideoTypes.makeURLsSave(videoData) }, func: "videopopup_addVideoToPopup" });
}
exports.addVideoToPopup = addVideoToPopup;
function setup() {
    Messages.addListener({
        videopopup_isPopupVisible: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                return { visible: _isPopupVisible() };
            });
        },
        videopopup_openPopup: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                getPopupFrame().hidden = false;
                getPopupFrame().style.removeProperty("display");
                if (firstpopup) {
                    getPopupFrame().src = getPopupFrame().src;
                    firstpopup = false;
                }
                pauseAllVideos();
            });
        },
        videopopup_closePopup: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isPopupCreated()) {
                    throw Error("Can't close popop. Popup doesn't exist!");
                }
                getPopupFrame().hidden = true;
                getPopupFrame().style.setProperty("display", "none", "important");
                Background.setIconPopup();
            });
        },
        videopopup_addVideoToPopup: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                _addVideoToPopup(request.data.videoData);
            });
        }
    });
}
exports.setup = setup;


/***/ })
/******/ ]);
//# sourceMappingURL=videopopup.js.map