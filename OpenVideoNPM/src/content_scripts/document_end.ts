import ScriptManager, {RunScopes} from "redirect_scripts_base";
import * as Storage from "OV/storage";
import * as RedirectScripts from "../RedirectScripts";
import * as TheatreMode from "Messages/theatremode";
import * as Proxy from "OV/proxy";
import * as Page from "OV/page";
import * as VideoPopup from "Messages/videopopup";
Storage.isVideoSearchEnabled().then(async function(value) {
    if (value) {
        VideoPopup.setupCS();
        //await Page.injectScript("../pages/assets/js/vendors");
        await Page.injectScript("search_videos");
    }
});
