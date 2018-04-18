# image-processing-js
A pure JavaScript raster image processing engine.

TODO:

- Implement and test resampling in context
- Implement and test compositing, starting with "A over B" : alpha * A + (1 - alpha) * beta * B.
- Test the new dividend remapping algorithm
- Attempt to improve the performance of the arithmetic code by using integer types such as UINT16, and optimized operations such as (x / 256) === (x << 8);
- Add unit tests
