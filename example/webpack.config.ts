import { Configuration, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { join } from "path";

export default {
  context: __dirname,
  entry: {
    index: [join(__dirname, "/index.tsx")],
  },
  devtool: "cheap-module-source-map",
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(ts|js)x?$/,
        use: {
          loader: "babel-loader",
          options: {
            env: {
              development: {
                compact: false,
              },
              production: {
                compact: "auto",
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: join(__dirname, "/index.html"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
} as Configuration;
