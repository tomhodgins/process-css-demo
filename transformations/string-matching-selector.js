const parseCSS = require('../lib/parse-css/index.cjs.js')
const pattern = require('apophany/index.cjs.js')
const stringMatch = require('jsincss-string-match')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType}) => tokenType === ':',
          ({type, name}) => type === 'FUNCTION' && name === '--string-match'
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.start >= 0
      ) {

        // Add dependencies to output
        output.otherFiles['stringMatchingSelector'] = stringMatch.toString()

        // Add rules to output JS
        output.js += `stringMatchingSelector(${
          JSON.stringify(
            rule.prelude
              .slice(0, match.start)
              .map(token => token.toSource())
              .join('')
              .trim()
            || '*'
          )
        }, ${
          rule.prelude[match.start + 1]
            .value
            .map(token => token.toSource())
            .join('')
            .trim()
        }, ${
          JSON.stringify(
            rule.value.value
              .map(token => token.toSource())
              .join('')
              .trim()
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