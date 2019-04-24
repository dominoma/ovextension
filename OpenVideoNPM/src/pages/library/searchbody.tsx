import "./searchbody.scss";

import * as VideoTypes from "video_types";
import * as React from "react";

import * as Storage from "OV/storage";
import * as Tools from "OV/tools";

import * as AddSiteIcon from "../assets/icons/rounded-add-button.svg";
import * as AllSitesIcon from "../assets/icons/dot-matrix.svg";

import {PromptManager} from "../assets/ts/prompt";
console.log(AddSiteIcon, AllSitesIcon);
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
    onSelected: (data : VideoTypes.PageRefData, selected: boolean) => any;
}
type SearchBtnState = {

}
export class SearchBtn extends React.Component<SearchBtnProps, SearchBtnState> {

    constructor(props : SearchBtnProps) {
        super(props);

    }

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
        this.props.onSelected(this.props.data, !this.props.selected);
    }
}
type SearchBtnsProps = {
    onChange: (data : VideoTypes.PageRefData[]) => any;
}
type SearchBtnsState = {
    sites: VideoTypes.PageRefData[];
    selected: VideoTypes.PageRefData[];
}
export class SearchBtns extends React.Component<SearchBtnsProps, SearchBtnsState> {

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

    constructor(props : SearchBtnsProps) {
        super(props);
        this.state = { sites: [], selected: [] };
    }

    componentDidMount() {
        Storage.getSearchSites().then((sites)=>{
            this.setState({
                sites: sites
            });
            this.props.onChange(sites);
        });
    }

    render() {
        let buttons = this.state.sites.map((el)=>{
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
            <div className="ov-lib-search-btn-list">
                <SearchBtn
                    data={allSitesSearchBtnData}
                    selected={this.state.selected.length == 0}
                    onSelected={this.allSitesSelected.bind(this)}
                    key={allSitesSearchBtnData.url}
                />
                {buttons}
                <SearchBtn
                    data={addSiteSearchBtnData}
                    selected={false}
                    onSelected={this.siteAddRequest.bind(this)}
                    key={addSiteSearchBtnData.url}
                />
            </div>
        );
    }
    searchBtnSelected(data : VideoTypes.PageRefData, selected: boolean) {
        let newSites = this.state.selected.concat();
        if(selected) {
            newSites.push(data);
            this.setState({ selected: newSites });
        }
        else {
            let index = this.state.selected.findIndex((el) => {
                return el.url == data.url;
            });
            if(index != -1) {
                newSites.splice(index, 1);
            }
            this.setState({ selected: newSites });
        }
        this.props.onChange(newSites);
    }
    async siteAddRequest() {
        let state = await PromptManager.openPrompt("addSearchSitePrompt");
        let data = await SearchBtns.resolveBtnData(state);
        console.log(data);
        if(data) {
            let sites = this.state.sites.concat();
            sites.push(data);
            Storage.setSearchSites(sites);
            this.setState({ sites: sites });
        }
    }
    allSitesSelected() {
        this.setState({ selected: [] });
        this.props.onChange(this.state.sites);
    }

}
type SearchResult = {
    url: string;
    title: string;
    description: string;
    icon: string;
}
type ResultLinkProps = {
    data: SearchResult;
}
class ResultLink extends React.Component<ResultLinkProps,{}> {
    render() {
        return (
            <a className="ov-library-search-result" href={this.props.data.url}>
                <div
                    className="ov-library-search-result-icon"
                    style={{backgroundImage:"url('"+this.props.data.icon+"')"}}
                ></div>
                <div className="ov-library-search-result-title">
                    {this.props.data.title}
                </div>
                <div
                    className="ov-library-search-result-description"
                    dangerouslySetInnerHTML={{ __html: this.props.data.description }}>
                </div>
            </a>
        );
    }
}
type ResultLinksProps = {
    data: SearchResult[];
}
class ResultLinks extends React.Component<ResultLinksProps,{}> {
    render() {
        let results = this.props.data.map((el)=>{
            return <ResultLink key={el.url} data={el} />;
        })
        return (
            <div className="ov-library-search-results">
                {results}
            </div>
        );
    }
}
type SearchBodyProps = {
    search: string | null;
}
type SearchBodyState = {
    selected: VideoTypes.PageRefData[],
    searchresult: SearchResult[] | null
}
export const allSitesSearchBtnData = {
    icon: AllSitesIcon,
    url: "allSites",
    name: "All Sites"
}
export const addSiteSearchBtnData = {
    icon: AddSiteIcon,
    url: "addSite",
    name: "Add Site"
}
export class SearchBody extends React.Component<SearchBodyProps, SearchBodyState> {



    constructor(props : SearchBodyProps) {
        super(props);
        this.state = { selected: [], searchresult: null }
    }

    render() {
        if(this.state.searchresult) {
            return (
                <div className="ov-lib-search-result-body">
                    <SearchInput onSearch={this.inputSearched.bind(this)}/>
                    <ResultLinks data={this.state.searchresult}/>
                </div>
            );
        }
        else {
            return (
                <div className="ov-lib-search">
                    <SearchInput onSearch={this.inputSearched.bind(this)}/>
                    <SearchBtns onChange={this.searchBtnsChange.bind(this)}/>
                </div>
            )
        }
    }
    searchBtnsChange(data : VideoTypes.PageRefData[]) {
        this.setState({ selected: data });
    }

    async inputSearched(search : string) {
        let extractResults = (htmlstr : string) => {
            let html = (new DOMParser()).parseFromString(htmlstr, "text/html");
            let results = html.querySelectorAll(".g");
            let data: SearchResult[] = [];
            for (let result of results) {
                let title = result.querySelector("h3");
                let description = result.querySelector("span.st");
                let url = result.querySelector("a")
                if (title && description && url) {
                    let icon = this.state.selected.find((el)=>{
                        console.log(url!.href, el.url);
                        return url!.href.indexOf(el.url.replace(/https:\/\/(www\.)?/, "")) != -1;
                    })!.icon;
                    data.push({
                        title: title.innerText,
                        url: url.href,
                        description: description.innerHTML,
                        icon: icon
                    });
                }
            }
            return data as SearchResult[];
        }
        let query = encodeURIComponent(search+" "+this.state.selected.map((el)=>{
            return "site:"+el.url.replace("https://", "");
        }).join(" OR ")).replace(new RegExp(encodeURIComponent(" "), "g"), "+");
        let xhrs = await Promise.all([0,1,2,4,5,6,7].map((el)=>{
            return Tools.createRequest({
                url: "https://www.google.com/search?q="+query,
                data: {
                    start: (el*10).toString()
                }
            });
        }))
        let results = xhrs.reduce((arr, el)=>{
            let data = extractResults(el.response);
            return arr.concat(data);
        }, [] as SearchResult[])
        this.setState({ searchresult: results });
    }


}
