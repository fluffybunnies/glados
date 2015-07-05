[![Build Status](https://secure.travis-ci.org/fluffybunnies/glados.png)](http://travis-ci.org/fluffybunnies/glados)

# glados
Monitor remote resource for changes
- Use the cli wrapper to send an email notification or POST to a url when the reource has changed
- Supports Gmail and SES for email
- Diffs are calculated using kpdecker's [diff](https://www.npmjs.com/package/diff)
- Will not start polling until client binds to `'change'`


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
See api notes below for opts
```bash
node ./bin/cli.js http://example.com/sensitive_data.html -n60000 \
-p http://ace.fabfitfun.com/demo \
-m volcomstoner2689@gmail.com
```


### Forever Wrapper
Make sure this thing never goes down. Wraps cli.js with sturdiness
```
./bin/forever.sh http://example.com/sensitive_data.html -n60000 \
-p http://myapi.example.com/notify_change \
-m ohsosexybrit@gmail.com
```
Kill the process, stop the forever, reboot the instance. Baby will still be kickin.


### Kill Forever
Shut down what you started with `forever.sh`
```
./bin/kill_forever.sh http://example.com/sensitive_data.html
```


### App Api

#### glados( ttl [, pollInterval] )
returns a `watcher` that will monitor changes of `url`<br />
_string_ `url` - remote resource to watch<br />
_int_ `pollInterval` - interval in ms to check resource for changes. defaults to 1 minute

#### watcher.stop()
Stop watching. No further events will be fired after this is called.

#### watcher.on('change', function(diff){})
Fired when a change has been detected in remote resource<br />
_Array_ `diff` - an array of data comprising added, removed, and unchanged chunks

#### watcher.on('connection', function(data){})
Fired on response from initial poll<br />
_Buffer_ `data` - the response data

#### watcher.on('poll', function(){})
Fired immediately prior to each poll. The first `'poll'` event occurs before `'connection'`<br />

#### watcher.on('error', function(err){})
Catch errors in the stream


### CLI Api

#### Arguments
Applies to both `cli.js` and `forever.sh`
- [target url]
	- url of resource to watch
- `-n` or `--interval`
	- pollInterval
	- optional, defaults to 1 minute
- `-p` or `--post`
	- endpoint to post `diff` on change event
	- optional
	- supports multiple
- `-m` or `--email`
	- email address to send `diff` on change event
	- optional
	- supports multiple


### Email
Copy `config.sh` to `config.local.sh` and add credentials

#### Gmail
Set `mailTransport` to 'gmail'<br />
Use an application password (not your personal account password)

#### SES
Set `mailTransport` to 'ses'<br />
Set your AWS secret and key, along with an approved From address


### To Do
- Forever updates
	- Save data locally in case of reboot to avoid missing a change event



<!--
cd /root
git clone https://github.com/fluffybunnies/glados.git
cd glados
npm install
echo '' > ./config.local.json && vim ./config.local.json

node /root/glados/bin/cli.js http://www.huffingtonpost.com -n5000 \
-m volcomstoner2689@gmail.com

node /root/glados/bin/cli.js http://www.huffingtonpost.com -n5000 \
-p http://ace.fabfitfun.com/glados.php

/bin/bash /root/glados/bin/forever.sh http://data.iana.org/TLD/tlds-alpha-by-domain.txt \
-m volcomstoner2689@gmail.com
-->


