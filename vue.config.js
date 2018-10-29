module.exports = {
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://dev.weupay.com',
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
  lintOnSave: undefined,
  indexPath: 'admin.html',
  assetsDir: 'admin'
}
