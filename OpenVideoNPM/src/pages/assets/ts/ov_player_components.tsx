import * as VideoTypes from "video_types";

import * as Analytics from "OV/analytics";

import * as TheatreMode from "Messages/theatremode";
import * as Background from "Messages/background";
import * as Environment from "OV/environment";

import * as Storage from "OV/storage";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import videojs from "video.js";

export interface Player extends videojs.Player {
    hotkeys: (obj: Object) => void;
    updateSrc: (srces: Array<VideoTypes.VideoSource>) => void;
    execute: (cmd: string, data : any) => any;
}

function registerComponent(parentType : new (player : Player, options : videojs.PlayerOptions) => videojs.Component, name: string, getNode: (wrapper : videojs.Component) => React.ReactElement<any>) {
    let wrapperType = class extends parentType {
        constructor(player : Player, options : videojs.PlayerOptions) {
            super(player, options);

            /* Bind the current class context to the mount method */
            this.mount = this.mount.bind(this);

            /* When player is ready, call method to mount React component */
            player.ready(() => {
              this.mount();
            });

            /* Remove React root when component is destroyed */
            this.on("dispose", () => {
              ReactDOM.unmountComponentAtNode(this.el())
            });
        }
        mount() {
            ReactDOM.render(getNode(this), this.el() );
        }
    }
    videojs.registerComponent(name, wrapperType);
}
type TheatreButtonProps = {

}
type TheatreButtonState = {
    enabled: boolean;
}
class TheatreButton extends React.Component<TheatreButtonProps, TheatreButtonState> {

    constructor(props : TheatreButtonProps) {
        super(props);
        this.state = { enabled: false };
    }

    render() {
        return (
            <div className="vjs-theatre-button" onClick={this.buttonClicked.bind(this)}></div>
        );
    }

    buttonClicked() {
        Analytics.playerEvent("TheatreMode");
        TheatreMode.setTheatreMode(!this.state.enabled);
        this.state = { enabled: !this.state.enabled };
    }

}
class PatreonButton extends React.Component<{}, {}> {
    render() {
        return <div className="vjs-patreon-button" onClick={this.buttonClicked.bind(this)}></div>
    }
    buttonClicked() {
        Analytics.playerEvent("PatreonButton");
        Background.openTab(Environment.getPatreonUrl());
    }
}
type DownloadButtonProps = {
    wrapper : videojs.Component
}
class DownloadButton extends React.Component<DownloadButtonProps, {}> {
    render() {
        return <div className="vjs-download-button" onClick={this.buttonClicked.bind(this)}></div>
    }
    buttonClicked() {
        let player = this.props.wrapper.player() as Player;
        player.execute("downloadActiveSource", null);
    }
}
type MenuItemDownloadBtnProps = {
    player : Player,
    src ?: VideoTypes.VideoSource,
    trackLabel ?: string
}


