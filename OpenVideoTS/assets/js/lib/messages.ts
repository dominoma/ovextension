namespace Background {

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

    export function toTopWindow(msg: { data: any, func: string }) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTopWindow", data: {} } });
    }
    export function toActiveTab(msg: { data: any, func: string }) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toActiveTab", data: {} } });
    }
    export function toTab(msg: { data: any, func: string, query: chrome.tabs.QueryInfo }) {
        return OV.messages.send({ data: msg.data, func: msg.func, bgdata: { func: "toTab", data: msg.query } });
    }
    export function openTab(url: string) {
        return OV.messages.send({ bgdata: { func: "openTab", data: { url: url } } });
    }
    export function pauseAllVideos() {
        return OV.messages.send({ bgdata: { func: "pauseAllVideos", data: {} } });
    }
    export function setIconPopup(url?: string) {
        return OV.messages.send({ bgdata: { func: "setIconPopup", data: { url: url } } });
    }
    export function setIconText(text?: string) {
        return OV.messages.send({ bgdata: { func: "setIconText", data: { text: text } } });
    }
    export function downloadFile(dl: DownloadFile) {
        return OV.messages.send({ bgdata: { func: "downloadFile", data: dl } });
    }
    export function analytics(data: StringMap) {
        return OV.messages.send({ bgdata: { func: "analytics", data: data } });
    }
    export function redirectHosts() {
        return OV.messages.send({ bgdata: { func: "redirectHosts", data: {} } });
    }
    export function alert(msg: string) {
        OV.messages.send({ bgdata: { func: "alert", data: { msg: msg } } });
    }
    export function prompt(data: Promt) {
        return OV.messages.send({ bgdata: { func: "prompt", data: data } }).then(function(response) {
            return { aborted: response.data.aborted, text: response.data.text };
        });
    }
    export function sendMessage(tabid: number, msg: { func: string; data: any; }) {
        return new Promise(function(response, reject) {
            chrome.tabs.sendMessage(tabid, {
                func: msg.func,
                data: msg.data,
                state: OV.messages.State.BGToMdw,
                sender: { url: location.href },
            } as OV.messages.Request, {
                    frameId: 0
                }, function(resData: OV.messages.Response) {
                    response(resData);
                });
        });
    }

    export function setup() {
        OV.messages.setupBackground({
            toTopWindow: function(msg, bgdata, sender, sendResponse) {
                var tabid = sender.tab.id;
                chrome.tabs.sendMessage(tabid, msg, { frameId: 0 }, function(resData: OV.messages.Response) {

                    sendResponse(resData.data);

                });
            },
            toActiveTab: function(msg, bgdata, sender, sendResponse) {
                var tabid = sender.tab.id;
                chrome.tabs.query({ active: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, msg, { frameId: 0 }, function(resData: OV.messages.Response) {
                        if (resData) {
                            sendResponse(resData.data);
                        }
                    });
                });
            },
            toTab: function(msg, bgdata, sender, sendResponse) {
                var tabid = sender.tab.id;
                chrome.tabs.query(bgdata, function(tabs: chrome.tabs.Tab[]) {
                    chrome.tabs.sendMessage(tabs[0].id, msg, function(resData: OV.messages.Response) {
                        if (resData) {
                            sendResponse(resData.data);
                        }
                    });
                });
            },
            openTab: function(msg, bgdata: OpenTab, sender, sendResponse) {
                chrome.tabs.create({ url: bgdata.url });
            },
            pauseAllVideos: function(msg, bgdata, sender, sendResponse) {
                chrome.tabs.sendMessage(sender.tab.id, { func: "pauseVideos" });
            },
            setIconPopup: function(msg, bgdata: SetIconPopup, sender, sendResponse) {
                chrome.browserAction.setPopup({ tabId: sender.tab.id, popup: (bgdata && bgdata.url) ? bgdata.url : "" });
            },
            setIconText: function(msg, bgdata: SetIconText, sender, sendResponse) {
                chrome.browserAction.setBadgeText({ text: (bgdata && bgdata.text) ? bgdata.text : "", tabId: sender.tab.id });
            },
            downloadFile: function(msg, bgdata: DownloadFile, sender, sendResponse) {
                chrome.downloads.download({ url: bgdata.url, saveAs: true, filename: bgdata.fileName });
            },
            analytics: function(msg, bgdata: StringMap, sender, sendResponse) {
                OV.analytics.postData(bgdata);
            },
            redirectHosts: function(msg, bgdata, sender, sendResponse) {
                ScriptBase.getRedirectHosts().then(function(redirectHosts) {
                    sendResponse({ redirectHosts: redirectHosts });
                });
            },
            alert: function(msg, bgdata: Alert, sender, sendResponse) {
                window.alert(bgdata.msg);
            },
            prompt: function(msg, bgdata: Promt, sender, sendResponse) {
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

    interface IFrameEntry {
        iframe: HTMLIFrameElement;
        shadow: HTMLElement;
        observer: MutationObserver;
    }
    type IFrameEntries = Array<IFrameEntry>;

    let iframes: IFrameEntries = [];
    let activeEntry: { oldCSS: string; entry: IFrameEntry; } = null;

    function checkCleanup(entry: IFrameEntry) {
        if (entry == null) {
            return false;
        }
        else if (!entry.iframe || !entry.iframe.parentElement) {
            entry.observer.disconnect();
            entry.shadow.remove();
            return true;
        }
        else {
            return false;
        }
    }
    export function getActiveFrame() {
        if (isFrameActive()) {
            return activeEntry.entry;
        }
        else {
            throw Error("No IFrame in theatre mode!");
        }
    }
    export function isFrameActive() {
        if (activeEntry && checkCleanup(activeEntry.entry)) {
            activeEntry = null;
        }
        return activeEntry != null;
    }
   
    export function getEntry(frameid: string) {
        for (let i = 0; i < iframes.length; i++) {
            if (checkCleanup(iframes[i])) {
                iframes.splice(i, 1);
                i--;
            }
            else if (iframes[i].iframe.name === frameid) {
                return iframes[i];
            }
        }
        return null;
    }
    export function registerIFrame(iframe: HTMLIFrameElement) {
        
        function matchesSelector(selector : string, element : HTMLElement) {
            var all = document.querySelectorAll(selector);
            for (var i = 0; i < all.length; i++) {
              if (all[i] === element) {
                return true;
              }
            }
            return false;
        }

        let shadow = document.createElement("ovshadow");
        
        OV.page.lookupCSS({}, function(obj){
            if(obj.cssRule.selectorText.indexOf(" iframe") != -1) {
                if(matchesSelector(obj.cssRule.selectorText, iframe)) {
                    if(obj.cssRule.style.width != "") {
                        obj.cssRule.style.setProperty("width",  obj.cssRule.style.getPropertyValue("width"), "");
                        obj.cssRule.style.setProperty("height",  obj.cssRule.style.getPropertyValue("height"), "");
                    }
                }
            }
        });

        
        if (iframe.hasAttribute("allow")) {
            iframe.removeAttribute("allow");
        }
        let observer = new MutationObserver(function(mutations) {
            if(isFrameActive() && getActiveFrame().iframe == iframe) {
                let newleft = Math.floor((window.innerWidth - iframe.clientWidth) / 2).toString() + "px";
                let newtop = Math.floor((window.innerHeight - iframe.clientHeight) / 2).toString() + "px";
                if(iframe.style.left != newleft) {
                    iframe.style.setProperty("left", newleft);
                    iframe.style.setProperty("top", newtop);
                }
            }
            
        });
        observer.observe(iframe, { attributes: true, attributeFilter: ["style"] });

        shadow.className = "ov-theaterMode";
        shadow.addEventListener("click", function(e : MouseEvent){
            e.stopPropagation();
            e.preventDefault();
        });
        iframe.addEventListener("click", function(e : MouseEvent){
            e.stopPropagation();
            e.preventDefault();
        });
        iframe.parentNode.appendChild(shadow);

        iframes.push({ shadow: shadow, iframe: iframe, observer: observer });
        return OV.array.last(iframes);

    }
    export function nameIFrames() {
        function nameIFrame(iframe : HTMLIFrameElement) {
            if(!iframe.hasAttribute("name")) {
                iframe.name = OV.messages.generateHash();
                if(iframe.width) {
                    iframe.style.width = iframe.width;
                    iframe.removeAttribute("width");
                }
                if(iframe.height) {
                    iframe.style.height = iframe.height;
                    iframe.removeAttribute("height");
                }
                let sibling = iframe.nextElementSibling;
                let parent = iframe.parentElement;
                iframe.remove();
                parent.insertBefore(iframe, sibling);
            }
        }
        OV.page.isReady().then(function(){
            for (let iframe of document.getElementsByTagName("iframe")) {
                nameIFrame(iframe);
            }
        });
        document.addEventListener("DOMNodeInserted", function(e : MutationEvent){
            let target = e.target as HTMLIFrameElement;
            if(target.getElementsByTagName) {
                let iframes = target.getElementsByTagName("iframe");
                
                if(target.nodeName.toLowerCase() === "iframe") {
                    nameIFrame(target);
                }
                for(let iframe of iframes) {
                    nameIFrame(iframe);
                }
            }
        });
    }
    export function activateEntry(entry: IFrameEntry) {
        if (isFrameActive()) {
            console.log(activeEntry);
            throw Error("Some IFrame is already in theatre mode!");
        }
        else if (entry == null) {
            throw Error("Entry must not be null!");
        }
        else {
            document.body.style.overflow = "hidden";
            activeEntry = { oldCSS: entry.iframe.style.cssText, entry: entry };
            OV.storage.sync.get("TheatreModeFrameWidth").then(function(frameWidth) {
                setWrapperStyle(entry, frameWidth || 70);
            });
            entry.shadow.style.opacity = "1";
            entry.shadow.style.pointerEvents = "all";

        }
    }
    export function deactivateEntry() {
        if (!isFrameActive()) {
            throw Error("No IFrame is in theatre mode!");
        }
        let entry = activeEntry;
        activeEntry = null;
        let newrelwidth = Math.floor((entry.entry.iframe.clientWidth / window.innerWidth) * 100);
        console.log(newrelwidth);
        OV.storage.sync.set("TheatreModeFrameWidth", newrelwidth);
        entry.entry.shadow.style.opacity = "0";
        entry.entry.shadow.style.removeProperty("pointer-events");
        window.setTimeout(function() {
            entry.entry.iframe.style.cssText = entry.oldCSS;
            document.body.style.removeProperty("overflow");
        }, 150);
    }


    function setWrapperStyle(entry: IFrameEntry, width: number): void {
        width = width > 100 ? 100 : width;
        width = width < 50 ? 50 : width;
        entry.iframe.style.cssText = "padding-right:5px;padding-bottom:5px;display:block;overflow: hidden; resize: both;position: fixed !important;width: " + width + "vw !important;height: calc(( 9/ 16)*" + width + "vw) !important;top: calc((100vh - ( 9/ 16)*" + width + "vw)/2) !important;left: calc((100vw - " + width + "vw)/2) !important;z-index:2147483647 !important; border: 0px !important; max-width:100vw !important; min-width: 50vw !important; max-height: 100vh !important; min-height: 50vh !important";
    }
    function getIFrameByID(frameid: string): HTMLIFrameElement {

        let iframe = document.getElementsByName(frameid)[0] as HTMLIFrameElement;
        if(iframe) {
            return iframe;
        }
        else {
            throw Error("Could not find iframe with id '"+frameid+"'!");
        }
    }
    export interface SetupIFrame {
        frameID: string;
        url: string;
    }
    export interface SetTheatreMode extends SetupIFrame {
        enabled: boolean;
    }
    export function setTheatreMode(enabled: boolean) {
        Background.toTopWindow({ data: { enabled: enabled, frameID: window.name } as SetTheatreMode, func: "setTheatreMode" });
    }
    export function setupIframe() {
        Background.toTopWindow({ data: { frameID: window.name, url: location.href } as SetupIFrame, func: "setupIframe" });
    }
    export function setup() {
        nameIFrames();
        OV.messages.addListener({
            setTheatreMode: function(request, sendResponse) {
                var data = request.data as SetTheatreMode;
                if (data.enabled) {
                    var entry = getEntry(data.frameID);
                    activateEntry(entry);
                }
                else {
                    deactivateEntry();
                }
            },
            setupIframe: function(request, sendResponse) {
                let data = request.data as SetupIFrame;
                var entry = getEntry(data.frameID);
                if (!entry) {
                    let iframe = getIFrameByID(data.frameID);
                    //iframe.src = data.url;
                    entry = registerIFrame(iframe);
                }
            }
        });
    }

}
namespace VideoPopup {
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
        let videoListEntry = OV.array.search(src[0].src, videoArr, function(src, arrElem) {
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
                Background.setIconPopup();

            }
            setUnviewedVideos(newVideos);
            getPopupFrame().src = OV.environment.getVidPopupSiteUrl({
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
    interface AddVideoToPopup {
        videoData: VideoTypes.VideoData;
    }
    export function isPopupVisible(): Promise<boolean> {
        if (OV.page.isFrame()) {
            return Background.toTopWindow({ data: {}, func: "isPopupVisible" }).then(function(response) {
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
            isPopupVisible: function(request, sendResponse) {
                sendResponse({ visible: _isPopupVisible() });
            },
            openPopup: function(request, sendResponse) {
                getPopupFrame().hidden = false;
                if (firstpopup) {
                    getPopupFrame().src = getPopupFrame().src;
                    firstpopup = false;
                }
                pauseAllVideos();
                setUnviewedVideos(newVideos);
            },
            closePopup: function(request, sendResponse) {
                document.getElementById("videoPopup").hidden = true;
                Background.setIconPopup();
                setUnviewedVideos(newVideos);
            },
            addVideoToPopup: function(request, sendResponse) {
                _addVideoToPopup(request.data.videoData);
            }
        });
    }
}
namespace OVMetadata {
    function toDataURL(url: string): Promise<string> {
        return OV.tools.createRequest({
            url: url, beforeSend: function(xhr) {
                xhr.responseType = 'blob';
            }
        }).then(function(xhr) {
            return new Promise<string>(function(resolve, reject) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    resolve("url(" + reader.result + ")");
                }
                reader.readAsDataURL(xhr.response);
            });
        });
    }
    export interface PlayerStyle {
        doChange: boolean;
        color: string;
        playimage: string;
        playhoverimage: string;
    }
    export function requestPlayerCSS() {
        return Background.toTopWindow({ func: "requestPlayerCSS", data: {} }).then(function(response) {
            return response.data as PlayerStyle;
        });
    }
    export function setup() {
        OV.page.isReady().then(function(event) {
            let ovtags = document.getElementsByTagName("openvideo");
            if (ovtags.length > 0) {
                let ovtag = ovtags[0] as HTMLElement;
                ovtag.innerText = OV.environment.getManifest().version;


                /*var reloadimage = null;
            if(ovtag.attributes.reloadimage) {
                reloadimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadimage.value, async: false}).response)+")";
            }
            var reloadhoverimage = null;
            if(ovtag.attributes.reloadhoverimage) {
                reloadhoverimage = "url(data:image/png;base64,"+btoa(OV.tools.ajax({url: ovtag.attributes.reloadhoverimage.value, async: false}).response)+")";
            }*/

                let metadata: PlayerStyle = null;
                OV.messages.addListener({
                    requestPlayerCSS: function(request, sendResponse) {
                        if (metadata) {
                            sendResponse(metadata);
                        }
                        else {
                            Promise.all([toDataURL(ovtag.getAttribute("playimage")), toDataURL(ovtag.getAttribute("playhoverimage"))]).then(function(dataURLs) {
                                metadata = { doChange: true, color: ovtag.getAttribute("color"), playimage: dataURLs[0], playhoverimage: dataURLs[1] };
                                sendResponse(metadata);
                            });
                        }
                    }
                });
                //alert("W2")
                ovtag.dispatchEvent(new Event("ov-metadata-received"));
            }
        });
    }
}