const fs = require("fs");

module.exports = function override(config, env) {
  config.optimization.minimize = false;

  const minimizer = config.optimization.minimizer;

  minimizer[0].options.terserOptions.mangle = undefined;
  minimizer[0].options.terserOptions.keep_classnames = true;
  minimizer[0].options.terserOptions.keep_fnames = true;

  const plugins = config.plugins;

  plugins[0].options.minify.minifyJS = false;

  fs.writeFileSync(__dirname + "/config-after.json", JSON.stringify(config, null, 2));

  return config;
};
