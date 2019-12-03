module.exports = {
  devServer: {
    proxy: {
      '/admin': {
        target: 'https://devpay.wandingkeji.cn',
        ws: true,
        changeOrigin: true
      },
      '/pay': {
        target: 'https://devpay.wandingkeji.cn',
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
  assetsDir: './admin'
}
