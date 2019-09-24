#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const processCSS = require('process-css')
const jsincss = require('jsincss')
const prettier = require('prettier')
const postcss = require('postcss')
const cssnano = require('cssnano')
const terser = require('terser')

// Load out transformations
const transformations = require('./transformations.js')

// Options
const options = {
  file: '',
  css: false,       // -c or --css to output CSS only
  data: null,       // -d or --data to supply data as JSON-parsable string
  minify: false,    // -m or --minify to enable code minification
  beautify: false,  // -b or --beautify to enable code beautification
  helpMode: false   // -h or --help to output help text
}

// Argument parsing from command-line input
process.argv.slice(2).forEach((arg, index, list) => {

  // First argument is always our stylesheet's file path
  if (index === 0) {
    options.file = arg
  }

  // -c or --css to output CSS only
  if (
    ['-c', '--css'].some(term => term === arg)
  ) {
    options.css = true
  }

  // -d or --data to specify JSON-parsable string of data
  if (
    ['-d', '--data'].some(term => term === arg)
    && list[index + 1]
    && typeof list[index + 1] === 'string'
    && JSON.parse(list[index + 1])
  ) {
    options.data = JSON.parse(list[index + 1])
  }

  // -m or --minify to enable code minification
  if (
    ['-m', '--minify'].some(term => term === arg)
  ) {
    options.minify = true
  }

  // -b or --beautify to enable code beautification
  if (
    ['-b', '--beautify'].some(term => term === arg)
  ) {
    options.beautify = true
  }

  // -h or --help to output help text, or no args given
  if (['-h', '--help'].some(term => term === arg)) {
    options.helpMode = true
  }
})

// If no arguments given, enable help mode
if (process.argv.slice(2).length === 0) {
  options.helpMode = true
}

const helpMessage = () => `
Process CSS Demo

About:

This is a simple CSS preprocessor, supporting CSS and JS output

Usage:

    node index.js <stylesheet> <options>

Options:

-c, --css         output CSS only
-d, --data        supply data as JSON-parsable string
-m, --minify      enable code minification
-b, --beautify    enable code beautification
-h, --help        display this help message

Examples:

    # process styles.css
    $ node index.js styles.css

    # CSS-only output
    $ node index.js styles.css -c

    # beautify JS output
    $ node index.js styles.css -b

    # minify CSS-only output
    $ node index.js styles.css -c -m

    # load external data as JSON
    $ node index.js -d '{"variation": 1}'
`

let css = ''

// Try to load CSS stylesheet
if (fs.existsSync(options.file)) {
  css = fs.readFileSync(
    process.argv[2]
  ).toString()
} else if (options.file.length) {
  css = options.file
} else if (options.helpMode === false) {
  console.error(`ERROR: Could not read CSS from ${options.file || 'stylesheet'}`)
}

const environment = Object.assign(
  {
    cssDir: fs.existsSync(options.file)
      ? path.dirname(options.filename)
      : process.cwd()
  },
  options.data || {}
)

let processed

if (css.length) {
  processed = processCSS(
    css,
    transformations,
    environment
  )
}

// Output formatted result to console if not empty and no help text displayed
if (
  options.helpMode === false
  && (
    processed.css.length
    || processed.js.length
  )
) {

  if (options.css === true) {

    if (options.minify === true) {
      postcss([cssnano])
        .process(css, {from: '', to: ''})
        .then(result => console.log(result.css))
    } else {

      if (options.beautify === true) {
        processed.css = prettier.format(
          processed.css,
          {
            tabs: false,
            tabWidth: 2,
            singleQuote: true,
            parser: 'css'
          }
        )
      }

      console.log(processed.css)
    }

  } else {

    // Add jsincss to otherFiles if there are other otherFiles
    if (processed.js.length) {
      processed.otherFiles = Object.assign(
        {jsincss: jsincss.toString()},
        processed.otherFiles || {}
      )
    }

    // Template JS output
    let js = `
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
    `

    if (options.minify) {
      js = terser.minify(js).code
    }

    if (options.beautify) {
      js = prettier.format(
        js,
        {
          tabs: false,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'es5',
          parser: 'flow'
        }
      )
    }

    console.log(js)
  }
} else if (options.helpMode === true) {
  console.log(helpMessage())
}