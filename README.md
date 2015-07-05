[![Build Status](https://secure.travis-ci.org/fluffybunnies/glados.png)](http://travis-ci.org/fluffybunnies/glados)

# glados
Monitor remote resource for changes

Use the cli wrapper to send an email notification or POST to a url when the reource has changed.
Supports Gmail and SES for email.
Diffs are calculated using kpdecker's [diff](https://www.npmjs.com/package/diff).


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
`-m` - optional email address to send diff on change
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


### To Do
- Email plaintext diff as attachment
	- html as well
- Change post format so that PHP's magic $_POST picks up the data
- Forever updates
	- Modify key to be the target url instead of the entire command
	- Shutdown script
	- Save data locally in case of reboot to avoid missing a change event
- Improve Readme

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


