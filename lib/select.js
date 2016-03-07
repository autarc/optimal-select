'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * # Select
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * Construct a unique CSS queryselector to access the selected DOM element(s).
                                                                                                                                                                                                                                                                   * Applies different matching and optimization strategies for efficiency.
                                                                                                                                                                                                                                                                   */

exports.default = getQuerySelector;
exports.getSingleSelector = getSingleSelector;
exports.getMultiSelector = getMultiSelector;

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _optimize = require('./optimize');

var _optimize2 = _interopRequireDefault(_optimize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  excludes: {
    'style': '.*',
    'data-reactid': '.*',
    'data-react-checksum': '.*'
  }
};

/**
 * Choose action depending on the input (single/multi)
 * @param  {HTMLElement|Array} input   - [description]
 * @param  {Object}            options - [description]
 * @return {String}                    - [description]
 */
function getQuerySelector(input) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  options = _extends({}, defaultOptions, options);
  Object.keys(options.excludes).forEach(function (attribute) {
    var patterns = options.excludes[attribute];
    if (!Array.isArray(patterns)) {
      patterns = [patterns];
    }
    options.excludes[attribute] = patterns.map(function (pattern) {
      return new RegExp(pattern);
    });
  });
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
    return getQuerySelector(element.parentNode);
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
//# sourceMappingURL=data:application/json;base64,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QVYsQ0FGcUQ7T0FBdkQsTUFHTztBQUNMLGlCQUFTLGVBQVQsQ0FESztBQUVMLGtCQUFVLFFBQVEsU0FBUixDQUZMO09BSFA7QUFPQSxjQUFRLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLE9BQW5CLENBQTJCLFVBQUMsSUFBRCxFQUFVO0FBQ25DLFlBQUksT0FBTyxPQUFQLENBQWUsSUFBZixJQUF1QixDQUFDLENBQUQsRUFBSTtBQUM3QixxQkFBVyxJQUFYLENBQWdCLElBQWhCLEVBRDZCO1NBQS9CO09BRHlCLENBQTNCLENBVnlDO0FBZXpDLHdCQUFrQixXQUFXLElBQVgsQ0FBZ0IsR0FBaEIsQ0FBbEIsQ0FmeUM7S0FBM0M7Ozs7OztBQVYrQyxRQWdDM0MsUUFBUSxPQUFSLEtBQW9CLGFBQXBCLEVBQW1DO0FBQ3JDLHNCQUFnQixJQUFoQixDQURxQztLQUF2QztHQWhDRjs7QUFxQ0EsTUFBTSxXQUFXLGtCQUFrQixnQkFBbEIsQ0FBWCxDQTNDNkM7QUE0Q25ELFVBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsZUFBdEIsRUFBdUMsZUFBdkMsRUFBd0QsYUFBeEQsRUE1Q21EOztBQThDbkQsTUFBSSxlQUFKLEVBQXFCO0FBQ25CLFdBQVUsb0JBQWUsZ0JBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLEdBQTlCLENBQXpCLENBRG1CO0dBQXJCOzs7O0FBOUNtRCxNQW9EL0MsYUFBSixFQUFtQjtBQUNqQixXQUFVLG1CQUFjLGNBQWMsV0FBZCxFQUF4QixDQURpQjtHQUFuQjtBQUdBLFNBQVUsaUJBQVYsQ0F2RG1EO0NBQTlDIiwiZmlsZSI6InNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5c2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcyBmb3IgZWZmaWNpZW5jeS5cbiAqL1xuXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZXhjbHVkZXM6IHtcbiAgICAnc3R5bGUnOiAnLionLFxuICAgICdkYXRhLXJlYWN0aWQnOiAnLionLFxuICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJzogJy4qJ1xuICB9XG59XG5cbi8qKlxuICogQ2hvb3NlIGFjdGlvbiBkZXBlbmRpbmcgb24gdGhlIGlucHV0IChzaW5nbGUvbXVsdGkpXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheX0gaW5wdXQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuICBPYmplY3Qua2V5cyhvcHRpb25zLmV4Y2x1ZGVzKS5mb3JFYWNoKChhdHRyaWJ1dGUpID0+IHtcbiAgICB2YXIgcGF0dGVybnMgPSBvcHRpb25zLmV4Y2x1ZGVzW2F0dHJpYnV0ZV1cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocGF0dGVybnMpKSB7XG4gICAgICBwYXR0ZXJucyA9IFtwYXR0ZXJuc11cbiAgICB9XG4gICAgb3B0aW9ucy5leGNsdWRlc1thdHRyaWJ1dGVdID0gcGF0dGVybnMubWFwKChwYXR0ZXJuKSA9PiBuZXcgUmVnRXhwKHBhdHRlcm4pKVxuICB9KVxuICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICByZXR1cm4gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgcmV0dXJuIGdldFF1ZXJ5U2VsZWN0b3IoZWxlbWVudC5wYXJlbnROb2RlKVxuICB9XG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IScpXG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50KVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogJHtzZWxlY3Rvcn1cbiAgLy8gICBvcHRpbWl6ZWQ6JHtvcHRpbWl6ZWR9XG4gIC8vIGApXG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGNoaWxkcmVuIGZyb20gYSBwYXJlbnRcbiAqIEBwYXJhbSAge0FycmF5fSAgZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIHZhciBjb21tb25QYXJlbnROb2RlID0gbnVsbFxuICB2YXIgY29tbW9uQ2xhc3NOYW1lID0gbnVsbFxuICB2YXIgY29tbW9uQXR0cmlidXRlID0gbnVsbFxuICB2YXIgY29tbW9uVGFnTmFtZSA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV1cbiAgICBpZiAoIWNvbW1vblBhcmVudE5vZGUpIHsgLy8gMXN0IGVudHJ5XG4gICAgICBjb21tb25QYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBjb21tb25DbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgLy8gY29tbW9uQXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb21tb25UYWdOYW1lID0gZWxlbWVudC50YWdOYW1lXG4gICAgfSBlbHNlIGlmIChjb21tb25QYXJlbnROb2RlICE9PSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnQ2FuXFwndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuIEl0IHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCEnKVxuICAgIH1cbiAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgIT09IGNvbW1vbkNsYXNzTmFtZSkge1xuICAgICAgdmFyIGNsYXNzTmFtZXMgPSBbXVxuICAgICAgdmFyIGxvbmdlciwgc2hvcnRlclxuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLmxlbmd0aCA+IGNvbW1vbkNsYXNzTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgbG9uZ2VyID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgICAgc2hvcnRlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9uZ2VyID0gY29tbW9uQ2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgfVxuICAgICAgc2hvcnRlci5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlci5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgICBjbGFzc05hbWVzLnB1c2gobmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbW1vbkNsYXNzTmFtZSA9IGNsYXNzTmFtZXMuam9pbignICcpXG4gICAgfVxuICAgIC8vIFRPRE86XG4gICAgLy8gLSBjaGVjayBhdHRyaWJ1dGVzXG4gICAgLy8gaWYgKGVsZW1lbnQuYXR0cmlidXRlcyAhPT0gY29tbW9uQXR0cmlidXRlKSB7XG4gICAgLy9cbiAgICAvLyB9XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSAhPT0gY29tbW9uVGFnTmFtZSkge1xuICAgICAgY29tbW9uVGFnTmFtZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGNvbW1vblBhcmVudE5vZGUpXG4gIGNvbnNvbGUubG9nKHNlbGVjdG9yLCBjb21tb25DbGFzc05hbWUsIGNvbW1vbkF0dHJpYnV0ZSwgY29tbW9uVGFnTmFtZSlcblxuICBpZiAoY29tbW9uQ2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGAke3NlbGVjdG9yfSA+IC4ke2NvbW1vbkNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YFxuICB9XG4gIC8vIGlmIChjb21tb25BdHRyaWJ1dGUpIHtcbiAgLy9cbiAgLy8gfVxuICBpZiAoY29tbW9uVGFnTmFtZSkge1xuICAgIHJldHVybiBgJHtzZWxlY3Rvcn0gPiAke2NvbW1vblRhZ05hbWUudG9Mb3dlckNhc2UoKX1gXG4gIH1cbiAgcmV0dXJuIGAke3NlbGVjdG9yfSA+ICpgXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
