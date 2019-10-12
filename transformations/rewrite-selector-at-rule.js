const parseCSS = require('../lib/parse-css.js')
// const pattern = require('apophany/index.cjs.js')

const features = {
  prefix: (selector, string) => `${string}${selector}`,
  suffix: (selector, string) => `${selector}${string}`,
  replace: (selector, pattern, replacement) => selector.replace(
    new RegExp(pattern, 'g'),
    replacement
  )
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--rewrite-selector'
      ) {

        // Extract conditions
        let conditions = rule.prelude.filter(({type, name}) => 
          type === 'FUNCTION'
          && Object.keys(features).some(term => term === name)
        )

        // Rewrite selectors
        parseCSS.parseAListOfRules(rule.value.value).map(childRule => {

          // process selectors based on conditions
          conditions.forEach(condition => {

            if (condition.name === 'replace') {
              childRule.prelude = parseCSS.parseAListOfComponentValues(
                features[condition.name](
                  childRule.prelude.map(token => token.toSource()).join('').trim(),
                  ...parseCSS.parseACommaSeparatedListOfComponentValues(
                    condition.value
                      .filter(({tokenType}) => tokenType !== 'WHITESPACE')
                      .map(token => token.toSource()).join('')
                  ).map(string => JSON.parse(string.join('')))
                )
              )
            } else {
              childRule.prelude = parseCSS.parseAListOfComponentValues(
                features[condition.name](
                  childRule.prelude.map(token => token.toSource()).join('').trim(),
                  condition.value.map(token => token.toSource()).join('')
                )
              )
            }
          })

          output.css += childRule.toSource()
        })
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