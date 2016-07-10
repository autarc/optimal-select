import jsdom from 'jsdom';
import { expect } from 'chai';
import { select } from '../src/index.js';
import { filteredClassName } from '../src/select.js';

var document = jsdom.jsdom('<div class="foo bar"></div><div id="baz"></div>');
global.document = document;

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

  describe('filter out "classesToFilter" when generating CSS selector', function() {
    var div = document.getElementsByClassName('foo')[0];
    it('should not filter out any classes by default', function() {
      var selector = select(div);
      expect(selector).to.equal('.bar.foo');
    });

    it('should filter out any classes when "classesToFilter" is specified', function() {
      var selector = select(div, {
        classesToFilter: ['foo']
      });
      expect(selector).to.equal('.bar');
    });
  });

  describe('filter out ids when generating CSS selector', function() {
    var div = document.getElementById('baz');
    it('should not filter out any ids by default', function() {
      var selector = select(div);
      expect(selector).to.equal('#baz');
    });

    it('should filter out any ids when passed the correct ignore params', function() {
      var selector = select(div, {
        ignore: {
          attribute: function(name, val) {
            if (name === 'id') {
              return val === 'baz';
            }
            return false;
          },
          id: function(id) {
            return id === 'baz';
          }
        }
      });
      expect(selector).to.equal('body > div:nth-child(2)');
    });
  });
});

