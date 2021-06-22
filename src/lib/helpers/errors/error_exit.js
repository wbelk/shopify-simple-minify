const buildErrStr = `\n\n** BUILD ERROR **\n\n`

function errorExit (str, err) {
  console.log(err)
  console.error(`${buildErrStr}${str}\n\n`)
  process.exit()
}

module.exports = {
  errorExit
}
