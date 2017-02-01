var webpack = require('webpack');
var path = require('path');
var PACKAGE = require('./package.json');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackPlugins = [];
var webpackOutput;
var cssPath;
var fontPath;

if (process.env.NODE_ENV === 'dev') {
    // output
    webpackOutput = {
        filename: PACKAGE.name + '.js',
        path: path.resolve(__dirname, 'public/tmp')
    };
    // css path
    cssPath = PACKAGE.name + '.css';
} else {
    // output
    webpackOutput = {
        filename: PACKAGE.name + '.' + PACKAGE.version + '.min.js',
        path: path.resolve(__dirname, 'public/js')
    };
    // css path
    cssPath = '../css/' + PACKAGE.name + '.' + PACKAGE.version + '.min.css';
    // uglify
    webpackPlugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true
    }));
}

webpackPlugins.push(new ExtractTextPlugin(cssPath));

module.exports = {
    entry: [
        './src/index.js'
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            include: __dirname + '/src',
            loader: 'babel-loader'
        }, {
            test: /\.less|.css$/,
            include: __dirname,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        }, {
            test: /\.hbs$/,
            loader: "handlebars-loader"
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file?name=../fonts/[hash].[ext]'
        }]
    },
    output: webpackOutput,
    plugins: webpackPlugins
}
