const fs = require('fs')
var log = require('../../data/log_memory')
const {errorExit} = require('../helpers/errors/error_exit')

const logPath = './.minify_changelog'

function initLog (cb) {
  if (!fs.existsSync(logPath)) return cb()

  fs.readFile(logPath, 'utf8', (err, data) => {
    if (err) {
      errorExit('error reading log file', err)
    }
    try {
      log.data = JSON.parse(data)
    } catch (e) {
      log.data = {}
    }
    cb()
  })
}

function writeLog (path) {
  log.data[path] = Date.now()
  fs.writeFileSync(logPath, JSON.stringify(log.data))
}

module.exports = {
  initLog: initLog,
  writeLog: writeLog
}
