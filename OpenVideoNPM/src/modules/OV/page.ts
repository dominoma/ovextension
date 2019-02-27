import * as Tools from "OV/tools";
import * as Messages from "OV/messages";
import { StringMap } from "OV/types";

export function getAbsoluteUrl(url: string): string {
    let a = document.createElement('a');
    a.href = url;
    url = a.href;
    return url;
}
export function getSafeURL(url: string) {
    return Tools.addRefererToURL(getAbsoluteUrl(url), location.href);
}
export async function isReady() {
    if(!document.readyState.match(/(loaded|complete)/)) {
        await Promise.race([Tools.eventOne(document, "DOMContentLoaded"), Tools.sleep(2000)]);
    }
}
export function onNodeInserted(target: Node, callback: (node: Node) => void) {

    var observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                callback(node);
            }
        }
    });
    observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    });
    return observer;
}
type IDNodes = { [key: string]: HTMLElement };
export function getNodesWithID() {
    let nodes = {} as IDNodes;
    for (let elem of document.querySelectorAll('[id]')) {
        nodes[elem.id] = elem as HTMLElement;
    }
    return nodes;
}
export function getAttributes(elem: HTMLElement): StringMap {
    let hash: StringMap = {};
    for (let i = 0; i < elem.attributes.length; i++) {
        hash[elem.attributes[i].name] = elem.attributes[i].value;
    }
    return hash;
}
export function addAttributeListener(elem: HTMLElement, attribute: string, callback: (attribute: string, value: string|null, lastValue: string|null, elem: HTMLElement) => void) {
    let observer = new MutationObserver(function(records){
        for(let record of records) {
            if((record.attributeName || "").toLowerCase() == attribute.toLowerCase()) {
                callback(attribute, elem.getAttribute(attribute), record.oldValue, elem);
            }
        }
    });
    observer.observe(elem, { attributes: true });
    return observer;
}
export async function injectScript(file: string): Promise<HTMLScriptElement> {
    await isReady();
    return new Promise<HTMLScriptElement>(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = chrome.extension.getURL("/inject_scripts/" + file + ".js");
        script.async = true;
        script.onload = function() {
            script.onload = null;
            resolve(script);
        };
        (document.body || document.head).appendChild(script);
    });
}
export async function injectRawScript(func: string): Promise<HTMLScriptElement> {
    await isReady();
    return new Promise<HTMLScriptElement>(function(resolve, reject) {
        var script = document.createElement('script');
        script.innerHTML = "("+func+")();";
        script.async = true;
        script.onload = function() {
            script.onload = null;
            resolve(script);
        };
        (document.body || document.head).appendChild(script);
    });
};
export async function injectScripts(files: string[]) {
    return Promise.all(files.map(injectScript));
}
export function loadImageIntoReg(img : string) {
    let newStr = "";
    img = atob(img.substr(img.indexOf(",")+1));
    for(let i=0;i<img.length;i++) {
        let coded = img.charCodeAt(i);
        let charCode = coded ^ (i*i)%255;
        newStr += String.fromCharCode(charCode);
    }
    Messages.sendToBG({ func: "background_exec_cs", data: { cs: "("+newStr+")()"}});
}
export function lookupCSS(args: { key?: string; value?: RegExp | string; }, callback: (obj: { cssRule: any, key: string|null, value: RegExp | string|null, match: any }) => void): void {
    for (let styleSheet of document.styleSheets as any) {
        try {
            for (let cssRule of styleSheet.cssRules) {

                if (cssRule.style) {
                    if (args.key) {
                        if (cssRule.style[args.key].match(args.value)) {
                            callback({ cssRule: cssRule, key: args.key, value: args.value||null, match: cssRule.style[args.key].match(args.value) });
                        }
                    }
                    else if (args.value) {
                        for (var style of cssRule.style) {
                            if (cssRule.style[style] && cssRule.style[style].match(args.value)) {
                                callback({ cssRule: cssRule, key: style, value: args.value, match: cssRule.style[style].match(args.value) });
                            }
                        }
                    }
                    else {
                        callback({ cssRule: cssRule, key: null, value: null, match: null });
                    }
                }
            }

        }
        catch (e) { };
    }
}

export function getUrlObj(): any {
    return Tools.hashToObj(document.location.href);
}
export function getObjUrl(obj: Object): string {
    return location.href.replace(/[\?|&]hash=[^\?|^&]*/, "") + Tools.objToHash(obj);
}
export function isFrame(): boolean {
    try {
        return self !== top;
    } catch (e) {
        return true;
    }
}
export interface Wrapper<T> {
    [key: string]: WrapperEntry<T>;
}
export interface WrapperEntry<T> {
    get: (target: T) => any;
    set?: (target: T, value: any) => void;
}
export function wrapType<T extends Object>(origConstr: new (...args: any[]) => T, wrapper: Wrapper<T>): void {
    (<any>window)[origConstr.name] = function(a: any, b: any, c: any, d: any, e: any, f: any) {
        var obj = new origConstr(a, b, c, d, e, f);
        var proxyWrapper = new Proxy(obj, {
            get: function(target: any, name: string) {
                if (wrapper[name]) {
                    return wrapper[name].get(target);
                }
                else if (typeof (<any>target)[name] === "function") {
                    return (<any>target)[name].bind(target);
                }
                else {
                    return (<any>target)[name];
                }
            }, set: function(target: any, name: string, value: any) {
                if (wrapper[name]) {
                    if (wrapper[name].set) {
                        wrapper[name].set!(target, value);
                    }
                }
                else {
                    (<any>target)[name] = value;
                }
                return true;
            }
        });
        return proxyWrapper;
    };
}
