OV.messages.setupMiddleware();
function createSwitch(labelText : string, tableRow : HTMLTableRowElement, labelId?: string){
    
    var switchCell = tableRow.insertCell();
    var switchLabel = document.createElement('label');
    var switchInput = document.createElement('input');
    var switchSlider = document.createElement('div');

    switchCell.appendChild(switchLabel);
    switchLabel.appendChild(switchInput);
    switchLabel.appendChild(switchSlider);

    switchLabel.className = 'switch';
    switchInput.type = 'checkbox';
    switchInput.id = labelId ? labelId : labelText;
    switchSlider.className = 'slider round';

    var hostCell = tableRow.insertCell();
    var hostSpan = document.createElement('span');

    hostCell.appendChild(hostSpan);

    hostSpan.innerHTML = labelText;
    hostCell.style.paddingBottom = '5px';
    return switchInput;
}
OV.page.isReady().then(function() {
    
    document.getElementById("options_site_redirect_options_lbl").innerText = OV.languages.getMsg("options_site_redirect_options_lbl");
    document.getElementById("options_site_redirections_lbl").innerText = OV.languages.getMsg("options_site_redirections_lbl");
    document.getElementById("options_site_other_options_lbl").innerText = OV.languages.getMsg("options_site_other_options_lbl");

    var SwitchesTable : HTMLTableElement = document.getElementById("redirectSwitches") as HTMLTableElement;
    ScriptBase.getRedirectHosts().then(function(redirectHosts){
        var row = 0;
        for(let host of redirectHosts){
            ScriptBase.isScriptEnabled(host.name).then(function(enabled){
                createSwitch(host.name, SwitchesTable.rows[row]).checked = enabled;
                row++;
                if(row == SwitchesTable.rows.length) {
                    row = 0;
                }
            });
        }
    });
    SwitchesTable.onchange = function() {
        SwitchesTable.querySelectorAll("input[type=checkbox]").forEach(function(Switch : HTMLInputElement){
            ScriptBase.setScriptEnabled(Switch.id,Switch.checked);
        });
    }
    /*var HostsTable = document.getElementById("blacklistHosts");
    LoadList("popupHostBlacklist",HostsTable);
    var HostsTable = document.getElementById("blacklistUrls");
    LoadList("popupUrlBlacklist",HostsTable);
    var HostsTable = document.getElementById("blacklistVideos");
    LoadList("popupVideoUrlBlacklist",HostsTable);*/
    
    var otherOptionsTable = document.getElementById("otherOptions") as HTMLTableElement;
    OV.storage.sync.get("disableHistory").then(function(value){
        createSwitch(OV.languages.getMsg("options_site_enable_history_ckb"), otherOptionsTable.rows[0], "options_site_enable_history_ckb").checked = !value;
    });
    ScriptBase.isScriptEnabled("All videos").then(function(value){
        createSwitch(OV.languages.getMsg("options_site_enable_popup_ckb"), otherOptionsTable.rows[0], "options_site_enable_popup_ckb").checked = value;
    });
    OV.storage.sync.get("AnalyticsEnabled").then(function(value){
        createSwitch(OV.languages.getMsg("options_site_use_analytics_ckb"), otherOptionsTable.rows[0], "options_site_use_analytics_ckb").checked = value || value == undefined;
    });
    /*getSyncStorageItem("showPopupMinimized",function(value){
        CreateSwitch("Show Popup minimized", otherOptionsTable.rows[0]).checked = value;
    });*/
    otherOptionsTable.onchange = function() {
        OV.storage.sync.set("disableHistory",!(document.getElementById("options_site_enable_history_ckb") as HTMLInputElement).checked);
        ScriptBase.setScriptEnabled("All videos",(document.getElementById("options_site_enable_popup_ckb") as HTMLInputElement).checked);
        OV.storage.sync.set("AnalyticsEnabled",(document.getElementById("options_site_use_analytics_ckb") as HTMLInputElement).checked);
        //setSyncStorageItem("showPopupMinimized",document.getElementById("Show Popup minimized").checked);
    }
    
});