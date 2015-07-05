[![Build Status](https://secure.travis-ci.org/fluffybunnies/glados.png)](http://travis-ci.org/fluffybunnies/glados)

# glados
Monitor remote resource for changes

Use the cli wrapper to send an email notification or POST to a url when the reource has changed.


### App
```javascript
var glados = require('glados')

var watcher = glados('http://example.com/sensitive_data.html', 1000*60)
.on('change',function(diff){
	// do something with diff
})
.on('connection',function(data){
	// data = response from first poll
})
.on('error',function(err){
	// we have some problem connecting with resource
})
```


### CLI Wrapper
`-n` - poll interval in ms<br />
`-p` - optional endpoint to post diff on change<br />
`-m` - optional email address to send diff on change<br />
```bash
node ./bin/cli.js http://example.com/sensitive_data.html -n60000 \
-p http://myapi.example.com/notify_change \
-m ohsosexybrit@gmail.com
```


### Forever Wrapper
Make sure this thing never goes down
```
./bin/forever.sh http://example.com/sensitive_data.html -n60000 \
-p http://myapi.example.com/notify_change \
-m ohsosexybrit@gmail.com
```
Kill the process, stop the forever, reboot the instance. Baby will still be kickin.


### To Do
- Improve Readme
