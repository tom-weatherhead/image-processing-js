# image-processing-js
A pure JavaScript raster image processing engine.

[![Build Status](https://secure.travis-ci.org/tom-weatherhead/image-processing-js.svg)](https://travis-ci.org/tom-weatherhead/image-processing-js)
[![npm](https://img.shields.io/npm/v/image-processing-js.svg)](https://www.npmjs.com/package/image-processing-js)
[![npm](https://img.shields.io/npm/dm/image-processing-js.svg)](https://www.npmjs.com/package/image-processing-js)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tom-weatherhead/image-processing-js/blob/master/LICENSE)
[![Maintainability](https://api.codeclimate.com/v1/badges/caaec44ebfcb74999b13/maintainability)](https://codeclimate.com/github/tom-weatherhead/image-processing-js/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/tom-weatherhead/image-processing-js/badge.svg?targetFile=package.json&package-lock.json)](https://snyk.io/test/github/tom-weatherhead/image-processing-js?targetFile=package.json&package-lock.json)

## Installation

Clone the repository and build it:

```
npm i -g grunt
git clone https://github.com/tom-weatherhead/image-processing-js.git
cd image-processing-js
npm run build
```

Then run an image processing command; e.g.

```
npm start rs
npm start rs -sc -w 640 -h 480 -q 60
```

TODO:

```
- Implement and test resampling in context
- Test the new dividend remapping algorithm
- Attempt to improve the performance of the arithmetic code by using integer types such as UINT16, and optimized operations such as (x / 256) === (x << 8);
- Add unit tests
```

## License
MIT
