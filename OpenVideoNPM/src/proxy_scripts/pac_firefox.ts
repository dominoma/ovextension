import * as Proxy from "OV/proxy";

var hosts: string[] = [];
var proxy: Proxy.Proxy|null = null;
function FindProxyForURL(url: string, host: string) {
    if (proxy && proxy.ip) {
        for (var host of hosts) {
            if (url.indexOf(host) != -1) {
                return "PROXY " + proxy.ip + ":" + proxy.port;
            }
        }
    }
    return "DIRECT";
}
browser.runtime.onMessage.addListener(function(message) {
    if (message.hosts) {
        hosts = message.hosts;
    }
    if (message.proxy) {
        proxy = message.proxy;
    }
});
