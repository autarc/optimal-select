'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * # Select
                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                   * Construct a unique CSS queryselector to access the selected DOM element(s).
                                                                                                                                                                                                                                                   * Applies different matching and optimization strategies for efficiency.
                                                                                                                                                                                                                                                   */

exports.default = getQuerySelector;
exports.getSingleSelector = getSingleSelector;
exports.getMultiSelector = getMultiSelector;

var _adapt = require('./adapt');

var _adapt2 = _interopRequireDefault(_adapt);

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
    throw new Error('Invalid input - only HTMLElements or representations of them are supported! (not "' + (typeof element === 'undefined' ? 'undefined' : _typeof(element)) + '")');
  }

  var globalModified = (0, _adapt2.default)(element, options);

  var selector = (0, _match2.default)(element, options);
  var optimized = (0, _optimize2.default)(selector, element, options);

  // debug
  // console.log(`
  //   selector: ${selector}
  //   optimized:${optimized}
  // `)

  if (globalModified) {
    delete global.document;
  }

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

  var selector = getSingleSelector(commonParentNode, options);
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
//# sourceMappingURL=data:application/json;base64,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LFVBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsZUFBdEIsRUFBdUMsZUFBdkMsRUFBd0QsYUFBeEQ7O0FBRUEsTUFBSSxlQUFKLEVBQXFCO0FBQ25CLFdBQVUsUUFBVixZQUF5QixnQkFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsQ0FBekI7QUFDRDs7OztBQUlELE1BQUksYUFBSixFQUFtQjtBQUNqQixXQUFVLFFBQVYsV0FBd0IsY0FBYyxXQUFkLEVBQXhCO0FBQ0Q7QUFDRCxTQUFVLFFBQVY7QUFDRCIsImZpbGUiOiJzZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeXNlbGVjdG9yIHRvIGFjY2VzcyB0aGUgc2VsZWN0ZWQgRE9NIGVsZW1lbnQocykuXG4gKiBBcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMgZm9yIGVmZmljaWVuY3kuXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAoc2luZ2xlL211bHRpKVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXl9IGlucHV0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRRdWVyeVNlbGVjdG9yIChpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGlucHV0KSkge1xuICAgIHJldHVybiBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICB9XG4gIHJldHVybiBnZXRTaW5nbGVTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBmb3IgdGhlIHByb3ZpZGVkIGVsZW1lbnRcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zKSB7XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDMpIHtcbiAgICByZXR1cm4gZ2V0U2luZ2xlU2VsZWN0b3IoZWxlbWVudC5wYXJlbnROb2RlKVxuICB9XG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogJHtzZWxlY3Rvcn1cbiAgLy8gICBvcHRpbWl6ZWQ6JHtvcHRpbWl6ZWR9XG4gIC8vIGApXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGNoaWxkcmVuIGZyb20gYSBwYXJlbnRcbiAqIEBwYXJhbSAge0FycmF5fSAgZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIHZhciBjb21tb25QYXJlbnROb2RlID0gbnVsbFxuICB2YXIgY29tbW9uQ2xhc3NOYW1lID0gbnVsbFxuICB2YXIgY29tbW9uQXR0cmlidXRlID0gbnVsbFxuICB2YXIgY29tbW9uVGFnTmFtZSA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV1cbiAgICBpZiAoIWNvbW1vblBhcmVudE5vZGUpIHsgLy8gMXN0IGVudHJ5XG4gICAgICBjb21tb25QYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBjb21tb25DbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgLy8gY29tbW9uQXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb21tb25UYWdOYW1lID0gZWxlbWVudC50YWdOYW1lXG4gICAgfSBlbHNlIGlmIChjb21tb25QYXJlbnROb2RlICE9PSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnQ2FuXFwndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuIEl0IHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCEnKVxuICAgIH1cbiAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgIT09IGNvbW1vbkNsYXNzTmFtZSkge1xuICAgICAgdmFyIGNsYXNzTmFtZXMgPSBbXVxuICAgICAgdmFyIGxvbmdlciwgc2hvcnRlclxuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLmxlbmd0aCA+IGNvbW1vbkNsYXNzTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgbG9uZ2VyID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgICAgc2hvcnRlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9uZ2VyID0gY29tbW9uQ2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgfVxuICAgICAgc2hvcnRlci5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlci5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgICBjbGFzc05hbWVzLnB1c2gobmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbW1vbkNsYXNzTmFtZSA9IGNsYXNzTmFtZXMuam9pbignICcpXG4gICAgfVxuICAgIC8vIFRPRE86XG4gICAgLy8gLSBjaGVjayBhdHRyaWJ1dGVzXG4gICAgLy8gaWYgKGVsZW1lbnQuYXR0cmlidXRlcyAhPT0gY29tbW9uQXR0cmlidXRlKSB7XG4gICAgLy9cbiAgICAvLyB9XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSAhPT0gY29tbW9uVGFnTmFtZSkge1xuICAgICAgY29tbW9uVGFnTmFtZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGNvbW1vblBhcmVudE5vZGUsIG9wdGlvbnMpXG4gIGNvbnNvbGUubG9nKHNlbGVjdG9yLCBjb21tb25DbGFzc05hbWUsIGNvbW1vbkF0dHJpYnV0ZSwgY29tbW9uVGFnTmFtZSlcblxuICBpZiAoY29tbW9uQ2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGAke3NlbGVjdG9yfSA+IC4ke2NvbW1vbkNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YFxuICB9XG4gIC8vIGlmIChjb21tb25BdHRyaWJ1dGUpIHtcbiAgLy9cbiAgLy8gfVxuICBpZiAoY29tbW9uVGFnTmFtZSkge1xuICAgIHJldHVybiBgJHtzZWxlY3Rvcn0gPiAke2NvbW1vblRhZ05hbWUudG9Mb3dlckNhc2UoKX1gXG4gIH1cbiAgcmV0dXJuIGAke3NlbGVjdG9yfSA+ICpgXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
