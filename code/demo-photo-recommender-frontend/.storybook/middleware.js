const {createProxyMiddleware} = require('http-proxy-middleware')

//https://github.com/storybookjs/storybook/issues/208
module.exports = function expressMiddleware (router) {
    router.use('/api', createProxyMiddleware({
        target: 'http://localhost:8080',
        changeOrigin: true
    }));
}