#!/bin/bash
#
# Run this like you would cli.js
# ./bin/forever.sh http://localhost:3001 -n4000 -p http://localhost:3002 -m ohsosexybrit@gmail.com
#

. `dirname "$0"`'/../lib/util.sh' ..

forevs=`locate_forever`
if [ ! "$forevs" ]; then
	echo "unable to locate forever. quitting..."
	exit 1
fi


angel=`realpath "$0"`
cli=`realpath "./bin/cli.js"`

run="$forevs start --spinSleepTime 1000 --minUptime 500 $cli $@ --save"
#key="$cli $@"
key="$cli $1"
check=`$forevs list | grep "$key"`
if [ ! "$check" ]; then
	$run
fi

run="$angel $@"
#key=$run
key="$angel $1"
crontab_add "$key" "* * * * * $run >> /var/log/glados.log 2>&1"


# dont clutter log file with unnecessary echos...
#echo "shutdown:"
#echo "$APP_PATH/kill_forever.sh '$1'"
