var Background;
(function (Background) {
    function toTopWindow(msg) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTopWindow" } });
    }
    Background.toTopWindow = toTopWindow;
    function toActiveTab(msg) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toActiveTab" } });
    }
    Background.toActiveTab = toActiveTab;
    function toTab(msg) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTab", data: msg.query } });
    }
    Background.toTab = toTab;
    function openTab(url) {
        return OV.messages.send({ bgdata: { func: "openTab", data: { url: url } } });
    }
    Background.openTab = openTab;
    function pauseAllVideos() {
        return OV.messages.send({ bgdata: { func: "pauseAllVideos" } });
    }
    Background.pauseAllVideos = pauseAllVideos;
    function setIconPopup(url) {
        return OV.messages.send({ bgdata: { func: "setIconPopup", data: { url: url } } });
    }
    Background.setIconPopup = setIconPopup;
    function setIconText(text) {
        return OV.messages.send({ bgdata: { func: "setIconText", data: { text: text } } });
    }
    Background.setIconText = setIconText;
    function downloadFile(dl) {
        return OV.messages.send({ bgdata: { func: "setIconText", data: dl } });
    }
    Background.downloadFile = downloadFile;
    function analytics(data) {
        return OV.messages.send({ bgdata: { func: "analytics", data: data } });
    }
    Background.analytics = analytics;
    function redirectHosts() {
        return OV.messages.send({ bgdata: { func: "redirectHosts" } });
    }
    Background.redirectHosts = redirectHosts;
    function alert(msg) {
        return OV.messages.send({ bgdata: { func: "alert", data: { msg: msg } } });
    }
    Background.alert = alert;
    function prompt(data) {
        return OV.messages.send({ bgdata: { func: "prompt", data: data } });
    }
    Background.prompt = prompt;
    function setup() {
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
            analytics: function (msg, bgdata, sender, sendResponse) {
                OV.analytics.postData(bgdata);
            },
            redirectHosts: function (msg, bgdata, sender, sendResponse) {
                ScriptBase.getRedirectHosts().then(function (redirectHosts) {
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
            }
        });
    }
    Background.setup = setup;
})(Background || (Background = {}));
var TheatreMode;
(function (TheatreMode) {
    let layerDiv = null;
    let iframeStyle = null;
    let currIframe = null;
    function enableTheaterMode(iframe) {
        currIframe = iframe;
        if (iframeStyle == null) {
            iframeStyle = iframe.style.cssText;
        }
        OV.storage.sync.get("TheatreModeFrameWidth").then(function (frameWidth) {
            setFrameWidth(frameWidth == null ? 70 : frameWidth);
        });
        //iframe.className += " ov-theater-mode";
        if (layerDiv) {
            layerDiv.style.opacity = "1";
        }
        else {
            layerDiv = document.createElement("div");
            layerDiv.className = "ov-theaterMode";
            iframe.parentNode.appendChild(layerDiv);
            window.setTimeout(function () { layerDiv.style.opacity = "1"; }, 10);
        }
    }
    var currentFrameWidth = 0;
    function setFrameWidth(width) {
        width = width > 100 ? 100 : width;
        width = width < 50 ? 50 : width;
        currentFrameWidth = width;
        currIframe.style.cssText = "position: fixed !important;width: " + width + "vw !important;height: calc(( 9/ 16)*" + width + "vw) !important;top: calc((100vh - ( 9/ 16)*" + width + "vw)/2) !important;left: calc((100vw - " + width + "vw)/2) !important;z-index:2147483647 !important; border: 0px !important; max-width:100vw !important; min-width: 50vw !important; max-height: 100vh !important; min-height: 50vh !important";
    }
    function disableTheaterMode(iframe) {
        layerDiv.style.opacity = "0";
        window.setTimeout(function () {
            layerDiv.remove();
            layerDiv = null;
            iframe.style.cssText = iframeStyle;
        }, 150);
    }
    function getFrameByDims(width, height) {
        for (var iframe of document.getElementsByTagName("iframe")) {
            if (Math.abs(iframe.clientWidth - width) <= 1 && Math.abs(iframe.clientHeight - height) <= 1) {
                return iframe;
            }
        }
        throw Error("Could not find iframe with dims [" + width + ", " + height + "]!");
    }
    function setTheatreMode(data) {
        Background.toTopWindow({ data: data, func: "setTheatreMode" });
    }
    TheatreMode.setTheatreMode = setTheatreMode;
    function dragChanged(data) {
        Background.toTopWindow({ data: data, func: "theatreModeDragChanged" });
    }
    TheatreMode.dragChanged = dragChanged;
    function dragStopped() {
        Background.toTopWindow({ data: {}, func: "theatreModeDragStopped" });
    }
    TheatreMode.dragStopped = dragStopped;
    function setupIframe(data) {
        return Background.toTopWindow({ data: data, func: "setupIframe" }).then(function (response) {
            return { reload: response.data.reload };
        });
    }
    TheatreMode.setupIframe = setupIframe;
    function setup() {
        OV.messages.addListener({
            setTheatreMode: function (data, sender, sendResponse) {
                var theatreFrame = getFrameByDims(data.frameWidth, data.frameHeight);
                if (data.enabled) {
                    enableTheaterMode(theatreFrame);
                }
                else {
                    disableTheaterMode(theatreFrame);
                }
            },
            theatreModeDragChanged: function (data, sender, sendResponse) {
                var scaledChange = (data.dragChange / data.frameWidth) * 100;
                setFrameWidth(currentFrameWidth + scaledChange);
            },
            theatreModeDragStopped: function (data, sender, sendResponse) {
                OV.storage.sync.set("TheatreModeFrameWidth", currentFrameWidth);
            },
            setupIframe: function (data, sender, sendResponse) {
                var theatreFrame = getFrameByDims(data.frameWidth, data.frameHeight);
                if (theatreFrame && theatreFrame.hasAttribute("allow") && theatreFrame.getAttribute("allow").indexOf("fullscreen") != -1) {
                    theatreFrame.setAttribute("allow", theatreFrame.getAttribute("allow").replace("fullscreen", "").trim());
                    sendResponse({ reload: true });
                }
            }
        });
    }
    TheatreMode.setup = setup;
})(TheatreMode || (TheatreMode = {}));
var VideoPopup;
(function (VideoPopup) {
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
        var src = videoData.src;
        var videoListEntry = OV.array.search(src[0].src, videoArr, function (src, arrElem) {
            return arrElem.src[0].src == src;
        });
        if (videoListEntry == null) {
            videoArr.push(OV.object.merge(videoData, {
                title: document.title,
                origin: location.href
            }));
            newVideos++;
            if (!isPopupCreated()) {
                getPopupFrame().hidden = true;
                Background.setIconPopup();
            }
            setUnviewedVideos(newVideos);
            getPopupFrame().src = OV.environment.getVidPopupSiteUrl({
                videos: videoArr,
                options: { autoplay: _isPopupVisible() }
            });
        }
    }
    function setUnviewedVideos(count) {
        Background.setIconText((count || "").toString());
    }
    function pauseAllVideos() {
        Background.pauseAllVideos();
    }
    var firstpopup = true;
    function isPopupVisible() {
        if (OV.page.isFrame()) {
            return Background.toTopWindow({ data: {}, func: "isPopupVisible" }).then(function (response) {
                return response.data.visible;
            });
        }
        else {
            return Promise.resolve(_isPopupVisible());
        }
    }
    VideoPopup.isPopupVisible = isPopupVisible;
    function openPopup() {
        Background.toTopWindow({ data: {}, func: "openPopup" });
    }
    VideoPopup.openPopup = openPopup;
    function closePopup() {
        Background.toTopWindow({ data: {}, func: "closePopup" });
    }
    VideoPopup.closePopup = closePopup;
    function addVideoToPopup(videoData) {
        Background.toTopWindow({ data: { videoData: videoData }, func: "addVideoToPopup" });
    }
    VideoPopup.addVideoToPopup = addVideoToPopup;
    function setup() {
        OV.messages.addListener({
            isPopupVisible: function (data, sender, sendResponse) {
                sendResponse({ visible: _isPopupVisible() });
            },
            openPopup: function (data, sender, sendResponse) {
                getPopupFrame().hidden = false;
                if (firstpopup) {
                    getPopupFrame().src = getPopupFrame().src;
                    firstpopup = false;
                }
                pauseAllVideos();
                setUnviewedVideos(newVideos);
            },
            closePopup: function (data, sender, sendResponse) {
                document.getElementById("videoPopup").hidden = true;
                Background.setIconPopup();
                setUnviewedVideos(newVideos);
            },
            addVideoToPopup: function (data, sender, sendResponse) {
                _addVideoToPopup(data.videoData);
            }
        });
    }
    VideoPopup.setup = setup;
})(VideoPopup || (VideoPopup = {}));
//# sourceMappingURL=messages.js.map