function element(selector, conditions, stylesheet) {
  const attr = (selector + Object.keys(conditions) + Object.values(conditions)).replace(/\W/g, '')
  const features = {
    minWidth: (el, number) => number <= el.offsetWidth,
    maxWidth: (el, number) => number >= el.offsetWidth,
    minHeight: (el, number) => number <= el.offsetHeight,
    maxHeight: (el, number) => number >= el.offsetHeight,
    minChildren: (el, number) => number <= el.children.length,
    children: (el, number) => number === el.children.length,
    maxChildren: (el, number) => number >= el.children.length,
    minCharacters: (el, number) => number <= (el.value ? el.value.length : el.textContent.length),
    characters: (el, number) => number === (el.value ? el.value.length : el.textContent.length),
    maxCharacters: (el, number) => number >= (el.value ? el.value.length : el.textContent.length),
    minScrollX: (el, number) => number <= el.scrollLeft,
    maxScrollX: (el, number) => number >= el.scrollLeft,
    minScrollY: (el, number) => number <= el.scrollTop,
    maxScrollY: (el, number) => number >= el.scrollTop,
    minAspectRatio: (el, number) => number <= el.offsetWidth / el.offsetHeight,
    maxAspectRatio: (el, number) => number >= el.offsetWidth / el.offsetHeight,
    orientation: (el, string) => ({
      portrait: el => el.offsetWidth < el.offsetHeight,
      square: el => el.offsetWidth === el.offsetHeight,
      landscape: el => el.offsetHeight < el.offsetWidth
    })[string](el)
  }
  const result = Array.from(document.querySelectorAll(selector))
    .reduce((output, tag, count) => {
      if (
        Object.entries(conditions).every(test =>
          features[test[0]](tag, test[1])
        )
      ) {
        output.add.push({tag: tag, count: count})
        output.styles.push(
          stylesheet.replace(
            /:self|\$this|\[--self\]/g,
            `[data-element-${attr}="${count}"]`
          )
        )
      } else {
        output.remove.push(tag)
      }
      return output
    }, {add: [], remove: [], styles: []})
  result.add.forEach(tag => tag.tag.setAttribute(`data-element-${attr}`, tag.count))
  result.remove.forEach(tag => tag.setAttribute(`data-element-${attr}`, ''))
  return result.styles.join('\n')
}
