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
/******/ 		7: 0
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
/******/ 	deferredModules.push([65,1]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 135:
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
const Page = __webpack_require__(21);
const Tools = __webpack_require__(20);
const Background = __webpack_require__(23);
function toDataURL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let xhr = yield Tools.createRequest({
            url: url, beforeSend: function (xhr) {
                xhr.responseType = 'blob';
            }
        });
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function () {
                resolve("url(" + reader.result + ")");
            };
            reader.onerror = function () {
                reject(reader.error);
            };
            reader.readAsDataURL(xhr.response);
        });
    });
}
function requestPlayerCSS() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield Background.toTopWindow({ func: "metadata_requestPlayerCSS", data: {} });
        return response.data;
    });
}
exports.requestPlayerCSS = requestPlayerCSS;
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Page.isReady();
        let ovtags = document.getElementsByTagName("openvideo");
        let metadata = null;
        Messages.addListener({
            metadata_requestPlayerCSS: function (request) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (ovtags.length > 0) {
                        if (metadata) {
                            return metadata;
                        }
                        else {
                            let ovtag = ovtags[0];
                            if (!ovtag.hasAttribute("playimage") || !ovtag.hasAttribute("playhoverimage")) {
                                throw Error("The openvideo tag has a wrong format!");
                            }
                            let dataURLs = yield Promise.all([toDataURL(ovtag.getAttribute("playimage")), toDataURL(ovtag.getAttribute("playhoverimage"))]);
                            return { doChange: true, color: ovtag.getAttribute("color"), playimage: dataURLs[0], playhoverimage: dataURLs[1] };
                        }
                    }
                    else {
                        return null;
                    }
                });
            }
        });
        if (ovtags.length > 0) {
            let ovtag = ovtags[0];
            ovtag.innerText = Environment.getManifest().version;
            ovtag.dispatchEvent(new Event("ov-metadata-received"));
        }
    });
}
exports.setup = setup;


/***/ }),

