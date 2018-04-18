// image-processing-js/src/main.js

const fs = require('fs');
const jpeg = require('jpeg-js');

const convolve = require('./convolve.js');
const resample = require('./resample.js');

function convolveImageFromJpegFile(srcFilePath, dstFilePath, sigma, kernelSize, dstQuality = 50) {
	const srcJpegData = fs.readFileSync(srcFilePath);
	const srcImage = jpeg.decode(srcJpegData);
	const dstImage = convolve.convolveImageFromBuffer(srcImage, sigma, kernelSize);
	
	if (dstImage) {
		const dstJpegData = jpeg.encode(dstImage, dstQuality);

		fs.writeFileSync(dstFilePath, dstJpegData.data);
	}
}

function resampleImageFromJpegFile(srcFilePath, dstFilePath, dstWidth, dstHeight, dstQuality, mode) {
	const srcJpegData = fs.readFileSync(srcFilePath);
	const srcImage = jpeg.decode(srcJpegData);
	const dstImage = resample.resampleImageFromBuffer(srcImage, dstWidth, dstHeight, mode);
	
	if (dstImage) {
		const dstJpegData = jpeg.encode(dstImage, dstQuality);

		fs.writeFileSync(dstFilePath, dstJpegData.data);
	}
}

module.exports = {
	modeNearestNeighbour: resample.modeNearestNeighbour,
	modeBilinear: resample.modeBilinear,
	modeBicubic: resample.modeBicubic,
	convolveImageFromBuffer: convolve.convolveImageFromBuffer,
	convolveImageFromJpegFile: convolveImageFromJpegFile,
	resampleImageFromBuffer: resample.resampleImageFromBuffer,
	resampleImageFromJpegFile: resampleImageFromJpegFile
};
