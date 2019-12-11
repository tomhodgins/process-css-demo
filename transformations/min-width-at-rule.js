const parseCSS = require('../lib/parse-css.js')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--min-width'
      ) {
        const stringify = tokens => tokens.map(token => token.toSource()).join('').trim()

        output.css += `@media (min-width: ${stringify(rule.prelude)}) ${rule.value.toSource()}`
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