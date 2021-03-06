module.exports = {
    // UglifyJs2 option, which basically performs dead code removal only.
    "dead_code_removal_only": {
        warnings: 'verbose',
        mangle: false,
        compress: {
            sequences: false,
            properties: false,
            drop_debugger: true,
            dead_code: true,
            conditionals: false,
            comparisons: false,
            evaluate: false,
            booleans: false,
            typeofs: false,
            loops: false,
            unused: true,
            toplevel: false,
            hoist_funs: false,
            if_return: false,
            inline: false,
            join_vars: false,
            cascade: false,
            collapse_vars: false,
            reduce_vars: false,
            keep_fargs: true,
            // UglifyJs by default does not remove functions with empty function body.
            // We declare here that certain functions used for logging are side-effect free,
            // so that UglifyJs can remove them.
            pure_funcs: ['print', 'call', 'callEnd', 'closeAllGroup']
        },
        output: {
            beautify: true,
            comments: false,
            indent_level: 2
        }
    },
    "asm_safe": {
        warnings: 'verbose',
        mangle: {
            toplevel: true
        },
        compress: {
            sequences: false,
            properties: false,
            drop_debugger: false,
            dead_code: false,
            conditionals: false,
            comparisons: false,
            evaluate: false,
            booleans: false,
            typeofs: false,
            loops: false,
            unused: false,
            toplevel: false,
            hoist_funs: false,
            if_return: false,
            inline: false,
            join_vars: false,
            cascade: false,
            collapse_vars: false,
            reduce_vars: false,
            keep_fargs: true
        },
        output: {
            max_line_len: 500
        }
    }
};
