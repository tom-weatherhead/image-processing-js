#!/usr/bin/env node

// image-processing-js/src/cli.js

'use strict';

// E.g. : npm start -- -sc -w 235 -h 763 in.jpg out.jpg -q 34

const fs = require('fs');
// const path = require('path');

const options = {
	fs: fs // require('fs')
};

const engine = require('..')(options);

// const engine = require('..')();

// CLI: resample-jpeg [-sn | -sl | -sc] -w dstWidth -h dstHeight
// -sn = Nearest Neighbour
// -sl = Bilinear
// -sc = Bicubic

//const defaultSrcFilePath = 'test/input-files/unconventional-table.jpg';
const defaultSrcFilePath = 'test/input-files/fast-and-fourier.jpg';

// The option -q (JPEG export quality) is common to all operations; its value must be an integer in the range [0, 100].

/*
const dispatchDescriptors = {
	'c': {},
	'ds': {},
	'f': {},
	'gb': {},
	'm': {},
	'p': {},
	'rs': {
		func: engine.resampleImageFromJpegFile,
		defaultDstFilename: 'resample.jpg',
		optionsWithNoArguments: {
			'sc': options => { options.mode = engine.modeBicubic },
			'sl': options => { options.mode = engine.modeBilinear },
			'sn': options => { options.mode = engine.modeNearestNeighbour }
		},
		optionsWithOneArgument: {
			'h': {
				argumentName: 'height',
				argumentType: 'i'
			},
			'w': {
				argumentName: 'width',
				argumentType: 'i'
			}
		}
	},
	'r90ccw': {},
	'r90cw': {},
	'r180': {}
};
*/

function dispatchCompositeTest (argv) {
	let srcFilePath = defaultSrcFilePath;
	// let srcFilePath = '../' + defaultSrcFilePath;
	// let srcFilePath = __dirname + '/../' + defaultSrcFilePath;
	// let srcFilePath = path.normalize(path.join(__dirname, '..', defaultSrcFilePath));

	let dstFilePath = 'test/output-files/composite-test.jpg';

	if (!fs.existsSync(srcFilePath)) {
		console.log(`There is no file at the path ${srcFilePath}`);
		// console.log(`__dirname is ${__dirname}`);

		return;
	}

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

	console.log('Composite.');
	engine.compositeTestFromJpegFile(srcFilePath, dstFilePath);
}

function dispatchDesaturate (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/desaturate.jpg';

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
	// engine.mapColoursInImageFromJpegFile('test/images/unconventional-table.jpg', 'test/output-files/seeing-red.jpg', engine.seeingRedRGBA);

	console.log('Desaturate.');
	engine.mapColoursInImageFromJpegFile(srcFilePath, dstFilePath, engine.desaturateRGBA);
}

function dispatchFlip (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/flip.jpg';

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
	let dstFilePath = 'test/output-files/gaussian-blur.jpg';
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

	console.log('Gaussian blur.');
	//console.log(`engine.convolveImageFromJpegFile(${srcFilePath}, ${dstFilePath}, ${sigma}, ${kernelSize}, ${dstQuality});`);
	engine.convolveImageFromJpegFile(srcFilePath, dstFilePath, sigma, kernelSize, dstQuality);
}

function dispatchMirror (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/mirror.jpg';

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

function dispatchPixelate (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/pixelate.jpg';
	let pixelWidth = 8;
	let pixelHeight = 8;
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

			if (arg === '-w') {
				pixelWidth = parseInt(nextArg);
			} else if (arg === '-h') {
				pixelHeight = parseInt(nextArg);
			} else if (arg === '-q') {
				dstQuality = parseInt(nextArg);
			}
		}
	}

	console.log('Pixelate.');
	//console.log(`engine.resampleImageFromJpegFile(${srcFilePath}, ${dstFilePath}, ${dstWidth}, ${dstHeight}, ${mode}, ${dstQuality});`);
	engine.pixelateImageFromJpegFile(srcFilePath, dstFilePath, pixelWidth, pixelHeight, dstQuality);
}

function dispatchResample (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/resample.jpg';
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

	console.log('Resample.');
	//console.log(`engine.resampleImageFromJpegFile(${srcFilePath}, ${dstFilePath}, ${dstWidth}, ${dstHeight}, ${mode}, ${dstQuality});`);
	engine.resampleImageFromJpegFile(srcFilePath, dstFilePath, dstWidth, dstHeight, mode, dstQuality);
}

function dispatchRotate90DegreesClockwise (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/rotate90cw.jpg';
	let dstQuality;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-q') {
				dstQuality = parseInt(nextArg);
			}
		}
	}

	console.log('Rotate 90 degrees clockwise.');
	engine.rotate90DegreesClockwiseFromJpegFile(srcFilePath, dstFilePath, dstQuality);
}

function dispatchRotate90DegreesCounterclockwise (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/rotate90ccw.jpg';
	let dstQuality;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-q') {
				dstQuality = parseInt(nextArg);
			}
		}
	}

	console.log('Rotate 90 degrees counter-clockwise.');
	engine.rotate90DegreesCounterclockwiseFromJpegFile(srcFilePath, dstFilePath, dstQuality);
}

function dispatchRotate180Degrees (argv) {
	let srcFilePath = defaultSrcFilePath;
	let dstFilePath = 'test/output-files/rotate180.jpg';
	let dstQuality;

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg.substr(0, 1) !== '-') {

			if (!srcFilePath) {
				srcFilePath = arg;
			} else if (!dstFilePath) {
				dstFilePath = arg;
			}
		} else if (i < argv.length - 1) {
			const nextArg = argv[i + 1];
			i++;

			if (arg === '-q') {
				dstQuality = parseInt(nextArg);
			}
		}
	}

	console.log('Rotate 180 degrees.');
	engine.rotate180DegreesFromJpegFile(srcFilePath, dstFilePath, dstQuality);
}

function dispatch (argv) {
	const command = argv.shift();

	switch (command) {
		case 'c':
			dispatchCompositeTest(argv);
			break;

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

		case 'p':
			dispatchPixelate(argv);
			break;

		case 'rs':
			dispatchResample(argv);
			break;

		case 'r90ccw':
			dispatchRotate90DegreesCounterclockwise(argv);
			break;

		case 'r90cw':
			dispatchRotate90DegreesClockwise(argv);
			break;

		case 'r180':
			dispatchRotate180Degrees(argv);
			break;

		default:
			console.error('Unrecognized command:', command);
			break;
	}
}

// console.log(process.argv);
// console.log(process.argv.slice(2));
dispatch(process.argv.slice(2).filter(arg => arg !== '--'));
