var CleanCSS = require('clean-css')
const {errorExit} = require('../../../helpers/errors/error_exit')
const {deltaStr} = require('../../delta/delta')

function minifyCSS (fileName, str, cb) {
  var res
  try {
    res = new CleanCSS().minify(str)

    let {originalSize, minifiedSize} = res.stats
    deltaStr(fileName, 'css', originalSize, minifiedSize)

    cb(res.styles)
  } catch (e) {
    errorExit(`error minify css for file: ${fileName}`)
  }
}

module.exports = {
  minifyCSS
}
