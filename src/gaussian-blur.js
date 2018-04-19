// image-processing-js/src/gaussian-blur.js

// Adapted from http://dev.theomader.com/gaussian-kernel-calculator/

// See also https://en.wikipedia.org/wiki/Gaussian_blur

'use strict';

function gaussianDistribution (x, mu, sigma) {
	var d = x - mu;
	var n = 1.0 / (Math.sqrt(2 * Math.PI) * sigma);

	return Math.exp(-d * d / (2 * sigma * sigma)) * n;
}

function sampleInterval (f, minInclusive, maxInclusive, sampleCount) {
	var result = [];
	var stepSize = (maxInclusive - minInclusive) / (sampleCount - 1);

	for (var s = 0; s < sampleCount; ++s) {
		var x = minInclusive + s * stepSize;
		var y = f(x);

		result.push([x, y]);
	}

	return result;
}

function integrateSimpson (samples) {
	var result = samples[0][1] + samples[samples.length - 1][1];

	for (var s = 1; s < samples.length - 1; ++s) {
		var sampleWeight = s % 2 === 0 ? 2.0 : 4.0;

		result += sampleWeight * samples[s][1];
	}

	var h = (samples[samples.length - 1][0] - samples[0][0]) / (samples.length - 1);

	return result * h / 3.0;
}

function roundTo6DecimalPlaces (n) {
	return Math.round(n * 1000000) / 1000000;
}

function generateKernel (sigma, kernelSize) {
	// sigma must be a positive number.
	// kernelSize must be an odd positive integer smaller than 999.
	const sampleCount = 1000.0;

	var samplesPerBin = Math.ceil(sampleCount / kernelSize);

	if (samplesPerBin % 2 === 0) { // need an even number of intervals for Simpson integration => odd number of samples
		++samplesPerBin;
	}

	var weightSum = 0;
	var kernelLeft = -Math.floor(kernelSize / 2);

	var calcSamplesForRange = function (minInclusive, maxInclusive) {
		return sampleInterval(
			x => gaussianDistribution(x, 0, sigma),
			minInclusive,
			maxInclusive,
			samplesPerBin
		);
	};

	// Get samples left and right of kernel support first
	var outsideSamplesLeft = calcSamplesForRange(-5 * sigma, kernelLeft - 0.5);
	var outsideSamplesRight = calcSamplesForRange(-kernelLeft + 0.5, 5 * sigma);
	var allSamples = [[outsideSamplesLeft, 0]];

	// Now, sample kernel taps and calculate tap weights

	for (var tap = 0; tap < kernelSize; ++tap) {
		var left = kernelLeft - 0.5 + tap;
		var tapSamples = calcSamplesForRange(left, left + 1);
		var tapWeight = integrateSimpson(tapSamples);

		allSamples.push([tapSamples, tapWeight]);
		weightSum += tapWeight;
	}

	allSamples.push([outsideSamplesRight, 0]);

	// Renormalize the kernel and round its entries to 6 decimal places.

	/*
	for (var i = 0; i < allSamples.length; ++i) {
		allSamples[i][1] = roundTo6DecimalPlaces(allSamples[i][1] / weightSum);
	}

	let result = [];

	for (var i = 1; i < allSamples.length - 1; ++i) {
		result.push(roundTo6DecimalPlaces(allSamples[i][1]));
	}
	*/

	let result = [];

	for (var i = 1; i < allSamples.length - 1; ++i) {
		result.push(roundTo6DecimalPlaces(allSamples[i][1] / weightSum));
	}

	return result;
}

// function driver(sigma, kernelSize) {
// 		console.log(`driver(${sigma}, ${kernelSize}) = [${generateKernel(sigma, kernelSize).join(', ')}]`);
// }

// driver(1.0, 5);
// driver(2.0, 5);
// driver(1.0, 7);
// driver(2.0, 7);

module.exports = {
	generateKernel: generateKernel
};
