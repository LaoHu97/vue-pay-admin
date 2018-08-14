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

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: true,
  productionSourceMap: false,
  parallel: undefined,
  css: undefined,
  lintOnSave: false
}
