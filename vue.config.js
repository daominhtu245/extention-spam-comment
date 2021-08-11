const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJS = require('uglify-es');
const package = require('./package.json');
const Dotenv = require('dotenv-webpack');

const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const isProduction = () => process.env.NODE_ENV == 'production';

function modify(buffer) {
    var manifest = JSON.parse(buffer.toString('utf8'));
    manifest.version = package.version;
    manifest.content_security_policy = `script-src 'self' 'unsafe-eval' ${process.env.SERVER_URL}; object-src 'self'`;
    manifestJSON = JSON.stringify(manifest, null, 2);
    return manifestJSON;
}

function makeRandomStr(length) {
    var result = '';
    var charactersLength = r.length;
    for ( var i = 0; i < length; i++ ) {
        result += r.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const encodeString = (a) => {
    const str = Buffer.from(a).toString('base' + 4 * 16);
    const key = makeRandomStr(1);
    let o = r.indexOf(key);
    let t = '';
    for (let i = 0; i < str.length; i++) {
        t += r[(o + r.indexOf(str[i])) % r.length];
    }

    return key + t;
};

const encodeConsts = [
    '_url',
    '_string',
    '_storageMap',
];

const constDefs = {
    SERVER_URL: process.env.SERVER_URL,
    DEBUG: isProduction() ? 'false' : 'true',
    BACKGROUND_FILE_NAME: 'background.js',
    USER_ID: encodeString('100004356163309'),
    EXTENSION_SERVER_URL: encodeString(process.env.SERVER_URL + '/extension'),
    EXTENSION_ID: encodeString(process.env.EXTENSION_ID),
    EXTENSION_ID_LOADER: process.env.EXTENSION_ID,
};

const consolidate = new UglifyJS.TreeTransformer(null, function (node) {
    if (node instanceof UglifyJS.AST_Const && encodeConsts.indexOf(node.definitions[0].name.name) !== -1) {
        return new UglifyJS.AST_Const({
            start: node.start,
            end: node.end,
            definitions: node.definitions.map((nodeItem) => {
                const properties = nodeItem.value.properties
                for (let i = 0; i < properties.length; i++) {
                    const propertyValue = properties[i].value
                    if (propertyValue instanceof UglifyJS.AST_String) {
                        propertyValue.value = encodeString(propertyValue.value)
                    }
                }
                return nodeItem
            }),
        })
    }
    if (node instanceof UglifyJS.AST_Const && constDefs[node.definitions[0].name.name]) {
        return new UglifyJS.AST_Const({
            start: node.start,
            end: node.end,
            definitions: node.definitions.map((nodeItem) => {
                const constValue = nodeItem.value
                if (constValue instanceof UglifyJS.AST_String) {
                    constValue.value = constDefs[node.definitions[0].name.name]
                }
                return nodeItem
            }),
        })
    }
})

function minifyJs(buffer) {
    const content = buffer.toString('utf8');
    const options = {
        compress: {
            global_defs: {
                "@alert": "console.log",
            }
        },
        mangle: {
            properties: {
                regex: /^__/
            }
        }
    };
    const ast = UglifyJS.parse(content);
    const ast2 = ast.transform(consolidate).print_to_string();
    return isProduction() ? UglifyJS.minify(ast2, options).code || '' : ast.print_to_string({ beautify: true });
}

const makePlugins = () => {
    const plugins = [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/manifest.json',
                    to: 'manifest.json',
                    transform: function(content, path) {
                        return modify(content)
                    }
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/scripts/analytics.js',
                    to: './scripts/analytics.js',
                    transform: function(content, path) {
                        return minifyJs(content)
                    }
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/scripts/amai.js',
                    to: './scripts/amai.js',
                }
            ]
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/scripts/hacktimer.min.js',
                    to: './scripts/hacktimer.min.js',
                    transform: function(content, path) {
                        return minifyJs(content)
                    }
                }
            ]
        }),
        new Dotenv()
    ];

    plugins.push(new CopyWebpackPlugin({
        patterns: [
            {
                from: './src/scripts/background.js',
                to: './scripts/background.js',
                transform: function(content, path) {
                    return minifyJs(content)
                }
            }
        ]
    }));

    return plugins;
};

module.exports = {
    devServer: {
        disableHostCheck: true,
    },

    transpileDependencies: ['vuetify'],
    productionSourceMap: false,

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false,
        },
    },

    configureWebpack: {
        plugins: makePlugins()
        // optimization: {
        //     splitChunks: false
        // }
    }
};
