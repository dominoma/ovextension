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
type RedirectScriptCtor = new (hostname : string) => RedirectScript;
export abstract class RedirectScript {

    private readonly urlPattern_ : RegExp;
    private readonly details_ : ScriptDetails;

    constructor(hostname : string, urlPattern : RegExp) {
        this.urlPattern_ = urlPattern;
        this.details_ = {
            url: location.href,
            match: location.href.match(this.urlPattern_)!,
            hostname: hostname
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

    get canExec() {
        return this.urlPattern_.test(location.href)
            && Tools.parseURL(location.href).query["ovignore"] != "true";
    }

    checkForSubtitles(html : string) {
        if (html.match(/(<track[^>]*src=|\.vtt|"?tracks"?: \[\{)/)) {
            Analytics.fireEvent(this.details.hostname, "TracksFound", this.details.url)
        }
    }

    document_start() : Promise<VideoTypes.RawVideoData> | null {
        return null;
    }

    document_idle() : Promise<VideoTypes.RawVideoData> | null {
        return null;
    }

    document_end() : Promise<VideoTypes.RawVideoData> | null {
        return null;
    }

}

export abstract class RedirectHost {

    get hostname() {
        return this.constructor.name;
    }

    get isEnabled() {
        return Storage.isScriptEnabled(this.hostname);
    }

    abstract getScripts() : RedirectScriptCtor[];

    get canExec() {
        return this.getScripts().map((ctor)=>{
            return new ctor(this.hostname);
        }).some((el)=>{
            return el.canExec;
        })
    }

    private getFavicon() {
        let link = document.documentElement.innerHTML.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
        if(link) {
            let favicon = link[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
            if(favicon) {
                return favicon[1];
            }
        }
        return "https://s2.googleusercontent.com/s2/favicons?domain_url="+location.host;
    }

    private async getVideoData(rawVideoData : VideoTypes.RawVideoData) {
        let parent = null as VideoTypes.PageRefData | null;
        console.log(Page.isFrame())
        if(Page.isFrame()) {
            parent = await VideoHistory.getPageRefData();
        }
        let videoData = Tools.merge(rawVideoData, {
            origin: {
                name: this.hostname,
                url: location.href,
                icon: this.getFavicon()
            },
            parent: parent
        });
        return VideoTypes.makeURLsSave(videoData);
    }

    async run(scope : RunScopes, onScriptExecute: () => Promise<void>, onScriptExecuted: (videoData : VideoTypes.VideoData) => Promise<void>) {

        let scripts = this.getScripts().map((ctor)=>{
            return new ctor(this.hostname);
        });
        let script = scripts.find((script)=>{
            return script.canExec;
        });
        if(script) {
            try {
                let promise = script[scope]();
                if(promise) {
                    document.documentElement.hidden = script.hidePage;
                    await onScriptExecute();
                    let rawVideoData = await promise;
                    let videoData = await this.getVideoData(rawVideoData);
                    await onScriptExecuted(videoData);
                    location.replace(Environment.getVidPlaySiteUrl(videoData));
                    return true;
                }
            }
            catch(error) {
                document.documentElement.hidden = false;
                console.error(error);
                Analytics.fireEvent(this.hostname, "Error", JSON.stringify(Environment.getErrorMsg({ msg: error.message, url: location.href, stack: error.stack })))
            }
        }
        return false;
    }

}
type HostJSON = {
    name: string;
    scripts: [
        { urlPattern: RegExp }
    ]
}
class RedirectHostsManager {

    private hosts_ = [] as RedirectHost[];

    addRedirectHost(host : RedirectHost) {
        let hostExists = this.hosts_.some((el)=>{
            return el.hostname == host.hostname;
        });
        if(hostExists) {
            throw new Error("A host with name '"+host.hostname+"'  is already registred!");
        }
        else {
            this.hosts_.push(host);
        }
    }

    async run(scope : RunScopes, onScriptExecute: () => Promise<void>, onScriptExecuted: (videoData : VideoTypes.VideoData) => Promise<void>) {

        let host = this.hosts_.find((host)=>{
            return host.canExec;
        })

        if(host) {
            let enabled = await host.isEnabled;
            if(enabled) {
                let hasExec = await host.run(scope, onScriptExecute, onScriptExecuted);
                if(hasExec) {
                    return true;
                }
            }
        }
        return false;
    }

    private getJSON() {
        return this.hosts_.map((el)=>{
            return {
                name: el.hostname,
                scripts: el.getScripts().map((ctor)=>{
                    return {
                        urlPattern: (new ctor(el.hostname)).urlPattern
                    };
                })
            }
        })
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

    async setupBG() {
        Messages.setupBackground({
            redirect_script_base_getRedirectHosts: async () => {
                return this.getJSON();
            }
        });
    }

    get hosts() {
        return this.getRedirectHosts();
    }
}

export default new RedirectHostsManager();
