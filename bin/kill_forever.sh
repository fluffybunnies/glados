#!/bin/bash
#
# Stop running what you started with forever.sh
#

. `dirname "$0"`'/../lib/util.sh' ..

# require key
if [ ! "$1" ]; then
	echo "key required (target url)"
	exit 1
fi

angel=`realpath ./bin/forever.sh`
cli=`realpath "./bin/cli.js"`

#key="$angel $@"
key="$angel $1"
echo "removing crontab..."
crontab_remove "$key"

forevs=`locate_forever`
#key="$cli $@"
key="$cli $1"
if [ "$forevs" ]; then
	key="$cli $@"
	fid=`$forevs list | grep "$key" | awk '{print $3}' | sed -e 's/\[\|\]//g' | head -n1`
	if [ "$fid" ]; then
		echo "stopping forever..."
		$forevs stop $fid
	fi
fi

saveDataFile=/tmp/glados.`echo "$1" | sed 's/[^a-zA-Z0-9_\.-]/_/g'`
if [ -f "$saveDataFile" ]; then
	echo "rm $saveDataFile..."
	rm "$saveDataFile"
fi
