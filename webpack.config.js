const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const libraryTarget = process.env.LIBRARY_TARGET;
const library = process.env.LIBRARY;
const target = process.env.TARGET;
const entry = `${__dirname}/${process.env.ENTRY}`;
const filename = process.env.FILENAME;
const plugins = [];

const banner = `
try {
  require("source-map-support").install();
} catch (error) {
  // noop
}
`;

if (target === "node") {
  plugins.push(
    new webpack.BannerPlugin({
      banner,
      raw: true,
      entryOnly: false
    })
  );
}

module.exports = {
  entry: entry,
  devtool: "source-map",
  target: target,
  mode: "production",

  node: {
    Buffer: false
  },

  output: {
    path: `${__dirname}/dist/`,
    filename: `${filename}.js`,
    library: library,
    libraryTarget: libraryTarget
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        include: [`${__dirname}/src/`],
      }
    ]
  },

  plugins: plugins
};
