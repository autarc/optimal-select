'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * # Select
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Construct a unique CSS query selector to access the selected DOM element(s).
                                                                                                                                                                                                                                                                               * For longevity it applies different matching and optimization strategies.
                                                                                                                                                                                                                                                                               */

exports.getSingleSelector = getSingleSelector;
exports.getMultiSelector = getMultiSelector;
exports.default = getQuerySelector;

var _adapt = require('./adapt');

var _adapt2 = _interopRequireDefault(_adapt);

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _optimize = require('./optimize');

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = require('./utilities');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a selector for the provided element
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {string}              - [description]
 */
function getSingleSelector(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // 3 refers to - Node.TEXT_NODE type
  if (element.nodeType === 3) {
    element = element.parentNode;
  }

  // 1 refers to - Node.ELEMENT_NODE type
  if (element.nodeType !== 1) {
    throw new Error('Invalid input - only HTMLElements or representations of them are supported! (not "' + (typeof element === 'undefined' ? 'undefined' : _typeof(element)) + '")');
  }

  var globalModified = (0, _adapt2.default)(element, options);

  var selector = (0, _match2.default)(element, options);
  var optimized = (0, _optimize2.default)(selector, element, options);

  // debug
  // console.log(`
  //   selector:  ${selector}
  //   optimized: ${optimized}
  // `)

  var selectorTarget = global.document.querySelector(selector);
  var optimizedSelectorTarget = global.document.querySelector(optimized);

  if (globalModified) {
    delete global.document;
  }

  if (selectorTarget != optimizedSelectorTarget) {
    console.log('Error at selector optimization. Returning the raw selector.');

    return selector;
  }

  return optimized;
}

/**
 * Get a selector to match multiple descendants from an ancestor
 *
 * @param  {Array.<HTMLElement>|NodeList} elements - [description]
 * @param  {Object}                       options  - [description]
 * @return {string}                                - [description]
 */
function getMultiSelector(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!Array.isArray(elements)) {
    elements = (0, _utilities.convertNodeList)(elements);
  }

  if (elements.some(function (element) {
    return element.nodeType !== 1;
  })) {
    throw new Error('Invalid input - only an Array of HTMLElements or representations of them is supported!');
  }

  var globalModified = (0, _adapt2.default)(elements[0], options);

  var ancestor = (0, _common.getCommonAncestor)(elements, options);
  var ancestorSelector = getSingleSelector(ancestor, options);

  // TODO: consider usage of multiple selectors + parent-child relation + check for part redundancy
  var commonSelectors = getCommonSelectors(elements);
  var descendantSelector = commonSelectors[0];

  var selector = (0, _optimize2.default)(ancestorSelector + ' ' + descendantSelector, elements, options);
  var selectorMatches = (0, _utilities.convertNodeList)(document.querySelectorAll(selector));

  if (!elements.every(function (element) {
    return selectorMatches.some(function (entry) {
      return entry === element;
    });
  })) {
    // TODO: cluster matches to split into similar groups for sub selections
    return console.warn('\n      The selected elements can\'t be efficiently mapped.\n      Its probably best to use multiple single selectors instead!\n    ', elements);
  }

  if (globalModified) {
    delete global.document;
  }

  return selector;
}

/**
 * Get selectors to describe a set of elements
 *
 * @param  {Array.<HTMLElements>} elements - [description]
 * @return {string}                        - [description]
 */
function getCommonSelectors(elements) {
  var _getCommonProperties = (0, _common.getCommonProperties)(elements),
      classes = _getCommonProperties.classes,
      attributes = _getCommonProperties.attributes,
      tag = _getCommonProperties.tag;

  var selectorPath = [];

  if (tag) {
    selectorPath.push(tag);
  }

  if (classes) {
    var classSelector = classes.map(function (name) {
      return '.' + name;
    }).join('');
    selectorPath.push(classSelector);
  }

  if (attributes) {
    var attributeSelector = Object.keys(attributes).reduce(function (parts, name) {
      parts.push('[' + name + '="' + attributes[name] + '"]');
      return parts;
    }, []).join('');
    selectorPath.push(attributeSelector);
  }

  if (selectorPath.length) {
    // TODO: check for parent-child relation
  }

  return [selectorPath.join('')];
}

/**
 * Choose action depending on the input (multiple/single)
 *
 * NOTE: extended detection is used for special cases like the <select> element with <options>
 *
 * @param  {HTMLElement|NodeList|Array.<HTMLElement>} input   - [description]
 * @param  {Object}                                   options - [description]
 * @return {string}                                           - [description]
 */
