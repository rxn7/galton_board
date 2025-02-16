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
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(ogg|mp3)$/i,
				include: path.resolve(__dirname, 'src/assets/audio'),
				type: 'asset/resource',
				generator: {
					filename: 'assets/audio/[name][ext]',
				}
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'build'),
		assetModuleFilename: "assets/[name][ext]"
	},
	devServer: {
		static: path.join(__dirname, "static"),
		compress: true,
		port: 4000,
	},
    plugins: [new HtmlWebpackPlugin({
		template: './src/index.html',
		filename: 'index.html',
		chunks: ['index'],
    })],
};
