module.exports = {
  devServer: {
    proxy: {
      '/server': {
        target: 'https://39.107.89.217:443',
        pathRewrite: { '^/server': '/server' }
        // 本地服务
        // target: 'http://localhost:6080',
        // pathRewrite: { '^/server': '' }
      }
    }
  }
}
