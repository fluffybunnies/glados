[![Build Status](https://secure.travis-ci.org/fluffybunnies/glados.png)](http://travis-ci.org/fluffybunnies/glados)

# glados
Monitor remote resource for changes
- Use the cli wrapper to send an email notification or POST to a url when the resource has changed
- Diffs are calculated using kpdecker's [diff](https://www.npmjs.com/package/diff)
- Will not start polling until client binds to `'change'`
- Use the CLI Wrapper to take action on `'change'`
	- POST to an endpoint, or
	- send email notification (supports Gmail and SES)


## App
```javascript
var glados = require('glados')

var watcher = glados('http://example.com/sensitive_data.html', 1000*60)
.on('change',function(diff){
	// do something with diff
})
.on('error',function(err){
	// we have some problem connecting with resource
})
```


## CLI Wrapper
See api notes below for opts
```bash
node ./bin/cli.js http://example.com/sensitive_data.html -n60000 \
-p http://myapi.example.com/notify_change \
-m volcomstoner2689@gmail.com
```


## Forever Wrapper
Make sure this thing never goes down. Wraps cli.js with sturdiness.<br />
Kill the process, stop the forever, reboot the instance. Baby will still be kickin.<br />
Most recently polled data is saved to tmp file in case process dies and reboots.
```
./bin/forever.sh http://example.com/sensitive_data.html -n60000 \
-p http://myapi.example.com/notify_change \
-m ohsosexybrit@gmail.com
```


##### Kill Forever
Shut down what you started with `forever.sh`
```
./bin/kill_forever.sh http://example.com/sensitive_data.html
# or kill processes that contain -s (softmatch):
./bin/kill_forever.sh -s sensitive_data.html
```


## App Api

##### glados( url [, pollInterval] )
returns a `watcher` that will monitor changes of `url`<br />
`url` _string_ - remote resource to watch<br />
`pollInterval` _int_ - interval in ms to check resource for changes. defaults to 1 minute

##### watcher.stop()
Stop watching. No further events will be fired after this is called.

##### watcher.on('change', function(diff, data){})
Fired when a change has been detected in remote resource<br />
`diff` _Array_ - an array of data comprising added, removed, and unchanged chunks<br />
`data` _Buffer_ - the new data, unadulterated

##### watcher.on('connection', function(data){})
Fired on response from initial poll<br />
`data` _Buffer_ - the response data

##### watcher.on('poll', function(){})
Fired immediately prior to each poll. The first `'poll'` event occurs before `'connection'`

##### watcher.on('error', function(err){})
Catch errors in the stream


## CLI Api

##### Arguments
Applies to both `cli.js` and `forever.sh`
- `[target]`
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


## Email
Copy `config.json` to `config.local.json` and add credentials

##### Gmail
Set `mailTransport` to 'gmail'<br />
Use an application password (not your personal account password)

##### SES
Set `mailTransport` to 'ses'<br />
Set your AWS secret and key, along with an approved From address


## To Do
- Using the softmatch option (`kill_forever.sh -s "substring"`) currently kills only the first match found, but deletes all matching saved data
	- Update script to kill all matches as advertised in readme
- Add screenshot of pretty email to readme


<!--
cd /root
git clone https://github.com/fluffybunnies/glados.git
cd glados
npm install
echo '' > ./config.local.json && vim ./config.local.json

node /root/glados/bin/cli.js http://www.huffingtonpost.com -n5000 \
-m volcomstoner2689@gmail.com --save

node /root/glados/bin/cli.js http://www.huffingtonpost.com -n5000 \
-p http://ace.fabfitfun.com/glados.php

/bin/bash /root/glados/bin/forever.sh http://data.iana.org/TLD/tlds-alpha-by-domain.txt \
-m volcomstoner2689@gmail.com

To Do
	- New sire module with simple index.php that generates content based on domain string
	- On TLD change, nab as many BrandName.NewTLDs as possible and point DNS to this server
		- Option to automate, but default to sending an email to self
		- If I click on confirm button, it'll start buying
		- If I don't click on confirm button within X time and the # new domains is reasonable, start buying
-->


