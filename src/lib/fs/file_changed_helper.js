const fs = require('fs')
const log = require('../../data/log_memory')

function fileChangedHelper (filePath) {
  let fileChangedTs = +fs.statSync(filePath).mtimeMs.toFixed(0)

  let changed = 0

  // FILE CHANGED OR IS NEW
  if (!log.data[filePath] || (log.data[filePath] && log.data[filePath] < fileChangedTs)) changed = 1

  // console.log('>>>>>>>>>>>>>>>>>>> fileChangedHelper()', filePath, 'changed', changed, '\n\n')

  return changed
}

module.exports = {
  fileChangedHelper
}
