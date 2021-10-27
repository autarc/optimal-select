import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { JSDOM } from 'jsdom'
import fs from 'fs'

import { select, match } from '../src'

chai.use(chaiSnapshot)

// load HTML fixture
const indexHTML = fs.readFileSync('example/index.html').toString()

const dom = new JSDOM(indexHTML)
global.window = dom.window
global.document = dom.window.document

// attach Sizzle to emulated DOM
const Sizzle = require('sizzle')

const elements = document.querySelector('#wrap').querySelectorAll('*')
const examples = Array.prototype.map.call(elements, element => ({ element, match: match(element).replace(/\\/g, '') }))

describe('Baseline reference', function() {

  // test candidates
  const candidates = [
    {
      name: 'CSS',
      generate: select,
      check: selector => document.querySelectorAll(selector)
    },
    {
      name: 'XPath',
      generate: element => select(element, { format: 'xpath' }),
      check: function(xpath) {
        var iterator = document.evaluate(xpath, document, null, 0)
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
      generate: element => select(element, { format: 'jquery' }),
      check: selector => {
        try {
          return Sizzle(selector, document)
        }
        catch(e) {
          console.log('ERROR', selector)
          throw e
        }
      }
    },
  ]

  candidates.forEach(candidate => {
    describe(`${candidate.name}`, function() {
      this.timeout(50000)

      describe('generates selector string', function() {
        examples.forEach(example => {
          it(example.match, function() {
            expect(candidate.generate(example.element)).to.matchSnapshot(this)
          })
        })
      })

      describe('selector string is valid, unique and points to correct element', function() {
        examples.forEach(example => {
          it(example.match, function() {
            const selector = candidate.generate(example.element)
            const found = candidate.check(selector)

            expect(found).to.have.length(1)
            expect(found[0]).to.equal(example.element)
          })
        })
      })
    })
  })
})
