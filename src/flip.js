// image-processing-js/src/flip.js

function flipImageFromBuffer (srcImage) {
	const srcBuffer = srcImage.data;
	const dstBuffer = Buffer.alloc(srcImage.height * srcImage.bytesPerLine);
	let srcRowOffset = 0;
	let dstRowOffset = (srcImage.height - 1) * srcImage.bytesPerLine;

	for (let row = 0; row < srcImage.height; row++) {
		// See https://nodejs.org/api/buffer.html#buffer_buf_copy_target_targetstart_sourcestart_sourceend :
		srcBuffer.copy(dstBuffer, dstRowOffset, srcRowOffset, srcRowOffset + srcImage.bytesPerLine);
		srcRowOffset += srcImage.bytesPerLine;
		dstRowOffset -= srcImage.bytesPerLine;
	}

	return {
		width: srcImage.width,
		height: srcImage.height,
		data: dstBuffer,
		bytesPerLine: srcImage.bytesPerLine,
		bytesPerPixel: srcImage.bytesPerPixel
	};
}

module.exports = {
	flipImageFromBuffer: flipImageFromBuffer
};
