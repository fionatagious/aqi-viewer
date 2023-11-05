/** @type {import('jest').Config} */

module.exports = async () => {
  return {
    verbose: true,
    moduleNameMapper: {
      "^axios$": require.resolve("axios"),
    },
  };
};
