(
  (root, factory) => {
    typeof module === 'object' && module.exports
      ? module.exports = factory()
      : root.apophany = factory()
  }
)(
  typeof self !== 'undefined'
    ? self
    : this,
  () => function(
    list = [],
    patterns = [item => false],
    filter = () => true
  ) {
    const trimmed = list.filter(filter)
    const firstIndex = trimmed.findIndex(item => 
      patterns.every((pattern, index) =>
        pattern(
          trimmed[trimmed.indexOf(item) + index]
        )
      )
    )
    const start = list.indexOf(trimmed[firstIndex])
    const end = list.indexOf(trimmed[firstIndex + patterns.length - 1])
  
    return {
      start,
      end,
      match: trimmed.slice(firstIndex, firstIndex + patterns.length),
      original: list.slice(start, end + 1)
    }
  }
)