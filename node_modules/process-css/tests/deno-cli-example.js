// run with: deno deno-cli-example.js input/input.css output/output.css output/output.js

import processCSS from '../index.js'
import * as parseCSS from  'https://tomhodgins.github.io/parse-css/index.js'
// import patternMatcher from  'https://tomhodgins.github.io/apophany/index.js'
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
          'output/jsincss': 'function customAtRulePlugin() { }'
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
  new TextDecoder('utf-8').decode(
    Deno.readFileSync(Deno.args[1])
  ) || '',
  [
    customAtRule
  ]
)

if (
  output.css
  && typeof output.css === 'string'
) {
  Deno.writeFileSync(
    Deno.args[2] || 'output.css',
    new TextEncoder().encode(output.css)
  )
}

if (
  output.js
  && typeof output.js === 'string'
) {
  Deno.writeFileSync(
    Deno.args[3] || 'output.js',
    new TextEncoder().encode(output.js)
  )
}

if (
  output.otherFiles
  && Object.entries(output.otherFiles).length
) {
  Object.entries(output.otherFiles).forEach(
    ([file, content]) => Deno.writeFileSync(
      file,
      new TextEncoder().encode(content)
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