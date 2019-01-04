var OVPlayer;
(function (OVPlayer) {
    window["Worker"] = undefined;
    OV.messages.setupMiddleware();
    OV.page.wrapType(XMLHttpRequest, {
        open: {
            get: function (target) {
                return function (method, url) {
                    if (getPlayer() && getPlayer().currentType().match(/application\//i) && !url.match(/OVReferer/i)) {
                        arguments[1] = url + (url.indexOf("?") == -1 ? "?" : "&") + "OVreferer=" + encodeURIComponent(btoa(OV.page.getUrlObj().origin));
                    }
                    target.open.apply(target, arguments);
                };
            }
        }
    });
    let player = null;
    function getPlayer() {
        return player;
    }
    OVPlayer.getPlayer = getPlayer;
    function initPlayer(playerId, options, videoData) {
        options = OV.object.merge(options, {
            plugins: {
                videoJsResolutionSwitcher: {
                    dynamicLabel: true
                }
            },
            /*chromecast:{
                 appId:'APP-ID'
            },*/
            playbackRates: [0.5, 1, 2],
            language: OV.languages.getMsg("video_player_locale")
        });
        player = videojs(playerId, options);
        player.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
        player.getActiveVideoSource = function () {
            for (var src of videoData.src) {
                if (player.src().indexOf(src.src) == 0) {
                    return src;
                }
            }
            return null;
        };
        player.on("ready", function () {
            player.el().style.width = "100%";
            player.el().style.height = "100%";
            let ControlBar = player.getChild('controlBar');
            var FavButton = ControlBar.addChild('FavButton', {});
            var DownloadButton = ControlBar.addChild('DownloadButton', {});
            var PatreonButton = ControlBar.addChild('PatreonButton', {});
            var FullscreenToggle = ControlBar.getChild('fullscreenToggle');
            var CaptionsButton = ControlBar.getChild('SubsCapsButton');
            CaptionsButton.show();
            player.on("ratechange", function () {
                OV.analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
            });
            player.controlBar.el().insertBefore(FavButton.el(), CaptionsButton.el());
            player.controlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
            player.controlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
            OV.storage.sync.get("PlayerVolume").then(function (volume) {
                if (volume) {
                    player.volume(volume);
                }
            });
            player.on('volumechange', function () {
                OV.storage.sync.set("PlayerVolume", player.volume());
            });
            player.on('loadedmetadata', function () {
                player.loadFromHistory();
                FavButton.updateDesign();
            });
            document.body.onmouseleave = function () {
                if (player.currentTime() != 0) {
                    player.saveToHistory();
                }
            };
        });
        player.setVideoData = function (videoData) {
            player.poster(OV.tools.addParamsToURL(videoData.poster, { OVReferer: encodeURIComponent(btoa(videoData.origin)) }));
            var srces = videoData.src;
            var checkedSrces = [];
            for (var src of srces) {
                if (src.src != "") {
                    src.src = src.src + (src.src.indexOf("?") == -1 ? "?" : "&") + "isOV=true";
                    checkedSrces.push(src);
                }
            }
            srces = checkedSrces;
            if (srces.length == 1) {
                player.src(srces[0]);
            }
            else {
                player.updateSrc(srces);
            }
            for (let track of videoData.tracks) {
                OVPlayer.addTextTrack(player, track);
                //player.addRemoteTextTrack(<any>track, true);
            }
        };
        player.getVideoData = function () {
            return videoData;
        };
        player.setVideoData(videoData);
        //player.aspectRatio("0:0");
        player.saveToHistory = function () {
            OV.storage.sync.get("disableHistory").then(function (disabled) {
                if (!disabled) {
                    OV.storage.local.get("OpenVideoHistory").then(function (history) {
                        if (!history) {
                            history = [];
                        }
                        var itemIndex = history.indexOf(OV.array.search(videoData.origin, history, function (origin, arrElem) {
                            return arrElem.origin == origin;
                        }));
                        if (itemIndex != -1) {
                            history.splice(itemIndex, 1);
                        }
                        var histHash = {
                            poster: videoData.poster,
                            title: videoData.title,
                            origin: videoData.origin,
                            stoppedTime: player.currentTime()
                        };
                        //player.getVideoFileHash(function(fileHash){
                        //HistHash.fileHash = fileHash;
                        history.unshift(histHash);
                        OV.storage.local.set("OpenVideoHistory", history);
                        //});
                    });
                }
            });
        };
        player.loadFromHistory = function () {
            OV.storage.local.get("OpenVideoHistory").then(function (history) {
                if (history) {
                    //player.getVideoFileHash(function(fileHash){
                    var item = OV.array.search(videoData.origin, history, function (origin, arrElem) {
                        return arrElem.origin == origin;
                    });
                    if (item) {
                        player.currentTime(item.stoppedTime);
                    }
                    //});
                }
            });
        };
        return player;
    }
    OVPlayer.initPlayer = initPlayer;
})(OVPlayer || (OVPlayer = {}));
//# sourceMappingURL=openvideo_player.js.map