function getQuerySelector(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (input.length && !input.name) {
    return getMultiSelector(input, options);
  }
  return getSingleSelector(input, options);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdC5qcyJdLCJuYW1lcyI6WyJnZXRTaW5nbGVTZWxlY3RvciIsImdldE11bHRpU2VsZWN0b3IiLCJnZXRRdWVyeVNlbGVjdG9yIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJub2RlVHlwZSIsInBhcmVudE5vZGUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwic2VsZWN0b3IiLCJvcHRpbWl6ZWQiLCJzZWxlY3RvclRhcmdldCIsImdsb2JhbCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsIm9wdGltaXplZFNlbGVjdG9yVGFyZ2V0IiwiY29uc29sZSIsImxvZyIsImVsZW1lbnRzIiwiQXJyYXkiLCJpc0FycmF5Iiwic29tZSIsImFuY2VzdG9yIiwiYW5jZXN0b3JTZWxlY3RvciIsImNvbW1vblNlbGVjdG9ycyIsImdldENvbW1vblNlbGVjdG9ycyIsImRlc2NlbmRhbnRTZWxlY3RvciIsInNlbGVjdG9yTWF0Y2hlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJldmVyeSIsImVudHJ5Iiwid2FybiIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwic2VsZWN0b3JQYXRoIiwicHVzaCIsImNsYXNzU2VsZWN0b3IiLCJtYXAiLCJuYW1lIiwiam9pbiIsImF0dHJpYnV0ZVNlbGVjdG9yIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsInBhcnRzIiwibGVuZ3RoIiwiaW5wdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs4UUFBQTs7Ozs7OztRQW9CZ0JBLGlCLEdBQUFBLGlCO1FBNkNBQyxnQixHQUFBQSxnQjtrQkFvRlFDLGdCOztBQTlJeEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7Ozs7OztBQU9PLFNBQVNGLGlCQUFULENBQTRCRyxPQUE1QixFQUFtRDtBQUFBLE1BQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFDeEQ7QUFDQSxNQUFJRCxRQUFRRSxRQUFSLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCRixjQUFVQSxRQUFRRyxVQUFs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RUFBYTtBQUNYLFFBQU1LLGdCQUFnQkwsUUFBUU0sR0FBUixDQUFZLFVBQUNDLElBQUQ7QUFBQSxtQkFBY0EsSUFBZDtBQUFBLEtBQVosRUFBa0NDLElBQWxDLENBQXVDLEVBQXZDLENBQXRCO0FBQ0FMLGlCQUFhQyxJQUFiLENBQWtCQyxhQUFsQjtBQUNEOztBQUVELE1BQUlKLFVBQUosRUFBZ0I7QUFDZCxRQUFNUSxvQkFBb0JDLE9BQU9DLElBQVAsQ0FBWVYsVUFBWixFQUF3QlcsTUFBeEIsQ0FBK0IsVUFBQ0MsS0FBRCxFQUFRTixJQUFSLEVBQWlCO0FBQ3hFTSxZQUFNVCxJQUFOLE9BQWVHLElBQWYsVUFBd0JOLFdBQVdNLElBQVgsQ0FBeEI7QUFDQSxhQUFPTSxLQUFQO0FBQ0QsS0FIeUIsRUFHdkIsRUFIdUIsRUFHbkJMLElBSG1CLENBR2QsRUFIYyxDQUExQjtBQUlBTCxpQkFBYUMsSUFBYixDQUFrQkssaUJBQWxCO0FBQ0Q7O0FBRUQsTUFBSU4sYUFBYVcsTUFBakIsRUFBeUI7QUFDdkI7QUFDRDs7QUFFRCxTQUFPLENBQ0xYLGFBQWFLLElBQWIsQ0FBa0IsRUFBbEIsQ0FESyxDQUFQO0FBR0Q7O0FBRUQ7Ozs7Ozs7OztBQVNlLFNBQVN0QyxnQkFBVCxDQUEyQjZDLEtBQTNCLEVBQWdEO0FBQUEsTUFBZDNDLE9BQWMsdUVBQUosRUFBSTs7QUFDN0QsTUFBSTJDLE1BQU1ELE1BQU4sSUFBZ0IsQ0FBQ0MsTUFBTVIsSUFBM0IsRUFBaUM7QUFDL0IsV0FBT3RDLGlCQUFpQjhDLEtBQWpCLEVBQXdCM0MsT0FBeEIsQ0FBUDtBQUNEO0FBQ0QsU0FBT0osa0JBQWtCK0MsS0FBbEIsRUFBeUIzQyxPQUF6QixDQUFQO0FBQ0QiLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnkgc2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEZvciBsb25nZXZpdHkgaXQgYXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzLlxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuaW1wb3J0IHsgZ2V0Q29tbW9uQW5jZXN0b3IsIGdldENvbW1vblByb3BlcnRpZXMgfSBmcm9tICcuL2NvbW1vbidcblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBmb3IgdGhlIHByb3ZpZGVkIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG4gIC8vIDMgcmVmZXJzIHRvIC0gTm9kZS5URVhUX05PREUgdHlwZVxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIC8vIDEgcmVmZXJzIHRvIC0gTm9kZS5FTEVNRU5UX05PREUgdHlwZVxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICAke3NlbGVjdG9yfVxuICAvLyAgIG9wdGltaXplZDogJHtvcHRpbWl6ZWR9XG4gIC8vIGApXG5cbiAgbGV0IHNlbGVjdG9yVGFyZ2V0ID0gZ2xvYmFsLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICBsZXQgb3B0aW1pemVkU2VsZWN0b3JUYXJnZXQgPSBnbG9iYWwuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihvcHRpbWl6ZWQpO1xuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIGlmIChzZWxlY3RvclRhcmdldCAhPSBvcHRpbWl6ZWRTZWxlY3RvclRhcmdldCkge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBhdCBzZWxlY3RvciBvcHRpbWl6YXRpb24uIFJldHVybmluZyB0aGUgcmF3IHNlbGVjdG9yLicpO1xuXG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplZDtcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBkZXNjZW5kYW50cyBmcm9tIGFuIGFuY2VzdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdH0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TXVsdGlTZWxlY3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgYW4gQXJyYXkgb2YgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGlzIHN1cHBvcnRlZCFgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclNlbGVjdG9yID0gZ2V0U2luZ2xlU2VsZWN0b3IoYW5jZXN0b3IsIG9wdGlvbnMpXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgdXNhZ2Ugb2YgbXVsdGlwbGUgc2VsZWN0b3JzICsgcGFyZW50LWNoaWxkIHJlbGF0aW9uICsgY2hlY2sgZm9yIHBhcnQgcmVkdW5kYW5jeVxuICBjb25zdCBjb21tb25TZWxlY3RvcnMgPSBnZXRDb21tb25TZWxlY3RvcnMoZWxlbWVudHMpXG4gIGNvbnN0IGRlc2NlbmRhbnRTZWxlY3RvciA9IGNvbW1vblNlbGVjdG9yc1swXVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gb3B0aW1pemUoYCR7YW5jZXN0b3JTZWxlY3Rvcn0gJHtkZXNjZW5kYW50U2VsZWN0b3J9YCwgZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdG9yTWF0Y2hlcyA9IGNvbnZlcnROb2RlTGlzdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblxuICBpZiAoIWVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiBzZWxlY3Rvck1hdGNoZXMuc29tZSgoZW50cnkpID0+IGVudHJ5ID09PSBlbGVtZW50KSApKSB7XG4gICAgLy8gVE9ETzogY2x1c3RlciBtYXRjaGVzIHRvIHNwbGl0IGludG8gc2ltaWxhciBncm91cHMgZm9yIHN1YiBzZWxlY3Rpb25zXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICBUaGUgc2VsZWN0ZWQgZWxlbWVudHMgY2FuXFwndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuXG4gICAgICBJdHMgcHJvYmFibHkgYmVzdCB0byB1c2UgbXVsdGlwbGUgc2luZ2xlIHNlbGVjdG9ycyBpbnN0ZWFkIVxuICAgIGAsIGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yXG59XG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudHM+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tbW9uU2VsZWN0b3JzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IHsgY2xhc3NlcywgYXR0cmlidXRlcywgdGFnIH0gPSBnZXRDb21tb25Qcm9wZXJ0aWVzKGVsZW1lbnRzKVxuXG4gIGNvbnN0IHNlbGVjdG9yUGF0aCA9IFtdXG5cbiAgaWYgKHRhZykge1xuICAgIHNlbGVjdG9yUGF0aC5wdXNoKHRhZylcbiAgfVxuXG4gIGlmIChjbGFzc2VzKSB7XG4gICAgY29uc3QgY2xhc3NTZWxlY3RvciA9IGNsYXNzZXMubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGNsYXNzU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IGF0dHJpYnV0ZVNlbGVjdG9yID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykucmVkdWNlKChwYXJ0cywgbmFtZSkgPT4ge1xuICAgICAgcGFydHMucHVzaChgWyR7bmFtZX09XCIke2F0dHJpYnV0ZXNbbmFtZV19XCJdYClcbiAgICAgIHJldHVybiBwYXJ0c1xuICAgIH0sIFtdKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGF0dHJpYnV0ZVNlbGVjdG9yKVxuICB9XG5cbiAgaWYgKHNlbGVjdG9yUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBUT0RPOiBjaGVjayBmb3IgcGFyZW50LWNoaWxkIHJlbGF0aW9uXG4gIH1cblxuICByZXR1cm4gW1xuICAgIHNlbGVjdG9yUGF0aC5qb2luKCcnKVxuICBdXG59XG5cbi8qKlxuICogQ2hvb3NlIGFjdGlvbiBkZXBlbmRpbmcgb24gdGhlIGlucHV0IChtdWx0aXBsZS9zaW5nbGUpXG4gKlxuICogTk9URTogZXh0ZW5kZWQgZGV0ZWN0aW9uIGlzIHVzZWQgZm9yIHNwZWNpYWwgY2FzZXMgbGlrZSB0aGUgPHNlbGVjdD4gZWxlbWVudCB3aXRoIDxvcHRpb25zPlxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fE5vZGVMaXN0fEFycmF5LjxIVE1MRWxlbWVudD59IGlucHV0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoaW5wdXQubGVuZ3RoICYmICFpbnB1dC5uYW1lKSB7XG4gICAgcmV0dXJuIGdldE11bHRpU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIH1cbiAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxufVxuIl19
