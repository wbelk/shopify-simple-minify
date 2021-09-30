const fs = require('fs')
const {md, shopifyDirectories, dashes} = require('../../data/shared_data')
const {errorExit} = require('../helpers/errors/error_exit')

function hasMainDirectory () {
  let userDirectories = fs.readdirSync('./')
  for (let file of userDirectories) {
    if (file === md && fs.statSync('./' + file).isDirectory()) return 1
  }
  errorExit(`root must contain a directory 'minify_modules'`)
}

function hasTwoDirectories () {
  let mainDirContents = fs.readdirSync('./' + md)
  let matches = 2
  for (let file of mainDirContents) {
    if (file.match(/modules|source_theme/)) if (!--matches) return 1
  }
  errorExit(`/${md}/ must have directories 'modules', 'source_theme'`)
}

function hasThemeDirectories () {
  const themeDirectories = fs.readdirSync('./' + md + '/source_theme')
  let matches = shopifyDirectories.length
  for (let file of themeDirectories) {
    if (shopifyDirectories.indexOf(file) > -1) matches--
  }

  const templateFiles = fs.readdirSync('./' + md + '/source_theme/templates')
  if (templateFiles.indexOf('customers') > -1) matches--

  if (!matches) return 1
  
  errorExit(`/${md}/source_theme must have all standard Shopify theme directories ${shopifyDirectories.join(', ')}`)
}

function checkDirectories (cb) {
  hasMainDirectory()
  console.log(dashes + '\n~~ your repo root has ' + md)
  hasTwoDirectories()
  console.log(`~~ ./${md}/modules and ./${md}/source_theme directories exist`)
  // hasThemeDirectories()
  // console.log(`~~ ./${md}/source_theme has all the Shopify theme directories\n${dashes}`)
  cb()
}

module.exports = {
  checkDirectories
}
