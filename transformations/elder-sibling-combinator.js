const parseCSS = require('../lib/parse-css.js')
const pattern = require('apophany/index.cjs.js')
const elder = require('jsincss-elder-selector')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType, value}) => tokenType === 'DELIM' && value === '/',
          ({tokenType, value}) => tokenType === 'IDENT' && value === '--elder',
          ({tokenType, value}) => tokenType === 'DELIM' && value === '/'
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.start >= 0
      ) {

        // Add dependencies to output
        output.otherFiles['elderSiblingCombinator'] = elder.toString()

        // Add rules to output JS
        output.js += `elderSiblingCombinator(${
          JSON.stringify(
            rule.prelude
              .slice(0, match.start)
              .map(token => token.toSource())
              .join('')
              .trim()
            || '*'
          )
        }, ${
          JSON.stringify(
            rule.prelude
              .slice(match.end + 1)
              .map(token => token.toSource())
              .join('')
              .trim()
            || '*'
          )
        }, ${
          JSON.stringify(
            rule.value.value
              .map(token => token.toSource())
              .join('')
          )
        }),`
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