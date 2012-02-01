Date.locale = {
	id                  : 'en-GB',
	AM                  : 'am',
	PM                  : 'pm',
	days                : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	day_count           : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	formats             : {
		server_date     : 'Y-m-d',
		server_datetime : 'Y-m-d<T>H:i:sP',
		server_time     : 'H:i:s',
		short_date      : 'd/m/Y',
		short_time      : 'h:ia'
	},
	months              : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	ordinal             : ['th', 'st', 'nd', 'rd', 'th'],
	getOrdinal          : function( d ) { // 1st, 2nd, 3rd, etc.
		return ( d > 3 && d < 21 ) ? this.ordinal[0] : this.ordinal[Math.min( d % 10, 4 )];
	},
	ordinal_day_count   : [
		[0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365],
		[0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
	]
};
