const parseCSS = require('../lib/parse-css/index.cjs.js')
const eunits = require('jsincss-element-units')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && rule.toSource().match(/[\d.]--e(w|h|min|max)/)
      ) {
        const unit = {
          selector: '',
          props: []
        }

        // Extract selector
        unit.selector = rule.prelude
          .map(token => token.toSource())
          .join('')
          .trim()

        // Output rule minus property to CSS
        output.css += `${
          unit.selector
        } {${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(declaration => 
            declaration.toSource().match(/[\d.]--e(w|h|min|max)/) === null
          ).map(token => token.toSource()).join('; ')
        }}`

        // Add dependencies to output
        output.otherFiles['elementPercentageUnits'] = eunits.toString()

        // Add rules to output JS
        output.js += `elementPercentageUnits(\`${unit.selector}\`, \`${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(declaration => 
            declaration.toSource().match(/[\d.]--e(w|h|min|max)/)
          ).map(declaration => {

            // Reformat unit for runtime plugin
            declaration.value
              .filter(({unit}) => unit)
              .forEach(token => {
                token.unit = token.unit.replace(/^--/, '')
                return token
              })
            
            // Stringify declaration
            return declaration.toSource()
          }).join(';')
        }\`),`
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