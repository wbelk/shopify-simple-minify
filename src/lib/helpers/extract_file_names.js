const notAllowedRegex = /\.(min|scss)\.(liquid|js|css)$/

function extractFileNames (dir, arr) {
  const res = {
    allowed: [],
    copy_only: []
  }
  for (let fileName of arr) {
    if (dir === 'templates' && fileName === 'customers') continue

    if (!fileName.match(notAllowedRegex)) {
      res.allowed.push(fileName)
      continue
    }
    res.copy_only.push(fileName)
  }
  return res
}

module.exports = {
  extractFileNames
}
