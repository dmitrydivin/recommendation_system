//https://jsramblings.com/creating-a-react-app-with-webpack/
//https://dev.to/sanamumtaz/webpack-dev-server-setting-up-proxy-59bk
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        publicPath: '/static/',
        path: path.resolve(__dirname, "build"),
        clean: {
            dry: true, // Log the assets that should be removed instead of deleting them.
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "build"),
        },
        port: 3000,
        hot: true,
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
    ],
    module: {
        // exclude node_modules
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
    // pass all js files through Babel
    resolve: {
        extensions: ["*", ".js"],
    }
};