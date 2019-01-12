
import {StringMap} from "./types";
import * as Tools from "./tools";
import * as Messages from "./messages";
import * as Environment from "./environment";
import * as Storage from "./storage";

   
export function getCID() : Promise<string> {
    return Storage.sync.get("AnalyticsCID").then(function(cid){
        if(!cid) {
            cid = Tools.generateHash();
            Storage.sync.set("AnalyticsCID", cid);
        }
        return cid;
    });
}
export function postData(data: StringMap) : Promise<XMLHttpRequest> {
    return Storage.sync.get("AnalyticsEnabled").then(function(value){
        if(value || value == undefined) {
            return getCID().then(function(cid){
                data = Object.assign({v: 1, tid: "UA-118573631-1", cid: cid}, data);
                return Tools.createRequest({
                    url: "https://www.google-analytics.com/collect",
                    type: Tools.HTTPMethods.POST,
                    data: data
                });
            });
        }
        return Promise.reject(Error("Analytics is disabled!"));
    });
}
export function send(data: StringMap) : Promise<{success: boolean}> {
    if(Environment.isBackgroundPage()) {
        return postData(data).then(function(){ return {success: true } });
    }
    else {
        return Messages.send({ bgdata: { func: "analytics", data: data as StringMap} }).then(function(){ return {success: true } });
    }
}
export function fireEvent(category: string, action: string, label: string) {
    send({t: "event", ec: category, ea: action, el: label});
}