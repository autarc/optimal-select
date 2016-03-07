'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getQuerySelector;
exports.getSingleSelector = getSingleSelector;
exports.getMultiSelector = getMultiSelector;

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _optimize = require('./optimize');

var _optimize2 = _interopRequireDefault(_optimize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Choose action depending on the input (single/multi)
 * @param  {HTMLElement|Array} input   - [description]
 * @param  {Object}            options - [description]
 * @return {string}                    - [description]
 */
/**
 * # Select
 *
 * Construct a unique CSS queryselector to access the selected DOM element(s).
 * Applies different matching and optimization strategies for efficiency.
 */

function getQuerySelector(input) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (Array.isArray(input)) {
    return getMultiSelector(input, options);
  }
  return getSingleSelector(input, options);
}

/**
 * Get a selector for the provided element
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
function getSingleSelector(element, options) {

  if (element.nodeType === 3) {
    return getSingleSelector(element.parentNode);
  }
  if (element.nodeType !== 1) {
    throw new Error('Invalid input!');
  }

  var selector = (0, _match2.default)(element, options);
  var optimized = (0, _optimize2.default)(selector, element);

  // debug
  // console.log(`
  //   selector: ${selector}
  //   optimized:${optimized}
  // `)

  return optimized;
}

/**
 * Get a selector to match multiple children from a parent
 * @param  {Array}  elements - [description]
 * @param  {Object} options  - [description]
 * @return {string}          - [description]
 */
