import * as VideoTypes from "./video_types";

import * as Tools from "./OV/tools";
import * as Analytics from "./OV/analytics";
import * as Environment from "./OV/environment";
import * as Messages from "./OV/messages";
import * as Storage from "./OV/storage";
import * as VideoHistory from "Messages/videohistory";
import * as Page from "OV/page";

let redirectHosts: Array<RedirectHost> = [];

export interface ScriptDetails {
    url: string;
    match: RegExpMatchArray;
    hostname: string;
    run_scope: RunScopes;
}
export type RedirectScript = (details: ScriptDetails) => Promise<VideoTypes.RawVideoData>;
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



export function addRedirectHost(redirectHost: RedirectHost): void {
    redirectHosts.push(redirectHost);
}
export function isUrlRedirecting(url: string) {
    if (Tools.parseURL(url).query["ovignore"] != "true") {
        return false;
    }
    else {
        for (let host of redirectHosts) {
            for (let script of host.scripts) {
                if (url.match(script.urlPattern)) {
                    return true;
                }
            }
        }
        return false;
    }
}
function getFavicon() {
    let link = document.documentElement.innerHTML.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
    if(link) {
        let favicon = link[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
        if(favicon) {
            return favicon[1];
        }
    }
    return "";
}
export async function startScripts(scope: RunScopes, onScriptExecute: () => Promise<void>, onScriptExecuted: (videoData : VideoTypes.VideoData) => Promise<void> ){
    if (Tools.parseURL(location.href).query["ovignore"] != "true") {
        for (let host of redirectHosts) {
            let isEnabled = await isScriptEnabled(host.name);
            if (isEnabled) {
                for (let script of host.scripts) {
                    let match = location.href.match(script.urlPattern);
                    if (match) {
                        console.log("Redirect with " + host.name)
                        for (let runScope of script.runScopes) {
                            if (runScope.run_at == scope) {
                                document.documentElement.hidden = runScope.hide_page !== false;
                                try {
                                    await onScriptExecute();
                                    console.log("script executed");
                                    let rawVideoData = await runScope.script({ url: location.href, match: match, hostname: host.name, run_scope: runScope.run_at });
                                    let parent = null;
                                    console.log(Page.isFrame())
                                    if(Page.isFrame()) {
                                        parent = await VideoHistory.getPageRefData();
                                    }
                                    let videoData = Tools.merge(rawVideoData, {
                                        origin: {
                                            name: host.name,
                                            url: location.href,
                                            icon: getFavicon()
                                        },
                                        parent: parent
                                    });
                                    videoData = VideoTypes.makeURLsSave(videoData);
                                    await onScriptExecuted(videoData);
                                    console.log("script executed", videoData);
                                    location.href = Environment.getVidPlaySiteUrl(videoData);
                                }
                                catch(error) {
                                    document.documentElement.hidden = false;
                                    console.error(error);
                                    Analytics.fireEvent(host.name, "Error", JSON.stringify(Environment.getErrorMsg({ msg: error.message, url: location.href, stack: error.stack })))
                                };
                            }
                        }
                    }
                }
            }
        }
    }
}
export async function isScriptEnabled(name: string) {
    let value = await Storage.sync.get(name);
    return value == true || value == undefined || value == null;
}
export async function setScriptEnabled(name: string, enabled: boolean) {
    return Storage.sync.set(name, enabled);
}
export async function setupBG() {
    Messages.setupBackground({
        redirect_script_base_getRedirectHosts: async function() {
            return redirectHosts;
        }
    });
}
export async function getRedirectHosts() {
    if(Environment.isBackgroundScript()) {
        console.log(redirectHosts);
        return redirectHosts;
    }
    else {
        let response = await Messages.sendToBG({ func: "redirect_script_base_getRedirectHosts", data: {} });
        console.log(response);
        return response.data as Array<RedirectHost>;
    }
}
