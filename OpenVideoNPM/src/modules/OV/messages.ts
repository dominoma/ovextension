import * as Tools from "./tools";

export interface BackgroundData {
    data: any;
    func: string;
}
export interface ErrorData {
    message: string;
    stack: string;
    name: string;
}
export interface Message {
    data: any;
    error?: ErrorData | null;
    sender?: chrome.runtime.MessageSender | null;
}
export interface Request extends Message {
    func: string;
    bgdata?: BackgroundData | null;
}
export interface Response extends Message {
    call: Request;
}

interface EventMessage<T extends Message> {
    hash: string;
    data: T;
    status: Status;
    toBG: boolean;
}
enum Status {
    Request = "Request",
    Response = "Response"
}

export interface ListenerSetup {
    [key: string]: (request: Request) => Promise<any>
}
type WindowVars = { bgfunctions: BackgroundSetup|null, lnfunctions: ListenerSetup|null, isMiddleware_: boolean };
let windowVars = Tools.accessWindow<WindowVars>({
    bgfunctions: null,
    lnfunctions: null,
    isMiddleware_: false
})
export function canRuntime() {
    return chrome && chrome.runtime && chrome.runtime.id != undefined;
}

function getErrorData(e : Error | null) : ErrorData | null {
    if(e) {
        return { message: e.message, stack: e.stack!, name: e.name };
    }
    else {
        return null;
    }
}
function setErrorData(data : ErrorData | null) {
    if(data) {
        let e = new Error(data.message);
        e.stack = data.stack;
        e.name = data.name;
        return e;
    }
    else {
        return null;
    }
}
function toErrorData(e : any) {
    return getErrorData(Tools.convertToError(e));
}
async function sendMsgByEvent(data: Request, toBG?: boolean) {
    return new Promise<Response>(function(resolve, reject){
        if(!toBG) {
            data.bgdata = null;
        }
        let hash = Tools.generateHash();
        document.addEventListener('ovmessage', async function one(ev: Event) {
            let data = (ev as CustomEvent<EventMessage<Response>>).detail;
            if(data.status == Status.Response && data.hash == hash) {
                document.removeEventListener("ovmessage", one);
                if(data.data.error) {
                    reject(setErrorData(data.data.error));
                }
                else {
                    resolve(data.data);
                }
            }
        });
        let event = new CustomEvent('ovmessage', {
            detail: {
                status: Status.Request,
                hash: hash,
                data: data,
                error: null,
                toBG: toBG || data.bgdata != null
            } as EventMessage<Request>
        });
        document.dispatchEvent(event);
    });
}
function listenToEventMsgs(callback: (data: Request) => Promise<Response>, asMiddleware: boolean) {
    document.addEventListener('ovmessage', async function (ev: Event) {
        let data = (ev as CustomEvent<EventMessage<Request>>).detail;
        if(data.status == Status.Request && asMiddleware == data.toBG) {
            function sendMsg(response: Response) {
                let event = new CustomEvent('ovmessage', {
                    detail: {
                        status: Status.Response,
                        hash: data.hash,
                        data: response,
                        toBG: data.toBG
                    } as EventMessage<Response>
                });
                document.dispatchEvent(event);
            }
            try {
                let response = await callback(data.data);
                response.call = data.data;
                sendMsg(response);
            }
            catch(e) {
                sendMsg({ call: data.data, data: null, error: toErrorData(e) });
            }
        }
    });
}
async function sendMsgByRuntime(data: Request) {
    return new Promise<Response>(function(resolve, reject){
        chrome.runtime.sendMessage(data, function(response : Response){
            if(response.error) {
                reject(setErrorData(response.error));
            }
            else {
                resolve(response);
            }
        });
    });
}
async function listenToRuntimeMsgs(callback: (data: Request) => Promise<Response>) {
    //Nicht async, da return true
    chrome.runtime.onMessage.addListener(function(msg : Request, sender, sendResponse){
        if(msg) {
            msg.sender = sender;
            callback(msg).then(function(response){
                response.sender = sender;
                response.call = msg;
                sendResponse(response);
            }).catch(function(e) {
                sendResponse({ data: null, sender: sender, call: msg, error: toErrorData(e) } as Response);
            });
            return true;
        }
    });
}
export function addListener(functions: ListenerSetup): void {
    if (windowVars.lnfunctions) {
        windowVars.lnfunctions = Tools.merge(windowVars.lnfunctions, functions);
    }
    else {
        windowVars.lnfunctions = functions;
        listenToEventMsgs(async function(request){
            if(!windowVars.lnfunctions![request.func]) {
                throw new Error("Listener-Function '"+request.func+"' doesn't exist!\nFunctions: "+Object.keys(windowVars.lnfunctions!).join(", "));
            }
            let data = await windowVars.lnfunctions![request.func](request);
            return { data: data, call: request };
        }, false);
    }
}
export async function send(request: Request, toBG?: boolean) {
    return sendMsgByEvent(request, toBG || request.bgdata != null);
}
export async function sendToBG(request: BackgroundData) {
    return send({ func: "NO_FUNC", data: null, bgdata: request});
}
export function isMiddleware() {
    return windowVars.isMiddleware_;
}
export function setupMiddleware() {
    if (windowVars.isMiddleware_) {
        console.log("Middleware already set up!")
    }
    else if(!canRuntime()) {
        throw Error("Middleware needs access to chrome.runtime!")
    }
    else {
        windowVars.isMiddleware_ = true;
        listenToEventMsgs(async function(request){
            return sendMsgByRuntime(request);
        }, true);
        listenToRuntimeMsgs(async function(request){
            return sendMsgByEvent(request, false);
        });
    }
}
export interface BackgroundSetup {
    [key: string]: (msg: Request, bgData: any, sender: chrome.runtime.MessageSender) => Promise<any>;
}
export function setupBackground(functions: BackgroundSetup) {
    if(!canRuntime()) {
        throw Error("Background needs access to chrome.runtime!")
    }
    if (windowVars.bgfunctions) {
        windowVars.bgfunctions = Tools.merge(windowVars.bgfunctions, functions);
    }
    else {
        windowVars.bgfunctions = functions;
        listenToRuntimeMsgs(async function(request){
            if(!windowVars.bgfunctions![request.bgdata!.func]) {
                throw new Error("Background-Function '"+request.bgdata!.func+"' doesn't exist!\nFunctions: "+Object.keys(windowVars.bgfunctions!).join(", "));
            }
            let data = await windowVars.bgfunctions![request.bgdata!.func](request, request.bgdata!.data, request.sender!);
            return { data: data, call: request };
        });
    }
}
export async function sendToTab(tabid: number, data: Request, frameId?: number) {
    return new Promise<Response>(function(resolve, reject){
        data.bgdata = null;
        let options = {} as { frameId?: number };
        if(!frameId) {
            options.frameId = 0;
        }
        else if(frameId >= 0) {
            options.frameId = frameId;
        }
        delete data.bgdata;
        chrome.tabs.sendMessage(tabid, data, options, function(response : Response){
            if(response.error) {
                reject(setErrorData(response.error));
            }
            else {
                resolve(response);
            }
        });
    });
}
