var OVPlayer;
(function (OVPlayer) {
    function parseSrt(dataAndEvents, oncue) {
        function trim(dataAndEvents) {
            return (dataAndEvents + "").replace(/^\s+|\s+$/g, "");
        }
        function parseCueTime(dataAndEvents) {
            var parts = dataAndEvents.split(":");
            /** @type {number} */
            var sum = 0;
            var minutes;
            var part;
            var url;
            var x;
            var i;
            if (parts.length == 3) {
                minutes = parts[0];
                part = parts[1];
                url = parts[2];
            }
            else {
                minutes = "0";
                part = parts[0];
                url = parts[1];
            }
            url = url.split(/\s+/);
            x = url.splice(0, 1)[0];
            x = x.split(/\.|,/);
            i = parseFloat(x[1]);
            x = x[0];
            sum += parseFloat(minutes) * 3600;
            sum += parseFloat(part) * 60;
            sum += parseFloat(x);
            if (i) {
                sum += i / 1E3;
            }
            return sum;
        }
        if (dataAndEvents == "") {
            alert("Invalid srt file!");
        }
        var tempData;
        var splitted;
        var collection;
        var nodes = dataAndEvents.split("\n");
        var resp = "";
        var user_id;
        var cuelength = 0;
        var n = nodes.length;
        for (var i = 1; i < n; ++i) {
            resp = trim(nodes[i]);
            if (resp) {
                if (resp.indexOf("-->") == -1) {
                    user_id = resp;
                    resp = trim(nodes[++i]);
                }
                else {
                    user_id = cuelength;
                }
                tempData = {
                    id: user_id,
                    index: cuelength,
                    startTime: undefined,
                    endTime: undefined,
                    text: ""
                };
                splitted = resp.split(/[\t ]+/);
                tempData.startTime = parseCueTime(splitted[0]);
                tempData.endTime = parseCueTime(splitted[2]);
                /** @type {Array} */
                collection = [];
                for (; nodes[++i] && (resp = trim(nodes[i]));) {
                    collection.push(resp);
                }
                tempData.text = collection.join("\n");
                oncue({ id: "", startTime: tempData.startTime, endTime: tempData.endTime, text: tempData.text, pauseOnExit: false });
                cuelength += 1;
            }
        }
    }
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
        var Player = videojs(playerId, options);
        Player.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
        Player.getActiveVideoSource = function () {
            for (var src of videoData.src) {
                if (Player.src().indexOf(src.src) == 0) {
                    return src;
                }
            }
            return null;
        };
        var FavButton = Player.getChild('controlBar').addChild('FavButton', {});
        var DownloadButton = Player.getChild('controlBar').addChild('DownloadButton', {});
        var PatreonButton = Player.getChild('controlBar').addChild('PatreonButton', {});
        Player.on("ready", function () {
            Player.on("ratechange", function () {
                OV.analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin);
            });
            Player.controlBar.el().insertBefore(FavButton.el(), Player.controlBar.subsCapsButton.el());
            Player.controlBar.el().insertBefore(DownloadButton.el(), Player.controlBar.fullscreenToggle.el());
            Player.controlBar.el().insertBefore(PatreonButton.el(), Player.controlBar.fullscreenToggle.el());
            OV.storage.sync.get("PlayerVolume").then(function (volume) {
                if (volume) {
                    Player.volume(volume);
                }
            });
            Player.on('volumechange', function () {
                OV.storage.sync.set("PlayerVolume", Player.volume());
            });
        });
        Player.controlBar.subsCapsButton.eventBusEl_.addEventListener('DOMNodeInserted', function (event) {
            if (event.target.className == "vjs-menu") {
                var subsArr = event.target.getElementsByTagName("li");
                for (var i = 4; i < subsArr.length; i++) {
                    if (Player.textTracks()[i - 2] && Player.textTracks()[i - 2].src) {
                        subsArr[i].appendChild(OVPlayer.createDownloadButton(Player.textTracks()[i - 2].src));
                    }
                }
            }
        });
        Player.setVideoData = function (videoData) {
            Player.poster(videoData.poster);
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
                Player.src(srces[0]);
            }
            else {
                Player.updateSrc(srces);
                var srcArray = Player.controlBar.resolutionSwitcher.getElementsByTagName("li");
                for (var i = 0; i < srcArray.length; i++) {
                    if (srces[i].dlsrc) {
                        srces[i] = { label: srces[i].label, src: srces[i].dlsrc.src, type: srces[i].dlsrc.type };
                    }
                    srcArray[i].appendChild(OVPlayer.createDownloadButton(srces[i].src, "[" + srces[i].label + "]" + videoData.title + "." + srces[i].type.substr(srces[i].type.indexOf("/") + 1), srces[i].type));
                }
                ;
            }
            clearAllTextTracks(Player);
            for (let track of videoData.tracks) {
                Player.addRemoteTextTrack(track, true);
                console.log(track);
            }
        };
        Player.getVideoData = function () {
            return videoData;
        };
        Player.setVideoData(videoData);
        var Parent = document.getElementById(playerId).parentNode;
        /*new ResizeSensor(Parent, function(){
            Player.aspectRatio(Parent.clientWidth+":"+Parent.clientHeight);
        });*/
        Player.aspectRatio(Parent.clientWidth + ":" + Parent.clientHeight);
        Player.saveToHistory = function () {
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
                            stoppedTime: Player.currentTime()
                        };
                        //Player.getVideoFileHash(function(fileHash){
                        //HistHash.fileHash = fileHash;
                        history.unshift(histHash);
                        OV.storage.local.set("OpenVideoHistory", history);
                        //});
                    });
                }
            });
        };
        Player.loadFromHistory = function () {
            OV.storage.local.get("OpenVideoHistory").then(function (history) {
                if (history) {
                    //Player.getVideoFileHash(function(fileHash){
                    var item = OV.array.search(videoData.origin, history, function (origin, arrElem) {
                        return arrElem.origin == origin;
                    });
                    if (item) {
                        Player.currentTime(item.stoppedTime);
                    }
                    //});
                }
            });
        };
        Player.on('loadedmetadata', function () {
            Player.loadFromHistory();
            FavButton.updateDesign();
        });
        document.body.onmouseleave = function () {
            if (Player.currentTime() != 0) {
                Player.saveToHistory();
            }
        };
        return Player;
    }
    OVPlayer.initPlayer = initPlayer;
    function clearAllTextTracks(player) {
        function loadSrtFromUrl() {
            var url = prompt("Please enter the url of the subtitle file you want to use");
            if (url != null && url != "") {
                OV.tools.createRequest({ url: url }).then(function (xhr) {
                    var srcContent = xhr.responseText;
                    //function (srcContent) {
                    if (srcContent.indexOf("-->") !== -1) {
                        OV.tools.getUrlFileName(url).then(function (fn) {
                            player.addTextTrack("captions", fn, "su");
                            var track = player.textTracks()[player.textTracks().length - 1];
                            parseSrt(srcContent, function (cue) {
                                track.addCue(cue);
                            });
                        });
                    }
                    else {
                        alert("Invaid subtitle file");
                    }
                });
                //});
            }
        }
        ;
        function loadSrtFromFile() {
            var srtSelector = document.getElementById("srtSelector");
            srtSelector.addEventListener("change", function () {
                var collection = new FileReader;
                collection.onload = function (dataAndEvents) {
                    if (collection.result.indexOf("-->") !== -1) {
                        player.addTextTrack("captions", srtSelector.files[0].name, "su");
                        var track = player.textTracks()[player.textTracks().length - 1];
                        parseSrt(collection.result, function (cue) {
                            track.addCue(cue);
                        });
                    }
                    else {
                        alert("Invaid subtitle file");
                    }
                };
                collection.readAsText(srtSelector.files[0], "ISO-8859-1");
            });
            document.getElementById("srtSelector").click();
        }
        player.addRemoteTextTrack({ kind: "caption", label: "load VTT/SRT from URL", language: "FromURL", src: "" }, false);
        player.textTracks().on('change', function () {
            if (player.textTracks()[0] != undefined && player.textTracks()[0].mode == "showing") {
                loadSrtFromUrl();
                player.textTracks()[0].mode = "disabled";
            }
        });
        player.addRemoteTextTrack({ kind: "caption", label: "load VTT/SRT from File", language: "FromFile", src: "" }, false);
        player.textTracks().on('change', function () {
            if (player.textTracks()[1] != undefined && player.textTracks()[1].mode == "showing") {
                loadSrtFromFile();
                player.textTracks()[1].mode = "disabled";
            }
        });
        var Menu = player.controlBar.subsCapsButton.menu.el_;
        console.log(Menu);
        Menu.style = "width:200px; left:-80px;";
        Menu.childNodes[0].style = "overflow: hidden;";
    }
})(OVPlayer || (OVPlayer = {}));
//# sourceMappingURL=openvideo_player.js.map