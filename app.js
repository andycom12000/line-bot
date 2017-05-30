// ExpressJS to build REST API
var express = require('express')
var app = express()

// HTTP and HTTPS server
var https = require('https')
var http = require('http')

// Read cert files, write logs
var fs = require('fs')

// Parse json in body
var bodyparser = require('body-parser')
var multer = require('multer')
var upload = multer()

// Draw output
var chalk = require('chalk')

// Logging
var fsOptions = {
    flags: 'a',
    encoding: null,
    mode: 0644
}
const outStream = fs.createWriteStream('log/line_bot.log', fsOptions)
const errStream = fs.createWriteStream('log/line_bot_error.log', fsOptions)
const myConsole = new console.Console(outStream, errStream)
function myLog(message) {
    console.log(message)
    myConsole.log(message)
}

// MySQL connection

// SSL keys
var privateKey = fs.readFileSync('cert/www.shadow.idv.tw.key', 'utf8')
var certificate = fs.readFileSync('cert/www.shadow.idv.tw.crt', 'utf8')
var cauth = fs.readFileSync('cert/root_bundle.crt', 'utf8')
var credentials = {ca: cauth, key: privateKey, cert: certificate}

// Line API
var line = require('./line_api.js')

var channel = 'Ccfa654b6e1b794f3229e460382935aaf'

// Cron job
var CronJob = require('cron').CronJob
var job = new CronJob('0 0 20 * * *', function() {
    myLog('It is 20:00')
	line.sendText(channel, '晚上八點了，大家記得打退治喔！')
}, null, true, 'Asia/Taipei')

// Send power usage everyday at 6:00
var job = new CronJob('0 0 13 * * *', function() {
    myLog('It is 13:00')
	line.sendText(channel, '下午一點了，大家記得打退治喔！')

}, null, true, 'Asia/Taipei')

/*-----------------------Main functions------------------------------*/
// Parse Webhook event object
function parseBody(input) {
	for (var i = 0 ; i < input.length ; i++) {
		var obj = input[i]
		switch(obj.type) {
			case 'message':
				switch(obj.message.type) {
					case 'text':
						myLog('[' + obj.timestamp + '] ' + chalk.green(obj.source.userId) + chalk.cyan(' said: ') + chalk.blue(obj.message.text))
						break
                    case 'location':
                        myLog('[' + obj.timestamp + '] ' + chalk.green(obj.source.userId) + chalk.cyan(' sent a ') + chalk.blue(obj.message.type))
                        break
					default:
                        myLog('[' + obj.timestamp + '] ' + chalk.green(obj.source.userId) + chalk.cyan(' sent a ') + chalk.blue(obj.message.type))
						break
				}
				break
			case 'follow':
				myLog('[' + obj.timestamp + '] ' + chalk.green(obj.source.userId) + chalk.cyan(' joined the channel'))
				break
			case 'unfollow':
				myLog('[' + obj.timestamp + '] ' + chalk.green(obj.source.userId) + chalk.red(' left the channel'))
				break
			case 'join':
				myLog('[' + obj.timestamp + '] ' + chalk.cyan('Joined ') + chalk.green(obj.source.groupId))
				channel = obj.source.groupId
				line.sendText(channel, '大家好！我是退治報時機器人OwO')
				break
            default:
                myLog('[' + obj.timestamp + '] ' + chalk.green(obj.source.userId) + chalk.cyan(' made a ') + chalk.blue(obj.type) + chalk.cyan(' event'))
		}
	}
}


/* Main body */

// JSON body parser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

// Default route
app.get('/', function (req, res) {
	res.send('Hello World!')
})

// Callback handler
app.post('/', upload.array(), function(req, res) {
	parseBody(req.body.events)
	res.send({status: 'success'})
})

app.post('/send',upload.array(), function(req, res) {
    //myLog(req.body)
    myLog('Send: ' + req.body.message + ', to: ' + req.body.uid)
    line.sendText(req.body.uid, req.body.message)
    res.send({status: 'success'})
})

http.createServer(app).listen(7080, 'www.shadow.idv.tw')
https.createServer(credentials, app).listen(7443, 'www.shadow.idv.tw')
