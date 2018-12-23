namespace Background {
     type ToTab = chrome.tabs.QueryInfo;
    
    interface OpenTab {
        url: string;
    }
    
    interface SetIconPopup {
        url?: string;
    }
    
    interface SetIconText {
        text?: string;
    }
    
     interface DownloadFile {
        url: string;
        fileName: string;
    }
    
    interface Alert {
        msg: string;
    }
    
     interface Promt extends Alert {
        fieldText: string;
    }
    
    export function toTopWindow(msg : { data: any, func: string }) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTopWindow" } });
    }
    export function toActiveTab(msg : { data: any, func: string }) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toActiveTab" } });
    }
    export function toTab(msg : { data: any, func: string, query: ToTab }) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTab", data: msg.query } });
    }
    export function openTab(url: string) {
        return OV.messages.send({ bgdata: { func: "openTab", data: { url: url } } });
    }
    export function pauseAllVideos() {
        return OV.messages.send({ bgdata: { func: "pauseAllVideos" } });
    }
    export function setIconPopup(url?: string) {
        return OV.messages.send({ bgdata: { func: "setIconPopup", data: { url: url } } });
    }
    export function setIconText(text?: string) {
        return OV.messages.send({ bgdata: { func: "setIconText", data: { text: text } } });
    }
    export function downloadFile(dl: DownloadFile) {
        return OV.messages.send({ bgdata: { func: "setIconText", data: dl } });
    }
    export function analytics(data: StringMap) {
        return OV.messages.send({ bgdata: { func: "analytics", data: data } });
    }
    export function redirectHosts() {
        return OV.messages.send({ bgdata: { func: "redirectHosts" } });
    }
    export function alert(msg: string) {
        return OV.messages.send({ bgdata: { func: "alert", data: { msg: msg } } });
    }
    export function prompt(data: Promt) {
        return OV.messages.send({ bgdata: { func: "prompt", data: data } });
    }
    
    export function setup() {
        OV.messages.setupBackground({
            toTopWindow: function(msg, bgdata, sender, sendResponse) {
                var tabid = sender.tab.id;
                chrome.tabs.sendMessage(tabid, msg, function(resData){
                    sendResponse(resData);
                });
            },
            toActiveTab: function(msg, bgdata, sender, sendResponse) {
                var tabid = sender.tab.id;
                chrome.tabs.query({ active: true }, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, msg, function(resData){
                        sendResponse(resData);
                    });
                });
            },
            toTab: function(msg, bgdata : ToTab, sender, sendResponse) {
                var tabid = sender.tab.id;
                chrome.tabs.query(bgdata, function(tabs : chrome.tabs.Tab[]){
                    chrome.tabs.sendMessage(tabs[0].id, msg, function(resData){
                        sendResponse(resData);
                    });
                });
            },
            openTab: function(msg, bgdata : OpenTab, sender, sendResponse) {
                chrome.tabs.create({ url: bgdata.url });
            },
            pauseAllVideos: function(msg, bgdata, sender, sendResponse){
                chrome.tabs.sendMessage(sender.tab.id, {func: "pauseVideos"});
            },
            setIconPopup: function(msg, bgdata : SetIconPopup, sender, sendResponse){
                chrome.browserAction.setPopup({tabId: sender.tab.id, popup: (bgdata && bgdata.url) ? bgdata.url : ""});
            },
            setIconText: function(msg, bgdata : SetIconText, sender, sendResponse){
                chrome.browserAction.setBadgeText({text: (bgdata && bgdata.text) ? bgdata.text : "", tabId: sender.tab.id});
            },
            downloadFile: function(msg, bgdata : DownloadFile, sender, sendResponse){
                chrome.downloads.download({url: bgdata.url, saveAs: true, filename: bgdata.fileName });
            },
            analytics: function(msg, bgdata : StringMap, sender, sendResponse) {
                OV.analytics.postData(bgdata);
            },
            redirectHosts: function(msg, bgdata, sender, sendResponse) {
                ScriptBase.getRedirectHosts().then(function(redirectHosts){
                    sendResponse({redirectHosts: redirectHosts });
                });
            },
            alert: function(msg, bgdata : Alert, sender, sendResponse) {
                window.alert(bgdata.msg);
            },
            prompt: function(msg, bgdata : Promt, sender, sendResponse) {
                var value = window.prompt(bgdata.msg, bgdata.fieldText);

                if (value == null || value == "") {
                    sendResponse({ aborted: true, text: null });
                } else {
                    sendResponse({ aborted: false, text: value });
                }
            }
        });
    }
}
namespace TheatreMode {
    let layerDiv : HTMLDivElement = null;
    let iframeStyle : string = null;
    let currIframe : HTMLIFrameElement = null;
    function enableTheaterMode(iframe : HTMLIFrameElement) : void {
        currIframe = iframe;
        if(iframeStyle == null) {
            iframeStyle = iframe.style.cssText;
        }
        OV.storage.sync.get("TheatreModeFrameWidth").then(function(frameWidth){
            setFrameWidth(frameWidth == null ? 70 : frameWidth);
        });
        
        //iframe.className += " ov-theater-mode";
        if(layerDiv) {
            layerDiv.style.opacity = "1";
        }
        else {
            layerDiv = document.createElement("div");
            layerDiv.className = "ov-theaterMode";
            iframe.parentNode.appendChild(layerDiv);
            window.setTimeout(function(){layerDiv.style.opacity = "1";}, 10);
        }
    }
    var currentFrameWidth = 0;
    function setFrameWidth(width : number) : void {
        width = width > 100 ? 100 : width;
        width = width < 50 ? 50 : width;
        currentFrameWidth = width;
        currIframe.style.cssText = "position: fixed !important;width: "+width+"vw !important;height: calc(( 9/ 16)*"+width+"vw) !important;top: calc((100vh - ( 9/ 16)*"+width+"vw)/2) !important;left: calc((100vw - "+width+"vw)/2) !important;z-index:2147483647 !important; border: 0px !important; max-width:100vw !important; min-width: 50vw !important; max-height: 100vh !important; min-height: 50vh !important";
    }
    function disableTheaterMode(iframe : HTMLIFrameElement) : void {
        layerDiv.style.opacity = "0";
        window.setTimeout(function(){
            layerDiv.remove();
            layerDiv = null;
            iframe.style.cssText = iframeStyle
        }, 150);
    }
    function getFrameByDims(width : number, height : number) : HTMLIFrameElement {
       
        for(var iframe of document.getElementsByTagName("iframe")) {
            if(Math.abs(iframe.clientWidth - width) <= 1 && Math.abs(iframe.clientHeight - height) <= 1) {
                return iframe;
            }
        }
        throw Error("Could not find iframe with dims ["+width+", "+height+"]!");
    }  
    export interface SetupIFrame {
        frameWidth: number;
        frameHeight: number;
    }
    export interface SetTheatreMode extends SetupIFrame {
        enabled: boolean;
    }
    export interface DragTheatreMode {
        frameWidth: number;
        dragChange: number;
    }
    export function setTheatreMode(data : SetTheatreMode) {
        Background.toTopWindow({ data: data, func: "setTheatreMode"});
    }
    export function dragChanged(data : DragTheatreMode) {
        Background.toTopWindow({ data: data, func: "theatreModeDragChanged"});
    }
    export function dragStopped() {
        Background.toTopWindow({ data: {}, func: "theatreModeDragStopped"});
    }
    export function setupIframe(data : SetupIFrame) {
        return Background.toTopWindow({ data: data, func: "setupIframe"}).then(function(response){
            return { reload: response.data.reload };
        });
    }
    export function setup() {
        OV.messages.addListener({
            setTheatreMode: function(data : SetTheatreMode, sender, sendResponse) {
                var theatreFrame = getFrameByDims(data.frameWidth, data.frameHeight);
               
                if(data.enabled) {
                    enableTheaterMode(theatreFrame);
                }
                else {
                    disableTheaterMode(theatreFrame);
                }
            },
            theatreModeDragChanged: function(data : DragTheatreMode, sender, sendResponse) {
                var scaledChange = (data.dragChange / data.frameWidth) * 100;
                setFrameWidth(currentFrameWidth + scaledChange);
            },
            theatreModeDragStopped: function(data, sender, sendResponse) {
                OV.storage.sync.set("TheatreModeFrameWidth", currentFrameWidth);
            },
            setupIframe: function(data : SetupIFrame, sender, sendResponse) {
                var theatreFrame = getFrameByDims(data.frameWidth, data.frameHeight);
                if(theatreFrame && theatreFrame.hasAttribute("allow") && theatreFrame.getAttribute("allow").indexOf("fullscreen") != -1) {
                    theatreFrame.setAttribute("allow", theatreFrame.getAttribute("allow").replace("fullscreen", "").trim());
                    sendResponse({reload: true});
                }
            }
        });
    }
    
}
namespace VideoPopup {
    let videoArr : Array<VideoTypes.VideoData> = [];
    let newVideos = 0;
    function getPopupFrame() : HTMLIFrameElement {
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
    function _isPopupVisible() : boolean {
        return isPopupCreated() && !getPopupFrame().hidden;
    }
    function isPopupCreated() : boolean{
        return document.getElementById("videoPopup") != undefined;
    }
    function _addVideoToPopup(videoData : VideoTypes.VideoData) {
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
                Background.setIconPopup();
               
            }
            setUnviewedVideos(newVideos);
            getPopupFrame().src = OV.environment.getVidPopupSiteUrl({ 
                videos: videoArr,
                options: {autoplay: _isPopupVisible()}
            });
        }   
    }
    function setUnviewedVideos(count : number) {
        Background.setIconText((count || "").toString());    
    }
    function pauseAllVideos() {
        Background.pauseAllVideos();
    }
    var firstpopup = true;
    interface AddVideoToPopup {
        videoData: VideoTypes.VideoData;
    }
    export function isPopupVisible() : Promise<boolean> {
        if(OV.page.isFrame()) {
            return Background.toTopWindow({ data: {}, func: "isPopupVisible" }).then(function(response){
                return response.data.visible;
            });
        }
        else {
            return Promise.resolve(_isPopupVisible());
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
        OV.messages.addListener({
            isPopupVisible: function(data, sender, sendResponse){
                sendResponse({ visible: _isPopupVisible() });
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
                Background.setIconPopup();
                setUnviewedVideos(newVideos);
            },
            addVideoToPopup: function(data : AddVideoToPopup, sender, sendResponse) {
                _addVideoToPopup(data.videoData);
            }
        });
    }
}