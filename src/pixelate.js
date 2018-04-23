// image-processing-js/src/pixelate.js

'use strict';

function pixelateFromImage (srcImage, pixelWidth, pixelHeight, fnCreateImage) {
	// srcBuffer, srcWidth, srcHeight, srcInitialRowOffset, srcRowStride, srcPixelStride, numBytesPerPixel
	const dstImage = fnCreateImage(srcImage.width, srcImage.height, srcImage.bytesPerPixel);
	let dstRowOffset = 0;
	let srcRowOffset = 0;

	if (pixelHeight === undefined) {
		pixelHeight = pixelWidth;
	}

	for (let row = 0; row < srcImage.height; row += pixelHeight) {
		const thisPixelHeight = Math.min(pixelHeight, srcImage.height - row);
		let dstPixelOffset = dstRowOffset;
		let srcPixelOffset = srcRowOffset;

		for (let col = 0; col < srcImage.width; col += pixelWidth) {
			const thisPixelWidth = Math.min(pixelWidth, srcImage.width - col);
			let accumulator3 = 0;
			let accumulator2 = 0;
			let accumulator1 = 0;
			let accumulator0 = 0;

			let srcRowOffset2 = srcPixelOffset;

			for (let row2 = 0; row2 < thisPixelHeight; row2++) {
				let srcPixelOffset2 = srcRowOffset2;

				for (let col2 = 0; col2 < thisPixelWidth; col2++) {

					switch (srcImage.bytesPerPixel) {
						case 4:
							accumulator3 += srcImage.data[srcPixelOffset2 + 3];
						case 3:		// eslint-disable-line
							accumulator2 += srcImage.data[srcPixelOffset2 + 2];
							accumulator1 += srcImage.data[srcPixelOffset2 + 1];
						case 1:		// eslint-disable-line
							accumulator0 += srcImage.data[srcPixelOffset2 + 0];
						default:	// eslint-disable-line
							break;
					}

					srcPixelOffset2 += srcImage.bytesPerPixel;
				}

				srcRowOffset2 += srcImage.bytesPerLine;
			}

			const numPixelsInThisPixel = thisPixelWidth * thisPixelHeight;

			const result3 = Math.round(accumulator3 / numPixelsInThisPixel);
			const result2 = Math.round(accumulator2 / numPixelsInThisPixel);
			const result1 = Math.round(accumulator1 / numPixelsInThisPixel);
			const result0 = Math.round(accumulator0 / numPixelsInThisPixel);

			let dstRowOffset2 = dstPixelOffset;

			for (let row2 = 0; row2 < thisPixelHeight; row2++) {
				let dstPixelOffset2 = dstRowOffset2;

				for (let col2 = 0; col2 < thisPixelWidth; col2++) {

					switch (srcImage.bytesPerPixel) {
						case 4:
							dstImage.data[dstPixelOffset2 + 3] = result3;
						case 3:		// eslint-disable-line
							dstImage.data[dstPixelOffset2 + 2] = result2;
							dstImage.data[dstPixelOffset2 + 1] = result1;
						case 1:		// eslint-disable-line
							dstImage.data[dstPixelOffset2 + 0] = result0;
						default:	// eslint-disable-line
							break;
					}

					dstPixelOffset2 += dstImage.bytesPerPixel;
				}

				dstRowOffset2 += dstImage.bytesPerLine;
			}

			dstPixelOffset += dstImage.bytesPerPixel * pixelWidth;
			srcPixelOffset += srcImage.bytesPerPixel * pixelWidth;
		}

		dstRowOffset += dstImage.bytesPerLine * pixelHeight;
		srcRowOffset += srcImage.bytesPerLine * pixelHeight;
	}

	return dstImage;
}

/*
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
*/

module.exports = {
	pixelateFromImage: pixelateFromImage
};
