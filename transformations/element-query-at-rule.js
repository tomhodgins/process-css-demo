const parseCSS = require('../lib/parse-css.js')
const element = require('jsincss-element-query')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      // convert kebab-case to camelCase
      function kebabToCamel(string = '') {
        return string.replace(/-([a-z])/g, (string, match) => match.toUpperCase())
      }

      if (
        rule.type === 'AT-RULE'
        && rule.name === '--element'
      ) {
        const query = {
          selector: '',
          conditions: {},
          rules: []
        }

        // Locate 'and' in at-rule prelude
        const firstAnd = rule.prelude.findIndex(({tokenType, value}) =>
          tokenType === 'IDENT' && value === 'and'
        )

        // Extract selector from at-rule prelude
        query.selector = rule.prelude.slice(0, firstAnd)
          .map(token => token.toSource())
          .join('')
          .trim()

        // Extract conditions from at-rule prelude
        rule.prelude.slice(firstAnd, -1)
          .filter(({type, name}) => type === 'BLOCK' && name === '(')
          .map(({value}) => {
            let colon = value.findIndex(({tokenType}) => tokenType === ':')
            query.conditions[
              kebabToCamel(
                value.slice(0, colon)
                  .map(token => token.toSource())
                  .join('')
                  .trim()
                )
            ] = value.slice(colon + 1, value.length)
              .map(token => token.toSource())
              .join('')
              .trim()

            return query.conditions
          })

        // Extract rules from group body rule
        query.rules = parseCSS.parseAListOfRules(rule.value.value).map(rule => {
          const selectorStart = rule.prelude.findIndex((token, index, list) =>
            token.tokenType === ':'
              && list[index + 1]
              && list[index + 1].tokenType === 'IDENT'
              && list[index + 1].value === '--self'
          )

          if (selectorStart !== -1) {
            rule.prelude.splice(
              selectorStart,
              2,
              parseCSS.parseAComponentValue('[--self]'),
            )
          }

          return rule.toSource()
        })

        // Add dependencies to output
        output.otherFiles['elementQueryAtRule'] = element.toString()

        // Add rules to output JS
        output.js += `elementQueryAtRule(${
          JSON.stringify(query.selector)
        }, ${
          JSON.stringify(query.conditions)
        }, \`${
          query.rules.join('')
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