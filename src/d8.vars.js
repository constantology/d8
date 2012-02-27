	var F = !1, LOCALE = Date.locale, N = null, OP = Object.prototype, T = !0, U,
// DAY_OFFSETS is the amount of days from the current day to the Monday of the week it belongs to
		DAY_OFFSETS = [9, 1, 0, -1, -2, 4, 3],    MS_DAY       = 864e5, MS_WEEK = 6048e5,
		SHORT_DAYS  = LOCALE.days.map( _substr ), SHORT_MONTHS = LOCALE.months.map( _substr ),
// parser keys
		AMPM  = 'ampm',  DAY    = 'day',    DAYWEEK  = 'dayweek',  DAYYEAR = 'dayyear', HOUR = 'hour', MILLISECOND = 'ms', MINUTE ='minute',
		MONTH = 'month', SECOND = 'second', TIMEZONE = 'timezone', UNIX    = 'unix',    WEEK = 'week', YEAR        = 'year',
// used by Date.prototype.format && Date.toDate to replace escaped chars
		NOREPLACE = 'NOREPLACE', NOREPLACE_RB = '<' + NOREPLACE + '<', NOREPLACE_RE   = '>END' + NOREPLACE + '>',
// cache objects
		cache_format = {}, cache_parse  = {},
		date_chars,        date_members = [DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR],
		filter,            formats      = copy( {
			ISO_8601 : 'Y-m-d<T>H:i:s.u<Z>', ISO_8601_SHORT : 'Y-m-d',
			RFC_850  : 'l, d-M-y H:i:s T',   RFC_2822       : 'D, d M Y H:i:s O',
			sortable : 'Y-m-d H:i:sO'
		}, LOCALE.formats ),
		m, math_fn = { day : ['getDate', 'setDate'], hr : ['getHours', 'setHours'], min : ['getMinutes', 'setMinutes'], month : ['getMonth', 'setMonth'], ms : ['getMilliseconds', 'setMilliseconds'], sec : ['getSeconds', 'setSeconds'], week : ['getWeek', 'setWeek'], year : ['getFullYear', 'setFullYear'] },
		parser,
		re_ampm    = '(am|pm)',
		re_add_enr = />/g,           re_add_nr = /</g,                  re_compile,
		re_d1_2    = '([0-9]{1,2})', re_d2     = '([0-9]{2})',          re_d4       = '([0-9]{4})',
		re_split   = /[<>]/,         re_tz     = /[^\(]*\(([^\)]+)\)/g, re_tz_abbr  = /[^A-Z]+/g;

	formats.atom = formats.ISO_8601; formats.cookie = formats.RFC_850; formats.rss = formats.RFC_2822;

	filter  = {
// day
		d : function( d ) { return pad( d.getDate(), 2 ); },                                    // Day of the month, 2 digits with leading zeros
		D : function( d ) { return LOCALE.days[d.getDay()].substring( 0, 3 ); },                // A textual representation of a day, three letters
		j : function( d ) { return d.getDate(); },                                              // Day of the month without leading zeros
		l : function( d ) { return LOCALE.days[d.getDay()]; },                                  // A full textual representation of the day of the week
		N : function( d ) { return getISODay.call( d ); },                                      // ISO-8601 numeric representation of the day of the week
		S : function( d ) { return LOCALE.getOrdinal( d.getDate() ); },                         // English ordinal suffix for the day of the month, 2 characters
		w : function( d ) { return d.getDay(); },                                               // Numeric representation of the day of the week
		z : function( d ) { return d.getDayOfYear(); },                                            // The day of the year (starting from 0)
// week
		W : function( d ) { return getISOWeek.call( d ); },                                     // ISO-8601 week number of year, weeks starting on Monday
// month
		F : function( d ) { return LOCALE.months[d.getMonth()]; },                              // A full textual representation of a month
		m : function( d ) { return pad( ( d.getMonth() + 1 ), 2 ); },                           // Numeric representation of a month, with leading zeros
		M : function( d ) { return LOCALE.months[d.getMonth()].substring( 0, 3 ); },            // A short textual representation of a month, three letters
		n : function( d ) { return d.getMonth() + 1; },                                         // Numeric representation of a month, without leading zeros
		t : function( d ) { LOCALE.setLeapYear( d ); return LOCALE.day_count[d.getMonth()]; },  // Number of days in the given month
// year
		L : function( d ) { return ( d.isLeapYear() ) ? 1 : 0; },                               // Whether it's a leap year
		o : function( d ) {                                                                     // ISO-8601 year number. This has the same value as Y, except that if the ISO
			var m = d.getMonth(), w = getISOWeek.call( d );                                     // week number (W) belongs to the previous or next year, that year is used instead.
			return ( d.getFullYear() + ( w == 1 && m > 0 ? 1 : ( w >= 52 && m < 11 ? -1 : 0 ) ) );
		},
		Y : function( d ) { return d.getFullYear(); },                                          // A full numeric representation of a year, 4 digits
		y : function( d ) { return String( d.getFullYear() ).substring( 2, 4 ); },              // A two digit representation of a year
// time
		a : function( d ) { return _lc( d.getHours() < 12 ? LOCALE.AM : LOCALE.PM ); },         // Lowercase Ante meridiem and Post meridiem
		A : function( d ) { return _uc( d.getHours() < 12 ? LOCALE.AM : LOCALE.PM ); },         // Uppercase Ante meridiem and Post meridiem
		g : function( d ) { return d.getHours() % 12 || 12; },                                  // 12-hour format of an hour without leading zeros
		G : function( d ) { return d.getHours(); },                                             // 24-hour format of an hour without leading zeros
		h : function( d ) { return pad( filter.g( d ), 2 ); },                                  // 12-hour format of an hour with leading zeros
		H : function( d ) { return pad( filter.G( d ), 2 ); },                                  // 24-hour format of an hour with leading zeros
		i : function( d ) { return pad( d.getMinutes(), 2 ); },                                 // Minutes with leading zeros
		s : function( d ) { return pad( d.getSeconds(), 2 ); },                                 // Seconds, with leading zeros
		u : function( d ) { return pad( d.getMilliseconds(), 3 ); },                            // Milliseconds
// timezone
		O : function( d ) { return getGMTOffset.call( d ); },                                   // Difference to Greenwich time (GMT) in hours
		P : function( d ) { return getGMTOffset.call( d, T ); },                                // Difference to Greenwich time (GMT) with colon between hours and minutes
		T : function( d ) { return timezone.call( d ); },                                       // Timezone abbreviation
		Z : function( d ) { return d.getTimezoneOffset() * -60; },                              // Timezone offset in seconds. The offset for timezones west of UTC
                                                                                                // is always negative, and for those east of UTC is always positive.
// full date/time
		c : function( d ) { return format.call( d, formats.ISO_8601 ); },                       // ISO 8601 date
		r : function( d ) { return format.call( d, formats.RFC_2822 ); },                       // RFC 2822 formatted date
		U : function( d ) { return d.getTime(); }                                               // Seconds since the Unix Epoch January 1 1970 00:00:00 GMT
	};

	date_chars = Object.keys( filter ).sort().join( '' );
	re_compile = new RegExp( '([^' + date_chars + ']*)([' + date_chars + '])([^' + date_chars + ']*)', 'g' );

	parser = {
// day
		d : { k  : DAY,         fn : Number,                            re : re_d2 },
		D : { k  : DAYWEEK,     fn : _indexOf.bind( N, SHORT_DAYS ),    re : '(' + SHORT_DAYS.join( '|' ) + ')' },
		j : { k  : DAY,         fn : Number,                            re : re_d1_2 },
		l : { k  : DAYWEEK,     fn : _indexOf.bind( N, LOCALE.days ),   re : '(' + LOCALE.days.join( '|' ) + ')' },
		N : { k  : DAYWEEK,     fn : _zeroIndexedInt.bind( N, 7 ),      re : '([1-7])' },
		S : { re : '(?:' + LOCALE.ordinal.join( '|' ) + ')' },
		w : { k  : DAYWEEK,     fn : Number,                            re : '([0-6])' },
		z : { k  : DAYYEAR,     fn : Number,                            re : '([0-9]{1,3})' },
// week
		W : { k  : WEEK,        fn : Number,                            re : re_d2 },
// month
		F : { k  : MONTH,       fn : _indexOf.bind( N, LOCALE.months ), re : '(' + LOCALE.months.join( '|' ) + ')' },
		m : { k  : MONTH,       fn : _zeroIndexedInt, re : re_d2 },
		M : { k  : MONTH,       fn : _indexOf.bind( N, SHORT_MONTHS ),  re : '(' + SHORT_MONTHS.join( '|' ) + ')' },
		n : { k  : MONTH,       fn : _zeroIndexedInt, re : re_d1_2 },
		t : { re : '[0-9]{2}' },
// year
		L : { re : '(?:0|1)' },
		o : { k  : YEAR,        fn : Number,                            re : re_d4 },
		Y : { k  : YEAR,        fn : Number,                            re : re_d4 },
		y : { k  : YEAR,        fn : function( o ) { o = Number( o ); return o += ( o < 30 ? 2000 : 1900 ); }, re : re_d2 },
// time
		a : { k  : AMPM,        fn : retVal,                            re : re_ampm },
		A : { k  : AMPM,        fn : _lc,                               re : _uc( re_ampm ) },
		g : { k  : HOUR,        fn : _24hrTime,                         re : re_d1_2 },
		G : { k  : HOUR,        fn : Number,                            re : re_d1_2 },
		h : { k  : HOUR,        fn : _24hrTime,                         re : re_d2 },
		H : { k  : HOUR,        fn : Number,                            re : re_d2 },
		i : { k  : MINUTE,      fn : Number,                            re : re_d2 },
		s : { k  : SECOND,      fn : Number,                            re : re_d2 },
		u : { k  : MILLISECOND, fn : Number,                            re : '([0-9]{1,})' },
// timezone
		O : { k  : TIMEZONE,    fn : _timezoneOffset,                   re : '([\\+-][0-9]{4})' },
		P : { k  : TIMEZONE,    fn : _timezoneOffset,                   re : '([\\+-][0-9]{2}:[0-9]{2})' },
		T : { re : '[A-Z]{1,4}' },
		Z : { k  : TIMEZONE,    fn : Number,                            re : '([\\+-]?[0-9]{5})' },
// full date/time
		U : { k  : UNIX,        fn : Number,                            re : '(-?[0-9]{1,})'  }
	};

	parser.c = {
		combo : [parser.Y, parser.m, parser.d, parser.H, parser.i, parser.s, parser.P],
		re    : [parser.Y.re, '-', parser.m.re, '-', parser.d.re, 'T', parser.H.re, ':', parser.i.re, ':', parser.s.re, parser.P.re].join( '' )
	};
	parser.r = {
		combo : [parser.D, parser.d, parser.M, parser.Y, parser.H, parser.i, parser.s, parser.O],
		re    : [parser.D.re, ', ', parser.d.re, ' ', parser.M.re, ' ', parser.Y.re, ' ', parser.H.re, ':', parser.i.re, ':', parser.s.re, ' ', parser.O.re].join( '' )
	};
