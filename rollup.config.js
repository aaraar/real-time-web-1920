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
        input: 'src/game.js',
        output: {
            file: 'static/game.js',
            format: 'iife',
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