OV.messages.setupMiddleware();
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('library').innerText = OV.languages.getMsg("popup_menu_library_btn");
    document.getElementById('options').innerText = OV.languages.getMsg("popup_menu_options_btn");
    document.getElementById('enableProxy').innerText = OV.languages.getMsg("popup_menu_proxy_btn_enable");
    document.getElementById('disableProxy').innerText = OV.languages.getMsg("popup_menu_proxy_btn_disable");
    document.getElementById('hostSuggest').innerText = OV.languages.getMsg("popup_menu_suggest_host_btn");
    document.getElementById('movieSearch').innerText = OV.languages.getMsg("popup_menu_search_movie_btn");
    document.getElementById('rate').innerHTML = OV.languages.getMsg("popup_menu_rating_btn");
    document.getElementById('support').innerText = OV.languages.getMsg("popup_menu_support_btn");
    document.getElementById('versionBox').innerText = OV.languages.getMsg("popup_menu_version_lbl");
    document.getElementById('hostSuggest').addEventListener("click", function () {
        OV.tab.create("https://youtu.be/rbeUGOkKt0o");
        window.close();
    });
    document.getElementById('patreon').addEventListener("click", function () {
        OV.tab.create("https://www.patreon.com/bePatron?u=13995915");
        window.close();
    });
    document.getElementById('movieSearch').addEventListener("click", function () {
        OV.tab.create("https://avalba.com/movies/");
        window.close();
    });
    document.getElementById('library').addEventListener("click", function () {
        OV.tab.create(OV.environment.getLibrarySiteUrl());
        window.close();
    });
    document.getElementById('options').addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
        window.close();
    });
    document.getElementById('enableProxy').addEventListener("click", function () {
        OV.proxy.newProxy().then(function (proxy) {
            document.getElementById('proxyCountry').innerText = proxy.country;
        });
        document.getElementById('proxySettings').style.display = "flex";
        document.getElementById('enableProxy').hidden = true;
    });
    document.getElementById('newProxy').addEventListener("click", function () {
        OV.proxy.newProxy().then(function (proxy) {
            document.getElementById('proxyCountry').innerText = proxy.country;
        });
    });
    document.getElementById('proxyOptions').addEventListener("click", function () {
        OV.proxy.getCurrentProxy().then(function (proxy) {
            Background.prompt({
                msg: "Please enter the proxy IP and port of  the proxy you want to use.",
                fieldText: (proxy.country === "Custom" ? proxy.ip + ":" + proxy.port : "proxy-ip:port")
            }).then(function (response) {
                console.log(response);
                if (response.data.text) {
                    document.getElementById('proxyCountry').innerText = "Custom";
                    var data = response.data.text.split(":");
                    OV.proxy.setup({ ip: data[0], port: parseInt(data[1]), country: "Custom" });
                }
            });
        });
    });
    document.getElementById('disableProxy').addEventListener("click", function () {
        OV.proxy.remove();
        document.getElementById('proxySettings').style.display = "none";
        document.getElementById('enableProxy').hidden = false;
    });
    OV.proxy.getCurrentProxy().then(function (proxy) {
        console.log(proxy);
        if (proxy) {
            document.getElementById('proxySettings').style.display = "flex";
            document.getElementById('enableProxy').hidden = true;
            document.getElementById('proxyCountry').innerText = proxy.country;
        }
    });
    for (let elem of document.getElementsByClassName('links')) {
        elem.addEventListener('click', function () {
            OV.tab.create(elem.dataset.href);
            window.close();
        });
    }
    ;
    document.getElementById('rate').addEventListener("click", function () {
        if (OV.environment.browser() == "chrome" /* Chrome */) {
            OV.tab.create("https://chrome.google.com/webstore/detail/openvideo-faststream/dadggmdmhmfkpglkfpkjdmlendbkehoh/reviews");
        }
        else {
            OV.tab.create("https://addons.mozilla.org/firefox/addon/openvideo/");
        }
        window.close();
    });
    document.getElementById('versionBox').innerHTML = "Version " + OV.environment.getManifest().version;
});
//# sourceMappingURL=PopupMenu.js.map