/***/ 136:
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
__webpack_require__(137);
__webpack_require__(139);
const React = __webpack_require__(6);
const Tools = __webpack_require__(20);
const Analytics = __webpack_require__(58);
const Environment = __webpack_require__(24);
const Page = __webpack_require__(21);
const Messages = __webpack_require__(19);
const Storage = __webpack_require__(18);
const Languages = __webpack_require__(55);
const Background = __webpack_require__(23);
window["Worker"] = undefined;
Messages.setupMiddleware();
Page.wrapType(XMLHttpRequest, {
    open: {
        get: function (target) {
            return function (method, url) {
                if (OVPlayer.player && OVPlayer.player.currentType().match(/application\//i) && /\.(ts|m3u8)$/.test(url)) {
                    arguments[1] = Tools.addRefererToURL(url, Page.getUrlObj().origin);
                }
                target.open.apply(target, arguments);
            };
        }
    }
});
const video_js_1 = __webpack_require__(68);
const OVPlayerComponents = __webpack_require__(144);
OVPlayerComponents.setup();
class OVPlayer extends React.Component {
    constructor() {
        super(...arguments);
        this.videoNode = null;
        this.srtSelector = document.createElement("input");
    }
    componentDidMount() {
        // instantiate Video.js
        this.setupSrtSelector();
        OVPlayer.player = video_js_1.default(this.videoNode, Tools.merge(this.props.options, {
            plugins: {},
            playbackRates: [0.5, 1, 2],
            language: Languages.getMsg("video_player_locale")
        }), () => {
            this.playerReady();
        });
    }
    // destroy player on unmount
    componentWillUnmount() {
        if (OVPlayer.player) {
            OVPlayer.player.dispose();
            OVPlayer.player = null;
        }
    }
    componentDidUpdate(oldProps) {
        this.setVideoData(this.props.videoData);
    }
    execute(cmd, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cmd == "downloadSource") {
                this.downloadSource(data);
            }
            else if (cmd == "downloadActiveSource") {
                this.downloadSource(this.getActiveVideoSource());
            }
            else if (cmd == "downloadTrack") {
                this.downloadTrack(data);
            }
            else if (cmd == "loadSubtitlesFromFile") {
                this.srtSelector.click();
            }
            else if (cmd == "loadSubtitlesFromURL") {
                let response = yield Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" });
                if (!response.aborted) {
                    let fn = yield Tools.getUrlFileName(response.text);
                    this.appendTextTrack({ kind: "captions", label: fn, language: "AddedFromUser", src: response.text });
                }
            }
            else if (cmd == "addToPlaylist") {
                let id = data.id;
                let videos = yield Storage.getPlaylistByID(id);
                videos.push(yield this.getVideoRefData());
                Storage.setPlaylistByID(id, videos);
            }
            else if (cmd == "removeFromPlaylist") {
                let id = data.id;
                let videos = yield Storage.getPlaylistByID(id);
                var itemIndex = videos.findIndex((arrElem) => {
                    return arrElem.origin.url == this.props.videoData.origin.url;
                });
                if (itemIndex != -1) {
                    videos.splice(itemIndex, 1);
                    Storage.setPlaylistByID(id, videos);
                }
            }
        });
    }
    downloadSource(src) {
        var file = Tools.merge(src.dlsrc || { src: src.src, type: src.type, filename: null }, { label: src.label });
        if (file.type.indexOf("application/") == -1) {
            var dlData = { url: file.src, fileName: "" };
            var label = file.label;
            dlData.fileName = file.filename || (this.props.videoData.title + "." + file.type.substr(file.type.indexOf("/") + 1)).replace(/[/\\?%*:|"<>]/g, ' ').trim();
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
    downloadTrack(label) {
        let trackSrc = this.props.videoData.tracks.find(function (src) {
            return label == src.label;
        });
        if (trackSrc) {
            let filename = "[" + trackSrc.label + "]" + this.props.videoData.title + ".vtt".replace(/[/\\?%*:|"<>]/g, ' ').trim();
            Background.downloadFile({ url: trackSrc.src, fileName: filename });
        }
    }
    setupSrtSelector() {
        this.srtSelector.type = "file";
        this.srtSelector.accept = ".vtt, .srt, .txt";
        this.srtSelector.style.display = "none";
        this.srtSelector.addEventListener("change", () => {
            var collection = new FileReader;
            collection.onload = () => {
                let result = collection.result;
                if (result.indexOf("-->") !== -1) {
                    OVPlayer.player.addTextTrack("captions", this.srtSelector.files[0].name, "AddedFromUser");
                    var track = OVPlayer.player.textTracks()[OVPlayer.player.textTracks().length - 1];
                    parseSrt(result, function (cue) {
                        track.addCue(cue);
                    });
                }
                else {
                    Background.alert("Invaid subtitle file");
                }
            };
            collection.readAsText(this.srtSelector.files[0], "ISO-8859-1");
        });
    }
    playerReady() {
        return __awaiter(this, void 0, void 0, function* () {
            OVPlayer.player.execute = this.execute.bind(this);
            /*OVPlayer.player!.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false
            });*/
            OVPlayer.player.el().style.width = "100%";
            OVPlayer.player.el().style.height = "100%";
            let ControlBar = OVPlayer.player.getChild('controlBar');
            if (!ControlBar) {
                throw new Error("Control bar is missing!");
            }
            var DownloadButton = ControlBar.addChild('vjsDownloadButton', {});
            var PatreonButton = ControlBar.addChild('vjsPatreonButton', {});
            var FullscreenToggle = ControlBar.getChild('fullscreenToggle');
            var CaptionsButton = ControlBar.getChild('SubsCapsButton');
            CaptionsButton.show();
            let playlists = yield Storage.getPlaylists();
            playlists.splice(0, 1);
            let playlistscontent = yield Promise.all(playlists.map((el) => __awaiter(this, void 0, void 0, function* () {
                let videos = yield Storage.getPlaylistByID(el.id);
                return { playlist: el, videos: videos };
            })));
            let active = playlistscontent.filter((el) => {
                return el.videos.some((video) => {
                    return video.origin.url == this.props.videoData.origin.url;
                });
            }).map((el) => {
                return el.playlist;
            });
            var PlaylistButton = ControlBar.addChild("vjsPlaylistButton", { playlists: playlists, active: active });
            console.log("player is ready");
            OVPlayer.player.on("ratechange", () => {
                Analytics.fireEvent("PlaybackRate", "PlayerEvent", this.props.videoData.origin.url);
            });
            FullscreenToggle.on("click", () => {
                window.setTimeout(() => {
                    if (Environment.browser() == "chrome" /* Chrome */ && !document.fullscreen && OVPlayer.player.isFullscreen()) {
                        console.log("FULLSCREEN ERROR");
                        Analytics.fireEvent("FullscreenError", "FullscreenError", "IFrame: '" + this.props.videoData.origin + "' Page: '<PAGE_URL>', Version: " + Environment.getManifest().version);
                    }
                }, 1000);
            });
            ControlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
            ControlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
            ControlBar.el().insertBefore(PlaylistButton.el(), FullscreenToggle.el());
            if (!this.props.isPopup && Page.isFrame()) {
                var TheaterButton = ControlBar.addChild('vjsTheatreButton', {});
                ControlBar.el().insertBefore(TheaterButton.el(), FullscreenToggle.el());
                OVPlayer.player.on("fullscreenchange", () => {
                    TheaterButton.el().style.display = OVPlayer.player.isFullscreen() ? "none" : "inherit";
                });
            }
            let volume = yield Storage.getPlayerVolume();
            OVPlayer.player.volume(volume);
            OVPlayer.player.on('volumechange', () => {
                Storage.setPlayerVolume(OVPlayer.player.volume());
            });
            OVPlayer.player.one('loadedmetadata', () => {
                this.loadFromHistory();
            });
            OVPlayer.player.el().addEventListener("mouseleave", () => {
                if (OVPlayer.player.currentTime() != 0) {
                    this.saveToHistory();
                }
            });
            if (this.props.onError) {
                OVPlayer.player.on('error', () => {
                    if (this.props.onError) {
                        this.props.onError(OVPlayer.player);
                    }
                });
            }
            if (!this.props.isPopup) {
                OVPlayer.player.on('error', () => {
                    if (OVPlayer.player.readyState() == 0) {
                        //if(Response.status == 404 || Response.status == 400 || Response.status == 403) {
                        Analytics.fireEvent(this.props.videoData.origin.name, "Error", JSON.stringify(Environment.getErrorMsg({ msg: OVPlayer.player.error().message, url: this.props.videoData.origin.url })));
                        //}
                        //document.location.replace(Hash.vidSiteUrl + (Hash.vidSiteUrl.indexOf("?") == -1 ? "?" : "&") + "ignoreRequestCheck=true");
                    }
                    else {
                        /*OVPlayer.player!.bigPlayButton.on("click", () => {
                            location.replace(this.props.videoData.origin.url);
                        });
                        OVPlayer.player!.bigPlayButton.addClass("reloadButton");*/
                    }
                });
            }
            this.setVideoData(this.props.videoData);
            OVPlayer.player.controls(true);
        });
    }
    // wrap the player in a div with a `data-vjs-player` attribute
    // so videojs won't create additional wrapper in the DOM
    // see https://github.com/videojs/video.js/pull/3856
    render() {
        return (React.createElement("div", { "data-vjs-player": true },
            React.createElement("video", { ref: node => this.videoNode = node, className: "video-js vjs-big-play-centered", preload: "auto" })));
    }
    appendTextTrack(rawTrack) {
        return __awaiter(this, void 0, void 0, function* () {
            let convertToTrack = (srcContent) => {
                if (srcContent.indexOf("-->") !== -1) {
                    OVPlayer.player.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
                    let track = OVPlayer.player.textTracks()[OVPlayer.player.textTracks().length - 1];
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
            };
            try {
                let xhr = yield Tools.createRequest({ url: rawTrack.src });
                convertToTrack(xhr.responseText);
            }
            catch (e) {
                let xhr = yield Tools.createRequest({ url: Tools.removeRefererFromURL(rawTrack.src) });
                convertToTrack(xhr.responseText);
            }
        });
    }
    getActiveVideoSource() {
        for (let src of this.props.videoData.src) {
            if (OVPlayer.player.src().indexOf(src.src) == 0) {
                return src;
            }
        }
        throw new Error("No video source active!");
    }
    setVideoData(videoData) {
        OVPlayer.player.poster(videoData.poster);
        var srces = videoData.src;
        if (srces.length == 1) {
            OVPlayer.player.src(srces[0]);
        }
        else {
            let quality = OVPlayer.player.controlBar.addChild("vjsQualityButton", { sources: srces });
            let fullscreen = OVPlayer.player.controlBar.getChild("fullscreenToggle");
            OVPlayer.player.controlBar.el().insertBefore(quality.el(), fullscreen.el());
        }
        for (let track of videoData.tracks) {
            this.appendTextTrack(track);
            //player.addRemoteTextTrack(<any>track, true);
        }
    }
    getVideoRefData(history) {
        return __awaiter(this, void 0, void 0, function* () {
            history = history || (yield Storage.getPlaylistByID(Storage.fixed_playlists.history.id));
            var itemIndex = history.findIndex((arrElem) => {
                return arrElem.origin.url == this.props.videoData.origin.url;
            });
            return {
                poster: this.props.videoData.poster,
                title: this.props.videoData.title,
                origin: this.props.videoData.origin,
                parent: this.props.videoData.parent || (history[itemIndex] ? history[itemIndex].parent : null),
                watched: OVPlayer.player.currentTime() == OVPlayer.player.duration() ? 0 : OVPlayer.player.currentTime(),
                duration: OVPlayer.player.duration()
            };
        });
    }
    saveToHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            let isEnabled = yield Storage.isHistoryEnabled();
            if (isEnabled) {
                let history = yield Storage.getPlaylistByID(Storage.fixed_playlists.history.id);
                var itemIndex = history.findIndex((arrElem) => {
                    return arrElem.origin.url == this.props.videoData.origin.url;
                });
                var histHash = yield this.getVideoRefData(history);
                histHash.parent = histHash.parent;
                if (itemIndex != -1) {
                    history.splice(itemIndex, 1);
                }
                history.unshift(histHash);
                if (history.length > 100) {
                    history = history.slice(0, 99);
                }
                Storage.setPlaylistByID(Storage.fixed_playlists.history.id, history);
                //});
            }
        });
    }
    loadFromHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            let history = yield Storage.getPlaylistByID(Storage.fixed_playlists.history.id);
            var item = history.find((arrElem) => {
                return arrElem.origin.url == this.props.videoData.origin.url;
            });
            if (item) {
                OVPlayer.player.currentTime(item.watched);
            }
        });
    }
}
OVPlayer.player = null;
exports.OVPlayer = OVPlayer;
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


