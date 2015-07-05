/*
node test/cli_endpoint.js
*/

var querystring = require('querystring');
require('http').createServer(function(req,res){
	var body = '';
	req.on('data',function(data){
		body += data;
	})
	.on('end',function(){
		res.end('GOT IT!\n'+querystring.parse(body).diff+'\n');
	})
}).listen(3002)
