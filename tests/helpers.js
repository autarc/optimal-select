import { JSDOM } from 'jsdom'
import wgxpath from 'wicked-good-xpath'

import { select } from '../src'
import match from '../src/match'
import { pathToSelector } from '../src/pattern'

export const initDOM = (html) => {
  const window = new JSDOM(html).window
  wgxpath.install(window, true)

  return window.document
}

export const createHTML = (content) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Single Select Test</title>
  </head>
  <body>
    ${content}
  </body>
</html>`


// import sizzle with minimal window/document stub
export const importSizzle = () => {
  const window = global.window
  const document = global.document

  global.window = {
    document: {
      documentElement: {},
      nodeType: 9,
      createElement: function() { return {} }
    }
  }
  global.document = global.window.document
  const Sizzle = require('sizzle')

  global.window = window
  global.document = document

  return Sizzle
}

// test candidates
export const candidates = (defaultOptions = {}) => {
  const Sizzle = importSizzle()

  return [
    {
      name: 'CSS',
      generate: (element, options = {}) => select(element, { ...defaultOptions, ...options }),
      check: (selector, doc) => (doc || defaultOptions.root || document).querySelectorAll(selector)
    },
    {
      name: 'XPath',
      generate: (element, options = {}) => select(element, {...defaultOptions, ...options, format: 'xpath' }),
      check: function(xpath, doc) {
        var currentDocument = (doc || defaultOptions.root || document)
        var iterator = currentDocument.evaluate(xpath, currentDocument, null, 0)
        var elements = []
        var element
        while ((element = iterator.iterateNext())) {
          elements.push(element)
        }
        return elements
      }
    },
    {
      name: 'jQuery',
      generate: (element, options = {}) => select(element, { ...defaultOptions, ...options, format: 'jquery' }),
      check: (selector, doc) => {
        try {
          return Sizzle(selector, doc || defaultOptions.root || document)
        }
        catch(e) {
          console.log('ERROR', selector)
          throw e
        }
      }
    },
  ]
}

/**
 * Generate element selector names from elements
 * 
 * @param {Array.<Element>} elements
 * @returns {Array.<{ element: Element, match: string }>}
 */
export const elementMatches = (elements, document) =>
  Array.prototype.map.call(elements, element => ({ element, match: pathToSelector(match(element, { root: document })).replace(/\\/g, '') }))
