

import * as VideoTypes from "./video_types";

import * as Tools from "./OV/tools";
import * as Analytics from "./OV/analytics";
import * as Environment from "./OV/environment";
import * as Page from "./OV/page";
import * as Messages from "./OV/messages";
import * as Storage from "./OV/storage";
import * as Languages from "./OV/languages";

import * as OVPlayerComponents from "./ov_player_components";

import videojs_raw from "video.js";

declare var videojs: typeof videojs_raw;




(window as any)["Worker"] = undefined;
Messages.setupMiddleware();
Page.wrapType(XMLHttpRequest, {
    open: {
        get: function(target) {
            return function(method: string, url: string) {
                if (isInitialized() && getPlayer()!.currentType().match(/application\//i) && /\.(ts|m3u8)$/.test(url)) {
                    arguments[1] = Tools.addRefererToURL(url, Page.getUrlObj().origin);
                }
                target.open.apply(target, arguments as any);
            }
        }
    }
});

export type Player = OVPlayerComponents.Player;


let player: Player|null = null;


export function getPlayer() {
    if(player == null) {
        throw Error("Player not initialized!");
    }
    return player;
}
export function isInitialized() {
    return player != null;
}
export function initPlayer(playerId: string, options: Object, videoData: VideoTypes.VideoData): Player {

    OVPlayerComponents.register();
    options = Tools.merge(options, {
        plugins: {
            videoJsResolutionSwitcher: {
                dynamicLabel: true
            }
        },
        /*chromecast:{
             appId:'APP-ID'
        },*/
        playbackRates: [0.5, 1, 2],
        language: Languages.getMsg("video_player_locale")
    });
    player = videojs(playerId, options) as Player;
    player.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false
    });
    player.appendTextTrack = async function (rawTrack: VideoTypes.SubtitleSource) {
        function convertToTrack(srcContent : string) {
            if (srcContent.indexOf("-->") !== -1) {

                player!.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
                let track = player!.textTracks()[player!.textTracks().length - 1];
                if (rawTrack.default) {
                    track.mode = "showing";
                }
                OVPlayerComponents.parseSrt(srcContent, function(cue) {
                    track.addCue(cue);
                });

            } else {
                throw Error("Invaid subtitle file");
            }
        }
        try {
            let xhr = await Tools.createRequest({ url: rawTrack.src });
            convertToTrack(xhr.responseText);
        }
        catch(e) {
            let xhr = await Tools.createRequest({ url: Tools.removeRefererFromURL(rawTrack.src) });
            convertToTrack(xhr.responseText);
        }
    }
    player.getActiveVideoSource = function(): VideoTypes.VideoSource {
        for (var src of videoData.src) {
            if (player!.src().indexOf(src.src) == 0) {
                return src;
            }
        }
        throw new Error("No video source active!");
    }


    player.on("ready", async function() {
        (player!.el() as HTMLElement).style.width = "100%";
        (player!.el() as HTMLElement).style.height = "100%";
        let ControlBar = player!.getChild('controlBar');
        if(!ControlBar) {
            throw new Error("Control bar is missing!");
        }
        var FavButton = ControlBar.addChild('FavButton', {}) as OVPlayerComponents.FavButton;
        var DownloadButton = ControlBar.addChild('DownloadButton', {});
        var PatreonButton = ControlBar.addChild('PatreonButton', {});
        var FullscreenToggle = ControlBar.getChild('fullscreenToggle') as videojs_raw.FullscreenToggle;
        var CaptionsButton = ControlBar.getChild('SubsCapsButton') as videojs_raw.CaptionsButton;
        CaptionsButton.show();
        console.log("player is ready");
        player!.on("ratechange", function() {
            Analytics.fireEvent("PlaybackRate", "PlayerEvent", videoData.origin.url);
        });
        FullscreenToggle.on("click", function() {
            window.setTimeout(function() {
                if (Environment.browser() == Environment.Browsers.Chrome && !(document as any).fullscreen && player!.isFullscreen()) {
                    console.log("FULLSCREEN ERROR");
                    Analytics.fireEvent("FullscreenError", "FullscreenError", "IFrame: '" + videoData.origin + "' Page: '<PAGE_URL>', Version: " + Environment.getManifest().version)
                }
            }, 1000);
        });
        player!.controlBar.el().insertBefore(FavButton.el(), CaptionsButton.el());
        player!.controlBar.el().insertBefore(DownloadButton.el(), FullscreenToggle.el());
        player!.controlBar.el().insertBefore(PatreonButton.el(), FullscreenToggle.el());
        let volume = await Storage.sync.get("PlayerVolume");
        if (volume) {
            player!.volume(volume);
        }
        player!.on('volumechange', function() {
            Storage.sync.set("PlayerVolume", player!.volume());
        });
        player!.on('loadedmetadata', function() {
            player!.loadFromHistory();
            FavButton.updateDesign();
        });
        document.body.onmouseleave = function() {
            if (player!.currentTime() != 0) {
                player!.saveToHistory();
            }
        };
    });

    player.setVideoData = function(videoData: VideoTypes.VideoData) {


        player!.poster(videoData.poster);
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
            player!.src(srces[0]);
        }
        else {
            player!.updateSrc(srces);


        }
        for (let track of videoData.tracks) {
            player!.appendTextTrack(track);
            //player.addRemoteTextTrack(<any>track, true);
        }

    }
    player.getVideoData = function() {
        return videoData;
    }
    player.setVideoData(videoData);

    //player.aspectRatio("0:0");
    player.saveToHistory = async function() {
        let isEnabled = await Storage.isHistoryEnabled();
        if (isEnabled) {
            let history = await Storage.getPlaylistByID(Storage.fixed_playlists.history.id);
            var itemIndex = history.findIndex((arrElem) => {
                return arrElem.origin.url == videoData.origin.url;
            });
            if (itemIndex != -1) {
                history.splice(itemIndex, 1);
            }
            var histHash: VideoTypes.VideoRefData = {
                poster: videoData.poster,
                title: videoData.title,
                origin: videoData.origin,
                parent: videoData.parent || history[itemIndex].parent,
                watched: player!.currentTime() == player!.duration() ? 0 : player!.currentTime(),
                duration: player!.duration()
            };

            history.unshift(histHash);
            if(history.length > 100) {
                history = history.slice(0, 99);
            }
            Storage.setPlaylistByID(Storage.fixed_playlists.history.id, history);
            //});
        }
    };
    player.loadFromHistory = async function() {
        let history = await Storage.getPlaylistByID(Storage.fixed_playlists.history.id);

        var item = history.find(function(arrElem) {
            return arrElem.origin.url == videoData.origin.url;
        });
        if (item) {
            player!.currentTime(item.watched);
        }

    };


    return player;
}
