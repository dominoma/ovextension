

namespace ScriptBase {
    
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
    
    
    let redirectHosts : Array<RedirectHost> = [];
    export function addRedirectHost(redirectHost: RedirectHost) : void {
        redirectHosts.push(redirectHost);
    }
    export function startScripts(scope: RunScopes) : void {
        for(let host of redirectHosts) {
            isScriptEnabled(host.name).then(function(isEnabled){
                if(isEnabled) {
                    for(let script of host.scripts) {
                        let match = location.href.match(script.urlPattern);
                        if(match) {
                            for(let runScope of script.runScopes) {
                                if(runScope.run_at == scope) {
                                    document.documentElement.hidden = runScope.hide_page !== false;
                                    runScope.script({ url: location.href, match: match, hostname: host.name, run_scope: runScope.run_at }).then(function(videoData){
                                        videoData.origin = location.href;
                                        videoData.host = host.name;
                                        location.href = OV.environment.getVidPlaySiteUrl(videoData);
                                    }).catch(function(error : Error){
                                        document.documentElement.hidden = false;
                                        console.error(error);
                                        OV.analytics.fireEvent(host.name, "Error", JSON.stringify({ msg: error.message, url: location.href, stack: error.stack }))
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    export function getRedirectHosts() : Promise<Array<RedirectHost>> {
        return Promise.resolve().then(function(){
            if(OV.environment.isBackgroundPage()) {
                return redirectHosts;
            }
            else {
                return OV.messages.send({ bgdata: { func: "redirectHosts", data: {} } }).then(function(response){
                    return response.data.redirectHosts;
                });
            }
        });
    }
    export function isScriptEnabled(name : string) : Promise<boolean> {
        return OV.storage.sync.get(name).then(function(value) {
            
            return value == true || value == undefined || value == null;
        });
    }
    export function setScriptEnabled(name: string, enabled: boolean) : Promise<{success: boolean}> {
        return OV.storage.sync.set(name, enabled);
    }

}

