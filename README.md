# process-css-demo

[![Run on Repl.it](https://repl.it/badge/github/tomhodgins/process-css-demo)](https://repl.it/github/tomhodgins/process-css-demo)

A demo of [process-css](https://github.com/tomhodgins/process-css) set up as a Node-based CSS preprocessor for supporting custom at-rules, custom selectors, custom properties, custom functions, and custom units.

## What is it?

This project is a Node script that can be run to process CSS stylesheet files, or strings of CSS into either CSS output, or JavaScript output containing your styles plus any runtimes and plugins necessary to support the features you have used.

If you were interested in processing vanilla CSS, or wanted to see a demo of some ways CSS can be transformed, this project serves to be a basic example of how you can use [process-css-demo](https://github.com/tomhodgins/process-css) to process CSS either as a command-line utility, or how you can build CSS preprocessing into a larger codebase.

## What does it do?

Process-css-demo consumes either a file of CSS or a string of CSS and processes it through a series of transformation. Each time a transformation is applied, the current contents of the CSS can be parsed and reasoned about, and any CSS, JavaScript, or plugins that need to be output can be returned and the resulting CSS can then be passed into the next transformation.

By the time the CSS has passed through all transformations, the resulting output can either be:

- a CSS stylesheet, this is only desirable if there are no JS-supported features used
- a JavaScript file containing the processed CSS, and any runtimes or plugins required to support the features used in the CSS

## Limitations

This preprocessor is a very basic demo, each transformation consumes a stylesheet and figures out what to do one rule at a time. This means features cannot be nested, and things like selectors and combinators are often limited to only supporting one feature per top-level-rule.

```css
/* Using more than one feature per rule not supported by this preprocessor */
@--variation 1 {
  @--element section and (min-width: 500) {
    :--self input /--closest/ article h1 {
      --clamped-cont-size: 10--sh, 10, 50px;
    }
  }
}
```

> Note: due to the natural processing order of the transformations, some features will process before others and happen to work, but if you want a better preprocessor a better approach would be parsing a stylesheet, and then for any rules containing declarations process that rule with declaration transformations, and for rules containing other rules to process that with selector transformations.

## How does it work?

This script runs via [Node](https://nodejs.org/en/), it demonstrates parsing [CSS](http://drafts.csswg.org/) and uses [tomhodgins/parse-css](https://github.com/tomhodgins/parse-css) to parse the input as CSS. Then, [process-css](https://github.com/tomhodgins/process-css) applies various transformations to the Abstract Syntax Tree produced from parsing CSS. Any custom features requiring JavaScript to support run in the browser via [jsincss](https://github.com/tomhodgins/jsincss), and many of the transformations use its [various existing plugins](https://www.npmjs.com/search?q=jsincss-). Some of the transformations use [apophany](https://github.com/tomhodgins/apophany) for pattern matching different series of CSS tokens.

## Documentation

Check out the [wiki](https://github.com/tomhodgins/process-css-demo/wiki) for more information about:

- [Installing process-css-demo](https://github.com/tomhodgins/process-css-demo/wiki/Installing-process-css-demo)
- [Using process-css-demo](https://github.com/tomhodgins/process-css-demo/wiki/Using-process-css-demo)
- [Command-line Options](https://github.com/tomhodgins/process-css-demo/wiki/Command-line-Options)
- [Custom CSS Extensions](https://github.com/tomhodgins/process-css-demo/wiki/Custom-CSS-Extensions)