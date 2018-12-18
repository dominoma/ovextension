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
    VideoPopup.getPopupFrame = getPopupFrame;
    function isPopupVisible() {
        return isPopupCreated() && !getPopupFrame().hidden;
    }
    VideoPopup.isPopupVisible = isPopupVisible;
    function isPopupCreated() {
        return document.getElementById("videoPopup") != undefined;
    }
    VideoPopup.isPopupCreated = isPopupCreated;
    function addVideoToPopup(videoData) {
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
                OV.messages.send({ bgdata: { func: "setIconPopup" } });
            }
            setUnviewedVideos(newVideos);
            getPopupFrame().src = OV.environment.getVidPopupSiteUrl({
                videos: videoArr,
                options: { autoplay: isPopupVisible() }
            });
        }
    }
    function setUnviewedVideos(count) {
        OV.messages.send({ bgdata: { func: "setIconText", data: { text: count == 0 ? "" : count.toString() } } });
    }
    function pauseAllVideos() {
        OV.messages.send({ bgdata: { func: "pauseAllVideos" } });
    }
    var firstpopup = true;
    OV.messages.addListener({
        isPopupVisible: function (data, sender, sendResponse) {
            sendResponse({ visible: isPopupVisible() });
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
            OV.messages.send({ bgdata: { func: "setIconPopup" } });
            setUnviewedVideos(newVideos);
        },
        addVideoToPopup: function (data, sender, sendResponse) {
            addVideoToPopup(data.videoData);
        }
    });
})(VideoPopup || (VideoPopup = {}));
//# sourceMappingURL=video_popup.js.map