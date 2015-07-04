
module.exports = function(diff){
	var formatted = '';
	diff.forEach(function(part){
		var color = part.added ? '#0f0'
			: part.removed ? '#f00'
			: '#ccc'
		formatted += '<div style="color:'+color+';">'+ part.value.replace(/\n/g,'<br />') +'</div>';
	});
	return formatted;
}
