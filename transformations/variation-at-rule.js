const parseCSS = require('../lib/parse-css.js')

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
            .some(({value}) => String(environment.variation) === String(value))
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