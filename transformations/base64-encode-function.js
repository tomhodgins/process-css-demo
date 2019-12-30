const fs = require('fs')
const parseCSS = require('../lib/parse-css/index.cjs.js')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        ).filter(
          ({value}) => value.find(({type, name}) =>
            type === 'FUNCTION'
            && name === '--base64-encode'
          )
        ).length
      ) {

        // Replace --base64-encode(<url to image>) with url(<base64'd content of file>)
        rule.value.value.filter(({type, name}) =>
          type === 'FUNCTION'
          && name === '--base64-encode'
        ).forEach((token, index, list) => {
          const filename = token.value.map(({tokenType, value}) =>
            tokenType === 'STRING'
              ? JSON.parse(JSON.stringify(value))
              : value
          ).join('')
          const extension = token.value[token.value.length - 1]

          if (fs.existsSync(`${environment.cssDir}/${filename}`)) {
            rule.value.value[
              rule.value.value.indexOf(token)
            ] = parseCSS.parseAComponentValue(`url("data:image/${extension.value};base64,${
              fs.readFileSync(`${environment.cssDir}/${filename}`).toString('base64')
            }")`)
          }
        })
      }

      // Output stringified CSS rule whether replace happened or not
      output.css += rule.toSource()
      return output
    },
    {
      css: ''
    }
  )
}