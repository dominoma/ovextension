var ScriptBase;
(function (ScriptBase) {
    ;
    ;
    let redirectHosts = [];
    function addRedirectHost(redirectHost) {
        redirectHosts.push(redirectHost);
    }
    ScriptBase.addRedirectHost = addRedirectHost;
    function startScripts(scope) {
        for (let host of redirectHosts) {
            let match = location.href.match(host.script.urlPattern);
            if (match) {
                for (let runScope of host.script.runScopes) {
                    if (runScope.run_at == scope) {
                        runScope.script({ url: location.href, match: match }).then(function (videoData) {
                            videoData.origin = location.href;
                            videoData.host = host.name;
                            location.href = OV.environment.getVidPlaySiteUrl(videoData);
                        });
                    }
                }
            }
        }
    }
    ScriptBase.startScripts = startScripts;
})(ScriptBase || (ScriptBase = {}));
//# sourceMappingURL=redirect_script_base.js.map