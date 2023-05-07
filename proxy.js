const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'https://api.iwtxconnect.com/api/v1/',
  changeOrigin: true,
});

export default (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  proxy.web(req, res);
};