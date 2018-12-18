namespace VideoPopup {
    let videoArr : Array<VideoTypes.VideoData> = [];
    let newVideos = 0;
    export function getPopupFrame() : HTMLIFrameElement {
        let frame : HTMLIFrameElement = document.getElementById("videoPopup") as HTMLIFrameElement;
        if(frame == undefined) {
            frame = document.createElement("iframe") as HTMLIFrameElement;
            frame.id = "videoPopup";
            frame.allowFullscreen = true;
            frame.className = "ov-popupFrame";
            document.body.appendChild(frame);
        }
        return frame;
    }
    export function isPopupVisible() : boolean {
        return isPopupCreated() && !getPopupFrame().hidden;
    }
    export function isPopupCreated() : boolean{
        return document.getElementById("videoPopup") != undefined;
    }
    function addVideoToPopup(videoData : VideoTypes.VideoData) {
        var src = videoData.src;   
        var videoListEntry = OV.array.search(src[0].src, videoArr, function(src, arrElem){
            return arrElem.src[0].src == src;
        });
        if(videoListEntry == null){
            videoArr.push(OV.object.merge(videoData,{
                title: document.title,
                origin: location.href
            }));
            newVideos++;
            if(!isPopupCreated()) {                 
                getPopupFrame().hidden = true;
                OV.messages.send({ bgdata: { func: "setIconPopup" } })
            }
            setUnviewedVideos(newVideos);
            getPopupFrame().src = OV.environment.getVidPopupSiteUrl({ 
                videos: videoArr,
                options: {autoplay: isPopupVisible()}
            });
        }   
    }
    function setUnviewedVideos(count : number) {
        OV.messages.send({ bgdata: { func: "setIconText", data: { text: count == 0 ? "" : count.toString() } as Background.SetIconText } });
    }
    function pauseAllVideos() {
        OV.messages.send({ bgdata: { func: "pauseAllVideos" } });
    }
    var firstpopup = true;
    export interface AddVideoToPopup {
        videoData: VideoTypes.VideoData;
    }
    OV.messages.addListener({
        isPopupVisible: function(data, sender, sendResponse){
            sendResponse({ visible: isPopupVisible() });
        },
        openPopup: function(data, sender, sendResponse) {
            getPopupFrame().hidden = false;
            if(firstpopup) {
                getPopupFrame().src = getPopupFrame().src;
                firstpopup = false;
            }
            pauseAllVideos();
            setUnviewedVideos(newVideos);
        },
        closePopup: function(data, sender, sendResponse) {
            document.getElementById("videoPopup").hidden = true;
            OV.messages.send({ bgdata: { func: "setIconPopup" } })
            setUnviewedVideos(newVideos);
        },
        addVideoToPopup: function(data : AddVideoToPopup, sender, sendResponse) {
            addVideoToPopup(data.videoData);
        }
    });
}