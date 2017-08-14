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

var port = process.env.DEV_PORT || 80;

// try {
// 	client.calls.create({
// 			url: 'https://app-pai.wedeploy.io/play',
// 			from: '+553340421419',
// 			to: '+5521995740115'
// 		})
// 		.then( (call) => console.log(call) );	
// } catch(e) {
// 	console.log(e);	
// }

app.use(morgan('combined'));

app.use(express.static('public'));

app.use(bodyParser.text({ type: 'text/html' }));

var xmlParser = bodyParser.text({ type: 'text/xml' });
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/play', xmlParser, function (req, res) {
	res.sendFile(path.join(__dirname + '/public/assets/xml/voice.xml'));
});

app.post('/call', urlencodedParser, function(req, res) {

	if( accountSid == '' || authToken == '' ) {
		res.json({
			success: false, 
			message: 'Esta é uma versão de testes.<br />Vá para <a href="https://github.com/castroalves/gemidao-do-zap-twilio">https://github.com/castroalves</a> e saiba mais.'
		});
	} else {

		if( req.body && req.body.to ) {

			// var fromNumber = req.body.from;
			var toNumber = req.body.to;

			client.calls.create({
				url: 'https://app-pai.wedeploy.io/play',
				from: '+553340421419',
				to: '+55' + toNumber
			}, function(err, call) {

				if( call.sid ) {
					res.json({
						success: true, 
						message: 'Sua mensagem foi enviada com sucesso! Feliz Dia dos Pais!'
					});	
				} else {
					res.json({
						success: false, 
						message: 'Houve um erro ao tentar enviar sua mensagem. Tente novamente.'
					});	
				}

			});

		} else {
			res.json({
				success: false, 
				message: 'Você deve informar um número de telefone válido.'
			});
		}

	}

});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
