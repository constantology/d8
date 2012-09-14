;!function( util ) {
	"use strict";
	util.x.cache( 'Date', function( Type ) {

/*~  d8/src/utils.js  ~*/
// utility methods
	function _indexOf( o, k ) { var i = o.indexOf( k ); return i == -1 ? null : i; }
	function _lc( o ) { return o.toLowerCase(); }
	function _substr( s ) { return s.substring( 0, 3 ); }
	function _uc( o ) { return o.toUpperCase(); }
	function associate( o, k ) { return o.reduce( function( res, v, i ) { res[k[i]] = v; return res; }, {} ); }
	function between_equalto( v, l, h ) { return l <= v && v <= h; }
	function pad( o, len, radix ) {
		var i = -1, s = o.toString( radix || 10 );
		len -= s.length;
		while ( ++i < len ) s = '0' + s;
		return s;
	}
	function pluck( a, k ) { return a.reduce( function( v, o ) { !( k in o ) || v.push( o[k] ); return v; }, [] ); }
	function sum( v, i ) { return v + i; }

/*~  d8/src/fns.js  ~*/
// private methods
	function _24hrTime( o, res ) { return ( o = Number( o ) ) < 12 && _lc( res.ampm ) == _lc( LOCALE.PM ) ? o += 12 : o; }
	function _adjust( d, v, k ) { return d.adjust( k, v ); }
	function _dayOffset( d ) { return Math.floor( ( d - getISOFirstMondayOfYear.call( d ) ) / MS_DAY ); }
	function _timezoneOffset( o ) {
		var t = !!o.indexOf( '-' ),
			m = o.match( re_tz_off ),
			v = ( Number( m[1] ) + ( m[2] / 60 ) ) * 3600;
		return t ? v : -v;
	}
	function _weekOffset( d ) { return Math.floor( Math.abs( _dayOffset( d ) / 7 ) ); }
	function _zeroIndexedInt( o, k ) { return !isNaN( k ) ? k == o ? 0 : Number( k ) : Number( o ) - 1; }

// public methods

	function adjust( o, v ) {
		if ( util.nativeType( o ) == 'object' ) {
			Object.reduce( o, _adjust, this );
			return this;
		}
		var day, fn = adjust_by[o.toLowerCase()], weekday;
		if ( !fn || v === 0 ) return this;
		LOCALE.setLeapYear( this );
		if ( fn == adjust_by.month ) {
			day = this.getDate();
			day < 28 || this.setDate( Math.min( day, getLastOfTheMonth.call( getFirstOfTheMonth.call( this ).adjust( Type.MONTH, v ) ) ).getDate() );
		}
		fn != adjust_by.week || ( weekday = this.getDay() );
		this[fn[1]]( this[fn[0]]() + v );
		!weekday || this.setDate( this.getDate() + weekday );
		return this;
	}

	function between( l, h ) { return this >= l && this <= h; }

	function clearTime() {
		this.setHours( 0 ); this.setMinutes( 0 ); this.setSeconds( 0 ); this.setMilliseconds( 0 );
		return this;
	}

	function clone() { return new Type( this.getTime() ); }

	function getDayOfYear() {
		LOCALE.setLeapYear( this );
		return LOCALE.day_count.slice( 0, this.getMonth() ).reduce( sum, 0 ) + this.getDate() - 1;
	}

	function getFirstOfTheMonth() { return new Type( this.getFullYear(), this.getMonth(), 1 ); }

	function getGMTOffset( colon ) {
		var tz = this.getTimezoneOffset();
		return [( tz > 0 ? '-' : '+' ), pad( Math.floor( Math.abs( tz ) / 60 ), 2 ), ( colon ? ':' : '' ), pad( Math.abs( tz % 60 ), 2 )].join( '' );
	}

	function getISODay() { return this.getDay() || 7; }
	function getISODaysInYear() { return Math.ceil( ( getISOFirstMondayOfYear.call( new Type( this.getFullYear() + 1, 0, 1 ) ) - getISOFirstMondayOfYear.call( this ) ) / MS_DAY ); }
	function getISOFirstMondayOfYear() {
		var y = this.getFullYear();
		return new Type( y, 0, DAY_OFFSETS[new Type( y, 0, 1 ).getDay()] );
	}
	function getISOWeek() {
		var w, y = this.getFullYear();
		if ( this >= getISOFirstMondayOfYear.call( new Type( y + 1, 0, 1 ) ) ) return 1;
		w = Math.floor( ( getDayOfYear.call( this ) - getISODay.call( this ) + 10 ) / 7 );
		return w == 0 ? getISOWeeksInYear.call( new Type( y - 1, 0, 1 ) ) - _weekOffset( this ) : w;
	}
	function getISOWeeksInYear() { return Math.round( ( getISOFirstMondayOfYear.call( new Type( this.getFullYear() + 1, 0, 1 ) ) - getISOFirstMondayOfYear.call( this ) ) / MS_WEEK ); }

	function getLastOfTheMonth() {
		var m = this.getMonth(); LOCALE.setLeapYear( this );
		return new Type( this.getFullYear(), m, LOCALE.day_count[m] );
	}

	function getWeek() { return Math.floor( getDayOfYear.call( this ) / 7 ); }

	function isDST() { return new Type( this.getFullYear(), 0, 1 ).getTimezoneOffset() != this.getTimezoneOffset(); }

	function isLeapYear() { return LOCALE.isLeapYear( this.getFullYear() ); }

	function setWeek( v ) { this.setMonth( 0 ); this.setDate( 1 ); return ( this.adjust( Type.DAY, v * 7 ) ).getTime(); }

	function timezone() {
		var s = this.toString().split( ' ' );
		return s.splice( 4, s.length ).join( ' ' ).replace( re_tz, '$1' ).replace( re_tz_abbr, '' );
	}

/*~  d8/src/format.js  ~*/
	function buildTemplate( o ) {
		if ( cache_format[o] ) return cache_format[o];

		var fn = ['var out=[];'], i = -1, p, parts = o.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ), re_invalid = /^[^A-Za-z]*$/g, l = parts.length;

		while( ++i < l ) {
			p = parts[i];
			p == NOREPLACE ? ( fn.push( tplOut( parts[++i] ) ), ++i )
						   :   re_invalid.test( p )
						   ?   fn.push( tplOut( p ) )
						   :   fn.push( compileTplStr( p ) );
		}

		fn.push( 'return out.join( "" );' );

		return cache_format[o] = new Function( 'filter', 'date', fn.join( '\n' ) );
	}

	function format( f ) { return buildTemplate( f )( filter, this ); }

	function compileTplStr( o ) { return o.replace( re_compile, function( m, p0, p1, p2 ) { return tplOut( p0 + '\', filter.' + p1 + '( date ), \'' + p2 ); } ); }

	function tplOut( s ) { return 'out.push( \'' + s + '\' );'; }

/*~  d8/src/toDate.js  ~*/
	function buildParser( o ) {
		if ( cache_parse[o] ) return cache_parse[o];
		var fn = {}, keys = [], i = -1, parts = o.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ),
			l = parts.length, p, re = [];

		while ( ++i < l ) {
			p = parts[i];
			if ( p == NOREPLACE ) {
				re.push( parts[++i] ); ++i; continue;
			}
			p.replace( re_compile, function( m, p1, p2, p3 ) {
				var _fn, _k, _p;
				if ( !( _p = parser[p2] ) ) return;
				if ( _p.k ) {
					keys.push( _p.k );
					if ( _p.fn ) fn[_p.k] = _p.fn;
				}
				if ( _p.combo ) {
					_k  = pluck( _p.combo, 'k' );
					_fn = associate( pluck( _p.combo, 'fn' ), _k );
					keys.push.apply( keys, _k );
					util.copy( fn, _fn, true );
				}
				if ( _p.re ) re.push( p1, _p.re, p3 );
			} );
		}
		return cache_parse[o] = parse.bind( null, new RegExp( re.join( '' ) ), keys, fn );
	}

	function parse( re, keys, fn, s ) {
		var d = new Type(), m = s.match( re ), o = associate( m.slice( 1 ), keys );

		Object.reduce( o, function( n, v, k ) { if ( fn[k] ) o[k] = fn[k]( v, o ); return n; }, null );

		if ( !isNaN( o[UNIX] ) ) d.setTime( o[UNIX] );
		else {
			parse_setTime( d, o[HOUR], o[MINUTE], o[SECOND], o[MILLISECOND] );
			parse_setDate( d, o );
			parse_setTimezoneOffset( d, o[TIMEZONE] );
		}

		return d;
	}

	function parse_setDate( d, o ) {
		var dw, l, ly, odc, i = -1;

		if ( date_members.every( util.has.bind( null, o ) ) ) return; //  only set the date if there's one to set (i.e. the format is not just for time)

		if ( isNaN( o[YEAR] ) ) o[YEAR] = d.getFullYear();

		if ( isNaN( o[MONTH] ) ) {
			ly = LOCALE.isLeapYear( o[YEAR] ) ? 1 : 0; odc = LOCALE.ordinal_day_count[ly]; l = odc.length; o[MONTH] = 0;

			if ( o[WEEK] && !o[DAYYEAR] ) { // give precedence to the day of the year
				dw = o[DAYWEEK];
				dw = isNaN( dw ) ? 0 : !dw ? 7 : dw;
				o[DAYYEAR] = ( o[WEEK] * 7 ) - ( 4 - dw );
			}

			if ( !isNaN( o[DAYYEAR] ) ) {
				if ( o[DAYYEAR] > odc[odc.length - 1] ) {
					o[DAYYEAR] -= odc[odc.length - 1];
					++o[YEAR];
				}
				while( ++i < l ) {
					if ( between_equalto( o[DAYYEAR], odc[i], odc[i+1] ) ) {
						o[MONTH] = i;
						o[DAY] = odc[i] == 0 ? o[DAYYEAR] : ( o[DAYYEAR] - odc[i] );
						break;
					}
				}
			}
		}

		if ( isNaN( o[DAY] ) ) o[DAY] = 1;

		d.setYear( o[YEAR] ); d.setMonth( o[MONTH] ); d.setDate( o[DAY] );

	}
	function parse_setTime( d, h, m, s, ms ) {
		d.setHours( h || 0 );   d.setMinutes( m || 0 );
		d.setSeconds( s || 0 ); d.setMilliseconds( ms || 0 );
	}
	function parse_setTimezoneOffset( d, tzo ) {
		!between_equalto( tzo, -43200, 50400 ) || d.adjust( Type.SECOND, ( -d.getTimezoneOffset() * 60 ) - tzo );
	}

	function toDate( s, f ) { return buildParser( f )( s ); }

/*~  d8/src/vars.js  ~*/
	var LOCALE = Type.locale, U,
// DAY_OFFSETS is the amount of days from the current day to the Monday of the week it belongs to
		DAY_OFFSETS = [9, 1, 0, -1, -2, 4, 3],    MS_DAY       = 864e5, MS_WEEK = 6048e5,
		SHORT_DAYS  = LOCALE.days.map( _substr ), SHORT_MONTHS = LOCALE.months.map( _substr ),
// parser keys
		AMPM  = 'ampm',  DAY    = 'day',    DAYWEEK  = 'dayweek',  DAYYEAR = 'dayyear', HOUR = 'hour', MILLISECOND = 'ms', MINUTE ='minute',
		MONTH = 'month', SECOND = 'second', TIMEZONE = 'timezone', UNIX    = 'unix',    WEEK = 'week', YEAR        = 'year',
// used by Date.prototype.format && Date.toDate to replace escaped chars
		NOREPLACE = 'NOREPLACE', NOREPLACE_RB = '<' + NOREPLACE + '<', NOREPLACE_RE   = '>END' + NOREPLACE + '>',
		adjust_by = { day : ['getDate', 'setDate'], hr : ['getHours', 'setHours'], min : ['getMinutes', 'setMinutes'], month : ['getMonth', 'setMonth'], ms : ['getMilliseconds', 'setMilliseconds'], sec : ['getSeconds', 'setSeconds'], week : ['getWeek', 'setWeek'], year : ['getFullYear', 'setFullYear'] },
// cache objects
		cache_format = {}, cache_parse  = {}, date_members = [DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR],
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
		combo : [parser.Y, parser.m, parser.d, parser.H, parser.i, parser.s, parser.P],
		re    : [parser.Y.re, '-', parser.m.re, '-', parser.d.re, 'T', parser.H.re, ':', parser.i.re, ':', parser.s.re, parser.P.re].join( '' )
	};
	parser.r = {
		combo : [parser.D, parser.d, parser.M, parser.Y, parser.H, parser.i, parser.s, parser.O],
		re    : [parser.D.re, ', ', parser.d.re, ' ', parser.M.re, ' ', parser.Y.re, ' ', parser.H.re, ':', parser.i.re, ':', parser.s.re, ' ', parser.O.re].join( '' )
	};

