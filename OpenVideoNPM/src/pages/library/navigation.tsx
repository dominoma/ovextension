import "./navigation.scss";

import * as React from "react";

import * as Storage from "OV/storage";
import * as Tools from "OV/tools";

import {PromptManager} from "../assets/ts/prompt";

export type NavBtnData = {
    id: string;
    name: string;
}
type NavigationBtnProps = {
    data: NavBtnData;
    className?: string;
    onSelected: (btn: NavBtnData) => void;
    selected: boolean;
}
type NavigationBtnState = {

}
export class NavigationBtn extends React.Component<NavigationBtnProps, NavigationBtnState> {

    constructor(props : NavigationBtnProps) {
        super(props);
    }

    render() {
        let className = (this.props.className || "") + " ov-lib-nav-btn" + (this.props.selected ? " ov-lib-nav-btn-selected" : "");
        return (
            <div className={className} onClick={this.divClicked.bind(this)}>
                <span className="ov-lib-nav-btn-icon"></span>
                <span className="ov-lib-nav-btn-text">{this.props.data.name}</span>
            </div>
        );
    }
    divClicked() {
        this.props.onSelected(this.props.data);
    }
}
type NavigationProps = {
    onSelected: (nav: NavBtnData) => void;
    selected: NavBtnData
}
type NavigationState = {
    selected: NavBtnData;
    playlists: NavBtnData[];
}
export const fixedButtons = {
    search: {
        id: "searchVideos",
        name: "Search Videos"
    },
    addPlaylist: {
        id: "addPlaylist",
        name: "Add Playlist"
    }
}
export class Navigation extends React.Component<NavigationProps, NavigationState> {

    constructor(props : NavigationProps) {
        super(props);
        this.state = { selected: this.props.selected, playlists: [] };
    }
    componentDidMount() {
        Storage.getPlaylists().then((playlists)=>{
            this.setState({
                playlists: playlists
            });
        });
    }
    getButtons() {
        let btns = [
            <NavigationBtn
                data={fixedButtons.search}
                onSelected={this.btnSelected.bind(this)}
                selected={this.state.selected.id == fixedButtons.search.id}
                className="ov-lib-nav-btn-search"
                key={fixedButtons.search.id}
            />
        ];
        btns = btns.concat(this.state.playlists.map((el) => {
            let className = undefined;
            if(el.id == Storage.fixed_playlists.history.id) {
                className = "ov-lib-nav-btn-history"
            }
            else if(el.id == Storage.fixed_playlists.favorites.id) {
                className = "ov-lib-nav-btn-favorites"
            }
            return (
                <NavigationBtn
                    data={el}
                    onSelected={this.btnSelected.bind(this)}
                    selected={this.state.selected.id == el.id}
                    className={className}
                    key={el.id}
                />
            );
        }));
        btns.push(
            <NavigationBtn
                data={fixedButtons.addPlaylist}
                onSelected={this.btnSelected.bind(this)}
                selected={this.state.selected.id == fixedButtons.addPlaylist.id}
                className="ov-lib-nav-btn-addPlaylist"
                key={fixedButtons.addPlaylist.id}
            />
        );
        return btns;
    }
    render() {
        return (<div className="ov-lib-nav">{this.getButtons()}</div>);
    }

    btnSelected(data : NavBtnData) {
        if(data.id == fixedButtons.addPlaylist.id) {
            PromptManager.openPrompt("addPlaylistPrompt").then((state: any)=>{
                if(state && state.name != "") {
                    let name = state.name;
                    let hash = Tools.generateHash();
                    let playlists = this.state.playlists.concat();
                    playlists.push({ id: hash, name: name });
                    Storage.setPlaylists(playlists);
                    this.setState({ playlists: playlists });
                }
            });
        }
        else {
            this.setState({ selected: data });
            this.props.onSelected(data);
        }
    }
}
