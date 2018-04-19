// image-processing-js/src/remap-and-divide-by-255.js

// The essence of dividend remapping is this:
// Map integer x from the range [0 ... 255 * 255] to the range [0 ... 255 * 256 - 1].
// Then 0 <= floor(x / 255) <= 255.

// The rationale behind dividend remapping is this:
// Without dividend remapping, if a and b are in the range [0 ... 255], then floor(a * b / 255) only if a === b === 255;
// e.g. if you smear a little bit of black (0) around a mostly white (255) canvas, the smeared colour may max out at e.g. 245 instead of 255.

function fastDivideBy255 (n) {
	// This is advantageous if the divisions by 256 are done via bit shifting, rather than a div instruction.
	// We need the divisions by 256 to truncate the results and return integers.
	return (n / 256 + n + 1) / 256;
}

function remapAndDivideBy255 (dividend) {
	/*
	// if (dividend <= 255 * 255 / 2) {
	//		return (dividend + dividend / 255) / 255;			// Remap the bottom half of the range this way.
	// } else {
	//		// Without the "- 1", remapAndDivideBy255(255 * 255) would return 256.
	//		return (dividend + (dividend - 1) / 255) / 255;		// Remap the top half of the range this way.
	// }

	let addendum = dividend;

	assert(dividend <= 255 * 255);

	if (dividend > 255 * 255 / 2) {
		addendum--;
	}

	//dividend += fastDivideBy255(addendum);
	dividend += Math.trunc(addendum / 255);

	assert(dividend < 255 * 256);

	// return fastDivideBy255(dividend);
	return Math.trunc(dividend / 255);
	*/
	return Math.trunc((dividend + Math.trunc(dividend / 256)) / 255);		// TomW 2018-04-15
}

// Use the function above to populate a lookup table:
// let tableRemapAndDivideBy255 = [];
//
// for (let n = 0; n <= 255 * 255; n++) {
//		tableRemapAndDivideBy255.push(remapAndDivideBy255(n));
// }

module.exports = {
	fastDivideBy255: fastDivideBy255,
	remapAndDivideBy255: remapAndDivideBy255
};
