#!/usr/bin/env node

// resample-jpeg/src/cli.js

'use strict';

// E.g. : npm start -- -sc -w 235 -h 763 in.jpg out.jpg -q 34

const engine = require('..');

// CLI: resample-jpeg [-sn | -sl | -sc] -w dstWidth -h dstHeight
// -sn = Nearest Neighbour
// -sl = Bilinear
// -sc = Bicubic

// Stretching in context?

// Dividend remapping? : Uniformly map integers in the range [0, ..., 255 * 255] to the range [0, ..., 255 * 256 - 1].
// 255 * 255 = 65025
// 255 * 256 - 1 = 65279
// -> f(x) = x + x/256 + 1 ? or x + x/256 ?
// function remapDividendAndDivideBy255(x) {
//	// Map [0, ..., 255 * 255] to the range [0, ..., 256 * 256 - 1], and then divide by 256.
//	return Math.trunc((x + x / 256 + ?) / 256);
//} ???

function justDoIt(argv) {
	let srcFilePath = undefined;
	let dstFilePath = undefined;
	let defaultSrcFilePath = 'test/images/unconventional-table.jpg';
	let defaultDstFilePath = 'foo.jpg';
	let dstWidth = 0;
	let dstHeight = 0;
	let dstQuality = 50;
	let defaultDstWidth = 640;
	let defaultDstHeight = 480;
	let defaultDstQuality = 50;
	let mode = engine.modeNearestNeighbour;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		const thereIsANextArg = i < argv.length - 1;
		
		if (arg.substr(0, 1) !== '-') {
			
			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (arg === '-sn') {
			mode = engine.modeNearestNeighbour;
		} else if (arg === '-sl') {
			mode = engine.modeBilinear;
		} else if (arg === '-sc') {
			mode = engine.modeBicubic;
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-w') {
				dstWidth = parseInt(nextArg);
			} else if (arg === '-h') {
				dstHeight = parseInt(nextArg);
			} else if (arg === '-q') {
				dstQuality = parseInt(nextArg);	// TODO: Clamp to [0 ... 100]
			}
		}
	}

	if (!srcFilePath) {
		srcFilePath = defaultSrcFilePath;
	}
	
	if (!dstFilePath) {
		dstFilePath = defaultDstFilePath;
	}
	
	if (dstWidth !== dstWidth || dstWidth <= 0) {
		dstWidth = defaultDstWidth;
	}

	if (dstQuality !== dstQuality || dstQuality < 0 || dstQuality > 100) {
		dstQuality = defaultDstQuality;
	}

	if (dstHeight !== dstHeight || dstHeight <= 0) {
		dstHeight = defaultDstHeight;
	}
	
	//mode = engine.modeBilinear;
	//mode = engine.modeBicubic;
	
	console.log(`engine.resampleImageFromJpegFile(${srcFilePath}, ${dstFilePath}, ${dstWidth}, ${dstHeight}, ${dstQuality}, ${mode});`);
	engine.resampleImageFromJpegFile(srcFilePath, dstFilePath, dstWidth, dstHeight, dstQuality, mode);
}

// console.log(process.argv);
// console.log(process.argv.slice(2));
justDoIt(process.argv.slice(2).filter(arg => arg !== '--'));