/***/ }),

/***/ 139:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(140);

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

/***/ 140:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Imports
var urlEscape = __webpack_require__(29);
var ___CSS_LOADER_URL___0___ = urlEscape(__webpack_require__(30));
var ___CSS_LOADER_URL___1___ = urlEscape(__webpack_require__(141));
var ___CSS_LOADER_URL___2___ = urlEscape(__webpack_require__(142));
var ___CSS_LOADER_URL___3___ = urlEscape(__webpack_require__(143));
var ___CSS_LOADER_URL___4___ = urlEscape(__webpack_require__(46));

// Module
exports.push([module.i, "video {\n  outline: none; }\n\n.video-js {\n  display: flex; }\n  .video-js .vjs-big-play-button {\n    background: url(" + ___CSS_LOADER_URL___0___ + ") no-repeat;\n    background-size: contain;\n    background-position: center;\n    position: unset;\n    top: unset;\n    left: unset;\n    margin: auto;\n    width: 4em;\n    height: 4em;\n    z-index: 999;\n    border: none; }\n    .video-js .vjs-big-play-button .vjs-icon-placeholder:before {\n      content: none; }\n  .video-js:hover .vjs-big-play-button {\n    background-color: transparent; }\n\n.vjs-has-started .vjs-control-bar {\n  display: inline-flex;\n  background-color: transparent;\n  bottom: 0.25em;\n  left: 1em;\n  right: 1em;\n  width: unset;\n  font-size: 1.2em; }\n  .vjs-has-started .vjs-control-bar:before {\n    content: '';\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));\n    pointer-events: none;\n    position: absolute;\n    left: -1em;\n    right: -1em;\n    bottom: -0.5em;\n    height: 5em; }\n  .vjs-has-started .vjs-control-bar .vjs-button {\n    opacity: 0.9;\n    outline: none; }\n    .vjs-has-started .vjs-control-bar .vjs-button:hover {\n      opacity: 1; }\n  .vjs-has-started .vjs-control-bar .vjs-button {\n    cursor: pointer; }\n  .vjs-has-started .vjs-control-bar .vjs-menu-content {\n    font-size: 0.9em; }\n    .vjs-has-started .vjs-control-bar .vjs-menu-content li {\n      padding: 0.2em; }\n  .vjs-has-started .vjs-control-bar .vjs-progress-control {\n    height: fit-content;\n    position: absolute;\n    width: 100%;\n    bottom: 100%; }\n    .vjs-has-started .vjs-control-bar .vjs-progress-control .vjs-progress-holder {\n      margin: 0; }\n    .vjs-has-started .vjs-control-bar .vjs-progress-control .vjs-play-progress {\n      background-color: #8dc73f; }\n  .vjs-has-started .vjs-control-bar .vjs-duration {\n    display: block;\n    padding-left: 0.3em; }\n  .vjs-has-started .vjs-control-bar .vjs-current-time {\n    display: block;\n    padding-right: 0; }\n    .vjs-has-started .vjs-control-bar .vjs-current-time:after {\n      content: \" / \"; }\n  .vjs-has-started .vjs-control-bar .vjs-remaining-time {\n    display: none; }\n  .vjs-has-started .vjs-control-bar .vjs-playback-rate {\n    margin-left: auto; }\n  .vjs-has-started .vjs-control-bar .vjs-subs-caps-button .vjs-menu {\n    width: 15em;\n    left: -5.5em; }\n    .vjs-has-started .vjs-control-bar .vjs-subs-caps-button .vjs-menu ul {\n      overflow-x: hidden; }\n      .vjs-has-started .vjs-control-bar .vjs-subs-caps-button .vjs-menu ul li {\n        position: relative;\n        text-transform: capitalize; }\n        .vjs-has-started .vjs-control-bar .vjs-subs-caps-button .vjs-menu ul li button {\n          -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTQgMTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0IDEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I2ZmZmZmZjt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEyLDkgMTIsMTEgMiwxMSAyLDkgMCw5IDAsMTMgMTQsMTMgMTQsOSAiLz48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEwLDMuNiA4LDUuNiA4LDAgNiwwIDYsNS42IDQsMy42IDIuNiw1IDcsOS40IDExLjQsNSAiLz48L3N2Zz4=) no-repeat 0 50%;\n          width: 13px;\n          position: absolute;\n          right: 5px;\n          top: 2px;\n          bottom: 2px;\n          -webkit-mask-position: center;\n          background-color: #fff; }\n      .vjs-has-started .vjs-control-bar .vjs-subs-caps-button .vjs-menu ul li.vjs-selected button {\n        background-color: #2B333F;\n        color: #2B333F !important; }\n  .vjs-has-started .vjs-control-bar .vjs-download-button {\n    width: 1.5em;\n    height: 1.5em;\n    margin: auto;\n    background-color: white;\n    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTQgMTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0IDEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I2ZmZmZmZjt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEyLDkgMTIsMTEgMiwxMSAyLDkgMCw5IDAsMTMgMTQsMTMgMTQsOSAiLz48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEwLDMuNiA4LDUuNiA4LDAgNiwwIDYsNS42IDQsMy42IDIuNiw1IDcsOS40IDExLjQsNSAiLz48L3N2Zz4=) no-repeat; }\n  .vjs-has-started .vjs-control-bar .vjs-patreon-button {\n    width: 1.8em;\n    height: 1.8em;\n    margin: auto;\n    background-image: url(" + ___CSS_LOADER_URL___1___ + "); }\n  .vjs-has-started .vjs-control-bar .vjs-theatre-button {\n    width: 1.5em;\n    height: 1.5em;\n    margin: auto;\n    -webkit-mask: url(" + ___CSS_LOADER_URL___2___ + ") no-repeat;\n    -webkit-mask-size: contain;\n    background-color: white; }\n  .vjs-has-started .vjs-control-bar .vjs-quality-button .vjs-menu-button {\n    -webkit-mask: url(" + ___CSS_LOADER_URL___3___ + ") no-repeat;\n    -webkit-mask-size: 1.5em;\n    background-color: white;\n    -webkit-mask-position: center; }\n  .vjs-has-started .vjs-control-bar .vjs-quality-button .vjs-menu {\n    width: 7em;\n    left: -1.5em; }\n    .vjs-has-started .vjs-control-bar .vjs-quality-button .vjs-menu ul li {\n      position: relative; }\n      .vjs-has-started .vjs-control-bar .vjs-quality-button .vjs-menu ul li button {\n        -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTQgMTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0IDEzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN0eWxlIHR5cGU9InRleHQvY3NzIj4uc3Qwe2ZpbGw6I2ZmZmZmZjt9PC9zdHlsZT48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEyLDkgMTIsMTEgMiwxMSAyLDkgMCw5IDAsMTMgMTQsMTMgMTQsOSAiLz48cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjEwLDMuNiA4LDUuNiA4LDAgNiwwIDYsNS42IDQsMy42IDIuNiw1IDcsOS40IDExLjQsNSAiLz48L3N2Zz4=) no-repeat 0 50%;\n        width: 13px;\n        position: absolute;\n        right: 5px;\n        top: 2px;\n        bottom: 2px;\n        -webkit-mask-position: center;\n        background-color: #fff; }\n    .vjs-has-started .vjs-control-bar .vjs-quality-button .vjs-menu ul li.vjs-selected button {\n      background-color: #2B333F;\n      color: #2B333F !important; }\n  .vjs-has-started .vjs-control-bar .vjs-playlist-button .vjs-menu-button {\n    -webkit-mask: url(" + ___CSS_LOADER_URL___4___ + ") no-repeat;\n    -webkit-mask-size: 1.9em;\n    background-color: white;\n    -webkit-mask-position: center; }\n  .vjs-has-started .vjs-control-bar .vjs-playlist-button .vjs-menu ul li {\n    text-transform: capitalize; }\n", ""]);



