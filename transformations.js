module.exports = [

  // Nesting
  require('./transformations/base64-encode-function'),

  // Custom functions

    // --base64-encode(string)
    require('./transformations/base64-encode-function'),

    // --svg-encode(string)
    require('./transformations/svg-encode-function'),

    // --mimic(selector)
    require('./transformations/mimic-function'),

  // Custom at-rules

    // @--variation anything { stylesheet }
    require('./transformations/variation-at-rule'),

    // @--reset a;
    require('./transformations/reset-at-rule'),

    // @--important { stylesheet }
    require('./transformations/important-at-rule'),

    // @--element a and (condition: breakpoint) { stylesheet }
    require('./transformations/element-query-at-rule'),

    // @--document condition(string) { stylesheet }
    require('./transformations/document-at-rule'),

    // @--min-width <dimension> { stylesheet }
    require('./transformations/min-width-at-rule'),

    // @--max-width <dimension> { stylesheet }
    require('./transformations/max-width-at-rule'),

    // @--rewrite-selector function(string) { stylesheet }
    require('./transformations/rewrite-selector-at-rule'),

  // Custom selectors

    // a /--parent/ {}
    require('./transformations/parent-combinator'),

    // a /--previous/ {}
    require('./transformations/previous-sibling-combinator'),

    // a /--elder/ b {}
    require('./transformations/elder-sibling-combinator'),

    // a /--closest/ b {}
    require('./transformations/closest-ancestor-combinator'),

    // a:--first {}
    require('./transformations/first-match-selector'),

    // a:--last {}
    require('./transformations/last-match-selector'),

    // a:--has(b) {}
    require('./transformations/has-element-selector'),

    // a:--string-match(string) {}
    require('./transformations/string-matching-selector'),

    // a:--regexp-match(string) {}
    require('./transformations/regex-matching-selector'),

    // a:--xpath(string) {}
    require('./transformations/xpath-selector'),

    // a:--overflowed(list) {}
    require('./transformations/overflowed-content-selector'),

  // Custom properties

    // --clamped-font-size: minimum, scaling factor, max;
    require('./transformations/clamped-font-size-property'),

  // Custom units

    // 1--ew 2--eh 3--emin 4--emax
    require('./transformations/element-percentage-units'),

    // 1--sw 2--sh
    require('./transformations/scroll-percentage-units'),
]