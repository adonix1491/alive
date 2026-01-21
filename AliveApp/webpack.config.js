const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname);
const babelLoaderConfiguration = {
    test: /\.(js|jsx|ts|tsx)$/,
    include: [
        path.resolve(appDirectory, 'index.web.js'),
        path.resolve(appDirectory, 'App.tsx'),
        path.resolve(appDirectory, 'src'),
        path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    ],
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            presets: [
                ['@babel/preset-env', { targets: "defaults" }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
            ],
            plugins: [
                'react-native-web',
            ],
        },
    },
};

const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: 'url-loader',
        options: {
            name: '[name].[ext]',
            esModule: false,
        },
    },
};

module.exports = {
    entry: path.resolve(appDirectory, 'index.web.js'),
    output: {
        path: path.resolve(appDirectory, 'dist'),
        publicPath: '/',
        filename: 'bundle.web.js',
    },
    module: {
        rules: [babelLoaderConfiguration, imageLoaderConfiguration],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(appDirectory, 'public/index.html'),
        }),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true),
        }),
    ],
    resolve: {
        alias: {
            'react-native': 'react-native-web',  // 移除 $ 以匹配所有子路徑
        },
        extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js', '.jsx', '.json'],
        fullySpecified: false,
    },
    devServer: {
        static: {
            directory: path.join(appDirectory, 'public'),
        },
        historyApiFallback: true,
        hot: true,
        port: 3000,
    },
};
