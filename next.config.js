const webpack = require("webpack");

// if .env is in root, then no need to declare path
const { parsed: myEnv } = require("dotenv").config({
  debug: process.env.DEBUG,
});

module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,

    webpack: (config) => {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          path: false,
          os: false,
          net: false,
        },
      };
      config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
      return config;
    },
  };
};
