import * as ScriptBase from "redirect_scripts_base";
import * as RedirectScripts from "../RedirectScripts";
import * as TheatreMode from "Messages/theatremode";
import * as Proxy from "OV/proxy";
import * as Page from "OV/page";
import * as VideoPopup from "Messages/videopopup";
RedirectScripts.install();
ScriptBase.startScripts(ScriptBase.RunScopes.document_end, async function() {
    if(Page.isFrame()) {
        TheatreMode.setupIframe();
    }
}, async function(videoData){
    await Proxy.addHostsfromVideos(videoData);
});
ScriptBase.isScriptEnabled("All videos").then(function(value) {
    if (value) {
        VideoPopup.setupCS();
        Page.injectScript("search_videos");
    }
});
