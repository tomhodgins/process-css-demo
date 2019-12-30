const parseCSS = require('../lib/parse-css/index.cjs.js')

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

          if (
            childRule.type === 'AT-RULE'
            && childRule.name === 'media'
          ) {
            childRule.value.value = parseCSS.parseAListOfComponentValues(
              parseCSS.parseAListOfRules(childRule.value.value).map(mediaRule =>
                processSelectors(mediaRule)
              )
            )
          } else if (rule.prelude) {
            processSelectors(childRule)
          }

          function processSelectors(current) {
            // process selectors based on conditions
            conditions.forEach(condition => {
              if (condition.name === 'replace') {
                current.prelude = parseCSS.parseAListOfComponentValues(
                  parseCSS.parseACommaSeparatedListOfComponentValues(current.prelude).map(selector =>
                    features[condition.name](
                      selector.map(token => token.toSource()).join('').trim(),
                      ...parseCSS.parseACommaSeparatedListOfComponentValues(
                        condition.value
                          .filter(({tokenType}) => tokenType !== 'WHITESPACE')
                          .map(token => token.toSource()).join('')
                      ).map(string => JSON.parse(string.join('')))
                    )
                  ).join(',')
                )
              } else {
                current.prelude = parseCSS.parseAListOfComponentValues(
                  parseCSS.parseACommaSeparatedListOfComponentValues(current.prelude).map(selector =>
                    features[condition.name](
                      selector.map(token => token.toSource()).join('').trim(),
                      condition.value.map(token => token.toSource()).join('')
                    )
                  ).join(',')
                )
              }
            })
            return current
          }

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