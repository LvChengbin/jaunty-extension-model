import Extension from '@jaunty/extension';
import Promise from '@lvchengbin/promise';
import Observer from '@lvchengbin/observer';
import Sequence from '@lvchengbin/sequence';
import biu from '@lvchengbin/biu';
import isFunction from '@lvchengbin/is/src/function';
import isPromise from '@lvchengbin/is/src/promise';
import isString from '@lvchengbin/is/src/string';
import isUndefined from '@lvchengbin/is/src/undefined';
import isArray from '@lvchengbin/is/src/array';
import Error from '@jaunty/error';

class Model extends Extension {
    constructor( init, config = {} ) {
        super( init, Object.assign( { type : 'model' }, config ) );

        this.validators || ( this.validators = {} );
        this.validations || ( this.validations = {} );
        this.data || ( this.data = {} )
        this.expose || ( this.expose = [] );
        
        this.$validators = {};
        this.__watch_handlers = new Map();

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
        this.__triedSubmitting = false;

        this.$on( 'ready', () => {
            this.$props.$ready = true;
        } );

        return Promise.all( [
            this.__initValidations(),
            this.__initData().then( data => {
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
            } )
        ] );
    }

    __initData() {
        if( this.url ) {
            return biu.get( this.url, {
                params : this.params || null,
                storage : this.storage || false
            } );
        }
        if( this.data && isFunction( this.data ) ) {
            return Promise.resolve( this.data() );
        }
        return Promise.resolve( this.data || {} );
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
            item.path || ( item.path = key );
            item.$validator = this.__makeValidator( key, item );
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

        return Promise.all( promises );
    }

    __makeValidator( name, bound ) {
        return val => {
            if( !isUndefined( val ) ) {
                val = Observer.calc( this.$data, bound.path );
            }
            const props = this.$props;
            const validation = props.$validation;
            const errors = validation[ name ].$errors;
            const steps = [];

            for( const key in bound.rules ) {
                const rule = bound.rules[ key ];
                let func;
                let args = [ val ];


                if( isFunction( this.$validators[ key ] ) ) {
                    func = this.$validators[ key ];
                    args.push( ...( isArray( rule ) ? rule : [ rule ] ) );
                } else {
                    func = rule;
                }

                if( isFunction( func ) ) {
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

            return Sequence.all( steps );
        };
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

    $validator( name, handler ) {
        if( isPromise( handler ) ) {
            return handler.then( res => {
                this.$validators[ name ] = isFunction( res.expose ) ? res.expose() : res;
            } );
        }

        if( isString( handler ) ) {
            console.log( handler );
        }

        this.$validators[ name ] = handler;
        return Promise.resolve( handler );
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
        $response : null
    };
}

function defaultValidationProps() {
    return {
        $validating : false,
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
