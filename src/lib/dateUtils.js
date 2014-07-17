define(function(require, exports, module) {
	
	var weekday = [];
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var month = ['January', 'February', 'March', 'Arpil', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var getExt = function(day) {
    	if(day === 1 || day === 21 || day === 31) return 'st';
    	else if(day === 2 || day === 22) return 'nd';
    	else if(day === 3 || day === 23) return 'rd';
    	else return 'th';
    }

	module.exports = {
		weekday: weekday,
		month: month,
		getExt: getExt
	};
});