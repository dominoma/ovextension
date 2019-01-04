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
    OVPlayer.initPlayer('openVideo', {}, Hash);
    //document.body.style.display = 'none'
    //document.body.style.display = 'block'
    if (OV.page.isFrame()) {
        var TheaterButton = OVPlayer.getPlayer().getChild('controlBar').addChild('TheaterButton', {});
        OVPlayer.getPlayer().on("ready", function () {
            /*TheatreMode.setupIframe({frameWidth: window.innerWidth, frameHeight: window.innerHeight}).then(function(data){
                if(data && data.reload) {
                    location.reload();
                }
            });*/
            OVPlayer.getPlayer().controlBar.el().insertBefore(TheaterButton.el(), OVPlayer.getPlayer().controlBar.fullscreenToggle.el());
        });
        OVPlayer.getPlayer().on("fullscreenchange", function () {
            TheaterButton.el().style.display = OVPlayer.getPlayer().isFullscreen() ? "none" : "inherit";
        });
    }
    OVPlayer.getPlayer().on('error', function () {
        if (OVPlayer.getPlayer().readyState() == 0) {
            //if(Response.status == 404 || Response.status == 400 || Response.status == 403) {
            var url = OVPlayer.getPlayer().getVideoData().origin;
            var templateParams = {
                url: url,
                host: Hash.scriptName,
                exception: OVPlayer.getPlayer().error().message,
                version: OV.environment.getManifest().version,
                browser: OV.environment.browser()
            };
            console.log(templateParams);
            OV.analytics.fireEvent(templateParams.host, "Error", JSON.stringify(templateParams));
            //}
            //document.location.replace(Hash.vidSiteUrl + (Hash.vidSiteUrl.indexOf("?") == -1 ? "?" : "&") + "ignoreRequestCheck=true");
        }
        else {
            OVPlayer.getPlayer().bigPlayButton.on("click", function () {
                location.replace(OVPlayer.getPlayer().getVideoData().origin);
            });
            OVPlayer.getPlayer().bigPlayButton.addClass("reloadButton");
        }
    });
});
//# sourceMappingURL=VidPlaySite.js.map