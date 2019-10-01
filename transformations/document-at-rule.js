const parseCSS = require('../lib/parse-css.js')

function documentAtRule(conditions, stylesheet) {
  var features = {
    url: string => location.href === string,
    urlPrefix: string => location.href.indexOf(string) === 0,
    domain: string => location.hostname === string,
    regexp: string => location.href.match(new RegExp(string))
  }
  return conditions.some(condition => {
    var feature = Object.keys(condition)[0]
    var test = condition[feature]
    return features[feature](test)
  })
  ? stylesheet
  : ''
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      // convert kebab-case to camelCase
      function kebabToCamel(string = '') {
        return string.replace(/-([a-z])/g, (string, match) => match.toUpperCase())
      }

      if (
        rule.type === 'AT-RULE'
        && rule.name === '--document'
      ) {
        const url = {
          conditions: [],
          rules: []
        }

        // Extract conditions
        url.conditions = rule.prelude.filter(({type, name}) => 
          type === 'FUNCTION'
          && ['url', 'url-prefix', 'domain', 'regexp'].some(term => term === name)
        ).map(({name, value}) => {
          const condition = {}
          condition[kebabToCamel(name)] = value
            .map(token => JSON.parse(token.toSource()))
            .join('')
          return condition
        })

      // Extract rules from group body rule
      url.rules = rule.value.value.map(token => token.toSource()).join('')

      // Add dependencies to output
      output.otherFiles['documentAtRule'] = documentAtRule.toString()

      // Output JS-supported at-rule to JS
      output.js += `documentAtRule(${
        JSON.stringify(url.conditions)
      },
        \`${url.rules}\`
      ),`
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