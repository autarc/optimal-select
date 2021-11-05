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
    var matches = select((0, _pattern.patternToString)(pattern), parent);
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

  return null; // pattern
}

/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select  - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
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
 * @return {Pattern?}             - [description]
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
    contains.push('contains("' + texts.shift() + '")');
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
 * @return {Pattern}                  - [description]
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBlYzUyZWM5Nzg3M2VmOWIwMzM1YyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9vcHRpbWl6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhdHRlcm4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NzczJ4cGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0U2VsZWN0IiwiZ2V0Q29tbW9uQW5jZXN0b3IiLCJnZXRDb21tb25Qcm9wZXJ0aWVzIiwib3B0aW9ucyIsImZvcm1hdCIsIlNpenpsZSIsInJlcXVpcmUiLCJzZWxlY3RvciIsInBhcmVudCIsInJvb3QiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50cyIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJsZW5ndGgiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwiaSIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiY29tbW9uUHJvcGVydGllcyIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwiY29tbW9uQ2xhc3NlcyIsImNvbW1vbkF0dHJpYnV0ZXMiLCJjb21tb25UYWciLCJ1bmRlZmluZWQiLCJnZXRBdHRyaWJ1dGUiLCJ0cmltIiwic3BsaXQiLCJmaWx0ZXIiLCJlbnRyeSIsIm5hbWUiLCJlbGVtZW50QXR0cmlidXRlcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJrZXkiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwidmFsdWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnZlcnROb2RlTGlzdCIsIm5vZGVzIiwiYXJyIiwiQXJyYXkiLCJlc2NhcGVWYWx1ZSIsInJlcGxhY2UiLCJwYXJ0aXRpb24iLCJhcnJheSIsInByZWRpY2F0ZSIsIml0ZW0iLCJpbm5lciIsIm91dGVyIiwiY29uY2F0IiwibWF0Y2giLCJkZWZhdWx0SWdub3JlIiwiaW5kZXhPZiIsIm5vZGUiLCJza2lwIiwicHJpb3JpdHkiLCJpZ25vcmUiLCJwYXRoIiwianF1ZXJ5Iiwic2VsZWN0Iiwic2tpcENvbXBhcmUiLCJpc0FycmF5IiwibWFwIiwic2tpcENoZWNrcyIsImNvbXBhcmUiLCJ0eXBlIiwidG9TdHJpbmciLCJSZWdFeHAiLCJ0ZXN0Iiwibm9kZVR5cGUiLCJjaGVja0F0dHJpYnV0ZXMiLCJjaGVja1RhZyIsImNoZWNrQ29udGFpbnMiLCJjaGVja0NoaWxkcyIsInBhdHRlcm4iLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsIm1hdGNoZXMiLCJnZXRDbGFzc1NlbGVjdG9yIiwiYmFzZSIsInJlc3VsdCIsImMiLCJyIiwicHVzaCIsImEiLCJiIiwicHJlZml4Iiwiam9pbiIsImF0dHJpYnV0ZU5hbWVzIiwidmFsIiwic29ydGVkS2V5cyIsImlzT3B0aW1hbCIsImF0dHJpYnV0ZVZhbHVlIiwidXNlTmFtZWRJZ25vcmUiLCJjdXJyZW50SWdub3JlIiwiY3VycmVudERlZmF1bHRJZ25vcmUiLCJjaGVja0lnbm9yZSIsImNsYXNzTmFtZXMiLCJjbGFzc0lnbm9yZSIsImNsYXNzIiwiY2xhc3NOYW1lIiwiZmluZFRhZ1BhdHRlcm4iLCJjaGlsZHJlbiIsImNoaWxkVGFncyIsImNoaWxkIiwiY2hpbGRQYXR0ZXJuIiwiY29uc29sZSIsIndhcm4iLCJyZWxhdGVzIiwicHNldWRvIiwidGV4dHMiLCJ0ZXh0Q29udGVudCIsInRleHQiLCJjb250YWlucyIsImRlZmF1bHRQcmVkaWNhdGUiLCJjaGVjayIsIm9wdGltaXplIiwiRXJyb3IiLCJnbG9iYWxNb2RpZmllZCIsIm9wdGltaXplUGFydCIsImVuZE9wdGltaXplZCIsInNsaWNlIiwic2hvcnRlbmVkIiwicG9wIiwiY3VycmVudCIsInByZVBhcnQiLCJwb3N0UGFydCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsIm9wdGltaXplQ29udGFpbnMiLCJvdGhlciIsIm9wdGltaXplZCIsImNvbXBhcmVSZXN1bHRzIiwib3B0aW1pemVBdHRyaWJ1dGVzIiwic2ltcGxpZnkiLCJvcmlnaW5hbCIsImdldFNpbXBsaWZpZWQiLCJzaW1wbGlmaWVkIiwib3B0aW1pemVEZXNjZW5kYW50IiwiZGVzY2VuZGFudCIsIm9wdGltaXplTnRoT2ZUeXBlIiwiZmluZEluZGV4Iiwic3RhcnRzV2l0aCIsIm50aE9mVHlwZSIsIm9wdGltaXplQ2xhc3NlcyIsImNoYXJBdCIsInJlZmVyZW5jZXMiLCJyZWZlcmVuY2UiLCJpMiIsImRlc2NyaXB0aW9uIiwibDIiLCJvcHRpbWl6ZXJzIiwiYWNjIiwib3B0aW1pemVyIiwiYWRhcHQiLCJnbG9iYWwiLCJjb250ZXh0IiwiRWxlbWVudFByb3RvdHlwZSIsImdldFByb3RvdHlwZU9mIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiYXR0cmlicyIsIk5hbWVkTm9kZU1hcCIsImNvbmZpZ3VyYWJsZSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiSFRNTENvbGxlY3Rpb24iLCJ0cmF2ZXJzZURlc2NlbmRhbnRzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsIm5hbWVzIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiaGFzQXR0cmlidXRlIiwiY2hlY2tBdHRyaWJ1dGUiLCJOb2RlTGlzdCIsImlkIiwiY2hlY2tJZCIsImNoZWNrVW5pdmVyc2FsIiwicnVsZSIsImtpbmQiLCJwYXJzZUludCIsInZhbGlkYXRlUHNldWRvIiwiY29tcGFyZVNldCIsIm5vZGVJbmRleCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiYXR0cmlidXRlc1RvU3RyaW5nIiwiY2xhc3Nlc1RvU3RyaW5nIiwicHNldWRvVG9TdHJpbmciLCJwYXR0ZXJuVG9TdHJpbmciLCJjcmVhdGVQYXR0ZXJuIiwicGF0aFRvU3RyaW5nIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJzZWxlY3RvclBhdGgiLCJjbGFzc1NlbGVjdG9yIiwiYXR0cmlidXRlU2VsZWN0b3IiLCJwYXJ0cyIsImlucHV0IiwiaW5jbHVkZXMiLCJ4cGF0aF90b19sb3dlciIsInMiLCJ4cGF0aF9lbmRzX3dpdGgiLCJzMSIsInMyIiwieHBhdGhfdXJsIiwieHBhdGhfdXJsX2F0dHJzIiwieHBhdGhfdXJsX3BhdGgiLCJ4cGF0aF91cmxfZG9tYWluIiwieHBhdGhfbG93ZXJfY2FzZSIsInhwYXRoX25zX3VyaSIsInhwYXRoX25zX3BhdGgiLCJ4cGF0aF9oYXNfcHJvdG9jYWwiLCJ4cGF0aF9pc19pbnRlcm5hbCIsInhwYXRoX2lzX2xvY2FsIiwieHBhdGhfaXNfcGF0aCIsInhwYXRoX2lzX2xvY2FsX3BhdGgiLCJ4cGF0aF9ub3JtYWxpemVfc3BhY2UiLCJ4cGF0aF9pbnRlcm5hbCIsInhwYXRoX2V4dGVybmFsIiwiZXNjYXBlX2xpdGVyYWwiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJlc2NhcGVfcGFyZW5zIiwicmVnZXhfc3RyaW5nX2xpdGVyYWwiLCJyZWdleF9lc2NhcGVkX2xpdGVyYWwiLCJyZWdleF9jc3Nfd3JhcF9wc2V1ZG8iLCJyZWdleF9zcGVjYWxfY2hhcnMiLCJyZWdleF9maXJzdF9heGlzIiwicmVnZXhfZmlsdGVyX3ByZWZpeCIsInJlZ2V4X2F0dHJfcHJlZml4IiwicmVnZXhfbnRoX2VxdWF0aW9uIiwiY3NzX2NvbWJpbmF0b3JzX3JlZ2V4IiwiY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrIiwib3BlcmF0b3IiLCJheGlzIiwiZnVuYyIsImxpdGVyYWwiLCJleGNsdWRlIiwib2Zmc2V0Iiwib3JpZyIsImlzTnVtZXJpYyIsInByZXZDaGFyIiwiY3NzX2F0dHJpYnV0ZXNfcmVnZXgiLCJjc3NfYXR0cmlidXRlc19jYWxsYmFjayIsInN0ciIsImF0dHIiLCJjb21wIiwib3AiLCJzZWFyY2giLCJjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXgiLCJjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2siLCJnMSIsImcyIiwiYXJnIiwiZzMiLCJnNCIsImc1IiwiY3NzMnhwYXRoIiwieHBhdGgiLCJwcmVwZW5kQXhpcyIsImNzc19pZHNfY2xhc3Nlc19yZWdleCIsImNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayIsInN0YXJ0Iiwic2VsZWN0b3JTdGFydCIsImRlcHRoIiwibnVtIiwiaXNOYU4iLCJlc2NhcGVDaGFyIiwib3BlbiIsImNsb3NlIiwiY2hhciIsInJlcGVhdCIsIk51bWJlciIsImNvbnZlcnRFc2NhcGluZyIsIm5lc3RlZCIsImxpdGVyYWxzIiwic3Vic3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIndpbmRvdyIsInN1cHBvcnQiLCJFeHByIiwiZ2V0VGV4dCIsImlzWE1MIiwidG9rZW5pemUiLCJjb21waWxlIiwib3V0ZXJtb3N0Q29udGV4dCIsInNvcnRJbnB1dCIsImhhc0R1cGxpY2F0ZSIsInNldERvY3VtZW50IiwiZG9jRWxlbSIsImRvY3VtZW50SXNIVE1MIiwicmJ1Z2d5UVNBIiwicmJ1Z2d5TWF0Y2hlcyIsImV4cGFuZG8iLCJEYXRlIiwicHJlZmVycmVkRG9jIiwiZGlycnVucyIsImNsYXNzQ2FjaGUiLCJjcmVhdGVDYWNoZSIsInRva2VuQ2FjaGUiLCJjb21waWxlckNhY2hlIiwibm9ubmF0aXZlU2VsZWN0b3JDYWNoZSIsInNvcnRPcmRlciIsImhhc093biIsImhhc093blByb3BlcnR5IiwicHVzaE5hdGl2ZSIsImxpc3QiLCJlbGVtIiwibGVuIiwiYm9vbGVhbnMiLCJ3aGl0ZXNwYWNlIiwiaWRlbnRpZmllciIsInBzZXVkb3MiLCJyd2hpdGVzcGFjZSIsInJ0cmltIiwicmNvbW1hIiwicmNvbWJpbmF0b3JzIiwicmRlc2NlbmQiLCJycHNldWRvIiwicmlkZW50aWZpZXIiLCJtYXRjaEV4cHIiLCJyaHRtbCIsInJpbnB1dHMiLCJyaGVhZGVyIiwicm5hdGl2ZSIsInJxdWlja0V4cHIiLCJyc2libGluZyIsInJ1bmVzY2FwZSIsImZ1bmVzY2FwZSIsImVzY2FwZSIsIm5vbkhleCIsImhpZ2giLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidW5sb2FkSGFuZGxlciIsImluRGlzYWJsZWRGaWVsZHNldCIsImFkZENvbWJpbmF0b3IiLCJkaXNhYmxlZCIsIm5vZGVOYW1lIiwiZGlyIiwiYXBwbHkiLCJjYWxsIiwiY2hpbGROb2RlcyIsImUiLCJ0YXJnZXQiLCJlbHMiLCJqIiwicmVzdWx0cyIsInNlZWQiLCJtIiwibmlkIiwiZ3JvdXBzIiwibmV3U2VsZWN0b3IiLCJuZXdDb250ZXh0Iiwib3duZXJEb2N1bWVudCIsImV4ZWMiLCJnZXRFbGVtZW50QnlJZCIsInFzYSIsInRlc3RDb250ZXh0Iiwic2NvcGUiLCJzZXRBdHRyaWJ1dGUiLCJ0b1NlbGVjdG9yIiwicXNhRXJyb3IiLCJyZW1vdmVBdHRyaWJ1dGUiLCJjYWNoZSIsImNhY2hlTGVuZ3RoIiwibWFya0Z1bmN0aW9uIiwiZm4iLCJhc3NlcnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEhhbmRsZSIsImF0dHJzIiwiYXR0ckhhbmRsZSIsInNpYmxpbmdDaGVjayIsImN1ciIsImRpZmYiLCJzb3VyY2VJbmRleCIsIm5leHRTaWJsaW5nIiwiY3JlYXRlSW5wdXRQc2V1ZG8iLCJjcmVhdGVCdXR0b25Qc2V1ZG8iLCJjcmVhdGVEaXNhYmxlZFBzZXVkbyIsImlzRGlzYWJsZWQiLCJjcmVhdGVQb3NpdGlvbmFsUHNldWRvIiwiYXJndW1lbnQiLCJtYXRjaEluZGV4ZXMiLCJuYW1lc3BhY2UiLCJuYW1lc3BhY2VVUkkiLCJkb2N1bWVudEVsZW1lbnQiLCJoYXNDb21wYXJlIiwic3ViV2luZG93IiwiZG9jIiwiZGVmYXVsdFZpZXciLCJ0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUNvbW1lbnQiLCJnZXRCeUlkIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJhdHRySWQiLCJmaW5kIiwiZ2V0QXR0cmlidXRlTm9kZSIsImVsZW1zIiwidG1wIiwiaW5uZXJIVE1MIiwibWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwibW96TWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwiZGlzY29ubmVjdGVkTWF0Y2giLCJjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiIsImFkb3duIiwiYnVwIiwic29ydERldGFjaGVkIiwiYXVwIiwiYXAiLCJicCIsImV4cHIiLCJyZXQiLCJzcGVjaWZpZWQiLCJzZWwiLCJlcnJvciIsIm1zZyIsInVuaXF1ZVNvcnQiLCJkdXBsaWNhdGVzIiwiZGV0ZWN0RHVwbGljYXRlcyIsInNvcnRTdGFibGUiLCJzcGxpY2UiLCJmaXJzdENoaWxkIiwibm9kZVZhbHVlIiwiY3JlYXRlUHNldWRvIiwicmVsYXRpdmUiLCJmaXJzdCIsInByZUZpbHRlciIsImV4Y2VzcyIsInVucXVvdGVkIiwibm9kZU5hbWVTZWxlY3RvciIsIndoYXQiLCJfYXJndW1lbnQiLCJsYXN0Iiwic2ltcGxlIiwiZm9yd2FyZCIsIm9mVHlwZSIsIl9jb250ZXh0IiwieG1sIiwidW5pcXVlQ2FjaGUiLCJvdXRlckNhY2hlIiwidXNlQ2FjaGUiLCJsYXN0Q2hpbGQiLCJ1bmlxdWVJRCIsImFyZ3MiLCJzZXRGaWx0ZXJzIiwiaWR4IiwibWF0Y2hlZCIsIm1hdGNoZXIiLCJ1bm1hdGNoZWQiLCJsYW5nIiwiZWxlbUxhbmciLCJoYXNoIiwibG9jYXRpb24iLCJhY3RpdmVFbGVtZW50IiwiaGFzRm9jdXMiLCJocmVmIiwidGFiSW5kZXgiLCJjaGVja2VkIiwic2VsZWN0ZWQiLCJzZWxlY3RlZEluZGV4IiwiX21hdGNoSW5kZXhlcyIsInJhZGlvIiwiY2hlY2tib3giLCJmaWxlIiwicGFzc3dvcmQiLCJpbWFnZSIsInN1Ym1pdCIsInJlc2V0IiwicHJvdG90eXBlIiwiZmlsdGVycyIsInBhcnNlT25seSIsInRva2VucyIsInNvRmFyIiwicHJlRmlsdGVycyIsImNhY2hlZCIsImNvbWJpbmF0b3IiLCJjaGVja05vbkVsZW1lbnRzIiwiZG9uZU5hbWUiLCJvbGRDYWNoZSIsIm5ld0NhY2hlIiwiZWxlbWVudE1hdGNoZXIiLCJtYXRjaGVycyIsIm11bHRpcGxlQ29udGV4dHMiLCJjb250ZXh0cyIsImNvbmRlbnNlIiwibmV3VW5tYXRjaGVkIiwibWFwcGVkIiwic2V0TWF0Y2hlciIsInBvc3RGaWx0ZXIiLCJwb3N0RmluZGVyIiwicG9zdFNlbGVjdG9yIiwidGVtcCIsInByZU1hcCIsInBvc3RNYXAiLCJwcmVleGlzdGluZyIsIm1hdGNoZXJJbiIsIm1hdGNoZXJPdXQiLCJtYXRjaGVyRnJvbVRva2VucyIsImNoZWNrQ29udGV4dCIsImxlYWRpbmdSZWxhdGl2ZSIsImltcGxpY2l0UmVsYXRpdmUiLCJtYXRjaENvbnRleHQiLCJtYXRjaEFueUNvbnRleHQiLCJtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMiLCJlbGVtZW50TWF0Y2hlcnMiLCJzZXRNYXRjaGVycyIsImJ5U2V0IiwiYnlFbGVtZW50Iiwic3VwZXJNYXRjaGVyIiwib3V0ZXJtb3N0IiwibWF0Y2hlZENvdW50Iiwic2V0TWF0Y2hlZCIsImNvbnRleHRCYWNrdXAiLCJkaXJydW5zVW5pcXVlIiwiTWF0aCIsInJhbmRvbSIsInRva2VuIiwiY29tcGlsZWQiLCJfbmFtZSIsImRlZmF1bHRWYWx1ZSIsIl9zaXp6bGUiLCJub0NvbmZsaWN0IiwiZGVmaW5lIiwiZGVmYXVsdCIsImNvbW1vbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7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STJXLFNBQS9DLEdBQ0MzVyxJQUFJMUQsS0FETCxHQUVDLElBSEY7QUFJQTtBQUNELEdBUkQ7QUFTQTs7QUFFRDtBQUNBLEtBQUlpaEIsVUFBVS9QLE9BQU9uVSxNQUFyQjs7QUFFQUEsUUFBT21rQixVQUFQLEdBQW9CLFlBQVc7QUFDOUIsTUFBS2hRLE9BQU9uVSxNQUFQLEtBQWtCQSxNQUF2QixFQUFnQztBQUMvQm1VLFVBQU9uVSxNQUFQLEdBQWdCa2tCLE9BQWhCO0FBQ0E7O0FBRUQsU0FBT2xrQixNQUFQO0FBQ0EsRUFORDs7QUFRQSxLQUFLLElBQUwsRUFBa0Q7QUFDakRva0IsRUFBQSxrQ0FBUSxZQUFXO0FBQ2xCLFVBQU9wa0IsTUFBUDtBQUNBLEdBRkQ7O0FBSUQ7QUFDQyxFQU5ELE1BTU8sSUFBSyxPQUFPaVUsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsT0FBT0MsT0FBN0MsRUFBdUQ7QUFDN0RELFNBQU9DLE9BQVAsR0FBaUJsVSxNQUFqQjtBQUNBLEVBRk0sTUFFQTtBQUNObVUsU0FBT25VLE1BQVAsR0FBZ0JBLE1BQWhCO0FBQ0E7O0FBRUQ7QUFFQyxDQW42RUQsRUFtNkVLbVUsTUFuNkVMLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkNDVlNrUSxPOzs7Ozs7bUJBQW1CaFcsaUI7Ozs7OzttQkFBbUJDLGdCOzs7Ozs7Ozs7MENBQ3RDK1YsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7Ozs7UUFDR0MsTSIsImZpbGUiOiJvcHRpbWFsLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA5KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlYzUyZWM5Nzg3M2VmOWIwMzM1YyIsIi8qKlxuICogIyBDb21tb25cbiAqXG4gKiBQcm9jZXNzIGNvbGxlY3Rpb25zIGZvciBzaW1pbGFyaXRpZXMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIFF1ZXJ5IGRvY3VtZW50IHVzaW5nIGNvcnJlY3Qgc2VsZWN0b3IgZnVuY3Rpb25cbiAqXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4geyhzZWxlY3Rvcjogc3RyaW5nLCBwYXJlbnQ6IEhUTUxFbGVtZW50KSA9PiBBcnJheS48SFRNTEVsZW1lbnQ+fSAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdCAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLmZvcm1hdCA9PT0gJ2pxdWVyeScpIHtcbiAgICBjb25zdCBTaXp6bGUgPSByZXF1aXJlKCdzaXp6bGUnKVxuICAgIHJldHVybiBmdW5jdGlvbiAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpIHtcbiAgICAgIHJldHVybiBTaXp6bGUoc2VsZWN0b3IsIHBhcmVudCB8fCBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQpXG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpIHtcbiAgICByZXR1cm4gKHBhcmVudCB8fCBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG4gIH0gXG59XG5cblxuLyoqXG4gKiBGaW5kIHRoZSBsYXN0IGNvbW1vbiBhbmNlc3RvciBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vbkFuY2VzdG9yIChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9IFtdXG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwYXJlbnRzID0gW11cbiAgICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCkge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgICAgcGFyZW50cy51bnNoaWZ0KGVsZW1lbnQpXG4gICAgfVxuICAgIGFuY2VzdG9yc1tpbmRleF0gPSBwYXJlbnRzXG4gIH0pXG5cbiAgYW5jZXN0b3JzLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG5cbiAgY29uc3Qgc2hhbGxvd0FuY2VzdG9yID0gYW5jZXN0b3JzLnNoaWZ0KClcblxuICB2YXIgYW5jZXN0b3IgPSBudWxsXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzaGFsbG93QW5jZXN0b3IubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgcGFyZW50ID0gc2hhbGxvd0FuY2VzdG9yW2ldXG4gICAgY29uc3QgbWlzc2luZyA9IGFuY2VzdG9ycy5zb21lKChvdGhlclBhcmVudHMpID0+IHtcbiAgICAgIHJldHVybiAhb3RoZXJQYXJlbnRzLnNvbWUoKG90aGVyUGFyZW50KSA9PiBvdGhlclBhcmVudCA9PT0gcGFyZW50KVxuICAgIH0pXG5cbiAgICBpZiAobWlzc2luZykge1xuICAgICAgLy8gVE9ETzogZmluZCBzaW1pbGFyIHN1Yi1wYXJlbnRzLCBub3QgdGhlIHRvcCByb290LCBlLmcuIHNoYXJpbmcgYSBjbGFzcyBzZWxlY3RvclxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBhbmNlc3RvciA9IHBhcmVudFxuICB9XG5cbiAgcmV0dXJuIGFuY2VzdG9yXG59XG5cbi8qKlxuICogR2V0IGEgc2V0IG9mIGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vblByb3BlcnRpZXMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgY29tbW9uUHJvcGVydGllcyA9IHtcbiAgICBjbGFzc2VzOiBbXSxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICB0YWc6IG51bGxcbiAgfVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgIHZhciB7XG4gICAgICBjbGFzc2VzOiBjb21tb25DbGFzc2VzLFxuICAgICAgYXR0cmlidXRlczogY29tbW9uQXR0cmlidXRlcyxcbiAgICAgIHRhZzogY29tbW9uVGFnXG4gICAgfSA9IGNvbW1vblByb3BlcnRpZXNcblxuICAgIC8vIH4gY2xhc3Nlc1xuICAgIGlmIChjb21tb25DbGFzc2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpXG4gICAgICAgIGlmICghY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQ2xhc3NlcyA9IGNvbW1vbkNsYXNzZXMuZmlsdGVyKChlbnRyeSkgPT4gY2xhc3Nlcy5zb21lKChuYW1lKSA9PiBuYW1lID09PSBlbnRyeSkpXG4gICAgICAgICAgaWYgKGNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjb21tb25DbGFzc2VzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHJlc3RydWN0dXJlIHJlbW92YWwgYXMgMnggc2V0IC8gMnggZGVsZXRlLCBpbnN0ZWFkIG9mIG1vZGlmeSBhbHdheXMgcmVwbGFjaW5nIHdpdGggbmV3IGNvbGxlY3Rpb25cbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gYXR0cmlidXRlc1xuICAgIGlmIChjb21tb25BdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZWxlbWVudEF0dHJpYnV0ZXMpLnJlZHVjZSgoYXR0cmlidXRlcywga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGVsZW1lbnRBdHRyaWJ1dGVzW2tleV1cbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgICAgIC8vIE5PVEU6IHdvcmthcm91bmQgZGV0ZWN0aW9uIGZvciBub24tc3RhbmRhcmQgcGhhbnRvbWpzIE5hbWVkTm9kZU1hcCBiZWhhdmlvdXJcbiAgICAgICAgLy8gKGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXJpeWEvcGhhbnRvbWpzL2lzc3Vlcy8xNDYzNClcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9LCB7fSlcblxuICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcylcbiAgICAgIGNvbnN0IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpXG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICghY29tbW9uQXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25BdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc05hbWVzLnJlZHVjZSgobmV4dENvbW1vbkF0dHJpYnV0ZXMsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29tbW9uQXR0cmlidXRlc1tuYW1lXVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBhdHRyaWJ1dGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgIG5leHRDb21tb25BdHRyaWJ1dGVzW25hbWVdID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0Q29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gdGFnXG4gICAgaWYgKGNvbW1vblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB0YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKCFjb21tb25UYWcpIHtcbiAgICAgICAgY29tbW9uUHJvcGVydGllcy50YWcgPSB0YWdcbiAgICAgIH0gZWxzZSBpZiAodGFnICE9PSBjb21tb25UYWcpIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMudGFnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBjb21tb25Qcm9wZXJ0aWVzXG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24uanMiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBjb252ZXJ0Tm9kZUxpc3QgPSAobm9kZXMpID0+IHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG5vZGVzXG4gIGNvbnN0IGFyciA9IG5ldyBBcnJheShsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJbaV0gPSBub2Rlc1tpXVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuLyoqXG4gKiBFc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBsaW5lIGJyZWFrcyBhcyBhIHNpbXBsaWZpZWQgdmVyc2lvbiBvZiAnQ1NTLmVzY2FwZSgpJ1xuICpcbiAqIERlc2NyaXB0aW9uIG9mIHZhbGlkIGNoYXJhY3RlcnM6IGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9jc3MtZXNjYXBlc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZz99IHZhbHVlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBlc2NhcGVWYWx1ZSA9ICh2YWx1ZSkgPT5cbiAgdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvWydcImBcXFxcLzo/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL1xcbi9nLCAnXFx1MDBhMCcpXG5cbi8qKlxuICogUGFydGl0aW9uIGFycmF5IGludG8gdHdvIGdyb3VwcyBkZXRlcm1pbmVkIGJ5IHByZWRpY2F0ZVxuICovXG5leHBvcnQgY29uc3QgcGFydGl0aW9uID0gKGFycmF5LCBwcmVkaWNhdGUpID0+XG4gIGFycmF5LnJlZHVjZShcbiAgICAoW2lubmVyLCBvdXRlcl0sIGl0ZW0pID0+IHByZWRpY2F0ZShpdGVtKSA/IFtpbm5lci5jb25jYXQoaXRlbSksIG91dGVyXSA6IFtpbm5lciwgb3V0ZXIuY29uY2F0KGl0ZW0pXSxcbiAgICBbW10sIFtdXVxuICApXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmUgc2VsZWN0b3IgZm9yIGEgbm9kZS5cbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVQYXR0ZXJuLCBwYXR0ZXJuVG9TdHJpbmcsIHBzZXVkb1RvU3RyaW5nIH0gZnJvbSAnLi9wYXR0ZXJuJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBlc2NhcGVWYWx1ZSB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICogQHR5cGVkZWYge2ltcG9ydCgnLi9wYXR0ZXJuJykuUGF0dGVybn0gUGF0dGVyblxuICovXG5cbmNvbnN0IGRlZmF1bHRJZ25vcmUgPSB7XG4gIGF0dHJpYnV0ZSAoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBbXG4gICAgICAnc3R5bGUnLFxuICAgICAgJ2RhdGEtcmVhY3RpZCcsXG4gICAgICAnZGF0YS1yZWFjdC1jaGVja3N1bSdcbiAgICBdLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPiAtMVxuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIG9mIHRoZSBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48UGF0dGVybj59ICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudCxcbiAgICBza2lwID0gbnVsbCxcbiAgICBwcmlvcml0eSA9IFsnaWQnLCAnY2xhc3MnLCAnaHJlZicsICdzcmMnXSxcbiAgICBpZ25vcmUgPSB7fSxcbiAgICBmb3JtYXRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBwYXRoID0gW11cbiAgdmFyIGVsZW1lbnQgPSBub2RlXG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICBjb25zdCBqcXVlcnkgPSAoZm9ybWF0ID09PSAnanF1ZXJ5JylcbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG5cbiAgY29uc3Qgc2tpcENvbXBhcmUgPSBza2lwICYmIChBcnJheS5pc0FycmF5KHNraXApID8gc2tpcCA6IFtza2lwXSkubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAoZWxlbWVudCkgPT4gZWxlbWVudCA9PT0gZW50cnlcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5XG4gIH0pXG5cbiAgY29uc3Qgc2tpcENoZWNrcyA9IChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHNraXAgJiYgc2tpcENvbXBhcmUuc29tZSgoY29tcGFyZSkgPT4gY29tcGFyZShlbGVtZW50KSlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGlnbm9yZSkuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgIHZhciBwcmVkaWNhdGUgPSBpZ25vcmVbdHlwZV1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHByZWRpY2F0ZSA9IG5ldyBSZWdFeHAoZXNjYXBlVmFsdWUocHJlZGljYXRlKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUgPyAvKD86KS8gOiAvLl4vXG4gICAgfVxuICAgIC8vIGNoZWNrIGNsYXNzLS9hdHRyaWJ1dGVuYW1lIGZvciByZWdleFxuICAgIGlnbm9yZVt0eXBlXSA9IChuYW1lLCB2YWx1ZSkgPT4gcHJlZGljYXRlLnRlc3QodmFsdWUpXG4gIH0pXG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QgJiYgZWxlbWVudC5ub2RlVHlwZSAhPT0gMTEpIHtcbiAgICBpZiAoc2tpcENoZWNrcyhlbGVtZW50KSAhPT0gdHJ1ZSkge1xuICAgICAgLy8gfiBnbG9iYWxcbiAgICAgIGlmIChjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCByb290KSkgYnJlYWtcbiAgICAgIGlmIChjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcm9vdCkpIGJyZWFrXG5cbiAgICAgIC8vIH4gbG9jYWxcbiAgICAgIGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIH1cblxuICAgICAgaWYgKGpxdWVyeSAmJiBwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrQ29udGFpbnMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KVxuICAgICAgfVxuXG4gICAgICAvLyBkZWZpbmUgb25seSBvbmUgcGFydCBlYWNoIGl0ZXJhdGlvblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tDaGlsZHMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbGVtZW50ID09PSByb290KSB7XG4gICAgY29uc3QgcGF0dGVybiA9IGZpbmRQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdClcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCwgcGFyZW50KVxuICBpZiAocGF0dGVybikge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVyblRvU3RyaW5nKHBhdHRlcm4pLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICBiYXNlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz4/fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENsYXNzU2VsZWN0b3IoY2xhc3NlcyA9IFtdLCBzZWxlY3QsIHBhcmVudCwgYmFzZSkge1xuICBsZXQgcmVzdWx0ID0gW1tdXVxuXG4gIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgcmVzdWx0LmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgcmVzdWx0LnB1c2goci5jb25jYXQoYykpXG4gICAgfSlcbiAgfSlcblxuICByZXN1bHQuc2hpZnQoKVxuICByZXN1bHQgPSByZXN1bHQuc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGggfSlcblxuICBjb25zdCBwcmVmaXggPSBwYXR0ZXJuVG9TdHJpbmcoYmFzZSlcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChgJHtwcmVmaXh9LiR7cmVzdWx0W2ldLmpvaW4oJy4nKX1gLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcmVzdWx0W2ldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMb29rdXAgYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGFyZW50Tm9kZX0gICAgIHBhcmVudCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm4/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGVzUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKHZhbCkgPT4gYXR0cmlidXRlc1t2YWxdLm5hbWUpXG4gICAgLmZpbHRlcigoYSkgPT4gcHJpb3JpdHkuaW5kZXhPZihhKSA8IDApXG5cbiAgdmFyIHNvcnRlZEtleXMgPSBbIC4uLnByaW9yaXR5LCAuLi5hdHRyaWJ1dGVOYW1lcyBdXG4gIHZhciBwYXR0ZXJuID0gY3JlYXRlUGF0dGVybigpXG4gIHBhdHRlcm4udGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcblxuICB2YXIgaXNPcHRpbWFsID0gKHBhdHRlcm4pID0+IChzZWxlY3QocGF0dGVyblRvU3RyaW5nKHBhdHRlcm4pLCBwYXJlbnQpLmxlbmd0aCA9PT0gMSlcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUpXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLnZhbHVlKVxuICAgIGNvbnN0IHVzZU5hbWVkSWdub3JlID0gYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBpZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBjb25zdCBjdXJyZW50RGVmYXVsdElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHN3aXRjaCAoYXR0cmlidXRlTmFtZSkge1xuICAgICAgY2FzZSAnY2xhc3MnOiB7XG4gICAgICAgIGxldCBjbGFzc05hbWVzID0gYXR0cmlidXRlVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpXG4gICAgICAgIGNvbnN0IGNsYXNzSWdub3JlID0gaWdub3JlLmNsYXNzIHx8IGRlZmF1bHRJZ25vcmUuY2xhc3NcbiAgICAgICAgaWYgKGNsYXNzSWdub3JlKSB7XG4gICAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3NJZ25vcmUoY2xhc3NOYW1lKSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xhc3NOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgY2xhc3NlcyA9IGdldENsYXNzU2VsZWN0b3IoY2xhc3NOYW1lcywgc2VsZWN0LCBwYXJlbnQsIHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgICAgIHBhdHRlcm4uY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGF0dGVybi5hdHRyaWJ1dGVzLnB1c2goeyBuYW1lOiBhdHRyaWJ1dGVOYW1lLCB2YWx1ZTogYXR0cmlidXRlVmFsdWUgfSlcbiAgICAgICAgaWYgKGlzT3B0aW1hbChwYXR0ZXJuKSkge1xuICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbCAvLyBwYXR0ZXJuXG59XG5cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBsZXQgbWF0Y2hlcyA9IFtdXG4gICAgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuVG9TdHJpbmcocGF0dGVybiksIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgaWYgKHBhdHRlcm4udGFnID09PSAnaWZyYW1lJykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJuP30gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRUYWdQYXR0ZXJuIChlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgY29uc3QgcGF0dGVybiA9IGNyZWF0ZVBhdHRlcm4oKVxuICBwYXR0ZXJuLnRhZyA9IHRhZ05hbWVcbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBOT1RFOiAnY2hpbGRUYWdzJyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYXMgYSB2aWV3IGZpbHRlciBmb3IgdGFncyB1c2luZyAnYWRhcHRlci5qcydcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGRzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZFRhZ3MgfHwgcGFyZW50LmNoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZCA9PT0gZWxlbWVudCkge1xuICAgICAgY29uc3QgY2hpbGRQYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oY2hpbGQsIGlnbm9yZSlcbiAgICAgIGlmICghY2hpbGRQYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgICAgIEVsZW1lbnQgY291bGRuJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY2hpbGRQYXR0ZXJuLnJlbGF0ZXMgPSAnY2hpbGQnXG4gICAgICBjaGlsZFBhdHRlcm4ucHNldWRvID0gW2BudGgtY2hpbGQoJHtpKzF9KWBdXG4gICAgICBwYXRoLnVuc2hpZnQoY2hpbGRQYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBjb250YWluc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDb250YWlucyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUsIHNlbGVjdClcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IHRleHRzID0gZWxlbWVudC50ZXh0Q29udGVudFxuICAgIC5yZXBsYWNlKC9cXG4rL2csICdcXG4nKVxuICAgIC5zcGxpdCgnXFxuJylcbiAgICAubWFwKHRleHQgPT4gdGV4dC50cmltKCkpXG4gICAgLmZpbHRlcih0ZXh0ID0+IHRleHQubGVuZ3RoID4gMClcblxuICBwYXR0ZXJuLnJlbGF0ZXMgPSAnY2hpbGQnXG4gIGNvbnN0IHByZWZpeCA9IHBhdHRlcm5Ub1N0cmluZyhwYXR0ZXJuKVxuICBjb25zdCBjb250YWlucyA9IFtdXG5cbiAgd2hpbGUgKHRleHRzLmxlbmd0aCA+IDApIHtcbiAgICBjb250YWlucy5wdXNoKGBjb250YWlucyhcIiR7dGV4dHMuc2hpZnQoKX1cIilgKVxuICAgIGlmIChzZWxlY3QoYCR7cHJlZml4fSR7cHNldWRvVG9TdHJpbmcoY29udGFpbnMpfWAsIHBhcmVudCkubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXR0ZXJuLnBzZXVkbyA9IFsuLi5wYXR0ZXJuLnBzZXVkbywgLi4uY29udGFpbnNdXG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZFBhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCkge1xuICB2YXIgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lnbm9yZSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL2NvbW1vbidcbmltcG9ydCB7IHBhdGhUb1N0cmluZywgcGF0dGVyblRvU3RyaW5nLCBwc2V1ZG9Ub1N0cmluZywgYXR0cmlidXRlc1RvU3RyaW5nLCBjbGFzc2VzVG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QsIHBhcnRpdGlvbiB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICogQHR5cGVkZWYge2ltcG9ydCgnLi9wYXR0ZXJuJykuUGF0dGVybn0gUGF0dGVyblxuICovXG5cbi8qKlxuICogQXBwbHkgZGlmZmVyZW50IG9wdGltaXphdGlvbiB0ZWNobmlxdWVzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgICAgICAgICAgICAgcGF0aCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcHRpbWl6ZSAocGF0aCwgZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChwYXRoWzBdLnJlbGF0ZXMgPT09ICdjaGlsZCcpIHtcbiAgICBwYXRoWzBdLnJlbGF0ZXMgPSB1bmRlZmluZWRcbiAgfVxuXG4gIC8vIGNvbnZlcnQgc2luZ2xlIGVudHJ5IGFuZCBOb2RlTGlzdFxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSAhZWxlbWVudHMubGVuZ3RoID8gW2VsZW1lbnRzXSA6IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmICghZWxlbWVudHMubGVuZ3RoIHx8IGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IC0gdG8gY29tcGFyZSBIVE1MRWxlbWVudHMgaXRzIG5lY2Vzc2FyeSB0byBwcm92aWRlIGEgcmVmZXJlbmNlIG9mIHRoZSBzZWxlY3RlZCBub2RlKHMpISAobWlzc2luZyBcImVsZW1lbnRzXCIpJylcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gcGF0dGVyblRvU3RyaW5nKG9wdGltaXplUGFydCgnJywgcGF0aFswXSwgJycsIGVsZW1lbnRzLCBzZWxlY3QpKVxuICB9XG5cbiAgdmFyIGVuZE9wdGltaXplZCA9IGZhbHNlXG4gIGlmIChwYXRoW3BhdGgubGVuZ3RoLTFdLnJlbGF0ZXMgPT09ICdjaGlsZCcpIHtcbiAgICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGhUb1N0cmluZyhwYXRoLnNsaWNlKDAsIC0xKSksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50cywgc2VsZWN0KVxuICAgIGVuZE9wdGltaXplZCA9IHRydWVcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lZCA9IFtwYXRoLnBvcCgpXVxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBwcmVQYXJ0ID0gcGF0aFRvU3RyaW5nKHBhdGgpXG4gICAgY29uc3QgcG9zdFBhcnQgPSBwYXRoVG9TdHJpbmcoc2hvcnRlbmVkKVxuXG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChgJHtwcmVQYXJ0fSAke3Bvc3RQYXJ0fWApXG4gICAgY29uc3QgaGFzU2FtZVJlc3VsdCA9IG1hdGNoZXMubGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQsIGkpID0+IGVsZW1lbnQgPT09IG1hdGNoZXNbaV0pXG4gICAgaWYgKCFoYXNTYW1lUmVzdWx0KSB7XG4gICAgICBzaG9ydGVuZWQudW5zaGlmdChvcHRpbWl6ZVBhcnQocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpKVxuICAgIH1cbiAgfVxuICBzaG9ydGVuZWQudW5zaGlmdChwYXRoWzBdKVxuICBwYXRoID0gc2hvcnRlbmVkXG5cbiAgLy8gb3B0aW1pemUgc3RhcnQgKyBlbmRcbiAgcGF0aFswXSA9IG9wdGltaXplUGFydCgnJywgcGF0aFswXSwgcGF0aFRvU3RyaW5nKHBhdGguc2xpY2UoMSkpLCBlbGVtZW50cywgc2VsZWN0KVxuICBpZiAoIWVuZE9wdGltaXplZCkge1xuICAgIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aFRvU3RyaW5nKHBhdGguc2xpY2UoMCwgLTEpKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnRzLCBzZWxlY3QpXG4gIH1cblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gcGF0aFRvU3RyaW5nKHBhdGgpIC8vIHBhdGguam9pbignICcpLnJlcGxhY2UoLz4vZywgJz4gJykudHJpbSgpXG59XG5cbi8qKlxuICogT3B0aW1pemUgOmNvbnRhaW5zXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZUNvbnRhaW5zIChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICBjb25zdCBbY29udGFpbnMsIG90aGVyXSA9IHBhcnRpdGlvbihjdXJyZW50LnBzZXVkbywgKGl0ZW0pID0+IC9jb250YWluc1xcKFwiLy50ZXN0KGl0ZW0pKVxuICBjb25zdCBwcmVmaXggPSBwYXR0ZXJuVG9TdHJpbmcoeyAuLi5jdXJyZW50LCBwc2V1ZG86IFtdIH0pXG5cbiAgaWYgKGNvbnRhaW5zLmxlbmd0aCA+IDAgJiYgcG9zdFBhcnQubGVuZ3RoKSB7XG4gICAgY29uc3Qgb3B0aW1pemVkID0gWy4uLm90aGVyLCAuLi5jb250YWluc11cbiAgICB3aGlsZSAob3B0aW1pemVkLmxlbmd0aCA+IG90aGVyLmxlbmd0aCkge1xuICAgICAgb3B0aW1pemVkLnBvcCgpXG4gICAgICBjb25zdCBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3ByZWZpeH0ke3BzZXVkb1RvU3RyaW5nKG9wdGltaXplZCl9JHtwb3N0UGFydH1gXG4gICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKHNlbGVjdChwYXR0ZXJuKSwgZWxlbWVudHMpKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjdXJyZW50LnBzZXVkbyA9IG9wdGltaXplZFxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplQXR0cmlidXRlcyAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgLy8gcmVkdWNlIGF0dHJpYnV0ZXM6IGZpcnN0IHRyeSB3aXRob3V0IHZhbHVlLCB0aGVuIHJlbW92aW5nIGNvbXBsZXRlbHlcbiAgaWYgKGN1cnJlbnQuYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgbGV0IGF0dHJpYnV0ZXMgPSBbLi4uY3VycmVudC5hdHRyaWJ1dGVzXVxuICAgIGxldCBwcmVmaXggPSBwYXR0ZXJuVG9TdHJpbmcoeyAuLi5jdXJyZW50LCBhdHRyaWJ1dGVzOiBbXSB9KVxuXG4gICAgY29uc3Qgc2ltcGxpZnkgPSAob3JpZ2luYWwsIGdldFNpbXBsaWZpZWQpID0+IHtcbiAgICAgIGxldCBpID0gb3JpZ2luYWwubGVuZ3RoIC0gMVxuICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGdldFNpbXBsaWZpZWQob3JpZ2luYWwsIGkpXG4gICAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoXG4gICAgICAgICAgc2VsZWN0KGAke3ByZVBhcnR9JHtwcmVmaXh9JHthdHRyaWJ1dGVzVG9TdHJpbmcoYXR0cmlidXRlcyl9JHtwb3N0UGFydH1gKSxcbiAgICAgICAgICBlbGVtZW50c1xuICAgICAgICApKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBpLS1cbiAgICAgICAgb3JpZ2luYWwgPSBhdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgICByZXR1cm4gb3JpZ2luYWxcbiAgICB9XG5cbiAgICBjb25zdCBzaW1wbGlmaWVkID0gc2ltcGxpZnkoYXR0cmlidXRlcywgKGF0dHJpYnV0ZXMsIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgbmFtZSB9ID0gYXR0cmlidXRlc1tpXVxuICAgICAgaWYgKG5hbWUgPT09ICdpZCcpIHtcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICAgIHJldHVybiBbLi4uYXR0cmlidXRlcy5zbGljZSgwLCBpKSwgeyBuYW1lLCB2YWx1ZTogbnVsbCB9LCAuLi5hdHRyaWJ1dGVzLnNsaWNlKGkgKyAxKV1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHsgLi4uY3VycmVudCwgYXR0cmlidXRlczogc2ltcGxpZnkoc2ltcGxpZmllZCwgYXR0cmlidXRlcyA9PiBhdHRyaWJ1dGVzLnNsaWNlKDAsIC0xKSkgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgZGVzY2VuZGFudFxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVEZXNjZW5kYW50IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKGN1cnJlbnQucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSB7IC4uLmN1cnJlbnQsIHJlbGF0ZXM6IHVuZGVmaW5lZCB9XG4gICAgbGV0IG1hdGNoZXMgPSBzZWxlY3QoYCR7cHJlUGFydH0ke3BhdHRlcm5Ub1N0cmluZyhkZXNjZW5kYW50KX0ke3Bvc3RQYXJ0fWApXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRhbnRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBudGggb2YgdHlwZVxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVOdGhPZlR5cGUgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIGNvbnN0IGkgPSBjdXJyZW50LnBzZXVkby5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLnN0YXJ0c1dpdGgoJ250aC1jaGlsZCcpKVxuICAvLyByb2J1c3RuZXNzOiAnbnRoLW9mLXR5cGUnIGluc3RlYWQgJ250aC1jaGlsZCcgKGhldXJpc3RpYylcbiAgaWYgKGkgPj0gMCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5wc2V1ZG9baV0ucmVwbGFjZSgvXm50aC1jaGlsZC8sICdudGgtb2YtdHlwZScpXG4gICAgY29uc3QgbnRoT2ZUeXBlID0geyAuLi5jdXJyZW50LCBwc2V1ZG86IFsuLi5jdXJyZW50LnBzZXVkby5zbGljZSgwLCBpKSwgdHlwZSwgLi4uY3VycmVudC5wc2V1ZG8uc2xpY2UoaSArIDEpXSB9XG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7cGF0dGVyblRvU3RyaW5nKG50aE9mVHlwZSl9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0gbnRoT2ZUeXBlXG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgY2xhc3Nlc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVDbGFzc2VzIChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICAvLyBlZmZpY2llbmN5OiBjb21iaW5hdGlvbnMgb2YgY2xhc3NuYW1lIChwYXJ0aWFsIHBlcm11dGF0aW9ucylcbiAgaWYgKGN1cnJlbnQuY2xhc3Nlcy5sZW5ndGggPiAxKSB7XG4gICAgbGV0IG9wdGltaXplZCA9IGN1cnJlbnQuY2xhc3Nlcy5zbGljZSgpLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG4gICAgbGV0IHByZWZpeCA9IHBhdHRlcm5Ub1N0cmluZyh7IC4uLmN1cnJlbnQsIGNsYXNzZXM6IFtdIH0pXG5cbiAgICB3aGlsZSAob3B0aW1pemVkLmxlbmd0aCA+IDEpIHtcbiAgICAgIG9wdGltaXplZC5zaGlmdCgpXG4gICAgICBjb25zdCBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3ByZWZpeH0ke2NsYXNzZXNUb1N0cmluZyhvcHRpbWl6ZWQpfSR7cG9zdFBhcnR9YFxuICAgICAgaWYgKCFwYXR0ZXJuLmxlbmd0aCB8fCBwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gJz4nIHx8IHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoLTEpID09PSAnPicpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoc2VsZWN0KHBhdHRlcm4pLCBlbGVtZW50cykpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQuY2xhc3NlcyA9IG9wdGltaXplZFxuICAgIH1cblxuICAgIG9wdGltaXplZCA9IGN1cnJlbnQuY2xhc3Nlc1xuICAgIGlmIChvcHRpbWl6ZWQubGVuZ3RoID4gMikge1xuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IHNlbGVjdChgJHtwcmVQYXJ0fSR7Y2xhc3Nlc1RvU3RyaW5nKGN1cnJlbnQpfWApXG4gICAgICBmb3IgKHZhciBpMiA9IDAsIGwyID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpMl1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSkpIHtcbiAgICAgICAgICAvLyBUT0RPOlxuICAgICAgICAgIC8vIC0gY2hlY2sgdXNpbmcgYXR0cmlidXRlcyArIHJlZ2FyZCBleGNsdWRlc1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NyaXB0aW9ufSR7cG9zdFBhcnR9YFxuICAgICAgICAgIHZhciBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IHsgdGFnOiBkZXNjcmlwdGlvbiB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuY29uc3Qgb3B0aW1pemVycyA9IFtcbiAgb3B0aW1pemVDb250YWlucyxcbiAgb3B0aW1pemVBdHRyaWJ1dGVzLFxuICBvcHRpbWl6ZURlc2NlbmRhbnQsXG4gIG9wdGltaXplTnRoT2ZUeXBlLFxuICBvcHRpbWl6ZUNsYXNzZXMsXG5dXG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVQYXJ0IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICBpZiAocHJlUGFydC5sZW5ndGgpIHByZVBhcnQgPSBgJHtwcmVQYXJ0fSBgXG4gIGlmIChwb3N0UGFydC5sZW5ndGgpIHBvc3RQYXJ0ID0gYCAke3Bvc3RQYXJ0fWBcblxuICByZXR1cm4gb3B0aW1pemVycy5yZWR1Y2UoKGFjYywgb3B0aW1pemVyKSA9PiBvcHRpbWl6ZXIocHJlUGFydCwgYWNjLCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCksIGN1cnJlbnQpXG59XG5cbi8qKlxuICogRXZhbHVhdGUgbWF0Y2hlcyB3aXRoIGV4cGVjdGVkIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gbWF0Y2hlcyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjb21wYXJlUmVzdWx0cyAobWF0Y2hlcywgZWxlbWVudHMpIHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG1hdGNoZXNcbiAgcmV0dXJuIGxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoICYmIGVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1hdGNoZXNbaV0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb3B0aW1pemUuanMiLCIvKipcbiAqICMgQWRhcHRcbiAqXG4gKiBDaGVjayBhbmQgZXh0ZW5kIHRoZSBlbnZpcm9ubWVudCBmb3IgdW5pdmVyc2FsIHVzYWdlLlxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKi9cblxuLyoqXG4gKiBNb2RpZnkgdGhlIGNvbnRleHQgYmFzZWQgb24gdGhlIGVudmlyb25tZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGFwdCAoZWxlbWVudCwgb3B0aW9ucykge1xuICAvLyBkZXRlY3QgZW52aXJvbm1lbnQgc2V0dXBcbiAgaWYgKGdsb2JhbC5kb2N1bWVudCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5kb2N1bWVudCA9IG9wdGlvbnMuY29udGV4dCB8fCAoKCkgPT4ge1xuICAgICAgdmFyIHJvb3QgPSBlbGVtZW50XG4gICAgICB3aGlsZSAocm9vdC5wYXJlbnQpIHtcbiAgICAgICAgcm9vdCA9IHJvb3QucGFyZW50XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdFxuICAgIH0pKClcbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWhhbmRsZXIvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDc1XG4gIGNvbnN0IEVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsLmRvY3VtZW50KVxuXG4gIC8vIGFsdGVybmF0aXZlIGRlc2NyaXB0b3IgdG8gYWNjZXNzIGVsZW1lbnRzIHdpdGggZmlsdGVyaW5nIGludmFsaWQgZWxlbWVudHMgKGUuZy4gdGV4dG5vZGVzKVxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycpKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9tZWxlbWVudHR5cGUvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDEyXG4gICAgICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ3RhZycgfHwgbm9kZS50eXBlID09PSAnc2NyaXB0JyB8fCBub2RlLnR5cGUgPT09ICdzdHlsZSdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJykpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRyaWJ1dGVzXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05hbWVkTm9kZU1hcFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICBjb25zdCB7IGF0dHJpYnMgfSA9IHRoaXNcbiAgICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlicylcbiAgICAgICAgY29uc3QgTmFtZWROb2RlTWFwID0gYXR0cmlidXRlc05hbWVzLnJlZHVjZSgoYXR0cmlidXRlcywgYXR0cmlidXRlTmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2luZGV4XSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGF0dHJpYnV0ZU5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogYXR0cmlic1thdHRyaWJ1dGVOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgICB9LCB7IH0pXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYW1lZE5vZGVNYXAsICdsZW5ndGgnLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlc05hbWVzLmxlbmd0aFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gTmFtZWROb2RlTWFwXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0VsZW1lbnQvZ2V0QXR0cmlidXRlXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0QXR0cmlidXRlXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlic1tuYW1lXSB8fCBudWxsXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9Eb2N1bWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGZ1bmN0aW9uICh0YWdOYW1lKSB7XG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKHRoaXMuY2hpbGRUYWdzLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudC5uYW1lID09PSB0YWdOYW1lIHx8IHRhZ05hbWUgPT09ICcqJykge1xuICAgICAgICAgIEhUTUxDb2xsZWN0aW9uLnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBIVE1MQ29sbGVjdGlvblxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9Eb2N1bWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IG5hbWVzID0gY2xhc3NOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykuc3BsaXQoJyAnKVxuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlc2NlbmRhbnRDbGFzc05hbWUgPSBkZXNjZW5kYW50LmF0dHJpYnMuY2xhc3NcbiAgICAgICAgaWYgKGRlc2NlbmRhbnRDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IGRlc2NlbmRhbnRDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKSkge1xuICAgICAgICAgIEhUTUxDb2xsZWN0aW9uLnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBIVE1MQ29sbGVjdGlvblxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2Nzcy9zZWxlY3RvcnNfYXBpL3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9xdWVyeVNlbGVjdG9yQWxsXG4gICAgRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsID0gZnVuY3Rpb24gKHNlbGVjdG9ycykge1xuICAgICAgc2VsZWN0b3JzID0gc2VsZWN0b3JzLnJlcGxhY2UoLyg+KShcXFMpL2csICckMSAkMicpLnRyaW0oKSAvLyBhZGQgc3BhY2UgZm9yICc+JyBzZWxlY3RvclxuXG4gICAgICAvLyB1c2luZyByaWdodCB0byBsZWZ0IGV4ZWN1dGlvbiA9PiBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9jc3Mtc2VsZWN0I2hvdy1kb2VzLWl0LXdvcmtcbiAgICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IGdldEluc3RydWN0aW9ucyhzZWxlY3RvcnMpXG4gICAgICBjb25zdCBkaXNjb3ZlciA9IGluc3RydWN0aW9ucy5zaGlmdCgpXG5cbiAgICAgIGNvbnN0IHRvdGFsID0gaW5zdHJ1Y3Rpb25zLmxlbmd0aFxuICAgICAgcmV0dXJuIGRpc2NvdmVyKHRoaXMpLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICB2YXIgc3RlcCA9IDBcbiAgICAgICAgd2hpbGUgKHN0ZXAgPCB0b3RhbCkge1xuICAgICAgICAgIG5vZGUgPSBpbnN0cnVjdGlvbnNbc3RlcF0obm9kZSwgdGhpcylcbiAgICAgICAgICBpZiAoIW5vZGUpIHsgLy8gaGllcmFyY2h5IGRvZXNuJ3QgbWF0Y2hcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBzdGVwICs9IDFcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuY29udGFpbnMpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9jb250YWluc1xuICAgIEVsZW1lbnRQcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgdmFyIGluY2x1c2l2ZSA9IGZhbHNlXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQsIGRvbmUpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICBpbmNsdXNpdmUgPSB0cnVlXG4gICAgICAgICAgZG9uZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gaW5jbHVzaXZlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSB0cmFuc2Zvcm1hdGlvbiBzdGVwc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSAgIHNlbGVjdG9ycyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxGdW5jdGlvbj59ICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0SW5zdHJ1Y3Rpb25zIChzZWxlY3RvcnMpIHtcbiAgcmV0dXJuIHNlbGVjdG9ycy5zcGxpdCgnICcpLnJldmVyc2UoKS5tYXAoKHNlbGVjdG9yLCBzdGVwKSA9PiB7XG4gICAgY29uc3QgZGlzY292ZXIgPSBzdGVwID09PSAwXG4gICAgY29uc3QgW3R5cGUsIHBzZXVkb10gPSBzZWxlY3Rvci5zcGxpdCgnOicpXG5cbiAgICB2YXIgdmFsaWRhdGUgPSBudWxsXG4gICAgdmFyIGluc3RydWN0aW9uID0gbnVsbFxuXG4gICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgIC8vIGNoaWxkOiAnPidcbiAgICAgIGNhc2UgLz4vLnRlc3QodHlwZSk6XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tQYXJlbnQgKG5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gKHZhbGlkYXRlKSA9PiB2YWxpZGF0ZShub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnRcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAgIC8vIGNsYXNzOiAnLidcbiAgICAgIGNhc2UgL15cXC4vLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0eXBlLnN1YnN0cigxKS5zcGxpdCgnLicpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlQ2xhc3NOYW1lID0gbm9kZS5hdHRyaWJzLmNsYXNzXG4gICAgICAgICAgcmV0dXJuIG5vZGVDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IG5vZGVDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tDbGFzcyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcy5qb2luKCcgJykpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyBhdHRyaWJ1dGU6ICdba2V5PVwidmFsdWVcIl0nXG4gICAgICBjYXNlIC9eXFxbLy50ZXN0KHR5cGUpOiB7XG4gICAgICAgIGNvbnN0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSA9IHR5cGUucmVwbGFjZSgvXFxbfFxcXXxcIi9nLCAnJykuc3BsaXQoJz0nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFzQXR0cmlidXRlID0gT2JqZWN0LmtleXMobm9kZS5hdHRyaWJzKS5pbmRleE9mKGF0dHJpYnV0ZUtleSkgPiAtMVxuICAgICAgICAgIGlmIChoYXNBdHRyaWJ1dGUpIHsgLy8gcmVnYXJkIG9wdGlvbmFsIGF0dHJpYnV0ZVZhbHVlXG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZVZhbHVlIHx8IChub2RlLmF0dHJpYnNbYXR0cmlidXRlS2V5XSA9PT0gYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGUgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIGlkOiAnIydcbiAgICAgIGNhc2UgL14jLy50ZXN0KHR5cGUpOiB7XG4gICAgICAgIGNvbnN0IGlkID0gdHlwZS5zdWJzdHIoMSlcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLmF0dHJpYnMuaWQgPT09IGlkXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0lkIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICAgIGRvbmUoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyB1bml2ZXJzYWw6ICcqJ1xuICAgICAgY2FzZSAvXFwqLy50ZXN0KHR5cGUpOiB7XG4gICAgICAgIHZhbGlkYXRlID0gKCkgPT4gdHJ1ZVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVW5pdmVyc2FsIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudCkpXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIHRhZzogJy4uLidcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSB0eXBlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1RhZyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXBzZXVkbykge1xuICAgICAgcmV0dXJuIGluc3RydWN0aW9uXG4gICAgfVxuXG4gICAgY29uc3QgcnVsZSA9IHBzZXVkby5tYXRjaCgvLShjaGlsZHx0eXBlKVxcKChcXGQrKVxcKSQvKVxuICAgIGNvbnN0IGtpbmQgPSBydWxlWzFdXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChydWxlWzJdLCAxMCkgLSAxXG5cbiAgICBjb25zdCB2YWxpZGF0ZVBzZXVkbyA9IChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICB2YXIgY29tcGFyZVNldCA9IG5vZGUucGFyZW50LmNoaWxkVGFnc1xuICAgICAgICBpZiAoa2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgICAgICAgY29tcGFyZVNldCA9IGNvbXBhcmVTZXQuZmlsdGVyKHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVJbmRleCA9IGNvbXBhcmVTZXQuZmluZEluZGV4KChjaGlsZCkgPT4gY2hpbGQgPT09IG5vZGUpXG4gICAgICAgIGlmIChub2RlSW5kZXggPT09IGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGVuaGFuY2VJbnN0cnVjdGlvbiAobm9kZSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBpbnN0cnVjdGlvbihub2RlKVxuICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgIHJldHVybiBtYXRjaC5yZWR1Y2UoKE5vZGVMaXN0LCBtYXRjaGVkTm9kZSkgPT4ge1xuICAgICAgICAgIGlmICh2YWxpZGF0ZVBzZXVkbyhtYXRjaGVkTm9kZSkpIHtcbiAgICAgICAgICAgIE5vZGVMaXN0LnB1c2gobWF0Y2hlZE5vZGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICB9LCBbXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxpZGF0ZVBzZXVkbyhtYXRjaCkgJiYgbWF0Y2hcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogV2Fsa2luZyByZWN1cnNpdmUgdG8gaW52b2tlIGNhbGxiYWNrc1xuICpcbiAqIEBwYXJhbSB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gbm9kZXMgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgICAgICAgaGFuZGxlciAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VEZXNjZW5kYW50cyAobm9kZXMsIGhhbmRsZXIpIHtcbiAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIHZhciBwcm9ncmVzcyA9IHRydWVcbiAgICBoYW5kbGVyKG5vZGUsICgpID0+IHByb2dyZXNzID0gZmFsc2UpXG4gICAgaWYgKG5vZGUuY2hpbGRUYWdzICYmIHByb2dyZXNzKSB7XG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKG5vZGUuY2hpbGRUYWdzLCBoYW5kbGVyKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBCdWJibGUgdXAgZnJvbSBib3R0b20gdG8gdG9wXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IHJvb3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgIHZhbGlkYXRlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRBbmNlc3RvciAobm9kZSwgcm9vdCwgdmFsaWRhdGUpIHtcbiAgd2hpbGUgKG5vZGUucGFyZW50KSB7XG4gICAgbm9kZSA9IG5vZGUucGFyZW50XG4gICAgaWYgKHZhbGlkYXRlKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZVxuICAgIH1cbiAgICBpZiAobm9kZSA9PT0gcm9vdCkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hZGFwdC5qcyIsIi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IFBhdHRlcm5cbiAqIEBwcm9wZXJ0eSB7KCdkZXNjZW5kYW50JyB8ICdjaGlsZCcpfSAgICAgICAgICAgICAgICAgIFtyZWxhdGVzXVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhZ11cbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9Pn0gIGF0dHJpYnV0ZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBzZXVkb1xuICovXG5cbi8qKlxuICogQ29udmVydCBhdHRyaWJ1dGVzIHRvIHN0cmluZ1xuICogXG4gKiBAcGFyYW0ge0FycmF5Ljx7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZz8gfT59IGF0dHJpYnV0ZXMgXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgYXR0cmlidXRlc1RvU3RyaW5nID0gKGF0dHJpYnV0ZXMpID0+XG4gIGF0dHJpYnV0ZXMubWFwKCh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBpZiAobmFtZSA9PT0gJ2lkJykge1xuICAgICAgcmV0dXJuIGAjJHt2YWx1ZX1gXG4gICAgfVxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGBbJHtuYW1lfV1gXG4gICAgfVxuICAgIHJldHVybiBgWyR7bmFtZX09XCIke3ZhbHVlfVwiXWBcbiAgfSkuam9pbignJylcblxuLyoqXG4gKiBDb252ZXJ0IGNsYXNzZXMgdG8gc3RyaW5nXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNsYXNzZXMgXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgY2xhc3Nlc1RvU3RyaW5nID0gKGNsYXNzZXMpID0+IGNsYXNzZXMubGVuZ3RoID8gYC4ke2NsYXNzZXMuam9pbignLicpfWAgOiAnJ1xuXG4vKipcbiAqIENvbnZlcnQgcHNldWRvIHNlbGVjdG9ycyB0byBzdHJpbmdcbiAqIFxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcHNldWRvIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBzZXVkb1RvU3RyaW5nID0gKHBzZXVkbykgPT4gcHNldWRvLmxlbmd0aCA/IGA6JHtwc2V1ZG8uam9pbignOicpfWAgOiAnJ1xuXG4vKipcbiAqIENvbnZlcnQgcGF0dGVybiB0byBzdHJpbmdcbiAqIFxuICogQHBhcmFtIHtQYXR0ZXJufSBwYXR0ZXJuIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBhdHRlcm5Ub1N0cmluZyA9IChwYXR0ZXJuKSA9PiB7XG4gIGNvbnN0IHsgcmVsYXRlcywgdGFnLCBhdHRyaWJ1dGVzLCBjbGFzc2VzLCBwc2V1ZG8gfSA9IHBhdHRlcm5cbiAgY29uc3QgdmFsdWUgPSBgJHtcbiAgICByZWxhdGVzID09PSAnY2hpbGQnID8gJz4gJyA6ICcnXG4gIH0ke1xuICAgIHRhZyB8fCAnJ1xuICB9JHtcbiAgICBhdHRyaWJ1dGVzVG9TdHJpbmcoYXR0cmlidXRlcylcbiAgfSR7XG4gICAgY2xhc3Nlc1RvU3RyaW5nKGNsYXNzZXMpXG4gIH0ke1xuICAgIHBzZXVkb1RvU3RyaW5nKHBzZXVkbylcbiAgfWBcbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBwYXR0ZXJuIHN0cnVjdHVyZVxuICogXG4gKiBAcGFyYW0ge1BhcnRpYWw8UGF0dGVybj59IHBhdHRlcm5cbiAqIEByZXR1cm5zIHtQYXR0ZXJufVxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlUGF0dGVybiA9IChiYXNlID0ge30pID0+XG4gICh7IGF0dHJpYnV0ZXM6IFtdLCBjbGFzc2VzOiBbXSwgcHNldWRvOiBbXSwgLi4uYmFzZSB9KVxuXG4vKipcbiAqIENvbnZlcnRzIHBhdGggdG8gc3RyaW5nXG4gKlxuICogQHBhcmFtIHtBcnJheS48UGF0dGVybj59IHBhdGggXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgcGF0aFRvU3RyaW5nID0gKHBhdGgpID0+XG4gIHBhdGgubWFwKHBhdHRlcm5Ub1N0cmluZykuam9pbignICcpXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGF0dGVybi5qcyIsIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5IHNlbGVjdG9yIHRvIGFjY2VzcyB0aGUgc2VsZWN0ZWQgRE9NIGVsZW1lbnQocykuXG4gKiBGb3IgbG9uZ2V2aXR5IGl0IGFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcy5cbiAqL1xuaW1wb3J0IGNzczJ4cGF0aCBmcm9tICdjc3MyeHBhdGgnXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0LCBnZXRDb21tb25BbmNlc3RvciwgZ2V0Q29tbW9uUHJvcGVydGllcyB9IGZyb20gJy4vY29tbW9uJ1xuXG4vKipcbiAqIEB0eXBlZGVmICB7T2JqZWN0fSBPcHRpb25zXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBbcm9vdF0gICAgICAgICAgICAgICAgICAgICBPcHRpb25hbGx5IHNwZWNpZnkgdGhlIHJvb3QgZWxlbWVudFxuICogQHByb3BlcnR5IHtmdW5jdGlvbiB8IEFycmF5LjxIVE1MRWxlbWVudD59IFtza2lwXSAgU3BlY2lmeSBlbGVtZW50cyB0byBza2lwXG4gKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+fSBbcHJpb3JpdHldICAgICAgICAgICAgICBPcmRlciBvZiBhdHRyaWJ1dGUgcHJvY2Vzc2luZ1xuICogQHByb3BlcnR5IHtPYmplY3Q8c3RyaW5nLCBmdW5jdGlvbiB8IG51bWJlciB8IHN0cmluZyB8IGJvb2xlYW59IFtpZ25vcmVdIERlZmluZSBwYXR0ZXJucyB3aGljaCBzaG91bGRuJ3QgYmUgaW5jbHVkZWRcbiAqIEBwcm9wZXJ0eSB7KCdjc3MnfCd4cGF0aCd8J2pxdWVyeScpfSBbZm9ybWF0XSAgICAgIE91dHB1dCBmb3JtYXQgICAgXG4gKi9cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBmb3IgdGhlIHByb3ZpZGVkIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDMpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIH1cblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgY29uc3QgcGF0aCA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHBhdGgsIGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgLy8gZGVidWdcbiAgLy8gY29uc29sZS5sb2coYFxuICAvLyAgIHNlbGVjdG9yOiAgJHtzZWxlY3Rvcn1cbiAgLy8gICBvcHRpbWl6ZWQ6ICR7b3B0aW1pemVkfVxuICAvLyBgKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZWRcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBkZXNjZW5kYW50cyBmcm9tIGFuIGFuY2VzdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdH0gZWxlbWVudHMgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TXVsdGlTZWxlY3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIG9ubHkgYW4gQXJyYXkgb2YgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGlzIHN1cHBvcnRlZCEnKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG5cbiAgY29uc3QgYW5jZXN0b3IgPSBnZXRDb21tb25BbmNlc3RvcihlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3QgYW5jZXN0b3JTZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGFuY2VzdG9yLCBvcHRpb25zKVxuXG4gIC8vIFRPRE86IGNvbnNpZGVyIHVzYWdlIG9mIG11bHRpcGxlIHNlbGVjdG9ycyArIHBhcmVudC1jaGlsZCByZWxhdGlvbiArIGNoZWNrIGZvciBwYXJ0IHJlZHVuZGFuY3lcbiAgY29uc3QgY29tbW9uU2VsZWN0b3JzID0gZ2V0Q29tbW9uU2VsZWN0b3JzKGVsZW1lbnRzKVxuICBjb25zdCBkZXNjZW5kYW50U2VsZWN0b3IgPSBjb21tb25TZWxlY3RvcnNbMF1cblxuICBjb25zdCBzZWxlY3RvciA9IG9wdGltaXplKGAke2FuY2VzdG9yU2VsZWN0b3J9ICR7ZGVzY2VuZGFudFNlbGVjdG9yfWAsIGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3Rvck1hdGNoZXMgPSBjb252ZXJ0Tm9kZUxpc3Qoc2VsZWN0KHNlbGVjdG9yKSlcblxuICBpZiAoIWVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiBzZWxlY3Rvck1hdGNoZXMuc29tZSgoZW50cnkpID0+IGVudHJ5ID09PSBlbGVtZW50KSApKSB7XG4gICAgLy8gVE9ETzogY2x1c3RlciBtYXRjaGVzIHRvIHNwbGl0IGludG8gc2ltaWxhciBncm91cHMgZm9yIHN1YiBzZWxlY3Rpb25zXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICBUaGUgc2VsZWN0ZWQgZWxlbWVudHMgY2FuJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLlxuICAgICAgSXRzIHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCFcbiAgICBgLCBlbGVtZW50cylcbiAgfVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclxufVxuXG4vKipcbiAqIEdldCBzZWxlY3RvcnMgdG8gZGVzY3JpYmUgYSBzZXQgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENvbW1vblNlbGVjdG9ycyAoZWxlbWVudHMpIHtcblxuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBbXVxuXG4gIGlmICh0YWcpIHtcbiAgICBzZWxlY3RvclBhdGgucHVzaCh0YWcpXG4gIH1cblxuICBpZiAoY2xhc3Nlcykge1xuICAgIGNvbnN0IGNsYXNzU2VsZWN0b3IgPSBjbGFzc2VzLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YCkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChjbGFzc1NlbGVjdG9yKVxuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVTZWxlY3RvciA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgocGFydHMsIG5hbWUpID0+IHtcbiAgICAgIHBhcnRzLnB1c2goYFske25hbWV9PVwiJHthdHRyaWJ1dGVzW25hbWVdfVwiXWApXG4gICAgICByZXR1cm4gcGFydHNcbiAgICB9LCBbXSkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChhdHRyaWJ1dGVTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChzZWxlY3RvclBhdGgubGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogY2hlY2sgZm9yIHBhcmVudC1jaGlsZCByZWxhdGlvblxuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBzZWxlY3RvclBhdGguam9pbignJylcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCAmJiAhaW5wdXQubmFtZSkge1xuICAgIHJldHVybiBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICBpZiAob3B0aW9ucyAmJiBbMSwgJ3hwYXRoJ10uaW5jbHVkZXMob3B0aW9ucy5mb3JtYXQpKSB7XG4gICAgcmV0dXJuIGNzczJ4cGF0aChyZXN1bHQpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VsZWN0LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICB2YXIgeHBhdGhfdG9fbG93ZXIgICAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAndHJhbnNsYXRlKCcgK1xuICAgICAgICAgICAgICAgIChzIHx8ICdub3JtYWxpemUtc3BhY2UoKScpICtcbiAgICAgICAgICAgICAgICAnLCBcXCdBQkNERUZHSEpJS0xNTk9QUVJTVFVWV1hZWlxcJycgK1xuICAgICAgICAgICAgICAgICcsIFxcJ2FiY2RlZmdoamlrbG1ub3BxcnN0dXZ3eHl6XFwnKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfZW5kc193aXRoICAgICAgICA9IGZ1bmN0aW9uIChzMSwgczIpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmcoJyArIHMxICsgJywnICtcbiAgICAgICAgICAgICAgICAnc3RyaW5nLWxlbmd0aCgnICsgczEgKyAnKS1zdHJpbmctbGVuZ3RoKCcgKyBzMiArICcpKzEpPScgKyBzMjtcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmwgICAgICAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYmVmb3JlKGNvbmNhdChzdWJzdHJpbmctYWZ0ZXIoJyArXG4gICAgICAgICAgICAgICAgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCI6Ly9cIiksXCI/XCIpLFwiP1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX3BhdGggICAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWFmdGVyKCcgKyAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIi9cIiknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybF9kb21haW4gICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1iZWZvcmUoY29uY2F0KHN1YnN0cmluZy1hZnRlcignICtcbiAgICAgICAgICAgICAgIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiOi8vXCIpLFwiL1wiKSxcIi9cIiknO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybF9hdHRycyAgICAgICAgPSAnQGhyZWZ8QHNyYycsXG4gICAgICB4cGF0aF9sb3dlcl9jYXNlICAgICAgID0geHBhdGhfdG9fbG93ZXIoKSxcbiAgICAgIHhwYXRoX25zX3VyaSAgICAgICAgICAgPSAnYW5jZXN0b3Itb3Itc2VsZjo6KltsYXN0KCldL0B1cmwnLFxuICAgICAgeHBhdGhfbnNfcGF0aCAgICAgICAgICA9IHhwYXRoX3VybF9wYXRoKHhwYXRoX3VybCh4cGF0aF9uc191cmkpKSxcbiAgICAgIHhwYXRoX2hhc19wcm90b2NhbCAgICAgPSAnKHN0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiaHR0cDovL1wiKSBvciBzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcImh0dHBzOi8vXCIpKScsXG4gICAgICB4cGF0aF9pc19pbnRlcm5hbCAgICAgID0gJ3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmwoKSArICcsJyArIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSArICcpIG9yICcgKyB4cGF0aF9lbmRzX3dpdGgoeHBhdGhfdXJsX2RvbWFpbigpLCB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkpLFxuICAgICAgeHBhdGhfaXNfbG9jYWwgICAgICAgICA9ICcoJyArIHhwYXRoX2hhc19wcm90b2NhbCArICcgYW5kIHN0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmwoKSArICcsJyArIHhwYXRoX3VybCh4cGF0aF9uc191cmkpICsgJykpJyxcbiAgICAgIHhwYXRoX2lzX3BhdGggICAgICAgICAgPSAnc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCIvXCIpJyxcbiAgICAgIHhwYXRoX2lzX2xvY2FsX3BhdGggICAgPSAnc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9wYXRoKCkgKyAnLCcgKyB4cGF0aF9uc19wYXRoICsgJyknLFxuICAgICAgeHBhdGhfbm9ybWFsaXplX3NwYWNlICA9ICdub3JtYWxpemUtc3BhY2UoKScsXG4gICAgICB4cGF0aF9pbnRlcm5hbCAgICAgICAgID0gJ1tub3QoJyArIHhwYXRoX2hhc19wcm90b2NhbCArICcpIG9yICcgKyB4cGF0aF9pc19pbnRlcm5hbCArICddJyxcbiAgICAgIHhwYXRoX2V4dGVybmFsICAgICAgICAgPSAnWycgKyB4cGF0aF9oYXNfcHJvdG9jYWwgKyAnIGFuZCBub3QoJyArIHhwYXRoX2lzX2ludGVybmFsICsgJyldJyxcbiAgICAgIGVzY2FwZV9saXRlcmFsICAgICAgICAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDMwKSxcbiAgICAgIGVzY2FwZV9wYXJlbnMgICAgICAgICAgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDMxKSxcbiAgICAgIHJlZ2V4X3N0cmluZ19saXRlcmFsICAgPSAvKFwiW15cIlxceDFFXSpcInwnW14nXFx4MUVdKid8PVxccypbXlxcc1xcXVxcJ1xcXCJdKykvZyxcbiAgICAgIHJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCAgPSAvWydcIl0/KFxceDFFKylbJ1wiXT8vZyxcbiAgICAgIHJlZ2V4X2Nzc193cmFwX3BzZXVkbyAgPSAvKFxceDFGXFwpfFteXFwpXSlcXDooZmlyc3R8bGltaXR8bGFzdHxndHxsdHxlcXxudGgpKFteXFwtXXwkKS8sXG4gICAgICByZWdleF9zcGVjYWxfY2hhcnMgICAgID0gL1tcXHgxQy1cXHgxRl0rL2csXG4gICAgICByZWdleF9maXJzdF9heGlzICAgICAgID0gL14oW1xcc1xcKFxceDFGXSopKFxcLj9bXlxcLlxcL1xcKF17MSwyfVthLXpdKjoqKS8sXG4gICAgICByZWdleF9maWx0ZXJfcHJlZml4ICAgID0gLyhefFxcL3xcXDopXFxbL2csXG4gICAgICByZWdleF9hdHRyX3ByZWZpeCAgICAgID0gLyhbXlxcKFxcW1xcL1xcfFxcc1xceDFGXSlcXEAvZyxcbiAgICAgIHJlZ2V4X250aF9lcXVhdGlvbiAgICAgPSAvXihbLTAtOV0qKW4uKj8oWzAtOV0qKSQvLFxuICAgICAgY3NzX2NvbWJpbmF0b3JzX3JlZ2V4ICA9IC9cXHMqKCE/Wys+fixeIF0pXFxzKihcXC4/XFwvK3xbYS16XFwtXSs6Oik/KFthLXpcXC1dK1xcKCk/KChhbmRcXHMqfG9yXFxzKnxtb2RcXHMqKT9bXis+fixcXHMnXCJcXF1cXHxcXF5cXCRcXCFcXDxcXD1cXHgxQy1cXHgxRl0rKT8vZyxcbiAgICAgIGNzc19jb21iaW5hdG9yc19jYWxsYmFjayA9IGZ1bmN0aW9uIChtYXRjaCwgb3BlcmF0b3IsIGF4aXMsIGZ1bmMsIGxpdGVyYWwsIGV4Y2x1ZGUsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgcHJlZml4ID0gJyc7IC8vIElmIHdlIGNhbiwgd2UnbGwgcHJlZml4IGEgJy4nXG5cbiAgICAgICAgLy8gWFBhdGggb3BlcmF0b3JzIGNhbiBsb29rIGxpa2Ugbm9kZS1uYW1lIHNlbGVjdG9yc1xuICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgZm9yIFwiIGFuZFwiLCBcIiBvclwiLCBcIiBtb2RcIlxuICAgICAgICBpZiAob3BlcmF0b3IgPT09ICcgJyAmJiBleGNsdWRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXhpcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgLy8gT25seSBhbGxvdyBub2RlLXNlbGVjdGluZyBYUGF0aCBmdW5jdGlvbnNcbiAgICAgICAgICAvLyBEZXRlY3QgZmFsc2UgcG9zaXRpdmUgZm9yIFwiICsgY291bnQoLi4uKVwiLCBcIiBjb3VudCguLi4pXCIsIFwiID4gcG9zaXRpb24oKVwiLCBldGMuXG4gICAgICAgICAgaWYgKGZ1bmMgIT09IHVuZGVmaW5lZCAmJiAoZnVuYyAhPT0gJ25vZGUoJyAmJiBmdW5jICE9PSAndGV4dCgnICYmIGZ1bmMgIT09ICdjb21tZW50KCcpKSAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChsaXRlcmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxpdGVyYWwgPSBmdW5jO1xuICAgICAgICAgIH0gLy8gSGFuZGxlIGNhc2UgXCIgKyB0ZXh0KClcIiwgXCIgPiBjb21tZW50KClcIiwgZXRjLiB3aGVyZSBcImZ1bmNcIiBpcyBvdXIgXCJsaXRlcmFsXCJcblxuICAgICAgICAgICAgLy8gWFBhdGggbWF0aCBvcGVyYXRvcnMgbWF0Y2ggc29tZSBDU1MgY29tYmluYXRvcnNcbiAgICAgICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgKyAxXCIsIFwiID4gMVwiLCBldGMuXG4gICAgICAgICAgaWYgKGlzTnVtZXJpYyhsaXRlcmFsKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBwcmV2Q2hhciA9IG9yaWcuY2hhckF0KG9mZnNldCAtIDEpO1xuXG4gICAgICAgICAgaWYgKHByZXZDaGFyLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnKCcgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJ3wnIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICc6Jykge1xuICAgICAgICAgICAgcHJlZml4ID0gJy4nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBpZiB3ZSBkb24ndCBoYXZlIGEgc2VsZWN0b3IgdG8gZm9sbG93IHRoZSBheGlzXG4gICAgICAgIGlmIChsaXRlcmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob2Zmc2V0ICsgbWF0Y2gubGVuZ3RoID09PSBvcmlnLmxlbmd0aCkge1xuICAgICAgICAgICAgbGl0ZXJhbCA9ICcqJztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpdGNoIChvcGVyYXRvcikge1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICByZXR1cm4gJy8vJyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgIHJldHVybiAnLycgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgJy9mb2xsb3dpbmctc2libGluZzo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnfic6XG4gICAgICAgICAgcmV0dXJuIHByZWZpeCArICcvZm9sbG93aW5nLXNpYmxpbmc6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgICBpZiAoYXhpcyA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICB9XG4gICAgICAgICAgYXhpcyA9ICcuLy8nO1xuICAgICAgICAgIHJldHVybiAnfCcgKyBheGlzICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnXic6IC8vIGZpcnN0IGNoaWxkXG4gICAgICAgICAgcmV0dXJuICcvY2hpbGQ6OipbMV0vc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyFeJzogLy8gbGFzdCBjaGlsZFxuICAgICAgICAgIHJldHVybiAnL2NoaWxkOjoqW2xhc3QoKV0vc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyEgJzogLy8gYW5jZXN0b3Itb3Itc2VsZlxuICAgICAgICAgIHJldHVybiAnL2FuY2VzdG9yLW9yLXNlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchPic6IC8vIGRpcmVjdCBwYXJlbnRcbiAgICAgICAgICByZXR1cm4gJy9wYXJlbnQ6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICchKyc6IC8vIGFkamFjZW50IHByZWNlZGluZyBzaWJsaW5nXG4gICAgICAgICAgcmV0dXJuICcvcHJlY2VkaW5nLXNpYmxpbmc6OipbMV0vc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyF+JzogLy8gcHJlY2VkaW5nIHNpYmxpbmdcbiAgICAgICAgICByZXR1cm4gJy9wcmVjZWRpbmctc2libGluZzo6JyArIGxpdGVyYWw7XG4gICAgICAgICAgICAvLyBjYXNlICd+fidcbiAgICAgICAgICAgIC8vIHJldHVybiAnL2ZvbGxvd2luZy1zaWJsaW5nOjoqL3NlbGY6OnwnK3NlbGVjdG9yU3RhcnQob3JpZywgb2Zmc2V0KSsnL3ByZWNlZGluZy1zaWJsaW5nOjoqL3NlbGY6OicrbGl0ZXJhbDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX2F0dHJpYnV0ZXNfcmVnZXggPSAvXFxbKFteXFxdXFxAXFx8XFwqXFw9XFxeXFx+XFwkXFwhXFwoXFwvXFxzXFx4MUMtXFx4MUZdKylcXHMqKChbXFx8XFwqXFx+XFxeXFwkXFwhXT8pPT9cXHMqKFxceDFFKykpP1xcXS9nLFxuICAgICAgY3NzX2F0dHJpYnV0ZXNfY2FsbGJhY2sgPSBmdW5jdGlvbiAoc3RyLCBhdHRyLCBjb21wLCBvcCwgdmFsLCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgdmFyIGF4aXMgPSAnJztcbiAgICAgICAgdmFyIHByZXZDaGFyID0gb3JpZy5jaGFyQXQob2Zmc2V0IC0gMSk7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKHByZXZDaGFyID09PSAnLycgfHwgLy8gZm91bmQgYWZ0ZXIgYW4gYXhpcyBzaG9ydGN1dCAoXCIvXCIsIFwiLy9cIiwgZXRjLilcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnOicpICAgLy8gZm91bmQgYWZ0ZXIgYW4gYXhpcyAoXCJzZWxmOjpcIiwgXCJwYXJlbnQ6OlwiLCBldGMuKVxuICAgICAgICAgICAgYXhpcyA9ICcqJzsqL1xuXG4gICAgICAgIHN3aXRjaCAob3ApIHtcbiAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW25vdChAJyArIGF0dHIgKyAnKSBvciBAJyArIGF0dHIgKyAnIT1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgY2FzZSAnJCc6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW3N1YnN0cmluZyhAJyArIGF0dHIgKyAnLHN0cmluZy1sZW5ndGgoQCcgKyBhdHRyICsgJyktKHN0cmluZy1sZW5ndGgoXCInICsgdmFsICsgJ1wiKS0xKSk9XCInICsgdmFsICsgJ1wiXSc7XG4gICAgICAgIGNhc2UgJ14nOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tzdGFydHMtd2l0aChAJyArIGF0dHIgKyAnLFwiJyArIHZhbCArICdcIildJztcbiAgICAgICAgY2FzZSAnfic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW2NvbnRhaW5zKGNvbmNhdChcIiBcIixub3JtYWxpemUtc3BhY2UoQCcgKyBhdHRyICsgJyksXCIgXCIpLGNvbmNhdChcIiBcIixcIicgKyB2YWwgKyAnXCIsXCIgXCIpKV0nO1xuICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbY29udGFpbnMoQCcgKyBhdHRyICsgJyxcIicgKyB2YWwgKyAnXCIpXSc7XG4gICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnPVwiJyArIHZhbCArICdcIiBvciBzdGFydHMtd2l0aChAJyArIGF0dHIgKyAnLGNvbmNhdChcIicgKyB2YWwgKyAnXCIsXCItXCIpKV0nO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmIChjb21wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChhdHRyLmNoYXJBdChhdHRyLmxlbmd0aCAtIDEpID09PSAnKCcgfHwgYXR0ci5zZWFyY2goL15bMC05XSskLykgIT09IC0xIHx8IGF0dHIuaW5kZXhPZignOicpICE9PSAtMSkgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXhpcyArICdbQCcgKyBhdHRyICsgJ10nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXhpcyArICdbQCcgKyBhdHRyICsgJz1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCA9IC86KFthLXpcXC1dKykoXFwoKFxceDFGKykoKFteXFx4MUZdKyhcXDNcXHgxRispPykqKShcXDNcXCkpKT8vZyxcbiAgICAgIGNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChtYXRjaCwgbmFtZSwgZzEsIGcyLCBhcmcsIGczLCBnNCwgZzUsIG9mZnNldCwgb3JpZykge1xuICAgICAgICBpZiAob3JpZy5jaGFyQXQob2Zmc2V0IC0gMSkgPT09ICc6JyAmJiBvcmlnLmNoYXJBdChvZmZzZXQgLSAyKSAhPT0gJzonKSB7XG4gICAgICAgICAgICAvLyBYUGF0aCBcImF4aXM6Om5vZGUtbmFtZVwiIHdpbGwgbWF0Y2hcbiAgICAgICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBcIjpub2RlLW5hbWVcIlxuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuYW1lID09PSAnb2RkJyB8fCBuYW1lID09PSAnZXZlbicpIHtcbiAgICAgICAgICBhcmcgID0gbmFtZTtcbiAgICAgICAgICBuYW1lID0gJ250aC1vZi10eXBlJztcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAobmFtZSkgeyAvLyBuYW1lLnRvTG93ZXJDYXNlKCk/XG4gICAgICAgIGNhc2UgJ2FmdGVyJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdwcmVjZWRpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2FmdGVyLXNpYmxpbmcnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3ByZWNlZGluZy1zaWJsaW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ2ZvbGxvd2luZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYmVmb3JlLXNpYmxpbmcnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ2ZvbGxvd2luZy1zaWJsaW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdjaGVja2VkJzpcbiAgICAgICAgICByZXR1cm4gJ1tAc2VsZWN0ZWQgb3IgQGNoZWNrZWRdJztcbiAgICAgICAgY2FzZSAnY29udGFpbnMnOlxuICAgICAgICAgIHJldHVybiAnW2NvbnRhaW5zKCcgKyB4cGF0aF9ub3JtYWxpemVfc3BhY2UgKyAnLCcgKyBhcmcgKyAnKV0nO1xuICAgICAgICBjYXNlICdpY29udGFpbnMnOlxuICAgICAgICAgIHJldHVybiAnW2NvbnRhaW5zKCcgKyB4cGF0aF9sb3dlcl9jYXNlICsgJywnICsgeHBhdGhfdG9fbG93ZXIoYXJnKSArICcpXSc7XG4gICAgICAgIGNhc2UgJ2VtcHR5JzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QoKikgYW5kIG5vdChub3JtYWxpemUtc3BhY2UoKSldJztcbiAgICAgICAgY2FzZSAnZW5hYmxlZCc6XG4gICAgICAgIGNhc2UgJ2Rpc2FibGVkJzpcbiAgICAgICAgICByZXR1cm4gJ1tAJyArIG5hbWUgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2ZpcnN0LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ2ZpcnN0JzpcbiAgICAgICAgY2FzZSAnbGltaXQnOlxuICAgICAgICBjYXNlICdmaXJzdC1vZi10eXBlJzpcbiAgICAgICAgICBpZiAoYXJnICE9PSB1bmRlZmluZWQpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPD0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1sxXSc7XG4gICAgICAgIGNhc2UgJ2d0JzpcbiAgICAgICAgICAgICAgICAvLyBQb3NpdGlvbiBzdGFydHMgYXQgMCBmb3IgY29uc2lzdGVuY3kgd2l0aCBTaXp6bGUgc2VsZWN0b3JzXG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT4nICsgKHBhcnNlSW50KGFyZywgMTApICsgMSkgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2x0JzpcbiAgICAgICAgICAgICAgICAvLyBQb3NpdGlvbiBzdGFydHMgYXQgMCBmb3IgY29uc2lzdGVuY3kgd2l0aCBTaXp6bGUgc2VsZWN0b3JzXG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKTwnICsgKHBhcnNlSW50KGFyZywgMTApICsgMSkgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2xhc3QtY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChmb2xsb3dpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnb25seS1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqKSBhbmQgbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdvbmx5LW9mLXR5cGUnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KltuYW1lKCk9bmFtZShzZWxmOjpub2RlKCkpXSkgYW5kIG5vdChmb2xsb3dpbmctc2libGluZzo6KltuYW1lKCk9bmFtZShzZWxmOjpub2RlKCkpXSldJztcbiAgICAgICAgY2FzZSAnbnRoLWNoaWxkJzpcbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGFyZykpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpID0gJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgc3dpdGNoIChhcmcpIHtcbiAgICAgICAgICBjYXNlICdldmVuJzpcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgbW9kIDI9MF0nO1xuICAgICAgICAgIGNhc2UgJ29kZCc6XG4gICAgICAgICAgICByZXR1cm4gJ1soY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpIG1vZCAyPTFdJztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIGEgPSAoYXJnIHx8ICcwJykucmVwbGFjZShyZWdleF9udGhfZXF1YXRpb24sICckMSskMicpLnNwbGl0KCcrJyk7XG5cbiAgICAgICAgICAgIGFbMF0gPSBhWzBdIHx8ICcxJztcbiAgICAgICAgICAgIGFbMV0gPSBhWzFdIHx8ICcwJztcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSk+PScgKyBhWzFdICsgJyBhbmQgKChjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSktJyArIGFbMV0gKyAnKSBtb2QgJyArIGFbMF0gKyAnPTBdJztcbiAgICAgICAgICB9XG4gICAgICAgIGNhc2UgJ250aC1vZi10eXBlJzpcbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGFyZykpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKGFyZykge1xuICAgICAgICAgIGNhc2UgJ29kZCc6XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpIG1vZCAyPTFdJztcbiAgICAgICAgICBjYXNlICdldmVuJzpcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCkgbW9kIDI9MCBhbmQgcG9zaXRpb24oKT49MF0nO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgYSA9IChhcmcgfHwgJzAnKS5yZXBsYWNlKHJlZ2V4X250aF9lcXVhdGlvbiwgJyQxKyQyJykuc3BsaXQoJysnKTtcblxuICAgICAgICAgICAgYVswXSA9IGFbMF0gfHwgJzEnO1xuICAgICAgICAgICAgYVsxXSA9IGFbMV0gfHwgJzAnO1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT49JyArIGFbMV0gKyAnIGFuZCAocG9zaXRpb24oKS0nICsgYVsxXSArICcpIG1vZCAnICsgYVswXSArICc9MF0nO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnZXEnOlxuICAgICAgICBjYXNlICdudGgnOlxuICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGFyZykpIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gJ1sxXSc7XG4gICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgIHJldHVybiAnW0B0eXBlPVwidGV4dFwiXSc7XG4gICAgICAgIGNhc2UgJ2lzdGFydHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX2xvd2VyX2Nhc2UgKyAnLCcgKyB4cGF0aF90b19sb3dlcihhcmcpICsgJyldJztcbiAgICAgICAgY2FzZSAnc3RhcnRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF9ub3JtYWxpemVfc3BhY2UgKyAnLCcgKyBhcmcgKyAnKV0nO1xuICAgICAgICBjYXNlICdpZW5kcy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1snICsgeHBhdGhfZW5kc193aXRoKHhwYXRoX2xvd2VyX2Nhc2UsIHhwYXRoX3RvX2xvd2VyKGFyZykpICsgJ10nO1xuICAgICAgICBjYXNlICdlbmRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnWycgKyB4cGF0aF9lbmRzX3dpdGgoeHBhdGhfbm9ybWFsaXplX3NwYWNlLCBhcmcpICsgJ10nO1xuICAgICAgICBjYXNlICdoYXMnOlxuICAgICAgICAgIHZhciB4cGF0aCA9IHByZXBlbmRBeGlzKGNzczJ4cGF0aChhcmcsIHRydWUpLCAnLi8vJyk7XG5cbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgeHBhdGggKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLXNpYmxpbmcnOlxuICAgICAgICAgIHZhciB4cGF0aCA9IGNzczJ4cGF0aCgncHJlY2VkaW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpO1xuXG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIHhwYXRoICsgJykgPiAwIG9yIGNvdW50KGZvbGxvd2luZy1zaWJsaW5nOjonICsgeHBhdGguc3Vic3RyKDE5KSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtcGFyZW50JzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdwYXJlbnQ6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1hbmNlc3Rvcic6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnYW5jZXN0b3I6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2xhc3QnOlxuICAgICAgICBjYXNlICdsYXN0LW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+bGFzdCgpLScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnW2xhc3QoKV0nO1xuICAgICAgICBjYXNlICdzZWxlY3RlZCc6IC8vIFNpenpsZTogXCIob3B0aW9uKSBlbGVtZW50cyB0aGF0IGFyZSBjdXJyZW50bHkgc2VsZWN0ZWRcIlxuICAgICAgICAgIHJldHVybiAnW2xvY2FsLW5hbWUoKT1cIm9wdGlvblwiIGFuZCBAc2VsZWN0ZWRdJztcbiAgICAgICAgY2FzZSAnc2tpcCc6XG4gICAgICAgIGNhc2UgJ3NraXAtZmlyc3QnOlxuICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk+JyArIGFyZyArICddJztcbiAgICAgICAgY2FzZSAnc2tpcC1sYXN0JzpcbiAgICAgICAgICBpZiAoYXJnICE9PSB1bmRlZmluZWQpICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJ1tsYXN0KCktcG9zaXRpb24oKT49JyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKTxsYXN0KCldJztcbiAgICAgICAgY2FzZSAncm9vdCc6XG4gICAgICAgICAgcmV0dXJuICcvYW5jZXN0b3I6OltsYXN0KCldJztcbiAgICAgICAgY2FzZSAncmFuZ2UnOlxuICAgICAgICAgIHZhciBhcnIgPSBhcmcuc3BsaXQoJywnKTtcblxuICAgICAgICAgIHJldHVybiAnWycgKyBhcnJbMF0gKyAnPD1wb3NpdGlvbigpIGFuZCBwb3NpdGlvbigpPD0nICsgYXJyWzFdICsgJ10nO1xuICAgICAgICBjYXNlICdpbnB1dCc6IC8vIFNpenpsZTogXCJpbnB1dCwgYnV0dG9uLCBzZWxlY3QsIGFuZCB0ZXh0YXJlYSBhcmUgYWxsIGNvbnNpZGVyZWQgdG8gYmUgaW5wdXQgZWxlbWVudHMuXCJcbiAgICAgICAgICByZXR1cm4gJ1tsb2NhbC1uYW1lKCk9XCJpbnB1dFwiIG9yIGxvY2FsLW5hbWUoKT1cImJ1dHRvblwiIG9yIGxvY2FsLW5hbWUoKT1cInNlbGVjdFwiIG9yIGxvY2FsLW5hbWUoKT1cInRleHRhcmVhXCJdJztcbiAgICAgICAgY2FzZSAnaW50ZXJuYWwnOlxuICAgICAgICAgIHJldHVybiB4cGF0aF9pbnRlcm5hbDtcbiAgICAgICAgY2FzZSAnZXh0ZXJuYWwnOlxuICAgICAgICAgIHJldHVybiB4cGF0aF9leHRlcm5hbDtcbiAgICAgICAgY2FzZSAnaHR0cCc6XG4gICAgICAgIGNhc2UgJ2h0dHBzJzpcbiAgICAgICAgY2FzZSAnbWFpbHRvJzpcbiAgICAgICAgY2FzZSAnamF2YXNjcmlwdCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoQGhyZWYsY29uY2F0KFwiJyArIG5hbWUgKyAnXCIsXCI6XCIpKV0nO1xuICAgICAgICBjYXNlICdkb21haW4nOlxuICAgICAgICAgIHJldHVybiAnWyhzdHJpbmctbGVuZ3RoKCcgKyB4cGF0aF91cmxfZG9tYWluKCkgKyAnKT0wIGFuZCBjb250YWlucygnICsgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpICsgJywnICsgYXJnICsgJykpIG9yIGNvbnRhaW5zKCcgKyB4cGF0aF91cmxfZG9tYWluKCkgKyAnLCcgKyBhcmcgKyAnKV0nO1xuICAgICAgICBjYXNlICdwYXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX3BhdGgoKSArICcsc3Vic3RyaW5nLWFmdGVyKFwiJyArIGFyZyArICdcIixcIi9cIikpXSdcbiAgICAgICAgY2FzZSAnbm90JzpcbiAgICAgICAgICB2YXIgeHBhdGggPSBjc3MyeHBhdGgoYXJnLCB0cnVlKTtcblxuICAgICAgICAgIGlmICh4cGF0aC5jaGFyQXQoMCkgPT09ICdbJykgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHhwYXRoID0gJ3NlbGY6Om5vZGUoKScgKyB4cGF0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbbm90KCcgKyB4cGF0aCArICcpXSc7XG4gICAgICAgIGNhc2UgJ3RhcmdldCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoQGhyZWYsIFwiI1wiKV0nO1xuICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICByZXR1cm4gJ2FuY2VzdG9yLW9yLXNlbGY6OipbbGFzdCgpXSc7XG4gICAgICAgICAgICAvKiBjYXNlICdhY3RpdmUnOlxuICAgICAgICAgICAgY2FzZSAnZm9jdXMnOlxuICAgICAgICAgICAgY2FzZSAnaG92ZXInOlxuICAgICAgICAgICAgY2FzZSAnbGluayc6XG4gICAgICAgICAgICBjYXNlICd2aXNpdGVkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7Ki9cbiAgICAgICAgY2FzZSAnbGFuZyc6XG4gICAgICAgICAgcmV0dXJuICdbQGxhbmc9XCInICsgYXJnICsgJ1wiXSc7XG4gICAgICAgIGNhc2UgJ3JlYWQtb25seSc6XG4gICAgICAgIGNhc2UgJ3JlYWQtd3JpdGUnOlxuICAgICAgICAgIHJldHVybiAnW0AnICsgbmFtZS5yZXBsYWNlKCctJywgJycpICsgJ10nO1xuICAgICAgICBjYXNlICd2YWxpZCc6XG4gICAgICAgIGNhc2UgJ3JlcXVpcmVkJzpcbiAgICAgICAgY2FzZSAnaW4tcmFuZ2UnOlxuICAgICAgICBjYXNlICdvdXQtb2YtcmFuZ2UnOlxuICAgICAgICAgIHJldHVybiAnW0AnICsgbmFtZSArICddJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIGNzc19pZHNfY2xhc3Nlc19yZWdleCA9IC8oI3xcXC4pKFteXFwjXFxAXFwuXFwvXFwoXFxbXFwpXFxdXFx8XFw6XFxzXFwrXFw+XFw8XFwnXFxcIlxceDFELVxceDFGXSspL2csXG4gICAgICBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2sgPSBmdW5jdGlvbiAoc3RyLCBvcCwgdmFsLCBvZmZzZXQsIG9yaWcpIHtcbiAgICAgICAgdmFyIGF4aXMgPSAnJztcbiAgICAgICAgLyogdmFyIHByZXZDaGFyID0gb3JpZy5jaGFyQXQob2Zmc2V0LTEpO1xuICAgICAgICBpZiAocHJldkNoYXIubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICBwcmV2Q2hhciA9PT0gJy8nIHx8XG4gICAgICAgICAgICBwcmV2Q2hhciA9PT0gJygnKVxuICAgICAgICAgICAgYXhpcyA9ICcqJztcbiAgICAgICAgZWxzZSBpZiAocHJldkNoYXIgPT09ICc6JylcbiAgICAgICAgICAgIGF4aXMgPSAnbm9kZSgpJzsqL1xuICAgICAgICBpZiAob3AgPT09ICcjJykgICAgICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0BpZD1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXhpcyArICdbY29udGFpbnMoY29uY2F0KFwiIFwiLG5vcm1hbGl6ZS1zcGFjZShAY2xhc3MpLFwiIFwiKSxcIiAnICsgdmFsICsgJyBcIildJztcbiAgICAgIH07XG5cbiAgICAvLyBQcmVwZW5kIGRlc2NlbmRhbnQtb3Itc2VsZiBpZiBubyBvdGhlciBheGlzIGlzIHNwZWNpZmllZFxuICBmdW5jdGlvbiBwcmVwZW5kQXhpcyhzLCBheGlzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZShyZWdleF9maXJzdF9heGlzLCBmdW5jdGlvbiAobWF0Y2gsIHN0YXJ0LCBsaXRlcmFsKSB7XG4gICAgICBpZiAobGl0ZXJhbC5zdWJzdHIobGl0ZXJhbC5sZW5ndGggLSAyKSA9PT0gJzo6JykgLy8gQWxyZWFkeSBoYXMgYXhpczo6XG4gICAgICAgICAgICB7XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgIH1cblxuICAgICAgaWYgKGxpdGVyYWwuY2hhckF0KDApID09PSAnWycpICAgICAgICAgICAge1xuICAgICAgICBheGlzICs9ICcqJztcbiAgICAgIH1cbiAgICAgICAgLy8gZWxzZSBpZiAoYXhpcy5jaGFyQXQoYXhpcy5sZW5ndGgtMSkgPT09ICcpJylcbiAgICAgICAgLy8gICAgYXhpcyArPSAnLyc7XG4gICAgICByZXR1cm4gc3RhcnQgKyBheGlzICsgbGl0ZXJhbDtcbiAgICB9KTtcbiAgfVxuXG4gICAgLy8gRmluZCB0aGUgYmVnaW5pbmcgb2YgdGhlIHNlbGVjdG9yLCBzdGFydGluZyBhdCBpIGFuZCB3b3JraW5nIGJhY2t3YXJkc1xuICBmdW5jdGlvbiBzZWxlY3RvclN0YXJ0KHMsIGkpIHtcbiAgICB2YXIgZGVwdGggPSAwO1xuICAgIHZhciBvZmZzZXQgPSAwO1xuXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgc3dpdGNoIChzLmNoYXJBdChpKSkge1xuICAgICAgY2FzZSAnICc6XG4gICAgICBjYXNlIGVzY2FwZV9wYXJlbnM6XG4gICAgICAgIG9mZnNldCsrO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1snOlxuICAgICAgY2FzZSAnKCc6XG4gICAgICAgIGRlcHRoLS07XG5cbiAgICAgICAgaWYgKGRlcHRoIDwgMCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gKytpICsgb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnXSc6XG4gICAgICBjYXNlICcpJzpcbiAgICAgICAgZGVwdGgrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICcsJzpcbiAgICAgIGNhc2UgJ3wnOlxuICAgICAgICBpZiAoZGVwdGggPT09IDApICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuICsraSArIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgb2Zmc2V0ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgc3RyaW5nIGlzIG51bWVyaWNcbiAgZnVuY3Rpb24gaXNOdW1lcmljKHMpIHtcbiAgICB2YXIgbnVtID0gcGFyc2VJbnQocywgMTApO1xuXG4gICAgcmV0dXJuICghaXNOYU4obnVtKSAmJiAnJyArIG51bSA9PT0gcyk7XG4gIH1cblxuICAgIC8vIEFwcGVuZCBlc2NhcGUgXCJjaGFyXCIgdG8gXCJvcGVuXCIgb3IgXCJjbG9zZVwiXG4gIGZ1bmN0aW9uIGVzY2FwZUNoYXIocywgb3BlbiwgY2xvc2UsIGNoYXIpIHtcbiAgICB2YXIgZGVwdGggPSAwO1xuXG4gICAgcmV0dXJuIHMucmVwbGFjZShuZXcgUmVnRXhwKCdbXFxcXCcgKyBvcGVuICsgJ1xcXFwnICsgY2xvc2UgKyAnXScsICdnJyksIGZ1bmN0aW9uIChhKSB7XG4gICAgICBpZiAoYSA9PT0gb3BlbikgICAgICAgICAgICB7XG4gICAgICAgIGRlcHRoKys7XG4gICAgICB9XG5cbiAgICAgIGlmIChhID09PSBvcGVuKSB7XG4gICAgICAgIHJldHVybiBhICsgcmVwZWF0KGNoYXIsIGRlcHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXBlYXQoY2hhciwgZGVwdGgtLSkgKyBhO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZXBlYXQoc3RyLCBudW0pIHtcbiAgICBudW0gPSBOdW1iZXIobnVtKTtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKG51bSAmIDEpICAgICAgICAgICAge1xuICAgICAgICByZXN1bHQgKz0gc3RyO1xuICAgICAgfVxuICAgICAgbnVtID4+Pj0gMTtcblxuICAgICAgaWYgKG51bSA8PSAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgc3RyICs9IHN0cjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY29udmVydEVzY2FwaW5nICh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5yZXBsYWNlKC9cXFxcKFtgXFxcXC86XFw/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0pL2csICckMScpXG4gICAgICAucmVwbGFjZSgvXFxcXChbJ1wiXSkvZywgJyQxJDEnKVxuICAgICAgLnJlcGxhY2UoL1xcXFxBIC9nLCAnXFxuJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGNzczJ4cGF0aChzLCBuZXN0ZWQpIHtcbiAgICAvLyBzID0gcy50cmltKCk7XG5cbiAgICBpZiAobmVzdGVkID09PSB0cnVlKSB7XG4gICAgICAgIC8vIFJlcGxhY2UgOnBzZXVkby1jbGFzc2VzXG4gICAgICBzID0gcy5yZXBsYWNlKGNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCwgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgICAgICAvLyBSZXBsYWNlICNpZHMgYW5kIC5jbGFzc2VzXG4gICAgICBzID0gcy5yZXBsYWNlKGNzc19pZHNfY2xhc3Nlc19yZWdleCwgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuXG4gICAgLy8gVGFnIG9wZW4gYW5kIGNsb3NlIHBhcmVudGhlc2lzIHBhaXJzIChmb3IgUmVnRXhwIHNlYXJjaGVzKVxuICAgIHMgPSBlc2NhcGVDaGFyKHMsICcoJywgJyknLCBlc2NhcGVfcGFyZW5zKTtcblxuICAgIC8vIFJlbW92ZSBhbmQgc2F2ZSBhbnkgc3RyaW5nIGxpdGVyYWxzXG4gICAgdmFyIGxpdGVyYWxzID0gW107XG5cbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X3N0cmluZ19saXRlcmFsLCBmdW5jdGlvbiAocywgYSkge1xuICAgICAgaWYgKGEuY2hhckF0KDApID09PSAnPScpIHtcbiAgICAgICAgYSA9IGEuc3Vic3RyKDEpLnRyaW0oKTtcblxuICAgICAgICBpZiAoaXNOdW1lcmljKGEpKSAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEgPSBhLnN1YnN0cigxLCBhLmxlbmd0aCAtIDIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVwZWF0KGVzY2FwZV9saXRlcmFsLCBsaXRlcmFscy5wdXNoKGNvbnZlcnRFc2NhcGluZyhhKSkpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVwbGFjZSBDU1MgY29tYmluYXRvcnMgKFwiIFwiLCBcIitcIiwgXCI+XCIsIFwiflwiLCBcIixcIikgYW5kIHJldmVyc2UgY29tYmluYXRvcnMgKFwiIVwiLCBcIiErXCIsIFwiIT5cIiwgXCIhflwiKVxuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2NvbWJpbmF0b3JzX3JlZ2V4LCBjc3NfY29tYmluYXRvcnNfY2FsbGJhY2spO1xuXG4gICAgLy8gUmVwbGFjZSBDU1MgYXR0cmlidXRlIGZpbHRlcnNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19hdHRyaWJ1dGVzX3JlZ2V4LCBjc3NfYXR0cmlidXRlc19jYWxsYmFjayk7XG5cbiAgICAvLyBXcmFwIGNlcnRhaW4gOnBzZXVkby1jbGFzc2VzIGluIHBhcmVucyAodG8gY29sbGVjdCBub2RlLXNldHMpXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBpbmRleCA9IHMuc2VhcmNoKHJlZ2V4X2Nzc193cmFwX3BzZXVkbyk7XG5cbiAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpbmRleCA9IHMuaW5kZXhPZignOicsIGluZGV4KTtcbiAgICAgIHZhciBzdGFydCA9IHNlbGVjdG9yU3RhcnQocywgaW5kZXgpO1xuXG4gICAgICBzID0gcy5zdWJzdHIoMCwgc3RhcnQpICtcbiAgICAgICAgICAgICcoJyArIHMuc3Vic3RyaW5nKHN0YXJ0LCBpbmRleCkgKyAnKScgK1xuICAgICAgICAgICAgcy5zdWJzdHIoaW5kZXgpO1xuICAgIH1cblxuICAgIC8vIFJlcGxhY2UgOnBzZXVkby1jbGFzc2VzXG4gICAgcyA9IHMucmVwbGFjZShjc3NfcHNldWRvX2NsYXNzZXNfcmVnZXgsIGNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAvLyBSZXBsYWNlICNpZHMgYW5kIC5jbGFzc2VzXG4gICAgcyA9IHMucmVwbGFjZShjc3NfaWRzX2NsYXNzZXNfcmVnZXgsIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayk7XG5cbiAgICAvLyBSZXN0b3JlIHRoZSBzYXZlZCBzdHJpbmcgbGl0ZXJhbHNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCwgZnVuY3Rpb24gKHMsIGEpIHtcbiAgICAgIHZhciBzdHIgPSBsaXRlcmFsc1thLmxlbmd0aCAtIDFdO1xuXG4gICAgICByZXR1cm4gJ1wiJyArIHN0ciArICdcIic7XG4gICAgfSlcblxuICAgIC8vIFJlbW92ZSBhbnkgc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9zcGVjYWxfY2hhcnMsICcnKTtcblxuICAgIC8vIGFkZCAqIHRvIHN0YW5kLWFsb25lIGZpbHRlcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X2ZpbHRlcl9wcmVmaXgsICckMSpbJyk7XG5cbiAgICAvLyBhZGQgXCIvXCIgYmV0d2VlbiBAYXR0cmlidXRlIHNlbGVjdG9yc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfYXR0cl9wcmVmaXgsICckMS9AJyk7XG5cbiAgICAvKlxuICAgIENvbWJpbmUgbXVsdGlwbGUgZmlsdGVycz9cblxuICAgIHMgPSBlc2NhcGVDaGFyKHMsICdbJywgJ10nLCBmaWx0ZXJfY2hhcik7XG4gICAgcyA9IHMucmVwbGFjZSgvKFxceDFEKylcXF1cXFtcXDEoLis/W15cXHgxRF0pXFwxXFxdL2csICcgYW5kICgkMikkMV0nKVxuICAgICovXG5cbiAgICBzID0gcHJlcGVuZEF4aXMocywgJy4vLycpOyAvLyBwcmVwZW5kIFwiLi8vXCIgYXhpcyB0byBiZWdpbmluZyBvZiBDU1Mgc2VsZWN0b3JcbiAgICByZXR1cm4gcztcbiAgfVxuXG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGNzczJ4cGF0aDtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cuY3NzMnhwYXRoID0gY3NzMnhwYXRoO1xuICB9XG5cbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2NzczJ4cGF0aC9pbmRleC5qcyIsIi8qIVxuICogU2l6emxlIENTUyBTZWxlY3RvciBFbmdpbmUgdjIuMy42XG4gKiBodHRwczovL3NpenpsZWpzLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vanMuZm91bmRhdGlvbi9cbiAqXG4gKiBEYXRlOiAyMDIxLTAyLTE2XG4gKi9cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcbnZhciBpLFxuXHRzdXBwb3J0LFxuXHRFeHByLFxuXHRnZXRUZXh0LFxuXHRpc1hNTCxcblx0dG9rZW5pemUsXG5cdGNvbXBpbGUsXG5cdHNlbGVjdCxcblx0b3V0ZXJtb3N0Q29udGV4dCxcblx0c29ydElucHV0LFxuXHRoYXNEdXBsaWNhdGUsXG5cblx0Ly8gTG9jYWwgZG9jdW1lbnQgdmFyc1xuXHRzZXREb2N1bWVudCxcblx0ZG9jdW1lbnQsXG5cdGRvY0VsZW0sXG5cdGRvY3VtZW50SXNIVE1MLFxuXHRyYnVnZ3lRU0EsXG5cdHJidWdneU1hdGNoZXMsXG5cdG1hdGNoZXMsXG5cdGNvbnRhaW5zLFxuXG5cdC8vIEluc3RhbmNlLXNwZWNpZmljIGRhdGFcblx0ZXhwYW5kbyA9IFwic2l6emxlXCIgKyAxICogbmV3IERhdGUoKSxcblx0cHJlZmVycmVkRG9jID0gd2luZG93LmRvY3VtZW50LFxuXHRkaXJydW5zID0gMCxcblx0ZG9uZSA9IDAsXG5cdGNsYXNzQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHR0b2tlbkNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0Y29tcGlsZXJDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRzb3J0T3JkZXIgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gMDtcblx0fSxcblxuXHQvLyBJbnN0YW5jZSBtZXRob2RzXG5cdGhhc093biA9ICgge30gKS5oYXNPd25Qcm9wZXJ0eSxcblx0YXJyID0gW10sXG5cdHBvcCA9IGFyci5wb3AsXG5cdHB1c2hOYXRpdmUgPSBhcnIucHVzaCxcblx0cHVzaCA9IGFyci5wdXNoLFxuXHRzbGljZSA9IGFyci5zbGljZSxcblxuXHQvLyBVc2UgYSBzdHJpcHBlZC1kb3duIGluZGV4T2YgYXMgaXQncyBmYXN0ZXIgdGhhbiBuYXRpdmVcblx0Ly8gaHR0cHM6Ly9qc3BlcmYuY29tL3Rob3ItaW5kZXhvZi12cy1mb3IvNVxuXHRpbmRleE9mID0gZnVuY3Rpb24oIGxpc3QsIGVsZW0gKSB7XG5cdFx0dmFyIGkgPSAwLFxuXHRcdFx0bGVuID0gbGlzdC5sZW5ndGg7XG5cdFx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRpZiAoIGxpc3RbIGkgXSA9PT0gZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fSxcblxuXHRib29sZWFucyA9IFwiY2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufFwiICtcblx0XHRcImlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWRcIixcblxuXHQvLyBSZWd1bGFyIGV4cHJlc3Npb25zXG5cblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1zZWxlY3RvcnMvI3doaXRlc3BhY2Vcblx0d2hpdGVzcGFjZSA9IFwiW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZl1cIixcblxuXHQvLyBodHRwczovL3d3dy53My5vcmcvVFIvY3NzLXN5bnRheC0zLyNpZGVudC10b2tlbi1kaWFncmFtXG5cdGlkZW50aWZpZXIgPSBcIig/OlxcXFxcXFxcW1xcXFxkYS1mQS1GXXsxLDZ9XCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIj98XFxcXFxcXFxbXlxcXFxyXFxcXG5cXFxcZl18W1xcXFx3LV18W15cXDAtXFxcXHg3Zl0pK1wiLFxuXG5cdC8vIEF0dHJpYnV0ZSBzZWxlY3RvcnM6IGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jYXR0cmlidXRlLXNlbGVjdG9yc1xuXHRhdHRyaWJ1dGVzID0gXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKihcIiArIGlkZW50aWZpZXIgKyBcIikoPzpcIiArIHdoaXRlc3BhY2UgK1xuXG5cdFx0Ly8gT3BlcmF0b3IgKGNhcHR1cmUgMilcblx0XHRcIiooWypeJHwhfl0/PSlcIiArIHdoaXRlc3BhY2UgK1xuXG5cdFx0Ly8gXCJBdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzIFtjYXB0dXJlIDVdXG5cdFx0Ly8gb3Igc3RyaW5ncyBbY2FwdHVyZSAzIG9yIGNhcHR1cmUgNF1cIlxuXHRcdFwiKig/OicoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcInwoXCIgKyBpZGVudGlmaWVyICsgXCIpKXwpXCIgK1xuXHRcdHdoaXRlc3BhY2UgKyBcIipcXFxcXVwiLFxuXG5cdHBzZXVkb3MgPSBcIjooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XFxcXCgoXCIgK1xuXG5cdFx0Ly8gVG8gcmVkdWNlIHRoZSBudW1iZXIgb2Ygc2VsZWN0b3JzIG5lZWRpbmcgdG9rZW5pemUgaW4gdGhlIHByZUZpbHRlciwgcHJlZmVyIGFyZ3VtZW50czpcblx0XHQvLyAxLiBxdW90ZWQgKGNhcHR1cmUgMzsgY2FwdHVyZSA0IG9yIGNhcHR1cmUgNSlcblx0XHRcIignKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCIpfFwiICtcblxuXHRcdC8vIDIuIHNpbXBsZSAoY2FwdHVyZSA2KVxuXHRcdFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiICsgYXR0cmlidXRlcyArIFwiKSopfFwiICtcblxuXHRcdC8vIDMuIGFueXRoaW5nIGVsc2UgKGNhcHR1cmUgMilcblx0XHRcIi4qXCIgK1xuXHRcdFwiKVxcXFwpfClcIixcblxuXHQvLyBMZWFkaW5nIGFuZCBub24tZXNjYXBlZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBjYXB0dXJpbmcgc29tZSBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXJzIHByZWNlZGluZyB0aGUgbGF0dGVyXG5cdHJ3aGl0ZXNwYWNlID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwiK1wiLCBcImdcIiApLFxuXHRydHJpbSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiK3woKD86XnxbXlxcXFxcXFxcXSkoPzpcXFxcXFxcXC4pKilcIiArXG5cdFx0d2hpdGVzcGFjZSArIFwiKyRcIiwgXCJnXCIgKSxcblxuXHRyY29tbWEgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiosXCIgKyB3aGl0ZXNwYWNlICsgXCIqXCIgKSxcblx0cmNvbWJpbmF0b3JzID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqKFs+K35dfFwiICsgd2hpdGVzcGFjZSArIFwiKVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCIqXCIgKSxcblx0cmRlc2NlbmQgPSBuZXcgUmVnRXhwKCB3aGl0ZXNwYWNlICsgXCJ8PlwiICksXG5cblx0cnBzZXVkbyA9IG5ldyBSZWdFeHAoIHBzZXVkb3MgKSxcblx0cmlkZW50aWZpZXIgPSBuZXcgUmVnRXhwKCBcIl5cIiArIGlkZW50aWZpZXIgKyBcIiRcIiApLFxuXG5cdG1hdGNoRXhwciA9IHtcblx0XHRcIklEXCI6IG5ldyBSZWdFeHAoIFwiXiMoXCIgKyBpZGVudGlmaWVyICsgXCIpXCIgKSxcblx0XHRcIkNMQVNTXCI6IG5ldyBSZWdFeHAoIFwiXlxcXFwuKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJUQUdcIjogbmV3IFJlZ0V4cCggXCJeKFwiICsgaWRlbnRpZmllciArIFwifFsqXSlcIiApLFxuXHRcdFwiQVRUUlwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIGF0dHJpYnV0ZXMgKSxcblx0XHRcIlBTRVVET1wiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHBzZXVkb3MgKSxcblx0XHRcIkNISUxEXCI6IG5ldyBSZWdFeHAoIFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIiArXG5cdFx0XHR3aGl0ZXNwYWNlICsgXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIiArIHdoaXRlc3BhY2UgKyBcIiooPzooWystXXwpXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKihcXFxcZCspfCkpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KVwiLCBcImlcIiApLFxuXHRcdFwiYm9vbFwiOiBuZXcgUmVnRXhwKCBcIl4oPzpcIiArIGJvb2xlYW5zICsgXCIpJFwiLCBcImlcIiApLFxuXG5cdFx0Ly8gRm9yIHVzZSBpbiBsaWJyYXJpZXMgaW1wbGVtZW50aW5nIC5pcygpXG5cdFx0Ly8gV2UgdXNlIHRoaXMgZm9yIFBPUyBtYXRjaGluZyBpbiBgc2VsZWN0YFxuXHRcdFwibmVlZHNDb250ZXh0XCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIipbPit+XXw6KGV2ZW58b2RkfGVxfGd0fGx0fG50aHxmaXJzdHxsYXN0KSg/OlxcXFwoXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKigoPzotXFxcXGQpP1xcXFxkKilcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpKD89W14tXXwkKVwiLCBcImlcIiApXG5cdH0sXG5cblx0cmh0bWwgPSAvSFRNTCQvaSxcblx0cmlucHV0cyA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksXG5cdHJoZWFkZXIgPSAvXmhcXGQkL2ksXG5cblx0cm5hdGl2ZSA9IC9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXG5cblx0Ly8gRWFzaWx5LXBhcnNlYWJsZS9yZXRyaWV2YWJsZSBJRCBvciBUQUcgb3IgQ0xBU1Mgc2VsZWN0b3JzXG5cdHJxdWlja0V4cHIgPSAvXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyxcblxuXHRyc2libGluZyA9IC9bK35dLyxcblxuXHQvLyBDU1MgZXNjYXBlc1xuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyMS9zeW5kYXRhLmh0bWwjZXNjYXBlZC1jaGFyYWN0ZXJzXG5cdHJ1bmVzY2FwZSA9IG5ldyBSZWdFeHAoIFwiXFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIiArIHdoaXRlc3BhY2UgKyBcIj98XFxcXFxcXFwoW15cXFxcclxcXFxuXFxcXGZdKVwiLCBcImdcIiApLFxuXHRmdW5lc2NhcGUgPSBmdW5jdGlvbiggZXNjYXBlLCBub25IZXggKSB7XG5cdFx0dmFyIGhpZ2ggPSBcIjB4XCIgKyBlc2NhcGUuc2xpY2UoIDEgKSAtIDB4MTAwMDA7XG5cblx0XHRyZXR1cm4gbm9uSGV4ID9cblxuXHRcdFx0Ly8gU3RyaXAgdGhlIGJhY2tzbGFzaCBwcmVmaXggZnJvbSBhIG5vbi1oZXggZXNjYXBlIHNlcXVlbmNlXG5cdFx0XHRub25IZXggOlxuXG5cdFx0XHQvLyBSZXBsYWNlIGEgaGV4YWRlY2ltYWwgZXNjYXBlIHNlcXVlbmNlIHdpdGggdGhlIGVuY29kZWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSA8PTExK1xuXHRcdFx0Ly8gRm9yIHZhbHVlcyBvdXRzaWRlIHRoZSBCYXNpYyBNdWx0aWxpbmd1YWwgUGxhbmUgKEJNUCksIG1hbnVhbGx5IGNvbnN0cnVjdCBhXG5cdFx0XHQvLyBzdXJyb2dhdGUgcGFpclxuXHRcdFx0aGlnaCA8IDAgP1xuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoICsgMHgxMDAwMCApIDpcblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCA+PiAxMCB8IDB4RDgwMCwgaGlnaCAmIDB4M0ZGIHwgMHhEQzAwICk7XG5cdH0sXG5cblx0Ly8gQ1NTIHN0cmluZy9pZGVudGlmaWVyIHNlcmlhbGl6YXRpb25cblx0Ly8gaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzc29tLyNjb21tb24tc2VyaWFsaXppbmctaWRpb21zXG5cdHJjc3Nlc2NhcGUgPSAvKFtcXDAtXFx4MWZcXHg3Zl18Xi0/XFxkKXxeLSR8W15cXDAtXFx4MWZcXHg3Zi1cXHVGRkZGXFx3LV0vZyxcblx0ZmNzc2VzY2FwZSA9IGZ1bmN0aW9uKCBjaCwgYXNDb2RlUG9pbnQgKSB7XG5cdFx0aWYgKCBhc0NvZGVQb2ludCApIHtcblxuXHRcdFx0Ly8gVSswMDAwIE5VTEwgYmVjb21lcyBVK0ZGRkQgUkVQTEFDRU1FTlQgQ0hBUkFDVEVSXG5cdFx0XHRpZiAoIGNoID09PSBcIlxcMFwiICkge1xuXHRcdFx0XHRyZXR1cm4gXCJcXHVGRkZEXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbnRyb2wgY2hhcmFjdGVycyBhbmQgKGRlcGVuZGVudCB1cG9uIHBvc2l0aW9uKSBudW1iZXJzIGdldCBlc2NhcGVkIGFzIGNvZGUgcG9pbnRzXG5cdFx0XHRyZXR1cm4gY2guc2xpY2UoIDAsIC0xICkgKyBcIlxcXFxcIiArXG5cdFx0XHRcdGNoLmNoYXJDb2RlQXQoIGNoLmxlbmd0aCAtIDEgKS50b1N0cmluZyggMTYgKSArIFwiIFwiO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyIHBvdGVudGlhbGx5LXNwZWNpYWwgQVNDSUkgY2hhcmFjdGVycyBnZXQgYmFja3NsYXNoLWVzY2FwZWRcblx0XHRyZXR1cm4gXCJcXFxcXCIgKyBjaDtcblx0fSxcblxuXHQvLyBVc2VkIGZvciBpZnJhbWVzXG5cdC8vIFNlZSBzZXREb2N1bWVudCgpXG5cdC8vIFJlbW92aW5nIHRoZSBmdW5jdGlvbiB3cmFwcGVyIGNhdXNlcyBhIFwiUGVybWlzc2lvbiBEZW5pZWRcIlxuXHQvLyBlcnJvciBpbiBJRVxuXHR1bmxvYWRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0c2V0RG9jdW1lbnQoKTtcblx0fSxcblxuXHRpbkRpc2FibGVkRmllbGRzZXQgPSBhZGRDb21iaW5hdG9yKFxuXHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IHRydWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImZpZWxkc2V0XCI7XG5cdFx0fSxcblx0XHR7IGRpcjogXCJwYXJlbnROb2RlXCIsIG5leHQ6IFwibGVnZW5kXCIgfVxuXHQpO1xuXG4vLyBPcHRpbWl6ZSBmb3IgcHVzaC5hcHBseSggXywgTm9kZUxpc3QgKVxudHJ5IHtcblx0cHVzaC5hcHBseShcblx0XHQoIGFyciA9IHNsaWNlLmNhbGwoIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzICkgKSxcblx0XHRwcmVmZXJyZWREb2MuY2hpbGROb2Rlc1xuXHQpO1xuXG5cdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4wXG5cdC8vIERldGVjdCBzaWxlbnRseSBmYWlsaW5nIHB1c2guYXBwbHlcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRhcnJbIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzLmxlbmd0aCBdLm5vZGVUeXBlO1xufSBjYXRjaCAoIGUgKSB7XG5cdHB1c2ggPSB7IGFwcGx5OiBhcnIubGVuZ3RoID9cblxuXHRcdC8vIExldmVyYWdlIHNsaWNlIGlmIHBvc3NpYmxlXG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0cHVzaE5hdGl2ZS5hcHBseSggdGFyZ2V0LCBzbGljZS5jYWxsKCBlbHMgKSApO1xuXHRcdH0gOlxuXG5cdFx0Ly8gU3VwcG9ydDogSUU8OVxuXHRcdC8vIE90aGVyd2lzZSBhcHBlbmQgZGlyZWN0bHlcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHR2YXIgaiA9IHRhcmdldC5sZW5ndGgsXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHQvLyBDYW4ndCB0cnVzdCBOb2RlTGlzdC5sZW5ndGhcblx0XHRcdHdoaWxlICggKCB0YXJnZXRbIGorKyBdID0gZWxzWyBpKysgXSApICkge31cblx0XHRcdHRhcmdldC5sZW5ndGggPSBqIC0gMTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBtLCBpLCBlbGVtLCBuaWQsIG1hdGNoLCBncm91cHMsIG5ld1NlbGVjdG9yLFxuXHRcdG5ld0NvbnRleHQgPSBjb250ZXh0ICYmIGNvbnRleHQub3duZXJEb2N1bWVudCxcblxuXHRcdC8vIG5vZGVUeXBlIGRlZmF1bHRzIHRvIDksIHNpbmNlIGNvbnRleHQgZGVmYXVsdHMgdG8gZG9jdW1lbnRcblx0XHRub2RlVHlwZSA9IGNvbnRleHQgPyBjb250ZXh0Lm5vZGVUeXBlIDogOTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBSZXR1cm4gZWFybHkgZnJvbSBjYWxscyB3aXRoIGludmFsaWQgc2VsZWN0b3Igb3IgY29udGV4dFxuXHRpZiAoIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiB8fCAhc2VsZWN0b3IgfHxcblx0XHRub2RlVHlwZSAhPT0gMSAmJiBub2RlVHlwZSAhPT0gOSAmJiBub2RlVHlwZSAhPT0gMTEgKSB7XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8vIFRyeSB0byBzaG9ydGN1dCBmaW5kIG9wZXJhdGlvbnMgKGFzIG9wcG9zZWQgdG8gZmlsdGVycykgaW4gSFRNTCBkb2N1bWVudHNcblx0aWYgKCAhc2VlZCApIHtcblx0XHRzZXREb2N1bWVudCggY29udGV4dCApO1xuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0aWYgKCBkb2N1bWVudElzSFRNTCApIHtcblxuXHRcdFx0Ly8gSWYgdGhlIHNlbGVjdG9yIGlzIHN1ZmZpY2llbnRseSBzaW1wbGUsIHRyeSB1c2luZyBhIFwiZ2V0KkJ5KlwiIERPTSBtZXRob2Rcblx0XHRcdC8vIChleGNlcHRpbmcgRG9jdW1lbnRGcmFnbWVudCBjb250ZXh0LCB3aGVyZSB0aGUgbWV0aG9kcyBkb24ndCBleGlzdClcblx0XHRcdGlmICggbm9kZVR5cGUgIT09IDExICYmICggbWF0Y2ggPSBycXVpY2tFeHByLmV4ZWMoIHNlbGVjdG9yICkgKSApIHtcblxuXHRcdFx0XHQvLyBJRCBzZWxlY3RvclxuXHRcdFx0XHRpZiAoICggbSA9IG1hdGNoWyAxIF0gKSApIHtcblxuXHRcdFx0XHRcdC8vIERvY3VtZW50IGNvbnRleHRcblx0XHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSwgT3BlcmEsIFdlYmtpdFxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBpZGVudGlmeSB2ZXJzaW9uc1xuXHRcdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCA9PT0gbSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBFbGVtZW50IGNvbnRleHRcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSwgT3BlcmEsIFdlYmtpdFxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdC8vIGdldEVsZW1lbnRCeUlkIGNhbiBtYXRjaCBlbGVtZW50cyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdGlmICggbmV3Q29udGV4dCAmJiAoIGVsZW0gPSBuZXdDb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkgKSAmJlxuXHRcdFx0XHRcdFx0XHRjb250YWlucyggY29udGV4dCwgZWxlbSApICYmXG5cdFx0XHRcdFx0XHRcdGVsZW0uaWQgPT09IG0gKSB7XG5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUeXBlIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWyAyIF0gKSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggc2VsZWN0b3IgKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHRcdC8vIENsYXNzIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoICggbSA9IG1hdGNoWyAzIF0gKSAmJiBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiZcblx0XHRcdFx0XHRjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKSB7XG5cblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG0gKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRha2UgYWR2YW50YWdlIG9mIHF1ZXJ5U2VsZWN0b3JBbGxcblx0XHRcdGlmICggc3VwcG9ydC5xc2EgJiZcblx0XHRcdFx0IW5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXSAmJlxuXHRcdFx0XHQoICFyYnVnZ3lRU0EgfHwgIXJidWdneVFTQS50ZXN0KCBzZWxlY3RvciApICkgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA4IG9ubHlcblx0XHRcdFx0Ly8gRXhjbHVkZSBvYmplY3QgZWxlbWVudHNcblx0XHRcdFx0KCBub2RlVHlwZSAhPT0gMSB8fCBjb250ZXh0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwib2JqZWN0XCIgKSApIHtcblxuXHRcdFx0XHRuZXdTZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRuZXdDb250ZXh0ID0gY29udGV4dDtcblxuXHRcdFx0XHQvLyBxU0EgY29uc2lkZXJzIGVsZW1lbnRzIG91dHNpZGUgYSBzY29waW5nIHJvb3Qgd2hlbiBldmFsdWF0aW5nIGNoaWxkIG9yXG5cdFx0XHRcdC8vIGRlc2NlbmRhbnQgY29tYmluYXRvcnMsIHdoaWNoIGlzIG5vdCB3aGF0IHdlIHdhbnQuXG5cdFx0XHRcdC8vIEluIHN1Y2ggY2FzZXMsIHdlIHdvcmsgYXJvdW5kIHRoZSBiZWhhdmlvciBieSBwcmVmaXhpbmcgZXZlcnkgc2VsZWN0b3IgaW4gdGhlXG5cdFx0XHRcdC8vIGxpc3Qgd2l0aCBhbiBJRCBzZWxlY3RvciByZWZlcmVuY2luZyB0aGUgc2NvcGUgY29udGV4dC5cblx0XHRcdFx0Ly8gVGhlIHRlY2huaXF1ZSBoYXMgdG8gYmUgdXNlZCBhcyB3ZWxsIHdoZW4gYSBsZWFkaW5nIGNvbWJpbmF0b3IgaXMgdXNlZFxuXHRcdFx0XHQvLyBhcyBzdWNoIHNlbGVjdG9ycyBhcmUgbm90IHJlY29nbml6ZWQgYnkgcXVlcnlTZWxlY3RvckFsbC5cblx0XHRcdFx0Ly8gVGhhbmtzIHRvIEFuZHJldyBEdXBvbnQgZm9yIHRoaXMgdGVjaG5pcXVlLlxuXHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0KCByZGVzY2VuZC50ZXN0KCBzZWxlY3RvciApIHx8IHJjb21iaW5hdG9ycy50ZXN0KCBzZWxlY3RvciApICkgKSB7XG5cblx0XHRcdFx0XHQvLyBFeHBhbmQgY29udGV4dCBmb3Igc2libGluZyBzZWxlY3RvcnNcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHQ7XG5cblx0XHRcdFx0XHQvLyBXZSBjYW4gdXNlIDpzY29wZSBpbnN0ZWFkIG9mIHRoZSBJRCBoYWNrIGlmIHRoZSBicm93c2VyXG5cdFx0XHRcdFx0Ly8gc3VwcG9ydHMgaXQgJiBpZiB3ZSdyZSBub3QgY2hhbmdpbmcgdGhlIGNvbnRleHQuXG5cdFx0XHRcdFx0aWYgKCBuZXdDb250ZXh0ICE9PSBjb250ZXh0IHx8ICFzdXBwb3J0LnNjb3BlICkge1xuXG5cdFx0XHRcdFx0XHQvLyBDYXB0dXJlIHRoZSBjb250ZXh0IElELCBzZXR0aW5nIGl0IGZpcnN0IGlmIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFx0aWYgKCAoIG5pZCA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKCBcImlkXCIgKSApICkge1xuXHRcdFx0XHRcdFx0XHRuaWQgPSBuaWQucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29udGV4dC5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgKCBuaWQgPSBleHBhbmRvICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBQcmVmaXggZXZlcnkgc2VsZWN0b3IgaW4gdGhlIGxpc3Rcblx0XHRcdFx0XHRncm91cHMgPSB0b2tlbml6ZSggc2VsZWN0b3IgKTtcblx0XHRcdFx0XHRpID0gZ3JvdXBzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGdyb3Vwc1sgaSBdID0gKCBuaWQgPyBcIiNcIiArIG5pZCA6IFwiOnNjb3BlXCIgKSArIFwiIFwiICtcblx0XHRcdFx0XHRcdFx0dG9TZWxlY3RvciggZ3JvdXBzWyBpIF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bmV3U2VsZWN0b3IgPSBncm91cHMuam9pbiggXCIsXCIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cyxcblx0XHRcdFx0XHRcdG5ld0NvbnRleHQucXVlcnlTZWxlY3RvckFsbCggbmV3U2VsZWN0b3IgKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH0gY2F0Y2ggKCBxc2FFcnJvciApIHtcblx0XHRcdFx0XHRub25uYXRpdmVTZWxlY3RvckNhY2hlKCBzZWxlY3RvciwgdHJ1ZSApO1xuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmICggbmlkID09PSBleHBhbmRvICkge1xuXHRcdFx0XHRcdFx0Y29udGV4dC5yZW1vdmVBdHRyaWJ1dGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEFsbCBvdGhlcnNcblx0cmV0dXJuIHNlbGVjdCggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGtleS12YWx1ZSBjYWNoZXMgb2YgbGltaXRlZCBzaXplXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oc3RyaW5nLCBvYmplY3QpfSBSZXR1cm5zIHRoZSBPYmplY3QgZGF0YSBhZnRlciBzdG9yaW5nIGl0IG9uIGl0c2VsZiB3aXRoXG4gKlx0cHJvcGVydHkgbmFtZSB0aGUgKHNwYWNlLXN1ZmZpeGVkKSBzdHJpbmcgYW5kIChpZiB0aGUgY2FjaGUgaXMgbGFyZ2VyIHRoYW4gRXhwci5jYWNoZUxlbmd0aClcbiAqXHRkZWxldGluZyB0aGUgb2xkZXN0IGVudHJ5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNhY2hlKCkge1xuXHR2YXIga2V5cyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGNhY2hlKCBrZXksIHZhbHVlICkge1xuXG5cdFx0Ly8gVXNlIChrZXkgKyBcIiBcIikgdG8gYXZvaWQgY29sbGlzaW9uIHdpdGggbmF0aXZlIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChzZWUgSXNzdWUgIzE1Nylcblx0XHRpZiAoIGtleXMucHVzaCgga2V5ICsgXCIgXCIgKSA+IEV4cHIuY2FjaGVMZW5ndGggKSB7XG5cblx0XHRcdC8vIE9ubHkga2VlcCB0aGUgbW9zdCByZWNlbnQgZW50cmllc1xuXHRcdFx0ZGVsZXRlIGNhY2hlWyBrZXlzLnNoaWZ0KCkgXTtcblx0XHR9XG5cdFx0cmV0dXJuICggY2FjaGVbIGtleSArIFwiIFwiIF0gPSB2YWx1ZSApO1xuXHR9XG5cdHJldHVybiBjYWNoZTtcbn1cblxuLyoqXG4gKiBNYXJrIGEgZnVuY3Rpb24gZm9yIHNwZWNpYWwgdXNlIGJ5IFNpenpsZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIG1hcmtcbiAqL1xuZnVuY3Rpb24gbWFya0Z1bmN0aW9uKCBmbiApIHtcblx0Zm5bIGV4cGFuZG8gXSA9IHRydWU7XG5cdHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBTdXBwb3J0IHRlc3RpbmcgdXNpbmcgYW4gZWxlbWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gUGFzc2VkIHRoZSBjcmVhdGVkIGVsZW1lbnQgYW5kIHJldHVybnMgYSBib29sZWFuIHJlc3VsdFxuICovXG5mdW5jdGlvbiBhc3NlcnQoIGZuICkge1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImZpZWxkc2V0XCIgKTtcblxuXHR0cnkge1xuXHRcdHJldHVybiAhIWZuKCBlbCApO1xuXHR9IGNhdGNoICggZSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZmluYWxseSB7XG5cblx0XHQvLyBSZW1vdmUgZnJvbSBpdHMgcGFyZW50IGJ5IGRlZmF1bHRcblx0XHRpZiAoIGVsLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBlbCApO1xuXHRcdH1cblxuXHRcdC8vIHJlbGVhc2UgbWVtb3J5IGluIElFXG5cdFx0ZWwgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgc2FtZSBoYW5kbGVyIGZvciBhbGwgb2YgdGhlIHNwZWNpZmllZCBhdHRyc1xuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJzIFBpcGUtc2VwYXJhdGVkIGxpc3Qgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKi9cbmZ1bmN0aW9uIGFkZEhhbmRsZSggYXR0cnMsIGhhbmRsZXIgKSB7XG5cdHZhciBhcnIgPSBhdHRycy5zcGxpdCggXCJ8XCIgKSxcblx0XHRpID0gYXJyLmxlbmd0aDtcblxuXHR3aGlsZSAoIGktLSApIHtcblx0XHRFeHByLmF0dHJIYW5kbGVbIGFyclsgaSBdIF0gPSBoYW5kbGVyO1xuXHR9XG59XG5cbi8qKlxuICogQ2hlY2tzIGRvY3VtZW50IG9yZGVyIG9mIHR3byBzaWJsaW5nc1xuICogQHBhcmFtIHtFbGVtZW50fSBhXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFJldHVybnMgbGVzcyB0aGFuIDAgaWYgYSBwcmVjZWRlcyBiLCBncmVhdGVyIHRoYW4gMCBpZiBhIGZvbGxvd3MgYlxuICovXG5mdW5jdGlvbiBzaWJsaW5nQ2hlY2soIGEsIGIgKSB7XG5cdHZhciBjdXIgPSBiICYmIGEsXG5cdFx0ZGlmZiA9IGN1ciAmJiBhLm5vZGVUeXBlID09PSAxICYmIGIubm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdGEuc291cmNlSW5kZXggLSBiLnNvdXJjZUluZGV4O1xuXG5cdC8vIFVzZSBJRSBzb3VyY2VJbmRleCBpZiBhdmFpbGFibGUgb24gYm90aCBub2Rlc1xuXHRpZiAoIGRpZmYgKSB7XG5cdFx0cmV0dXJuIGRpZmY7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBiIGZvbGxvd3MgYVxuXHRpZiAoIGN1ciApIHtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLm5leHRTaWJsaW5nICkgKSB7XG5cdFx0XHRpZiAoIGN1ciA9PT0gYiApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBhID8gMSA6IC0xO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgaW5wdXQgdHlwZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0UHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBidXR0b25zXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Qc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gKCBuYW1lID09PSBcImlucHV0XCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIiApICYmIGVsZW0udHlwZSA9PT0gdHlwZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIDplbmFibGVkLzpkaXNhYmxlZFxuICogQHBhcmFtIHtCb29sZWFufSBkaXNhYmxlZCB0cnVlIGZvciA6ZGlzYWJsZWQ7IGZhbHNlIGZvciA6ZW5hYmxlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggZGlzYWJsZWQgKSB7XG5cblx0Ly8gS25vd24gOmRpc2FibGVkIGZhbHNlIHBvc2l0aXZlczogZmllbGRzZXRbZGlzYWJsZWRdID4gbGVnZW5kOm50aC1vZi10eXBlKG4rMikgOmNhbi1kaXNhYmxlXG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdC8vIE9ubHkgY2VydGFpbiBlbGVtZW50cyBjYW4gbWF0Y2ggOmVuYWJsZWQgb3IgOmRpc2FibGVkXG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2NyaXB0aW5nLmh0bWwjc2VsZWN0b3ItZW5hYmxlZFxuXHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sI3NlbGVjdG9yLWRpc2FibGVkXG5cdFx0aWYgKCBcImZvcm1cIiBpbiBlbGVtICkge1xuXG5cdFx0XHQvLyBDaGVjayBmb3IgaW5oZXJpdGVkIGRpc2FibGVkbmVzcyBvbiByZWxldmFudCBub24tZGlzYWJsZWQgZWxlbWVudHM6XG5cdFx0XHQvLyAqIGxpc3RlZCBmb3JtLWFzc29jaWF0ZWQgZWxlbWVudHMgaW4gYSBkaXNhYmxlZCBmaWVsZHNldFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxpc3RlZFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NvbmNlcHQtZmUtZGlzYWJsZWRcblx0XHRcdC8vICogb3B0aW9uIGVsZW1lbnRzIGluIGEgZGlzYWJsZWQgb3B0Z3JvdXBcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjb25jZXB0LW9wdGlvbi1kaXNhYmxlZFxuXHRcdFx0Ly8gQWxsIHN1Y2ggZWxlbWVudHMgaGF2ZSBhIFwiZm9ybVwiIHByb3BlcnR5LlxuXHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgJiYgZWxlbS5kaXNhYmxlZCA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0Ly8gT3B0aW9uIGVsZW1lbnRzIGRlZmVyIHRvIGEgcGFyZW50IG9wdGdyb3VwIGlmIHByZXNlbnRcblx0XHRcdFx0aWYgKCBcImxhYmVsXCIgaW4gZWxlbSApIHtcblx0XHRcdFx0XHRpZiAoIFwibGFiZWxcIiBpbiBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5wYXJlbnROb2RlLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDYgLSAxMVxuXHRcdFx0XHQvLyBVc2UgdGhlIGlzRGlzYWJsZWQgc2hvcnRjdXQgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGRpc2FibGVkIGZpZWxkc2V0IGFuY2VzdG9yc1xuXHRcdFx0XHRyZXR1cm4gZWxlbS5pc0Rpc2FibGVkID09PSBkaXNhYmxlZCB8fFxuXG5cdFx0XHRcdFx0Ly8gV2hlcmUgdGhlcmUgaXMgbm8gaXNEaXNhYmxlZCwgY2hlY2sgbWFudWFsbHlcblx0XHRcdFx0XHQvKiBqc2hpbnQgLVcwMTggKi9cblx0XHRcdFx0XHRlbGVtLmlzRGlzYWJsZWQgIT09ICFkaXNhYmxlZCAmJlxuXHRcdFx0XHRcdGluRGlzYWJsZWRGaWVsZHNldCggZWxlbSApID09PSBkaXNhYmxlZDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXG5cdFx0Ly8gVHJ5IHRvIHdpbm5vdyBvdXQgZWxlbWVudHMgdGhhdCBjYW4ndCBiZSBkaXNhYmxlZCBiZWZvcmUgdHJ1c3RpbmcgdGhlIGRpc2FibGVkIHByb3BlcnR5LlxuXHRcdC8vIFNvbWUgdmljdGltcyBnZXQgY2F1Z2h0IGluIG91ciBuZXQgKGxhYmVsLCBsZWdlbmQsIG1lbnUsIHRyYWNrKSwgYnV0IGl0IHNob3VsZG4ndFxuXHRcdC8vIGV2ZW4gZXhpc3Qgb24gdGhlbSwgbGV0IGFsb25lIGhhdmUgYSBib29sZWFuIHZhbHVlLlxuXHRcdH0gZWxzZSBpZiAoIFwibGFiZWxcIiBpbiBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdH1cblxuXHRcdC8vIFJlbWFpbmluZyBlbGVtZW50cyBhcmUgbmVpdGhlciA6ZW5hYmxlZCBub3IgOmRpc2FibGVkXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgcG9zaXRpb25hbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZuICkge1xuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggYXJndW1lbnQgKSB7XG5cdFx0YXJndW1lbnQgPSArYXJndW1lbnQ7XG5cdFx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHR2YXIgaixcblx0XHRcdFx0bWF0Y2hJbmRleGVzID0gZm4oIFtdLCBzZWVkLmxlbmd0aCwgYXJndW1lbnQgKSxcblx0XHRcdFx0aSA9IG1hdGNoSW5kZXhlcy5sZW5ndGg7XG5cblx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIGZvdW5kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlc1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggc2VlZFsgKCBqID0gbWF0Y2hJbmRleGVzWyBpIF0gKSBdICkge1xuXHRcdFx0XHRcdHNlZWRbIGogXSA9ICEoIG1hdGNoZXNbIGogXSA9IHNlZWRbIGogXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGEgbm9kZSBmb3IgdmFsaWRpdHkgYXMgYSBTaXp6bGUgY29udGV4dFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdD19IGNvbnRleHRcbiAqIEByZXR1cm5zIHtFbGVtZW50fE9iamVjdHxCb29sZWFufSBUaGUgaW5wdXQgbm9kZSBpZiBhY2NlcHRhYmxlLCBvdGhlcndpc2UgYSBmYWxzeSB2YWx1ZVxuICovXG5mdW5jdGlvbiB0ZXN0Q29udGV4dCggY29udGV4dCApIHtcblx0cmV0dXJuIGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29udGV4dDtcbn1cblxuLy8gRXhwb3NlIHN1cHBvcnQgdmFycyBmb3IgY29udmVuaWVuY2VcbnN1cHBvcnQgPSBTaXp6bGUuc3VwcG9ydCA9IHt9O1xuXG4vKipcbiAqIERldGVjdHMgWE1MIG5vZGVzXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbGVtIEFuIGVsZW1lbnQgb3IgYSBkb2N1bWVudFxuICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWZmIGVsZW0gaXMgYSBub24tSFRNTCBYTUwgbm9kZVxuICovXG5pc1hNTCA9IFNpenpsZS5pc1hNTCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbmFtZXNwYWNlID0gZWxlbSAmJiBlbGVtLm5hbWVzcGFjZVVSSSxcblx0XHRkb2NFbGVtID0gZWxlbSAmJiAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkuZG9jdW1lbnRFbGVtZW50O1xuXG5cdC8vIFN1cHBvcnQ6IElFIDw9OFxuXHQvLyBBc3N1bWUgSFRNTCB3aGVuIGRvY3VtZW50RWxlbWVudCBkb2Vzbid0IHlldCBleGlzdCwgc3VjaCBhcyBpbnNpZGUgbG9hZGluZyBpZnJhbWVzXG5cdC8vIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC80ODMzXG5cdHJldHVybiAhcmh0bWwudGVzdCggbmFtZXNwYWNlIHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5ub2RlTmFtZSB8fCBcIkhUTUxcIiApO1xufTtcblxuLyoqXG4gKiBTZXRzIGRvY3VtZW50LXJlbGF0ZWQgdmFyaWFibGVzIG9uY2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IFtkb2NdIEFuIGVsZW1lbnQgb3IgZG9jdW1lbnQgb2JqZWN0IHRvIHVzZSB0byBzZXQgdGhlIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKi9cbnNldERvY3VtZW50ID0gU2l6emxlLnNldERvY3VtZW50ID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cdHZhciBoYXNDb21wYXJlLCBzdWJXaW5kb3csXG5cdFx0ZG9jID0gbm9kZSA/IG5vZGUub3duZXJEb2N1bWVudCB8fCBub2RlIDogcHJlZmVycmVkRG9jO1xuXG5cdC8vIFJldHVybiBlYXJseSBpZiBkb2MgaXMgaW52YWxpZCBvciBhbHJlYWR5IHNlbGVjdGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggZG9jID09IGRvY3VtZW50IHx8IGRvYy5ub2RlVHlwZSAhPT0gOSB8fCAhZG9jLmRvY3VtZW50RWxlbWVudCApIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQ7XG5cdH1cblxuXHQvLyBVcGRhdGUgZ2xvYmFsIHZhcmlhYmxlc1xuXHRkb2N1bWVudCA9IGRvYztcblx0ZG9jRWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0ZG9jdW1lbnRJc0hUTUwgPSAhaXNYTUwoIGRvY3VtZW50ICk7XG5cblx0Ly8gU3VwcG9ydDogSUUgOSAtIDExKywgRWRnZSAxMiAtIDE4K1xuXHQvLyBBY2Nlc3NpbmcgaWZyYW1lIGRvY3VtZW50cyBhZnRlciB1bmxvYWQgdGhyb3dzIFwicGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvcnMgKGpRdWVyeSAjMTM5MzYpXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggcHJlZmVycmVkRG9jICE9IGRvY3VtZW50ICYmXG5cdFx0KCBzdWJXaW5kb3cgPSBkb2N1bWVudC5kZWZhdWx0VmlldyApICYmIHN1YldpbmRvdy50b3AgIT09IHN1YldpbmRvdyApIHtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDExLCBFZGdlXG5cdFx0aWYgKCBzdWJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdHN1YldpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBcInVubG9hZFwiLCB1bmxvYWRIYW5kbGVyLCBmYWxzZSApO1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgOSAtIDEwIG9ubHlcblx0XHR9IGVsc2UgaWYgKCBzdWJXaW5kb3cuYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHRzdWJXaW5kb3cuYXR0YWNoRXZlbnQoIFwib251bmxvYWRcIiwgdW5sb2FkSGFuZGxlciApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFN1cHBvcnQ6IElFIDggLSAxMSssIEVkZ2UgMTIgLSAxOCssIENocm9tZSA8PTE2IC0gMjUgb25seSwgRmlyZWZveCA8PTMuNiAtIDMxIG9ubHksXG5cdC8vIFNhZmFyaSA0IC0gNSBvbmx5LCBPcGVyYSA8PTExLjYgLSAxMi54IG9ubHlcblx0Ly8gSUUvRWRnZSAmIG9sZGVyIGJyb3dzZXJzIGRvbid0IHN1cHBvcnQgdGhlIDpzY29wZSBwc2V1ZG8tY2xhc3MuXG5cdC8vIFN1cHBvcnQ6IFNhZmFyaSA2LjAgb25seVxuXHQvLyBTYWZhcmkgNi4wIHN1cHBvcnRzIDpzY29wZSBidXQgaXQncyBhbiBhbGlhcyBvZiA6cm9vdCB0aGVyZS5cblx0c3VwcG9ydC5zY29wZSA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSApO1xuXHRcdHJldHVybiB0eXBlb2YgZWwucXVlcnlTZWxlY3RvckFsbCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0IWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOnNjb3BlIGZpZWxkc2V0IGRpdlwiICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0LyogQXR0cmlidXRlc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gU3VwcG9ydDogSUU8OFxuXHQvLyBWZXJpZnkgdGhhdCBnZXRBdHRyaWJ1dGUgcmVhbGx5IHJldHVybnMgYXR0cmlidXRlcyBhbmQgbm90IHByb3BlcnRpZXNcblx0Ly8gKGV4Y2VwdGluZyBJRTggYm9vbGVhbnMpXG5cdHN1cHBvcnQuYXR0cmlidXRlcyA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGVsLmNsYXNzTmFtZSA9IFwiaVwiO1xuXHRcdHJldHVybiAhZWwuZ2V0QXR0cmlidXRlKCBcImNsYXNzTmFtZVwiICk7XG5cdH0gKTtcblxuXHQvKiBnZXRFbGVtZW50KHMpQnkqXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgcmV0dXJucyBvbmx5IGVsZW1lbnRzXG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRlbC5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlQ29tbWVudCggXCJcIiApICk7XG5cdFx0cmV0dXJuICFlbC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCIqXCIgKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvLyBTdXBwb3J0OiBJRTw5XG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDEwXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRCeUlkIHJldHVybnMgZWxlbWVudHMgYnkgbmFtZVxuXHQvLyBUaGUgYnJva2VuIGdldEVsZW1lbnRCeUlkIG1ldGhvZHMgZG9uJ3QgcGljayB1cCBwcm9ncmFtbWF0aWNhbGx5LXNldCBuYW1lcyxcblx0Ly8gc28gdXNlIGEgcm91bmRhYm91dCBnZXRFbGVtZW50c0J5TmFtZSB0ZXN0XG5cdHN1cHBvcnQuZ2V0QnlJZCA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuaWQgPSBleHBhbmRvO1xuXHRcdHJldHVybiAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUgfHwgIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCBleHBhbmRvICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0Ly8gSUQgZmlsdGVyIGFuZCBmaW5kXG5cdGlmICggc3VwcG9ydC5nZXRCeUlkICkge1xuXHRcdEV4cHIuZmlsdGVyWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0RXhwci5maW5kWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRcdHZhciBlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblx0XHRcdFx0cmV0dXJuIGVsZW0gPyBbIGVsZW0gXSA6IFtdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0RXhwci5maWx0ZXJbIFwiSURcIiBdID0gIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgbm9kZSA9IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRyZXR1cm4gbm9kZSAmJiBub2RlLnZhbHVlID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA2IC0gNyBvbmx5XG5cdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgaXMgbm90IHJlbGlhYmxlIGFzIGEgZmluZCBzaG9ydGN1dFxuXHRcdEV4cHIuZmluZFsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgbm9kZSwgaSwgZWxlbXMsXG5cdFx0XHRcdFx0ZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdFx0aWYgKCBlbGVtICkge1xuXG5cdFx0XHRcdFx0Ly8gVmVyaWZ5IHRoZSBpZCBhdHRyaWJ1dGVcblx0XHRcdFx0XHRub2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0XHRpZiAoIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gaWQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gWyBlbGVtIF07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRmFsbCBiYWNrIG9uIGdldEVsZW1lbnRzQnlOYW1lXG5cdFx0XHRcdFx0ZWxlbXMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlOYW1lKCBpZCApO1xuXHRcdFx0XHRcdGkgPSAwO1xuXHRcdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRub2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0XHRcdGlmICggbm9kZSAmJiBub2RlLnZhbHVlID09PSBpZCApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFsgZWxlbSBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Ly8gVGFnXG5cdEV4cHIuZmluZFsgXCJUQUdcIiBdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA/XG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRG9jdW1lbnRGcmFnbWVudCBub2RlcyBkb24ndCBoYXZlIGdFQlROXG5cdFx0XHR9IGVsc2UgaWYgKCBzdXBwb3J0LnFzYSApIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCggdGFnICk7XG5cdFx0XHR9XG5cdFx0fSA6XG5cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdHRtcCA9IFtdLFxuXHRcdFx0XHRpID0gMCxcblxuXHRcdFx0XHQvLyBCeSBoYXBweSBjb2luY2lkZW5jZSwgYSAoYnJva2VuKSBnRUJUTiBhcHBlYXJzIG9uIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgdG9vXG5cdFx0XHRcdHJlc3VsdHMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRmlsdGVyIG91dCBwb3NzaWJsZSBjb21tZW50c1xuXHRcdFx0aWYgKCB0YWcgPT09IFwiKlwiICkge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0dG1wLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdG1wO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHQvLyBDbGFzc1xuXHRFeHByLmZpbmRbIFwiQ0xBU1NcIiBdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGZ1bmN0aW9uKCBjbGFzc05hbWUsIGNvbnRleHQgKSB7XG5cdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0cmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggY2xhc3NOYW1lICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qIFFTQS9tYXRjaGVzU2VsZWN0b3Jcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFFTQSBhbmQgbWF0Y2hlc1NlbGVjdG9yIHN1cHBvcnRcblxuXHQvLyBtYXRjaGVzU2VsZWN0b3IoOmFjdGl2ZSkgcmVwb3J0cyBmYWxzZSB3aGVuIHRydWUgKElFOS9PcGVyYSAxMS41KVxuXHRyYnVnZ3lNYXRjaGVzID0gW107XG5cblx0Ly8gcVNhKDpmb2N1cykgcmVwb3J0cyBmYWxzZSB3aGVuIHRydWUgKENocm9tZSAyMSlcblx0Ly8gV2UgYWxsb3cgdGhpcyBiZWNhdXNlIG9mIGEgYnVnIGluIElFOC85IHRoYXQgdGhyb3dzIGFuIGVycm9yXG5cdC8vIHdoZW5ldmVyIGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBpcyBhY2Nlc3NlZCBvbiBhbiBpZnJhbWVcblx0Ly8gU28sIHdlIGFsbG93IDpmb2N1cyB0byBwYXNzIHRocm91Z2ggUVNBIGFsbCB0aGUgdGltZSB0byBhdm9pZCB0aGUgSUUgZXJyb3Jcblx0Ly8gU2VlIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMzM3OFxuXHRyYnVnZ3lRU0EgPSBbXTtcblxuXHRpZiAoICggc3VwcG9ydC5xc2EgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgKSApICkge1xuXG5cdFx0Ly8gQnVpbGQgUVNBIHJlZ2V4XG5cdFx0Ly8gUmVnZXggc3RyYXRlZ3kgYWRvcHRlZCBmcm9tIERpZWdvIFBlcmluaVxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0XHR2YXIgaW5wdXQ7XG5cblx0XHRcdC8vIFNlbGVjdCBpcyBzZXQgdG8gZW1wdHkgc3RyaW5nIG9uIHB1cnBvc2Vcblx0XHRcdC8vIFRoaXMgaXMgdG8gdGVzdCBJRSdzIHRyZWF0bWVudCBvZiBub3QgZXhwbGljaXRseVxuXHRcdFx0Ly8gc2V0dGluZyBhIGJvb2xlYW4gY29udGVudCBhdHRyaWJ1dGUsXG5cdFx0XHQvLyBzaW5jZSBpdHMgcHJlc2VuY2Ugc2hvdWxkIGJlIGVub3VnaFxuXHRcdFx0Ly8gaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzEyMzU5XG5cdFx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmlubmVySFRNTCA9IFwiPGEgaWQ9J1wiICsgZXhwYW5kbyArIFwiJz48L2E+XCIgK1xuXHRcdFx0XHRcIjxzZWxlY3QgaWQ9J1wiICsgZXhwYW5kbyArIFwiLVxcclxcXFwnIG1zYWxsb3djYXB0dXJlPScnPlwiICtcblx0XHRcdFx0XCI8b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTgsIE9wZXJhIDExLTEyLjE2XG5cdFx0XHQvLyBOb3RoaW5nIHNob3VsZCBiZSBzZWxlY3RlZCB3aGVuIGVtcHR5IHN0cmluZ3MgZm9sbG93IF49IG9yICQ9IG9yICo9XG5cdFx0XHQvLyBUaGUgdGVzdCBhdHRyaWJ1dGUgbXVzdCBiZSB1bmtub3duIGluIE9wZXJhIGJ1dCBcInNhZmVcIiBmb3IgV2luUlRcblx0XHRcdC8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvaGg0NjUzODguYXNweCNhdHRyaWJ1dGVfc2VjdGlvblxuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIlttc2FsbG93Y2FwdHVyZV49JyddXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlsqXiRdPVwiICsgd2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gQm9vbGVhbiBhdHRyaWJ1dGVzIGFuZCBcInZhbHVlXCIgYXJlIG5vdCB0cmVhdGVkIGNvcnJlY3RseVxuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbc2VsZWN0ZWRdXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86dmFsdWV8XCIgKyBib29sZWFucyArIFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IENocm9tZTwyOSwgQW5kcm9pZDw0LjQsIFNhZmFyaTw3LjArLCBpT1M8Ny4wKywgUGhhbnRvbUpTPDEuOS44K1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbaWR+PVwiICsgZXhwYW5kbyArIFwiLV1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwifj1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTUgLSAxOCtcblx0XHRcdC8vIElFIDExL0VkZ2UgZG9uJ3QgZmluZCBlbGVtZW50cyBvbiBhIGBbbmFtZT0nJ11gIHF1ZXJ5IGluIHNvbWUgY2FzZXMuXG5cdFx0XHQvLyBBZGRpbmcgYSB0ZW1wb3JhcnkgYXR0cmlidXRlIHRvIHRoZSBkb2N1bWVudCBiZWZvcmUgdGhlIHNlbGVjdGlvbiB3b3Jrc1xuXHRcdFx0Ly8gYXJvdW5kIHRoZSBpc3N1ZS5cblx0XHRcdC8vIEludGVyZXN0aW5nbHksIElFIDEwICYgb2xkZXIgZG9uJ3Qgc2VlbSB0byBoYXZlIHRoZSBpc3N1ZS5cblx0XHRcdGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcIlwiICk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZCggaW5wdXQgKTtcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW25hbWU9JyddXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqbmFtZVwiICsgd2hpdGVzcGFjZSArIFwiKj1cIiArXG5cdFx0XHRcdFx0d2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdlYmtpdC9PcGVyYSAtIDpjaGVja2VkIHNob3VsZCByZXR1cm4gc2VsZWN0ZWQgb3B0aW9uIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0Ly8gSUU4IHRocm93cyBlcnJvciBoZXJlIGFuZCB3aWxsIG5vdCBzZWUgbGF0ZXIgdGVzdHNcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmNoZWNrZWRcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmNoZWNrZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBTYWZhcmkgOCssIGlPUyA4K1xuXHRcdFx0Ly8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNjg1MVxuXHRcdFx0Ly8gSW4tcGFnZSBgc2VsZWN0b3IjaWQgc2libGluZy1jb21iaW5hdG9yIHNlbGVjdG9yYCBmYWlsc1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJhI1wiICsgZXhwYW5kbyArIFwiKypcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiLiMuK1srfl1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBGaXJlZm94IDw9My42IC0gNSBvbmx5XG5cdFx0XHQvLyBPbGQgRmlyZWZveCBkb2Vzbid0IHRocm93IG9uIGEgYmFkbHktZXNjYXBlZCBpZGVudGlmaWVyLlxuXHRcdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggXCJcXFxcXFxmXCIgKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKCBcIltcXFxcclxcXFxuXFxcXGZdXCIgKTtcblx0XHR9ICk7XG5cblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdGVsLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nJyBkaXNhYmxlZD0nZGlzYWJsZWQnPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBkaXNhYmxlZD0nZGlzYWJsZWQnPjxvcHRpb24vPjwvc2VsZWN0PlwiO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBXaW5kb3dzIDggTmF0aXZlIEFwcHNcblx0XHRcdC8vIFRoZSB0eXBlIGFuZCBuYW1lIGF0dHJpYnV0ZXMgYXJlIHJlc3RyaWN0ZWQgZHVyaW5nIC5pbm5lckhUTUwgYXNzaWdubWVudFxuXHRcdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCBcImhpZGRlblwiICk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZCggaW5wdXQgKS5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcIkRcIiApO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRThcblx0XHRcdC8vIEVuZm9yY2UgY2FzZS1zZW5zaXRpdml0eSBvZiBuYW1lIGF0dHJpYnV0ZVxuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltuYW1lPWRdXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIm5hbWVcIiArIHdoaXRlc3BhY2UgKyBcIipbKl4kfCF+XT89XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRkYgMy41IC0gOmVuYWJsZWQvOmRpc2FibGVkIGFuZCBoaWRkZW4gZWxlbWVudHMgKGhpZGRlbiBlbGVtZW50cyBhcmUgc3RpbGwgZW5hYmxlZClcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmVuYWJsZWRcIiApLmxlbmd0aCAhPT0gMiApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTktMTErXG5cdFx0XHQvLyBJRSdzIDpkaXNhYmxlZCBzZWxlY3RvciBkb2VzIG5vdCBwaWNrIHVwIHRoZSBjaGlsZHJlbiBvZiBkaXNhYmxlZCBmaWVsZHNldHNcblx0XHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpkaXNhYmxlZFwiICkubGVuZ3RoICE9PSAyICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6ZW5hYmxlZFwiLCBcIjpkaXNhYmxlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IE9wZXJhIDEwIC0gMTEgb25seVxuXHRcdFx0Ly8gT3BlcmEgMTAtMTEgZG9lcyBub3QgdGhyb3cgb24gcG9zdC1jb21tYSBpbnZhbGlkIHBzZXVkb3Ncblx0XHRcdGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiKiw6eFwiICk7XG5cdFx0XHRyYnVnZ3lRU0EucHVzaCggXCIsLio6XCIgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpZiAoICggc3VwcG9ydC5tYXRjaGVzU2VsZWN0b3IgPSBybmF0aXZlLnRlc3QoICggbWF0Y2hlcyA9IGRvY0VsZW0ubWF0Y2hlcyB8fFxuXHRcdGRvY0VsZW0ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1zTWF0Y2hlc1NlbGVjdG9yICkgKSApICkge1xuXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRvIG1hdGNoZXNTZWxlY3RvclxuXHRcdFx0Ly8gb24gYSBkaXNjb25uZWN0ZWQgbm9kZSAoSUUgOSlcblx0XHRcdHN1cHBvcnQuZGlzY29ubmVjdGVkTWF0Y2ggPSBtYXRjaGVzLmNhbGwoIGVsLCBcIipcIiApO1xuXG5cdFx0XHQvLyBUaGlzIHNob3VsZCBmYWlsIHdpdGggYW4gZXhjZXB0aW9uXG5cdFx0XHQvLyBHZWNrbyBkb2VzIG5vdCBlcnJvciwgcmV0dXJucyBmYWxzZSBpbnN0ZWFkXG5cdFx0XHRtYXRjaGVzLmNhbGwoIGVsLCBcIltzIT0nJ106eFwiICk7XG5cdFx0XHRyYnVnZ3lNYXRjaGVzLnB1c2goIFwiIT1cIiwgcHNldWRvcyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdHJidWdneVFTQSA9IHJidWdneVFTQS5sZW5ndGggJiYgbmV3IFJlZ0V4cCggcmJ1Z2d5UVNBLmpvaW4oIFwifFwiICkgKTtcblx0cmJ1Z2d5TWF0Y2hlcyA9IHJidWdneU1hdGNoZXMubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneU1hdGNoZXMuam9pbiggXCJ8XCIgKSApO1xuXG5cdC8qIENvbnRhaW5zXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0aGFzQ29tcGFyZSA9IHJuYXRpdmUudGVzdCggZG9jRWxlbS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiApO1xuXG5cdC8vIEVsZW1lbnQgY29udGFpbnMgYW5vdGhlclxuXHQvLyBQdXJwb3NlZnVsbHkgc2VsZi1leGNsdXNpdmVcblx0Ly8gQXMgaW4sIGFuIGVsZW1lbnQgZG9lcyBub3QgY29udGFpbiBpdHNlbGZcblx0Y29udGFpbnMgPSBoYXNDb21wYXJlIHx8IHJuYXRpdmUudGVzdCggZG9jRWxlbS5jb250YWlucyApID9cblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBhZG93biA9IGEubm9kZVR5cGUgPT09IDkgPyBhLmRvY3VtZW50RWxlbWVudCA6IGEsXG5cdFx0XHRcdGJ1cCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuXHRcdFx0cmV0dXJuIGEgPT09IGJ1cCB8fCAhISggYnVwICYmIGJ1cC5ub2RlVHlwZSA9PT0gMSAmJiAoXG5cdFx0XHRcdGFkb3duLmNvbnRhaW5zID9cblx0XHRcdFx0XHRhZG93bi5jb250YWlucyggYnVwICkgOlxuXHRcdFx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYnVwICkgJiAxNlxuXHRcdFx0KSApO1xuXHRcdH0gOlxuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0aWYgKCBiICkge1xuXHRcdFx0XHR3aGlsZSAoICggYiA9IGIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0XHRcdGlmICggYiA9PT0gYSApIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0LyogU29ydGluZ1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gRG9jdW1lbnQgb3JkZXIgc29ydGluZ1xuXHRzb3J0T3JkZXIgPSBoYXNDb21wYXJlID9cblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBGbGFnIGZvciBkdXBsaWNhdGUgcmVtb3ZhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHQvLyBTb3J0IG9uIG1ldGhvZCBleGlzdGVuY2UgaWYgb25seSBvbmUgaW5wdXQgaGFzIGNvbXBhcmVEb2N1bWVudFBvc2l0aW9uXG5cdFx0dmFyIGNvbXBhcmUgPSAhYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAtICFiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uO1xuXHRcdGlmICggY29tcGFyZSApIHtcblx0XHRcdHJldHVybiBjb21wYXJlO1xuXHRcdH1cblxuXHRcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpZiBib3RoIGlucHV0cyBiZWxvbmcgdG8gdGhlIHNhbWUgZG9jdW1lbnRcblx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdGNvbXBhcmUgPSAoIGEub3duZXJEb2N1bWVudCB8fCBhICkgPT0gKCBiLm93bmVyRG9jdW1lbnQgfHwgYiApID9cblx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGIgKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSB3ZSBrbm93IHRoZXkgYXJlIGRpc2Nvbm5lY3RlZFxuXHRcdFx0MTtcblxuXHRcdC8vIERpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdGlmICggY29tcGFyZSAmIDEgfHxcblx0XHRcdCggIXN1cHBvcnQuc29ydERldGFjaGVkICYmIGIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGEgKSA9PT0gY29tcGFyZSApICkge1xuXG5cdFx0XHQvLyBDaG9vc2UgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBpcyByZWxhdGVkIHRvIG91ciBwcmVmZXJyZWQgZG9jdW1lbnRcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRpZiAoIGEgPT0gZG9jdW1lbnQgfHwgYS5vd25lckRvY3VtZW50ID09IHByZWZlcnJlZERvYyAmJlxuXHRcdFx0XHRjb250YWlucyggcHJlZmVycmVkRG9jLCBhICkgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdGlmICggYiA9PSBkb2N1bWVudCB8fCBiLm93bmVyRG9jdW1lbnQgPT0gcHJlZmVycmVkRG9jICYmXG5cdFx0XHRcdGNvbnRhaW5zKCBwcmVmZXJyZWREb2MsIGIgKSApIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1haW50YWluIG9yaWdpbmFsIG9yZGVyXG5cdFx0XHRyZXR1cm4gc29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wYXJlICYgNCA/IC0xIDogMTtcblx0fSA6XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRXhpdCBlYXJseSBpZiB0aGUgbm9kZXMgYXJlIGlkZW50aWNhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHR2YXIgY3VyLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRhdXAgPSBhLnBhcmVudE5vZGUsXG5cdFx0XHRidXAgPSBiLnBhcmVudE5vZGUsXG5cdFx0XHRhcCA9IFsgYSBdLFxuXHRcdFx0YnAgPSBbIGIgXTtcblxuXHRcdC8vIFBhcmVudGxlc3Mgbm9kZXMgYXJlIGVpdGhlciBkb2N1bWVudHMgb3IgZGlzY29ubmVjdGVkXG5cdFx0aWYgKCAhYXVwIHx8ICFidXAgKSB7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cblx0XHRcdHJldHVybiBhID09IGRvY3VtZW50ID8gLTEgOlxuXHRcdFx0XHRiID09IGRvY3VtZW50ID8gMSA6XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG5cdFx0XHRcdGF1cCA/IC0xIDpcblx0XHRcdFx0YnVwID8gMSA6XG5cdFx0XHRcdHNvcnRJbnB1dCA/XG5cdFx0XHRcdCggaW5kZXhPZiggc29ydElucHV0LCBhICkgLSBpbmRleE9mKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblxuXHRcdC8vIElmIHRoZSBub2RlcyBhcmUgc2libGluZ3MsIHdlIGNhbiBkbyBhIHF1aWNrIGNoZWNrXG5cdFx0fSBlbHNlIGlmICggYXVwID09PSBidXAgKSB7XG5cdFx0XHRyZXR1cm4gc2libGluZ0NoZWNrKCBhLCBiICk7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXJ3aXNlIHdlIG5lZWQgZnVsbCBsaXN0cyBvZiB0aGVpciBhbmNlc3RvcnMgZm9yIGNvbXBhcmlzb25cblx0XHRjdXIgPSBhO1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0YXAudW5zaGlmdCggY3VyICk7XG5cdFx0fVxuXHRcdGN1ciA9IGI7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRicC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cblx0XHQvLyBXYWxrIGRvd24gdGhlIHRyZWUgbG9va2luZyBmb3IgYSBkaXNjcmVwYW5jeVxuXHRcdHdoaWxlICggYXBbIGkgXSA9PT0gYnBbIGkgXSApIHtcblx0XHRcdGkrKztcblx0XHR9XG5cblx0XHRyZXR1cm4gaSA/XG5cblx0XHRcdC8vIERvIGEgc2libGluZyBjaGVjayBpZiB0aGUgbm9kZXMgaGF2ZSBhIGNvbW1vbiBhbmNlc3RvclxuXHRcdFx0c2libGluZ0NoZWNrKCBhcFsgaSBdLCBicFsgaSBdICkgOlxuXG5cdFx0XHQvLyBPdGhlcndpc2Ugbm9kZXMgaW4gb3VyIGRvY3VtZW50IHNvcnQgZmlyc3Rcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cblx0XHRcdGFwWyBpIF0gPT0gcHJlZmVycmVkRG9jID8gLTEgOlxuXHRcdFx0YnBbIGkgXSA9PSBwcmVmZXJyZWREb2MgPyAxIDpcblx0XHRcdC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG5cdFx0XHQwO1xuXHR9O1xuXG5cdHJldHVybiBkb2N1bWVudDtcbn07XG5cblNpenpsZS5tYXRjaGVzID0gZnVuY3Rpb24oIGV4cHIsIGVsZW1lbnRzICkge1xuXHRyZXR1cm4gU2l6emxlKCBleHByLCBudWxsLCBudWxsLCBlbGVtZW50cyApO1xufTtcblxuU2l6emxlLm1hdGNoZXNTZWxlY3RvciA9IGZ1bmN0aW9uKCBlbGVtLCBleHByICkge1xuXHRzZXREb2N1bWVudCggZWxlbSApO1xuXG5cdGlmICggc3VwcG9ydC5tYXRjaGVzU2VsZWN0b3IgJiYgZG9jdW1lbnRJc0hUTUwgJiZcblx0XHQhbm9ubmF0aXZlU2VsZWN0b3JDYWNoZVsgZXhwciArIFwiIFwiIF0gJiZcblx0XHQoICFyYnVnZ3lNYXRjaGVzIHx8ICFyYnVnZ3lNYXRjaGVzLnRlc3QoIGV4cHIgKSApICYmXG5cdFx0KCAhcmJ1Z2d5UVNBICAgICB8fCAhcmJ1Z2d5UVNBLnRlc3QoIGV4cHIgKSApICkge1xuXG5cdFx0dHJ5IHtcblx0XHRcdHZhciByZXQgPSBtYXRjaGVzLmNhbGwoIGVsZW0sIGV4cHIgKTtcblxuXHRcdFx0Ly8gSUUgOSdzIG1hdGNoZXNTZWxlY3RvciByZXR1cm5zIGZhbHNlIG9uIGRpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdFx0aWYgKCByZXQgfHwgc3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCB8fFxuXG5cdFx0XHRcdC8vIEFzIHdlbGwsIGRpc2Nvbm5lY3RlZCBub2RlcyBhcmUgc2FpZCB0byBiZSBpbiBhIGRvY3VtZW50XG5cdFx0XHRcdC8vIGZyYWdtZW50IGluIElFIDlcblx0XHRcdFx0ZWxlbS5kb2N1bWVudCAmJiBlbGVtLmRvY3VtZW50Lm5vZGVUeXBlICE9PSAxMSApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9IGNhdGNoICggZSApIHtcblx0XHRcdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUoIGV4cHIsIHRydWUgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlKCBleHByLCBkb2N1bWVudCwgbnVsbCwgWyBlbGVtIF0gKS5sZW5ndGggPiAwO1xufTtcblxuU2l6emxlLmNvbnRhaW5zID0gZnVuY3Rpb24oIGNvbnRleHQsIGVsZW0gKSB7XG5cblx0Ly8gU2V0IGRvY3VtZW50IHZhcnMgaWYgbmVlZGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggKCBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dCApICE9IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdH1cblx0cmV0dXJuIGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICk7XG59O1xuXG5TaXp6bGUuYXR0ciA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKSAhPSBkb2N1bWVudCApIHtcblx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHR9XG5cblx0dmFyIGZuID0gRXhwci5hdHRySGFuZGxlWyBuYW1lLnRvTG93ZXJDYXNlKCkgXSxcblxuXHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdHZhbCA9IGZuICYmIGhhc093bi5jYWxsKCBFeHByLmF0dHJIYW5kbGUsIG5hbWUudG9Mb3dlckNhc2UoKSApID9cblx0XHRcdGZuKCBlbGVtLCBuYW1lLCAhZG9jdW1lbnRJc0hUTUwgKSA6XG5cdFx0XHR1bmRlZmluZWQ7XG5cblx0cmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkID9cblx0XHR2YWwgOlxuXHRcdHN1cHBvcnQuYXR0cmlidXRlcyB8fCAhZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKSA6XG5cdFx0XHQoIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApICkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdG51bGw7XG59O1xuXG5TaXp6bGUuZXNjYXBlID0gZnVuY3Rpb24oIHNlbCApIHtcblx0cmV0dXJuICggc2VsICsgXCJcIiApLnJlcGxhY2UoIHJjc3Nlc2NhcGUsIGZjc3Nlc2NhcGUgKTtcbn07XG5cblNpenpsZS5lcnJvciA9IGZ1bmN0aW9uKCBtc2cgKSB7XG5cdHRocm93IG5ldyBFcnJvciggXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZyApO1xufTtcblxuLyoqXG4gKiBEb2N1bWVudCBzb3J0aW5nIGFuZCByZW1vdmluZyBkdXBsaWNhdGVzXG4gKiBAcGFyYW0ge0FycmF5TGlrZX0gcmVzdWx0c1xuICovXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0Ly8gVW5sZXNzIHdlICprbm93KiB3ZSBjYW4gZGV0ZWN0IGR1cGxpY2F0ZXMsIGFzc3VtZSB0aGVpciBwcmVzZW5jZVxuXHRoYXNEdXBsaWNhdGUgPSAhc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzO1xuXHRzb3J0SW5wdXQgPSAhc3VwcG9ydC5zb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRpZiAoIGVsZW0gPT09IHJlc3VsdHNbIGkgXSApIHtcblx0XHRcdFx0aiA9IGR1cGxpY2F0ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdHJlc3VsdHMuc3BsaWNlKCBkdXBsaWNhdGVzWyBqIF0sIDEgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBDbGVhciBpbnB1dCBhZnRlciBzb3J0aW5nIHRvIHJlbGVhc2Ugb2JqZWN0c1xuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9zaXp6bGUvcHVsbC8yMjVcblx0c29ydElucHV0ID0gbnVsbDtcblxuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiBmb3IgcmV0cmlldmluZyB0aGUgdGV4dCB2YWx1ZSBvZiBhbiBhcnJheSBvZiBET00gbm9kZXNcbiAqIEBwYXJhbSB7QXJyYXl8RWxlbWVudH0gZWxlbVxuICovXG5nZXRUZXh0ID0gU2l6emxlLmdldFRleHQgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0dmFyIG5vZGUsXG5cdFx0cmV0ID0gXCJcIixcblx0XHRpID0gMCxcblx0XHRub2RlVHlwZSA9IGVsZW0ubm9kZVR5cGU7XG5cblx0aWYgKCAhbm9kZVR5cGUgKSB7XG5cblx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdHdoaWxlICggKCBub2RlID0gZWxlbVsgaSsrIF0gKSApIHtcblxuXHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSB7XG5cblx0XHQvLyBVc2UgdGV4dENvbnRlbnQgZm9yIGVsZW1lbnRzXG5cdFx0Ly8gaW5uZXJUZXh0IHVzYWdlIHJlbW92ZWQgZm9yIGNvbnNpc3RlbmN5IG9mIG5ldyBsaW5lcyAoalF1ZXJ5ICMxMTE1Mylcblx0XHRpZiAoIHR5cGVvZiBlbGVtLnRleHRDb250ZW50ID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIGVsZW0udGV4dENvbnRlbnQ7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gVHJhdmVyc2UgaXRzIGNoaWxkcmVuXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0cmV0ICs9IGdldFRleHQoIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAzIHx8IG5vZGVUeXBlID09PSA0ICkge1xuXHRcdHJldHVybiBlbGVtLm5vZGVWYWx1ZTtcblx0fVxuXG5cdC8vIERvIG5vdCBpbmNsdWRlIGNvbW1lbnQgb3IgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBub2Rlc1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5FeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblxuXHQvLyBDYW4gYmUgYWRqdXN0ZWQgYnkgdGhlIHVzZXJcblx0Y2FjaGVMZW5ndGg6IDUwLFxuXG5cdGNyZWF0ZVBzZXVkbzogbWFya0Z1bmN0aW9uLFxuXG5cdG1hdGNoOiBtYXRjaEV4cHIsXG5cblx0YXR0ckhhbmRsZToge30sXG5cblx0ZmluZDoge30sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIj5cIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiIFwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIgfSxcblx0XHRcIitcIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCJ+XCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiIH1cblx0fSxcblxuXHRwcmVGaWx0ZXI6IHtcblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0bWF0Y2hbIDEgXSA9IG1hdGNoWyAxIF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgZ2l2ZW4gdmFsdWUgdG8gbWF0Y2hbM10gd2hldGhlciBxdW90ZWQgb3IgdW5xdW90ZWRcblx0XHRcdG1hdGNoWyAzIF0gPSAoIG1hdGNoWyAzIF0gfHwgbWF0Y2hbIDQgXSB8fFxuXHRcdFx0XHRtYXRjaFsgNSBdIHx8IFwiXCIgKS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWyAyIF0gPT09IFwifj1cIiApIHtcblx0XHRcdFx0bWF0Y2hbIDMgXSA9IFwiIFwiICsgbWF0Y2hbIDMgXSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDQgKTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cblx0XHRcdC8qIG1hdGNoZXMgZnJvbSBtYXRjaEV4cHJbXCJDSElMRFwiXVxuXHRcdFx0XHQxIHR5cGUgKG9ubHl8bnRofC4uLilcblx0XHRcdFx0MiB3aGF0IChjaGlsZHxvZi10eXBlKVxuXHRcdFx0XHQzIGFyZ3VtZW50IChldmVufG9kZHxcXGQqfFxcZCpuKFsrLV1cXGQrKT98Li4uKVxuXHRcdFx0XHQ0IHhuLWNvbXBvbmVudCBvZiB4bit5IGFyZ3VtZW50IChbKy1dP1xcZCpufClcblx0XHRcdFx0NSBzaWduIG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ2IHggb2YgeG4tY29tcG9uZW50XG5cdFx0XHRcdDcgc2lnbiBvZiB5LWNvbXBvbmVudFxuXHRcdFx0XHQ4IHkgb2YgeS1jb21wb25lbnRcblx0XHRcdCovXG5cdFx0XHRtYXRjaFsgMSBdID0gbWF0Y2hbIDEgXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoIG1hdGNoWyAxIF0uc2xpY2UoIDAsIDMgKSA9PT0gXCJudGhcIiApIHtcblxuXHRcdFx0XHQvLyBudGgtKiByZXF1aXJlcyBhcmd1bWVudFxuXHRcdFx0XHRpZiAoICFtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbIDAgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbnVtZXJpYyB4IGFuZCB5IHBhcmFtZXRlcnMgZm9yIEV4cHIuZmlsdGVyLkNISUxEXG5cdFx0XHRcdC8vIHJlbWVtYmVyIHRoYXQgZmFsc2UvdHJ1ZSBjYXN0IHJlc3BlY3RpdmVseSB0byAwLzFcblx0XHRcdFx0bWF0Y2hbIDQgXSA9ICsoIG1hdGNoWyA0IF0gP1xuXHRcdFx0XHRcdG1hdGNoWyA1IF0gKyAoIG1hdGNoWyA2IF0gfHwgMSApIDpcblx0XHRcdFx0XHQyICogKCBtYXRjaFsgMyBdID09PSBcImV2ZW5cIiB8fCBtYXRjaFsgMyBdID09PSBcIm9kZFwiICkgKTtcblx0XHRcdFx0bWF0Y2hbIDUgXSA9ICsoICggbWF0Y2hbIDcgXSArIG1hdGNoWyA4IF0gKSB8fCBtYXRjaFsgMyBdID09PSBcIm9kZFwiICk7XG5cblx0XHRcdFx0Ly8gb3RoZXIgdHlwZXMgcHJvaGliaXQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWyAwIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdH0sXG5cblx0XHRcIlBTRVVET1wiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHR2YXIgZXhjZXNzLFxuXHRcdFx0XHR1bnF1b3RlZCA9ICFtYXRjaFsgNiBdICYmIG1hdGNoWyAyIF07XG5cblx0XHRcdGlmICggbWF0Y2hFeHByWyBcIkNISUxEXCIgXS50ZXN0KCBtYXRjaFsgMCBdICkgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBY2NlcHQgcXVvdGVkIGFyZ3VtZW50cyBhcy1pc1xuXHRcdFx0aWYgKCBtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRtYXRjaFsgMiBdID0gbWF0Y2hbIDQgXSB8fCBtYXRjaFsgNSBdIHx8IFwiXCI7XG5cblx0XHRcdC8vIFN0cmlwIGV4Y2VzcyBjaGFyYWN0ZXJzIGZyb20gdW5xdW90ZWQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCB1bnF1b3RlZCAmJiBycHNldWRvLnRlc3QoIHVucXVvdGVkICkgJiZcblxuXHRcdFx0XHQvLyBHZXQgZXhjZXNzIGZyb20gdG9rZW5pemUgKHJlY3Vyc2l2ZWx5KVxuXHRcdFx0XHQoIGV4Y2VzcyA9IHRva2VuaXplKCB1bnF1b3RlZCwgdHJ1ZSApICkgJiZcblxuXHRcdFx0XHQvLyBhZHZhbmNlIHRvIHRoZSBuZXh0IGNsb3NpbmcgcGFyZW50aGVzaXNcblx0XHRcdFx0KCBleGNlc3MgPSB1bnF1b3RlZC5pbmRleE9mKCBcIilcIiwgdW5xdW90ZWQubGVuZ3RoIC0gZXhjZXNzICkgLSB1bnF1b3RlZC5sZW5ndGggKSApIHtcblxuXHRcdFx0XHQvLyBleGNlc3MgaXMgYSBuZWdhdGl2ZSBpbmRleFxuXHRcdFx0XHRtYXRjaFsgMCBdID0gbWF0Y2hbIDAgXS5zbGljZSggMCwgZXhjZXNzICk7XG5cdFx0XHRcdG1hdGNoWyAyIF0gPSB1bnF1b3RlZC5zbGljZSggMCwgZXhjZXNzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJldHVybiBvbmx5IGNhcHR1cmVzIG5lZWRlZCBieSB0aGUgcHNldWRvIGZpbHRlciBtZXRob2QgKHR5cGUgYW5kIGFyZ3VtZW50KVxuXHRcdFx0cmV0dXJuIG1hdGNoLnNsaWNlKCAwLCAzICk7XG5cdFx0fVxuXHR9LFxuXG5cdGZpbHRlcjoge1xuXG5cdFx0XCJUQUdcIjogZnVuY3Rpb24oIG5vZGVOYW1lU2VsZWN0b3IgKSB7XG5cdFx0XHR2YXIgbm9kZU5hbWUgPSBub2RlTmFtZVNlbGVjdG9yLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBub2RlTmFtZVNlbGVjdG9yID09PSBcIipcIiA/XG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZTtcblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDTEFTU1wiOiBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdFx0dmFyIHBhdHRlcm4gPSBjbGFzc0NhY2hlWyBjbGFzc05hbWUgKyBcIiBcIiBdO1xuXG5cdFx0XHRyZXR1cm4gcGF0dGVybiB8fFxuXHRcdFx0XHQoIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCBcIihefFwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcdFx0XCIpXCIgKyBjbGFzc05hbWUgKyBcIihcIiArIHdoaXRlc3BhY2UgKyBcInwkKVwiICkgKSAmJiBjbGFzc0NhY2hlKFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdChcblx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgZWxlbS5jbGFzc05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWxlbS5jbGFzc05hbWUgfHxcblx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBcImNsYXNzXCIgKSB8fFxuXHRcdFx0XHRcdFx0XHRcdFwiXCJcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG5hbWUsIG9wZXJhdG9yLCBjaGVjayApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFNpenpsZS5hdHRyKCBlbGVtLCBuYW1lICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiIT1cIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoICFvcGVyYXRvciApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdCArPSBcIlwiO1xuXG5cdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuXHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiPVwiID8gcmVzdWx0ID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiIT1cIiA/IHJlc3VsdCAhPT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIl49XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA9PT0gMCA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiKj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiQ9XCIgPyBjaGVjayAmJiByZXN1bHQuc2xpY2UoIC1jaGVjay5sZW5ndGggKSA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIn49XCIgPyAoIFwiIFwiICsgcmVzdWx0LnJlcGxhY2UoIHJ3aGl0ZXNwYWNlLCBcIiBcIiApICsgXCIgXCIgKS5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcInw9XCIgPyByZXN1bHQgPT09IGNoZWNrIHx8IHJlc3VsdC5zbGljZSggMCwgY2hlY2subGVuZ3RoICsgMSApID09PSBjaGVjayArIFwiLVwiIDpcblx0XHRcdFx0XHRmYWxzZTtcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIHR5cGUsIHdoYXQsIF9hcmd1bWVudCwgZmlyc3QsIGxhc3QgKSB7XG5cdFx0XHR2YXIgc2ltcGxlID0gdHlwZS5zbGljZSggMCwgMyApICE9PSBcIm50aFwiLFxuXHRcdFx0XHRmb3J3YXJkID0gdHlwZS5zbGljZSggLTQgKSAhPT0gXCJsYXN0XCIsXG5cdFx0XHRcdG9mVHlwZSA9IHdoYXQgPT09IFwib2YtdHlwZVwiO1xuXG5cdFx0XHRyZXR1cm4gZmlyc3QgPT09IDEgJiYgbGFzdCA9PT0gMCA/XG5cblx0XHRcdFx0Ly8gU2hvcnRjdXQgZm9yIDpudGgtKihuKVxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gISFlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdH0gOlxuXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdHZhciBjYWNoZSwgdW5pcXVlQ2FjaGUsIG91dGVyQ2FjaGUsIG5vZGUsIG5vZGVJbmRleCwgc3RhcnQsXG5cdFx0XHRcdFx0XHRkaXIgPSBzaW1wbGUgIT09IGZvcndhcmQgPyBcIm5leHRTaWJsaW5nXCIgOiBcInByZXZpb3VzU2libGluZ1wiLFxuXHRcdFx0XHRcdFx0cGFyZW50ID0gZWxlbS5wYXJlbnROb2RlLFxuXHRcdFx0XHRcdFx0bmFtZSA9IG9mVHlwZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHR1c2VDYWNoZSA9ICF4bWwgJiYgIW9mVHlwZSxcblx0XHRcdFx0XHRcdGRpZmYgPSBmYWxzZTtcblxuXHRcdFx0XHRcdGlmICggcGFyZW50ICkge1xuXG5cdFx0XHRcdFx0XHQvLyA6KGZpcnN0fGxhc3R8b25seSktKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdFx0XHRpZiAoIHNpbXBsZSApIHtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCBkaXIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSBub2RlWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBSZXZlcnNlIGRpcmVjdGlvbiBmb3IgOm9ubHktKiAoaWYgd2UgaGF2ZW4ndCB5ZXQgZG9uZSBzbylcblx0XHRcdFx0XHRcdFx0XHRzdGFydCA9IGRpciA9IHR5cGUgPT09IFwib25seVwiICYmICFzdGFydCAmJiBcIm5leHRTaWJsaW5nXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN0YXJ0ID0gWyBmb3J3YXJkID8gcGFyZW50LmZpcnN0Q2hpbGQgOiBwYXJlbnQubGFzdENoaWxkIF07XG5cblx0XHRcdFx0XHRcdC8vIG5vbi14bWwgOm50aC1jaGlsZCguLi4pIHN0b3JlcyBjYWNoZSBkYXRhIG9uIGBwYXJlbnRgXG5cdFx0XHRcdFx0XHRpZiAoIGZvcndhcmQgJiYgdXNlQ2FjaGUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2VlayBgZWxlbWAgZnJvbSBhIHByZXZpb3VzbHktY2FjaGVkIGluZGV4XG5cblx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRub2RlID0gcGFyZW50O1xuXHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8ICggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleCAmJiBjYWNoZVsgMiBdO1xuXHRcdFx0XHRcdFx0XHRub2RlID0gbm9kZUluZGV4ICYmIHBhcmVudC5jaGlsZE5vZGVzWyBub2RlSW5kZXggXTtcblxuXHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEZhbGxiYWNrIHRvIHNlZWtpbmcgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0KCBkaWZmID0gbm9kZUluZGV4ID0gMCApIHx8IHN0YXJ0LnBvcCgpICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBXaGVuIGZvdW5kLCBjYWNoZSBpbmRleGVzIG9uIGBwYXJlbnRgIGFuZCBicmVha1xuXHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiArK2RpZmYgJiYgbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyB0eXBlIF0gPSBbIGRpcnJ1bnMsIG5vZGVJbmRleCwgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVXNlIHByZXZpb3VzbHktY2FjaGVkIGVsZW1lbnQgaW5kZXggaWYgYXZhaWxhYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyAuLi5pbiBhIGd6aXAtZnJpZW5kbHkgd2F5XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIHhtbCA6bnRoLWNoaWxkKC4uLilcblx0XHRcdFx0XHRcdFx0Ly8gb3IgOm50aC1sYXN0LWNoaWxkKC4uLikgb3IgOm50aCgtbGFzdCk/LW9mLXR5cGUoLi4uKVxuXHRcdFx0XHRcdFx0XHRpZiAoIGRpZmYgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXNlIHRoZSBzYW1lIGxvb3AgYXMgYWJvdmUgdG8gc2VlayBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdCggZGlmZiA9IG5vZGVJbmRleCA9IDAgKSB8fCBzdGFydC5wb3AoKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsrZGlmZiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDYWNoZSB0aGUgaW5kZXggb2YgZWFjaCBlbmNvdW50ZXJlZCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsgdHlwZSBdID0gWyBkaXJydW5zLCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIG5vZGUgPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSW5jb3Jwb3JhdGUgdGhlIG9mZnNldCwgdGhlbiBjaGVjayBhZ2FpbnN0IGN5Y2xlIHNpemVcblx0XHRcdFx0XHRcdGRpZmYgLT0gbGFzdDtcblx0XHRcdFx0XHRcdHJldHVybiBkaWZmID09PSBmaXJzdCB8fCAoIGRpZmYgJSBmaXJzdCA9PT0gMCAmJiBkaWZmIC8gZmlyc3QgPj0gMCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJQU0VVRE9cIjogZnVuY3Rpb24oIHBzZXVkbywgYXJndW1lbnQgKSB7XG5cblx0XHRcdC8vIHBzZXVkby1jbGFzcyBuYW1lcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZVxuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNwc2V1ZG8tY2xhc3Nlc1xuXHRcdFx0Ly8gUHJpb3JpdGl6ZSBieSBjYXNlIHNlbnNpdGl2aXR5IGluIGNhc2UgY3VzdG9tIHBzZXVkb3MgYXJlIGFkZGVkIHdpdGggdXBwZXJjYXNlIGxldHRlcnNcblx0XHRcdC8vIFJlbWVtYmVyIHRoYXQgc2V0RmlsdGVycyBpbmhlcml0cyBmcm9tIHBzZXVkb3Ncblx0XHRcdHZhciBhcmdzLFxuXHRcdFx0XHRmbiA9IEV4cHIucHNldWRvc1sgcHNldWRvIF0gfHwgRXhwci5zZXRGaWx0ZXJzWyBwc2V1ZG8udG9Mb3dlckNhc2UoKSBdIHx8XG5cdFx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIHBzZXVkbzogXCIgKyBwc2V1ZG8gKTtcblxuXHRcdFx0Ly8gVGhlIHVzZXIgbWF5IHVzZSBjcmVhdGVQc2V1ZG8gdG8gaW5kaWNhdGUgdGhhdFxuXHRcdFx0Ly8gYXJndW1lbnRzIGFyZSBuZWVkZWQgdG8gY3JlYXRlIHRoZSBmaWx0ZXIgZnVuY3Rpb25cblx0XHRcdC8vIGp1c3QgYXMgU2l6emxlIGRvZXNcblx0XHRcdGlmICggZm5bIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0cmV0dXJuIGZuKCBhcmd1bWVudCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBCdXQgbWFpbnRhaW4gc3VwcG9ydCBmb3Igb2xkIHNpZ25hdHVyZXNcblx0XHRcdGlmICggZm4ubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0YXJncyA9IFsgcHNldWRvLCBwc2V1ZG8sIFwiXCIsIGFyZ3VtZW50IF07XG5cdFx0XHRcdHJldHVybiBFeHByLnNldEZpbHRlcnMuaGFzT3duUHJvcGVydHkoIHBzZXVkby50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0XHRcdG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgaWR4LFxuXHRcdFx0XHRcdFx0XHRtYXRjaGVkID0gZm4oIHNlZWQsIGFyZ3VtZW50ICksXG5cdFx0XHRcdFx0XHRcdGkgPSBtYXRjaGVkLmxlbmd0aDtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZHggPSBpbmRleE9mKCBzZWVkLCBtYXRjaGVkWyBpIF0gKTtcblx0XHRcdFx0XHRcdFx0c2VlZFsgaWR4IF0gPSAhKCBtYXRjaGVzWyBpZHggXSA9IG1hdGNoZWRbIGkgXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKSA6XG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm4oIGVsZW0sIDAsIGFyZ3MgKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm47XG5cdFx0fVxuXHR9LFxuXG5cdHBzZXVkb3M6IHtcblxuXHRcdC8vIFBvdGVudGlhbGx5IGNvbXBsZXggcHNldWRvc1xuXHRcdFwibm90XCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXG5cdFx0XHQvLyBUcmltIHRoZSBzZWxlY3RvciBwYXNzZWQgdG8gY29tcGlsZVxuXHRcdFx0Ly8gdG8gYXZvaWQgdHJlYXRpbmcgbGVhZGluZyBhbmQgdHJhaWxpbmdcblx0XHRcdC8vIHNwYWNlcyBhcyBjb21iaW5hdG9yc1xuXHRcdFx0dmFyIGlucHV0ID0gW10sXG5cdFx0XHRcdHJlc3VsdHMgPSBbXSxcblx0XHRcdFx0bWF0Y2hlciA9IGNvbXBpbGUoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSApO1xuXG5cdFx0XHRyZXR1cm4gbWF0Y2hlclsgZXhwYW5kbyBdID9cblx0XHRcdFx0bWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcywgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0XHRcdHVubWF0Y2hlZCA9IG1hdGNoZXIoIHNlZWQsIG51bGwsIHhtbCwgW10gKSxcblx0XHRcdFx0XHRcdGkgPSBzZWVkLmxlbmd0aDtcblxuXHRcdFx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIHVubWF0Y2hlZCBieSBgbWF0Y2hlcmBcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gdW5tYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0c2VlZFsgaSBdID0gISggbWF0Y2hlc1sgaSBdID0gZWxlbSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApIDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0aW5wdXRbIDAgXSA9IGVsZW07XG5cdFx0XHRcdFx0bWF0Y2hlciggaW5wdXQsIG51bGwsIHhtbCwgcmVzdWx0cyApO1xuXG5cdFx0XHRcdFx0Ly8gRG9uJ3Qga2VlcCB0aGUgZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdFx0XHRpbnB1dFsgMCBdID0gbnVsbDtcblx0XHRcdFx0XHRyZXR1cm4gIXJlc3VsdHMucG9wKCk7XG5cdFx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0XCJoYXNcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBTaXp6bGUoIHNlbGVjdG9yLCBlbGVtICkubGVuZ3RoID4gMDtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0XCJjb250YWluc1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS50ZXh0Q29udGVudCB8fCBnZXRUZXh0KCBlbGVtICkgKS5pbmRleE9mKCB0ZXh0ICkgPiAtMTtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0Ly8gXCJXaGV0aGVyIGFuIGVsZW1lbnQgaXMgcmVwcmVzZW50ZWQgYnkgYSA6bGFuZygpIHNlbGVjdG9yXG5cdFx0Ly8gaXMgYmFzZWQgc29sZWx5IG9uIHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWVcblx0XHQvLyBiZWluZyBlcXVhbCB0byB0aGUgaWRlbnRpZmllciBDLFxuXHRcdC8vIG9yIGJlZ2lubmluZyB3aXRoIHRoZSBpZGVudGlmaWVyIEMgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgXCItXCIuXG5cdFx0Ly8gVGhlIG1hdGNoaW5nIG9mIEMgYWdhaW5zdCB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlIGlzIHBlcmZvcm1lZCBjYXNlLWluc2Vuc2l0aXZlbHkuXG5cdFx0Ly8gVGhlIGlkZW50aWZpZXIgQyBkb2VzIG5vdCBoYXZlIHRvIGJlIGEgdmFsaWQgbGFuZ3VhZ2UgbmFtZS5cIlxuXHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jbGFuZy1wc2V1ZG9cblx0XHRcImxhbmdcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggbGFuZyApIHtcblxuXHRcdFx0Ly8gbGFuZyB2YWx1ZSBtdXN0IGJlIGEgdmFsaWQgaWRlbnRpZmllclxuXHRcdFx0aWYgKCAhcmlkZW50aWZpZXIudGVzdCggbGFuZyB8fCBcIlwiICkgKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggXCJ1bnN1cHBvcnRlZCBsYW5nOiBcIiArIGxhbmcgKTtcblx0XHRcdH1cblx0XHRcdGxhbmcgPSBsYW5nLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIGVsZW1MYW5nO1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0aWYgKCAoIGVsZW1MYW5nID0gZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0XHRcdFx0ZWxlbS5sYW5nIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBcInhtbDpsYW5nXCIgKSB8fCBlbGVtLmdldEF0dHJpYnV0ZSggXCJsYW5nXCIgKSApICkge1xuXG5cdFx0XHRcdFx0XHRlbGVtTGFuZyA9IGVsZW1MYW5nLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbUxhbmcgPT09IGxhbmcgfHwgZWxlbUxhbmcuaW5kZXhPZiggbGFuZyArIFwiLVwiICkgPT09IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IHdoaWxlICggKCBlbGVtID0gZWxlbS5wYXJlbnROb2RlICkgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdC8vIE1pc2NlbGxhbmVvdXNcblx0XHRcInRhcmdldFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdFx0cmV0dXJuIGhhc2ggJiYgaGFzaC5zbGljZSggMSApID09PSBlbGVtLmlkO1xuXHRcdH0sXG5cblx0XHRcInJvb3RcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jRWxlbTtcblx0XHR9LFxuXG5cdFx0XCJmb2N1c1wiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmXG5cdFx0XHRcdCggIWRvY3VtZW50Lmhhc0ZvY3VzIHx8IGRvY3VtZW50Lmhhc0ZvY3VzKCkgKSAmJlxuXHRcdFx0XHQhISggZWxlbS50eXBlIHx8IGVsZW0uaHJlZiB8fCB+ZWxlbS50YWJJbmRleCApO1xuXHRcdH0sXG5cblx0XHQvLyBCb29sZWFuIHByb3BlcnRpZXNcblx0XHRcImVuYWJsZWRcIjogY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIGZhbHNlICksXG5cdFx0XCJkaXNhYmxlZFwiOiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggdHJ1ZSApLFxuXG5cdFx0XCJjaGVja2VkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBJbiBDU1MzLCA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIGJvdGggY2hlY2tlZCBhbmQgc2VsZWN0ZWQgZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHR2YXIgbm9kZU5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gKCBub2RlTmFtZSA9PT0gXCJpbnB1dFwiICYmICEhZWxlbS5jaGVja2VkICkgfHxcblx0XHRcdFx0KCBub2RlTmFtZSA9PT0gXCJvcHRpb25cIiAmJiAhIWVsZW0uc2VsZWN0ZWQgKTtcblx0XHR9LFxuXG5cdFx0XCJzZWxlY3RlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gQWNjZXNzaW5nIHRoaXMgcHJvcGVydHkgbWFrZXMgc2VsZWN0ZWQtYnktZGVmYXVsdFxuXHRcdFx0Ly8gb3B0aW9ucyBpbiBTYWZhcmkgd29yayBwcm9wZXJseVxuXHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0XHRcdFx0ZWxlbS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLnNlbGVjdGVkID09PSB0cnVlO1xuXHRcdH0sXG5cblx0XHQvLyBDb250ZW50c1xuXHRcdFwiZW1wdHlcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jZW1wdHktcHNldWRvXG5cdFx0XHQvLyA6ZW1wdHkgaXMgbmVnYXRlZCBieSBlbGVtZW50ICgxKSBvciBjb250ZW50IG5vZGVzICh0ZXh0OiAzOyBjZGF0YTogNDsgZW50aXR5IHJlZjogNSksXG5cdFx0XHQvLyAgIGJ1dCBub3QgYnkgb3RoZXJzIChjb21tZW50OiA4OyBwcm9jZXNzaW5nIGluc3RydWN0aW9uOiA3OyBldGMuKVxuXHRcdFx0Ly8gbm9kZVR5cGUgPCA2IHdvcmtzIGJlY2F1c2UgYXR0cmlidXRlcyAoMikgZG8gbm90IGFwcGVhciBhcyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA8IDYgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJwYXJlbnRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gIUV4cHIucHNldWRvc1sgXCJlbXB0eVwiIF0oIGVsZW0gKTtcblx0XHR9LFxuXG5cdFx0Ly8gRWxlbWVudC9pbnB1dCB0eXBlc1xuXHRcdFwiaGVhZGVyXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIHJoZWFkZXIudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHRcImlucHV0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIHJpbnB1dHMudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHRcImJ1dHRvblwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IFwiYnV0dG9uXCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIjtcblx0XHR9LFxuXG5cdFx0XCJ0ZXh0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGF0dHI7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgJiZcblx0XHRcdFx0ZWxlbS50eXBlID09PSBcInRleHRcIiAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFPDhcblx0XHRcdFx0Ly8gTmV3IEhUTUw1IGF0dHJpYnV0ZSB2YWx1ZXMgKGUuZy4sIFwic2VhcmNoXCIpIGFwcGVhciB3aXRoIGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCJcblx0XHRcdFx0KCAoIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKSApID09IG51bGwgfHxcblx0XHRcdFx0XHRhdHRyLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dFwiICk7XG5cdFx0fSxcblxuXHRcdC8vIFBvc2l0aW9uLWluLWNvbGxlY3Rpb25cblx0XHRcImZpcnN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFsgMCBdO1xuXHRcdH0gKSxcblxuXHRcdFwibGFzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggX21hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIFsgbGVuZ3RoIC0gMSBdO1xuXHRcdH0gKSxcblxuXHRcdFwiZXFcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIF9tYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gWyBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50IF07XG5cdFx0fSApLFxuXG5cdFx0XCJldmVuXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcIm9kZFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDE7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJsdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgP1xuXHRcdFx0XHRhcmd1bWVudCArIGxlbmd0aCA6XG5cdFx0XHRcdGFyZ3VtZW50ID4gbGVuZ3RoID9cblx0XHRcdFx0XHRsZW5ndGggOlxuXHRcdFx0XHRcdGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyAtLWkgPj0gMDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwiZ3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgKytpIDwgbGVuZ3RoOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApXG5cdH1cbn07XG5cbkV4cHIucHNldWRvc1sgXCJudGhcIiBdID0gRXhwci5wc2V1ZG9zWyBcImVxXCIgXTtcblxuLy8gQWRkIGJ1dHRvbi9pbnB1dCB0eXBlIHBzZXVkb3NcbmZvciAoIGkgaW4geyByYWRpbzogdHJ1ZSwgY2hlY2tib3g6IHRydWUsIGZpbGU6IHRydWUsIHBhc3N3b3JkOiB0cnVlLCBpbWFnZTogdHJ1ZSB9ICkge1xuXHRFeHByLnBzZXVkb3NbIGkgXSA9IGNyZWF0ZUlucHV0UHNldWRvKCBpICk7XG59XG5mb3IgKCBpIGluIHsgc3VibWl0OiB0cnVlLCByZXNldDogdHJ1ZSB9ICkge1xuXHRFeHByLnBzZXVkb3NbIGkgXSA9IGNyZWF0ZUJ1dHRvblBzZXVkbyggaSApO1xufVxuXG4vLyBFYXN5IEFQSSBmb3IgY3JlYXRpbmcgbmV3IHNldEZpbHRlcnNcbmZ1bmN0aW9uIHNldEZpbHRlcnMoKSB7fVxuc2V0RmlsdGVycy5wcm90b3R5cGUgPSBFeHByLmZpbHRlcnMgPSBFeHByLnBzZXVkb3M7XG5FeHByLnNldEZpbHRlcnMgPSBuZXcgc2V0RmlsdGVycygpO1xuXG50b2tlbml6ZSA9IFNpenpsZS50b2tlbml6ZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgcGFyc2VPbmx5ICkge1xuXHR2YXIgbWF0Y2hlZCwgbWF0Y2gsIHRva2VucywgdHlwZSxcblx0XHRzb0ZhciwgZ3JvdXBzLCBwcmVGaWx0ZXJzLFxuXHRcdGNhY2hlZCA9IHRva2VuQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXTtcblxuXHRpZiAoIGNhY2hlZCApIHtcblx0XHRyZXR1cm4gcGFyc2VPbmx5ID8gMCA6IGNhY2hlZC5zbGljZSggMCApO1xuXHR9XG5cblx0c29GYXIgPSBzZWxlY3Rvcjtcblx0Z3JvdXBzID0gW107XG5cdHByZUZpbHRlcnMgPSBFeHByLnByZUZpbHRlcjtcblxuXHR3aGlsZSAoIHNvRmFyICkge1xuXG5cdFx0Ly8gQ29tbWEgYW5kIGZpcnN0IHJ1blxuXHRcdGlmICggIW1hdGNoZWQgfHwgKCBtYXRjaCA9IHJjb21tYS5leGVjKCBzb0ZhciApICkgKSB7XG5cdFx0XHRpZiAoIG1hdGNoICkge1xuXG5cdFx0XHRcdC8vIERvbid0IGNvbnN1bWUgdHJhaWxpbmcgY29tbWFzIGFzIHZhbGlkXG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoWyAwIF0ubGVuZ3RoICkgfHwgc29GYXI7XG5cdFx0XHR9XG5cdFx0XHRncm91cHMucHVzaCggKCB0b2tlbnMgPSBbXSApICk7XG5cdFx0fVxuXG5cdFx0bWF0Y2hlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gQ29tYmluYXRvcnNcblx0XHRpZiAoICggbWF0Y2ggPSByY29tYmluYXRvcnMuZXhlYyggc29GYXIgKSApICkge1xuXHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHR0b2tlbnMucHVzaCgge1xuXHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblxuXHRcdFx0XHQvLyBDYXN0IGRlc2NlbmRhbnQgY29tYmluYXRvcnMgdG8gc3BhY2Vcblx0XHRcdFx0dHlwZTogbWF0Y2hbIDAgXS5yZXBsYWNlKCBydHJpbSwgXCIgXCIgKVxuXHRcdFx0fSApO1xuXHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hlZC5sZW5ndGggKTtcblx0XHR9XG5cblx0XHQvLyBGaWx0ZXJzXG5cdFx0Zm9yICggdHlwZSBpbiBFeHByLmZpbHRlciApIHtcblx0XHRcdGlmICggKCBtYXRjaCA9IG1hdGNoRXhwclsgdHlwZSBdLmV4ZWMoIHNvRmFyICkgKSAmJiAoICFwcmVGaWx0ZXJzWyB0eXBlIF0gfHxcblx0XHRcdFx0KCBtYXRjaCA9IHByZUZpbHRlcnNbIHR5cGUgXSggbWF0Y2ggKSApICkgKSB7XG5cdFx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0XHR0b2tlbnMucHVzaCgge1xuXHRcdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXHRcdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdFx0bWF0Y2hlczogbWF0Y2hcblx0XHRcdFx0fSApO1xuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggIW1hdGNoZWQgKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgaW52YWxpZCBleGNlc3Ncblx0Ly8gaWYgd2UncmUganVzdCBwYXJzaW5nXG5cdC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3Igb3IgcmV0dXJuIHRva2Vuc1xuXHRyZXR1cm4gcGFyc2VPbmx5ID9cblx0XHRzb0Zhci5sZW5ndGggOlxuXHRcdHNvRmFyID9cblx0XHRcdFNpenpsZS5lcnJvciggc2VsZWN0b3IgKSA6XG5cblx0XHRcdC8vIENhY2hlIHRoZSB0b2tlbnNcblx0XHRcdHRva2VuQ2FjaGUoIHNlbGVjdG9yLCBncm91cHMgKS5zbGljZSggMCApO1xufTtcblxuZnVuY3Rpb24gdG9TZWxlY3RvciggdG9rZW5zICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRzZWxlY3RvciA9IFwiXCI7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHNlbGVjdG9yICs9IHRva2Vuc1sgaSBdLnZhbHVlO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rvcjtcbn1cblxuZnVuY3Rpb24gYWRkQ29tYmluYXRvciggbWF0Y2hlciwgY29tYmluYXRvciwgYmFzZSApIHtcblx0dmFyIGRpciA9IGNvbWJpbmF0b3IuZGlyLFxuXHRcdHNraXAgPSBjb21iaW5hdG9yLm5leHQsXG5cdFx0a2V5ID0gc2tpcCB8fCBkaXIsXG5cdFx0Y2hlY2tOb25FbGVtZW50cyA9IGJhc2UgJiYga2V5ID09PSBcInBhcmVudE5vZGVcIixcblx0XHRkb25lTmFtZSA9IGRvbmUrKztcblxuXHRyZXR1cm4gY29tYmluYXRvci5maXJzdCA/XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGNsb3Nlc3QgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IDpcblxuXHRcdC8vIENoZWNrIGFnYWluc3QgYWxsIGFuY2VzdG9yL3ByZWNlZGluZyBlbGVtZW50c1xuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgb2xkQ2FjaGUsIHVuaXF1ZUNhY2hlLCBvdXRlckNhY2hlLFxuXHRcdFx0XHRuZXdDYWNoZSA9IFsgZGlycnVucywgZG9uZU5hbWUgXTtcblxuXHRcdFx0Ly8gV2UgY2FuJ3Qgc2V0IGFyYml0cmFyeSBkYXRhIG9uIFhNTCBub2Rlcywgc28gdGhleSBkb24ndCBiZW5lZml0IGZyb20gY29tYmluYXRvciBjYWNoaW5nXG5cdFx0XHRpZiAoIHhtbCApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gZWxlbVsgZXhwYW5kbyBdIHx8ICggZWxlbVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdGlmICggc2tpcCAmJiBza2lwID09PSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW0gPSBlbGVtWyBkaXIgXSB8fCBlbGVtO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggKCBvbGRDYWNoZSA9IHVuaXF1ZUNhY2hlWyBrZXkgXSApICYmXG5cdFx0XHRcdFx0XHRcdG9sZENhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgb2xkQ2FjaGVbIDEgXSA9PT0gZG9uZU5hbWUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQXNzaWduIHRvIG5ld0NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0cmV0dXJuICggbmV3Q2FjaGVbIDIgXSA9IG9sZENhY2hlWyAyIF0gKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmV1c2UgbmV3Y2FjaGUgc28gcmVzdWx0cyBiYWNrLXByb3BhZ2F0ZSB0byBwcmV2aW91cyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsga2V5IF0gPSBuZXdDYWNoZTtcblxuXHRcdFx0XHRcdFx0XHQvLyBBIG1hdGNoIG1lYW5zIHdlJ3JlIGRvbmU7IGEgZmFpbCBtZWFucyB3ZSBoYXZlIHRvIGtlZXAgY2hlY2tpbmdcblx0XHRcdFx0XHRcdFx0aWYgKCAoIG5ld0NhY2hlWyAyIF0gPSBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICkge1xuXHRyZXR1cm4gbWF0Y2hlcnMubGVuZ3RoID4gMSA/XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBpID0gbWF0Y2hlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggIW1hdGNoZXJzWyBpIF0oIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSA6XG5cdFx0bWF0Y2hlcnNbIDAgXTtcbn1cblxuZnVuY3Rpb24gbXVsdGlwbGVDb250ZXh0cyggc2VsZWN0b3IsIGNvbnRleHRzLCByZXN1bHRzICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gY29udGV4dHMubGVuZ3RoO1xuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRTaXp6bGUoIHNlbGVjdG9yLCBjb250ZXh0c1sgaSBdLCByZXN1bHRzICk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGNvbmRlbnNlKCB1bm1hdGNoZWQsIG1hcCwgZmlsdGVyLCBjb250ZXh0LCB4bWwgKSB7XG5cdHZhciBlbGVtLFxuXHRcdG5ld1VubWF0Y2hlZCA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGxlbiA9IHVubWF0Y2hlZC5sZW5ndGgsXG5cdFx0bWFwcGVkID0gbWFwICE9IG51bGw7XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoIGVsZW0gPSB1bm1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0aWYgKCAhZmlsdGVyIHx8IGZpbHRlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdG5ld1VubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdGlmICggbWFwcGVkICkge1xuXHRcdFx0XHRcdG1hcC5wdXNoKCBpICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbmV3VW5tYXRjaGVkO1xufVxuXG5mdW5jdGlvbiBzZXRNYXRjaGVyKCBwcmVGaWx0ZXIsIHNlbGVjdG9yLCBtYXRjaGVyLCBwb3N0RmlsdGVyLCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKSB7XG5cdGlmICggcG9zdEZpbHRlciAmJiAhcG9zdEZpbHRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaWx0ZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmlsdGVyICk7XG5cdH1cblx0aWYgKCBwb3N0RmluZGVyICYmICFwb3N0RmluZGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbmRlciA9IHNldE1hdGNoZXIoIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApO1xuXHR9XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCByZXN1bHRzLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0dmFyIHRlbXAsIGksIGVsZW0sXG5cdFx0XHRwcmVNYXAgPSBbXSxcblx0XHRcdHBvc3RNYXAgPSBbXSxcblx0XHRcdHByZWV4aXN0aW5nID0gcmVzdWx0cy5sZW5ndGgsXG5cblx0XHRcdC8vIEdldCBpbml0aWFsIGVsZW1lbnRzIGZyb20gc2VlZCBvciBjb250ZXh0XG5cdFx0XHRlbGVtcyA9IHNlZWQgfHwgbXVsdGlwbGVDb250ZXh0cyhcblx0XHRcdFx0c2VsZWN0b3IgfHwgXCIqXCIsXG5cdFx0XHRcdGNvbnRleHQubm9kZVR5cGUgPyBbIGNvbnRleHQgXSA6IGNvbnRleHQsXG5cdFx0XHRcdFtdXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBQcmVmaWx0ZXIgdG8gZ2V0IG1hdGNoZXIgaW5wdXQsIHByZXNlcnZpbmcgYSBtYXAgZm9yIHNlZWQtcmVzdWx0cyBzeW5jaHJvbml6YXRpb25cblx0XHRcdG1hdGNoZXJJbiA9IHByZUZpbHRlciAmJiAoIHNlZWQgfHwgIXNlbGVjdG9yICkgP1xuXHRcdFx0XHRjb25kZW5zZSggZWxlbXMsIHByZU1hcCwgcHJlRmlsdGVyLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdGVsZW1zLFxuXG5cdFx0XHRtYXRjaGVyT3V0ID0gbWF0Y2hlciA/XG5cblx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBhIHBvc3RGaW5kZXIsIG9yIGZpbHRlcmVkIHNlZWQsIG9yIG5vbi1zZWVkIHBvc3RGaWx0ZXIgb3IgcHJlZXhpc3RpbmcgcmVzdWx0cyxcblx0XHRcdFx0cG9zdEZpbmRlciB8fCAoIHNlZWQgPyBwcmVGaWx0ZXIgOiBwcmVleGlzdGluZyB8fCBwb3N0RmlsdGVyICkgP1xuXG5cdFx0XHRcdFx0Ly8gLi4uaW50ZXJtZWRpYXRlIHByb2Nlc3NpbmcgaXMgbmVjZXNzYXJ5XG5cdFx0XHRcdFx0W10gOlxuXG5cdFx0XHRcdFx0Ly8gLi4ub3RoZXJ3aXNlIHVzZSByZXN1bHRzIGRpcmVjdGx5XG5cdFx0XHRcdFx0cmVzdWx0cyA6XG5cdFx0XHRcdG1hdGNoZXJJbjtcblxuXHRcdC8vIEZpbmQgcHJpbWFyeSBtYXRjaGVzXG5cdFx0aWYgKCBtYXRjaGVyICkge1xuXHRcdFx0bWF0Y2hlciggbWF0Y2hlckluLCBtYXRjaGVyT3V0LCBjb250ZXh0LCB4bWwgKTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSBwb3N0RmlsdGVyXG5cdFx0aWYgKCBwb3N0RmlsdGVyICkge1xuXHRcdFx0dGVtcCA9IGNvbmRlbnNlKCBtYXRjaGVyT3V0LCBwb3N0TWFwICk7XG5cdFx0XHRwb3N0RmlsdGVyKCB0ZW1wLCBbXSwgY29udGV4dCwgeG1sICk7XG5cblx0XHRcdC8vIFVuLW1hdGNoIGZhaWxpbmcgZWxlbWVudHMgYnkgbW92aW5nIHRoZW0gYmFjayB0byBtYXRjaGVySW5cblx0XHRcdGkgPSB0ZW1wLmxlbmd0aDtcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoICggZWxlbSA9IHRlbXBbIGkgXSApICkge1xuXHRcdFx0XHRcdG1hdGNoZXJPdXRbIHBvc3RNYXBbIGkgXSBdID0gISggbWF0Y2hlckluWyBwb3N0TWFwWyBpIF0gXSA9IGVsZW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggc2VlZCApIHtcblx0XHRcdGlmICggcG9zdEZpbmRlciB8fCBwcmVGaWx0ZXIgKSB7XG5cdFx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIEdldCB0aGUgZmluYWwgbWF0Y2hlck91dCBieSBjb25kZW5zaW5nIHRoaXMgaW50ZXJtZWRpYXRlIGludG8gcG9zdEZpbmRlciBjb250ZXh0c1xuXHRcdFx0XHRcdHRlbXAgPSBbXTtcblx0XHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IG1hdGNoZXJPdXRbIGkgXSApICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJlc3RvcmUgbWF0Y2hlckluIHNpbmNlIGVsZW0gaXMgbm90IHlldCBhIGZpbmFsIG1hdGNoXG5cdFx0XHRcdFx0XHRcdHRlbXAucHVzaCggKCBtYXRjaGVySW5bIGkgXSA9IGVsZW0gKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCAoIG1hdGNoZXJPdXQgPSBbXSApLCB0ZW1wLCB4bWwgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE1vdmUgbWF0Y2hlZCBlbGVtZW50cyBmcm9tIHNlZWQgdG8gcmVzdWx0cyB0byBrZWVwIHRoZW0gc3luY2hyb25pemVkXG5cdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBtYXRjaGVyT3V0WyBpIF0gKSAmJlxuXHRcdFx0XHRcdFx0KCB0ZW1wID0gcG9zdEZpbmRlciA/IGluZGV4T2YoIHNlZWQsIGVsZW0gKSA6IHByZU1hcFsgaSBdICkgPiAtMSApIHtcblxuXHRcdFx0XHRcdFx0c2VlZFsgdGVtcCBdID0gISggcmVzdWx0c1sgdGVtcCBdID0gZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Ly8gQWRkIGVsZW1lbnRzIHRvIHJlc3VsdHMsIHRocm91Z2ggcG9zdEZpbmRlciBpZiBkZWZpbmVkXG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXJPdXQgPSBjb25kZW5zZShcblx0XHRcdFx0bWF0Y2hlck91dCA9PT0gcmVzdWx0cyA/XG5cdFx0XHRcdFx0bWF0Y2hlck91dC5zcGxpY2UoIHByZWV4aXN0aW5nLCBtYXRjaGVyT3V0Lmxlbmd0aCApIDpcblx0XHRcdFx0XHRtYXRjaGVyT3V0XG5cdFx0XHQpO1xuXHRcdFx0aWYgKCBwb3N0RmluZGVyICkge1xuXHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCByZXN1bHRzLCBtYXRjaGVyT3V0LCB4bWwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIG1hdGNoZXJPdXQgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Ub2tlbnMoIHRva2VucyApIHtcblx0dmFyIGNoZWNrQ29udGV4dCwgbWF0Y2hlciwgaixcblx0XHRsZW4gPSB0b2tlbnMubGVuZ3RoLFxuXHRcdGxlYWRpbmdSZWxhdGl2ZSA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgMCBdLnR5cGUgXSxcblx0XHRpbXBsaWNpdFJlbGF0aXZlID0gbGVhZGluZ1JlbGF0aXZlIHx8IEV4cHIucmVsYXRpdmVbIFwiIFwiIF0sXG5cdFx0aSA9IGxlYWRpbmdSZWxhdGl2ZSA/IDEgOiAwLFxuXG5cdFx0Ly8gVGhlIGZvdW5kYXRpb25hbCBtYXRjaGVyIGVuc3VyZXMgdGhhdCBlbGVtZW50cyBhcmUgcmVhY2hhYmxlIGZyb20gdG9wLWxldmVsIGNvbnRleHQocylcblx0XHRtYXRjaENvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBjaGVja0NvbnRleHQ7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoQW55Q29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YoIGNoZWNrQ29udGV4dCwgZWxlbSApID4gLTE7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoZXJzID0gWyBmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIHJldCA9ICggIWxlYWRpbmdSZWxhdGl2ZSAmJiAoIHhtbCB8fCBjb250ZXh0ICE9PSBvdXRlcm1vc3RDb250ZXh0ICkgKSB8fCAoXG5cdFx0XHRcdCggY2hlY2tDb250ZXh0ID0gY29udGV4dCApLm5vZGVUeXBlID9cblx0XHRcdFx0XHRtYXRjaENvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0XHRtYXRjaEFueUNvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApICk7XG5cblx0XHRcdC8vIEF2b2lkIGhhbmdpbmcgb250byBlbGVtZW50IChpc3N1ZSAjMjk5KVxuXHRcdFx0Y2hlY2tDb250ZXh0ID0gbnVsbDtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSBdO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKCBtYXRjaGVyID0gRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyBpIF0udHlwZSBdICkgKSB7XG5cdFx0XHRtYXRjaGVycyA9IFsgYWRkQ29tYmluYXRvciggZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksIG1hdGNoZXIgKSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyID0gRXhwci5maWx0ZXJbIHRva2Vuc1sgaSBdLnR5cGUgXS5hcHBseSggbnVsbCwgdG9rZW5zWyBpIF0ubWF0Y2hlcyApO1xuXG5cdFx0XHQvLyBSZXR1cm4gc3BlY2lhbCB1cG9uIHNlZWluZyBhIHBvc2l0aW9uYWwgbWF0Y2hlclxuXHRcdFx0aWYgKCBtYXRjaGVyWyBleHBhbmRvIF0gKSB7XG5cblx0XHRcdFx0Ly8gRmluZCB0aGUgbmV4dCByZWxhdGl2ZSBvcGVyYXRvciAoaWYgYW55KSBmb3IgcHJvcGVyIGhhbmRsaW5nXG5cdFx0XHRcdGogPSArK2k7XG5cdFx0XHRcdGZvciAoIDsgaiA8IGxlbjsgaisrICkge1xuXHRcdFx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyBqIF0udHlwZSBdICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzZXRNYXRjaGVyKFxuXHRcdFx0XHRcdGkgPiAxICYmIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLFxuXHRcdFx0XHRcdGkgPiAxICYmIHRvU2VsZWN0b3IoXG5cblx0XHRcdFx0XHQvLyBJZiB0aGUgcHJlY2VkaW5nIHRva2VuIHdhcyBhIGRlc2NlbmRhbnQgY29tYmluYXRvciwgaW5zZXJ0IGFuIGltcGxpY2l0IGFueS1lbGVtZW50IGAqYFxuXHRcdFx0XHRcdHRva2Vuc1xuXHRcdFx0XHRcdFx0LnNsaWNlKCAwLCBpIC0gMSApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCB7IHZhbHVlOiB0b2tlbnNbIGkgLSAyIF0udHlwZSA9PT0gXCIgXCIgPyBcIipcIiA6IFwiXCIgfSApXG5cdFx0XHRcdFx0KS5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksXG5cdFx0XHRcdFx0bWF0Y2hlcixcblx0XHRcdFx0XHRpIDwgaiAmJiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zLnNsaWNlKCBpLCBqICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIG1hdGNoZXJGcm9tVG9rZW5zKCAoIHRva2VucyA9IHRva2Vucy5zbGljZSggaiApICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIHRvU2VsZWN0b3IoIHRva2VucyApXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVycy5wdXNoKCBtYXRjaGVyICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSB7XG5cdHZhciBieVNldCA9IHNldE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0YnlFbGVtZW50ID0gZWxlbWVudE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0c3VwZXJNYXRjaGVyID0gZnVuY3Rpb24oIHNlZWQsIGNvbnRleHQsIHhtbCwgcmVzdWx0cywgb3V0ZXJtb3N0ICkge1xuXHRcdFx0dmFyIGVsZW0sIGosIG1hdGNoZXIsXG5cdFx0XHRcdG1hdGNoZWRDb3VudCA9IDAsXG5cdFx0XHRcdGkgPSBcIjBcIixcblx0XHRcdFx0dW5tYXRjaGVkID0gc2VlZCAmJiBbXSxcblx0XHRcdFx0c2V0TWF0Y2hlZCA9IFtdLFxuXHRcdFx0XHRjb250ZXh0QmFja3VwID0gb3V0ZXJtb3N0Q29udGV4dCxcblxuXHRcdFx0XHQvLyBXZSBtdXN0IGFsd2F5cyBoYXZlIGVpdGhlciBzZWVkIGVsZW1lbnRzIG9yIG91dGVybW9zdCBjb250ZXh0XG5cdFx0XHRcdGVsZW1zID0gc2VlZCB8fCBieUVsZW1lbnQgJiYgRXhwci5maW5kWyBcIlRBR1wiIF0oIFwiKlwiLCBvdXRlcm1vc3QgKSxcblxuXHRcdFx0XHQvLyBVc2UgaW50ZWdlciBkaXJydW5zIGlmZiB0aGlzIGlzIHRoZSBvdXRlcm1vc3QgbWF0Y2hlclxuXHRcdFx0XHRkaXJydW5zVW5pcXVlID0gKCBkaXJydW5zICs9IGNvbnRleHRCYWNrdXAgPT0gbnVsbCA/IDEgOiBNYXRoLnJhbmRvbSgpIHx8IDAuMSApLFxuXHRcdFx0XHRsZW4gPSBlbGVtcy5sZW5ndGg7XG5cblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0ID09IGRvY3VtZW50IHx8IGNvbnRleHQgfHwgb3V0ZXJtb3N0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgZWxlbWVudHMgcGFzc2luZyBlbGVtZW50TWF0Y2hlcnMgZGlyZWN0bHkgdG8gcmVzdWx0c1xuXHRcdFx0Ly8gU3VwcG9ydDogSUU8OSwgU2FmYXJpXG5cdFx0XHQvLyBUb2xlcmF0ZSBOb2RlTGlzdCBwcm9wZXJ0aWVzIChJRTogXCJsZW5ndGhcIjsgU2FmYXJpOiA8bnVtYmVyPikgbWF0Y2hpbmcgZWxlbWVudHMgYnkgaWRcblx0XHRcdGZvciAoIDsgaSAhPT0gbGVuICYmICggZWxlbSA9IGVsZW1zWyBpIF0gKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggYnlFbGVtZW50ICYmIGVsZW0gKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0XHRcdGlmICggIWNvbnRleHQgJiYgZWxlbS5vd25lckRvY3VtZW50ICE9IGRvY3VtZW50ICkge1xuXHRcdFx0XHRcdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0XHRcdFx0XHRcdHhtbCA9ICFkb2N1bWVudElzSFRNTDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoZXIgPSBlbGVtZW50TWF0Y2hlcnNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQgfHwgZG9jdW1lbnQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhY2sgdW5tYXRjaGVkIGVsZW1lbnRzIGZvciBzZXQgZmlsdGVyc1xuXHRcdFx0XHRpZiAoIGJ5U2V0ICkge1xuXG5cdFx0XHRcdFx0Ly8gVGhleSB3aWxsIGhhdmUgZ29uZSB0aHJvdWdoIGFsbCBwb3NzaWJsZSBtYXRjaGVyc1xuXHRcdFx0XHRcdGlmICggKCBlbGVtID0gIW1hdGNoZXIgJiYgZWxlbSApICkge1xuXHRcdFx0XHRcdFx0bWF0Y2hlZENvdW50LS07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTGVuZ3RoZW4gdGhlIGFycmF5IGZvciBldmVyeSBlbGVtZW50LCBtYXRjaGVkIG9yIG5vdFxuXHRcdFx0XHRcdGlmICggc2VlZCApIHtcblx0XHRcdFx0XHRcdHVubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGBpYCBpcyBub3cgdGhlIGNvdW50IG9mIGVsZW1lbnRzIHZpc2l0ZWQgYWJvdmUsIGFuZCBhZGRpbmcgaXQgdG8gYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIG1ha2VzIHRoZSBsYXR0ZXIgbm9ubmVnYXRpdmUuXG5cdFx0XHRtYXRjaGVkQ291bnQgKz0gaTtcblxuXHRcdFx0Ly8gQXBwbHkgc2V0IGZpbHRlcnMgdG8gdW5tYXRjaGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBOT1RFOiBUaGlzIGNhbiBiZSBza2lwcGVkIGlmIHRoZXJlIGFyZSBubyB1bm1hdGNoZWQgZWxlbWVudHMgKGkuZS4sIGBtYXRjaGVkQ291bnRgXG5cdFx0XHQvLyBlcXVhbHMgYGlgKSwgdW5sZXNzIHdlIGRpZG4ndCB2aXNpdCBfYW55XyBlbGVtZW50cyBpbiB0aGUgYWJvdmUgbG9vcCBiZWNhdXNlIHdlIGhhdmVcblx0XHRcdC8vIG5vIGVsZW1lbnQgbWF0Y2hlcnMgYW5kIG5vIHNlZWQuXG5cdFx0XHQvLyBJbmNyZW1lbnRpbmcgYW4gaW5pdGlhbGx5LXN0cmluZyBcIjBcIiBgaWAgYWxsb3dzIGBpYCB0byByZW1haW4gYSBzdHJpbmcgb25seSBpbiB0aGF0XG5cdFx0XHQvLyBjYXNlLCB3aGljaCB3aWxsIHJlc3VsdCBpbiBhIFwiMDBcIiBgbWF0Y2hlZENvdW50YCB0aGF0IGRpZmZlcnMgZnJvbSBgaWAgYnV0IGlzIGFsc29cblx0XHRcdC8vIG51bWVyaWNhbGx5IHplcm8uXG5cdFx0XHRpZiAoIGJ5U2V0ICYmIGkgIT09IG1hdGNoZWRDb3VudCApIHtcblx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdHdoaWxlICggKCBtYXRjaGVyID0gc2V0TWF0Y2hlcnNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlciggdW5tYXRjaGVkLCBzZXRNYXRjaGVkLCBjb250ZXh0LCB4bWwgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc2VlZCApIHtcblxuXHRcdFx0XHRcdC8vIFJlaW50ZWdyYXRlIGVsZW1lbnQgbWF0Y2hlcyB0byBlbGltaW5hdGUgdGhlIG5lZWQgZm9yIHNvcnRpbmdcblx0XHRcdFx0XHRpZiAoIG1hdGNoZWRDb3VudCA+IDAgKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAhKCB1bm1hdGNoZWRbIGkgXSB8fCBzZXRNYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRzZXRNYXRjaGVkWyBpIF0gPSBwb3AuY2FsbCggcmVzdWx0cyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGlzY2FyZCBpbmRleCBwbGFjZWhvbGRlciB2YWx1ZXMgdG8gZ2V0IG9ubHkgYWN0dWFsIG1hdGNoZXNcblx0XHRcdFx0XHRzZXRNYXRjaGVkID0gY29uZGVuc2UoIHNldE1hdGNoZWQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBtYXRjaGVzIHRvIHJlc3VsdHNcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2V0TWF0Y2hlZCApO1xuXG5cdFx0XHRcdC8vIFNlZWRsZXNzIHNldCBtYXRjaGVzIHN1Y2NlZWRpbmcgbXVsdGlwbGUgc3VjY2Vzc2Z1bCBtYXRjaGVycyBzdGlwdWxhdGUgc29ydGluZ1xuXHRcdFx0XHRpZiAoIG91dGVybW9zdCAmJiAhc2VlZCAmJiBzZXRNYXRjaGVkLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHQoIG1hdGNoZWRDb3VudCArIHNldE1hdGNoZXJzLmxlbmd0aCApID4gMSApIHtcblxuXHRcdFx0XHRcdFNpenpsZS51bmlxdWVTb3J0KCByZXN1bHRzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3ZlcnJpZGUgbWFuaXB1bGF0aW9uIG9mIGdsb2JhbHMgYnkgbmVzdGVkIG1hdGNoZXJzXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0QmFja3VwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5tYXRjaGVkO1xuXHRcdH07XG5cblx0cmV0dXJuIGJ5U2V0ID9cblx0XHRtYXJrRnVuY3Rpb24oIHN1cGVyTWF0Y2hlciApIDpcblx0XHRzdXBlck1hdGNoZXI7XG59XG5cbmNvbXBpbGUgPSBTaXp6bGUuY29tcGlsZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgbWF0Y2ggLyogSW50ZXJuYWwgVXNlIE9ubHkgKi8gKSB7XG5cdHZhciBpLFxuXHRcdHNldE1hdGNoZXJzID0gW10sXG5cdFx0ZWxlbWVudE1hdGNoZXJzID0gW10sXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggIWNhY2hlZCApIHtcblxuXHRcdC8vIEdlbmVyYXRlIGEgZnVuY3Rpb24gb2YgcmVjdXJzaXZlIGZ1bmN0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvIGNoZWNrIGVhY2ggZWxlbWVudFxuXHRcdGlmICggIW1hdGNoICkge1xuXHRcdFx0bWF0Y2ggPSB0b2tlbml6ZSggc2VsZWN0b3IgKTtcblx0XHR9XG5cdFx0aSA9IG1hdGNoLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdGNhY2hlZCA9IG1hdGNoZXJGcm9tVG9rZW5zKCBtYXRjaFsgaSBdICk7XG5cdFx0XHRpZiAoIGNhY2hlZFsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRzZXRNYXRjaGVycy5wdXNoKCBjYWNoZWQgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnRNYXRjaGVycy5wdXNoKCBjYWNoZWQgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWNoZSB0aGUgY29tcGlsZWQgZnVuY3Rpb25cblx0XHRjYWNoZWQgPSBjb21waWxlckNhY2hlKFxuXHRcdFx0c2VsZWN0b3IsXG5cdFx0XHRtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKVxuXHRcdCk7XG5cblx0XHQvLyBTYXZlIHNlbGVjdG9yIGFuZCB0b2tlbml6YXRpb25cblx0XHRjYWNoZWQuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0fVxuXHRyZXR1cm4gY2FjaGVkO1xufTtcblxuLyoqXG4gKiBBIGxvdy1sZXZlbCBzZWxlY3Rpb24gZnVuY3Rpb24gdGhhdCB3b3JrcyB3aXRoIFNpenpsZSdzIGNvbXBpbGVkXG4gKiAgc2VsZWN0b3IgZnVuY3Rpb25zXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gc2VsZWN0b3IgQSBzZWxlY3RvciBvciBhIHByZS1jb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uIGJ1aWx0IHdpdGggU2l6emxlLmNvbXBpbGVcbiAqIEBwYXJhbSB7RWxlbWVudH0gY29udGV4dFxuICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdHNdXG4gKiBAcGFyYW0ge0FycmF5fSBbc2VlZF0gQSBzZXQgb2YgZWxlbWVudHMgdG8gbWF0Y2ggYWdhaW5zdFxuICovXG5zZWxlY3QgPSBTaXp6bGUuc2VsZWN0ID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHR2YXIgaSwgdG9rZW5zLCB0b2tlbiwgdHlwZSwgZmluZCxcblx0XHRjb21waWxlZCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiICYmIHNlbGVjdG9yLFxuXHRcdG1hdGNoID0gIXNlZWQgJiYgdG9rZW5pemUoICggc2VsZWN0b3IgPSBjb21waWxlZC5zZWxlY3RvciB8fCBzZWxlY3RvciApICk7XG5cblx0cmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0Ly8gVHJ5IHRvIG1pbmltaXplIG9wZXJhdGlvbnMgaWYgdGhlcmUgaXMgb25seSBvbmUgc2VsZWN0b3IgaW4gdGhlIGxpc3QgYW5kIG5vIHNlZWRcblx0Ly8gKHRoZSBsYXR0ZXIgb2Ygd2hpY2ggZ3VhcmFudGVlcyB1cyBjb250ZXh0KVxuXHRpZiAoIG1hdGNoLmxlbmd0aCA9PT0gMSApIHtcblxuXHRcdC8vIFJlZHVjZSBjb250ZXh0IGlmIHRoZSBsZWFkaW5nIGNvbXBvdW5kIHNlbGVjdG9yIGlzIGFuIElEXG5cdFx0dG9rZW5zID0gbWF0Y2hbIDAgXSA9IG1hdGNoWyAwIF0uc2xpY2UoIDAgKTtcblx0XHRpZiAoIHRva2Vucy5sZW5ndGggPiAyICYmICggdG9rZW4gPSB0b2tlbnNbIDAgXSApLnR5cGUgPT09IFwiSURcIiAmJlxuXHRcdFx0Y29udGV4dC5ub2RlVHlwZSA9PT0gOSAmJiBkb2N1bWVudElzSFRNTCAmJiBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIDEgXS50eXBlIF0gKSB7XG5cblx0XHRcdGNvbnRleHQgPSAoIEV4cHIuZmluZFsgXCJJRFwiIF0oIHRva2VuLm1hdGNoZXNbIDAgXVxuXHRcdFx0XHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSwgY29udGV4dCApIHx8IFtdIClbIDAgXTtcblx0XHRcdGlmICggIWNvbnRleHQgKSB7XG5cdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHQvLyBQcmVjb21waWxlZCBtYXRjaGVycyB3aWxsIHN0aWxsIHZlcmlmeSBhbmNlc3RyeSwgc28gc3RlcCB1cCBhIGxldmVsXG5cdFx0XHR9IGVsc2UgaWYgKCBjb21waWxlZCApIHtcblx0XHRcdFx0Y29udGV4dCA9IGNvbnRleHQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zbGljZSggdG9rZW5zLnNoaWZ0KCkudmFsdWUubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmV0Y2ggYSBzZWVkIHNldCBmb3IgcmlnaHQtdG8tbGVmdCBtYXRjaGluZ1xuXHRcdGkgPSBtYXRjaEV4cHJbIFwibmVlZHNDb250ZXh0XCIgXS50ZXN0KCBzZWxlY3RvciApID8gMCA6IHRva2Vucy5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHR0b2tlbiA9IHRva2Vuc1sgaSBdO1xuXG5cdFx0XHQvLyBBYm9ydCBpZiB3ZSBoaXQgYSBjb21iaW5hdG9yXG5cdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbICggdHlwZSA9IHRva2VuLnR5cGUgKSBdICkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmICggKCBmaW5kID0gRXhwci5maW5kWyB0eXBlIF0gKSApIHtcblxuXHRcdFx0XHQvLyBTZWFyY2gsIGV4cGFuZGluZyBjb250ZXh0IGZvciBsZWFkaW5nIHNpYmxpbmcgY29tYmluYXRvcnNcblx0XHRcdFx0aWYgKCAoIHNlZWQgPSBmaW5kKFxuXHRcdFx0XHRcdHRva2VuLm1hdGNoZXNbIDAgXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLFxuXHRcdFx0XHRcdHJzaWJsaW5nLnRlc3QoIHRva2Vuc1sgMCBdLnR5cGUgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHRcblx0XHRcdFx0KSApICkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgc2VlZCBpcyBlbXB0eSBvciBubyB0b2tlbnMgcmVtYWluLCB3ZSBjYW4gcmV0dXJuIGVhcmx5XG5cdFx0XHRcdFx0dG9rZW5zLnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdHNlbGVjdG9yID0gc2VlZC5sZW5ndGggJiYgdG9TZWxlY3RvciggdG9rZW5zICk7XG5cdFx0XHRcdFx0aWYgKCAhc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBzZWVkICk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENvbXBpbGUgYW5kIGV4ZWN1dGUgYSBmaWx0ZXJpbmcgZnVuY3Rpb24gaWYgb25lIGlzIG5vdCBwcm92aWRlZFxuXHQvLyBQcm92aWRlIGBtYXRjaGAgdG8gYXZvaWQgcmV0b2tlbml6YXRpb24gaWYgd2UgbW9kaWZpZWQgdGhlIHNlbGVjdG9yIGFib3ZlXG5cdCggY29tcGlsZWQgfHwgY29tcGlsZSggc2VsZWN0b3IsIG1hdGNoICkgKShcblx0XHRzZWVkLFxuXHRcdGNvbnRleHQsXG5cdFx0IWRvY3VtZW50SXNIVE1MLFxuXHRcdHJlc3VsdHMsXG5cdFx0IWNvbnRleHQgfHwgcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHwgY29udGV4dFxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbi8vIE9uZS10aW1lIGFzc2lnbm1lbnRzXG5cbi8vIFNvcnQgc3RhYmlsaXR5XG5zdXBwb3J0LnNvcnRTdGFibGUgPSBleHBhbmRvLnNwbGl0KCBcIlwiICkuc29ydCggc29ydE9yZGVyICkuam9pbiggXCJcIiApID09PSBleHBhbmRvO1xuXG4vLyBTdXBwb3J0OiBDaHJvbWUgMTQtMzUrXG4vLyBBbHdheXMgYXNzdW1lIGR1cGxpY2F0ZXMgaWYgdGhleSBhcmVuJ3QgcGFzc2VkIHRvIHRoZSBjb21wYXJpc29uIGZ1bmN0aW9uXG5zdXBwb3J0LmRldGVjdER1cGxpY2F0ZXMgPSAhIWhhc0R1cGxpY2F0ZTtcblxuLy8gSW5pdGlhbGl6ZSBhZ2FpbnN0IHRoZSBkZWZhdWx0IGRvY3VtZW50XG5zZXREb2N1bWVudCgpO1xuXG4vLyBTdXBwb3J0OiBXZWJraXQ8NTM3LjMyIC0gU2FmYXJpIDYuMC4zL0Nocm9tZSAyNSAoZml4ZWQgaW4gQ2hyb21lIDI3KVxuLy8gRGV0YWNoZWQgbm9kZXMgY29uZm91bmRpbmdseSBmb2xsb3cgKmVhY2ggb3RoZXIqXG5zdXBwb3J0LnNvcnREZXRhY2hlZCA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdC8vIFNob3VsZCByZXR1cm4gMSwgYnV0IHJldHVybnMgNCAoZm9sbG93aW5nKVxuXHRyZXR1cm4gZWwuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZmllbGRzZXRcIiApICkgJiAxO1xufSApO1xuXG4vLyBTdXBwb3J0OiBJRTw4XG4vLyBQcmV2ZW50IGF0dHJpYnV0ZS9wcm9wZXJ0eSBcImludGVycG9sYXRpb25cIlxuLy8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNjQyOSUyOFZTLjg1JTI5LmFzcHhcbmlmICggIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRlbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCBcImhyZWZcIiApID09PSBcIiNcIjtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBcInR5cGV8aHJlZnxoZWlnaHR8d2lkdGhcIiwgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdGlmICggIWlzWE1MICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lLCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidHlwZVwiID8gMSA6IDIgKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGRlZmF1bHRWYWx1ZSBpbiBwbGFjZSBvZiBnZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKVxuaWYgKCAhc3VwcG9ydC5hdHRyaWJ1dGVzIHx8ICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0ZWwuaW5uZXJIVE1MID0gXCI8aW5wdXQvPlwiO1xuXHRlbC5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBcIlwiICk7XG5cdHJldHVybiBlbC5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiICkgPT09IFwiXCI7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggXCJ2YWx1ZVwiLCBmdW5jdGlvbiggZWxlbSwgX25hbWUsIGlzWE1MICkge1xuXHRcdGlmICggIWlzWE1MICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGVmYXVsdFZhbHVlO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBTdXBwb3J0OiBJRTw5XG4vLyBVc2UgZ2V0QXR0cmlidXRlTm9kZSB0byBmZXRjaCBib29sZWFucyB3aGVuIGdldEF0dHJpYnV0ZSBsaWVzXG5pZiAoICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0cmV0dXJuIGVsLmdldEF0dHJpYnV0ZSggXCJkaXNhYmxlZFwiICkgPT0gbnVsbDtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBib29sZWFucywgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdHZhciB2YWw7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbVsgbmFtZSBdID09PSB0cnVlID8gbmFtZS50b0xvd2VyQ2FzZSgpIDpcblx0XHRcdFx0KCB2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSApICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdFx0bnVsbDtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gRVhQT1NFXG52YXIgX3NpenpsZSA9IHdpbmRvdy5TaXp6bGU7XG5cblNpenpsZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICggd2luZG93LlNpenpsZSA9PT0gU2l6emxlICkge1xuXHRcdHdpbmRvdy5TaXp6bGUgPSBfc2l6emxlO1xuXHR9XG5cblx0cmV0dXJuIFNpenpsZTtcbn07XG5cbmlmICggdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgKSB7XG5cdGRlZmluZSggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFNpenpsZTtcblx0fSApO1xuXG4vLyBTaXp6bGUgcmVxdWlyZXMgdGhhdCB0aGVyZSBiZSBhIGdsb2JhbCB3aW5kb3cgaW4gQ29tbW9uLUpTIGxpa2UgZW52aXJvbm1lbnRzXG59IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFNpenpsZTtcbn0gZWxzZSB7XG5cdHdpbmRvdy5TaXp6bGUgPSBTaXp6bGU7XG59XG5cbi8vIEVYUE9TRVxuXG59ICkoIHdpbmRvdyApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zaXp6bGUvZGlzdC9zaXp6bGUuanMiLCJleHBvcnQgeyBkZWZhdWx0IGFzIHNlbGVjdCwgZ2V0U2luZ2xlU2VsZWN0b3IsIGdldE11bHRpU2VsZWN0b3IgfSBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWF0Y2ggfSBmcm9tICcuL21hdGNoJ1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBvcHRpbWl6ZSB9IGZyb20gJy4vb3B0aW1pemUnXG5leHBvcnQgKiBhcyBjb21tb24gZnJvbSAnLi9jb21tb24nXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9