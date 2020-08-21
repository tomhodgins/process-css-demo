const parseCSS = require('../lib/parse-css/index.cjs.js')

function tryToRegisterCustomProperty(definition = {
  name: '',
  syntax: '',
  inherits: true,
  initialValue: ''
}) {
  try {
    CSS.registerProperty(definition)
  } catch (error) {}
}

function stringify(tokens = []) {
  return tokens
    .map(token => token.toSource())
    .join('')
    .trim()
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--property'
        ) {

        const properties = parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        )

        // Must have synax, initial-value, inherits properties
        if (
          ['syntax', 'inherits', 'initial-value'].every(property =>
            properties.find(({name}) => name === property)
          )
        ) {
          output.otherFiles['tryToRegisterCustomProperty'] = tryToRegisterCustomProperty.toString()

          output.js += `tryToRegisterCustomProperty({
            name: "${
              stringify(rule.prelude)
            }",
            syntax: ${
              stringify(
                properties.find(({name}) => name === 'syntax').value
              )
            },
            inherits: ${
              Boolean(
                stringify(
                  properties.find(({name}) => name === 'inherits').value
                )
              )
            },
            initialValue: ${
              JSON.stringify(
                stringify(
                  properties.find(({name}) => name === 'initial-value').value
                )
              )
            }
          })`
        }
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