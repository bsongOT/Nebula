const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './frontend/index.ts'
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      "@": path.resolve(__dirname, "./engine/")
    }
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins : [
    new HtmlWebpackPlugin({
      template: './frontend/index.html',
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: './frontend/workspace-select.html',
      filename: "workspace-select.html",
      chunks: []
    })                                                                                                                                                               
  ],
  devServer: {
    port: 9000
  }
};
                                                                      