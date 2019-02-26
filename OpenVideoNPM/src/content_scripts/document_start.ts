import * as ScriptBase from "redirect_scripts_base";
import * as Messages from "OV/messages";
import * as TheatreMode from "Messages/theatremode";
import * as RedirectScripts from "../RedirectScripts";
import * as Proxy from "OV/proxy";
import * as Page from "OV/page";
Messages.setupMiddleware();
RedirectScripts.install();
ScriptBase.startScripts(ScriptBase.RunScopes.document_start, async function() {
    if(Page.isFrame()) {
        TheatreMode.setupIframe();
    }
}, async function(videoData){
    await Proxy.addHostsfromVideos(videoData);
});
