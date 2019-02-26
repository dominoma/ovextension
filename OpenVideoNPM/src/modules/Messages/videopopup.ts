import * as VideoTypes from "./../video_types";

import * as Tools from "./../OV/tools";
import * as Messages from "./../OV/messages";
import * as Environment from "./../OV/environment";
import * as Page from "./../OV/page";

import * as Background from "./background";

let videoArr: Array<VideoTypes.VideoData> = [];
let newVideos = 0;
function getPopupFrame(): HTMLIFrameElement {
    let frame: HTMLIFrameElement = document.getElementById("videoPopup") as HTMLIFrameElement;
    if (frame == undefined) {
        frame = document.createElement("iframe") as HTMLIFrameElement;
        frame.id = "videoPopup";
        frame.allowFullscreen = true;
        frame.className = "ov-popupFrame";
        document.body.appendChild(frame);
    }
    return frame;
}
function _isPopupVisible(): boolean {
    return isPopupCreated() && !getPopupFrame().hidden;
}
function isPopupCreated(): boolean {
    return document.getElementById("videoPopup") != undefined;
}
function _addVideoToPopup(videoData: VideoTypes.RawVideoData) {
    let src = videoData.src;
    let videoListEntry = videoArr.find(function(arrElem) {
        return arrElem.src[0].src == src[0].src;
    });
    if (videoListEntry == null) {
        videoArr.push(Tools.merge(videoData, {
            title: document.title,
            origin: location.href,
            host: "Popup"
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
}
export function setupCS() {
    Messages.addListener({
        videopopup_pauseAllVideos: async function() {
            for (let video of document.getElementsByTagName("video")) {
                video.pause();
            };
        }
    });
}
export async function pauseAllVideos() {
    return Background.toTopWindow({ data: null, func: "videopopup_pauseAllVideos", frameId: -1 });
}
var firstpopup = true;
export async function isPopupVisible() {
    if (Page.isFrame()) {
        let response = await Background.toTopWindow({ data: {}, func: "videopopup_isPopupVisible" });
        return response.data.visible;
    }
    else {
        return _isPopupVisible();
    }
}
export function openPopup() {
    Background.toTopWindow({ data: {}, func: "videopopup_openPopup" });
}
export function closePopup() {
    Background.toTopWindow({ data: {}, func: "videopopup_closePopup" });
}
export function addVideoToPopup(videoData: VideoTypes.RawVideoData) {
    console.log(videoData);
    Background.toTopWindow({ data: { videoData: VideoTypes.makeURLsSave(videoData) }, func: "videopopup_addVideoToPopup" });
}
export function setup() {
    Messages.addListener({
        videopopup_isPopupVisible: async function(request) {
            return { visible: _isPopupVisible() };
        },
        videopopup_openPopup: async function(request) {
            getPopupFrame().hidden = false;
            getPopupFrame().style.removeProperty("display");
            if (firstpopup) {
                getPopupFrame().src = getPopupFrame().src;
                firstpopup = false;
            }
            pauseAllVideos();
        },
        videopopup_closePopup: async function(request) {
            if(!isPopupCreated()) {
                throw Error("Can't close popop. Popup doesn't exist!")
            }
            getPopupFrame().hidden = true;
            getPopupFrame().style.setProperty("display", "none", "important");
            Background.setIconPopup();
        },
        videopopup_addVideoToPopup: async function(request) {
            _addVideoToPopup(request.data.videoData);
        }
    });
}
