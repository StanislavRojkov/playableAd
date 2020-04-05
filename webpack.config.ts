const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin =require('html-webpack-plugin');
// const CleanWebPackPlugin =require('clean-webpack-plugin');

module.exports = {
    entry: { main: ['@babel/polyfill', './src/index.js'] },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '',
    },
    devtool: 'inline-source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [ '.webpack.js', '.ts', '.tsx', '.js', '.json' ],
    },
    plugins: [
        // new CleanWebPackPlugin(['dist/*.*']),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'MRS-fieldlog',
            inject: false,
            hash: true,
            template: './src/index.ejs',
            filename: 'index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader',
                    }, {
                        loader : 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                            modules: true,
                            localIdentName: '[local]__[hash:base64:5]',
                        },
                    }, {
                        loader : 'sass-loader',
                        options: {
                            sourceMap: true,
                            includePaths: [
                                path.resolve(__dirname, './node_modules'),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
                include: /flexboxgrid/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        },
                    },
                ],
                exclude: [ /\.(html|css|js|jsx|json|scss)$/ ],
            },
        ],
    },
    devServer: {
        port: 9010,
        hot: true,
        contentBase: './dist',
        historyApiFallback: true,
    },
};
