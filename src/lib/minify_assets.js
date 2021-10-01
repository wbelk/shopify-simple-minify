const fs = require('fs')
const {md, shopifyDirectories} = require('../data/shared_data')
const {getFileNamesInDirectory} = require('./fs/get_filenames_in_directory')
const {extractFileNames} = require('./helpers/extract_file_names')
const {minifyFileContents} = require('./helpers/minify/minify_file_contents')
const {errorExit} = require('./helpers/errors/error_exit')
const {writeLog} = require('./log/log')
const {fileChangedHelper} = require('./fs/file_changed_helper')

const messages = {
  write: {
    error: 'error writing file to '
  },
  read: {
    error: 'error reading file from '
  },
  success_minify: '>> SUCCESS ',
  success_copy: '□□ copied '
}

function loopAllowedFiles (dir, fileNames) {
  var remaining = fileNames.length
  var position = 0

  const checkFinished = () => {
    if (!--remaining) return
    position++
    loop()
  }

  const loop = () => {
    let fileName = fileNames[position]
    let sourceFilePath = './' + md + '/source_theme/' + dir + '/' + fileName
    let rootFilePath = './' + dir + '/' + fileName

    minifyFileContents(dir, fileName, rootFilePath, (res) => {
      if (!res) return checkFinished()

      // ADD .min TO JS AND CSS FILES
      if (dir === 'assets' && fileName.match(/(\.js|\.css)$/) && fileName.indexOf('.min') < 0) rootFilePath = rootFilePath.replace(/\.js$/, '.min.js')

      fs.writeFile(rootFilePath, res, (err) => {
        if (err) {
          errorExit(messages.write.error + rootFilePath, err)
        }
        writeLog(sourceFilePath)
        console.log(messages.success_minify + 'compile and minify: ' + rootFilePath)
        checkFinished()
      })
    })
  }

  loop()
}

function loopCopyOnlyFiles (dir, fileNames) {
  var remaining = fileNames.length
  var position = 0

  const checkFinished = () => {
    if (!--remaining) return
    position++
    loop()
  }

  const loop = () => {
    let fileName = fileNames[position]
    let sourceFilePath = './' + md + '/source_theme/' + dir + '/' + fileName
    let rootFilePath = './' + dir + '/' + fileName

    if (!fileChangedHelper(sourceFilePath)) return checkFinished()

    fs.copyFile(sourceFilePath, rootFilePath, (err) => {
      if (err) {
        errorExit(messages.read.error + sourceFilePath, err)
      }

      writeLog(sourceFilePath)
      console.log(messages.success_copy + 'file to: ' + rootFilePath)

      checkFinished()
    })
  }

  loop()
}

function loopFileNames (dir, fileNames) {
  if (fileNames.allowed.length) {
    loopAllowedFiles(dir, fileNames.allowed)
  }

  if (!fileNames.copy_only.length) return

  loopCopyOnlyFiles(dir, fileNames.copy_only)
}

function minifyAssets () {
  var remaining = shopifyDirectories.length
  var position = 0

  const checkFinished = () => {
    if (!--remaining) return

    position++
    loop()
  }

  const loop = () => {
    let dir = shopifyDirectories[position]

    // DELETE & CREATE ROOT SHOPIFY DIRECTORIES
    let rootDirPath = './' + dir
    if (!fs.existsSync(rootDirPath)) fs.mkdirSync(rootDirPath)

    let fileNames = getFileNamesInDirectory(`./${md}/source_theme/${dir}`)
    
    if (!fileNames) return checkFinished()
    
    fileNames = extractFileNames(dir, fileNames)

    // console.log('dir', dir, 'fileNames', fileNames, '\n\n')

    loopFileNames(dir, fileNames)

    checkFinished()
  }

  loop()
}

module.exports = {
  minifyAssets
}
