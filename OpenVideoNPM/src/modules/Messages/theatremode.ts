
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";
import * as Storage from "OV/storage";
import * as Page from "OV/page";
import * as Tools from "OV/tools";

import * as Background from "./background";



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

    function matchesSelector(selector: string, element: HTMLElement) {
        var all = document.querySelectorAll(selector);
        for (var i = 0; i < all.length; i++) {
            if (all[i] === element) {
                return true;
            }
        }
        return false;
    }

    let shadow = document.createElement("ovshadow");

    Page.lookupCSS({}, function(obj) {
        if (obj.cssRule.selectorText.indexOf(" iframe") != -1) {
            if (matchesSelector(obj.cssRule.selectorText, iframe)) {
                if (obj.cssRule.style.width != "") {
                    obj.cssRule.style.setProperty("width", obj.cssRule.style.getPropertyValue("width"), "");
                    obj.cssRule.style.setProperty("height", obj.cssRule.style.getPropertyValue("height"), "");
                }
            }
        }
    });


    if (iframe.hasAttribute("allow")) {
        iframe.setAttribute("allow", iframe.getAttribute("allow").replace(/fullscreen[^;]*;?/i, "fullscreen *;"));//fullscreen *;
    }
    iframe.allowFullscreen = true;
    let observer = new MutationObserver(function(mutations) {
        if (isFrameActive() && getActiveFrame().iframe == iframe) {
            let newleft = Math.floor((window.innerWidth - iframe.clientWidth) / 2).toString() + "px";
            let newtop = Math.floor((window.innerHeight - iframe.clientHeight) / 2).toString() + "px";
            if (iframe.style.left != newleft) {
                iframe.style.setProperty("left", newleft);
                iframe.style.setProperty("top", newtop);
            }
        }

    });
    observer.observe(iframe, { attributes: true, attributeFilter: ["style"] });

    shadow.className = "ov-theaterMode";
    shadow.addEventListener("click", function(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    });
    iframe.addEventListener("click", function(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    });
    iframe.parentNode.appendChild(shadow);

    iframes.push({ shadow: shadow, iframe: iframe, observer: observer });
    return iframes[iframes.length - 1];

}
export function nameIFrames() {
    function nameIFrame(iframe: HTMLIFrameElement) {
        function checkBounds(iframe: HTMLIFrameElement) {
            
            
            if(iframe.offsetLeft < 0 || iframe.offsetTop < 0) {
                
                return false;
            }
            else if((iframe.offsetWidth / window.innerWidth)*100 < 30 || (iframe.offsetHeight / window.innerHeight)*100 < 30) {
                
                return false;
            } 
            else {
                return true;
            }
        }
        if (!iframe.hasAttribute("name") && checkBounds(iframe)) {
            console.log(iframe);
            iframe.name = Tools.generateHash();
            if (iframe.width) {
                iframe.style.width = iframe.width;
                iframe.removeAttribute("width");
            }
            if (iframe.height) {
                iframe.style.height = iframe.height;
                iframe.removeAttribute("height");
            }
            let sibling = iframe.nextElementSibling;
            let parent = iframe.parentElement;
            iframe.remove();
            parent.insertBefore(iframe, sibling);
        }
    }
    Page.isReady().then(function() {
        for (let iframe of document.getElementsByTagName("iframe")) {
            nameIFrame(iframe);
        }
    });
    Page.onNodeInserted(document, function(tgt) {
       
        let target = tgt as HTMLIFrameElement;
        if (target.getElementsByTagName) {
            let iframes = target.getElementsByTagName("iframe");

            if (target.nodeName.toLowerCase() === "iframe") {
                nameIFrame(target);
            }
            for (let iframe of iframes) {
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
        Storage.sync.get("TheatreModeFrameWidth").then(function(frameWidth) {
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
    Storage.sync.set("TheatreModeFrameWidth", newrelwidth);
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
    if (iframe) {
        return iframe;
    }
    else {
        throw Error("Could not find iframe with id '" + frameid + "'!");
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
    Messages.addListener({
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