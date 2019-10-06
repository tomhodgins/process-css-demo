const parseCSS = require('../lib/parse-css.js')
const pattern = require('apophany/index.cjs.js')
const overflow = require('jsincss-overflow')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType}) => tokenType === ':',
          ({type, name}) => type === 'FUNCTION' && name === '--overflowed',
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.start >= 0
      ) {
        const selector = rule.prelude
          .slice(0, match.start)
          .map(token => token.toSource())
          .join('')
          .trim()
          || '*'

        const descendants = rule.prelude
          .slice(match.end + 1)
          .map(token => token.toSource())
          .join('')

        const conditions = `[${rule.prelude[match.start + 1].value.map(token => 
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
        }, \`${selector}:self${descendants} {${
          rule.value.value
            .map(token => token.toSource())
            .join('')
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