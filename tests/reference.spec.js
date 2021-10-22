import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { JSDOM } from 'jsdom'
import fs from 'fs'

import { select } from '../src'

chai.use(chaiSnapshot)

// initialize DOM emulation
const indexHTML = fs.readFileSync('example/index.html').toString()
const dom = new JSDOM(indexHTML)

global.window = dom.window
global.document = dom.window.document

// attach jquery to emulated DOM
const $ = (global.jQuery = require('jquery'))

// test candidates
const candidates = [
  {
    name: 'optimal-select (css)',
    generate: select,
    check: selector => $(selector)
  },
  {
    name: 'optimal-select (xpath)',
    generate: element => select(element, { format: 1 }),
    check: function(xpath) {
      var iterator = global.document.evaluate(xpath, document, null, 0)
      var elements = []
      var element
      while ((element = iterator.iterateNext())) {
        elements.push(element)
      }
      return elements
    }
  }
]

describe('Baseline reference using original benchmark DOM', function() {
  candidates.forEach(candidate => {
    var elements

    before(function() {
      elements = document.querySelector('#wrap').querySelectorAll('*')
    })

    describe(candidate.name, function() {
      it('generates selector string', function() {
        elements.forEach(element => {
          expect(candidate.generate(element)).to.matchSnapshot(this)
        })
      })

      it('selector string is valid, unique and points to correct element', function() {
        this.timeout(50000)

        elements.forEach(element => {
          const selector = candidate.generate(element)
          const found = candidate.check(selector)

          expect(found).to.have.length(1)
          expect(found[0]).to.equal(element)
        })
      })
    })
  })
})
