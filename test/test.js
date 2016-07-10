var fs = require('fs')
var chai = require('chai')
var postcss = require('postcss')
var expect = chai.expect
var adaptive = require('../')

function readFile (filepath) {
  if (fs.existsSync(filepath)) {
    return fs.readFileSync(filepath, { encoding: 'utf-8' }) || ''
  }
  return ''
}

describe('normal', function () {

  it('integration', function () {
    var fixture = readFile('test/fixture.css')
    var expected = readFile('test/expected.css')
    var output = postcss().use(adaptive()).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })
})

describe('config', function () {

  it('rem unit', function () {
    var fixture = '.a { height: 64px; /*rem*/ }'
    var expected = '.a {\n  height: 1rem;\n}'
    var output = postcss().use(adaptive({ remUnit: 64 })).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })

  it('base dpr', function () {
    var fixture = '.a { height: 75px; }'
    var expected = '.a {\n  height: 25px;\n}'
    var output = postcss().use(adaptive({ baseDpr: 3 })).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })

  it('base dpr & 0.5px', function () {
    var fixture = '.a { border: 1px solid #ccc; }'
    var expected = '.a {\n  border: 1px solid #ccc;\n}\n\n.hairlines .a {\n  border: 0.5px solid #ccc;\n}'
    var output = postcss().use(adaptive({ baseDpr: 3 })).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })

  it('rem precision', function () {
    var fixture = '.a { height: 65px; /*rem*/ }'
    var expected = '.a {\n  height: 0.86666667rem;\n}'
    var output = postcss().use(adaptive({ remPrecision: 8 })).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })

  it('hairline class', function () {
    var fixture = '.a { border: 1px solid #ccc; }'
    var expected = '.a {\n  border: 1px solid #ccc;\n}\n\n.hairline .a {\n  border: 0.5px solid #ccc;\n}'
    var output = postcss().use(adaptive({ hairlineClass: 'hairline' })).process(fixture).css
    expect(output).is.a.string
    expect(output).eql(expected)
  })
})
