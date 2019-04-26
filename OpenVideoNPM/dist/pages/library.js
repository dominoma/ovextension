/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,1]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(1);
const React = __webpack_require__(6);
const ReactDOM = __webpack_require__(11);
const Storage = __webpack_require__(18);
const Page = __webpack_require__(21);
const Messages = __webpack_require__(19);
const TheatreMode = __webpack_require__(22);
const VideoHistory = __webpack_require__(25);
const header_1 = __webpack_require__(26);
const navigation_1 = __webpack_require__(40);
const searchbody_1 = __webpack_require__(31);
const videobody_1 = __webpack_require__(47);
const prompts_1 = __webpack_require__(51);
class CCLinks extends React.Component {
    render() {
        return (React.createElement("div", { className: "ov-lib-cc-links" },
            "Icons made by",
            React.createElement("a", { href: "https://www.flaticon.com/authors/google", title: "Google" }, "Google"),
            React.createElement("a", { href: "https://www.flaticon.com/authors/egor-rumyantsev", title: "Egor Rumyantsev" }, "Egor Rumyantsev"),
            React.createElement("a", { href: "https://www.flaticon.com/authors/stephen-hutchings", title: "Stephen Hutchings" }, "Stephen Hutchings"),
            React.createElement("a", { href: "https://www.flaticon.com/authors/picol", title: "Picol" }, "Picol"),
            React.createElement("a", { href: "https://www.flaticon.com/authors/yannick", title: "Yannick" }, "Yannick"),
            React.createElement("a", { href: "https://www.flaticon.com/authors/egor-rumyantsev", title: "Egor Rumyantsev" }, "Egor Rumyantsev"),
            React.createElement("a", { href: "https://www.flaticon.com/authors/bogdan-rosu", title: "Bogdan Rosu" }, "Bogdan Rosu"),
            React.createElement("a", { href: "https://www.freepik.com/", title: "Freepik" }, "Freepik")));
    }
}
class Library extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: this.props.nav || navigation_1.fixedButtons.search,
            search: this.props.search,
            activePrompt: null
        };
    }
    componentDidUpdate(oldprops) {
        if (oldprops.nav != this.props.nav || oldprops.search != this.props.search) {
            this.setState({ nav: this.props.nav || navigation_1.fixedButtons.search, search: this.props.search });
        }
    }
    render() {
        let body = null;
        document.title = this.state.nav.name + " - OV-Library";
        if (this.state.nav.id == navigation_1.fixedButtons.search.id) {
            body = (React.createElement(searchbody_1.SearchBody, { search: this.state.search }));
        }
        else {
            body = (React.createElement(videobody_1.VideoList, { playlist: this.state.nav.id, filter: this.state.search == null ? null : new RegExp(this.state.search, "i"), onVideoRemoved: () => { } }));
        }
        return (React.createElement("div", { className: "ov-lib" },
            React.createElement(prompts_1.LibraryPromptManager, null),
            React.createElement(header_1.Header, { search: this.state.search, title: this.state.nav.name, onSearch: this.videosSearched.bind(this), canSearch: this.state.nav.id != navigation_1.fixedButtons.search.id }),
            React.createElement(navigation_1.Navigation, { selected: this.state.nav, onSelected: this.navSelected.bind(this) }),
            body,
            React.createElement(CCLinks, null)));
    }
    navSelected(btn) {
        this.setState({ nav: btn });
        window.history.pushState(null, "", Page.getObjUrl({
            nav: btn,
            search: this.state.search
        }));
    }
    videosSearched(search) {
        this.setState({ search: search });
        window.history.pushState(null, "", Page.getObjUrl({
            nav: this.state.nav,
            search: search
        }));
    }
}
window["setPlaylists"] = Storage.setPlaylists;
window["setPlaylistByID"] = Storage.setPlaylistByID;
let hash = Page.getUrlObj() || { nav: null, search: null };
ReactDOM.render(React.createElement(Library, { nav: hash.nav, search: hash.search }), document.body);
Messages.setupMiddleware();
TheatreMode.setup();
VideoHistory.setup();
window["setupVidHist"] = VideoHistory.setup;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(2);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Module
exports.push([module.i, ".ov-lib {\n  height: 100%;\n  display: grid;\n  grid: \"head head\" 5em\r \"nav body\" 1fr\r /20em  1fr;\n  min-height: 0;\n  min-width: 0; }\n  .ov-lib .ov-lib-cc-links {\n    position: absolute;\n    bottom: 0;\n    right: 0;\n    color: #ccc; }\n    .ov-lib .ov-lib-cc-links a {\n      margin: 0 0.25em;\n      text-decoration: none;\n      color: #ccc; }\n\nbody {\n  height: 100vh;\n  overflow: hidden;\n  font-family: \"Open Sans\", sans-serif;\n  margin: 0; }\n", ""]);



