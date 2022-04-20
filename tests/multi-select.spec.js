import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { initDOM, createHTML, candidates } from './helpers'
import { compareResults } from '../src/optimize'
import { convertNodeList } from '../src/utilities'

chai.use(chaiSnapshot)

global.document = {}

const tests = [
  {
    name: 'tag',
    content: `
      <div id="first"></div>
      <div class="top"></div>
      <div title="heading"></div>
    `
  },
  {
    name: 'classes',
    content: `
      <span class="nav2 active"></span>
      <span class="nav1 active"></span>
      <span class="nav3 active"></span>
    `
  },
  {
    name: 'attributes',
    content: `
      <span class="nav2" data="one"></span>
      <div class="nav1" data="one"></div>
      <a class="nav3" data="one"></a>
    `
  },
]

describe('Multi-select', function() {
  candidates().forEach(candidate => {
    describe(`${candidate.name}`, function() {
      tests.forEach(function({ name, content }) {
        describe(name, function () {
          const doc = initDOM(createHTML(content))
          const elements = convertNodeList(doc.body.querySelectorAll('*'))

          it('generates selector string', function() {
            expect(candidate.generate(elements, { root: doc })).to.matchSnapshot(this)
          })
        
          it('selector string is valid, unique and points to correct elements', function() {
            const selector = candidate.generate(elements, { root: doc })
            const found = candidate.check(selector, doc)

            expect(compareResults(found, elements)).to.equal(true)
          })
        })
      })
    })
  })
})


