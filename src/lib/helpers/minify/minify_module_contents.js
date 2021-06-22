const fs = require('fs')
const {md} = require('../../../data/shared_data')
const {errorExit} = require('../../helpers/errors/error_exit')
const {minify} = require('./minify')
const {writeLog} = require('../../log/log')
const {fileChangedHelper} = require('../../fs/file_changed_helper')

function minifyModuleContents (path, cb) {
  const errorMessage = `module ${path.join('/')} does not exist`

  let fileName = path[path.length - 1]
  // CHECK DIRS EXISTS
  let thisDirectoryTree = './' + md + '/modules'
  if (path.length > 1) {
    let subTree = []
    for (let i = 0; i < path.length - 1; i++) subTree.push(path[i])

    thisDirectoryTree += '/' + subTree.join('/')

    let thisDirectory
    try {
      thisDirectory = fs.readdirSync(thisDirectoryTree)
    } catch (e) {
      errorExit(errorMessage, e)
    }
    if (!thisDirectory) errorExit(errorMessage)
  }
  // CHECK MODULE FILE EXISTS

  const filePath = thisDirectoryTree + '/' + fileName

  let contents = fs.readFileSync(filePath, 'utf-8')
  if (!contents) errorExit(errorMessage)

  if (!fileChangedHelper(filePath)) return cb()

  minify(fileName, contents, (res) => {
    console.log('~~ module process: ' + filePath)
    writeLog(filePath)
    cb(res)
  })
}

module.exports = {
  minifyModuleContents
}
