const parseCSS = require('../lib/parse-css/index.cjs.js')
const pattern = require('apophany/index.cjs.js')

function xpath(selector, path, rule) {
  const attr = selector.replace(/\W/g, '')
  const tags = []

  document.querySelectorAll(selector).forEach(tag => {
    const query = document.evaluate(
      path,
      tag,
      null,
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      null
    )
    for (let i=0; i < query.snapshotLength; i++) {
      tags.push(query.snapshotItem(i))
    }
  })
  const result = tags
    .reduce((output, tag, count) => {
      output.add.push({tag: tag, count: count})
      output.styles.push(`[data-xpath-${attr}="${count}"] { ${rule} }`)
      return output
    }, {add: [], remove: [], styles: []})
  result.add.forEach(tag => tag.tag.setAttribute(`data-xpath-${attr}`, tag.count))
  result.remove.forEach(tag => tag.setAttribute(`data-xpath-${attr}`, ''))
  return result.styles.join('\n')
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      const match = pattern(
        rule.prelude,
        [
          ({tokenType}) => tokenType === ':',
          ({type, name}) => type === 'FUNCTION' && name === '--xpath'
        ]
      )

      if (
        rule.type === 'QUALIFIED-RULE'
        && match.start >= 0
      ) {

        // Add dependencies to output
        output.otherFiles['xpathSelector'] = xpath.toString()

        // Add rules to output JS
        output.js += `xpathSelector(${
          JSON.stringify(
            rule.prelude
              .slice(0, match.start)
              .map(token => token.toSource())
              .join('')
              .trim()
            || ':root'
          )
        }, ${
          rule.prelude[match.start + 1]
            .value
            .map(token => token.toSource())
            .join('')
            .trim()
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