OV.messages.setupMiddleware();
var VideoSearch;
(function (VideoSearch) {
    ScriptBase.isScriptEnabled("All videos").then(function (value) {
        if (value) {
            OV.messages.addListener({
                pauseVideos: function () {
                    for (let video of document.getElementsByTagName("video")) {
                        video.pause();
                    }
                    ;
                }
            });
            OV.page.injectScripts(["openvideo", "messages"]).then(function () {
                OV.page.injectScript("video_search_inject");
            });
        }
    });
})(VideoSearch || (VideoSearch = {}));
//# sourceMappingURL=video_search.js.map