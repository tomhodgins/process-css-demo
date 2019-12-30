const parseCSS = require('../lib/parse-css/index.cjs.js')

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--reset'
        ) {
          let selector = '*'

          if (rule.prelude.length) {
            selector = parseCSS.parseACommaSeparatedListOfComponentValues(
              rule.prelude.map(token => token.toSource()).join('')
            ).map(part => {
              part = part.map(token => token.toSource()).join('')
              return `${part}, ${part} *`
            }
            ).join(', ')
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