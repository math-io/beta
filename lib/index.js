'use strict';

/**
* NOTE: the original C++ code and copyright notice is from the [Boost library]{http://www.boost.org/doc/libs/1_52_0/boost/math/special_functions/beta.hpp}.
*
* The implementation has been modified for JavaScript.
*/

/**
* (C) Copyright John Maddock 2006.
* Use, modification and distribution are subject to the
* Boost Software License, Version 1.0. (See accompanying file
* LICENSE or copy at http://www.boost.org/LICENSE_1_0.txt)
*/

// MODULES //

var abs = require( 'math-abs' );
var exp = require( 'math-exp' );
var evalrational = require( 'math-evalrational' ).factory;
var gamma = require( 'math-gamma' );
var log1p = require( 'math-float64-log1p' );
var pow = require( 'math-power' );
var sqrt = require( 'math-sqrt' );


// CONSTANTS //

var E = require( 'const-e' );
var EPSILON = 2.220446049250313e-16;

// LANCZOS APPROXIMATION CONSTANTS //

var G = 10.90051099999999983936049829935654997826;
var NUM = [
	709811.662581657956893540610814842699825,
	679979.847415722640161734319823103390728,
	293136.785721159725251629480984140341656,
	74887.5403291467179935942448101441897121,
	12555.29058241386295096255111537516768137,
	1443.42992444170669746078056942194198252,
	115.2419459613734722083208906727972935065,
	6.30923920573262762719523981992008976989,
	0.2266840463022436475495508977579735223818,
	0.004826466289237661857584712046231435101741,
	0.4624429436045378766270459638520555557321e-4
];
var DENOM = [
	0,
	362880,
	1026576,
	1172700,
	723680,
	269325,
	63273,
	9450,
	870,
	45,
	1
];


// FUNCTIONS //

/**
* FUNCTION: lanczos_sum_expG_scaled( z )
*	Calculates the Lanczos approximation scaled by exp(G).
*
* @param {Number} z - input value
* @returns {Number} Lanczos approximation
*/
var lanczos_sum_expG_scaled = evalrational( NUM, DENOM );


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

	// Special cases:
	if ( (c === a) && (b < EPSILON) ) {
		return gamma( b );
	} else if ( (c === b) && (a < EPSILON ) ) {
		return gamma( a );
	}

	// Shift to a and b > 1 if required:
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
		// This avoids possible overflow, but appears to be marginally less accurate:
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
