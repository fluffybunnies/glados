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
					watcher.stop();
					s.close();
					clearTimeout(failback);
					t.ok(diff[1].removed && diff[2].added, 'diff confirmed');
				})
			})
		})
		.on('error',function(err){
			t.fail(err)
		})

	})

	failback = setTimeout(function(){
		//s._connections && s.close();
		s.close();
		t.fail('timeout');
	},2000);

});

test('no change',function(t){
	t.plan(1);

	var s,watcher;
	s = startServer(function(){
		serverData = 'abcd\nefgh\n';
		watcher = glados('http://localhost:3001', 50)
		.on('change',function(){
			watcher.stop()
			s.close()
			t.fail('should not have triggered change event')
		})
	})

	setTimeout(function(){
		watcher.stop()
		s.close()
		t.ok(true, 'nothing changed')
	},500)

})

test('http error',function(t){
	t.plan(1);

	var s,failback;

	s = startServer(function(){
		serverData = 'a\nb\nc\nd\ne';
		var watcher = glados('http://localhost:3001', 50)
		.on('change',function(){
			t.fail('should have stopped (change1)')
		})
		.on('connection',function(){
			s.close()
			serverData = 'a\nb\nx\nd\ne';
			watcher.on('poll',function(){
				watcher.on('change',function(){
					t.fail('should have stopped (change2)')
				})
			})
		})
		.on('error',function(err){
			watcher.stop()
			clearTimeout(failback)
			t.ok(true, 'http error handled: '+err)
		})
	})

	failback = setTimeout(function(){
		s.close();
		t.fail('timeout');
	},2000);

})

function startServer(cb){
	return http.createServer(function(req,res){
		process.nextTick(function(){
			res.end(serverData);
		});
	}).listen(3001,cb);
}
