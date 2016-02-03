'use strict';

/**
* NOTE: the original C++ code is from the [Boost library]{http://www.boost.org/doc/libs/1_52_0/boost/math/special_functions/beta.hpp}.
*
* The implementation has been modified for JavaScript.
*/

//  (C) Copyright John Maddock 2006.
//  Use, modification and distribution are subject to the
//  Boost Software License, Version 1.0. (See accompanying file
//  LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// MODULES //

var abs = require( 'math-abs' );
var exp = require( 'math-exp' );
var gamma = require( 'math-gamma' );
var log1p = require( 'math-log1p' );
var pow = require( 'math-power' );
var sqrt = require( 'math-sqrt' );


// FUNCTIONS //

var lanczos_sum_expG_scaled = require( './lanczos_sum_expG_scaled.js' );


// CONSTANTS //

var E = require( 'const-e' );
var EPSILON = 2.220446049250313e-16;


// LANCZOS APPROXIMATION CONSTANTS //

var G = 10.90051099999999983936049829935654997826;


// BETA //

/**
* FUNCTION: beta( x, y )
*	Evaluates the beta function.
*
* @param {Number} x - input value
* @param {Number} y - input value
* @returns {Number} evaluated beta function
*/
function beta( a, b ) {
	if ( a < 0 || b < 0 ) {
		return NaN;
	}
	if ( b === 1 ) {
		return 1 / a;
	} else if( a === 1 ) {
		return 1 / b;
	}
	var result;
	var prefix = 1;
	var tmp;
	var agh, bgh, cgh;
	var ambh;
	var c = a + b;

	// special cases:
	if ( (c === a) && (b < EPSILON) ) {
		return gamma( b );
	} else if ( (c === b) && (a < EPSILON ) ) {
		return gamma( a );
	}

	// shift to a and b > 1 if required:
	if ( a < 1 ) {
		prefix *= c / a;
		c += 1;
		a += 1;
	}
	if ( b < 1 ) {
		prefix *= c / b;
		c += 1;
		b += 1;
   }
	if ( a < b ) {
		// Swap a and b:
		tmp = b;
		b = a;
		a = tmp;
	}

	// Lanczos calculation:
	agh = a + G - 0.5;
	bgh = b + G - 0.5;
	cgh = c + G - 0.5;
	result = lanczos_sum_expG_scaled( a ) * lanczos_sum_expG_scaled( b ) / lanczos_sum_expG_scaled( c );
	ambh = a - 0.5 - b;
	if( ( abs( b * ambh ) < (cgh * 100) ) && (a > 100) ) {
	// Special case where the base of the power term is close to 1
	// compute (1+x)^y instead:
	result *= exp( ambh * log1p( -b / cgh ) );
	} else {
		result *= pow( agh / cgh, a - 0.5 - b );
	}
	if ( cgh > 1e10 ) {
		// this avoids possible overflow, but appears to be marginally less accurate:
		result *= pow( (agh / cgh) * (bgh / cgh), b);
	} else {
		result *= pow((agh * bgh) / (cgh * cgh), b);
	}
	result *= sqrt( E / bgh);

	// If a and b were originally less than 1 we need to scale the result:
	result *= prefix;
	return result;
} // end FUNCTION beta()

// EXPORTS //

module.exports = beta;
