import { expect } from 'chai'

import { isValidCSSIdentifier } from '../src/utilities'

describe('Utilities', function() {
  describe('isValidCSSIdentifier', function() {
    it('returns true for valid CSS identifiers', () => {
      ['outer_part', 'test--', 't2', 'B\\&W'].forEach(ident => expect(isValidCSSIdentifier(ident)).to.eq(true))     
    })

    it('returns false for invalid CSS identifiers', () => {
      ['', '3_outer', '--test', '-2', 'B&W', '&'].forEach(ident => expect(isValidCSSIdentifier(ident)).to.eq(false))     
    })    
  })
})
