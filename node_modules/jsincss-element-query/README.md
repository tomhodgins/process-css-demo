# jsincss-element-query

An element query plugin for [jsincss](https://github.com/tomhodgins/jsincss)

## About

This plugin is a JavaScript module that works with [JS-in-CSS stylesheets](https://responsive.style/theory/what-is-a-jic-stylesheet.html), to add element query (container query) functionality to CSS.

## Downloading

You can download jsincss-element-query and add it to your codebase manually, or download it with npm:

```bash
npm install jsincss-element-query
```

Another option that works for building or testing, that isn't ideal for production use, is linking to the module directly from a CDN like unpkg:

```html
<script type=module>
  import element from 'https://unpkg.com/jsincss-element-query/index.vanilla.js'
</script>
```

## Importing

This plugin exists in three different formats:

- CommonJS module: [index.js](index.js)
- Vanilla JS module: [index.vanilla.js](index.vanilla.js)
- Browser function: [index.browser.js](index.browser.js)

You can import this plugin using the native [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) statement in JavaScript. Here you can assign any name you want to the function you are importing, and you only need to provide a path to the plugin's `index.vanilla.js` file:

```js
import element from './index.vanilla.js'
```

You can also use the CommonJS-formatted module located at [index.js](index.js) with `require()` for use with bundlers that don't use vanilla JS modules.

Once you have imported this plugin into your module, you can use the plugin as `element()`

## Using JS-in-CSS Stylesheets

The main goal of this plugin is to allow CSS authors the ability to toggle stylesheets based on querying properties (like width, height, aspect-ratio, orientation, number of characters of text content, number of child elements, and scroll position) of elements as they are rendered in the browser.

The plugin has the following format:

```js
element(selector, conditions, stylesheet)
```

- `selector` is a string containing a CSS selector
- `condition` is an object containing as many different feature queries as you want, all must pass for the stylesheet to apply
- `stylesheet` is a string or template string containing a CSS stylesheet, where `:self` is a selector that can be used to target the element(s) that pass the test

## Features

- `minWidth`: number <= offsetWidth,
- `maxWidth`: number >= offsetWidth,
- `minHeight`: number <= offsetHeight,
- `maxHeight`: number >= offsetHeight,
- `minChildren`: number <= children.length,
- `maxChildren`: number >= children.length,
- `minCharacters`: number <= ((value && value.length) || textContent.length),
- `maxCharacters`: number >= ((value && value.length) || textContent.length),
- `minScrollX`: number <= scrollLeft,
- `maxScrollX`: number >= scrollLeft,
- `minScrollY`: number <= scrollTop,
- `maxScrollY`: number >= scrollTop,
- `minAspectRatio`: number <= offsetWidth / offsetHeight,
- `maxAspectRatio`: number >= offsetWidth / offsetHeight,
- `orientation`: 'portrait', 'square' ,'landscape'

## Examples

This example will use the `jsincss` plugin to load a JS-in-CSS stylesheet making use of this plugin. To test it in a JavaScript module, import both the `jsincss` package and any helper plugins you want:

```html
<script type=module>
  import jsincss from 'https://unpkg.com/jsincss/index.vanilla.js'
  import element from 'https://unpkg.com/jsincss-element-query/index.vanilla.js'

  jsincss(() => `

    ${element('div', {minWidth: 500}, `
      :self {
        background: lime;
      }
    `)}

  `)
</script>
```

It's also possible to write your stylesheets as a separate JavaScript module like this, where you import any helper plugins at the top of the stylesheet:

```js
import element from 'https://unpkg.com/jsincss-element-query/index.vanilla.js'

export default () => `

  ${element('div', {minWidth: 500}, `
    :self {
      background: lime;
    }
  `)}

`
```

And then import both the `jsincss` plugin and the stylesheet into your code and run them like this, suppling any `selector` or `events` list the `jsincss` plugin might need to apply the stylesheet only the the element(s) and event(s) you require, depending on what you're doing:

```js
import jsincss from 'https://unpkg.com/jsincss/index.vanilla.js'
import stylesheet from './path/to/stylesheet.js'

jsincss(stylesheet)
```

For a more advanced example, check out the [test](https://tomhodgins.github.io/jsincss-element-query/test/index) file which includes [element-query.js](test/element-query.js) and [element-query-scroll.js](test/element-query-scroll.js) and includes them in a module like this:

```javascript
import jsincss from '//unpkg.com/jsincss/index.vanilla.js'
import stylesheet from './element-query-test.js'
import scrollStyles from './element-query-scroll-test.js'

jsincss(stylesheet)
jsincss(scrollStyles, ['[class*="-scroll-"]'], ['scroll'])
```

## Compatible JS-in-CSS Stylesheet Loaders

- [jsincss](https://github.com/tomhodgins/jsincss)