#!/usr/bin/env node

// dependencies
const fs = require('fs')
const path = require('path')
const processCSS = require('process-css')
const jsincss = require('jsincss')
const prettier = require('prettier')
const postcss = require('postcss')
const cssnano = require('cssnano')
const terser = require('terser')

// our CSS transformations
const transformations = require('./transformations.js')

const options = {
  file: '',
  css: false,
  js: false,
  data: null,
  minify: false,
  beautify: false,
  helpMode: false
}

// Parse arguments from command-line input
process.argv.slice(2).forEach((arg, index, list) => {

  // First argument is our stylesheet or path to a stylesheet
  if (index === 0) {
    options.file = arg
  }

  // -c or --css to select CSS-only output
  if (
    ['-c', '--css'].some(term => term === arg)
  ) {
    options.css = true
  }

    // -j or --js to select JavaScript-only output
    if (
      ['-j', '--js'].some(term => term === arg)
    ) {
      options.js = true
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

  // -h or --help to output help text
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
-j, --js          output JS only
-m, --minify      enable code minification
-b, --beautify    enable code beautification
-d, --data        supply data to preprocessor as JSON-parsable string
-h, --help        display this help message

Examples:

  # process a stylesheet
  $ node index.js styles.css

  # choose CSS-only output
  $ node index.js styles.css -c

  # beautify JS output
  $ node index.js styles.css -b

  # minify CSS-only output
  $ node index.js styles.css -c -m

  # load external data as JSON
  $ node index.js -d '{"variation": 1}'

  # use string of CSS
  $ node index.js '@--reset' --css --beautify
`

let css = ''

// Try to load CSS stylesheet
if (fs.existsSync(options.file)) {
  css = fs.readFileSync(options.file).toString()
} else if (options.file.length) {
  css = options.file
} else if (options.helpMode === false) {
  console.error(`ERROR: Could not read CSS from ${options.file || 'stylesheet'}`)
}

const environment = Object.assign(
  {
    cssDir: fs.existsSync(options.file)
      ? path.dirname(options.file || './')
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
    processed
    && (
      processed.css
      && processed.css.length
      || processed.js
      && processed.js.length
    )
  )
) {

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

  if (options.css === true) {

    if (options.minify === true) {
      postcss([cssnano])
        .process(css, {from: '', to: ''})
        .then(result => console.log(result.css))
    } else {

      console.log(processed.css.trim())
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
          options.js === false
          && processed.css.length
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