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
function _addVideoToPopup(videoData: VideoTypes.VideoData) {
    let src = videoData.src;
    let videoListEntry = videoArr.find(function(arrElem) {
        return arrElem.src[0].src == src[0].src;
    });
    if (videoListEntry == null) {
        videoArr.push(Tools.merge(videoData, {
            title: document.title,
            origin: location.href
        }));
        newVideos++;
        if (!isPopupCreated()) {
            getPopupFrame().hidden = true;
            getPopupFrame().style.setProperty("display", "none", "important");
            Background.setIconPopup();

        }
        setUnviewedVideos(newVideos);
        getPopupFrame().src = Environment.getVidPopupSiteUrl({
            videos: videoArr,
            options: { autoplay: _isPopupVisible() }
        });
    }
}
function setUnviewedVideos(count: number) {
    Background.setIconText((count || "").toString());
}
function pauseAllVideos() {
    Background.pauseAllVideos();
}
var firstpopup = true;
export async function isPopupVisible(): Promise<boolean> {
    if (Page.isFrame()) {
        let response = await Background.toTopWindow({ data: {}, func: "isPopupVisible" });
        return response.data.visible;
    }
    else {
        return _isPopupVisible();
    }
}
export function openPopup() {
    Background.toTopWindow({ data: {}, func: "openPopup" });
}
export function closePopup() {
    Background.toTopWindow({ data: {}, func: "closePopup" });
}
export function addVideoToPopup(videoData: VideoTypes.VideoData) {
    Background.toTopWindow({ data: { videoData: videoData }, func: "addVideoToPopup" });
}
export function setup() {
    Messages.addListener({
        isPopupVisible: function(request, sendResponse) {
            sendResponse({ visible: _isPopupVisible() });
        },
        openPopup: function(request, sendResponse) {
            getPopupFrame().hidden = false;
            getPopupFrame().style.removeProperty("display");
            if (firstpopup) {
                getPopupFrame().src = getPopupFrame().src;
                firstpopup = false;
            }
            pauseAllVideos();
            setUnviewedVideos(newVideos);
        },
        closePopup: function(request, sendResponse) {
            document.getElementById("videoPopup").hidden = true;
            getPopupFrame().style.setProperty("display", "none", "important");
            Background.setIconPopup();
            setUnviewedVideos(newVideos);
        },
        addVideoToPopup: function(request, sendResponse) {
            _addVideoToPopup(VideoTypes.makeURLsSave(request.data.videoData));
        }
    });
}
