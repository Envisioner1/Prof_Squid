var HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

var path = require('path');
module.exports = {
    cache: false,
    context: __dirname + '/src',
    entry:

        [
            './app.js'
        ],

    output: {
        filename: 'app.js',
        path: __dirname + '/dist',
        publicPath : '/'
    },
    plugins: [


        new HtmlWebpackPlugin({
            template: 'index.template.html',
            inject: 'body'
        }) ,
        new CopyWebpackPlugin([
            { from: 'images', to: 'images' }
        ]),
        new CopyWebpackPlugin([
            { from: 'fonts', to: 'fonts' }
        ]),

    ],

    module: {




        loaders: [

            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015','react']
                }
            },


            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.png$/, loader: 'url-loader?limit=100000'},
            {test: /\.jpg$/, loader: 'file-loader'}
        ]
    }


}


