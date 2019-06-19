const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const MultiEntryPlugin = require("webpack/lib/MultiEntryPlugin");

module.exports = class WebExtensionManager {
    // Define `apply` as its prototype method which is supplied with compiler as its argument

    constructor(options) {
        options = options || {};
        this.filesPath = options["filesPath"] || "./webpack.files.json";
        this.manifestPath = options["manifestPath"] || "./src/manifest.json";
        this.manifestVars = options["manifestVars"] || {};
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
        function getVarRegex(name) {
            return new RegExp("\\${"+name+"}\\$", "g");
        }
        return new ManifestPlugin({
            fileName: "manifest.json",
            generate: () => {
                let str = JSON.stringify(manifest);
                for(let key in files) {
                    let file = files[key];
                    let distDir = file.distDir || file.srcDir;
                    let ext = file.isHTML ? ".html" : ".js";
                    let regexp = getVarRegex(key);
                    let fileURL = distDir+key+ext;
                    str = str.replace(regexp, fileURL);
                }
                for(let name in this.manifestVars) {
                    console.log(name);
                    let regexp = getVarRegex(name);
                    str = str.replace(regexp, this.manifestVars[name]);
                }
                return JSON.parse(str);
            }
        });
    }
    getPlugins(files, manifest) {
        return [
            new CleanWebpackPlugin([
                'dist/'
            ]),
            new CopyPlugin([{ from: "src/public/", to: "" }])
        ].concat(this.getHTMLPlugins(files).concat(this.getManifestPlugin(manifest, files)));
    }
}
