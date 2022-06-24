'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
var prodEnv = require('./prod.env') // 打包
var devEnv = require('./dev.env') // 开发

// 添加自定义的环境名称,在config.js配置文件中使用
// console.info('argv',process.argv)
// console.info('env',process.env.NODE_ENV)
if(process && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {  // 区分是开发环境还是生产环境(通过build执行的)
  if (process.argv && process.argv.length > 2) {
    // dev / product
    prodEnv.CODE_ENV = '"' + process.argv[2] + '"'
    devEnv.CODE_ENV = '"' + process.argv[2] + '"'
  } else {
    prodEnv.CODE_ENV = '"dev"'
    devEnv.CODE_ENV = '"dev"'
  }
}else {
  devEnv.CODE_ENV = '"dev"'
}

module.exports = {
  dev: {
    env: devEnv,
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // proxyTable: {
    //   '/':{
    //     target: 'http://localhost:8001',
    //     // ws: true,
    //     changeOrigin: true,
    //     // pathRewrite: {
    //     //   '^/api': ''
    //     // }
    //   }
    // },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
    BASE_URL: '/static/'
  },

  build: {
    env: prodEnv,
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    BASE_URL: '/'
  }
}