/*~  d8/src/expose.js  ~*/
// instance methods
	util.defs( Type.prototype, {
		adjust             : adjust,             between                 : between,                 clearTime    : clearTime,
		clone              : clone,              format                  : format,                  getDayOfYear : getDayOfYear,
		getFirstOfTheMonth : getFirstOfTheMonth, getGMTOffset            : getGMTOffset,            getISODay    : getISODay,
		getISODaysInYear   : getISODaysInYear,   getISOFirstMondayOfYear : getISOFirstMondayOfYear, getISOWeek   : getISOWeek,
		getISOWeeksInYear  : getISOWeeksInYear,  getLastOfTheMonth       : getLastOfTheMonth,       getWeek      : getWeek,
		isDST              : isDST,              isLeapYear              : isLeapYear,              setWeek      : setWeek,
		timezone           : timezone
	}, 'r' );

// static methods & properties
	util.defs( Type, {
// constants used by Date.prototype.adjust
		DAY : DAY, HOUR : 'hr', MINUTE : MINUTE.substring( 0, 3 ), MILLISECOND : MILLISECOND, MONTH : MONTH, SECOND : SECOND.substring( 0, 3 ), WEEK : WEEK, YEAR : YEAR,
// constants defining milliseconds for different times
		MS_DAY : MS_DAY, MS_WEEK : MS_WEEK, MS_MONTH : 2592e6, MS_YEAR : 31536e6,
// filters and formats
		filters : { value : filter }, formats : { value : formats }, parsers : { value : parser },
// static methods
		getOrdinal : LOCALE.getOrdinal, isLeapYear : LOCALE.isLeapYear, setLeapYear : LOCALE.setLeapYear, toDate : toDate
	}, 'r' );

	} ).x( Date );
// at this point we don't know if util is available or not, and as such do not know what environment we are in.
// so, we check and do what is required.
}( typeof m8 != 'undefined' ? m8 : typeof require != 'undefined' ? require( 'm8' ) : null );
