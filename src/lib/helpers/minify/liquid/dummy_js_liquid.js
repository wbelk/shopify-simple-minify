function dummyJsLiquid (str) {
  let liquidTags = str.match(/\{% (for|if)[\s\S]+?end(for|if) %\}/g)
  if (!liquidTags) return 0

  for (let tag in liquidTags) str.replace(tag, `\n// f_o_o_b_a_r\n`)
}

module.exports = {
  dummyJsLiquid
}
