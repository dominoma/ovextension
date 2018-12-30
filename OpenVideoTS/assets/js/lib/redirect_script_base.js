var ScriptBase;
(function (ScriptBase) {
    ;
    ;
    let redirectHosts = [];
    function addRedirectHost(redirectHost) {
        redirectHosts.push(redirectHost);
    }
    ScriptBase.addRedirectHost = addRedirectHost;
    function isUrlRedirecting(url) {
        if (OV.tools.parseUrlQuery(url)["ovignore"] != "true") {
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
    ScriptBase.isUrlRedirecting = isUrlRedirecting;
    function startScripts(scope) {
        if (OV.tools.parseUrlQuery(location.href)["ovignore"] != "true") {
            for (let host of redirectHosts) {
                isScriptEnabled(host.name).then(function (isEnabled) {
                    if (isEnabled) {
                        for (let script of host.scripts) {
                            let match = location.href.match(script.urlPattern);
                            if (match) {
                                console.log("Redirect with " + host.name);
                                if (OV.page.isFrame()) {
                                    TheatreMode.setupIframe();
                                }
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
                                            OV.analytics.fireEvent(host.name, "Error", JSON.stringify({ msg: error.message, url: location.href, stack: error.stack }));
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
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
                return OV.messages.send({ bgdata: { func: "redirectHosts", data: {} } }).then(function (response) {
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