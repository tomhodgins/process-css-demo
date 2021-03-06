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
            && name === '--svg-encode'
          )
        ).length
      ) {

        // Replace --svg-encode(<url to image>) with url(<encoded content of SVG file>)
        rule.value.value.filter(({type, name}) =>
          type === 'FUNCTION'
          && name === '--svg-encode'
        ).forEach((token, index, list) => {
          const filename = token.value.map(({tokenType, value}) =>
            tokenType === 'STRING'
              ? JSON.parse(JSON.stringify(value))
              : value
          ).join('')

          if (fs.existsSync(`${environment.cssDir}/${filename}`)) {
            rule.value.value[
              rule.value.value.indexOf(token)
            ] = parseCSS.parseAComponentValue(`url("data:image/svg+xml,${
              fs.readFileSync(`${environment.cssDir}/${filename}`)
                .toString()
                .replace(/"/g, '\'')
                .replace(/#/g, '%23')
                .replace(/\{/g, '%7B')
                .replace(/\}/g, '%7D')
                .replace(/</g, '%3C')
                .replace(/>/g, '%3E')
                .replace(/\n/g, '')
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