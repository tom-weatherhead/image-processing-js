// image-processing-js/src/resample.js

// See http://entropymine.com/imageworsener/bicubic/ :

// Cubic resampling

// Broadly speaking, cubic resampling means little more than "any algorithm in which the most sophisticated mathematical operation is to take the cube of a number".

// More strictly, we only consider cubic filters which have a certain maximum width (a radius of 2), and which are symmetric, unbiased, continuous and smooth, etc. Fortunately, there are only a limited number of filters which meet all the requirements. In a 1988 paper, Mitchell and Netravali showed that, given these constraints, there are only two free parameters remaining, which are usually named B and C. Here’s the general formula for this entire family of cubic filters:

// k(x) = (1/6) * (12 - 9B - 6C) * |x|^3 + (-18 + 12B + 6C) * |x|^2                      + (6 - 2B)			if |x| < 1
// k(x) = (1/6) * (-B - 6C)      * |x|^3 + (6B + 30C)       * |x|^2 + (-12B - 48C) * |x| + (8B + 24C)		if 1 <= |x| < 2
// k(x) = 0																									otherwise

// So, we have a two-dimensional space containing all the interesting cubic resampling algorithms. I will use the notation cubic(B,C) to refer to a specific algorithm in this space.

// The cubics for which C=0 are called the "B-spline" cubics. They are the ones that do not produce any ringing artifacts. If "B-spline" is used to refer to a specific algorithm, it means cubic(1,0).

// The cubics for which B=0 are known as the cardinal cubics. They are the ones that do not have any inherent blurring. By that, I mean if you apply a cardinal cubic to an image without changing the image size, it will leave the image pixels completely unchanged.

// The contenders

// 1. B-spline

// In some applications, "bicubic" means cubic(1,0). Other applications don’t call this filter "bicubic", and instead use the less-ambiguous name "B-spline." Though it’s sometimes useful, it’s very blurry, so it’s usually not the best choice.

// 2. Mitchell

// It’s also common for "bicubic" to be a Mitchell filter, which is cubic(1/3,1/3).

// 3. Catmull-Rom

// Some applications use a Catmull-Rom filter when you ask for "bicubic". This is cubic(0,1/2).

// 4. Unnamed cardinal cubic (0.75)

// I’ve only seen one application that uses cubic(0, 0.75), but it’s a popular application, so I include it in this list. It’s not clear to me why one would choose this over Catmull-Rom.

// 5. Unnamed cardinal cubic (1.0)

// I’ve seen several applications and code samples in which "bicubic" is cubic(0, 1). If this filter has a common name, I’m not aware of it. This is a rather poor filter, so when I see it implemented, I tend to assume that it was selected by someone who didn’t realize there were other options.

// ****

'use strict';

const modeNearestNeighbour = 0;
const modeBilinear = 1;
const modeBicubic = 2;

function resample1DNearestNeighbour (dstBuffer, dstInitialOffset, numDstPixels, dstPixelStride, srcBuffer, srcInitialOffset, numSrcPixels, srcPixelStride, numBytesPerPixel) {
	let accumulator = 0;

	for (let dstPixelIndex = 0; dstPixelIndex < numDstPixels; dstPixelIndex++) {
		const srcPixelIndex = Math.trunc(accumulator / numDstPixels) * srcPixelStride + srcInitialOffset;	// We need a truncating integer division operator.

		switch (numBytesPerPixel) {
			case 4:
				dstBuffer[dstInitialOffset + 3] = srcBuffer[srcPixelIndex + 3];
			case 3:			// eslint-disable-line
				dstBuffer[dstInitialOffset + 2] = srcBuffer[srcPixelIndex + 2];
				dstBuffer[dstInitialOffset + 1] = srcBuffer[srcPixelIndex + 1];
			case 1:			// eslint-disable-line
				dstBuffer[dstInitialOffset] = srcBuffer[srcPixelIndex];
			default:		// eslint-disable-line
				break;
		}

		dstInitialOffset += dstPixelStride;
		accumulator += numSrcPixels;
	}
}

