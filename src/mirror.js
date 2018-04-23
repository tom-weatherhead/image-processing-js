// image-processing-js/src/mirror.js

function mirrorImageFromBuffer_New (srcImage, fnCreateImage, fnMapCoordinates) {		// Dependency injection.
	let dstImage = fnCreateImage(srcImage.width, srcImage.height, srcImage.bytesPerPixel);

	fnMapCoordinates(
		dstImage.data, dstImage.width, dstImage.height, 0, dstImage.bytesPerLine, dstImage.bytesPerPixel,
		srcImage.data, (srcImage.width - 1) * srcImage.bytesPerPixel, srcImage.bytesPerLine, -srcImage.bytesPerPixel,
		srcImage.bytesPerPixel);

	return dstImage;
}

module.exports = {
	//mirrorImageFromBuffer: mirrorImageFromBuffer
	mirrorImageFromBuffer: mirrorImageFromBuffer_New
};
