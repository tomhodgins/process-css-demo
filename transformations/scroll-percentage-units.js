const parseCSS = require('../lib/parse-css.js')

// --sw, --sh
function scrollPercentageUnits(selector, rule) {
  const attr = selector.replace(/\W/g, '')
  const features = {
    'sw': (tag, number) => tag.scrollWidth / 100 * number + 'px',
    'sh': (tag, number) => tag.scrollHeight / 100 * number + 'px'
  }
  const result = Array.from(document.querySelectorAll(selector))
    .reduce((output, tag, count) => {
      rule = rule.replace(
        /(\d*\.?\d+)(?:\s*)--(sw|sh)/gi,
        (match, number, unit) => features[unit](tag, number)
      )
      output.add.push({tag, count})
      output.styles.push(`${selector}[data-scroll-unit-${attr}="${count}"] { ${rule} }`)
      return output
    }, {add: [], remove: [], styles: []})
  result.add.forEach(tag => tag.tag.setAttribute(`data-scroll-unit-${attr}`, tag.count))
  result.remove.forEach(tag => tag.setAttribute(`data-scroll-unit-${attr}`, ''))
  return result.styles.join('\n')
}

module.exports = function(string = '', environment = {}) {
  return parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        ).filter(({value}) => value.some(({tokenType, unit}) =>
          tokenType === 'DIMENSION'
          && ['w', 'h'].some(term => `--s${term}` === unit)
        )).length
      ) {
        const unit = {
          selector: '',
          props: []
        }

        // Extract selector
        unit.selector = rule.prelude
          .map(token => token.toSource())
          .join('')
          .trim()

        // Output rule minus property to CSS
        output.css += `${
          unit.selector
        } {${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(
            ({value}) => value.find(({tokenType, unit}) =>
              tokenType === 'DIMENSION'
              && ['w', 'h'].some(term => `--s${term}` === unit)
              === false
            )
          ).map(token => token.toSource()).join('; ')
        }}`

        // Add dependencies to output
        output.otherFiles['scrollPercentageUnits'] = scrollPercentageUnits.toString()

        // Add rules to output JS
        output.js += `scrollPercentageUnits(\`${unit.selector}\`, \`${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(
            ({value}) => value.find(({tokenType, unit}) =>
              tokenType === 'DIMENSION'
              && ['w', 'h'].some(term => `--s${term}` === unit)
            )
          ).map(declaration => declaration.toSource())
          .join(';')
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