function resample1DBilinear (dstBuffer, dstInitialOffset, numDstPixels, dstPixelStride, srcBuffer, srcInitialOffset, numSrcPixels, srcPixelStride, numBytesPerPixel) {
	let accumulator = 0;

	for (let dstPixelIndex = 0; dstPixelIndex < numDstPixels; dstPixelIndex++) {
		const srcPixelIndexInRun = Math.trunc(accumulator / numDstPixels);
		const srcPixelIndex = srcPixelIndexInRun * srcPixelStride + srcInitialOffset;		// We need a truncating integer division operator.

		if (srcPixelIndexInRun >= numSrcPixels - 1) {
			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstInitialOffset + 3] = srcBuffer[srcPixelIndex + 3];
				case 3:		// eslint-disable-line
					dstBuffer[dstInitialOffset + 2] = srcBuffer[srcPixelIndex + 2];
					dstBuffer[dstInitialOffset + 1] = srcBuffer[srcPixelIndex + 1];
				case 1:		// eslint-disable-line
					dstBuffer[dstInitialOffset] = srcBuffer[srcPixelIndex];
				default:	// eslint-disable-line
					break;
			}
		} else {
			const srcPixelIndex2 = (srcPixelIndexInRun + 1) * srcPixelStride + srcInitialOffset;		// We need a truncating integer division operator.
			const remainder = accumulator - srcPixelIndexInRun * numDstPixels;
			const weight1 = numDstPixels - remainder;
			const weight2 = remainder;

			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstInitialOffset + 3] = (srcBuffer[srcPixelIndex + 3] * weight1 + srcBuffer[srcPixelIndex2 + 3] * weight2) / numDstPixels;
				case 3:		// eslint-disable-line
					dstBuffer[dstInitialOffset + 2] = (srcBuffer[srcPixelIndex + 2] * weight1 + srcBuffer[srcPixelIndex2 + 2] * weight2) / numDstPixels;
					dstBuffer[dstInitialOffset + 1] = (srcBuffer[srcPixelIndex + 1] * weight1 + srcBuffer[srcPixelIndex2 + 1] * weight2) / numDstPixels;
				case 1:		// eslint-disable-line
					dstBuffer[dstInitialOffset] = (srcBuffer[srcPixelIndex] * weight1 + srcBuffer[srcPixelIndex2] * weight2) / numDstPixels;
				default:	// eslint-disable-line
					break;
			}
		}

		dstInitialOffset += dstPixelStride;
		accumulator += numSrcPixels;
	}
}

function generateCubicWeightFunction (B, C) {
	return x => {
		x = Math.abs(x);

		if (x < 1) {
			// k(x) = (1/6) * (12 - 9B - 6C) * |x|^3 + (-18 + 12B + 6C) * |x|^2                      + (6 - 2B)			if |x| < 1
			return (((12 - 9 * B - 6 * C) * x + (-18 + 12 * B + 6 * C)) * x * x + 6 - 2 * B) / 6;
		} else if (x < 2) {
			// k(x) = (1/6) * (-B - 6C)      * |x|^3 + (6B + 30C)       * |x|^2 + (-12B - 48C) * |x| + (8B + 24C)		if 1 <= |x| < 2
			//return (((((-B - 6 * C) * x) + (6 * B + 30 * C) * x) - (12 * B + 48 * C) * x) + 8 * B + 24 * C) / 6;
			return ((-B - 6 * C) * x + (6 * B + 30 * C) * x - (12 * B + 48 * C) * x + 8 * B + 24 * C) / 6;
		} else {
			// k(x) = 0																									otherwise
			return 0;
		}
	};
}

// const getBicubicWeight = generateCubicWeightFunction(1, 0);				// B-spline
// const getBicubicWeight = generateCubicWeightFunction(1 / 3, 1 / 3);		// Mitchell
const getBicubicWeight = generateCubicWeightFunction(0, 0.5);				// Catmull-Rom

