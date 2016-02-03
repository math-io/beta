'use strict';

/**
* NOTE: the original C++ code is from the [Boost library]{http://www.boost.org/doc/libs/1_43_0/boost/math/tools/rational.hpp}.
*
* The implementation has been modified for JavaScript.
*/

//  (C) Copyright John Maddock 2006.
//  Use, modification and distribution are subject to the
//  Boost Software License, Version 1.0. (See accompanying file
//  LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

/*
	Rational functions: numerator and denominator must be
	equal in size.  These always have a for-loop and so may be less
	efficient than evaluating a pair of polynomials. However, there
	are some tricks we can use to prevent overflow that might otherwise
	occur in polynomial evaluation, if z is large.  This is important
	in our Lanczos code for example.
*/

/**
* FUNCTION: evaluate_rational( num, denom, z )
*	Evaluates the rational function (the ratio of two polynomials) described by the coefficients stored in num and demom.
*	Coefficients should be stored such that the coefficients for the x^i terms are in num[i] and denom[i].
*
* @param {Number[]} num - numerator coefficients
* @param {Number[]} denom - denominator coefficients
* @param {Number} z - input value
* @returns {Number} evaluated ratio
*/
function evaluate_rational( num, denom, z ) {
	var s1, s2;
	var i;
	var count = num.length;
	if ( z <= 1 ) {
		s1 = num[count-1];
		s2 = denom[count-1];
		for ( i = count - 2; i >= 0; --i ) {
			s1 *= z;
			s2 *= z;
			s1 += num[i];
			s2 += denom[i];
		}
	} else {
		z = 1 / z;
		s1 = num[0];
		s2 = denom[0];
		for( i = 1; i < count; ++i ) {
			s1 *= z;
			s2 *= z;
			s1 += num[i];
			s2 += denom[i];
		}
	}
	return s1 / s2;
} // end FUNCTION evaluate_rational()


// EXPORTS //

module.exports = evaluate_rational;
