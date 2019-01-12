import * as TheatreMode from "Messages/theatremode";
import * as Metadata from "Messages/metadata";
import * as VideoPopup from "Messages/videopopup";
import * as Messages from "OV/messages";
import * as Page from "OV/page";
import * as ScriptBase from "redirect_scripts_base";
Messages.setupMiddleware();
TheatreMode.setup();
Metadata.setup();
VideoPopup.setup();
ScriptBase.isScriptEnabled("All videos").then(function(value){
    if(value) {
        Messages.addListener({
            pauseVideos: function() {
                for(let video of document.getElementsByTagName("video")){
                    video.pause();
                };
            }
        })
        Page.injectScript("search_videos");
    }
});
