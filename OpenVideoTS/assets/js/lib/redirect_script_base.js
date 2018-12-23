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
            for (let script of host.scripts) {
                let match = location.href.match(script.urlPattern);
                if (match) {
                    for (let runScope of script.runScopes) {
                        if (runScope.run_at == scope) {
                            document.documentElement.hidden = runScope.hide_page !== false;
                            runScope.script({ url: location.href, match: match, hostname: host.name, run_scope: runScope.run_at }).then(function (videoData) {
                                videoData.origin = location.href;
                                videoData.host = host.name;
                                location.href = OV.environment.getVidPlaySiteUrl(videoData);
                            }).catch(function (error) {
                                document.documentElement.hidden = false;
                                console.error(error);
                            });
                        }
                    }
                }
            }
        }
    }
    ScriptBase.startScripts = startScripts;
    function getRedirectHosts() {
        return Promise.resolve().then(function () {
            if (OV.environment.isBackgroundPage()) {
                return redirectHosts;
            }
            else {
                return OV.messages.send({ bgdata: { func: "redirectHosts" } }).then(function (response) {
                    return response.data.redirectHosts;
                });
            }
        });
    }
    ScriptBase.getRedirectHosts = getRedirectHosts;
    function isScriptEnabled(name) {
        return OV.storage.sync.get(name).then(function (value) {
            return value == true || value == undefined || value == null;
        });
    }
    ScriptBase.isScriptEnabled = isScriptEnabled;
    function setScriptEnabled(name, enabled) {
        return OV.storage.sync.set(name, enabled);
    }
    ScriptBase.setScriptEnabled = setScriptEnabled;
})(ScriptBase || (ScriptBase = {}));
//# sourceMappingURL=redirect_script_base.js.map