/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
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
const Messages = __webpack_require__(19);
const Tools = __webpack_require__(20);
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
function getPlaylistByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id == exports.fixed_playlists.history.id) {
            return (yield local.get("library_playlist_" + id)) || [];
        }
        return (yield sync.get("library_playlist_" + id)) || [];
    });
}
exports.getPlaylistByID = getPlaylistByID;
function setPlaylistByID(id, playlist) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id == exports.fixed_playlists.history.id) {
            return local.set("library_playlist_" + id, playlist);
        }
        return sync.set("library_playlist_" + id, playlist);
    });
}
exports.setPlaylistByID = setPlaylistByID;
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
/* 19 */
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
const Tools = __webpack_require__(20);
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
/* 21 */
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
const Tools = __webpack_require__(20);
const Messages = __webpack_require__(19);
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
function injectRawScript(func, head) {
    return __awaiter(this, void 0, void 0, function* () {
        yield isReady();
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
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
/* 22 */
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
const Messages = __webpack_require__(19);
const Storage = __webpack_require__(18);
const Page = __webpack_require__(21);
const Background = __webpack_require__(23);
let iframes = [];
let activeEntry = null;
function checkCleanup(entry) {
    if (entry == null) {
        return false;
    }
    else if (!entry.iframe || !entry.iframe.parentElement) {
        //entry.observer.disconnect();
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
function checkIFrameBounds(iframe, width, height) {
    return Math.abs(iframe.clientWidth - width) <= 1 && Math.abs(iframe.clientHeight - height) <= 1;
}
function getEntry(width, height) {
    for (let i = 0; i < iframes.length; i++) {
        if (checkCleanup(iframes[i])) {
            iframes.splice(i, 1);
            i--;
        }
        else if (checkIFrameBounds(iframes[i].iframe, width, height)) {
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
    iframes.push({ shadow: shadow, iframe: iframe });
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
            if (iframe.hasAttribute("allow") && iframe.getAttribute("allow").indexOf("fullscreen") != -1) {
                if (iframe.hasAttribute("allow")) {
                    iframe.setAttribute("allow", iframe.getAttribute("allow").replace(/fullscreen[^;]*;?/i, "fullscreen *;")); //fullscreen *;
                }
            }
        }
        Page.onNodeInserted(document, function (target) {
            if (target instanceof HTMLElement) {
                let iframes = target.getElementsByTagName("iframe");
                if (target instanceof HTMLIFrameElement) {
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
            activeEntry = {
                oldStyle: {
                    css: entry.iframe.style.cssText,
                    width: entry.iframe.width,
                    height: entry.iframe.height
                },
                entry: entry
            };
            let frameWidth = yield Storage.getTheatreFrameWidth();
            setWrapperStyle(entry, frameWidth);
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
    Storage.setTheatreFrameWidth(newrelwidth);
    entry.entry.shadow.style.opacity = "0";
    entry.entry.shadow.style.removeProperty("pointer-events");
    window.setTimeout(function () {
        entry.entry.iframe.style.cssText = entry.oldStyle.css;
        entry.entry.iframe.width = entry.oldStyle.width;
        entry.entry.iframe.height = entry.oldStyle.height;
        document.body.style.removeProperty("overflow");
    }, 150);
}
exports.deactivateEntry = deactivateEntry;
function setWrapperStyle(entry, width) {
    width = width > 100 ? 100 : width;
    width = width < 50 ? 50 : width;
    entry.iframe.removeAttribute("width");
    entry.iframe.removeAttribute("height");
    entry.iframe.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        margin: auto !important;
        width: ` + width + `vw !important;
        height: calc(` + width + `vw*9/16) !important;
        padding-right:5px !important;
        padding-bottom:5px !important;
        display:block !important;
        overflow: hidden !important;
        resize: both !important;
        z-index: 99999999999 !important;
        border: 0px !important;
        max-width:100vw !important;
        min-width: 50vw !important;
        max-height: 100vh !important;
        min-height: 50vh !important;
    `;
    //entry.iframe.style.cssText = "padding-right:5px;padding-bottom:5px;display:block;overflow: hidden; resize: both;position: fixed !important;width: " + width + "vw !important;height: calc(( 9/ 16)*" + width + "vw) !important;top: calc((100vh - ( 9/ 16)*" + width + "vw)/2) !important;left: calc((100vw - " + width + "vw)/2) !important;z-index:2147483647 !important; border: 0px !important; max-width:100vw !important; min-width: 50vw !important; max-height: 100vh !important; min-height: 50vh !important";
}
function getIFrameByID(width, height) {
    //let iframe = document.getElementsByName(frameid)[0] as HTMLIFrameElement;
    let iframe = null;
    for (let frame of document.getElementsByTagName("iframe")) {
        if (checkIFrameBounds(frame, width, height)) {
            iframe = frame;
            break;
        }
    }
    if (iframe) {
        return iframe;
    }
    else {
        throw Error("Could not find iframe with!");
    }
}
function setTheatreMode(enabled) {
    Background.toTopWindow({
        data: {
            enabled: enabled,
            width: window.innerWidth,
            height: window.innerHeight
            /*frameID: window.name*/
        },
        func: "theatremode_setTheatreMode"
    });
}
exports.setTheatreMode = setTheatreMode;
function setupIframe() {
    Background.toTopWindow({
        data: {
            width: window.innerWidth,
            height: window.innerHeight,
            /*frameID: window.name*/
            url: location.href
        },
        func: "theatremode_setupIframe"
    });
}
exports.setupIframe = setupIframe;
function setup() {
    nameIFrames();
    Messages.addListener({
        theatremode_setTheatreMode: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                var data = request.data;
                if (data.enabled) {
                    var entry = getEntry(data.width, data.height);
                    if (!entry) {
                        throw new Error("No IFrame with found!");
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
                var entry = getEntry(data.width, data.height);
                if (!entry) {
                    let iframe = getIFrameByID(data.width, data.height);
                    //iframe.src = data.url;
                    entry = registerIFrame(iframe);
                }
            });
        }
    });
}
exports.setup = setup;


/***/ }),
/* 23 */
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
const Messages = __webpack_require__(19);
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tools = __webpack_require__(20);
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
/* 25 */
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
const Page = __webpack_require__(21);
const Messages = __webpack_require__(19);
const Background = __webpack_require__(23);
const Storage = __webpack_require__(18);
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
            yield Storage.setPlaylistByID(Storage.fixed_playlists.favorites.id, newfav);
            yield Storage.local.set("OpenVideoFavorites", null);
        }
        if (oldhist) {
            let newhist = oldhist.map(mapping);
            yield Storage.setPlaylistByID(Storage.fixed_playlists.history.id, newhist);
            yield Storage.local.set("OpenVideoHistory", null);
        }
    });
}
exports.convertOldPlaylists = convertOldPlaylists;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(27);
const React = __webpack_require__(6);
const searchbody_1 = __webpack_require__(31);
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { search: this.props.search };
    }
    render() {
        let searchInput = this.props.canSearch ?
            React.createElement(searchbody_1.SearchInput, { onSearch: this.inputSearch.bind(this), placeholder: "Search in " + this.props.title, search: this.state.search })
            : null;
        return (React.createElement("div", { className: "ov-lib-head" },
            React.createElement("div", { className: "ov-lib-head-icon" }),
            React.createElement("div", { className: "ov-lib-head-icon-text" }, "OpenVideo"),
            React.createElement("div", { className: "ov-lib-head-title" }, this.props.title),
            searchInput));
    }
    inputSearch(input) {
        this.setState({ search: input });
        this.props.onSearch(input);
    }
}
exports.Header = Header;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(28);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Imports
var urlEscape = __webpack_require__(29);
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(30));

// Module
exports.push([module.i, ".ov-lib-head {\n  display: flex;\n  background-color: #8dc73f;\n  grid-area: head; }\n  .ov-lib-head .ov-lib-head-icon {\n    margin: auto 1em;\n    background-image: url(" + ___CSS_LOADER_URL___0___ + ");\n    background-repeat: no-repeat;\n    background-size: contain;\n    width: 4em;\n    height: 4em; }\n  .ov-lib-head .ov-lib-head-icon-text {\n    margin: auto 0em;\n    font-size: 2em;\n    cursor: default;\n    color: white;\n    user-select: none; }\n  .ov-lib-head .ov-lib-head-title {\n    margin: auto;\n    font-size: 2em;\n    cursor: default;\n    color: white;\n    user-select: none; }\n  .ov-lib-head .ov-lib-search-input {\n    margin: auto 1em;\n    width: 20em; }\n", ""]);



/***/ }),
/* 29 */,
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/9d1c349992b139988b754033a58af680.png";

/***/ }),
/* 31 */
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
__webpack_require__(32);
const React = __webpack_require__(6);
const Storage = __webpack_require__(18);
const Tools = __webpack_require__(20);
const AddSiteIcon = __webpack_require__(35);
const AllSitesIcon = __webpack_require__(36);
const prompt_1 = __webpack_require__(37);
console.log(AddSiteIcon, AllSitesIcon);
class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: this.props.search || ""
        };
    }
    render() {
        return (React.createElement("div", { className: "ov-lib-search-input" },
            React.createElement("input", { type: "text", placeholder: this.props.placeholder, onChange: this.inputChange.bind(this), onKeyDown: this.inputKeyDown.bind(this), value: this.state.search }),
            React.createElement("div", { className: "ov-lib-search-input-btn", onClick: this.searchBtnClick.bind(this) })));
    }
    inputKeyDown(ev) {
        if (ev.keyCode == 13) {
            this.props.onSearch(this.state.search);
            return false;
        }
        else {
            return true;
        }
    }
    inputChange(ev) {
        this.setState({ search: ev.target.value });
        if (this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    }
    searchBtnClick() {
        this.props.onSearch(this.state.search);
    }
}
exports.SearchInput = SearchInput;
class SearchBtn extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let className = "ov-lib-search-btn";
        if (this.props.selected) {
            className += " ov-lib-search-btn-selected";
        }
        return (React.createElement("div", { onClick: this.searchBtnClicked.bind(this), className: className },
            React.createElement("div", { className: "ov-lib-search-btn-bg" },
                React.createElement("div", { className: "ov-lib-search-btn-img", style: {
                        backgroundImage: "url('" + this.props.data.icon + "')"
                    } })),
            React.createElement("div", { className: "ov-lib-search-btn-text" }, this.props.data.name)));
    }
    searchBtnClicked() {
        this.props.onSelected(this.props.data, !this.props.selected);
    }
}
exports.SearchBtn = SearchBtn;
class SearchBtns extends React.Component {
    static resolveBtnData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullURL = (data.url.indexOf("://") == -1 ? "https://" : "") + data.url;
            let xhr = yield Tools.createRequest({ url: fullURL });
            let matches = xhr.response.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
            if (matches) {
                let favicon = matches[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
                if (favicon) {
                    let favurl = favicon[1];
                    if (!favurl.match(/https?:/)) {
                        favurl = fullURL + favurl;
                    }
                    return { name: data.name, url: fullURL, icon: favurl };
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
    constructor(props) {
        super(props);
        this.state = { sites: [], selected: [] };
    }
    componentDidMount() {
        Storage.getSearchSites().then((sites) => {
            this.setState({
                sites: sites
            });
            this.props.onChange(sites);
        });
    }
    render() {
        let buttons = this.state.sites.map((el) => {
            return (React.createElement(SearchBtn, { data: el, selected: this.state.selected.some((selel) => {
                    return el.url == selel.url;
                }), onSelected: this.searchBtnSelected.bind(this), key: el.url }));
        });
        return (React.createElement("div", { className: "ov-lib-search-btn-list" },
            React.createElement(SearchBtn, { data: exports.allSitesSearchBtnData, selected: this.state.selected.length == 0, onSelected: this.allSitesSelected.bind(this), key: exports.allSitesSearchBtnData.url }),
            buttons,
            React.createElement(SearchBtn, { data: exports.addSiteSearchBtnData, selected: false, onSelected: this.siteAddRequest.bind(this), key: exports.addSiteSearchBtnData.url })));
    }
    searchBtnSelected(data, selected) {
        let newSites = this.state.selected.concat();
        if (selected) {
            newSites.push(data);
            this.setState({ selected: newSites });
        }
        else {
            let index = this.state.selected.findIndex((el) => {
                return el.url == data.url;
            });
            if (index != -1) {
                newSites.splice(index, 1);
            }
            this.setState({ selected: newSites });
        }
        this.props.onChange(newSites);
    }
    siteAddRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            let state = yield prompt_1.PromptManager.openPrompt("addSearchSitePrompt");
            let data = yield SearchBtns.resolveBtnData(state);
            console.log(data);
            if (data) {
                let sites = this.state.sites.concat();
                sites.push(data);
                Storage.setSearchSites(sites);
                this.setState({ sites: sites });
            }
        });
    }
    allSitesSelected() {
        this.setState({ selected: [] });
        this.props.onChange(this.state.sites);
    }
}
exports.SearchBtns = SearchBtns;
class ResultLink extends React.Component {
    render() {
        return (React.createElement("a", { className: "ov-library-search-result", href: this.props.data.url },
            React.createElement("div", { className: "ov-library-search-result-icon", style: { backgroundImage: "url('" + this.props.data.icon + "')" } }),
            React.createElement("div", { className: "ov-library-search-result-title" }, this.props.data.title),
            React.createElement("div", { className: "ov-library-search-result-description", dangerouslySetInnerHTML: { __html: this.props.data.description } })));
    }
}
class ResultLinks extends React.Component {
    render() {
        let results = this.props.data.map((el) => {
            return React.createElement(ResultLink, { key: el.url, data: el });
        });
        return (React.createElement("div", { className: "ov-library-search-results" }, results));
    }
}
exports.allSitesSearchBtnData = {
    icon: AllSitesIcon,
    url: "allSites",
    name: "All Sites"
};
exports.addSiteSearchBtnData = {
    icon: AddSiteIcon,
    url: "addSite",
    name: "Add Site"
};
class SearchBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: [], searchresult: null };
    }
    render() {
        if (this.state.searchresult) {
            return (React.createElement("div", { className: "ov-lib-search-result-body" },
                React.createElement(SearchInput, { onSearch: this.inputSearched.bind(this) }),
                React.createElement(ResultLinks, { data: this.state.searchresult })));
        }
        else {
            return (React.createElement("div", { className: "ov-lib-search" },
                React.createElement(SearchInput, { onSearch: this.inputSearched.bind(this) }),
                React.createElement(SearchBtns, { onChange: this.searchBtnsChange.bind(this) })));
        }
    }
    searchBtnsChange(data) {
        this.setState({ selected: data });
    }
    inputSearched(search) {
        return __awaiter(this, void 0, void 0, function* () {
            let extractResults = (htmlstr) => {
                let html = (new DOMParser()).parseFromString(htmlstr, "text/html");
                let results = html.querySelectorAll(".g");
                let data = [];
                for (let result of results) {
                    let title = result.querySelector("h3");
                    let description = result.querySelector("span.st");
                    let url = result.querySelector("a");
                    if (title && description && url) {
                        let icon = this.state.selected.find((el) => {
                            console.log(url.href, el.url);
                            return url.href.indexOf(el.url.replace(/https:\/\/(www\.)?/, "")) != -1;
                        }).icon;
                        data.push({
                            title: title.innerText,
                            url: url.href,
                            description: description.innerHTML,
                            icon: icon
                        });
                    }
                }
                return data;
            };
            let query = encodeURIComponent(search + " " + this.state.selected.map((el) => {
                return "site:" + el.url.replace("https://", "");
            }).join(" OR ")).replace(new RegExp(encodeURIComponent(" "), "g"), "+");
            let xhrs = yield Promise.all([0, 1, 2, 4, 5, 6, 7].map((el) => {
                return Tools.createRequest({
                    url: "https://www.google.com/search?q=" + query,
                    data: {
                        start: (el * 10).toString()
                    }
                });
            }));
            let results = xhrs.reduce((arr, el) => {
                let data = extractResults(el.response);
                return arr.concat(data);
            }, []);
            this.setState({ searchresult: results });
        });
    }
}
exports.SearchBody = SearchBody;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(33);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Imports
var urlEscape = __webpack_require__(29);
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(34));

// Module
exports.push([module.i, ".ov-lib-search-input {\n  width: 15em;\n  font-size: 1.5em;\n  display: flex;\n  flex-direction: row;\n  box-sizing: border-box;\n  padding: 0.25em 0 0.25em 0.25em;\n  border: solid 1px gainsboro;\n  -webkit-transition: box-shadow 0.3s, border 0.3s;\n  -moz-transition: box-shadow 0.3s, border 0.3s;\n  -o-transition: box-shadow 0.3s, border 0.3s;\n  transition: box-shadow 0.3s, border 0.3s;\n  outline-color: #8dc73f;\n  background: white; }\n  .ov-lib-search-input input {\n    resize: none;\n    background: white;\n    border: none;\n    flex-grow: 2; }\n    .ov-lib-search-input input:focus {\n      outline: none; }\n  .ov-lib-search-input:hover, .ov-lib-search-input:focus {\n    -webkit-box-shadow: 0 0 5px 1px #8dc73f;\n    -moz-box-shadow: 0 0 5px 1px #8dc73f;\n    box-shadow: 0 0 5px 1px #8dc73f; }\n  .ov-lib-search-input .ov-lib-search-input-btn {\n    -webkit-mask-image: url(" + ___CSS_LOADER_URL___0___ + ");\n    -webkit-mask-repeat: no-repeat;\n    -webkit-mask-size: contain;\n    width: 1.25em;\n    background-color: #aaaaaa;\n    margin: auto 0.2em;\n    height: 1.25em; }\n    .ov-lib-search-input .ov-lib-search-input-btn:hover {\n      background-color: #8dc73f; }\n\n.ov-lib-search-btn-list {\n  margin: 2em auto auto auto;\n  display: flex; }\n  .ov-lib-search-btn-list .ov-lib-search-btn {\n    cursor: pointer;\n    font-size: 1.5em;\n    color: #0a0a0a;\n    text-align: center;\n    margin: 0.25em;\n    display: flex;\n    flex-direction: column;\n    width: 6em;\n    overflow: hidden; }\n    .ov-lib-search-btn-list .ov-lib-search-btn .ov-lib-search-btn-bg {\n      border-radius: 50%;\n      width: 5em;\n      height: 5em;\n      background: whitesmoke;\n      display: flex;\n      margin: auto; }\n      .ov-lib-search-btn-list .ov-lib-search-btn .ov-lib-search-btn-bg .ov-lib-search-btn-img {\n        margin: auto;\n        width: 2em;\n        height: 2em;\n        background-repeat: no-repeat;\n        background-size: contain; }\n    .ov-lib-search-btn-list .ov-lib-search-btn:hover .ov-lib-search-btn-bg {\n      background: rgba(0, 0, 0, 0.1); }\n    .ov-lib-search-btn-list .ov-lib-search-btn .ov-lib-search-btn-text {\n      margin: auto; }\n  .ov-lib-search-btn-list .ov-lib-search-btn-selected .ov-lib-search-btn-bg {\n    background: rgba(0, 0, 0, 0.2) !important; }\n\n.ov-library-search-results {\n  display: flex;\n  flex-wrap: wrap;\n  overflow-y: auto;\n  margin: 0em 2em 2em 2em; }\n  .ov-library-search-results .ov-library-search-result {\n    display: grid;\n    grid: \"icon title\" 1.8em\r \"desc desc\"  1fr /\r 1.8em 1fr;\n    width: 35em;\n    height: 7em;\n    text-decoration: none;\n    color: black;\n    padding: 0.2em;\n    margin: 0.2em;\n    background: whitesmoke;\n    border: solid 1px #ccc; }\n    .ov-library-search-results .ov-library-search-result:hover {\n      border: solid 1px #8dc73f;\n      background: rgba(0, 0, 0, 0.2); }\n    .ov-library-search-results .ov-library-search-result .ov-library-search-result-icon {\n      background-repeat: no-repeat;\n      background-size: contain;\n      grid-area: icon;\n      margin: 0.1em; }\n    .ov-library-search-results .ov-library-search-result .ov-library-search-result-title {\n      grid-area: title;\n      font-weight: bold;\n      font-size: 1.25em;\n      overflow: hidden;\n      margin-left: 0.2em; }\n    .ov-library-search-results .ov-library-search-result .ov-library-search-result-description {\n      grid-area: desc;\n      margin: 0.2em; }\n      .ov-library-search-results .ov-library-search-result .ov-library-search-result-description em {\n        font-weight: bold;\n        color: #8dc73f;\n        font-style: normal; }\n\n.ov-lib-search {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  overflow: auto; }\n  .ov-lib-search .ov-lib-search-input {\n    margin: auto auto 2em auto;\n    width: 80%;\n    max-width: 30em; }\n\n.ov-lib-search-result-body {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  overflow: auto; }\n  .ov-lib-search-result-body .ov-lib-search-input {\n    margin: 2em auto;\n    width: 80%;\n    max-width: 30em; }\n", ""]);



/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/8df8445051631f0638250163756bd171.svg";

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/8de8ddb47b61e3a11584ea79c558cadd.svg";

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/6b829a165b9d8914b3e6005d2e4dbc86.svg";

/***/ }),
/* 37 */
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
__webpack_require__(38);
const React = __webpack_require__(6);
class PromptManager extends React.Component {
    constructor(props) {
        super(props);
        if (PromptManager.promptCreated) {
            throw new Error("Prompt Manager already exists!");
        }
        this.state = { activePrompt: null };
        PromptManager.promptCreated = true;
        PromptManager.openPrompt = (data) => __awaiter(this, void 0, void 0, function* () {
            let promptData = typeof data == "string" ? { name: data, data: null } : data;
            return new Promise((resolve, reject) => {
                PromptManager.onSubmitted = (state) => {
                    resolve(state);
                };
                this.setState({ activePrompt: promptData });
            });
        });
    }
    static openPrompt(data) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static onSubmitted(state) {
    }
    submit(state) {
        this.setState({ activePrompt: null });
        PromptManager.onSubmitted(state);
    }
    render() {
        if (this.state.activePrompt) {
            return (React.createElement("div", { className: "ov-prompt-wrapper" },
                React.createElement("div", { className: "ov-prompt-content" }, this.getPrompts()[this.state.activePrompt.name](this.state.activePrompt.data))));
        }
        else {
            return null;
        }
    }
}
PromptManager.promptCreated = false;
exports.PromptManager = PromptManager;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(39);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Module
exports.push([module.i, ".ov-prompt-wrapper {\n  position: fixed;\n  display: flex;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n  z-index: 1000; }\n  .ov-prompt-wrapper .ov-prompt-content {\n    margin: 6em auto auto auto;\n    padding: 1em;\n    background: white;\n    border-radius: 0.5em; }\n", ""]);



/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(41);
const React = __webpack_require__(6);
const Storage = __webpack_require__(18);
const Tools = __webpack_require__(20);
const prompt_1 = __webpack_require__(37);
class NavigationBtn extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let className = (this.props.className || "") + " ov-lib-nav-btn" + (this.props.selected ? " ov-lib-nav-btn-selected" : "");
        return (React.createElement("div", { className: className, onClick: this.divClicked.bind(this) },
            React.createElement("span", { className: "ov-lib-nav-btn-icon" }),
            React.createElement("span", { className: "ov-lib-nav-btn-text" }, this.props.data.name)));
    }
    divClicked() {
        this.props.onSelected(this.props.data);
    }
}
exports.NavigationBtn = NavigationBtn;
exports.fixedButtons = {
    search: {
        id: "searchVideos",
        name: "Search Videos"
    },
    addPlaylist: {
        id: "addPlaylist",
        name: "Add Playlist"
    }
};
class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: this.props.selected, playlists: [] };
    }
    componentDidMount() {
        Storage.getPlaylists().then((playlists) => {
            this.setState({
                playlists: playlists
            });
        });
    }
    getButtons() {
        let btns = [
            React.createElement(NavigationBtn, { data: exports.fixedButtons.search, onSelected: this.btnSelected.bind(this), selected: this.state.selected.id == exports.fixedButtons.search.id, className: "ov-lib-nav-btn-search", key: exports.fixedButtons.search.id })
        ];
        btns = btns.concat(this.state.playlists.map((el) => {
            let className = undefined;
            if (el.id == Storage.fixed_playlists.history.id) {
                className = "ov-lib-nav-btn-history";
            }
            else if (el.id == Storage.fixed_playlists.favorites.id) {
                className = "ov-lib-nav-btn-favorites";
            }
            return (React.createElement(NavigationBtn, { data: el, onSelected: this.btnSelected.bind(this), selected: this.state.selected.id == el.id, className: className, key: el.id }));
        }));
        btns.push(React.createElement(NavigationBtn, { data: exports.fixedButtons.addPlaylist, onSelected: this.btnSelected.bind(this), selected: this.state.selected.id == exports.fixedButtons.addPlaylist.id, className: "ov-lib-nav-btn-addPlaylist", key: exports.fixedButtons.addPlaylist.id }));
        return btns;
    }
    render() {
        return (React.createElement("div", { className: "ov-lib-nav" }, this.getButtons()));
    }
    btnSelected(data) {
        if (data.id == exports.fixedButtons.addPlaylist.id) {
            prompt_1.PromptManager.openPrompt("addPlaylistPrompt").then((state) => {
                if (state && state.name != "") {
                    let name = state.name;
                    let hash = Tools.generateHash();
                    let playlists = this.state.playlists.concat();
                    playlists.push({ id: hash, name: name });
                    Storage.setPlaylists(playlists);
                    this.setState({ playlists: playlists });
                }
            });
        }
        else {
            this.setState({ selected: data });
            this.props.onSelected(data);
        }
    }
}
exports.Navigation = Navigation;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(42);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Imports
var urlEscape = __webpack_require__(29);
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(43));
var ___CSS_LOADER_URL___1___ = urlEscape(__webpack_require__(34));
var ___CSS_LOADER_URL___2___ = urlEscape(__webpack_require__(44));
var ___CSS_LOADER_URL___3___ = urlEscape(__webpack_require__(45));
var ___CSS_LOADER_URL___4___ = urlEscape(__webpack_require__(46));

// Module
exports.push([module.i, ".ov-lib-nav {\n  grid-area: nav;\n  font-size: 1rem;\n  background: whitesmoke;\n  font-family: Segoe UI; }\n  .ov-lib-nav .ov-lib-nav-btn {\n    display: flex;\n    color: #0a0a0a;\n    height: 3em;\n    font-weight: 400;\n    cursor: pointer;\n    user-select: none; }\n    .ov-lib-nav .ov-lib-nav-btn .ov-lib-nav-btn-text {\n      overflow: hidden;\n      white-space: nowrap;\n      text-overflow: ellipsis;\n      margin: auto 0em; }\n    .ov-lib-nav .ov-lib-nav-btn .ov-lib-nav-btn-icon {\n      width: 1.5em;\n      height: 1.5em;\n      margin: auto 1em;\n      -webkit-mask-repeat: no-repeat;\n      -webkit-mask-size: contain;\n      -webkit-mask-image: url(" + ___CSS_LOADER_URL___0___ + ");\n      background-color: #909090; }\n    .ov-lib-nav .ov-lib-nav-btn:hover {\n      background: rgba(0, 0, 0, 0.1); }\n  .ov-lib-nav .ov-lib-nav-btn-selected {\n    background: rgba(0, 0, 0, 0.2);\n    font-weight: 500 !important; }\n    .ov-lib-nav .ov-lib-nav-btn-selected .ov-lib-nav-btn-icon {\n      background-color: #8dc73f; }\n    .ov-lib-nav .ov-lib-nav-btn-selected:hover {\n      background: rgba(0, 0, 0, 0.2); }\n  .ov-lib-nav .ov-lib-nav-btn-search .ov-lib-nav-btn-icon {\n    -webkit-mask-image: url(" + ___CSS_LOADER_URL___1___ + "); }\n  .ov-lib-nav .ov-lib-nav-btn-history .ov-lib-nav-btn-icon {\n    -webkit-mask-image: url(" + ___CSS_LOADER_URL___2___ + "); }\n  .ov-lib-nav .ov-lib-nav-btn-favorites .ov-lib-nav-btn-icon {\n    -webkit-mask-image: url(" + ___CSS_LOADER_URL___3___ + "); }\n  .ov-lib-nav .ov-lib-nav-btn-addPlaylist .ov-lib-nav-btn-icon {\n    -webkit-mask-image: url(" + ___CSS_LOADER_URL___4___ + "); }\n", ""]);



/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/c1305a95c3da91442eddeed4bbebbd08.svg";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/63eab975fc2b4dd542022a89f082f1b7.svg";

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/70342f69e47f82522e5fbe1af24202b8.svg";

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/7c421760d6a070552343efa5e187257a.svg";

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(48);
const React = __webpack_require__(6);
const Storage = __webpack_require__(18);
function secondsToTime(seconds) {
    let date = new Date(0);
    date.setSeconds(seconds);
    let string = date.toISOString().substr(11, 8);
    while (string.length > 4 && (string[0] == "0" || string[0] == ":")) {
        string = string.substring(1, string.length);
    }
    return string;
}
class VideoLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { noimage: props.videoData.poster == "" };
    }
    componentDidUpdate(oldProps) {
        if (this.props.videoData.poster != oldProps.videoData.poster) {
            this.setState({ noimage: this.props.videoData.poster == "" });
        }
    }
    render() {
        let className = "ov-lib-videoref";
        if (this.props.playing) {
            className += " ov-lib-videoref-playing";
        }
        let hasParent = this.props.videoData.parent &&
            this.props.videoData.parent.url != "CONVERTED_FROM_OLD" &&
            this.props.videoData.parent.url != "POPUP";
        let subtitle = this.props.videoData.origin.name;
        if (hasParent) {
            subtitle += " • " + this.props.videoData.parent.name;
        }
        let links = hasParent ? (React.createElement("div", { className: "ov-lib-videoref-links" },
            React.createElement("div", { className: "ov-lib-videoref-origin-link", onClick: this.originClick.bind(this), title: "Watch on " + this.props.videoData.origin.name },
                React.createElement("p", { style: { backgroundImage: "url('" + this.props.videoData.origin.icon + "')" } }, this.props.videoData.origin.name)),
            React.createElement("div", { className: "ov-lib-videoref-parent-link", onClick: this.parentClick.bind(this), title: "Watch on " + this.props.videoData.parent.name },
                React.createElement("p", { style: { backgroundImage: "url('" + this.props.videoData.parent.icon + "')" } }, this.props.videoData.parent.name)))) : null;
        return (React.createElement("div", { className: className },
            React.createElement("div", { onClick: hasParent ? undefined : this.originClick.bind(this), className: "ov-lib-videoref-thumbnail" },
                React.createElement("img", { className: this.state.noimage ? "ov-lib-videoref-noimg" : "ov-lib-videoref-img", src: this.props.videoData.poster, onError: this.imgLoadError.bind(this) }),
                React.createElement("div", { className: "ov-lib-videoref-watched", style: {
                        marginRight: (1 - this.props.videoData.watched / this.props.videoData.duration) * 100 + "%"
                    } }),
                React.createElement("div", { className: "ov-lib-videoref-duration" }, secondsToTime(this.props.videoData.duration)),
                links),
            React.createElement("div", { className: "ov-lib-videoref-title" }, this.props.videoData.title),
            React.createElement("div", { className: "ov-lib-videoref-subtitle" }, subtitle),
            React.createElement("div", { className: "ov-lib-videoref-x", onClick: this.closeClick.bind(this) })));
    }
    imgLoadError() {
        this.setState({ noimage: true });
    }
    closeClick() {
        this.props.onRemove(this.props.videoData);
    }
    originClick() {
        if (this.props.videoData.parent && this.props.videoData.parent.url == "POPUP") {
            location.href = this.props.videoData.origin.url;
        }
        else {
            this.props.onWatchDirect(this.props.videoData);
        }
    }
    parentClick() {
        location.href = this.props.videoData.parent.url;
    }
}
exports.VideoLink = VideoLink;
class VideoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { videos: [], playing: null };
    }
    componentDidUpdate(prevProps) {
        if (this.props.playlist != prevProps.playlist) {
            Storage.getPlaylistByID(this.props.playlist).then((videos) => {
                console.log(videos);
                this.setState({ videos: videos, playing: null });
            });
        }
    }
    componentDidMount() {
        Storage.getPlaylistByID(this.props.playlist).then((videos) => {
            console.log(videos);
            this.setState({ videos: videos });
        });
    }
    render() {
        console.log(this.state.videos);
        let className = "ov-lib-videolist";
        let iframe = null;
        if (this.state.playing) {
            className += " ov-lib-videolist-playing";
            iframe = React.createElement("iframe", { src: this.state.playing.origin.url });
        }
        return (React.createElement("div", { className: "ov-lib-video" },
            iframe,
            React.createElement("div", { className: className }, this.state.videos.filter((el) => {
                return !this.props.filter || this.props.filter.test(el.title);
            }).map((el) => {
                return (React.createElement(VideoLink, { playing: !!this.state.playing && el.origin.url == this.state.playing.origin.url, key: el.origin.url, videoData: el, onRemove: this.linkRemoved.bind(this), onWatchDirect: this.watchDirectClick.bind(this) }));
            }))));
    }
    watchDirectClick(videoData) {
        this.setState({ playing: videoData });
    }
    linkRemoved(data) {
        let index = this.state.videos.findIndex((el) => {
            return el.origin.url == data.origin.url;
        });
        let newPlaylist = this.state.videos.slice();
        newPlaylist.splice(index, 1);
        this.setState({ videos: newPlaylist });
        Storage.setPlaylistByID(this.props.playlist, newPlaylist);
        this.props.onVideoRemoved(data);
    }
}
exports.VideoList = VideoList;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(49);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Imports
var urlEscape = __webpack_require__(29);
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(50));

// Module
exports.push([module.i, ".ov-lib-video {\n  display: flex;\n  grid-area: body;\n  flex-direction: row-reverse;\n  overflow: hidden;\n  min-width: 0; }\n  .ov-lib-video iframe {\n    flex-grow: 1;\n    border: none;\n    margin: 3em;\n    order: 1; }\n  .ov-lib-video .ov-lib-videolist {\n    display: flex;\n    flex-wrap: wrap;\n    align-content: flex-start;\n    padding: 1em;\n    margin: 2em auto;\n    overflow-y: auto; }\n  .ov-lib-video .ov-lib-videolist-playing {\n    flex-direction: column;\n    order: 0;\n    margin: 2em 2em 2em 0em;\n    flex-wrap: nowrap;\n    overflow-y: auto; }\n    .ov-lib-video .ov-lib-videolist-playing .ov-lib-videoref {\n      padding: 0.5em; }\n\n.ov-lib-videoref-playing {\n  background: rgba(0, 0, 0, 0.1); }\n\n.ov-lib-videoref {\n  cursor: pointer;\n  height: fit-content;\n  width: 16em;\n  margin: 0.25em; }\n  .ov-lib-videoref .ov-lib-videoref-thumbnail {\n    width: 16em;\n    height: 9em;\n    background-size: contain;\n    background-repeat: no-repeat;\n    position: relative;\n    user-select: none; }\n    .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-img, .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-noimg {\n      width: 100%;\n      height: 100%; }\n    .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-noimg {\n      -webkit-mask-image: url(" + ___CSS_LOADER_URL___0___ + ");\n      -webkit-mask-repeat: no-repeat;\n      -webkit-mask-size: contain;\n      background: #ccc;\n      -webkit-mask-position: center; }\n    .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-watched {\n      position: absolute;\n      left: 0;\n      bottom: 0;\n      right: 0;\n      background-color: #8dc73f;\n      height: 5px;\n      transition: opacity 0.3s;\n      opacity: 1; }\n    .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-duration {\n      position: absolute;\n      bottom: 0;\n      right: 0;\n      margin: 4px;\n      color: #FFFFFF;\n      background-color: rgba(0, 0, 0, 0.8);\n      padding: 2px 4px;\n      border-radius: 2px;\n      letter-spacing: .5px;\n      font-weight: 500;\n      transition: opacity 0.3s;\n      opacity: 1; }\n    .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-links {\n      background: rgba(0, 0, 0, 0.5);\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 0;\n      bottom: 0;\n      color: white;\n      transition: opacity 0.3s;\n      opacity: 0; }\n      .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-links .ov-lib-videoref-origin-link {\n        transition: background .3s ease-out;\n        position: absolute;\n        left: 0;\n        right: 0;\n        top: 0;\n        bottom: 50%;\n        display: flex; }\n        .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-links .ov-lib-videoref-origin-link:hover {\n          background: rgba(0, 0, 0, 0.7); }\n      .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-links .ov-lib-videoref-parent-link {\n        transition: background .3s ease-out;\n        position: absolute;\n        left: 0;\n        right: 0;\n        top: 50%;\n        bottom: 0;\n        display: flex; }\n        .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-links .ov-lib-videoref-parent-link:hover {\n          background: rgba(0, 0, 0, 0.7); }\n      .ov-lib-videoref .ov-lib-videoref-thumbnail .ov-lib-videoref-links p {\n        font-weight: 400;\n        font-size: 1.5em;\n        margin-top: auto;\n        margin-bottom: auto;\n        padding-left: 1.3em;\n        margin-left: 1em;\n        background-repeat: no-repeat;\n        background-size: 1.2em;\n        background-position-y: center; }\n  .ov-lib-videoref .ov-lib-videoref-title {\n    max-height: 2.5em;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: normal;\n    font-size: 1.2em;\n    font-weight: 500;\n    margin: 8px 0 8px; }\n  .ov-lib-videoref .ov-lib-videoref-subtitle {\n    color: #606060;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden;\n    font-size: 1em;\n    font-weight: 400;\n    text-transform: none; }\n  .ov-lib-videoref:hover .ov-lib-videoref-watched, .ov-lib-videoref:hover .ov-lib-videoref-duration {\n    opacity: 0; }\n  .ov-lib-videoref:hover .ov-lib-videoref-links {\n    opacity: 1; }\n", ""]);



/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/e3b7a742f31ceccb7d9aba5bf4337c1f.svg";

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(52);
const React = __webpack_require__(6);
const prompt_1 = __webpack_require__(37);
class AddSearchSitePrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", url: "" };
    }
    render() {
        return (React.createElement("div", { className: "ov-lib-prompt-addsearchsite" },
            React.createElement("div", { className: "ov-lib-prompt-header" }, "Add site to search"),
            React.createElement("input", { className: "ov-lib-search-input", value: this.state.name, placeholder: "Name (eg. YouTube)", onChange: this.inputNameChange.bind(this) }),
            React.createElement("input", { className: "ov-lib-search-input", value: this.state.url, placeholder: "URL (eg. youtube.com)", onChange: this.inputUrlChange.bind(this) }),
            React.createElement("div", { className: "ov-lib-prompt-btns" },
                React.createElement("div", { className: "ov-lib-prompt-btn-left", onClick: () => {
                        this.props.onSubmitted(this.state);
                    } }, "Apply"),
                React.createElement("div", { className: "ov-lib-prompt-btn-right", onClick: () => {
                        this.props.onSubmitted(null);
                    } }, "Cancel"))));
    }
    inputNameChange(ev) {
        this.setState({ name: ev.target.value });
    }
    inputUrlChange(ev) {
        this.setState({ url: ev.target.value });
    }
}
exports.AddSearchSitePrompt = AddSearchSitePrompt;
class AddPlaylistPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "" };
    }
    render() {
        return (React.createElement("div", { className: "ov-lib-prompt-addsearchsite" },
            React.createElement("div", { className: "ov-lib-prompt-header" }, "New playlist"),
            React.createElement("input", { className: "ov-lib-search-input", value: this.state.name, placeholder: "playlist name", onChange: this.inputNameChange.bind(this) }),
            React.createElement("div", { className: "ov-lib-prompt-btns" },
                React.createElement("div", { className: "ov-lib-prompt-btn-left", onClick: () => {
                        this.props.onSubmitted(this.state);
                    } }, "Apply"),
                React.createElement("div", { className: "ov-lib-prompt-btn-right", onClick: () => {
                        this.props.onSubmitted(null);
                    } }, "Cancel"))));
    }
    inputNameChange(ev) {
        this.setState({ name: ev.target.value });
    }
}
exports.AddPlaylistPrompt = AddPlaylistPrompt;
class LibraryPromptManager extends prompt_1.PromptManager {
    getPrompts() {
        return {
            addSearchSitePrompt: () => {
                return React.createElement(AddSearchSitePrompt, { onSubmitted: this.submit.bind(this) });
            },
            addPlaylistPrompt: () => {
                return React.createElement(AddPlaylistPrompt, { onSubmitted: this.submit.bind(this) });
            }
        };
    }
}
exports.LibraryPromptManager = LibraryPromptManager;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(53);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Module
exports.push([module.i, ".ov-lib-prompt-addsearchsite {\n  display: flex;\n  flex-direction: column;\n  user-select: none; }\n  .ov-lib-prompt-addsearchsite input {\n    margin-bottom: 0.5em;\n    font-size: 1.2em; }\n  .ov-lib-prompt-addsearchsite .ov-lib-prompt-header {\n    text-align: center;\n    font-size: 1.6em;\n    margin-bottom: 0.5em;\n    font-weight: bold; }\n  .ov-lib-prompt-addsearchsite .ov-lib-prompt-btns {\n    display: flex; }\n    .ov-lib-prompt-addsearchsite .ov-lib-prompt-btns div {\n      width: 5em;\n      padding: 0.5em;\n      text-align: center;\n      font-weight: bold;\n      cursor: pointer;\n      border: solid 1px gainsboro; }\n      .ov-lib-prompt-addsearchsite .ov-lib-prompt-btns div:hover {\n        color: white;\n        background: #8dc73f; }\n    .ov-lib-prompt-addsearchsite .ov-lib-prompt-btns .ov-lib-prompt-btn-right {\n      margin: auto auto auto 0.5em; }\n    .ov-lib-prompt-addsearchsite .ov-lib-prompt-btns .ov-lib-prompt-btn-left {\n      margin: auto 0.5em auto auto; }\n", ""]);



/***/ })
/******/ ]);
//# sourceMappingURL=library.js.map