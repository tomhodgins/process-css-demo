module.exports = (selector, rule) => {
  const attr = selector.replace(/\W/g, '')
  const features = {
    ew: (tag, number) => tag.offsetWidth / 100 * number + 'px',
    eh: (tag, number) => tag.offsetHeight / 100 * number + 'px',
    emin: (tag, number) => Math.min(
      tag.offsetWidth,
      tag.offsetHeight
    ) / 100 * number + 'px',
    emax: (tag, number) => Math.max(
      tag.offsetWidth,
      tag.offsetHeight
    ) / 100 * number + 'px'
  }
  const result = Array.from(document.querySelectorAll(selector))
    .reduce((output, tag, count) => {
      rule = rule.replace(
        /(\d*\.?\d+)(?:\s*)(ew|eh|emin|emax)/gi,
        (match, number, unit) => features[unit](tag, number)
      )
      output.add.push({tag: tag, count: count})
      output.styles.push(`[data-eunit-${attr}="${count}"] { ${rule} }`)
      return output
    }, {add: [], remove: [], styles: []})
  result.add.forEach(tag => tag.tag.setAttribute(`data-eunit-${attr}`, tag.count))
  result.remove.forEach(tag => tag.setAttribute(`data-eunit-${attr}`, ''))
  return result.styles.join('\n')
}
