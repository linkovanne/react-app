const path = require('path');  // for relative paths
const nodeExternals = require('webpack-node-externals');
const {DefinePlugin} = require('webpack');


const NODE_ENV = process.env.NODE_ENV;
const GLOBAL_CSS_REGEXP = /\.global\.css$/;

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    mode: NODE_ENV ? NODE_ENV : 'development',
    target: 'node',
    entry: path.resolve(__dirname, '../src/server/server.js'),
    output: {
        path: path.resolve(__dirname, '../dist/server'),
        filename: 'server.js'
    },
    externals: [nodeExternals()],  // don't include node_modules into final server bundle
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                use: ['ts-loader']
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',  // activate css modules
                                localIdentName: '[name]__[local]--[hash:base64:5]',  // name of selector
                                exportOnlyLocals: true,
                            },
                        }
                    },
                    // 'less-loader'
                ],
                exclude: GLOBAL_CSS_REGEXP,
            },
            {
                test: GLOBAL_CSS_REGEXP,
                use: ['css-loader']
            }
        ]
    },
    optimization: {
        minimize: false
    },
    plugins: [new DefinePlugin({'process.env.CLIENT_ID': `'${process.env.CLIENT_ID}'`})]
}