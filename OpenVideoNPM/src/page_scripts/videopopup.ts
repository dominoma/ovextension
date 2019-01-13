import * as Page from "OV/page";
import * as Languages from "OV/languages";
import * as Messages from "OV/messages";

import * as VideoPopup from "Messages/videopopup";

import * as VideoTypes from "video_types";
import * as OVPlayer from "ov_player";
var currentVideoHost = "";

interface PopupData {
    videos: VideoTypes.VideoData[];
    autoplay: boolean;
}
function LoadVideo(popupData: PopupData, index: number) {
    var videoData = popupData.videos[index];
    currentVideoHost = videoData.origin;
    if (!OVPlayer.getPlayer()) {
        OVPlayer.initPlayer('openVideo', { autoplay: popupData.autoplay }, videoData);
        (OVPlayer.getPlayer().el() as HTMLDivElement).style.paddingTop = "unset";
    }
    else {
        OVPlayer.getPlayer().autoplay(!!popupData.autoplay);
        OVPlayer.getPlayer().setVideoData(videoData);
    }
    document.getElementById("currentVideo").innerText = Languages.getMsg("video_popup_video_bar_lbl", { "curr_vid": (index + 1).toString(), "vid_count": popupData.videos.length.toString() })
}
Page.isReady().then(function() {

    document.getElementById("title").innerText = Languages.getMsg("video_popup_msg_lbl");
    document.getElementById("js_err_msg").innerText = Languages.getMsg("video_player_js_err_msg");

    var Hash = Page.getUrlObj() as PopupData;
    var currVideo = 0;
    LoadVideo(Hash, currVideo);

    window.onhashchange = function() {
        Hash = Page.getUrlObj();
        document.getElementById("currentVideo").innerText = "Video " + (currVideo + 1) + " of " + Hash.videos.length;
    }
    document.getElementById("prevVideo").onclick = function() {
        if (currVideo - 1 >= 0) {
            currVideo--;
            LoadVideo(Hash, currVideo);
            OVPlayer.getPlayer().play();
        }
    }
    document.getElementById("nextVideo").onclick = function() {
        if (currVideo + 1 < Hash.videos.length) {
            currVideo++;
            LoadVideo(Hash, currVideo);
            OVPlayer.getPlayer().play();
        }
    }
    document.getElementById("close").onclick = function() {
        OVPlayer.getPlayer().pause();
        VideoPopup.closePopup();
    };
});