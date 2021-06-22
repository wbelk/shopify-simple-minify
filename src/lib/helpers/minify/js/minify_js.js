const babel = require('@babel/core')
const UglifyJS = require('uglify-js')
const {errorExit} = require('../../../helpers/errors/error_exit')
const {deltaStr} = require('../../delta/delta')

const babelOptions = {}

function minifyJS (fileName, str, cb) {
  let res

  var originalSize = new TextEncoder().encode(str).length

  babel.transform(str, babelOptions, function (err, result) {
    if (err) {
      errorExit(`${fileName} has invalid javascript: babel transpiler`, err)
    }
    res = result.code // => { code, map, ast }

    try {
      res = UglifyJS.minify(str, { mangle: true })
    } catch (e) {
      errorExit(`${fileName} has invalid javascript: uglify`, e)
    }

    let minifiedSize = new TextEncoder().encode(res.code).length
    deltaStr(fileName, 'js', originalSize, minifiedSize)

    cb(res.code)
  })
}

module.exports = {
  minifyJS
}
