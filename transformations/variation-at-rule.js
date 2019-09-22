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
          rule.prelude.map(({value}) => value).join('').trim()
          === String(environment.variation).trim()
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