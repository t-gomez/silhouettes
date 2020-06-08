const webpack = require("webpack");
const path = require("path");
const ThreeWebpackPlugin = require('@wildpeaks/three-webpack-plugin');

// http://webpack.github.io/docs/configuration.html
module.exports = {
	entry:{
		main: "./src/App.ts",
	},

	// Outputs compiled bundle to `./web/js/main.js`
	output:{
		path: __dirname + "/web/",
		filename: "js/[name].js"
	},

	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],

		// Shortcuts to avoid up-one-level hell: 
		// Turns "../../../utils" into "Utils"
		alias: {
			'@utils': path.resolve(__dirname, "./src/utils/"),
			'GLTFLoader': path.resolve(__dirname, "./node_modules/three/examples/jsm/loaders/GLTFLoader"),
			'OBJLoader': path.resolve(__dirname, "./node_modules/three/examples/jsm/loaders/OBJLoader"),
			'OrbitControls': path.resolve(__dirname, "./node_modules/three/examples/jsm/controls/OrbitControls")
		},
	},

	module:{
		// Test file extension to run loader
		rules: [
			{
				test: /\.(glsl|vs|fs)$/, 
				loader: "ts-shader-loader"
			},
			{
				test: /\.tsx?$/, 
				exclude: [/node_modules/, /tsOld/],
				loader: "ts-loader"
			}
		]
	},

	// Enables dev server to be accessed by computers in local network
	devServer: {
		host: "localhost",
		port: 8000,
		publicPath: "/web/",
		disableHostCheck: true,
		open: true,
		openPage: "/web"
	},
	plugins: [
        //...
        new ThreeWebpackPlugin()
    ]
}