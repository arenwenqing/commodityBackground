const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/mini',
    createProxyMiddleware({
      target: 'https://tuanzhzh.com',
      changeOrigin: true,
    })
  );
}
