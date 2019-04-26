const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");

module.exports = class WebExtensionManager {
    // Define `apply` as its prototype method which is supplied with compiler as its argument

    constructor(options) {
        options = options || {};
        this.filesPath = options["filesPath"] || "./webpack.files.json";
        this.manifestPath = options["manifestPath"] || "./src/manifest.json";
    }

    apply(compiler) {
        const files = require(this.filesPath);
        const manifest = require(this.manifestPath);
        compiler.options.entry = this.getEntries(files);
        for(let plugin of this.getPlugins(files, manifest)) {
            plugin.apply(compiler);
        }
    }
    getEntries(files) {
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
    getHTMLPlugins(files) {
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
    getManifestPlugin(manifest, files) {
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
    getPlugins(files, manifest) {
        return this.getHTMLPlugins(files).concat(this.getManifestPlugin(manifest, files));
    }
}
