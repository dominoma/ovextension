const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin')

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
        library: './src/page_scripts/library.ts',
        options: './src/page_scripts/options.ts',
        popupmenu: './src/page_scripts/popupmenu.ts',
        videoplay: './src/page_scripts/videoplay.ts',
        videopopup: './src/page_scripts/videopopup.ts',
        videosearch: './src/page_scripts/videosearch.ts',

        bg_script: './src/background_scripts/bg_script.ts',

        document_start: './src/content_scripts/document_start.ts',
        document_idle: './src/content_scripts/document_idle.ts',
        document_end: './src/content_scripts/document_end.ts',
        top_window: './src/content_scripts/top_window.ts',

        search_videos: './src/inject_scripts/search_videos.ts',

        pac_firefox: './src/proxy_scripts/pac_firefox.ts'



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
    plugins: [new FileManagerPlugin({
        onEnd: [{
                move: [{
                        source: './dist/library.js',
                        destination: './dist/pages/library/library.js'
                    }, {
                        source: './dist/options.js',
                        destination: './dist/pages/options/options.js'
                    }, {
                        source: './dist/popupmenu.js',
                        destination: './dist/pages/popupmenu/popupmenu.js'
                    }, {
                        source: './dist/videoplay.js',
                        destination: './dist/pages/videoplay/videoplay.js'
                    }, {
                        source: './dist/videopopup.js',
                        destination: './dist/pages/videopopup/videopopup.js'
                    }, {
                        source: './dist/videosearch.js',
                        destination: './dist/pages/videosearch/videosearch.js'
                    },

                    {
                        source: './dist/bg_script.js',
                        destination: './dist/background_scripts/bg_script.js'
                    },

                    {
                        source: './dist/document_start.js',
                        destination: './dist/content_scripts/document_start.js'
                    }, {
                        source: './dist/document_idle.js',
                        destination: './dist/content_scripts/document_idle.js'
                    }, {
                        source: './dist/document_end.js',
                        destination: './dist/content_scripts/document_end.js'
                    }, {
                        source: './dist/top_window.js',
                        destination: './dist/content_scripts/top_window.js'
                    },

                    {
                        source: './dist/search_videos.js',
                        destination: './dist/inject_scripts/search_videos.js'
                    },

                    {
                        source: './dist/pac_firefox.js',
                        destination: './dist/proxy_scripts/pac_firefox.js'
                    }
                ]
            },
            {
                move: [{
                        source: './dist/library.js.map',
                        destination: './dist/pages/library/library.js.map'
                    }, {
                        source: './dist/options.js.map',
                        destination: './dist/pages/options/options.js.map'
                    }, {
                        source: './dist/popupmenu.js.map',
                        destination: './dist/pages/popupmenu/popupmenu.js.map'
                    }, {
                        source: './dist/videoplay.js.map',
                        destination: './dist/pages/videoplay/videoplay.js.map'
                    }, {
                        source: './dist/videopopup.js.map',
                        destination: './dist/pages/videopopup/videopopup.js.map'
                    }, {
                        source: './dist/videosearch.js.map',
                        destination: './dist/pages/videosearch/videosearch.js.map'
                    },

                    {
                        source: './dist/bg_script.js.map',
                        destination: './dist/background_scripts/bg_script.js.map'
                    },

                    {
                        source: './dist/document_start.js.map',
                        destination: './dist/content_scripts/document_start.js.map'
                    }, {
                        source: './dist/document_idle.js.map',
                        destination: './dist/content_scripts/document_idle.js.map'
                    }, {
                        source: './dist/document_end.js.map',
                        destination: './dist/content_scripts/document_end.js.map'
                    }, {
                        source: './dist/top_window.js.map',
                        destination: './dist/content_scripts/top_window.js.map'
                    },

                    {
                        source: './dist/search_videos.js.map',
                        destination: './dist/inject_scripts/search_videos.js.map'
                    },

                    {
                        source: './dist/pac_firefox.js.map',
                        destination: './dist/proxy_scripts/pac_firefox.js.map'
                    }
                ]
            }
        ]
    })]

}