const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './main/pages/main/index.ts',
    nebulaMenu: "./main/pages/nebula-menu/index.ts",
    nebula: './main/pages/nebula/index.ts'
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
      template: './main/pages/main/index.html',
      filename: "index.html",
      chunks: ["index"]
    }),
    new HtmlWebpackPlugin({
      template: './main/pages/nebula-menu/nebula-menu.html',
      filename: "nebula-menu.html",
      chunks: ["nebulaMenu"]
    }),
    new HtmlWebpackPlugin({
      template: './main/pages/nebula/nebula.html',
      filename: "nebula.html",
      chunks: ["nebula"]
    }),
    new HtmlWebpackPlugin({
      template: './main/pages/content-page/content-page.html',
      filename: 'content-page.html',
      chunks: []
    }),
                                                                                                                                                                                                                                   
  ],
  devServer: {
    port: 9000
  }
};
                                                                      