var test = require('tape')
,glados = require('../')
,http = require('http')
,serverData = ''


test('worky',function(t){
	t.plan(3);

	var gotChange = false
	,gotPoll = false
	,s,failback

	s = startServer(function(){

		serverData = 'a\nb\nc\nd\ne';
		var watcher = glados('http://localhost:3001', 50)
		.on('change',function(){
			if (gotChange) return;
			gotChange = true;
			t.ok(true, 'got first change event');
		})
		.on('connection',function(data){ // connection event on first response
			t.ok(data.toString() == serverData, 'connection passeth data')
			serverData = 'a\nb\nx\nd\ne';
			watcher.on('poll',function(){ // poll event sent right before request
				if (gotPoll) return;
				gotPoll = true;
				watcher.on('change',function(diff){
					console.log('diff',diff);
					t.ok(false, 'write this test');
					watcher.stop();
				})
			})
		})

	})

	failback = setTimeout(function(){
		//s._connections && s.close();
		//t.fail();
		s.close();
	},2000);

});


function startServer(cb){
	return http.createServer(function(req,res){
		res.end(serverData);
	}).listen(3001,cb);
}
