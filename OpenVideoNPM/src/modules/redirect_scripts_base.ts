import * as VideoTypes from "./video_types";

import * as Tools from "./OV/tools";
import * as Analytics from "./OV/analytics";
import * as Environment from "./OV/environment";
import * as Messages from "./OV/messages";
import * as Storage from "./OV/storage";
import * as VideoHistory from "Messages/videohistory";
import * as Page from "OV/page";

export interface ScriptDetails {
    url: string;
    match: RegExpMatchArray;
    hostname: string;
}
//export type RedirectScript = (details: ScriptDetails) => Promise<VideoTypes.RawVideoData>;
export const enum RunScopes {
    document_start = "document_start",
    document_idle = "document_idle",
    document_end = "document_end"
}
type RedirectScriptCtor = new (hostname : string, url : string) => RedirectScript;
export abstract class RedirectScript {

    private readonly urlPattern_ : RegExp;
    private readonly details_ : ScriptDetails;

    constructor(hostname : string, url: string, urlPattern : RegExp) {
        this.urlPattern_ = urlPattern;
        this.details_ = {
            url,
            match: url.match(this.urlPattern_)!,
            hostname
        }
    }

    get urlPattern() {
        return this.urlPattern_;
    }

    get details() {
        return this.details_;
    }

    get hidePage() {
        return true;
    }

    get runAsContentScript() {
        return false;
    }

    get canExec() {
        return this.details_.match
            && Tools.parseURL(location.href).query["ovignore"] != "true";
    }

    checkForSubtitles(html : string) {
        if (html.match(/(<track[^>]*src=|\.vtt|"?tracks"?: \[\{)/)) {
            Analytics.tracksFound(this.details.hostname, this.details.url)
        }
    }

    abstract getVideoData() : Promise<VideoTypes.RawVideoData>;

}

export abstract class RedirectHost {

    private readonly url_ : string;
    private readonly scripts: RedirectScript[];
    private readonly runnable_ : RedirectScript | null;

    constructor(url : string) {
        this.url_ = url;
        this.scripts = this.getScripts().map(ctor => new ctor(this.hostname, this.url_));
        this.runnable_ = this.scripts.find(script => script.canExec) || null;
    }

    get url() {
        return this.url_;
    }

    get hostname() {
        return this.constructor.name;
    }

    getJSON() {
        return {
            scripts: this.scripts.map((script) =>{
                return { url: script.urlPattern }
            })
        };
    }

    isEnabled() {
        return Storage.isScriptEnabled(this.hostname);
    }

    abstract getScripts() : RedirectScriptCtor[];

    get runAsContentScript() {
        return !!this.runnable_ && this.runnable_.runAsContentScript;
    }

    get canExec() {
        return !!this.runnable_;
    }

    get hidePage() {
        return !!this.runnable_ && this.runnable_.hidePage;
    }

    get runAsPlayerScript() {
        return !!this.runnable_ && !this.runnable_.runAsContentScript;
    }

    private getFavicon() {
        /*let link = html.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
        if(link) {
            let favicon = link[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
            if(favicon) {
                return favicon[1];
            }
        }*/
        return "https://s2.googleusercontent.com/s2/favicons?domain_url="+Tools.parseURL(this.url_);
    }

    private async getVideoData(rawVideoData : VideoTypes.RawVideoData) {
        let parent = null as VideoTypes.PageRefData | null;
        if(Page.isFrame()) {
            parent = await VideoHistory.getPageRefData();
        }
        let videoData = Tools.merge(rawVideoData, {
            origin: {
                name: this.hostname,
                url: this.url_,
                icon: this.getFavicon()
            },
            parent: parent
        });
        return VideoTypes.makeURLsSave(videoData);
    }

    async extractVideoData() {
        if(!this.canExec) {
            throw new Error(`Script '${this.hostname}' can't execute on url '${this.url_}'`);
        }
        let videoData = await this.runnable_!.getVideoData();
        return this.getVideoData(videoData);
    }

}
type HostJSON = {
    name: string;
    scripts: {
        url: RegExp
    }[]
}
type RedirectHostCtor = new (url : string) => RedirectHost;
class RedirectHostsManager {

    private readonly hosts_ = [] as RedirectHostCtor[];

    addRedirectHost(host : RedirectHostCtor) {
        this.hosts_.push(host);
    }

    getHosts(url : string) {
        return this.hosts_.map(ctor => new ctor(url));
    }

    private getJSON() : HostJSON [] {
        return this.getHosts("").map(host => ({
            name: host.hostname,
            scripts: host.getJSON().scripts
        }));
    }

    private async getRedirectHosts() {
        if(Environment.isBackgroundScript()) {
            return this.getJSON();
        }
        else {
            let response = await Messages.sendToBG({ func: "redirect_script_base_getRedirectHosts", data: {} });
            return response.data as Array<HostJSON>;
        }
    }

    async getVideoData(url : string) {
        let runnable = this.getHosts(url).find(host => host.canExec);
        if(!runnable) {
            throw new Error(`No matching script for url '${url}'`);
        }
        else {
            return runnable.extractVideoData();
        }
    }

    async executeContentScript() {
        let runnable = this.getHosts(location.href).find(host => host.canExec);
        if(runnable) {
            let enabled = await runnable.isEnabled();
            if(enabled) {
                try {
                    document.documentElement.hidden = runnable.hidePage;
                    let videoData = await runnable.extractVideoData();
                    location.replace(Environment.getVidPlaySiteUrl(videoData))
                    return true;
                }
                catch(error) {
                    document.documentElement.hidden = false;
                    console.error(error);
                    Analytics.hosterError(runnable.hostname, error);
                }
            }
        }
        return false;
    }

    async getHostsEnabled() {
        return (await Promise.all(this.getJSON().map(async (el)=>{
            return { name: el.name, enabled: await Storage.isScriptEnabled(el.name) };
        }))).reduce((acc, el)=>{
            acc[el.name] = el.enabled;
            return acc;
        }, {} as { [key:string]: boolean });
    }

    async setupBG() {
        Messages.setupBackground({
            redirect_script_base_getRedirectHosts: async () => {
                return this.getJSON();
            }
        });
        let enabled = await this.getHostsEnabled();
        chrome.webRequest.onBeforeRequest.addListener((details)=>{
            let query = Tools.parseURL(details.url).query;
            if(!query["isOV"] && !query["OVReferer"]) {
                let host = this.getHosts(details.url).find(el => el.runAsPlayerScript);
                if(host && enabled[host.hostname]) {
                    return { redirectUrl: Environment.getVidPlaySiteUrl({ url: details.url }) }
                }
            }
        }, { urls: ["<all_urls>"] }, ["blocking"])
    }

    get hosts() {
        return this.getRedirectHosts();
    }
}

export default new RedirectHostsManager();
