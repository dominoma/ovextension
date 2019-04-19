import "!style-loader!css-loader!video.js/dist/video-js.css";
import "./ov_player_components.scss";
import * as VideoTypes from "video_types";

import * as Analytics from "OV/analytics";

import * as TheatreMode from "Messages/theatremode";
import * as Background from "Messages/background";
import * as Environment from "OV/environment";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import videojs from "video.js";
(window as any)["videojs"] = videojs;
import "videojs-hotkeys";
import "videojs-resolution-switcher";

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
        let className = this.state.enabled ? "vjs-theatrebutton-enabled" : "vjs-theatrebutton-disabled";
        return (
            <div className={className} onClick={this.buttonClicked.bind(this)}></div>
        );
    }

    buttonClicked() {
        TheatreMode.setTheatreMode(this.state.enabled);
    }

}
class PatreonButton extends React.Component<{}, {}> {
    render() {
        return <div className="vjs-patreonbutton" onClick={this.buttonClicked.bind(this)}></div>
    }
    buttonClicked() {
        Analytics.fireEvent("PatreonButton", "PlayerEvent", "");
        Background.openTab(Environment.getPatreonUrl());
    }
}
type DownloadButtonProps = {
    wrapper : videojs.Component
}
class DownloadButton extends React.Component<DownloadButtonProps, {}> {
    render() {
        return <div className="vjs-download-button-control" onClick={this.buttonClicked.bind(this)}></div>
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
class MenuItemDownloadBtn extends React.Component<MenuItemDownloadBtnProps, {}> {
    render() {
        return (
            <button
                type="button"
                className="vjs-menu-download-button-control"
                onClick={this.buttonClicked.bind(this)}
            >
                <span className="vjs-icon-placeholder"></span>
            </button>
        );
    }
    buttonClicked() {
        if(this.props.src) {
            this.props.player.execute("downloadSource", this.props.src);
        }
        else if(this.props.trackLabel) {
            this.props.player.execute("downloadTrack", this.props.trackLabel);
        }
    }
}

export function setup() {
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
    let resolutionMenuItem = videojs.getComponent("ResolutionMenuItem");
    /*override(resolutionMenuItem, resolutionMenuItem.prototype.createEl, function(method){
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
            let player = this.player_ as Player;
            if (track.language != "AddedFromUser") {
                ReactDOM.render(<MenuItemDownloadBtn trackLabel={track.label} player={player}/>, el);
            }
            return el;
        }
    });

    let subsCapsButton = videojs.getComponent("SubsCapsButton") as any;
    const MenuItem = videojs.getComponent("MenuItem");
    override(subsCapsButton, subsCapsButton.prototype.createItems, function(method){
        return function(this: videojs.MenuButton) {
            let items = method.call(this) as Array<any>;
            let addTracksFromFile = new MenuItem(this.player_, {
                 label: "load VTT/SRT from File"
            });
            addTracksFromFile.controlText("load VTT/SRT from File");
            addTracksFromFile.handleClick = () => {
                (this.player_ as Player).execute("loadSubtitlesFromFile", null);
            };
            let addTracksFromURL = new MenuItem(this.player_, {
                 label: "load VTT/SRT from URL"
            });
            addTracksFromURL.controlText("load VTT/SRT from URL");
            addTracksFromURL.handleClick = () => {
                (this.player_ as Player).execute("loadSubtitlesFromURL", null);
            };
            items.splice(2, 0, addTracksFromFile);
            items.splice(3, 0, addTracksFromURL);
            return items;
        }
    });
}
