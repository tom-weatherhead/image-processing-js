// image-processing-js/src/composite.js

'use strict';

function generateTestImage_SingleRGBAColour (width, height, red, green, blue, alpha, fnCreateImage) {
	const image = fnCreateImage(width, height, 4);
	const buffer = image.data;
	let rowOffset = 0;

	for (let row = 0; row < image.height; row++) {
		let pixelOffset = rowOffset;

		for (let col = 0; col < image.width; col++) {
			buffer[pixelOffset + 3] = alpha;
			buffer[pixelOffset + 2] = blue;
			buffer[pixelOffset + 1] = green;
			buffer[pixelOffset + 0] = red;
			pixelOffset += image.bytesPerPixel;
		}

		rowOffset += image.bytesPerLine;
	}

	return image;
}

/*
function generateTestImage_RedGreenGradient (width, height, fnCreateImage) {
	const image = fnCreateImage(width, height, 4);
	const buffer = image.data;
	let rowOffset = 0;

	for (let row = 0; row < image.height; row++) {
		let pixelOffset = rowOffset;
		const green = Math.round(row * 255 / (image.height - 1));

		for (let col = 0; col < image.width; col++) {
			buffer[pixelOffset + 3] = 255;
			buffer[pixelOffset + 2] = 0;
			buffer[pixelOffset + 1] = green;
			buffer[pixelOffset + 0] = Math.round(col * 255 / (image.width - 1));
			pixelOffset += image.bytesPerPixel;
		}

		rowOffset += image.bytesPerLine;
	}

	return image;
}
*/

function generateTestImage_GreyscaleGradient (width, height, fnCreateImage) {
	const image = fnCreateImage(width, height, 1);
	const buffer = image.data;
	let rowOffset = 0;

	for (let row = 0; row < image.height; row++) {

		for (let col = 0; col < image.width; col++) {
			buffer[rowOffset + col] = Math.round((row + col) * 255 / (image.height + image.width - 2));
		}

		rowOffset += image.bytesPerLine;
	}

	return image;
}

function compositeImageFromBuffers (
	dstBuffer, dstWidth, dstHeight, dstInitialRowOffset, dstRowStride, dstPixelStride,
	srcBuffer, srcInitialRowOffset, srcRowStride, srcPixelStride,
	alphaBuffer, alphaInitialRowOffset, alphaRowStride, alphaPixelStride,
	numBytesPerPixel) {

	let dstRowOffset = dstInitialRowOffset;
	let srcRowOffset = srcInitialRowOffset;
	let alphaRowOffset = alphaInitialRowOffset;

	for (let row = 0; row < dstHeight; row++) {
		let dstPixelOffset = dstRowOffset;
		let srcPixelOffset = srcRowOffset;
		let alphaPixelOffset = alphaRowOffset;

		for (let col = 0; col < dstWidth; col++) {
			const normalizedAlpha = alphaBuffer[alphaPixelOffset] / 255;
			const normalizedAlphaComplement = 1 - normalizedAlpha;

			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffset + 3] = Math.round(srcBuffer[srcPixelOffset + 3] * normalizedAlpha + dstBuffer[dstPixelOffset + 3] * normalizedAlphaComplement);
				case 3:		// eslint-disable-line
					dstBuffer[dstPixelOffset + 2] = Math.round(srcBuffer[srcPixelOffset + 2] * normalizedAlpha + dstBuffer[dstPixelOffset + 2] * normalizedAlphaComplement);
					dstBuffer[dstPixelOffset + 1] = Math.round(srcBuffer[srcPixelOffset + 1] * normalizedAlpha + dstBuffer[dstPixelOffset + 1] * normalizedAlphaComplement);
				case 1:		// eslint-disable-line
					dstBuffer[dstPixelOffset + 0] = Math.round(srcBuffer[srcPixelOffset + 0] * normalizedAlpha + dstBuffer[dstPixelOffset + 0] * normalizedAlphaComplement);
				default:	// eslint-disable-line
					break;
			}

			dstPixelOffset += dstPixelStride;
			srcPixelOffset += srcPixelStride;
			alphaPixelOffset += alphaPixelStride;
		}

		dstRowOffset += dstRowStride;
		srcRowOffset += srcRowStride;
		alphaRowOffset += alphaRowStride;
	}
}

function compositeTest (srcImage, fnCreateImage) {
	//const dstImage = generateTestImage_RedGreenGradient(srcImage.width, srcImage.height, fnCreateImage);

	const red = 255;
	const green = 0;
	const blue = 0;
	const alpha = 255;
	const dstImage = generateTestImage_SingleRGBAColour(srcImage.width, srcImage.height, red, green, blue, alpha, fnCreateImage);
	const alphaImage = generateTestImage_GreyscaleGradient(srcImage.width, srcImage.height, fnCreateImage);

	compositeImageFromBuffers(
		dstImage.data, dstImage.width, dstImage.height, 0, dstImage.bytesPerLine, dstImage.bytesPerPixel,
		srcImage.data, 0, srcImage.bytesPerLine, srcImage.bytesPerPixel,
		alphaImage.data, 0, alphaImage.bytesPerLine, alphaImage.bytesPerPixel,
		srcImage.bytesPerPixel);

	return dstImage;
}

module.exports = {
	compositeImageFromBuffers: compositeImageFromBuffers,
	compositeTest: compositeTest
};
