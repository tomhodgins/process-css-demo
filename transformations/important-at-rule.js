const parseCSS = require('../lib/parse-css.js')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--important'
      ) {

        // Add !important to all declarations
        parseCSS.parseAListOfRules(rule.value.value).map(childRule => {
          childRule.value.value = parseCSS.parseAListOfComponentValues(
            parseCSS.parseAListOfDeclarations(childRule.value.value).map(declaration => {
              declaration.important = true
              return declaration
            }).map(r => r.toSource()).join(';')
          )

          return childRule
        })

        output.css += parseCSS.parseAListOfRules(rule.value.value)
          .map(childRule => childRule.toSource())
          .join('\n')
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