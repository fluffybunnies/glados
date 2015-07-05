#!/bin/bash
#
# Run this like you would cli.js
# ./bin/forever.sh http://localhost:3001 -n4000 -p http://localhost:3002 -m ohsosexybrit@gmail.com
#

forevs=`which forever`
if [ ! "$forevs" ]; then
	if [ -f /usr/local/bin/forever ]; then forevs=/usr/local/bin/forever
	elif [ -f /usr/bin/forever ]; then forevs=/usr/bin/forever
	elif [ -f /usr/bin/apt-get ]; then
		echo "unable to locate forever. attempting apt install..."
		/usr/bin/apt-get install --assume-yes forever
		forevs=`which forever`
	fi
fi
if [ ! "$forevs" ]; then
	echo "unable to locate forever. quitting..."
	exit 1
fi


if [ ! "`which realpath`" ]; then
	echo "realpath not found. hacking in a temp..."
	realpath() {
		if [ ! -f "$1" ] && [ ! -d "$1" ]; then
			>&2 echo 'path does not exist'
		else
			dir=$1
			if [ -f "$1" ]; then
				dir=`dirname "$1"`
			fi
			path=`cd "${dir}";pwd`
			if [ -f "$1" ]; then
				path=$path/`basename "$1"`
			fi
			echo $path
		fi
	}
fi

crontab_add(){
  search=$1
  line=$2
  if [ ! "$line" ]; then line=$search; fi
  tmp=`mktemp`
  crontab -l | grep -v "$search" > $tmp
  echo "$line" >> $tmp
  crontab < $tmp 
  rm $tmp
}

__dirname=`dirname "$0"`
angel=`realpath "$0"`
cli=`realpath "$__dirname/cli.js"`

run="$forevs start --spinSleepTime 1000 --minUptime 500 $cli $@"
gfor="$cli $@"
check=`$forevs list | grep "$gfor"`
if [ ! "$check" ]; then
	$run
fi

run="$angel $@"
check=`crontab -l | grep "$run"`
if [ ! "$check" ]; then
	crontab_add "* * * * * $run >> /var/log/glados.log 2>&1"
fi

