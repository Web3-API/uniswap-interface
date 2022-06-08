// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true,
            keep_classnames: true,
          },
        }),
      ],
    },
  }
}
