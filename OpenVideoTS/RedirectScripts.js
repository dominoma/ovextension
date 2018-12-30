function suspectSubtitledVideo(details, xhr) {
    if (xhr.response.indexOf(/(<track>|\.vtt|"?tracks"?: \[\{|)/) != -1) {
        OV.analytics.fireEvent(details.hostname, "TracksFound", details.url);
    }
}
ScriptBase.addRedirectHost({
    name: "RapidVideo",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?rapidvideo\.[^\/,^\.]{2,}\/[\?v=[^&\?]*|e\/.+]/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        details.url = details.url.replace(/\/?\?v=/i, "/e/").replace(/[&\?]q=?[^&\?]*/i, "").replace(/[&\?]autostart=?[^&\?]*/i, "");
                        let xmlHttpObj = OV.environment.browser() == "chrome" /* Chrome */ ? null : window.XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
                        let parser = new DOMParser();
                        function checkResponse(xhr) {
                            if (xhr.response.indexOf("To continue, please type the characters below") != -1) {
                                location.href = OV.tools.addParamsToURL(location.href, { ovignore: "true" });
                            }
                        }
                        function getVideoInfo() {
                            return OV.tools.createRequest({ url: details.url, xmlHttpObj: xmlHttpObj }).then(function (xhr) {
                                suspectSubtitledVideo(details, xhr);
                                checkResponse(xhr);
                                let html = parser.parseFromString(xhr.response, "text/html");
                                let title = html.title;
                                let videoTag = html.getElementsByTagName("video")[0];
                                let poster = videoTag.poster;
                                let tracksHTML = videoTag.getElementsByTagName("track");
                                let tracks = [];
                                for (let track of tracksHTML) {
                                    tracks.push({ src: track.src, label: track.label, kind: track.kind, default: track.default });
                                }
                                let urlsHTML = html.querySelectorAll('a[href*="https://www.rapidvideo.com/e/"]');
                                let urls = [];
                                for (let url of urlsHTML) {
                                    urls.push(url.href);
                                }
                                return { title: title, poster: poster, tracks: tracks, urls: urls };
                            });
                        }
                        function getVideoSrc(url) {
                            return OV.tools.createRequest({ url: url, xmlHttpObj: xmlHttpObj }).then(function (xhr) {
                                checkResponse(xhr);
                                let html = parser.parseFromString(xhr.response, "text/html");
                                let source = html.getElementsByTagName("source")[0];
                                return {
                                    src: source.src,
                                    label: source.title,
                                    type: source.type,
                                    res: parseInt(source.dataset.res)
                                };
                            });
                        }
                        function getVideoSrces(info) {
                            return Promise.all(info.urls.map(getVideoSrc)).then(function (videos) {
                                OV.array.last(videos).default = true;
                                return { src: videos, poster: info.poster, title: info.title, tracks: info.tracks };
                            });
                        }
                        return getVideoInfo().then(function (info) {
                            return getVideoSrces(info);
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "OpenLoad",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?(openload|oload)\.[^\/,^\.]{2,}\/(embed|f)\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        if (details.url.indexOf("openload.co") == -1) {
                            location.href = details.url.replace(/(openload|oload)\.[^\/,^\.]{2,}/, "openload.co");
                        }
                        if (details.url.indexOf("/f/") != -1) {
                            OV.analytics.fireEvent("OpenLoad over File", "Utils", details.url);
                            details.url = details.url.replace("/f/", "/embed/");
                        }
                        function getStreamUrl(longString, varAtbytes, varAt_1x4bfb36) {
                            let streamUrl = "";
                            let hexByteArr = [];
                            for (let i = 0; i < 9 * 8; i += 8) {
                                hexByteArr.push(parseInt(longString.substring(i, i + 8), 16));
                            }
                            longString = longString.substring(9 * 8);
                            let iterator = 0;
                            for (let arrIterator = 0; iterator < longString.length; arrIterator++) {
                                let maxHex = 64;
                                let value = 0;
                                let currHex = 255;
                                for (let byteIterator = 0; currHex >= maxHex; byteIterator += 6) {
                                    if (iterator + 1 >= longString.length) {
                                        maxHex = 0x8F;
                                    }
                                    currHex = parseInt(longString.substring(iterator, iterator + 2), 16);
                                    value += (currHex & 63) << byteIterator;
                                    iterator += 2;
                                }
                                let bytes = value ^ hexByteArr[arrIterator % 9] ^ varAtbytes ^ varAt_1x4bfb36;
                                let usedBytes = maxHex * 2 + 127;
                                for (let i = 0; i < 4; i++) {
                                    let urlChar = String.fromCharCode(((bytes & usedBytes) >> 8 * i) - 1);
                                    if (urlChar != "$") {
                                        streamUrl += urlChar;
                                    }
                                    usedBytes = usedBytes << 8;
                                }
                            }
                            //console.log(streamUrl)    
                            return streamUrl;
                        }
                        console.log(details.url);
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.responseText;
                            console.log(xhr.responseURL);
                            if (xhr.status != 200 || HTML.indexOf("We can't find the file you are looking for. It maybe got deleted by the owner or was removed due a copyright violation.") != -1 || HTML.indexOf("The file you are looking for was blocked.") != -1) {
                                console.log(xhr.status, HTML);
                                throw Error("No Video");
                            }
                            let thumbnailUrl = HTML.match(/poster="([^"]*)"/)[1];
                            let title = HTML.match(/meta name="og:title" content="([^"]*)"/)[1];
                            let subtitleTags = HTML.match(/<track(.*)\/>/g) || [];
                            let subtitles = [];
                            for (let subtitleTag of subtitleTags) {
                                let label = subtitleTag.match(/label="([^"]*)"/)[1];
                                let src = subtitleTag.match(/src="([^"]*)"/);
                                if (src) {
                                    subtitles.push({ kind: "captions", label: label, src: src[1], default: subtitleTag.indexOf("default") != -1 });
                                }
                            }
                            let longString = HTML.match(/<p style=""[^>]*>([^<]*)<\/p>/)[1];
                            console.log(longString);
                            let keyNum1 = HTML.match(/\_0x45ae41\[\_0x5949\('0xf'\)\]\(_0x30725e,(.*)\),\_1x4bfb36/)[1];
                            let keyNum2 = HTML.match(/\_1x4bfb36=(.*);/)[1];
                            let keyResult1 = 0;
                            let keyResult2 = 0;
                            //console.log(longString, keyNum1, keyNum2);
                            try {
                                let keyNum1_Oct = parseInt(keyNum1.match(/parseInt\('(.*)',8\)/)[1], 8);
                                let keyNum1_Sub = parseInt(keyNum1.match(/\)\-([^\+]*)\+/)[1]);
                                let keyNum1_Div = parseInt(keyNum1.match(/\/\(([^\-]*)\-/)[1]);
                                let keyNum1_Sub2 = parseInt(keyNum1.match(/\+0x4\-([^\)]*)\)/)[1]);
                                keyResult1 = (keyNum1_Oct - keyNum1_Sub + 4 - keyNum1_Sub2) / (keyNum1_Div - 8);
                                let keyNum2_Oct = parseInt(keyNum2.match(/\('([^']*)',/)[1], 8);
                                let keyNum2_Sub = parseInt(keyNum2.substr(keyNum2.indexOf(")-") + 2));
                                keyResult2 = keyNum2_Oct - keyNum2_Sub;
                                console.log(keyNum1, keyNum2);
                            }
                            catch (e) {
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
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "FruitStreams",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?(streamango|fruitstreams|streamcherry|fruitadblock)\.[^\/,^\.]{2,}\/(f|embed)\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        details.url = details.url.replace(/(streamango|fruitstreams|streamcherry|fruitadblock)\.[^\/,^\.]{2,}/, "fruitstreams.com").replace(/\/f\//, "/embed/");
                        function resolveVideo(hashCode, intVal) {
                            let chars = "=/+9876543210zyxwvutsrqponmlkjihgfedcbaZYXWVUTSRQPONMLKJIHGFEDCBA";
                            let retVal = '';
                            hashCode = hashCode.replace(/[^A-Za-z0-9\+\/\=]/g, '');
                            for (let hashIndex = 0; hashIndex < hashCode.length; hashIndex += 4) {
                                let hashCharCode_0 = chars.indexOf(hashCode.charAt(hashIndex));
                                let hashCharCode_1 = chars.indexOf(hashCode.charAt(hashIndex + 1));
                                let hashCharCode_2 = chars.indexOf(hashCode.charAt(hashIndex + 2));
                                let hashCharCode_3 = chars.indexOf(hashCode.charAt(hashIndex + 3));
                                retVal = retVal + String.fromCharCode(((hashCharCode_0 << 0x2) | (hashCharCode_1 >> 0x4)) ^ intVal);
                                if (hashCharCode_2 != 0x40) {
                                    retVal = retVal + String.fromCharCode(((hashCharCode_1 & 0xf) << 0x4) | (hashCharCode_2 >> 0x2));
                                }
                                if (hashCharCode_3 != 0x40) {
                                    retVal = retVal + String.fromCharCode(((hashCharCode_2 & 0x3) << 0x6) | hashCharCode_3);
                                }
                            }
                            return retVal;
                        }
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.responseText;
                            if (xhr.status != 200 || HTML.indexOf("We are unable to find the video you're looking for.") != -1) {
                                throw Error("No Video!");
                            }
                            let funcParams = HTML.match(/src:d\('([^']*)',([^\)]*)/);
                            let funcStr = funcParams[1];
                            let funcInt = parseInt(funcParams[2]);
                            let src = { type: "video/mp4", src: "https:" + resolveVideo(funcStr, funcInt), label: "SD" };
                            let poster = HTML.match(/poster="([^"]*)"/)[1];
                            let title = HTML.match(/meta name="og:title" content="([^"]*)"/)[1];
                            return { src: [src], poster: poster, title: title, tracks: [] };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "MyCloud",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?mcloud\.[^\/,^\.]{2,}\/embed\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        return new Promise(function (resolve, reject) {
                            OV.page.isReady().then(function () {
                                let HTML = document.documentElement.innerHTML;
                                let title = HTML.match(/<title>([^<]*)<\/title>/)[1];
                                let rawsrces = JSON.parse(HTML.match(/sources: (\[\{.*\}\])/)[1]);
                                let srces = [];
                                for (let src of rawsrces) {
                                    srces.push({ src: src.file, type: "application/x-mpegURL", label: "SD" });
                                }
                                ;
                                let poster = HTML.match(/image: '([^']*)'/)[1];
                                resolve({
                                    src: srces,
                                    poster: poster,
                                    title: title,
                                    tracks: []
                                });
                            });
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "VidCloud",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?(vidcloud|vcstream|loadvid)\.[^\/,^\.]{2,}\/embed\/([a-zA-Z0-9]*)/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        let embedID = details.match[3];
                        return Promise.all([
                            OV.tools.createRequest({ url: "https://vidcloud.co/player", data: { fid: embedID } }),
                            OV.tools.createRequest({ url: "https://vidcloud.co/download", type: "POST" /* POST */, data: { file_id: embedID } })
                        ]).then(function (xhrs) {
                            suspectSubtitledVideo(details, xhrs[0]);
                            let html = JSON.parse(xhrs[0].response).html;
                            let dlhtml = JSON.parse(xhrs[1].response).html;
                            let rawRes = dlhtml.match(/href="([^"]*)" download="([^"]*)"[^>]*>([^<]*)</g);
                            let dlsrces = [];
                            for (let res of rawRes) {
                                let matches = res.match(/href="([^"]*)" download="([^"]*)"[^>]*>([^<]*)</);
                                dlsrces.push({ src: matches[1], filename: "[" + matches[3] + "]" + matches[2], type: "video/mp4" });
                            }
                            let rawSrces = JSON.parse("[" + html.match(/.*sources = \[([^\]]*)/)[1] + "]");
                            let rawTracks = JSON.parse("[" + html.match(/.*tracks = \[([^\]]*)/)[1] + "]");
                            let title = html.match(/title: '([^']*)'/)[1];
                            let poster = html.match(/image: '([^']*)'/)[1];
                            let srces = [];
                            for (let i = 0; i < rawSrces.length; i++) {
                                srces.push({ src: rawSrces[i].file, type: "application/x-mpegURL", dlsrc: dlsrces[0], label: "SD" });
                            }
                            let tracks = [];
                            for (let track of rawTracks) {
                                tracks.push({ src: track.file, label: track.label, default: track.default || false, kind: track.kind });
                            }
                            return {
                                src: srces,
                                tracks: tracks,
                                title: title,
                                poster: poster
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "Vidoza",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?vidoza\.[^\/,^\.]{2,}\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.response;
                            if (details.url.indexOf("/embed") == -1) {
                                if (HTML.indexOf("videojs('player')") == -1) {
                                    throw Error("No Video!");
                                }
                                else {
                                    location.href = location.href.replace("vidoza.net/", "vidoza.net/embed-").replace(/\.html.*/, ".html");
                                    throw Error("No embed Video! Redirecting...");
                                }
                            }
                            else {
                                let rawsources = JSON.parse(HTML.match(/sourcesCode: (\[\{.*\}\])/)[1].replace(/src:/g, '"src":').replace(/type:/g, '"type":').replace(/label:/g, '"label":').replace(/res:/g, '"res":'));
                                let sources = [];
                                for (let src of rawsources) {
                                    sources.push({ src: src.src, label: src.res, type: src.type });
                                }
                                let title = HTML.match(/<title>([^<]*)<\/title>/)[1];
                                let poster = HTML.match(/poster: "([^"]*)"/)[1];
                                return {
                                    src: sources,
                                    poster: poster,
                                    title: title,
                                    tracks: []
                                };
                            }
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "MP4Upload",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?mp4upload\.[^\/,^\.]{2,}\/embed\-.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        console.log("W");
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.response;
                            let evalStr = HTML.match(/(eval\(function\(p,a,c,k,e,d\).*\.split\('\|'\)\)\))/)[1];
                            let code = OV.tools.unpackJS(evalStr);
                            let hash = JSON.parse(code.match(/player\.setup\((.*),"height"/)[1] + "}");
                            let src = hash.file;
                            let poster = hash.image;
                            return {
                                src: [{ type: "video/mp4", src: src, label: "SD" }],
                                poster: poster,
                                title: "MP4Upload Video",
                                tracks: []
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "Vivo",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?vivo\.[^\/,^\.]{2,}\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.response;
                            let videoURL = atob(HTML.match(/data-stream="([^"]*)"/)[1]);
                            let title = HTML.match(/<title>([^<]*)<\/title>/)[1];
                            return {
                                src: [{ type: "video/mp4", src: videoURL, label: "SD" }],
                                title: title,
                                tracks: [],
                                poster: ""
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "VidTo",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?vidto\.[^\/,^\.]{2,}\//i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        if (details.url.indexOf("embed-") == -1 && details.url.indexOf(".html") != -1) {
                            details.url = details.url.replace(/vidto\.[^\/,^\.]{2,}\//, "vidto.me/embed-");
                        }
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.responseText;
                            if (xhr.status != 200 || HTML.indexOf("File Does not Exist, or Has Been Removed") != -1) {
                                throw Error("No Video!");
                            }
                            let playerHashStr = "{" + HTML.match(/\.setup\(\{(.*)duration:/)[1] + "}";
                            let sources = playerHashStr.match(/sources:(.*\}\]),/)[1];
                            sources = sources.replace(/file:/g, '"src":');
                            sources = sources.replace(/label:/g, '"label":');
                            let srcObj = JSON.parse(sources);
                            srcObj[0].default = true;
                            let image = playerHashStr.match(/image: "([^"]*)"/)[1];
                            return {
                                src: srcObj,
                                title: "VidTo.me video",
                                poster: image,
                                tracks: []
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "StreamCloud",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?streamcloud\.[^\/,^\.]{2,}\/([^\.]+)(\.html)?/i,
            runScopes: [{
                    run_at: "document_idle" /* document_idle */,
                    hide_page: false,
                    script: function (details) {
                        return new Promise(function (resolve, reject) {
                            let button = document.getElementsByName('imhuman')[0];
                            if (button == undefined) {
                                reject(Error("No Video!"));
                            }
                            else {
                                OV.html.addAttributeListener(button, "class", function () {
                                    if (button.className == 'button gray blue') {
                                        OV.tools.createRequest({
                                            url: details.url,
                                            type: "POST" /* POST */,
                                            protocol: "http://",
                                            formData: {
                                                op: "download1",
                                                id: details.match[2]
                                            }
                                        }).then(function (xhr) {
                                            suspectSubtitledVideo(details, xhr);
                                            let HTML = xhr.response;
                                            let videoHashStr = HTML.match(/jwplayer\("mediaplayer"\)\.setup\(([^\)]*)/)[1];
                                            let src = videoHashStr.match(/file: "([^"]*)"/)[1];
                                            let poster = videoHashStr.match(/image: "([^"]*)"/)[1];
                                            let title = HTML.match(/<title>([^<]*)<\/title>/)[1];
                                            return {
                                                src: [{
                                                        type: "video/mp4",
                                                        src: src,
                                                        label: "SD"
                                                    }],
                                                title: title,
                                                poster: poster,
                                                tracks: []
                                            };
                                        }).then(resolve).catch(reject);
                                    }
                                });
                            }
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "VevIO",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?vev\.[^\/,^\.]{2,}\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        return Promise.resolve(null).then(function () {
                            if (details.url.indexOf("embed") == -1) {
                                return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                                    suspectSubtitledVideo(details, xhr);
                                    if (xhr.response.indexOf('class="video-main"') != -1) {
                                        return details.url.substr(details.url.lastIndexOf("/"));
                                    }
                                    else {
                                        throw Error("Not a Video!");
                                    }
                                });
                            }
                            else {
                                return details.url.substr(details.url.lastIndexOf("/") + 1);
                            }
                        }).then(function (videoCode) {
                            return Promise.all([
                                OV.tools.createRequest({ url: "https://vev.io/api/serve/video/" + videoCode, type: "POST" /* POST */ }),
                                OV.tools.createRequest({ url: "https://vev.io/api/serve/video/" + videoCode })
                            ]);
                        }).then(function (xhrs) {
                            let videoJSON = JSON.parse(xhrs[0].response);
                            let videoDesc = JSON.parse(xhrs[1].response);
                            let srces = [];
                            for (let key in videoJSON.qualities) {
                                srces.push({ label: key, src: videoJSON.qualities[key], type: "video/mp4" });
                            }
                            srces = srces.reverse();
                            srces[0].default = true;
                            return {
                                src: srces,
                                poster: videoJSON.poster,
                                tracks: videoJSON.subtitles,
                                title: videoDesc.video.title
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "Vidzi",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?vidzi\.[^\/,^\.]{2,}\/.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        if (details.url.indexOf("embed-") != -1) {
                            if (details.url.indexOf("-") == details.url.lastIndexOf("-")) {
                                details.url = details.url.replace("embed-", "");
                            }
                            else {
                                details.url = "https://www.vidzi.tv/" + details.url.match(/embed\-([^\-]*)\-/)[1];
                            }
                            console.log(details.url);
                        }
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.responseText;
                            if (xhr.status != 200 || HTML.indexOf("file was deleted") != -1 || HTML.indexOf("yt-uix-form-textarea share-embed-code") == -1) {
                                throw Error("No Video!");
                            }
                            let videoHash = HTML.match(/jwplayer\("vplayer"\)\.setup\(\{(.*)\}\);/)[1];
                            let image = videoHash.match(/image: "([^"]*)"/)[1];
                            let src = videoHash.match(/sources: \[\{file: "([^"]*)"/)[1];
                            let title = videoHash.match(/<title>([<"]*)<\/title>/i)[1];
                            return {
                                src: [{ src: src, type: "application/x-mpegURL", label: "SD" }],
                                title: title,
                                poster: image,
                                tracks: []
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "SpeedVid",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?speedvid\.[^\/,^\.]{2,}\/[^\/]+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        if (details.url.indexOf("sn-") != -1) {
                            details.url = "https://www.speedvid.net/" + details.url.match(/sn\-([^\-]*)\-/i)[1];
                        }
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.responseText;
                            if (xhr.status != 200 || HTML.indexOf("<Title>Watch </Title>") == -1) {
                                throw Error("No Video!");
                            }
                            let image = HTML.match(/image:'([^']*)'/)[1];
                            let src = HTML.match(/file: '([^']*)'/)[1];
                            let title = HTML.match(/div class="dltitre">([^<]*)<\/div>/)[1];
                            return {
                                src: [{ src: src, type: "video/mp4", label: "SD" }],
                                title: title,
                                poster: image,
                                tracks: []
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "VidLox",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?vidlox\.[^\/,^\.]{2,}\/embed\-.+/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        return OV.tools.createRequest({ url: details.url }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.response;
                            let src = JSON.parse(HTML.match(/sources: (\[.*\]),/)[1])[0];
                            //let title = HTML.match(/<title>([<"]*)<\/title>/i)[1];
                            let poster = HTML.match(/poster: "([^"]*)"/)[1];
                            return {
                                src: [{ type: "application/x-mpegURL", src: src, label: "SD" }],
                                poster: poster,
                                title: "VidLox Video",
                                tracks: []
                            };
                        });
                    }
                }]
        }]
});
ScriptBase.addRedirectHost({
    name: "FlashX",
    scripts: [{
            urlPattern: /https?:\/\/(www\.)?flashx\.[^\/,^\.]{2,}\/(embed.php\?c=(.*)|(.*)\.jsp|playvideo\-(.*)\.html\?playvid)/i,
            runScopes: [{
                    run_at: "document_start" /* document_start */,
                    script: function (details) {
                        return Promise.resolve().then(function () {
                            if (details.match[5]) {
                                return details.match[5];
                            }
                            else {
                                return Promise.all([
                                    OV.tools.createRequest({ url: "https://flashx.co/counter.cgi" }),
                                    OV.tools.createRequest({ url: "https://flashx.co/flashx.php?f=fail&fxfx=6" })
                                ]).then(function () {
                                    return details.match[3] || details.match[4];
                                });
                            }
                        }).then(function (videoCode) {
                            return OV.tools.createRequest({ url: "https://flashx.co/playvideo-" + videoCode + ".html?playvid" });
                        }).then(function (xhr) {
                            suspectSubtitledVideo(details, xhr);
                            let HTML = xhr.responseText;
                            if (xhr.status != 200 || HTML.indexOf("Sorry, file was deleted or the link is expired!") != -1) {
                                throw Error("No Video!");
                            }
                            let srcHashStr = HTML.match(/updateSrc\(([^\)]*)\)/)[1];
                            srcHashStr = srcHashStr.substr(0, srcHashStr.lastIndexOf(",")) + "]";
                            srcHashStr = srcHashStr.replace(/src:/g, '"src":');
                            srcHashStr = srcHashStr.replace(/label:/g, '"label":');
                            srcHashStr = srcHashStr.replace(/res:/g, '"res":');
                            srcHashStr = srcHashStr.replace(/type:/g, '"type":');
                            srcHashStr = srcHashStr.replace(/'/g, '"');
                            console.log(srcHashStr);
                            let src = JSON.parse(srcHashStr);
                            let poster = HTML.match(/poster="([^"]*)"/)[1];
                            return {
                                src: [{ src: src[0].src, type: src[0].type, label: "SD" }],
                                poster: poster,
                                tracks: [],
                                title: "FlashX Video"
                            };
                        });
                    }
                }]
        }]
});
//# sourceMappingURL=RedirectScripts.js.map