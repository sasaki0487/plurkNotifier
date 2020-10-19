var conf = require('./key'),
    oauth = require('oauth')
var oa = new oauth.OAuth(
    'https://www.plurk.com/OAuth/request_token',
    'https://www.plurk.com/OAuth/access_token',
    conf.plurk.consumerKey,
    conf.plurk.consumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
)

function callAPI(path, params, callback) {
    oa.post(
        path,
        conf.plurk.oathToken,
        conf.plurk.oathSecret,
        params,
        'application/json',
        callback
    )
}

exports.callAPI = callAPI
