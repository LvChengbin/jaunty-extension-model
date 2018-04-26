import Model from '../src/index';

describe( 'Validation', () => {
    it( 'basic validation on chnage', done => {
        new Model( {
            data : {
                name : ''
            },
            validations : {
                name : {
                    on : 'change',
                    rules : {
                        length( val ) {
                            return val.length < 3;
                        }
                    }
                }
            },
            action() {
                const $validation = this.$data.$validation;

                expect( $validation.name.$error ).toBeFalsy();
                this.$data.name = 'jaunty';
                setTimeout( () => {
                    expect( $validation.$error ).toBeTruthy();
                    expect( $validation.name.$error ).toBeTruthy();
                    expect( $validation.name.$errors.length ).toBeTruthy();
                    this.$data.name = 'l';

                    setTimeout( () => {
                        expect( $validation.$error ).toBeFalsy();
                        expect( $validation.name.$error ).toBeFalsy();
                        expect( $validation.name.$errors.length ).toBeFalsy();
                        done();
                    }, 20 );

                }, 20 );
            }
        } );
    } );

    it( 'validator returns a Promise object', done => {
        new Model( {
            data : {
                name : ''
            },
            validations : {
                name : {
                    on : 'change',
                    rules : {
                        duplicate( val ) {
                            return new Promise( ( resolve, reject ) => {
                                setTimeout( () => {
                                    if( val === 'exists' ) {
                                        reject();
                                    } else {
                                        resolve();
                                    }
                                }, 5 );
                            } );
                        }
                    }
                }
            },
            action() {
                const $validation = this.$data.$validation;

                expect( $validation.name.$error ).toBeFalsy();
                this.$data.name = 'exists';
                setTimeout( () => {
                    expect( $validation.$error ).toBeTruthy();
                    expect( $validation.name.$error ).toBeTruthy();
                    expect( $validation.name.$errors.duplicate ).toBeTruthy();
                    this.$data.name = 'new';

                    setTimeout( () => {
                        expect( $validation.$error ).toBeFalsy();
                        expect( $validation.name.$error ).toBeFalsy();
                        expect( $validation.name.$errors.duplicate ).toBeFalsy();
                        done();
                    }, 30 );

                }, 30 );
            }
        } )
    } );

    it( 'validation on change after submit', done => {
        new Model( {
            data : {
                name : ''
            },
            validations : {
                name : {
                    on : 'submitted',
                    rules : {
                        length( val ) {
                            return val.length < 3;
                        }
                    }
                }
            },
            action() {
                expect( this.$data.$validation.name.$error ).toBeFalsy();
                this.$submit( () => {} );
                this.$data.name = 'jaunty2';
                setTimeout( () => {
                    expect( this.$data.$validation.$error ).toBeTruthy();
                    expect( this.$data.$validation.name.$error ).toBeTruthy();
                    expect( this.$data.$validation.name.$errors.length ).toBeTruthy();
                    done();
                }, 20 );
            }
        } );

    } );

    it( 'validation should not be run before trying submitting', done => {
        new Model( {
            data : {
                name : ''
            },
            validations : {
                name : {
                    on : 'submitted',
                    rules : {
                        length( val ) {
                            return val.length < 3;
                        }
                    }
                }
            },
            action() {
                expect( this.$data.$validation.name.$error ).toBeFalsy();
                this.$data.name = 'jaunty2';
                setTimeout( () => {
                    expect( this.$data.$validation.name.$error ).toBeFalsy();
                    expect( this.$data.$validation.name.$errors.length ).toBeFalsy();
                    done();
                }, 30 );
            }
        } );
    } );
} );
