const parseCSS = require('../lib/parse-css/index.cjs.js')
const pattern = require('apophany/index.cjs.js')

function has(selector, child, rule) {
  const attr = (selector + child).replace(/\W/g, '')
  const result = Array.from(document.querySelectorAll(selector))
    .filter(tag => tag.querySelector(`:scope ${child}`))
    .reduce((output, tag, count) => {
      output.add.push({tag: tag, count: count})
      output.styles.push(`[data-has-${attr}="${count}"] { ${rule} }`)
      return output
    }, {add: [], remove: [], styles: []})
  result.add.forEach(tag => tag.tag.setAttribute(`data-has-${attr}`, tag.count))
  result.remove.forEach(tag => tag.setAttribute(`data-has-${attr}`, ''))
  return result.styles.join('\n')
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType}) => tokenType === ':',
          ({type, name}) => type === 'FUNCTION' && name === '--has'
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.start >= 0
      ) {

        // Add dependencies to output
        output.otherFiles['hasElementSelector'] = has.toString()

        // Add rules to output JS
        output.js += `hasElementSelector(${
          JSON.stringify(
            rule.prelude
              .slice(0, match.start)
              .map(token => token.toSource())
              .join('')
              .trim()
            || '*'
          )
        }, ${
          JSON.stringify(
            rule.prelude[match.start + 1]
              .value
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