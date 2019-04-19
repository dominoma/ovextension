import "./prompts.scss";

import * as React from "react";

import {PromptManager} from "../assets/ts/prompt";

type AddSearchSitePromptProps = {
    onSubmitted: (state: any) => void;
};
type AddSearchSitePromptState = {
    name: string;
    url: string;
};
export class AddSearchSitePrompt extends React.Component<AddSearchSitePromptProps, AddSearchSitePromptState> {

    constructor(props : AddSearchSitePromptProps) {
        super(props);
        this.state = { name: "", url: "" };
    }

    render() {
        return (
            <div className="ov-lib-prompt-addsearchsite">
                <div className="ov-lib-prompt-header">Add site to search</div>
                <input
                    className="ov-lib-search-input"
                    value={this.state.name}
                    placeholder="Name (eg. YouTube)"
                    onChange={this.inputNameChange.bind(this)}
                />
                <input
                    className="ov-lib-search-input"
                    value={this.state.url}
                    placeholder="URL (eg. youtube.com)"
                    onChange={this.inputUrlChange.bind(this)}
                />
                <div className="ov-lib-prompt-btns">
                    <div className="ov-lib-prompt-btn-left" onClick={()=>{
                        this.props.onSubmitted(this.state);
                    }}>Apply</div>
                    <div className="ov-lib-prompt-btn-right" onClick={()=>{
                        this.props.onSubmitted(null);
                    }}>Cancel</div>
                </div>
            </div>
        );
    }

    inputNameChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({name: ev.target.value });
    }
    inputUrlChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({url: ev.target.value });
    }

}
type AddPlaylistPromptProps = {
    onSubmitted: (state: any) => void;
};
type AddPlaylistPromptState = {
    name: string;
};
export class AddPlaylistPrompt extends React.Component<AddPlaylistPromptProps, AddPlaylistPromptState> {

    constructor(props : AddSearchSitePromptProps) {
        super(props);
        this.state = { name: "" };
    }

    render() {
        return (
            <div className="ov-lib-prompt-addsearchsite">
                <div className="ov-lib-prompt-header">New playlist</div>
                <input
                    className="ov-lib-search-input"
                    value={this.state.name}
                    placeholder="playlist name"
                    onChange={this.inputNameChange.bind(this)}
                />
                <div className="ov-lib-prompt-btns">
                    <div className="ov-lib-prompt-btn-left" onClick={()=>{
                        this.props.onSubmitted(this.state);
                    }}>Apply</div>
                    <div className="ov-lib-prompt-btn-right" onClick={()=>{
                        this.props.onSubmitted(null);
                    }}>Cancel</div>
                </div>
            </div>
        );
    }

    inputNameChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.setState({name: ev.target.value });
    }

}
export class LibraryPromptManager extends PromptManager {

    getPrompts() {
        return {
            addSearchSitePrompt: () => {
                return <AddSearchSitePrompt onSubmitted={this.submit.bind(this)}/>
            },
            addPlaylistPrompt: () => {
                return <AddPlaylistPrompt onSubmitted={this.submit.bind(this)}/>
            }
        }
    }

}
