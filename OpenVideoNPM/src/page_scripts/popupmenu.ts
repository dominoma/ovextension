import * as Storage from "OV/storage";
import * as Analytics from "OV/analytics";
import * as Page from "OV/page";
import * as Languages from "OV/languages";
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";
import * as Proxy from "OV/proxy";

import * as Background from "Messages/background";

import * as ScriptBase from "redirect_scripts_base";
import * as VideoTypes from "video_types";
console.log("test")
Page.isReady().then(function() {
    Messages.setupMiddleware();
    document.getElementById('library').innerText = Languages.getMsg("popup_menu_library_btn");
    document.getElementById('options').innerText = Languages.getMsg("popup_menu_options_btn");
    document.getElementById('enableProxy').innerText = Languages.getMsg("popup_menu_proxy_btn_enable");
    document.getElementById('disableProxy').innerText = Languages.getMsg("popup_menu_proxy_btn_disable");
    document.getElementById('hostSuggest').innerText = Languages.getMsg("popup_menu_suggest_host_btn");
    document.getElementById('movieSearch').appendChild(document.createTextNode(Languages.getMsg("popup_menu_search_movie_btn")));
    document.getElementById('rate').innerHTML = Languages.getMsg("popup_menu_rating_btn");
    document.getElementById('support').innerText = Languages.getMsg("popup_menu_support_btn");
    document.getElementById('versionBox').innerText = Languages.getMsg("popup_menu_version_lbl");

    document.getElementById('hostSuggest').addEventListener("click", function() {
        Background.openTab("https://youtu.be/rbeUGOkKt0o");
        window.close();
    });

    document.getElementById('patreon').addEventListener("click", function() {
        Background.openTab("https://www.patreon.com/bePatron?u=13995915");
        window.close();
    });

    document.getElementById('movieSearch').addEventListener("click", function() {
        Background.openTab(Environment.getVideoSearchUrl());
        window.close();
    });

    document.getElementById('library').addEventListener("click", function() {
        Background.openTab(Environment.getLibrarySiteUrl());
        window.close();
    });
    document.getElementById('options').addEventListener("click", function() {
        chrome.runtime.openOptionsPage();
        window.close();
    });
    document.getElementById('enableProxy').addEventListener("click", function() {
        Proxy.newProxy().then(function(proxy) {
            document.getElementById('proxyCountry').innerText = proxy.country;
        });
        document.getElementById('proxySettings').style.display = "flex";
        document.getElementById('enableProxy').hidden = true;
    });
    document.getElementById('newProxy').addEventListener("click", function() {
        Proxy.newProxy().then(function(proxy) {
            document.getElementById('proxyCountry').innerText = proxy.country;
        });
    });
    document.getElementById('proxyOptions').addEventListener("click", function() {
        Proxy.getCurrentProxy().then(function(proxy) {
            Background.prompt({
                msg: "Please enter the proxy IP and port of  the proxy you want to use.",
                fieldText: (proxy.country === "Custom" ? proxy.ip + ":" + proxy.port : "proxy-ip:port")
            }).then(function(response) {
                console.log(response);
                if (response.aborted) {
                    document.getElementById('proxyCountry').innerText = "Custom";
                    var data = response.text.split(":");
                    Proxy.setup({ ip: data[0], port: parseInt(data[1]), country: "Custom" });
                }
            });
        });

    });
    document.getElementById('disableProxy').addEventListener("click", function() {
        Proxy.remove();
        document.getElementById('proxySettings').style.display = "none";
        document.getElementById('enableProxy').hidden = false;
    });
    Proxy.getCurrentProxy().then(function(proxy) {
        console.log(proxy);
        if (proxy) {
            document.getElementById('proxySettings').style.display = "flex";
            document.getElementById('enableProxy').hidden = true;
            document.getElementById('proxyCountry').innerText = proxy.country;
        }
    });

    for (let elem of document.getElementsByClassName('links') as any) {
        elem.addEventListener('click', function() {
            Background.openTab(elem.dataset.href);
            window.close();
        });
    };
    document.getElementById('rate').addEventListener("click", function() {
        if (Environment.browser() == Environment.Browsers.Chrome) {
            Background.openTab("https://chrome.google.com/webstore/detail/openvideo-faststream/dadggmdmhmfkpglkfpkjdmlendbkehoh/reviews");
        }
        else {
            Background.openTab("https://addons.mozilla.org/firefox/addon/openvideo/");
        }
        window.close();
    });
    document.getElementById('versionBox').innerHTML = "Version " + Environment.getManifest().version;
});