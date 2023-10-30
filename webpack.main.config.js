module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  target: 'electron-main',
  resolve: {
    //fix: added to resolve issue with node-auth0 v2.36.2
    alias: {
      formidable: false, //  node-auth0 build warning
      'coffee-script': false, //  node-auth0 build fail
      vm2: false, // node-auth0 build fail
      yargs: false, // auth0-deploy-cli build warning
      colors: false, // auth0-deploy-cli build warning
      keyv: false, // openid-client build warning
    },
  },
};
