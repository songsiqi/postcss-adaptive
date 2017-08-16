# postcss-adaptive

A [postcss](https://www.npmjs.com/package/postcss) plugin that calculates and generates adaptive css code, such as `rem` and `0.5px borders for retina devices`.

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/postcss-adaptive.svg?style=flat-square
[npm-url]: https://npmjs.org/package/postcss-adaptive
[travis-image]: https://img.shields.io/travis/songsiqi/postcss-adaptive.svg?style=flat-square
[travis-url]: https://travis-ci.org/songsiqi/postcss-adaptive
[coveralls-image]: https://img.shields.io/coveralls/songsiqi/postcss-adaptive.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/songsiqi/postcss-adaptive
[downloads-image]: http://img.shields.io/npm/dm/postcss-adaptive.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/postcss-adaptive

## Table of Contents

* [Requirements](#requirements)
* [Usage](#usage)
* [Changelog](#changelog)
* [License](#license)

## Requirements

Set rem unit and hairline class. For example:

```javascript
(function (win, doc) {
  var docEl = doc.documentElement;

  function setRemUnit () {
    var docWidth = docEl.clientWidth;
    var rem = docWidth / 10;
    docEl.style.fontSize = rem + 'px';
  }

  win.addEventListener('resize', function () {
    setRemUnit();
  }, false);
  win.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit();
    }
  }, false);

  setRemUnit();

  if (win.devicePixelRatio && win.devicePixelRatio >= 2) {
    var testEl = doc.createElement('div');
    var fakeBody = doc.createElement('body');
    testEl.style.border = '0.5px solid transparent';
    fakeBody.appendChild(testEl);
    docEl.appendChild(fakeBody);
    if (testEl.offsetHeight === 1) {
      docEl.classList.add('hairlines');
    }
    docEl.removeChild(fakeBody);
  }
}) (window, document);
```

## Usage

The raw stylesheet only contains @2x style, and if you

* intend to use `rem` unit，add `/*rem*/` after the declaration
* don't intend to transform the original value, add `/*no*/` after the declaration
* intend to use `px` unit when `autoRem` is set to `true`, add `/*px*/` after the declaration

**Attention: Dealing with SASS or LESS, only `/*...*/` comment can be used, in order to have the comments persisted.**

Before processing:

```css
.selector {
  height: 64px;
  width: 150px; /*rem*/
  padding: 10px; /*no*/
  border-top: 1px solid #ddd;
}
```

After processing:

```css
.selector {
  height: 32px;
  width: 2rem;
  padding: 10px;
  border-top: 1px solid #ddd;
}
.hairlines .selector {
  border-top: 0.5px solid #ddd;
}
```

### API

`adaptive(config)`

Config: 

* `remUnit`: number, rem unit value (default: 75)
* `baseDpr`: number, base device pixel ratio (default: 2)
* `remPrecision`: number, rem value precision (default: 6)
* `hairlineClass`: string, class name of 1px border (default 'hairlines')
* `autoRem`: boolean, whether to transform to rem unit (default: false)

#### Node

```shell
npm install postcss-adaptive
```

```javascript
var postcss = require('postcss');
var adaptive = require('postcss-adaptive');
var originCssText = '...';
var newCssText = postcss().use(adaptive({ remUnit: 75 })).process(originCssText).css;
```

#### Gulp

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var adaptive = require('postcss-adaptive');

gulp.task('default', function () {
  var processors = [adaptive({ remUnit: 75 })];
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'));
});
```

#### Webpack

```javascript
var adaptive = require('postcss-adaptive');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      }
    ]
  },
  postcss: function () {
    return [adaptive({ remUnit: 75 })];
  }
}
```

#### Grunt

```javascript
module.exports = function (grunt) {
  grunt.initConfig({
    postcss: {
      options: {
        processors: [
          adaptive({ remUnit: 75 })
        ]
      },
      dist: {
        src: 'src/*.css',
        dest: 'build'
      }
    }
  });
  grunt.loadNpmTasks('grunt-postcss');
  grunt.registerTask('default', ['postcss']);
}
```

## Changelog

### 0.4.0

* Do not generate `hairline` when the declaration is commented with `/*no*/`.

### 0.3.2

* Upgrade postcss version to 6.x.
* The value below 1px will not transfer to rem.

### 0.3.1

* Delete `minify` option, please use other postcss plugins like `cssnano` instead.

### 0.3.0

* Support `minify` option to minify the output css code.

### 0.2.0

* Support `autoRem` option.

### 0.1.4

* Support `/*no*/` comment.

### 0.1.0

* First release.

## License

MIT
