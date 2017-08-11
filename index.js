var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// var accountSid = '';
// var authToken = '';
// var client = require('twilio')(accountSid, authToken);

var port = 8080;

// Total Voice API Settings
var totalVoiceApi = 'https://api.totalvoice.com.br/composto';
var totalVoiceAuthToken = '';

app.use(morgan('combined'));

app.use(express.static('public'));

app.use(bodyParser.text({ type: 'text/html' }));

var xmlParser = bodyParser.text({ type: 'text/xml' });
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/call', urlencodedParser, function (req, res) {

	if( ! req.body ) return res.sendStatus(400);

	var options = {
		url: totalVoiceApi,
		headers: {
			'Access-Token': totalVoiceAuthToken,
			// 'Accept': 'application/json'
		},
		form: {
			numero_destino: req.body.to,
			dados: [
				{
					acao: 'audio',
					acao_dados: {
						url_audio: 'https://github.com/castroalves/gemidao-do-zap-twilio/blob/master/public/assets/gemidao.mp3?raw=true'
					}
				}
			],
			bina: req.body.from
		},
		json: true
	};

	request.post(options, function(error, response, body) {
		if( ! error && response.statusCode == 200 ) {
			// res.json( JSON.parse( body ) );
			res.end('Mensagem enviada com sucesso!');
		} else {
			res.end('Erro ao enviar a mensagem!');
		}
	});

});

app.post('/play', xmlParser, function (req, res) {
	res.sendFile(path.join(__dirname + '/public/assets/voice.xml'));
});

// 21964011605

// 21999123549

// app.post('/call', urlencodedParser, function(req, res) {

// 	var fromNumber = req.body.from;
// 	var toNumber = req.body.to;

// 	client.calls.create({
// 		url: 'https://app-gemidao.wedeploy.io/play',
// 		from: '+55' + fromNumber,
// 		to: '+55' + toNumber
// 	}, function(err, call) {

// 		if( call.sid ) {
// 			res.send('Mensagem enviada com sucesso!');
// 		} else {
// 			res.send('Houve um erro ao enviar a mensagem!');
// 		}

// 		res.status(200).end();

// 		console.log(err);
// 		console.log(call);
// 	});

// });

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
