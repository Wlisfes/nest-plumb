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
        open: true,
        proxy: {
            [`/api`]: {
                target: 'http://localhost:3081',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    [`^/api`]: ''
                }
            }
        }
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = '流程图'
            return args
        })
    }
}
