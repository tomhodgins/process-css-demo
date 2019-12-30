const parseCSS = require('../lib/parse-css/index.cjs.js')
const anesthetic = require('anesthetic/index.cjs.js')

module.exports = (string = '') => ({
  css: anesthetic(string)
})