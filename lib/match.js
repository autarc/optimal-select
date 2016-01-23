'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = match;
/**
 * # Match
 *
 * Retrieves selector
 */

/**
 * Get the path of the element
 * @param  {HTMLElement} node    - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
function match(node, options) {
  var path = [];
  var element = node;
  var length = path.length;

  while (element !== document) {
    // global
    if (checkId(element, path, options)) break;
    if (checkClassGlobal(element, path, options)) break;
    if (checkAttributeGlobal(element, path, options)) break;
    if (checkTagGlobal(element, path)) break;

    // local
    checkClassLocal(element, path, options);

    // define only one selector each iteration
    if (path.length === length) {
      checkAttributeLocal(element, path, options);
    }
    if (path.length === length) {
      checkTagLocal(element, path);
    }

    if (path.length === length) {
      checkClassChild(element, path, options);
    }
    if (path.length === length) {
      checkAttributeChild(element, path, options);
    }
    if (path.length === length) {
      checkTagChild(element, path);
    }

    element = element.parentNode;
    length = path.length;
  }

  if (element === document) {
    path.unshift('*');
  }

  return path.join(' ');
}

/**
 * [checkClassGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassGlobal(element, path, options) {
  return checkClass(element, path, document, options);
}

/**
 * [checkClassLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassLocal(element, path, options) {
  return checkClass(element, path, element.parentNode, options);
}

/**
 * [checkClassChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassChild(element, path, options) {
  var className = element.className;
  if (!className || compareExcludes(className, options.excludes.class)) {
    return false;
  }
  return checkChild(element, path, '.' + className.replace(/ /g, '.'));
}

/**
 * [checkAttributeGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeGlobal(element, path, options) {
  return checkAttribute(element, path, document, options);
}

/**
 * [checkAttributeLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeLocal(element, path, options) {
  return checkAttribute(element, path, element.parentNode, options);
}

/**
 * [checkAttributeChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeChild(element, path, options) {
  var attributes = element.attributes;
  return Object.keys(attributes).some(function (key) {
    var attribute = attributes[key];
    var attributeName = attribute.name;
    var attributeValue = attribute.value;
    // include 'id', 'class' check ?
    // if (['id', 'class'].concat(options.excludes).indexOf(attributeName) > -1) {
    //   return false
    // }
    if (compareExcludes(attributeValue, options.excludes[attributeName])) {
      return false;
    }
    var pattern = '[' + attributeName + '="' + attributeValue + '"]';
    return checkChild(element, path, pattern, options);
  });
}

/**
 * [checkTagGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkTagGlobal(element, path) {
  return checkTag(element, path, document);
}

/**
 * [checkTagLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkTagLocal(element, path) {
  return checkTag(element, path, element.parentNode);
}

/**
 * [checkTabChildren description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkTagChild(element, path) {
  return checkChild(element, path, element.tagName.toLowerCase());
}

/**
 * [checkId description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkId(element, path) {
  var id = element.id;
  if (!id) {
    return false;
  }
  path.unshift('#' + id);
  return true;
}

/**
 * [checkClass description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkClass(element, path, parent, options) {
  var className = element.className;
  if (!className || compareExcludes(className, options.excludes.class)) {
    return false;
  }
  var matches = parent.getElementsByClassName(className);
  if (matches.length === 1) {
    path.unshift('.' + className.replace(/ /g, '.'));
    return true;
  }
  return false;
}

/**
 * [checkAttribute description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {HTMLElement} parent  - [description]
 * @param  {Object}      options - [description]
 * @return {Boolean}             - [description]
 */
function checkAttribute(element, path, parent, options) {
  var attributes = element.attributes;
  return Object.keys(attributes).some(function (key) {
    var attribute = attributes[key];
    var attributeName = attribute.name;
    var attributeValue = attribute.value;
    if (compareExcludes(attributeValue, options.excludes[attributeName])) {
      return false;
    }
    var pattern = '[' + attributeName + '="' + attributeValue + '"]';
    var matches = parent.querySelectorAll(pattern);
    if (matches.length === 1) {
      path.unshift(pattern);
      return true;
    }
  });
}

/**
 * [checkTag description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkTag(element, path, parent) {
  var tagName = element.tagName.toLowerCase();
  var matches = parent.getElementsByTagName(tagName);
  if (matches.length === 1) {
    path.unshift(tagName);
    return true;
  }
  return false;
}

/**
 * [checkChild description]
 * @param  {HTMLElement} element  - [description]
 * @param  {Array}       path     - [description]
 * @param  {String}      selector - [description]
 * @return {Boolean}              - [description]
 */
