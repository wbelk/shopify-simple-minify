const {minifyJS} = require('../js/minify_js')
const {minifyCSS} = require('../css/minify_css')
const {liquidCompress} = require('../liquid/liquid_compress')
const {minfiyHtmlAndLiquid} = require('./minify_html_liquid')
const {deltaStr} = require('../../delta/delta')

const tags = ['script', 'style']

class MinifyByTag {
  static script (fileName, str, cb) {
    minifyJS(fileName, str, (res) => {
      cb(res)
    })
  }
  static style (fileName, str, cb) {
    minifyCSS(fileName, str, (res) => {
      cb(res)
    })
  }
}

function loopTags (fileName, str, tagName, matchedTags, cb) {
  var remaining = matchedTags.length
  var position = 0

  const checkFinished = () => {
    if (!--remaining) return cb(str)

    position++
    loop()
  }

  const loop = () => {
    let tag = matchedTags[position]

    // IF TAG CONTAINS LIQUID, ABORT
    if (tag.match(/\{%.+%}/)) {
      return checkFinished()
    }

    let replaceTagRegex = new RegExp(`</*${tagName}>`, 'g')
    let tagContents = tag.replace(replaceTagRegex, '')

    MinifyByTag[tagName](fileName, tagContents, (res) => {
      let newMinifiedTag = `<${tagName}>${res}</${tagName}>`
      str = str.replace(tag, () => newMinifiedTag)

      checkFinished()
    })
  }

  loop()
}

function minifyHtml (fileName, str, cb) {
  var remaining = tags.length
  var position = 0

  var originalSize = new TextEncoder().encode(str).length

  const checkFinished = () => {
    if (!--remaining) {
      str = minfiyHtmlAndLiquid(fileName, str)
      str = liquidCompress(str + '\n')

      var minifiedSize = new TextEncoder().encode(str).length
      deltaStr(fileName, 'html', originalSize, minifiedSize)

      return cb(str)
    }

    position++
    loop()
  }

  const loop = () => {
    let tagName = tags[position]
    let regex = new RegExp(`<${tagName}>[\\s\\S]+?</${tagName}>`, 'g')
    let matchedTags = str.match(regex)
    if (!matchedTags) return checkFinished()

    loopTags(fileName, str, tagName, matchedTags, (res) => {
      str = res
      checkFinished()
    })
  }

  loop()
}

module.exports = {
  minifyHtml
}
