// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    optimization: {
      ...config.optimization,
      minimizer: [
        new TerserPlugin({
          exclude: ['**/node_modules/@web3api/**/*', '**/node_modules/@polywrap/**/*'],
          terserOptions: {
            keep_fnames: true,
            keep_classnames: true,
          },
        }),
      ],
    },
    stats: { warnings: false },
    plugins: [
      ...config.plugins,
      new webpack.LoaderOptionsPlugin({
        options: {
          ignoreWarnings: [/Failed to parse source map/],
        },
      }),
    ],
  }
}
