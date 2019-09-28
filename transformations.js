const resetAtRule = require('./transformations/reset-at-rule')
const elementQueryAtRule = require('./transformations/element-query-at-rule')
const documentAtRule = require('./transformations/document-at-rule')
const variationAtRule = require('./transformations/variation-at-rule')
const importantAtRule = require('./transformations/important-at-rule')
const parentSelector = require('./transformations/parent-selector')
const overflowedContentSelector = require('./transformations/overflowed-content-selector')
const clampedFontSizeProperty = require('./transformations/clamped-font-size-property')
const base64EncodeFunction = require('./transformations/base64-encode-function')
const svgEncodeFunction = require('./transformations/svg-encode-function')
const elementPercentageUnits = require('./transformations/element-percentage-units')
const scrollPercentageUnits = require('./transformations/scroll-percentage-units')

module.exports = [
  // Custom at-rules

    // @--reset selector;
    resetAtRule,

    // @--element selector and (condition: breakpoint) { stylesheet }
    elementQueryAtRule,

    // @--document condition(string) { stylesheet }
    documentAtRule,

    // @--variation value { stylesheet }
    variationAtRule,

    // @--important { stylesheet }
    importantAtRule,

  // Custom selectors

    // :--parent
    parentSelector,

    // :--overflowed()
    overflowedContentSelector,

  // Custom properties

    // --clamped-font-size: min, mid, max;
    clampedFontSizeProperty,

  // Custom functions

    // --base64-encode(image.png)
    base64EncodeFunction,

    // --svg-encode(image.svg)
    svgEncodeFunction,

  // Custom units

    // 1--ew 2--eh 3--emin 4--emax
    elementPercentageUnits,

    // 1--sw 2--sh
    scrollPercentageUnits,
]