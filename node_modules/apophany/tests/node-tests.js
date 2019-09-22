const apophany = require('../index.cjs.js')

console.log(
  apophany(
    ['a', 'b', 'c', 1, 2, 3, 'd', 'e', 'f', 4, 5, 6],
    [
      item => typeof item === 'string',
      item => typeof item === 'number',
      item => typeof item === 'number'
    ],
    token => token !== 'e'
  )
)

// expected: {start: 2, end: 4, match: ['c', 1, 2], original: ['c', 1, 2]}

console.log(
  apophany(
    ['a', 1, 2, 3, 4, 'b', 2, 'c'],
    [
      item => typeof item === 'string',
      item => typeof item === 'string',
    ],
    item => typeof item !== 'number'
  )
)

// expected: {start: 0, end: 5, match: ['a', 'b'], original: ['a', 1, 2, 3, 4, 'b']}

console.log(
  apophany(
    [5, 10, 15, 30, 35, 40, 20],
    [
      num => num > 10,
      num => num > 10,
    ],
    num => num < 30
  )
)

// expected: {start: 2, end: 6, match: [15, 20], original: [15, 30, 35, 40, 20]}