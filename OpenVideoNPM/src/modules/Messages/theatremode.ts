
import * as Messages from "OV/messages";
import * as Storage from "OV/storage";
import * as Page from "OV/page";
import * as Tools from "OV/tools";

import * as Background from "./background";



interface IFrameEntry {
    iframe: HTMLIFrameElement;
    shadow: HTMLElement;
}
type IFrameEntries = Array<IFrameEntry>;

let iframes: IFrameEntries = [];
let activeEntry: { oldStyle: { css: string, width: string, height: string }; entry: IFrameEntry; }|null = null;

function checkCleanup(entry: IFrameEntry) {
    if (entry == null) {
        return false;
    }
    else if (!entry.iframe || !entry.iframe.parentElement) {
        //entry.observer.disconnect();
        entry.shadow.remove();
        return true;
    }
    else {
        return false;
    }
}
export function getActiveFrame() {
    if (isFrameActive()) {
        return activeEntry!.entry;
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
function checkIFrameBounds(iframe: HTMLIFrameElement, width: number, height: number) {
    return Math.abs(iframe.clientWidth - width) <= 1 && Math.abs(iframe.clientHeight - height) <= 1;
}
export function getEntry(width : number, height: number) {
    for (let i = 0; i < iframes.length; i++) {
        if (checkCleanup(iframes[i])) {
            iframes.splice(i, 1);
            i--;
        }
        else if (checkIFrameBounds(iframes[i].iframe, width, height)) {
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

    shadow.className = "ov-theaterMode";
    shadow.addEventListener("click", function(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    });
    iframe.addEventListener("click", function(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
    });
    if(!iframe.parentNode) {
        throw Error("IFrame is not part of the page!");
    }
    iframe.parentNode.appendChild(shadow);

    iframes.push({ shadow: shadow, iframe: iframe });
    return iframes[iframes.length - 1];

}
export async function nameIFrames() {
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
        if (iframe.hasAttribute("allow") && iframe.getAttribute("allow")!.indexOf("fullscreen") != -1) {
            if (iframe.hasAttribute("allow")) {
                iframe.setAttribute("allow", iframe.getAttribute("allow")!.replace(/fullscreen[^;]*;?/i, "fullscreen *;"));//fullscreen *;
            }
        }
    }
    Page.onNodeInserted(document, function(target) {

        if (target instanceof HTMLElement) {
            let iframes = target.getElementsByTagName("iframe");

            if (target instanceof HTMLIFrameElement) {
                nameIFrame(target);
            }
            for (let iframe of iframes) {
                nameIFrame(iframe);
            }
        }
    });
    await Page.isReady();
    for (let iframe of document.getElementsByTagName("iframe")) {
        nameIFrame(iframe);
    }
}
export async function activateEntry(entry: IFrameEntry) {
    if (isFrameActive()) {
        console.log(activeEntry);
        throw Error("Some IFrame is already in theatre mode!");
    }
    else if (entry == null) {
        throw Error("Entry must not be null!");
    }
    else {
        document.body.style.overflow = "hidden";
        activeEntry = {
            oldStyle: {
                css: entry.iframe.style.cssText,
                width: entry.iframe.width,
                height: entry.iframe.height
            },
            entry: entry
        };
        let frameWidth = await Storage.getTheatreFrameWidth();
        setWrapperStyle(entry, frameWidth);
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
    let newrelwidth = Math.floor((entry!.entry.iframe.clientWidth / window.innerWidth) * 100);
    console.log(newrelwidth);
    Storage.setTheatreFrameWidth(newrelwidth);
    entry!.entry.shadow.style.opacity = "0";
    entry!.entry.shadow.style.removeProperty("pointer-events");
    window.setTimeout(function() {
        entry!.entry.iframe.style.cssText = entry!.oldStyle.css;
        entry!.entry.iframe.width = entry!.oldStyle.width;
        entry!.entry.iframe.height = entry!.oldStyle.height;
        document.body.style.removeProperty("overflow");
    }, 150);
}


function setWrapperStyle(entry: IFrameEntry, width: number): void {
    width = width > 100 ? 100 : width;
    width = width < 50 ? 50 : width;
    entry.iframe.removeAttribute("width");
    entry.iframe.removeAttribute("height");
    entry.iframe.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        margin: auto !important;
        width: `+width+`vw !important;
        height: calc(`+width+`vw*9/16) !important;
        padding-right:5px !important;
        padding-bottom:5px !important;
        display:block !important;
        overflow: hidden !important;
        resize: both !important;
        z-index: 99999999999 !important;
        border: 0px !important;
        max-width:100vw !important;
        min-width: 50vw !important;
        max-height: 100vh !important;
        min-height: 50vh !important;
    `;
    //entry.iframe.style.cssText = "padding-right:5px;padding-bottom:5px;display:block;overflow: hidden; resize: both;position: fixed !important;width: " + width + "vw !important;height: calc(( 9/ 16)*" + width + "vw) !important;top: calc((100vh - ( 9/ 16)*" + width + "vw)/2) !important;left: calc((100vw - " + width + "vw)/2) !important;z-index:2147483647 !important; border: 0px !important; max-width:100vw !important; min-width: 50vw !important; max-height: 100vh !important; min-height: 50vh !important";
}
function getIFrameByID(width: number, height: number): HTMLIFrameElement {

    //let iframe = document.getElementsByName(frameid)[0] as HTMLIFrameElement;
    let iframe = null;
    for(let frame of document.getElementsByTagName("iframe")) {
        if(checkIFrameBounds(frame, width, height)) {
            iframe = frame;
            break;
        }
    }
    if (iframe) {
        return iframe;
    }
    else {
        throw Error("Could not find iframe with!");
    }
}
export interface SetupIFrame {
    //frameID: string;
    width: number;
    height: number;
    url: string;
}
export interface SetTheatreMode extends SetupIFrame {
    enabled: boolean;
}
export function setTheatreMode(enabled: boolean) {
    Background.toTopWindow({
        data: {
            enabled: enabled,
            width: window.innerWidth,
            height: window.innerHeight
            /*frameID: window.name*/
        } as SetTheatreMode,
        func: "theatremode_setTheatreMode"
    });
}
export function setupIframe() {
    Background.toTopWindow({
        data: {
            width: window.innerWidth,
            height: window.innerHeight,
            /*frameID: window.name*/
            url: location.href
        } as SetupIFrame,
        func: "theatremode_setupIframe"
    });
}
export function setup() {
    nameIFrames();
    Messages.addListener({
        theatremode_setTheatreMode: async function(request) {
            var data = request.data as SetTheatreMode;
            if (data.enabled) {
                var entry = getEntry(data.width, data.height);
                if(!entry) {
                    throw new Error("No IFrame with found!");
                }
                activateEntry(entry);
            }
            else {
                deactivateEntry();
            }
        },
        theatremode_setupIframe: async function(request) {
            let data = request.data as SetupIFrame;
            var entry = getEntry(data.width, data.height);
            if (!entry) {
                let iframe = getIFrameByID(data.width, data.height);
                //iframe.src = data.url;
                entry = registerIFrame(iframe);
            }
        }
    });
}
