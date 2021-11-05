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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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
    var Sizzle = __webpack_require__(8);
    return function (selector) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return Sizzle(selector, parent || options.root || document);
    };
  }
  return function (selector) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return (parent || options.root || document).querySelectorAll(selector);
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
var convertNodeList = exports.convertNodeList = function convertNodeList(nodes) {
  var length = nodes.length;

  var arr = new Array(length);
  for (var i = 0; i < length; i++) {
    arr[i] = nodes[i];
  }
  return arr;
};

/**
 * Escape special characters and line breaks as a simplified version of 'CSS.escape()'
 *
 * Description of valid characters: https://mathiasbynens.be/notes/css-escapes
 *
 * @param  {String?} value - [description]
 * @return {String}        - [description]
 */
var escapeValue = exports.escapeValue = function escapeValue(value) {
  return value && value.replace(/['"`\\/:?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '\xA0');
};

/**
 * Partition array into two groups determined by predicate
 */
var partition = exports.partition = function partition(array, predicate) {
  return array.reduce(function (_ref, item) {
    var _ref2 = _slicedToArray(_ref, 2),
        inner = _ref2[0],
        outer = _ref2[1];

    return predicate(item) ? [inner.concat(item), outer] : [inner, outer.concat(item)];
  }, [[], []]);
};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = match;

var _pattern = __webpack_require__(5);

var _common = __webpack_require__(0);

var _utilities = __webpack_require__(1);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * # Match
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * Retrieve selector for a node.
                                                                                                                                                                                                     */

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
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
 * @return {Array.<Pattern>}       - [description]
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
        checkChilds(priority, element, ignore, path);
      }
    }

    element = element.parentNode;
    length = path.length;
  }

  if (element === root) {
    var pattern = findPattern(priority, element, ignore, select);
    path.unshift(pattern);
  }

  return path;
}

/**
 * Extend path with attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select   - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
function checkAttributes(priority, element, ignore, path, select) {
  var parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : element.parentNode;

  var pattern = findAttributesPattern(priority, element, ignore, select, parent);
  if (pattern) {
    path.unshift(pattern);
    return true;
  }
  return false;
}

/**
 * Get class selector
 *
 * @param  {Array.<string>} classes - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @param  {Pattern}        base    - [description]
 * @return {Array.<string>?}        - [description]
 */
