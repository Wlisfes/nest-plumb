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
        port: 4080,
        open: true
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = '流程图'
            return args
        })
    }
}
