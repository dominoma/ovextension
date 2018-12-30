window["Worker"] = undefined;
OV.page.wrapType(XMLHttpRequest, {
    open: {
        get: function (target) {
            return function (method, url) {
                if (getPlayer() && getPlayer().currentType().indexOf("application/") != -1 && url.indexOf("OVreferer") == -1) {
                    arguments[1] = url + (url.indexOf("?") == -1 ? "?" : "&") + "OVreferer=" + encodeURIComponent(btoa(OV.page.getUrlObj().origin));
                }
                target.open.apply(target, arguments);
            };
        }
    }
});
var player = null;
function getPlayer() {
    return player;
}
OV.page.isReady().then(function (event) {
    OVMetadata.requestPlayerCSS().then(function (css) {
        if (css && css.doChange) {
            OV.page.lookupCSS({ value: /rgba?\(141, 199, 63,?([^\)]*)?\)/ }, function (data) {
                data.cssRule.style[data.key] = css.color;
            });
            OV.page.lookupCSS({ value: /url\("\/assets\/icons\/playNormal\.png"\)/ }, function (data) {
                data.cssRule.style[data.key] = css.playimage;
            });
            OV.page.lookupCSS({ value: /url\("\/assets\/icons\/playHover\.png"\)/ }, function (data) {
                data.cssRule.style[data.key] = css.playhoverimage;
            });
            /*lookupCSS({ value: 'url("/assets/icons/reloadNormal.png")' }, function(data){
                data.cssRule.style[data.key] = response.reloadimage;
            });
            lookupCSS({ value: 'url("/assets/icons/reloadHover.png")' }, function(data){
                data.cssRule.style[data.key] = response.reloadhoverimage;
            });*/
        }
    });
    OV.proxy.getCurrentProxy().then(function (proxy) {
        var msg = "";
        if (proxy) {
            msg = OV.languages.getMsg("video_player_err_msg_proxy");
        }
        else {
            msg = OV.languages.getMsg("video_player_err_msg");
        }
        videojs.addLanguage('en', { "The media could not be loaded, either because the server or network failed or because the format is not supported.": msg });
    });
    document.getElementById("js_err_msg").innerText = OV.languages.getMsg("video_player_js_err_msg");
    var Hash = OV.page.getUrlObj();
    document.title = Hash.title + " - OpenVideo";
    OV.analytics.fireEvent(Hash.scriptName, "HosterUsed", "");
    player = OVPlayer.initPlayer('openVideo', {}, Hash);
    //document.body.style.display = 'none'
    //document.body.style.display = 'block'
    if (OV.page.isFrame()) {
        var TheaterButton = getPlayer().getChild('controlBar').addChild('TheaterButton', {});
        getPlayer().on("ready", function () {
            /*TheatreMode.setupIframe({frameWidth: window.innerWidth, frameHeight: window.innerHeight}).then(function(data){
                if(data && data.reload) {
                    location.reload();
                }
            });*/
            getPlayer().controlBar.el().insertBefore(TheaterButton.el(), getPlayer().controlBar.fullscreenToggle.el());
        });
        getPlayer().on("fullscreenchange", function () {
            TheaterButton.el().style.display = getPlayer().isFullscreen() ? "none" : "inherit";
        });
    }
    getPlayer().on('error', function () {
        if (getPlayer().readyState() == 0) {
            //if(Response.status == 404 || Response.status == 400 || Response.status == 403) {
            var url = getPlayer().getVideoData().origin;
            var templateParams = {
                url: url,
                host: Hash.scriptName,
                exception: getPlayer().error().message,
                version: OV.environment.getManifest().version,
                browser: OV.environment.browser()
            };
            console.log(templateParams);
            OV.analytics.fireEvent(templateParams.host, "Error", JSON.stringify(templateParams));
            //}
            //document.location.replace(Hash.vidSiteUrl + (Hash.vidSiteUrl.indexOf("?") == -1 ? "?" : "&") + "ignoreRequestCheck=true");
        }
        else {
            getPlayer().bigPlayButton.on("click", function () {
                location.replace(getPlayer().getVideoData().origin);
            });
            getPlayer().bigPlayButton.addClass("reloadButton");
        }
    });
});
//# sourceMappingURL=VidPlaySite.js.map