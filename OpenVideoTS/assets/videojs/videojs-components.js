var OVPlayer;
(function (OVPlayer) {
    let Button = videojs.getComponent("button");
    let favButton = videojs.extend(Button, {
        constructor: function () {
            Button.apply(this, arguments);
            this.addClass('vjs-favbutton-disabled');
        },
        handleClick: function () {
            OV.analytics.fireEvent("Favorites", "PlayerEvent", "");
            this.isFavorite(!this.isFavorite());
        },
        isFavorite: function () {
            return !!this.isFavorite_;
        },
        setFavorite: function (value, dontSet) {
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
                OV.storage.local.get("OpenVideoFavorites").then(function (favorites) {
                    if (!favorites) {
                        favorites = [];
                    }
                    var entryIndex = favorites.indexOf(OV.array.search(_this.player_.getVideoData().origin, favorites, function (vidSiteUrl, arrElem) {
                        return arrElem.vidSiteUrl == vidSiteUrl;
                    }));
                    if (entryIndex != -1) {
                        favorites.splice(entryIndex, 1);
                    }
                    if (value) {
                        favorites.unshift(_this.player_.getVideoData());
                    }
                    OV.storage.local.set("OpenVideoFavorites", favorites);
                });
            }
        },
        updateDesign: function () {
            var _this = this;
            OV.storage.local.get("OpenVideoFavorites").then(function (favorites) {
                if (favorites) {
                    _this.isFavorite(OV.array.search(_this.player_.getVideoData().origin, favorites, function (vidSiteUrl, arrElem) {
                        return arrElem.vidSiteUrl == vidSiteUrl;
                    }), true);
                }
            });
        }
    });
    videojs.registerComponent('FavButton', favButton);
    let theaterButton = videojs.extend(Button, {
        constructor: function () {
            Button.apply(this, arguments);
            this.addClass('vjs-theaterbutton-disabled');
            this.theaterMode = false;
            let oldX = null;
            this.on('dragstart', function (event) {
                oldX = null;
            });
            this.on('drag', function (event) {
                if (oldX != null && event.screenX > 0) {
                    TheatreMode.dragChanged({ dragChange: event.screenX - oldX, frameWidth: window.innerWidth });
                }
                oldX = event.screenX;
            });
            this.on('dragend', function (event) {
                TheatreMode.dragStopped();
            });
        },
        handleClick: function () {
            OV.analytics.fireEvent("TheaterMode", "PlayerEvent", "");
            this.setTheaterMode(!this.isTheaterMode());
        },
        isTheaterMode: function () {
            return this.theaterMode;
        },
        setTheaterMode: function (theaterMode) {
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
    let patreonButton = videojs.extend(Button, {
        constructor: function () {
            Button.apply(this, arguments);
            this.addClass('vjs-patreonbutton');
            this.controlText('Become a Patron');
        },
        handleClick: function () {
            OV.analytics.fireEvent("PatreonButton", "PlayerEvent", "");
            OV.tab.create("https://www.patreon.com/bePatron?u=13995915");
        }
    });
    videojs.registerComponent('PatreonButton', patreonButton);
    let downloadButton = videojs.extend(Button, {
        constructor: function () {
            Button.apply(this, arguments);
            this.addClass('vjs-download-button-control');
        },
        handleClick: function () {
            var src = this.player_.getActiveVideoSource();
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
            }
            else {
                Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
            }
        }
    });
    videojs.registerComponent('DownloadButton', downloadButton);
    function createDownloadButton(url, fileName, type) {
        var button = document.createElement("button");
        button.className = "vjs-menu-download-button-control";
        button.type = "button";
        button.setAttribute("aria-live", "polite");
        button.setAttribute("aria-disabled", "false");
        var span = document.createElement("span");
        span.className = "vjs-icon-placeholder";
        span.setAttribute('aria-hidden', "true");
        button.appendChild(span);
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            if (type == null || type.indexOf("application/") == -1) {
                var dataHash = { url: url, fileName: "" };
                if (fileName) {
                    dataHash.fileName = fileName.replace(/[/\\?%*:|"<>]/g, ' ').trim();
                }
                Background.downloadFile(dataHash);
            }
            else {
                Background.alert("HLS videos can't be downloaded :/\nTry downloading that video from a different hoster.");
            }
        });
        return button;
    }
    OVPlayer.createDownloadButton = createDownloadButton;
})(OVPlayer || (OVPlayer = {}));
//# sourceMappingURL=videojs-components.js.map