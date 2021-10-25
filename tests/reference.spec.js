import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { JSDOM } from 'jsdom'
import fs from 'fs'

import { select } from '../src'

chai.use(chaiSnapshot)


describe('Baseline reference using original benchmark DOM', function() {
  var elements
  var Sizzle

  before(function() {
    // load HTML fixture
    const indexHTML = fs.readFileSync('example/index.html').toString()

    const dom = new JSDOM(indexHTML)
    global.window = dom.window
    global.document = dom.window.document

    // attach Sizzle to emulated DOM
    Sizzle = require('sizzle')

    elements = document.querySelector('#wrap').querySelectorAll('*')
  })

  // test candidates
  const candidates = [
    {
      name: 'optimal-select (css)',
      generate: select,
      check: selector => document.querySelectorAll(selector)
    },
    {
      name: 'optimal-select (xpath)',
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
      name: 'optimal-select (jquery)',
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

    describe(candidate.name, function() {
      this.timeout(50000)

      it('generates selector string', function() {
        elements.forEach(element => {
          expect(candidate.generate(element)).to.matchSnapshot(this)
        })
      })

      it('selector string is valid, unique and points to correct element', function() {
        elements.forEach(element => {
          const selector = candidate.generate(element)
          // console.log('SELECTOR', selector)
          const found = candidate.check(selector)

          expect(found).to.have.length(1)
          expect(found[0]).to.equal(element)
        })
      })
    })
  })
})
