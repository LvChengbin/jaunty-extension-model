import Extension from '@jaunty/extension';
import Promise from '@lvchengbin/promise';
import isFunction from '@lvchengbin/is/src/function';
import isPromise from '@lvchengbin/is/src/promise';
import Observer from '@lvchengbin/observer';
import biu from '@lvchengbin/biu';
import Error from '@jaunty/error';
import { getDataByPath } from './utils';

class Model extends Extension {
    constructor( init, config = {} ) {
        super( init, Object.assign( { type : 'model' }, config ) );

        this.validators || ( this.validators = {} );
        this.data || ( this.data = {} )
        this.expose || ( this.expose = [] );
        
        this.__watch_handlers = new Map();
        // a property for stroing the initial data
        this.__boundValidation = false;
        if( this.$data ) {
            Observer.destroy( this.$data );
        }

        if( this.$props ) {
            Observer.destroy( this.$props );
        }

        this.$props = Observer.create( defaultProps(), Observer.create( this.__methods() ) );

        this.$data = Observer.create( {}, this.$props );

    }

    __init() {
        this.__initial = null;
        this.__triedSubmit = false;

        this.$on( 'ready', () => {
            this.$props.$ready = true;
        } );

        return this.__initData().then( data => {
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

    __initData() {
        if( this.url ) {
            return biu.get( this.url, {
                params : this.params || null,
                storage : this.storage || false
            } );
        }
        if( this.data && isFunction( this.data ) ) {
            return Promise.resolve( this.data() )
        }
        return Promise.resolve( this.data || {} );
    }

    __methods() {
        const methods = {};
        const keys = Object.getOwnPropertyNames( Object.getPrototypeOf( this ) ).concat( [ '$reload' ], Object.keys( this ) );

        for( const key of keys ) {
            if( key.charAt( 0 ) !== '$' && this.expose.indexOf( key ) < 0 ) continue;

            const item = this[ key ];

            Object.defineProperty( methods, key, {
                value : isFunction( item ) ? item.bind( this ) : item
            } );
        }

        return methods;
    }

    __bindSpecialProperties() {
        const properties = {
            $ready : true,
            $error : false,
            $submitting : false,
            $requesting : false,
            $response : null,
            $validation : this.__validationDefaultStatus()
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
                properties.$validation[ key ] = this.__validationDefaultStatus();

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

    __validationDefaultStatus() {
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

    __validator( name, bound ) {
        return () => {
            const validation = this.$data.$validation;
            if( !validation ) return true;
            let res = true;
            const val = getDataByPath( this.$data, bound.path );
            for( let keys = Object.keys( bound ), i = keys.length - 1; i >= 0; i-- ) {
                const key = keys[ i ];

                if( key.charAt( 0 ) === '_' && key.charAt( 1 ) === '_' ) continue;
                const item = bound[ key ];
                let error;

                if( isFunction( item ) ) {
                    error = !item.call( this, val );
                } else if( isFunction( this.validators[ key ] ) ) {
                    error = !this.validators[ key ]( val, bound[ key ] );
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
     * $assign( value )
     * $assign( key, value )
     * $assign( dest, key, value );
     */
    $assign() {
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

    $delete() {
        Observer.delete( ...arguments );
    }

    $reset() {
        if( this.__initial ) {
            try {
                this.$assign( JSON.parse( this.__initial ) );
            } catch( e ) {
                console.warn( e );
            }
        }
    }

    $refresh() {
        return this.__initData().then( data => {
            this.$assign( data );
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
            return Promise.reject( new Error( 'Multiple submitting' ) );
        }

        if( this.$validate() === false ) {
            return Promise.reject( {
            } );
        }

        props.$submitting = props.$requesting = true;

        let res;

        if( isFunction( method ) ) {
            res = method.call( this, ...args );
        } else {
            if( !isFunction( this[ method ] ) ) {
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

            return Promise.reject( new Error( 'Failed while submitting' ) );
        }

        props.$error = false;
        props.$submitting = props.$requesting = false;
        return Promise.resolve( res );
    }

    $validate() {
    }
}

function defaultProps() {
    return {
        $ready : false,
        $failed : false,
        $submitting : false,
        $requesting : false,
        $error : false,
        $response : null,
        $validation : defaultValidationProps()
    };
}

function defaultValidationProps() {
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

export default Model;
