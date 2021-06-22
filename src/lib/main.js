const chokidar = require('chokidar')
const {checkDirectories} = require('./fs/check_directories')
const {minifyAssets} = require('./minify_assets')
const {initLog} = require('./log/log')
const {md, dashes} = require('../data/shared_data')

function moduleMinify () {
  const build = () => {
    minifyAssets()
  }

  initLog(() => {
    checkDirectories(() => {
      console.log(`~~ watching for changes on ./${md}\n` + dashes)
      chokidar.watch('./minify_modules').on('change', path => {
        build()
      })

      build()
    })
  })
}

module.exports = {
  moduleMinify
}