function getClassSelector() {
  var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var select = arguments[1];
  var parent = arguments[2];
  var base = arguments[3];

  var result = [[]];

  classes.forEach(function (c) {
    result.forEach(function (r) {
      result.push(r.concat(c));
    });
  });

  result.shift();
  result = result.sort(function (a, b) {
    return a.length - b.length;
  });

  var prefix = (0, _pattern.patternToString)(base);

  for (var i = 0; i < result.length; i++) {
    var matches = select(prefix + '.' + result[i].join('.'), parent);
    if (matches.length === 1) {
      return result[i];
    }
  }

  return null;
}

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority  - [description]
 * @param  {HTMLElement}    element   - [description]
 * @param  {Object}         ignore    - [description]
 * @param  {function}       select    - [description]
 * @param  {ParentNode}     parent    - [description]
 * @return {Pattern?}                 - [description]
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
  var pattern = (0, _pattern.createPattern)();
  pattern.tag = element.tagName.toLowerCase();

  var isOptimal = function isOptimal(pattern) {
    return select((0, _pattern.patternToString)(pattern), parent).length === 1;
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
              var classes = getClassSelector(classNames, select, parent, pattern);
              if (classes) {
                pattern.classes = classes;
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
        pattern.attributes.push({ name: attributeName, value: attributeValue });
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
 * @param  {HTMLElement}     element - [description]
 * @param  {Object}          ignore  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}        select  - [description]
 * @param  {HTMLElement}     parent  - [description]
 * @return {boolean}                 - [description]
 */
function checkTag(element, ignore, path, select) {
  var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : element.parentNode;

  var pattern = findTagPattern(element, ignore);
  if (pattern) {
    var matches = [];
    matches = select((0, _pattern.patternToString)(pattern), parent);
    if (matches.length === 1) {
      path.unshift(pattern);
      if (pattern.tag === 'iframe') {
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
 * @return {Pattern?}            - [description]
 */
function findTagPattern(element, ignore) {
  var tagName = element.tagName.toLowerCase();
  if (checkIgnore(ignore.tag, null, tagName)) {
    return null;
  }
  var pattern = (0, _pattern.createPattern)();
  pattern.tag = tagName;
  return pattern;
}

/**
 * Extend path with specific child identifier
 *
 * NOTE: 'childTags' is a custom property to use as a view filter for tags using 'adapter.js'
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @return {boolean}                 - [description]
 */
function checkChilds(priority, element, ignore, path) {
  var parent = element.parentNode;
  var children = parent.childTags || parent.children;
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    if (child === element) {
      var childPattern = findTagPattern(child, ignore);
      if (!childPattern) {
        return console.warn('\n          Element couldn\'t be matched through strict ignore pattern!\n        ', child, ignore, childPattern);
      }
      childPattern.relates = 'child';
      childPattern.pseudo = ['nth-child(' + (i + 1) + ')'];
      path.unshift(childPattern);
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
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select   - [description]
 * @return {boolean}                 - [description]
 */
function checkContains(priority, element, ignore, path, select) {
  var pattern = findTagPattern(element, ignore, select);
  if (!pattern) {
    return false;
  }
  var parent = element.parentNode;
  var texts = element.textContent.replace(/\n+/g, '\n').split('\n').map(function (text) {
    return text.trim();
  }).filter(function (text) {
    return text.length > 0;
  });

  pattern.relates = 'child';
  var prefix = (0, _pattern.patternToString)(pattern);
  var contains = [];

  while (texts.length > 0) {
    var text = texts.shift();
    if (checkIgnore(ignore.contains, null, text)) {
      break;
    }
    contains.push('contains("' + text + '")');
    if (select('' + prefix + (0, _pattern.pseudoToString)(contains), parent).length === 1) {
      pattern.pseudo = [].concat(_toConsumableArray(pattern.pseudo), contains);
      path.unshift(pattern);
      return true;
    }
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
 * @return {Pattern}                 - [description]
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * # Optimize
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * 1.) Improve efficiency through shorter selectors by removing redundancy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * 2.) Improve robustness through selector transformation
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

exports.default = optimize;

var _adapt = __webpack_require__(4);

var _adapt2 = _interopRequireDefault(_adapt);

var _common = __webpack_require__(0);

var _pattern2 = __webpack_require__(5);

var _utilities = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 */

/**
 * Apply different optimization techniques
 *
 * @param  {Array.<Pattern>}                 path   - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element    - [description]
 * @param  {Options}                         [options]  - [description]
 * @return {string}                                     - [description]
 */
function optimize(path, elements) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (path.length === 0) {
    return '';
  }

  if (path[0].relates === 'child') {
    path[0].relates = undefined;
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

  if (path.length < 2) {
    return (0, _pattern2.patternToString)(optimizePart('', path[0], '', elements, select));
  }

  var endOptimized = false;
  if (path[path.length - 1].relates === 'child') {
    path[path.length - 1] = optimizePart((0, _pattern2.pathToString)(path.slice(0, -1)), path[path.length - 1], '', elements, select);
    endOptimized = true;
  }

  var shortened = [path.pop()];

  var _loop = function _loop() {
    var current = path.pop();
    var prePart = (0, _pattern2.pathToString)(path);
    var postPart = (0, _pattern2.pathToString)(shortened);

    var matches = select(prePart + ' ' + postPart);
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
  path[0] = optimizePart('', path[0], (0, _pattern2.pathToString)(path.slice(1)), elements, select);
  if (!endOptimized) {
    path[path.length - 1] = optimizePart((0, _pattern2.pathToString)(path.slice(0, -1)), path[path.length - 1], '', elements, select);
  }

  if (globalModified) {
    delete true;
  }

  return (0, _pattern2.pathToString)(path); // path.join(' ').replace(/>/g, '> ').trim()
}

/**
 * Optimize :contains
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeContains(prePart, current, postPart, elements, select) {
  var _partition = (0, _utilities.partition)(current.pseudo, function (item) {
    return (/contains\("/.test(item)
    );
  }),
      _partition2 = _slicedToArray(_partition, 2),
      contains = _partition2[0],
      other = _partition2[1];

  var prefix = (0, _pattern2.patternToString)(_extends({}, current, { pseudo: [] }));

  if (contains.length > 0 && postPart.length) {
    var optimized = [].concat(_toConsumableArray(other), _toConsumableArray(contains));
    while (optimized.length > other.length) {
      optimized.pop();
      var pattern = '' + prePart + prefix + (0, _pattern2.pseudoToString)(optimized) + postPart;
      if (!compareResults(select(pattern), elements)) {
        break;
      }
      current.pseudo = optimized;
    }
  }
  return current;
}

/**
 * Optimize attributes
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeAttributes(prePart, current, postPart, elements, select) {
  // reduce attributes: first try without value, then removing completely
  if (current.attributes.length > 0) {
    var attributes = [].concat(_toConsumableArray(current.attributes));
    var prefix = (0, _pattern2.patternToString)(_extends({}, current, { attributes: [] }));

    var simplify = function simplify(original, getSimplified) {
      var i = original.length - 1;
      while (i >= 0) {
        var _attributes = getSimplified(original, i);
        if (!compareResults(select('' + prePart + prefix + (0, _pattern2.attributesToString)(_attributes) + postPart), elements)) {
          break;
        }
        i--;
        original = _attributes;
      }
      return original;
    };

    var simplified = simplify(attributes, function (attributes, i) {
      var name = attributes[i].name;

      if (name === 'id') {
        return attributes;
      }
      return [].concat(_toConsumableArray(attributes.slice(0, i)), [{ name: name, value: null }], _toConsumableArray(attributes.slice(i + 1)));
    });

    return _extends({}, current, { attributes: simplify(simplified, function (attributes) {
        return attributes.slice(0, -1);
      }) });
  }
  return current;
}

/**
 * Optimize descendant
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeDescendant(prePart, current, postPart, elements, select) {
  // robustness: descendant instead child (heuristic)
  if (current.relates === 'child') {
    var descendant = _extends({}, current, { relates: undefined });
    var _matches = select('' + prePart + (0, _pattern2.patternToString)(descendant) + postPart);
    if (compareResults(_matches, elements)) {
      return descendant;
    }
  }
  return current;
}

/**
 * Optimize nth of type
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeNthOfType(prePart, current, postPart, elements, select) {
  var i = current.pseudo.findIndex(function (item) {
    return item.startsWith('nth-child');
  });
  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (i >= 0) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    var type = current.pseudo[i].replace(/^nth-child/, 'nth-of-type');
    var nthOfType = _extends({}, current, { pseudo: [].concat(_toConsumableArray(current.pseudo.slice(0, i)), [type], _toConsumableArray(current.pseudo.slice(i + 1))) });
    var pattern = '' + prePart + (0, _pattern2.patternToString)(nthOfType) + postPart;
    var matches = select(pattern);
    if (compareResults(matches, elements)) {
      current = nthOfType;
    }
  }
  return current;
}

/**
 * Optimize classes
 *
 * @param  {string}              prePart  - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
 */
function optimizeClasses(prePart, current, postPart, elements, select) {
  // efficiency: combinations of classname (partial permutations)
  if (current.classes.length > 1) {
    var optimized = current.classes.slice().sort(function (curr, next) {
      return curr.length - next.length;
    });
    var prefix = (0, _pattern2.patternToString)(_extends({}, current, { classes: [] }));

    while (optimized.length > 1) {
      optimized.shift();
      var _pattern = '' + prePart + prefix + (0, _pattern2.classesToString)(optimized) + postPart;
      if (!_pattern.length || _pattern.charAt(0) === '>' || _pattern.charAt(_pattern.length - 1) === '>') {
        break;
      }
      if (!compareResults(select(_pattern), elements)) {
        break;
      }
      current.classes = optimized;
    }

    optimized = current.classes;
    if (optimized.length > 2) {
      var references = select('' + prePart + (0, _pattern2.classesToString)(current));

      var _loop2 = function _loop2() {
        var reference = references[i2];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          // TODO:
          // - check using attributes + regard excludes
          var description = reference.tagName.toLowerCase();
          pattern = '' + prePart + description + postPart;
          matches = select(pattern);

          if (compareResults(matches, elements)) {
            current = { tag: description };
          }
          return 'break';
        }
      };

      for (var i2 = 0, l2 = references.length; i2 < l2; i2++) {
        var pattern;
        var matches;

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
 * @param  {Pattern}             current  - [description]
 * @param  {string}              postPart - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @return {Pattern}                      - [description]
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @typedef  {Object} Pattern
 * @property {('descendant' | 'child')}                  [relates]
 * @property {string}                                    [tag]
 * @property {Array.<{ name: string, value: string? }>}  attributes
 * @property {Array.<string>}                            classes
 * @property {Array.<string>}                            pseudo
 */

/**
 * Convert attributes to string
 * 
 * @param {Array.<{ name: string, value: string? }>} attributes 
 * @returns {string}
 */
var attributesToString = exports.attributesToString = function attributesToString(attributes) {
  return attributes.map(function (_ref) {
    var name = _ref.name,
        value = _ref.value;

    if (name === 'id') {
      return '#' + value;
    }
    if (value === null) {
      return '[' + name + ']';
    }
    return '[' + name + '="' + value + '"]';
  }).join('');
};

/**
 * Convert classes to string
 * 
 * @param {Array.<string>} classes 
 * @returns {string}
 */
var classesToString = exports.classesToString = function classesToString(classes) {
  return classes.length ? '.' + classes.join('.') : '';
};

/**
 * Convert pseudo selectors to string
 * 
 * @param {Array.<string>} pseudo 
 * @returns {string}
 */
var pseudoToString = exports.pseudoToString = function pseudoToString(pseudo) {
  return pseudo.length ? ':' + pseudo.join(':') : '';
};

/**
 * Convert pattern to string
 * 
 * @param {Pattern} pattern 
 * @returns {string}
 */
var patternToString = exports.patternToString = function patternToString(pattern) {
  var relates = pattern.relates,
      tag = pattern.tag,
      attributes = pattern.attributes,
      classes = pattern.classes,
      pseudo = pattern.pseudo;

  var value = '' + (relates === 'child' ? '> ' : '') + (tag || '') + attributesToString(attributes) + classesToString(classes) + pseudoToString(pseudo);
  return value;
};

/**
 * Creates a new pattern structure
 * 
 * @param {Partial<Pattern>} pattern
 * @returns {Pattern}
 */
var createPattern = exports.createPattern = function createPattern() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _extends({ attributes: [], classes: [], pseudo: [] }, base);
};

/**
 * Converts path to string
 *
 * @param {Array.<Pattern>} path 
 * @returns {string}
 */
var pathToString = exports.pathToString = function pathToString(path) {
  return path.map(patternToString).join(' ');
};

/***/ },
/* 6 */
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

var _css2xpath = __webpack_require__(7);

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

  var path = (0, _match2.default)(element, options);
  var optimized = (0, _optimize2.default)(path, element, options);

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
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.common = exports.optimize = exports.match = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

var _select = __webpack_require__(6);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjNWY0Y2NmMDdjZmY1NWQwNTkzYiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9vcHRpbWl6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhdHRlcm4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NzczJ4cGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0U2VsZWN0IiwiZ2V0Q29tbW9uQW5jZXN0b3IiLCJnZXRDb21tb25Qcm9wZXJ0aWVzIiwib3B0aW9ucyIsImZvcm1hdCIsIlNpenpsZSIsInJlcXVpcmUiLCJzZWxlY3RvciIsInBhcmVudCIsInJvb3QiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50cyIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJsZW5ndGgiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwiaSIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiY29tbW9uUHJvcGVydGllcyIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwiY29tbW9uQ2xhc3NlcyIsImNvbW1vbkF0dHJpYnV0ZXMiLCJjb21tb25UYWciLCJ1bmRlZmluZWQiLCJnZXRBdHRyaWJ1dGUiLCJ0cmltIiwic3BsaXQiLCJmaWx0ZXIiLCJlbnRyeSIsIm5hbWUiLCJlbGVtZW50QXR0cmlidXRlcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJrZXkiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwidmFsdWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnZlcnROb2RlTGlzdCIsIm5vZGVzIiwiYXJyIiwiQXJyYXkiLCJlc2NhcGVWYWx1ZSIsInJlcGxhY2UiLCJwYXJ0aXRpb24iLCJhcnJheSIsInByZWRpY2F0ZSIsIml0ZW0iLCJpbm5lciIsIm91dGVyIiwiY29uY2F0IiwibWF0Y2giLCJkZWZhdWx0SWdub3JlIiwiaW5kZXhPZiIsIm5vZGUiLCJza2lwIiwicHJpb3JpdHkiLCJpZ25vcmUiLCJwYXRoIiwianF1ZXJ5Iiwic2VsZWN0Iiwic2tpcENvbXBhcmUiLCJpc0FycmF5IiwibWFwIiwic2tpcENoZWNrcyIsImNvbXBhcmUiLCJ0eXBlIiwidG9TdHJpbmciLCJSZWdFeHAiLCJ0ZXN0Iiwibm9kZVR5cGUiLCJjaGVja0F0dHJpYnV0ZXMiLCJjaGVja1RhZyIsImNoZWNrQ29udGFpbnMiLCJjaGVja0NoaWxkcyIsInBhdHRlcm4iLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsImdldENsYXNzU2VsZWN0b3IiLCJiYXNlIiwicmVzdWx0IiwiYyIsInIiLCJwdXNoIiwiYSIsImIiLCJwcmVmaXgiLCJtYXRjaGVzIiwiam9pbiIsImF0dHJpYnV0ZU5hbWVzIiwidmFsIiwic29ydGVkS2V5cyIsImlzT3B0aW1hbCIsImF0dHJpYnV0ZVZhbHVlIiwidXNlTmFtZWRJZ25vcmUiLCJjdXJyZW50SWdub3JlIiwiY3VycmVudERlZmF1bHRJZ25vcmUiLCJjaGVja0lnbm9yZSIsImNsYXNzTmFtZXMiLCJjbGFzc0lnbm9yZSIsImNsYXNzIiwiY2xhc3NOYW1lIiwiZmluZFRhZ1BhdHRlcm4iLCJjaGlsZHJlbiIsImNoaWxkVGFncyIsImNoaWxkIiwiY2hpbGRQYXR0ZXJuIiwiY29uc29sZSIsIndhcm4iLCJyZWxhdGVzIiwicHNldWRvIiwidGV4dHMiLCJ0ZXh0Q29udGVudCIsInRleHQiLCJjb250YWlucyIsImRlZmF1bHRQcmVkaWNhdGUiLCJjaGVjayIsIm9wdGltaXplIiwiRXJyb3IiLCJnbG9iYWxNb2RpZmllZCIsIm9wdGltaXplUGFydCIsImVuZE9wdGltaXplZCIsInNsaWNlIiwic2hvcnRlbmVkIiwicG9wIiwiY3VycmVudCIsInByZVBhcnQiLCJwb3N0UGFydCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsIm9wdGltaXplQ29udGFpbnMiLCJvdGhlciIsIm9wdGltaXplZCIsImNvbXBhcmVSZXN1bHRzIiwib3B0aW1pemVBdHRyaWJ1dGVzIiwic2ltcGxpZnkiLCJvcmlnaW5hbCIsImdldFNpbXBsaWZpZWQiLCJzaW1wbGlmaWVkIiwib3B0aW1pemVEZXNjZW5kYW50IiwiZGVzY2VuZGFudCIsIm9wdGltaXplTnRoT2ZUeXBlIiwiZmluZEluZGV4Iiwic3RhcnRzV2l0aCIsIm50aE9mVHlwZSIsIm9wdGltaXplQ2xhc3NlcyIsImNoYXJBdCIsInJlZmVyZW5jZXMiLCJyZWZlcmVuY2UiLCJpMiIsImRlc2NyaXB0aW9uIiwibDIiLCJvcHRpbWl6ZXJzIiwiYWNjIiwib3B0aW1pemVyIiwiYWRhcHQiLCJnbG9iYWwiLCJjb250ZXh0IiwiRWxlbWVudFByb3RvdHlwZSIsImdldFByb3RvdHlwZU9mIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiYXR0cmlicyIsIk5hbWVkTm9kZU1hcCIsImNvbmZpZ3VyYWJsZSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiSFRNTENvbGxlY3Rpb24iLCJ0cmF2ZXJzZURlc2NlbmRhbnRzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsIm5hbWVzIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiaGFzQXR0cmlidXRlIiwiY2hlY2tBdHRyaWJ1dGUiLCJOb2RlTGlzdCIsImlkIiwiY2hlY2tJZCIsImNoZWNrVW5pdmVyc2FsIiwicnVsZSIsImtpbmQiLCJwYXJzZUludCIsInZhbGlkYXRlUHNldWRvIiwiY29tcGFyZVNldCIsIm5vZGVJbmRleCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiYXR0cmlidXRlc1RvU3RyaW5nIiwiY2xhc3Nlc1RvU3RyaW5nIiwicHNldWRvVG9TdHJpbmciLCJwYXR0ZXJuVG9TdHJpbmciLCJjcmVhdGVQYXR0ZXJuIiwicGF0aFRvU3RyaW5nIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJzZWxlY3RvclBhdGgiLCJjbGFzc1NlbGVjdG9yIiwiYXR0cmlidXRlU2VsZWN0b3IiLCJwYXJ0cyIsImlucHV0IiwiaW5jbHVkZXMiLCJ4cGF0aF90b19sb3dlciIsInMiLCJ4cGF0aF9lbmRzX3dpdGgiLCJzMSIsInMyIiwieHBhdGhfdXJsIiwieHBhdGhfdXJsX2F0dHJzIiwieHBhdGhfdXJsX3BhdGgiLCJ4cGF0aF91cmxfZG9tYWluIiwieHBhdGhfbG93ZXJfY2FzZSIsInhwYXRoX25zX3VyaSIsInhwYXRoX25zX3BhdGgiLCJ4cGF0aF9oYXNfcHJvdG9jYWwiLCJ4cGF0aF9pc19pbnRlcm5hbCIsInhwYXRoX2lzX2xvY2FsIiwieHBhdGhfaXNfcGF0aCIsInhwYXRoX2lzX2xvY2FsX3BhdGgiLCJ4cGF0aF9ub3JtYWxpemVfc3BhY2UiLCJ4cGF0aF9pbnRlcm5hbCIsInhwYXRoX2V4dGVybmFsIiwiZXNjYXBlX2xpdGVyYWwiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJlc2NhcGVfcGFyZW5zIiwicmVnZXhfc3RyaW5nX2xpdGVyYWwiLCJyZWdleF9lc2NhcGVkX2xpdGVyYWwiLCJyZWdleF9jc3Nfd3JhcF9wc2V1ZG8iLCJyZWdleF9zcGVjYWxfY2hhcnMiLCJyZWdleF9maXJzdF9heGlzIiwicmVnZXhfZmlsdGVyX3ByZWZpeCIsInJlZ2V4X2F0dHJfcHJlZml4IiwicmVnZXhfbnRoX2VxdWF0aW9uIiwiY3NzX2NvbWJpbmF0b3JzX3JlZ2V4IiwiY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrIiwib3BlcmF0b3IiLCJheGlzIiwiZnVuYyIsImxpdGVyYWwiLCJleGNsdWRlIiwib2Zmc2V0Iiwib3JpZyIsImlzTnVtZXJpYyIsInByZXZDaGFyIiwiY3NzX2F0dHJpYnV0ZXNfcmVnZXgiLCJjc3NfYXR0cmlidXRlc19jYWxsYmFjayIsInN0ciIsImF0dHIiLCJjb21wIiwib3AiLCJzZWFyY2giLCJjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXgiLCJjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2siLCJnMSIsImcyIiwiYXJnIiwiZzMiLCJnNCIsImc1IiwiY3NzMnhwYXRoIiwieHBhdGgiLCJwcmVwZW5kQXhpcyIsImNzc19pZHNfY2xhc3Nlc19yZWdleCIsImNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayIsInN0YXJ0Iiwic2VsZWN0b3JTdGFydCIsImRlcHRoIiwibnVtIiwiaXNOYU4iLCJlc2NhcGVDaGFyIiwib3BlbiIsImNsb3NlIiwiY2hhciIsInJlcGVhdCIsIk51bWJlciIsImNvbnZlcnRFc2NhcGluZyIsIm5lc3RlZCIsImxpdGVyYWxzIiwic3Vic3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIndpbmRvdyIsInN1cHBvcnQiLCJFeHByIiwiZ2V0VGV4dCIsImlzWE1MIiwidG9rZW5pemUiLCJjb21waWxlIiwib3V0ZXJtb3N0Q29udGV4dCIsInNvcnRJbnB1dCIsImhhc0R1cGxpY2F0ZSIsInNldERvY3VtZW50IiwiZG9jRWxlbSIsImRvY3VtZW50SXNIVE1MIiwicmJ1Z2d5UVNBIiwicmJ1Z2d5TWF0Y2hlcyIsImV4cGFuZG8iLCJEYXRlIiwicHJlZmVycmVkRG9jIiwiZGlycnVucyIsImNsYXNzQ2FjaGUiLCJjcmVhdGVDYWNoZSIsInRva2VuQ2FjaGUiLCJjb21waWxlckNhY2hlIiwibm9ubmF0aXZlU2VsZWN0b3JDYWNoZSIsInNvcnRPcmRlciIsImhhc093biIsImhhc093blByb3BlcnR5IiwicHVzaE5hdGl2ZSIsImxpc3QiLCJlbGVtIiwibGVuIiwiYm9vbGVhbnMiLCJ3aGl0ZXNwYWNlIiwiaWRlbnRpZmllciIsInBzZXVkb3MiLCJyd2hpdGVzcGFjZSIsInJ0cmltIiwicmNvbW1hIiwicmNvbWJpbmF0b3JzIiwicmRlc2NlbmQiLCJycHNldWRvIiwicmlkZW50aWZpZXIiLCJtYXRjaEV4cHIiLCJyaHRtbCIsInJpbnB1dHMiLCJyaGVhZGVyIiwicm5hdGl2ZSIsInJxdWlja0V4cHIiLCJyc2libGluZyIsInJ1bmVzY2FwZSIsImZ1bmVzY2FwZSIsImVzY2FwZSIsIm5vbkhleCIsImhpZ2giLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidW5sb2FkSGFuZGxlciIsImluRGlzYWJsZWRGaWVsZHNldCIsImFkZENvbWJpbmF0b3IiLCJkaXNhYmxlZCIsIm5vZGVOYW1lIiwiZGlyIiwiYXBwbHkiLCJjYWxsIiwiY2hpbGROb2RlcyIsImUiLCJ0YXJnZXQiLCJlbHMiLCJqIiwicmVzdWx0cyIsInNlZWQiLCJtIiwibmlkIiwiZ3JvdXBzIiwibmV3U2VsZWN0b3IiLCJuZXdDb250ZXh0Iiwib3duZXJEb2N1bWVudCIsImV4ZWMiLCJnZXRFbGVtZW50QnlJZCIsInFzYSIsInRlc3RDb250ZXh0Iiwic2NvcGUiLCJzZXRBdHRyaWJ1dGUiLCJ0b1NlbGVjdG9yIiwicXNhRXJyb3IiLCJyZW1vdmVBdHRyaWJ1dGUiLCJjYWNoZSIsImNhY2hlTGVuZ3RoIiwibWFya0Z1bmN0aW9uIiwiZm4iLCJhc3NlcnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEhhbmRsZSIsImF0dHJzIiwiYXR0ckhhbmRsZSIsInNpYmxpbmdDaGVjayIsImN1ciIsImRpZmYiLCJzb3VyY2VJbmRleCIsIm5leHRTaWJsaW5nIiwiY3JlYXRlSW5wdXRQc2V1ZG8iLCJjcmVhdGVCdXR0b25Qc2V1ZG8iLCJjcmVhdGVEaXNhYmxlZFBzZXVkbyIsImlzRGlzYWJsZWQiLCJjcmVhdGVQb3NpdGlvbmFsUHNldWRvIiwiYXJndW1lbnQiLCJtYXRjaEluZGV4ZXMiLCJuYW1lc3BhY2UiLCJuYW1lc3BhY2VVUkkiLCJkb2N1bWVudEVsZW1lbnQiLCJoYXNDb21wYXJlIiwic3ViV2luZG93IiwiZG9jIiwiZGVmYXVsdFZpZXciLCJ0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUNvbW1lbnQiLCJnZXRCeUlkIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJhdHRySWQiLCJmaW5kIiwiZ2V0QXR0cmlidXRlTm9kZSIsImVsZW1zIiwidG1wIiwiaW5uZXJIVE1MIiwibWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwibW96TWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwiZGlzY29ubmVjdGVkTWF0Y2giLCJjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiIsImFkb3duIiwiYnVwIiwic29ydERldGFjaGVkIiwiYXVwIiwiYXAiLCJicCIsImV4cHIiLCJyZXQiLCJzcGVjaWZpZWQiLCJzZWwiLCJlcnJvciIsIm1zZyIsInVuaXF1ZVNvcnQiLCJkdXBsaWNhdGVzIiwiZGV0ZWN0RHVwbGljYXRlcyIsInNvcnRTdGFibGUiLCJzcGxpY2UiLCJmaXJzdENoaWxkIiwibm9kZVZhbHVlIiwiY3JlYXRlUHNldWRvIiwicmVsYXRpdmUiLCJmaXJzdCIsInByZUZpbHRlciIsImV4Y2VzcyIsInVucXVvdGVkIiwibm9kZU5hbWVTZWxlY3RvciIsIndoYXQiLCJfYXJndW1lbnQiLCJsYXN0Iiwic2ltcGxlIiwiZm9yd2FyZCIsIm9mVHlwZSIsIl9jb250ZXh0IiwieG1sIiwidW5pcXVlQ2FjaGUiLCJvdXRlckNhY2hlIiwidXNlQ2FjaGUiLCJsYXN0Q2hpbGQiLCJ1bmlxdWVJRCIsImFyZ3MiLCJzZXRGaWx0ZXJzIiwiaWR4IiwibWF0Y2hlZCIsIm1hdGNoZXIiLCJ1bm1hdGNoZWQiLCJsYW5nIiwiZWxlbUxhbmciLCJoYXNoIiwibG9jYXRpb24iLCJhY3RpdmVFbGVtZW50IiwiaGFzRm9jdXMiLCJocmVmIiwidGFiSW5kZXgiLCJjaGVja2VkIiwic2VsZWN0ZWQiLCJzZWxlY3RlZEluZGV4IiwiX21hdGNoSW5kZXhlcyIsInJhZGlvIiwiY2hlY2tib3giLCJmaWxlIiwicGFzc3dvcmQiLCJpbWFnZSIsInN1Ym1pdCIsInJlc2V0IiwicHJvdG90eXBlIiwiZmlsdGVycyIsInBhcnNlT25seSIsInRva2VucyIsInNvRmFyIiwicHJlRmlsdGVycyIsImNhY2hlZCIsImNvbWJpbmF0b3IiLCJjaGVja05vbkVsZW1lbnRzIiwiZG9uZU5hbWUiLCJvbGRDYWNoZSIsIm5ld0NhY2hlIiwiZWxlbWVudE1hdGNoZXIiLCJtYXRjaGVycyIsIm11bHRpcGxlQ29udGV4dHMiLCJjb250ZXh0cyIsImNvbmRlbnNlIiwibmV3VW5tYXRjaGVkIiwibWFwcGVkIiwic2V0TWF0Y2hlciIsInBvc3RGaWx0ZXIiLCJwb3N0RmluZGVyIiwicG9zdFNlbGVjdG9yIiwidGVtcCIsInByZU1hcCIsInBvc3RNYXAiLCJwcmVleGlzdGluZyIsIm1hdGNoZXJJbiIsIm1hdGNoZXJPdXQiLCJtYXRjaGVyRnJvbVRva2VucyIsImNoZWNrQ29udGV4dCIsImxlYWRpbmdSZWxhdGl2ZSIsImltcGxpY2l0UmVsYXRpdmUiLCJtYXRjaENvbnRleHQiLCJtYXRjaEFueUNvbnRleHQiLCJtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMiLCJlbGVtZW50TWF0Y2hlcnMiLCJzZXRNYXRjaGVycyIsImJ5U2V0IiwiYnlFbGVtZW50Iiwic3VwZXJNYXRjaGVyIiwib3V0ZXJtb3N0IiwibWF0Y2hlZENvdW50Iiwic2V0TWF0Y2hlZCIsImNvbnRleHRCYWNrdXAiLCJkaXJydW5zVW5pcXVlIiwiTWF0aCIsInJhbmRvbSIsInRva2VuIiwiY29tcGlsZWQiLCJfbmFtZSIsImRlZmF1bHRWYWx1ZSIsIl9zaXp6bGUiLCJub0NvbmZsaWN0IiwiZGVmaW5lIiwiZGVmYXVsdCIsImNvbW1vbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7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LEtBREwsR0FFQyxJQUhGO0FBSUE7QUFDRCxHQVJEO0FBU0E7O0FBRUQ7QUFDQSxLQUFJaWhCLFVBQVUvUCxPQUFPblUsTUFBckI7O0FBRUFBLFFBQU9ta0IsVUFBUCxHQUFvQixZQUFXO0FBQzlCLE1BQUtoUSxPQUFPblUsTUFBUCxLQUFrQkEsTUFBdkIsRUFBZ0M7QUFDL0JtVSxVQUFPblUsTUFBUCxHQUFnQmtrQixPQUFoQjtBQUNBOztBQUVELFNBQU9sa0IsTUFBUDtBQUNBLEVBTkQ7O0FBUUEsS0FBSyxJQUFMLEVBQWtEO0FBQ2pEb2tCLEVBQUEsa0NBQVEsWUFBVztBQUNsQixVQUFPcGtCLE1BQVA7QUFDQSxHQUZEOztBQUlEO0FBQ0MsRUFORCxNQU1PLElBQUssT0FBT2lVLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU9DLE9BQTdDLEVBQXVEO0FBQzdERCxTQUFPQyxPQUFQLEdBQWlCbFUsTUFBakI7QUFDQSxFQUZNLE1BRUE7QUFDTm1VLFNBQU9uVSxNQUFQLEdBQWdCQSxNQUFoQjtBQUNBOztBQUVEO0FBRUMsQ0FuNkVELEVBbTZFS21VLE1BbjZFTCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJDQ1ZTa1EsTzs7Ozs7O21CQUFtQmhXLGlCOzs7Ozs7bUJBQW1CQyxnQjs7Ozs7Ozs7OzBDQUN0QytWLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7Ozs7O1FBQ0dDLE0iLCJmaWxlIjoib3B0aW1hbC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYzVmNGNjZjA3Y2ZmNTVkMDU5M2IiLCIvKipcbiAqICMgQ29tbW9uXG4gKlxuICogUHJvY2VzcyBjb2xsZWN0aW9ucyBmb3Igc2ltaWxhcml0aWVzLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKi9cblxuLyoqXG4gKiBRdWVyeSBkb2N1bWVudCB1c2luZyBjb3JyZWN0IHNlbGVjdG9yIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHsoc2VsZWN0b3I6IHN0cmluZywgcGFyZW50OiBIVE1MRWxlbWVudCkgPT4gQXJyYXkuPEhUTUxFbGVtZW50Pn0gLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWxlY3QgKG9wdGlvbnMgPSB7fSkge1xuICBpZiAob3B0aW9ucy5mb3JtYXQgPT09ICdqcXVlcnknKSB7XG4gICAgY29uc3QgU2l6emxlID0gcmVxdWlyZSgnc2l6emxlJylcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGVjdG9yLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgICByZXR1cm4gU2l6emxlKHNlbGVjdG9yLCBwYXJlbnQgfHwgb3B0aW9ucy5yb290IHx8IGRvY3VtZW50KVxuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKHNlbGVjdG9yLCBwYXJlbnQgPSBudWxsKSB7XG4gICAgcmV0dXJuIChwYXJlbnQgfHwgb3B0aW9ucy5yb290IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICB9IFxufVxuXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25BbmNlc3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25Qcm9wZXJ0aWVzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSB7XG4gICAgY2xhc3NlczogW10sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgdGFnOiBudWxsXG4gIH1cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICB2YXIge1xuICAgICAgY2xhc3NlczogY29tbW9uQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXM6IGNvbW1vbkF0dHJpYnV0ZXMsXG4gICAgICB0YWc6IGNvbW1vblRhZ1xuICAgIH0gPSBjb21tb25Qcm9wZXJ0aWVzXG5cbiAgICAvLyB+IGNsYXNzZXNcbiAgICBpZiAoY29tbW9uQ2xhc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgICBpZiAoIWNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkNsYXNzZXMgPSBjb21tb25DbGFzc2VzLmZpbHRlcigoZW50cnkpID0+IGNsYXNzZXMuc29tZSgobmFtZSkgPT4gbmFtZSA9PT0gZW50cnkpKVxuICAgICAgICAgIGlmIChjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY29tbW9uQ2xhc3Nlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiByZXN0cnVjdHVyZSByZW1vdmFsIGFzIDJ4IHNldCAvIDJ4IGRlbGV0ZSwgaW5zdGVhZCBvZiBtb2RpZnkgYWx3YXlzIHJlcGxhY2luZyB3aXRoIG5ldyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IGF0dHJpYnV0ZXNcbiAgICBpZiAoY29tbW9uQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBlbGVtZW50QXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGVsZW1lbnRBdHRyaWJ1dGVzKS5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlc1trZXldXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgICAgICAvLyBOT1RFOiB3b3JrYXJvdW5kIGRldGVjdGlvbiBmb3Igbm9uLXN0YW5kYXJkIHBoYW50b21qcyBOYW1lZE5vZGVNYXAgYmVoYXZpb3VyXG4gICAgICAgIC8vIChpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTQ2MzQpXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGUudmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfSwge30pXG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICBjb25zdCBjb21tb25BdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKVxuXG4gICAgICBpZiAoYXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIWNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKG5leHRDb21tb25BdHRyaWJ1dGVzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbW1vbkF0dHJpYnV0ZXNbbmFtZV1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gYXR0cmlidXRlc1tuYW1lXSkge1xuICAgICAgICAgICAgICBuZXh0Q29tbW9uQXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dENvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IHRhZ1xuICAgIGlmIChjb21tb25UYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICghY29tbW9uVGFnKSB7XG4gICAgICAgIGNvbW1vblByb3BlcnRpZXMudGFnID0gdGFnXG4gICAgICB9IGVsc2UgaWYgKHRhZyAhPT0gY29tbW9uVGFnKSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLnRhZ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gY29tbW9uUHJvcGVydGllc1xufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tbW9uLmpzIiwiLyoqXG4gKiAjIFV0aWxpdGllc1xuICpcbiAqIENvbnZlbmllbmNlIGhlbHBlcnMuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgYW4gYXJyYXkgd2l0aCB0aGUgRE9NIG5vZGVzIG9mIHRoZSBsaXN0XG4gKlxuICogQHBhcmFtICB7Tm9kZUxpc3R9ICAgICAgICAgICAgIG5vZGVzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgY29udmVydE5vZGVMaXN0ID0gKG5vZGVzKSA9PiB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZXNjYXBlVmFsdWUgPSAodmFsdWUpID0+XG4gIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1snXCJgXFxcXC86PyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dL2csICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcdTAwYTAnKVxuXG4vKipcbiAqIFBhcnRpdGlvbiBhcnJheSBpbnRvIHR3byBncm91cHMgZGV0ZXJtaW5lZCBieSBwcmVkaWNhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnRpdGlvbiA9IChhcnJheSwgcHJlZGljYXRlKSA9PlxuICBhcnJheS5yZWR1Y2UoXG4gICAgKFtpbm5lciwgb3V0ZXJdLCBpdGVtKSA9PiBwcmVkaWNhdGUoaXRlbSkgPyBbaW5uZXIuY29uY2F0KGl0ZW0pLCBvdXRlcl0gOiBbaW5uZXIsIG91dGVyLmNvbmNhdChpdGVtKV0sXG4gICAgW1tdLCBbXV1cbiAgKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxpdGllcy5qcyIsIi8qKlxuICogIyBNYXRjaFxuICpcbiAqIFJldHJpZXZlIHNlbGVjdG9yIGZvciBhIG5vZGUuXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlUGF0dGVybiwgcGF0dGVyblRvU3RyaW5nLCBwc2V1ZG9Ub1N0cmluZyB9IGZyb20gJy4vcGF0dGVybidcbmltcG9ydCB7IGdldFNlbGVjdCB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0IHsgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqL1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPFBhdHRlcm4+fSAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnQsXG4gICAgc2tpcCA9IG51bGwsXG4gICAgcHJpb3JpdHkgPSBbJ2lkJywgJ2NsYXNzJywgJ2hyZWYnLCAnc3JjJ10sXG4gICAgaWdub3JlID0ge30sXG4gICAgZm9ybWF0XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgY29uc3QganF1ZXJ5ID0gKGZvcm1hdCA9PT0gJ2pxdWVyeScpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIGNvbnN0IHNraXBDb21wYXJlID0gc2tpcCAmJiAoQXJyYXkuaXNBcnJheShza2lwKSA/IHNraXAgOiBbc2tpcF0pLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQpID0+IGVsZW1lbnQgPT09IGVudHJ5XG4gICAgfVxuICAgIHJldHVybiBlbnRyeVxuICB9KVxuXG4gIGNvbnN0IHNraXBDaGVja3MgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiBza2lwICYmIHNraXBDb21wYXJlLnNvbWUoKGNvbXBhcmUpID0+IGNvbXBhcmUoZWxlbWVudCkpXG4gIH1cblxuICBPYmplY3Qua2V5cyhpZ25vcmUpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICB2YXIgcHJlZGljYXRlID0gaWdub3JlW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpIHJldHVyblxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcmVkaWNhdGUgPSBuZXcgUmVnRXhwKGVzY2FwZVZhbHVlKHByZWRpY2F0ZSkucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSlcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlID8gLyg/OikvIDogLy5eL1xuICAgIH1cbiAgICAvLyBjaGVjayBjbGFzcy0vYXR0cmlidXRlbmFtZSBmb3IgcmVnZXhcbiAgICBpZ25vcmVbdHlwZV0gPSAobmFtZSwgdmFsdWUpID0+IHByZWRpY2F0ZS50ZXN0KHZhbHVlKVxuICB9KVxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSByb290ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IDExKSB7XG4gICAgaWYgKHNraXBDaGVja3MoZWxlbWVudCkgIT09IHRydWUpIHtcbiAgICAgIC8vIH4gZ2xvYmFsXG4gICAgICBpZiAoY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcm9vdCkpIGJyZWFrXG4gICAgICBpZiAoY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHJvb3QpKSBicmVha1xuXG4gICAgICAvLyB+IGxvY2FsXG4gICAgICBjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KVxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG5cbiAgICAgIGlmIChqcXVlcnkgJiYgcGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NvbnRhaW5zKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIH1cblxuICAgICAgLy8gZGVmaW5lIG9ubHkgb25lIHBhcnQgZWFjaCBpdGVyYXRpb25cbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrQ2hpbGRzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gIH1cblxuICByZXR1cm4gcGF0aFxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHBhcmVudClcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICBiYXNlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz4/fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENsYXNzU2VsZWN0b3IoY2xhc3NlcyA9IFtdLCBzZWxlY3QsIHBhcmVudCwgYmFzZSkge1xuICBsZXQgcmVzdWx0ID0gW1tdXVxuXG4gIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgcmVzdWx0LmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgcmVzdWx0LnB1c2goci5jb25jYXQoYykpXG4gICAgfSlcbiAgfSlcblxuICByZXN1bHQuc2hpZnQoKVxuICByZXN1bHQgPSByZXN1bHQuc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGggfSlcblxuICBjb25zdCBwcmVmaXggPSBwYXR0ZXJuVG9TdHJpbmcoYmFzZSlcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChgJHtwcmVmaXh9LiR7cmVzdWx0W2ldLmpvaW4oJy4nKX1gLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcmVzdWx0W2ldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMb29rdXAgYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGFyZW50Tm9kZX0gICAgIHBhcmVudCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm4/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGVzUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKHZhbCkgPT4gYXR0cmlidXRlc1t2YWxdLm5hbWUpXG4gICAgLmZpbHRlcigoYSkgPT4gcHJpb3JpdHkuaW5kZXhPZihhKSA8IDApXG5cbiAgdmFyIHNvcnRlZEtleXMgPSBbIC4uLnByaW9yaXR5LCAuLi5hdHRyaWJ1dGVOYW1lcyBdXG4gIHZhciBwYXR0ZXJuID0gY3JlYXRlUGF0dGVybigpXG4gIHBhdHRlcm4udGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcblxuICB2YXIgaXNPcHRpbWFsID0gKHBhdHRlcm4pID0+IChzZWxlY3QocGF0dGVyblRvU3RyaW5nKHBhdHRlcm4pLCBwYXJlbnQpLmxlbmd0aCA9PT0gMSlcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUpXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLnZhbHVlKVxuICAgIGNvbnN0IHVzZU5hbWVkSWdub3JlID0gYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBpZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBjb25zdCBjdXJyZW50RGVmYXVsdElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHN3aXRjaCAoYXR0cmlidXRlTmFtZSkge1xuICAgICAgY2FzZSAnY2xhc3MnOiB7XG4gICAgICAgIGxldCBjbGFzc05hbWVzID0gYXR0cmlidXRlVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpXG4gICAgICAgIGNvbnN0IGNsYXNzSWdub3JlID0gaWdub3JlLmNsYXNzIHx8IGRlZmF1bHRJZ25vcmUuY2xhc3NcbiAgICAgICAgaWYgKGNsYXNzSWdub3JlKSB7XG4gICAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3NJZ25vcmUoY2xhc3NOYW1lKSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xhc3NOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgY2xhc3NlcyA9IGdldENsYXNzU2VsZWN0b3IoY2xhc3NOYW1lcywgc2VsZWN0LCBwYXJlbnQsIHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgICAgIHBhdHRlcm4uY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGF0dGVybi5hdHRyaWJ1dGVzLnB1c2goeyBuYW1lOiBhdHRyaWJ1dGVOYW1lLCB2YWx1ZTogYXR0cmlidXRlVmFsdWUgfSlcbiAgICAgICAgaWYgKGlzT3B0aW1hbChwYXR0ZXJuKSkge1xuICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgc2VsZWN0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBsZXQgbWF0Y2hlcyA9IFtdXG4gICAgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuVG9TdHJpbmcocGF0dGVybiksIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgaWYgKHBhdHRlcm4udGFnID09PSAnaWZyYW1lJykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJuP30gICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZFRhZ1BhdHRlcm4gKGVsZW1lbnQsIGlnbm9yZSkge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS50YWcsIG51bGwsIHRhZ05hbWUpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBjb25zdCBwYXR0ZXJuID0gY3JlYXRlUGF0dGVybigpXG4gIHBhdHRlcm4udGFnID0gdGFnTmFtZVxuICByZXR1cm4gcGF0dGVyblxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggc3BlY2lmaWMgY2hpbGQgaWRlbnRpZmllclxuICpcbiAqIE5PVEU6ICdjaGlsZFRhZ3MnIGlzIGEgY3VzdG9tIHByb3BlcnR5IHRvIHVzZSBhcyBhIHZpZXcgZmlsdGVyIGZvciB0YWdzIHVzaW5nICdhZGFwdGVyLmpzJ1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDaGlsZHMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkVGFncyB8fCBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkID09PSBlbGVtZW50KSB7XG4gICAgICBjb25zdCBjaGlsZFBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihjaGlsZCwgaWdub3JlKVxuICAgICAgaWYgKCFjaGlsZFBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICAgICAgRWxlbWVudCBjb3VsZG4ndCBiZSBtYXRjaGVkIHRocm91Z2ggc3RyaWN0IGlnbm9yZSBwYXR0ZXJuIVxuICAgICAgICBgLCBjaGlsZCwgaWdub3JlLCBjaGlsZFBhdHRlcm4pXG4gICAgICB9XG4gICAgICBjaGlsZFBhdHRlcm4ucmVsYXRlcyA9ICdjaGlsZCdcbiAgICAgIGNoaWxkUGF0dGVybi5wc2V1ZG8gPSBbYG50aC1jaGlsZCgke2krMX0pYF1cbiAgICAgIHBhdGgudW5zaGlmdChjaGlsZFBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGNvbnRhaW5zXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NvbnRhaW5zIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgdGV4dHMgPSBlbGVtZW50LnRleHRDb250ZW50XG4gICAgLnJlcGxhY2UoL1xcbisvZywgJ1xcbicpXG4gICAgLnNwbGl0KCdcXG4nKVxuICAgIC5tYXAodGV4dCA9PiB0ZXh0LnRyaW0oKSlcbiAgICAuZmlsdGVyKHRleHQgPT4gdGV4dC5sZW5ndGggPiAwKVxuXG4gIHBhdHRlcm4ucmVsYXRlcyA9ICdjaGlsZCdcbiAgY29uc3QgcHJlZml4ID0gcGF0dGVyblRvU3RyaW5nKHBhdHRlcm4pXG4gIGNvbnN0IGNvbnRhaW5zID0gW11cblxuICB3aGlsZSAodGV4dHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHRleHQgPSB0ZXh0cy5zaGlmdCgpXG4gICAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS5jb250YWlucywgbnVsbCwgdGV4dCkpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNvbnRhaW5zLnB1c2goYGNvbnRhaW5zKFwiJHt0ZXh0fVwiKWApXG4gICAgaWYgKHNlbGVjdChgJHtwcmVmaXh9JHtwc2V1ZG9Ub1N0cmluZyhjb250YWlucyl9YCwgcGFyZW50KS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdHRlcm4ucHNldWRvID0gWy4uLnBhdHRlcm4ucHNldWRvLCAuLi5jb250YWluc11cbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpIHtcbiAgdmFyIHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICB9XG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogVmFsaWRhdGUgd2l0aCBjdXN0b20gYW5kIGRlZmF1bHQgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHByZWRpY2F0ZSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgbmFtZSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259IGRlZmF1bHRQcmVkaWNhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZ25vcmUgKHByZWRpY2F0ZSwgbmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgY2hlY2sgPSBwcmVkaWNhdGUgfHwgZGVmYXVsdFByZWRpY2F0ZVxuICBpZiAoIWNoZWNrKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21hdGNoLmpzIiwiLyoqXG4gKiAjIE9wdGltaXplXG4gKlxuICogMS4pIEltcHJvdmUgZWZmaWNpZW5jeSB0aHJvdWdoIHNob3J0ZXIgc2VsZWN0b3JzIGJ5IHJlbW92aW5nIHJlZHVuZGFuY3lcbiAqIDIuKSBJbXByb3ZlIHJvYnVzdG5lc3MgdGhyb3VnaCBzZWxlY3RvciB0cmFuc2Zvcm1hdGlvblxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBwYXRoVG9TdHJpbmcsIHBhdHRlcm5Ub1N0cmluZywgcHNldWRvVG9TdHJpbmcsIGF0dHJpYnV0ZXNUb1N0cmluZywgY2xhc3Nlc1RvU3RyaW5nIH0gZnJvbSAnLi9wYXR0ZXJuJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0LCBwYXJ0aXRpb24gfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqL1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAgIHBhdGggICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnQgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3B0aW1pemUgKHBhdGgsIGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAocGF0aFswXS5yZWxhdGVzID09PSAnY2hpbGQnKSB7XG4gICAgcGF0aFswXS5yZWxhdGVzID0gdW5kZWZpbmVkXG4gIH1cblxuICAvLyBjb252ZXJ0IHNpbmdsZSBlbnRyeSBhbmQgTm9kZUxpc3RcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gIWVsZW1lbnRzLmxlbmd0aCA/IFtlbGVtZW50c10gOiBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoIWVsZW1lbnRzLmxlbmd0aCB8fCBlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIHRvIGNvbXBhcmUgSFRNTEVsZW1lbnRzIGl0cyBuZWNlc3NhcnkgdG8gcHJvdmlkZSBhIHJlZmVyZW5jZSBvZiB0aGUgc2VsZWN0ZWQgbm9kZShzKSEgKG1pc3NpbmcgXCJlbGVtZW50c1wiKScpXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICBpZiAocGF0aC5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIHBhdHRlcm5Ub1N0cmluZyhvcHRpbWl6ZVBhcnQoJycsIHBhdGhbMF0sICcnLCBlbGVtZW50cywgc2VsZWN0KSlcbiAgfVxuXG4gIHZhciBlbmRPcHRpbWl6ZWQgPSBmYWxzZVxuICBpZiAocGF0aFtwYXRoLmxlbmd0aC0xXS5yZWxhdGVzID09PSAnY2hpbGQnKSB7XG4gICAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoVG9TdHJpbmcocGF0aC5zbGljZSgwLCAtMSkpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCAnJywgZWxlbWVudHMsIHNlbGVjdClcbiAgICBlbmRPcHRpbWl6ZWQgPSB0cnVlXG4gIH1cblxuICBjb25zdCBzaG9ydGVuZWQgPSBbcGF0aC5wb3AoKV1cbiAgd2hpbGUgKHBhdGgubGVuZ3RoID4gMSkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoLnBvcCgpXG4gICAgY29uc3QgcHJlUGFydCA9IHBhdGhUb1N0cmluZyhwYXRoKVxuICAgIGNvbnN0IHBvc3RQYXJ0ID0gcGF0aFRvU3RyaW5nKHNob3J0ZW5lZClcblxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QoYCR7cHJlUGFydH0gJHtwb3N0UGFydH1gKVxuICAgIGNvbnN0IGhhc1NhbWVSZXN1bHQgPSBtYXRjaGVzLmxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoICYmIGVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50LCBpKSA9PiBlbGVtZW50ID09PSBtYXRjaGVzW2ldKVxuICAgIGlmICghaGFzU2FtZVJlc3VsdCkge1xuICAgICAgc2hvcnRlbmVkLnVuc2hpZnQob3B0aW1pemVQYXJ0KHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSlcbiAgICB9XG4gIH1cbiAgc2hvcnRlbmVkLnVuc2hpZnQocGF0aFswXSlcbiAgcGF0aCA9IHNob3J0ZW5lZFxuXG4gIC8vIG9wdGltaXplIHN0YXJ0ICsgZW5kXG4gIHBhdGhbMF0gPSBvcHRpbWl6ZVBhcnQoJycsIHBhdGhbMF0sIHBhdGhUb1N0cmluZyhwYXRoLnNsaWNlKDEpKSwgZWxlbWVudHMsIHNlbGVjdClcbiAgaWYgKCFlbmRPcHRpbWl6ZWQpIHtcbiAgICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGhUb1N0cmluZyhwYXRoLnNsaWNlKDAsIC0xKSksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50cywgc2VsZWN0KVxuICB9XG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHBhdGhUb1N0cmluZyhwYXRoKSAvLyBwYXRoLmpvaW4oJyAnKS5yZXBsYWNlKC8+L2csICc+ICcpLnRyaW0oKVxufVxuXG4vKipcbiAqIE9wdGltaXplIDpjb250YWluc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVDb250YWlucyAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgY29uc3QgW2NvbnRhaW5zLCBvdGhlcl0gPSBwYXJ0aXRpb24oY3VycmVudC5wc2V1ZG8sIChpdGVtKSA9PiAvY29udGFpbnNcXChcIi8udGVzdChpdGVtKSlcbiAgY29uc3QgcHJlZml4ID0gcGF0dGVyblRvU3RyaW5nKHsgLi4uY3VycmVudCwgcHNldWRvOiBbXSB9KVxuXG4gIGlmIChjb250YWlucy5sZW5ndGggPiAwICYmIHBvc3RQYXJ0Lmxlbmd0aCkge1xuICAgIGNvbnN0IG9wdGltaXplZCA9IFsuLi5vdGhlciwgLi4uY29udGFpbnNdXG4gICAgd2hpbGUgKG9wdGltaXplZC5sZW5ndGggPiBvdGhlci5sZW5ndGgpIHtcbiAgICAgIG9wdGltaXplZC5wb3AoKVxuICAgICAgY29uc3QgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwcmVmaXh9JHtwc2V1ZG9Ub1N0cmluZyhvcHRpbWl6ZWQpfSR7cG9zdFBhcnR9YFxuICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhzZWxlY3QocGF0dGVybiksIGVsZW1lbnRzKSkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY3VycmVudC5wc2V1ZG8gPSBvcHRpbWl6ZWRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBhdHRyaWJ1dGVzXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZUF0dHJpYnV0ZXMgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIC8vIHJlZHVjZSBhdHRyaWJ1dGVzOiBmaXJzdCB0cnkgd2l0aG91dCB2YWx1ZSwgdGhlbiByZW1vdmluZyBjb21wbGV0ZWx5XG4gIGlmIChjdXJyZW50LmF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgIGxldCBhdHRyaWJ1dGVzID0gWy4uLmN1cnJlbnQuYXR0cmlidXRlc11cbiAgICBsZXQgcHJlZml4ID0gcGF0dGVyblRvU3RyaW5nKHsgLi4uY3VycmVudCwgYXR0cmlidXRlczogW10gfSlcblxuICAgIGNvbnN0IHNpbXBsaWZ5ID0gKG9yaWdpbmFsLCBnZXRTaW1wbGlmaWVkKSA9PiB7XG4gICAgICBsZXQgaSA9IG9yaWdpbmFsLmxlbmd0aCAtIDFcbiAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBnZXRTaW1wbGlmaWVkKG9yaWdpbmFsLCBpKVxuICAgICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKFxuICAgICAgICAgIHNlbGVjdChgJHtwcmVQYXJ0fSR7cHJlZml4fSR7YXR0cmlidXRlc1RvU3RyaW5nKGF0dHJpYnV0ZXMpfSR7cG9zdFBhcnR9YCksXG4gICAgICAgICAgZWxlbWVudHNcbiAgICAgICAgKSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgaS0tXG4gICAgICAgIG9yaWdpbmFsID0gYXR0cmlidXRlc1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdpbmFsXG4gICAgfVxuXG4gICAgY29uc3Qgc2ltcGxpZmllZCA9IHNpbXBsaWZ5KGF0dHJpYnV0ZXMsIChhdHRyaWJ1dGVzLCBpKSA9PiB7XG4gICAgICBjb25zdCB7IG5hbWUgfSA9IGF0dHJpYnV0ZXNbaV1cbiAgICAgIGlmIChuYW1lID09PSAnaWQnKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgICByZXR1cm4gWy4uLmF0dHJpYnV0ZXMuc2xpY2UoMCwgaSksIHsgbmFtZSwgdmFsdWU6IG51bGwgfSwgLi4uYXR0cmlidXRlcy5zbGljZShpICsgMSldXG4gICAgfSlcblxuICAgIHJldHVybiB7IC4uLmN1cnJlbnQsIGF0dHJpYnV0ZXM6IHNpbXBsaWZ5KHNpbXBsaWZpZWQsIGF0dHJpYnV0ZXMgPT4gYXR0cmlidXRlcy5zbGljZSgwLCAtMSkpIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGRlc2NlbmRhbnRcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplRGVzY2VuZGFudCAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmIChjdXJyZW50LnJlbGF0ZXMgPT09ICdjaGlsZCcpIHtcbiAgICBjb25zdCBkZXNjZW5kYW50ID0geyAuLi5jdXJyZW50LCByZWxhdGVzOiB1bmRlZmluZWQgfVxuICAgIGxldCBtYXRjaGVzID0gc2VsZWN0KGAke3ByZVBhcnR9JHtwYXR0ZXJuVG9TdHJpbmcoZGVzY2VuZGFudCl9JHtwb3N0UGFydH1gKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIHJldHVybiBkZXNjZW5kYW50XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgbnRoIG9mIHR5cGVcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplTnRoT2ZUeXBlIChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICBjb25zdCBpID0gY3VycmVudC5wc2V1ZG8uZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5zdGFydHNXaXRoKCdudGgtY2hpbGQnKSlcbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmIChpID49IDApIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciBjb21wbGV0ZSBjb3ZlcmFnZSBvZiAnbnRoLW9mLXR5cGUnIHJlcGxhY2VtZW50XG4gICAgY29uc3QgdHlwZSA9IGN1cnJlbnQucHNldWRvW2ldLnJlcGxhY2UoL15udGgtY2hpbGQvLCAnbnRoLW9mLXR5cGUnKVxuICAgIGNvbnN0IG50aE9mVHlwZSA9IHsgLi4uY3VycmVudCwgcHNldWRvOiBbLi4uY3VycmVudC5wc2V1ZG8uc2xpY2UoMCwgaSksIHR5cGUsIC4uLmN1cnJlbnQucHNldWRvLnNsaWNlKGkgKyAxKV0gfVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3BhdHRlcm5Ub1N0cmluZyhudGhPZlR5cGUpfSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IG50aE9mVHlwZVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGNsYXNzZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplQ2xhc3NlcyAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmIChjdXJyZW50LmNsYXNzZXMubGVuZ3RoID4gMSkge1xuICAgIGxldCBvcHRpbWl6ZWQgPSBjdXJyZW50LmNsYXNzZXMuc2xpY2UoKS5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuICAgIGxldCBwcmVmaXggPSBwYXR0ZXJuVG9TdHJpbmcoeyAuLi5jdXJyZW50LCBjbGFzc2VzOiBbXSB9KVxuXG4gICAgd2hpbGUgKG9wdGltaXplZC5sZW5ndGggPiAxKSB7XG4gICAgICBvcHRpbWl6ZWQuc2hpZnQoKVxuICAgICAgY29uc3QgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwcmVmaXh9JHtjbGFzc2VzVG9TdHJpbmcob3B0aW1pemVkKX0ke3Bvc3RQYXJ0fWBcbiAgICAgIGlmICghcGF0dGVybi5sZW5ndGggfHwgcGF0dGVybi5jaGFyQXQoMCkgPT09ICc+JyB8fCBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aC0xKSA9PT0gJz4nKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKHNlbGVjdChwYXR0ZXJuKSwgZWxlbWVudHMpKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjdXJyZW50LmNsYXNzZXMgPSBvcHRpbWl6ZWRcbiAgICB9XG5cbiAgICBvcHRpbWl6ZWQgPSBjdXJyZW50LmNsYXNzZXNcbiAgICBpZiAob3B0aW1pemVkLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBzZWxlY3QoYCR7cHJlUGFydH0ke2NsYXNzZXNUb1N0cmluZyhjdXJyZW50KX1gKVxuICAgICAgZm9yICh2YXIgaTIgPSAwLCBsMiA9IHJlZmVyZW5jZXMubGVuZ3RoOyBpMiA8IGwyOyBpMisrKSB7XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbaTJdXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSB7IHRhZzogZGVzY3JpcHRpb24gfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbmNvbnN0IG9wdGltaXplcnMgPSBbXG4gIG9wdGltaXplQ29udGFpbnMsXG4gIG9wdGltaXplQXR0cmlidXRlcyxcbiAgb3B0aW1pemVEZXNjZW5kYW50LFxuICBvcHRpbWl6ZU50aE9mVHlwZSxcbiAgb3B0aW1pemVDbGFzc2VzLFxuXVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplUGFydCAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgaWYgKHByZVBhcnQubGVuZ3RoKSBwcmVQYXJ0ID0gYCR7cHJlUGFydH0gYFxuICBpZiAocG9zdFBhcnQubGVuZ3RoKSBwb3N0UGFydCA9IGAgJHtwb3N0UGFydH1gXG5cbiAgcmV0dXJuIG9wdGltaXplcnMucmVkdWNlKChhY2MsIG9wdGltaXplcikgPT4gb3B0aW1pemVyKHByZVBhcnQsIGFjYywgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpLCBjdXJyZW50KVxufVxuXG4vKipcbiAqIEV2YWx1YXRlIG1hdGNoZXMgd2l0aCBleHBlY3RlZCBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IG1hdGNoZXMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZVJlc3VsdHMgKG1hdGNoZXMsIGVsZW1lbnRzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBtYXRjaGVzXG4gIHJldHVybiBsZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaGVzW2ldID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29wdGltaXplLmpzIiwiLyoqXG4gKiAjIEFkYXB0XG4gKlxuICogQ2hlY2sgYW5kIGV4dGVuZCB0aGUgZW52aXJvbm1lbnQgZm9yIHVuaXZlcnNhbCB1c2FnZS5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICovXG5cbi8qKlxuICogTW9kaWZ5IHRoZSBjb250ZXh0IGJhc2VkIG9uIHRoZSBlbnZpcm9ubWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRhcHQgKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgLy8gZGV0ZWN0IGVudmlyb25tZW50IHNldHVwXG4gIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuZG9jdW1lbnQgPSBvcHRpb25zLmNvbnRleHQgfHwgKCgpID0+IHtcbiAgICAgIHZhciByb290ID0gZWxlbWVudFxuICAgICAgd2hpbGUgKHJvb3QucGFyZW50KSB7XG4gICAgICAgIHJvb3QgPSByb290LnBhcmVudFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3RcbiAgICB9KSgpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0w3NVxuICBjb25zdCBFbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbC5kb2N1bWVudClcblxuICAvLyBhbHRlcm5hdGl2ZSBkZXNjcmlwdG9yIHRvIGFjY2VzcyBlbGVtZW50cyB3aXRoIGZpbHRlcmluZyBpbnZhbGlkIGVsZW1lbnRzIChlLmcuIHRleHRub2RlcylcbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWVsZW1lbnR0eXBlL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0wxMlxuICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICd0YWcnIHx8IG5vZGUudHlwZSA9PT0gJ3NjcmlwdCcgfHwgbm9kZS50eXBlID09PSAnc3R5bGUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycpKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0cmlidXRlc1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9OYW1lZE5vZGVNYXBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJzIH0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnMpXG4gICAgICAgIGNvbnN0IE5hbWVkTm9kZU1hcCA9IGF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgYXR0cmlidXRlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnNbYXR0cmlidXRlTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgICAgfSwgeyB9KVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmFtZWROb2RlTWFwLCAnbGVuZ3RoJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIE5hbWVkTm9kZU1hcFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnNbbmFtZV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyh0aGlzLmNoaWxkVGFncywgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQubmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSAnKicpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lcyA9IGNsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNwbGl0KCcgJylcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50Q2xhc3NOYW1lID0gZGVzY2VuZGFudC5hdHRyaWJzLmNsYXNzXG4gICAgICAgIGlmIChkZXNjZW5kYW50Q2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBkZXNjZW5kYW50Q2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSkpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9jc3Mvc2VsZWN0b3JzX2FwaS9xdWVyeVNlbGVjdG9yQWxsXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvcXVlcnlTZWxlY3RvckFsbFxuICAgIEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIChzZWxlY3RvcnMpIHtcbiAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9ycy5yZXBsYWNlKC8oPikoXFxTKS9nLCAnJDEgJDInKS50cmltKCkgLy8gYWRkIHNwYWNlIGZvciAnPicgc2VsZWN0b3JcblxuICAgICAgLy8gdXNpbmcgcmlnaHQgdG8gbGVmdCBleGVjdXRpb24gPT4gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvY3NzLXNlbGVjdCNob3ctZG9lcy1pdC13b3JrXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBnZXRJbnN0cnVjdGlvbnMoc2VsZWN0b3JzKVxuICAgICAgY29uc3QgZGlzY292ZXIgPSBpbnN0cnVjdGlvbnMuc2hpZnQoKVxuXG4gICAgICBjb25zdCB0b3RhbCA9IGluc3RydWN0aW9ucy5sZW5ndGhcbiAgICAgIHJldHVybiBkaXNjb3Zlcih0aGlzKS5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIHN0ZXAgPSAwXG4gICAgICAgIHdoaWxlIChzdGVwIDwgdG90YWwpIHtcbiAgICAgICAgICBub2RlID0gaW5zdHJ1Y3Rpb25zW3N0ZXBdKG5vZGUsIHRoaXMpXG4gICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGhpZXJhcmNoeSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RlcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY29udGFpbnNcbiAgICBFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHZhciBpbmNsdXNpdmUgPSBmYWxzZVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgaW5jbHVzaXZlID0gdHJ1ZVxuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGluY2x1c2l2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogUmV0cmlldmUgdHJhbnNmb3JtYXRpb24gc3RlcHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gICBzZWxlY3RvcnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48RnVuY3Rpb24+fSAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEluc3RydWN0aW9ucyAoc2VsZWN0b3JzKSB7XG4gIHJldHVybiBzZWxlY3RvcnMuc3BsaXQoJyAnKS5yZXZlcnNlKCkubWFwKChzZWxlY3Rvciwgc3RlcCkgPT4ge1xuICAgIGNvbnN0IGRpc2NvdmVyID0gc3RlcCA9PT0gMFxuICAgIGNvbnN0IFt0eXBlLCBwc2V1ZG9dID0gc2VsZWN0b3Iuc3BsaXQoJzonKVxuXG4gICAgdmFyIHZhbGlkYXRlID0gbnVsbFxuICAgIHZhciBpbnN0cnVjdGlvbiA9IG51bGxcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAvLyBjaGlsZDogJz4nXG4gICAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrUGFyZW50IChub2RlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWxpZGF0ZSkgPT4gdmFsaWRhdGUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgICAvLyBjbGFzczogJy4nXG4gICAgICBjYXNlIC9eXFwuLy50ZXN0KHR5cGUpOiB7XG4gICAgICAgIGNvbnN0IG5hbWVzID0gdHlwZS5zdWJzdHIoMSkuc3BsaXQoJy4nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgbm9kZUNsYXNzTmFtZSA9IG5vZGUuYXR0cmlicy5jbGFzc1xuICAgICAgICAgIHJldHVybiBub2RlQ2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBub2RlQ2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQ2xhc3MgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUobmFtZXMuam9pbignICcpKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gYXR0cmlidXRlOiAnW2tleT1cInZhbHVlXCJdJ1xuICAgICAgY2FzZSAvXlxcWy8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gPSB0eXBlLnJlcGxhY2UoL1xcW3xcXF18XCIvZywgJycpLnNwbGl0KCc9JylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgICBpZiAoaGFzQXR0cmlidXRlKSB7IC8vIHJlZ2FyZCBvcHRpb25hbCBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSB8fCAobm9kZS5hdHRyaWJzW2F0dHJpYnV0ZUtleV0gPT09IGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyBpZDogJyMnXG4gICAgICBjYXNlIC9eIy8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBpZCA9IHR5cGUuc3Vic3RyKDEpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5hdHRyaWJzLmlkID09PSBpZFxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tJZCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgICBkb25lKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gdW5pdmVyc2FsOiAnKidcbiAgICAgIGNhc2UgL1xcKi8udGVzdCh0eXBlKToge1xuICAgICAgICB2YWxpZGF0ZSA9ICgpID0+IHRydWVcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1VuaXZlcnNhbCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpKVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyB0YWc6ICcuLi4nXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gdHlwZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tUYWcgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFdhbGtpbmcgcmVjdXJzaXZlIHRvIGludm9rZSBjYWxsYmFja3NcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxIVE1MRWxlbWVudD59IG5vZGVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgIGhhbmRsZXIgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQnViYmxlIHVwIGZyb20gYm90dG9tIHRvIHRvcFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSByb290ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICB2YWxpZGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRhcHQuanMiLCIvKipcbiAqIEB0eXBlZGVmICB7T2JqZWN0fSBQYXR0ZXJuXG4gKiBAcHJvcGVydHkgeygnZGVzY2VuZGFudCcgfCAnY2hpbGQnKX0gICAgICAgICAgICAgICAgICBbcmVsYXRlc11cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0YWddXG4gKiBAcHJvcGVydHkge0FycmF5Ljx7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZz8gfT59ICBhdHRyaWJ1dGVzXG4gKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+fSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzXG4gKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+fSAgICAgICAgICAgICAgICAgICAgICAgICAgICBwc2V1ZG9cbiAqL1xuXG4vKipcbiAqIENvbnZlcnQgYXR0cmlidXRlcyB0byBzdHJpbmdcbiAqIFxuICogQHBhcmFtIHtBcnJheS48eyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmc/IH0+fSBhdHRyaWJ1dGVzIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZXNUb1N0cmluZyA9IChhdHRyaWJ1dGVzKSA9PlxuICBhdHRyaWJ1dGVzLm1hcCgoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgaWYgKG5hbWUgPT09ICdpZCcpIHtcbiAgICAgIHJldHVybiBgIyR7dmFsdWV9YFxuICAgIH1cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBgWyR7bmFtZX1dYFxuICAgIH1cbiAgICByZXR1cm4gYFske25hbWV9PVwiJHt2YWx1ZX1cIl1gXG4gIH0pLmpvaW4oJycpXG5cbi8qKlxuICogQ29udmVydCBjbGFzc2VzIHRvIHN0cmluZ1xuICogXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGNsYXNzZXNUb1N0cmluZyA9IChjbGFzc2VzKSA9PiBjbGFzc2VzLmxlbmd0aCA/IGAuJHtjbGFzc2VzLmpvaW4oJy4nKX1gIDogJydcblxuLyoqXG4gKiBDb252ZXJ0IHBzZXVkbyBzZWxlY3RvcnMgdG8gc3RyaW5nXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBzZXVkbyBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwc2V1ZG9Ub1N0cmluZyA9IChwc2V1ZG8pID0+IHBzZXVkby5sZW5ndGggPyBgOiR7cHNldWRvLmpvaW4oJzonKX1gIDogJydcblxuLyoqXG4gKiBDb252ZXJ0IHBhdHRlcm4gdG8gc3RyaW5nXG4gKiBcbiAqIEBwYXJhbSB7UGF0dGVybn0gcGF0dGVybiBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwYXR0ZXJuVG9TdHJpbmcgPSAocGF0dGVybikgPT4ge1xuICBjb25zdCB7IHJlbGF0ZXMsIHRhZywgYXR0cmlidXRlcywgY2xhc3NlcywgcHNldWRvIH0gPSBwYXR0ZXJuXG4gIGNvbnN0IHZhbHVlID0gYCR7XG4gICAgcmVsYXRlcyA9PT0gJ2NoaWxkJyA/ICc+ICcgOiAnJ1xuICB9JHtcbiAgICB0YWcgfHwgJydcbiAgfSR7XG4gICAgYXR0cmlidXRlc1RvU3RyaW5nKGF0dHJpYnV0ZXMpXG4gIH0ke1xuICAgIGNsYXNzZXNUb1N0cmluZyhjbGFzc2VzKVxuICB9JHtcbiAgICBwc2V1ZG9Ub1N0cmluZyhwc2V1ZG8pXG4gIH1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcGF0dGVybiBzdHJ1Y3R1cmVcbiAqIFxuICogQHBhcmFtIHtQYXJ0aWFsPFBhdHRlcm4+fSBwYXR0ZXJuXG4gKiBAcmV0dXJucyB7UGF0dGVybn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVBhdHRlcm4gPSAoYmFzZSA9IHt9KSA9PlxuICAoeyBhdHRyaWJ1dGVzOiBbXSwgY2xhc3NlczogW10sIHBzZXVkbzogW10sIC4uLmJhc2UgfSlcblxuLyoqXG4gKiBDb252ZXJ0cyBwYXRoIHRvIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBhdGhUb1N0cmluZyA9IChwYXRoKSA9PlxuICBwYXRoLm1hcChwYXR0ZXJuVG9TdHJpbmcpLmpvaW4oJyAnKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhdHRlcm4uanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cbmltcG9ydCBjc3MyeHBhdGggZnJvbSAnY3NzMnhwYXRoJ1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJ1xuaW1wb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCB7IGdldFNlbGVjdCwgZ2V0Q29tbW9uQW5jZXN0b3IsIGdldENvbW1vblByb3BlcnRpZXMgfSBmcm9tICcuL2NvbW1vbidcblxuLyoqXG4gKiBAdHlwZWRlZiAge09iamVjdH0gT3B0aW9uc1xuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gW3Jvb3RdICAgICAgICAgICAgICAgICAgICAgT3B0aW9uYWxseSBzcGVjaWZ5IHRoZSByb290IGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24gfCBBcnJheS48SFRNTEVsZW1lbnQ+fSBbc2tpcF0gIFNwZWNpZnkgZWxlbWVudHMgdG8gc2tpcFxuICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPn0gW3ByaW9yaXR5XSAgICAgICAgICAgICAgT3JkZXIgb2YgYXR0cmlidXRlIHByb2Nlc3NpbmdcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0PHN0cmluZywgZnVuY3Rpb24gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFufSBbaWdub3JlXSBEZWZpbmUgcGF0dGVybnMgd2hpY2ggc2hvdWxkbid0IGJlIGluY2x1ZGVkXG4gKiBAcHJvcGVydHkgeygnY3NzJ3wneHBhdGgnfCdqcXVlcnknKX0gW2Zvcm1hdF0gICAgICBPdXRwdXQgZm9ybWF0ICAgIFxuICovXG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2luZ2xlU2VsZWN0b3IgKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICB9XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSBvbmx5IEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBhcmUgc3VwcG9ydGVkISAobm90IFwiJHt0eXBlb2YgZWxlbWVudH1cIilgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50LCBvcHRpb25zKVxuXG4gIGNvbnN0IHBhdGggPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShwYXRoLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZH1cbiAgLy8gYClcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gb3B0aW1pemVkXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSBvbmx5IGFuIEFycmF5IG9mIEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBpcyBzdXBwb3J0ZWQhJylcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIGNvbnN0IGFuY2VzdG9yID0gZ2V0Q29tbW9uQW5jZXN0b3IoZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IGFuY2VzdG9yU2VsZWN0b3IgPSBnZXRTaW5nbGVTZWxlY3RvcihhbmNlc3Rvciwgb3B0aW9ucylcblxuICAvLyBUT0RPOiBjb25zaWRlciB1c2FnZSBvZiBtdWx0aXBsZSBzZWxlY3RvcnMgKyBwYXJlbnQtY2hpbGQgcmVsYXRpb24gKyBjaGVjayBmb3IgcGFydCByZWR1bmRhbmN5XG4gIGNvbnN0IGNvbW1vblNlbGVjdG9ycyA9IGdldENvbW1vblNlbGVjdG9ycyhlbGVtZW50cylcbiAgY29uc3QgZGVzY2VuZGFudFNlbGVjdG9yID0gY29tbW9uU2VsZWN0b3JzWzBdXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpbWl6ZShgJHthbmNlc3RvclNlbGVjdG9yfSAke2Rlc2NlbmRhbnRTZWxlY3Rvcn1gLCBlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0b3JNYXRjaGVzID0gY29udmVydE5vZGVMaXN0KHNlbGVjdChzZWxlY3RvcikpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhbid0IGJlIGVmZmljaWVudGx5IG1hcHBlZC5cbiAgICAgIEl0cyBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhXG4gICAgYCwgZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgc2VsZWN0b3JzIHRvIGRlc2NyaWJlIGEgc2V0IG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDb21tb25TZWxlY3RvcnMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgeyBjbGFzc2VzLCBhdHRyaWJ1dGVzLCB0YWcgfSA9IGdldENvbW1vblByb3BlcnRpZXMoZWxlbWVudHMpXG5cbiAgY29uc3Qgc2VsZWN0b3JQYXRoID0gW11cblxuICBpZiAodGFnKSB7XG4gICAgc2VsZWN0b3JQYXRoLnB1c2godGFnKVxuICB9XG5cbiAgaWYgKGNsYXNzZXMpIHtcbiAgICBjb25zdCBjbGFzc1NlbGVjdG9yID0gY2xhc3Nlcy5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goY2xhc3NTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlU2VsZWN0b3IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5yZWR1Y2UoKHBhcnRzLCBuYW1lKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKGBbJHtuYW1lfT1cIiR7YXR0cmlidXRlc1tuYW1lXX1cIl1gKVxuICAgICAgcmV0dXJuIHBhcnRzXG4gICAgfSwgW10pLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goYXR0cmlidXRlU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoc2VsZWN0b3JQYXRoLmxlbmd0aCkge1xuICAgIC8vIFRPRE86IGNoZWNrIGZvciBwYXJlbnQtY2hpbGQgcmVsYXRpb25cbiAgfVxuXG4gIHJldHVybiBbXG4gICAgc2VsZWN0b3JQYXRoLmpvaW4oJycpXG4gIF1cbn1cblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKG11bHRpcGxlL3NpbmdsZSlcbiAqXG4gKiBOT1RFOiBleHRlbmRlZCBkZXRlY3Rpb24gaXMgdXNlZCBmb3Igc3BlY2lhbCBjYXNlcyBsaWtlIHRoZSA8c2VsZWN0PiBlbGVtZW50IHdpdGggPG9wdGlvbnM+XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8Tm9kZUxpc3R8QXJyYXkuPEhUTUxFbGVtZW50Pn0gaW5wdXQgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRRdWVyeVNlbGVjdG9yIChpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICBjb25zdCByZXN1bHQgPSBnZXRTaW5nbGVTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgaWYgKG9wdGlvbnMgJiYgWzEsICd4cGF0aCddLmluY2x1ZGVzKG9wdGlvbnMuZm9ybWF0KSkge1xuICAgIHJldHVybiBjc3MyeHBhdGgocmVzdWx0KVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdC5qcyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHhwYXRoX3RvX2xvd2VyICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3RyYW5zbGF0ZSgnICtcbiAgICAgICAgICAgICAgICAocyB8fCAnbm9ybWFsaXplLXNwYWNlKCknKSArXG4gICAgICAgICAgICAgICAgJywgXFwnQUJDREVGR0hKSUtMTU5PUFFSU1RVVldYWVpcXCcnICtcbiAgICAgICAgICAgICAgICAnLCBcXCdhYmNkZWZnaGppa2xtbm9wcXJzdHV2d3h5elxcJyknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX2VuZHNfd2l0aCAgICAgICAgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nKCcgKyBzMSArICcsJyArXG4gICAgICAgICAgICAgICAgJ3N0cmluZy1sZW5ndGgoJyArIHMxICsgJyktc3RyaW5nLWxlbmd0aCgnICsgczIgKyAnKSsxKT0nICsgczI7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsICAgICAgICAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiOi8vXCIpLFwiP1wiKSxcIj9cIiknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybF9wYXRoICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1hZnRlcignICsgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCIvXCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfZG9tYWluICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYmVmb3JlKGNvbmNhdChzdWJzdHJpbmctYWZ0ZXIoJyArXG4gICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIi9cIiksXCIvXCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfYXR0cnMgICAgICAgID0gJ0BocmVmfEBzcmMnLFxuICAgICAgeHBhdGhfbG93ZXJfY2FzZSAgICAgICA9IHhwYXRoX3RvX2xvd2VyKCksXG4gICAgICB4cGF0aF9uc191cmkgICAgICAgICAgID0gJ2FuY2VzdG9yLW9yLXNlbGY6OipbbGFzdCgpXS9AdXJsJyxcbiAgICAgIHhwYXRoX25zX3BhdGggICAgICAgICAgPSB4cGF0aF91cmxfcGF0aCh4cGF0aF91cmwoeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9oYXNfcHJvdG9jYWwgICAgID0gJyhzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcImh0dHA6Ly9cIikgb3Igc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwczovL1wiKSknLFxuICAgICAgeHBhdGhfaXNfaW50ZXJuYWwgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsKCkgKyAnLCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnKSBvciAnICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX3VybF9kb21haW4oKSwgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpKSxcbiAgICAgIHhwYXRoX2lzX2xvY2FsICAgICAgICAgPSAnKCcgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnIGFuZCBzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsKCkgKyAnLCcgKyB4cGF0aF91cmwoeHBhdGhfbnNfdXJpKSArICcpKScsXG4gICAgICB4cGF0aF9pc19wYXRoICAgICAgICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiL1wiKScsXG4gICAgICB4cGF0aF9pc19sb2NhbF9wYXRoICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJywnICsgeHBhdGhfbnNfcGF0aCArICcpJyxcbiAgICAgIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSAgPSAnbm9ybWFsaXplLXNwYWNlKCknLFxuICAgICAgeHBhdGhfaW50ZXJuYWwgICAgICAgICA9ICdbbm90KCcgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnKSBvciAnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnXScsXG4gICAgICB4cGF0aF9leHRlcm5hbCAgICAgICAgID0gJ1snICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgbm90KCcgKyB4cGF0aF9pc19pbnRlcm5hbCArICcpXScsXG4gICAgICBlc2NhcGVfbGl0ZXJhbCAgICAgICAgID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMCksXG4gICAgICBlc2NhcGVfcGFyZW5zICAgICAgICAgID0gU3RyaW5nLmZyb21DaGFyQ29kZSgzMSksXG4gICAgICByZWdleF9zdHJpbmdfbGl0ZXJhbCAgID0gLyhcIlteXCJcXHgxRV0qXCJ8J1teJ1xceDFFXSonfD1cXHMqW15cXHNcXF1cXCdcXFwiXSspL2csXG4gICAgICByZWdleF9lc2NhcGVkX2xpdGVyYWwgID0gL1snXCJdPyhcXHgxRSspWydcIl0/L2csXG4gICAgICByZWdleF9jc3Nfd3JhcF9wc2V1ZG8gID0gLyhcXHgxRlxcKXxbXlxcKV0pXFw6KGZpcnN0fGxpbWl0fGxhc3R8Z3R8bHR8ZXF8bnRoKShbXlxcLV18JCkvLFxuICAgICAgcmVnZXhfc3BlY2FsX2NoYXJzICAgICA9IC9bXFx4MUMtXFx4MUZdKy9nLFxuICAgICAgcmVnZXhfZmlyc3RfYXhpcyAgICAgICA9IC9eKFtcXHNcXChcXHgxRl0qKShcXC4/W15cXC5cXC9cXChdezEsMn1bYS16XSo6KikvLFxuICAgICAgcmVnZXhfZmlsdGVyX3ByZWZpeCAgICA9IC8oXnxcXC98XFw6KVxcWy9nLFxuICAgICAgcmVnZXhfYXR0cl9wcmVmaXggICAgICA9IC8oW15cXChcXFtcXC9cXHxcXHNcXHgxRl0pXFxAL2csXG4gICAgICByZWdleF9udGhfZXF1YXRpb24gICAgID0gL14oWy0wLTldKiluLio/KFswLTldKikkLyxcbiAgICAgIGNzc19jb21iaW5hdG9yc19yZWdleCAgPSAvXFxzKighP1srPn4sXiBdKVxccyooXFwuP1xcLyt8W2EtelxcLV0rOjopPyhbYS16XFwtXStcXCgpPygoYW5kXFxzKnxvclxccyp8bW9kXFxzKik/W14rPn4sXFxzJ1wiXFxdXFx8XFxeXFwkXFwhXFw8XFw9XFx4MUMtXFx4MUZdKyk/L2csXG4gICAgICBjc3NfY29tYmluYXRvcnNfY2FsbGJhY2sgPSBmdW5jdGlvbiAobWF0Y2gsIG9wZXJhdG9yLCBheGlzLCBmdW5jLCBsaXRlcmFsLCBleGNsdWRlLCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgdmFyIHByZWZpeCA9ICcnOyAvLyBJZiB3ZSBjYW4sIHdlJ2xsIHByZWZpeCBhICcuJ1xuXG4gICAgICAgIC8vIFhQYXRoIG9wZXJhdG9ycyBjYW4gbG9vayBsaWtlIG5vZGUtbmFtZSBzZWxlY3RvcnNcbiAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiBhbmRcIiwgXCIgb3JcIiwgXCIgbW9kXCJcbiAgICAgICAgaWYgKG9wZXJhdG9yID09PSAnICcgJiYgZXhjbHVkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGF4aXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIC8vIE9ubHkgYWxsb3cgbm9kZS1zZWxlY3RpbmcgWFBhdGggZnVuY3Rpb25zXG4gICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIGNvdW50KC4uLilcIiwgXCIgY291bnQoLi4uKVwiLCBcIiA+IHBvc2l0aW9uKClcIiwgZXRjLlxuICAgICAgICAgIGlmIChmdW5jICE9PSB1bmRlZmluZWQgJiYgKGZ1bmMgIT09ICdub2RlKCcgJiYgZnVuYyAhPT0gJ3RleHQoJyAmJiBmdW5jICE9PSAnY29tbWVudCgnKSkgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGl0ZXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gZnVuYztcbiAgICAgICAgICB9IC8vIEhhbmRsZSBjYXNlIFwiICsgdGV4dCgpXCIsIFwiID4gY29tbWVudCgpXCIsIGV0Yy4gd2hlcmUgXCJmdW5jXCIgaXMgb3VyIFwibGl0ZXJhbFwiXG5cbiAgICAgICAgICAgIC8vIFhQYXRoIG1hdGggb3BlcmF0b3JzIG1hdGNoIHNvbWUgQ1NTIGNvbWJpbmF0b3JzXG4gICAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgZm9yIFwiICsgMVwiLCBcIiA+IDFcIiwgZXRjLlxuICAgICAgICAgIGlmIChpc051bWVyaWMobGl0ZXJhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJygnIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICd8JyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnOicpIHtcbiAgICAgICAgICAgIHByZWZpeCA9ICcuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gaWYgd2UgZG9uJ3QgaGF2ZSBhIHNlbGVjdG9yIHRvIGZvbGxvdyB0aGUgYXhpc1xuICAgICAgICBpZiAobGl0ZXJhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9mZnNldCArIG1hdGNoLmxlbmd0aCA9PT0gb3JpZy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxpdGVyYWwgPSAnKic7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgcmV0dXJuICcvLycgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICByZXR1cm4gJy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgcmV0dXJuIHByZWZpeCArICcvZm9sbG93aW5nLXNpYmxpbmc6OipbMV0vc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnLCc6XG4gICAgICAgICAgaWYgKGF4aXMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgfVxuICAgICAgICAgIGF4aXMgPSAnLi8vJztcbiAgICAgICAgICByZXR1cm4gJ3wnICsgYXhpcyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJ14nOiAvLyBmaXJzdCBjaGlsZFxuICAgICAgICAgIHJldHVybiAnL2NoaWxkOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchXic6IC8vIGxhc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KltsYXN0KCldL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchICc6IC8vIGFuY2VzdG9yLW9yLXNlbGZcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvci1vci1zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIT4nOiAvLyBkaXJlY3QgcGFyZW50XG4gICAgICAgICAgcmV0dXJuICcvcGFyZW50OjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISsnOiAvLyBhZGphY2VudCBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchfic6IC8vIHByZWNlZGluZyBzaWJsaW5nXG4gICAgICAgICAgcmV0dXJuICcvcHJlY2VkaW5nLXNpYmxpbmc6OicgKyBsaXRlcmFsO1xuICAgICAgICAgICAgLy8gY2FzZSAnfn4nXG4gICAgICAgICAgICAvLyByZXR1cm4gJy9mb2xsb3dpbmctc2libGluZzo6Ki9zZWxmOjp8JytzZWxlY3RvclN0YXJ0KG9yaWcsIG9mZnNldCkrJy9wcmVjZWRpbmctc2libGluZzo6Ki9zZWxmOjonK2xpdGVyYWw7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGNzc19hdHRyaWJ1dGVzX3JlZ2V4ID0gL1xcWyhbXlxcXVxcQFxcfFxcKlxcPVxcXlxcflxcJFxcIVxcKFxcL1xcc1xceDFDLVxceDFGXSspXFxzKigoW1xcfFxcKlxcflxcXlxcJFxcIV0/KT0/XFxzKihcXHgxRSspKT9cXF0vZyxcbiAgICAgIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrID0gZnVuY3Rpb24gKHN0ciwgYXR0ciwgY29tcCwgb3AsIHZhbCwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBheGlzID0gJyc7XG4gICAgICAgIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldCAtIDEpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChwcmV2Q2hhciA9PT0gJy8nIHx8IC8vIGZvdW5kIGFmdGVyIGFuIGF4aXMgc2hvcnRjdXQgKFwiL1wiLCBcIi8vXCIsIGV0Yy4pXG4gICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSAgIC8vIGZvdW5kIGFmdGVyIGFuIGF4aXMgKFwic2VsZjo6XCIsIFwicGFyZW50OjpcIiwgZXRjLilcbiAgICAgICAgICAgIGF4aXMgPSAnKic7Ki9cblxuICAgICAgICBzd2l0Y2ggKG9wKSB7XG4gICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tub3QoQCcgKyBhdHRyICsgJykgb3IgQCcgKyBhdHRyICsgJyE9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIGNhc2UgJyQnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tzdWJzdHJpbmcoQCcgKyBhdHRyICsgJyxzdHJpbmctbGVuZ3RoKEAnICsgYXR0ciArICcpLShzdHJpbmctbGVuZ3RoKFwiJyArIHZhbCArICdcIiktMSkpPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3RhcnRzLXdpdGgoQCcgKyBhdHRyICsgJyxcIicgKyB2YWwgKyAnXCIpXSc7XG4gICAgICAgIGNhc2UgJ34nOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEAnICsgYXR0ciArICcpLFwiIFwiKSxjb25jYXQoXCIgXCIsXCInICsgdmFsICsgJ1wiLFwiIFwiKSldJztcbiAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQCcgKyBhdHRyICsgJz1cIicgKyB2YWwgKyAnXCIgb3Igc3RhcnRzLXdpdGgoQCcgKyBhdHRyICsgJyxjb25jYXQoXCInICsgdmFsICsgJ1wiLFwiLVwiKSldJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoY29tcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoYXR0ci5jaGFyQXQoYXR0ci5sZW5ndGggLSAxKSA9PT0gJygnIHx8IGF0dHIuc2VhcmNoKC9eWzAtOV0rJC8pICE9PSAtMSB8fCBhdHRyLmluZGV4T2YoJzonKSAhPT0gLTEpICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICddJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXggPSAvOihbYS16XFwtXSspKFxcKChcXHgxRispKChbXlxceDFGXSsoXFwzXFx4MUYrKT8pKikoXFwzXFwpKSk/L2csXG4gICAgICBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2sgPSBmdW5jdGlvbiAobWF0Y2gsIG5hbWUsIGcxLCBnMiwgYXJnLCBnMywgZzQsIGc1LCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgaWYgKG9yaWcuY2hhckF0KG9mZnNldCAtIDEpID09PSAnOicgJiYgb3JpZy5jaGFyQXQob2Zmc2V0IC0gMikgIT09ICc6Jykge1xuICAgICAgICAgICAgLy8gWFBhdGggXCJheGlzOjpub2RlLW5hbWVcIiB3aWxsIG1hdGNoXG4gICAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgXCI6bm9kZS1uYW1lXCJcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSA9PT0gJ29kZCcgfHwgbmFtZSA9PT0gJ2V2ZW4nKSB7XG4gICAgICAgICAgYXJnICA9IG5hbWU7XG4gICAgICAgICAgbmFtZSA9ICdudGgtb2YtdHlwZSc7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKG5hbWUpIHsgLy8gbmFtZS50b0xvd2VyQ2FzZSgpP1xuICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdhZnRlci1zaWJsaW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdmb2xsb3dpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZS1zaWJsaW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdmb2xsb3dpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnY2hlY2tlZCc6XG4gICAgICAgICAgcmV0dXJuICdbQHNlbGVjdGVkIG9yIEBjaGVja2VkXSc7XG4gICAgICAgIGNhc2UgJ2NvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb250YWlucygnICsgeHBhdGhfbm9ybWFsaXplX3NwYWNlICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAnaWNvbnRhaW5zJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb250YWlucygnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KCopIGFuZCBub3Qobm9ybWFsaXplLXNwYWNlKCkpXSc7XG4gICAgICAgIGNhc2UgJ2VuYWJsZWQnOlxuICAgICAgICBjYXNlICdkaXNhYmxlZCc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBjYXNlICdmaXJzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdmaXJzdCc6XG4gICAgICAgIGNhc2UgJ2xpbWl0JzpcbiAgICAgICAgY2FzZSAnZmlyc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKTw9JyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbMV0nO1xuICAgICAgICBjYXNlICdndCc6XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+JyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICBjYXNlICdsdCc6XG4gICAgICAgICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8JyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICBjYXNlICdsYXN0LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KikgYW5kIG5vdChmb2xsb3dpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnb25seS1vZi10eXBlJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OipbbmFtZSgpPW5hbWUoc2VsZjo6bm9kZSgpKV0pIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OipbbmFtZSgpPW5hbWUoc2VsZjo6bm9kZSgpKV0pXSc7XG4gICAgICAgIGNhc2UgJ250aC1jaGlsZCc6XG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSA9ICcgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnZXZlbic6XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpIG1vZCAyPTBdJztcbiAgICAgICAgICBjYXNlICdvZGQnOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0xXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpPj0nICsgYVsxXSArICcgYW5kICgoY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdudGgtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3dpdGNoIChhcmcpIHtcbiAgICAgICAgICBjYXNlICdvZGQnOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0xXSc7XG4gICAgICAgICAgY2FzZSAnZXZlbic6XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpIG1vZCAyPTAgYW5kIHBvc2l0aW9uKCk+PTBdJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIGEgPSAoYXJnIHx8ICcwJykucmVwbGFjZShyZWdleF9udGhfZXF1YXRpb24sICckMSskMicpLnNwbGl0KCcrJyk7XG5cbiAgICAgICAgICAgIGFbMF0gPSBhWzBdIHx8ICcxJztcbiAgICAgICAgICAgIGFbMV0gPSBhWzFdIHx8ICcwJztcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+PScgKyBhWzFdICsgJyBhbmQgKHBvc2l0aW9uKCktJyArIGFbMV0gKyAnKSBtb2QgJyArIGFbMF0gKyAnPTBdJztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ2VxJzpcbiAgICAgICAgY2FzZSAnbnRoJzpcbiAgICAgICAgICAvLyBQb3NpdGlvbiBzdGFydHMgYXQgMCBmb3IgY29uc2lzdGVuY3kgd2l0aCBTaXp6bGUgc2VsZWN0b3JzXG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhhcmcpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgKHBhcnNlSW50KGFyZywgMTApICsgMSkgKyAnXSc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuICdbMV0nO1xuICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICByZXR1cm4gJ1tAdHlwZT1cInRleHRcIl0nO1xuICAgICAgICBjYXNlICdpc3RhcnRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF9sb3dlcl9jYXNlICsgJywnICsgeHBhdGhfdG9fbG93ZXIoYXJnKSArICcpXSc7XG4gICAgICAgIGNhc2UgJ3N0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbm9ybWFsaXplX3NwYWNlICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAnaWVuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9sb3dlcl9jYXNlLCB4cGF0aF90b19sb3dlcihhcmcpKSArICddJztcbiAgICAgICAgY2FzZSAnZW5kcy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1snICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX25vcm1hbGl6ZV9zcGFjZSwgYXJnKSArICddJztcbiAgICAgICAgY2FzZSAnaGFzJzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBwcmVwZW5kQXhpcyhjc3MyeHBhdGgoYXJnLCB0cnVlKSwgJy4vLycpO1xuXG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIHhwYXRoICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1zaWJsaW5nJzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBjc3MyeHBhdGgoJ3ByZWNlZGluZy1zaWJsaW5nOjonICsgYXJnLCB0cnVlKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMCBvciBjb3VudChmb2xsb3dpbmctc2libGluZzo6JyArIHhwYXRoLnN1YnN0cigxOSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLXBhcmVudCc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncGFyZW50OjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtYW5jZXN0b3InOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ2FuY2VzdG9yOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdsYXN0JzpcbiAgICAgICAgY2FzZSAnbGFzdC1vZi10eXBlJzpcbiAgICAgICAgICBpZiAoYXJnICE9PSB1bmRlZmluZWQpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPmxhc3QoKS0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tsYXN0KCldJztcbiAgICAgICAgY2FzZSAnc2VsZWN0ZWQnOiAvLyBTaXp6bGU6IFwiKG9wdGlvbikgZWxlbWVudHMgdGhhdCBhcmUgY3VycmVudGx5IHNlbGVjdGVkXCJcbiAgICAgICAgICByZXR1cm4gJ1tsb2NhbC1uYW1lKCk9XCJvcHRpb25cIiBhbmQgQHNlbGVjdGVkXSc7XG4gICAgICAgIGNhc2UgJ3NraXAnOlxuICAgICAgICBjYXNlICdza2lwLWZpcnN0JzpcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyBhcmcgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3NraXAtbGFzdCc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbbGFzdCgpLXBvc2l0aW9uKCk+PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8bGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnL2FuY2VzdG9yOjpbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3JhbmdlJzpcbiAgICAgICAgICB2YXIgYXJyID0gYXJnLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICByZXR1cm4gJ1snICsgYXJyWzBdICsgJzw9cG9zaXRpb24oKSBhbmQgcG9zaXRpb24oKTw9JyArIGFyclsxXSArICddJztcbiAgICAgICAgY2FzZSAnaW5wdXQnOiAvLyBTaXp6bGU6IFwiaW5wdXQsIGJ1dHRvbiwgc2VsZWN0LCBhbmQgdGV4dGFyZWEgYXJlIGFsbCBjb25zaWRlcmVkIHRvIGJlIGlucHV0IGVsZW1lbnRzLlwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwiaW5wdXRcIiBvciBsb2NhbC1uYW1lKCk9XCJidXR0b25cIiBvciBsb2NhbC1uYW1lKCk9XCJzZWxlY3RcIiBvciBsb2NhbC1uYW1lKCk9XCJ0ZXh0YXJlYVwiXSc7XG4gICAgICAgIGNhc2UgJ2ludGVybmFsJzpcbiAgICAgICAgICByZXR1cm4geHBhdGhfaW50ZXJuYWw7XG4gICAgICAgIGNhc2UgJ2V4dGVybmFsJzpcbiAgICAgICAgICByZXR1cm4geHBhdGhfZXh0ZXJuYWw7XG4gICAgICAgIGNhc2UgJ2h0dHAnOlxuICAgICAgICBjYXNlICdodHRwcyc6XG4gICAgICAgIGNhc2UgJ21haWx0byc6XG4gICAgICAgIGNhc2UgJ2phdmFzY3JpcHQnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKEBocmVmLGNvbmNhdChcIicgKyBuYW1lICsgJ1wiLFwiOlwiKSldJztcbiAgICAgICAgY2FzZSAnZG9tYWluJzpcbiAgICAgICAgICByZXR1cm4gJ1soc3RyaW5nLWxlbmd0aCgnICsgeHBhdGhfdXJsX2RvbWFpbigpICsgJyk9MCBhbmQgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSArICcsJyArIGFyZyArICcpKSBvciBjb250YWlucygnICsgeHBhdGhfdXJsX2RvbWFpbigpICsgJywnICsgYXJnICsgJyldJztcbiAgICAgICAgY2FzZSAncGF0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9wYXRoKCkgKyAnLHN1YnN0cmluZy1hZnRlcihcIicgKyBhcmcgKyAnXCIsXCIvXCIpKV0nXG4gICAgICAgIGNhc2UgJ25vdCc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICBpZiAoeHBhdGguY2hhckF0KDApID09PSAnWycpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICB4cGF0aCA9ICdzZWxmOjpub2RlKCknICsgeHBhdGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW25vdCgnICsgeHBhdGggKyAnKV0nO1xuICAgICAgICBjYXNlICd0YXJnZXQnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKEBocmVmLCBcIiNcIildJztcbiAgICAgICAgY2FzZSAncm9vdCc6XG4gICAgICAgICAgcmV0dXJuICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0nO1xuICAgICAgICAgICAgLyogY2FzZSAnYWN0aXZlJzpcbiAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzpcbiAgICAgICAgICAgIGNhc2UgJ2hvdmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2xpbmsnOlxuICAgICAgICAgICAgY2FzZSAndmlzaXRlZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnOyovXG4gICAgICAgIGNhc2UgJ2xhbmcnOlxuICAgICAgICAgIHJldHVybiAnW0BsYW5nPVwiJyArIGFyZyArICdcIl0nO1xuICAgICAgICBjYXNlICdyZWFkLW9ubHknOlxuICAgICAgICBjYXNlICdyZWFkLXdyaXRlJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUucmVwbGFjZSgnLScsICcnKSArICddJztcbiAgICAgICAgY2FzZSAndmFsaWQnOlxuICAgICAgICBjYXNlICdyZXF1aXJlZCc6XG4gICAgICAgIGNhc2UgJ2luLXJhbmdlJzpcbiAgICAgICAgY2FzZSAnb3V0LW9mLXJhbmdlJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUgKyAnXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfaWRzX2NsYXNzZXNfcmVnZXggPSAvKCN8XFwuKShbXlxcI1xcQFxcLlxcL1xcKFxcW1xcKVxcXVxcfFxcOlxcc1xcK1xcPlxcPFxcJ1xcXCJcXHgxRC1cXHgxRl0rKS9nLFxuICAgICAgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKHN0ciwgb3AsIHZhbCwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBheGlzID0gJyc7XG4gICAgICAgIC8qIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldC0xKTtcbiAgICAgICAgaWYgKHByZXZDaGFyLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICcvJyB8fFxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJylcbiAgICAgICAgICAgIGF4aXMgPSAnKic7XG4gICAgICAgIGVsc2UgaWYgKHByZXZDaGFyID09PSAnOicpXG4gICAgICAgICAgICBheGlzID0gJ25vZGUoKSc7Ki9cbiAgICAgICAgaWYgKG9wID09PSAnIycpICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAaWQ9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKGNvbmNhdChcIiBcIixub3JtYWxpemUtc3BhY2UoQGNsYXNzKSxcIiBcIiksXCIgJyArIHZhbCArICcgXCIpXSc7XG4gICAgICB9O1xuXG4gICAgLy8gUHJlcGVuZCBkZXNjZW5kYW50LW9yLXNlbGYgaWYgbm8gb3RoZXIgYXhpcyBpcyBzcGVjaWZpZWRcbiAgZnVuY3Rpb24gcHJlcGVuZEF4aXMocywgYXhpcykge1xuICAgIHJldHVybiBzLnJlcGxhY2UocmVnZXhfZmlyc3RfYXhpcywgZnVuY3Rpb24gKG1hdGNoLCBzdGFydCwgbGl0ZXJhbCkge1xuICAgICAgaWYgKGxpdGVyYWwuc3Vic3RyKGxpdGVyYWwubGVuZ3RoIC0gMikgPT09ICc6OicpIC8vIEFscmVhZHkgaGFzIGF4aXM6OlxuICAgICAgICAgICAge1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChsaXRlcmFsLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgIHtcbiAgICAgICAgYXhpcyArPSAnKic7XG4gICAgICB9XG4gICAgICAgIC8vIGVsc2UgaWYgKGF4aXMuY2hhckF0KGF4aXMubGVuZ3RoLTEpID09PSAnKScpXG4gICAgICAgIC8vICAgIGF4aXMgKz0gJy8nO1xuICAgICAgcmV0dXJuIHN0YXJ0ICsgYXhpcyArIGxpdGVyYWw7XG4gICAgfSk7XG4gIH1cblxuICAgIC8vIEZpbmQgdGhlIGJlZ2luaW5nIG9mIHRoZSBzZWxlY3Rvciwgc3RhcnRpbmcgYXQgaSBhbmQgd29ya2luZyBiYWNrd2FyZHNcbiAgZnVuY3Rpb24gc2VsZWN0b3JTdGFydChzLCBpKSB7XG4gICAgdmFyIGRlcHRoID0gMDtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIHN3aXRjaCAocy5jaGFyQXQoaSkpIHtcbiAgICAgIGNhc2UgJyAnOlxuICAgICAgY2FzZSBlc2NhcGVfcGFyZW5zOlxuICAgICAgICBvZmZzZXQrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdbJzpcbiAgICAgIGNhc2UgJygnOlxuICAgICAgICBkZXB0aC0tO1xuXG4gICAgICAgIGlmIChkZXB0aCA8IDApICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuICsraSArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ10nOlxuICAgICAgY2FzZSAnKSc6XG4gICAgICAgIGRlcHRoKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnLCc6XG4gICAgICBjYXNlICd8JzpcbiAgICAgICAgaWYgKGRlcHRoID09PSAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG9mZnNldCA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAgIC8vIENoZWNrIGlmIHN0cmluZyBpcyBudW1lcmljXG4gIGZ1bmN0aW9uIGlzTnVtZXJpYyhzKSB7XG4gICAgdmFyIG51bSA9IHBhcnNlSW50KHMsIDEwKTtcblxuICAgIHJldHVybiAoIWlzTmFOKG51bSkgJiYgJycgKyBudW0gPT09IHMpO1xuICB9XG5cbiAgICAvLyBBcHBlbmQgZXNjYXBlIFwiY2hhclwiIHRvIFwib3BlblwiIG9yIFwiY2xvc2VcIlxuICBmdW5jdGlvbiBlc2NhcGVDaGFyKHMsIG9wZW4sIGNsb3NlLCBjaGFyKSB7XG4gICAgdmFyIGRlcHRoID0gMDtcblxuICAgIHJldHVybiBzLnJlcGxhY2UobmV3IFJlZ0V4cCgnW1xcXFwnICsgb3BlbiArICdcXFxcJyArIGNsb3NlICsgJ10nLCAnZycpLCBmdW5jdGlvbiAoYSkge1xuICAgICAgaWYgKGEgPT09IG9wZW4pICAgICAgICAgICAge1xuICAgICAgICBkZXB0aCsrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYSA9PT0gb3Blbikge1xuICAgICAgICByZXR1cm4gYSArIHJlcGVhdChjaGFyLCBkZXB0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVwZWF0KGNoYXIsIGRlcHRoLS0pICsgYTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gcmVwZWF0KHN0ciwgbnVtKSB7XG4gICAgbnVtID0gTnVtYmVyKG51bSk7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChudW0gJiAxKSAgICAgICAgICAgIHtcbiAgICAgICAgcmVzdWx0ICs9IHN0cjtcbiAgICAgIH1cbiAgICAgIG51bSA+Pj49IDE7XG5cbiAgICAgIGlmIChudW0gPD0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN0ciArPSBzdHI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbnZlcnRFc2NhcGluZyAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvXFxcXChbYFxcXFwvOlxcPyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dKS9nLCAnJDEnKVxuICAgICAgLnJlcGxhY2UoL1xcXFwoWydcIl0pL2csICckMSQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcQSAvZywgJ1xcbicpXG4gIH1cblxuICBmdW5jdGlvbiBjc3MyeHBhdGgocywgbmVzdGVkKSB7XG4gICAgLy8gcyA9IHMudHJpbSgpO1xuXG4gICAgaWYgKG5lc3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBSZXBsYWNlIDpwc2V1ZG8tY2xhc3Nlc1xuICAgICAgcyA9IHMucmVwbGFjZShjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXgsIGNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSAjaWRzIGFuZCAuY2xhc3Nlc1xuICAgICAgcyA9IHMucmVwbGFjZShjc3NfaWRzX2NsYXNzZXNfcmVnZXgsIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIC8vIFRhZyBvcGVuIGFuZCBjbG9zZSBwYXJlbnRoZXNpcyBwYWlycyAoZm9yIFJlZ0V4cCBzZWFyY2hlcylcbiAgICBzID0gZXNjYXBlQ2hhcihzLCAnKCcsICcpJywgZXNjYXBlX3BhcmVucyk7XG5cbiAgICAvLyBSZW1vdmUgYW5kIHNhdmUgYW55IHN0cmluZyBsaXRlcmFsc1xuICAgIHZhciBsaXRlcmFscyA9IFtdO1xuXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9zdHJpbmdfbGl0ZXJhbCwgZnVuY3Rpb24gKHMsIGEpIHtcbiAgICAgIGlmIChhLmNoYXJBdCgwKSA9PT0gJz0nKSB7XG4gICAgICAgIGEgPSBhLnN1YnN0cigxKS50cmltKCk7XG5cbiAgICAgICAgaWYgKGlzTnVtZXJpYyhhKSkgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSwgYS5sZW5ndGggLSAyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlcGVhdChlc2NhcGVfbGl0ZXJhbCwgbGl0ZXJhbHMucHVzaChjb252ZXJ0RXNjYXBpbmcoYSkpKTtcbiAgICB9KTtcblxuICAgIC8vIFJlcGxhY2UgQ1NTIGNvbWJpbmF0b3JzIChcIiBcIiwgXCIrXCIsIFwiPlwiLCBcIn5cIiwgXCIsXCIpIGFuZCByZXZlcnNlIGNvbWJpbmF0b3JzIChcIiFcIiwgXCIhK1wiLCBcIiE+XCIsIFwiIX5cIilcbiAgICBzID0gcy5yZXBsYWNlKGNzc19jb21iaW5hdG9yc19yZWdleCwgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgQ1NTIGF0dHJpYnV0ZSBmaWx0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShjc3NfYXR0cmlidXRlc19yZWdleCwgY3NzX2F0dHJpYnV0ZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gV3JhcCBjZXJ0YWluIDpwc2V1ZG8tY2xhc3NlcyBpbiBwYXJlbnMgKHRvIGNvbGxlY3Qgbm9kZS1zZXRzKVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgaW5kZXggPSBzLnNlYXJjaChyZWdleF9jc3Nfd3JhcF9wc2V1ZG8pO1xuXG4gICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggPSBzLmluZGV4T2YoJzonLCBpbmRleCk7XG4gICAgICB2YXIgc3RhcnQgPSBzZWxlY3RvclN0YXJ0KHMsIGluZGV4KTtcblxuICAgICAgcyA9IHMuc3Vic3RyKDAsIHN0YXJ0KSArXG4gICAgICAgICAgICAnKCcgKyBzLnN1YnN0cmluZyhzdGFydCwgaW5kZXgpICsgJyknICtcbiAgICAgICAgICAgIHMuc3Vic3RyKGluZGV4KTtcbiAgICB9XG5cbiAgICAvLyBSZXBsYWNlIDpwc2V1ZG8tY2xhc3Nlc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVwbGFjZSAjaWRzIGFuZCAuY2xhc3Nlc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVzdG9yZSB0aGUgc2F2ZWQgc3RyaW5nIGxpdGVyYWxzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9lc2NhcGVkX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICB2YXIgc3RyID0gbGl0ZXJhbHNbYS5sZW5ndGggLSAxXTtcblxuICAgICAgcmV0dXJuICdcIicgKyBzdHIgKyAnXCInO1xuICAgIH0pXG5cbiAgICAvLyBSZW1vdmUgYW55IHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3BlY2FsX2NoYXJzLCAnJyk7XG5cbiAgICAvLyBhZGQgKiB0byBzdGFuZC1hbG9uZSBmaWx0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9maWx0ZXJfcHJlZml4LCAnJDEqWycpO1xuXG4gICAgLy8gYWRkIFwiL1wiIGJldHdlZW4gQGF0dHJpYnV0ZSBzZWxlY3RvcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X2F0dHJfcHJlZml4LCAnJDEvQCcpO1xuXG4gICAgLypcbiAgICBDb21iaW5lIG11bHRpcGxlIGZpbHRlcnM/XG5cbiAgICBzID0gZXNjYXBlQ2hhcihzLCAnWycsICddJywgZmlsdGVyX2NoYXIpO1xuICAgIHMgPSBzLnJlcGxhY2UoLyhcXHgxRCspXFxdXFxbXFwxKC4rP1teXFx4MURdKVxcMVxcXS9nLCAnIGFuZCAoJDIpJDFdJylcbiAgICAqL1xuXG4gICAgcyA9IHByZXBlbmRBeGlzKHMsICcuLy8nKTsgLy8gcHJlcGVuZCBcIi4vL1wiIGF4aXMgdG8gYmVnaW5pbmcgb2YgQ1NTIHNlbGVjdG9yXG4gICAgcmV0dXJuIHM7XG4gIH1cblxuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBjc3MyeHBhdGg7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LmNzczJ4cGF0aCA9IGNzczJ4cGF0aDtcbiAgfVxuXG59KSgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9jc3MyeHBhdGgvaW5kZXguanMiLCIvKiFcbiAqIFNpenpsZSBDU1MgU2VsZWN0b3IgRW5naW5lIHYyLjMuNlxuICogaHR0cHM6Ly9zaXp6bGVqcy5jb20vXG4gKlxuICogQ29weXJpZ2h0IEpTIEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2pzLmZvdW5kYXRpb24vXG4gKlxuICogRGF0ZTogMjAyMS0wMi0xNlxuICovXG4oIGZ1bmN0aW9uKCB3aW5kb3cgKSB7XG52YXIgaSxcblx0c3VwcG9ydCxcblx0RXhwcixcblx0Z2V0VGV4dCxcblx0aXNYTUwsXG5cdHRva2VuaXplLFxuXHRjb21waWxlLFxuXHRzZWxlY3QsXG5cdG91dGVybW9zdENvbnRleHQsXG5cdHNvcnRJbnB1dCxcblx0aGFzRHVwbGljYXRlLFxuXG5cdC8vIExvY2FsIGRvY3VtZW50IHZhcnNcblx0c2V0RG9jdW1lbnQsXG5cdGRvY3VtZW50LFxuXHRkb2NFbGVtLFxuXHRkb2N1bWVudElzSFRNTCxcblx0cmJ1Z2d5UVNBLFxuXHRyYnVnZ3lNYXRjaGVzLFxuXHRtYXRjaGVzLFxuXHRjb250YWlucyxcblxuXHQvLyBJbnN0YW5jZS1zcGVjaWZpYyBkYXRhXG5cdGV4cGFuZG8gPSBcInNpenpsZVwiICsgMSAqIG5ldyBEYXRlKCksXG5cdHByZWZlcnJlZERvYyA9IHdpbmRvdy5kb2N1bWVudCxcblx0ZGlycnVucyA9IDAsXG5cdGRvbmUgPSAwLFxuXHRjbGFzc0NhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0dG9rZW5DYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdGNvbXBpbGVyQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRub25uYXRpdmVTZWxlY3RvckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0c29ydE9yZGVyID0gZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHR9XG5cdFx0cmV0dXJuIDA7XG5cdH0sXG5cblx0Ly8gSW5zdGFuY2UgbWV0aG9kc1xuXHRoYXNPd24gPSAoIHt9ICkuaGFzT3duUHJvcGVydHksXG5cdGFyciA9IFtdLFxuXHRwb3AgPSBhcnIucG9wLFxuXHRwdXNoTmF0aXZlID0gYXJyLnB1c2gsXG5cdHB1c2ggPSBhcnIucHVzaCxcblx0c2xpY2UgPSBhcnIuc2xpY2UsXG5cblx0Ly8gVXNlIGEgc3RyaXBwZWQtZG93biBpbmRleE9mIGFzIGl0J3MgZmFzdGVyIHRoYW4gbmF0aXZlXG5cdC8vIGh0dHBzOi8vanNwZXJmLmNvbS90aG9yLWluZGV4b2YtdnMtZm9yLzVcblx0aW5kZXhPZiA9IGZ1bmN0aW9uKCBsaXN0LCBlbGVtICkge1xuXHRcdHZhciBpID0gMCxcblx0XHRcdGxlbiA9IGxpc3QubGVuZ3RoO1xuXHRcdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0aWYgKCBsaXN0WyBpIF0gPT09IGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gLTE7XG5cdH0sXG5cblx0Ym9vbGVhbnMgPSBcImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxcIiArXG5cdFx0XCJpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsXG5cblx0Ly8gUmVndWxhciBleHByZXNzaW9uc1xuXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtc2VsZWN0b3JzLyN3aGl0ZXNwYWNlXG5cdHdoaXRlc3BhY2UgPSBcIltcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdXCIsXG5cblx0Ly8gaHR0cHM6Ly93d3cudzMub3JnL1RSL2Nzcy1zeW50YXgtMy8jaWRlbnQtdG9rZW4tZGlhZ3JhbVxuXHRpZGVudGlmaWVyID0gXCIoPzpcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCI/fFxcXFxcXFxcW15cXFxcclxcXFxuXFxcXGZdfFtcXFxcdy1dfFteXFwwLVxcXFx4N2ZdKStcIixcblxuXHQvLyBBdHRyaWJ1dGUgc2VsZWN0b3JzOiBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2F0dHJpYnV0ZS1zZWxlY3RvcnNcblx0YXR0cmlidXRlcyA9IFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XCIgKyB3aGl0ZXNwYWNlICtcblxuXHRcdC8vIE9wZXJhdG9yIChjYXB0dXJlIDIpXG5cdFx0XCIqKFsqXiR8IX5dPz0pXCIgKyB3aGl0ZXNwYWNlICtcblxuXHRcdC8vIFwiQXR0cmlidXRlIHZhbHVlcyBtdXN0IGJlIENTUyBpZGVudGlmaWVycyBbY2FwdHVyZSA1XVxuXHRcdC8vIG9yIHN0cmluZ3MgW2NhcHR1cmUgMyBvciBjYXB0dXJlIDRdXCJcblx0XHRcIiooPzonKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCJ8KFwiICsgaWRlbnRpZmllciArIFwiKSl8KVwiICtcblx0XHR3aGl0ZXNwYWNlICsgXCIqXFxcXF1cIixcblxuXHRwc2V1ZG9zID0gXCI6KFwiICsgaWRlbnRpZmllciArIFwiKSg/OlxcXFwoKFwiICtcblxuXHRcdC8vIFRvIHJlZHVjZSB0aGUgbnVtYmVyIG9mIHNlbGVjdG9ycyBuZWVkaW5nIHRva2VuaXplIGluIHRoZSBwcmVGaWx0ZXIsIHByZWZlciBhcmd1bWVudHM6XG5cdFx0Ly8gMS4gcXVvdGVkIChjYXB0dXJlIDM7IGNhcHR1cmUgNCBvciBjYXB0dXJlIDUpXG5cdFx0XCIoJygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwiKXxcIiArXG5cblx0XHQvLyAyLiBzaW1wbGUgKGNhcHR1cmUgNilcblx0XHRcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXCgpW1xcXFxdXXxcIiArIGF0dHJpYnV0ZXMgKyBcIikqKXxcIiArXG5cblx0XHQvLyAzLiBhbnl0aGluZyBlbHNlIChjYXB0dXJlIDIpXG5cdFx0XCIuKlwiICtcblx0XHRcIilcXFxcKXwpXCIsXG5cblx0Ly8gTGVhZGluZyBhbmQgbm9uLWVzY2FwZWQgdHJhaWxpbmcgd2hpdGVzcGFjZSwgY2FwdHVyaW5nIHNvbWUgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVycyBwcmVjZWRpbmcgdGhlIGxhdHRlclxuXHRyd2hpdGVzcGFjZSA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcIitcIiwgXCJnXCIgKSxcblx0cnRyaW0gPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIgK1xuXHRcdHdoaXRlc3BhY2UgKyBcIiskXCIsIFwiZ1wiICksXG5cblx0cmNvbW1hID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqLFwiICsgd2hpdGVzcGFjZSArIFwiKlwiICksXG5cdHJjb21iaW5hdG9ycyA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKihbPit+XXxcIiArIHdoaXRlc3BhY2UgKyBcIilcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFwiKlwiICksXG5cdHJkZXNjZW5kID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwifD5cIiApLFxuXG5cdHJwc2V1ZG8gPSBuZXcgUmVnRXhwKCBwc2V1ZG9zICksXG5cdHJpZGVudGlmaWVyID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBpZGVudGlmaWVyICsgXCIkXCIgKSxcblxuXHRtYXRjaEV4cHIgPSB7XG5cdFx0XCJJRFwiOiBuZXcgUmVnRXhwKCBcIl4jKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJDTEFTU1wiOiBuZXcgUmVnRXhwKCBcIl5cXFxcLihcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiVEFHXCI6IG5ldyBSZWdFeHAoIFwiXihcIiArIGlkZW50aWZpZXIgKyBcInxbKl0pXCIgKSxcblx0XHRcIkFUVFJcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBhdHRyaWJ1dGVzICksXG5cdFx0XCJQU0VVRE9cIjogbmV3IFJlZ0V4cCggXCJeXCIgKyBwc2V1ZG9zICksXG5cdFx0XCJDSElMRFwiOiBuZXcgUmVnRXhwKCBcIl46KG9ubHl8Zmlyc3R8bGFzdHxudGh8bnRoLWxhc3QpLShjaGlsZHxvZi10eXBlKSg/OlxcXFwoXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86KFsrLV18KVwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooXFxcXGQrKXwpKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfClcIiwgXCJpXCIgKSxcblx0XHRcImJvb2xcIjogbmV3IFJlZ0V4cCggXCJeKD86XCIgKyBib29sZWFucyArIFwiKSRcIiwgXCJpXCIgKSxcblxuXHRcdC8vIEZvciB1c2UgaW4gbGlicmFyaWVzIGltcGxlbWVudGluZyAuaXMoKVxuXHRcdC8vIFdlIHVzZSB0aGlzIGZvciBQT1MgbWF0Y2hpbmcgaW4gYHNlbGVjdGBcblx0XHRcIm5lZWRzQ29udGV4dFwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIiooKD86LVxcXFxkKT9cXFxcZCopXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KSg/PVteLV18JClcIiwgXCJpXCIgKVxuXHR9LFxuXG5cdHJodG1sID0gL0hUTUwkL2ksXG5cdHJpbnB1dHMgPSAvXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFxuXHRyaGVhZGVyID0gL15oXFxkJC9pLFxuXG5cdHJuYXRpdmUgPSAvXltee10rXFx7XFxzKlxcW25hdGl2ZSBcXHcvLFxuXG5cdC8vIEVhc2lseS1wYXJzZWFibGUvcmV0cmlldmFibGUgSUQgb3IgVEFHIG9yIENMQVNTIHNlbGVjdG9yc1xuXHRycXVpY2tFeHByID0gL14oPzojKFtcXHctXSspfChcXHcrKXxcXC4oW1xcdy1dKykpJC8sXG5cblx0cnNpYmxpbmcgPSAvWyt+XS8sXG5cblx0Ly8gQ1NTIGVzY2FwZXNcblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvQ1NTMjEvc3luZGF0YS5odG1sI2VzY2FwZWQtY2hhcmFjdGVyc1xuXHRydW5lc2NhcGUgPSBuZXcgUmVnRXhwKCBcIlxcXFxcXFxcW1xcXFxkYS1mQS1GXXsxLDZ9XCIgKyB3aGl0ZXNwYWNlICsgXCI/fFxcXFxcXFxcKFteXFxcXHJcXFxcblxcXFxmXSlcIiwgXCJnXCIgKSxcblx0ZnVuZXNjYXBlID0gZnVuY3Rpb24oIGVzY2FwZSwgbm9uSGV4ICkge1xuXHRcdHZhciBoaWdoID0gXCIweFwiICsgZXNjYXBlLnNsaWNlKCAxICkgLSAweDEwMDAwO1xuXG5cdFx0cmV0dXJuIG5vbkhleCA/XG5cblx0XHRcdC8vIFN0cmlwIHRoZSBiYWNrc2xhc2ggcHJlZml4IGZyb20gYSBub24taGV4IGVzY2FwZSBzZXF1ZW5jZVxuXHRcdFx0bm9uSGV4IDpcblxuXHRcdFx0Ly8gUmVwbGFjZSBhIGhleGFkZWNpbWFsIGVzY2FwZSBzZXF1ZW5jZSB3aXRoIHRoZSBlbmNvZGVkIFVuaWNvZGUgY29kZSBwb2ludFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgPD0xMStcblx0XHRcdC8vIEZvciB2YWx1ZXMgb3V0c2lkZSB0aGUgQmFzaWMgTXVsdGlsaW5ndWFsIFBsYW5lIChCTVApLCBtYW51YWxseSBjb25zdHJ1Y3QgYVxuXHRcdFx0Ly8gc3Vycm9nYXRlIHBhaXJcblx0XHRcdGhpZ2ggPCAwID9cblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCArIDB4MTAwMDAgKSA6XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggPj4gMTAgfCAweEQ4MDAsIGhpZ2ggJiAweDNGRiB8IDB4REMwMCApO1xuXHR9LFxuXG5cdC8vIENTUyBzdHJpbmcvaWRlbnRpZmllciBzZXJpYWxpemF0aW9uXG5cdC8vIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3NvbS8jY29tbW9uLXNlcmlhbGl6aW5nLWlkaW9tc1xuXHRyY3NzZXNjYXBlID0gLyhbXFwwLVxceDFmXFx4N2ZdfF4tP1xcZCl8Xi0kfFteXFwwLVxceDFmXFx4N2YtXFx1RkZGRlxcdy1dL2csXG5cdGZjc3Nlc2NhcGUgPSBmdW5jdGlvbiggY2gsIGFzQ29kZVBvaW50ICkge1xuXHRcdGlmICggYXNDb2RlUG9pbnQgKSB7XG5cblx0XHRcdC8vIFUrMDAwMCBOVUxMIGJlY29tZXMgVStGRkZEIFJFUExBQ0VNRU5UIENIQVJBQ1RFUlxuXHRcdFx0aWYgKCBjaCA9PT0gXCJcXDBcIiApIHtcblx0XHRcdFx0cmV0dXJuIFwiXFx1RkZGRFwiO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb250cm9sIGNoYXJhY3RlcnMgYW5kIChkZXBlbmRlbnQgdXBvbiBwb3NpdGlvbikgbnVtYmVycyBnZXQgZXNjYXBlZCBhcyBjb2RlIHBvaW50c1xuXHRcdFx0cmV0dXJuIGNoLnNsaWNlKCAwLCAtMSApICsgXCJcXFxcXCIgK1xuXHRcdFx0XHRjaC5jaGFyQ29kZUF0KCBjaC5sZW5ndGggLSAxICkudG9TdHJpbmcoIDE2ICkgKyBcIiBcIjtcblx0XHR9XG5cblx0XHQvLyBPdGhlciBwb3RlbnRpYWxseS1zcGVjaWFsIEFTQ0lJIGNoYXJhY3RlcnMgZ2V0IGJhY2tzbGFzaC1lc2NhcGVkXG5cdFx0cmV0dXJuIFwiXFxcXFwiICsgY2g7XG5cdH0sXG5cblx0Ly8gVXNlZCBmb3IgaWZyYW1lc1xuXHQvLyBTZWUgc2V0RG9jdW1lbnQoKVxuXHQvLyBSZW1vdmluZyB0aGUgZnVuY3Rpb24gd3JhcHBlciBjYXVzZXMgYSBcIlBlcm1pc3Npb24gRGVuaWVkXCJcblx0Ly8gZXJyb3IgaW4gSUVcblx0dW5sb2FkSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHNldERvY3VtZW50KCk7XG5cdH0sXG5cblx0aW5EaXNhYmxlZEZpZWxkc2V0ID0gYWRkQ29tYmluYXRvcihcblx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSB0cnVlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJmaWVsZHNldFwiO1xuXHRcdH0sXG5cdFx0eyBkaXI6IFwicGFyZW50Tm9kZVwiLCBuZXh0OiBcImxlZ2VuZFwiIH1cblx0KTtcblxuLy8gT3B0aW1pemUgZm9yIHB1c2guYXBwbHkoIF8sIE5vZGVMaXN0IClcbnRyeSB7XG5cdHB1c2guYXBwbHkoXG5cdFx0KCBhcnIgPSBzbGljZS5jYWxsKCBwcmVmZXJyZWREb2MuY2hpbGROb2RlcyApICksXG5cdFx0cHJlZmVycmVkRG9jLmNoaWxkTm9kZXNcblx0KTtcblxuXHQvLyBTdXBwb3J0OiBBbmRyb2lkPDQuMFxuXHQvLyBEZXRlY3Qgc2lsZW50bHkgZmFpbGluZyBwdXNoLmFwcGx5XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0YXJyWyBwcmVmZXJyZWREb2MuY2hpbGROb2Rlcy5sZW5ndGggXS5ub2RlVHlwZTtcbn0gY2F0Y2ggKCBlICkge1xuXHRwdXNoID0geyBhcHBseTogYXJyLmxlbmd0aCA/XG5cblx0XHQvLyBMZXZlcmFnZSBzbGljZSBpZiBwb3NzaWJsZVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHB1c2hOYXRpdmUuYXBwbHkoIHRhcmdldCwgc2xpY2UuY2FsbCggZWxzICkgKTtcblx0XHR9IDpcblxuXHRcdC8vIFN1cHBvcnQ6IElFPDlcblx0XHQvLyBPdGhlcndpc2UgYXBwZW5kIGRpcmVjdGx5XG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0dmFyIGogPSB0YXJnZXQubGVuZ3RoLFxuXHRcdFx0XHRpID0gMDtcblxuXHRcdFx0Ly8gQ2FuJ3QgdHJ1c3QgTm9kZUxpc3QubGVuZ3RoXG5cdFx0XHR3aGlsZSAoICggdGFyZ2V0WyBqKysgXSA9IGVsc1sgaSsrIF0gKSApIHt9XG5cdFx0XHR0YXJnZXQubGVuZ3RoID0gaiAtIDE7XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBTaXp6bGUoIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHR2YXIgbSwgaSwgZWxlbSwgbmlkLCBtYXRjaCwgZ3JvdXBzLCBuZXdTZWxlY3Rvcixcblx0XHRuZXdDb250ZXh0ID0gY29udGV4dCAmJiBjb250ZXh0Lm93bmVyRG9jdW1lbnQsXG5cblx0XHQvLyBub2RlVHlwZSBkZWZhdWx0cyB0byA5LCBzaW5jZSBjb250ZXh0IGRlZmF1bHRzIHRvIGRvY3VtZW50XG5cdFx0bm9kZVR5cGUgPSBjb250ZXh0ID8gY29udGV4dC5ub2RlVHlwZSA6IDk7XG5cblx0cmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0Ly8gUmV0dXJuIGVhcmx5IGZyb20gY2FsbHMgd2l0aCBpbnZhbGlkIHNlbGVjdG9yIG9yIGNvbnRleHRcblx0aWYgKCB0eXBlb2Ygc2VsZWN0b3IgIT09IFwic3RyaW5nXCIgfHwgIXNlbGVjdG9yIHx8XG5cdFx0bm9kZVR5cGUgIT09IDEgJiYgbm9kZVR5cGUgIT09IDkgJiYgbm9kZVR5cGUgIT09IDExICkge1xuXG5cdFx0cmV0dXJuIHJlc3VsdHM7XG5cdH1cblxuXHQvLyBUcnkgdG8gc2hvcnRjdXQgZmluZCBvcGVyYXRpb25zIChhcyBvcHBvc2VkIHRvIGZpbHRlcnMpIGluIEhUTUwgZG9jdW1lbnRzXG5cdGlmICggIXNlZWQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0XHRjb250ZXh0ID0gY29udGV4dCB8fCBkb2N1bWVudDtcblxuXHRcdGlmICggZG9jdW1lbnRJc0hUTUwgKSB7XG5cblx0XHRcdC8vIElmIHRoZSBzZWxlY3RvciBpcyBzdWZmaWNpZW50bHkgc2ltcGxlLCB0cnkgdXNpbmcgYSBcImdldCpCeSpcIiBET00gbWV0aG9kXG5cdFx0XHQvLyAoZXhjZXB0aW5nIERvY3VtZW50RnJhZ21lbnQgY29udGV4dCwgd2hlcmUgdGhlIG1ldGhvZHMgZG9uJ3QgZXhpc3QpXG5cdFx0XHRpZiAoIG5vZGVUeXBlICE9PSAxMSAmJiAoIG1hdGNoID0gcnF1aWNrRXhwci5leGVjKCBzZWxlY3RvciApICkgKSB7XG5cblx0XHRcdFx0Ly8gSUQgc2VsZWN0b3Jcblx0XHRcdFx0aWYgKCAoIG0gPSBtYXRjaFsgMSBdICkgKSB7XG5cblx0XHRcdFx0XHQvLyBEb2N1bWVudCBjb250ZXh0XG5cdFx0XHRcdFx0aWYgKCBub2RlVHlwZSA9PT0gOSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggbSApICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0XHRpZiAoIGVsZW0uaWQgPT09IG0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRWxlbWVudCBjb250ZXh0XG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUsIE9wZXJhLCBXZWJraXRcblx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgJiYgKCBlbGVtID0gbmV3Q29udGV4dC5nZXRFbGVtZW50QnlJZCggbSApICkgJiZcblx0XHRcdFx0XHRcdFx0Y29udGFpbnMoIGNvbnRleHQsIGVsZW0gKSAmJlxuXHRcdFx0XHRcdFx0XHRlbGVtLmlkID09PSBtICkge1xuXG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHlwZSBzZWxlY3RvclxuXHRcdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsgMiBdICkge1xuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHNlbGVjdG9yICkgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0XHQvLyBDbGFzcyBzZWxlY3RvclxuXHRcdFx0XHR9IGVsc2UgaWYgKCAoIG0gPSBtYXRjaFsgMyBdICkgJiYgc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmXG5cdFx0XHRcdFx0Y29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICkge1xuXG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBtICkgKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBUYWtlIGFkdmFudGFnZSBvZiBxdWVyeVNlbGVjdG9yQWxsXG5cdFx0XHRpZiAoIHN1cHBvcnQucXNhICYmXG5cdFx0XHRcdCFub25uYXRpdmVTZWxlY3RvckNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF0gJiZcblx0XHRcdFx0KCAhcmJ1Z2d5UVNBIHx8ICFyYnVnZ3lRU0EudGVzdCggc2VsZWN0b3IgKSApICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgOCBvbmx5XG5cdFx0XHRcdC8vIEV4Y2x1ZGUgb2JqZWN0IGVsZW1lbnRzXG5cdFx0XHRcdCggbm9kZVR5cGUgIT09IDEgfHwgY29udGV4dC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm9iamVjdFwiICkgKSB7XG5cblx0XHRcdFx0bmV3U2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0XHRcdFx0bmV3Q29udGV4dCA9IGNvbnRleHQ7XG5cblx0XHRcdFx0Ly8gcVNBIGNvbnNpZGVycyBlbGVtZW50cyBvdXRzaWRlIGEgc2NvcGluZyByb290IHdoZW4gZXZhbHVhdGluZyBjaGlsZCBvclxuXHRcdFx0XHQvLyBkZXNjZW5kYW50IGNvbWJpbmF0b3JzLCB3aGljaCBpcyBub3Qgd2hhdCB3ZSB3YW50LlxuXHRcdFx0XHQvLyBJbiBzdWNoIGNhc2VzLCB3ZSB3b3JrIGFyb3VuZCB0aGUgYmVoYXZpb3IgYnkgcHJlZml4aW5nIGV2ZXJ5IHNlbGVjdG9yIGluIHRoZVxuXHRcdFx0XHQvLyBsaXN0IHdpdGggYW4gSUQgc2VsZWN0b3IgcmVmZXJlbmNpbmcgdGhlIHNjb3BlIGNvbnRleHQuXG5cdFx0XHRcdC8vIFRoZSB0ZWNobmlxdWUgaGFzIHRvIGJlIHVzZWQgYXMgd2VsbCB3aGVuIGEgbGVhZGluZyBjb21iaW5hdG9yIGlzIHVzZWRcblx0XHRcdFx0Ly8gYXMgc3VjaCBzZWxlY3RvcnMgYXJlIG5vdCByZWNvZ25pemVkIGJ5IHF1ZXJ5U2VsZWN0b3JBbGwuXG5cdFx0XHRcdC8vIFRoYW5rcyB0byBBbmRyZXcgRHVwb250IGZvciB0aGlzIHRlY2huaXF1ZS5cblx0XHRcdFx0aWYgKCBub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0XHRcdCggcmRlc2NlbmQudGVzdCggc2VsZWN0b3IgKSB8fCByY29tYmluYXRvcnMudGVzdCggc2VsZWN0b3IgKSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRXhwYW5kIGNvbnRleHQgZm9yIHNpYmxpbmcgc2VsZWN0b3JzXG5cdFx0XHRcdFx0bmV3Q29udGV4dCA9IHJzaWJsaW5nLnRlc3QoIHNlbGVjdG9yICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8XG5cdFx0XHRcdFx0XHRjb250ZXh0O1xuXG5cdFx0XHRcdFx0Ly8gV2UgY2FuIHVzZSA6c2NvcGUgaW5zdGVhZCBvZiB0aGUgSUQgaGFjayBpZiB0aGUgYnJvd3NlclxuXHRcdFx0XHRcdC8vIHN1cHBvcnRzIGl0ICYgaWYgd2UncmUgbm90IGNoYW5naW5nIHRoZSBjb250ZXh0LlxuXHRcdFx0XHRcdGlmICggbmV3Q29udGV4dCAhPT0gY29udGV4dCB8fCAhc3VwcG9ydC5zY29wZSApIHtcblxuXHRcdFx0XHRcdFx0Ly8gQ2FwdHVyZSB0aGUgY29udGV4dCBJRCwgc2V0dGluZyBpdCBmaXJzdCBpZiBuZWNlc3Nhcnlcblx0XHRcdFx0XHRcdGlmICggKCBuaWQgPSBjb250ZXh0LmdldEF0dHJpYnV0ZSggXCJpZFwiICkgKSApIHtcblx0XHRcdFx0XHRcdFx0bmlkID0gbmlkLnJlcGxhY2UoIHJjc3Nlc2NhcGUsIGZjc3Nlc2NhcGUgKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRleHQuc2V0QXR0cmlidXRlKCBcImlkXCIsICggbmlkID0gZXhwYW5kbyApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUHJlZml4IGV2ZXJ5IHNlbGVjdG9yIGluIHRoZSBsaXN0XG5cdFx0XHRcdFx0Z3JvdXBzID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0XHRcdFx0aSA9IGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRncm91cHNbIGkgXSA9ICggbmlkID8gXCIjXCIgKyBuaWQgOiBcIjpzY29wZVwiICkgKyBcIiBcIiArXG5cdFx0XHRcdFx0XHRcdHRvU2VsZWN0b3IoIGdyb3Vwc1sgaSBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5ld1NlbGVjdG9yID0gZ3JvdXBzLmpvaW4oIFwiLFwiICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsXG5cdFx0XHRcdFx0XHRuZXdDb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIG5ld1NlbGVjdG9yIClcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHR9IGNhdGNoICggcXNhRXJyb3IgKSB7XG5cdFx0XHRcdFx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSggc2VsZWN0b3IsIHRydWUgKTtcblx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRpZiAoIG5pZCA9PT0gZXhwYW5kbyApIHtcblx0XHRcdFx0XHRcdGNvbnRleHQucmVtb3ZlQXR0cmlidXRlKCBcImlkXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBBbGwgb3RoZXJzXG5cdHJldHVybiBzZWxlY3QoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApO1xufVxuXG4vKipcbiAqIENyZWF0ZSBrZXktdmFsdWUgY2FjaGVzIG9mIGxpbWl0ZWQgc2l6ZVxuICogQHJldHVybnMge2Z1bmN0aW9uKHN0cmluZywgb2JqZWN0KX0gUmV0dXJucyB0aGUgT2JqZWN0IGRhdGEgYWZ0ZXIgc3RvcmluZyBpdCBvbiBpdHNlbGYgd2l0aFxuICpcdHByb3BlcnR5IG5hbWUgdGhlIChzcGFjZS1zdWZmaXhlZCkgc3RyaW5nIGFuZCAoaWYgdGhlIGNhY2hlIGlzIGxhcmdlciB0aGFuIEV4cHIuY2FjaGVMZW5ndGgpXG4gKlx0ZGVsZXRpbmcgdGhlIG9sZGVzdCBlbnRyeVxuICovXG5mdW5jdGlvbiBjcmVhdGVDYWNoZSgpIHtcblx0dmFyIGtleXMgPSBbXTtcblxuXHRmdW5jdGlvbiBjYWNoZSgga2V5LCB2YWx1ZSApIHtcblxuXHRcdC8vIFVzZSAoa2V5ICsgXCIgXCIpIHRvIGF2b2lkIGNvbGxpc2lvbiB3aXRoIG5hdGl2ZSBwcm90b3R5cGUgcHJvcGVydGllcyAoc2VlIElzc3VlICMxNTcpXG5cdFx0aWYgKCBrZXlzLnB1c2goIGtleSArIFwiIFwiICkgPiBFeHByLmNhY2hlTGVuZ3RoICkge1xuXG5cdFx0XHQvLyBPbmx5IGtlZXAgdGhlIG1vc3QgcmVjZW50IGVudHJpZXNcblx0XHRcdGRlbGV0ZSBjYWNoZVsga2V5cy5zaGlmdCgpIF07XG5cdFx0fVxuXHRcdHJldHVybiAoIGNhY2hlWyBrZXkgKyBcIiBcIiBdID0gdmFsdWUgKTtcblx0fVxuXHRyZXR1cm4gY2FjaGU7XG59XG5cbi8qKlxuICogTWFyayBhIGZ1bmN0aW9uIGZvciBzcGVjaWFsIHVzZSBieSBTaXp6bGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBtYXJrXG4gKi9cbmZ1bmN0aW9uIG1hcmtGdW5jdGlvbiggZm4gKSB7XG5cdGZuWyBleHBhbmRvIF0gPSB0cnVlO1xuXHRyZXR1cm4gZm47XG59XG5cbi8qKlxuICogU3VwcG9ydCB0ZXN0aW5nIHVzaW5nIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFBhc3NlZCB0aGUgY3JlYXRlZCBlbGVtZW50IGFuZCByZXR1cm5zIGEgYm9vbGVhbiByZXN1bHRcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KCBmbiApIHtcblx0dmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJmaWVsZHNldFwiICk7XG5cblx0dHJ5IHtcblx0XHRyZXR1cm4gISFmbiggZWwgKTtcblx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9IGZpbmFsbHkge1xuXG5cdFx0Ly8gUmVtb3ZlIGZyb20gaXRzIHBhcmVudCBieSBkZWZhdWx0XG5cdFx0aWYgKCBlbC5wYXJlbnROb2RlICkge1xuXHRcdFx0ZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZWwgKTtcblx0XHR9XG5cblx0XHQvLyByZWxlYXNlIG1lbW9yeSBpbiBJRVxuXHRcdGVsID0gbnVsbDtcblx0fVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIHNhbWUgaGFuZGxlciBmb3IgYWxsIG9mIHRoZSBzcGVjaWZpZWQgYXR0cnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBhdHRycyBQaXBlLXNlcGFyYXRlZCBsaXN0IG9mIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXIgVGhlIG1ldGhvZCB0aGF0IHdpbGwgYmUgYXBwbGllZFxuICovXG5mdW5jdGlvbiBhZGRIYW5kbGUoIGF0dHJzLCBoYW5kbGVyICkge1xuXHR2YXIgYXJyID0gYXR0cnMuc3BsaXQoIFwifFwiICksXG5cdFx0aSA9IGFyci5sZW5ndGg7XG5cblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0RXhwci5hdHRySGFuZGxlWyBhcnJbIGkgXSBdID0gaGFuZGxlcjtcblx0fVxufVxuXG4vKipcbiAqIENoZWNrcyBkb2N1bWVudCBvcmRlciBvZiB0d28gc2libGluZ3NcbiAqIEBwYXJhbSB7RWxlbWVudH0gYVxuICogQHBhcmFtIHtFbGVtZW50fSBiXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBSZXR1cm5zIGxlc3MgdGhhbiAwIGlmIGEgcHJlY2VkZXMgYiwgZ3JlYXRlciB0aGFuIDAgaWYgYSBmb2xsb3dzIGJcbiAqL1xuZnVuY3Rpb24gc2libGluZ0NoZWNrKCBhLCBiICkge1xuXHR2YXIgY3VyID0gYiAmJiBhLFxuXHRcdGRpZmYgPSBjdXIgJiYgYS5ub2RlVHlwZSA9PT0gMSAmJiBiLm5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRhLnNvdXJjZUluZGV4IC0gYi5zb3VyY2VJbmRleDtcblxuXHQvLyBVc2UgSUUgc291cmNlSW5kZXggaWYgYXZhaWxhYmxlIG9uIGJvdGggbm9kZXNcblx0aWYgKCBkaWZmICkge1xuXHRcdHJldHVybiBkaWZmO1xuXHR9XG5cblx0Ly8gQ2hlY2sgaWYgYiBmb2xsb3dzIGFcblx0aWYgKCBjdXIgKSB7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5uZXh0U2libGluZyApICkge1xuXHRcdFx0aWYgKCBjdXIgPT09IGIgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYSA/IDEgOiAtMTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGlucHV0IHR5cGVzXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVJbnB1dFBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgYnV0dG9uc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQnV0dG9uUHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuICggbmFtZSA9PT0gXCJpbnB1dFwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCIgKSAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciA6ZW5hYmxlZC86ZGlzYWJsZWRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gZGlzYWJsZWQgdHJ1ZSBmb3IgOmRpc2FibGVkOyBmYWxzZSBmb3IgOmVuYWJsZWRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIGRpc2FibGVkICkge1xuXG5cdC8vIEtub3duIDpkaXNhYmxlZCBmYWxzZSBwb3NpdGl2ZXM6IGZpZWxkc2V0W2Rpc2FibGVkXSA+IGxlZ2VuZDpudGgtb2YtdHlwZShuKzIpIDpjYW4tZGlzYWJsZVxuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHQvLyBPbmx5IGNlcnRhaW4gZWxlbWVudHMgY2FuIG1hdGNoIDplbmFibGVkIG9yIDpkaXNhYmxlZFxuXHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sI3NlbGVjdG9yLWVuYWJsZWRcblx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zY3JpcHRpbmcuaHRtbCNzZWxlY3Rvci1kaXNhYmxlZFxuXHRcdGlmICggXCJmb3JtXCIgaW4gZWxlbSApIHtcblxuXHRcdFx0Ly8gQ2hlY2sgZm9yIGluaGVyaXRlZCBkaXNhYmxlZG5lc3Mgb24gcmVsZXZhbnQgbm9uLWRpc2FibGVkIGVsZW1lbnRzOlxuXHRcdFx0Ly8gKiBsaXN0ZWQgZm9ybS1hc3NvY2lhdGVkIGVsZW1lbnRzIGluIGEgZGlzYWJsZWQgZmllbGRzZXRcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjYXRlZ29yeS1saXN0ZWRcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjb25jZXB0LWZlLWRpc2FibGVkXG5cdFx0XHQvLyAqIG9wdGlvbiBlbGVtZW50cyBpbiBhIGRpc2FibGVkIG9wdGdyb3VwXG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY29uY2VwdC1vcHRpb24tZGlzYWJsZWRcblx0XHRcdC8vIEFsbCBzdWNoIGVsZW1lbnRzIGhhdmUgYSBcImZvcm1cIiBwcm9wZXJ0eS5cblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICYmIGVsZW0uZGlzYWJsZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdC8vIE9wdGlvbiBlbGVtZW50cyBkZWZlciB0byBhIHBhcmVudCBvcHRncm91cCBpZiBwcmVzZW50XG5cdFx0XHRcdGlmICggXCJsYWJlbFwiIGluIGVsZW0gKSB7XG5cdFx0XHRcdFx0aWYgKCBcImxhYmVsXCIgaW4gZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0ucGFyZW50Tm9kZS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA2IC0gMTFcblx0XHRcdFx0Ly8gVXNlIHRoZSBpc0Rpc2FibGVkIHNob3J0Y3V0IHByb3BlcnR5IHRvIGNoZWNrIGZvciBkaXNhYmxlZCBmaWVsZHNldCBhbmNlc3RvcnNcblx0XHRcdFx0cmV0dXJuIGVsZW0uaXNEaXNhYmxlZCA9PT0gZGlzYWJsZWQgfHxcblxuXHRcdFx0XHRcdC8vIFdoZXJlIHRoZXJlIGlzIG5vIGlzRGlzYWJsZWQsIGNoZWNrIG1hbnVhbGx5XG5cdFx0XHRcdFx0LyoganNoaW50IC1XMDE4ICovXG5cdFx0XHRcdFx0ZWxlbS5pc0Rpc2FibGVkICE9PSAhZGlzYWJsZWQgJiZcblx0XHRcdFx0XHRpbkRpc2FibGVkRmllbGRzZXQoIGVsZW0gKSA9PT0gZGlzYWJsZWQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblxuXHRcdC8vIFRyeSB0byB3aW5ub3cgb3V0IGVsZW1lbnRzIHRoYXQgY2FuJ3QgYmUgZGlzYWJsZWQgYmVmb3JlIHRydXN0aW5nIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eS5cblx0XHQvLyBTb21lIHZpY3RpbXMgZ2V0IGNhdWdodCBpbiBvdXIgbmV0IChsYWJlbCwgbGVnZW5kLCBtZW51LCB0cmFjayksIGJ1dCBpdCBzaG91bGRuJ3Rcblx0XHQvLyBldmVuIGV4aXN0IG9uIHRoZW0sIGxldCBhbG9uZSBoYXZlIGEgYm9vbGVhbiB2YWx1ZS5cblx0XHR9IGVsc2UgaWYgKCBcImxhYmVsXCIgaW4gZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHR9XG5cblx0XHQvLyBSZW1haW5pbmcgZWxlbWVudHMgYXJlIG5laXRoZXIgOmVuYWJsZWQgbm9yIDpkaXNhYmxlZFxuXHRcdHJldHVybiBmYWxzZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIHBvc2l0aW9uYWxzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICovXG5mdW5jdGlvbiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmbiApIHtcblx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIGFyZ3VtZW50ICkge1xuXHRcdGFyZ3VtZW50ID0gK2FyZ3VtZW50O1xuXHRcdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0dmFyIGosXG5cdFx0XHRcdG1hdGNoSW5kZXhlcyA9IGZuKCBbXSwgc2VlZC5sZW5ndGgsIGFyZ3VtZW50ICksXG5cdFx0XHRcdGkgPSBtYXRjaEluZGV4ZXMubGVuZ3RoO1xuXG5cdFx0XHQvLyBNYXRjaCBlbGVtZW50cyBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4ZXNcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoIHNlZWRbICggaiA9IG1hdGNoSW5kZXhlc1sgaSBdICkgXSApIHtcblx0XHRcdFx0XHRzZWVkWyBqIF0gPSAhKCBtYXRjaGVzWyBqIF0gPSBzZWVkWyBqIF0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gKTtcblx0fSApO1xufVxuXG4vKipcbiAqIENoZWNrcyBhIG5vZGUgZm9yIHZhbGlkaXR5IGFzIGEgU2l6emxlIGNvbnRleHRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3Q9fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7RWxlbWVudHxPYmplY3R8Qm9vbGVhbn0gVGhlIGlucHV0IG5vZGUgaWYgYWNjZXB0YWJsZSwgb3RoZXJ3aXNlIGEgZmFsc3kgdmFsdWVcbiAqL1xuZnVuY3Rpb24gdGVzdENvbnRleHQoIGNvbnRleHQgKSB7XG5cdHJldHVybiBjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGNvbnRleHQ7XG59XG5cbi8vIEV4cG9zZSBzdXBwb3J0IHZhcnMgZm9yIGNvbnZlbmllbmNlXG5zdXBwb3J0ID0gU2l6emxlLnN1cHBvcnQgPSB7fTtcblxuLyoqXG4gKiBEZXRlY3RzIFhNTCBub2Rlc1xuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gZWxlbSBBbiBlbGVtZW50IG9yIGEgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmZiBlbGVtIGlzIGEgbm9uLUhUTUwgWE1MIG5vZGVcbiAqL1xuaXNYTUwgPSBTaXp6bGUuaXNYTUwgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0dmFyIG5hbWVzcGFjZSA9IGVsZW0gJiYgZWxlbS5uYW1lc3BhY2VVUkksXG5cdFx0ZG9jRWxlbSA9IGVsZW0gJiYgKCBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSApLmRvY3VtZW50RWxlbWVudDtcblxuXHQvLyBTdXBwb3J0OiBJRSA8PThcblx0Ly8gQXNzdW1lIEhUTUwgd2hlbiBkb2N1bWVudEVsZW1lbnQgZG9lc24ndCB5ZXQgZXhpc3QsIHN1Y2ggYXMgaW5zaWRlIGxvYWRpbmcgaWZyYW1lc1xuXHQvLyBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvNDgzM1xuXHRyZXR1cm4gIXJodG1sLnRlc3QoIG5hbWVzcGFjZSB8fCBkb2NFbGVtICYmIGRvY0VsZW0ubm9kZU5hbWUgfHwgXCJIVE1MXCIgKTtcbn07XG5cbi8qKlxuICogU2V0cyBkb2N1bWVudC1yZWxhdGVkIHZhcmlhYmxlcyBvbmNlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBbZG9jXSBBbiBlbGVtZW50IG9yIGRvY3VtZW50IG9iamVjdCB0byB1c2UgdG8gc2V0IHRoZSBkb2N1bWVudFxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY3VycmVudCBkb2N1bWVudFxuICovXG5zZXREb2N1bWVudCA9IFNpenpsZS5zZXREb2N1bWVudCA9IGZ1bmN0aW9uKCBub2RlICkge1xuXHR2YXIgaGFzQ29tcGFyZSwgc3ViV2luZG93LFxuXHRcdGRvYyA9IG5vZGUgPyBub2RlLm93bmVyRG9jdW1lbnQgfHwgbm9kZSA6IHByZWZlcnJlZERvYztcblxuXHQvLyBSZXR1cm4gZWFybHkgaWYgZG9jIGlzIGludmFsaWQgb3IgYWxyZWFkeSBzZWxlY3RlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoIGRvYyA9PSBkb2N1bWVudCB8fCBkb2Mubm9kZVR5cGUgIT09IDkgfHwgIWRvYy5kb2N1bWVudEVsZW1lbnQgKSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50O1xuXHR9XG5cblx0Ly8gVXBkYXRlIGdsb2JhbCB2YXJpYWJsZXNcblx0ZG9jdW1lbnQgPSBkb2M7XG5cdGRvY0VsZW0gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cdGRvY3VtZW50SXNIVE1MID0gIWlzWE1MKCBkb2N1bWVudCApO1xuXG5cdC8vIFN1cHBvcnQ6IElFIDkgLSAxMSssIEVkZ2UgMTIgLSAxOCtcblx0Ly8gQWNjZXNzaW5nIGlmcmFtZSBkb2N1bWVudHMgYWZ0ZXIgdW5sb2FkIHRocm93cyBcInBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3JzIChqUXVlcnkgIzEzOTM2KVxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoIHByZWZlcnJlZERvYyAhPSBkb2N1bWVudCAmJlxuXHRcdCggc3ViV2luZG93ID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcgKSAmJiBzdWJXaW5kb3cudG9wICE9PSBzdWJXaW5kb3cgKSB7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSAxMSwgRWRnZVxuXHRcdGlmICggc3ViV2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKSB7XG5cdFx0XHRzdWJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggXCJ1bmxvYWRcIiwgdW5sb2FkSGFuZGxlciwgZmFsc2UgKTtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDkgLSAxMCBvbmx5XG5cdFx0fSBlbHNlIGlmICggc3ViV2luZG93LmF0dGFjaEV2ZW50ICkge1xuXHRcdFx0c3ViV2luZG93LmF0dGFjaEV2ZW50KCBcIm9udW5sb2FkXCIsIHVubG9hZEhhbmRsZXIgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBTdXBwb3J0OiBJRSA4IC0gMTErLCBFZGdlIDEyIC0gMTgrLCBDaHJvbWUgPD0xNiAtIDI1IG9ubHksIEZpcmVmb3ggPD0zLjYgLSAzMSBvbmx5LFxuXHQvLyBTYWZhcmkgNCAtIDUgb25seSwgT3BlcmEgPD0xMS42IC0gMTIueCBvbmx5XG5cdC8vIElFL0VkZ2UgJiBvbGRlciBicm93c2VycyBkb24ndCBzdXBwb3J0IHRoZSA6c2NvcGUgcHNldWRvLWNsYXNzLlxuXHQvLyBTdXBwb3J0OiBTYWZhcmkgNi4wIG9ubHlcblx0Ly8gU2FmYXJpIDYuMCBzdXBwb3J0cyA6c2NvcGUgYnV0IGl0J3MgYW4gYWxpYXMgb2YgOnJvb3QgdGhlcmUuXG5cdHN1cHBvcnQuc2NvcGUgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICkgKTtcblx0XHRyZXR1cm4gdHlwZW9mIGVsLnF1ZXJ5U2VsZWN0b3JBbGwgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdCFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpzY29wZSBmaWVsZHNldCBkaXZcIiApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8qIEF0dHJpYnV0ZXNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFN1cHBvcnQ6IElFPDhcblx0Ly8gVmVyaWZ5IHRoYXQgZ2V0QXR0cmlidXRlIHJlYWxseSByZXR1cm5zIGF0dHJpYnV0ZXMgYW5kIG5vdCBwcm9wZXJ0aWVzXG5cdC8vIChleGNlcHRpbmcgSUU4IGJvb2xlYW5zKVxuXHRzdXBwb3J0LmF0dHJpYnV0ZXMgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRlbC5jbGFzc05hbWUgPSBcImlcIjtcblx0XHRyZXR1cm4gIWVsLmdldEF0dHJpYnV0ZSggXCJjbGFzc05hbWVcIiApO1xuXHR9ICk7XG5cblx0LyogZ2V0RWxlbWVudChzKUJ5KlxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpIHJldHVybnMgb25seSBlbGVtZW50c1xuXHRzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZWwuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoIFwiXCIgKSApO1xuXHRcdHJldHVybiAhZWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIFwiKlwiICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0Ly8gU3VwcG9ydDogSUU8OVxuXHRzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKTtcblxuXHQvLyBTdXBwb3J0OiBJRTwxMFxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50QnlJZCByZXR1cm5zIGVsZW1lbnRzIGJ5IG5hbWVcblx0Ly8gVGhlIGJyb2tlbiBnZXRFbGVtZW50QnlJZCBtZXRob2RzIGRvbid0IHBpY2sgdXAgcHJvZ3JhbW1hdGljYWxseS1zZXQgbmFtZXMsXG5cdC8vIHNvIHVzZSBhIHJvdW5kYWJvdXQgZ2V0RWxlbWVudHNCeU5hbWUgdGVzdFxuXHRzdXBwb3J0LmdldEJ5SWQgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmlkID0gZXhwYW5kbztcblx0XHRyZXR1cm4gIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lIHx8ICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSggZXhwYW5kbyApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8vIElEIGZpbHRlciBhbmQgZmluZFxuXHRpZiAoIHN1cHBvcnQuZ2V0QnlJZCApIHtcblx0XHRFeHByLmZpbHRlclsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBcImlkXCIgKSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXHRcdEV4cHIuZmluZFsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cdFx0XHRcdHJldHVybiBlbGVtID8gWyBlbGVtIF0gOiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdEV4cHIuZmlsdGVyWyBcIklEXCIgXSA9ICBmdW5jdGlvbiggaWQgKSB7XG5cdFx0XHR2YXIgYXR0cklkID0gaWQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIG5vZGUgPSB0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGVOb2RlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gYXR0cklkO1xuXHRcdFx0fTtcblx0XHR9O1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgNiAtIDcgb25seVxuXHRcdC8vIGdldEVsZW1lbnRCeUlkIGlzIG5vdCByZWxpYWJsZSBhcyBhIGZpbmQgc2hvcnRjdXRcblx0XHRFeHByLmZpbmRbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdFx0dmFyIG5vZGUsIGksIGVsZW1zLFxuXHRcdFx0XHRcdGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXG5cdFx0XHRcdGlmICggZWxlbSApIHtcblxuXHRcdFx0XHRcdC8vIFZlcmlmeSB0aGUgaWQgYXR0cmlidXRlXG5cdFx0XHRcdFx0bm9kZSA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0aWYgKCBub2RlICYmIG5vZGUudmFsdWUgPT09IGlkICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIFsgZWxlbSBdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEZhbGwgYmFjayBvbiBnZXRFbGVtZW50c0J5TmFtZVxuXHRcdFx0XHRcdGVsZW1zID0gY29udGV4dC5nZXRFbGVtZW50c0J5TmFtZSggaWQgKTtcblx0XHRcdFx0XHRpID0gMDtcblx0XHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1zWyBpKysgXSApICkge1xuXHRcdFx0XHRcdFx0bm9kZSA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0XHRpZiAoIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gaWQgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBbIGVsZW0gXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdC8vIFRhZ1xuXHRFeHByLmZpbmRbIFwiVEFHXCIgXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgP1xuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgZG9uJ3QgaGF2ZSBnRUJUTlxuXHRcdFx0fSBlbHNlIGlmICggc3VwcG9ydC5xc2EgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoIHRhZyApO1xuXHRcdFx0fVxuXHRcdH0gOlxuXG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHR0bXAgPSBbXSxcblx0XHRcdFx0aSA9IDAsXG5cblx0XHRcdFx0Ly8gQnkgaGFwcHkgY29pbmNpZGVuY2UsIGEgKGJyb2tlbikgZ0VCVE4gYXBwZWFycyBvbiBEb2N1bWVudEZyYWdtZW50IG5vZGVzIHRvb1xuXHRcdFx0XHRyZXN1bHRzID0gY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggdGFnICk7XG5cblx0XHRcdC8vIEZpbHRlciBvdXQgcG9zc2libGUgY29tbWVudHNcblx0XHRcdGlmICggdGFnID09PSBcIipcIiApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSByZXN1bHRzWyBpKysgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSApIHtcblx0XHRcdFx0XHRcdHRtcC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRtcDtcblx0XHRcdH1cblx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdH07XG5cblx0Ly8gQ2xhc3Ncblx0RXhwci5maW5kWyBcIkNMQVNTXCIgXSA9IHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJiBmdW5jdGlvbiggY2xhc3NOYW1lLCBjb250ZXh0ICkge1xuXHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGNsYXNzTmFtZSApO1xuXHRcdH1cblx0fTtcblxuXHQvKiBRU0EvbWF0Y2hlc1NlbGVjdG9yXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBRU0EgYW5kIG1hdGNoZXNTZWxlY3RvciBzdXBwb3J0XG5cblx0Ly8gbWF0Y2hlc1NlbGVjdG9yKDphY3RpdmUpIHJlcG9ydHMgZmFsc2Ugd2hlbiB0cnVlIChJRTkvT3BlcmEgMTEuNSlcblx0cmJ1Z2d5TWF0Y2hlcyA9IFtdO1xuXG5cdC8vIHFTYSg6Zm9jdXMpIHJlcG9ydHMgZmFsc2Ugd2hlbiB0cnVlIChDaHJvbWUgMjEpXG5cdC8vIFdlIGFsbG93IHRoaXMgYmVjYXVzZSBvZiBhIGJ1ZyBpbiBJRTgvOSB0aGF0IHRocm93cyBhbiBlcnJvclxuXHQvLyB3aGVuZXZlciBgZG9jdW1lbnQuYWN0aXZlRWxlbWVudGAgaXMgYWNjZXNzZWQgb24gYW4gaWZyYW1lXG5cdC8vIFNvLCB3ZSBhbGxvdyA6Zm9jdXMgdG8gcGFzcyB0aHJvdWdoIFFTQSBhbGwgdGhlIHRpbWUgdG8gYXZvaWQgdGhlIElFIGVycm9yXG5cdC8vIFNlZSBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTMzNzhcblx0cmJ1Z2d5UVNBID0gW107XG5cblx0aWYgKCAoIHN1cHBvcnQucXNhID0gcm5hdGl2ZS50ZXN0KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsICkgKSApIHtcblxuXHRcdC8vIEJ1aWxkIFFTQSByZWdleFxuXHRcdC8vIFJlZ2V4IHN0cmF0ZWd5IGFkb3B0ZWQgZnJvbSBEaWVnbyBQZXJpbmlcblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0dmFyIGlucHV0O1xuXG5cdFx0XHQvLyBTZWxlY3QgaXMgc2V0IHRvIGVtcHR5IHN0cmluZyBvbiBwdXJwb3NlXG5cdFx0XHQvLyBUaGlzIGlzIHRvIHRlc3QgSUUncyB0cmVhdG1lbnQgb2Ygbm90IGV4cGxpY2l0bHlcblx0XHRcdC8vIHNldHRpbmcgYSBib29sZWFuIGNvbnRlbnQgYXR0cmlidXRlLFxuXHRcdFx0Ly8gc2luY2UgaXRzIHByZXNlbmNlIHNob3VsZCBiZSBlbm91Z2hcblx0XHRcdC8vIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMjM1OVxuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5pbm5lckhUTUwgPSBcIjxhIGlkPSdcIiArIGV4cGFuZG8gKyBcIic+PC9hPlwiICtcblx0XHRcdFx0XCI8c2VsZWN0IGlkPSdcIiArIGV4cGFuZG8gKyBcIi1cXHJcXFxcJyBtc2FsbG93Y2FwdHVyZT0nJz5cIiArXG5cdFx0XHRcdFwiPG9wdGlvbiBzZWxlY3RlZD0nJz48L29wdGlvbj48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4LCBPcGVyYSAxMS0xMi4xNlxuXHRcdFx0Ly8gTm90aGluZyBzaG91bGQgYmUgc2VsZWN0ZWQgd2hlbiBlbXB0eSBzdHJpbmdzIGZvbGxvdyBePSBvciAkPSBvciAqPVxuXHRcdFx0Ly8gVGhlIHRlc3QgYXR0cmlidXRlIG11c3QgYmUgdW5rbm93biBpbiBPcGVyYSBidXQgXCJzYWZlXCIgZm9yIFdpblJUXG5cdFx0XHQvLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2hoNDY1Mzg4LmFzcHgjYXR0cmlidXRlX3NlY3Rpb25cblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbXNhbGxvd2NhcHR1cmVePScnXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJbKl4kXT1cIiArIHdoaXRlc3BhY2UgKyBcIiooPzonJ3xcXFwiXFxcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRThcblx0XHRcdC8vIEJvb2xlYW4gYXR0cmlidXRlcyBhbmQgXCJ2YWx1ZVwiIGFyZSBub3QgdHJlYXRlZCBjb3JyZWN0bHlcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW3NlbGVjdGVkXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKig/OnZhbHVlfFwiICsgYm9vbGVhbnMgKyBcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBDaHJvbWU8MjksIEFuZHJvaWQ8NC40LCBTYWZhcmk8Ny4wKywgaU9TPDcuMCssIFBoYW50b21KUzwxLjkuOCtcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW2lkfj1cIiArIGV4cGFuZG8gKyBcIi1dXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIn49XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE1IC0gMTgrXG5cdFx0XHQvLyBJRSAxMS9FZGdlIGRvbid0IGZpbmQgZWxlbWVudHMgb24gYSBgW25hbWU9JyddYCBxdWVyeSBpbiBzb21lIGNhc2VzLlxuXHRcdFx0Ly8gQWRkaW5nIGEgdGVtcG9yYXJ5IGF0dHJpYnV0ZSB0byB0aGUgZG9jdW1lbnQgYmVmb3JlIHRoZSBzZWxlY3Rpb24gd29ya3Ncblx0XHRcdC8vIGFyb3VuZCB0aGUgaXNzdWUuXG5cdFx0XHQvLyBJbnRlcmVzdGluZ2x5LCBJRSAxMCAmIG9sZGVyIGRvbid0IHNlZW0gdG8gaGF2ZSB0aGUgaXNzdWUuXG5cdFx0XHRpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJcIiApO1xuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltuYW1lPScnXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKm5hbWVcIiArIHdoaXRlc3BhY2UgKyBcIio9XCIgK1xuXHRcdFx0XHRcdHdoaXRlc3BhY2UgKyBcIiooPzonJ3xcXFwiXFxcIilcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBXZWJraXQvT3BlcmEgLSA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIHNlbGVjdGVkIG9wdGlvbiBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpjaGVja2VkXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjpjaGVja2VkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogU2FmYXJpIDgrLCBpT1MgOCtcblx0XHRcdC8vIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzY4NTFcblx0XHRcdC8vIEluLXBhZ2UgYHNlbGVjdG9yI2lkIHNpYmxpbmctY29tYmluYXRvciBzZWxlY3RvcmAgZmFpbHNcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiYSNcIiArIGV4cGFuZG8gKyBcIisqXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIi4jLitbK35dXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogRmlyZWZveCA8PTMuNiAtIDUgb25seVxuXHRcdFx0Ly8gT2xkIEZpcmVmb3ggZG9lc24ndCB0aHJvdyBvbiBhIGJhZGx5LWVzY2FwZWQgaWRlbnRpZmllci5cblx0XHRcdGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiXFxcXFxcZlwiICk7XG5cdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJbXFxcXHJcXFxcblxcXFxmXVwiICk7XG5cdFx0fSApO1xuXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRlbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JycgZGlzYWJsZWQ9J2Rpc2FibGVkJz48L2E+XCIgK1xuXHRcdFx0XHRcIjxzZWxlY3QgZGlzYWJsZWQ9J2Rpc2FibGVkJz48b3B0aW9uLz48L3NlbGVjdD5cIjtcblxuXHRcdFx0Ly8gU3VwcG9ydDogV2luZG93cyA4IE5hdGl2ZSBBcHBzXG5cdFx0XHQvLyBUaGUgdHlwZSBhbmQgbmFtZSBhdHRyaWJ1dGVzIGFyZSByZXN0cmljdGVkIGR1cmluZyAuaW5uZXJIVE1MIGFzc2lnbm1lbnRcblx0XHRcdHZhciBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuXHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCBcInR5cGVcIiwgXCJoaWRkZW5cIiApO1xuXHRcdFx0ZWwuYXBwZW5kQ2hpbGQoIGlucHV0ICkuc2V0QXR0cmlidXRlKCBcIm5hbWVcIiwgXCJEXCIgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBFbmZvcmNlIGNhc2Utc2Vuc2l0aXZpdHkgb2YgbmFtZSBhdHRyaWJ1dGVcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbmFtZT1kXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqWypeJHwhfl0/PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZGIDMuNSAtIDplbmFibGVkLzpkaXNhYmxlZCBhbmQgaGlkZGVuIGVsZW1lbnRzIChoaWRkZW4gZWxlbWVudHMgYXJlIHN0aWxsIGVuYWJsZWQpXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjplbmFibGVkXCIgKS5sZW5ndGggIT09IDIgKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU5LTExK1xuXHRcdFx0Ly8gSUUncyA6ZGlzYWJsZWQgc2VsZWN0b3IgZG9lcyBub3QgcGljayB1cCB0aGUgY2hpbGRyZW4gb2YgZGlzYWJsZWQgZmllbGRzZXRzXG5cdFx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmRpc2FibGVkID0gdHJ1ZTtcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCI6ZGlzYWJsZWRcIiApLmxlbmd0aCAhPT0gMiApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBPcGVyYSAxMCAtIDExIG9ubHlcblx0XHRcdC8vIE9wZXJhIDEwLTExIGRvZXMgbm90IHRocm93IG9uIHBvc3QtY29tbWEgaW52YWxpZCBwc2V1ZG9zXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIiosOnhcIiApO1xuXHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiLC4qOlwiICk7XG5cdFx0fSApO1xuXHR9XG5cblx0aWYgKCAoIHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yID0gcm5hdGl2ZS50ZXN0KCAoIG1hdGNoZXMgPSBkb2NFbGVtLm1hdGNoZXMgfHxcblx0XHRkb2NFbGVtLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5vTWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tc01hdGNoZXNTZWxlY3RvciApICkgKSApIHtcblxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgaXQncyBwb3NzaWJsZSB0byBkbyBtYXRjaGVzU2VsZWN0b3Jcblx0XHRcdC8vIG9uIGEgZGlzY29ubmVjdGVkIG5vZGUgKElFIDkpXG5cdFx0XHRzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoID0gbWF0Y2hlcy5jYWxsKCBlbCwgXCIqXCIgKTtcblxuXHRcdFx0Ly8gVGhpcyBzaG91bGQgZmFpbCB3aXRoIGFuIGV4Y2VwdGlvblxuXHRcdFx0Ly8gR2Vja28gZG9lcyBub3QgZXJyb3IsIHJldHVybnMgZmFsc2UgaW5zdGVhZFxuXHRcdFx0bWF0Y2hlcy5jYWxsKCBlbCwgXCJbcyE9JyddOnhcIiApO1xuXHRcdFx0cmJ1Z2d5TWF0Y2hlcy5wdXNoKCBcIiE9XCIsIHBzZXVkb3MgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRyYnVnZ3lRU0EgPSByYnVnZ3lRU0EubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneVFTQS5qb2luKCBcInxcIiApICk7XG5cdHJidWdneU1hdGNoZXMgPSByYnVnZ3lNYXRjaGVzLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lNYXRjaGVzLmpvaW4oIFwifFwiICkgKTtcblxuXHQvKiBDb250YWluc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdGhhc0NvbXBhcmUgPSBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29tcGFyZURvY3VtZW50UG9zaXRpb24gKTtcblxuXHQvLyBFbGVtZW50IGNvbnRhaW5zIGFub3RoZXJcblx0Ly8gUHVycG9zZWZ1bGx5IHNlbGYtZXhjbHVzaXZlXG5cdC8vIEFzIGluLCBhbiBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gaXRzZWxmXG5cdGNvbnRhaW5zID0gaGFzQ29tcGFyZSB8fCBybmF0aXZlLnRlc3QoIGRvY0VsZW0uY29udGFpbnMgKSA/XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHR2YXIgYWRvd24gPSBhLm5vZGVUeXBlID09PSA5ID8gYS5kb2N1bWVudEVsZW1lbnQgOiBhLFxuXHRcdFx0XHRidXAgPSBiICYmIGIucGFyZW50Tm9kZTtcblx0XHRcdHJldHVybiBhID09PSBidXAgfHwgISEoIGJ1cCAmJiBidXAubm9kZVR5cGUgPT09IDEgJiYgKFxuXHRcdFx0XHRhZG93bi5jb250YWlucyA/XG5cdFx0XHRcdFx0YWRvd24uY29udGFpbnMoIGJ1cCApIDpcblx0XHRcdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICYmIGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGJ1cCApICYgMTZcblx0XHRcdCkgKTtcblx0XHR9IDpcblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdGlmICggYiApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGIgPSBiLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdFx0XHRpZiAoIGIgPT09IGEgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdC8qIFNvcnRpbmdcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIERvY3VtZW50IG9yZGVyIHNvcnRpbmdcblx0c29ydE9yZGVyID0gaGFzQ29tcGFyZSA/XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRmxhZyBmb3IgZHVwbGljYXRlIHJlbW92YWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0Ly8gU29ydCBvbiBtZXRob2QgZXhpc3RlbmNlIGlmIG9ubHkgb25lIGlucHV0IGhhcyBjb21wYXJlRG9jdW1lbnRQb3NpdGlvblxuXHRcdHZhciBjb21wYXJlID0gIWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gLSAhYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbjtcblx0XHRpZiAoIGNvbXBhcmUgKSB7XG5cdFx0XHRyZXR1cm4gY29tcGFyZTtcblx0XHR9XG5cblx0XHQvLyBDYWxjdWxhdGUgcG9zaXRpb24gaWYgYm90aCBpbnB1dHMgYmVsb25nIHRvIHRoZSBzYW1lIGRvY3VtZW50XG5cdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRjb21wYXJlID0gKCBhLm93bmVyRG9jdW1lbnQgfHwgYSApID09ICggYi5vd25lckRvY3VtZW50IHx8IGIgKSA/XG5cdFx0XHRhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBiICkgOlxuXG5cdFx0XHQvLyBPdGhlcndpc2Ugd2Uga25vdyB0aGV5IGFyZSBkaXNjb25uZWN0ZWRcblx0XHRcdDE7XG5cblx0XHQvLyBEaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRpZiAoIGNvbXBhcmUgJiAxIHx8XG5cdFx0XHQoICFzdXBwb3J0LnNvcnREZXRhY2hlZCAmJiBiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBhICkgPT09IGNvbXBhcmUgKSApIHtcblxuXHRcdFx0Ly8gQ2hvb3NlIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgaXMgcmVsYXRlZCB0byBvdXIgcHJlZmVycmVkIGRvY3VtZW50XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0aWYgKCBhID09IGRvY3VtZW50IHx8IGEub3duZXJEb2N1bWVudCA9PSBwcmVmZXJyZWREb2MgJiZcblx0XHRcdFx0Y29udGFpbnMoIHByZWZlcnJlZERvYywgYSApICkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRpZiAoIGIgPT0gZG9jdW1lbnQgfHwgYi5vd25lckRvY3VtZW50ID09IHByZWZlcnJlZERvYyAmJlxuXHRcdFx0XHRjb250YWlucyggcHJlZmVycmVkRG9jLCBiICkgKSB7XG5cdFx0XHRcdHJldHVybiAxO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYWludGFpbiBvcmlnaW5hbCBvcmRlclxuXHRcdFx0cmV0dXJuIHNvcnRJbnB1dCA/XG5cdFx0XHRcdCggaW5kZXhPZiggc29ydElucHV0LCBhICkgLSBpbmRleE9mKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29tcGFyZSAmIDQgPyAtMSA6IDE7XG5cdH0gOlxuXHRmdW5jdGlvbiggYSwgYiApIHtcblxuXHRcdC8vIEV4aXQgZWFybHkgaWYgdGhlIG5vZGVzIGFyZSBpZGVudGljYWxcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXG5cdFx0dmFyIGN1cixcblx0XHRcdGkgPSAwLFxuXHRcdFx0YXVwID0gYS5wYXJlbnROb2RlLFxuXHRcdFx0YnVwID0gYi5wYXJlbnROb2RlLFxuXHRcdFx0YXAgPSBbIGEgXSxcblx0XHRcdGJwID0gWyBiIF07XG5cblx0XHQvLyBQYXJlbnRsZXNzIG5vZGVzIGFyZSBlaXRoZXIgZG9jdW1lbnRzIG9yIGRpc2Nvbm5lY3RlZFxuXHRcdGlmICggIWF1cCB8fCAhYnVwICkge1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG5cdFx0XHRyZXR1cm4gYSA9PSBkb2N1bWVudCA/IC0xIDpcblx0XHRcdFx0YiA9PSBkb2N1bWVudCA/IDEgOlxuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xuXHRcdFx0XHRhdXAgPyAtMSA6XG5cdFx0XHRcdGJ1cCA/IDEgOlxuXHRcdFx0XHRzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cblx0XHQvLyBJZiB0aGUgbm9kZXMgYXJlIHNpYmxpbmdzLCB3ZSBjYW4gZG8gYSBxdWljayBjaGVja1xuXHRcdH0gZWxzZSBpZiAoIGF1cCA9PT0gYnVwICkge1xuXHRcdFx0cmV0dXJuIHNpYmxpbmdDaGVjayggYSwgYiApO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB3ZSBuZWVkIGZ1bGwgbGlzdHMgb2YgdGhlaXIgYW5jZXN0b3JzIGZvciBjb21wYXJpc29uXG5cdFx0Y3VyID0gYTtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdGFwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblx0XHRjdXIgPSBiO1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0YnAudW5zaGlmdCggY3VyICk7XG5cdFx0fVxuXG5cdFx0Ly8gV2FsayBkb3duIHRoZSB0cmVlIGxvb2tpbmcgZm9yIGEgZGlzY3JlcGFuY3lcblx0XHR3aGlsZSAoIGFwWyBpIF0gPT09IGJwWyBpIF0gKSB7XG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGkgP1xuXG5cdFx0XHQvLyBEbyBhIHNpYmxpbmcgY2hlY2sgaWYgdGhlIG5vZGVzIGhhdmUgYSBjb21tb24gYW5jZXN0b3Jcblx0XHRcdHNpYmxpbmdDaGVjayggYXBbIGkgXSwgYnBbIGkgXSApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIG5vZGVzIGluIG91ciBkb2N1bWVudCBzb3J0IGZpcnN0XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0LyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXG5cdFx0XHRhcFsgaSBdID09IHByZWZlcnJlZERvYyA/IC0xIDpcblx0XHRcdGJwWyBpIF0gPT0gcHJlZmVycmVkRG9jID8gMSA6XG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIGVxZXFlcSAqL1xuXHRcdFx0MDtcblx0fTtcblxuXHRyZXR1cm4gZG9jdW1lbnQ7XG59O1xuXG5TaXp6bGUubWF0Y2hlcyA9IGZ1bmN0aW9uKCBleHByLCBlbGVtZW50cyApIHtcblx0cmV0dXJuIFNpenpsZSggZXhwciwgbnVsbCwgbnVsbCwgZWxlbWVudHMgKTtcbn07XG5cblNpenpsZS5tYXRjaGVzU2VsZWN0b3IgPSBmdW5jdGlvbiggZWxlbSwgZXhwciApIHtcblx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblxuXHRpZiAoIHN1cHBvcnQubWF0Y2hlc1NlbGVjdG9yICYmIGRvY3VtZW50SXNIVE1MICYmXG5cdFx0IW5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGVbIGV4cHIgKyBcIiBcIiBdICYmXG5cdFx0KCAhcmJ1Z2d5TWF0Y2hlcyB8fCAhcmJ1Z2d5TWF0Y2hlcy50ZXN0KCBleHByICkgKSAmJlxuXHRcdCggIXJidWdneVFTQSAgICAgfHwgIXJidWdneVFTQS50ZXN0KCBleHByICkgKSApIHtcblxuXHRcdHRyeSB7XG5cdFx0XHR2YXIgcmV0ID0gbWF0Y2hlcy5jYWxsKCBlbGVtLCBleHByICk7XG5cblx0XHRcdC8vIElFIDkncyBtYXRjaGVzU2VsZWN0b3IgcmV0dXJucyBmYWxzZSBvbiBkaXNjb25uZWN0ZWQgbm9kZXNcblx0XHRcdGlmICggcmV0IHx8IHN1cHBvcnQuZGlzY29ubmVjdGVkTWF0Y2ggfHxcblxuXHRcdFx0XHQvLyBBcyB3ZWxsLCBkaXNjb25uZWN0ZWQgbm9kZXMgYXJlIHNhaWQgdG8gYmUgaW4gYSBkb2N1bWVudFxuXHRcdFx0XHQvLyBmcmFnbWVudCBpbiBJRSA5XG5cdFx0XHRcdGVsZW0uZG9jdW1lbnQgJiYgZWxlbS5kb2N1bWVudC5ub2RlVHlwZSAhPT0gMTEgKSB7XG5cdFx0XHRcdHJldHVybiByZXQ7XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRub25uYXRpdmVTZWxlY3RvckNhY2hlKCBleHByLCB0cnVlICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFNpenpsZSggZXhwciwgZG9jdW1lbnQsIG51bGwsIFsgZWxlbSBdICkubGVuZ3RoID4gMDtcbn07XG5cblNpenpsZS5jb250YWlucyA9IGZ1bmN0aW9uKCBjb250ZXh0LCBlbGVtICkge1xuXG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoICggY29udGV4dC5vd25lckRvY3VtZW50IHx8IGNvbnRleHQgKSAhPSBkb2N1bWVudCApIHtcblx0XHRzZXREb2N1bWVudCggY29udGV4dCApO1xuXHR9XG5cdHJldHVybiBjb250YWlucyggY29udGV4dCwgZWxlbSApO1xufTtcblxuU2l6emxlLmF0dHIgPSBmdW5jdGlvbiggZWxlbSwgbmFtZSApIHtcblxuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkgIT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0fVxuXG5cdHZhciBmbiA9IEV4cHIuYXR0ckhhbmRsZVsgbmFtZS50b0xvd2VyQ2FzZSgpIF0sXG5cblx0XHQvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IE9iamVjdC5wcm90b3R5cGUgcHJvcGVydGllcyAoalF1ZXJ5ICMxMzgwNylcblx0XHR2YWwgPSBmbiAmJiBoYXNPd24uY2FsbCggRXhwci5hdHRySGFuZGxlLCBuYW1lLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRmbiggZWxlbSwgbmFtZSwgIWRvY3VtZW50SXNIVE1MICkgOlxuXHRcdFx0dW5kZWZpbmVkO1xuXG5cdHJldHVybiB2YWwgIT09IHVuZGVmaW5lZCA/XG5cdFx0dmFsIDpcblx0XHRzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWRvY3VtZW50SXNIVE1MID9cblx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lICkgOlxuXHRcdFx0KCB2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSApICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRudWxsO1xufTtcblxuU2l6emxlLmVzY2FwZSA9IGZ1bmN0aW9uKCBzZWwgKSB7XG5cdHJldHVybiAoIHNlbCArIFwiXCIgKS5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XG59O1xuXG5TaXp6bGUuZXJyb3IgPSBmdW5jdGlvbiggbXNnICkge1xuXHR0aHJvdyBuZXcgRXJyb3IoIFwiU3ludGF4IGVycm9yLCB1bnJlY29nbml6ZWQgZXhwcmVzc2lvbjogXCIgKyBtc2cgKTtcbn07XG5cbi8qKlxuICogRG9jdW1lbnQgc29ydGluZyBhbmQgcmVtb3ZpbmcgZHVwbGljYXRlc1xuICogQHBhcmFtIHtBcnJheUxpa2V9IHJlc3VsdHNcbiAqL1xuU2l6emxlLnVuaXF1ZVNvcnQgPSBmdW5jdGlvbiggcmVzdWx0cyApIHtcblx0dmFyIGVsZW0sXG5cdFx0ZHVwbGljYXRlcyA9IFtdLFxuXHRcdGogPSAwLFxuXHRcdGkgPSAwO1xuXG5cdC8vIFVubGVzcyB3ZSAqa25vdyogd2UgY2FuIGRldGVjdCBkdXBsaWNhdGVzLCBhc3N1bWUgdGhlaXIgcHJlc2VuY2Vcblx0aGFzRHVwbGljYXRlID0gIXN1cHBvcnQuZGV0ZWN0RHVwbGljYXRlcztcblx0c29ydElucHV0ID0gIXN1cHBvcnQuc29ydFN0YWJsZSAmJiByZXN1bHRzLnNsaWNlKCAwICk7XG5cdHJlc3VsdHMuc29ydCggc29ydE9yZGVyICk7XG5cblx0aWYgKCBoYXNEdXBsaWNhdGUgKSB7XG5cdFx0d2hpbGUgKCAoIGVsZW0gPSByZXN1bHRzWyBpKysgXSApICkge1xuXHRcdFx0aWYgKCBlbGVtID09PSByZXN1bHRzWyBpIF0gKSB7XG5cdFx0XHRcdGogPSBkdXBsaWNhdGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0d2hpbGUgKCBqLS0gKSB7XG5cdFx0XHRyZXN1bHRzLnNwbGljZSggZHVwbGljYXRlc1sgaiBdLCAxICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ2xlYXIgaW5wdXQgYWZ0ZXIgc29ydGluZyB0byByZWxlYXNlIG9iamVjdHNcblx0Ly8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvc2l6emxlL3B1bGwvMjI1XG5cdHNvcnRJbnB1dCA9IG51bGw7XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vKipcbiAqIFV0aWxpdHkgZnVuY3Rpb24gZm9yIHJldHJpZXZpbmcgdGhlIHRleHQgdmFsdWUgb2YgYW4gYXJyYXkgb2YgRE9NIG5vZGVzXG4gKiBAcGFyYW0ge0FycmF5fEVsZW1lbnR9IGVsZW1cbiAqL1xuZ2V0VGV4dCA9IFNpenpsZS5nZXRUZXh0ID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHZhciBub2RlLFxuXHRcdHJldCA9IFwiXCIsXG5cdFx0aSA9IDAsXG5cdFx0bm9kZVR5cGUgPSBlbGVtLm5vZGVUeXBlO1xuXG5cdGlmICggIW5vZGVUeXBlICkge1xuXG5cdFx0Ly8gSWYgbm8gbm9kZVR5cGUsIHRoaXMgaXMgZXhwZWN0ZWQgdG8gYmUgYW4gYXJyYXlcblx0XHR3aGlsZSAoICggbm9kZSA9IGVsZW1bIGkrKyBdICkgKSB7XG5cblx0XHRcdC8vIERvIG5vdCB0cmF2ZXJzZSBjb21tZW50IG5vZGVzXG5cdFx0XHRyZXQgKz0gZ2V0VGV4dCggbm9kZSApO1xuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDEgfHwgbm9kZVR5cGUgPT09IDkgfHwgbm9kZVR5cGUgPT09IDExICkge1xuXG5cdFx0Ly8gVXNlIHRleHRDb250ZW50IGZvciBlbGVtZW50c1xuXHRcdC8vIGlubmVyVGV4dCB1c2FnZSByZW1vdmVkIGZvciBjb25zaXN0ZW5jeSBvZiBuZXcgbGluZXMgKGpRdWVyeSAjMTExNTMpXG5cdFx0aWYgKCB0eXBlb2YgZWxlbS50ZXh0Q29udGVudCA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLnRleHRDb250ZW50O1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdC8vIFRyYXZlcnNlIGl0cyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdHJldCArPSBnZXRUZXh0KCBlbGVtICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMyB8fCBub2RlVHlwZSA9PT0gNCApIHtcblx0XHRyZXR1cm4gZWxlbS5ub2RlVmFsdWU7XG5cdH1cblxuXHQvLyBEbyBub3QgaW5jbHVkZSBjb21tZW50IG9yIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24gbm9kZXNcblxuXHRyZXR1cm4gcmV0O1xufTtcblxuRXhwciA9IFNpenpsZS5zZWxlY3RvcnMgPSB7XG5cblx0Ly8gQ2FuIGJlIGFkanVzdGVkIGJ5IHRoZSB1c2VyXG5cdGNhY2hlTGVuZ3RoOiA1MCxcblxuXHRjcmVhdGVQc2V1ZG86IG1hcmtGdW5jdGlvbixcblxuXHRtYXRjaDogbWF0Y2hFeHByLFxuXG5cdGF0dHJIYW5kbGU6IHt9LFxuXG5cdGZpbmQ6IHt9LFxuXG5cdHJlbGF0aXZlOiB7XG5cdFx0XCI+XCI6IHsgZGlyOiBcInBhcmVudE5vZGVcIiwgZmlyc3Q6IHRydWUgfSxcblx0XHRcIiBcIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiIH0sXG5cdFx0XCIrXCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiflwiOiB7IGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIiB9XG5cdH0sXG5cblx0cHJlRmlsdGVyOiB7XG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdG1hdGNoWyAxIF0gPSBtYXRjaFsgMSBdLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIGdpdmVuIHZhbHVlIHRvIG1hdGNoWzNdIHdoZXRoZXIgcXVvdGVkIG9yIHVucXVvdGVkXG5cdFx0XHRtYXRjaFsgMyBdID0gKCBtYXRjaFsgMyBdIHx8IG1hdGNoWyA0IF0gfHxcblx0XHRcdFx0bWF0Y2hbIDUgXSB8fCBcIlwiICkucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblxuXHRcdFx0aWYgKCBtYXRjaFsgMiBdID09PSBcIn49XCIgKSB7XG5cdFx0XHRcdG1hdGNoWyAzIF0gPSBcIiBcIiArIG1hdGNoWyAzIF0gKyBcIiBcIjtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoLnNsaWNlKCAwLCA0ICk7XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXG5cdFx0XHQvKiBtYXRjaGVzIGZyb20gbWF0Y2hFeHByW1wiQ0hJTERcIl1cblx0XHRcdFx0MSB0eXBlIChvbmx5fG50aHwuLi4pXG5cdFx0XHRcdDIgd2hhdCAoY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0MyBhcmd1bWVudCAoZXZlbnxvZGR8XFxkKnxcXGQqbihbKy1dXFxkKyk/fC4uLilcblx0XHRcdFx0NCB4bi1jb21wb25lbnQgb2YgeG4reSBhcmd1bWVudCAoWystXT9cXGQqbnwpXG5cdFx0XHRcdDUgc2lnbiBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NiB4IG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ3IHNpZ24gb2YgeS1jb21wb25lbnRcblx0XHRcdFx0OCB5IG9mIHktY29tcG9uZW50XG5cdFx0XHQqL1xuXHRcdFx0bWF0Y2hbIDEgXSA9IG1hdGNoWyAxIF0udG9Mb3dlckNhc2UoKTtcblxuXHRcdFx0aWYgKCBtYXRjaFsgMSBdLnNsaWNlKCAwLCAzICkgPT09IFwibnRoXCIgKSB7XG5cblx0XHRcdFx0Ly8gbnRoLSogcmVxdWlyZXMgYXJndW1lbnRcblx0XHRcdFx0aWYgKCAhbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWyAwIF0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIG51bWVyaWMgeCBhbmQgeSBwYXJhbWV0ZXJzIGZvciBFeHByLmZpbHRlci5DSElMRFxuXHRcdFx0XHQvLyByZW1lbWJlciB0aGF0IGZhbHNlL3RydWUgY2FzdCByZXNwZWN0aXZlbHkgdG8gMC8xXG5cdFx0XHRcdG1hdGNoWyA0IF0gPSArKCBtYXRjaFsgNCBdID9cblx0XHRcdFx0XHRtYXRjaFsgNSBdICsgKCBtYXRjaFsgNiBdIHx8IDEgKSA6XG5cdFx0XHRcdFx0MiAqICggbWF0Y2hbIDMgXSA9PT0gXCJldmVuXCIgfHwgbWF0Y2hbIDMgXSA9PT0gXCJvZGRcIiApICk7XG5cdFx0XHRcdG1hdGNoWyA1IF0gPSArKCAoIG1hdGNoWyA3IF0gKyBtYXRjaFsgOCBdICkgfHwgbWF0Y2hbIDMgXSA9PT0gXCJvZGRcIiApO1xuXG5cdFx0XHRcdC8vIG90aGVyIHR5cGVzIHByb2hpYml0IGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFsgMCBdICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblx0XHR9LFxuXG5cdFx0XCJQU0VVRE9cIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0dmFyIGV4Y2Vzcyxcblx0XHRcdFx0dW5xdW90ZWQgPSAhbWF0Y2hbIDYgXSAmJiBtYXRjaFsgMiBdO1xuXG5cdFx0XHRpZiAoIG1hdGNoRXhwclsgXCJDSElMRFwiIF0udGVzdCggbWF0Y2hbIDAgXSApICkge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWNjZXB0IHF1b3RlZCBhcmd1bWVudHMgYXMtaXNcblx0XHRcdGlmICggbWF0Y2hbIDMgXSApIHtcblx0XHRcdFx0bWF0Y2hbIDIgXSA9IG1hdGNoWyA0IF0gfHwgbWF0Y2hbIDUgXSB8fCBcIlwiO1xuXG5cdFx0XHQvLyBTdHJpcCBleGNlc3MgY2hhcmFjdGVycyBmcm9tIHVucXVvdGVkIGFyZ3VtZW50c1xuXHRcdFx0fSBlbHNlIGlmICggdW5xdW90ZWQgJiYgcnBzZXVkby50ZXN0KCB1bnF1b3RlZCApICYmXG5cblx0XHRcdFx0Ly8gR2V0IGV4Y2VzcyBmcm9tIHRva2VuaXplIChyZWN1cnNpdmVseSlcblx0XHRcdFx0KCBleGNlc3MgPSB0b2tlbml6ZSggdW5xdW90ZWQsIHRydWUgKSApICYmXG5cblx0XHRcdFx0Ly8gYWR2YW5jZSB0byB0aGUgbmV4dCBjbG9zaW5nIHBhcmVudGhlc2lzXG5cdFx0XHRcdCggZXhjZXNzID0gdW5xdW90ZWQuaW5kZXhPZiggXCIpXCIsIHVucXVvdGVkLmxlbmd0aCAtIGV4Y2VzcyApIC0gdW5xdW90ZWQubGVuZ3RoICkgKSB7XG5cblx0XHRcdFx0Ly8gZXhjZXNzIGlzIGEgbmVnYXRpdmUgaW5kZXhcblx0XHRcdFx0bWF0Y2hbIDAgXSA9IG1hdGNoWyAwIF0uc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0XHRtYXRjaFsgMiBdID0gdW5xdW90ZWQuc2xpY2UoIDAsIGV4Y2VzcyApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZXR1cm4gb25seSBjYXB0dXJlcyBuZWVkZWQgYnkgdGhlIHBzZXVkbyBmaWx0ZXIgbWV0aG9kICh0eXBlIGFuZCBhcmd1bWVudClcblx0XHRcdHJldHVybiBtYXRjaC5zbGljZSggMCwgMyApO1xuXHRcdH1cblx0fSxcblxuXHRmaWx0ZXI6IHtcblxuXHRcdFwiVEFHXCI6IGZ1bmN0aW9uKCBub2RlTmFtZVNlbGVjdG9yICkge1xuXHRcdFx0dmFyIG5vZGVOYW1lID0gbm9kZU5hbWVTZWxlY3Rvci5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbm9kZU5hbWVTZWxlY3RvciA9PT0gXCIqXCIgP1xuXHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbm9kZU5hbWU7XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0xBU1NcIjogZnVuY3Rpb24oIGNsYXNzTmFtZSApIHtcblx0XHRcdHZhciBwYXR0ZXJuID0gY2xhc3NDYWNoZVsgY2xhc3NOYW1lICsgXCIgXCIgXTtcblxuXHRcdFx0cmV0dXJuIHBhdHRlcm4gfHxcblx0XHRcdFx0KCBwYXR0ZXJuID0gbmV3IFJlZ0V4cCggXCIoXnxcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XHRcdFwiKVwiICsgY2xhc3NOYW1lICsgXCIoXCIgKyB3aGl0ZXNwYWNlICsgXCJ8JClcIiApICkgJiYgY2xhc3NDYWNoZShcblx0XHRcdFx0XHRcdGNsYXNzTmFtZSwgZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBwYXR0ZXJuLnRlc3QoXG5cdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGVsZW0uY2xhc3NOYW1lID09PSBcInN0cmluZ1wiICYmIGVsZW0uY2xhc3NOYW1lIHx8XG5cdFx0XHRcdFx0XHRcdFx0dHlwZW9mIGVsZW0uZ2V0QXR0cmlidXRlICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggXCJjbGFzc1wiICkgfHxcblx0XHRcdFx0XHRcdFx0XHRcIlwiXG5cdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0gKTtcblx0XHR9LFxuXG5cdFx0XCJBVFRSXCI6IGZ1bmN0aW9uKCBuYW1lLCBvcGVyYXRvciwgY2hlY2sgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBTaXp6bGUuYXR0ciggZWxlbSwgbmFtZSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIiE9XCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCAhb3BlcmF0b3IgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXN1bHQgKz0gXCJcIjtcblxuXHRcdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cblx0XHRcdFx0cmV0dXJuIG9wZXJhdG9yID09PSBcIj1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiE9XCIgPyByZXN1bHQgIT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJePVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPT09IDAgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIio9XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIkPVwiID8gY2hlY2sgJiYgcmVzdWx0LnNsaWNlKCAtY2hlY2subGVuZ3RoICkgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ+PVwiID8gKCBcIiBcIiArIHJlc3VsdC5yZXBsYWNlKCByd2hpdGVzcGFjZSwgXCIgXCIgKSArIFwiIFwiICkuaW5kZXhPZiggY2hlY2sgKSA+IC0xIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCJ8PVwiID8gcmVzdWx0ID09PSBjaGVjayB8fCByZXN1bHQuc2xpY2UoIDAsIGNoZWNrLmxlbmd0aCArIDEgKSA9PT0gY2hlY2sgKyBcIi1cIiA6XG5cdFx0XHRcdFx0ZmFsc2U7XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgbWF4LWxlbiAqL1xuXG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCB0eXBlLCB3aGF0LCBfYXJndW1lbnQsIGZpcnN0LCBsYXN0ICkge1xuXHRcdFx0dmFyIHNpbXBsZSA9IHR5cGUuc2xpY2UoIDAsIDMgKSAhPT0gXCJudGhcIixcblx0XHRcdFx0Zm9yd2FyZCA9IHR5cGUuc2xpY2UoIC00ICkgIT09IFwibGFzdFwiLFxuXHRcdFx0XHRvZlR5cGUgPSB3aGF0ID09PSBcIm9mLXR5cGVcIjtcblxuXHRcdFx0cmV0dXJuIGZpcnN0ID09PSAxICYmIGxhc3QgPT09IDAgP1xuXG5cdFx0XHRcdC8vIFNob3J0Y3V0IGZvciA6bnRoLSoobilcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuICEhZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0XHR9IDpcblxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgY2FjaGUsIHVuaXF1ZUNhY2hlLCBvdXRlckNhY2hlLCBub2RlLCBub2RlSW5kZXgsIHN0YXJ0LFxuXHRcdFx0XHRcdFx0ZGlyID0gc2ltcGxlICE9PSBmb3J3YXJkID8gXCJuZXh0U2libGluZ1wiIDogXCJwcmV2aW91c1NpYmxpbmdcIixcblx0XHRcdFx0XHRcdHBhcmVudCA9IGVsZW0ucGFyZW50Tm9kZSxcblx0XHRcdFx0XHRcdG5hbWUgPSBvZlR5cGUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxuXHRcdFx0XHRcdFx0dXNlQ2FjaGUgPSAheG1sICYmICFvZlR5cGUsXG5cdFx0XHRcdFx0XHRkaWZmID0gZmFsc2U7XG5cblx0XHRcdFx0XHRpZiAoIHBhcmVudCApIHtcblxuXHRcdFx0XHRcdFx0Ly8gOihmaXJzdHxsYXN0fG9ubHkpLShjaGlsZHxvZi10eXBlKVxuXHRcdFx0XHRcdFx0aWYgKCBzaW1wbGUgKSB7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICggZGlyICkge1xuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gbm9kZVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdGlmICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gUmV2ZXJzZSBkaXJlY3Rpb24gZm9yIDpvbmx5LSogKGlmIHdlIGhhdmVuJ3QgeWV0IGRvbmUgc28pXG5cdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBkaXIgPSB0eXBlID09PSBcIm9ubHlcIiAmJiAhc3RhcnQgJiYgXCJuZXh0U2libGluZ1wiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRzdGFydCA9IFsgZm9yd2FyZCA/IHBhcmVudC5maXJzdENoaWxkIDogcGFyZW50Lmxhc3RDaGlsZCBdO1xuXG5cdFx0XHRcdFx0XHQvLyBub24teG1sIDpudGgtY2hpbGQoLi4uKSBzdG9yZXMgY2FjaGUgZGF0YSBvbiBgcGFyZW50YFxuXHRcdFx0XHRcdFx0aWYgKCBmb3J3YXJkICYmIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFNlZWsgYGVsZW1gIGZyb20gYSBwcmV2aW91c2x5LWNhY2hlZCBpbmRleFxuXG5cdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0bm9kZSA9IHBhcmVudDtcblx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0Y2FjaGUgPSB1bmlxdWVDYWNoZVsgdHlwZSBdIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdGRpZmYgPSBub2RlSW5kZXggJiYgY2FjaGVbIDIgXTtcblx0XHRcdFx0XHRcdFx0bm9kZSA9IG5vZGVJbmRleCAmJiBwYXJlbnQuY2hpbGROb2Rlc1sgbm9kZUluZGV4IF07XG5cblx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSArK25vZGVJbmRleCAmJiBub2RlICYmIG5vZGVbIGRpciBdIHx8XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBGYWxsYmFjayB0byBzZWVraW5nIGBlbGVtYCBmcm9tIHRoZSBzdGFydFxuXHRcdFx0XHRcdFx0XHRcdCggZGlmZiA9IG5vZGVJbmRleCA9IDAgKSB8fCBzdGFydC5wb3AoKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gV2hlbiBmb3VuZCwgY2FjaGUgaW5kZXhlcyBvbiBgcGFyZW50YCBhbmQgYnJlYWtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIG5vZGUubm9kZVR5cGUgPT09IDEgJiYgKytkaWZmICYmIG5vZGUgPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsgdHlwZSBdID0gWyBkaXJydW5zLCBub2RlSW5kZXgsIGRpZmYgXTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFVzZSBwcmV2aW91c2x5LWNhY2hlZCBlbGVtZW50IGluZGV4IGlmIGF2YWlsYWJsZVxuXHRcdFx0XHRcdFx0XHRpZiAoIHVzZUNhY2hlICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtO1xuXHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBjYWNoZVsgMSBdO1xuXHRcdFx0XHRcdFx0XHRcdGRpZmYgPSBub2RlSW5kZXg7XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHQvLyB4bWwgOm50aC1jaGlsZCguLi4pXG5cdFx0XHRcdFx0XHRcdC8vIG9yIDpudGgtbGFzdC1jaGlsZCguLi4pIG9yIDpudGgoLWxhc3QpPy1vZi10eXBlKC4uLilcblx0XHRcdFx0XHRcdFx0aWYgKCBkaWZmID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFVzZSB0aGUgc2FtZSBsb29wIGFzIGFib3ZlIHRvIHNlZWsgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSArK25vZGVJbmRleCAmJiBub2RlICYmIG5vZGVbIGRpciBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHQoIGRpZmYgPSBub2RlSW5kZXggPSAwICkgfHwgc3RhcnQucG9wKCkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCAoIG9mVHlwZSA/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSA6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZVR5cGUgPT09IDEgKSAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrK2RpZmYgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gQ2FjaGUgdGhlIGluZGV4IG9mIGVhY2ggZW5jb3VudGVyZWQgZWxlbWVudFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHVzZUNhY2hlICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIEluY29ycG9yYXRlIHRoZSBvZmZzZXQsIHRoZW4gY2hlY2sgYWdhaW5zdCBjeWNsZSBzaXplXG5cdFx0XHRcdFx0XHRkaWZmIC09IGxhc3Q7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGlmZiA9PT0gZmlyc3QgfHwgKCBkaWZmICUgZmlyc3QgPT09IDAgJiYgZGlmZiAvIGZpcnN0ID49IDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBwc2V1ZG8sIGFyZ3VtZW50ICkge1xuXG5cdFx0XHQvLyBwc2V1ZG8tY2xhc3MgbmFtZXMgYXJlIGNhc2UtaW5zZW5zaXRpdmVcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jcHNldWRvLWNsYXNzZXNcblx0XHRcdC8vIFByaW9yaXRpemUgYnkgY2FzZSBzZW5zaXRpdml0eSBpbiBjYXNlIGN1c3RvbSBwc2V1ZG9zIGFyZSBhZGRlZCB3aXRoIHVwcGVyY2FzZSBsZXR0ZXJzXG5cdFx0XHQvLyBSZW1lbWJlciB0aGF0IHNldEZpbHRlcnMgaW5oZXJpdHMgZnJvbSBwc2V1ZG9zXG5cdFx0XHR2YXIgYXJncyxcblx0XHRcdFx0Zm4gPSBFeHByLnBzZXVkb3NbIHBzZXVkbyBdIHx8IEV4cHIuc2V0RmlsdGVyc1sgcHNldWRvLnRvTG93ZXJDYXNlKCkgXSB8fFxuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiICsgcHNldWRvICk7XG5cblx0XHRcdC8vIFRoZSB1c2VyIG1heSB1c2UgY3JlYXRlUHNldWRvIHRvIGluZGljYXRlIHRoYXRcblx0XHRcdC8vIGFyZ3VtZW50cyBhcmUgbmVlZGVkIHRvIGNyZWF0ZSB0aGUgZmlsdGVyIGZ1bmN0aW9uXG5cdFx0XHQvLyBqdXN0IGFzIFNpenpsZSBkb2VzXG5cdFx0XHRpZiAoIGZuWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHJldHVybiBmbiggYXJndW1lbnQgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQnV0IG1haW50YWluIHN1cHBvcnQgZm9yIG9sZCBzaWduYXR1cmVzXG5cdFx0XHRpZiAoIGZuLmxlbmd0aCA+IDEgKSB7XG5cdFx0XHRcdGFyZ3MgPSBbIHBzZXVkbywgcHNldWRvLCBcIlwiLCBhcmd1bWVudCBdO1xuXHRcdFx0XHRyZXR1cm4gRXhwci5zZXRGaWx0ZXJzLmhhc093blByb3BlcnR5KCBwc2V1ZG8udG9Mb3dlckNhc2UoKSApID9cblx0XHRcdFx0XHRtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIGlkeCxcblx0XHRcdFx0XHRcdFx0bWF0Y2hlZCA9IGZuKCBzZWVkLCBhcmd1bWVudCApLFxuXHRcdFx0XHRcdFx0XHRpID0gbWF0Y2hlZC5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWR4ID0gaW5kZXhPZiggc2VlZCwgbWF0Y2hlZFsgaSBdICk7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGlkeCBdID0gISggbWF0Y2hlc1sgaWR4IF0gPSBtYXRjaGVkWyBpIF0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGZuKCBlbGVtLCAwLCBhcmdzICk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZuO1xuXHRcdH1cblx0fSxcblxuXHRwc2V1ZG9zOiB7XG5cblx0XHQvLyBQb3RlbnRpYWxseSBjb21wbGV4IHBzZXVkb3Ncblx0XHRcIm5vdFwiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblxuXHRcdFx0Ly8gVHJpbSB0aGUgc2VsZWN0b3IgcGFzc2VkIHRvIGNvbXBpbGVcblx0XHRcdC8vIHRvIGF2b2lkIHRyZWF0aW5nIGxlYWRpbmcgYW5kIHRyYWlsaW5nXG5cdFx0XHQvLyBzcGFjZXMgYXMgY29tYmluYXRvcnNcblx0XHRcdHZhciBpbnB1dCA9IFtdLFxuXHRcdFx0XHRyZXN1bHRzID0gW10sXG5cdFx0XHRcdG1hdGNoZXIgPSBjb21waWxlKCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICkgKTtcblxuXHRcdFx0cmV0dXJuIG1hdGNoZXJbIGV4cGFuZG8gXSA/XG5cdFx0XHRcdG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMsIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQgPSBtYXRjaGVyKCBzZWVkLCBudWxsLCB4bWwsIFtdICksXG5cdFx0XHRcdFx0XHRpID0gc2VlZC5sZW5ndGg7XG5cblx0XHRcdFx0XHQvLyBNYXRjaCBlbGVtZW50cyB1bm1hdGNoZWQgYnkgYG1hdGNoZXJgXG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IHVubWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdHNlZWRbIGkgXSA9ICEoIG1hdGNoZXNbIGkgXSA9IGVsZW0gKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKSA6XG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdGlucHV0WyAwIF0gPSBlbGVtO1xuXHRcdFx0XHRcdG1hdGNoZXIoIGlucHV0LCBudWxsLCB4bWwsIHJlc3VsdHMgKTtcblxuXHRcdFx0XHRcdC8vIERvbid0IGtlZXAgdGhlIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRcdFx0aW5wdXRbIDAgXSA9IG51bGw7XG5cdFx0XHRcdFx0cmV0dXJuICFyZXN1bHRzLnBvcCgpO1xuXHRcdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdFwiaGFzXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gU2l6emxlKCBzZWxlY3RvciwgZWxlbSApLmxlbmd0aCA+IDA7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdFwiY29udGFpbnNcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRcdHRleHQgPSB0ZXh0LnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiAoIGVsZW0udGV4dENvbnRlbnQgfHwgZ2V0VGV4dCggZWxlbSApICkuaW5kZXhPZiggdGV4dCApID4gLTE7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdC8vIFwiV2hldGhlciBhbiBlbGVtZW50IGlzIHJlcHJlc2VudGVkIGJ5IGEgOmxhbmcoKSBzZWxlY3RvclxuXHRcdC8vIGlzIGJhc2VkIHNvbGVseSBvbiB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlXG5cdFx0Ly8gYmVpbmcgZXF1YWwgdG8gdGhlIGlkZW50aWZpZXIgQyxcblx0XHQvLyBvciBiZWdpbm5pbmcgd2l0aCB0aGUgaWRlbnRpZmllciBDIGltbWVkaWF0ZWx5IGZvbGxvd2VkIGJ5IFwiLVwiLlxuXHRcdC8vIFRoZSBtYXRjaGluZyBvZiBDIGFnYWluc3QgdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZSBpcyBwZXJmb3JtZWQgY2FzZS1pbnNlbnNpdGl2ZWx5LlxuXHRcdC8vIFRoZSBpZGVudGlmaWVyIEMgZG9lcyBub3QgaGF2ZSB0byBiZSBhIHZhbGlkIGxhbmd1YWdlIG5hbWUuXCJcblx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2xhbmctcHNldWRvXG5cdFx0XCJsYW5nXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIGxhbmcgKSB7XG5cblx0XHRcdC8vIGxhbmcgdmFsdWUgbXVzdCBiZSBhIHZhbGlkIGlkZW50aWZpZXJcblx0XHRcdGlmICggIXJpZGVudGlmaWVyLnRlc3QoIGxhbmcgfHwgXCJcIiApICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgbGFuZzogXCIgKyBsYW5nICk7XG5cdFx0XHR9XG5cdFx0XHRsYW5nID0gbGFuZy5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBlbGVtTGFuZztcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdGlmICggKCBlbGVtTGFuZyA9IGRvY3VtZW50SXNIVE1MID9cblx0XHRcdFx0XHRcdGVsZW0ubGFuZyA6XG5cdFx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggXCJ4bWw6bGFuZ1wiICkgfHwgZWxlbS5nZXRBdHRyaWJ1dGUoIFwibGFuZ1wiICkgKSApIHtcblxuXHRcdFx0XHRcdFx0ZWxlbUxhbmcgPSBlbGVtTGFuZy50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW1MYW5nID09PSBsYW5nIHx8IGVsZW1MYW5nLmluZGV4T2YoIGxhbmcgKyBcIi1cIiApID09PSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSB3aGlsZSAoICggZWxlbSA9IGVsZW0ucGFyZW50Tm9kZSApICYmIGVsZW0ubm9kZVR5cGUgPT09IDEgKTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHQvLyBNaXNjZWxsYW5lb3VzXG5cdFx0XCJ0YXJnZXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbiAmJiB3aW5kb3cubG9jYXRpb24uaGFzaDtcblx0XHRcdHJldHVybiBoYXNoICYmIGhhc2guc2xpY2UoIDEgKSA9PT0gZWxlbS5pZDtcblx0XHR9LFxuXG5cdFx0XCJyb290XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY0VsZW07XG5cdFx0fSxcblxuXHRcdFwiZm9jdXNcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJlxuXHRcdFx0XHQoICFkb2N1bWVudC5oYXNGb2N1cyB8fCBkb2N1bWVudC5oYXNGb2N1cygpICkgJiZcblx0XHRcdFx0ISEoIGVsZW0udHlwZSB8fCBlbGVtLmhyZWYgfHwgfmVsZW0udGFiSW5kZXggKTtcblx0XHR9LFxuXG5cdFx0Ly8gQm9vbGVhbiBwcm9wZXJ0aWVzXG5cdFx0XCJlbmFibGVkXCI6IGNyZWF0ZURpc2FibGVkUHNldWRvKCBmYWxzZSApLFxuXHRcdFwiZGlzYWJsZWRcIjogY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIHRydWUgKSxcblxuXHRcdFwiY2hlY2tlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gSW4gQ1NTMywgOmNoZWNrZWQgc2hvdWxkIHJldHVybiBib3RoIGNoZWNrZWQgYW5kIHNlbGVjdGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0dmFyIG5vZGVOYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuICggbm9kZU5hbWUgPT09IFwiaW5wdXRcIiAmJiAhIWVsZW0uY2hlY2tlZCApIHx8XG5cdFx0XHRcdCggbm9kZU5hbWUgPT09IFwib3B0aW9uXCIgJiYgISFlbGVtLnNlbGVjdGVkICk7XG5cdFx0fSxcblxuXHRcdFwic2VsZWN0ZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIEFjY2Vzc2luZyB0aGlzIHByb3BlcnR5IG1ha2VzIHNlbGVjdGVkLWJ5LWRlZmF1bHRcblx0XHRcdC8vIG9wdGlvbnMgaW4gU2FmYXJpIHdvcmsgcHJvcGVybHlcblx0XHRcdGlmICggZWxlbS5wYXJlbnROb2RlICkge1xuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdFx0XHRcdGVsZW0ucGFyZW50Tm9kZS5zZWxlY3RlZEluZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbS5zZWxlY3RlZCA9PT0gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0Ly8gQ29udGVudHNcblx0XHRcImVtcHR5XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI2VtcHR5LXBzZXVkb1xuXHRcdFx0Ly8gOmVtcHR5IGlzIG5lZ2F0ZWQgYnkgZWxlbWVudCAoMSkgb3IgY29udGVudCBub2RlcyAodGV4dDogMzsgY2RhdGE6IDQ7IGVudGl0eSByZWY6IDUpLFxuXHRcdFx0Ly8gICBidXQgbm90IGJ5IG90aGVycyAoY29tbWVudDogODsgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbjogNzsgZXRjLilcblx0XHRcdC8vIG5vZGVUeXBlIDwgNiB3b3JrcyBiZWNhdXNlIGF0dHJpYnV0ZXMgKDIpIGRvIG5vdCBhcHBlYXIgYXMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPCA2ICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSxcblxuXHRcdFwicGFyZW50XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuICFFeHByLnBzZXVkb3NbIFwiZW1wdHlcIiBdKCBlbGVtICk7XG5cdFx0fSxcblxuXHRcdC8vIEVsZW1lbnQvaW5wdXQgdHlwZXNcblx0XHRcImhlYWRlclwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaGVhZGVyLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJpbnB1dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiByaW5wdXRzLnRlc3QoIGVsZW0ubm9kZU5hbWUgKTtcblx0XHR9LFxuXG5cdFx0XCJidXR0b25cIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBuYW1lID09PSBcImlucHV0XCIgJiYgZWxlbS50eXBlID09PSBcImJ1dHRvblwiIHx8IG5hbWUgPT09IFwiYnV0dG9uXCI7XG5cdFx0fSxcblxuXHRcdFwidGV4dFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBhdHRyO1xuXHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICYmXG5cdFx0XHRcdGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCIgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRTw4XG5cdFx0XHRcdC8vIE5ldyBIVE1MNSBhdHRyaWJ1dGUgdmFsdWVzIChlLmcuLCBcInNlYXJjaFwiKSBhcHBlYXIgd2l0aCBlbGVtLnR5cGUgPT09IFwidGV4dFwiXG5cdFx0XHRcdCggKCBhdHRyID0gZWxlbS5nZXRBdHRyaWJ1dGUoIFwidHlwZVwiICkgKSA9PSBudWxsIHx8XG5cdFx0XHRcdFx0YXR0ci50b0xvd2VyQ2FzZSgpID09PSBcInRleHRcIiApO1xuXHRcdH0sXG5cblx0XHQvLyBQb3NpdGlvbi1pbi1jb2xsZWN0aW9uXG5cdFx0XCJmaXJzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbIDAgXTtcblx0XHR9ICksXG5cblx0XHRcImxhc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIF9tYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHJldHVybiBbIGxlbmd0aCAtIDEgXTtcblx0XHR9ICksXG5cblx0XHRcImVxXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBfbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0cmV0dXJuIFsgYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudCBdO1xuXHRcdH0gKSxcblxuXHRcdFwiZXZlblwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDA7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJvZGRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAxO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwibHRcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID9cblx0XHRcdFx0YXJndW1lbnQgKyBsZW5ndGggOlxuXHRcdFx0XHRhcmd1bWVudCA+IGxlbmd0aCA/XG5cdFx0XHRcdFx0bGVuZ3RoIDpcblx0XHRcdFx0XHRhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgLS1pID49IDA7ICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcImd0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7ICsraSA8IGxlbmd0aDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKVxuXHR9XG59O1xuXG5FeHByLnBzZXVkb3NbIFwibnRoXCIgXSA9IEV4cHIucHNldWRvc1sgXCJlcVwiIF07XG5cbi8vIEFkZCBidXR0b24vaW5wdXQgdHlwZSBwc2V1ZG9zXG5mb3IgKCBpIGluIHsgcmFkaW86IHRydWUsIGNoZWNrYm94OiB0cnVlLCBmaWxlOiB0cnVlLCBwYXNzd29yZDogdHJ1ZSwgaW1hZ2U6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVJbnB1dFBzZXVkbyggaSApO1xufVxuZm9yICggaSBpbiB7IHN1Ym1pdDogdHJ1ZSwgcmVzZXQ6IHRydWUgfSApIHtcblx0RXhwci5wc2V1ZG9zWyBpIF0gPSBjcmVhdGVCdXR0b25Qc2V1ZG8oIGkgKTtcbn1cblxuLy8gRWFzeSBBUEkgZm9yIGNyZWF0aW5nIG5ldyBzZXRGaWx0ZXJzXG5mdW5jdGlvbiBzZXRGaWx0ZXJzKCkge31cbnNldEZpbHRlcnMucHJvdG90eXBlID0gRXhwci5maWx0ZXJzID0gRXhwci5wc2V1ZG9zO1xuRXhwci5zZXRGaWx0ZXJzID0gbmV3IHNldEZpbHRlcnMoKTtcblxudG9rZW5pemUgPSBTaXp6bGUudG9rZW5pemUgPSBmdW5jdGlvbiggc2VsZWN0b3IsIHBhcnNlT25seSApIHtcblx0dmFyIG1hdGNoZWQsIG1hdGNoLCB0b2tlbnMsIHR5cGUsXG5cdFx0c29GYXIsIGdyb3VwcywgcHJlRmlsdGVycyxcblx0XHRjYWNoZWQgPSB0b2tlbkNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF07XG5cblx0aWYgKCBjYWNoZWQgKSB7XG5cdFx0cmV0dXJuIHBhcnNlT25seSA/IDAgOiBjYWNoZWQuc2xpY2UoIDAgKTtcblx0fVxuXG5cdHNvRmFyID0gc2VsZWN0b3I7XG5cdGdyb3VwcyA9IFtdO1xuXHRwcmVGaWx0ZXJzID0gRXhwci5wcmVGaWx0ZXI7XG5cblx0d2hpbGUgKCBzb0ZhciApIHtcblxuXHRcdC8vIENvbW1hIGFuZCBmaXJzdCBydW5cblx0XHRpZiAoICFtYXRjaGVkIHx8ICggbWF0Y2ggPSByY29tbWEuZXhlYyggc29GYXIgKSApICkge1xuXHRcdFx0aWYgKCBtYXRjaCApIHtcblxuXHRcdFx0XHQvLyBEb24ndCBjb25zdW1lIHRyYWlsaW5nIGNvbW1hcyBhcyB2YWxpZFxuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaFsgMCBdLmxlbmd0aCApIHx8IHNvRmFyO1xuXHRcdFx0fVxuXHRcdFx0Z3JvdXBzLnB1c2goICggdG9rZW5zID0gW10gKSApO1xuXHRcdH1cblxuXHRcdG1hdGNoZWQgPSBmYWxzZTtcblxuXHRcdC8vIENvbWJpbmF0b3JzXG5cdFx0aWYgKCAoIG1hdGNoID0gcmNvbWJpbmF0b3JzLmV4ZWMoIHNvRmFyICkgKSApIHtcblx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0dG9rZW5zLnB1c2goIHtcblx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cblx0XHRcdFx0Ly8gQ2FzdCBkZXNjZW5kYW50IGNvbWJpbmF0b3JzIHRvIHNwYWNlXG5cdFx0XHRcdHR5cGU6IG1hdGNoWyAwIF0ucmVwbGFjZSggcnRyaW0sIFwiIFwiIClcblx0XHRcdH0gKTtcblx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmlsdGVyc1xuXHRcdGZvciAoIHR5cGUgaW4gRXhwci5maWx0ZXIgKSB7XG5cdFx0XHRpZiAoICggbWF0Y2ggPSBtYXRjaEV4cHJbIHR5cGUgXS5leGVjKCBzb0ZhciApICkgJiYgKCAhcHJlRmlsdGVyc1sgdHlwZSBdIHx8XG5cdFx0XHRcdCggbWF0Y2ggPSBwcmVGaWx0ZXJzWyB0eXBlIF0oIG1hdGNoICkgKSApICkge1xuXHRcdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdFx0dG9rZW5zLnB1c2goIHtcblx0XHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblx0XHRcdFx0XHR0eXBlOiB0eXBlLFxuXHRcdFx0XHRcdG1hdGNoZXM6IG1hdGNoXG5cdFx0XHRcdH0gKTtcblx0XHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hlZC5sZW5ndGggKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoICFtYXRjaGVkICkge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0Ly8gUmV0dXJuIHRoZSBsZW5ndGggb2YgdGhlIGludmFsaWQgZXhjZXNzXG5cdC8vIGlmIHdlJ3JlIGp1c3QgcGFyc2luZ1xuXHQvLyBPdGhlcndpc2UsIHRocm93IGFuIGVycm9yIG9yIHJldHVybiB0b2tlbnNcblx0cmV0dXJuIHBhcnNlT25seSA/XG5cdFx0c29GYXIubGVuZ3RoIDpcblx0XHRzb0ZhciA/XG5cdFx0XHRTaXp6bGUuZXJyb3IoIHNlbGVjdG9yICkgOlxuXG5cdFx0XHQvLyBDYWNoZSB0aGUgdG9rZW5zXG5cdFx0XHR0b2tlbkNhY2hlKCBzZWxlY3RvciwgZ3JvdXBzICkuc2xpY2UoIDAgKTtcbn07XG5cbmZ1bmN0aW9uIHRvU2VsZWN0b3IoIHRva2VucyApIHtcblx0dmFyIGkgPSAwLFxuXHRcdGxlbiA9IHRva2Vucy5sZW5ndGgsXG5cdFx0c2VsZWN0b3IgPSBcIlwiO1xuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRzZWxlY3RvciArPSB0b2tlbnNbIGkgXS52YWx1ZTtcblx0fVxuXHRyZXR1cm4gc2VsZWN0b3I7XG59XG5cbmZ1bmN0aW9uIGFkZENvbWJpbmF0b3IoIG1hdGNoZXIsIGNvbWJpbmF0b3IsIGJhc2UgKSB7XG5cdHZhciBkaXIgPSBjb21iaW5hdG9yLmRpcixcblx0XHRza2lwID0gY29tYmluYXRvci5uZXh0LFxuXHRcdGtleSA9IHNraXAgfHwgZGlyLFxuXHRcdGNoZWNrTm9uRWxlbWVudHMgPSBiYXNlICYmIGtleSA9PT0gXCJwYXJlbnROb2RlXCIsXG5cdFx0ZG9uZU5hbWUgPSBkb25lKys7XG5cblx0cmV0dXJuIGNvbWJpbmF0b3IuZmlyc3QgP1xuXG5cdFx0Ly8gQ2hlY2sgYWdhaW5zdCBjbG9zZXN0IGFuY2VzdG9yL3ByZWNlZGluZyBlbGVtZW50XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSA6XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGFsbCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudHNcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIG9sZENhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSxcblx0XHRcdFx0bmV3Q2FjaGUgPSBbIGRpcnJ1bnMsIGRvbmVOYW1lIF07XG5cblx0XHRcdC8vIFdlIGNhbid0IHNldCBhcmJpdHJhcnkgZGF0YSBvbiBYTUwgbm9kZXMsIHNvIHRoZXkgZG9uJ3QgYmVuZWZpdCBmcm9tIGNvbWJpbmF0b3IgY2FjaGluZ1xuXHRcdFx0aWYgKCB4bWwgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IGVsZW1bIGV4cGFuZG8gXSB8fCAoIGVsZW1bIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBlbGVtLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHNraXAgJiYgc2tpcCA9PT0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICkge1xuXHRcdFx0XHRcdFx0XHRlbGVtID0gZWxlbVsgZGlyIF0gfHwgZWxlbTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoICggb2xkQ2FjaGUgPSB1bmlxdWVDYWNoZVsga2V5IF0gKSAmJlxuXHRcdFx0XHRcdFx0XHRvbGRDYWNoZVsgMCBdID09PSBkaXJydW5zICYmIG9sZENhY2hlWyAxIF0gPT09IGRvbmVOYW1lICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEFzc2lnbiB0byBuZXdDYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHJldHVybiAoIG5ld0NhY2hlWyAyIF0gPSBvbGRDYWNoZVsgMiBdICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJldXNlIG5ld2NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIGtleSBdID0gbmV3Q2FjaGU7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQSBtYXRjaCBtZWFucyB3ZSdyZSBkb25lOyBhIGZhaWwgbWVhbnMgd2UgaGF2ZSB0byBrZWVwIGNoZWNraW5nXG5cdFx0XHRcdFx0XHRcdGlmICggKCBuZXdDYWNoZVsgMiBdID0gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG59XG5cbmZ1bmN0aW9uIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApIHtcblx0cmV0dXJuIG1hdGNoZXJzLmxlbmd0aCA+IDEgP1xuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgaSA9IG1hdGNoZXJzLmxlbmd0aDtcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoICFtYXRjaGVyc1sgaSBdKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gOlxuXHRcdG1hdGNoZXJzWyAwIF07XG59XG5cbmZ1bmN0aW9uIG11bHRpcGxlQ29udGV4dHMoIHNlbGVjdG9yLCBjb250ZXh0cywgcmVzdWx0cyApIHtcblx0dmFyIGkgPSAwLFxuXHRcdGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0U2l6emxlKCBzZWxlY3RvciwgY29udGV4dHNbIGkgXSwgcmVzdWx0cyApO1xuXHR9XG5cdHJldHVybiByZXN1bHRzO1xufVxuXG5mdW5jdGlvbiBjb25kZW5zZSggdW5tYXRjaGVkLCBtYXAsIGZpbHRlciwgY29udGV4dCwgeG1sICkge1xuXHR2YXIgZWxlbSxcblx0XHRuZXdVbm1hdGNoZWQgPSBbXSxcblx0XHRpID0gMCxcblx0XHRsZW4gPSB1bm1hdGNoZWQubGVuZ3RoLFxuXHRcdG1hcHBlZCA9IG1hcCAhPSBudWxsO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKCBlbGVtID0gdW5tYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdGlmICggIWZpbHRlciB8fCBmaWx0ZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRuZXdVbm1hdGNoZWQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRpZiAoIG1hcHBlZCApIHtcblx0XHRcdFx0XHRtYXAucHVzaCggaSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIG5ld1VubWF0Y2hlZDtcbn1cblxuZnVuY3Rpb24gc2V0TWF0Y2hlciggcHJlRmlsdGVyLCBzZWxlY3RvciwgbWF0Y2hlciwgcG9zdEZpbHRlciwgcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICkge1xuXHRpZiAoIHBvc3RGaWx0ZXIgJiYgIXBvc3RGaWx0ZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmlsdGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbHRlciApO1xuXHR9XG5cdGlmICggcG9zdEZpbmRlciAmJiAhcG9zdEZpbmRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaW5kZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKTtcblx0fVxuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgcmVzdWx0cywgY29udGV4dCwgeG1sICkge1xuXHRcdHZhciB0ZW1wLCBpLCBlbGVtLFxuXHRcdFx0cHJlTWFwID0gW10sXG5cdFx0XHRwb3N0TWFwID0gW10sXG5cdFx0XHRwcmVleGlzdGluZyA9IHJlc3VsdHMubGVuZ3RoLFxuXG5cdFx0XHQvLyBHZXQgaW5pdGlhbCBlbGVtZW50cyBmcm9tIHNlZWQgb3IgY29udGV4dFxuXHRcdFx0ZWxlbXMgPSBzZWVkIHx8IG11bHRpcGxlQ29udGV4dHMoXG5cdFx0XHRcdHNlbGVjdG9yIHx8IFwiKlwiLFxuXHRcdFx0XHRjb250ZXh0Lm5vZGVUeXBlID8gWyBjb250ZXh0IF0gOiBjb250ZXh0LFxuXHRcdFx0XHRbXVxuXHRcdFx0KSxcblxuXHRcdFx0Ly8gUHJlZmlsdGVyIHRvIGdldCBtYXRjaGVyIGlucHV0LCBwcmVzZXJ2aW5nIGEgbWFwIGZvciBzZWVkLXJlc3VsdHMgc3luY2hyb25pemF0aW9uXG5cdFx0XHRtYXRjaGVySW4gPSBwcmVGaWx0ZXIgJiYgKCBzZWVkIHx8ICFzZWxlY3RvciApID9cblx0XHRcdFx0Y29uZGVuc2UoIGVsZW1zLCBwcmVNYXAsIHByZUZpbHRlciwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRlbGVtcyxcblxuXHRcdFx0bWF0Y2hlck91dCA9IG1hdGNoZXIgP1xuXG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgYSBwb3N0RmluZGVyLCBvciBmaWx0ZXJlZCBzZWVkLCBvciBub24tc2VlZCBwb3N0RmlsdGVyIG9yIHByZWV4aXN0aW5nIHJlc3VsdHMsXG5cdFx0XHRcdHBvc3RGaW5kZXIgfHwgKCBzZWVkID8gcHJlRmlsdGVyIDogcHJlZXhpc3RpbmcgfHwgcG9zdEZpbHRlciApID9cblxuXHRcdFx0XHRcdC8vIC4uLmludGVybWVkaWF0ZSBwcm9jZXNzaW5nIGlzIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFtdIDpcblxuXHRcdFx0XHRcdC8vIC4uLm90aGVyd2lzZSB1c2UgcmVzdWx0cyBkaXJlY3RseVxuXHRcdFx0XHRcdHJlc3VsdHMgOlxuXHRcdFx0XHRtYXRjaGVySW47XG5cblx0XHQvLyBGaW5kIHByaW1hcnkgbWF0Y2hlc1xuXHRcdGlmICggbWF0Y2hlciApIHtcblx0XHRcdG1hdGNoZXIoIG1hdGNoZXJJbiwgbWF0Y2hlck91dCwgY29udGV4dCwgeG1sICk7XG5cdFx0fVxuXG5cdFx0Ly8gQXBwbHkgcG9zdEZpbHRlclxuXHRcdGlmICggcG9zdEZpbHRlciApIHtcblx0XHRcdHRlbXAgPSBjb25kZW5zZSggbWF0Y2hlck91dCwgcG9zdE1hcCApO1xuXHRcdFx0cG9zdEZpbHRlciggdGVtcCwgW10sIGNvbnRleHQsIHhtbCApO1xuXG5cdFx0XHQvLyBVbi1tYXRjaCBmYWlsaW5nIGVsZW1lbnRzIGJ5IG1vdmluZyB0aGVtIGJhY2sgdG8gbWF0Y2hlckluXG5cdFx0XHRpID0gdGVtcC5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAoIGVsZW0gPSB0ZW1wWyBpIF0gKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyT3V0WyBwb3N0TWFwWyBpIF0gXSA9ICEoIG1hdGNoZXJJblsgcG9zdE1hcFsgaSBdIF0gPSBlbGVtICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgfHwgcHJlRmlsdGVyICkge1xuXHRcdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cblx0XHRcdFx0XHQvLyBHZXQgdGhlIGZpbmFsIG1hdGNoZXJPdXQgYnkgY29uZGVuc2luZyB0aGlzIGludGVybWVkaWF0ZSBpbnRvIHBvc3RGaW5kZXIgY29udGV4dHNcblx0XHRcdFx0XHR0ZW1wID0gW107XG5cdFx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBtYXRjaGVyT3V0WyBpIF0gKSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXN0b3JlIG1hdGNoZXJJbiBzaW5jZSBlbGVtIGlzIG5vdCB5ZXQgYSBmaW5hbCBtYXRjaFxuXHRcdFx0XHRcdFx0XHR0ZW1wLnB1c2goICggbWF0Y2hlckluWyBpIF0gPSBlbGVtICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgKCBtYXRjaGVyT3V0ID0gW10gKSwgdGVtcCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNb3ZlIG1hdGNoZWQgZWxlbWVudHMgZnJvbSBzZWVkIHRvIHJlc3VsdHMgdG8ga2VlcCB0aGVtIHN5bmNocm9uaXplZFxuXHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdGlmICggKCBlbGVtID0gbWF0Y2hlck91dFsgaSBdICkgJiZcblx0XHRcdFx0XHRcdCggdGVtcCA9IHBvc3RGaW5kZXIgPyBpbmRleE9mKCBzZWVkLCBlbGVtICkgOiBwcmVNYXBbIGkgXSApID4gLTEgKSB7XG5cblx0XHRcdFx0XHRcdHNlZWRbIHRlbXAgXSA9ICEoIHJlc3VsdHNbIHRlbXAgXSA9IGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdC8vIEFkZCBlbGVtZW50cyB0byByZXN1bHRzLCB0aHJvdWdoIHBvc3RGaW5kZXIgaWYgZGVmaW5lZFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyT3V0ID0gY29uZGVuc2UoXG5cdFx0XHRcdG1hdGNoZXJPdXQgPT09IHJlc3VsdHMgP1xuXHRcdFx0XHRcdG1hdGNoZXJPdXQuc3BsaWNlKCBwcmVleGlzdGluZywgbWF0Y2hlck91dC5sZW5ndGggKSA6XG5cdFx0XHRcdFx0bWF0Y2hlck91dFxuXHRcdFx0KTtcblx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblx0XHRcdFx0cG9zdEZpbmRlciggbnVsbCwgcmVzdWx0cywgbWF0Y2hlck91dCwgeG1sICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBtYXRjaGVyT3V0ICk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9ICk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciBjaGVja0NvbnRleHQsIG1hdGNoZXIsIGosXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRsZWFkaW5nUmVsYXRpdmUgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIDAgXS50eXBlIF0sXG5cdFx0aW1wbGljaXRSZWxhdGl2ZSA9IGxlYWRpbmdSZWxhdGl2ZSB8fCBFeHByLnJlbGF0aXZlWyBcIiBcIiBdLFxuXHRcdGkgPSBsZWFkaW5nUmVsYXRpdmUgPyAxIDogMCxcblxuXHRcdC8vIFRoZSBmb3VuZGF0aW9uYWwgbWF0Y2hlciBlbnN1cmVzIHRoYXQgZWxlbWVudHMgYXJlIHJlYWNoYWJsZSBmcm9tIHRvcC1sZXZlbCBjb250ZXh0KHMpXG5cdFx0bWF0Y2hDb250ZXh0ID0gYWRkQ29tYmluYXRvciggZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gY2hlY2tDb250ZXh0O1xuXHRcdH0sIGltcGxpY2l0UmVsYXRpdmUsIHRydWUgKSxcblx0XHRtYXRjaEFueUNvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBpbmRleE9mKCBjaGVja0NvbnRleHQsIGVsZW0gKSA+IC0xO1xuXHRcdH0sIGltcGxpY2l0UmVsYXRpdmUsIHRydWUgKSxcblx0XHRtYXRjaGVycyA9IFsgZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciByZXQgPSAoICFsZWFkaW5nUmVsYXRpdmUgJiYgKCB4bWwgfHwgY29udGV4dCAhPT0gb3V0ZXJtb3N0Q29udGV4dCApICkgfHwgKFxuXHRcdFx0XHQoIGNoZWNrQ29udGV4dCA9IGNvbnRleHQgKS5ub2RlVHlwZSA/XG5cdFx0XHRcdFx0bWF0Y2hDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdFx0bWF0Y2hBbnlDb250ZXh0KCBlbGVtLCBjb250ZXh0LCB4bWwgKSApO1xuXG5cdFx0XHQvLyBBdm9pZCBoYW5naW5nIG9udG8gZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdGNoZWNrQ29udGV4dCA9IG51bGw7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0gXTtcblxuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRpZiAoICggbWF0Y2hlciA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgaSBdLnR5cGUgXSApICkge1xuXHRcdFx0bWF0Y2hlcnMgPSBbIGFkZENvbWJpbmF0b3IoIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLCBtYXRjaGVyICkgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlciA9IEV4cHIuZmlsdGVyWyB0b2tlbnNbIGkgXS50eXBlIF0uYXBwbHkoIG51bGwsIHRva2Vuc1sgaSBdLm1hdGNoZXMgKTtcblxuXHRcdFx0Ly8gUmV0dXJuIHNwZWNpYWwgdXBvbiBzZWVpbmcgYSBwb3NpdGlvbmFsIG1hdGNoZXJcblx0XHRcdGlmICggbWF0Y2hlclsgZXhwYW5kbyBdICkge1xuXG5cdFx0XHRcdC8vIEZpbmQgdGhlIG5leHQgcmVsYXRpdmUgb3BlcmF0b3IgKGlmIGFueSkgZm9yIHByb3BlciBoYW5kbGluZ1xuXHRcdFx0XHRqID0gKytpO1xuXHRcdFx0XHRmb3IgKCA7IGogPCBsZW47IGorKyApIHtcblx0XHRcdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgaiBdLnR5cGUgXSApIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gc2V0TWF0Y2hlcihcblx0XHRcdFx0XHRpID4gMSAmJiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSxcblx0XHRcdFx0XHRpID4gMSAmJiB0b1NlbGVjdG9yKFxuXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIHByZWNlZGluZyB0b2tlbiB3YXMgYSBkZXNjZW5kYW50IGNvbWJpbmF0b3IsIGluc2VydCBhbiBpbXBsaWNpdCBhbnktZWxlbWVudCBgKmBcblx0XHRcdFx0XHR0b2tlbnNcblx0XHRcdFx0XHRcdC5zbGljZSggMCwgaSAtIDEgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggeyB2YWx1ZTogdG9rZW5zWyBpIC0gMiBdLnR5cGUgPT09IFwiIFwiID8gXCIqXCIgOiBcIlwiIH0gKVxuXHRcdFx0XHRcdCkucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLFxuXHRcdFx0XHRcdG1hdGNoZXIsXG5cdFx0XHRcdFx0aSA8IGogJiYgbWF0Y2hlckZyb21Ub2tlbnMoIHRva2Vucy5zbGljZSggaSwgaiApICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiBtYXRjaGVyRnJvbVRva2VucyggKCB0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIGogKSApICksXG5cdFx0XHRcdFx0aiA8IGxlbiAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0bWF0Y2hlcnMucHVzaCggbWF0Y2hlciApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzICkge1xuXHR2YXIgYnlTZXQgPSBzZXRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdGJ5RWxlbWVudCA9IGVsZW1lbnRNYXRjaGVycy5sZW5ndGggPiAwLFxuXHRcdHN1cGVyTWF0Y2hlciA9IGZ1bmN0aW9uKCBzZWVkLCBjb250ZXh0LCB4bWwsIHJlc3VsdHMsIG91dGVybW9zdCApIHtcblx0XHRcdHZhciBlbGVtLCBqLCBtYXRjaGVyLFxuXHRcdFx0XHRtYXRjaGVkQ291bnQgPSAwLFxuXHRcdFx0XHRpID0gXCIwXCIsXG5cdFx0XHRcdHVubWF0Y2hlZCA9IHNlZWQgJiYgW10sXG5cdFx0XHRcdHNldE1hdGNoZWQgPSBbXSxcblx0XHRcdFx0Y29udGV4dEJhY2t1cCA9IG91dGVybW9zdENvbnRleHQsXG5cblx0XHRcdFx0Ly8gV2UgbXVzdCBhbHdheXMgaGF2ZSBlaXRoZXIgc2VlZCBlbGVtZW50cyBvciBvdXRlcm1vc3QgY29udGV4dFxuXHRcdFx0XHRlbGVtcyA9IHNlZWQgfHwgYnlFbGVtZW50ICYmIEV4cHIuZmluZFsgXCJUQUdcIiBdKCBcIipcIiwgb3V0ZXJtb3N0ICksXG5cblx0XHRcdFx0Ly8gVXNlIGludGVnZXIgZGlycnVucyBpZmYgdGhpcyBpcyB0aGUgb3V0ZXJtb3N0IG1hdGNoZXJcblx0XHRcdFx0ZGlycnVuc1VuaXF1ZSA9ICggZGlycnVucyArPSBjb250ZXh0QmFja3VwID09IG51bGwgPyAxIDogTWF0aC5yYW5kb20oKSB8fCAwLjEgKSxcblx0XHRcdFx0bGVuID0gZWxlbXMubGVuZ3RoO1xuXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dCA9PSBkb2N1bWVudCB8fCBjb250ZXh0IHx8IG91dGVybW9zdDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWRkIGVsZW1lbnRzIHBhc3NpbmcgZWxlbWVudE1hdGNoZXJzIGRpcmVjdGx5IHRvIHJlc3VsdHNcblx0XHRcdC8vIFN1cHBvcnQ6IElFPDksIFNhZmFyaVxuXHRcdFx0Ly8gVG9sZXJhdGUgTm9kZUxpc3QgcHJvcGVydGllcyAoSUU6IFwibGVuZ3RoXCI7IFNhZmFyaTogPG51bWJlcj4pIG1hdGNoaW5nIGVsZW1lbnRzIGJ5IGlkXG5cdFx0XHRmb3IgKCA7IGkgIT09IGxlbiAmJiAoIGVsZW0gPSBlbGVtc1sgaSBdICkgIT0gbnVsbDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIGJ5RWxlbWVudCAmJiBlbGVtICkge1xuXHRcdFx0XHRcdGogPSAwO1xuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdFx0XHRpZiAoICFjb250ZXh0ICYmIGVsZW0ub3duZXJEb2N1bWVudCAhPSBkb2N1bWVudCApIHtcblx0XHRcdFx0XHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdFx0XHRcdFx0XHR4bWwgPSAhZG9jdW1lbnRJc0hUTUw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHdoaWxlICggKCBtYXRjaGVyID0gZWxlbWVudE1hdGNoZXJzWyBqKysgXSApICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0IHx8IGRvY3VtZW50LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFRyYWNrIHVubWF0Y2hlZCBlbGVtZW50cyBmb3Igc2V0IGZpbHRlcnNcblx0XHRcdFx0aWYgKCBieVNldCApIHtcblxuXHRcdFx0XHRcdC8vIFRoZXkgd2lsbCBoYXZlIGdvbmUgdGhyb3VnaCBhbGwgcG9zc2libGUgbWF0Y2hlcnNcblx0XHRcdFx0XHRpZiAoICggZWxlbSA9ICFtYXRjaGVyICYmIGVsZW0gKSApIHtcblx0XHRcdFx0XHRcdG1hdGNoZWRDb3VudC0tO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIExlbmd0aGVuIHRoZSBhcnJheSBmb3IgZXZlcnkgZWxlbWVudCwgbWF0Y2hlZCBvciBub3Rcblx0XHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cdFx0XHRcdFx0XHR1bm1hdGNoZWQucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBgaWAgaXMgbm93IHRoZSBjb3VudCBvZiBlbGVtZW50cyB2aXNpdGVkIGFib3ZlLCBhbmQgYWRkaW5nIGl0IHRvIGBtYXRjaGVkQ291bnRgXG5cdFx0XHQvLyBtYWtlcyB0aGUgbGF0dGVyIG5vbm5lZ2F0aXZlLlxuXHRcdFx0bWF0Y2hlZENvdW50ICs9IGk7XG5cblx0XHRcdC8vIEFwcGx5IHNldCBmaWx0ZXJzIHRvIHVubWF0Y2hlZCBlbGVtZW50c1xuXHRcdFx0Ly8gTk9URTogVGhpcyBjYW4gYmUgc2tpcHBlZCBpZiB0aGVyZSBhcmUgbm8gdW5tYXRjaGVkIGVsZW1lbnRzIChpLmUuLCBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gZXF1YWxzIGBpYCksIHVubGVzcyB3ZSBkaWRuJ3QgdmlzaXQgX2FueV8gZWxlbWVudHMgaW4gdGhlIGFib3ZlIGxvb3AgYmVjYXVzZSB3ZSBoYXZlXG5cdFx0XHQvLyBubyBlbGVtZW50IG1hdGNoZXJzIGFuZCBubyBzZWVkLlxuXHRcdFx0Ly8gSW5jcmVtZW50aW5nIGFuIGluaXRpYWxseS1zdHJpbmcgXCIwXCIgYGlgIGFsbG93cyBgaWAgdG8gcmVtYWluIGEgc3RyaW5nIG9ubHkgaW4gdGhhdFxuXHRcdFx0Ly8gY2FzZSwgd2hpY2ggd2lsbCByZXN1bHQgaW4gYSBcIjAwXCIgYG1hdGNoZWRDb3VudGAgdGhhdCBkaWZmZXJzIGZyb20gYGlgIGJ1dCBpcyBhbHNvXG5cdFx0XHQvLyBudW1lcmljYWxseSB6ZXJvLlxuXHRcdFx0aWYgKCBieVNldCAmJiBpICE9PSBtYXRjaGVkQ291bnQgKSB7XG5cdFx0XHRcdGogPSAwO1xuXHRcdFx0XHR3aGlsZSAoICggbWF0Y2hlciA9IHNldE1hdGNoZXJzWyBqKysgXSApICkge1xuXHRcdFx0XHRcdG1hdGNoZXIoIHVubWF0Y2hlZCwgc2V0TWF0Y2hlZCwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHNlZWQgKSB7XG5cblx0XHRcdFx0XHQvLyBSZWludGVncmF0ZSBlbGVtZW50IG1hdGNoZXMgdG8gZWxpbWluYXRlIHRoZSBuZWVkIGZvciBzb3J0aW5nXG5cdFx0XHRcdFx0aWYgKCBtYXRjaGVkQ291bnQgPiAwICkge1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRcdGlmICggISggdW5tYXRjaGVkWyBpIF0gfHwgc2V0TWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0TWF0Y2hlZFsgaSBdID0gcG9wLmNhbGwoIHJlc3VsdHMgKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIERpc2NhcmQgaW5kZXggcGxhY2Vob2xkZXIgdmFsdWVzIHRvIGdldCBvbmx5IGFjdHVhbCBtYXRjaGVzXG5cdFx0XHRcdFx0c2V0TWF0Y2hlZCA9IGNvbmRlbnNlKCBzZXRNYXRjaGVkICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBBZGQgbWF0Y2hlcyB0byByZXN1bHRzXG5cdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNldE1hdGNoZWQgKTtcblxuXHRcdFx0XHQvLyBTZWVkbGVzcyBzZXQgbWF0Y2hlcyBzdWNjZWVkaW5nIG11bHRpcGxlIHN1Y2Nlc3NmdWwgbWF0Y2hlcnMgc3RpcHVsYXRlIHNvcnRpbmdcblx0XHRcdFx0aWYgKCBvdXRlcm1vc3QgJiYgIXNlZWQgJiYgc2V0TWF0Y2hlZC5sZW5ndGggPiAwICYmXG5cdFx0XHRcdFx0KCBtYXRjaGVkQ291bnQgKyBzZXRNYXRjaGVycy5sZW5ndGggKSA+IDEgKSB7XG5cblx0XHRcdFx0XHRTaXp6bGUudW5pcXVlU29ydCggcmVzdWx0cyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIE92ZXJyaWRlIG1hbmlwdWxhdGlvbiBvZiBnbG9iYWxzIGJ5IG5lc3RlZCBtYXRjaGVyc1xuXHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cdFx0XHRcdGRpcnJ1bnMgPSBkaXJydW5zVW5pcXVlO1xuXHRcdFx0XHRvdXRlcm1vc3RDb250ZXh0ID0gY29udGV4dEJhY2t1cDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVubWF0Y2hlZDtcblx0XHR9O1xuXG5cdHJldHVybiBieVNldCA/XG5cdFx0bWFya0Z1bmN0aW9uKCBzdXBlck1hdGNoZXIgKSA6XG5cdFx0c3VwZXJNYXRjaGVyO1xufVxuXG5jb21waWxlID0gU2l6emxlLmNvbXBpbGUgPSBmdW5jdGlvbiggc2VsZWN0b3IsIG1hdGNoIC8qIEludGVybmFsIFVzZSBPbmx5ICovICkge1xuXHR2YXIgaSxcblx0XHRzZXRNYXRjaGVycyA9IFtdLFxuXHRcdGVsZW1lbnRNYXRjaGVycyA9IFtdLFxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXTtcblxuXHRpZiAoICFjYWNoZWQgKSB7XG5cblx0XHQvLyBHZW5lcmF0ZSBhIGZ1bmN0aW9uIG9mIHJlY3Vyc2l2ZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgdXNlZCB0byBjaGVjayBlYWNoIGVsZW1lbnRcblx0XHRpZiAoICFtYXRjaCApIHtcblx0XHRcdG1hdGNoID0gdG9rZW5pemUoIHNlbGVjdG9yICk7XG5cdFx0fVxuXHRcdGkgPSBtYXRjaC5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRjYWNoZWQgPSBtYXRjaGVyRnJvbVRva2VucyggbWF0Y2hbIGkgXSApO1xuXHRcdFx0aWYgKCBjYWNoZWRbIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0c2V0TWF0Y2hlcnMucHVzaCggY2FjaGVkICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50TWF0Y2hlcnMucHVzaCggY2FjaGVkICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ2FjaGUgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZShcblx0XHRcdHNlbGVjdG9yLFxuXHRcdFx0bWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzKCBlbGVtZW50TWF0Y2hlcnMsIHNldE1hdGNoZXJzIClcblx0XHQpO1xuXG5cdFx0Ly8gU2F2ZSBzZWxlY3RvciBhbmQgdG9rZW5pemF0aW9uXG5cdFx0Y2FjaGVkLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5cdH1cblx0cmV0dXJuIGNhY2hlZDtcbn07XG5cbi8qKlxuICogQSBsb3ctbGV2ZWwgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgd29ya3Mgd2l0aCBTaXp6bGUncyBjb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHNlbGVjdG9yIEEgc2VsZWN0b3Igb3IgYSBwcmUtY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbiBidWlsdCB3aXRoIFNpenpsZS5jb21waWxlXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGNvbnRleHRcbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHRzXVxuICogQHBhcmFtIHtBcnJheX0gW3NlZWRdIEEgc2V0IG9mIGVsZW1lbnRzIHRvIG1hdGNoIGFnYWluc3RcbiAqL1xuc2VsZWN0ID0gU2l6emxlLnNlbGVjdCA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIGksIHRva2VucywgdG9rZW4sIHR5cGUsIGZpbmQsXG5cdFx0Y29tcGlsZWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09IFwiZnVuY3Rpb25cIiAmJiBzZWxlY3Rvcixcblx0XHRtYXRjaCA9ICFzZWVkICYmIHRva2VuaXplKCAoIHNlbGVjdG9yID0gY29tcGlsZWQuc2VsZWN0b3IgfHwgc2VsZWN0b3IgKSApO1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFRyeSB0byBtaW5pbWl6ZSBvcGVyYXRpb25zIGlmIHRoZXJlIGlzIG9ubHkgb25lIHNlbGVjdG9yIGluIHRoZSBsaXN0IGFuZCBubyBzZWVkXG5cdC8vICh0aGUgbGF0dGVyIG9mIHdoaWNoIGd1YXJhbnRlZXMgdXMgY29udGV4dClcblx0aWYgKCBtYXRjaC5sZW5ndGggPT09IDEgKSB7XG5cblx0XHQvLyBSZWR1Y2UgY29udGV4dCBpZiB0aGUgbGVhZGluZyBjb21wb3VuZCBzZWxlY3RvciBpcyBhbiBJRFxuXHRcdHRva2VucyA9IG1hdGNoWyAwIF0gPSBtYXRjaFsgMCBdLnNsaWNlKCAwICk7XG5cdFx0aWYgKCB0b2tlbnMubGVuZ3RoID4gMiAmJiAoIHRva2VuID0gdG9rZW5zWyAwIF0gKS50eXBlID09PSBcIklEXCIgJiZcblx0XHRcdGNvbnRleHQubm9kZVR5cGUgPT09IDkgJiYgZG9jdW1lbnRJc0hUTUwgJiYgRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyAxIF0udHlwZSBdICkge1xuXG5cdFx0XHRjb250ZXh0ID0gKCBFeHByLmZpbmRbIFwiSURcIiBdKCB0b2tlbi5tYXRjaGVzWyAwIF1cblx0XHRcdFx0LnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICksIGNvbnRleHQgKSB8fCBbXSApWyAwIF07XG5cdFx0XHRpZiAoICFjb250ZXh0ICkge1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblxuXHRcdFx0Ly8gUHJlY29tcGlsZWQgbWF0Y2hlcnMgd2lsbCBzdGlsbCB2ZXJpZnkgYW5jZXN0cnksIHNvIHN0ZXAgdXAgYSBsZXZlbFxuXHRcdFx0fSBlbHNlIGlmICggY29tcGlsZWQgKSB7XG5cdFx0XHRcdGNvbnRleHQgPSBjb250ZXh0LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc2xpY2UoIHRva2Vucy5zaGlmdCgpLnZhbHVlLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZldGNoIGEgc2VlZCBzZXQgZm9yIHJpZ2h0LXRvLWxlZnQgbWF0Y2hpbmdcblx0XHRpID0gbWF0Y2hFeHByWyBcIm5lZWRzQ29udGV4dFwiIF0udGVzdCggc2VsZWN0b3IgKSA/IDAgOiB0b2tlbnMubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0dG9rZW4gPSB0b2tlbnNbIGkgXTtcblxuXHRcdFx0Ly8gQWJvcnQgaWYgd2UgaGl0IGEgY29tYmluYXRvclxuXHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyAoIHR5cGUgPSB0b2tlbi50eXBlICkgXSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoICggZmluZCA9IEV4cHIuZmluZFsgdHlwZSBdICkgKSB7XG5cblx0XHRcdFx0Ly8gU2VhcmNoLCBleHBhbmRpbmcgY29udGV4dCBmb3IgbGVhZGluZyBzaWJsaW5nIGNvbWJpbmF0b3JzXG5cdFx0XHRcdGlmICggKCBzZWVkID0gZmluZChcblx0XHRcdFx0XHR0b2tlbi5tYXRjaGVzWyAwIF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSxcblx0XHRcdFx0XHRyc2libGluZy50ZXN0KCB0b2tlbnNbIDAgXS50eXBlICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8XG5cdFx0XHRcdFx0XHRjb250ZXh0XG5cdFx0XHRcdCkgKSApIHtcblxuXHRcdFx0XHRcdC8vIElmIHNlZWQgaXMgZW1wdHkgb3Igbm8gdG9rZW5zIHJlbWFpbiwgd2UgY2FuIHJldHVybiBlYXJseVxuXHRcdFx0XHRcdHRva2Vucy5zcGxpY2UoIGksIDEgKTtcblx0XHRcdFx0XHRzZWxlY3RvciA9IHNlZWQubGVuZ3RoICYmIHRvU2VsZWN0b3IoIHRva2VucyApO1xuXHRcdFx0XHRcdGlmICggIXNlbGVjdG9yICkge1xuXHRcdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2VlZCApO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBDb21waWxlIGFuZCBleGVjdXRlIGEgZmlsdGVyaW5nIGZ1bmN0aW9uIGlmIG9uZSBpcyBub3QgcHJvdmlkZWRcblx0Ly8gUHJvdmlkZSBgbWF0Y2hgIHRvIGF2b2lkIHJldG9rZW5pemF0aW9uIGlmIHdlIG1vZGlmaWVkIHRoZSBzZWxlY3RvciBhYm92ZVxuXHQoIGNvbXBpbGVkIHx8IGNvbXBpbGUoIHNlbGVjdG9yLCBtYXRjaCApICkoXG5cdFx0c2VlZCxcblx0XHRjb250ZXh0LFxuXHRcdCFkb2N1bWVudElzSFRNTCxcblx0XHRyZXN1bHRzLFxuXHRcdCFjb250ZXh0IHx8IHJzaWJsaW5nLnRlc3QoIHNlbGVjdG9yICkgJiYgdGVzdENvbnRleHQoIGNvbnRleHQucGFyZW50Tm9kZSApIHx8IGNvbnRleHRcblx0KTtcblx0cmV0dXJuIHJlc3VsdHM7XG59O1xuXG4vLyBPbmUtdGltZSBhc3NpZ25tZW50c1xuXG4vLyBTb3J0IHN0YWJpbGl0eVxuc3VwcG9ydC5zb3J0U3RhYmxlID0gZXhwYW5kby5zcGxpdCggXCJcIiApLnNvcnQoIHNvcnRPcmRlciApLmpvaW4oIFwiXCIgKSA9PT0gZXhwYW5kbztcblxuLy8gU3VwcG9ydDogQ2hyb21lIDE0LTM1K1xuLy8gQWx3YXlzIGFzc3VtZSBkdXBsaWNhdGVzIGlmIHRoZXkgYXJlbid0IHBhc3NlZCB0byB0aGUgY29tcGFyaXNvbiBmdW5jdGlvblxuc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzID0gISFoYXNEdXBsaWNhdGU7XG5cbi8vIEluaXRpYWxpemUgYWdhaW5zdCB0aGUgZGVmYXVsdCBkb2N1bWVudFxuc2V0RG9jdW1lbnQoKTtcblxuLy8gU3VwcG9ydDogV2Via2l0PDUzNy4zMiAtIFNhZmFyaSA2LjAuMy9DaHJvbWUgMjUgKGZpeGVkIGluIENocm9tZSAyNylcbi8vIERldGFjaGVkIG5vZGVzIGNvbmZvdW5kaW5nbHkgZm9sbG93ICplYWNoIG90aGVyKlxuc3VwcG9ydC5zb3J0RGV0YWNoZWQgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHQvLyBTaG91bGQgcmV0dXJuIDEsIGJ1dCByZXR1cm5zIDQgKGZvbGxvd2luZylcblx0cmV0dXJuIGVsLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImZpZWxkc2V0XCIgKSApICYgMTtcbn0gKTtcblxuLy8gU3VwcG9ydDogSUU8OFxuLy8gUHJldmVudCBhdHRyaWJ1dGUvcHJvcGVydHkgXCJpbnRlcnBvbGF0aW9uXCJcbi8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXM1MzY0MjklMjhWUy44NSUyOS5hc3B4XG5pZiAoICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0ZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPScjJz48L2E+XCI7XG5cdHJldHVybiBlbC5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSggXCJocmVmXCIgKSA9PT0gXCIjXCI7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggXCJ0eXBlfGhyZWZ8aGVpZ2h0fHdpZHRoXCIsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInR5cGVcIiA/IDEgOiAyICk7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBkZWZhdWx0VmFsdWUgaW4gcGxhY2Ugb2YgZ2V0QXR0cmlidXRlKFwidmFsdWVcIilcbmlmICggIXN1cHBvcnQuYXR0cmlidXRlcyB8fCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdGVsLmlubmVySFRNTCA9IFwiPGlucHV0Lz5cIjtcblx0ZWwuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiwgXCJcIiApO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwidmFsdWVcIiApID09PSBcIlwiO1xufSApICkge1xuXHRhZGRIYW5kbGUoIFwidmFsdWVcIiwgZnVuY3Rpb24oIGVsZW0sIF9uYW1lLCBpc1hNTCApIHtcblx0XHRpZiAoICFpc1hNTCAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiApIHtcblx0XHRcdHJldHVybiBlbGVtLmRlZmF1bHRWYWx1ZTtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGdldEF0dHJpYnV0ZU5vZGUgdG8gZmV0Y2ggYm9vbGVhbnMgd2hlbiBnZXRBdHRyaWJ1dGUgbGllc1xuaWYgKCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoIFwiZGlzYWJsZWRcIiApID09IG51bGw7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggYm9vbGVhbnMsIGZ1bmN0aW9uKCBlbGVtLCBuYW1lLCBpc1hNTCApIHtcblx0XHR2YXIgdmFsO1xuXHRcdGlmICggIWlzWE1MICkge1xuXHRcdFx0cmV0dXJuIGVsZW1bIG5hbWUgXSA9PT0gdHJ1ZSA/IG5hbWUudG9Mb3dlckNhc2UoKSA6XG5cdFx0XHRcdCggdmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkgKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0XHR2YWwudmFsdWUgOlxuXHRcdFx0XHRcdG51bGw7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIEVYUE9TRVxudmFyIF9zaXp6bGUgPSB3aW5kb3cuU2l6emxlO1xuXG5TaXp6bGUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHdpbmRvdy5TaXp6bGUgPT09IFNpenpsZSApIHtcblx0XHR3aW5kb3cuU2l6emxlID0gX3NpenpsZTtcblx0fVxuXG5cdHJldHVybiBTaXp6bGU7XG59O1xuXG5pZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXHRkZWZpbmUoIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBTaXp6bGU7XG5cdH0gKTtcblxuLy8gU2l6emxlIHJlcXVpcmVzIHRoYXQgdGhlcmUgYmUgYSBnbG9iYWwgd2luZG93IGluIENvbW1vbi1KUyBsaWtlIGVudmlyb25tZW50c1xufSBlbHNlIGlmICggdHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyApIHtcblx0bW9kdWxlLmV4cG9ydHMgPSBTaXp6bGU7XG59IGVsc2Uge1xuXHR3aW5kb3cuU2l6emxlID0gU2l6emxlO1xufVxuXG4vLyBFWFBPU0VcblxufSApKCB3aW5kb3cgKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vc2l6emxlL2Rpc3Qvc2l6emxlLmpzIiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBzZWxlY3QsIGdldFNpbmdsZVNlbGVjdG9yLCBnZXRNdWx0aVNlbGVjdG9yIH0gZnJvbSAnLi9zZWxlY3QnXG5leHBvcnQgeyBkZWZhdWx0IGFzIG1hdGNoIH0gZnJvbSAnLi9tYXRjaCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3B0aW1pemUgfSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==