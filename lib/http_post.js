
var http = require('http')
,Url = require('url')
,sext = require('sext')

module.exports = function(url, send, opts, cb){
	if (opts instanceof Function) {
		cb = opts
		opts = null;
	}
	var url = Url.parse(url)
		,buf = new Buffer(0)
	var done = function(){
		cb.apply(null,arguments);
		cb = function(){}
	}
	var req = http.request(sext({
		hostname: url.hostname
		,port: url.port
		,path: url.path
		,method: 'POST'
	},opts),function(res){
		res.on('data',function(data){
			buf = Buffer.concat([buf,data])
		})
		.on('end',function(){
			done(false,buf)
		})
		.on('error',function(err){
			done(err)
		})
	})
	.on('error',function(err){
		done(err)
	})
	.end(send)
}

