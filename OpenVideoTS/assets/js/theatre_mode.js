var TheatreMode;
(function (TheatreMode) {
    let layerDiv = null;
    let iframeStyle = null;
    let currIframe = null;
    function enableTheaterMode(iframe) {
        currIframe = iframe;
        /*var width = iframe.offsetWidth;
        var height = iframe.offsetHeight;
        
        var left = (window.innerWidth - width)/2+"px !important";
        var top = (window.innerHeight - height)/2+"px !important";
        
        //iframe.style.cssText = "position:fixed !important; width:"+width+"px !important; height:"+height+"px !important; left:"+left+"; top:"+top+";";
        iframe.style.zIndex = "2147483647";
        if(window.getComputedStyle(iframe).position != "relative" && window.getComputedStyle(iframe).position != "absolute" && window.getComputedStyle(iframe).position != "fixed") {
            iframe.style.position = "relative";
        }*/
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
        console.log(width, height);
        for (var iframe of document.getElementsByTagName("iframe")) {
            if (Math.abs(iframe.clientWidth - width) <= 1 && Math.abs(iframe.clientHeight - height) <= 1) {
                return iframe;
            }
        }
        throw Error("Could not find iframe with dims [" + width + ", " + height + "]!");
    }
    OV.messages.addListener({
        setTheatreMode: function (data, sender, sendResponse) {
            var theatreFrame = getFrameByDims(data.frameWidth, data.frameHeight);
            console.log(theatreFrame);
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
        },
        getOVTextures: function (data, sender, sendResponse) {
            var ovTag = document.getElementsByTagName("openvideo")[0];
            //sendResponse({ color: ovTag.color, });
        }
    });
})(TheatreMode || (TheatreMode = {}));
//# sourceMappingURL=theatre_mode.js.map