import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default [
    {
        input: 'src/main.js',
    output: {
        file: 'static/main.js',
        name: 'bundle',
    },
    inlineDynamicImports: true,
    plugins: [
        resolve ( {
            main: true,
            browser: true
        } ),
        commonjs ()
    ]
    },
    {
        input: 'src/join.js',
    output: {
        file: 'static/join.js',
        name: 'bundle',
    },
    inlineDynamicImports: true,
    plugins: [
        resolve ( {
            main: true,
            browser: true
        } ),
        commonjs ()
    ]
    }
]