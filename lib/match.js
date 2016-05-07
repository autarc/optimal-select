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


  var ignoreClass = false;
  Object.keys(ignore).forEach(function (type) {
    if (type === 'class') {
      ignoreClass = true;
    }
    var predicate = ignore[type];
    if (typeof predicate === 'function') return;
    if (typeof predicate === 'number') {
      predicate = predicate.toString();
    }
    if (typeof predicate === 'string') {
      predicate = new RegExp(predicate);
    }
    // check class-/attributename for regex
    ignore[type] = predicate.test.bind(predicate);
  });
  if (ignoreClass) {
    (function () {
      var ignoreAttribute = ignore.attribute;
      ignore.attribute = function (name, value, defaultPredicate) {
        return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate);
      };
    })();
  }

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
  var id = element.getAttribute('id');
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
 * Note: childTags is a custom property to use a view filter for tags on for virutal elements
 * @param  {HTMLElement} element  - [description]
 * @param  {Array}       path     - [description]
 * @param  {String}      selector - [description]
 * @return {Boolean}              - [description]
 */
function checkChild(element, path, selector) {
  var parent = element.parentNode;
  var children = parent.childTags || parent.children;
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
//# sourceMappingURL=data:application/json;base64,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LEVBQWlEO0FBQy9DLFFBQUksU0FBUyxDQUFULE1BQWdCLE9BQXBCLEVBQTZCO0FBQzNCLFdBQUssT0FBTCxRQUFrQixRQUFsQixvQkFBd0MsSUFBRSxDQUExQztBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7Ozs7Ozs7OztBQVVELFNBQVMsV0FBVCxDQUFzQixTQUF0QixFQUFpQyxJQUFqQyxFQUF1QyxLQUF2QyxFQUE4QyxnQkFBOUMsRUFBZ0U7QUFDOUQsTUFBSSxDQUFDLElBQUwsRUFBVztBQUNULFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBTSxRQUFRLGFBQWEsZ0JBQTNCO0FBQ0EsTUFBSSxDQUFDLEtBQUwsRUFBWTtBQUNWLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBTyxNQUFNLElBQU4sRUFBWSxLQUFaLEVBQW1CLGdCQUFuQixDQUFQO0FBQ0QiLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZXMgc2VsZWN0b3JcbiAqL1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBwYXRoID0gW11cbiAgdmFyIGVsZW1lbnQgPSBub2RlXG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aFxuXG4gIGNvbnN0IHsgaWdub3JlID0ge30gfSA9IG9wdGlvbnNcblxuICB2YXIgaWdub3JlQ2xhc3MgPSBmYWxzZVxuICBPYmplY3Qua2V5cyhpZ25vcmUpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICBpZiAodHlwZSA9PT0gJ2NsYXNzJykge1xuICAgICAgaWdub3JlQ2xhc3MgPSB0cnVlXG4gICAgfVxuICAgIHZhciBwcmVkaWNhdGUgPSBpZ25vcmVbdHlwZV1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHByZWRpY2F0ZSA9IG5ldyBSZWdFeHAocHJlZGljYXRlKVxuICAgIH1cbiAgICAvLyBjaGVjayBjbGFzcy0vYXR0cmlidXRlbmFtZSBmb3IgcmVnZXhcbiAgICBpZ25vcmVbdHlwZV0gPSBwcmVkaWNhdGUudGVzdC5iaW5kKHByZWRpY2F0ZSlcbiAgfSlcbiAgaWYgKGlnbm9yZUNsYXNzKSB7XG4gICAgY29uc3QgaWdub3JlQXR0cmlidXRlID0gaWdub3JlLmF0dHJpYnV0ZVxuICAgIGlnbm9yZS5hdHRyaWJ1dGUgPSAobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpID0+IHtcbiAgICAgIHJldHVybiBpZ25vcmUuY2xhc3ModmFsdWUpIHx8IGlnbm9yZUF0dHJpYnV0ZSAmJiBpZ25vcmVBdHRyaWJ1dGUobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IGRvY3VtZW50KSB7XG4gICAgLy8gZ2xvYmFsXG4gICAgaWYgKGNoZWNrSWQoZWxlbWVudCwgcGF0aCwgaWdub3JlKSkgYnJlYWtcbiAgICBpZiAoY2hlY2tDbGFzc0dsb2JhbChlbGVtZW50LCBwYXRoLCBpZ25vcmUpKSBicmVha1xuICAgIGlmIChjaGVja0F0dHJpYnV0ZUdsb2JhbChlbGVtZW50LCBwYXRoLCBpZ25vcmUpKSBicmVha1xuICAgIGlmIChjaGVja1RhZ0dsb2JhbChlbGVtZW50LCBwYXRoLCBpZ25vcmUpKSBicmVha1xuXG4gICAgLy8gbG9jYWxcbiAgICBjaGVja0NsYXNzTG9jYWwoZWxlbWVudCwgcGF0aCwgaWdub3JlKVxuXG4gICAgLy8gZGVmaW5lIG9ubHkgb25lIHNlbGVjdG9yIGVhY2ggaXRlcmF0aW9uXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrQXR0cmlidXRlTG9jYWwoZWxlbWVudCwgcGF0aCwgaWdub3JlKVxuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tUYWdMb2NhbChlbGVtZW50LCBwYXRoLCBpZ25vcmUpXG4gICAgfVxuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrQ2xhc3NDaGlsZChlbGVtZW50LCBwYXRoLCBpZ25vcmUpXG4gICAgfVxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja0F0dHJpYnV0ZUNoaWxkKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSlcbiAgICB9XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrVGFnQ2hpbGQoZWxlbWVudCwgcGF0aCwgaWdub3JlKVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IGRvY3VtZW50KSB7XG4gICAgcGF0aC51bnNoaWZ0KCcqJylcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKVxufVxuXG5cbi8qKlxuICogW2NoZWNrQ2xhc3NHbG9iYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzc0dsb2JhbCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIHJldHVybiBjaGVja0NsYXNzKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgZG9jdW1lbnQpXG59XG5cbi8qKlxuICogW2NoZWNrQ2xhc3NMb2NhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NsYXNzTG9jYWwgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICByZXR1cm4gY2hlY2tDbGFzcyhlbGVtZW50LCBwYXRoLCBpZ25vcmUsIGVsZW1lbnQucGFyZW50Tm9kZSlcbn1cblxuLyoqXG4gKiBbY2hlY2tDbGFzc0NoaWxkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3NDaGlsZCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUuY2xhc3MsIGNsYXNzTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCBgLiR7Y2xhc3NOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcuJyl9YClcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGVHbG9iYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVHbG9iYWwgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICByZXR1cm4gY2hlY2tBdHRyaWJ1dGUoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBkb2N1bWVudClcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGVMb2NhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZUxvY2FsIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgcmV0dXJuIGNoZWNrQXR0cmlidXRlKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgZWxlbWVudC5wYXJlbnROb2RlKVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZUNoaWxkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5zb21lKChrZXkpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgIGlmIChjaGVja0lnbm9yZShpZ25vcmUuYXR0cmlidXRlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgZGVmYXVsdElnbm9yZS5hdHRyaWJ1dGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgcGF0dGVybiA9IGBbJHthdHRyaWJ1dGVOYW1lfT1cIiR7YXR0cmlidXRlVmFsdWV9XCJdYFxuICAgIHJldHVybiBjaGVja0NoaWxkKGVsZW1lbnQsIHBhdGgsIHBhdHRlcm4pXG4gIH0pXG59XG5cbi8qKlxuICogW2NoZWNrVGFnR2xvYmFsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnR2xvYmFsIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgcmV0dXJuIGNoZWNrVGFnKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgZG9jdW1lbnQpXG59XG5cbi8qKlxuICogW2NoZWNrVGFnTG9jYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWdMb2NhbCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIHJldHVybiBjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBpZ25vcmUsIGVsZW1lbnQucGFyZW50Tm9kZSlcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWJDaGlsZHJlbiBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZ0NoaWxkIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVja0NoaWxkKGVsZW1lbnQsIHBhdGgsIHRhZ05hbWUpXG59XG5cbi8qKlxuICogW2NoZWNrSWQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIGNvbnN0IGlkID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2lkJylcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS5pZCwgaWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcGF0aC51bnNoaWZ0KGAjJHtpZH1gKVxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFtjaGVja0NsYXNzIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzcyAoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBwYXJlbnQpIHtcbiAgY29uc3QgY2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS5jbGFzcywgY2xhc3NOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpXG4gIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHBhdGgudW5zaGlmdChgLiR7Y2xhc3NOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcuJyl9YClcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFtjaGVja0F0dHJpYnV0ZSBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChlbGVtZW50LCBwYXRoLCBpZ25vcmUsIHBhcmVudCkge1xuICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gIHJldHVybiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5zb21lKChrZXkpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgIGlmIChjaGVja0lnbm9yZShpZ25vcmUuYXR0cmlidXRlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgZGVmYXVsdElnbm9yZS5hdHRyaWJ1dGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgcGF0dGVybiA9IGBbJHthdHRyaWJ1dGVOYW1lfT1cIiR7YXR0cmlidXRlVmFsdWV9XCJdYFxuICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBbY2hlY2tUYWcgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBwYXJlbnQpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSlcbiAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgcGF0aC51bnNoaWZ0KHRhZ05hbWUpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY2hlY2tDaGlsZCBkZXNjcmlwdGlvbl1cbiAqIE5vdGU6IGNoaWxkVGFncyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYSB2aWV3IGZpbHRlciBmb3IgdGFncyBvbiBmb3IgdmlydXRhbCBlbGVtZW50c1xuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NoaWxkIChlbGVtZW50LCBwYXRoLCBzZWxlY3Rvcikge1xuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRUYWdzIHx8IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmIChjaGlsZHJlbltpXSA9PT0gZWxlbWVudCkge1xuICAgICAgcGF0aC51bnNoaWZ0KGA+ICR7c2VsZWN0b3J9Om50aC1jaGlsZCgke2krMX0pYClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIFtjaGVja0lnbm9yZSBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBwcmVkaWNhdGUgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICBuYW1lICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkZWZhdWx0UHJlZGljYXRlIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZ25vcmUgKHByZWRpY2F0ZSwgbmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
