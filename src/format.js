	function buildTemplate( date_format ) {
		if ( cache_format[date_format] ) return cache_format[date_format];

		var fn         = ['var out=[];'], i = -1, part,
			parts      = date_format.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ),
			re_invalid = /^[^A-Za-z]*$/g, l = parts.length;

		while( ++i < l ) {
			part = parts[i];
			part == NOREPLACE ? ( fn.push( tplOut( parts[++i] ) ), ++i )
						   :   re_invalid.test( part )
						   ?   fn.push( tplOut( part ) )
						   :   fn.push( compileTplStr( part ) );
		}

		fn.push( 'return out.join( "" );\n//@ sourceURL=d8/format/' + date_format );

		return cache_format[date_format] = new Function( 'filter', 'date', fn.join( '\n' ) );
	}

	function format( f ) { return buildTemplate( f )( filter, this ); }

	function compileTplStr( o ) { return o.replace( re_compile, function( m, p0, p1, p2 ) { return tplOut( p0 + '\', filter.' + p1 + '( date ), \'' + p2 ); } ); }

	function tplOut( s ) { return 'out.push( \'' + s + '\' );'; }
