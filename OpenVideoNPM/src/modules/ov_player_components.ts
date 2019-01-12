import * as OVPlayer from "ov_player";

import * as VideoTypes from "video_types";

import * as Tools from "OV/tools";
import * as Analytics from "OV/analytics";
import * as Environment from "OV/environment";
import * as Page from "OV/page";
import * as Messages from "OV/messages";
import * as Storage from "OV/storage";
import * as Languages from "OV/languages";

import * as TheatreMode from "Messages/theatremode";
import * as Background from "Messages/background";

import videojs_raw from "video.js";

declare var videojs : typeof videojs_raw;

export interface FavButton extends videojs_raw.Button {
    isFavorite: (value?: boolean, dontSet?: boolean) => boolean;
    updateDesign: () => void;
}
export interface TheatreButton extends videojs_raw.Button {
    isTheatreMode: () => boolean;
    setTheatreMode: (theatreMode: boolean) => void;
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
        constructor: function(player : any, options : any) {
            Button.call(this, player, options);
            this.addClass('vjs-favbutton-disabled');
        },
        handleClick: function() {
            Analytics.fireEvent("Favorites", "PlayerEvent", "");
            this.isFavorite(!this.isFavorite());
        },
        isFavorite: function() {
            return !!this.isFavorite_;
        },
        setFavorite: function(value: boolean, dontSet?: boolean): void {
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
            if (!dontSet) {
                Storage.local.get("OpenVideoFavorites").then(function(favorites : VideoTypes.HistoryEntry[]) {
                    if (!favorites) {
                        favorites = [];
                    }
                    var entryIndex = favorites.findIndex(function(arrElem) {
                        return arrElem.origin == (_this.player_ as OVPlayer.Player).getVideoData().origin;
                    });
                    if (entryIndex != -1) {
                        favorites.splice(entryIndex, 1);
                    }
                    if (value) {
                        favorites.unshift((_this.player_ as OVPlayer.Player).getVideoData() as any);
                    }
                    Storage.local.set("OpenVideoFavorites", favorites);
                });
            }
        },
        updateDesign: function() {
            var _this = this;
            Storage.local.get("OpenVideoFavorites").then(function(favorites : VideoTypes.HistoryEntry[]) {
                if (favorites) {
                    _this.setFavorite(favorites.findIndex(function(arrElem) {
                        return arrElem.origin == (_this.player_ as OVPlayer.Player).getVideoData().origin;
                    }) != -1, true);
                }
            });
        }
    });
    
    let theaterButton = (videojs as any).extend(Button, {
        constructor: function(player : any, options : any) {
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
        constructor: function(player : any, options : any) {
            Button.call(this, player, options);
            this.addClass('vjs-patreonbutton');
            this.controlText('Become a Patron');
        },
        handleClick: function() {
            Analytics.fireEvent("PatreonButton", "PlayerEvent", "");
            Background.openTab("https://www.patreon.com/bePatron?u=13995915");
        }
    });
    
    
    let downloadButton = (videojs as any).extend(Button, {
        constructor: function(player : any, options : any) {
            Button.call(this, player, options);
            this.addClass('vjs-download-button-control');
        },
        handleClick: function() {
            var src = (this.player_ as OVPlayer.Player).getActiveVideoSource();
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
                        player.addTextTrack("captions", srtSelector.files[0].name, "AddedFromUser");
                        var track = player.textTracks()[player.textTracks().length - 1];
                        OVPlayer.parseSrt(result, function(cue) {
                            track.addCue(cue);
                        });
                    } else {
                        Background.alert("Invaid subtitle file");
                    }
                };
                collection.readAsText(srtSelector.files[0], "ISO-8859-1");
            });
            this.srtSelector_ = srtSelector;
        },
        handleClick: function() {
            var srtSelector = this.srtSelector_ as HTMLInputElement;
            srtSelector.click();
        }
    });
    
    let AddTracksFromURL = (videojs as any).extend(MenuItem, {
        constructor: function(player: any, options: any) {
            MenuItem.call(this, player, { label: "load VTT/SRT from URL" });
            this.controlText("load VTT/SRT from URL");
        },
        handleClick: function() {
            let player = this.player_ as OVPlayer.Player;
            Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" }).then(function(response) {
                if (!response.aborted) {
                    Tools.createRequest({ url: response.text }).then(function(xhr) {
                        var srcContent = xhr.responseText;
                        //function (srcContent) {
                        if (srcContent.indexOf("-->") !== -1) {
                            Tools.getUrlFileName(response.text).then(function(fn) {
                                player.addTextTrack("captions", fn, "AddedFromUser");
                                var track = player.textTracks()[player.textTracks().length - 1];
                                OVPlayer.parseSrt(srcContent, function(cue) {
                                    track.addCue(cue);
                                });
                            });
                        } else {
                            Background.alert("Invaid subtitle file");
                        }
                    });
    
    
                }
    
            });
    
        }
    });
   
    let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    let oldCreateElrs = resolutionMenuItem.prototype.createEl;
    resolutionMenuItem.prototype.createEl = function() {
        
        let el = oldCreateElrs.apply(this, arguments as any);
        function getSrcElem(src : VideoTypes.VideoSource, videoTitle : string) {
            return createDownloadButton(src.src, "["+src.label+"]"+videoTitle+"."+src.type.substr(src.type.indexOf("/")+1), src.type);
        }
        let videoTitle = (this.player_ as OVPlayer.Player).getVideoData().title;
        if((this.options_ as any).src[0].dlsrc) {
            el.appendChild(getSrcElem((this.options_ as any).src[0].dlsrc, videoTitle));
        }
        else {
            el.appendChild(getSrcElem((this.options_ as any).src[0], videoTitle));
        }
        return el;
    }
    
    let subsCapsMenuItem = videojs.getComponent("SubsCapsMenuItem");
    let oldCreateEl = subsCapsMenuItem.prototype.createEl;
    subsCapsMenuItem.prototype.createEl = function() {
        let track = (this.options_ as any).track as TextTrack;
        let el = oldCreateEl.apply(this, arguments as any);
        if(track.language != "AddedFromUser") {
            let videoData = (this.player_ as OVPlayer.Player).getVideoData();
            let rawTrack = videoData.tracks.find(function(rawtrack) {
                return track.label == rawtrack.label;
            });
            if(rawTrack) {
                el.appendChild(createDownloadButton(rawTrack.src, "["+rawTrack.label+"]"+videoData.title+".vtt", "text/vtt"));
                
            }
            return el;
        }
    }
    let subsCapsButton = videojs.getComponent("SubsCapsButton") as any;
    let oldCreateItems = subsCapsButton.prototype.createItems;
    subsCapsButton.prototype.createItems = function() {
        let items = oldCreateItems.apply(this, arguments) as Array<any>;
        items.splice(2,0,new (videojs.getComponent("AddTracksFromFile"))(this.player_, {}));
        items.splice(3,0,new (videojs.getComponent("AddTracksFromURL"))(this.player_, {}));
        return items;
    };
   
    
    
    videojs.registerComponent('FavButton', favButton);
    videojs.registerComponent('TheaterButton', theaterButton);
    videojs.registerComponent('PatreonButton', patreonButton);
    videojs.registerComponent('DownloadButton', downloadButton);
    videojs.registerComponent('AddTracksFromURL', AddTracksFromURL);
    videojs.registerComponent('AddTracksFromFile', AddTracksFromFile);
}