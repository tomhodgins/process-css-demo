const parseCSS = require('../lib/parse-css/index.cjs.js')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--variation'
      ) {

        // Output rule if variation is active
        if (
          rule.prelude
            .filter(({value}) => value)
            .some(({value}) => {
              try {
                return String(JSON.parse(environment.variation)) === String(value)
              }
              catch (error) {
                return String(environment.variation) === String(value)
              }
            })
        ) {
          output.css += parseCSS.parseAListOfRules(rule.value.value)
            .map(rule => rule.toSource())
            .join('\n')
        }
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