

namespace ScriptBase {
    
    export interface ScriptDetails {
        url: string;
        match: RegExpMatchArray;
    }
    export type RedirectScript = (details: ScriptDetails) => Promise<VideoTypes.VideoData>;
    export const enum RunScopes {
        document_start = "document_start",
        document_idle = "document_idle",
        document_end = "document_end"
    }
    export interface RedirectScriptEntry {
        urlPattern: RegExp;
        runScopes: Array<{ run_at: RunScopes; script: RedirectScript; }>;
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
            for(let script of host.scripts) {
                let match = location.href.match(script.urlPattern);
                if(match) {
                    for(let runScope of script.runScopes) {
                        if(runScope.run_at == scope) {
                            runScope.script({ url: location.href, match: match }).then(function(videoData){
                                videoData.origin = location.href;
                                videoData.host = host.name;
                                location.href = OV.environment.getVidPlaySiteUrl(videoData);
                            });
                        }
                    }
                }
            }
        }
    }
    export function getRedirectHosts() : Array<RedirectHost> {
        return redirectHosts;
    }
    export function isScriptEnabled(name : string) : Promise<boolean> {
        return OV.storage.sync.get(name).then(function(value) {
            return value === true || value === undefined || value === null;
        });
    }
    export function setScriptEnabled(name: string, enabled: boolean) : Promise<{success: boolean}> {
        return OV.storage.sync.set(name, enabled);
    }

}

