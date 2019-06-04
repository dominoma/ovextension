import ScriptManager, {RunScopes} from "redirect_scripts_base";
import * as RedirectScripts from "../RedirectScripts";
import * as TheatreMode from "Messages/theatremode";
import * as Proxy from "OV/proxy";
import * as Page from "OV/page";
RedirectScripts.install();
ScriptManager.run(RunScopes.document_idle, async function() {
    if(Page.isFrame()) {
        TheatreMode.setupIframe();
    }
}, async function(videoData){
    await Proxy.addHostsfromVideos(videoData);
});
