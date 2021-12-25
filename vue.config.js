// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
 module.exports = {
    // options...
    configureWebpack: {
        devtool: 'source-map'
      },
      transpileDependencies: ['@vue/reactivity'],
      publicPath: '/ciq-ui/'

  }
  