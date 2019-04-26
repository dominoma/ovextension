import "./library.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Storage from "OV/storage";
import * as Page from "OV/page";
import * as Messages from "OV/messages";
import * as TheatreMode from "Messages/theatremode";
import * as VideoHistory from "Messages/videohistory";

import {Header} from "./header";
import {Navigation, NavBtnData, fixedButtons} from "./navigation";
import {SearchBody} from "./searchbody";
import {VideoList} from "./videobody";
import {LibraryPromptManager} from "./prompts";

type LibraryProps = {
    nav: NavBtnData | null;
    search: string | null;
}
type LibraryState = {
    nav: NavBtnData;
    search: string | null;
    activePrompt: {
        name: string;
        data: any;
    } | null;
}
class CCLinks extends React.Component<{}, {}> {
    render() {
        return (
            <div className="ov-lib-cc-links">
                Icons made by
                <a href="https://www.flaticon.com/authors/google" title="Google">Google</a>
                <a href="https://www.flaticon.com/authors/egor-rumyantsev" title="Egor Rumyantsev">Egor Rumyantsev</a>
                <a href="https://www.flaticon.com/authors/stephen-hutchings" title="Stephen Hutchings">Stephen Hutchings</a>
                <a href="https://www.flaticon.com/authors/picol" title="Picol">Picol</a>
                <a href="https://www.flaticon.com/authors/yannick" title="Yannick">Yannick</a>
                <a href="https://www.flaticon.com/authors/egor-rumyantsev" title="Egor Rumyantsev">Egor Rumyantsev</a>
                <a href="https://www.flaticon.com/authors/bogdan-rosu" title="Bogdan Rosu">Bogdan Rosu</a>
                <a href="https://www.freepik.com/" title="Freepik">Freepik</a>
            </div>
        );
    }
}
class Library extends React.Component<LibraryProps, LibraryState> {
    constructor(props: LibraryProps) {
        super(props);
        this.state = {
            nav: this.props.nav || fixedButtons.search,
            search: this.props.search,
            activePrompt: null
        };
    }
    componentDidUpdate(oldprops : LibraryProps) {
        if(oldprops.nav != this.props.nav || oldprops.search != this.props.search) {
            this.setState({ nav: this.props.nav || fixedButtons.search, search: this.props.search });
        }
    }
    render() {
        let body = null;
        document.title = this.state.nav.name + " - OV-Library";
        if(this.state.nav.id == fixedButtons.search.id) {
            body = (
                <SearchBody
                    search={this.state.search}
                />
            );
        }
        else {
            body = (
                <VideoList
                    playlist={this.state.nav.id}
                    filter={this.state.search == null ? null : new RegExp(this.state.search, "i")}
                    onVideoRemoved={()=>{}}
                />
            );
        }
        return (
            <div className="ov-lib">
                <LibraryPromptManager/>
                <Header
                    search={this.state.search}
                    title={this.state.nav.name}
                    onSearch={this.videosSearched.bind(this)}
                    canSearch={this.state.nav.id != fixedButtons.search.id}
                />
                <Navigation
                    selected={this.state.nav}
                    onSelected={this.navSelected.bind(this)}
                />
                {body}
                <CCLinks/>
            </div>
        );
    }
    navSelected(btn: NavBtnData) {
        this.setState({ nav: btn });
        window.history.pushState(null, "", Page.getObjUrl({
            nav: btn,
            search: this.state.search
        }))
    }
    videosSearched(search: string) {
        this.setState({ search: search });
        window.history.pushState(null, "", Page.getObjUrl({
            nav: this.state.nav,
            search: search
        }))
    }
}
(window as any)["setPlaylists"] = Storage.setPlaylists;
(window as any)["setPlaylistByID"] = Storage.setPlaylistByID;
let hash = Page.getUrlObj() as LibraryProps || { nav: null, search: null };
ReactDOM.render(<Library nav={hash.nav} search={hash.search}/>, document.body);
Messages.setupMiddleware();
TheatreMode.setup();
VideoHistory.setup();
(window as any)["setupVidHist"] = VideoHistory.setup;