/***/ }),

/***/ 141:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/edb0e8352c1a6ef8999f94d6569f38e8.svg";

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/42d5d72c2ac6db8ee5d7eda660a78fa7.svg";

/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/7c9f5af4ec73ac7bb2ebda5f6eb63f6b.svg";

/***/ }),

/***/ 144:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Analytics = __webpack_require__(58);
const TheatreMode = __webpack_require__(22);
const Background = __webpack_require__(23);
const Environment = __webpack_require__(24);
const React = __webpack_require__(6);
const ReactDOM = __webpack_require__(11);
const video_js_1 = __webpack_require__(68);
function registerComponent(parentType, name, getNode) {
    let wrapperType = class extends parentType {
        constructor(player, options) {
            super(player, options);
            /* Bind the current class context to the mount method */
            this.mount = this.mount.bind(this);
            /* When player is ready, call method to mount React component */
            player.ready(() => {
                this.mount();
            });
            /* Remove React root when component is destroyed */
            this.on("dispose", () => {
                ReactDOM.unmountComponentAtNode(this.el());
            });
        }
        mount() {
            ReactDOM.render(getNode(this), this.el());
        }
    };
    video_js_1.default.registerComponent(name, wrapperType);
}
class TheatreButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { enabled: false };
    }
    render() {
        return (React.createElement("div", { className: "vjs-theatre-button", onClick: this.buttonClicked.bind(this) }));
    }
    buttonClicked() {
        TheatreMode.setTheatreMode(!this.state.enabled);
        this.state = { enabled: !this.state.enabled };
    }
}
class PatreonButton extends React.Component {
    render() {
        return React.createElement("div", { className: "vjs-patreon-button", onClick: this.buttonClicked.bind(this) });
    }
    buttonClicked() {
        Analytics.fireEvent("PatreonButton", "PlayerEvent", "");
        Background.openTab(Environment.getPatreonUrl());
    }
}
class DownloadButton extends React.Component {
    render() {
        return React.createElement("div", { className: "vjs-download-button", onClick: this.buttonClicked.bind(this) });
    }
    buttonClicked() {
        let player = this.props.wrapper.player();
        player.execute("downloadActiveSource", null);
    }
}
function setup() {
    const MenuItem = video_js_1.default.getComponent("MenuItem");
    class QualityMenuItem extends MenuItem {
        constructor(player, data, onClick) {
            super(player, {
                label: data.label,
                selectable: true,
                selected: data.default,
            });
            this.selected(false);
            this.onClick = onClick;
            this.source = data;
            //this.controlText(data.label);
            this.playerReady();
        }
        handleClick(event) {
            this.onClick();
            super.handleClick(event);
            this.switchSource();
        }
        switchSource() {
            if (this.player().src() == this.source.src) {
                return;
            }
            let isPaused = this.player().paused();
            let currentTime = this.player().currentTime();
            console.log(isPaused);
            this.player().one("loadedmetadata", () => {
                this.player().currentTime(currentTime);
                if (!isPaused) {
                    this.player().play();
                }
            });
            this.player().src(this.source);
            console.log("Sourcee set!", this.source);
        }
        playerReady() {
            let button = document.createElement("button");
            button.addEventListener("click", (event) => {
                this.player().execute("downloadSource", this.source);
                event.stopPropagation();
            });
            if (this.source.default) {
                this.switchSource();
            }
            this.el().appendChild(button);
        }
    }
    const MenuButton = video_js_1.default.getComponent("MenuButton");
    class QualityMenuButton extends MenuButton {
        constructor(player, options) {
            super(player, options);
            this.addClass("vjs-quality-button");
        }
        createItems() {
            let sources = this.options_.sources;
            if (sources && sources.length > 0) {
                sources = sources.sort((a, b) => {
                    let qualA = a.label.match(/([0-9]*)p?/);
                    let qualB = b.label.match(/([0-9]*)p?/);
                    if (qualA && qualB) {
                        console.log(qualA, parseInt(qualA[1]), parseInt(qualB[1]));
                        return (parseInt(qualA[1]) > parseInt(qualB[1]) ? -1 : 1);
                    }
                    else if (qualA || qualB) {
                        return qualA ? 1 : -1;
                    }
                    else {
                        return -a.label.localeCompare(b.label);
                    }
                });
                sources[0].default = true;
                let unselectOthers = () => {
                    items.forEach((el) => {
                        el.selected(false);
                    });
                };
                let items = this.options_.sources.map((el) => {
                    return new QualityMenuItem(this.player(), el, unselectOthers);
                });
                items[0].selected(true);
                this.player().src(sources[0]);
                return items;
            }
            return [];
        }
    }
    video_js_1.default.registerComponent("vjsQualityButton", QualityMenuButton);
    class PlaylistMenuItem extends MenuItem {
        constructor(player, data, selected) {
            super(player, {
                label: data.name,
                selectable: true,
                selected: selected,
                multiSelectable: true
            });
            this.playlist = data;
            this.isSelected = selected;
        }
        handleClick(event) {
            super.handleClick(event);
            this.isSelected = !this.isSelected;
            this.selected(this.isSelected);
            if (this.isSelected) {
                this.player().execute("addToPlaylist", this.playlist);
            }
            else {
                this.player().execute("removeFromPlaylist", this.playlist);
            }
        }
    }
    class PlaylistMenuButton extends MenuButton {
        constructor(player, options) {
            super(player, options);
            this.addClass("vjs-playlist-button");
        }
        createItems() {
            return this.options_.playlists.map((el) => {
                return new PlaylistMenuItem(this.player(), el, this.options_.active.find((actel) => {
                    return actel.id == el.id;
                }) != null);
            });
        }
    }
    video_js_1.default.registerComponent("vjsPlaylistButton", PlaylistMenuButton);
    class SubtitlesFromFileMenuItem extends MenuItem {
        constructor(player) {
            super(player, {
                label: "load VTT/SRT from File"
            });
            this.controlText("load VTT/SRT from File");
        }
        handleClick() {
            this.player_.execute("loadSubtitlesFromFile", null);
        }
    }
    class SubtitlesFromURLMenuItem extends MenuItem {
        constructor(player) {
            super(player, {
                label: "load VTT/SRT from URL"
            });
            this.controlText("load VTT/SRT from URL");
        }
        handleClick() {
            this.player_.execute("loadSubtitlesFromURL", null);
        }
    }
    const Button = video_js_1.default.getComponent("button");
    registerComponent(Button, "vjsTheatreButton", () => {
        return React.createElement(TheatreButton, null);
    });
    registerComponent(Button, "vjsPatreonButton", () => {
        return React.createElement(PatreonButton, null);
    });
    registerComponent(Button, "vjsDownloadButton", (wrapper) => {
        return React.createElement(DownloadButton, { wrapper: wrapper });
    });
    function override(obj, method, createOverride) {
        let name = method.name;
        obj.prototype[name] = createOverride(obj.prototype[name]);
    }
    /*let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    override(resolutionMenuItem, resolutionMenuItem.prototype.createEl, function(method){
        return function(this: videojs.MenuItem, tagName?: string, properties?: any, attributes?: any) {

            let el = method.call(this, tagName, properties, attributes);
            let src = (this.options_ as any).src[0];
            let player = this.player_ as Player;
            ReactDOM.render(<MenuItemDownloadBtn src={src} player={player}/>, el);
            return el;
        };
    });*/
    let subsCapsMenuItem = video_js_1.default.getComponent("SubsCapsMenuItem");
    override(subsCapsMenuItem, subsCapsMenuItem.prototype.createEl, function (method) {
        return function (tagName, properties, attributes) {
            let btn = this;
            let track = btn.options_.track;
            let el = method.call(this, tagName, properties, attributes);
            if (track.language != "AddedFromUser") {
                let button = document.createElement("button");
                button.addEventListener("click", (event) => {
                    this.player().execute("downloadTrack", track.label);
                    event.stopPropagation();
                });
                el.appendChild(button);
            }
            return el;
        };
    });
    let subsCapsButton = video_js_1.default.getComponent("SubsCapsButton");
    override(subsCapsButton, subsCapsButton.prototype.createItems, function (method) {
        return function () {
            let items = method.call(this);
            items.splice(2, 0, new SubtitlesFromFileMenuItem(this.player_));
            items.splice(3, 0, new SubtitlesFromURLMenuItem(this.player_));
            return items;
        };
    });
}
exports.setup = setup;


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

