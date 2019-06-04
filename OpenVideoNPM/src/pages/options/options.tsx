import * as Storage from "OV/storage";
import * as Languages from "OV/languages";
import * as Messages from "OV/messages";
import ScriptManager from "redirect_scripts_base";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./options.scss";
Messages.setupMiddleware();
type SwitchProps = { onChange: (enabled: boolean) => void, enabled?: boolean };
class Switch extends React.Component<SwitchProps,{ enabled: boolean }>{
    constructor(props : SwitchProps) {
        super(props);
        this.state = { enabled: !!this.props.enabled };
    }
    componentDidUpdate(oldProps : SwitchProps) {
        if(oldProps.enabled != this.props.enabled) {
            this.setState({ enabled: !!this.props.enabled })
        }
    }
    render() {
        return (
            <label className="ov-options-switch">
                <input type="checkbox" checked={this.state.enabled} onChange={this.onChange.bind(this)}/>
                <div></div>
            </label>
        );
    }
    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ enabled: event.target.checked });
        this.props.onChange(event.target.checked );
    }
}
type BooleanMap = { [key:string] : boolean };
type ScriptSwitschesProps = {  };
type ScriptSwitschesState = {
    isEnabled: BooleanMap;
};
class ScriptSwitsches extends React.Component<ScriptSwitschesProps,ScriptSwitschesState>{
    constructor(props : ScriptSwitschesProps) {
        super(props);
        this.state = { isEnabled: {} };
        this.loadHostsIntoState();
    }
    async loadHostsIntoState() {
        let redirectHosts = await ScriptManager.hosts;
        let scriptsEnabled = await Promise.all(redirectHosts.map(async (host) => {
            return { name: host.name, enabled: await Storage.isScriptEnabled(host.name) };
        }));

        let state = scriptsEnabled.reduce((obj, scriptEnabled) => {
            obj[scriptEnabled.name] = scriptEnabled.enabled;
            return obj;
        }, {} as BooleanMap)

        this.setState({ isEnabled: state });
    }
    getSwitchChangeCallback(name : string) {
        return (enabled : boolean) => {
            let state = this.state.isEnabled;
            state[name] = enabled;
            console.log(enabled, state);
            this.setState({ isEnabled: state });
            Storage.setScriptEnabled(name, enabled);
        };
    }
    getSwitches() {
        let switches = [];
        for(let host in this.state.isEnabled) {
            switches.push(
                <div className="ov-options-script" key={host}>
                    <Switch
                        onChange={this.getSwitchChangeCallback(host)}
                        enabled={this.state.isEnabled[host]}
                    />
                    <div className="ov-options-switch-title">{host}</div>
                </div>
            );
        }
        return switches;
    }
    render() {
        return (
            <div className="ov-options-scripts">
                {this.getSwitches()}
            </div>
        );
    }
};
type OtherSwitchesState = {
    analytics: boolean;
    videopopup: boolean;
    history: boolean;
}
class OtherSwitches extends React.Component<{}, OtherSwitchesState>{
    constructor(props : {}) {
        super(props);
        this.state = { analytics: true, videopopup: true, history: true };
        this.loadState();
    }
    async loadState() {
        let values = await Promise.all([
            Storage.isHistoryEnabled(),
            Storage.isVideoSearchEnabled(),
            Storage.isAnalyticsEnabled()
        ]);
        this.setState({
            history: values[0],
            videopopup: values[1],
            analytics: values[2]
        });
    }
    render() {
        return (
            <div className="ov-options-others">
                <Switch enabled={this.state.videopopup} onChange={this.videopopupChange.bind(this)}/>
                <div className="ov-options-switch-title">{Languages.getMsg("options_site_enable_popup_ckb")}</div>
                <Switch enabled={this.state.history} onChange={this.historyChange.bind(this)}/>
                <div className="ov-options-switch-title">{Languages.getMsg("options_site_enable_history_ckb")}</div>
                <Switch enabled={this.state.analytics} onChange={this.analyticsChange.bind(this)}/>
                <div className="ov-options-switch-title">{Languages.getMsg("options_site_use_analytics_ckb")}</div>
            </div>
        );
    }
    analyticsChange(enabled : boolean) {
        Storage.setAnalyticsEnabled(enabled);
        this.setState({
            analytics: enabled
        });
    }
    historyChange(enabled : boolean) {
        Storage.setHistoryEnabled(enabled);
        this.setState({
            history: enabled
        });
    }
    videopopupChange(enabled : boolean) {
        Storage.setVideoSearchEnabled(enabled);
        this.setState({
            videopopup: enabled
        });
    }
}
class Options extends React.Component<{},{}> {
    render() {
        return (
            <div className="ov-options">
                <h1 className="ov-options-header">{Languages.getMsg("options_site_redirect_options_lbl")}</h1>
                <ScriptSwitsches/>
                <h1>{Languages.getMsg("options_site_other_options_lbl")}</h1>
                <OtherSwitches/>
            </div>
        );
    }
}
ReactDOM.render(
  <Options />,
  document.body
);
