import chai, { expect } from 'chai'
import chaiSnapshot from 'mocha-chai-snapshot'

import { select } from '../src'
import { initDOM, createHTML } from './helpers'

chai.use(chaiSnapshot)

global.document = {}

const contains = `
  <div>first</div>
  <div>second</div>
  <div>third</div>
  <div>forth <div>one</div></div>
`

describe('Options', function() {
  describe('Contains (jQuery)', function() {
    it('allows to disable usage of contains', function() {
      const document = initDOM(createHTML(contains))
      const elements = document.body.querySelectorAll('*')
      const options = { root: document.body, format: 'jquery' }

      expect(select(elements[0], options)).to.equal('body > div:contains("first")')
      expect(select(elements[1], options)).to.equal('body > div:contains("second")')
      expect(select(elements[2], options)).to.equal('body > div:contains("third")')
      expect(select(elements[3], options)).to.equal('body > div:contains("forth one")')

      options.ignore = { contains: true }
      expect(select(elements[0], options)).to.equal('body > div:nth-child(1)')
      expect(select(elements[1], options)).to.equal('body > div:nth-child(2)')
      expect(select(elements[2], options)).to.equal('body > div:nth-child(3)')
      expect(select(elements[3], options)).to.equal('body > div:nth-child(4)')


      options.ignore = { contains: 'on' }
      expect(select(elements[0], options)).to.equal('body > div:contains("first")')
      expect(select(elements[1], options)).to.equal('body > div:nth-child(2)')
      expect(select(elements[2], options)).to.equal('body > div:contains("third")')
      expect(select(elements[3], options)).to.equal('body > div:nth-child(4)')

      options.ignore = {
        contains: (name, value) => /^f/.test(value)
      }
      expect(select(elements[0], options)).to.equal('body > div:nth-child(1)')
      expect(select(elements[1], options)).to.equal('body > div:contains("second")')
      expect(select(elements[2], options)).to.equal('body > div:contains("third")')
      expect(select(elements[3], options)).to.equal('body > div:nth-child(4)')
    })
  })
})


