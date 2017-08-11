var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

require('dotenv').config();

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var client = require('twilio')(accountSid, authToken);

var port = 3000;
var debug = true;

app.use(morgan('combined'));

app.use(express.static('public'));

app.use(bodyParser.text({ type: 'text/html' }));

var xmlParser = bodyParser.text({ type: 'text/xml' });
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/play', xmlParser, function (req, res) {
	res.sendFile(path.join(__dirname + '/public/assets/voice.xml'));
});

app.post('/call', urlencodedParser, function(req, res) {

	if( req.body && req.body.from && req.body.to ) {

		var fromNumber = req.body.from;
		var toNumber = req.body.to;

		client.calls.create({
			url: 'https://app-gemidao.wedeploy.io/play',
			from: '+55' + fromNumber,
			to: '+55' + toNumber
		}, function(err, call) {

			res.json({
				success: true, 
				message: 'Sua mensagem foi enviada com sucesso!'
			});

		});

	} else {
		res.json({
			success: false, 
			message: 'Você deve preencher os dois campos.'
		});
	}

});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
