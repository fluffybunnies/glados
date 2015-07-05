/*
node test/cli.js
node test/cli_endpoint.js

node cli.js http://localhost:3001 -n4000 -p http://localhost:3002 -m ohsosexybrit@gmail.com
*/

var argv = require('minimist')(process.argv.slice(2))
,sext = require('sext')
,querystring = require('querystring')
,glados = require('../')
,httpPost = require('../lib/http_post')
,sendEmail = require('../lib/send_email')
,htmlDiff = require('../lib/html_diff')
,plaintextDiff = require('../lib/plaintext_diff')

var watch = argv._[0]
,pollInterval = argv.n || argv.interval
,handlerEndpoints = argv.p || argv.post
,handlerEmails = argv.m || argv.email
if (handlerEndpoints && typeof handlerEndpoints == 'string')
	handlerEndpoints = [handlerEndpoints];
if (handlerEmails && typeof handlerEmails == 'string')
	handlerEmails = [handlerEmails];

if (!watch) {
	console.error('missing target');
	process.exit();
}
console.log('watching: '+watch);
console.log('pollInterval: '+(typeof pollInterval == 'undefined' ? '[default]' : pollInterval));
if (handlerEndpoints) console.log('handlerEndpoints: '+handlerEndpoints.join(' '));
if (handlerEmails) console.log('handlerEmails: '+handlerEmails.join(' '));



var watcher = glados(watch, pollInterval)
.on('change',handleDiff)
.on('error',function(err){
	console.log('ERROR',err);
})

function handleDiff(diff){
	console.log('------ DIFF '+new Date+' ------');
	if (handlerEndpoints) {
		var postData = querystring.stringify({diff:JSON.stringify(diff)});
		handlerEndpoints.forEach(function(endpoint){
			console.log('posting diff to '+endpoint+'...');
			httpPost(endpoint, postData, function(err,data){
				if (err)
					return console.log('error from '+endpoint+': ', err);
				console.log('response from '+endpoint+':\n'+data.toString());
			});
		});
	}
	if (handlerEmails) {
		var opts = {
			subject: 'GLaDOS change ('+watch+')'
			,html: htmlDiff(diff, true)
			,text: plaintextDiff(diff, true)
		  ,attachments: [
		  	{ filename: 'diff.txt', content: plaintextDiff(diff) }
				//,{ filename: 'diff.html', content: htmlDiff(diff) }
		  ]
		}
		handlerEmails.forEach(function(email){
			console.log('emailing diff to '+email+'...');
			sendEmail(sext({to:email},opts), function(err,data){
				if (err)
					return console.log('error from '+email+': ', err);
				console.log('response from '+email+': ', data);
			});
		});
	}
}


