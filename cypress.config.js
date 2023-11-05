const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      console.log(config); // see everything in here!

      // modify config values
      config.defaultCommandTimeout = 10000;
      config.baseUrl = "http://localhost:3000";

      // modify env var value
      config.env.ENVIRONMENT = "development";

      // IMPORTANT return the updated config object
      return config;
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
