(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["OptimalSelect"] = factory();
	else
		root["OptimalSelect"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelect = getSelect;
exports.getCommonAncestor = getCommonAncestor;
exports.getCommonProperties = getCommonProperties;
/**
 * # Common
 *
 * Process collections for similarities.
 */

/**
 * @typedef {import('./select').Options} Options
 */

/**
 * Query document using correct selector function
 *
 * @param  {Options}              options - [description]
 * @return {(selector: string, parent: HTMLElement) => Array.<HTMLElement>} - [description]
 */
function getSelect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.format === 'jquery') {
    var Sizzle = __webpack_require__(7);
    return function (selector) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return Sizzle(selector, parent || document);
    };
  }
  return function (selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return (parent || document).querySelectorAll(selector);
  };
}

/**
 * Find the last common ancestor of elements
 *
 * @param  {Array.<HTMLElement>} elements  - [description]
 * @return {HTMLElement}                   - [description]
 */
function getCommonAncestor(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$root = options.root,
      root = _options$root === undefined ? document : _options$root;


  var ancestors = [];

  elements.forEach(function (element, index) {
    var parents = [];
    while (element !== root) {
      element = element.parentNode;
      parents.unshift(element);
    }
    ancestors[index] = parents;
  });

  ancestors.sort(function (curr, next) {
    return curr.length - next.length;
  });

  var shallowAncestor = ancestors.shift();

  var ancestor = null;

  var _loop = function _loop() {
    var parent = shallowAncestor[i];
    var missing = ancestors.some(function (otherParents) {
      return !otherParents.some(function (otherParent) {
        return otherParent === parent;
      });
    });

    if (missing) {
      // TODO: find similar sub-parents, not the top root, e.g. sharing a class selector
      return 'break';
    }

    ancestor = parent;
  };

  for (var i = 0, l = shallowAncestor.length; i < l; i++) {
    var _ret = _loop();

    if (_ret === 'break') break;
  }

  return ancestor;
}

/**
 * Get a set of common properties of elements
 *
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Object}                       - [description]
 */
function getCommonProperties(elements) {

  var commonProperties = {
    classes: [],
    attributes: {},
    tag: null
  };

  elements.forEach(function (element) {
    var commonClasses = commonProperties.classes,
        commonAttributes = commonProperties.attributes,
        commonTag = commonProperties.tag;

    // ~ classes

    if (commonClasses !== undefined) {
      var classes = element.getAttribute('class');
      if (classes) {
        classes = classes.trim().split(' ');
        if (!commonClasses.length) {
          commonProperties.classes = classes;
        } else {
          commonClasses = commonClasses.filter(function (entry) {
            return classes.some(function (name) {
              return name === entry;
            });
          });
          if (commonClasses.length) {
            commonProperties.classes = commonClasses;
          } else {
            delete commonProperties.classes;
          }
        }
      } else {
        // TODO: restructure removal as 2x set / 2x delete, instead of modify always replacing with new collection
        delete commonProperties.classes;
      }
    }

    // ~ attributes
    if (commonAttributes !== undefined) {
      var elementAttributes = element.attributes;
      var attributes = Object.keys(elementAttributes).reduce(function (attributes, key) {
        var attribute = elementAttributes[key];
        var attributeName = attribute.name;
        // NOTE: workaround detection for non-standard phantomjs NamedNodeMap behaviour
        // (issue: https://github.com/ariya/phantomjs/issues/14634)
        if (attribute && attributeName !== 'class') {
          attributes[attributeName] = attribute.value;
        }
        return attributes;
      }, {});

      var attributesNames = Object.keys(attributes);
      var commonAttributesNames = Object.keys(commonAttributes);

      if (attributesNames.length) {
        if (!commonAttributesNames.length) {
          commonProperties.attributes = attributes;
        } else {
          commonAttributes = commonAttributesNames.reduce(function (nextCommonAttributes, name) {
            var value = commonAttributes[name];
            if (value === attributes[name]) {
              nextCommonAttributes[name] = value;
            }
            return nextCommonAttributes;
          }, {});
          if (Object.keys(commonAttributes).length) {
            commonProperties.attributes = commonAttributes;
          } else {
            delete commonProperties.attributes;
          }
        }
      } else {
        delete commonProperties.attributes;
      }
    }

    // ~ tag
    if (commonTag !== undefined) {
      var tag = element.tagName.toLowerCase();
      if (!commonTag) {
        commonProperties.tag = tag;
      } else if (tag !== commonTag) {
        delete commonProperties.tag;
      }
    }
  });

  return commonProperties;
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertNodeList = convertNodeList;
exports.escapeValue = escapeValue;
/**
 * # Utilities
 *
 * Convenience helpers.
 */

/**
 * Create an array with the DOM nodes of the list
 *
 * @param  {NodeList}             nodes - [description]
 * @return {Array.<HTMLElement>}        - [description]
 */
function convertNodeList(nodes) {
  var length = nodes.length;

  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = nodes[i];
  }
  return arr;
}

/**
 * Escape special characters and line breaks as a simplified version of 'CSS.escape()'
 *
 * Description of valid characters: https://mathiasbynens.be/notes/css-escapes
 *
 * @param  {String?} value - [description]
 * @return {String}        - [description]
 */
function escapeValue(value) {
  return value && value.replace(/['"`\\/:?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '\xA0');
}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = match;

var _common = __webpack_require__(0);

var _utilities = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * # Match
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * Retrieve selector for a node.
                                                                                                                                                                                                     */

/**
 * @typedef {import('./select').Options} Options
 */

var defaultIgnore = {
  attribute: function attribute(attributeName) {
    return ['style', 'data-reactid', 'data-react-checksum'].indexOf(attributeName) > -1;
  }
};

/**
 * Get the path of the element
 *
 * @param  {HTMLElement} node      - [description]
 * @param  {Options}     [options] - [description]
 * @return {string}                - [description]
 */
function match(node) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$root = options.root,
      root = _options$root === undefined ? document : _options$root,
      _options$skip = options.skip,
      skip = _options$skip === undefined ? null : _options$skip,
      _options$priority = options.priority,
      priority = _options$priority === undefined ? ['id', 'class', 'href', 'src'] : _options$priority,
      _options$ignore = options.ignore,
      ignore = _options$ignore === undefined ? {} : _options$ignore,
      format = options.format;


  var path = [];
  var element = node;
  var length = path.length;
  var jquery = format === 'jquery';
  var select = (0, _common.getSelect)(options);

  var skipCompare = skip && (Array.isArray(skip) ? skip : [skip]).map(function (entry) {
    if (typeof entry !== 'function') {
      return function (element) {
        return element === entry;
      };
    }
    return entry;
  });

  var skipChecks = function skipChecks(element) {
    return skip && skipCompare.some(function (compare) {
      return compare(element);
    });
  };

  Object.keys(ignore).forEach(function (type) {
    var predicate = ignore[type];
    if (typeof predicate === 'function') return;
    if (typeof predicate === 'number') {
      predicate = predicate.toString();
    }
    if (typeof predicate === 'string') {
      predicate = new RegExp((0, _utilities.escapeValue)(predicate).replace(/\\/g, '\\\\'));
    }
    if (typeof predicate === 'boolean') {
      predicate = predicate ? /(?:)/ : /.^/;
    }
    // check class-/attributename for regex
    ignore[type] = function (name, value) {
      return predicate.test(value);
    };
  });

  while (element !== root && element.nodeType !== 11) {
    if (skipChecks(element) !== true) {
      // ~ global
      if (checkAttributes(priority, element, ignore, path, select, root)) break;
      if (checkTag(element, ignore, path, select, root)) break;

      // ~ local
      checkAttributes(priority, element, ignore, path, select);
      if (path.length === length) {
        checkTag(element, ignore, path, select);
      }

      if (jquery && path.length === length) {
        checkContains(priority, element, ignore, path, select);
      }

      // define only one part each iteration
      if (path.length === length) {
        checkChilds(priority, element, ignore, path, select);
      }
    }

    element = element.parentNode;
    length = path.length;
  }

  if (element === root) {
    var pattern = findPattern(priority, element, ignore, select);
    path.unshift(pattern);
  }

  return path.join(' ');
}

/**
 * Extend path with attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @param  {function}       select   - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
function checkAttributes(priority, element, ignore, path, select) {
  var parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : element.parentNode;

  var pattern = findAttributesPattern(priority, element, ignore, select, parent);
  if (pattern) {
    var matches = select(pattern, parent);
    if (matches.length === 1) {
      path.unshift(pattern);
      return true;
    }
  }
  return false;
}

/**
 * Get class selector
 *
 * @param  {Array.<string>} classes - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {string?}                - [description]
 */
function getClassSelector() {
  var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var select = arguments[1];
  var parent = arguments[2];

  var result = [[]];

  classes.forEach(function (c) {
    result.forEach(function (r) {
      result.push(r.concat('.' + c));
    });
  });

  result.shift();

  result = result.sort(function (a, b) {
    return a.length - b.length;
  });

  for (var i = 0; i < result.length; i++) {
    var r = result[i].join('');
    var matches = select(r, parent);
    if (matches.length === 1) {
      return r;
    }
  }

  return null;
}

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {function}       select   - [description]
 * @return {string?}                 - [description]
 */
function findAttributesPattern(priority, element, ignore, select) {
  var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : element.parentNode;

  var attributes = element.attributes;
  var attributeNames = Object.keys(attributes).map(function (val) {
    return attributes[val].name;
  }).filter(function (a) {
    return priority.indexOf(a) < 0;
  });

  var sortedKeys = [].concat(_toConsumableArray(priority), _toConsumableArray(attributeNames));

  var tagName = element.tagName.toLowerCase();

  for (var i = 0, l = sortedKeys.length; i < l; i++) {
    var key = sortedKeys[i];
    var attribute = attributes[key];
    var attributeName = (0, _utilities.escapeValue)(attribute && attribute.name);
    var attributeValue = (0, _utilities.escapeValue)(attribute && attribute.value);
    var useNamedIgnore = attributeName !== 'class';

    var currentIgnore = useNamedIgnore && ignore[attributeName] || ignore.attribute;
    var currentDefaultIgnore = useNamedIgnore && defaultIgnore[attributeName] || defaultIgnore.attribute;
    if (checkIgnore(currentIgnore, attributeName, attributeValue, currentDefaultIgnore)) {
      continue;
    }

    var pattern = '[' + attributeName + '="' + attributeValue + '"]';
    if (!attributeValue.trim()) {
      return null;
    }

    if (attributeName === 'id') {
      pattern = '#' + attributeValue;
    }

    if (attributeName === 'class') {
      var _ret = function () {
        var classNames = attributeValue.trim().split(/\s+/g);
        var classIgnore = ignore.class || defaultIgnore.class;
        if (classIgnore) {
          classNames = classNames.filter(function (className) {
            return !classIgnore(className);
          });
        }
        if (classNames.length === 0) {
          return 'continue';
        }
        pattern = getClassSelector(classNames, select, parent);

        if (!pattern) {
          return 'continue';
        }
      }();

      if (_ret === 'continue') continue;
    }

    return tagName + pattern;
  }
  return null;
}

/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkTag(element, ignore, path, select) {
  var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : element.parentNode;

  var pattern = findTagPattern(element, ignore);
  if (pattern) {
    var matches = [];
    matches = select(pattern, parent);
    if (matches.length === 1) {
      path.unshift(pattern);
      if (pattern === 'iframe') {
        return false;
      }
      return true;
    }
  }
  return false;
}

/**
 * Lookup tag identifier
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      ignore  - [description]
 * @return {boolean}             - [description]
 */
function findTagPattern(element, ignore) {
  var tagName = element.tagName.toLowerCase();
  if (checkIgnore(ignore.tag, null, tagName)) {
    return null;
  }
  return tagName;
}

/**
 * Extend path with specific child identifier
 *
 * NOTE: 'childTags' is a custom property to use as a view filter for tags using 'adapter.js'
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @param  {function}       select   - [description]
 * @return {boolean}                 - [description]
 */
function checkChilds(priority, element, ignore, path, select) {
  var parent = element.parentNode;
  var children = parent.childTags || parent.children;
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    if (child === element) {
      var childPattern = findPattern(priority, child, ignore, select);
      if (!childPattern) {
        return console.warn('\n          Element couldn\'t be matched through strict ignore pattern!\n        ', child, ignore, childPattern);
      }
      var pattern = '> ' + childPattern + ':nth-child(' + (i + 1) + ')';
      path.unshift(pattern);
      return true;
    }
  }
  return false;
}

/**
 * Extend path with contains
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<string>} path     - [description]
 * @param  {function}       select   - [description]
 * @return {boolean}                 - [description]
 */
function checkContains(priority, element, ignore, path, select) {
  var elementPattern = findPattern(priority, element, ignore, select);
  var parent = element.parentNode;
  var texts = element.textContent.replace(/\n+/g, '\n').split('\n').map(function (text) {
    return text.trim();
  }).filter(function (text) {
    return text.length > 0;
  });

  var pattern = '> ' + elementPattern;
  var found = texts.some(function (text) {
    pattern = pattern + ':contains("' + text + '")';
    var matches = select(pattern, parent);
    return matches.length === 1;
  });
  if (found) {
    path.unshift(pattern);
    return true;
  }
  return false;
}

/**
 * Lookup identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {function}       select   - [description]
 * @return {string}                  - [description]
 */
function findPattern(priority, element, ignore, select) {
  var pattern = findAttributesPattern(priority, element, ignore, select);
  if (!pattern) {
    pattern = findTagPattern(element, ignore);
  }
  return pattern;
}

/**
 * Validate with custom and default functions
 *
 * @param  {Function} predicate        - [description]
 * @param  {string?}  name             - [description]
 * @param  {string}   value            - [description]
 * @param  {Function} defaultPredicate - [description]
 * @return {boolean}                   - [description]
 */
function checkIgnore(predicate, name, value, defaultPredicate) {
  if (!value) {
    return true;
  }
  var check = predicate || defaultPredicate;
  if (!check) {
    return false;
  }
  return check(name, value, defaultPredicate);
}
module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;

var _adapt = __webpack_require__(4);

var _adapt2 = _interopRequireDefault(_adapt);

var _common = __webpack_require__(0);

var _utilities = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {import('./select').Options} Options
 */

/**
 * Apply different optimization techniques
 *
 * @param  {string}                          selector   - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element    - [description]
 * @param  {Options}                         [options]  - [description]
 * @return {string}                                     - [description]
 */
function optimize(selector, elements) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  if (selector.startsWith('> ')) {
    selector = selector.replace('> ', '');
  }

  // convert single entry and NodeList
  if (!Array.isArray(elements)) {
    elements = !elements.length ? [elements] : (0, _utilities.convertNodeList)(elements);
  }

  if (!elements.length || elements.some(function (element) {
    return element.nodeType !== 1;
  })) {
    throw new Error('Invalid input - to compare HTMLElements its necessary to provide a reference of the selected node(s)! (missing "elements")');
  }

  var globalModified = (0, _adapt2.default)(elements[0], options);
  var select = (0, _common.getSelect)(options);

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729, https://stackoverflow.com/a/16261693)
  // var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/)
  var path = selector.replace(/> /g, '>').match(/(?:[^\s"]+|"[^"]*")+/g);

  if (path.length < 2) {
    return optimizePart('', selector, '', elements, select);
  }

  var endOptimized = false;
  if (/>/.test(path[path.length - 1])) {
    path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', elements, select);
    endOptimized = true;
  }

  var shortened = [path.pop()];

  var _loop = function _loop() {
    var current = path.pop();
    var prePart = path.join(' ');
    var postPart = shortened.join(' ');

    var pattern = prePart + ' ' + postPart;
    var matches = select(pattern);
    var hasSameResult = matches.length === elements.length && elements.every(function (element, i) {
      return element === matches[i];
    });
    if (!hasSameResult) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements, select));
    }
  };

  while (path.length > 1) {
    _loop();
  }
  shortened.unshift(path[0]);
  path = shortened;

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), elements, select);
  if (!endOptimized) {
    path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', elements, select);
  }

  if (globalModified) {
    delete true;
  }

  return path.join(' ').replace(/>/g, '> ').trim();
}

/**
 * Improve a chunk of the selector
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {string}                       - [description]
 */
/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

function optimizePart(prePart, current, postPart, elements, select) {
  if (prePart.length) prePart = prePart + ' ';
  if (postPart.length) postPart = ' ' + postPart;

  // optimize contains
  if (/:contains\(/.test(current) && postPart.length) {
    var firstIndex = current.indexOf(':');
    var containsIndex = current.lastIndexOf(':contains(');
    var optimized = current.slice(0, containsIndex);
    while (containsIndex > firstIndex && compareResults(select('' + prePart + optimized + postPart), elements)) {
      current = optimized;
      containsIndex = current.lastIndexOf(':contains(');
      optimized = current.slice(0, containsIndex);
    }
  }

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    var key = current.replace(/=.*$/, ']');
    var pattern = '' + prePart + key + postPart;
    var matches = select(pattern);
    if (compareResults(matches, elements)) {
      current = key;
    } else {
      // robustness: replace specific key-value with base tag (heuristic)
      var references = select('' + prePart + key);

      var _loop2 = function _loop2() {
        var reference = references[i];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          var description = reference.tagName.toLowerCase();
          pattern2 = '' + prePart + description + postPart;
          matches2 = select(pattern2);

          if (compareResults(matches2, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i = 0, l = references.length; i < l; i++) {
        var pattern2;
        var matches2;

        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
      }
    }
  }

  // robustness: descendant instead child (heuristic)
  if (/>/.test(current)) {
    var descendant = current.replace(/>/, '');
    var pattern3 = '' + prePart + descendant + postPart;
    var matches3 = select(pattern3);
    if (compareResults(matches3, elements)) {
      current = descendant;
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    var type = current.replace(/nth-child/g, 'nth-of-type');
    var pattern4 = '' + prePart + type + postPart;
    var matches4 = select(pattern4);
    if (compareResults(matches4, elements)) {
      current = type;
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/^\.\S*[^\s\\]\.\S+/.test(current)) {
    var names = current.trim().replace(/(^|[^\\])\./g, '$1#.') // escape actual dots
    .split('#.') // split only on actual dots
    .slice(1).map(function (name) {
      return '.' + name;
    }).sort(function (curr, next) {
      return curr.length - next.length;
    });
    while (names.length) {
      var partial = current.replace(names.shift(), '').trim();
      var pattern5 = ('' + prePart + partial + postPart).trim();
      if (!pattern5.length || pattern5.charAt(0) === '>' || pattern5.charAt(pattern5.length - 1) === '>') {
        break;
      }
      var matches5 = select(pattern5);
      if (compareResults(matches5, elements)) {
        current = partial;
      }
    }

    // robustness: degrade complex classname (heuristic)
    names = current && current.match(/\./g);
    if (names && names.length > 2) {
      var _references = select('' + prePart + current);

      var _loop3 = function _loop3() {
        var reference = _references[i2];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          // TODO:
          // - check using attributes + regard excludes
          var description = reference.tagName.toLowerCase();
          pattern6 = '' + prePart + description + postPart;
          matches6 = select(pattern6);

          if (compareResults(matches6, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i2 = 0, l2 = _references.length; i2 < l2; i2++) {
        var pattern6;
        var matches6;

        var _ret3 = _loop3();

        if (_ret3 === 'break') break;
      }
    }
  }

  return current;
}

/**
 * Evaluate matches with expected elements
 *
 * @param  {Array.<HTMLElement>} matches  - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Boolean}                      - [description]
 */
function compareResults(matches, elements) {
  var length = matches.length;

  return length === elements.length && elements.every(function (element) {
    for (var i = 0; i < length; i++) {
      if (matches[i] === element) {
        return true;
      }
    }
    return false;
  });
}
module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = adapt;
/**
 * # Adapt
 *
 * Check and extend the environment for universal usage.
 */

/**
 * @typedef {import('./select').Options} Options
 */

/**
 * Modify the context based on the environment
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Options}     options - [description]
 * @return {boolean}             - [description]
 */
function adapt(element, options) {
  // detect environment setup
  if (true) {
    return false;
  } else {
    global.document = options.context || function () {
      var root = element;
      while (root.parent) {
        root = root.parent;
      }
      return root;
    }();
  }

  // https://github.com/fb55/domhandler/blob/master/index.js#L75
  var ElementPrototype = Object.getPrototypeOf(true);

  // alternative descriptor to access elements with filtering invalid elements (e.g. textnodes)
  if (!Object.getOwnPropertyDescriptor(ElementPrototype, 'childTags')) {
    Object.defineProperty(ElementPrototype, 'childTags', {
      enumerable: true,
      get: function get() {
        return this.children.filter(function (node) {
          // https://github.com/fb55/domelementtype/blob/master/index.js#L12
          return node.type === 'tag' || node.type === 'script' || node.type === 'style';
        });
      }
    });
  }

  if (!Object.getOwnPropertyDescriptor(ElementPrototype, 'attributes')) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
    Object.defineProperty(ElementPrototype, 'attributes', {
      enumerable: true,
      get: function get() {
        var attribs = this.attribs;

        var attributesNames = Object.keys(attribs);
        var NamedNodeMap = attributesNames.reduce(function (attributes, attributeName, index) {
          attributes[index] = {
            name: attributeName,
            value: attribs[attributeName]
          };
          return attributes;
        }, {});
        Object.defineProperty(NamedNodeMap, 'length', {
          enumerable: false,
          configurable: false,
          value: attributesNames.length
        });
        return NamedNodeMap;
      }
    });
  }

  if (!ElementPrototype.getAttribute) {
    // https://docs.webplatform.org/wiki/dom/Element/getAttribute
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
    ElementPrototype.getAttribute = function (name) {
      return this.attribs[name] || null;
    };
  }

  if (!ElementPrototype.getElementsByTagName) {
    // https://docs.webplatform.org/wiki/dom/Document/getElementsByTagName
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
    ElementPrototype.getElementsByTagName = function (tagName) {
      var HTMLCollection = [];
      traverseDescendants(this.childTags, function (descendant) {
        if (descendant.name === tagName || tagName === '*') {
          HTMLCollection.push(descendant);
        }
      });
      return HTMLCollection;
    };
  }

  if (!ElementPrototype.getElementsByClassName) {
    // https://docs.webplatform.org/wiki/dom/Document/getElementsByClassName
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
    ElementPrototype.getElementsByClassName = function (className) {
      var names = className.trim().replace(/\s+/g, ' ').split(' ');
      var HTMLCollection = [];
      traverseDescendants([this], function (descendant) {
        var descendantClassName = descendant.attribs.class;
        if (descendantClassName && names.every(function (name) {
          return descendantClassName.indexOf(name) > -1;
        })) {
          HTMLCollection.push(descendant);
        }
      });
      return HTMLCollection;
    };
  }

  if (!ElementPrototype.querySelectorAll) {
    // https://docs.webplatform.org/wiki/css/selectors_api/querySelectorAll
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
    ElementPrototype.querySelectorAll = function (selectors) {
      var _this = this;

      selectors = selectors.replace(/(>)(\S)/g, '$1 $2').trim(); // add space for '>' selector

      // using right to left execution => https://github.com/fb55/css-select#how-does-it-work
      var instructions = getInstructions(selectors);
      var discover = instructions.shift();

      var total = instructions.length;
      return discover(this).filter(function (node) {
        var step = 0;
        while (step < total) {
          node = instructions[step](node, _this);
          if (!node) {
            // hierarchy doesn't match
            return false;
          }
          step += 1;
        }
        return true;
      });
    };
  }

  if (!ElementPrototype.contains) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
    ElementPrototype.contains = function (element) {
      var inclusive = false;
      traverseDescendants([this], function (descendant, done) {
        if (descendant === element) {
          inclusive = true;
          done();
        }
      });
      return inclusive;
    };
  }

  return true;
}

/**
 * Retrieve transformation steps
 *
 * @param  {Array.<string>}   selectors - [description]
 * @return {Array.<Function>}           - [description]
 */
function getInstructions(selectors) {
  return selectors.split(' ').reverse().map(function (selector, step) {
    var discover = step === 0;

    var _selector$split = selector.split(':'),
        _selector$split2 = _slicedToArray(_selector$split, 2),
        type = _selector$split2[0],
        pseudo = _selector$split2[1];

    var validate = null;
    var instruction = null;

    switch (true) {

      // child: '>'
      case />/.test(type):
        instruction = function checkParent(node) {
          return function (validate) {
            return validate(node.parent) && node.parent;
          };
        };
        break;

      // class: '.'
      case /^\./.test(type):
        {
          var names = type.substr(1).split('.');
          validate = function validate(node) {
            var nodeClassName = node.attribs.class;
            return nodeClassName && names.every(function (name) {
              return nodeClassName.indexOf(name) > -1;
            });
          };
          instruction = function checkClass(node, root) {
            if (discover) {
              return node.getElementsByClassName(names.join(' '));
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;
        }

      // attribute: '[key="value"]'
      case /^\[/.test(type):
        {
          var _type$replace$split = type.replace(/\[|\]|"/g, '').split('='),
              _type$replace$split2 = _slicedToArray(_type$replace$split, 2),
              attributeKey = _type$replace$split2[0],
              attributeValue = _type$replace$split2[1];

          validate = function validate(node) {
            var hasAttribute = Object.keys(node.attribs).indexOf(attributeKey) > -1;
            if (hasAttribute) {
              // regard optional attributeValue
              if (!attributeValue || node.attribs[attributeKey] === attributeValue) {
                return true;
              }
            }
            return false;
          };
          instruction = function checkAttribute(node, root) {
            if (discover) {
              var NodeList = [];
              traverseDescendants([node], function (descendant) {
                if (validate(descendant)) {
                  NodeList.push(descendant);
                }
              });
              return NodeList;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;
        }

      // id: '#'
      case /^#/.test(type):
        {
          var id = type.substr(1);
          validate = function validate(node) {
            return node.attribs.id === id;
          };
          instruction = function checkId(node, root) {
            if (discover) {
              var NodeList = [];
              traverseDescendants([node], function (descendant, done) {
                if (validate(descendant)) {
                  NodeList.push(descendant);
                  done();
                }
              });
              return NodeList;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;
        }

      // universal: '*'
      case /\*/.test(type):
        {
          validate = function validate() {
            return true;
          };
          instruction = function checkUniversal(node, root) {
            if (discover) {
              var NodeList = [];
              traverseDescendants([node], function (descendant) {
                return NodeList.push(descendant);
              });
              return NodeList;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;
        }

      // tag: '...'
      default:
        validate = function validate(node) {
          return node.name === type;
        };
        instruction = function checkTag(node, root) {
          if (discover) {
            var NodeList = [];
            traverseDescendants([node], function (descendant) {
              if (validate(descendant)) {
                NodeList.push(descendant);
              }
            });
            return NodeList;
          }
          return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
        };
    }

    if (!pseudo) {
      return instruction;
    }

    var rule = pseudo.match(/-(child|type)\((\d+)\)$/);
    var kind = rule[1];
    var index = parseInt(rule[2], 10) - 1;

    var validatePseudo = function validatePseudo(node) {
      if (node) {
        var compareSet = node.parent.childTags;
        if (kind === 'type') {
          compareSet = compareSet.filter(validate);
        }
        var nodeIndex = compareSet.findIndex(function (child) {
          return child === node;
        });
        if (nodeIndex === index) {
          return true;
        }
      }
      return false;
    };

    return function enhanceInstruction(node) {
      var match = instruction(node);
      if (discover) {
        return match.reduce(function (NodeList, matchedNode) {
          if (validatePseudo(matchedNode)) {
            NodeList.push(matchedNode);
          }
          return NodeList;
        }, []);
      }
      return validatePseudo(match) && match;
    };
  });
}

/**
 * Walking recursive to invoke callbacks
 *
 * @param {Array.<HTMLElement>} nodes   - [description]
 * @param {Function}            handler - [description]
 */
function traverseDescendants(nodes, handler) {
  nodes.forEach(function (node) {
    var progress = true;
    handler(node, function () {
      return progress = false;
    });
    if (node.childTags && progress) {
      traverseDescendants(node.childTags, handler);
    }
  });
}

/**
 * Bubble up from bottom to top
 *
 * @param  {HTMLElement} node     - [description]
 * @param  {HTMLElement} root     - [description]
 * @param  {Function}    validate - [description]
 * @return {HTMLElement}          - [description]
 */
function getAncestor(node, root, validate) {
  while (node.parent) {
    node = node.parent;
    if (validate(node)) {
      return node;
    }
    if (node === root) {
      break;
    }
  }
  return null;
}
module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


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

var _css2xpath = __webpack_require__(6);

var _css2xpath2 = _interopRequireDefault(_css2xpath);

var _adapt = __webpack_require__(4);

var _adapt2 = _interopRequireDefault(_adapt);

var _match = __webpack_require__(2);

var _match2 = _interopRequireDefault(_match);

var _optimize = __webpack_require__(3);

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = __webpack_require__(1);

var _common = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef  {Object} Options
 * @property {HTMLElement} [root]                     Optionally specify the root element
 * @property {function | Array.<HTMLElement>} [skip]  Specify elements to skip
 * @property {Array.<string>} [priority]              Order of attribute processing
 * @property {Object<string, function | number | string | boolean} [ignore] Define patterns which shouldn't be included
 * @property {('css'|'xpath'|'jquery')} [format]      Output format    
 */

/**
 * Get a selector for the provided element
 *
 * @param  {HTMLElement} element   - [description]
 * @param  {Options}     [options] - [description]
 * @return {string}                - [description]
 */
function getSingleSelector(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (element.nodeType === 3) {
    element = element.parentNode;
  }

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

  if (globalModified) {
    delete true;
  }

  return optimized;
}

/**
 * Get a selector to match multiple descendants from an ancestor
 *
 * @param  {Array.<HTMLElement>|NodeList} elements   - [description]
 * @param  {Options}                      [options]  - [description]
 * @return {string}                                  - [description]
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
  var select = (0, _common.getSelect)(options);

  var ancestor = (0, _common.getCommonAncestor)(elements, options);
  var ancestorSelector = getSingleSelector(ancestor, options);

  // TODO: consider usage of multiple selectors + parent-child relation + check for part redundancy
  var commonSelectors = getCommonSelectors(elements);
  var descendantSelector = commonSelectors[0];

  var selector = (0, _optimize2.default)(ancestorSelector + ' ' + descendantSelector, elements, options);
  var selectorMatches = (0, _utilities.convertNodeList)(select(selector));

  if (!elements.every(function (element) {
    return selectorMatches.some(function (entry) {
      return entry === element;
    });
  })) {
    // TODO: cluster matches to split into similar groups for sub selections
    return console.warn('\n      The selected elements can\'t be efficiently mapped.\n      Its probably best to use multiple single selectors instead!\n    ', elements);
  }

  if (globalModified) {
    delete true;
  }

  return selector;
}

/**
 * Get selectors to describe a set of elements
 *
 * @param  {Array.<HTMLElement>} elements  - [description]
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
 * @param  {HTMLElement|NodeList|Array.<HTMLElement>} input     - [description]
 * @param  {Options}                                  [options] - [description]
 * @return {string}                                             - [description]
 */
function getQuerySelector(input) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (input.length && !input.name) {
    return getMultiSelector(input, options);
  }
  var result = getSingleSelector(input, options);
  if (options && [1, 'xpath'].includes(options.format)) {
    return (0, _css2xpath2.default)(result);
  }

  return result;
}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


(function () {
  var xpath_to_lower = function xpath_to_lower(s) {
    return 'translate(' + (s || 'normalize-space()') + ', \'ABCDEFGHJIKLMNOPQRSTUVWXYZ\'' + ', \'abcdefghjiklmnopqrstuvwxyz\')';
  },
      xpath_ends_with = function xpath_ends_with(s1, s2) {
    return 'substring(' + s1 + ',' + 'string-length(' + s1 + ')-string-length(' + s2 + ')+1)=' + s2;
  },
      xpath_url = function xpath_url(s) {
    return 'substring-before(concat(substring-after(' + (s || xpath_url_attrs) + ',"://"),"?"),"?")';
  },
      xpath_url_path = function xpath_url_path(s) {
    return 'substring-after(' + (s || xpath_url_attrs) + ',"/")';
  },
      xpath_url_domain = function xpath_url_domain(s) {
    return 'substring-before(concat(substring-after(' + (s || xpath_url_attrs) + ',"://"),"/"),"/")';
  },
      xpath_url_attrs = '@href|@src',
      xpath_lower_case = xpath_to_lower(),
      xpath_ns_uri = 'ancestor-or-self::*[last()]/@url',
      xpath_ns_path = xpath_url_path(xpath_url(xpath_ns_uri)),
      xpath_has_protocal = '(starts-with(' + xpath_url_attrs + ',"http://") or starts-with(' + xpath_url_attrs + ',"https://"))',
      xpath_is_internal = 'starts-with(' + xpath_url() + ',' + xpath_url_domain(xpath_ns_uri) + ') or ' + xpath_ends_with(xpath_url_domain(), xpath_url_domain(xpath_ns_uri)),
      xpath_is_local = '(' + xpath_has_protocal + ' and starts-with(' + xpath_url() + ',' + xpath_url(xpath_ns_uri) + '))',
      xpath_is_path = 'starts-with(' + xpath_url_attrs + ',"/")',
      xpath_is_local_path = 'starts-with(' + xpath_url_path() + ',' + xpath_ns_path + ')',
      xpath_normalize_space = 'normalize-space()',
      xpath_internal = '[not(' + xpath_has_protocal + ') or ' + xpath_is_internal + ']',
      xpath_external = '[' + xpath_has_protocal + ' and not(' + xpath_is_internal + ')]',
      escape_literal = String.fromCharCode(30),
      escape_parens = String.fromCharCode(31),
      regex_string_literal = /("[^"\x1E]*"|'[^'\x1E]*'|=\s*[^\s\]\'\"]+)/g,
      regex_escaped_literal = /['"]?(\x1E+)['"]?/g,
      regex_css_wrap_pseudo = /(\x1F\)|[^\)])\:(first|limit|last|gt|lt|eq|nth)([^\-]|$)/,
      regex_specal_chars = /[\x1C-\x1F]+/g,
      regex_first_axis = /^([\s\(\x1F]*)(\.?[^\.\/\(]{1,2}[a-z]*:*)/,
      regex_filter_prefix = /(^|\/|\:)\[/g,
      regex_attr_prefix = /([^\(\[\/\|\s\x1F])\@/g,
      regex_nth_equation = /^([-0-9]*)n.*?([0-9]*)$/,
      css_combinators_regex = /\s*(!?[+>~,^ ])\s*(\.?\/+|[a-z\-]+::)?([a-z\-]+\()?((and\s*|or\s*|mod\s*)?[^+>~,\s'"\]\|\^\$\!\<\=\x1C-\x1F]+)?/g,
      css_combinators_callback = function css_combinators_callback(match, operator, axis, func, literal, exclude, offset, orig) {
    var prefix = ''; // If we can, we'll prefix a '.'

    // XPath operators can look like node-name selectors
    // Detect false positive for " and", " or", " mod"
    if (operator === ' ' && exclude !== undefined) {
      return match;
    }

    if (axis === undefined) {
      // Only allow node-selecting XPath functions
      // Detect false positive for " + count(...)", " count(...)", " > position()", etc.
      if (func !== undefined && func !== 'node(' && func !== 'text(' && func !== 'comment(') {
        return;
      } else if (literal === undefined) {
        literal = func;
      } // Handle case " + text()", " > comment()", etc. where "func" is our "literal"

      // XPath math operators match some CSS combinators
      // Detect false positive for " + 1", " > 1", etc.
      if (isNumeric(literal)) {
        return match;
      }

      var prevChar = orig.charAt(offset - 1);

      if (prevChar.length === 0 || prevChar === '(' || prevChar === '|' || prevChar === ':') {
        prefix = '.';
      }
    }

    // Return if we don't have a selector to follow the axis
    if (literal === undefined) {
      if (offset + match.length === orig.length) {
        literal = '*';
      } else {
        return match;
      }
    }

    switch (operator) {
      case ' ':
        return '//' + literal;
      case '>':
        return '/' + literal;
      case '+':
        return prefix + '/following-sibling::*[1]/self::' + literal;
      case '~':
        return prefix + '/following-sibling::' + literal;
      case ',':
        if (axis === undefined) {}
        axis = './/';
        return '|' + axis + literal;
      case '^':
        // first child
        return '/child::*[1]/self::' + literal;
      case '!^':
        // last child
        return '/child::*[last()]/self::' + literal;
      case '! ':
        // ancestor-or-self
        return '/ancestor-or-self::' + literal;
      case '!>':
        // direct parent
        return '/parent::' + literal;
      case '!+':
        // adjacent preceding sibling
        return '/preceding-sibling::*[1]/self::' + literal;
      case '!~':
        // preceding sibling
        return '/preceding-sibling::' + literal;
      // case '~~'
      // return '/following-sibling::*/self::|'+selectorStart(orig, offset)+'/preceding-sibling::*/self::'+literal;
    }
  },
      css_attributes_regex = /\[([^\@\|\*\=\^\~\$\!\(\/\s\x1C-\x1F]+)\s*(([\|\*\~\^\$\!]?)=?\s*(\x1E+))?\]/g,
      css_attributes_callback = function css_attributes_callback(str, attr, comp, op, val, offset, orig) {
    var axis = '';
    var prevChar = orig.charAt(offset - 1);

    /*
    if (prevChar === '/' || // found after an axis shortcut ("/", "//", etc.)
        prevChar === ':')   // found after an axis ("self::", "parent::", etc.)
        axis = '*';*/

    switch (op) {
      case '!':
        return axis + '[not(@' + attr + ') or @' + attr + '!="' + val + '"]';
      case '$':
        return axis + '[substring(@' + attr + ',string-length(@' + attr + ')-(string-length("' + val + '")-1))="' + val + '"]';
      case '^':
        return axis + '[starts-with(@' + attr + ',"' + val + '")]';
      case '~':
        return axis + '[contains(concat(" ",normalize-space(@' + attr + ')," "),concat(" ","' + val + '"," "))]';
      case '*':
        return axis + '[contains(@' + attr + ',"' + val + '")]';
      case '|':
        return axis + '[@' + attr + '="' + val + '" or starts-with(@' + attr + ',concat("' + val + '","-"))]';
      default:
        if (comp === undefined) {
          if (attr.charAt(attr.length - 1) === '(' || attr.search(/^[0-9]+$/) !== -1 || attr.indexOf(':') !== -1) {
            return str;
          }
          return axis + '[@' + attr + ']';
        } else {
          return axis + '[@' + attr + '="' + val + '"]';
        }
    }
  },
      css_pseudo_classes_regex = /:([a-z\-]+)(\((\x1F+)(([^\x1F]+(\3\x1F+)?)*)(\3\)))?/g,
      css_pseudo_classes_callback = function css_pseudo_classes_callback(match, name, g1, g2, arg, g3, g4, g5, offset, orig) {
    if (orig.charAt(offset - 1) === ':' && orig.charAt(offset - 2) !== ':') {
      // XPath "axis::node-name" will match
      // Detect false positive ":node-name"
      return match;
    }

    if (name === 'odd' || name === 'even') {
      arg = name;
      name = 'nth-of-type';
    }

    switch (name) {// name.toLowerCase()?
      case 'after':
        return '[count(' + css2xpath('preceding::' + arg, true) + ') > 0]';
      case 'after-sibling':
        return '[count(' + css2xpath('preceding-sibling::' + arg, true) + ') > 0]';
      case 'before':
        return '[count(' + css2xpath('following::' + arg, true) + ') > 0]';
      case 'before-sibling':
        return '[count(' + css2xpath('following-sibling::' + arg, true) + ') > 0]';
      case 'checked':
        return '[@selected or @checked]';
      case 'contains':
        return '[contains(' + xpath_normalize_space + ',' + arg + ')]';
      case 'icontains':
        return '[contains(' + xpath_lower_case + ',' + xpath_to_lower(arg) + ')]';
      case 'empty':
        return '[not(*) and not(normalize-space())]';
      case 'enabled':
      case 'disabled':
        return '[@' + name + ']';
      case 'first-child':
        return '[not(preceding-sibling::*)]';
      case 'first':
      case 'limit':
      case 'first-of-type':
        if (arg !== undefined) {
          return '[position()<=' + arg + ']';
        }
        return '[1]';
      case 'gt':
        // Position starts at 0 for consistency with Sizzle selectors
        return '[position()>' + (parseInt(arg, 10) + 1) + ']';
      case 'lt':
        // Position starts at 0 for consistency with Sizzle selectors
        return '[position()<' + (parseInt(arg, 10) + 1) + ']';
      case 'last-child':
        return '[not(following-sibling::*)]';
      case 'only-child':
        return '[not(preceding-sibling::*) and not(following-sibling::*)]';
      case 'only-of-type':
        return '[not(preceding-sibling::*[name()=name(self::node())]) and not(following-sibling::*[name()=name(self::node())])]';
      case 'nth-child':
        if (isNumeric(arg)) {
          return '[(count(preceding-sibling::*)+1) = ' + arg + ']';
        }
        switch (arg) {
          case 'even':
            return '[(count(preceding-sibling::*)+1) mod 2=0]';
          case 'odd':
            return '[(count(preceding-sibling::*)+1) mod 2=1]';
          default:
            var a = (arg || '0').replace(regex_nth_equation, '$1+$2').split('+');

            a[0] = a[0] || '1';
            a[1] = a[1] || '0';
            return '[(count(preceding-sibling::*)+1)>=' + a[1] + ' and ((count(preceding-sibling::*)+1)-' + a[1] + ') mod ' + a[0] + '=0]';
        }
      case 'nth-of-type':
        if (isNumeric(arg)) {
          return '[' + arg + ']';
        }
        switch (arg) {
          case 'odd':
            return '[position() mod 2=1]';
          case 'even':
            return '[position() mod 2=0 and position()>=0]';
          default:
            var a = (arg || '0').replace(regex_nth_equation, '$1+$2').split('+');

            a[0] = a[0] || '1';
            a[1] = a[1] || '0';
            return '[position()>=' + a[1] + ' and (position()-' + a[1] + ') mod ' + a[0] + '=0]';
        }
      case 'eq':
      case 'nth':
        // Position starts at 0 for consistency with Sizzle selectors
        if (isNumeric(arg)) {
          return '[' + (parseInt(arg, 10) + 1) + ']';
        }

        return '[1]';
      case 'text':
        return '[@type="text"]';
      case 'istarts-with':
        return '[starts-with(' + xpath_lower_case + ',' + xpath_to_lower(arg) + ')]';
      case 'starts-with':
        return '[starts-with(' + xpath_normalize_space + ',' + arg + ')]';
      case 'iends-with':
        return '[' + xpath_ends_with(xpath_lower_case, xpath_to_lower(arg)) + ']';
      case 'ends-with':
        return '[' + xpath_ends_with(xpath_normalize_space, arg) + ']';
      case 'has':
        var xpath = prependAxis(css2xpath(arg, true), './/');

        return '[count(' + xpath + ') > 0]';
      case 'has-sibling':
        var xpath = css2xpath('preceding-sibling::' + arg, true);

        return '[count(' + xpath + ') > 0 or count(following-sibling::' + xpath.substr(19) + ') > 0]';
      case 'has-parent':
        return '[count(' + css2xpath('parent::' + arg, true) + ') > 0]';
      case 'has-ancestor':
        return '[count(' + css2xpath('ancestor::' + arg, true) + ') > 0]';
      case 'last':
      case 'last-of-type':
        if (arg !== undefined) {
          return '[position()>last()-' + arg + ']';
        }
        return '[last()]';
      case 'selected':
        // Sizzle: "(option) elements that are currently selected"
        return '[local-name()="option" and @selected]';
      case 'skip':
      case 'skip-first':
        return '[position()>' + arg + ']';
      case 'skip-last':
        if (arg !== undefined) {
          return '[last()-position()>=' + arg + ']';
        }
        return '[position()<last()]';
      case 'root':
        return '/ancestor::[last()]';
      case 'range':
        var arr = arg.split(',');

        return '[' + arr[0] + '<=position() and position()<=' + arr[1] + ']';
      case 'input':
        // Sizzle: "input, button, select, and textarea are all considered to be input elements."
        return '[local-name()="input" or local-name()="button" or local-name()="select" or local-name()="textarea"]';
      case 'internal':
        return xpath_internal;
      case 'external':
        return xpath_external;
      case 'http':
      case 'https':
      case 'mailto':
      case 'javascript':
        return '[starts-with(@href,concat("' + name + '",":"))]';
      case 'domain':
        return '[(string-length(' + xpath_url_domain() + ')=0 and contains(' + xpath_url_domain(xpath_ns_uri) + ',' + arg + ')) or contains(' + xpath_url_domain() + ',' + arg + ')]';
      case 'path':
        return '[starts-with(' + xpath_url_path() + ',substring-after("' + arg + '","/"))]';
      case 'not':
        var xpath = css2xpath(arg, true);

        if (xpath.charAt(0) === '[') {
          xpath = 'self::node()' + xpath;
        }
        return '[not(' + xpath + ')]';
      case 'target':
        return '[starts-with(@href, "#")]';
      case 'root':
        return 'ancestor-or-self::*[last()]';
      /* case 'active':
      case 'focus':
      case 'hover':
      case 'link':
      case 'visited':
          return '';*/
      case 'lang':
        return '[@lang="' + arg + '"]';
      case 'read-only':
      case 'read-write':
        return '[@' + name.replace('-', '') + ']';
      case 'valid':
      case 'required':
      case 'in-range':
      case 'out-of-range':
        return '[@' + name + ']';
      default:
        return match;
    }
  },
      css_ids_classes_regex = /(#|\.)([^\#\@\.\/\(\[\)\]\|\:\s\+\>\<\'\"\x1D-\x1F]+)/g,
      css_ids_classes_callback = function css_ids_classes_callback(str, op, val, offset, orig) {
    var axis = '';
    /* var prevChar = orig.charAt(offset-1);
    if (prevChar.length === 0 ||
        prevChar === '/' ||
        prevChar === '(')
        axis = '*';
    else if (prevChar === ':')
        axis = 'node()';*/
    if (op === '#') {
      return axis + '[@id="' + val + '"]';
    }
    return axis + '[contains(concat(" ",normalize-space(@class)," ")," ' + val + ' ")]';
  };

  // Prepend descendant-or-self if no other axis is specified
  function prependAxis(s, axis) {
    return s.replace(regex_first_axis, function (match, start, literal) {
      if (literal.substr(literal.length - 2) === '::') // Already has axis::
        {
          return match;
        }

      if (literal.charAt(0) === '[') {
        axis += '*';
      }
      // else if (axis.charAt(axis.length-1) === ')')
      //    axis += '/';
      return start + axis + literal;
    });
  }

  // Find the begining of the selector, starting at i and working backwards
  function selectorStart(s, i) {
    var depth = 0;
    var offset = 0;

    while (i--) {
      switch (s.charAt(i)) {
        case ' ':
        case escape_parens:
          offset++;
          break;
        case '[':
        case '(':
          depth--;

          if (depth < 0) {
            return ++i + offset;
          }
          break;
        case ']':
        case ')':
          depth++;
          break;
        case ',':
        case '|':
          if (depth === 0) {
            return ++i + offset;
          }
        default:
          offset = 0;
      }
    }

    return 0;
  }

  // Check if string is numeric
  function isNumeric(s) {
    var num = parseInt(s, 10);

    return !isNaN(num) && '' + num === s;
  }

  // Append escape "char" to "open" or "close"
  function escapeChar(s, open, close, char) {
    var depth = 0;

    return s.replace(new RegExp('[\\' + open + '\\' + close + ']', 'g'), function (a) {
      if (a === open) {
        depth++;
      }

      if (a === open) {
        return a + repeat(char, depth);
      } else {
        return repeat(char, depth--) + a;
      }
    });
  }

  function repeat(str, num) {
    num = Number(num);
    var result = '';

    while (true) {
      if (num & 1) {
        result += str;
      }
      num >>>= 1;

      if (num <= 0) {
        break;
      }
      str += str;
    }

    return result;
  }

  function convertEscaping(value) {
    return value && value.replace(/\\([`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~])/g, '$1').replace(/\\(['"])/g, '$1$1').replace(/\\A /g, '\n');
  }

  function css2xpath(s, nested) {
    // s = s.trim();

    if (nested === true) {
      // Replace :pseudo-classes
      s = s.replace(css_pseudo_classes_regex, css_pseudo_classes_callback);

      // Replace #ids and .classes
      s = s.replace(css_ids_classes_regex, css_ids_classes_callback);

      return s;
    }

    // Tag open and close parenthesis pairs (for RegExp searches)
    s = escapeChar(s, '(', ')', escape_parens);

    // Remove and save any string literals
    var literals = [];

    s = s.replace(regex_string_literal, function (s, a) {
      if (a.charAt(0) === '=') {
        a = a.substr(1).trim();

        if (isNumeric(a)) {
          return s;
        }
      } else {
        a = a.substr(1, a.length - 2);
      }

      return repeat(escape_literal, literals.push(convertEscaping(a)));
    });

    // Replace CSS combinators (" ", "+", ">", "~", ",") and reverse combinators ("!", "!+", "!>", "!~")
    s = s.replace(css_combinators_regex, css_combinators_callback);

    // Replace CSS attribute filters
    s = s.replace(css_attributes_regex, css_attributes_callback);

    // Wrap certain :pseudo-classes in parens (to collect node-sets)
    while (true) {
      var index = s.search(regex_css_wrap_pseudo);

      if (index === -1) {
        break;
      }
      index = s.indexOf(':', index);
      var start = selectorStart(s, index);

      s = s.substr(0, start) + '(' + s.substring(start, index) + ')' + s.substr(index);
    }

    // Replace :pseudo-classes
    s = s.replace(css_pseudo_classes_regex, css_pseudo_classes_callback);

    // Replace #ids and .classes
    s = s.replace(css_ids_classes_regex, css_ids_classes_callback);

    // Restore the saved string literals
    s = s.replace(regex_escaped_literal, function (s, a) {
      var str = literals[a.length - 1];

      return '"' + str + '"';
    });

    // Remove any special characters
    s = s.replace(regex_specal_chars, '');

    // add * to stand-alone filters
    s = s.replace(regex_filter_prefix, '$1*[');

    // add "/" between @attribute selectors
    s = s.replace(regex_attr_prefix, '$1/@');

    /*
    Combine multiple filters?
     s = escapeChar(s, '[', ']', filter_char);
    s = s.replace(/(\x1D+)\]\[\1(.+?[^\x1D])\1\]/g, ' and ($2)$1]')
    */

    s = prependAxis(s, './/'); // prepend ".//" axis to begining of CSS selector
    return s;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = css2xpath;
  } else {
    window.css2xpath = css2xpath;
  }
})();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
(function (window) {
	var i,
	    support,
	    Expr,
	    getText,
	    isXML,
	    tokenize,
	    compile,
	    select,
	    outermostContext,
	    sortInput,
	    hasDuplicate,


	// Local document vars
	setDocument,
	    document,
	    docElem,
	    documentIsHTML,
	    rbuggyQSA,
	    rbuggyMatches,
	    matches,
	    contains,


	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	    preferredDoc = window.document,
	    dirruns = 0,
	    done = 0,
	    classCache = createCache(),
	    tokenCache = createCache(),
	    compilerCache = createCache(),
	    nonnativeSelectorCache = createCache(),
	    sortOrder = function sortOrder(a, b) {
		if (a === b) {
			hasDuplicate = true;
		}
		return 0;
	},


	// Instance methods
	hasOwn = {}.hasOwnProperty,
	    arr = [],
	    pop = arr.pop,
	    pushNative = arr.push,
	    push = arr.push,
	    slice = arr.slice,


	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function indexOf(list, elem) {
		var i = 0,
		    len = list.length;
		for (; i < len; i++) {
			if (list[i] === elem) {
				return i;
			}
		}
		return -1;
	},
	    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" + "ismap|loop|multiple|open|readonly|required|scoped",


	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",


	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",


	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

	// Operator (capture 2)
	"*([*^$|!~]?=)" + whitespace +

	// "Attribute values must be CSS identifiers [capture 5]
	// or strings [capture 3 or capture 4]"
	"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]",
	    pseudos = ":(" + identifier + ")(?:\\((" +

	// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
	// 1. quoted (capture 3; capture 4 or capture 5)
	"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

	// 2. simple (capture 6)
	"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

	// 3. anything else (capture 2)
	".*" + ")\\)|)",


	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp(whitespace + "+", "g"),
	    rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),
	    rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
	    rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),
	    rdescend = new RegExp(whitespace + "|>"),
	    rpseudo = new RegExp(pseudos),
	    ridentifier = new RegExp("^" + identifier + "$"),
	    matchExpr = {
		"ID": new RegExp("^#(" + identifier + ")"),
		"CLASS": new RegExp("^\\.(" + identifier + ")"),
		"TAG": new RegExp("^(" + identifier + "|[*])"),
		"ATTR": new RegExp("^" + attributes),
		"PSEUDO": new RegExp("^" + pseudos),
		"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
		"bool": new RegExp("^(?:" + booleans + ")$", "i"),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
	},
	    rhtml = /HTML$/i,
	    rinputs = /^(?:input|select|textarea|button)$/i,
	    rheader = /^h\d$/i,
	    rnative = /^[^{]+\{\s*\[native \w/,


	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	    rsibling = /[+~]/,


	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"),
	    funescape = function funescape(escape, nonHex) {
		var high = "0x" + escape.slice(1) - 0x10000;

		return nonHex ?

		// Strip the backslash prefix from a non-hex escape sequence
		nonHex :

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		high < 0 ? String.fromCharCode(high + 0x10000) : String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
	},


	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	    fcssescape = function fcssescape(ch, asCodePoint) {
		if (asCodePoint) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if (ch === "\0") {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},


	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function unloadHandler() {
		setDocument();
	},
	    inDisabledFieldset = addCombinator(function (elem) {
		return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
	}, { dir: "parentNode", next: "legend" });

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);

		// Support: Android<4.0
		// Detect silently failing push.apply
		// eslint-disable-next-line no-unused-expressions
		arr[preferredDoc.childNodes.length].nodeType;
	} catch (e) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function (target, els) {
				pushNative.apply(target, slice.call(els));
			} :

			// Support: IE<9
			// Otherwise append directly
			function (target, els) {
				var j = target.length,
				    i = 0;

				// Can't trust NodeList.length
				while (target[j++] = els[i++]) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle(selector, context, results, seed) {
		var m,
		    i,
		    elem,
		    nid,
		    match,
		    groups,
		    newSelector,
		    newContext = context && context.ownerDocument,


		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if (!seed) {
			setDocument(context);
			context = context || document;

			if (documentIsHTML) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

					// ID selector
					if (m = match[1]) {

						// Document context
						if (nodeType === 9) {
							if (elem = context.getElementById(m)) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (elem.id === m) {
									results.push(elem);
									return results;
								}
							} else {
								return results;
							}

							// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if (newContext && (elem = newContext.getElementById(m)) && contains(context, elem) && elem.id === m) {

								results.push(elem);
								return results;
							}
						}

						// Type selector
					} else if (match[2]) {
						push.apply(results, context.getElementsByTagName(selector));
						return results;

						// Class selector
					} else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {

						push.apply(results, context.getElementsByClassName(m));
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if (support.qsa && !nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector)) && (

				// Support: IE 8 only
				// Exclude object elements
				nodeType !== 1 || context.nodeName.toLowerCase() !== "object")) {

					newSelector = selector;
					newContext = context;

					// qSA considers elements outside a scoping root when evaluating child or
					// descendant combinators, which is not what we want.
					// In such cases, we work around the behavior by prefixing every selector in the
					// list with an ID selector referencing the scope context.
					// The technique has to be used as well when a leading combinator is used
					// as such selectors are not recognized by querySelectorAll.
					// Thanks to Andrew Dupont for this technique.
					if (nodeType === 1 && (rdescend.test(selector) || rcombinators.test(selector))) {

						// Expand context for sibling selectors
						newContext = rsibling.test(selector) && testContext(context.parentNode) || context;

						// We can use :scope instead of the ID hack if the browser
						// supports it & if we're not changing the context.
						if (newContext !== context || !support.scope) {

							// Capture the context ID, setting it first if necessary
							if (nid = context.getAttribute("id")) {
								nid = nid.replace(rcssescape, fcssescape);
							} else {
								context.setAttribute("id", nid = expando);
							}
						}

						// Prefix every selector in the list
						groups = tokenize(selector);
						i = groups.length;
						while (i--) {
							groups[i] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i]);
						}
						newSelector = groups.join(",");
					}

					try {
						push.apply(results, newContext.querySelectorAll(newSelector));
						return results;
					} catch (qsaError) {
						nonnativeSelectorCache(selector, true);
					} finally {
						if (nid === expando) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}

		// All others
		return select(selector.replace(rtrim, "$1"), context, results, seed);
	}

	/**
  * Create key-value caches of limited size
  * @returns {function(string, object)} Returns the Object data after storing it on itself with
  *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
  *	deleting the oldest entry
  */
	function createCache() {
		var keys = [];

		function cache(key, value) {

			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if (keys.push(key + " ") > Expr.cacheLength) {

				// Only keep the most recent entries
				delete cache[keys.shift()];
			}
			return cache[key + " "] = value;
		}
		return cache;
	}

	/**
  * Mark a function for special use by Sizzle
  * @param {Function} fn The function to mark
  */
	function markFunction(fn) {
		fn[expando] = true;
		return fn;
	}

	/**
  * Support testing using an element
  * @param {Function} fn Passed the created element and returns a boolean result
  */
	function assert(fn) {
		var el = document.createElement("fieldset");

		try {
			return !!fn(el);
		} catch (e) {
			return false;
		} finally {

			// Remove from its parent by default
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}

			// release memory in IE
			el = null;
		}
	}

	/**
  * Adds the same handler for all of the specified attrs
  * @param {String} attrs Pipe-separated list of attributes
  * @param {Function} handler The method that will be applied
  */
	function addHandle(attrs, handler) {
		var arr = attrs.split("|"),
		    i = arr.length;

		while (i--) {
			Expr.attrHandle[arr[i]] = handler;
		}
	}

	/**
  * Checks document order of two siblings
  * @param {Element} a
  * @param {Element} b
  * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
  */
	function siblingCheck(a, b) {
		var cur = b && a,
		    diff = cur && a.nodeType === 1 && b.nodeType === 1 && a.sourceIndex - b.sourceIndex;

		// Use IE sourceIndex if available on both nodes
		if (diff) {
			return diff;
		}

		// Check if b follows a
		if (cur) {
			while (cur = cur.nextSibling) {
				if (cur === b) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
  * Returns a function to use in pseudos for input types
  * @param {String} type
  */
	function createInputPseudo(type) {
		return function (elem) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
  * Returns a function to use in pseudos for buttons
  * @param {String} type
  */
	function createButtonPseudo(type) {
		return function (elem) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
  * Returns a function to use in pseudos for :enabled/:disabled
  * @param {Boolean} disabled true for :disabled; false for :enabled
  */
	function createDisabledPseudo(disabled) {

		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function (elem) {

			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ("form" in elem) {

				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if (elem.parentNode && elem.disabled === false) {

					// Option elements defer to a parent optgroup if present
					if ("label" in elem) {
						if ("label" in elem.parentNode) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}

					// Support: IE 6 - 11
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
				}

				return elem.disabled === disabled;

				// Try to winnow out elements that can't be disabled before trusting the disabled property.
				// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
				// even exist on them, let alone have a boolean value.
			} else if ("label" in elem) {
				return elem.disabled === disabled;
			}

			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}

	/**
  * Returns a function to use in pseudos for positionals
  * @param {Function} fn
  */
	function createPositionalPseudo(fn) {
		return markFunction(function (argument) {
			argument = +argument;
			return markFunction(function (seed, matches) {
				var j,
				    matchIndexes = fn([], seed.length, argument),
				    i = matchIndexes.length;

				// Match elements found at the specified indexes
				while (i--) {
					if (seed[j = matchIndexes[i]]) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
  * Checks a node for validity as a Sizzle context
  * @param {Element|Object=} context
  * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
  */
	function testContext(context) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
  * Detects XML nodes
  * @param {Element|Object} elem An element or a document
  * @returns {Boolean} True iff elem is a non-HTML XML node
  */
	isXML = Sizzle.isXML = function (elem) {
		var namespace = elem && elem.namespaceURI,
		    docElem = elem && (elem.ownerDocument || elem).documentElement;

		// Support: IE <=8
		// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
		// https://bugs.jquery.com/ticket/4833
		return !rhtml.test(namespace || docElem && docElem.nodeName || "HTML");
	};

	/**
  * Sets document-related variables once based on the current document
  * @param {Element|Object} [doc] An element or document object to use to set the document
  * @returns {Object} Returns the current document
  */
	setDocument = Sizzle.setDocument = function (node) {
		var hasCompare,
		    subWindow,
		    doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if (doc == document || doc.nodeType !== 9 || !doc.documentElement) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML(document);

		// Support: IE 9 - 11+, Edge 12 - 18+
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if (preferredDoc != document && (subWindow = document.defaultView) && subWindow.top !== subWindow) {

			// Support: IE 11, Edge
			if (subWindow.addEventListener) {
				subWindow.addEventListener("unload", unloadHandler, false);

				// Support: IE 9 - 10 only
			} else if (subWindow.attachEvent) {
				subWindow.attachEvent("onunload", unloadHandler);
			}
		}

		// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
		// Safari 4 - 5 only, Opera <=11.6 - 12.x only
		// IE/Edge & older browsers don't support the :scope pseudo-class.
		// Support: Safari 6.0 only
		// Safari 6.0 supports :scope but it's an alias of :root there.
		support.scope = assert(function (el) {
			docElem.appendChild(el).appendChild(document.createElement("div"));
			return typeof el.querySelectorAll !== "undefined" && !el.querySelectorAll(":scope fieldset div").length;
		});

		/* Attributes
  ---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function (el) {
			el.className = "i";
			return !el.getAttribute("className");
		});

		/* getElement(s)By*
  ---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function (el) {
			el.appendChild(document.createComment(""));
			return !el.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test(document.getElementsByClassName);

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function (el) {
			docElem.appendChild(el).id = expando;
			return !document.getElementsByName || !document.getElementsByName(expando).length;
		});

		// ID filter and find
		if (support.getById) {
			Expr.filter["ID"] = function (id) {
				var attrId = id.replace(runescape, funescape);
				return function (elem) {
					return elem.getAttribute("id") === attrId;
				};
			};
			Expr.find["ID"] = function (id, context) {
				if (typeof context.getElementById !== "undefined" && documentIsHTML) {
					var elem = context.getElementById(id);
					return elem ? [elem] : [];
				}
			};
		} else {
			Expr.filter["ID"] = function (id) {
				var attrId = id.replace(runescape, funescape);
				return function (elem) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};

			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find["ID"] = function (id, context) {
				if (typeof context.getElementById !== "undefined" && documentIsHTML) {
					var node,
					    i,
					    elems,
					    elem = context.getElementById(id);

					if (elem) {

						// Verify the id attribute
						node = elem.getAttributeNode("id");
						if (node && node.value === id) {
							return [elem];
						}

						// Fall back on getElementsByName
						elems = context.getElementsByName(id);
						i = 0;
						while (elem = elems[i++]) {
							node = elem.getAttributeNode("id");
							if (node && node.value === id) {
								return [elem];
							}
						}
					}

					return [];
				}
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ? function (tag, context) {
			if (typeof context.getElementsByTagName !== "undefined") {
				return context.getElementsByTagName(tag);

				// DocumentFragment nodes don't have gEBTN
			} else if (support.qsa) {
				return context.querySelectorAll(tag);
			}
		} : function (tag, context) {
			var elem,
			    tmp = [],
			    i = 0,


			// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
			results = context.getElementsByTagName(tag);

			// Filter out possible comments
			if (tag === "*") {
				while (elem = results[i++]) {
					if (elem.nodeType === 1) {
						tmp.push(elem);
					}
				}

				return tmp;
			}
			return results;
		};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
			if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
				return context.getElementsByClassName(className);
			}
		};

		/* QSA/matchesSelector
  ---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if (support.qsa = rnative.test(document.querySelectorAll)) {

			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function (el) {

				var input;

				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild(el).innerHTML = "<a id='" + expando + "'></a>" + "<select id='" + expando + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if (el.querySelectorAll("[msallowcapture^='']").length) {
					rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if (!el.querySelectorAll("[selected]").length) {
					rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
					rbuggyQSA.push("~=");
				}

				// Support: IE 11+, Edge 15 - 18+
				// IE 11/Edge don't find elements on a `[name='']` query in some cases.
				// Adding a temporary attribute to the document before the selection works
				// around the issue.
				// Interestingly, IE 10 & older don't seem to have the issue.
				input = document.createElement("input");
				input.setAttribute("name", "");
				el.appendChild(input);
				if (!el.querySelectorAll("[name='']").length) {
					rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + "*(?:''|\"\")");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if (!el.querySelectorAll(":checked").length) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if (!el.querySelectorAll("a#" + expando + "+*").length) {
					rbuggyQSA.push(".#.+[+~]");
				}

				// Support: Firefox <=3.6 - 5 only
				// Old Firefox doesn't throw on a badly-escaped identifier.
				el.querySelectorAll("\\\f");
				rbuggyQSA.push("[\\r\\n\\f]");
			});

			assert(function (el) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" + "<select disabled='disabled'><option/></select>";

				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute("type", "hidden");
				el.appendChild(input).setAttribute("name", "D");

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if (el.querySelectorAll("[name=d]").length) {
					rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if (el.querySelectorAll(":enabled").length !== 2) {
					rbuggyQSA.push(":enabled", ":disabled");
				}

				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild(el).disabled = true;
				if (el.querySelectorAll(":disabled").length !== 2) {
					rbuggyQSA.push(":enabled", ":disabled");
				}

				// Support: Opera 10 - 11 only
				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {

			assert(function (el) {

				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call(el, "*");

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call(el, "[s!='']:x");
				rbuggyMatches.push("!=", pseudos);
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
		rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

		/* Contains
  ---------------------------------------------------------------------- */
		hasCompare = rnative.test(docElem.compareDocumentPosition);

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test(docElem.contains) ? function (a, b) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
			    bup = b && b.parentNode;
			return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
		} : function (a, b) {
			if (b) {
				while (b = b.parentNode) {
					if (b === a) {
						return true;
					}
				}
			}
			return false;
		};

		/* Sorting
  ---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ? function (a, b) {

			// Flag for duplicate removal
			if (a === b) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if (compare) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) :

			// Otherwise we know they are disconnected
			1;

			// Disconnected nodes
			if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {

				// Choose the first element that is related to our preferred document
				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if (a == document || a.ownerDocument == preferredDoc && contains(preferredDoc, a)) {
					return -1;
				}

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				if (b == document || b.ownerDocument == preferredDoc && contains(preferredDoc, b)) {
					return 1;
				}

				// Maintain original order
				return sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;
			}

			return compare & 4 ? -1 : 1;
		} : function (a, b) {

			// Exit early if the nodes are identical
			if (a === b) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
			    i = 0,
			    aup = a.parentNode,
			    bup = b.parentNode,
			    ap = [a],
			    bp = [b];

			// Parentless nodes are either documents or disconnected
			if (!aup || !bup) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				/* eslint-disable eqeqeq */
				return a == document ? -1 : b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 : bup ? 1 : sortInput ? indexOf(sortInput, a) - indexOf(sortInput, b) : 0;

				// If the nodes are siblings, we can do a quick check
			} else if (aup === bup) {
				return siblingCheck(a, b);
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while (cur = cur.parentNode) {
				ap.unshift(cur);
			}
			cur = b;
			while (cur = cur.parentNode) {
				bp.unshift(cur);
			}

			// Walk down the tree looking for a discrepancy
			while (ap[i] === bp[i]) {
				i++;
			}

			return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck(ap[i], bp[i]) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[i] == preferredDoc ? -1 : bp[i] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
		};

		return document;
	};

	Sizzle.matches = function (expr, elements) {
		return Sizzle(expr, null, null, elements);
	};

	Sizzle.matchesSelector = function (elem, expr) {
		setDocument(elem);

		if (support.matchesSelector && documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {

			try {
				var ret = matches.call(elem, expr);

				// IE 9's matchesSelector returns false on disconnected nodes
				if (ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11) {
					return ret;
				}
			} catch (e) {
				nonnativeSelectorCache(expr, true);
			}
		}

		return Sizzle(expr, document, null, [elem]).length > 0;
	};

	Sizzle.contains = function (context, elem) {

		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ((context.ownerDocument || context) != document) {
			setDocument(context);
		}
		return contains(context, elem);
	};

	Sizzle.attr = function (elem, name) {

		// Set document vars if needed
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		if ((elem.ownerDocument || elem) != document) {
			setDocument(elem);
		}

		var fn = Expr.attrHandle[name.toLowerCase()],


		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;

		return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
	};

	Sizzle.escape = function (sel) {
		return (sel + "").replace(rcssescape, fcssescape);
	};

	Sizzle.error = function (msg) {
		throw new Error("Syntax error, unrecognized expression: " + msg);
	};

	/**
  * Document sorting and removing duplicates
  * @param {ArrayLike} results
  */
	Sizzle.uniqueSort = function (results) {
		var elem,
		    duplicates = [],
		    j = 0,
		    i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice(0);
		results.sort(sortOrder);

		if (hasDuplicate) {
			while (elem = results[i++]) {
				if (elem === results[i]) {
					j = duplicates.push(i);
				}
			}
			while (j--) {
				results.splice(duplicates[j], 1);
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
  * Utility function for retrieving the text value of an array of DOM nodes
  * @param {Array|Element} elem
  */
	getText = Sizzle.getText = function (elem) {
		var node,
		    ret = "",
		    i = 0,
		    nodeType = elem.nodeType;

		if (!nodeType) {

			// If no nodeType, this is expected to be an array
			while (node = elem[i++]) {

				// Do not traverse comment nodes
				ret += getText(node);
			}
		} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {

			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if (typeof elem.textContent === "string") {
				return elem.textContent;
			} else {

				// Traverse its children
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText(elem);
				}
			}
		} else if (nodeType === 3 || nodeType === 4) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function ATTR(match) {
				match[1] = match[1].replace(runescape, funescape);

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

				if (match[2] === "~=") {
					match[3] = " " + match[3] + " ";
				}

				return match.slice(0, 4);
			},

			"CHILD": function CHILD(match) {

				/* matches from matchExpr["CHILD"]
    	1 type (only|nth|...)
    	2 what (child|of-type)
    	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    	4 xn-component of xn+y argument ([+-]?\d*n|)
    	5 sign of xn-component
    	6 x of xn-component
    	7 sign of y-component
    	8 y of y-component
    */
				match[1] = match[1].toLowerCase();

				if (match[1].slice(0, 3) === "nth") {

					// nth-* requires argument
					if (!match[3]) {
						Sizzle.error(match[0]);
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
					match[5] = +(match[7] + match[8] || match[3] === "odd");

					// other types prohibit arguments
				} else if (match[3]) {
					Sizzle.error(match[0]);
				}

				return match;
			},

			"PSEUDO": function PSEUDO(match) {
				var excess,
				    unquoted = !match[6] && match[2];

				if (matchExpr["CHILD"].test(match[0])) {
					return null;
				}

				// Accept quoted arguments as-is
				if (match[3]) {
					match[2] = match[4] || match[5] || "";

					// Strip excess characters from unquoted arguments
				} else if (unquoted && rpseudo.test(unquoted) && (

				// Get excess from tokenize (recursively)
				excess = tokenize(unquoted, true)) && (

				// advance to the next closing parenthesis
				excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

					// excess is a negative index
					match[0] = match[0].slice(0, excess);
					match[2] = unquoted.slice(0, excess);
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice(0, 3);
			}
		},

		filter: {

			"TAG": function TAG(nodeNameSelector) {
				var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
				return nodeNameSelector === "*" ? function () {
					return true;
				} : function (elem) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
			},

			"CLASS": function CLASS(className) {
				var pattern = classCache[className + " "];

				return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function (elem) {
					return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
				});
			},

			"ATTR": function ATTR(name, operator, check) {
				return function (elem) {
					var result = Sizzle.attr(elem, name);

					if (result == null) {
						return operator === "!=";
					}
					if (!operator) {
						return true;
					}

					result += "";

					/* eslint-disable max-len */

					return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
					/* eslint-enable max-len */
				};
			},

			"CHILD": function CHILD(type, what, _argument, first, last) {
				var simple = type.slice(0, 3) !== "nth",
				    forward = type.slice(-4) !== "last",
				    ofType = what === "of-type";

				return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function (elem) {
					return !!elem.parentNode;
				} : function (elem, _context, xml) {
					var cache,
					    uniqueCache,
					    outerCache,
					    node,
					    nodeIndex,
					    start,
					    dir = simple !== forward ? "nextSibling" : "previousSibling",
					    parent = elem.parentNode,
					    name = ofType && elem.nodeName.toLowerCase(),
					    useCache = !xml && !ofType,
					    diff = false;

					if (parent) {

						// :(first|last|only)-(child|of-type)
						if (simple) {
							while (dir) {
								node = elem;
								while (node = node[dir]) {
									if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [forward ? parent.firstChild : parent.lastChild];

						// non-xml :nth-child(...) stores cache data on `parent`
						if (forward && useCache) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[expando] || (node[expando] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

							cache = uniqueCache[type] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = nodeIndex && cache[2];
							node = nodeIndex && parent.childNodes[nodeIndex];

							while (node = ++nodeIndex && node && node[dir] || (

							// Fallback to seeking `elem` from the start
							diff = nodeIndex = 0) || start.pop()) {

								// When found, cache indexes on `parent` and break
								if (node.nodeType === 1 && ++diff && node === elem) {
									uniqueCache[type] = [dirruns, nodeIndex, diff];
									break;
								}
							}
						} else {

							// Use previously-cached element index if available
							if (useCache) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[expando] || (node[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

								cache = uniqueCache[type] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if (diff === false) {

								// Use the same loop as above to seek `elem` from the start
								while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {

									if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {

										// Cache the index of each encountered element
										if (useCache) {
											outerCache = node[expando] || (node[expando] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[node.uniqueID] || (outerCache[node.uniqueID] = {});

											uniqueCache[type] = [dirruns, diff];
										}

										if (node === elem) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || diff % first === 0 && diff / first >= 0;
					}
				};
			},

			"PSEUDO": function PSEUDO(pseudo, argument) {

				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
				    fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if (fn[expando]) {
					return fn(argument);
				}

				// But maintain support for old signatures
				if (fn.length > 1) {
					args = [pseudo, pseudo, "", argument];
					return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function (seed, matches) {
						var idx,
						    matched = fn(seed, argument),
						    i = matched.length;
						while (i--) {
							idx = indexOf(seed, matched[i]);
							seed[idx] = !(matches[idx] = matched[i]);
						}
					}) : function (elem) {
						return fn(elem, 0, args);
					};
				}

				return fn;
			}
		},

		pseudos: {

			// Potentially complex pseudos
			"not": markFunction(function (selector) {

				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
				    results = [],
				    matcher = compile(selector.replace(rtrim, "$1"));

				return matcher[expando] ? markFunction(function (seed, matches, _context, xml) {
					var elem,
					    unmatched = matcher(seed, null, xml, []),
					    i = seed.length;

					// Match elements unmatched by `matcher`
					while (i--) {
						if (elem = unmatched[i]) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) : function (elem, _context, xml) {
					input[0] = elem;
					matcher(input, null, xml, results);

					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
			}),

			"has": markFunction(function (selector) {
				return function (elem) {
					return Sizzle(selector, elem).length > 0;
				};
			}),

			"contains": markFunction(function (text) {
				text = text.replace(runescape, funescape);
				return function (elem) {
					return (elem.textContent || getText(elem)).indexOf(text) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction(function (lang) {

				// lang value must be a valid identifier
				if (!ridentifier.test(lang || "")) {
					Sizzle.error("unsupported lang: " + lang);
				}
				lang = lang.replace(runescape, funescape).toLowerCase();
				return function (elem) {
					var elemLang;
					do {
						if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
						}
					} while ((elem = elem.parentNode) && elem.nodeType === 1);
					return false;
				};
			}),

			// Miscellaneous
			"target": function target(elem) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice(1) === elem.id;
			},

			"root": function root(elem) {
				return elem === docElem;
			},

			"focus": function focus(elem) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": createDisabledPseudo(false),
			"disabled": createDisabledPseudo(true),

			"checked": function checked(elem) {

				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
			},

			"selected": function selected(elem) {

				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if (elem.parentNode) {
					// eslint-disable-next-line no-unused-expressions
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function empty(elem) {

				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
					if (elem.nodeType < 6) {
						return false;
					}
				}
				return true;
			},

			"parent": function parent(elem) {
				return !Expr.pseudos["empty"](elem);
			},

			// Element/input types
			"header": function header(elem) {
				return rheader.test(elem.nodeName);
			},

			"input": function input(elem) {
				return rinputs.test(elem.nodeName);
			},

			"button": function button(elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function text(elem) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && (

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				(attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
			},

			// Position-in-collection
			"first": createPositionalPseudo(function () {
				return [0];
			}),

			"last": createPositionalPseudo(function (_matchIndexes, length) {
				return [length - 1];
			}),

			"eq": createPositionalPseudo(function (_matchIndexes, length, argument) {
				return [argument < 0 ? argument + length : argument];
			}),

			"even": createPositionalPseudo(function (matchIndexes, length) {
				var i = 0;
				for (; i < length; i += 2) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function (matchIndexes, length) {
				var i = 1;
				for (; i < length; i += 2) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
				var i = argument < 0 ? argument + length : argument > length ? length : argument;
				for (; --i >= 0;) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
				var i = argument < 0 ? argument + length : argument;
				for (; ++i < length;) {
					matchIndexes.push(i);
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
		Expr.pseudos[i] = createInputPseudo(i);
	}
	for (i in { submit: true, reset: true }) {
		Expr.pseudos[i] = createButtonPseudo(i);
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function (selector, parseOnly) {
		var matched,
		    match,
		    tokens,
		    type,
		    soFar,
		    groups,
		    preFilters,
		    cached = tokenCache[selector + " "];

		if (cached) {
			return parseOnly ? 0 : cached.slice(0);
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while (soFar) {

			// Comma and first run
			if (!matched || (match = rcomma.exec(soFar))) {
				if (match) {

					// Don't consume trailing commas as valid
					soFar = soFar.slice(match[0].length) || soFar;
				}
				groups.push(tokens = []);
			}

			matched = false;

			// Combinators
			if (match = rcombinators.exec(soFar)) {
				matched = match.shift();
				tokens.push({
					value: matched,

					// Cast descendant combinators to space
					type: match[0].replace(rtrim, " ")
				});
				soFar = soFar.slice(matched.length);
			}

			// Filters
			for (type in Expr.filter) {
				if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice(matched.length);
				}
			}

			if (!matched) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) :

		// Cache the tokens
		tokenCache(selector, groups).slice(0);
	};

	function toSelector(tokens) {
		var i = 0,
		    len = tokens.length,
		    selector = "";
		for (; i < len; i++) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator(matcher, combinator, base) {
		var dir = combinator.dir,
		    skip = combinator.next,
		    key = skip || dir,
		    checkNonElements = base && key === "parentNode",
		    doneName = done++;

		return combinator.first ?

		// Check against closest ancestor/preceding element
		function (elem, context, xml) {
			while (elem = elem[dir]) {
				if (elem.nodeType === 1 || checkNonElements) {
					return matcher(elem, context, xml);
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function (elem, context, xml) {
			var oldCache,
			    uniqueCache,
			    outerCache,
			    newCache = [dirruns, doneName];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if (xml) {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						if (matcher(elem, context, xml)) {
							return true;
						}
					}
				}
			} else {
				while (elem = elem[dir]) {
					if (elem.nodeType === 1 || checkNonElements) {
						outerCache = elem[expando] || (elem[expando] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

						if (skip && skip === elem.nodeName.toLowerCase()) {
							elem = elem[dir] || elem;
						} else if ((oldCache = uniqueCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {

							// Assign to newCache so results back-propagate to previous elements
							return newCache[2] = oldCache[2];
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[key] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if (newCache[2] = matcher(elem, context, xml)) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
	}

	function elementMatcher(matchers) {
		return matchers.length > 1 ? function (elem, context, xml) {
			var i = matchers.length;
			while (i--) {
				if (!matchers[i](elem, context, xml)) {
					return false;
				}
			}
			return true;
		} : matchers[0];
	}

	function multipleContexts(selector, contexts, results) {
		var i = 0,
		    len = contexts.length;
		for (; i < len; i++) {
			Sizzle(selector, contexts[i], results);
		}
		return results;
	}

	function condense(unmatched, map, filter, context, xml) {
		var elem,
		    newUnmatched = [],
		    i = 0,
		    len = unmatched.length,
		    mapped = map != null;

		for (; i < len; i++) {
			if (elem = unmatched[i]) {
				if (!filter || filter(elem, context, xml)) {
					newUnmatched.push(elem);
					if (mapped) {
						map.push(i);
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
		if (postFilter && !postFilter[expando]) {
			postFilter = setMatcher(postFilter);
		}
		if (postFinder && !postFinder[expando]) {
			postFinder = setMatcher(postFinder, postSelector);
		}
		return markFunction(function (seed, results, context, xml) {
			var temp,
			    i,
			    elem,
			    preMap = [],
			    postMap = [],
			    preexisting = results.length,


			// Get initial elements from seed or context
			elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),


			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems,
			    matcherOut = matcher ?

			// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
			postFinder || (seed ? preFilter : preexisting || postFilter) ?

			// ...intermediate processing is necessary
			[] :

			// ...otherwise use results directly
			results : matcherIn;

			// Find primary matches
			if (matcher) {
				matcher(matcherIn, matcherOut, context, xml);
			}

			// Apply postFilter
			if (postFilter) {
				temp = condense(matcherOut, postMap);
				postFilter(temp, [], context, xml);

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while (i--) {
					if (elem = temp[i]) {
						matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
					}
				}
			}

			if (seed) {
				if (postFinder || preFilter) {
					if (postFinder) {

						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while (i--) {
							if (elem = matcherOut[i]) {

								// Restore matcherIn since elem is not yet a final match
								temp.push(matcherIn[i] = elem);
							}
						}
						postFinder(null, matcherOut = [], temp, xml);
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while (i--) {
						if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

				// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
				if (postFinder) {
					postFinder(null, results, matcherOut, xml);
				} else {
					push.apply(results, matcherOut);
				}
			}
		});
	}

	function matcherFromTokens(tokens) {
		var checkContext,
		    matcher,
		    j,
		    len = tokens.length,
		    leadingRelative = Expr.relative[tokens[0].type],
		    implicitRelative = leadingRelative || Expr.relative[" "],
		    i = leadingRelative ? 1 : 0,


		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator(function (elem) {
			return elem === checkContext;
		}, implicitRelative, true),
		    matchAnyContext = addCombinator(function (elem) {
			return indexOf(checkContext, elem) > -1;
		}, implicitRelative, true),
		    matchers = [function (elem, context, xml) {
			var ret = !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		}];

		for (; i < len; i++) {
			if (matcher = Expr.relative[tokens[i].type]) {
				matchers = [addCombinator(elementMatcher(matchers), matcher)];
			} else {
				matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

				// Return special upon seeing a positional matcher
				if (matcher[expando]) {

					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for (; j < len; j++) {
						if (Expr.relative[tokens[j].type]) {
							break;
						}
					}
					return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
				}
				matchers.push(matcher);
			}
		}

		return elementMatcher(matchers);
	}

	function matcherFromGroupMatchers(elementMatchers, setMatchers) {
		var bySet = setMatchers.length > 0,
		    byElement = elementMatchers.length > 0,
		    superMatcher = function superMatcher(seed, context, xml, results, outermost) {
			var elem,
			    j,
			    matcher,
			    matchedCount = 0,
			    i = "0",
			    unmatched = seed && [],
			    setMatched = [],
			    contextBackup = outermostContext,


			// We must always have either seed elements or outermost context
			elems = seed || byElement && Expr.find["TAG"]("*", outermost),


			// Use integer dirruns iff this is the outermost matcher
			dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1,
			    len = elems.length;

			if (outermost) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for (; i !== len && (elem = elems[i]) != null; i++) {
				if (byElement && elem) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if (!context && elem.ownerDocument != document) {
						setDocument(elem);
						xml = !documentIsHTML;
					}
					while (matcher = elementMatchers[j++]) {
						if (matcher(elem, context || document, xml)) {
							results.push(elem);
							break;
						}
					}
					if (outermost) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if (bySet) {

					// They will have gone through all possible matchers
					if (elem = !matcher && elem) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if (seed) {
						unmatched.push(elem);
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if (bySet && i !== matchedCount) {
				j = 0;
				while (matcher = setMatchers[j++]) {
					matcher(unmatched, setMatched, context, xml);
				}

				if (seed) {

					// Reintegrate element matches to eliminate the need for sorting
					if (matchedCount > 0) {
						while (i--) {
							if (!(unmatched[i] || setMatched[i])) {
								setMatched[i] = pop.call(results);
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense(setMatched);
				}

				// Add matches to results
				push.apply(results, setMatched);

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {

					Sizzle.uniqueSort(results);
				}
			}

			// Override manipulation of globals by nested matchers
			if (outermost) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

		return bySet ? markFunction(superMatcher) : superMatcher;
	}

	compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
		var i,
		    setMatchers = [],
		    elementMatchers = [],
		    cached = compilerCache[selector + " "];

		if (!cached) {

			// Generate a function of recursive functions that can be used to check each element
			if (!match) {
				match = tokenize(selector);
			}
			i = match.length;
			while (i--) {
				cached = matcherFromTokens(match[i]);
				if (cached[expando]) {
					setMatchers.push(cached);
				} else {
					elementMatchers.push(cached);
				}
			}

			// Cache the compiled function
			cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
  * A low-level selection function that works with Sizzle's compiled
  *  selector functions
  * @param {String|Function} selector A selector or a pre-compiled
  *  selector function built with Sizzle.compile
  * @param {Element} context
  * @param {Array} [results]
  * @param {Array} [seed] A set of elements to match against
  */
	select = Sizzle.select = function (selector, context, results, seed) {
		var i,
		    tokens,
		    token,
		    type,
		    find,
		    compiled = typeof selector === "function" && selector,
		    match = !seed && tokenize(selector = compiled.selector || selector);

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if (match.length === 1) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice(0);
			if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {

				context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
				if (!context) {
					return results;

					// Precompiled matchers will still verify ancestry, so step up a level
				} else if (compiled) {
					context = context.parentNode;
				}

				selector = selector.slice(tokens.shift().value.length);
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
			while (i--) {
				token = tokens[i];

				// Abort if we hit a combinator
				if (Expr.relative[type = token.type]) {
					break;
				}
				if (find = Expr.find[type]) {

					// Search, expanding context for leading sibling combinators
					if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice(i, 1);
						selector = seed.length && toSelector(tokens);
						if (!selector) {
							push.apply(results, seed);
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		(compiled || compile(selector, match))(seed, context, !documentIsHTML, results, !context || rsibling.test(selector) && testContext(context.parentNode) || context);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function (el) {

		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition(document.createElement("fieldset")) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if (!assert(function (el) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute("href") === "#";
	})) {
		addHandle("type|href|height|width", function (elem, name, isXML) {
			if (!isXML) {
				return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if (!support.attributes || !assert(function (el) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute("value", "");
		return el.firstChild.getAttribute("value") === "";
	})) {
		addHandle("value", function (elem, _name, isXML) {
			if (!isXML && elem.nodeName.toLowerCase() === "input") {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if (!assert(function (el) {
		return el.getAttribute("disabled") == null;
	})) {
		addHandle(booleans, function (elem, name, isXML) {
			var val;
			if (!isXML) {
				return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
			}
		});
	}

	// EXPOSE
	var _sizzle = window.Sizzle;

	Sizzle.noConflict = function () {
		if (window.Sizzle === Sizzle) {
			window.Sizzle = _sizzle;
		}

		return Sizzle;
	};

	if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return Sizzle;
		}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

		// Sizzle requires that there be a global window in Common-JS like environments
	} else if (typeof module !== "undefined" && module.exports) {
		module.exports = Sizzle;
	} else {
		window.Sizzle = Sizzle;
	}

	// EXPOSE
})(window);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.common = exports.optimize = exports.match = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

var _select = __webpack_require__(5);

Object.defineProperty(exports, 'select', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_select).default;
  }
});
Object.defineProperty(exports, 'getSingleSelector', {
  enumerable: true,
  get: function get() {
    return _select.getSingleSelector;
  }
});
Object.defineProperty(exports, 'getMultiSelector', {
  enumerable: true,
  get: function get() {
    return _select.getMultiSelector;
  }
});

var _match = __webpack_require__(2);

Object.defineProperty(exports, 'match', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_match).default;
  }
});

var _optimize = __webpack_require__(3);

Object.defineProperty(exports, 'optimize', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_optimize).default;
  }
});

var _common2 = __webpack_require__(0);

var _common = _interopRequireWildcard(_common2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.common = _common;

/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4NGI0ZWNhOWE1N2MwMmE3MjRmYiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9vcHRpbWl6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NzczJ4cGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0U2VsZWN0IiwiZ2V0Q29tbW9uQW5jZXN0b3IiLCJnZXRDb21tb25Qcm9wZXJ0aWVzIiwib3B0aW9ucyIsImZvcm1hdCIsIlNpenpsZSIsInJlcXVpcmUiLCJzZWxlY3RvciIsInBhcmVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImVsZW1lbnRzIiwicm9vdCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJsZW5ndGgiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwiaSIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiY29tbW9uUHJvcGVydGllcyIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwiY29tbW9uQ2xhc3NlcyIsImNvbW1vbkF0dHJpYnV0ZXMiLCJjb21tb25UYWciLCJ1bmRlZmluZWQiLCJnZXRBdHRyaWJ1dGUiLCJ0cmltIiwic3BsaXQiLCJmaWx0ZXIiLCJlbnRyeSIsIm5hbWUiLCJlbGVtZW50QXR0cmlidXRlcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJrZXkiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwidmFsdWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnZlcnROb2RlTGlzdCIsImVzY2FwZVZhbHVlIiwibm9kZXMiLCJhcnIiLCJBcnJheSIsInJlcGxhY2UiLCJtYXRjaCIsImRlZmF1bHRJZ25vcmUiLCJpbmRleE9mIiwibm9kZSIsInNraXAiLCJwcmlvcml0eSIsImlnbm9yZSIsInBhdGgiLCJqcXVlcnkiLCJzZWxlY3QiLCJza2lwQ29tcGFyZSIsImlzQXJyYXkiLCJtYXAiLCJza2lwQ2hlY2tzIiwiY29tcGFyZSIsInR5cGUiLCJwcmVkaWNhdGUiLCJ0b1N0cmluZyIsIlJlZ0V4cCIsInRlc3QiLCJub2RlVHlwZSIsImNoZWNrQXR0cmlidXRlcyIsImNoZWNrVGFnIiwiY2hlY2tDb250YWlucyIsImNoZWNrQ2hpbGRzIiwicGF0dGVybiIsImZpbmRQYXR0ZXJuIiwiam9pbiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsIm1hdGNoZXMiLCJnZXRDbGFzc1NlbGVjdG9yIiwicmVzdWx0IiwiYyIsInIiLCJwdXNoIiwiY29uY2F0IiwiYSIsImIiLCJhdHRyaWJ1dGVOYW1lcyIsInZhbCIsInNvcnRlZEtleXMiLCJhdHRyaWJ1dGVWYWx1ZSIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJjbGFzcyIsImNsYXNzTmFtZSIsImZpbmRUYWdQYXR0ZXJuIiwiY2hpbGRyZW4iLCJjaGlsZFRhZ3MiLCJjaGlsZCIsImNoaWxkUGF0dGVybiIsImNvbnNvbGUiLCJ3YXJuIiwiZWxlbWVudFBhdHRlcm4iLCJ0ZXh0cyIsInRleHRDb250ZW50IiwidGV4dCIsImZvdW5kIiwiZGVmYXVsdFByZWRpY2F0ZSIsImNoZWNrIiwib3B0aW1pemUiLCJzdGFydHNXaXRoIiwiRXJyb3IiLCJnbG9iYWxNb2RpZmllZCIsIm9wdGltaXplUGFydCIsImVuZE9wdGltaXplZCIsInNsaWNlIiwic2hvcnRlbmVkIiwicG9wIiwiY3VycmVudCIsInByZVBhcnQiLCJwb3N0UGFydCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsImZpcnN0SW5kZXgiLCJjb250YWluc0luZGV4IiwibGFzdEluZGV4T2YiLCJvcHRpbWl6ZWQiLCJjb21wYXJlUmVzdWx0cyIsInJlZmVyZW5jZXMiLCJyZWZlcmVuY2UiLCJjb250YWlucyIsImRlc2NyaXB0aW9uIiwicGF0dGVybjIiLCJtYXRjaGVzMiIsImRlc2NlbmRhbnQiLCJwYXR0ZXJuMyIsIm1hdGNoZXMzIiwicGF0dGVybjQiLCJtYXRjaGVzNCIsIm5hbWVzIiwicGFydGlhbCIsInBhdHRlcm41IiwiY2hhckF0IiwibWF0Y2hlczUiLCJpMiIsInBhdHRlcm42IiwibWF0Y2hlczYiLCJsMiIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJkZXNjZW5kYW50Q2xhc3NOYW1lIiwic2VsZWN0b3JzIiwiaW5zdHJ1Y3Rpb25zIiwiZ2V0SW5zdHJ1Y3Rpb25zIiwiZGlzY292ZXIiLCJ0b3RhbCIsInN0ZXAiLCJpbmNsdXNpdmUiLCJkb25lIiwicmV2ZXJzZSIsInBzZXVkbyIsInZhbGlkYXRlIiwiaW5zdHJ1Y3Rpb24iLCJjaGVja1BhcmVudCIsInN1YnN0ciIsIm5vZGVDbGFzc05hbWUiLCJjaGVja0NsYXNzIiwiZ2V0QW5jZXN0b3IiLCJhdHRyaWJ1dGVLZXkiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJydWxlIiwia2luZCIsInBhcnNlSW50IiwidmFsaWRhdGVQc2V1ZG8iLCJjb21wYXJlU2V0Iiwibm9kZUluZGV4IiwiZmluZEluZGV4IiwiZW5oYW5jZUluc3RydWN0aW9uIiwibWF0Y2hlZE5vZGUiLCJoYW5kbGVyIiwicHJvZ3Jlc3MiLCJnZXRTaW5nbGVTZWxlY3RvciIsImdldE11bHRpU2VsZWN0b3IiLCJnZXRRdWVyeVNlbGVjdG9yIiwiYW5jZXN0b3JTZWxlY3RvciIsImNvbW1vblNlbGVjdG9ycyIsImdldENvbW1vblNlbGVjdG9ycyIsImRlc2NlbmRhbnRTZWxlY3RvciIsInNlbGVjdG9yTWF0Y2hlcyIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJpbmNsdWRlcyIsInhwYXRoX3RvX2xvd2VyIiwicyIsInhwYXRoX2VuZHNfd2l0aCIsInMxIiwiczIiLCJ4cGF0aF91cmwiLCJ4cGF0aF91cmxfYXR0cnMiLCJ4cGF0aF91cmxfcGF0aCIsInhwYXRoX3VybF9kb21haW4iLCJ4cGF0aF9sb3dlcl9jYXNlIiwieHBhdGhfbnNfdXJpIiwieHBhdGhfbnNfcGF0aCIsInhwYXRoX2hhc19wcm90b2NhbCIsInhwYXRoX2lzX2ludGVybmFsIiwieHBhdGhfaXNfbG9jYWwiLCJ4cGF0aF9pc19wYXRoIiwieHBhdGhfaXNfbG9jYWxfcGF0aCIsInhwYXRoX25vcm1hbGl6ZV9zcGFjZSIsInhwYXRoX2ludGVybmFsIiwieHBhdGhfZXh0ZXJuYWwiLCJlc2NhcGVfbGl0ZXJhbCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImVzY2FwZV9wYXJlbnMiLCJyZWdleF9zdHJpbmdfbGl0ZXJhbCIsInJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCIsInJlZ2V4X2Nzc193cmFwX3BzZXVkbyIsInJlZ2V4X3NwZWNhbF9jaGFycyIsInJlZ2V4X2ZpcnN0X2F4aXMiLCJyZWdleF9maWx0ZXJfcHJlZml4IiwicmVnZXhfYXR0cl9wcmVmaXgiLCJyZWdleF9udGhfZXF1YXRpb24iLCJjc3NfY29tYmluYXRvcnNfcmVnZXgiLCJjc3NfY29tYmluYXRvcnNfY2FsbGJhY2siLCJvcGVyYXRvciIsImF4aXMiLCJmdW5jIiwibGl0ZXJhbCIsImV4Y2x1ZGUiLCJvZmZzZXQiLCJvcmlnIiwicHJlZml4IiwiaXNOdW1lcmljIiwicHJldkNoYXIiLCJjc3NfYXR0cmlidXRlc19yZWdleCIsImNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrIiwic3RyIiwiYXR0ciIsImNvbXAiLCJvcCIsInNlYXJjaCIsImNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCIsImNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayIsImcxIiwiZzIiLCJhcmciLCJnMyIsImc0IiwiZzUiLCJjc3MyeHBhdGgiLCJ4cGF0aCIsInByZXBlbmRBeGlzIiwiY3NzX2lkc19jbGFzc2VzX3JlZ2V4IiwiY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrIiwic3RhcnQiLCJzZWxlY3RvclN0YXJ0IiwiZGVwdGgiLCJudW0iLCJpc05hTiIsImVzY2FwZUNoYXIiLCJvcGVuIiwiY2xvc2UiLCJjaGFyIiwicmVwZWF0IiwiTnVtYmVyIiwiY29udmVydEVzY2FwaW5nIiwibmVzdGVkIiwibGl0ZXJhbHMiLCJzdWJzdHJpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwid2luZG93Iiwic3VwcG9ydCIsIkV4cHIiLCJnZXRUZXh0IiwiaXNYTUwiLCJ0b2tlbml6ZSIsImNvbXBpbGUiLCJvdXRlcm1vc3RDb250ZXh0Iiwic29ydElucHV0IiwiaGFzRHVwbGljYXRlIiwic2V0RG9jdW1lbnQiLCJkb2NFbGVtIiwiZG9jdW1lbnRJc0hUTUwiLCJyYnVnZ3lRU0EiLCJyYnVnZ3lNYXRjaGVzIiwiZXhwYW5kbyIsIkRhdGUiLCJwcmVmZXJyZWREb2MiLCJkaXJydW5zIiwiY2xhc3NDYWNoZSIsImNyZWF0ZUNhY2hlIiwidG9rZW5DYWNoZSIsImNvbXBpbGVyQ2FjaGUiLCJub25uYXRpdmVTZWxlY3RvckNhY2hlIiwic29ydE9yZGVyIiwiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJwdXNoTmF0aXZlIiwibGlzdCIsImVsZW0iLCJsZW4iLCJib29sZWFucyIsIndoaXRlc3BhY2UiLCJpZGVudGlmaWVyIiwicHNldWRvcyIsInJ3aGl0ZXNwYWNlIiwicnRyaW0iLCJyY29tbWEiLCJyY29tYmluYXRvcnMiLCJyZGVzY2VuZCIsInJwc2V1ZG8iLCJyaWRlbnRpZmllciIsIm1hdGNoRXhwciIsInJodG1sIiwicmlucHV0cyIsInJoZWFkZXIiLCJybmF0aXZlIiwicnF1aWNrRXhwciIsInJzaWJsaW5nIiwicnVuZXNjYXBlIiwiZnVuZXNjYXBlIiwiZXNjYXBlIiwibm9uSGV4IiwiaGlnaCIsInJjc3Nlc2NhcGUiLCJmY3NzZXNjYXBlIiwiY2giLCJhc0NvZGVQb2ludCIsImNoYXJDb2RlQXQiLCJ1bmxvYWRIYW5kbGVyIiwiaW5EaXNhYmxlZEZpZWxkc2V0IiwiYWRkQ29tYmluYXRvciIsImRpc2FibGVkIiwibm9kZU5hbWUiLCJkaXIiLCJhcHBseSIsImNhbGwiLCJjaGlsZE5vZGVzIiwiZSIsInRhcmdldCIsImVscyIsImoiLCJyZXN1bHRzIiwic2VlZCIsIm0iLCJuaWQiLCJncm91cHMiLCJuZXdTZWxlY3RvciIsIm5ld0NvbnRleHQiLCJvd25lckRvY3VtZW50IiwiZXhlYyIsImdldEVsZW1lbnRCeUlkIiwicXNhIiwidGVzdENvbnRleHQiLCJzY29wZSIsInNldEF0dHJpYnV0ZSIsInRvU2VsZWN0b3IiLCJxc2FFcnJvciIsInJlbW92ZUF0dHJpYnV0ZSIsImNhY2hlIiwiY2FjaGVMZW5ndGgiLCJtYXJrRnVuY3Rpb24iLCJmbiIsImFzc2VydCIsImVsIiwiY3JlYXRlRWxlbWVudCIsInJlbW92ZUNoaWxkIiwiYWRkSGFuZGxlIiwiYXR0cnMiLCJhdHRySGFuZGxlIiwic2libGluZ0NoZWNrIiwiY3VyIiwiZGlmZiIsInNvdXJjZUluZGV4IiwibmV4dFNpYmxpbmciLCJjcmVhdGVJbnB1dFBzZXVkbyIsImNyZWF0ZUJ1dHRvblBzZXVkbyIsImNyZWF0ZURpc2FibGVkUHNldWRvIiwiaXNEaXNhYmxlZCIsImNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8iLCJhcmd1bWVudCIsIm1hdGNoSW5kZXhlcyIsIm5hbWVzcGFjZSIsIm5hbWVzcGFjZVVSSSIsImRvY3VtZW50RWxlbWVudCIsImhhc0NvbXBhcmUiLCJzdWJXaW5kb3ciLCJkb2MiLCJkZWZhdWx0VmlldyIsInRvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsImFwcGVuZENoaWxkIiwiY3JlYXRlQ29tbWVudCIsImdldEJ5SWQiLCJnZXRFbGVtZW50c0J5TmFtZSIsImF0dHJJZCIsImZpbmQiLCJnZXRBdHRyaWJ1dGVOb2RlIiwiZWxlbXMiLCJ0bXAiLCJpbm5lckhUTUwiLCJtYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJvTWF0Y2hlc1NlbGVjdG9yIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJkaXNjb25uZWN0ZWRNYXRjaCIsImNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIiwiYWRvd24iLCJidXAiLCJzb3J0RGV0YWNoZWQiLCJhdXAiLCJhcCIsImJwIiwiZXhwciIsInJldCIsInNwZWNpZmllZCIsInNlbCIsImVycm9yIiwibXNnIiwidW5pcXVlU29ydCIsImR1cGxpY2F0ZXMiLCJkZXRlY3REdXBsaWNhdGVzIiwic29ydFN0YWJsZSIsInNwbGljZSIsImZpcnN0Q2hpbGQiLCJub2RlVmFsdWUiLCJjcmVhdGVQc2V1ZG8iLCJyZWxhdGl2ZSIsImZpcnN0IiwicHJlRmlsdGVyIiwiZXhjZXNzIiwidW5xdW90ZWQiLCJub2RlTmFtZVNlbGVjdG9yIiwid2hhdCIsIl9hcmd1bWVudCIsImxhc3QiLCJzaW1wbGUiLCJmb3J3YXJkIiwib2ZUeXBlIiwiX2NvbnRleHQiLCJ4bWwiLCJ1bmlxdWVDYWNoZSIsIm91dGVyQ2FjaGUiLCJ1c2VDYWNoZSIsImxhc3RDaGlsZCIsInVuaXF1ZUlEIiwiYXJncyIsInNldEZpbHRlcnMiLCJpZHgiLCJtYXRjaGVkIiwibWF0Y2hlciIsInVubWF0Y2hlZCIsImxhbmciLCJlbGVtTGFuZyIsImhhc2giLCJsb2NhdGlvbiIsImFjdGl2ZUVsZW1lbnQiLCJoYXNGb2N1cyIsImhyZWYiLCJ0YWJJbmRleCIsImNoZWNrZWQiLCJzZWxlY3RlZCIsInNlbGVjdGVkSW5kZXgiLCJfbWF0Y2hJbmRleGVzIiwicmFkaW8iLCJjaGVja2JveCIsImZpbGUiLCJwYXNzd29yZCIsImltYWdlIiwic3VibWl0IiwicmVzZXQiLCJwcm90b3R5cGUiLCJmaWx0ZXJzIiwicGFyc2VPbmx5IiwidG9rZW5zIiwic29GYXIiLCJwcmVGaWx0ZXJzIiwiY2FjaGVkIiwiY29tYmluYXRvciIsImJhc2UiLCJjaGVja05vbkVsZW1lbnRzIiwiZG9uZU5hbWUiLCJvbGRDYWNoZSIsIm5ld0NhY2hlIiwiZWxlbWVudE1hdGNoZXIiLCJtYXRjaGVycyIsIm11bHRpcGxlQ29udGV4dHMiLCJjb250ZXh0cyIsImNvbmRlbnNlIiwibmV3VW5tYXRjaGVkIiwibWFwcGVkIiwic2V0TWF0Y2hlciIsInBvc3RGaWx0ZXIiLCJwb3N0RmluZGVyIiwicG9zdFNlbGVjdG9yIiwidGVtcCIsInByZU1hcCIsInBvc3RNYXAiLCJwcmVleGlzdGluZyIsIm1hdGNoZXJJbiIsIm1hdGNoZXJPdXQiLCJtYXRjaGVyRnJvbVRva2VucyIsImNoZWNrQ29udGV4dCIsImxlYWRpbmdSZWxhdGl2ZSIsImltcGxpY2l0UmVsYXRpdmUiLCJtYXRjaENvbnRleHQiLCJtYXRjaEFueUNvbnRleHQiLCJtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMiLCJlbGVtZW50TWF0Y2hlcnMiLCJzZXRNYXRjaGVycyIsImJ5U2V0IiwiYnlFbGVtZW50Iiwic3VwZXJNYXRjaGVyIiwib3V0ZXJtb3N0IiwibWF0Y2hlZENvdW50Iiwic2V0TWF0Y2hlZCIsImNvbnRleHRCYWNrdXAiLCJkaXJydW5zVW5pcXVlIiwiTWF0aCIsInJhbmRvbSIsInRva2VuIiwiY29tcGlsZWQiLCJfbmFtZSIsImRlZmF1bHRWYWx1ZSIsIl9zaXp6bGUiLCJub0NvbmZsaWN0IiwiZGVmaW5lIiwiZGVmYXVsdCIsImNvbW1vbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O1FDaERnQkEsUyxHQUFBQSxTO1FBbUJBQyxpQixHQUFBQSxpQjtRQThDQUMsbUIsR0FBQUEsbUI7QUFqRmhCOzs7Ozs7QUFNQTs7OztBQUlBOzs7Ozs7QUFNTyxTQUFTRixTQUFULEdBQWtDO0FBQUEsTUFBZEcsT0FBYyx1RUFBSixFQUFJOztBQUN2QyxNQUFJQSxRQUFRQyxNQUFSLEtBQW1CLFFBQXZCLEVBQWlDO0FBQy9CLFFBQU1DLFNBQVMsbUJBQUFDLENBQVEsQ0FBUixDQUFmO0FBQ0EsV0FBTyxVQUFVQyxRQUFWLEVBQW1DO0FBQUEsVUFBZkMsTUFBZSx1RUFBTixJQUFNOztBQUN4QyxhQUFPSCxPQUFPRSxRQUFQLEVBQWlCQyxVQUFVQyxRQUEzQixDQUFQO0FBQ0QsS0FGRDtBQUdEO0FBQ0QsU0FBTyxVQUFVRixRQUFWLEVBQW1DO0FBQUEsUUFBZkMsTUFBZSx1RUFBTixJQUFNOztBQUN4QyxXQUFPLENBQUNBLFVBQVVDLFFBQVgsRUFBcUJDLGdCQUFyQixDQUFzQ0gsUUFBdEMsQ0FBUDtBQUNELEdBRkQ7QUFHRDs7QUFHRDs7Ozs7O0FBTU8sU0FBU04saUJBQVQsQ0FBNEJVLFFBQTVCLEVBQW9EO0FBQUEsTUFBZFIsT0FBYyx1RUFBSixFQUFJO0FBQUEsc0JBSXJEQSxPQUpxRCxDQUd2RFMsSUFIdUQ7QUFBQSxNQUd2REEsSUFIdUQsaUNBR2hESCxRQUhnRDs7O0FBTXpELE1BQU1JLFlBQVksRUFBbEI7O0FBRUFGLFdBQVNHLE9BQVQsQ0FBaUIsVUFBQ0MsT0FBRCxFQUFVQyxLQUFWLEVBQW9CO0FBQ25DLFFBQU1DLFVBQVUsRUFBaEI7QUFDQSxXQUFPRixZQUFZSCxJQUFuQixFQUF5QjtBQUN2QkcsZ0JBQVVBLFFBQVFHLFVBQWxCO0FBQ0FELGNBQVFFLE9BQVIsQ0FBZ0JKLE9BQWhCO0FBQ0Q7QUFDREYsY0FBVUcsS0FBVixJQUFtQkMsT0FBbkI7QUFDRCxHQVBEOztBQVNBSixZQUFVTyxJQUFWLENBQWUsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQO0FBQUEsV0FBZ0JELEtBQUtFLE1BQUwsR0FBY0QsS0FBS0MsTUFBbkM7QUFBQSxHQUFmOztBQUVBLE1BQU1DLGtCQUFrQlgsVUFBVVksS0FBVixFQUF4Qjs7QUFFQSxNQUFJQyxXQUFXLElBQWY7O0FBckJ5RDtBQXdCdkQsUUFBTWxCLFNBQVNnQixnQkFBZ0JHLENBQWhCLENBQWY7QUFDQSxRQUFNQyxVQUFVZixVQUFVZ0IsSUFBVixDQUFlLFVBQUNDLFlBQUQsRUFBa0I7QUFDL0MsYUFBTyxDQUFDQSxhQUFhRCxJQUFiLENBQWtCLFVBQUNFLFdBQUQ7QUFBQSxlQUFpQkEsZ0JBQWdCdkIsTUFBakM7QUFBQSxPQUFsQixDQUFSO0FBQ0QsS0FGZSxDQUFoQjs7QUFJQSxRQUFJb0IsT0FBSixFQUFhO0FBQ1g7QUFDQTtBQUNEOztBQUVERixlQUFXbEIsTUFBWDtBQWxDdUQ7O0FBdUJ6RCxPQUFLLElBQUltQixJQUFJLENBQVIsRUFBV0ssSUFBSVIsZ0JBQWdCRCxNQUFwQyxFQUE0Q0ksSUFBSUssQ0FBaEQsRUFBbURMLEdBQW5ELEVBQXdEO0FBQUE7O0FBQUEsMEJBUXBEO0FBSUg7O0FBRUQsU0FBT0QsUUFBUDtBQUNEOztBQUVEOzs7Ozs7QUFNTyxTQUFTeEIsbUJBQVQsQ0FBOEJTLFFBQTlCLEVBQXdDOztBQUU3QyxNQUFNc0IsbUJBQW1CO0FBQ3ZCQyxhQUFTLEVBRGM7QUFFdkJDLGdCQUFZLEVBRlc7QUFHdkJDLFNBQUs7QUFIa0IsR0FBekI7O0FBTUF6QixXQUFTRyxPQUFULENBQWlCLFVBQUNDLE9BQUQsRUFBYTtBQUFBLFFBR2pCc0IsYUFIaUIsR0FNeEJKLGdCQU53QixDQUcxQkMsT0FIMEI7QUFBQSxRQUlkSSxnQkFKYyxHQU14QkwsZ0JBTndCLENBSTFCRSxVQUowQjtBQUFBLFFBS3JCSSxTQUxxQixHQU14Qk4sZ0JBTndCLENBSzFCRyxHQUwwQjs7QUFRNUI7O0FBQ0EsUUFBSUMsa0JBQWtCRyxTQUF0QixFQUFpQztBQUMvQixVQUFJTixVQUFVbkIsUUFBUTBCLFlBQVIsQ0FBcUIsT0FBckIsQ0FBZDtBQUNBLFVBQUlQLE9BQUosRUFBYTtBQUNYQSxrQkFBVUEsUUFBUVEsSUFBUixHQUFlQyxLQUFmLENBQXFCLEdBQXJCLENBQVY7QUFDQSxZQUFJLENBQUNOLGNBQWNkLE1BQW5CLEVBQTJCO0FBQ3pCVSwyQkFBaUJDLE9BQWpCLEdBQTJCQSxPQUEzQjtBQUNELFNBRkQsTUFFTztBQUNMRywwQkFBZ0JBLGNBQWNPLE1BQWQsQ0FBcUIsVUFBQ0MsS0FBRDtBQUFBLG1CQUFXWCxRQUFRTCxJQUFSLENBQWEsVUFBQ2lCLElBQUQ7QUFBQSxxQkFBVUEsU0FBU0QsS0FBbkI7QUFBQSxhQUFiLENBQVg7QUFBQSxXQUFyQixDQUFoQjtBQUNBLGNBQUlSLGNBQWNkLE1BQWxCLEVBQTBCO0FBQ3hCVSw2QkFBaUJDLE9BQWpCLEdBQTJCRyxhQUEzQjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPSixpQkFBaUJDLE9BQXhCO0FBQ0Q7QUFDRjtBQUNGLE9BWkQsTUFZTztBQUNMO0FBQ0EsZUFBT0QsaUJBQWlCQyxPQUF4QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxRQUFJSSxxQkFBcUJFLFNBQXpCLEVBQW9DO0FBQ2xDLFVBQU1PLG9CQUFvQmhDLFFBQVFvQixVQUFsQztBQUNBLFVBQU1BLGFBQWFhLE9BQU9DLElBQVAsQ0FBWUYsaUJBQVosRUFBK0JHLE1BQS9CLENBQXNDLFVBQUNmLFVBQUQsRUFBYWdCLEdBQWIsRUFBcUI7QUFDNUUsWUFBTUMsWUFBWUwsa0JBQWtCSSxHQUFsQixDQUFsQjtBQUNBLFlBQU1FLGdCQUFnQkQsVUFBVU4sSUFBaEM7QUFDQTtBQUNBO0FBQ0EsWUFBSU0sYUFBYUMsa0JBQWtCLE9BQW5DLEVBQTRDO0FBQzFDbEIscUJBQVdrQixhQUFYLElBQTRCRCxVQUFVRSxLQUF0QztBQUNEO0FBQ0QsZUFBT25CLFVBQVA7QUFDRCxPQVRrQixFQVNoQixFQVRnQixDQUFuQjs7QUFXQSxVQUFNb0Isa0JBQWtCUCxPQUFPQyxJQUFQLENBQVlkLFVBQVosQ0FBeEI7QUFDQSxVQUFNcUIsd0JBQXdCUixPQUFPQyxJQUFQLENBQVlYLGdCQUFaLENBQTlCOztBQUVBLFVBQUlpQixnQkFBZ0JoQyxNQUFwQixFQUE0QjtBQUMxQixZQUFJLENBQUNpQyxzQkFBc0JqQyxNQUEzQixFQUFtQztBQUNqQ1UsMkJBQWlCRSxVQUFqQixHQUE4QkEsVUFBOUI7QUFDRCxTQUZELE1BRU87QUFDTEcsNkJBQW1Ca0Isc0JBQXNCTixNQUF0QixDQUE2QixVQUFDTyxvQkFBRCxFQUF1QlgsSUFBdkIsRUFBZ0M7QUFDOUUsZ0JBQU1RLFFBQVFoQixpQkFBaUJRLElBQWpCLENBQWQ7QUFDQSxnQkFBSVEsVUFBVW5CLFdBQVdXLElBQVgsQ0FBZCxFQUFnQztBQUM5QlcsbUNBQXFCWCxJQUFyQixJQUE2QlEsS0FBN0I7QUFDRDtBQUNELG1CQUFPRyxvQkFBUDtBQUNELFdBTmtCLEVBTWhCLEVBTmdCLENBQW5CO0FBT0EsY0FBSVQsT0FBT0MsSUFBUCxDQUFZWCxnQkFBWixFQUE4QmYsTUFBbEMsRUFBMEM7QUFDeENVLDZCQUFpQkUsVUFBakIsR0FBOEJHLGdCQUE5QjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPTCxpQkFBaUJFLFVBQXhCO0FBQ0Q7QUFDRjtBQUNGLE9BakJELE1BaUJPO0FBQ0wsZUFBT0YsaUJBQWlCRSxVQUF4QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxRQUFJSSxjQUFjQyxTQUFsQixFQUE2QjtBQUMzQixVQUFNSixNQUFNckIsUUFBUTJDLE9BQVIsQ0FBZ0JDLFdBQWhCLEVBQVo7QUFDQSxVQUFJLENBQUNwQixTQUFMLEVBQWdCO0FBQ2ROLHlCQUFpQkcsR0FBakIsR0FBdUJBLEdBQXZCO0FBQ0QsT0FGRCxNQUVPLElBQUlBLFFBQVFHLFNBQVosRUFBdUI7QUFDNUIsZUFBT04saUJBQWlCRyxHQUF4QjtBQUNEO0FBQ0Y7QUFDRixHQTdFRDs7QUErRUEsU0FBT0gsZ0JBQVA7QUFDRCxDOzs7Ozs7Ozs7Ozs7UUM3SmUyQixlLEdBQUFBLGU7UUFpQkFDLFcsR0FBQUEsVztBQTdCaEI7Ozs7OztBQU1BOzs7Ozs7QUFNTyxTQUFTRCxlQUFULENBQTBCRSxLQUExQixFQUFpQztBQUFBLE1BQzlCdkMsTUFEOEIsR0FDbkJ1QyxLQURtQixDQUM5QnZDLE1BRDhCOztBQUV0QyxNQUFNd0MsTUFBTSxJQUFJQyxLQUFKLENBQVV6QyxNQUFWLENBQVo7QUFDQSxPQUFLLElBQUlJLElBQUksQ0FBYixFQUFnQkEsSUFBSUosTUFBcEIsRUFBNEJJLEdBQTVCLEVBQWlDO0FBQy9Cb0MsUUFBSXBDLENBQUosSUFBU21DLE1BQU1uQyxDQUFOLENBQVQ7QUFDRDtBQUNELFNBQU9vQyxHQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUU8sU0FBU0YsV0FBVCxDQUFzQlAsS0FBdEIsRUFBNkI7QUFDbEMsU0FBT0EsU0FBU0EsTUFBTVcsT0FBTixDQUFjLHFDQUFkLEVBQXFELE1BQXJELEVBQ2JBLE9BRGEsQ0FDTCxLQURLLEVBQ0UsTUFERixDQUFoQjtBQUVELEM7Ozs7Ozs7Ozs7OztrQkNGdUJDLEs7O0FBeEJ4Qjs7QUFDQTs7b01BUEE7Ozs7OztBQVNBOzs7O0FBSUEsSUFBTUMsZ0JBQWdCO0FBQ3BCZixXQURvQixxQkFDVEMsYUFEUyxFQUNNO0FBQ3hCLFdBQU8sQ0FDTCxPQURLLEVBRUwsY0FGSyxFQUdMLHFCQUhLLEVBSUxlLE9BSkssQ0FJR2YsYUFKSCxJQUlvQixDQUFDLENBSjVCO0FBS0Q7QUFQbUIsQ0FBdEI7O0FBVUE7Ozs7Ozs7QUFPZSxTQUFTYSxLQUFULENBQWdCRyxJQUFoQixFQUFvQztBQUFBLE1BQWRsRSxPQUFjLHVFQUFKLEVBQUk7QUFBQSxzQkFRN0NBLE9BUjZDLENBRy9DUyxJQUgrQztBQUFBLE1BRy9DQSxJQUgrQyxpQ0FHeENILFFBSHdDO0FBQUEsc0JBUTdDTixPQVI2QyxDQUkvQ21FLElBSitDO0FBQUEsTUFJL0NBLElBSitDLGlDQUl4QyxJQUp3QztBQUFBLDBCQVE3Q25FLE9BUjZDLENBSy9Db0UsUUFMK0M7QUFBQSxNQUsvQ0EsUUFMK0MscUNBS3BDLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsQ0FMb0M7QUFBQSx3QkFRN0NwRSxPQVI2QyxDQU0vQ3FFLE1BTitDO0FBQUEsTUFNL0NBLE1BTitDLG1DQU10QyxFQU5zQztBQUFBLE1BTy9DcEUsTUFQK0MsR0FRN0NELE9BUjZDLENBTy9DQyxNQVArQzs7O0FBVWpELE1BQU1xRSxPQUFPLEVBQWI7QUFDQSxNQUFJMUQsVUFBVXNELElBQWQ7QUFDQSxNQUFJOUMsU0FBU2tELEtBQUtsRCxNQUFsQjtBQUNBLE1BQU1tRCxTQUFVdEUsV0FBVyxRQUEzQjtBQUNBLE1BQU11RSxTQUFTLHVCQUFVeEUsT0FBVixDQUFmOztBQUVBLE1BQU15RSxjQUFjTixRQUFRLENBQUNOLE1BQU1hLE9BQU4sQ0FBY1AsSUFBZCxJQUFzQkEsSUFBdEIsR0FBNkIsQ0FBQ0EsSUFBRCxDQUE5QixFQUFzQ1EsR0FBdEMsQ0FBMEMsVUFBQ2pDLEtBQUQsRUFBVztBQUMvRSxRQUFJLE9BQU9BLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDL0IsYUFBTyxVQUFDOUIsT0FBRDtBQUFBLGVBQWFBLFlBQVk4QixLQUF6QjtBQUFBLE9BQVA7QUFDRDtBQUNELFdBQU9BLEtBQVA7QUFDRCxHQUwyQixDQUE1Qjs7QUFPQSxNQUFNa0MsYUFBYSxTQUFiQSxVQUFhLENBQUNoRSxPQUFELEVBQWE7QUFDOUIsV0FBT3VELFFBQVFNLFlBQVkvQyxJQUFaLENBQWlCLFVBQUNtRCxPQUFEO0FBQUEsYUFBYUEsUUFBUWpFLE9BQVIsQ0FBYjtBQUFBLEtBQWpCLENBQWY7QUFDRCxHQUZEOztBQUlBaUMsU0FBT0MsSUFBUCxDQUFZdUIsTUFBWixFQUFvQjFELE9BQXBCLENBQTRCLFVBQUNtRSxJQUFELEVBQVU7QUFDcEMsUUFBSUMsWUFBWVYsT0FBT1MsSUFBUCxDQUFoQjtBQUNBLFFBQUksT0FBT0MsU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUNyQyxRQUFJLE9BQU9BLFNBQVAsS0FBcUIsUUFBekIsRUFBbUM7QUFDakNBLGtCQUFZQSxVQUFVQyxRQUFWLEVBQVo7QUFDRDtBQUNELFFBQUksT0FBT0QsU0FBUCxLQUFxQixRQUF6QixFQUFtQztBQUNqQ0Esa0JBQVksSUFBSUUsTUFBSixDQUFXLDRCQUFZRixTQUFaLEVBQXVCakIsT0FBdkIsQ0FBK0IsS0FBL0IsRUFBc0MsTUFBdEMsQ0FBWCxDQUFaO0FBQ0Q7QUFDRCxRQUFJLE9BQU9pQixTQUFQLEtBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDQSxrQkFBWUEsWUFBWSxNQUFaLEdBQXFCLElBQWpDO0FBQ0Q7QUFDRDtBQUNBVixXQUFPUyxJQUFQLElBQWUsVUFBQ25DLElBQUQsRUFBT1EsS0FBUDtBQUFBLGFBQWlCNEIsVUFBVUcsSUFBVixDQUFlL0IsS0FBZixDQUFqQjtBQUFBLEtBQWY7QUFDRCxHQWREOztBQWdCQSxTQUFPdkMsWUFBWUgsSUFBWixJQUFvQkcsUUFBUXVFLFFBQVIsS0FBcUIsRUFBaEQsRUFBb0Q7QUFDbEQsUUFBSVAsV0FBV2hFLE9BQVgsTUFBd0IsSUFBNUIsRUFBa0M7QUFDaEM7QUFDQSxVQUFJd0UsZ0JBQWdCaEIsUUFBaEIsRUFBMEJ4RCxPQUExQixFQUFtQ3lELE1BQW5DLEVBQTJDQyxJQUEzQyxFQUFpREUsTUFBakQsRUFBeUQvRCxJQUF6RCxDQUFKLEVBQW9FO0FBQ3BFLFVBQUk0RSxTQUFTekUsT0FBVCxFQUFrQnlELE1BQWxCLEVBQTBCQyxJQUExQixFQUFnQ0UsTUFBaEMsRUFBd0MvRCxJQUF4QyxDQUFKLEVBQW1EOztBQUVuRDtBQUNBMkUsc0JBQWdCaEIsUUFBaEIsRUFBMEJ4RCxPQUExQixFQUFtQ3lELE1BQW5DLEVBQTJDQyxJQUEzQyxFQUFpREUsTUFBakQ7QUFDQSxVQUFJRixLQUFLbEQsTUFBTCxLQUFnQkEsTUFBcEIsRUFBNEI7QUFDMUJpRSxpQkFBU3pFLE9BQVQsRUFBa0J5RCxNQUFsQixFQUEwQkMsSUFBMUIsRUFBZ0NFLE1BQWhDO0FBQ0Q7O0FBRUQsVUFBSUQsVUFBVUQsS0FBS2xELE1BQUwsS0FBZ0JBLE1BQTlCLEVBQXNDO0FBQ3BDa0Usc0JBQWNsQixRQUFkLEVBQXdCeEQsT0FBeEIsRUFBaUN5RCxNQUFqQyxFQUF5Q0MsSUFBekMsRUFBK0NFLE1BQS9DO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJRixLQUFLbEQsTUFBTCxLQUFnQkEsTUFBcEIsRUFBNEI7QUFDMUJtRSxvQkFBWW5CLFFBQVosRUFBc0J4RCxPQUF0QixFQUErQnlELE1BQS9CLEVBQXVDQyxJQUF2QyxFQUE2Q0UsTUFBN0M7QUFDRDtBQUNGOztBQUVENUQsY0FBVUEsUUFBUUcsVUFBbEI7QUFDQUssYUFBU2tELEtBQUtsRCxNQUFkO0FBQ0Q7O0FBRUQsTUFBSVIsWUFBWUgsSUFBaEIsRUFBc0I7QUFDcEIsUUFBTStFLFVBQVVDLFlBQVlyQixRQUFaLEVBQXNCeEQsT0FBdEIsRUFBK0J5RCxNQUEvQixFQUF1Q0csTUFBdkMsQ0FBaEI7QUFDQUYsU0FBS3RELE9BQUwsQ0FBYXdFLE9BQWI7QUFDRDs7QUFFRCxTQUFPbEIsS0FBS29CLElBQUwsQ0FBVSxHQUFWLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7QUFXQSxTQUFTTixlQUFULENBQTBCaEIsUUFBMUIsRUFBb0N4RCxPQUFwQyxFQUE2Q3lELE1BQTdDLEVBQXFEQyxJQUFyRCxFQUEyREUsTUFBM0QsRUFBZ0c7QUFBQSxNQUE3Qm5FLE1BQTZCLHVFQUFwQk8sUUFBUUcsVUFBWTs7QUFDOUYsTUFBTXlFLFVBQVVHLHNCQUFzQnZCLFFBQXRCLEVBQWdDeEQsT0FBaEMsRUFBeUN5RCxNQUF6QyxFQUFpREcsTUFBakQsRUFBeURuRSxNQUF6RCxDQUFoQjtBQUNBLE1BQUltRixPQUFKLEVBQWE7QUFDWCxRQUFNSSxVQUFVcEIsT0FBT2dCLE9BQVAsRUFBZ0JuRixNQUFoQixDQUFoQjtBQUNBLFFBQUl1RixRQUFReEUsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN4QmtELFdBQUt0RCxPQUFMLENBQWF3RSxPQUFiO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7OztBQVFBLFNBQVNLLGdCQUFULEdBQXdEO0FBQUEsTUFBOUI5RCxPQUE4Qix1RUFBcEIsRUFBb0I7QUFBQSxNQUFoQnlDLE1BQWdCO0FBQUEsTUFBUm5FLE1BQVE7O0FBQ3RELE1BQUl5RixTQUFTLENBQUMsRUFBRCxDQUFiOztBQUVBL0QsVUFBUXBCLE9BQVIsQ0FBZ0IsVUFBU29GLENBQVQsRUFBWTtBQUMxQkQsV0FBT25GLE9BQVAsQ0FBZSxVQUFTcUYsQ0FBVCxFQUFZO0FBQ3pCRixhQUFPRyxJQUFQLENBQVlELEVBQUVFLE1BQUYsQ0FBUyxNQUFNSCxDQUFmLENBQVo7QUFDRCxLQUZEO0FBR0QsR0FKRDs7QUFNQUQsU0FBT3hFLEtBQVA7O0FBRUF3RSxXQUFTQSxPQUFPN0UsSUFBUCxDQUFZLFVBQVNrRixDQUFULEVBQVdDLENBQVgsRUFBYztBQUFFLFdBQU9ELEVBQUUvRSxNQUFGLEdBQVdnRixFQUFFaEYsTUFBcEI7QUFBNEIsR0FBeEQsQ0FBVDs7QUFFQSxPQUFJLElBQUlJLElBQUksQ0FBWixFQUFlQSxJQUFJc0UsT0FBTzFFLE1BQTFCLEVBQWtDSSxHQUFsQyxFQUF1QztBQUNyQyxRQUFJd0UsSUFBSUYsT0FBT3RFLENBQVAsRUFBVWtFLElBQVYsQ0FBZSxFQUFmLENBQVI7QUFDQSxRQUFNRSxVQUFVcEIsT0FBT3dCLENBQVAsRUFBVTNGLE1BQVYsQ0FBaEI7QUFDQSxRQUFJdUYsUUFBUXhFLE1BQVIsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsYUFBTzRFLENBQVA7QUFDRDtBQUNGOztBQUVELFNBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFTQSxTQUFTTCxxQkFBVCxDQUFnQ3ZCLFFBQWhDLEVBQTBDeEQsT0FBMUMsRUFBbUR5RCxNQUFuRCxFQUEyREcsTUFBM0QsRUFBZ0c7QUFBQSxNQUE3Qm5FLE1BQTZCLHVFQUFwQk8sUUFBUUcsVUFBWTs7QUFDOUYsTUFBTWlCLGFBQWFwQixRQUFRb0IsVUFBM0I7QUFDQSxNQUFJcUUsaUJBQWlCeEQsT0FBT0MsSUFBUCxDQUFZZCxVQUFaLEVBQXdCMkMsR0FBeEIsQ0FBNEIsVUFBQzJCLEdBQUQ7QUFBQSxXQUFTdEUsV0FBV3NFLEdBQVgsRUFBZ0IzRCxJQUF6QjtBQUFBLEdBQTVCLEVBQ2xCRixNQURrQixDQUNYLFVBQUMwRCxDQUFEO0FBQUEsV0FBTy9CLFNBQVNILE9BQVQsQ0FBaUJrQyxDQUFqQixJQUFzQixDQUE3QjtBQUFBLEdBRFcsQ0FBckI7O0FBR0EsTUFBSUksMENBQWtCbkMsUUFBbEIsc0JBQStCaUMsY0FBL0IsRUFBSjs7QUFFQSxNQUFJOUMsVUFBVTNDLFFBQVEyQyxPQUFSLENBQWdCQyxXQUFoQixFQUFkOztBQUVBLE9BQUssSUFBSWhDLElBQUksQ0FBUixFQUFXSyxJQUFJMEUsV0FBV25GLE1BQS9CLEVBQXVDSSxJQUFJSyxDQUEzQyxFQUE4Q0wsR0FBOUMsRUFBbUQ7QUFDakQsUUFBTXdCLE1BQU11RCxXQUFXL0UsQ0FBWCxDQUFaO0FBQ0EsUUFBTXlCLFlBQVlqQixXQUFXZ0IsR0FBWCxDQUFsQjtBQUNBLFFBQU1FLGdCQUFnQiw0QkFBWUQsYUFBYUEsVUFBVU4sSUFBbkMsQ0FBdEI7QUFDQSxRQUFNNkQsaUJBQWlCLDRCQUFZdkQsYUFBYUEsVUFBVUUsS0FBbkMsQ0FBdkI7QUFDQSxRQUFNc0QsaUJBQWlCdkQsa0JBQWtCLE9BQXpDOztBQUVBLFFBQU13RCxnQkFBaUJELGtCQUFrQnBDLE9BQU9uQixhQUFQLENBQW5CLElBQTZDbUIsT0FBT3BCLFNBQTFFO0FBQ0EsUUFBTTBELHVCQUF3QkYsa0JBQWtCekMsY0FBY2QsYUFBZCxDQUFuQixJQUFvRGMsY0FBY2YsU0FBL0Y7QUFDQSxRQUFJMkQsWUFBWUYsYUFBWixFQUEyQnhELGFBQTNCLEVBQTBDc0QsY0FBMUMsRUFBMERHLG9CQUExRCxDQUFKLEVBQXFGO0FBQ25GO0FBQ0Q7O0FBRUQsUUFBSW5CLGdCQUFjdEMsYUFBZCxVQUFnQ3NELGNBQWhDLE9BQUo7QUFDQSxRQUFHLENBQUNBLGVBQWVqRSxJQUFmLEVBQUosRUFBMkI7QUFDekIsYUFBTyxJQUFQO0FBQ0Q7O0FBRUQsUUFBSVcsa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCc0Msc0JBQWNnQixjQUFkO0FBQ0Q7O0FBRUQsUUFBSXRELGtCQUFrQixPQUF0QixFQUErQjtBQUFBO0FBQzdCLFlBQUkyRCxhQUFhTCxlQUFlakUsSUFBZixHQUFzQkMsS0FBdEIsQ0FBNEIsTUFBNUIsQ0FBakI7QUFDQSxZQUFNc0UsY0FBY3pDLE9BQU8wQyxLQUFQLElBQWdCL0MsY0FBYytDLEtBQWxEO0FBQ0EsWUFBSUQsV0FBSixFQUFpQjtBQUNmRCx1QkFBYUEsV0FBV3BFLE1BQVgsQ0FBa0I7QUFBQSxtQkFBYSxDQUFDcUUsWUFBWUUsU0FBWixDQUFkO0FBQUEsV0FBbEIsQ0FBYjtBQUNEO0FBQ0QsWUFBSUgsV0FBV3pGLE1BQVgsS0FBc0IsQ0FBMUIsRUFBNkI7QUFDM0I7QUFDRDtBQUNEb0Usa0JBQVVLLGlCQUFpQmdCLFVBQWpCLEVBQTZCckMsTUFBN0IsRUFBcUNuRSxNQUFyQyxDQUFWOztBQUVBLFlBQUksQ0FBQ21GLE9BQUwsRUFBYztBQUNaO0FBQ0Q7QUFiNEI7O0FBQUEsK0JBWTNCO0FBRUg7O0FBRUQsV0FBT2pDLFVBQVVpQyxPQUFqQjtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTSCxRQUFULENBQW1CekUsT0FBbkIsRUFBNEJ5RCxNQUE1QixFQUFvQ0MsSUFBcEMsRUFBMENFLE1BQTFDLEVBQStFO0FBQUEsTUFBN0JuRSxNQUE2Qix1RUFBcEJPLFFBQVFHLFVBQVk7O0FBQzdFLE1BQU15RSxVQUFVeUIsZUFBZXJHLE9BQWYsRUFBd0J5RCxNQUF4QixDQUFoQjtBQUNBLE1BQUltQixPQUFKLEVBQWE7QUFDWCxRQUFJSSxVQUFVLEVBQWQ7QUFDQUEsY0FBVXBCLE9BQU9nQixPQUFQLEVBQWdCbkYsTUFBaEIsQ0FBVjtBQUNBLFFBQUl1RixRQUFReEUsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN4QmtELFdBQUt0RCxPQUFMLENBQWF3RSxPQUFiO0FBQ0EsVUFBSUEsWUFBWSxRQUFoQixFQUEwQjtBQUN4QixlQUFPLEtBQVA7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9BLFNBQVN5QixjQUFULENBQXlCckcsT0FBekIsRUFBa0N5RCxNQUFsQyxFQUEwQztBQUN4QyxNQUFNZCxVQUFVM0MsUUFBUTJDLE9BQVIsQ0FBZ0JDLFdBQWhCLEVBQWhCO0FBQ0EsTUFBSW9ELFlBQVl2QyxPQUFPcEMsR0FBbkIsRUFBd0IsSUFBeEIsRUFBOEJzQixPQUE5QixDQUFKLEVBQTRDO0FBQzFDLFdBQU8sSUFBUDtBQUNEO0FBQ0QsU0FBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7QUFZQSxTQUFTZ0MsV0FBVCxDQUFzQm5CLFFBQXRCLEVBQWdDeEQsT0FBaEMsRUFBeUN5RCxNQUF6QyxFQUFpREMsSUFBakQsRUFBdURFLE1BQXZELEVBQStEO0FBQzdELE1BQU1uRSxTQUFTTyxRQUFRRyxVQUF2QjtBQUNBLE1BQU1tRyxXQUFXN0csT0FBTzhHLFNBQVAsSUFBb0I5RyxPQUFPNkcsUUFBNUM7QUFDQSxPQUFLLElBQUkxRixJQUFJLENBQVIsRUFBV0ssSUFBSXFGLFNBQVM5RixNQUE3QixFQUFxQ0ksSUFBSUssQ0FBekMsRUFBNENMLEdBQTVDLEVBQWlEO0FBQy9DLFFBQU00RixRQUFRRixTQUFTMUYsQ0FBVCxDQUFkO0FBQ0EsUUFBSTRGLFVBQVV4RyxPQUFkLEVBQXVCO0FBQ3JCLFVBQU15RyxlQUFlNUIsWUFBWXJCLFFBQVosRUFBc0JnRCxLQUF0QixFQUE2Qi9DLE1BQTdCLEVBQXFDRyxNQUFyQyxDQUFyQjtBQUNBLFVBQUksQ0FBQzZDLFlBQUwsRUFBbUI7QUFDakIsZUFBT0MsUUFBUUMsSUFBUixzRkFFSkgsS0FGSSxFQUVHL0MsTUFGSCxFQUVXZ0QsWUFGWCxDQUFQO0FBR0Q7QUFDRCxVQUFNN0IsaUJBQWU2QixZQUFmLG9CQUF5QzdGLElBQUUsQ0FBM0MsT0FBTjtBQUNBOEMsV0FBS3RELE9BQUwsQ0FBYXdFLE9BQWI7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQSxTQUFTRixhQUFULENBQXdCbEIsUUFBeEIsRUFBa0N4RCxPQUFsQyxFQUEyQ3lELE1BQTNDLEVBQW1EQyxJQUFuRCxFQUF5REUsTUFBekQsRUFBaUU7QUFDL0QsTUFBTWdELGlCQUFpQi9CLFlBQVlyQixRQUFaLEVBQXNCeEQsT0FBdEIsRUFBK0J5RCxNQUEvQixFQUF1Q0csTUFBdkMsQ0FBdkI7QUFDQSxNQUFNbkUsU0FBU08sUUFBUUcsVUFBdkI7QUFDQSxNQUFNMEcsUUFBUTdHLFFBQVE4RyxXQUFSLENBQ1g1RCxPQURXLENBQ0gsTUFERyxFQUNLLElBREwsRUFFWHRCLEtBRlcsQ0FFTCxJQUZLLEVBR1htQyxHQUhXLENBR1A7QUFBQSxXQUFRZ0QsS0FBS3BGLElBQUwsRUFBUjtBQUFBLEdBSE8sRUFJWEUsTUFKVyxDQUlKO0FBQUEsV0FBUWtGLEtBQUt2RyxNQUFMLEdBQWMsQ0FBdEI7QUFBQSxHQUpJLENBQWQ7O0FBTUEsTUFBSW9FLGlCQUFlZ0MsY0FBbkI7QUFDQSxNQUFNSSxRQUFRSCxNQUFNL0YsSUFBTixDQUFXLGdCQUFRO0FBQy9COEQsY0FBYUEsT0FBYixtQkFBa0NtQyxJQUFsQztBQUNBLFFBQU0vQixVQUFVcEIsT0FBT2dCLE9BQVAsRUFBZ0JuRixNQUFoQixDQUFoQjtBQUNBLFdBQU91RixRQUFReEUsTUFBUixLQUFtQixDQUExQjtBQUNELEdBSmEsQ0FBZDtBQUtBLE1BQUl3RyxLQUFKLEVBQVc7QUFDVHRELFNBQUt0RCxPQUFMLENBQWF3RSxPQUFiO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0EsU0FBU0MsV0FBVCxDQUFzQnJCLFFBQXRCLEVBQWdDeEQsT0FBaEMsRUFBeUN5RCxNQUF6QyxFQUFpREcsTUFBakQsRUFBeUQ7QUFDdkQsTUFBSWdCLFVBQVVHLHNCQUFzQnZCLFFBQXRCLEVBQWdDeEQsT0FBaEMsRUFBeUN5RCxNQUF6QyxFQUFpREcsTUFBakQsQ0FBZDtBQUNBLE1BQUksQ0FBQ2dCLE9BQUwsRUFBYztBQUNaQSxjQUFVeUIsZUFBZXJHLE9BQWYsRUFBd0J5RCxNQUF4QixDQUFWO0FBQ0Q7QUFDRCxTQUFPbUIsT0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7QUFTQSxTQUFTb0IsV0FBVCxDQUFzQjdCLFNBQXRCLEVBQWlDcEMsSUFBakMsRUFBdUNRLEtBQXZDLEVBQThDMEUsZ0JBQTlDLEVBQWdFO0FBQzlELE1BQUksQ0FBQzFFLEtBQUwsRUFBWTtBQUNWLFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBTTJFLFFBQVEvQyxhQUFhOEMsZ0JBQTNCO0FBQ0EsTUFBSSxDQUFDQyxLQUFMLEVBQVk7QUFDVixXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU9BLE1BQU1uRixJQUFOLEVBQVlRLEtBQVosRUFBbUIwRSxnQkFBbkIsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7O2tCQ3BWdUJFLFE7O0FBaEJ4Qjs7OztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFJQTs7Ozs7Ozs7QUFRZSxTQUFTQSxRQUFULENBQW1CM0gsUUFBbkIsRUFBNkJJLFFBQTdCLEVBQXFEO0FBQUEsTUFBZFIsT0FBYyx1RUFBSixFQUFJOzs7QUFFbEUsTUFBSUksU0FBUzRILFVBQVQsQ0FBb0IsSUFBcEIsQ0FBSixFQUErQjtBQUM3QjVILGVBQVdBLFNBQVMwRCxPQUFULENBQWlCLElBQWpCLEVBQXVCLEVBQXZCLENBQVg7QUFDRDs7QUFFRDtBQUNBLE1BQUksQ0FBQ0QsTUFBTWEsT0FBTixDQUFjbEUsUUFBZCxDQUFMLEVBQThCO0FBQzVCQSxlQUFXLENBQUNBLFNBQVNZLE1BQVYsR0FBbUIsQ0FBQ1osUUFBRCxDQUFuQixHQUFnQyxnQ0FBZ0JBLFFBQWhCLENBQTNDO0FBQ0Q7O0FBRUQsTUFBSSxDQUFDQSxTQUFTWSxNQUFWLElBQW9CWixTQUFTa0IsSUFBVCxDQUFjLFVBQUNkLE9BQUQ7QUFBQSxXQUFhQSxRQUFRdUUsUUFBUixLQUFxQixDQUFsQztBQUFBLEdBQWQsQ0FBeEIsRUFBNEU7QUFDMUUsVUFBTSxJQUFJOEMsS0FBSixDQUFVLDRIQUFWLENBQU47QUFDRDs7QUFFRCxNQUFNQyxpQkFBaUIscUJBQU0xSCxTQUFTLENBQVQsQ0FBTixFQUFtQlIsT0FBbkIsQ0FBdkI7QUFDQSxNQUFNd0UsU0FBUyx1QkFBVXhFLE9BQVYsQ0FBZjs7QUFFQTtBQUNBO0FBQ0EsTUFBSXNFLE9BQU9sRSxTQUFTMEQsT0FBVCxDQUFpQixLQUFqQixFQUF3QixHQUF4QixFQUE2QkMsS0FBN0IsQ0FBbUMsdUJBQW5DLENBQVg7O0FBRUEsTUFBSU8sS0FBS2xELE1BQUwsR0FBYyxDQUFsQixFQUFxQjtBQUNuQixXQUFPK0csYUFBYSxFQUFiLEVBQWlCL0gsUUFBakIsRUFBMkIsRUFBM0IsRUFBK0JJLFFBQS9CLEVBQXlDZ0UsTUFBekMsQ0FBUDtBQUNEOztBQUVELE1BQUk0RCxlQUFlLEtBQW5CO0FBQ0EsTUFBSSxJQUFJbEQsSUFBSixDQUFTWixLQUFLQSxLQUFLbEQsTUFBTCxHQUFZLENBQWpCLENBQVQsQ0FBSixFQUFtQztBQUNqQ2tELFNBQUtBLEtBQUtsRCxNQUFMLEdBQVksQ0FBakIsSUFBc0IrRyxhQUFhN0QsS0FBSytELEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBQyxDQUFmLEVBQWtCM0MsSUFBbEIsQ0FBdUIsR0FBdkIsQ0FBYixFQUEwQ3BCLEtBQUtBLEtBQUtsRCxNQUFMLEdBQVksQ0FBakIsQ0FBMUMsRUFBK0QsRUFBL0QsRUFBbUVaLFFBQW5FLEVBQTZFZ0UsTUFBN0UsQ0FBdEI7QUFDQTRELG1CQUFlLElBQWY7QUFDRDs7QUFFRCxNQUFNRSxZQUFZLENBQUNoRSxLQUFLaUUsR0FBTCxFQUFELENBQWxCOztBQWhDa0U7QUFrQ2hFLFFBQU1DLFVBQVVsRSxLQUFLaUUsR0FBTCxFQUFoQjtBQUNBLFFBQU1FLFVBQVVuRSxLQUFLb0IsSUFBTCxDQUFVLEdBQVYsQ0FBaEI7QUFDQSxRQUFNZ0QsV0FBV0osVUFBVTVDLElBQVYsQ0FBZSxHQUFmLENBQWpCOztBQUVBLFFBQU1GLFVBQWFpRCxPQUFiLFNBQXdCQyxRQUE5QjtBQUNBLFFBQU05QyxVQUFVcEIsT0FBT2dCLE9BQVAsQ0FBaEI7QUFDQSxRQUFNbUQsZ0JBQWdCL0MsUUFBUXhFLE1BQVIsS0FBbUJaLFNBQVNZLE1BQTVCLElBQXNDWixTQUFTb0ksS0FBVCxDQUFlLFVBQUNoSSxPQUFELEVBQVVZLENBQVY7QUFBQSxhQUFnQlosWUFBWWdGLFFBQVFwRSxDQUFSLENBQTVCO0FBQUEsS0FBZixDQUE1RDtBQUNBLFFBQUksQ0FBQ21ILGFBQUwsRUFBb0I7QUFDbEJMLGdCQUFVdEgsT0FBVixDQUFrQm1ILGFBQWFNLE9BQWIsRUFBc0JELE9BQXRCLEVBQStCRSxRQUEvQixFQUF5Q2xJLFFBQXpDLEVBQW1EZ0UsTUFBbkQsQ0FBbEI7QUFDRDtBQTNDK0Q7O0FBaUNsRSxTQUFPRixLQUFLbEQsTUFBTCxHQUFjLENBQXJCLEVBQXlCO0FBQUE7QUFXeEI7QUFDRGtILFlBQVV0SCxPQUFWLENBQWtCc0QsS0FBSyxDQUFMLENBQWxCO0FBQ0FBLFNBQU9nRSxTQUFQOztBQUVBO0FBQ0FoRSxPQUFLLENBQUwsSUFBVTZELGFBQWEsRUFBYixFQUFpQjdELEtBQUssQ0FBTCxDQUFqQixFQUEwQkEsS0FBSytELEtBQUwsQ0FBVyxDQUFYLEVBQWMzQyxJQUFkLENBQW1CLEdBQW5CLENBQTFCLEVBQW1EbEYsUUFBbkQsRUFBNkRnRSxNQUE3RCxDQUFWO0FBQ0EsTUFBSSxDQUFDNEQsWUFBTCxFQUFtQjtBQUNqQjlELFNBQUtBLEtBQUtsRCxNQUFMLEdBQVksQ0FBakIsSUFBc0IrRyxhQUFhN0QsS0FBSytELEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBQyxDQUFmLEVBQWtCM0MsSUFBbEIsQ0FBdUIsR0FBdkIsQ0FBYixFQUEwQ3BCLEtBQUtBLEtBQUtsRCxNQUFMLEdBQVksQ0FBakIsQ0FBMUMsRUFBK0QsRUFBL0QsRUFBbUVaLFFBQW5FLEVBQTZFZ0UsTUFBN0UsQ0FBdEI7QUFDRDs7QUFFRCxNQUFJMEQsY0FBSixFQUFvQjtBQUNsQixXQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFPNUQsS0FBS29CLElBQUwsQ0FBVSxHQUFWLEVBQWU1QixPQUFmLENBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DdkIsSUFBbkMsRUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBcEZBOzs7Ozs7O0FBOEZBLFNBQVM0RixZQUFULENBQXVCTSxPQUF2QixFQUFnQ0QsT0FBaEMsRUFBeUNFLFFBQXpDLEVBQW1EbEksUUFBbkQsRUFBNkRnRSxNQUE3RCxFQUFxRTtBQUNuRSxNQUFJaUUsUUFBUXJILE1BQVosRUFBb0JxSCxVQUFhQSxPQUFiO0FBQ3BCLE1BQUlDLFNBQVN0SCxNQUFiLEVBQXFCc0gsaUJBQWVBLFFBQWY7O0FBRXJCO0FBQ0EsTUFBSSxjQUFjeEQsSUFBZCxDQUFtQnNELE9BQW5CLEtBQStCRSxTQUFTdEgsTUFBNUMsRUFBb0Q7QUFDbEQsUUFBSXlILGFBQWFMLFFBQVF2RSxPQUFSLENBQWdCLEdBQWhCLENBQWpCO0FBQ0EsUUFBSTZFLGdCQUFnQk4sUUFBUU8sV0FBUixDQUFvQixZQUFwQixDQUFwQjtBQUNBLFFBQUlDLFlBQVlSLFFBQVFILEtBQVIsQ0FBYyxDQUFkLEVBQWlCUyxhQUFqQixDQUFoQjtBQUNBLFdBQU9BLGdCQUFnQkQsVUFBaEIsSUFBOEJJLGVBQWV6RSxZQUFVaUUsT0FBVixHQUFvQk8sU0FBcEIsR0FBZ0NOLFFBQWhDLENBQWYsRUFBNERsSSxRQUE1RCxDQUFyQyxFQUE0RztBQUMxR2dJLGdCQUFVUSxTQUFWO0FBQ0FGLHNCQUFnQk4sUUFBUU8sV0FBUixDQUFvQixZQUFwQixDQUFoQjtBQUNBQyxrQkFBWVIsUUFBUUgsS0FBUixDQUFjLENBQWQsRUFBaUJTLGFBQWpCLENBQVo7QUFDRDtBQUNGOztBQUVEO0FBQ0EsTUFBSSxRQUFRNUQsSUFBUixDQUFhc0QsT0FBYixDQUFKLEVBQTJCO0FBQ3pCLFFBQU14RixNQUFNd0YsUUFBUTFFLE9BQVIsQ0FBZ0IsTUFBaEIsRUFBd0IsR0FBeEIsQ0FBWjtBQUNBLFFBQUkwQixlQUFhaUQsT0FBYixHQUF1QnpGLEdBQXZCLEdBQTZCMEYsUUFBakM7QUFDQSxRQUFJOUMsVUFBVXBCLE9BQU9nQixPQUFQLENBQWQ7QUFDQSxRQUFJeUQsZUFBZXJELE9BQWYsRUFBd0JwRixRQUF4QixDQUFKLEVBQXVDO0FBQ3JDZ0ksZ0JBQVV4RixHQUFWO0FBQ0QsS0FGRCxNQUVPO0FBQ0w7QUFDQSxVQUFNa0csYUFBYTFFLFlBQVVpRSxPQUFWLEdBQW9CekYsR0FBcEIsQ0FBbkI7O0FBRks7QUFJSCxZQUFNbUcsWUFBWUQsV0FBVzFILENBQVgsQ0FBbEI7QUFDQSxZQUFJaEIsU0FBU2tCLElBQVQsQ0FBYyxVQUFDZCxPQUFEO0FBQUEsaUJBQWF1SSxVQUFVQyxRQUFWLENBQW1CeEksT0FBbkIsQ0FBYjtBQUFBLFNBQWQsQ0FBSixFQUE2RDtBQUMzRCxjQUFNeUksY0FBY0YsVUFBVTVGLE9BQVYsQ0FBa0JDLFdBQWxCLEVBQXBCO0FBQ0k4RiwwQkFBY2IsT0FBZCxHQUF3QlksV0FBeEIsR0FBc0NYLFFBRmlCO0FBR3ZEYSxxQkFBVy9FLE9BQU84RSxRQUFQLENBSDRDOztBQUkzRCxjQUFJTCxlQUFlTSxRQUFmLEVBQXlCL0ksUUFBekIsQ0FBSixFQUF3QztBQUN0Q2dJLHNCQUFVYSxXQUFWO0FBQ0Q7QUFDRDtBQUNEO0FBYkU7O0FBR0wsV0FBSyxJQUFJN0gsSUFBSSxDQUFSLEVBQVdLLElBQUlxSCxXQUFXOUgsTUFBL0IsRUFBdUNJLElBQUlLLENBQTNDLEVBQThDTCxHQUE5QyxFQUFtRDtBQUFBLFlBSTNDOEgsUUFKMkM7QUFBQSxZQUszQ0MsUUFMMkM7O0FBQUE7O0FBQUEsK0JBUy9DO0FBRUg7QUFDRjtBQUNGOztBQUVEO0FBQ0EsTUFBSSxJQUFJckUsSUFBSixDQUFTc0QsT0FBVCxDQUFKLEVBQXVCO0FBQ3JCLFFBQU1nQixhQUFhaEIsUUFBUTFFLE9BQVIsQ0FBZ0IsR0FBaEIsRUFBcUIsRUFBckIsQ0FBbkI7QUFDQSxRQUFJMkYsZ0JBQWNoQixPQUFkLEdBQXdCZSxVQUF4QixHQUFxQ2QsUUFBekM7QUFDQSxRQUFJZ0IsV0FBV2xGLE9BQU9pRixRQUFQLENBQWY7QUFDQSxRQUFJUixlQUFlUyxRQUFmLEVBQXlCbEosUUFBekIsQ0FBSixFQUF3QztBQUN0Q2dJLGdCQUFVZ0IsVUFBVjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxNQUFJLGFBQWF0RSxJQUFiLENBQWtCc0QsT0FBbEIsQ0FBSixFQUFnQztBQUM5QjtBQUNBLFFBQU0xRCxPQUFPMEQsUUFBUTFFLE9BQVIsQ0FBZ0IsWUFBaEIsRUFBOEIsYUFBOUIsQ0FBYjtBQUNBLFFBQUk2RixnQkFBY2xCLE9BQWQsR0FBd0IzRCxJQUF4QixHQUErQjRELFFBQW5DO0FBQ0EsUUFBSWtCLFdBQVdwRixPQUFPbUYsUUFBUCxDQUFmO0FBQ0EsUUFBSVYsZUFBZVcsUUFBZixFQUF5QnBKLFFBQXpCLENBQUosRUFBd0M7QUFDdENnSSxnQkFBVTFELElBQVY7QUFDRDtBQUNGOztBQUVEO0FBQ0EsTUFBSSxxQkFBcUJJLElBQXJCLENBQTBCc0QsT0FBMUIsQ0FBSixFQUF3QztBQUN0QyxRQUFJcUIsUUFBUXJCLFFBQVFqRyxJQUFSLEdBQ1R1QixPQURTLENBQ0QsY0FEQyxFQUNlLE1BRGYsRUFDdUI7QUFEdkIsS0FFVHRCLEtBRlMsQ0FFSCxJQUZHLEVBRUc7QUFGSCxLQUdUNkYsS0FIUyxDQUdILENBSEcsRUFJVDFELEdBSlMsQ0FJTCxVQUFDaEMsSUFBRDtBQUFBLG1CQUFjQSxJQUFkO0FBQUEsS0FKSyxFQUtUMUIsSUFMUyxDQUtKLFVBQUNDLElBQUQsRUFBT0MsSUFBUDtBQUFBLGFBQWdCRCxLQUFLRSxNQUFMLEdBQWNELEtBQUtDLE1BQW5DO0FBQUEsS0FMSSxDQUFaO0FBTUEsV0FBT3lJLE1BQU16SSxNQUFiLEVBQXFCO0FBQ25CLFVBQU0wSSxVQUFVdEIsUUFBUTFFLE9BQVIsQ0FBZ0IrRixNQUFNdkksS0FBTixFQUFoQixFQUErQixFQUEvQixFQUFtQ2lCLElBQW5DLEVBQWhCO0FBQ0EsVUFBSXdILFdBQVcsTUFBR3RCLE9BQUgsR0FBYXFCLE9BQWIsR0FBdUJwQixRQUF2QixFQUFrQ25HLElBQWxDLEVBQWY7QUFDQSxVQUFJLENBQUN3SCxTQUFTM0ksTUFBVixJQUFvQjJJLFNBQVNDLE1BQVQsQ0FBZ0IsQ0FBaEIsTUFBdUIsR0FBM0MsSUFBa0RELFNBQVNDLE1BQVQsQ0FBZ0JELFNBQVMzSSxNQUFULEdBQWdCLENBQWhDLE1BQXVDLEdBQTdGLEVBQWtHO0FBQ2hHO0FBQ0Q7QUFDRCxVQUFJNkksV0FBV3pGLE9BQU91RixRQUFQLENBQWY7QUFDQSxVQUFJZCxlQUFlZ0IsUUFBZixFQUF5QnpKLFFBQXpCLENBQUosRUFBd0M7QUFDdENnSSxrQkFBVXNCLE9BQVY7QUFDRDtBQUNGOztBQUVEO0FBQ0FELFlBQVFyQixXQUFXQSxRQUFRekUsS0FBUixDQUFjLEtBQWQsQ0FBbkI7QUFDQSxRQUFJOEYsU0FBU0EsTUFBTXpJLE1BQU4sR0FBZSxDQUE1QixFQUErQjtBQUM3QixVQUFNOEgsY0FBYTFFLFlBQVVpRSxPQUFWLEdBQW9CRCxPQUFwQixDQUFuQjs7QUFENkI7QUFHM0IsWUFBTVcsWUFBWUQsWUFBV2dCLEVBQVgsQ0FBbEI7QUFDQSxZQUFJMUosU0FBU2tCLElBQVQsQ0FBYyxVQUFDZCxPQUFEO0FBQUEsaUJBQWF1SSxVQUFVQyxRQUFWLENBQW1CeEksT0FBbkIsQ0FBYjtBQUFBLFNBQWQsQ0FBSixFQUE4RDtBQUM1RDtBQUNBO0FBQ0EsY0FBTXlJLGNBQWNGLFVBQVU1RixPQUFWLENBQWtCQyxXQUFsQixFQUFwQjtBQUNJMkcsMEJBQWMxQixPQUFkLEdBQXdCWSxXQUF4QixHQUFzQ1gsUUFKa0I7QUFLeEQwQixxQkFBVzVGLE9BQU8yRixRQUFQLENBTDZDOztBQU01RCxjQUFJbEIsZUFBZW1CLFFBQWYsRUFBeUI1SixRQUF6QixDQUFKLEVBQXdDO0FBQ3RDZ0ksc0JBQVVhLFdBQVY7QUFDRDtBQUNEO0FBQ0Q7QUFkMEI7O0FBRTdCLFdBQUssSUFBSWEsS0FBSyxDQUFULEVBQVlHLEtBQUtuQixZQUFXOUgsTUFBakMsRUFBeUM4SSxLQUFLRyxFQUE5QyxFQUFrREgsSUFBbEQsRUFBd0Q7QUFBQSxZQU1oREMsUUFOZ0Q7QUFBQSxZQU9oREMsUUFQZ0Q7O0FBQUE7O0FBQUEsK0JBV3BEO0FBRUg7QUFDRjtBQUNGOztBQUVELFNBQU81QixPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPQSxTQUFTUyxjQUFULENBQXlCckQsT0FBekIsRUFBa0NwRixRQUFsQyxFQUE0QztBQUFBLE1BQ2xDWSxNQURrQyxHQUN2QndFLE9BRHVCLENBQ2xDeEUsTUFEa0M7O0FBRTFDLFNBQU9BLFdBQVdaLFNBQVNZLE1BQXBCLElBQThCWixTQUFTb0ksS0FBVCxDQUFlLFVBQUNoSSxPQUFELEVBQWE7QUFDL0QsU0FBSyxJQUFJWSxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLE1BQXBCLEVBQTRCSSxHQUE1QixFQUFpQztBQUMvQixVQUFJb0UsUUFBUXBFLENBQVIsTUFBZVosT0FBbkIsRUFBNEI7QUFDMUIsZUFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELFdBQU8sS0FBUDtBQUNELEdBUG9DLENBQXJDO0FBUUQ7Ozs7Ozs7Ozs7Ozs7Ozs7a0JDeE11QjBKLEs7QUFqQnhCOzs7Ozs7QUFNQTs7OztBQUlBOzs7Ozs7O0FBT2UsU0FBU0EsS0FBVCxDQUFnQjFKLE9BQWhCLEVBQXlCWixPQUF6QixFQUFrQztBQUMvQztBQUNBLE1BQUksSUFBSixFQUFxQjtBQUNuQixXQUFPLEtBQVA7QUFDRCxHQUZELE1BRU87QUFDTHVLLFdBQU9qSyxRQUFQLEdBQWtCTixRQUFRd0ssT0FBUixJQUFvQixZQUFNO0FBQzFDLFVBQUkvSixPQUFPRyxPQUFYO0FBQ0EsYUFBT0gsS0FBS0osTUFBWixFQUFvQjtBQUNsQkksZUFBT0EsS0FBS0osTUFBWjtBQUNEO0FBQ0QsYUFBT0ksSUFBUDtBQUNELEtBTm9DLEVBQXJDO0FBT0Q7O0FBRUQ7QUFDQSxNQUFNZ0ssbUJBQW1CNUgsT0FBTzZILGNBQVAsQ0FBc0IsSUFBdEIsQ0FBekI7O0FBRUE7QUFDQSxNQUFJLENBQUM3SCxPQUFPOEgsd0JBQVAsQ0FBZ0NGLGdCQUFoQyxFQUFrRCxXQUFsRCxDQUFMLEVBQXFFO0FBQ25FNUgsV0FBTytILGNBQVAsQ0FBc0JILGdCQUF0QixFQUF3QyxXQUF4QyxFQUFxRDtBQUNuREksa0JBQVksSUFEdUM7QUFFbkRDLFNBRm1ELGlCQUU1QztBQUNMLGVBQU8sS0FBSzVELFFBQUwsQ0FBY3pFLE1BQWQsQ0FBcUIsVUFBQ3lCLElBQUQsRUFBVTtBQUNwQztBQUNBLGlCQUFPQSxLQUFLWSxJQUFMLEtBQWMsS0FBZCxJQUF1QlosS0FBS1ksSUFBTCxLQUFjLFFBQXJDLElBQWlEWixLQUFLWSxJQUFMLEtBQWMsT0FBdEU7QUFDRCxTQUhNLENBQVA7QUFJRDtBQVBrRCxLQUFyRDtBQVNEOztBQUVELE1BQUksQ0FBQ2pDLE9BQU84SCx3QkFBUCxDQUFnQ0YsZ0JBQWhDLEVBQWtELFlBQWxELENBQUwsRUFBc0U7QUFDcEU7QUFDQTtBQUNBNUgsV0FBTytILGNBQVAsQ0FBc0JILGdCQUF0QixFQUF3QyxZQUF4QyxFQUFzRDtBQUNwREksa0JBQVksSUFEd0M7QUFFcERDLFNBRm9ELGlCQUU3QztBQUFBLFlBQ0dDLE9BREgsR0FDZSxJQURmLENBQ0dBLE9BREg7O0FBRUwsWUFBTTNILGtCQUFrQlAsT0FBT0MsSUFBUCxDQUFZaUksT0FBWixDQUF4QjtBQUNBLFlBQU1DLGVBQWU1SCxnQkFBZ0JMLE1BQWhCLENBQXVCLFVBQUNmLFVBQUQsRUFBYWtCLGFBQWIsRUFBNEJyQyxLQUE1QixFQUFzQztBQUNoRm1CLHFCQUFXbkIsS0FBWCxJQUFvQjtBQUNsQjhCLGtCQUFNTyxhQURZO0FBRWxCQyxtQkFBTzRILFFBQVE3SCxhQUFSO0FBRlcsV0FBcEI7QUFJQSxpQkFBT2xCLFVBQVA7QUFDRCxTQU5vQixFQU1sQixFQU5rQixDQUFyQjtBQU9BYSxlQUFPK0gsY0FBUCxDQUFzQkksWUFBdEIsRUFBb0MsUUFBcEMsRUFBOEM7QUFDNUNILHNCQUFZLEtBRGdDO0FBRTVDSSx3QkFBYyxLQUY4QjtBQUc1QzlILGlCQUFPQyxnQkFBZ0JoQztBQUhxQixTQUE5QztBQUtBLGVBQU80SixZQUFQO0FBQ0Q7QUFsQm1ELEtBQXREO0FBb0JEOztBQUVELE1BQUksQ0FBQ1AsaUJBQWlCbkksWUFBdEIsRUFBb0M7QUFDbEM7QUFDQTtBQUNBbUkscUJBQWlCbkksWUFBakIsR0FBZ0MsVUFBVUssSUFBVixFQUFnQjtBQUM5QyxhQUFPLEtBQUtvSSxPQUFMLENBQWFwSSxJQUFiLEtBQXNCLElBQTdCO0FBQ0QsS0FGRDtBQUdEOztBQUVELE1BQUksQ0FBQzhILGlCQUFpQlMsb0JBQXRCLEVBQTRDO0FBQzFDO0FBQ0E7QUFDQVQscUJBQWlCUyxvQkFBakIsR0FBd0MsVUFBVTNILE9BQVYsRUFBbUI7QUFDekQsVUFBTTRILGlCQUFpQixFQUF2QjtBQUNBQywwQkFBb0IsS0FBS2pFLFNBQXpCLEVBQW9DLFVBQUNxQyxVQUFELEVBQWdCO0FBQ2xELFlBQUlBLFdBQVc3RyxJQUFYLEtBQW9CWSxPQUFwQixJQUErQkEsWUFBWSxHQUEvQyxFQUFvRDtBQUNsRDRILHlCQUFlbEYsSUFBZixDQUFvQnVELFVBQXBCO0FBQ0Q7QUFDRixPQUpEO0FBS0EsYUFBTzJCLGNBQVA7QUFDRCxLQVJEO0FBU0Q7O0FBRUQsTUFBSSxDQUFDVixpQkFBaUJZLHNCQUF0QixFQUE4QztBQUM1QztBQUNBO0FBQ0FaLHFCQUFpQlksc0JBQWpCLEdBQTBDLFVBQVVyRSxTQUFWLEVBQXFCO0FBQzdELFVBQU02QyxRQUFRN0MsVUFBVXpFLElBQVYsR0FBaUJ1QixPQUFqQixDQUF5QixNQUF6QixFQUFpQyxHQUFqQyxFQUFzQ3RCLEtBQXRDLENBQTRDLEdBQTVDLENBQWQ7QUFDQSxVQUFNMkksaUJBQWlCLEVBQXZCO0FBQ0FDLDBCQUFvQixDQUFDLElBQUQsQ0FBcEIsRUFBNEIsVUFBQzVCLFVBQUQsRUFBZ0I7QUFDMUMsWUFBTThCLHNCQUFzQjlCLFdBQVd1QixPQUFYLENBQW1CaEUsS0FBL0M7QUFDQSxZQUFJdUUsdUJBQXVCekIsTUFBTWpCLEtBQU4sQ0FBWSxVQUFDakcsSUFBRDtBQUFBLGlCQUFVMkksb0JBQW9CckgsT0FBcEIsQ0FBNEJ0QixJQUE1QixJQUFvQyxDQUFDLENBQS9DO0FBQUEsU0FBWixDQUEzQixFQUEwRjtBQUN4RndJLHlCQUFlbEYsSUFBZixDQUFvQnVELFVBQXBCO0FBQ0Q7QUFDRixPQUxEO0FBTUEsYUFBTzJCLGNBQVA7QUFDRCxLQVZEO0FBV0Q7O0FBRUQsTUFBSSxDQUFDVixpQkFBaUJsSyxnQkFBdEIsRUFBd0M7QUFDdEM7QUFDQTtBQUNBa0sscUJBQWlCbEssZ0JBQWpCLEdBQW9DLFVBQVVnTCxTQUFWLEVBQXFCO0FBQUE7O0FBQ3ZEQSxrQkFBWUEsVUFBVXpILE9BQVYsQ0FBa0IsVUFBbEIsRUFBOEIsT0FBOUIsRUFBdUN2QixJQUF2QyxFQUFaLENBRHVELENBQ0c7O0FBRTFEO0FBQ0EsVUFBTWlKLGVBQWVDLGdCQUFnQkYsU0FBaEIsQ0FBckI7QUFDQSxVQUFNRyxXQUFXRixhQUFhbEssS0FBYixFQUFqQjs7QUFFQSxVQUFNcUssUUFBUUgsYUFBYXBLLE1BQTNCO0FBQ0EsYUFBT3NLLFNBQVMsSUFBVCxFQUFlakosTUFBZixDQUFzQixVQUFDeUIsSUFBRCxFQUFVO0FBQ3JDLFlBQUkwSCxPQUFPLENBQVg7QUFDQSxlQUFPQSxPQUFPRCxLQUFkLEVBQXFCO0FBQ25CekgsaUJBQU9zSCxhQUFhSSxJQUFiLEVBQW1CMUgsSUFBbkIsRUFBeUIsS0FBekIsQ0FBUDtBQUNBLGNBQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQUU7QUFDWCxtQkFBTyxLQUFQO0FBQ0Q7QUFDRDBILGtCQUFRLENBQVI7QUFDRDtBQUNELGVBQU8sSUFBUDtBQUNELE9BVk0sQ0FBUDtBQVdELEtBbkJEO0FBb0JEOztBQUVELE1BQUksQ0FBQ25CLGlCQUFpQnJCLFFBQXRCLEVBQWdDO0FBQzlCO0FBQ0FxQixxQkFBaUJyQixRQUFqQixHQUE0QixVQUFVeEksT0FBVixFQUFtQjtBQUM3QyxVQUFJaUwsWUFBWSxLQUFoQjtBQUNBVCwwQkFBb0IsQ0FBQyxJQUFELENBQXBCLEVBQTRCLFVBQUM1QixVQUFELEVBQWFzQyxJQUFiLEVBQXNCO0FBQ2hELFlBQUl0QyxlQUFlNUksT0FBbkIsRUFBNEI7QUFDMUJpTCxzQkFBWSxJQUFaO0FBQ0FDO0FBQ0Q7QUFDRixPQUxEO0FBTUEsYUFBT0QsU0FBUDtBQUNELEtBVEQ7QUFVRDs7QUFFRCxTQUFPLElBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsU0FBU0osZUFBVCxDQUEwQkYsU0FBMUIsRUFBcUM7QUFDbkMsU0FBT0EsVUFBVS9JLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUJ1SixPQUFyQixHQUErQnBILEdBQS9CLENBQW1DLFVBQUN2RSxRQUFELEVBQVd3TCxJQUFYLEVBQW9CO0FBQzVELFFBQU1GLFdBQVdFLFNBQVMsQ0FBMUI7O0FBRDRELDBCQUVyQ3hMLFNBQVNvQyxLQUFULENBQWUsR0FBZixDQUZxQztBQUFBO0FBQUEsUUFFckRzQyxJQUZxRDtBQUFBLFFBRS9Da0gsTUFGK0M7O0FBSTVELFFBQUlDLFdBQVcsSUFBZjtBQUNBLFFBQUlDLGNBQWMsSUFBbEI7O0FBRUEsWUFBUSxJQUFSOztBQUVFO0FBQ0EsV0FBSyxJQUFJaEgsSUFBSixDQUFTSixJQUFULENBQUw7QUFDRW9ILHNCQUFjLFNBQVNDLFdBQVQsQ0FBc0JqSSxJQUF0QixFQUE0QjtBQUN4QyxpQkFBTyxVQUFDK0gsUUFBRDtBQUFBLG1CQUFjQSxTQUFTL0gsS0FBSzdELE1BQWQsS0FBeUI2RCxLQUFLN0QsTUFBNUM7QUFBQSxXQUFQO0FBQ0QsU0FGRDtBQUdBOztBQUVBO0FBQ0YsV0FBSyxNQUFNNkUsSUFBTixDQUFXSixJQUFYLENBQUw7QUFBdUI7QUFDckIsY0FBTStFLFFBQVEvRSxLQUFLc0gsTUFBTCxDQUFZLENBQVosRUFBZTVKLEtBQWYsQ0FBcUIsR0FBckIsQ0FBZDtBQUNBeUoscUJBQVcsa0JBQUMvSCxJQUFELEVBQVU7QUFDbkIsZ0JBQU1tSSxnQkFBZ0JuSSxLQUFLNkcsT0FBTCxDQUFhaEUsS0FBbkM7QUFDQSxtQkFBT3NGLGlCQUFpQnhDLE1BQU1qQixLQUFOLENBQVksVUFBQ2pHLElBQUQ7QUFBQSxxQkFBVTBKLGNBQWNwSSxPQUFkLENBQXNCdEIsSUFBdEIsSUFBOEIsQ0FBQyxDQUF6QztBQUFBLGFBQVosQ0FBeEI7QUFDRCxXQUhEO0FBSUF1Six3QkFBYyxTQUFTSSxVQUFULENBQXFCcEksSUFBckIsRUFBMkJ6RCxJQUEzQixFQUFpQztBQUM3QyxnQkFBSWlMLFFBQUosRUFBYztBQUNaLHFCQUFPeEgsS0FBS21ILHNCQUFMLENBQTRCeEIsTUFBTW5FLElBQU4sQ0FBVyxHQUFYLENBQTVCLENBQVA7QUFDRDtBQUNELG1CQUFRLE9BQU94QixJQUFQLEtBQWdCLFVBQWpCLEdBQStCQSxLQUFLK0gsUUFBTCxDQUEvQixHQUFnRE0sWUFBWXJJLElBQVosRUFBa0J6RCxJQUFsQixFQUF3QndMLFFBQXhCLENBQXZEO0FBQ0QsV0FMRDtBQU1BO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLLE1BQU0vRyxJQUFOLENBQVdKLElBQVgsQ0FBTDtBQUF1QjtBQUFBLG9DQUNrQkEsS0FBS2hCLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLEVBQXpCLEVBQTZCdEIsS0FBN0IsQ0FBbUMsR0FBbkMsQ0FEbEI7QUFBQTtBQUFBLGNBQ2RnSyxZQURjO0FBQUEsY0FDQWhHLGNBREE7O0FBRXJCeUYscUJBQVcsa0JBQUMvSCxJQUFELEVBQVU7QUFDbkIsZ0JBQU11SSxlQUFlNUosT0FBT0MsSUFBUCxDQUFZb0IsS0FBSzZHLE9BQWpCLEVBQTBCOUcsT0FBMUIsQ0FBa0N1SSxZQUFsQyxJQUFrRCxDQUFDLENBQXhFO0FBQ0EsZ0JBQUlDLFlBQUosRUFBa0I7QUFBRTtBQUNsQixrQkFBSSxDQUFDakcsY0FBRCxJQUFvQnRDLEtBQUs2RyxPQUFMLENBQWF5QixZQUFiLE1BQStCaEcsY0FBdkQsRUFBd0U7QUFDdEUsdUJBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxtQkFBTyxLQUFQO0FBQ0QsV0FSRDtBQVNBMEYsd0JBQWMsU0FBU1EsY0FBVCxDQUF5QnhJLElBQXpCLEVBQStCekQsSUFBL0IsRUFBcUM7QUFDakQsZ0JBQUlpTCxRQUFKLEVBQWM7QUFDWixrQkFBTWlCLFdBQVcsRUFBakI7QUFDQXZCLGtDQUFvQixDQUFDbEgsSUFBRCxDQUFwQixFQUE0QixVQUFDc0YsVUFBRCxFQUFnQjtBQUMxQyxvQkFBSXlDLFNBQVN6QyxVQUFULENBQUosRUFBMEI7QUFDeEJtRCwyQkFBUzFHLElBQVQsQ0FBY3VELFVBQWQ7QUFDRDtBQUNGLGVBSkQ7QUFLQSxxQkFBT21ELFFBQVA7QUFDRDtBQUNELG1CQUFRLE9BQU96SSxJQUFQLEtBQWdCLFVBQWpCLEdBQStCQSxLQUFLK0gsUUFBTCxDQUEvQixHQUFnRE0sWUFBWXJJLElBQVosRUFBa0J6RCxJQUFsQixFQUF3QndMLFFBQXhCLENBQXZEO0FBQ0QsV0FYRDtBQVlBO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLLEtBQUsvRyxJQUFMLENBQVVKLElBQVYsQ0FBTDtBQUFzQjtBQUNwQixjQUFNOEgsS0FBSzlILEtBQUtzSCxNQUFMLENBQVksQ0FBWixDQUFYO0FBQ0FILHFCQUFXLGtCQUFDL0gsSUFBRCxFQUFVO0FBQ25CLG1CQUFPQSxLQUFLNkcsT0FBTCxDQUFhNkIsRUFBYixLQUFvQkEsRUFBM0I7QUFDRCxXQUZEO0FBR0FWLHdCQUFjLFNBQVNXLE9BQVQsQ0FBa0IzSSxJQUFsQixFQUF3QnpELElBQXhCLEVBQThCO0FBQzFDLGdCQUFJaUwsUUFBSixFQUFjO0FBQ1osa0JBQU1pQixXQUFXLEVBQWpCO0FBQ0F2QixrQ0FBb0IsQ0FBQ2xILElBQUQsQ0FBcEIsRUFBNEIsVUFBQ3NGLFVBQUQsRUFBYXNDLElBQWIsRUFBc0I7QUFDaEQsb0JBQUlHLFNBQVN6QyxVQUFULENBQUosRUFBMEI7QUFDeEJtRCwyQkFBUzFHLElBQVQsQ0FBY3VELFVBQWQ7QUFDQXNDO0FBQ0Q7QUFDRixlQUxEO0FBTUEscUJBQU9hLFFBQVA7QUFDRDtBQUNELG1CQUFRLE9BQU96SSxJQUFQLEtBQWdCLFVBQWpCLEdBQStCQSxLQUFLK0gsUUFBTCxDQUEvQixHQUFnRE0sWUFBWXJJLElBQVosRUFBa0J6RCxJQUFsQixFQUF3QndMLFFBQXhCLENBQXZEO0FBQ0QsV0FaRDtBQWFBO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLLEtBQUsvRyxJQUFMLENBQVVKLElBQVYsQ0FBTDtBQUFzQjtBQUNwQm1ILHFCQUFXO0FBQUEsbUJBQU0sSUFBTjtBQUFBLFdBQVg7QUFDQUMsd0JBQWMsU0FBU1ksY0FBVCxDQUF5QjVJLElBQXpCLEVBQStCekQsSUFBL0IsRUFBcUM7QUFDakQsZ0JBQUlpTCxRQUFKLEVBQWM7QUFDWixrQkFBTWlCLFdBQVcsRUFBakI7QUFDQXZCLGtDQUFvQixDQUFDbEgsSUFBRCxDQUFwQixFQUE0QixVQUFDc0YsVUFBRDtBQUFBLHVCQUFnQm1ELFNBQVMxRyxJQUFULENBQWN1RCxVQUFkLENBQWhCO0FBQUEsZUFBNUI7QUFDQSxxQkFBT21ELFFBQVA7QUFDRDtBQUNELG1CQUFRLE9BQU96SSxJQUFQLEtBQWdCLFVBQWpCLEdBQStCQSxLQUFLK0gsUUFBTCxDQUEvQixHQUFnRE0sWUFBWXJJLElBQVosRUFBa0J6RCxJQUFsQixFQUF3QndMLFFBQXhCLENBQXZEO0FBQ0QsV0FQRDtBQVFBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNFQSxtQkFBVyxrQkFBQy9ILElBQUQsRUFBVTtBQUNuQixpQkFBT0EsS0FBS3ZCLElBQUwsS0FBY21DLElBQXJCO0FBQ0QsU0FGRDtBQUdBb0gsc0JBQWMsU0FBUzdHLFFBQVQsQ0FBbUJuQixJQUFuQixFQUF5QnpELElBQXpCLEVBQStCO0FBQzNDLGNBQUlpTCxRQUFKLEVBQWM7QUFDWixnQkFBTWlCLFdBQVcsRUFBakI7QUFDQXZCLGdDQUFvQixDQUFDbEgsSUFBRCxDQUFwQixFQUE0QixVQUFDc0YsVUFBRCxFQUFnQjtBQUMxQyxrQkFBSXlDLFNBQVN6QyxVQUFULENBQUosRUFBMEI7QUFDeEJtRCx5QkFBUzFHLElBQVQsQ0FBY3VELFVBQWQ7QUFDRDtBQUNGLGFBSkQ7QUFLQSxtQkFBT21ELFFBQVA7QUFDRDtBQUNELGlCQUFRLE9BQU96SSxJQUFQLEtBQWdCLFVBQWpCLEdBQStCQSxLQUFLK0gsUUFBTCxDQUEvQixHQUFnRE0sWUFBWXJJLElBQVosRUFBa0J6RCxJQUFsQixFQUF3QndMLFFBQXhCLENBQXZEO0FBQ0QsU0FYRDtBQTdGSjs7QUEyR0EsUUFBSSxDQUFDRCxNQUFMLEVBQWE7QUFDWCxhQUFPRSxXQUFQO0FBQ0Q7O0FBRUQsUUFBTWEsT0FBT2YsT0FBT2pJLEtBQVAsQ0FBYSx5QkFBYixDQUFiO0FBQ0EsUUFBTWlKLE9BQU9ELEtBQUssQ0FBTCxDQUFiO0FBQ0EsUUFBTWxNLFFBQVFvTSxTQUFTRixLQUFLLENBQUwsQ0FBVCxFQUFrQixFQUFsQixJQUF3QixDQUF0Qzs7QUFFQSxRQUFNRyxpQkFBaUIsU0FBakJBLGNBQWlCLENBQUNoSixJQUFELEVBQVU7QUFDL0IsVUFBSUEsSUFBSixFQUFVO0FBQ1IsWUFBSWlKLGFBQWFqSixLQUFLN0QsTUFBTCxDQUFZOEcsU0FBN0I7QUFDQSxZQUFJNkYsU0FBUyxNQUFiLEVBQXFCO0FBQ25CRyx1QkFBYUEsV0FBVzFLLE1BQVgsQ0FBa0J3SixRQUFsQixDQUFiO0FBQ0Q7QUFDRCxZQUFNbUIsWUFBWUQsV0FBV0UsU0FBWCxDQUFxQixVQUFDakcsS0FBRDtBQUFBLGlCQUFXQSxVQUFVbEQsSUFBckI7QUFBQSxTQUFyQixDQUFsQjtBQUNBLFlBQUlrSixjQUFjdk0sS0FBbEIsRUFBeUI7QUFDdkIsaUJBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxhQUFPLEtBQVA7QUFDRCxLQVpEOztBQWNBLFdBQU8sU0FBU3lNLGtCQUFULENBQTZCcEosSUFBN0IsRUFBbUM7QUFDeEMsVUFBTUgsUUFBUW1JLFlBQVloSSxJQUFaLENBQWQ7QUFDQSxVQUFJd0gsUUFBSixFQUFjO0FBQ1osZUFBTzNILE1BQU1oQixNQUFOLENBQWEsVUFBQzRKLFFBQUQsRUFBV1ksV0FBWCxFQUEyQjtBQUM3QyxjQUFJTCxlQUFlSyxXQUFmLENBQUosRUFBaUM7QUFDL0JaLHFCQUFTMUcsSUFBVCxDQUFjc0gsV0FBZDtBQUNEO0FBQ0QsaUJBQU9aLFFBQVA7QUFDRCxTQUxNLEVBS0osRUFMSSxDQUFQO0FBTUQ7QUFDRCxhQUFPTyxlQUFlbkosS0FBZixLQUF5QkEsS0FBaEM7QUFDRCxLQVhEO0FBWUQsR0FwSk0sQ0FBUDtBQXFKRDs7QUFFRDs7Ozs7O0FBTUEsU0FBU3FILG1CQUFULENBQThCekgsS0FBOUIsRUFBcUM2SixPQUFyQyxFQUE4QztBQUM1QzdKLFFBQU1oRCxPQUFOLENBQWMsVUFBQ3VELElBQUQsRUFBVTtBQUN0QixRQUFJdUosV0FBVyxJQUFmO0FBQ0FELFlBQVF0SixJQUFSLEVBQWM7QUFBQSxhQUFNdUosV0FBVyxLQUFqQjtBQUFBLEtBQWQ7QUFDQSxRQUFJdkosS0FBS2lELFNBQUwsSUFBa0JzRyxRQUF0QixFQUFnQztBQUM5QnJDLDBCQUFvQmxILEtBQUtpRCxTQUF6QixFQUFvQ3FHLE9BQXBDO0FBQ0Q7QUFDRixHQU5EO0FBT0Q7O0FBRUQ7Ozs7Ozs7O0FBUUEsU0FBU2pCLFdBQVQsQ0FBc0JySSxJQUF0QixFQUE0QnpELElBQTVCLEVBQWtDd0wsUUFBbEMsRUFBNEM7QUFDMUMsU0FBTy9ILEtBQUs3RCxNQUFaLEVBQW9CO0FBQ2xCNkQsV0FBT0EsS0FBSzdELE1BQVo7QUFDQSxRQUFJNEwsU0FBUy9ILElBQVQsQ0FBSixFQUFvQjtBQUNsQixhQUFPQSxJQUFQO0FBQ0Q7QUFDRCxRQUFJQSxTQUFTekQsSUFBYixFQUFtQjtBQUNqQjtBQUNEO0FBQ0Y7QUFDRCxTQUFPLElBQVA7QUFDRDs7Ozs7Ozs7Ozs7Ozs7OFFDelZEOzs7Ozs7OztRQThCZ0JpTixpQixHQUFBQSxpQjtRQW1DQUMsZ0IsR0FBQUEsZ0I7a0JBcUZRQyxnQjs7QUFoSnhCOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7QUFPTyxTQUFTRixpQkFBVCxDQUE0QjlNLE9BQTVCLEVBQW1EO0FBQUEsTUFBZFosT0FBYyx1RUFBSixFQUFJOzs7QUFFeEQsTUFBSVksUUFBUXVFLFFBQVIsS0FBcUIsQ0FBekIsRUFBNEI7QUFDMUJ2RSxjQUFVQSxRQUFRRyxVQUFsQjtBQUNEOztBQUVELE1BQUlILFFBQVF1RSxRQUFSLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCLFVBQU0sSUFBSThDLEtBQUosZ0dBQXNHckgsT0FBdEcseUNBQXNHQSxPQUF0RyxVQUFOO0FBQ0Q7O0FBRUQsTUFBTXNILGlCQUFpQixxQkFBTXRILE9BQU4sRUFBZVosT0FBZixDQUF2Qjs7QUFFQSxNQUFNSSxXQUFXLHFCQUFNUSxPQUFOLEVBQWVaLE9BQWYsQ0FBakI7QUFDQSxNQUFNZ0osWUFBWSx3QkFBUzVJLFFBQVQsRUFBbUJRLE9BQW5CLEVBQTRCWixPQUE1QixDQUFsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQUlrSSxjQUFKLEVBQW9CO0FBQ2xCLFdBQU8sSUFBUDtBQUNEOztBQUVELFNBQU9jLFNBQVA7QUFDRDs7QUFFRDs7Ozs7OztBQU9PLFNBQVMyRSxnQkFBVCxDQUEyQm5OLFFBQTNCLEVBQW1EO0FBQUEsTUFBZFIsT0FBYyx1RUFBSixFQUFJOzs7QUFFeEQsTUFBSSxDQUFDNkQsTUFBTWEsT0FBTixDQUFjbEUsUUFBZCxDQUFMLEVBQThCO0FBQzVCQSxlQUFXLGdDQUFnQkEsUUFBaEIsQ0FBWDtBQUNEOztBQUVELE1BQUlBLFNBQVNrQixJQUFULENBQWMsVUFBQ2QsT0FBRDtBQUFBLFdBQWFBLFFBQVF1RSxRQUFSLEtBQXFCLENBQWxDO0FBQUEsR0FBZCxDQUFKLEVBQXdEO0FBQ3RELFVBQU0sSUFBSThDLEtBQUosQ0FBVSx3RkFBVixDQUFOO0FBQ0Q7O0FBRUQsTUFBTUMsaUJBQWlCLHFCQUFNMUgsU0FBUyxDQUFULENBQU4sRUFBbUJSLE9BQW5CLENBQXZCO0FBQ0EsTUFBTXdFLFNBQVMsdUJBQVV4RSxPQUFWLENBQWY7O0FBRUEsTUFBTXVCLFdBQVcsK0JBQWtCZixRQUFsQixFQUE0QlIsT0FBNUIsQ0FBakI7QUFDQSxNQUFNNk4sbUJBQW1CSCxrQkFBa0JuTSxRQUFsQixFQUE0QnZCLE9BQTVCLENBQXpCOztBQUVBO0FBQ0EsTUFBTThOLGtCQUFrQkMsbUJBQW1Cdk4sUUFBbkIsQ0FBeEI7QUFDQSxNQUFNd04scUJBQXFCRixnQkFBZ0IsQ0FBaEIsQ0FBM0I7O0FBRUEsTUFBTTFOLFdBQVcsd0JBQVl5TixnQkFBWixTQUFnQ0csa0JBQWhDLEVBQXNEeE4sUUFBdEQsRUFBZ0VSLE9BQWhFLENBQWpCO0FBQ0EsTUFBTWlPLGtCQUFrQixnQ0FBZ0J6SixPQUFPcEUsUUFBUCxDQUFoQixDQUF4Qjs7QUFFQSxNQUFJLENBQUNJLFNBQVNvSSxLQUFULENBQWUsVUFBQ2hJLE9BQUQ7QUFBQSxXQUFhcU4sZ0JBQWdCdk0sSUFBaEIsQ0FBcUIsVUFBQ2dCLEtBQUQ7QUFBQSxhQUFXQSxVQUFVOUIsT0FBckI7QUFBQSxLQUFyQixDQUFiO0FBQUEsR0FBZixDQUFMLEVBQXVGO0FBQ3JGO0FBQ0EsV0FBTzBHLFFBQVFDLElBQVIseUlBR0ovRyxRQUhJLENBQVA7QUFJRDs7QUFFRCxNQUFJMEgsY0FBSixFQUFvQjtBQUNsQixXQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFPOUgsUUFBUDtBQUNEOztBQUVEOzs7Ozs7QUFNQSxTQUFTMk4sa0JBQVQsQ0FBNkJ2TixRQUE3QixFQUF1QztBQUFBLDZCQUVBLGlDQUFvQkEsUUFBcEIsQ0FGQTtBQUFBLE1BRTdCdUIsT0FGNkIsd0JBRTdCQSxPQUY2QjtBQUFBLE1BRXBCQyxVQUZvQix3QkFFcEJBLFVBRm9CO0FBQUEsTUFFUkMsR0FGUSx3QkFFUkEsR0FGUTs7QUFJckMsTUFBTWlNLGVBQWUsRUFBckI7O0FBRUEsTUFBSWpNLEdBQUosRUFBUztBQUNQaU0saUJBQWFqSSxJQUFiLENBQWtCaEUsR0FBbEI7QUFDRDs7QUFFRCxNQUFJRixPQUFKLEVBQWE7QUFDWCxRQUFNb00sZ0JBQWdCcE0sUUFBUTRDLEdBQVIsQ0FBWSxVQUFDaEMsSUFBRDtBQUFBLG1CQUFjQSxJQUFkO0FBQUEsS0FBWixFQUFrQytDLElBQWxDLENBQXVDLEVBQXZDLENBQXRCO0FBQ0F3SSxpQkFBYWpJLElBQWIsQ0FBa0JrSSxhQUFsQjtBQUNEOztBQUVELE1BQUluTSxVQUFKLEVBQWdCO0FBQ2QsUUFBTW9NLG9CQUFvQnZMLE9BQU9DLElBQVAsQ0FBWWQsVUFBWixFQUF3QmUsTUFBeEIsQ0FBK0IsVUFBQ3NMLEtBQUQsRUFBUTFMLElBQVIsRUFBaUI7QUFDeEUwTCxZQUFNcEksSUFBTixPQUFldEQsSUFBZixVQUF3QlgsV0FBV1csSUFBWCxDQUF4QjtBQUNBLGFBQU8wTCxLQUFQO0FBQ0QsS0FIeUIsRUFHdkIsRUFIdUIsRUFHbkIzSSxJQUhtQixDQUdkLEVBSGMsQ0FBMUI7QUFJQXdJLGlCQUFhakksSUFBYixDQUFrQm1JLGlCQUFsQjtBQUNEOztBQUVELE1BQUlGLGFBQWE5TSxNQUFqQixFQUF5QjtBQUN2QjtBQUNEOztBQUVELFNBQU8sQ0FDTDhNLGFBQWF4SSxJQUFiLENBQWtCLEVBQWxCLENBREssQ0FBUDtBQUdEOztBQUVEOzs7Ozs7Ozs7QUFTZSxTQUFTa0ksZ0JBQVQsQ0FBMkJVLEtBQTNCLEVBQWdEO0FBQUEsTUFBZHRPLE9BQWMsdUVBQUosRUFBSTs7QUFDN0QsTUFBSXNPLE1BQU1sTixNQUFOLElBQWdCLENBQUNrTixNQUFNM0wsSUFBM0IsRUFBaUM7QUFDL0IsV0FBT2dMLGlCQUFpQlcsS0FBakIsRUFBd0J0TyxPQUF4QixDQUFQO0FBQ0Q7QUFDRCxNQUFNOEYsU0FBUzRILGtCQUFrQlksS0FBbEIsRUFBeUJ0TyxPQUF6QixDQUFmO0FBQ0EsTUFBSUEsV0FBVyxDQUFDLENBQUQsRUFBSSxPQUFKLEVBQWF1TyxRQUFiLENBQXNCdk8sUUFBUUMsTUFBOUIsQ0FBZixFQUFzRDtBQUNwRCxXQUFPLHlCQUFVNkYsTUFBVixDQUFQO0FBQ0Q7O0FBRUQsU0FBT0EsTUFBUDtBQUNELEM7Ozs7Ozs7QUNoS0Q7O0FBRUEsQ0FBQyxZQUFZO0FBQ1gsTUFBSTBJLGlCQUF5QixTQUF6QkEsY0FBeUIsQ0FBVUMsQ0FBVixFQUFhO0FBQ3BDLFdBQU8sZ0JBQ0VBLEtBQUssbUJBRFAsSUFFQyxrQ0FGRCxHQUdDLG1DQUhSO0FBSUQsR0FMTDtBQUFBLE1BTUlDLGtCQUF5QixTQUF6QkEsZUFBeUIsQ0FBVUMsRUFBVixFQUFjQyxFQUFkLEVBQWtCO0FBQ3pDLFdBQU8sZUFBZUQsRUFBZixHQUFvQixHQUFwQixHQUNDLGdCQURELEdBQ29CQSxFQURwQixHQUN5QixrQkFEekIsR0FDOENDLEVBRDlDLEdBQ21ELE9BRG5ELEdBQzZEQSxFQURwRTtBQUVELEdBVEw7QUFBQSxNQVVJQyxZQUF5QixTQUF6QkEsU0FBeUIsQ0FBVUosQ0FBVixFQUFhO0FBQ3BDLFdBQU8sOENBQ0VBLEtBQUtLLGVBRFAsSUFDMEIsbUJBRGpDO0FBRUQsR0FiTDtBQUFBLE1BY0lDLGlCQUF5QixTQUF6QkEsY0FBeUIsQ0FBVU4sQ0FBVixFQUFhO0FBQ3BDLFdBQU8sc0JBQXNCQSxLQUFLSyxlQUEzQixJQUE4QyxPQUFyRDtBQUNELEdBaEJMO0FBQUEsTUFpQklFLG1CQUF5QixTQUF6QkEsZ0JBQXlCLENBQVVQLENBQVYsRUFBYTtBQUNwQyxXQUFPLDhDQUNDQSxLQUFLSyxlQUROLElBQ3lCLG1CQURoQztBQUVELEdBcEJMO0FBQUEsTUFxQklBLGtCQUF5QixZQXJCN0I7QUFBQSxNQXNCSUcsbUJBQXlCVCxnQkF0QjdCO0FBQUEsTUF1QklVLGVBQXlCLGtDQXZCN0I7QUFBQSxNQXdCSUMsZ0JBQXlCSixlQUFlRixVQUFVSyxZQUFWLENBQWYsQ0F4QjdCO0FBQUEsTUF5QklFLHFCQUF5QixrQkFBa0JOLGVBQWxCLEdBQW9DLDZCQUFwQyxHQUFvRUEsZUFBcEUsR0FBc0YsZUF6Qm5IO0FBQUEsTUEwQklPLG9CQUF5QixpQkFBaUJSLFdBQWpCLEdBQStCLEdBQS9CLEdBQXFDRyxpQkFBaUJFLFlBQWpCLENBQXJDLEdBQXNFLE9BQXRFLEdBQWdGUixnQkFBZ0JNLGtCQUFoQixFQUFvQ0EsaUJBQWlCRSxZQUFqQixDQUFwQyxDQTFCN0c7QUFBQSxNQTJCSUksaUJBQXlCLE1BQU1GLGtCQUFOLEdBQTJCLG1CQUEzQixHQUFpRFAsV0FBakQsR0FBK0QsR0FBL0QsR0FBcUVBLFVBQVVLLFlBQVYsQ0FBckUsR0FBK0YsSUEzQjVIO0FBQUEsTUE0QklLLGdCQUF5QixpQkFBaUJULGVBQWpCLEdBQW1DLE9BNUJoRTtBQUFBLE1BNkJJVSxzQkFBeUIsaUJBQWlCVCxnQkFBakIsR0FBb0MsR0FBcEMsR0FBMENJLGFBQTFDLEdBQTBELEdBN0J2RjtBQUFBLE1BOEJJTSx3QkFBeUIsbUJBOUI3QjtBQUFBLE1BK0JJQyxpQkFBeUIsVUFBVU4sa0JBQVYsR0FBK0IsT0FBL0IsR0FBeUNDLGlCQUF6QyxHQUE2RCxHQS9CMUY7QUFBQSxNQWdDSU0saUJBQXlCLE1BQU1QLGtCQUFOLEdBQTJCLFdBQTNCLEdBQXlDQyxpQkFBekMsR0FBNkQsSUFoQzFGO0FBQUEsTUFpQ0lPLGlCQUF5QkMsT0FBT0MsWUFBUCxDQUFvQixFQUFwQixDQWpDN0I7QUFBQSxNQWtDSUMsZ0JBQXlCRixPQUFPQyxZQUFQLENBQW9CLEVBQXBCLENBbEM3QjtBQUFBLE1BbUNJRSx1QkFBeUIsNkNBbkM3QjtBQUFBLE1Bb0NJQyx3QkFBeUIsb0JBcEM3QjtBQUFBLE1BcUNJQyx3QkFBeUIsMERBckM3QjtBQUFBLE1Bc0NJQyxxQkFBeUIsZUF0QzdCO0FBQUEsTUF1Q0lDLG1CQUF5QiwyQ0F2QzdCO0FBQUEsTUF3Q0lDLHNCQUF5QixjQXhDN0I7QUFBQSxNQXlDSUMsb0JBQXlCLHdCQXpDN0I7QUFBQSxNQTBDSUMscUJBQXlCLHlCQTFDN0I7QUFBQSxNQTJDSUMsd0JBQXlCLGtIQTNDN0I7QUFBQSxNQTRDSUMsMkJBQTJCLFNBQTNCQSx3QkFBMkIsQ0FBVTFNLEtBQVYsRUFBaUIyTSxRQUFqQixFQUEyQkMsSUFBM0IsRUFBaUNDLElBQWpDLEVBQXVDQyxPQUF2QyxFQUFnREMsT0FBaEQsRUFBeURDLE1BQXpELEVBQWlFQyxJQUFqRSxFQUF1RTtBQUNoRyxRQUFJQyxTQUFTLEVBQWIsQ0FEZ0csQ0FDL0U7O0FBRWpCO0FBQ0E7QUFDQSxRQUFJUCxhQUFhLEdBQWIsSUFBb0JJLFlBQVl6TyxTQUFwQyxFQUErQztBQUM3QyxhQUFPMEIsS0FBUDtBQUNEOztBQUVELFFBQUk0TSxTQUFTdE8sU0FBYixFQUF3QjtBQUN0QjtBQUNBO0FBQ0EsVUFBSXVPLFNBQVN2TyxTQUFULElBQXVCdU8sU0FBUyxPQUFULElBQW9CQSxTQUFTLE9BQTdCLElBQXdDQSxTQUFTLFVBQTVFLEVBQXdHO0FBQ3RHO0FBQ0QsT0FGRCxNQUVPLElBQUlDLFlBQVl4TyxTQUFoQixFQUEyQjtBQUNoQ3dPLGtCQUFVRCxJQUFWO0FBQ0QsT0FQcUIsQ0FPcEI7O0FBRUE7QUFDQTtBQUNGLFVBQUlNLFVBQVVMLE9BQVYsQ0FBSixFQUF3QjtBQUN0QixlQUFPOU0sS0FBUDtBQUNEOztBQUVELFVBQUlvTixXQUFXSCxLQUFLaEgsTUFBTCxDQUFZK0csU0FBUyxDQUFyQixDQUFmOztBQUVBLFVBQUlJLFNBQVMvUCxNQUFULEtBQW9CLENBQXBCLElBQ0UrUCxhQUFhLEdBRGYsSUFFRUEsYUFBYSxHQUZmLElBR0VBLGFBQWEsR0FIbkIsRUFHd0I7QUFDdEJGLGlCQUFTLEdBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0EsUUFBSUosWUFBWXhPLFNBQWhCLEVBQTJCO0FBQ3pCLFVBQUkwTyxTQUFTaE4sTUFBTTNDLE1BQWYsS0FBMEI0UCxLQUFLNVAsTUFBbkMsRUFBMkM7QUFDekN5UCxrQkFBVSxHQUFWO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZUFBTzlNLEtBQVA7QUFDRDtBQUNGOztBQUdELFlBQVEyTSxRQUFSO0FBQ0EsV0FBSyxHQUFMO0FBQ0UsZUFBTyxPQUFPRyxPQUFkO0FBQ0YsV0FBSyxHQUFMO0FBQ0UsZUFBTyxNQUFNQSxPQUFiO0FBQ0YsV0FBSyxHQUFMO0FBQ0UsZUFBT0ksU0FBUyxpQ0FBVCxHQUE2Q0osT0FBcEQ7QUFDRixXQUFLLEdBQUw7QUFDRSxlQUFPSSxTQUFTLHNCQUFULEdBQWtDSixPQUF6QztBQUNGLFdBQUssR0FBTDtBQUNFLFlBQUlGLFNBQVN0TyxTQUFiLEVBQXdCLENBRXZCO0FBQ0RzTyxlQUFPLEtBQVA7QUFDQSxlQUFPLE1BQU1BLElBQU4sR0FBYUUsT0FBcEI7QUFDRixXQUFLLEdBQUw7QUFBVTtBQUNSLGVBQU8sd0JBQXdCQSxPQUEvQjtBQUNGLFdBQUssSUFBTDtBQUFXO0FBQ1QsZUFBTyw2QkFBNkJBLE9BQXBDO0FBQ0YsV0FBSyxJQUFMO0FBQVc7QUFDVCxlQUFPLHdCQUF3QkEsT0FBL0I7QUFDRixXQUFLLElBQUw7QUFBVztBQUNULGVBQU8sY0FBY0EsT0FBckI7QUFDRixXQUFLLElBQUw7QUFBVztBQUNULGVBQU8sb0NBQW9DQSxPQUEzQztBQUNGLFdBQUssSUFBTDtBQUFXO0FBQ1QsZUFBTyx5QkFBeUJBLE9BQWhDO0FBQ0U7QUFDQTtBQTVCSjtBQThCRCxHQXRITDtBQUFBLE1Bd0hJTyx1QkFBdUIsK0VBeEgzQjtBQUFBLE1BeUhJQywwQkFBMEIsU0FBMUJBLHVCQUEwQixDQUFVQyxHQUFWLEVBQWVDLElBQWYsRUFBcUJDLElBQXJCLEVBQTJCQyxFQUEzQixFQUErQm5MLEdBQS9CLEVBQW9DeUssTUFBcEMsRUFBNENDLElBQTVDLEVBQWtEO0FBQzFFLFFBQUlMLE9BQU8sRUFBWDtBQUNBLFFBQUlRLFdBQVdILEtBQUtoSCxNQUFMLENBQVkrRyxTQUFTLENBQXJCLENBQWY7O0FBRUE7Ozs7O0FBS0EsWUFBUVUsRUFBUjtBQUNBLFdBQUssR0FBTDtBQUNFLGVBQU9kLE9BQU8sUUFBUCxHQUFrQlksSUFBbEIsR0FBeUIsUUFBekIsR0FBb0NBLElBQXBDLEdBQTJDLEtBQTNDLEdBQW1EakwsR0FBbkQsR0FBeUQsSUFBaEU7QUFDRixXQUFLLEdBQUw7QUFDRSxlQUFPcUssT0FBTyxjQUFQLEdBQXdCWSxJQUF4QixHQUErQixrQkFBL0IsR0FBb0RBLElBQXBELEdBQTJELG9CQUEzRCxHQUFrRmpMLEdBQWxGLEdBQXdGLFVBQXhGLEdBQXFHQSxHQUFyRyxHQUEyRyxJQUFsSDtBQUNGLFdBQUssR0FBTDtBQUNFLGVBQU9xSyxPQUFPLGdCQUFQLEdBQTBCWSxJQUExQixHQUFpQyxJQUFqQyxHQUF3Q2pMLEdBQXhDLEdBQThDLEtBQXJEO0FBQ0YsV0FBSyxHQUFMO0FBQ0UsZUFBT3FLLE9BQU8sd0NBQVAsR0FBa0RZLElBQWxELEdBQXlELHFCQUF6RCxHQUFpRmpMLEdBQWpGLEdBQXVGLFVBQTlGO0FBQ0YsV0FBSyxHQUFMO0FBQ0UsZUFBT3FLLE9BQU8sYUFBUCxHQUF1QlksSUFBdkIsR0FBOEIsSUFBOUIsR0FBcUNqTCxHQUFyQyxHQUEyQyxLQUFsRDtBQUNGLFdBQUssR0FBTDtBQUNFLGVBQU9xSyxPQUFPLElBQVAsR0FBY1ksSUFBZCxHQUFxQixJQUFyQixHQUE0QmpMLEdBQTVCLEdBQWtDLG9CQUFsQyxHQUF5RGlMLElBQXpELEdBQWdFLFdBQWhFLEdBQThFakwsR0FBOUUsR0FBb0YsVUFBM0Y7QUFDRjtBQUNFLFlBQUlrTCxTQUFTblAsU0FBYixFQUF3QjtBQUN0QixjQUFJa1AsS0FBS3ZILE1BQUwsQ0FBWXVILEtBQUtuUSxNQUFMLEdBQWMsQ0FBMUIsTUFBaUMsR0FBakMsSUFBd0NtUSxLQUFLRyxNQUFMLENBQVksVUFBWixNQUE0QixDQUFDLENBQXJFLElBQTBFSCxLQUFLdE4sT0FBTCxDQUFhLEdBQWIsTUFBc0IsQ0FBQyxDQUFyRyxFQUErSDtBQUM3SCxtQkFBT3FOLEdBQVA7QUFDRDtBQUNELGlCQUFPWCxPQUFPLElBQVAsR0FBY1ksSUFBZCxHQUFxQixHQUE1QjtBQUNELFNBTEQsTUFLTztBQUNMLGlCQUFPWixPQUFPLElBQVAsR0FBY1ksSUFBZCxHQUFxQixJQUFyQixHQUE0QmpMLEdBQTVCLEdBQWtDLElBQXpDO0FBQ0Q7QUFyQkg7QUF1QkQsR0F6Skw7QUFBQSxNQTJKSXFMLDJCQUEyQix1REEzSi9CO0FBQUEsTUE0SklDLDhCQUE4QixTQUE5QkEsMkJBQThCLENBQVU3TixLQUFWLEVBQWlCcEIsSUFBakIsRUFBdUJrUCxFQUF2QixFQUEyQkMsRUFBM0IsRUFBK0JDLEdBQS9CLEVBQW9DQyxFQUFwQyxFQUF3Q0MsRUFBeEMsRUFBNENDLEVBQTVDLEVBQWdEbkIsTUFBaEQsRUFBd0RDLElBQXhELEVBQThEO0FBQzFGLFFBQUlBLEtBQUtoSCxNQUFMLENBQVkrRyxTQUFTLENBQXJCLE1BQTRCLEdBQTVCLElBQW1DQyxLQUFLaEgsTUFBTCxDQUFZK0csU0FBUyxDQUFyQixNQUE0QixHQUFuRSxFQUF3RTtBQUNwRTtBQUNBO0FBQ0YsYUFBT2hOLEtBQVA7QUFDRDs7QUFFRCxRQUFJcEIsU0FBUyxLQUFULElBQWtCQSxTQUFTLE1BQS9CLEVBQXVDO0FBQ3JDb1AsWUFBT3BQLElBQVA7QUFDQUEsYUFBTyxhQUFQO0FBQ0Q7O0FBRUQsWUFBUUEsSUFBUixHQUFnQjtBQUNoQixXQUFLLE9BQUw7QUFDRSxlQUFPLFlBQVl3UCxVQUFVLGdCQUFnQkosR0FBMUIsRUFBK0IsSUFBL0IsQ0FBWixHQUFtRCxRQUExRDtBQUNGLFdBQUssZUFBTDtBQUNFLGVBQU8sWUFBWUksVUFBVSx3QkFBd0JKLEdBQWxDLEVBQXVDLElBQXZDLENBQVosR0FBMkQsUUFBbEU7QUFDRixXQUFLLFFBQUw7QUFDRSxlQUFPLFlBQVlJLFVBQVUsZ0JBQWdCSixHQUExQixFQUErQixJQUEvQixDQUFaLEdBQW1ELFFBQTFEO0FBQ0YsV0FBSyxnQkFBTDtBQUNFLGVBQU8sWUFBWUksVUFBVSx3QkFBd0JKLEdBQWxDLEVBQXVDLElBQXZDLENBQVosR0FBMkQsUUFBbEU7QUFDRixXQUFLLFNBQUw7QUFDRSxlQUFPLHlCQUFQO0FBQ0YsV0FBSyxVQUFMO0FBQ0UsZUFBTyxlQUFldEMscUJBQWYsR0FBdUMsR0FBdkMsR0FBNkNzQyxHQUE3QyxHQUFtRCxJQUExRDtBQUNGLFdBQUssV0FBTDtBQUNFLGVBQU8sZUFBZTlDLGdCQUFmLEdBQWtDLEdBQWxDLEdBQXdDVCxlQUFldUQsR0FBZixDQUF4QyxHQUE4RCxJQUFyRTtBQUNGLFdBQUssT0FBTDtBQUNFLGVBQU8scUNBQVA7QUFDRixXQUFLLFNBQUw7QUFDQSxXQUFLLFVBQUw7QUFDRSxlQUFPLE9BQU9wUCxJQUFQLEdBQWMsR0FBckI7QUFDRixXQUFLLGFBQUw7QUFDRSxlQUFPLDZCQUFQO0FBQ0YsV0FBSyxPQUFMO0FBQ0EsV0FBSyxPQUFMO0FBQ0EsV0FBSyxlQUFMO0FBQ0UsWUFBSW9QLFFBQVExUCxTQUFaLEVBQTBDO0FBQ3hDLGlCQUFPLGtCQUFrQjBQLEdBQWxCLEdBQXdCLEdBQS9CO0FBQ0Q7QUFDRCxlQUFPLEtBQVA7QUFDRixXQUFLLElBQUw7QUFDUTtBQUNOLGVBQU8sa0JBQWtCOUUsU0FBUzhFLEdBQVQsRUFBYyxFQUFkLElBQW9CLENBQXRDLElBQTJDLEdBQWxEO0FBQ0YsV0FBSyxJQUFMO0FBQ1E7QUFDTixlQUFPLGtCQUFrQjlFLFNBQVM4RSxHQUFULEVBQWMsRUFBZCxJQUFvQixDQUF0QyxJQUEyQyxHQUFsRDtBQUNGLFdBQUssWUFBTDtBQUNFLGVBQU8sNkJBQVA7QUFDRixXQUFLLFlBQUw7QUFDRSxlQUFPLDJEQUFQO0FBQ0YsV0FBSyxjQUFMO0FBQ0UsZUFBTyxpSEFBUDtBQUNGLFdBQUssV0FBTDtBQUNFLFlBQUliLFVBQVVhLEdBQVYsQ0FBSixFQUF1QztBQUNyQyxpQkFBTyx3Q0FBd0NBLEdBQXhDLEdBQThDLEdBQXJEO0FBQ0Q7QUFDRCxnQkFBUUEsR0FBUjtBQUNBLGVBQUssTUFBTDtBQUNFLG1CQUFPLDJDQUFQO0FBQ0YsZUFBSyxLQUFMO0FBQ0UsbUJBQU8sMkNBQVA7QUFDRjtBQUNFLGdCQUFJNUwsSUFBSSxDQUFDNEwsT0FBTyxHQUFSLEVBQWFqTyxPQUFiLENBQXFCeU0sa0JBQXJCLEVBQXlDLE9BQXpDLEVBQWtEL04sS0FBbEQsQ0FBd0QsR0FBeEQsQ0FBUjs7QUFFQTJELGNBQUUsQ0FBRixJQUFPQSxFQUFFLENBQUYsS0FBUSxHQUFmO0FBQ0FBLGNBQUUsQ0FBRixJQUFPQSxFQUFFLENBQUYsS0FBUSxHQUFmO0FBQ0EsbUJBQU8sdUNBQXVDQSxFQUFFLENBQUYsQ0FBdkMsR0FBOEMsd0NBQTlDLEdBQXlGQSxFQUFFLENBQUYsQ0FBekYsR0FBZ0csUUFBaEcsR0FBMkdBLEVBQUUsQ0FBRixDQUEzRyxHQUFrSCxLQUF6SDtBQVZGO0FBWUYsV0FBSyxhQUFMO0FBQ0UsWUFBSStLLFVBQVVhLEdBQVYsQ0FBSixFQUF1QztBQUNyQyxpQkFBTyxNQUFNQSxHQUFOLEdBQVksR0FBbkI7QUFDRDtBQUNELGdCQUFRQSxHQUFSO0FBQ0EsZUFBSyxLQUFMO0FBQ0UsbUJBQU8sc0JBQVA7QUFDRixlQUFLLE1BQUw7QUFDRSxtQkFBTyx3Q0FBUDtBQUNGO0FBQ0UsZ0JBQUk1TCxJQUFJLENBQUM0TCxPQUFPLEdBQVIsRUFBYWpPLE9BQWIsQ0FBcUJ5TSxrQkFBckIsRUFBeUMsT0FBekMsRUFBa0QvTixLQUFsRCxDQUF3RCxHQUF4RCxDQUFSOztBQUVBMkQsY0FBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixLQUFRLEdBQWY7QUFDQUEsY0FBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixLQUFRLEdBQWY7QUFDQSxtQkFBTyxrQkFBa0JBLEVBQUUsQ0FBRixDQUFsQixHQUF5QixtQkFBekIsR0FBK0NBLEVBQUUsQ0FBRixDQUEvQyxHQUFzRCxRQUF0RCxHQUFpRUEsRUFBRSxDQUFGLENBQWpFLEdBQXdFLEtBQS9FO0FBVkY7QUFZRixXQUFLLElBQUw7QUFDQSxXQUFLLEtBQUw7QUFDRTtBQUNBLFlBQUkrSyxVQUFVYSxHQUFWLENBQUosRUFBb0I7QUFDbEIsaUJBQU8sT0FBTzlFLFNBQVM4RSxHQUFULEVBQWMsRUFBZCxJQUFvQixDQUEzQixJQUFnQyxHQUF2QztBQUNEOztBQUVELGVBQU8sS0FBUDtBQUNGLFdBQUssTUFBTDtBQUNFLGVBQU8sZ0JBQVA7QUFDRixXQUFLLGNBQUw7QUFDRSxlQUFPLGtCQUFrQjlDLGdCQUFsQixHQUFxQyxHQUFyQyxHQUEyQ1QsZUFBZXVELEdBQWYsQ0FBM0MsR0FBaUUsSUFBeEU7QUFDRixXQUFLLGFBQUw7QUFDRSxlQUFPLGtCQUFrQnRDLHFCQUFsQixHQUEwQyxHQUExQyxHQUFnRHNDLEdBQWhELEdBQXNELElBQTdEO0FBQ0YsV0FBSyxZQUFMO0FBQ0UsZUFBTyxNQUFNckQsZ0JBQWdCTyxnQkFBaEIsRUFBa0NULGVBQWV1RCxHQUFmLENBQWxDLENBQU4sR0FBK0QsR0FBdEU7QUFDRixXQUFLLFdBQUw7QUFDRSxlQUFPLE1BQU1yRCxnQkFBZ0JlLHFCQUFoQixFQUF1Q3NDLEdBQXZDLENBQU4sR0FBb0QsR0FBM0Q7QUFDRixXQUFLLEtBQUw7QUFDRSxZQUFJSyxRQUFRQyxZQUFZRixVQUFVSixHQUFWLEVBQWUsSUFBZixDQUFaLEVBQWtDLEtBQWxDLENBQVo7O0FBRUEsZUFBTyxZQUFZSyxLQUFaLEdBQW9CLFFBQTNCO0FBQ0YsV0FBSyxhQUFMO0FBQ0UsWUFBSUEsUUFBUUQsVUFBVSx3QkFBd0JKLEdBQWxDLEVBQXVDLElBQXZDLENBQVo7O0FBRUEsZUFBTyxZQUFZSyxLQUFaLEdBQW9CLG9DQUFwQixHQUEyREEsTUFBTWhHLE1BQU4sQ0FBYSxFQUFiLENBQTNELEdBQThFLFFBQXJGO0FBQ0YsV0FBSyxZQUFMO0FBQ0UsZUFBTyxZQUFZK0YsVUFBVSxhQUFhSixHQUF2QixFQUE0QixJQUE1QixDQUFaLEdBQWdELFFBQXZEO0FBQ0YsV0FBSyxjQUFMO0FBQ0UsZUFBTyxZQUFZSSxVQUFVLGVBQWVKLEdBQXpCLEVBQThCLElBQTlCLENBQVosR0FBa0QsUUFBekQ7QUFDRixXQUFLLE1BQUw7QUFDQSxXQUFLLGNBQUw7QUFDRSxZQUFJQSxRQUFRMVAsU0FBWixFQUEwQztBQUN4QyxpQkFBTyx3QkFBd0IwUCxHQUF4QixHQUE4QixHQUFyQztBQUNEO0FBQ0QsZUFBTyxVQUFQO0FBQ0YsV0FBSyxVQUFMO0FBQWlCO0FBQ2YsZUFBTyx1Q0FBUDtBQUNGLFdBQUssTUFBTDtBQUNBLFdBQUssWUFBTDtBQUNFLGVBQU8saUJBQWlCQSxHQUFqQixHQUF1QixHQUE5QjtBQUNGLFdBQUssV0FBTDtBQUNFLFlBQUlBLFFBQVExUCxTQUFaLEVBQTBDO0FBQ3hDLGlCQUFPLHlCQUF5QjBQLEdBQXpCLEdBQStCLEdBQXRDO0FBQ0Q7QUFDRCxlQUFPLHFCQUFQO0FBQ0YsV0FBSyxNQUFMO0FBQ0UsZUFBTyxxQkFBUDtBQUNGLFdBQUssT0FBTDtBQUNFLFlBQUluTyxNQUFNbU8sSUFBSXZQLEtBQUosQ0FBVSxHQUFWLENBQVY7O0FBRUEsZUFBTyxNQUFNb0IsSUFBSSxDQUFKLENBQU4sR0FBZSwrQkFBZixHQUFpREEsSUFBSSxDQUFKLENBQWpELEdBQTBELEdBQWpFO0FBQ0YsV0FBSyxPQUFMO0FBQWM7QUFDWixlQUFPLHFHQUFQO0FBQ0YsV0FBSyxVQUFMO0FBQ0UsZUFBTzhMLGNBQVA7QUFDRixXQUFLLFVBQUw7QUFDRSxlQUFPQyxjQUFQO0FBQ0YsV0FBSyxNQUFMO0FBQ0EsV0FBSyxPQUFMO0FBQ0EsV0FBSyxRQUFMO0FBQ0EsV0FBSyxZQUFMO0FBQ0UsZUFBTyxnQ0FBZ0NoTixJQUFoQyxHQUF1QyxVQUE5QztBQUNGLFdBQUssUUFBTDtBQUNFLGVBQU8scUJBQXFCcU0sa0JBQXJCLEdBQTBDLG1CQUExQyxHQUFnRUEsaUJBQWlCRSxZQUFqQixDQUFoRSxHQUFpRyxHQUFqRyxHQUF1RzZDLEdBQXZHLEdBQTZHLGlCQUE3RyxHQUFpSS9DLGtCQUFqSSxHQUFzSixHQUF0SixHQUE0SitDLEdBQTVKLEdBQWtLLElBQXpLO0FBQ0YsV0FBSyxNQUFMO0FBQ0UsZUFBTyxrQkFBa0JoRCxnQkFBbEIsR0FBcUMsb0JBQXJDLEdBQTREZ0QsR0FBNUQsR0FBa0UsVUFBekU7QUFDRixXQUFLLEtBQUw7QUFDRSxZQUFJSyxRQUFRRCxVQUFVSixHQUFWLEVBQWUsSUFBZixDQUFaOztBQUVBLFlBQUlLLE1BQU1wSSxNQUFOLENBQWEsQ0FBYixNQUFvQixHQUF4QixFQUFnRDtBQUM5Q29JLGtCQUFRLGlCQUFpQkEsS0FBekI7QUFDRDtBQUNELGVBQU8sVUFBVUEsS0FBVixHQUFrQixJQUF6QjtBQUNGLFdBQUssUUFBTDtBQUNFLGVBQU8sMkJBQVA7QUFDRixXQUFLLE1BQUw7QUFDRSxlQUFPLDZCQUFQO0FBQ0U7Ozs7OztBQU1KLFdBQUssTUFBTDtBQUNFLGVBQU8sYUFBYUwsR0FBYixHQUFtQixJQUExQjtBQUNGLFdBQUssV0FBTDtBQUNBLFdBQUssWUFBTDtBQUNFLGVBQU8sT0FBT3BQLEtBQUttQixPQUFMLENBQWEsR0FBYixFQUFrQixFQUFsQixDQUFQLEdBQStCLEdBQXRDO0FBQ0YsV0FBSyxPQUFMO0FBQ0EsV0FBSyxVQUFMO0FBQ0EsV0FBSyxVQUFMO0FBQ0EsV0FBSyxjQUFMO0FBQ0UsZUFBTyxPQUFPbkIsSUFBUCxHQUFjLEdBQXJCO0FBQ0Y7QUFDRSxlQUFPb0IsS0FBUDtBQXhLRjtBQTBLRCxHQWxWTDtBQUFBLE1Bb1ZJdU8sd0JBQXdCLHdEQXBWNUI7QUFBQSxNQXFWSUMsMkJBQTJCLFNBQTNCQSx3QkFBMkIsQ0FBVWpCLEdBQVYsRUFBZUcsRUFBZixFQUFtQm5MLEdBQW5CLEVBQXdCeUssTUFBeEIsRUFBZ0NDLElBQWhDLEVBQXNDO0FBQy9ELFFBQUlMLE9BQU8sRUFBWDtBQUNBOzs7Ozs7O0FBT0EsUUFBSWMsT0FBTyxHQUFYLEVBQTJCO0FBQ3pCLGFBQU9kLE9BQU8sUUFBUCxHQUFrQnJLLEdBQWxCLEdBQXdCLElBQS9CO0FBQ0Q7QUFDRCxXQUFPcUssT0FBTyxzREFBUCxHQUFnRXJLLEdBQWhFLEdBQXNFLE1BQTdFO0FBQ0QsR0FsV0w7O0FBb1dFO0FBQ0YsV0FBUytMLFdBQVQsQ0FBcUI1RCxDQUFyQixFQUF3QmtDLElBQXhCLEVBQThCO0FBQzVCLFdBQU9sQyxFQUFFM0ssT0FBRixDQUFVc00sZ0JBQVYsRUFBNEIsVUFBVXJNLEtBQVYsRUFBaUJ5TyxLQUFqQixFQUF3QjNCLE9BQXhCLEVBQWlDO0FBQ2xFLFVBQUlBLFFBQVF6RSxNQUFSLENBQWV5RSxRQUFRelAsTUFBUixHQUFpQixDQUFoQyxNQUF1QyxJQUEzQyxFQUFpRDtBQUMzQztBQUNKLGlCQUFPMkMsS0FBUDtBQUNEOztBQUVELFVBQUk4TSxRQUFRN0csTUFBUixDQUFlLENBQWYsTUFBc0IsR0FBMUIsRUFBMEM7QUFDeEMyRyxnQkFBUSxHQUFSO0FBQ0Q7QUFDQztBQUNBO0FBQ0YsYUFBTzZCLFFBQVE3QixJQUFSLEdBQWVFLE9BQXRCO0FBQ0QsS0FaTSxDQUFQO0FBYUQ7O0FBRUM7QUFDRixXQUFTNEIsYUFBVCxDQUF1QmhFLENBQXZCLEVBQTBCak4sQ0FBMUIsRUFBNkI7QUFDM0IsUUFBSWtSLFFBQVEsQ0FBWjtBQUNBLFFBQUkzQixTQUFTLENBQWI7O0FBRUEsV0FBT3ZQLEdBQVAsRUFBWTtBQUNWLGNBQVFpTixFQUFFekUsTUFBRixDQUFTeEksQ0FBVCxDQUFSO0FBQ0EsYUFBSyxHQUFMO0FBQ0EsYUFBS3VPLGFBQUw7QUFDRWdCO0FBQ0E7QUFDRixhQUFLLEdBQUw7QUFDQSxhQUFLLEdBQUw7QUFDRTJCOztBQUVBLGNBQUlBLFFBQVEsQ0FBWixFQUFrQztBQUNoQyxtQkFBTyxFQUFFbFIsQ0FBRixHQUFNdVAsTUFBYjtBQUNEO0FBQ0Q7QUFDRixhQUFLLEdBQUw7QUFDQSxhQUFLLEdBQUw7QUFDRTJCO0FBQ0E7QUFDRixhQUFLLEdBQUw7QUFDQSxhQUFLLEdBQUw7QUFDRSxjQUFJQSxVQUFVLENBQWQsRUFBb0M7QUFDbEMsbUJBQU8sRUFBRWxSLENBQUYsR0FBTXVQLE1BQWI7QUFDRDtBQUNIO0FBQ0VBLG1CQUFTLENBQVQ7QUF2QkY7QUF5QkQ7O0FBRUQsV0FBTyxDQUFQO0FBQ0Q7O0FBRUM7QUFDRixXQUFTRyxTQUFULENBQW1CekMsQ0FBbkIsRUFBc0I7QUFDcEIsUUFBSWtFLE1BQU0xRixTQUFTd0IsQ0FBVCxFQUFZLEVBQVosQ0FBVjs7QUFFQSxXQUFRLENBQUNtRSxNQUFNRCxHQUFOLENBQUQsSUFBZSxLQUFLQSxHQUFMLEtBQWFsRSxDQUFwQztBQUNEOztBQUVDO0FBQ0YsV0FBU29FLFVBQVQsQ0FBb0JwRSxDQUFwQixFQUF1QnFFLElBQXZCLEVBQTZCQyxLQUE3QixFQUFvQ0MsSUFBcEMsRUFBMEM7QUFDeEMsUUFBSU4sUUFBUSxDQUFaOztBQUVBLFdBQU9qRSxFQUFFM0ssT0FBRixDQUFVLElBQUltQixNQUFKLENBQVcsUUFBUTZOLElBQVIsR0FBZSxJQUFmLEdBQXNCQyxLQUF0QixHQUE4QixHQUF6QyxFQUE4QyxHQUE5QyxDQUFWLEVBQThELFVBQVU1TSxDQUFWLEVBQWE7QUFDaEYsVUFBSUEsTUFBTTJNLElBQVYsRUFBMkI7QUFDekJKO0FBQ0Q7O0FBRUQsVUFBSXZNLE1BQU0yTSxJQUFWLEVBQWdCO0FBQ2QsZUFBTzNNLElBQUk4TSxPQUFPRCxJQUFQLEVBQWFOLEtBQWIsQ0FBWDtBQUNELE9BRkQsTUFFTztBQUNMLGVBQU9PLE9BQU9ELElBQVAsRUFBYU4sT0FBYixJQUF3QnZNLENBQS9CO0FBQ0Q7QUFDRixLQVZNLENBQVA7QUFXRDs7QUFFRCxXQUFTOE0sTUFBVCxDQUFnQjNCLEdBQWhCLEVBQXFCcUIsR0FBckIsRUFBMEI7QUFDeEJBLFVBQU1PLE9BQU9QLEdBQVAsQ0FBTjtBQUNBLFFBQUk3TSxTQUFTLEVBQWI7O0FBRUEsV0FBTyxJQUFQLEVBQWE7QUFDWCxVQUFJNk0sTUFBTSxDQUFWLEVBQXdCO0FBQ3RCN00sa0JBQVV3TCxHQUFWO0FBQ0Q7QUFDRHFCLGVBQVMsQ0FBVDs7QUFFQSxVQUFJQSxPQUFPLENBQVgsRUFBYztBQUNaO0FBQ0Q7QUFDRHJCLGFBQU9BLEdBQVA7QUFDRDs7QUFFRCxXQUFPeEwsTUFBUDtBQUNEOztBQUVELFdBQVNxTixlQUFULENBQTBCaFEsS0FBMUIsRUFBaUM7QUFDL0IsV0FBT0EsU0FBU0EsTUFBTVcsT0FBTixDQUFjLHdDQUFkLEVBQXdELElBQXhELEVBQ2JBLE9BRGEsQ0FDTCxXQURLLEVBQ1EsTUFEUixFQUViQSxPQUZhLENBRUwsT0FGSyxFQUVJLElBRkosQ0FBaEI7QUFHRDs7QUFFRCxXQUFTcU8sU0FBVCxDQUFtQjFELENBQW5CLEVBQXNCMkUsTUFBdEIsRUFBOEI7QUFDNUI7O0FBRUEsUUFBSUEsV0FBVyxJQUFmLEVBQXFCO0FBQ2pCO0FBQ0YzRSxVQUFJQSxFQUFFM0ssT0FBRixDQUFVNk4sd0JBQVYsRUFBb0NDLDJCQUFwQyxDQUFKOztBQUVFO0FBQ0ZuRCxVQUFJQSxFQUFFM0ssT0FBRixDQUFVd08scUJBQVYsRUFBaUNDLHdCQUFqQyxDQUFKOztBQUVBLGFBQU85RCxDQUFQO0FBQ0Q7O0FBRUQ7QUFDQUEsUUFBSW9FLFdBQVdwRSxDQUFYLEVBQWMsR0FBZCxFQUFtQixHQUFuQixFQUF3QnNCLGFBQXhCLENBQUo7O0FBRUE7QUFDQSxRQUFJc0QsV0FBVyxFQUFmOztBQUVBNUUsUUFBSUEsRUFBRTNLLE9BQUYsQ0FBVWtNLG9CQUFWLEVBQWdDLFVBQVV2QixDQUFWLEVBQWF0SSxDQUFiLEVBQWdCO0FBQ2xELFVBQUlBLEVBQUU2RCxNQUFGLENBQVMsQ0FBVCxNQUFnQixHQUFwQixFQUF5QjtBQUN2QjdELFlBQUlBLEVBQUVpRyxNQUFGLENBQVMsQ0FBVCxFQUFZN0osSUFBWixFQUFKOztBQUVBLFlBQUkyTyxVQUFVL0ssQ0FBVixDQUFKLEVBQWlDO0FBQy9CLGlCQUFPc0ksQ0FBUDtBQUNEO0FBQ0YsT0FORCxNQU1PO0FBQ0x0SSxZQUFJQSxFQUFFaUcsTUFBRixDQUFTLENBQVQsRUFBWWpHLEVBQUUvRSxNQUFGLEdBQVcsQ0FBdkIsQ0FBSjtBQUNEOztBQUVELGFBQU82UixPQUFPckQsY0FBUCxFQUF1QnlELFNBQVNwTixJQUFULENBQWNrTixnQkFBZ0JoTixDQUFoQixDQUFkLENBQXZCLENBQVA7QUFDRCxLQVpHLENBQUo7O0FBY0E7QUFDQXNJLFFBQUlBLEVBQUUzSyxPQUFGLENBQVUwTSxxQkFBVixFQUFpQ0Msd0JBQWpDLENBQUo7O0FBRUE7QUFDQWhDLFFBQUlBLEVBQUUzSyxPQUFGLENBQVVzTixvQkFBVixFQUFnQ0MsdUJBQWhDLENBQUo7O0FBRUE7QUFDQSxXQUFPLElBQVAsRUFBYTtBQUNYLFVBQUl4USxRQUFRNE4sRUFBRWlELE1BQUYsQ0FBU3hCLHFCQUFULENBQVo7O0FBRUEsVUFBSXJQLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCO0FBQ0Q7QUFDREEsY0FBUTROLEVBQUV4SyxPQUFGLENBQVUsR0FBVixFQUFlcEQsS0FBZixDQUFSO0FBQ0EsVUFBSTJSLFFBQVFDLGNBQWNoRSxDQUFkLEVBQWlCNU4sS0FBakIsQ0FBWjs7QUFFQTROLFVBQUlBLEVBQUVyQyxNQUFGLENBQVMsQ0FBVCxFQUFZb0csS0FBWixJQUNFLEdBREYsR0FDUS9ELEVBQUU2RSxTQUFGLENBQVlkLEtBQVosRUFBbUIzUixLQUFuQixDQURSLEdBQ29DLEdBRHBDLEdBRUU0TixFQUFFckMsTUFBRixDQUFTdkwsS0FBVCxDQUZOO0FBR0Q7O0FBRUQ7QUFDQTROLFFBQUlBLEVBQUUzSyxPQUFGLENBQVU2Tix3QkFBVixFQUFvQ0MsMkJBQXBDLENBQUo7O0FBRUE7QUFDQW5ELFFBQUlBLEVBQUUzSyxPQUFGLENBQVV3TyxxQkFBVixFQUFpQ0Msd0JBQWpDLENBQUo7O0FBRUE7QUFDQTlELFFBQUlBLEVBQUUzSyxPQUFGLENBQVVtTSxxQkFBVixFQUFpQyxVQUFVeEIsQ0FBVixFQUFhdEksQ0FBYixFQUFnQjtBQUNuRCxVQUFJbUwsTUFBTStCLFNBQVNsTixFQUFFL0UsTUFBRixHQUFXLENBQXBCLENBQVY7O0FBRUEsYUFBTyxNQUFNa1EsR0FBTixHQUFZLEdBQW5CO0FBQ0QsS0FKRyxDQUFKOztBQU1BO0FBQ0E3QyxRQUFJQSxFQUFFM0ssT0FBRixDQUFVcU0sa0JBQVYsRUFBOEIsRUFBOUIsQ0FBSjs7QUFFQTtBQUNBMUIsUUFBSUEsRUFBRTNLLE9BQUYsQ0FBVXVNLG1CQUFWLEVBQStCLE1BQS9CLENBQUo7O0FBRUE7QUFDQTVCLFFBQUlBLEVBQUUzSyxPQUFGLENBQVV3TSxpQkFBVixFQUE2QixNQUE3QixDQUFKOztBQUVBOzs7Ozs7QUFPQTdCLFFBQUk0RCxZQUFZNUQsQ0FBWixFQUFlLEtBQWYsQ0FBSixDQW5GNEIsQ0FtRkQ7QUFDM0IsV0FBT0EsQ0FBUDtBQUNEOztBQUdELE1BQUksT0FBTzhFLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUMsT0FBT0EsT0FBT0MsT0FBZCxLQUEwQixXQUEvRCxFQUE0RTtBQUMxRUQsV0FBT0MsT0FBUCxHQUFpQnJCLFNBQWpCO0FBQ0QsR0FGRCxNQUVPO0FBQ0xzQixXQUFPdEIsU0FBUCxHQUFtQkEsU0FBbkI7QUFDRDtBQUVGLENBemlCRCxJOzs7Ozs7Ozs7QUNGQTs7Ozs7Ozs7OztBQVVBLENBQUUsVUFBVXNCLE1BQVYsRUFBbUI7QUFDckIsS0FBSWpTLENBQUo7QUFBQSxLQUNDa1MsT0FERDtBQUFBLEtBRUNDLElBRkQ7QUFBQSxLQUdDQyxPQUhEO0FBQUEsS0FJQ0MsS0FKRDtBQUFBLEtBS0NDLFFBTEQ7QUFBQSxLQU1DQyxPQU5EO0FBQUEsS0FPQ3ZQLE1BUEQ7QUFBQSxLQVFDd1AsZ0JBUkQ7QUFBQSxLQVNDQyxTQVREO0FBQUEsS0FVQ0MsWUFWRDs7O0FBWUM7QUFDQUMsWUFiRDtBQUFBLEtBY0M3VCxRQWREO0FBQUEsS0FlQzhULE9BZkQ7QUFBQSxLQWdCQ0MsY0FoQkQ7QUFBQSxLQWlCQ0MsU0FqQkQ7QUFBQSxLQWtCQ0MsYUFsQkQ7QUFBQSxLQW1CQzNPLE9BbkJEO0FBQUEsS0FvQkN3RCxRQXBCRDs7O0FBc0JDO0FBQ0FvTCxXQUFVLFdBQVcsSUFBSSxJQUFJQyxJQUFKLEVBdkIxQjtBQUFBLEtBd0JDQyxlQUFlakIsT0FBT25ULFFBeEJ2QjtBQUFBLEtBeUJDcVUsVUFBVSxDQXpCWDtBQUFBLEtBMEJDN0ksT0FBTyxDQTFCUjtBQUFBLEtBMkJDOEksYUFBYUMsYUEzQmQ7QUFBQSxLQTRCQ0MsYUFBYUQsYUE1QmQ7QUFBQSxLQTZCQ0UsZ0JBQWdCRixhQTdCakI7QUFBQSxLQThCQ0cseUJBQXlCSCxhQTlCMUI7QUFBQSxLQStCQ0ksWUFBWSxtQkFBVTlPLENBQVYsRUFBYUMsQ0FBYixFQUFpQjtBQUM1QixNQUFLRCxNQUFNQyxDQUFYLEVBQWU7QUFDZDhOLGtCQUFlLElBQWY7QUFDQTtBQUNELFNBQU8sQ0FBUDtBQUNBLEVBcENGOzs7QUFzQ0M7QUFDQWdCLFVBQVcsRUFBRixDQUFPQyxjQXZDakI7QUFBQSxLQXdDQ3ZSLE1BQU0sRUF4Q1A7QUFBQSxLQXlDQzJFLE1BQU0zRSxJQUFJMkUsR0F6Q1g7QUFBQSxLQTBDQzZNLGFBQWF4UixJQUFJcUMsSUExQ2xCO0FBQUEsS0EyQ0NBLE9BQU9yQyxJQUFJcUMsSUEzQ1o7QUFBQSxLQTRDQ29DLFFBQVF6RSxJQUFJeUUsS0E1Q2I7OztBQThDQztBQUNBO0FBQ0FwRSxXQUFVLFNBQVZBLE9BQVUsQ0FBVW9SLElBQVYsRUFBZ0JDLElBQWhCLEVBQXVCO0FBQ2hDLE1BQUk5VCxJQUFJLENBQVI7QUFBQSxNQUNDK1QsTUFBTUYsS0FBS2pVLE1BRFo7QUFFQSxTQUFRSSxJQUFJK1QsR0FBWixFQUFpQi9ULEdBQWpCLEVBQXVCO0FBQ3RCLE9BQUs2VCxLQUFNN1QsQ0FBTixNQUFjOFQsSUFBbkIsRUFBMEI7QUFDekIsV0FBTzlULENBQVA7QUFDQTtBQUNEO0FBQ0QsU0FBTyxDQUFDLENBQVI7QUFDQSxFQXpERjtBQUFBLEtBMkRDZ1UsV0FBVyw4RUFDVixtREE1REY7OztBQThEQzs7QUFFQTtBQUNBQyxjQUFhLHFCQWpFZDs7O0FBbUVDO0FBQ0FDLGNBQWEsNEJBQTRCRCxVQUE1QixHQUNaLHlDQXJFRjs7O0FBdUVDO0FBQ0F6VCxjQUFhLFFBQVF5VCxVQUFSLEdBQXFCLElBQXJCLEdBQTRCQyxVQUE1QixHQUF5QyxNQUF6QyxHQUFrREQsVUFBbEQ7O0FBRVo7QUFDQSxnQkFIWSxHQUdNQSxVQUhOOztBQUtaO0FBQ0E7QUFDQSwyREFQWSxHQU9pREMsVUFQakQsR0FPOEQsTUFQOUQsR0FRWkQsVUFSWSxHQVFDLE1BaEZmO0FBQUEsS0FrRkNFLFVBQVUsT0FBT0QsVUFBUCxHQUFvQixVQUFwQjs7QUFFVDtBQUNBO0FBQ0Esd0RBSlM7O0FBTVQ7QUFDQSwyQkFQUyxHQU9vQjFULFVBUHBCLEdBT2lDLE1BUGpDOztBQVNUO0FBQ0EsS0FWUyxHQVdULFFBN0ZGOzs7QUErRkM7QUFDQTRULGVBQWMsSUFBSTNRLE1BQUosQ0FBWXdRLGFBQWEsR0FBekIsRUFBOEIsR0FBOUIsQ0FoR2Y7QUFBQSxLQWlHQ0ksUUFBUSxJQUFJNVEsTUFBSixDQUFZLE1BQU13USxVQUFOLEdBQW1CLDZCQUFuQixHQUNuQkEsVUFEbUIsR0FDTixJQUROLEVBQ1ksR0FEWixDQWpHVDtBQUFBLEtBb0dDSyxTQUFTLElBQUk3USxNQUFKLENBQVksTUFBTXdRLFVBQU4sR0FBbUIsSUFBbkIsR0FBMEJBLFVBQTFCLEdBQXVDLEdBQW5ELENBcEdWO0FBQUEsS0FxR0NNLGVBQWUsSUFBSTlRLE1BQUosQ0FBWSxNQUFNd1EsVUFBTixHQUFtQixVQUFuQixHQUFnQ0EsVUFBaEMsR0FBNkMsR0FBN0MsR0FBbURBLFVBQW5ELEdBQzFCLEdBRGMsQ0FyR2hCO0FBQUEsS0F1R0NPLFdBQVcsSUFBSS9RLE1BQUosQ0FBWXdRLGFBQWEsSUFBekIsQ0F2R1o7QUFBQSxLQXlHQ1EsVUFBVSxJQUFJaFIsTUFBSixDQUFZMFEsT0FBWixDQXpHWDtBQUFBLEtBMEdDTyxjQUFjLElBQUlqUixNQUFKLENBQVksTUFBTXlRLFVBQU4sR0FBbUIsR0FBL0IsQ0ExR2Y7QUFBQSxLQTRHQ1MsWUFBWTtBQUNYLFFBQU0sSUFBSWxSLE1BQUosQ0FBWSxRQUFReVEsVUFBUixHQUFxQixHQUFqQyxDQURLO0FBRVgsV0FBUyxJQUFJelEsTUFBSixDQUFZLFVBQVV5USxVQUFWLEdBQXVCLEdBQW5DLENBRkU7QUFHWCxTQUFPLElBQUl6USxNQUFKLENBQVksT0FBT3lRLFVBQVAsR0FBb0IsT0FBaEMsQ0FISTtBQUlYLFVBQVEsSUFBSXpRLE1BQUosQ0FBWSxNQUFNakQsVUFBbEIsQ0FKRztBQUtYLFlBQVUsSUFBSWlELE1BQUosQ0FBWSxNQUFNMFEsT0FBbEIsQ0FMQztBQU1YLFdBQVMsSUFBSTFRLE1BQUosQ0FBWSwyREFDcEJ3USxVQURvQixHQUNQLDhCQURPLEdBQzBCQSxVQUQxQixHQUN1QyxhQUR2QyxHQUVwQkEsVUFGb0IsR0FFUCxZQUZPLEdBRVFBLFVBRlIsR0FFcUIsUUFGakMsRUFFMkMsR0FGM0MsQ0FORTtBQVNYLFVBQVEsSUFBSXhRLE1BQUosQ0FBWSxTQUFTdVEsUUFBVCxHQUFvQixJQUFoQyxFQUFzQyxHQUF0QyxDQVRHOztBQVdYO0FBQ0E7QUFDQSxrQkFBZ0IsSUFBSXZRLE1BQUosQ0FBWSxNQUFNd1EsVUFBTixHQUMzQixrREFEMkIsR0FDMEJBLFVBRDFCLEdBRTNCLGtCQUYyQixHQUVOQSxVQUZNLEdBRU8sa0JBRm5CLEVBRXVDLEdBRnZDO0FBYkwsRUE1R2I7QUFBQSxLQThIQ1csUUFBUSxRQTlIVDtBQUFBLEtBK0hDQyxVQUFVLHFDQS9IWDtBQUFBLEtBZ0lDQyxVQUFVLFFBaElYO0FBQUEsS0FrSUNDLFVBQVUsd0JBbElYOzs7QUFvSUM7QUFDQUMsY0FBYSxrQ0FySWQ7QUFBQSxLQXVJQ0MsV0FBVyxNQXZJWjs7O0FBeUlDO0FBQ0E7QUFDQUMsYUFBWSxJQUFJelIsTUFBSixDQUFZLHlCQUF5QndRLFVBQXpCLEdBQXNDLHNCQUFsRCxFQUEwRSxHQUExRSxDQTNJYjtBQUFBLEtBNElDa0IsWUFBWSxTQUFaQSxTQUFZLENBQVVDLE1BQVYsRUFBa0JDLE1BQWxCLEVBQTJCO0FBQ3RDLE1BQUlDLE9BQU8sT0FBT0YsT0FBT3ZPLEtBQVAsQ0FBYyxDQUFkLENBQVAsR0FBMkIsT0FBdEM7O0FBRUEsU0FBT3dPOztBQUVOO0FBQ0FBLFFBSE07O0FBS047QUFDQTtBQUNBO0FBQ0E7QUFDQUMsU0FBTyxDQUFQLEdBQ0NqSCxPQUFPQyxZQUFQLENBQXFCZ0gsT0FBTyxPQUE1QixDQURELEdBRUNqSCxPQUFPQyxZQUFQLENBQXFCZ0gsUUFBUSxFQUFSLEdBQWEsTUFBbEMsRUFBMENBLE9BQU8sS0FBUCxHQUFlLE1BQXpELENBWEY7QUFZQSxFQTNKRjs7O0FBNkpDO0FBQ0E7QUFDQUMsY0FBYSxxREEvSmQ7QUFBQSxLQWdLQ0MsYUFBYSxTQUFiQSxVQUFhLENBQVVDLEVBQVYsRUFBY0MsV0FBZCxFQUE0QjtBQUN4QyxNQUFLQSxXQUFMLEVBQW1COztBQUVsQjtBQUNBLE9BQUtELE9BQU8sSUFBWixFQUFtQjtBQUNsQixXQUFPLFFBQVA7QUFDQTs7QUFFRDtBQUNBLFVBQU9BLEdBQUc1TyxLQUFILENBQVUsQ0FBVixFQUFhLENBQUMsQ0FBZCxJQUFvQixJQUFwQixHQUNONE8sR0FBR0UsVUFBSCxDQUFlRixHQUFHN1YsTUFBSCxHQUFZLENBQTNCLEVBQStCNEQsUUFBL0IsQ0FBeUMsRUFBekMsQ0FETSxHQUMwQyxHQURqRDtBQUVBOztBQUVEO0FBQ0EsU0FBTyxPQUFPaVMsRUFBZDtBQUNBLEVBL0tGOzs7QUFpTEM7QUFDQTtBQUNBO0FBQ0E7QUFDQUcsaUJBQWdCLFNBQWhCQSxhQUFnQixHQUFXO0FBQzFCakQ7QUFDQSxFQXZMRjtBQUFBLEtBeUxDa0QscUJBQXFCQyxjQUNwQixVQUFVaEMsSUFBVixFQUFpQjtBQUNoQixTQUFPQSxLQUFLaUMsUUFBTCxLQUFrQixJQUFsQixJQUEwQmpDLEtBQUtrQyxRQUFMLENBQWNoVSxXQUFkLE9BQWdDLFVBQWpFO0FBQ0EsRUFIbUIsRUFJcEIsRUFBRWlVLEtBQUssWUFBUCxFQUFxQnRXLE1BQU0sUUFBM0IsRUFKb0IsQ0F6THRCOztBQWdNQTtBQUNBLEtBQUk7QUFDSDhFLE9BQUt5UixLQUFMLENBQ0c5VCxNQUFNeUUsTUFBTXNQLElBQU4sQ0FBWWpELGFBQWFrRCxVQUF6QixDQURULEVBRUNsRCxhQUFha0QsVUFGZDs7QUFLQTtBQUNBO0FBQ0E7QUFDQWhVLE1BQUs4USxhQUFha0QsVUFBYixDQUF3QnhXLE1BQTdCLEVBQXNDK0QsUUFBdEM7QUFDQSxFQVZELENBVUUsT0FBUTBTLENBQVIsRUFBWTtBQUNiNVIsU0FBTyxFQUFFeVIsT0FBTzlULElBQUl4QyxNQUFKOztBQUVmO0FBQ0EsYUFBVTBXLE1BQVYsRUFBa0JDLEdBQWxCLEVBQXdCO0FBQ3ZCM0MsZUFBV3NDLEtBQVgsQ0FBa0JJLE1BQWxCLEVBQTBCelAsTUFBTXNQLElBQU4sQ0FBWUksR0FBWixDQUExQjtBQUNBLElBTGM7O0FBT2Y7QUFDQTtBQUNBLGFBQVVELE1BQVYsRUFBa0JDLEdBQWxCLEVBQXdCO0FBQ3ZCLFFBQUlDLElBQUlGLE9BQU8xVyxNQUFmO0FBQUEsUUFDQ0ksSUFBSSxDQURMOztBQUdBO0FBQ0EsV0FBVXNXLE9BQVFFLEdBQVIsSUFBZ0JELElBQUt2VyxHQUFMLENBQTFCLEVBQXlDLENBQUU7QUFDM0NzVyxXQUFPMVcsTUFBUCxHQUFnQjRXLElBQUksQ0FBcEI7QUFDQTtBQWhCSyxHQUFQO0FBa0JBOztBQUVELFVBQVM5WCxNQUFULENBQWlCRSxRQUFqQixFQUEyQm9LLE9BQTNCLEVBQW9DeU4sT0FBcEMsRUFBNkNDLElBQTdDLEVBQW9EO0FBQ25ELE1BQUlDLENBQUo7QUFBQSxNQUFPM1csQ0FBUDtBQUFBLE1BQVU4VCxJQUFWO0FBQUEsTUFBZ0I4QyxHQUFoQjtBQUFBLE1BQXFCclUsS0FBckI7QUFBQSxNQUE0QnNVLE1BQTVCO0FBQUEsTUFBb0NDLFdBQXBDO0FBQUEsTUFDQ0MsYUFBYS9OLFdBQVdBLFFBQVFnTyxhQURqQzs7O0FBR0M7QUFDQXJULGFBQVdxRixVQUFVQSxRQUFRckYsUUFBbEIsR0FBNkIsQ0FKekM7O0FBTUE4UyxZQUFVQSxXQUFXLEVBQXJCOztBQUVBO0FBQ0EsTUFBSyxPQUFPN1gsUUFBUCxLQUFvQixRQUFwQixJQUFnQyxDQUFDQSxRQUFqQyxJQUNKK0UsYUFBYSxDQUFiLElBQWtCQSxhQUFhLENBQS9CLElBQW9DQSxhQUFhLEVBRGxELEVBQ3VEOztBQUV0RCxVQUFPOFMsT0FBUDtBQUNBOztBQUVEO0FBQ0EsTUFBSyxDQUFDQyxJQUFOLEVBQWE7QUFDWi9ELGVBQWEzSixPQUFiO0FBQ0FBLGFBQVVBLFdBQVdsSyxRQUFyQjs7QUFFQSxPQUFLK1QsY0FBTCxFQUFzQjs7QUFFckI7QUFDQTtBQUNBLFFBQUtsUCxhQUFhLEVBQWIsS0FBcUJwQixRQUFReVMsV0FBV2lDLElBQVgsQ0FBaUJyWSxRQUFqQixDQUE3QixDQUFMLEVBQWtFOztBQUVqRTtBQUNBLFNBQU8rWCxJQUFJcFUsTUFBTyxDQUFQLENBQVgsRUFBMEI7O0FBRXpCO0FBQ0EsVUFBS29CLGFBQWEsQ0FBbEIsRUFBc0I7QUFDckIsV0FBT21RLE9BQU85SyxRQUFRa08sY0FBUixDQUF3QlAsQ0FBeEIsQ0FBZCxFQUE4Qzs7QUFFN0M7QUFDQTtBQUNBO0FBQ0EsWUFBSzdDLEtBQUsxSSxFQUFMLEtBQVl1TCxDQUFqQixFQUFxQjtBQUNwQkYsaUJBQVFoUyxJQUFSLENBQWNxUCxJQUFkO0FBQ0EsZ0JBQU8yQyxPQUFQO0FBQ0E7QUFDRCxRQVRELE1BU087QUFDTixlQUFPQSxPQUFQO0FBQ0E7O0FBRUY7QUFDQyxPQWZELE1BZU87O0FBRU47QUFDQTtBQUNBO0FBQ0EsV0FBS00sZUFBZ0JqRCxPQUFPaUQsV0FBV0csY0FBWCxDQUEyQlAsQ0FBM0IsQ0FBdkIsS0FDSi9PLFNBQVVvQixPQUFWLEVBQW1COEssSUFBbkIsQ0FESSxJQUVKQSxLQUFLMUksRUFBTCxLQUFZdUwsQ0FGYixFQUVpQjs7QUFFaEJGLGdCQUFRaFMsSUFBUixDQUFjcVAsSUFBZDtBQUNBLGVBQU8yQyxPQUFQO0FBQ0E7QUFDRDs7QUFFRjtBQUNDLE1BakNELE1BaUNPLElBQUtsVSxNQUFPLENBQVAsQ0FBTCxFQUFrQjtBQUN4QmtDLFdBQUt5UixLQUFMLENBQVlPLE9BQVosRUFBcUJ6TixRQUFRVSxvQkFBUixDQUE4QjlLLFFBQTlCLENBQXJCO0FBQ0EsYUFBTzZYLE9BQVA7O0FBRUQ7QUFDQyxNQUxNLE1BS0EsSUFBSyxDQUFFRSxJQUFJcFUsTUFBTyxDQUFQLENBQU4sS0FBc0IyUCxRQUFRckksc0JBQTlCLElBQ1hiLFFBQVFhLHNCQURGLEVBQzJCOztBQUVqQ3BGLFdBQUt5UixLQUFMLENBQVlPLE9BQVosRUFBcUJ6TixRQUFRYSxzQkFBUixDQUFnQzhNLENBQWhDLENBQXJCO0FBQ0EsYUFBT0YsT0FBUDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFLdkUsUUFBUWlGLEdBQVIsSUFDSixDQUFDM0QsdUJBQXdCNVUsV0FBVyxHQUFuQyxDQURHLEtBRUYsQ0FBQ2tVLFNBQUQsSUFBYyxDQUFDQSxVQUFVcFAsSUFBVixDQUFnQjlFLFFBQWhCLENBRmI7O0FBSUo7QUFDQTtBQUNFK0UsaUJBQWEsQ0FBYixJQUFrQnFGLFFBQVFnTixRQUFSLENBQWlCaFUsV0FBakIsT0FBbUMsUUFObkQsQ0FBTCxFQU1xRTs7QUFFcEU4VSxtQkFBY2xZLFFBQWQ7QUFDQW1ZLGtCQUFhL04sT0FBYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQUtyRixhQUFhLENBQWIsS0FDRjZRLFNBQVM5USxJQUFULENBQWU5RSxRQUFmLEtBQTZCMlYsYUFBYTdRLElBQWIsQ0FBbUI5RSxRQUFuQixDQUQzQixDQUFMLEVBQ2tFOztBQUVqRTtBQUNBbVksbUJBQWE5QixTQUFTdlIsSUFBVCxDQUFlOUUsUUFBZixLQUE2QndZLFlBQWFwTyxRQUFRekosVUFBckIsQ0FBN0IsSUFDWnlKLE9BREQ7O0FBR0E7QUFDQTtBQUNBLFVBQUsrTixlQUFlL04sT0FBZixJQUEwQixDQUFDa0osUUFBUW1GLEtBQXhDLEVBQWdEOztBQUUvQztBQUNBLFdBQU9ULE1BQU01TixRQUFRbEksWUFBUixDQUFzQixJQUF0QixDQUFiLEVBQThDO0FBQzdDOFYsY0FBTUEsSUFBSXRVLE9BQUosQ0FBYWlULFVBQWIsRUFBeUJDLFVBQXpCLENBQU47QUFDQSxRQUZELE1BRU87QUFDTnhNLGdCQUFRc08sWUFBUixDQUFzQixJQUF0QixFQUE4QlYsTUFBTTVELE9BQXBDO0FBQ0E7QUFDRDs7QUFFRDtBQUNBNkQsZUFBU3ZFLFNBQVUxVCxRQUFWLENBQVQ7QUFDQW9CLFVBQUk2VyxPQUFPalgsTUFBWDtBQUNBLGFBQVFJLEdBQVIsRUFBYztBQUNiNlcsY0FBUTdXLENBQVIsSUFBYyxDQUFFNFcsTUFBTSxNQUFNQSxHQUFaLEdBQWtCLFFBQXBCLElBQWlDLEdBQWpDLEdBQ2JXLFdBQVlWLE9BQVE3VyxDQUFSLENBQVosQ0FERDtBQUVBO0FBQ0Q4VyxvQkFBY0QsT0FBTzNTLElBQVAsQ0FBYSxHQUFiLENBQWQ7QUFDQTs7QUFFRCxTQUFJO0FBQ0hPLFdBQUt5UixLQUFMLENBQVlPLE9BQVosRUFDQ00sV0FBV2hZLGdCQUFYLENBQTZCK1gsV0FBN0IsQ0FERDtBQUdBLGFBQU9MLE9BQVA7QUFDQSxNQUxELENBS0UsT0FBUWUsUUFBUixFQUFtQjtBQUNwQmhFLDZCQUF3QjVVLFFBQXhCLEVBQWtDLElBQWxDO0FBQ0EsTUFQRCxTQU9VO0FBQ1QsVUFBS2dZLFFBQVE1RCxPQUFiLEVBQXVCO0FBQ3RCaEssZUFBUXlPLGVBQVIsQ0FBeUIsSUFBekI7QUFDQTtBQUNEO0FBQ0Q7QUFDRDtBQUNEOztBQUVEO0FBQ0EsU0FBT3pVLE9BQVFwRSxTQUFTMEQsT0FBVCxDQUFrQitSLEtBQWxCLEVBQXlCLElBQXpCLENBQVIsRUFBeUNyTCxPQUF6QyxFQUFrRHlOLE9BQWxELEVBQTJEQyxJQUEzRCxDQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVNyRCxXQUFULEdBQXVCO0FBQ3RCLE1BQUkvUixPQUFPLEVBQVg7O0FBRUEsV0FBU29XLEtBQVQsQ0FBZ0JsVyxHQUFoQixFQUFxQkcsS0FBckIsRUFBNkI7O0FBRTVCO0FBQ0EsT0FBS0wsS0FBS21ELElBQUwsQ0FBV2pELE1BQU0sR0FBakIsSUFBeUIyUSxLQUFLd0YsV0FBbkMsRUFBaUQ7O0FBRWhEO0FBQ0EsV0FBT0QsTUFBT3BXLEtBQUt4QixLQUFMLEVBQVAsQ0FBUDtBQUNBO0FBQ0QsVUFBUzRYLE1BQU9sVyxNQUFNLEdBQWIsSUFBcUJHLEtBQTlCO0FBQ0E7QUFDRCxTQUFPK1YsS0FBUDtBQUNBOztBQUVEOzs7O0FBSUEsVUFBU0UsWUFBVCxDQUF1QkMsRUFBdkIsRUFBNEI7QUFDM0JBLEtBQUk3RSxPQUFKLElBQWdCLElBQWhCO0FBQ0EsU0FBTzZFLEVBQVA7QUFDQTs7QUFFRDs7OztBQUlBLFVBQVNDLE1BQVQsQ0FBaUJELEVBQWpCLEVBQXNCO0FBQ3JCLE1BQUlFLEtBQUtqWixTQUFTa1osYUFBVCxDQUF3QixVQUF4QixDQUFUOztBQUVBLE1BQUk7QUFDSCxVQUFPLENBQUMsQ0FBQ0gsR0FBSUUsRUFBSixDQUFUO0FBQ0EsR0FGRCxDQUVFLE9BQVExQixDQUFSLEVBQVk7QUFDYixVQUFPLEtBQVA7QUFDQSxHQUpELFNBSVU7O0FBRVQ7QUFDQSxPQUFLMEIsR0FBR3hZLFVBQVIsRUFBcUI7QUFDcEJ3WSxPQUFHeFksVUFBSCxDQUFjMFksV0FBZCxDQUEyQkYsRUFBM0I7QUFDQTs7QUFFRDtBQUNBQSxRQUFLLElBQUw7QUFDQTtBQUNEOztBQUVEOzs7OztBQUtBLFVBQVNHLFNBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCbk0sT0FBM0IsRUFBcUM7QUFDcEMsTUFBSTVKLE1BQU0rVixNQUFNblgsS0FBTixDQUFhLEdBQWIsQ0FBVjtBQUFBLE1BQ0NoQixJQUFJb0MsSUFBSXhDLE1BRFQ7O0FBR0EsU0FBUUksR0FBUixFQUFjO0FBQ2JtUyxRQUFLaUcsVUFBTCxDQUFpQmhXLElBQUtwQyxDQUFMLENBQWpCLElBQThCZ00sT0FBOUI7QUFDQTtBQUNEOztBQUVEOzs7Ozs7QUFNQSxVQUFTcU0sWUFBVCxDQUF1QjFULENBQXZCLEVBQTBCQyxDQUExQixFQUE4QjtBQUM3QixNQUFJMFQsTUFBTTFULEtBQUtELENBQWY7QUFBQSxNQUNDNFQsT0FBT0QsT0FBTzNULEVBQUVoQixRQUFGLEtBQWUsQ0FBdEIsSUFBMkJpQixFQUFFakIsUUFBRixLQUFlLENBQTFDLElBQ05nQixFQUFFNlQsV0FBRixHQUFnQjVULEVBQUU0VCxXQUZwQjs7QUFJQTtBQUNBLE1BQUtELElBQUwsRUFBWTtBQUNYLFVBQU9BLElBQVA7QUFDQTs7QUFFRDtBQUNBLE1BQUtELEdBQUwsRUFBVztBQUNWLFVBQVVBLE1BQU1BLElBQUlHLFdBQXBCLEVBQW9DO0FBQ25DLFFBQUtILFFBQVExVCxDQUFiLEVBQWlCO0FBQ2hCLFlBQU8sQ0FBQyxDQUFSO0FBQ0E7QUFDRDtBQUNEOztBQUVELFNBQU9ELElBQUksQ0FBSixHQUFRLENBQUMsQ0FBaEI7QUFDQTs7QUFFRDs7OztBQUlBLFVBQVMrVCxpQkFBVCxDQUE0QnBWLElBQTVCLEVBQW1DO0FBQ2xDLFNBQU8sVUFBVXdRLElBQVYsRUFBaUI7QUFDdkIsT0FBSTNTLE9BQU8yUyxLQUFLa0MsUUFBTCxDQUFjaFUsV0FBZCxFQUFYO0FBQ0EsVUFBT2IsU0FBUyxPQUFULElBQW9CMlMsS0FBS3hRLElBQUwsS0FBY0EsSUFBekM7QUFDQSxHQUhEO0FBSUE7O0FBRUQ7Ozs7QUFJQSxVQUFTcVYsa0JBQVQsQ0FBNkJyVixJQUE3QixFQUFvQztBQUNuQyxTQUFPLFVBQVV3USxJQUFWLEVBQWlCO0FBQ3ZCLE9BQUkzUyxPQUFPMlMsS0FBS2tDLFFBQUwsQ0FBY2hVLFdBQWQsRUFBWDtBQUNBLFVBQU8sQ0FBRWIsU0FBUyxPQUFULElBQW9CQSxTQUFTLFFBQS9CLEtBQTZDMlMsS0FBS3hRLElBQUwsS0FBY0EsSUFBbEU7QUFDQSxHQUhEO0FBSUE7O0FBRUQ7Ozs7QUFJQSxVQUFTc1Ysb0JBQVQsQ0FBK0I3QyxRQUEvQixFQUEwQzs7QUFFekM7QUFDQSxTQUFPLFVBQVVqQyxJQUFWLEVBQWlCOztBQUV2QjtBQUNBO0FBQ0E7QUFDQSxPQUFLLFVBQVVBLElBQWYsRUFBc0I7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBS0EsS0FBS3ZVLFVBQUwsSUFBbUJ1VSxLQUFLaUMsUUFBTCxLQUFrQixLQUExQyxFQUFrRDs7QUFFakQ7QUFDQSxTQUFLLFdBQVdqQyxJQUFoQixFQUF1QjtBQUN0QixVQUFLLFdBQVdBLEtBQUt2VSxVQUFyQixFQUFrQztBQUNqQyxjQUFPdVUsS0FBS3ZVLFVBQUwsQ0FBZ0J3VyxRQUFoQixLQUE2QkEsUUFBcEM7QUFDQSxPQUZELE1BRU87QUFDTixjQUFPakMsS0FBS2lDLFFBQUwsS0FBa0JBLFFBQXpCO0FBQ0E7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsWUFBT2pDLEtBQUsrRSxVQUFMLEtBQW9COUMsUUFBcEI7O0FBRU47QUFDQTtBQUNBakMsVUFBSytFLFVBQUwsS0FBb0IsQ0FBQzlDLFFBQXJCLElBQ0FGLG1CQUFvQi9CLElBQXBCLE1BQStCaUMsUUFMaEM7QUFNQTs7QUFFRCxXQUFPakMsS0FBS2lDLFFBQUwsS0FBa0JBLFFBQXpCOztBQUVEO0FBQ0E7QUFDQTtBQUNDLElBbkNELE1BbUNPLElBQUssV0FBV2pDLElBQWhCLEVBQXVCO0FBQzdCLFdBQU9BLEtBQUtpQyxRQUFMLEtBQWtCQSxRQUF6QjtBQUNBOztBQUVEO0FBQ0EsVUFBTyxLQUFQO0FBQ0EsR0E5Q0Q7QUErQ0E7O0FBRUQ7Ozs7QUFJQSxVQUFTK0Msc0JBQVQsQ0FBaUNqQixFQUFqQyxFQUFzQztBQUNyQyxTQUFPRCxhQUFjLFVBQVVtQixRQUFWLEVBQXFCO0FBQ3pDQSxjQUFXLENBQUNBLFFBQVo7QUFDQSxVQUFPbkIsYUFBYyxVQUFVbEIsSUFBVixFQUFnQnRTLE9BQWhCLEVBQTBCO0FBQzlDLFFBQUlvUyxDQUFKO0FBQUEsUUFDQ3dDLGVBQWVuQixHQUFJLEVBQUosRUFBUW5CLEtBQUs5VyxNQUFiLEVBQXFCbVosUUFBckIsQ0FEaEI7QUFBQSxRQUVDL1ksSUFBSWdaLGFBQWFwWixNQUZsQjs7QUFJQTtBQUNBLFdBQVFJLEdBQVIsRUFBYztBQUNiLFNBQUswVyxLQUFRRixJQUFJd0MsYUFBY2haLENBQWQsQ0FBWixDQUFMLEVBQXlDO0FBQ3hDMFcsV0FBTUYsQ0FBTixJQUFZLEVBQUdwUyxRQUFTb1MsQ0FBVCxJQUFlRSxLQUFNRixDQUFOLENBQWxCLENBQVo7QUFDQTtBQUNEO0FBQ0QsSUFYTSxDQUFQO0FBWUEsR0FkTSxDQUFQO0FBZUE7O0FBRUQ7Ozs7O0FBS0EsVUFBU1ksV0FBVCxDQUFzQnBPLE9BQXRCLEVBQWdDO0FBQy9CLFNBQU9BLFdBQVcsT0FBT0EsUUFBUVUsb0JBQWYsS0FBd0MsV0FBbkQsSUFBa0VWLE9BQXpFO0FBQ0E7O0FBRUQ7QUFDQWtKLFdBQVV4VCxPQUFPd1QsT0FBUCxHQUFpQixFQUEzQjs7QUFFQTs7Ozs7QUFLQUcsU0FBUTNULE9BQU8yVCxLQUFQLEdBQWUsVUFBVXlCLElBQVYsRUFBaUI7QUFDdkMsTUFBSW1GLFlBQVluRixRQUFRQSxLQUFLb0YsWUFBN0I7QUFBQSxNQUNDdEcsVUFBVWtCLFFBQVEsQ0FBRUEsS0FBS2tELGFBQUwsSUFBc0JsRCxJQUF4QixFQUErQnFGLGVBRGxEOztBQUdBO0FBQ0E7QUFDQTtBQUNBLFNBQU8sQ0FBQ3ZFLE1BQU1sUixJQUFOLENBQVl1VixhQUFhckcsV0FBV0EsUUFBUW9ELFFBQWhDLElBQTRDLE1BQXhELENBQVI7QUFDQSxFQVJEOztBQVVBOzs7OztBQUtBckQsZUFBY2pVLE9BQU9pVSxXQUFQLEdBQXFCLFVBQVVqUSxJQUFWLEVBQWlCO0FBQ25ELE1BQUkwVyxVQUFKO0FBQUEsTUFBZ0JDLFNBQWhCO0FBQUEsTUFDQ0MsTUFBTTVXLE9BQU9BLEtBQUtzVSxhQUFMLElBQXNCdFUsSUFBN0IsR0FBb0N3USxZQUQzQzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBS29HLE9BQU94YSxRQUFQLElBQW1Cd2EsSUFBSTNWLFFBQUosS0FBaUIsQ0FBcEMsSUFBeUMsQ0FBQzJWLElBQUlILGVBQW5ELEVBQXFFO0FBQ3BFLFVBQU9yYSxRQUFQO0FBQ0E7O0FBRUQ7QUFDQUEsYUFBV3dhLEdBQVg7QUFDQTFHLFlBQVU5VCxTQUFTcWEsZUFBbkI7QUFDQXRHLG1CQUFpQixDQUFDUixNQUFPdlQsUUFBUCxDQUFsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLb1UsZ0JBQWdCcFUsUUFBaEIsS0FDRnVhLFlBQVl2YSxTQUFTeWEsV0FEbkIsS0FDb0NGLFVBQVVHLEdBQVYsS0FBa0JILFNBRDNELEVBQ3VFOztBQUV0RTtBQUNBLE9BQUtBLFVBQVVJLGdCQUFmLEVBQWtDO0FBQ2pDSixjQUFVSSxnQkFBVixDQUE0QixRQUE1QixFQUFzQzdELGFBQXRDLEVBQXFELEtBQXJEOztBQUVEO0FBQ0MsSUFKRCxNQUlPLElBQUt5RCxVQUFVSyxXQUFmLEVBQTZCO0FBQ25DTCxjQUFVSyxXQUFWLENBQXVCLFVBQXZCLEVBQW1DOUQsYUFBbkM7QUFDQTtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTFELFVBQVFtRixLQUFSLEdBQWdCUyxPQUFRLFVBQVVDLEVBQVYsRUFBZTtBQUN0Q25GLFdBQVErRyxXQUFSLENBQXFCNUIsRUFBckIsRUFBMEI0QixXQUExQixDQUF1QzdhLFNBQVNrWixhQUFULENBQXdCLEtBQXhCLENBQXZDO0FBQ0EsVUFBTyxPQUFPRCxHQUFHaFosZ0JBQVYsS0FBK0IsV0FBL0IsSUFDTixDQUFDZ1osR0FBR2haLGdCQUFILENBQXFCLHFCQUFyQixFQUE2Q2EsTUFEL0M7QUFFQSxHQUplLENBQWhCOztBQU1BOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQXNTLFVBQVExUixVQUFSLEdBQXFCc1gsT0FBUSxVQUFVQyxFQUFWLEVBQWU7QUFDM0NBLE1BQUd2UyxTQUFILEdBQWUsR0FBZjtBQUNBLFVBQU8sQ0FBQ3VTLEdBQUdqWCxZQUFILENBQWlCLFdBQWpCLENBQVI7QUFDQSxHQUhvQixDQUFyQjs7QUFLQTs7O0FBR0E7QUFDQW9SLFVBQVF4SSxvQkFBUixHQUErQm9PLE9BQVEsVUFBVUMsRUFBVixFQUFlO0FBQ3JEQSxNQUFHNEIsV0FBSCxDQUFnQjdhLFNBQVM4YSxhQUFULENBQXdCLEVBQXhCLENBQWhCO0FBQ0EsVUFBTyxDQUFDN0IsR0FBR3JPLG9CQUFILENBQXlCLEdBQXpCLEVBQStCOUosTUFBdkM7QUFDQSxHQUg4QixDQUEvQjs7QUFLQTtBQUNBc1MsVUFBUXJJLHNCQUFSLEdBQWlDa0wsUUFBUXJSLElBQVIsQ0FBYzVFLFNBQVMrSyxzQkFBdkIsQ0FBakM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQXFJLFVBQVEySCxPQUFSLEdBQWtCL0IsT0FBUSxVQUFVQyxFQUFWLEVBQWU7QUFDeENuRixXQUFRK0csV0FBUixDQUFxQjVCLEVBQXJCLEVBQTBCM00sRUFBMUIsR0FBK0I0SCxPQUEvQjtBQUNBLFVBQU8sQ0FBQ2xVLFNBQVNnYixpQkFBVixJQUErQixDQUFDaGIsU0FBU2diLGlCQUFULENBQTRCOUcsT0FBNUIsRUFBc0NwVCxNQUE3RTtBQUNBLEdBSGlCLENBQWxCOztBQUtBO0FBQ0EsTUFBS3NTLFFBQVEySCxPQUFiLEVBQXVCO0FBQ3RCMUgsUUFBS2xSLE1BQUwsQ0FBYSxJQUFiLElBQXNCLFVBQVVtSyxFQUFWLEVBQWU7QUFDcEMsUUFBSTJPLFNBQVMzTyxHQUFHOUksT0FBSCxDQUFZNFMsU0FBWixFQUF1QkMsU0FBdkIsQ0FBYjtBQUNBLFdBQU8sVUFBVXJCLElBQVYsRUFBaUI7QUFDdkIsWUFBT0EsS0FBS2hULFlBQUwsQ0FBbUIsSUFBbkIsTUFBOEJpWixNQUFyQztBQUNBLEtBRkQ7QUFHQSxJQUxEO0FBTUE1SCxRQUFLNkgsSUFBTCxDQUFXLElBQVgsSUFBb0IsVUFBVTVPLEVBQVYsRUFBY3BDLE9BQWQsRUFBd0I7QUFDM0MsUUFBSyxPQUFPQSxRQUFRa08sY0FBZixLQUFrQyxXQUFsQyxJQUFpRHJFLGNBQXRELEVBQXVFO0FBQ3RFLFNBQUlpQixPQUFPOUssUUFBUWtPLGNBQVIsQ0FBd0I5TCxFQUF4QixDQUFYO0FBQ0EsWUFBTzBJLE9BQU8sQ0FBRUEsSUFBRixDQUFQLEdBQWtCLEVBQXpCO0FBQ0E7QUFDRCxJQUxEO0FBTUEsR0FiRCxNQWFPO0FBQ04zQixRQUFLbFIsTUFBTCxDQUFhLElBQWIsSUFBdUIsVUFBVW1LLEVBQVYsRUFBZTtBQUNyQyxRQUFJMk8sU0FBUzNPLEdBQUc5SSxPQUFILENBQVk0UyxTQUFaLEVBQXVCQyxTQUF2QixDQUFiO0FBQ0EsV0FBTyxVQUFVckIsSUFBVixFQUFpQjtBQUN2QixTQUFJcFIsT0FBTyxPQUFPb1IsS0FBS21HLGdCQUFaLEtBQWlDLFdBQWpDLElBQ1ZuRyxLQUFLbUcsZ0JBQUwsQ0FBdUIsSUFBdkIsQ0FERDtBQUVBLFlBQU92WCxRQUFRQSxLQUFLZixLQUFMLEtBQWVvWSxNQUE5QjtBQUNBLEtBSkQ7QUFLQSxJQVBEOztBQVNBO0FBQ0E7QUFDQTVILFFBQUs2SCxJQUFMLENBQVcsSUFBWCxJQUFvQixVQUFVNU8sRUFBVixFQUFjcEMsT0FBZCxFQUF3QjtBQUMzQyxRQUFLLE9BQU9BLFFBQVFrTyxjQUFmLEtBQWtDLFdBQWxDLElBQWlEckUsY0FBdEQsRUFBdUU7QUFDdEUsU0FBSW5RLElBQUo7QUFBQSxTQUFVMUMsQ0FBVjtBQUFBLFNBQWFrYSxLQUFiO0FBQUEsU0FDQ3BHLE9BQU85SyxRQUFRa08sY0FBUixDQUF3QjlMLEVBQXhCLENBRFI7O0FBR0EsU0FBSzBJLElBQUwsRUFBWTs7QUFFWDtBQUNBcFIsYUFBT29SLEtBQUttRyxnQkFBTCxDQUF1QixJQUF2QixDQUFQO0FBQ0EsVUFBS3ZYLFFBQVFBLEtBQUtmLEtBQUwsS0FBZXlKLEVBQTVCLEVBQWlDO0FBQ2hDLGNBQU8sQ0FBRTBJLElBQUYsQ0FBUDtBQUNBOztBQUVEO0FBQ0FvRyxjQUFRbFIsUUFBUThRLGlCQUFSLENBQTJCMU8sRUFBM0IsQ0FBUjtBQUNBcEwsVUFBSSxDQUFKO0FBQ0EsYUFBVThULE9BQU9vRyxNQUFPbGEsR0FBUCxDQUFqQixFQUFrQztBQUNqQzBDLGNBQU9vUixLQUFLbUcsZ0JBQUwsQ0FBdUIsSUFBdkIsQ0FBUDtBQUNBLFdBQUt2WCxRQUFRQSxLQUFLZixLQUFMLEtBQWV5SixFQUE1QixFQUFpQztBQUNoQyxlQUFPLENBQUUwSSxJQUFGLENBQVA7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsWUFBTyxFQUFQO0FBQ0E7QUFDRCxJQTFCRDtBQTJCQTs7QUFFRDtBQUNBM0IsT0FBSzZILElBQUwsQ0FBVyxLQUFYLElBQXFCOUgsUUFBUXhJLG9CQUFSLEdBQ3BCLFVBQVVqSixHQUFWLEVBQWV1SSxPQUFmLEVBQXlCO0FBQ3hCLE9BQUssT0FBT0EsUUFBUVUsb0JBQWYsS0FBd0MsV0FBN0MsRUFBMkQ7QUFDMUQsV0FBT1YsUUFBUVUsb0JBQVIsQ0FBOEJqSixHQUE5QixDQUFQOztBQUVEO0FBQ0MsSUFKRCxNQUlPLElBQUt5UixRQUFRaUYsR0FBYixFQUFtQjtBQUN6QixXQUFPbk8sUUFBUWpLLGdCQUFSLENBQTBCMEIsR0FBMUIsQ0FBUDtBQUNBO0FBQ0QsR0FUbUIsR0FXcEIsVUFBVUEsR0FBVixFQUFldUksT0FBZixFQUF5QjtBQUN4QixPQUFJOEssSUFBSjtBQUFBLE9BQ0NxRyxNQUFNLEVBRFA7QUFBQSxPQUVDbmEsSUFBSSxDQUZMOzs7QUFJQztBQUNBeVcsYUFBVXpOLFFBQVFVLG9CQUFSLENBQThCakosR0FBOUIsQ0FMWDs7QUFPQTtBQUNBLE9BQUtBLFFBQVEsR0FBYixFQUFtQjtBQUNsQixXQUFVcVQsT0FBTzJDLFFBQVN6VyxHQUFULENBQWpCLEVBQW9DO0FBQ25DLFNBQUs4VCxLQUFLblEsUUFBTCxLQUFrQixDQUF2QixFQUEyQjtBQUMxQndXLFVBQUkxVixJQUFKLENBQVVxUCxJQUFWO0FBQ0E7QUFDRDs7QUFFRCxXQUFPcUcsR0FBUDtBQUNBO0FBQ0QsVUFBTzFELE9BQVA7QUFDQSxHQTlCRjs7QUFnQ0E7QUFDQXRFLE9BQUs2SCxJQUFMLENBQVcsT0FBWCxJQUF1QjlILFFBQVFySSxzQkFBUixJQUFrQyxVQUFVckUsU0FBVixFQUFxQndELE9BQXJCLEVBQStCO0FBQ3ZGLE9BQUssT0FBT0EsUUFBUWEsc0JBQWYsS0FBMEMsV0FBMUMsSUFBeURnSixjQUE5RCxFQUErRTtBQUM5RSxXQUFPN0osUUFBUWEsc0JBQVIsQ0FBZ0NyRSxTQUFoQyxDQUFQO0FBQ0E7QUFDRCxHQUpEOztBQU1BOzs7QUFHQTs7QUFFQTtBQUNBdU4sa0JBQWdCLEVBQWhCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUQsY0FBWSxFQUFaOztBQUVBLE1BQU9aLFFBQVFpRixHQUFSLEdBQWNwQyxRQUFRclIsSUFBUixDQUFjNUUsU0FBU0MsZ0JBQXZCLENBQXJCLEVBQW1FOztBQUVsRTtBQUNBO0FBQ0ErWSxVQUFRLFVBQVVDLEVBQVYsRUFBZTs7QUFFdEIsUUFBSWpMLEtBQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOEYsWUFBUStHLFdBQVIsQ0FBcUI1QixFQUFyQixFQUEwQnFDLFNBQTFCLEdBQXNDLFlBQVlwSCxPQUFaLEdBQXNCLFFBQXRCLEdBQ3JDLGNBRHFDLEdBQ3BCQSxPQURvQixHQUNWLDJCQURVLEdBRXJDLHdDQUZEOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSytFLEdBQUdoWixnQkFBSCxDQUFxQixzQkFBckIsRUFBOENhLE1BQW5ELEVBQTREO0FBQzNEa1QsZUFBVXJPLElBQVYsQ0FBZ0IsV0FBV3dQLFVBQVgsR0FBd0IsY0FBeEM7QUFDQTs7QUFFRDtBQUNBO0FBQ0EsUUFBSyxDQUFDOEQsR0FBR2haLGdCQUFILENBQXFCLFlBQXJCLEVBQW9DYSxNQUExQyxFQUFtRDtBQUNsRGtULGVBQVVyTyxJQUFWLENBQWdCLFFBQVF3UCxVQUFSLEdBQXFCLFlBQXJCLEdBQW9DRCxRQUFwQyxHQUErQyxHQUEvRDtBQUNBOztBQUVEO0FBQ0EsUUFBSyxDQUFDK0QsR0FBR2haLGdCQUFILENBQXFCLFVBQVVpVSxPQUFWLEdBQW9CLElBQXpDLEVBQWdEcFQsTUFBdEQsRUFBK0Q7QUFDOURrVCxlQUFVck8sSUFBVixDQUFnQixJQUFoQjtBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQXFJLFlBQVFoTyxTQUFTa1osYUFBVCxDQUF3QixPQUF4QixDQUFSO0FBQ0FsTCxVQUFNd0ssWUFBTixDQUFvQixNQUFwQixFQUE0QixFQUE1QjtBQUNBUyxPQUFHNEIsV0FBSCxDQUFnQjdNLEtBQWhCO0FBQ0EsUUFBSyxDQUFDaUwsR0FBR2haLGdCQUFILENBQXFCLFdBQXJCLEVBQW1DYSxNQUF6QyxFQUFrRDtBQUNqRGtULGVBQVVyTyxJQUFWLENBQWdCLFFBQVF3UCxVQUFSLEdBQXFCLE9BQXJCLEdBQStCQSxVQUEvQixHQUE0QyxJQUE1QyxHQUNmQSxVQURlLEdBQ0YsY0FEZDtBQUVBOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFFBQUssQ0FBQzhELEdBQUdoWixnQkFBSCxDQUFxQixVQUFyQixFQUFrQ2EsTUFBeEMsRUFBaUQ7QUFDaERrVCxlQUFVck8sSUFBVixDQUFnQixVQUFoQjtBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFFBQUssQ0FBQ3NULEdBQUdoWixnQkFBSCxDQUFxQixPQUFPaVUsT0FBUCxHQUFpQixJQUF0QyxFQUE2Q3BULE1BQW5ELEVBQTREO0FBQzNEa1QsZUFBVXJPLElBQVYsQ0FBZ0IsVUFBaEI7QUFDQTs7QUFFRDtBQUNBO0FBQ0FzVCxPQUFHaFosZ0JBQUgsQ0FBcUIsTUFBckI7QUFDQStULGNBQVVyTyxJQUFWLENBQWdCLGFBQWhCO0FBQ0EsSUEvREQ7O0FBaUVBcVQsVUFBUSxVQUFVQyxFQUFWLEVBQWU7QUFDdEJBLE9BQUdxQyxTQUFILEdBQWUsd0NBQ2QsZ0RBREQ7O0FBR0E7QUFDQTtBQUNBLFFBQUl0TixRQUFRaE8sU0FBU2taLGFBQVQsQ0FBd0IsT0FBeEIsQ0FBWjtBQUNBbEwsVUFBTXdLLFlBQU4sQ0FBb0IsTUFBcEIsRUFBNEIsUUFBNUI7QUFDQVMsT0FBRzRCLFdBQUgsQ0FBZ0I3TSxLQUFoQixFQUF3QndLLFlBQXhCLENBQXNDLE1BQXRDLEVBQThDLEdBQTlDOztBQUVBO0FBQ0E7QUFDQSxRQUFLUyxHQUFHaFosZ0JBQUgsQ0FBcUIsVUFBckIsRUFBa0NhLE1BQXZDLEVBQWdEO0FBQy9Da1QsZUFBVXJPLElBQVYsQ0FBZ0IsU0FBU3dQLFVBQVQsR0FBc0IsYUFBdEM7QUFDQTs7QUFFRDtBQUNBO0FBQ0EsUUFBSzhELEdBQUdoWixnQkFBSCxDQUFxQixVQUFyQixFQUFrQ2EsTUFBbEMsS0FBNkMsQ0FBbEQsRUFBc0Q7QUFDckRrVCxlQUFVck8sSUFBVixDQUFnQixVQUFoQixFQUE0QixXQUE1QjtBQUNBOztBQUVEO0FBQ0E7QUFDQW1PLFlBQVErRyxXQUFSLENBQXFCNUIsRUFBckIsRUFBMEJoQyxRQUExQixHQUFxQyxJQUFyQztBQUNBLFFBQUtnQyxHQUFHaFosZ0JBQUgsQ0FBcUIsV0FBckIsRUFBbUNhLE1BQW5DLEtBQThDLENBQW5ELEVBQXVEO0FBQ3REa1QsZUFBVXJPLElBQVYsQ0FBZ0IsVUFBaEIsRUFBNEIsV0FBNUI7QUFDQTs7QUFFRDtBQUNBO0FBQ0FzVCxPQUFHaFosZ0JBQUgsQ0FBcUIsTUFBckI7QUFDQStULGNBQVVyTyxJQUFWLENBQWdCLE1BQWhCO0FBQ0EsSUFqQ0Q7QUFrQ0E7O0FBRUQsTUFBT3lOLFFBQVFtSSxlQUFSLEdBQTBCdEYsUUFBUXJSLElBQVIsQ0FBZ0JVLFVBQVV3TyxRQUFReE8sT0FBUixJQUMxRHdPLFFBQVEwSCxxQkFEa0QsSUFFMUQxSCxRQUFRMkgsa0JBRmtELElBRzFEM0gsUUFBUTRILGdCQUhrRCxJQUkxRDVILFFBQVE2SCxpQkFKd0IsQ0FBakMsRUFJbUM7O0FBRWxDM0MsVUFBUSxVQUFVQyxFQUFWLEVBQWU7O0FBRXRCO0FBQ0E7QUFDQTdGLFlBQVF3SSxpQkFBUixHQUE0QnRXLFFBQVErUixJQUFSLENBQWM0QixFQUFkLEVBQWtCLEdBQWxCLENBQTVCOztBQUVBO0FBQ0E7QUFDQTNULFlBQVErUixJQUFSLENBQWM0QixFQUFkLEVBQWtCLFdBQWxCO0FBQ0FoRixrQkFBY3RPLElBQWQsQ0FBb0IsSUFBcEIsRUFBMEIwUCxPQUExQjtBQUNBLElBVkQ7QUFXQTs7QUFFRHJCLGNBQVlBLFVBQVVsVCxNQUFWLElBQW9CLElBQUk2RCxNQUFKLENBQVlxUCxVQUFVNU8sSUFBVixDQUFnQixHQUFoQixDQUFaLENBQWhDO0FBQ0E2TyxrQkFBZ0JBLGNBQWNuVCxNQUFkLElBQXdCLElBQUk2RCxNQUFKLENBQVlzUCxjQUFjN08sSUFBZCxDQUFvQixHQUFwQixDQUFaLENBQXhDOztBQUVBOztBQUVBa1YsZUFBYXJFLFFBQVFyUixJQUFSLENBQWNrUCxRQUFRK0gsdUJBQXRCLENBQWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EvUyxhQUFXd1IsY0FBY3JFLFFBQVFyUixJQUFSLENBQWNrUCxRQUFRaEwsUUFBdEIsQ0FBZCxHQUNWLFVBQVVqRCxDQUFWLEVBQWFDLENBQWIsRUFBaUI7QUFDaEIsT0FBSWdXLFFBQVFqVyxFQUFFaEIsUUFBRixLQUFlLENBQWYsR0FBbUJnQixFQUFFd1UsZUFBckIsR0FBdUN4VSxDQUFuRDtBQUFBLE9BQ0NrVyxNQUFNalcsS0FBS0EsRUFBRXJGLFVBRGQ7QUFFQSxVQUFPb0YsTUFBTWtXLEdBQU4sSUFBYSxDQUFDLEVBQUdBLE9BQU9BLElBQUlsWCxRQUFKLEtBQWlCLENBQXhCLEtBQ3ZCaVgsTUFBTWhULFFBQU4sR0FDQ2dULE1BQU1oVCxRQUFOLENBQWdCaVQsR0FBaEIsQ0FERCxHQUVDbFcsRUFBRWdXLHVCQUFGLElBQTZCaFcsRUFBRWdXLHVCQUFGLENBQTJCRSxHQUEzQixJQUFtQyxFQUgxQyxDQUFILENBQXJCO0FBS0EsR0FUUyxHQVVWLFVBQVVsVyxDQUFWLEVBQWFDLENBQWIsRUFBaUI7QUFDaEIsT0FBS0EsQ0FBTCxFQUFTO0FBQ1IsV0FBVUEsSUFBSUEsRUFBRXJGLFVBQWhCLEVBQStCO0FBQzlCLFNBQUtxRixNQUFNRCxDQUFYLEVBQWU7QUFDZCxhQUFPLElBQVA7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxVQUFPLEtBQVA7QUFDQSxHQW5CRjs7QUFxQkE7OztBQUdBO0FBQ0E4TyxjQUFZMkYsYUFDWixVQUFVelUsQ0FBVixFQUFhQyxDQUFiLEVBQWlCOztBQUVoQjtBQUNBLE9BQUtELE1BQU1DLENBQVgsRUFBZTtBQUNkOE4sbUJBQWUsSUFBZjtBQUNBLFdBQU8sQ0FBUDtBQUNBOztBQUVEO0FBQ0EsT0FBSXJQLFVBQVUsQ0FBQ3NCLEVBQUVnVyx1QkFBSCxHQUE2QixDQUFDL1YsRUFBRStWLHVCQUE5QztBQUNBLE9BQUt0WCxPQUFMLEVBQWU7QUFDZCxXQUFPQSxPQUFQO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxhQUFVLENBQUVzQixFQUFFcVMsYUFBRixJQUFtQnJTLENBQXJCLE1BQThCQyxFQUFFb1MsYUFBRixJQUFtQnBTLENBQWpELElBQ1RELEVBQUVnVyx1QkFBRixDQUEyQi9WLENBQTNCLENBRFM7O0FBR1Q7QUFDQSxJQUpEOztBQU1BO0FBQ0EsT0FBS3ZCLFVBQVUsQ0FBVixJQUNGLENBQUM2TyxRQUFRNEksWUFBVCxJQUF5QmxXLEVBQUUrVix1QkFBRixDQUEyQmhXLENBQTNCLE1BQW1DdEIsT0FEL0QsRUFDMkU7O0FBRTFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFLc0IsS0FBSzdGLFFBQUwsSUFBaUI2RixFQUFFcVMsYUFBRixJQUFtQjlELFlBQW5CLElBQ3JCdEwsU0FBVXNMLFlBQVYsRUFBd0J2TyxDQUF4QixDQURELEVBQytCO0FBQzlCLFlBQU8sQ0FBQyxDQUFSO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFLQyxLQUFLOUYsUUFBTCxJQUFpQjhGLEVBQUVvUyxhQUFGLElBQW1COUQsWUFBbkIsSUFDckJ0TCxTQUFVc0wsWUFBVixFQUF3QnRPLENBQXhCLENBREQsRUFDK0I7QUFDOUIsWUFBTyxDQUFQO0FBQ0E7O0FBRUQ7QUFDQSxXQUFPNk4sWUFDSmhRLFFBQVNnUSxTQUFULEVBQW9COU4sQ0FBcEIsSUFBMEJsQyxRQUFTZ1EsU0FBVCxFQUFvQjdOLENBQXBCLENBRHRCLEdBRU4sQ0FGRDtBQUdBOztBQUVELFVBQU92QixVQUFVLENBQVYsR0FBYyxDQUFDLENBQWYsR0FBbUIsQ0FBMUI7QUFDQSxHQXhEVyxHQXlEWixVQUFVc0IsQ0FBVixFQUFhQyxDQUFiLEVBQWlCOztBQUVoQjtBQUNBLE9BQUtELE1BQU1DLENBQVgsRUFBZTtBQUNkOE4sbUJBQWUsSUFBZjtBQUNBLFdBQU8sQ0FBUDtBQUNBOztBQUVELE9BQUk0RixHQUFKO0FBQUEsT0FDQ3RZLElBQUksQ0FETDtBQUFBLE9BRUMrYSxNQUFNcFcsRUFBRXBGLFVBRlQ7QUFBQSxPQUdDc2IsTUFBTWpXLEVBQUVyRixVQUhUO0FBQUEsT0FJQ3liLEtBQUssQ0FBRXJXLENBQUYsQ0FKTjtBQUFBLE9BS0NzVyxLQUFLLENBQUVyVyxDQUFGLENBTE47O0FBT0E7QUFDQSxPQUFLLENBQUNtVyxHQUFELElBQVEsQ0FBQ0YsR0FBZCxFQUFvQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFPbFcsS0FBSzdGLFFBQUwsR0FBZ0IsQ0FBQyxDQUFqQixHQUNOOEYsS0FBSzlGLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQTtBQUNBaWMsVUFBTSxDQUFDLENBQVAsR0FDQUYsTUFBTSxDQUFOLEdBQ0FwSSxZQUNFaFEsUUFBU2dRLFNBQVQsRUFBb0I5TixDQUFwQixJQUEwQmxDLFFBQVNnUSxTQUFULEVBQW9CN04sQ0FBcEIsQ0FENUIsR0FFQSxDQVBEOztBQVNEO0FBQ0MsSUFoQkQsTUFnQk8sSUFBS21XLFFBQVFGLEdBQWIsRUFBbUI7QUFDekIsV0FBT3hDLGFBQWMxVCxDQUFkLEVBQWlCQyxDQUFqQixDQUFQO0FBQ0E7O0FBRUQ7QUFDQTBULFNBQU0zVCxDQUFOO0FBQ0EsVUFBVTJULE1BQU1BLElBQUkvWSxVQUFwQixFQUFtQztBQUNsQ3liLE9BQUd4YixPQUFILENBQVk4WSxHQUFaO0FBQ0E7QUFDREEsU0FBTTFULENBQU47QUFDQSxVQUFVMFQsTUFBTUEsSUFBSS9ZLFVBQXBCLEVBQW1DO0FBQ2xDMGIsT0FBR3piLE9BQUgsQ0FBWThZLEdBQVo7QUFDQTs7QUFFRDtBQUNBLFVBQVEwQyxHQUFJaGIsQ0FBSixNQUFZaWIsR0FBSWpiLENBQUosQ0FBcEIsRUFBOEI7QUFDN0JBO0FBQ0E7O0FBRUQsVUFBT0E7O0FBRU47QUFDQXFZLGdCQUFjMkMsR0FBSWhiLENBQUosQ0FBZCxFQUF1QmliLEdBQUlqYixDQUFKLENBQXZCLENBSE07O0FBS047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBZ2IsTUFBSWhiLENBQUosS0FBV2tULFlBQVgsR0FBMEIsQ0FBQyxDQUEzQixHQUNBK0gsR0FBSWpiLENBQUosS0FBV2tULFlBQVgsR0FBMEIsQ0FBMUI7QUFDQTtBQUNBLElBYkQ7QUFjQSxHQTFIRDs7QUE0SEEsU0FBT3BVLFFBQVA7QUFDQSxFQTFkRDs7QUE0ZEFKLFFBQU8wRixPQUFQLEdBQWlCLFVBQVU4VyxJQUFWLEVBQWdCbGMsUUFBaEIsRUFBMkI7QUFDM0MsU0FBT04sT0FBUXdjLElBQVIsRUFBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCbGMsUUFBMUIsQ0FBUDtBQUNBLEVBRkQ7O0FBSUFOLFFBQU8yYixlQUFQLEdBQXlCLFVBQVV2RyxJQUFWLEVBQWdCb0gsSUFBaEIsRUFBdUI7QUFDL0N2SSxjQUFhbUIsSUFBYjs7QUFFQSxNQUFLNUIsUUFBUW1JLGVBQVIsSUFBMkJ4SCxjQUEzQixJQUNKLENBQUNXLHVCQUF3QjBILE9BQU8sR0FBL0IsQ0FERyxLQUVGLENBQUNuSSxhQUFELElBQWtCLENBQUNBLGNBQWNyUCxJQUFkLENBQW9Cd1gsSUFBcEIsQ0FGakIsTUFHRixDQUFDcEksU0FBRCxJQUFrQixDQUFDQSxVQUFVcFAsSUFBVixDQUFnQndYLElBQWhCLENBSGpCLENBQUwsRUFHaUQ7O0FBRWhELE9BQUk7QUFDSCxRQUFJQyxNQUFNL1csUUFBUStSLElBQVIsQ0FBY3JDLElBQWQsRUFBb0JvSCxJQUFwQixDQUFWOztBQUVBO0FBQ0EsUUFBS0MsT0FBT2pKLFFBQVF3SSxpQkFBZjs7QUFFSjtBQUNBO0FBQ0E1RyxTQUFLaFYsUUFBTCxJQUFpQmdWLEtBQUtoVixRQUFMLENBQWM2RSxRQUFkLEtBQTJCLEVBSjdDLEVBSWtEO0FBQ2pELFlBQU93WCxHQUFQO0FBQ0E7QUFDRCxJQVhELENBV0UsT0FBUTlFLENBQVIsRUFBWTtBQUNiN0MsMkJBQXdCMEgsSUFBeEIsRUFBOEIsSUFBOUI7QUFDQTtBQUNEOztBQUVELFNBQU94YyxPQUFRd2MsSUFBUixFQUFjcGMsUUFBZCxFQUF3QixJQUF4QixFQUE4QixDQUFFZ1YsSUFBRixDQUE5QixFQUF5Q2xVLE1BQXpDLEdBQWtELENBQXpEO0FBQ0EsRUF6QkQ7O0FBMkJBbEIsUUFBT2tKLFFBQVAsR0FBa0IsVUFBVW9CLE9BQVYsRUFBbUI4SyxJQUFuQixFQUEwQjs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUssQ0FBRTlLLFFBQVFnTyxhQUFSLElBQXlCaE8sT0FBM0IsS0FBd0NsSyxRQUE3QyxFQUF3RDtBQUN2RDZULGVBQWEzSixPQUFiO0FBQ0E7QUFDRCxTQUFPcEIsU0FBVW9CLE9BQVYsRUFBbUI4SyxJQUFuQixDQUFQO0FBQ0EsRUFYRDs7QUFhQXBWLFFBQU9xUixJQUFQLEdBQWMsVUFBVStELElBQVYsRUFBZ0IzUyxJQUFoQixFQUF1Qjs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUssQ0FBRTJTLEtBQUtrRCxhQUFMLElBQXNCbEQsSUFBeEIsS0FBa0NoVixRQUF2QyxFQUFrRDtBQUNqRDZULGVBQWFtQixJQUFiO0FBQ0E7O0FBRUQsTUFBSStELEtBQUsxRixLQUFLaUcsVUFBTCxDQUFpQmpYLEtBQUthLFdBQUwsRUFBakIsQ0FBVDs7O0FBRUM7QUFDQThDLFFBQU0rUyxNQUFNbkUsT0FBT3lDLElBQVAsQ0FBYWhFLEtBQUtpRyxVQUFsQixFQUE4QmpYLEtBQUthLFdBQUwsRUFBOUIsQ0FBTixHQUNMNlYsR0FBSS9ELElBQUosRUFBVTNTLElBQVYsRUFBZ0IsQ0FBQzBSLGNBQWpCLENBREssR0FFTGhTLFNBTEY7O0FBT0EsU0FBT2lFLFFBQVFqRSxTQUFSLEdBQ05pRSxHQURNLEdBRU5vTixRQUFRMVIsVUFBUixJQUFzQixDQUFDcVMsY0FBdkIsR0FDQ2lCLEtBQUtoVCxZQUFMLENBQW1CSyxJQUFuQixDQURELEdBRUMsQ0FBRTJELE1BQU1nUCxLQUFLbUcsZ0JBQUwsQ0FBdUI5WSxJQUF2QixDQUFSLEtBQTJDMkQsSUFBSXNXLFNBQS9DLEdBQ0N0VyxJQUFJbkQsS0FETCxHQUVDLElBTkg7QUFPQSxFQXpCRDs7QUEyQkFqRCxRQUFPMFcsTUFBUCxHQUFnQixVQUFVaUcsR0FBVixFQUFnQjtBQUMvQixTQUFPLENBQUVBLE1BQU0sRUFBUixFQUFhL1ksT0FBYixDQUFzQmlULFVBQXRCLEVBQWtDQyxVQUFsQyxDQUFQO0FBQ0EsRUFGRDs7QUFJQTlXLFFBQU80YyxLQUFQLEdBQWUsVUFBVUMsR0FBVixFQUFnQjtBQUM5QixRQUFNLElBQUk5VSxLQUFKLENBQVcsNENBQTRDOFUsR0FBdkQsQ0FBTjtBQUNBLEVBRkQ7O0FBSUE7Ozs7QUFJQTdjLFFBQU84YyxVQUFQLEdBQW9CLFVBQVUvRSxPQUFWLEVBQW9CO0FBQ3ZDLE1BQUkzQyxJQUFKO0FBQUEsTUFDQzJILGFBQWEsRUFEZDtBQUFBLE1BRUNqRixJQUFJLENBRkw7QUFBQSxNQUdDeFcsSUFBSSxDQUhMOztBQUtBO0FBQ0EwUyxpQkFBZSxDQUFDUixRQUFRd0osZ0JBQXhCO0FBQ0FqSixjQUFZLENBQUNQLFFBQVF5SixVQUFULElBQXVCbEYsUUFBUTVQLEtBQVIsQ0FBZSxDQUFmLENBQW5DO0FBQ0E0UCxVQUFRaFgsSUFBUixDQUFjZ1UsU0FBZDs7QUFFQSxNQUFLZixZQUFMLEVBQW9CO0FBQ25CLFVBQVVvQixPQUFPMkMsUUFBU3pXLEdBQVQsQ0FBakIsRUFBb0M7QUFDbkMsUUFBSzhULFNBQVMyQyxRQUFTelcsQ0FBVCxDQUFkLEVBQTZCO0FBQzVCd1csU0FBSWlGLFdBQVdoWCxJQUFYLENBQWlCekUsQ0FBakIsQ0FBSjtBQUNBO0FBQ0Q7QUFDRCxVQUFRd1csR0FBUixFQUFjO0FBQ2JDLFlBQVFtRixNQUFSLENBQWdCSCxXQUFZakYsQ0FBWixDQUFoQixFQUFpQyxDQUFqQztBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBL0QsY0FBWSxJQUFaOztBQUVBLFNBQU9nRSxPQUFQO0FBQ0EsRUEzQkQ7O0FBNkJBOzs7O0FBSUFyRSxXQUFVMVQsT0FBTzBULE9BQVAsR0FBaUIsVUFBVTBCLElBQVYsRUFBaUI7QUFDM0MsTUFBSXBSLElBQUo7QUFBQSxNQUNDeVksTUFBTSxFQURQO0FBQUEsTUFFQ25iLElBQUksQ0FGTDtBQUFBLE1BR0MyRCxXQUFXbVEsS0FBS25RLFFBSGpCOztBQUtBLE1BQUssQ0FBQ0EsUUFBTixFQUFpQjs7QUFFaEI7QUFDQSxVQUFVakIsT0FBT29SLEtBQU05VCxHQUFOLENBQWpCLEVBQWlDOztBQUVoQztBQUNBbWIsV0FBTy9JLFFBQVMxUCxJQUFULENBQVA7QUFDQTtBQUNELEdBUkQsTUFRTyxJQUFLaUIsYUFBYSxDQUFiLElBQWtCQSxhQUFhLENBQS9CLElBQW9DQSxhQUFhLEVBQXRELEVBQTJEOztBQUVqRTtBQUNBO0FBQ0EsT0FBSyxPQUFPbVEsS0FBSzVOLFdBQVosS0FBNEIsUUFBakMsRUFBNEM7QUFDM0MsV0FBTzROLEtBQUs1TixXQUFaO0FBQ0EsSUFGRCxNQUVPOztBQUVOO0FBQ0EsU0FBTTROLE9BQU9BLEtBQUsrSCxVQUFsQixFQUE4Qi9ILElBQTlCLEVBQW9DQSxPQUFPQSxLQUFLMkUsV0FBaEQsRUFBOEQ7QUFDN0QwQyxZQUFPL0ksUUFBUzBCLElBQVQsQ0FBUDtBQUNBO0FBQ0Q7QUFDRCxHQWJNLE1BYUEsSUFBS25RLGFBQWEsQ0FBYixJQUFrQkEsYUFBYSxDQUFwQyxFQUF3QztBQUM5QyxVQUFPbVEsS0FBS2dJLFNBQVo7QUFDQTs7QUFFRDs7QUFFQSxTQUFPWCxHQUFQO0FBQ0EsRUFsQ0Q7O0FBb0NBaEosUUFBT3pULE9BQU9xTCxTQUFQLEdBQW1COztBQUV6QjtBQUNBNE4sZUFBYSxFQUhZOztBQUt6Qm9FLGdCQUFjbkUsWUFMVzs7QUFPekJyVixTQUFPb1MsU0FQa0I7O0FBU3pCeUQsY0FBWSxFQVRhOztBQVd6QjRCLFFBQU0sRUFYbUI7O0FBYXpCZ0MsWUFBVTtBQUNULFFBQUssRUFBRS9GLEtBQUssWUFBUCxFQUFxQmdHLE9BQU8sSUFBNUIsRUFESTtBQUVULFFBQUssRUFBRWhHLEtBQUssWUFBUCxFQUZJO0FBR1QsUUFBSyxFQUFFQSxLQUFLLGlCQUFQLEVBQTBCZ0csT0FBTyxJQUFqQyxFQUhJO0FBSVQsUUFBSyxFQUFFaEcsS0FBSyxpQkFBUDtBQUpJLEdBYmU7O0FBb0J6QmlHLGFBQVc7QUFDVixXQUFRLGNBQVUzWixLQUFWLEVBQWtCO0FBQ3pCQSxVQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLEVBQVdELE9BQVgsQ0FBb0I0UyxTQUFwQixFQUErQkMsU0FBL0IsQ0FBYjs7QUFFQTtBQUNBNVMsVUFBTyxDQUFQLElBQWEsQ0FBRUEsTUFBTyxDQUFQLEtBQWNBLE1BQU8sQ0FBUCxDQUFkLElBQ2RBLE1BQU8sQ0FBUCxDQURjLElBQ0EsRUFERixFQUNPRCxPQURQLENBQ2dCNFMsU0FEaEIsRUFDMkJDLFNBRDNCLENBQWI7O0FBR0EsUUFBSzVTLE1BQU8sQ0FBUCxNQUFlLElBQXBCLEVBQTJCO0FBQzFCQSxXQUFPLENBQVAsSUFBYSxNQUFNQSxNQUFPLENBQVAsQ0FBTixHQUFtQixHQUFoQztBQUNBOztBQUVELFdBQU9BLE1BQU1zRSxLQUFOLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFQO0FBQ0EsSUFiUzs7QUFlVixZQUFTLGVBQVV0RSxLQUFWLEVBQWtCOztBQUUxQjs7Ozs7Ozs7OztBQVVBQSxVQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLEVBQVdQLFdBQVgsRUFBYjs7QUFFQSxRQUFLTyxNQUFPLENBQVAsRUFBV3NFLEtBQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsTUFBNkIsS0FBbEMsRUFBMEM7O0FBRXpDO0FBQ0EsU0FBSyxDQUFDdEUsTUFBTyxDQUFQLENBQU4sRUFBbUI7QUFDbEI3RCxhQUFPNGMsS0FBUCxDQUFjL1ksTUFBTyxDQUFQLENBQWQ7QUFDQTs7QUFFRDtBQUNBO0FBQ0FBLFdBQU8sQ0FBUCxJQUFhLEVBQUdBLE1BQU8sQ0FBUCxJQUNmQSxNQUFPLENBQVAsS0FBZUEsTUFBTyxDQUFQLEtBQWMsQ0FBN0IsQ0FEZSxHQUVmLEtBQU1BLE1BQU8sQ0FBUCxNQUFlLE1BQWYsSUFBeUJBLE1BQU8sQ0FBUCxNQUFlLEtBQTlDLENBRlksQ0FBYjtBQUdBQSxXQUFPLENBQVAsSUFBYSxFQUFLQSxNQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLENBQWYsSUFBK0JBLE1BQU8sQ0FBUCxNQUFlLEtBQWpELENBQWI7O0FBRUE7QUFDQSxLQWZELE1BZU8sSUFBS0EsTUFBTyxDQUFQLENBQUwsRUFBa0I7QUFDeEI3RCxZQUFPNGMsS0FBUCxDQUFjL1ksTUFBTyxDQUFQLENBQWQ7QUFDQTs7QUFFRCxXQUFPQSxLQUFQO0FBQ0EsSUFqRFM7O0FBbURWLGFBQVUsZ0JBQVVBLEtBQVYsRUFBa0I7QUFDM0IsUUFBSTRaLE1BQUo7QUFBQSxRQUNDQyxXQUFXLENBQUM3WixNQUFPLENBQVAsQ0FBRCxJQUFlQSxNQUFPLENBQVAsQ0FEM0I7O0FBR0EsUUFBS29TLFVBQVcsT0FBWCxFQUFxQmpSLElBQXJCLENBQTJCbkIsTUFBTyxDQUFQLENBQTNCLENBQUwsRUFBK0M7QUFDOUMsWUFBTyxJQUFQO0FBQ0E7O0FBRUQ7QUFDQSxRQUFLQSxNQUFPLENBQVAsQ0FBTCxFQUFrQjtBQUNqQkEsV0FBTyxDQUFQLElBQWFBLE1BQU8sQ0FBUCxLQUFjQSxNQUFPLENBQVAsQ0FBZCxJQUE0QixFQUF6Qzs7QUFFRDtBQUNDLEtBSkQsTUFJTyxJQUFLNlosWUFBWTNILFFBQVEvUSxJQUFSLENBQWMwWSxRQUFkLENBQVo7O0FBRVg7QUFDRUQsYUFBUzdKLFNBQVU4SixRQUFWLEVBQW9CLElBQXBCLENBSEE7O0FBS1g7QUFDRUQsYUFBU0MsU0FBUzNaLE9BQVQsQ0FBa0IsR0FBbEIsRUFBdUIyWixTQUFTeGMsTUFBVCxHQUFrQnVjLE1BQXpDLElBQW9EQyxTQUFTeGMsTUFON0QsQ0FBTCxFQU02RTs7QUFFbkY7QUFDQTJDLFdBQU8sQ0FBUCxJQUFhQSxNQUFPLENBQVAsRUFBV3NFLEtBQVgsQ0FBa0IsQ0FBbEIsRUFBcUJzVixNQUFyQixDQUFiO0FBQ0E1WixXQUFPLENBQVAsSUFBYTZaLFNBQVN2VixLQUFULENBQWdCLENBQWhCLEVBQW1Cc1YsTUFBbkIsQ0FBYjtBQUNBOztBQUVEO0FBQ0EsV0FBTzVaLE1BQU1zRSxLQUFOLENBQWEsQ0FBYixFQUFnQixDQUFoQixDQUFQO0FBQ0E7QUEvRVMsR0FwQmM7O0FBc0d6QjVGLFVBQVE7O0FBRVAsVUFBTyxhQUFVb2IsZ0JBQVYsRUFBNkI7QUFDbkMsUUFBSXJHLFdBQVdxRyxpQkFBaUIvWixPQUFqQixDQUEwQjRTLFNBQTFCLEVBQXFDQyxTQUFyQyxFQUFpRG5ULFdBQWpELEVBQWY7QUFDQSxXQUFPcWEscUJBQXFCLEdBQXJCLEdBQ04sWUFBVztBQUNWLFlBQU8sSUFBUDtBQUNBLEtBSEssR0FJTixVQUFVdkksSUFBVixFQUFpQjtBQUNoQixZQUFPQSxLQUFLa0MsUUFBTCxJQUFpQmxDLEtBQUtrQyxRQUFMLENBQWNoVSxXQUFkLE9BQWdDZ1UsUUFBeEQ7QUFDQSxLQU5GO0FBT0EsSUFYTTs7QUFhUCxZQUFTLGVBQVV4USxTQUFWLEVBQXNCO0FBQzlCLFFBQUl4QixVQUFVb1AsV0FBWTVOLFlBQVksR0FBeEIsQ0FBZDs7QUFFQSxXQUFPeEIsV0FDTixDQUFFQSxVQUFVLElBQUlQLE1BQUosQ0FBWSxRQUFRd1EsVUFBUixHQUN2QixHQUR1QixHQUNqQnpPLFNBRGlCLEdBQ0wsR0FESyxHQUNDeU8sVUFERCxHQUNjLEtBRDFCLENBQVosS0FDbURiLFdBQ2pENU4sU0FEaUQsRUFDdEMsVUFBVXNPLElBQVYsRUFBaUI7QUFDM0IsWUFBTzlQLFFBQVFOLElBQVIsQ0FDTixPQUFPb1EsS0FBS3RPLFNBQVosS0FBMEIsUUFBMUIsSUFBc0NzTyxLQUFLdE8sU0FBM0MsSUFDQSxPQUFPc08sS0FBS2hULFlBQVosS0FBNkIsV0FBN0IsSUFDQ2dULEtBQUtoVCxZQUFMLENBQW1CLE9BQW5CLENBRkQsSUFHQSxFQUpNLENBQVA7QUFNRixLQVJrRCxDQUZwRDtBQVdBLElBM0JNOztBQTZCUCxXQUFRLGNBQVVLLElBQVYsRUFBZ0IrTixRQUFoQixFQUEwQjVJLEtBQTFCLEVBQWtDO0FBQ3pDLFdBQU8sVUFBVXdOLElBQVYsRUFBaUI7QUFDdkIsU0FBSXhQLFNBQVM1RixPQUFPcVIsSUFBUCxDQUFhK0QsSUFBYixFQUFtQjNTLElBQW5CLENBQWI7O0FBRUEsU0FBS21ELFVBQVUsSUFBZixFQUFzQjtBQUNyQixhQUFPNEssYUFBYSxJQUFwQjtBQUNBO0FBQ0QsU0FBSyxDQUFDQSxRQUFOLEVBQWlCO0FBQ2hCLGFBQU8sSUFBUDtBQUNBOztBQUVENUssZUFBVSxFQUFWOztBQUVBOztBQUVBLFlBQU80SyxhQUFhLEdBQWIsR0FBbUI1SyxXQUFXZ0MsS0FBOUIsR0FDTjRJLGFBQWEsSUFBYixHQUFvQjVLLFdBQVdnQyxLQUEvQixHQUNBNEksYUFBYSxJQUFiLEdBQW9CNUksU0FBU2hDLE9BQU83QixPQUFQLENBQWdCNkQsS0FBaEIsTUFBNEIsQ0FBekQsR0FDQTRJLGFBQWEsSUFBYixHQUFvQjVJLFNBQVNoQyxPQUFPN0IsT0FBUCxDQUFnQjZELEtBQWhCLElBQTBCLENBQUMsQ0FBeEQsR0FDQTRJLGFBQWEsSUFBYixHQUFvQjVJLFNBQVNoQyxPQUFPdUMsS0FBUCxDQUFjLENBQUNQLE1BQU0xRyxNQUFyQixNQUFrQzBHLEtBQS9ELEdBQ0E0SSxhQUFhLElBQWIsR0FBb0IsQ0FBRSxNQUFNNUssT0FBT2hDLE9BQVAsQ0FBZ0I4UixXQUFoQixFQUE2QixHQUE3QixDQUFOLEdBQTJDLEdBQTdDLEVBQW1EM1IsT0FBbkQsQ0FBNEQ2RCxLQUE1RCxJQUFzRSxDQUFDLENBQTNGLEdBQ0E0SSxhQUFhLElBQWIsR0FBb0I1SyxXQUFXZ0MsS0FBWCxJQUFvQmhDLE9BQU91QyxLQUFQLENBQWMsQ0FBZCxFQUFpQlAsTUFBTTFHLE1BQU4sR0FBZSxDQUFoQyxNQUF3QzBHLFFBQVEsR0FBeEYsR0FDQSxLQVBEO0FBUUE7QUFFQSxLQXhCRDtBQXlCQSxJQXZETTs7QUF5RFAsWUFBUyxlQUFVaEQsSUFBVixFQUFnQmdaLElBQWhCLEVBQXNCQyxTQUF0QixFQUFpQ04sS0FBakMsRUFBd0NPLElBQXhDLEVBQStDO0FBQ3ZELFFBQUlDLFNBQVNuWixLQUFLdUQsS0FBTCxDQUFZLENBQVosRUFBZSxDQUFmLE1BQXVCLEtBQXBDO0FBQUEsUUFDQzZWLFVBQVVwWixLQUFLdUQsS0FBTCxDQUFZLENBQUMsQ0FBYixNQUFxQixNQURoQztBQUFBLFFBRUM4VixTQUFTTCxTQUFTLFNBRm5COztBQUlBLFdBQU9MLFVBQVUsQ0FBVixJQUFlTyxTQUFTLENBQXhCOztBQUVOO0FBQ0EsY0FBVTFJLElBQVYsRUFBaUI7QUFDaEIsWUFBTyxDQUFDLENBQUNBLEtBQUt2VSxVQUFkO0FBQ0EsS0FMSyxHQU9OLFVBQVV1VSxJQUFWLEVBQWdCOEksUUFBaEIsRUFBMEJDLEdBQTFCLEVBQWdDO0FBQy9CLFNBQUluRixLQUFKO0FBQUEsU0FBV29GLFdBQVg7QUFBQSxTQUF3QkMsVUFBeEI7QUFBQSxTQUFvQ3JhLElBQXBDO0FBQUEsU0FBMENrSixTQUExQztBQUFBLFNBQXFEb0YsS0FBckQ7QUFBQSxTQUNDaUYsTUFBTXdHLFdBQVdDLE9BQVgsR0FBcUIsYUFBckIsR0FBcUMsaUJBRDVDO0FBQUEsU0FFQzdkLFNBQVNpVixLQUFLdlUsVUFGZjtBQUFBLFNBR0M0QixPQUFPd2IsVUFBVTdJLEtBQUtrQyxRQUFMLENBQWNoVSxXQUFkLEVBSGxCO0FBQUEsU0FJQ2diLFdBQVcsQ0FBQ0gsR0FBRCxJQUFRLENBQUNGLE1BSnJCO0FBQUEsU0FLQ3BFLE9BQU8sS0FMUjs7QUFPQSxTQUFLMVosTUFBTCxFQUFjOztBQUViO0FBQ0EsVUFBSzRkLE1BQUwsRUFBYztBQUNiLGNBQVF4RyxHQUFSLEVBQWM7QUFDYnZULGVBQU9vUixJQUFQO0FBQ0EsZUFBVXBSLE9BQU9BLEtBQU11VCxHQUFOLENBQWpCLEVBQWlDO0FBQ2hDLGFBQUswRyxTQUNKamEsS0FBS3NULFFBQUwsQ0FBY2hVLFdBQWQsT0FBZ0NiLElBRDVCLEdBRUp1QixLQUFLaUIsUUFBTCxLQUFrQixDQUZuQixFQUV1Qjs7QUFFdEIsaUJBQU8sS0FBUDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQXFOLGdCQUFRaUYsTUFBTTNTLFNBQVMsTUFBVCxJQUFtQixDQUFDME4sS0FBcEIsSUFBNkIsYUFBM0M7QUFDQTtBQUNELGNBQU8sSUFBUDtBQUNBOztBQUVEQSxjQUFRLENBQUUwTCxVQUFVN2QsT0FBT2dkLFVBQWpCLEdBQThCaGQsT0FBT29lLFNBQXZDLENBQVI7O0FBRUE7QUFDQSxVQUFLUCxXQUFXTSxRQUFoQixFQUEyQjs7QUFFMUI7O0FBRUE7QUFDQXRhLGNBQU83RCxNQUFQO0FBQ0FrZSxvQkFBYXJhLEtBQU1zUSxPQUFOLE1BQXFCdFEsS0FBTXNRLE9BQU4sSUFBa0IsRUFBdkMsQ0FBYjs7QUFFQTtBQUNBO0FBQ0E4SixxQkFBY0MsV0FBWXJhLEtBQUt3YSxRQUFqQixNQUNYSCxXQUFZcmEsS0FBS3dhLFFBQWpCLElBQThCLEVBRG5CLENBQWQ7O0FBR0F4RixlQUFRb0YsWUFBYXhaLElBQWIsS0FBdUIsRUFBL0I7QUFDQXNJLG1CQUFZOEwsTUFBTyxDQUFQLE1BQWV2RSxPQUFmLElBQTBCdUUsTUFBTyxDQUFQLENBQXRDO0FBQ0FhLGNBQU8zTSxhQUFhOEwsTUFBTyxDQUFQLENBQXBCO0FBQ0FoVixjQUFPa0osYUFBYS9NLE9BQU91WCxVQUFQLENBQW1CeEssU0FBbkIsQ0FBcEI7O0FBRUEsY0FBVWxKLE9BQU8sRUFBRWtKLFNBQUYsSUFBZWxKLElBQWYsSUFBdUJBLEtBQU11VCxHQUFOLENBQXZCOztBQUVoQjtBQUNFc0MsY0FBTzNNLFlBQVksQ0FITCxLQUdZb0YsTUFBTWpLLEdBQU4sRUFIN0IsRUFHNkM7O0FBRTVDO0FBQ0EsWUFBS3JFLEtBQUtpQixRQUFMLEtBQWtCLENBQWxCLElBQXVCLEVBQUU0VSxJQUF6QixJQUFpQzdWLFNBQVNvUixJQUEvQyxFQUFzRDtBQUNyRGdKLHFCQUFheFosSUFBYixJQUFzQixDQUFFNlAsT0FBRixFQUFXdkgsU0FBWCxFQUFzQjJNLElBQXRCLENBQXRCO0FBQ0E7QUFDQTtBQUNEO0FBRUQsT0E5QkQsTUE4Qk87O0FBRU47QUFDQSxXQUFLeUUsUUFBTCxFQUFnQjs7QUFFZjtBQUNBdGEsZUFBT29SLElBQVA7QUFDQWlKLHFCQUFhcmEsS0FBTXNRLE9BQU4sTUFBcUJ0USxLQUFNc1EsT0FBTixJQUFrQixFQUF2QyxDQUFiOztBQUVBO0FBQ0E7QUFDQThKLHNCQUFjQyxXQUFZcmEsS0FBS3dhLFFBQWpCLE1BQ1hILFdBQVlyYSxLQUFLd2EsUUFBakIsSUFBOEIsRUFEbkIsQ0FBZDs7QUFHQXhGLGdCQUFRb0YsWUFBYXhaLElBQWIsS0FBdUIsRUFBL0I7QUFDQXNJLG9CQUFZOEwsTUFBTyxDQUFQLE1BQWV2RSxPQUFmLElBQTBCdUUsTUFBTyxDQUFQLENBQXRDO0FBQ0FhLGVBQU8zTSxTQUFQO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBLFdBQUsyTSxTQUFTLEtBQWQsRUFBc0I7O0FBRXJCO0FBQ0EsZUFBVTdWLE9BQU8sRUFBRWtKLFNBQUYsSUFBZWxKLElBQWYsSUFBdUJBLEtBQU11VCxHQUFOLENBQXZCLEtBQ2RzQyxPQUFPM00sWUFBWSxDQURMLEtBQ1lvRixNQUFNakssR0FBTixFQUQ3QixFQUM2Qzs7QUFFNUMsYUFBSyxDQUFFNFYsU0FDTmphLEtBQUtzVCxRQUFMLENBQWNoVSxXQUFkLE9BQWdDYixJQUQxQixHQUVOdUIsS0FBS2lCLFFBQUwsS0FBa0IsQ0FGZCxLQUdKLEVBQUU0VSxJQUhILEVBR1U7O0FBRVQ7QUFDQSxjQUFLeUUsUUFBTCxFQUFnQjtBQUNmRCx3QkFBYXJhLEtBQU1zUSxPQUFOLE1BQ1Z0USxLQUFNc1EsT0FBTixJQUFrQixFQURSLENBQWI7O0FBR0E7QUFDQTtBQUNBOEoseUJBQWNDLFdBQVlyYSxLQUFLd2EsUUFBakIsTUFDWEgsV0FBWXJhLEtBQUt3YSxRQUFqQixJQUE4QixFQURuQixDQUFkOztBQUdBSix1QkFBYXhaLElBQWIsSUFBc0IsQ0FBRTZQLE9BQUYsRUFBV29GLElBQVgsQ0FBdEI7QUFDQTs7QUFFRCxjQUFLN1YsU0FBU29SLElBQWQsRUFBcUI7QUFDcEI7QUFDQTtBQUNEO0FBQ0Q7QUFDRDtBQUNEOztBQUVEO0FBQ0F5RSxjQUFRaUUsSUFBUjtBQUNBLGFBQU9qRSxTQUFTMEQsS0FBVCxJQUFvQjFELE9BQU8wRCxLQUFQLEtBQWlCLENBQWpCLElBQXNCMUQsT0FBTzBELEtBQVAsSUFBZ0IsQ0FBakU7QUFDQTtBQUNELEtBOUhGO0FBK0hBLElBN0xNOztBQStMUCxhQUFVLGdCQUFVelIsTUFBVixFQUFrQnVPLFFBQWxCLEVBQTZCOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUlvRSxJQUFKO0FBQUEsUUFDQ3RGLEtBQUsxRixLQUFLZ0MsT0FBTCxDQUFjM0osTUFBZCxLQUEwQjJILEtBQUtpTCxVQUFMLENBQWlCNVMsT0FBT3hJLFdBQVAsRUFBakIsQ0FBMUIsSUFDSnRELE9BQU80YyxLQUFQLENBQWMseUJBQXlCOVEsTUFBdkMsQ0FGRjs7QUFJQTtBQUNBO0FBQ0E7QUFDQSxRQUFLcU4sR0FBSTdFLE9BQUosQ0FBTCxFQUFxQjtBQUNwQixZQUFPNkUsR0FBSWtCLFFBQUosQ0FBUDtBQUNBOztBQUVEO0FBQ0EsUUFBS2xCLEdBQUdqWSxNQUFILEdBQVksQ0FBakIsRUFBcUI7QUFDcEJ1ZCxZQUFPLENBQUUzUyxNQUFGLEVBQVVBLE1BQVYsRUFBa0IsRUFBbEIsRUFBc0J1TyxRQUF0QixDQUFQO0FBQ0EsWUFBTzVHLEtBQUtpTCxVQUFMLENBQWdCekosY0FBaEIsQ0FBZ0NuSixPQUFPeEksV0FBUCxFQUFoQyxJQUNONFYsYUFBYyxVQUFVbEIsSUFBVixFQUFnQnRTLE9BQWhCLEVBQTBCO0FBQ3ZDLFVBQUlpWixHQUFKO0FBQUEsVUFDQ0MsVUFBVXpGLEdBQUluQixJQUFKLEVBQVVxQyxRQUFWLENBRFg7QUFBQSxVQUVDL1ksSUFBSXNkLFFBQVExZCxNQUZiO0FBR0EsYUFBUUksR0FBUixFQUFjO0FBQ2JxZCxhQUFNNWEsUUFBU2lVLElBQVQsRUFBZTRHLFFBQVN0ZCxDQUFULENBQWYsQ0FBTjtBQUNBMFcsWUFBTTJHLEdBQU4sSUFBYyxFQUFHalosUUFBU2laLEdBQVQsSUFBaUJDLFFBQVN0ZCxDQUFULENBQXBCLENBQWQ7QUFDQTtBQUNELE1BUkQsQ0FETSxHQVVOLFVBQVU4VCxJQUFWLEVBQWlCO0FBQ2hCLGFBQU8rRCxHQUFJL0QsSUFBSixFQUFVLENBQVYsRUFBYXFKLElBQWIsQ0FBUDtBQUNBLE1BWkY7QUFhQTs7QUFFRCxXQUFPdEYsRUFBUDtBQUNBO0FBbk9NLEdBdEdpQjs7QUE0VXpCMUQsV0FBUzs7QUFFUjtBQUNBLFVBQU95RCxhQUFjLFVBQVVoWixRQUFWLEVBQXFCOztBQUV6QztBQUNBO0FBQ0E7QUFDQSxRQUFJa08sUUFBUSxFQUFaO0FBQUEsUUFDQzJKLFVBQVUsRUFEWDtBQUFBLFFBRUM4RyxVQUFVaEwsUUFBUzNULFNBQVMwRCxPQUFULENBQWtCK1IsS0FBbEIsRUFBeUIsSUFBekIsQ0FBVCxDQUZYOztBQUlBLFdBQU9rSixRQUFTdkssT0FBVCxJQUNONEUsYUFBYyxVQUFVbEIsSUFBVixFQUFnQnRTLE9BQWhCLEVBQXlCd1ksUUFBekIsRUFBbUNDLEdBQW5DLEVBQXlDO0FBQ3RELFNBQUkvSSxJQUFKO0FBQUEsU0FDQzBKLFlBQVlELFFBQVM3RyxJQUFULEVBQWUsSUFBZixFQUFxQm1HLEdBQXJCLEVBQTBCLEVBQTFCLENBRGI7QUFBQSxTQUVDN2MsSUFBSTBXLEtBQUs5VyxNQUZWOztBQUlBO0FBQ0EsWUFBUUksR0FBUixFQUFjO0FBQ2IsVUFBTzhULE9BQU8wSixVQUFXeGQsQ0FBWCxDQUFkLEVBQWlDO0FBQ2hDMFcsWUFBTTFXLENBQU4sSUFBWSxFQUFHb0UsUUFBU3BFLENBQVQsSUFBZThULElBQWxCLENBQVo7QUFDQTtBQUNEO0FBQ0QsS0FYRCxDQURNLEdBYU4sVUFBVUEsSUFBVixFQUFnQjhJLFFBQWhCLEVBQTBCQyxHQUExQixFQUFnQztBQUMvQi9QLFdBQU8sQ0FBUCxJQUFhZ0gsSUFBYjtBQUNBeUosYUFBU3pRLEtBQVQsRUFBZ0IsSUFBaEIsRUFBc0IrUCxHQUF0QixFQUEyQnBHLE9BQTNCOztBQUVBO0FBQ0EzSixXQUFPLENBQVAsSUFBYSxJQUFiO0FBQ0EsWUFBTyxDQUFDMkosUUFBUTFQLEdBQVIsRUFBUjtBQUNBLEtBcEJGO0FBcUJBLElBOUJNLENBSEM7O0FBbUNSLFVBQU82USxhQUFjLFVBQVVoWixRQUFWLEVBQXFCO0FBQ3pDLFdBQU8sVUFBVWtWLElBQVYsRUFBaUI7QUFDdkIsWUFBT3BWLE9BQVFFLFFBQVIsRUFBa0JrVixJQUFsQixFQUF5QmxVLE1BQXpCLEdBQWtDLENBQXpDO0FBQ0EsS0FGRDtBQUdBLElBSk0sQ0FuQ0M7O0FBeUNSLGVBQVlnWSxhQUFjLFVBQVV6UixJQUFWLEVBQWlCO0FBQzFDQSxXQUFPQSxLQUFLN0QsT0FBTCxDQUFjNFMsU0FBZCxFQUF5QkMsU0FBekIsQ0FBUDtBQUNBLFdBQU8sVUFBVXJCLElBQVYsRUFBaUI7QUFDdkIsWUFBTyxDQUFFQSxLQUFLNU4sV0FBTCxJQUFvQmtNLFFBQVMwQixJQUFULENBQXRCLEVBQXdDclIsT0FBeEMsQ0FBaUQwRCxJQUFqRCxJQUEwRCxDQUFDLENBQWxFO0FBQ0EsS0FGRDtBQUdBLElBTFcsQ0F6Q0o7O0FBZ0RSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBUXlSLGFBQWMsVUFBVTZGLElBQVYsRUFBaUI7O0FBRXRDO0FBQ0EsUUFBSyxDQUFDL0ksWUFBWWhSLElBQVosQ0FBa0IrWixRQUFRLEVBQTFCLENBQU4sRUFBdUM7QUFDdEMvZSxZQUFPNGMsS0FBUCxDQUFjLHVCQUF1Qm1DLElBQXJDO0FBQ0E7QUFDREEsV0FBT0EsS0FBS25iLE9BQUwsQ0FBYzRTLFNBQWQsRUFBeUJDLFNBQXpCLEVBQXFDblQsV0FBckMsRUFBUDtBQUNBLFdBQU8sVUFBVThSLElBQVYsRUFBaUI7QUFDdkIsU0FBSTRKLFFBQUo7QUFDQSxRQUFHO0FBQ0YsVUFBT0EsV0FBVzdLLGlCQUNqQmlCLEtBQUsySixJQURZLEdBRWpCM0osS0FBS2hULFlBQUwsQ0FBbUIsVUFBbkIsS0FBbUNnVCxLQUFLaFQsWUFBTCxDQUFtQixNQUFuQixDQUZwQyxFQUVvRTs7QUFFbkU0YyxrQkFBV0EsU0FBUzFiLFdBQVQsRUFBWDtBQUNBLGNBQU8wYixhQUFhRCxJQUFiLElBQXFCQyxTQUFTamIsT0FBVCxDQUFrQmdiLE9BQU8sR0FBekIsTUFBbUMsQ0FBL0Q7QUFDQTtBQUNELE1BUkQsUUFRVSxDQUFFM0osT0FBT0EsS0FBS3ZVLFVBQWQsS0FBOEJ1VSxLQUFLblEsUUFBTCxLQUFrQixDQVIxRDtBQVNBLFlBQU8sS0FBUDtBQUNBLEtBWkQ7QUFhQSxJQXBCTyxDQXZEQTs7QUE2RVI7QUFDQSxhQUFVLGdCQUFVbVEsSUFBVixFQUFpQjtBQUMxQixRQUFJNkosT0FBTzFMLE9BQU8yTCxRQUFQLElBQW1CM0wsT0FBTzJMLFFBQVAsQ0FBZ0JELElBQTlDO0FBQ0EsV0FBT0EsUUFBUUEsS0FBSzlXLEtBQUwsQ0FBWSxDQUFaLE1BQW9CaU4sS0FBSzFJLEVBQXhDO0FBQ0EsSUFqRk87O0FBbUZSLFdBQVEsY0FBVTBJLElBQVYsRUFBaUI7QUFDeEIsV0FBT0EsU0FBU2xCLE9BQWhCO0FBQ0EsSUFyRk87O0FBdUZSLFlBQVMsZUFBVWtCLElBQVYsRUFBaUI7QUFDekIsV0FBT0EsU0FBU2hWLFNBQVMrZSxhQUFsQixLQUNKLENBQUMvZSxTQUFTZ2YsUUFBVixJQUFzQmhmLFNBQVNnZixRQUFULEVBRGxCLEtBRU4sQ0FBQyxFQUFHaEssS0FBS3hRLElBQUwsSUFBYXdRLEtBQUtpSyxJQUFsQixJQUEwQixDQUFDakssS0FBS2tLLFFBQW5DLENBRkY7QUFHQSxJQTNGTzs7QUE2RlI7QUFDQSxjQUFXcEYscUJBQXNCLEtBQXRCLENBOUZIO0FBK0ZSLGVBQVlBLHFCQUFzQixJQUF0QixDQS9GSjs7QUFpR1IsY0FBVyxpQkFBVTlFLElBQVYsRUFBaUI7O0FBRTNCO0FBQ0E7QUFDQSxRQUFJa0MsV0FBV2xDLEtBQUtrQyxRQUFMLENBQWNoVSxXQUFkLEVBQWY7QUFDQSxXQUFTZ1UsYUFBYSxPQUFiLElBQXdCLENBQUMsQ0FBQ2xDLEtBQUttSyxPQUFqQyxJQUNKakksYUFBYSxRQUFiLElBQXlCLENBQUMsQ0FBQ2xDLEtBQUtvSyxRQURuQztBQUVBLElBeEdPOztBQTBHUixlQUFZLGtCQUFVcEssSUFBVixFQUFpQjs7QUFFNUI7QUFDQTtBQUNBLFFBQUtBLEtBQUt2VSxVQUFWLEVBQXVCO0FBQ3RCO0FBQ0F1VSxVQUFLdlUsVUFBTCxDQUFnQjRlLGFBQWhCO0FBQ0E7O0FBRUQsV0FBT3JLLEtBQUtvSyxRQUFMLEtBQWtCLElBQXpCO0FBQ0EsSUFwSE87O0FBc0hSO0FBQ0EsWUFBUyxlQUFVcEssSUFBVixFQUFpQjs7QUFFekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFNQSxPQUFPQSxLQUFLK0gsVUFBbEIsRUFBOEIvSCxJQUE5QixFQUFvQ0EsT0FBT0EsS0FBSzJFLFdBQWhELEVBQThEO0FBQzdELFNBQUszRSxLQUFLblEsUUFBTCxHQUFnQixDQUFyQixFQUF5QjtBQUN4QixhQUFPLEtBQVA7QUFDQTtBQUNEO0FBQ0QsV0FBTyxJQUFQO0FBQ0EsSUFuSU87O0FBcUlSLGFBQVUsZ0JBQVVtUSxJQUFWLEVBQWlCO0FBQzFCLFdBQU8sQ0FBQzNCLEtBQUtnQyxPQUFMLENBQWMsT0FBZCxFQUF5QkwsSUFBekIsQ0FBUjtBQUNBLElBdklPOztBQXlJUjtBQUNBLGFBQVUsZ0JBQVVBLElBQVYsRUFBaUI7QUFDMUIsV0FBT2dCLFFBQVFwUixJQUFSLENBQWNvUSxLQUFLa0MsUUFBbkIsQ0FBUDtBQUNBLElBNUlPOztBQThJUixZQUFTLGVBQVVsQyxJQUFWLEVBQWlCO0FBQ3pCLFdBQU9lLFFBQVFuUixJQUFSLENBQWNvUSxLQUFLa0MsUUFBbkIsQ0FBUDtBQUNBLElBaEpPOztBQWtKUixhQUFVLGdCQUFVbEMsSUFBVixFQUFpQjtBQUMxQixRQUFJM1MsT0FBTzJTLEtBQUtrQyxRQUFMLENBQWNoVSxXQUFkLEVBQVg7QUFDQSxXQUFPYixTQUFTLE9BQVQsSUFBb0IyUyxLQUFLeFEsSUFBTCxLQUFjLFFBQWxDLElBQThDbkMsU0FBUyxRQUE5RDtBQUNBLElBckpPOztBQXVKUixXQUFRLGNBQVUyUyxJQUFWLEVBQWlCO0FBQ3hCLFFBQUkvRCxJQUFKO0FBQ0EsV0FBTytELEtBQUtrQyxRQUFMLENBQWNoVSxXQUFkLE9BQWdDLE9BQWhDLElBQ044UixLQUFLeFEsSUFBTCxLQUFjLE1BRFI7O0FBR047QUFDQTtBQUNFLEtBQUV5TSxPQUFPK0QsS0FBS2hULFlBQUwsQ0FBbUIsTUFBbkIsQ0FBVCxLQUEwQyxJQUExQyxJQUNEaVAsS0FBSy9OLFdBQUwsT0FBdUIsTUFObEIsQ0FBUDtBQU9BLElBaEtPOztBQWtLUjtBQUNBLFlBQVM4Vyx1QkFBd0IsWUFBVztBQUMzQyxXQUFPLENBQUUsQ0FBRixDQUFQO0FBQ0EsSUFGUSxDQW5LRDs7QUF1S1IsV0FBUUEsdUJBQXdCLFVBQVVzRixhQUFWLEVBQXlCeGUsTUFBekIsRUFBa0M7QUFDakUsV0FBTyxDQUFFQSxTQUFTLENBQVgsQ0FBUDtBQUNBLElBRk8sQ0F2S0E7O0FBMktSLFNBQU1rWix1QkFBd0IsVUFBVXNGLGFBQVYsRUFBeUJ4ZSxNQUF6QixFQUFpQ21aLFFBQWpDLEVBQTRDO0FBQ3pFLFdBQU8sQ0FBRUEsV0FBVyxDQUFYLEdBQWVBLFdBQVduWixNQUExQixHQUFtQ21aLFFBQXJDLENBQVA7QUFDQSxJQUZLLENBM0tFOztBQStLUixXQUFRRCx1QkFBd0IsVUFBVUUsWUFBVixFQUF3QnBaLE1BQXhCLEVBQWlDO0FBQ2hFLFFBQUlJLElBQUksQ0FBUjtBQUNBLFdBQVFBLElBQUlKLE1BQVosRUFBb0JJLEtBQUssQ0FBekIsRUFBNkI7QUFDNUJnWixrQkFBYXZVLElBQWIsQ0FBbUJ6RSxDQUFuQjtBQUNBO0FBQ0QsV0FBT2daLFlBQVA7QUFDQSxJQU5PLENBL0tBOztBQXVMUixVQUFPRix1QkFBd0IsVUFBVUUsWUFBVixFQUF3QnBaLE1BQXhCLEVBQWlDO0FBQy9ELFFBQUlJLElBQUksQ0FBUjtBQUNBLFdBQVFBLElBQUlKLE1BQVosRUFBb0JJLEtBQUssQ0FBekIsRUFBNkI7QUFDNUJnWixrQkFBYXZVLElBQWIsQ0FBbUJ6RSxDQUFuQjtBQUNBO0FBQ0QsV0FBT2daLFlBQVA7QUFDQSxJQU5NLENBdkxDOztBQStMUixTQUFNRix1QkFBd0IsVUFBVUUsWUFBVixFQUF3QnBaLE1BQXhCLEVBQWdDbVosUUFBaEMsRUFBMkM7QUFDeEUsUUFBSS9ZLElBQUkrWSxXQUFXLENBQVgsR0FDUEEsV0FBV25aLE1BREosR0FFUG1aLFdBQVduWixNQUFYLEdBQ0NBLE1BREQsR0FFQ21aLFFBSkY7QUFLQSxXQUFRLEVBQUUvWSxDQUFGLElBQU8sQ0FBZixHQUFvQjtBQUNuQmdaLGtCQUFhdlUsSUFBYixDQUFtQnpFLENBQW5CO0FBQ0E7QUFDRCxXQUFPZ1osWUFBUDtBQUNBLElBVkssQ0EvTEU7O0FBMk1SLFNBQU1GLHVCQUF3QixVQUFVRSxZQUFWLEVBQXdCcFosTUFBeEIsRUFBZ0NtWixRQUFoQyxFQUEyQztBQUN4RSxRQUFJL1ksSUFBSStZLFdBQVcsQ0FBWCxHQUFlQSxXQUFXblosTUFBMUIsR0FBbUNtWixRQUEzQztBQUNBLFdBQVEsRUFBRS9ZLENBQUYsR0FBTUosTUFBZCxHQUF3QjtBQUN2Qm9aLGtCQUFhdlUsSUFBYixDQUFtQnpFLENBQW5CO0FBQ0E7QUFDRCxXQUFPZ1osWUFBUDtBQUNBLElBTks7QUEzTUU7QUE1VWdCLEVBQTFCOztBQWlpQkE3RyxNQUFLZ0MsT0FBTCxDQUFjLEtBQWQsSUFBd0JoQyxLQUFLZ0MsT0FBTCxDQUFjLElBQWQsQ0FBeEI7O0FBRUE7QUFDQSxNQUFNblUsQ0FBTixJQUFXLEVBQUVxZSxPQUFPLElBQVQsRUFBZUMsVUFBVSxJQUF6QixFQUErQkMsTUFBTSxJQUFyQyxFQUEyQ0MsVUFBVSxJQUFyRCxFQUEyREMsT0FBTyxJQUFsRSxFQUFYLEVBQXNGO0FBQ3JGdE0sT0FBS2dDLE9BQUwsQ0FBY25VLENBQWQsSUFBb0IwWSxrQkFBbUIxWSxDQUFuQixDQUFwQjtBQUNBO0FBQ0QsTUFBTUEsQ0FBTixJQUFXLEVBQUUwZSxRQUFRLElBQVYsRUFBZ0JDLE9BQU8sSUFBdkIsRUFBWCxFQUEyQztBQUMxQ3hNLE9BQUtnQyxPQUFMLENBQWNuVSxDQUFkLElBQW9CMlksbUJBQW9CM1ksQ0FBcEIsQ0FBcEI7QUFDQTs7QUFFRDtBQUNBLFVBQVNvZCxVQUFULEdBQXNCLENBQUU7QUFDeEJBLFlBQVd3QixTQUFYLEdBQXVCek0sS0FBSzBNLE9BQUwsR0FBZTFNLEtBQUtnQyxPQUEzQztBQUNBaEMsTUFBS2lMLFVBQUwsR0FBa0IsSUFBSUEsVUFBSixFQUFsQjs7QUFFQTlLLFlBQVc1VCxPQUFPNFQsUUFBUCxHQUFrQixVQUFVMVQsUUFBVixFQUFvQmtnQixTQUFwQixFQUFnQztBQUM1RCxNQUFJeEIsT0FBSjtBQUFBLE1BQWEvYSxLQUFiO0FBQUEsTUFBb0J3YyxNQUFwQjtBQUFBLE1BQTRCemIsSUFBNUI7QUFBQSxNQUNDMGIsS0FERDtBQUFBLE1BQ1FuSSxNQURSO0FBQUEsTUFDZ0JvSSxVQURoQjtBQUFBLE1BRUNDLFNBQVM1TCxXQUFZMVUsV0FBVyxHQUF2QixDQUZWOztBQUlBLE1BQUtzZ0IsTUFBTCxFQUFjO0FBQ2IsVUFBT0osWUFBWSxDQUFaLEdBQWdCSSxPQUFPclksS0FBUCxDQUFjLENBQWQsQ0FBdkI7QUFDQTs7QUFFRG1ZLFVBQVFwZ0IsUUFBUjtBQUNBaVksV0FBUyxFQUFUO0FBQ0FvSSxlQUFhOU0sS0FBSytKLFNBQWxCOztBQUVBLFNBQVE4QyxLQUFSLEVBQWdCOztBQUVmO0FBQ0EsT0FBSyxDQUFDMUIsT0FBRCxLQUFjL2EsUUFBUStSLE9BQU8yQyxJQUFQLENBQWErSCxLQUFiLENBQXRCLENBQUwsRUFBb0Q7QUFDbkQsUUFBS3pjLEtBQUwsRUFBYTs7QUFFWjtBQUNBeWMsYUFBUUEsTUFBTW5ZLEtBQU4sQ0FBYXRFLE1BQU8sQ0FBUCxFQUFXM0MsTUFBeEIsS0FBb0NvZixLQUE1QztBQUNBO0FBQ0RuSSxXQUFPcFMsSUFBUCxDQUFlc2EsU0FBUyxFQUF4QjtBQUNBOztBQUVEekIsYUFBVSxLQUFWOztBQUVBO0FBQ0EsT0FBTy9hLFFBQVFnUyxhQUFhMEMsSUFBYixDQUFtQitILEtBQW5CLENBQWYsRUFBOEM7QUFDN0MxQixjQUFVL2EsTUFBTXpDLEtBQU4sRUFBVjtBQUNBaWYsV0FBT3RhLElBQVAsQ0FBYTtBQUNaOUMsWUFBTzJiLE9BREs7O0FBR1o7QUFDQWhhLFdBQU1mLE1BQU8sQ0FBUCxFQUFXRCxPQUFYLENBQW9CK1IsS0FBcEIsRUFBMkIsR0FBM0I7QUFKTSxLQUFiO0FBTUEySyxZQUFRQSxNQUFNblksS0FBTixDQUFheVcsUUFBUTFkLE1BQXJCLENBQVI7QUFDQTs7QUFFRDtBQUNBLFFBQU0wRCxJQUFOLElBQWM2TyxLQUFLbFIsTUFBbkIsRUFBNEI7QUFDM0IsUUFBSyxDQUFFc0IsUUFBUW9TLFVBQVdyUixJQUFYLEVBQWtCMlQsSUFBbEIsQ0FBd0IrSCxLQUF4QixDQUFWLE1BQWlELENBQUNDLFdBQVkzYixJQUFaLENBQUQsS0FDbkRmLFFBQVEwYyxXQUFZM2IsSUFBWixFQUFvQmYsS0FBcEIsQ0FEMkMsQ0FBakQsQ0FBTCxFQUM2QztBQUM1QythLGVBQVUvYSxNQUFNekMsS0FBTixFQUFWO0FBQ0FpZixZQUFPdGEsSUFBUCxDQUFhO0FBQ1o5QyxhQUFPMmIsT0FESztBQUVaaGEsWUFBTUEsSUFGTTtBQUdaYyxlQUFTN0I7QUFIRyxNQUFiO0FBS0F5YyxhQUFRQSxNQUFNblksS0FBTixDQUFheVcsUUFBUTFkLE1BQXJCLENBQVI7QUFDQTtBQUNEOztBQUVELE9BQUssQ0FBQzBkLE9BQU4sRUFBZ0I7QUFDZjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsU0FBT3dCLFlBQ05FLE1BQU1wZixNQURBLEdBRU5vZixRQUNDdGdCLE9BQU80YyxLQUFQLENBQWMxYyxRQUFkLENBREQ7O0FBR0M7QUFDQTBVLGFBQVkxVSxRQUFaLEVBQXNCaVksTUFBdEIsRUFBK0JoUSxLQUEvQixDQUFzQyxDQUF0QyxDQU5GO0FBT0EsRUFwRUQ7O0FBc0VBLFVBQVMwUSxVQUFULENBQXFCd0gsTUFBckIsRUFBOEI7QUFDN0IsTUFBSS9lLElBQUksQ0FBUjtBQUFBLE1BQ0MrVCxNQUFNZ0wsT0FBT25mLE1BRGQ7QUFBQSxNQUVDaEIsV0FBVyxFQUZaO0FBR0EsU0FBUW9CLElBQUkrVCxHQUFaLEVBQWlCL1QsR0FBakIsRUFBdUI7QUFDdEJwQixlQUFZbWdCLE9BQVEvZSxDQUFSLEVBQVkyQixLQUF4QjtBQUNBO0FBQ0QsU0FBTy9DLFFBQVA7QUFDQTs7QUFFRCxVQUFTa1gsYUFBVCxDQUF3QnlILE9BQXhCLEVBQWlDNEIsVUFBakMsRUFBNkNDLElBQTdDLEVBQW9EO0FBQ25ELE1BQUluSixNQUFNa0osV0FBV2xKLEdBQXJCO0FBQUEsTUFDQ3RULE9BQU93YyxXQUFXeGYsSUFEbkI7QUFBQSxNQUVDNkIsTUFBTW1CLFFBQVFzVCxHQUZmO0FBQUEsTUFHQ29KLG1CQUFtQkQsUUFBUTVkLFFBQVEsWUFIcEM7QUFBQSxNQUlDOGQsV0FBV2hWLE1BSlo7O0FBTUEsU0FBTzZVLFdBQVdsRCxLQUFYOztBQUVOO0FBQ0EsWUFBVW5JLElBQVYsRUFBZ0I5SyxPQUFoQixFQUF5QjZULEdBQXpCLEVBQStCO0FBQzlCLFVBQVUvSSxPQUFPQSxLQUFNbUMsR0FBTixDQUFqQixFQUFpQztBQUNoQyxRQUFLbkMsS0FBS25RLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIwYixnQkFBNUIsRUFBK0M7QUFDOUMsWUFBTzlCLFFBQVN6SixJQUFULEVBQWU5SyxPQUFmLEVBQXdCNlQsR0FBeEIsQ0FBUDtBQUNBO0FBQ0Q7QUFDRCxVQUFPLEtBQVA7QUFDQSxHQVZLOztBQVlOO0FBQ0EsWUFBVS9JLElBQVYsRUFBZ0I5SyxPQUFoQixFQUF5QjZULEdBQXpCLEVBQStCO0FBQzlCLE9BQUkwQyxRQUFKO0FBQUEsT0FBY3pDLFdBQWQ7QUFBQSxPQUEyQkMsVUFBM0I7QUFBQSxPQUNDeUMsV0FBVyxDQUFFck0sT0FBRixFQUFXbU0sUUFBWCxDQURaOztBQUdBO0FBQ0EsT0FBS3pDLEdBQUwsRUFBVztBQUNWLFdBQVUvSSxPQUFPQSxLQUFNbUMsR0FBTixDQUFqQixFQUFpQztBQUNoQyxTQUFLbkMsS0FBS25RLFFBQUwsS0FBa0IsQ0FBbEIsSUFBdUIwYixnQkFBNUIsRUFBK0M7QUFDOUMsVUFBSzlCLFFBQVN6SixJQUFULEVBQWU5SyxPQUFmLEVBQXdCNlQsR0FBeEIsQ0FBTCxFQUFxQztBQUNwQyxjQUFPLElBQVA7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxJQVJELE1BUU87QUFDTixXQUFVL0ksT0FBT0EsS0FBTW1DLEdBQU4sQ0FBakIsRUFBaUM7QUFDaEMsU0FBS25DLEtBQUtuUSxRQUFMLEtBQWtCLENBQWxCLElBQXVCMGIsZ0JBQTVCLEVBQStDO0FBQzlDdEMsbUJBQWFqSixLQUFNZCxPQUFOLE1BQXFCYyxLQUFNZCxPQUFOLElBQWtCLEVBQXZDLENBQWI7O0FBRUE7QUFDQTtBQUNBOEosb0JBQWNDLFdBQVlqSixLQUFLb0osUUFBakIsTUFDWEgsV0FBWWpKLEtBQUtvSixRQUFqQixJQUE4QixFQURuQixDQUFkOztBQUdBLFVBQUt2YSxRQUFRQSxTQUFTbVIsS0FBS2tDLFFBQUwsQ0FBY2hVLFdBQWQsRUFBdEIsRUFBb0Q7QUFDbkQ4UixjQUFPQSxLQUFNbUMsR0FBTixLQUFlbkMsSUFBdEI7QUFDQSxPQUZELE1BRU8sSUFBSyxDQUFFeUwsV0FBV3pDLFlBQWF0YixHQUFiLENBQWIsS0FDWCtkLFNBQVUsQ0FBVixNQUFrQnBNLE9BRFAsSUFDa0JvTSxTQUFVLENBQVYsTUFBa0JELFFBRHpDLEVBQ29EOztBQUUxRDtBQUNBLGNBQVNFLFNBQVUsQ0FBVixJQUFnQkQsU0FBVSxDQUFWLENBQXpCO0FBQ0EsT0FMTSxNQUtBOztBQUVOO0FBQ0F6QyxtQkFBYXRiLEdBQWIsSUFBcUJnZSxRQUFyQjs7QUFFQTtBQUNBLFdBQU9BLFNBQVUsQ0FBVixJQUFnQmpDLFFBQVN6SixJQUFULEVBQWU5SyxPQUFmLEVBQXdCNlQsR0FBeEIsQ0FBdkIsRUFBeUQ7QUFDeEQsZUFBTyxJQUFQO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7QUFDRDtBQUNELFVBQU8sS0FBUDtBQUNBLEdBekRGO0FBMERBOztBQUVELFVBQVM0QyxjQUFULENBQXlCQyxRQUF6QixFQUFvQztBQUNuQyxTQUFPQSxTQUFTOWYsTUFBVCxHQUFrQixDQUFsQixHQUNOLFVBQVVrVSxJQUFWLEVBQWdCOUssT0FBaEIsRUFBeUI2VCxHQUF6QixFQUErQjtBQUM5QixPQUFJN2MsSUFBSTBmLFNBQVM5ZixNQUFqQjtBQUNBLFVBQVFJLEdBQVIsRUFBYztBQUNiLFFBQUssQ0FBQzBmLFNBQVUxZixDQUFWLEVBQWU4VCxJQUFmLEVBQXFCOUssT0FBckIsRUFBOEI2VCxHQUE5QixDQUFOLEVBQTRDO0FBQzNDLFlBQU8sS0FBUDtBQUNBO0FBQ0Q7QUFDRCxVQUFPLElBQVA7QUFDQSxHQVRLLEdBVU42QyxTQUFVLENBQVYsQ0FWRDtBQVdBOztBQUVELFVBQVNDLGdCQUFULENBQTJCL2dCLFFBQTNCLEVBQXFDZ2hCLFFBQXJDLEVBQStDbkosT0FBL0MsRUFBeUQ7QUFDeEQsTUFBSXpXLElBQUksQ0FBUjtBQUFBLE1BQ0MrVCxNQUFNNkwsU0FBU2hnQixNQURoQjtBQUVBLFNBQVFJLElBQUkrVCxHQUFaLEVBQWlCL1QsR0FBakIsRUFBdUI7QUFDdEJ0QixVQUFRRSxRQUFSLEVBQWtCZ2hCLFNBQVU1ZixDQUFWLENBQWxCLEVBQWlDeVcsT0FBakM7QUFDQTtBQUNELFNBQU9BLE9BQVA7QUFDQTs7QUFFRCxVQUFTb0osUUFBVCxDQUFtQnJDLFNBQW5CLEVBQThCcmEsR0FBOUIsRUFBbUNsQyxNQUFuQyxFQUEyQytILE9BQTNDLEVBQW9ENlQsR0FBcEQsRUFBMEQ7QUFDekQsTUFBSS9JLElBQUo7QUFBQSxNQUNDZ00sZUFBZSxFQURoQjtBQUFBLE1BRUM5ZixJQUFJLENBRkw7QUFBQSxNQUdDK1QsTUFBTXlKLFVBQVU1ZCxNQUhqQjtBQUFBLE1BSUNtZ0IsU0FBUzVjLE9BQU8sSUFKakI7O0FBTUEsU0FBUW5ELElBQUkrVCxHQUFaLEVBQWlCL1QsR0FBakIsRUFBdUI7QUFDdEIsT0FBTzhULE9BQU8wSixVQUFXeGQsQ0FBWCxDQUFkLEVBQWlDO0FBQ2hDLFFBQUssQ0FBQ2lCLE1BQUQsSUFBV0EsT0FBUTZTLElBQVIsRUFBYzlLLE9BQWQsRUFBdUI2VCxHQUF2QixDQUFoQixFQUErQztBQUM5Q2lELGtCQUFhcmIsSUFBYixDQUFtQnFQLElBQW5CO0FBQ0EsU0FBS2lNLE1BQUwsRUFBYztBQUNiNWMsVUFBSXNCLElBQUosQ0FBVXpFLENBQVY7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRCxTQUFPOGYsWUFBUDtBQUNBOztBQUVELFVBQVNFLFVBQVQsQ0FBcUI5RCxTQUFyQixFQUFnQ3RkLFFBQWhDLEVBQTBDMmUsT0FBMUMsRUFBbUQwQyxVQUFuRCxFQUErREMsVUFBL0QsRUFBMkVDLFlBQTNFLEVBQTBGO0FBQ3pGLE1BQUtGLGNBQWMsQ0FBQ0EsV0FBWWpOLE9BQVosQ0FBcEIsRUFBNEM7QUFDM0NpTixnQkFBYUQsV0FBWUMsVUFBWixDQUFiO0FBQ0E7QUFDRCxNQUFLQyxjQUFjLENBQUNBLFdBQVlsTixPQUFaLENBQXBCLEVBQTRDO0FBQzNDa04sZ0JBQWFGLFdBQVlFLFVBQVosRUFBd0JDLFlBQXhCLENBQWI7QUFDQTtBQUNELFNBQU92SSxhQUFjLFVBQVVsQixJQUFWLEVBQWdCRCxPQUFoQixFQUF5QnpOLE9BQXpCLEVBQWtDNlQsR0FBbEMsRUFBd0M7QUFDNUQsT0FBSXVELElBQUo7QUFBQSxPQUFVcGdCLENBQVY7QUFBQSxPQUFhOFQsSUFBYjtBQUFBLE9BQ0N1TSxTQUFTLEVBRFY7QUFBQSxPQUVDQyxVQUFVLEVBRlg7QUFBQSxPQUdDQyxjQUFjOUosUUFBUTdXLE1BSHZCOzs7QUFLQztBQUNBc2EsV0FBUXhELFFBQVFpSixpQkFDZi9nQixZQUFZLEdBREcsRUFFZm9LLFFBQVFyRixRQUFSLEdBQW1CLENBQUVxRixPQUFGLENBQW5CLEdBQWlDQSxPQUZsQixFQUdmLEVBSGUsQ0FOakI7OztBQVlDO0FBQ0F3WCxlQUFZdEUsY0FBZXhGLFFBQVEsQ0FBQzlYLFFBQXhCLElBQ1hpaEIsU0FBVTNGLEtBQVYsRUFBaUJtRyxNQUFqQixFQUF5Qm5FLFNBQXpCLEVBQW9DbFQsT0FBcEMsRUFBNkM2VCxHQUE3QyxDQURXLEdBRVgzQyxLQWZGO0FBQUEsT0FpQkN1RyxhQUFhbEQ7O0FBRVo7QUFDQTJDLGtCQUFnQnhKLE9BQU93RixTQUFQLEdBQW1CcUUsZUFBZU4sVUFBbEQ7O0FBRUM7QUFDQSxLQUhEOztBQUtDO0FBQ0F4SixVQVRXLEdBVVorSixTQTNCRjs7QUE2QkE7QUFDQSxPQUFLakQsT0FBTCxFQUFlO0FBQ2RBLFlBQVNpRCxTQUFULEVBQW9CQyxVQUFwQixFQUFnQ3pYLE9BQWhDLEVBQXlDNlQsR0FBekM7QUFDQTs7QUFFRDtBQUNBLE9BQUtvRCxVQUFMLEVBQWtCO0FBQ2pCRyxXQUFPUCxTQUFVWSxVQUFWLEVBQXNCSCxPQUF0QixDQUFQO0FBQ0FMLGVBQVlHLElBQVosRUFBa0IsRUFBbEIsRUFBc0JwWCxPQUF0QixFQUErQjZULEdBQS9COztBQUVBO0FBQ0E3YyxRQUFJb2dCLEtBQUt4Z0IsTUFBVDtBQUNBLFdBQVFJLEdBQVIsRUFBYztBQUNiLFNBQU84VCxPQUFPc00sS0FBTXBnQixDQUFOLENBQWQsRUFBNEI7QUFDM0J5Z0IsaUJBQVlILFFBQVN0Z0IsQ0FBVCxDQUFaLElBQTZCLEVBQUd3Z0IsVUFBV0YsUUFBU3RnQixDQUFULENBQVgsSUFBNEI4VCxJQUEvQixDQUE3QjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRCxPQUFLNEMsSUFBTCxFQUFZO0FBQ1gsUUFBS3dKLGNBQWNoRSxTQUFuQixFQUErQjtBQUM5QixTQUFLZ0UsVUFBTCxFQUFrQjs7QUFFakI7QUFDQUUsYUFBTyxFQUFQO0FBQ0FwZ0IsVUFBSXlnQixXQUFXN2dCLE1BQWY7QUFDQSxhQUFRSSxHQUFSLEVBQWM7QUFDYixXQUFPOFQsT0FBTzJNLFdBQVl6Z0IsQ0FBWixDQUFkLEVBQWtDOztBQUVqQztBQUNBb2dCLGFBQUszYixJQUFMLENBQWErYixVQUFXeGdCLENBQVgsSUFBaUI4VCxJQUE5QjtBQUNBO0FBQ0Q7QUFDRG9NLGlCQUFZLElBQVosRUFBb0JPLGFBQWEsRUFBakMsRUFBdUNMLElBQXZDLEVBQTZDdkQsR0FBN0M7QUFDQTs7QUFFRDtBQUNBN2MsU0FBSXlnQixXQUFXN2dCLE1BQWY7QUFDQSxZQUFRSSxHQUFSLEVBQWM7QUFDYixVQUFLLENBQUU4VCxPQUFPMk0sV0FBWXpnQixDQUFaLENBQVQsS0FDSixDQUFFb2dCLE9BQU9GLGFBQWF6ZCxRQUFTaVUsSUFBVCxFQUFlNUMsSUFBZixDQUFiLEdBQXFDdU0sT0FBUXJnQixDQUFSLENBQTlDLElBQThELENBQUMsQ0FEaEUsRUFDb0U7O0FBRW5FMFcsWUFBTTBKLElBQU4sSUFBZSxFQUFHM0osUUFBUzJKLElBQVQsSUFBa0J0TSxJQUFyQixDQUFmO0FBQ0E7QUFDRDtBQUNEOztBQUVGO0FBQ0MsSUE3QkQsTUE2Qk87QUFDTjJNLGlCQUFhWixTQUNaWSxlQUFlaEssT0FBZixHQUNDZ0ssV0FBVzdFLE1BQVgsQ0FBbUIyRSxXQUFuQixFQUFnQ0UsV0FBVzdnQixNQUEzQyxDQURELEdBRUM2Z0IsVUFIVyxDQUFiO0FBS0EsUUFBS1AsVUFBTCxFQUFrQjtBQUNqQkEsZ0JBQVksSUFBWixFQUFrQnpKLE9BQWxCLEVBQTJCZ0ssVUFBM0IsRUFBdUM1RCxHQUF2QztBQUNBLEtBRkQsTUFFTztBQUNOcFksVUFBS3lSLEtBQUwsQ0FBWU8sT0FBWixFQUFxQmdLLFVBQXJCO0FBQ0E7QUFDRDtBQUNELEdBMUZNLENBQVA7QUEyRkE7O0FBRUQsVUFBU0MsaUJBQVQsQ0FBNEIzQixNQUE1QixFQUFxQztBQUNwQyxNQUFJNEIsWUFBSjtBQUFBLE1BQWtCcEQsT0FBbEI7QUFBQSxNQUEyQi9HLENBQTNCO0FBQUEsTUFDQ3pDLE1BQU1nTCxPQUFPbmYsTUFEZDtBQUFBLE1BRUNnaEIsa0JBQWtCek8sS0FBSzZKLFFBQUwsQ0FBZStDLE9BQVEsQ0FBUixFQUFZemIsSUFBM0IsQ0FGbkI7QUFBQSxNQUdDdWQsbUJBQW1CRCxtQkFBbUJ6TyxLQUFLNkosUUFBTCxDQUFlLEdBQWYsQ0FIdkM7QUFBQSxNQUlDaGMsSUFBSTRnQixrQkFBa0IsQ0FBbEIsR0FBc0IsQ0FKM0I7OztBQU1DO0FBQ0FFLGlCQUFlaEwsY0FBZSxVQUFVaEMsSUFBVixFQUFpQjtBQUM5QyxVQUFPQSxTQUFTNk0sWUFBaEI7QUFDQSxHQUZjLEVBRVpFLGdCQUZZLEVBRU0sSUFGTixDQVBoQjtBQUFBLE1BVUNFLGtCQUFrQmpMLGNBQWUsVUFBVWhDLElBQVYsRUFBaUI7QUFDakQsVUFBT3JSLFFBQVNrZSxZQUFULEVBQXVCN00sSUFBdkIsSUFBZ0MsQ0FBQyxDQUF4QztBQUNBLEdBRmlCLEVBRWYrTSxnQkFGZSxFQUVHLElBRkgsQ0FWbkI7QUFBQSxNQWFDbkIsV0FBVyxDQUFFLFVBQVU1TCxJQUFWLEVBQWdCOUssT0FBaEIsRUFBeUI2VCxHQUF6QixFQUErQjtBQUMzQyxPQUFJMUIsTUFBUSxDQUFDeUYsZUFBRCxLQUFzQi9ELE9BQU83VCxZQUFZd0osZ0JBQXpDLENBQUYsS0FDVCxDQUFFbU8sZUFBZTNYLE9BQWpCLEVBQTJCckYsUUFBM0IsR0FDQ21kLGFBQWNoTixJQUFkLEVBQW9COUssT0FBcEIsRUFBNkI2VCxHQUE3QixDQURELEdBRUNrRSxnQkFBaUJqTixJQUFqQixFQUF1QjlLLE9BQXZCLEVBQWdDNlQsR0FBaEMsQ0FIUSxDQUFWOztBQUtBO0FBQ0E4RCxrQkFBZSxJQUFmO0FBQ0EsVUFBT3hGLEdBQVA7QUFDQSxHQVRVLENBYlo7O0FBd0JBLFNBQVFuYixJQUFJK1QsR0FBWixFQUFpQi9ULEdBQWpCLEVBQXVCO0FBQ3RCLE9BQU91ZCxVQUFVcEwsS0FBSzZKLFFBQUwsQ0FBZStDLE9BQVEvZSxDQUFSLEVBQVlzRCxJQUEzQixDQUFqQixFQUF1RDtBQUN0RG9jLGVBQVcsQ0FBRTVKLGNBQWUySixlQUFnQkMsUUFBaEIsQ0FBZixFQUEyQ25DLE9BQTNDLENBQUYsQ0FBWDtBQUNBLElBRkQsTUFFTztBQUNOQSxjQUFVcEwsS0FBS2xSLE1BQUwsQ0FBYThkLE9BQVEvZSxDQUFSLEVBQVlzRCxJQUF6QixFQUFnQzRTLEtBQWhDLENBQXVDLElBQXZDLEVBQTZDNkksT0FBUS9lLENBQVIsRUFBWW9FLE9BQXpELENBQVY7O0FBRUE7QUFDQSxRQUFLbVosUUFBU3ZLLE9BQVQsQ0FBTCxFQUEwQjs7QUFFekI7QUFDQXdELFNBQUksRUFBRXhXLENBQU47QUFDQSxZQUFRd1csSUFBSXpDLEdBQVosRUFBaUJ5QyxHQUFqQixFQUF1QjtBQUN0QixVQUFLckUsS0FBSzZKLFFBQUwsQ0FBZStDLE9BQVF2SSxDQUFSLEVBQVlsVCxJQUEzQixDQUFMLEVBQXlDO0FBQ3hDO0FBQ0E7QUFDRDtBQUNELFlBQU8wYyxXQUNOaGdCLElBQUksQ0FBSixJQUFTeWYsZUFBZ0JDLFFBQWhCLENBREgsRUFFTjFmLElBQUksQ0FBSixJQUFTdVg7O0FBRVQ7QUFDQXdILFlBQ0VsWSxLQURGLENBQ1MsQ0FEVCxFQUNZN0csSUFBSSxDQURoQixFQUVFMEUsTUFGRixDQUVVLEVBQUUvQyxPQUFPb2QsT0FBUS9lLElBQUksQ0FBWixFQUFnQnNELElBQWhCLEtBQXlCLEdBQXpCLEdBQStCLEdBQS9CLEdBQXFDLEVBQTlDLEVBRlYsQ0FIUyxFQU1QaEIsT0FOTyxDQU1FK1IsS0FORixFQU1TLElBTlQsQ0FGSCxFQVNOa0osT0FUTSxFQVVOdmQsSUFBSXdXLENBQUosSUFBU2tLLGtCQUFtQjNCLE9BQU9sWSxLQUFQLENBQWM3RyxDQUFkLEVBQWlCd1csQ0FBakIsQ0FBbkIsQ0FWSCxFQVdOQSxJQUFJekMsR0FBSixJQUFXMk0sa0JBQXFCM0IsU0FBU0EsT0FBT2xZLEtBQVAsQ0FBYzJQLENBQWQsQ0FBOUIsQ0FYTCxFQVlOQSxJQUFJekMsR0FBSixJQUFXd0QsV0FBWXdILE1BQVosQ0FaTCxDQUFQO0FBY0E7QUFDRFcsYUFBU2piLElBQVQsQ0FBZThZLE9BQWY7QUFDQTtBQUNEOztBQUVELFNBQU9rQyxlQUFnQkMsUUFBaEIsQ0FBUDtBQUNBOztBQUVELFVBQVNzQix3QkFBVCxDQUFtQ0MsZUFBbkMsRUFBb0RDLFdBQXBELEVBQWtFO0FBQ2pFLE1BQUlDLFFBQVFELFlBQVl0aEIsTUFBWixHQUFxQixDQUFqQztBQUFBLE1BQ0N3aEIsWUFBWUgsZ0JBQWdCcmhCLE1BQWhCLEdBQXlCLENBRHRDO0FBQUEsTUFFQ3loQixlQUFlLFNBQWZBLFlBQWUsQ0FBVTNLLElBQVYsRUFBZ0IxTixPQUFoQixFQUF5QjZULEdBQXpCLEVBQThCcEcsT0FBOUIsRUFBdUM2SyxTQUF2QyxFQUFtRDtBQUNqRSxPQUFJeE4sSUFBSjtBQUFBLE9BQVUwQyxDQUFWO0FBQUEsT0FBYStHLE9BQWI7QUFBQSxPQUNDZ0UsZUFBZSxDQURoQjtBQUFBLE9BRUN2aEIsSUFBSSxHQUZMO0FBQUEsT0FHQ3dkLFlBQVk5RyxRQUFRLEVBSHJCO0FBQUEsT0FJQzhLLGFBQWEsRUFKZDtBQUFBLE9BS0NDLGdCQUFnQmpQLGdCQUxqQjs7O0FBT0M7QUFDQTBILFdBQVF4RCxRQUFRMEssYUFBYWpQLEtBQUs2SCxJQUFMLENBQVcsS0FBWCxFQUFvQixHQUFwQixFQUF5QnNILFNBQXpCLENBUjlCOzs7QUFVQztBQUNBSSxtQkFBa0J2TyxXQUFXc08saUJBQWlCLElBQWpCLEdBQXdCLENBQXhCLEdBQTRCRSxLQUFLQyxNQUFMLE1BQWlCLEdBWDNFO0FBQUEsT0FZQzdOLE1BQU1tRyxNQUFNdGEsTUFaYjs7QUFjQSxPQUFLMGhCLFNBQUwsRUFBaUI7O0FBRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E5Tyx1QkFBbUJ4SixXQUFXbEssUUFBWCxJQUF1QmtLLE9BQXZCLElBQWtDc1ksU0FBckQ7QUFDQTs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxVQUFRdGhCLE1BQU0rVCxHQUFOLElBQWEsQ0FBRUQsT0FBT29HLE1BQU9sYSxDQUFQLENBQVQsS0FBeUIsSUFBOUMsRUFBb0RBLEdBQXBELEVBQTBEO0FBQ3pELFFBQUtvaEIsYUFBYXROLElBQWxCLEVBQXlCO0FBQ3hCMEMsU0FBSSxDQUFKOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBSyxDQUFDeE4sT0FBRCxJQUFZOEssS0FBS2tELGFBQUwsSUFBc0JsWSxRQUF2QyxFQUFrRDtBQUNqRDZULGtCQUFhbUIsSUFBYjtBQUNBK0ksWUFBTSxDQUFDaEssY0FBUDtBQUNBO0FBQ0QsWUFBVTBLLFVBQVUwRCxnQkFBaUJ6SyxHQUFqQixDQUFwQixFQUErQztBQUM5QyxVQUFLK0csUUFBU3pKLElBQVQsRUFBZTlLLFdBQVdsSyxRQUExQixFQUFvQytkLEdBQXBDLENBQUwsRUFBaUQ7QUFDaERwRyxlQUFRaFMsSUFBUixDQUFjcVAsSUFBZDtBQUNBO0FBQ0E7QUFDRDtBQUNELFNBQUt3TixTQUFMLEVBQWlCO0FBQ2hCbk8sZ0JBQVV1TyxhQUFWO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLFFBQUtQLEtBQUwsRUFBYTs7QUFFWjtBQUNBLFNBQU9yTixPQUFPLENBQUN5SixPQUFELElBQVl6SixJQUExQixFQUFtQztBQUNsQ3lOO0FBQ0E7O0FBRUQ7QUFDQSxTQUFLN0ssSUFBTCxFQUFZO0FBQ1g4RyxnQkFBVS9ZLElBQVYsQ0FBZ0JxUCxJQUFoQjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBO0FBQ0F5TixtQkFBZ0J2aEIsQ0FBaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFLbWhCLFNBQVNuaEIsTUFBTXVoQixZQUFwQixFQUFtQztBQUNsQy9LLFFBQUksQ0FBSjtBQUNBLFdBQVUrRyxVQUFVMkQsWUFBYTFLLEdBQWIsQ0FBcEIsRUFBMkM7QUFDMUMrRyxhQUFTQyxTQUFULEVBQW9CZ0UsVUFBcEIsRUFBZ0N4WSxPQUFoQyxFQUF5QzZULEdBQXpDO0FBQ0E7O0FBRUQsUUFBS25HLElBQUwsRUFBWTs7QUFFWDtBQUNBLFNBQUs2SyxlQUFlLENBQXBCLEVBQXdCO0FBQ3ZCLGFBQVF2aEIsR0FBUixFQUFjO0FBQ2IsV0FBSyxFQUFHd2QsVUFBV3hkLENBQVgsS0FBa0J3aEIsV0FBWXhoQixDQUFaLENBQXJCLENBQUwsRUFBOEM7QUFDN0N3aEIsbUJBQVl4aEIsQ0FBWixJQUFrQitHLElBQUlvUCxJQUFKLENBQVVNLE9BQVYsQ0FBbEI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQStLLGtCQUFhM0IsU0FBVTJCLFVBQVYsQ0FBYjtBQUNBOztBQUVEO0FBQ0EvYyxTQUFLeVIsS0FBTCxDQUFZTyxPQUFaLEVBQXFCK0ssVUFBckI7O0FBRUE7QUFDQSxRQUFLRixhQUFhLENBQUM1SyxJQUFkLElBQXNCOEssV0FBVzVoQixNQUFYLEdBQW9CLENBQTFDLElBQ0YyaEIsZUFBZUwsWUFBWXRoQixNQUE3QixHQUF3QyxDQUR6QyxFQUM2Qzs7QUFFNUNsQixZQUFPOGMsVUFBUCxDQUFtQi9FLE9BQW5CO0FBQ0E7QUFDRDs7QUFFRDtBQUNBLE9BQUs2SyxTQUFMLEVBQWlCO0FBQ2hCbk8sY0FBVXVPLGFBQVY7QUFDQWxQLHVCQUFtQmlQLGFBQW5CO0FBQ0E7O0FBRUQsVUFBT2pFLFNBQVA7QUFDQSxHQXJIRjs7QUF1SEEsU0FBTzJELFFBQ052SixhQUFjeUosWUFBZCxDQURNLEdBRU5BLFlBRkQ7QUFHQTs7QUFFRDlPLFdBQVU3VCxPQUFPNlQsT0FBUCxHQUFpQixVQUFVM1QsUUFBVixFQUFvQjJELEtBQXBCLENBQTBCLHVCQUExQixFQUFvRDtBQUM5RSxNQUFJdkMsQ0FBSjtBQUFBLE1BQ0NraEIsY0FBYyxFQURmO0FBQUEsTUFFQ0Qsa0JBQWtCLEVBRm5CO0FBQUEsTUFHQy9CLFNBQVMzTCxjQUFlM1UsV0FBVyxHQUExQixDQUhWOztBQUtBLE1BQUssQ0FBQ3NnQixNQUFOLEVBQWU7O0FBRWQ7QUFDQSxPQUFLLENBQUMzYyxLQUFOLEVBQWM7QUFDYkEsWUFBUStQLFNBQVUxVCxRQUFWLENBQVI7QUFDQTtBQUNEb0IsT0FBSXVDLE1BQU0zQyxNQUFWO0FBQ0EsVUFBUUksR0FBUixFQUFjO0FBQ2JrZixhQUFTd0Isa0JBQW1CbmUsTUFBT3ZDLENBQVAsQ0FBbkIsQ0FBVDtBQUNBLFFBQUtrZixPQUFRbE0sT0FBUixDQUFMLEVBQXlCO0FBQ3hCa08saUJBQVl6YyxJQUFaLENBQWtCeWEsTUFBbEI7QUFDQSxLQUZELE1BRU87QUFDTitCLHFCQUFnQnhjLElBQWhCLENBQXNCeWEsTUFBdEI7QUFDQTtBQUNEOztBQUVEO0FBQ0FBLFlBQVMzTCxjQUNSM1UsUUFEUSxFQUVSb2lCLHlCQUEwQkMsZUFBMUIsRUFBMkNDLFdBQTNDLENBRlEsQ0FBVDs7QUFLQTtBQUNBaEMsVUFBT3RnQixRQUFQLEdBQWtCQSxRQUFsQjtBQUNBO0FBQ0QsU0FBT3NnQixNQUFQO0FBQ0EsRUFoQ0Q7O0FBa0NBOzs7Ozs7Ozs7QUFTQWxjLFVBQVN0RSxPQUFPc0UsTUFBUCxHQUFnQixVQUFVcEUsUUFBVixFQUFvQm9LLE9BQXBCLEVBQTZCeU4sT0FBN0IsRUFBc0NDLElBQXRDLEVBQTZDO0FBQ3JFLE1BQUkxVyxDQUFKO0FBQUEsTUFBTytlLE1BQVA7QUFBQSxNQUFlOEMsS0FBZjtBQUFBLE1BQXNCdmUsSUFBdEI7QUFBQSxNQUE0QjBXLElBQTVCO0FBQUEsTUFDQzhILFdBQVcsT0FBT2xqQixRQUFQLEtBQW9CLFVBQXBCLElBQWtDQSxRQUQ5QztBQUFBLE1BRUMyRCxRQUFRLENBQUNtVSxJQUFELElBQVNwRSxTQUFZMVQsV0FBV2tqQixTQUFTbGpCLFFBQVQsSUFBcUJBLFFBQTVDLENBRmxCOztBQUlBNlgsWUFBVUEsV0FBVyxFQUFyQjs7QUFFQTtBQUNBO0FBQ0EsTUFBS2xVLE1BQU0zQyxNQUFOLEtBQWlCLENBQXRCLEVBQTBCOztBQUV6QjtBQUNBbWYsWUFBU3hjLE1BQU8sQ0FBUCxJQUFhQSxNQUFPLENBQVAsRUFBV3NFLEtBQVgsQ0FBa0IsQ0FBbEIsQ0FBdEI7QUFDQSxPQUFLa1ksT0FBT25mLE1BQVAsR0FBZ0IsQ0FBaEIsSUFBcUIsQ0FBRWlpQixRQUFROUMsT0FBUSxDQUFSLENBQVYsRUFBd0J6YixJQUF4QixLQUFpQyxJQUF0RCxJQUNKMEYsUUFBUXJGLFFBQVIsS0FBcUIsQ0FEakIsSUFDc0JrUCxjQUR0QixJQUN3Q1YsS0FBSzZKLFFBQUwsQ0FBZStDLE9BQVEsQ0FBUixFQUFZemIsSUFBM0IsQ0FEN0MsRUFDaUY7O0FBRWhGMEYsY0FBVSxDQUFFbUosS0FBSzZILElBQUwsQ0FBVyxJQUFYLEVBQW1CNkgsTUFBTXpkLE9BQU4sQ0FBZSxDQUFmLEVBQzdCOUIsT0FENkIsQ0FDcEI0UyxTQURvQixFQUNUQyxTQURTLENBQW5CLEVBQ3VCbk0sT0FEdkIsS0FDb0MsRUFEdEMsRUFDNEMsQ0FENUMsQ0FBVjtBQUVBLFFBQUssQ0FBQ0EsT0FBTixFQUFnQjtBQUNmLFlBQU95TixPQUFQOztBQUVEO0FBQ0MsS0FKRCxNQUlPLElBQUtxTCxRQUFMLEVBQWdCO0FBQ3RCOVksZUFBVUEsUUFBUXpKLFVBQWxCO0FBQ0E7O0FBRURYLGVBQVdBLFNBQVNpSSxLQUFULENBQWdCa1ksT0FBT2pmLEtBQVAsR0FBZTZCLEtBQWYsQ0FBcUIvQixNQUFyQyxDQUFYO0FBQ0E7O0FBRUQ7QUFDQUksT0FBSTJVLFVBQVcsY0FBWCxFQUE0QmpSLElBQTVCLENBQWtDOUUsUUFBbEMsSUFBK0MsQ0FBL0MsR0FBbURtZ0IsT0FBT25mLE1BQTlEO0FBQ0EsVUFBUUksR0FBUixFQUFjO0FBQ2I2aEIsWUFBUTlDLE9BQVEvZSxDQUFSLENBQVI7O0FBRUE7QUFDQSxRQUFLbVMsS0FBSzZKLFFBQUwsQ0FBaUIxWSxPQUFPdWUsTUFBTXZlLElBQTlCLENBQUwsRUFBOEM7QUFDN0M7QUFDQTtBQUNELFFBQU8wVyxPQUFPN0gsS0FBSzZILElBQUwsQ0FBVzFXLElBQVgsQ0FBZCxFQUFvQzs7QUFFbkM7QUFDQSxTQUFPb1QsT0FBT3NELEtBQ2I2SCxNQUFNemQsT0FBTixDQUFlLENBQWYsRUFBbUI5QixPQUFuQixDQUE0QjRTLFNBQTVCLEVBQXVDQyxTQUF2QyxDQURhLEVBRWJGLFNBQVN2UixJQUFULENBQWVxYixPQUFRLENBQVIsRUFBWXpiLElBQTNCLEtBQXFDOFQsWUFBYXBPLFFBQVF6SixVQUFyQixDQUFyQyxJQUNDeUosT0FIWSxDQUFkLEVBSU07O0FBRUw7QUFDQStWLGFBQU9uRCxNQUFQLENBQWU1YixDQUFmLEVBQWtCLENBQWxCO0FBQ0FwQixpQkFBVzhYLEtBQUs5VyxNQUFMLElBQWUyWCxXQUFZd0gsTUFBWixDQUExQjtBQUNBLFVBQUssQ0FBQ25nQixRQUFOLEVBQWlCO0FBQ2hCNkYsWUFBS3lSLEtBQUwsQ0FBWU8sT0FBWixFQUFxQkMsSUFBckI7QUFDQSxjQUFPRCxPQUFQO0FBQ0E7O0FBRUQ7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsR0FBRXFMLFlBQVl2UCxRQUFTM1QsUUFBVCxFQUFtQjJELEtBQW5CLENBQWQsRUFDQ21VLElBREQsRUFFQzFOLE9BRkQsRUFHQyxDQUFDNkosY0FIRixFQUlDNEQsT0FKRCxFQUtDLENBQUN6TixPQUFELElBQVlpTSxTQUFTdlIsSUFBVCxDQUFlOUUsUUFBZixLQUE2QndZLFlBQWFwTyxRQUFRekosVUFBckIsQ0FBekMsSUFBOEV5SixPQUwvRTtBQU9BLFNBQU95TixPQUFQO0FBQ0EsRUF2RUQ7O0FBeUVBOztBQUVBO0FBQ0F2RSxTQUFReUosVUFBUixHQUFxQjNJLFFBQVFoUyxLQUFSLENBQWUsRUFBZixFQUFvQnZCLElBQXBCLENBQTBCZ1UsU0FBMUIsRUFBc0N2UCxJQUF0QyxDQUE0QyxFQUE1QyxNQUFxRDhPLE9BQTFFOztBQUVBO0FBQ0E7QUFDQWQsU0FBUXdKLGdCQUFSLEdBQTJCLENBQUMsQ0FBQ2hKLFlBQTdCOztBQUVBO0FBQ0FDOztBQUVBO0FBQ0E7QUFDQVQsU0FBUTRJLFlBQVIsR0FBdUJoRCxPQUFRLFVBQVVDLEVBQVYsRUFBZTs7QUFFN0M7QUFDQSxTQUFPQSxHQUFHNEMsdUJBQUgsQ0FBNEI3YixTQUFTa1osYUFBVCxDQUF3QixVQUF4QixDQUE1QixJQUFxRSxDQUE1RTtBQUNBLEVBSnNCLENBQXZCOztBQU1BO0FBQ0E7QUFDQTtBQUNBLEtBQUssQ0FBQ0YsT0FBUSxVQUFVQyxFQUFWLEVBQWU7QUFDNUJBLEtBQUdxQyxTQUFILEdBQWUsa0JBQWY7QUFDQSxTQUFPckMsR0FBRzhELFVBQUgsQ0FBYy9hLFlBQWQsQ0FBNEIsTUFBNUIsTUFBeUMsR0FBaEQ7QUFDQSxFQUhLLENBQU4sRUFHTTtBQUNMb1gsWUFBVyx3QkFBWCxFQUFxQyxVQUFVcEUsSUFBVixFQUFnQjNTLElBQWhCLEVBQXNCa1IsS0FBdEIsRUFBOEI7QUFDbEUsT0FBSyxDQUFDQSxLQUFOLEVBQWM7QUFDYixXQUFPeUIsS0FBS2hULFlBQUwsQ0FBbUJLLElBQW5CLEVBQXlCQSxLQUFLYSxXQUFMLE9BQXVCLE1BQXZCLEdBQWdDLENBQWhDLEdBQW9DLENBQTdELENBQVA7QUFDQTtBQUNELEdBSkQ7QUFLQTs7QUFFRDtBQUNBO0FBQ0EsS0FBSyxDQUFDa1EsUUFBUTFSLFVBQVQsSUFBdUIsQ0FBQ3NYLE9BQVEsVUFBVUMsRUFBVixFQUFlO0FBQ25EQSxLQUFHcUMsU0FBSCxHQUFlLFVBQWY7QUFDQXJDLEtBQUc4RCxVQUFILENBQWN2RSxZQUFkLENBQTRCLE9BQTVCLEVBQXFDLEVBQXJDO0FBQ0EsU0FBT1MsR0FBRzhELFVBQUgsQ0FBYy9hLFlBQWQsQ0FBNEIsT0FBNUIsTUFBMEMsRUFBakQ7QUFDQSxFQUo0QixDQUE3QixFQUlNO0FBQ0xvWCxZQUFXLE9BQVgsRUFBb0IsVUFBVXBFLElBQVYsRUFBZ0JpTyxLQUFoQixFQUF1QjFQLEtBQXZCLEVBQStCO0FBQ2xELE9BQUssQ0FBQ0EsS0FBRCxJQUFVeUIsS0FBS2tDLFFBQUwsQ0FBY2hVLFdBQWQsT0FBZ0MsT0FBL0MsRUFBeUQ7QUFDeEQsV0FBTzhSLEtBQUtrTyxZQUFaO0FBQ0E7QUFDRCxHQUpEO0FBS0E7O0FBRUQ7QUFDQTtBQUNBLEtBQUssQ0FBQ2xLLE9BQVEsVUFBVUMsRUFBVixFQUFlO0FBQzVCLFNBQU9BLEdBQUdqWCxZQUFILENBQWlCLFVBQWpCLEtBQWlDLElBQXhDO0FBQ0EsRUFGSyxDQUFOLEVBRU07QUFDTG9YLFlBQVdsRSxRQUFYLEVBQXFCLFVBQVVGLElBQVYsRUFBZ0IzUyxJQUFoQixFQUFzQmtSLEtBQXRCLEVBQThCO0FBQ2xELE9BQUl2TixHQUFKO0FBQ0EsT0FBSyxDQUFDdU4sS0FBTixFQUFjO0FBQ2IsV0FBT3lCLEtBQU0zUyxJQUFOLE1BQWlCLElBQWpCLEdBQXdCQSxLQUFLYSxXQUFMLEVBQXhCLEdBQ04sQ0FBRThDLE1BQU1nUCxLQUFLbUcsZ0JBQUwsQ0FBdUI5WSxJQUF2QixDQUFSLEtBQTJDMkQsSUFBSXNXLFNBQS9DLEdBQ0N0VyxJQUFJbkQsS0FETCxHQUVDLElBSEY7QUFJQTtBQUNELEdBUkQ7QUFTQTs7QUFFRDtBQUNBLEtBQUlzZ0IsVUFBVWhRLE9BQU92VCxNQUFyQjs7QUFFQUEsUUFBT3dqQixVQUFQLEdBQW9CLFlBQVc7QUFDOUIsTUFBS2pRLE9BQU92VCxNQUFQLEtBQWtCQSxNQUF2QixFQUFnQztBQUMvQnVULFVBQU92VCxNQUFQLEdBQWdCdWpCLE9BQWhCO0FBQ0E7O0FBRUQsU0FBT3ZqQixNQUFQO0FBQ0EsRUFORDs7QUFRQSxLQUFLLElBQUwsRUFBa0Q7QUFDakR5akIsRUFBQSxrQ0FBUSxZQUFXO0FBQ2xCLFVBQU96akIsTUFBUDtBQUNBLEdBRkQ7O0FBSUQ7QUFDQyxFQU5ELE1BTU8sSUFBSyxPQUFPcVQsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsT0FBT0MsT0FBN0MsRUFBdUQ7QUFDN0RELFNBQU9DLE9BQVAsR0FBaUJ0VCxNQUFqQjtBQUNBLEVBRk0sTUFFQTtBQUNOdVQsU0FBT3ZULE1BQVAsR0FBZ0JBLE1BQWhCO0FBQ0E7O0FBRUQ7QUFFQyxDQW42RUQsRUFtNkVLdVQsTUFuNkVMLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkNDVlNtUSxPOzs7Ozs7bUJBQW1CbFcsaUI7Ozs7OzttQkFBbUJDLGdCOzs7Ozs7Ozs7MENBQ3RDaVcsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7Ozs7UUFDR0MsTSIsImZpbGUiOiJvcHRpbWFsLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA4KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4NGI0ZWNhOWE1N2MwMmE3MjRmYiIsIi8qKlxuICogIyBDb21tb25cbiAqXG4gKiBQcm9jZXNzIGNvbGxlY3Rpb25zIGZvciBzaW1pbGFyaXRpZXMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIFF1ZXJ5IGRvY3VtZW50IHVzaW5nIGNvcnJlY3Qgc2VsZWN0b3IgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4geyhzZWxlY3Rvcjogc3RyaW5nLCBwYXJlbnQ6IEhUTUxFbGVtZW50KSA9PiBBcnJheS48SFRNTEVsZW1lbnQ+fSAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdCAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLmZvcm1hdCA9PT0gJ2pxdWVyeScpIHtcbiAgICBjb25zdCBTaXp6bGUgPSByZXF1aXJlKCdzaXp6bGUnKVxuICAgIHJldHVybiBmdW5jdGlvbiAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpIHtcbiAgICAgIHJldHVybiBTaXp6bGUoc2VsZWN0b3IsIHBhcmVudCB8fCBkb2N1bWVudClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkge1xuICAgIHJldHVybiAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICB9IFxufVxuXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25BbmNlc3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25Qcm9wZXJ0aWVzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSB7XG4gICAgY2xhc3NlczogW10sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgdGFnOiBudWxsXG4gIH1cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICB2YXIge1xuICAgICAgY2xhc3NlczogY29tbW9uQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXM6IGNvbW1vbkF0dHJpYnV0ZXMsXG4gICAgICB0YWc6IGNvbW1vblRhZ1xuICAgIH0gPSBjb21tb25Qcm9wZXJ0aWVzXG5cbiAgICAvLyB+IGNsYXNzZXNcbiAgICBpZiAoY29tbW9uQ2xhc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgICBpZiAoIWNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkNsYXNzZXMgPSBjb21tb25DbGFzc2VzLmZpbHRlcigoZW50cnkpID0+IGNsYXNzZXMuc29tZSgobmFtZSkgPT4gbmFtZSA9PT0gZW50cnkpKVxuICAgICAgICAgIGlmIChjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY29tbW9uQ2xhc3Nlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiByZXN0cnVjdHVyZSByZW1vdmFsIGFzIDJ4IHNldCAvIDJ4IGRlbGV0ZSwgaW5zdGVhZCBvZiBtb2RpZnkgYWx3YXlzIHJlcGxhY2luZyB3aXRoIG5ldyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IGF0dHJpYnV0ZXNcbiAgICBpZiAoY29tbW9uQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBlbGVtZW50QXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGVsZW1lbnRBdHRyaWJ1dGVzKS5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlc1trZXldXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgICAgICAvLyBOT1RFOiB3b3JrYXJvdW5kIGRldGVjdGlvbiBmb3Igbm9uLXN0YW5kYXJkIHBoYW50b21qcyBOYW1lZE5vZGVNYXAgYmVoYXZpb3VyXG4gICAgICAgIC8vIChpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTQ2MzQpXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGUudmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfSwge30pXG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICBjb25zdCBjb21tb25BdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKVxuXG4gICAgICBpZiAoYXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIWNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKG5leHRDb21tb25BdHRyaWJ1dGVzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbW1vbkF0dHJpYnV0ZXNbbmFtZV1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gYXR0cmlidXRlc1tuYW1lXSkge1xuICAgICAgICAgICAgICBuZXh0Q29tbW9uQXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dENvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IHRhZ1xuICAgIGlmIChjb21tb25UYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICghY29tbW9uVGFnKSB7XG4gICAgICAgIGNvbW1vblByb3BlcnRpZXMudGFnID0gdGFnXG4gICAgICB9IGVsc2UgaWYgKHRhZyAhPT0gY29tbW9uVGFnKSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLnRhZ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gY29tbW9uUHJvcGVydGllc1xufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tbW9uLmpzIiwiLyoqXG4gKiAjIFV0aWxpdGllc1xuICpcbiAqIENvbnZlbmllbmNlIGhlbHBlcnMuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgYW4gYXJyYXkgd2l0aCB0aGUgRE9NIG5vZGVzIG9mIHRoZSBsaXN0XG4gKlxuICogQHBhcmFtICB7Tm9kZUxpc3R9ICAgICAgICAgICAgIG5vZGVzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydE5vZGVMaXN0IChub2Rlcykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbm9kZXNcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFycltpXSA9IG5vZGVzW2ldXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG4vKipcbiAqIEVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIGxpbmUgYnJlYWtzIGFzIGEgc2ltcGxpZmllZCB2ZXJzaW9uIG9mICdDU1MuZXNjYXBlKCknXG4gKlxuICogRGVzY3JpcHRpb24gb2YgdmFsaWQgY2hhcmFjdGVyczogaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2Nzcy1lc2NhcGVzXG4gKlxuICogQHBhcmFtICB7U3RyaW5nP30gdmFsdWUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVZhbHVlICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvWydcImBcXFxcLzo/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL1xcbi9nLCAnXFx1MDBhMCcpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmUgc2VsZWN0b3IgZm9yIGEgbm9kZS5cbiAqL1xuXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL2NvbW1vbidcbmltcG9ydCB7IGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKi9cblxuY29uc3QgZGVmYXVsdElnbm9yZSA9IHtcbiAgYXR0cmlidXRlIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdzdHlsZScsXG4gICAgICAnZGF0YS1yZWFjdGlkJyxcbiAgICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICAgIF0uaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoIChub2RlLCBvcHRpb25zID0ge30pIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50LFxuICAgIHNraXAgPSBudWxsLFxuICAgIHByaW9yaXR5ID0gWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZSA9IHt9LFxuICAgIGZvcm1hdFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IHBhdGggPSBbXVxuICB2YXIgZWxlbWVudCA9IG5vZGVcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIGNvbnN0IGpxdWVyeSA9IChmb3JtYXQgPT09ICdqcXVlcnknKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGlnbm9yZVt0eXBlXVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnZnVuY3Rpb24nKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZS50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgcHJlZGljYXRlID0gbmV3IFJlZ0V4cChlc2NhcGVWYWx1ZShwcmVkaWNhdGUpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZSA/IC8oPzopLyA6IC8uXi9cbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gKG5hbWUsIHZhbHVlKSA9PiBwcmVkaWNhdGUudGVzdCh2YWx1ZSlcbiAgfSlcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxMSkge1xuICAgIGlmIChza2lwQ2hlY2tzKGVsZW1lbnQpICE9PSB0cnVlKSB7XG4gICAgICAvLyB+IGdsb2JhbFxuICAgICAgaWYgKGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHJvb3QpKSBicmVha1xuICAgICAgaWYgKGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KVxuICAgICAgfVxuXG4gICAgICBpZiAoanF1ZXJ5ICYmIHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tDb250YWlucyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmluZSBvbmx5IG9uZSBwYXJ0IGVhY2ggaXRlcmF0aW9uXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NoaWxkcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJylcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCBwYXJlbnQpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzZXMgPSBbXSwgc2VsZWN0LCBwYXJlbnQpIHtcbiAgbGV0IHJlc3VsdCA9IFtbXV1cblxuICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHIuY29uY2F0KCcuJyArIGMpKVxuICAgIH0pXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcblxuICByZXN1bHQgPSByZXN1bHQuc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGggfSlcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHIgPSByZXN1bHRbaV0uam9pbignJylcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHIsIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMb29rdXAgYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmc/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGVzUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKHZhbCkgPT4gYXR0cmlidXRlc1t2YWxdLm5hbWUpXG4gICAgLmZpbHRlcigoYSkgPT4gcHJpb3JpdHkuaW5kZXhPZihhKSA8IDApXG5cbiAgdmFyIHNvcnRlZEtleXMgPSBbIC4uLnByaW9yaXR5LCAuLi5hdHRyaWJ1dGVOYW1lcyBdXG5cbiAgdmFyIHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc29ydGVkS2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBzb3J0ZWRLZXlzW2ldXG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGUubmFtZSlcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGUudmFsdWUpXG4gICAgY29uc3QgdXNlTmFtZWRJZ25vcmUgPSBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnXG5cbiAgICBjb25zdCBjdXJyZW50SWdub3JlID0gKHVzZU5hbWVkSWdub3JlICYmIGlnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgaWdub3JlLmF0dHJpYnV0ZVxuICAgIGNvbnN0IGN1cnJlbnREZWZhdWx0SWdub3JlID0gKHVzZU5hbWVkSWdub3JlICYmIGRlZmF1bHRJZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlXG4gICAgaWYgKGNoZWNrSWdub3JlKGN1cnJlbnRJZ25vcmUsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlLCBjdXJyZW50RGVmYXVsdElnbm9yZSkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgdmFyIHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICBpZighYXR0cmlidXRlVmFsdWUudHJpbSgpKSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnaWQnKSB7XG4gICAgICBwYXR0ZXJuID0gYCMke2F0dHJpYnV0ZVZhbHVlfWBcbiAgICB9XG5cbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgbGV0IGNsYXNzTmFtZXMgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKCkuc3BsaXQoL1xccysvZylcbiAgICAgIGNvbnN0IGNsYXNzSWdub3JlID0gaWdub3JlLmNsYXNzIHx8IGRlZmF1bHRJZ25vcmUuY2xhc3NcbiAgICAgIGlmIChjbGFzc0lnbm9yZSkge1xuICAgICAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lcy5maWx0ZXIoY2xhc3NOYW1lID0+ICFjbGFzc0lnbm9yZShjbGFzc05hbWUpKVxuICAgICAgfVxuICAgICAgaWYgKGNsYXNzTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBwYXR0ZXJuID0gZ2V0Q2xhc3NTZWxlY3RvcihjbGFzc05hbWVzLCBzZWxlY3QsIHBhcmVudClcblxuICAgICAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhZ05hbWUgKyBwYXR0ZXJuXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICBpZiAocGF0dGVybikge1xuICAgIGxldCBtYXRjaGVzID0gW11cbiAgICBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4sIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgaWYgKHBhdHRlcm4gPT09ICdpZnJhbWUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kVGFnUGF0dGVybiAoZWxlbWVudCwgaWdub3JlKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgbnVsbCwgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHJldHVybiB0YWdOYW1lXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBzcGVjaWZpYyBjaGlsZCBpZGVudGlmaWVyXG4gKlxuICogTk9URTogJ2NoaWxkVGFncycgaXMgYSBjdXN0b20gcHJvcGVydHkgdG8gdXNlIGFzIGEgdmlldyBmaWx0ZXIgZm9yIHRhZ3MgdXNpbmcgJ2FkYXB0ZXIuanMnXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NoaWxkcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZFRhZ3MgfHwgcGFyZW50LmNoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZCA9PT0gZWxlbWVudCkge1xuICAgICAgY29uc3QgY2hpbGRQYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGNoaWxkLCBpZ25vcmUsIHNlbGVjdClcbiAgICAgIGlmICghY2hpbGRQYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgICAgIEVsZW1lbnQgY291bGRuJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY29uc3QgcGF0dGVybiA9IGA+ICR7Y2hpbGRQYXR0ZXJufTpudGgtY2hpbGQoJHtpKzF9KWBcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBjb250YWluc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDb250YWlucyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KSB7XG4gIGNvbnN0IGVsZW1lbnRQYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KVxuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgdGV4dHMgPSBlbGVtZW50LnRleHRDb250ZW50XG4gICAgLnJlcGxhY2UoL1xcbisvZywgJ1xcbicpXG4gICAgLnNwbGl0KCdcXG4nKVxuICAgIC5tYXAodGV4dCA9PiB0ZXh0LnRyaW0oKSlcbiAgICAuZmlsdGVyKHRleHQgPT4gdGV4dC5sZW5ndGggPiAwKVxuXG4gIGxldCBwYXR0ZXJuID0gYD4gJHtlbGVtZW50UGF0dGVybn1gXG4gIGNvbnN0IGZvdW5kID0gdGV4dHMuc29tZSh0ZXh0ID0+IHtcbiAgICBwYXR0ZXJuID0gYCR7cGF0dGVybn06Y29udGFpbnMoXCIke3RleHR9XCIpYFxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybiwgcGFyZW50KVxuICAgIHJldHVybiBtYXRjaGVzLmxlbmd0aCA9PT0gMVxuICB9KVxuICBpZiAoZm91bmQpIHtcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KSB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdClcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgfVxuICByZXR1cm4gcGF0dGVyblxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHdpdGggY3VzdG9tIGFuZCBkZWZhdWx0IGZ1bmN0aW9uc1xuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBwcmVkaWNhdGUgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nP30gIG5hbWUgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdmFsdWUgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkZWZhdWx0UHJlZGljYXRlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWdub3JlIChwcmVkaWNhdGUsIG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGNvbnN0IGNoZWNrID0gcHJlZGljYXRlIHx8IGRlZmF1bHRQcmVkaWNhdGVcbiAgaWYgKCFjaGVjaykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVjayhuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYXRjaC5qcyIsIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbnNmb3JtYXRpb25cbiAqL1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCB7IGdldFNlbGVjdCB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKi9cblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcHRpbWl6ZSAoc2VsZWN0b3IsIGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoc2VsZWN0b3Iuc3RhcnRzV2l0aCgnPiAnKSkge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgnPiAnLCAnJylcbiAgfVxuXG4gIC8vIGNvbnZlcnQgc2luZ2xlIGVudHJ5IGFuZCBOb2RlTGlzdFxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSAhZWxlbWVudHMubGVuZ3RoID8gW2VsZW1lbnRzXSA6IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmICghZWxlbWVudHMubGVuZ3RoIHx8IGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IC0gdG8gY29tcGFyZSBIVE1MRWxlbWVudHMgaXRzIG5lY2Vzc2FyeSB0byBwcm92aWRlIGEgcmVmZXJlbmNlIG9mIHRoZSBzZWxlY3RlZCBub2RlKHMpISAobWlzc2luZyBcImVsZW1lbnRzXCIpJylcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIC8vIGNodW5rIHBhcnRzIG91dHNpZGUgb2YgcXVvdGVzIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTY2MzcyOSwgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2MjYxNjkzKVxuICAvLyB2YXIgcGF0aCA9IHNlbGVjdG9yLnJlcGxhY2UoLz4gL2csICc+Jykuc3BsaXQoL1xccysoPz0oPzooPzpbXlwiXSpcIil7Mn0pKlteXCJdKiQpLylcbiAgdmFyIHBhdGggPSBzZWxlY3Rvci5yZXBsYWNlKC8+IC9nLCAnPicpLm1hdGNoKC8oPzpbXlxcc1wiXSt8XCJbXlwiXSpcIikrL2cpXG5cbiAgaWYgKHBhdGgubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBvcHRpbWl6ZVBhcnQoJycsIHNlbGVjdG9yLCAnJywgZWxlbWVudHMsIHNlbGVjdClcbiAgfVxuXG4gIHZhciBlbmRPcHRpbWl6ZWQgPSBmYWxzZVxuICBpZiAoLz4vLnRlc3QocGF0aFtwYXRoLmxlbmd0aC0xXSkpIHtcbiAgICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLmpvaW4oJyAnKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnRzLCBzZWxlY3QpXG4gICAgZW5kT3B0aW1pemVkID0gdHJ1ZVxuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpICB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBwcmVQYXJ0ID0gcGF0aC5qb2luKCcgJylcbiAgICBjb25zdCBwb3N0UGFydCA9IHNob3J0ZW5lZC5qb2luKCcgJylcblxuICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSAke3Bvc3RQYXJ0fWBcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4pXG4gICAgY29uc3QgaGFzU2FtZVJlc3VsdCA9IG1hdGNoZXMubGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQsIGkpID0+IGVsZW1lbnQgPT09IG1hdGNoZXNbaV0pXG4gICAgaWYgKCFoYXNTYW1lUmVzdWx0KSB7XG4gICAgICBzaG9ydGVuZWQudW5zaGlmdChvcHRpbWl6ZVBhcnQocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpKVxuICAgIH1cbiAgfVxuICBzaG9ydGVuZWQudW5zaGlmdChwYXRoWzBdKVxuICBwYXRoID0gc2hvcnRlbmVkXG5cbiAgLy8gb3B0aW1pemUgc3RhcnQgKyBlbmRcbiAgcGF0aFswXSA9IG9wdGltaXplUGFydCgnJywgcGF0aFswXSwgcGF0aC5zbGljZSgxKS5qb2luKCcgJyksIGVsZW1lbnRzLCBzZWxlY3QpXG4gIGlmICghZW5kT3B0aW1pemVkKSB7XG4gICAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50cywgc2VsZWN0KVxuICB9XG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpLnJlcGxhY2UoLz4vZywgJz4gJykudHJpbSgpXG59XG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVQYXJ0IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICBpZiAocHJlUGFydC5sZW5ndGgpIHByZVBhcnQgPSBgJHtwcmVQYXJ0fSBgXG4gIGlmIChwb3N0UGFydC5sZW5ndGgpIHBvc3RQYXJ0ID0gYCAke3Bvc3RQYXJ0fWBcblxuICAvLyBvcHRpbWl6ZSBjb250YWluc1xuICBpZiAoLzpjb250YWluc1xcKC8udGVzdChjdXJyZW50KSAmJiBwb3N0UGFydC5sZW5ndGgpIHtcbiAgICBsZXQgZmlyc3RJbmRleCA9IGN1cnJlbnQuaW5kZXhPZignOicpXG4gICAgbGV0IGNvbnRhaW5zSW5kZXggPSBjdXJyZW50Lmxhc3RJbmRleE9mKCc6Y29udGFpbnMoJylcbiAgICBsZXQgb3B0aW1pemVkID0gY3VycmVudC5zbGljZSgwLCBjb250YWluc0luZGV4KVxuICAgIHdoaWxlIChjb250YWluc0luZGV4ID4gZmlyc3RJbmRleCAmJiBjb21wYXJlUmVzdWx0cyhzZWxlY3QoYCR7cHJlUGFydH0ke29wdGltaXplZH0ke3Bvc3RQYXJ0fWApLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBvcHRpbWl6ZWRcbiAgICAgIGNvbnRhaW5zSW5kZXggPSBjdXJyZW50Lmxhc3RJbmRleE9mKCc6Y29udGFpbnMoJylcbiAgICAgIG9wdGltaXplZCA9IGN1cnJlbnQuc2xpY2UoMCwgY29udGFpbnNJbmRleClcbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBhdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZSAoZ2VuZXJhbGl6YXRpb24pXG4gIGlmICgvXFxbKlxcXS8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGtleSA9IGN1cnJlbnQucmVwbGFjZSgvPS4qJC8sICddJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtrZXl9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0ga2V5XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJvYnVzdG5lc3M6IHJlcGxhY2Ugc3BlY2lmaWMga2V5LXZhbHVlIHdpdGggYmFzZSB0YWcgKGhldXJpc3RpYylcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBzZWxlY3QoYCR7cHJlUGFydH0ke2tleX1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4yID0gYCR7cHJlUGFydH0ke2Rlc2NyaXB0aW9ufSR7cG9zdFBhcnR9YFxuICAgICAgICAgIHZhciBtYXRjaGVzMiA9IHNlbGVjdChwYXR0ZXJuMilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczIsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKC8+Ly50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IGN1cnJlbnQucmVwbGFjZSgvPi8sICcnKVxuICAgIHZhciBwYXR0ZXJuMyA9IGAke3ByZVBhcnR9JHtkZXNjZW5kYW50fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzMyA9IHNlbGVjdChwYXR0ZXJuMylcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IGRlc2NlbmRhbnRcbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiAnbnRoLW9mLXR5cGUnIGluc3RlYWQgJ250aC1jaGlsZCcgKGhldXJpc3RpYylcbiAgaWYgKC86bnRoLWNoaWxkLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgY29tcGxldGUgY292ZXJhZ2Ugb2YgJ250aC1vZi10eXBlJyByZXBsYWNlbWVudFxuICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50LnJlcGxhY2UoL250aC1jaGlsZC9nLCAnbnRoLW9mLXR5cGUnKVxuICAgIHZhciBwYXR0ZXJuNCA9IGAke3ByZVBhcnR9JHt0eXBlfSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzNCA9IHNlbGVjdChwYXR0ZXJuNClcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczQsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IHR5cGVcbiAgICB9XG4gIH1cblxuICAvLyBlZmZpY2llbmN5OiBjb21iaW5hdGlvbnMgb2YgY2xhc3NuYW1lIChwYXJ0aWFsIHBlcm11dGF0aW9ucylcbiAgaWYgKC9eXFwuXFxTKlteXFxzXFxcXF1cXC5cXFMrLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgdmFyIG5hbWVzID0gY3VycmVudC50cmltKClcbiAgICAgIC5yZXBsYWNlKC8oXnxbXlxcXFxdKVxcLi9nLCAnJDEjLicpIC8vIGVzY2FwZSBhY3R1YWwgZG90c1xuICAgICAgLnNwbGl0KCcjLicpIC8vIHNwbGl0IG9ubHkgb24gYWN0dWFsIGRvdHNcbiAgICAgIC5zbGljZSgxKVxuICAgICAgLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YClcbiAgICAgIC5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuICAgIHdoaWxlIChuYW1lcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcnRpYWwgPSBjdXJyZW50LnJlcGxhY2UobmFtZXMuc2hpZnQoKSwgJycpLnRyaW0oKVxuICAgICAgdmFyIHBhdHRlcm41ID0gYCR7cHJlUGFydH0ke3BhcnRpYWx9JHtwb3N0UGFydH1gLnRyaW0oKVxuICAgICAgaWYgKCFwYXR0ZXJuNS5sZW5ndGggfHwgcGF0dGVybjUuY2hhckF0KDApID09PSAnPicgfHwgcGF0dGVybjUuY2hhckF0KHBhdHRlcm41Lmxlbmd0aC0xKSA9PT0gJz4nKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB2YXIgbWF0Y2hlczUgPSBzZWxlY3QocGF0dGVybjUpXG4gICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczUsIGVsZW1lbnRzKSkge1xuICAgICAgICBjdXJyZW50ID0gcGFydGlhbFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJvYnVzdG5lc3M6IGRlZ3JhZGUgY29tcGxleCBjbGFzc25hbWUgKGhldXJpc3RpYylcbiAgICBuYW1lcyA9IGN1cnJlbnQgJiYgY3VycmVudC5tYXRjaCgvXFwuL2cpXG4gICAgaWYgKG5hbWVzICYmIG5hbWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBzZWxlY3QoYCR7cHJlUGFydH0ke2N1cnJlbnR9YClcbiAgICAgIGZvciAodmFyIGkyID0gMCwgbDIgPSByZWZlcmVuY2VzLmxlbmd0aDsgaTIgPCBsMjsgaTIrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2kyXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpICkpIHtcbiAgICAgICAgICAvLyBUT0RPOlxuICAgICAgICAgIC8vIC0gY2hlY2sgdXNpbmcgYXR0cmlidXRlcyArIHJlZ2FyZCBleGNsdWRlc1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuNiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlczYgPSBzZWxlY3QocGF0dGVybjYpXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXM2LCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBtYXRjaGVzIHdpdGggZXhwZWN0ZWQgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBtYXRjaGVzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVSZXN1bHRzIChtYXRjaGVzLCBlbGVtZW50cykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbWF0Y2hlc1xuICByZXR1cm4gbGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vcHRpbWl6ZS5qcyIsIi8qKlxuICogIyBBZGFwdFxuICpcbiAqIENoZWNrIGFuZCBleHRlbmQgdGhlIGVudmlyb25tZW50IGZvciB1bml2ZXJzYWwgdXNhZ2UuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG4gIC8vIGRldGVjdCBlbnZpcm9ubWVudCBzZXR1cFxuICBpZiAoZ2xvYmFsLmRvY3VtZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmRvY3VtZW50ID0gb3B0aW9ucy5jb250ZXh0IHx8ICgoKSA9PiB7XG4gICAgICB2YXIgcm9vdCA9IGVsZW1lbnRcbiAgICAgIHdoaWxlIChyb290LnBhcmVudCkge1xuICAgICAgICByb290ID0gcm9vdC5wYXJlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290XG4gICAgfSkoKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9taGFuZGxlci9ibG9iL21hc3Rlci9pbmRleC5qcyNMNzVcbiAgY29uc3QgRWxlbWVudFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwuZG9jdW1lbnQpXG5cbiAgLy8gYWx0ZXJuYXRpdmUgZGVzY3JpcHRvciB0byBhY2Nlc3MgZWxlbWVudHMgd2l0aCBmaWx0ZXJpbmcgaW52YWxpZCBlbGVtZW50cyAoZS5nLiB0ZXh0bm9kZXMpXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21lbGVtZW50dHlwZS9ibG9iL21hc3Rlci9pbmRleC5qcyNMMTJcbiAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAndGFnJyB8fCBub2RlLnR5cGUgPT09ICdzY3JpcHQnIHx8IG5vZGUudHlwZSA9PT0gJ3N0eWxlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnKSkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dHJpYnV0ZXNcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTmFtZWROb2RlTWFwXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlicyB9ID0gdGhpc1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJzKVxuICAgICAgICBjb25zdCBOYW1lZE5vZGVNYXAgPSBhdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChhdHRyaWJ1dGVzLCBhdHRyaWJ1dGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJzW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICAgIH0sIHsgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hbWVkTm9kZU1hcCwgJ2xlbmd0aCcsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBOYW1lZE5vZGVNYXBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJzW25hbWVdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHModGhpcy5jaGlsZFRhZ3MsIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50Lm5hbWUgPT09IHRhZ05hbWUgfHwgdGFnTmFtZSA9PT0gJyonKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgbmFtZXMgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKS5zcGxpdCgnICcpXG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudENsYXNzTmFtZSA9IGRlc2NlbmRhbnQuYXR0cmlicy5jbGFzc1xuICAgICAgICBpZiAoZGVzY2VuZGFudENsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gZGVzY2VuZGFudENsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvY3NzL3NlbGVjdG9yc19hcGkvcXVlcnlTZWxlY3RvckFsbFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICBFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3JzKSB7XG4gICAgICBzZWxlY3RvcnMgPSBzZWxlY3RvcnMucmVwbGFjZSgvKD4pKFxcUykvZywgJyQxICQyJykudHJpbSgpIC8vIGFkZCBzcGFjZSBmb3IgJz4nIHNlbGVjdG9yXG5cbiAgICAgIC8vIHVzaW5nIHJpZ2h0IHRvIGxlZnQgZXhlY3V0aW9uID0+IGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2Nzcy1zZWxlY3QjaG93LWRvZXMtaXQtd29ya1xuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gZ2V0SW5zdHJ1Y3Rpb25zKHNlbGVjdG9ycylcbiAgICAgIGNvbnN0IGRpc2NvdmVyID0gaW5zdHJ1Y3Rpb25zLnNoaWZ0KClcblxuICAgICAgY29uc3QgdG90YWwgPSBpbnN0cnVjdGlvbnMubGVuZ3RoXG4gICAgICByZXR1cm4gZGlzY292ZXIodGhpcykuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIHZhciBzdGVwID0gMFxuICAgICAgICB3aGlsZSAoc3RlcCA8IHRvdGFsKSB7XG4gICAgICAgICAgbm9kZSA9IGluc3RydWN0aW9uc1tzdGVwXShub2RlLCB0aGlzKVxuICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBoaWVyYXJjaHkgZG9lc24ndCBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0ZXAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5jb250YWlucykge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NvbnRhaW5zXG4gICAgRWxlbWVudFByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgaW5jbHVzaXZlID0gZmFsc2VcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudCA9PT0gZWxlbWVudCkge1xuICAgICAgICAgIGluY2x1c2l2ZSA9IHRydWVcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbmNsdXNpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRyYW5zZm9ybWF0aW9uIHN0ZXBzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59ICAgc2VsZWN0b3JzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEZ1bmN0aW9uPn0gICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnMgKHNlbGVjdG9ycykge1xuICByZXR1cm4gc2VsZWN0b3JzLnNwbGl0KCcgJykucmV2ZXJzZSgpLm1hcCgoc2VsZWN0b3IsIHN0ZXApID0+IHtcbiAgICBjb25zdCBkaXNjb3ZlciA9IHN0ZXAgPT09IDBcbiAgICBjb25zdCBbdHlwZSwgcHNldWRvXSA9IHNlbGVjdG9yLnNwbGl0KCc6JylcblxuICAgIHZhciB2YWxpZGF0ZSA9IG51bGxcbiAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBudWxsXG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcblxuICAgICAgLy8gY2hpbGQ6ICc+J1xuICAgICAgY2FzZSAvPi8udGVzdCh0eXBlKTpcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1BhcmVudCAobm9kZSkge1xuICAgICAgICAgIHJldHVybiAodmFsaWRhdGUpID0+IHZhbGlkYXRlKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBuYW1lcyA9IHR5cGUuc3Vic3RyKDEpLnNwbGl0KCcuJylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGVDbGFzc05hbWUgPSBub2RlLmF0dHJpYnMuY2xhc3NcbiAgICAgICAgICByZXR1cm4gbm9kZUNsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gbm9kZUNsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0NsYXNzIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG5hbWVzLmpvaW4oJyAnKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZTogJ1trZXk9XCJ2YWx1ZVwiXSdcbiAgICAgIGNhc2UgL15cXFsvLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdID0gdHlwZS5yZXBsYWNlKC9cXFt8XFxdfFwiL2csICcnKS5zcGxpdCgnPScpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBoYXNBdHRyaWJ1dGUgPSBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmluZGV4T2YoYXR0cmlidXRlS2V5KSA+IC0xXG4gICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZSkgeyAvLyByZWdhcmQgb3B0aW9uYWwgYXR0cmlidXRlVmFsdWVcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlVmFsdWUgfHwgKG5vZGUuYXR0cmlic1thdHRyaWJ1dGVLZXldID09PSBhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gaWQ6ICcjJ1xuICAgICAgY2FzZSAvXiMvLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6IHtcbiAgICAgICAgdmFsaWRhdGUgPSAoKSA9PiB0cnVlXG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tVbml2ZXJzYWwgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4gTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gdGFnOiAnLi4uJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09IHR5cGVcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVGFnIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHNldWRvKSB7XG4gICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25cbiAgICB9XG5cbiAgICBjb25zdCBydWxlID0gcHNldWRvLm1hdGNoKC8tKGNoaWxkfHR5cGUpXFwoKFxcZCspXFwpJC8pXG4gICAgY29uc3Qga2luZCA9IHJ1bGVbMV1cbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHJ1bGVbMl0sIDEwKSAtIDFcblxuICAgIGNvbnN0IHZhbGlkYXRlUHNldWRvID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciBjb21wYXJlU2V0ID0gbm9kZS5wYXJlbnQuY2hpbGRUYWdzXG4gICAgICAgIGlmIChraW5kID09PSAndHlwZScpIHtcbiAgICAgICAgICBjb21wYXJlU2V0ID0gY29tcGFyZVNldC5maWx0ZXIodmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gY29tcGFyZVNldC5maW5kSW5kZXgoKGNoaWxkKSA9PiBjaGlsZCA9PT0gbm9kZSlcbiAgICAgICAgaWYgKG5vZGVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZW5oYW5jZUluc3RydWN0aW9uIChub2RlKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGluc3RydWN0aW9uKG5vZGUpXG4gICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoLnJlZHVjZSgoTm9kZUxpc3QsIG1hdGNoZWROb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlUHNldWRvKG1hdGNoZWROb2RlKSkge1xuICAgICAgICAgICAgTm9kZUxpc3QucHVzaChtYXRjaGVkTm9kZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgIH0sIFtdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRlUHNldWRvKG1hdGNoKSAmJiBtYXRjaFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBXYWxraW5nIHJlY3Vyc2l2ZSB0byBpbnZva2UgY2FsbGJhY2tzXG4gKlxuICogQHBhcmFtIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBub2RlcyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgICAgICBoYW5kbGVyIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZURlc2NlbmRhbnRzIChub2RlcywgaGFuZGxlcikge1xuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgdmFyIHByb2dyZXNzID0gdHJ1ZVxuICAgIGhhbmRsZXIobm9kZSwgKCkgPT4gcHJvZ3Jlc3MgPSBmYWxzZSlcbiAgICBpZiAobm9kZS5jaGlsZFRhZ3MgJiYgcHJvZ3Jlc3MpIHtcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMobm9kZS5jaGlsZFRhZ3MsIGhhbmRsZXIpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEJ1YmJsZSB1cCBmcm9tIGJvdHRvbSB0byB0b3BcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcm9vdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgdmFsaWRhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEFuY2VzdG9yIChub2RlLCByb290LCB2YWxpZGF0ZSkge1xuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBub2RlID0gbm9kZS5wYXJlbnRcbiAgICBpZiAodmFsaWRhdGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgfVxuICAgIGlmIChub2RlID09PSByb290KSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FkYXB0LmpzIiwiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnkgc2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEZvciBsb25nZXZpdHkgaXQgYXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzLlxuICovXG5pbXBvcnQgY3NzMnhwYXRoIGZyb20gJ2NzczJ4cGF0aCdcblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRTZWxlY3QsIGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5cbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IFtyb290XSAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgcm9vdCBlbGVtZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uIHwgQXJyYXkuPEhUTUxFbGVtZW50Pn0gW3NraXBdICBTcGVjaWZ5IGVsZW1lbnRzIHRvIHNraXBcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IFtwcmlvcml0eV0gICAgICAgICAgICAgIE9yZGVyIG9mIGF0dHJpYnV0ZSBwcm9jZXNzaW5nXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsIGZ1bmN0aW9uIHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbn0gW2lnbm9yZV0gRGVmaW5lIHBhdHRlcm5zIHdoaWNoIHNob3VsZG4ndCBiZSBpbmNsdWRlZFxuICogQHByb3BlcnR5IHsoJ2Nzcyd8J3hwYXRoJ3wnanF1ZXJ5Jyl9IFtmb3JtYXRdICAgICAgT3V0cHV0IGZvcm1hdCAgICBcbiAqL1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZH1cbiAgLy8gYClcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gb3B0aW1pemVkXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSBvbmx5IGFuIEFycmF5IG9mIEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBpcyBzdXBwb3J0ZWQhJylcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIGNvbnN0IGFuY2VzdG9yID0gZ2V0Q29tbW9uQW5jZXN0b3IoZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IGFuY2VzdG9yU2VsZWN0b3IgPSBnZXRTaW5nbGVTZWxlY3RvcihhbmNlc3Rvciwgb3B0aW9ucylcblxuICAvLyBUT0RPOiBjb25zaWRlciB1c2FnZSBvZiBtdWx0aXBsZSBzZWxlY3RvcnMgKyBwYXJlbnQtY2hpbGQgcmVsYXRpb24gKyBjaGVjayBmb3IgcGFydCByZWR1bmRhbmN5XG4gIGNvbnN0IGNvbW1vblNlbGVjdG9ycyA9IGdldENvbW1vblNlbGVjdG9ycyhlbGVtZW50cylcbiAgY29uc3QgZGVzY2VuZGFudFNlbGVjdG9yID0gY29tbW9uU2VsZWN0b3JzWzBdXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpbWl6ZShgJHthbmNlc3RvclNlbGVjdG9yfSAke2Rlc2NlbmRhbnRTZWxlY3Rvcn1gLCBlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0b3JNYXRjaGVzID0gY29udmVydE5vZGVMaXN0KHNlbGVjdChzZWxlY3RvcikpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhbid0IGJlIGVmZmljaWVudGx5IG1hcHBlZC5cbiAgICAgIEl0cyBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhXG4gICAgYCwgZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgc2VsZWN0b3JzIHRvIGRlc2NyaWJlIGEgc2V0IG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDb21tb25TZWxlY3RvcnMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgeyBjbGFzc2VzLCBhdHRyaWJ1dGVzLCB0YWcgfSA9IGdldENvbW1vblByb3BlcnRpZXMoZWxlbWVudHMpXG5cbiAgY29uc3Qgc2VsZWN0b3JQYXRoID0gW11cblxuICBpZiAodGFnKSB7XG4gICAgc2VsZWN0b3JQYXRoLnB1c2godGFnKVxuICB9XG5cbiAgaWYgKGNsYXNzZXMpIHtcbiAgICBjb25zdCBjbGFzc1NlbGVjdG9yID0gY2xhc3Nlcy5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goY2xhc3NTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlU2VsZWN0b3IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5yZWR1Y2UoKHBhcnRzLCBuYW1lKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKGBbJHtuYW1lfT1cIiR7YXR0cmlidXRlc1tuYW1lXX1cIl1gKVxuICAgICAgcmV0dXJuIHBhcnRzXG4gICAgfSwgW10pLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goYXR0cmlidXRlU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoc2VsZWN0b3JQYXRoLmxlbmd0aCkge1xuICAgIC8vIFRPRE86IGNoZWNrIGZvciBwYXJlbnQtY2hpbGQgcmVsYXRpb25cbiAgfVxuXG4gIHJldHVybiBbXG4gICAgc2VsZWN0b3JQYXRoLmpvaW4oJycpXG4gIF1cbn1cblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKG11bHRpcGxlL3NpbmdsZSlcbiAqXG4gKiBOT1RFOiBleHRlbmRlZCBkZXRlY3Rpb24gaXMgdXNlZCBmb3Igc3BlY2lhbCBjYXNlcyBsaWtlIHRoZSA8c2VsZWN0PiBlbGVtZW50IHdpdGggPG9wdGlvbnM+XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8Tm9kZUxpc3R8QXJyYXkuPEhUTUxFbGVtZW50Pn0gaW5wdXQgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRRdWVyeVNlbGVjdG9yIChpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICBjb25zdCByZXN1bHQgPSBnZXRTaW5nbGVTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgaWYgKG9wdGlvbnMgJiYgWzEsICd4cGF0aCddLmluY2x1ZGVzKG9wdGlvbnMuZm9ybWF0KSkge1xuICAgIHJldHVybiBjc3MyeHBhdGgocmVzdWx0KVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHhwYXRoX3RvX2xvd2VyICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICtcbiAgICAgICAgICAgICAgICAocyB8fCAnbm9ybWFsaXplLXNwYWNlKCknKSArXG4gICAgICAgICAgICAgICAgJywgXFwnQUJDREVGR0hKSUtMTU5PUFFSU1RVVldYWVpcXCcnICtcbiAgICAgICAgICAgICAgICAnLCBcXCdhYmNkZWZnaGppa2xtbm9wcXJzdHV2d3h5elxcJyknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX2VuZHNfd2l0aCAgICAgICAgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nKCcgKyBzMSArICcsJyArXG4gICAgICAgICAgICAgICAgJ3N0cmluZy1sZW5ndGgoJyArIHMxICsgJyktc3RyaW5nLWxlbmd0aCgnICsgczIgKyAnKSsxKT0nICsgczI7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsICAgICAgICAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiOi8vXCIpLFwiP1wiKSxcIj9cIiknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybF9wYXRoICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1hZnRlcignICsgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCIvXCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfZG9tYWluICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYmVmb3JlKGNvbmNhdChzdWJzdHJpbmctYWZ0ZXIoJyArXG4gICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIi9cIiksXCIvXCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfYXR0cnMgICAgICAgID0gJ0BocmVmfEBzcmMnLFxuICAgICAgeHBhdGhfbG93ZXJfY2FzZSAgICAgICA9IHhwYXRoX3RvX2xvd2VyKCksXG4gICAgICB4cGF0aF9uc191cmkgICAgICAgICAgID0gJ2FuY2VzdG9yLW9yLXNlbGY6OipbbGFzdCgpXS9AdXJsJyxcbiAgICAgIHhwYXRoX25zX3BhdGggICAgICAgICAgPSB4cGF0aF91cmxfcGF0aCh4cGF0aF91cmwoeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9oYXNfcHJvdG9jYWwgICAgID0gJyhzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcImh0dHA6Ly9cIikgb3Igc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwczovL1wiKSknLFxuICAgICAgeHBhdGhfaXNfaW50ZXJuYWwgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsKCkgKyAnLCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnKSBvciAnICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX3VybF9kb21haW4oKSwgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpKSxcbiAgICAgIHhwYXRoX2lzX2xvY2FsICAgICAgICAgPSAnKCcgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnIGFuZCBzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsKCkgKyAnLCcgKyB4cGF0aF91cmwoeHBhdGhfbnNfdXJpKSArICcpKScsXG4gICAgICB4cGF0aF9pc19wYXRoICAgICAgICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiL1wiKScsXG4gICAgICB4cGF0aF9pc19sb2NhbF9wYXRoICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJywnICsgeHBhdGhfbnNfcGF0aCArICcpJyxcbiAgICAgIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSAgPSAnbm9ybWFsaXplLXNwYWNlKCknLFxuICAgICAgeHBhdGhfaW50ZXJuYWwgICAgICAgICA9ICdbbm90KCcgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnKSBvciAnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnXScsXG4gICAgICB4cGF0aF9leHRlcm5hbCAgICAgICAgID0gJ1snICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgbm90KCcgKyB4cGF0aF9pc19pbnRlcm5hbCArICcpXScsXG4gICAgICBlc2NhcGVfbGl0ZXJhbCAgICAgICAgID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMCksXG4gICAgICBlc2NhcGVfcGFyZW5zICAgICAgICAgID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMSksXG4gICAgICByZWdleF9zdHJpbmdfbGl0ZXJhbCAgID0gLyhcIlteXCJcXHgxRV0qXCJ8J1teJ1xceDFFXSonfD1cXHMqW15cXHNcXF1cXCdcXFwiXSspL2csXG4gICAgICByZWdleF9lc2NhcGVkX2xpdGVyYWwgID0gL1snXCJdPyhcXHgxRSspWydcIl0/L2csXG4gICAgICByZWdleF9jc3Nfd3JhcF9wc2V1ZG8gID0gLyhcXHgxRlxcKXxbXlxcKV0pXFw6KGZpcnN0fGxpbWl0fGxhc3R8Z3R8bHR8ZXF8bnRoKShbXlxcLV18JCkvLFxuICAgICAgcmVnZXhfc3BlY2FsX2NoYXJzICAgICA9IC9bXFx4MUMtXFx4MUZdKy9nLFxuICAgICAgcmVnZXhfZmlyc3RfYXhpcyAgICAgICA9IC9eKFtcXHNcXChcXHgxRl0qKShcXC4/W15cXC5cXC9cXChdezEsMn1bYS16XSo6KikvLFxuICAgICAgcmVnZXhfZmlsdGVyX3ByZWZpeCAgICA9IC8oXnxcXC98XFw6KVxcWy9nLFxuICAgICAgcmVnZXhfYXR0cl9wcmVmaXggICAgICA9IC8oW15cXChcXFtcXC9cXHxcXHNcXHgxRl0pXFxAL2csXG4gICAgICByZWdleF9udGhfZXF1YXRpb24gICAgID0gL14oWy0wLTldKiluLio/KFswLTldKikkLyxcbiAgICAgIGNzc19jb21iaW5hdG9yc19yZWdleCAgPSAvXFxzKighP1srPn4sXiBdKVxccyooXFwuP1xcLyt8W2EtelxcLV0rOjopPyhbYS16XFwtXStcXCgpPygoYW5kXFxzKnxvclxccyp8bW9kXFxzKik/W14rPn4sXFxzJ1wiXFxdXFx8XFxeXFwkXFwhXFw8XFw9XFx4MUMtXFx4MUZdKyk/L2csXG4gICAgICBjc3NfY29tYmluYXRvcnNfY2FsbGJhY2sgPSBmdW5jdGlvbiAobWF0Y2gsIG9wZXJhdG9yLCBheGlzLCBmdW5jLCBsaXRlcmFsLCBleGNsdWRlLCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9ICcnOyAvLyBJZiB3ZSBjYW4sIHdlJ2xsIHByZWZpeCBhICcuJ1xuXG4gICAgICAgIC8vIFhQYXRoIG9wZXJhdG9ycyBjYW4gbG9vayBsaWtlIG5vZGUtbmFtZSBzZWxlY3RvcnNcbiAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiBhbmRcIiwgXCIgb3JcIiwgXCIgbW9kXCJcbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnICcgJiYgZXhjbHVkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF4aXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIE9ubHkgYWxsb3cgbm9kZS1zZWxlY3RpbmcgWFBhdGggZnVuY3Rpb25zXG4gICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIGNvdW50KC4uLilcIiwgXCIgY291bnQoLi4uKVwiLCBcIiA+IHBvc2l0aW9uKClcIiwgZXRjLlxuICAgICAgICAgIGlmIChmdW5jICE9PSB1bmRlZmluZWQgJiYgKGZ1bmMgIT09ICdub2RlKCcgJiYgZnVuYyAhPT0gJ3RleHQoJyAmJiBmdW5jICE9PSAnY29tbWVudCgnKSkgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGl0ZXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gZnVuYztcbiAgICAgICAgICB9IC8vIEhhbmRsZSBjYXNlIFwiICsgdGV4dCgpXCIsIFwiID4gY29tbWVudCgpXCIsIGV0Yy4gd2hlcmUgXCJmdW5jXCIgaXMgb3VyIFwibGl0ZXJhbFwiXG5cbiAgICAgICAgICAgIC8vIFhQYXRoIG1hdGggb3BlcmF0b3JzIG1hdGNoIHNvbWUgQ1NTIGNvbWJpbmF0b3JzXG4gICAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgZm9yIFwiICsgMVwiLCBcIiA+IDFcIiwgZXRjLlxuICAgICAgICAgIGlmIChpc051bWVyaWMobGl0ZXJhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJygnIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICd8JyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnOicpIHtcbiAgICAgICAgICAgIHByZWZpeCA9ICcuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gaWYgd2UgZG9uJ3QgaGF2ZSBhIHNlbGVjdG9yIHRvIGZvbGxvdyB0aGUgYXhpc1xuICAgICAgICBpZiAobGl0ZXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9mZnNldCArIG1hdGNoLmxlbmd0aCA9PT0gb3JpZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxpdGVyYWwgPSAnKic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgcmV0dXJuICcvLycgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICByZXR1cm4gJy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgcmV0dXJuIHByZWZpeCArICcvZm9sbG93aW5nLXNpYmxpbmc6OipbMV0vc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnLCc6XG4gICAgICAgICAgaWYgKGF4aXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgfVxuICAgICAgICAgIGF4aXMgPSAnLi8vJztcbiAgICAgICAgICByZXR1cm4gJ3wnICsgYXhpcyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJ14nOiAvLyBmaXJzdCBjaGlsZFxuICAgICAgICAgIHJldHVybiAnL2NoaWxkOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchXic6IC8vIGxhc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KltsYXN0KCldL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchICc6IC8vIGFuY2VzdG9yLW9yLXNlbGZcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvci1vci1zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIT4nOiAvLyBkaXJlY3QgcGFyZW50XG4gICAgICAgICAgcmV0dXJuICcvcGFyZW50OjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISsnOiAvLyBhZGphY2VudCBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchfic6IC8vIHByZWNlZGluZyBzaWJsaW5nXG4gICAgICAgICAgcmV0dXJuICcvcHJlY2VkaW5nLXNpYmxpbmc6OicgKyBsaXRlcmFsO1xuICAgICAgICAgICAgLy8gY2FzZSAnfn4nXG4gICAgICAgICAgICAvLyByZXR1cm4gJy9mb2xsb3dpbmctc2libGluZzo6Ki9zZWxmOjp8JytzZWxlY3RvclN0YXJ0KG9yaWcsIG9mZnNldCkrJy9wcmVjZWRpbmctc2libGluZzo6Ki9zZWxmOjonK2xpdGVyYWw7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGNzc19hdHRyaWJ1dGVzX3JlZ2V4ID0gL1xcWyhbXlxcQFxcfFxcKlxcPVxcXlxcflxcJFxcIVxcKFxcL1xcc1xceDFDLVxceDFGXSspXFxzKigoW1xcfFxcKlxcflxcXlxcJFxcIV0/KT0/XFxzKihcXHgxRSspKT9cXF0vZyxcbiAgICAgIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrID0gZnVuY3Rpb24gKHN0ciwgYXR0ciwgY29tcCwgb3AsIHZhbCwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBheGlzID0gJyc7XG4gICAgICAgIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldCAtIDEpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChwcmV2Q2hhciA9PT0gJy8nIHx8IC8vIGZvdW5kIGFmdGVyIGFuIGF4aXMgc2hvcnRjdXQgKFwiL1wiLCBcIi8vXCIsIGV0Yy4pXG4gICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSAgIC8vIGZvdW5kIGFmdGVyIGFuIGF4aXMgKFwic2VsZjo6XCIsIFwicGFyZW50OjpcIiwgZXRjLilcbiAgICAgICAgICAgIGF4aXMgPSAnKic7Ki9cblxuICAgICAgICBzd2l0Y2ggKG9wKSB7XG4gICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tub3QoQCcgKyBhdHRyICsgJykgb3IgQCcgKyBhdHRyICsgJyE9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tzdWJzdHJpbmcoQCcgKyBhdHRyICsgJyxzdHJpbmctbGVuZ3RoKEAnICsgYXR0ciArICcpLShzdHJpbmctbGVuZ3RoKFwiJyArIHZhbCArICdcIiktMSkpPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3RhcnRzLXdpdGgoQCcgKyBhdHRyICsgJyxcIicgKyB2YWwgKyAnXCIpXSc7XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEAnICsgYXR0ciArICcpLFwiIFwiKSxjb25jYXQoXCIgXCIsXCInICsgdmFsICsgJ1wiLFwiIFwiKSldJztcbiAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQCcgKyBhdHRyICsgJz1cIicgKyB2YWwgKyAnXCIgb3Igc3RhcnRzLXdpdGgoQCcgKyBhdHRyICsgJyxjb25jYXQoXCInICsgdmFsICsgJ1wiLFwiLVwiKSldJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoY29tcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoYXR0ci5jaGFyQXQoYXR0ci5sZW5ndGggLSAxKSA9PT0gJygnIHx8IGF0dHIuc2VhcmNoKC9eWzAtOV0rJC8pICE9PSAtMSB8fCBhdHRyLmluZGV4T2YoJzonKSAhPT0gLTEpICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICddJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXggPSAvOihbYS16XFwtXSspKFxcKChcXHgxRispKChbXlxceDFGXSsoXFwzXFx4MUYrKT8pKikoXFwzXFwpKSk/L2csXG4gICAgICBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2sgPSBmdW5jdGlvbiAobWF0Y2gsIG5hbWUsIGcxLCBnMiwgYXJnLCBnMywgZzQsIGc1LCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgaWYgKG9yaWcuY2hhckF0KG9mZnNldCAtIDEpID09PSAnOicgJiYgb3JpZy5jaGFyQXQob2Zmc2V0IC0gMikgIT09ICc6Jykge1xuICAgICAgICAgICAgLy8gWFBhdGggXCJheGlzOjpub2RlLW5hbWVcIiB3aWxsIG1hdGNoXG4gICAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgXCI6bm9kZS1uYW1lXCJcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ29kZCcgfHwgbmFtZSA9PT0gJ2V2ZW4nKSB7XG4gICAgICAgICAgYXJnICA9IG5hbWU7XG4gICAgICAgICAgbmFtZSA9ICdudGgtb2YtdHlwZSc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHsgLy8gbmFtZS50b0xvd2VyQ2FzZSgpP1xuICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdhZnRlci1zaWJsaW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdmb2xsb3dpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZS1zaWJsaW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdmb2xsb3dpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnY2hlY2tlZCc6XG4gICAgICAgICAgcmV0dXJuICdbQHNlbGVjdGVkIG9yIEBjaGVja2VkXSc7XG4gICAgICAgIGNhc2UgJ2NvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb250YWlucygnICsgeHBhdGhfbm9ybWFsaXplX3NwYWNlICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAnaWNvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb250YWlucygnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KCopIGFuZCBub3Qobm9ybWFsaXplLXNwYWNlKCkpXSc7XG4gICAgICAgIGNhc2UgJ2VuYWJsZWQnOlxuICAgICAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBjYXNlICdmaXJzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdmaXJzdCc6XG4gICAgICAgIGNhc2UgJ2xpbWl0JzpcbiAgICAgICAgY2FzZSAnZmlyc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKTw9JyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbMV0nO1xuICAgICAgICBjYXNlICdndCc6XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+JyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICBjYXNlICdsdCc6XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8JyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICBjYXNlICdsYXN0LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KikgYW5kIG5vdChmb2xsb3dpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnb25seS1vZi10eXBlJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OipbbmFtZSgpPW5hbWUoc2VsZjo6bm9kZSgpKV0pIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OipbbmFtZSgpPW5hbWUoc2VsZjo6bm9kZSgpKV0pXSc7XG4gICAgICAgIGNhc2UgJ250aC1jaGlsZCc6XG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSA9ICcgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnZXZlbic6XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpIG1vZCAyPTBdJztcbiAgICAgICAgICBjYXNlICdvZGQnOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0xXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpPj0nICsgYVsxXSArICcgYW5kICgoY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdudGgtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3dpdGNoIChhcmcpIHtcbiAgICAgICAgICBjYXNlICdvZGQnOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0xXSc7XG4gICAgICAgICAgY2FzZSAnZXZlbic6XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpIG1vZCAyPTAgYW5kIHBvc2l0aW9uKCk+PTBdJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIGEgPSAoYXJnIHx8ICcwJykucmVwbGFjZShyZWdleF9udGhfZXF1YXRpb24sICckMSskMicpLnNwbGl0KCcrJyk7XG5cbiAgICAgICAgICAgIGFbMF0gPSBhWzBdIHx8ICcxJztcbiAgICAgICAgICAgIGFbMV0gPSBhWzFdIHx8ICcwJztcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+PScgKyBhWzFdICsgJyBhbmQgKHBvc2l0aW9uKCktJyArIGFbMV0gKyAnKSBtb2QgJyArIGFbMF0gKyAnPTBdJztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VxJzpcbiAgICAgICAgY2FzZSAnbnRoJzpcbiAgICAgICAgICAvLyBQb3NpdGlvbiBzdGFydHMgYXQgMCBmb3IgY29uc2lzdGVuY3kgd2l0aCBTaXp6bGUgc2VsZWN0b3JzXG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgKHBhcnNlSW50KGFyZywgMTApICsgMSkgKyAnXSc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICdbMV0nO1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICByZXR1cm4gJ1tAdHlwZT1cInRleHRcIl0nO1xuICAgICAgICBjYXNlICdpc3RhcnRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF9sb3dlcl9jYXNlICsgJywnICsgeHBhdGhfdG9fbG93ZXIoYXJnKSArICcpXSc7XG4gICAgICAgIGNhc2UgJ3N0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbm9ybWFsaXplX3NwYWNlICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAnaWVuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9sb3dlcl9jYXNlLCB4cGF0aF90b19sb3dlcihhcmcpKSArICddJztcbiAgICAgICAgY2FzZSAnZW5kcy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1snICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX25vcm1hbGl6ZV9zcGFjZSwgYXJnKSArICddJztcbiAgICAgICAgY2FzZSAnaGFzJzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBwcmVwZW5kQXhpcyhjc3MyeHBhdGgoYXJnLCB0cnVlKSwgJy4vLycpO1xuXG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIHhwYXRoICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1zaWJsaW5nJzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBjc3MyeHBhdGgoJ3ByZWNlZGluZy1zaWJsaW5nOjonICsgYXJnLCB0cnVlKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMCBvciBjb3VudChmb2xsb3dpbmctc2libGluZzo6JyArIHhwYXRoLnN1YnN0cigxOSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLXBhcmVudCc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncGFyZW50OjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtYW5jZXN0b3InOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ2FuY2VzdG9yOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdsYXN0JzpcbiAgICAgICAgY2FzZSAnbGFzdC1vZi10eXBlJzpcbiAgICAgICAgICBpZiAoYXJnICE9PSB1bmRlZmluZWQpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPmxhc3QoKS0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tsYXN0KCldJztcbiAgICAgICAgY2FzZSAnc2VsZWN0ZWQnOiAvLyBTaXp6bGU6IFwiKG9wdGlvbikgZWxlbWVudHMgdGhhdCBhcmUgY3VycmVudGx5IHNlbGVjdGVkXCJcbiAgICAgICAgICByZXR1cm4gJ1tsb2NhbC1uYW1lKCk9XCJvcHRpb25cIiBhbmQgQHNlbGVjdGVkXSc7XG4gICAgICAgIGNhc2UgJ3NraXAnOlxuICAgICAgICBjYXNlICdza2lwLWZpcnN0JzpcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyBhcmcgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3NraXAtbGFzdCc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbbGFzdCgpLXBvc2l0aW9uKCk+PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8bGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnL2FuY2VzdG9yOjpbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICB2YXIgYXJyID0gYXJnLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICByZXR1cm4gJ1snICsgYXJyWzBdICsgJzw9cG9zaXRpb24oKSBhbmQgcG9zaXRpb24oKTw9JyArIGFyclsxXSArICddJztcbiAgICAgICAgY2FzZSAnaW5wdXQnOiAvLyBTaXp6bGU6IFwiaW5wdXQsIGJ1dHRvbiwgc2VsZWN0LCBhbmQgdGV4dGFyZWEgYXJlIGFsbCBjb25zaWRlcmVkIHRvIGJlIGlucHV0IGVsZW1lbnRzLlwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwiaW5wdXRcIiBvciBsb2NhbC1uYW1lKCk9XCJidXR0b25cIiBvciBsb2NhbC1uYW1lKCk9XCJzZWxlY3RcIiBvciBsb2NhbC1uYW1lKCk9XCJ0ZXh0YXJlYVwiXSc7XG4gICAgICAgIGNhc2UgJ2ludGVybmFsJzpcbiAgICAgICAgICByZXR1cm4geHBhdGhfaW50ZXJuYWw7XG4gICAgICAgIGNhc2UgJ2V4dGVybmFsJzpcbiAgICAgICAgICByZXR1cm4geHBhdGhfZXh0ZXJuYWw7XG4gICAgICAgIGNhc2UgJ2h0dHAnOlxuICAgICAgICBjYXNlICdodHRwcyc6XG4gICAgICAgIGNhc2UgJ21haWx0byc6XG4gICAgICAgIGNhc2UgJ2phdmFzY3JpcHQnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKEBocmVmLGNvbmNhdChcIicgKyBuYW1lICsgJ1wiLFwiOlwiKSldJztcbiAgICAgICAgY2FzZSAnZG9tYWluJzpcbiAgICAgICAgICByZXR1cm4gJ1soc3RyaW5nLWxlbmd0aCgnICsgeHBhdGhfdXJsX2RvbWFpbigpICsgJyk9MCBhbmQgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSArICcsJyArIGFyZyArICcpKSBvciBjb250YWlucygnICsgeHBhdGhfdXJsX2RvbWFpbigpICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9wYXRoKCkgKyAnLHN1YnN0cmluZy1hZnRlcihcIicgKyBhcmcgKyAnXCIsXCIvXCIpKV0nXG4gICAgICAgIGNhc2UgJ25vdCc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoeHBhdGguY2hhckF0KDApID09PSAnWycpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICB4cGF0aCA9ICdzZWxmOjpub2RlKCknICsgeHBhdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW25vdCgnICsgeHBhdGggKyAnKV0nO1xuICAgICAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKEBocmVmLCBcIiNcIildJztcbiAgICAgICAgY2FzZSAncm9vdCc6XG4gICAgICAgICAgcmV0dXJuICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0nO1xuICAgICAgICAgICAgLyogY2FzZSAnYWN0aXZlJzpcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzpcbiAgICAgICAgICAgIGNhc2UgJ2hvdmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2xpbmsnOlxuICAgICAgICAgICAgY2FzZSAndmlzaXRlZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnOyovXG4gICAgICAgIGNhc2UgJ2xhbmcnOlxuICAgICAgICAgIHJldHVybiAnW0BsYW5nPVwiJyArIGFyZyArICdcIl0nO1xuICAgICAgICBjYXNlICdyZWFkLW9ubHknOlxuICAgICAgICBjYXNlICdyZWFkLXdyaXRlJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUucmVwbGFjZSgnLScsICcnKSArICddJztcbiAgICAgICAgY2FzZSAndmFsaWQnOlxuICAgICAgICBjYXNlICdyZXF1aXJlZCc6XG4gICAgICAgIGNhc2UgJ2luLXJhbmdlJzpcbiAgICAgICAgY2FzZSAnb3V0LW9mLXJhbmdlJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUgKyAnXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfaWRzX2NsYXNzZXNfcmVnZXggPSAvKCN8XFwuKShbXlxcI1xcQFxcLlxcL1xcKFxcW1xcKVxcXVxcfFxcOlxcc1xcK1xcPlxcPFxcJ1xcXCJcXHgxRC1cXHgxRl0rKS9nLFxuICAgICAgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKHN0ciwgb3AsIHZhbCwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBheGlzID0gJyc7XG4gICAgICAgIC8qIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldC0xKTtcbiAgICAgICAgaWYgKHByZXZDaGFyLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICcvJyB8fFxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJylcbiAgICAgICAgICAgIGF4aXMgPSAnKic7XG4gICAgICAgIGVsc2UgaWYgKHByZXZDaGFyID09PSAnOicpXG4gICAgICAgICAgICBheGlzID0gJ25vZGUoKSc7Ki9cbiAgICAgICAgaWYgKG9wID09PSAnIycpICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAaWQ9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKGNvbmNhdChcIiBcIixub3JtYWxpemUtc3BhY2UoQGNsYXNzKSxcIiBcIiksXCIgJyArIHZhbCArICcgXCIpXSc7XG4gICAgICB9O1xuXG4gICAgLy8gUHJlcGVuZCBkZXNjZW5kYW50LW9yLXNlbGYgaWYgbm8gb3RoZXIgYXhpcyBpcyBzcGVjaWZpZWRcbiAgZnVuY3Rpb24gcHJlcGVuZEF4aXMocywgYXhpcykge1xuICAgIHJldHVybiBzLnJlcGxhY2UocmVnZXhfZmlyc3RfYXhpcywgZnVuY3Rpb24gKG1hdGNoLCBzdGFydCwgbGl0ZXJhbCkge1xuICAgICAgaWYgKGxpdGVyYWwuc3Vic3RyKGxpdGVyYWwubGVuZ3RoIC0gMikgPT09ICc6OicpIC8vIEFscmVhZHkgaGFzIGF4aXM6OlxuICAgICAgICAgICAge1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChsaXRlcmFsLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgIHtcbiAgICAgICAgYXhpcyArPSAnKic7XG4gICAgICB9XG4gICAgICAgIC8vIGVsc2UgaWYgKGF4aXMuY2hhckF0KGF4aXMubGVuZ3RoLTEpID09PSAnKScpXG4gICAgICAgIC8vICAgIGF4aXMgKz0gJy8nO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgYXhpcyArIGxpdGVyYWw7XG4gICAgfSk7XG4gIH1cblxuICAgIC8vIEZpbmQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzZWxlY3Rvciwgc3RhcnRpbmcgYXQgaSBhbmQgd29ya2luZyBiYWNrd2FyZHNcbiAgZnVuY3Rpb24gc2VsZWN0b3JTdGFydChzLCBpKSB7XG4gICAgdmFyIGRlcHRoID0gMDtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHN3aXRjaCAocy5jaGFyQXQoaSkpIHtcbiAgICAgIGNhc2UgJyAnOlxuICAgICAgY2FzZSBlc2NhcGVfcGFyZW5zOlxuICAgICAgICBvZmZzZXQrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdbJzpcbiAgICAgIGNhc2UgJygnOlxuICAgICAgICBkZXB0aC0tO1xuXG4gICAgICAgIGlmIChkZXB0aCA8IDApICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuICsraSArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ10nOlxuICAgICAgY2FzZSAnKSc6XG4gICAgICAgIGRlcHRoKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLCc6XG4gICAgICBjYXNlICd8JzpcbiAgICAgICAgaWYgKGRlcHRoID09PSAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG9mZnNldCA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAgIC8vIENoZWNrIGlmIHN0cmluZyBpcyBudW1lcmljXG4gIGZ1bmN0aW9uIGlzTnVtZXJpYyhzKSB7XG4gICAgdmFyIG51bSA9IHBhcnNlSW50KHMsIDEwKTtcblxuICAgIHJldHVybiAoIWlzTmFOKG51bSkgJiYgJycgKyBudW0gPT09IHMpO1xuICB9XG5cbiAgICAvLyBBcHBlbmQgZXNjYXBlIFwiY2hhclwiIHRvIFwib3BlblwiIG9yIFwiY2xvc2VcIlxuICBmdW5jdGlvbiBlc2NhcGVDaGFyKHMsIG9wZW4sIGNsb3NlLCBjaGFyKSB7XG4gICAgdmFyIGRlcHRoID0gMDtcblxuICAgIHJldHVybiBzLnJlcGxhY2UobmV3IFJlZ0V4cCgnW1xcXFwnICsgb3BlbiArICdcXFxcJyArIGNsb3NlICsgJ10nLCAnZycpLCBmdW5jdGlvbiAoYSkge1xuICAgICAgaWYgKGEgPT09IG9wZW4pICAgICAgICAgICAge1xuICAgICAgICBkZXB0aCsrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYSA9PT0gb3Blbikge1xuICAgICAgICByZXR1cm4gYSArIHJlcGVhdChjaGFyLCBkZXB0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVwZWF0KGNoYXIsIGRlcHRoLS0pICsgYTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVwZWF0KHN0ciwgbnVtKSB7XG4gICAgbnVtID0gTnVtYmVyKG51bSk7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChudW0gJiAxKSAgICAgICAgICAgIHtcbiAgICAgICAgcmVzdWx0ICs9IHN0cjtcbiAgICAgIH1cbiAgICAgIG51bSA+Pj49IDE7XG5cbiAgICAgIGlmIChudW0gPD0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN0ciArPSBzdHI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRFc2NhcGluZyAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvXFxcXChbYFxcXFwvOlxcPyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dKS9nLCAnJDEnKVxuICAgICAgLnJlcGxhY2UoL1xcXFwoWydcIl0pL2csICckMSQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcQSAvZywgJ1xcbicpXG4gIH1cblxuICBmdW5jdGlvbiBjc3MyeHBhdGgocywgbmVzdGVkKSB7XG4gICAgLy8gcyA9IHMudHJpbSgpO1xuXG4gICAgaWYgKG5lc3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBSZXBsYWNlIDpwc2V1ZG8tY2xhc3Nlc1xuICAgICAgcyA9IHMucmVwbGFjZShjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXgsIGNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSAjaWRzIGFuZCAuY2xhc3Nlc1xuICAgICAgcyA9IHMucmVwbGFjZShjc3NfaWRzX2NsYXNzZXNfcmVnZXgsIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIC8vIFRhZyBvcGVuIGFuZCBjbG9zZSBwYXJlbnRoZXNpcyBwYWlycyAoZm9yIFJlZ0V4cCBzZWFyY2hlcylcbiAgICBzID0gZXNjYXBlQ2hhcihzLCAnKCcsICcpJywgZXNjYXBlX3BhcmVucyk7XG5cbiAgICAvLyBSZW1vdmUgYW5kIHNhdmUgYW55IHN0cmluZyBsaXRlcmFsc1xuICAgIHZhciBsaXRlcmFscyA9IFtdO1xuXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9zdHJpbmdfbGl0ZXJhbCwgZnVuY3Rpb24gKHMsIGEpIHtcbiAgICAgIGlmIChhLmNoYXJBdCgwKSA9PT0gJz0nKSB7XG4gICAgICAgIGEgPSBhLnN1YnN0cigxKS50cmltKCk7XG5cbiAgICAgICAgaWYgKGlzTnVtZXJpYyhhKSkgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSwgYS5sZW5ndGggLSAyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcGVhdChlc2NhcGVfbGl0ZXJhbCwgbGl0ZXJhbHMucHVzaChjb252ZXJ0RXNjYXBpbmcoYSkpKTtcbiAgICB9KTtcblxuICAgIC8vIFJlcGxhY2UgQ1NTIGNvbWJpbmF0b3JzIChcIiBcIiwgXCIrXCIsIFwiPlwiLCBcIn5cIiwgXCIsXCIpIGFuZCByZXZlcnNlIGNvbWJpbmF0b3JzIChcIiFcIiwgXCIhK1wiLCBcIiE+XCIsIFwiIX5cIilcbiAgICBzID0gcy5yZXBsYWNlKGNzc19jb21iaW5hdG9yc19yZWdleCwgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgQ1NTIGF0dHJpYnV0ZSBmaWx0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShjc3NfYXR0cmlidXRlc19yZWdleCwgY3NzX2F0dHJpYnV0ZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gV3JhcCBjZXJ0YWluIDpwc2V1ZG8tY2xhc3NlcyBpbiBwYXJlbnMgKHRvIGNvbGxlY3Qgbm9kZS1zZXRzKVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgaW5kZXggPSBzLnNlYXJjaChyZWdleF9jc3Nfd3JhcF9wc2V1ZG8pO1xuXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBzLmluZGV4T2YoJzonLCBpbmRleCk7XG4gICAgICB2YXIgc3RhcnQgPSBzZWxlY3RvclN0YXJ0KHMsIGluZGV4KTtcblxuICAgICAgcyA9IHMuc3Vic3RyKDAsIHN0YXJ0KSArXG4gICAgICAgICAgICAnKCcgKyBzLnN1YnN0cmluZyhzdGFydCwgaW5kZXgpICsgJyknICtcbiAgICAgICAgICAgIHMuc3Vic3RyKGluZGV4KTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIDpwc2V1ZG8tY2xhc3Nlc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVwbGFjZSAjaWRzIGFuZCAuY2xhc3Nlc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVzdG9yZSB0aGUgc2F2ZWQgc3RyaW5nIGxpdGVyYWxzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9lc2NhcGVkX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICB2YXIgc3RyID0gbGl0ZXJhbHNbYS5sZW5ndGggLSAxXTtcblxuICAgICAgcmV0dXJuICdcIicgKyBzdHIgKyAnXCInO1xuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgYW55IHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3BlY2FsX2NoYXJzLCAnJyk7XG5cbiAgICAvLyBhZGQgKiB0byBzdGFuZC1hbG9uZSBmaWx0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9maWx0ZXJfcHJlZml4LCAnJDEqWycpO1xuXG4gICAgLy8gYWRkIFwiL1wiIGJldHdlZW4gQGF0dHJpYnV0ZSBzZWxlY3RvcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X2F0dHJfcHJlZml4LCAnJDEvQCcpO1xuXG4gICAgLypcbiAgICBDb21iaW5lIG11bHRpcGxlIGZpbHRlcnM/XG5cbiAgICBzID0gZXNjYXBlQ2hhcihzLCAnWycsICddJywgZmlsdGVyX2NoYXIpO1xuICAgIHMgPSBzLnJlcGxhY2UoLyhcXHgxRCspXFxdXFxbXFwxKC4rP1teXFx4MURdKVxcMVxcXS9nLCAnIGFuZCAoJDIpJDFdJylcbiAgICAqL1xuXG4gICAgcyA9IHByZXBlbmRBeGlzKHMsICcuLy8nKTsgLy8gcHJlcGVuZCBcIi4vL1wiIGF4aXMgdG8gYmVnaW5pbmcgb2YgQ1NTIHNlbGVjdG9yXG4gICAgcmV0dXJuIHM7XG4gIH1cblxuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjc3MyeHBhdGg7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmNzczJ4cGF0aCA9IGNzczJ4cGF0aDtcbiAgfVxuXG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9jc3MyeHBhdGgvaW5kZXguanMiLCIvKiFcbiAqIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIHYyLjMuNlxuICogaHR0cHM6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2pzLmZvdW5kYXRpb24vXG4gKlxuICogRGF0ZTogMjAyMS0wMi0xNlxuICovXG4oIGZ1bmN0aW9uKCB3aW5kb3cgKSB7XG52YXIgaSxcblx0c3VwcG9ydCxcblx0RXhwcixcblx0Z2V0VGV4dCxcblx0aXNYTUwsXG5cdHRva2VuaXplLFxuXHRjb21waWxlLFxuXHRzZWxlY3QsXG5cdG91dGVybW9zdENvbnRleHQsXG5cdHNvcnRJbnB1dCxcblx0aGFzRHVwbGljYXRlLFxuXG5cdC8vIExvY2FsIGRvY3VtZW50IHZhcnNcblx0c2V0RG9jdW1lbnQsXG5cdGRvY3VtZW50LFxuXHRkb2NFbGVtLFxuXHRkb2N1bWVudElzSFRNTCxcblx0cmJ1Z2d5UVNBLFxuXHRyYnVnZ3lNYXRjaGVzLFxuXHRtYXRjaGVzLFxuXHRjb250YWlucyxcblxuXHQvLyBJbnN0YW5jZS1zcGVjaWZpYyBkYXRhXG5cdGV4cGFuZG8gPSBcInNpenpsZVwiICsgMSAqIG5ldyBEYXRlKCksXG5cdHByZWZlcnJlZERvYyA9IHdpbmRvdy5kb2N1bWVudCxcblx0ZGlycnVucyA9IDAsXG5cdGRvbmUgPSAwLFxuXHRjbGFzc0NhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0dG9rZW5DYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdGNvbXBpbGVyQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRub25uYXRpdmVTZWxlY3RvckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIDA7XG5cdH0sXG5cblx0Ly8gSW5zdGFuY2UgbWV0aG9kc1xuXHRoYXNPd24gPSAoIHt9ICkuaGFzT3duUHJvcGVydHksXG5cdGFyciA9IFtdLFxuXHRwb3AgPSBhcnIucG9wLFxuXHRwdXNoTmF0aXZlID0gYXJyLnB1c2gsXG5cdHB1c2ggPSBhcnIucHVzaCxcblx0c2xpY2UgPSBhcnIuc2xpY2UsXG5cblx0Ly8gVXNlIGEgc3RyaXBwZWQtZG93biBpbmRleE9mIGFzIGl0J3MgZmFzdGVyIHRoYW4gbmF0aXZlXG5cdC8vIGh0dHBzOi8vanNwZXJmLmNvbS90aG9yLWluZGV4b2YtdnMtZm9yLzVcblx0aW5kZXhPZiA9IGZ1bmN0aW9uKCBsaXN0LCBlbGVtICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdGxlbiA9IGxpc3QubGVuZ3RoO1xuXHRcdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0aWYgKCBsaXN0WyBpIF0gPT09IGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH0sXG5cblx0Ym9vbGVhbnMgPSBcImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxcIiArXG5cdFx0XCJpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsXG5cblx0Ly8gUmVndWxhciBleHByZXNzaW9uc1xuXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtc2VsZWN0b3JzLyN3aGl0ZXNwYWNlXG5cdHdoaXRlc3BhY2UgPSBcIltcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdXCIsXG5cblx0Ly8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2Nzcy1zeW50YXgtMy8jaWRlbnQtdG9rZW4tZGlhZ3JhbVxuXHRpZGVudGlmaWVyID0gXCIoPzpcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCI/fFxcXFxcXFxcW15cXFxcclxcXFxuXFxcXGZdfFtcXFxcdy1dfFteXFwwLVxcXFx4N2ZdKStcIixcblxuXHQvLyBBdHRyaWJ1dGUgc2VsZWN0b3JzOiBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2F0dHJpYnV0ZS1zZWxlY3RvcnNcblx0YXR0cmlidXRlcyA9IFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XCIgKyB3aGl0ZXNwYWNlICtcblxuXHRcdC8vIE9wZXJhdG9yIChjYXB0dXJlIDIpXG5cdFx0XCIqKFsqXiR8IX5dPz0pXCIgKyB3aGl0ZXNwYWNlICtcblxuXHRcdC8vIFwiQXR0cmlidXRlIHZhbHVlcyBtdXN0IGJlIENTUyBpZGVudGlmaWVycyBbY2FwdHVyZSA1XVxuXHRcdC8vIG9yIHN0cmluZ3MgW2NhcHR1cmUgMyBvciBjYXB0dXJlIDRdXCJcblx0XHRcIiooPzonKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCJ8KFwiICsgaWRlbnRpZmllciArIFwiKSl8KVwiICtcblx0XHR3aGl0ZXNwYWNlICsgXCIqXFxcXF1cIixcblxuXHRwc2V1ZG9zID0gXCI6KFwiICsgaWRlbnRpZmllciArIFwiKSg/OlxcXFwoKFwiICtcblxuXHRcdC8vIFRvIHJlZHVjZSB0aGUgbnVtYmVyIG9mIHNlbGVjdG9ycyBuZWVkaW5nIHRva2VuaXplIGluIHRoZSBwcmVGaWx0ZXIsIHByZWZlciBhcmd1bWVudHM6XG5cdFx0Ly8gMS4gcXVvdGVkIChjYXB0dXJlIDM7IGNhcHR1cmUgNCBvciBjYXB0dXJlIDUpXG5cdFx0XCIoJygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwiKXxcIiArXG5cblx0XHQvLyAyLiBzaW1wbGUgKGNhcHR1cmUgNilcblx0XHRcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXCgpW1xcXFxdXXxcIiArIGF0dHJpYnV0ZXMgKyBcIikqKXxcIiArXG5cblx0XHQvLyAzLiBhbnl0aGluZyBlbHNlIChjYXB0dXJlIDIpXG5cdFx0XCIuKlwiICtcblx0XHRcIilcXFxcKXwpXCIsXG5cblx0Ly8gTGVhZGluZyBhbmQgbm9uLWVzY2FwZWQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgY2FwdHVyaW5nIHNvbWUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVycyBwcmVjZWRpbmcgdGhlIGxhdHRlclxuXHRyd2hpdGVzcGFjZSA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcIitcIiwgXCJnXCIgKSxcblx0cnRyaW0gPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIgK1xuXHRcdHdoaXRlc3BhY2UgKyBcIiskXCIsIFwiZ1wiICksXG5cblx0cmNvbW1hID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqLFwiICsgd2hpdGVzcGFjZSArIFwiKlwiICksXG5cdHJjb21iaW5hdG9ycyA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKihbPit+XXxcIiArIHdoaXRlc3BhY2UgKyBcIilcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFwiKlwiICksXG5cdHJkZXNjZW5kID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwifD5cIiApLFxuXG5cdHJwc2V1ZG8gPSBuZXcgUmVnRXhwKCBwc2V1ZG9zICksXG5cdHJpZGVudGlmaWVyID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBpZGVudGlmaWVyICsgXCIkXCIgKSxcblxuXHRtYXRjaEV4cHIgPSB7XG5cdFx0XCJJRFwiOiBuZXcgUmVnRXhwKCBcIl4jKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJDTEFTU1wiOiBuZXcgUmVnRXhwKCBcIl5cXFxcLihcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiVEFHXCI6IG5ldyBSZWdFeHAoIFwiXihcIiArIGlkZW50aWZpZXIgKyBcInxbKl0pXCIgKSxcblx0XHRcIkFUVFJcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBhdHRyaWJ1dGVzICksXG5cdFx0XCJQU0VVRE9cIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBwc2V1ZG9zICksXG5cdFx0XCJDSElMRFwiOiBuZXcgUmVnRXhwKCBcIl46KG9ubHl8Zmlyc3R8bGFzdHxudGh8bnRoLWxhc3QpLShjaGlsZHxvZi10eXBlKSg/OlxcXFwoXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86KFsrLV18KVwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooXFxcXGQrKXwpKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfClcIiwgXCJpXCIgKSxcblx0XHRcImJvb2xcIjogbmV3IFJlZ0V4cCggXCJeKD86XCIgKyBib29sZWFucyArIFwiKSRcIiwgXCJpXCIgKSxcblxuXHRcdC8vIEZvciB1c2UgaW4gbGlicmFyaWVzIGltcGxlbWVudGluZyAuaXMoKVxuXHRcdC8vIFdlIHVzZSB0aGlzIGZvciBQT1MgbWF0Y2hpbmcgaW4gYHNlbGVjdGBcblx0XHRcIm5lZWRzQ29udGV4dFwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIiooKD86LVxcXFxkKT9cXFxcZCopXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KSg/PVteLV18JClcIiwgXCJpXCIgKVxuXHR9LFxuXG5cdHJodG1sID0gL0hUTUwkL2ksXG5cdHJpbnB1dHMgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFxuXHRyaGVhZGVyID0gL15oXFxkJC9pLFxuXG5cdHJuYXRpdmUgPSAvXltee10rXFx7XFxzKlxcW25hdGl2ZSBcXHcvLFxuXG5cdC8vIEVhc2lseS1wYXJzZWFibGUvcmV0cmlldmFibGUgSUQgb3IgVEFHIG9yIENMQVNTIHNlbGVjdG9yc1xuXHRycXVpY2tFeHByID0gL14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sXG5cblx0cnNpYmxpbmcgPSAvWyt+XS8sXG5cblx0Ly8gQ1NTIGVzY2FwZXNcblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMjEvc3luZGF0YS5odG1sI2VzY2FwZWQtY2hhcmFjdGVyc1xuXHRydW5lc2NhcGUgPSBuZXcgUmVnRXhwKCBcIlxcXFxcXFxcW1xcXFxkYS1mQS1GXXsxLDZ9XCIgKyB3aGl0ZXNwYWNlICsgXCI/fFxcXFxcXFxcKFteXFxcXHJcXFxcblxcXFxmXSlcIiwgXCJnXCIgKSxcblx0ZnVuZXNjYXBlID0gZnVuY3Rpb24oIGVzY2FwZSwgbm9uSGV4ICkge1xuXHRcdHZhciBoaWdoID0gXCIweFwiICsgZXNjYXBlLnNsaWNlKCAxICkgLSAweDEwMDAwO1xuXG5cdFx0cmV0dXJuIG5vbkhleCA/XG5cblx0XHRcdC8vIFN0cmlwIHRoZSBiYWNrc2xhc2ggcHJlZml4IGZyb20gYSBub24taGV4IGVzY2FwZSBzZXF1ZW5jZVxuXHRcdFx0bm9uSGV4IDpcblxuXHRcdFx0Ly8gUmVwbGFjZSBhIGhleGFkZWNpbWFsIGVzY2FwZSBzZXF1ZW5jZSB3aXRoIHRoZSBlbmNvZGVkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgPD0xMStcblx0XHRcdC8vIEZvciB2YWx1ZXMgb3V0c2lkZSB0aGUgQmFzaWMgTXVsdGlsaW5ndWFsIFBsYW5lIChCTVApLCBtYW51YWxseSBjb25zdHJ1Y3QgYVxuXHRcdFx0Ly8gc3Vycm9nYXRlIHBhaXJcblx0XHRcdGhpZ2ggPCAwID9cblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCArIDB4MTAwMDAgKSA6XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggPj4gMTAgfCAweEQ4MDAsIGhpZ2ggJiAweDNGRiB8IDB4REMwMCApO1xuXHR9LFxuXG5cdC8vIENTUyBzdHJpbmcvaWRlbnRpZmllciBzZXJpYWxpemF0aW9uXG5cdC8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3NvbS8jY29tbW9uLXNlcmlhbGl6aW5nLWlkaW9tc1xuXHRyY3NzZXNjYXBlID0gLyhbXFwwLVxceDFmXFx4N2ZdfF4tP1xcZCl8Xi0kfFteXFwwLVxceDFmXFx4N2YtXFx1RkZGRlxcdy1dL2csXG5cdGZjc3Nlc2NhcGUgPSBmdW5jdGlvbiggY2gsIGFzQ29kZVBvaW50ICkge1xuXHRcdGlmICggYXNDb2RlUG9pbnQgKSB7XG5cblx0XHRcdC8vIFUrMDAwMCBOVUxMIGJlY29tZXMgVStGRkZEIFJFUExBQ0VNRU5UIENIQVJBQ1RFUlxuXHRcdFx0aWYgKCBjaCA9PT0gXCJcXDBcIiApIHtcblx0XHRcdFx0cmV0dXJuIFwiXFx1RkZGRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb250cm9sIGNoYXJhY3RlcnMgYW5kIChkZXBlbmRlbnQgdXBvbiBwb3NpdGlvbikgbnVtYmVycyBnZXQgZXNjYXBlZCBhcyBjb2RlIHBvaW50c1xuXHRcdFx0cmV0dXJuIGNoLnNsaWNlKCAwLCAtMSApICsgXCJcXFxcXCIgK1xuXHRcdFx0XHRjaC5jaGFyQ29kZUF0KCBjaC5sZW5ndGggLSAxICkudG9TdHJpbmcoIDE2ICkgKyBcIiBcIjtcblx0XHR9XG5cblx0XHQvLyBPdGhlciBwb3RlbnRpYWxseS1zcGVjaWFsIEFTQ0lJIGNoYXJhY3RlcnMgZ2V0IGJhY2tzbGFzaC1lc2NhcGVkXG5cdFx0cmV0dXJuIFwiXFxcXFwiICsgY2g7XG5cdH0sXG5cblx0Ly8gVXNlZCBmb3IgaWZyYW1lc1xuXHQvLyBTZWUgc2V0RG9jdW1lbnQoKVxuXHQvLyBSZW1vdmluZyB0aGUgZnVuY3Rpb24gd3JhcHBlciBjYXVzZXMgYSBcIlBlcm1pc3Npb24gRGVuaWVkXCJcblx0Ly8gZXJyb3IgaW4gSUVcblx0dW5sb2FkSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHNldERvY3VtZW50KCk7XG5cdH0sXG5cblx0aW5EaXNhYmxlZEZpZWxkc2V0ID0gYWRkQ29tYmluYXRvcihcblx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSB0cnVlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmaWVsZHNldFwiO1xuXHRcdH0sXG5cdFx0eyBkaXI6IFwicGFyZW50Tm9kZVwiLCBuZXh0OiBcImxlZ2VuZFwiIH1cblx0KTtcblxuLy8gT3B0aW1pemUgZm9yIHB1c2guYXBwbHkoIF8sIE5vZGVMaXN0IClcbnRyeSB7XG5cdHB1c2guYXBwbHkoXG5cdFx0KCBhcnIgPSBzbGljZS5jYWxsKCBwcmVmZXJyZWREb2MuY2hpbGROb2RlcyApICksXG5cdFx0cHJlZmVycmVkRG9jLmNoaWxkTm9kZXNcblx0KTtcblxuXHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMFxuXHQvLyBEZXRlY3Qgc2lsZW50bHkgZmFpbGluZyBwdXNoLmFwcGx5XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0YXJyWyBwcmVmZXJyZWREb2MuY2hpbGROb2Rlcy5sZW5ndGggXS5ub2RlVHlwZTtcbn0gY2F0Y2ggKCBlICkge1xuXHRwdXNoID0geyBhcHBseTogYXJyLmxlbmd0aCA/XG5cblx0XHQvLyBMZXZlcmFnZSBzbGljZSBpZiBwb3NzaWJsZVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHB1c2hOYXRpdmUuYXBwbHkoIHRhcmdldCwgc2xpY2UuY2FsbCggZWxzICkgKTtcblx0XHR9IDpcblxuXHRcdC8vIFN1cHBvcnQ6IElFPDlcblx0XHQvLyBPdGhlcndpc2UgYXBwZW5kIGRpcmVjdGx5XG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0dmFyIGogPSB0YXJnZXQubGVuZ3RoLFxuXHRcdFx0XHRpID0gMDtcblxuXHRcdFx0Ly8gQ2FuJ3QgdHJ1c3QgTm9kZUxpc3QubGVuZ3RoXG5cdFx0XHR3aGlsZSAoICggdGFyZ2V0WyBqKysgXSA9IGVsc1sgaSsrIF0gKSApIHt9XG5cdFx0XHR0YXJnZXQubGVuZ3RoID0gaiAtIDE7XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBTaXp6bGUoIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHR2YXIgbSwgaSwgZWxlbSwgbmlkLCBtYXRjaCwgZ3JvdXBzLCBuZXdTZWxlY3Rvcixcblx0XHRuZXdDb250ZXh0ID0gY29udGV4dCAmJiBjb250ZXh0Lm93bmVyRG9jdW1lbnQsXG5cblx0XHQvLyBub2RlVHlwZSBkZWZhdWx0cyB0byA5LCBzaW5jZSBjb250ZXh0IGRlZmF1bHRzIHRvIGRvY3VtZW50XG5cdFx0bm9kZVR5cGUgPSBjb250ZXh0ID8gY29udGV4dC5ub2RlVHlwZSA6IDk7XG5cblx0cmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0Ly8gUmV0dXJuIGVhcmx5IGZyb20gY2FsbHMgd2l0aCBpbnZhbGlkIHNlbGVjdG9yIG9yIGNvbnRleHRcblx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgfHwgIXNlbGVjdG9yIHx8XG5cdFx0bm9kZVR5cGUgIT09IDEgJiYgbm9kZVR5cGUgIT09IDkgJiYgbm9kZVR5cGUgIT09IDExICkge1xuXG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvLyBUcnkgdG8gc2hvcnRjdXQgZmluZCBvcGVyYXRpb25zIChhcyBvcHBvc2VkIHRvIGZpbHRlcnMpIGluIEhUTUwgZG9jdW1lbnRzXG5cdGlmICggIXNlZWQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0XHRjb250ZXh0ID0gY29udGV4dCB8fCBkb2N1bWVudDtcblxuXHRcdGlmICggZG9jdW1lbnRJc0hUTUwgKSB7XG5cblx0XHRcdC8vIElmIHRoZSBzZWxlY3RvciBpcyBzdWZmaWNpZW50bHkgc2ltcGxlLCB0cnkgdXNpbmcgYSBcImdldCpCeSpcIiBET00gbWV0aG9kXG5cdFx0XHQvLyAoZXhjZXB0aW5nIERvY3VtZW50RnJhZ21lbnQgY29udGV4dCwgd2hlcmUgdGhlIG1ldGhvZHMgZG9uJ3QgZXhpc3QpXG5cdFx0XHRpZiAoIG5vZGVUeXBlICE9PSAxMSAmJiAoIG1hdGNoID0gcnF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApICkgKSB7XG5cblx0XHRcdFx0Ly8gSUQgc2VsZWN0b3Jcblx0XHRcdFx0aWYgKCAoIG0gPSBtYXRjaFsgMSBdICkgKSB7XG5cblx0XHRcdFx0XHQvLyBEb2N1bWVudCBjb250ZXh0XG5cdFx0XHRcdFx0aWYgKCBub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggbSApICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0XHRpZiAoIGVsZW0uaWQgPT09IG0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRWxlbWVudCBjb250ZXh0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgJiYgKCBlbGVtID0gbmV3Q29udGV4dC5nZXRFbGVtZW50QnlJZCggbSApICkgJiZcblx0XHRcdFx0XHRcdFx0Y29udGFpbnMoIGNvbnRleHQsIGVsZW0gKSAmJlxuXHRcdFx0XHRcdFx0XHRlbGVtLmlkID09PSBtICkge1xuXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHlwZSBzZWxlY3RvclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsgMiBdICkge1xuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHNlbGVjdG9yICkgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0XHQvLyBDbGFzcyBzZWxlY3RvclxuXHRcdFx0XHR9IGVsc2UgaWYgKCAoIG0gPSBtYXRjaFsgMyBdICkgJiYgc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmXG5cdFx0XHRcdFx0Y29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICkge1xuXG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBtICkgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBUYWtlIGFkdmFudGFnZSBvZiBxdWVyeVNlbGVjdG9yQWxsXG5cdFx0XHRpZiAoIHN1cHBvcnQucXNhICYmXG5cdFx0XHRcdCFub25uYXRpdmVTZWxlY3RvckNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF0gJiZcblx0XHRcdFx0KCAhcmJ1Z2d5UVNBIHx8ICFyYnVnZ3lRU0EudGVzdCggc2VsZWN0b3IgKSApICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgOCBvbmx5XG5cdFx0XHRcdC8vIEV4Y2x1ZGUgb2JqZWN0IGVsZW1lbnRzXG5cdFx0XHRcdCggbm9kZVR5cGUgIT09IDEgfHwgY29udGV4dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm9iamVjdFwiICkgKSB7XG5cblx0XHRcdFx0bmV3U2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0bmV3Q29udGV4dCA9IGNvbnRleHQ7XG5cblx0XHRcdFx0Ly8gcVNBIGNvbnNpZGVycyBlbGVtZW50cyBvdXRzaWRlIGEgc2NvcGluZyByb290IHdoZW4gZXZhbHVhdGluZyBjaGlsZCBvclxuXHRcdFx0XHQvLyBkZXNjZW5kYW50IGNvbWJpbmF0b3JzLCB3aGljaCBpcyBub3Qgd2hhdCB3ZSB3YW50LlxuXHRcdFx0XHQvLyBJbiBzdWNoIGNhc2VzLCB3ZSB3b3JrIGFyb3VuZCB0aGUgYmVoYXZpb3IgYnkgcHJlZml4aW5nIGV2ZXJ5IHNlbGVjdG9yIGluIHRoZVxuXHRcdFx0XHQvLyBsaXN0IHdpdGggYW4gSUQgc2VsZWN0b3IgcmVmZXJlbmNpbmcgdGhlIHNjb3BlIGNvbnRleHQuXG5cdFx0XHRcdC8vIFRoZSB0ZWNobmlxdWUgaGFzIHRvIGJlIHVzZWQgYXMgd2VsbCB3aGVuIGEgbGVhZGluZyBjb21iaW5hdG9yIGlzIHVzZWRcblx0XHRcdFx0Ly8gYXMgc3VjaCBzZWxlY3RvcnMgYXJlIG5vdCByZWNvZ25pemVkIGJ5IHF1ZXJ5U2VsZWN0b3JBbGwuXG5cdFx0XHRcdC8vIFRoYW5rcyB0byBBbmRyZXcgRHVwb250IGZvciB0aGlzIHRlY2huaXF1ZS5cblx0XHRcdFx0aWYgKCBub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHRcdCggcmRlc2NlbmQudGVzdCggc2VsZWN0b3IgKSB8fCByY29tYmluYXRvcnMudGVzdCggc2VsZWN0b3IgKSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRXhwYW5kIGNvbnRleHQgZm9yIHNpYmxpbmcgc2VsZWN0b3JzXG5cdFx0XHRcdFx0bmV3Q29udGV4dCA9IHJzaWJsaW5nLnRlc3QoIHNlbGVjdG9yICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8XG5cdFx0XHRcdFx0XHRjb250ZXh0O1xuXG5cdFx0XHRcdFx0Ly8gV2UgY2FuIHVzZSA6c2NvcGUgaW5zdGVhZCBvZiB0aGUgSUQgaGFjayBpZiB0aGUgYnJvd3NlclxuXHRcdFx0XHRcdC8vIHN1cHBvcnRzIGl0ICYgaWYgd2UncmUgbm90IGNoYW5naW5nIHRoZSBjb250ZXh0LlxuXHRcdFx0XHRcdGlmICggbmV3Q29udGV4dCAhPT0gY29udGV4dCB8fCAhc3VwcG9ydC5zY29wZSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gQ2FwdHVyZSB0aGUgY29udGV4dCBJRCwgc2V0dGluZyBpdCBmaXJzdCBpZiBuZWNlc3Nhcnlcblx0XHRcdFx0XHRcdGlmICggKCBuaWQgPSBjb250ZXh0LmdldEF0dHJpYnV0ZSggXCJpZFwiICkgKSApIHtcblx0XHRcdFx0XHRcdFx0bmlkID0gbmlkLnJlcGxhY2UoIHJjc3Nlc2NhcGUsIGZjc3Nlc2NhcGUgKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRleHQuc2V0QXR0cmlidXRlKCBcImlkXCIsICggbmlkID0gZXhwYW5kbyApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJlZml4IGV2ZXJ5IHNlbGVjdG9yIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0Z3JvdXBzID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0aSA9IGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRncm91cHNbIGkgXSA9ICggbmlkID8gXCIjXCIgKyBuaWQgOiBcIjpzY29wZVwiICkgKyBcIiBcIiArXG5cdFx0XHRcdFx0XHRcdHRvU2VsZWN0b3IoIGdyb3Vwc1sgaSBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld1NlbGVjdG9yID0gZ3JvdXBzLmpvaW4oIFwiLFwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsXG5cdFx0XHRcdFx0XHRuZXdDb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIG5ld1NlbGVjdG9yIClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHR9IGNhdGNoICggcXNhRXJyb3IgKSB7XG5cdFx0XHRcdFx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSggc2VsZWN0b3IsIHRydWUgKTtcblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAoIG5pZCA9PT0gZXhwYW5kbyApIHtcblx0XHRcdFx0XHRcdGNvbnRleHQucmVtb3ZlQXR0cmlidXRlKCBcImlkXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBBbGwgb3RoZXJzXG5cdHJldHVybiBzZWxlY3QoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApO1xufVxuXG4vKipcbiAqIENyZWF0ZSBrZXktdmFsdWUgY2FjaGVzIG9mIGxpbWl0ZWQgc2l6ZVxuICogQHJldHVybnMge2Z1bmN0aW9uKHN0cmluZywgb2JqZWN0KX0gUmV0dXJucyB0aGUgT2JqZWN0IGRhdGEgYWZ0ZXIgc3RvcmluZyBpdCBvbiBpdHNlbGYgd2l0aFxuICpcdHByb3BlcnR5IG5hbWUgdGhlIChzcGFjZS1zdWZmaXhlZCkgc3RyaW5nIGFuZCAoaWYgdGhlIGNhY2hlIGlzIGxhcmdlciB0aGFuIEV4cHIuY2FjaGVMZW5ndGgpXG4gKlx0ZGVsZXRpbmcgdGhlIG9sZGVzdCBlbnRyeVxuICovXG5mdW5jdGlvbiBjcmVhdGVDYWNoZSgpIHtcblx0dmFyIGtleXMgPSBbXTtcblxuXHRmdW5jdGlvbiBjYWNoZSgga2V5LCB2YWx1ZSApIHtcblxuXHRcdC8vIFVzZSAoa2V5ICsgXCIgXCIpIHRvIGF2b2lkIGNvbGxpc2lvbiB3aXRoIG5hdGl2ZSBwcm90b3R5cGUgcHJvcGVydGllcyAoc2VlIElzc3VlICMxNTcpXG5cdFx0aWYgKCBrZXlzLnB1c2goIGtleSArIFwiIFwiICkgPiBFeHByLmNhY2hlTGVuZ3RoICkge1xuXG5cdFx0XHQvLyBPbmx5IGtlZXAgdGhlIG1vc3QgcmVjZW50IGVudHJpZXNcblx0XHRcdGRlbGV0ZSBjYWNoZVsga2V5cy5zaGlmdCgpIF07XG5cdFx0fVxuXHRcdHJldHVybiAoIGNhY2hlWyBrZXkgKyBcIiBcIiBdID0gdmFsdWUgKTtcblx0fVxuXHRyZXR1cm4gY2FjaGU7XG59XG5cbi8qKlxuICogTWFyayBhIGZ1bmN0aW9uIGZvciBzcGVjaWFsIHVzZSBieSBTaXp6bGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBtYXJrXG4gKi9cbmZ1bmN0aW9uIG1hcmtGdW5jdGlvbiggZm4gKSB7XG5cdGZuWyBleHBhbmRvIF0gPSB0cnVlO1xuXHRyZXR1cm4gZm47XG59XG5cbi8qKlxuICogU3VwcG9ydCB0ZXN0aW5nIHVzaW5nIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFBhc3NlZCB0aGUgY3JlYXRlZCBlbGVtZW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KCBmbiApIHtcblx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJmaWVsZHNldFwiICk7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gISFmbiggZWwgKTtcblx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9IGZpbmFsbHkge1xuXG5cdFx0Ly8gUmVtb3ZlIGZyb20gaXRzIHBhcmVudCBieSBkZWZhdWx0XG5cdFx0aWYgKCBlbC5wYXJlbnROb2RlICkge1xuXHRcdFx0ZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWwgKTtcblx0XHR9XG5cblx0XHQvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxuXHRcdGVsID0gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIHNhbWUgaGFuZGxlciBmb3IgYWxsIG9mIHRoZSBzcGVjaWZpZWQgYXR0cnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRycyBQaXBlLXNlcGFyYXRlZCBsaXN0IG9mIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIG1ldGhvZCB0aGF0IHdpbGwgYmUgYXBwbGllZFxuICovXG5mdW5jdGlvbiBhZGRIYW5kbGUoIGF0dHJzLCBoYW5kbGVyICkge1xuXHR2YXIgYXJyID0gYXR0cnMuc3BsaXQoIFwifFwiICksXG5cdFx0aSA9IGFyci5sZW5ndGg7XG5cblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0RXhwci5hdHRySGFuZGxlWyBhcnJbIGkgXSBdID0gaGFuZGxlcjtcblx0fVxufVxuXG4vKipcbiAqIENoZWNrcyBkb2N1bWVudCBvcmRlciBvZiB0d28gc2libGluZ3NcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIGxlc3MgdGhhbiAwIGlmIGEgcHJlY2VkZXMgYiwgZ3JlYXRlciB0aGFuIDAgaWYgYSBmb2xsb3dzIGJcbiAqL1xuZnVuY3Rpb24gc2libGluZ0NoZWNrKCBhLCBiICkge1xuXHR2YXIgY3VyID0gYiAmJiBhLFxuXHRcdGRpZmYgPSBjdXIgJiYgYS5ub2RlVHlwZSA9PT0gMSAmJiBiLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRhLnNvdXJjZUluZGV4IC0gYi5zb3VyY2VJbmRleDtcblxuXHQvLyBVc2UgSUUgc291cmNlSW5kZXggaWYgYXZhaWxhYmxlIG9uIGJvdGggbm9kZXNcblx0aWYgKCBkaWZmICkge1xuXHRcdHJldHVybiBkaWZmO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYiBmb2xsb3dzIGFcblx0aWYgKCBjdXIgKSB7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5uZXh0U2libGluZyApICkge1xuXHRcdFx0aWYgKCBjdXIgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYSA/IDEgOiAtMTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGlucHV0IHR5cGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dFBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgYnV0dG9uc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQnV0dG9uUHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuICggbmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCIgKSAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciA6ZW5hYmxlZC86ZGlzYWJsZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzYWJsZWQgdHJ1ZSBmb3IgOmRpc2FibGVkOyBmYWxzZSBmb3IgOmVuYWJsZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIGRpc2FibGVkICkge1xuXG5cdC8vIEtub3duIDpkaXNhYmxlZCBmYWxzZSBwb3NpdGl2ZXM6IGZpZWxkc2V0W2Rpc2FibGVkXSA+IGxlZ2VuZDpudGgtb2YtdHlwZShuKzIpIDpjYW4tZGlzYWJsZVxuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHQvLyBPbmx5IGNlcnRhaW4gZWxlbWVudHMgY2FuIG1hdGNoIDplbmFibGVkIG9yIDpkaXNhYmxlZFxuXHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sI3NlbGVjdG9yLWVuYWJsZWRcblx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zY3JpcHRpbmcuaHRtbCNzZWxlY3Rvci1kaXNhYmxlZFxuXHRcdGlmICggXCJmb3JtXCIgaW4gZWxlbSApIHtcblxuXHRcdFx0Ly8gQ2hlY2sgZm9yIGluaGVyaXRlZCBkaXNhYmxlZG5lc3Mgb24gcmVsZXZhbnQgbm9uLWRpc2FibGVkIGVsZW1lbnRzOlxuXHRcdFx0Ly8gKiBsaXN0ZWQgZm9ybS1hc3NvY2lhdGVkIGVsZW1lbnRzIGluIGEgZGlzYWJsZWQgZmllbGRzZXRcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjYXRlZ29yeS1saXN0ZWRcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjb25jZXB0LWZlLWRpc2FibGVkXG5cdFx0XHQvLyAqIG9wdGlvbiBlbGVtZW50cyBpbiBhIGRpc2FibGVkIG9wdGdyb3VwXG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY29uY2VwdC1vcHRpb24tZGlzYWJsZWRcblx0XHRcdC8vIEFsbCBzdWNoIGVsZW1lbnRzIGhhdmUgYSBcImZvcm1cIiBwcm9wZXJ0eS5cblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICYmIGVsZW0uZGlzYWJsZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdC8vIE9wdGlvbiBlbGVtZW50cyBkZWZlciB0byBhIHBhcmVudCBvcHRncm91cCBpZiBwcmVzZW50XG5cdFx0XHRcdGlmICggXCJsYWJlbFwiIGluIGVsZW0gKSB7XG5cdFx0XHRcdFx0aWYgKCBcImxhYmVsXCIgaW4gZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0ucGFyZW50Tm9kZS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA2IC0gMTFcblx0XHRcdFx0Ly8gVXNlIHRoZSBpc0Rpc2FibGVkIHNob3J0Y3V0IHByb3BlcnR5IHRvIGNoZWNrIGZvciBkaXNhYmxlZCBmaWVsZHNldCBhbmNlc3RvcnNcblx0XHRcdFx0cmV0dXJuIGVsZW0uaXNEaXNhYmxlZCA9PT0gZGlzYWJsZWQgfHxcblxuXHRcdFx0XHRcdC8vIFdoZXJlIHRoZXJlIGlzIG5vIGlzRGlzYWJsZWQsIGNoZWNrIG1hbnVhbGx5XG5cdFx0XHRcdFx0LyoganNoaW50IC1XMDE4ICovXG5cdFx0XHRcdFx0ZWxlbS5pc0Rpc2FibGVkICE9PSAhZGlzYWJsZWQgJiZcblx0XHRcdFx0XHRpbkRpc2FibGVkRmllbGRzZXQoIGVsZW0gKSA9PT0gZGlzYWJsZWQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblxuXHRcdC8vIFRyeSB0byB3aW5ub3cgb3V0IGVsZW1lbnRzIHRoYXQgY2FuJ3QgYmUgZGlzYWJsZWQgYmVmb3JlIHRydXN0aW5nIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eS5cblx0XHQvLyBTb21lIHZpY3RpbXMgZ2V0IGNhdWdodCBpbiBvdXIgbmV0IChsYWJlbCwgbGVnZW5kLCBtZW51LCB0cmFjayksIGJ1dCBpdCBzaG91bGRuJ3Rcblx0XHQvLyBldmVuIGV4aXN0IG9uIHRoZW0sIGxldCBhbG9uZSBoYXZlIGEgYm9vbGVhbiB2YWx1ZS5cblx0XHR9IGVsc2UgaWYgKCBcImxhYmVsXCIgaW4gZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHR9XG5cblx0XHQvLyBSZW1haW5pbmcgZWxlbWVudHMgYXJlIG5laXRoZXIgOmVuYWJsZWQgbm9yIDpkaXNhYmxlZFxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIHBvc2l0aW9uYWxzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5mdW5jdGlvbiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmbiApIHtcblx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIGFyZ3VtZW50ICkge1xuXHRcdGFyZ3VtZW50ID0gK2FyZ3VtZW50O1xuXHRcdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0dmFyIGosXG5cdFx0XHRcdG1hdGNoSW5kZXhlcyA9IGZuKCBbXSwgc2VlZC5sZW5ndGgsIGFyZ3VtZW50ICksXG5cdFx0XHRcdGkgPSBtYXRjaEluZGV4ZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBNYXRjaCBlbGVtZW50cyBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4ZXNcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoIHNlZWRbICggaiA9IG1hdGNoSW5kZXhlc1sgaSBdICkgXSApIHtcblx0XHRcdFx0XHRzZWVkWyBqIF0gPSAhKCBtYXRjaGVzWyBqIF0gPSBzZWVkWyBqIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSApO1xufVxuXG4vKipcbiAqIENoZWNrcyBhIG5vZGUgZm9yIHZhbGlkaXR5IGFzIGEgU2l6emxlIGNvbnRleHRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3Q9fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7RWxlbWVudHxPYmplY3R8Qm9vbGVhbn0gVGhlIGlucHV0IG5vZGUgaWYgYWNjZXB0YWJsZSwgb3RoZXJ3aXNlIGEgZmFsc3kgdmFsdWVcbiAqL1xuZnVuY3Rpb24gdGVzdENvbnRleHQoIGNvbnRleHQgKSB7XG5cdHJldHVybiBjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnRleHQ7XG59XG5cbi8vIEV4cG9zZSBzdXBwb3J0IHZhcnMgZm9yIGNvbnZlbmllbmNlXG5zdXBwb3J0ID0gU2l6emxlLnN1cHBvcnQgPSB7fTtcblxuLyoqXG4gKiBEZXRlY3RzIFhNTCBub2Rlc1xuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxlbSBBbiBlbGVtZW50IG9yIGEgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmZiBlbGVtIGlzIGEgbm9uLUhUTUwgWE1MIG5vZGVcbiAqL1xuaXNYTUwgPSBTaXp6bGUuaXNYTUwgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0dmFyIG5hbWVzcGFjZSA9IGVsZW0gJiYgZWxlbS5uYW1lc3BhY2VVUkksXG5cdFx0ZG9jRWxlbSA9IGVsZW0gJiYgKCBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSApLmRvY3VtZW50RWxlbWVudDtcblxuXHQvLyBTdXBwb3J0OiBJRSA8PThcblx0Ly8gQXNzdW1lIEhUTUwgd2hlbiBkb2N1bWVudEVsZW1lbnQgZG9lc24ndCB5ZXQgZXhpc3QsIHN1Y2ggYXMgaW5zaWRlIGxvYWRpbmcgaWZyYW1lc1xuXHQvLyBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvNDgzM1xuXHRyZXR1cm4gIXJodG1sLnRlc3QoIG5hbWVzcGFjZSB8fCBkb2NFbGVtICYmIGRvY0VsZW0ubm9kZU5hbWUgfHwgXCJIVE1MXCIgKTtcbn07XG5cbi8qKlxuICogU2V0cyBkb2N1bWVudC1yZWxhdGVkIHZhcmlhYmxlcyBvbmNlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBbZG9jXSBBbiBlbGVtZW50IG9yIGRvY3VtZW50IG9iamVjdCB0byB1c2UgdG8gc2V0IHRoZSBkb2N1bWVudFxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY3VycmVudCBkb2N1bWVudFxuICovXG5zZXREb2N1bWVudCA9IFNpenpsZS5zZXREb2N1bWVudCA9IGZ1bmN0aW9uKCBub2RlICkge1xuXHR2YXIgaGFzQ29tcGFyZSwgc3ViV2luZG93LFxuXHRcdGRvYyA9IG5vZGUgPyBub2RlLm93bmVyRG9jdW1lbnQgfHwgbm9kZSA6IHByZWZlcnJlZERvYztcblxuXHQvLyBSZXR1cm4gZWFybHkgaWYgZG9jIGlzIGludmFsaWQgb3IgYWxyZWFkeSBzZWxlY3RlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoIGRvYyA9PSBkb2N1bWVudCB8fCBkb2Mubm9kZVR5cGUgIT09IDkgfHwgIWRvYy5kb2N1bWVudEVsZW1lbnQgKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cblx0Ly8gVXBkYXRlIGdsb2JhbCB2YXJpYWJsZXNcblx0ZG9jdW1lbnQgPSBkb2M7XG5cdGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdGRvY3VtZW50SXNIVE1MID0gIWlzWE1MKCBkb2N1bWVudCApO1xuXG5cdC8vIFN1cHBvcnQ6IElFIDkgLSAxMSssIEVkZ2UgMTIgLSAxOCtcblx0Ly8gQWNjZXNzaW5nIGlmcmFtZSBkb2N1bWVudHMgYWZ0ZXIgdW5sb2FkIHRocm93cyBcInBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3JzIChqUXVlcnkgIzEzOTM2KVxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoIHByZWZlcnJlZERvYyAhPSBkb2N1bWVudCAmJlxuXHRcdCggc3ViV2luZG93ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcgKSAmJiBzdWJXaW5kb3cudG9wICE9PSBzdWJXaW5kb3cgKSB7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSAxMSwgRWRnZVxuXHRcdGlmICggc3ViV2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0XHRzdWJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJ1bmxvYWRcIiwgdW5sb2FkSGFuZGxlciwgZmFsc2UgKTtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDkgLSAxMCBvbmx5XG5cdFx0fSBlbHNlIGlmICggc3ViV2luZG93LmF0dGFjaEV2ZW50ICkge1xuXHRcdFx0c3ViV2luZG93LmF0dGFjaEV2ZW50KCBcIm9udW5sb2FkXCIsIHVubG9hZEhhbmRsZXIgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBTdXBwb3J0OiBJRSA4IC0gMTErLCBFZGdlIDEyIC0gMTgrLCBDaHJvbWUgPD0xNiAtIDI1IG9ubHksIEZpcmVmb3ggPD0zLjYgLSAzMSBvbmx5LFxuXHQvLyBTYWZhcmkgNCAtIDUgb25seSwgT3BlcmEgPD0xMS42IC0gMTIueCBvbmx5XG5cdC8vIElFL0VkZ2UgJiBvbGRlciBicm93c2VycyBkb24ndCBzdXBwb3J0IHRoZSA6c2NvcGUgcHNldWRvLWNsYXNzLlxuXHQvLyBTdXBwb3J0OiBTYWZhcmkgNi4wIG9ubHlcblx0Ly8gU2FmYXJpIDYuMCBzdXBwb3J0cyA6c2NvcGUgYnV0IGl0J3MgYW4gYWxpYXMgb2YgOnJvb3QgdGhlcmUuXG5cdHN1cHBvcnQuc2NvcGUgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICkgKTtcblx0XHRyZXR1cm4gdHlwZW9mIGVsLnF1ZXJ5U2VsZWN0b3JBbGwgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdCFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpzY29wZSBmaWVsZHNldCBkaXZcIiApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8qIEF0dHJpYnV0ZXNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFN1cHBvcnQ6IElFPDhcblx0Ly8gVmVyaWZ5IHRoYXQgZ2V0QXR0cmlidXRlIHJlYWxseSByZXR1cm5zIGF0dHJpYnV0ZXMgYW5kIG5vdCBwcm9wZXJ0aWVzXG5cdC8vIChleGNlcHRpbmcgSUU4IGJvb2xlYW5zKVxuXHRzdXBwb3J0LmF0dHJpYnV0ZXMgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRlbC5jbGFzc05hbWUgPSBcImlcIjtcblx0XHRyZXR1cm4gIWVsLmdldEF0dHJpYnV0ZSggXCJjbGFzc05hbWVcIiApO1xuXHR9ICk7XG5cblx0LyogZ2V0RWxlbWVudChzKUJ5KlxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpIHJldHVybnMgb25seSBlbGVtZW50c1xuXHRzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZWwuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoIFwiXCIgKSApO1xuXHRcdHJldHVybiAhZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiKlwiICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0Ly8gU3VwcG9ydDogSUU8OVxuXHRzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKTtcblxuXHQvLyBTdXBwb3J0OiBJRTwxMFxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50QnlJZCByZXR1cm5zIGVsZW1lbnRzIGJ5IG5hbWVcblx0Ly8gVGhlIGJyb2tlbiBnZXRFbGVtZW50QnlJZCBtZXRob2RzIGRvbid0IHBpY2sgdXAgcHJvZ3JhbW1hdGljYWxseS1zZXQgbmFtZXMsXG5cdC8vIHNvIHVzZSBhIHJvdW5kYWJvdXQgZ2V0RWxlbWVudHNCeU5hbWUgdGVzdFxuXHRzdXBwb3J0LmdldEJ5SWQgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmlkID0gZXhwYW5kbztcblx0XHRyZXR1cm4gIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lIHx8ICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSggZXhwYW5kbyApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8vIElEIGZpbHRlciBhbmQgZmluZFxuXHRpZiAoIHN1cHBvcnQuZ2V0QnlJZCApIHtcblx0XHRFeHByLmZpbHRlclsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBcImlkXCIgKSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXHRcdEV4cHIuZmluZFsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cdFx0XHRcdHJldHVybiBlbGVtID8gWyBlbGVtIF0gOiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdEV4cHIuZmlsdGVyWyBcIklEXCIgXSA9ICBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIG5vZGUgPSB0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgNiAtIDcgb25seVxuXHRcdC8vIGdldEVsZW1lbnRCeUlkIGlzIG5vdCByZWxpYWJsZSBhcyBhIGZpbmQgc2hvcnRjdXRcblx0XHRFeHByLmZpbmRbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdFx0dmFyIG5vZGUsIGksIGVsZW1zLFxuXHRcdFx0XHRcdGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRcdGlmICggZWxlbSApIHtcblxuXHRcdFx0XHRcdC8vIFZlcmlmeSB0aGUgaWQgYXR0cmlidXRlXG5cdFx0XHRcdFx0bm9kZSA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0aWYgKCBub2RlICYmIG5vZGUudmFsdWUgPT09IGlkICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFsgZWxlbSBdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZhbGwgYmFjayBvbiBnZXRFbGVtZW50c0J5TmFtZVxuXHRcdFx0XHRcdGVsZW1zID0gY29udGV4dC5nZXRFbGVtZW50c0J5TmFtZSggaWQgKTtcblx0XHRcdFx0XHRpID0gMDtcblx0XHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1zWyBpKysgXSApICkge1xuXHRcdFx0XHRcdFx0bm9kZSA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHRpZiAoIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gaWQgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBbIGVsZW0gXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8vIFRhZ1xuXHRFeHByLmZpbmRbIFwiVEFHXCIgXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgP1xuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgZG9uJ3QgaGF2ZSBnRUJUTlxuXHRcdFx0fSBlbHNlIGlmICggc3VwcG9ydC5xc2EgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyApO1xuXHRcdFx0fVxuXHRcdH0gOlxuXG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHR0bXAgPSBbXSxcblx0XHRcdFx0aSA9IDAsXG5cblx0XHRcdFx0Ly8gQnkgaGFwcHkgY29pbmNpZGVuY2UsIGEgKGJyb2tlbikgZ0VCVE4gYXBwZWFycyBvbiBEb2N1bWVudEZyYWdtZW50IG5vZGVzIHRvb1xuXHRcdFx0XHRyZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIEZpbHRlciBvdXQgcG9zc2libGUgY29tbWVudHNcblx0XHRcdGlmICggdGFnID09PSBcIipcIiApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSByZXN1bHRzWyBpKysgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdHRtcC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0Ly8gQ2xhc3Ncblx0RXhwci5maW5kWyBcIkNMQVNTXCIgXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJiBmdW5jdGlvbiggY2xhc3NOYW1lLCBjb250ZXh0ICkge1xuXHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGNsYXNzTmFtZSApO1xuXHRcdH1cblx0fTtcblxuXHQvKiBRU0EvbWF0Y2hlc1NlbGVjdG9yXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBRU0EgYW5kIG1hdGNoZXNTZWxlY3RvciBzdXBwb3J0XG5cblx0Ly8gbWF0Y2hlc1NlbGVjdG9yKDphY3RpdmUpIHJlcG9ydHMgZmFsc2Ugd2hlbiB0cnVlIChJRTkvT3BlcmEgMTEuNSlcblx0cmJ1Z2d5TWF0Y2hlcyA9IFtdO1xuXG5cdC8vIHFTYSg6Zm9jdXMpIHJlcG9ydHMgZmFsc2Ugd2hlbiB0cnVlIChDaHJvbWUgMjEpXG5cdC8vIFdlIGFsbG93IHRoaXMgYmVjYXVzZSBvZiBhIGJ1ZyBpbiBJRTgvOSB0aGF0IHRocm93cyBhbiBlcnJvclxuXHQvLyB3aGVuZXZlciBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgaXMgYWNjZXNzZWQgb24gYW4gaWZyYW1lXG5cdC8vIFNvLCB3ZSBhbGxvdyA6Zm9jdXMgdG8gcGFzcyB0aHJvdWdoIFFTQSBhbGwgdGhlIHRpbWUgdG8gYXZvaWQgdGhlIElFIGVycm9yXG5cdC8vIFNlZSBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTMzNzhcblx0cmJ1Z2d5UVNBID0gW107XG5cblx0aWYgKCAoIHN1cHBvcnQucXNhID0gcm5hdGl2ZS50ZXN0KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsICkgKSApIHtcblxuXHRcdC8vIEJ1aWxkIFFTQSByZWdleFxuXHRcdC8vIFJlZ2V4IHN0cmF0ZWd5IGFkb3B0ZWQgZnJvbSBEaWVnbyBQZXJpbmlcblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0dmFyIGlucHV0O1xuXG5cdFx0XHQvLyBTZWxlY3QgaXMgc2V0IHRvIGVtcHR5IHN0cmluZyBvbiBwdXJwb3NlXG5cdFx0XHQvLyBUaGlzIGlzIHRvIHRlc3QgSUUncyB0cmVhdG1lbnQgb2Ygbm90IGV4cGxpY2l0bHlcblx0XHRcdC8vIHNldHRpbmcgYSBib29sZWFuIGNvbnRlbnQgYXR0cmlidXRlLFxuXHRcdFx0Ly8gc2luY2UgaXRzIHByZXNlbmNlIHNob3VsZCBiZSBlbm91Z2hcblx0XHRcdC8vIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMjM1OVxuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5pbm5lckhUTUwgPSBcIjxhIGlkPSdcIiArIGV4cGFuZG8gKyBcIic+PC9hPlwiICtcblx0XHRcdFx0XCI8c2VsZWN0IGlkPSdcIiArIGV4cGFuZG8gKyBcIi1cXHJcXFxcJyBtc2FsbG93Y2FwdHVyZT0nJz5cIiArXG5cdFx0XHRcdFwiPG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4LCBPcGVyYSAxMS0xMi4xNlxuXHRcdFx0Ly8gTm90aGluZyBzaG91bGQgYmUgc2VsZWN0ZWQgd2hlbiBlbXB0eSBzdHJpbmdzIGZvbGxvdyBePSBvciAkPSBvciAqPVxuXHRcdFx0Ly8gVGhlIHRlc3QgYXR0cmlidXRlIG11c3QgYmUgdW5rbm93biBpbiBPcGVyYSBidXQgXCJzYWZlXCIgZm9yIFdpblJUXG5cdFx0XHQvLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2hoNDY1Mzg4LmFzcHgjYXR0cmlidXRlX3NlY3Rpb25cblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJbKl4kXT1cIiArIHdoaXRlc3BhY2UgKyBcIiooPzonJ3xcXFwiXFxcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRThcblx0XHRcdC8vIEJvb2xlYW4gYXR0cmlidXRlcyBhbmQgXCJ2YWx1ZVwiIGFyZSBub3QgdHJlYXRlZCBjb3JyZWN0bHlcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW3NlbGVjdGVkXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKig/OnZhbHVlfFwiICsgYm9vbGVhbnMgKyBcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWU8MjksIEFuZHJvaWQ8NC40LCBTYWZhcmk8Ny4wKywgaU9TPDcuMCssIFBoYW50b21KUzwxLjkuOCtcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW2lkfj1cIiArIGV4cGFuZG8gKyBcIi1dXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIn49XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE1IC0gMTgrXG5cdFx0XHQvLyBJRSAxMS9FZGdlIGRvbid0IGZpbmQgZWxlbWVudHMgb24gYSBgW25hbWU9JyddYCBxdWVyeSBpbiBzb21lIGNhc2VzLlxuXHRcdFx0Ly8gQWRkaW5nIGEgdGVtcG9yYXJ5IGF0dHJpYnV0ZSB0byB0aGUgZG9jdW1lbnQgYmVmb3JlIHRoZSBzZWxlY3Rpb24gd29ya3Ncblx0XHRcdC8vIGFyb3VuZCB0aGUgaXNzdWUuXG5cdFx0XHQvLyBJbnRlcmVzdGluZ2x5LCBJRSAxMCAmIG9sZGVyIGRvbid0IHNlZW0gdG8gaGF2ZSB0aGUgaXNzdWUuXG5cdFx0XHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJcIiApO1xuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltuYW1lPScnXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKm5hbWVcIiArIHdoaXRlc3BhY2UgKyBcIio9XCIgK1xuXHRcdFx0XHRcdHdoaXRlc3BhY2UgKyBcIiooPzonJ3xcXFwiXFxcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXZWJraXQvT3BlcmEgLSA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIHNlbGVjdGVkIG9wdGlvbiBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpjaGVja2VkXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjpjaGVja2VkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogU2FmYXJpIDgrLCBpT1MgOCtcblx0XHRcdC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzY4NTFcblx0XHRcdC8vIEluLXBhZ2UgYHNlbGVjdG9yI2lkIHNpYmxpbmctY29tYmluYXRvciBzZWxlY3RvcmAgZmFpbHNcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiYSNcIiArIGV4cGFuZG8gKyBcIisqXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIi4jLitbK35dXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogRmlyZWZveCA8PTMuNiAtIDUgb25seVxuXHRcdFx0Ly8gT2xkIEZpcmVmb3ggZG9lc24ndCB0aHJvdyBvbiBhIGJhZGx5LWVzY2FwZWQgaWRlbnRpZmllci5cblx0XHRcdGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiXFxcXFxcZlwiICk7XG5cdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJbXFxcXHJcXFxcblxcXFxmXVwiICk7XG5cdFx0fSApO1xuXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRlbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JycgZGlzYWJsZWQ9J2Rpc2FibGVkJz48L2E+XCIgK1xuXHRcdFx0XHRcIjxzZWxlY3QgZGlzYWJsZWQ9J2Rpc2FibGVkJz48b3B0aW9uLz48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogV2luZG93cyA4IE5hdGl2ZSBBcHBzXG5cdFx0XHQvLyBUaGUgdHlwZSBhbmQgbmFtZSBhdHRyaWJ1dGVzIGFyZSByZXN0cmljdGVkIGR1cmluZyAuaW5uZXJIVE1MIGFzc2lnbm1lbnRcblx0XHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJoaWRkZW5cIiApO1xuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoIGlucHV0ICkuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJEXCIgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBFbmZvcmNlIGNhc2Utc2Vuc2l0aXZpdHkgb2YgbmFtZSBhdHRyaWJ1dGVcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbmFtZT1kXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqWypeJHwhfl0/PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZGIDMuNSAtIDplbmFibGVkLzpkaXNhYmxlZCBhbmQgaGlkZGVuIGVsZW1lbnRzIChoaWRkZW4gZWxlbWVudHMgYXJlIHN0aWxsIGVuYWJsZWQpXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjplbmFibGVkXCIgKS5sZW5ndGggIT09IDIgKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU5LTExK1xuXHRcdFx0Ly8gSUUncyA6ZGlzYWJsZWQgc2VsZWN0b3IgZG9lcyBub3QgcGljayB1cCB0aGUgY2hpbGRyZW4gb2YgZGlzYWJsZWQgZmllbGRzZXRzXG5cdFx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCI6ZGlzYWJsZWRcIiApLmxlbmd0aCAhPT0gMiApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBPcGVyYSAxMCAtIDExIG9ubHlcblx0XHRcdC8vIE9wZXJhIDEwLTExIGRvZXMgbm90IHRocm93IG9uIHBvc3QtY29tbWEgaW52YWxpZCBwc2V1ZG9zXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIiosOnhcIiApO1xuXHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiLC4qOlwiICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aWYgKCAoIHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yID0gcm5hdGl2ZS50ZXN0KCAoIG1hdGNoZXMgPSBkb2NFbGVtLm1hdGNoZXMgfHxcblx0XHRkb2NFbGVtLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5vTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tc01hdGNoZXNTZWxlY3RvciApICkgKSApIHtcblxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgaXQncyBwb3NzaWJsZSB0byBkbyBtYXRjaGVzU2VsZWN0b3Jcblx0XHRcdC8vIG9uIGEgZGlzY29ubmVjdGVkIG5vZGUgKElFIDkpXG5cdFx0XHRzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoID0gbWF0Y2hlcy5jYWxsKCBlbCwgXCIqXCIgKTtcblxuXHRcdFx0Ly8gVGhpcyBzaG91bGQgZmFpbCB3aXRoIGFuIGV4Y2VwdGlvblxuXHRcdFx0Ly8gR2Vja28gZG9lcyBub3QgZXJyb3IsIHJldHVybnMgZmFsc2UgaW5zdGVhZFxuXHRcdFx0bWF0Y2hlcy5jYWxsKCBlbCwgXCJbcyE9JyddOnhcIiApO1xuXHRcdFx0cmJ1Z2d5TWF0Y2hlcy5wdXNoKCBcIiE9XCIsIHBzZXVkb3MgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRyYnVnZ3lRU0EgPSByYnVnZ3lRU0EubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneVFTQS5qb2luKCBcInxcIiApICk7XG5cdHJidWdneU1hdGNoZXMgPSByYnVnZ3lNYXRjaGVzLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lNYXRjaGVzLmpvaW4oIFwifFwiICkgKTtcblxuXHQvKiBDb250YWluc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdGhhc0NvbXBhcmUgPSBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29tcGFyZURvY3VtZW50UG9zaXRpb24gKTtcblxuXHQvLyBFbGVtZW50IGNvbnRhaW5zIGFub3RoZXJcblx0Ly8gUHVycG9zZWZ1bGx5IHNlbGYtZXhjbHVzaXZlXG5cdC8vIEFzIGluLCBhbiBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gaXRzZWxmXG5cdGNvbnRhaW5zID0gaGFzQ29tcGFyZSB8fCBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29udGFpbnMgKSA/XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYWRvd24gPSBhLm5vZGVUeXBlID09PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuXHRcdFx0XHRidXAgPSBiICYmIGIucGFyZW50Tm9kZTtcblx0XHRcdHJldHVybiBhID09PSBidXAgfHwgISEoIGJ1cCAmJiBidXAubm9kZVR5cGUgPT09IDEgJiYgKFxuXHRcdFx0XHRhZG93bi5jb250YWlucyA/XG5cdFx0XHRcdFx0YWRvd24uY29udGFpbnMoIGJ1cCApIDpcblx0XHRcdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGJ1cCApICYgMTZcblx0XHRcdCkgKTtcblx0XHR9IDpcblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdGlmICggYiApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGIgPSBiLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdFx0XHRpZiAoIGIgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdC8qIFNvcnRpbmdcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIERvY3VtZW50IG9yZGVyIHNvcnRpbmdcblx0c29ydE9yZGVyID0gaGFzQ29tcGFyZSA/XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRmxhZyBmb3IgZHVwbGljYXRlIHJlbW92YWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0Ly8gU29ydCBvbiBtZXRob2QgZXhpc3RlbmNlIGlmIG9ubHkgb25lIGlucHV0IGhhcyBjb21wYXJlRG9jdW1lbnRQb3NpdGlvblxuXHRcdHZhciBjb21wYXJlID0gIWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gLSAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtcblx0XHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0XHRyZXR1cm4gY29tcGFyZTtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaWYgYm90aCBpbnB1dHMgYmVsb25nIHRvIHRoZSBzYW1lIGRvY3VtZW50XG5cdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRjb21wYXJlID0gKCBhLm93bmVyRG9jdW1lbnQgfHwgYSApID09ICggYi5vd25lckRvY3VtZW50IHx8IGIgKSA/XG5cdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBiICkgOlxuXG5cdFx0XHQvLyBPdGhlcndpc2Ugd2Uga25vdyB0aGV5IGFyZSBkaXNjb25uZWN0ZWRcblx0XHRcdDE7XG5cblx0XHQvLyBEaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRpZiAoIGNvbXBhcmUgJiAxIHx8XG5cdFx0XHQoICFzdXBwb3J0LnNvcnREZXRhY2hlZCAmJiBiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBhICkgPT09IGNvbXBhcmUgKSApIHtcblxuXHRcdFx0Ly8gQ2hvb3NlIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgcmVsYXRlZCB0byBvdXIgcHJlZmVycmVkIGRvY3VtZW50XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0aWYgKCBhID09IGRvY3VtZW50IHx8IGEub3duZXJEb2N1bWVudCA9PSBwcmVmZXJyZWREb2MgJiZcblx0XHRcdFx0Y29udGFpbnMoIHByZWZlcnJlZERvYywgYSApICkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRpZiAoIGIgPT0gZG9jdW1lbnQgfHwgYi5vd25lckRvY3VtZW50ID09IHByZWZlcnJlZERvYyAmJlxuXHRcdFx0XHRjb250YWlucyggcHJlZmVycmVkRG9jLCBiICkgKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYWludGFpbiBvcmlnaW5hbCBvcmRlclxuXHRcdFx0cmV0dXJuIHNvcnRJbnB1dCA/XG5cdFx0XHRcdCggaW5kZXhPZiggc29ydElucHV0LCBhICkgLSBpbmRleE9mKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29tcGFyZSAmIDQgPyAtMSA6IDE7XG5cdH0gOlxuXHRmdW5jdGlvbiggYSwgYiApIHtcblxuXHRcdC8vIEV4aXQgZWFybHkgaWYgdGhlIG5vZGVzIGFyZSBpZGVudGljYWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0YXVwID0gYS5wYXJlbnROb2RlLFxuXHRcdFx0YnVwID0gYi5wYXJlbnROb2RlLFxuXHRcdFx0YXAgPSBbIGEgXSxcblx0XHRcdGJwID0gWyBiIF07XG5cblx0XHQvLyBQYXJlbnRsZXNzIG5vZGVzIGFyZSBlaXRoZXIgZG9jdW1lbnRzIG9yIGRpc2Nvbm5lY3RlZFxuXHRcdGlmICggIWF1cCB8fCAhYnVwICkge1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG5cdFx0XHRyZXR1cm4gYSA9PSBkb2N1bWVudCA/IC0xIDpcblx0XHRcdFx0YiA9PSBkb2N1bWVudCA/IDEgOlxuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xuXHRcdFx0XHRhdXAgPyAtMSA6XG5cdFx0XHRcdGJ1cCA/IDEgOlxuXHRcdFx0XHRzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cblx0XHQvLyBJZiB0aGUgbm9kZXMgYXJlIHNpYmxpbmdzLCB3ZSBjYW4gZG8gYSBxdWljayBjaGVja1xuXHRcdH0gZWxzZSBpZiAoIGF1cCA9PT0gYnVwICkge1xuXHRcdFx0cmV0dXJuIHNpYmxpbmdDaGVjayggYSwgYiApO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIGZ1bGwgbGlzdHMgb2YgdGhlaXIgYW5jZXN0b3JzIGZvciBjb21wYXJpc29uXG5cdFx0Y3VyID0gYTtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdGFwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblx0XHRjdXIgPSBiO1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0YnAudW5zaGlmdCggY3VyICk7XG5cdFx0fVxuXG5cdFx0Ly8gV2FsayBkb3duIHRoZSB0cmVlIGxvb2tpbmcgZm9yIGEgZGlzY3JlcGFuY3lcblx0XHR3aGlsZSAoIGFwWyBpIF0gPT09IGJwWyBpIF0gKSB7XG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGkgP1xuXG5cdFx0XHQvLyBEbyBhIHNpYmxpbmcgY2hlY2sgaWYgdGhlIG5vZGVzIGhhdmUgYSBjb21tb24gYW5jZXN0b3Jcblx0XHRcdHNpYmxpbmdDaGVjayggYXBbIGkgXSwgYnBbIGkgXSApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIG5vZGVzIGluIG91ciBkb2N1bWVudCBzb3J0IGZpcnN0XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG5cdFx0XHRhcFsgaSBdID09IHByZWZlcnJlZERvYyA/IC0xIDpcblx0XHRcdGJwWyBpIF0gPT0gcHJlZmVycmVkRG9jID8gMSA6XG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xuXHRcdFx0MDtcblx0fTtcblxuXHRyZXR1cm4gZG9jdW1lbnQ7XG59O1xuXG5TaXp6bGUubWF0Y2hlcyA9IGZ1bmN0aW9uKCBleHByLCBlbGVtZW50cyApIHtcblx0cmV0dXJuIFNpenpsZSggZXhwciwgbnVsbCwgbnVsbCwgZWxlbWVudHMgKTtcbn07XG5cblNpenpsZS5tYXRjaGVzU2VsZWN0b3IgPSBmdW5jdGlvbiggZWxlbSwgZXhwciApIHtcblx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblxuXHRpZiAoIHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yICYmIGRvY3VtZW50SXNIVE1MICYmXG5cdFx0IW5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGVbIGV4cHIgKyBcIiBcIiBdICYmXG5cdFx0KCAhcmJ1Z2d5TWF0Y2hlcyB8fCAhcmJ1Z2d5TWF0Y2hlcy50ZXN0KCBleHByICkgKSAmJlxuXHRcdCggIXJidWdneVFTQSAgICAgfHwgIXJidWdneVFTQS50ZXN0KCBleHByICkgKSApIHtcblxuXHRcdHRyeSB7XG5cdFx0XHR2YXIgcmV0ID0gbWF0Y2hlcy5jYWxsKCBlbGVtLCBleHByICk7XG5cblx0XHRcdC8vIElFIDkncyBtYXRjaGVzU2VsZWN0b3IgcmV0dXJucyBmYWxzZSBvbiBkaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRcdGlmICggcmV0IHx8IHN1cHBvcnQuZGlzY29ubmVjdGVkTWF0Y2ggfHxcblxuXHRcdFx0XHQvLyBBcyB3ZWxsLCBkaXNjb25uZWN0ZWQgbm9kZXMgYXJlIHNhaWQgdG8gYmUgaW4gYSBkb2N1bWVudFxuXHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5XG5cdFx0XHRcdGVsZW0uZG9jdW1lbnQgJiYgZWxlbS5kb2N1bWVudC5ub2RlVHlwZSAhPT0gMTEgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRub25uYXRpdmVTZWxlY3RvckNhY2hlKCBleHByLCB0cnVlICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFNpenpsZSggZXhwciwgZG9jdW1lbnQsIG51bGwsIFsgZWxlbSBdICkubGVuZ3RoID4gMDtcbn07XG5cblNpenpsZS5jb250YWlucyA9IGZ1bmN0aW9uKCBjb250ZXh0LCBlbGVtICkge1xuXG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoICggY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgKSAhPSBkb2N1bWVudCApIHtcblx0XHRzZXREb2N1bWVudCggY29udGV4dCApO1xuXHR9XG5cdHJldHVybiBjb250YWlucyggY29udGV4dCwgZWxlbSApO1xufTtcblxuU2l6emxlLmF0dHIgPSBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblxuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkgIT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0fVxuXG5cdHZhciBmbiA9IEV4cHIuYXR0ckhhbmRsZVsgbmFtZS50b0xvd2VyQ2FzZSgpIF0sXG5cblx0XHQvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IE9iamVjdC5wcm90b3R5cGUgcHJvcGVydGllcyAoalF1ZXJ5ICMxMzgwNylcblx0XHR2YWwgPSBmbiAmJiBoYXNPd24uY2FsbCggRXhwci5hdHRySGFuZGxlLCBuYW1lLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRmbiggZWxlbSwgbmFtZSwgIWRvY3VtZW50SXNIVE1MICkgOlxuXHRcdFx0dW5kZWZpbmVkO1xuXG5cdHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCA/XG5cdFx0dmFsIDpcblx0XHRzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWRvY3VtZW50SXNIVE1MID9cblx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICkgOlxuXHRcdFx0KCB2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSApICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRudWxsO1xufTtcblxuU2l6emxlLmVzY2FwZSA9IGZ1bmN0aW9uKCBzZWwgKSB7XG5cdHJldHVybiAoIHNlbCArIFwiXCIgKS5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XG59O1xuXG5TaXp6bGUuZXJyb3IgPSBmdW5jdGlvbiggbXNnICkge1xuXHR0aHJvdyBuZXcgRXJyb3IoIFwiU3ludGF4IGVycm9yLCB1bnJlY29nbml6ZWQgZXhwcmVzc2lvbjogXCIgKyBtc2cgKTtcbn07XG5cbi8qKlxuICogRG9jdW1lbnQgc29ydGluZyBhbmQgcmVtb3ZpbmcgZHVwbGljYXRlc1xuICogQHBhcmFtIHtBcnJheUxpa2V9IHJlc3VsdHNcbiAqL1xuU2l6emxlLnVuaXF1ZVNvcnQgPSBmdW5jdGlvbiggcmVzdWx0cyApIHtcblx0dmFyIGVsZW0sXG5cdFx0ZHVwbGljYXRlcyA9IFtdLFxuXHRcdGogPSAwLFxuXHRcdGkgPSAwO1xuXG5cdC8vIFVubGVzcyB3ZSAqa25vdyogd2UgY2FuIGRldGVjdCBkdXBsaWNhdGVzLCBhc3N1bWUgdGhlaXIgcHJlc2VuY2Vcblx0aGFzRHVwbGljYXRlID0gIXN1cHBvcnQuZGV0ZWN0RHVwbGljYXRlcztcblx0c29ydElucHV0ID0gIXN1cHBvcnQuc29ydFN0YWJsZSAmJiByZXN1bHRzLnNsaWNlKCAwICk7XG5cdHJlc3VsdHMuc29ydCggc29ydE9yZGVyICk7XG5cblx0aWYgKCBoYXNEdXBsaWNhdGUgKSB7XG5cdFx0d2hpbGUgKCAoIGVsZW0gPSByZXN1bHRzWyBpKysgXSApICkge1xuXHRcdFx0aWYgKCBlbGVtID09PSByZXN1bHRzWyBpIF0gKSB7XG5cdFx0XHRcdGogPSBkdXBsaWNhdGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUgKCBqLS0gKSB7XG5cdFx0XHRyZXN1bHRzLnNwbGljZSggZHVwbGljYXRlc1sgaiBdLCAxICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2xlYXIgaW5wdXQgYWZ0ZXIgc29ydGluZyB0byByZWxlYXNlIG9iamVjdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvc2l6emxlL3B1bGwvMjI1XG5cdHNvcnRJbnB1dCA9IG51bGw7XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gZm9yIHJldHJpZXZpbmcgdGhlIHRleHQgdmFsdWUgb2YgYW4gYXJyYXkgb2YgRE9NIG5vZGVzXG4gKiBAcGFyYW0ge0FycmF5fEVsZW1lbnR9IGVsZW1cbiAqL1xuZ2V0VGV4dCA9IFNpenpsZS5nZXRUZXh0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHZhciBub2RlLFxuXHRcdHJldCA9IFwiXCIsXG5cdFx0aSA9IDAsXG5cdFx0bm9kZVR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdGlmICggIW5vZGVUeXBlICkge1xuXG5cdFx0Ly8gSWYgbm8gbm9kZVR5cGUsIHRoaXMgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gYXJyYXlcblx0XHR3aGlsZSAoICggbm9kZSA9IGVsZW1bIGkrKyBdICkgKSB7XG5cblx0XHRcdC8vIERvIG5vdCB0cmF2ZXJzZSBjb21tZW50IG5vZGVzXG5cdFx0XHRyZXQgKz0gZ2V0VGV4dCggbm9kZSApO1xuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDEgfHwgbm9kZVR5cGUgPT09IDkgfHwgbm9kZVR5cGUgPT09IDExICkge1xuXG5cdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdC8vIGlubmVyVGV4dCB1c2FnZSByZW1vdmVkIGZvciBjb25zaXN0ZW5jeSBvZiBuZXcgbGluZXMgKGpRdWVyeSAjMTExNTMpXG5cdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFRyYXZlcnNlIGl0cyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdHJldCArPSBnZXRUZXh0KCBlbGVtICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMyB8fCBub2RlVHlwZSA9PT0gNCApIHtcblx0XHRyZXR1cm4gZWxlbS5ub2RlVmFsdWU7XG5cdH1cblxuXHQvLyBEbyBub3QgaW5jbHVkZSBjb21tZW50IG9yIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24gbm9kZXNcblxuXHRyZXR1cm4gcmV0O1xufTtcblxuRXhwciA9IFNpenpsZS5zZWxlY3RvcnMgPSB7XG5cblx0Ly8gQ2FuIGJlIGFkanVzdGVkIGJ5IHRoZSB1c2VyXG5cdGNhY2hlTGVuZ3RoOiA1MCxcblxuXHRjcmVhdGVQc2V1ZG86IG1hcmtGdW5jdGlvbixcblxuXHRtYXRjaDogbWF0Y2hFeHByLFxuXG5cdGF0dHJIYW5kbGU6IHt9LFxuXG5cdGZpbmQ6IHt9LFxuXG5cdHJlbGF0aXZlOiB7XG5cdFx0XCI+XCI6IHsgZGlyOiBcInBhcmVudE5vZGVcIiwgZmlyc3Q6IHRydWUgfSxcblx0XHRcIiBcIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiIH0sXG5cdFx0XCIrXCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiflwiOiB7IGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIiB9XG5cdH0sXG5cblx0cHJlRmlsdGVyOiB7XG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdG1hdGNoWyAxIF0gPSBtYXRjaFsgMSBdLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIGdpdmVuIHZhbHVlIHRvIG1hdGNoWzNdIHdoZXRoZXIgcXVvdGVkIG9yIHVucXVvdGVkXG5cdFx0XHRtYXRjaFsgMyBdID0gKCBtYXRjaFsgMyBdIHx8IG1hdGNoWyA0IF0gfHxcblx0XHRcdFx0bWF0Y2hbIDUgXSB8fCBcIlwiICkucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblxuXHRcdFx0aWYgKCBtYXRjaFsgMiBdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWyAzIF0gPSBcIiBcIiArIG1hdGNoWyAzIF0gKyBcIiBcIjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoLnNsaWNlKCAwLCA0ICk7XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXG5cdFx0XHQvKiBtYXRjaGVzIGZyb20gbWF0Y2hFeHByW1wiQ0hJTERcIl1cblx0XHRcdFx0MSB0eXBlIChvbmx5fG50aHwuLi4pXG5cdFx0XHRcdDIgd2hhdCAoY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0MyBhcmd1bWVudCAoZXZlbnxvZGR8XFxkKnxcXGQqbihbKy1dXFxkKyk/fC4uLilcblx0XHRcdFx0NCB4bi1jb21wb25lbnQgb2YgeG4reSBhcmd1bWVudCAoWystXT9cXGQqbnwpXG5cdFx0XHRcdDUgc2lnbiBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NiB4IG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ3IHNpZ24gb2YgeS1jb21wb25lbnRcblx0XHRcdFx0OCB5IG9mIHktY29tcG9uZW50XG5cdFx0XHQqL1xuXHRcdFx0bWF0Y2hbIDEgXSA9IG1hdGNoWyAxIF0udG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0aWYgKCBtYXRjaFsgMSBdLnNsaWNlKCAwLCAzICkgPT09IFwibnRoXCIgKSB7XG5cblx0XHRcdFx0Ly8gbnRoLSogcmVxdWlyZXMgYXJndW1lbnRcblx0XHRcdFx0aWYgKCAhbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWyAwIF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG51bWVyaWMgeCBhbmQgeSBwYXJhbWV0ZXJzIGZvciBFeHByLmZpbHRlci5DSElMRFxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IGZhbHNlL3RydWUgY2FzdCByZXNwZWN0aXZlbHkgdG8gMC8xXG5cdFx0XHRcdG1hdGNoWyA0IF0gPSArKCBtYXRjaFsgNCBdID9cblx0XHRcdFx0XHRtYXRjaFsgNSBdICsgKCBtYXRjaFsgNiBdIHx8IDEgKSA6XG5cdFx0XHRcdFx0MiAqICggbWF0Y2hbIDMgXSA9PT0gXCJldmVuXCIgfHwgbWF0Y2hbIDMgXSA9PT0gXCJvZGRcIiApICk7XG5cdFx0XHRcdG1hdGNoWyA1IF0gPSArKCAoIG1hdGNoWyA3IF0gKyBtYXRjaFsgOCBdICkgfHwgbWF0Y2hbIDMgXSA9PT0gXCJvZGRcIiApO1xuXG5cdFx0XHRcdC8vIG90aGVyIHR5cGVzIHByb2hpYml0IGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFsgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblx0XHR9LFxuXG5cdFx0XCJQU0VVRE9cIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0dmFyIGV4Y2Vzcyxcblx0XHRcdFx0dW5xdW90ZWQgPSAhbWF0Y2hbIDYgXSAmJiBtYXRjaFsgMiBdO1xuXG5cdFx0XHRpZiAoIG1hdGNoRXhwclsgXCJDSElMRFwiIF0udGVzdCggbWF0Y2hbIDAgXSApICkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWNjZXB0IHF1b3RlZCBhcmd1bWVudHMgYXMtaXNcblx0XHRcdGlmICggbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0bWF0Y2hbIDIgXSA9IG1hdGNoWyA0IF0gfHwgbWF0Y2hbIDUgXSB8fCBcIlwiO1xuXG5cdFx0XHQvLyBTdHJpcCBleGNlc3MgY2hhcmFjdGVycyBmcm9tIHVucXVvdGVkIGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggdW5xdW90ZWQgJiYgcnBzZXVkby50ZXN0KCB1bnF1b3RlZCApICYmXG5cblx0XHRcdFx0Ly8gR2V0IGV4Y2VzcyBmcm9tIHRva2VuaXplIChyZWN1cnNpdmVseSlcblx0XHRcdFx0KCBleGNlc3MgPSB0b2tlbml6ZSggdW5xdW90ZWQsIHRydWUgKSApICYmXG5cblx0XHRcdFx0Ly8gYWR2YW5jZSB0byB0aGUgbmV4dCBjbG9zaW5nIHBhcmVudGhlc2lzXG5cdFx0XHRcdCggZXhjZXNzID0gdW5xdW90ZWQuaW5kZXhPZiggXCIpXCIsIHVucXVvdGVkLmxlbmd0aCAtIGV4Y2VzcyApIC0gdW5xdW90ZWQubGVuZ3RoICkgKSB7XG5cblx0XHRcdFx0Ly8gZXhjZXNzIGlzIGEgbmVnYXRpdmUgaW5kZXhcblx0XHRcdFx0bWF0Y2hbIDAgXSA9IG1hdGNoWyAwIF0uc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0XHRtYXRjaFsgMiBdID0gdW5xdW90ZWQuc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXR1cm4gb25seSBjYXB0dXJlcyBuZWVkZWQgYnkgdGhlIHBzZXVkbyBmaWx0ZXIgbWV0aG9kICh0eXBlIGFuZCBhcmd1bWVudClcblx0XHRcdHJldHVybiBtYXRjaC5zbGljZSggMCwgMyApO1xuXHRcdH1cblx0fSxcblxuXHRmaWx0ZXI6IHtcblxuXHRcdFwiVEFHXCI6IGZ1bmN0aW9uKCBub2RlTmFtZVNlbGVjdG9yICkge1xuXHRcdFx0dmFyIG5vZGVOYW1lID0gbm9kZU5hbWVTZWxlY3Rvci5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbm9kZU5hbWVTZWxlY3RvciA9PT0gXCIqXCIgP1xuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWU7XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0xBU1NcIjogZnVuY3Rpb24oIGNsYXNzTmFtZSApIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gY2xhc3NDYWNoZVsgY2xhc3NOYW1lICsgXCIgXCIgXTtcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm4gfHxcblx0XHRcdFx0KCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCggXCIoXnxcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XHRcdFwiKVwiICsgY2xhc3NOYW1lICsgXCIoXCIgKyB3aGl0ZXNwYWNlICsgXCJ8JClcIiApICkgJiYgY2xhc3NDYWNoZShcblx0XHRcdFx0XHRcdGNsYXNzTmFtZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QoXG5cdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGVsZW0uY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW0uY2xhc3NOYW1lIHx8XG5cdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGVsZW0uZ2V0QXR0cmlidXRlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggXCJjbGFzc1wiICkgfHxcblx0XHRcdFx0XHRcdFx0XHRcIlwiXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBuYW1lLCBvcGVyYXRvciwgY2hlY2sgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBTaXp6bGUuYXR0ciggZWxlbSwgbmFtZSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIiE9XCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCAhb3BlcmF0b3IgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXN1bHQgKz0gXCJcIjtcblxuXHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cblx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIj1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiE9XCIgPyByZXN1bHQgIT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJePVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPT09IDAgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIio9XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIkPVwiID8gY2hlY2sgJiYgcmVzdWx0LnNsaWNlKCAtY2hlY2subGVuZ3RoICkgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ+PVwiID8gKCBcIiBcIiArIHJlc3VsdC5yZXBsYWNlKCByd2hpdGVzcGFjZSwgXCIgXCIgKSArIFwiIFwiICkuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ8PVwiID8gcmVzdWx0ID09PSBjaGVjayB8fCByZXN1bHQuc2xpY2UoIDAsIGNoZWNrLmxlbmd0aCArIDEgKSA9PT0gY2hlY2sgKyBcIi1cIiA6XG5cdFx0XHRcdFx0ZmFsc2U7XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCB0eXBlLCB3aGF0LCBfYXJndW1lbnQsIGZpcnN0LCBsYXN0ICkge1xuXHRcdFx0dmFyIHNpbXBsZSA9IHR5cGUuc2xpY2UoIDAsIDMgKSAhPT0gXCJudGhcIixcblx0XHRcdFx0Zm9yd2FyZCA9IHR5cGUuc2xpY2UoIC00ICkgIT09IFwibGFzdFwiLFxuXHRcdFx0XHRvZlR5cGUgPSB3aGF0ID09PSBcIm9mLXR5cGVcIjtcblxuXHRcdFx0cmV0dXJuIGZpcnN0ID09PSAxICYmIGxhc3QgPT09IDAgP1xuXG5cdFx0XHRcdC8vIFNob3J0Y3V0IGZvciA6bnRoLSoobilcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuICEhZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0XHR9IDpcblxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgY2FjaGUsIHVuaXF1ZUNhY2hlLCBvdXRlckNhY2hlLCBub2RlLCBub2RlSW5kZXgsIHN0YXJ0LFxuXHRcdFx0XHRcdFx0ZGlyID0gc2ltcGxlICE9PSBmb3J3YXJkID8gXCJuZXh0U2libGluZ1wiIDogXCJwcmV2aW91c1NpYmxpbmdcIixcblx0XHRcdFx0XHRcdHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZSxcblx0XHRcdFx0XHRcdG5hbWUgPSBvZlR5cGUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0dXNlQ2FjaGUgPSAheG1sICYmICFvZlR5cGUsXG5cdFx0XHRcdFx0XHRkaWZmID0gZmFsc2U7XG5cblx0XHRcdFx0XHRpZiAoIHBhcmVudCApIHtcblxuXHRcdFx0XHRcdFx0Ly8gOihmaXJzdHxsYXN0fG9ubHkpLShjaGlsZHxvZi10eXBlKVxuXHRcdFx0XHRcdFx0aWYgKCBzaW1wbGUgKSB7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICggZGlyICkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gbm9kZVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmV2ZXJzZSBkaXJlY3Rpb24gZm9yIDpvbmx5LSogKGlmIHdlIGhhdmVuJ3QgeWV0IGRvbmUgc28pXG5cdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBkaXIgPSB0eXBlID09PSBcIm9ubHlcIiAmJiAhc3RhcnQgJiYgXCJuZXh0U2libGluZ1wiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRzdGFydCA9IFsgZm9yd2FyZCA/IHBhcmVudC5maXJzdENoaWxkIDogcGFyZW50Lmxhc3RDaGlsZCBdO1xuXG5cdFx0XHRcdFx0XHQvLyBub24teG1sIDpudGgtY2hpbGQoLi4uKSBzdG9yZXMgY2FjaGUgZGF0YSBvbiBgcGFyZW50YFxuXHRcdFx0XHRcdFx0aWYgKCBmb3J3YXJkICYmIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNlZWsgYGVsZW1gIGZyb20gYSBwcmV2aW91c2x5LWNhY2hlZCBpbmRleFxuXG5cdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHBhcmVudDtcblx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0Y2FjaGUgPSB1bmlxdWVDYWNoZVsgdHlwZSBdIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdGRpZmYgPSBub2RlSW5kZXggJiYgY2FjaGVbIDIgXTtcblx0XHRcdFx0XHRcdFx0bm9kZSA9IG5vZGVJbmRleCAmJiBwYXJlbnQuY2hpbGROb2Rlc1sgbm9kZUluZGV4IF07XG5cblx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSArK25vZGVJbmRleCAmJiBub2RlICYmIG5vZGVbIGRpciBdIHx8XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBGYWxsYmFjayB0byBzZWVraW5nIGBlbGVtYCBmcm9tIHRoZSBzdGFydFxuXHRcdFx0XHRcdFx0XHRcdCggZGlmZiA9IG5vZGVJbmRleCA9IDAgKSB8fCBzdGFydC5wb3AoKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gV2hlbiBmb3VuZCwgY2FjaGUgaW5kZXhlcyBvbiBgcGFyZW50YCBhbmQgYnJlYWtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIG5vZGUubm9kZVR5cGUgPT09IDEgJiYgKytkaWZmICYmIG5vZGUgPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsgdHlwZSBdID0gWyBkaXJydW5zLCBub2RlSW5kZXgsIGRpZmYgXTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFVzZSBwcmV2aW91c2x5LWNhY2hlZCBlbGVtZW50IGluZGV4IGlmIGF2YWlsYWJsZVxuXHRcdFx0XHRcdFx0XHRpZiAoIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBjYWNoZVsgMSBdO1xuXHRcdFx0XHRcdFx0XHRcdGRpZmYgPSBub2RlSW5kZXg7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyB4bWwgOm50aC1jaGlsZCguLi4pXG5cdFx0XHRcdFx0XHRcdC8vIG9yIDpudGgtbGFzdC1jaGlsZCguLi4pIG9yIDpudGgoLWxhc3QpPy1vZi10eXBlKC4uLilcblx0XHRcdFx0XHRcdFx0aWYgKCBkaWZmID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFVzZSB0aGUgc2FtZSBsb29wIGFzIGFib3ZlIHRvIHNlZWsgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSArK25vZGVJbmRleCAmJiBub2RlICYmIG5vZGVbIGRpciBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQoIGRpZmYgPSBub2RlSW5kZXggPSAwICkgfHwgc3RhcnQucG9wKCkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCAoIG9mVHlwZSA/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSA6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZVR5cGUgPT09IDEgKSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrK2RpZmYgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2FjaGUgdGhlIGluZGV4IG9mIGVhY2ggZW5jb3VudGVyZWQgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHVzZUNhY2hlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEluY29ycG9yYXRlIHRoZSBvZmZzZXQsIHRoZW4gY2hlY2sgYWdhaW5zdCBjeWNsZSBzaXplXG5cdFx0XHRcdFx0XHRkaWZmIC09IGxhc3Q7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gZmlyc3QgfHwgKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBwc2V1ZG8sIGFyZ3VtZW50ICkge1xuXG5cdFx0XHQvLyBwc2V1ZG8tY2xhc3MgbmFtZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmVcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jcHNldWRvLWNsYXNzZXNcblx0XHRcdC8vIFByaW9yaXRpemUgYnkgY2FzZSBzZW5zaXRpdml0eSBpbiBjYXNlIGN1c3RvbSBwc2V1ZG9zIGFyZSBhZGRlZCB3aXRoIHVwcGVyY2FzZSBsZXR0ZXJzXG5cdFx0XHQvLyBSZW1lbWJlciB0aGF0IHNldEZpbHRlcnMgaW5oZXJpdHMgZnJvbSBwc2V1ZG9zXG5cdFx0XHR2YXIgYXJncyxcblx0XHRcdFx0Zm4gPSBFeHByLnBzZXVkb3NbIHBzZXVkbyBdIHx8IEV4cHIuc2V0RmlsdGVyc1sgcHNldWRvLnRvTG93ZXJDYXNlKCkgXSB8fFxuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiICsgcHNldWRvICk7XG5cblx0XHRcdC8vIFRoZSB1c2VyIG1heSB1c2UgY3JlYXRlUHNldWRvIHRvIGluZGljYXRlIHRoYXRcblx0XHRcdC8vIGFyZ3VtZW50cyBhcmUgbmVlZGVkIHRvIGNyZWF0ZSB0aGUgZmlsdGVyIGZ1bmN0aW9uXG5cdFx0XHQvLyBqdXN0IGFzIFNpenpsZSBkb2VzXG5cdFx0XHRpZiAoIGZuWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHJldHVybiBmbiggYXJndW1lbnQgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQnV0IG1haW50YWluIHN1cHBvcnQgZm9yIG9sZCBzaWduYXR1cmVzXG5cdFx0XHRpZiAoIGZuLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGFyZ3MgPSBbIHBzZXVkbywgcHNldWRvLCBcIlwiLCBhcmd1bWVudCBdO1xuXHRcdFx0XHRyZXR1cm4gRXhwci5zZXRGaWx0ZXJzLmhhc093blByb3BlcnR5KCBwc2V1ZG8udG9Mb3dlckNhc2UoKSApID9cblx0XHRcdFx0XHRtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIGlkeCxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCA9IGZuKCBzZWVkLCBhcmd1bWVudCApLFxuXHRcdFx0XHRcdFx0XHRpID0gbWF0Y2hlZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWR4ID0gaW5kZXhPZiggc2VlZCwgbWF0Y2hlZFsgaSBdICk7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGlkeCBdID0gISggbWF0Y2hlc1sgaWR4IF0gPSBtYXRjaGVkWyBpIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZuKCBlbGVtLCAwLCBhcmdzICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuO1xuXHRcdH1cblx0fSxcblxuXHRwc2V1ZG9zOiB7XG5cblx0XHQvLyBQb3RlbnRpYWxseSBjb21wbGV4IHBzZXVkb3Ncblx0XHRcIm5vdFwiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblxuXHRcdFx0Ly8gVHJpbSB0aGUgc2VsZWN0b3IgcGFzc2VkIHRvIGNvbXBpbGVcblx0XHRcdC8vIHRvIGF2b2lkIHRyZWF0aW5nIGxlYWRpbmcgYW5kIHRyYWlsaW5nXG5cdFx0XHQvLyBzcGFjZXMgYXMgY29tYmluYXRvcnNcblx0XHRcdHZhciBpbnB1dCA9IFtdLFxuXHRcdFx0XHRyZXN1bHRzID0gW10sXG5cdFx0XHRcdG1hdGNoZXIgPSBjb21waWxlKCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICkgKTtcblxuXHRcdFx0cmV0dXJuIG1hdGNoZXJbIGV4cGFuZG8gXSA/XG5cdFx0XHRcdG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMsIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQgPSBtYXRjaGVyKCBzZWVkLCBudWxsLCB4bWwsIFtdICksXG5cdFx0XHRcdFx0XHRpID0gc2VlZC5sZW5ndGg7XG5cblx0XHRcdFx0XHQvLyBNYXRjaCBlbGVtZW50cyB1bm1hdGNoZWQgYnkgYG1hdGNoZXJgXG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IHVubWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGkgXSA9ICEoIG1hdGNoZXNbIGkgXSA9IGVsZW0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdGlucHV0WyAwIF0gPSBlbGVtO1xuXHRcdFx0XHRcdG1hdGNoZXIoIGlucHV0LCBudWxsLCB4bWwsIHJlc3VsdHMgKTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGtlZXAgdGhlIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRcdFx0aW5wdXRbIDAgXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuICFyZXN1bHRzLnBvcCgpO1xuXHRcdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdFwiaGFzXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gU2l6emxlKCBzZWxlY3RvciwgZWxlbSApLmxlbmd0aCA+IDA7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdFwiY29udGFpbnNcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiAoIGVsZW0udGV4dENvbnRlbnQgfHwgZ2V0VGV4dCggZWxlbSApICkuaW5kZXhPZiggdGV4dCApID4gLTE7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdC8vIFwiV2hldGhlciBhbiBlbGVtZW50IGlzIHJlcHJlc2VudGVkIGJ5IGEgOmxhbmcoKSBzZWxlY3RvclxuXHRcdC8vIGlzIGJhc2VkIHNvbGVseSBvbiB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlXG5cdFx0Ly8gYmVpbmcgZXF1YWwgdG8gdGhlIGlkZW50aWZpZXIgQyxcblx0XHQvLyBvciBiZWdpbm5pbmcgd2l0aCB0aGUgaWRlbnRpZmllciBDIGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IFwiLVwiLlxuXHRcdC8vIFRoZSBtYXRjaGluZyBvZiBDIGFnYWluc3QgdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZSBpcyBwZXJmb3JtZWQgY2FzZS1pbnNlbnNpdGl2ZWx5LlxuXHRcdC8vIFRoZSBpZGVudGlmaWVyIEMgZG9lcyBub3QgaGF2ZSB0byBiZSBhIHZhbGlkIGxhbmd1YWdlIG5hbWUuXCJcblx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2xhbmctcHNldWRvXG5cdFx0XCJsYW5nXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIGxhbmcgKSB7XG5cblx0XHRcdC8vIGxhbmcgdmFsdWUgbXVzdCBiZSBhIHZhbGlkIGlkZW50aWZpZXJcblx0XHRcdGlmICggIXJpZGVudGlmaWVyLnRlc3QoIGxhbmcgfHwgXCJcIiApICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgbGFuZzogXCIgKyBsYW5nICk7XG5cdFx0XHR9XG5cdFx0XHRsYW5nID0gbGFuZy5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBlbGVtTGFuZztcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdGlmICggKCBlbGVtTGFuZyA9IGRvY3VtZW50SXNIVE1MID9cblx0XHRcdFx0XHRcdGVsZW0ubGFuZyA6XG5cdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggXCJ4bWw6bGFuZ1wiICkgfHwgZWxlbS5nZXRBdHRyaWJ1dGUoIFwibGFuZ1wiICkgKSApIHtcblxuXHRcdFx0XHRcdFx0ZWxlbUxhbmcgPSBlbGVtTGFuZy50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1MYW5nID09PSBsYW5nIHx8IGVsZW1MYW5nLmluZGV4T2YoIGxhbmcgKyBcIi1cIiApID09PSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSB3aGlsZSAoICggZWxlbSA9IGVsZW0ucGFyZW50Tm9kZSApICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHQvLyBNaXNjZWxsYW5lb3VzXG5cdFx0XCJ0YXJnZXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRcdHJldHVybiBoYXNoICYmIGhhc2guc2xpY2UoIDEgKSA9PT0gZWxlbS5pZDtcblx0XHR9LFxuXG5cdFx0XCJyb290XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY0VsZW07XG5cdFx0fSxcblxuXHRcdFwiZm9jdXNcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJlxuXHRcdFx0XHQoICFkb2N1bWVudC5oYXNGb2N1cyB8fCBkb2N1bWVudC5oYXNGb2N1cygpICkgJiZcblx0XHRcdFx0ISEoIGVsZW0udHlwZSB8fCBlbGVtLmhyZWYgfHwgfmVsZW0udGFiSW5kZXggKTtcblx0XHR9LFxuXG5cdFx0Ly8gQm9vbGVhbiBwcm9wZXJ0aWVzXG5cdFx0XCJlbmFibGVkXCI6IGNyZWF0ZURpc2FibGVkUHNldWRvKCBmYWxzZSApLFxuXHRcdFwiZGlzYWJsZWRcIjogY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIHRydWUgKSxcblxuXHRcdFwiY2hlY2tlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gSW4gQ1NTMywgOmNoZWNrZWQgc2hvdWxkIHJldHVybiBib3RoIGNoZWNrZWQgYW5kIHNlbGVjdGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0dmFyIG5vZGVOYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuICggbm9kZU5hbWUgPT09IFwiaW5wdXRcIiAmJiAhIWVsZW0uY2hlY2tlZCApIHx8XG5cdFx0XHRcdCggbm9kZU5hbWUgPT09IFwib3B0aW9uXCIgJiYgISFlbGVtLnNlbGVjdGVkICk7XG5cdFx0fSxcblxuXHRcdFwic2VsZWN0ZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIEFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IG1ha2VzIHNlbGVjdGVkLWJ5LWRlZmF1bHRcblx0XHRcdC8vIG9wdGlvbnMgaW4gU2FmYXJpIHdvcmsgcHJvcGVybHlcblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdFx0XHRcdGVsZW0ucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbS5zZWxlY3RlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0Ly8gQ29udGVudHNcblx0XHRcImVtcHR5XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2VtcHR5LXBzZXVkb1xuXHRcdFx0Ly8gOmVtcHR5IGlzIG5lZ2F0ZWQgYnkgZWxlbWVudCAoMSkgb3IgY29udGVudCBub2RlcyAodGV4dDogMzsgY2RhdGE6IDQ7IGVudGl0eSByZWY6IDUpLFxuXHRcdFx0Ly8gICBidXQgbm90IGJ5IG90aGVycyAoY29tbWVudDogODsgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbjogNzsgZXRjLilcblx0XHRcdC8vIG5vZGVUeXBlIDwgNiB3b3JrcyBiZWNhdXNlIGF0dHJpYnV0ZXMgKDIpIGRvIG5vdCBhcHBlYXIgYXMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPCA2ICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdFwicGFyZW50XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICFFeHByLnBzZXVkb3NbIFwiZW1wdHlcIiBdKCBlbGVtICk7XG5cdFx0fSxcblxuXHRcdC8vIEVsZW1lbnQvaW5wdXQgdHlwZXNcblx0XHRcImhlYWRlclwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaGVhZGVyLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJpbnB1dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaW5wdXRzLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJidXR0b25cIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSBcImJ1dHRvblwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCI7XG5cdFx0fSxcblxuXHRcdFwidGV4dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBhdHRyO1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmXG5cdFx0XHRcdGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCIgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRTw4XG5cdFx0XHRcdC8vIE5ldyBIVE1MNSBhdHRyaWJ1dGUgdmFsdWVzIChlLmcuLCBcInNlYXJjaFwiKSBhcHBlYXIgd2l0aCBlbGVtLnR5cGUgPT09IFwidGV4dFwiXG5cdFx0XHRcdCggKCBhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICkgKSA9PSBudWxsIHx8XG5cdFx0XHRcdFx0YXR0ci50b0xvd2VyQ2FzZSgpID09PSBcInRleHRcIiApO1xuXHRcdH0sXG5cblx0XHQvLyBQb3NpdGlvbi1pbi1jb2xsZWN0aW9uXG5cdFx0XCJmaXJzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbIDAgXTtcblx0XHR9ICksXG5cblx0XHRcImxhc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIF9tYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHJldHVybiBbIGxlbmd0aCAtIDEgXTtcblx0XHR9ICksXG5cblx0XHRcImVxXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBfbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0cmV0dXJuIFsgYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudCBdO1xuXHRcdH0gKSxcblxuXHRcdFwiZXZlblwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDA7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJvZGRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAxO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwibHRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID9cblx0XHRcdFx0YXJndW1lbnQgKyBsZW5ndGggOlxuXHRcdFx0XHRhcmd1bWVudCA+IGxlbmd0aCA/XG5cdFx0XHRcdFx0bGVuZ3RoIDpcblx0XHRcdFx0XHRhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgLS1pID49IDA7ICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcImd0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7ICsraSA8IGxlbmd0aDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKVxuXHR9XG59O1xuXG5FeHByLnBzZXVkb3NbIFwibnRoXCIgXSA9IEV4cHIucHNldWRvc1sgXCJlcVwiIF07XG5cbi8vIEFkZCBidXR0b24vaW5wdXQgdHlwZSBwc2V1ZG9zXG5mb3IgKCBpIGluIHsgcmFkaW86IHRydWUsIGNoZWNrYm94OiB0cnVlLCBmaWxlOiB0cnVlLCBwYXNzd29yZDogdHJ1ZSwgaW1hZ2U6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVJbnB1dFBzZXVkbyggaSApO1xufVxuZm9yICggaSBpbiB7IHN1Ym1pdDogdHJ1ZSwgcmVzZXQ6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVCdXR0b25Qc2V1ZG8oIGkgKTtcbn1cblxuLy8gRWFzeSBBUEkgZm9yIGNyZWF0aW5nIG5ldyBzZXRGaWx0ZXJzXG5mdW5jdGlvbiBzZXRGaWx0ZXJzKCkge31cbnNldEZpbHRlcnMucHJvdG90eXBlID0gRXhwci5maWx0ZXJzID0gRXhwci5wc2V1ZG9zO1xuRXhwci5zZXRGaWx0ZXJzID0gbmV3IHNldEZpbHRlcnMoKTtcblxudG9rZW5pemUgPSBTaXp6bGUudG9rZW5pemUgPSBmdW5jdGlvbiggc2VsZWN0b3IsIHBhcnNlT25seSApIHtcblx0dmFyIG1hdGNoZWQsIG1hdGNoLCB0b2tlbnMsIHR5cGUsXG5cdFx0c29GYXIsIGdyb3VwcywgcHJlRmlsdGVycyxcblx0XHRjYWNoZWQgPSB0b2tlbkNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF07XG5cblx0aWYgKCBjYWNoZWQgKSB7XG5cdFx0cmV0dXJuIHBhcnNlT25seSA/IDAgOiBjYWNoZWQuc2xpY2UoIDAgKTtcblx0fVxuXG5cdHNvRmFyID0gc2VsZWN0b3I7XG5cdGdyb3VwcyA9IFtdO1xuXHRwcmVGaWx0ZXJzID0gRXhwci5wcmVGaWx0ZXI7XG5cblx0d2hpbGUgKCBzb0ZhciApIHtcblxuXHRcdC8vIENvbW1hIGFuZCBmaXJzdCBydW5cblx0XHRpZiAoICFtYXRjaGVkIHx8ICggbWF0Y2ggPSByY29tbWEuZXhlYyggc29GYXIgKSApICkge1xuXHRcdFx0aWYgKCBtYXRjaCApIHtcblxuXHRcdFx0XHQvLyBEb24ndCBjb25zdW1lIHRyYWlsaW5nIGNvbW1hcyBhcyB2YWxpZFxuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaFsgMCBdLmxlbmd0aCApIHx8IHNvRmFyO1xuXHRcdFx0fVxuXHRcdFx0Z3JvdXBzLnB1c2goICggdG9rZW5zID0gW10gKSApO1xuXHRcdH1cblxuXHRcdG1hdGNoZWQgPSBmYWxzZTtcblxuXHRcdC8vIENvbWJpbmF0b3JzXG5cdFx0aWYgKCAoIG1hdGNoID0gcmNvbWJpbmF0b3JzLmV4ZWMoIHNvRmFyICkgKSApIHtcblx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0dG9rZW5zLnB1c2goIHtcblx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cblx0XHRcdFx0Ly8gQ2FzdCBkZXNjZW5kYW50IGNvbWJpbmF0b3JzIHRvIHNwYWNlXG5cdFx0XHRcdHR5cGU6IG1hdGNoWyAwIF0ucmVwbGFjZSggcnRyaW0sIFwiIFwiIClcblx0XHRcdH0gKTtcblx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmlsdGVyc1xuXHRcdGZvciAoIHR5cGUgaW4gRXhwci5maWx0ZXIgKSB7XG5cdFx0XHRpZiAoICggbWF0Y2ggPSBtYXRjaEV4cHJbIHR5cGUgXS5leGVjKCBzb0ZhciApICkgJiYgKCAhcHJlRmlsdGVyc1sgdHlwZSBdIHx8XG5cdFx0XHRcdCggbWF0Y2ggPSBwcmVGaWx0ZXJzWyB0eXBlIF0oIG1hdGNoICkgKSApICkge1xuXHRcdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdFx0dG9rZW5zLnB1c2goIHtcblx0XHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblx0XHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRcdG1hdGNoZXM6IG1hdGNoXG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hlZC5sZW5ndGggKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICFtYXRjaGVkICkge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGludmFsaWQgZXhjZXNzXG5cdC8vIGlmIHdlJ3JlIGp1c3QgcGFyc2luZ1xuXHQvLyBPdGhlcndpc2UsIHRocm93IGFuIGVycm9yIG9yIHJldHVybiB0b2tlbnNcblx0cmV0dXJuIHBhcnNlT25seSA/XG5cdFx0c29GYXIubGVuZ3RoIDpcblx0XHRzb0ZhciA/XG5cdFx0XHRTaXp6bGUuZXJyb3IoIHNlbGVjdG9yICkgOlxuXG5cdFx0XHQvLyBDYWNoZSB0aGUgdG9rZW5zXG5cdFx0XHR0b2tlbkNhY2hlKCBzZWxlY3RvciwgZ3JvdXBzICkuc2xpY2UoIDAgKTtcbn07XG5cbmZ1bmN0aW9uIHRvU2VsZWN0b3IoIHRva2VucyApIHtcblx0dmFyIGkgPSAwLFxuXHRcdGxlbiA9IHRva2Vucy5sZW5ndGgsXG5cdFx0c2VsZWN0b3IgPSBcIlwiO1xuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRzZWxlY3RvciArPSB0b2tlbnNbIGkgXS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIGFkZENvbWJpbmF0b3IoIG1hdGNoZXIsIGNvbWJpbmF0b3IsIGJhc2UgKSB7XG5cdHZhciBkaXIgPSBjb21iaW5hdG9yLmRpcixcblx0XHRza2lwID0gY29tYmluYXRvci5uZXh0LFxuXHRcdGtleSA9IHNraXAgfHwgZGlyLFxuXHRcdGNoZWNrTm9uRWxlbWVudHMgPSBiYXNlICYmIGtleSA9PT0gXCJwYXJlbnROb2RlXCIsXG5cdFx0ZG9uZU5hbWUgPSBkb25lKys7XG5cblx0cmV0dXJuIGNvbWJpbmF0b3IuZmlyc3QgP1xuXG5cdFx0Ly8gQ2hlY2sgYWdhaW5zdCBjbG9zZXN0IGFuY2VzdG9yL3ByZWNlZGluZyBlbGVtZW50XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSA6XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGFsbCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudHNcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIG9sZENhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSxcblx0XHRcdFx0bmV3Q2FjaGUgPSBbIGRpcnJ1bnMsIGRvbmVOYW1lIF07XG5cblx0XHRcdC8vIFdlIGNhbid0IHNldCBhcmJpdHJhcnkgZGF0YSBvbiBYTUwgbm9kZXMsIHNvIHRoZXkgZG9uJ3QgYmVuZWZpdCBmcm9tIGNvbWJpbmF0b3IgY2FjaGluZ1xuXHRcdFx0aWYgKCB4bWwgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IGVsZW1bIGV4cGFuZG8gXSB8fCAoIGVsZW1bIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNraXAgJiYgc2tpcCA9PT0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRcdFx0XHRlbGVtID0gZWxlbVsgZGlyIF0gfHwgZWxlbTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICggb2xkQ2FjaGUgPSB1bmlxdWVDYWNoZVsga2V5IF0gKSAmJlxuXHRcdFx0XHRcdFx0XHRvbGRDYWNoZVsgMCBdID09PSBkaXJydW5zICYmIG9sZENhY2hlWyAxIF0gPT09IGRvbmVOYW1lICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEFzc2lnbiB0byBuZXdDYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoIG5ld0NhY2hlWyAyIF0gPSBvbGRDYWNoZVsgMiBdICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJldXNlIG5ld2NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIGtleSBdID0gbmV3Q2FjaGU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQSBtYXRjaCBtZWFucyB3ZSdyZSBkb25lOyBhIGZhaWwgbWVhbnMgd2UgaGF2ZSB0byBrZWVwIGNoZWNraW5nXG5cdFx0XHRcdFx0XHRcdGlmICggKCBuZXdDYWNoZVsgMiBdID0gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApIHtcblx0cmV0dXJuIG1hdGNoZXJzLmxlbmd0aCA+IDEgP1xuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgaSA9IG1hdGNoZXJzLmxlbmd0aDtcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoICFtYXRjaGVyc1sgaSBdKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gOlxuXHRcdG1hdGNoZXJzWyAwIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGxlQ29udGV4dHMoIHNlbGVjdG9yLCBjb250ZXh0cywgcmVzdWx0cyApIHtcblx0dmFyIGkgPSAwLFxuXHRcdGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0U2l6emxlKCBzZWxlY3RvciwgY29udGV4dHNbIGkgXSwgcmVzdWx0cyApO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5mdW5jdGlvbiBjb25kZW5zZSggdW5tYXRjaGVkLCBtYXAsIGZpbHRlciwgY29udGV4dCwgeG1sICkge1xuXHR2YXIgZWxlbSxcblx0XHRuZXdVbm1hdGNoZWQgPSBbXSxcblx0XHRpID0gMCxcblx0XHRsZW4gPSB1bm1hdGNoZWQubGVuZ3RoLFxuXHRcdG1hcHBlZCA9IG1hcCAhPSBudWxsO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKCBlbGVtID0gdW5tYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdGlmICggIWZpbHRlciB8fCBmaWx0ZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRuZXdVbm1hdGNoZWQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRpZiAoIG1hcHBlZCApIHtcblx0XHRcdFx0XHRtYXAucHVzaCggaSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG5ld1VubWF0Y2hlZDtcbn1cblxuZnVuY3Rpb24gc2V0TWF0Y2hlciggcHJlRmlsdGVyLCBzZWxlY3RvciwgbWF0Y2hlciwgcG9zdEZpbHRlciwgcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICkge1xuXHRpZiAoIHBvc3RGaWx0ZXIgJiYgIXBvc3RGaWx0ZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmlsdGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbHRlciApO1xuXHR9XG5cdGlmICggcG9zdEZpbmRlciAmJiAhcG9zdEZpbmRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaW5kZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKTtcblx0fVxuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgcmVzdWx0cywgY29udGV4dCwgeG1sICkge1xuXHRcdHZhciB0ZW1wLCBpLCBlbGVtLFxuXHRcdFx0cHJlTWFwID0gW10sXG5cdFx0XHRwb3N0TWFwID0gW10sXG5cdFx0XHRwcmVleGlzdGluZyA9IHJlc3VsdHMubGVuZ3RoLFxuXG5cdFx0XHQvLyBHZXQgaW5pdGlhbCBlbGVtZW50cyBmcm9tIHNlZWQgb3IgY29udGV4dFxuXHRcdFx0ZWxlbXMgPSBzZWVkIHx8IG11bHRpcGxlQ29udGV4dHMoXG5cdFx0XHRcdHNlbGVjdG9yIHx8IFwiKlwiLFxuXHRcdFx0XHRjb250ZXh0Lm5vZGVUeXBlID8gWyBjb250ZXh0IF0gOiBjb250ZXh0LFxuXHRcdFx0XHRbXVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gUHJlZmlsdGVyIHRvIGdldCBtYXRjaGVyIGlucHV0LCBwcmVzZXJ2aW5nIGEgbWFwIGZvciBzZWVkLXJlc3VsdHMgc3luY2hyb25pemF0aW9uXG5cdFx0XHRtYXRjaGVySW4gPSBwcmVGaWx0ZXIgJiYgKCBzZWVkIHx8ICFzZWxlY3RvciApID9cblx0XHRcdFx0Y29uZGVuc2UoIGVsZW1zLCBwcmVNYXAsIHByZUZpbHRlciwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRlbGVtcyxcblxuXHRcdFx0bWF0Y2hlck91dCA9IG1hdGNoZXIgP1xuXG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgYSBwb3N0RmluZGVyLCBvciBmaWx0ZXJlZCBzZWVkLCBvciBub24tc2VlZCBwb3N0RmlsdGVyIG9yIHByZWV4aXN0aW5nIHJlc3VsdHMsXG5cdFx0XHRcdHBvc3RGaW5kZXIgfHwgKCBzZWVkID8gcHJlRmlsdGVyIDogcHJlZXhpc3RpbmcgfHwgcG9zdEZpbHRlciApID9cblxuXHRcdFx0XHRcdC8vIC4uLmludGVybWVkaWF0ZSBwcm9jZXNzaW5nIGlzIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFtdIDpcblxuXHRcdFx0XHRcdC8vIC4uLm90aGVyd2lzZSB1c2UgcmVzdWx0cyBkaXJlY3RseVxuXHRcdFx0XHRcdHJlc3VsdHMgOlxuXHRcdFx0XHRtYXRjaGVySW47XG5cblx0XHQvLyBGaW5kIHByaW1hcnkgbWF0Y2hlc1xuXHRcdGlmICggbWF0Y2hlciApIHtcblx0XHRcdG1hdGNoZXIoIG1hdGNoZXJJbiwgbWF0Y2hlck91dCwgY29udGV4dCwgeG1sICk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgcG9zdEZpbHRlclxuXHRcdGlmICggcG9zdEZpbHRlciApIHtcblx0XHRcdHRlbXAgPSBjb25kZW5zZSggbWF0Y2hlck91dCwgcG9zdE1hcCApO1xuXHRcdFx0cG9zdEZpbHRlciggdGVtcCwgW10sIGNvbnRleHQsIHhtbCApO1xuXG5cdFx0XHQvLyBVbi1tYXRjaCBmYWlsaW5nIGVsZW1lbnRzIGJ5IG1vdmluZyB0aGVtIGJhY2sgdG8gbWF0Y2hlckluXG5cdFx0XHRpID0gdGVtcC5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAoIGVsZW0gPSB0ZW1wWyBpIF0gKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyT3V0WyBwb3N0TWFwWyBpIF0gXSA9ICEoIG1hdGNoZXJJblsgcG9zdE1hcFsgaSBdIF0gPSBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgfHwgcHJlRmlsdGVyICkge1xuXHRcdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cblx0XHRcdFx0XHQvLyBHZXQgdGhlIGZpbmFsIG1hdGNoZXJPdXQgYnkgY29uZGVuc2luZyB0aGlzIGludGVybWVkaWF0ZSBpbnRvIHBvc3RGaW5kZXIgY29udGV4dHNcblx0XHRcdFx0XHR0ZW1wID0gW107XG5cdFx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBtYXRjaGVyT3V0WyBpIF0gKSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXN0b3JlIG1hdGNoZXJJbiBzaW5jZSBlbGVtIGlzIG5vdCB5ZXQgYSBmaW5hbCBtYXRjaFxuXHRcdFx0XHRcdFx0XHR0ZW1wLnB1c2goICggbWF0Y2hlckluWyBpIF0gPSBlbGVtICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgKCBtYXRjaGVyT3V0ID0gW10gKSwgdGVtcCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNb3ZlIG1hdGNoZWQgZWxlbWVudHMgZnJvbSBzZWVkIHRvIHJlc3VsdHMgdG8ga2VlcCB0aGVtIHN5bmNocm9uaXplZFxuXHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdGlmICggKCBlbGVtID0gbWF0Y2hlck91dFsgaSBdICkgJiZcblx0XHRcdFx0XHRcdCggdGVtcCA9IHBvc3RGaW5kZXIgPyBpbmRleE9mKCBzZWVkLCBlbGVtICkgOiBwcmVNYXBbIGkgXSApID4gLTEgKSB7XG5cblx0XHRcdFx0XHRcdHNlZWRbIHRlbXAgXSA9ICEoIHJlc3VsdHNbIHRlbXAgXSA9IGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEFkZCBlbGVtZW50cyB0byByZXN1bHRzLCB0aHJvdWdoIHBvc3RGaW5kZXIgaWYgZGVmaW5lZFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyT3V0ID0gY29uZGVuc2UoXG5cdFx0XHRcdG1hdGNoZXJPdXQgPT09IHJlc3VsdHMgP1xuXHRcdFx0XHRcdG1hdGNoZXJPdXQuc3BsaWNlKCBwcmVleGlzdGluZywgbWF0Y2hlck91dC5sZW5ndGggKSA6XG5cdFx0XHRcdFx0bWF0Y2hlck91dFxuXHRcdFx0KTtcblx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgcmVzdWx0cywgbWF0Y2hlck91dCwgeG1sICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBtYXRjaGVyT3V0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciBjaGVja0NvbnRleHQsIG1hdGNoZXIsIGosXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRsZWFkaW5nUmVsYXRpdmUgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIDAgXS50eXBlIF0sXG5cdFx0aW1wbGljaXRSZWxhdGl2ZSA9IGxlYWRpbmdSZWxhdGl2ZSB8fCBFeHByLnJlbGF0aXZlWyBcIiBcIiBdLFxuXHRcdGkgPSBsZWFkaW5nUmVsYXRpdmUgPyAxIDogMCxcblxuXHRcdC8vIFRoZSBmb3VuZGF0aW9uYWwgbWF0Y2hlciBlbnN1cmVzIHRoYXQgZWxlbWVudHMgYXJlIHJlYWNoYWJsZSBmcm9tIHRvcC1sZXZlbCBjb250ZXh0KHMpXG5cdFx0bWF0Y2hDb250ZXh0ID0gYWRkQ29tYmluYXRvciggZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gY2hlY2tDb250ZXh0O1xuXHRcdH0sIGltcGxpY2l0UmVsYXRpdmUsIHRydWUgKSxcblx0XHRtYXRjaEFueUNvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBpbmRleE9mKCBjaGVja0NvbnRleHQsIGVsZW0gKSA+IC0xO1xuXHRcdH0sIGltcGxpY2l0UmVsYXRpdmUsIHRydWUgKSxcblx0XHRtYXRjaGVycyA9IFsgZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciByZXQgPSAoICFsZWFkaW5nUmVsYXRpdmUgJiYgKCB4bWwgfHwgY29udGV4dCAhPT0gb3V0ZXJtb3N0Q29udGV4dCApICkgfHwgKFxuXHRcdFx0XHQoIGNoZWNrQ29udGV4dCA9IGNvbnRleHQgKS5ub2RlVHlwZSA/XG5cdFx0XHRcdFx0bWF0Y2hDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdFx0bWF0Y2hBbnlDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSApO1xuXG5cdFx0XHQvLyBBdm9pZCBoYW5naW5nIG9udG8gZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdGNoZWNrQ29udGV4dCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0gXTtcblxuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRpZiAoICggbWF0Y2hlciA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgaSBdLnR5cGUgXSApICkge1xuXHRcdFx0bWF0Y2hlcnMgPSBbIGFkZENvbWJpbmF0b3IoIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLCBtYXRjaGVyICkgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlciA9IEV4cHIuZmlsdGVyWyB0b2tlbnNbIGkgXS50eXBlIF0uYXBwbHkoIG51bGwsIHRva2Vuc1sgaSBdLm1hdGNoZXMgKTtcblxuXHRcdFx0Ly8gUmV0dXJuIHNwZWNpYWwgdXBvbiBzZWVpbmcgYSBwb3NpdGlvbmFsIG1hdGNoZXJcblx0XHRcdGlmICggbWF0Y2hlclsgZXhwYW5kbyBdICkge1xuXG5cdFx0XHRcdC8vIEZpbmQgdGhlIG5leHQgcmVsYXRpdmUgb3BlcmF0b3IgKGlmIGFueSkgZm9yIHByb3BlciBoYW5kbGluZ1xuXHRcdFx0XHRqID0gKytpO1xuXHRcdFx0XHRmb3IgKCA7IGogPCBsZW47IGorKyApIHtcblx0XHRcdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgaiBdLnR5cGUgXSApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc2V0TWF0Y2hlcihcblx0XHRcdFx0XHRpID4gMSAmJiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSxcblx0XHRcdFx0XHRpID4gMSAmJiB0b1NlbGVjdG9yKFxuXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHByZWNlZGluZyB0b2tlbiB3YXMgYSBkZXNjZW5kYW50IGNvbWJpbmF0b3IsIGluc2VydCBhbiBpbXBsaWNpdCBhbnktZWxlbWVudCBgKmBcblx0XHRcdFx0XHR0b2tlbnNcblx0XHRcdFx0XHRcdC5zbGljZSggMCwgaSAtIDEgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggeyB2YWx1ZTogdG9rZW5zWyBpIC0gMiBdLnR5cGUgPT09IFwiIFwiID8gXCIqXCIgOiBcIlwiIH0gKVxuXHRcdFx0XHRcdCkucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLFxuXHRcdFx0XHRcdG1hdGNoZXIsXG5cdFx0XHRcdFx0aSA8IGogJiYgbWF0Y2hlckZyb21Ub2tlbnMoIHRva2Vucy5zbGljZSggaSwgaiApICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiBtYXRjaGVyRnJvbVRva2VucyggKCB0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIGogKSApICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0bWF0Y2hlcnMucHVzaCggbWF0Y2hlciApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzICkge1xuXHR2YXIgYnlTZXQgPSBzZXRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdGJ5RWxlbWVudCA9IGVsZW1lbnRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdHN1cGVyTWF0Y2hlciA9IGZ1bmN0aW9uKCBzZWVkLCBjb250ZXh0LCB4bWwsIHJlc3VsdHMsIG91dGVybW9zdCApIHtcblx0XHRcdHZhciBlbGVtLCBqLCBtYXRjaGVyLFxuXHRcdFx0XHRtYXRjaGVkQ291bnQgPSAwLFxuXHRcdFx0XHRpID0gXCIwXCIsXG5cdFx0XHRcdHVubWF0Y2hlZCA9IHNlZWQgJiYgW10sXG5cdFx0XHRcdHNldE1hdGNoZWQgPSBbXSxcblx0XHRcdFx0Y29udGV4dEJhY2t1cCA9IG91dGVybW9zdENvbnRleHQsXG5cblx0XHRcdFx0Ly8gV2UgbXVzdCBhbHdheXMgaGF2ZSBlaXRoZXIgc2VlZCBlbGVtZW50cyBvciBvdXRlcm1vc3QgY29udGV4dFxuXHRcdFx0XHRlbGVtcyA9IHNlZWQgfHwgYnlFbGVtZW50ICYmIEV4cHIuZmluZFsgXCJUQUdcIiBdKCBcIipcIiwgb3V0ZXJtb3N0ICksXG5cblx0XHRcdFx0Ly8gVXNlIGludGVnZXIgZGlycnVucyBpZmYgdGhpcyBpcyB0aGUgb3V0ZXJtb3N0IG1hdGNoZXJcblx0XHRcdFx0ZGlycnVuc1VuaXF1ZSA9ICggZGlycnVucyArPSBjb250ZXh0QmFja3VwID09IG51bGwgPyAxIDogTWF0aC5yYW5kb20oKSB8fCAwLjEgKSxcblx0XHRcdFx0bGVuID0gZWxlbXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dCA9PSBkb2N1bWVudCB8fCBjb250ZXh0IHx8IG91dGVybW9zdDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIGVsZW1lbnRzIHBhc3NpbmcgZWxlbWVudE1hdGNoZXJzIGRpcmVjdGx5IHRvIHJlc3VsdHNcblx0XHRcdC8vIFN1cHBvcnQ6IElFPDksIFNhZmFyaVxuXHRcdFx0Ly8gVG9sZXJhdGUgTm9kZUxpc3QgcHJvcGVydGllcyAoSUU6IFwibGVuZ3RoXCI7IFNhZmFyaTogPG51bWJlcj4pIG1hdGNoaW5nIGVsZW1lbnRzIGJ5IGlkXG5cdFx0XHRmb3IgKCA7IGkgIT09IGxlbiAmJiAoIGVsZW0gPSBlbGVtc1sgaSBdICkgIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIGJ5RWxlbWVudCAmJiBlbGVtICkge1xuXHRcdFx0XHRcdGogPSAwO1xuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdFx0XHRpZiAoICFjb250ZXh0ICYmIGVsZW0ub3duZXJEb2N1bWVudCAhPSBkb2N1bWVudCApIHtcblx0XHRcdFx0XHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdFx0XHRcdFx0XHR4bWwgPSAhZG9jdW1lbnRJc0hUTUw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHdoaWxlICggKCBtYXRjaGVyID0gZWxlbWVudE1hdGNoZXJzWyBqKysgXSApICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0IHx8IGRvY3VtZW50LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRyYWNrIHVubWF0Y2hlZCBlbGVtZW50cyBmb3Igc2V0IGZpbHRlcnNcblx0XHRcdFx0aWYgKCBieVNldCApIHtcblxuXHRcdFx0XHRcdC8vIFRoZXkgd2lsbCBoYXZlIGdvbmUgdGhyb3VnaCBhbGwgcG9zc2libGUgbWF0Y2hlcnNcblx0XHRcdFx0XHRpZiAoICggZWxlbSA9ICFtYXRjaGVyICYmIGVsZW0gKSApIHtcblx0XHRcdFx0XHRcdG1hdGNoZWRDb3VudC0tO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIExlbmd0aGVuIHRoZSBhcnJheSBmb3IgZXZlcnkgZWxlbWVudCwgbWF0Y2hlZCBvciBub3Rcblx0XHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBgaWAgaXMgbm93IHRoZSBjb3VudCBvZiBlbGVtZW50cyB2aXNpdGVkIGFib3ZlLCBhbmQgYWRkaW5nIGl0IHRvIGBtYXRjaGVkQ291bnRgXG5cdFx0XHQvLyBtYWtlcyB0aGUgbGF0dGVyIG5vbm5lZ2F0aXZlLlxuXHRcdFx0bWF0Y2hlZENvdW50ICs9IGk7XG5cblx0XHRcdC8vIEFwcGx5IHNldCBmaWx0ZXJzIHRvIHVubWF0Y2hlZCBlbGVtZW50c1xuXHRcdFx0Ly8gTk9URTogVGhpcyBjYW4gYmUgc2tpcHBlZCBpZiB0aGVyZSBhcmUgbm8gdW5tYXRjaGVkIGVsZW1lbnRzIChpLmUuLCBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gZXF1YWxzIGBpYCksIHVubGVzcyB3ZSBkaWRuJ3QgdmlzaXQgX2FueV8gZWxlbWVudHMgaW4gdGhlIGFib3ZlIGxvb3AgYmVjYXVzZSB3ZSBoYXZlXG5cdFx0XHQvLyBubyBlbGVtZW50IG1hdGNoZXJzIGFuZCBubyBzZWVkLlxuXHRcdFx0Ly8gSW5jcmVtZW50aW5nIGFuIGluaXRpYWxseS1zdHJpbmcgXCIwXCIgYGlgIGFsbG93cyBgaWAgdG8gcmVtYWluIGEgc3RyaW5nIG9ubHkgaW4gdGhhdFxuXHRcdFx0Ly8gY2FzZSwgd2hpY2ggd2lsbCByZXN1bHQgaW4gYSBcIjAwXCIgYG1hdGNoZWRDb3VudGAgdGhhdCBkaWZmZXJzIGZyb20gYGlgIGJ1dCBpcyBhbHNvXG5cdFx0XHQvLyBudW1lcmljYWxseSB6ZXJvLlxuXHRcdFx0aWYgKCBieVNldCAmJiBpICE9PSBtYXRjaGVkQ291bnQgKSB7XG5cdFx0XHRcdGogPSAwO1xuXHRcdFx0XHR3aGlsZSAoICggbWF0Y2hlciA9IHNldE1hdGNoZXJzWyBqKysgXSApICkge1xuXHRcdFx0XHRcdG1hdGNoZXIoIHVubWF0Y2hlZCwgc2V0TWF0Y2hlZCwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cblx0XHRcdFx0XHQvLyBSZWludGVncmF0ZSBlbGVtZW50IG1hdGNoZXMgdG8gZWxpbWluYXRlIHRoZSBuZWVkIGZvciBzb3J0aW5nXG5cdFx0XHRcdFx0aWYgKCBtYXRjaGVkQ291bnQgPiAwICkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggISggdW5tYXRjaGVkWyBpIF0gfHwgc2V0TWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0TWF0Y2hlZFsgaSBdID0gcG9wLmNhbGwoIHJlc3VsdHMgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIERpc2NhcmQgaW5kZXggcGxhY2Vob2xkZXIgdmFsdWVzIHRvIGdldCBvbmx5IGFjdHVhbCBtYXRjaGVzXG5cdFx0XHRcdFx0c2V0TWF0Y2hlZCA9IGNvbmRlbnNlKCBzZXRNYXRjaGVkICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBZGQgbWF0Y2hlcyB0byByZXN1bHRzXG5cdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNldE1hdGNoZWQgKTtcblxuXHRcdFx0XHQvLyBTZWVkbGVzcyBzZXQgbWF0Y2hlcyBzdWNjZWVkaW5nIG11bHRpcGxlIHN1Y2Nlc3NmdWwgbWF0Y2hlcnMgc3RpcHVsYXRlIHNvcnRpbmdcblx0XHRcdFx0aWYgKCBvdXRlcm1vc3QgJiYgIXNlZWQgJiYgc2V0TWF0Y2hlZC5sZW5ndGggPiAwICYmXG5cdFx0XHRcdFx0KCBtYXRjaGVkQ291bnQgKyBzZXRNYXRjaGVycy5sZW5ndGggKSA+IDEgKSB7XG5cblx0XHRcdFx0XHRTaXp6bGUudW5pcXVlU29ydCggcmVzdWx0cyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIE92ZXJyaWRlIG1hbmlwdWxhdGlvbiBvZiBnbG9iYWxzIGJ5IG5lc3RlZCBtYXRjaGVyc1xuXHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dEJhY2t1cDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVubWF0Y2hlZDtcblx0XHR9O1xuXG5cdHJldHVybiBieVNldCA/XG5cdFx0bWFya0Z1bmN0aW9uKCBzdXBlck1hdGNoZXIgKSA6XG5cdFx0c3VwZXJNYXRjaGVyO1xufVxuXG5jb21waWxlID0gU2l6emxlLmNvbXBpbGUgPSBmdW5jdGlvbiggc2VsZWN0b3IsIG1hdGNoIC8qIEludGVybmFsIFVzZSBPbmx5ICovICkge1xuXHR2YXIgaSxcblx0XHRzZXRNYXRjaGVycyA9IFtdLFxuXHRcdGVsZW1lbnRNYXRjaGVycyA9IFtdLFxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXTtcblxuXHRpZiAoICFjYWNoZWQgKSB7XG5cblx0XHQvLyBHZW5lcmF0ZSBhIGZ1bmN0aW9uIG9mIHJlY3Vyc2l2ZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGVjayBlYWNoIGVsZW1lbnRcblx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdG1hdGNoID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0fVxuXHRcdGkgPSBtYXRjaC5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRjYWNoZWQgPSBtYXRjaGVyRnJvbVRva2VucyggbWF0Y2hbIGkgXSApO1xuXHRcdFx0aWYgKCBjYWNoZWRbIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0c2V0TWF0Y2hlcnMucHVzaCggY2FjaGVkICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50TWF0Y2hlcnMucHVzaCggY2FjaGVkICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2FjaGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZShcblx0XHRcdHNlbGVjdG9yLFxuXHRcdFx0bWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzIClcblx0XHQpO1xuXG5cdFx0Ly8gU2F2ZSBzZWxlY3RvciBhbmQgdG9rZW5pemF0aW9uXG5cdFx0Y2FjaGVkLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdH1cblx0cmV0dXJuIGNhY2hlZDtcbn07XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgd29ya3Mgd2l0aCBTaXp6bGUncyBjb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHNlbGVjdG9yIEEgc2VsZWN0b3Igb3IgYSBwcmUtY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbiBidWlsdCB3aXRoIFNpenpsZS5jb21waWxlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRleHRcbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHRzXVxuICogQHBhcmFtIHtBcnJheX0gW3NlZWRdIEEgc2V0IG9mIGVsZW1lbnRzIHRvIG1hdGNoIGFnYWluc3RcbiAqL1xuc2VsZWN0ID0gU2l6emxlLnNlbGVjdCA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIGksIHRva2VucywgdG9rZW4sIHR5cGUsIGZpbmQsXG5cdFx0Y29tcGlsZWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiAmJiBzZWxlY3Rvcixcblx0XHRtYXRjaCA9ICFzZWVkICYmIHRva2VuaXplKCAoIHNlbGVjdG9yID0gY29tcGlsZWQuc2VsZWN0b3IgfHwgc2VsZWN0b3IgKSApO1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFRyeSB0byBtaW5pbWl6ZSBvcGVyYXRpb25zIGlmIHRoZXJlIGlzIG9ubHkgb25lIHNlbGVjdG9yIGluIHRoZSBsaXN0IGFuZCBubyBzZWVkXG5cdC8vICh0aGUgbGF0dGVyIG9mIHdoaWNoIGd1YXJhbnRlZXMgdXMgY29udGV4dClcblx0aWYgKCBtYXRjaC5sZW5ndGggPT09IDEgKSB7XG5cblx0XHQvLyBSZWR1Y2UgY29udGV4dCBpZiB0aGUgbGVhZGluZyBjb21wb3VuZCBzZWxlY3RvciBpcyBhbiBJRFxuXHRcdHRva2VucyA9IG1hdGNoWyAwIF0gPSBtYXRjaFsgMCBdLnNsaWNlKCAwICk7XG5cdFx0aWYgKCB0b2tlbnMubGVuZ3RoID4gMiAmJiAoIHRva2VuID0gdG9rZW5zWyAwIF0gKS50eXBlID09PSBcIklEXCIgJiZcblx0XHRcdGNvbnRleHQubm9kZVR5cGUgPT09IDkgJiYgZG9jdW1lbnRJc0hUTUwgJiYgRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyAxIF0udHlwZSBdICkge1xuXG5cdFx0XHRjb250ZXh0ID0gKCBFeHByLmZpbmRbIFwiSURcIiBdKCB0b2tlbi5tYXRjaGVzWyAwIF1cblx0XHRcdFx0LnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICksIGNvbnRleHQgKSB8fCBbXSApWyAwIF07XG5cdFx0XHRpZiAoICFjb250ZXh0ICkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0Ly8gUHJlY29tcGlsZWQgbWF0Y2hlcnMgd2lsbCBzdGlsbCB2ZXJpZnkgYW5jZXN0cnksIHNvIHN0ZXAgdXAgYSBsZXZlbFxuXHRcdFx0fSBlbHNlIGlmICggY29tcGlsZWQgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBjb250ZXh0LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc2xpY2UoIHRva2Vucy5zaGlmdCgpLnZhbHVlLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZldGNoIGEgc2VlZCBzZXQgZm9yIHJpZ2h0LXRvLWxlZnQgbWF0Y2hpbmdcblx0XHRpID0gbWF0Y2hFeHByWyBcIm5lZWRzQ29udGV4dFwiIF0udGVzdCggc2VsZWN0b3IgKSA/IDAgOiB0b2tlbnMubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0dG9rZW4gPSB0b2tlbnNbIGkgXTtcblxuXHRcdFx0Ly8gQWJvcnQgaWYgd2UgaGl0IGEgY29tYmluYXRvclxuXHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyAoIHR5cGUgPSB0b2tlbi50eXBlICkgXSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoICggZmluZCA9IEV4cHIuZmluZFsgdHlwZSBdICkgKSB7XG5cblx0XHRcdFx0Ly8gU2VhcmNoLCBleHBhbmRpbmcgY29udGV4dCBmb3IgbGVhZGluZyBzaWJsaW5nIGNvbWJpbmF0b3JzXG5cdFx0XHRcdGlmICggKCBzZWVkID0gZmluZChcblx0XHRcdFx0XHR0b2tlbi5tYXRjaGVzWyAwIF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSxcblx0XHRcdFx0XHRyc2libGluZy50ZXN0KCB0b2tlbnNbIDAgXS50eXBlICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8XG5cdFx0XHRcdFx0XHRjb250ZXh0XG5cdFx0XHRcdCkgKSApIHtcblxuXHRcdFx0XHRcdC8vIElmIHNlZWQgaXMgZW1wdHkgb3Igbm8gdG9rZW5zIHJlbWFpbiwgd2UgY2FuIHJldHVybiBlYXJseVxuXHRcdFx0XHRcdHRva2Vucy5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRzZWxlY3RvciA9IHNlZWQubGVuZ3RoICYmIHRvU2VsZWN0b3IoIHRva2VucyApO1xuXHRcdFx0XHRcdGlmICggIXNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2VlZCApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBDb21waWxlIGFuZCBleGVjdXRlIGEgZmlsdGVyaW5nIGZ1bmN0aW9uIGlmIG9uZSBpcyBub3QgcHJvdmlkZWRcblx0Ly8gUHJvdmlkZSBgbWF0Y2hgIHRvIGF2b2lkIHJldG9rZW5pemF0aW9uIGlmIHdlIG1vZGlmaWVkIHRoZSBzZWxlY3RvciBhYm92ZVxuXHQoIGNvbXBpbGVkIHx8IGNvbXBpbGUoIHNlbGVjdG9yLCBtYXRjaCApICkoXG5cdFx0c2VlZCxcblx0XHRjb250ZXh0LFxuXHRcdCFkb2N1bWVudElzSFRNTCxcblx0XHRyZXN1bHRzLFxuXHRcdCFjb250ZXh0IHx8IHJzaWJsaW5nLnRlc3QoIHNlbGVjdG9yICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8IGNvbnRleHRcblx0KTtcblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vLyBPbmUtdGltZSBhc3NpZ25tZW50c1xuXG4vLyBTb3J0IHN0YWJpbGl0eVxuc3VwcG9ydC5zb3J0U3RhYmxlID0gZXhwYW5kby5zcGxpdCggXCJcIiApLnNvcnQoIHNvcnRPcmRlciApLmpvaW4oIFwiXCIgKSA9PT0gZXhwYW5kbztcblxuLy8gU3VwcG9ydDogQ2hyb21lIDE0LTM1K1xuLy8gQWx3YXlzIGFzc3VtZSBkdXBsaWNhdGVzIGlmIHRoZXkgYXJlbid0IHBhc3NlZCB0byB0aGUgY29tcGFyaXNvbiBmdW5jdGlvblxuc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzID0gISFoYXNEdXBsaWNhdGU7XG5cbi8vIEluaXRpYWxpemUgYWdhaW5zdCB0aGUgZGVmYXVsdCBkb2N1bWVudFxuc2V0RG9jdW1lbnQoKTtcblxuLy8gU3VwcG9ydDogV2Via2l0PDUzNy4zMiAtIFNhZmFyaSA2LjAuMy9DaHJvbWUgMjUgKGZpeGVkIGluIENocm9tZSAyNylcbi8vIERldGFjaGVkIG5vZGVzIGNvbmZvdW5kaW5nbHkgZm9sbG93ICplYWNoIG90aGVyKlxuc3VwcG9ydC5zb3J0RGV0YWNoZWQgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHQvLyBTaG91bGQgcmV0dXJuIDEsIGJ1dCByZXR1cm5zIDQgKGZvbGxvd2luZylcblx0cmV0dXJuIGVsLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImZpZWxkc2V0XCIgKSApICYgMTtcbn0gKTtcblxuLy8gU3VwcG9ydDogSUU8OFxuLy8gUHJldmVudCBhdHRyaWJ1dGUvcHJvcGVydHkgXCJpbnRlcnBvbGF0aW9uXCJcbi8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1MzY0MjklMjhWUy44NSUyOS5hc3B4XG5pZiAoICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0ZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPScjJz48L2E+XCI7XG5cdHJldHVybiBlbC5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSggXCJocmVmXCIgKSA9PT0gXCIjXCI7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInR5cGVcIiA/IDEgOiAyICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBkZWZhdWx0VmFsdWUgaW4gcGxhY2Ugb2YgZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbmlmICggIXN1cHBvcnQuYXR0cmlidXRlcyB8fCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdGVsLmlubmVySFRNTCA9IFwiPGlucHV0Lz5cIjtcblx0ZWwuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiwgXCJcIiApO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBcIlwiO1xufSApICkge1xuXHRhZGRIYW5kbGUoIFwidmFsdWVcIiwgZnVuY3Rpb24oIGVsZW0sIF9uYW1lLCBpc1hNTCApIHtcblx0XHRpZiAoICFpc1hNTCAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLmRlZmF1bHRWYWx1ZTtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGdldEF0dHJpYnV0ZU5vZGUgdG8gZmV0Y2ggYm9vbGVhbnMgd2hlbiBnZXRBdHRyaWJ1dGUgbGllc1xuaWYgKCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiApID09IG51bGw7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggYm9vbGVhbnMsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHR2YXIgdmFsO1xuXHRcdGlmICggIWlzWE1MICkge1xuXHRcdFx0cmV0dXJuIGVsZW1bIG5hbWUgXSA9PT0gdHJ1ZSA/IG5hbWUudG9Mb3dlckNhc2UoKSA6XG5cdFx0XHRcdCggdmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkgKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRcdG51bGw7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIEVYUE9TRVxudmFyIF9zaXp6bGUgPSB3aW5kb3cuU2l6emxlO1xuXG5TaXp6bGUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHdpbmRvdy5TaXp6bGUgPT09IFNpenpsZSApIHtcblx0XHR3aW5kb3cuU2l6emxlID0gX3NpenpsZTtcblx0fVxuXG5cdHJldHVybiBTaXp6bGU7XG59O1xuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRkZWZpbmUoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTaXp6bGU7XG5cdH0gKTtcblxuLy8gU2l6emxlIHJlcXVpcmVzIHRoYXQgdGhlcmUgYmUgYSBnbG9iYWwgd2luZG93IGluIENvbW1vbi1KUyBsaWtlIGVudmlyb25tZW50c1xufSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyApIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBTaXp6bGU7XG59IGVsc2Uge1xuXHR3aW5kb3cuU2l6emxlID0gU2l6emxlO1xufVxuXG4vLyBFWFBPU0VcblxufSApKCB3aW5kb3cgKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc2l6emxlL2Rpc3Qvc2l6emxlLmpzIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBzZWxlY3QsIGdldFNpbmdsZVNlbGVjdG9yLCBnZXRNdWx0aVNlbGVjdG9yIH0gZnJvbSAnLi9zZWxlY3QnXG5leHBvcnQgeyBkZWZhdWx0IGFzIG1hdGNoIH0gZnJvbSAnLi9tYXRjaCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3B0aW1pemUgfSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==