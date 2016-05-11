import jsdom from 'mocha-jsdom';
import { expect } from 'chai';
import { filteredClassName } from '../src/select.js';

jsdom();

describe('test select.js', function() {
  describe('filter out "classesToFilter" from className', function() {
    const options = {
      classesToFilter: ['badClass', 'badClass2'],
    }

    it('should filter out "classesToFilter"', function() {
      expect(filteredClassName('goodClass', options)).to.equal('goodClass');
      expect(filteredClassName('goodClass badClass', options)).to.equal('goodClass');
      expect(filteredClassName('goodClass badClass badClass2', options)).to.equal('goodClass');
    });

    it('should return sorted classNames', function() {
      expect(filteredClassName('c d a e b f badClass', options)).to.equal('a b c d e f');
    });
  });
});

