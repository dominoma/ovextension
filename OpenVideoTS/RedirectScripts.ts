ScriptBase.addRedirectHost({
    name: "RapidVideo",
    scripts: [{
        urlPattern: /rapidvideo/,
        runScopes: [{
            run_at: ScriptBase.RunScopes.document_start,
            script: function(details) : Promise<VideoTypes.VideoData> {
                return new Promise<VideoTypes.VideoData>(function(resolve, reject){
                    
                });
            }
        }]
    }]
});