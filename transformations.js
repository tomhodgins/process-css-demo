const resetAtRule = require('./transformations/reset-at-rule')
const elementQueryAtRule = require('./transformations/element-query-at-rule')
const documentAtRule = require('./transformations/document-at-rule')
const variationAtRule = require('./transformations/variation-at-rule')
const importantAtRule = require('./transformations/important-at-rule')
const rewriteSelectorAtRule = require('./transformations/rewrite-selector-at-rule')
const hasElementSelector = require('./transformations/has-element-selector')
const parentCombinator = require('./transformations/parent-combinator')
const elderSiblingCombinator = require('./transformations/elder-sibling-combinator')
const closestAncestorCombinator = require('./transformations/closest-ancestor-combinator')
const firstMatchSelector = require('./transformations/first-match-selector')
const lastMatchSelector = require('./transformations/last-match-selector')
const stringMatchingSelector = require('./transformations/string-matching-selector')
const regexMatchingSelector = require('./transformations/regex-matching-selector')
const xpathSelector = require('./transformations/xpath-selector')
const previousSiblingCombinator = require('./transformations/previous-sibling-combinator')
const overflowedContentSelector = require('./transformations/overflowed-content-selector')
const clampedFontSizeProperty = require('./transformations/clamped-font-size-property')
const base64EncodeFunction = require('./transformations/base64-encode-function')
const svgEncodeFunction = require('./transformations/svg-encode-function')
const elementPercentageUnits = require('./transformations/element-percentage-units')
const scrollPercentageUnits = require('./transformations/scroll-percentage-units')

module.exports = [
  // Custom at-rules

    // @--reset a;
    resetAtRule,

    // @--element a and (condition: breakpoint) { stylesheet }
    elementQueryAtRule,

    // @--document condition(string) { stylesheet }
    documentAtRule,

    // @--variation anything { stylesheet }
    variationAtRule,

    // @--important { stylesheet }
    importantAtRule,

    // @--rewrite-selector function(string) { stylesheet }
    rewriteSelectorAtRule,

  // Custom selectors

    // a /--parent/ {}
    parentCombinator,

    // a /--previous/ {}
    previousSiblingCombinator,

    // a /--elder/ b {}
    elderSiblingCombinator,

    // a /--closest/ b {}
    closestAncestorCombinator,

    // a:--first {}
    firstMatchSelector,

    // a:--last {}
    lastMatchSelector,

    // a:--has(b) {}
    hasElementSelector,

    // a:--string-match(string) {}
    stringMatchingSelector,

    // a:--regexp-match(string) {}
    regexMatchingSelector,

    // a:--xpath(string) {}
    xpathSelector,

    // a:--overflowed(list) {}
    overflowedContentSelector,

  // Custom properties

    // --clamped-font-size: minimum, scaling factor, max;
    clampedFontSizeProperty,

  // Custom functions

    // --base64-encode(string)
    base64EncodeFunction,

    // --svg-encode(string)
    svgEncodeFunction,

  // Custom units

    // 1--ew 2--eh 3--emin 4--emax
    elementPercentageUnits,

    // 1--sw 2--sh
    scrollPercentageUnits,
]