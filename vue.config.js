module.exports = {
  devServer: {
    proxy: {
      '/admin': {
        target: 'http://192.168.2.18:8080',
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
  assetsDir: './'
}
