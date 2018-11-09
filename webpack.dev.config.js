const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require("happypack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const PUBLIC_PATH = "/";
module.exports = {
    mode: "development",
    entry: [
        "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr",
        "babel-polyfill",
        "./src/index.js",
        "./dll/vendor.dll.js"
    ],
    output: {
        path: "/",
        publicPath: PUBLIC_PATH,
        filename: "bundle.js"
    },
    devtool: "inline-source-map",
    context: __dirname,
    module: {
        rules: [
            {
                test: /\.js?$/,
                enforce: "pre",
                use: ["eslint-loader"],
                include: path.resolve(__dirname, "src")
            },
            {
                // .js .jsx用babel解析
                test: /\.js?$/,
                use: ["happypack/loader"],
                include: path.resolve(__dirname, "src")
            },
            {
                // .css 解析
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                // .scss
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
                include: path.resolve(__dirname, "src")
            },
            {
                // .less 解析 (用于解析antd的LESS文件)
                test: /\.less$/,
                use: ["style-loader", "css-loader", "postcss-loader", {loader: "less-loader", options:{javascriptEnabled: true}}],
                include: path.resolve(__dirname, "node_modules")
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "less-loader"
                ],
                include: path.resolve(__dirname, "src")
            },
            {
                test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                use: ["file-loader?name=assets/[name].[ext]"]
            },
            {
                test: /\.(png|jpg|gif)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                use: ["url-loader?limit=8192&name=assets/[name].[ext]"]
            },
            {
                test: /\.(csv|tsv)$/,
                use: ["csv-loader"]
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify({
                PUBLIC_URL: PUBLIC_PATH
            })
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./dll/vendor-manifest.json")
        }),
        new HappyPack({
            loaders: ["babel-loader"]
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            favicon: "./public/favicon.png",
            template: "./public/index.ejs",
            inject: true,
            templateParameters: {
                dll: "<script src='/vendor.dll.js'></script>",
                manifest: ""
            }
        }),
        new FaviconsWebpackPlugin({
            logo: "./public/favicon.png",
            prefix: "icons/",
            icons: {
                android: false,
                firefox: false,
                appleStartup: false
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: [".js", ".jsx", ".less", ".css", ".scss"],
        alias: {
            '@': path.resolve(__dirname, "src"),
        }
    }
};
