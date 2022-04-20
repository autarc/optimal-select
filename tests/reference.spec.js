import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'
import fs from 'fs'

import { initDOM, candidates, elementMatches } from './helpers'

chai.use(chaiSnapshot)

global.document = {}

// load HTML fixture
const html = fs.readFileSync('example/index.html').toString()
const doc = initDOM(html)

const elements = doc.querySelector('#wrap').querySelectorAll('*')
const examples = elementMatches(elements, doc)

describe('Baseline reference', function() {
  candidates(doc).forEach(candidate => {
    describe(`${candidate.name}`, function() {
      this.timeout(50000)

      describe('generates selector string', function() {
        examples.forEach(example => {
          it(example.match, function() {
            expect(candidate.generate(example.element,  { ignore: { contains: false }, root: doc })).to.matchSnapshot(this)
          })
        })
      })

      describe('selector string is valid, unique and points to correct element', function() {
        examples.forEach(example => {
          it(example.match, function() {
            const selector = candidate.generate(example.element,  { ignore: { contains: false }, root: doc })
            const found = candidate.check(selector, doc)

            expect(found).to.have.length(1)
            expect(found[0]).to.equal(example.element)
          })
        })
      })
    })
  })
})
