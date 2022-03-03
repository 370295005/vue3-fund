module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/FundMApi': {
        target: 'https://fundmobapi.eastmoney.com',
        changeOrigin: true
      },
      '/FundSearch': {
        target: 'https://fundsuggest.eastmoney.com',
        changeOrigin: true
      },
      '/FundMNewApi': {
        target: 'https://fundmobapi.eastmoney.com',
        changeOrigin: true
      }
    }
  }
}
