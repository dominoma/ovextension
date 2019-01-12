import * as ScriptBase from "redirect_scripts_base";
import * as RedirectScripts from "../RedirectScripts";
import * as TheatreMode from "Messages/theatremode";
RedirectScripts.install();
ScriptBase.startScripts(ScriptBase.RunScopes.document_idle).then(function(){
    TheatreMode.setupIframe();
});