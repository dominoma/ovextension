
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
            if (bgdata["el"] && bgdata["el"].indexOf("<PAGE_URL>") != -1) {
                if(!sender.tab || !sender.tab.url) {
                    throw new Error("Can't replace Page URL. Tab url is unknown!");
                }
                bgdata["el"] = bgdata["el"].replace("<PAGE_URL>", sender.tab.url);
            }
            console.log(bgdata)
            send(bgdata);
        }
    });
}
export async function fireEvent(category: string, action: string, label: string) {
    await send({ t: "event", ec: category, ea: action, el: label });
}
