const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const files = require('./webpack.files.json');

function getEntries(files) {
    let entries = {};
    for(let key in files) {
        let file = files[key];
        let distDir = file.distDir || file.srcDir;
        let srcDir = "./src/"+file.srcDir;
        let ext = file.isHTML ? ".tsx" : ".ts";
        entries[distDir+key] = srcDir+key+ext;
    }
    return entries;
}
function getHTMLPlugins(files) {
    let plugins = [];
    for(let key in files) {
        if(files[key].isHTML) {
            let file = files[key];
            let distDir = file.distDir || file.srcDir;
            plugins.push(
                new HtmlWebpackPlugin({
                    inject: true,
                    chunks: [distDir+key],
                    filename: distDir+key+".html",
                    template: 'html.template.ejs'
                })
            );
        }
    }
    return plugins;
}
function getManifestPlugin(manifestPath, files) {
    const manifest = require(manifestPath);
    return new ManifestPlugin({
        fileName: "manifest.json",
        generate: function() {
            let str = JSON.stringify(manifest);
            for(let key in files) {
                let file = files[key];
                let distDir = file.distDir || file.srcDir;
                let ext = file.isHTML ? ".html" : ".js";
                let regexp = new RegExp("\\${"+key+"}\\$", "g");
                let fileURL = distDir+key+ext;
                str = str.replace(regexp, fileURL);
            }
            return JSON.parse(str);
        }
    });
}
module.exports = {
    optimization: {
        minimize: false,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "pages/assets/js/vendors",
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

    entry: getEntries(files),
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
        getManifestPlugin("./src/manifest.json", files)
    ].concat(getHTMLPlugins(files))
}
