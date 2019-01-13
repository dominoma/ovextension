const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    optimization: {
        minimize: false // <---- disables uglify.

    },
    stats: 'errors-only',
    mode: 'none',
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
        }]
    },
    entry: {
        'pages/library/library': './src/page_scripts/library.ts',
        'pages/options/options': './src/page_scripts/options.ts',
        'pages/popupmenu/popupmenu': './src/page_scripts/popupmenu.ts',
        'pages/videoplay/videoplay': './src/page_scripts/videoplay.ts',
        'pages/videopopup/videopopup': './src/page_scripts/videopopup.ts',
        'pages/videosearch/videosearch': './src/page_scripts/videosearch.ts',

        'background_scripts/bg_script': './src/background_scripts/bg_script.ts',

        'content_scripts/document_start': './src/content_scripts/document_start.ts',
        'content_scripts/document_idle': './src/content_scripts/document_idle.ts',
        'content_scripts/document_end': './src/content_scripts/document_end.ts',
        'content_scripts/top_window': './src/content_scripts/top_window.ts',

        'inject_scripts/search_videos': './src/inject_scripts/search_videos.ts',

        'proxy_scripts/pac_firefox': './src/proxy_scripts/pac_firefox.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {


        modules: [
            path.resolve('node_modules'),
            path.resolve('./src/modules'),
            "node_modules"
        ],

        extensions: [
            '.ts',
            '.js',
            '.d.ts'
        ]


    },
    plugins: [
    	new CleanWebpackPlugin([
    		'dist/*.map',
    		'dist/*.js', 
    		'dist/pages/**/*.js', 
    		'dist/background_scripts/**/*.js',
    		'dist/content_scripts/**/*.js',
    		'dist/inject_scripts/**/*.js',
    		'dist/proxy_scripts/**/*.js'
    	])
    ]

}