// image-processing-js/src/main.js

// To run lint: $ npm run lint 2>&1 | head -n 20

'use strict';

const imageUtilities = require('thaw-image-utilities.js');

const composite = require('./composite.js');
const convolve = require('./convolve.js');
const flip = require('./flip.js');
const mapColours = require('./map-colours.js');
const mapCoordinates = require('./map-coordinates.js');
const mirror = require('./mirror.js');
const pixelate = require('./pixelate.js');
const resample = require('./resample.js');
const rotate = require('./rotate.js');

function compositeTestFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = composite.compositeTest(srcImage, imageUtilities.createImage);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function convolveImageFromJpegFile (srcFilePath, dstFilePath, sigma, kernelSize, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	console.log('srcImage is', srcImage);
	console.log('imageUtilities.createImage is', imageUtilities.createImage);
	const dstImage = convolve.convolveImageFromBuffer(srcImage, sigma, kernelSize, imageUtilities.createImage);
	console.log('dstImage is', dstImage);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function flipImageFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = flip.flipImageFromBuffer(srcImage, imageUtilities.createImage, mapCoordinates.mapImageByCoordinatesFromBuffer);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function mapColoursInImageFromJpegFile (srcFilePath, dstFilePath, fnMapColours, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = mapColours.mapColoursInImageFromBuffer(srcImage, fnMapColours);
	// const dstImage = srcImage;

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function mirrorImageFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	console.log('srcImage is', srcImage);
	console.log('imageUtilities.createImage is', imageUtilities.createImage);
	const dstImage = mirror.mirrorImageFromBuffer(srcImage, imageUtilities.createImage, mapCoordinates.mapImageByCoordinatesFromBuffer);
	console.log('dstImage is', dstImage);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function pixelateImageFromJpegFile (srcFilePath, dstFilePath, pixelWidth, pixelHeight, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = pixelate.pixelateFromImage(srcImage, pixelWidth, pixelHeight, imageUtilities.createImage);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function resampleImageFromJpegFile (srcFilePath, dstFilePath, dstWidth, dstHeight, mode, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = resample.resampleImageFromBuffer(srcImage, dstWidth, dstHeight, mode);		// , fnCreateImage

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function rotate90DegreesClockwiseFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = rotate.rotate90DegreesClockwiseFromImage(srcImage, imageUtilities.createImage, mapCoordinates.mapImageByCoordinatesFromBuffer);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function rotate90DegreesCounterclockwiseFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = rotate.rotate90DegreesCounterclockwiseFromImage(srcImage, imageUtilities.createImage, mapCoordinates.mapImageByCoordinatesFromBuffer);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

function rotate180DegreesFromJpegFile (srcFilePath, dstFilePath, dstQuality) {
	const srcImage = imageUtilities.loadImageFromJpegFile(srcFilePath);
	const dstImage = rotate.rotate180DegreesFromImage(srcImage, imageUtilities.createImage, mapCoordinates.mapImageByCoordinatesFromBuffer);

	imageUtilities.saveImageToJpegFile(dstImage, dstFilePath, dstQuality);
}

module.exports = {
	compositeTestFromJpegFile: compositeTestFromJpegFile,

	convolveImageFromBuffer: convolve.convolveImageFromBuffer,
	convolveImageFromJpegFile: convolveImageFromJpegFile,

	flipImageFromBuffer: flip.flipImageFromBuffer,
	flipImageFromJpegFile: flipImageFromJpegFile,

	mirrorImageFromBuffer: mirror.mirrorImageFromBuffer,
	mirrorImageFromJpegFile: mirrorImageFromJpegFile,

	seeingRedRGBA: mapColours.seeingRedRGBA,
	desaturateRGBA: mapColours.desaturateRGBA,
	mapColoursInImageFromBuffer: mapColours.mapColoursInImageFromBuffer,
	mapColoursInImageFromJpegFile: mapColoursInImageFromJpegFile,

	pixelateImageFromJpegFile: pixelateImageFromJpegFile,

	modeNearestNeighbour: resample.modeNearestNeighbour,
	modeBilinear: resample.modeBilinear,
	modeBicubic: resample.modeBicubic,
	resampleImageFromBuffer: resample.resampleImageFromBuffer,
	resampleImageFromJpegFile: resampleImageFromJpegFile,

	rotate90DegreesClockwiseFromJpegFile: rotate90DegreesClockwiseFromJpegFile,
	rotate90DegreesCounterclockwiseFromJpegFile: rotate90DegreesCounterclockwiseFromJpegFile,
	rotate180DegreesFromJpegFile: rotate180DegreesFromJpegFile
};
