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
					copy( fn, _fn, T );
				}
				if ( _p.re ) re.push( p1, _p.re, p3 );
			} );
		}
		return cache_parse[o] = parse.bind( N, new RegExp( re.join( '' ) ), keys, fn );
	}

	function parse( re, keys, fn, s ) {
		var d = new Date(), m = s.match( re ), o = associate( m.slice( 1 ), keys );

		forEach( o, function( v, k ) { if ( fn[k] ) o[k] = fn[k]( v, o ); } );

		if ( !isNaN( o[UNIX] ) ) d.setTime( o[UNIX] );
		else {
			parse_setTime( d, o[HOUR], o[MINUTE], o[SECOND], o[MILLISECOND] );
			parse_setDate( d, o );
			parse_setTimezoneOffset( d, o[TIMEZONE] );
		}

		return d;
	}

	function parse_setDate( d, o ) {
		var dw, ly, odc, i = -1;

		if ( date_members.every( nomember.bind( N, o ) ) ) return; //  only set the date if there's one to set (i.e. the format is not just for time)

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
		!between_equalto( tzo, -43200, 50400 ) || d.adjust( Date.SECOND, ( -d.getTimezoneOffset() * 60 ) - tzo );
	}

	function toDate( s, f ) { return buildParser( f )( s ); }
