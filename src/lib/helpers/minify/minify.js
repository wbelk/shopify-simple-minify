const {minifyHtml} = require('./html/minify_html')
const {minifyJS} = require('./js/minify_js')
const {minifyCSS} = require('./css/minify_css')

const minifyByType = {
  js: (fileName, str, cb) => {
    minifyJS(fileName, str, (res) => {
      cb(res)
    })
  },
  html: (fileName, str, cb) => {
    minifyHtml(fileName, str, (res) => {
      cb(res)
    })
  },
  css: (fileName, str, cb) => {
    minifyCSS(fileName, str, (res) => {
      cb(res)
    })
  }
}

function minify (fileName, str, cb) {
  let suffix = fileName.match(/\.[a-zA-Z]+$/)
  if (!suffix) return cb(str)

  suffix = suffix[0].replace('.', '')
  if (suffix === 'liquid') suffix = 'html'
  if (fileName.match(/\.css\.liquid/)) suffix = 'css'

  if (!minifyByType[suffix]) return cb(str)

  minifyByType[suffix](fileName, str, (res) => {
    cb(res)
  })
}

module.exports = {
  minify
}