function checkChild(element, path, selector) {
  var parent = element.parentNode;
  var children = parent.children;
  for (var i = 0, l = children.length; i < l; i++) {
    if (children[i] === element) {
      path.unshift('> ' + selector + ':nth-child(' + (i + 1) + ')');
      return true;
    }
  }
  return false;
}

/**
 * [compareExcludes description]
 * @param  {String}            value    - [description]
 * @param  {Null|String|Array} excludes - [description]
 * @return {Boolean}                    - [description]
 */
function compareExcludes(value, excludes) {
  if (!excludes) {
    return false;
  }
  return excludes.some(function (exclude) {
    return exclude.test(value);
  });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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UCxDQUYyQjtBQUc1QyxPQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sSUFBSSxTQUFTLE1BQVQsRUFBaUIsSUFBSSxDQUFKLEVBQU8sR0FBNUMsRUFBaUQ7QUFDL0MsUUFBSSxTQUFTLENBQVQsTUFBZ0IsT0FBaEIsRUFBeUI7QUFDM0IsV0FBSyxPQUFMLFFBQWtCLDRCQUFzQixJQUFFLENBQUYsT0FBeEMsRUFEMkI7QUFFM0IsYUFBTyxJQUFQLENBRjJCO0tBQTdCO0dBREY7QUFNQSxTQUFPLEtBQVAsQ0FUNEM7Q0FBOUM7Ozs7Ozs7O0FBa0JBLFNBQVMsZUFBVCxDQUEwQixLQUExQixFQUFpQyxRQUFqQyxFQUEyQztBQUN6QyxNQUFJLENBQUMsUUFBRCxFQUFXO0FBQ2IsV0FBTyxLQUFQLENBRGE7R0FBZjtBQUdBLFNBQU8sU0FBUyxJQUFULENBQWMsVUFBQyxPQUFEO1dBQWEsUUFBUSxJQUFSLENBQWEsS0FBYjtHQUFiLENBQXJCLENBSnlDO0NBQTNDIiwiZmlsZSI6Im1hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmVzIHNlbGVjdG9yXG4gKi9cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMpIHtcbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gZG9jdW1lbnQpIHtcbiAgICAvLyBnbG9iYWxcbiAgICBpZiAoY2hlY2tJZChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSkgYnJlYWtcbiAgICBpZiAoY2hlY2tDbGFzc0dsb2JhbChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSkgYnJlYWtcbiAgICBpZiAoY2hlY2tBdHRyaWJ1dGVHbG9iYWwoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykpIGJyZWFrXG4gICAgaWYgKGNoZWNrVGFnR2xvYmFsKGVsZW1lbnQsIHBhdGgpKSBicmVha1xuXG4gICAgLy8gbG9jYWxcbiAgICBjaGVja0NsYXNzTG9jYWwoZWxlbWVudCwgcGF0aCwgb3B0aW9ucylcblxuICAgIC8vIGRlZmluZSBvbmx5IG9uZSBzZWxlY3RvciBlYWNoIGl0ZXJhdGlvblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja0F0dHJpYnV0ZUxvY2FsKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpXG4gICAgfVxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja1RhZ0xvY2FsKGVsZW1lbnQsIHBhdGgpXG4gICAgfVxuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrQ2xhc3NDaGlsZChlbGVtZW50LCBwYXRoLCBvcHRpb25zKVxuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tBdHRyaWJ1dGVDaGlsZChlbGVtZW50LCBwYXRoLCBvcHRpb25zKVxuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tUYWdDaGlsZChlbGVtZW50LCBwYXRoKVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IGRvY3VtZW50KSB7XG4gICAgcGF0aC51bnNoaWZ0KCcqJylcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKVxufVxuXG5cbi8qKlxuICogW2NoZWNrQ2xhc3NHbG9iYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3NHbG9iYWwgKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNoZWNrQ2xhc3MoZWxlbWVudCwgcGF0aCwgZG9jdW1lbnQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogW2NoZWNrQ2xhc3NMb2NhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzc0xvY2FsIChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSB7XG4gIHJldHVybiBjaGVja0NsYXNzKGVsZW1lbnQsIHBhdGgsIGVsZW1lbnQucGFyZW50Tm9kZSwgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBbY2hlY2tDbGFzc0NoaWxkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NsYXNzQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpIHtcbiAgY29uc3QgY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWVcbiAgaWYgKCFjbGFzc05hbWUgfHwgY29tcGFyZUV4Y2x1ZGVzKGNsYXNzTmFtZSwgb3B0aW9ucy5leGNsdWRlcy5jbGFzcykpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCBgLiR7Y2xhc3NOYW1lLnJlcGxhY2UoLyAvZywgJy4nKX1gKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUdsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZUdsb2JhbCAoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykge1xuICByZXR1cm4gY2hlY2tBdHRyaWJ1dGUoZWxlbWVudCwgcGF0aCwgZG9jdW1lbnQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogW2NoZWNrQXR0cmlidXRlTG9jYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVMb2NhbCAoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykge1xuICByZXR1cm4gY2hlY2tBdHRyaWJ1dGUoZWxlbWVudCwgcGF0aCwgZWxlbWVudC5wYXJlbnROb2RlLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUNoaWxkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuc29tZSgoa2V5KSA9PiB7XG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgY29uc3QgIGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlLnZhbHVlXG4gICAgLy8gaW5jbHVkZSAnaWQnLCAnY2xhc3MnIGNoZWNrID9cbiAgICAvLyBpZiAoWydpZCcsICdjbGFzcyddLmNvbmNhdChvcHRpb25zLmV4Y2x1ZGVzKS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTEpIHtcbiAgICAvLyAgIHJldHVybiBmYWxzZVxuICAgIC8vIH1cbiAgICBpZiAoY29tcGFyZUV4Y2x1ZGVzKGF0dHJpYnV0ZVZhbHVlLCBvcHRpb25zLmV4Y2x1ZGVzW2F0dHJpYnV0ZU5hbWVdKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCBwYXR0ZXJuLCBvcHRpb25zKVxuICB9KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZ0dsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWdHbG9iYWwgKGVsZW1lbnQsIHBhdGgpIHtcbiAgcmV0dXJuIGNoZWNrVGFnKGVsZW1lbnQsIHBhdGgsIGRvY3VtZW50KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZ0xvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZ0xvY2FsIChlbGVtZW50LCBwYXRoKSB7XG4gIHJldHVybiBjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBlbGVtZW50LnBhcmVudE5vZGUpXG59XG5cbi8qKlxuICogW2NoZWNrVGFiQ2hpbGRyZW4gZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnQ2hpbGQgKGVsZW1lbnQsIHBhdGgpIHtcbiAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpXG59XG5cbi8qKlxuICogW2NoZWNrSWQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWQgKGVsZW1lbnQsIHBhdGgpIHtcbiAgY29uc3QgaWQgPSBlbGVtZW50LmlkXG4gIGlmICghaWQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBwYXRoLnVuc2hpZnQoYCMke2lkfWApXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogW2NoZWNrQ2xhc3MgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzcyAoZWxlbWVudCwgcGF0aCwgcGFyZW50LCBvcHRpb25zKSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lXG4gIGlmICghY2xhc3NOYW1lIHx8IGNvbXBhcmVFeGNsdWRlcyhjbGFzc05hbWUsIG9wdGlvbnMuZXhjbHVkZXMuY2xhc3MpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSlcbiAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgcGF0aC51bnNoaWZ0KGAuJHtjbGFzc05hbWUucmVwbGFjZSgvIC9nLCAnLicpfWApXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGUgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAoZWxlbWVudCwgcGF0aCwgcGFyZW50LCBvcHRpb25zKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvbWUoKGtleSkgPT4ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlLnZhbHVlXG4gICAgaWYgKGNvbXBhcmVFeGNsdWRlcyhhdHRyaWJ1dGVWYWx1ZSwgb3B0aW9ucy5leGNsdWRlc1thdHRyaWJ1dGVOYW1lXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZyBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgcGF0aCwgcGFyZW50KSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBjb25zdCBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpXG4gIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHBhdGgudW5zaGlmdCh0YWdOYW1lKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogW2NoZWNrQ2hpbGQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIHNlbGVjdG9yKSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChjaGlsZHJlbltpXSA9PT0gZWxlbWVudCkge1xuICAgICAgcGF0aC51bnNoaWZ0KGA+ICR7c2VsZWN0b3J9Om50aC1jaGlsZCgke2krMX0pYClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFtjb21wYXJlRXhjbHVkZXMgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgdmFsdWUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtOdWxsfFN0cmluZ3xBcnJheX0gZXhjbHVkZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVFeGNsdWRlcyAodmFsdWUsIGV4Y2x1ZGVzKSB7XG4gIGlmICghZXhjbHVkZXMpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gZXhjbHVkZXMuc29tZSgoZXhjbHVkZSkgPT4gZXhjbHVkZS50ZXN0KHZhbHVlKSlcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
