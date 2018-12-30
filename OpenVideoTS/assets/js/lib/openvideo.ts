type StringMap = {[key:string]: string};
interface Window {
    videojs: typeof videojs;
}
namespace OV {
    export namespace array {
        export function last<T>(arr: Array<T>, value: T) : Array<T>;
        export function last<T>(arr: Array<T>) : T;
        export function last(arr : Array<any>, value?: any) {
            if(arguments.length > 1) {
                return fromEnd(arr, 0, value);
            }
            else {
                return fromEnd(arr, 0);
            }
        }
        export function fromEnd<T>(arr: Array<T>, index: number, value: T) : Array<T>;
        export function fromEnd<T>(arr: Array<T>, index: number) : T;
        export function fromEnd(arr : Array<any>, index : number, value?: any) {
            if(arguments.length > 2) {
                arr[arr.length-1-index] = value;
                return arr;
            }
            else {
                return arr[arr.length-1-index];
            }
        }
        export function search<T>(elem: any, arr: Array<T>, cmpre?: (elem: any, arrItem: T) => boolean ) : T {
            if(!cmpre) {
                cmpre = function(elem, arrItem){ 
                    return arrItem === elem; 
                };
            }
            for(let item of arr) {
                if(cmpre(elem, item)) {
                    return item;
                }
            }
            return null;
        }
    }
    export namespace object {
        export function merge<T1, T2>(obj1: T1, obj2: T2) : T1&T2 {
            return (<any>Object).assign({}, obj1, obj2);
        }
    }
    export function toJSONString(obj: any) : string {
        if(Array.isArray(obj)) {
            var str = "";
            for(var elem of obj) {
                str += ","+OV.toJSONString(elem);
            }
            return "["+str.substr(1)+"]";
        }
        else if(typeof obj == "object") {
            var str = "";
            for(var key in obj) {
                if(obj.hasOwnProperty(key)) {
                    str += '"'+key+'": '+OV.toJSONString(obj[key])+",\n";
                }
            }
            return "{\n"+str.substr(0, str.length-2)+"\n}";
        }
        else if(typeof obj == "function"){
            return obj.toString();
        }
        else {
            return JSON.stringify(obj);
        }
    }
    export namespace tools {
        export function eventOne(elem : Node, type: string) {
            return new Promise(function(resolve, reject){
                elem.addEventListener(type, function one(e : Event){
                    resolve(e);
                    elem.removeEventListener(type, one);
                });
            });
        }
        export function objToHash(obj: Object) : string {
            if(obj) {
                return "?hash="+encodeURIComponent(JSON.stringify(obj));
            }
            else {
                return "";
            }
        }
        export function hashToObj(hashStr : string) : Object|null {
            var hash = parseUrlQuery(hashStr).hash;
            if(hash == "" || hash == undefined) {
                return null;
            }
            else {
                return JSON.parse(hash);
            }
        }
        export function getAbsoluteUrl(url : string) : string {
            let a = document.createElement('a');
            a.href = url;
            url = a.href;
            return url;
        }
        export function unpackJS(source: string) : string
        {
            function getUnbase(base : number) {
                var ALPHABET = "";
                if     (base > 62) ALPHABET = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
                else if(base > 54) ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                else if(base > 52) ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQR';
                else               ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP';
                return function(val : string) {
                    if( 2 <= base && base <= 36)
                    {
                        return parseInt(val,base);
                    }
                    else{
                        var valArray = val.split('').reverse();
                        var ret = 0;
                        for(var i = 0; i < valArray.length ; i++)
                        {
                            var cipher = valArray[i];
                            ret += Math.pow(base, i) * ALPHABET.indexOf(cipher);
                        }
                        return ret;
                    }
                };
            }
            var out = source.match(/}\('(.*)', *(\d+), *(\d+), *'(.*?)'\.split\('\|'\)/);
            
            // Payload
            var payload = out[1];
            // Words
            var symtab = out[4].split(/\|/); 
            // Radix
            var radix = parseInt(out[2]);
            // Words Count
            var count = parseInt(out[3]);
            
            if( count != symtab.length ) {
                throw Error("Malformed p.a.c.k.e.r symtab !");
            }
            
            var unbase = getUnbase(radix);
            
            function lookup(matches : any)
            {
                var word = matches;
                var ub = symtab[unbase(word)];
                var ret = ub ? ub : word;
                return ret;
            }
            
            var result = payload.replace(/\b\w+\b/g, lookup);
            result = result.replace(/\\/g, '');
            return result;
        }
        let parseUrlOptions = {
            strictMode: false,
            key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
            q:   {
                name:   "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };
        export interface URL {
             source?: string; 
             protocol?: string;
             host?: string;
             port?: string;
             path?: string;
             query?: StringMap;
             queryStr?: string;
        }
        export function parseUrl(str: string) : URL {
            var o : any  = parseUrlOptions,
                m : any  = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
                uri : any = {},
                i   = 14;

            while (i--) uri[o.key[i]] = m[i] || "";

            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0 : any, $1 : any, $2 : any) {
                if ($1) uri[o.q.name][$1] = $2;
            });
            (<any>uri).queryString = (<any>uri).query;
            (<any>uri).query = parseUrlQuery(str);
            return uri;
        }
        export function parseUrlQuery(url : string) : StringMap {
            if(url.indexOf("?") == -1) {
                return {};
            }
          var query_string : any = {};
          var query = url.substr(url.indexOf("?")+1);
          var vars = query.split("&");
          for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
                // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
              query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
              var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
              query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
              query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
          } 
          return query_string;
        }
        export function getUrlFileName(url: string) : Promise<string> {
            return createRequest({url: url, type: HTTPMethods.HEAD }).then(function(xhr){
                var  filename  = ((xhr.getResponseHeader("content-disposition") || "").match(/filename="([^"]*)/) || [] )[1];
                if(filename && filename != "") {
                    return filename;
                }
                else {
                    return decodeURIComponent(url.substring(url.lastIndexOf('/')+1).replace(/[&\?].*/, ""));
                }
            });
        }
        export function getRedirectedUrl(url: string) : Promise<String> {
            return createRequest({url: url, type: HTTPMethods.HEAD }).then(function(xhr){
                return xhr.responseURL;
            });
            
        }
        export function objToURLParams(obj: StringMap) : string {
            var str = "";
            for (var key in obj) {
                str += "&" + key + "=" + encodeURIComponent(obj[key]);
            }
            return str.substr(1);
        }
        export function addParamsToURL(url: string, obj: StringMap) : string {
            if(obj) {
                return url + (url.lastIndexOf("?") < url.lastIndexOf("/") ? "?" : "&") + objToURLParams(obj);
            }
            else {
                return url;
            }
        }
        export const enum HTTPMethods {
            GET = "GET",
            POST = "POST",
            HEAD = "HEAD"
        }
        export function createRequest(args: { url: string; type?: HTTPMethods; protocol?: string; cache?: boolean; headers?: StringMap; xmlHttpObj?: XMLHttpRequest; formData?: StringMap; data?: StringMap; beforeSend?: (xhr: XMLHttpRequest) => void; }) : Promise<XMLHttpRequest> {
            return new Promise<XMLHttpRequest>((resolve, reject) => {
                var xmlHttpObj = args.xmlHttpObj || new XMLHttpRequest();
                var type = args.type || HTTPMethods.GET;
                var protocol = args.protocol || "https://";
                var url  = OV.tools.addParamsToURL(args.url, args.data).replace(/[^:]+:\/\//, protocol);
               
                xmlHttpObj.open(type, url, true); 
                xmlHttpObj.onload = function() {
                    if(xmlHttpObj.status == 200) {
                        resolve(xmlHttpObj);
                    }
                    else {
                       
                        reject(Error(xmlHttpObj.statusText + " (url: '"+url+"')"));
                    }
                };
                xmlHttpObj.onerror = function() {
                   
                    reject(Error("Network Error (url: '"+url+"')"));
                };
                
                if(args.headers) {
                    for(var key in args.headers) {
                        xmlHttpObj.setRequestHeader(key, args.headers[key]);
                    }
                }
                let formData : FormData = null;
                if(args.formData) {
                    formData = new FormData();
                    for(var key in args.formData) {
                        formData.append(key, args.formData[key]);
                    }
                }
                
                
                if(args.cache == false) {
                    xmlHttpObj.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
                    xmlHttpObj.setRequestHeader('cache-control', 'max-age=0');
                    xmlHttpObj.setRequestHeader('expires', '0');
                    xmlHttpObj.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
                    xmlHttpObj.setRequestHeader('pragma', 'no-cache');
                }
                if(args.beforeSend) {
                    args.beforeSend(xmlHttpObj);
                }
                xmlHttpObj.send(formData);
                
                
                
                
            });
        }
    }
    
    export namespace html {
        export function getAttributes(elem: HTMLElement) : StringMap {
            let hash : StringMap = {};
            for(let i=0;i<elem.attributes.length;i++){
                hash[elem.attributes[i].name] = elem.attributes[i].value;
            }
            return hash;
        }
        export function addAttributeListener(elem: HTMLElement, attribute: string, callback: (attribute: string, value: string, lastValue: string, elem: HTMLElement) => void ) {
            var lastValue : string = elem.getAttribute(attribute);
            setInterval( function() {   
               var value = elem.getAttribute(attribute);
               
                if (value != lastValue) {
                    callback.call(elem, attribute, value, lastValue, elem);   
                    lastValue = value;
                }
            },10);
        }
    }
    
        export namespace page {
            export function isReady() {
                return new Promise(function(resolve, reject){
                    if(document.readyState.match(/(loaded|complete)/)) {
                        return Promise.resolve();
                    }
                    else {
                        return OV.tools.eventOne(document, "DOMContentLoaded").then(function(e : Event){
                            resolve();
                        });
                    }
                });
            }
            
            export function injectScript(file : string) {
                return new Promise(function(resolve, reject){
                    var script = document.createElement('script');
                    script.src = chrome.extension.getURL("/assets/js/lib/"+file+".js");
                    script.async = true;
                    script.onload = function (){
                        script.onload = null;
                        resolve(script);
                    };
                    document.body.appendChild(script);
                });
            }
            export function injectScripts(files: string[]) {
                return Promise.all(files.map(injectScript));
            }

            export function injectRawJS(source : ((data: StringMap) => void) | string, data?: StringMap) {
                return new Promise(function(resolve, reject){
                    var injectStr = source.toString();
                    injectStr = "("+source+")("+JSON.stringify(data||{})+");";
                    var script = document.createElement('script');
                    script.appendChild(document.createTextNode(injectStr));
                    script.async = true;
                    script.onload = function (){
                        script.onload = null;
                        resolve(script);
                    };
                    document.body.appendChild(script);
                });
            }
            
            export function execute(files : string[], source: (data: StringMap, sendResponse: (data: StringMap) => void) => void, data?: StringMap) : Promise<StringMap> {
                return new Promise<StringMap>(function(resolve, reject){
                    if(files.indexOf("openvideo") == -1) {
                        files.unshift("openvideo");
                    }
                    
                    OV.messages.addListener({
                        ovInjectResponse: function(request, sendResponse) {
                            if(request.data.response) {
                                resolve(request.data.response);
                            }
                            return { blocked: true };
                        }
                    });
                    var sendResponse = function (resData : any) : void {
                        OV.messages.send({ func: "ovInjectResponse", data: { response: resData } });
                    }
                    injectScripts(files).then(function(scripts){  
                        return injectRawJS("function(data){ ("+source+")(data, ("+sendResponse+")); }", data); 
                    });
                });
            }
            
            export function lookupCSS(args : { key?: string; value?: RegExp|string; }, callback : (obj : { cssRule: any, key: string, value: RegExp|string, match: any }) => void) : void {
                for (let styleSheet of document.styleSheets as any){
                    try {
                        for(let cssRule of styleSheet.cssRules) {
                            
                                if(cssRule.style) {
                                    if(args.key) {
                                        if(cssRule.style[args.key].match(args.value)) {
                                            callback({ cssRule: cssRule, key: args.key, value: args.value, match: cssRule.style[args.key].match(args.value) });
                                        }
                                    }
                                    else if(args.value) {
                                        for(var style of cssRule.style) {
                                            if(cssRule.style[style] && cssRule.style[style].match(args.value)) {
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
                    catch(e){};
                }
            }

            export function getUrlObj() : any {
                return OV.tools.hashToObj(document.location.href);
            }
            export function getObjUrl(obj : Object) : string {
                return location.href.substr(location.href.indexOf("?hash="))+OV.tools.objToHash(obj);
            }
            export function isFrame() : boolean {
                try {
                    return self !== top;
                } catch (e) {
                    return true;
                }
            }
            export interface Wrapper<T> {
                [key:string]: WrapperEntry<T>;
            }
            export interface WrapperEntry<T> {
                get: (target: T) => any;
                set?: (target: T, value: any) => void;
            }
            export function wrapType<T extends Object>(origConstr: new (...args: any[]) => T, wrapper: Wrapper<T>) : void{
                (<any>window)[origConstr.name] = function (a : any,b : any,c : any,d : any,e : any,f : any) {
                    var obj = new origConstr(a,b,c,d,e,f);
                    var proxyWrapper = new Proxy(obj, { 
                        get: function(target : any, name : string) {
                            if(wrapper[name]) {
                                return wrapper[name].get(target);
                            }
                            else if(typeof (<any>target)[name] === "function") {
                                return (<any>target)[name].bind(target);
                            }
                            else {
                                return (<any>target)[name];
                            }
                        }, set: function(target : any, name : string, value : any){
                            if(wrapper[name]) {
                                if(wrapper[name].set) {
                                    wrapper[name].set(target, value);
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
        }
    
   
    /*OV.tab.setIconPopup = function(url) {
        OV.background.execute("setIconPopup", null, {url: url});
    }
    OV.tab.setIconText = function(text) {
        OV.background.execute("setIconText",null, {text: text});
    }*/
    export namespace storage {
        export const enum StorageScopes {
            Local = "local",
            Sync = "sync"
        }
        export function get(scope: StorageScopes, name: string) : Promise<any> {
            return new Promise(function(resolve, reject){
                if(scope == StorageScopes.Local) {
                    chrome.storage.local.get(name, function(item){
                        resolve(item[name]);
                    });
                }
                else if(scope == StorageScopes.Sync) {
                    chrome.storage.sync.get(name, function(item){
                        resolve(item[name]);
                    });
                }
            });
        }
        export function set(scope: StorageScopes, name: string, value: any) : Promise<{success: boolean}> {
            return new Promise(function(resolve, reject){
                if(scope == StorageScopes.Local) {
                    chrome.storage.local.set({[name]: value}, function(){
                        resolve({ success: true });
                    });
                }
                else if(scope == StorageScopes.Sync) {
                    chrome.storage.sync.set({[name]: value}, function(){
                        resolve({ success: true });
                    });
                }
            })
        }
        export function setup() {
            OV.messages.setupBackground({
                getStorageData: function(msg, bgdata: any, sender, sendResponse) {
                    get(bgdata.scope, bgdata.name).then(sendResponse, sendResponse);
                },
                setStorageData: function(msg, bgdata: any, sender, sendResponse) {
                    set(bgdata.scope, bgdata.name, bgdata.value).then(sendResponse, sendResponse);
                }
            });
        }
        export namespace local {
            export function get(name: string) : Promise<any>{
                if(OV.environment.isBackgroundPage()) {
                    return OV.storage.get(StorageScopes.Local, name);
                }
                else {
                    return OV.messages.send({bgdata: { func: "getStorageData", data: { scope: "local", name: name } } }).then(function(response){
                        return response.data;
                    });
                }
            }
            export function set(name: string, value: any) : Promise<{success: boolean}>{
                if(OV.environment.isBackgroundPage()) {
                    return OV.storage.set(StorageScopes.Local, name, value);
                }
                else {
                    return OV.messages.send({bgdata: { func: "setStorageData", data: { scope: "local", name: name, value: value } } }).then(function(){
                        return { success: true};
                    });
                }
            }
        }
        export namespace sync {
            export function get(name: string) : Promise<any> {
                if(OV.environment.isBackgroundPage()) {
                    return OV.storage.get(StorageScopes.Sync, name);
                }
                else {
                    return OV.messages.send({bgdata: { func: "getStorageData", data: { scope: "sync", name: name } } }).then(function(response){
                        return response.data;
                    });
                }
            }
            export function set(name: string, value: any) : Promise<{success: boolean}> {
                if(OV.environment.isBackgroundPage()) {
                    return OV.storage.set(StorageScopes.Sync, name, value);
                }
                else {
                    return OV.messages.send({bgdata: { func: "setStorageData", data: { scope: "sync", name: name, value: value } } }).then(function(){
                        return { success: true};
                    });
                }
            }
        }
    }
    export namespace environment {
        let _isBGPage = false;
        export function declareBGPage() : void {
            _isBGPage = true;
        }
        export function getVidPlaySiteUrl(vidHash: VideoTypes.VideoData) : string {
            return chrome.extension.getURL("/html/VidPlaySite/VidPlaySite.html")+OV.tools.objToHash(vidHash);
        }
        export function getVidPopupSiteUrl(vidHash: Object) : string {
            return chrome.extension.getURL("/html/VideoPopup/VideoPopup.html")+OV.tools.objToHash(vidHash);
        }
        export function getOptionsSiteUrl() : string {
            return chrome.extension.getURL("/html/OptionsSite/OptionsSite.html");
        }
        export function getLibrarySiteUrl() : string {
            return chrome.extension.getURL("/html/LibrarySite/librarySite.html");
        }
        export function isExtensionPage(url: string) : boolean {
            if(OV.environment.browser() == OV.environment.Browsers.Chrome) {
                return url.indexOf("chrome-extension://") != -1;
            }
            else {
                return url.indexOf("moz-extension://") != -1;
            }
        }
        export function getRoot() : string {
            return chrome.extension.getURL("");
        }
        export function isBackgroundPage() : boolean {
            return _isBGPage;
        }
        export function getManifest() : any {
            return chrome.runtime.getManifest();
        }
        export const enum Browsers {
            Chrome = "chrome",
            Firefox = "firefox"
        }
        export function browser() : Browsers {
            if(navigator.userAgent.search("Firefox") != -1) {
                return Browsers.Firefox;
            }
            else if(navigator.userAgent.search("Chrome") != -1) {
                return Browsers.Chrome;
            }
            else {
                throw Error("User agentis neither chrome nor Firefox");
            }
        }
    }
    
    export namespace analytics {
        function generateCID() : string {

            var ts = Math.round(+new Date() / 1000.0);
            var rand  = Math.round(Math.random() * 2147483647);
            return [rand, ts].join('.');

        }
        export function getCID() : Promise<string> {
            return OV.storage.sync.get("AnalyticsCID").then(function(cid){
                if(!cid) {
                    cid = generateCID();
                    OV.storage.sync.set("AnalyticsCID", cid);
                }
                return cid;
            });
        }
        export function postData(data: StringMap) : Promise<XMLHttpRequest> {
            return OV.storage.sync.get("AnalyticsEnabled").then(function(value){
                if(value || value == undefined) {
                    return getCID().then(function(cid){
                        data = Object.assign({v: 1, tid: "UA-118573631-1", cid: cid}, data);
                        return OV.tools.createRequest({
                            url: "https://www.google-analytics.com/collect",
                            type: OV.tools.HTTPMethods.POST,
                            data: data
                        });
                    });
                }
                return Promise.reject(Error("Analytics is disabled!"));
            });
        }
        export function send(data: StringMap) : Promise<{success: boolean}> {
            if(OV.environment.isBackgroundPage()) {
                return postData(data).then(function(){ return {success: true } });
            }
            else {
                return OV.messages.send({ bgdata: { func: "analytics", data: data as StringMap} }).then(function(){ return {success: true } });
            }
        }
        export function fireEvent(category: string, action: string, label: string) {
            send({t: "event", ec: category, ea: action, el: label});
        }
    }
    export namespace proxy {
        export function setupBG() : void {
            OV.messages.setupBackground({
                proxySetup: function(data, bgdata : Proxy, sender, sendResponse) { 
                    _setup({ip: bgdata.ip, port: bgdata.port, country: bgdata.country}).then(sendResponse); 
                },
                proxyUpdate: function(data, bgdata, sender, sendResponse) { 
                    _update().then(sendResponse); 
                },
                proxyRemove: function(data, bgdata, sender, sendResponse) { 
                    _remove(); 
                },
                proxyAddHostToList: function(data, bgdata, sender, sendResponse) { 
                    _addHostToList(bgdata.host); 
                },
                proxyNewProxy: function(data, bgdata, sender, sendResponse) { 
                    _newProxy().then(sendResponse);
                },
                proxyGetCurrent: function(data, bgdata, sender, sendResponse) {
                    sendResponse(currentProxy);
                }
            });
        }
        export interface Proxy {
            ip: string;
            port: number;
            country?: string;
            anonymity?: string;
        }
        let currentProxy : Proxy|null = null;
        export function setup(proxy: Proxy) : Promise<Proxy> {
            
            if(OV.environment.isBackgroundPage()) {
                return _setup(proxy);
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxySetup", data: { proxy: proxy } } }).then(function(response){
                    return response.data;
                });
            }
        }
        function _setup(proxy: Proxy) : Promise<Proxy> {
            return new Promise(function(resolve, reject){
                
                remove();
                currentProxy = proxy;
                OV.storage.sync.set("ProxyEnabled", currentProxy);
                if(OV.environment.browser() == OV.environment.Browsers.Chrome) {
                    var config = {
                        mode: "pac_script",
                        pacScript: {
                            data:   "function FindProxyForURL(url, host) {"+
                                        "var hosts = "+JSON.stringify(hosts)+";"+
                                        "for(var host of hosts) {"+
                                            "if(url.indexOf(host) != -1) {"+
                                                "return 'PROXY "+proxy.ip+":"+proxy.port+"';"+
                                            "}"+
                                        "}"+
                                        "return 'DIRECT';"+
                                    "}"
                        }
                    };
                    chrome.proxy.settings.set({value: config, scope: 'regular'});
                }
                else {
                    browser.proxy.register("/assets/js/pacFF.js");
                    browser.runtime.sendMessage({ proxy: currentProxy, hosts: hosts}, {toProxyScript: true});
                }
                resolve(currentProxy);
            });
        }
        export function update() : Promise<Proxy> {
            if(OV.environment.isBackgroundPage()) {
                return _update();
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxyUpdate", data: {} } }).then(function(response){
                    return response.data;
                });
            }
        }
        function _update() : Promise<Proxy> {
            if(_isEnabled()) {
                return setup(currentProxy);
            }
            else {
                return Promise.reject(Error("Proxy can't be updated not enabled!"));
            }
        }
        export function newProxy() : Promise<Proxy> {
            if(OV.environment.isBackgroundPage()) {
                return _newProxy();
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxyNewProxy", data: {} } }).then(function(response){
                    return response.data;
                });
            }
        }
        let triedProxies : Array<string> = [];
        let proxies : Array<Proxy> = [];
        function _newProxy() : Promise<Proxy> {
            if(_isEnabled()) {
                triedProxies.push(currentProxy.ip);
            }
            if(proxies.length == 0 || triedProxies.length > 20 || triedProxies.length == proxies.length) {
                return searchProxies().then(function(newproxies){
                    proxies = newproxies;
                    triedProxies = [];
                    
                    for(var proxy of proxies) {
                        if(triedProxies.indexOf(proxy.ip) == -1) {
                            return _setup(proxy);
                        }
                    }
                    throw Error("Something went wrong!");
                });
            }
            else {
                for(var proxy of proxies) {
                    if(triedProxies.indexOf(proxy.ip) == -1) {
                        return _setup(proxy);
                    }
                }
                throw Error("Something went wrong!");
            }
            
        }
        export function isEnabled() : Promise<boolean> {
            return getCurrentProxy().then(function(proxy){
                
                return proxy != null;
            });
        }
        function _isEnabled() : boolean {
            return currentProxy != null;
        }
        export function getCurrentProxy() : Promise<Proxy> {
            if(OV.environment.isBackgroundPage()) {
                return Promise.resolve(currentProxy);
            }
            else {
                return OV.messages.send({ bgdata: { func: "proxyGetCurrent", data: {} } }).then(function(response){
                    return response.data;
                });
            }
        }
        export function remove() {
            if(OV.environment.isBackgroundPage()) {
                _remove();
            }
            else {
                OV.messages.send({ bgdata: { func: "proxyRemove", data: {} } });
            }
        }
        function _remove() {
            if(OV.environment.browser() == OV.environment.Browsers.Chrome) {
                chrome.proxy.settings.clear({});
            }
            else {
                browser.proxy.unregister();
            }
            currentProxy = null;
            OV.storage.sync.set("ProxyEnabled", false);
        }
        function searchProxies() : Promise<Array<Proxy>> {
            var url = "https://free-proxy-list.net/anonymous-proxy.html";
            return OV.tools.createRequest({ url: url }).then(function(xhr){
                let HTML = (new DOMParser()).parseFromString(xhr.response, "text/html");
                
                var table = HTML.getElementsByTagName("table")[0];
                var tableRows = table.getElementsByTagName("tr");
                var proxies : Array<Proxy> = [];
                for(let row of tableRows) {
                    if(row.cells[4].innerText == "elite proxy") {
                        proxies.push({ 
                            ip: row.cells[0].innerText,
                            port: parseInt(row.cells[1].innerText),
                            country: row.cells[3].innerText,
                            anonymity: row.cells[4].innerText
                        });
                    }
                }
                return proxies;
            });
            
        }
        let hosts : Array<string> = [];
        export function addHostToList(host : string) : void {
            if(OV.environment.isBackgroundPage()) {
                _addHostToList(host);
            }
            else {
                OV.messages.send({ bgdata: { func: "proxyAddHostToList", data: { host: host } } });
            }
        }
        function _addHostToList(host : string) {
            if(hosts.indexOf(host) == -1) {
                hosts.push(host);
            }
        }
        export function addHostsToList(hosts : Array<string>) {
            for(var host of hosts) {
                _addHostToList(host);
            }
        }
    }
    export namespace languages {
        export function getMsg(msgName: string, args?: StringMap) {
            var msg = chrome.i18n.getMessage(msgName);
            if(args) {
                for(var key in args) {
                    msg = msg.replace("{"+key+"}",args[key]);
                }
            }
            return msg;
        }
    }
    export namespace messages {
        
        
        
        export enum State {
            EvToMdw = "EvToMdw",
            MdwToBG = "MdwToBG",
            BGToMdw = "BGToMdw",
            MdwToEv = "MdwToEv",
            EvToMdwRsp = "EvToMdwRsp",
            MdwToBGRsp = "MdwToBGRsp",
            BGToMdwRsp = "BGToMdwRsp",
            MdwToEvRsp = "MdwToEvRsp"
        }
        export interface BackgroundData {
            data: any;
            func: string;
        }
        export interface Message {
            data: any;
            state: State;
            sender: chrome.runtime.MessageSender;
        }
        export interface Request extends Message {
            func: string;
            bgdata: BackgroundData|null;
        }
        export interface Response extends Message {
            call: Request;
        }
        interface EventMessage<T extends Message> {
            hash: string;
            data: T;
        }
        export function generateHash() : string {
            var ts = Math.round(+new Date() / 1000.0);
            var rand = Math.round(Math.random() * 2147483647);
            return [rand, ts].join('.');
        }
        export interface ListenerSetup
        {
            [key:string]: (request: Request, sendResponse: (obj: any) => void) => void|{blocked: boolean } 
        }
        let lnfunctions : ListenerSetup = null;
        let blockedFuncs : Array<string> = [];
        export function addListener(functions:  ListenerSetup) : void {
            if(lnfunctions) {
                lnfunctions = OV.object.merge(lnfunctions, functions);
            }
            else {
                lnfunctions = functions;
                document.addEventListener('ovmessage', function(event : CustomEvent){
                    var details = event.detail as EventMessage<Request>;
                    
                    if(lnfunctions[details.data.func] && details.data.state === State.MdwToEv && blockedFuncs.indexOf(details.data.func) == -1) {
                        try {
                            var result = lnfunctions[details.data.func](details.data, function(data){
                                
                                var event = new CustomEvent('ovmessage', { 
                                    detail: {
                                        hash: details.hash, 
                                        data: {
                                            data: data, 
                                            state: State.EvToMdwRsp, 
                                            call: details.data, 
                                            sender: { url: location.href } 
                                        } 
                                    } as EventMessage<Response> 
                                });
                                document.dispatchEvent(event);
                            });
                        }
                        catch(e) {
                            throw { error: e, sender: details.data.sender };
                        }
                        if(result && result.blocked) {
                            blockedFuncs.push(details.data.func);
                        }
                    }
                });
            }
        }
        export function send(obj : { data?: any;  func?: string; bgdata?: BackgroundData|null }) : Promise<Response> {
            
            return eventPingPong({ 
                func: obj.func || "NO_FUNCTION", 
                data: obj.data || {}, 
                sender: { url: location.href }, 
                bgdata: obj.bgdata, 
                state: State.EvToMdw 
            }, true);
        }
        function eventPingPong(data: Request, beforeBG : boolean) : Promise<Response>{
            return new Promise(function(resolve, reject){
                data.state = beforeBG ? State.EvToMdw : State.MdwToEv;
               
                let hash = OV.messages.generateHash();
                let one = function(event : CustomEvent) : void {
                    var details = event.detail as EventMessage<Response>;
                    if(details.hash === hash && details.data.state === (beforeBG ? State.MdwToEvRsp : State.EvToMdwRsp)) {
                        document.removeEventListener('ovmessage', one);
                        
                        resolve(details.data);
                    }
                };
                document.addEventListener('ovmessage', one);
                
                let event = new CustomEvent('ovmessage', { 
                    detail: { 
                        hash: hash, 
                        data: data
                    } as EventMessage<Request>
                });
                document.dispatchEvent(event);
            });
            
        }
        let isMiddleware_ = false;
        export function isMiddleware() {
            return isMiddleware;
        }
        export function setupMiddleware() {
            if(isMiddleware_) {
                throw Error("Middleware already set up!")
            }
            else {
                isMiddleware_ = true;
                document.addEventListener('ovmessage', function(event : CustomEvent){
                    var details = event.detail as EventMessage<Request>;
                    if(details.data.state === State.EvToMdw) {
                        details.data.state = State.MdwToBG;
                       
                        if(details.data.bgdata) {
                            
                            chrome.runtime.sendMessage(details.data, function(resData : Response){
                                if(resData.state === State.BGToMdwRsp) {
                                    
                                    var event = new CustomEvent('ovmessage', { 
                                        detail: { 
                                            hash: details.hash, 
                                            data: {
                                                data: resData.data, 
                                                state: State.MdwToEvRsp, 
                                                call: resData.call,
                                                sender: resData.sender
                                            }
                                        } as EventMessage<Response>
                                    });
                                    document.dispatchEvent(event);
                                }
                                else {
                                    throw Error("Wrong Response!")
                                }
                            });
                        }
                        else {
                            
                            eventPingPong(details.data, false).then(function(response){
                                
                                var event = new CustomEvent('ovmessage', { 
                                    detail: { 
                                        hash: details.hash, 
                                        data: {
                                            data: response.data, 
                                            state: State.MdwToEvRsp, 
                                            call: response.call,
                                            sender: response.sender
                                        }
                                    } as EventMessage<Response>
                                });
                                document.dispatchEvent(event);
                            });
                        }
                    }
               
                });
                chrome.runtime.onMessage.addListener(function(msg : Request, sender, sendResponse){
                    if(msg.state === State.BGToMdw) {
                        
                        eventPingPong({ 
                            func: msg.func, 
                            data: msg.data, 
                            sender: sender,  
                            state: State.MdwToEv, 
                            bgdata: msg.bgdata 
                        }, false).then(function(response){
                           
                            sendResponse({ data: response.data, state: State.MdwToBGRsp, call: response.call, sender: response.sender } as Response);
                        });
                        return true;
                    }
                    return false;
                });
            }
        }
        let bgfunctions : BackgroundSetup = null;
        export interface BackgroundSetup
        {
            [key:string]: (msg: Request, bgData: any, sender: chrome.runtime.MessageSender, sendResponse: (obj: any) => void) => void;
        }
        export function setupBackground(functions: BackgroundSetup) {
            if(bgfunctions) {
                bgfunctions = OV.object.merge(bgfunctions, functions);
            }
            else {
                bgfunctions = functions;
                chrome.runtime.onMessage.addListener(function(msg : Request, sender, sendResponse){
                    if(msg.state === State.MdwToBG) {
                       
                        if(bgfunctions[msg.bgdata.func]) {
                            bgfunctions[msg.bgdata.func]({ func: msg.func, data: msg.data, state: State.BGToMdw, sender: sender, bgdata: msg.bgdata }, msg.bgdata.data, sender, function(response : any){
                               
                                sendResponse({ data: response, state: State.BGToMdwRsp, call: msg, sender: sender } as Response)
                            });
                            return true;
                        }
                        
                    }
                    return false;
                });
            }
        }
    } 
    
}