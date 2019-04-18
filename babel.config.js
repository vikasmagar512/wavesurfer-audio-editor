
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [

    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        // "@babel/plugin-transform-runtime"
    ]
  }
};
