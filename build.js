//  require modules
	var fs       = require( 'fs'   ),
		util     = require( 'util' ),
		path     = require( 'path' ),
		jsp      = require( 'uglify-js' ).parser,
		pro      = require( 'uglify-js' ).uglify,
		mkdirp   = require( 'mkdirp'    ),
		Templ8   = require( 'Templ8'    );

fs.readFile( './build.json', 'utf-8', function( err, data ) {
	if ( err ) throw err;
	processFiles( JSON.parse( data ) );
} );

function processFiles( params ) {
	Array.isArray( params.src.files ) || ( params.src.files = params.src.files.split( /,\s?|\s+/g ) );
	params.encoding || ( params.encoding = 'UTF-8' );
	params.file_err || ( params.file_err = 'break' );
	params.ext = params.ext.replace( /^\.+(.*)/, '$1' );

	var out_dir  = path.normalize( path.resolve( util.format( '%s/%s', process.cwd(), params.out.dir || '.' ) ) ) + '/',
		out_file,
		src_dir  = path.normalize( path.resolve( util.format( '%s/%s', process.cwd(), params.src.dir || '.' ) ) )  + '/',
		src      = '';

	path.existsSync( out_dir ) || mkdirp.sync( out_dir, 0777 );

	params.src.files = ( src_dir + params.src.files.join( Templ8.format( '.{0}, {1}', params.ext, src_dir ) ) + '.' + params.ext ).split( ', ' );
	params.src.files.forEach( function( file ) {
		console.log( '- processing file: ', file );

		if ( !path.existsSync( file ) ) {
			console.log( 'file: ', file, ' does not exist.' );
			switch ( params.file_err ) {
				case 'break'    : console.log( 'terminating build.' ); return;
				case 'continue' : break;
			}
		}

		src += Templ8.format( '\n/* begin file: {0} */\n{1}\n/* end file: {0} */\n', file, fs.readFileSync( file, params.encoding ) );
	} );


	out_file = Templ8.format( '{0}{1}.{2}', out_dir, ( params.out.file || 'out' ), params.ext );
	console.log( 'writing file: ', out_file );
	fs.writeFileSync( out_file, src, params.encoding );

	if ( params.out.min ) {
		out_file = Templ8.format( '{0}{1}.{2}', out_dir, params.out.min, params.ext );
		console.log( 'writing minified file: ', out_file );
		fs.writeFileSync( out_file, pro.gen_code( pro.ast_squeeze( pro.ast_mangle( jsp.parse( src ) ) ) ), params.encoding );
	}
}
