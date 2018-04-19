// image-processing-js/src/map-colours.js

'use strict';

function seeingRedRGBA (buffer, offset) {
	buffer[offset + 2] = 0;
	buffer[offset + 1] = 0;
}

function desaturateRGBA (buffer, offset) {
	// Assuming that buffer[offset] is the red byte, buffer[offset + 1] is the green byte, and buffer[offset + 2] is the blue byte.
	const grey = Math.round(buffer[offset] * 0.3 + buffer[offset + 1] * 0.59 + buffer[offset + 2] * 0.11);

	buffer[offset + 2] = grey;
	buffer[offset + 1] = grey;
	buffer[offset] = grey;
}

function mapColoursInImageFromBuffer (srcImage, fnMapColours) {
	const bytesPerPixel = 4;	// Assume that the pixel format is RGBA.

	const width = srcImage.width;
	const height = srcImage.height;
	const bytesPerLine = width * bytesPerPixel;
	const buffer = srcImage.data;
	let rowOffset = 0;

	for (let row = 0; row < height; row++) {
		let pixelOffset = rowOffset;

		for (let col = 0; col < width; col++) {
			fnMapColours(buffer, pixelOffset);
			pixelOffset += bytesPerPixel;
		}

		rowOffset += bytesPerLine;
	}

	return srcImage;
}

module.exports = {
	seeingRedRGBA: seeingRedRGBA,
	desaturateRGBA: desaturateRGBA,
	mapColoursInImageFromBuffer: mapColoursInImageFromBuffer
};
