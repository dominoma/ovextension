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
            this.addClass( 'vjs-favbutton-disabled' );
        },
        handleClick: function() {
            OV.analytics.fireEvent("Favorites", "PlayerEvent", "");
            this.isFavorite(!this.isFavorite());
        },
        isFavorite: function() {
            return !!this.isFavorite_;
        },
        setFavorite : function(value: boolean, dontSet?: boolean) : void {
            this.isFavorite_ = value;
            if(value){
                this.removeClass( 'vjs-favbutton-disabled' );
                this.addClass( 'vjs-favbutton-enabled' );
            }
            else {
                this.removeClass( 'vjs-favbutton-enabled' );
                this.addClass( 'vjs-favbutton-disabled' );
            }
            var _this = this;
            if(!dontSet) {
                OV.storage.local.get("OpenVideoFavorites").then(function(favorites){
                    if(!favorites) {
                        favorites = [];
                    }
                    var entryIndex = favorites.indexOf(OV.array.search((_this.player_ as OVPlayer.Player).getVideoData().origin,favorites,function(vidSiteUrl, arrElem){ 
                        return arrElem.vidSiteUrl == vidSiteUrl; 
                    }));
                    if(entryIndex != -1) {
                        favorites.splice(entryIndex,1);
                    }
                    if(value) {
                        favorites.unshift((_this.player_ as OVPlayer.Player).getVideoData());
                    }
                    OV.storage.local.set("OpenVideoFavorites", favorites);
                });
            }
        },
        updateDesign: function() {
            var _this = this;
            OV.storage.local.get("OpenVideoFavorites").then(function(favorites){
                if(favorites) {
                    _this.isFavorite(OV.array.search((_this.player_ as OVPlayer.Player).getVideoData().origin,favorites,function(vidSiteUrl, arrElem){ 
                        return arrElem.vidSiteUrl == vidSiteUrl; 
                    }), true);
                }
            });
        }
    });
    videojs.registerComponent('FavButton', favButton);
    
    let theaterButton = (videojs as any).extend(Button, {
        constructor: function() {
          this.addClass( 'vjs-theaterbutton-disabled' );
          this.theaterMode = false;
         
          let oldX : number|null = null;
          this.on('dragstart', function(event : Event){
              oldX = null;
          });
          this.on('drag', function(event : DragEvent){
              if(oldX != null && event.screenX > 0) {
                  OV.messages.send({ 
                      func: "theatreModeDragChanged", 
                      data: { dragChange: event.screenX - oldX, frameWidth: window.innerWidth } as TheatreMode.DragTheatreMode, 
                      bgdata: { func: "toTopWindow" } 
                  });
              }
              oldX = event.screenX;
          });
          this.on('dragend', function(event : Event){
              OV.messages.send({func: "theatreModeDragStopped", bgdata: { func: "toTopWindow" } });
          });
        
        },
        handleClick: function() {
            OV.analytics.fireEvent("TheaterMode", "PlayerEvent", "");
            this.setTheaterMode(!this.isTheaterMode());
        },
        isTheaterMode: function() {
            return this.theaterMode;
        },
        setTheaterMode: function(theaterMode : boolean) {
            this.el_.draggable = theaterMode;
            this.theaterMode = theaterMode;
            if(this.theaterMode) {
                this.removeClass( 'vjs-theaterbutton-disabled' );
                this.addClass( 'vjs-theaterbutton-enabled' );
            }
            else {
                this.removeClass( 'vjs-theaterbutton-enabled' );
                this.addClass( 'vjs-theaterbutton-disabled' );
            }
            OV.messages.send({
                func: "setTheatreMode", 
                data: { 
                    enabled: this.theaterMode, 
                    frameWidth: window.innerWidth, 
                    frameHeight: window.innerHeight 
                } as TheatreMode.SetTheatreMode, 
                bgdata: { func: "toTopWindow" } 
            });
        }
        
      });

      videojs.registerComponent('TheaterButton', theaterButton);

      let patreonButton = (videojs as any).extend(Button, {
            constructor: function() {
              this.addClass( 'vjs-patreonbutton' );
              this.controlText('Become a Patron');
            },
            handleClick: function() {
                OV.analytics.fireEvent("PatreonButton", "PlayerEvent", "");
                OV.tab.create("https://www.patreon.com/bePatron?u=13995915");
            }
      });
      videojs.registerComponent('PatreonButton', patreonButton);
      
      let downloadButton = (videojs as any).extend(Button, {
        constructor: function() {
          Button.apply(this, arguments);
          this.addClass( 'vjs-download-button-control' );
        },
        handleClick: function() {
            var src = (this.player_ as OVPlayer.Player).getActiveVideoSource();
            var file = OV.object.merge(src.dlsrc || { src: src.src, type: src.type, filename: null },{ label: src.label });
            if(file.type.indexOf("application/") == -1) {
                var dlData = {url: file.src, fileName: "" };
                var label = file.label;
                dlData.fileName = file.filename || (this.player_.getVideoHash().title + "."+file.type.substr(file.type.indexOf("/")+1)).replace(/[/\\?%*:|"<>]/g, ' ').trim();
                if(label) {
                    dlData.fileName = "["+label+"]"+dlData.fileName;
                }
                console.log(dlData);
                OV.messages.send({ bgdata: { func: "downloadFile", data: dlData as Background.DownloadFile } });
            } else {
                OV.messages.send({ bgdata: { func: "alert", data: { msg: "HLS videos can't be downloaded :/\nTry downloading that video from a different hoster." } as Background.Alert } });
            }
        }
      });
      videojs.registerComponent('DownloadButton', downloadButton);

      export function createDownloadButton(url : string, fileName?: string, type?: string) : HTMLButtonElement {
          var button = document.createElement("button");
          button.className = "vjs-menu-download-button-control"
          button.type = "button";
          button.setAttribute("aria-live", "polite");
          button.setAttribute("aria-disabled", "false");
          var span = document.createElement("span");
          span.className = "vjs-icon-placeholder";
          span.setAttribute('aria-hidden', "true");
          button.appendChild(span);
          button.addEventListener("click", function(event : Event) {
              event.stopPropagation();
              if(type == null || type.indexOf("application/") == -1) {
                  var dataHash = {url: url, fileName: ""};
                  if(fileName) {
                      dataHash.fileName = fileName.replace(/[/\\?%*:|"<>]/g, ' ').trim();
                  }
                  OV.messages.send({ bgdata: { func: "downloadFile", data: dataHash as Background.DownloadFile } });
              } else {
                  OV.messages.send({ bgdata: { func: "alert", data: { msg: "HLS videos can't be downloaded :/\nTry downloading that video from a different hoster." } as Background.Alert } });
              }
          });
          return button;
      }
}