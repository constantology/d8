// private methods
	function _24hrTime( o, res ) { return ( o = Number( o ) ) < 12 && _lc( res.ampm ) == _lc( LOCALE.PM ) ? o += 12 : o; }
	function _adjust( v, k ) { this.adjust( k, v ); }
	function _dayOffset( d ) { return Math.floor( ( d - d.ISOFirstMondayOfYear() ) / MS_DAY ); }
	function _ly( y ) { return !!( y && ( ( new Date( y, 1, 29 ) ).getDate() == 29 && ( y % 100 || y % 400 == 0 ) ) ); }
	function _setLeapYear( d ) { LOCALE.day_count[1] = d.isLeapYear() ? 29 : 28; }
	function _timezoneOffset( o ) {
		var t = o.indexOf( '-' ) == 0 ? F : T,
			m = o.match( /[\+-]?([0-9]{2}):?([0-9]{2})/ ),
			v = ( Number( m[1] ) + ( m[2] / 60 ) ) * 3600;
		return t ? v : -v;
	}
	function _weekOffset( d ) { return Math.floor( Math.abs( _dayOffset( d ) / 7 ) ); }
	function _zeroIndexedInt( o, k ) { return !isNaN( k ) ? k == o ? 0 : Number( k ) : Number( o ) - 1; }

// public methods
	function GMTOffset( colon ) {
		var tz = this.getTimezoneOffset();
        return [( tz > 0 ? '-' : '+' ), pad( Math.floor( Math.abs( tz ) / 60 ), 2 ), ( colon ? ':' : '' ), pad( Math.abs( tz % 60 ), 2 )].join( '' );
	}

	function ISODay() { return this.getDay() || 7; }
	function ISODaysInYear() { return Math.ceil( ( ( new Date( this.getFullYear() + 1, 0, 1 ) ).ISOFirstMondayOfYear() - this.ISOFirstMondayOfYear() ) / MS_DAY ); }
	function ISOFirstMondayOfYear() {
		var y = this.getFullYear();
		return new Date( y, 0, DAY_OFFSETS[new Date( y, 0, 1 ).getDay()] );
	}
	function ISOWeek() {
		var w, y = this.getFullYear();
		if ( this >= ( new Date( y + 1, 0, 1 ) ).ISOFirstMondayOfYear() ) return 1;
		w = Math.floor( ( this.dayOfYear() - this.ISODay() + 10 ) / 7 );
		return w == 0 ? ( new Date( y - 1, 0, 1 ) ).ISOWeeksInYear() - _weekOffset( this ) : w;
	}
	function ISOWeeksInYear() { return Math.round( ( ( new Date( this.getFullYear() + 1, 0, 1 ) ).ISOFirstMondayOfYear() - this.ISOFirstMondayOfYear() ) / MS_WEEK ); }

	function adjust( o, v ) {
		if ( op.toString.call( o ) == '[object Object]' ) {
			forEach( o, _adjust, this );
			return this;
		}
		var day, fn = math_fn[o.toLowerCase()];
		if ( !fn || v === 0 ) return this;
		_setLeapYear( this );
		if ( fn == math_fn.m ) {
			day = this.getDate();
			day < 28 || this.setDate( Math.min( day, this.firstOfTheMonth().adjust( Date.MONTH, v ).lastOfTheMonth() ).getDate() );
		}
		this[fn[1]]( this[fn[0]]() + v );
		return this;
	}

	function between( l, h ) { return this >= l && this <= h; }

	function clearTime() {
		this.setHours( 0 ); this.setMinutes( 0 ); this.setSeconds( 0 ); this.setMilliseconds( 0 );
		return this;
	}

	function clone() { return new Date( this.valueOf() ); }

	function dayOfYear() {
		_setLeapYear( this );
		return LOCALE.day_count.slice( 0, this.getMonth() ).reduce( sum, 0 ) + this.getDate() - 1;
	}

	function firstOfTheMonth() { return new Date( this.getFullYear(), this.getMonth(), 1 ); }

	function isDST() { return new Date( this.getFullYear(), 0, 1 ).getTimezoneOffset() != this.getTimezoneOffset(); }

	function isLeapYear() { return _ly( this.getFullYear() ); }

	function lastOfTheMonth() {
		var m = this.getMonth(); _setLeapYear( this );
		return new Date( this.getFullYear(), m, LOCALE.day_count[m] );
	}

	function timezone() {
		var s = this.toString().split( ' ' );
		return s.splice( 4, s.length ).join( ' ' ).replace( re_tz, '$1' ).replace( re_tz_abbr, '' );
	}