export function setup() {
    const MenuItem = videojs.getComponent("MenuItem");
    class QualityMenuItem extends MenuItem {

        private source : VideoTypes.VideoSource;
        private onClick : ()=>void;

        constructor(player : Player, data: VideoTypes.VideoSource, onClick : ()=>void) {
            super(player, {
                label: data.label,
                selectable: true,
                selected: data.default,
            });
            this.selected(false);
            this.onClick = onClick;
            this.source = data;
            //this.controlText(data.label);
            this.playerReady();
        }

        handleClick(event : videojs.EventTarget.Event) {
            this.onClick();
            super.handleClick(event);
            this.switchSource();
        }
        switchSource() {
            if(this.player().src() == this.source.src) {
                return;
            }
            let isPaused = this.player().paused();
            let currentTime = this.player().currentTime();
            console.log(isPaused);
            this.player().one("loadedmetadata", ()=>{
                this.player().currentTime(currentTime);
                if(!isPaused) {
                    this.player().play();
                }
            });
            this.player().src(this.source);
            console.log("Sourcee set!", this.source);
        }
        playerReady() {
            let button = document.createElement("button");
            button.addEventListener("click", (event)=>{
                (this.player() as Player).execute("downloadSource", this.source);
                event.stopPropagation();
            });
            if(this.source.default) {
                this.switchSource();
            }
            this.el().appendChild(button);
        }
    }
    type MenuButtonOptions = {
        sources :  VideoTypes.VideoSource[]
    }
    const MenuButton = videojs.getComponent("MenuButton");
    class QualityMenuButton extends MenuButton {

        constructor(player : Player, options : MenuButtonOptions) {
            super(player, options as any);
            this.addClass("vjs-quality-button");
        }
        createItems() {
            let sources = (this.options_ as MenuButtonOptions).sources;
            if(sources && sources.length > 0) {
                sources = sources.sort((a, b)=>{
                    let qualA = a.label.match(/([0-9]*)p?/);
                    let qualB = b.label.match(/([0-9]*)p?/);
                    if(qualA && qualB) {
                        console.log(qualA, parseInt(qualA[1]), parseInt(qualB[1]))
                        return (parseInt(qualA[1]) > parseInt(qualB[1]) ? -1 : 1);
                    }
                    else if(qualA || qualB) {
                        return qualA ? 1 : -1;
                    }
                    else {
                        return -a.label.localeCompare(b.label);
                    }
                });
                sources[0].default = true;
                let unselectOthers = () => {
                    items.forEach((el) => {
                        el.selected(false);
                    });
                }
                let items = (this.options_ as MenuButtonOptions).sources.map((el)=>{
                    return new QualityMenuItem(this.player() as Player, el, unselectOthers);
                });
                items[0].selected(true);
                this.player().src(sources[0]);
                return items;
            }
            return [];
        }
    }
    videojs.registerComponent("vjsQualityButton", QualityMenuButton);
    class PlaylistMenuItem extends MenuItem {

        private playlist : Storage.Playlist;
        private isSelected : boolean;

        constructor(player : Player, data: Storage.Playlist, selected : boolean) {
            super(player, {
                label: data.name,
                selectable: true,
                selected: selected,
                multiSelectable: true
            });
            this.playlist = data;
            this.isSelected = selected;
        }
        handleClick(event : videojs.EventTarget.Event) {
            super.handleClick(event);
            this.isSelected = !this.isSelected;
            this.selected(this.isSelected);
            if(this.isSelected) {
                (this.player() as Player).execute("addToPlaylist", this.playlist);
            }
            else {
                (this.player() as Player).execute("removeFromPlaylist", this.playlist);
            }
            Analytics.playerEvent("PlaylistButton");
        }
    }
    type PlaylistButtonOptions = {
        active: Storage.Playlist[],
        playlists: Storage.Playlist[]
    }
    class PlaylistMenuButton extends MenuButton {


        constructor(player : Player, options : PlaylistButtonOptions) {
            super(player, options as any);
            this.addClass("vjs-playlist-button");
        }
        createItems() {
            return (this.options_ as PlaylistButtonOptions).playlists.map((el)=>{
                return new PlaylistMenuItem(this.player() as Player, el, (this.options_ as PlaylistButtonOptions).active.find((actel)=>{
                    return actel.id == el.id;
                }) != null);
            });
        }
    }
    videojs.registerComponent("vjsPlaylistButton", PlaylistMenuButton);
    class SubtitlesFromFileMenuItem extends MenuItem {
        constructor(player : videojs.Player) {
            super(player, {
                label: "load VTT/SRT from File"
            });
            this.controlText("load VTT/SRT from File");
        }
        handleClick() {
            (this.player_ as Player).execute("loadSubtitlesFromFile", null);
        }
    }
    class SubtitlesFromURLMenuItem extends MenuItem {
        constructor(player : videojs.Player) {
            super(player, {
                label: "load VTT/SRT from URL"
            });
            this.controlText("load VTT/SRT from URL");
        }
        handleClick() {
            (this.player_ as Player).execute("loadSubtitlesFromURL", null);
        }
    }
    const Button = videojs.getComponent("button");
    registerComponent(Button, "vjsTheatreButton", ()=>{
        return <TheatreButton />;
    });
    registerComponent(Button, "vjsPatreonButton", ()=>{
        return <PatreonButton />;
    });
    registerComponent(Button, "vjsDownloadButton", (wrapper)=>{
        return <DownloadButton wrapper={wrapper}/>;
    });

    function override<T extends Function>(obj: any, method: T, createOverride: (method: T) => T ) {
        let name = method.name;
        obj.prototype[name] = createOverride(obj.prototype[name]);
    }
    /*let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    override(resolutionMenuItem, resolutionMenuItem.prototype.createEl, function(method){
        return function(this: videojs.MenuItem, tagName?: string, properties?: any, attributes?: any) {

            let el = method.call(this, tagName, properties, attributes);
            let src = (this.options_ as any).src[0];
            let player = this.player_ as Player;
            ReactDOM.render(<MenuItemDownloadBtn src={src} player={player}/>, el);
            return el;
        };
    });*/

    let subsCapsMenuItem = videojs.getComponent("SubsCapsMenuItem");
    override(subsCapsMenuItem, subsCapsMenuItem.prototype.createEl, function(method){
        return function(this: videojs.TextTrackMenuItem, tagName?: string, properties?: any, attributes?: any) {
            let btn = this;
            let track = (btn.options_ as any).track as TextTrack;
            let el = method.call(this, tagName, properties, attributes);
            if (track.language != "AddedFromUser") {
                let button = document.createElement("button");
                button.addEventListener("click", (event)=>{
                    (this.player() as Player).execute("downloadTrack", track.label);
                    event.stopPropagation();
                });
                el.appendChild(button);
            }
            return el;
        }
    });

    let subsCapsButton = videojs.getComponent("SubsCapsButton") as any;

    override(subsCapsButton, subsCapsButton.prototype.createItems, function(method){
        return function(this: videojs.MenuButton) {
            let items = method.call(this) as Array<any>;
            items.splice(2, 0, new SubtitlesFromFileMenuItem(this.player_));
            items.splice(3, 0, new SubtitlesFromURLMenuItem(this.player_));
            return items;
        }
    });
}
