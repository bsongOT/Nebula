const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './main/pages/main/index.ts',
    nebulaMenu: "./main/pages/nebula-menu/index.ts",
    content: './main/pages/content-page/index.ts',
    data: "./main/pages/_develop/data.ts"
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
      template: './main/pages/content-page/content-page.html',
      filename: 'content-page.html',
      chunks: ["content"]
    }),
    new HtmlWebpackPlugin({
      template: './main/pages/_develop/data.html',
      filename: 'data.html',
      chunks: ["data"]
    })                                                                                                                                                                                            
  ],
  devServer: {
    port: 9000
  }
};
                                                                      