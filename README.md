# postcss-adaptive

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

A [postcss](https://www.npmjs.com/package/postcss) plugin that calculates and generates adaptive css code, such as `rem` and `0.5px borders for retina devices`.

## Usage

The raw stylesheet only contains @2x style, and if you

* don't intend to transform the original value, add `/*no*/` after the declaration
* intend to use `rem` unit，add `/*rem*/` after the declaration

**Attention: Dealing with SASS or LESS, only `/*...*/` comment can be used, in order to have the comments persisted.**

Before processing:

```css
.selector {
  height: 64px;
  width: 150px; /*rem*/
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd; /*no*/
}
```

After processing:

```css
.selector {
  height: 32px;
  width: 2rem;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
}
.hairlines .selector {
  border-top: 0.5px solid #ddd;
  border-bottom: 0.5px solid #ddd;
}
```

## API

`adaptive(config)`

Config: 

* `remUnit`: number, rem unit value (default: 75)
* `baseDpr`: number, base device pixel ratio (default: 2)
* `remPrecision`: number, rem value precision (default: 6)
* `hairlineClass`: string, class name of 1px border (default 'hairlines')
* `autoRem`: string, whether to transform to rem unit (default: false)

### Node

```shell
npm install postcss postcss-adaptive
```

```javascript
var postcss = require('postcss');
var adaptive = require('postcss-adaptive');
var originCssText = '...';
var newCssText = postcss().use(adaptive({ remUnit: 75 })).process(originCssText).css;
```

### Gulp

```shell
npm install gulp-postcss postcss-adaptive
```

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

### Webpack

```shell
npm install postcss-loader postcss-adaptive
```

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

### Grunt

```shell
npm install grunt-postcss postcss-adaptive
```

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

## Change Log

### 0.2.0

* Support `autoRem` option.

### 0.1.4

* Support `/*no*/` comment.

### 0.1.0

* First release.

## License

MIT
