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

var defaultIgnore = {
  attribute: function attribute(attributeName) {
    return ['style', 'data-reactid', 'data-react-checksum'].indexOf(attributeName) > -1;
  }
};

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

  var _options$ignore = options.ignore;
  var ignore = _options$ignore === undefined ? {} : _options$ignore;


  while (element !== document) {
    // global
    if (checkId(element, path, ignore)) break;
    if (checkClassGlobal(element, path, ignore)) break;
    if (checkAttributeGlobal(element, path, ignore)) break;
    if (checkTagGlobal(element, path, ignore)) break;

    // local
    checkClassLocal(element, path, ignore);

    // define only one selector each iteration
    if (path.length === length) {
      checkAttributeLocal(element, path, ignore);
    }
    if (path.length === length) {
      checkTagLocal(element, path, ignore);
    }

    if (path.length === length) {
      checkClassChild(element, path, ignore);
    }
    if (path.length === length) {
      checkAttributeChild(element, path, ignore);
    }
    if (path.length === length) {
      checkTagChild(element, path, ignore);
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
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkClassGlobal(element, path, ignore) {
  return checkClass(element, path, ignore, document);
}

/**
 * [checkClassLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkClassLocal(element, path, ignore) {
  return checkClass(element, path, ignore, element.parentNode);
}

/**
 * [checkClassChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkClassChild(element, path, ignore) {
  var className = element.getAttribute('class');
  if (checkIgnore(ignore.class, className)) {
    return false;
  }
  return checkChild(element, path, '.' + className.trim().replace(/\s+/g, '.'));
}

/**
 * [checkAttributeGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeGlobal(element, path, ignore) {
  return checkAttribute(element, path, ignore, document);
}

/**
 * [checkAttributeLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeLocal(element, path, ignore) {
  return checkAttribute(element, path, ignore, element.parentNode);
}

/**
 * [checkAttributeChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeChild(element, path, ignore) {
  var attributes = element.attributes;
  return Object.keys(attributes).some(function (key) {
    var attribute = attributes[key];
    var attributeName = attribute.name;
    var attributeValue = attribute.value;
    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
      return false;
    }
    var pattern = '[' + attributeName + '="' + attributeValue + '"]';
    return checkChild(element, path, pattern);
  });
}

/**
 * [checkTagGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTagGlobal(element, path, ignore) {
  return checkTag(element, path, ignore, document);
}

/**
 * [checkTagLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTagLocal(element, path, ignore) {
  return checkTag(element, path, ignore, element.parentNode);
}

/**
 * [checkTabChildren description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTagChild(element, path, ignore) {
  var tagName = element.tagName.toLowerCase();
  if (checkIgnore(ignore.tag, tagName)) {
    return false;
  }
  return checkChild(element, path, tagName);
}

/**
 * [checkId description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkId(element, path, ignore) {
  var id = element.id;
  if (checkIgnore(ignore.id, id)) {
    return false;
  }
  path.unshift('#' + id);
  return true;
}

/**
 * [checkClass description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkClass(element, path, ignore, parent) {
  var className = element.getAttribute('class');
  if (checkIgnore(ignore.class, className)) {
    return false;
  }
  var matches = parent.getElementsByClassName(className);
  if (matches.length === 1) {
    path.unshift('.' + className.trim().replace(/\s+/g, '.'));
    return true;
  }
  return false;
}

/**
 * [checkAttribute description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttribute(element, path, ignore, parent) {
  var attributes = element.attributes;
  return Object.keys(attributes).some(function (key) {
    var attribute = attributes[key];
    var attributeName = attribute.name;
    var attributeValue = attribute.value;
    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
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
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTag(element, path, ignore, parent) {
  var tagName = element.tagName.toLowerCase();
  if (checkIgnore(ignore.tag, tagName)) {
    return false;
  }
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
 * [checkIgnore description]
 * @param  {Function} predicate        [description]
 * @param  {string}   name             [description]
 * @param  {string}   value            [description]
 * @param  {Function} defaultPredicate [description]
 * @return {boolean}                   [description]
 */
function checkIgnore(predicate, name, value, defaultPredicate) {
  if (!name) {
    return true;
  }
  var check = predicate || defaultPredicate;
  if (!check) {
    return false;
  }
  return check(name, value, defaultPredicate);
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QWIsQ0FKZ0Q7QUFLOUQsTUFBSSxDQUFDLEtBQUQsRUFBUTtBQUNWLFdBQU8sS0FBUCxDQURVO0dBQVo7QUFHQSxTQUFPLE1BQU0sSUFBTixFQUFZLEtBQVosRUFBbUIsZ0JBQW5CLENBQVAsQ0FSOEQ7Q0FBaEUiLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZXMgc2VsZWN0b3JcbiAqL1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBwYXRoID0gW11cbiAgdmFyIGVsZW1lbnQgPSBub2RlXG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aFxuXG4gIGNvbnN0IHsgaWdub3JlID0ge30gfSA9IG9wdGlvbnNcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gZG9jdW1lbnQpIHtcbiAgICAvLyBnbG9iYWxcbiAgICBpZiAoY2hlY2tJZChlbGVtZW50LCBwYXRoLCBpZ25vcmUpKSBicmVha1xuICAgIGlmIChjaGVja0NsYXNzR2xvYmFsKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkpIGJyZWFrXG4gICAgaWYgKGNoZWNrQXR0cmlidXRlR2xvYmFsKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkpIGJyZWFrXG4gICAgaWYgKGNoZWNrVGFnR2xvYmFsKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkpIGJyZWFrXG5cbiAgICAvLyBsb2NhbFxuICAgIGNoZWNrQ2xhc3NMb2NhbChlbGVtZW50LCBwYXRoLCBpZ25vcmUpXG5cbiAgICAvLyBkZWZpbmUgb25seSBvbmUgc2VsZWN0b3IgZWFjaCBpdGVyYXRpb25cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tBdHRyaWJ1dGVMb2NhbChlbGVtZW50LCBwYXRoLCBpZ25vcmUpXG4gICAgfVxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja1RhZ0xvY2FsKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSlcbiAgICB9XG5cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tDbGFzc0NoaWxkKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSlcbiAgICB9XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrQXR0cmlidXRlQ2hpbGQoZWxlbWVudCwgcGF0aCwgaWdub3JlKVxuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tUYWdDaGlsZChlbGVtZW50LCBwYXRoLCBpZ25vcmUpXG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gZG9jdW1lbnQpIHtcbiAgICBwYXRoLnVuc2hpZnQoJyonKVxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpXG59XG5cblxuLyoqXG4gKiBbY2hlY2tDbGFzc0dsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NsYXNzR2xvYmFsIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgcmV0dXJuIGNoZWNrQ2xhc3MoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBkb2N1bWVudClcbn1cblxuLyoqXG4gKiBbY2hlY2tDbGFzc0xvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3NMb2NhbCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIHJldHVybiBjaGVja0NsYXNzKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG4vKipcbiAqIFtjaGVja0NsYXNzQ2hpbGQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzc0NoaWxkIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgY29uc3QgY2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS5jbGFzcywgY2xhc3NOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVja0NoaWxkKGVsZW1lbnQsIHBhdGgsIGAuJHtjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJy4nKX1gKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUdsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZUdsb2JhbCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIHJldHVybiBjaGVja0F0dHJpYnV0ZShlbGVtZW50LCBwYXRoLCBpZ25vcmUsIGRvY3VtZW50KVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUxvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlTG9jYWwgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICByZXR1cm4gY2hlY2tBdHRyaWJ1dGUoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBlbGVtZW50LnBhcmVudE5vZGUpXG59XG5cbi8qKlxuICogW2NoZWNrQXR0cmlidXRlQ2hpbGQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVDaGlsZCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvbWUoKGtleSkgPT4ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlLnZhbHVlXG4gICAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS5hdHRyaWJ1dGUsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlLCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG4gICAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgcGF0dGVybilcbiAgfSlcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWdHbG9iYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWdHbG9iYWwgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICByZXR1cm4gY2hlY2tUYWcoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBkb2N1bWVudClcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWdMb2NhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZ0xvY2FsIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgcmV0dXJuIGNoZWNrVGFnKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG4vKipcbiAqIFtjaGVja1RhYkNoaWxkcmVuIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS50YWcsIHRhZ05hbWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgdGFnTmFtZSlcbn1cblxuLyoqXG4gKiBbY2hlY2tJZCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lkIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgY29uc3QgaWQgPSBlbGVtZW50LmlkXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUuaWQsIGlkKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHBhdGgudW5zaGlmdChgIyR7aWR9YClcbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBbY2hlY2tDbGFzcyBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3MgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgcGFyZW50KSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUuY2xhc3MsIGNsYXNzTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVxuICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICBwYXRoLnVuc2hpZnQoYC4ke2NsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnLicpfWApXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGUgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBwYXJlbnQpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuc29tZSgoa2V5KSA9PiB7XG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGUudmFsdWVcbiAgICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLmF0dHJpYnV0ZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogW2NoZWNrVGFnIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgcGFyZW50KSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpXG4gIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHBhdGgudW5zaGlmdCh0YWdOYW1lKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogW2NoZWNrQ2hpbGQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIHNlbGVjdG9yKSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChjaGlsZHJlbltpXSA9PT0gZWxlbWVudCkge1xuICAgICAgcGF0aC51bnNoaWZ0KGA+ICR7c2VsZWN0b3J9Om50aC1jaGlsZCgke2krMX0pYClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFtjaGVja0lnbm9yZSBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBwcmVkaWNhdGUgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICBuYW1lICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkZWZhdWx0UHJlZGljYXRlIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZ25vcmUgKHByZWRpY2F0ZSwgbmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
