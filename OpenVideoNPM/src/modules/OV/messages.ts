import * as Tools from "./tools";

export enum State {
    EvToMdw = "EvToMdw",
    MdwToBG = "MdwToBG",
    BGToMdw = "BGToMdw",
    MdwToEv = "MdwToEv",
    EvToMdwRsp = "EvToMdwRsp",
    MdwToBGRsp = "MdwToBGRsp",
    BGToMdwRsp = "BGToMdwRsp",
    MdwToEvRsp = "MdwToEvRsp"
}
export interface BackgroundData {
    data: any;
    func: string;
}
export interface Message {
    data: any;
    state: State;
    sender: chrome.runtime.MessageSender;
    error?: Error;
}
export interface Request extends Message {
    func: string;
    bgdata: BackgroundData | null;
}
export interface Response extends Message {
    call: Request;
}
export type SendResponse = (value: any) => void;
export type SendError = (e : Error) => void;

interface EventMessage<T extends Message> {
    hash: string;
    data: T;
}

export interface ListenerSetup {
    [key: string]: (request: Request, sendResponse: SendResponse, sendError: SendError) => void | { blocked: boolean }
}
let lnfunctions: ListenerSetup = null;
let blockedFuncs: Array<string> = [];
export function addListener(functions: ListenerSetup): void {
    if (lnfunctions) {
        lnfunctions = Tools.merge(lnfunctions, functions);
    }
    else {
        lnfunctions = functions;
        document.addEventListener('ovmessage', function(ev: Event) {
            let event = ev as CustomEvent<EventMessage<Request>>;
            var details = event.detail;
            if (details && lnfunctions[details.data.func] && details.data.state === State.MdwToEv && blockedFuncs.indexOf(details.data.func) == -1) {
                let sendMsg = function(data : any, error?: Error) {
                    let dtl = {
                        hash: details.hash,
                        data: {
                            data: data,
                            state: State.EvToMdwRsp,
                            call: details.data,
                            sender: { url: location.href }
                        }
                    } as EventMessage<Response>;
                    if(error) {
                        dtl.data.error = error;
                        console.error(error);
                    };
                    var event = new CustomEvent('ovmessage', {
                        detail: dtl
                    });
                    sendMsg = function(data : any, error?: Error){};
                    document.dispatchEvent(event);
                }
                try {
                    var result = lnfunctions[details.data.func](details.data, function(data) {
                        sendMsg(data);
                    }, function(error){
                        sendMsg(null, error);
                    });
                }
                catch (e) {
                    if(e instanceof Error) {
                        sendMsg(null, e as Error);
                    }
                    else {
                        sendMsg(null, new Error(e));
                    }
                }
                if (result && result.blocked) {
                    blockedFuncs.push(details.data.func);
                }
            }
        });
    }
}
export function send(obj: { data?: any; func?: string; bgdata?: BackgroundData | null }): Promise<Response> {

    return eventPingPong({
        func: obj.func || "NO_FUNCTION",
        data: obj.data || {},
        sender: { url: location.href },
        bgdata: obj.bgdata,
        state: State.EvToMdw
    }, true).then(function(response){
        if(response.error) {
            console.error(response.error);
            throw response.error;
        }
        else {
            return response;
        }
    });
}
function eventPingPong(data: Request, beforeBG: boolean): Promise<Response> {
    return new Promise(function(resolve, reject) {
        data.state = beforeBG ? State.EvToMdw : State.MdwToEv;

        let hash = Tools.generateHash();
        let one = function(ev: Event): void {
            
            let event = ev as CustomEvent<EventMessage<Response>>;
            var details = event.detail;
            
            if (details && details.hash === hash && details.data.state === (beforeBG ? State.MdwToEvRsp : State.EvToMdwRsp)) {
                document.removeEventListener('ovmessage', one);
                resolve(details.data);
            }
        };
        document.addEventListener('ovmessage', one);

        let event = new CustomEvent('ovmessage', {
            detail: {
                hash: hash,
                data: data
            } as EventMessage<Request>
        });
        document.dispatchEvent(event);
    });

}
let isMiddleware_ = false;
export function isMiddleware() {
    return isMiddleware;
}
export function setupMiddleware() {
    if (isMiddleware_) {
        throw Error("Middleware already set up!")
    }
    else {
        isMiddleware_ = true;
        document.addEventListener('ovmessage', function(ev: Event) {
            
            let event = ev as CustomEvent<EventMessage<Request>>;
            var details = event.detail;
            
            if (details && details.data.state === State.EvToMdw) {
                details.data.state = State.MdwToBG;

                if (details.data.bgdata) {

                    chrome.runtime.sendMessage(details.data, function(resData: Response) {
                        if (resData.state === State.BGToMdwRsp) {

                            var event = new CustomEvent('ovmessage', {
                                detail: {
                                    hash: details.hash,
                                    data: {
                                        data: resData.data,
                                        state: State.MdwToEvRsp,
                                        call: resData.call,
                                        sender: resData.sender
                                    }
                                } as EventMessage<Response>
                            });
                            document.dispatchEvent(event);
                        }
                        else {
                            throw Error("Wrong Response!")
                        }
                    });
                }
                else {
                    
                    eventPingPong(details.data, false).then(function(response) {

                        var event = new CustomEvent('ovmessage', {
                            detail: {
                                hash: details.hash,
                                data: {
                                    data: response.data,
                                    state: State.MdwToEvRsp,
                                    call: response.call,
                                    sender: response.sender
                                }
                            } as EventMessage<Response>
                        });
                        document.dispatchEvent(event);
                    });
                }
            }

        });
        chrome.runtime.onMessage.addListener(function(msg: Request, sender, sendResponse) {
            if (msg.state === State.BGToMdw) {

                eventPingPong({
                    func: msg.func,
                    data: msg.data,
                    sender: sender,
                    state: State.MdwToEv,
                    bgdata: msg.bgdata
                }, false).then(function(response) {

                    sendResponse({ data: response.data, state: State.MdwToBGRsp, call: response.call, sender: response.sender } as Response);
                });
                return true;
            }
            return false;
        });
    }
}
let bgfunctions: BackgroundSetup = null;
export interface BackgroundSetup {
    [key: string]: (msg: Request, bgData: any, sender: chrome.runtime.MessageSender, sendResponse: SendResponse, sendError: SendError) => void;
}
export function setupBackground(functions: BackgroundSetup) {
    if (bgfunctions) {
        bgfunctions = Tools.merge(bgfunctions, functions);
    }
    else {
        bgfunctions = functions;
        chrome.runtime.onMessage.addListener(function(msg: Request, sender, sendResponse) {
            if (msg.state === State.MdwToBG) {

                if (bgfunctions[msg.bgdata.func]) {
                    let sendMsg = function(data : any, error?: Error) {
                        let resp = { data: data, state: State.BGToMdwRsp, call: msg, sender: sender } as Response;
                        if(error) {
                            console.error(error);
                            resp.error = error;
                        }
                        sendMsg = function(data : any, error?: Error){};
                        sendResponse(resp);
                    }
                    try {
                        bgfunctions[msg.bgdata.func]({ func: msg.func, data: msg.data, state: State.BGToMdw, sender: sender, bgdata: msg.bgdata }, msg.bgdata.data, sender, function(response: any) {
                            sendMsg(response);
                        }, function(error : Error){
                            sendMsg(null, error);
                        });
                    }
                    catch(e) {
                        if(e instanceof Error) {
                            sendMsg(null, e as Error);
                        }
                        else {
                            sendMsg(null, new Error(e));
                        }
                    }
                    
                    return true;
                }

            }
            return false;
        });
    }
}