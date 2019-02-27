import * as Storage from "OV/storage";
import * as Languages from "OV/languages";
import * as Messages from "OV/messages";
import * as ScriptBase from "redirect_scripts_base";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "options.scss";
Messages.setupMiddleware();
type SwitchProps = { onChange: (obj: Switch) => void, enabled?: boolean };
class Switch extends React.Component<SwitchProps,{ enabled: boolean }>{
    constructor(props : SwitchProps) {
        super(props);
        this.setState({ enabled: !!this.props.enabled });
    }
    render() {
        return (
            <label className="switch">
                <input type="checkbox" checked={this.state.enabled} onChange={this.onChange.bind(this)}/>
                <div className="slider round"></div>
            </label>
        );
    }
    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ enabled: event.target.value == "true" });
        this.props.onChange(this);
    }
}
type SwitchesTableProps = { onChange?: (obj: HostsTable) => void, rows: number };
class HostsTable extends React.Component<SwitchesTableProps,{ name: string, enabled: boolean }[]>{
    constructor(props : SwitchesTableProps) {
        super(props);
        this.loadHostsIntoState();
    }
    async loadHostsIntoState() {
        let redirectHosts = await ScriptBase.getRedirectHosts();
        let state = await Promise.all(redirectHosts.map(async function(host){
            let enabled = await ScriptBase.isScriptEnabled(host.name);
            return { name: host.name, enabled: enabled };
        }));

        this.setState(state);
    }
    getSwitchChangeCallback(name : string) {
        let _this = this;
        return function(target : Switch){
            _this.onSwitchChange(target, name)
        };
    }
    getSwitches() {
        let cells = this.state.map(function(this: HostsTable, host){
            return [
                <td>
                    <Switch onChange={this.getSwitchChangeCallback(host.name)} enabled={host.enabled}/>
                </td>,
                <td>
                    <span>{host.name}</span>
                </td>

            ];
        }, this);
        let rows = [];
        for(let i=0;i<this.props.rows;i++) {
            rows.push(<tr>{cells.slice(i*this.props.rows,(i+1)*this.props.rows)}</tr>);
        }
        return rows;
    }
    onSwitchChange(target : Switch, name: string) {
        let index = this.state.findIndex(function(host){
            return host.name == name;
        });
        let state = this.state;
        state[index] = { name: name, enabled: target.state.enabled };
        ScriptBase.setScriptEnabled(name, target.state.enabled);
        this.setState(state);
        if(this.props.onChange) {
            this.props.onChange(this);
        }
    }
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th colSpan={6}>
                            <h2>{Languages.getMsg("options_site_redirections_lbl")}</h2>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.getSwitches()}
                </tbody>
            </table>
        );
    }
};
class OtherOptionsTable extends React.Component<{},{ analytics: boolean, videopopup: boolean, history: boolean }>{
    constructor() {
        super({});
        this.loadState();
    }
    async loadState() {
        let values = await Promise.all([
            Storage.sync.get("History"),
            Storage.sync.get("VideoPopup"),
            Storage.sync.get("Analytics")
        ]);
        this.setState({
            history: values[0] != false,
            videopopup: values[1] != false,
            analytics: values[2] != false
        });
    }
    render() {
        return (
            <table>
                <tr>
                    <td><Switch onChange={this.videopopupChange}/></td>
                    <td>
                        <span>{Languages.getMsg("options_site_enable_history_ckb")}</span>
                    </td>
                    <td><Switch onChange={this.historyChange}/></td>
                    <td>
                        <span>{Languages.getMsg("options_site_enable_popup_ckb")}</span>
                    </td>
                    <td><Switch onChange={this.analyticsChange}/></td>
                    <td>
                        <span>{Languages.getMsg("options_site_use_analytics_ckb")}</span>
                    </td>
                </tr>
            </table>
        );
    }
    analyticsChange(el : Switch) {
        Storage.sync.set("Analytics", el.state.enabled);
        this.setState({
            analytics: el.state.enabled
        });
    }
    historyChange(el : Switch) {
        Storage.sync.set("History", el.state.enabled);
        this.setState({
            history: el.state.enabled
        });
    }
    videopopupChange(el : Switch) {
        Storage.sync.set("VideoPopup", el.state.enabled);
        this.setState({
            videopopup: el.state.enabled
        });
    }
}
class Body extends React.Component<{},{}> {
    render() {
        return (
            <div>
                <div className="section">
                    <h1>{Languages.getMsg("options_site_redirect_options_lbl")}</h1>
                    <HostsTable rows={6}/>
                </div>
                <div className="section-last">
                    <h1>{Languages.getMsg("options_site_other_options_lbl")}</h1>
                    <OtherOptionsTable/>
                </div>
            </div>
        );
    }
}
ReactDOM.render(
  <Body />,
  document.body
);
