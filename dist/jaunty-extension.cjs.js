'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Extension = _interopDefault(require('@jaunty/extension'));
var biu = _interopDefault(require('@lvchengbin/biu'));
var Observer = _interopDefault(require('@lvchengbin/observer'));

var isAsyncFunction = fn => ( {} ).toString.call( fn ) === '[object AsyncFunction]';

var isFunction = fn => ({}).toString.call( fn ) === '[object Function]' || isAsyncFunction( fn );

var isPromise = p => p && isFunction( p.then );

const Promise = class {
    constructor( fn ) {
        if( !( this instanceof Promise ) ) {
            throw new TypeError( this + ' is not a promise ' );
        }

        if( !isFunction( fn ) ) {
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
        const promise = new Promise( () => {} );
        this[ '[[PromiseThenables]]' ].push( {
            resolve : isFunction( resolved ) ? resolved : null,
            reject : isFunction( rejected ) ? rejected : null,
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

Promise.resolve = function( value ) {
    if( !isFunction( this ) ) {
        throw new TypeError( 'Promise.resolve is not a constructor' );
    }
    /**
     * @todo
     * check if the value need to return the resolve( value )
     */
    return new Promise( resolve => {
        resolve( value );
    } );
};

Promise.reject = function( reason ) {
    if( !isFunction( this ) ) {
        throw new TypeError( 'Promise.reject is not a constructor' );
    }
    return new Promise( ( resolve, reject ) => {
        reject( reason );
    } );
};

Promise.all = function( promises ) {
    let rejected = false;
    const res = [];
    return new Promise( ( resolve, reject ) => {
        let remaining = 0;
        const then = ( p, i ) => {
            if( !isPromise( p ) ) {
                p = Promise.resolve( p );
            }
            p.then( value => {
                res[ i ] = value;
                if( --remaining === 0 ) {
                    resolve( res );
                }
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

Promise.race = function( promises ) {
    let resolved = false;
    let rejected = false;

    return new Promise( ( resolve, reject ) => {
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
                promise = Promise.resolve( promise );
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
                then( Promise.reject( e ), thenable );
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
                then( Promise.reject( e ), thenable );
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
    if( !( promise instanceof Promise ) ) {
        return new Promise( resolve => {
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
    if( !( promise instanceof Promise ) ) {
        return new Promise( ( resolve, reject ) => {
            reject( value );
        } );
    }
    promise[ '[[PromiseStatus]]' ] = 'rejected';
    promise[ '[[PromiseValue]]' ] = value;
    promiseExecute( promise );
}

const protos = [
    '$reload', '$refresh', '$assign', '$submit', '$load', '$delete', '$update'
];

function pack( data, model ) {
    if( typeof data !== 'object' ) {
        console.warn( '[J WARN] Model: model data is not an object', data, model );
        return data;
    }

    const methods = {};
    const keys = protos.concat( Object.keys( model ) );

    for( let key of keys ) {
        const item = model[ key ];
        methods[ key ] = isFunction( item ) ? item.bind( model ) : item;
    }

    for( let key of keys ) {
        if( key.charAt( 0 ) !== '$' && model.expose.indexOf( key ) < 0 ) continue;
        if( data.hasOwnProperty( key ) ) continue;

        Object.defineProperty( data, key, {
            value : methods[ key ]
        } );
    }

    return Observer.create( data );
}

function defaultStatus() {
    return {
        $valid : false,
        $checked : false,
        $modified : false,
        $dirty : false,
        $pristine : false,
        $error : false,
        $errors : {}
    };
}

class Model extends Extension {
    constructor( init, config = {} ) {
        super( init, Object.assign( { type : 'model' }, config ) );
        this.data || ( this.data = {} );
        this.expose || ( this.expose = [] );

        // for storing the real data
        this.$data = {};
        
        // a property for stroing a snapshot
        this.__snapshot = {};

        // a property for stroing the initial data
        this.__initial = null;
        this.__boundValidation = false;
        this.__specialProperties = null;
        this.__triedSubmit = false;
    }

    __init() {
        return this.__initData().then( () => {
            try {
                this.__initial = JSON.stringify( this.$data );
            } catch( e ) {
                console.warn( e );
            }
            this.__bindSpecialProperties();
        } );
    }

    __initData( data = null ) {
        if( data ) {
            this.$data = pack( data, this );
            return Promise.resolve()
        }

        let params;

        if( this.api ) {
            this.url = this.api.url;
            params = this.api.param || null ;
        }

        if( this.url ) {
            return biu.get( this.url, {
                params,
                storage : this.storage || false
            } ).then( response => {
                this.$data = pack( response, this );
            } ).catch( e => {
                console.error( e );
            } );
        } else if( this.data ) {
            if( isFunction( this.data ) ) {
                const p = this.data();
                if( isPromise( p ) ) {
                    return p.then( response => {
                        this.$data = pack( response, this );
                    } );
                } else {
                    this.$data = pack( p || {}, this );
                }
            } else if( isPromise( this.data ) ) {
                return this.data.then( response => {
                    this.$data = pack( response, this );
                } );
            } else {
                if( this.__initial ) {
                    this.$reset();
                } else {
                    this.$data = pack( this.data, this );
                }
            }
        } else {
            this.$data = pack( {}, this );
        }

        return Promise.resolve();
    }

    __bindSpecialProperties() {
        const properties = {
            $ready : true,
            $loading : false,
            $failed : false,
            $error : false,
            $submitting : false,
            $requesting : false,
            $response : null,
            $validateion : defaultStatus()
        };

        const makeChangeAfterSubmitHandler = item => {
            return ( ...args ) => {
                if( this.__triedSubmit ) {
                    item.__validator( ...args );
                }
            };
        };

        if( this.validations ) {
            const keys = Object.keys( this.validations );
            for( let key of keys ) {
                const item = this.validations[ key ];
                properties.$validation[ key ] = defaultStatus();

                if( !this.__boundValidation ) {
                    item.__validator = this.__validator( key, item );
                    item.path || ( item.path = key );
                    switch( item.on ) {
                        case 'change' :
                        case 1 :
                            this.$watch( item.path, item.__validator );
                            break;
                        case 'change-after-submit' :
                        case 2 :
                            this.$watch( item.path, makeChangeAfterSubmitHandler( item ) );
                            break;
                        default :
                            break;
                    }
                }
            }
        }
    }

    __validator( name, bound ) {
        return () => {
            const validation = this.$data.$validation;
            if( !validation ) return true;
            let res = true;
            const val = getDataByPath( this.$data, bound.path );
            for( let keys = getKeys( bound ), i = keys.length - 1; i >= 0; i-- ) {
                const key = keys[ i ];

                if( key.charAt( 0 ) === '_' && key.charAt( 1 ) === '_' ) continue;
                const item = bound[ key ];
                let error;

                if( isFunction( item ) ) {
                    error = !item.call( this, val );
                } else if( isFunction( Validate[ key ] ) ) {
                    error = !Validate[ key ]( val, bound[ key ] );
                } else { continue }
                error && ( res = false );
                this.$assign( validation[ name ].$errors, {
                    [ key ] : error
                } );
            }

            if( bound.hasOwnProperty( 'method' ) ) {
                if( !bound.method.call( this, val ) ) {
                    res = false;
                    validation[ name ].$errors.method = true;
                }
                validation[ name ].$errors.method = false;
            }

            validation[ name ].$valid = res;

            return !( validation[ name ].$error = !res );
        };
    }
}

module.exports = Model;
