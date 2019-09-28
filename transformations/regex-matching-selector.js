const parseCSS = require('../lib/parse-css.js')
const regexMatch = require('jsincss-regex-match')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && rule.prelude.find((token, index, list) => 
          token.tokenType === ':'
            && list[index + 1]
            && list[index + 1].type === 'FUNCTION'
            && list[index + 1].name === '--regexp-match'
        )
      ) {
        // Index of custom selector
        let customSelector = rule.prelude.findIndex((token, index, list) =>
          token.tokenType === ':'
            && list[index + 1]
            && list[index + 1].type === 'FUNCTION'
            && list[index + 1].name === '--regexp-match'
        )

        // Extract selector
        const selector = rule.prelude.slice(0, customSelector)
          .map(token => token.toSource())
          .join('')
          .trim()

        const term = rule.prelude[customSelector + 1].value
          .map(token => token.toSource())
          .join('')

        // Add dependencies to output
        output.otherFiles['regexMatchingSelector'] = regexMatch.toString()

        // Add rules to output JS
        output.js += `regexMatchingSelector(${
          JSON.stringify(selector || '*')
        }, ${
          JSON.stringify(term)
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