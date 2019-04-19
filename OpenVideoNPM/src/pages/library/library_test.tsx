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
class Library extends React.Component<LibraryProps, LibraryState> {
    constructor(props: LibraryProps) {
        super(props);
        this.state = {
            nav: this.props.nav || fixedButtons.search,
            search: this.props.search,
            activePrompt: null
        };
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
