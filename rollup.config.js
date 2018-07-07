import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

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
        buble( {
            transforms : {
                arrow : true,
                dangerousForOf : true
            }
        } )
    ],
    output : [
        { file : 'dist/jaunty-extension-model.bc.js', format : 'umd', name : 'Model' }
    ]
} ];
