const anesthetic = require('anesthetic/index.cjs.js')

module.exports = (string = '') => ({
  css: anesthetic(string)
})