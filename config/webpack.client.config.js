// for HMR: npm i -D webpack-dev-middleware webpack-hot-middleware react-hot-loader @hot-loader/react-dom clean-webpack-plugin

const path = require('path');  // for relative paths
const {HotModuleReplacementPlugin, DefinePlugin} = require('webpack');  // for HMR
const {CleanWebpackPlugin} = require('clean-webpack-plugin');  // for HMR

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const GLOBAL_CSS_REGEXP = /\.global\.css$/;
const DEV_PLUGINS = [
    new HotModuleReplacementPlugin(), // for HMR
    new CleanWebpackPlugin()  // for HMR (delete old compiles after changes)
]
const COMMON_PLUGINS = [new DefinePlugin({'process.env.CLIENT_ID': `'${process.env.CLIENT_ID}'`})]

function setupDevtool() {
    return IS_DEV ? 'eval' : false;
}

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            'react-dom': IS_DEV ? '@hot-loader/react-dom' : 'react-dom'  // for HMR
        }
    },
    mode: NODE_ENV ? NODE_ENV : 'development',
    entry: [
        path.resolve(__dirname, '../src/client/index.jsx'),
        'webpack-hot-middleware/client?path=http://localhost:3001/static/__webpack_hmr',  // for HMR
    ],
    output: {
        path: path.resolve(__dirname, '../dist/client'),
        filename: 'client.js',
        publicPath: '/static/',  // for HMR
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',  // activate css modules
                                localIdentName: '[name]__[local]--[hash:base64:5]'  // name of selector
                            }
                        }
                    },
                    // 'less-loader',
                ],
                exclude: GLOBAL_CSS_REGEXP,
            },
            {
                test: GLOBAL_CSS_REGEXP,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    devtool: setupDevtool(),
    plugins: IS_DEV ? DEV_PLUGINS.concat(COMMON_PLUGINS) : COMMON_PLUGINS
}