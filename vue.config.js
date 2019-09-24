module.exports = {
  devServer: {
    proxy: {
      '/admin': {
        target: 'https://devpay.wandingkeji.cn',
        ws: true,
        changeOrigin: true
      },
      '/btp': {
        target: 'http://2x8g9y.natappfree.cc',
        ws: true,
        changeOrigin: true
      },
    }
  },
  baseUrl: '',
  outputDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,
  lintOnSave: false,
  indexPath: 'admin.html',
  assetsDir: './'
}
