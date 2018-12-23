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
        return Background.toTopWindow({ data: data, func: "setTheatreMode"});
    }
    export function theatreModeDragChanged(data : DragTheatreMode) {
        return Background.toTopWindow({ data: data, func: "theatreModeDragChanged"});
    }
    export function theatreModeDragStopped() {
        return Background.toTopWindow({ data: {}, func: "theatreModeDragStopped"});
    }
    export function setupIframe(data : SetupIFrame) {
        return Background.toTopWindow({ data: data, func: "setupIframe"});
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