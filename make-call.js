var accountSid = 'AC5f2391649a6b0d4c7819a336efb47041';
var authToken = '46ab3eb0b47adc2d4357981557dd9c3d';
var client = require('twilio')(accountSid, authToken);

const VoiceResponse = require('twilio').twiml.VoiceResponse;
const response = new VoiceResponse();

response.play('http://prtnsrc.com/2545.mp3');

client.calls.create({
	url: response.toString(),
	// to: '+5521997857960',
	to: '+5521995740115',
	from: '+553340421419'
}, function(err, call) {
	console.log(err);
});