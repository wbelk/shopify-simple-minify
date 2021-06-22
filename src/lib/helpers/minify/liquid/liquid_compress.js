function liquidCompress (str) {
  var matched = str.match(/\{\% (?!(assign|capture))[a-z].+ ['"].+['"] \%\}/)
  if (!matched) return str

  for (let tag of matched) {
    if (!tag) continue
    let newTag = tag.replace('{%', '{%-').replace('%}', '-%}')
    str = str.replace(tag, newTag)
  }
  return str
}

module.exports = {
  liquidCompress
}
