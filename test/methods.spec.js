import Error from '@jaunty/error';
import Model from '../src/index';

describe( 'Methods of Jaunty Extension Model', () => {
    describe( '$watch', () => {
        it( 'to watch a simple exp', done => {
            new Model( {
                data : {
                    x : 1
                },
                init() {
                    this.$watch( 'x', ( val, old ) => {
                        expect( val ).toEqual( 2 );
                        expect( old ).toEqual( 1 );
                        done();
                    } );
                },
                action() {
                    this.$data.x = 2;
                }
            } );
        } );

        it( 'to watch a complex exp', done => {
            new Model( {
                data() {
                    return {
                        x : 1,
                        y : 1,
                        obj : {
                            m : 1,
                            n : 1
                        }
                    };
                },
                init() {
                    this.$watch( 'x + y + obj.m + obj.n', ( val, old ) => {
                        expect( val ).toEqual( 6 );
                        expect( old ).toEqual( 4 );
                        done();
                    } );
                },
                action() {
                    this.$data.obj.m = 3;
                }
            } );
        } );

        it( 'to watch a return value of a function', done => {
            new Model( {
                data() {
                    return {
                        list : [ 1, 2, 3, 4 ]
                    }
                },
                init() {
                    this.$watch( () => this.$data.list.length, ( val, old ) => {
                        expect( val ).toEqual( 5 );
                        expect( old ).toEqual( 4 );
                        done();
                    } );
                },
                action() {
                    this.$data.list.push( 5 );
                }
            } );
        } );

        it( 'to watch special properties', done => {
            new Model( {
                data : {},
                init() {
                    this.$watch( () => this.$data.$ready, ( val, old ) => {
                        expect( val ).toBeTruthy();
                        expect( old ).toBeFalsy();
                        done();
                    } );
                }
            } );
        } );

        it( 'to watch $failed', done => {
            const model = new Model( {
                data() {
                    return new Promise( ( resolve, reject ) => {
                        setTimeout( reject, 40 );
                    } );
                }
            } );

            model.$watch( '$failed', ( val, old ) => {
                expect( val instanceof Error ).toBeTruthy();
                expect( old ).toBeFalsy();
                done();
            } );

        } );
    } );

    describe( '$unwatch', () => {
        it( 'should remove listeners of watching the expression', done => {
            let i = 0;
            new Model( {
                data() {
                    return {
                        list : [ 1, 2, 3, 4 ]
                    }
                },
                init() {
                    this.handler = ( val, old ) => {
                        expect( val ).toEqual( 5 );
                        expect( old ).toEqual( 4 );
                        i++;
                    };
                    this.$watch( 'list.length', this.handler );
                },
                action() {
                    this.$data.list.push( 5 );
                    this.$unwatch( 'list.length', this.handler );
                    this.$data.list.push( 6 );
                    expect( i ).toEqual( 1 );
                    done();
                }
            } );
        } );

        it( 'should have removed the listener of watching a function', done => {
            let i = 0;
            new Model( {
                data() {
                    return {
                        list : [ 1, 2, 3, 4 ]
                    };
                },
                init() {
                    this.func = () => this.$data.list.length;

                    this.handler = ( val, old ) => {
                        expect( val ).toEqual( 5 );
                        expect( old ).toEqual( 4 );
                        i++;
                    };
                    this.$watch( this.func, this.handler );
                },
                action() {
                    this.$data.list.push( 5 );
                    this.$unwatch( this.func, this.handler );
                    this.$data.list.push( 6 );
                    expect( i ).toEqual( 1 );
                    done();
                }
            } );
        } );
    } );

    describe( '$set', () => {
        it( 'to replace the $data', done => {
            new Model( {
                data : { x : 1, y : 2 }
            } ).$ready( function() {
                this.$set( { m : 1, n : 2, x : 3 } );

                expect( this.$data ).toEqual( { m : 1, n : 2, x : 3 } );

                this.$watch( 'm + n + x', ( val, old ) => {
                    expect( val ).toEqual( 7 );
                    expect( old ).toEqual( 6 );
                    done();
                } );

                this.$data.m++;
            } );
        } );

        it( 'to set a property of $data', done => {
            new Model( {
                data : { x : 1, y : 2 }
            } ).$ready( function() {
                this.$set( 'm', 3 );

                expect( this.$data ).toEqual( { x : 1, y : 2, m : 3 } );

                this.$watch( 'x + y + m', ( val, old ) => {
                    expect( val ).toEqual( 7 );
                    expect( old ).toEqual( 6 );
                    done();
                } );

                this.$data.m++;
            } );
        } );

        it( 'to set property to an object in $data', done => {
            new Model( {
                data : { x : 1, y : 2, obj : {} }
            } ).$ready( function() {
                this.$set( this.$data.obj, 'm', 3 );

                expect( this.$data ).toEqual( { x : 1, y : 2, obj : { m : 3 } } );

                this.$watch( 'x + y + obj.m', ( val, old ) => {
                    expect( val ).toEqual( 7 );
                    expect( old ).toEqual( 6 );
                    done();
                } );

                this.$data.obj.m++;
            } );
        } );
    } );

    describe( '$delete', () => {
        it( 'should have watched the changes with $delete method', done => {
            new Model( {
                data : { x : 1, y : 2, m : 3, n : 4 }
            } ).$ready( function() {
                this.$watch( 'x + y + m + n', ( val, old ) => {
                    expect( val ).toEqual( null );
                    expect( old ).toEqual( 10 );
                    done();
                } );

                this.$delete( this.$data, 'n' );
            } );
        } );
    } );

    describe( '$reload', () => {
        it( 'should have reloaded the data', done => {
            let i = 0;
            new Model( {
                data() {
                    return i++ ? Promise.resolve( { n : 2 } ) : Promise.reject( 'error' );
                },
                action() {
                    done();
                }
            } ).$on( 'error', function() {
                this.$reload();
            } );
        } );
    } );

    describe( '$reset', () => {
        it( 'reset to the initial object', done => {
            new Model( {
                data() {
                    return Promise.resolve( { x : 1, y : 1 } );
                },
                action() {
                    this.$data.x = 2;
                    this.$set( 'm', 1 );
                    expect( this.$data ).toEqual( { x : 2, y : 1, m : 1 } );
                    this.$reset();
                    expect( this.$data ).toEqual( { x : 1, y : 1 } );
                    done();
                }
            } );
        } );
    } );

    describe( '$refresh', () => {
        it( 'to refresh the data', done => {
            let i = 0;
            new Model( {
                data() {
                    return Promise.resolve( { x : i++, y : 1 } );
                },
                action() {
                    this.$data.y = 2;
                    this.$set( 'm', 1 );
                    expect( this.$data ).toEqual( { x : 0, y : 2, m : 1 } );
                    this.$refresh().then( () => {
                        expect( this.$data ).toEqual( { x : 1, y : 1 } );
                        done();
                    } );
                }
            } );
        } );
    } );

    describe( '$submit', () => {
        it( 'successful submission', done => {
            new Model( {
                action() {
                    const promise = this.$submit();

                    expect( this.$data.$submitting ).toBeTruthy();
                    expect( this.$data.$requesting ).toBeTruthy();
                    
                    promise.then( () => {
                        expect( this.$data.$response ).toEqual( {
                            x : 1,
                            y : 2
                        } );
                        expect( this.$data.$submitting ).toBeFalsy();
                        expect( this.$data.$requesting ).toBeFalsy();

                        done();
                    } );
                },
                submit() {
                    return this.$post( 'http://localhost:50001/submit' );
                }
            } );
        } );

        it( 'failed submission', done => {
            new Model( {
                action() {
                    const promise = this.$submit();
                    
                    expect( this.$data.$submitting ).toBeTruthy();
                    expect( this.$data.$requesting ).toBeTruthy();

                    promise.catch( () => {
                        expect( this.$data.$error instanceof Error ).toBeTruthy();
                        expect( this.$data.$submitting ).toBeFalsy();
                        expect( this.$data.$requesting ).toBeFalsy();
                        done();
                    } );
                },
                submit() {
                    return this.$post( 'http://localhost:50001/404' );
                }
            } );
        } );
    } );

} );
