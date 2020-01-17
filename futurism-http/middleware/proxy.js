'use strict';

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var parseUrl = require('url').parse;

module.exports = function(targetUri, forceHost) {

    var parsed = parseUrl(targetUri);
    var host = forceHost || parsed.host;
    var secure = parsed.protocol === 'https:';

    return function(req, res, next) {
        req.headers.host = host;
        proxy.web(req, res, {target: targetUri, secure: secure, xfwd: true});
    }
};