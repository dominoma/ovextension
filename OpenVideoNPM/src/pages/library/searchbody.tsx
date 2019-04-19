import "./searchbody.scss";

import * as VideoTypes from "video_types";
import * as React from "react";

import * as Storage from "OV/storage";
import * as Tools from "OV/tools";

import {PromptManager} from "../assets/ts/prompt";

type SearchInputProps = {
    search?: string | null;
    onChange?: (input: string) => void;
    onSearch: (input: string) => void;
    placeholder?: string;
}
type SearchInputState = {
    search: string;
}
export class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
    constructor(props : SearchInputProps) {
        super(props);
        this.state = {
            search: this.props.search || ""
        };
    }
    render() {
        return (
            <div className="ov-lib-search-input">
                <input
                    type="text"
                    placeholder={this.props.placeholder}
                    onChange={this.inputChange.bind(this)}
                    onKeyDown={this.inputKeyDown.bind(this)}
                    value={this.state.search}
                />
                <div className="ov-lib-search-input-btn" onClick={this.searchBtnClick.bind(this)}></div>
            </div>
        );
    }
    inputKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
        if(ev.keyCode == 13) {
            this.props.onSearch(this.state.search);
            return false;
        }
        else {
            return true;
        }
    }
    inputChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({search: ev.target.value });
        if(this.props.onChange) {
            this.props.onChange(ev.target.value);
        }
    }
    searchBtnClick() {
        this.props.onSearch(this.state.search);
    }
}
type SearchBtnProps = {
    data: VideoTypes.PageRefData
    selected: boolean;
    onSelected: (data : VideoTypes.PageRefData) => any;
}
export class SearchBtn extends React.Component<SearchBtnProps, {}> {
    render() {
        let className = "ov-lib-search-btn";
        if(this.props.selected) {
            className += " ov-lib-search-btn-selected";
        }
        return (
            <div onClick={this.searchBtnClicked.bind(this)} className={className}>
                <div className="ov-lib-search-btn-bg">
                    <div className="ov-lib-search-btn-img" style={{
                        backgroundImage: "url('"+this.props.data.icon+"')"
                    }}></div>
                </div>
                <div className="ov-lib-search-btn-text">{this.props.data.name}</div>
            </div>
        );
    }
    searchBtnClicked() {
        this.props.onSelected(this.props.data);
    }
}
type SearchBodyProps = {
    search: string | null;
}
type SearchBodyState = {
    sites: VideoTypes.PageRefData[],
    selected: VideoTypes.PageRefData[]
}
export const allSitesSearchBtnData = {
    icon: "",
    url: "allSites",
    name: "All Sites"
}
export const addSiteSearchBtnData = {
    icon: "http://downloadicons.net/sites/default/files/add-icon-76240.png",
    url: "addSite",
    name: "Add Site"
}
export class SearchBody extends React.Component<SearchBodyProps, SearchBodyState> {

    private static async resolveBtnData(data : { name: string; url: string; }) {
        let fullURL = (data.url.indexOf("://") == -1 ? "https://" : "") + data.url;
        let xhr = await Tools.createRequest({ url: fullURL });
        let matches = xhr.response.match(/(<link[^>]+rel=["|']shortcut icon["|'][^>]*)/);
        if (matches) {
            let favicon = matches[1].match(/href[ ]*=[ ]*["|']([^"|^']*)["|']/);
            if (favicon) {
                let favurl = favicon[1];
                if (!favurl.match(/https?:/)) {
                    favurl = fullURL + favurl;
                }
                return { name: data.name, url: fullURL, icon: favurl };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    constructor(props : SearchBodyProps) {
        super(props);
        this.state = { sites: [], selected: [] }
    }

    componentDidMount() {
        Storage.getSearchSites().then((sites)=>{
            this.setState({
                sites: sites
            });
        });
    }

    async searchBtnSelected(data : VideoTypes.PageRefData) {
        if(data.url == addSiteSearchBtnData.url) {
            let state = await PromptManager.openPrompt("addSearchSitePrompt");
            let data = await SearchBody.resolveBtnData(state);
            console.log(data);
            if(data) {
                let sites = this.state.sites.concat();
                sites.push(data);
                Storage.setSearchSites(sites);
                this.setState({ sites: sites });
            }
        }
    }

    render() {
        let buttonsData = [allSitesSearchBtnData].concat(this.state.sites).concat(addSiteSearchBtnData);
        let buttons = buttonsData.map((el)=>{
            return (
                <SearchBtn
                    data={el}
                    selected={this.state.selected.some((selel)=>{
                        return el.url == selel.url
                    })}
                    onSelected={this.searchBtnSelected.bind(this)}
                    key={el.url}
                />
            );
        });
        return (
            <div className="ov-lib-search">
                <SearchInput onSearch={this.inputSearched.bind}/>
                <div className="ov-lib-search-btn-list">
                    {buttons}
                </div>
            </div>
        )
    }
    inputSearched(search : string) {

    }

}
