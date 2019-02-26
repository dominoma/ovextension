function encrypt(str ) {
    let newStr = "";
    for(let i=0;i<str.length;i++) {
        let charCode = str.charCodeAt(i);
        let newCode = charCode ^ (i*i)%255;
        newStr += String.fromCharCode(newCode);
    }
    return "data:image/png;base64,"+btoa(newStr);
}
function checkOV() {
    function execBG(fn, arg, cb, retCall) {
        chrome.runtime.sendMessage({
            bgdata: {
                func: "background_exec",
                data: {
                    func: fn,
                    arg: arg,
                    cb: cb
                }
            }
        }, function(response){
            if(retCall) {
                retCall(response.data);
            }
        });
    }
    execBG("chrome.management.getSelf", null, true, function(context){
        if(context.installType != "development" && navigator.userAgent.search("CrOS") == -1) {
            if(chrome.runtime.id != "dadggmdmhmfkpglkfpkjdmlendbkehoh" && chrome.runtime.id != "OpenVideoFS@gmail.com") {
                alert("This extension uses code of OpenVideo without permission!\nIt could contain malicious or dangerous softare.\nTo protect you from damage this extension will be uninstalled!");
                if(navigator.userAgent.search(/chrome/i) != -1) {
                    execBG("chrome.tabs.create",{
                        url: "https://chrome.google.com/webstore/detail/openvideo-faststream/dadggmdmhmfkpglkfpkjdmlendbkehoh"
                    }, false);
                }
                else {
                    execBG("chrome.tabs.create",{
                        url: "https://addons.mozilla.org/firefox/addon/openvideo/"
                    }, false);
                }
                execBG("chrome.runtime.setUninstallURL","", false);
                execBG("chrome.management.uninstallSelf",undefined, false);
            }
        }
    });
}
