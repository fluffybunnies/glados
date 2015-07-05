/*
node ./test/diff.js
*/

var diff = require('diff')
,fs = require('fs')

var a = fs.readFileSync(__dirname+'/a.txt').toString();
var b = fs.readFileSync(__dirname+'/b.txt').toString();

console.log(
	require('../lib/console_diff.js')(diff.diffLines(a,b))
)

