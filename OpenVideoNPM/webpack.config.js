const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

function getEntries(files) {
    let entries = {};
    for(let key in files) {
        entries[files[key].distDir+key] = files[key].srcDir+key+files[key].ext;
    }
    return entries;
}
function getHTMLPlugins(files) {
    let plugins = [];
    for(let key in files) {
        if(files[key].html) {
            plugins.push(new HtmlWebpackPlugin({
                inject: true,
                chunks: [files[key].distDir+key],
                filename: files[key].distDir+key+".html",
                template: 'html.template.ejs'
            }));
        }
    }
    return plugins;
}
function getManifestPlugin(manifestPath, files, values) {
    const manifest = require(manifestPath);
    return new ManifestPlugin({
        fileName: "manifest3.json",
        generate: function() {
            for(let hash of values) {
                let path = hash.path.split(".");
                let last = path.pop();
                let obj = path.reduce(function(acc, el){
                    return acc[el];
                }, manifest);
                if(hash.files) {
                    obj[last] = hash.files.map(function(el){
                        let fileObj = files[el];
                        return fileObj.distDir+el+(hash.html ? ".html" : fileObj.ext);
                    });
                }
                else {
                    let fileObj = files[hash.file];
                    obj[last] = fileObj.distDir+hash.file+(hash.html ? ".html" : fileObj.ext);
                }
            }
            return manifest;
        }
    });
}

const files = {
    library_test: {
        ext: ".tsx",
        srcDir: "./src/pages/library/",
        distDir: "test_pages/",
        html: true
    },
    videoplay_test: {
        ext: ".tsx",
        srcDir: "./src/pages/videoplay/",
        distDir: "test_pages/",
        html: true
    },
    videopopup_test: {
        ext: ".tsx",
        srcDir: "./src/pages/videopopup/",
        distDir: "test_pages/",
        html: true
    },
    library: {
        ext: ".ts",
        srcDir: "./src/page_scripts/",
        distDir: "pages/library/"
    },
    options: {
        ext: ".ts",
        srcDir: "./src/page_scripts/",
        distDir: "pages/options/"
    },
    popupmenu: {
        ext: ".ts",
        srcDir: "./src/page_scripts/",
        distDir: "pages/popupmenu/"
    },
    videoplay: {
        ext: ".ts",
        srcDir: "./src/page_scripts/",
        distDir: "pages/videoplay/"
    },
    videopopup: {
        ext: ".ts",
        srcDir: "./src/page_scripts/",
        distDir: "pages/videopopup/"
    },
    videosearch: {
        ext: ".ts",
        srcDir: "./src/page_scripts/",
        distDir: "pages/videosearch/"
    },
    bg_script: {
        ext: ".ts",
        srcDir: "./src/background_scripts/",
        distDir: "background_scripts/"
    },
    document_start: {
        ext: ".ts",
        srcDir: "./src/content_scripts/",
        distDir: "content_scripts/"
    },
    document_idle: {
        ext: ".ts",
        srcDir: "./src/content_scripts/",
        distDir: "content_scripts/"
    },
    document_end: {
        ext: ".ts",
        srcDir: "./src/content_scripts/",
        distDir: "content_scripts/"
    },
    top_window: {
        ext: ".ts",
        srcDir: "./src/content_scripts/",
        distDir: "content_scripts/"
    },
    search_videos: {
        ext: ".ts",
        srcDir: "./src/inject_scripts/",
        distDir: "inject_scripts/"
    },
    pac_firefox: {
        ext: ".ts",
        srcDir: "./src/proxy_scripts/",
        distDir: "proxy_scripts/"
    }
}

module.exports = {
    optimization: {
        minimize: false
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
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
                outputPath: '/test_pages/assets/png'
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
    		'dist/*.map',
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
        })
    ].concat(getHTMLPlugins(files)).concat(
        getManifestPlugin("./src/manifest.json", files, [
            {
                path: "options_ui.page",
                file: "options",
                html: true
            },
            {
                path: "background.scripts",
                files: ["bg_script"]
            },
            {
                path: "web_accessible_resources",
                files: ["search_videos"]
            },
        ])
    )

}
