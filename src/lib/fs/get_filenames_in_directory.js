const fs = require('fs')

function getFileNamesInDirectory (path) {
  try {
    fs.statSync(path).isDirectory()
  } catch (e) {
    return 0
  }
  return fs.readdirSync(path)
}

module.exports = {
  getFileNamesInDirectory
}
