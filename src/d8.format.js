	function buildTemplate( o ) {
		if ( cache_format[o] ) return cache_format[o];

		var fn = [], p, parts = o.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ), i = -1, l = parts.length;

		while( ++i < l ) {
			p = parts[i];
			if ( p == NOREPLACE ) {
				fn.push( parts[++i] ); ++i; continue;
			}
			fn.push( compileTplStr( p ) );
		}

		return cache_format[o] = new Templ8( fn.join( '' ), Templ8.copy( { id : o }, filter ) );
	}

	function compileTplStr( o ) { return o.replace( re_compile, function( m, p1, p2, p3 ) { return p1 + '{{date|' + p2 + '}}' + p3; } ); }

	function format( f ) { return buildTemplate( f ).parse( { date : this } ); }
