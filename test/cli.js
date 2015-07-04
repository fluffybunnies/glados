
var n = 0
,data1 = 'a\nb\nc\nd\ne\n'
,data2 = 'a\nb\nx\nd\ne\n'

require('http').createServer(function(req,res){
	n = !n;
	res.end(n ? data1 : data2);
}).listen(3001)
