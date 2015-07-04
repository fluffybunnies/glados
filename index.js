
var events = require('events')
,http = require('http')
,diff = require('diff')
,httpGet = require('./httpget.js')
,defaultPollInterval = 1000*60

module.exports = function(url, pollInterval){
	if (isNaN(pollInterval = +pollInterval))
		pollInterval = defaultPollInterval;
	var w = new events.EventEmitter
		,someonesListening,connected
		,timeout,stopped

	// dont start watching until someone cares
	var on_ = w.on;
	w.on = function(evt){
		if (!someonesListening && evt == 'change') {
			someonesListening = true;
			poll();
		}
		return on_.apply(w,arguments);
	}

	w.stop = function(){
		stopped = true;
		clearTimeout(timeout);
	}

	var lastPollData, undef;
	function poll(){
		w.emit('poll');
		httpGet(url,function(err, data){
			if (stopped) return;
			if (err) return w.emit('error',err);
			var thisPollData = data.toString();
			if (!connected) {
				connected = true;
				w.emit('connection', thisPollData);
				if (stopped) return;
			}
			if (lastPollData != thisPollData && lastPollData !== undef) {
				var d = diff.diffLines(lastPollData,thisPollData);
				if (!d[1]) {
					return w.emit('error','new data but diff algo failed to notice');
				}
				var res = {
					added: []
					,removed: []
				}
				d.forEach(function(part){
					if (!(part.added || part.removed)) return;
					var arr = res[part.added ? 'added' : 'removed'];
					arr.push.apply(arr, part.value.replace(/\n$/,'').split('\n'));
				});
				w.emit('change',res);
				if (stopped) return;
			}
			lastPollData = thisPollData;
			timeout = setTimeout(poll,pollInterval);
		})
	}

	return w;
}


