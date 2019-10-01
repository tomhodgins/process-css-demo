const parseCSS = require('../lib/parse-css.js')
const pattern = require('apophany/index.cjs.js')
const parent = require('jsincss-parent-selector')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType, value}) => tokenType === 'DELIM' && value === '/',
          ({tokenType, value}) => tokenType === 'IDENT' && value === '--parent',
          ({tokenType, value}) => tokenType === 'DELIM' && value === '/'
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.match.length
      ) {

        // Add dependencies to output
        output.otherFiles['parentCombinator'] = parent.toString()

        // Add rules to output JS
        output.js += `parentCombinator(${
          JSON.stringify(
            rule.prelude
              .slice(0, match.start)
              .map(token => token.toSource())
              .join('')
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