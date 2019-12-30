const fs = require('fs')
const parseCSS = require('../lib/parse-css/index.cjs.js')

function mimicFunction(selector, target, property) {
  var tag = document.querySelector(target)

  return tag
    ? `
      ${selector} {
        ${property}: ${
          window.getComputedStyle(tag).getPropertyValue(property)
        };
      }
    `
    : ''
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && rule.value.value.filter(
          (({type, name}) =>
            type === 'FUNCTION'
            && name === '--mimic'
          )
        ).length
      ) {
        const selector = rule.prelude.map(token => token.toSource()).join('')
        let found = []

        // For each property
        parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        ).filter(value => value.value.find(({type, name}) =>
          type === 'FUNCTION'
          && name === '--mimic'
        )).forEach((property, index, list) => {
          const target = property.value.find(({type, name}) =>
            type === 'FUNCTION'
            && name === '--mimic'
          ).value.map(token => token.toSource()).join('')

          // Output JS-supported function to JS
          output.otherFiles['mimicFunction'] = mimicFunction.toString()
          output.js += `mimicFunction(
            \`${selector}\`,
            \`${target}\`,
            \`${property.name}\`
          ),`

          found.push(property.name)
        })

        // Output rule minus properties containing function to CSS
        output.css += `${
          selector
        } { ${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(({name}) => found.includes(name) === false
          ).map(token => token.toSource()).join('; ')
        } }`
      } else {

        // Output untouched CSS rules
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