#!/bin/bash
#
# Stop running what you started with forever.sh
#
# Exact match:
# ./bin/kill_forever.sh http://example.com/sensitive_data.html
# Soft match:
# ./bin/kill_forever.sh -s sensitive_data.html
#

. `dirname "$0"`'/../lib/util.sh' ..

match=$1
if [ "$1" == "-s" ]; then
	match=$2
	softMatch=1
	if [ "$match" ]; then echo "using softmatch"; fi
fi

# require key
if [ ! "$match" ]; then
	>&2 echo "key required (target url)"
	exit 1
fi

angel=`realpath ./bin/forever.sh`
cli=`realpath "./bin/cli.js"`
forevs=`locate_forever`



# crontab
if [ "$softMatch" ]; then
	cid=`crontab -l | grep "$angel" | grep "$match" | head -n1`
else
	cid="$angel $match"
fi
if [ "$cid" ]; then
	echo "removing crontab..."
	echo "cid: $cid"
	crontab_remove "$cid"
else
	echo "cannot find crontab"
fi

# forever
if [ "$forevs" ]; then
	if [ "$softMatch" ]; then
		fid=`$forevs list | grep "$cli" | grep "$match" | awk '{print $3}' | sed -e 's/\[\|\]//g' | head -n1`
	else
		fid=`$forevs list | grep "$cli $match" | awk '{print $3}' | sed -e 's/\[\|\]//g' | head -n1`
	fi
	if [ "$fid" ]; then
		echo "stopping forever..."
		echo "fid: $fid"
		$forevs stop $fid
	else
		echo "forever not running"
	fi
else
	>&2 echo "failed to locate forever"
fi

# saved data
fid=`echo "$match" | sed 's/[^a-zA-Z0-9_\.-]/_/g'`
if [ "$softMatch" ]; then
	saveDataFile=/tmp/glados.*$fid*
else
	saveDataFile=/tmp/glados.$fid
fi
echo "rm $saveDataFile..."
rm "$saveDataFile" 2>&1


