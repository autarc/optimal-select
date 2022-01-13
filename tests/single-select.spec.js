import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { initDOM, createHTML, candidates, elementMatches } from './helpers'

chai.use(chaiSnapshot)

global.document = {}

const tests = [
  {
    name: 'classes',
    content: `
      <span class="nav2 active"></span>
      <span class="nav1 active"></span>
      <span class="nav1 hidden"></span>
    `
  },
  {
    name: 'id',
    content: `
      <span id="first"></span>
      <span id="second"></span>
    `
  },
  {
    name: 'href',
    content: `
      <a href="/main"></a>
      <a href="/home"></a>
      <a href=""></a>
    `
  },
  {
    name: 'attributes',
    content: `
      <span class="nav1 active" title="one"></span>
      <span class="nav1 active" title="two"></span>
      <span class="nav2 active" title="one"></span>
    `
  },
  {
    name: 'contains',
    content: `
      <div>first</div>
      <div>second</div>
      <div>third</div>
      <div>forth <div>one</div></div>
    `
  },
]

describe('Single Select', function() {
  candidates().forEach(candidate => {
    describe(`${candidate.name}`, function() {

      tests.forEach(function({ name, content }) {
        describe(name, function () {
          const doc = initDOM(createHTML(content))
          const elements = doc.body.querySelectorAll('*')
          const examples = elementMatches(elements, doc)

          describe('generates selector string', function() {
            examples.forEach(example => {
              it(example.match, function() {
                expect(candidate.generate(example.element, { root: doc })).to.matchSnapshot(this)
              })
            })
          })

          describe('selector string is valid, unique and points to correct element', function() {
            examples.forEach(example => {
              it(example.match, function() {
                const selector = candidate.generate(example.element, { root: doc })
                const found = candidate.check(selector, doc)

                expect(found).to.have.length(1)
                expect(found[0]).to.equal(example.element)
              })
            })
          })
        })
      })
    })
  })
})


