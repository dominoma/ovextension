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
        script: RedirectScriptEntry;
    };
    
    
    let redirectHosts : Array<RedirectHost> = [];
    export function addRedirectHost(redirectHost: RedirectHost) : void {
        redirectHosts.push(redirectHost);
    }
    export function startScripts(scope: RunScopes) : void {
        for(let host of redirectHosts) {
            let match = location.href.match(host.script.urlPattern);
            if(match) {
                for(let runScope of host.script.runScopes) {
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

