import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default [ {
    input : 'src/index.js',
    plugins : [
        resolve( {
            module : true,
            jsnext : true
        } )
    ],
    output : [
        { file : 'dist/jaunty-extension-model.cjs.js', format : 'cjs' },
        { file : 'dist/jaunty-extension-model.js', format : 'umd', name : 'Model' }
    ]
}, {
    input : 'src/index.js',
    plugins : [
        resolve( {
            jsnext : true
        } ),
        babel()
    ],
    output : [
        { file : 'dist/jaunty-extension-model.bc.js', format : 'umd', name : 'Model' }
    ]
} ];
