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
/******/ 	return __webpack_require__(__webpack_require__.s = 154);
/******/ })
/************************************************************************/
/******/ ({

/***/ 149:
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
const Tools = __webpack_require__(20);
const Messages = __webpack_require__(19);
const Environment = __webpack_require__(24);
const Page = __webpack_require__(21);
const Background = __webpack_require__(23);
const VideoHistory = __webpack_require__(25);
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
    return __awaiter(this, void 0, void 0, function* () {
        let src = videoData.src;
        let origin = yield VideoHistory.getPageRefData();
        let videoListEntry = videoArr.find(function (arrElem) {
            return arrElem.src[0].src == src[0].src;
        });
        if (videoListEntry == null) {
            videoArr.push(Tools.merge(videoData, {
                title: document.title,
                origin: origin,
                parent: {
                    url: "POPUP",
                    name: "POPUP",
                    icon: "POPUP"
                }
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
    });
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
                setIconOpensPopup(false);
            });
        },
        videopopup_closePopup: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isPopupCreated()) {
                    throw Error("Can't close popop. Popup doesn't exist!");
                }
                getPopupFrame().hidden = true;
                getPopupFrame().style.setProperty("display", "none", "important");
                setIconOpensPopup(true);
            });
        },
        videopopup_addVideoToPopup: function (request) {
            return __awaiter(this, void 0, void 0, function* () {
                _addVideoToPopup(request.data.videoData);
                setIconOpensPopup(true);
            });
        }
    });
}
exports.setup = setup;
function setIconOpensPopup(openpopup) {
    if (openpopup) {
        Background.setIconPopup();
    }
    else {
        Background.setIconPopup("pages/popupmenu.html");
    }
}
exports.setIconOpensPopup = setIconOpensPopup;


/***/ }),

/***/ 151:
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
const ScriptBase = __webpack_require__(56);
const Analytics = __webpack_require__(58);
const Page = __webpack_require__(21);
const Tools = __webpack_require__(20);
const Environment = __webpack_require__(24);
function suspectSubtitledVideo(details, xhr) {
    if (xhr.response.match(/(<track[^>]*src=|\.vtt|"?tracks"?: \[\{)/)) {
        Analytics.fireEvent(details.hostname, "TracksFound", details.url);
    }
}
function getHTML() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            if (document.readyState == "interactive" || document.readyState == "complete") {
                resolve(document.documentElement.innerHTML);
            }
            else {
                document.addEventListener('readystatechange', function one(event) {
                    if (document.readyState == "interactive" || document.readyState == "complete") {
                        document.removeEventListener('readystatechange', one);
                        resolve(document.documentElement.innerHTML);
                    }
                });
            }
        });
    });
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
                                    details.url = details.url.replace(/(openload|oload)\.[^\/,^\.]{2,}/, "oload.services");
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
                                                + Tools.parseURL(details.url).host
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
                                //details.url = details.url.replace(/(streamango|fruitstreams|streamcherry|fruitadblock|fruithosts)\.[^\/,^\.]{2,}/, "streamango.com").replace(/\/f\//, "/embed/");
                                //stopExecution();
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
                                console.log("w0");
                                yield Page.isReady();
                                console.log("w1");
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
                                                    resolve({
                                                        src: [{
                                                                type: "video/mp4",
                                                                src: src,
                                                                label: "SD"
                                                            }],
                                                        title: title,
                                                        poster: poster,
                                                        tracks: []
                                                    });
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


/***/ }),

/***/ 154:
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
const ScriptBase = __webpack_require__(56);
const Storage = __webpack_require__(18);
const RedirectScripts = __webpack_require__(151);
const TheatreMode = __webpack_require__(22);
const Proxy = __webpack_require__(64);
const Page = __webpack_require__(21);
const VideoPopup = __webpack_require__(149);
RedirectScripts.install();
ScriptBase.startScripts("document_end" /* document_end */, function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (Page.isFrame()) {
            TheatreMode.setupIframe();
        }
    });
}, function (videoData) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Proxy.addHostsfromVideos(videoData);
    });
});
Storage.isVideoSearchEnabled().then(function (value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (value) {
            VideoPopup.setupCS();
            yield Page.injectScript("../pages/assets/js/vendors");
            yield Page.injectScript("search_videos");
        }
    });
});


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
const Tools = __webpack_require__(20);
const Analytics = __webpack_require__(58);
const Environment = __webpack_require__(24);
const Messages = __webpack_require__(19);
const Storage = __webpack_require__(18);
const VideoHistory = __webpack_require__(25);
const Page = __webpack_require__(21);
let redirectHosts = [];
;
;
function addRedirectHost(redirectHost) {
    redirectHosts.push(redirectHost);
}
exports.addRedirectHost = addRedirectHost;
function isUrlRedirecting(url) {
    if (Tools.parseURL(url).query["ovignore"] != "true") {
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
function getFavicon() {
    let link = document.documentElement.innerHTML.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
    if (link) {
        let favicon = link[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
        if (favicon) {
            return favicon[1];
        }
    }
    return "https://s2.googleusercontent.com/s2/favicons?domain_url=" + location.host;
}
function startScripts(scope, onScriptExecute, onScriptExecuted) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Tools.parseURL(location.href).query["ovignore"] != "true") {
            for (let host of redirectHosts) {
                for (let script of host.scripts) {
                    let match = location.href.match(script.urlPattern);
                    if (match) {
                        let isEnabled = yield Storage.isScriptEnabled(host.name);
                        if (isEnabled) {
                            console.log("Redirect with " + host.name);
                            for (let runScope of script.runScopes) {
                                if (runScope.run_at == scope) {
                                    document.documentElement.hidden = runScope.hide_page !== false;
                                    try {
                                        yield onScriptExecute();
                                        console.log("script executed");
                                        let rawVideoData = yield runScope.script({ url: location.href, match: match, hostname: host.name, run_scope: runScope.run_at });
                                        let parent = null;
                                        console.log(Page.isFrame());
                                        if (Page.isFrame()) {
                                            parent = yield VideoHistory.getPageRefData();
                                        }
                                        let videoData = Tools.merge(rawVideoData, {
                                            origin: {
                                                name: host.name,
                                                url: location.href,
                                                icon: getFavicon()
                                            },
                                            parent: parent
                                        });
                                        videoData = VideoTypes.makeURLsSave(videoData);
                                        yield onScriptExecuted(videoData);
                                        console.log("script executed", videoData);
                                        location.replace(Environment.getVidPlaySiteUrl(videoData));
                                    }
                                    catch (error) {
                                        document.documentElement.hidden = false;
                                        console.error(error);
                                        Analytics.fireEvent(host.name, "Error", JSON.stringify(Environment.getErrorMsg({ msg: error.message, url: location.href, stack: error.stack })));
                                    }
                                    ;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}
exports.startScripts = startScripts;
function setupBG() {
    return __awaiter(this, void 0, void 0, function* () {
        Messages.setupBackground({
            redirect_script_base_getRedirectHosts: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    return redirectHosts;
                });
            }
        });
    });
}
exports.setupBG = setupBG;
function getRedirectHosts() {
    return __awaiter(this, void 0, void 0, function* () {
        if (Environment.isBackgroundScript()) {
            console.log(redirectHosts);
            return redirectHosts;
        }
        else {
            let response = yield Messages.sendToBG({ func: "redirect_script_base_getRedirectHosts", data: {} });
            console.log(response);
            return response.data;
        }
    });
}
exports.getRedirectHosts = getRedirectHosts;


/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Page = __webpack_require__(21);
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


/***/ })

/******/ });
//# sourceMappingURL=document_end.js.map