[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# optimal select

A library which creates efficient and robust CSS selectors for HTML elements.

> The closest you can get if you're looking for a fingerprint of an HTML element


## Features

- shortest path and fastest selection in [comparison](https://github.com/fczbkk/css-selector-generator-benchmark)
- configurations allow to define custom options for skip, priority and ignore patterns
- allows single and multiple element as inputs
- provide UMD integration (usage via script, AMD or CommonJS)
- in addition to regular browsers it support the [htmlparser2](https://github.com/fb55/htmlparser2) DOM for virtual environments
- micro library (~ 11kb, no external dependency)


## How To Use

Aside of the [prebundled versions](/dist) the library is also available via npm:

`npm install --save optimal-select`


### Integration

```js
import { select } from 'optimal-select' // global: 'OptimalSelect'

document.addEventListener('click', (e) => {
  var selector = select(e.target)
  console.log(selector)  
})
```


### Configuration

By default following attributes are ignored for robustness towards changes:
- style (inline styles often temporary and used for dynamic visualizations)
- data-reactid (reacts element identifier which depends on the current DOM structure)
- data-react-checksum (react string rendered markup which depends on the current DOM structure)

To define custom filters you can pass the 'ignore' property as a secondary optional parameter.
You can then specify a validation function for the different types (`id`, `class`, `attribute`, `tag`).

```js
var selector = select(element, {

  // default reference
  root: document,

  skip (traverseNode) {
    // ignore select information of the direct parent
    return traverseNode === element.parentNode
  },

  // define order of attribute processing
  priority: ['id', 'class', 'href', 'src'],

  // define patterns which should't be included
  ignore: {
    class (className) {
      // disregard short classnames
      return className.length < 3
    },

    attribute (name, value, defaultPredicate) {
      // exclude HTML5 data attributes
      return (/data-*/).test(name) || defaultPredicate(name, value)
    },

    // define simplified ignore patterns as a boolean/string/number/regex
    tag: 'div'
  }
})
```

As shown the `root` property allows to define the container element (default: `document`).
The `skip` value allows to define a `function`, a single `node` or an `array` of nodes which should be ignored as the selector is created (default: `null`). With the `priority` value can the order of processed attributes be customized. Finally individual filter functions can be defined through `ignore`.


### API

```js
  getQuerySelector (input, [options]) // alias: 'select'
```
Convenience function which automatically uses either `getSingleSelector` or `getMultiSelector`

```js
  getSingleSelector(element, [options])
```
Retrieve a unique CSS selector of the element
Element is a DOM ode

```js
  getMultiSelector(elements, [options])
```
Retrieve a unique CSS selector of the elements
Elements is an array with a list of DOM nodes

```js
  optimize(selector, elements, [options])
```
Improve the CSS selector

```js
  getCommonAncestor(elements, [options])
```
Retrieve the closest ancestor of the elements

```js
  getCommonProperties(elements, [options])
```
Retrieve a set of common properties of the elements


### Client & Server

The latest version of `optimal-select` allows the generation and optimization of selectors on virtual environments. It uses the basic structure the [htmlparser2](https://github.com/fb55/htmlparser2) [DOM](https://github.com/fb55/domhandler) provides and adds some utilities to create the same results as the browser (note: the `withDOMLv1` option has to be enabled). Other libraries like [cheerio](https://github.com/cheeriojs/cheerio) are built on top of these and therefore compatible.

In contrast to the browser does server environments not have a global context which defines their scope. Therefore one can either be specified explicit through a node using the `context` options field or automatically extracted from the provided input element. Checkout [the example](/example/index.js) for more details.


## TODO

- extend documentation
- add automatic tests (e.g. [using jsdom](https://github.com/jbwyme/optimal-select/blob/master/tests/select.js))
- improve child-relation and grouping of `getMultiSelector`
- define `strict` option for optimizations of multiple elements
- check attributes for complex classnames
- fix [#8 - Full coverage for "nth-of-type" optimization](https://github.com/Autarc/optimal-select/issues/8)
- consider `:not` - selector to exclude other elements matching
(for multiple element matching consider the :not selector to exclude exceptions)


## Development

To build your own version run `npm run dev` for development (incl. watch) or `npm run build` for production (minified).
