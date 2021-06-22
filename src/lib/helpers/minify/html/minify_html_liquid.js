const {errorExit} = require('../../errors/error_exit')

function minfiySchema (str) {
  let schemas = str.match(/\{% schema %\}[\s\S]+\{% endschema %\}/g)

  if (!schemas) return str

  for (let schema of schemas) {
    // MULTIPLE SPACES
    let newSchema = schema.replace(/[\s\n\r]{2,}/g, '').replace(/(?<=["]:)\s(?=["\{\[])/g, '')    
    str = str.replace(schema, newSchema)
  }
  
  return str
}

function minfiyHtmlAndLiquid (fileName, str) {
  var res
  try {
    res = minfiySchema(str)
    // WHITESPACE AND LINE BREAKS
    res = res.replace(/(?<=(>|%\}|}{1,2}))[\s\n\r\t\f]*?(?=(<|\{%|}{1,2}))/g, '')
    // MULTIPLE SPACES / LINE BREAKS
    res = res.replace(/ {2,}/g, ' ')
    res = res.replace(/[\n\r]+$/, '')
  } catch (e) {
    errorExit(`error minifying file: ${fileName}`, e)
  }
  return res
}

module.exports = {
  minfiyHtmlAndLiquid
}
