const parseCSS = require('../lib/parse-css.js')
const overflow = require('jsincss-overflow')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    // :--overflowed()
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && rule.prelude.find((token, index, list) => 
          token.tokenType === ':'
            && list[index + 1]
            && list[index + 1].type === 'FUNCTION'
            && list[index + 1].name === '--overflowed'
        )
      ) {
        // Index of custom selector
        let customSelector = rule.prelude.findIndex((token, index, list) =>
          token.tokenType === ':'
            && list[index + 1]
            && list[index + 1].type === 'FUNCTION'
            && list[index + 1].name === '--overflowed'
        )

        // Extract selector
        const selector = rule.prelude.slice(0, customSelector)
          .map(token => token.toSource())
          .join('')
          .trim()

        const descendants = rule.prelude.slice(customSelector + 2)
          .map(token => token.toSource())
          .join('')

        const conditions = `[${rule.prelude[customSelector + 1].value.map(token => 
          token.tokenType === 'IDENT'
            ? `"${token.toSource()}"`
            : token.toSource()
        ).join('')}]`

        // Add dependencies to output
        output.otherFiles['overflowedContentSelector'] = overflow.toString()

        // Add rules to output JS
        output.js += `overflowedContentSelector(${
          JSON.stringify(selector)
        }, ${
          conditions
        }, \`${selector}:self${descendants}{${
          rule.value.value.map(token => token.toSource()).join('')
        }}\`),`
      } else {
        output.css += rule.toSource()
      }

      return output
    },
    {
      css: '',
      js: '',
      otherFiles: {}
    }
  )
}