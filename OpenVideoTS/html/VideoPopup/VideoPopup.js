var Player = null;
var currentVideoHost = "";
window["Worker"] = undefined;
OV.messages.setupMiddleware();
OV.page.wrapType(XMLHttpRequest, {
    open: {
        get: function (target) {
            return function (method, url) {
                if (Player && Player.currentType().indexOf("application/") != -1 && url.indexOf("OVreferer") == -1) {
                    arguments[1] = url + (url.indexOf("?") == -1 ? "?" : "&") + "OVreferer=" + encodeURIComponent(btoa(currentVideoHost));
                    arguments[1] = url;
                }
                target.open.apply(target, arguments);
            };
        }
    }
});
function LoadVideo(popupData, index) {
    var videoData = popupData.videos[index];
    currentVideoHost = videoData.origin;
    if (!Player) {
        Player = OVPlayer.initPlayer('openVideo', { autoplay: popupData.autoplay }, videoData);
    }
    else {
        Player.autoplay(!!popupData.autoplay);
        Player.setVideoData(videoData);
    }
    document.getElementById("currentVideo").innerText = OV.languages.getMsg("video_popup_video_bar_lbl", { "curr_vid": (index + 1).toString(), "vid_count": popupData.videos.length.toString() });
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("title").innerText = OV.languages.getMsg("video_popup_msg_lbl");
    document.getElementById("js_err_msg").innerText = OV.languages.getMsg("video_player_js_err_msg");
    var Hash = OV.page.getUrlObj();
    var currVideo = 0;
    LoadVideo(Hash, currVideo);
    window.onhashchange = function () {
        Hash = OV.page.getUrlObj();
        document.getElementById("currentVideo").innerText = "Video " + (currVideo + 1) + " of " + Hash.videos.length;
    };
    document.getElementById("prevVideo").onclick = function () {
        if (currVideo - 1 >= 0) {
            currVideo--;
            LoadVideo(Hash, currVideo);
            Player.play();
        }
    };
    document.getElementById("nextVideo").onclick = function () {
        if (currVideo + 1 < Hash.videos.length) {
            currVideo++;
            LoadVideo(Hash, currVideo);
            Player.play();
        }
    };
    document.getElementById("close").onclick = function () {
        Player.pause();
        VideoPopup.closePopup();
    };
});
//# sourceMappingURL=VideoPopup.js.map