/***/ 21:
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
    /*let observer = new MutationObserver(function(mutations) {
        if (isFrameActive() && getActiveFrame().iframe == iframe) {
            let newleft = Math.floor((window.innerWidth - iframe.clientWidth) / 2).toString() + "px";
            let newtop = Math.floor((window.innerHeight - iframe.clientHeight) / 2).toString() + "px";
            if (iframe.style.left != newleft) {
                iframe.style.setProperty("left", newleft);
                iframe.style.setProperty("top", newtop);
            }
        }

    });
    observer.observe(iframe, { attributes: true, attributeFilter: ["style"] });*/
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
    iframes.push({ shadow: shadow, iframe: iframe, observer: null });
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

/***/ 24:
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

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/9d1c349992b139988b754033a58af680.png";

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "/pages/assets/png/7c421760d6a070552343efa5e187257a.svg";

/***/ }),

/***/ 55:
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
const Tools = __webpack_require__(20);
const Messages = __webpack_require__(19);
const Environment = __webpack_require__(24);
const Storage = __webpack_require__(18);
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
exports.fireEvent = fireEvent;


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
const Tools = __webpack_require__(20);
const Messages = __webpack_require__(19);
const Environment = __webpack_require__(24);
const Storage = __webpack_require__(18);
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

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(66);
const video_js_1 = __webpack_require__(68);
console.log(video_js_1.default);
const Analytics = __webpack_require__(58);
const Page = __webpack_require__(21);
const Languages = __webpack_require__(55);
const Proxy = __webpack_require__(64);
const Metadata = __webpack_require__(135);
const ov_player_1 = __webpack_require__(136);
const React = __webpack_require__(6);
const ReactDOM = __webpack_require__(11);
Page.isReady().then(function () {
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
        video_js_1.default.addLanguage('en', { "The media could not be loaded, either because the server or network failed or because the format is not supported.": msg });
    });
    let videoData = Page.getUrlObj();
    ReactDOM.render(React.createElement(ov_player_1.OVPlayer, { videoData: videoData, isPopup: false }), document.body);
    document.title = videoData.title + " - OpenVideo";
    Analytics.fireEvent(videoData.origin.name, "HosterUsed", "");
});


/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(67);

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

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// Module
exports.push([module.i, "body {\n  overflow: hidden;\n  background: #000000;\n  padding: 0;\n  margin: 0;\n  width: 100vw;\n  height: 100vh; }\n", ""]);



/***/ }),

/***/ 71:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

/******/ });
//# sourceMappingURL=videoplay.js.map