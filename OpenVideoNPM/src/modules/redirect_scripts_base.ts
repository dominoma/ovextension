import * as VideoTypes from "./video_types";

import * as Tools from "./OV/tools";
import * as Analytics from "./OV/analytics";
import * as Environment from "./OV/environment";
import * as Page from "./OV/page";
import * as Messages from "./OV/messages";
import * as Storage from "./OV/storage";

let redirectHosts : Array<RedirectHost> = [];

export interface ScriptDetails {
    url: string;
    match: RegExpMatchArray;
    hostname: string;
    run_scope: RunScopes;
}
export type RedirectScript = (details: ScriptDetails) => Promise<VideoTypes.VideoData>;
export const enum RunScopes {
    document_start = "document_start",
    document_idle = "document_idle",
    document_end = "document_end"
}
export interface RedirectScriptEntry {
    urlPattern: RegExp;
    runScopes: Array<{ run_at: RunScopes; script: RedirectScript; hide_page?: boolean; }>;
};
export interface RedirectHost {
    name: string;
    scripts: Array<RedirectScriptEntry>;
};



export function addRedirectHost(redirectHost: RedirectHost) : void {
    redirectHosts.push(redirectHost);
}
export function isUrlRedirecting(url : string) {
    if(Tools.parseUrlQuery(url)["ovignore"] != "true") {
        return false;
    }
    else {
        for(let host of redirectHosts) {
            for(let script of host.scripts) {
                if(url.match(script.urlPattern)) {
                    return true;
                }
            }
        }
        return false;
    }
}
export function startScripts(scope: RunScopes) {
    return new Promise(function(resolve, reject){
        if(Tools.parseUrlQuery(location.href)["ovignore"] != "true") {
            for(let host of redirectHosts) {
                isScriptEnabled(host.name).then(function(isEnabled){
                    if(isEnabled) {
                        for(let script of host.scripts) {
                            let match = location.href.match(script.urlPattern);
                            if(match) {
                                console.log("Redirect with "+host.name)
                                for(let runScope of script.runScopes) {
                                    if(runScope.run_at == scope) {
                                        if(Page.isFrame()) {
                                            
                                            resolve();
                                        }
                                        document.documentElement.hidden = runScope.hide_page !== false;
                                        runScope.script({ url: location.href, match: match, hostname: host.name, run_scope: runScope.run_at }).then(function(videoData){
                                            videoData.origin = location.href;
                                            videoData.host = host.name;
                                            location.href = Environment.getVidPlaySiteUrl(videoData);
                                        }).catch(function(error : Error){
                                            document.documentElement.hidden = false;
                                            console.error(error);
                                            Analytics.fireEvent(host.name, "Error", JSON.stringify(Environment.getErrorMsg({ msg: error.message, url: location.href, stack: error.stack })))
                                        });
                                        
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    });
    
}
export function isScriptEnabled(name : string) : Promise<boolean> {
    return Storage.sync.get(name).then(function(value) {
        
        return value == true || value == undefined || value == null;
    });
}
export function setScriptEnabled(name: string, enabled: boolean) : Promise<{success: boolean}> {
    return Storage.sync.set(name, enabled);
}
export function getRedirectHosts() : Promise<Array<RedirectHost>> {
    return Promise.resolve().then(function(){
        if(Environment.isBackgroundPage()) {
            return redirectHosts;
        }
        else {
            return Messages.send({ bgdata: { func: "redirectHosts", data: {} } }).then(function(response){
                return response.data.redirectHosts;
            });
        }
    });
}


