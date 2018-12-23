OV.messages.setupMiddleware();
var VideoSearch;
(function (VideoSearch) {
    ScriptBase.isScriptEnabled("All videos").then(function (value) {
        if (value) {
            console.log("WWWWW");
            OV.messages.addListener({
                pauseVideos: function () {
                    for (let video of document.getElementsByTagName("video")) {
                        video.pause();
                    }
                    ;
                }
            });
            OV.page.execute(function (data, sendResponse) {
                console.log("HIIII");
                function toSaveUrl(url) {
                    return OV.tools.getAbsoluteUrl(url);
                    //return x + (x.indexOf("?") == -1 ? "?" : "&") + "OVreferer="+encodeURIComponent(location.href)
                }
                function getVJSPlayerSrces(player) {
                    let hash;
                    if (player.options_.sources && player.options_.sources.length > 0) {
                        hash = player.options_.sources;
                    }
                    else if (player.getCache().sources) {
                        hash = player.getCache().sources;
                    }
                    else if (player.getCache().source) {
                        hash = player.getCache().source;
                    }
                    else if (player.getCache().src) {
                        hash = [player.getCache()];
                    }
                    else {
                        hash = [{ src: player.src(), type: "video/mp4", label: "SD" }];
                    }
                    for (let elem of hash) {
                        elem.src = toSaveUrl(elem.src);
                        if (elem["data-res"]) {
                            elem.label = elem["data-res"];
                        }
                        if (!elem.type) {
                            elem.type = "video/mp4";
                        }
                    }
                    ;
                    return hash;
                }
                function getVJSPlayerCaptions(player) {
                    var tracks = [];
                    for (let i = 0; i < player.textTracks().length; i++) {
                        let textTrack = player.textTracks()[i];
                        var track = { src: "", kind: "", language: "", label: "", default: false, cues: [] };
                        if (textTrack.options_ && textTrack.options_.src) {
                            track.src = OV.tools.getAbsoluteUrl(textTrack.options_.src);
                        }
                        else if (textTrack.cues_.length != 0) {
                            for (let cue of textTrack.cues_) {
                                track.cues.push({ startTime: cue.startTime, endTime: cue.endTime, text: cue.text, id: "", pauseOnExit: false });
                            }
                            ;
                        }
                        else {
                            break;
                        }
                        if (typeof textTrack.kind == "function") {
                            track.kind = textTrack.kind();
                            track.language = textTrack.language();
                            track.label = textTrack.label();
                            if (textTrack.default) {
                                track.default = textTrack.default();
                            }
                        }
                        else {
                            track.kind = textTrack.kind;
                            track.language = textTrack.language;
                            track.label = textTrack.label;
                            track.default = textTrack.default;
                        }
                        tracks.push(track);
                    }
                    ;
                    return tracks;
                }
                function getVideoJSPlayers() {
                    if (window['videojs'] != undefined) {
                        console.log("VIDEOJS FOUND");
                        return window['videojs'].players;
                    }
                    return null;
                }
                function getJWPlayers() {
                    if (window['jwplayer'] == undefined) {
                        return null;
                    }
                    console.log("JWPLAYER FOUND");
                    var arr = [];
                    for (var i = 0, player = window['jwplayer'](0); player.on; player = window['jwplayer'](++i)) {
                        arr.push(player);
                    }
                    return arr;
                }
                function isPlayerLibrary() {
                    return window['jwplayer'] != null || window['videojs'] != null;
                }
                function getJWPlayerSrces(player) {
                    var srces = player.getPlaylist()[0].sources;
                    for (var src of srces) {
                        src.src = toSaveUrl(src.file);
                        if (src.type == "hls") {
                            src.type = "application/x-mpegURL";
                        }
                        else {
                            src.type = "video/" + src.type;
                        }
                    }
                    return srces;
                }
                function getJWPlayerCaptions(player) {
                    var tracks = player.getPlaylist()[0].tracks;
                    for (var track of tracks) {
                        track.src = OV.tools.getAbsoluteUrl(track.file);
                    }
                    return tracks;
                }
                function SetupVideo(videoNode) {
                    if (!videoNode.dataset.isRegistred) {
                        videoNode.dataset.isRegistred = "true";
                    }
                }
                function getSrc(videoNode) {
                    var srces = [];
                    for (let source of videoNode.getElementsByTagName("source")) {
                        let hash = { src: toSaveUrl(source.src), type: source.type, label: "" };
                        if (source.hasAttribute("label")) {
                            hash.label = source.getAttribute("label");
                        }
                        else if (source.dataset.res) {
                            hash.label = source.dataset.res;
                        }
                        if (source.hasAttribute("default")) {
                            srces.unshift(hash);
                        }
                        else {
                            srces.push(hash);
                        }
                    }
                    ;
                    if (srces.length == 0) {
                        VideoPopup.addVideoToPopup({ src: [{ src: toSaveUrl(videoNode.src), type: "video/mp4", label: "SD" }], tracks: [], poster: videoNode.poster, title: "", origin: "" });
                    }
                    else {
                        VideoPopup.addVideoToPopup({ src: srces, tracks: [], poster: videoNode.poster, title: "", origin: "" });
                    }
                }
                console.log("OpenVideo Search is here!", location.href);
                /*var videoArr = document.getElementsByTagName("video");
                OV.tools.forEach(videoArr, function(videoNode){
                    SetupVideo(videoNode);
                });*/
                var videoJSPlayers = getVideoJSPlayers();
                if (videoJSPlayers) {
                    for (var player of videoJSPlayers) {
                        VideoPopup.addVideoToPopup({ src: getVJSPlayerSrces(player), tracks: getVJSPlayerCaptions(player), poster: player.poster(), title: "", origin: "" });
                        player.on('loadstart', function () {
                            console.log("testest");
                            VideoPopup.addVideoToPopup({ src: getVJSPlayerSrces(player), tracks: getVJSPlayerCaptions(player), poster: player.poster(), title: "", origin: "" });
                        });
                    }
                    if (videojs.hook) {
                        videojs.hook('setup', function (player) {
                            VideoPopup.addVideoToPopup({ src: getVJSPlayerSrces(player), tracks: getVJSPlayerCaptions(player), poster: player.poster(), title: "", origin: "" });
                            player.on('loadstart', function () {
                                VideoPopup.addVideoToPopup({ src: getVJSPlayerSrces(player), tracks: getVJSPlayerCaptions(player), poster: player.poster(), title: "", origin: "" });
                            });
                        });
                    }
                }
                var jwPlayers = getJWPlayers();
                if (jwPlayers) {
                    for (let player of jwPlayers) {
                        VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
                        player.on('meta', function () {
                            VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
                        });
                    }
                }
                function setupPlainVideoListener(video) {
                    //video.play();
                    if (!isPlayerLibrary()) {
                        getSrc(video);
                        video.addEventListener('loadedmetadata', function () {
                            getSrc(video);
                        });
                    }
                    else {
                        var jwPlayers = getJWPlayers();
                        if (jwPlayers) {
                            for (let player of jwPlayers) {
                                VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
                                player.on('meta', function () {
                                    VideoPopup.addVideoToPopup({ src: getJWPlayerSrces(player), tracks: getJWPlayerCaptions(player), poster: player.getPlaylist()[0].image, title: "", origin: "" });
                                });
                            }
                        }
                    }
                }
                for (let videoNode of document.getElementsByTagName("video")) {
                    setupPlainVideoListener(videoNode);
                }
                ;
                document.addEventListener("DOMNodeInserted", function (e) {
                    let target = e.target;
                    if (target.tagName && target.tagName.toLowerCase() == "video") {
                        setupPlainVideoListener(target);
                    }
                });
            });
        }
    });
})(VideoSearch || (VideoSearch = {}));
//# sourceMappingURL=video_search.js.map