const fs = require('fs')
const path = require('path')
const processCSS = require('process-css')
const jsincss = require('jsincss')
const transformations = require('./transformations.js')

let css = fs.readFileSync(
  process.argv[2]
).toString()

const environment = Object.assign(
  {
    cssDir: path.dirname(process.argv[2])
  },
  process.argv[3]
    ? JSON.parse(process.argv[3])
    : {}
)

let processed = processCSS(
  css,
  transformations,
  environment
)

if (processed.js.length) {
  processed.otherFiles = Object.assign(
    {jsincss: jsincss.toString()},
    processed.otherFiles || {}
  )
}

console.log(`
  ((${
    processed.otherFiles
      ? Object.keys(processed.otherFiles).join(', ')
      : ''
  }) => {
    ${
      processed.css.length
        ? `document.documentElement.appendChild(document.createElement('style')).textContent = \`${processed.css}\`;`
        : ''
    }
    ${
      processed.js.length
      ? `
        jsincss(event => [
          ${processed.js}
        ].join('\\n'));
        window.dispatchEvent(new CustomEvent('reprocess'));
      `
      : ''
    }
  })(${
    processed.otherFiles
      ? Object.values(processed.otherFiles).join(', ')
      : ''
  });
`)