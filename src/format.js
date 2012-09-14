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
