const parseCSS = require('../lib/parse-css/index.cjs.js')

function clampedFontSizeProperty(selector, min, mid, max) {
  min = min || 12;
  mid = mid || 7;
  max = max || 100;

  return Array.prototype.slice.call(
    document.querySelectorAll(selector)
  ).reduce(
    (styles, tag, count) => {
      var attr = (selector + min + mid + max).replace(/\W/g, "")

      tag.setAttribute(`data-clamped-font-size-${attr}`, count)

      return styles += `
        ${selector}[data-clamped-font-size-${attr}="${count}"] {
          font-size: ${
            Math.min(
              Math.max(
                min,
                (tag.offsetWidth / 100) * mid
              ),
              max
            )
          }px !important;
        }
      `
    },
    ''
  )
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        ).filter(
          ({name}) => name === '--clamped-font-size'
        ).length
      ) {

        const font = {
          selector: '',
          numbers: []
        }

        // Extract selector
        font.selector = rule.prelude
          .map(token => token.toSource())
          .join('')
          .trim()

        // Extract numbers
        font.numbers = parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        ).filter(
          ({name}) => name === '--clamped-font-size'
        ).map(
          ({value}) => value
        )

        // Output rule minus property to CSS
        output.css += `${
          font.selector
        } {${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(
            ({name}) => name !== '--clamped-font-size'
          ).map(token => token.toSource()).join('; ')
        }}`

        // Output JS-supported property to JS
        output.otherFiles['clampedFontSizeProperty'] = clampedFontSizeProperty.toString()

        output.js += `clampedFontSizeProperty(\`${font.selector}\`, ${
          font.numbers[0]
            .map(token => token.toSource())
            .join('')
            .trim()
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