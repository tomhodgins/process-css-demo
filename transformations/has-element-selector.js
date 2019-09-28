const parseCSS = require('../lib/parse-css.js')

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
      if (
        rule.type === 'QUALIFIED-RULE'
        && rule.prelude.find((token, index, list) => 
          token.tokenType === ':'
            && list[index + 1]
            && list[index + 1].type === 'FUNCTION'
            && list[index + 1].name === '--has'
        )
      ) {
        // Index of custom selector
        let customSelector = rule.prelude.findIndex((token, index, list) =>
          token.tokenType === ':'
            && list[index + 1]
            && list[index + 1].type === 'FUNCTION'
            && list[index + 1].name === '--has'
        )

        // Extract selector
        const selector = rule.prelude.slice(0, customSelector)
          .map(token => token.toSource())
          .join('')
          .trim()

        const child = rule.prelude[customSelector + 1].value
          .map(token => token.toSource())
          .join('')

        // Add dependencies to output
        output.otherFiles['hasElementSelector'] = has.toString()

        // Add rules to output JS
        output.js += `hasElementSelector(${
          JSON.stringify(selector || '*')
        }, ${
          JSON.stringify(child)
        }, ${
          JSON.stringify(
            rule.value.value
              .map(token => token.toSource())
              .join('')
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