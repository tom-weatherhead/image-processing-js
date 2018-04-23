// image-processing-js/src/rotate.js

'use strict';

function rotate90DegreesClockwiseFromImage (srcImage, fnCreateImage, fnMapCoordinates) {		// Dependency injection.
	let dstImage = fnCreateImage(srcImage.height, srcImage.width, srcImage.bytesPerPixel);

	fnMapCoordinates(
		dstImage.data, dstImage.width, dstImage.height, 0, dstImage.bytesPerLine, dstImage.bytesPerPixel,
		srcImage.data, (srcImage.height - 1) * srcImage.bytesPerLine, srcImage.bytesPerPixel, -srcImage.bytesPerLine,
		srcImage.bytesPerPixel);

	return dstImage;
}

function rotate90DegreesCounterclockwiseFromImage (srcImage, fnCreateImage, fnMapCoordinates) {		// Dependency injection.
	let dstImage = fnCreateImage(srcImage.height, srcImage.width, srcImage.bytesPerPixel);

	fnMapCoordinates(
		dstImage.data, dstImage.width, dstImage.height, 0, dstImage.bytesPerLine, dstImage.bytesPerPixel,
		srcImage.data, (srcImage.width - 1) * srcImage.bytesPerPixel, -srcImage.bytesPerPixel, srcImage.bytesPerLine,
		srcImage.bytesPerPixel);

	return dstImage;
}

function rotate180DegreesFromImage (srcImage, fnCreateImage, fnMapCoordinates) {		// Dependency injection.
	let dstImage = fnCreateImage(srcImage.width, srcImage.height, srcImage.bytesPerPixel);

	fnMapCoordinates(
		dstImage.data, dstImage.width, dstImage.height, 0, dstImage.bytesPerLine, dstImage.bytesPerPixel,
		srcImage.data, (srcImage.height - 1) * srcImage.bytesPerLine + (srcImage.width - 1) * srcImage.bytesPerPixel, -srcImage.bytesPerLine, -srcImage.bytesPerPixel,
		srcImage.bytesPerPixel);

	return dstImage;
}

module.exports = {
	rotate90DegreesClockwiseFromImage: rotate90DegreesClockwiseFromImage,
	rotate90DegreesCounterclockwiseFromImage: rotate90DegreesCounterclockwiseFromImage,
	rotate180DegreesFromImage: rotate180DegreesFromImage
};
