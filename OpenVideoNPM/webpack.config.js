const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const WebExtensionManager = require('./webextensionmngr');

const files = require('./webpack.files.json');

const vendorPath = "pages/assets/js/vendors";


module.exports = {
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/](?!(style-loader|css-loader|sass-loader))/,
                    name: vendorPath,
                    chunks: "all"
                }
            }
        }
    },
    stats: 'errors-only',
    mode: 'none',
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        },{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        },{
            test: /\.(png|jpg|gif|svg)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: '/pages/assets/png'
                    },
                },
            ],
        }]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        modules: [
            path.resolve('node_modules'),
            path.resolve('./src/modules'),
            path.resolve('./src/pages'),
            "node_modules"
        ],
        extensions: [
            '.ts',
            '.js',
            '.d.ts',
            '.tsx',
            '.json'
        ]
    },
    plugins: [
        new CleanWebpackPlugin([
            'OpenVideo.zip',
            'dist/**/*.map',
            'dist/*.js',
            'dist/pages/**/*.js',
            'dist/background_scripts/**/*.js',
            'dist/content_scripts/**/*.js',
            'dist/inject_scripts/**/*.js',

            'dist/proxy_scripts/**/*.js'
        ]),
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            exclude: /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        }),
        new WebExtensionManager({
            manifestVars: {
                vendorPath: vendorPath+".js"
            }
        })
    ]
}
