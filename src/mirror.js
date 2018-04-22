// image-processing-js/src/mirror.js

function mirrorImageFromBuffer_New (srcImage, fnCreateImage, fnMapCoordinates) {		// Dependency injection.
	let dstImage = fnCreateImage(srcImage.width, srcImage.height, srcImage.bytesPerPixel);

	fnMapCoordinates(
		dstImage.data, dstImage.width, dstImage.height, 0, dstImage.bytesPerLine, dstImage.bytesPerPixel,
		srcImage.data, (srcImage.width - 1) * srcImage.bytesPerPixel, srcImage.bytesPerLine, -srcImage.bytesPerPixel,
		srcImage.bytesPerPixel);

	return dstImage;
}

/*
function mirrorImageFromBuffer (srcImage) {
	const srcBuffer = srcImage.data;
	const dstBuffer = Buffer.alloc(srcImage.height * srcImage.bytesPerLine);
	let rowOffset = 0;

	for (let row = 0; row < srcImage.height; row++) {
		let srcPixelOffset = rowOffset;
		let dstPixelOffset = rowOffset + (srcImage.width - 1) * srcImage.bytesPerPixel;

		for (let col = 0; col < srcImage.width; col++) {

			switch (srcImage.bytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffset + 3] = srcBuffer[srcPixelOffset + 3];
				case 3:		// eslint-disable-line
					dstBuffer[dstPixelOffset + 2] = srcBuffer[srcPixelOffset + 2];
					dstBuffer[dstPixelOffset + 1] = srcBuffer[srcPixelOffset + 1];
				case 1:		// eslint-disable-line
					dstBuffer[dstPixelOffset + 0] = srcBuffer[srcPixelOffset + 0];
				default:	// eslint-disable-line
					break;
			}

			srcPixelOffset += srcImage.bytesPerPixel;
			dstPixelOffset -= srcImage.bytesPerPixel;
		}

		rowOffset += srcImage.bytesPerLine;
	}

	return {
		width: srcImage.width,
		height: srcImage.height,
		data: dstBuffer,
		bytesPerLine: srcImage.bytesPerLine,
		bytesPerPixel: srcImage.bytesPerPixel
	};
}
*/

module.exports = {
	//mirrorImageFromBuffer: mirrorImageFromBuffer
	mirrorImageFromBuffer: mirrorImageFromBuffer_New
};
