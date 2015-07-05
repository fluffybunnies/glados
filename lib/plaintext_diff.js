
module.exports = function(diff, changedOnly){
	var formatted = '';
	diff.forEach(function(part){
		var prefix = part.added ? '+'
			: part.removed ? '-'
			: ' '
		if (changedOnly && !part.added && !part.removed) return;
		var lines = part.value.split('\n')
		for (var i=0;i<lines.length;++i) {
			if (lines[i])
				lines[i] = prefix+'\t'+lines[i];
		}
		formatted += lines.join('\n');
	});
	return formatted;
}
