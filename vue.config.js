module.exports = {
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://dev.weupay.com',
        ws: true,
        changeOrigin: true
      },
      '/download': {
        target: 'http://test.weupay.com:8080',
        ws: true,
        changeOrigin: true
      }
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
  assetsDir: 'admin'
}
