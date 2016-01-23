'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * # Select
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * Construct a unique CSS queryselector to access the selected DOM element(s).
                                                                                                                                                                                                                                                                   * Applies different matching and optimization strategies for efficiency.
                                                                                                                                                                                                                                                                   */

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

var defaultOptions = {
  global: window,
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
  options = _extends({}, defaultOptions, options);
  if (element instanceof options.global.Text) {
    return getQuerySelector(element.parentNode);
  }
  if (element instanceof options.global.HTMLElement === false) {
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
//# sourceMappingURL=data:application/json;base64,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QUEyQixnQkFBZ0IsTUFBaEIsRUFBd0I7QUFDckQsaUJBQVMsUUFBUSxTQUFSLENBRDRDO0FBRXJELGtCQUFVLGVBQVYsQ0FGcUQ7T0FBdkQsTUFHTztBQUNMLGlCQUFTLGVBQVQsQ0FESztBQUVMLGtCQUFVLFFBQVEsU0FBUixDQUZMO09BSFA7QUFPQSxjQUFRLEtBQVIsQ0FBYyxHQUFkLEVBQW1CLE9BQW5CLENBQTJCLFVBQUMsSUFBRCxFQUFVO0FBQ25DLFlBQUksT0FBTyxPQUFQLENBQWUsSUFBZixJQUF1QixDQUFDLENBQUQsRUFBSTtBQUM3QixxQkFBVyxJQUFYLENBQWdCLElBQWhCLEVBRDZCO1NBQS9CO09BRHlCLENBQTNCLENBVnlDO0FBZXpDLHdCQUFrQixXQUFXLElBQVgsQ0FBZ0IsR0FBaEIsQ0FBbEIsQ0FmeUM7S0FBM0M7Ozs7OztBQVYrQyxRQWdDM0MsUUFBUSxPQUFSLEtBQW9CLGFBQXBCLEVBQW1DO0FBQ3JDLHNCQUFnQixJQUFoQixDQURxQztLQUF2QztHQWhDRjs7QUFxQ0EsTUFBTSxXQUFXLGtCQUFrQixnQkFBbEIsQ0FBWCxDQTNDNkM7QUE0Q25ELFVBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsZUFBdEIsRUFBdUMsZUFBdkMsRUFBd0QsYUFBeEQsRUE1Q21EOztBQThDbkQsTUFBSSxlQUFKLEVBQXFCO0FBQ25CLFdBQVUsb0JBQWUsZ0JBQWdCLE9BQWhCLENBQXdCLElBQXhCLEVBQThCLEdBQTlCLENBQXpCLENBRG1CO0dBQXJCOzs7O0FBOUNtRCxNQW9EL0MsYUFBSixFQUFtQjtBQUNqQixXQUFVLG1CQUFjLGNBQWMsV0FBZCxFQUF4QixDQURpQjtHQUFuQjtBQUdBLFNBQVUsaUJBQVYsQ0F2RG1EO0NBQTlDIiwiZmlsZSI6InNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5c2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcyBmb3IgZWZmaWNpZW5jeS5cbiAqL1xuXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgZ2xvYmFsOiB3aW5kb3csXG4gIGV4Y2x1ZGVzOiB7XG4gICAgJ3N0eWxlJzogJy4qJyxcbiAgICAnZGF0YS1yZWFjdGlkJzogJy4qJyxcbiAgICAnZGF0YS1yZWFjdC1jaGVja3N1bSc6ICcuKidcbiAgfVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAoc2luZ2xlL211bHRpKVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXl9IGlucHV0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRRdWVyeVNlbGVjdG9yIChpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIG9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH1cbiAgT2JqZWN0LmtleXMob3B0aW9ucy5leGNsdWRlcykuZm9yRWFjaCgoYXR0cmlidXRlKSA9PiB7XG4gICAgdmFyIHBhdHRlcm5zID0gb3B0aW9ucy5leGNsdWRlc1thdHRyaWJ1dGVdXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHBhdHRlcm5zKSkge1xuICAgICAgcGF0dGVybnMgPSBbcGF0dGVybnNdXG4gICAgfVxuICAgIG9wdGlvbnMuZXhjbHVkZXNbYXR0cmlidXRlXSA9IHBhdHRlcm5zLm1hcCgocGF0dGVybikgPT4gbmV3IFJlZ0V4cChwYXR0ZXJuKSlcbiAgfSlcbiAgaWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG4gICAgcmV0dXJuIGdldE11bHRpU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIH1cbiAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2luZ2xlU2VsZWN0b3IgKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIG9wdGlvbnMuZ2xvYmFsLlRleHQpIHtcbiAgICByZXR1cm4gZ2V0UXVlcnlTZWxlY3RvcihlbGVtZW50LnBhcmVudE5vZGUpXG4gIH1cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBvcHRpb25zLmdsb2JhbC5IVE1MRWxlbWVudCA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQhJylcbiAgfVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gbWF0Y2goZWxlbWVudCwgb3B0aW9ucylcbiAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemUoc2VsZWN0b3IsIGVsZW1lbnQpXG5cbiAgLy8gZGVidWdcbiAgLy8gY29uc29sZS5sb2coYFxuICAvLyAgIHNlbGVjdG9yOiAke3NlbGVjdG9yfVxuICAvLyAgIG9wdGltaXplZDoke29wdGltaXplZH1cbiAgLy8gYCk7XG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGNoaWxkcmVuIGZyb20gYSBwYXJlbnRcbiAqIEBwYXJhbSAge0FycmF5fSAgZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gIHZhciBjb21tb25QYXJlbnROb2RlID0gbnVsbFxuICB2YXIgY29tbW9uQ2xhc3NOYW1lID0gbnVsbFxuICB2YXIgY29tbW9uQXR0cmlidXRlID0gbnVsbFxuICB2YXIgY29tbW9uVGFnTmFtZSA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHZhciBlbGVtZW50ID0gZWxlbWVudHNbaV1cbiAgICBpZiAoIWNvbW1vblBhcmVudE5vZGUpIHsgLy8gMXN0IGVudHJ5XG4gICAgICBjb21tb25QYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBjb21tb25DbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgLy8gY29tbW9uQXR0cmlidXRlID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb21tb25UYWdOYW1lID0gZWxlbWVudC50YWdOYW1lXG4gICAgfSBlbHNlIGlmIChjb21tb25QYXJlbnROb2RlICE9PSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnQ2FuXFwndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuIEl0IHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCEnKVxuICAgIH1cbiAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgIT09IGNvbW1vbkNsYXNzTmFtZSkge1xuICAgICAgdmFyIGNsYXNzTmFtZXMgPSBbXVxuICAgICAgdmFyIGxvbmdlciwgc2hvcnRlclxuICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLmxlbmd0aCA+IGNvbW1vbkNsYXNzTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgbG9uZ2VyID0gZWxlbWVudC5jbGFzc05hbWVcbiAgICAgICAgc2hvcnRlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9uZ2VyID0gY29tbW9uQ2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBlbGVtZW50LmNsYXNzTmFtZVxuICAgICAgfVxuICAgICAgc2hvcnRlci5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlci5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgICBjbGFzc05hbWVzLnB1c2gobmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbW1vbkNsYXNzTmFtZSA9IGNsYXNzTmFtZXMuam9pbignICcpXG4gICAgfVxuICAgIC8vIFRPRE86XG4gICAgLy8gLSBjaGVjayBhdHRyaWJ1dGVzXG4gICAgLy8gaWYgKGVsZW1lbnQuYXR0cmlidXRlcyAhPT0gY29tbW9uQXR0cmlidXRlKSB7XG4gICAgLy9cbiAgICAvLyB9XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSAhPT0gY29tbW9uVGFnTmFtZSkge1xuICAgICAgY29tbW9uVGFnTmFtZSA9IG51bGxcbiAgICB9XG4gIH1cblxuICBjb25zdCBzZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGNvbW1vblBhcmVudE5vZGUpXG4gIGNvbnNvbGUubG9nKHNlbGVjdG9yLCBjb21tb25DbGFzc05hbWUsIGNvbW1vbkF0dHJpYnV0ZSwgY29tbW9uVGFnTmFtZSlcblxuICBpZiAoY29tbW9uQ2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIGAke3NlbGVjdG9yfSA+IC4ke2NvbW1vbkNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YFxuICB9XG4gIC8vIGlmIChjb21tb25BdHRyaWJ1dGUpIHtcbiAgLy9cbiAgLy8gfVxuICBpZiAoY29tbW9uVGFnTmFtZSkge1xuICAgIHJldHVybiBgJHtzZWxlY3Rvcn0gPiAke2NvbW1vblRhZ05hbWUudG9Mb3dlckNhc2UoKX1gXG4gIH1cbiAgcmV0dXJuIGAke3NlbGVjdG9yfSA+ICpgXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
