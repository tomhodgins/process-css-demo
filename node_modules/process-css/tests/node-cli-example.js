// run with: node node-cli-example.js input/input.css output/output.css output/output.js

const fs = require('fs')
const processCSS  = require('../index.cjs.js')
const parseCSS = require('../../parse-css/index.cjs.js')
// const patternMatcher = require('../../apophany/index.cjs.js')
// ↑ only uncomment if needed

function customAtRule(string = '') {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (result, rule) => {
      if (
        rule.type === 'AT-RULE'
        && rule.name === '--custom'
      ) {
        result.otherFiles = {
          'output/jsincss': 'function virtualStyleSheetManager() { }',
          'output/plugin': 'function customAtRulePlugin() { }'
        }
        result.js += `
virtualStyleSheetManager(
  customAtRulePlugin(\`${
    rule.value.value
      .map(token => token.toSource())
      .join('')
    }\`)
)`.trim()
      } else {
        result.css += rule.toSource()
      }

      return result
    },
    {
      css: '',
      js: '',
      otherFiles: {}
    }
  )
}

const output = processCSS(
  fs.readFileSync(process.argv[2]).toString() || '',
  [
    customAtRule
  ]
)

if (
  output.css
  && typeof output.css === 'string'
) {
  fs.writeFileSync(
    process.argv[3] || 'output.css',
    output.css
  )
}

if (
  output.js
  && typeof output.js === 'string'
) {
  fs.writeFileSync(
    process.argv[4] || 'output.js',
    output.js
  )
}

if (
  output.otherFiles
  && Object.entries(output.otherFiles).length
) {
  Object.entries(output.otherFiles).forEach(
    ([file,content]) => fs.writeFileSync(
      file,
      content
    )
  )
}

console.log(
  JSON.stringify(
    output,
    null,
    2
  )
)