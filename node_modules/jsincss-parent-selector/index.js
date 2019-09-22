module.exports = (selector, rule) => {
  const attr = selector.replace(/\W/g, '')
  const result = Array.from(document.querySelectorAll(selector))
    .filter(tag => tag.parentElement)
    .reduce((output, tag, count) => {
      output.add.push({tag: tag.parentElement, count: count})
      output.styles.push(`[data-parent-${attr}="${count}"] { ${rule} }`)
      return output
    }, {add: [], remove: [], styles: []})
  result.add.forEach(tag => tag.tag.setAttribute(`data-parent-${attr}`, tag.count))
  result.remove.forEach(tag => tag.setAttribute(`data-parent-${attr}`, ''))
  return result.styles.join('\n')
}
