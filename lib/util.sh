
if [ "`which realpath`" == "" ]; then
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

if [ "$1" ]; then
	export __dirname=`dirname "$0"`
	export APP_PATH=`realpath "$__dirname/$1"`
	cd "$APP_PATH"
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

crontab_remove(){
  search=$1
  tmp=`mktemp`
  crontab -l | grep -v "$search" > $tmp
  crontab < $tmp
  rm $tmp
}

locate_forever(){
	forevs=`which forever`
	if [ ! "$forevs" ]; then
		if [ -f /usr/local/bin/forever ]; then forevs=/usr/local/bin/forever
		elif [ -f /usr/bin/forever ]; then forevs=/usr/bin/forever
		elif [ -f /usr/bin/apt-get ]; then
			/usr/bin/apt-get install --assume-yes forever
			forevs=`which forever`
		fi
	fi
	echo $forevs
}
