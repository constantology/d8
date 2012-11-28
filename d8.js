;!function( util ) {
	"use strict";
	util.x.cache( 'Date', function( Type ) {

/*~  src/utils.js  ~*/
// utility methods
	function _indexOf( o, k ) { var i = o.indexOf( k ); return i == -1 ? null : i; }
	function _lc( o ) { return o.toLocaleLowerCase(); }
	function _uc( o ) { return o.toLocaleUpperCase(); }
	function associate( o, k ) { return o.reduce( function( res, v, i ) { res[k[i]] = v; return res; }, {} ); }
	function between_equalto( v, l, h ) { return l <= v && v <= h; }
	function pad( o, len, radix ) {
		var i = -1, s = o.toString( radix || 10 );
		len -= s.length;
		while ( ++i < len ) s = '0' + s;
		return s;
	}
	function sum( v, i ) { return v + i; }

/*~  src/vars.js  ~*/
	var U,
// DAY_OFFSETS is the amount of days from the current day to the Monday of the week it belongs to
		DAY_OFFSETS  = [9, 1, 0, -1, -2, 4, 3],    MS_DAY       = 864e5,     MS_HOUR = 3600000,   MS_MINUTE = 60000,
		MS_MONTH     = 2592e6, MS_SECOND = 1000,   MS_WEEK      = 6048e5,    MS_YEAR = 31536e6,
// parser keys
		AMPM         = 'ampm', DAY    = 'day',     DAYWEEK      = 'dayweek', DAYYEAR = 'dayyear', HOUR      = 'hour',
		MILLISECOND  = 'ms',   MINUTE = 'minute',  MONTH        = 'month',   SECOND  = 'second',  TIMEZONE  = 'timezone',
		UNIX         = 'unix', WEEK   = 'week',    YEAR         = 'year',
// used by Date.prototype.format && Date.toDate to replace escaped chars
		NOREPLACE    = 'NOREPLACE', NOREPLACE_RB = '<' + NOREPLACE + '<', NOREPLACE_RE = '>END' + NOREPLACE + '>',
		adjust_by    = { day : ['getDate', 'setDate'], hr : ['getHours', 'setHours'], min : ['getMinutes', 'setMinutes'], month : ['getMonth', 'setMonth'], ms : ['getMilliseconds', 'setMilliseconds'], sec : ['getSeconds', 'setSeconds'], week : ['getWeek', 'setWeek'], year : ['getFullYear', 'setFullYear'] },
		adjust_order = [YEAR, MONTH, WEEK, DAY, 'hr', MINUTE.substring( 0, 3 ), SECOND.substring( 0, 3 ), MILLISECOND],
// cache objects
		cache_format = util.obj(), cache_parse  = util.obj(), date_members = [DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR],
		filter, filter_chars, formats, lexicon  = util.obj(), locales      = util.obj(), m, parser,
		re_ampm     = '(am|pm)',      re_add_enr = />/g,         re_add_nr = /</g, re_compile,
		re_d1_2     = '([0-9]{1,2})', re_d2      = '([0-9]{2})', re_d4     = '([0-9]{4})',
		re_space    = /\s{2,}/g,      re_split   = /[<>]/,       re_tz     = /[^\(]*\(([^\)]+)\)/g,
		re_tz_abbr  = /[^A-Z]+/g,     re_tz_off  = /[\+-]?([0-9]{2}):?([0-9]{2})/,
		time_map     = [              // the order of this Array is important as it is the remainder of the larger
			[YEAR   + 's', MS_YEAR],  // time unit that gets passed to the following time unit — as such we want
			[MONTH  + 's', MS_MONTH], // to keep the order in case we want to exclude time units from the diff
			[WEEK   + 's', MS_WEEK],
			[DAY    + 's', MS_DAY],
			[HOUR   + 's', MS_HOUR],
			[MINUTE + 's', MS_MINUTE],
			[SECOND + 's', MS_SECOND],
			[MILLISECOND,  1]
		],
		time_props   = time_map.pluck( 0 );

/*~  src/coerce.js  ~*/
	function coerce( date_str, date_format ) {
		return buildParser( date_format )( date_str );
	}

	function buildParser( date_format ) {
		var LID = Type.locale.id, i, keys, l, parsers, part, parts, re;

		if ( cache_parse[LID][date_format] ) return cache_parse[LID][date_format];

		parts = date_format.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split );
		keys  = []; i = -1; l = parts.length; parsers = {}; re = [];

		while ( ++i < l ) {
			part = parts[i];
			if ( part == NOREPLACE ) {
				re.push( parts[++i] ); ++i;
				continue;
			}
			part.replace( re_compile, function( m, p1, p2, p3 ) {
				var _fn, _k, _p;
				if ( !( _p = parser[p2] ) ) return;
				if ( _p.k ) {
					keys.push( _p.k );
					if ( _p.fn ) parsers[_p.k] = _p.fn;
				}
				if ( _p.combo ) {
					_k  = _p.combo.pluck( 'k' );
					_fn = associate( _p.combo.pluck( 'fn' ), _k );
					keys.push.apply( keys, _k );
					util.copy( parsers, _fn, true );
				}
				if ( _p.re ) re.push( p1, _p.re, p3 );
			} );
		}
		return cache_parse[LID][date_format] = parse.bind( null, new RegExp( re.join( '' ) ), keys, parsers );
	}

	function parse( re, keys, fn, s ) {
		var date    = new Type(), parts = s.match( re ),
			parsers = associate( parts.slice( 1 ), keys );

		Object.reduce( parsers, function( n, v, k ) {
			if ( typeof v == 'string' && fn[k] )
				parsers[k] = fn[k]( v, parsers );
			return n;
		}, null );

		if ( !isNaN( parsers[UNIX] ) ) date.setTime( parsers[UNIX] );
		else {
			parse_setTime( date, parsers[HOUR], parsers[MINUTE], parsers[SECOND], parsers[MILLISECOND] );
			parse_setDate( date, parsers );
			parse_setTimezoneOffset( date, parsers[TIMEZONE] );
		}

		return date;
	}

	function parse_setDate( date, parsers ) {
		var L = Type.locale, dayweek, i = -1, l, leapyr, ordinal;

		if ( date_members.every( util.has.bind( null, parsers ) ) ) return; //  only set the date if there's one to set (i.e. the format is not just for time)

		if ( isNaN( parsers[YEAR] ) ) parsers[YEAR] = date.getFullYear();

		if ( isNaN( parsers[MONTH] ) ) {
			leapyr  = L.isLeapYear( parsers[YEAR] ) ? 1 : 0;
			ordinal = L.ordinal_day_count[leapyr];
			l       = ordinal.length;
			parsers[MONTH] = 0;

			if ( parsers[WEEK] && !parsers[DAYYEAR] ) { // give precedence to the day of the year
				dayweek = parsers[DAYWEEK];
				dayweek = isNaN( dayweek ) ? 0 : !dayweek ? 7 : dayweek;
				parsers[DAYYEAR] = ( parsers[WEEK] * 7 ) - ( 4 - dayweek );
			}

			if ( !isNaN( parsers[DAYYEAR] ) ) {
				if ( parsers[DAYYEAR] > ordinal[ordinal.length - 1] ) {
					parsers[DAYYEAR] -= ordinal[ordinal.length - 1];
					++parsers[YEAR];
				}
				while( ++i < l ) {
					if ( between_equalto( parsers[DAYYEAR], ordinal[i], ordinal[i+1] ) ) {
						parsers[MONTH] = i;
						parsers[DAY] = ordinal[i] == 0 ? parsers[DAYYEAR] : ( parsers[DAYYEAR] - ordinal[i] );
						break;
					}
				}
			}
		}

		if ( isNaN( parsers[DAY] ) ) parsers[DAY] = 1;

		date.setYear( parsers[YEAR] ); date.setMonth( parsers[MONTH] ); date.setDate( parsers[DAY] );

	}
	function parse_setTime( date, hr, min, sec, ms ) {
		date.setHours( hr || 0 );   date.setMinutes( min || 0 );
		date.setSeconds( sec || 0 ); date.setMilliseconds( ms || 0 );
	}
	function parse_setTimezoneOffset( date, tzoffset ) {
		!between_equalto( tzoffset, -43200, 50400 ) || date.adjust( Type.SECOND, ( -date.getTimezoneOffset() * 60 ) - tzoffset );
	}

/*~  src/diff.js  ~*/
	function diff( now, props ) { //noinspection FallthroughInSwitchStatementJS
		switch ( util.ntype( now ) ) {
			case 'number' : case 'string' :
				if ( valid( new Type( now ) ) )
					now = new Type( now );
				else {
					if ( !props ) props = now;

					now = Type.now();

					break;
				}                                                  // allow [specific] fall-through
			case 'array'  : case 'object' :
				props   = now;
				now     = Type.now();
				break;
			case 'date'   : if ( valid( new Type( +now ) ) ) break; // allow [conditional] fall-through if not a valid date
			default       : now = Type.now();

		}

		var diff,
			ms    = +now - +this,
			tense = ms < 0 ? 1 : ms > 0 ? -1 : 0;

		if ( !tense ) {
			diff       = util.obj();
			diff.value = 0;
		}
		else
			diff = diff_get( Math.abs( ms ), diff_get_exclusions( props ) );

		diff.tense = tense;

		return diff;
	}

	function diff_eval( diff, calc, i, calcs ) {
		var time;
		if ( diff.__ms__ ) {
			if ( !diff.excl[calc[0]] ) {
				if ( diff.__ms__ >= calc[1] ) {

					time = diff.__ms__ / calc[1];

					if ( !( calc[0] in diff.val ) ) {
						diff.__ms__       = ( time % 1 ) * calc[1];
						diff.val[calc[0]] = Math.floor( time );
					}
					else {
						time                 = Math.floor( time );
						diff.__ms__       -= time * calc[1];
						diff.val[calc[0]] += time;
					}

				}
				return diff;
			}
// round up or down depending on what's available
			if ( ( !calcs[i + 1] || diff.excl[calcs[i + 1][0]] ) && ( calc = calcs[i - 1] ) ) {
				time          = diff.__ms__ / calc[1];
				diff.__ms__ = ( Math.round( time ) * calc[1] ) + ( ( ( diff.__ms__ / calcs[i][1] ) % 1 ) * calcs[i][1] );
				return diff_eval( diff, calc, i - 1, [] );
			}
			return diff;
		}
		return diff;
	}

	function diff_get( ms, excl ) {
		var diff = time_map.reduce( diff_eval, {
				__ms__ : ms, excl : excl, val : util.obj()
			} ).val;

		diff.value = ms;

		return diff;
	}

	function diff_get_exclusions( props ) {
		var excl = util.obj(), incl_remaining = true;

		if ( props ) { //noinspection FallthroughInSwitchStatementJS
			switch ( util.ntype( props ) ) {
				case 'object' : incl_remaining = false; break;
				case 'string' : props          = props.split( ' ' ); // allow fall-through
				case 'array'  : props          = props.reduce( diff_excl, excl );
								incl_remaining = !!util.len( excl );
			}
		}

		diff_props.map( function( prop ) {
			if ( !( prop in this ) )
				this[prop] = !incl_remaining;
		}, excl );

		return excl;
	}

	function diff_excl( excl, val ) {
		var prop = ( val = String( val ).toLowerCase() ).substring( 1 );

		switch ( val.charAt( 0 ) ) {
			case '-' : excl[prop] = true;  break;
			case '+' : excl[prop] = false; break;
			case '>' :
				diff_calc.map( diff_excl_iter, { excl : excl, prop : prop, val : true } );
				break;
			case '<' :
				diff_calc.slice().reverse().map( diff_excl_iter, { excl : excl, prop : prop, val : false } );
				break;
			default  : excl[val]  = false;
		}

		return excl;
	}

	function diff_excl_iter( calc ) {
		if ( calc[0] === this.prop )
			this.SET_VALID = true;
		if ( this.SET_VALID )
			this.excl[calc[0]] = this.val;
	}

/*~  src/vars.js  ~*/
	var LOCALE = Type.locale, U,
// DAY_OFFSETS is the amount of days from the current day to the Monday of the week it belongs to
		DAY_OFFSETS = [9, 1, 0, -1, -2, 4, 3],    MS_DAY       = 864e5,  MS_HOUR = 3600000, MS_MINUTE = 60000,
		MS_MONTH    = 2592e6, MS_SECOND = 1000,   MS_WEEK      = 6048e5, MS_YEAR = 31536e6,
		SHORT_DAYS  = LOCALE.days.map( _substr ), SHORT_MONTHS = LOCALE.months.map( _substr ),
// parser keys
		AMPM  = 'ampm',  DAY    = 'day',    DAYWEEK  = 'dayweek',  DAYYEAR = 'dayyear', HOUR = 'hour', MILLISECOND = 'ms', MINUTE ='minute',
		MONTH = 'month', SECOND = 'second', TIMEZONE = 'timezone', UNIX    = 'unix',    WEEK = 'week', YEAR        = 'year',
// used by Date.prototype.format && Date.toDate to replace escaped chars
		NOREPLACE    = 'NOREPLACE', NOREPLACE_RB = '<' + NOREPLACE + '<', NOREPLACE_RE   = '>END' + NOREPLACE + '>',
		adjust_by    = { day : ['getDate', 'setDate'], hr : ['getHours', 'setHours'], min : ['getMinutes', 'setMinutes'], month : ['getMonth', 'setMonth'], ms : ['getMilliseconds', 'setMilliseconds'], sec : ['getSeconds', 'setSeconds'], week : ['getWeek', 'setWeek'], year : ['getFullYear', 'setFullYear'] },
		adjust_order = [YEAR, MONTH, WEEK, DAY, 'hr', MINUTE.substring( 0, 3 ), SECOND.substring( 0, 3 ), MILLISECOND],
// cache objects
		cache_format = {}, cache_parse  = {}, date_members = [DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR],
		diff_calc    = [                 // the order of this Array is important as it is the remainder of the larger
			[YEAR   + 's', MS_YEAR],  // time unit that gets passed to the following time unit — as such we want
			[MONTH  + 's', MS_MONTH], // to keep the order in case we want to exclude time units from the diff
			[WEEK   + 's', MS_WEEK],
			[DAY    + 's', MS_DAY],
			[HOUR   + 's', MS_HOUR],
			[MINUTE + 's', MS_MINUTE],
			[SECOND + 's', MS_SECOND],
			[MILLISECOND,  1]
		],
		diff_props   = diff_calc.map( function( calc ) { return calc[0]; } ),
		filter       = {
// day
			d : function( d ) { return pad( d.getDate(), 2 ); },                                    // Day of the month, 2 digits with leading zeros
			D : function( d ) { return LOCALE.days[d.getDay()].substring( 0, 3 ); },                // A textual representation of a day, three letters
			j : function( d ) { return d.getDate(); },                                              // Day of the month without leading zeros
			l : function( d ) { return LOCALE.days[d.getDay()]; },                                  // A full textual representation of the day of the week
			N : function( d ) { return getISODay.call( d ); },                                      // ISO-8601 numeric representation of the day of the week
			S : function( d ) { return LOCALE.getOrdinal( d.getDate() ); },                         // English ordinal suffix for the day of the month, 2 characters
			w : function( d ) { return d.getDay(); },                                               // Numeric representation of the day of the week
			z : function( d ) { return d.getDayOfYear(); },                                         // The day of the year (starting from 0)
// week
			W : function( d ) { return getISOWeek.call( d ); },                                     // ISO-8601 week number of year, weeks starting on Monday
// month
			F : function( d ) { return LOCALE.months[d.getMonth()]; },                              // A full textual representation of a month
			m : function( d ) { return pad( ( d.getMonth() + 1 ), 2 ); },                           // Numeric representation of a month, with leading zeros
			M : function( d ) { return LOCALE.months[d.getMonth()].substring( 0, 3 ); },            // A short textual representation of a month, three letters
			n : function( d ) { return d.getMonth() + 1; },                                         // Numeric representation of a month, without leading zeros
			t : function( d ) { LOCALE.setLeapYear( d ); return LOCALE.day_count[d.getMonth()]; },  // Number of days in the given month
// year
			L : function( d ) { return d.isLeapYear() ? 1 : 0; },                                   // Whether it's a leap year
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
			P : function( d ) { return getGMTOffset.call( d, true ); },                             // Difference to Greenwich time (GMT) with colon between hours and minutes
			T : function( d ) { return timezone.call( d ); },                                       // Timezone abbreviation
			Z : function( d ) { return d.getTimezoneOffset() * -60; },                              // Timezone offset in seconds. The offset for timezones west of UTC
																									// is always negative, and for those east of UTC is always positive.
// full date/time
			c : function( d ) { return format.call( d, formats.ISO_8601 ); },                       // ISO 8601 date
			r : function( d ) { return format.call( d, formats.RFC_2822 ); },                       // RFC 2822 formatted date
			U : function( d ) { return d.getTime(); }                                               // Seconds since the Unix Epoch January 1 1970 00:00:00 GMT
		},
		filter_chars = Object.keys( filter ).sort().join( '' ),
		formats   = util.copy( {
			ISO_8601 : 'Y-m-d<T>H:i:s.u<Z>', ISO_8601_SHORT : 'Y-m-d',
			RFC_850  : 'l, d-M-y H:i:s T',   RFC_2822       : 'D, d M Y H:i:s O',
			sortable : 'Y-m-d H:i:sO'
		}, LOCALE.formats ),
		m,
		re_ampm    = '(am|pm)',      re_add_enr = />/g,                  re_add_nr  = /</g,
		re_compile = new RegExp( '([^' + filter_chars + ']*)([' + filter_chars + '])([^' + filter_chars + ']*)', 'g' ),
		re_d1_2    = '([0-9]{1,2})', re_d2      = '([0-9]{2})',          re_d4      = '([0-9]{4})',
		re_split   = /[<>]/,         re_tz      = /[^\(]*\(([^\)]+)\)/g, re_tz_abbr = /[^A-Z]+/g,
		re_tz_off  = /[\+-]?([0-9]{2}):?([0-9]{2})/,
		parser = {
// day
			d : { k  : DAY,         fn : Number,                               re : re_d2 },
			D : { k  : DAYWEEK,     fn : _indexOf.bind( null, SHORT_DAYS ),    re : '(' + SHORT_DAYS.join( '|' ) + ')' },
			j : { k  : DAY,         fn : Number,                               re : re_d1_2 },
			l : { k  : DAYWEEK,     fn : _indexOf.bind( null, LOCALE.days ),   re : '(' + LOCALE.days.join( '|' ) + ')' },
			N : { k  : DAYWEEK,     fn : _zeroIndexedInt.bind( null, 7 ),      re : '([1-7])' },
			S : { re : '(?:' + LOCALE.ordinal.join( '|' ) + ')' },
			w : { k  : DAYWEEK,     fn : Number,                               re : '([0-6])' },
			z : { k  : DAYYEAR,     fn : Number,                               re : '([0-9]{1,3})' },
// week
			W : { k  : WEEK,        fn : Number,                               re : re_d2 },
// month
			F : { k  : MONTH,       fn : _indexOf.bind( null, LOCALE.months ), re : '(' + LOCALE.months.join( '|' ) + ')' },
			m : { k  : MONTH,       fn : _zeroIndexedInt,                      re : re_d2 },
			M : { k  : MONTH,       fn : _indexOf.bind( null, SHORT_MONTHS ),  re : '(' + SHORT_MONTHS.join( '|' ) + ')' },
			n : { k  : MONTH,       fn : _zeroIndexedInt,                      re : re_d1_2 },
			t : { re : '[0-9]{2}' },
// year
			L : { re : '(?:0|1)' },
			o : { k  : YEAR,        fn : Number,                               re : re_d4 },
			Y : { k  : YEAR,        fn : Number,                               re : re_d4 },
			y : { k  : YEAR,        fn : function( o ) { o = Number( o ); return o += ( o < 30 ? 2000 : 1900 ); }, re : re_d2 },
// time
			a : { k  : AMPM,        fn : util,                                   re : re_ampm },
			A : { k  : AMPM,        fn : _lc,                                  re : _uc( re_ampm ) },
			g : { k  : HOUR,        fn : _24hrTime,                            re : re_d1_2 },
			G : { k  : HOUR,        fn : Number,                               re : re_d1_2 },
			h : { k  : HOUR,        fn : _24hrTime,                            re : re_d2 },
			H : { k  : HOUR,        fn : Number,                               re : re_d2 },
			i : { k  : MINUTE,      fn : Number,                               re : re_d2 },
			s : { k  : SECOND,      fn : Number,                               re : re_d2 },
			u : { k  : MILLISECOND, fn : Number,                               re : '([0-9]{1,})' },
// timezone
			O : { k  : TIMEZONE,    fn : _timezoneOffset,                      re : '([\\+-][0-9]{4})' },
			P : { k  : TIMEZONE,    fn : _timezoneOffset,                      re : '([\\+-][0-9]{2}:[0-9]{2})' },
			T : { re : '[A-Z]{1,4}' },
			Z : { k  : TIMEZONE,    fn : Number,                               re : '([\\+-]?[0-9]{5})' },
// full date/time
			U : { k  : UNIX,        fn : Number,                               re : '(-?[0-9]{1,})'  }
		};

	formats.atom = formats.ISO_8601; formats.cookie = formats.RFC_850; formats.rss = formats.RFC_2822;

	parser.c = {
		combo : [parser.Y, parser.m, parser.d, parser.H, parser.i, parser.s, parser.u, parser.P],
		re    : [parser.Y.re, '-', parser.m.re, '-', parser.d.re, 'T', parser.H.re, ':', parser.i.re, ':', parser.s.re, '(?:\\.', parser.u.re, '){0,1}', parser.P.re, '{0,1}'].join( '' )
	};
	parser.r = {
		combo : [parser.D, parser.d, parser.M, parser.Y, parser.H, parser.i, parser.s, parser.O],
		re    : [parser.D.re, ', ', parser.d.re, ' ', parser.M.re, ' ', parser.Y.re, ' ', parser.H.re, ':', parser.i.re, ':', parser.s.re, ' ', parser.O.re].join( '' )
	};

/*~  src/expose.js  ~*/
// instance methods
	util.defs( Type.prototype, {
		adjust       : adjust,       between            : between,            clearTime               : clearTime,
		clone        : clone,        diff               : diff,               format                  : format,
		getDayOfYear : getDayOfYear, getFirstOfTheMonth : getFirstOfTheMonth, getGMTOffset            : getGMTOffset,
		getISODay    : getISODay,    getISODaysInYear   : getISODaysInYear,   getISOFirstMondayOfYear : getISOFirstMondayOfYear,
		getISOWeek   : getISOWeek,   getISOWeeksInYear  : getISOWeeksInYear,  getLastOfTheMonth       : getLastOfTheMonth,
		getWeek      : getWeek,      isDST              : isDST,              isLeapYear              : isLeapYear,
		setWeek      : setWeek,      timezone           : timezone
	}, 'r' );

// static methods & properties
	util.defs( Type, {
// constants used by Date.prototype.adjust
		DAY : DAY, HOUR : 'hr', MINUTE : MINUTE.substring( 0, 3 ), MILLISECOND : MILLISECOND, MONTH : MONTH, SECOND : SECOND.substring( 0, 3 ), WEEK : WEEK, YEAR : YEAR,
// constants defining milliseconds for different times
		MS_DAY : MS_DAY, MS_HOUR : MS_HOUR, MS_MINUTE : MS_MINUTE, MS_MONTH : MS_MONTH, MS_SECOND : MS_SECOND, MS_WEEK : MS_WEEK, MS_YEAR : MS_YEAR,
// filters and formats
		filters : { value : filter }, formats : { value : formats }, parsers : { value : parser },
// static methods
		getOrdinal : LOCALE.getOrdinal, isLeapYear : LOCALE.isLeapYear, setLeapYear : LOCALE.setLeapYear, toDate : toDate
	}, 'r' );

	} ).x( Date );
// at this point we don't know if util is available or not, and as such do not know what environment we are in.
// so, we check and do what is required.
}( typeof m8 != 'undefined' ? m8 : typeof require != 'undefined' ? require( 'm8' ) : null );
