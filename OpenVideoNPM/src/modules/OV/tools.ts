import { StringMap, StdMap } from "./types";

export function exportFunction(func : Function) {
    (window as any)[func.name] = func;
}
export function exportVar(name : string, value: any) {
    (window as any)[name] = value;
}
export function importVar(name : string) {
    return (window as any)[name];
}
export function convertToError(e : any) : Error {
    if(e instanceof Error) {
        return e;
    }
    else if(typeof e == "string") {
        return new Error(e);
    }
    else {
        let result = JSON.stringify(e);
        if(result) {
            return new Error(result);
        }
        else if(typeof e.toString == "function") {
            return new Error(e.toString());
        }
        else {
            return new Error("Unknown Error!");
        }
    }
}
export function accessWindow<T>(initValues: T) {
    return new Proxy<any>({},{
        get: function(target, key){
            let val = (window as any)[key];
            if(val == undefined) {
                return (initValues as any)[key];
            }
            else {
                return val;
            }
        },
        set: function(target, key, value){
            (window as any)[key] = value;
            return true;
        }
    }) as T;
}
export function getTracksFromHTML(html : string) {
    let subtitleTags = html.match(/<track(.*)\/>/g) || [];
    let subtitles = [];
    for (let subtitleTag of subtitleTags) {
        let label = matchNull(subtitleTag, /label="([^"]*)"/);
        let src = matchNull(subtitleTag, /src="([^"]*)"/);
        if (src) {
            subtitles.push({ kind: "captions", label: label, src: src, default: subtitleTag.indexOf("default") != -1 });
        }
    }
    return subtitles;
}
export function generateHash(): string {
    var ts = Math.round(+new Date() / 1000.0);
    var rand = Math.round(Math.random() * 2147483647);
    return [rand, ts].join('.');
}
export function merge<T1, T2>(obj1: T1, obj2: T2): T1 & T2 {
    return (<any>Object).assign({}, obj1, obj2);
}
export async function eventOne(elem: Node, type: string) {
    return new Promise<Event>(function(resolve, reject) {
        elem.addEventListener(type, function one(e: Event) {
            elem.removeEventListener(type, one);
            resolve(e);
        });
    });
}
export async function sleep(ms : number) {
    return new Promise(function(resolve, reject) {
        window.setTimeout(function(){
            resolve();
        }, ms);
    });
}
export function matchNull(str: string, regexp: RegExp, index?: number) {
    return (str.match(regexp) || [])[index || 1] || "";
}
export function matchError(str: string, regexp: RegExp) {
    let match = str.match(regexp);
    if(!match) {
        throw Error("No match found for '"+regexp+"'!");
    }
    return match;
}
export function objToHash(obj: Object): string {
    if (obj) {
        return "?hash=" + encodeURIComponent(JSON.stringify(obj));
    }
    else {
        return "";
    }
}
export function hashToObj(hashStr: string): Object | null {
    var hash = parseURL(hashStr).query.hash;
    if (hash == "" || hash == undefined) {
        return null;
    }
    else {
        return JSON.parse(decodeURIComponent(hash));
    }
}
export function unpackJS(source: string): string {
    function getUnbase(base: number) {
        var ALPHABET = "";
        if (base > 62) ALPHABET = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
        else if (base > 54) ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        else if (base > 52) ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQR';
        else ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP';
        return function(val: string) {
            if (2 <= base && base <= 36) {
                return parseInt(val, base);
            }
            else {
                var valArray = val.split('').reverse();
                var ret = 0;
                for (var i = 0; i < valArray.length; i++) {
                    var cipher = valArray[i];
                    ret += Math.pow(base, i) * ALPHABET.indexOf(cipher);
                }
                return ret;
            }
        };
    }
    var out = source.match(/}\('(.*)', *(\d+), *(\d+), *'(.*?)'\.split\('\|'\)/) || [];

    // Payload
    var payload = out[1];
    // Words
    var symtab = out[4].split(/\|/);
    // Radix
    var radix = parseInt(out[2]);
    // Words Count
    var count = parseInt(out[3]);

    if (count != symtab.length) {
        throw Error("Malformed p.a.c.k.e.r symtab !");
    }

    var unbase = getUnbase(radix);

    function lookup(matches: any) {
        var word = matches;
        var ub = symtab[unbase(word)];
        var ret = ub ? ub : word;
        return ret;
    }

    var result = payload.replace(/\b\w+\b/g, lookup);
    result = result.replace(/\\/g, '');
    return result;
}
export interface URL {
    url: string;
    protocol: string;
    host: string;
    port: string;
    path: string;
    query: StringMap;
    queryStr: string;
}
let urlParser = document.createElement("a");
export function parseURL(url: string): URL {
    urlParser.href = url;
    return {
        url: url,
        protocol: urlParser.protocol,
        host: urlParser.host,
        port: urlParser.port,
        path: urlParser.pathname,
        queryStr: urlParser.search,
        query: parseURLQuery(urlParser.search),
    };
}
function parseURLQuery(url: string): StringMap {
    return Object.assign.apply(null, (url.match(/[\?&]([^\?&]*)/g) || []).map(function(el){
    	let match = el.match(/[\?&]([^=]*)=?(.*)/) || [];
    	return { [decodeURIComponent(match[1])]: decodeURIComponent(match[2]) || true };
    }).concat({}) as any);
}
export async function getUrlFileName(url: string): Promise<string> {
    let xhr = await createRequest({ url: url, type: HTTPMethods.HEAD });
    var filename = ((xhr.getResponseHeader("content-disposition") || "").match(/filename="([^"]*)/) || [])[1];
    if (filename && filename != "") {
        return filename;
    }
    else {
        return decodeURIComponent(url.substring(url.lastIndexOf('/') + 1).replace(/[&\?].*/, ""));
    }
}
export async function getRedirectedUrl(url: string): Promise<String> {
    let xhr = await createRequest({ url: url, type: HTTPMethods.HEAD });
    return xhr.responseURL;
}
function objToURLParams(url: string, obj: StringMap): string {
    var str = "";
    for (var key in obj) {
        if (!isParamInURL(url, key)) {
            str += "&" + key + "=" + encodeURIComponent(obj[key]);
        }
    }
    return str.substr(1);
}
export function isParamInURL(url: string, param: string) {
    return new RegExp("[\\?|&]" + param + "=", "i").test(url);
}
export function addParamsToURL(url: string, obj: StringMap): string {
    if (url && obj) {
        let query_str = objToURLParams(url, obj);
        if (query_str) {
            return url + (url.lastIndexOf("?") < url.lastIndexOf("/") ? "?" : "&") + query_str;
        }
        else {
            return url;
        }
    }
    else {
        return url;
    }
}
export function removeParamsFromURL(url: string, params: String[]) {
    for(let param of params) {
        url = url.replace(new RegExp("[\\?&]"+param+"=[^\\?&]*", "i"), "");
    }
    return url;
}
export function getParamFromURL(url: string, param: string) {
    var match = url.match(new RegExp("[\\?&]"+param+"=([^\\?&]*)","i"));
    if(match) {
        return match[1];
    }
    else {
        return null;
    }
}
export function addRefererToURL(url: string, referer: string) {
    return addParamsToURL(url, { OVReferer: btoa(referer) });
}
export function getRefererFromURL(url: string) {
    var param = getParamFromURL(url, "OVReferer");
    if (param) {
        let ref = param;
        while(true) {
            ref = decodeURIComponent(ref);
            try {
                return atob(ref);
            }
            catch(e) {

            }
        }
    }
    else {
        return null;
    }
}
export function removeRefererFromURL(url: string) {
    return removeParamsFromURL(url, ["OVReferer"]);
}
export const enum HTTPMethods {
    GET = "GET",
    POST = "POST",
    HEAD = "HEAD"
}
export interface Request {
    url: string;
    type?: HTTPMethods;
    protocol?: string;
    cache?: boolean;
    referer?: string;
    hideRef?: boolean;
    headers?: StringMap;
    xmlHttpObj?: XMLHttpRequest;
    formData?: StringMap;
    data?: StringMap;
    beforeSend?: (xhr: XMLHttpRequest) => void;
}
export async function createRequest(args: Request): Promise<XMLHttpRequest> {
    return new Promise<XMLHttpRequest>((resolve, reject) => {
        let xmlHttpObj: XMLHttpRequest = args.xmlHttpObj  || new XMLHttpRequest();
        var type = args.type || HTTPMethods.GET;
        var protocol = args.protocol || "https://";
        if (args.referer) {
            args.data = merge(args.data, { OVReferer: encodeURIComponent(btoa(args.referer)) });
        }
        else if (args.hideRef) {
            args.data = merge(args.data, { isOV: "true" });
        }
        var url = addParamsToURL(args.url, args.data || {}).replace(/[^:]+:\/\//, protocol);

        xmlHttpObj.open(type, url, true);
        xmlHttpObj.onload = function() {
            if (xmlHttpObj.status == 200) {
                resolve(xmlHttpObj);
            }
            else {

                reject(Error(xmlHttpObj.statusText + " (url: '" + url + "')"));
            }
        };
        xmlHttpObj.onerror = function() {

            reject(Error("Network Error (url: '" + url + "')"));
        };

        if (args.headers) {
            for (var key in args.headers) {
                xmlHttpObj.setRequestHeader(key, args.headers[key]);
            }
        }
        let formData: FormData|null = null;
        if (args.formData) {
            formData = new FormData();
            for (var key in args.formData) {
                formData.append(key, args.formData[key]);
            }
        }


        if (args.cache == false) {
            xmlHttpObj.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
            xmlHttpObj.setRequestHeader('cache-control', 'max-age=0');
            xmlHttpObj.setRequestHeader('expires', '0');
            xmlHttpObj.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
            xmlHttpObj.setRequestHeader('pragma', 'no-cache');
        }
        if (args.beforeSend) {
            args.beforeSend(xmlHttpObj);
        }
        xmlHttpObj.send(formData);




    });
}
