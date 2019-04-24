import "./popupmenu.scss";

import * as Languages from "OV/languages";
import * as Messages from "OV/messages";
import * as Environment from "OV/environment";
import * as Proxy from "OV/proxy";
import * as Storage from "OV/storage";

import * as Background from "Messages/background";

import * as React from "react";
import * as ReactDOM from "react-dom";

Messages.setupMiddleware();

type MenuButtonProps = {
    text: string;
    url: string;
    className: string;
}
class MenuButton extends React.Component<MenuButtonProps, {}> {
    render() {
        return (
            <div
                className={this.props.className}
                onClick={this.buttonClicked.bind(this)}
            >{this.props.text}</div>
        );
    }
    buttonClicked() {
        Background.openTab(this.props.url);
    }
}
type ProxyButtonProps = {

}
type ProxyButtonState = {
    currentProxy: Proxy.Proxy | null;
}
class ProxyButton extends React.Component<ProxyButtonProps, ProxyButtonState> {

    constructor(props : ProxyButtonProps) {
        super(props);
        this.state = { currentProxy: null };
        Storage.getProxySettings().then((proxy)=>{
            this.setState({ currentProxy: proxy });
        })
    }

    render() {
        if(this.state.currentProxy) {
            return (
                <div className="ov-popupmenu-proxy-btn">
                    <div
                        className="ov-popupmenu-proxy-disable"
                        onClick={this.disableClick.bind(this)}
                    >
                        {Languages.getMsg("popup_menu_proxy_btn_disable")}
                    </div>
                    <div className="ov-popupmenu-proxy-country">
                        {this.state.currentProxy.country}
                    </div>
                    <div
                        className="ov-popupmenu-proxy-custom"
                        onClick={this.customClick.bind(this)}
                    >&#9965;</div>
                    <div
                        className="ov-popupmenu-proxy-reload"
                        onClick={this.reloadClick.bind(this)}
                    ></div>
                </div>
            );
        }
        else {
            return (
                <div className="ov-popupmenu-button" onClick={this.reloadClick.bind(this)}>
                    {Languages.getMsg("popup_menu_proxy_btn_enable")}
                </div>
            );
        }
    }
    async reloadClick() {
        let proxy = await Proxy.newProxy();
        this.setState({ currentProxy: proxy });
    }
    disableClick() {
        Proxy.remove();
        this.setState({ currentProxy: null });
    }
    async customClick() {
        let fieldtext = this.state.currentProxy!.country == "Custom" ?
            this.state.currentProxy!.ip+":"+this.state.currentProxy!.port :
            "proxy-ip:proxy-port";
        let result = await Background.prompt({
            msg: "Please enter the proxy IP and port of the proxy you want to use.",
            fieldText: fieldtext
        });
        if(!result.aborted) {
            var data = result.text.split(":");
            let proxy = { ip: data[0], port: parseInt(data[1]), country: "Custom" };
            await Proxy.setup(proxy);
            this.setState({ currentProxy: proxy });
        }
    }
}
class PopupMenu extends React.Component<{}, {}> {
    render() {
        return (
            <div className="ov-popupmenu">
                <MenuButton
                    className="ov-popupmenu-button"
                    url={Environment.getLibrarySiteUrl()}
                    text={Languages.getMsg("popup_menu_library_btn")}
                />
                <div className="ov-popupmenu-button" onClick={()=>{
                    chrome.runtime.openOptionsPage();
                }}>
                    {Languages.getMsg("popup_menu_options_btn")}
                </div>
                <ProxyButton />
                <MenuButton
                    className="ov-popupmenu-button"
                    url={Environment.getRatingUrl()}
                    text={Languages.getMsg("popup_menu_rating_btn")}
                />
                <MenuButton
                    className="ov-popupmenu-patreonbutton"
                    url={Environment.getPatreonUrl()}
                    text=""
                />
                <div className="ov-popupmenu-footer">
                    <MenuButton
                        className="ov-popupmenu-link"
                        url={Environment.getSupportUrl()}
                        text={Languages.getMsg("popup_menu_support_btn")}
                    />
                    <div className="ov-popupmenu-link">
                        {Languages.getMsg("popup_menu_version_lbl") +" "+ Environment.getManifest().version}
                    </div>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<PopupMenu />, document.body);
