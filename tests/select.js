import jsdom from 'jsdom';
import { expect } from 'chai';
import { select } from '../src/index.js';
import { filteredClassName } from '../src/select.js';

var document = jsdom.jsdom('<div class="bar bam"></div><div class="foo"></div><div id="baz"></div>');
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
    var divOneClass = document.getElementsByClassName('foo')[0];
    var divMultipleClasses = document.getElementsByClassName('bar')[0];

    it('should not filter out any classes by default', function() {
      var selector = select(divOneClass);
      expect(selector).to.equal('.foo');
    });

    it('should exclude the class when "classesToFilter" is specified and the element only has one class', function() {
      var selector = select(divOneClass, {
        classesToFilter: ['foo'],
        ignore: {
          attribute: function(name, val) {
            if (name === 'class') {
              return val === 'foo';
            }
            return false;
          },
          class: function(className) {
            return className === 'foo';
          }
        }
      });
      expect(selector).to.equal('body > div:nth-child(2)');
    });

    it('should filter out classes in "classesToFilter"', function() {
      var selector = select(divMultipleClasses, {
        classesToFilter: ['bar'],
        ignore: {
          attribute: function(name, val) {
            if (name === 'class') {
              return val === 'bar';
            }
            return false;
          },
          class: function(className) {
            return className === 'bar';
          }
        }
      });
      expect(selector).to.equal('.bam');
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
      expect(selector).to.equal('body > div:nth-child(3)');
    });
  });

  describe('CSS selector formatting', function() {
    it('should properly escape the CSS selector', function() {
      var div = document.createElement('div');
      div.setAttribute('class', 'C($navlink) Td(n):h D(b)');
      document.body.appendChild(div);
      var selector = select(div);
      expect(selector).to.equal('.C\\(\\$navlink\\).D\\(b\\).Td\\(n\\)\\3Ah');
    });
  });
});

