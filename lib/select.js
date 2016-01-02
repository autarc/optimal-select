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
 * # Select
 *
 * Construct a unique CSS queryselector to access the selected DOM element(s).
 * Applies different matching and optimization strategies for efficiency.
 */

var defaultOptions = {
  excludes: ['style', 'data-reactid', 'data-react-checksum']
};

/**
 * Choose action depending on the input (single/multi)
 * @param  {HTMLElement|Array} input   - [description]
 * @param  {Object}            options - [description]
 * @return {String}                    - [description]
 */
function getQuerySelector(input) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? defaultOptions : arguments[1];

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

  if (element instanceof Text) {
    return getQuerySelector(element.parentNode);
  }
  if (element instanceof HTMLElement === false) {
    throw new Error('Invalid input!');
  }

  var selector = (0, _match2.default)(element, options);
  var optimized = (0, _optimize2.default)(selector, element);

  // debug
  // console.log(`
  //   selector: ${selector}
  //   optimized:${optimized}
  // `);

  return optimized;
}

/**
 * Get a selector to match multiple children from a parent
 * @param  {Array}  elements - [description]
 * @param  {Object} options  - [description]
 * @return {String}          - [description]
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
//# sourceMappingURL=data:application/json;base64,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LEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFDN0Isb0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDdEI7T0FDRixDQUFDLENBQUE7QUFDRixxQkFBZSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDdkM7Ozs7OztBQUFBLEFBTUQsUUFBSSxPQUFPLENBQUMsT0FBTyxLQUFLLGFBQWEsRUFBRTtBQUNyQyxtQkFBYSxHQUFHLElBQUksQ0FBQTtLQUNyQjtHQUNGOztBQUVELE1BQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDcEQsU0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQTs7QUFFdEUsTUFBSSxlQUFlLEVBQUU7QUFDbkIsV0FBVSxRQUFRLFlBQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUU7R0FDOUQ7Ozs7QUFBQSxBQUlELE1BQUksYUFBYSxFQUFFO0FBQ2pCLFdBQVUsUUFBUSxXQUFNLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBRTtHQUN0RDtBQUNELFNBQVUsUUFBUSxVQUFNO0NBQ3pCIiwiZmlsZSI6InNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5c2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcyBmb3IgZWZmaWNpZW5jeS5cbiAqL1xuXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZXhjbHVkZXM6IFtcbiAgICAnc3R5bGUnLFxuICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICBdXG59XG5cbi8qKlxuICogQ2hvb3NlIGFjdGlvbiBkZXBlbmRpbmcgb24gdGhlIGlucHV0IChzaW5nbGUvbXVsdGkpXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheX0gaW5wdXQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGdldE11bHRpU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIH1cbiAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2luZ2xlU2VsZWN0b3IgKGVsZW1lbnQsIG9wdGlvbnMpIHtcblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICByZXR1cm4gZ2V0UXVlcnlTZWxlY3RvcihlbGVtZW50LnBhcmVudE5vZGUpXG4gIH1cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQhJylcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gbWF0Y2goZWxlbWVudCwgb3B0aW9ucylcbiAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemUoc2VsZWN0b3IsIGVsZW1lbnQpXG5cbiAgLy8gZGVidWdcbiAgLy8gY29uc29sZS5sb2coYFxuICAvLyAgIHNlbGVjdG9yOiAke3NlbGVjdG9yfVxuICAvLyAgIG9wdGltaXplZDoke29wdGltaXplZH1cbiAgLy8gYCk7XG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGNoaWxkcmVuIGZyb20gYSBwYXJlbnRcbiAqIEBwYXJhbSAge0FycmF5fSAgZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIHZhciBjb21tb25QYXJlbnROb2RlID0gbnVsbFxuICB2YXIgY29tbW9uQ2xhc3NOYW1lID0gbnVsbFxuICB2YXIgY29tbW9uQXR0cmlidXRlID0gbnVsbFxuICB2YXIgY29tbW9uVGFnTmFtZSA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV1cbiAgICBpZiAoIWNvbW1vblBhcmVudE5vZGUpIHsgLy8gMXN0IGVudHJ5XG4gICAgICBjb21tb25QYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBjb21tb25DbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgLy8gY29tbW9uQXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb21tb25UYWdOYW1lID0gZWxlbWVudC50YWdOYW1lXG4gICAgfSBlbHNlIGlmIChjb21tb25QYXJlbnROb2RlICE9PSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnQ2FuXFwndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuIEl0IHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCEnKVxuICAgIH1cbiAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgIT09IGNvbW1vbkNsYXNzTmFtZSkge1xuICAgICAgdmFyIGNsYXNzTmFtZXMgPSBbXVxuICAgICAgdmFyIGxvbmdlciwgc2hvcnRlclxuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLmxlbmd0aCA+IGNvbW1vbkNsYXNzTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgbG9uZ2VyID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgICAgc2hvcnRlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9uZ2VyID0gY29tbW9uQ2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgfVxuICAgICAgc2hvcnRlci5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlci5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgICBjbGFzc05hbWVzLnB1c2gobmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbW1vbkNsYXNzTmFtZSA9IGNsYXNzTmFtZXMuam9pbignICcpXG4gICAgfVxuICAgIC8vIFRPRE86XG4gICAgLy8gLSBjaGVjayBhdHRyaWJ1dGVzXG4gICAgLy8gaWYgKGVsZW1lbnQuYXR0cmlidXRlcyAhPT0gY29tbW9uQXR0cmlidXRlKSB7XG4gICAgLy9cbiAgICAvLyB9XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSAhPT0gY29tbW9uVGFnTmFtZSkge1xuICAgICAgY29tbW9uVGFnTmFtZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGNvbW1vblBhcmVudE5vZGUpXG4gIGNvbnNvbGUubG9nKHNlbGVjdG9yLCBjb21tb25DbGFzc05hbWUsIGNvbW1vbkF0dHJpYnV0ZSwgY29tbW9uVGFnTmFtZSlcblxuICBpZiAoY29tbW9uQ2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGAke3NlbGVjdG9yfSA+IC4ke2NvbW1vbkNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YFxuICB9XG4gIC8vIGlmIChjb21tb25BdHRyaWJ1dGUpIHtcbiAgLy9cbiAgLy8gfVxuICBpZiAoY29tbW9uVGFnTmFtZSkge1xuICAgIHJldHVybiBgJHtzZWxlY3Rvcn0gPiAke2NvbW1vblRhZ05hbWUudG9Mb3dlckNhc2UoKX1gXG4gIH1cbiAgcmV0dXJuIGAke3NlbGVjdG9yfSA+ICpgXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
