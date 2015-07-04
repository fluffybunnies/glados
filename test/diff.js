

var diff = require('diff')
,fs = require('fs')

var a = fs.readFileSync(__dirname+'/a.txt').toString();
var b = fs.readFileSync(__dirname+'/b.txt').toString();


diff.diffLines(a,b).forEach(function(part){
	var color = part.added ? 32
		: part.removed ? 31
		: 90
	//process.stdout.write(part.value);
	process.stdout.write('\u001b['+color+'m'+ part.value +'\u001b[39m');
});
console.log();


