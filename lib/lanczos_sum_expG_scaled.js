'use strict';

/**
* NOTE: the original C++ code is from the [Boost library]{http://www.boost.org/doc/libs/1_51_0/boost/math/special_functions/lanczos.hpp}.
*
* The implementation has been modified for JavaScript.
*/

//  (C) Copyright John Maddock 2006.
//  Use, modification and distribution are subject to the
//  Boost Software License, Version 1.0. (See accompanying file
//  LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// FUNCTIONS //

var evaluate_rational = require( './evaluate_rational.js' );


// CONSTANTS //

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


// LANCZOS SUM EXP_G SCALED //

/**
* FUNCTION: lanczos_sum_expG_scaled( z )
*	Calculates the Lanczos approximation scaled by exp(G).
*
* @param {Number} z - input value
* @returns {Number} Lanczos approximation
*/
function lanczos_sum_expG_scaled( z ) {
	return evaluate_rational( NUM, DENOM, z );
} // end FUNCTION lanczos_sum_expG_scaled()


// EXPORTS //

module.exports = lanczos_sum_expG_scaled;
