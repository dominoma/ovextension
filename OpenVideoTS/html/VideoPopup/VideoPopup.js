var currentVideoHost = "";
function LoadVideo(popupData, index) {
    var videoData = popupData.videos[index];
    currentVideoHost = videoData.origin;
    if (!OVPlayer.getPlayer()) {
        OVPlayer.initPlayer('openVideo', { autoplay: popupData.autoplay }, videoData);
        OVPlayer.getPlayer().el().style.paddingTop = "unset";
    }
    else {
        OVPlayer.getPlayer().autoplay(!!popupData.autoplay);
        OVPlayer.getPlayer().setVideoData(videoData);
    }
    document.getElementById("currentVideo").innerText = OV.languages.getMsg("video_popup_video_bar_lbl", { "curr_vid": (index + 1).toString(), "vid_count": popupData.videos.length.toString() });
}
OV.page.isReady().then(function () {
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
            OVPlayer.getPlayer().play();
        }
    };
    document.getElementById("nextVideo").onclick = function () {
        if (currVideo + 1 < Hash.videos.length) {
            currVideo++;
            LoadVideo(Hash, currVideo);
            OVPlayer.getPlayer().play();
        }
    };
    document.getElementById("close").onclick = function () {
        OVPlayer.getPlayer().pause();
        VideoPopup.closePopup();
    };
});
//# sourceMappingURL=VideoPopup.js.map