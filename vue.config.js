const path = require('path')

module.exports = {
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.join(__dirname, 'src')
            }
        }
    },
    devServer: {
        port: 3080,
        open: true
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = 'js-plumb'
            return args
        })
    }
}
