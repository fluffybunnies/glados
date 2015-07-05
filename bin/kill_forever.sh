#!/bin/bash
#
# Stop running what you started with forever.sh
#

. `dirname "$0"`'/../lib/util.sh' ..


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

