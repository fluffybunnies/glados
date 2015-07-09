
module.exports = function(diff){
	var formatted = '';
	diff.forEach(function(part){
		var color = part.added ? 32
			: part.removed ? 31
			: 90
		formatted += '\u001b['+color+'m'+ part.value +'\u001b[39m';
	});
	return formatted;
}
