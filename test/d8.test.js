typeof m8   !== 'undefined' || ( m8   = require( 'm8' ) );
typeof chai !== 'undefined' || ( chai = require( 'chai' ) );

expect = chai.expect;

if ( m8.ENV == 'commonjs' ) {
	require( '../locale/en-GB' );
	require( '../d8' );
}

suite( 'd8', function() {

	function MockDate( o ) { for ( var k in o ) !Object.prototype.hasOwnProperty.call( o, k ) || ( this[k] = o[k] ); }
	MockDate.prototype = {
		getDate           : function() { return this.date;  }, getDay     : function() { return this.day;    },
		getFullYear       : function() { return this.year;  }, getHours   : function() { return this.hour;   },
		getMilliseconds   : function() { return this.ms;    }, getMinutes : function() { return this.minute; },
		getMonth          : function() { return this.month; }, getSeconds : function() { return this.second; },
		getTimezoneOffset : function() { return this.tzo;   }, toString   : function() { return this.str;    }
	};

	function call( fn, d ) {
		var a = slice.call( arguments, 2 );
		return DP[fn].apply( d, a );
	}

	var DP = Date.prototype, slice = [].slice;

	test( '<static> Date.getOrdinal returns the ordinal of a number', function( done ) {
		expect( Date.getOrdinal(  1 ) ).to.eql( 'st' );
		expect( Date.getOrdinal(  2 ) ).to.eql( 'nd' );
		expect( Date.getOrdinal(  3 ) ).to.eql( 'rd' );
		expect( Date.getOrdinal(  4 ) ).to.eql( 'th' );
		expect( Date.getOrdinal(  5 ) ).to.eql( 'th' );
		expect( Date.getOrdinal(  6 ) ).to.eql( 'th' );
		expect( Date.getOrdinal(  7 ) ).to.eql( 'th' );
		expect( Date.getOrdinal(  8 ) ).to.eql( 'th' );
		expect( Date.getOrdinal(  9 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 10 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 11 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 12 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 13 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 14 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 15 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 16 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 17 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 18 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 19 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 20 ) ).to.eql( 'th' );
		expect( Date.getOrdinal( 21 ) ).to.eql( 'st' );
		expect( Date.getOrdinal( 22 ) ).to.eql( 'nd' );
		expect( Date.getOrdinal( 23 ) ).to.eql( 'rd' );
		
		done();
	} );

	test( '<static> Date.isLeapYear verifies whether 4 digit year is a leap year or not', function( done ) {
		expect( Date.isLeapYear( 1600 ) ).to.be.true;
		expect( Date.isLeapYear( 1992 ) ).to.be.true;
		expect( Date.isLeapYear( 2000 ) ).to.be.true;
		expect( Date.isLeapYear( 2004 ) ).to.be.true;
		expect( Date.isLeapYear( 2008 ) ).to.be.true;
		expect( Date.isLeapYear( 2012 ) ).to.be.true;
		expect( Date.isLeapYear( 2024 ) ).to.be.true;
		expect( Date.isLeapYear( 2400 ) ).to.be.true;
		expect( Date.isLeapYear( 1700 ) ).to.be.false;
		expect( Date.isLeapYear( 1800 ) ).to.be.false;
		expect( Date.isLeapYear( 1900 ) ).to.be.false;
		expect( Date.isLeapYear( 1994 ) ).to.be.false;
		expect( Date.isLeapYear( 2001 ) ).to.be.false;
		expect( Date.isLeapYear( 2011 ) ).to.be.false;
		expect( Date.isLeapYear( 2013 ) ).to.be.false;
		expect( Date.isLeapYear( 2021 ) ).to.be.false;
		
		done();
	} );

	test( '<static> Date.toDate turns a Date String into a Date instance based on the passed format', function( done ) {
		expect( Date.toDate( 'Fri, 01 Jan 2010 00:00:00', 'D, d M Y H:i:s' ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( Date.toDate( 'Fri, 01 Jan 2010 00:00:00 GMT+0400',  'D, d M Y H:i:s <GMT>O' ) ).to.eql( new Date( 2009, 11, 31, 20 ) );
		expect( Date.toDate( 'Fri, 01 Jan 2010 00:00:00 GMT-08:00', 'D, d M Y H:i:s <GMT>P' ) ).to.eql( new Date( 2010,  0,  1,  8 ) );

		expect( Date.toDate( '1262304000000', 'U' ) ).to.eql( new Date( 2010,  0,  1 ) );

		expect( Date.toDate( '2010-31',   'Y-z'   ) ).to.eql( new Date( 2010,  0, 31 ) );
		expect( Date.toDate( '2010-166',  'Y-z'   ) ).to.eql( new Date( 2010,  5, 15 ) );
		expect( Date.toDate( '2010-365',  'Y-z'   ) ).to.eql( new Date( 2010, 11, 31 ) );
		expect( Date.toDate( '2010-24',   'Y-W'   ) ).to.eql( new Date( 2010,  5, 13 ) );

		expect( Date.toDate( '2010-24-1', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 14 ) );
		expect( Date.toDate( '2010-24-2', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 15 ) );
		expect( Date.toDate( '2010-24-3', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 16 ) );
		expect( Date.toDate( '2010-24-4', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 17 ) );
		expect( Date.toDate( '2010-24-5', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 18 ) );
		expect( Date.toDate( '2010-24-6', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 19 ) );
		expect( Date.toDate( '2010-24-7', 'Y-W-N' ) ).to.eql( new Date( 2010,  5, 20 ) );

		expect( Date.toDate( '2010-01-01T10:10:10+00:00', 'c' ) ).to.eql( new Date( 2010, 0, 1, 10, 10, 10 ) );
		expect( Date.toDate( '2010-01-01T10:10:10+04:00', 'c' ) ).to.eql( new Date( 2010, 0, 1,  6, 10, 10 ) );
		expect( Date.toDate( '2010-01-01T10:10:10-08:00', 'c' ) ).to.eql( new Date( 2010, 0, 1, 18, 10, 10 ) );

		var date   = Date.toDate( '2010-08-30T10:10:10+00:00', 'Y-m-d<T>H:i:sP' ),
			offset = date.isDST() ? 1 : 0;
		expect( Date.toDate( '2010-08-30T10:10:10+00:00', 'Y-m-d<T>H:i:sP' ) ).to.eql( new Date( 2010, 7, 30, ( 10 + offset ), 10, 10 ) );
		expect( Date.toDate( '2010-08-30T10:10:10+00:00', 'c' ) ).to.eql( new Date( 2010, 7, 30, 10 + offset, 10, 10 ) );
		expect( Date.toDate( '2010-08-30T10:10:10+04:00', 'c' ) ).to.eql( new Date( 2010, 7, 30,  6 + offset, 10, 10 ) );
		expect( Date.toDate( '2010-08-30T10:10:10-08:00', 'c' ) ).to.eql( new Date( 2010, 7, 30, 18 + offset, 10, 10 ) );
		
		done();
	} );

	test( 'Date.prototype.adjust: can adjust a Date instance by any unit of time', function( done ) {
		var r = new Date( 2010, 0, 1 );

		expect( r.adjust( Date.YEAR,    1 ) ).to.eql( new Date( 2011, 0, 1 ) );
		expect( r.adjust( Date.YEAR,   -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( Date.MONTH,   1 ) ).to.eql( new Date( 2010, 1, 1 ) );
		expect( r.adjust( Date.MONTH,  -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( Date.DAY,     1 ) ).to.eql( new Date( 2010, 0, 2 ) );
		expect( r.adjust( Date.DAY,    -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( Date.HOUR,    1 ) ).to.eql( new Date( 2010, 0, 1, 1 ) );
		expect( r.adjust( Date.HOUR,   -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( Date.MINUTE,  1 ) ).to.eql( new Date( 2010, 0, 1, 0, 1 ) );
		expect( r.adjust( Date.MINUTE, -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( Date.SECOND,  1 ) ).to.eql( new Date( 2010, 0, 1, 0, 0, 1 ) );
		expect( r.adjust( Date.SECOND, -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( Date.MILLISECOND,  1 ) ).to.eql( new Date( 2010, 0, 1, 0, 0, 0, 1 ) );
		expect( r.adjust( Date.MILLISECOND, -1 ) ).to.eql( new Date( 2010, 0, 1 ) );
		expect( r.adjust( { day :  1, hr :  1, min :  1, month :  1, ms :  1, sec :  1, year :  1 } ) ).to.eql( new Date( 2011, 1, 2, 1, 1, 1, 1 ) );
		expect( r.adjust( { day : -1, hr : -1, min : -1, month : -1, ms : -1, sec : -1, year : -1 } ) ).to.eql( new Date( 2010, 0, 1 ) );
		
		done();
	} );

	test( 'Date.prototype.between: verifies whether or not a Date instance is between 2 other Dates', function( done ) {
		expect( new Date( 2010, 0, 1, 1, 10, 10, 10 ).between( new Date( 2010, 0, 1, 1, 9, 10, 10 ), new Date( 2010, 0, 1, 1, 11, 10, 10 ) ) ).to.be.true;
		expect( new Date( 2010, 0, 1, 1, 10, 10, 10 ).between( new Date( 2010, 0, 1, 1, 10, 10, 9 ), new Date( 2010, 0, 1, 1, 10, 10, 11 ) ) ).to.be.true;
		expect( new Date( 2010, 0, 1, 1, 10, 10, 10 ).between( new Date( 2010, 0, 1, 1, 10, 10, 10 ), new Date( 2010, 0, 1, 1, 10, 10, 10 ) ) ).to.be.true;
		expect( new Date( 2010, 0, 1 ).between( new Date( 2009, 11, 31 ), new Date( 2010, 0, 2 ) ) ).to.be.true;
		expect( new Date( 2010, 0, 1 ).between( new Date( 2009, 4, 1 ), new Date( 2011, 8, 1 ) ) ).to.be.true;
		expect( new Date( 2010, 0, 1, 1, 10, 10, 10 ).between( new Date( 2010, 0, 1, 1, 11, 10, 10 ), new Date( 2010, 0, 1, 1, 12, 10, 10 ) ) ).to.be.false;
		expect( new Date( 2010, 0, 1, 1, 10, 10, 10 ).between( new Date( 2010, 0, 1, 1, 10, 10, 11 ), new Date( 2010, 0, 1, 1, 10, 10, 12 ) ) ).to.be.false;
		expect( new Date( 2010, 0, 1 ).between( new Date( 2010, 0, 2 ), new Date( 2010, 0, 3 ) ) ).to.be.false;
		expect( new Date( 2010, 0, 1, 1, 10, 10, 10 ).between( new Date( 2009, 4, 1 ), new Date( 2010, 0, 1, 1, 10, 10, 9 ) ) ).to.be.false;
		
		done();
	} );

	test( 'Date.prototype.clearTime: clears the hours, minutes, seconds and milliseconds from a Date instance', function( done ) {
		var e = new Date( 2010, 0, 1 ), r = new Date( 2010, 0, 1, 1, 10, 10, 10 );
			
		expect( r ).not.to.eql( e );
		expect( r.clone().clearTime() ).to.eql( e );
		
		done();
	} );

	test( 'Date.prototype.clone: returns a copy of a Date instance', function( done ) {
		var e = new Date( 2010, 0, 1 ), r = e.clone();
				
		expect( r ).not.to.equal( e );
		expect( r ).to.eql( e );
		
		done();
	} );

	test( 'Date.prototype.format: takes a format String and returns a Date String representation of the Date instance', function( done ) {
		function format( s ) { return '{ ' + s.split( ' ' ).map( map ).join( ', ' ) + ' }'; }
		function map( s ) { return '"<' + s + '>" : "' + s + '"'; }

		var r1 = new Date( 2010, 0, 1, 13, 17, 21, 450 ),
			r2 = new MockDate( {
				date :   1, day    :    5, hour : 13, minute : 17, month : 0,
				ms   : 450, second :   21, str  : 'Fri Jan 01 2010 13:17:21 GMT+0000 (BST)',
				tzo  :   0, year   : 2010
			} );

		expect( JSON.parse( r1.format( format( 'd D j l N S w z W F m M n t L o Y y a A g G h H i s u U' ) ) ) ).to.eql( {
			d : '01',      D : 'Fri', j : '1',   l : 'Friday', N : '5',  S : 'st', w : '5', z : '0',              // day
			W : '53',                                                                                             // week
			F : 'January', m : '01',   M : 'Jan',  n : '1',    t : '31',                                          // month
			L : '0',       o : '2009', Y : '2010', y : '10',                                                      // year
			a : 'pm',      A : 'PM',   g : '1',    G : '13',   h : '01', H : '13', i : '17', s : '21', u : '450', // time
			U : '1262351841450'                                                                                   // unix
		} );
		expect( JSON.parse( call( 'format', r2, format( 'O P T Z c r' ) ) ) ).to.eql( {
			O : '+0000', P : '+00:00', T : 'BST', Z : '0',                              // timezone
			c : '2010-01-01T13:17:21.450Z',       r : 'Fri, 01 Jan 2010 13:17:21 +0000' // full date/ time
		} );
		
		done();
	} );

	test( 'Date.prototype.getGMTOffset: returns the GMT offset of a Date instance', function( done ) {
		var fn = 'getGMTOffset';
			
		expect( call( fn, new MockDate( { tzo :    0 } ) ) ).to.eql( '+0000' );
		expect( call( fn, new MockDate( { tzo :  -60 } ) ) ).to.eql( '+0100' );
		expect( call( fn, new MockDate( { tzo :   60 } ) ) ).to.eql( '-0100' );
		expect( call( fn, new MockDate( { tzo : -600 } ) ) ).to.eql( '+1000' );
		expect( call( fn, new MockDate( { tzo :  600 } ) ) ).to.eql( '-1000' );
		expect( call( fn, new MockDate( { tzo :    0 } ), true ) ).to.eql( '+00:00' );
		expect( call( fn, new MockDate( { tzo :  -60 } ), true ) ).to.eql( '+01:00' );
		expect( call( fn, new MockDate( { tzo :   60 } ), true ) ).to.eql( '-01:00' );
		expect( call( fn, new MockDate( { tzo : -600 } ), true ) ).to.eql( '+10:00' );
		expect( call( fn, new MockDate( { tzo :  600 } ), true ) ).to.eql( '-10:00' );
				
		
		done();
	} );

	test( 'Date.prototype.getISODay: returns the ISO-8601 numeric representation of the day of the week', function( done ) {
		expect( new Date( 2006, 11, 31 ).getISODay() ).to.eql( 7 );
		expect( new Date( 2007,  0,  1 ).getISODay() ).to.eql( 1 );
		expect( new Date( 2007,  0,  2 ).getISODay() ).to.eql( 2 );
		expect( new Date( 2007,  0,  3 ).getISODay() ).to.eql( 3 );
		expect( new Date( 2007,  0,  4 ).getISODay() ).to.eql( 4 );
		expect( new Date( 2007,  0,  5 ).getISODay() ).to.eql( 5 );
		expect( new Date( 2007,  0,  6 ).getISODay() ).to.eql( 6 );
		
		done();
	} );

	test( 'Date.prototype.getISODaysInYear: returns the ISO-8601 number of days in the year', function( done ) {
		var r = [364, 364, 364, 364, 371, 371, 357, 364, 364, 371, 364];
			
		[2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010].forEach( function( y, i ) {
			expect( new Date( y, 1, 1 ).getISODaysInYear() ).to.eql( r[i] );
		} );

		done();
	} );

	test( 'Date.prototype.getISOFirstMondayOfYear: returns a Date instance of this Date instance\'s ISO-8601 first Monday of the year', function( done ) {
		var r = [new Date( 2000, 0, 3 ), new Date( 2001, 0, 1 ), new Date( 2001, 11, 31 ), new Date( 2002, 11, 30 ), new Date( 2003, 11, 29 ), new Date( 2005, 0, 3 ), new Date( 2006, 0, 9 ), new Date( 2007, 0, 1 ), new Date( 2007, 11, 31 ), new Date( 2008, 11, 29 ), new Date( 2010, 0, 4 )];

		[2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010].forEach( function( y, i ) {
			expect( new Date( y, 1, 1 ).getISOFirstMondayOfYear().format( 'Y-m-d' ) ).to.eql( r[i].format( 'Y-m-d' ) );
		} );
		
		done();
	} );

	test( 'Date.prototype.getISOWeek: returns the ISO-8601 week number of the Date instance', function( done ) {
		var jan01 = [52,  1,  1,  1, 52, 53, 52,  1,  1, 52, 53],
			jun15 =  24,
			aug30 = [35, 35, 35, 35, 35, 35, 35, 35, 35, 34, 35],
			dec31 = [52,  1,  1,  1, 52, 52, 52,  1,  1, 52, 52];

		[2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010].forEach( function( y, i ) {
			expect( new Date( y,  0,  1 ).getISOWeek() ).to.eql( jan01[i] );
			expect( new Date( y,  5, 15 ).getISOWeek() ).to.eql( jun15    );
			expect( new Date( y,  7, 30 ).getISOWeek() ).to.eql( aug30[i] );
			expect( new Date( y, 11, 31 ).getISOWeek() ).to.eql( dec31[i] );
		} );
		
		done();
	} );

	test( 'Date.prototype.getISOWeeksInYear: returns the ISO-8601 number of weeks in the year', function( done ) {
		var r = [52, 52, 52, 52, 53, 53, 51, 52, 52, 53, 52];

		[2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010].forEach( function( y, i ) {
			expect( new Date( y, 1, 1 ).getISOWeeksInYear() ).to.eql( r[i] );
		} );
				
		done();
	} );

	test( 'Date.prototype.getDayOfYear: returns the day of the year', function( done ) {
		expect( new Date( 1900, 11, 31 ).getDayOfYear() ).to.eql( 364 );
		expect( new Date( 2000, 11, 31 ).getDayOfYear() ).to.eql( 365 );
		expect( new Date( 2008, 11, 31 ).getDayOfYear() ).to.eql( 365 );
		expect( new Date( 2010, 11, 31 ).getDayOfYear() ).to.eql( 364 );
		expect( new Date( 1900,  5, 15 ).getDayOfYear() ).to.eql( 165 );
		expect( new Date( 2000,  5, 15 ).getDayOfYear() ).to.eql( 166 );
		expect( new Date( 2008,  5, 15 ).getDayOfYear() ).to.eql( 166 );
		expect( new Date( 2010,  5, 15 ).getDayOfYear() ).to.eql( 165 );
		expect( new Date( 2010,  0,  1 ).getDayOfYear() ).to.eql(   0 );

		done();
	} );

	test( 'Date.prototype.getFirstOfTheMonth: returns a Date instance of this Date instance\'s first of the Month', function( done ) {
		expect( new Date( 2010, 11, 31 ).getFirstOfTheMonth() ).to.eql( new Date( 2010, 11, 1 ) );
		expect( new Date( 2010,  0,  1 ).getFirstOfTheMonth() ).to.eql( new Date( 2010,  0, 1 ) );

		done();
	} );

	test( 'Date.prototype.getLastOfTheMonth: returns a Date instance of this Date instance\'s last of the Month', function( done ) {
		expect( new Date( 2010, 11, 31 ).getLastOfTheMonth() ).to.eql( new Date( 2010, 11, 31 ) );
		expect( new Date( 2010,  0,  1 ).getLastOfTheMonth() ).to.eql( new Date( 2010,  0, 31 ) );

		done();
	} );

	test( 'Date.prototype.isLeapYear: returns true if the Date instance is in a leap year', function( done ) {
		expect( new Date( 1899, 0, 1 ).isLeapYear() ).to.be.false;
		expect( new Date( 1900, 0, 1 ).isLeapYear() ).to.be.false;
		expect( new Date( 1901, 0, 1 ).isLeapYear() ).to.be.false;
		expect( new Date( 1904, 0, 1 ).isLeapYear() ).to.be.true;
		expect( new Date( 1996, 0, 1 ).isLeapYear() ).to.be.true;
		expect( new Date( 2000, 0, 1 ).isLeapYear() ).to.be.true;
		expect( new Date( 2004, 0, 1 ).isLeapYear() ).to.be.true;
		expect( new Date( 2010, 0, 1 ).isLeapYear() ).to.be.false;
		expect( new Date( 2050, 0, 1 ).isLeapYear() ).to.be.false;
		expect( new Date( 2100, 0, 1 ).isLeapYear() ).to.be.false;
		
		done();
	} );

	test( 'Date.prototype.timezone: returns the timezone portion of a Date instance', function( done ) {
		var fn = 'timezone';
		expect( call( fn, new MockDate( { str : 'Thu, 25 Oct 2007 22:53:45 GMT+0800' } ) ) ).to.eql( 'GMT' );
		expect( call( fn, new MockDate( { str : 'Thu Oct 25 2007 22:55:35 GMT+0800 (Malay Peninsula Standard Time)' } ) ) ).to.eql( 'MPST' );
		expect( call( fn, new MockDate( { str : 'Thu Oct 25 22:54:35 UTC+0800 2007' } ) ) ).to.eql( 'UTC' );
		expect( call( fn, new MockDate( { str : 'Thu Oct 25 17:06:37 PDT 2007' } ) ) ).to.eql( 'PDT' );
		expect( call( fn, new MockDate( { str : 'Tue Apr 20 2010 19:27:18 GMT+0100 (BST)' } ) ) ).to.eql( 'BST' );

		done();
	} );
} );
