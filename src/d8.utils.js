// utility methods
	function _indexOf( o, k ) { var i = o.indexOf( k ); return i == -1 ? N : i; }
	function _lc( o ) { return o.toLowerCase(); }
	function _substr( s ) { return s.substring( 0, 3 ); }
	function _uc( o ) { return o.toUpperCase(); }
	function associate( o, k ) { return o.reduce( function( res, v, i ) { res[k[i]] = v; return res; }, {} ); }
	function between_equalto( v, l, h ) { return l <= v && v <= h; }
	function copy( d, s, r ) {
		for ( var k in s ) !has( s, k ) || has( d, k ) && r !== T || ( d[k] = s[k] );
		return d;
	}
	function forEach( o, fn, ctx ) {
		ctx || ( ctx = o );
		Object.keys( o ).forEach( function( k, i ) { fn.call( ctx, o[k], k, i, o ); } );
		return o;
	}
	function nomember( o, k ) { return !( k in o ); }
	function has( o, k ) { return OP.hasOwnProperty.call( o, k ); }
	function pad( o, len, radix ) {
		var i = -1, s = o.toString( radix || 10 );
		len -= s.length;
		while ( ++i < len ) s = '0' + s;
		return s;
	}
	function pluck( a, k ) { return a.reduce( function( v, o ) { !( k in o ) || v.push( o[k] ); return v; }, [] ); }
	function retVal( x ) { return x; }
	function sum( v, i ) { return v + i; }
	function todesc( v, k, i, o ) {
		o[k] = { configurable : F, enumerable : F, value : v, writeable : F };
	}
