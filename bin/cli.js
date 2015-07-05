/*
node test/cli.js
node test/cli_endpoint.js

node cli.js http://localhost:3001 -n4000 -p http://localhost:3002 -m ohsosexybrit@gmail.com
*/

var argv = require('minimist')(process.argv.slice(2))
,querystring = require('querystring')
,fs = require('fs')
,sext = require('sext')
,glados = require('../')
,httpPost = require('../lib/http_post')
,sendEmail = require('../lib/send_email')
,htmlDiff = require('../lib/html_diff')
,plaintextDiff = require('../lib/plaintext_diff')

var watch = argv._[0]
,pollInterval = argv.n || argv.interval
,handlerEndpoints = argv.p || argv.post
,handlerEmails = argv.m || argv.email
,useSavedData = (argv.s || argv.save) ? '/tmp/glados.'+watch : false
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
if (useSavedData) console.log('useSavedData: '+useSavedData);



var watcher = function(useSavedData){
	return watcher = glados(watch, pollInterval, useSavedData)
	.on('change',handleDiff)
	.on('error',function(err){
		console.log('ERROR',err);
	})
}
if (useSavedData) {
	fs.readFile(useSavedData,function(err,data){
		if (err && err.code != 'ENOENT')
			console.log('ERROR','useSavedData','init fetch',err);
		else
			console.log('useSavedData','init fetch',data);
		watcher(data)
		.on('_polled',function(data){
			fs.writeFile(useSavedData, data, function(err){
				if (err)
					console.log('ERROR','useSavedData','writing',err);
			});
		})
	});
} else {
	watcher();
}

function handleDiff(diff){
	console.log('------ DIFF '+new Date+' ------');
	if (handlerEndpoints) {
		var postData = querystring.stringify({diff:JSON.stringify(diff)})
			,opts = {headers:{'content-type':'application/x-www-form-urlencoded'}}
		handlerEndpoints.forEach(function(endpoint){
			console.log('posting diff to '+endpoint+'...');
			httpPost(endpoint, postData, opts, function(err,data){
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


