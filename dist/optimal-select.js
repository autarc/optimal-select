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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * @typedef  {Object} Pattern
 * @property {('descendant' | 'child')}                  [relates]
 * @property {string}                                    [tag]
 * @property {Array.<{ name: string, value: string? }>}  attributes
 * @property {Array.<string>}                            classes
 * @property {Array.<string>}                            pseudo
 * @property {Array.<Array.<Pattern>>}                   descendants
 */

/**
 * Creates a new pattern structure
 * 
 * @param {Partial<Pattern>} pattern
 * @returns {Pattern}
 */
var createPattern = exports.createPattern = function createPattern() {
  var base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _extends({ attributes: [], classes: [], pseudo: [], descendants: [] }, base);
};

/**
 * Convert attributes to CSS selector
 * 
 * @param {Array.<{ name: string, value: string? }>} attributes 
 * @returns {string}
 */
var attributesToSelector = exports.attributesToSelector = function attributesToSelector(attributes) {
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
 * Convert classes to CSS selector
 * 
 * @param {Array.<string>} classes 
 * @returns {string}
 */
var classesToSelector = exports.classesToSelector = function classesToSelector(classes) {
  return classes.length ? '.' + classes.join('.') : '';
};

/**
 * Convert pseudo selectors to CSS selector
 * 
 * @param {Array.<string>} pseudo 
 * @returns {string}
 */
var pseudoToSelector = exports.pseudoToSelector = function pseudoToSelector(pseudo) {
  return pseudo.length ? ':' + pseudo.join(':') : '';
};

/**
 * Convert pattern to CSS selector
 * 
 * @param {Pattern} pattern 
 * @returns {string}
 */
var patternToSelector = exports.patternToSelector = function patternToSelector(pattern) {
  var relates = pattern.relates,
      tag = pattern.tag,
      attributes = pattern.attributes,
      classes = pattern.classes,
      pseudo = pattern.pseudo;

  var value = '' + (relates === 'child' ? '> ' : '') + (tag || '') + attributesToSelector(attributes) + classesToSelector(classes) + pseudoToSelector(pseudo);
  return value;
};

/**
 * Converts path to string
 *
 * @param {Array.<Pattern>} path 
 * @returns {string}
 */
var pathToSelector = exports.pathToSelector = function pathToSelector(path) {
  return path.map(patternToSelector).join(' ');
};

var convertEscaping = function convertEscaping(value) {
  return value && value.replace(/\\([`\\/:?&!#$%^()[\]{|}*+;,.<=>@~])/g, '$1').replace(/\\(['"])/g, '$1$1').replace(/\\A /g, '\n');
};

/**
* Convert attributes to XPath string
* 
* @param {Array.<{ name: string, value: string? }>} attributes 
* @returns {string}
*/
var attributesToXPath = exports.attributesToXPath = function attributesToXPath(attributes) {
  return attributes.map(function (_ref2) {
    var name = _ref2.name,
        value = _ref2.value;

    if (value === null) {
      return '[@' + name + ']';
    }
    return '[@' + name + '="' + convertEscaping(value) + '"]';
  }).join('');
};

/**
* Convert classes to XPath string
* 
* @param {Array.<string>} classes 
* @returns {string}
*/
var classesToXPath = exports.classesToXPath = function classesToXPath(classes) {
  return classes.map(function (c) {
    return '[contains(concat(" ",normalize-space(@class)," ")," ' + c + ' ")]';
  }).join('');
};

/**
* Convert pseudo selectors to XPath string
* 
* @param {Array.<string>} pseudo 
* @returns {string}
*/
var pseudoToXPath = exports.pseudoToXPath = function pseudoToXPath(pseudo) {
  return pseudo.map(function (p) {
    var match = p.match(/^(nth-child|nth-of-type|contains)\((.+)\)$/);
    if (!match) {
      return '';
    }

    switch (match[1]) {
      case 'nth-child':
        return '[(count(preceding-sibling::*)+1) = ' + match[2] + ']';

      case 'nth-of-type':
        return '[' + match[2] + ']';

      case 'contains':
        return '[contains(text(),' + match[2] + ')]';

      default:
        return '';
    }
  }).join('');
};

/**
* Convert pattern to XPath string
* 
* @param {Pattern} pattern 
* @returns {string}
*/
var patternToXPath = exports.patternToXPath = function patternToXPath(pattern) {
  var relates = pattern.relates,
      tag = pattern.tag,
      attributes = pattern.attributes,
      classes = pattern.classes,
      pseudo = pattern.pseudo,
      descendants = pattern.descendants;

  var value = '' + (relates === 'child' ? '/' : '//') + (tag || '*') + attributesToXPath(attributes) + classesToXPath(classes) + pseudoToXPath(pseudo) + descendantsToXPath(descendants);
  return value;
};

/**
* Converts path to XPath string
*
* @param {Array.<Pattern>} path 
* @returns {string}
*/
var pathToXPath = exports.pathToXPath = function pathToXPath(path) {
  return '.' + path.map(patternToXPath).join('');
};

/**
* Convert child selectors to XPath string
* 
* @param {Array.<Array.<Pattern>>} children 
* @returns {string}
*/
var descendantsToXPath = exports.descendantsToXPath = function descendantsToXPath(children) {
  return children.length ? '[' + children.map(pathToXPath).join('][') + ']' : '';
};

var toString = {
  'css': {
    attributes: attributesToSelector,
    classes: classesToSelector,
    pseudo: pseudoToSelector,
    pattern: patternToSelector,
    path: pathToSelector
  },
  'xpath': {
    attributes: attributesToXPath,
    classes: classesToXPath,
    pseudo: pseudoToXPath,
    pattern: patternToXPath,
    path: pathToXPath
  },
  'jquery': {}
};

toString.jquery = toString.css;
toString[0] = toString.css;
toString[1] = toString.xpath;

/**
 * @typedef  {Object} ToStringApi
 * @property {(attributes: Array.<{ name: string, value: string? }>) => string} attributes
 * @property {(classes: Array.<string>) => string}  classes
 * @property {(pseudo: Array.<string>) => string}   pseudo
 * @property {(pattern: Pattern) => string}         pattern
 * @property {(path: Array.<Pattern>) => string}    path
 */

/**
 * Get api to convert paths, patterns and their parts to string of specified format
 * 
 * @param {'css' | 'xpath' | 'jquery' | 0 | 1} [format] 
 * @returns {ToStringApi}
 */
var getToString = exports.getToString = function getToString(format) {
  return toString[format || 'css'];
};

/**
 * Get function to convert pattern to string of specified format
 * 
 * @param {Options} options 
 * @returns {(path: Array.<Pattern>) => string}
 */
var getPathToString = exports.getPathToString = function getPathToString(format) {
  return getToString(format).path;
};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// import Sizzle from 'sizzle'
var Sizzle = void 0;

/**
 * Select element using jQuery
 * @param  {string}         selector
 * @param  {HTMLElement}    parent
 * @return Array.<HTMLElement>
 */
var selectJQuery = function selectJQuery(selector) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!Sizzle) {
    Sizzle = __webpack_require__(7);
  }
  return Sizzle(selector, parent || document);
};

/**
 * Select element using XPath
 * @param  {string}         selector
 * @param  {HTMLElement}    parent
 * @return Array.<HTMLElement>
 */
var selectXPath = function selectXPath(selector) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  parent = parent || document;
  var doc = parent;
  while (doc.parentNode) {
    doc = doc.parentNode;
  }
  if (doc !== parent && !selector.startsWith('.')) {
    selector = '.' + selector;
  }
  var iterator = doc.evaluate(selector, parent, null, 0);
  var elements = [];
  var element;
  while (element = iterator.iterateNext()) {
    elements.push(element);
  }
  return elements;
};

/**
 * Select element using CSS
 * @param  {string}         selector
 * @param  {HTMLElement}    parent
 * @return Array.<HTMLElement>
 */
var selectCSS = function selectCSS(selector) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return (parent || document).querySelectorAll(selector);
};

var select = {
  'css': selectCSS,
  'xpath': selectXPath,
  'jquery': selectJQuery
};

select[0] = select.css;
select[1] = select.xpath;

/**
* 
* @param {Options} options 
* @returns {(selector: string, parent: HTMLElement) => string}
*/
var getSelect = exports.getSelect = function getSelect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (selector, parent) {
    return select[options.format || 'css'](selector, parent || options.root);
  };
};

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * # Common
 *
 * Process collections for similarities.
 */

/**
 * @typedef {import('./select').Options} Options
 */

/**
 * Find the last common ancestor of elements
 *
 * @param  {Array.<HTMLElement>} elements  - [description]
 * @param  {Options}              options  - [description]
 * @return {HTMLElement}                   - [description]
 */
var getCommonAncestor = exports.getCommonAncestor = function getCommonAncestor(elements) {
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
};

/**
 * Get a set of common properties of elements
 *
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Object}                       - [description]
 */
var getCommonProperties = exports.getCommonProperties = function getCommonProperties(elements) {

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
};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * # Match
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * Retrieve selector for a node.
                                                                                                                                                                                                                                                                   */

exports.default = match;

var _pattern = __webpack_require__(0);

var _selector = __webpack_require__(1);

var _utilities = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 * @typedef {import('./pattern').ToStringApi} Pattern
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

  options = _extends({
    root: document,
    skip: null,
    priority: ['id', 'class', 'href', 'src'],
    ignore: {}
  }, options);
  var _options = options,
      root = _options.root,
      skip = _options.skip,
      ignore = _options.ignore,
      format = _options.format;


  var path = [];
  var element = node;
  var length = path.length;
  var select = (0, _selector.getSelect)(options);
  var toString = (0, _pattern.getToString)(options.format);

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
      if (checkAttributes(element, path, options, select, toString, root)) break;
      if (checkTag(element, path, options, select, toString, root)) break;

      // ~ local
      checkAttributes(element, path, options, select, toString);
      if (path.length === length) {
        checkTag(element, path, options, select, toString);
      }

      if (path.length === length && [1, 'xpath'].includes(format)) {
        checkRecursiveDescendants(element, path, options, select, toString);
      }

      if (path.length === length && [1, 'xpath', 'jquery'].includes(format)) {
        checkText(element, path, options, select, toString, format === 'jquery');
      }

      if (path.length === length) {
        checkNthChild(element, path, options);
      }
    }

    element = element.parentNode;
    length = path.length;
  }

  if (element === root) {
    var pattern = findPattern(element, options, select, toString);
    path.unshift(pattern);
  }

  return path;
}

/**
 * Extend path with attribute identifier
 *
 * @param  {HTMLElement}     element  - [description]
 * @param  {Array.<Pattern>} path     - [description]
 * @param  {Options}         options  - [description]
 * @param  {function}        select   - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {HTMLElement}     parent   - [description]
 * @return {boolean}                  - [description]
 */
var checkAttributes = function checkAttributes(element, path, _ref, select, toString) {
  var priority = _ref.priority,
      ignore = _ref.ignore;
  var parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : element.parentNode;

  var pattern = findAttributesPattern(priority, element, ignore, select, toString, parent);
  if (pattern) {
    path.unshift(pattern);
    return true;
  }
  return false;
};

/**
 * Get combinations
 *
 * @param  {Array.<string>} values   - [description]
 * @return {Array.<string>?}        - [description]
 */
var combinations = function combinations(values) {
  var result = [[]];

  values.forEach(function (c) {
    result.forEach(function (r) {
      return result.push(r.concat(c));
    });
  });

  result.shift();
  return result;
};

/**
 * Get class selector
 *
 * @param  {Array.<string>} classes - [description]
 * @param  {function}       select  - [description]
 * @param  {ToStringApi}    toString - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @param  {Pattern}        base    - [description]
 * @return {Array.<string>?}        - [description]
 */
var getClassSelector = function getClassSelector() {
  var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var select = arguments[1];
  var toString = arguments[2];
  var parent = arguments[3];
  var base = arguments[4];

  var result = combinations(classes);

  for (var i = 0; i < result.length; i++) {
    var pattern = toString.pattern(_extends({}, base, { classes: result[i] }));
    var matches = select(pattern, parent);
    if (matches.length === 1) {
      return result[i];
    }
  }

  return null;
};

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority  - [description]
 * @param  {HTMLElement}    element   - [description]
 * @param  {Object}         ignore    - [description]
 * @param  {function}       select    - [description]
 * @param  {ToStringApi}    toString  - [description]
 * @param  {ParentNode}     parent    - [description]
 * @return {Pattern?}                 - [description]
 */
var findAttributesPattern = function findAttributesPattern(priority, element, ignore, select, toString) {
  var parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : element.parentNode;

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
    return select(toString.pattern(pattern), parent).length === 1;
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
              var classes = getClassSelector(classNames, select, toString, parent, pattern);
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
};

/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}     element - [description]
 * @param  {Options}         options  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}        select  - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {HTMLElement}     parent  - [description]
 * @return {boolean}                 - [description]
 */
var checkTag = function checkTag(element, path, _ref2, select, toString) {
  var ignore = _ref2.ignore;
  var parent = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : element.parentNode;

  var pattern = findTagPattern(element, ignore);
  if (pattern) {
    var matches = [];
    matches = select(toString.pattern(pattern), parent);
    if (matches.length === 1) {
      path.unshift(pattern);
      if (pattern.tag === 'iframe') {
        return false;
      }
      return true;
    }
  }
  return false;
};

/**
 * Lookup tag identifier
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Pattern?}            - [description]
 */
var findTagPattern = function findTagPattern(element, ignore) {
  var tagName = element.tagName.toLowerCase();
  if (checkIgnore(ignore.tag, null, tagName)) {
    return null;
  }
  var pattern = (0, _pattern.createPattern)();
  pattern.tag = tagName;
  return pattern;
};

/**
 * Extend path with specific child identifier
 *
 * @param  {HTMLElement}     element - [description]
 * @param  {Options}         options - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @return {boolean}                 - [description]
 */
var checkNthChild = function checkNthChild(element, path, _ref3) {
  var ignore = _ref3.ignore;

  var parent = element.parentNode;
  var children = parent.children;
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
};

/**
 * Extend path with contains
 *
 * @param  {HTMLElement}     element  - [description]
 * @param  {Array.<Pattern>} path     - [description]
 * @param  {Options}         options  - [description]
 * @param  {function}        select   - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {boolean}         nested   - [description]
 * @return {boolean}                  - [description]
 */
var checkText = function checkText(element, path, _ref4, select, toString, nested) {
  var ignore = _ref4.ignore;

  var pattern = findTagPattern(element, ignore);
  if (!pattern) {
    return false;
  }
  var textContent = nested ? element.textContent : element.firstChild && element.firstChild.nodeValue || '';
  if (!textContent) {
    return false;
  }

  pattern.relates = 'child';
  var parent = element.parentNode;
  var texts = textContent.replace(/\n+/g, '\n').split('\n').map(function (text) {
    return text.trim();
  }).filter(function (text) {
    return text.length > 0;
  });

  var contains = [];

  while (texts.length > 0) {
    var text = texts.shift();
    if (checkIgnore(ignore.contains, null, text)) {
      break;
    }
    contains.push('contains("' + text + '")');

    var matches = select(toString.pattern(_extends({}, pattern, { pseudo: contains })), parent);
    if (matches.length === 1) {
      pattern.pseudo = contains;
      path.unshift(pattern);
      return true;
    }
    if (matches.length === 0) {
      return false;
    }
  }
  return false;
};

/**
 * Extend path with descendant tag
 *
 * @param  {HTMLElement}     element  - [description]
 * @param  {Array.<Pattern>} path     - [description]
 * @param  {Options}         options  - [description]
 * @param  {function}        select   - [description]
 * @param  {ToStringApi}     toString - [description]
 * @return {boolean}                  - [description]
 */
var checkRecursiveDescendants = function checkRecursiveDescendants(element, path, options, select, toString) {
  var pattern = findTagPattern(element, options.ignore);
  if (!pattern) {
    return false;
  }

  var descendants = Array.from(element.querySelectorAll('*'));
  while (descendants.length > 0) {
    var descendantPath = match(descendants.shift(), _extends({}, options, { root: element }));
    // avoid descendant selectors with nth-child
    if (!descendantPath.some(function (pattern) {
      return pattern.pseudo.some(function (p) {
        return p.startsWith('nth-child');
      });
    })) {
      var parent = element.parentElement;
      var matches = select(toString.pattern(_extends({}, pattern, { descendants: [descendantPath] })), parent);
      if (matches.length === 1) {
        pattern.descendants = [descendantPath];
        path.unshift(pattern);
        return true;
      }
    }
  }

  return false;
};

/**
 * Lookup identifier
 *
 * @param  {HTMLElement}    element  - [description]
 * @param  {Options}        options   - [description]
 * @param  {function}       select   - [description]
 * @param  {ToStringApi}    toString - [description]
 * @return {Pattern}                 - [description]
 */
var findPattern = function findPattern(element, _ref5, select, toString) {
  var priority = _ref5.priority,
      ignore = _ref5.ignore;

  var pattern = findAttributesPattern(priority, element, ignore, select, toString);
  if (!pattern) {
    pattern = findTagPattern(element, ignore);
  }
  return pattern;
};

/**
 * Validate with custom and default functions
 *
 * @param  {Function} predicate        - [description]
 * @param  {string?}  name             - [description]
 * @param  {string}   value            - [description]
 * @param  {Function} defaultPredicate - [description]
 * @return {boolean}                   - [description]
 */
var checkIgnore = function checkIgnore(predicate, name, value, defaultPredicate) {
  if (!value) {
    return true;
  }
  var check = predicate || defaultPredicate;
  if (!check) {
    return false;
  }
  return check(name, value, defaultPredicate);
};
module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compareResults = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = optimize;

var _selector = __webpack_require__(1);

var _pattern2 = __webpack_require__(0);

var _utilities = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * # Optimize
                                                                                                                                                                                                     *
                                                                                                                                                                                                     * 1.) Improve efficiency through shorter selectors by removing redundancy
                                                                                                                                                                                                     * 2.) Improve robustness through selector transformation
                                                                                                                                                                                                     */

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 * @typedef {import('./pattern').ToStringApi} Pattern
 */

/**
 * Apply different optimization techniques
 *
 * @param  {Array.<Pattern>}                 path   - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element    - [description]
 * @param  {Options}                         [options]  - [description]
 * @return {Array.<Pattern>}                            - [description]
 */
function optimize(path, elements) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (path.length === 0) {
    return [];
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

  var select = (0, _selector.getSelect)(options);
  var toString = (0, _pattern2.getToString)(options.format);

  if (path.length === 1) {
    return [optimizePart([], path[0], [], elements, select, toString)];
  }

  var endOptimized = false;
  if (path[path.length - 1].relates === 'child') {
    path[path.length - 1] = optimizePart(path.slice(0, -1), path[path.length - 1], [], elements, select, toString);
    endOptimized = true;
  }

  path = [].concat(_toConsumableArray(path));
  var shortened = [path.pop()];

  var _loop = function _loop() {
    var current = path.pop();
    var matches = select(toString.path([].concat(_toConsumableArray(path), shortened)));
    var hasSameResult = matches.length === elements.length && elements.every(function (element, i) {
      return element === matches[i];
    });
    if (!hasSameResult) {
      shortened.unshift(optimizePart(path, current, shortened, elements, select, toString));
    }
  };

  while (path.length > 1) {
    _loop();
  }
  shortened.unshift(path[0]);
  path = shortened;

  // optimize start + end
  path[0] = optimizePart([], path[0], path.slice(1), elements, select, toString);
  if (!endOptimized) {
    path[path.length - 1] = optimizePart(path.slice(0, -1), path[path.length - 1], [], elements, select, toString);
  }

  return path;
}

/**
 * Optimize :contains
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizeText = function optimizeText(pre, current, post, elements, select, toString) {
  var _partition = (0, _utilities.partition)(current.pseudo, function (item) {
    return item.startsWith('contains');
  }),
      _partition2 = _slicedToArray(_partition, 2),
      contains = _partition2[0],
      other = _partition2[1];

  if (contains.length > 0 && post.length) {
    var base = _extends({}, current, { pseudo: [].concat(_toConsumableArray(other), _toConsumableArray(contains)) });
    while (base.pseudo.length > other.length) {
      var optimized = base.pseudo.slice(0, -1);
      if (!compareResults(select(toString.path([].concat(_toConsumableArray(pre), [_extends({}, base, { pseudo: optimized })], _toConsumableArray(post)))), elements)) {
        break;
      }
      base.pseudo = optimized;
    }
    return base;
  }
  return current;
};

/**
 * Optimize attributes
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizeAttributes = function optimizeAttributes(pre, current, post, elements, select, toString) {
  // reduce attributes: first try without value, then removing completely
  if (current.attributes.length > 0) {
    var attributes = [].concat(_toConsumableArray(current.attributes));

    var simplify = function simplify(original, getSimplified) {
      var i = original.length - 1;
      while (i >= 0) {
        var _attributes = getSimplified(original, i);
        if (!compareResults(select(toString.path([].concat(_toConsumableArray(pre), [_extends({}, current, { attributes: _attributes })], _toConsumableArray(post)))), elements)) {
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
};

/**
 * Optimize descendant
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizeDescendant = function optimizeDescendant(pre, current, post, elements, select, toString) {
  // robustness: descendant instead child (heuristic)
  if (current.relates === 'child') {
    var descendant = _extends({}, current, { relates: undefined });
    var _matches = select(toString.path([].concat(_toConsumableArray(pre), [descendant], _toConsumableArray(post))));
    if (compareResults(_matches, elements)) {
      return descendant;
    }
  }
  return current;
};

/**
 * Optimize recursive descendants
 * 
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizeRecursiveDescendants = function optimizeRecursiveDescendants(pre, current, post, elements, select, toString) {
  if (current.descendants.length > 0 && post.length) {
    var base = _extends({}, current, { descendants: [].concat(_toConsumableArray(current.descendants)) });
    while (base.descendants.length > 0) {
      var optimized = base.descendants.slice(0, -1);
      if (!compareResults(select(toString.path([].concat(_toConsumableArray(pre), [_extends({}, base, { descendants: optimized })], _toConsumableArray(post)))), elements)) {
        break;
      }
      base.descendants = optimized;
    }
    return base;
  }
  return current;
};

/**
 * Optimize nth of type
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizeNthOfType = function optimizeNthOfType(pre, current, post, elements, select, toString) {
  var i = current.pseudo.findIndex(function (item) {
    return item.startsWith('nth-child');
  });
  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (i >= 0) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    var type = current.pseudo[i].replace(/^nth-child/, 'nth-of-type');
    var nthOfType = _extends({}, current, { pseudo: [].concat(_toConsumableArray(current.pseudo.slice(0, i)), [type], _toConsumableArray(current.pseudo.slice(i + 1))) });
    var pattern = toString.path([].concat(_toConsumableArray(pre), [nthOfType], _toConsumableArray(post)));
    var _matches2 = select(pattern);
    if (compareResults(_matches2, elements)) {
      return nthOfType;
    }
  }
  return current;
};

/**
 * Optimize classes
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizeClasses = function optimizeClasses(pre, current, post, elements, select, toString) {
  // efficiency: combinations of classname (partial permutations)
  if (current.classes.length > 1) {
    var optimized = current.classes.slice().sort(function (curr, next) {
      return curr.length - next.length;
    });

    while (optimized.length > 1) {
      optimized.shift();
      var _pattern = toString.path([].concat(_toConsumableArray(pre), [_extends({}, current, { classes: optimized })], _toConsumableArray(post)));
      if (!compareResults(select(_pattern), elements)) {
        break;
      }
      current.classes = optimized;
    }

    optimized = current.classes;

    if (optimized.length > 2) {
      var base = (0, _pattern2.createPattern)({ classes: optimized });
      var references = select(toString.path([].concat(_toConsumableArray(pre), [base])));

      var _loop2 = function _loop2() {
        var reference = references[i];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          // TODO:
          // - check using attributes + regard excludes
          var description = (0, _pattern2.createPattern)({ tagName: reference.tagName });
          pattern = toString.path([].concat(_toConsumableArray(pre), [(0, _pattern2.createPattern)({ tagName: reference.tagName })], _toConsumableArray(post)));
          matches = select(pattern);

          if (compareResults(matches, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i = 0; i < references.length; i++) {
        var pattern;
        var matches;

        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
      }
    }
  }
  return current;
};

var optimizers = [optimizeText, optimizeAttributes, optimizeDescendant, optimizeRecursiveDescendants, optimizeNthOfType, optimizeClasses];

/**
 * Improve a chunk of the selector
 *
 * @param  {Array.<Pattern>}     pre      - [description]
 * @param  {Pattern}             current  - [description]
 * @param  {Array.<Pattern>}     post     - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @param  {function}            select   - [description]
 * @param  {ToStringApi}         toString - [description]
 * @return {Pattern}                      - [description]
 */
var optimizePart = function optimizePart(pre, current, post, elements, select, toString) {
  return optimizers.reduce(function (acc, optimizer) {
    return optimizer(pre, acc, post, elements, select, toString);
  }, current);
};

/**
 * Evaluate matches with expected elements
 *
 * @param  {Array.<HTMLElement>} matches  - [description]
 * @param  {Array.<HTMLElement>} elements - [description]
 * @return {Boolean}                      - [description]
 */
var compareResults = exports.compareResults = function compareResults(matches, elements) {
  var length = matches.length;

  return length === elements.length && elements.every(function (element) {
    for (var i = 0; i < length; i++) {
      if (matches[i] === element) {
        return true;
      }
    }
    return false;
  });
};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMultiSelector = exports.getMultiSelectorPath = exports.getSingleSelector = exports.getSingleSelectorPath = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * # Select
                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                               * Construct a unique CSS query selector to access the selected DOM element(s).
                                                                                                                                                                                                                                                                               * For longevity it applies different matching and optimization strategies.
                                                                                                                                                                                                                                                                               */


exports.default = getQuerySelector;

var _match = __webpack_require__(4);

var _match2 = _interopRequireDefault(_match);

var _optimize = __webpack_require__(5);

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = __webpack_require__(2);

var _common = __webpack_require__(3);

var _selector = __webpack_require__(1);

var _pattern = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @typedef  {Object} Options
 * @property {HTMLElement} [root]                     Optionally specify the root element
 * @property {function | Array.<HTMLElement>} [skip]  Specify elements to skip
 * @property {Array.<string>} [priority]              Order of attribute processing
 * @property {Object<string, function | number | string | boolean} [ignore] Define patterns which shouldn't be included
 * @property {('css'|'xpath'|'jquery')} [format]      Output format    
 */

/**
 * @typedef {import('./pattern').Pattern} Pattern
 */

/**
 * Get a selector path for the provided element
 *
 * @param  {HTMLElement} element   - [description]
 * @param  {Options}     [options] - [description]
 * @return {Array.<Pattern>}       - [description]
 */
var getSingleSelectorPath = exports.getSingleSelectorPath = function getSingleSelectorPath(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (element.nodeType === 3) {
    element = element.parentNode;
  }

  if (element.nodeType !== 1) {
    throw new Error('Invalid input - only HTMLElements or representations of them are supported! (not "' + (typeof element === 'undefined' ? 'undefined' : _typeof(element)) + '")');
  }

  var path = (0, _match2.default)(element, options);
  var optimizedPath = (0, _optimize2.default)(path, element, options);

  // debug
  // console.log(`
  //   selector:  ${path}
  //   optimized: ${optimizedPath}
  // `)

  return optimizedPath;
};

/**
 * Get a selector string for the provided element
 *
 * @param  {HTMLElement} element   - [description]
 * @param  {Options}     [options] - [description]
 * @return {string}       - [description]
 */
var getSingleSelector = exports.getSingleSelector = function getSingleSelector(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _pattern.getPathToString)(options.format)(getSingleSelectorPath(element, options));
};

/**
 * Get a selector path to match multiple descendants from an ancestor
 *
 * @param  {Array.<HTMLElement>|NodeList} elements   - [description]
 * @param  {Options}                      [options]  - [description]
 * @return {Array.<Pattern>}                         - [description]
 */
var getMultiSelectorPath = exports.getMultiSelectorPath = function getMultiSelectorPath(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!Array.isArray(elements)) {
    elements = (0, _utilities.convertNodeList)(elements);
  }

  if (elements.some(function (element) {
    return element.nodeType !== 1;
  })) {
    throw new Error('Invalid input - only an Array of HTMLElements or representations of them is supported!');
  }

  var select = (0, _selector.getSelect)(options);
  var toString = (0, _pattern.getPathToString)(options.format);

  var ancestor = (0, _common.getCommonAncestor)(elements, options);
  var ancestorPath = (0, _match2.default)(ancestor, options);

  // TODO: consider usage of multiple selectors + parent-child relation + check for part redundancy
  var commonPath = getCommonPath(elements);
  var descendantPattern = commonPath[0];

  var selectorPath = (0, _optimize2.default)([].concat(_toConsumableArray(ancestorPath), [descendantPattern]), elements, options);
  var selectorMatches = (0, _utilities.convertNodeList)(select(toString(selectorPath)));

  if (!elements.every(function (element) {
    return selectorMatches.some(function (entry) {
      return entry === element;
    });
  })) {
    // TODO: cluster matches to split into similar groups for sub selections
    return console.warn('\n      The selected elements can\'t be efficiently mapped.\n      Its probably best to use multiple single selectors instead!\n    ', elements);
  }

  return selectorPath;
};

/**
 * Get a selector string to match multiple descendants from an ancestor
 *
 * @param  {Array.<HTMLElement>|NodeList} elements   - [description]
 * @param  {Options}                      [options]  - [description]
 * @return {Array.<Pattern>}                         - [description]
 */
var getMultiSelector = exports.getMultiSelector = function getMultiSelector(elements) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return (0, _pattern.getPathToString)(options.format)(getMultiSelectorPath(elements, options));
};

/**
 * Get selectors to describe a set of elements
 *
 * @param  {Array.<HTMLElement>} elements  - [description]
 * @return {Array.<Pattern>}               - [description]
 */
var getCommonPath = function getCommonPath(elements) {
  var _getCommonProperties = (0, _common.getCommonProperties)(elements),
      classes = _getCommonProperties.classes,
      attributes = _getCommonProperties.attributes,
      tag = _getCommonProperties.tag;

  return [(0, _pattern.createPattern)({
    tag: tag,
    classes: classes || [],
    attributes: attributes ? Object.keys(attributes).map(function (name) {
      return {
        name: (0, _utilities.escapeValue)(name),
        value: (0, _utilities.escapeValue)(attributes[name])
      };
    }) : []
  })];
};

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

  return input.length && !input.name ? getMultiSelector(input, options) : getSingleSelector(input, options);
}

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
exports.common = exports.getPathToString = exports.getToString = exports.optimize = exports.match = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

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

var _match = __webpack_require__(4);

Object.defineProperty(exports, 'match', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_match).default;
  }
});

var _optimize = __webpack_require__(5);

Object.defineProperty(exports, 'optimize', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_optimize).default;
  }
});

var _pattern = __webpack_require__(0);

Object.defineProperty(exports, 'getToString', {
  enumerable: true,
  get: function get() {
    return _pattern.getToString;
  }
});
Object.defineProperty(exports, 'getPathToString', {
  enumerable: true,
  get: function get() {
    return _pattern.getPathToString;
  }
});

