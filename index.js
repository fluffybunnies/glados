
var events = require('events')
,http = require('http')
,diff = require('diff')
,httpGet = require('./lib/http_get.js')
,defaultPollInterval = 1000*60

module.exports = function(url, pollInterval, useSavedData){
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
	if (useSavedData) {
		lastPollData = useSavedData.toString();
		connected = true;
	}

	function poll(){
		w.emit('poll');
		httpGet(url,function(err, data){
			if (stopped) return;
			if (err) return w.emit('error',err);
			var thisPollData = data.toString();
			w.emit('_polled',data); if (stopped) return;
			if (!connected) {
				connected = true;
				w.emit('connection', data);
				if (stopped) return;
			}
			if (lastPollData != thisPollData && lastPollData !== undef) {
				var d = diff.diffLines(lastPollData,thisPollData);
				if (!d[1])
					return w.emit('error','new data but diff algo failed to notice');
				w.emit('change', d, data);
				if (stopped) return;
			}
			lastPollData = thisPollData;
			timeout = setTimeout(poll,pollInterval);
		})
	}

	return w;
}


