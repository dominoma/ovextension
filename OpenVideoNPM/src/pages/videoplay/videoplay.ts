import * as Analytics from "OV/analytics";
import * as Page from "OV/page";
import * as Languages from "OV/languages";
import * as Environment from "OV/environment";
import * as Proxy from "OV/proxy";

import * as Metadata from "Messages/metadata";

import * as VideoTypes from "video_types";
import * as OVPlayer from "ov_player";

import videojs_raw from "video.js";

declare var videojs: typeof videojs_raw;


//declare var videojs : typeof videojs.default;
Page.isReady().then(function() {
    //(window as any).video_js_1.default = (window as any).videojs;
    Metadata.requestPlayerCSS().then(function(css) {
        if (css && css.doChange) {

            Page.lookupCSS({ value: /rgba?\(141, 199, 63,?([^\)]*)?\)/ }, function(data) {
                data.cssRule.style[data.key!] = css.color;
            });
            Page.lookupCSS({ value: /url\("\/assets\/icons\/playNormal\.png"\)/ }, function(data) {
                data.cssRule.style[data.key!] = css.playimage;
            });
            Page.lookupCSS({ value: /url\("\/assets\/icons\/playHover\.png"\)/ }, function(data) {
                data.cssRule.style[data.key!] = css.playhoverimage;
            });
            /*lookupCSS({ value: 'url("/assets/icons/reloadNormal.png")' }, function(data){
                data.cssRule.style[data.key] = response.reloadimage;
            });
            lookupCSS({ value: 'url("/assets/icons/reloadHover.png")' }, function(data){
                data.cssRule.style[data.key] = response.reloadhoverimage;
            });*/
        }
    });
    Proxy.getCurrentProxy().then(function(proxy) {
        var msg = "";
        if (proxy) {
            msg = Languages.getMsg("video_player_err_msg_proxy");
        }
        else {
            msg = Languages.getMsg("video_player_err_msg");
        }
        videojs.addLanguage('en', { "The media could not be loaded, either because the server or network failed or because the format is not supported.": msg });
    });
    console.log(document.readyState)
    document.getElementById("js_err_msg")!.innerText = Languages.getMsg("video_player_js_err_msg");

    var Hash = Page.getUrlObj() as VideoTypes.VideoData;
    document.title = Hash.title + " - OpenVideo"
    Analytics.fireEvent(Hash.host, "HosterUsed", "");
    OVPlayer.initPlayer('openVideo', {}, Hash);
    //document.body.style.display = 'none'
    //document.body.style.display = 'block'
    if (Page.isFrame()) {
        var TheaterButton = OVPlayer.getPlayer().getChild('controlBar')!.addChild('TheaterButton', {});
        OVPlayer.getPlayer().on("ready", function() {
            /*TheatreMode.setupIframe({frameWidth: window.innerWidth, frameHeight: window.innerHeight}).then(function(data){
                if(data && data.reload) {
                    location.reload();
                }
            });*/
            OVPlayer.getPlayer().controlBar.el().insertBefore(TheaterButton.el(), (OVPlayer.getPlayer().controlBar as any).fullscreenToggle.el());
        });
        OVPlayer.getPlayer().on("fullscreenchange", function() {
            (TheaterButton.el() as HTMLElement).style.display = OVPlayer.getPlayer().isFullscreen() ? "none" : "inherit";
        });
    }
    OVPlayer.getPlayer().on('error', function() {
        if ((OVPlayer.getPlayer() as any).readyState() == 0) {
            //if(Response.status == 404 || Response.status == 400 || Response.status == 403) {

            Analytics.fireEvent(Hash.host, "Error", JSON.stringify(Environment.getErrorMsg({ msg: OVPlayer.getPlayer().error()!.message, url: Hash.origin })));
            //}
            //document.location.replace(Hash.vidSiteUrl + (Hash.vidSiteUrl.indexOf("?") == -1 ? "?" : "&") + "ignoreRequestCheck=true");
        }
        else {
            OVPlayer.getPlayer().bigPlayButton.on("click", function() {
                location.replace(OVPlayer.getPlayer().getVideoData().origin);
            });
            OVPlayer.getPlayer().bigPlayButton.addClass("reloadButton");
        }

    });
});
