const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
            {
              test: /\.css$/i,
              use: [
				  {loader: 'style-loader', options: {injectType: 'singletonStyleTag'}}
				  , 'css-loader'],
            },
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
	},
	devServer: {
		static: path.join(__dirname, "static"),
		compress: true,
		port: 4000,
	},
    plugins: [new HtmlWebpackPlugin({
		template: './static/index.html',
		filename: 'index.html',
    })],
};
