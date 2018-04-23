# image-processing-js
A pure JavaScript raster image processing engine.

Git installation and execution instructions:

Install Git.

Install Node.js (e.g. via [nvm](https://github.com/creationix/nvm) or [Nodist](https://github.com/marcelklehr/nodist)).

In a terminal:

	$ npm i -g grunt
	$ git clone https://github.com/tom-weatherhead/image-processing-js.git
	$ cd image-processing-js
	$ npm i
	$ grunt

	Then run an image processing command; e.g.

	$ npm start rs
	$ npm start rs -sc -w 640 -h 480 -q 60

TODO:

	- Implement and test resampling in context
	- Test the new dividend remapping algorithm
	- Attempt to improve the performance of the arithmetic code by using integer types such as UINT16, and optimized operations such as (x / 256) === (x << 8);
	- Add unit tests
