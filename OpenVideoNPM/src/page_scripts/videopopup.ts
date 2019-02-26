import * as Page from "OV/page";
import * as Languages from "OV/languages";

import * as VideoPopup from "Messages/videopopup";

import * as VideoTypes from "video_types";
import * as OVPlayer from "ov_player";
import * as Background from "Messages/background";

interface PopupData {
    videos: VideoTypes.VideoData[];
    autoplay: boolean;
}
class VideoPlaylist {
    private currentVideo_ = 0;
    private popupData_ : PopupData | null = null;

    constructor(popupData : PopupData) {
        this.popupData = popupData;
        this.loadVideo(0);
    }
    get popupData() {
        return this.popupData_!;
    }
    set popupData(popupData: PopupData) {
        this.popupData_ = popupData;
        this.update();
    }
    private loadVideo(index : number) {
        if(index >= this.popupData.videos.length) {
            index = this.popupData.videos.length - 1;
        }
        else if(index < 0) {
            index = 0;
        }
        this.currentVideo_ = index;
        if(this.popupData.videos.length == 0) {
            this.currentVideo_ = -1;
        }
        else {
            if (!OVPlayer.isInitialized()) {
                OVPlayer.initPlayer('openVideo', { autoplay: this.popupData.autoplay }, this.popupData.videos[index]);
                let this_ = this;
                OVPlayer.getPlayer().on("error", function(){
                    if(OVPlayer.getPlayer().currentTime() == 0) {
                        this_.removeVideo(this_.currentVideo_);
                    }
                });
                (OVPlayer.getPlayer().el() as HTMLDivElement).style.paddingTop = "unset";
            }
            else {
                OVPlayer.getPlayer().autoplay(!!this.popupData.autoplay);
                OVPlayer.getPlayer().setVideoData(this.popupData.videos[index]);
            }
        }
        this.update();
    }
    private removeVideo(index : number) {
        this.popupData.videos.splice(index, 1);
        console.log("video deleted!");
        if(this.popupData.videos[index]) {
            OVPlayer.getPlayer().setVideoData(this.popupData.videos[index]);
        }
        this.loadVideo(index);
    }
    private update() {
        Background.setIconText((this.popupData.videos.length || "").toString());
        if(this.popupData.videos.length == 0) {
            Background.setIconPopup("pages/popupmenu/popupmenu.html");
        }
        else {
            Background.setIconPopup();
        }
        document.getElementById("currentVideo")!.innerText = Languages.getMsg("video_popup_video_bar_lbl", { "curr_vid": (this.currentVideo_ + 1).toString(), "vid_count": this.popupData.videos.length.toString() });
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
Page.isReady().then(function() {

    document.getElementById("title")!.innerText = Languages.getMsg("video_popup_msg_lbl");
    document.getElementById("js_err_msg")!.innerText = Languages.getMsg("video_player_js_err_msg");

    let playlist = new VideoPlaylist(Page.getUrlObj() as PopupData);

    document.getElementById("prevVideo")!.onclick = function() {
        playlist.prevVideo();
    }
    document.getElementById("nextVideo")!.onclick = function() {
        playlist.nextVideo();
    }
    document.getElementById("close")!.onclick = function() {
        OVPlayer.getPlayer().pause();
        VideoPopup.closePopup();
    };
});
