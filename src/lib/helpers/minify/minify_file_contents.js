const fs = require('fs')
const {md} = require('../../../data/shared_data')
const {minifyModuleContents} = require('./minify_module_contents')
const {minify} = require('./minify')
const {fileChangedHelper} = require('../../fs/file_changed_helper')

function minifyFileContents (dir, fileName, rootFilePath, cb) {
  let sourceFilePath = `./${md}/source_theme/${dir}/${fileName}`

  var fileContents = fs.readFileSync(sourceFilePath, 'utf-8')

  var changed = 0

  if (fileChangedHelper(sourceFilePath)) changed = 1

  let modulesInFileContents = fileContents.match(/\{\% minify_module ['"].+['"] \%\}/)
  if (!modulesInFileContents) {
    if (!changed) return cb()
    minify(fileName, fileContents, (res) => {
      cb(res)
    })
    return
  }

  var remaining = modulesInFileContents.length
  var position = 0

  const checkFinished = () => {
    if (!--remaining) {
      if (!changed) return cb()

      minify(fileName, fileContents, (res) => {
        cb(res)
      })
      return
    }

    position++
    loop()
  }

  const loop = () => {
    let moduleRef = modulesInFileContents[position]

    let path = moduleRef.match(/['"].+['"]/)
    if (!path) return checkFinished()

    path = path[0].replace(/'|"/g, '').split('/')

    minifyModuleContents(path, (res) => {
      if (res) changed = 1

      fileContents = fileContents.replace(moduleRef, res)

      checkFinished()
    })
  }

  loop()
}

module.exports = {
  minifyFileContents
}
