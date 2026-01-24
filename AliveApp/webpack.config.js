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
        path.resolve(appDirectory, 'node_modules/react-native-screens'),
        path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
        path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
        path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
        path.resolve(appDirectory, 'node_modules/react-native-worklets'),
        path.resolve(appDirectory, 'node_modules/@react-navigation'),
        // Handle hoisted modules in monorepo
        path.resolve(appDirectory, '../node_modules/react-native-screens'),
        path.resolve(appDirectory, '../node_modules/react-native-safe-area-context'),
        path.resolve(appDirectory, '../node_modules/@react-navigation'),
    ],
    use: {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            sourceType: "unambiguous",
            presets: [
                ['@babel/preset-env', { targets: "defaults" }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
            ],
            plugins: [
                ['@babel/plugin-transform-runtime', {
                    helpers: true,
                    regenerator: true
                }],
                'react-native-web',
                'react-native-reanimated/plugin',
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
    devtool: 'source-map',
    entry: path.resolve(appDirectory, 'index.web.js'),
    output: {
        path: path.resolve(appDirectory, 'dist'),
        publicPath: '/',
        filename: 'bundle.web.[contenthash].js',
    },
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            babelLoaderConfiguration,
            imageLoaderConfiguration,
            // 修正 webpack 5 ES 模塊導入問題
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
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
            'react-native': 'react-native-web',
            '@react-navigation/stack': path.resolve(appDirectory, 'node_modules/@react-navigation/stack/src/index.tsx'),
        },
        extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js', '.jsx', '.json'],
    },
    devServer: {
        static: {
            directory: path.join(appDirectory, 'public'),
        },
        historyApiFallback: true,
        hot: true,
        port: 3000,
        proxy: [
            {
                context: ['/api'],
                target: 'https://alive-iota.vercel.app',
                changeOrigin: true,
                secure: true,
            },
        ],
    },
};
