// image-processing-js/src/convolve.js

'use strict';

const gaussianBlurEngine = require('./gaussian-blur.js');

function convolve1D (dstBuffer, dstInitialOffset, numDstPixels, dstPixelStride, srcBuffer, srcInitialOffset, numSrcPixels, srcPixelStride, numBytesPerPixel, kernel, kernelOffset) {
	let dstPixelOffsetInBuffer = dstInitialOffset;

	for (let dstPixelIndex = 0; dstPixelIndex < numDstPixels; dstPixelIndex++) {
		const srcPixelIndex = dstPixelIndex;
		let firstSrcPixelIndex = Math.max(srcPixelIndex - kernelOffset, 0);
		let lastSrcPixelIndex = Math.min(srcPixelIndex + kernelOffset, numSrcPixels - 1);
		let accumulator3 = 0;
		let accumulator2 = 0;
		let accumulator1 = 0;
		let accumulator0 = 0;
		let totalWeight = 0;
		let srcPixelOffsetInBuffer = firstSrcPixelIndex * srcPixelStride + srcInitialOffset;		// We need a truncating integer division operator.

		for (let srcPixelIndexInRun = firstSrcPixelIndex; srcPixelIndexInRun <= lastSrcPixelIndex; srcPixelIndexInRun++) {
			const srcPixelWeight = kernel[srcPixelIndexInRun - srcPixelIndex + kernelOffset];

			switch (numBytesPerPixel) {
				case 4:
					accumulator3 += srcBuffer[srcPixelOffsetInBuffer + 3] * srcPixelWeight;
				case 3:		// eslint-disable-line no-fallthrough
					accumulator2 += srcBuffer[srcPixelOffsetInBuffer + 2] * srcPixelWeight;
					accumulator1 += srcBuffer[srcPixelOffsetInBuffer + 1] * srcPixelWeight;
				case 1:		// eslint-disable-line
					accumulator0 += srcBuffer[srcPixelOffsetInBuffer + 0] * srcPixelWeight;
				default:	// eslint-disable-line
					break;
			}

			totalWeight += srcPixelWeight;
			srcPixelOffsetInBuffer += srcPixelStride;
		}

		if (totalWeight > 0) {

			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffsetInBuffer + 3] = Math.round(accumulator3 / totalWeight); // Or * inverseOfTotalWeight;
				case 3:		// eslint-disable-line
					dstBuffer[dstPixelOffsetInBuffer + 2] = Math.round(accumulator2 / totalWeight);
					dstBuffer[dstPixelOffsetInBuffer + 1] = Math.round(accumulator1 / totalWeight);
				case 1:		// eslint-disable-line
					dstBuffer[dstPixelOffsetInBuffer + 0] = Math.round(accumulator0 / totalWeight);
				default:	// eslint-disable-line
					break;
			}
		} else {
			console.log('Acc: totalWeight <= 0');

			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffsetInBuffer + 3] = 0;
				case 3:		// eslint-disable-line
					dstBuffer[dstPixelOffsetInBuffer + 2] = 0;
					dstBuffer[dstPixelOffsetInBuffer + 1] = 0;
				case 1:		// eslint-disable-line
					dstBuffer[dstPixelOffsetInBuffer + 0] = 0;
				default:	// eslint-disable-line
					break;
			}
		}

		dstPixelOffsetInBuffer += dstPixelStride;
	}
}

function convolveImageFromBuffer (srcImage, sigma, kernelSize, fnCreateImage) {
	const kernel = gaussianBlurEngine.generateKernel(sigma, kernelSize);
	const bytesPerPixel = 4;	// Assume that the pixel format is RGBA.

	const width = srcImage.width;
	const height = srcImage.height;
	// TODO: Use srcBytesPerLine, intermediateBytesPerLine, and dstBytesPerLine instead of bytesPerLine
	const bytesPerLine = width * bytesPerPixel;
	const srcBuffer = srcImage.data;

	const intermediateImage = fnCreateImage(width, height, bytesPerPixel);
	const intermediateBuffer = intermediateImage.data;

	const dstImage = fnCreateImage(width, height, bytesPerPixel);
	const dstBuffer = dstImage.data;

	const kernelOffset = Math.trunc(kernel.length / 2);

	// 1) Convolve horizontally from srcBuffer to intermediateBuffer

	for (let row = 0; row < height; row++) {
		convolve1D(intermediateBuffer, row * bytesPerLine, width, bytesPerPixel, srcBuffer, row * bytesPerLine, width, bytesPerPixel, bytesPerPixel, kernel, kernelOffset);
	}

	// 2) Convolve vertically from intermediateBuffer to dstBuffer

	for (let col = 0; col < width; col++) {
		convolve1D(dstBuffer, col * bytesPerPixel, height, bytesPerLine, intermediateBuffer, col * bytesPerPixel, height, bytesPerLine, bytesPerPixel, kernel, kernelOffset);
	}

	return dstImage;
}

/*
// function driver(sigma, kernelSize) {
function driver() {
	const sigma = 1.0;
	const kernelSize  =5;
	const kernel = gaussianBlurEngine.generateKernel(sigma, kernelSize);

	// console.log(`driver(${sigma}, ${kernelSize}) = [${gaussianBlurEngine.generateKernel(sigma, kernelSize).join(', ')}]`);
	console.log(`driver(${sigma}, ${kernelSize}) = ${kernel}]`);

	const srcFilePath = 'test/images/unconventional-table.jpg';
	const srcJpegData = fs.readFileSync(srcFilePath);
	const srcImage = jpeg.decode(srcJpegData);
	const dstImage = convolveImageFromBuffer(srcImage, kernel);

	if (dstImage) {
		const dstFilePath = 'gaussian-blur.jpg';
		const dstQuality = 50;
		const dstJpegData = jpeg.encode(dstImage, dstQuality);

		fs.writeFileSync(dstFilePath, dstJpegData.data);
	}
}

// driver(1.0, 5);
driver();
*/

module.exports = {
	convolveImageFromBuffer: convolveImageFromBuffer
};
