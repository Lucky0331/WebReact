const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PUBLIC_PATH = "/gzh/";

module.exports = {
    mode: "production",
    entry: ["babel-polyfill", path.resolve(__dirname, "src", "index")],
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: PUBLIC_PATH,
        filename: "dist/[name].[chunkhash:8].js",
        chunkFilename: "dist/[name].[chunkhash:8].chunk.js"
    },
    context: __dirname,
    module: {
        rules: [
            {
                test: /\.js?$/,
                include: path.resolve(__dirname, "src"),
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "postcss-loader"
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
                include: path.resolve(__dirname, "src")
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        "postcss-loader",
                        "less-loader"
                    ]
                }),
                include: path.resolve(__dirname, "src")
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "postcss-loader", {loader: "less-loader", options:{javascriptEnabled: true}}]
                }),
                include: path.resolve(__dirname, "node_modules")
            },
            {
                test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                use: ["file-loader?name=dist/assets/[name].[ext]"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                include: path.resolve(__dirname, "src"),
                use: ["url-loader?limit=8192&name=dist/assets/[name].[ext]"]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify({
                PUBLIC_URL: PUBLIC_PATH.replace(/\/$/, "")
            })
        }),
        new CleanWebpackPlugin(["build"]),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    drop_console: false
                }
            }
        }),
        new ExtractTextPlugin({
            filename: "dist/[name].[chunkhash:8].css",
            allChunks: true
        }),
        new CopyWebpackPlugin([
            { from: "./public/manifest.json", to: "./manifest.json" }
        ]),
        new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: "service-worker.js",
            logger(message) {
                if (message.indexOf("Total precache size is") === 0) {
                    return;
                }
                if (message.indexOf("Skipping static resource") === 0) {
                    return;
                }
            },
            minify: true,
            navigateFallback: PUBLIC_PATH,
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            staticFileGlobsIgnorePatterns: [
                /\.map$/,
                /asset-manifest\.json$/,
                /\.cache$/
            ]
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.ejs",
            templateParameters: {
                dll: "",
                manifest: "<link rel='manifest' href='manifest.json'>"
            },
            hash: false,
            inject: true
        }),

        new FaviconsWebpackPlugin({
            logo: "./public/favicon.png",
            prefix: "icons/",
            icons: {
                appleIcon: true,
                android: false,
                firefox: false,
                appleStartup: false
            }
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".less", ".css", ".scss"],
        alias: {
            '@': path.resolve(__dirname, "src"),
            'react': 'anujs',
            'react-dom':'anujs',
            'prop-types':'anujs/lib/ReactPropTypes'
        }
    }
};
