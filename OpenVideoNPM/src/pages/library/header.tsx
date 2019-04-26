import "./header.scss";

import * as React from "react";

import {SearchInput} from "./searchbody";

type HeaderProps = {
    title: string,
    search: string | null,
    onSearch: (search: string) => void,
    canSearch: boolean;
};
type HeaderState = { search: string | null };
export class Header extends React.Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
        this.state = {search: this.props.search };
    }
    render() {
        let searchInput = this.props.canSearch ?
            <SearchInput
                onSearch={this.inputSearch.bind(this)}
                placeholder={"Search in "+this.props.title}
                search={this.state.search}
            />
            : null
        ;
        return (
            <div className="ov-lib-head">
                <div className="ov-lib-head-icon"></div>
                <div className="ov-lib-head-icon-text">OpenVideo</div>
                <div className="ov-lib-head-title">
                    {this.props.title}
                </div>
                {searchInput}
            </div>
        );
    }
    inputSearch(input : string) {
        this.setState({ search: input });
        this.props.onSearch(input);
    }
}
