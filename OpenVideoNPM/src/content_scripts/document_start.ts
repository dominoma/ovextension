import * as ScriptBase from "redirect_scripts_base";
import * as Messages from "OV/messages";
import * as TheatreMode from "Messages/theatremode";
import * as RedirectScripts from "../RedirectScripts";
Messages.setupMiddleware();
RedirectScripts.install();
ScriptBase.startScripts(ScriptBase.RunScopes.document_start).then(function(){
    TheatreMode.setupIframe();
});