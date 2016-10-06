[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

# optimal select

A library which creates efficient and robust CSS selectors for HTML elements.


### Features

- provide UMD integration (usage with Browser + Node)
- supports the browser environment and the [htmlparser2](https://github.com/fb55/htmlparser2) DOM
- allow single and multiple element inputs
- configurations allow to define custom ignore patterns
- micro library (~ 11kb + no external dependency)
- shortest path and fastest selection in [comparison](https://github.com/fczbkk/css-selector-generator-benchmark)


### How To Use

Aside of the [prebundled versions](/dist) the library is also available via npm:

`npm install --save optimal-select`


```js
import { select } from 'optimal-select' // global: 'OptimalSelect'

document.addEventListener('click', (e) => {
  var selector = select(e.target)
  console.log(selector)  
})
```

By default following attributes are ignored for robustness towards changes:
- style (inline styles often temporary and used for dynamic visualizations)
- data-reactid (reacts element identifier which depends on the current DOM structure)
- data-react-checksum (react string rendered markup which depends on the current DOM structure)

To define custom filters you can pass the 'ignore' property as a secondary optional parameter.
You can then specify a validation function for the different types (`id`, `class`, `attribute`, `tag`).

```js
var selector = select(element, {
  root: document, // default reference
  skip: (traverseNode) {
    // ignore select information of the direct parent
    return traverseNode === element.parentNode
  },
  ignore: {
class:function (className) {
      // disregard short classnames
      return className.length < 3
    },
    attribute:function (name, value, defaultPredicate) {
      // exclude HTML5 data attributes
      return (/data-*/).test(name) || defaultPredicate(name, value)
    },
    // define simplified ignore patterns as a string/number/regex
    tag: 'div'
  }
})
```

Furthermore the `root` option allows to define the container element (default: `document`).
The `skip` option allows to define a `function`, a single `node` or an `array` of nodes which should  be ignored as the selector is created (default: `null`).

### Client & Server

The latest version `optimal-select` allows the generation and optimization of selectors on virtual environments. It uses the basic structure the [htmlparser2](https://github.com/fb55/htmlparser2) [DOM](https://github.com/fb55/domhandler) provides and adds some utilities to create the same results as the browser (note: the `withDOMLv1` option has to be enabled). Other libraries like [cheerio](https://github.com/cheeriojs/cheerio) are built on top of these and therefore compatible.

In contrast to the browser does server environments not have a global context which defines their scope. Therefore one can either be specified explicit as a node using the `context` options field or automatically extracted from the provided input element. Checkout [the example](/example/index.js) for more details.


### TODO

- extend documentation
- add tests
- check attributes in multi-select
- check attributes for complex classname
- fix ["#3 - Match line breaking attribute values"](https://github.com/Autarc/optimal-select/issues/3)


### Development

To build your own version run `npm run dev` for development (incl. watch) or `npm run build` for production (minified).
