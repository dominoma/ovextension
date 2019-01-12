import * as Tools from "./tools";
import * as Messages from "./messages";
import { StringMap } from "./types";

export function isReady() {
    return new Promise( function( resolve, reject ) {
        if ( document.readyState.match( /(loaded|complete)/ ) ) {
            return Promise.resolve();
        }
        else {
            return Tools.eventOne( document, "DOMContentLoaded" ).then( function( e: Event ) {
                resolve();
            } );
        }
    } );
}
export function onNodeInserted(target : Node, callback : (node : Node) => void) {
    
    var observer = new MutationObserver( function( mutations ) {
        for(let mutation of mutations) {
            for(let node of mutation.addedNodes) {
                callback(node);
            }
        }
    } );
    observer.observe( target, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    } );
    return observer;
}
type IDNodes = { [key: string]: HTMLElement };
export function getNodesWithID() {
    let nodes = {} as IDNodes;
    for ( let elem of document.querySelectorAll( '[id]' ) ) {
        nodes[elem.id] = elem as HTMLElement;
    }
    return nodes;
}
export function getAttributes( elem: HTMLElement ): StringMap {
    let hash: StringMap = {};
    for ( let i = 0; i < elem.attributes.length; i++ ) {
        hash[elem.attributes[i].name] = elem.attributes[i].value;
    }
    return hash;
}
export function addAttributeListener( elem: HTMLElement, attribute: string, callback: ( attribute: string, value: string, lastValue: string, elem: HTMLElement ) => void ) {
    var lastValue: string = elem.getAttribute( attribute );
    setInterval( function() {
        var value = elem.getAttribute( attribute );

        if ( value != lastValue ) {
            callback.call( elem, attribute, value, lastValue, elem );
            lastValue = value;
        }
    }, 10 );
}
export function injectScript( file: string ) : Promise<HTMLScriptElement> {
    return isReady().then(function () {
        
        return new Promise<HTMLScriptElement>( function( resolve, reject ) {
            var script = document.createElement( 'script' );
            script.src = chrome.extension.getURL( "/inject_scripts/" + file + ".js" );
            script.async = true;
            script.onload = function() {
                script.onload = null;
                resolve( script );
            };
            (document.body || document.head).appendChild( script );
        }); 
    });
}
export function injectScripts( files: string[] ) {
    return Promise.all( files.map( injectScript ) );
}

export function injectRawJS( source: ( ( data: StringMap ) => void ) | string, data?: StringMap ) {
    return new Promise( function( resolve, reject ) {
        var injectStr = source.toString();
        injectStr = "(" + source + ")(" + JSON.stringify( data || {} ) + ");";
        var script = document.createElement( 'script' );
        script.appendChild( document.createTextNode( injectStr ) );
        script.async = true;
        script.onload = function() {
            script.onload = null;
            resolve( script );
        };
        document.body.appendChild( script );
    } );
}

export function execute( files: string[], source: ( data: StringMap, sendResponse: ( data: StringMap ) => void ) => void, data?: StringMap ): Promise<StringMap> {
    return new Promise<StringMap>( function( resolve, reject ) {
        if ( files.indexOf( "openvideo" ) == -1 ) {
            files.unshift( "openvideo" );
        }

        Messages.addListener( {
            ovInjectResponse: function( request, sendResponse ) {
                if ( request.data.response ) {
                    resolve( request.data.response );
                }
                return { blocked: true };
            }
        } );
        var sendResponse = function( resData: any ): void {
            Messages.send( { func: "ovInjectResponse", data: { response: resData } } );
        }
        injectScripts( files ).then( function( scripts ) {
            return injectRawJS( "function(data){ (" + source + ")(data, (" + sendResponse + ")); }", data );
        } );
    } );
}

export function lookupCSS( args: { key?: string; value?: RegExp | string; }, callback: ( obj: { cssRule: any, key: string, value: RegExp | string, match: any } ) => void ): void {
    for ( let styleSheet of document.styleSheets as any ) {
        try {
            for ( let cssRule of styleSheet.cssRules ) {

                if ( cssRule.style ) {
                    if ( args.key ) {
                        if ( cssRule.style[args.key].match( args.value ) ) {
                            callback( { cssRule: cssRule, key: args.key, value: args.value, match: cssRule.style[args.key].match( args.value ) } );
                        }
                    }
                    else if ( args.value ) {
                        for ( var style of cssRule.style ) {
                            if ( cssRule.style[style] && cssRule.style[style].match( args.value ) ) {
                                callback( { cssRule: cssRule, key: style, value: args.value, match: cssRule.style[style].match( args.value ) } );
                            }
                        }
                    }
                    else {
                        callback( { cssRule: cssRule, key: null, value: null, match: null } );
                    }
                }
            }

        }
        catch ( e ) { };
    }
}

export function getUrlObj(): any {
    return Tools.hashToObj( document.location.href );
}
export function getObjUrl( obj: Object ): string {
    return location.href.replace( /[\?|&]hash=[^\?|^&]*/, "" ) + Tools.objToHash( obj );
}
export function isFrame(): boolean {
    try {
        return self !== top;
    } catch ( e ) {
        return true;
    }
}
export interface Wrapper<T> {
    [key: string]: WrapperEntry<T>;
}
export interface WrapperEntry<T> {
    get: ( target: T ) => any;
    set?: ( target: T, value: any ) => void;
}
export function wrapType<T extends Object>( origConstr: new ( ...args: any[] ) => T, wrapper: Wrapper<T> ): void {
    ( <any>window )[origConstr.name] = function( a: any, b: any, c: any, d: any, e: any, f: any ) {
        var obj = new origConstr( a, b, c, d, e, f );
        var proxyWrapper = new Proxy( obj, {
            get: function( target: any, name: string ) {
                if ( wrapper[name] ) {
                    return wrapper[name].get( target );
                }
                else if ( typeof ( <any>target )[name] === "function" ) {
                    return ( <any>target )[name].bind( target );
                }
                else {
                    return ( <any>target )[name];
                }
            }, set: function( target: any, name: string, value: any ) {
                if ( wrapper[name] ) {
                    if ( wrapper[name].set ) {
                        wrapper[name].set( target, value );
                    }
                }
                else {
                    ( <any>target )[name] = value;
                }
                return true;
            }
        } );
        return proxyWrapper;
    };
}