#!/usr/bin/env node

// image-processing-js/src/cli.js

'use strict';

// E.g. : npm start -- -sc -w 235 -h 763 in.jpg out.jpg -q 34

const engine = require('..');

// CLI: resample-jpeg [-sn | -sl | -sc] -w dstWidth -h dstHeight
// -sn = Nearest Neighbour
// -sl = Bilinear
// -sc = Bicubic

//const defaultSrcFilePath = 'test/images/unconventional-table.jpg';
const defaultSrcFilePath = 'test/images/fast-and-fourier.jpg';

function dispatchDesaturate (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test-output/desaturate.jpg';

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		}
	}

	// console.log('Seeing red.');
	// engine.mapColoursInImageFromJpegFile('test/images/unconventional-table.jpg', 'test-output/seeing-red.jpg', engine.seeingRedRGBA);

	console.log('Desaturate.');
	engine.mapColoursInImageFromJpegFile(srcFilePath, dstFilePath, engine.desaturateRGBA);
}

function dispatchFlip (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test-output/flip.jpg';

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		}
	}

	console.log('Flip.');
	engine.flipImageFromJpegFile(srcFilePath, dstFilePath);
}

function dispatchGaussianBlur (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test-output/gaussian-blur.jpg';
	let sigma = 1.0;
	let kernelSize = 5;
	let dstQuality;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		//const thereIsANextArg = i < argv.length - 1;

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-s') {
				sigma = parseFloat(nextArg);
			} else if (arg === '-ks') {
				kernelSize = parseInt(nextArg);
			} else if (arg === '-q') {
				dstQuality = parseInt(nextArg);
			}
		}
	}

	console.log(`engine.convolveImageFromJpegFile(${srcFilePath}, ${dstFilePath}, ${sigma}, ${kernelSize}, ${dstQuality});`);
	engine.convolveImageFromJpegFile(srcFilePath, dstFilePath, sigma, kernelSize, dstQuality);
}

function dispatchMirror (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test-output/mirror.jpg';

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		}
	}

	console.log('Mirror.');
	engine.mirrorImageFromJpegFile(srcFilePath, dstFilePath);
}

function dispatchResample (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test-output/resample.jpg';
	let dstWidth = 0;
	let dstHeight = 0;
	let dstQuality;
	let defaultDstWidth = 640;
	let defaultDstHeight = 480;
	let mode = engine.modeBicubic;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		//const thereIsANextArg = i < argv.length - 1;

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
				dstQuality = parseInt(nextArg);
			}
		}
	}

	if (dstWidth !== dstWidth || dstWidth <= 0) {
		dstWidth = defaultDstWidth;
	}

	if (dstHeight !== dstHeight || dstHeight <= 0) {
		dstHeight = defaultDstHeight;
	}

	console.log(`engine.resampleImageFromJpegFile(${srcFilePath}, ${dstFilePath}, ${dstWidth}, ${dstHeight}, ${mode}, ${dstQuality});`);
	engine.resampleImageFromJpegFile(srcFilePath, dstFilePath, dstWidth, dstHeight, mode, dstQuality);
}

function dispatch (argv) {
	const command = argv.shift();

	switch (command) {
		case 'ds':
			dispatchDesaturate(argv);
			break;

		case 'f':
			dispatchFlip(argv);
			break;

		case 'gb':
			dispatchGaussianBlur(argv);
			break;

		case 'm':
			dispatchMirror(argv);
			break;

		case 'rs':
			dispatchResample(argv);
			break;

		/*
		case '':
			break;
		*/

		default:
			console.error('Unrecognized command:', command);
			break;
	}
}

// console.log(process.argv);
// console.log(process.argv.slice(2));
dispatch(process.argv.slice(2).filter(arg => arg !== '--'));
