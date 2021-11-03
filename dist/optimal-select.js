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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

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
    var matches = select('' + prefix + r, parent);
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
 * @return {string?}          - [description]
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
  var pattern = element.tagName.toLowerCase();
  var isOptimal = function isOptimal(pattern) {
    return select(pattern, parent).length === 1;
  };

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

    switch (attributeName) {
      case 'id':
        pattern = pattern.concat('#' + attributeValue);
        if (isOptimal(pattern)) {
          return pattern;
        }
        break;
      case 'class':
        {
          var _ret = function () {
            var classNames = attributeValue.trim().split(/\s+/g);
            var classIgnore = ignore.class || defaultIgnore.class;
            if (classIgnore) {
              classNames = classNames.filter(function (className) {
                return !classIgnore(className);
              });
            }
            if (classNames.length > 0) {
              var classPattern = getClassSelector(classNames, select, parent, pattern);
              if (classPattern) {
                pattern = pattern.concat(classPattern);
                if (isOptimal(pattern)) {
                  return {
                    v: pattern
                  };
                }
              }
            }
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
        break;

      default:
        pattern = pattern.concat('[' + attributeName + '="' + attributeValue + '"]');
        if (isOptimal(pattern)) {
          return pattern;
        }
    }
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
 * Optimize :contains
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

function optimizeContains(prePart, current, postPart, elements, select) {
  if (/:contains\(/.test(current) && postPart.length) {
    var firstIndex = current.indexOf(':contains(');
    var containsIndex = current.lastIndexOf(':contains(');
    var optimized = current.slice(0, containsIndex);
    while (containsIndex > firstIndex && compareResults(select('' + prePart + optimized + postPart), elements)) {
      current = optimized;
      containsIndex = current.lastIndexOf(':contains(');
      optimized = current.slice(0, containsIndex);
    }
  }
  return current;
}

/**
 * Optimize attributes
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {string}                       - [description]
 */
function optimizeAttributes(prePart, current, postPart, elements, select) {
  // reduce attributes: first try without value, then removing completely
  if (/\[*\]/.test(current)) {
    var items = current.match(/(?:\[[^=]+="[^"]*"\])/g).reverse();

    var simplify = function simplify(original, getPartial) {
      return items.reduce(function (acc, item) {
        var partial = getPartial(acc, item);
        var pattern = '' + prePart + partial + postPart;
        var matches = select(pattern);
        return compareResults(matches, elements) ? partial : acc;
      }, original);
    };

    var simplified = simplify(current, function (current, item) {
      var key = item.replace(/=.*$/, ']');
      return current.replace(item, key);
    });

    return simplify(simplified, function (current, item) {
      return current.replace(item, '');
    });
  }
  return current;
}

/**
 * Optimize descendant
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {string}                       - [description]
 */
function optimizeDescendant(prePart, current, postPart, elements, select) {
  // robustness: descendant instead child (heuristic)
  if (/>/.test(current)) {
    var descendant = current.replace(/>/, '');
    var pattern3 = '' + prePart + descendant + postPart;
    var matches3 = select(pattern3);
    if (compareResults(matches3, elements)) {
      current = descendant;
    }
  }
  return current;
}

/**
 * Optimize descendant
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {string}                       - [description]
 */
function optimizeNthOfType(prePart, current, postPart, elements, select) {
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
  return current;
}

/**
 * Optimize classes
 *
 * @param  {string}              prePart  - [description]
 * @param  {string}              current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {string}                       - [description]
 */
function optimizeClasses(prePart, current, postPart, elements, select) {
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
      var references = select('' + prePart + current);

      var _loop2 = function _loop2() {
        var reference = references[i2];
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

      for (var i2 = 0, l2 = references.length; i2 < l2; i2++) {
        var pattern6;
        var matches6;

        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
      }
    }
  }
  return current;
}

var optimizers = [optimizeContains, optimizeAttributes, optimizeDescendant, optimizeNthOfType, optimizeClasses];

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
function optimizePart(prePart, current, postPart, elements, select) {
  if (prePart.length) prePart = prePart + ' ';
  if (postPart.length) postPart = ' ' + postPart;

  return optimizers.reduce(function (acc, optimizer) {
    return optimizer(prePart, acc, postPart, elements, select);
  }, current);
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
      css_attributes_regex = /\[([^\]\@\|\*\=\^\~\$\!\(\/\s\x1C-\x1F]+)\s*(([\|\*\~\^\$\!]?)=?\s*(\x1E+))?\]/g,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiM2Q2ZGYwZGZmMjZlOTBiMTc0YyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9vcHRpbWl6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NzczJ4cGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0U2VsZWN0IiwiZ2V0Q29tbW9uQW5jZXN0b3IiLCJnZXRDb21tb25Qcm9wZXJ0aWVzIiwib3B0aW9ucyIsImZvcm1hdCIsIlNpenpsZSIsInJlcXVpcmUiLCJzZWxlY3RvciIsInBhcmVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImVsZW1lbnRzIiwicm9vdCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJsZW5ndGgiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwiaSIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiY29tbW9uUHJvcGVydGllcyIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwiY29tbW9uQ2xhc3NlcyIsImNvbW1vbkF0dHJpYnV0ZXMiLCJjb21tb25UYWciLCJ1bmRlZmluZWQiLCJnZXRBdHRyaWJ1dGUiLCJ0cmltIiwic3BsaXQiLCJmaWx0ZXIiLCJlbnRyeSIsIm5hbWUiLCJlbGVtZW50QXR0cmlidXRlcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJrZXkiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwidmFsdWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnZlcnROb2RlTGlzdCIsImVzY2FwZVZhbHVlIiwibm9kZXMiLCJhcnIiLCJBcnJheSIsInJlcGxhY2UiLCJtYXRjaCIsImRlZmF1bHRJZ25vcmUiLCJpbmRleE9mIiwibm9kZSIsInNraXAiLCJwcmlvcml0eSIsImlnbm9yZSIsInBhdGgiLCJqcXVlcnkiLCJzZWxlY3QiLCJza2lwQ29tcGFyZSIsImlzQXJyYXkiLCJtYXAiLCJza2lwQ2hlY2tzIiwiY29tcGFyZSIsInR5cGUiLCJwcmVkaWNhdGUiLCJ0b1N0cmluZyIsIlJlZ0V4cCIsInRlc3QiLCJub2RlVHlwZSIsImNoZWNrQXR0cmlidXRlcyIsImNoZWNrVGFnIiwiY2hlY2tDb250YWlucyIsImNoZWNrQ2hpbGRzIiwicGF0dGVybiIsImZpbmRQYXR0ZXJuIiwiam9pbiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsIm1hdGNoZXMiLCJnZXRDbGFzc1NlbGVjdG9yIiwicHJlZml4IiwicmVzdWx0IiwiYyIsInIiLCJwdXNoIiwiY29uY2F0IiwiYSIsImIiLCJhdHRyaWJ1dGVOYW1lcyIsInZhbCIsInNvcnRlZEtleXMiLCJpc09wdGltYWwiLCJhdHRyaWJ1dGVWYWx1ZSIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJjbGFzcyIsImNsYXNzTmFtZSIsImNsYXNzUGF0dGVybiIsImZpbmRUYWdQYXR0ZXJuIiwiY2hpbGRyZW4iLCJjaGlsZFRhZ3MiLCJjaGlsZCIsImNoaWxkUGF0dGVybiIsImNvbnNvbGUiLCJ3YXJuIiwiZWxlbWVudFBhdHRlcm4iLCJ0ZXh0cyIsInRleHRDb250ZW50IiwidGV4dCIsImZvdW5kIiwiZGVmYXVsdFByZWRpY2F0ZSIsImNoZWNrIiwib3B0aW1pemUiLCJzdGFydHNXaXRoIiwiRXJyb3IiLCJnbG9iYWxNb2RpZmllZCIsIm9wdGltaXplUGFydCIsImVuZE9wdGltaXplZCIsInNsaWNlIiwic2hvcnRlbmVkIiwicG9wIiwiY3VycmVudCIsInByZVBhcnQiLCJwb3N0UGFydCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsIm9wdGltaXplQ29udGFpbnMiLCJmaXJzdEluZGV4IiwiY29udGFpbnNJbmRleCIsImxhc3RJbmRleE9mIiwib3B0aW1pemVkIiwiY29tcGFyZVJlc3VsdHMiLCJvcHRpbWl6ZUF0dHJpYnV0ZXMiLCJpdGVtcyIsInJldmVyc2UiLCJzaW1wbGlmeSIsIm9yaWdpbmFsIiwiZ2V0UGFydGlhbCIsImFjYyIsIml0ZW0iLCJwYXJ0aWFsIiwic2ltcGxpZmllZCIsIm9wdGltaXplRGVzY2VuZGFudCIsImRlc2NlbmRhbnQiLCJwYXR0ZXJuMyIsIm1hdGNoZXMzIiwib3B0aW1pemVOdGhPZlR5cGUiLCJwYXR0ZXJuNCIsIm1hdGNoZXM0Iiwib3B0aW1pemVDbGFzc2VzIiwibmFtZXMiLCJwYXR0ZXJuNSIsImNoYXJBdCIsIm1hdGNoZXM1IiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImkyIiwiY29udGFpbnMiLCJkZXNjcmlwdGlvbiIsInBhdHRlcm42IiwibWF0Y2hlczYiLCJsMiIsIm9wdGltaXplcnMiLCJvcHRpbWl6ZXIiLCJhZGFwdCIsImdsb2JhbCIsImNvbnRleHQiLCJFbGVtZW50UHJvdG90eXBlIiwiZ2V0UHJvdG90eXBlT2YiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJnZXQiLCJhdHRyaWJzIiwiTmFtZWROb2RlTWFwIiwiY29uZmlndXJhYmxlIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJIVE1MQ29sbGVjdGlvbiIsInRyYXZlcnNlRGVzY2VuZGFudHMiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInBzZXVkbyIsInZhbGlkYXRlIiwiaW5zdHJ1Y3Rpb24iLCJjaGVja1BhcmVudCIsInN1YnN0ciIsIm5vZGVDbGFzc05hbWUiLCJjaGVja0NsYXNzIiwiZ2V0QW5jZXN0b3IiLCJhdHRyaWJ1dGVLZXkiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJydWxlIiwia2luZCIsInBhcnNlSW50IiwidmFsaWRhdGVQc2V1ZG8iLCJjb21wYXJlU2V0Iiwibm9kZUluZGV4IiwiZmluZEluZGV4IiwiZW5oYW5jZUluc3RydWN0aW9uIiwibWF0Y2hlZE5vZGUiLCJoYW5kbGVyIiwicHJvZ3Jlc3MiLCJnZXRTaW5nbGVTZWxlY3RvciIsImdldE11bHRpU2VsZWN0b3IiLCJnZXRRdWVyeVNlbGVjdG9yIiwiYW5jZXN0b3JTZWxlY3RvciIsImNvbW1vblNlbGVjdG9ycyIsImdldENvbW1vblNlbGVjdG9ycyIsImRlc2NlbmRhbnRTZWxlY3RvciIsInNlbGVjdG9yTWF0Y2hlcyIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJpbmNsdWRlcyIsInhwYXRoX3RvX2xvd2VyIiwicyIsInhwYXRoX2VuZHNfd2l0aCIsInMxIiwiczIiLCJ4cGF0aF91cmwiLCJ4cGF0aF91cmxfYXR0cnMiLCJ4cGF0aF91cmxfcGF0aCIsInhwYXRoX3VybF9kb21haW4iLCJ4cGF0aF9sb3dlcl9jYXNlIiwieHBhdGhfbnNfdXJpIiwieHBhdGhfbnNfcGF0aCIsInhwYXRoX2hhc19wcm90b2NhbCIsInhwYXRoX2lzX2ludGVybmFsIiwieHBhdGhfaXNfbG9jYWwiLCJ4cGF0aF9pc19wYXRoIiwieHBhdGhfaXNfbG9jYWxfcGF0aCIsInhwYXRoX25vcm1hbGl6ZV9zcGFjZSIsInhwYXRoX2ludGVybmFsIiwieHBhdGhfZXh0ZXJuYWwiLCJlc2NhcGVfbGl0ZXJhbCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImVzY2FwZV9wYXJlbnMiLCJyZWdleF9zdHJpbmdfbGl0ZXJhbCIsInJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCIsInJlZ2V4X2Nzc193cmFwX3BzZXVkbyIsInJlZ2V4X3NwZWNhbF9jaGFycyIsInJlZ2V4X2ZpcnN0X2F4aXMiLCJyZWdleF9maWx0ZXJfcHJlZml4IiwicmVnZXhfYXR0cl9wcmVmaXgiLCJyZWdleF9udGhfZXF1YXRpb24iLCJjc3NfY29tYmluYXRvcnNfcmVnZXgiLCJjc3NfY29tYmluYXRvcnNfY2FsbGJhY2siLCJvcGVyYXRvciIsImF4aXMiLCJmdW5jIiwibGl0ZXJhbCIsImV4Y2x1ZGUiLCJvZmZzZXQiLCJvcmlnIiwiaXNOdW1lcmljIiwicHJldkNoYXIiLCJjc3NfYXR0cmlidXRlc19yZWdleCIsImNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrIiwic3RyIiwiYXR0ciIsImNvbXAiLCJvcCIsInNlYXJjaCIsImNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCIsImNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayIsImcxIiwiZzIiLCJhcmciLCJnMyIsImc0IiwiZzUiLCJjc3MyeHBhdGgiLCJ4cGF0aCIsInByZXBlbmRBeGlzIiwiY3NzX2lkc19jbGFzc2VzX3JlZ2V4IiwiY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrIiwic3RhcnQiLCJzZWxlY3RvclN0YXJ0IiwiZGVwdGgiLCJudW0iLCJpc05hTiIsImVzY2FwZUNoYXIiLCJvcGVuIiwiY2xvc2UiLCJjaGFyIiwicmVwZWF0IiwiTnVtYmVyIiwiY29udmVydEVzY2FwaW5nIiwibmVzdGVkIiwibGl0ZXJhbHMiLCJzdWJzdHJpbmciLCJtb2R1bGUiLCJleHBvcnRzIiwid2luZG93Iiwic3VwcG9ydCIsIkV4cHIiLCJnZXRUZXh0IiwiaXNYTUwiLCJ0b2tlbml6ZSIsImNvbXBpbGUiLCJvdXRlcm1vc3RDb250ZXh0Iiwic29ydElucHV0IiwiaGFzRHVwbGljYXRlIiwic2V0RG9jdW1lbnQiLCJkb2NFbGVtIiwiZG9jdW1lbnRJc0hUTUwiLCJyYnVnZ3lRU0EiLCJyYnVnZ3lNYXRjaGVzIiwiZXhwYW5kbyIsIkRhdGUiLCJwcmVmZXJyZWREb2MiLCJkaXJydW5zIiwiY2xhc3NDYWNoZSIsImNyZWF0ZUNhY2hlIiwidG9rZW5DYWNoZSIsImNvbXBpbGVyQ2FjaGUiLCJub25uYXRpdmVTZWxlY3RvckNhY2hlIiwic29ydE9yZGVyIiwiaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJwdXNoTmF0aXZlIiwibGlzdCIsImVsZW0iLCJsZW4iLCJib29sZWFucyIsIndoaXRlc3BhY2UiLCJpZGVudGlmaWVyIiwicHNldWRvcyIsInJ3aGl0ZXNwYWNlIiwicnRyaW0iLCJyY29tbWEiLCJyY29tYmluYXRvcnMiLCJyZGVzY2VuZCIsInJwc2V1ZG8iLCJyaWRlbnRpZmllciIsIm1hdGNoRXhwciIsInJodG1sIiwicmlucHV0cyIsInJoZWFkZXIiLCJybmF0aXZlIiwicnF1aWNrRXhwciIsInJzaWJsaW5nIiwicnVuZXNjYXBlIiwiZnVuZXNjYXBlIiwiZXNjYXBlIiwibm9uSGV4IiwiaGlnaCIsInJjc3Nlc2NhcGUiLCJmY3NzZXNjYXBlIiwiY2giLCJhc0NvZGVQb2ludCIsImNoYXJDb2RlQXQiLCJ1bmxvYWRIYW5kbGVyIiwiaW5EaXNhYmxlZEZpZWxkc2V0IiwiYWRkQ29tYmluYXRvciIsImRpc2FibGVkIiwibm9kZU5hbWUiLCJkaXIiLCJhcHBseSIsImNhbGwiLCJjaGlsZE5vZGVzIiwiZSIsInRhcmdldCIsImVscyIsImoiLCJyZXN1bHRzIiwic2VlZCIsIm0iLCJuaWQiLCJncm91cHMiLCJuZXdTZWxlY3RvciIsIm5ld0NvbnRleHQiLCJvd25lckRvY3VtZW50IiwiZXhlYyIsImdldEVsZW1lbnRCeUlkIiwicXNhIiwidGVzdENvbnRleHQiLCJzY29wZSIsInNldEF0dHJpYnV0ZSIsInRvU2VsZWN0b3IiLCJxc2FFcnJvciIsInJlbW92ZUF0dHJpYnV0ZSIsImNhY2hlIiwiY2FjaGVMZW5ndGgiLCJtYXJrRnVuY3Rpb24iLCJmbiIsImFzc2VydCIsImVsIiwiY3JlYXRlRWxlbWVudCIsInJlbW92ZUNoaWxkIiwiYWRkSGFuZGxlIiwiYXR0cnMiLCJhdHRySGFuZGxlIiwic2libGluZ0NoZWNrIiwiY3VyIiwiZGlmZiIsInNvdXJjZUluZGV4IiwibmV4dFNpYmxpbmciLCJjcmVhdGVJbnB1dFBzZXVkbyIsImNyZWF0ZUJ1dHRvblBzZXVkbyIsImNyZWF0ZURpc2FibGVkUHNldWRvIiwiaXNEaXNhYmxlZCIsImNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8iLCJhcmd1bWVudCIsIm1hdGNoSW5kZXhlcyIsIm5hbWVzcGFjZSIsIm5hbWVzcGFjZVVSSSIsImRvY3VtZW50RWxlbWVudCIsImhhc0NvbXBhcmUiLCJzdWJXaW5kb3ciLCJkb2MiLCJkZWZhdWx0VmlldyIsInRvcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsImFwcGVuZENoaWxkIiwiY3JlYXRlQ29tbWVudCIsImdldEJ5SWQiLCJnZXRFbGVtZW50c0J5TmFtZSIsImF0dHJJZCIsImZpbmQiLCJnZXRBdHRyaWJ1dGVOb2RlIiwiZWxlbXMiLCJ0bXAiLCJpbm5lckhUTUwiLCJtYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJvTWF0Y2hlc1NlbGVjdG9yIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJkaXNjb25uZWN0ZWRNYXRjaCIsImNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIiwiYWRvd24iLCJidXAiLCJzb3J0RGV0YWNoZWQiLCJhdXAiLCJhcCIsImJwIiwiZXhwciIsInJldCIsInNwZWNpZmllZCIsInNlbCIsImVycm9yIiwibXNnIiwidW5pcXVlU29ydCIsImR1cGxpY2F0ZXMiLCJkZXRlY3REdXBsaWNhdGVzIiwic29ydFN0YWJsZSIsInNwbGljZSIsImZpcnN0Q2hpbGQiLCJub2RlVmFsdWUiLCJjcmVhdGVQc2V1ZG8iLCJyZWxhdGl2ZSIsImZpcnN0IiwicHJlRmlsdGVyIiwiZXhjZXNzIiwidW5xdW90ZWQiLCJub2RlTmFtZVNlbGVjdG9yIiwid2hhdCIsIl9hcmd1bWVudCIsImxhc3QiLCJzaW1wbGUiLCJmb3J3YXJkIiwib2ZUeXBlIiwiX2NvbnRleHQiLCJ4bWwiLCJ1bmlxdWVDYWNoZSIsIm91dGVyQ2FjaGUiLCJ1c2VDYWNoZSIsImxhc3RDaGlsZCIsInVuaXF1ZUlEIiwiYXJncyIsInNldEZpbHRlcnMiLCJpZHgiLCJtYXRjaGVkIiwibWF0Y2hlciIsInVubWF0Y2hlZCIsImxhbmciLCJlbGVtTGFuZyIsImhhc2giLCJsb2NhdGlvbiIsImFjdGl2ZUVsZW1lbnQiLCJoYXNGb2N1cyIsImhyZWYiLCJ0YWJJbmRleCIsImNoZWNrZWQiLCJzZWxlY3RlZCIsInNlbGVjdGVkSW5kZXgiLCJfbWF0Y2hJbmRleGVzIiwicmFkaW8iLCJjaGVja2JveCIsImZpbGUiLCJwYXNzd29yZCIsImltYWdlIiwic3VibWl0IiwicmVzZXQiLCJwcm90b3R5cGUiLCJmaWx0ZXJzIiwicGFyc2VPbmx5IiwidG9rZW5zIiwic29GYXIiLCJwcmVGaWx0ZXJzIiwiY2FjaGVkIiwiY29tYmluYXRvciIsImJhc2UiLCJjaGVja05vbkVsZW1lbnRzIiwiZG9uZU5hbWUiLCJvbGRDYWNoZSIsIm5ld0NhY2hlIiwiZWxlbWVudE1hdGNoZXIiLCJtYXRjaGVycyIsIm11bHRpcGxlQ29udGV4dHMiLCJjb250ZXh0cyIsImNvbmRlbnNlIiwibmV3VW5tYXRjaGVkIiwibWFwcGVkIiwic2V0TWF0Y2hlciIsInBvc3RGaWx0ZXIiLCJwb3N0RmluZGVyIiwicG9zdFNlbGVjdG9yIiwidGVtcCIsInByZU1hcCIsInBvc3RNYXAiLCJwcmVleGlzdGluZyIsIm1hdGNoZXJJbiIsIm1hdGNoZXJPdXQiLCJtYXRjaGVyRnJvbVRva2VucyIsImNoZWNrQ29udGV4dCIsImxlYWRpbmdSZWxhdGl2ZSIsImltcGxpY2l0UmVsYXRpdmUiLCJtYXRjaENvbnRleHQiLCJtYXRjaEFueUNvbnRleHQiLCJtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMiLCJlbGVtZW50TWF0Y2hlcnMiLCJzZXRNYXRjaGVycyIsImJ5U2V0IiwiYnlFbGVtZW50Iiwic3VwZXJNYXRjaGVyIiwib3V0ZXJtb3N0IiwibWF0Y2hlZENvdW50Iiwic2V0TWF0Y2hlZCIsImNvbnRleHRCYWNrdXAiLCJkaXJydW5zVW5pcXVlIiwiTWF0aCIsInJhbmRvbSIsInRva2VuIiwiY29tcGlsZWQiLCJfbmFtZSIsImRlZmF1bHRWYWx1ZSIsIl9zaXp6bGUiLCJub0NvbmZsaWN0IiwiZGVmaW5lIiwiZGVmYXVsdCIsImNvbW1vbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7O1FDaERnQkEsUyxH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QUFPclUsTUFBUCxHQUFnQkEsTUFBaEI7QUFDQTs7QUFFRDtBQUVDLENBbjZFRCxFQW02RUtxVSxNQW42RUwsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQ0NWU21RLE87Ozs7OzttQkFBbUJqVyxpQjs7Ozs7O21CQUFtQkMsZ0I7Ozs7Ozs7OzswQ0FDdENnVyxPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7Ozs7Ozs7OztRQUNHQyxNIiwiZmlsZSI6Im9wdGltYWwtc2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIzZDZkZjBkZmYyNmU5MGIxNzRjIiwiLyoqXG4gKiAjIENvbW1vblxuICpcbiAqIFByb2Nlc3MgY29sbGVjdGlvbnMgZm9yIHNpbWlsYXJpdGllcy5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICovXG5cbi8qKlxuICogUXVlcnkgZG9jdW1lbnQgdXNpbmcgY29ycmVjdCBzZWxlY3RvciBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudDogSFRNTEVsZW1lbnQpID0+IEFycmF5LjxIVE1MRWxlbWVudD59IC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0IChvcHRpb25zID0ge30pIHtcbiAgaWYgKG9wdGlvbnMuZm9ybWF0ID09PSAnanF1ZXJ5Jykge1xuICAgIGNvbnN0IFNpenpsZSA9IHJlcXVpcmUoJ3NpenpsZScpXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgcmV0dXJuIFNpenpsZShzZWxlY3RvciwgcGFyZW50IHx8IGRvY3VtZW50KVxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKHNlbGVjdG9yLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgcmV0dXJuIChwYXJlbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gIH0gXG59XG5cblxuLyoqXG4gKiBGaW5kIHRoZSBsYXN0IGNvbW1vbiBhbmNlc3RvciBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vbkFuY2VzdG9yIChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9IFtdXG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwYXJlbnRzID0gW11cbiAgICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCkge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgICAgcGFyZW50cy51bnNoaWZ0KGVsZW1lbnQpXG4gICAgfVxuICAgIGFuY2VzdG9yc1tpbmRleF0gPSBwYXJlbnRzXG4gIH0pXG5cbiAgYW5jZXN0b3JzLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG5cbiAgY29uc3Qgc2hhbGxvd0FuY2VzdG9yID0gYW5jZXN0b3JzLnNoaWZ0KClcblxuICB2YXIgYW5jZXN0b3IgPSBudWxsXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzaGFsbG93QW5jZXN0b3IubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgcGFyZW50ID0gc2hhbGxvd0FuY2VzdG9yW2ldXG4gICAgY29uc3QgbWlzc2luZyA9IGFuY2VzdG9ycy5zb21lKChvdGhlclBhcmVudHMpID0+IHtcbiAgICAgIHJldHVybiAhb3RoZXJQYXJlbnRzLnNvbWUoKG90aGVyUGFyZW50KSA9PiBvdGhlclBhcmVudCA9PT0gcGFyZW50KVxuICAgIH0pXG5cbiAgICBpZiAobWlzc2luZykge1xuICAgICAgLy8gVE9ETzogZmluZCBzaW1pbGFyIHN1Yi1wYXJlbnRzLCBub3QgdGhlIHRvcCByb290LCBlLmcuIHNoYXJpbmcgYSBjbGFzcyBzZWxlY3RvclxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBhbmNlc3RvciA9IHBhcmVudFxuICB9XG5cbiAgcmV0dXJuIGFuY2VzdG9yXG59XG5cbi8qKlxuICogR2V0IGEgc2V0IG9mIGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vblByb3BlcnRpZXMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgY29tbW9uUHJvcGVydGllcyA9IHtcbiAgICBjbGFzc2VzOiBbXSxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICB0YWc6IG51bGxcbiAgfVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgIHZhciB7XG4gICAgICBjbGFzc2VzOiBjb21tb25DbGFzc2VzLFxuICAgICAgYXR0cmlidXRlczogY29tbW9uQXR0cmlidXRlcyxcbiAgICAgIHRhZzogY29tbW9uVGFnXG4gICAgfSA9IGNvbW1vblByb3BlcnRpZXNcblxuICAgIC8vIH4gY2xhc3Nlc1xuICAgIGlmIChjb21tb25DbGFzc2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpXG4gICAgICAgIGlmICghY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQ2xhc3NlcyA9IGNvbW1vbkNsYXNzZXMuZmlsdGVyKChlbnRyeSkgPT4gY2xhc3Nlcy5zb21lKChuYW1lKSA9PiBuYW1lID09PSBlbnRyeSkpXG4gICAgICAgICAgaWYgKGNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjb21tb25DbGFzc2VzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHJlc3RydWN0dXJlIHJlbW92YWwgYXMgMnggc2V0IC8gMnggZGVsZXRlLCBpbnN0ZWFkIG9mIG1vZGlmeSBhbHdheXMgcmVwbGFjaW5nIHdpdGggbmV3IGNvbGxlY3Rpb25cbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gYXR0cmlidXRlc1xuICAgIGlmIChjb21tb25BdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZWxlbWVudEF0dHJpYnV0ZXMpLnJlZHVjZSgoYXR0cmlidXRlcywga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGVsZW1lbnRBdHRyaWJ1dGVzW2tleV1cbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgICAgIC8vIE5PVEU6IHdvcmthcm91bmQgZGV0ZWN0aW9uIGZvciBub24tc3RhbmRhcmQgcGhhbnRvbWpzIE5hbWVkTm9kZU1hcCBiZWhhdmlvdXJcbiAgICAgICAgLy8gKGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXJpeWEvcGhhbnRvbWpzL2lzc3Vlcy8xNDYzNClcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9LCB7fSlcblxuICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcylcbiAgICAgIGNvbnN0IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpXG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICghY29tbW9uQXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25BdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc05hbWVzLnJlZHVjZSgobmV4dENvbW1vbkF0dHJpYnV0ZXMsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29tbW9uQXR0cmlidXRlc1tuYW1lXVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBhdHRyaWJ1dGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgIG5leHRDb21tb25BdHRyaWJ1dGVzW25hbWVdID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0Q29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gdGFnXG4gICAgaWYgKGNvbW1vblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB0YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKCFjb21tb25UYWcpIHtcbiAgICAgICAgY29tbW9uUHJvcGVydGllcy50YWcgPSB0YWdcbiAgICAgIH0gZWxzZSBpZiAodGFnICE9PSBjb21tb25UYWcpIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMudGFnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBjb21tb25Qcm9wZXJ0aWVzXG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24uanMiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0Tm9kZUxpc3QgKG5vZGVzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlVmFsdWUgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5yZXBsYWNlKC9bJ1wiYFxcXFwvOj8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XS9nLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvXFxuL2csICdcXHUwMGEwJylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsaXRpZXMuanMiLCIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZSBzZWxlY3RvciBmb3IgYSBub2RlLlxuICovXG5cbmltcG9ydCB7IGdldFNlbGVjdCB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0IHsgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnQsXG4gICAgc2tpcCA9IG51bGwsXG4gICAgcHJpb3JpdHkgPSBbJ2lkJywgJ2NsYXNzJywgJ2hyZWYnLCAnc3JjJ10sXG4gICAgaWdub3JlID0ge30sXG4gICAgZm9ybWF0XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgY29uc3QganF1ZXJ5ID0gKGZvcm1hdCA9PT0gJ2pxdWVyeScpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIGNvbnN0IHNraXBDb21wYXJlID0gc2tpcCAmJiAoQXJyYXkuaXNBcnJheShza2lwKSA/IHNraXAgOiBbc2tpcF0pLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQpID0+IGVsZW1lbnQgPT09IGVudHJ5XG4gICAgfVxuICAgIHJldHVybiBlbnRyeVxuICB9KVxuXG4gIGNvbnN0IHNraXBDaGVja3MgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiBza2lwICYmIHNraXBDb21wYXJlLnNvbWUoKGNvbXBhcmUpID0+IGNvbXBhcmUoZWxlbWVudCkpXG4gIH1cblxuICBPYmplY3Qua2V5cyhpZ25vcmUpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICB2YXIgcHJlZGljYXRlID0gaWdub3JlW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpIHJldHVyblxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcmVkaWNhdGUgPSBuZXcgUmVnRXhwKGVzY2FwZVZhbHVlKHByZWRpY2F0ZSkucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSlcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlID8gLyg/OikvIDogLy5eL1xuICAgIH1cbiAgICAvLyBjaGVjayBjbGFzcy0vYXR0cmlidXRlbmFtZSBmb3IgcmVnZXhcbiAgICBpZ25vcmVbdHlwZV0gPSAobmFtZSwgdmFsdWUpID0+IHByZWRpY2F0ZS50ZXN0KHZhbHVlKVxuICB9KVxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSByb290ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IDExKSB7XG4gICAgaWYgKHNraXBDaGVja3MoZWxlbWVudCkgIT09IHRydWUpIHtcbiAgICAgIC8vIH4gZ2xvYmFsXG4gICAgICBpZiAoY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcm9vdCkpIGJyZWFrXG4gICAgICBpZiAoY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHJvb3QpKSBicmVha1xuXG4gICAgICAvLyB+IGxvY2FsXG4gICAgICBjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KVxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG5cbiAgICAgIGlmIChqcXVlcnkgJiYgcGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NvbnRhaW5zKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIH1cblxuICAgICAgLy8gZGVmaW5lIG9ubHkgb25lIHBhcnQgZWFjaCBpdGVyYXRpb25cbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrQ2hpbGRzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbGVtZW50ID09PSByb290KSB7XG4gICAgY29uc3QgcGF0dGVybiA9IGZpbmRQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdClcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHBhcmVudClcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4sIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogR2V0IGNsYXNzIHNlbGVjdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IGNsYXNzZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENsYXNzU2VsZWN0b3IoY2xhc3NlcyA9IFtdLCBzZWxlY3QsIHBhcmVudCwgcHJlZml4ID0gJycpIHtcbiAgbGV0IHJlc3VsdCA9IFtbXV1cblxuICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHIuY29uY2F0KCcuJyArIGMpKVxuICAgIH0pXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcblxuICByZXN1bHQgPSByZXN1bHQuc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGggfSlcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHIgPSByZXN1bHRbaV0uam9pbignJylcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KGAke3ByZWZpeH0ke3J9YCwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHJcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIExvb2t1cCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kQXR0cmlidXRlc1BhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykubWFwKCh2YWwpID0+IGF0dHJpYnV0ZXNbdmFsXS5uYW1lKVxuICAgIC5maWx0ZXIoKGEpID0+IHByaW9yaXR5LmluZGV4T2YoYSkgPCAwKVxuXG4gIHZhciBzb3J0ZWRLZXlzID0gWyAuLi5wcmlvcml0eSwgLi4uYXR0cmlidXRlTmFtZXMgXVxuICB2YXIgcGF0dGVybiA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIHZhciBpc09wdGltYWwgPSAocGF0dGVybikgPT4gKHNlbGVjdChwYXR0ZXJuLCBwYXJlbnQpLmxlbmd0aCA9PT0gMSlcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUpXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLnZhbHVlKVxuICAgIGNvbnN0IHVzZU5hbWVkSWdub3JlID0gYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBpZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBjb25zdCBjdXJyZW50RGVmYXVsdElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHN3aXRjaCAoYXR0cmlidXRlTmFtZSkge1xuICAgICAgY2FzZSAnaWQnOlxuICAgICAgICBwYXR0ZXJuID0gcGF0dGVybi5jb25jYXQoYCMke2F0dHJpYnV0ZVZhbHVlfWApXG4gICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICByZXR1cm4gcGF0dGVyblxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdjbGFzcyc6IHtcbiAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKCkuc3BsaXQoL1xccysvZylcbiAgICAgICAgY29uc3QgY2xhc3NJZ25vcmUgPSBpZ25vcmUuY2xhc3MgfHwgZGVmYXVsdElnbm9yZS5jbGFzc1xuICAgICAgICBpZiAoY2xhc3NJZ25vcmUpIHtcbiAgICAgICAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lcy5maWx0ZXIoY2xhc3NOYW1lID0+ICFjbGFzc0lnbm9yZShjbGFzc05hbWUpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBjbGFzc1BhdHRlcm4gPSBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzTmFtZXMsIHNlbGVjdCwgcGFyZW50LCBwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjbGFzc1BhdHRlcm4pIHtcbiAgICAgICAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLmNvbmNhdChjbGFzc1BhdHRlcm4pXG4gICAgICAgICAgICBpZiAoaXNPcHRpbWFsKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHBhdHRlcm4gPSBwYXR0ZXJuLmNvbmNhdChgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWApXG4gICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICByZXR1cm4gcGF0dGVyblxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnIChlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgbGV0IG1hdGNoZXMgPSBbXVxuICAgIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybiwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICBpZiAocGF0dGVybiA9PT0gJ2lmcmFtZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRUYWdQYXR0ZXJuIChlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBOT1RFOiAnY2hpbGRUYWdzJyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYXMgYSB2aWV3IGZpbHRlciBmb3IgdGFncyB1c2luZyAnYWRhcHRlci5qcydcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGRzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkVGFncyB8fCBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkID09PSBlbGVtZW50KSB7XG4gICAgICBjb25zdCBjaGlsZFBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgY2hpbGQsIGlnbm9yZSwgc2VsZWN0KVxuICAgICAgaWYgKCFjaGlsZFBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICAgICAgRWxlbWVudCBjb3VsZG4ndCBiZSBtYXRjaGVkIHRocm91Z2ggc3RyaWN0IGlnbm9yZSBwYXR0ZXJuIVxuICAgICAgICBgLCBjaGlsZCwgaWdub3JlLCBjaGlsZFBhdHRlcm4pXG4gICAgICB9XG4gICAgICBjb25zdCBwYXR0ZXJuID0gYD4gJHtjaGlsZFBhdHRlcm59Om50aC1jaGlsZCgke2krMX0pYFxuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGNvbnRhaW5zXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NvbnRhaW5zIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpIHtcbiAgY29uc3QgZWxlbWVudFBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCB0ZXh0cyA9IGVsZW1lbnQudGV4dENvbnRlbnRcbiAgICAucmVwbGFjZSgvXFxuKy9nLCAnXFxuJylcbiAgICAuc3BsaXQoJ1xcbicpXG4gICAgLm1hcCh0ZXh0ID0+IHRleHQudHJpbSgpKVxuICAgIC5maWx0ZXIodGV4dCA9PiB0ZXh0Lmxlbmd0aCA+IDApXG5cbiAgbGV0IHBhdHRlcm4gPSBgPiAke2VsZW1lbnRQYXR0ZXJufWBcbiAgY29uc3QgZm91bmQgPSB0ZXh0cy5zb21lKHRleHQgPT4ge1xuICAgIHBhdHRlcm4gPSBgJHtwYXR0ZXJufTpjb250YWlucyhcIiR7dGV4dH1cIilgXG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuLCBwYXJlbnQpXG4gICAgcmV0dXJuIG1hdGNoZXMubGVuZ3RoID09PSAxXG4gIH0pXG4gIGlmIChmb3VuZCkge1xuICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpIHtcbiAgdmFyIHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICB9XG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogVmFsaWRhdGUgd2l0aCBjdXN0b20gYW5kIGRlZmF1bHQgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHByZWRpY2F0ZSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgbmFtZSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259IGRlZmF1bHRQcmVkaWNhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZ25vcmUgKHByZWRpY2F0ZSwgbmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgY2hlY2sgPSBwcmVkaWNhdGUgfHwgZGVmYXVsdFByZWRpY2F0ZVxuICBpZiAoIWNoZWNrKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21hdGNoLmpzIiwiLyoqXG4gKiAjIE9wdGltaXplXG4gKlxuICogMS4pIEltcHJvdmUgZWZmaWNpZW5jeSB0aHJvdWdoIHNob3J0ZXIgc2VsZWN0b3JzIGJ5IHJlbW92aW5nIHJlZHVuZGFuY3lcbiAqIDIuKSBJbXByb3ZlIHJvYnVzdG5lc3MgdGhyb3VnaCBzZWxlY3RvciB0cmFuc2Zvcm1hdGlvblxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChzZWxlY3RvciwgZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmIChzZWxlY3Rvci5zdGFydHNXaXRoKCc+ICcpKSB7XG4gICAgc2VsZWN0b3IgPSBzZWxlY3Rvci5yZXBsYWNlKCc+ICcsICcnKVxuICB9XG5cbiAgLy8gY29udmVydCBzaW5nbGUgZW50cnkgYW5kIE5vZGVMaXN0XG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9ICFlbGVtZW50cy5sZW5ndGggPyBbZWxlbWVudHNdIDogY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50cy5sZW5ndGggfHwgZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSB0byBjb21wYXJlIEhUTUxFbGVtZW50cyBpdHMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSByZWZlcmVuY2Ugb2YgdGhlIHNlbGVjdGVkIG5vZGUocykhIChtaXNzaW5nIFwiZWxlbWVudHNcIiknKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG5cbiAgLy8gY2h1bmsgcGFydHMgb3V0c2lkZSBvZiBxdW90ZXMgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI1NjYzNzI5LCBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTYyNjE2OTMpXG4gIC8vIHZhciBwYXRoID0gc2VsZWN0b3IucmVwbGFjZSgvPiAvZywgJz4nKS5zcGxpdCgvXFxzKyg/PSg/Oig/OlteXCJdKlwiKXsyfSkqW15cIl0qJCkvKVxuICB2YXIgcGF0aCA9IHNlbGVjdG9yLnJlcGxhY2UoLz4gL2csICc+JykubWF0Y2goLyg/OlteXFxzXCJdK3xcIlteXCJdKlwiKSsvZylcblxuICBpZiAocGF0aC5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIG9wdGltaXplUGFydCgnJywgc2VsZWN0b3IsICcnLCBlbGVtZW50cywgc2VsZWN0KVxuICB9XG5cbiAgdmFyIGVuZE9wdGltaXplZCA9IGZhbHNlXG4gIGlmICgvPi8udGVzdChwYXRoW3BhdGgubGVuZ3RoLTFdKSkge1xuICAgIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aC5zbGljZSgwLCAtMSkuam9pbignICcpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCAnJywgZWxlbWVudHMsIHNlbGVjdClcbiAgICBlbmRPcHRpbWl6ZWQgPSB0cnVlXG4gIH1cblxuICBjb25zdCBzaG9ydGVuZWQgPSBbcGF0aC5wb3AoKV1cbiAgd2hpbGUgKHBhdGgubGVuZ3RoID4gMSkgIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aC5wb3AoKVxuICAgIGNvbnN0IHByZVBhcnQgPSBwYXRoLmpvaW4oJyAnKVxuICAgIGNvbnN0IHBvc3RQYXJ0ID0gc2hvcnRlbmVkLmpvaW4oJyAnKVxuXG4gICAgY29uc3QgcGF0dGVybiA9IGAke3ByZVBhcnR9ICR7cG9zdFBhcnR9YFxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICBjb25zdCBoYXNTYW1lUmVzdWx0ID0gbWF0Y2hlcy5sZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCwgaSkgPT4gZWxlbWVudCA9PT0gbWF0Y2hlc1tpXSlcbiAgICBpZiAoIWhhc1NhbWVSZXN1bHQpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLmpvaW4oJyAnKSwgZWxlbWVudHMsIHNlbGVjdClcbiAgaWYgKCFlbmRPcHRpbWl6ZWQpIHtcbiAgICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLmpvaW4oJyAnKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnRzLCBzZWxlY3QpXG4gIH1cblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJykucmVwbGFjZSgvPi9nLCAnPiAnKS50cmltKClcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSA6Y29udGFpbnNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplQ29udGFpbnMgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIGlmICgvOmNvbnRhaW5zXFwoLy50ZXN0KGN1cnJlbnQpICYmIHBvc3RQYXJ0Lmxlbmd0aCkge1xuICAgIGxldCBmaXJzdEluZGV4ID0gY3VycmVudC5pbmRleE9mKCc6Y29udGFpbnMoJylcbiAgICBsZXQgY29udGFpbnNJbmRleCA9IGN1cnJlbnQubGFzdEluZGV4T2YoJzpjb250YWlucygnKVxuICAgIGxldCBvcHRpbWl6ZWQgPSBjdXJyZW50LnNsaWNlKDAsIGNvbnRhaW5zSW5kZXgpXG4gICAgd2hpbGUgKGNvbnRhaW5zSW5kZXggPiBmaXJzdEluZGV4ICYmIGNvbXBhcmVSZXN1bHRzKHNlbGVjdChgJHtwcmVQYXJ0fSR7b3B0aW1pemVkfSR7cG9zdFBhcnR9YCksIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IG9wdGltaXplZFxuICAgICAgY29udGFpbnNJbmRleCA9IGN1cnJlbnQubGFzdEluZGV4T2YoJzpjb250YWlucygnKVxuICAgICAgb3B0aW1pemVkID0gY3VycmVudC5zbGljZSgwLCBjb250YWluc0luZGV4KVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplQXR0cmlidXRlcyAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgLy8gcmVkdWNlIGF0dHJpYnV0ZXM6IGZpcnN0IHRyeSB3aXRob3V0IHZhbHVlLCB0aGVuIHJlbW92aW5nIGNvbXBsZXRlbHlcbiAgaWYgKC9cXFsqXFxdLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgdmFyIGl0ZW1zID0gY3VycmVudC5tYXRjaCgvKD86XFxbW149XSs9XCJbXlwiXSpcIlxcXSkvZykucmV2ZXJzZSgpXG5cbiAgICBjb25zdCBzaW1wbGlmeSA9IChvcmlnaW5hbCwgZ2V0UGFydGlhbCkgPT5cbiAgICAgIGl0ZW1zLnJlZHVjZSgoYWNjLCBpdGVtKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRpYWwgPSBnZXRQYXJ0aWFsKGFjYywgaXRlbSlcbiAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7cGFydGlhbH0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICAgICAgcmV0dXJuIGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSA/IHBhcnRpYWwgOiBhY2MgXG4gICAgICB9LCBvcmlnaW5hbClcblxuICAgIGNvbnN0IHNpbXBsaWZpZWQgPSBzaW1wbGlmeShjdXJyZW50LCAoY3VycmVudCwgaXRlbSkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gaXRlbS5yZXBsYWNlKC89LiokLywgJ10nKVxuICAgICAgcmV0dXJuIGN1cnJlbnQucmVwbGFjZShpdGVtLCBrZXkpXG4gICAgfSlcblxuICAgIHJldHVybiBzaW1wbGlmeShzaW1wbGlmaWVkLCAoY3VycmVudCwgaXRlbSkgPT4gY3VycmVudC5yZXBsYWNlKGl0ZW0sICcnKSlcbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGRlc2NlbmRhbnRcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplRGVzY2VuZGFudCAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmICgvPi8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjdXJyZW50LnJlcGxhY2UoLz4vLCAnJylcbiAgICB2YXIgcGF0dGVybjMgPSBgJHtwcmVQYXJ0fSR7ZGVzY2VuZGFudH0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlczMgPSBzZWxlY3QocGF0dGVybjMpXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgZGVzY2VuZGFudFxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVOdGhPZlR5cGUgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIC8vIHJvYnVzdG5lc3M6ICdudGgtb2YtdHlwZScgaW5zdGVhZCAnbnRoLWNoaWxkJyAoaGV1cmlzdGljKVxuICBpZiAoLzpudGgtY2hpbGQvLnRlc3QoY3VycmVudCkpIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciBjb21wbGV0ZSBjb3ZlcmFnZSBvZiAnbnRoLW9mLXR5cGUnIHJlcGxhY2VtZW50XG4gICAgY29uc3QgdHlwZSA9IGN1cnJlbnQucmVwbGFjZSgvbnRoLWNoaWxkL2csICdudGgtb2YtdHlwZScpXG4gICAgdmFyIHBhdHRlcm40ID0gYCR7cHJlUGFydH0ke3R5cGV9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXM0ID0gc2VsZWN0KHBhdHRlcm40KVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzNCwgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0gdHlwZVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGNsYXNzZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplQ2xhc3NlcyAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmICgvXlxcLlxcUypbXlxcc1xcXFxdXFwuXFxTKy8udGVzdChjdXJyZW50KSkge1xuICAgIHZhciBuYW1lcyA9IGN1cnJlbnQudHJpbSgpXG4gICAgICAucmVwbGFjZSgvKF58W15cXFxcXSlcXC4vZywgJyQxIy4nKSAvLyBlc2NhcGUgYWN0dWFsIGRvdHNcbiAgICAgIC5zcGxpdCgnIy4nKSAvLyBzcGxpdCBvbmx5IG9uIGFjdHVhbCBkb3RzXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApXG4gICAgICAuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcbiAgICB3aGlsZSAobmFtZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJ0aWFsID0gY3VycmVudC5yZXBsYWNlKG5hbWVzLnNoaWZ0KCksICcnKS50cmltKClcbiAgICAgIHZhciBwYXR0ZXJuNSA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YC50cmltKClcbiAgICAgIGlmICghcGF0dGVybjUubGVuZ3RoIHx8IHBhdHRlcm41LmNoYXJBdCgwKSA9PT0gJz4nIHx8IHBhdHRlcm41LmNoYXJBdChwYXR0ZXJuNS5sZW5ndGgtMSkgPT09ICc+Jykge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdmFyIG1hdGNoZXM1ID0gc2VsZWN0KHBhdHRlcm41KVxuICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXM1LCBlbGVtZW50cykpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcnRpYWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgbmFtZXMgPSBjdXJyZW50ICYmIGN1cnJlbnQubWF0Y2goL1xcLi9nKVxuICAgIGlmIChuYW1lcyAmJiBuYW1lcy5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gc2VsZWN0KGAke3ByZVBhcnR9JHtjdXJyZW50fWApXG4gICAgICBmb3IgKHZhciBpMiA9IDAsIGwyID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpMl1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSApKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybjYgPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXM2ID0gc2VsZWN0KHBhdHRlcm42KVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzNiwgZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gZGVzY3JpcHRpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG5jb25zdCBvcHRpbWl6ZXJzID0gW1xuICBvcHRpbWl6ZUNvbnRhaW5zLFxuICBvcHRpbWl6ZUF0dHJpYnV0ZXMsXG4gIG9wdGltaXplRGVzY2VuZGFudCxcbiAgb3B0aW1pemVOdGhPZlR5cGUsXG4gIG9wdGltaXplQ2xhc3Nlcyxcbl1cblxuLyoqXG4gKiBJbXByb3ZlIGEgY2h1bmsgb2YgdGhlIHNlbGVjdG9yXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZVBhcnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIGlmIChwcmVQYXJ0Lmxlbmd0aCkgcHJlUGFydCA9IGAke3ByZVBhcnR9IGBcbiAgaWYgKHBvc3RQYXJ0Lmxlbmd0aCkgcG9zdFBhcnQgPSBgICR7cG9zdFBhcnR9YFxuXG4gIHJldHVybiBvcHRpbWl6ZXJzLnJlZHVjZSgoYWNjLCBvcHRpbWl6ZXIpID0+IG9wdGltaXplcihwcmVQYXJ0LCBhY2MsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSwgY3VycmVudClcbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBtYXRjaGVzIHdpdGggZXhwZWN0ZWQgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBtYXRjaGVzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVSZXN1bHRzIChtYXRjaGVzLCBlbGVtZW50cykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbWF0Y2hlc1xuICByZXR1cm4gbGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vcHRpbWl6ZS5qcyIsIi8qKlxuICogIyBBZGFwdFxuICpcbiAqIENoZWNrIGFuZCBleHRlbmQgdGhlIGVudmlyb25tZW50IGZvciB1bml2ZXJzYWwgdXNhZ2UuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG4gIC8vIGRldGVjdCBlbnZpcm9ubWVudCBzZXR1cFxuICBpZiAoZ2xvYmFsLmRvY3VtZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmRvY3VtZW50ID0gb3B0aW9ucy5jb250ZXh0IHx8ICgoKSA9PiB7XG4gICAgICB2YXIgcm9vdCA9IGVsZW1lbnRcbiAgICAgIHdoaWxlIChyb290LnBhcmVudCkge1xuICAgICAgICByb290ID0gcm9vdC5wYXJlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290XG4gICAgfSkoKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9taGFuZGxlci9ibG9iL21hc3Rlci9pbmRleC5qcyNMNzVcbiAgY29uc3QgRWxlbWVudFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwuZG9jdW1lbnQpXG5cbiAgLy8gYWx0ZXJuYXRpdmUgZGVzY3JpcHRvciB0byBhY2Nlc3MgZWxlbWVudHMgd2l0aCBmaWx0ZXJpbmcgaW52YWxpZCBlbGVtZW50cyAoZS5nLiB0ZXh0bm9kZXMpXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21lbGVtZW50dHlwZS9ibG9iL21hc3Rlci9pbmRleC5qcyNMMTJcbiAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAndGFnJyB8fCBub2RlLnR5cGUgPT09ICdzY3JpcHQnIHx8IG5vZGUudHlwZSA9PT0gJ3N0eWxlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnKSkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dHJpYnV0ZXNcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTmFtZWROb2RlTWFwXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlicyB9ID0gdGhpc1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJzKVxuICAgICAgICBjb25zdCBOYW1lZE5vZGVNYXAgPSBhdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChhdHRyaWJ1dGVzLCBhdHRyaWJ1dGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJzW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICAgIH0sIHsgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hbWVkTm9kZU1hcCwgJ2xlbmd0aCcsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBOYW1lZE5vZGVNYXBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJzW25hbWVdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHModGhpcy5jaGlsZFRhZ3MsIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50Lm5hbWUgPT09IHRhZ05hbWUgfHwgdGFnTmFtZSA9PT0gJyonKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgbmFtZXMgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKS5zcGxpdCgnICcpXG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudENsYXNzTmFtZSA9IGRlc2NlbmRhbnQuYXR0cmlicy5jbGFzc1xuICAgICAgICBpZiAoZGVzY2VuZGFudENsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gZGVzY2VuZGFudENsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvY3NzL3NlbGVjdG9yc19hcGkvcXVlcnlTZWxlY3RvckFsbFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICBFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3JzKSB7XG4gICAgICBzZWxlY3RvcnMgPSBzZWxlY3RvcnMucmVwbGFjZSgvKD4pKFxcUykvZywgJyQxICQyJykudHJpbSgpIC8vIGFkZCBzcGFjZSBmb3IgJz4nIHNlbGVjdG9yXG5cbiAgICAgIC8vIHVzaW5nIHJpZ2h0IHRvIGxlZnQgZXhlY3V0aW9uID0+IGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2Nzcy1zZWxlY3QjaG93LWRvZXMtaXQtd29ya1xuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gZ2V0SW5zdHJ1Y3Rpb25zKHNlbGVjdG9ycylcbiAgICAgIGNvbnN0IGRpc2NvdmVyID0gaW5zdHJ1Y3Rpb25zLnNoaWZ0KClcblxuICAgICAgY29uc3QgdG90YWwgPSBpbnN0cnVjdGlvbnMubGVuZ3RoXG4gICAgICByZXR1cm4gZGlzY292ZXIodGhpcykuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIHZhciBzdGVwID0gMFxuICAgICAgICB3aGlsZSAoc3RlcCA8IHRvdGFsKSB7XG4gICAgICAgICAgbm9kZSA9IGluc3RydWN0aW9uc1tzdGVwXShub2RlLCB0aGlzKVxuICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBoaWVyYXJjaHkgZG9lc24ndCBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0ZXAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5jb250YWlucykge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NvbnRhaW5zXG4gICAgRWxlbWVudFByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgaW5jbHVzaXZlID0gZmFsc2VcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudCA9PT0gZWxlbWVudCkge1xuICAgICAgICAgIGluY2x1c2l2ZSA9IHRydWVcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbmNsdXNpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRyYW5zZm9ybWF0aW9uIHN0ZXBzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59ICAgc2VsZWN0b3JzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEZ1bmN0aW9uPn0gICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnMgKHNlbGVjdG9ycykge1xuICByZXR1cm4gc2VsZWN0b3JzLnNwbGl0KCcgJykucmV2ZXJzZSgpLm1hcCgoc2VsZWN0b3IsIHN0ZXApID0+IHtcbiAgICBjb25zdCBkaXNjb3ZlciA9IHN0ZXAgPT09IDBcbiAgICBjb25zdCBbdHlwZSwgcHNldWRvXSA9IHNlbGVjdG9yLnNwbGl0KCc6JylcblxuICAgIHZhciB2YWxpZGF0ZSA9IG51bGxcbiAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBudWxsXG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcblxuICAgICAgLy8gY2hpbGQ6ICc+J1xuICAgICAgY2FzZSAvPi8udGVzdCh0eXBlKTpcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1BhcmVudCAobm9kZSkge1xuICAgICAgICAgIHJldHVybiAodmFsaWRhdGUpID0+IHZhbGlkYXRlKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBuYW1lcyA9IHR5cGUuc3Vic3RyKDEpLnNwbGl0KCcuJylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGVDbGFzc05hbWUgPSBub2RlLmF0dHJpYnMuY2xhc3NcbiAgICAgICAgICByZXR1cm4gbm9kZUNsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gbm9kZUNsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0NsYXNzIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG5hbWVzLmpvaW4oJyAnKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZTogJ1trZXk9XCJ2YWx1ZVwiXSdcbiAgICAgIGNhc2UgL15cXFsvLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdID0gdHlwZS5yZXBsYWNlKC9cXFt8XFxdfFwiL2csICcnKS5zcGxpdCgnPScpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBoYXNBdHRyaWJ1dGUgPSBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmluZGV4T2YoYXR0cmlidXRlS2V5KSA+IC0xXG4gICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZSkgeyAvLyByZWdhcmQgb3B0aW9uYWwgYXR0cmlidXRlVmFsdWVcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlVmFsdWUgfHwgKG5vZGUuYXR0cmlic1thdHRyaWJ1dGVLZXldID09PSBhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gaWQ6ICcjJ1xuICAgICAgY2FzZSAvXiMvLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6IHtcbiAgICAgICAgdmFsaWRhdGUgPSAoKSA9PiB0cnVlXG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tVbml2ZXJzYWwgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4gTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gdGFnOiAnLi4uJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09IHR5cGVcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVGFnIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHNldWRvKSB7XG4gICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25cbiAgICB9XG5cbiAgICBjb25zdCBydWxlID0gcHNldWRvLm1hdGNoKC8tKGNoaWxkfHR5cGUpXFwoKFxcZCspXFwpJC8pXG4gICAgY29uc3Qga2luZCA9IHJ1bGVbMV1cbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHJ1bGVbMl0sIDEwKSAtIDFcblxuICAgIGNvbnN0IHZhbGlkYXRlUHNldWRvID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciBjb21wYXJlU2V0ID0gbm9kZS5wYXJlbnQuY2hpbGRUYWdzXG4gICAgICAgIGlmIChraW5kID09PSAndHlwZScpIHtcbiAgICAgICAgICBjb21wYXJlU2V0ID0gY29tcGFyZVNldC5maWx0ZXIodmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gY29tcGFyZVNldC5maW5kSW5kZXgoKGNoaWxkKSA9PiBjaGlsZCA9PT0gbm9kZSlcbiAgICAgICAgaWYgKG5vZGVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZW5oYW5jZUluc3RydWN0aW9uIChub2RlKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGluc3RydWN0aW9uKG5vZGUpXG4gICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoLnJlZHVjZSgoTm9kZUxpc3QsIG1hdGNoZWROb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlUHNldWRvKG1hdGNoZWROb2RlKSkge1xuICAgICAgICAgICAgTm9kZUxpc3QucHVzaChtYXRjaGVkTm9kZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgIH0sIFtdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRlUHNldWRvKG1hdGNoKSAmJiBtYXRjaFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBXYWxraW5nIHJlY3Vyc2l2ZSB0byBpbnZva2UgY2FsbGJhY2tzXG4gKlxuICogQHBhcmFtIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBub2RlcyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgICAgICBoYW5kbGVyIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZURlc2NlbmRhbnRzIChub2RlcywgaGFuZGxlcikge1xuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgdmFyIHByb2dyZXNzID0gdHJ1ZVxuICAgIGhhbmRsZXIobm9kZSwgKCkgPT4gcHJvZ3Jlc3MgPSBmYWxzZSlcbiAgICBpZiAobm9kZS5jaGlsZFRhZ3MgJiYgcHJvZ3Jlc3MpIHtcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMobm9kZS5jaGlsZFRhZ3MsIGhhbmRsZXIpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEJ1YmJsZSB1cCBmcm9tIGJvdHRvbSB0byB0b3BcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcm9vdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgdmFsaWRhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEFuY2VzdG9yIChub2RlLCByb290LCB2YWxpZGF0ZSkge1xuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBub2RlID0gbm9kZS5wYXJlbnRcbiAgICBpZiAodmFsaWRhdGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgfVxuICAgIGlmIChub2RlID09PSByb290KSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FkYXB0LmpzIiwiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnkgc2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEZvciBsb25nZXZpdHkgaXQgYXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzLlxuICovXG5pbXBvcnQgY3NzMnhwYXRoIGZyb20gJ2NzczJ4cGF0aCdcblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRTZWxlY3QsIGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5cbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IFtyb290XSAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgcm9vdCBlbGVtZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uIHwgQXJyYXkuPEhUTUxFbGVtZW50Pn0gW3NraXBdICBTcGVjaWZ5IGVsZW1lbnRzIHRvIHNraXBcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IFtwcmlvcml0eV0gICAgICAgICAgICAgIE9yZGVyIG9mIGF0dHJpYnV0ZSBwcm9jZXNzaW5nXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsIGZ1bmN0aW9uIHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbn0gW2lnbm9yZV0gRGVmaW5lIHBhdHRlcm5zIHdoaWNoIHNob3VsZG4ndCBiZSBpbmNsdWRlZFxuICogQHByb3BlcnR5IHsoJ2Nzcyd8J3hwYXRoJ3wnanF1ZXJ5Jyl9IFtmb3JtYXRdICAgICAgT3V0cHV0IGZvcm1hdCAgICBcbiAqL1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZH1cbiAgLy8gYClcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gb3B0aW1pemVkXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSBvbmx5IGFuIEFycmF5IG9mIEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBpcyBzdXBwb3J0ZWQhJylcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIGNvbnN0IGFuY2VzdG9yID0gZ2V0Q29tbW9uQW5jZXN0b3IoZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IGFuY2VzdG9yU2VsZWN0b3IgPSBnZXRTaW5nbGVTZWxlY3RvcihhbmNlc3Rvciwgb3B0aW9ucylcblxuICAvLyBUT0RPOiBjb25zaWRlciB1c2FnZSBvZiBtdWx0aXBsZSBzZWxlY3RvcnMgKyBwYXJlbnQtY2hpbGQgcmVsYXRpb24gKyBjaGVjayBmb3IgcGFydCByZWR1bmRhbmN5XG4gIGNvbnN0IGNvbW1vblNlbGVjdG9ycyA9IGdldENvbW1vblNlbGVjdG9ycyhlbGVtZW50cylcbiAgY29uc3QgZGVzY2VuZGFudFNlbGVjdG9yID0gY29tbW9uU2VsZWN0b3JzWzBdXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpbWl6ZShgJHthbmNlc3RvclNlbGVjdG9yfSAke2Rlc2NlbmRhbnRTZWxlY3Rvcn1gLCBlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0b3JNYXRjaGVzID0gY29udmVydE5vZGVMaXN0KHNlbGVjdChzZWxlY3RvcikpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhbid0IGJlIGVmZmljaWVudGx5IG1hcHBlZC5cbiAgICAgIEl0cyBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhXG4gICAgYCwgZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgc2VsZWN0b3JzIHRvIGRlc2NyaWJlIGEgc2V0IG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDb21tb25TZWxlY3RvcnMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgeyBjbGFzc2VzLCBhdHRyaWJ1dGVzLCB0YWcgfSA9IGdldENvbW1vblByb3BlcnRpZXMoZWxlbWVudHMpXG5cbiAgY29uc3Qgc2VsZWN0b3JQYXRoID0gW11cblxuICBpZiAodGFnKSB7XG4gICAgc2VsZWN0b3JQYXRoLnB1c2godGFnKVxuICB9XG5cbiAgaWYgKGNsYXNzZXMpIHtcbiAgICBjb25zdCBjbGFzc1NlbGVjdG9yID0gY2xhc3Nlcy5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goY2xhc3NTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlU2VsZWN0b3IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5yZWR1Y2UoKHBhcnRzLCBuYW1lKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKGBbJHtuYW1lfT1cIiR7YXR0cmlidXRlc1tuYW1lXX1cIl1gKVxuICAgICAgcmV0dXJuIHBhcnRzXG4gICAgfSwgW10pLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goYXR0cmlidXRlU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoc2VsZWN0b3JQYXRoLmxlbmd0aCkge1xuICAgIC8vIFRPRE86IGNoZWNrIGZvciBwYXJlbnQtY2hpbGQgcmVsYXRpb25cbiAgfVxuXG4gIHJldHVybiBbXG4gICAgc2VsZWN0b3JQYXRoLmpvaW4oJycpXG4gIF1cbn1cblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKG11bHRpcGxlL3NpbmdsZSlcbiAqXG4gKiBOT1RFOiBleHRlbmRlZCBkZXRlY3Rpb24gaXMgdXNlZCBmb3Igc3BlY2lhbCBjYXNlcyBsaWtlIHRoZSA8c2VsZWN0PiBlbGVtZW50IHdpdGggPG9wdGlvbnM+XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8Tm9kZUxpc3R8QXJyYXkuPEhUTUxFbGVtZW50Pn0gaW5wdXQgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRRdWVyeVNlbGVjdG9yIChpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICBjb25zdCByZXN1bHQgPSBnZXRTaW5nbGVTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgaWYgKG9wdGlvbnMgJiYgWzEsICd4cGF0aCddLmluY2x1ZGVzKG9wdGlvbnMuZm9ybWF0KSkge1xuICAgIHJldHVybiBjc3MyeHBhdGgocmVzdWx0KVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHhwYXRoX3RvX2xvd2VyICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICtcbiAgICAgICAgICAgICAgICAocyB8fCAnbm9ybWFsaXplLXNwYWNlKCknKSArXG4gICAgICAgICAgICAgICAgJywgXFwnQUJDREVGR0hKSUtMTU5PUFFSU1RVVldYWVpcXCcnICtcbiAgICAgICAgICAgICAgICAnLCBcXCdhYmNkZWZnaGppa2xtbm9wcXJzdHV2d3h5elxcJyknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX2VuZHNfd2l0aCAgICAgICAgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nKCcgKyBzMSArICcsJyArXG4gICAgICAgICAgICAgICAgJ3N0cmluZy1sZW5ndGgoJyArIHMxICsgJyktc3RyaW5nLWxlbmd0aCgnICsgczIgKyAnKSsxKT0nICsgczI7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsICAgICAgICAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiOi8vXCIpLFwiP1wiKSxcIj9cIiknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybF9wYXRoICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1hZnRlcignICsgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCIvXCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfZG9tYWluICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYmVmb3JlKGNvbmNhdChzdWJzdHJpbmctYWZ0ZXIoJyArXG4gICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIi9cIiksXCIvXCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfYXR0cnMgICAgICAgID0gJ0BocmVmfEBzcmMnLFxuICAgICAgeHBhdGhfbG93ZXJfY2FzZSAgICAgICA9IHhwYXRoX3RvX2xvd2VyKCksXG4gICAgICB4cGF0aF9uc191cmkgICAgICAgICAgID0gJ2FuY2VzdG9yLW9yLXNlbGY6OipbbGFzdCgpXS9AdXJsJyxcbiAgICAgIHhwYXRoX25zX3BhdGggICAgICAgICAgPSB4cGF0aF91cmxfcGF0aCh4cGF0aF91cmwoeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9oYXNfcHJvdG9jYWwgICAgID0gJyhzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcImh0dHA6Ly9cIikgb3Igc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwczovL1wiKSknLFxuICAgICAgeHBhdGhfaXNfaW50ZXJuYWwgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsKCkgKyAnLCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnKSBvciAnICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX3VybF9kb21haW4oKSwgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpKSxcbiAgICAgIHhwYXRoX2lzX2xvY2FsICAgICAgICAgPSAnKCcgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnIGFuZCBzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsKCkgKyAnLCcgKyB4cGF0aF91cmwoeHBhdGhfbnNfdXJpKSArICcpKScsXG4gICAgICB4cGF0aF9pc19wYXRoICAgICAgICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiL1wiKScsXG4gICAgICB4cGF0aF9pc19sb2NhbF9wYXRoICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJywnICsgeHBhdGhfbnNfcGF0aCArICcpJyxcbiAgICAgIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSAgPSAnbm9ybWFsaXplLXNwYWNlKCknLFxuICAgICAgeHBhdGhfaW50ZXJuYWwgICAgICAgICA9ICdbbm90KCcgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnKSBvciAnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnXScsXG4gICAgICB4cGF0aF9leHRlcm5hbCAgICAgICAgID0gJ1snICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgbm90KCcgKyB4cGF0aF9pc19pbnRlcm5hbCArICcpXScsXG4gICAgICBlc2NhcGVfbGl0ZXJhbCAgICAgICAgID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMCksXG4gICAgICBlc2NhcGVfcGFyZW5zICAgICAgICAgID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMSksXG4gICAgICByZWdleF9zdHJpbmdfbGl0ZXJhbCAgID0gLyhcIlteXCJcXHgxRV0qXCJ8J1teJ1xceDFFXSonfD1cXHMqW15cXHNcXF1cXCdcXFwiXSspL2csXG4gICAgICByZWdleF9lc2NhcGVkX2xpdGVyYWwgID0gL1snXCJdPyhcXHgxRSspWydcIl0/L2csXG4gICAgICByZWdleF9jc3Nfd3JhcF9wc2V1ZG8gID0gLyhcXHgxRlxcKXxbXlxcKV0pXFw6KGZpcnN0fGxpbWl0fGxhc3R8Z3R8bHR8ZXF8bnRoKShbXlxcLV18JCkvLFxuICAgICAgcmVnZXhfc3BlY2FsX2NoYXJzICAgICA9IC9bXFx4MUMtXFx4MUZdKy9nLFxuICAgICAgcmVnZXhfZmlyc3RfYXhpcyAgICAgICA9IC9eKFtcXHNcXChcXHgxRl0qKShcXC4/W15cXC5cXC9cXChdezEsMn1bYS16XSo6KikvLFxuICAgICAgcmVnZXhfZmlsdGVyX3ByZWZpeCAgICA9IC8oXnxcXC98XFw6KVxcWy9nLFxuICAgICAgcmVnZXhfYXR0cl9wcmVmaXggICAgICA9IC8oW15cXChcXFtcXC9cXHxcXHNcXHgxRl0pXFxAL2csXG4gICAgICByZWdleF9udGhfZXF1YXRpb24gICAgID0gL14oWy0wLTldKiluLio/KFswLTldKikkLyxcbiAgICAgIGNzc19jb21iaW5hdG9yc19yZWdleCAgPSAvXFxzKighP1srPn4sXiBdKVxccyooXFwuP1xcLyt8W2EtelxcLV0rOjopPyhbYS16XFwtXStcXCgpPygoYW5kXFxzKnxvclxccyp8bW9kXFxzKik/W14rPn4sXFxzJ1wiXFxdXFx8XFxeXFwkXFwhXFw8XFw9XFx4MUMtXFx4MUZdKyk/L2csXG4gICAgICBjc3NfY29tYmluYXRvcnNfY2FsbGJhY2sgPSBmdW5jdGlvbiAobWF0Y2gsIG9wZXJhdG9yLCBheGlzLCBmdW5jLCBsaXRlcmFsLCBleGNsdWRlLCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9ICcnOyAvLyBJZiB3ZSBjYW4sIHdlJ2xsIHByZWZpeCBhICcuJ1xuXG4gICAgICAgIC8vIFhQYXRoIG9wZXJhdG9ycyBjYW4gbG9vayBsaWtlIG5vZGUtbmFtZSBzZWxlY3RvcnNcbiAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiBhbmRcIiwgXCIgb3JcIiwgXCIgbW9kXCJcbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnICcgJiYgZXhjbHVkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF4aXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIE9ubHkgYWxsb3cgbm9kZS1zZWxlY3RpbmcgWFBhdGggZnVuY3Rpb25zXG4gICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIGNvdW50KC4uLilcIiwgXCIgY291bnQoLi4uKVwiLCBcIiA+IHBvc2l0aW9uKClcIiwgZXRjLlxuICAgICAgICAgIGlmIChmdW5jICE9PSB1bmRlZmluZWQgJiYgKGZ1bmMgIT09ICdub2RlKCcgJiYgZnVuYyAhPT0gJ3RleHQoJyAmJiBmdW5jICE9PSAnY29tbWVudCgnKSkgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGl0ZXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gZnVuYztcbiAgICAgICAgICB9IC8vIEhhbmRsZSBjYXNlIFwiICsgdGV4dCgpXCIsIFwiID4gY29tbWVudCgpXCIsIGV0Yy4gd2hlcmUgXCJmdW5jXCIgaXMgb3VyIFwibGl0ZXJhbFwiXG5cbiAgICAgICAgICAgIC8vIFhQYXRoIG1hdGggb3BlcmF0b3JzIG1hdGNoIHNvbWUgQ1NTIGNvbWJpbmF0b3JzXG4gICAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgZm9yIFwiICsgMVwiLCBcIiA+IDFcIiwgZXRjLlxuICAgICAgICAgIGlmIChpc051bWVyaWMobGl0ZXJhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJygnIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICd8JyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnOicpIHtcbiAgICAgICAgICAgIHByZWZpeCA9ICcuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gaWYgd2UgZG9uJ3QgaGF2ZSBhIHNlbGVjdG9yIHRvIGZvbGxvdyB0aGUgYXhpc1xuICAgICAgICBpZiAobGl0ZXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9mZnNldCArIG1hdGNoLmxlbmd0aCA9PT0gb3JpZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxpdGVyYWwgPSAnKic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgcmV0dXJuICcvLycgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICByZXR1cm4gJy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgcmV0dXJuIHByZWZpeCArICcvZm9sbG93aW5nLXNpYmxpbmc6OipbMV0vc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnLCc6XG4gICAgICAgICAgaWYgKGF4aXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgfVxuICAgICAgICAgIGF4aXMgPSAnLi8vJztcbiAgICAgICAgICByZXR1cm4gJ3wnICsgYXhpcyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJ14nOiAvLyBmaXJzdCBjaGlsZFxuICAgICAgICAgIHJldHVybiAnL2NoaWxkOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchXic6IC8vIGxhc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KltsYXN0KCldL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchICc6IC8vIGFuY2VzdG9yLW9yLXNlbGZcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvci1vci1zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIT4nOiAvLyBkaXJlY3QgcGFyZW50XG4gICAgICAgICAgcmV0dXJuICcvcGFyZW50OjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISsnOiAvLyBhZGphY2VudCBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchfic6IC8vIHByZWNlZGluZyBzaWJsaW5nXG4gICAgICAgICAgcmV0dXJuICcvcHJlY2VkaW5nLXNpYmxpbmc6OicgKyBsaXRlcmFsO1xuICAgICAgICAgICAgLy8gY2FzZSAnfn4nXG4gICAgICAgICAgICAvLyByZXR1cm4gJy9mb2xsb3dpbmctc2libGluZzo6Ki9zZWxmOjp8JytzZWxlY3RvclN0YXJ0KG9yaWcsIG9mZnNldCkrJy9wcmVjZWRpbmctc2libGluZzo6Ki9zZWxmOjonK2xpdGVyYWw7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGNzc19hdHRyaWJ1dGVzX3JlZ2V4ID0gL1xcWyhbXlxcXVxcQFxcfFxcKlxcPVxcXlxcflxcJFxcIVxcKFxcL1xcc1xceDFDLVxceDFGXSspXFxzKigoW1xcfFxcKlxcflxcXlxcJFxcIV0/KT0/XFxzKihcXHgxRSspKT9cXF0vZyxcbiAgICAgIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrID0gZnVuY3Rpb24gKHN0ciwgYXR0ciwgY29tcCwgb3AsIHZhbCwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBheGlzID0gJyc7XG4gICAgICAgIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldCAtIDEpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChwcmV2Q2hhciA9PT0gJy8nIHx8IC8vIGZvdW5kIGFmdGVyIGFuIGF4aXMgc2hvcnRjdXQgKFwiL1wiLCBcIi8vXCIsIGV0Yy4pXG4gICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSAgIC8vIGZvdW5kIGFmdGVyIGFuIGF4aXMgKFwic2VsZjo6XCIsIFwicGFyZW50OjpcIiwgZXRjLilcbiAgICAgICAgICAgIGF4aXMgPSAnKic7Ki9cblxuICAgICAgICBzd2l0Y2ggKG9wKSB7XG4gICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tub3QoQCcgKyBhdHRyICsgJykgb3IgQCcgKyBhdHRyICsgJyE9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tzdWJzdHJpbmcoQCcgKyBhdHRyICsgJyxzdHJpbmctbGVuZ3RoKEAnICsgYXR0ciArICcpLShzdHJpbmctbGVuZ3RoKFwiJyArIHZhbCArICdcIiktMSkpPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3RhcnRzLXdpdGgoQCcgKyBhdHRyICsgJyxcIicgKyB2YWwgKyAnXCIpXSc7XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEAnICsgYXR0ciArICcpLFwiIFwiKSxjb25jYXQoXCIgXCIsXCInICsgdmFsICsgJ1wiLFwiIFwiKSldJztcbiAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQCcgKyBhdHRyICsgJz1cIicgKyB2YWwgKyAnXCIgb3Igc3RhcnRzLXdpdGgoQCcgKyBhdHRyICsgJyxjb25jYXQoXCInICsgdmFsICsgJ1wiLFwiLVwiKSldJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoY29tcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoYXR0ci5jaGFyQXQoYXR0ci5sZW5ndGggLSAxKSA9PT0gJygnIHx8IGF0dHIuc2VhcmNoKC9eWzAtOV0rJC8pICE9PSAtMSB8fCBhdHRyLmluZGV4T2YoJzonKSAhPT0gLTEpICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICddJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXggPSAvOihbYS16XFwtXSspKFxcKChcXHgxRispKChbXlxceDFGXSsoXFwzXFx4MUYrKT8pKikoXFwzXFwpKSk/L2csXG4gICAgICBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2sgPSBmdW5jdGlvbiAobWF0Y2gsIG5hbWUsIGcxLCBnMiwgYXJnLCBnMywgZzQsIGc1LCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgaWYgKG9yaWcuY2hhckF0KG9mZnNldCAtIDEpID09PSAnOicgJiYgb3JpZy5jaGFyQXQob2Zmc2V0IC0gMikgIT09ICc6Jykge1xuICAgICAgICAgICAgLy8gWFBhdGggXCJheGlzOjpub2RlLW5hbWVcIiB3aWxsIG1hdGNoXG4gICAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgXCI6bm9kZS1uYW1lXCJcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ29kZCcgfHwgbmFtZSA9PT0gJ2V2ZW4nKSB7XG4gICAgICAgICAgYXJnICA9IG5hbWU7XG4gICAgICAgICAgbmFtZSA9ICdudGgtb2YtdHlwZSc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHsgLy8gbmFtZS50b0xvd2VyQ2FzZSgpP1xuICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdhZnRlci1zaWJsaW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdmb2xsb3dpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZS1zaWJsaW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdmb2xsb3dpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnY2hlY2tlZCc6XG4gICAgICAgICAgcmV0dXJuICdbQHNlbGVjdGVkIG9yIEBjaGVja2VkXSc7XG4gICAgICAgIGNhc2UgJ2NvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb250YWlucygnICsgeHBhdGhfbm9ybWFsaXplX3NwYWNlICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAnaWNvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb250YWlucygnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KCopIGFuZCBub3Qobm9ybWFsaXplLXNwYWNlKCkpXSc7XG4gICAgICAgIGNhc2UgJ2VuYWJsZWQnOlxuICAgICAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBjYXNlICdmaXJzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdmaXJzdCc6XG4gICAgICAgIGNhc2UgJ2xpbWl0JzpcbiAgICAgICAgY2FzZSAnZmlyc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKTw9JyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbMV0nO1xuICAgICAgICBjYXNlICdndCc6XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+JyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICBjYXNlICdsdCc6XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8JyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICBjYXNlICdsYXN0LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KikgYW5kIG5vdChmb2xsb3dpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnb25seS1vZi10eXBlJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OipbbmFtZSgpPW5hbWUoc2VsZjo6bm9kZSgpKV0pIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OipbbmFtZSgpPW5hbWUoc2VsZjo6bm9kZSgpKV0pXSc7XG4gICAgICAgIGNhc2UgJ250aC1jaGlsZCc6XG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSA9ICcgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnZXZlbic6XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpIG1vZCAyPTBdJztcbiAgICAgICAgICBjYXNlICdvZGQnOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0xXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpPj0nICsgYVsxXSArICcgYW5kICgoY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdudGgtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3dpdGNoIChhcmcpIHtcbiAgICAgICAgICBjYXNlICdvZGQnOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0xXSc7XG4gICAgICAgICAgY2FzZSAnZXZlbic6XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpIG1vZCAyPTAgYW5kIHBvc2l0aW9uKCk+PTBdJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIGEgPSAoYXJnIHx8ICcwJykucmVwbGFjZShyZWdleF9udGhfZXF1YXRpb24sICckMSskMicpLnNwbGl0KCcrJyk7XG5cbiAgICAgICAgICAgIGFbMF0gPSBhWzBdIHx8ICcxJztcbiAgICAgICAgICAgIGFbMV0gPSBhWzFdIHx8ICcwJztcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+PScgKyBhWzFdICsgJyBhbmQgKHBvc2l0aW9uKCktJyArIGFbMV0gKyAnKSBtb2QgJyArIGFbMF0gKyAnPTBdJztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VxJzpcbiAgICAgICAgY2FzZSAnbnRoJzpcbiAgICAgICAgICAvLyBQb3NpdGlvbiBzdGFydHMgYXQgMCBmb3IgY29uc2lzdGVuY3kgd2l0aCBTaXp6bGUgc2VsZWN0b3JzXG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgKHBhcnNlSW50KGFyZywgMTApICsgMSkgKyAnXSc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICdbMV0nO1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICByZXR1cm4gJ1tAdHlwZT1cInRleHRcIl0nO1xuICAgICAgICBjYXNlICdpc3RhcnRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF9sb3dlcl9jYXNlICsgJywnICsgeHBhdGhfdG9fbG93ZXIoYXJnKSArICcpXSc7XG4gICAgICAgIGNhc2UgJ3N0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbm9ybWFsaXplX3NwYWNlICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAnaWVuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9sb3dlcl9jYXNlLCB4cGF0aF90b19sb3dlcihhcmcpKSArICddJztcbiAgICAgICAgY2FzZSAnZW5kcy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1snICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX25vcm1hbGl6ZV9zcGFjZSwgYXJnKSArICddJztcbiAgICAgICAgY2FzZSAnaGFzJzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBwcmVwZW5kQXhpcyhjc3MyeHBhdGgoYXJnLCB0cnVlKSwgJy4vLycpO1xuXG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIHhwYXRoICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1zaWJsaW5nJzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBjc3MyeHBhdGgoJ3ByZWNlZGluZy1zaWJsaW5nOjonICsgYXJnLCB0cnVlKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMCBvciBjb3VudChmb2xsb3dpbmctc2libGluZzo6JyArIHhwYXRoLnN1YnN0cigxOSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLXBhcmVudCc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncGFyZW50OjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtYW5jZXN0b3InOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ2FuY2VzdG9yOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdsYXN0JzpcbiAgICAgICAgY2FzZSAnbGFzdC1vZi10eXBlJzpcbiAgICAgICAgICBpZiAoYXJnICE9PSB1bmRlZmluZWQpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPmxhc3QoKS0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tsYXN0KCldJztcbiAgICAgICAgY2FzZSAnc2VsZWN0ZWQnOiAvLyBTaXp6bGU6IFwiKG9wdGlvbikgZWxlbWVudHMgdGhhdCBhcmUgY3VycmVudGx5IHNlbGVjdGVkXCJcbiAgICAgICAgICByZXR1cm4gJ1tsb2NhbC1uYW1lKCk9XCJvcHRpb25cIiBhbmQgQHNlbGVjdGVkXSc7XG4gICAgICAgIGNhc2UgJ3NraXAnOlxuICAgICAgICBjYXNlICdza2lwLWZpcnN0JzpcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyBhcmcgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3NraXAtbGFzdCc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbbGFzdCgpLXBvc2l0aW9uKCk+PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8bGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnL2FuY2VzdG9yOjpbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICB2YXIgYXJyID0gYXJnLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICByZXR1cm4gJ1snICsgYXJyWzBdICsgJzw9cG9zaXRpb24oKSBhbmQgcG9zaXRpb24oKTw9JyArIGFyclsxXSArICddJztcbiAgICAgICAgY2FzZSAnaW5wdXQnOiAvLyBTaXp6bGU6IFwiaW5wdXQsIGJ1dHRvbiwgc2VsZWN0LCBhbmQgdGV4dGFyZWEgYXJlIGFsbCBjb25zaWRlcmVkIHRvIGJlIGlucHV0IGVsZW1lbnRzLlwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwiaW5wdXRcIiBvciBsb2NhbC1uYW1lKCk9XCJidXR0b25cIiBvciBsb2NhbC1uYW1lKCk9XCJzZWxlY3RcIiBvciBsb2NhbC1uYW1lKCk9XCJ0ZXh0YXJlYVwiXSc7XG4gICAgICAgIGNhc2UgJ2ludGVybmFsJzpcbiAgICAgICAgICByZXR1cm4geHBhdGhfaW50ZXJuYWw7XG4gICAgICAgIGNhc2UgJ2V4dGVybmFsJzpcbiAgICAgICAgICByZXR1cm4geHBhdGhfZXh0ZXJuYWw7XG4gICAgICAgIGNhc2UgJ2h0dHAnOlxuICAgICAgICBjYXNlICdodHRwcyc6XG4gICAgICAgIGNhc2UgJ21haWx0byc6XG4gICAgICAgIGNhc2UgJ2phdmFzY3JpcHQnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKEBocmVmLGNvbmNhdChcIicgKyBuYW1lICsgJ1wiLFwiOlwiKSldJztcbiAgICAgICAgY2FzZSAnZG9tYWluJzpcbiAgICAgICAgICByZXR1cm4gJ1soc3RyaW5nLWxlbmd0aCgnICsgeHBhdGhfdXJsX2RvbWFpbigpICsgJyk9MCBhbmQgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSArICcsJyArIGFyZyArICcpKSBvciBjb250YWlucygnICsgeHBhdGhfdXJsX2RvbWFpbigpICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9wYXRoKCkgKyAnLHN1YnN0cmluZy1hZnRlcihcIicgKyBhcmcgKyAnXCIsXCIvXCIpKV0nXG4gICAgICAgIGNhc2UgJ25vdCc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoeHBhdGguY2hhckF0KDApID09PSAnWycpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICB4cGF0aCA9ICdzZWxmOjpub2RlKCknICsgeHBhdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW25vdCgnICsgeHBhdGggKyAnKV0nO1xuICAgICAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKEBocmVmLCBcIiNcIildJztcbiAgICAgICAgY2FzZSAncm9vdCc6XG4gICAgICAgICAgcmV0dXJuICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0nO1xuICAgICAgICAgICAgLyogY2FzZSAnYWN0aXZlJzpcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzpcbiAgICAgICAgICAgIGNhc2UgJ2hvdmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2xpbmsnOlxuICAgICAgICAgICAgY2FzZSAndmlzaXRlZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnOyovXG4gICAgICAgIGNhc2UgJ2xhbmcnOlxuICAgICAgICAgIHJldHVybiAnW0BsYW5nPVwiJyArIGFyZyArICdcIl0nO1xuICAgICAgICBjYXNlICdyZWFkLW9ubHknOlxuICAgICAgICBjYXNlICdyZWFkLXdyaXRlJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUucmVwbGFjZSgnLScsICcnKSArICddJztcbiAgICAgICAgY2FzZSAndmFsaWQnOlxuICAgICAgICBjYXNlICdyZXF1aXJlZCc6XG4gICAgICAgIGNhc2UgJ2luLXJhbmdlJzpcbiAgICAgICAgY2FzZSAnb3V0LW9mLXJhbmdlJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUgKyAnXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfaWRzX2NsYXNzZXNfcmVnZXggPSAvKCN8XFwuKShbXlxcI1xcQFxcLlxcL1xcKFxcW1xcKVxcXVxcfFxcOlxcc1xcK1xcPlxcPFxcJ1xcXCJcXHgxRC1cXHgxRl0rKS9nLFxuICAgICAgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKHN0ciwgb3AsIHZhbCwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBheGlzID0gJyc7XG4gICAgICAgIC8qIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldC0xKTtcbiAgICAgICAgaWYgKHByZXZDaGFyLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICcvJyB8fFxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJylcbiAgICAgICAgICAgIGF4aXMgPSAnKic7XG4gICAgICAgIGVsc2UgaWYgKHByZXZDaGFyID09PSAnOicpXG4gICAgICAgICAgICBheGlzID0gJ25vZGUoKSc7Ki9cbiAgICAgICAgaWYgKG9wID09PSAnIycpICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAaWQ9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKGNvbmNhdChcIiBcIixub3JtYWxpemUtc3BhY2UoQGNsYXNzKSxcIiBcIiksXCIgJyArIHZhbCArICcgXCIpXSc7XG4gICAgICB9O1xuXG4gICAgLy8gUHJlcGVuZCBkZXNjZW5kYW50LW9yLXNlbGYgaWYgbm8gb3RoZXIgYXhpcyBpcyBzcGVjaWZpZWRcbiAgZnVuY3Rpb24gcHJlcGVuZEF4aXMocywgYXhpcykge1xuICAgIHJldHVybiBzLnJlcGxhY2UocmVnZXhfZmlyc3RfYXhpcywgZnVuY3Rpb24gKG1hdGNoLCBzdGFydCwgbGl0ZXJhbCkge1xuICAgICAgaWYgKGxpdGVyYWwuc3Vic3RyKGxpdGVyYWwubGVuZ3RoIC0gMikgPT09ICc6OicpIC8vIEFscmVhZHkgaGFzIGF4aXM6OlxuICAgICAgICAgICAge1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChsaXRlcmFsLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgIHtcbiAgICAgICAgYXhpcyArPSAnKic7XG4gICAgICB9XG4gICAgICAgIC8vIGVsc2UgaWYgKGF4aXMuY2hhckF0KGF4aXMubGVuZ3RoLTEpID09PSAnKScpXG4gICAgICAgIC8vICAgIGF4aXMgKz0gJy8nO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgYXhpcyArIGxpdGVyYWw7XG4gICAgfSk7XG4gIH1cblxuICAgIC8vIEZpbmQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzZWxlY3Rvciwgc3RhcnRpbmcgYXQgaSBhbmQgd29ya2luZyBiYWNrd2FyZHNcbiAgZnVuY3Rpb24gc2VsZWN0b3JTdGFydChzLCBpKSB7XG4gICAgdmFyIGRlcHRoID0gMDtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHN3aXRjaCAocy5jaGFyQXQoaSkpIHtcbiAgICAgIGNhc2UgJyAnOlxuICAgICAgY2FzZSBlc2NhcGVfcGFyZW5zOlxuICAgICAgICBvZmZzZXQrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdbJzpcbiAgICAgIGNhc2UgJygnOlxuICAgICAgICBkZXB0aC0tO1xuXG4gICAgICAgIGlmIChkZXB0aCA8IDApICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuICsraSArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ10nOlxuICAgICAgY2FzZSAnKSc6XG4gICAgICAgIGRlcHRoKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLCc6XG4gICAgICBjYXNlICd8JzpcbiAgICAgICAgaWYgKGRlcHRoID09PSAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG9mZnNldCA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAgIC8vIENoZWNrIGlmIHN0cmluZyBpcyBudW1lcmljXG4gIGZ1bmN0aW9uIGlzTnVtZXJpYyhzKSB7XG4gICAgdmFyIG51bSA9IHBhcnNlSW50KHMsIDEwKTtcblxuICAgIHJldHVybiAoIWlzTmFOKG51bSkgJiYgJycgKyBudW0gPT09IHMpO1xuICB9XG5cbiAgICAvLyBBcHBlbmQgZXNjYXBlIFwiY2hhclwiIHRvIFwib3BlblwiIG9yIFwiY2xvc2VcIlxuICBmdW5jdGlvbiBlc2NhcGVDaGFyKHMsIG9wZW4sIGNsb3NlLCBjaGFyKSB7XG4gICAgdmFyIGRlcHRoID0gMDtcblxuICAgIHJldHVybiBzLnJlcGxhY2UobmV3IFJlZ0V4cCgnW1xcXFwnICsgb3BlbiArICdcXFxcJyArIGNsb3NlICsgJ10nLCAnZycpLCBmdW5jdGlvbiAoYSkge1xuICAgICAgaWYgKGEgPT09IG9wZW4pICAgICAgICAgICAge1xuICAgICAgICBkZXB0aCsrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYSA9PT0gb3Blbikge1xuICAgICAgICByZXR1cm4gYSArIHJlcGVhdChjaGFyLCBkZXB0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVwZWF0KGNoYXIsIGRlcHRoLS0pICsgYTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVwZWF0KHN0ciwgbnVtKSB7XG4gICAgbnVtID0gTnVtYmVyKG51bSk7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChudW0gJiAxKSAgICAgICAgICAgIHtcbiAgICAgICAgcmVzdWx0ICs9IHN0cjtcbiAgICAgIH1cbiAgICAgIG51bSA+Pj49IDE7XG5cbiAgICAgIGlmIChudW0gPD0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN0ciArPSBzdHI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRFc2NhcGluZyAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvXFxcXChbYFxcXFwvOlxcPyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dKS9nLCAnJDEnKVxuICAgICAgLnJlcGxhY2UoL1xcXFwoWydcIl0pL2csICckMSQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcQSAvZywgJ1xcbicpXG4gIH1cblxuICBmdW5jdGlvbiBjc3MyeHBhdGgocywgbmVzdGVkKSB7XG4gICAgLy8gcyA9IHMudHJpbSgpO1xuXG4gICAgaWYgKG5lc3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBSZXBsYWNlIDpwc2V1ZG8tY2xhc3Nlc1xuICAgICAgcyA9IHMucmVwbGFjZShjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXgsIGNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSAjaWRzIGFuZCAuY2xhc3Nlc1xuICAgICAgcyA9IHMucmVwbGFjZShjc3NfaWRzX2NsYXNzZXNfcmVnZXgsIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIC8vIFRhZyBvcGVuIGFuZCBjbG9zZSBwYXJlbnRoZXNpcyBwYWlycyAoZm9yIFJlZ0V4cCBzZWFyY2hlcylcbiAgICBzID0gZXNjYXBlQ2hhcihzLCAnKCcsICcpJywgZXNjYXBlX3BhcmVucyk7XG5cbiAgICAvLyBSZW1vdmUgYW5kIHNhdmUgYW55IHN0cmluZyBsaXRlcmFsc1xuICAgIHZhciBsaXRlcmFscyA9IFtdO1xuXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9zdHJpbmdfbGl0ZXJhbCwgZnVuY3Rpb24gKHMsIGEpIHtcbiAgICAgIGlmIChhLmNoYXJBdCgwKSA9PT0gJz0nKSB7XG4gICAgICAgIGEgPSBhLnN1YnN0cigxKS50cmltKCk7XG5cbiAgICAgICAgaWYgKGlzTnVtZXJpYyhhKSkgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSwgYS5sZW5ndGggLSAyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcGVhdChlc2NhcGVfbGl0ZXJhbCwgbGl0ZXJhbHMucHVzaChjb252ZXJ0RXNjYXBpbmcoYSkpKTtcbiAgICB9KTtcblxuICAgIC8vIFJlcGxhY2UgQ1NTIGNvbWJpbmF0b3JzIChcIiBcIiwgXCIrXCIsIFwiPlwiLCBcIn5cIiwgXCIsXCIpIGFuZCByZXZlcnNlIGNvbWJpbmF0b3JzIChcIiFcIiwgXCIhK1wiLCBcIiE+XCIsIFwiIX5cIilcbiAgICBzID0gcy5yZXBsYWNlKGNzc19jb21iaW5hdG9yc19yZWdleCwgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgQ1NTIGF0dHJpYnV0ZSBmaWx0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShjc3NfYXR0cmlidXRlc19yZWdleCwgY3NzX2F0dHJpYnV0ZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gV3JhcCBjZXJ0YWluIDpwc2V1ZG8tY2xhc3NlcyBpbiBwYXJlbnMgKHRvIGNvbGxlY3Qgbm9kZS1zZXRzKVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgaW5kZXggPSBzLnNlYXJjaChyZWdleF9jc3Nfd3JhcF9wc2V1ZG8pO1xuXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBzLmluZGV4T2YoJzonLCBpbmRleCk7XG4gICAgICB2YXIgc3RhcnQgPSBzZWxlY3RvclN0YXJ0KHMsIGluZGV4KTtcblxuICAgICAgcyA9IHMuc3Vic3RyKDAsIHN0YXJ0KSArXG4gICAgICAgICAgICAnKCcgKyBzLnN1YnN0cmluZyhzdGFydCwgaW5kZXgpICsgJyknICtcbiAgICAgICAgICAgIHMuc3Vic3RyKGluZGV4KTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIDpwc2V1ZG8tY2xhc3Nlc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVwbGFjZSAjaWRzIGFuZCAuY2xhc3Nlc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVzdG9yZSB0aGUgc2F2ZWQgc3RyaW5nIGxpdGVyYWxzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9lc2NhcGVkX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICB2YXIgc3RyID0gbGl0ZXJhbHNbYS5sZW5ndGggLSAxXTtcblxuICAgICAgcmV0dXJuICdcIicgKyBzdHIgKyAnXCInO1xuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgYW55IHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3BlY2FsX2NoYXJzLCAnJyk7XG5cbiAgICAvLyBhZGQgKiB0byBzdGFuZC1hbG9uZSBmaWx0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9maWx0ZXJfcHJlZml4LCAnJDEqWycpO1xuXG4gICAgLy8gYWRkIFwiL1wiIGJldHdlZW4gQGF0dHJpYnV0ZSBzZWxlY3RvcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X2F0dHJfcHJlZml4LCAnJDEvQCcpO1xuXG4gICAgLypcbiAgICBDb21iaW5lIG11bHRpcGxlIGZpbHRlcnM/XG5cbiAgICBzID0gZXNjYXBlQ2hhcihzLCAnWycsICddJywgZmlsdGVyX2NoYXIpO1xuICAgIHMgPSBzLnJlcGxhY2UoLyhcXHgxRCspXFxdXFxbXFwxKC4rP1teXFx4MURdKVxcMVxcXS9nLCAnIGFuZCAoJDIpJDFdJylcbiAgICAqL1xuXG4gICAgcyA9IHByZXBlbmRBeGlzKHMsICcuLy8nKTsgLy8gcHJlcGVuZCBcIi4vL1wiIGF4aXMgdG8gYmVnaW5pbmcgb2YgQ1NTIHNlbGVjdG9yXG4gICAgcmV0dXJuIHM7XG4gIH1cblxuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjc3MyeHBhdGg7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmNzczJ4cGF0aCA9IGNzczJ4cGF0aDtcbiAgfVxuXG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9jc3MyeHBhdGgvaW5kZXguanMiLCIvKiFcbiAqIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIHYyLjMuNlxuICogaHR0cHM6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2pzLmZvdW5kYXRpb24vXG4gKlxuICogRGF0ZTogMjAyMS0wMi0xNlxuICovXG4oIGZ1bmN0aW9uKCB3aW5kb3cgKSB7XG52YXIgaSxcblx0c3VwcG9ydCxcblx0RXhwcixcblx0Z2V0VGV4dCxcblx0aXNYTUwsXG5cdHRva2VuaXplLFxuXHRjb21waWxlLFxuXHRzZWxlY3QsXG5cdG91dGVybW9zdENvbnRleHQsXG5cdHNvcnRJbnB1dCxcblx0aGFzRHVwbGljYXRlLFxuXG5cdC8vIExvY2FsIGRvY3VtZW50IHZhcnNcblx0c2V0RG9jdW1lbnQsXG5cdGRvY3VtZW50LFxuXHRkb2NFbGVtLFxuXHRkb2N1bWVudElzSFRNTCxcblx0cmJ1Z2d5UVNBLFxuXHRyYnVnZ3lNYXRjaGVzLFxuXHRtYXRjaGVzLFxuXHRjb250YWlucyxcblxuXHQvLyBJbnN0YW5jZS1zcGVjaWZpYyBkYXRhXG5cdGV4cGFuZG8gPSBcInNpenpsZVwiICsgMSAqIG5ldyBEYXRlKCksXG5cdHByZWZlcnJlZERvYyA9IHdpbmRvdy5kb2N1bWVudCxcblx0ZGlycnVucyA9IDAsXG5cdGRvbmUgPSAwLFxuXHRjbGFzc0NhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0dG9rZW5DYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdGNvbXBpbGVyQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRub25uYXRpdmVTZWxlY3RvckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIDA7XG5cdH0sXG5cblx0Ly8gSW5zdGFuY2UgbWV0aG9kc1xuXHRoYXNPd24gPSAoIHt9ICkuaGFzT3duUHJvcGVydHksXG5cdGFyciA9IFtdLFxuXHRwb3AgPSBhcnIucG9wLFxuXHRwdXNoTmF0aXZlID0gYXJyLnB1c2gsXG5cdHB1c2ggPSBhcnIucHVzaCxcblx0c2xpY2UgPSBhcnIuc2xpY2UsXG5cblx0Ly8gVXNlIGEgc3RyaXBwZWQtZG93biBpbmRleE9mIGFzIGl0J3MgZmFzdGVyIHRoYW4gbmF0aXZlXG5cdC8vIGh0dHBzOi8vanNwZXJmLmNvbS90aG9yLWluZGV4b2YtdnMtZm9yLzVcblx0aW5kZXhPZiA9IGZ1bmN0aW9uKCBsaXN0LCBlbGVtICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdGxlbiA9IGxpc3QubGVuZ3RoO1xuXHRcdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0aWYgKCBsaXN0WyBpIF0gPT09IGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH0sXG5cblx0Ym9vbGVhbnMgPSBcImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxcIiArXG5cdFx0XCJpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsXG5cblx0Ly8gUmVndWxhciBleHByZXNzaW9uc1xuXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtc2VsZWN0b3JzLyN3aGl0ZXNwYWNlXG5cdHdoaXRlc3BhY2UgPSBcIltcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdXCIsXG5cblx0Ly8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2Nzcy1zeW50YXgtMy8jaWRlbnQtdG9rZW4tZGlhZ3JhbVxuXHRpZGVudGlmaWVyID0gXCIoPzpcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCI/fFxcXFxcXFxcW15cXFxcclxcXFxuXFxcXGZdfFtcXFxcdy1dfFteXFwwLVxcXFx4N2ZdKStcIixcblxuXHQvLyBBdHRyaWJ1dGUgc2VsZWN0b3JzOiBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2F0dHJpYnV0ZS1zZWxlY3RvcnNcblx0YXR0cmlidXRlcyA9IFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XCIgKyB3aGl0ZXNwYWNlICtcblxuXHRcdC8vIE9wZXJhdG9yIChjYXB0dXJlIDIpXG5cdFx0XCIqKFsqXiR8IX5dPz0pXCIgKyB3aGl0ZXNwYWNlICtcblxuXHRcdC8vIFwiQXR0cmlidXRlIHZhbHVlcyBtdXN0IGJlIENTUyBpZGVudGlmaWVycyBbY2FwdHVyZSA1XVxuXHRcdC8vIG9yIHN0cmluZ3MgW2NhcHR1cmUgMyBvciBjYXB0dXJlIDRdXCJcblx0XHRcIiooPzonKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCJ8KFwiICsgaWRlbnRpZmllciArIFwiKSl8KVwiICtcblx0XHR3aGl0ZXNwYWNlICsgXCIqXFxcXF1cIixcblxuXHRwc2V1ZG9zID0gXCI6KFwiICsgaWRlbnRpZmllciArIFwiKSg/OlxcXFwoKFwiICtcblxuXHRcdC8vIFRvIHJlZHVjZSB0aGUgbnVtYmVyIG9mIHNlbGVjdG9ycyBuZWVkaW5nIHRva2VuaXplIGluIHRoZSBwcmVGaWx0ZXIsIHByZWZlciBhcmd1bWVudHM6XG5cdFx0Ly8gMS4gcXVvdGVkIChjYXB0dXJlIDM7IGNhcHR1cmUgNCBvciBjYXB0dXJlIDUpXG5cdFx0XCIoJygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwiKXxcIiArXG5cblx0XHQvLyAyLiBzaW1wbGUgKGNhcHR1cmUgNilcblx0XHRcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXCgpW1xcXFxdXXxcIiArIGF0dHJpYnV0ZXMgKyBcIikqKXxcIiArXG5cblx0XHQvLyAzLiBhbnl0aGluZyBlbHNlIChjYXB0dXJlIDIpXG5cdFx0XCIuKlwiICtcblx0XHRcIilcXFxcKXwpXCIsXG5cblx0Ly8gTGVhZGluZyBhbmQgbm9uLWVzY2FwZWQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgY2FwdHVyaW5nIHNvbWUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVycyBwcmVjZWRpbmcgdGhlIGxhdHRlclxuXHRyd2hpdGVzcGFjZSA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcIitcIiwgXCJnXCIgKSxcblx0cnRyaW0gPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIgK1xuXHRcdHdoaXRlc3BhY2UgKyBcIiskXCIsIFwiZ1wiICksXG5cblx0cmNvbW1hID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqLFwiICsgd2hpdGVzcGFjZSArIFwiKlwiICksXG5cdHJjb21iaW5hdG9ycyA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKihbPit+XXxcIiArIHdoaXRlc3BhY2UgKyBcIilcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFwiKlwiICksXG5cdHJkZXNjZW5kID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwifD5cIiApLFxuXG5cdHJwc2V1ZG8gPSBuZXcgUmVnRXhwKCBwc2V1ZG9zICksXG5cdHJpZGVudGlmaWVyID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBpZGVudGlmaWVyICsgXCIkXCIgKSxcblxuXHRtYXRjaEV4cHIgPSB7XG5cdFx0XCJJRFwiOiBuZXcgUmVnRXhwKCBcIl4jKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJDTEFTU1wiOiBuZXcgUmVnRXhwKCBcIl5cXFxcLihcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiVEFHXCI6IG5ldyBSZWdFeHAoIFwiXihcIiArIGlkZW50aWZpZXIgKyBcInxbKl0pXCIgKSxcblx0XHRcIkFUVFJcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBhdHRyaWJ1dGVzICksXG5cdFx0XCJQU0VVRE9cIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBwc2V1ZG9zICksXG5cdFx0XCJDSElMRFwiOiBuZXcgUmVnRXhwKCBcIl46KG9ubHl8Zmlyc3R8bGFzdHxudGh8bnRoLWxhc3QpLShjaGlsZHxvZi10eXBlKSg/OlxcXFwoXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86KFsrLV18KVwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooXFxcXGQrKXwpKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfClcIiwgXCJpXCIgKSxcblx0XHRcImJvb2xcIjogbmV3IFJlZ0V4cCggXCJeKD86XCIgKyBib29sZWFucyArIFwiKSRcIiwgXCJpXCIgKSxcblxuXHRcdC8vIEZvciB1c2UgaW4gbGlicmFyaWVzIGltcGxlbWVudGluZyAuaXMoKVxuXHRcdC8vIFdlIHVzZSB0aGlzIGZvciBQT1MgbWF0Y2hpbmcgaW4gYHNlbGVjdGBcblx0XHRcIm5lZWRzQ29udGV4dFwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIiooKD86LVxcXFxkKT9cXFxcZCopXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KSg/PVteLV18JClcIiwgXCJpXCIgKVxuXHR9LFxuXG5cdHJodG1sID0gL0hUTUwkL2ksXG5cdHJpbnB1dHMgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFxuXHRyaGVhZGVyID0gL15oXFxkJC9pLFxuXG5cdHJuYXRpdmUgPSAvXltee10rXFx7XFxzKlxcW25hdGl2ZSBcXHcvLFxuXG5cdC8vIEVhc2lseS1wYXJzZWFibGUvcmV0cmlldmFibGUgSUQgb3IgVEFHIG9yIENMQVNTIHNlbGVjdG9yc1xuXHRycXVpY2tFeHByID0gL14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sXG5cblx0cnNpYmxpbmcgPSAvWyt+XS8sXG5cblx0Ly8gQ1NTIGVzY2FwZXNcblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMjEvc3luZGF0YS5odG1sI2VzY2FwZWQtY2hhcmFjdGVyc1xuXHRydW5lc2NhcGUgPSBuZXcgUmVnRXhwKCBcIlxcXFxcXFxcW1xcXFxkYS1mQS1GXXsxLDZ9XCIgKyB3aGl0ZXNwYWNlICsgXCI/fFxcXFxcXFxcKFteXFxcXHJcXFxcblxcXFxmXSlcIiwgXCJnXCIgKSxcblx0ZnVuZXNjYXBlID0gZnVuY3Rpb24oIGVzY2FwZSwgbm9uSGV4ICkge1xuXHRcdHZhciBoaWdoID0gXCIweFwiICsgZXNjYXBlLnNsaWNlKCAxICkgLSAweDEwMDAwO1xuXG5cdFx0cmV0dXJuIG5vbkhleCA/XG5cblx0XHRcdC8vIFN0cmlwIHRoZSBiYWNrc2xhc2ggcHJlZml4IGZyb20gYSBub24taGV4IGVzY2FwZSBzZXF1ZW5jZVxuXHRcdFx0bm9uSGV4IDpcblxuXHRcdFx0Ly8gUmVwbGFjZSBhIGhleGFkZWNpbWFsIGVzY2FwZSBzZXF1ZW5jZSB3aXRoIHRoZSBlbmNvZGVkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgPD0xMStcblx0XHRcdC8vIEZvciB2YWx1ZXMgb3V0c2lkZSB0aGUgQmFzaWMgTXVsdGlsaW5ndWFsIFBsYW5lIChCTVApLCBtYW51YWxseSBjb25zdHJ1Y3QgYVxuXHRcdFx0Ly8gc3Vycm9nYXRlIHBhaXJcblx0XHRcdGhpZ2ggPCAwID9cblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCArIDB4MTAwMDAgKSA6XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggPj4gMTAgfCAweEQ4MDAsIGhpZ2ggJiAweDNGRiB8IDB4REMwMCApO1xuXHR9LFxuXG5cdC8vIENTUyBzdHJpbmcvaWRlbnRpZmllciBzZXJpYWxpemF0aW9uXG5cdC8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3NvbS8jY29tbW9uLXNlcmlhbGl6aW5nLWlkaW9tc1xuXHRyY3NzZXNjYXBlID0gLyhbXFwwLVxceDFmXFx4N2ZdfF4tP1xcZCl8Xi0kfFteXFwwLVxceDFmXFx4N2YtXFx1RkZGRlxcdy1dL2csXG5cdGZjc3Nlc2NhcGUgPSBmdW5jdGlvbiggY2gsIGFzQ29kZVBvaW50ICkge1xuXHRcdGlmICggYXNDb2RlUG9pbnQgKSB7XG5cblx0XHRcdC8vIFUrMDAwMCBOVUxMIGJlY29tZXMgVStGRkZEIFJFUExBQ0VNRU5UIENIQVJBQ1RFUlxuXHRcdFx0aWYgKCBjaCA9PT0gXCJcXDBcIiApIHtcblx0XHRcdFx0cmV0dXJuIFwiXFx1RkZGRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb250cm9sIGNoYXJhY3RlcnMgYW5kIChkZXBlbmRlbnQgdXBvbiBwb3NpdGlvbikgbnVtYmVycyBnZXQgZXNjYXBlZCBhcyBjb2RlIHBvaW50c1xuXHRcdFx0cmV0dXJuIGNoLnNsaWNlKCAwLCAtMSApICsgXCJcXFxcXCIgK1xuXHRcdFx0XHRjaC5jaGFyQ29kZUF0KCBjaC5sZW5ndGggLSAxICkudG9TdHJpbmcoIDE2ICkgKyBcIiBcIjtcblx0XHR9XG5cblx0XHQvLyBPdGhlciBwb3RlbnRpYWxseS1zcGVjaWFsIEFTQ0lJIGNoYXJhY3RlcnMgZ2V0IGJhY2tzbGFzaC1lc2NhcGVkXG5cdFx0cmV0dXJuIFwiXFxcXFwiICsgY2g7XG5cdH0sXG5cblx0Ly8gVXNlZCBmb3IgaWZyYW1lc1xuXHQvLyBTZWUgc2V0RG9jdW1lbnQoKVxuXHQvLyBSZW1vdmluZyB0aGUgZnVuY3Rpb24gd3JhcHBlciBjYXVzZXMgYSBcIlBlcm1pc3Npb24gRGVuaWVkXCJcblx0Ly8gZXJyb3IgaW4gSUVcblx0dW5sb2FkSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHNldERvY3VtZW50KCk7XG5cdH0sXG5cblx0aW5EaXNhYmxlZEZpZWxkc2V0ID0gYWRkQ29tYmluYXRvcihcblx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSB0cnVlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmaWVsZHNldFwiO1xuXHRcdH0sXG5cdFx0eyBkaXI6IFwicGFyZW50Tm9kZVwiLCBuZXh0OiBcImxlZ2VuZFwiIH1cblx0KTtcblxuLy8gT3B0aW1pemUgZm9yIHB1c2guYXBwbHkoIF8sIE5vZGVMaXN0IClcbnRyeSB7XG5cdHB1c2guYXBwbHkoXG5cdFx0KCBhcnIgPSBzbGljZS5jYWxsKCBwcmVmZXJyZWREb2MuY2hpbGROb2RlcyApICksXG5cdFx0cHJlZmVycmVkRG9jLmNoaWxkTm9kZXNcblx0KTtcblxuXHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMFxuXHQvLyBEZXRlY3Qgc2lsZW50bHkgZmFpbGluZyBwdXNoLmFwcGx5XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0YXJyWyBwcmVmZXJyZWREb2MuY2hpbGROb2Rlcy5sZW5ndGggXS5ub2RlVHlwZTtcbn0gY2F0Y2ggKCBlICkge1xuXHRwdXNoID0geyBhcHBseTogYXJyLmxlbmd0aCA/XG5cblx0XHQvLyBMZXZlcmFnZSBzbGljZSBpZiBwb3NzaWJsZVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHB1c2hOYXRpdmUuYXBwbHkoIHRhcmdldCwgc2xpY2UuY2FsbCggZWxzICkgKTtcblx0XHR9IDpcblxuXHRcdC8vIFN1cHBvcnQ6IElFPDlcblx0XHQvLyBPdGhlcndpc2UgYXBwZW5kIGRpcmVjdGx5XG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0dmFyIGogPSB0YXJnZXQubGVuZ3RoLFxuXHRcdFx0XHRpID0gMDtcblxuXHRcdFx0Ly8gQ2FuJ3QgdHJ1c3QgTm9kZUxpc3QubGVuZ3RoXG5cdFx0XHR3aGlsZSAoICggdGFyZ2V0WyBqKysgXSA9IGVsc1sgaSsrIF0gKSApIHt9XG5cdFx0XHR0YXJnZXQubGVuZ3RoID0gaiAtIDE7XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBTaXp6bGUoIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHR2YXIgbSwgaSwgZWxlbSwgbmlkLCBtYXRjaCwgZ3JvdXBzLCBuZXdTZWxlY3Rvcixcblx0XHRuZXdDb250ZXh0ID0gY29udGV4dCAmJiBjb250ZXh0Lm93bmVyRG9jdW1lbnQsXG5cblx0XHQvLyBub2RlVHlwZSBkZWZhdWx0cyB0byA5LCBzaW5jZSBjb250ZXh0IGRlZmF1bHRzIHRvIGRvY3VtZW50XG5cdFx0bm9kZVR5cGUgPSBjb250ZXh0ID8gY29udGV4dC5ub2RlVHlwZSA6IDk7XG5cblx0cmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0Ly8gUmV0dXJuIGVhcmx5IGZyb20gY2FsbHMgd2l0aCBpbnZhbGlkIHNlbGVjdG9yIG9yIGNvbnRleHRcblx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgfHwgIXNlbGVjdG9yIHx8XG5cdFx0bm9kZVR5cGUgIT09IDEgJiYgbm9kZVR5cGUgIT09IDkgJiYgbm9kZVR5cGUgIT09IDExICkge1xuXG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvLyBUcnkgdG8gc2hvcnRjdXQgZmluZCBvcGVyYXRpb25zIChhcyBvcHBvc2VkIHRvIGZpbHRlcnMpIGluIEhUTUwgZG9jdW1lbnRzXG5cdGlmICggIXNlZWQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0XHRjb250ZXh0ID0gY29udGV4dCB8fCBkb2N1bWVudDtcblxuXHRcdGlmICggZG9jdW1lbnRJc0hUTUwgKSB7XG5cblx0XHRcdC8vIElmIHRoZSBzZWxlY3RvciBpcyBzdWZmaWNpZW50bHkgc2ltcGxlLCB0cnkgdXNpbmcgYSBcImdldCpCeSpcIiBET00gbWV0aG9kXG5cdFx0XHQvLyAoZXhjZXB0aW5nIERvY3VtZW50RnJhZ21lbnQgY29udGV4dCwgd2hlcmUgdGhlIG1ldGhvZHMgZG9uJ3QgZXhpc3QpXG5cdFx0XHRpZiAoIG5vZGVUeXBlICE9PSAxMSAmJiAoIG1hdGNoID0gcnF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApICkgKSB7XG5cblx0XHRcdFx0Ly8gSUQgc2VsZWN0b3Jcblx0XHRcdFx0aWYgKCAoIG0gPSBtYXRjaFsgMSBdICkgKSB7XG5cblx0XHRcdFx0XHQvLyBEb2N1bWVudCBjb250ZXh0XG5cdFx0XHRcdFx0aWYgKCBub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggbSApICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0XHRpZiAoIGVsZW0uaWQgPT09IG0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRWxlbWVudCBjb250ZXh0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgJiYgKCBlbGVtID0gbmV3Q29udGV4dC5nZXRFbGVtZW50QnlJZCggbSApICkgJiZcblx0XHRcdFx0XHRcdFx0Y29udGFpbnMoIGNvbnRleHQsIGVsZW0gKSAmJlxuXHRcdFx0XHRcdFx0XHRlbGVtLmlkID09PSBtICkge1xuXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHlwZSBzZWxlY3RvclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsgMiBdICkge1xuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHNlbGVjdG9yICkgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0XHQvLyBDbGFzcyBzZWxlY3RvclxuXHRcdFx0XHR9IGVsc2UgaWYgKCAoIG0gPSBtYXRjaFsgMyBdICkgJiYgc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmXG5cdFx0XHRcdFx0Y29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICkge1xuXG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBtICkgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBUYWtlIGFkdmFudGFnZSBvZiBxdWVyeVNlbGVjdG9yQWxsXG5cdFx0XHRpZiAoIHN1cHBvcnQucXNhICYmXG5cdFx0XHRcdCFub25uYXRpdmVTZWxlY3RvckNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF0gJiZcblx0XHRcdFx0KCAhcmJ1Z2d5UVNBIHx8ICFyYnVnZ3lRU0EudGVzdCggc2VsZWN0b3IgKSApICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgOCBvbmx5XG5cdFx0XHRcdC8vIEV4Y2x1ZGUgb2JqZWN0IGVsZW1lbnRzXG5cdFx0XHRcdCggbm9kZVR5cGUgIT09IDEgfHwgY29udGV4dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm9iamVjdFwiICkgKSB7XG5cblx0XHRcdFx0bmV3U2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0bmV3Q29udGV4dCA9IGNvbnRleHQ7XG5cblx0XHRcdFx0Ly8gcVNBIGNvbnNpZGVycyBlbGVtZW50cyBvdXRzaWRlIGEgc2NvcGluZyByb290IHdoZW4gZXZhbHVhdGluZyBjaGlsZCBvclxuXHRcdFx0XHQvLyBkZXNjZW5kYW50IGNvbWJpbmF0b3JzLCB3aGljaCBpcyBub3Qgd2hhdCB3ZSB3YW50LlxuXHRcdFx0XHQvLyBJbiBzdWNoIGNhc2VzLCB3ZSB3b3JrIGFyb3VuZCB0aGUgYmVoYXZpb3IgYnkgcHJlZml4aW5nIGV2ZXJ5IHNlbGVjdG9yIGluIHRoZVxuXHRcdFx0XHQvLyBsaXN0IHdpdGggYW4gSUQgc2VsZWN0b3IgcmVmZXJlbmNpbmcgdGhlIHNjb3BlIGNvbnRleHQuXG5cdFx0XHRcdC8vIFRoZSB0ZWNobmlxdWUgaGFzIHRvIGJlIHVzZWQgYXMgd2VsbCB3aGVuIGEgbGVhZGluZyBjb21iaW5hdG9yIGlzIHVzZWRcblx0XHRcdFx0Ly8gYXMgc3VjaCBzZWxlY3RvcnMgYXJlIG5vdCByZWNvZ25pemVkIGJ5IHF1ZXJ5U2VsZWN0b3JBbGwuXG5cdFx0XHRcdC8vIFRoYW5rcyB0byBBbmRyZXcgRHVwb250IGZvciB0aGlzIHRlY2huaXF1ZS5cblx0XHRcdFx0aWYgKCBub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHRcdCggcmRlc2NlbmQudGVzdCggc2VsZWN0b3IgKSB8fCByY29tYmluYXRvcnMudGVzdCggc2VsZWN0b3IgKSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRXhwYW5kIGNvbnRleHQgZm9yIHNpYmxpbmcgc2VsZWN0b3JzXG5cdFx0XHRcdFx0bmV3Q29udGV4dCA9IHJzaWJsaW5nLnRlc3QoIHNlbGVjdG9yICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8XG5cdFx0XHRcdFx0XHRjb250ZXh0O1xuXG5cdFx0XHRcdFx0Ly8gV2UgY2FuIHVzZSA6c2NvcGUgaW5zdGVhZCBvZiB0aGUgSUQgaGFjayBpZiB0aGUgYnJvd3NlclxuXHRcdFx0XHRcdC8vIHN1cHBvcnRzIGl0ICYgaWYgd2UncmUgbm90IGNoYW5naW5nIHRoZSBjb250ZXh0LlxuXHRcdFx0XHRcdGlmICggbmV3Q29udGV4dCAhPT0gY29udGV4dCB8fCAhc3VwcG9ydC5zY29wZSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gQ2FwdHVyZSB0aGUgY29udGV4dCBJRCwgc2V0dGluZyBpdCBmaXJzdCBpZiBuZWNlc3Nhcnlcblx0XHRcdFx0XHRcdGlmICggKCBuaWQgPSBjb250ZXh0LmdldEF0dHJpYnV0ZSggXCJpZFwiICkgKSApIHtcblx0XHRcdFx0XHRcdFx0bmlkID0gbmlkLnJlcGxhY2UoIHJjc3Nlc2NhcGUsIGZjc3Nlc2NhcGUgKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRleHQuc2V0QXR0cmlidXRlKCBcImlkXCIsICggbmlkID0gZXhwYW5kbyApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJlZml4IGV2ZXJ5IHNlbGVjdG9yIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0Z3JvdXBzID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0aSA9IGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRncm91cHNbIGkgXSA9ICggbmlkID8gXCIjXCIgKyBuaWQgOiBcIjpzY29wZVwiICkgKyBcIiBcIiArXG5cdFx0XHRcdFx0XHRcdHRvU2VsZWN0b3IoIGdyb3Vwc1sgaSBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld1NlbGVjdG9yID0gZ3JvdXBzLmpvaW4oIFwiLFwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsXG5cdFx0XHRcdFx0XHRuZXdDb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIG5ld1NlbGVjdG9yIClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHR9IGNhdGNoICggcXNhRXJyb3IgKSB7XG5cdFx0XHRcdFx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSggc2VsZWN0b3IsIHRydWUgKTtcblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAoIG5pZCA9PT0gZXhwYW5kbyApIHtcblx0XHRcdFx0XHRcdGNvbnRleHQucmVtb3ZlQXR0cmlidXRlKCBcImlkXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBBbGwgb3RoZXJzXG5cdHJldHVybiBzZWxlY3QoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApO1xufVxuXG4vKipcbiAqIENyZWF0ZSBrZXktdmFsdWUgY2FjaGVzIG9mIGxpbWl0ZWQgc2l6ZVxuICogQHJldHVybnMge2Z1bmN0aW9uKHN0cmluZywgb2JqZWN0KX0gUmV0dXJucyB0aGUgT2JqZWN0IGRhdGEgYWZ0ZXIgc3RvcmluZyBpdCBvbiBpdHNlbGYgd2l0aFxuICpcdHByb3BlcnR5IG5hbWUgdGhlIChzcGFjZS1zdWZmaXhlZCkgc3RyaW5nIGFuZCAoaWYgdGhlIGNhY2hlIGlzIGxhcmdlciB0aGFuIEV4cHIuY2FjaGVMZW5ndGgpXG4gKlx0ZGVsZXRpbmcgdGhlIG9sZGVzdCBlbnRyeVxuICovXG5mdW5jdGlvbiBjcmVhdGVDYWNoZSgpIHtcblx0dmFyIGtleXMgPSBbXTtcblxuXHRmdW5jdGlvbiBjYWNoZSgga2V5LCB2YWx1ZSApIHtcblxuXHRcdC8vIFVzZSAoa2V5ICsgXCIgXCIpIHRvIGF2b2lkIGNvbGxpc2lvbiB3aXRoIG5hdGl2ZSBwcm90b3R5cGUgcHJvcGVydGllcyAoc2VlIElzc3VlICMxNTcpXG5cdFx0aWYgKCBrZXlzLnB1c2goIGtleSArIFwiIFwiICkgPiBFeHByLmNhY2hlTGVuZ3RoICkge1xuXG5cdFx0XHQvLyBPbmx5IGtlZXAgdGhlIG1vc3QgcmVjZW50IGVudHJpZXNcblx0XHRcdGRlbGV0ZSBjYWNoZVsga2V5cy5zaGlmdCgpIF07XG5cdFx0fVxuXHRcdHJldHVybiAoIGNhY2hlWyBrZXkgKyBcIiBcIiBdID0gdmFsdWUgKTtcblx0fVxuXHRyZXR1cm4gY2FjaGU7XG59XG5cbi8qKlxuICogTWFyayBhIGZ1bmN0aW9uIGZvciBzcGVjaWFsIHVzZSBieSBTaXp6bGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBtYXJrXG4gKi9cbmZ1bmN0aW9uIG1hcmtGdW5jdGlvbiggZm4gKSB7XG5cdGZuWyBleHBhbmRvIF0gPSB0cnVlO1xuXHRyZXR1cm4gZm47XG59XG5cbi8qKlxuICogU3VwcG9ydCB0ZXN0aW5nIHVzaW5nIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFBhc3NlZCB0aGUgY3JlYXRlZCBlbGVtZW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KCBmbiApIHtcblx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJmaWVsZHNldFwiICk7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gISFmbiggZWwgKTtcblx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9IGZpbmFsbHkge1xuXG5cdFx0Ly8gUmVtb3ZlIGZyb20gaXRzIHBhcmVudCBieSBkZWZhdWx0XG5cdFx0aWYgKCBlbC5wYXJlbnROb2RlICkge1xuXHRcdFx0ZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWwgKTtcblx0XHR9XG5cblx0XHQvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxuXHRcdGVsID0gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIHNhbWUgaGFuZGxlciBmb3IgYWxsIG9mIHRoZSBzcGVjaWZpZWQgYXR0cnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRycyBQaXBlLXNlcGFyYXRlZCBsaXN0IG9mIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIG1ldGhvZCB0aGF0IHdpbGwgYmUgYXBwbGllZFxuICovXG5mdW5jdGlvbiBhZGRIYW5kbGUoIGF0dHJzLCBoYW5kbGVyICkge1xuXHR2YXIgYXJyID0gYXR0cnMuc3BsaXQoIFwifFwiICksXG5cdFx0aSA9IGFyci5sZW5ndGg7XG5cblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0RXhwci5hdHRySGFuZGxlWyBhcnJbIGkgXSBdID0gaGFuZGxlcjtcblx0fVxufVxuXG4vKipcbiAqIENoZWNrcyBkb2N1bWVudCBvcmRlciBvZiB0d28gc2libGluZ3NcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIGxlc3MgdGhhbiAwIGlmIGEgcHJlY2VkZXMgYiwgZ3JlYXRlciB0aGFuIDAgaWYgYSBmb2xsb3dzIGJcbiAqL1xuZnVuY3Rpb24gc2libGluZ0NoZWNrKCBhLCBiICkge1xuXHR2YXIgY3VyID0gYiAmJiBhLFxuXHRcdGRpZmYgPSBjdXIgJiYgYS5ub2RlVHlwZSA9PT0gMSAmJiBiLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRhLnNvdXJjZUluZGV4IC0gYi5zb3VyY2VJbmRleDtcblxuXHQvLyBVc2UgSUUgc291cmNlSW5kZXggaWYgYXZhaWxhYmxlIG9uIGJvdGggbm9kZXNcblx0aWYgKCBkaWZmICkge1xuXHRcdHJldHVybiBkaWZmO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYiBmb2xsb3dzIGFcblx0aWYgKCBjdXIgKSB7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5uZXh0U2libGluZyApICkge1xuXHRcdFx0aWYgKCBjdXIgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYSA/IDEgOiAtMTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGlucHV0IHR5cGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dFBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgYnV0dG9uc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQnV0dG9uUHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuICggbmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCIgKSAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciA6ZW5hYmxlZC86ZGlzYWJsZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzYWJsZWQgdHJ1ZSBmb3IgOmRpc2FibGVkOyBmYWxzZSBmb3IgOmVuYWJsZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIGRpc2FibGVkICkge1xuXG5cdC8vIEtub3duIDpkaXNhYmxlZCBmYWxzZSBwb3NpdGl2ZXM6IGZpZWxkc2V0W2Rpc2FibGVkXSA+IGxlZ2VuZDpudGgtb2YtdHlwZShuKzIpIDpjYW4tZGlzYWJsZVxuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHQvLyBPbmx5IGNlcnRhaW4gZWxlbWVudHMgY2FuIG1hdGNoIDplbmFibGVkIG9yIDpkaXNhYmxlZFxuXHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sI3NlbGVjdG9yLWVuYWJsZWRcblx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zY3JpcHRpbmcuaHRtbCNzZWxlY3Rvci1kaXNhYmxlZFxuXHRcdGlmICggXCJmb3JtXCIgaW4gZWxlbSApIHtcblxuXHRcdFx0Ly8gQ2hlY2sgZm9yIGluaGVyaXRlZCBkaXNhYmxlZG5lc3Mgb24gcmVsZXZhbnQgbm9uLWRpc2FibGVkIGVsZW1lbnRzOlxuXHRcdFx0Ly8gKiBsaXN0ZWQgZm9ybS1hc3NvY2lhdGVkIGVsZW1lbnRzIGluIGEgZGlzYWJsZWQgZmllbGRzZXRcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjYXRlZ29yeS1saXN0ZWRcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjb25jZXB0LWZlLWRpc2FibGVkXG5cdFx0XHQvLyAqIG9wdGlvbiBlbGVtZW50cyBpbiBhIGRpc2FibGVkIG9wdGdyb3VwXG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY29uY2VwdC1vcHRpb24tZGlzYWJsZWRcblx0XHRcdC8vIEFsbCBzdWNoIGVsZW1lbnRzIGhhdmUgYSBcImZvcm1cIiBwcm9wZXJ0eS5cblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICYmIGVsZW0uZGlzYWJsZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdC8vIE9wdGlvbiBlbGVtZW50cyBkZWZlciB0byBhIHBhcmVudCBvcHRncm91cCBpZiBwcmVzZW50XG5cdFx0XHRcdGlmICggXCJsYWJlbFwiIGluIGVsZW0gKSB7XG5cdFx0XHRcdFx0aWYgKCBcImxhYmVsXCIgaW4gZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0ucGFyZW50Tm9kZS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA2IC0gMTFcblx0XHRcdFx0Ly8gVXNlIHRoZSBpc0Rpc2FibGVkIHNob3J0Y3V0IHByb3BlcnR5IHRvIGNoZWNrIGZvciBkaXNhYmxlZCBmaWVsZHNldCBhbmNlc3RvcnNcblx0XHRcdFx0cmV0dXJuIGVsZW0uaXNEaXNhYmxlZCA9PT0gZGlzYWJsZWQgfHxcblxuXHRcdFx0XHRcdC8vIFdoZXJlIHRoZXJlIGlzIG5vIGlzRGlzYWJsZWQsIGNoZWNrIG1hbnVhbGx5XG5cdFx0XHRcdFx0LyoganNoaW50IC1XMDE4ICovXG5cdFx0XHRcdFx0ZWxlbS5pc0Rpc2FibGVkICE9PSAhZGlzYWJsZWQgJiZcblx0XHRcdFx0XHRpbkRpc2FibGVkRmllbGRzZXQoIGVsZW0gKSA9PT0gZGlzYWJsZWQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblxuXHRcdC8vIFRyeSB0byB3aW5ub3cgb3V0IGVsZW1lbnRzIHRoYXQgY2FuJ3QgYmUgZGlzYWJsZWQgYmVmb3JlIHRydXN0aW5nIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eS5cblx0XHQvLyBTb21lIHZpY3RpbXMgZ2V0IGNhdWdodCBpbiBvdXIgbmV0IChsYWJlbCwgbGVnZW5kLCBtZW51LCB0cmFjayksIGJ1dCBpdCBzaG91bGRuJ3Rcblx0XHQvLyBldmVuIGV4aXN0IG9uIHRoZW0sIGxldCBhbG9uZSBoYXZlIGEgYm9vbGVhbiB2YWx1ZS5cblx0XHR9IGVsc2UgaWYgKCBcImxhYmVsXCIgaW4gZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHR9XG5cblx0XHQvLyBSZW1haW5pbmcgZWxlbWVudHMgYXJlIG5laXRoZXIgOmVuYWJsZWQgbm9yIDpkaXNhYmxlZFxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIHBvc2l0aW9uYWxzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5mdW5jdGlvbiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmbiApIHtcblx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIGFyZ3VtZW50ICkge1xuXHRcdGFyZ3VtZW50ID0gK2FyZ3VtZW50O1xuXHRcdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0dmFyIGosXG5cdFx0XHRcdG1hdGNoSW5kZXhlcyA9IGZuKCBbXSwgc2VlZC5sZW5ndGgsIGFyZ3VtZW50ICksXG5cdFx0XHRcdGkgPSBtYXRjaEluZGV4ZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBNYXRjaCBlbGVtZW50cyBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4ZXNcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoIHNlZWRbICggaiA9IG1hdGNoSW5kZXhlc1sgaSBdICkgXSApIHtcblx0XHRcdFx0XHRzZWVkWyBqIF0gPSAhKCBtYXRjaGVzWyBqIF0gPSBzZWVkWyBqIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSApO1xufVxuXG4vKipcbiAqIENoZWNrcyBhIG5vZGUgZm9yIHZhbGlkaXR5IGFzIGEgU2l6emxlIGNvbnRleHRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3Q9fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7RWxlbWVudHxPYmplY3R8Qm9vbGVhbn0gVGhlIGlucHV0IG5vZGUgaWYgYWNjZXB0YWJsZSwgb3RoZXJ3aXNlIGEgZmFsc3kgdmFsdWVcbiAqL1xuZnVuY3Rpb24gdGVzdENvbnRleHQoIGNvbnRleHQgKSB7XG5cdHJldHVybiBjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnRleHQ7XG59XG5cbi8vIEV4cG9zZSBzdXBwb3J0IHZhcnMgZm9yIGNvbnZlbmllbmNlXG5zdXBwb3J0ID0gU2l6emxlLnN1cHBvcnQgPSB7fTtcblxuLyoqXG4gKiBEZXRlY3RzIFhNTCBub2Rlc1xuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxlbSBBbiBlbGVtZW50IG9yIGEgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmZiBlbGVtIGlzIGEgbm9uLUhUTUwgWE1MIG5vZGVcbiAqL1xuaXNYTUwgPSBTaXp6bGUuaXNYTUwgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0dmFyIG5hbWVzcGFjZSA9IGVsZW0gJiYgZWxlbS5uYW1lc3BhY2VVUkksXG5cdFx0ZG9jRWxlbSA9IGVsZW0gJiYgKCBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSApLmRvY3VtZW50RWxlbWVudDtcblxuXHQvLyBTdXBwb3J0OiBJRSA8PThcblx0Ly8gQXNzdW1lIEhUTUwgd2hlbiBkb2N1bWVudEVsZW1lbnQgZG9lc24ndCB5ZXQgZXhpc3QsIHN1Y2ggYXMgaW5zaWRlIGxvYWRpbmcgaWZyYW1lc1xuXHQvLyBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvNDgzM1xuXHRyZXR1cm4gIXJodG1sLnRlc3QoIG5hbWVzcGFjZSB8fCBkb2NFbGVtICYmIGRvY0VsZW0ubm9kZU5hbWUgfHwgXCJIVE1MXCIgKTtcbn07XG5cbi8qKlxuICogU2V0cyBkb2N1bWVudC1yZWxhdGVkIHZhcmlhYmxlcyBvbmNlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBbZG9jXSBBbiBlbGVtZW50IG9yIGRvY3VtZW50IG9iamVjdCB0byB1c2UgdG8gc2V0IHRoZSBkb2N1bWVudFxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY3VycmVudCBkb2N1bWVudFxuICovXG5zZXREb2N1bWVudCA9IFNpenpsZS5zZXREb2N1bWVudCA9IGZ1bmN0aW9uKCBub2RlICkge1xuXHR2YXIgaGFzQ29tcGFyZSwgc3ViV2luZG93LFxuXHRcdGRvYyA9IG5vZGUgPyBub2RlLm93bmVyRG9jdW1lbnQgfHwgbm9kZSA6IHByZWZlcnJlZERvYztcblxuXHQvLyBSZXR1cm4gZWFybHkgaWYgZG9jIGlzIGludmFsaWQgb3IgYWxyZWFkeSBzZWxlY3RlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoIGRvYyA9PSBkb2N1bWVudCB8fCBkb2Mubm9kZVR5cGUgIT09IDkgfHwgIWRvYy5kb2N1bWVudEVsZW1lbnQgKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cblx0Ly8gVXBkYXRlIGdsb2JhbCB2YXJpYWJsZXNcblx0ZG9jdW1lbnQgPSBkb2M7XG5cdGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdGRvY3VtZW50SXNIVE1MID0gIWlzWE1MKCBkb2N1bWVudCApO1xuXG5cdC8vIFN1cHBvcnQ6IElFIDkgLSAxMSssIEVkZ2UgMTIgLSAxOCtcblx0Ly8gQWNjZXNzaW5nIGlmcmFtZSBkb2N1bWVudHMgYWZ0ZXIgdW5sb2FkIHRocm93cyBcInBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3JzIChqUXVlcnkgIzEzOTM2KVxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoIHByZWZlcnJlZERvYyAhPSBkb2N1bWVudCAmJlxuXHRcdCggc3ViV2luZG93ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcgKSAmJiBzdWJXaW5kb3cudG9wICE9PSBzdWJXaW5kb3cgKSB7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSAxMSwgRWRnZVxuXHRcdGlmICggc3ViV2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0XHRzdWJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJ1bmxvYWRcIiwgdW5sb2FkSGFuZGxlciwgZmFsc2UgKTtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDkgLSAxMCBvbmx5XG5cdFx0fSBlbHNlIGlmICggc3ViV2luZG93LmF0dGFjaEV2ZW50ICkge1xuXHRcdFx0c3ViV2luZG93LmF0dGFjaEV2ZW50KCBcIm9udW5sb2FkXCIsIHVubG9hZEhhbmRsZXIgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBTdXBwb3J0OiBJRSA4IC0gMTErLCBFZGdlIDEyIC0gMTgrLCBDaHJvbWUgPD0xNiAtIDI1IG9ubHksIEZpcmVmb3ggPD0zLjYgLSAzMSBvbmx5LFxuXHQvLyBTYWZhcmkgNCAtIDUgb25seSwgT3BlcmEgPD0xMS42IC0gMTIueCBvbmx5XG5cdC8vIElFL0VkZ2UgJiBvbGRlciBicm93c2VycyBkb24ndCBzdXBwb3J0IHRoZSA6c2NvcGUgcHNldWRvLWNsYXNzLlxuXHQvLyBTdXBwb3J0OiBTYWZhcmkgNi4wIG9ubHlcblx0Ly8gU2FmYXJpIDYuMCBzdXBwb3J0cyA6c2NvcGUgYnV0IGl0J3MgYW4gYWxpYXMgb2YgOnJvb3QgdGhlcmUuXG5cdHN1cHBvcnQuc2NvcGUgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICkgKTtcblx0XHRyZXR1cm4gdHlwZW9mIGVsLnF1ZXJ5U2VsZWN0b3JBbGwgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdCFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpzY29wZSBmaWVsZHNldCBkaXZcIiApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8qIEF0dHJpYnV0ZXNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFN1cHBvcnQ6IElFPDhcblx0Ly8gVmVyaWZ5IHRoYXQgZ2V0QXR0cmlidXRlIHJlYWxseSByZXR1cm5zIGF0dHJpYnV0ZXMgYW5kIG5vdCBwcm9wZXJ0aWVzXG5cdC8vIChleGNlcHRpbmcgSUU4IGJvb2xlYW5zKVxuXHRzdXBwb3J0LmF0dHJpYnV0ZXMgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRlbC5jbGFzc05hbWUgPSBcImlcIjtcblx0XHRyZXR1cm4gIWVsLmdldEF0dHJpYnV0ZSggXCJjbGFzc05hbWVcIiApO1xuXHR9ICk7XG5cblx0LyogZ2V0RWxlbWVudChzKUJ5KlxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpIHJldHVybnMgb25seSBlbGVtZW50c1xuXHRzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZWwuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoIFwiXCIgKSApO1xuXHRcdHJldHVybiAhZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiKlwiICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0Ly8gU3VwcG9ydDogSUU8OVxuXHRzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKTtcblxuXHQvLyBTdXBwb3J0OiBJRTwxMFxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50QnlJZCByZXR1cm5zIGVsZW1lbnRzIGJ5IG5hbWVcblx0Ly8gVGhlIGJyb2tlbiBnZXRFbGVtZW50QnlJZCBtZXRob2RzIGRvbid0IHBpY2sgdXAgcHJvZ3JhbW1hdGljYWxseS1zZXQgbmFtZXMsXG5cdC8vIHNvIHVzZSBhIHJvdW5kYWJvdXQgZ2V0RWxlbWVudHNCeU5hbWUgdGVzdFxuXHRzdXBwb3J0LmdldEJ5SWQgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmlkID0gZXhwYW5kbztcblx0XHRyZXR1cm4gIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lIHx8ICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSggZXhwYW5kbyApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8vIElEIGZpbHRlciBhbmQgZmluZFxuXHRpZiAoIHN1cHBvcnQuZ2V0QnlJZCApIHtcblx0XHRFeHByLmZpbHRlclsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBcImlkXCIgKSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXHRcdEV4cHIuZmluZFsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cdFx0XHRcdHJldHVybiBlbGVtID8gWyBlbGVtIF0gOiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdEV4cHIuZmlsdGVyWyBcIklEXCIgXSA9ICBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIG5vZGUgPSB0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgNiAtIDcgb25seVxuXHRcdC8vIGdldEVsZW1lbnRCeUlkIGlzIG5vdCByZWxpYWJsZSBhcyBhIGZpbmQgc2hvcnRjdXRcblx0XHRFeHByLmZpbmRbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdFx0dmFyIG5vZGUsIGksIGVsZW1zLFxuXHRcdFx0XHRcdGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRcdGlmICggZWxlbSApIHtcblxuXHRcdFx0XHRcdC8vIFZlcmlmeSB0aGUgaWQgYXR0cmlidXRlXG5cdFx0XHRcdFx0bm9kZSA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0aWYgKCBub2RlICYmIG5vZGUudmFsdWUgPT09IGlkICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFsgZWxlbSBdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZhbGwgYmFjayBvbiBnZXRFbGVtZW50c0J5TmFtZVxuXHRcdFx0XHRcdGVsZW1zID0gY29udGV4dC5nZXRFbGVtZW50c0J5TmFtZSggaWQgKTtcblx0XHRcdFx0XHRpID0gMDtcblx0XHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1zWyBpKysgXSApICkge1xuXHRcdFx0XHRcdFx0bm9kZSA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHRpZiAoIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gaWQgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBbIGVsZW0gXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8vIFRhZ1xuXHRFeHByLmZpbmRbIFwiVEFHXCIgXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgP1xuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgZG9uJ3QgaGF2ZSBnRUJUTlxuXHRcdFx0fSBlbHNlIGlmICggc3VwcG9ydC5xc2EgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyApO1xuXHRcdFx0fVxuXHRcdH0gOlxuXG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHR0bXAgPSBbXSxcblx0XHRcdFx0aSA9IDAsXG5cblx0XHRcdFx0Ly8gQnkgaGFwcHkgY29pbmNpZGVuY2UsIGEgKGJyb2tlbikgZ0VCVE4gYXBwZWFycyBvbiBEb2N1bWVudEZyYWdtZW50IG5vZGVzIHRvb1xuXHRcdFx0XHRyZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIEZpbHRlciBvdXQgcG9zc2libGUgY29tbWVudHNcblx0XHRcdGlmICggdGFnID09PSBcIipcIiApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSByZXN1bHRzWyBpKysgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdHRtcC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0Ly8gQ2xhc3Ncblx0RXhwci5maW5kWyBcIkNMQVNTXCIgXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJiBmdW5jdGlvbiggY2xhc3NOYW1lLCBjb250ZXh0ICkge1xuXHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGNsYXNzTmFtZSApO1xuXHRcdH1cblx0fTtcblxuXHQvKiBRU0EvbWF0Y2hlc1NlbGVjdG9yXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBRU0EgYW5kIG1hdGNoZXNTZWxlY3RvciBzdXBwb3J0XG5cblx0Ly8gbWF0Y2hlc1NlbGVjdG9yKDphY3RpdmUpIHJlcG9ydHMgZmFsc2Ugd2hlbiB0cnVlIChJRTkvT3BlcmEgMTEuNSlcblx0cmJ1Z2d5TWF0Y2hlcyA9IFtdO1xuXG5cdC8vIHFTYSg6Zm9jdXMpIHJlcG9ydHMgZmFsc2Ugd2hlbiB0cnVlIChDaHJvbWUgMjEpXG5cdC8vIFdlIGFsbG93IHRoaXMgYmVjYXVzZSBvZiBhIGJ1ZyBpbiBJRTgvOSB0aGF0IHRocm93cyBhbiBlcnJvclxuXHQvLyB3aGVuZXZlciBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgaXMgYWNjZXNzZWQgb24gYW4gaWZyYW1lXG5cdC8vIFNvLCB3ZSBhbGxvdyA6Zm9jdXMgdG8gcGFzcyB0aHJvdWdoIFFTQSBhbGwgdGhlIHRpbWUgdG8gYXZvaWQgdGhlIElFIGVycm9yXG5cdC8vIFNlZSBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTMzNzhcblx0cmJ1Z2d5UVNBID0gW107XG5cblx0aWYgKCAoIHN1cHBvcnQucXNhID0gcm5hdGl2ZS50ZXN0KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsICkgKSApIHtcblxuXHRcdC8vIEJ1aWxkIFFTQSByZWdleFxuXHRcdC8vIFJlZ2V4IHN0cmF0ZWd5IGFkb3B0ZWQgZnJvbSBEaWVnbyBQZXJpbmlcblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0dmFyIGlucHV0O1xuXG5cdFx0XHQvLyBTZWxlY3QgaXMgc2V0IHRvIGVtcHR5IHN0cmluZyBvbiBwdXJwb3NlXG5cdFx0XHQvLyBUaGlzIGlzIHRvIHRlc3QgSUUncyB0cmVhdG1lbnQgb2Ygbm90IGV4cGxpY2l0bHlcblx0XHRcdC8vIHNldHRpbmcgYSBib29sZWFuIGNvbnRlbnQgYXR0cmlidXRlLFxuXHRcdFx0Ly8gc2luY2UgaXRzIHByZXNlbmNlIHNob3VsZCBiZSBlbm91Z2hcblx0XHRcdC8vIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMjM1OVxuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5pbm5lckhUTUwgPSBcIjxhIGlkPSdcIiArIGV4cGFuZG8gKyBcIic+PC9hPlwiICtcblx0XHRcdFx0XCI8c2VsZWN0IGlkPSdcIiArIGV4cGFuZG8gKyBcIi1cXHJcXFxcJyBtc2FsbG93Y2FwdHVyZT0nJz5cIiArXG5cdFx0XHRcdFwiPG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4LCBPcGVyYSAxMS0xMi4xNlxuXHRcdFx0Ly8gTm90aGluZyBzaG91bGQgYmUgc2VsZWN0ZWQgd2hlbiBlbXB0eSBzdHJpbmdzIGZvbGxvdyBePSBvciAkPSBvciAqPVxuXHRcdFx0Ly8gVGhlIHRlc3QgYXR0cmlidXRlIG11c3QgYmUgdW5rbm93biBpbiBPcGVyYSBidXQgXCJzYWZlXCIgZm9yIFdpblJUXG5cdFx0XHQvLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2hoNDY1Mzg4LmFzcHgjYXR0cmlidXRlX3NlY3Rpb25cblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJbKl4kXT1cIiArIHdoaXRlc3BhY2UgKyBcIiooPzonJ3xcXFwiXFxcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRThcblx0XHRcdC8vIEJvb2xlYW4gYXR0cmlidXRlcyBhbmQgXCJ2YWx1ZVwiIGFyZSBub3QgdHJlYXRlZCBjb3JyZWN0bHlcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW3NlbGVjdGVkXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKig/OnZhbHVlfFwiICsgYm9vbGVhbnMgKyBcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWU8MjksIEFuZHJvaWQ8NC40LCBTYWZhcmk8Ny4wKywgaU9TPDcuMCssIFBoYW50b21KUzwxLjkuOCtcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW2lkfj1cIiArIGV4cGFuZG8gKyBcIi1dXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIn49XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE1IC0gMTgrXG5cdFx0XHQvLyBJRSAxMS9FZGdlIGRvbid0IGZpbmQgZWxlbWVudHMgb24gYSBgW25hbWU9JyddYCBxdWVyeSBpbiBzb21lIGNhc2VzLlxuXHRcdFx0Ly8gQWRkaW5nIGEgdGVtcG9yYXJ5IGF0dHJpYnV0ZSB0byB0aGUgZG9jdW1lbnQgYmVmb3JlIHRoZSBzZWxlY3Rpb24gd29ya3Ncblx0XHRcdC8vIGFyb3VuZCB0aGUgaXNzdWUuXG5cdFx0XHQvLyBJbnRlcmVzdGluZ2x5LCBJRSAxMCAmIG9sZGVyIGRvbid0IHNlZW0gdG8gaGF2ZSB0aGUgaXNzdWUuXG5cdFx0XHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJcIiApO1xuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltuYW1lPScnXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKm5hbWVcIiArIHdoaXRlc3BhY2UgKyBcIio9XCIgK1xuXHRcdFx0XHRcdHdoaXRlc3BhY2UgKyBcIiooPzonJ3xcXFwiXFxcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXZWJraXQvT3BlcmEgLSA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIHNlbGVjdGVkIG9wdGlvbiBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpjaGVja2VkXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjpjaGVja2VkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogU2FmYXJpIDgrLCBpT1MgOCtcblx0XHRcdC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzY4NTFcblx0XHRcdC8vIEluLXBhZ2UgYHNlbGVjdG9yI2lkIHNpYmxpbmctY29tYmluYXRvciBzZWxlY3RvcmAgZmFpbHNcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiYSNcIiArIGV4cGFuZG8gKyBcIisqXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIi4jLitbK35dXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogRmlyZWZveCA8PTMuNiAtIDUgb25seVxuXHRcdFx0Ly8gT2xkIEZpcmVmb3ggZG9lc24ndCB0aHJvdyBvbiBhIGJhZGx5LWVzY2FwZWQgaWRlbnRpZmllci5cblx0XHRcdGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiXFxcXFxcZlwiICk7XG5cdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJbXFxcXHJcXFxcblxcXFxmXVwiICk7XG5cdFx0fSApO1xuXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRlbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JycgZGlzYWJsZWQ9J2Rpc2FibGVkJz48L2E+XCIgK1xuXHRcdFx0XHRcIjxzZWxlY3QgZGlzYWJsZWQ9J2Rpc2FibGVkJz48b3B0aW9uLz48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogV2luZG93cyA4IE5hdGl2ZSBBcHBzXG5cdFx0XHQvLyBUaGUgdHlwZSBhbmQgbmFtZSBhdHRyaWJ1dGVzIGFyZSByZXN0cmljdGVkIGR1cmluZyAuaW5uZXJIVE1MIGFzc2lnbm1lbnRcblx0XHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJoaWRkZW5cIiApO1xuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoIGlucHV0ICkuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJEXCIgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBFbmZvcmNlIGNhc2Utc2Vuc2l0aXZpdHkgb2YgbmFtZSBhdHRyaWJ1dGVcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbmFtZT1kXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqWypeJHwhfl0/PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZGIDMuNSAtIDplbmFibGVkLzpkaXNhYmxlZCBhbmQgaGlkZGVuIGVsZW1lbnRzIChoaWRkZW4gZWxlbWVudHMgYXJlIHN0aWxsIGVuYWJsZWQpXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjplbmFibGVkXCIgKS5sZW5ndGggIT09IDIgKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU5LTExK1xuXHRcdFx0Ly8gSUUncyA6ZGlzYWJsZWQgc2VsZWN0b3IgZG9lcyBub3QgcGljayB1cCB0aGUgY2hpbGRyZW4gb2YgZGlzYWJsZWQgZmllbGRzZXRzXG5cdFx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCI6ZGlzYWJsZWRcIiApLmxlbmd0aCAhPT0gMiApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBPcGVyYSAxMCAtIDExIG9ubHlcblx0XHRcdC8vIE9wZXJhIDEwLTExIGRvZXMgbm90IHRocm93IG9uIHBvc3QtY29tbWEgaW52YWxpZCBwc2V1ZG9zXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIiosOnhcIiApO1xuXHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiLC4qOlwiICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aWYgKCAoIHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yID0gcm5hdGl2ZS50ZXN0KCAoIG1hdGNoZXMgPSBkb2NFbGVtLm1hdGNoZXMgfHxcblx0XHRkb2NFbGVtLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5vTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tc01hdGNoZXNTZWxlY3RvciApICkgKSApIHtcblxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgaXQncyBwb3NzaWJsZSB0byBkbyBtYXRjaGVzU2VsZWN0b3Jcblx0XHRcdC8vIG9uIGEgZGlzY29ubmVjdGVkIG5vZGUgKElFIDkpXG5cdFx0XHRzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoID0gbWF0Y2hlcy5jYWxsKCBlbCwgXCIqXCIgKTtcblxuXHRcdFx0Ly8gVGhpcyBzaG91bGQgZmFpbCB3aXRoIGFuIGV4Y2VwdGlvblxuXHRcdFx0Ly8gR2Vja28gZG9lcyBub3QgZXJyb3IsIHJldHVybnMgZmFsc2UgaW5zdGVhZFxuXHRcdFx0bWF0Y2hlcy5jYWxsKCBlbCwgXCJbcyE9JyddOnhcIiApO1xuXHRcdFx0cmJ1Z2d5TWF0Y2hlcy5wdXNoKCBcIiE9XCIsIHBzZXVkb3MgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRyYnVnZ3lRU0EgPSByYnVnZ3lRU0EubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneVFTQS5qb2luKCBcInxcIiApICk7XG5cdHJidWdneU1hdGNoZXMgPSByYnVnZ3lNYXRjaGVzLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lNYXRjaGVzLmpvaW4oIFwifFwiICkgKTtcblxuXHQvKiBDb250YWluc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdGhhc0NvbXBhcmUgPSBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29tcGFyZURvY3VtZW50UG9zaXRpb24gKTtcblxuXHQvLyBFbGVtZW50IGNvbnRhaW5zIGFub3RoZXJcblx0Ly8gUHVycG9zZWZ1bGx5IHNlbGYtZXhjbHVzaXZlXG5cdC8vIEFzIGluLCBhbiBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gaXRzZWxmXG5cdGNvbnRhaW5zID0gaGFzQ29tcGFyZSB8fCBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29udGFpbnMgKSA/XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYWRvd24gPSBhLm5vZGVUeXBlID09PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuXHRcdFx0XHRidXAgPSBiICYmIGIucGFyZW50Tm9kZTtcblx0XHRcdHJldHVybiBhID09PSBidXAgfHwgISEoIGJ1cCAmJiBidXAubm9kZVR5cGUgPT09IDEgJiYgKFxuXHRcdFx0XHRhZG93bi5jb250YWlucyA/XG5cdFx0XHRcdFx0YWRvd24uY29udGFpbnMoIGJ1cCApIDpcblx0XHRcdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGJ1cCApICYgMTZcblx0XHRcdCkgKTtcblx0XHR9IDpcblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdGlmICggYiApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGIgPSBiLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdFx0XHRpZiAoIGIgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdC8qIFNvcnRpbmdcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIERvY3VtZW50IG9yZGVyIHNvcnRpbmdcblx0c29ydE9yZGVyID0gaGFzQ29tcGFyZSA/XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRmxhZyBmb3IgZHVwbGljYXRlIHJlbW92YWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0Ly8gU29ydCBvbiBtZXRob2QgZXhpc3RlbmNlIGlmIG9ubHkgb25lIGlucHV0IGhhcyBjb21wYXJlRG9jdW1lbnRQb3NpdGlvblxuXHRcdHZhciBjb21wYXJlID0gIWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gLSAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtcblx0XHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0XHRyZXR1cm4gY29tcGFyZTtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaWYgYm90aCBpbnB1dHMgYmVsb25nIHRvIHRoZSBzYW1lIGRvY3VtZW50XG5cdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRjb21wYXJlID0gKCBhLm93bmVyRG9jdW1lbnQgfHwgYSApID09ICggYi5vd25lckRvY3VtZW50IHx8IGIgKSA/XG5cdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBiICkgOlxuXG5cdFx0XHQvLyBPdGhlcndpc2Ugd2Uga25vdyB0aGV5IGFyZSBkaXNjb25uZWN0ZWRcblx0XHRcdDE7XG5cblx0XHQvLyBEaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRpZiAoIGNvbXBhcmUgJiAxIHx8XG5cdFx0XHQoICFzdXBwb3J0LnNvcnREZXRhY2hlZCAmJiBiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBhICkgPT09IGNvbXBhcmUgKSApIHtcblxuXHRcdFx0Ly8gQ2hvb3NlIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgcmVsYXRlZCB0byBvdXIgcHJlZmVycmVkIGRvY3VtZW50XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0aWYgKCBhID09IGRvY3VtZW50IHx8IGEub3duZXJEb2N1bWVudCA9PSBwcmVmZXJyZWREb2MgJiZcblx0XHRcdFx0Y29udGFpbnMoIHByZWZlcnJlZERvYywgYSApICkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRpZiAoIGIgPT0gZG9jdW1lbnQgfHwgYi5vd25lckRvY3VtZW50ID09IHByZWZlcnJlZERvYyAmJlxuXHRcdFx0XHRjb250YWlucyggcHJlZmVycmVkRG9jLCBiICkgKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYWludGFpbiBvcmlnaW5hbCBvcmRlclxuXHRcdFx0cmV0dXJuIHNvcnRJbnB1dCA/XG5cdFx0XHRcdCggaW5kZXhPZiggc29ydElucHV0LCBhICkgLSBpbmRleE9mKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29tcGFyZSAmIDQgPyAtMSA6IDE7XG5cdH0gOlxuXHRmdW5jdGlvbiggYSwgYiApIHtcblxuXHRcdC8vIEV4aXQgZWFybHkgaWYgdGhlIG5vZGVzIGFyZSBpZGVudGljYWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0YXVwID0gYS5wYXJlbnROb2RlLFxuXHRcdFx0YnVwID0gYi5wYXJlbnROb2RlLFxuXHRcdFx0YXAgPSBbIGEgXSxcblx0XHRcdGJwID0gWyBiIF07XG5cblx0XHQvLyBQYXJlbnRsZXNzIG5vZGVzIGFyZSBlaXRoZXIgZG9jdW1lbnRzIG9yIGRpc2Nvbm5lY3RlZFxuXHRcdGlmICggIWF1cCB8fCAhYnVwICkge1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG5cdFx0XHRyZXR1cm4gYSA9PSBkb2N1bWVudCA/IC0xIDpcblx0XHRcdFx0YiA9PSBkb2N1bWVudCA/IDEgOlxuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xuXHRcdFx0XHRhdXAgPyAtMSA6XG5cdFx0XHRcdGJ1cCA/IDEgOlxuXHRcdFx0XHRzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cblx0XHQvLyBJZiB0aGUgbm9kZXMgYXJlIHNpYmxpbmdzLCB3ZSBjYW4gZG8gYSBxdWljayBjaGVja1xuXHRcdH0gZWxzZSBpZiAoIGF1cCA9PT0gYnVwICkge1xuXHRcdFx0cmV0dXJuIHNpYmxpbmdDaGVjayggYSwgYiApO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIGZ1bGwgbGlzdHMgb2YgdGhlaXIgYW5jZXN0b3JzIGZvciBjb21wYXJpc29uXG5cdFx0Y3VyID0gYTtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdGFwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblx0XHRjdXIgPSBiO1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0YnAudW5zaGlmdCggY3VyICk7XG5cdFx0fVxuXG5cdFx0Ly8gV2FsayBkb3duIHRoZSB0cmVlIGxvb2tpbmcgZm9yIGEgZGlzY3JlcGFuY3lcblx0XHR3aGlsZSAoIGFwWyBpIF0gPT09IGJwWyBpIF0gKSB7XG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGkgP1xuXG5cdFx0XHQvLyBEbyBhIHNpYmxpbmcgY2hlY2sgaWYgdGhlIG5vZGVzIGhhdmUgYSBjb21tb24gYW5jZXN0b3Jcblx0XHRcdHNpYmxpbmdDaGVjayggYXBbIGkgXSwgYnBbIGkgXSApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIG5vZGVzIGluIG91ciBkb2N1bWVudCBzb3J0IGZpcnN0XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG5cdFx0XHRhcFsgaSBdID09IHByZWZlcnJlZERvYyA/IC0xIDpcblx0XHRcdGJwWyBpIF0gPT0gcHJlZmVycmVkRG9jID8gMSA6XG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xuXHRcdFx0MDtcblx0fTtcblxuXHRyZXR1cm4gZG9jdW1lbnQ7XG59O1xuXG5TaXp6bGUubWF0Y2hlcyA9IGZ1bmN0aW9uKCBleHByLCBlbGVtZW50cyApIHtcblx0cmV0dXJuIFNpenpsZSggZXhwciwgbnVsbCwgbnVsbCwgZWxlbWVudHMgKTtcbn07XG5cblNpenpsZS5tYXRjaGVzU2VsZWN0b3IgPSBmdW5jdGlvbiggZWxlbSwgZXhwciApIHtcblx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblxuXHRpZiAoIHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yICYmIGRvY3VtZW50SXNIVE1MICYmXG5cdFx0IW5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGVbIGV4cHIgKyBcIiBcIiBdICYmXG5cdFx0KCAhcmJ1Z2d5TWF0Y2hlcyB8fCAhcmJ1Z2d5TWF0Y2hlcy50ZXN0KCBleHByICkgKSAmJlxuXHRcdCggIXJidWdneVFTQSAgICAgfHwgIXJidWdneVFTQS50ZXN0KCBleHByICkgKSApIHtcblxuXHRcdHRyeSB7XG5cdFx0XHR2YXIgcmV0ID0gbWF0Y2hlcy5jYWxsKCBlbGVtLCBleHByICk7XG5cblx0XHRcdC8vIElFIDkncyBtYXRjaGVzU2VsZWN0b3IgcmV0dXJucyBmYWxzZSBvbiBkaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRcdGlmICggcmV0IHx8IHN1cHBvcnQuZGlzY29ubmVjdGVkTWF0Y2ggfHxcblxuXHRcdFx0XHQvLyBBcyB3ZWxsLCBkaXNjb25uZWN0ZWQgbm9kZXMgYXJlIHNhaWQgdG8gYmUgaW4gYSBkb2N1bWVudFxuXHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5XG5cdFx0XHRcdGVsZW0uZG9jdW1lbnQgJiYgZWxlbS5kb2N1bWVudC5ub2RlVHlwZSAhPT0gMTEgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRub25uYXRpdmVTZWxlY3RvckNhY2hlKCBleHByLCB0cnVlICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFNpenpsZSggZXhwciwgZG9jdW1lbnQsIG51bGwsIFsgZWxlbSBdICkubGVuZ3RoID4gMDtcbn07XG5cblNpenpsZS5jb250YWlucyA9IGZ1bmN0aW9uKCBjb250ZXh0LCBlbGVtICkge1xuXG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoICggY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgKSAhPSBkb2N1bWVudCApIHtcblx0XHRzZXREb2N1bWVudCggY29udGV4dCApO1xuXHR9XG5cdHJldHVybiBjb250YWlucyggY29udGV4dCwgZWxlbSApO1xufTtcblxuU2l6emxlLmF0dHIgPSBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblxuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkgIT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0fVxuXG5cdHZhciBmbiA9IEV4cHIuYXR0ckhhbmRsZVsgbmFtZS50b0xvd2VyQ2FzZSgpIF0sXG5cblx0XHQvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IE9iamVjdC5wcm90b3R5cGUgcHJvcGVydGllcyAoalF1ZXJ5ICMxMzgwNylcblx0XHR2YWwgPSBmbiAmJiBoYXNPd24uY2FsbCggRXhwci5hdHRySGFuZGxlLCBuYW1lLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRmbiggZWxlbSwgbmFtZSwgIWRvY3VtZW50SXNIVE1MICkgOlxuXHRcdFx0dW5kZWZpbmVkO1xuXG5cdHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCA/XG5cdFx0dmFsIDpcblx0XHRzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWRvY3VtZW50SXNIVE1MID9cblx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICkgOlxuXHRcdFx0KCB2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSApICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRudWxsO1xufTtcblxuU2l6emxlLmVzY2FwZSA9IGZ1bmN0aW9uKCBzZWwgKSB7XG5cdHJldHVybiAoIHNlbCArIFwiXCIgKS5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XG59O1xuXG5TaXp6bGUuZXJyb3IgPSBmdW5jdGlvbiggbXNnICkge1xuXHR0aHJvdyBuZXcgRXJyb3IoIFwiU3ludGF4IGVycm9yLCB1bnJlY29nbml6ZWQgZXhwcmVzc2lvbjogXCIgKyBtc2cgKTtcbn07XG5cbi8qKlxuICogRG9jdW1lbnQgc29ydGluZyBhbmQgcmVtb3ZpbmcgZHVwbGljYXRlc1xuICogQHBhcmFtIHtBcnJheUxpa2V9IHJlc3VsdHNcbiAqL1xuU2l6emxlLnVuaXF1ZVNvcnQgPSBmdW5jdGlvbiggcmVzdWx0cyApIHtcblx0dmFyIGVsZW0sXG5cdFx0ZHVwbGljYXRlcyA9IFtdLFxuXHRcdGogPSAwLFxuXHRcdGkgPSAwO1xuXG5cdC8vIFVubGVzcyB3ZSAqa25vdyogd2UgY2FuIGRldGVjdCBkdXBsaWNhdGVzLCBhc3N1bWUgdGhlaXIgcHJlc2VuY2Vcblx0aGFzRHVwbGljYXRlID0gIXN1cHBvcnQuZGV0ZWN0RHVwbGljYXRlcztcblx0c29ydElucHV0ID0gIXN1cHBvcnQuc29ydFN0YWJsZSAmJiByZXN1bHRzLnNsaWNlKCAwICk7XG5cdHJlc3VsdHMuc29ydCggc29ydE9yZGVyICk7XG5cblx0aWYgKCBoYXNEdXBsaWNhdGUgKSB7XG5cdFx0d2hpbGUgKCAoIGVsZW0gPSByZXN1bHRzWyBpKysgXSApICkge1xuXHRcdFx0aWYgKCBlbGVtID09PSByZXN1bHRzWyBpIF0gKSB7XG5cdFx0XHRcdGogPSBkdXBsaWNhdGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUgKCBqLS0gKSB7XG5cdFx0XHRyZXN1bHRzLnNwbGljZSggZHVwbGljYXRlc1sgaiBdLCAxICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2xlYXIgaW5wdXQgYWZ0ZXIgc29ydGluZyB0byByZWxlYXNlIG9iamVjdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvc2l6emxlL3B1bGwvMjI1XG5cdHNvcnRJbnB1dCA9IG51bGw7XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gZm9yIHJldHJpZXZpbmcgdGhlIHRleHQgdmFsdWUgb2YgYW4gYXJyYXkgb2YgRE9NIG5vZGVzXG4gKiBAcGFyYW0ge0FycmF5fEVsZW1lbnR9IGVsZW1cbiAqL1xuZ2V0VGV4dCA9IFNpenpsZS5nZXRUZXh0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHZhciBub2RlLFxuXHRcdHJldCA9IFwiXCIsXG5cdFx0aSA9IDAsXG5cdFx0bm9kZVR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdGlmICggIW5vZGVUeXBlICkge1xuXG5cdFx0Ly8gSWYgbm8gbm9kZVR5cGUsIHRoaXMgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gYXJyYXlcblx0XHR3aGlsZSAoICggbm9kZSA9IGVsZW1bIGkrKyBdICkgKSB7XG5cblx0XHRcdC8vIERvIG5vdCB0cmF2ZXJzZSBjb21tZW50IG5vZGVzXG5cdFx0XHRyZXQgKz0gZ2V0VGV4dCggbm9kZSApO1xuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDEgfHwgbm9kZVR5cGUgPT09IDkgfHwgbm9kZVR5cGUgPT09IDExICkge1xuXG5cdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdC8vIGlubmVyVGV4dCB1c2FnZSByZW1vdmVkIGZvciBjb25zaXN0ZW5jeSBvZiBuZXcgbGluZXMgKGpRdWVyeSAjMTExNTMpXG5cdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFRyYXZlcnNlIGl0cyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdHJldCArPSBnZXRUZXh0KCBlbGVtICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMyB8fCBub2RlVHlwZSA9PT0gNCApIHtcblx0XHRyZXR1cm4gZWxlbS5ub2RlVmFsdWU7XG5cdH1cblxuXHQvLyBEbyBub3QgaW5jbHVkZSBjb21tZW50IG9yIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24gbm9kZXNcblxuXHRyZXR1cm4gcmV0O1xufTtcblxuRXhwciA9IFNpenpsZS5zZWxlY3RvcnMgPSB7XG5cblx0Ly8gQ2FuIGJlIGFkanVzdGVkIGJ5IHRoZSB1c2VyXG5cdGNhY2hlTGVuZ3RoOiA1MCxcblxuXHRjcmVhdGVQc2V1ZG86IG1hcmtGdW5jdGlvbixcblxuXHRtYXRjaDogbWF0Y2hFeHByLFxuXG5cdGF0dHJIYW5kbGU6IHt9LFxuXG5cdGZpbmQ6IHt9LFxuXG5cdHJlbGF0aXZlOiB7XG5cdFx0XCI+XCI6IHsgZGlyOiBcInBhcmVudE5vZGVcIiwgZmlyc3Q6IHRydWUgfSxcblx0XHRcIiBcIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiIH0sXG5cdFx0XCIrXCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiflwiOiB7IGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIiB9XG5cdH0sXG5cblx0cHJlRmlsdGVyOiB7XG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdG1hdGNoWyAxIF0gPSBtYXRjaFsgMSBdLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIGdpdmVuIHZhbHVlIHRvIG1hdGNoWzNdIHdoZXRoZXIgcXVvdGVkIG9yIHVucXVvdGVkXG5cdFx0XHRtYXRjaFsgMyBdID0gKCBtYXRjaFsgMyBdIHx8IG1hdGNoWyA0IF0gfHxcblx0XHRcdFx0bWF0Y2hbIDUgXSB8fCBcIlwiICkucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblxuXHRcdFx0aWYgKCBtYXRjaFsgMiBdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWyAzIF0gPSBcIiBcIiArIG1hdGNoWyAzIF0gKyBcIiBcIjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoLnNsaWNlKCAwLCA0ICk7XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXG5cdFx0XHQvKiBtYXRjaGVzIGZyb20gbWF0Y2hFeHByW1wiQ0hJTERcIl1cblx0XHRcdFx0MSB0eXBlIChvbmx5fG50aHwuLi4pXG5cdFx0XHRcdDIgd2hhdCAoY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0MyBhcmd1bWVudCAoZXZlbnxvZGR8XFxkKnxcXGQqbihbKy1dXFxkKyk/fC4uLilcblx0XHRcdFx0NCB4bi1jb21wb25lbnQgb2YgeG4reSBhcmd1bWVudCAoWystXT9cXGQqbnwpXG5cdFx0XHRcdDUgc2lnbiBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NiB4IG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ3IHNpZ24gb2YgeS1jb21wb25lbnRcblx0XHRcdFx0OCB5IG9mIHktY29tcG9uZW50XG5cdFx0XHQqL1xuXHRcdFx0bWF0Y2hbIDEgXSA9IG1hdGNoWyAxIF0udG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0aWYgKCBtYXRjaFsgMSBdLnNsaWNlKCAwLCAzICkgPT09IFwibnRoXCIgKSB7XG5cblx0XHRcdFx0Ly8gbnRoLSogcmVxdWlyZXMgYXJndW1lbnRcblx0XHRcdFx0aWYgKCAhbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWyAwIF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG51bWVyaWMgeCBhbmQgeSBwYXJhbWV0ZXJzIGZvciBFeHByLmZpbHRlci5DSElMRFxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IGZhbHNlL3RydWUgY2FzdCByZXNwZWN0aXZlbHkgdG8gMC8xXG5cdFx0XHRcdG1hdGNoWyA0IF0gPSArKCBtYXRjaFsgNCBdID9cblx0XHRcdFx0XHRtYXRjaFsgNSBdICsgKCBtYXRjaFsgNiBdIHx8IDEgKSA6XG5cdFx0XHRcdFx0MiAqICggbWF0Y2hbIDMgXSA9PT0gXCJldmVuXCIgfHwgbWF0Y2hbIDMgXSA9PT0gXCJvZGRcIiApICk7XG5cdFx0XHRcdG1hdGNoWyA1IF0gPSArKCAoIG1hdGNoWyA3IF0gKyBtYXRjaFsgOCBdICkgfHwgbWF0Y2hbIDMgXSA9PT0gXCJvZGRcIiApO1xuXG5cdFx0XHRcdC8vIG90aGVyIHR5cGVzIHByb2hpYml0IGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFsgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblx0XHR9LFxuXG5cdFx0XCJQU0VVRE9cIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0dmFyIGV4Y2Vzcyxcblx0XHRcdFx0dW5xdW90ZWQgPSAhbWF0Y2hbIDYgXSAmJiBtYXRjaFsgMiBdO1xuXG5cdFx0XHRpZiAoIG1hdGNoRXhwclsgXCJDSElMRFwiIF0udGVzdCggbWF0Y2hbIDAgXSApICkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWNjZXB0IHF1b3RlZCBhcmd1bWVudHMgYXMtaXNcblx0XHRcdGlmICggbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0bWF0Y2hbIDIgXSA9IG1hdGNoWyA0IF0gfHwgbWF0Y2hbIDUgXSB8fCBcIlwiO1xuXG5cdFx0XHQvLyBTdHJpcCBleGNlc3MgY2hhcmFjdGVycyBmcm9tIHVucXVvdGVkIGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggdW5xdW90ZWQgJiYgcnBzZXVkby50ZXN0KCB1bnF1b3RlZCApICYmXG5cblx0XHRcdFx0Ly8gR2V0IGV4Y2VzcyBmcm9tIHRva2VuaXplIChyZWN1cnNpdmVseSlcblx0XHRcdFx0KCBleGNlc3MgPSB0b2tlbml6ZSggdW5xdW90ZWQsIHRydWUgKSApICYmXG5cblx0XHRcdFx0Ly8gYWR2YW5jZSB0byB0aGUgbmV4dCBjbG9zaW5nIHBhcmVudGhlc2lzXG5cdFx0XHRcdCggZXhjZXNzID0gdW5xdW90ZWQuaW5kZXhPZiggXCIpXCIsIHVucXVvdGVkLmxlbmd0aCAtIGV4Y2VzcyApIC0gdW5xdW90ZWQubGVuZ3RoICkgKSB7XG5cblx0XHRcdFx0Ly8gZXhjZXNzIGlzIGEgbmVnYXRpdmUgaW5kZXhcblx0XHRcdFx0bWF0Y2hbIDAgXSA9IG1hdGNoWyAwIF0uc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0XHRtYXRjaFsgMiBdID0gdW5xdW90ZWQuc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXR1cm4gb25seSBjYXB0dXJlcyBuZWVkZWQgYnkgdGhlIHBzZXVkbyBmaWx0ZXIgbWV0aG9kICh0eXBlIGFuZCBhcmd1bWVudClcblx0XHRcdHJldHVybiBtYXRjaC5zbGljZSggMCwgMyApO1xuXHRcdH1cblx0fSxcblxuXHRmaWx0ZXI6IHtcblxuXHRcdFwiVEFHXCI6IGZ1bmN0aW9uKCBub2RlTmFtZVNlbGVjdG9yICkge1xuXHRcdFx0dmFyIG5vZGVOYW1lID0gbm9kZU5hbWVTZWxlY3Rvci5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbm9kZU5hbWVTZWxlY3RvciA9PT0gXCIqXCIgP1xuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWU7XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0xBU1NcIjogZnVuY3Rpb24oIGNsYXNzTmFtZSApIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gY2xhc3NDYWNoZVsgY2xhc3NOYW1lICsgXCIgXCIgXTtcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm4gfHxcblx0XHRcdFx0KCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCggXCIoXnxcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XHRcdFwiKVwiICsgY2xhc3NOYW1lICsgXCIoXCIgKyB3aGl0ZXNwYWNlICsgXCJ8JClcIiApICkgJiYgY2xhc3NDYWNoZShcblx0XHRcdFx0XHRcdGNsYXNzTmFtZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QoXG5cdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGVsZW0uY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW0uY2xhc3NOYW1lIHx8XG5cdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGVsZW0uZ2V0QXR0cmlidXRlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggXCJjbGFzc1wiICkgfHxcblx0XHRcdFx0XHRcdFx0XHRcIlwiXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBuYW1lLCBvcGVyYXRvciwgY2hlY2sgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBTaXp6bGUuYXR0ciggZWxlbSwgbmFtZSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIiE9XCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCAhb3BlcmF0b3IgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXN1bHQgKz0gXCJcIjtcblxuXHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cblx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIj1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiE9XCIgPyByZXN1bHQgIT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJePVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPT09IDAgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIio9XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIkPVwiID8gY2hlY2sgJiYgcmVzdWx0LnNsaWNlKCAtY2hlY2subGVuZ3RoICkgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ+PVwiID8gKCBcIiBcIiArIHJlc3VsdC5yZXBsYWNlKCByd2hpdGVzcGFjZSwgXCIgXCIgKSArIFwiIFwiICkuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ8PVwiID8gcmVzdWx0ID09PSBjaGVjayB8fCByZXN1bHQuc2xpY2UoIDAsIGNoZWNrLmxlbmd0aCArIDEgKSA9PT0gY2hlY2sgKyBcIi1cIiA6XG5cdFx0XHRcdFx0ZmFsc2U7XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCB0eXBlLCB3aGF0LCBfYXJndW1lbnQsIGZpcnN0LCBsYXN0ICkge1xuXHRcdFx0dmFyIHNpbXBsZSA9IHR5cGUuc2xpY2UoIDAsIDMgKSAhPT0gXCJudGhcIixcblx0XHRcdFx0Zm9yd2FyZCA9IHR5cGUuc2xpY2UoIC00ICkgIT09IFwibGFzdFwiLFxuXHRcdFx0XHRvZlR5cGUgPSB3aGF0ID09PSBcIm9mLXR5cGVcIjtcblxuXHRcdFx0cmV0dXJuIGZpcnN0ID09PSAxICYmIGxhc3QgPT09IDAgP1xuXG5cdFx0XHRcdC8vIFNob3J0Y3V0IGZvciA6bnRoLSoobilcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuICEhZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0XHR9IDpcblxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgY2FjaGUsIHVuaXF1ZUNhY2hlLCBvdXRlckNhY2hlLCBub2RlLCBub2RlSW5kZXgsIHN0YXJ0LFxuXHRcdFx0XHRcdFx0ZGlyID0gc2ltcGxlICE9PSBmb3J3YXJkID8gXCJuZXh0U2libGluZ1wiIDogXCJwcmV2aW91c1NpYmxpbmdcIixcblx0XHRcdFx0XHRcdHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZSxcblx0XHRcdFx0XHRcdG5hbWUgPSBvZlR5cGUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0dXNlQ2FjaGUgPSAheG1sICYmICFvZlR5cGUsXG5cdFx0XHRcdFx0XHRkaWZmID0gZmFsc2U7XG5cblx0XHRcdFx0XHRpZiAoIHBhcmVudCApIHtcblxuXHRcdFx0XHRcdFx0Ly8gOihmaXJzdHxsYXN0fG9ubHkpLShjaGlsZHxvZi10eXBlKVxuXHRcdFx0XHRcdFx0aWYgKCBzaW1wbGUgKSB7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICggZGlyICkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gbm9kZVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmV2ZXJzZSBkaXJlY3Rpb24gZm9yIDpvbmx5LSogKGlmIHdlIGhhdmVuJ3QgeWV0IGRvbmUgc28pXG5cdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBkaXIgPSB0eXBlID09PSBcIm9ubHlcIiAmJiAhc3RhcnQgJiYgXCJuZXh0U2libGluZ1wiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRzdGFydCA9IFsgZm9yd2FyZCA/IHBhcmVudC5maXJzdENoaWxkIDogcGFyZW50Lmxhc3RDaGlsZCBdO1xuXG5cdFx0XHRcdFx0XHQvLyBub24teG1sIDpudGgtY2hpbGQoLi4uKSBzdG9yZXMgY2FjaGUgZGF0YSBvbiBgcGFyZW50YFxuXHRcdFx0XHRcdFx0aWYgKCBmb3J3YXJkICYmIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNlZWsgYGVsZW1gIGZyb20gYSBwcmV2aW91c2x5LWNhY2hlZCBpbmRleFxuXG5cdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHBhcmVudDtcblx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0Y2FjaGUgPSB1bmlxdWVDYWNoZVsgdHlwZSBdIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdGRpZmYgPSBub2RlSW5kZXggJiYgY2FjaGVbIDIgXTtcblx0XHRcdFx0XHRcdFx0bm9kZSA9IG5vZGVJbmRleCAmJiBwYXJlbnQuY2hpbGROb2Rlc1sgbm9kZUluZGV4IF07XG5cblx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSArK25vZGVJbmRleCAmJiBub2RlICYmIG5vZGVbIGRpciBdIHx8XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBGYWxsYmFjayB0byBzZWVraW5nIGBlbGVtYCBmcm9tIHRoZSBzdGFydFxuXHRcdFx0XHRcdFx0XHRcdCggZGlmZiA9IG5vZGVJbmRleCA9IDAgKSB8fCBzdGFydC5wb3AoKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gV2hlbiBmb3VuZCwgY2FjaGUgaW5kZXhlcyBvbiBgcGFyZW50YCBhbmQgYnJlYWtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIG5vZGUubm9kZVR5cGUgPT09IDEgJiYgKytkaWZmICYmIG5vZGUgPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsgdHlwZSBdID0gWyBkaXJydW5zLCBub2RlSW5kZXgsIGRpZmYgXTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFVzZSBwcmV2aW91c2x5LWNhY2hlZCBlbGVtZW50IGluZGV4IGlmIGF2YWlsYWJsZVxuXHRcdFx0XHRcdFx0XHRpZiAoIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBjYWNoZVsgMSBdO1xuXHRcdFx0XHRcdFx0XHRcdGRpZmYgPSBub2RlSW5kZXg7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyB4bWwgOm50aC1jaGlsZCguLi4pXG5cdFx0XHRcdFx0XHRcdC8vIG9yIDpudGgtbGFzdC1jaGlsZCguLi4pIG9yIDpudGgoLWxhc3QpPy1vZi10eXBlKC4uLilcblx0XHRcdFx0XHRcdFx0aWYgKCBkaWZmID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFVzZSB0aGUgc2FtZSBsb29wIGFzIGFib3ZlIHRvIHNlZWsgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSArK25vZGVJbmRleCAmJiBub2RlICYmIG5vZGVbIGRpciBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQoIGRpZmYgPSBub2RlSW5kZXggPSAwICkgfHwgc3RhcnQucG9wKCkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCAoIG9mVHlwZSA/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSA6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZVR5cGUgPT09IDEgKSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrK2RpZmYgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2FjaGUgdGhlIGluZGV4IG9mIGVhY2ggZW5jb3VudGVyZWQgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHVzZUNhY2hlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEluY29ycG9yYXRlIHRoZSBvZmZzZXQsIHRoZW4gY2hlY2sgYWdhaW5zdCBjeWNsZSBzaXplXG5cdFx0XHRcdFx0XHRkaWZmIC09IGxhc3Q7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gZmlyc3QgfHwgKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBwc2V1ZG8sIGFyZ3VtZW50ICkge1xuXG5cdFx0XHQvLyBwc2V1ZG8tY2xhc3MgbmFtZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmVcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jcHNldWRvLWNsYXNzZXNcblx0XHRcdC8vIFByaW9yaXRpemUgYnkgY2FzZSBzZW5zaXRpdml0eSBpbiBjYXNlIGN1c3RvbSBwc2V1ZG9zIGFyZSBhZGRlZCB3aXRoIHVwcGVyY2FzZSBsZXR0ZXJzXG5cdFx0XHQvLyBSZW1lbWJlciB0aGF0IHNldEZpbHRlcnMgaW5oZXJpdHMgZnJvbSBwc2V1ZG9zXG5cdFx0XHR2YXIgYXJncyxcblx0XHRcdFx0Zm4gPSBFeHByLnBzZXVkb3NbIHBzZXVkbyBdIHx8IEV4cHIuc2V0RmlsdGVyc1sgcHNldWRvLnRvTG93ZXJDYXNlKCkgXSB8fFxuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiICsgcHNldWRvICk7XG5cblx0XHRcdC8vIFRoZSB1c2VyIG1heSB1c2UgY3JlYXRlUHNldWRvIHRvIGluZGljYXRlIHRoYXRcblx0XHRcdC8vIGFyZ3VtZW50cyBhcmUgbmVlZGVkIHRvIGNyZWF0ZSB0aGUgZmlsdGVyIGZ1bmN0aW9uXG5cdFx0XHQvLyBqdXN0IGFzIFNpenpsZSBkb2VzXG5cdFx0XHRpZiAoIGZuWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHJldHVybiBmbiggYXJndW1lbnQgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQnV0IG1haW50YWluIHN1cHBvcnQgZm9yIG9sZCBzaWduYXR1cmVzXG5cdFx0XHRpZiAoIGZuLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGFyZ3MgPSBbIHBzZXVkbywgcHNldWRvLCBcIlwiLCBhcmd1bWVudCBdO1xuXHRcdFx0XHRyZXR1cm4gRXhwci5zZXRGaWx0ZXJzLmhhc093blByb3BlcnR5KCBwc2V1ZG8udG9Mb3dlckNhc2UoKSApID9cblx0XHRcdFx0XHRtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIGlkeCxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCA9IGZuKCBzZWVkLCBhcmd1bWVudCApLFxuXHRcdFx0XHRcdFx0XHRpID0gbWF0Y2hlZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWR4ID0gaW5kZXhPZiggc2VlZCwgbWF0Y2hlZFsgaSBdICk7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGlkeCBdID0gISggbWF0Y2hlc1sgaWR4IF0gPSBtYXRjaGVkWyBpIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZuKCBlbGVtLCAwLCBhcmdzICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuO1xuXHRcdH1cblx0fSxcblxuXHRwc2V1ZG9zOiB7XG5cblx0XHQvLyBQb3RlbnRpYWxseSBjb21wbGV4IHBzZXVkb3Ncblx0XHRcIm5vdFwiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblxuXHRcdFx0Ly8gVHJpbSB0aGUgc2VsZWN0b3IgcGFzc2VkIHRvIGNvbXBpbGVcblx0XHRcdC8vIHRvIGF2b2lkIHRyZWF0aW5nIGxlYWRpbmcgYW5kIHRyYWlsaW5nXG5cdFx0XHQvLyBzcGFjZXMgYXMgY29tYmluYXRvcnNcblx0XHRcdHZhciBpbnB1dCA9IFtdLFxuXHRcdFx0XHRyZXN1bHRzID0gW10sXG5cdFx0XHRcdG1hdGNoZXIgPSBjb21waWxlKCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICkgKTtcblxuXHRcdFx0cmV0dXJuIG1hdGNoZXJbIGV4cGFuZG8gXSA/XG5cdFx0XHRcdG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMsIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQgPSBtYXRjaGVyKCBzZWVkLCBudWxsLCB4bWwsIFtdICksXG5cdFx0XHRcdFx0XHRpID0gc2VlZC5sZW5ndGg7XG5cblx0XHRcdFx0XHQvLyBNYXRjaCBlbGVtZW50cyB1bm1hdGNoZWQgYnkgYG1hdGNoZXJgXG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IHVubWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGkgXSA9ICEoIG1hdGNoZXNbIGkgXSA9IGVsZW0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdGlucHV0WyAwIF0gPSBlbGVtO1xuXHRcdFx0XHRcdG1hdGNoZXIoIGlucHV0LCBudWxsLCB4bWwsIHJlc3VsdHMgKTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGtlZXAgdGhlIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRcdFx0aW5wdXRbIDAgXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuICFyZXN1bHRzLnBvcCgpO1xuXHRcdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdFwiaGFzXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gU2l6emxlKCBzZWxlY3RvciwgZWxlbSApLmxlbmd0aCA+IDA7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdFwiY29udGFpbnNcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiAoIGVsZW0udGV4dENvbnRlbnQgfHwgZ2V0VGV4dCggZWxlbSApICkuaW5kZXhPZiggdGV4dCApID4gLTE7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdC8vIFwiV2hldGhlciBhbiBlbGVtZW50IGlzIHJlcHJlc2VudGVkIGJ5IGEgOmxhbmcoKSBzZWxlY3RvclxuXHRcdC8vIGlzIGJhc2VkIHNvbGVseSBvbiB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlXG5cdFx0Ly8gYmVpbmcgZXF1YWwgdG8gdGhlIGlkZW50aWZpZXIgQyxcblx0XHQvLyBvciBiZWdpbm5pbmcgd2l0aCB0aGUgaWRlbnRpZmllciBDIGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IFwiLVwiLlxuXHRcdC8vIFRoZSBtYXRjaGluZyBvZiBDIGFnYWluc3QgdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZSBpcyBwZXJmb3JtZWQgY2FzZS1pbnNlbnNpdGl2ZWx5LlxuXHRcdC8vIFRoZSBpZGVudGlmaWVyIEMgZG9lcyBub3QgaGF2ZSB0byBiZSBhIHZhbGlkIGxhbmd1YWdlIG5hbWUuXCJcblx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2xhbmctcHNldWRvXG5cdFx0XCJsYW5nXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIGxhbmcgKSB7XG5cblx0XHRcdC8vIGxhbmcgdmFsdWUgbXVzdCBiZSBhIHZhbGlkIGlkZW50aWZpZXJcblx0XHRcdGlmICggIXJpZGVudGlmaWVyLnRlc3QoIGxhbmcgfHwgXCJcIiApICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgbGFuZzogXCIgKyBsYW5nICk7XG5cdFx0XHR9XG5cdFx0XHRsYW5nID0gbGFuZy5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBlbGVtTGFuZztcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdGlmICggKCBlbGVtTGFuZyA9IGRvY3VtZW50SXNIVE1MID9cblx0XHRcdFx0XHRcdGVsZW0ubGFuZyA6XG5cdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggXCJ4bWw6bGFuZ1wiICkgfHwgZWxlbS5nZXRBdHRyaWJ1dGUoIFwibGFuZ1wiICkgKSApIHtcblxuXHRcdFx0XHRcdFx0ZWxlbUxhbmcgPSBlbGVtTGFuZy50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1MYW5nID09PSBsYW5nIHx8IGVsZW1MYW5nLmluZGV4T2YoIGxhbmcgKyBcIi1cIiApID09PSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSB3aGlsZSAoICggZWxlbSA9IGVsZW0ucGFyZW50Tm9kZSApICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHQvLyBNaXNjZWxsYW5lb3VzXG5cdFx0XCJ0YXJnZXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRcdHJldHVybiBoYXNoICYmIGhhc2guc2xpY2UoIDEgKSA9PT0gZWxlbS5pZDtcblx0XHR9LFxuXG5cdFx0XCJyb290XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY0VsZW07XG5cdFx0fSxcblxuXHRcdFwiZm9jdXNcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJlxuXHRcdFx0XHQoICFkb2N1bWVudC5oYXNGb2N1cyB8fCBkb2N1bWVudC5oYXNGb2N1cygpICkgJiZcblx0XHRcdFx0ISEoIGVsZW0udHlwZSB8fCBlbGVtLmhyZWYgfHwgfmVsZW0udGFiSW5kZXggKTtcblx0XHR9LFxuXG5cdFx0Ly8gQm9vbGVhbiBwcm9wZXJ0aWVzXG5cdFx0XCJlbmFibGVkXCI6IGNyZWF0ZURpc2FibGVkUHNldWRvKCBmYWxzZSApLFxuXHRcdFwiZGlzYWJsZWRcIjogY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIHRydWUgKSxcblxuXHRcdFwiY2hlY2tlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gSW4gQ1NTMywgOmNoZWNrZWQgc2hvdWxkIHJldHVybiBib3RoIGNoZWNrZWQgYW5kIHNlbGVjdGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0dmFyIG5vZGVOYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuICggbm9kZU5hbWUgPT09IFwiaW5wdXRcIiAmJiAhIWVsZW0uY2hlY2tlZCApIHx8XG5cdFx0XHRcdCggbm9kZU5hbWUgPT09IFwib3B0aW9uXCIgJiYgISFlbGVtLnNlbGVjdGVkICk7XG5cdFx0fSxcblxuXHRcdFwic2VsZWN0ZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIEFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IG1ha2VzIHNlbGVjdGVkLWJ5LWRlZmF1bHRcblx0XHRcdC8vIG9wdGlvbnMgaW4gU2FmYXJpIHdvcmsgcHJvcGVybHlcblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdFx0XHRcdGVsZW0ucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbS5zZWxlY3RlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0Ly8gQ29udGVudHNcblx0XHRcImVtcHR5XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2VtcHR5LXBzZXVkb1xuXHRcdFx0Ly8gOmVtcHR5IGlzIG5lZ2F0ZWQgYnkgZWxlbWVudCAoMSkgb3IgY29udGVudCBub2RlcyAodGV4dDogMzsgY2RhdGE6IDQ7IGVudGl0eSByZWY6IDUpLFxuXHRcdFx0Ly8gICBidXQgbm90IGJ5IG90aGVycyAoY29tbWVudDogODsgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbjogNzsgZXRjLilcblx0XHRcdC8vIG5vZGVUeXBlIDwgNiB3b3JrcyBiZWNhdXNlIGF0dHJpYnV0ZXMgKDIpIGRvIG5vdCBhcHBlYXIgYXMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPCA2ICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdFwicGFyZW50XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICFFeHByLnBzZXVkb3NbIFwiZW1wdHlcIiBdKCBlbGVtICk7XG5cdFx0fSxcblxuXHRcdC8vIEVsZW1lbnQvaW5wdXQgdHlwZXNcblx0XHRcImhlYWRlclwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaGVhZGVyLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJpbnB1dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaW5wdXRzLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJidXR0b25cIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSBcImJ1dHRvblwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCI7XG5cdFx0fSxcblxuXHRcdFwidGV4dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBhdHRyO1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmXG5cdFx0XHRcdGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCIgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRTw4XG5cdFx0XHRcdC8vIE5ldyBIVE1MNSBhdHRyaWJ1dGUgdmFsdWVzIChlLmcuLCBcInNlYXJjaFwiKSBhcHBlYXIgd2l0aCBlbGVtLnR5cGUgPT09IFwidGV4dFwiXG5cdFx0XHRcdCggKCBhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICkgKSA9PSBudWxsIHx8XG5cdFx0XHRcdFx0YXR0ci50b0xvd2VyQ2FzZSgpID09PSBcInRleHRcIiApO1xuXHRcdH0sXG5cblx0XHQvLyBQb3NpdGlvbi1pbi1jb2xsZWN0aW9uXG5cdFx0XCJmaXJzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbIDAgXTtcblx0XHR9ICksXG5cblx0XHRcImxhc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIF9tYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHJldHVybiBbIGxlbmd0aCAtIDEgXTtcblx0XHR9ICksXG5cblx0XHRcImVxXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBfbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0cmV0dXJuIFsgYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudCBdO1xuXHRcdH0gKSxcblxuXHRcdFwiZXZlblwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDA7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJvZGRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAxO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwibHRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID9cblx0XHRcdFx0YXJndW1lbnQgKyBsZW5ndGggOlxuXHRcdFx0XHRhcmd1bWVudCA+IGxlbmd0aCA/XG5cdFx0XHRcdFx0bGVuZ3RoIDpcblx0XHRcdFx0XHRhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgLS1pID49IDA7ICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcImd0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7ICsraSA8IGxlbmd0aDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKVxuXHR9XG59O1xuXG5FeHByLnBzZXVkb3NbIFwibnRoXCIgXSA9IEV4cHIucHNldWRvc1sgXCJlcVwiIF07XG5cbi8vIEFkZCBidXR0b24vaW5wdXQgdHlwZSBwc2V1ZG9zXG5mb3IgKCBpIGluIHsgcmFkaW86IHRydWUsIGNoZWNrYm94OiB0cnVlLCBmaWxlOiB0cnVlLCBwYXNzd29yZDogdHJ1ZSwgaW1hZ2U6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVJbnB1dFBzZXVkbyggaSApO1xufVxuZm9yICggaSBpbiB7IHN1Ym1pdDogdHJ1ZSwgcmVzZXQ6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVCdXR0b25Qc2V1ZG8oIGkgKTtcbn1cblxuLy8gRWFzeSBBUEkgZm9yIGNyZWF0aW5nIG5ldyBzZXRGaWx0ZXJzXG5mdW5jdGlvbiBzZXRGaWx0ZXJzKCkge31cbnNldEZpbHRlcnMucHJvdG90eXBlID0gRXhwci5maWx0ZXJzID0gRXhwci5wc2V1ZG9zO1xuRXhwci5zZXRGaWx0ZXJzID0gbmV3IHNldEZpbHRlcnMoKTtcblxudG9rZW5pemUgPSBTaXp6bGUudG9rZW5pemUgPSBmdW5jdGlvbiggc2VsZWN0b3IsIHBhcnNlT25seSApIHtcblx0dmFyIG1hdGNoZWQsIG1hdGNoLCB0b2tlbnMsIHR5cGUsXG5cdFx0c29GYXIsIGdyb3VwcywgcHJlRmlsdGVycyxcblx0XHRjYWNoZWQgPSB0b2tlbkNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF07XG5cblx0aWYgKCBjYWNoZWQgKSB7XG5cdFx0cmV0dXJuIHBhcnNlT25seSA/IDAgOiBjYWNoZWQuc2xpY2UoIDAgKTtcblx0fVxuXG5cdHNvRmFyID0gc2VsZWN0b3I7XG5cdGdyb3VwcyA9IFtdO1xuXHRwcmVGaWx0ZXJzID0gRXhwci5wcmVGaWx0ZXI7XG5cblx0d2hpbGUgKCBzb0ZhciApIHtcblxuXHRcdC8vIENvbW1hIGFuZCBmaXJzdCBydW5cblx0XHRpZiAoICFtYXRjaGVkIHx8ICggbWF0Y2ggPSByY29tbWEuZXhlYyggc29GYXIgKSApICkge1xuXHRcdFx0aWYgKCBtYXRjaCApIHtcblxuXHRcdFx0XHQvLyBEb24ndCBjb25zdW1lIHRyYWlsaW5nIGNvbW1hcyBhcyB2YWxpZFxuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaFsgMCBdLmxlbmd0aCApIHx8IHNvRmFyO1xuXHRcdFx0fVxuXHRcdFx0Z3JvdXBzLnB1c2goICggdG9rZW5zID0gW10gKSApO1xuXHRcdH1cblxuXHRcdG1hdGNoZWQgPSBmYWxzZTtcblxuXHRcdC8vIENvbWJpbmF0b3JzXG5cdFx0aWYgKCAoIG1hdGNoID0gcmNvbWJpbmF0b3JzLmV4ZWMoIHNvRmFyICkgKSApIHtcblx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0dG9rZW5zLnB1c2goIHtcblx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cblx0XHRcdFx0Ly8gQ2FzdCBkZXNjZW5kYW50IGNvbWJpbmF0b3JzIHRvIHNwYWNlXG5cdFx0XHRcdHR5cGU6IG1hdGNoWyAwIF0ucmVwbGFjZSggcnRyaW0sIFwiIFwiIClcblx0XHRcdH0gKTtcblx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmlsdGVyc1xuXHRcdGZvciAoIHR5cGUgaW4gRXhwci5maWx0ZXIgKSB7XG5cdFx0XHRpZiAoICggbWF0Y2ggPSBtYXRjaEV4cHJbIHR5cGUgXS5leGVjKCBzb0ZhciApICkgJiYgKCAhcHJlRmlsdGVyc1sgdHlwZSBdIHx8XG5cdFx0XHRcdCggbWF0Y2ggPSBwcmVGaWx0ZXJzWyB0eXBlIF0oIG1hdGNoICkgKSApICkge1xuXHRcdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdFx0dG9rZW5zLnB1c2goIHtcblx0XHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblx0XHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRcdG1hdGNoZXM6IG1hdGNoXG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hlZC5sZW5ndGggKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICFtYXRjaGVkICkge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGludmFsaWQgZXhjZXNzXG5cdC8vIGlmIHdlJ3JlIGp1c3QgcGFyc2luZ1xuXHQvLyBPdGhlcndpc2UsIHRocm93IGFuIGVycm9yIG9yIHJldHVybiB0b2tlbnNcblx0cmV0dXJuIHBhcnNlT25seSA/XG5cdFx0c29GYXIubGVuZ3RoIDpcblx0XHRzb0ZhciA/XG5cdFx0XHRTaXp6bGUuZXJyb3IoIHNlbGVjdG9yICkgOlxuXG5cdFx0XHQvLyBDYWNoZSB0aGUgdG9rZW5zXG5cdFx0XHR0b2tlbkNhY2hlKCBzZWxlY3RvciwgZ3JvdXBzICkuc2xpY2UoIDAgKTtcbn07XG5cbmZ1bmN0aW9uIHRvU2VsZWN0b3IoIHRva2VucyApIHtcblx0dmFyIGkgPSAwLFxuXHRcdGxlbiA9IHRva2Vucy5sZW5ndGgsXG5cdFx0c2VsZWN0b3IgPSBcIlwiO1xuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRzZWxlY3RvciArPSB0b2tlbnNbIGkgXS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIGFkZENvbWJpbmF0b3IoIG1hdGNoZXIsIGNvbWJpbmF0b3IsIGJhc2UgKSB7XG5cdHZhciBkaXIgPSBjb21iaW5hdG9yLmRpcixcblx0XHRza2lwID0gY29tYmluYXRvci5uZXh0LFxuXHRcdGtleSA9IHNraXAgfHwgZGlyLFxuXHRcdGNoZWNrTm9uRWxlbWVudHMgPSBiYXNlICYmIGtleSA9PT0gXCJwYXJlbnROb2RlXCIsXG5cdFx0ZG9uZU5hbWUgPSBkb25lKys7XG5cblx0cmV0dXJuIGNvbWJpbmF0b3IuZmlyc3QgP1xuXG5cdFx0Ly8gQ2hlY2sgYWdhaW5zdCBjbG9zZXN0IGFuY2VzdG9yL3ByZWNlZGluZyBlbGVtZW50XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSA6XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGFsbCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudHNcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIG9sZENhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSxcblx0XHRcdFx0bmV3Q2FjaGUgPSBbIGRpcnJ1bnMsIGRvbmVOYW1lIF07XG5cblx0XHRcdC8vIFdlIGNhbid0IHNldCBhcmJpdHJhcnkgZGF0YSBvbiBYTUwgbm9kZXMsIHNvIHRoZXkgZG9uJ3QgYmVuZWZpdCBmcm9tIGNvbWJpbmF0b3IgY2FjaGluZ1xuXHRcdFx0aWYgKCB4bWwgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IGVsZW1bIGV4cGFuZG8gXSB8fCAoIGVsZW1bIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNraXAgJiYgc2tpcCA9PT0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRcdFx0XHRlbGVtID0gZWxlbVsgZGlyIF0gfHwgZWxlbTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICggb2xkQ2FjaGUgPSB1bmlxdWVDYWNoZVsga2V5IF0gKSAmJlxuXHRcdFx0XHRcdFx0XHRvbGRDYWNoZVsgMCBdID09PSBkaXJydW5zICYmIG9sZENhY2hlWyAxIF0gPT09IGRvbmVOYW1lICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEFzc2lnbiB0byBuZXdDYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoIG5ld0NhY2hlWyAyIF0gPSBvbGRDYWNoZVsgMiBdICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJldXNlIG5ld2NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIGtleSBdID0gbmV3Q2FjaGU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQSBtYXRjaCBtZWFucyB3ZSdyZSBkb25lOyBhIGZhaWwgbWVhbnMgd2UgaGF2ZSB0byBrZWVwIGNoZWNraW5nXG5cdFx0XHRcdFx0XHRcdGlmICggKCBuZXdDYWNoZVsgMiBdID0gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApIHtcblx0cmV0dXJuIG1hdGNoZXJzLmxlbmd0aCA+IDEgP1xuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgaSA9IG1hdGNoZXJzLmxlbmd0aDtcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoICFtYXRjaGVyc1sgaSBdKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gOlxuXHRcdG1hdGNoZXJzWyAwIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGxlQ29udGV4dHMoIHNlbGVjdG9yLCBjb250ZXh0cywgcmVzdWx0cyApIHtcblx0dmFyIGkgPSAwLFxuXHRcdGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0U2l6emxlKCBzZWxlY3RvciwgY29udGV4dHNbIGkgXSwgcmVzdWx0cyApO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5mdW5jdGlvbiBjb25kZW5zZSggdW5tYXRjaGVkLCBtYXAsIGZpbHRlciwgY29udGV4dCwgeG1sICkge1xuXHR2YXIgZWxlbSxcblx0XHRuZXdVbm1hdGNoZWQgPSBbXSxcblx0XHRpID0gMCxcblx0XHRsZW4gPSB1bm1hdGNoZWQubGVuZ3RoLFxuXHRcdG1hcHBlZCA9IG1hcCAhPSBudWxsO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKCBlbGVtID0gdW5tYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdGlmICggIWZpbHRlciB8fCBmaWx0ZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRuZXdVbm1hdGNoZWQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRpZiAoIG1hcHBlZCApIHtcblx0XHRcdFx0XHRtYXAucHVzaCggaSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG5ld1VubWF0Y2hlZDtcbn1cblxuZnVuY3Rpb24gc2V0TWF0Y2hlciggcHJlRmlsdGVyLCBzZWxlY3RvciwgbWF0Y2hlciwgcG9zdEZpbHRlciwgcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICkge1xuXHRpZiAoIHBvc3RGaWx0ZXIgJiYgIXBvc3RGaWx0ZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmlsdGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbHRlciApO1xuXHR9XG5cdGlmICggcG9zdEZpbmRlciAmJiAhcG9zdEZpbmRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaW5kZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKTtcblx0fVxuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgcmVzdWx0cywgY29udGV4dCwgeG1sICkge1xuXHRcdHZhciB0ZW1wLCBpLCBlbGVtLFxuXHRcdFx0cHJlTWFwID0gW10sXG5cdFx0XHRwb3N0TWFwID0gW10sXG5cdFx0XHRwcmVleGlzdGluZyA9IHJlc3VsdHMubGVuZ3RoLFxuXG5cdFx0XHQvLyBHZXQgaW5pdGlhbCBlbGVtZW50cyBmcm9tIHNlZWQgb3IgY29udGV4dFxuXHRcdFx0ZWxlbXMgPSBzZWVkIHx8IG11bHRpcGxlQ29udGV4dHMoXG5cdFx0XHRcdHNlbGVjdG9yIHx8IFwiKlwiLFxuXHRcdFx0XHRjb250ZXh0Lm5vZGVUeXBlID8gWyBjb250ZXh0IF0gOiBjb250ZXh0LFxuXHRcdFx0XHRbXVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gUHJlZmlsdGVyIHRvIGdldCBtYXRjaGVyIGlucHV0LCBwcmVzZXJ2aW5nIGEgbWFwIGZvciBzZWVkLXJlc3VsdHMgc3luY2hyb25pemF0aW9uXG5cdFx0XHRtYXRjaGVySW4gPSBwcmVGaWx0ZXIgJiYgKCBzZWVkIHx8ICFzZWxlY3RvciApID9cblx0XHRcdFx0Y29uZGVuc2UoIGVsZW1zLCBwcmVNYXAsIHByZUZpbHRlciwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRlbGVtcyxcblxuXHRcdFx0bWF0Y2hlck91dCA9IG1hdGNoZXIgP1xuXG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgYSBwb3N0RmluZGVyLCBvciBmaWx0ZXJlZCBzZWVkLCBvciBub24tc2VlZCBwb3N0RmlsdGVyIG9yIHByZWV4aXN0aW5nIHJlc3VsdHMsXG5cdFx0XHRcdHBvc3RGaW5kZXIgfHwgKCBzZWVkID8gcHJlRmlsdGVyIDogcHJlZXhpc3RpbmcgfHwgcG9zdEZpbHRlciApID9cblxuXHRcdFx0XHRcdC8vIC4uLmludGVybWVkaWF0ZSBwcm9jZXNzaW5nIGlzIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFtdIDpcblxuXHRcdFx0XHRcdC8vIC4uLm90aGVyd2lzZSB1c2UgcmVzdWx0cyBkaXJlY3RseVxuXHRcdFx0XHRcdHJlc3VsdHMgOlxuXHRcdFx0XHRtYXRjaGVySW47XG5cblx0XHQvLyBGaW5kIHByaW1hcnkgbWF0Y2hlc1xuXHRcdGlmICggbWF0Y2hlciApIHtcblx0XHRcdG1hdGNoZXIoIG1hdGNoZXJJbiwgbWF0Y2hlck91dCwgY29udGV4dCwgeG1sICk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgcG9zdEZpbHRlclxuXHRcdGlmICggcG9zdEZpbHRlciApIHtcblx0XHRcdHRlbXAgPSBjb25kZW5zZSggbWF0Y2hlck91dCwgcG9zdE1hcCApO1xuXHRcdFx0cG9zdEZpbHRlciggdGVtcCwgW10sIGNvbnRleHQsIHhtbCApO1xuXG5cdFx0XHQvLyBVbi1tYXRjaCBmYWlsaW5nIGVsZW1lbnRzIGJ5IG1vdmluZyB0aGVtIGJhY2sgdG8gbWF0Y2hlckluXG5cdFx0XHRpID0gdGVtcC5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAoIGVsZW0gPSB0ZW1wWyBpIF0gKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyT3V0WyBwb3N0TWFwWyBpIF0gXSA9ICEoIG1hdGNoZXJJblsgcG9zdE1hcFsgaSBdIF0gPSBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgfHwgcHJlRmlsdGVyICkge1xuXHRcdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cblx0XHRcdFx0XHQvLyBHZXQgdGhlIGZpbmFsIG1hdGNoZXJPdXQgYnkgY29uZGVuc2luZyB0aGlzIGludGVybWVkaWF0ZSBpbnRvIHBvc3RGaW5kZXIgY29udGV4dHNcblx0XHRcdFx0XHR0ZW1wID0gW107XG5cdFx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBtYXRjaGVyT3V0WyBpIF0gKSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXN0b3JlIG1hdGNoZXJJbiBzaW5jZSBlbGVtIGlzIG5vdCB5ZXQgYSBmaW5hbCBtYXRjaFxuXHRcdFx0XHRcdFx0XHR0ZW1wLnB1c2goICggbWF0Y2hlckluWyBpIF0gPSBlbGVtICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgKCBtYXRjaGVyT3V0ID0gW10gKSwgdGVtcCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNb3ZlIG1hdGNoZWQgZWxlbWVudHMgZnJvbSBzZWVkIHRvIHJlc3VsdHMgdG8ga2VlcCB0aGVtIHN5bmNocm9uaXplZFxuXHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdGlmICggKCBlbGVtID0gbWF0Y2hlck91dFsgaSBdICkgJiZcblx0XHRcdFx0XHRcdCggdGVtcCA9IHBvc3RGaW5kZXIgPyBpbmRleE9mKCBzZWVkLCBlbGVtICkgOiBwcmVNYXBbIGkgXSApID4gLTEgKSB7XG5cblx0XHRcdFx0XHRcdHNlZWRbIHRlbXAgXSA9ICEoIHJlc3VsdHNbIHRlbXAgXSA9IGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEFkZCBlbGVtZW50cyB0byByZXN1bHRzLCB0aHJvdWdoIHBvc3RGaW5kZXIgaWYgZGVmaW5lZFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyT3V0ID0gY29uZGVuc2UoXG5cdFx0XHRcdG1hdGNoZXJPdXQgPT09IHJlc3VsdHMgP1xuXHRcdFx0XHRcdG1hdGNoZXJPdXQuc3BsaWNlKCBwcmVleGlzdGluZywgbWF0Y2hlck91dC5sZW5ndGggKSA6XG5cdFx0XHRcdFx0bWF0Y2hlck91dFxuXHRcdFx0KTtcblx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgcmVzdWx0cywgbWF0Y2hlck91dCwgeG1sICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBtYXRjaGVyT3V0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciBjaGVja0NvbnRleHQsIG1hdGNoZXIsIGosXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRsZWFkaW5nUmVsYXRpdmUgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIDAgXS50eXBlIF0sXG5cdFx0aW1wbGljaXRSZWxhdGl2ZSA9IGxlYWRpbmdSZWxhdGl2ZSB8fCBFeHByLnJlbGF0aXZlWyBcIiBcIiBdLFxuXHRcdGkgPSBsZWFkaW5nUmVsYXRpdmUgPyAxIDogMCxcblxuXHRcdC8vIFRoZSBmb3VuZGF0aW9uYWwgbWF0Y2hlciBlbnN1cmVzIHRoYXQgZWxlbWVudHMgYXJlIHJlYWNoYWJsZSBmcm9tIHRvcC1sZXZlbCBjb250ZXh0KHMpXG5cdFx0bWF0Y2hDb250ZXh0ID0gYWRkQ29tYmluYXRvciggZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gY2hlY2tDb250ZXh0O1xuXHRcdH0sIGltcGxpY2l0UmVsYXRpdmUsIHRydWUgKSxcblx0XHRtYXRjaEFueUNvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBpbmRleE9mKCBjaGVja0NvbnRleHQsIGVsZW0gKSA+IC0xO1xuXHRcdH0sIGltcGxpY2l0UmVsYXRpdmUsIHRydWUgKSxcblx0XHRtYXRjaGVycyA9IFsgZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciByZXQgPSAoICFsZWFkaW5nUmVsYXRpdmUgJiYgKCB4bWwgfHwgY29udGV4dCAhPT0gb3V0ZXJtb3N0Q29udGV4dCApICkgfHwgKFxuXHRcdFx0XHQoIGNoZWNrQ29udGV4dCA9IGNvbnRleHQgKS5ub2RlVHlwZSA/XG5cdFx0XHRcdFx0bWF0Y2hDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdFx0bWF0Y2hBbnlDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSApO1xuXG5cdFx0XHQvLyBBdm9pZCBoYW5naW5nIG9udG8gZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdGNoZWNrQ29udGV4dCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0gXTtcblxuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRpZiAoICggbWF0Y2hlciA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgaSBdLnR5cGUgXSApICkge1xuXHRcdFx0bWF0Y2hlcnMgPSBbIGFkZENvbWJpbmF0b3IoIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLCBtYXRjaGVyICkgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlciA9IEV4cHIuZmlsdGVyWyB0b2tlbnNbIGkgXS50eXBlIF0uYXBwbHkoIG51bGwsIHRva2Vuc1sgaSBdLm1hdGNoZXMgKTtcblxuXHRcdFx0Ly8gUmV0dXJuIHNwZWNpYWwgdXBvbiBzZWVpbmcgYSBwb3NpdGlvbmFsIG1hdGNoZXJcblx0XHRcdGlmICggbWF0Y2hlclsgZXhwYW5kbyBdICkge1xuXG5cdFx0XHRcdC8vIEZpbmQgdGhlIG5leHQgcmVsYXRpdmUgb3BlcmF0b3IgKGlmIGFueSkgZm9yIHByb3BlciBoYW5kbGluZ1xuXHRcdFx0XHRqID0gKytpO1xuXHRcdFx0XHRmb3IgKCA7IGogPCBsZW47IGorKyApIHtcblx0XHRcdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgaiBdLnR5cGUgXSApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc2V0TWF0Y2hlcihcblx0XHRcdFx0XHRpID4gMSAmJiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSxcblx0XHRcdFx0XHRpID4gMSAmJiB0b1NlbGVjdG9yKFxuXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHByZWNlZGluZyB0b2tlbiB3YXMgYSBkZXNjZW5kYW50IGNvbWJpbmF0b3IsIGluc2VydCBhbiBpbXBsaWNpdCBhbnktZWxlbWVudCBgKmBcblx0XHRcdFx0XHR0b2tlbnNcblx0XHRcdFx0XHRcdC5zbGljZSggMCwgaSAtIDEgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggeyB2YWx1ZTogdG9rZW5zWyBpIC0gMiBdLnR5cGUgPT09IFwiIFwiID8gXCIqXCIgOiBcIlwiIH0gKVxuXHRcdFx0XHRcdCkucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLFxuXHRcdFx0XHRcdG1hdGNoZXIsXG5cdFx0XHRcdFx0aSA8IGogJiYgbWF0Y2hlckZyb21Ub2tlbnMoIHRva2Vucy5zbGljZSggaSwgaiApICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiBtYXRjaGVyRnJvbVRva2VucyggKCB0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIGogKSApICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0bWF0Y2hlcnMucHVzaCggbWF0Y2hlciApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzICkge1xuXHR2YXIgYnlTZXQgPSBzZXRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdGJ5RWxlbWVudCA9IGVsZW1lbnRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdHN1cGVyTWF0Y2hlciA9IGZ1bmN0aW9uKCBzZWVkLCBjb250ZXh0LCB4bWwsIHJlc3VsdHMsIG91dGVybW9zdCApIHtcblx0XHRcdHZhciBlbGVtLCBqLCBtYXRjaGVyLFxuXHRcdFx0XHRtYXRjaGVkQ291bnQgPSAwLFxuXHRcdFx0XHRpID0gXCIwXCIsXG5cdFx0XHRcdHVubWF0Y2hlZCA9IHNlZWQgJiYgW10sXG5cdFx0XHRcdHNldE1hdGNoZWQgPSBbXSxcblx0XHRcdFx0Y29udGV4dEJhY2t1cCA9IG91dGVybW9zdENvbnRleHQsXG5cblx0XHRcdFx0Ly8gV2UgbXVzdCBhbHdheXMgaGF2ZSBlaXRoZXIgc2VlZCBlbGVtZW50cyBvciBvdXRlcm1vc3QgY29udGV4dFxuXHRcdFx0XHRlbGVtcyA9IHNlZWQgfHwgYnlFbGVtZW50ICYmIEV4cHIuZmluZFsgXCJUQUdcIiBdKCBcIipcIiwgb3V0ZXJtb3N0ICksXG5cblx0XHRcdFx0Ly8gVXNlIGludGVnZXIgZGlycnVucyBpZmYgdGhpcyBpcyB0aGUgb3V0ZXJtb3N0IG1hdGNoZXJcblx0XHRcdFx0ZGlycnVuc1VuaXF1ZSA9ICggZGlycnVucyArPSBjb250ZXh0QmFja3VwID09IG51bGwgPyAxIDogTWF0aC5yYW5kb20oKSB8fCAwLjEgKSxcblx0XHRcdFx0bGVuID0gZWxlbXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dCA9PSBkb2N1bWVudCB8fCBjb250ZXh0IHx8IG91dGVybW9zdDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIGVsZW1lbnRzIHBhc3NpbmcgZWxlbWVudE1hdGNoZXJzIGRpcmVjdGx5IHRvIHJlc3VsdHNcblx0XHRcdC8vIFN1cHBvcnQ6IElFPDksIFNhZmFyaVxuXHRcdFx0Ly8gVG9sZXJhdGUgTm9kZUxpc3QgcHJvcGVydGllcyAoSUU6IFwibGVuZ3RoXCI7IFNhZmFyaTogPG51bWJlcj4pIG1hdGNoaW5nIGVsZW1lbnRzIGJ5IGlkXG5cdFx0XHRmb3IgKCA7IGkgIT09IGxlbiAmJiAoIGVsZW0gPSBlbGVtc1sgaSBdICkgIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIGJ5RWxlbWVudCAmJiBlbGVtICkge1xuXHRcdFx0XHRcdGogPSAwO1xuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdFx0XHRpZiAoICFjb250ZXh0ICYmIGVsZW0ub3duZXJEb2N1bWVudCAhPSBkb2N1bWVudCApIHtcblx0XHRcdFx0XHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdFx0XHRcdFx0XHR4bWwgPSAhZG9jdW1lbnRJc0hUTUw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHdoaWxlICggKCBtYXRjaGVyID0gZWxlbWVudE1hdGNoZXJzWyBqKysgXSApICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0IHx8IGRvY3VtZW50LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRyYWNrIHVubWF0Y2hlZCBlbGVtZW50cyBmb3Igc2V0IGZpbHRlcnNcblx0XHRcdFx0aWYgKCBieVNldCApIHtcblxuXHRcdFx0XHRcdC8vIFRoZXkgd2lsbCBoYXZlIGdvbmUgdGhyb3VnaCBhbGwgcG9zc2libGUgbWF0Y2hlcnNcblx0XHRcdFx0XHRpZiAoICggZWxlbSA9ICFtYXRjaGVyICYmIGVsZW0gKSApIHtcblx0XHRcdFx0XHRcdG1hdGNoZWRDb3VudC0tO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIExlbmd0aGVuIHRoZSBhcnJheSBmb3IgZXZlcnkgZWxlbWVudCwgbWF0Y2hlZCBvciBub3Rcblx0XHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBgaWAgaXMgbm93IHRoZSBjb3VudCBvZiBlbGVtZW50cyB2aXNpdGVkIGFib3ZlLCBhbmQgYWRkaW5nIGl0IHRvIGBtYXRjaGVkQ291bnRgXG5cdFx0XHQvLyBtYWtlcyB0aGUgbGF0dGVyIG5vbm5lZ2F0aXZlLlxuXHRcdFx0bWF0Y2hlZENvdW50ICs9IGk7XG5cblx0XHRcdC8vIEFwcGx5IHNldCBmaWx0ZXJzIHRvIHVubWF0Y2hlZCBlbGVtZW50c1xuXHRcdFx0Ly8gTk9URTogVGhpcyBjYW4gYmUgc2tpcHBlZCBpZiB0aGVyZSBhcmUgbm8gdW5tYXRjaGVkIGVsZW1lbnRzIChpLmUuLCBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gZXF1YWxzIGBpYCksIHVubGVzcyB3ZSBkaWRuJ3QgdmlzaXQgX2FueV8gZWxlbWVudHMgaW4gdGhlIGFib3ZlIGxvb3AgYmVjYXVzZSB3ZSBoYXZlXG5cdFx0XHQvLyBubyBlbGVtZW50IG1hdGNoZXJzIGFuZCBubyBzZWVkLlxuXHRcdFx0Ly8gSW5jcmVtZW50aW5nIGFuIGluaXRpYWxseS1zdHJpbmcgXCIwXCIgYGlgIGFsbG93cyBgaWAgdG8gcmVtYWluIGEgc3RyaW5nIG9ubHkgaW4gdGhhdFxuXHRcdFx0Ly8gY2FzZSwgd2hpY2ggd2lsbCByZXN1bHQgaW4gYSBcIjAwXCIgYG1hdGNoZWRDb3VudGAgdGhhdCBkaWZmZXJzIGZyb20gYGlgIGJ1dCBpcyBhbHNvXG5cdFx0XHQvLyBudW1lcmljYWxseSB6ZXJvLlxuXHRcdFx0aWYgKCBieVNldCAmJiBpICE9PSBtYXRjaGVkQ291bnQgKSB7XG5cdFx0XHRcdGogPSAwO1xuXHRcdFx0XHR3aGlsZSAoICggbWF0Y2hlciA9IHNldE1hdGNoZXJzWyBqKysgXSApICkge1xuXHRcdFx0XHRcdG1hdGNoZXIoIHVubWF0Y2hlZCwgc2V0TWF0Y2hlZCwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cblx0XHRcdFx0XHQvLyBSZWludGVncmF0ZSBlbGVtZW50IG1hdGNoZXMgdG8gZWxpbWluYXRlIHRoZSBuZWVkIGZvciBzb3J0aW5nXG5cdFx0XHRcdFx0aWYgKCBtYXRjaGVkQ291bnQgPiAwICkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggISggdW5tYXRjaGVkWyBpIF0gfHwgc2V0TWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0TWF0Y2hlZFsgaSBdID0gcG9wLmNhbGwoIHJlc3VsdHMgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIERpc2NhcmQgaW5kZXggcGxhY2Vob2xkZXIgdmFsdWVzIHRvIGdldCBvbmx5IGFjdHVhbCBtYXRjaGVzXG5cdFx0XHRcdFx0c2V0TWF0Y2hlZCA9IGNvbmRlbnNlKCBzZXRNYXRjaGVkICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBZGQgbWF0Y2hlcyB0byByZXN1bHRzXG5cdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNldE1hdGNoZWQgKTtcblxuXHRcdFx0XHQvLyBTZWVkbGVzcyBzZXQgbWF0Y2hlcyBzdWNjZWVkaW5nIG11bHRpcGxlIHN1Y2Nlc3NmdWwgbWF0Y2hlcnMgc3RpcHVsYXRlIHNvcnRpbmdcblx0XHRcdFx0aWYgKCBvdXRlcm1vc3QgJiYgIXNlZWQgJiYgc2V0TWF0Y2hlZC5sZW5ndGggPiAwICYmXG5cdFx0XHRcdFx0KCBtYXRjaGVkQ291bnQgKyBzZXRNYXRjaGVycy5sZW5ndGggKSA+IDEgKSB7XG5cblx0XHRcdFx0XHRTaXp6bGUudW5pcXVlU29ydCggcmVzdWx0cyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIE92ZXJyaWRlIG1hbmlwdWxhdGlvbiBvZiBnbG9iYWxzIGJ5IG5lc3RlZCBtYXRjaGVyc1xuXHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dEJhY2t1cDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVubWF0Y2hlZDtcblx0XHR9O1xuXG5cdHJldHVybiBieVNldCA/XG5cdFx0bWFya0Z1bmN0aW9uKCBzdXBlck1hdGNoZXIgKSA6XG5cdFx0c3VwZXJNYXRjaGVyO1xufVxuXG5jb21waWxlID0gU2l6emxlLmNvbXBpbGUgPSBmdW5jdGlvbiggc2VsZWN0b3IsIG1hdGNoIC8qIEludGVybmFsIFVzZSBPbmx5ICovICkge1xuXHR2YXIgaSxcblx0XHRzZXRNYXRjaGVycyA9IFtdLFxuXHRcdGVsZW1lbnRNYXRjaGVycyA9IFtdLFxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXTtcblxuXHRpZiAoICFjYWNoZWQgKSB7XG5cblx0XHQvLyBHZW5lcmF0ZSBhIGZ1bmN0aW9uIG9mIHJlY3Vyc2l2ZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGVjayBlYWNoIGVsZW1lbnRcblx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdG1hdGNoID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0fVxuXHRcdGkgPSBtYXRjaC5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRjYWNoZWQgPSBtYXRjaGVyRnJvbVRva2VucyggbWF0Y2hbIGkgXSApO1xuXHRcdFx0aWYgKCBjYWNoZWRbIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0c2V0TWF0Y2hlcnMucHVzaCggY2FjaGVkICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50TWF0Y2hlcnMucHVzaCggY2FjaGVkICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2FjaGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZShcblx0XHRcdHNlbGVjdG9yLFxuXHRcdFx0bWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzIClcblx0XHQpO1xuXG5cdFx0Ly8gU2F2ZSBzZWxlY3RvciBhbmQgdG9rZW5pemF0aW9uXG5cdFx0Y2FjaGVkLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdH1cblx0cmV0dXJuIGNhY2hlZDtcbn07XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgd29ya3Mgd2l0aCBTaXp6bGUncyBjb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHNlbGVjdG9yIEEgc2VsZWN0b3Igb3IgYSBwcmUtY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbiBidWlsdCB3aXRoIFNpenpsZS5jb21waWxlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRleHRcbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHRzXVxuICogQHBhcmFtIHtBcnJheX0gW3NlZWRdIEEgc2V0IG9mIGVsZW1lbnRzIHRvIG1hdGNoIGFnYWluc3RcbiAqL1xuc2VsZWN0ID0gU2l6emxlLnNlbGVjdCA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIGksIHRva2VucywgdG9rZW4sIHR5cGUsIGZpbmQsXG5cdFx0Y29tcGlsZWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiAmJiBzZWxlY3Rvcixcblx0XHRtYXRjaCA9ICFzZWVkICYmIHRva2VuaXplKCAoIHNlbGVjdG9yID0gY29tcGlsZWQuc2VsZWN0b3IgfHwgc2VsZWN0b3IgKSApO1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFRyeSB0byBtaW5pbWl6ZSBvcGVyYXRpb25zIGlmIHRoZXJlIGlzIG9ubHkgb25lIHNlbGVjdG9yIGluIHRoZSBsaXN0IGFuZCBubyBzZWVkXG5cdC8vICh0aGUgbGF0dGVyIG9mIHdoaWNoIGd1YXJhbnRlZXMgdXMgY29udGV4dClcblx0aWYgKCBtYXRjaC5sZW5ndGggPT09IDEgKSB7XG5cblx0XHQvLyBSZWR1Y2UgY29udGV4dCBpZiB0aGUgbGVhZGluZyBjb21wb3VuZCBzZWxlY3RvciBpcyBhbiBJRFxuXHRcdHRva2VucyA9IG1hdGNoWyAwIF0gPSBtYXRjaFsgMCBdLnNsaWNlKCAwICk7XG5cdFx0aWYgKCB0b2tlbnMubGVuZ3RoID4gMiAmJiAoIHRva2VuID0gdG9rZW5zWyAwIF0gKS50eXBlID09PSBcIklEXCIgJiZcblx0XHRcdGNvbnRleHQubm9kZVR5cGUgPT09IDkgJiYgZG9jdW1lbnRJc0hUTUwgJiYgRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyAxIF0udHlwZSBdICkge1xuXG5cdFx0XHRjb250ZXh0ID0gKCBFeHByLmZpbmRbIFwiSURcIiBdKCB0b2tlbi5tYXRjaGVzWyAwIF1cblx0XHRcdFx0LnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICksIGNvbnRleHQgKSB8fCBbXSApWyAwIF07XG5cdFx0XHRpZiAoICFjb250ZXh0ICkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0Ly8gUHJlY29tcGlsZWQgbWF0Y2hlcnMgd2lsbCBzdGlsbCB2ZXJpZnkgYW5jZXN0cnksIHNvIHN0ZXAgdXAgYSBsZXZlbFxuXHRcdFx0fSBlbHNlIGlmICggY29tcGlsZWQgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBjb250ZXh0LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc2xpY2UoIHRva2Vucy5zaGlmdCgpLnZhbHVlLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZldGNoIGEgc2VlZCBzZXQgZm9yIHJpZ2h0LXRvLWxlZnQgbWF0Y2hpbmdcblx0XHRpID0gbWF0Y2hFeHByWyBcIm5lZWRzQ29udGV4dFwiIF0udGVzdCggc2VsZWN0b3IgKSA/IDAgOiB0b2tlbnMubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0dG9rZW4gPSB0b2tlbnNbIGkgXTtcblxuXHRcdFx0Ly8gQWJvcnQgaWYgd2UgaGl0IGEgY29tYmluYXRvclxuXHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyAoIHR5cGUgPSB0b2tlbi50eXBlICkgXSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoICggZmluZCA9IEV4cHIuZmluZFsgdHlwZSBdICkgKSB7XG5cblx0XHRcdFx0Ly8gU2VhcmNoLCBleHBhbmRpbmcgY29udGV4dCBmb3IgbGVhZGluZyBzaWJsaW5nIGNvbWJpbmF0b3JzXG5cdFx0XHRcdGlmICggKCBzZWVkID0gZmluZChcblx0XHRcdFx0XHR0b2tlbi5tYXRjaGVzWyAwIF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSxcblx0XHRcdFx0XHRyc2libGluZy50ZXN0KCB0b2tlbnNbIDAgXS50eXBlICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8XG5cdFx0XHRcdFx0XHRjb250ZXh0XG5cdFx0XHRcdCkgKSApIHtcblxuXHRcdFx0XHRcdC8vIElmIHNlZWQgaXMgZW1wdHkgb3Igbm8gdG9rZW5zIHJlbWFpbiwgd2UgY2FuIHJldHVybiBlYXJseVxuXHRcdFx0XHRcdHRva2Vucy5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRzZWxlY3RvciA9IHNlZWQubGVuZ3RoICYmIHRvU2VsZWN0b3IoIHRva2VucyApO1xuXHRcdFx0XHRcdGlmICggIXNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2VlZCApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBDb21waWxlIGFuZCBleGVjdXRlIGEgZmlsdGVyaW5nIGZ1bmN0aW9uIGlmIG9uZSBpcyBub3QgcHJvdmlkZWRcblx0Ly8gUHJvdmlkZSBgbWF0Y2hgIHRvIGF2b2lkIHJldG9rZW5pemF0aW9uIGlmIHdlIG1vZGlmaWVkIHRoZSBzZWxlY3RvciBhYm92ZVxuXHQoIGNvbXBpbGVkIHx8IGNvbXBpbGUoIHNlbGVjdG9yLCBtYXRjaCApICkoXG5cdFx0c2VlZCxcblx0XHRjb250ZXh0LFxuXHRcdCFkb2N1bWVudElzSFRNTCxcblx0XHRyZXN1bHRzLFxuXHRcdCFjb250ZXh0IHx8IHJzaWJsaW5nLnRlc3QoIHNlbGVjdG9yICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8IGNvbnRleHRcblx0KTtcblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vLyBPbmUtdGltZSBhc3NpZ25tZW50c1xuXG4vLyBTb3J0IHN0YWJpbGl0eVxuc3VwcG9ydC5zb3J0U3RhYmxlID0gZXhwYW5kby5zcGxpdCggXCJcIiApLnNvcnQoIHNvcnRPcmRlciApLmpvaW4oIFwiXCIgKSA9PT0gZXhwYW5kbztcblxuLy8gU3VwcG9ydDogQ2hyb21lIDE0LTM1K1xuLy8gQWx3YXlzIGFzc3VtZSBkdXBsaWNhdGVzIGlmIHRoZXkgYXJlbid0IHBhc3NlZCB0byB0aGUgY29tcGFyaXNvbiBmdW5jdGlvblxuc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzID0gISFoYXNEdXBsaWNhdGU7XG5cbi8vIEluaXRpYWxpemUgYWdhaW5zdCB0aGUgZGVmYXVsdCBkb2N1bWVudFxuc2V0RG9jdW1lbnQoKTtcblxuLy8gU3VwcG9ydDogV2Via2l0PDUzNy4zMiAtIFNhZmFyaSA2LjAuMy9DaHJvbWUgMjUgKGZpeGVkIGluIENocm9tZSAyNylcbi8vIERldGFjaGVkIG5vZGVzIGNvbmZvdW5kaW5nbHkgZm9sbG93ICplYWNoIG90aGVyKlxuc3VwcG9ydC5zb3J0RGV0YWNoZWQgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHQvLyBTaG91bGQgcmV0dXJuIDEsIGJ1dCByZXR1cm5zIDQgKGZvbGxvd2luZylcblx0cmV0dXJuIGVsLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImZpZWxkc2V0XCIgKSApICYgMTtcbn0gKTtcblxuLy8gU3VwcG9ydDogSUU8OFxuLy8gUHJldmVudCBhdHRyaWJ1dGUvcHJvcGVydHkgXCJpbnRlcnBvbGF0aW9uXCJcbi8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1MzY0MjklMjhWUy44NSUyOS5hc3B4XG5pZiAoICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0ZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPScjJz48L2E+XCI7XG5cdHJldHVybiBlbC5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSggXCJocmVmXCIgKSA9PT0gXCIjXCI7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInR5cGVcIiA/IDEgOiAyICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBkZWZhdWx0VmFsdWUgaW4gcGxhY2Ugb2YgZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbmlmICggIXN1cHBvcnQuYXR0cmlidXRlcyB8fCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdGVsLmlubmVySFRNTCA9IFwiPGlucHV0Lz5cIjtcblx0ZWwuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiwgXCJcIiApO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBcIlwiO1xufSApICkge1xuXHRhZGRIYW5kbGUoIFwidmFsdWVcIiwgZnVuY3Rpb24oIGVsZW0sIF9uYW1lLCBpc1hNTCApIHtcblx0XHRpZiAoICFpc1hNTCAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLmRlZmF1bHRWYWx1ZTtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGdldEF0dHJpYnV0ZU5vZGUgdG8gZmV0Y2ggYm9vbGVhbnMgd2hlbiBnZXRBdHRyaWJ1dGUgbGllc1xuaWYgKCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiApID09IG51bGw7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggYm9vbGVhbnMsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHR2YXIgdmFsO1xuXHRcdGlmICggIWlzWE1MICkge1xuXHRcdFx0cmV0dXJuIGVsZW1bIG5hbWUgXSA9PT0gdHJ1ZSA/IG5hbWUudG9Mb3dlckNhc2UoKSA6XG5cdFx0XHRcdCggdmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkgKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRcdG51bGw7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIEVYUE9TRVxudmFyIF9zaXp6bGUgPSB3aW5kb3cuU2l6emxlO1xuXG5TaXp6bGUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHdpbmRvdy5TaXp6bGUgPT09IFNpenpsZSApIHtcblx0XHR3aW5kb3cuU2l6emxlID0gX3NpenpsZTtcblx0fVxuXG5cdHJldHVybiBTaXp6bGU7XG59O1xuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRkZWZpbmUoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTaXp6bGU7XG5cdH0gKTtcblxuLy8gU2l6emxlIHJlcXVpcmVzIHRoYXQgdGhlcmUgYmUgYSBnbG9iYWwgd2luZG93IGluIENvbW1vbi1KUyBsaWtlIGVudmlyb25tZW50c1xufSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyApIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBTaXp6bGU7XG59IGVsc2Uge1xuXHR3aW5kb3cuU2l6emxlID0gU2l6emxlO1xufVxuXG4vLyBFWFBPU0VcblxufSApKCB3aW5kb3cgKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc2l6emxlL2Rpc3Qvc2l6emxlLmpzIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBzZWxlY3QsIGdldFNpbmdsZVNlbGVjdG9yLCBnZXRNdWx0aVNlbGVjdG9yIH0gZnJvbSAnLi9zZWxlY3QnXG5leHBvcnQgeyBkZWZhdWx0IGFzIG1hdGNoIH0gZnJvbSAnLi9tYXRjaCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3B0aW1pemUgfSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==