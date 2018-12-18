ScriptBase.addRedirectHost({
    name: "RapidVideo",
    scripts: [{
        urlPattern: /https?:\/\/(www\.)rapidvideo\.[^\/,^\.]{2,}\/[\?v=[^&\?]*|e\/.+]/i,
        runScopes: [{
            run_at: ScriptBase.RunScopes.document_start,
            script: function(details) : Promise<VideoTypes.VideoData> {
                details.url = details.url.replace(/\/?\?v=/i, "/e/").replace(/[&\?]q=?[^&\?]*/i,"").replace(/[&\?]autostart=?[^&\?]*/i,"");
                var xmlHttpObj = OV.environment.browser() == OV.environment.Browsers.Chrome ? null : (window as any).XPCNativeWrapper(new (window as any).wrappedJSObject.XMLHttpRequest());
                var parser = new DOMParser();
                interface VideoInfo {
                    title: string;
                    poster: string;
                    tracks: VideoTypes.SubtitleSource[];
                    urls: string[];
                }
                function getVideoInfo() : Promise<VideoInfo> {
                    return OV.tools.createRequest({ url: details.url, xmlHttpObj: xmlHttpObj }).then(function(xhr){
                        var html = parser.parseFromString(xhr.response, "text/html");
                        var title = html.title;
                        var videoTag = html.getElementsByTagName("video")[0];
                        var poster = videoTag.poster;
                        var tracksHTML = videoTag.getElementsByTagName("track");
                        var tracks = [];
                        for(var track of tracksHTML) {
                            tracks.push({ src: track.src, label: track.label, kind: track.kind, default: track.default });
                        }
                        var urlsHTML = document.querySelectorAll('a[href*="https://www.rapidvideo.com/e/"]') as NodeListOf<HTMLAnchorElement>;
                        var urls : string[] = [];
                        for(var url of urlsHTML) {
                            urls.push(url.href);
                        }
                        return { title: title, poster: poster, tracks: tracks, urls: urls };
                            
                    });
                }
                function getVideoSrc(url : string) {
                    return OV.tools.createRequest({ url: url, xmlHttpObj: xmlHttpObj }).then(function(xhr){
                        var html = parser.parseFromString(xhr.response, "text/html");
                        var source = html.getElementsByTagName("source")[0];
                        return { 
                           src: source.src,
                           label: source.title,
                           type: source.type,
                           res: parseInt(source.dataset.res)
                        };
                    });
                }
                function getVideoSrces(info : VideoInfo) : Promise<VideoTypes.VideoData> {
                    return Promise.all(info.urls.map(getVideoSrc)).then(function(videos){
                        return { src: videos, poster: info.poster, title: info.title, tracks: info.tracks } as VideoTypes.VideoData;
                    });
                }
                return getVideoInfo().then(function(info){
                    return getVideoSrces(info);
                });
            }
        }]
    }]
});
ScriptBase.addRedirectHost({
    name: "OpenLoad",
    scripts: [{
        urlPattern: /https?:\/\/(www\.)[openload|oload]\.[^\/,^\.]{2,}\/[embed|f]\/.+]/i,
        runScopes: [{
            run_at: ScriptBase.RunScopes.document_start,
            script: function(details) : Promise<VideoTypes.VideoData> {
                details.url = details.url.replace(/[openload|oload]\.[^\/,^\.]{2,}/, "openload.co");
                if (details.url.indexOf("/f/") != -1) {
                    OV.analytics.fireEvent("Utils", "OpenLoad over File", details.url)
                    details.url = details.url.replace("/f/", "/embed/");
                }
                    
                function getStreamUrl(longString : string, varAtbytes : number, varAt_1x4bfb36 : number) : string {
                    var streamUrl = "";
                    var hexByteArr = [];
                    for (let i = 0; i < 9*8; i += 8) {
                        hexByteArr.push(parseInt(longString.substring(i, i + 8), 16));
                    }
                    longString = longString.substring(9 * 8); 
                    var iterator = 0;
                    for (var arrIterator = 0;iterator < longString.length; arrIterator++) {
                        var maxHex = 64;
                        var value = 0;
                        var currHex = 255;
                        for (var byteIterator = 0;currHex >= maxHex; byteIterator+=6) {
                            if (iterator + 1 >= longString.length) {
                                maxHex = 0x8F;
                            }
                            currHex = parseInt(longString.substring(iterator, iterator + 2), 16);
                            value += (currHex & 63) << byteIterator;
                            iterator += 2;
                        }
                        var bytes = value ^ hexByteArr[arrIterator % 9] ^ varAtbytes ^ varAt_1x4bfb36;
                        var usedBytes = maxHex * 2 + 127;
                        for (let i = 0; i < 4; i++) {
                            var urlChar = String.fromCharCode(((bytes & usedBytes) >> 8*i) - 1);
                            if (urlChar != "$") {
                                streamUrl += urlChar;
                            }
                            usedBytes = usedBytes << 8;
                        }
                    }
                    //console.log(streamUrl)    
                    return streamUrl;
                }
                return OV.tools.createRequest({ url: details.url }).then(function(xhr){
                    var HTML = xhr.responseText;
                    
                    if(xhr.status != 200 || HTML.indexOf("We can't find the file you are looking for. It maybe got deleted by the owner or was removed due a copyright violation.") != -1 || HTML.indexOf("The file you are looking for was blocked.") != -1) {
                        throw Error("No Video");
                    }
                    
                    var thumbnailUrl = HTML.match(/poster="([^"]*)"/)[1];
                    var title = HTML.match(/meta name="og:title" content="([^"]*)"/)[1];
                    
                    var subtitleTags = HTML.match(/<track(.*)\/>/g) || [];
                    var subtitles = [];
                    for(var subtitleTag of subtitleTags) {
                        var label = subtitleTag.match(/label="([^"]*)"/)[1];
                        var src = subtitleTag.match(/src="([^"]*)"/)[1];
                        if(src) {
                            subtitles.push({kind: "captions", label: label, src: src, default: subtitleTag.indexOf("default") != -1  });
                        }
                    }
                    
                    var longString = HTML.match(/<div class="" style="display:none;">([^<]*)<\/div>/)[1];
                    
                    var keyNum1 = HTML.match(/\(\_0x45ae41\[\_0x5949\('0xf'\)\]\(\_0x30725e,", "\)([0-9]*)\_1x4bfb36/)[1];
                    var keyNum2 = HTML.match(/\_1x4bfb36=([0-9]*);/)[1];
                    
                    var keyResult1 = 0;
                    var keyResult2 = 0;
                    //console.log(longString, keyNum1, keyNum2);
                    try {
                        var keyNum1_Oct = parseInt(keyNum1.match(/\('([^']*)',/)[1], 8);
                        var keyNum1_Sub = parseInt(keyNum1.match(/\)\-([^\+]*)\+/)[1]);
                        var keyNum1_Div = parseInt(keyNum1.match(/\/\(([^\-]*)\-/)[1]);
                        var keyNum1_Sub2 = parseInt(keyNum1.match(/\+0x4\-([^\)]*)\)/)[1]);
                        
                        keyResult1 = (keyNum1_Oct - keyNum1_Sub + 4 - keyNum1_Sub2) / (keyNum1_Div - 8);
                        
                        var keyNum2_Oct = parseInt(keyNum2.match(/\('([^']*)',/)[1], 8);
                        var keyNum2_Sub = parseInt(keyNum2.substr(keyNum2.indexOf(")-")+2));
                        
                        keyResult2 = keyNum2_Oct - keyNum2_Sub;
                        console.log(keyNum1, keyNum2);
                        
                    }
                    catch(e) {
                        //console.error(e.stack);
                        throw Error("Key Numbers not parsed!");
                    }   
                    return {
                        
                        src: [{
                            type: "video/mp4", 
                            src: "https://"
                            + OV.tools.parseUrl(details.url).host
                            + "/stream/" + getStreamUrl(longString, keyResult1, keyResult2)
                            + "?mime=true",
                            label: "SD"
                        }],
                        poster: thumbnailUrl,
                        title: title,
                        tracks: subtitles
                        
                    } as VideoTypes.VideoData;
                });
                
            }
        }]
    }]
});