var _common2 = __webpack_require__(3);

var _common = _interopRequireWildcard(_common2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.common = _common;

/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmNmUzMzM1NTczNzRhNDE3YzY4YSIsIndlYnBhY2s6Ly8vLi9zcmMvcGF0dGVybi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvb3B0aW1pemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY3JlYXRlUGF0dGVybiIsImJhc2UiLCJhdHRyaWJ1dGVzIiwiY2xhc3NlcyIsInBzZXVkbyIsImRlc2NlbmRhbnRzIiwiYXR0cmlidXRlc1RvU2VsZWN0b3IiLCJtYXAiLCJuYW1lIiwidmFsdWUiLCJqb2luIiwiY2xhc3Nlc1RvU2VsZWN0b3IiLCJsZW5ndGgiLCJwc2V1ZG9Ub1NlbGVjdG9yIiwicGF0dGVyblRvU2VsZWN0b3IiLCJwYXR0ZXJuIiwicmVsYXRlcyIsInRhZyIsInBhdGhUb1NlbGVjdG9yIiwicGF0aCIsImNvbnZlcnRFc2NhcGluZyIsInJlcGxhY2UiLCJhdHRyaWJ1dGVzVG9YUGF0aCIsImNsYXNzZXNUb1hQYXRoIiwiYyIsInBzZXVkb1RvWFBhdGgiLCJtYXRjaCIsInAiLCJwYXR0ZXJuVG9YUGF0aCIsImRlc2NlbmRhbnRzVG9YUGF0aCIsInBhdGhUb1hQYXRoIiwiY2hpbGRyZW4iLCJ0b1N0cmluZyIsImpxdWVyeSIsImNzcyIsInhwYXRoIiwiZ2V0VG9TdHJpbmciLCJmb3JtYXQiLCJnZXRQYXRoVG9TdHJpbmciLCJTaXp6bGUiLCJzZWxlY3RKUXVlcnkiLCJzZWxlY3RvciIsInBhcmVudCIsInJlcXVpcmUiLCJkb2N1bWVudCIsInNlbGVjdFhQYXRoIiwiZG9jIiwicGFyZW50Tm9kZSIsInN0YXJ0c1dpdGgiLCJpdGVyYXRvciIsImV2YWx1YXRlIiwiZWxlbWVudHMiLCJlbGVtZW50IiwiaXRlcmF0ZU5leHQiLCJwdXNoIiwic2VsZWN0Q1NTIiwicXVlcnlTZWxlY3RvckFsbCIsInNlbGVjdCIsImdldFNlbGVjdCIsIm9wdGlvbnMiLCJyb290IiwiY29udmVydE5vZGVMaXN0Iiwibm9kZXMiLCJhcnIiLCJBcnJheSIsImkiLCJlc2NhcGVWYWx1ZSIsInBhcnRpdGlvbiIsImFycmF5IiwicHJlZGljYXRlIiwicmVkdWNlIiwiaXRlbSIsImlubmVyIiwib3V0ZXIiLCJjb25jYXQiLCJnZXRDb21tb25BbmNlc3RvciIsImFuY2VzdG9ycyIsImZvckVhY2giLCJpbmRleCIsInBhcmVudHMiLCJ1bnNoaWZ0Iiwic29ydCIsImN1cnIiLCJuZXh0Iiwic2hhbGxvd0FuY2VzdG9yIiwic2hpZnQiLCJhbmNlc3RvciIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImNvbW1vblByb3BlcnRpZXMiLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwiZWxlbWVudEF0dHJpYnV0ZXMiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiYXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXNOYW1lcyIsImNvbW1vbkF0dHJpYnV0ZXNOYW1lcyIsIm5leHRDb21tb25BdHRyaWJ1dGVzIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiZGVmYXVsdElnbm9yZSIsImluZGV4T2YiLCJub2RlIiwic2tpcCIsInByaW9yaXR5IiwiaWdub3JlIiwic2tpcENvbXBhcmUiLCJpc0FycmF5Iiwic2tpcENoZWNrcyIsImNvbXBhcmUiLCJ0eXBlIiwiUmVnRXhwIiwidGVzdCIsIm5vZGVUeXBlIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tUYWciLCJpbmNsdWRlcyIsImNoZWNrUmVjdXJzaXZlRGVzY2VuZGFudHMiLCJjaGVja1RleHQiLCJjaGVja050aENoaWxkIiwiZmluZFBhdHRlcm4iLCJmaW5kQXR0cmlidXRlc1BhdHRlcm4iLCJjb21iaW5hdGlvbnMiLCJ2YWx1ZXMiLCJyZXN1bHQiLCJyIiwiZ2V0Q2xhc3NTZWxlY3RvciIsIm1hdGNoZXMiLCJhdHRyaWJ1dGVOYW1lcyIsInZhbCIsImEiLCJzb3J0ZWRLZXlzIiwiaXNPcHRpbWFsIiwiYXR0cmlidXRlVmFsdWUiLCJ1c2VOYW1lZElnbm9yZSIsImN1cnJlbnRJZ25vcmUiLCJjdXJyZW50RGVmYXVsdElnbm9yZSIsImNoZWNrSWdub3JlIiwiY2xhc3NOYW1lcyIsImNsYXNzSWdub3JlIiwiY2xhc3MiLCJjbGFzc05hbWUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkIiwiY2hpbGRQYXR0ZXJuIiwiY29uc29sZSIsIndhcm4iLCJuZXN0ZWQiLCJ0ZXh0Q29udGVudCIsImZpcnN0Q2hpbGQiLCJub2RlVmFsdWUiLCJ0ZXh0cyIsInRleHQiLCJjb250YWlucyIsImZyb20iLCJkZXNjZW5kYW50UGF0aCIsInBhcmVudEVsZW1lbnQiLCJkZWZhdWx0UHJlZGljYXRlIiwiY2hlY2siLCJvcHRpbWl6ZSIsIkVycm9yIiwib3B0aW1pemVQYXJ0IiwiZW5kT3B0aW1pemVkIiwic2xpY2UiLCJzaG9ydGVuZWQiLCJwb3AiLCJjdXJyZW50IiwiaGFzU2FtZVJlc3VsdCIsImV2ZXJ5Iiwib3B0aW1pemVUZXh0IiwicHJlIiwicG9zdCIsIm90aGVyIiwib3B0aW1pemVkIiwiY29tcGFyZVJlc3VsdHMiLCJvcHRpbWl6ZUF0dHJpYnV0ZXMiLCJzaW1wbGlmeSIsIm9yaWdpbmFsIiwiZ2V0U2ltcGxpZmllZCIsInNpbXBsaWZpZWQiLCJvcHRpbWl6ZURlc2NlbmRhbnQiLCJkZXNjZW5kYW50Iiwib3B0aW1pemVSZWN1cnNpdmVEZXNjZW5kYW50cyIsIm9wdGltaXplTnRoT2ZUeXBlIiwiZmluZEluZGV4IiwibnRoT2ZUeXBlIiwib3B0aW1pemVDbGFzc2VzIiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImRlc2NyaXB0aW9uIiwib3B0aW1pemVycyIsImFjYyIsIm9wdGltaXplciIsImdldFF1ZXJ5U2VsZWN0b3IiLCJnZXRTaW5nbGVTZWxlY3RvclBhdGgiLCJvcHRpbWl6ZWRQYXRoIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yUGF0aCIsImFuY2VzdG9yUGF0aCIsImNvbW1vblBhdGgiLCJnZXRDb21tb25QYXRoIiwiZGVzY2VuZGFudFBhdHRlcm4iLCJzZWxlY3RvclBhdGgiLCJzZWxlY3Rvck1hdGNoZXMiLCJnZXRNdWx0aVNlbGVjdG9yIiwiaW5wdXQiLCJ3aW5kb3ciLCJzdXBwb3J0IiwiRXhwciIsImdldFRleHQiLCJpc1hNTCIsInRva2VuaXplIiwiY29tcGlsZSIsIm91dGVybW9zdENvbnRleHQiLCJzb3J0SW5wdXQiLCJoYXNEdXBsaWNhdGUiLCJzZXREb2N1bWVudCIsImRvY0VsZW0iLCJkb2N1bWVudElzSFRNTCIsInJidWdneVFTQSIsInJidWdneU1hdGNoZXMiLCJleHBhbmRvIiwiRGF0ZSIsInByZWZlcnJlZERvYyIsImRpcnJ1bnMiLCJkb25lIiwiY2xhc3NDYWNoZSIsImNyZWF0ZUNhY2hlIiwidG9rZW5DYWNoZSIsImNvbXBpbGVyQ2FjaGUiLCJub25uYXRpdmVTZWxlY3RvckNhY2hlIiwic29ydE9yZGVyIiwiYiIsImhhc093biIsImhhc093blByb3BlcnR5IiwicHVzaE5hdGl2ZSIsImxpc3QiLCJlbGVtIiwibGVuIiwiYm9vbGVhbnMiLCJ3aGl0ZXNwYWNlIiwiaWRlbnRpZmllciIsInBzZXVkb3MiLCJyd2hpdGVzcGFjZSIsInJ0cmltIiwicmNvbW1hIiwicmNvbWJpbmF0b3JzIiwicmRlc2NlbmQiLCJycHNldWRvIiwicmlkZW50aWZpZXIiLCJtYXRjaEV4cHIiLCJyaHRtbCIsInJpbnB1dHMiLCJyaGVhZGVyIiwicm5hdGl2ZSIsInJxdWlja0V4cHIiLCJyc2libGluZyIsInJ1bmVzY2FwZSIsImZ1bmVzY2FwZSIsImVzY2FwZSIsIm5vbkhleCIsImhpZ2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidW5sb2FkSGFuZGxlciIsImluRGlzYWJsZWRGaWVsZHNldCIsImFkZENvbWJpbmF0b3IiLCJkaXNhYmxlZCIsIm5vZGVOYW1lIiwiZGlyIiwiYXBwbHkiLCJjYWxsIiwiY2hpbGROb2RlcyIsImUiLCJ0YXJnZXQiLCJlbHMiLCJqIiwiY29udGV4dCIsInJlc3VsdHMiLCJzZWVkIiwibSIsIm5pZCIsImdyb3VwcyIsIm5ld1NlbGVjdG9yIiwibmV3Q29udGV4dCIsIm93bmVyRG9jdW1lbnQiLCJleGVjIiwiZ2V0RWxlbWVudEJ5SWQiLCJpZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInFzYSIsInRlc3RDb250ZXh0Iiwic2NvcGUiLCJzZXRBdHRyaWJ1dGUiLCJ0b1NlbGVjdG9yIiwicXNhRXJyb3IiLCJyZW1vdmVBdHRyaWJ1dGUiLCJjYWNoZSIsImNhY2hlTGVuZ3RoIiwibWFya0Z1bmN0aW9uIiwiZm4iLCJhc3NlcnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEhhbmRsZSIsImF0dHJzIiwiaGFuZGxlciIsImF0dHJIYW5kbGUiLCJzaWJsaW5nQ2hlY2siLCJjdXIiLCJkaWZmIiwic291cmNlSW5kZXgiLCJuZXh0U2libGluZyIsImNyZWF0ZUlucHV0UHNldWRvIiwiY3JlYXRlQnV0dG9uUHNldWRvIiwiY3JlYXRlRGlzYWJsZWRQc2V1ZG8iLCJpc0Rpc2FibGVkIiwiY3JlYXRlUG9zaXRpb25hbFBzZXVkbyIsImFyZ3VtZW50IiwibWF0Y2hJbmRleGVzIiwibmFtZXNwYWNlIiwibmFtZXNwYWNlVVJJIiwiZG9jdW1lbnRFbGVtZW50IiwiaGFzQ29tcGFyZSIsInN1YldpbmRvdyIsImRlZmF1bHRWaWV3IiwidG9wIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVDb21tZW50IiwiZ2V0QnlJZCIsImdldEVsZW1lbnRzQnlOYW1lIiwiYXR0cklkIiwiZmluZCIsImdldEF0dHJpYnV0ZU5vZGUiLCJlbGVtcyIsInRtcCIsImlubmVySFRNTCIsIm1hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm9NYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsImRpc2Nvbm5lY3RlZE1hdGNoIiwiY29tcGFyZURvY3VtZW50UG9zaXRpb24iLCJhZG93biIsImJ1cCIsInNvcnREZXRhY2hlZCIsImF1cCIsImFwIiwiYnAiLCJleHByIiwicmV0IiwiYXR0ciIsInNwZWNpZmllZCIsInNlbCIsImVycm9yIiwibXNnIiwidW5pcXVlU29ydCIsImR1cGxpY2F0ZXMiLCJkZXRlY3REdXBsaWNhdGVzIiwic29ydFN0YWJsZSIsInNwbGljZSIsInNlbGVjdG9ycyIsImNyZWF0ZVBzZXVkbyIsInJlbGF0aXZlIiwiZmlyc3QiLCJwcmVGaWx0ZXIiLCJleGNlc3MiLCJ1bnF1b3RlZCIsIm5vZGVOYW1lU2VsZWN0b3IiLCJvcGVyYXRvciIsIndoYXQiLCJfYXJndW1lbnQiLCJsYXN0Iiwic2ltcGxlIiwiZm9yd2FyZCIsIm9mVHlwZSIsIl9jb250ZXh0IiwieG1sIiwidW5pcXVlQ2FjaGUiLCJvdXRlckNhY2hlIiwibm9kZUluZGV4Iiwic3RhcnQiLCJ1c2VDYWNoZSIsImxhc3RDaGlsZCIsInVuaXF1ZUlEIiwiYXJncyIsInNldEZpbHRlcnMiLCJpZHgiLCJtYXRjaGVkIiwibWF0Y2hlciIsInVubWF0Y2hlZCIsImxhbmciLCJlbGVtTGFuZyIsImhhc2giLCJsb2NhdGlvbiIsImFjdGl2ZUVsZW1lbnQiLCJoYXNGb2N1cyIsImhyZWYiLCJ0YWJJbmRleCIsImNoZWNrZWQiLCJzZWxlY3RlZCIsInNlbGVjdGVkSW5kZXgiLCJfbWF0Y2hJbmRleGVzIiwicmFkaW8iLCJjaGVja2JveCIsImZpbGUiLCJwYXNzd29yZCIsImltYWdlIiwic3VibWl0IiwicmVzZXQiLCJwcm90b3R5cGUiLCJmaWx0ZXJzIiwicGFyc2VPbmx5IiwidG9rZW5zIiwic29GYXIiLCJwcmVGaWx0ZXJzIiwiY2FjaGVkIiwiY29tYmluYXRvciIsImNoZWNrTm9uRWxlbWVudHMiLCJkb25lTmFtZSIsIm9sZENhY2hlIiwibmV3Q2FjaGUiLCJlbGVtZW50TWF0Y2hlciIsIm1hdGNoZXJzIiwibXVsdGlwbGVDb250ZXh0cyIsImNvbnRleHRzIiwiY29uZGVuc2UiLCJuZXdVbm1hdGNoZWQiLCJtYXBwZWQiLCJzZXRNYXRjaGVyIiwicG9zdEZpbHRlciIsInBvc3RGaW5kZXIiLCJwb3N0U2VsZWN0b3IiLCJ0ZW1wIiwicHJlTWFwIiwicG9zdE1hcCIsInByZWV4aXN0aW5nIiwibWF0Y2hlckluIiwibWF0Y2hlck91dCIsIm1hdGNoZXJGcm9tVG9rZW5zIiwiY2hlY2tDb250ZXh0IiwibGVhZGluZ1JlbGF0aXZlIiwiaW1wbGljaXRSZWxhdGl2ZSIsIm1hdGNoQ29udGV4dCIsIm1hdGNoQW55Q29udGV4dCIsIm1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyIsImVsZW1lbnRNYXRjaGVycyIsInNldE1hdGNoZXJzIiwiYnlTZXQiLCJieUVsZW1lbnQiLCJzdXBlck1hdGNoZXIiLCJvdXRlcm1vc3QiLCJtYXRjaGVkQ291bnQiLCJzZXRNYXRjaGVkIiwiY29udGV4dEJhY2t1cCIsImRpcnJ1bnNVbmlxdWUiLCJNYXRoIiwicmFuZG9tIiwidG9rZW4iLCJjb21waWxlZCIsIl9uYW1lIiwiZGVmYXVsdFZhbHVlIiwiX3NpenpsZSIsIm5vQ29uZmxpY3QiLCJkZWZpbmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmYXVsdCIsImNvbW1vbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEVBOzs7Ozs7Ozs7O0FBVUE7Ozs7OztBQU1PLElBQU1BLHdDQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFDQyxJQUFELHVFQUFRLEVBQVI7QUFBQSxvQkFDeEJDLFlBQVksRUFEWSxFQUNSQyxTQUFTLEVBREQsRUFDS0MsUUFBUSxFQURiLEVBQ2lCQyxhQUFhLEVBRDlCLElBQ3FDSixJQURyQztBQUFBLENBQXRCOztBQUdQOzs7Ozs7QUFNTyxJQUFNSyxzREFBdUIsU0FBdkJBLG9CQUF1QixDQUFDSixVQUFEO0FBQUEsU0FDbENBLFdBQVdLLEdBQVgsQ0FBZSxnQkFBcUI7QUFBQSxRQUFsQkMsSUFBa0IsUUFBbEJBLElBQWtCO0FBQUEsUUFBWkMsS0FBWSxRQUFaQSxLQUFZOztBQUNsQyxRQUFJRCxTQUFTLElBQWIsRUFBbUI7QUFDakIsbUJBQVdDLEtBQVg7QUFDRDtBQUNELFFBQUlBLFVBQVUsSUFBZCxFQUFvQjtBQUNs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QUl5TyxTQUEvQyxHQUNDek8sSUFBSXRJLEtBREwsR0FFQyxJQUhGO0FBSUE7QUFDRCxHQVJEO0FBU0E7O0FBRUQ7QUFDQSxLQUFJNmQsVUFBVTFRLE9BQU9yTCxNQUFyQjs7QUFFQUEsUUFBT2djLFVBQVAsR0FBb0IsWUFBVztBQUM5QixNQUFLM1EsT0FBT3JMLE1BQVAsS0FBa0JBLE1BQXZCLEVBQWdDO0FBQy9CcUwsVUFBT3JMLE1BQVAsR0FBZ0IrYixPQUFoQjtBQUNBOztBQUVELFNBQU8vYixNQUFQO0FBQ0EsRUFORDs7QUFRQSxLQUFLLElBQUwsRUFBa0Q7QUFDakRpYyxFQUFBLGtDQUFRLFlBQVc7QUFDbEIsVUFBT2pjLE1BQVA7QUFDQSxHQUZEOztBQUlEO0FBQ0MsRUFORCxNQU1PLElBQUssT0FBT2tjLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU9DLE9BQTdDLEVBQXVEO0FBQzdERCxTQUFPQyxPQUFQLEdBQWlCbmMsTUFBakI7QUFDQSxFQUZNLE1BRUE7QUFDTnFMLFNBQU9yTCxNQUFQLEdBQWdCQSxNQUFoQjtBQUNBOztBQUVEO0FBRUMsQ0FuNkVELEVBbTZFS3FMLE1BbjZFTCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJDQ1ZTK1EsTzs7Ozs7O21CQUFtQnpSLGlCOzs7Ozs7bUJBQW1CUSxnQjs7Ozs7Ozs7OzBDQUN0Q2lSLE87Ozs7Ozs7Ozs2Q0FDQUEsTzs7Ozs7Ozs7O29CQUNBdmMsVzs7Ozs7O29CQUFhRSxlOzs7Ozs7Ozs7Ozs7UUFFVnNjLE0iLCJmaWxlIjoib3B0aW1hbC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjZlMzMzNTU3Mzc0YTQxN2M2OGEiLCIvKipcbiAqIEB0eXBlZGVmICB7T2JqZWN0fSBQYXR0ZXJuXG4gKiBAcHJvcGVydHkgeygnZGVzY2VuZGFudCcgfCAnY2hpbGQnKX0gICAgICAgICAgICAgICAgICBbcmVsYXRlc11cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt0YWddXG4gKiBAcHJvcGVydHkge0FycmF5Ljx7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZz8gfT59ICBhdHRyaWJ1dGVzXG4gKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+fSAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzXG4gKiBAcHJvcGVydHkge0FycmF5LjxzdHJpbmc+fSAgICAgICAgICAgICAgICAgICAgICAgICAgICBwc2V1ZG9cbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPEFycmF5LjxQYXR0ZXJuPj59ICAgICAgICAgICAgICAgICAgIGRlc2NlbmRhbnRzXG4gKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IHBhdHRlcm4gc3RydWN0dXJlXG4gKiBcbiAqIEBwYXJhbSB7UGFydGlhbDxQYXR0ZXJuPn0gcGF0dGVyblxuICogQHJldHVybnMge1BhdHRlcm59XG4gKi9cbmV4cG9ydCBjb25zdCBjcmVhdGVQYXR0ZXJuID0gKGJhc2UgPSB7fSkgPT5cbiAgKHsgYXR0cmlidXRlczogW10sIGNsYXNzZXM6IFtdLCBwc2V1ZG86IFtdLCBkZXNjZW5kYW50czogW10sIC4uLmJhc2UgfSlcblxuLyoqXG4gKiBDb252ZXJ0IGF0dHJpYnV0ZXMgdG8gQ1NTIHNlbGVjdG9yXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9Pn0gYXR0cmlidXRlcyBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBhdHRyaWJ1dGVzVG9TZWxlY3RvciA9IChhdHRyaWJ1dGVzKSA9PlxuICBhdHRyaWJ1dGVzLm1hcCgoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgaWYgKG5hbWUgPT09ICdpZCcpIHtcbiAgICAgIHJldHVybiBgIyR7dmFsdWV9YFxuICAgIH1cbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBgWyR7bmFtZX1dYFxuICAgIH1cbiAgICByZXR1cm4gYFske25hbWV9PVwiJHt2YWx1ZX1cIl1gXG4gIH0pLmpvaW4oJycpXG5cbi8qKlxuICogQ29udmVydCBjbGFzc2VzIHRvIENTUyBzZWxlY3RvclxuICogXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGNsYXNzZXNUb1NlbGVjdG9yID0gKGNsYXNzZXMpID0+IGNsYXNzZXMubGVuZ3RoID8gYC4ke2NsYXNzZXMuam9pbignLicpfWAgOiAnJ1xuXG4vKipcbiAqIENvbnZlcnQgcHNldWRvIHNlbGVjdG9ycyB0byBDU1Mgc2VsZWN0b3JcbiAqIFxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcHNldWRvIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBzZXVkb1RvU2VsZWN0b3IgPSAocHNldWRvKSA9PiBwc2V1ZG8ubGVuZ3RoID8gYDoke3BzZXVkby5qb2luKCc6Jyl9YCA6ICcnXG5cbi8qKlxuICogQ29udmVydCBwYXR0ZXJuIHRvIENTUyBzZWxlY3RvclxuICogXG4gKiBAcGFyYW0ge1BhdHRlcm59IHBhdHRlcm4gXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgcGF0dGVyblRvU2VsZWN0b3IgPSAocGF0dGVybikgPT4ge1xuICBjb25zdCB7IHJlbGF0ZXMsIHRhZywgYXR0cmlidXRlcywgY2xhc3NlcywgcHNldWRvIH0gPSBwYXR0ZXJuXG4gIGNvbnN0IHZhbHVlID0gYCR7XG4gICAgcmVsYXRlcyA9PT0gJ2NoaWxkJyA/ICc+ICcgOiAnJ1xuICB9JHtcbiAgICB0YWcgfHwgJydcbiAgfSR7XG4gICAgYXR0cmlidXRlc1RvU2VsZWN0b3IoYXR0cmlidXRlcylcbiAgfSR7XG4gICAgY2xhc3Nlc1RvU2VsZWN0b3IoY2xhc3NlcylcbiAgfSR7XG4gICAgcHNldWRvVG9TZWxlY3Rvcihwc2V1ZG8pXG4gIH1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIENvbnZlcnRzIHBhdGggdG8gc3RyaW5nXG4gKlxuICogQHBhcmFtIHtBcnJheS48UGF0dGVybj59IHBhdGggXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgcGF0aFRvU2VsZWN0b3IgPSAocGF0aCkgPT5cbiAgcGF0aC5tYXAocGF0dGVyblRvU2VsZWN0b3IpLmpvaW4oJyAnKVxuXG5cbmNvbnN0IGNvbnZlcnRFc2NhcGluZyA9ICh2YWx1ZSkgPT5cbiAgdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvXFxcXChbYFxcXFwvOj8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XSkvZywgJyQxJylcbiAgICAucmVwbGFjZSgvXFxcXChbJ1wiXSkvZywgJyQxJDEnKVxuICAgIC5yZXBsYWNlKC9cXFxcQSAvZywgJ1xcbicpXG5cbi8qKlxuKiBDb252ZXJ0IGF0dHJpYnV0ZXMgdG8gWFBhdGggc3RyaW5nXG4qIFxuKiBAcGFyYW0ge0FycmF5Ljx7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZz8gfT59IGF0dHJpYnV0ZXMgXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZXNUb1hQYXRoID0gKGF0dHJpYnV0ZXMpID0+XG4gIGF0dHJpYnV0ZXMubWFwKCh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBgW0Ake25hbWV9XWBcbiAgICB9XG4gICAgcmV0dXJuIGBbQCR7bmFtZX09XCIke2NvbnZlcnRFc2NhcGluZyh2YWx1ZSl9XCJdYFxuICB9KS5qb2luKCcnKVxuXG4vKipcbiogQ29udmVydCBjbGFzc2VzIHRvIFhQYXRoIHN0cmluZ1xuKiBcbiogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gY2xhc3NlcyBcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgY29uc3QgY2xhc3Nlc1RvWFBhdGggPSAoY2xhc3NlcykgPT5cbiAgY2xhc3Nlcy5tYXAoYyA9PiBgW2NvbnRhaW5zKGNvbmNhdChcIiBcIixub3JtYWxpemUtc3BhY2UoQGNsYXNzKSxcIiBcIiksXCIgJHtjfSBcIildYCkuam9pbignJylcblxuLyoqXG4qIENvbnZlcnQgcHNldWRvIHNlbGVjdG9ycyB0byBYUGF0aCBzdHJpbmdcbiogXG4qIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBzZXVkbyBcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgY29uc3QgcHNldWRvVG9YUGF0aCA9IChwc2V1ZG8pID0+XG4gIHBzZXVkby5tYXAocCA9PiB7XG4gICAgY29uc3QgbWF0Y2ggPSBwLm1hdGNoKC9eKG50aC1jaGlsZHxudGgtb2YtdHlwZXxjb250YWlucylcXCgoLispXFwpJC8pXG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgc3dpdGNoIChtYXRjaFsxXSkge1xuICAgICAgY2FzZSAnbnRoLWNoaWxkJzpcbiAgICAgICAgcmV0dXJuIGBbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSA9ICR7bWF0Y2hbMl19XWBcblxuICAgICAgY2FzZSAnbnRoLW9mLXR5cGUnOlxuICAgICAgICByZXR1cm4gYFske21hdGNoWzJdfV1gXG5cbiAgICAgIGNhc2UgJ2NvbnRhaW5zJzpcbiAgICAgICAgcmV0dXJuIGBbY29udGFpbnModGV4dCgpLCR7bWF0Y2hbMl19KV1gXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfSkuam9pbignJylcblxuLyoqXG4qIENvbnZlcnQgcGF0dGVybiB0byBYUGF0aCBzdHJpbmdcbiogXG4qIEBwYXJhbSB7UGF0dGVybn0gcGF0dGVybiBcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgY29uc3QgcGF0dGVyblRvWFBhdGggPSAocGF0dGVybikgPT4ge1xuICBjb25zdCB7IHJlbGF0ZXMsIHRhZywgYXR0cmlidXRlcywgY2xhc3NlcywgcHNldWRvLCBkZXNjZW5kYW50cyB9ID0gcGF0dGVyblxuICBjb25zdCB2YWx1ZSA9IGAke1xuICAgIHJlbGF0ZXMgPT09ICdjaGlsZCcgPyAnLycgOiAnLy8nXG4gIH0ke1xuICAgIHRhZyB8fCAnKidcbiAgfSR7XG4gICAgYXR0cmlidXRlc1RvWFBhdGgoYXR0cmlidXRlcylcbiAgfSR7XG4gICAgY2xhc3Nlc1RvWFBhdGgoY2xhc3NlcylcbiAgfSR7XG4gICAgcHNldWRvVG9YUGF0aChwc2V1ZG8pXG4gIH0ke1xuICAgIGRlc2NlbmRhbnRzVG9YUGF0aChkZXNjZW5kYW50cylcbiAgfWBcbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuKiBDb252ZXJ0cyBwYXRoIHRvIFhQYXRoIHN0cmluZ1xuKlxuKiBAcGFyYW0ge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCBcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgY29uc3QgcGF0aFRvWFBhdGggPSAocGF0aCkgPT4gYC4ke3BhdGgubWFwKHBhdHRlcm5Ub1hQYXRoKS5qb2luKCcnKX1gXG5cbi8qKlxuKiBDb252ZXJ0IGNoaWxkIHNlbGVjdG9ycyB0byBYUGF0aCBzdHJpbmdcbiogXG4qIEBwYXJhbSB7QXJyYXkuPEFycmF5LjxQYXR0ZXJuPj59IGNoaWxkcmVuIFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBkZXNjZW5kYW50c1RvWFBhdGggPSAoY2hpbGRyZW4pID0+XG4gIGNoaWxkcmVuLmxlbmd0aCA/IGBbJHtjaGlsZHJlbi5tYXAocGF0aFRvWFBhdGgpLmpvaW4oJ11bJyl9XWAgOiAnJ1xuXG4gIFxuY29uc3QgdG9TdHJpbmcgPSB7XG4gICdjc3MnOiB7XG4gICAgYXR0cmlidXRlczogYXR0cmlidXRlc1RvU2VsZWN0b3IsXG4gICAgY2xhc3NlczogY2xhc3Nlc1RvU2VsZWN0b3IsXG4gICAgcHNldWRvOiBwc2V1ZG9Ub1NlbGVjdG9yLFxuICAgIHBhdHRlcm46IHBhdHRlcm5Ub1NlbGVjdG9yLFxuICAgIHBhdGg6IHBhdGhUb1NlbGVjdG9yXG4gIH0sXG4gICd4cGF0aCc6IHtcbiAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzVG9YUGF0aCxcbiAgICBjbGFzc2VzOiBjbGFzc2VzVG9YUGF0aCxcbiAgICBwc2V1ZG86IHBzZXVkb1RvWFBhdGgsXG4gICAgcGF0dGVybjogcGF0dGVyblRvWFBhdGgsXG4gICAgcGF0aDogcGF0aFRvWFBhdGhcbiAgfSxcbiAgJ2pxdWVyeSc6IHt9XG59XG5cbnRvU3RyaW5nLmpxdWVyeSA9IHRvU3RyaW5nLmNzc1xudG9TdHJpbmdbMF0gPSB0b1N0cmluZy5jc3NcbnRvU3RyaW5nWzFdID0gdG9TdHJpbmcueHBhdGhcbiAgXG4vKipcbiAqIEB0eXBlZGVmICB7T2JqZWN0fSBUb1N0cmluZ0FwaVxuICogQHByb3BlcnR5IHsoYXR0cmlidXRlczogQXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9PikgPT4gc3RyaW5nfSBhdHRyaWJ1dGVzXG4gKiBAcHJvcGVydHkgeyhjbGFzc2VzOiBBcnJheS48c3RyaW5nPikgPT4gc3RyaW5nfSAgY2xhc3Nlc1xuICogQHByb3BlcnR5IHsocHNldWRvOiBBcnJheS48c3RyaW5nPikgPT4gc3RyaW5nfSAgIHBzZXVkb1xuICogQHByb3BlcnR5IHsocGF0dGVybjogUGF0dGVybikgPT4gc3RyaW5nfSAgICAgICAgIHBhdHRlcm5cbiAqIEBwcm9wZXJ0eSB7KHBhdGg6IEFycmF5LjxQYXR0ZXJuPikgPT4gc3RyaW5nfSAgICBwYXRoXG4gKi9cblxuLyoqXG4gKiBHZXQgYXBpIHRvIGNvbnZlcnQgcGF0aHMsIHBhdHRlcm5zIGFuZCB0aGVpciBwYXJ0cyB0byBzdHJpbmcgb2Ygc3BlY2lmaWVkIGZvcm1hdFxuICogXG4gKiBAcGFyYW0geydjc3MnIHwgJ3hwYXRoJyB8ICdqcXVlcnknIHwgMCB8IDF9IFtmb3JtYXRdIFxuICogQHJldHVybnMge1RvU3RyaW5nQXBpfVxuICovXG5leHBvcnQgY29uc3QgZ2V0VG9TdHJpbmcgPSAoZm9ybWF0KSA9PlxuICB0b1N0cmluZ1tmb3JtYXQgfHwgJ2NzcyddXG5cbi8qKlxuICogR2V0IGZ1bmN0aW9uIHRvIGNvbnZlcnQgcGF0dGVybiB0byBzdHJpbmcgb2Ygc3BlY2lmaWVkIGZvcm1hdFxuICogXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgXG4gKiBAcmV0dXJucyB7KHBhdGg6IEFycmF5LjxQYXR0ZXJuPikgPT4gc3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgZ2V0UGF0aFRvU3RyaW5nID0gKGZvcm1hdCkgPT5cbiAgZ2V0VG9TdHJpbmcoZm9ybWF0KS5wYXRoXG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhdHRlcm4uanMiLCIvLyBpbXBvcnQgU2l6emxlIGZyb20gJ3NpenpsZSdcbmxldCBTaXp6bGVcblxuLyoqXG4gKiBTZWxlY3QgZWxlbWVudCB1c2luZyBqUXVlcnlcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICBzZWxlY3RvclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudFxuICogQHJldHVybiBBcnJheS48SFRNTEVsZW1lbnQ+XG4gKi9cbmNvbnN0IHNlbGVjdEpRdWVyeSA9IChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkgPT4ge1xuICBpZiAoIVNpenpsZSkge1xuICAgIFNpenpsZSA9IHJlcXVpcmUoJ3NpenpsZScpXG4gIH1cbiAgcmV0dXJuIFNpenpsZShzZWxlY3RvciwgcGFyZW50IHx8IGRvY3VtZW50KVxufVxuICBcbi8qKlxuICogU2VsZWN0IGVsZW1lbnQgdXNpbmcgWFBhdGhcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICBzZWxlY3RvclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudFxuICogQHJldHVybiBBcnJheS48SFRNTEVsZW1lbnQ+XG4gKi9cbmNvbnN0IHNlbGVjdFhQYXRoID0gKHNlbGVjdG9yLCBwYXJlbnQgPSBudWxsKSA9PiB7XG4gIHBhcmVudCA9IChwYXJlbnQgfHwgZG9jdW1lbnQpXG4gIHZhciBkb2MgPSBwYXJlbnRcbiAgd2hpbGUgKGRvYy5wYXJlbnROb2RlKSB7XG4gICAgZG9jID0gZG9jLnBhcmVudE5vZGVcbiAgfVxuICBpZiAoZG9jICE9PSBwYXJlbnQgJiYgIXNlbGVjdG9yLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHNlbGVjdG9yID0gYC4ke3NlbGVjdG9yfWBcbiAgfVxuICB2YXIgaXRlcmF0b3IgPSBkb2MuZXZhbHVhdGUoc2VsZWN0b3IsIHBhcmVudCwgbnVsbCwgMClcbiAgdmFyIGVsZW1lbnRzID0gW11cbiAgdmFyIGVsZW1lbnRcbiAgd2hpbGUgKChlbGVtZW50ID0gaXRlcmF0b3IuaXRlcmF0ZU5leHQoKSkpIHtcbiAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpXG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRzXG59XG4gIFxuLyoqXG4gKiBTZWxlY3QgZWxlbWVudCB1c2luZyBDU1NcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICBzZWxlY3RvclxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudFxuICogQHJldHVybiBBcnJheS48SFRNTEVsZW1lbnQ+XG4gKi9cbmNvbnN0IHNlbGVjdENTUyA9IChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkgPT5cbiAgKHBhcmVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcblxuY29uc3Qgc2VsZWN0ID0ge1xuICAnY3NzJzogc2VsZWN0Q1NTLFxuICAneHBhdGgnOiBzZWxlY3RYUGF0aCxcbiAgJ2pxdWVyeSc6IHNlbGVjdEpRdWVyeVxufVxuXG5zZWxlY3RbMF0gPSBzZWxlY3QuY3NzXG5zZWxlY3RbMV0gPSBzZWxlY3QueHBhdGhcblxuLyoqXG4qIFxuKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgXG4qIEByZXR1cm5zIHsoc2VsZWN0b3I6IHN0cmluZywgcGFyZW50OiBIVE1MRWxlbWVudCkgPT4gc3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBnZXRTZWxlY3QgPSAob3B0aW9ucyA9IHt9KSA9PlxuICAoc2VsZWN0b3IsIHBhcmVudCkgPT4gc2VsZWN0W29wdGlvbnMuZm9ybWF0IHx8ICdjc3MnXShzZWxlY3RvciwgcGFyZW50IHx8IG9wdGlvbnMucm9vdClcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdG9yLmpzIiwiLyoqXG4gKiAjIFV0aWxpdGllc1xuICpcbiAqIENvbnZlbmllbmNlIGhlbHBlcnMuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgYW4gYXJyYXkgd2l0aCB0aGUgRE9NIG5vZGVzIG9mIHRoZSBsaXN0XG4gKlxuICogQHBhcmFtICB7Tm9kZUxpc3R9ICAgICAgICAgICAgIG5vZGVzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgY29udmVydE5vZGVMaXN0ID0gKG5vZGVzKSA9PiB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZXNjYXBlVmFsdWUgPSAodmFsdWUpID0+XG4gIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1snXCJgXFxcXC86PyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dL2csICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcdTAwYTAnKVxuXG4vKipcbiAqIFBhcnRpdGlvbiBhcnJheSBpbnRvIHR3byBncm91cHMgZGV0ZXJtaW5lZCBieSBwcmVkaWNhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnRpdGlvbiA9IChhcnJheSwgcHJlZGljYXRlKSA9PlxuICBhcnJheS5yZWR1Y2UoXG4gICAgKFtpbm5lciwgb3V0ZXJdLCBpdGVtKSA9PiBwcmVkaWNhdGUoaXRlbSkgPyBbaW5uZXIuY29uY2F0KGl0ZW0pLCBvdXRlcl0gOiBbaW5uZXIsIG91dGVyLmNvbmNhdChpdGVtKV0sXG4gICAgW1tdLCBbXV1cbiAgKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxpdGllcy5qcyIsIi8qKlxuICogIyBDb21tb25cbiAqXG4gKiBQcm9jZXNzIGNvbGxlY3Rpb25zIGZvciBzaW1pbGFyaXRpZXMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIEZpbmQgdGhlIGxhc3QgY29tbW9uIGFuY2VzdG9yIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29tbW9uQW5jZXN0b3IgPSAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb21tb25Qcm9wZXJ0aWVzID0gKGVsZW1lbnRzKSA9PiB7XG5cbiAgY29uc3QgY29tbW9uUHJvcGVydGllcyA9IHtcbiAgICBjbGFzc2VzOiBbXSxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICB0YWc6IG51bGxcbiAgfVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgIHZhciB7XG4gICAgICBjbGFzc2VzOiBjb21tb25DbGFzc2VzLFxuICAgICAgYXR0cmlidXRlczogY29tbW9uQXR0cmlidXRlcyxcbiAgICAgIHRhZzogY29tbW9uVGFnXG4gICAgfSA9IGNvbW1vblByb3BlcnRpZXNcblxuICAgIC8vIH4gY2xhc3Nlc1xuICAgIGlmIChjb21tb25DbGFzc2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpXG4gICAgICAgIGlmICghY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQ2xhc3NlcyA9IGNvbW1vbkNsYXNzZXMuZmlsdGVyKChlbnRyeSkgPT4gY2xhc3Nlcy5zb21lKChuYW1lKSA9PiBuYW1lID09PSBlbnRyeSkpXG4gICAgICAgICAgaWYgKGNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjb21tb25DbGFzc2VzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHJlc3RydWN0dXJlIHJlbW92YWwgYXMgMnggc2V0IC8gMnggZGVsZXRlLCBpbnN0ZWFkIG9mIG1vZGlmeSBhbHdheXMgcmVwbGFjaW5nIHdpdGggbmV3IGNvbGxlY3Rpb25cbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gYXR0cmlidXRlc1xuICAgIGlmIChjb21tb25BdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZWxlbWVudEF0dHJpYnV0ZXMpLnJlZHVjZSgoYXR0cmlidXRlcywga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGVsZW1lbnRBdHRyaWJ1dGVzW2tleV1cbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgICAgIC8vIE5PVEU6IHdvcmthcm91bmQgZGV0ZWN0aW9uIGZvciBub24tc3RhbmRhcmQgcGhhbnRvbWpzIE5hbWVkTm9kZU1hcCBiZWhhdmlvdXJcbiAgICAgICAgLy8gKGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXJpeWEvcGhhbnRvbWpzL2lzc3Vlcy8xNDYzNClcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9LCB7fSlcblxuICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcylcbiAgICAgIGNvbnN0IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpXG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICghY29tbW9uQXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25BdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc05hbWVzLnJlZHVjZSgobmV4dENvbW1vbkF0dHJpYnV0ZXMsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29tbW9uQXR0cmlidXRlc1tuYW1lXVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBhdHRyaWJ1dGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgIG5leHRDb21tb25BdHRyaWJ1dGVzW25hbWVdID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0Q29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gdGFnXG4gICAgaWYgKGNvbW1vblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB0YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKCFjb21tb25UYWcpIHtcbiAgICAgICAgY29tbW9uUHJvcGVydGllcy50YWcgPSB0YWdcbiAgICAgIH0gZWxzZSBpZiAodGFnICE9PSBjb21tb25UYWcpIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMudGFnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBjb21tb25Qcm9wZXJ0aWVzXG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24uanMiLCIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZSBzZWxlY3RvciBmb3IgYSBub2RlLlxuICovXG5cbmltcG9ydCB7IGNyZWF0ZVBhdHRlcm4sIGdldFRvU3RyaW5nIH0gZnJvbSAnLi9wYXR0ZXJuJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9zZWxlY3RvcidcbmltcG9ydCB7IGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3BhdHRlcm4nKS5QYXR0ZXJufSBQYXR0ZXJuXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3BhdHRlcm4nKS5Ub1N0cmluZ0FwaX0gUGF0dGVyblxuICovXG5cbmNvbnN0IGRlZmF1bHRJZ25vcmUgPSB7XG4gIGF0dHJpYnV0ZSAoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBbXG4gICAgICAnc3R5bGUnLFxuICAgICAgJ2RhdGEtcmVhY3RpZCcsXG4gICAgICAnZGF0YS1yZWFjdC1jaGVja3N1bSdcbiAgICBdLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPiAtMVxuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIG9mIHRoZSBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48UGF0dGVybj59ICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucyA9IHt9KSB7XG4gIG9wdGlvbnMgPSB7XG4gICAgcm9vdDogZG9jdW1lbnQsXG4gICAgc2tpcDogbnVsbCxcbiAgICBwcmlvcml0eTogWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZToge30sXG4gICAgLi4ub3B0aW9uc1xuICB9XG4gIGNvbnN0IHsgcm9vdCwgc2tpcCwgaWdub3JlLCBmb3JtYXQgfSA9IG9wdGlvbnNcblxuICBjb25zdCBwYXRoID0gW11cbiAgbGV0IGVsZW1lbnQgPSBub2RlXG4gIGxldCBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcbiAgY29uc3QgdG9TdHJpbmcgPSBnZXRUb1N0cmluZyhvcHRpb25zLmZvcm1hdClcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGlnbm9yZVt0eXBlXVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnZnVuY3Rpb24nKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZS50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgcHJlZGljYXRlID0gbmV3IFJlZ0V4cChlc2NhcGVWYWx1ZShwcmVkaWNhdGUpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZSA/IC8oPzopLyA6IC8uXi9cbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gKG5hbWUsIHZhbHVlKSA9PiBwcmVkaWNhdGUudGVzdCh2YWx1ZSlcbiAgfSlcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxMSkge1xuICAgIGlmIChza2lwQ2hlY2tzKGVsZW1lbnQpICE9PSB0cnVlKSB7XG4gICAgICAvLyB+IGdsb2JhbFxuICAgICAgaWYgKGNoZWNrQXR0cmlidXRlcyhlbGVtZW50LCBwYXRoLCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nLCByb290KSkgYnJlYWtcbiAgICAgIGlmIChjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nLCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMsIHNlbGVjdCwgdG9TdHJpbmcpXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nKVxuICAgICAgfVxuXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCAmJiBbMSwgJ3hwYXRoJ10uaW5jbHVkZXMoZm9ybWF0KSkge1xuICAgICAgICBjaGVja1JlY3Vyc2l2ZURlc2NlbmRhbnRzKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMsIHNlbGVjdCwgdG9TdHJpbmcpXG4gICAgICB9XG5cbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoICYmIFsxLCAneHBhdGgnLCAnanF1ZXJ5J10uaW5jbHVkZXMoZm9ybWF0KSkge1xuICAgICAgICBjaGVja1RleHQoZWxlbWVudCwgcGF0aCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZywgZm9ybWF0ID09PSAnanF1ZXJ5JylcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tOdGhDaGlsZChlbGVtZW50LCBwYXRoLCBvcHRpb25zKVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IHJvb3QpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gZmluZFBhdHRlcm4oZWxlbWVudCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZylcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgICBwYXJlbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGNoZWNrQXR0cmlidXRlcyA9IChlbGVtZW50LCBwYXRoLCB7IHByaW9yaXR5LCBpZ25vcmUgfSwgc2VsZWN0LCB0b1N0cmluZywgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSA9PiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCB0b1N0cmluZywgcGFyZW50KVxuICBpZiAocGF0dGVybikge1xuICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogR2V0IGNvbWJpbmF0aW9uc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSB2YWx1ZXMgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+P30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBjb21iaW5hdGlvbnMgPSAodmFsdWVzKSA9PiB7XG4gIGxldCByZXN1bHQgPSBbW11dXG5cbiAgdmFsdWVzLmZvckVhY2goYyA9PiB7XG4gICAgcmVzdWx0LmZvckVhY2gociA9PiByZXN1bHQucHVzaChyLmNvbmNhdChjKSkpXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICBiYXNlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPHN0cmluZz4/fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGdldENsYXNzU2VsZWN0b3IgPSAoY2xhc3NlcyA9IFtdLCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQsIGJhc2UpID0+IHtcbiAgbGV0IHJlc3VsdCA9IGNvbWJpbmF0aW9ucyhjbGFzc2VzKVxuXG4gIGZvcihsZXQgaSA9IDA7IGkgPCByZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gdG9TdHJpbmcucGF0dGVybih7IC4uLmJhc2UsIGNsYXNzZXM6IHJlc3VsdFtpXSB9KVxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybiwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHJlc3VsdFtpXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogTG9va3VwIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICB0b1N0cmluZyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXJlbnROb2RlfSAgICAgcGFyZW50ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybj99ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgZmluZEF0dHJpYnV0ZXNQYXR0ZXJuID0gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCwgdG9TdHJpbmcsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgPT4ge1xuICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gIHZhciBhdHRyaWJ1dGVOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLm1hcCgodmFsKSA9PiBhdHRyaWJ1dGVzW3ZhbF0ubmFtZSlcbiAgICAuZmlsdGVyKChhKSA9PiBwcmlvcml0eS5pbmRleE9mKGEpIDwgMClcblxuICB2YXIgc29ydGVkS2V5cyA9IFsgLi4ucHJpb3JpdHksIC4uLmF0dHJpYnV0ZU5hbWVzIF1cbiAgdmFyIHBhdHRlcm4gPSBjcmVhdGVQYXR0ZXJuKClcbiAgcGF0dGVybi50YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuXG4gIHZhciBpc09wdGltYWwgPSAocGF0dGVybikgPT4gKHNlbGVjdCh0b1N0cmluZy5wYXR0ZXJuKHBhdHRlcm4pLCBwYXJlbnQpLmxlbmd0aCA9PT0gMSlcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUpXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLnZhbHVlKVxuICAgIGNvbnN0IHVzZU5hbWVkSWdub3JlID0gYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBpZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBjb25zdCBjdXJyZW50RGVmYXVsdElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHN3aXRjaCAoYXR0cmlidXRlTmFtZSkge1xuICAgICAgY2FzZSAnY2xhc3MnOiB7XG4gICAgICAgIGxldCBjbGFzc05hbWVzID0gYXR0cmlidXRlVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpXG4gICAgICAgIGNvbnN0IGNsYXNzSWdub3JlID0gaWdub3JlLmNsYXNzIHx8IGRlZmF1bHRJZ25vcmUuY2xhc3NcbiAgICAgICAgaWYgKGNsYXNzSWdub3JlKSB7XG4gICAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3NJZ25vcmUoY2xhc3NOYW1lKSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xhc3NOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29uc3QgY2xhc3NlcyA9IGdldENsYXNzU2VsZWN0b3IoY2xhc3NOYW1lcywgc2VsZWN0LCB0b1N0cmluZywgcGFyZW50LCBwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgICAgICBwYXR0ZXJuLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgICAgICBpZiAoaXNPcHRpbWFsKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHBhdHRlcm4uYXR0cmlidXRlcy5wdXNoKHsgbmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWU6IGF0dHJpYnV0ZVZhbHVlIH0pXG4gICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICByZXR1cm4gcGF0dGVyblxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgIGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICBzZWxlY3QgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tUYWcgPSAoZWxlbWVudCwgcGF0aCwgeyBpZ25vcmUgfSwgc2VsZWN0LCB0b1N0cmluZywgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSA9PiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgbGV0IG1hdGNoZXMgPSBbXVxuICAgIG1hdGNoZXMgPSBzZWxlY3QodG9TdHJpbmcucGF0dGVybihwYXR0ZXJuKSwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICBpZiAocGF0dGVybi50YWcgPT09ICdpZnJhbWUnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm4/fSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBmaW5kVGFnUGF0dGVybiA9IChlbGVtZW50LCBpZ25vcmUpID0+IHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgY29uc3QgcGF0dGVybiA9IGNyZWF0ZVBhdHRlcm4oKVxuICBwYXR0ZXJuLnRhZyA9IHRhZ05hbWVcbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgIGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGNoZWNrTnRoQ2hpbGQgPSAoZWxlbWVudCwgcGF0aCwgeyBpZ25vcmUgfSkgPT4ge1xuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkID09PSBlbGVtZW50KSB7XG4gICAgICBjb25zdCBjaGlsZFBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihjaGlsZCwgaWdub3JlKVxuICAgICAgaWYgKCFjaGlsZFBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICAgICAgRWxlbWVudCBjb3VsZG4ndCBiZSBtYXRjaGVkIHRocm91Z2ggc3RyaWN0IGlnbm9yZSBwYXR0ZXJuIVxuICAgICAgICBgLCBjaGlsZCwgaWdub3JlLCBjaGlsZFBhdHRlcm4pXG4gICAgICB9XG4gICAgICBjaGlsZFBhdHRlcm4ucmVsYXRlcyA9ICdjaGlsZCdcbiAgICAgIGNoaWxkUGF0dGVybi5wc2V1ZG8gPSBbYG50aC1jaGlsZCgke2krMX0pYF1cbiAgICAgIHBhdGgudW5zaGlmdChjaGlsZFBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGNvbnRhaW5zXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICAgIG5lc3RlZCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tUZXh0ID0gKGVsZW1lbnQsIHBhdGgsIHsgaWdub3JlIH0sIHNlbGVjdCwgdG9TdHJpbmcsIG5lc3RlZCkgPT4ge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCB0ZXh0Q29udGVudCA9IChuZXN0ZWQgPyBlbGVtZW50LnRleHRDb250ZW50IDogKGVsZW1lbnQuZmlyc3RDaGlsZCAmJiBlbGVtZW50LmZpcnN0Q2hpbGQubm9kZVZhbHVlKSB8fCAnJylcbiAgaWYgKCF0ZXh0Q29udGVudCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcGF0dGVybi5yZWxhdGVzID0gJ2NoaWxkJ1xuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgdGV4dHMgPSB0ZXh0Q29udGVudFxuICAgIC5yZXBsYWNlKC9cXG4rL2csICdcXG4nKVxuICAgIC5zcGxpdCgnXFxuJylcbiAgICAubWFwKHRleHQgPT4gdGV4dC50cmltKCkpXG4gICAgLmZpbHRlcih0ZXh0ID0+IHRleHQubGVuZ3RoID4gMClcblxuICBjb25zdCBjb250YWlucyA9IFtdXG5cbiAgd2hpbGUgKHRleHRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCB0ZXh0ID0gdGV4dHMuc2hpZnQoKVxuICAgIGlmIChjaGVja0lnbm9yZShpZ25vcmUuY29udGFpbnMsIG51bGwsIHRleHQpKSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBjb250YWlucy5wdXNoKGBjb250YWlucyhcIiR7dGV4dH1cIilgKVxuICBcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHRvU3RyaW5nLnBhdHRlcm4oeyAuLi5wYXR0ZXJuLCBwc2V1ZG86IGNvbnRhaW5zIH0pLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXR0ZXJuLnBzZXVkbyA9IGNvbnRhaW5zXG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggZGVzY2VuZGFudCB0YWdcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGNoZWNrUmVjdXJzaXZlRGVzY2VuZGFudHMgPSAoZWxlbWVudCwgcGF0aCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgb3B0aW9ucy5pZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgZGVzY2VuZGFudHMgPSBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKicpKVxuICB3aGlsZSAoZGVzY2VuZGFudHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnRQYXRoID0gbWF0Y2goZGVzY2VuZGFudHMuc2hpZnQoKSwgeyAuLi5vcHRpb25zLCByb290OiBlbGVtZW50IH0pXG4gICAgLy8gYXZvaWQgZGVzY2VuZGFudCBzZWxlY3RvcnMgd2l0aCBudGgtY2hpbGRcbiAgICBpZiAoIWRlc2NlbmRhbnRQYXRoLnNvbWUocGF0dGVybiA9PiBwYXR0ZXJuLnBzZXVkby5zb21lKHAgPT4gcC5zdGFydHNXaXRoKCdudGgtY2hpbGQnKSkpKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QodG9TdHJpbmcucGF0dGVybih7IC4uLnBhdHRlcm4sIGRlc2NlbmRhbnRzOiBbZGVzY2VuZGFudFBhdGhdIH0pLCBwYXJlbnQpXG4gICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcGF0dGVybi5kZXNjZW5kYW50cyA9IFtkZXNjZW5kYW50UGF0aF1cbiAgICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgb3B0aW9ucyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBmaW5kUGF0dGVybiA9IChlbGVtZW50LCB7IHByaW9yaXR5LCBpZ25vcmUgfSwgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICB2YXIgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHRvU3RyaW5nKVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICB9XG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogVmFsaWRhdGUgd2l0aCBjdXN0b20gYW5kIGRlZmF1bHQgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHByZWRpY2F0ZSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgbmFtZSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259IGRlZmF1bHRQcmVkaWNhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tJZ25vcmUgPSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkgPT4ge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9zZWxlY3RvcidcbmltcG9ydCB7IGNyZWF0ZVBhdHRlcm4sIGdldFRvU3RyaW5nIH0gZnJvbSAnLi9wYXR0ZXJuJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0LCBwYXJ0aXRpb24gfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlRvU3RyaW5nQXBpfSBQYXR0ZXJuXG4gKi9cblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICAgICAgICAgICAgICBwYXRoICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChwYXRoLCBlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgaWYgKHBhdGhbMF0ucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIHBhdGhbMF0ucmVsYXRlcyA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gY29udmVydCBzaW5nbGUgZW50cnkgYW5kIE5vZGVMaXN0XG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9ICFlbGVtZW50cy5sZW5ndGggPyBbZWxlbWVudHNdIDogY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50cy5sZW5ndGggfHwgZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSB0byBjb21wYXJlIEhUTUxFbGVtZW50cyBpdHMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSByZWZlcmVuY2Ugb2YgdGhlIHNlbGVjdGVkIG5vZGUocykhIChtaXNzaW5nIFwiZWxlbWVudHNcIiknKVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG4gIGNvbnN0IHRvU3RyaW5nID0gZ2V0VG9TdHJpbmcob3B0aW9ucy5mb3JtYXQpXG5cbiAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIFtvcHRpbWl6ZVBhcnQoW10sIHBhdGhbMF0sIFtdLCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZyldXG4gIH1cblxuICB2YXIgZW5kT3B0aW1pemVkID0gZmFsc2VcbiAgaWYgKHBhdGhbcGF0aC5sZW5ndGgtMV0ucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aC5zbGljZSgwLCAtMSksIHBhdGhbcGF0aC5sZW5ndGgtMV0sIFtdLCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZylcbiAgICBlbmRPcHRpbWl6ZWQgPSB0cnVlXG4gIH1cblxuICBwYXRoID0gWy4uLnBhdGhdXG4gIGNvbnN0IHNob3J0ZW5lZCA9IFtwYXRoLnBvcCgpXVxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHRvU3RyaW5nLnBhdGgoWy4uLnBhdGgsIC4uLnNob3J0ZW5lZF0pKVxuICAgIGNvbnN0IGhhc1NhbWVSZXN1bHQgPSBtYXRjaGVzLmxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoICYmIGVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50LCBpKSA9PiBlbGVtZW50ID09PSBtYXRjaGVzW2ldKVxuICAgIGlmICghaGFzU2FtZVJlc3VsdCkge1xuICAgICAgc2hvcnRlbmVkLnVuc2hpZnQob3B0aW1pemVQYXJ0KHBhdGgsIGN1cnJlbnQsIHNob3J0ZW5lZCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpKVxuICAgIH1cbiAgfVxuICBzaG9ydGVuZWQudW5zaGlmdChwYXRoWzBdKVxuICBwYXRoID0gc2hvcnRlbmVkXG5cbiAgLy8gb3B0aW1pemUgc3RhcnQgKyBlbmRcbiAgcGF0aFswXSA9IG9wdGltaXplUGFydChbXSwgcGF0aFswXSwgcGF0aC5zbGljZSgxKSwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpXG4gIGlmICghZW5kT3B0aW1pemVkKSB7XG4gICAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgW10sIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKVxuICB9XG5cbiAgcmV0dXJuIHBhdGhcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSA6Y29udGFpbnNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVUZXh0ID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+IHtcbiAgY29uc3QgW2NvbnRhaW5zLCBvdGhlcl0gPSBwYXJ0aXRpb24oY3VycmVudC5wc2V1ZG8sIChpdGVtKSA9PiBpdGVtLnN0YXJ0c1dpdGgoJ2NvbnRhaW5zJykpXG5cbiAgaWYgKGNvbnRhaW5zLmxlbmd0aCA+IDAgJiYgcG9zdC5sZW5ndGgpIHtcbiAgICBjb25zdCBiYXNlID0geyAuLi5jdXJyZW50LCBwc2V1ZG86IFsuLi5vdGhlciwgLi4uY29udGFpbnNdIH1cbiAgICB3aGlsZSAoYmFzZS5wc2V1ZG8ubGVuZ3RoID4gb3RoZXIubGVuZ3RoKSB7XG4gICAgICBjb25zdCBvcHRpbWl6ZWQgPSBiYXNlLnBzZXVkby5zbGljZSgwLCAtMSlcbiAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoc2VsZWN0KHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgeyAuLi5iYXNlLCBwc2V1ZG86IG9wdGltaXplZCB9LCAuLi5wb3N0XSkpLCBlbGVtZW50cykpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGJhc2UucHNldWRvID0gb3B0aW1pemVkXG4gICAgfVxuICAgIHJldHVybiBiYXNlXG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBhdHRyaWJ1dGVzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcHJlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHBvc3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IG9wdGltaXplQXR0cmlidXRlcyA9IChwcmUsIGN1cnJlbnQsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIC8vIHJlZHVjZSBhdHRyaWJ1dGVzOiBmaXJzdCB0cnkgd2l0aG91dCB2YWx1ZSwgdGhlbiByZW1vdmluZyBjb21wbGV0ZWx5XG4gIGlmIChjdXJyZW50LmF0dHJpYnV0ZXMubGVuZ3RoID4gMCkge1xuICAgIGxldCBhdHRyaWJ1dGVzID0gWy4uLmN1cnJlbnQuYXR0cmlidXRlc11cblxuICAgIGNvbnN0IHNpbXBsaWZ5ID0gKG9yaWdpbmFsLCBnZXRTaW1wbGlmaWVkKSA9PiB7XG4gICAgICBsZXQgaSA9IG9yaWdpbmFsLmxlbmd0aCAtIDFcbiAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgbGV0IGF0dHJpYnV0ZXMgPSBnZXRTaW1wbGlmaWVkKG9yaWdpbmFsLCBpKVxuICAgICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKFxuICAgICAgICAgIHNlbGVjdCh0b1N0cmluZy5wYXRoKFsuLi5wcmUsIHsgLi4uY3VycmVudCwgYXR0cmlidXRlcyB9LCAuLi5wb3N0XSkpLFxuICAgICAgICAgIGVsZW1lbnRzXG4gICAgICAgICkpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGktLVxuICAgICAgICBvcmlnaW5hbCA9IGF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmlnaW5hbFxuICAgIH1cblxuICAgIGNvbnN0IHNpbXBsaWZpZWQgPSBzaW1wbGlmeShhdHRyaWJ1dGVzLCAoYXR0cmlidXRlcywgaSkgPT4ge1xuICAgICAgY29uc3QgeyBuYW1lIH0gPSBhdHRyaWJ1dGVzW2ldXG4gICAgICBpZiAobmFtZSA9PT0gJ2lkJykge1xuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfVxuICAgICAgcmV0dXJuIFsuLi5hdHRyaWJ1dGVzLnNsaWNlKDAsIGkpLCB7IG5hbWUsIHZhbHVlOiBudWxsIH0sIC4uLmF0dHJpYnV0ZXMuc2xpY2UoaSArIDEpXVxuICAgIH0pXG4gICAgcmV0dXJuIHsgLi4uY3VycmVudCwgYXR0cmlidXRlczogc2ltcGxpZnkoc2ltcGxpZmllZCwgYXR0cmlidXRlcyA9PiBhdHRyaWJ1dGVzLnNsaWNlKDAsIC0xKSkgfSAgICBcbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGRlc2NlbmRhbnRcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVEZXNjZW5kYW50ID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+IHtcbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmIChjdXJyZW50LnJlbGF0ZXMgPT09ICdjaGlsZCcpIHtcbiAgICBjb25zdCBkZXNjZW5kYW50ID0geyAuLi5jdXJyZW50LCByZWxhdGVzOiB1bmRlZmluZWQgfVxuICAgIGxldCBtYXRjaGVzID0gc2VsZWN0KHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgZGVzY2VuZGFudCwgLi4ucG9zdF0pKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIHJldHVybiBkZXNjZW5kYW50XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgcmVjdXJzaXZlIGRlc2NlbmRhbnRzXG4gKiBcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZVJlY3Vyc2l2ZURlc2NlbmRhbnRzID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+IHtcbiAgaWYgKGN1cnJlbnQuZGVzY2VuZGFudHMubGVuZ3RoID4gMCAmJiBwb3N0Lmxlbmd0aCkge1xuICAgIGNvbnN0IGJhc2UgPSB7IC4uLmN1cnJlbnQsIGRlc2NlbmRhbnRzOiBbLi4uY3VycmVudC5kZXNjZW5kYW50c10gfVxuICAgIHdoaWxlIChiYXNlLmRlc2NlbmRhbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG9wdGltaXplZCA9IGJhc2UuZGVzY2VuZGFudHMuc2xpY2UoMCwgLTEpXG4gICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKHNlbGVjdCh0b1N0cmluZy5wYXRoKFsuLi5wcmUsIHsgLi4uYmFzZSwgZGVzY2VuZGFudHM6IG9wdGltaXplZCB9LCAuLi5wb3N0XSkpLCBlbGVtZW50cykpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGJhc2UuZGVzY2VuZGFudHMgPSBvcHRpbWl6ZWRcbiAgICB9XG4gICAgcmV0dXJuIGJhc2VcbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIG50aCBvZiB0eXBlXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcHJlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHBvc3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IG9wdGltaXplTnRoT2ZUeXBlID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+IHtcbiAgY29uc3QgaSA9IGN1cnJlbnQucHNldWRvLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uc3RhcnRzV2l0aCgnbnRoLWNoaWxkJykpXG4gIC8vIHJvYnVzdG5lc3M6ICdudGgtb2YtdHlwZScgaW5zdGVhZCAnbnRoLWNoaWxkJyAoaGV1cmlzdGljKVxuICBpZiAoaSA+PSAwKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgY29tcGxldGUgY292ZXJhZ2Ugb2YgJ250aC1vZi10eXBlJyByZXBsYWNlbWVudFxuICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50LnBzZXVkb1tpXS5yZXBsYWNlKC9ebnRoLWNoaWxkLywgJ250aC1vZi10eXBlJylcbiAgICBjb25zdCBudGhPZlR5cGUgPSB7IC4uLmN1cnJlbnQsIHBzZXVkbzogWy4uLmN1cnJlbnQucHNldWRvLnNsaWNlKDAsIGkpLCB0eXBlLCAuLi5jdXJyZW50LnBzZXVkby5zbGljZShpICsgMSldIH1cbiAgICBsZXQgcGF0dGVybiA9IHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgbnRoT2ZUeXBlLCAuLi5wb3N0XSlcbiAgICBsZXQgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIHJldHVybiBudGhPZlR5cGVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBjbGFzc2VzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcHJlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHBvc3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IG9wdGltaXplQ2xhc3NlcyA9IChwcmUsIGN1cnJlbnQsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIC8vIGVmZmljaWVuY3k6IGNvbWJpbmF0aW9ucyBvZiBjbGFzc25hbWUgKHBhcnRpYWwgcGVybXV0YXRpb25zKVxuICBpZiAoY3VycmVudC5jbGFzc2VzLmxlbmd0aCA+IDEpIHtcbiAgICBsZXQgb3B0aW1pemVkID0gY3VycmVudC5jbGFzc2VzLnNsaWNlKCkuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcblxuICAgIHdoaWxlIChvcHRpbWl6ZWQubGVuZ3RoID4gMSkge1xuICAgICAgb3B0aW1pemVkLnNoaWZ0KClcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSB0b1N0cmluZy5wYXRoKFsuLi5wcmUsIHsgLi4uY3VycmVudCwgY2xhc3Nlczogb3B0aW1pemVkIH0sIC4uLnBvc3RdKVxuICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhzZWxlY3QocGF0dGVybiksIGVsZW1lbnRzKSkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY3VycmVudC5jbGFzc2VzID0gb3B0aW1pemVkXG4gICAgfVxuXG4gICAgb3B0aW1pemVkID0gY3VycmVudC5jbGFzc2VzXG5cbiAgICBpZiAob3B0aW1pemVkLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IGJhc2UgPSBjcmVhdGVQYXR0ZXJuKHsgY2xhc3Nlczogb3B0aW1pemVkIH0pXG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gc2VsZWN0KHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgYmFzZV0pKVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWZlcmVuY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbaV1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSkpIHtcbiAgICAgICAgICAvLyBUT0RPOlxuICAgICAgICAgIC8vIC0gY2hlY2sgdXNpbmcgYXR0cmlidXRlcyArIHJlZ2FyZCBleGNsdWRlc1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY3JlYXRlUGF0dGVybih7IHRhZ05hbWU6IHJlZmVyZW5jZS50YWdOYW1lIH0pXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSB0b1N0cmluZy5wYXRoKFsuLi5wcmUsIGNyZWF0ZVBhdHRlcm4oeyB0YWdOYW1lOiByZWZlcmVuY2UudGFnTmFtZSB9KSwgLi4ucG9zdF0pXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gZGVzY3JpcHRpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG5jb25zdCBvcHRpbWl6ZXJzID0gW1xuICBvcHRpbWl6ZVRleHQsXG4gIG9wdGltaXplQXR0cmlidXRlcyxcbiAgb3B0aW1pemVEZXNjZW5kYW50LFxuICBvcHRpbWl6ZVJlY3Vyc2l2ZURlc2NlbmRhbnRzLFxuICBvcHRpbWl6ZU50aE9mVHlwZSxcbiAgb3B0aW1pemVDbGFzc2VzLFxuXVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVQYXJ0ID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+XG4gIG9wdGltaXplcnMucmVkdWNlKChhY2MsIG9wdGltaXplcikgPT4gb3B0aW1pemVyKHByZSwgYWNjLCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZyksIGN1cnJlbnQpXG5cbi8qKlxuICogRXZhbHVhdGUgbWF0Y2hlcyB3aXRoIGV4cGVjdGVkIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gbWF0Y2hlcyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgY29tcGFyZVJlc3VsdHMgPSAobWF0Y2hlcywgZWxlbWVudHMpID0+IHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG1hdGNoZXNcbiAgcmV0dXJuIGxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoICYmIGVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1hdGNoZXNbaV0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb3B0aW1pemUuanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJ1xuaW1wb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QsIGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRDb21tb25BbmNlc3RvciwgZ2V0Q29tbW9uUHJvcGVydGllcyB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9zZWxlY3RvcidcbmltcG9ydCB7IGNyZWF0ZVBhdHRlcm4sIGdldFBhdGhUb1N0cmluZyB9IGZyb20gJy4vcGF0dGVybidcblxuLyoqXG4gKiBAdHlwZWRlZiAge09iamVjdH0gT3B0aW9uc1xuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gW3Jvb3RdICAgICAgICAgICAgICAgICAgICAgT3B0aW9uYWxseSBzcGVjaWZ5IHRoZSByb290IGVsZW1lbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24gfCBBcnJheS48SFRNTEVsZW1lbnQ+fSBbc2tpcF0gIFNwZWNpZnkgZWxlbWVudHMgdG8gc2tpcFxuICogQHByb3BlcnR5IHtBcnJheS48c3RyaW5nPn0gW3ByaW9yaXR5XSAgICAgICAgICAgICAgT3JkZXIgb2YgYXR0cmlidXRlIHByb2Nlc3NpbmdcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0PHN0cmluZywgZnVuY3Rpb24gfCBudW1iZXIgfCBzdHJpbmcgfCBib29sZWFufSBbaWdub3JlXSBEZWZpbmUgcGF0dGVybnMgd2hpY2ggc2hvdWxkbid0IGJlIGluY2x1ZGVkXG4gKiBAcHJvcGVydHkgeygnY3NzJ3wneHBhdGgnfCdqcXVlcnknKX0gW2Zvcm1hdF0gICAgICBPdXRwdXQgZm9ybWF0ICAgIFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9wYXR0ZXJuJykuUGF0dGVybn0gUGF0dGVyblxuICovXG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgcGF0aCBmb3IgdGhlIHByb3ZpZGVkIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRTaW5nbGVTZWxlY3RvclBhdGggPSAoZWxlbWVudCwgb3B0aW9ucyA9IHt9KSA9PiB7XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDMpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIH1cblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBwYXRoID0gbWF0Y2goZWxlbWVudCwgb3B0aW9ucylcbiAgY29uc3Qgb3B0aW1pemVkUGF0aCA9IG9wdGltaXplKHBhdGgsIGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgLy8gZGVidWdcbiAgLy8gY29uc29sZS5sb2coYFxuICAvLyAgIHNlbGVjdG9yOiAgJHtwYXRofVxuICAvLyAgIG9wdGltaXplZDogJHtvcHRpbWl6ZWRQYXRofVxuICAvLyBgKVxuXG4gIHJldHVybiBvcHRpbWl6ZWRQYXRoXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3Igc3RyaW5nIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNpbmdsZVNlbGVjdG9yID0gKGVsZW1lbnQsIG9wdGlvbnMgPXt9KSA9PlxuICBnZXRQYXRoVG9TdHJpbmcob3B0aW9ucy5mb3JtYXQpKGdldFNpbmdsZVNlbGVjdG9yUGF0aChlbGVtZW50LCBvcHRpb25zKSlcblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBwYXRoIHRvIG1hdGNoIG11bHRpcGxlIGRlc2NlbmRhbnRzIGZyb20gYW4gYW5jZXN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fE5vZGVMaXN0fSBlbGVtZW50cyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRNdWx0aVNlbGVjdG9yUGF0aCA9IChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSA9PiB7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IC0gb25seSBhbiBBcnJheSBvZiBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gaXMgc3VwcG9ydGVkIScpXG4gIH1cblxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcbiAgY29uc3QgdG9TdHJpbmcgPSBnZXRQYXRoVG9TdHJpbmcob3B0aW9ucy5mb3JtYXQpXG5cbiAgY29uc3QgYW5jZXN0b3IgPSBnZXRDb21tb25BbmNlc3RvcihlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3QgYW5jZXN0b3JQYXRoID0gbWF0Y2goYW5jZXN0b3IsIG9wdGlvbnMpXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgdXNhZ2Ugb2YgbXVsdGlwbGUgc2VsZWN0b3JzICsgcGFyZW50LWNoaWxkIHJlbGF0aW9uICsgY2hlY2sgZm9yIHBhcnQgcmVkdW5kYW5jeVxuICBjb25zdCBjb21tb25QYXRoID0gZ2V0Q29tbW9uUGF0aChlbGVtZW50cylcbiAgY29uc3QgZGVzY2VuZGFudFBhdHRlcm4gPSBjb21tb25QYXRoWzBdXG5cbiAgY29uc3Qgc2VsZWN0b3JQYXRoID0gb3B0aW1pemUoWy4uLmFuY2VzdG9yUGF0aCwgZGVzY2VuZGFudFBhdHRlcm5dLCBlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0b3JNYXRjaGVzID0gY29udmVydE5vZGVMaXN0KHNlbGVjdCh0b1N0cmluZyhzZWxlY3RvclBhdGgpKSlcblxuICBpZiAoIWVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiBzZWxlY3Rvck1hdGNoZXMuc29tZSgoZW50cnkpID0+IGVudHJ5ID09PSBlbGVtZW50KSApKSB7XG4gICAgLy8gVE9ETzogY2x1c3RlciBtYXRjaGVzIHRvIHNwbGl0IGludG8gc2ltaWxhciBncm91cHMgZm9yIHN1YiBzZWxlY3Rpb25zXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICBUaGUgc2VsZWN0ZWQgZWxlbWVudHMgY2FuJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLlxuICAgICAgSXRzIHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCFcbiAgICBgLCBlbGVtZW50cylcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclBhdGhcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBzdHJpbmcgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPFBhdHRlcm4+fSAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldE11bHRpU2VsZWN0b3IgPSAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkgPT5cbiAgZ2V0UGF0aFRvU3RyaW5nKG9wdGlvbnMuZm9ybWF0KShnZXRNdWx0aVNlbGVjdG9yUGF0aChlbGVtZW50cywgb3B0aW9ucykpXG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgZ2V0Q29tbW9uUGF0aCA9IChlbGVtZW50cykgPT4ge1xuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICByZXR1cm4gW1xuICAgIGNyZWF0ZVBhdHRlcm4oe1xuICAgICAgdGFnLFxuICAgICAgY2xhc3NlczogY2xhc3NlcyB8fCBbXSxcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMgPyBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKG5hbWUpID0+ICh7XG4gICAgICAgIG5hbWU6IGVzY2FwZVZhbHVlKG5hbWUpLFxuICAgICAgICB2YWx1ZTogZXNjYXBlVmFsdWUoYXR0cmlidXRlc1tuYW1lXSlcbiAgICAgIH0pKSA6IFtdXG4gICAgfSlcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpXG4gICAgPyBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICAgIDogZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VsZWN0LmpzIiwiLyohXG4gKiBTaXp6bGUgQ1NTIFNlbGVjdG9yIEVuZ2luZSB2Mi4zLjZcbiAqIGh0dHBzOi8vc2l6emxlanMuY29tL1xuICpcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9qcy5mb3VuZGF0aW9uL1xuICpcbiAqIERhdGU6IDIwMjEtMDItMTZcbiAqL1xuKCBmdW5jdGlvbiggd2luZG93ICkge1xudmFyIGksXG5cdHN1cHBvcnQsXG5cdEV4cHIsXG5cdGdldFRleHQsXG5cdGlzWE1MLFxuXHR0b2tlbml6ZSxcblx0Y29tcGlsZSxcblx0c2VsZWN0LFxuXHRvdXRlcm1vc3RDb250ZXh0LFxuXHRzb3J0SW5wdXQsXG5cdGhhc0R1cGxpY2F0ZSxcblxuXHQvLyBMb2NhbCBkb2N1bWVudCB2YXJzXG5cdHNldERvY3VtZW50LFxuXHRkb2N1bWVudCxcblx0ZG9jRWxlbSxcblx0ZG9jdW1lbnRJc0hUTUwsXG5cdHJidWdneVFTQSxcblx0cmJ1Z2d5TWF0Y2hlcyxcblx0bWF0Y2hlcyxcblx0Y29udGFpbnMsXG5cblx0Ly8gSW5zdGFuY2Utc3BlY2lmaWMgZGF0YVxuXHRleHBhbmRvID0gXCJzaXp6bGVcIiArIDEgKiBuZXcgRGF0ZSgpLFxuXHRwcmVmZXJyZWREb2MgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdGRpcnJ1bnMgPSAwLFxuXHRkb25lID0gMCxcblx0Y2xhc3NDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHRva2VuQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRjb21waWxlckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHNvcnRPcmRlciA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAwO1xuXHR9LFxuXG5cdC8vIEluc3RhbmNlIG1ldGhvZHNcblx0aGFzT3duID0gKCB7fSApLmhhc093blByb3BlcnR5LFxuXHRhcnIgPSBbXSxcblx0cG9wID0gYXJyLnBvcCxcblx0cHVzaE5hdGl2ZSA9IGFyci5wdXNoLFxuXHRwdXNoID0gYXJyLnB1c2gsXG5cdHNsaWNlID0gYXJyLnNsaWNlLFxuXG5cdC8vIFVzZSBhIHN0cmlwcGVkLWRvd24gaW5kZXhPZiBhcyBpdCdzIGZhc3RlciB0aGFuIG5hdGl2ZVxuXHQvLyBodHRwczovL2pzcGVyZi5jb20vdGhvci1pbmRleG9mLXZzLWZvci81XG5cdGluZGV4T2YgPSBmdW5jdGlvbiggbGlzdCwgZWxlbSApIHtcblx0XHR2YXIgaSA9IDAsXG5cdFx0XHRsZW4gPSBsaXN0Lmxlbmd0aDtcblx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdGlmICggbGlzdFsgaSBdID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9LFxuXG5cdGJvb2xlYW5zID0gXCJjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58XCIgK1xuXHRcdFwiaXNtYXB8bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZFwiLFxuXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcblxuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXNlbGVjdG9ycy8jd2hpdGVzcGFjZVxuXHR3aGl0ZXNwYWNlID0gXCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLFxuXG5cdC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3Mtc3ludGF4LTMvI2lkZW50LXRva2VuLWRpYWdyYW1cblx0aWRlbnRpZmllciA9IFwiKD86XFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIiArIHdoaXRlc3BhY2UgK1xuXHRcdFwiP3xcXFxcXFxcXFteXFxcXHJcXFxcblxcXFxmXXxbXFxcXHctXXxbXlxcMC1cXFxceDdmXSkrXCIsXG5cblx0Ly8gQXR0cmlidXRlIHNlbGVjdG9yczogaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNhdHRyaWJ1dGUtc2VsZWN0b3JzXG5cdGF0dHJpYnV0ZXMgPSBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqKFwiICsgaWRlbnRpZmllciArIFwiKSg/OlwiICsgd2hpdGVzcGFjZSArXG5cblx0XHQvLyBPcGVyYXRvciAoY2FwdHVyZSAyKVxuXHRcdFwiKihbKl4kfCF+XT89KVwiICsgd2hpdGVzcGFjZSArXG5cblx0XHQvLyBcIkF0dHJpYnV0ZSB2YWx1ZXMgbXVzdCBiZSBDU1MgaWRlbnRpZmllcnMgW2NhcHR1cmUgNV1cblx0XHQvLyBvciBzdHJpbmdzIFtjYXB0dXJlIDMgb3IgY2FwdHVyZSA0XVwiXG5cdFx0XCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIiArIGlkZW50aWZpZXIgKyBcIikpfClcIiArXG5cdFx0d2hpdGVzcGFjZSArIFwiKlxcXFxdXCIsXG5cblx0cHNldWRvcyA9IFwiOihcIiArIGlkZW50aWZpZXIgKyBcIikoPzpcXFxcKChcIiArXG5cblx0XHQvLyBUbyByZWR1Y2UgdGhlIG51bWJlciBvZiBzZWxlY3RvcnMgbmVlZGluZyB0b2tlbml6ZSBpbiB0aGUgcHJlRmlsdGVyLCBwcmVmZXIgYXJndW1lbnRzOlxuXHRcdC8vIDEuIHF1b3RlZCAoY2FwdHVyZSAzOyBjYXB0dXJlIDQgb3IgY2FwdHVyZSA1KVxuXHRcdFwiKCcoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcIil8XCIgK1xuXG5cdFx0Ly8gMi4gc2ltcGxlIChjYXB0dXJlIDYpXG5cdFx0XCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFwoKVtcXFxcXV18XCIgKyBhdHRyaWJ1dGVzICsgXCIpKil8XCIgK1xuXG5cdFx0Ly8gMy4gYW55dGhpbmcgZWxzZSAoY2FwdHVyZSAyKVxuXHRcdFwiLipcIiArXG5cdFx0XCIpXFxcXCl8KVwiLFxuXG5cdC8vIExlYWRpbmcgYW5kIG5vbi1lc2NhcGVkIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGNhcHR1cmluZyBzb21lIG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlcnMgcHJlY2VkaW5nIHRoZSBsYXR0ZXJcblx0cndoaXRlc3BhY2UgPSBuZXcgUmVnRXhwKCB3aGl0ZXNwYWNlICsgXCIrXCIsIFwiZ1wiICksXG5cdHJ0cmltID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIrfCgoPzpefFteXFxcXFxcXFxdKSg/OlxcXFxcXFxcLikqKVwiICtcblx0XHR3aGl0ZXNwYWNlICsgXCIrJFwiLCBcImdcIiApLFxuXG5cdHJjb21tYSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKixcIiArIHdoaXRlc3BhY2UgKyBcIipcIiApLFxuXHRyY29tYmluYXRvcnMgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiooWz4rfl18XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIipcIiApLFxuXHRyZGVzY2VuZCA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcInw+XCIgKSxcblxuXHRycHNldWRvID0gbmV3IFJlZ0V4cCggcHNldWRvcyApLFxuXHRyaWRlbnRpZmllciA9IG5ldyBSZWdFeHAoIFwiXlwiICsgaWRlbnRpZmllciArIFwiJFwiICksXG5cblx0bWF0Y2hFeHByID0ge1xuXHRcdFwiSURcIjogbmV3IFJlZ0V4cCggXCJeIyhcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiQ0xBU1NcIjogbmV3IFJlZ0V4cCggXCJeXFxcXC4oXCIgKyBpZGVudGlmaWVyICsgXCIpXCIgKSxcblx0XHRcIlRBR1wiOiBuZXcgUmVnRXhwKCBcIl4oXCIgKyBpZGVudGlmaWVyICsgXCJ8WypdKVwiICksXG5cdFx0XCJBVFRSXCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgYXR0cmlidXRlcyApLFxuXHRcdFwiUFNFVURPXCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgcHNldWRvcyApLFxuXHRcdFwiQ0hJTERcIjogbmV3IFJlZ0V4cCggXCJeOihvbmx5fGZpcnN0fGxhc3R8bnRofG50aC1sYXN0KS0oY2hpbGR8b2YtdHlwZSkoPzpcXFxcKFwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooZXZlbnxvZGR8KChbKy1dfCkoXFxcXGQqKW58KVwiICsgd2hpdGVzcGFjZSArIFwiKig/OihbKy1dfClcIiArXG5cdFx0XHR3aGl0ZXNwYWNlICsgXCIqKFxcXFxkKyl8KSlcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpXCIsIFwiaVwiICksXG5cdFx0XCJib29sXCI6IG5ldyBSZWdFeHAoIFwiXig/OlwiICsgYm9vbGVhbnMgKyBcIikkXCIsIFwiaVwiICksXG5cblx0XHQvLyBGb3IgdXNlIGluIGxpYnJhcmllcyBpbXBsZW1lbnRpbmcgLmlzKClcblx0XHQvLyBXZSB1c2UgdGhpcyBmb3IgUE9TIG1hdGNoaW5nIGluIGBzZWxlY3RgXG5cdFx0XCJuZWVkc0NvbnRleHRcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKls+K35dfDooZXZlbnxvZGR8ZXF8Z3R8bHR8bnRofGZpcnN0fGxhc3QpKD86XFxcXChcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqKCg/Oi1cXFxcZCk/XFxcXGQqKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfCkoPz1bXi1dfCQpXCIsIFwiaVwiIClcblx0fSxcblxuXHRyaHRtbCA9IC9IVE1MJC9pLFxuXHRyaW5wdXRzID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaSxcblx0cmhlYWRlciA9IC9eaFxcZCQvaSxcblxuXHRybmF0aXZlID0gL15bXntdK1xce1xccypcXFtuYXRpdmUgXFx3LyxcblxuXHQvLyBFYXNpbHktcGFyc2VhYmxlL3JldHJpZXZhYmxlIElEIG9yIFRBRyBvciBDTEFTUyBzZWxlY3RvcnNcblx0cnF1aWNrRXhwciA9IC9eKD86IyhbXFx3LV0rKXwoXFx3Kyl8XFwuKFtcXHctXSspKSQvLFxuXG5cdHJzaWJsaW5nID0gL1srfl0vLFxuXG5cdC8vIENTUyBlc2NhcGVzXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCNlc2NhcGVkLWNoYXJhY3RlcnNcblx0cnVuZXNjYXBlID0gbmV3IFJlZ0V4cCggXCJcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiICsgd2hpdGVzcGFjZSArIFwiP3xcXFxcXFxcXChbXlxcXFxyXFxcXG5cXFxcZl0pXCIsIFwiZ1wiICksXG5cdGZ1bmVzY2FwZSA9IGZ1bmN0aW9uKCBlc2NhcGUsIG5vbkhleCApIHtcblx0XHR2YXIgaGlnaCA9IFwiMHhcIiArIGVzY2FwZS5zbGljZSggMSApIC0gMHgxMDAwMDtcblxuXHRcdHJldHVybiBub25IZXggP1xuXG5cdFx0XHQvLyBTdHJpcCB0aGUgYmFja3NsYXNoIHByZWZpeCBmcm9tIGEgbm9uLWhleCBlc2NhcGUgc2VxdWVuY2Vcblx0XHRcdG5vbkhleCA6XG5cblx0XHRcdC8vIFJlcGxhY2UgYSBoZXhhZGVjaW1hbCBlc2NhcGUgc2VxdWVuY2Ugd2l0aCB0aGUgZW5jb2RlZCBVbmljb2RlIGNvZGUgcG9pbnRcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDw9MTErXG5cdFx0XHQvLyBGb3IgdmFsdWVzIG91dHNpZGUgdGhlIEJhc2ljIE11bHRpbGluZ3VhbCBQbGFuZSAoQk1QKSwgbWFudWFsbHkgY29uc3RydWN0IGFcblx0XHRcdC8vIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRoaWdoIDwgMCA/XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggKyAweDEwMDAwICkgOlxuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoID4+IDEwIHwgMHhEODAwLCBoaWdoICYgMHgzRkYgfCAweERDMDAgKTtcblx0fSxcblxuXHQvLyBDU1Mgc3RyaW5nL2lkZW50aWZpZXIgc2VyaWFsaXphdGlvblxuXHQvLyBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3Nzb20vI2NvbW1vbi1zZXJpYWxpemluZy1pZGlvbXNcblx0cmNzc2VzY2FwZSA9IC8oW1xcMC1cXHgxZlxceDdmXXxeLT9cXGQpfF4tJHxbXlxcMC1cXHgxZlxceDdmLVxcdUZGRkZcXHctXS9nLFxuXHRmY3NzZXNjYXBlID0gZnVuY3Rpb24oIGNoLCBhc0NvZGVQb2ludCApIHtcblx0XHRpZiAoIGFzQ29kZVBvaW50ICkge1xuXG5cdFx0XHQvLyBVKzAwMDAgTlVMTCBiZWNvbWVzIFUrRkZGRCBSRVBMQUNFTUVOVCBDSEFSQUNURVJcblx0XHRcdGlmICggY2ggPT09IFwiXFwwXCIgKSB7XG5cdFx0XHRcdHJldHVybiBcIlxcdUZGRkRcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29udHJvbCBjaGFyYWN0ZXJzIGFuZCAoZGVwZW5kZW50IHVwb24gcG9zaXRpb24pIG51bWJlcnMgZ2V0IGVzY2FwZWQgYXMgY29kZSBwb2ludHNcblx0XHRcdHJldHVybiBjaC5zbGljZSggMCwgLTEgKSArIFwiXFxcXFwiICtcblx0XHRcdFx0Y2guY2hhckNvZGVBdCggY2gubGVuZ3RoIC0gMSApLnRvU3RyaW5nKCAxNiApICsgXCIgXCI7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXIgcG90ZW50aWFsbHktc3BlY2lhbCBBU0NJSSBjaGFyYWN0ZXJzIGdldCBiYWNrc2xhc2gtZXNjYXBlZFxuXHRcdHJldHVybiBcIlxcXFxcIiArIGNoO1xuXHR9LFxuXG5cdC8vIFVzZWQgZm9yIGlmcmFtZXNcblx0Ly8gU2VlIHNldERvY3VtZW50KClcblx0Ly8gUmVtb3ZpbmcgdGhlIGZ1bmN0aW9uIHdyYXBwZXIgY2F1c2VzIGEgXCJQZXJtaXNzaW9uIERlbmllZFwiXG5cdC8vIGVycm9yIGluIElFXG5cdHVubG9hZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzZXREb2N1bWVudCgpO1xuXHR9LFxuXG5cdGluRGlzYWJsZWRGaWVsZHNldCA9IGFkZENvbWJpbmF0b3IoXG5cdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gdHJ1ZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZmllbGRzZXRcIjtcblx0XHR9LFxuXHRcdHsgZGlyOiBcInBhcmVudE5vZGVcIiwgbmV4dDogXCJsZWdlbmRcIiB9XG5cdCk7XG5cbi8vIE9wdGltaXplIGZvciBwdXNoLmFwcGx5KCBfLCBOb2RlTGlzdCApXG50cnkge1xuXHRwdXNoLmFwcGx5KFxuXHRcdCggYXJyID0gc2xpY2UuY2FsbCggcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMgKSApLFxuXHRcdHByZWZlcnJlZERvYy5jaGlsZE5vZGVzXG5cdCk7XG5cblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjBcblx0Ly8gRGV0ZWN0IHNpbGVudGx5IGZhaWxpbmcgcHVzaC5hcHBseVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdGFyclsgcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMubGVuZ3RoIF0ubm9kZVR5cGU7XG59IGNhdGNoICggZSApIHtcblx0cHVzaCA9IHsgYXBwbHk6IGFyci5sZW5ndGggP1xuXG5cdFx0Ly8gTGV2ZXJhZ2Ugc2xpY2UgaWYgcG9zc2libGVcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHRwdXNoTmF0aXZlLmFwcGx5KCB0YXJnZXQsIHNsaWNlLmNhbGwoIGVscyApICk7XG5cdFx0fSA6XG5cblx0XHQvLyBTdXBwb3J0OiBJRTw5XG5cdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZCBkaXJlY3RseVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHZhciBqID0gdGFyZ2V0Lmxlbmd0aCxcblx0XHRcdFx0aSA9IDA7XG5cblx0XHRcdC8vIENhbid0IHRydXN0IE5vZGVMaXN0Lmxlbmd0aFxuXHRcdFx0d2hpbGUgKCAoIHRhcmdldFsgaisrIF0gPSBlbHNbIGkrKyBdICkgKSB7fVxuXHRcdFx0dGFyZ2V0Lmxlbmd0aCA9IGogLSAxO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gU2l6emxlKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIG0sIGksIGVsZW0sIG5pZCwgbWF0Y2gsIGdyb3VwcywgbmV3U2VsZWN0b3IsXG5cdFx0bmV3Q29udGV4dCA9IGNvbnRleHQgJiYgY29udGV4dC5vd25lckRvY3VtZW50LFxuXG5cdFx0Ly8gbm9kZVR5cGUgZGVmYXVsdHMgdG8gOSwgc2luY2UgY29udGV4dCBkZWZhdWx0cyB0byBkb2N1bWVudFxuXHRcdG5vZGVUeXBlID0gY29udGV4dCA/IGNvbnRleHQubm9kZVR5cGUgOiA5O1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFJldHVybiBlYXJseSBmcm9tIGNhbGxzIHdpdGggaW52YWxpZCBzZWxlY3RvciBvciBjb250ZXh0XG5cdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiIHx8ICFzZWxlY3RvciB8fFxuXHRcdG5vZGVUeXBlICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICYmIG5vZGVUeXBlICE9PSAxMSApIHtcblxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0Ly8gVHJ5IHRvIHNob3J0Y3V0IGZpbmQgb3BlcmF0aW9ucyAoYXMgb3Bwb3NlZCB0byBmaWx0ZXJzKSBpbiBIVE1MIGRvY3VtZW50c1xuXHRpZiAoICFzZWVkICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdFx0Y29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0XHRpZiAoIGRvY3VtZW50SXNIVE1MICkge1xuXG5cdFx0XHQvLyBJZiB0aGUgc2VsZWN0b3IgaXMgc3VmZmljaWVudGx5IHNpbXBsZSwgdHJ5IHVzaW5nIGEgXCJnZXQqQnkqXCIgRE9NIG1ldGhvZFxuXHRcdFx0Ly8gKGV4Y2VwdGluZyBEb2N1bWVudEZyYWdtZW50IGNvbnRleHQsIHdoZXJlIHRoZSBtZXRob2RzIGRvbid0IGV4aXN0KVxuXHRcdFx0aWYgKCBub2RlVHlwZSAhPT0gMTEgJiYgKCBtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKSApICkge1xuXG5cdFx0XHRcdC8vIElEIHNlbGVjdG9yXG5cdFx0XHRcdGlmICggKCBtID0gbWF0Y2hbIDEgXSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRG9jdW1lbnQgY29udGV4dFxuXHRcdFx0XHRcdGlmICggbm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFLCBPcGVyYSwgV2Via2l0XG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHRcdC8vIGdldEVsZW1lbnRCeUlkIGNhbiBtYXRjaCBlbGVtZW50cyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdFx0aWYgKCBlbGVtLmlkID09PSBtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEVsZW1lbnQgY29udGV4dFxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFLCBPcGVyYSwgV2Via2l0XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBpZGVudGlmeSB2ZXJzaW9uc1xuXHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0aWYgKCBuZXdDb250ZXh0ICYmICggZWxlbSA9IG5ld0NvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSApICYmXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICkgJiZcblx0XHRcdFx0XHRcdFx0ZWxlbS5pZCA9PT0gbSApIHtcblxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFR5cGUgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbIDIgXSApIHtcblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBzZWxlY3RvciApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cblx0XHRcdFx0Ly8gQ2xhc3Mgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggKCBtID0gbWF0Y2hbIDMgXSApICYmIHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJlxuXHRcdFx0XHRcdGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbSApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVGFrZSBhZHZhbnRhZ2Ugb2YgcXVlcnlTZWxlY3RvckFsbFxuXHRcdFx0aWYgKCBzdXBwb3J0LnFzYSAmJlxuXHRcdFx0XHQhbm9ubmF0aXZlU2VsZWN0b3JDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdICYmXG5cdFx0XHRcdCggIXJidWdneVFTQSB8fCAhcmJ1Z2d5UVNBLnRlc3QoIHNlbGVjdG9yICkgKSAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDggb25seVxuXHRcdFx0XHQvLyBFeGNsdWRlIG9iamVjdCBlbGVtZW50c1xuXHRcdFx0XHQoIG5vZGVUeXBlICE9PSAxIHx8IGNvbnRleHQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJvYmplY3RcIiApICkge1xuXG5cdFx0XHRcdG5ld1NlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdG5ld0NvbnRleHQgPSBjb250ZXh0O1xuXG5cdFx0XHRcdC8vIHFTQSBjb25zaWRlcnMgZWxlbWVudHMgb3V0c2lkZSBhIHNjb3Bpbmcgcm9vdCB3aGVuIGV2YWx1YXRpbmcgY2hpbGQgb3Jcblx0XHRcdFx0Ly8gZGVzY2VuZGFudCBjb21iaW5hdG9ycywgd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudC5cblx0XHRcdFx0Ly8gSW4gc3VjaCBjYXNlcywgd2Ugd29yayBhcm91bmQgdGhlIGJlaGF2aW9yIGJ5IHByZWZpeGluZyBldmVyeSBzZWxlY3RvciBpbiB0aGVcblx0XHRcdFx0Ly8gbGlzdCB3aXRoIGFuIElEIHNlbGVjdG9yIHJlZmVyZW5jaW5nIHRoZSBzY29wZSBjb250ZXh0LlxuXHRcdFx0XHQvLyBUaGUgdGVjaG5pcXVlIGhhcyB0byBiZSB1c2VkIGFzIHdlbGwgd2hlbiBhIGxlYWRpbmcgY29tYmluYXRvciBpcyB1c2VkXG5cdFx0XHRcdC8vIGFzIHN1Y2ggc2VsZWN0b3JzIGFyZSBub3QgcmVjb2duaXplZCBieSBxdWVyeVNlbGVjdG9yQWxsLlxuXHRcdFx0XHQvLyBUaGFua3MgdG8gQW5kcmV3IER1cG9udCBmb3IgdGhpcyB0ZWNobmlxdWUuXG5cdFx0XHRcdGlmICggbm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdFx0XHQoIHJkZXNjZW5kLnRlc3QoIHNlbGVjdG9yICkgfHwgcmNvbWJpbmF0b3JzLnRlc3QoIHNlbGVjdG9yICkgKSApIHtcblxuXHRcdFx0XHRcdC8vIEV4cGFuZCBjb250ZXh0IGZvciBzaWJsaW5nIHNlbGVjdG9yc1xuXHRcdFx0XHRcdG5ld0NvbnRleHQgPSByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fFxuXHRcdFx0XHRcdFx0Y29udGV4dDtcblxuXHRcdFx0XHRcdC8vIFdlIGNhbiB1c2UgOnNjb3BlIGluc3RlYWQgb2YgdGhlIElEIGhhY2sgaWYgdGhlIGJyb3dzZXJcblx0XHRcdFx0XHQvLyBzdXBwb3J0cyBpdCAmIGlmIHdlJ3JlIG5vdCBjaGFuZ2luZyB0aGUgY29udGV4dC5cblx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgIT09IGNvbnRleHQgfHwgIXN1cHBvcnQuc2NvcGUgKSB7XG5cblx0XHRcdFx0XHRcdC8vIENhcHR1cmUgdGhlIGNvbnRleHQgSUQsIHNldHRpbmcgaXQgZmlyc3QgaWYgbmVjZXNzYXJ5XG5cdFx0XHRcdFx0XHRpZiAoICggbmlkID0gY29udGV4dC5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApICkgKSB7XG5cdFx0XHRcdFx0XHRcdG5pZCA9IG5pZC5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb250ZXh0LnNldEF0dHJpYnV0ZSggXCJpZFwiLCAoIG5pZCA9IGV4cGFuZG8gKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFByZWZpeCBldmVyeSBzZWxlY3RvciBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGdyb3VwcyA9IHRva2VuaXplKCBzZWxlY3RvciApO1xuXHRcdFx0XHRcdGkgPSBncm91cHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0Z3JvdXBzWyBpIF0gPSAoIG5pZCA/IFwiI1wiICsgbmlkIDogXCI6c2NvcGVcIiApICsgXCIgXCIgK1xuXHRcdFx0XHRcdFx0XHR0b1NlbGVjdG9yKCBncm91cHNbIGkgXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXdTZWxlY3RvciA9IGdyb3Vwcy5qb2luKCBcIixcIiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLFxuXHRcdFx0XHRcdFx0bmV3Q29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBuZXdTZWxlY3RvciApXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0fSBjYXRjaCAoIHFzYUVycm9yICkge1xuXHRcdFx0XHRcdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUoIHNlbGVjdG9yLCB0cnVlICk7XG5cdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0aWYgKCBuaWQgPT09IGV4cGFuZG8gKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWxsIG90aGVyc1xuXHRyZXR1cm4gc2VsZWN0KCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUga2V5LXZhbHVlIGNhY2hlcyBvZiBsaW1pdGVkIHNpemVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl9IFJldHVybnMgdGhlIE9iamVjdCBkYXRhIGFmdGVyIHN0b3JpbmcgaXQgb24gaXRzZWxmIHdpdGhcbiAqXHRwcm9wZXJ0eSBuYW1lIHRoZSAoc3BhY2Utc3VmZml4ZWQpIHN0cmluZyBhbmQgKGlmIHRoZSBjYWNoZSBpcyBsYXJnZXIgdGhhbiBFeHByLmNhY2hlTGVuZ3RoKVxuICpcdGRlbGV0aW5nIHRoZSBvbGRlc3QgZW50cnlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUoKSB7XG5cdHZhciBrZXlzID0gW107XG5cblx0ZnVuY3Rpb24gY2FjaGUoIGtleSwgdmFsdWUgKSB7XG5cblx0XHQvLyBVc2UgKGtleSArIFwiIFwiKSB0byBhdm9pZCBjb2xsaXNpb24gd2l0aCBuYXRpdmUgcHJvdG90eXBlIHByb3BlcnRpZXMgKHNlZSBJc3N1ZSAjMTU3KVxuXHRcdGlmICgga2V5cy5wdXNoKCBrZXkgKyBcIiBcIiApID4gRXhwci5jYWNoZUxlbmd0aCApIHtcblxuXHRcdFx0Ly8gT25seSBrZWVwIHRoZSBtb3N0IHJlY2VudCBlbnRyaWVzXG5cdFx0XHRkZWxldGUgY2FjaGVbIGtleXMuc2hpZnQoKSBdO1xuXHRcdH1cblx0XHRyZXR1cm4gKCBjYWNoZVsga2V5ICsgXCIgXCIgXSA9IHZhbHVlICk7XG5cdH1cblx0cmV0dXJuIGNhY2hlO1xufVxuXG4vKipcbiAqIE1hcmsgYSBmdW5jdGlvbiBmb3Igc3BlY2lhbCB1c2UgYnkgU2l6emxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWFya1xuICovXG5mdW5jdGlvbiBtYXJrRnVuY3Rpb24oIGZuICkge1xuXHRmblsgZXhwYW5kbyBdID0gdHJ1ZTtcblx0cmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgdGVzdGluZyB1c2luZyBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBQYXNzZWQgdGhlIGNyZWF0ZWQgZWxlbWVudCBhbmQgcmV0dXJucyBhIGJvb2xlYW4gcmVzdWx0XG4gKi9cbmZ1bmN0aW9uIGFzc2VydCggZm4gKSB7XG5cdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZmllbGRzZXRcIiApO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuICEhZm4oIGVsICk7XG5cdH0gY2F0Y2ggKCBlICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSBmaW5hbGx5IHtcblxuXHRcdC8vIFJlbW92ZSBmcm9tIGl0cyBwYXJlbnQgYnkgZGVmYXVsdFxuXHRcdGlmICggZWwucGFyZW50Tm9kZSApIHtcblx0XHRcdGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGVsICk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRlbCA9IG51bGw7XG5cdH1cbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBzYW1lIGhhbmRsZXIgZm9yIGFsbCBvZiB0aGUgc3BlY2lmaWVkIGF0dHJzXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0cnMgUGlwZS1zZXBhcmF0ZWQgbGlzdCBvZiBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBtZXRob2QgdGhhdCB3aWxsIGJlIGFwcGxpZWRcbiAqL1xuZnVuY3Rpb24gYWRkSGFuZGxlKCBhdHRycywgaGFuZGxlciApIHtcblx0dmFyIGFyciA9IGF0dHJzLnNwbGl0KCBcInxcIiApLFxuXHRcdGkgPSBhcnIubGVuZ3RoO1xuXG5cdHdoaWxlICggaS0tICkge1xuXHRcdEV4cHIuYXR0ckhhbmRsZVsgYXJyWyBpIF0gXSA9IGhhbmRsZXI7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgZG9jdW1lbnQgb3JkZXIgb2YgdHdvIHNpYmxpbmdzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYlxuICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyBsZXNzIHRoYW4gMCBpZiBhIHByZWNlZGVzIGIsIGdyZWF0ZXIgdGhhbiAwIGlmIGEgZm9sbG93cyBiXG4gKi9cbmZ1bmN0aW9uIHNpYmxpbmdDaGVjayggYSwgYiApIHtcblx0dmFyIGN1ciA9IGIgJiYgYSxcblx0XHRkaWZmID0gY3VyICYmIGEubm9kZVR5cGUgPT09IDEgJiYgYi5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0YS5zb3VyY2VJbmRleCAtIGIuc291cmNlSW5kZXg7XG5cblx0Ly8gVXNlIElFIHNvdXJjZUluZGV4IGlmIGF2YWlsYWJsZSBvbiBib3RoIG5vZGVzXG5cdGlmICggZGlmZiApIHtcblx0XHRyZXR1cm4gZGlmZjtcblx0fVxuXG5cdC8vIENoZWNrIGlmIGIgZm9sbG93cyBhXG5cdGlmICggY3VyICkge1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIubmV4dFNpYmxpbmcgKSApIHtcblx0XHRcdGlmICggY3VyID09PSBiICkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGEgPyAxIDogLTE7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBpbnB1dCB0eXBlc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5wdXRQc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gdHlwZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGJ1dHRvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvblBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiAoIG5hbWUgPT09IFwiaW5wdXRcIiB8fCBuYW1lID09PSBcImJ1dHRvblwiICkgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgOmVuYWJsZWQvOmRpc2FibGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRpc2FibGVkIHRydWUgZm9yIDpkaXNhYmxlZDsgZmFsc2UgZm9yIDplbmFibGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURpc2FibGVkUHNldWRvKCBkaXNhYmxlZCApIHtcblxuXHQvLyBLbm93biA6ZGlzYWJsZWQgZmFsc2UgcG9zaXRpdmVzOiBmaWVsZHNldFtkaXNhYmxlZF0gPiBsZWdlbmQ6bnRoLW9mLXR5cGUobisyKSA6Y2FuLWRpc2FibGVcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0Ly8gT25seSBjZXJ0YWluIGVsZW1lbnRzIGNhbiBtYXRjaCA6ZW5hYmxlZCBvciA6ZGlzYWJsZWRcblx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zY3JpcHRpbmcuaHRtbCNzZWxlY3Rvci1lbmFibGVkXG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2NyaXB0aW5nLmh0bWwjc2VsZWN0b3ItZGlzYWJsZWRcblx0XHRpZiAoIFwiZm9ybVwiIGluIGVsZW0gKSB7XG5cblx0XHRcdC8vIENoZWNrIGZvciBpbmhlcml0ZWQgZGlzYWJsZWRuZXNzIG9uIHJlbGV2YW50IG5vbi1kaXNhYmxlZCBlbGVtZW50czpcblx0XHRcdC8vICogbGlzdGVkIGZvcm0tYXNzb2NpYXRlZCBlbGVtZW50cyBpbiBhIGRpc2FibGVkIGZpZWxkc2V0XG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGlzdGVkXG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY29uY2VwdC1mZS1kaXNhYmxlZFxuXHRcdFx0Ly8gKiBvcHRpb24gZWxlbWVudHMgaW4gYSBkaXNhYmxlZCBvcHRncm91cFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NvbmNlcHQtb3B0aW9uLWRpc2FibGVkXG5cdFx0XHQvLyBBbGwgc3VjaCBlbGVtZW50cyBoYXZlIGEgXCJmb3JtXCIgcHJvcGVydHkuXG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSAmJiBlbGVtLmRpc2FibGVkID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHQvLyBPcHRpb24gZWxlbWVudHMgZGVmZXIgdG8gYSBwYXJlbnQgb3B0Z3JvdXAgaWYgcHJlc2VudFxuXHRcdFx0XHRpZiAoIFwibGFiZWxcIiBpbiBlbGVtICkge1xuXHRcdFx0XHRcdGlmICggXCJsYWJlbFwiIGluIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLnBhcmVudE5vZGUuZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgNiAtIDExXG5cdFx0XHRcdC8vIFVzZSB0aGUgaXNEaXNhYmxlZCBzaG9ydGN1dCBwcm9wZXJ0eSB0byBjaGVjayBmb3IgZGlzYWJsZWQgZmllbGRzZXQgYW5jZXN0b3JzXG5cdFx0XHRcdHJldHVybiBlbGVtLmlzRGlzYWJsZWQgPT09IGRpc2FibGVkIHx8XG5cblx0XHRcdFx0XHQvLyBXaGVyZSB0aGVyZSBpcyBubyBpc0Rpc2FibGVkLCBjaGVjayBtYW51YWxseVxuXHRcdFx0XHRcdC8qIGpzaGludCAtVzAxOCAqL1xuXHRcdFx0XHRcdGVsZW0uaXNEaXNhYmxlZCAhPT0gIWRpc2FibGVkICYmXG5cdFx0XHRcdFx0aW5EaXNhYmxlZEZpZWxkc2V0KCBlbGVtICkgPT09IGRpc2FibGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cblx0XHQvLyBUcnkgdG8gd2lubm93IG91dCBlbGVtZW50cyB0aGF0IGNhbid0IGJlIGRpc2FibGVkIGJlZm9yZSB0cnVzdGluZyB0aGUgZGlzYWJsZWQgcHJvcGVydHkuXG5cdFx0Ly8gU29tZSB2aWN0aW1zIGdldCBjYXVnaHQgaW4gb3VyIG5ldCAobGFiZWwsIGxlZ2VuZCwgbWVudSwgdHJhY2spLCBidXQgaXQgc2hvdWxkbid0XG5cdFx0Ly8gZXZlbiBleGlzdCBvbiB0aGVtLCBsZXQgYWxvbmUgaGF2ZSBhIGJvb2xlYW4gdmFsdWUuXG5cdFx0fSBlbHNlIGlmICggXCJsYWJlbFwiIGluIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtYWluaW5nIGVsZW1lbnRzIGFyZSBuZWl0aGVyIDplbmFibGVkIG5vciA6ZGlzYWJsZWRcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBwb3NpdGlvbmFsc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZm4gKSB7XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBhcmd1bWVudCApIHtcblx0XHRhcmd1bWVudCA9ICthcmd1bWVudDtcblx0XHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcyApIHtcblx0XHRcdHZhciBqLFxuXHRcdFx0XHRtYXRjaEluZGV4ZXMgPSBmbiggW10sIHNlZWQubGVuZ3RoLCBhcmd1bWVudCApLFxuXHRcdFx0XHRpID0gbWF0Y2hJbmRleGVzLmxlbmd0aDtcblxuXHRcdFx0Ly8gTWF0Y2ggZWxlbWVudHMgZm91bmQgYXQgdGhlIHNwZWNpZmllZCBpbmRleGVzXG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCBzZWVkWyAoIGogPSBtYXRjaEluZGV4ZXNbIGkgXSApIF0gKSB7XG5cdFx0XHRcdFx0c2VlZFsgaiBdID0gISggbWF0Y2hlc1sgaiBdID0gc2VlZFsgaiBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgYSBub2RlIGZvciB2YWxpZGl0eSBhcyBhIFNpenpsZSBjb250ZXh0XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0PX0gY29udGV4dFxuICogQHJldHVybnMge0VsZW1lbnR8T2JqZWN0fEJvb2xlYW59IFRoZSBpbnB1dCBub2RlIGlmIGFjY2VwdGFibGUsIG90aGVyd2lzZSBhIGZhbHN5IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHRlc3RDb250ZXh0KCBjb250ZXh0ICkge1xuXHRyZXR1cm4gY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb250ZXh0O1xufVxuXG4vLyBFeHBvc2Ugc3VwcG9ydCB2YXJzIGZvciBjb252ZW5pZW5jZVxuc3VwcG9ydCA9IFNpenpsZS5zdXBwb3J0ID0ge307XG5cbi8qKlxuICogRGV0ZWN0cyBYTUwgbm9kZXNcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsZW0gQW4gZWxlbWVudCBvciBhIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZmYgZWxlbSBpcyBhIG5vbi1IVE1MIFhNTCBub2RlXG4gKi9cbmlzWE1MID0gU2l6emxlLmlzWE1MID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHZhciBuYW1lc3BhY2UgPSBlbGVtICYmIGVsZW0ubmFtZXNwYWNlVVJJLFxuXHRcdGRvY0VsZW0gPSBlbGVtICYmICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKS5kb2N1bWVudEVsZW1lbnQ7XG5cblx0Ly8gU3VwcG9ydDogSUUgPD04XG5cdC8vIEFzc3VtZSBIVE1MIHdoZW4gZG9jdW1lbnRFbGVtZW50IGRvZXNuJ3QgeWV0IGV4aXN0LCBzdWNoIGFzIGluc2lkZSBsb2FkaW5nIGlmcmFtZXNcblx0Ly8gaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzQ4MzNcblx0cmV0dXJuICFyaHRtbC50ZXN0KCBuYW1lc3BhY2UgfHwgZG9jRWxlbSAmJiBkb2NFbGVtLm5vZGVOYW1lIHx8IFwiSFRNTFwiICk7XG59O1xuXG4vKipcbiAqIFNldHMgZG9jdW1lbnQtcmVsYXRlZCB2YXJpYWJsZXMgb25jZSBiYXNlZCBvbiB0aGUgY3VycmVudCBkb2N1bWVudFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gW2RvY10gQW4gZWxlbWVudCBvciBkb2N1bWVudCBvYmplY3QgdG8gdXNlIHRvIHNldCB0aGUgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqL1xuc2V0RG9jdW1lbnQgPSBTaXp6bGUuc2V0RG9jdW1lbnQgPSBmdW5jdGlvbiggbm9kZSApIHtcblx0dmFyIGhhc0NvbXBhcmUsIHN1YldpbmRvdyxcblx0XHRkb2MgPSBub2RlID8gbm9kZS5vd25lckRvY3VtZW50IHx8IG5vZGUgOiBwcmVmZXJyZWREb2M7XG5cblx0Ly8gUmV0dXJuIGVhcmx5IGlmIGRvYyBpcyBpbnZhbGlkIG9yIGFscmVhZHkgc2VsZWN0ZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCBkb2MgPT0gZG9jdW1lbnQgfHwgZG9jLm5vZGVUeXBlICE9PSA5IHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRcdHJldHVybiBkb2N1bWVudDtcblx0fVxuXG5cdC8vIFVwZGF0ZSBnbG9iYWwgdmFyaWFibGVzXG5cdGRvY3VtZW50ID0gZG9jO1xuXHRkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHRkb2N1bWVudElzSFRNTCA9ICFpc1hNTCggZG9jdW1lbnQgKTtcblxuXHQvLyBTdXBwb3J0OiBJRSA5IC0gMTErLCBFZGdlIDEyIC0gMTgrXG5cdC8vIEFjY2Vzc2luZyBpZnJhbWUgZG9jdW1lbnRzIGFmdGVyIHVubG9hZCB0aHJvd3MgXCJwZXJtaXNzaW9uIGRlbmllZFwiIGVycm9ycyAoalF1ZXJ5ICMxMzkzNilcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCBwcmVmZXJyZWREb2MgIT0gZG9jdW1lbnQgJiZcblx0XHQoIHN1YldpbmRvdyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3ICkgJiYgc3ViV2luZG93LnRvcCAhPT0gc3ViV2luZG93ICkge1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgMTEsIEVkZ2Vcblx0XHRpZiAoIHN1YldpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0c3ViV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwidW5sb2FkXCIsIHVubG9hZEhhbmRsZXIsIGZhbHNlICk7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA5IC0gMTAgb25seVxuXHRcdH0gZWxzZSBpZiAoIHN1YldpbmRvdy5hdHRhY2hFdmVudCApIHtcblx0XHRcdHN1YldpbmRvdy5hdHRhY2hFdmVudCggXCJvbnVubG9hZFwiLCB1bmxvYWRIYW5kbGVyICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3VwcG9ydDogSUUgOCAtIDExKywgRWRnZSAxMiAtIDE4KywgQ2hyb21lIDw9MTYgLSAyNSBvbmx5LCBGaXJlZm94IDw9My42IC0gMzEgb25seSxcblx0Ly8gU2FmYXJpIDQgLSA1IG9ubHksIE9wZXJhIDw9MTEuNiAtIDEyLnggb25seVxuXHQvLyBJRS9FZGdlICYgb2xkZXIgYnJvd3NlcnMgZG9uJ3Qgc3VwcG9ydCB0aGUgOnNjb3BlIHBzZXVkby1jbGFzcy5cblx0Ly8gU3VwcG9ydDogU2FmYXJpIDYuMCBvbmx5XG5cdC8vIFNhZmFyaSA2LjAgc3VwcG9ydHMgOnNjb3BlIGJ1dCBpdCdzIGFuIGFsaWFzIG9mIDpyb290IHRoZXJlLlxuXHRzdXBwb3J0LnNjb3BlID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApICk7XG5cdFx0cmV0dXJuIHR5cGVvZiBlbC5xdWVyeVNlbGVjdG9yQWxsICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHQhZWwucXVlcnlTZWxlY3RvckFsbCggXCI6c2NvcGUgZmllbGRzZXQgZGl2XCIgKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvKiBBdHRyaWJ1dGVzXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBTdXBwb3J0OiBJRTw4XG5cdC8vIFZlcmlmeSB0aGF0IGdldEF0dHJpYnV0ZSByZWFsbHkgcmV0dXJucyBhdHRyaWJ1dGVzIGFuZCBub3QgcHJvcGVydGllc1xuXHQvLyAoZXhjZXB0aW5nIElFOCBib29sZWFucylcblx0c3VwcG9ydC5hdHRyaWJ1dGVzID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZWwuY2xhc3NOYW1lID0gXCJpXCI7XG5cdFx0cmV0dXJuICFlbC5nZXRBdHRyaWJ1dGUoIFwiY2xhc3NOYW1lXCIgKTtcblx0fSApO1xuXG5cdC8qIGdldEVsZW1lbnQocylCeSpcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSByZXR1cm5zIG9ubHkgZWxlbWVudHNcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGVsLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVDb21tZW50KCBcIlwiICkgKTtcblx0XHRyZXR1cm4gIWVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcIipcIiApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDlcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gcm5hdGl2ZS50ZXN0KCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICk7XG5cblx0Ly8gU3VwcG9ydDogSUU8MTBcblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudEJ5SWQgcmV0dXJucyBlbGVtZW50cyBieSBuYW1lXG5cdC8vIFRoZSBicm9rZW4gZ2V0RWxlbWVudEJ5SWQgbWV0aG9kcyBkb24ndCBwaWNrIHVwIHByb2dyYW1tYXRpY2FsbHktc2V0IG5hbWVzLFxuXHQvLyBzbyB1c2UgYSByb3VuZGFib3V0IGdldEVsZW1lbnRzQnlOYW1lIHRlc3Rcblx0c3VwcG9ydC5nZXRCeUlkID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5pZCA9IGV4cGFuZG87XG5cdFx0cmV0dXJuICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSB8fCAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoIGV4cGFuZG8gKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvLyBJRCBmaWx0ZXIgYW5kIGZpbmRcblx0aWYgKCBzdXBwb3J0LmdldEJ5SWQgKSB7XG5cdFx0RXhwci5maWx0ZXJbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggXCJpZFwiICkgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblx0XHRFeHByLmZpbmRbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdFx0dmFyIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXHRcdFx0XHRyZXR1cm4gZWxlbSA/IFsgZWxlbSBdIDogW107XG5cdFx0XHR9XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRFeHByLmZpbHRlclsgXCJJRFwiIF0gPSAgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBub2RlID0gdHlwZW9mIGVsZW0uZ2V0QXR0cmlidXRlTm9kZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdHJldHVybiBub2RlICYmIG5vZGUudmFsdWUgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDYgLSA3IG9ubHlcblx0XHQvLyBnZXRFbGVtZW50QnlJZCBpcyBub3QgcmVsaWFibGUgYXMgYSBmaW5kIHNob3J0Y3V0XG5cdFx0RXhwci5maW5kWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRcdHZhciBub2RlLCBpLCBlbGVtcyxcblx0XHRcdFx0XHRlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblxuXHRcdFx0XHRpZiAoIGVsZW0gKSB7XG5cblx0XHRcdFx0XHQvLyBWZXJpZnkgdGhlIGlkIGF0dHJpYnV0ZVxuXHRcdFx0XHRcdG5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdGlmICggbm9kZSAmJiBub2RlLnZhbHVlID09PSBpZCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBbIGVsZW0gXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGYWxsIGJhY2sgb24gZ2V0RWxlbWVudHNCeU5hbWVcblx0XHRcdFx0XHRlbGVtcyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeU5hbWUoIGlkICk7XG5cdFx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtc1sgaSsrIF0gKSApIHtcblx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdFx0aWYgKCBub2RlICYmIG5vZGUudmFsdWUgPT09IGlkICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gWyBlbGVtIF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBUYWdcblx0RXhwci5maW5kWyBcIlRBR1wiIF0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID9cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBEb2N1bWVudEZyYWdtZW50IG5vZGVzIGRvbid0IGhhdmUgZ0VCVE5cblx0XHRcdH0gZWxzZSBpZiAoIHN1cHBvcnQucXNhICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCB0YWcgKTtcblx0XHRcdH1cblx0XHR9IDpcblxuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0dG1wID0gW10sXG5cdFx0XHRcdGkgPSAwLFxuXG5cdFx0XHRcdC8vIEJ5IGhhcHB5IGNvaW5jaWRlbmNlLCBhIChicm9rZW4pIGdFQlROIGFwcGVhcnMgb24gRG9jdW1lbnRGcmFnbWVudCBub2RlcyB0b29cblx0XHRcdFx0cmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IHBvc3NpYmxlIGNvbW1lbnRzXG5cdFx0XHRpZiAoIHRhZyA9PT0gXCIqXCIgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHR0bXAucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0bXA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9O1xuXG5cdC8vIENsYXNzXG5cdEV4cHIuZmluZFsgXCJDTEFTU1wiIF0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgZnVuY3Rpb24oIGNsYXNzTmFtZSwgY29udGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH07XG5cblx0LyogUVNBL21hdGNoZXNTZWxlY3RvclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gUVNBIGFuZCBtYXRjaGVzU2VsZWN0b3Igc3VwcG9ydFxuXG5cdC8vIG1hdGNoZXNTZWxlY3Rvcig6YWN0aXZlKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoSUU5L09wZXJhIDExLjUpXG5cdHJidWdneU1hdGNoZXMgPSBbXTtcblxuXHQvLyBxU2EoOmZvY3VzKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoQ2hyb21lIDIxKVxuXHQvLyBXZSBhbGxvdyB0aGlzIGJlY2F1c2Ugb2YgYSBidWcgaW4gSUU4LzkgdGhhdCB0aHJvd3MgYW4gZXJyb3Jcblx0Ly8gd2hlbmV2ZXIgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGlzIGFjY2Vzc2VkIG9uIGFuIGlmcmFtZVxuXHQvLyBTbywgd2UgYWxsb3cgOmZvY3VzIHRvIHBhc3MgdGhyb3VnaCBRU0EgYWxsIHRoZSB0aW1lIHRvIGF2b2lkIHRoZSBJRSBlcnJvclxuXHQvLyBTZWUgaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzEzMzc4XG5cdHJidWdneVFTQSA9IFtdO1xuXG5cdGlmICggKCBzdXBwb3J0LnFzYSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCApICkgKSB7XG5cblx0XHQvLyBCdWlsZCBRU0EgcmVnZXhcblx0XHQvLyBSZWdleCBzdHJhdGVneSBhZG9wdGVkIGZyb20gRGllZ28gUGVyaW5pXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHRcdHZhciBpbnB1dDtcblxuXHRcdFx0Ly8gU2VsZWN0IGlzIHNldCB0byBlbXB0eSBzdHJpbmcgb24gcHVycG9zZVxuXHRcdFx0Ly8gVGhpcyBpcyB0byB0ZXN0IElFJ3MgdHJlYXRtZW50IG9mIG5vdCBleHBsaWNpdGx5XG5cdFx0XHQvLyBzZXR0aW5nIGEgYm9vbGVhbiBjb250ZW50IGF0dHJpYnV0ZSxcblx0XHRcdC8vIHNpbmNlIGl0cyBwcmVzZW5jZSBzaG91bGQgYmUgZW5vdWdoXG5cdFx0XHQvLyBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTIzNTlcblx0XHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuaW5uZXJIVE1MID0gXCI8YSBpZD0nXCIgKyBleHBhbmRvICsgXCInPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBpZD0nXCIgKyBleHBhbmRvICsgXCItXFxyXFxcXCcgbXNhbGxvd2NhcHR1cmU9Jyc+XCIgK1xuXHRcdFx0XHRcIjxvcHRpb24gc2VsZWN0ZWQ9Jyc+PC9vcHRpb24+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOCwgT3BlcmEgMTEtMTIuMTZcblx0XHRcdC8vIE5vdGhpbmcgc2hvdWxkIGJlIHNlbGVjdGVkIHdoZW4gZW1wdHkgc3RyaW5ncyBmb2xsb3cgXj0gb3IgJD0gb3IgKj1cblx0XHRcdC8vIFRoZSB0ZXN0IGF0dHJpYnV0ZSBtdXN0IGJlIHVua25vd24gaW4gT3BlcmEgYnV0IFwic2FmZVwiIGZvciBXaW5SVFxuXHRcdFx0Ly8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9oaDQ2NTM4OC5hc3B4I2F0dHJpYnV0ZV9zZWN0aW9uXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW21zYWxsb3djYXB0dXJlXj0nJ11cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiWypeJF09XCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBCb29sZWFuIGF0dHJpYnV0ZXMgYW5kIFwidmFsdWVcIiBhcmUgbm90IHRyZWF0ZWQgY29ycmVjdGx5XG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltzZWxlY3RlZF1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooPzp2YWx1ZXxcIiArIGJvb2xlYW5zICsgXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lPDI5LCBBbmRyb2lkPDQuNCwgU2FmYXJpPDcuMCssIGlPUzw3LjArLCBQaGFudG9tSlM8MS45LjgrXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltpZH49XCIgKyBleHBhbmRvICsgXCItXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJ+PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNSAtIDE4K1xuXHRcdFx0Ly8gSUUgMTEvRWRnZSBkb24ndCBmaW5kIGVsZW1lbnRzIG9uIGEgYFtuYW1lPScnXWAgcXVlcnkgaW4gc29tZSBjYXNlcy5cblx0XHRcdC8vIEFkZGluZyBhIHRlbXBvcmFyeSBhdHRyaWJ1dGUgdG8gdGhlIGRvY3VtZW50IGJlZm9yZSB0aGUgc2VsZWN0aW9uIHdvcmtzXG5cdFx0XHQvLyBhcm91bmQgdGhlIGlzc3VlLlxuXHRcdFx0Ly8gSW50ZXJlc3RpbmdseSwgSUUgMTAgJiBvbGRlciBkb24ndCBzZWVtIHRvIGhhdmUgdGhlIGlzc3VlLlxuXHRcdFx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcblx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiXCIgKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKCBpbnB1dCApO1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbmFtZT0nJ11cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIipuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqPVwiICtcblx0XHRcdFx0XHR3aGl0ZXNwYWNlICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2Via2l0L09wZXJhIC0gOmNoZWNrZWQgc2hvdWxkIHJldHVybiBzZWxlY3RlZCBvcHRpb24gZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCI6Y2hlY2tlZFwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6Y2hlY2tlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA4KywgaU9TIDgrXG5cdFx0XHQvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM2ODUxXG5cdFx0XHQvLyBJbi1wYWdlIGBzZWxlY3RvciNpZCBzaWJsaW5nLWNvbWJpbmF0b3Igc2VsZWN0b3JgIGZhaWxzXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcImEjXCIgKyBleHBhbmRvICsgXCIrKlwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCIuIy4rWyt+XVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3ggPD0zLjYgLSA1IG9ubHlcblx0XHRcdC8vIE9sZCBGaXJlZm94IGRvZXNuJ3QgdGhyb3cgb24gYSBiYWRseS1lc2NhcGVkIGlkZW50aWZpZXIuXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIlxcXFxcXGZcIiApO1xuXHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiW1xcXFxyXFxcXG5cXFxcZl1cIiApO1xuXHRcdH0gKTtcblxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0ZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPScnIGRpc2FibGVkPSdkaXNhYmxlZCc+PC9hPlwiICtcblx0XHRcdFx0XCI8c2VsZWN0IGRpc2FibGVkPSdkaXNhYmxlZCc+PG9wdGlvbi8+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFdpbmRvd3MgOCBOYXRpdmUgQXBwc1xuXHRcdFx0Ly8gVGhlIHR5cGUgYW5kIG5hbWUgYXR0cmlidXRlcyBhcmUgcmVzdHJpY3RlZCBkdXJpbmcgLmlubmVySFRNTCBhc3NpZ25tZW50XG5cdFx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcblx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggXCJ0eXBlXCIsIFwiaGlkZGVuXCIgKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKCBpbnB1dCApLnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiRFwiICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gRW5mb3JjZSBjYXNlLXNlbnNpdGl2aXR5IG9mIG5hbWUgYXR0cmlidXRlXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW25hbWU9ZF1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwibmFtZVwiICsgd2hpdGVzcGFjZSArIFwiKlsqXiR8IX5dPz1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGRiAzLjUgLSA6ZW5hYmxlZC86ZGlzYWJsZWQgYW5kIGhpZGRlbiBlbGVtZW50cyAoaGlkZGVuIGVsZW1lbnRzIGFyZSBzdGlsbCBlbmFibGVkKVxuXHRcdFx0Ly8gSUU4IHRocm93cyBlcnJvciBoZXJlIGFuZCB3aWxsIG5vdCBzZWUgbGF0ZXIgdGVzdHNcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCI6ZW5hYmxlZFwiICkubGVuZ3RoICE9PSAyICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6ZW5hYmxlZFwiLCBcIjpkaXNhYmxlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0XHRcdC8vIElFJ3MgOmRpc2FibGVkIHNlbGVjdG9yIGRvZXMgbm90IHBpY2sgdXAgdGhlIGNoaWxkcmVuIG9mIGRpc2FibGVkIGZpZWxkc2V0c1xuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmRpc2FibGVkXCIgKS5sZW5ndGggIT09IDIgKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogT3BlcmEgMTAgLSAxMSBvbmx5XG5cdFx0XHQvLyBPcGVyYSAxMC0xMSBkb2VzIG5vdCB0aHJvdyBvbiBwb3N0LWNvbW1hIGludmFsaWQgcHNldWRvc1xuXHRcdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggXCIqLDp4XCIgKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKCBcIiwuKjpcIiApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGlmICggKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciA9IHJuYXRpdmUudGVzdCggKCBtYXRjaGVzID0gZG9jRWxlbS5tYXRjaGVzIHx8XG5cdFx0ZG9jRWxlbS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ub01hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ubXNNYXRjaGVzU2VsZWN0b3IgKSApICkgKSB7XG5cblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZG8gbWF0Y2hlc1NlbGVjdG9yXG5cdFx0XHQvLyBvbiBhIGRpc2Nvbm5lY3RlZCBub2RlIChJRSA5KVxuXHRcdFx0c3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCA9IG1hdGNoZXMuY2FsbCggZWwsIFwiKlwiICk7XG5cblx0XHRcdC8vIFRoaXMgc2hvdWxkIGZhaWwgd2l0aCBhbiBleGNlcHRpb25cblx0XHRcdC8vIEdlY2tvIGRvZXMgbm90IGVycm9yLCByZXR1cm5zIGZhbHNlIGluc3RlYWRcblx0XHRcdG1hdGNoZXMuY2FsbCggZWwsIFwiW3MhPScnXTp4XCIgKTtcblx0XHRcdHJidWdneU1hdGNoZXMucHVzaCggXCIhPVwiLCBwc2V1ZG9zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0cmJ1Z2d5UVNBID0gcmJ1Z2d5UVNBLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lRU0Euam9pbiggXCJ8XCIgKSApO1xuXHRyYnVnZ3lNYXRjaGVzID0gcmJ1Z2d5TWF0Y2hlcy5sZW5ndGggJiYgbmV3IFJlZ0V4cCggcmJ1Z2d5TWF0Y2hlcy5qb2luKCBcInxcIiApICk7XG5cblx0LyogQ29udGFpbnNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRoYXNDb21wYXJlID0gcm5hdGl2ZS50ZXN0KCBkb2NFbGVtLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICk7XG5cblx0Ly8gRWxlbWVudCBjb250YWlucyBhbm90aGVyXG5cdC8vIFB1cnBvc2VmdWxseSBzZWxmLWV4Y2x1c2l2ZVxuXHQvLyBBcyBpbiwgYW4gZWxlbWVudCBkb2VzIG5vdCBjb250YWluIGl0c2VsZlxuXHRjb250YWlucyA9IGhhc0NvbXBhcmUgfHwgcm5hdGl2ZS50ZXN0KCBkb2NFbGVtLmNvbnRhaW5zICkgP1xuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGFkb3duID0gYS5ub2RlVHlwZSA9PT0gOSA/IGEuZG9jdW1lbnRFbGVtZW50IDogYSxcblx0XHRcdFx0YnVwID0gYiAmJiBiLnBhcmVudE5vZGU7XG5cdFx0XHRyZXR1cm4gYSA9PT0gYnVwIHx8ICEhKCBidXAgJiYgYnVwLm5vZGVUeXBlID09PSAxICYmIChcblx0XHRcdFx0YWRvd24uY29udGFpbnMgP1xuXHRcdFx0XHRcdGFkb3duLmNvbnRhaW5zKCBidXAgKSA6XG5cdFx0XHRcdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBidXAgKSAmIDE2XG5cdFx0XHQpICk7XG5cdFx0fSA6XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGIgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBiID0gYi5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBiID09PSBhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHQvKiBTb3J0aW5nXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBEb2N1bWVudCBvcmRlciBzb3J0aW5nXG5cdHNvcnRPcmRlciA9IGhhc0NvbXBhcmUgP1xuXHRmdW5jdGlvbiggYSwgYiApIHtcblxuXHRcdC8vIEZsYWcgZm9yIGR1cGxpY2F0ZSByZW1vdmFsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdC8vIFNvcnQgb24gbWV0aG9kIGV4aXN0ZW5jZSBpZiBvbmx5IG9uZSBpbnB1dCBoYXMgY29tcGFyZURvY3VtZW50UG9zaXRpb25cblx0XHR2YXIgY29tcGFyZSA9ICFhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIC0gIWIuY29tcGFyZURvY3VtZW50UG9zaXRpb247XG5cdFx0aWYgKCBjb21wYXJlICkge1xuXHRcdFx0cmV0dXJuIGNvbXBhcmU7XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsY3VsYXRlIHBvc2l0aW9uIGlmIGJvdGggaW5wdXRzIGJlbG9uZyB0byB0aGUgc2FtZSBkb2N1bWVudFxuXHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0Y29tcGFyZSA9ICggYS5vd25lckRvY3VtZW50IHx8IGEgKSA9PSAoIGIub3duZXJEb2N1bWVudCB8fCBiICkgP1xuXHRcdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYiApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIHdlIGtub3cgdGhleSBhcmUgZGlzY29ubmVjdGVkXG5cdFx0XHQxO1xuXG5cdFx0Ly8gRGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0aWYgKCBjb21wYXJlICYgMSB8fFxuXHRcdFx0KCAhc3VwcG9ydC5zb3J0RGV0YWNoZWQgJiYgYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYSApID09PSBjb21wYXJlICkgKSB7XG5cblx0XHRcdC8vIENob29zZSB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIHJlbGF0ZWQgdG8gb3VyIHByZWZlcnJlZCBkb2N1bWVudFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdGlmICggYSA9PSBkb2N1bWVudCB8fCBhLm93bmVyRG9jdW1lbnQgPT0gcHJlZmVycmVkRG9jICYmXG5cdFx0XHRcdGNvbnRhaW5zKCBwcmVmZXJyZWREb2MsIGEgKSApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0aWYgKCBiID09IGRvY3VtZW50IHx8IGIub3duZXJEb2N1bWVudCA9PSBwcmVmZXJyZWREb2MgJiZcblx0XHRcdFx0Y29udGFpbnMoIHByZWZlcnJlZERvYywgYiApICkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFpbnRhaW4gb3JpZ2luYWwgb3JkZXJcblx0XHRcdHJldHVybiBzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBhcmUgJiA0ID8gLTEgOiAxO1xuXHR9IDpcblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBFeGl0IGVhcmx5IGlmIHRoZSBub2RlcyBhcmUgaWRlbnRpY2FsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdHZhciBjdXIsXG5cdFx0XHRpID0gMCxcblx0XHRcdGF1cCA9IGEucGFyZW50Tm9kZSxcblx0XHRcdGJ1cCA9IGIucGFyZW50Tm9kZSxcblx0XHRcdGFwID0gWyBhIF0sXG5cdFx0XHRicCA9IFsgYiBdO1xuXG5cdFx0Ly8gUGFyZW50bGVzcyBub2RlcyBhcmUgZWl0aGVyIGRvY3VtZW50cyBvciBkaXNjb25uZWN0ZWRcblx0XHRpZiAoICFhdXAgfHwgIWJ1cCApIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuXHRcdFx0cmV0dXJuIGEgPT0gZG9jdW1lbnQgPyAtMSA6XG5cdFx0XHRcdGIgPT0gZG9jdW1lbnQgPyAxIDpcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cblx0XHRcdFx0YXVwID8gLTEgOlxuXHRcdFx0XHRidXAgPyAxIDpcblx0XHRcdFx0c29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXG5cdFx0Ly8gSWYgdGhlIG5vZGVzIGFyZSBzaWJsaW5ncywgd2UgY2FuIGRvIGEgcXVpY2sgY2hlY2tcblx0XHR9IGVsc2UgaWYgKCBhdXAgPT09IGJ1cCApIHtcblx0XHRcdHJldHVybiBzaWJsaW5nQ2hlY2soIGEsIGIgKTtcblx0XHR9XG5cblx0XHQvLyBPdGhlcndpc2Ugd2UgbmVlZCBmdWxsIGxpc3RzIG9mIHRoZWlyIGFuY2VzdG9ycyBmb3IgY29tcGFyaXNvblxuXHRcdGN1ciA9IGE7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRhcC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cdFx0Y3VyID0gYjtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdGJwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblxuXHRcdC8vIFdhbGsgZG93biB0aGUgdHJlZSBsb29raW5nIGZvciBhIGRpc2NyZXBhbmN5XG5cdFx0d2hpbGUgKCBhcFsgaSBdID09PSBicFsgaSBdICkge1xuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiBpID9cblxuXHRcdFx0Ly8gRG8gYSBzaWJsaW5nIGNoZWNrIGlmIHRoZSBub2RlcyBoYXZlIGEgY29tbW9uIGFuY2VzdG9yXG5cdFx0XHRzaWJsaW5nQ2hlY2soIGFwWyBpIF0sIGJwWyBpIF0gKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSBub2RlcyBpbiBvdXIgZG9jdW1lbnQgc29ydCBmaXJzdFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuXHRcdFx0YXBbIGkgXSA9PSBwcmVmZXJyZWREb2MgPyAtMSA6XG5cdFx0XHRicFsgaSBdID09IHByZWZlcnJlZERvYyA/IDEgOlxuXHRcdFx0LyogZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cblx0XHRcdDA7XG5cdH07XG5cblx0cmV0dXJuIGRvY3VtZW50O1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdHNldERvY3VtZW50KCBlbGVtICk7XG5cblx0aWYgKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdCFub25uYXRpdmVTZWxlY3RvckNhY2hlWyBleHByICsgXCIgXCIgXSAmJlxuXHRcdCggIXJidWdneU1hdGNoZXMgfHwgIXJidWdneU1hdGNoZXMudGVzdCggZXhwciApICkgJiZcblx0XHQoICFyYnVnZ3lRU0EgICAgIHx8ICFyYnVnZ3lRU0EudGVzdCggZXhwciApICkgKSB7XG5cblx0XHR0cnkge1xuXHRcdFx0dmFyIHJldCA9IG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXG5cdFx0XHQvLyBJRSA5J3MgbWF0Y2hlc1NlbGVjdG9yIHJldHVybnMgZmFsc2Ugb24gZGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0XHRpZiAoIHJldCB8fCBzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cblx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0Ly8gZnJhZ21lbnQgaW4gSUUgOVxuXHRcdFx0XHRlbGVtLmRvY3VtZW50ICYmIGVsZW0uZG9jdW1lbnQubm9kZVR5cGUgIT09IDExICkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSggZXhwciwgdHJ1ZSApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIGRvY3VtZW50LCBudWxsLCBbIGVsZW0gXSApLmxlbmd0aCA+IDA7XG59O1xuXG5TaXp6bGUuY29udGFpbnMgPSBmdW5jdGlvbiggY29udGV4dCwgZWxlbSApIHtcblxuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCAoIGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0ICkgIT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0fVxuXHRyZXR1cm4gY29udGFpbnMoIGNvbnRleHQsIGVsZW0gKTtcbn07XG5cblNpenpsZS5hdHRyID0gZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cblx0Ly8gU2V0IGRvY3VtZW50IHZhcnMgaWYgbmVlZGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggKCBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSApICE9IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdH1cblxuXHR2YXIgZm4gPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUudG9Mb3dlckNhc2UoKSBdLFxuXG5cdFx0Ly8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBPYmplY3QucHJvdG90eXBlIHByb3BlcnRpZXMgKGpRdWVyeSAjMTM4MDcpXG5cdFx0dmFsID0gZm4gJiYgaGFzT3duLmNhbGwoIEV4cHIuYXR0ckhhbmRsZSwgbmFtZS50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0Zm4oIGVsZW0sIG5hbWUsICFkb2N1bWVudElzSFRNTCApIDpcblx0XHRcdHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgP1xuXHRcdHZhbCA6XG5cdFx0c3VwcG9ydC5hdHRyaWJ1dGVzIHx8ICFkb2N1bWVudElzSFRNTCA/XG5cdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSApIDpcblx0XHRcdCggdmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkgKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcbn07XG5cblNpenpsZS5lc2NhcGUgPSBmdW5jdGlvbiggc2VsICkge1xuXHRyZXR1cm4gKCBzZWwgKyBcIlwiICkucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xufTtcblxuU2l6emxlLmVycm9yID0gZnVuY3Rpb24oIG1zZyApIHtcblx0dGhyb3cgbmV3IEVycm9yKCBcIlN5bnRheCBlcnJvciwgdW5yZWNvZ25pemVkIGV4cHJlc3Npb246IFwiICsgbXNnICk7XG59O1xuXG4vKipcbiAqIERvY3VtZW50IHNvcnRpbmcgYW5kIHJlbW92aW5nIGR1cGxpY2F0ZXNcbiAqIEBwYXJhbSB7QXJyYXlMaWtlfSByZXN1bHRzXG4gKi9cblNpenpsZS51bmlxdWVTb3J0ID0gZnVuY3Rpb24oIHJlc3VsdHMgKSB7XG5cdHZhciBlbGVtLFxuXHRcdGR1cGxpY2F0ZXMgPSBbXSxcblx0XHRqID0gMCxcblx0XHRpID0gMDtcblxuXHQvLyBVbmxlc3Mgd2UgKmtub3cqIHdlIGNhbiBkZXRlY3QgZHVwbGljYXRlcywgYXNzdW1lIHRoZWlyIHByZXNlbmNlXG5cdGhhc0R1cGxpY2F0ZSA9ICFzdXBwb3J0LmRldGVjdER1cGxpY2F0ZXM7XG5cdHNvcnRJbnB1dCA9ICFzdXBwb3J0LnNvcnRTdGFibGUgJiYgcmVzdWx0cy5zbGljZSggMCApO1xuXHRyZXN1bHRzLnNvcnQoIHNvcnRPcmRlciApO1xuXG5cdGlmICggaGFzRHVwbGljYXRlICkge1xuXHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENsZWFyIGlucHV0IGFmdGVyIHNvcnRpbmcgdG8gcmVsZWFzZSBvYmplY3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L3NpenpsZS9wdWxsLzIyNVxuXHRzb3J0SW5wdXQgPSBudWxsO1xuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbmdldFRleHQgPSBTaXp6bGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbm9kZSxcblx0XHRyZXQgPSBcIlwiLFxuXHRcdGkgPSAwLFxuXHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRpZiAoICFub2RlVHlwZSApIHtcblxuXHRcdC8vIElmIG5vIG5vZGVUeXBlLCB0aGlzIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGFycmF5XG5cdFx0d2hpbGUgKCAoIG5vZGUgPSBlbGVtWyBpKysgXSApICkge1xuXG5cdFx0XHQvLyBEbyBub3QgdHJhdmVyc2UgY29tbWVudCBub2Rlc1xuXHRcdFx0cmV0ICs9IGdldFRleHQoIG5vZGUgKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAxIHx8IG5vZGVUeXBlID09PSA5IHx8IG5vZGVUeXBlID09PSAxMSApIHtcblxuXHRcdC8vIFVzZSB0ZXh0Q29udGVudCBmb3IgZWxlbWVudHNcblx0XHQvLyBpbm5lclRleHQgdXNhZ2UgcmVtb3ZlZCBmb3IgY29uc2lzdGVuY3kgb2YgbmV3IGxpbmVzIChqUXVlcnkgIzExMTUzKVxuXHRcdGlmICggdHlwZW9mIGVsZW0udGV4dENvbnRlbnQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS50ZXh0Q29udGVudDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBUcmF2ZXJzZSBpdHMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRyZXQgKz0gZ2V0VGV4dCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHR9XG5cblx0Ly8gRG8gbm90IGluY2x1ZGUgY29tbWVudCBvciBwcm9jZXNzaW5nIGluc3RydWN0aW9uIG5vZGVzXG5cblx0cmV0dXJuIHJldDtcbn07XG5cbkV4cHIgPSBTaXp6bGUuc2VsZWN0b3JzID0ge1xuXG5cdC8vIENhbiBiZSBhZGp1c3RlZCBieSB0aGUgdXNlclxuXHRjYWNoZUxlbmd0aDogNTAsXG5cblx0Y3JlYXRlUHNldWRvOiBtYXJrRnVuY3Rpb24sXG5cblx0bWF0Y2g6IG1hdGNoRXhwcixcblxuXHRhdHRySGFuZGxlOiB7fSxcblxuXHRmaW5kOiB7fSxcblxuXHRyZWxhdGl2ZToge1xuXHRcdFwiPlwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCIgXCI6IHsgZGlyOiBcInBhcmVudE5vZGVcIiB9LFxuXHRcdFwiK1wiOiB7IGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIiwgZmlyc3Q6IHRydWUgfSxcblx0XHRcIn5cIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIgfVxuXHR9LFxuXG5cdHByZUZpbHRlcjoge1xuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHRtYXRjaFsgMSBdID0gbWF0Y2hbIDEgXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBnaXZlbiB2YWx1ZSB0byBtYXRjaFszXSB3aGV0aGVyIHF1b3RlZCBvciB1bnF1b3RlZFxuXHRcdFx0bWF0Y2hbIDMgXSA9ICggbWF0Y2hbIDMgXSB8fCBtYXRjaFsgNCBdIHx8XG5cdFx0XHRcdG1hdGNoWyA1IF0gfHwgXCJcIiApLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cblx0XHRcdGlmICggbWF0Y2hbIDIgXSA9PT0gXCJ+PVwiICkge1xuXHRcdFx0XHRtYXRjaFsgMyBdID0gXCIgXCIgKyBtYXRjaFsgMyBdICsgXCIgXCI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaC5zbGljZSggMCwgNCApO1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblxuXHRcdFx0LyogbWF0Y2hlcyBmcm9tIG1hdGNoRXhwcltcIkNISUxEXCJdXG5cdFx0XHRcdDEgdHlwZSAob25seXxudGh8Li4uKVxuXHRcdFx0XHQyIHdoYXQgKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdDMgYXJndW1lbnQgKGV2ZW58b2RkfFxcZCp8XFxkKm4oWystXVxcZCspP3wuLi4pXG5cdFx0XHRcdDQgeG4tY29tcG9uZW50IG9mIHhuK3kgYXJndW1lbnQgKFsrLV0/XFxkKm58KVxuXHRcdFx0XHQ1IHNpZ24gb2YgeG4tY29tcG9uZW50XG5cdFx0XHRcdDYgeCBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NyBzaWduIG9mIHktY29tcG9uZW50XG5cdFx0XHRcdDggeSBvZiB5LWNvbXBvbmVudFxuXHRcdFx0Ki9cblx0XHRcdG1hdGNoWyAxIF0gPSBtYXRjaFsgMSBdLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdGlmICggbWF0Y2hbIDEgXS5zbGljZSggMCwgMyApID09PSBcIm50aFwiICkge1xuXG5cdFx0XHRcdC8vIG50aC0qIHJlcXVpcmVzIGFyZ3VtZW50XG5cdFx0XHRcdGlmICggIW1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFsgMCBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBudW1lcmljIHggYW5kIHkgcGFyYW1ldGVycyBmb3IgRXhwci5maWx0ZXIuQ0hJTERcblx0XHRcdFx0Ly8gcmVtZW1iZXIgdGhhdCBmYWxzZS90cnVlIGNhc3QgcmVzcGVjdGl2ZWx5IHRvIDAvMVxuXHRcdFx0XHRtYXRjaFsgNCBdID0gKyggbWF0Y2hbIDQgXSA/XG5cdFx0XHRcdFx0bWF0Y2hbIDUgXSArICggbWF0Y2hbIDYgXSB8fCAxICkgOlxuXHRcdFx0XHRcdDIgKiAoIG1hdGNoWyAzIF0gPT09IFwiZXZlblwiIHx8IG1hdGNoWyAzIF0gPT09IFwib2RkXCIgKSApO1xuXHRcdFx0XHRtYXRjaFsgNSBdID0gKyggKCBtYXRjaFsgNyBdICsgbWF0Y2hbIDggXSApIHx8IG1hdGNoWyAzIF0gPT09IFwib2RkXCIgKTtcblxuXHRcdFx0XHQvLyBvdGhlciB0eXBlcyBwcm9oaWJpdCBhcmd1bWVudHNcblx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbIDAgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdHZhciBleGNlc3MsXG5cdFx0XHRcdHVucXVvdGVkID0gIW1hdGNoWyA2IF0gJiYgbWF0Y2hbIDIgXTtcblxuXHRcdFx0aWYgKCBtYXRjaEV4cHJbIFwiQ0hJTERcIiBdLnRlc3QoIG1hdGNoWyAwIF0gKSApIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFjY2VwdCBxdW90ZWQgYXJndW1lbnRzIGFzLWlzXG5cdFx0XHRpZiAoIG1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdG1hdGNoWyAyIF0gPSBtYXRjaFsgNCBdIHx8IG1hdGNoWyA1IF0gfHwgXCJcIjtcblxuXHRcdFx0Ly8gU3RyaXAgZXhjZXNzIGNoYXJhY3RlcnMgZnJvbSB1bnF1b3RlZCBhcmd1bWVudHNcblx0XHRcdH0gZWxzZSBpZiAoIHVucXVvdGVkICYmIHJwc2V1ZG8udGVzdCggdW5xdW90ZWQgKSAmJlxuXG5cdFx0XHRcdC8vIEdldCBleGNlc3MgZnJvbSB0b2tlbml6ZSAocmVjdXJzaXZlbHkpXG5cdFx0XHRcdCggZXhjZXNzID0gdG9rZW5pemUoIHVucXVvdGVkLCB0cnVlICkgKSAmJlxuXG5cdFx0XHRcdC8vIGFkdmFuY2UgdG8gdGhlIG5leHQgY2xvc2luZyBwYXJlbnRoZXNpc1xuXHRcdFx0XHQoIGV4Y2VzcyA9IHVucXVvdGVkLmluZGV4T2YoIFwiKVwiLCB1bnF1b3RlZC5sZW5ndGggLSBleGNlc3MgKSAtIHVucXVvdGVkLmxlbmd0aCApICkge1xuXG5cdFx0XHRcdC8vIGV4Y2VzcyBpcyBhIG5lZ2F0aXZlIGluZGV4XG5cdFx0XHRcdG1hdGNoWyAwIF0gPSBtYXRjaFsgMCBdLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdFx0bWF0Y2hbIDIgXSA9IHVucXVvdGVkLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIG9ubHkgY2FwdHVyZXMgbmVlZGVkIGJ5IHRoZSBwc2V1ZG8gZmlsdGVyIG1ldGhvZCAodHlwZSBhbmQgYXJndW1lbnQpXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDMgKTtcblx0XHR9XG5cdH0sXG5cblx0ZmlsdGVyOiB7XG5cblx0XHRcIlRBR1wiOiBmdW5jdGlvbiggbm9kZU5hbWVTZWxlY3RvciApIHtcblx0XHRcdHZhciBub2RlTmFtZSA9IG5vZGVOYW1lU2VsZWN0b3IucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5vZGVOYW1lU2VsZWN0b3IgPT09IFwiKlwiID9cblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lO1xuXHRcdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNMQVNTXCI6IGZ1bmN0aW9uKCBjbGFzc05hbWUgKSB7XG5cdFx0XHR2YXIgcGF0dGVybiA9IGNsYXNzQ2FjaGVbIGNsYXNzTmFtZSArIFwiIFwiIF07XG5cblx0XHRcdHJldHVybiBwYXR0ZXJuIHx8XG5cdFx0XHRcdCggcGF0dGVybiA9IG5ldyBSZWdFeHAoIFwiKF58XCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFx0XHRcIilcIiArIGNsYXNzTmFtZSArIFwiKFwiICsgd2hpdGVzcGFjZSArIFwifCQpXCIgKSApICYmIGNsYXNzQ2FjaGUoXG5cdFx0XHRcdFx0XHRjbGFzc05hbWUsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF0dGVybi50ZXN0KFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtLmNsYXNzTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbGVtLmNsYXNzTmFtZSB8fFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIFwiY2xhc3NcIiApIHx8XG5cdFx0XHRcdFx0XHRcdFx0XCJcIlxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbmFtZSwgb3BlcmF0b3IsIGNoZWNrICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gU2l6emxlLmF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCIhPVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggIW9wZXJhdG9yICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzdWx0ICs9IFwiXCI7XG5cblx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5cdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCI9XCIgPyByZXN1bHQgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIhPVwiID8gcmVzdWx0ICE9PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiXj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID09PSAwIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIqPVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPiAtMSA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiJD1cIiA/IGNoZWNrICYmIHJlc3VsdC5zbGljZSggLWNoZWNrLmxlbmd0aCApID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwifj1cIiA/ICggXCIgXCIgKyByZXN1bHQucmVwbGFjZSggcndoaXRlc3BhY2UsIFwiIFwiICkgKyBcIiBcIiApLmluZGV4T2YoIGNoZWNrICkgPiAtMSA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwifD1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgfHwgcmVzdWx0LnNsaWNlKCAwLCBjaGVjay5sZW5ndGggKyAxICkgPT09IGNoZWNrICsgXCItXCIgOlxuXHRcdFx0XHRcdGZhbHNlO1xuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggdHlwZSwgd2hhdCwgX2FyZ3VtZW50LCBmaXJzdCwgbGFzdCApIHtcblx0XHRcdHZhciBzaW1wbGUgPSB0eXBlLnNsaWNlKCAwLCAzICkgIT09IFwibnRoXCIsXG5cdFx0XHRcdGZvcndhcmQgPSB0eXBlLnNsaWNlKCAtNCApICE9PSBcImxhc3RcIixcblx0XHRcdFx0b2ZUeXBlID0gd2hhdCA9PT0gXCJvZi10eXBlXCI7XG5cblx0XHRcdHJldHVybiBmaXJzdCA9PT0gMSAmJiBsYXN0ID09PSAwID9cblxuXHRcdFx0XHQvLyBTaG9ydGN1dCBmb3IgOm50aC0qKG4pXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiAhIWVsZW0ucGFyZW50Tm9kZTtcblx0XHRcdFx0fSA6XG5cblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGNhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSwgbm9kZSwgbm9kZUluZGV4LCBzdGFydCxcblx0XHRcdFx0XHRcdGRpciA9IHNpbXBsZSAhPT0gZm9yd2FyZCA/IFwibmV4dFNpYmxpbmdcIiA6IFwicHJldmlvdXNTaWJsaW5nXCIsXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0XHRuYW1lID0gb2ZUeXBlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdHVzZUNhY2hlID0gIXhtbCAmJiAhb2ZUeXBlLFxuXHRcdFx0XHRcdFx0ZGlmZiA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cblx0XHRcdFx0XHRcdC8vIDooZmlyc3R8bGFzdHxvbmx5KS0oY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0XHRcdGlmICggc2ltcGxlICkge1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIGRpciApIHtcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9IG5vZGVbIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIG9mVHlwZSA/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSA6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZVR5cGUgPT09IDEgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdC8vIFJldmVyc2UgZGlyZWN0aW9uIGZvciA6b25seS0qIChpZiB3ZSBoYXZlbid0IHlldCBkb25lIHNvKVxuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0ID0gZGlyID0gdHlwZSA9PT0gXCJvbmx5XCIgJiYgIXN0YXJ0ICYmIFwibmV4dFNpYmxpbmdcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c3RhcnQgPSBbIGZvcndhcmQgPyBwYXJlbnQuZmlyc3RDaGlsZCA6IHBhcmVudC5sYXN0Q2hpbGQgXTtcblxuXHRcdFx0XHRcdFx0Ly8gbm9uLXhtbCA6bnRoLWNoaWxkKC4uLikgc3RvcmVzIGNhY2hlIGRhdGEgb24gYHBhcmVudGBcblx0XHRcdFx0XHRcdGlmICggZm9yd2FyZCAmJiB1c2VDYWNoZSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBTZWVrIGBlbGVtYCBmcm9tIGEgcHJldmlvdXNseS1jYWNoZWQgaW5kZXhcblxuXHRcdFx0XHRcdFx0XHQvLyAuLi5pbiBhIGd6aXAtZnJpZW5kbHkgd2F5XG5cdFx0XHRcdFx0XHRcdG5vZGUgPSBwYXJlbnQ7XG5cdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBjYWNoZVsgMSBdO1xuXHRcdFx0XHRcdFx0XHRkaWZmID0gbm9kZUluZGV4ICYmIGNhY2hlWyAyIF07XG5cdFx0XHRcdFx0XHRcdG5vZGUgPSBub2RlSW5kZXggJiYgcGFyZW50LmNoaWxkTm9kZXNbIG5vZGVJbmRleCBdO1xuXG5cdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmFsbGJhY2sgdG8gc2Vla2luZyBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHQoIGRpZmYgPSBub2RlSW5kZXggPSAwICkgfHwgc3RhcnQucG9wKCkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFdoZW4gZm91bmQsIGNhY2hlIGluZGV4ZXMgb24gYHBhcmVudGAgYW5kIGJyZWFrXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICYmICsrZGlmZiAmJiBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgbm9kZUluZGV4LCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBVc2UgcHJldmlvdXNseS1jYWNoZWQgZWxlbWVudCBpbmRleCBpZiBhdmFpbGFibGVcblx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8ICggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y2FjaGUgPSB1bmlxdWVDYWNoZVsgdHlwZSBdIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0XHRkaWZmID0gbm9kZUluZGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8geG1sIDpudGgtY2hpbGQoLi4uKVxuXHRcdFx0XHRcdFx0XHQvLyBvciA6bnRoLWxhc3QtY2hpbGQoLi4uKSBvciA6bnRoKC1sYXN0KT8tb2YtdHlwZSguLi4pXG5cdFx0XHRcdFx0XHRcdGlmICggZGlmZiA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBVc2UgdGhlIHNhbWUgbG9vcCBhcyBhYm92ZSB0byBzZWVrIGBlbGVtYCBmcm9tIHRoZSBzdGFydFxuXHRcdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KCBkaWZmID0gbm9kZUluZGV4ID0gMCApIHx8IHN0YXJ0LnBvcCgpICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0KytkaWZmICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENhY2hlIHRoZSBpbmRleCBvZiBlYWNoIGVuY291bnRlcmVkIGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyB0eXBlIF0gPSBbIGRpcnJ1bnMsIGRpZmYgXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBJbmNvcnBvcmF0ZSB0aGUgb2Zmc2V0LCB0aGVuIGNoZWNrIGFnYWluc3QgY3ljbGUgc2l6ZVxuXHRcdFx0XHRcdFx0ZGlmZiAtPSBsYXN0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRpZmYgPT09IGZpcnN0IHx8ICggZGlmZiAlIGZpcnN0ID09PSAwICYmIGRpZmYgLyBmaXJzdCA+PSAwICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIlBTRVVET1wiOiBmdW5jdGlvbiggcHNldWRvLCBhcmd1bWVudCApIHtcblxuXHRcdFx0Ly8gcHNldWRvLWNsYXNzIG5hbWVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI3BzZXVkby1jbGFzc2VzXG5cdFx0XHQvLyBQcmlvcml0aXplIGJ5IGNhc2Ugc2Vuc2l0aXZpdHkgaW4gY2FzZSBjdXN0b20gcHNldWRvcyBhcmUgYWRkZWQgd2l0aCB1cHBlcmNhc2UgbGV0dGVyc1xuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCBzZXRGaWx0ZXJzIGluaGVyaXRzIGZyb20gcHNldWRvc1xuXHRcdFx0dmFyIGFyZ3MsXG5cdFx0XHRcdGZuID0gRXhwci5wc2V1ZG9zWyBwc2V1ZG8gXSB8fCBFeHByLnNldEZpbHRlcnNbIHBzZXVkby50b0xvd2VyQ2FzZSgpIF0gfHxcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIiArIHBzZXVkbyApO1xuXG5cdFx0XHQvLyBUaGUgdXNlciBtYXkgdXNlIGNyZWF0ZVBzZXVkbyB0byBpbmRpY2F0ZSB0aGF0XG5cdFx0XHQvLyBhcmd1bWVudHMgYXJlIG5lZWRlZCB0byBjcmVhdGUgdGhlIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0Ly8ganVzdCBhcyBTaXp6bGUgZG9lc1xuXHRcdFx0aWYgKCBmblsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRyZXR1cm4gZm4oIGFyZ3VtZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1dCBtYWludGFpbiBzdXBwb3J0IGZvciBvbGQgc2lnbmF0dXJlc1xuXHRcdFx0aWYgKCBmbi5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRhcmdzID0gWyBwc2V1ZG8sIHBzZXVkbywgXCJcIiwgYXJndW1lbnQgXTtcblx0XHRcdFx0cmV0dXJuIEV4cHIuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eSggcHNldWRvLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdFx0bWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcyApIHtcblx0XHRcdFx0XHRcdHZhciBpZHgsXG5cdFx0XHRcdFx0XHRcdG1hdGNoZWQgPSBmbiggc2VlZCwgYXJndW1lbnQgKSxcblx0XHRcdFx0XHRcdFx0aSA9IG1hdGNoZWQubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRcdGlkeCA9IGluZGV4T2YoIHNlZWQsIG1hdGNoZWRbIGkgXSApO1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpZHggXSA9ICEoIG1hdGNoZXNbIGlkeCBdID0gbWF0Y2hlZFsgaSBdICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApIDpcblx0XHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmbiggZWxlbSwgMCwgYXJncyApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbjtcblx0XHR9XG5cdH0sXG5cblx0cHNldWRvczoge1xuXG5cdFx0Ly8gUG90ZW50aWFsbHkgY29tcGxleCBwc2V1ZG9zXG5cdFx0XCJub3RcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cblx0XHRcdC8vIFRyaW0gdGhlIHNlbGVjdG9yIHBhc3NlZCB0byBjb21waWxlXG5cdFx0XHQvLyB0byBhdm9pZCB0cmVhdGluZyBsZWFkaW5nIGFuZCB0cmFpbGluZ1xuXHRcdFx0Ly8gc3BhY2VzIGFzIGNvbWJpbmF0b3JzXG5cdFx0XHR2YXIgaW5wdXQgPSBbXSxcblx0XHRcdFx0cmVzdWx0cyA9IFtdLFxuXHRcdFx0XHRtYXRjaGVyID0gY29tcGlsZSggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApICk7XG5cblx0XHRcdHJldHVybiBtYXRjaGVyWyBleHBhbmRvIF0gP1xuXHRcdFx0XHRtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHRcdFx0dW5tYXRjaGVkID0gbWF0Y2hlciggc2VlZCwgbnVsbCwgeG1sLCBbXSApLFxuXHRcdFx0XHRcdFx0aSA9IHNlZWQubGVuZ3RoO1xuXG5cdFx0XHRcdFx0Ly8gTWF0Y2ggZWxlbWVudHMgdW5tYXRjaGVkIGJ5IGBtYXRjaGVyYFxuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSB1bm1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpIF0gPSAhKCBtYXRjaGVzWyBpIF0gPSBlbGVtICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHRpbnB1dFsgMCBdID0gZWxlbTtcblx0XHRcdFx0XHRtYXRjaGVyKCBpbnB1dCwgbnVsbCwgeG1sLCByZXN1bHRzICk7XG5cblx0XHRcdFx0XHQvLyBEb24ndCBrZWVwIHRoZSBlbGVtZW50IChpc3N1ZSAjMjk5KVxuXHRcdFx0XHRcdGlucHV0WyAwIF0gPSBudWxsO1xuXHRcdFx0XHRcdHJldHVybiAhcmVzdWx0cy5wb3AoKTtcblx0XHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHRcImhhc1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIFNpenpsZSggc2VsZWN0b3IsIGVsZW0gKS5sZW5ndGggPiAwO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHRcImNvbnRhaW5zXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gKCBlbGVtLnRleHRDb250ZW50IHx8IGdldFRleHQoIGVsZW0gKSApLmluZGV4T2YoIHRleHQgKSA+IC0xO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHQvLyBcIldoZXRoZXIgYW4gZWxlbWVudCBpcyByZXByZXNlbnRlZCBieSBhIDpsYW5nKCkgc2VsZWN0b3Jcblx0XHQvLyBpcyBiYXNlZCBzb2xlbHkgb24gdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZVxuXHRcdC8vIGJlaW5nIGVxdWFsIHRvIHRoZSBpZGVudGlmaWVyIEMsXG5cdFx0Ly8gb3IgYmVnaW5uaW5nIHdpdGggdGhlIGlkZW50aWZpZXIgQyBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSBcIi1cIi5cblx0XHQvLyBUaGUgbWF0Y2hpbmcgb2YgQyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWUgaXMgcGVyZm9ybWVkIGNhc2UtaW5zZW5zaXRpdmVseS5cblx0XHQvLyBUaGUgaWRlbnRpZmllciBDIGRvZXMgbm90IGhhdmUgdG8gYmUgYSB2YWxpZCBsYW5ndWFnZSBuYW1lLlwiXG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNsYW5nLXBzZXVkb1xuXHRcdFwibGFuZ1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBsYW5nICkge1xuXG5cdFx0XHQvLyBsYW5nIHZhbHVlIG11c3QgYmUgYSB2YWxpZCBpZGVudGlmaWVyXG5cdFx0XHRpZiAoICFyaWRlbnRpZmllci50ZXN0KCBsYW5nIHx8IFwiXCIgKSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIGxhbmc6IFwiICsgbGFuZyApO1xuXHRcdFx0fVxuXHRcdFx0bGFuZyA9IGxhbmcucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgZWxlbUxhbmc7XG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRpZiAoICggZWxlbUxhbmcgPSBkb2N1bWVudElzSFRNTCA/XG5cdFx0XHRcdFx0XHRlbGVtLmxhbmcgOlxuXHRcdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIFwieG1sOmxhbmdcIiApIHx8IGVsZW0uZ2V0QXR0cmlidXRlKCBcImxhbmdcIiApICkgKSB7XG5cblx0XHRcdFx0XHRcdGVsZW1MYW5nID0gZWxlbUxhbmcudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtTGFuZyA9PT0gbGFuZyB8fCBlbGVtTGFuZy5pbmRleE9mKCBsYW5nICsgXCItXCIgKSA9PT0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gd2hpbGUgKCAoIGVsZW0gPSBlbGVtLnBhcmVudE5vZGUgKSAmJiBlbGVtLm5vZGVUeXBlID09PSAxICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0Ly8gTWlzY2VsbGFuZW91c1xuXHRcdFwidGFyZ2V0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cdFx0XHRyZXR1cm4gaGFzaCAmJiBoYXNoLnNsaWNlKCAxICkgPT09IGVsZW0uaWQ7XG5cdFx0fSxcblxuXHRcdFwicm9vdFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2NFbGVtO1xuXHRcdH0sXG5cblx0XHRcImZvY3VzXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiZcblx0XHRcdFx0KCAhZG9jdW1lbnQuaGFzRm9jdXMgfHwgZG9jdW1lbnQuaGFzRm9jdXMoKSApICYmXG5cdFx0XHRcdCEhKCBlbGVtLnR5cGUgfHwgZWxlbS5ocmVmIHx8IH5lbGVtLnRhYkluZGV4ICk7XG5cdFx0fSxcblxuXHRcdC8vIEJvb2xlYW4gcHJvcGVydGllc1xuXHRcdFwiZW5hYmxlZFwiOiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggZmFsc2UgKSxcblx0XHRcImRpc2FibGVkXCI6IGNyZWF0ZURpc2FibGVkUHNldWRvKCB0cnVlICksXG5cblx0XHRcImNoZWNrZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIEluIENTUzMsIDpjaGVja2VkIHNob3VsZCByZXR1cm4gYm90aCBjaGVja2VkIGFuZCBzZWxlY3RlZCBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdHZhciBub2RlTmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgISFlbGVtLmNoZWNrZWQgKSB8fFxuXHRcdFx0XHQoIG5vZGVOYW1lID09PSBcIm9wdGlvblwiICYmICEhZWxlbS5zZWxlY3RlZCApO1xuXHRcdH0sXG5cblx0XHRcInNlbGVjdGVkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBBY2Nlc3NpbmcgdGhpcyBwcm9wZXJ0eSBtYWtlcyBzZWxlY3RlZC1ieS1kZWZhdWx0XG5cdFx0XHQvLyBvcHRpb25zIGluIFNhZmFyaSB3b3JrIHByb3Blcmx5XG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uc2VsZWN0ZWQgPT09IHRydWU7XG5cdFx0fSxcblxuXHRcdC8vIENvbnRlbnRzXG5cdFx0XCJlbXB0eVwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNlbXB0eS1wc2V1ZG9cblx0XHRcdC8vIDplbXB0eSBpcyBuZWdhdGVkIGJ5IGVsZW1lbnQgKDEpIG9yIGNvbnRlbnQgbm9kZXMgKHRleHQ6IDM7IGNkYXRhOiA0OyBlbnRpdHkgcmVmOiA1KSxcblx0XHRcdC8vICAgYnV0IG5vdCBieSBvdGhlcnMgKGNvbW1lbnQ6IDg7IHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb246IDc7IGV0Yy4pXG5cdFx0XHQvLyBub2RlVHlwZSA8IDYgd29ya3MgYmVjYXVzZSBhdHRyaWJ1dGVzICgyKSBkbyBub3QgYXBwZWFyIGFzIGNoaWxkcmVuXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlIDwgNiApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHRcInBhcmVudFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiAhRXhwci5wc2V1ZG9zWyBcImVtcHR5XCIgXSggZWxlbSApO1xuXHRcdH0sXG5cblx0XHQvLyBFbGVtZW50L2lucHV0IHR5cGVzXG5cdFx0XCJoZWFkZXJcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmhlYWRlci50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiaW5wdXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmlucHV0cy50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiYnV0dG9uXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gXCJidXR0b25cIiB8fCBuYW1lID09PSBcImJ1dHRvblwiO1xuXHRcdH0sXG5cblx0XHRcInRleHRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgYXR0cjtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiAmJlxuXHRcdFx0XHRlbGVtLnR5cGUgPT09IFwidGV4dFwiICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUU8OFxuXHRcdFx0XHQvLyBOZXcgSFRNTDUgYXR0cmlidXRlIHZhbHVlcyAoZS5nLiwgXCJzZWFyY2hcIikgYXBwZWFyIHdpdGggZWxlbS50eXBlID09PSBcInRleHRcIlxuXHRcdFx0XHQoICggYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApICkgPT0gbnVsbCB8fFxuXHRcdFx0XHRcdGF0dHIudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZXh0XCIgKTtcblx0XHR9LFxuXG5cdFx0Ly8gUG9zaXRpb24taW4tY29sbGVjdGlvblxuXHRcdFwiZmlyc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gWyAwIF07XG5cdFx0fSApLFxuXG5cdFx0XCJsYXN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBfbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gWyBsZW5ndGggLSAxIF07XG5cdFx0fSApLFxuXG5cdFx0XCJlcVwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggX21hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHJldHVybiBbIGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQgXTtcblx0XHR9ICksXG5cblx0XHRcImV2ZW5cIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAwO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwib2RkXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcImx0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/XG5cdFx0XHRcdGFyZ3VtZW50ICsgbGVuZ3RoIDpcblx0XHRcdFx0YXJndW1lbnQgPiBsZW5ndGggP1xuXHRcdFx0XHRcdGxlbmd0aCA6XG5cdFx0XHRcdFx0YXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7IC0taSA+PSAwOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJndFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyArK2kgPCBsZW5ndGg7ICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9IClcblx0fVxufTtcblxuRXhwci5wc2V1ZG9zWyBcIm50aFwiIF0gPSBFeHByLnBzZXVkb3NbIFwiZXFcIiBdO1xuXG4vLyBBZGQgYnV0dG9uL2lucHV0IHR5cGUgcHNldWRvc1xuZm9yICggaSBpbiB7IHJhZGlvOiB0cnVlLCBjaGVja2JveDogdHJ1ZSwgZmlsZTogdHJ1ZSwgcGFzc3dvcmQ6IHRydWUsIGltYWdlOiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlSW5wdXRQc2V1ZG8oIGkgKTtcbn1cbmZvciAoIGkgaW4geyBzdWJtaXQ6IHRydWUsIHJlc2V0OiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlQnV0dG9uUHNldWRvKCBpICk7XG59XG5cbi8vIEVhc3kgQVBJIGZvciBjcmVhdGluZyBuZXcgc2V0RmlsdGVyc1xuZnVuY3Rpb24gc2V0RmlsdGVycygpIHt9XG5zZXRGaWx0ZXJzLnByb3RvdHlwZSA9IEV4cHIuZmlsdGVycyA9IEV4cHIucHNldWRvcztcbkV4cHIuc2V0RmlsdGVycyA9IG5ldyBzZXRGaWx0ZXJzKCk7XG5cbnRva2VuaXplID0gU2l6emxlLnRva2VuaXplID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBwYXJzZU9ubHkgKSB7XG5cdHZhciBtYXRjaGVkLCBtYXRjaCwgdG9rZW5zLCB0eXBlLFxuXHRcdHNvRmFyLCBncm91cHMsIHByZUZpbHRlcnMsXG5cdFx0Y2FjaGVkID0gdG9rZW5DYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggY2FjaGVkICkge1xuXHRcdHJldHVybiBwYXJzZU9ubHkgPyAwIDogY2FjaGVkLnNsaWNlKCAwICk7XG5cdH1cblxuXHRzb0ZhciA9IHNlbGVjdG9yO1xuXHRncm91cHMgPSBbXTtcblx0cHJlRmlsdGVycyA9IEV4cHIucHJlRmlsdGVyO1xuXG5cdHdoaWxlICggc29GYXIgKSB7XG5cblx0XHQvLyBDb21tYSBhbmQgZmlyc3QgcnVuXG5cdFx0aWYgKCAhbWF0Y2hlZCB8fCAoIG1hdGNoID0gcmNvbW1hLmV4ZWMoIHNvRmFyICkgKSApIHtcblx0XHRcdGlmICggbWF0Y2ggKSB7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgY29uc3VtZSB0cmFpbGluZyBjb21tYXMgYXMgdmFsaWRcblx0XHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hbIDAgXS5sZW5ndGggKSB8fCBzb0Zhcjtcblx0XHRcdH1cblx0XHRcdGdyb3Vwcy5wdXNoKCAoIHRva2VucyA9IFtdICkgKTtcblx0XHR9XG5cblx0XHRtYXRjaGVkID0gZmFsc2U7XG5cblx0XHQvLyBDb21iaW5hdG9yc1xuXHRcdGlmICggKCBtYXRjaCA9IHJjb21iaW5hdG9ycy5leGVjKCBzb0ZhciApICkgKSB7XG5cdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdHRva2Vucy5wdXNoKCB7XG5cdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXG5cdFx0XHRcdC8vIENhc3QgZGVzY2VuZGFudCBjb21iaW5hdG9ycyB0byBzcGFjZVxuXHRcdFx0XHR0eXBlOiBtYXRjaFsgMCBdLnJlcGxhY2UoIHJ0cmltLCBcIiBcIiApXG5cdFx0XHR9ICk7XG5cdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZpbHRlcnNcblx0XHRmb3IgKCB0eXBlIGluIEV4cHIuZmlsdGVyICkge1xuXHRcdFx0aWYgKCAoIG1hdGNoID0gbWF0Y2hFeHByWyB0eXBlIF0uZXhlYyggc29GYXIgKSApICYmICggIXByZUZpbHRlcnNbIHR5cGUgXSB8fFxuXHRcdFx0XHQoIG1hdGNoID0gcHJlRmlsdGVyc1sgdHlwZSBdKCBtYXRjaCApICkgKSApIHtcblx0XHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHRcdHRva2Vucy5wdXNoKCB7XG5cdFx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cdFx0XHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdFx0XHRtYXRjaGVzOiBtYXRjaFxuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhbWF0Y2hlZCApIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnZhbGlkIGV4Y2Vzc1xuXHQvLyBpZiB3ZSdyZSBqdXN0IHBhcnNpbmdcblx0Ly8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvciBvciByZXR1cm4gdG9rZW5zXG5cdHJldHVybiBwYXJzZU9ubHkgP1xuXHRcdHNvRmFyLmxlbmd0aCA6XG5cdFx0c29GYXIgP1xuXHRcdFx0U2l6emxlLmVycm9yKCBzZWxlY3RvciApIDpcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIHRva2Vuc1xuXHRcdFx0dG9rZW5DYWNoZSggc2VsZWN0b3IsIGdyb3VwcyApLnNsaWNlKCAwICk7XG59O1xuXG5mdW5jdGlvbiB0b1NlbGVjdG9yKCB0b2tlbnMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSB0b2tlbnMubGVuZ3RoLFxuXHRcdHNlbGVjdG9yID0gXCJcIjtcblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0c2VsZWN0b3IgKz0gdG9rZW5zWyBpIF0udmFsdWU7XG5cdH1cblx0cmV0dXJuIHNlbGVjdG9yO1xufVxuXG5mdW5jdGlvbiBhZGRDb21iaW5hdG9yKCBtYXRjaGVyLCBjb21iaW5hdG9yLCBiYXNlICkge1xuXHR2YXIgZGlyID0gY29tYmluYXRvci5kaXIsXG5cdFx0c2tpcCA9IGNvbWJpbmF0b3IubmV4dCxcblx0XHRrZXkgPSBza2lwIHx8IGRpcixcblx0XHRjaGVja05vbkVsZW1lbnRzID0gYmFzZSAmJiBrZXkgPT09IFwicGFyZW50Tm9kZVwiLFxuXHRcdGRvbmVOYW1lID0gZG9uZSsrO1xuXG5cdHJldHVybiBjb21iaW5hdG9yLmZpcnN0ID9cblxuXHRcdC8vIENoZWNrIGFnYWluc3QgY2xvc2VzdCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudFxuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdHJldHVybiBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gOlxuXG5cdFx0Ly8gQ2hlY2sgYWdhaW5zdCBhbGwgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRzXG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBvbGRDYWNoZSwgdW5pcXVlQ2FjaGUsIG91dGVyQ2FjaGUsXG5cdFx0XHRcdG5ld0NhY2hlID0gWyBkaXJydW5zLCBkb25lTmFtZSBdO1xuXG5cdFx0XHQvLyBXZSBjYW4ndCBzZXQgYXJiaXRyYXJ5IGRhdGEgb24gWE1MIG5vZGVzLCBzbyB0aGV5IGRvbid0IGJlbmVmaXQgZnJvbSBjb21iaW5hdG9yIGNhY2hpbmdcblx0XHRcdGlmICggeG1sICkge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBlbGVtWyBleHBhbmRvIF0gfHwgKCBlbGVtWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgZWxlbS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgZWxlbS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBza2lwICYmIHNraXAgPT09IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0XHRcdFx0ZWxlbSA9IGVsZW1bIGRpciBdIHx8IGVsZW07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAoIG9sZENhY2hlID0gdW5pcXVlQ2FjaGVbIGtleSBdICkgJiZcblx0XHRcdFx0XHRcdFx0b2xkQ2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBvbGRDYWNoZVsgMSBdID09PSBkb25lTmFtZSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBBc3NpZ24gdG8gbmV3Q2FjaGUgc28gcmVzdWx0cyBiYWNrLXByb3BhZ2F0ZSB0byBwcmV2aW91cyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKCBuZXdDYWNoZVsgMiBdID0gb2xkQ2FjaGVbIDIgXSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXVzZSBuZXdjYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyBrZXkgXSA9IG5ld0NhY2hlO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEEgbWF0Y2ggbWVhbnMgd2UncmUgZG9uZTsgYSBmYWlsIG1lYW5zIHdlIGhhdmUgdG8ga2VlcCBjaGVja2luZ1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3Q2FjaGVbIDIgXSA9IG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xufVxuXG5mdW5jdGlvbiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSB7XG5cdHJldHVybiBtYXRjaGVycy5sZW5ndGggPiAxID9cblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIGkgPSBtYXRjaGVycy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAhbWF0Y2hlcnNbIGkgXSggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IDpcblx0XHRtYXRjaGVyc1sgMCBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciwgY29udGV4dHMsIHJlc3VsdHMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHRzWyBpIF0sIHJlc3VsdHMgKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gY29uZGVuc2UoIHVubWF0Y2hlZCwgbWFwLCBmaWx0ZXIsIGNvbnRleHQsIHhtbCApIHtcblx0dmFyIGVsZW0sXG5cdFx0bmV3VW5tYXRjaGVkID0gW10sXG5cdFx0aSA9IDAsXG5cdFx0bGVuID0gdW5tYXRjaGVkLmxlbmd0aCxcblx0XHRtYXBwZWQgPSBtYXAgIT0gbnVsbDtcblxuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRpZiAoICggZWxlbSA9IHVubWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRpZiAoICFmaWx0ZXIgfHwgZmlsdGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0bmV3VW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0aWYgKCBtYXBwZWQgKSB7XG5cdFx0XHRcdFx0bWFwLnB1c2goIGkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBuZXdVbm1hdGNoZWQ7XG59XG5cbmZ1bmN0aW9uIHNldE1hdGNoZXIoIHByZUZpbHRlciwgc2VsZWN0b3IsIG1hdGNoZXIsIHBvc3RGaWx0ZXIsIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApIHtcblx0aWYgKCBwb3N0RmlsdGVyICYmICFwb3N0RmlsdGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbHRlciA9IHNldE1hdGNoZXIoIHBvc3RGaWx0ZXIgKTtcblx0fVxuXHRpZiAoIHBvc3RGaW5kZXIgJiYgIXBvc3RGaW5kZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmluZGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICk7XG5cdH1cblx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIHJlc3VsdHMsIGNvbnRleHQsIHhtbCApIHtcblx0XHR2YXIgdGVtcCwgaSwgZWxlbSxcblx0XHRcdHByZU1hcCA9IFtdLFxuXHRcdFx0cG9zdE1hcCA9IFtdLFxuXHRcdFx0cHJlZXhpc3RpbmcgPSByZXN1bHRzLmxlbmd0aCxcblxuXHRcdFx0Ly8gR2V0IGluaXRpYWwgZWxlbWVudHMgZnJvbSBzZWVkIG9yIGNvbnRleHRcblx0XHRcdGVsZW1zID0gc2VlZCB8fCBtdWx0aXBsZUNvbnRleHRzKFxuXHRcdFx0XHRzZWxlY3RvciB8fCBcIipcIixcblx0XHRcdFx0Y29udGV4dC5ub2RlVHlwZSA/IFsgY29udGV4dCBdIDogY29udGV4dCxcblx0XHRcdFx0W11cblx0XHRcdCksXG5cblx0XHRcdC8vIFByZWZpbHRlciB0byBnZXQgbWF0Y2hlciBpbnB1dCwgcHJlc2VydmluZyBhIG1hcCBmb3Igc2VlZC1yZXN1bHRzIHN5bmNocm9uaXphdGlvblxuXHRcdFx0bWF0Y2hlckluID0gcHJlRmlsdGVyICYmICggc2VlZCB8fCAhc2VsZWN0b3IgKSA/XG5cdFx0XHRcdGNvbmRlbnNlKCBlbGVtcywgcHJlTWFwLCBwcmVGaWx0ZXIsIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0ZWxlbXMsXG5cblx0XHRcdG1hdGNoZXJPdXQgPSBtYXRjaGVyID9cblxuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGEgcG9zdEZpbmRlciwgb3IgZmlsdGVyZWQgc2VlZCwgb3Igbm9uLXNlZWQgcG9zdEZpbHRlciBvciBwcmVleGlzdGluZyByZXN1bHRzLFxuXHRcdFx0XHRwb3N0RmluZGVyIHx8ICggc2VlZCA/IHByZUZpbHRlciA6IHByZWV4aXN0aW5nIHx8IHBvc3RGaWx0ZXIgKSA/XG5cblx0XHRcdFx0XHQvLyAuLi5pbnRlcm1lZGlhdGUgcHJvY2Vzc2luZyBpcyBuZWNlc3Nhcnlcblx0XHRcdFx0XHRbXSA6XG5cblx0XHRcdFx0XHQvLyAuLi5vdGhlcndpc2UgdXNlIHJlc3VsdHMgZGlyZWN0bHlcblx0XHRcdFx0XHRyZXN1bHRzIDpcblx0XHRcdFx0bWF0Y2hlckluO1xuXG5cdFx0Ly8gRmluZCBwcmltYXJ5IG1hdGNoZXNcblx0XHRpZiAoIG1hdGNoZXIgKSB7XG5cdFx0XHRtYXRjaGVyKCBtYXRjaGVySW4sIG1hdGNoZXJPdXQsIGNvbnRleHQsIHhtbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHBvc3RGaWx0ZXJcblx0XHRpZiAoIHBvc3RGaWx0ZXIgKSB7XG5cdFx0XHR0ZW1wID0gY29uZGVuc2UoIG1hdGNoZXJPdXQsIHBvc3RNYXAgKTtcblx0XHRcdHBvc3RGaWx0ZXIoIHRlbXAsIFtdLCBjb250ZXh0LCB4bWwgKTtcblxuXHRcdFx0Ly8gVW4tbWF0Y2ggZmFpbGluZyBlbGVtZW50cyBieSBtb3ZpbmcgdGhlbSBiYWNrIHRvIG1hdGNoZXJJblxuXHRcdFx0aSA9IHRlbXAubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggKCBlbGVtID0gdGVtcFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlck91dFsgcG9zdE1hcFsgaSBdIF0gPSAhKCBtYXRjaGVySW5bIHBvc3RNYXBbIGkgXSBdID0gZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0aWYgKCBwb3N0RmluZGVyIHx8IHByZUZpbHRlciApIHtcblx0XHRcdFx0aWYgKCBwb3N0RmluZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gR2V0IHRoZSBmaW5hbCBtYXRjaGVyT3V0IGJ5IGNvbmRlbnNpbmcgdGhpcyBpbnRlcm1lZGlhdGUgaW50byBwb3N0RmluZGVyIGNvbnRleHRzXG5cdFx0XHRcdFx0dGVtcCA9IFtdO1xuXHRcdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gbWF0Y2hlck91dFsgaSBdICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmVzdG9yZSBtYXRjaGVySW4gc2luY2UgZWxlbSBpcyBub3QgeWV0IGEgZmluYWwgbWF0Y2hcblx0XHRcdFx0XHRcdFx0dGVtcC5wdXNoKCAoIG1hdGNoZXJJblsgaSBdID0gZWxlbSApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsICggbWF0Y2hlck91dCA9IFtdICksIHRlbXAsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTW92ZSBtYXRjaGVkIGVsZW1lbnRzIGZyb20gc2VlZCB0byByZXN1bHRzIHRvIGtlZXAgdGhlbSBzeW5jaHJvbml6ZWRcblx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRpZiAoICggZWxlbSA9IG1hdGNoZXJPdXRbIGkgXSApICYmXG5cdFx0XHRcdFx0XHQoIHRlbXAgPSBwb3N0RmluZGVyID8gaW5kZXhPZiggc2VlZCwgZWxlbSApIDogcHJlTWFwWyBpIF0gKSA+IC0xICkge1xuXG5cdFx0XHRcdFx0XHRzZWVkWyB0ZW1wIF0gPSAhKCByZXN1bHRzWyB0ZW1wIF0gPSBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBBZGQgZWxlbWVudHMgdG8gcmVzdWx0cywgdGhyb3VnaCBwb3N0RmluZGVyIGlmIGRlZmluZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlck91dCA9IGNvbmRlbnNlKFxuXHRcdFx0XHRtYXRjaGVyT3V0ID09PSByZXN1bHRzID9cblx0XHRcdFx0XHRtYXRjaGVyT3V0LnNwbGljZSggcHJlZXhpc3RpbmcsIG1hdGNoZXJPdXQubGVuZ3RoICkgOlxuXHRcdFx0XHRcdG1hdGNoZXJPdXRcblx0XHRcdCk7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsIHJlc3VsdHMsIG1hdGNoZXJPdXQsIHhtbCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgbWF0Y2hlck91dCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zICkge1xuXHR2YXIgY2hlY2tDb250ZXh0LCBtYXRjaGVyLCBqLFxuXHRcdGxlbiA9IHRva2Vucy5sZW5ndGgsXG5cdFx0bGVhZGluZ1JlbGF0aXZlID0gRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyAwIF0udHlwZSBdLFxuXHRcdGltcGxpY2l0UmVsYXRpdmUgPSBsZWFkaW5nUmVsYXRpdmUgfHwgRXhwci5yZWxhdGl2ZVsgXCIgXCIgXSxcblx0XHRpID0gbGVhZGluZ1JlbGF0aXZlID8gMSA6IDAsXG5cblx0XHQvLyBUaGUgZm91bmRhdGlvbmFsIG1hdGNoZXIgZW5zdXJlcyB0aGF0IGVsZW1lbnRzIGFyZSByZWFjaGFibGUgZnJvbSB0b3AtbGV2ZWwgY29udGV4dChzKVxuXHRcdG1hdGNoQ29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGNoZWNrQ29udGV4dDtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hBbnlDb250ZXh0ID0gYWRkQ29tYmluYXRvciggZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gaW5kZXhPZiggY2hlY2tDb250ZXh0LCBlbGVtICkgPiAtMTtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hlcnMgPSBbIGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgcmV0ID0gKCAhbGVhZGluZ1JlbGF0aXZlICYmICggeG1sIHx8IGNvbnRleHQgIT09IG91dGVybW9zdENvbnRleHQgKSApIHx8IChcblx0XHRcdFx0KCBjaGVja0NvbnRleHQgPSBjb250ZXh0ICkubm9kZVR5cGUgP1xuXHRcdFx0XHRcdG1hdGNoQ29udGV4dCggZWxlbSwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRcdG1hdGNoQW55Q29udGV4dCggZWxlbSwgY29udGV4dCwgeG1sICkgKTtcblxuXHRcdFx0Ly8gQXZvaWQgaGFuZ2luZyBvbnRvIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRjaGVja0NvbnRleHQgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9IF07XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoIG1hdGNoZXIgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIGkgXS50eXBlIF0gKSApIHtcblx0XHRcdG1hdGNoZXJzID0gWyBhZGRDb21iaW5hdG9yKCBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSwgbWF0Y2hlciApIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXIgPSBFeHByLmZpbHRlclsgdG9rZW5zWyBpIF0udHlwZSBdLmFwcGx5KCBudWxsLCB0b2tlbnNbIGkgXS5tYXRjaGVzICk7XG5cblx0XHRcdC8vIFJldHVybiBzcGVjaWFsIHVwb24gc2VlaW5nIGEgcG9zaXRpb25hbCBtYXRjaGVyXG5cdFx0XHRpZiAoIG1hdGNoZXJbIGV4cGFuZG8gXSApIHtcblxuXHRcdFx0XHQvLyBGaW5kIHRoZSBuZXh0IHJlbGF0aXZlIG9wZXJhdG9yIChpZiBhbnkpIGZvciBwcm9wZXIgaGFuZGxpbmdcblx0XHRcdFx0aiA9ICsraTtcblx0XHRcdFx0Zm9yICggOyBqIDwgbGVuOyBqKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIGogXS50eXBlIF0gKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNldE1hdGNoZXIoXG5cdFx0XHRcdFx0aSA+IDEgJiYgZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksXG5cdFx0XHRcdFx0aSA+IDEgJiYgdG9TZWxlY3RvcihcblxuXHRcdFx0XHRcdC8vIElmIHRoZSBwcmVjZWRpbmcgdG9rZW4gd2FzIGEgZGVzY2VuZGFudCBjb21iaW5hdG9yLCBpbnNlcnQgYW4gaW1wbGljaXQgYW55LWVsZW1lbnQgYCpgXG5cdFx0XHRcdFx0dG9rZW5zXG5cdFx0XHRcdFx0XHQuc2xpY2UoIDAsIGkgLSAxIClcblx0XHRcdFx0XHRcdC5jb25jYXQoIHsgdmFsdWU6IHRva2Vuc1sgaSAtIDIgXS50eXBlID09PSBcIiBcIiA/IFwiKlwiIDogXCJcIiB9IClcblx0XHRcdFx0XHQpLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSxcblx0XHRcdFx0XHRtYXRjaGVyLFxuXHRcdFx0XHRcdGkgPCBqICYmIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMuc2xpY2UoIGksIGogKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgbWF0Y2hlckZyb21Ub2tlbnMoICggdG9rZW5zID0gdG9rZW5zLnNsaWNlKCBqICkgKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgdG9TZWxlY3RvciggdG9rZW5zIClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdG1hdGNoZXJzLnB1c2goIG1hdGNoZXIgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyggZWxlbWVudE1hdGNoZXJzLCBzZXRNYXRjaGVycyApIHtcblx0dmFyIGJ5U2V0ID0gc2V0TWF0Y2hlcnMubGVuZ3RoID4gMCxcblx0XHRieUVsZW1lbnQgPSBlbGVtZW50TWF0Y2hlcnMubGVuZ3RoID4gMCxcblx0XHRzdXBlck1hdGNoZXIgPSBmdW5jdGlvbiggc2VlZCwgY29udGV4dCwgeG1sLCByZXN1bHRzLCBvdXRlcm1vc3QgKSB7XG5cdFx0XHR2YXIgZWxlbSwgaiwgbWF0Y2hlcixcblx0XHRcdFx0bWF0Y2hlZENvdW50ID0gMCxcblx0XHRcdFx0aSA9IFwiMFwiLFxuXHRcdFx0XHR1bm1hdGNoZWQgPSBzZWVkICYmIFtdLFxuXHRcdFx0XHRzZXRNYXRjaGVkID0gW10sXG5cdFx0XHRcdGNvbnRleHRCYWNrdXAgPSBvdXRlcm1vc3RDb250ZXh0LFxuXG5cdFx0XHRcdC8vIFdlIG11c3QgYWx3YXlzIGhhdmUgZWl0aGVyIHNlZWQgZWxlbWVudHMgb3Igb3V0ZXJtb3N0IGNvbnRleHRcblx0XHRcdFx0ZWxlbXMgPSBzZWVkIHx8IGJ5RWxlbWVudCAmJiBFeHByLmZpbmRbIFwiVEFHXCIgXSggXCIqXCIsIG91dGVybW9zdCApLFxuXG5cdFx0XHRcdC8vIFVzZSBpbnRlZ2VyIGRpcnJ1bnMgaWZmIHRoaXMgaXMgdGhlIG91dGVybW9zdCBtYXRjaGVyXG5cdFx0XHRcdGRpcnJ1bnNVbmlxdWUgPSAoIGRpcnJ1bnMgKz0gY29udGV4dEJhY2t1cCA9PSBudWxsID8gMSA6IE1hdGgucmFuZG9tKCkgfHwgMC4xICksXG5cdFx0XHRcdGxlbiA9IGVsZW1zLmxlbmd0aDtcblxuXHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHQgPT0gZG9jdW1lbnQgfHwgY29udGV4dCB8fCBvdXRlcm1vc3Q7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCBlbGVtZW50cyBwYXNzaW5nIGVsZW1lbnRNYXRjaGVycyBkaXJlY3RseSB0byByZXN1bHRzXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTw5LCBTYWZhcmlcblx0XHRcdC8vIFRvbGVyYXRlIE5vZGVMaXN0IHByb3BlcnRpZXMgKElFOiBcImxlbmd0aFwiOyBTYWZhcmk6IDxudW1iZXI+KSBtYXRjaGluZyBlbGVtZW50cyBieSBpZFxuXHRcdFx0Zm9yICggOyBpICE9PSBsZW4gJiYgKCBlbGVtID0gZWxlbXNbIGkgXSApICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBieUVsZW1lbnQgJiYgZWxlbSApIHtcblx0XHRcdFx0XHRqID0gMDtcblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdFx0aWYgKCAhY29udGV4dCAmJiBlbGVtLm93bmVyRG9jdW1lbnQgIT0gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHRcdFx0XHRcdFx0eG1sID0gIWRvY3VtZW50SXNIVE1MO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aGlsZSAoICggbWF0Y2hlciA9IGVsZW1lbnRNYXRjaGVyc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlciggZWxlbSwgY29udGV4dCB8fCBkb2N1bWVudCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cdFx0XHRcdFx0XHRkaXJydW5zID0gZGlycnVuc1VuaXF1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUcmFjayB1bm1hdGNoZWQgZWxlbWVudHMgZm9yIHNldCBmaWx0ZXJzXG5cdFx0XHRcdGlmICggYnlTZXQgKSB7XG5cblx0XHRcdFx0XHQvLyBUaGV5IHdpbGwgaGF2ZSBnb25lIHRocm91Z2ggYWxsIHBvc3NpYmxlIG1hdGNoZXJzXG5cdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSAhbWF0Y2hlciAmJiBlbGVtICkgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVkQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMZW5ndGhlbiB0aGUgYXJyYXkgZm9yIGV2ZXJ5IGVsZW1lbnQsIG1hdGNoZWQgb3Igbm90XG5cdFx0XHRcdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0XHRcdFx0dW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYGlgIGlzIG5vdyB0aGUgY291bnQgb2YgZWxlbWVudHMgdmlzaXRlZCBhYm92ZSwgYW5kIGFkZGluZyBpdCB0byBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gbWFrZXMgdGhlIGxhdHRlciBub25uZWdhdGl2ZS5cblx0XHRcdG1hdGNoZWRDb3VudCArPSBpO1xuXG5cdFx0XHQvLyBBcHBseSBzZXQgZmlsdGVycyB0byB1bm1hdGNoZWQgZWxlbWVudHNcblx0XHRcdC8vIE5PVEU6IFRoaXMgY2FuIGJlIHNraXBwZWQgaWYgdGhlcmUgYXJlIG5vIHVubWF0Y2hlZCBlbGVtZW50cyAoaS5lLiwgYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIGVxdWFscyBgaWApLCB1bmxlc3Mgd2UgZGlkbid0IHZpc2l0IF9hbnlfIGVsZW1lbnRzIGluIHRoZSBhYm92ZSBsb29wIGJlY2F1c2Ugd2UgaGF2ZVxuXHRcdFx0Ly8gbm8gZWxlbWVudCBtYXRjaGVycyBhbmQgbm8gc2VlZC5cblx0XHRcdC8vIEluY3JlbWVudGluZyBhbiBpbml0aWFsbHktc3RyaW5nIFwiMFwiIGBpYCBhbGxvd3MgYGlgIHRvIHJlbWFpbiBhIHN0cmluZyBvbmx5IGluIHRoYXRcblx0XHRcdC8vIGNhc2UsIHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgXCIwMFwiIGBtYXRjaGVkQ291bnRgIHRoYXQgZGlmZmVycyBmcm9tIGBpYCBidXQgaXMgYWxzb1xuXHRcdFx0Ly8gbnVtZXJpY2FsbHkgemVyby5cblx0XHRcdGlmICggYnlTZXQgJiYgaSAhPT0gbWF0Y2hlZENvdW50ICkge1xuXHRcdFx0XHRqID0gMDtcblx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoZXIgPSBzZXRNYXRjaGVyc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyKCB1bm1hdGNoZWQsIHNldE1hdGNoZWQsIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzZWVkICkge1xuXG5cdFx0XHRcdFx0Ly8gUmVpbnRlZ3JhdGUgZWxlbWVudCBtYXRjaGVzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3Igc29ydGluZ1xuXHRcdFx0XHRcdGlmICggbWF0Y2hlZENvdW50ID4gMCApIHtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICEoIHVubWF0Y2hlZFsgaSBdIHx8IHNldE1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldE1hdGNoZWRbIGkgXSA9IHBvcC5jYWxsKCByZXN1bHRzICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBEaXNjYXJkIGluZGV4IHBsYWNlaG9sZGVyIHZhbHVlcyB0byBnZXQgb25seSBhY3R1YWwgbWF0Y2hlc1xuXHRcdFx0XHRcdHNldE1hdGNoZWQgPSBjb25kZW5zZSggc2V0TWF0Y2hlZCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWRkIG1hdGNoZXMgdG8gcmVzdWx0c1xuXHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBzZXRNYXRjaGVkICk7XG5cblx0XHRcdFx0Ly8gU2VlZGxlc3Mgc2V0IG1hdGNoZXMgc3VjY2VlZGluZyBtdWx0aXBsZSBzdWNjZXNzZnVsIG1hdGNoZXJzIHN0aXB1bGF0ZSBzb3J0aW5nXG5cdFx0XHRcdGlmICggb3V0ZXJtb3N0ICYmICFzZWVkICYmIHNldE1hdGNoZWQubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdCggbWF0Y2hlZENvdW50ICsgc2V0TWF0Y2hlcnMubGVuZ3RoICkgPiAxICkge1xuXG5cdFx0XHRcdFx0U2l6emxlLnVuaXF1ZVNvcnQoIHJlc3VsdHMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBPdmVycmlkZSBtYW5pcHVsYXRpb24gb2YgZ2xvYmFscyBieSBuZXN0ZWQgbWF0Y2hlcnNcblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRkaXJydW5zID0gZGlycnVuc1VuaXF1ZTtcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHRCYWNrdXA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1bm1hdGNoZWQ7XG5cdFx0fTtcblxuXHRyZXR1cm4gYnlTZXQgP1xuXHRcdG1hcmtGdW5jdGlvbiggc3VwZXJNYXRjaGVyICkgOlxuXHRcdHN1cGVyTWF0Y2hlcjtcbn1cblxuY29tcGlsZSA9IFNpenpsZS5jb21waWxlID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBtYXRjaCAvKiBJbnRlcm5hbCBVc2UgT25seSAqLyApIHtcblx0dmFyIGksXG5cdFx0c2V0TWF0Y2hlcnMgPSBbXSxcblx0XHRlbGVtZW50TWF0Y2hlcnMgPSBbXSxcblx0XHRjYWNoZWQgPSBjb21waWxlckNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF07XG5cblx0aWYgKCAhY2FjaGVkICkge1xuXG5cdFx0Ly8gR2VuZXJhdGUgYSBmdW5jdGlvbiBvZiByZWN1cnNpdmUgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY2hlY2sgZWFjaCBlbGVtZW50XG5cdFx0aWYgKCAhbWF0Y2ggKSB7XG5cdFx0XHRtYXRjaCA9IHRva2VuaXplKCBzZWxlY3RvciApO1xuXHRcdH1cblx0XHRpID0gbWF0Y2gubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0Y2FjaGVkID0gbWF0Y2hlckZyb21Ub2tlbnMoIG1hdGNoWyBpIF0gKTtcblx0XHRcdGlmICggY2FjaGVkWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHNldE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIHRoZSBjb21waWxlZCBmdW5jdGlvblxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGUoXG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdG1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyggZWxlbWVudE1hdGNoZXJzLCBzZXRNYXRjaGVycyApXG5cdFx0KTtcblxuXHRcdC8vIFNhdmUgc2VsZWN0b3IgYW5kIHRva2VuaXphdGlvblxuXHRcdGNhY2hlZC5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHR9XG5cdHJldHVybiBjYWNoZWQ7XG59O1xuXG4vKipcbiAqIEEgbG93LWxldmVsIHNlbGVjdGlvbiBmdW5jdGlvbiB0aGF0IHdvcmtzIHdpdGggU2l6emxlJ3MgY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBzZWxlY3RvciBBIHNlbGVjdG9yIG9yIGEgcHJlLWNvbXBpbGVkXG4gKiAgc2VsZWN0b3IgZnVuY3Rpb24gYnVpbHQgd2l0aCBTaXp6bGUuY29tcGlsZVxuICogQHBhcmFtIHtFbGVtZW50fSBjb250ZXh0XG4gKiBAcGFyYW0ge0FycmF5fSBbcmVzdWx0c11cbiAqIEBwYXJhbSB7QXJyYXl9IFtzZWVkXSBBIHNldCBvZiBlbGVtZW50cyB0byBtYXRjaCBhZ2FpbnN0XG4gKi9cbnNlbGVjdCA9IFNpenpsZS5zZWxlY3QgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBpLCB0b2tlbnMsIHRva2VuLCB0eXBlLCBmaW5kLFxuXHRcdGNvbXBpbGVkID0gdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgJiYgc2VsZWN0b3IsXG5cdFx0bWF0Y2ggPSAhc2VlZCAmJiB0b2tlbml6ZSggKCBzZWxlY3RvciA9IGNvbXBpbGVkLnNlbGVjdG9yIHx8IHNlbGVjdG9yICkgKTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBUcnkgdG8gbWluaW1pemUgb3BlcmF0aW9ucyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBzZWxlY3RvciBpbiB0aGUgbGlzdCBhbmQgbm8gc2VlZFxuXHQvLyAodGhlIGxhdHRlciBvZiB3aGljaCBndWFyYW50ZWVzIHVzIGNvbnRleHQpXG5cdGlmICggbWF0Y2gubGVuZ3RoID09PSAxICkge1xuXG5cdFx0Ly8gUmVkdWNlIGNvbnRleHQgaWYgdGhlIGxlYWRpbmcgY29tcG91bmQgc2VsZWN0b3IgaXMgYW4gSURcblx0XHR0b2tlbnMgPSBtYXRjaFsgMCBdID0gbWF0Y2hbIDAgXS5zbGljZSggMCApO1xuXHRcdGlmICggdG9rZW5zLmxlbmd0aCA+IDIgJiYgKCB0b2tlbiA9IHRva2Vuc1sgMCBdICkudHlwZSA9PT0gXCJJRFwiICYmXG5cdFx0XHRjb250ZXh0Lm5vZGVUeXBlID09PSA5ICYmIGRvY3VtZW50SXNIVE1MICYmIEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgMSBdLnR5cGUgXSApIHtcblxuXHRcdFx0Y29udGV4dCA9ICggRXhwci5maW5kWyBcIklEXCIgXSggdG9rZW4ubWF0Y2hlc1sgMCBdXG5cdFx0XHRcdC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLCBjb250ZXh0ICkgfHwgW10gKVsgMCBdO1xuXHRcdFx0aWYgKCAhY29udGV4dCApIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cblx0XHRcdC8vIFByZWNvbXBpbGVkIG1hdGNoZXJzIHdpbGwgc3RpbGwgdmVyaWZ5IGFuY2VzdHJ5LCBzbyBzdGVwIHVwIGEgbGV2ZWxcblx0XHRcdH0gZWxzZSBpZiAoIGNvbXBpbGVkICkge1xuXHRcdFx0XHRjb250ZXh0ID0gY29udGV4dC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnNsaWNlKCB0b2tlbnMuc2hpZnQoKS52YWx1ZS5sZW5ndGggKTtcblx0XHR9XG5cblx0XHQvLyBGZXRjaCBhIHNlZWQgc2V0IGZvciByaWdodC10by1sZWZ0IG1hdGNoaW5nXG5cdFx0aSA9IG1hdGNoRXhwclsgXCJuZWVkc0NvbnRleHRcIiBdLnRlc3QoIHNlbGVjdG9yICkgPyAwIDogdG9rZW5zLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHRva2VuID0gdG9rZW5zWyBpIF07XG5cblx0XHRcdC8vIEFib3J0IGlmIHdlIGhpdCBhIGNvbWJpbmF0b3Jcblx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgKCB0eXBlID0gdG9rZW4udHlwZSApIF0gKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCAoIGZpbmQgPSBFeHByLmZpbmRbIHR5cGUgXSApICkge1xuXG5cdFx0XHRcdC8vIFNlYXJjaCwgZXhwYW5kaW5nIGNvbnRleHQgZm9yIGxlYWRpbmcgc2libGluZyBjb21iaW5hdG9yc1xuXHRcdFx0XHRpZiAoICggc2VlZCA9IGZpbmQoXG5cdFx0XHRcdFx0dG9rZW4ubWF0Y2hlc1sgMCBdLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICksXG5cdFx0XHRcdFx0cnNpYmxpbmcudGVzdCggdG9rZW5zWyAwIF0udHlwZSApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fFxuXHRcdFx0XHRcdFx0Y29udGV4dFxuXHRcdFx0XHQpICkgKSB7XG5cblx0XHRcdFx0XHQvLyBJZiBzZWVkIGlzIGVtcHR5IG9yIG5vIHRva2VucyByZW1haW4sIHdlIGNhbiByZXR1cm4gZWFybHlcblx0XHRcdFx0XHR0b2tlbnMuc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWVkLmxlbmd0aCAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKTtcblx0XHRcdFx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ29tcGlsZSBhbmQgZXhlY3V0ZSBhIGZpbHRlcmluZyBmdW5jdGlvbiBpZiBvbmUgaXMgbm90IHByb3ZpZGVkXG5cdC8vIFByb3ZpZGUgYG1hdGNoYCB0byBhdm9pZCByZXRva2VuaXphdGlvbiBpZiB3ZSBtb2RpZmllZCB0aGUgc2VsZWN0b3IgYWJvdmVcblx0KCBjb21waWxlZCB8fCBjb21waWxlKCBzZWxlY3RvciwgbWF0Y2ggKSApKFxuXHRcdHNlZWQsXG5cdFx0Y29udGV4dCxcblx0XHQhZG9jdW1lbnRJc0hUTUwsXG5cdFx0cmVzdWx0cyxcblx0XHQhY29udGV4dCB8fCByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fCBjb250ZXh0XG5cdCk7XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gT25lLXRpbWUgYXNzaWdubWVudHNcblxuLy8gU29ydCBzdGFiaWxpdHlcbnN1cHBvcnQuc29ydFN0YWJsZSA9IGV4cGFuZG8uc3BsaXQoIFwiXCIgKS5zb3J0KCBzb3J0T3JkZXIgKS5qb2luKCBcIlwiICkgPT09IGV4cGFuZG87XG5cbi8vIFN1cHBvcnQ6IENocm9tZSAxNC0zNStcbi8vIEFsd2F5cyBhc3N1bWUgZHVwbGljYXRlcyBpZiB0aGV5IGFyZW4ndCBwYXNzZWQgdG8gdGhlIGNvbXBhcmlzb24gZnVuY3Rpb25cbnN1cHBvcnQuZGV0ZWN0RHVwbGljYXRlcyA9ICEhaGFzRHVwbGljYXRlO1xuXG4vLyBJbml0aWFsaXplIGFnYWluc3QgdGhlIGRlZmF1bHQgZG9jdW1lbnRcbnNldERvY3VtZW50KCk7XG5cbi8vIFN1cHBvcnQ6IFdlYmtpdDw1MzcuMzIgLSBTYWZhcmkgNi4wLjMvQ2hyb21lIDI1IChmaXhlZCBpbiBDaHJvbWUgMjcpXG4vLyBEZXRhY2hlZCBub2RlcyBjb25mb3VuZGluZ2x5IGZvbGxvdyAqZWFjaCBvdGhlcipcbnN1cHBvcnQuc29ydERldGFjaGVkID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0Ly8gU2hvdWxkIHJldHVybiAxLCBidXQgcmV0dXJucyA0IChmb2xsb3dpbmcpXG5cdHJldHVybiBlbC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJmaWVsZHNldFwiICkgKSAmIDE7XG59ICk7XG5cbi8vIFN1cHBvcnQ6IElFPDhcbi8vIFByZXZlbnQgYXR0cmlidXRlL3Byb3BlcnR5IFwiaW50ZXJwb2xhdGlvblwiXG4vLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM2NDI5JTI4VlMuODUlMjkuYXNweFxuaWYgKCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdGVsLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nIyc+PC9hPlwiO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwiaHJlZlwiICkgPT09IFwiI1wiO1xufSApICkge1xuXHRhZGRIYW5kbGUoIFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0eXBlXCIgPyAxIDogMiApO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBTdXBwb3J0OiBJRTw5XG4vLyBVc2UgZGVmYXVsdFZhbHVlIGluIHBsYWNlIG9mIGdldEF0dHJpYnV0ZShcInZhbHVlXCIpXG5pZiAoICFzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRlbC5pbm5lckhUTUwgPSBcIjxpbnB1dC8+XCI7XG5cdGVsLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIFwiXCIgKTtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCBcInZhbHVlXCIgKSA9PT0gXCJcIjtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBcInZhbHVlXCIsIGZ1bmN0aW9uKCBlbGVtLCBfbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kZWZhdWx0VmFsdWU7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBnZXRBdHRyaWJ1dGVOb2RlIHRvIGZldGNoIGJvb2xlYW5zIHdoZW4gZ2V0QXR0cmlidXRlIGxpZXNcbmlmICggIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRyZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCBcImRpc2FibGVkXCIgKSA9PSBudWxsO1xufSApICkge1xuXHRhZGRIYW5kbGUoIGJvb2xlYW5zLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0dmFyIHZhbDtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF0gPT09IHRydWUgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHQoIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApICkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0XHRudWxsO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBFWFBPU0VcbnZhciBfc2l6emxlID0gd2luZG93LlNpenpsZTtcblxuU2l6emxlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB3aW5kb3cuU2l6emxlID09PSBTaXp6bGUgKSB7XG5cdFx0d2luZG93LlNpenpsZSA9IF9zaXp6bGU7XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlO1xufTtcblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcblx0ZGVmaW5lKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2l6emxlO1xuXHR9ICk7XG5cbi8vIFNpenpsZSByZXF1aXJlcyB0aGF0IHRoZXJlIGJlIGEgZ2xvYmFsIHdpbmRvdyBpbiBDb21tb24tSlMgbGlrZSBlbnZpcm9ubWVudHNcbn0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gU2l6emxlO1xufSBlbHNlIHtcblx0d2luZG93LlNpenpsZSA9IFNpenpsZTtcbn1cblxuLy8gRVhQT1NFXG5cbn0gKSggd2luZG93ICk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsImV4cG9ydCB7IGRlZmF1bHQgYXMgc2VsZWN0LCBnZXRTaW5nbGVTZWxlY3RvciwgZ2V0TXVsdGlTZWxlY3RvciB9IGZyb20gJy4vc2VsZWN0J1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtYXRjaCB9IGZyb20gJy4vbWF0Y2gnXG5leHBvcnQgeyBkZWZhdWx0IGFzIG9wdGltaXplIH0gZnJvbSAnLi9vcHRpbWl6ZSdcbmV4cG9ydCB7IGdldFRvU3RyaW5nLCBnZXRQYXRoVG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5cbmV4cG9ydCAqIGFzIGNvbW1vbiBmcm9tICcuL2NvbW1vbidcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=