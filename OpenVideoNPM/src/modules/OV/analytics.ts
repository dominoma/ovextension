
import { StringMap } from "./types";
import * as Tools from "./tools";
import * as Messages from "./messages";
import * as Environment from "./environment";
import * as Storage from "./storage";

async function postData(data: StringMap) {
    let isEnabled = await Storage.isAnalyticsEnabled();

    if (isEnabled) {
        let cid = await Storage.getAnalyticsCID();
        data = Tools.merge({ v: 1, tid: "UA-118573631-1", cid: cid }, data);
        return Tools.createRequest({
            url: "https://www.google-analytics.com/collect",
            type: Tools.HTTPMethods.POST,
            data: data
        });
    }
    throw Error("Analytics is disabled!");

}
async function send(data: StringMap) {
    if (Environment.isBackgroundScript()) {
        await postData(data);
        return { success: true }
    }
    else {
        await Messages.sendToBG({ func: "analytics_send", data: data as StringMap });
        return { success: true };
    }
}
export async function setupBG() {
    Messages.setupBackground({
        analytics_send: async function(msg, bgdata : StringMap, sender) {
            send(bgdata);
        }
    });
}
async function fireEvent(category: string, action: string, label: string) {
    await send({ t: "event", ec: category, ea: action, el: label });
}
export async function hosterUsed(hoster : string) {
    return fireEvent(hoster, "HosterUsed", "");
}
export async function hosterError(hoster : string, error : any) {
    return fireEvent(hoster, "Error", JSON.stringify(Environment.getErrorMsg(error)))
}
export async function tracksFound(hoster : string, url : string) {
    return fireEvent(hoster, "TracksFound", url);
}
export async function playerEvent(event : string) {
    return fireEvent(event, "PlayerEvent", "");
}
export async function videoFromHost(url : string, isFrame : string) {
    return fireEvent("VideoFromHost", Tools.parseURL(url).host, isFrame);
}
export async function fullscreenError(url : string, parentUrl : string) {
    return fireEvent("FullscreenError", "FullscreenError", `IFrame: '${url}'\nPage: '${parentUrl}'\nVersion: ${Environment.getManifest().version}`)
}
