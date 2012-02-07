// instance methods
	Object.defineProperties( Date.prototype, forEach( {
		GMTOffset            : GMTOffset,            ISODay         : ISODay,         ISODaysInYear   : ISODaysInYear,
		ISOFirstMondayOfYear : ISOFirstMondayOfYear, ISOWeek        : ISOWeek,        ISOWeeksInYear  : ISOWeeksInYear,
		adjust               : adjust,               between        : between,        clearTime       : clearTime,
		clone                : clone,                dayOfYear      : dayOfYear,      firstOfTheMonth : firstOfTheMonth,
		format               : format,               getWeek        : getWeek,        isDST           : isDST,
		isLeapYear           : isLeapYear,           lastOfTheMonth : lastOfTheMonth, setWeek         : setWeek,
		timezone             : timezone
	}, todesc ) );

// static methods & properties
	Object.defineProperties( Date, forEach( {
// constants used by Date.prototype.adjust
		DAY : DAY, HOUR : 'hr', MINUTE : MINUTE.substring( 0, 3 ), MILLISECOND : MILLISECOND, MONTH : MONTH, SECOND : SECOND.substring( 0, 3 ), WEEK : WEEK, YEAR : YEAR,
// constants defining milliseconds for different times
		MS_DAY : MS_DAY, MS_WEEK : MS_WEEK, MS_MONTH : 2592e6, MS_YEAR : 31536e6,
// filters and formats
		filters : filter, formats : formats, parsers : parser,
// static methods
		getOrdinal : LOCALE.getOrdinal, isLeapYear : LOCALE.isLeapYear, setLeapYear : LOCALE.setLeapYear, toDate : toDate
	}, todesc ) );
