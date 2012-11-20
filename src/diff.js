	function diff( now, props ) { //noinspection FallthroughInSwitchStatementJS
		switch ( util.ntype( now ) ) {
			case 'string' :
				if ( isNaN( +( new Date( now ) ) ) ) {
					if ( props ) {
						now = Date.now();
						break;
					}
				}
				else {
					now = new Date( now );
					break;
				}                                                        // allow [specific] fall-through
			case 'array'  : case 'object' :
				props   = now;
				now     = Date.now();
				break;
			case 'date'   : if ( !isNaN( +( new Date( now ) ) ) ) break; // allow fall-through if not a valid date
			default       : now = Date.now();

		}

		var ddiiff,
			ms    = now - ( +this ),
			tense = ms < 0 ? 1 : ms > 0 ? -1 : 0;

		ddiiff = tense === 0 ? util.obj() : diff_get( Math.abs( ms ), diff_get_exclusions( props ) );

		ddiiff.tense = tense;

		return ddiiff;
	}

	function diff_eval( ddiiff, calc, i, calcs ) {
		var time;
		if ( ddiiff.__ms__ ) {
			if ( !ddiiff.excl[calc[0]] ) {
				if ( ddiiff.__ms__ >= calc[1] ) {

					time = ddiiff.__ms__ / calc[1];

					if ( !( calc[0] in ddiiff.val ) ) {
						ddiiff.__ms__       = ( time % 1 ) * calc[1];
						ddiiff.val[calc[0]] = Math.floor( time );
					}
					else {
						time                 = Math.floor( time );
						ddiiff.__ms__       -= time * calc[1];
						ddiiff.val[calc[0]] += time;
					}

				}
				return ddiiff;
			}
// round up or down depending on what's available
			if ( ( !calcs[i + 1] || ddiiff.excl[calcs[i + 1][0]] ) && ( calc = calcs[i - 1] ) ) {
				time          = ddiiff.__ms__ / calc[1];
				ddiiff.__ms__ = ( Math.round( time ) * calc[1] ) + ( ( ( ddiiff.__ms__ / calcs[i][1] ) % 1 ) * calcs[i][1] );
				return diff_eval( ddiiff, calc, i - 1, [] );
			}
			return ddiiff;
		}
		return ddiiff;
	}

	function diff_get( ms, excl ) {
		var ddiiff = diff_calc.reduce( diff_eval, {
				__ms__ : ms,
				excl   : excl,
				val    : util.obj()
			} ).val;

		ddiiff.value = ms;

		return ddiiff;
	}

	function diff_get_exclusions( props ) {
		var excl = util.obj(), incl_remaining = true;

		if ( props ) { //noinspection FallthroughInSwitchStatementJS
			switch ( util.ntype( props ) ) {
				case 'object' : incl_remaining = false; break;
				case 'string' : props          = props.split( ' ' ); // allow fall-through
				case 'array'  : props          = props.reduce( diff_excl, excl );
								incl_remaining = !!util.len( excl );
			}
		}

		diff_props.map( function( prop ) {
			if ( !( prop in this ) )
				this[prop] = !incl_remaining;
		}, excl );

		return excl;
	}

	function diff_excl( excl, val ) {
		var prop = ( val = String( val ).toLowerCase() ).substring( 1 );

		switch ( val.charAt( 0 ) ) {
			case '-' : excl[prop] = true;  break;
			case '+' : excl[prop] = false; break;
			case '>' :
				diff_calc.map( diff_excl_iter, { excl : excl, prop : prop, val : true } );
				break;
			case '<' :
				diff_calc.slice().reverse().map( diff_excl_iter, { excl : excl, prop : prop, val : false } );
				break;
			default  : excl[val]  = false;
		}

		return excl;
	}

	function diff_excl_iter( calc ) {
		if ( calc[0] === this.prop )
			this.SET_VALID = true;
		if ( this.SET_VALID )
			this.excl[calc[0]] = this.val;
	}
