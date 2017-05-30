var https = require('https')
var config = require('./config.js')
var token = config.token

exports.sendText = function(id, message) {
    var options = {
        host: 'api.line.me',
        port: 443,
        path: '/v2/bot/message/push',
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    var req = https.request(options, function(res) {
        res.setEncoding('utf8')
        res.on('data', function(chunk) {
            console.log(chunk)
        })
    })
    var postData = JSON.stringify({
        'to': id,
        'messages': [
            {
                'type': 'text',
                'text': message
            }
        ]
    })
    req.end(postData)
}

exports.queryProfile = function(id, callback) {
    var path = '/v2/bot/profile/' + id
	var options = {
		host: 'api.line.me',
		port: 443,
		path: path,
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + token
		}
	}
	https.get(options, function(res) {
        var response
		res.setEncoding('utf8')
		res.on('data', function(chunk) {
			response = JSON.parse(chunk.toString('utf8'))
            callback(id, response.displayName)
		})
	}).on('error', function(error) {
        console.log(error)
    })
}
