const parseCSS = require('../lib/parse-css')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--reset'
        ) {
        let selector = '*'

        if (rule.prelude.length) {
          let part = rule.prelude.map(token => token.toSource()).join('').trim()

          selector = `${part}, ${part} *`
        }

        // Output reset rule to CSS
        output.css += `
          ${selector} {
            box-sizing: border-box;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-kerning: auto;
          }
        `
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