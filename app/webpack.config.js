const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack !',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpe?g|gif|webp)$/i,
                type: 'asset/resource',
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        host: '0.0.0.0',     // permet l’accès depuis l’extérieur du container
        port: 8001,
        hot: true,           // active hot reload
        watchFiles: ['src/**/*'], // surveille tous les fichiers sources
        client: {
            overlay: true,   // affiche les erreurs directement sur le navigateur
        },
    },
    watchOptions: {
        poll: 1000,          // vérifie les fichiers toutes les 1000ms
        aggregateTimeout: 300,
        ignored: /node_modules/,
    },
};