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
