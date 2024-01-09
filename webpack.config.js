const path = require('path');

module.exports = {
  // ... (existing webpack configuration)

  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      os: require.resolve('os-browserify/browser'),
      querystring: require.resolve('querystring-es3'),
      timers: require.resolve('timers-browserify'),
      path: require.resolve('path-browserify'),
    },
  },

  // ... (rest of the webpack configuration)
};
