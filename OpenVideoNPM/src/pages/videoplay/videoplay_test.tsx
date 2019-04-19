import "./videoplay.scss";

import * as Analytics from "OV/analytics";
import * as Page from "OV/page";
import * as Languages from "OV/languages";
import * as Proxy from "OV/proxy";

import * as Metadata from "Messages/metadata";

import * as VideoTypes from "video_types";
import {OVPlayer} from "../assets/ts/ov_player_react";
import videojs from "video.js";

import * as React from "react";
import * as ReactDOM from "react-dom";

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
    let videoData = Page.getUrlObj() as VideoTypes.VideoData;
    ReactDOM.render(<OVPlayer videoData={videoData} isPopup={false}/>, document.body);
    document.title = videoData.title + " - OpenVideo"
    Analytics.fireEvent(videoData.origin.name, "HosterUsed", "");


});
