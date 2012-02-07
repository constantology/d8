	function buildTemplate( o ) {
		if ( cache_format[o] ) return cache_format[o];

		var fn = ['var out=[];'], p, parts = o.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ), i = -1, l = parts.length;

		while( ++i < l ) {
			p = parts[i];
			if ( p == NOREPLACE ) {
				fn.push( 'out.push( "' + parts[++i] + '" )' ); ++i; continue;
			}
			fn.push( compileTplStr( p ) );
		}

		fn.push( 'return out.join( "" );' );
		return cache_format[o] = new Function( 'filter', 'date', fn.join( '\n' ) );
	}

	function compileTplStr( o ) { return o.replace( re_compile, function( m, p0, p1, p2 ) { return 'out.push( "' + p0 + '", filter.' + p1 + '( date ), "' + p2 + '" );'; } ); }

	function format( f ) { return buildTemplate( f )( filter, this ); }
