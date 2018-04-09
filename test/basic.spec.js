import is from '@lvchengbin/is';
import Error from '@jaunty/error';
import Model from '../src/index';

describe( 'Jaunty Model Base', () => {
    describe( 'initiallization', () => {
        it( 'using an Object as the initial data', done => {
            const model = new Model( {
                data : {
                    x : 1
                }
            } );

            model.$ready( () => {
                expect( model.$data ).toEqual( { x : 1 } );
                done();
            } );
        } );

        it( 'using an "url" property for loading initial data', done => {
            new Model( {
                url : 'http://localhost:50001/data'
            } ).$ready( function() {
                expect( this.$data ).toEqual( { x : 1, y : 2 } );
                done();
            } );
        } );

        it( 'using a function', done => {
            new Model( {
                data() {
                    return { x : 1 };
                }
            } ).$ready( function() {
                expect( this.$data ).toEqual( { x : 1 } );
                done();
            } );
        } );

        it( 'using a function which returns a Promise object', done => {
            new Model( {
                data() {
                    return new Promise( resolve => {
                        setTimeout( () => {
                            resolve( { x : 1 } );
                        }, 40 );
                    } );
                }
            } ).$ready( function() {
                expect( this.$data ).toEqual( { x : 1 } );
                done();
            } );
        } );

        it( 'using a rejected promise object', done => {
            new Model( {
                data() {
                    return Promise.reject( 'error' );
                }
            } ).$on( 'error', function() {
                expect( this.$data.$failed instanceof Error ).toBeTruthy();
                done();
            } );
        } );
    } );

    describe( 'special properties', () => {
        it( '$ready should be "false"', done => {
            expect( new Model({}).$data.$ready ).toBeFalsy();
            done();
        } );

        it( '$ready should be "true"', done => {
            new Model({}).$ready( function() {
                expect( this.$data.$ready ).toBeTruthy();
                done();
            } );
        } );

        it( '$failed should be "false"', () => {
            expect( new Model({}).$data.$failed ).toBeFalsy();
        } );

        it( '$failed should be ', done => {
            new Model( {
                data() {
                    return Promise.reject( 'error' );
                }
            } ).$on( 'error', function() {
                expect( this.$data.$ready ).toBeFalsy();
                expect( this.$data.$failed instanceof Error ).toBeTruthy();
                done();
            } );
        } );

        it( '$error', () => {
        } );

        it( '$submitting', () => {
        } );

        it( '$requesting', () => {
        } );

        it( '$validation', () => {
        } );
    } );

    describe( 'exposed methods', () => {
        it( 'special methods', done => {
            new Model( {
                expose : [ 'func' ],
                func() {
                },
                action() {
                    expect( is.function( this.$data.$assign ) ).toBeTruthy();
                    expect( is.function( this.$data.$delete ) ).toBeTruthy();
                    expect( is.function( this.$data.$reset ) ).toBeTruthy();
                    expect( is.function( this.$data.$refresh ) ).toBeTruthy();
                    expect( is.function( this.$data.$reload ) ).toBeTruthy();
                    expect( is.function( this.$data.$submit ) ).toBeTruthy();
                    expect( is.function( this.$data.$request ) ).toBeTruthy();
                    expect( is.function( this.$data.$get ) ).toBeTruthy();
                    expect( is.function( this.$data.$post ) ).toBeTruthy();
                    expect( is.function( this.$data.$validate ) ).toBeTruthy();
                    done()
                }
            } );
        } );

        it( 'exposed methods', done => {
            new Model( {
                expose : [ 'func' ],
                func() {},
                action() {
                    expect( is.function( this.$data.func ) ).toBeTruthy();
                    done()
                }
            } );
        } );
    } );

    describe( 'hooks', () => {

        it( 'should have called the init method before ready', done => {
            new Model( {
                init() {
                    expect( this.$status ).toEqual( 'created' );
                    done();
                }
            } );
        } );

        it( 'should have called the callback function after the model is ready', done => {
            const model = new Model();

            model.$ready( () => {
                expect( model.$status ).toEqual( 'ready' );
                done();
            } );
        } );

        it( 'should have called the "then" method after the model is ready', done => {
            const model = new Model();

            model.$ready().then( () => {
                expect( model.$status ).toEqual( 'ready');
                done();
            } );
        } );

        it( 'should have called the "init" method while initlaizing', done => {
            new Model( {
                init() {
                    expect( this.$status ).toEqual( 'created' );
                    done();
                }
            } );
        } );

        it( 'should have called the "action" method after ready', done => {
            new Model( {
                action() {
                    expect( this.$status ).toEqual( 'ready' );
                    done();
                }
            } );
        } );

    } );
e );
