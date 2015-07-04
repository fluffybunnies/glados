
var events = require('events')
,http = require('http')
,diff = require('diff')

module.exports = function(){
	var w = new events.EventEmitter;

	return w;
}

function httpGet(url, cb){

}
