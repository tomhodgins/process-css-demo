const parseCSS = require('../lib/parse-css/index.cjs.js')

function immutableAnnotation(selector = '', property = '', value = '') {
  const rules = []
  const childWatcher = new MutationObserver(processChildren)
  const attributeWatcher = new MutationObserver(processAttributes)

  if (document.documentElement.dataset.childWatcher !== 'watching') {
    processChildren([{
      addedNodes: Array.from(document.querySelectorAll('*'))
    }])
    childWatcher.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
    document.documentElement.dataset.childWatcher = 'watching'
  }

  function processChildren(entries) {
    return entries.forEach(({addedNodes}) => {
      if (rules.length) {
        const matching = Array.from(addedNodes).filter(tag => {
          if (tag instanceof Element) {
            return tag.matches(
              rules
                .map(({selector}) => selector)
                .join(', ')
            )
          }
        })

        if (matching.length) {
          matching.forEach(tag => {
            const applicable = rules.filter(({selector}) => tag.matches(selector))

            applicable.forEach(rule => {
              if (tag.style.getPropertyValue(`--immutable-${rule.property}`) === '') {
                tag.style.setProperty(`--immutable-${rule.property}`, rule.value)
              }
            })

            if (tag.dataset.attributeWatcher !== 'watching') {
              processAttributes([{target: tag}])
              attributeWatcher.observe(tag, {attributes: true})
              tag.dataset.attributeWatcher = 'watching'
            }
          })
        }

      }
    })
  }

  function processAttributes(entries) {
    entries.forEach(entry => {
      if (entry.target.style) {
        const immutables =  Array.from(entry.target.style).filter(property =>
          property.startsWith('--immutable-')
        )

        immutables.forEach(immutable => {
          const property = immutable.slice('--immutable-'.length)
          if (entry.target.style.getPropertyValue(property) !== entry.target.style.getPropertyValue(immutable)) {
            entry.target.style.setProperty(
              property,
              entry.target.style.getPropertyValue(immutable),
              'important'
            )
          }
        })
      }
    })
  }

  rules.push({
    selector, property, value
  })

  processChildren([
    {addedNodes: Array.from(document.querySelectorAll(selector))
  }])
}

module.exports = function(string = '', environment = {}) {
  const annotations = []

  function hasImmutableAnnotation(tokenList = []) {
    return tokenList.find((token, index, tokens) => token.tokenType === 'DELIM'
      && token.value === '!'
      && tokens[index + 1]
      && tokens[index + 1].tokenType === 'IDENT'
      && tokens[index + 1].value === '--immutable'
    )
  }

  const result = parseCSS.parseAStylesheet(string).value.reduce(
    (output, rule) => {
      if (
        rule.type === 'QUALIFIED-RULE'
        && hasImmutableAnnotation(rule.value.value)
      ) {
        const selector = rule.prelude
          .map(token => token.toSource())
          .join('')
          .trim()

        parseCSS.parseAListOfDeclarations(
          rule.value.value.map(token => token.toSource()).join('')
        ).filter(({name, value}) =>
          hasImmutableAnnotation(value)
        ).forEach(property =>
          annotations.push(
            `immutableAnnotation(\`${selector}\`, \`${property.name}\`, \`${property.value.map(token => token.toSource()).join('').replace(/\s*!--immutable\s*$/, '')}\`)`
          )
        )

        // Output rule minus property to CSS
        output.css += `${
          selector
        } {${
          parseCSS.parseAListOfDeclarations(
            rule.value.value.map(token => token.toSource()).join('')
          ).filter(({name, value}) =>
            hasImmutableAnnotation(value) === undefined
          ).map(token => token.toSource()).join('; ')
        }}`
      } else {
        output.css += rule.toSource()
      }

      return output
    },
    {
      css: '',
      js: '',
      otherFiles: {},
      annotations: {}
    }
  )

  // Output JS-supported property to JS
  if (annotations.length) {
    result.otherFiles['immutableAnnotation'] = `(() => {
      ${immutableAnnotation.toString()};
      ${annotations.join(';')};
    })()`
  }

  return result
}