const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	entry: {
		'map-builder-canvas.production.min': './entry.js'
	},
	output: {
		path: path.resolve(__dirname, 'lib'),
		library: 'map-builder-canvas',
		libraryTarget: 'commonjs2',
		filename: '[name].js',
		publicPath: './lib/'
	},
	resolve: {
		extensions: ['.js', '.ts', '.tsx', '.css', '.scss']
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [autoprefixer()]
							}
						}
					},
					'sass-loader'
				]
			},
			{
				test: /\.(ts|tsx|js|jsx|mjs)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
							configFile: path.resolve(__dirname, './tsconfig.prod.json')
						}
					},
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								['@babel/preset-react', { runtime: 'automatic' }],
								'@babel/preset-typescript'
							],
							plugins: ['transform-class-properties', '@babel/plugin-transform-runtime']
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				type: 'asset/resource'
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				test: /\.js($|\?)/i
			})
		],
		splitChunks: {
			chunks: 'async',
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor'
				}
			}
		}
	},
	plugins: [
		...(process.env.ANALYZER === 'true' ? [new BundleAnalyzerPlugin()] : []),
		new webpack.DefinePlugin({
			'process.env': 'production'
		})
	],
	externals: {
		react: {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		},
		'react-dom': {
			root: 'ReactDOM',
			commonjs2: 'react-dom',
			commonjs: 'react-dom',
			amd: 'react-dom'
		}
	}
};