function resample1DBicubic (dstBuffer, dstInitialOffset, numDstPixels, dstPixelStride, srcBuffer, srcInitialOffset, numSrcPixels, srcPixelStride, numBytesPerPixel) {
	let dstPixelOffsetInBuffer = dstInitialOffset;
	let accumulator = 0;

	for (let dstPixelIndex = 0; dstPixelIndex < numDstPixels; dstPixelIndex++) {
		const dstPixelIndexInSrcSpace = accumulator / numDstPixels;
		const srcPixelIndex = Math.trunc(dstPixelIndexInSrcSpace);
		let firstSrcPixelIndex = Math.max(srcPixelIndex - 1, 0);
		let lastSrcPixelIndex = Math.min(srcPixelIndex + 2, numSrcPixels - 1);
		let accumulator3 = 0;
		let accumulator2 = 0;
		let accumulator1 = 0;
		let accumulator0 = 0;
		let totalWeight = 0;
		let srcPixelOffsetInBuffer = firstSrcPixelIndex * srcPixelStride + srcInitialOffset;		// We need a truncating integer division operator.

		for (let srcPixelIndexInRun = firstSrcPixelIndex; srcPixelIndexInRun <= lastSrcPixelIndex; srcPixelIndexInRun++) {
			//const srcPixelWeight = getBicubicWeight(srcPixelIndexInRun - dstPixelIndexInSrcSpace);
			const srcPixelWeight = getBicubicWeight((srcPixelIndex - dstPixelIndexInSrcSpace) * numDstPixels / numSrcPixels);

			switch (numBytesPerPixel) {
				case 4:
					accumulator3 += srcBuffer[srcPixelOffsetInBuffer + 3] * srcPixelWeight;
				case 3:		// eslint-disable-line
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
					dstBuffer[dstPixelOffsetInBuffer + 3] = accumulator3 / totalWeight; // Or * inverseOfTotalWeight;
				case 3:		// eslint-disable-line
					dstBuffer[dstPixelOffsetInBuffer + 2] = accumulator2 / totalWeight;
					dstBuffer[dstPixelOffsetInBuffer + 1] = accumulator1 / totalWeight;
				case 1:		// eslint-disable-line
					dstBuffer[dstPixelOffsetInBuffer + 0] = accumulator0 / totalWeight;
				default:	// eslint-disable-line
					break;
			}
		} else {

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
		accumulator += numSrcPixels;
	}
}

function get1DResamplingFunction (mode) {

	switch (mode) {
		// case modeNearestNeighbour:		return resample1DNearestNeighbour;
		// case modeBilinear:				return resample1DBilinear;
		// case resample1DBicubic:			return resample1DBicubic;
		case modeNearestNeighbour:
			console.log('modeNearestNeighbour');

			return resample1DNearestNeighbour;

		case modeBilinear:
			console.log('modeBilinear');

			return resample1DBilinear;

		case modeBicubic:
			console.log('resample1DBicubic');

			return resample1DBicubic;

		default:
			return undefined;
	}
}

function resampleImageFromBuffer (srcImage, dstWidth, dstHeight, mode) {
	const fn1DResamplingFunction = get1DResamplingFunction(mode);

	if (!fn1DResamplingFunction) {
		console.error('No resampling function for mode', mode);

		return undefined;
	}

	const numBytesPerPixel = 4;	// Assume that the pixel format is RGBA.

	const srcWidth = srcImage.width;
	const srcHeight = srcImage.height;
	const srcBytesPerLine = srcWidth * numBytesPerPixel;
	const srcBuffer = srcImage.data;

	const intermediateWidth = dstWidth;
	const intermediateHeight = srcHeight;
	const intermediateBytesPerLine = dstWidth * numBytesPerPixel;
	const intermediateBuffer = Buffer.alloc(intermediateHeight * intermediateBytesPerLine);

	const dstBytesPerLine = intermediateBytesPerLine;
	const dstBuffer = Buffer.alloc(dstHeight * dstBytesPerLine);

	// 1) Resample horizontally from srcBuffer to intermediateBuffer

	for (let row = 0; row < srcHeight; row++) {
		fn1DResamplingFunction(intermediateBuffer, row * intermediateBytesPerLine, intermediateWidth, numBytesPerPixel, srcBuffer, row * srcBytesPerLine, srcWidth, numBytesPerPixel, numBytesPerPixel);
	}

	// 2) Resample vertically from intermediateBuffer to dstBuffer

	for (let col = 0; col < intermediateWidth; col++) {
		fn1DResamplingFunction(dstBuffer, col * numBytesPerPixel, dstHeight, dstBytesPerLine, intermediateBuffer, col * numBytesPerPixel, intermediateHeight, intermediateBytesPerLine, numBytesPerPixel);
	}

	return {
		width: dstWidth,
		height: dstHeight,
		data: dstBuffer
	};
}

// Stretching in context:

// There are three intervals in dest pixel space to be aware of:
// 1) The dest interval to be rendered.
// 2) The extent of the dest image. Do not write outside of this interval. Use this interval to crop interval #1.
// 3) The dest context.

// There are two intervals in src pixel space to be aware of:
// 4) The extent of the src image. Do not read outside of this interval.
// 5) The src context.

/*
function resampleInContext1DBicubic(
	dstBuffer,
	dstPixelOffsetInBuffer,
	dstPixelStride,
	dstRegionToRenderStart, dstRegionToRenderLength,
	dstContextStart, dstContextLength,
	srcBuffer,
	srcInitialOffset,
	srcPixelStride,
	numSrcPixels,		// We can safely read the src pixels with indices 0 <= i < numSrcPixels
	srcContextStart, srcContextLength,
	numBytesPerPixel) {

	let accumulator = (dstRegionToRenderStart - dstContextStart) * srcContextLength;

	dstPixelOffsetInBuffer += dstRegionToRenderStart * dstPixelStride;

	for (let dstPixelCounter = 0; dstPixelCounter < dstRegionToRenderLength; dstPixelCounter++) {
		const dstPixelIndexInSrcSpace = accumulator / dstContextLength + srcContextStart;
		const srcPixelIndex = Math.trunc(dstPixelIndexInSrcSpace);
		let firstSrcPixelIndex = Math.max(srcPixelIndex - 1, 0);
		let lastSrcPixelIndex = Math.min(srcPixelIndex + 2, numSrcPixels - 1);
		let accumulator3 = 0;
		let accumulator2 = 0;
		let accumulator1 = 0;
		let accumulator0 = 0;
		let totalWeight = 0;
		let srcPixelOffsetInBuffer = (firstSrcPixelIndex * srcPixelStride) + srcInitialOffset;		// We need a truncating integer division operator.

		for (let srcPixelIndexInRun = firstSrcPixelIndex; srcPixelIndexInRun <= lastSrcPixelIndex; srcPixelIndexInRun++) {
			//const srcPixelWeight = getBicubicWeight(srcPixelIndexInRun - dstPixelIndexInSrcSpace);
			const srcPixelWeight = getBicubicWeight((srcPixelIndexInRun - dstPixelIndexInSrcSpace) * dstContextLength / srcContextLength);

			switch (numBytesPerPixel) {
				case 4:
					accumulator3 += srcBuffer[srcPixelOffsetInBuffer + 3] * srcPixelWeight;
				case 3:
					accumulator2 += srcBuffer[srcPixelOffsetInBuffer + 2] * srcPixelWeight;
					accumulator1 += srcBuffer[srcPixelOffsetInBuffer + 1] * srcPixelWeight;
				case 1:
					accumulator0 += srcBuffer[srcPixelOffsetInBuffer + 0] * srcPixelWeight;
				default:
					break;
			}

			totalWeight += srcPixelWeight;
			srcPixelOffsetInBuffer += srcPixelStride;
		}

		if (totalWeight > 0) {

			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffsetInBuffer + 3] = accumulator3 / totalWeight; // Or * inverseOfTotalWeight;
				case 3:
					dstBuffer[dstPixelOffsetInBuffer + 2] = accumulator2 / totalWeight;
					dstBuffer[dstPixelOffsetInBuffer + 1] = accumulator1 / totalWeight;
				case 1:
					dstBuffer[dstPixelOffsetInBuffer + 0] = accumulator0 / totalWeight;
				default:
					break;
			}
		} else {

			switch (numBytesPerPixel) {
				case 4:
					dstBuffer[dstPixelOffsetInBuffer + 3] = 0;
				case 3:
					dstBuffer[dstPixelOffsetInBuffer + 2] = 0;
					dstBuffer[dstPixelOffsetInBuffer + 1] = 0;
				case 1:
					dstBuffer[dstPixelOffsetInBuffer + 0] = 0;
				default:
					break;
			}
		}

		dstPixelOffsetInBuffer += dstPixelStride;
		accumulator += numSrcPixels;
	}
}

function resampleImageInContextFromBuffer(
	srcImage,
	srcContextLeft, srcContextWidth, srcContextBottom (or Top?), srcContextHeight,
	dstBuffer,	// May be null or undefined; or an existing buffer may be provided.
	dstWidth, dstHeight,
	dstRegionToRenderLeft, dstRegionToRenderWidth, dstRegionToRenderBottom (or Top?), dstRegionToRenderHeight,
	dstContextLeft, dstContextWidth, dstContextBottom (or Top?), dstContextHeight,
	mode) {

	// **** The code below this line has not yet been modified ****

	const fn1DResamplingFunction = resampleInContext1DBicubic;
	// const fn1DResamplingFunction = get1DResamplingFunction(mode);

	// if (!fn1DResamplingFunction) {
		// console.error('No resampling function for mode', mode);
		// return undefined;
	// }

	const numBytesPerPixel = 4;	// Assume that the pixel format is RGBA.

	const srcWidth = srcImage.width;
	const srcHeight = srcImage.height;
	const srcBytesPerLine = srcWidth * numBytesPerPixel;
	const srcBuffer = srcImage.data;

	const intermediateWidth = dstWidth;
	const intermediateHeight = srcHeight;
	const intermediateBytesPerLine = dstWidth * numBytesPerPixel;
	const intermediateBuffer = Buffer.alloc(intermediateHeight * intermediateBytesPerLine);

	const dstBytesPerLine = intermediateBytesPerLine;
	const dstBuffer = Buffer.alloc(dstHeight * dstBytesPerLine);

	// TODO TomW 2018-04-14 : Decide what the intermediate image is supposed to contain when we are stretching in context. I.e. The first for loop below probably shouldn't be using srcHeight; instead, only use as much of the src image as we will need.

	// 1) Resample horizontally from srcBuffer to intermediateBuffer

	for (let row = 0; row < srcHeight; row++) {
		fn1DResamplingFunction(
			intermediateBuffer,
			row * intermediateBytesPerLine,		// dstPixelOffsetInBuffer,
			numBytesPerPixel,					// dstPixelStride,
			0, intermediateWidth,				// dstRegionToRenderStart, dstRegionToRenderLength,
			dstContextLeft, dstContextWidth,	// dstContextStart, dstContextLength,
			srcBuffer,
			row * srcBytesPerLine,				// srcInitialOffset,
			numBytesPerPixel,					// srcPixelStride,
			srcWidth,							// numSrcPixels,		// We can safely read the src pixels with indices 0 <= i < numSrcPixels
			srcContextLeft, srcContextWidth,	// srcContextStart, srcContextLength,
			numBytesPerPixel);

		// intermediateBuffer, row * intermediateBytesPerLine, intermediateWidth, numBytesPerPixel, srcBuffer, row * srcBytesPerLine, srcWidth, numBytesPerPixel, numBytesPerPixel);
	}

	// 2) Resample vertically from intermediateBuffer to dstBuffer

	for (let col = 0; col < intermediateWidth; col++) {
		fn1DResamplingFunction(
			dstBuffer,
			col * numBytesPerPixel,				// dstPixelOffsetInBuffer,
			dstBytesPerLine,					// dstPixelStride,
			0, dstHeight,						// dstRegionToRenderStart, dstRegionToRenderLength,
			dstRegionToRenderBottom, dstRegionToRenderHeight,	// dstContextStart, dstContextLength,
			intermediateBuffer,
			col * numBytesPerPixel,				// srcInitialOffset,
			intermediateBytesPerLine,			// srcPixelStride,
			intermediateHeight,					// numSrcPixels,		// We can safely read the src pixels with indices 0 <= i < numSrcPixels
			srcRegionToRenderBottom, srcRegionToRenderHeight,	// srcContextStart, srcContextLength,
			numBytesPerPixel);

			// dstBuffer, col * numBytesPerPixel, dstHeight, dstBytesPerLine, intermediateBuffer, col * numBytesPerPixel, intermediateHeight, intermediateBytesPerLine, numBytesPerPixel);
	}

	return {
		width: dstWidth,
		height: dstHeight,
		data: dstBuffer
	};
}
*/

module.exports = {
	modeNearestNeighbour: modeNearestNeighbour,
	modeBilinear: modeBilinear,
	modeBicubic: modeBicubic,
	resampleImageFromBuffer: resampleImageFromBuffer
};
