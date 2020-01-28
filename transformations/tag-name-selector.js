const parseCSS = require('../lib/parse-css/index.cjs.js')
const pattern = require('apophany/index.cjs.js')

function tagNameSelector(selector, method, string, rule) {
  const features = {
    '^': (name, string) => name.toLowerCase().startsWith(string.toLowerCase()),
    '*': (name, string) => name.toLowerCase().includes(string.toLowerCase()),
    '$': (name, string) => name.toLowerCase().endsWith(string.toLowerCase()),
  }

  const selectors = Array.from(document.querySelectorAll('*')).reduce(
    (set, tag) => {
      if (features[method](tag.tagName, string)) {
        set.add(
          selector.replace(
            new RegExp(`:--tag-name\\(\\${method}\\s+${string}\\)`),
            tag.tagName.toLowerCase()
          )
        )
      }
      return set
    },
    new Set
  )

  return `${
    Array.from(selectors).join(', ')
  } { ${rule} }`
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType}) => tokenType === ':',
          ({type, name}) => type === 'FUNCTION' && name === '--tag-name'
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.start >= 0
      ) {
        const filteredMicroSyntax = match.match[1].value.filter(({tokenType}) =>
          tokenType !== 'WHITESPACE'
        )
        const firstToken = filteredMicroSyntax[0]

        if (
          ['^', '*', '$'].some(method => method === firstToken.value)
        ) {

        }

        // Add dependencies to output
        output.otherFiles['tagNameSelector'] = tagNameSelector.toString()

        // Add rules to output JS
        output.js += `tagNameSelector(${
          JSON.stringify(
            rule.prelude
              .map(token => token.toSource())
              .join('')
              .trim()
            || '*'
          )
        }, ${
          JSON.stringify(firstToken.value)
        }, ${
          JSON.stringify(
            filteredMicroSyntax.slice(1)
              .map(token => token.toSource())
              .join('')
              .trim()
          )
        }, ${
          JSON.stringify(
            rule.value.value
              .map(token => token.toSource())
              .join('')
              .trim()
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