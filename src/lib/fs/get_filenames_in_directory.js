const fs = require('fs')

function getFileNamesInDirectory (path) {
  return fs.readdirSync(path)
}

module.exports = {
  getFileNamesInDirectory
}
