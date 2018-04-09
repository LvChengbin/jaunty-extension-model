const Koa = require( 'koa' );
const body = require( 'koa-body' );
const logger = require( 'koa-logger' );
const Router = require( '@lvchengbin/koa-router' );

const app = new Koa();
const router = new Router( app );

app.use( logger() );
app.use( body( { multipart : true } ) );

app.use( async ( ctx, next ) => {
    if( ctx.method === 'OPTIONS' ) {
        const origin = ctx.request.get( 'origin' );
        ctx.set( 'Access-Control-Allow-Origin', origin );
        ctx.body = {};
    } else {
        next();
    }
} );

router.any( [ 'get', 'post' ], /.*/, async ( ctx, next ) => {
    const origin = ctx.request.get( 'origin' );
    ctx.set( 'Access-Control-Allow-Origin', origin );
    next();
} );

router.get( '/data', async ctx => {
    ctx.body = {
        x : 1,
        y : 2
    };
} );

router.post( '/submit', async ctx => {
    ctx.body = {
        x : 1,
        y : 2
    };
} );

app.listen( 50001 );