function getMultiSelector(elements, options) {
  var commonParentNode = null;
  var commonClassName = null;
  var commonAttribute = null;
  var commonTagName = null;

  for (var i = 0, l = elements.length; i < l; i++) {
    var element = elements[i];
    if (!commonParentNode) {
      // 1st entry
      commonParentNode = element.parentNode;
      commonClassName = element.className;
      // commonAttribute = element.attributes
      commonTagName = element.tagName;
    } else if (commonParentNode !== element.parentNode) {
      return console.log('Can\'t be efficiently mapped. It probably best to use multiple single selectors instead!');
    }
    if (element.className !== commonClassName) {
      var classNames = [];
      var longer, shorter;
      if (element.className.length > commonClassName.length) {
        longer = element.className;
        shorter = commonClassName;
      } else {
        longer = commonClassName;
        shorter = element.className;
      }
      shorter.split(' ').forEach(function (name) {
        if (longer.indexOf(name) > -1) {
          classNames.push(name);
        }
      });
      commonClassName = classNames.join(' ');
    }
    // TODO:
    // - check attributes
    // if (element.attributes !== commonAttribute) {
    //
    // }
    if (element.tagName !== commonTagName) {
      commonTagName = null;
    }
  }

  var selector = getSingleSelector(commonParentNode);
  console.log(selector, commonClassName, commonAttribute, commonTagName);

  if (commonClassName) {
    return selector + ' > .' + commonClassName.replace(/ /g, '.');
  }
  // if (commonAttribute) {
  //
  // }
  if (commonTagName) {
    return selector + ' > ' + commonTagName.toLowerCase();
  }
  return selector + ' > *';
}
//# sourceMappingURL=data:application/json;base64,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LEVBQXNCLGVBQXRCLEVBQXVDLGVBQXZDLEVBQXdELGFBQXhELEVBNUNtRDs7QUE4Q25ELE1BQUksZUFBSixFQUFxQjtBQUNuQixXQUFVLG9CQUFlLGdCQUFnQixPQUFoQixDQUF3QixJQUF4QixFQUE4QixHQUE5QixDQUF6QixDQURtQjtHQUFyQjs7OztBQTlDbUQsTUFvRC9DLGFBQUosRUFBbUI7QUFDakIsV0FBVSxtQkFBYyxjQUFjLFdBQWQsRUFBeEIsQ0FEaUI7R0FBbkI7QUFHQSxTQUFVLGlCQUFWLENBdkRtRDtDQUE5QyIsImZpbGUiOiJzZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeXNlbGVjdG9yIHRvIGFjY2VzcyB0aGUgc2VsZWN0ZWQgRE9NIGVsZW1lbnQocykuXG4gKiBBcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMgZm9yIGVmZmljaWVuY3kuXG4gKi9cblxuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKHNpbmdsZS9tdWx0aSlcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICByZXR1cm4gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGVsZW1lbnQucGFyZW50Tm9kZSlcbiAgfVxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCEnKVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShzZWxlY3RvciwgZWxlbWVudClcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiR7b3B0aW1pemVkfVxuICAvLyBgKVxuXG4gIHJldHVybiBvcHRpbWl6ZWRcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBjaGlsZHJlbiBmcm9tIGEgcGFyZW50XG4gKiBAcGFyYW0gIHtBcnJheX0gIGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdWx0aVNlbGVjdG9yIChlbGVtZW50cywgb3B0aW9ucykge1xuICB2YXIgY29tbW9uUGFyZW50Tm9kZSA9IG51bGxcbiAgdmFyIGNvbW1vbkNsYXNzTmFtZSA9IG51bGxcbiAgdmFyIGNvbW1vbkF0dHJpYnV0ZSA9IG51bGxcbiAgdmFyIGNvbW1vblRhZ05hbWUgPSBudWxsXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgZWxlbWVudCA9IGVsZW1lbnRzW2ldXG4gICAgaWYgKCFjb21tb25QYXJlbnROb2RlKSB7IC8vIDFzdCBlbnRyeVxuICAgICAgY29tbW9uUGFyZW50Tm9kZSA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgICAgY29tbW9uQ2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgIC8vIGNvbW1vbkF0dHJpYnV0ZSA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29tbW9uVGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZVxuICAgIH0gZWxzZSBpZiAoY29tbW9uUGFyZW50Tm9kZSAhPT0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0NhblxcJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLiBJdCBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhJylcbiAgICB9XG4gICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lICE9PSBjb21tb25DbGFzc05hbWUpIHtcbiAgICAgIHZhciBjbGFzc05hbWVzID0gW11cbiAgICAgIHZhciBsb25nZXIsIHNob3J0ZXJcbiAgICAgIGlmIChlbGVtZW50LmNsYXNzTmFtZS5sZW5ndGggPiBjb21tb25DbGFzc05hbWUubGVuZ3RoKSB7XG4gICAgICAgIGxvbmdlciA9IGVsZW1lbnQuY2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBjb21tb25DbGFzc05hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvbmdlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgICBzaG9ydGVyID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgIH1cbiAgICAgIHNob3J0ZXIuc3BsaXQoJyAnKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICAgIGlmIChsb25nZXIuaW5kZXhPZihuYW1lKSA+IC0xKSB7XG4gICAgICAgICAgY2xhc3NOYW1lcy5wdXNoKG5hbWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBjb21tb25DbGFzc05hbWUgPSBjbGFzc05hbWVzLmpvaW4oJyAnKVxuICAgIH1cbiAgICAvLyBUT0RPOlxuICAgIC8vIC0gY2hlY2sgYXR0cmlidXRlc1xuICAgIC8vIGlmIChlbGVtZW50LmF0dHJpYnV0ZXMgIT09IGNvbW1vbkF0dHJpYnV0ZSkge1xuICAgIC8vXG4gICAgLy8gfVxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgIT09IGNvbW1vblRhZ05hbWUpIHtcbiAgICAgIGNvbW1vblRhZ05hbWUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBnZXRTaW5nbGVTZWxlY3Rvcihjb21tb25QYXJlbnROb2RlKVxuICBjb25zb2xlLmxvZyhzZWxlY3RvciwgY29tbW9uQ2xhc3NOYW1lLCBjb21tb25BdHRyaWJ1dGUsIGNvbW1vblRhZ05hbWUpXG5cbiAgaWYgKGNvbW1vbkNsYXNzTmFtZSkge1xuICAgIHJldHVybiBgJHtzZWxlY3Rvcn0gPiAuJHtjb21tb25DbGFzc05hbWUucmVwbGFjZSgvIC9nLCAnLicpfWBcbiAgfVxuICAvLyBpZiAoY29tbW9uQXR0cmlidXRlKSB7XG4gIC8vXG4gIC8vIH1cbiAgaWYgKGNvbW1vblRhZ05hbWUpIHtcbiAgICByZXR1cm4gYCR7c2VsZWN0b3J9ID4gJHtjb21tb25UYWdOYW1lLnRvTG93ZXJDYXNlKCl9YFxuICB9XG4gIHJldHVybiBgJHtzZWxlY3Rvcn0gPiAqYFxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
