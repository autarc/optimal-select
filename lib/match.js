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
    if (checkId(element, path)) break;
    if (checkClassGlobal(element, path)) break;
    if (checkAttributeGlobal(element, path, options)) break;
    if (checkTagGlobal(element, path)) break;

    // local
    checkClassLocal(element, path);

    // define only one selector each iteration
    if (path.length === length) {
      checkAttributeLocal(element, path, options);
    }
    if (path.length === length) {
      checkTagLocal(element, path);
    }

    if (path.length === length) {
      checkClassChild(element, path);
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
function checkClassGlobal(element, path) {
  return checkClass(element, path, document);
}

/**
 * [checkClassLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassLocal(element, path) {
  return checkClass(element, path, element.parentNode);
}

/**
 * [checkClassChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @return {Boolean}             - [description]
 */
function checkClassChild(element, path) {
  var className = element.className;
  if (!className) {
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
    if (['id', 'class'].concat(options.excludes).indexOf(attributeName) > -1) {
      return false;
    }
    var attributeValue = attribute.value;
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
function checkClass(element, path, parent) {
  var className = element.className;
  if (!className) {
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
    if (['id', 'class'].concat(options.excludes).indexOf(attributeName) > -1) {
      return false;
    }
    var attributeValue = attribute.value;
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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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LENBQUE7Q0FDYjs7Ozs7Ozs7O0FBQUEsQUFTRCxTQUFTLFVBQVUsQ0FBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM1QyxNQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFBO0FBQy9CLE1BQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUE7QUFDOUIsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMvQyxRQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLEVBQUU7QUFDM0IsVUFBSSxDQUFDLE9BQU8sUUFBTSxRQUFRLG9CQUFjLENBQUMsR0FBQyxDQUFDLENBQUEsT0FBSSxDQUFBO0FBQy9DLGFBQU8sSUFBSSxDQUFBO0tBQ1o7R0FDRjtBQUNELFNBQU8sS0FBSyxDQUFBO0NBQ2IiLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZXMgc2VsZWN0b3JcbiAqL1xuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBwYXRoID0gW11cbiAgdmFyIGVsZW1lbnQgPSBub2RlXG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aFxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSBkb2N1bWVudCkge1xuICAgIC8vIGdsb2JhbFxuICAgIGlmIChjaGVja0lkKGVsZW1lbnQsIHBhdGgpKSBicmVha1xuICAgIGlmIChjaGVja0NsYXNzR2xvYmFsKGVsZW1lbnQsIHBhdGgpKSBicmVha1xuICAgIGlmIChjaGVja0F0dHJpYnV0ZUdsb2JhbChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSkgYnJlYWtcbiAgICBpZiAoY2hlY2tUYWdHbG9iYWwoZWxlbWVudCwgcGF0aCkpIGJyZWFrXG5cbiAgICAvLyBsb2NhbFxuICAgIGNoZWNrQ2xhc3NMb2NhbChlbGVtZW50LCBwYXRoKVxuXG4gICAgLy8gZGVmaW5lIG9ubHkgb25lIHNlbGVjdG9yIGVhY2ggaXRlcmF0aW9uXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrQXR0cmlidXRlTG9jYWwoZWxlbWVudCwgcGF0aCwgb3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrVGFnTG9jYWwoZWxlbWVudCwgcGF0aClcbiAgICB9XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tDbGFzc0NoaWxkKGVsZW1lbnQsIHBhdGgpXG4gICAgfVxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja0F0dHJpYnV0ZUNoaWxkKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpXG4gICAgfVxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja1RhZ0NoaWxkKGVsZW1lbnQsIHBhdGgpXG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gZG9jdW1lbnQpIHtcbiAgICBwYXRoLnVuc2hpZnQoJyonKVxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpXG59XG5cblxuLyoqXG4gKiBbY2hlY2tDbGFzc0dsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzc0dsb2JhbCAoZWxlbWVudCwgcGF0aCkge1xuICByZXR1cm4gY2hlY2tDbGFzcyhlbGVtZW50LCBwYXRoLCBkb2N1bWVudClcbn1cblxuLyoqXG4gKiBbY2hlY2tDbGFzc0xvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NsYXNzTG9jYWwgKGVsZW1lbnQsIHBhdGgpIHtcbiAgcmV0dXJuIGNoZWNrQ2xhc3MoZWxlbWVudCwgcGF0aCwgZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG4vKipcbiAqIFtjaGVja0NsYXNzQ2hpbGQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3NDaGlsZCAoZWxlbWVudCwgcGF0aCkge1xuICB2YXIgY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWVcbiAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCBgLiR7Y2xhc3NOYW1lLnJlcGxhY2UoLyAvZywgJy4nKX1gKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUdsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZUdsb2JhbCAoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykge1xuICByZXR1cm4gY2hlY2tBdHRyaWJ1dGUoZWxlbWVudCwgcGF0aCwgZG9jdW1lbnQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogW2NoZWNrQXR0cmlidXRlTG9jYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVMb2NhbCAoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykge1xuICByZXR1cm4gY2hlY2tBdHRyaWJ1dGUoZWxlbWVudCwgcGF0aCwgZWxlbWVudC5wYXJlbnROb2RlLCBvcHRpb25zKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUNoaWxkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvbWUoKGtleSkgPT4ge1xuICAgIHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICB2YXIgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgaWYgKFsnaWQnLCAnY2xhc3MnXS5jb25jYXQob3B0aW9ucy5leGNsdWRlcykuaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlLnZhbHVlXG4gICAgdmFyIHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCBwYXR0ZXJuLCBvcHRpb25zKVxuICB9KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZ0dsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWdHbG9iYWwgKGVsZW1lbnQsIHBhdGgpIHtcbiAgcmV0dXJuIGNoZWNrVGFnKGVsZW1lbnQsIHBhdGgsIGRvY3VtZW50KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZ0xvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZ0xvY2FsIChlbGVtZW50LCBwYXRoKSB7XG4gIHJldHVybiBjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBlbGVtZW50LnBhcmVudE5vZGUpXG59XG5cbi8qKlxuICogW2NoZWNrVGFiQ2hpbGRyZW4gZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnQ2hpbGQgKGVsZW1lbnQsIHBhdGgpIHtcbiAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpXG59XG5cbi8qKlxuICogW2NoZWNrSWQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWQgKGVsZW1lbnQsIHBhdGgpIHtcbiAgY29uc3QgaWQgPSBlbGVtZW50LmlkXG4gIGlmICghaWQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBwYXRoLnVuc2hpZnQoYCMke2lkfWApXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogW2NoZWNrQ2xhc3MgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzcyAoZWxlbWVudCwgcGF0aCwgcGFyZW50KSB7XG4gIHZhciBjbGFzc05hbWUgPSBlbGVtZW50LmNsYXNzTmFtZVxuICBpZiAoIWNsYXNzTmFtZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHZhciBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVxuICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICBwYXRoLnVuc2hpZnQoYC4ke2NsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZSBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChlbGVtZW50LCBwYXRoLCBwYXJlbnQsIG9wdGlvbnMpIHtcbiAgdmFyIGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvbWUoKGtleSkgPT4ge1xuICAgIHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICB2YXIgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgaWYgKFsnaWQnLCAnY2xhc3MnXS5jb25jYXQob3B0aW9ucy5leGNsdWRlcykuaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlLnZhbHVlXG4gICAgdmFyIHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICB2YXIgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZyBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgcGF0aCwgcGFyZW50KSB7XG4gIHZhciB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgdmFyIG1hdGNoZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSlcbiAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgcGF0aC51bnNoaWZ0KHRhZ05hbWUpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY2hlY2tDaGlsZCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICBzZWxlY3RvciAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDaGlsZCAoZWxlbWVudCwgcGF0aCwgc2VsZWN0b3IpIHtcbiAgdmFyIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICB2YXIgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoY2hpbGRyZW5baV0gPT09IGVsZW1lbnQpIHtcbiAgICAgIHBhdGgudW5zaGlmdChgPiAke3NlbGVjdG9yfTpudGgtY2hpbGQoJHtpKzF9KWApXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
