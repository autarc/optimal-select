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
  var className = element.getAttribute('class');
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
  var className = element.getAttribute('class');
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
//# sourceMappingURL=data:application/json;base64,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QUFSLENBRDZCO0FBRTVDLE1BQU0sV0FBVyxPQUFPLFFBQVAsQ0FGMkI7QUFHNUMsT0FBSyxJQUFJLElBQUksQ0FBSixFQUFPLElBQUksU0FBUyxNQUFULEVBQWlCLElBQUksQ0FBSixFQUFPLEdBQTVDLEVBQWlEO0FBQy9DLFFBQUksU0FBUyxDQUFULE1BQWdCLE9BQWhCLEVBQXlCO0FBQzNCLFdBQUssT0FBTCxRQUFrQiw0QkFBc0IsSUFBRSxDQUFGLE9BQXhDLEVBRDJCO0FBRTNCLGFBQU8sSUFBUCxDQUYyQjtLQUE3QjtHQURGO0FBTUEsU0FBTyxLQUFQLENBVDRDO0NBQTlDOzs7Ozs7OztBQWtCQSxTQUFTLGVBQVQsQ0FBMEIsS0FBMUIsRUFBaUMsUUFBakMsRUFBMkM7QUFDekMsTUFBSSxDQUFDLFFBQUQsRUFBVztBQUNiLFdBQU8sS0FBUCxDQURhO0dBQWY7QUFHQSxTQUFPLFNBQVMsSUFBVCxDQUFjLFVBQUMsT0FBRDtXQUFhLFFBQVEsSUFBUixDQUFhLEtBQWI7R0FBYixDQUFyQixDQUp5QztDQUEzQyIsImZpbGUiOiJtYXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBNYXRjaFxuICpcbiAqIFJldHJpZXZlcyBzZWxlY3RvclxuICovXG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIG9mIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoIChub2RlLCBvcHRpb25zKSB7XG4gIGNvbnN0IHBhdGggPSBbXVxuICB2YXIgZWxlbWVudCA9IG5vZGVcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IGRvY3VtZW50KSB7XG4gICAgLy8gZ2xvYmFsXG4gICAgaWYgKGNoZWNrSWQoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykpIGJyZWFrXG4gICAgaWYgKGNoZWNrQ2xhc3NHbG9iYWwoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykpIGJyZWFrXG4gICAgaWYgKGNoZWNrQXR0cmlidXRlR2xvYmFsKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpKSBicmVha1xuICAgIGlmIChjaGVja1RhZ0dsb2JhbChlbGVtZW50LCBwYXRoKSkgYnJlYWtcblxuICAgIC8vIGxvY2FsXG4gICAgY2hlY2tDbGFzc0xvY2FsKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpXG5cbiAgICAvLyBkZWZpbmUgb25seSBvbmUgc2VsZWN0b3IgZWFjaCBpdGVyYXRpb25cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tBdHRyaWJ1dGVMb2NhbChlbGVtZW50LCBwYXRoLCBvcHRpb25zKVxuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tUYWdMb2NhbChlbGVtZW50LCBwYXRoKVxuICAgIH1cblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja0NsYXNzQ2hpbGQoZWxlbWVudCwgcGF0aCwgb3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrQXR0cmlidXRlQ2hpbGQoZWxlbWVudCwgcGF0aCwgb3B0aW9ucylcbiAgICB9XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrVGFnQ2hpbGQoZWxlbWVudCwgcGF0aClcbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbGVtZW50ID09PSBkb2N1bWVudCkge1xuICAgIHBhdGgudW5zaGlmdCgnKicpXG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJylcbn1cblxuXG4vKipcbiAqIFtjaGVja0NsYXNzR2xvYmFsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NsYXNzR2xvYmFsIChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSB7XG4gIHJldHVybiBjaGVja0NsYXNzKGVsZW1lbnQsIHBhdGgsIGRvY3VtZW50LCBvcHRpb25zKVxufVxuXG4vKipcbiAqIFtjaGVja0NsYXNzTG9jYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3NMb2NhbCAoZWxlbWVudCwgcGF0aCwgb3B0aW9ucykge1xuICByZXR1cm4gY2hlY2tDbGFzcyhlbGVtZW50LCBwYXRoLCBlbGVtZW50LnBhcmVudE5vZGUsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogW2NoZWNrQ2xhc3NDaGlsZCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzc0NoaWxkIChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gIGlmICghY2xhc3NOYW1lIHx8IGNvbXBhcmVFeGNsdWRlcyhjbGFzc05hbWUsIG9wdGlvbnMuZXhjbHVkZXMuY2xhc3MpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgYC4ke2NsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YClcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGVHbG9iYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVHbG9iYWwgKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNoZWNrQXR0cmlidXRlKGVsZW1lbnQsIHBhdGgsIGRvY3VtZW50LCBvcHRpb25zKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUxvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlTG9jYWwgKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNoZWNrQXR0cmlidXRlKGVsZW1lbnQsIHBhdGgsIGVsZW1lbnQucGFyZW50Tm9kZSwgb3B0aW9ucylcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGVDaGlsZCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZUNoaWxkIChlbGVtZW50LCBwYXRoLCBvcHRpb25zKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvbWUoKGtleSkgPT4ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgIGNvbnN0ICBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgIC8vIGluY2x1ZGUgJ2lkJywgJ2NsYXNzJyBjaGVjayA/XG4gICAgLy8gaWYgKFsnaWQnLCAnY2xhc3MnXS5jb25jYXQob3B0aW9ucy5leGNsdWRlcykuaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xKSB7XG4gICAgLy8gICByZXR1cm4gZmFsc2VcbiAgICAvLyB9XG4gICAgaWYgKGNvbXBhcmVFeGNsdWRlcyhhdHRyaWJ1dGVWYWx1ZSwgb3B0aW9ucy5leGNsdWRlc1thdHRyaWJ1dGVOYW1lXSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG4gICAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgcGF0dGVybiwgb3B0aW9ucylcbiAgfSlcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWdHbG9iYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnR2xvYmFsIChlbGVtZW50LCBwYXRoKSB7XG4gIHJldHVybiBjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBkb2N1bWVudClcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWdMb2NhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWdMb2NhbCAoZWxlbWVudCwgcGF0aCkge1xuICByZXR1cm4gY2hlY2tUYWcoZWxlbWVudCwgcGF0aCwgZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG4vKipcbiAqIFtjaGVja1RhYkNoaWxkcmVuIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZ0NoaWxkIChlbGVtZW50LCBwYXRoKSB7XG4gIHJldHVybiBjaGVja0NoaWxkKGVsZW1lbnQsIHBhdGgsIGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpKVxufVxuXG4vKipcbiAqIFtjaGVja0lkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lkIChlbGVtZW50LCBwYXRoKSB7XG4gIGNvbnN0IGlkID0gZWxlbWVudC5pZFxuICBpZiAoIWlkKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcGF0aC51bnNoaWZ0KGAjJHtpZH1gKVxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFtjaGVja0NsYXNzIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3MgKGVsZW1lbnQsIHBhdGgsIHBhcmVudCwgb3B0aW9ucykge1xuICBjb25zdCBjbGFzc05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKVxuICBpZiAoIWNsYXNzTmFtZSB8fCBjb21wYXJlRXhjbHVkZXMoY2xhc3NOYW1lLCBvcHRpb25zLmV4Y2x1ZGVzLmNsYXNzKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpXG4gIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHBhdGgudW5zaGlmdChgLiR7Y2xhc3NOYW1lLnJlcGxhY2UoLyAvZywgJy4nKX1gKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogW2NoZWNrQXR0cmlidXRlIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGUgKGVsZW1lbnQsIHBhdGgsIHBhcmVudCwgb3B0aW9ucykge1xuICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5zb21lKChrZXkpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgIGlmIChjb21wYXJlRXhjbHVkZXMoYXR0cmlidXRlVmFsdWUsIG9wdGlvbnMuZXhjbHVkZXNbYXR0cmlidXRlTmFtZV0pKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgcGF0dGVybiA9IGBbJHthdHRyaWJ1dGVOYW1lfT1cIiR7YXR0cmlidXRlVmFsdWV9XCJdYFxuICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWcgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIHBhdGgsIHBhcmVudCkge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lKVxuICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICBwYXRoLnVuc2hpZnQodGFnTmFtZSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFtjaGVja0NoaWxkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NoaWxkIChlbGVtZW50LCBwYXRoLCBzZWxlY3Rvcikge1xuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoY2hpbGRyZW5baV0gPT09IGVsZW1lbnQpIHtcbiAgICAgIHBhdGgudW5zaGlmdChgPiAke3NlbGVjdG9yfTpudGgtY2hpbGQoJHtpKzF9KWApXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY29tcGFyZUV4Y2x1ZGVzIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgIHZhbHVlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7TnVsbHxTdHJpbmd8QXJyYXl9IGV4Y2x1ZGVzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjb21wYXJlRXhjbHVkZXMgKHZhbHVlLCBleGNsdWRlcykge1xuICBpZiAoIWV4Y2x1ZGVzKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGV4Y2x1ZGVzLnNvbWUoKGV4Y2x1ZGUpID0+IGV4Y2x1ZGUudGVzdCh2YWx1ZSkpXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
