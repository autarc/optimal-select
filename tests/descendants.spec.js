import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { select } from '../src'
import { initDOM, createHTML } from './helpers'

chai.use(chaiSnapshot)

global.document = {}

const descendants = `
  <div></div>
  <div>
    <div>
      <span>
        <div>
          <span>
            <div>
              <span>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
              </span>
            </div>
          </span>
        </div>
        <div>
          <span>
            <div>
              <span>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
              </span>
            </div>
          </span>
        </div>
        <div>
          <span>
            <div>
              <span>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
                <div><span></span></div>
              </span>
            </div>
          </span>
        </div>
      </span>
    </div>
    <div data="abc"><span></span></div>
  </div>
`

describe('Descendant selector (xpath)', function() {
  it('generates selector', function() {
    const document = initDOM(createHTML(descendants))
    const element = document.querySelector('body > div:nth-child(2)')
    const options = { root: document, format: 'xpath' }
    const selector = select(element, options)

    expect(selector).to.eq('.//body//div[.//div[@data="abc"]]')

    const found = document.evaluate(selector, document, null, 0).iterateNext()
    expect(found).to.eq(element)
  }) 
})


