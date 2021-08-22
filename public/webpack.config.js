const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {

    entry: {
        app: './index.js',
    },
    
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
    },

    mode: 'development',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/present-env'],
                    },
                },
            },
        ],

    },
    plugins: [
        new WebpackPwaManifest({
            fingerprints: 'false',
            name: 'Budget app',
            short_name: 'Budget',
            description: ''
        })
    ]
}