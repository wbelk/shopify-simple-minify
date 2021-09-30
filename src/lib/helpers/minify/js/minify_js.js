const babel = require('@babel/core')
const UglifyJS = require('uglify-js')
const {errorExit} = require('../../../helpers/errors/error_exit')
const {deltaStr} = require('../../delta/delta')

const babelOptions = {}

function minifyJS (fileName, str, cb) {
  let transformed = str

  const originalSize = new TextEncoder().encode(str).length

  // DON'T TRANSPILE IF CONTAINS JQUERY CODE, ONLY MINIFY
  const noBabel = str.match(/\$\.|jquery|\$\(/i)

  const babelIt = function (cb) {
    if (noBabel) return cb()
    babel.transform(str, babelOptions, function (err, result) {
      if (err) {
        errorExit(`${fileName} has invalid javascript: babel transpiler`, err)
      }
      transformed = result.code // => { code, map, ast }

      cb()
    })
  }

  const uglifyIt = function () {
    try {
      transformed = UglifyJS.minify(str, { mangle: true })
    } catch (e) {
      errorExit(`${fileName} has invalid javascript: uglify`, e)
    }

    let minifiedSize = new TextEncoder().encode(transformed.code).length
    deltaStr(fileName, 'js', originalSize, minifiedSize)

    cb(transformed.code)
  }

  babelIt(() => {
    uglifyIt((res) => {
      cb(res)
    })
  })

  
}

module.exports = {
  minifyJS
}
