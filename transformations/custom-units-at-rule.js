const parseCSS = require('../lib/parse-css/index.cjs.js')

module.exports = function(string = '', environment = {}) {
  // Extract custom unit definitions
  // and remove @--custom-units as you go
  const units = {}
  let css = ''

  // Extract units from @--custom-units at-rules
  parseCSS.parseAStylesheet(string).value.forEach(rule => {
    if (
      rule.type === 'AT-RULE'
      && rule.name === '--custom-units'
    ) {
      const declarations = parseCSS.parseAListOfDeclarations(
        rule.value.value
          .map(token => token.toSource())
          .join('')
      )

      declarations.forEach(({name, value}) =>
        units[name] = value.find(({tokenType}) => tokenType === 'DIMENSION')
      )
    }
  })


  // Replace custom unit tokens in stylesheet
  css = parseCSS.parseAListOfComponentValues(string).reduce(
    (css, token, index, list) => {
      function consumeToken(tok, list) {
        if (
          tok.tokenType === 'DIMENSION'
          && units.hasOwnProperty(tok.unit)
        ) {
          list.value[list.value.indexOf(tok)] = parseCSS.parseAComponentValue(
            `${tok.value * units[tok.unit].value}${units[tok.unit].unit}`
          )
        }

        if (Array.isArray(tok.value)) {
          tok.value.map(child => consumeToken(child, tok))
        }

        return tok
      }

      css += consumeToken(token, list).toSource()
      return css
    },
    ''
  )

  // Output all rules but @--custom-units
  return parseCSS.parseAStylesheet(css).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--custom-units'
      ) {
        // do nothing
      } else {
        output.css += rule.toSource()
      }

      return output
    },
    {
      css: ''
    }
  )
}