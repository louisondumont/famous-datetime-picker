define(function(require, exports, module) {
	function normalizeTime(time)
	{
		if(time < 10)		time = '0' + time;
		else 				time = time + '';
		return time;
	}

	module.exports = normalizeTime;
});