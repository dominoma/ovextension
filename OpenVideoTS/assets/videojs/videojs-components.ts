namespace OVPlayer {

    export interface FavButton extends videojs.Button {
        isFavorite: (value?: boolean, dontSet?: boolean) => boolean;
        updateDesign: () => void;
    }
    export interface TheatreButton extends videojs.Button {
        isTheatreMode: () => boolean;
        setTheatreMode: (theatreMode: boolean) => void;
    }
    let Button = videojs.getComponent("button");
    let favButton = (videojs as any).extend(Button, {
        constructor: function() {
            Button.apply(this, arguments);
            this.addClass('vjs-favbutton-disabled');
        },
        handleClick: function() {
            OV.analytics.fireEvent("Favorites", "PlayerEvent", "");
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
                OV.storage.local.get("OpenVideoFavorites").then(function(favorites) {
                    if (!favorites) {
                        favorites = [];
                    }
                    var entryIndex = favorites.indexOf(OV.array.search((_this.player_ as OVPlayer.Player).getVideoData().origin, favorites, function(vidSiteUrl, arrElem) {
                        return arrElem.vidSiteUrl == vidSiteUrl;
                    }));
                    if (entryIndex != -1) {
                        favorites.splice(entryIndex, 1);
                    }
                    if (value) {
                        favorites.unshift((_this.player_ as OVPlayer.Player).getVideoData());
                    }
                    OV.storage.local.set("OpenVideoFavorites", favorites);
                });
            }
        },
        updateDesign: function() {
            var _this = this;
            OV.storage.local.get("OpenVideoFavorites").then(function(favorites) {
                if (favorites) {
                    _this.isFavorite(OV.array.search((_this.player_ as OVPlayer.Player).getVideoData().origin, favorites, function(vidSiteUrl, arrElem) {
                        return arrElem.vidSiteUrl == vidSiteUrl;
                    }), true);
                }
            });
        }
    });
    videojs.registerComponent('FavButton', favButton);

    let theaterButton = (videojs as any).extend(Button, {
        constructor: function() {
            Button.apply(this, arguments);
            this.addClass('vjs-theaterbutton-disabled');
            this.theaterMode = false;

            let oldX: number | null = null;
            this.on('dragstart', function(event: Event) {
                oldX = null;
            });
            this.on('drag', function(event: DragEvent) {
                if (oldX != null && event.screenX > 0) {
                    TheatreMode.dragChanged({ dragChange: event.screenX - oldX, frameWidth: window.innerWidth });

                }
                oldX = event.screenX;
            });
            this.on('dragend', function(event: Event) {
                TheatreMode.dragStopped();
            });

        },
        handleClick: function() {
            OV.analytics.fireEvent("TheaterMode", "PlayerEvent", "");
            this.setTheaterMode(!this.isTheaterMode());
        },
        isTheaterMode: function() {
            return this.theaterMode;
        },
        setTheaterMode: function(theaterMode: boolean) {
            this.el_.draggable = theaterMode;
            this.theaterMode = theaterMode;
            if (this.theaterMode) {
                this.removeClass('vjs-theaterbutton-disabled');
                this.addClass('vjs-theaterbutton-enabled');
            }
            else {
                this.removeClass('vjs-theaterbutton-enabled');
                this.addClass('vjs-theaterbutton-disabled');
            }
            TheatreMode.setTheatreMode({
                enabled: this.theaterMode,
                frameWidth: window.innerWidth,
                frameHeight: window.innerHeight
            });
        }

    });

    videojs.registerComponent('TheaterButton', theaterButton);

    let patreonButton = (videojs as any).extend(Button, {
        constructor: function() {
            Button.apply(this, arguments);
            this.addClass('vjs-patreonbutton');
            this.controlText('Become a Patron');
        },
        handleClick: function() {
            OV.analytics.fireEvent("PatreonButton", "PlayerEvent", "");
            Background.openTab("https://www.patreon.com/bePatron?u=13995915");
        }
    });
    videojs.registerComponent('PatreonButton', patreonButton);

    let downloadButton = (videojs as any).extend(Button, {
        constructor: function() {
            Button.apply(this, arguments);
            this.addClass('vjs-download-button-control');
        },
        handleClick: function() {
            var src = (this.player_ as OVPlayer.Player).getActiveVideoSource();
            var file = OV.object.merge(src.dlsrc || { src: src.src, type: src.type, filename: null }, { label: src.label });
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
    videojs.registerComponent('DownloadButton', downloadButton);

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
    function parseSrt(dataAndEvents: string, oncue: (cue: VideoTypes.VTTCue) => void) {

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
    export function addTextTrack(player : Player, rawTrack : VideoTypes.SubtitleSource) {
        OV.tools.createRequest({ url: rawTrack.src }).then(function(xhr) {
            var srcContent = xhr.responseText;
            //function (srcContent) {
            if (srcContent.indexOf("-->") !== -1) {
                
                player.addTextTrack(rawTrack.kind, rawTrack.label, rawTrack.language);
                let track = player.textTracks()[player.textTracks().length - 1];
                if(rawTrack.default) {
                    track.mode = "showing";
                }
                parseSrt(srcContent, function(cue) {
                    track.addCue(cue);
                });
                
            } else {
                throw Error("Invaid subtitle file");
            }
        });
    }
    let MenuItem = videojs.getComponent("MenuItem");
    let AddTracksFromFile = (videojs as any).extend(MenuItem, {
        constructor: function(player: videojs.Player, options: any) {
            MenuItem.call(this, player, { label: "load VTT/SRT from File" });
            this.controlText("load VTT/SRT from File");
            let srtSelector = document.createElement("input") as HTMLInputElement;
            srtSelector.type = "file";
            srtSelector.accept = ".vtt, .srt, .txt";
            srtSelector.style.display = "none";
            srtSelector.addEventListener("change", function() {
                var collection = new FileReader;
                collection.onload = function(dataAndEvents) {
                    if (collection.result.indexOf("-->") !== -1) {
                        player.addTextTrack("captions", srtSelector.files[0].name, "AddedFromUser");
                        var track = player.textTracks()[player.textTracks().length - 1];
                        parseSrt(collection.result, function(cue) {
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
    videojs.registerComponent('AddTracksFromFile', AddTracksFromFile);
    
    let AddTracksFromURL = (videojs as any).extend(MenuItem, {
        constructor: function(player: any, options: any) {
            MenuItem.call(this, player, { label: "load VTT/SRT from URL" });
            this.controlText("load VTT/SRT from URL");
        },
        handleClick: function() {
            let player = this.player_ as Player;
            Background.prompt({ msg: "Please enter the url of the subtitle file you want to use", fieldText: "" }).then(function(response) {
                if (!response.aborted) {
                    OV.tools.createRequest({ url: response.text }).then(function(xhr) {
                        var srcContent = xhr.responseText;
                        //function (srcContent) {
                        if (srcContent.indexOf("-->") !== -1) {
                            OV.tools.getUrlFileName(response.text).then(function(fn) {
                                player.addTextTrack("captions", fn, "AddedFromUser");
                                var track = player.textTracks()[player.textTracks().length - 1];
                                parseSrt(srcContent, function(cue) {
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
    videojs.registerComponent('AddTracksFromURL', AddTracksFromURL);
    namespace Update {
        let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
        let oldCreateEl = resolutionMenuItem.prototype.createEl;
        resolutionMenuItem.prototype.createEl = function() {
            
            let el = oldCreateEl.apply(this, arguments);
            function getSrcElem(src : VideoTypes.VideoSource, videoTitle : string) {
                return OVPlayer.createDownloadButton(src.src, "["+src.label+"]"+videoTitle+"."+src.type.substr(src.type.indexOf("/")+1), src.type);
            }
            let videoTitle = this.player_.getVideoData().title;
            if(this.options_.src[0].dlsrc) {
                el.appendChild(getSrcElem(this.options_.src[0].dlsrc, videoTitle));
            }
            else {
                el.appendChild(getSrcElem(this.options_.src[0], videoTitle));
            }
            return el;
        }
    }
    namespace Update {
        let subsCapsMenuItem = videojs.getComponent("SubsCapsMenuItem");
        let oldCreateEl = subsCapsMenuItem.prototype.createEl;
        subsCapsMenuItem.prototype.createEl = function() {
            let track = this.options_.track as TextTrack;
            let el = oldCreateEl.apply(this, arguments);
            if(track.language != "AddedFromUser") {
                let videoData = (this.player_ as Player).getVideoData();
                let rawTrack = OV.array.search(track, videoData.tracks, function(track: TextTrack, rawtrack) {
                    return track.label == rawtrack.label;
                });
                if(rawTrack) {
                    el.appendChild(OVPlayer.createDownloadButton(rawTrack.src, "["+rawTrack.label+"]"+videoData.title+".vtt", null));
                }
            }
            return el;
        }
    }
    namespace Update {
        let subsCapsButton = videojs.getComponent("SubsCapsButton") as any;
        let oldCreateItems = subsCapsButton.prototype.createItems;
        subsCapsButton.prototype.createItems = function() {
            let items = oldCreateItems.apply(this, arguments) as Array<any>;
            items.splice(2,0,new (videojs.getComponent("AddTracksFromFile"))(this.player_, {}));
            items.splice(3,0,new (videojs.getComponent("AddTracksFromURL"))(this.player_, {}));
            return items;
        }
    }
    
}