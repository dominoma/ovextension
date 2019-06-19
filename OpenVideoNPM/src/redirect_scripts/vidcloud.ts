import { RedirectHost, RedirectScript } from "redirect_scripts_base";

import * as Tools from "OV/tools";
import * as VideoTypes from "video_types";

class VidCloudScript extends RedirectScript {
    constructor(hostname : string, url : string, parentUrl : string | null) {
        super(hostname, url, parentUrl,  /https?:\/\/(www\.)?(vidcloud|vcstream|loadvid|megaxfer)\.[^\/,^\.]{2,}\/embed\/([a-zA-Z0-9]*)/i)
    }
    async getVideoData() {
        let embedID = this.details.match[3];
        let xhrs = await Promise.all([
            Tools.createRequest({
                url: "https://vidcloud.co/player",
                data: { fid: embedID },
                referer: this.details.url
            }),
            Tools.createRequest({
                url: "https://vidcloud.co/download",
                type: Tools.HTTPMethods.POST,
                formData: { file_id: embedID },
                referer: this.details.url
            })
        ]);
        let html = xhrs[0].response;
        let dlhtml = xhrs[1].response;
        console.log(dlhtml);
        let rawRes = dlhtml.match(/href=\\"([^"]*)\\" download=\\"([^"]*)\\"[^>]*>([^<]*)</g);
        let dlsrces: VideoTypes.DownloadSource[] = [];
        for (let res of rawRes) {
            let matches = res.match(/href=\\"([^"]*)\\" download=\\"([^"]*)\\"[^>]*>([^<]*)</);
            dlsrces.push({ src: matches[1], filename: "[" + matches[3] + "]" + matches[2], type: "video/mp4" });
        }
        console.log(html);
        let rawSrces = JSON.parse("["+JSON.parse("\"" + html.match(/.*sources = \[([^\]]*)/)[1] + "\"")+"]");
        let rawTracks = JSON.parse("["+JSON.parse("\"" + html.match(/.*tracks = \[([^\]]*)/)[1] + "\"")+"]");
        let title = JSON.parse('"'+Tools.matchNull(html, /title: '([^']*)'/)+'"');
        let poster = JSON.parse('"'+Tools.matchNull(html, /image: '([^']*)'/)+'"');
        let srces: VideoTypes.VideoSource[] = [];
        for (let i = 0; i < rawSrces.length; i++) {
            srces.push({ src: rawSrces[i].file, type: "application/x-mpegURL", dlsrc: dlsrces[0], label: "SD" })
        }
        let tracks: VideoTypes.SubtitleSource[] = [];
        for (let track of rawTracks) {
            tracks.push({ src: track.file, label: track.label, default: track.default || false, kind: track.kind })
        }

        return {

            src: srces,
            tracks: tracks,
            title: title,
            poster: poster
        };
    }
}
export default class VidCloud extends RedirectHost {
    getScripts() {
        return [VidCloudScript];
    }
}
