(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Model = factory());
}(this, (function () { 'use strict';

/**
 * async function
 *
 * @syntax: 
 *  async function() {}
 *  async () => {}
 *  async x() => {}
 *
 * @compatibility
 * IE: no
 * Edge: >= 15
 * Android: >= 5.0
 *
 */

var isAsyncFunction = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction( fn );

var isString = str => typeof str === 'string' || str instanceof String;

var isAsyncFunction$1 = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$1 = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction$1( fn );

var isRegExp = reg => ({}).toString.call( reg ) === '[object RegExp]';

class EventEmitter {
    constructor() {
        this.__listeners = new Map();
    }

    alias( name, to ) {
        this[ name ] = this[ to ].bind( this );
    }

    on( evt, handler ) {
        const listeners = this.__listeners;
        let handlers = listeners.get( evt );

        if( !handlers ) {
            handlers = new Set();
            listeners.set( evt, handlers );
        }
        handlers.add( handler );
        return this;
    }

    once( evt, handler ) {
        const _handler = ( ...args ) => {
            handler.apply( this, args );
            this.removeListener( evt, _handler );
        };
        return this.on( evt, _handler );
    }

    removeListener( evt, handler ) {
        const listeners = this.__listeners;
        const handlers = listeners.get( evt );
        handlers && handlers.delete( handler );
        return this;
    }

    emit( evt, ...args ) {
        const handlers = this.__listeners.get( evt );
        if( !handlers ) return false;
        handlers.forEach( handler => handler.call( this, ...args ) );
    }

    removeAllListeners( rule ) {
        let checker;
        if( isString( rule ) ) {
            checker = name => rule === name;
        } else if( isFunction$1( rule ) ) {
            checker = rule;
        } else if( isRegExp( rule ) ) {
            checker = name => {
                rule.lastIndex = 0;
                return rule.test( name );
            };
        }

        const listeners = this.__listeners;

        listeners.forEach( ( value, key ) => {
            checker( key ) && listeners.delete( key );
        } );
        return this;
    }
}

/**
 * async function
 *
 * @syntax: 
 *  async function() {}
 *  async () => {}
 *  async x() => {}
 *
 * @compatibility
 * IE: no
 * Edge: >= 15
 * Android: >= 5.0
 *
 */

var isAsyncFunction$2 = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$2 = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction$2( fn );

var isPromise = p => p && isFunction$2( p.then );

const Promise$1 = class {
    constructor( fn ) {
        if( !( this instanceof Promise$1 ) ) {
            throw new TypeError( this + ' is not a promise ' );
        }

        if( !isFunction$2( fn ) ) {
            throw new TypeError( 'Promise resolver ' + fn + ' is not a function' );
        }

        this[ '[[PromiseStatus]]' ] = 'pending';
        this[ '[[PromiseValue]]' ]= null;
        this[ '[[PromiseThenables]]' ] = [];
        try {
            fn( promiseResolve.bind( null, this ), promiseReject.bind( null, this ) );
        } catch( e ) {
            if( this[ '[[PromiseStatus]]' ] === 'pending' ) {
                promiseReject.bind( null, this )( e );
            }
        }
    }

    then( resolved, rejected ) {
        const promise = new Promise$1( () => {} );
        this[ '[[PromiseThenables]]' ].push( {
            resolve : isFunction$2( resolved ) ? resolved : null,
            reject : isFunction$2( rejected ) ? rejected : null,
            called : false,
            promise
        } );
        if( this[ '[[PromiseStatus]]' ] !== 'pending' ) promiseExecute( this );
        return promise;
    }

    catch( reject ) {
        return this.then( null, reject );
    }
};

Promise$1.resolve = function( value ) {
    if( !isFunction$2( this ) ) {
        throw new TypeError( 'Promise.resolve is not a constructor' );
    }
    /**
     * @todo
     * check if the value need to return the resolve( value )
     */
    return new Promise$1( resolve => {
        resolve( value );
    } );
};

Promise$1.reject = function( reason ) {
    if( !isFunction$2( this ) ) {
        throw new TypeError( 'Promise.reject is not a constructor' );
    }
    return new Promise$1( ( resolve, reject ) => {
        reject( reason );
    } );
};

Promise$1.all = function( promises ) {
    let rejected = false;
    const res = [];
    return new Promise$1( ( resolve, reject ) => {
        let remaining = 0;
        const then = ( p, i ) => {
            if( !isPromise( p ) ) {
                p = Promise$1.resolve( p );
            }
            p.then( value => {
                res[ i ] = value;
                setTimeout( () => {
                    if( --remaining === 0 ) resolve( res );
                }, 0 );
            }, reason => {
                if( !rejected ) {
                    reject( reason );
                    rejected = true;
                }
            } );
        };

        let i = 0;
        for( let promise of promises ) {
            remaining++;
            then( promise, i++ );
        }
        if( !i ) {
            resolve( res );
        }
    } );
};

Promise$1.race = function( promises ) {
    let resolved = false;
    let rejected = false;

    return new Promise$1( ( resolve, reject ) => {
        function onresolved( value ) {
            if( !resolved && !rejected ) {
                resolve( value );
                resolved = true;
            }
        }

        function onrejected( reason ) {
            if( !resolved && !rejected ) {
                reject( reason );
                rejected = true;
            }
        }

        for( let promise of promises ) {
            if( !isPromise( promise ) ) {
                promise = Promise$1.resolve( promise );
            }
            promise.then( onresolved, onrejected );
        }
    } );
};

function promiseExecute( promise ) {
    var thenable,
        p;

    if( promise[ '[[PromiseStatus]]' ] === 'pending' ) return;
    if( !promise[ '[[PromiseThenables]]' ].length ) return;

    const then = ( p, t ) => {
        p.then( value => {
            promiseResolve( t.promise, value );
        }, reason => {
            promiseReject( t.promise, reason );
        } );
    };

    while( promise[ '[[PromiseThenables]]' ].length ) {
        thenable = promise[ '[[PromiseThenables]]' ].shift();

        if( thenable.called ) continue;

        thenable.called = true;

        if( promise[ '[[PromiseStatus]]' ] === 'resolved' ) {
            if( !thenable.resolve ) {
                promiseResolve( thenable.promise, promise[ '[[PromiseValue]]' ] );
                continue;
            }
            try {
                p = thenable.resolve.call( null, promise[ '[[PromiseValue]]' ] );
            } catch( e ) {
                then( Promise$1.reject( e ), thenable );
                continue;
            }
            if( p && ( typeof p === 'function' || typeof p === 'object' ) && p.then ) {
                then( p, thenable );
                continue;
            }
        } else {
            if( !thenable.reject ) {
                promiseReject( thenable.promise, promise[ '[[PromiseValue]]' ] ); 
                continue;
            }
            try {
                p = thenable.reject.call( null, promise[ '[[PromiseValue]]' ] );
            } catch( e ) {
                then( Promise$1.reject( e ), thenable );
                continue;
            }
            if( ( typeof p === 'function' || typeof p === 'object' ) && p.then ) {
                then( p, thenable );
                continue;
            }
        }
        promiseResolve( thenable.promise, p );
    }
    return promise;
}

function promiseResolve( promise, value ) {
    if( !( promise instanceof Promise$1 ) ) {
        return new Promise$1( resolve => {
            resolve( value );
        } );
    }
    if( promise[ '[[PromiseStatus]]' ] !== 'pending' ) return;
    if( value === promise ) {
        /**
         * thie error should be thrown, defined ES6 standard
         * it would be thrown in Chrome but not in Firefox or Safari
         */
        throw new TypeError( 'Chaining cycle detected for promise #<Promise>' );
    }

    if( value !== null && ( typeof value === 'function' || typeof value === 'object' ) ) {
        var then;

        try {
            then = value.then;
        } catch( e ) {
            return promiseReject( promise, e );
        }

        if( typeof then === 'function' ) {
            then.call( value, 
                promiseResolve.bind( null, promise ),
                promiseReject.bind( null, promise )
            );
            return;
        }
    }
    promise[ '[[PromiseStatus]]' ] = 'resolved';
    promise[ '[[PromiseValue]]' ] = value;
    promiseExecute( promise );
}

function promiseReject( promise, value ) {
    if( !( promise instanceof Promise$1 ) ) {
        return new Promise$1( ( resolve, reject ) => {
            reject( value );
        } );
    }
    promise[ '[[PromiseStatus]]' ] = 'rejected';
    promise[ '[[PromiseValue]]' ] = value;
    promiseExecute( promise );
}

function isUndefined() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

function find( haystack, key ) {
    for( let item of haystack ) {
        if( item[ 0 ] === key ) return item;
    }
    return false;
}

class Map$1 {
    constructor( iterable = [] ) {
        if( !( this instanceof Map$1 ) ) {
            throw new TypeError( 'Constructor Map requires \'new\'' );
        }
        this.map = iterable || [];
    }
    get size() {
        return this.map.length;
    }

    get( key ) {
        const data = find( this.map, key );
        return data ? data[ 1 ] : undefined;
    }

    set( key, value ) {
        const data = find( this.map, key );
        if( data ) {
            data[ 1 ] = value;
        } else {
            this.map.push( [ key, value ] );
        }
        return this;
    }

    delete( key ) {
        for( let i = 0, l = this.map.length; i < l; i += 1 ) {
            const item = this.map[ i ];
            if( item[ 0 ] === key ) {
                this.map.splice( i, 1 );
                return true;
            }
            
        }
        return false;
    }

    clear() {
        this.map= [];
    }

    forEach( callback, thisArg ) {
        isUndefined( thisArg ) && ( this.Arg = this );
        for( let item of this.map ) {
            callback.call( thisArg, item[ 1 ], item[ 0 ], this );
        }
    }

    has( key ) {
        return !!find( this.map, key );
    }

    keys() {
        const keys = [];
        for( let item of this.map ) {
            keys.push( item[ 0 ] );
        }
        return keys;
    }

    entries() {
        return this.map;
    }

    values() {
        const values = [];
        for( let item of this.map ) {
            values.push( item[ 1 ] );
        }
        return values;
    }
}

function isUndefined$1() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

class Set$1 {
    constructor( iterable = [] ) {
        if( !( this instanceof Set$1 ) ) {
            throw new TypeError( 'Constructor Set requires \'new\'' );
        }
        this.set = [];

        if( iterable && iterable.length ) {
            for( let item of iterable ) this.add( item );
        }
    }

    get size() {
        return this.set.length;
    }

    add( value ) {
        const i = this.set.indexOf( value );
        if( i > -1 ) {
            this.set[ i ] = value;
        } else {
            this.set.push( value );
        }
        return this;
    }

    delete( value ) {
        const i = this.set.indexOf( value );
        if( i > -1 ) {
            this.set.splice( i, 1 );
            return true;
        }
        return false;
    }

    clear() {
        this.set = [];
    }

    forEach( callback, thisArg ) {
        isUndefined$1( thisArg ) && ( this.Arg = this );
        for( let item of this.set ) {
            callback.call( thisArg, item, item, this );
        }
    }

    has( value ) {
        return this.set.indexOf( value ) > -1;
    }

    keys() {
        return this.values();
    }

    entries() {
        const res = [];
        for( let item of this.set ) {
            res.push( [ item, item ] ); 
        }
        return res;
    }

    values() {
        return this.set;
    }
}

var isString$1 = str => typeof str === 'string' || str instanceof String;

var isRegExp$1 = reg => ({}).toString.call( reg ) === '[object RegExp]';

class EventEmitter$1 {
    constructor() {
        this.__listeners = new Map$1();
    }

    on( evt, handler ) {
        const listeners = this.__listeners;
        let handlers = listeners.get( evt );

        if( !handlers ) {
            handlers = new Set$1();
            listeners.set( evt, handlers );
        }
        handlers.add( handler );
        return this;
    }

    once( evt, handler ) {
        const _handler = ( ...args ) => {
            handler.apply( this, args );
            this.removeListener( evt, _handler );
        };
        return this.on( evt, _handler );
    }

    removeListener( evt, handler ) {
        const listeners = this.__listeners;
        const handlers = listeners.get( evt );
        handlers && handlers.delete( handler );
        return this;
    }

    emit( evt, ...args ) {
        const handlers = this.__listeners.get( evt );
        if( !handlers ) return false;
        handlers.forEach( handler => handler.call( this, ...args ) );
    }

    removeAllListeners( rule ) {
        let checker;
        if( isString$1( rule ) ) {
            checker = name => rule === name;
        } else if( isFunction$2( rule ) ) {
            checker = rule;
        } else if( isRegExp$1( rule ) ) {
            checker = name => {
                rule.lastIndex = 0;
                return rule.test( name );
            };
        }

        const listeners = this.__listeners;

        listeners.forEach( ( value, key ) => {
            checker( key ) && listeners.delete( key );
        } );
        return this;
    }
}

function isUndefined$2() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

function assign( dest, ...sources ) {
    if( isFunction$2( Object.assign ) ) {
        return Object.assign( dest, ...sources );
    }
    const obj = sources[ 0 ];
    for( let property in obj ) {
        if( obj.hasOwnProperty( property ) ) {
            dest[ property ] = obj[ property ];
        }
    }
    if( sources.length > 1 ) {
        return assign( dest, ...sources.splice( 1, sources.length - 1 ) );
    }
    return dest;
}

function config() {
    return {
        promises : [],
        results : [],
        index : 0,
        steps : [],
        busy : false,
        promise : Promise$1.resolve()
    };
}
/**
 * new Sequence( false, [] )
 * new Sequence( [] )
 */

class Sequence extends EventEmitter$1 {
    constructor( steps, options = {} ) {
        super();

        this.__resolve = null;
        this.running = false;
        this.suspended = false;
        this.suspendTimeout = null;
        this.muteEndIfEmpty = !!options.emitEndIfEmpty;
        this.interval = options.interval || 0;

        assign( this, config() );

        if( steps && steps.length ) {
            this.append( steps );
        } else if( !this.muteEndIfEmpty ) {
            if( typeof process === 'object' && isFunction$2( process.nextTick ) ) {
                process.nextTick( () => {
                    this.emit( 'end', this.results, this );
                } );
            } else if( typeof setImmediate === 'function' ) {
                setImmediate( () => {
                    this.emit( 'end', this.results, this );
                } );
            } else {
                setTimeout( () => {
                    this.emit( 'end', this.results, this );
                }, 0 );
            }
        }

        options.autorun !== false && setTimeout( () => {
            this.run();
        }, 0 );
    }

    /**
     * to append new steps to the sequence
     */
    append( steps ) {
        const dead = this.index >= this.steps.length;

        if( isFunction$2( steps ) ) {
            this.steps.push( steps );
        } else {
            for( let step of steps ) {
                this.steps.push( step );
            }
        }
        this.running && dead && this.next( true );
    }

    go( n ) {
        if( isUndefined$2( n ) ) return;
        this.index = n;
        if( this.index > this.steps.length ) {
            this.index = this.steps.length;
        }
    }

    clear() {
        assign( this, config() );
    }

    next( inner = false ) {
        if( !inner && this.running ) {
            console.warn( 'Please do not call next() while the sequence is running.' );
            return Promise$1.reject( new Sequence.Error( {
                errno : 2,
                errmsg : 'Cannot call next during the sequence is running.'
            } ) );
        }

        /**
         * If there is a step that is running,
         * return the promise instance of the running step.
         */
        if( this.busy || this.suspended ) return this.promise;

        /**
         * If already reached the end of the sequence,
         * return a rejected promise instance with a false as its reason.
         */
        if( !this.steps[ this.index ] ) {
            return Promise$1.reject( new Sequence.Error( {
                errno : 1,
                errmsg : 'no more step can be executed.'
            } ) );
        }

        this.busy = true;
        
        return this.promise = this.promise.then( () => {
            const step = this.steps[ this.index ];
            let promise;

            try {
                promise = step(
                    this.results[ this.results.length - 1 ],
                    this.index,
                    this.results
                );
                /**
                 * if the step function doesn't return a promise instance,
                 * create a resolved promise instance with the returned value as its value
                 */
                if( !isPromise( promise ) ) {
                    promise = Promise$1.resolve( promise );
                }
            } catch( e ) {
                promise = Promise$1.reject( e );
            }

            return promise.then( value => {
                const result = {
                    status : Sequence.SUCCEEDED,
                    index : this.index,
                    value,
                    time : +new Date
                };
                this.results.push( result );
                this.emit( 'success', result, this.index, this );
                return result;
            } ).catch( reason => {
                const result = {
                    status : Sequence.FAILED,
                    index : this.index,
                    reason,
                    time : +new Date
                };
                this.results.push( result );
                this.emit( 'failed', result, this.index, this );
                return result;
            } ).then( result => {
                this.index++;
                this.busy = false;
                if( !this.steps[ this.index ] ) {
                    this.emit( 'end', this.results, this );
                } else {
                    setTimeout( () => {
                        this.running && this.next( true ); 
                    }, this.interval );
                }
                return result;
            } );
        } );
    }

    run() {
        if( this.running ) return;
        this.running = true;
        this.next( true );
    }

    stop() {
        this.running = false;
    }

    suspend( duration = 1000 ) {
        this.suspended = true;
        this.suspendTimeout && clearTimeout( this.suspendTimeout );
        this.suspendTimeout = setTimeout( () => {
            this.suspended = false;
            this.running && this.next( true );
        }, duration );
    }

    static all( ...args ) {
        const { steps, interval, cb } = parseArguments( ...args );
        const sequence = new Sequence( steps, { interval } );

        isFunction$2( cb ) && cb.call( sequence, sequence );

        return new Promise$1( ( resolve, reject ) => {
            sequence.on( 'end', results => {
                resolve( results );
            } );
            sequence.on( 'failed', () => {
                sequence.stop();
                reject( sequence.results );
            } );
        } );
    }

    static chain( ...args ) {
        const { steps, interval, cb } = parseArguments( ...args );
        const sequence = new Sequence( steps, { interval } );
        isFunction$2( cb ) && cb.call( sequence, sequence );
        return new Promise$1( resolve => {
            sequence.on( 'end', results => {
                resolve( results );
            } );
        } );
    }

    static any( ...args ) {
        const { steps, interval, cb } = parseArguments( ...args );
        const sequence = new Sequence( steps, { interval } );
        isFunction$2( cb ) && cb.call( sequence, sequence );
        return new Promise$1( ( resolve, reject ) => {
            sequence.on( 'success', () => {
                resolve( sequence.results );
                sequence.stop();
            } );

            sequence.on( 'end', () => {
                reject( sequence.results );
            } );
        } );
    }
}

Sequence.SUCCEEDED = 1;
Sequence.FAILED = 0;

Sequence.Error = class {
    constructor( options ) {
        assign( this, options );
    }
};

function parseArguments( steps, interval, cb ) {
    if( isFunction$2( interval ) ) {
        cb = interval;
        interval = 0;
    }
    return { steps, interval, cb }
}

/**
 * async function
 *
 * @syntax: 
 *  async function() {}
 *  async () => {}
 *  async x() => {}
 *
 * @compatibility
 * IE: no
 * Edge: >= 15
 * Android: >= 5.0
 *
 */

var isAsyncFunction$3 = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$3 = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction$3( fn );

var isString$2 = str => typeof str === 'string' || str instanceof String;

var isAsyncFunction$4 = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$4 = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction$4( fn );

var isRegExp$2 = reg => ({}).toString.call( reg ) === '[object RegExp]';

class EventEmitter$2 {
    constructor() {
        this.__listeners = {};
    }

    alias( name, to ) {
        this[ name ] = this[ to ].bind( this );
    }

    on( evt, handler ) {
        const listeners = this.__listeners;
        listeners[ evt ] ? listeners[ evt ].push( handler ) : ( listeners[ evt ] = [ handler ] );
        return this;
    }

    once( evt, handler ) {
        const _handler = ( ...args ) => {
            handler.apply( this, args );
            this.removeListener( evt, _handler );
        };
        return this.on( evt, _handler );
    }

    removeListener( evt, handler ) {
        var listeners = this.__listeners,
            handlers = listeners[ evt ];

        if( !handlers || ! handlers.length ) {
            return this;
        }

        for( let i = 0; i < handlers.length; i += 1 ) {
            handlers[ i ] === handler && ( handlers[ i ] = null );
        }

        setTimeout( () => {
            for( let i = 0; i < handlers.length; i += 1 ) {
                handlers[ i ] || handlers.splice( i--, 1 );
            }
        }, 0 );

        return this;
    }

    emit( evt, ...args ) {
        const handlers = this.__listeners[ evt ];
        if( handlers ) {
            for( let i = 0, l = handlers.length; i < l; i += 1 ) {
                handlers[ i ] && handlers[ i ].call( this, ...args );
            }
            return true;
        }
        return false;
    }

    removeAllListeners( rule ) {
        let checker;
        if( isString$2( rule ) ) {
            checker = name => rule === name;
        } else if( isFunction$4( rule ) ) {
            checker = rule;
        } else if( isRegExp$2( rule ) ) {
            checker = name => {
                rule.lastIndex = 0;
                return rule.test( name );
            };
        }

        const listeners = this.__listeners;
        for( let attr in listeners ) {
            if( checker( attr ) ) {
                listeners[ attr ] = null;
                delete listeners[ attr ];
            }
        }
    }
}

var isPromise$1 = p => p && isFunction$4( p.then );

class Resource extends EventEmitter$2 {
    constructor( resource, options = {} ) {
        super();

        if( resource instanceof Resource ) return resource;

        this.desc = null;
        this.async = false;
        Object.assign( this, options );
        this.resource = resource;
        this.response = null;
        this.error = false;
        this.status = 'loading';

        this.__ready = new Promise$1( ( resolve, reject ) => {
            if( isFunction$4( resource.$ready ) ) {
                resource.$ready( resolve );
            } else if( isPromise$1( resource ) ) {
                resource.then( res => {
                    resolve( this.response = res );
                } ).catch( reason => {
                    reject( reason );
                } );
            } else {
                resolve( resource );
            }
        } ).then( res => {
            this.status = 'complete';
            this.emit( 'load' );
            return res;
        } ).catch( reason => {
            this.status = 'error';
            this.error = reason;
            this.emit( 'error' );
        } );
    }

    ready( f ) {
        return f ? this.__ready.then( () => f.call( this ) ) : this.__ready;
    }
}

class Error extends window.Error {

    constructor( message, init = {} ) {
        super( message );

        if( message instanceof Error ) {
            Object.assign( message, init );
            return message;
        }

        if( message instanceof window.Error ) {
            const error = new Error( message.message, init );
            error.stack = message.stack;
            error.fileName = message.fileName;
            error.lineNumber = message.lineNumber;
            error.columnNumber = message.columnNumber;
            return error;
        }

        if( window.Error.captureStackTrace ) {
            window.Error.captureStackTrace( this, Error );
        }

        this.name = 'JauntyError';
        Object.assign( this, init );
    }
}

const aliases = [ 'alias', 'on', 'once', 'removeListener', 'emit', 'removeAllListeners' ];

class Base extends EventEmitter {
    constructor() {
        super();

        for( let alias of aliases ) {
            this.alias( '$' + alias, alias );
        }

        this.$status = 'created';
        this.__ready = new Promise$1( r => ( this.__resolve = r ) );
        Promise$1.resolve( this.__preinit( ...arguments ) ).then( () => this.__construct() );
    }

    __construct() {
        this.__resources = [];

        const resources = [];

        return Sequence.all( [
            () => this.__init(),
            () => {
                const list = [];
                const properties = Object.getOwnPropertyNames( Object.getPrototypeOf( this ) );
                properties.push( ...Object.keys( this ) );

                for( const property of properties ) {
                    if( /^__init[A-Z].*/.test( property ) && isFunction$3( this[ property ] ) ) {
                        list.push( this[ property ]() );
                    }
                }
                return Promise$1.all( list );
            },
            () => Promise$1.resolve( this.__afterinit() ),
            () => isFunction$3( this.init ) ? this.init() : true,
            () => {
                const list = [];

                for( const resource of this.__resources ) {
                    resources.push( resource.ready() );
                    resource.async || list.push( resource.ready() );
                }
                return Promise$1.all( list );
            },
        ] ).catch( results => {
            const reason = results[ results.length - 1 ].reason;
            this.__setStatus( 'error', reason );
            console.warn( 'Failed while initializing.', reason );
            throw new Error( 'Failed while initializing.', { reason } );
        } ).then( () => {
            this.__setStatus( 'ready' );
            this.__resolve();
            isFunction$3( this.action ) && this.action();
        } ).then( () => {
            Promise$1.all( resources ).then( () => this.__setStatus( 'loaded' ) );
        } );
    }

    __preinit() {}

    __afterinit() {}

    __init() {}

    __setStatus( status, data ) {
        this.$status = status;
        this.$emit( status, data );
    }

    $ready( f ) {
        return f ? this.__ready.then( () => f.call( this, this ) ) : this.__ready;
    }

    $resource( resource, options = {} ) {
        if( !resource ) return this.__resources;

        resource = new Resource( resource, options );
        this.__resources.push( resource );
        return resource;
    }

    $reload() {
        return this.__construct();
    }

    $call( method, ...args ) {
        return this[ method ].call( this, ...args );
    }
}

let id = 0;

class Extension extends Base {
    constructor( init, config = {} ) {
        super( init, config );
    }

    __preinit( init, config ) {
        Object.assign( this, init || {} );

        this.__id = id++;

        this.$name = config.name || '';
        this.$type = config.type || '';
        this.$package = config.package || null;

        if( this.$package ) {
            this.$package.on( 'destruct', () => {
                isFunction( this.$destruct) && this.$destruct();
            } );
        }
    }

    $signal( signal, params ) {
        if( !this.$package ) {
            console.error();
        }

        this.$package.signal( params );
    }

    $mount( name, ...args ) {
        if( this.$package ) {
            console.error();
        }

        if( !name ) {
            name = `#anonymous-${this.$type || 'extension'}-mount-${id++}-id++`;
        }
        return this.$package.$mount( name, ...args );
    }
}

var isNumber = ( n, strict = false ) => {
    if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
        return true;
    }
    if( strict ) return false;
    return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
};

var isString$3 = str => typeof str === 'string' || str instanceof String;

var isInteger = ( n, strict = false ) => {

    if( isNumber( n, true ) ) return n % 1 === 0;

    if( strict ) return false;

    if( isString$3( n ) ) {
        if( n === '-0' ) return true;
        return n.indexOf( '.' ) < 0 && String( parseInt( n ) ) === n;
    }

    return false;
}

var isAsyncFunction$5 = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$5 = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction$5( fn );

var isPromise$2 = p => p && isFunction$5( p.then );

function isUndefined$3() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

const eventcenter = new EventEmitter();

const collector = {
    records : [],
    collecting : false,
    start() {
        this.records = [];
        this.collecting = true;
    },
    stop() {
        this.collecting = false;
        return this.records;
    },
    add( data ) {
        this.collecting && this.records.push( data );
    }
};

function isSubset( obj, container ) {
    if( !obj || typeof obj !== 'object' ) return false;
    for( const prop in container ) {
        const item = container[ prop ];
        if( item === obj ) return true;

        if( item && typeof item === 'object' ) {
            const res = isSubset( obj, item );
            if( res ) return true;
        }
    }

    return false;
}

/**
 * soe map, for storing relations between setters, observers and expressions.
 * Map( {
 *     setter : Map( {
 *          observer : Map( {
 *              exp : Set( [ ...handlers ] )
 *          } )
 *     } )
 * } )
 */
const soe = new Map();

function set( setter, observer, exp, handler ) {
    const map = soe.get( setter ); 
    if( !map ) {
        return soe.set( setter, new Map( [ 
            [ observer, new Map( [ 
                [ exp, new Set( [ handler ] ) ]
            ] ) ]
        ] ) );
    }
    const obs = map.get( observer );
    if( !obs ) {
        return map.set( observer, new Map( [ 
            [ exp, new Set( [ handler ] ) ]
        ] ) );
    }
    const exps = obs.get( exp );
    exps ? exps.add( handler ) : obs.set( exp, new Set( [ handler ] ) );
}

function getSetter( setter ) {
    return soe.get( setter );
}

function forEachAllObserver( cb ) {
    soe.forEach( obs => {
        obs.forEach( ( exps, ob ) => {
            exps.forEach( ( handlers, exp ) => cb( ob, exp, handlers ) );
        } );
    } );
}

function forEachExps( setter, cb ) {
    const map = soe.get( setter );
    if( !map ) return;
    map.forEach( ( exps, ob ) => {
        exps.forEach( ( handlers, exp ) => cb( ob, exp, handlers ) );
    } );
}

function deleteSetter( setter ) {
    soe.delete( setter );
}

function deleteObserver( observer ) {
    soe.forEach( obs => obs.delete( observer ) );
}

function deleteSetterObserver( setter, observer ) {
    try {
        return soe.get( setter ).delete( observer );
    } catch( e ) {
        return false;
    }
}

function deleteHandler( observer, expression, handler ) {
    soe.forEach( obs => {
        obs.forEach( ( exps, ob ) => {
            if( ob !== observer ) return;
            exps.forEach( ( handlers, exp ) => {
                if( exp !== expression ) return;
                handlers.delete( handler );
            } );
        } );
    } );
}

var soe$1 = { 
    set, getSetter, forEachExps, forEachAllObserver, 
    deleteSetter, deleteObserver, deleteSetterObserver, deleteHandler
};

const ec = new EventEmitter();

/**
 * caches for storing expressions.
 * Map( {
 *      expression : fn
 * } )
 */
const caches = new Map();

/**
 * for storing the old values of each expression.
 * Map( {
 *      observer : Map( {
 *          expression/function : value
 *      } )
 * } )
 */
const values = new Map();

/**
 * To do some preparations while adding a new observer.
 */
eventcenter.on( 'add-observer', observer => {
    if( !values.get( observer ) ) {
        values.set( observer, new Map() );
    }
} );

/**
 * Processes after deleting an observer.
 */
eventcenter.on( 'destroy-observer',  observer => {
    soe$1.deleteObserver( observer );
    values.set( observer, new Map() );
} );

/**
 * while setting new data into an object in an observer, or deleting properties of objects in observers,
 * all callback function should be executed again to check if the changes would effect any expressions.
 */
eventcenter.on( 'set-value', () => {
    // to execute all expressions after deleting a property from an observer.
    soe$1.forEachAllObserver( execute );
} );

/**
 * to remove useless listeners for release memory.
 */
const gc = ( obj ) => {
    if( !obj || typeof obj !== 'object' ) return;
    const keys = Object.keys;
    const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    soe$1.forEachAllObserver( observer => {
        if( isSubset( obj, observer ) ) return;
        for( let key of keys( obj ) ) {
            const descriptor = getOwnPropertyDescriptor( obj, key ); 
            const setter = descriptor && descriptor.set;
            if( !setter ) continue;
            soe$1.deleteSetterObserver( setter, observer );
            const item = obj[ key ];
            item && typeof item === 'object' && gc( item );
        }
    } );
};

eventcenter.on( 'overwrite-object', ( val, old ) => gc( old ) );

eventcenter.on( 'delete-property', ( deleted, setter ) => {
    // to execute all expressions after deleting a property from an observer.
    soe$1.forEachAllObserver( execute );
    soe$1.deleteSetter( setter );
    gc( deleted );
} );

/**
 * @function expression
 * To convert the expression to a function.
 *
 * @param {Function|String} exp
 */
function expression( exp ) {
    if( isFunction$5( exp ) ) return exp;
    let fn = caches.get( exp );
    if( fn ) return fn;
    fn = new Function( 's', `try{with(s)return ${exp}}catch(e){return null}` );
    caches.set( exp, fn );
    return fn;
}

/**
 * @function setValue
 * To store a new value for an expression of an observer and to return the old value
 *
 * @param {Observer} observer
 * @param {Function|String} exp
 * @param {*} value
 */
function setValue( observer, exp, value ) {
    values.get( observer ).set( exp, value );
}

function getValue( observer, exp ) {
    return values.get( observer ).get( exp );
}

function execute( observer, exp, handlers ) {
    const fn = expression( exp );
    collector.start();
    const val = fn( observer );
    const setters = collector.stop();
    for( let setter of setters ) {
        for( let handler of handlers ) {
            listen( setter, observer, exp, handler );
        }
    }
    if( isPromise$2( val ) ) {
        val.then( n => {
            const ov = getValue( observer, exp );
            if( ov !== n ) {
                handlers.forEach( handler => handler( n, ov, observer, exp ) );
                setValue( observer, exp, n );
            }
        } );
    } else {
        const ov = getValue( observer, exp );
        if( ov !== val ) {
            handlers.forEach( handler => handler( val, ov, observer, exp ) );
            setValue( observer, exp, val );
        }
    }
}

function listen( setter, observer, exp, handler ) {
    if( !soe$1.getSetter( setter ) ) {
        /**
         * to bind event on the setter
         */
        ec.on( setter, () => soe$1.forEachExps( setter, execute ) );
    }
    soe$1.set( setter, observer, exp, handler );
}

/**
 * @function watch
 * To watch changes of an expression or a function of an observer.
 */
function watch( observer, exp, handler ) {
    const fn = expression( exp );

    collector.start();
    const value = fn( observer );
    const setters = collector.stop();
    if( setters.length ) {
        for( let setter of setters ) {
            listen( setter, observer, exp, handler );
        }
    } else {
        /**
         * to set a listener with a NULL setter
         */
        listen( null, observer, exp, handler );
    }

    if( isPromise$2( value ) ) {
        value.then( val => setValue( observer, exp, val ) );
    } else {
        setValue( observer, exp, value );
    }
}

function unwatch( observer, exp, handler ) {
    soe$1.deleteHandler( observer, exp, handler );
}

function calc( observer, exp, defaultValue ) {
    const val = expression( exp )( observer );
    if( !isUndefined$3( defaultValue ) && ( val === null || isUndefined$3( val ) ) ) return defaultValue;
    return val;
}

/** 
 * @file to convert an object to an observer instance.
 */

const getKeys = Object.keys;
const isArray = Array.isArray;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
const defineProperty = Object.defineProperty;
const setPrototypeOf = Object.setPrototypeOf;

const proto = Array.prototype;
const arrMethods = Object.create( proto);



/**
 * methods which would mutate the array on which it is called.
 *
 * Array.prototype.fill
 * Array.prototype.push
 * Array.prototype.pop
 * Array.prototype.shift
 * Array.prototype.unshift
 * Array.prototype.splice
 * Array.prototype.sort
 * Array.prototype.reverse
 */

let arrayTraverseTranslate = true;

[ 'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'fill' ].forEach( method => {

    const original = proto[ method ];

    defineProperty( arrMethods, method, {
        enumerable : false,
        writable : true,
        configurable : true,
        value() {
            const args = [ ...arguments ];
            const result = original.apply( this, args );
            let inserted, deleted;

            switch( method ) {
                case 'push' :
                case 'unshift' :
                    inserted = args;
                    break;
                case 'splice' :
                    inserted = args.slice( 2 );
                    deleted = result;
                    break;
                case 'fill' :
                    inserted = args[ 0 ];
                    break;
                case 'pop' :
                case 'shift' :
                    deleted = [ result ];
                    break;
            }

            if( deleted ) {
                for( const item of deleted ) {
                    if( item && typeof item === 'object' ) {
                        eventcenter.emit( 'delete-property', item );
                    }
                }
            }

            if( inserted ) {
                for( let item of inserted ) {
                    if( item && typeof item === 'object' ) {
                        arrayTraverseTranslate && traverse( item );
                    }
                }
            }
            this.__fake_setter ? ec.emit( this.__fake_setter ) : ec.emit( this.__setter );
            return result;
        }
    } );

    defineProperty( arrMethods, '$set', {
        enumerable : false,
        writable : true,
        configurable : true,
        value( i, v, trans ) {
            if( i >= this.length ) {
                this.length = +i + 1;
            }
            arrayTraverseTranslate = trans;
            const res = this.splice( i, 1, v )[ 0 ];
            arrayTraverseTranslate = true;
            return res;
        }
    } );

    defineProperty( arrMethods, '$get', {
        enumerable : false,
        writable : true,
        configurable : true,
        value( i ) {
            const setter = this.__fake_setter;
            setter && collector.add( setter );
            return this[ i ];
        }
    } );

    defineProperty( arrMethods, '$length', {
        enumerable : false,
        writable : true,
        configurable : true,
        value( i ) {
            this.length = i;
            this.__fake_setter ? ec.emit( this.__fake_setter ) : ec.emit( this.__setter );
        }
    } );
} );

function isObserverSetter( func ) {
    return func.name === 'OBSERVER_SETTER' || /^function\s+OBSERVER_SETTER\(\)/.test( func.toString() );
}

/**
 * @function translate
 * To translate an property of an object to GETTER and SETTER.
 *
 * @param {Object} obj The object which will be translated
 * @param {String} key The name of the property
 * @param {*} val The value of the property
 * @param {String} path The path in the observer of the property
 * @param {Observer} observer
 */
function translate( obj, key, val ) {
    const descriptor = getOwnPropertyDescriptor( obj, key );
    /**
     * if the configurable of the property is false,
     * the property cannot be translated
     */
    if( descriptor && !descriptor.configurable ) return;

    const setter = descriptor && descriptor.set;

    /**
     * The property has already transformed by Observer.
     * to add the observer and path into the map.
     */
    if( setter && isObserverSetter( setter ) ) {
        /**
         * while translating a property of an object multiple times with different values,
         * The same setter should be used but to set the value to the new value.
         */
        return obj[ key ] = val;
    }

    const getter = descriptor && descriptor.get;

    const set = function OBSERVER_SETTER( v ) {
        const value = getter ? getter.call( obj ) : val;
        /**
         * Setting the same value will not call the setter.
         */
        if( v === value ) return;

        if( setter ) {
            setter.call( obj, v );
        } else {
            val = v;

            /**
             * if the new value is an object, to set the new value with Observer.set method.
             * it should be set to all observers which are using this object.
             */
            if( v && typeof v === 'object' ) {
                traverse( v );
            }

            if( value && typeof value === 'object' ) {
                eventcenter.emit( 'overwrite-object', v, value );
            }
        }
        ec.emit( set );
    };

    const get = function OBSERVER_GETTER() {
        collector.add( set );   
        return getter ? getter.call( obj ) : val;
    };

    defineProperty( obj, key, {
        enumerable : descriptor ? descriptor.enumerable : true,
        configurable : true,
        set,
        get
    } );

    if( isArray( val ) ) {
        defineProperty( val, '__setter', {
            enumerable : false,
            writable : true,
            configurable : true,
            value : set
        } );
    }
}

/**
 * @function traverse
 * To traverse and translate an object.
 *
 * @param {Object} obj
 * @param {Observer} observer
 * @param {String} base
 */
function traverse( obj ) {

    const isarr = isArray( obj );

    if( isarr ) {
        setPrototypeOf( obj, arrMethods );
        for( let i = 0, l = obj.length; i < l; i += 1 ) {
            const item = obj[ i ];

            if( item && typeof item === 'object' ) {
                traverse( item );
            }
        }
    }

    const keys = getKeys( obj );

    for( let key of keys ) {
        const val = obj[ key ];
        // to skip translating the indexes of array
        if( isarr && isInteger( key ) && key >= 0 && key < obj.length ) continue;

        translate( obj, key, val );

        if( val && typeof val === 'object' ) {
            traverse( val );
        }
    }
}

const Observer = {
    create( obj, proto ) {
        if( obj.__observer ) return obj;

        defineProperty( obj, '__observer', {
            enumerable : false,
            writable : true,
            configurable : true,
            value : true
        } );

        if( isArray( obj ) ) {
            defineProperty( obj, '__fake_setter', {
                enumerable : false,
                writable : true,
                configurable : true,
                value : function OBSERVER_SETTER() {}
            } );
        }

        traverse( obj );
        proto && setPrototypeOf( obj, proto );
        eventcenter.emit( 'add-observer', obj );         
        return obj;
    },

    /**
     * @method set
     * To set a new property to an object
     *
     * @param {Object} obj
     * @param {String} key
     * @param {*} value
     */
    set( obj, key, value, trans = true ) {

        /**
         * if the object is an array and the key is a integer, set the value with [].$set
         */
        if( isArray( obj ) && isInteger( key, true ) ) {
            return obj.$set( key, value, trans );
        }

        const old = obj[ key ];

        if( old && typeof old === 'object' ) {
            ec.emit( 'overwrite-object', value, old );
        }

        const isobj = value && typeof value === 'object';

        /**
         * to add the property to the specified object and to translate it to the format of observer.
         */
        translate( obj, key, value );
        /**
         * if the value is an object, to traverse the object with all paths in all observers
         */
        isobj && trans && traverse( value );
        eventcenter.emit( 'set-value', obj, key, value, old );
    },

    /**
     * @function delete
     * To delete an property from
     *
     * - delete all relevant data, storing in each map, for both the specified property and its sub/descandant object.
     * -
     */
    delete( obj, key ) {
        const old = obj[ key ];
        const descriptor = Object.getOwnPropertyDescriptor( obj, key );
        const setter = descriptor && descriptor.set;
        delete obj[ key ];
        eventcenter.emit( 'delete-property', old, setter );
    },

    /**
     * @function translated 
     * to check if the property in the object has been translated to observer setter and getter
     *
     * @param {Object|Array} obj
     * @param {String|Integer} key The property name
     *
     */
    translated( obj, key ) {
        const descriptor = Object.getOwnPropertyDescriptor( obj, key );
        if( descriptor && !descriptor.configurable ) {
            return false;
        }
        const setter = descriptor && descriptor.set;
        return !!( setter && isObserverSetter( setter ) );
    },

    is( observer ) {
        return observer.__observer || false;
    },

    watch( observer, exp, handler ) {
        watch( observer, exp, handler );
    },

    unwatch( observer, exp, handler ) {
        unwatch( observer, exp, handler );
    },

    calc( observer, exp, defaultValue ) {
        return calc( observer, exp, defaultValue );
    },

    replace( observer, data ) {
        for( const key of Object.keys( observer ) ) {
            if( !data.hasOwnProperty( key ) ) {
                Observer.delete( observer, key );
            }
        }

        for( const key of Object.keys( data ) ) {
            if( observer.hasOwnProperty( key ) ) {
                observer[ key ] = data[ key ];
            } else {
                Observer.set( observer, key, data[ key ] );
            }
        }
        return observer;
    },

    destroy( observer ) {
        eventcenter.emit( 'destroy-observer', observer );
    }
};

var isString$4 = str => typeof str === 'string' || str instanceof String;

var isUrl = url => {
    if( !isString$4( url ) ) return false;
    if( !/^(https?|ftp):\/\//i.test( url ) ) return false;
    const a = document.createElement( 'a' );
    a.href = url;
    return /^(https?|ftp):/i.test( a.protocol );
};

function supportIterator() {
    try {
        return !!Symbol.iterator;
    } catch( e ) {
        return false;
    }
}

const decode = str => decodeURIComponent( String( str ).replace( /\+/g, ' ' ) );

class URLSearchParams {
    constructor( init ) {
        if( window.URLSearchParams ) {
            return new window.URLSearchParams( init );
        } else {
            this.dict = [];

            if( !init ) return;

            if( URLSearchParams.prototype.isPrototypeOf( init ) ) {
                return new URLSearchParams( init.toString() );
            }

            if( Array.isArray( init ) ) {
                throw new TypeError( 'Failed to construct "URLSearchParams": The provided value cannot be converted to a sequence.' );
            }

            if( typeof init === 'string' ) {
                if( init.charAt(0) === '?' ) {
                    init = init.slice( 1 );
                }
                const pairs = init.split( /&+/ );
                for( const item of pairs ) {
                    const index = item.indexOf( '=' );
                    this.append(
                        index > -1 ? item.slice( 0, index ) : item,
                        index > -1 ? item.slice( index + 1 ) : ''
                    );
                }
                return;
            }

            for( let attr in init ) {
                this.append( attr, init[ attr ] );
            }
        }
    }
    append( name, value ) {
        this.dict.push( [ decode( name ), decode( value ) ] );
    }
    delete( name ) {
        const dict = this.dict;
        for( let i = 0, l = dict.length; i < l; i += 1 ) {
            if( dict[ i ][ 0 ] == name ) {
                dict.splice( i, 1 );
                i--; l--;
            }
        }
    }
    get( name ) {
        for( const item of this.dict ) {
            if( item[ 0 ] == name ) {
                return item[ 1 ];
            }
        }
        return null;
    }
    getAll( name ) {
        const res = [];
        for( const item of this.dict ) {
            if( item[ 0 ] == name ) {
                res.push( item[ 1 ] );
            }
        }
        return res;
    }
    has( name ) {
        for( const item of this.dict ) {
            if( item[ 0 ] == name ) {
                return true;
            }
        }
        return false;
    }
    set( name, value ) {
        let set = false;
        for( let i = 0, l = this.dict.length; i < l; i += 1 ) {
            const item  = this.dict[ i ];
            if( item[ 0 ] == name ) {
                if( set ) {
                    this.dict.splice( i, 1 );
                    i--; l--;
                } else {
                    item[ 1 ] = String( value );
                    set = true;
                }
            }
        }
    }
    sort() {
        this.dict.sort( ( a, b ) => {
            const nameA = a[ 0 ].toLowerCase();
            const nameB = b[ 0 ].toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        } );
    }

    entries() {

        const dict = [];

        for( let item of this.dict ) {
            dict.push( [ item[ 0 ], item[ 1 ] ] );
        }

        return !supportIterator() ? dict : ( {
            [Symbol.iterator]() {
                return {
                    next() {
                        const value = dict.shift();
                        return {
                            done : value === undefined,
                            value 
                        };
                    }
                };
            }
        } );
    }

    keys() {
        const keys = [];
        for( let item of this.dict ) {
           keys.push( item[ 0 ] );
        }

        return !supportIterator() ? keys : ( {
            [Symbol.iterator]() {
                return {
                    next() {
                        const value = keys.shift();
                        return {
                            done : value === undefined,
                            value
                        };
                    }
                };
            }
        } );
    }

    values() {
        const values = [];
        for( let item of this.dict ) {
           values.push( item[ 1 ] );
        }

        return !supportIterator() ? values : ( {
            [Symbol.iterator]() {
                return {
                    next() {
                        const value = values.shift();
                        return {
                            done : value === undefined,
                            value
                        };
                    }
                };
            }
        } );
    }

    toString() {
        const pairs = [];
        for( const item of this.dict ) {
            pairs.push( encodeURIComponent( item[ 0 ] ) + '=' + encodeURIComponent( item[ 1 ] ) );
        }
        return pairs.join( '&' );
    }
}

const attrs = [
    'href', 'origin',
    'host', 'hash', 'hostname',  'pathname', 'port', 'protocol', 'search',
    'username', 'password', 'searchParams'
];

class URL$1 {
    constructor( path, base ) {
        if( window.URL ) {
            const url = new window.URL( path, base );
            if( !( 'searchParams' in url ) ) {
                url.searchParams = new URLSearchParams( url.search ); 
            }
            return url;
        } else {

            if( URL$1.prototype.isPrototypeOf( path ) ) {
                return new URL$1( path.href );
            }

            if( URL$1.prototype.isPrototypeOf( base ) ) {
                return new URL$1( path, base.href );
            }

            path = String( path );

            if( base !== undefined ) {
                if( !isUrl( base ) ) {
                    throw new TypeError( 'Failed to construct "URL": Invalid base URL' );
                }
                if( /^[a-zA-Z][0-9a-zA-Z.-]*:/.test( path ) ) {
                    base = null;
                }
            } else {
                if( !/^[a-zA-Z][0-9a-zA-Z.-]*:/.test( path ) ) {
                    throw new TypeError( 'Failed to construct "URL": Invalid URL' );
                }
            }

            if( base ) {
                base = new URL$1( base );
                if( path.charAt( 0 ) === '/' && path.charAt( 1 ) === '/' ) {
                    path = base.protocol + path;
                } else if( path.charAt( 0 ) === '/' ) {
                    path = base.origin + path;
                } else {
                    const pathname = base.pathname;
                    
                    if( pathname.charAt( pathname.length - 1 ) === '/' ) {
                        path = base.origin + pathname + path;
                    } else {
                        path = base.origin + pathname.replace( /\/[^/]+\/?$/, '' ) + '/' + path;
                    }
                }
            }

            const dotdot = /([^/])\/[^/]+\/\.\.\//;
            const dot = /\/\.\//g;

            path = path.replace( dot, '/' );

            while( path.match( dotdot ) ) {
                path = path.replace( dotdot, '$1/' );
            }

            const node = document.createElement( 'a' );
            node.href = path;

            for( const attr of attrs ) {
                this[ attr ] = attr in node ? node[ attr ] : '';
            }
            this.searchParams = new URLSearchParams( this.search ); 
        }
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }

}

let id$1 = 0;

const prefix = 'biu_jsonp_callback_' + (+new Date) + '_' + Math.random().toString().substr( 2 );

function createScriptTag( src, id ) {
    const target = document.getElementsByTagName( 'script' )[ 0 ] || document.head.firstChild;
    const  script = document.createElement( 'script' );
    script.src = src;
    script.id = id;
    return target.parentNode.insertBefore( script, target );
}

function jsonp( url, options = {} ) {

    const params = options.data || {};
    const callback = prefix + '_' + id$1++;

    let r1, r2;

    const promise = new Promise$1( ( resolve, reject ) => { 
        r1 = resolve;
        r2 = reject;
    } );

    params.callback || ( params.callback = callback );

    const querystring = new URLSearchParams( params ).toString();

    url += ( url.indexOf( '?' ) >= 0 ? '&' : '?' ) + querystring;

    window[ params.callback ] = function( response ) {
        r1( response );

        window[ params.callback ] = null;
        delete window[ params.callback ];
        const script = document.getElementById( params.callback );
        script && script.parentNode.removeChild( script );
    };

    const script = createScriptTag( url, params.callback );

    script.addEventListener( 'error', e => { r2( e ); } );

    return promise;
}

function isUndefined$4() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

var asyncFunction = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$6 = fn => ({}).toString.call( fn ) === '[object Function]' || asyncFunction( fn );

function isURLSearchParams( obj ) {
    if( window.URLSearchParams.prototype.isPrototypeOf( obj ) ) return true;
    return URLSearchParams.prototype.isPrototypeOf( obj );
}

function mergeParams( dest, src ) {
    if( !isURLSearchParams( dest ) ) {
        dest = new URLSearchParams( dest );
    }

    if( !src ) return dest;

    if( isURLSearchParams( src ) ) {
        for( let item of src.entries() ) {
            dest.append( item[ 0 ], item[ 1 ] );
        }
    } else {
        const keys = Object.keys( src );

        for( let item of keys ) {
            dest.append( item, src[ item ] );
        }
    }
    return dest;
}

var isArguments = obj => ({}).toString.call( obj ) === '[object Arguments]';

var array = obj => Array.isArray( obj );

var arrowFunction = fn => {
    if( !isFunction$6( fn ) ) return false;
    return /^(?:function)?\s*\(?[\w\s,]*\)?\s*=>/.test( fn.toString() );
};

var isBoolean = s => typeof s === 'boolean';

var date = date => ({}).toString.call( date ) === '[object Date]';

var email = str => /^(([^#$%&*!+-/=?^`{|}~<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test( str );

var string = str => typeof str === 'string' || str instanceof String;

var object = obj => obj && typeof obj === 'object' && !Array.isArray( obj );

var empty = obj => {
    if( array( obj ) || string( obj ) ) {
        return !obj.length;
    }
    if( object( obj ) ) {
        return !Object.keys( obj ).length;
    }
    return !obj;
};

var error = e => ({}).toString.call( e ) === '[object Error]';

var isFalse = ( obj, generalized = true ) => {
    if( isBoolean( obj ) || !generalized ) return !obj;
    if( string( obj ) ) {
        return [ 'false', 'no', '0', '', 'nay', 'n', 'disagree' ].indexOf( obj.toLowerCase() ) > -1;
    }
    return !obj;
};

var number = ( n, strict = false ) => {
    if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
        return true;
    }
    if( strict ) return false;
    return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
};

var integer = ( n, strict = false ) => {

    if( number( n, true ) ) return n % 1 === 0;

    if( strict ) return false;

    if( string( n ) ) {
        if( n === '-0' ) return true;
        return n.indexOf( '.' ) < 0 && String( parseInt( n ) ) === n;
    }

    return false;
}

var iterable = obj => {
    try {
        return isFunction$6( obj[ Symbol.iterator ] );
    } catch( e ) {
        return false;
    }
};

// https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/test/data/jquery-1.9.1.js#L480

var plainObject = obj => {
    if( !object( obj ) ) {
        return false;
    }

    try {
        if( obj.constructor && !({}).hasOwnProperty.call( obj, 'constructor' ) && !({}).hasOwnProperty.call( obj.constructor.prototype, 'isPrototypeOf' ) ) {
            return false;
        }
    } catch( e ) {
        return false;
    }

    let key;
    for( key in obj ) {} // eslint-disable-line

    return key === undefined || ({}).hasOwnProperty.call( obj, key );
};

var promise = p => p && isFunction$6( p.then );

var regexp = reg => ({}).toString.call( reg ) === '[object RegExp]';

var isTrue = ( obj, generalized = true ) => {
    if( isBoolean( obj ) || !generalized ) return !!obj;
    if( string( obj ) ) {
        return [ 'true', 'yes', 'ok', '1', 'yea', 'yep', 'y', 'agree' ].indexOf( obj.toLowerCase() ) > -1;
    }
    return !!obj;
};

var url = url => {
    if( !string( url ) ) return false;
    if( !/^(https?|ftp):\/\//i.test( url ) ) return false;
    const a = document.createElement( 'a' );
    a.href = url;
    return /^(https?|ftp):/i.test( a.protocol );
};

var node = s => ( typeof Node === 'object' ? s instanceof Node : s && typeof s === 'object' && typeof s.nodeType === 'number' && typeof s.nodeName === 'string' )

var textNode = node$$1 => node( node$$1 ) && node$$1.nodeType === 3;

var elementNode = node$$1 => node( node$$1 ) && node$$1.nodeType === 1;

var isWindow = obj => obj && obj === obj.window;

var is = {
    arguments : isArguments,
    array,
    arrowFunction,
    asyncFunction,
    boolean : isBoolean,
    date,
    email,
    empty,
    error,
    false : isFalse,
    function : isFunction$6,
    integer,
    iterable,
    number,
    object,
    plainObject,
    promise,
    regexp,
    string,
    true : isTrue,
    undefined : isUndefined$4,
    url,
    node,
    textNode,
    elementNode,
    window : isWindow
};

const Response = class {
    constructor( {
        status = 200,
        statusText = 'OK',
        url = '',
        body = null,
        headers = {}
    } ) {
        if( !is.string( body ) ) {
            return new TypeError( 'Response body must be a string "' + body + '"' );
        }
        Object.assign( this, { 
            body,
            status,
            statusText,
            url,
            headers,
            ok : status >= 200 && status < 300 || status === 304
        } );
    }

    text() {
        return Promise.resolve( this.body );
    }

    json() {
        try {
            const json = JSON.parse( this.body );
            return Promise.resolve( json );
        } catch( e ) {
            return  Promise.reject( e );
        }
    }

    uncompress() {
    }

    compress() {
    }
};

var ajax = ( url, options = {} ) => {

    let {
        data,
        params,
        timeout,
        asynchronous = true,
        method = 'GET',
        headers = {},
        onprogress,
        credentials = 'omit',
        responseType = 'text',
        xhr = new XMLHttpRequest()
    } = options;

    method = method.toUpperCase();

    xhr.timeout = timeout;

    return new Promise$1( ( resolve, reject ) => {

        xhr.withCredentials = credentials === 'include';

        const onreadystatechange = () => {
            if( xhr.readyState != 4 ) return;
            if( xhr.status === 0 ) return;

            const response = new Response( {
                body : responseType !== 'text' ? xhr.response : xhr.responseText,
                status : xhr.status,
                statusText : xhr.statusText,
                headers : xhr.getAllResponseHeaders()
            } );


            resolve( response );

            xhr = null;
        };

        url = new URL$1( url, location.href );

        mergeParams( url.searchParams, params );

        xhr.open( method, url.href, asynchronous );

        xhr.onerror = e => {
            reject( e );
            xhr = null;
        };
        
        xhr.ontimeout = () => {
            reject( 'Timeout' );
            xhr = null;
        };

        if( isFunction$6( onprogress ) ) {
            xhr.onprogress = onprogress;
        }

        const isFormData = FormData.prototype.isPrototypeOf( data );

        for( let key in headers ) {
            if( ( isUndefined$4( data ) || isFormData ) && key.toLowerCase() === 'content-type' ) {
                // if the data is undefined or it is an instance of FormData
                // let the client to set "Content-Type" in header
                continue;
            }
            xhr.setRequestHeader( key, headers[ key ] );
        }

        asynchronous && ( xhr.onreadystatechange = onreadystatechange );

        xhr.send( isUndefined$4( data ) ? null : data );

        asynchronous || onreadystatechange();
    } );
};

var isObject = obj => obj && typeof obj === 'object' && !Array.isArray( obj );

function isUndefined$5() {
    return arguments.length > 0 && typeof arguments[ 0 ] === 'undefined';
}

var isNumber$1 = ( n, strict = false ) => {
    if( ({}).toString.call( n ).toLowerCase() === '[object number]' ) {
        return true;
    }
    if( strict ) return false;
    return !isNaN( parseFloat( n ) ) && isFinite( n )  && !/\.$/.test( n );
};

var isAsyncFunction$6 = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction$7 = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction$6( fn );

var isDate = date => ({}).toString.call( date ) === '[object Date]';

var isString$5 = str => typeof str === 'string' || str instanceof String;

var md5 = ( () => {
    const safe_add = (x, y) => {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    const bit_rol = ( num, cnt ) => ( num << cnt ) | ( num >>> ( 32 - cnt ) );
    const md5_cmn = ( q, a, b, x, s, t ) => safe_add( bit_rol( safe_add( safe_add( a, q ), safe_add( x, t ) ), s ), b );
    const md5_ff = ( a, b, c, d, x, s, t ) => md5_cmn( (b & c) | ( ( ~b ) & d ), a, b, x, s, t );
    const md5_gg = ( a, b, c, d, x, s, t ) => md5_cmn( (b & d) | ( c & ( ~d ) ), a, b, x, s, t );
    const md5_hh = ( a, b, c, d, x, s, t ) => md5_cmn( b ^ c ^ d, a, b, x, s, t );
    const md5_ii = ( a, b, c, d, x, s, t ) => md5_cmn( c ^ ( b | ( ~d ) ), a, b, x, s, t );

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    const binl_md5 = ( x, len ) => {
        /* append padding */
        x[ len >> 5 ] |= 0x80 << (len % 32);
        x[ ( ( ( len + 64 ) >>> 9 ) << 4) + 14 ] = len;

        var a = 1732584193,
            b = -271733879,
            c = -1732584194,
            d = 271733878;

        for( let i = 0, l = x.length; i < l; i += 16 ) {
            let olda = a;
            let oldb = b;
            let oldc = c;
            let oldd = d;

            a = md5_ff(a, b, c, d, x[i], 7, -680876936);
            d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = md5_gg(b, c, d, a, x[i], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = md5_hh(d, a, b, c, x[i], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i], 6, -198630844);
            d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [ a, b, c, d ];
    };

    /*
     * Convert an array of little-endian words to a string
     */
    const binl2rstr = input => {
        var output = '';
        for( let i = 0, l = input.length * 32; i < l; i += 8 ) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    };

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    const rstr2binl = input => {
        const output = Array.from( { length : input.length >> 2 } ).map( () => 0 );
        for( let i = 0, l = input.length; i < l * 8; i += 8 ) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    };

    const rstr_md5 = s => binl2rstr( binl_md5( rstr2binl(s), s.length * 8 ) );
    const str2rstr_utf8 = input => window.unescape( encodeURIComponent( input ) );
    return string => {
        var output = '';
        const hex_tab = '0123456789abcdef';
        const input = rstr_md5( str2rstr_utf8( string ) );

        for( let i = 0, l = input.length; i < l; i += 1 ) {
            const x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
} )();

class Storage {
    constructor( name ) {
        if( !name ) {
            throw new TypeError( `Expect a name for the storage, but a(n) ${name} is given.` );
        }

        this.name = `#LC-STORAGE-V-1.0#${name}#`;

        const abstracts = [ 'set', 'get', 'delete', 'clear', 'keys' ];

        for( let method of abstracts ) {

            if( !isFunction$7( this[ method ] ) ) {
                throw new TypeError( `The method "${method}" must be declared in every class extends from Cache` );
            }
        }
    }

    format( data, options = {} ) {
        let string = true;
        if( !isString$5( data ) ) {
            string = false;
            data = JSON.stringify( data );
        }

        const input = {
            data,
            type : options.type || 'localcache',
            mime : options.mime || 'text/plain',
            string,
            priority : options.priority === undefined ? 50 : options.priority,
            ctime : options.ctime || +new Date,
            lifetime : options.lifetime || 0
        };

        if( options.extra ) {
            input.extra = JSON.stringify( options.extra );
        }

        if( options.md5 ) {
            input.md5 = md5( data );
        }

        if( options.cookie ) {
            input.cookie = md5( document.cookie );
        }

        return input;
    }

    validate( data, options = {} ) {
        let result = true;

        if( data.lifetime ) {
            if( new Date - data.ctime >= data.lifetime ) {
                result = false;
            }
        } 
        
        if( data.cookie ) {
            if( data.cookie !== md5( document.cookie ) ) {
                result = false;
            }
        } 
        
        if( data.md5 && options.md5 ) {
            if( data.md5 !== options.md5 ) {
                result = false;
            }
            if( md5( data.data ) !== options.md5 ) {
                result = false;
            }
        }

        if( options.validate ) {
            return options.validate( data, result );
        }

        return result;
    }

    clean( check ) {
        return this.keys().then( keys => {
            const steps = [];

            for( let key of keys ) {
                steps.push( () => {
                    return this.get( key ).then( data => {
                        if( check( data, key ) === true ) {
                            return this.delete( key );
                        }
                    } )
                } );
            }

            return Sequence.chain( steps ).then( results => {
                const removed = [];

                for( let result of results ) {

                    if( result.status === Sequence.FAILED ) {
                        removed.push( keys[ result.index ] );
                    }
                }

                return removed;
            } );
        } );
    }

    output( data, storage ) {

        if( !storage ) {
            console.error( 'Storage type is required.' );
        }

        if( !data.string ) {
            data.data = JSON.parse( data.data );
        }

        if( data.extra ) {
            data.extra = JSON.parse( data.extra );
        }

        data.storage = storage;

        return data;
    }
}

class Memory extends Storage {
    constructor( name ) {
        super( name );
        this.data = {};
    }

    set( key, data, options = {} ) {
        data = this.format( data, options );
        this.data[ key ] = data;
        return Promise$1.resolve( data );
    }

    get( key, options = {} ) {
        const data = this.data[ key ];

        if( !data ) return Promise$1.reject();

        if( this.validate( data, options ) === false ) {
            options.autodelete !== false && this.delete( key );
            return Promise$1.reject();
        }

        return Promise$1.resolve( this.output( data, 'page' ) );
    }

    delete( key ) {
        this.data[ key ] = null;
        delete this.data[ key ];
        return Promise$1.resolve();
    }

    keys() {
        return Promise$1.resolve( Object.keys( this.data ) );
    }

    clear() {
        this.data = {};
        return Promise$1.resolve();
    }
}

class SessionStorage extends Storage {
    constructor( name ) {
        super( name );
    }

    set( key, data, options = {} ) {
        data = this.format( data, options );
        try {
            sessionStorage.setItem( this.name + key, JSON.stringify( data ) );
            return Promise$1.resolve( data );
        } catch( e ) {
            return Promise$1.reject( e );
        }
    }

    get( key, options = {} ) {
        let data;
        
        try {
            data = JSON.parse( sessionStorage.getItem( this.name + key ) );

            if( !data ) return Promise$1.reject();

            if( this.validate( data, options ) === false ) {
                options.autodelete !== false && this.delete( key );
                return Promise$1.reject();
            }
        } catch( e ) {
            this.delete( key );
            return Promise$1.reject();
        }
        return Promise$1.resolve( this.output( data, 'session' ) );
    }

    delete( key ) {
        sessionStorage.removeItem( this.name + key );  
        return Promise$1.resolve();
    }

    clear() {
        sessionStorage.clear();
        return Promise$1.resolve();
    }

    keys() {
        const keys = [];
        const name = this.name;
        const l = this.name.length;

        for( let key in sessionStorage ) {
            if( key.indexOf( name ) ) continue;
            keys.push( key.substr( l ) );
        }

        return Promise$1.resolve( keys );
    }
}

class IDB extends Storage {
    constructor( name ) {
        super( name );

        this.idb = null;

        this.ready = this.open().then( () => {
            this.idb.onerror = e => {
                console.warn( 'IDB Error', e );
            };
            return this.idb;
        } );

    }

    open() {

        const request = window.indexedDB.open( this.name );

        return new Promise( ( resolve, reject ) => {

            request.onsuccess = e => {
                this.idb = e.target.result;
                resolve( e );
            };

            request.onerror = e => {
                reject( e );
            };

            request.onupgradeneeded = e => {
                this.onupgradeneeded( e );
            };
        } );
    }

    onupgradeneeded( e ) {
        const os = e.target.result.createObjectStore( 'storage', {
            keyPath : 'key'
        } );

        os.createIndex( 'key', 'key', { unique : true } );
        os.createIndex( 'data', 'data', { unique : false } );
        os.createIndex( 'type', 'type', { unique : false } );
        os.createIndex( 'string', 'string', { unique : false } );
        os.createIndex( 'ctime', 'ctime', { unique : false } );
        os.createIndex( 'md5', 'md5', { unique : false } );
        os.createIndex( 'lifetime', 'lifetime', { unique : false } );
        os.createIndex( 'cookie', 'cookie', { unique : false } );
        os.createIndex( 'priority', 'priority', { unique : false } );
        os.createIndex( 'extra', 'extra', { unique : false } );
        os.createIndex( 'mime', 'mime', { unique : false } );
    }

    store( write = false ) {
        return this.idb.transaction( [ 'storage' ], write ? 'readwrite' : 'readonly' ).objectStore( 'storage' );
    }

    set( key, data, options = {} ) {

        data = this.format( data, options );

        return this.ready.then( () => {
            return new Promise( ( resolve, reject ) => {
                const store = this.store( true );
                // don't manipulate the origin data
                const request = store.put( Object.assign( { key }, data ) );

                request.onsuccess = () => {
                    resolve( data );
                };

                request.onerror = e => {
                    reject( e );
                };
            } );
        } );
    }

    delete( key ) {
        return this.ready.then( () => {
            return new Promise( ( resolve, reject ) => {
                const store = this.store( true );
                const request = store.delete( key );

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = e => {
                    reject( e );
                };
            } );
        } );
    }

    get( key, options = {} ) {
        return this.ready.then( () => {
            return new Promise( ( resolve, reject ) => {
                const store = this.store();
                const request = store.get( key );

                request.onsuccess = () => {
                    const data = request.result;
                    if( !data ) {
                        return reject();
                    }

                    if( this.validate( data, options ) === false ) {
                        options.autodelete !== false && this.delete( key ); 
                        return reject();
                    }
                    delete data.key;
                    resolve( this.output( data, 'persistent' ) );
                };

                request.onerror = e => {
                    reject( e );
                };
                
            } );
        } );
    }

    clear() {
        return this.ready.then( () => {
            return new Promise( ( resolve, reject ) => {
                const store = this.store( true );
                const request = store.clear();

                request.onsuccess = () => {
                    resolve();
                };

                request.onerror = e => {
                    reject( e );
                };
            } );
        } );
    }

    keys() {
        return this.ready.then( () => {
            return new Promise( ( resolve, reject ) => {
                const store = this.store();

                if( store.getAllKeys ) {
                    const request = store.getAllKeys();

                    request.onsuccess = () => {
                        resolve( request.result );
                    };

                    request.onerror = () => {
                        reject();
                    };
                } else {
                    try {
                        const request = store.openCursor();
                        const keys = [];

                        request.onsuccess = () => {
                            const cursor = request.result;

                            if( !cursor ) {
                                resolve( keys );
                                return;
                            }

                            keys.push( cursor.key );
                            cursor.continue();
                        };
                    } catch( e ) {
                        reject( e );
                    }
                }
            } );
        } );
    }
}

let Persistent = Storage;

if( window.indexedDB ) {
    Persistent = IDB;
}

var Persistent$1 = Persistent;

/**
 * please don't change the order of items in this array.
 */
class LocalCache {
    constructor( name ) {
        if( !name ) {
            throw new TypeError( 'Expect a name for your storage' );
        }

        this.page = new Memory( name );
        this.session = new SessionStorage( name );
        this.persistent = new Persistent$1( name );

        this.clean();
    }
    set( key, data, options ) {

        const steps = [];

        for( let mode of LocalCache.STORAGES ) {
            if( !options[ mode ] ) continue;

            let opts = options[ mode ];

            if( opts === false ) continue;

            if( !isObject( opts ) ) {
                opts = {};
            }

            if( !isUndefined$5( options.type ) ) {
                opts.type = options.type;
            }

            if( !isUndefined$5( options.extra ) ) {
                opts.extra = options.extra;
            }

            if( !isUndefined$5( options.mime ) ) {
                opts.mime = options.mime;
            }
            
            steps.push( () => this[ mode ].set( key, data, opts ) );
        }

        if( !steps.length ) {
            throw new TypeError( `You must specify at least one storage mode in [${LocalCache.STORAGES.join(', ')}]` );
        }

        return Sequence.all( steps ).then( () => data );
    }

    get( key, modes, options = {} ) {

        if( isObject( modes ) ) {
            modes = LocalCache.STORAGES;
            options = modes;
        }

        modes || ( modes = LocalCache.STORAGES );

        const steps = [];

        for( let mode of modes ) {
            if( !this[ mode ] ) {
                throw new TypeError( `Unexcepted storage mode "${mode}", excepted one of: ${LocalCache.STORAGES.join( ', ' )}` );
            }
            steps.push( () => this[ mode ].get( key, options ) );
        }

        return Sequence.any( steps ).then( results => {
            const result = results[ results.length - 1 ];
            const value = result.value;

            let store = false;

            for( const item of LocalCache.STORAGES ) {
                if( options[ item ] && item !== value.storage ) {
                    store = true;
                }
            }

            if( !store ) return value;

            const opts = Object.assign( value, options, {
                [ value.storage ] : false
            } );

            return this.set( key, value.data, opts ).then( () => value );
        } );
    }

    delete( key, modes ) {
        modes || ( modes = LocalCache.STORAGES );

        const steps = [];

        for( let mode of modes ) {
            if( !this[ mode ] ) {
                throw new TypeError( `Unexcepted mode "${mode}", excepted one of: ${LocalCache.STORAGES.join( ', ' )}` );
            }
            steps.push( () => this[ mode ].delete( key ) );
        }
        return Sequence.all( steps );
    }

    clear( modes ) {
        modes || ( modes = LocalCache.STORAGES );

        const steps = [];

        for( let mode of modes ) {
            if( !this[ mode ] ) {
                throw new TypeError( `Unexcepted mode "${mode}", excepted one of: ${LocalCache.STORAGES.join( ', ' )}` );
            }
            steps.push( () => this[ mode ].clear() );
        }

        return Sequence.all( steps );
    }

    clean( options = {} ) {
        const check = ( data, key ) => {
            let remove = false;

            const { priority, length, ctime, type } = options;

            if( !isUndefined$5( priority ) ) {
                if( data.priority < priority ) {
                    remove = true;
                }
            }

            if( !remove && !isUndefined$5( length ) ) {
                const content = data.data;
                if( isNumber$1( length ) ) {
                    if( content.length >= length ) {
                        remove = true;
                    }
                } else if( Array.isArray( length ) ) {
                    if( content.length >= length[ 0 ] && content.length <= length[ 1 ] ) {
                        remove = true;
                    }
                }
            }

            if( !remove && !isUndefined$5( ctime ) ) {
                if( isDate( ctime ) || isNumber$1( ctime ) ) {
                    if( data.ctime < +ctime ) {
                        remove = true;
                    }
                } else if( Array.isArray( ctime ) ) {
                    if( data.ctime > ctime[ 0 ] && data.ctime < ctime[ 1 ] ) {
                        remove = true;
                    }
                }
            }

            if( !remove ) {
                if( Array.isArray( type ) ) {
                    if( type.indexOf( data.type ) > -1 ) {
                        remove = true;
                    }
                } else if( type == data.type ) {
                    remove = true;
                }
            }

            if( !remove && isFunction$7( options.remove ) ) {
                if( options.remove( data, key ) === true ) {
                    remove = true;
                }
            }

            return remove;
        };

        const steps = [];

        for( let mode of LocalCache.STORAGES ) {
            steps.push( this[ mode ].clean( check ) );
        }
        return Promise.all( steps );
    }
}

LocalCache.STORAGES = [ 'page', 'session', 'persistent' ];

const localcache = new LocalCache( 'BIU-REQUEST-VERSION-1.0.0' );

function set$1( key, data, options ) {
    const url = new URL( key );
    url.searchParams.sort();

    return localcache.set( url.toString(), data, options );
}

function get( key, options = {} ) {

    let url = new URL( key ); 
    url.searchParams.sort();
    url = url.toString();

    return localcache.get( url, LocalCache.STORAGES, options ).then( result => {
        const response = new Response( {
            url,
            body : result.data,
            status : 200,
            statusText : 'From LocalCache',
            headers : {
                'Content-Type' : result.mime
            }
        } );

        return response;
    } );
}

var lc = { localcache, set: set$1, get };

function resJSON( xhr ) {
    return /^application\/json;/i.test( xhr.getResponseHeader( 'content-type' ) );
}

function request( url, options = {} ) {

    if( options.auth ) {
        if( !options.headers ) {
            options.headers = {};
        }
        const username = options.auth.username || '';
        const password = options.auth.password || '';
        options.headers.Authorization = 'Basic ' + btoa( username + ':' + password );
    }

    options.xhr || ( options.xhr =  new XMLHttpRequest() );

    return ajax( url, options ).then( response => {
        const status = response.status;

        if( status < 200 || status >= 300 ) {
            throw response;
        }

        if( options.fullResponse ) {
            return response;
        }

        if( options.rawBody ) {
            return response.body;
        }

        if( resJSON( options.xhr ) || options.type === 'json' ) {
            return response.json();
        }

        return response.body;
    } );
}

function get$1( url, options = {} ) {

    const {
        cache = false,
        fullResponse = false,
        rawBody = false,
        localcache = false
    } = options;

    options = Object.assign( {}, options, {
        method : 'GET'
    } );

    url = new URL$1( url, location.href );
    mergeParams( url.searchParams, options.params ); 

    options.params = {};

    if( cache === false ) {
        options.params[ '_' + +new Date ] = '_';
    }

    if( !localcache ) {
        return request( url, options );
    }

    return lc.get( url, localcache ).catch( () => {

        options.fullResponse = true;

        options.xhr || ( options.xhr = new XMLHttpRequest() );

        return request( url, options ).then( response => {

            const isJSON = ( resJSON( options.xhr ) || options.type === 'json' );

            if( !localcache.mime ) {
                if( isJSON ) {
                    localcache.mime = 'application/json';
                } else {
                    localcache.mime = response.headers[ 'Content-Type' ] || 'text/plain';
                }
            }

            return lc.set( url.toString(), response.body, localcache ).then( () => {

                if( fullResponse ) {
                    return response;
                }

                if( rawBody ) {
                    return response.body;
                }

                if( isJSON ) {
                    return response.json();
                }

                return response.body;
            } );
        } );
    } );
}

function post( url, options = {} ) {
    options.method = 'POST';

    const { contentType = true } = options;

    if( !options.headers ) {
        options.headers = {};
    }

    if( contentType && !options.headers[ 'Content-Type' ] ) {
        options.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    return request( url, options );
}

var biu = { request, get: get$1, post, ajax, jsonp };

var isArray$1 = obj => Array.isArray( obj );

class Model extends Extension {
    constructor( init, config = {} ) {
        super( init, Object.assign( { type : 'extension-model' }, config ) );

        this.__watch_handlers = new Map();
        this.validators || ( this.validators = {} );
        this.validations || ( this.validations = {} );
        this.data || ( this.data = {} );
        this.expose || ( this.expose = [] );
        
        this.$validators = {};

        if( this.$data ) {
            Observer.destroy( this.$data );
        }

        if( this.$props ) {
            Observer.destroy( this.$props );
        }

        this.$methods = Observer.create( this.__methods() );
        this.$props = Observer.create( defaultProps(), this.$methods );
        this.$data = Observer.create( {}, this.$props );
    }

    __init() {
        this.__initial = null;
        this.__triedSubmitting = false;

        this.$on( 'ready', () => {
            this.$props.$ready = true;
        } );
    }

    __loadData() {
        if( this.url ) {
            return biu.get( this.url, {
                params : this.params || null,
                storage : this.storage || false
            } );
        }
        if( this.data && isFunction$2( this.data ) ) {
            return Promise$1.resolve( this.data() );
        }
        return Promise$1.resolve( this.data || {} );
    }

    __initData() {
        return this.__loadData().then( data => {
            this.$assign( data );
            try {
                this.__initial = JSON.stringify( this.$data );
            } catch( e ) {
                console.warn( e );
            }
        } ).catch( reason => {
            const error = new Error( 'Failed to initialize model data.', { reason } );
            this.$props.$failed = error;
            throw error;
        } );
    }

    __initValidations() {
        const promises = [];
        const validators = this.validators;
        const $validation = defaultValidationProps();

        for( const name in validators ) {
            if( validators.hasOwnProperty( name ) ) {
                promises.push( this.$validator( name, validators[ name ] ) );
            }
        }

        const validations = this.validations;

        for( const key in validations ) {
            const item = validations[ key ];
            $validation[ key ] = defaultValidationProps();
            $validation[ key ].path = item.path || ( item.path = key );
            $validation[ key ].$validator = item.$validator = this.__makeValidator( key, item );
            if( !item .on ) item.on = 'submitted';

            this.$watch( () => {
                const rules = Object.keys( $validation[ key ].$errors );
                for( let rule of rules ) {
                    if( $validation[ key ].$errors[ rule ] ) {
                        return true;
                    }
                }
                return false;
            }, val => {
                const $validation = this.$props.$validation;

                $validation[ key ].$error = val;

                if( val === true ) {
                    $validation.$error = true;
                    return;
                }

                for( let attr in $validation ) {
                    if( $validation[ attr ].$error === true ) {
                        $validation.$error = true;
                        return;
                    }
                }

                $validation.$error = false;
            } );

            this.$watch( () => $validation[ key ].$validating, val => {
                if( val === true ) {
                    $validation.$validating = true;
                    return;
                }

                for( const key in $validation ) {
                    if( key.charAt( 0 ) === '$' ) continue;
                    if( $validation[ key ].$validating ) {
                        $validation.$validation = true;
                        return;
                    }
                }
                $validation.$validating = false;
            } );

            const exp = () => JSON.stringify( this.$data ) !== this.__initial;

            const handler = v => {
                if( v === false ) {
                    this.$unwatch( exp, handler );
                    this.$props.$validation.$pristine = false;
                }
            };

            this.$watch( exp, handler );

            switch( item.on ) {
                case 'submit' :
                case 3 :
                    break;
                case 'change' :
                case 1 :
                    this.$watch( item.path, item.$validator );
                    break;
                case 'submitted' :
                case 2 :
                default :
                    this.$watch( item.path, ( ...args ) => {
                        if( this.__triedSubmitting ) {
                            item.$validator( ...args );
                        }
                    } );
            }
        }

        Observer.set( this.$props, '$validation', $validation );

        return Promise$1.all( promises );
    }

    __makeValidator( name, bound ) {
        return val => {
            const props = this.$props;
            const validation = props.$validation;
            const errors = validation[ name ].$errors;
            const steps = [];

            validation[ name ].$validating = true;

            if( isUndefined$2( val ) ) {
                val = Observer.calc( this.$data, bound.path );
            }

            for( const key in bound.rules ) {
                const rule = bound.rules[ key ];
                let func;
                let args = [ val ];

                if( isFunction$2( this.$validators[ key ] ) ) {
                    func = this.$validators[ key ];
                    args.push( ...( isArray$1( rule ) ? rule : [ rule ] ) );
                } else {
                    func = rule;
                }

                if( isFunction$2( func ) ) {
                    steps.push( () => {
                        const result = func.call( this, ...args );
                        if( isPromise( result ) ) {
                            result.then( v => {
                                if( v === false ) {
                                    Observer.set( errors, key, true );
                                    throw false;
                                }
                                Observer.set( errors, key, v === false );
                                return true;
                            } ).catch( () => {
                                Observer.set( errors, key, true );
                                throw false;
                            } );
                        }

                        if( result === false ) {
                            Observer.set( errors, key, true );
                            return true;
                        }

                        Observer.set( errors, key, false );
                        throw false;

                    } );    
                } else {
                    console.warn( `Invalide validator "${rule}".` );
                }
            }

            return Sequence.all( steps ).then( () => {
                validation[ name ].$validating = false;
                validation[ name ].$checked = true;
            } ).catch( e => {
                validation[ name ].$validating = false;
                validation[ name ].$checked = true;
                throw e;
            } );
        };
    }

    __methods() {
        const methods = {};
        const keys = Object.getOwnPropertyNames( Object.getPrototypeOf( this ) ).concat( [ '$reload' ], Object.keys( this ) );

        for( const key of keys ) {
            if( key.charAt( 0 ) !== '$' && this.expose.indexOf( key ) < 0 ) continue;

            const item = this[ key ];

            Object.defineProperty( methods, key, {
                value : isFunction$2( item ) ? item.bind( this ) : item
            } );
        }

        return methods;
    }

    $validator( name, handler ) {
        if( isPromise( handler ) ) {
            return handler.then( res => {
                this.$validators[ name ] = isFunction$2( res.expose ) ? res.expose() : res;
            } );
        }

        if( isString$1( handler ) ) {
            console.log( handler );
        }

        this.$validators[ name ] = handler;
        return Promise$1.resolve( handler );
    }

    $watch( exp, handler ) {
        const wrapedHandler = ( ...args ) => {
            handler.call( this, ...args );
        };
        this.__watch_handlers.set( handler, wrapedHandler );
        Observer.watch( this.$data, exp, wrapedHandler );
    }

    $unwatch( exp, handler ) {
        const wrapedHandler = this.__watch_handlers.get( handler );
        if( wrapedHandler ) {
            Observer.unwatch( this.$data, exp, wrapedHandler );
            this.__watch_handlers.delete( handler );
        }
    }

    /**
     * $set( value )
     * $set( key, value )
     * $set( dest, key, value );
     */
    $set() {
        if( arguments.length === 1 ) {
            return Observer.replace( this.$data, ...arguments ); 
        }
        if( arguments.length === 2 ) {
            return Observer.set( this.$data, ...arguments );
        }
        if( arguments.length === 3 ) {
            return Observer.set( ...arguments );
        }
    }

    /**
     * $assign( value )
     * $assign( dest, value )
     */
    $assign( dest, value ) {
        if( arguments.length === 1 ) {
            value = dest;
            dest = this.$data;
        }

        for( const key of Object.keys( value ) ) {
            this.$set( dest, key, value[ key ] );
        }
    }

    $delete() {
        if( arguments.length === 1 ) {
            return Observer.delete( this.$data, arguments[ 0 ] );
        }
        return Observer.delete( ...arguments );
    }

    $reset() {
        if( this.__initial ) {
            try {
                this.$set( JSON.parse( this.__initial ) );
            } catch( e ) {
                console.warn( e );
            }
        }
    }

    $refresh() {
        return this.__loadData().then( data => {
            this.$set( data );
            try {
                this.__initial = JSON.stringify( this.$data );
            } catch( e ) {
                console.warn( e );
            }
        } ).catch( reason => {
            const error = new Error( 'Failed while refreshing data', {
                reason,
                model : this,
                name : 'JauntyExtensionModelError'
            } );
            this.$props.$failed = error;
            throw error;
        } );
    }

    $request( url, options = {} ) {
        const props = this.$props;
        props.$requesting = true;

        return biu.request( url, options ).then( res => {
            props.$requesting = false;
            props.$error = false;
            props.$response = res;
            return res;
        } ).catch( reason => {
            props.$requesting = false;
            props.$error = reason;
            props.$response = reason;
            throw reason;
        } );
    }

    $post( url, options = {} ) {
        options.method = 'POST';
        return this.$request( url, options );
    }

    $get( url, options = {} ) {
        options.method = 'GET';
        return this.$request( url, options );
    }

    $submit( method = 'submit', allowMultipleSubmission = false, ...args ) {
        const props = this.$props;

        this.__triedSubmitting = true;

        if( !allowMultipleSubmission && props.$submitting ) {
            return Promise$1.reject( new Error( 'Multiple submitting' ) );
        }

        if( this.$validate() === false ) {
            return Promise$1.reject( {
            } );
        }

        props.$submitting = props.$requesting = true;

        let res;

        if( isFunction$2( method ) ) {
            res = method.call( this, ...args );
        } else {
            if( !isFunction$2( this[ method ] ) ) {
                console.error( `Cannot find method "${method}".` );
            }
            res = this[ method ]( ...args );
        }

        if( isPromise( res ) ) {
            return res.then( response => {
                props.$error = false;
                props.$response = response;
                props.$submitting = props.$requesting = false;
            } ).catch( reason => {
                const error = new Error( 'Failed while submitting.', {
                    reason
                } );

                props.$submitting = props.$requesting = false;
                props.$error = error;
                props.$response = reason;

                throw error;
            } );
        }

        if( res === false ) {
            props.$submitting = props.$requesting = false;
            props.$error = true;

            return Promise$1.reject( new Error( 'Failed while submitting' ) );
        }

        props.$error = false;
        props.$submitting = props.$requesting = false;
        return Promise$1.resolve( res );
    }

    $validate( name ) {
        const promises = [];
        const validation = this.$props.$validation;

        if( name ) {
            if( !validation[ name ] ) {
                console.warn( `No validator named "${name}".` );
                return Promise$1.resolve();
            }

            return validation[ name ].$validator.call( this );
        }

        if( validation ) {
            for( const attr in validation ) {
                if( attr.charAt( 0 ) === '$' ) continue;
                const item = validation[ attr ];
                promises.push( item.$validator.call( this ) );
            }
        }

        return Promise$1.all( promises ).then( () => {
            validation.$error = false;
        } ).catch( () => {
            validation.$error = true;
        } );
    }

    $destruct() {
        Observer.destroy( this.$data );
        Observer.destroy( this.$props );
        Observer.destroy( this.$methods );
    }
}

function defaultProps() {
    return {
        $ready : false,
        $failed : false,
        $submitting : false,
        $requesting : false,
        $error : false,
        $response : null
    };
}

function defaultValidationProps() {
    return {
        $validating : false,
        $checked : false,
        $pristine : true,
        $error : false,
        $errors : {}
    };
}

return Model;

})));
