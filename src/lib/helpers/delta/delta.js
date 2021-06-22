function deltaStr (fileName, type, o, m) {
  var delta = o - m
  if (!delta || delta < 100) return
  delta = (delta / 1000).toFixed(2)
  console.log(`          ${type} reduced ${delta}K for file: ${fileName}`)
}

module.exports = {
  deltaStr
}
