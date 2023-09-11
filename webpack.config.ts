const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './main/pages/main/index.ts',
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
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins : [
    new HtmlWebpackPlugin({
      template: './main/pages/main/index.html',
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      template: './main/pages/nebula/nebula.html',
      filename: "nebula.html"
    })                                                                                                                                                                                                                                 
  ],
  devServer: {
    port: 9000
  }
};
                                                                      