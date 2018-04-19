const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const EnvConfig = require('./marathon.config')

module.exports = function(env){
    const WebpackConfig = require(`./webpack.${env}.config.js`);
    const EnvData = EnvConfig[env]

    return Merge(WebpackConfig,{
        entry: {
            index: './src/index.js',
            common: './src/common.js',
            list: './src/list.js',
            content: './src/content.js',
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader','less-loader']
                    })
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: 'url-loader?limit=8192&name=images/[name].[hash].[ext]'
                }
            ]
        },
        plugins:[
            new webpack.DefinePlugin({
                'title':JSON.stringify(EnvData.title)
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../index.html'),
                filename:'index.html',
                chunks:['common','index']
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../content.html'),
                filename:'content.html',
                chunks:['common','content']
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../list.html'),
                filename:'list.html',
                chunks:['common','list']
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, '../src/commonpage/header.html'),
                filename:'header.html',
                chunks:['common']
            }),
            new ExtractTextPlugin({ filename: "marathon.css", allChunks: true }) //编译生成bootstrap.css
        ]
    });
}