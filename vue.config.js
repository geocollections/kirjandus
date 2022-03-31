// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

const webpack = require("webpack");
module.exports = {
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin({
      //   analyzerPort: "auto"
      // }),
      new webpack.ProvidePlugin({
        process: "process/browser"
      })
    ],
    resolve: {
      fallback: {
        os: require.resolve("os-browserify/browser")
      }
    },
    externals: {
      moment: "moment"
    }
  },
  transpileDependencies: ["vuetify"]
};
