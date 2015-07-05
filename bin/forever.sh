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
key="$cli $@"

run="$forevs start --spinSleepTime 1000 --minUptime 500 $cli $@"
check=`$forevs list | grep "$key"`
if [ ! "$check" ]; then
	$run
fi

run="$angel $@"
check=`crontab -l | grep "$run"`
if [ ! "$check" ]; then
	crontab_add "* * * * * $run >> /var/log/glados.log 2>&1"
fi

