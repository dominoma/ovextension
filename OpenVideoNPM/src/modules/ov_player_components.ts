

import * as VideoTypes from "video_types";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";
import * as Storage from "OV/storage";

import * as TheatreMode from "Messages/theatremode";
import * as Background from "Messages/background";
import * as Environment from "OV/environment";

import videojs_raw from "video.js";

declare var videojs: typeof videojs_raw;

export interface Player extends videojs_raw.Player {
    hotkeys: (obj: Object) => void;
    getActiveVideoSource: () => VideoTypes.VideoSource;
    getVideoData: () => VideoTypes.VideoData;
    setVideoData: (videoData: VideoTypes.VideoData) => void;
    updateSrc: (srces: Array<VideoTypes.VideoSource>) => void;
    saveToHistory: () => void;
    loadFromHistory: () => void;
    appendTextTrack: (rawTrack: VideoTypes.SubtitleSource) => Promise<void>;
}

export interface FavButton extends videojs_raw.Button {
    isFavorite: (value?: boolean, dontSet?: boolean) => boolean;
    updateDesign: () => void;
}
export interface TheatreButton extends videojs_raw.Button {
    isTheatreMode: () => boolean;
    setTheatreMode: (theatreMode: boolean) => void;
}
export function parseSrt(dataAndEvents: string, oncue: (cue: VideoTypes.VTTCue) => void) {

    function trim(dataAndEvents: string) {
        return (dataAndEvents + "").replace(/^\s+|\s+$/g, "");
    }
    function parseCueTime(dataAndEvents: string): number {
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
        } else {
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
            } else {
                user_id = cuelength;
            }
            tempData = {
                id: user_id,
                index: cuelength,
                startTime: 0,
                endTime: 0,
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
export function createDownloadButton(url: string, fileName?: string, type?: string): HTMLButtonElement {
    var button = document.createElement("button");
    button.className = "vjs-menu-download-button-control"
    button.type = "button";
    button.setAttribute("aria-live", "polite");
    button.setAttribute("aria-disabled", "false");
    var span = document.createElement("span");
    span.className = "vjs-icon-placeholder";
    span.setAttribute('aria-hidden', "true");
    button.appendChild(span);
    button.addEventListener("click", function(event: Event) {
        event.stopPropagation();
        if (type == null || type.indexOf("application/") == -1) {
            var dataHash = { url: url, fileName: "" };
            if (fileName) {
                dataHash.fileName = fileName.replace(/[/\\?%*:|"<>]/g, ' ').trim();
            }
            Background.downloadFile(dataHash);
        } else {
            Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
        }
    });
    return button;
}
export function register() {

    let Button = videojs.getComponent("button");
    let favButton = (videojs as any).extend(Button, {
        constructor: function(player : Player, options: any) {
            Button.call(this, player, options);
            this.addClass('vjs-favbutton-disabled');
        },
        handleClick: function() {
            Analytics.fireEvent("Favorites", "PlayerEvent", "");

            this.setFavorite(!this.isFavorite());
        },
        isFavorite: function() {
            return !!this.isFavorite_;
        },
        setFavorite: async function(value: boolean, dontSet?: boolean) {
            this.isFavorite_ = value;
            if (value) {
                this.removeClass('vjs-favbutton-disabled');
                this.addClass('vjs-favbutton-enabled');
            }
            else {
                this.removeClass('vjs-favbutton-enabled');
                this.addClass('vjs-favbutton-disabled');
            }
            var _this = this;
            if (!dontSet) { //Storage.local.get("OpenVideoFavorites") OpenVideoHistory
                let favorites = await Storage.getPlaylistByID(Storage.fixed_playlists.favorites.id);
                if (!favorites) {
                    favorites = [];
                }
                var entryIndex = favorites.findIndex(function(arrElem) {
                    return arrElem.origin.url == (_this.player_ as Player).getVideoData().origin.url;
                });
                if (entryIndex != -1) {
                    favorites.splice(entryIndex, 1);
                }
                if (value) {
                    favorites.unshift((_this.player_ as Player).getVideoData() as any);
                }
                await Storage.setPlaylistByID(Storage.fixed_playlists.favorites.id, favorites);
            }
        },
        updateDesign: async function() {
            var _this = this;
            let favorites = await Storage.getPlaylistByID(Storage.fixed_playlists.favorites.id);
            if (favorites) {
                _this.setFavorite(favorites.findIndex(function(arrElem) {
                    return arrElem.origin.url == (_this.player_ as Player).getVideoData().origin.url;
                }) != -1, true);
            }
        }
    });

    let theaterButton = (videojs as any).extend(Button, {
        constructor: function(player : Player, options: any) {
            Button.call(this, player, options);
            this.addClass('vjs-theaterbutton-disabled');
            this.theaterMode = false;
        },
        handleClick: function() {
            Analytics.fireEvent("TheaterMode", "PlayerEvent", "");
            this.setTheaterMode(!this.isTheaterMode());
        },
        isTheaterMode: function() {
            return this.theaterMode;
        },
        setTheaterMode: function(theaterMode: boolean) {
            this.theaterMode = theaterMode;
            if (this.theaterMode) {
                this.removeClass('vjs-theaterbutton-disabled');
                this.addClass('vjs-theaterbutton-enabled');
            }
            else {
                this.removeClass('vjs-theaterbutton-enabled');
                this.addClass('vjs-theaterbutton-disabled');
            }
            TheatreMode.setTheatreMode(this.theaterMode);
        }

    });



    let patreonButton = (videojs as any).extend(Button, {
        constructor: function(player : Player, options: any) {
            Button.call(this, player, options);
            this.addClass('vjs-patreonbutton');
            this.controlText('Become a Patron');
        },
        handleClick: function() {
            Analytics.fireEvent("PatreonButton", "PlayerEvent", "");
            Background.openTab(Environment.getPatreonUrl());
        }
    });


    let downloadButton = (videojs as any).extend(Button, {
        constructor: function(player : Player, options: any) {
            Button.call(this, player, options);
            this.addClass('vjs-download-button-control');
        },
        handleClick: function() {
            var src = (this.player_ as Player).getActiveVideoSource();
            var file = Tools.merge(src.dlsrc || { src: src.src, type: src.type, filename: null }, { label: src.label });
            if (file.type.indexOf("application/") == -1) {
                var dlData = { url: file.src, fileName: "" };
                var label = file.label;
                dlData.fileName = file.filename || (this.player_.getVideoData().title + "." + file.type.substr(file.type.indexOf("/") + 1)).replace(/[/\\?%*:|"<>]/g, ' ').trim();
                if (label) {
                    dlData.fileName = "[" + label + "]" + dlData.fileName;
                }
                console.log(dlData);
                Background.downloadFile(dlData);
            } else {
                Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
            }
        }
    });




    let MenuItem = videojs.getComponent("MenuItem");
    let AddTracksFromFile = (videojs as any).extend(MenuItem, {
        constructor: function(player: videojs_raw.Player, options: any) {
            MenuItem.call(this, player, { label: "load VTT/SRT from File" });
            this.controlText("load VTT/SRT from File");
            let srtSelector = document.createElement("input") as HTMLInputElement;
            srtSelector.type = "file";
            srtSelector.accept = ".vtt, .srt, .txt";
            srtSelector.style.display = "none";
            srtSelector.addEventListener("change", function() {
                var collection = new FileReader;
                collection.onload = function(dataAndEvents) {
                    let result = collection.result as string;
                    if (result.indexOf("-->") !== -1) {
                        player.addTextTrack("captions", srtSelector.files![0].name, "AddedFromUser");
                        var track = player.textTracks()[player.textTracks().length - 1];
                        parseSrt(result, function(cue) {
                            track.addCue(cue);
                        });
                    } else {
                        Background.alert("Invaid subtitle file");
                    }
                };
                collection.readAsText(srtSelector.files![0], "ISO-8859-1");
            });
            this.srtSelector_ = srtSelector;
        },
        handleClick: function() {
            var srtSelector = this.srtSelector_ as HTMLInputElement;
            srtSelector.click();
        }
    });

    let AddTracksFromURL = (videojs as any).extend(MenuItem, {
        constructor: function(player : Player, options: any) {
            MenuItem.call(this, player, { label: "load VTT/SRT from URL" });
            this.controlText("load VTT/SRT from URL");
        },
        handleClick: async function() {
            let player = this.player_ as Player;
            let response = await Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" });
            if (!response.aborted) {
                let fn = await Tools.getUrlFileName(response.text);
                player.appendTextTrack({ kind: "captions", label: fn, language: "AddedFromUser", src: response.text });
            }
        }
    });
    function override<T extends Function>(obj: any, method: T, createOverride: (method: T) => T ) {
        let name = method.name;
        obj.prototype[name] = createOverride(obj.prototype[name]);
    }
    let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    override(resolutionMenuItem, resolutionMenuItem.prototype.createEl, function(method){
        return function(this: videojs_raw.MenuItem, tagName?: string, properties?: any, attributes?: any) {

            let el = method.call(this, tagName, properties, attributes);
            function getSrcElem(src: VideoTypes.VideoSource, videoTitle: string) {
                return createDownloadButton(src.src, "[" + src.label + "]" + videoTitle + "." + src.type.substr(src.type.indexOf("/") + 1), src.type);
            }
            let videoTitle = (this.player_ as Player).getVideoData().title;
            if ((this.options_ as any).src[0].dlsrc) {
                el.appendChild(getSrcElem((this.options_ as any).src[0].dlsrc, videoTitle));
            }
            else {
                el.appendChild(getSrcElem((this.options_ as any).src[0], videoTitle));
            }
            return el;
        };
    });

    let subsCapsMenuItem = videojs.getComponent("SubsCapsMenuItem");
    override(subsCapsMenuItem, subsCapsMenuItem.prototype.createEl, function(method){
        return function(this: videojs_raw.TextTrackMenuItem, tagName?: string, properties?: any, attributes?: any) {
            let btn = this;
            let track = (btn.options_ as any).track as TextTrack;
            let el = method.call(this, tagName, properties, attributes);
            if (track.language != "AddedFromUser") {
                let videoData = (btn.player_ as Player).getVideoData();
                let rawTrack = videoData.tracks.find(function(rawtrack : VideoTypes.SubtitleSource) {
                    return track.label == rawtrack.label;
                });
                if (rawTrack) {
                    el.appendChild(createDownloadButton(rawTrack.src, "[" + rawTrack.label + "]" + videoData.title + ".vtt", "text/vtt"));

                }
            }
            return el;
        }
    });

    let subsCapsButton = videojs.getComponent("SubsCapsButton") as any;
    override(subsCapsButton, subsCapsButton.prototype.createItems, function(method){
        return function(this: videojs_raw.MenuButton) {
            let items = method.call(this) as Array<any>;
            items.splice(2, 0, new (videojs.getComponent("AddTracksFromFile"))(this.player_, {}));
            items.splice(3, 0, new (videojs.getComponent("AddTracksFromURL"))(this.player_, {}));
            return items;
        }
    });



    videojs.registerComponent('FavButton', favButton);
    videojs.registerComponent('TheaterButton', theaterButton);
    videojs.registerComponent('PatreonButton', patreonButton);
    videojs.registerComponent('DownloadButton', downloadButton);
    videojs.registerComponent('AddTracksFromURL', AddTracksFromURL);
    videojs.registerComponent('AddTracksFromFile', AddTracksFromFile);
}
