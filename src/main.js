// image-processing-js/src/main.js

// To run lint: $ npm run lint 2>&1 | head -n 20

'use strict';

const fs = require('fs');
const jpeg = require('jpeg-js');

const convolve = require('./convolve.js');
const flip = require('./flip.js');
const mapColours = require('./map-colours.js');
const resample = require('./resample.js');

function loadImageFromJpegFile (srcFilePath) {
	const srcJpegData = fs.readFileSync(srcFilePath);
	const srcImage = jpeg.decode(srcJpegData);

	srcImage.bytesPerPixel = 4;
	//srcImage.bytesPerLine = Math.ceil(srcImage.width * srcImage.bytesPerPixel / 4) * 4;
	srcImage.bytesPerLine = srcImage.width * srcImage.bytesPerPixel;

	return srcImage;
}

function saveImageFromJpegFile (dstImage, dstFilePath, dstQuality) {
	const defaultJpegQuality = 50;
	
	if (!dstImage) {
		console.error('saveImageFromJpegFile() : Error: dstImage is', dstImage);
	} else {
		
		if (dstQuality === undefined || dstQuality < 0 || dstQuality > 100) {
			dstQuality = defaultJpegQuality;
		} else {
			dstQuality = Math.round(dstQuality);
		}

		const dstJpegData = jpeg.encode(dstImage, dstQuality);

		fs.writeFileSync(dstFilePath, dstJpegData.data);
	}
}

function convolveImageFromJpegFile (srcFilePath, dstFilePath, sigma, kernelSize, dstQuality) {
	const srcImage = loadImageFromJpegFile(srcFilePath);
	const dstImage = convolve.convolveImageFromBuffer(srcImage, sigma, kernelSize);

	// if (dstImage) {
		// const dstJpegData = jpeg.encode(dstImage, dstQuality);

		// fs.writeFileSync(dstFilePath, dstJpegData.data);
	// }
	saveImageFromJpegFile(dstImage, dstFilePath, dstQuality);
}

function flipImageFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = loadImageFromJpegFile(srcFilePath);
	const dstImage = flip.flipImageFromBuffer(srcImage);

	saveImageFromJpegFile(dstImage, dstFilePath, dstQuality);
}

function resampleImageFromJpegFile (srcFilePath, dstFilePath, dstWidth, dstHeight, mode, dstQuality) {
	const srcImage = loadImageFromJpegFile(srcFilePath);
	const dstImage = resample.resampleImageFromBuffer(srcImage, dstWidth, dstHeight, mode);

	// if (dstImage) {
		// const dstJpegData = jpeg.encode(dstImage, dstQuality);

		// fs.writeFileSync(dstFilePath, dstJpegData.data);
	// }
	saveImageFromJpegFile(dstImage, dstFilePath, dstQuality);
}

function mapColoursInImageFromJpegFile (srcFilePath, dstFilePath, fnMapColours, dstQuality) {
	const srcImage = loadImageFromJpegFile(srcFilePath);
	const dstImage = mapColours.mapColoursInImageFromBuffer(srcImage, fnMapColours);

	// if (dstImage) {
		// const dstJpegData = jpeg.encode(dstImage, dstQuality);

		// fs.writeFileSync(dstFilePath, dstJpegData.data);
	// }
	saveImageFromJpegFile(dstImage, dstFilePath, dstQuality);
}

module.exports = {
	loadImageFromJpegFile: loadImageFromJpegFile,

	convolveImageFromBuffer: convolve.convolveImageFromBuffer,
	convolveImageFromJpegFile: convolveImageFromJpegFile,

	flipImageFromBuffer: flip.flipImageFromBuffer,
	flipImageFromJpegFile: flipImageFromJpegFile,

	seeingRedRGBA: mapColours.seeingRedRGBA,
	desaturateRGBA: mapColours.desaturateRGBA,
	mapColoursInImageFromBuffer: mapColours.mapColoursInImageFromBuffer,
	mapColoursInImageFromJpegFile: mapColoursInImageFromJpegFile,

	modeNearestNeighbour: resample.modeNearestNeighbour,
	modeBilinear: resample.modeBilinear,
	modeBicubic: resample.modeBicubic,
	resampleImageFromBuffer: resample.resampleImageFromBuffer,
	resampleImageFromJpegFile: resampleImageFromJpegFile
};
