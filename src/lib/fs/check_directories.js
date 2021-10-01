const fs = require('fs')
const {md} = require('../../data/shared_data')

function hasDirectories () {
  let path = './minify_modules'
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  path = './minify_modules/source_theme'
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  path = './minify_modules/modules'
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}

function checkDirectories (cb) {
  hasDirectories()
  console.log(`~~ ./${md}/modules and ./${md}/source_theme directories exist`)
  cb()
}

module.exports = {
  checkDirectories
}
