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

/**
 * Determine if string is valid CSS identifier
 * 
 * In CSS, identifiers (including element names, classes, and IDs in selectors) can contain
 * only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A0 and higher, plus the hyphen (-)
 * and the underscore (_); they cannot start with a digit, two hyphens, or a hyphen followed by
 * a digit.
 * 
 * Identifiers can also contain escaped characters and any ISO 10646 character as a numeric
 * code (see next item). For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F".
 * @param {String} value 
 * @return {Boolean}
 */
var isValidCSSIdentifier = exports.isValidCSSIdentifier = function isValidCSSIdentifier(value) {
  return !!value && !/(^\d)|(^--)|(^-\d)/.test(value) && !/([^\\]|^)['"`/:?&!#$%^()[\]{|}*+;,.<=>@~]/.test(value);
};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToString = exports.descendantsToXPath = exports.pathToXPath = exports.patternToXPath = exports.pseudoToXPath = exports.classesToXPath = exports.attributesToXPath = exports.pathToSelector = exports.patternToSelector = exports.pseudoToSelector = exports.classesToSelector = exports.attributesToSelector = exports.createPattern = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utilities = __webpack_require__(0);

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

    if (value === null) {
      return '[' + name + ']';
    }
    if (name === 'id' && (0, _utilities.isValidCSSIdentifier)(value)) {
      return '#' + value;
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
  return classes.map(function (c) {
    return (0, _utilities.isValidCSSIdentifier)(c) ? '.' + c : '[class~="' + c + '"]';
  }).join('');
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
 * 
 * @param {Options} options 
 * @returns {ToStringApi}
 */
var getToString = exports.getToString = function getToString() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return toString[options.format || 'css'];
};

/***/ },
/* 2 */
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
* @returns {(selector: string, parent: HTMLElement) => Array.<HTMLElement>}
*/
var getSelect = exports.getSelect = function getSelect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (selector, parent) {
    try {
      return select[options.format || 'css'](selector, parent || options.root);
    } catch (err) {
      return [];
    }
  };
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
exports.combinations = exports.initOptions = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * # Match
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * Retrieve selector for a node.
                                                                                                                                                                                                                                                                   */

exports.default = match;

var _pattern = __webpack_require__(1);

var _selector = __webpack_require__(2);

var _utilities = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @typedef {import('./select').Options} Options
 * @typedef {import('./pattern').Pattern} Pattern
 * @typedef {import('./pattern').ToStringApi} Pattern
 */

var defaultIgnore = {
  attribute: function attribute(attributeName) {
    return ['style', 'data-reactid', 'data-react-checksum'].indexOf(attributeName) > -1;
  },

  contains: function contains() {
    return true;
  }
};

var initOptions = exports.initOptions = function initOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _extends({}, options, {
    root: options.root || document,
    skip: options.skip || null,
    priority: options.priority || ['id', 'class', 'href', 'src'],
    ignore: options.ignore || {}
  });
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
  var nested = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  options = initOptions(options);
  var _options = options,
      root = _options.root,
      skip = _options.skip,
      ignore = _options.ignore,
      format = _options.format;


  var path = [];
  var element = node;
  var length = path.length;
  var select = (0, _selector.getSelect)(options);
  var toString = (0, _pattern.getToString)(options);

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

      if (path.length === length && [1, 'xpath'].includes(format) && !nested && element === node) {
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
 * Calculates array of combinations of items in input array.
 * @param  {Array.<any>} values   - array of values
 * @param  {Object} options       - options: min - minimum subset size; max - maximum subset size
 * @return {Array.<Array.<any>>?}   array of subsets
 */
var combinations = exports.combinations = function combinations(values, options) {
  var _ref2 = options || {},
      min = _ref2.min,
      max = _ref2.max;

  var result = [[]];

  values.forEach(function (v) {
    result.forEach(function (r) {
      if (!max || r.length < max) {
        result.push(r.concat(v));
      }
    });
  });

  result.shift();
  return min ? result.filter(function (r) {
    return r.length >= min;
  }) : result;
};

// limit subset size to increase performance
var maxSubsetSize = [{ items: 13, max: 1 }, { items: 10, max: 2 }, { items: 8, max: 3 }, { items: 5, max: 4 }];

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

  var _ref3 = maxSubsetSize.find(function (_ref4) {
    var items = _ref4.items;
    return classes.length > items;
  }) || { max: classes.length },
      max = _ref3.max;

  var result = combinations(classes, { max: max });

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
            if (!classNames[0]) {
              // empty string
              return 'break';
            }
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

          switch (_ret) {
            case 'break':
              break;

            default:
              if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
          }
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
var checkTag = function checkTag(element, path, _ref5, select, toString) {
  var ignore = _ref5.ignore;
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
var checkNthChild = function checkNthChild(element, path, _ref6) {
  var ignore = _ref6.ignore;

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
var checkText = function checkText(element, path, _ref7, select, toString, nested) {
  var ignore = _ref7.ignore;

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
    if (checkIgnore(ignore.contains, null, text, defaultIgnore.contains)) {
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
    var descendantPath = match(descendants.shift(), _extends({}, options, { root: element }), true);
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
var findPattern = function findPattern(element, _ref8, select, toString) {
  var priority = _ref8.priority,
      ignore = _ref8.ignore;

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

var _selector = __webpack_require__(2);

var _pattern2 = __webpack_require__(1);

var _utilities = __webpack_require__(0);

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
  var toString = (0, _pattern2.getToString)(options);

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
          var description = (0, _pattern2.createPattern)({ tag: reference.tagName });
          pattern = toString.path([].concat(_toConsumableArray(pre), [description], _toConsumableArray(post)));
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
exports.getMultiSelectorPath = exports.getSingleSelectorPath = undefined;

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

var _utilities = __webpack_require__(0);

var _common = __webpack_require__(3);

var _selector = __webpack_require__(2);

var _pattern = __webpack_require__(1);

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
 * Get a selector for the provided element
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
 * Get a selector to match multiple descendants from an ancestor
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
  var toString = (0, _pattern.getToString)(options);

  var ancestor = (0, _common.getCommonAncestor)(elements, options);
  var ancestorPath = (0, _match2.default)(ancestor, options);

  // TODO: consider usage of multiple selectors + parent-child relation + check for part redundancy
  var commonPath = getCommonPath(elements);
  var descendantPattern = commonPath[0];

  var selectorPath = (0, _optimize2.default)([].concat(_toConsumableArray(ancestorPath), [descendantPattern]), elements, options);
  var selectorMatches = (0, _utilities.convertNodeList)(select(toString.path(selectorPath)));

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

  var path = input.length && !input.name ? getMultiSelectorPath(input, options) : getSingleSelectorPath(input, options);

  return (0, _pattern.getToString)(options).path(path);
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
exports.common = exports.optimize = exports.initOptions = exports.match = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

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
Object.defineProperty(exports, 'initOptions', {
  enumerable: true,
  get: function get() {
    return _match.initOptions;
  }
});

var _optimize = __webpack_require__(5);

Object.defineProperty(exports, 'optimize', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_optimize).default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5OGVlNzdjNGY3YjE5NmYzMzIyNiIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXR0ZXJuLmpzIiwid2VicGFjazovLy8uL3NyYy9zZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvb3B0aW1pemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0Iiwibm9kZXMiLCJsZW5ndGgiLCJhcnIiLCJBcnJheSIsImkiLCJlc2NhcGVWYWx1ZSIsInZhbHVlIiwicmVwbGFjZSIsInBhcnRpdGlvbiIsImFycmF5IiwicHJlZGljYXRlIiwicmVkdWNlIiwiaXRlbSIsImlubmVyIiwib3V0ZXIiLCJjb25jYXQiLCJpc1ZhbGlkQ1NTSWRlbnRpZmllciIsInRlc3QiLCJjcmVhdGVQYXR0ZXJuIiwiYmFzZSIsImF0dHJpYnV0ZXMiLCJjbGFzc2VzIiwicHNldWRvIiwiZGVzY2VuZGFudHMiLCJhdHRyaWJ1dGVzVG9TZWxlY3RvciIsIm1hcCIsIm5hbWUiLCJqb2luIiwiY2xhc3Nlc1RvU2VsZWN0b3IiLCJjIiwicHNldWRvVG9TZWxlY3RvciIsInBhdHRlcm5Ub1NlbGVjdG9yIiwicGF0dGVybiIsInJlbGF0ZXMiLCJ0YWciLCJwYXRoVG9TZWxlY3RvciIsInBhdGgiLCJjb252ZXJ0RXNjYXBpbmciLCJhdHRyaWJ1dGVzVG9YUGF0aCIsImNsYXNzZXNUb1hQYXRoIiwicHNldWRvVG9YUGF0aCIsIm1hdGNoIiwicCIsInBhdHRlcm5Ub1hQYXRoIiwiZGVzY2VuZGFudHNUb1hQYXRoIiwicGF0aFRvWFBhdGgiLCJjaGlsZHJlbiIsInRvU3RyaW5nIiwianF1ZXJ5IiwiY3NzIiwieHBhdGgiLCJnZXRUb1N0cmluZyIsIm9wdGlvbnMiLCJmb3JtYXQiLCJTaXp6bGUiLCJzZWxlY3RKUXVlcnkiLCJzZWxlY3RvciIsInBhcmVudCIsInJlcXVpcmUiLCJkb2N1bWVudCIsInNlbGVjdFhQYXRoIiwiZG9jIiwicGFyZW50Tm9kZSIsInN0YXJ0c1dpdGgiLCJpdGVyYXRvciIsImV2YWx1YXRlIiwiZWxlbWVudHMiLCJlbGVtZW50IiwiaXRlcmF0ZU5leHQiLCJwdXNoIiwic2VsZWN0Q1NTIiwicXVlcnlTZWxlY3RvckFsbCIsInNlbGVjdCIsImdldFNlbGVjdCIsInJvb3QiLCJlcnIiLCJnZXRDb21tb25BbmNlc3RvciIsImFuY2VzdG9ycyIsImZvckVhY2giLCJpbmRleCIsInBhcmVudHMiLCJ1bnNoaWZ0Iiwic29ydCIsImN1cnIiLCJuZXh0Iiwic2hhbGxvd0FuY2VzdG9yIiwic2hpZnQiLCJhbmNlc3RvciIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImNvbW1vblByb3BlcnRpZXMiLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwiZWxlbWVudEF0dHJpYnV0ZXMiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiYXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXNOYW1lcyIsImNvbW1vbkF0dHJpYnV0ZXNOYW1lcyIsIm5leHRDb21tb25BdHRyaWJ1dGVzIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiZGVmYXVsdElnbm9yZSIsImluZGV4T2YiLCJjb250YWlucyIsImluaXRPcHRpb25zIiwic2tpcCIsInByaW9yaXR5IiwiaWdub3JlIiwibm9kZSIsIm5lc3RlZCIsInNraXBDb21wYXJlIiwiaXNBcnJheSIsInNraXBDaGVja3MiLCJjb21wYXJlIiwidHlwZSIsIlJlZ0V4cCIsIm5vZGVUeXBlIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tUYWciLCJpbmNsdWRlcyIsImNoZWNrUmVjdXJzaXZlRGVzY2VuZGFudHMiLCJjaGVja1RleHQiLCJjaGVja050aENoaWxkIiwiZmluZFBhdHRlcm4iLCJmaW5kQXR0cmlidXRlc1BhdHRlcm4iLCJjb21iaW5hdGlvbnMiLCJ2YWx1ZXMiLCJtaW4iLCJtYXgiLCJyZXN1bHQiLCJyIiwidiIsIm1heFN1YnNldFNpemUiLCJpdGVtcyIsImdldENsYXNzU2VsZWN0b3IiLCJmaW5kIiwibWF0Y2hlcyIsImF0dHJpYnV0ZU5hbWVzIiwidmFsIiwiYSIsInNvcnRlZEtleXMiLCJpc09wdGltYWwiLCJhdHRyaWJ1dGVWYWx1ZSIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJjbGFzcyIsImNsYXNzTmFtZSIsImZpbmRUYWdQYXR0ZXJuIiwiY2hpbGQiLCJjaGlsZFBhdHRlcm4iLCJjb25zb2xlIiwid2FybiIsInRleHRDb250ZW50IiwiZmlyc3RDaGlsZCIsIm5vZGVWYWx1ZSIsInRleHRzIiwidGV4dCIsImZyb20iLCJkZXNjZW5kYW50UGF0aCIsInBhcmVudEVsZW1lbnQiLCJkZWZhdWx0UHJlZGljYXRlIiwiY2hlY2siLCJvcHRpbWl6ZSIsIkVycm9yIiwib3B0aW1pemVQYXJ0IiwiZW5kT3B0aW1pemVkIiwic2xpY2UiLCJzaG9ydGVuZWQiLCJwb3AiLCJjdXJyZW50IiwiaGFzU2FtZVJlc3VsdCIsImV2ZXJ5Iiwib3B0aW1pemVUZXh0IiwicHJlIiwicG9zdCIsIm90aGVyIiwib3B0aW1pemVkIiwiY29tcGFyZVJlc3VsdHMiLCJvcHRpbWl6ZUF0dHJpYnV0ZXMiLCJzaW1wbGlmeSIsIm9yaWdpbmFsIiwiZ2V0U2ltcGxpZmllZCIsInNpbXBsaWZpZWQiLCJvcHRpbWl6ZURlc2NlbmRhbnQiLCJkZXNjZW5kYW50Iiwib3B0aW1pemVSZWN1cnNpdmVEZXNjZW5kYW50cyIsIm9wdGltaXplTnRoT2ZUeXBlIiwiZmluZEluZGV4IiwibnRoT2ZUeXBlIiwib3B0aW1pemVDbGFzc2VzIiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImRlc2NyaXB0aW9uIiwib3B0aW1pemVycyIsImFjYyIsIm9wdGltaXplciIsImdldFF1ZXJ5U2VsZWN0b3IiLCJnZXRTaW5nbGVTZWxlY3RvclBhdGgiLCJvcHRpbWl6ZWRQYXRoIiwiZ2V0TXVsdGlTZWxlY3RvclBhdGgiLCJhbmNlc3RvclBhdGgiLCJjb21tb25QYXRoIiwiZ2V0Q29tbW9uUGF0aCIsImRlc2NlbmRhbnRQYXR0ZXJuIiwic2VsZWN0b3JQYXRoIiwic2VsZWN0b3JNYXRjaGVzIiwiaW5wdXQiLCJ3aW5kb3ciLCJzdXBwb3J0IiwiRXhwciIsImdldFRleHQiLCJpc1hNTCIsInRva2VuaXplIiwiY29tcGlsZSIsIm91dGVybW9zdENvbnRleHQiLCJzb3J0SW5wdXQiLCJoYXNEdXBsaWNhdGUiLCJzZXREb2N1bWVudCIsImRvY0VsZW0iLCJkb2N1bWVudElzSFRNTCIsInJidWdneVFTQSIsInJidWdneU1hdGNoZXMiLCJleHBhbmRvIiwiRGF0ZSIsInByZWZlcnJlZERvYyIsImRpcnJ1bnMiLCJkb25lIiwiY2xhc3NDYWNoZSIsImNyZWF0ZUNhY2hlIiwidG9rZW5DYWNoZSIsImNvbXBpbGVyQ2FjaGUiLCJub25uYXRpdmVTZWxlY3RvckNhY2hlIiwic29ydE9yZGVyIiwiYiIsImhhc093biIsImhhc093blByb3BlcnR5IiwicHVzaE5hdGl2ZSIsImxpc3QiLCJlbGVtIiwibGVuIiwiYm9vbGVhbnMiLCJ3aGl0ZXNwYWNlIiwiaWRlbnRpZmllciIsInBzZXVkb3MiLCJyd2hpdGVzcGFjZSIsInJ0cmltIiwicmNvbW1hIiwicmNvbWJpbmF0b3JzIiwicmRlc2NlbmQiLCJycHNldWRvIiwicmlkZW50aWZpZXIiLCJtYXRjaEV4cHIiLCJyaHRtbCIsInJpbnB1dHMiLCJyaGVhZGVyIiwicm5hdGl2ZSIsInJxdWlja0V4cHIiLCJyc2libGluZyIsInJ1bmVzY2FwZSIsImZ1bmVzY2FwZSIsImVzY2FwZSIsIm5vbkhleCIsImhpZ2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidW5sb2FkSGFuZGxlciIsImluRGlzYWJsZWRGaWVsZHNldCIsImFkZENvbWJpbmF0b3IiLCJkaXNhYmxlZCIsIm5vZGVOYW1lIiwiZGlyIiwiYXBwbHkiLCJjYWxsIiwiY2hpbGROb2RlcyIsImUiLCJ0YXJnZXQiLCJlbHMiLCJqIiwiY29udGV4dCIsInJlc3VsdHMiLCJzZWVkIiwibSIsIm5pZCIsImdyb3VwcyIsIm5ld1NlbGVjdG9yIiwibmV3Q29udGV4dCIsIm93bmVyRG9jdW1lbnQiLCJleGVjIiwiZ2V0RWxlbWVudEJ5SWQiLCJpZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInFzYSIsInRlc3RDb250ZXh0Iiwic2NvcGUiLCJzZXRBdHRyaWJ1dGUiLCJ0b1NlbGVjdG9yIiwicXNhRXJyb3IiLCJyZW1vdmVBdHRyaWJ1dGUiLCJjYWNoZSIsImNhY2hlTGVuZ3RoIiwibWFya0Z1bmN0aW9uIiwiZm4iLCJhc3NlcnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEhhbmRsZSIsImF0dHJzIiwiaGFuZGxlciIsImF0dHJIYW5kbGUiLCJzaWJsaW5nQ2hlY2siLCJjdXIiLCJkaWZmIiwic291cmNlSW5kZXgiLCJuZXh0U2libGluZyIsImNyZWF0ZUlucHV0UHNldWRvIiwiY3JlYXRlQnV0dG9uUHNldWRvIiwiY3JlYXRlRGlzYWJsZWRQc2V1ZG8iLCJpc0Rpc2FibGVkIiwiY3JlYXRlUG9zaXRpb25hbFBzZXVkbyIsImFyZ3VtZW50IiwibWF0Y2hJbmRleGVzIiwibmFtZXNwYWNlIiwibmFtZXNwYWNlVVJJIiwiZG9jdW1lbnRFbGVtZW50IiwiaGFzQ29tcGFyZSIsInN1YldpbmRvdyIsImRlZmF1bHRWaWV3IiwidG9wIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVDb21tZW50IiwiZ2V0QnlJZCIsImdldEVsZW1lbnRzQnlOYW1lIiwiYXR0cklkIiwiZ2V0QXR0cmlidXRlTm9kZSIsImVsZW1zIiwidG1wIiwiaW5uZXJIVE1MIiwibWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwibW96TWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwiZGlzY29ubmVjdGVkTWF0Y2giLCJjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiIsImFkb3duIiwiYnVwIiwic29ydERldGFjaGVkIiwiYXVwIiwiYXAiLCJicCIsImV4cHIiLCJyZXQiLCJhdHRyIiwic3BlY2lmaWVkIiwic2VsIiwiZXJyb3IiLCJtc2ciLCJ1bmlxdWVTb3J0IiwiZHVwbGljYXRlcyIsImRldGVjdER1cGxpY2F0ZXMiLCJzb3J0U3RhYmxlIiwic3BsaWNlIiwic2VsZWN0b3JzIiwiY3JlYXRlUHNldWRvIiwicmVsYXRpdmUiLCJmaXJzdCIsInByZUZpbHRlciIsImV4Y2VzcyIsInVucXVvdGVkIiwibm9kZU5hbWVTZWxlY3RvciIsIm9wZXJhdG9yIiwid2hhdCIsIl9hcmd1bWVudCIsImxhc3QiLCJzaW1wbGUiLCJmb3J3YXJkIiwib2ZUeXBlIiwiX2NvbnRleHQiLCJ4bWwiLCJ1bmlxdWVDYWNoZSIsIm91dGVyQ2FjaGUiLCJub2RlSW5kZXgiLCJzdGFydCIsInVzZUNhY2hlIiwibGFzdENoaWxkIiwidW5pcXVlSUQiLCJhcmdzIiwic2V0RmlsdGVycyIsImlkeCIsIm1hdGNoZWQiLCJtYXRjaGVyIiwidW5tYXRjaGVkIiwibGFuZyIsImVsZW1MYW5nIiwiaGFzaCIsImxvY2F0aW9uIiwiYWN0aXZlRWxlbWVudCIsImhhc0ZvY3VzIiwiaHJlZiIsInRhYkluZGV4IiwiY2hlY2tlZCIsInNlbGVjdGVkIiwic2VsZWN0ZWRJbmRleCIsIl9tYXRjaEluZGV4ZXMiLCJyYWRpbyIsImNoZWNrYm94IiwiZmlsZSIsInBhc3N3b3JkIiwiaW1hZ2UiLCJzdWJtaXQiLCJyZXNldCIsInByb3RvdHlwZSIsImZpbHRlcnMiLCJwYXJzZU9ubHkiLCJ0b2tlbnMiLCJzb0ZhciIsInByZUZpbHRlcnMiLCJjYWNoZWQiLCJjb21iaW5hdG9yIiwiY2hlY2tOb25FbGVtZW50cyIsImRvbmVOYW1lIiwib2xkQ2FjaGUiLCJuZXdDYWNoZSIsImVsZW1lbnRNYXRjaGVyIiwibWF0Y2hlcnMiLCJtdWx0aXBsZUNvbnRleHRzIiwiY29udGV4dHMiLCJjb25kZW5zZSIsIm5ld1VubWF0Y2hlZCIsIm1hcHBlZCIsInNldE1hdGNoZXIiLCJwb3N0RmlsdGVyIiwicG9zdEZpbmRlciIsInBvc3RTZWxlY3RvciIsInRlbXAiLCJwcmVNYXAiLCJwb3N0TWFwIiwicHJlZXhpc3RpbmciLCJtYXRjaGVySW4iLCJtYXRjaGVyT3V0IiwibWF0Y2hlckZyb21Ub2tlbnMiLCJjaGVja0NvbnRleHQiLCJsZWFkaW5nUmVsYXRpdmUiLCJpbXBsaWNpdFJlbGF0aXZlIiwibWF0Y2hDb250ZXh0IiwibWF0Y2hBbnlDb250ZXh0IiwibWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzIiwiZWxlbWVudE1hdGNoZXJzIiwic2V0TWF0Y2hlcnMiLCJieVNldCIsImJ5RWxlbWVudCIsInN1cGVyTWF0Y2hlciIsIm91dGVybW9zdCIsIm1hdGNoZWRDb3VudCIsInNldE1hdGNoZWQiLCJjb250ZXh0QmFja3VwIiwiZGlycnVuc1VuaXF1ZSIsIk1hdGgiLCJyYW5kb20iLCJ0b2tlbiIsImNvbXBpbGVkIiwiX25hbWUiLCJkZWZhdWx0VmFsdWUiLCJfc2l6emxlIiwibm9Db25mbGljdCIsImRlZmluZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJkZWZhdWx0IiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiY29tbW9uIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUE7Ozs7OztBQU1BOzs7Ozs7QUFNTyxJQUFNQSw0Q0FBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBVztBQUFBLE1BQ2hDQyxNQURnQyxHQUNyQkQsS0FEcUIsQ0FDaENDLE1BRGdDOztBQUV4QyxNQUFNQyxNQUFNLElBQUlDLEtBQUosQ0FBVUYsTUFBVixDQUFaO0FBQ0EsT0FBSyxJQUFJRyxJQUFJLENBQWIsRUFBZ0JBLElBQUlILE1BQXBCLEVBQTRCRyxHQUE1QixFQUFpQztBQUMvQkYsUUFBSUUsQ0FBSixJQUFTSixNQUFNSSxDQUFOLENBQVQ7QUFDRDtBQUNELFNBQU9GLEdBQVA7QUFDRCxDQVBNOztBQVNQOzs7Ozs7OztBQVFPLElBQU1HLG9DQUFjLFNBQWRBLFdBQWMsQ0FBQ0MsS0FBRDtB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O0FBQ2xELE9BQUk3RSxHQUFKO0FBQ0EsT0FBSyxDQUFDNkUsS0FBTixFQUFjO0FBQ2IsV0FBTzJCLEtBQU10TyxJQUFOLE1BQWlCLElBQWpCLEdBQXdCQSxLQUFLd0YsV0FBTCxFQUF4QixHQUNOLENBQUVzQyxNQUFNd0csS0FBS3dHLGdCQUFMLENBQXVCOVUsSUFBdkIsQ0FBUixLQUEyQzhILElBQUlvTyxTQUEvQyxHQUNDcE8sSUFBSWxKLEtBREwsR0FFQyxJQUhGO0FBSUE7QUFDRCxHQVJEO0FBU0E7O0FBRUQ7QUFDQSxLQUFJb2UsVUFBVXpRLE9BQU8zSyxNQUFyQjs7QUFFQUEsUUFBT3FiLFVBQVAsR0FBb0IsWUFBVztBQUM5QixNQUFLMVEsT0FBTzNLLE1BQVAsS0FBa0JBLE1BQXZCLEVBQWdDO0FBQy9CMkssVUFBTzNLLE1BQVAsR0FBZ0JvYixPQUFoQjtBQUNBOztBQUVELFNBQU9wYixNQUFQO0FBQ0EsRUFORDs7QUFRQSxLQUFLLElBQUwsRUFBa0Q7QUFDakRzYixFQUFBLGtDQUFRLFlBQVc7QUFDbEIsVUFBT3RiLE1BQVA7QUFDQSxHQUZEOztBQUlEO0FBQ0MsRUFORCxNQU1PLElBQUssT0FBT3ViLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU9DLE9BQTdDLEVBQXVEO0FBQzdERCxTQUFPQyxPQUFQLEdBQWlCeGIsTUFBakI7QUFDQSxFQUZNLE1BRUE7QUFDTjJLLFNBQU8zSyxNQUFQLEdBQWdCQSxNQUFoQjtBQUNBOztBQUVEO0FBRUMsQ0FuNkVELEVBbTZFSzJLLE1BbjZFTCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJDQ1ZTOFEsTzs7Ozs7O21CQUFtQkMsaUI7Ozs7OzttQkFBbUJDLGdCOzs7Ozs7Ozs7MENBQ3RDRixPOzs7Ozs7a0JBQWtCelgsVzs7Ozs7Ozs7OzZDQUNsQnlYLE87Ozs7Ozs7Ozs7OztRQUNHRyxNIiwiZmlsZSI6Im9wdGltYWwtc2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk4ZWU3N2M0ZjdiMTk2ZjMzMjI2IiwiLyoqXG4gKiAjIFV0aWxpdGllc1xuICpcbiAqIENvbnZlbmllbmNlIGhlbHBlcnMuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgYW4gYXJyYXkgd2l0aCB0aGUgRE9NIG5vZGVzIG9mIHRoZSBsaXN0XG4gKlxuICogQHBhcmFtICB7Tm9kZUxpc3R9ICAgICAgICAgICAgIG5vZGVzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgY29udmVydE5vZGVMaXN0ID0gKG5vZGVzKSA9PiB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZXNjYXBlVmFsdWUgPSAodmFsdWUpID0+XG4gIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1snXCJgXFxcXC86PyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dL2csICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcdTAwYTAnKVxuXG4vKipcbiAqIFBhcnRpdGlvbiBhcnJheSBpbnRvIHR3byBncm91cHMgZGV0ZXJtaW5lZCBieSBwcmVkaWNhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnRpdGlvbiA9IChhcnJheSwgcHJlZGljYXRlKSA9PlxuICBhcnJheS5yZWR1Y2UoXG4gICAgKFtpbm5lciwgb3V0ZXJdLCBpdGVtKSA9PiBwcmVkaWNhdGUoaXRlbSkgPyBbaW5uZXIuY29uY2F0KGl0ZW0pLCBvdXRlcl0gOiBbaW5uZXIsIG91dGVyLmNvbmNhdChpdGVtKV0sXG4gICAgW1tdLCBbXV1cbiAgKVxuXG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgc3RyaW5nIGlzIHZhbGlkIENTUyBpZGVudGlmaWVyXG4gKiBcbiAqIEluIENTUywgaWRlbnRpZmllcnMgKGluY2x1ZGluZyBlbGVtZW50IG5hbWVzLCBjbGFzc2VzLCBhbmQgSURzIGluIHNlbGVjdG9ycykgY2FuIGNvbnRhaW5cbiAqIG9ubHkgdGhlIGNoYXJhY3RlcnMgW2EtekEtWjAtOV0gYW5kIElTTyAxMDY0NiBjaGFyYWN0ZXJzIFUrMDBBMCBhbmQgaGlnaGVyLCBwbHVzIHRoZSBoeXBoZW4gKC0pXG4gKiBhbmQgdGhlIHVuZGVyc2NvcmUgKF8pOyB0aGV5IGNhbm5vdCBzdGFydCB3aXRoIGEgZGlnaXQsIHR3byBoeXBoZW5zLCBvciBhIGh5cGhlbiBmb2xsb3dlZCBieVxuICogYSBkaWdpdC5cbiAqIFxuICogSWRlbnRpZmllcnMgY2FuIGFsc28gY29udGFpbiBlc2NhcGVkIGNoYXJhY3RlcnMgYW5kIGFueSBJU08gMTA2NDYgY2hhcmFjdGVyIGFzIGEgbnVtZXJpY1xuICogY29kZSAoc2VlIG5leHQgaXRlbSkuIEZvciBpbnN0YW5jZSwgdGhlIGlkZW50aWZpZXIgXCJCJlc/XCIgbWF5IGJlIHdyaXR0ZW4gYXMgXCJCXFwmV1xcP1wiIG9yIFwiQlxcMjYgV1xcM0ZcIi5cbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBpc1ZhbGlkQ1NTSWRlbnRpZmllciA9ICh2YWx1ZSkgPT5cbiAgISF2YWx1ZSAmJiAhLyheXFxkKXwoXi0tKXwoXi1cXGQpLy50ZXN0KHZhbHVlKSAmJiAhLyhbXlxcXFxdfF4pWydcImAvOj8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XS8udGVzdCh2YWx1ZSlcblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiaW1wb3J0IHsgaXNWYWxpZENTU0lkZW50aWZpZXIgfSBmcm9tICcuL3V0aWxpdGllcydcbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IFBhdHRlcm5cbiAqIEBwcm9wZXJ0eSB7KCdkZXNjZW5kYW50JyB8ICdjaGlsZCcpfSAgICAgICAgICAgICAgICAgIFtyZWxhdGVzXVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhZ11cbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9Pn0gIGF0dHJpYnV0ZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBzZXVkb1xuICogQHByb3BlcnR5IHtBcnJheS48QXJyYXkuPFBhdHRlcm4+Pn0gICAgICAgICAgICAgICAgICAgZGVzY2VuZGFudHNcbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcGF0dGVybiBzdHJ1Y3R1cmVcbiAqIFxuICogQHBhcmFtIHtQYXJ0aWFsPFBhdHRlcm4+fSBwYXR0ZXJuXG4gKiBAcmV0dXJucyB7UGF0dGVybn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVBhdHRlcm4gPSAoYmFzZSA9IHt9KSA9PlxuICAoeyBhdHRyaWJ1dGVzOiBbXSwgY2xhc3NlczogW10sIHBzZXVkbzogW10sIGRlc2NlbmRhbnRzOiBbXSwgLi4uYmFzZSB9KVxuXG4vKipcbiAqIENvbnZlcnQgYXR0cmlidXRlcyB0byBDU1Mgc2VsZWN0b3JcbiAqIFxuICogQHBhcmFtIHtBcnJheS48eyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmc/IH0+fSBhdHRyaWJ1dGVzIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZXNUb1NlbGVjdG9yID0gKGF0dHJpYnV0ZXMpID0+XG4gIGF0dHJpYnV0ZXMubWFwKCh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBgWyR7bmFtZX1dYFxuICAgIH1cbiAgICBpZiAobmFtZSA9PT0gJ2lkJyAmJiBpc1ZhbGlkQ1NTSWRlbnRpZmllcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBgIyR7dmFsdWV9YFxuICAgIH1cbiAgICByZXR1cm4gYFske25hbWV9PVwiJHt2YWx1ZX1cIl1gXG4gIH0pLmpvaW4oJycpXG5cbi8qKlxuICogQ29udmVydCBjbGFzc2VzIHRvIENTUyBzZWxlY3RvclxuICogXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGNsYXNzZXNUb1NlbGVjdG9yID0gKGNsYXNzZXMpID0+XG4gIGNsYXNzZXMubWFwKGMgPT4gaXNWYWxpZENTU0lkZW50aWZpZXIoYykgPyBgLiR7Y31gIDogYFtjbGFzc349XCIke2N9XCJdYCkuam9pbignJylcblxuLyoqXG4gKiBDb252ZXJ0IHBzZXVkbyBzZWxlY3RvcnMgdG8gQ1NTIHNlbGVjdG9yXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBzZXVkbyBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwc2V1ZG9Ub1NlbGVjdG9yID0gKHBzZXVkbykgPT4gcHNldWRvLmxlbmd0aCA/IGA6JHtwc2V1ZG8uam9pbignOicpfWAgOiAnJ1xuXG4vKipcbiAqIENvbnZlcnQgcGF0dGVybiB0byBDU1Mgc2VsZWN0b3JcbiAqIFxuICogQHBhcmFtIHtQYXR0ZXJufSBwYXR0ZXJuIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBhdHRlcm5Ub1NlbGVjdG9yID0gKHBhdHRlcm4pID0+IHtcbiAgY29uc3QgeyByZWxhdGVzLCB0YWcsIGF0dHJpYnV0ZXMsIGNsYXNzZXMsIHBzZXVkbyB9ID0gcGF0dGVyblxuICBjb25zdCB2YWx1ZSA9IGAke1xuICAgIHJlbGF0ZXMgPT09ICdjaGlsZCcgPyAnPiAnIDogJydcbiAgfSR7XG4gICAgdGFnIHx8ICcnXG4gIH0ke1xuICAgIGF0dHJpYnV0ZXNUb1NlbGVjdG9yKGF0dHJpYnV0ZXMpXG4gIH0ke1xuICAgIGNsYXNzZXNUb1NlbGVjdG9yKGNsYXNzZXMpXG4gIH0ke1xuICAgIHBzZXVkb1RvU2VsZWN0b3IocHNldWRvKVxuICB9YFxuICByZXR1cm4gdmFsdWVcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBwYXRoIHRvIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBhdGhUb1NlbGVjdG9yID0gKHBhdGgpID0+XG4gIHBhdGgubWFwKHBhdHRlcm5Ub1NlbGVjdG9yKS5qb2luKCcgJylcblxuXG5jb25zdCBjb252ZXJ0RXNjYXBpbmcgPSAodmFsdWUpID0+XG4gIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1xcXFwoW2BcXFxcLzo/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0pL2csICckMScpXG4gICAgLnJlcGxhY2UoL1xcXFwoWydcIl0pL2csICckMSQxJylcbiAgICAucmVwbGFjZSgvXFxcXEEgL2csICdcXG4nKVxuXG4vKipcbiogQ29udmVydCBhdHRyaWJ1dGVzIHRvIFhQYXRoIHN0cmluZ1xuKiBcbiogQHBhcmFtIHtBcnJheS48eyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmc/IH0+fSBhdHRyaWJ1dGVzIFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBhdHRyaWJ1dGVzVG9YUGF0aCA9IChhdHRyaWJ1dGVzKSA9PlxuICBhdHRyaWJ1dGVzLm1hcCgoeyBuYW1lLCB2YWx1ZSB9KSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gYFtAJHtuYW1lfV1gXG4gICAgfVxuICAgIHJldHVybiBgW0Ake25hbWV9PVwiJHtjb252ZXJ0RXNjYXBpbmcodmFsdWUpfVwiXWBcbiAgfSkuam9pbignJylcblxuLyoqXG4qIENvbnZlcnQgY2xhc3NlcyB0byBYUGF0aCBzdHJpbmdcbiogXG4qIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNsYXNzZXMgXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IGNsYXNzZXNUb1hQYXRoID0gKGNsYXNzZXMpID0+XG4gIGNsYXNzZXMubWFwKGMgPT4gYFtjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEBjbGFzcyksXCIgXCIpLFwiICR7Y30gXCIpXWApLmpvaW4oJycpXG5cbi8qKlxuKiBDb252ZXJ0IHBzZXVkbyBzZWxlY3RvcnMgdG8gWFBhdGggc3RyaW5nXG4qIFxuKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwc2V1ZG8gXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IHBzZXVkb1RvWFBhdGggPSAocHNldWRvKSA9PlxuICBwc2V1ZG8ubWFwKHAgPT4ge1xuICAgIGNvbnN0IG1hdGNoID0gcC5tYXRjaCgvXihudGgtY2hpbGR8bnRoLW9mLXR5cGV8Y29udGFpbnMpXFwoKC4rKVxcKSQvKVxuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cblxuICAgIHN3aXRjaCAobWF0Y2hbMV0pIHtcbiAgICAgIGNhc2UgJ250aC1jaGlsZCc6XG4gICAgICAgIHJldHVybiBgWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgPSAke21hdGNoWzJdfV1gXG5cbiAgICAgIGNhc2UgJ250aC1vZi10eXBlJzpcbiAgICAgICAgcmV0dXJuIGBbJHttYXRjaFsyXX1dYFxuXG4gICAgICBjYXNlICdjb250YWlucyc6XG4gICAgICAgIHJldHVybiBgW2NvbnRhaW5zKHRleHQoKSwke21hdGNoWzJdfSldYFxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJydcbiAgICB9XG4gIH0pLmpvaW4oJycpXG5cbi8qKlxuKiBDb252ZXJ0IHBhdHRlcm4gdG8gWFBhdGggc3RyaW5nXG4qIFxuKiBAcGFyYW0ge1BhdHRlcm59IHBhdHRlcm4gXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IHBhdHRlcm5Ub1hQYXRoID0gKHBhdHRlcm4pID0+IHtcbiAgY29uc3QgeyByZWxhdGVzLCB0YWcsIGF0dHJpYnV0ZXMsIGNsYXNzZXMsIHBzZXVkbywgZGVzY2VuZGFudHMgfSA9IHBhdHRlcm5cbiAgY29uc3QgdmFsdWUgPSBgJHtcbiAgICByZWxhdGVzID09PSAnY2hpbGQnID8gJy8nIDogJy8vJ1xuICB9JHtcbiAgICB0YWcgfHwgJyonXG4gIH0ke1xuICAgIGF0dHJpYnV0ZXNUb1hQYXRoKGF0dHJpYnV0ZXMpXG4gIH0ke1xuICAgIGNsYXNzZXNUb1hQYXRoKGNsYXNzZXMpXG4gIH0ke1xuICAgIHBzZXVkb1RvWFBhdGgocHNldWRvKVxuICB9JHtcbiAgICBkZXNjZW5kYW50c1RvWFBhdGgoZGVzY2VuZGFudHMpXG4gIH1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiogQ29udmVydHMgcGF0aCB0byBYUGF0aCBzdHJpbmdcbipcbiogQHBhcmFtIHtBcnJheS48UGF0dGVybj59IHBhdGggXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IHBhdGhUb1hQYXRoID0gKHBhdGgpID0+IGAuJHtwYXRoLm1hcChwYXR0ZXJuVG9YUGF0aCkuam9pbignJyl9YFxuXG4vKipcbiogQ29udmVydCBjaGlsZCBzZWxlY3RvcnMgdG8gWFBhdGggc3RyaW5nXG4qIFxuKiBAcGFyYW0ge0FycmF5LjxBcnJheS48UGF0dGVybj4+fSBjaGlsZHJlbiBcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgY29uc3QgZGVzY2VuZGFudHNUb1hQYXRoID0gKGNoaWxkcmVuKSA9PlxuICBjaGlsZHJlbi5sZW5ndGggPyBgWyR7Y2hpbGRyZW4ubWFwKHBhdGhUb1hQYXRoKS5qb2luKCddWycpfV1gIDogJydcblxuICBcbmNvbnN0IHRvU3RyaW5nID0ge1xuICAnY3NzJzoge1xuICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXNUb1NlbGVjdG9yLFxuICAgIGNsYXNzZXM6IGNsYXNzZXNUb1NlbGVjdG9yLFxuICAgIHBzZXVkbzogcHNldWRvVG9TZWxlY3RvcixcbiAgICBwYXR0ZXJuOiBwYXR0ZXJuVG9TZWxlY3RvcixcbiAgICBwYXRoOiBwYXRoVG9TZWxlY3RvclxuICB9LFxuICAneHBhdGgnOiB7XG4gICAgYXR0cmlidXRlczogYXR0cmlidXRlc1RvWFBhdGgsXG4gICAgY2xhc3NlczogY2xhc3Nlc1RvWFBhdGgsXG4gICAgcHNldWRvOiBwc2V1ZG9Ub1hQYXRoLFxuICAgIHBhdHRlcm46IHBhdHRlcm5Ub1hQYXRoLFxuICAgIHBhdGg6IHBhdGhUb1hQYXRoXG4gIH0sXG4gICdqcXVlcnknOiB7fVxufVxuXG50b1N0cmluZy5qcXVlcnkgPSB0b1N0cmluZy5jc3NcbnRvU3RyaW5nWzBdID0gdG9TdHJpbmcuY3NzXG50b1N0cmluZ1sxXSA9IHRvU3RyaW5nLnhwYXRoXG4gIFxuLyoqXG4gKiBAdHlwZWRlZiAge09iamVjdH0gVG9TdHJpbmdBcGlcbiAqIEBwcm9wZXJ0eSB7KGF0dHJpYnV0ZXM6IEFycmF5Ljx7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZz8gfT4pID0+IHN0cmluZ30gYXR0cmlidXRlc1xuICogQHByb3BlcnR5IHsoY2xhc3NlczogQXJyYXkuPHN0cmluZz4pID0+IHN0cmluZ30gIGNsYXNzZXNcbiAqIEBwcm9wZXJ0eSB7KHBzZXVkbzogQXJyYXkuPHN0cmluZz4pID0+IHN0cmluZ30gICBwc2V1ZG9cbiAqIEBwcm9wZXJ0eSB7KHBhdHRlcm46IFBhdHRlcm4pID0+IHN0cmluZ30gICAgICAgICBwYXR0ZXJuXG4gKiBAcHJvcGVydHkgeyhwYXRoOiBBcnJheS48UGF0dGVybj4pID0+IHN0cmluZ30gICAgcGF0aFxuICovXG5cbi8qKlxuICogXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgXG4gKiBAcmV0dXJucyB7VG9TdHJpbmdBcGl9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRUb1N0cmluZyA9IChvcHRpb25zID0ge30pID0+XG4gIHRvU3RyaW5nW29wdGlvbnMuZm9ybWF0IHx8ICdjc3MnXVxuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYXR0ZXJuLmpzIiwiLy8gaW1wb3J0IFNpenpsZSBmcm9tICdzaXp6bGUnXG5sZXQgU2l6emxlXG5cbi8qKlxuICogU2VsZWN0IGVsZW1lbnQgdXNpbmcgalF1ZXJ5XG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgc2VsZWN0b3JcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnRcbiAqIEByZXR1cm4gQXJyYXkuPEhUTUxFbGVtZW50PlxuICovXG5jb25zdCBzZWxlY3RKUXVlcnkgPSAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpID0+IHtcbiAgaWYgKCFTaXp6bGUpIHtcbiAgICBTaXp6bGUgPSByZXF1aXJlKCdzaXp6bGUnKVxuICB9XG4gIHJldHVybiBTaXp6bGUoc2VsZWN0b3IsIHBhcmVudCB8fCBkb2N1bWVudClcbn1cbiAgXG4vKipcbiAqIFNlbGVjdCBlbGVtZW50IHVzaW5nIFhQYXRoXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgc2VsZWN0b3JcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnRcbiAqIEByZXR1cm4gQXJyYXkuPEhUTUxFbGVtZW50PlxuICovXG5jb25zdCBzZWxlY3RYUGF0aCA9IChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkgPT4ge1xuICBwYXJlbnQgPSAocGFyZW50IHx8IGRvY3VtZW50KVxuICB2YXIgZG9jID0gcGFyZW50XG4gIHdoaWxlIChkb2MucGFyZW50Tm9kZSkge1xuICAgIGRvYyA9IGRvYy5wYXJlbnROb2RlXG4gIH1cbiAgaWYgKGRvYyAhPT0gcGFyZW50ICYmICFzZWxlY3Rvci5zdGFydHNXaXRoKCcuJykpIHtcbiAgICBzZWxlY3RvciA9IGAuJHtzZWxlY3Rvcn1gXG4gIH1cbiAgdmFyIGl0ZXJhdG9yID0gZG9jLmV2YWx1YXRlKHNlbGVjdG9yLCBwYXJlbnQsIG51bGwsIDApXG4gIHZhciBlbGVtZW50cyA9IFtdXG4gIHZhciBlbGVtZW50XG4gIHdoaWxlICgoZWxlbWVudCA9IGl0ZXJhdG9yLml0ZXJhdGVOZXh0KCkpKSB7XG4gICAgZWxlbWVudHMucHVzaChlbGVtZW50KVxuICB9XG4gIHJldHVybiBlbGVtZW50c1xufVxuICBcbi8qKlxuICogU2VsZWN0IGVsZW1lbnQgdXNpbmcgQ1NTXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgc2VsZWN0b3JcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnRcbiAqIEByZXR1cm4gQXJyYXkuPEhUTUxFbGVtZW50PlxuICovXG5jb25zdCBzZWxlY3RDU1MgPSAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpID0+XG4gIChwYXJlbnQgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXG5cbmNvbnN0IHNlbGVjdCA9IHtcbiAgJ2Nzcyc6IHNlbGVjdENTUyxcbiAgJ3hwYXRoJzogc2VsZWN0WFBhdGgsXG4gICdqcXVlcnknOiBzZWxlY3RKUXVlcnlcbn1cblxuc2VsZWN0WzBdID0gc2VsZWN0LmNzc1xuc2VsZWN0WzFdID0gc2VsZWN0LnhwYXRoXG5cbi8qKlxuKiBcbiogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zIFxuKiBAcmV0dXJucyB7KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudDogSFRNTEVsZW1lbnQpID0+IEFycmF5LjxIVE1MRWxlbWVudD59XG4qL1xuZXhwb3J0IGNvbnN0IGdldFNlbGVjdCA9IChvcHRpb25zID0ge30pID0+XG4gIChzZWxlY3RvciwgcGFyZW50KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBzZWxlY3Rbb3B0aW9ucy5mb3JtYXQgfHwgJ2NzcyddKHNlbGVjdG9yLCBwYXJlbnQgfHwgb3B0aW9ucy5yb290KVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICB9XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3Rvci5qcyIsIi8qKlxuICogIyBDb21tb25cbiAqXG4gKiBQcm9jZXNzIGNvbGxlY3Rpb25zIGZvciBzaW1pbGFyaXRpZXMuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIEZpbmQgdGhlIGxhc3QgY29tbW9uIGFuY2VzdG9yIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29tbW9uQW5jZXN0b3IgPSAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb21tb25Qcm9wZXJ0aWVzID0gKGVsZW1lbnRzKSA9PiB7XG5cbiAgY29uc3QgY29tbW9uUHJvcGVydGllcyA9IHtcbiAgICBjbGFzc2VzOiBbXSxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICB0YWc6IG51bGxcbiAgfVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgIHZhciB7XG4gICAgICBjbGFzc2VzOiBjb21tb25DbGFzc2VzLFxuICAgICAgYXR0cmlidXRlczogY29tbW9uQXR0cmlidXRlcyxcbiAgICAgIHRhZzogY29tbW9uVGFnXG4gICAgfSA9IGNvbW1vblByb3BlcnRpZXNcblxuICAgIC8vIH4gY2xhc3Nlc1xuICAgIGlmIChjb21tb25DbGFzc2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpXG4gICAgICAgIGlmICghY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQ2xhc3NlcyA9IGNvbW1vbkNsYXNzZXMuZmlsdGVyKChlbnRyeSkgPT4gY2xhc3Nlcy5zb21lKChuYW1lKSA9PiBuYW1lID09PSBlbnRyeSkpXG4gICAgICAgICAgaWYgKGNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjb21tb25DbGFzc2VzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHJlc3RydWN0dXJlIHJlbW92YWwgYXMgMnggc2V0IC8gMnggZGVsZXRlLCBpbnN0ZWFkIG9mIG1vZGlmeSBhbHdheXMgcmVwbGFjaW5nIHdpdGggbmV3IGNvbGxlY3Rpb25cbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gYXR0cmlidXRlc1xuICAgIGlmIChjb21tb25BdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZWxlbWVudEF0dHJpYnV0ZXMpLnJlZHVjZSgoYXR0cmlidXRlcywga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGVsZW1lbnRBdHRyaWJ1dGVzW2tleV1cbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgICAgIC8vIE5PVEU6IHdvcmthcm91bmQgZGV0ZWN0aW9uIGZvciBub24tc3RhbmRhcmQgcGhhbnRvbWpzIE5hbWVkTm9kZU1hcCBiZWhhdmlvdXJcbiAgICAgICAgLy8gKGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXJpeWEvcGhhbnRvbWpzL2lzc3Vlcy8xNDYzNClcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9LCB7fSlcblxuICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcylcbiAgICAgIGNvbnN0IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpXG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICghY29tbW9uQXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25BdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc05hbWVzLnJlZHVjZSgobmV4dENvbW1vbkF0dHJpYnV0ZXMsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29tbW9uQXR0cmlidXRlc1tuYW1lXVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBhdHRyaWJ1dGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgIG5leHRDb21tb25BdHRyaWJ1dGVzW25hbWVdID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0Q29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gdGFnXG4gICAgaWYgKGNvbW1vblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB0YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKCFjb21tb25UYWcpIHtcbiAgICAgICAgY29tbW9uUHJvcGVydGllcy50YWcgPSB0YWdcbiAgICAgIH0gZWxzZSBpZiAodGFnICE9PSBjb21tb25UYWcpIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMudGFnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBjb21tb25Qcm9wZXJ0aWVzXG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24uanMiLCIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZSBzZWxlY3RvciBmb3IgYSBub2RlLlxuICovXG5cbmltcG9ydCB7IGNyZWF0ZVBhdHRlcm4sIGdldFRvU3RyaW5nIH0gZnJvbSAnLi9wYXR0ZXJuJ1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9zZWxlY3RvcidcbmltcG9ydCB7IGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3BhdHRlcm4nKS5QYXR0ZXJufSBQYXR0ZXJuXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3BhdHRlcm4nKS5Ub1N0cmluZ0FwaX0gUGF0dGVyblxuICovXG5cbmNvbnN0IGRlZmF1bHRJZ25vcmUgPSB7XG4gIGF0dHJpYnV0ZSAoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBbXG4gICAgICAnc3R5bGUnLFxuICAgICAgJ2RhdGEtcmVhY3RpZCcsXG4gICAgICAnZGF0YS1yZWFjdC1jaGVja3N1bSdcbiAgICBdLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPiAtMVxuICB9LFxuICBjb250YWluczogKCkgPT4gdHJ1ZVxufVxuXG5leHBvcnQgY29uc3QgaW5pdE9wdGlvbnMgPSAob3B0aW9ucyA9IHt9KSA9PiAoe1xuICAuLi5vcHRpb25zLFxuICByb290OiBvcHRpb25zLnJvb3QgfHwgZG9jdW1lbnQsXG4gIHNraXA6IG9wdGlvbnMuc2tpcCB8fCBudWxsLFxuICBwcmlvcml0eTogb3B0aW9ucy5wcmlvcml0eSB8fCBbJ2lkJywgJ2NsYXNzJywgJ2hyZWYnLCAnc3JjJ10sXG4gIGlnbm9yZTogb3B0aW9ucy5pZ25vcmUgfHwge31cbn0pXG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIG9mIHRoZSBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48UGF0dGVybj59ICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucyA9IHt9LCBuZXN0ZWQgPSBmYWxzZSkge1xuICBvcHRpb25zID0gaW5pdE9wdGlvbnMob3B0aW9ucylcbiAgY29uc3QgeyByb290LCBza2lwLCBpZ25vcmUsIGZvcm1hdCB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IHBhdGggPSBbXVxuICBsZXQgZWxlbWVudCA9IG5vZGVcbiAgbGV0IGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIGNvbnN0IHNlbGVjdCA9IGdldFNlbGVjdChvcHRpb25zKVxuICBjb25zdCB0b1N0cmluZyA9IGdldFRvU3RyaW5nKG9wdGlvbnMpXG5cbiAgY29uc3Qgc2tpcENvbXBhcmUgPSBza2lwICYmIChBcnJheS5pc0FycmF5KHNraXApID8gc2tpcCA6IFtza2lwXSkubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAoZWxlbWVudCkgPT4gZWxlbWVudCA9PT0gZW50cnlcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5XG4gIH0pXG5cbiAgY29uc3Qgc2tpcENoZWNrcyA9IChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHNraXAgJiYgc2tpcENvbXBhcmUuc29tZSgoY29tcGFyZSkgPT4gY29tcGFyZShlbGVtZW50KSlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGlnbm9yZSkuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgIHZhciBwcmVkaWNhdGUgPSBpZ25vcmVbdHlwZV1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHByZWRpY2F0ZSA9IG5ldyBSZWdFeHAoZXNjYXBlVmFsdWUocHJlZGljYXRlKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUgPyAvKD86KS8gOiAvLl4vXG4gICAgfVxuICAgIC8vIGNoZWNrIGNsYXNzLS9hdHRyaWJ1dGVuYW1lIGZvciByZWdleFxuICAgIGlnbm9yZVt0eXBlXSA9IChuYW1lLCB2YWx1ZSkgPT4gcHJlZGljYXRlLnRlc3QodmFsdWUpXG4gIH0pXG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QgJiYgZWxlbWVudC5ub2RlVHlwZSAhPT0gMTEpIHtcbiAgICBpZiAoc2tpcENoZWNrcyhlbGVtZW50KSAhPT0gdHJ1ZSkge1xuICAgICAgLy8gfiBnbG9iYWxcbiAgICAgIGlmIChjaGVja0F0dHJpYnV0ZXMoZWxlbWVudCwgcGF0aCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZywgcm9vdCkpIGJyZWFrXG4gICAgICBpZiAoY2hlY2tUYWcoZWxlbWVudCwgcGF0aCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZywgcm9vdCkpIGJyZWFrXG5cbiAgICAgIC8vIH4gbG9jYWxcbiAgICAgIGNoZWNrQXR0cmlidXRlcyhlbGVtZW50LCBwYXRoLCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nKVxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tUYWcoZWxlbWVudCwgcGF0aCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZylcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGggJiYgWzEsICd4cGF0aCddLmluY2x1ZGVzKGZvcm1hdCkgJiYgIW5lc3RlZCAmJiBlbGVtZW50ID09PSBub2RlKSB7XG4gICAgICAgIGNoZWNrUmVjdXJzaXZlRGVzY2VuZGFudHMoZWxlbWVudCwgcGF0aCwgb3B0aW9ucywgc2VsZWN0LCB0b1N0cmluZylcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGggJiYgWzEsICd4cGF0aCcsICdqcXVlcnknXS5pbmNsdWRlcyhmb3JtYXQpKSB7XG4gICAgICAgIGNoZWNrVGV4dChlbGVtZW50LCBwYXRoLCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nLCBmb3JtYXQgPT09ICdqcXVlcnknKVxuICAgICAgfVxuXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja050aENoaWxkKGVsZW1lbnQsIHBhdGgsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihlbGVtZW50LCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nKVxuICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICB9XG5cbiAgcmV0dXJuIHBhdGhcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgIHBhcmVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tBdHRyaWJ1dGVzID0gKGVsZW1lbnQsIHBhdGgsIHsgcHJpb3JpdHksIGlnbm9yZSB9LCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpID0+IHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIGFycmF5IG9mIGNvbWJpbmF0aW9ucyBvZiBpdGVtcyBpbiBpbnB1dCBhcnJheS5cbiAqIEBwYXJhbSAge0FycmF5Ljxhbnk+fSB2YWx1ZXMgICAtIGFycmF5IG9mIHZhbHVlc1xuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAgICAgIC0gb3B0aW9uczogbWluIC0gbWluaW11bSBzdWJzZXQgc2l6ZTsgbWF4IC0gbWF4aW11bSBzdWJzZXQgc2l6ZVxuICogQHJldHVybiB7QXJyYXkuPEFycmF5Ljxhbnk+Pj99ICAgYXJyYXkgb2Ygc3Vic2V0c1xuICovXG5leHBvcnQgY29uc3QgY29tYmluYXRpb25zID0gKHZhbHVlcywgb3B0aW9ucykgPT4ge1xuICBjb25zdCB7IG1pbiwgbWF4IH0gPSBvcHRpb25zIHx8IHt9XG4gIGNvbnN0IHJlc3VsdCA9IFtbXV1cblxuICB2YWx1ZXMuZm9yRWFjaCh2ID0+IHtcbiAgICByZXN1bHQuZm9yRWFjaChyID0+IHtcbiAgICAgIGlmICghbWF4IHx8IHIubGVuZ3RoIDwgbWF4KSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHIuY29uY2F0KHYpKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcbiAgcmV0dXJuIG1pbiA/IHJlc3VsdC5maWx0ZXIociA9PiByLmxlbmd0aCA+PSBtaW4pIDogcmVzdWx0XG59XG5cbi8vIGxpbWl0IHN1YnNldCBzaXplIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlXG5jb25zdCBtYXhTdWJzZXRTaXplID0gW1xuICB7IGl0ZW1zOiAxMywgbWF4OiAxIH0sXG4gIHsgaXRlbXM6IDEwLCBtYXg6IDIgfSxcbiAgeyBpdGVtczogOCwgbWF4OiAzIH0sXG4gIHsgaXRlbXM6IDUsIG1heDogNCB9XG5dXG5cbi8qKlxuICogR2V0IGNsYXNzIHNlbGVjdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IGNsYXNzZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgIGJhc2UgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPj99ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgZ2V0Q2xhc3NTZWxlY3RvciA9IChjbGFzc2VzID0gW10sIHNlbGVjdCwgdG9TdHJpbmcsIHBhcmVudCwgYmFzZSkgPT4ge1xuICBjb25zdCB7IG1heCB9ID1cbiAgICBtYXhTdWJzZXRTaXplLmZpbmQoKHsgaXRlbXMgfSkgPT4gY2xhc3Nlcy5sZW5ndGggPiBpdGVtcykgfHwgeyBtYXg6IGNsYXNzZXMubGVuZ3RoIH1cblxuICBsZXQgcmVzdWx0ID0gY29tYmluYXRpb25zKGNsYXNzZXMsIHsgbWF4IH0pXG5cbiAgZm9yKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHBhdHRlcm4gPSB0b1N0cmluZy5wYXR0ZXJuKHsgLi4uYmFzZSwgY2xhc3NlczogcmVzdWx0W2ldIH0pXG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gcmVzdWx0W2ldXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMb29rdXAgYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgIHRvU3RyaW5nICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhcmVudE5vZGV9ICAgICBwYXJlbnQgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJuP30gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBmaW5kQXR0cmlidXRlc1BhdHRlcm4gPSAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCB0b1N0cmluZywgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSA9PiB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykubWFwKCh2YWwpID0+IGF0dHJpYnV0ZXNbdmFsXS5uYW1lKVxuICAgIC5maWx0ZXIoKGEpID0+IHByaW9yaXR5LmluZGV4T2YoYSkgPCAwKVxuXG4gIHZhciBzb3J0ZWRLZXlzID0gWyAuLi5wcmlvcml0eSwgLi4uYXR0cmlidXRlTmFtZXMgXVxuICB2YXIgcGF0dGVybiA9IGNyZWF0ZVBhdHRlcm4oKVxuICBwYXR0ZXJuLnRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIGlzT3B0aW1hbCA9IChwYXR0ZXJuKSA9PiAoc2VsZWN0KHRvU3RyaW5nLnBhdHRlcm4ocGF0dGVybiksIHBhcmVudCkubGVuZ3RoID09PSAxKVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc29ydGVkS2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBzb3J0ZWRLZXlzW2ldXG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGUubmFtZSlcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGUudmFsdWUpXG4gICAgY29uc3QgdXNlTmFtZWRJZ25vcmUgPSBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnXG5cbiAgICBjb25zdCBjdXJyZW50SWdub3JlID0gKHVzZU5hbWVkSWdub3JlICYmIGlnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgaWdub3JlLmF0dHJpYnV0ZVxuICAgIGNvbnN0IGN1cnJlbnREZWZhdWx0SWdub3JlID0gKHVzZU5hbWVkSWdub3JlICYmIGRlZmF1bHRJZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlXG4gICAgaWYgKGNoZWNrSWdub3JlKGN1cnJlbnRJZ25vcmUsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlLCBjdXJyZW50RGVmYXVsdElnbm9yZSkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgc3dpdGNoIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICBjYXNlICdjbGFzcyc6IHtcbiAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKCkuc3BsaXQoL1xccysvZylcbiAgICAgICAgaWYgKCFjbGFzc05hbWVzWzBdKSB7IC8vIGVtcHR5IHN0cmluZ1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY2xhc3NJZ25vcmUgPSBpZ25vcmUuY2xhc3MgfHwgZGVmYXVsdElnbm9yZS5jbGFzc1xuICAgICAgICBpZiAoY2xhc3NJZ25vcmUpIHtcbiAgICAgICAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lcy5maWx0ZXIoY2xhc3NOYW1lID0+ICFjbGFzc0lnbm9yZShjbGFzc05hbWUpKVxuICAgICAgICB9XG4gICAgICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb25zdCBjbGFzc2VzID0gZ2V0Q2xhc3NTZWxlY3RvcihjbGFzc05hbWVzLCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQsIHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgICAgIHBhdHRlcm4uY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcGF0dGVybi5hdHRyaWJ1dGVzLnB1c2goeyBuYW1lOiBhdHRyaWJ1dGVOYW1lLCB2YWx1ZTogYXR0cmlidXRlVmFsdWUgfSlcbiAgICAgICAgaWYgKGlzT3B0aW1hbChwYXR0ZXJuKSkge1xuICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBjaGVja1RhZyA9IChlbGVtZW50LCBwYXRoLCB7IGlnbm9yZSB9LCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpID0+IHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBsZXQgbWF0Y2hlcyA9IFtdXG4gICAgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXR0ZXJuKHBhdHRlcm4pLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIGlmIChwYXR0ZXJuLnRhZyA9PT0gJ2lmcmFtZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybj99ICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGZpbmRUYWdQYXR0ZXJuID0gKGVsZW1lbnQsIGlnbm9yZSkgPT4ge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS50YWcsIG51bGwsIHRhZ05hbWUpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBjb25zdCBwYXR0ZXJuID0gY3JlYXRlUGF0dGVybigpXG4gIHBhdHRlcm4udGFnID0gdGFnTmFtZVxuICByZXR1cm4gcGF0dGVyblxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggc3BlY2lmaWMgY2hpbGQgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tOdGhDaGlsZCA9IChlbGVtZW50LCBwYXRoLCB7IGlnbm9yZSB9KSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBpZiAoY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNoaWxkUGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGNoaWxkLCBpZ25vcmUpXG4gICAgICBpZiAoIWNoaWxkUGF0dGVybikge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgICAgICBFbGVtZW50IGNvdWxkbid0IGJlIG1hdGNoZWQgdGhyb3VnaCBzdHJpY3QgaWdub3JlIHBhdHRlcm4hXG4gICAgICAgIGAsIGNoaWxkLCBpZ25vcmUsIGNoaWxkUGF0dGVybilcbiAgICAgIH1cbiAgICAgIGNoaWxkUGF0dGVybi5yZWxhdGVzID0gJ2NoaWxkJ1xuICAgICAgY2hpbGRQYXR0ZXJuLnBzZXVkbyA9IFtgbnRoLWNoaWxkKCR7aSsxfSlgXVxuICAgICAgcGF0aC51bnNoaWZ0KGNoaWxkUGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggY29udGFpbnNcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Jvb2xlYW59ICAgICAgICAgbmVzdGVkICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBjaGVja1RleHQgPSAoZWxlbWVudCwgcGF0aCwgeyBpZ25vcmUgfSwgc2VsZWN0LCB0b1N0cmluZywgbmVzdGVkKSA9PiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGNvbnN0IHRleHRDb250ZW50ID0gKG5lc3RlZCA/IGVsZW1lbnQudGV4dENvbnRlbnQgOiAoZWxlbWVudC5maXJzdENoaWxkICYmIGVsZW1lbnQuZmlyc3RDaGlsZC5ub2RlVmFsdWUpIHx8ICcnKVxuICBpZiAoIXRleHRDb250ZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBwYXR0ZXJuLnJlbGF0ZXMgPSAnY2hpbGQnXG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCB0ZXh0cyA9IHRleHRDb250ZW50XG4gICAgLnJlcGxhY2UoL1xcbisvZywgJ1xcbicpXG4gICAgLnNwbGl0KCdcXG4nKVxuICAgIC5tYXAodGV4dCA9PiB0ZXh0LnRyaW0oKSlcbiAgICAuZmlsdGVyKHRleHQgPT4gdGV4dC5sZW5ndGggPiAwKVxuXG4gIGNvbnN0IGNvbnRhaW5zID0gW11cblxuICB3aGlsZSAodGV4dHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHRleHQgPSB0ZXh0cy5zaGlmdCgpXG4gICAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS5jb250YWlucywgbnVsbCwgdGV4dCwgZGVmYXVsdElnbm9yZS5jb250YWlucykpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGNvbnRhaW5zLnB1c2goYGNvbnRhaW5zKFwiJHt0ZXh0fVwiKWApXG4gIFxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QodG9TdHJpbmcucGF0dGVybih7IC4uLnBhdHRlcm4sIHBzZXVkbzogY29udGFpbnMgfSksIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdHRlcm4ucHNldWRvID0gY29udGFpbnNcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBkZXNjZW5kYW50IHRhZ1xuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tSZWN1cnNpdmVEZXNjZW5kYW50cyA9IChlbGVtZW50LCBwYXRoLCBvcHRpb25zLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBvcHRpb25zLmlnbm9yZSlcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb25zdCBkZXNjZW5kYW50cyA9IEFycmF5LmZyb20oZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJykpXG4gIHdoaWxlIChkZXNjZW5kYW50cy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudFBhdGggPSBtYXRjaChkZXNjZW5kYW50cy5zaGlmdCgpLCB7IC4uLm9wdGlvbnMsIHJvb3Q6IGVsZW1lbnQgfSwgdHJ1ZSlcbiAgICAvLyBhdm9pZCBkZXNjZW5kYW50IHNlbGVjdG9ycyB3aXRoIG50aC1jaGlsZFxuICAgIGlmICghZGVzY2VuZGFudFBhdGguc29tZShwYXR0ZXJuID0+IHBhdHRlcm4ucHNldWRvLnNvbWUocCA9PiBwLnN0YXJ0c1dpdGgoJ250aC1jaGlsZCcpKSkpIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXR0ZXJuKHsgLi4ucGF0dGVybiwgZGVzY2VuZGFudHM6IFtkZXNjZW5kYW50UGF0aF0gfSksIHBhcmVudClcbiAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBwYXR0ZXJuLmRlc2NlbmRhbnRzID0gW2Rlc2NlbmRhbnRQYXRoXVxuICAgICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICBvcHRpb25zICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGZpbmRQYXR0ZXJuID0gKGVsZW1lbnQsIHsgcHJpb3JpdHksIGlnbm9yZSB9LCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCwgdG9TdHJpbmcpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBjaGVja0lnbm9yZSA9IChwcmVkaWNhdGUsIG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSA9PiB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGNvbnN0IGNoZWNrID0gcHJlZGljYXRlIHx8IGRlZmF1bHRQcmVkaWNhdGVcbiAgaWYgKCFjaGVjaykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVjayhuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYXRjaC5qcyIsIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbnNmb3JtYXRpb25cbiAqL1xuXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL3NlbGVjdG9yJ1xuaW1wb3J0IHsgY3JlYXRlUGF0dGVybiwgZ2V0VG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QsIHBhcnRpdGlvbiB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICogQHR5cGVkZWYge2ltcG9ydCgnLi9wYXR0ZXJuJykuUGF0dGVybn0gUGF0dGVyblxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9wYXR0ZXJuJykuVG9TdHJpbmdBcGl9IFBhdHRlcm5cbiAqL1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAgIHBhdGggICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnQgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPFBhdHRlcm4+fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3B0aW1pemUgKHBhdGgsIGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdXG4gIH1cblxuICBpZiAocGF0aFswXS5yZWxhdGVzID09PSAnY2hpbGQnKSB7XG4gICAgcGF0aFswXS5yZWxhdGVzID0gdW5kZWZpbmVkXG4gIH1cblxuICAvLyBjb252ZXJ0IHNpbmdsZSBlbnRyeSBhbmQgTm9kZUxpc3RcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gIWVsZW1lbnRzLmxlbmd0aCA/IFtlbGVtZW50c10gOiBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoIWVsZW1lbnRzLmxlbmd0aCB8fCBlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIHRvIGNvbXBhcmUgSFRNTEVsZW1lbnRzIGl0cyBuZWNlc3NhcnkgdG8gcHJvdmlkZSBhIHJlZmVyZW5jZSBvZiB0aGUgc2VsZWN0ZWQgbm9kZShzKSEgKG1pc3NpbmcgXCJlbGVtZW50c1wiKScpXG4gIH1cblxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcbiAgY29uc3QgdG9TdHJpbmcgPSBnZXRUb1N0cmluZyhvcHRpb25zKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBbb3B0aW1pemVQYXJ0KFtdLCBwYXRoWzBdLCBbXSwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpXVxuICB9XG5cbiAgdmFyIGVuZE9wdGltaXplZCA9IGZhbHNlXG4gIGlmIChwYXRoW3BhdGgubGVuZ3RoLTFdLnJlbGF0ZXMgPT09ICdjaGlsZCcpIHtcbiAgICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCBbXSwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpXG4gICAgZW5kT3B0aW1pemVkID0gdHJ1ZVxuICB9XG5cbiAgcGF0aCA9IFsuLi5wYXRoXVxuICBjb25zdCBzaG9ydGVuZWQgPSBbcGF0aC5wb3AoKV1cbiAgd2hpbGUgKHBhdGgubGVuZ3RoID4gMSkge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoLnBvcCgpXG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXRoKFsuLi5wYXRoLCAuLi5zaG9ydGVuZWRdKSlcbiAgICBjb25zdCBoYXNTYW1lUmVzdWx0ID0gbWF0Y2hlcy5sZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCwgaSkgPT4gZWxlbWVudCA9PT0gbWF0Y2hlc1tpXSlcbiAgICBpZiAoIWhhc1NhbWVSZXN1bHQpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwYXRoLCBjdXJyZW50LCBzaG9ydGVuZWQsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSlcbiAgICB9XG4gIH1cbiAgc2hvcnRlbmVkLnVuc2hpZnQocGF0aFswXSlcbiAgcGF0aCA9IHNob3J0ZW5lZFxuXG4gIC8vIG9wdGltaXplIHN0YXJ0ICsgZW5kXG4gIHBhdGhbMF0gPSBvcHRpbWl6ZVBhcnQoW10sIHBhdGhbMF0sIHBhdGguc2xpY2UoMSksIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKVxuICBpZiAoIWVuZE9wdGltaXplZCkge1xuICAgIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aC5zbGljZSgwLCAtMSksIHBhdGhbcGF0aC5sZW5ndGgtMV0sIFtdLCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZylcbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuICogT3B0aW1pemUgOmNvbnRhaW5zXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcHJlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHBvc3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IG9wdGltaXplVGV4dCA9IChwcmUsIGN1cnJlbnQsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIGNvbnN0IFtjb250YWlucywgb3RoZXJdID0gcGFydGl0aW9uKGN1cnJlbnQucHNldWRvLCAoaXRlbSkgPT4gaXRlbS5zdGFydHNXaXRoKCdjb250YWlucycpKVxuXG4gIGlmIChjb250YWlucy5sZW5ndGggPiAwICYmIHBvc3QubGVuZ3RoKSB7XG4gICAgY29uc3QgYmFzZSA9IHsgLi4uY3VycmVudCwgcHNldWRvOiBbLi4ub3RoZXIsIC4uLmNvbnRhaW5zXSB9XG4gICAgd2hpbGUgKGJhc2UucHNldWRvLmxlbmd0aCA+IG90aGVyLmxlbmd0aCkge1xuICAgICAgY29uc3Qgb3B0aW1pemVkID0gYmFzZS5wc2V1ZG8uc2xpY2UoMCwgLTEpXG4gICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKHNlbGVjdCh0b1N0cmluZy5wYXRoKFsuLi5wcmUsIHsgLi4uYmFzZSwgcHNldWRvOiBvcHRpbWl6ZWQgfSwgLi4ucG9zdF0pKSwgZWxlbWVudHMpKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBiYXNlLnBzZXVkbyA9IG9wdGltaXplZFxuICAgIH1cbiAgICByZXR1cm4gYmFzZVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgYXR0cmlidXRlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZUF0dHJpYnV0ZXMgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICAvLyByZWR1Y2UgYXR0cmlidXRlczogZmlyc3QgdHJ5IHdpdGhvdXQgdmFsdWUsIHRoZW4gcmVtb3ZpbmcgY29tcGxldGVseVxuICBpZiAoY3VycmVudC5hdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgYXR0cmlidXRlcyA9IFsuLi5jdXJyZW50LmF0dHJpYnV0ZXNdXG5cbiAgICBjb25zdCBzaW1wbGlmeSA9IChvcmlnaW5hbCwgZ2V0U2ltcGxpZmllZCkgPT4ge1xuICAgICAgbGV0IGkgPSBvcmlnaW5hbC5sZW5ndGggLSAxXG4gICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZ2V0U2ltcGxpZmllZChvcmlnaW5hbCwgaSlcbiAgICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhcbiAgICAgICAgICBzZWxlY3QodG9TdHJpbmcucGF0aChbLi4ucHJlLCB7IC4uLmN1cnJlbnQsIGF0dHJpYnV0ZXMgfSwgLi4ucG9zdF0pKSxcbiAgICAgICAgICBlbGVtZW50c1xuICAgICAgICApKSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICBpLS1cbiAgICAgICAgb3JpZ2luYWwgPSBhdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgICByZXR1cm4gb3JpZ2luYWxcbiAgICB9XG5cbiAgICBjb25zdCBzaW1wbGlmaWVkID0gc2ltcGxpZnkoYXR0cmlidXRlcywgKGF0dHJpYnV0ZXMsIGkpID0+IHtcbiAgICAgIGNvbnN0IHsgbmFtZSB9ID0gYXR0cmlidXRlc1tpXVxuICAgICAgaWYgKG5hbWUgPT09ICdpZCcpIHtcbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICAgIHJldHVybiBbLi4uYXR0cmlidXRlcy5zbGljZSgwLCBpKSwgeyBuYW1lLCB2YWx1ZTogbnVsbCB9LCAuLi5hdHRyaWJ1dGVzLnNsaWNlKGkgKyAxKV1cbiAgICB9KVxuICAgIHJldHVybiB7IC4uLmN1cnJlbnQsIGF0dHJpYnV0ZXM6IHNpbXBsaWZ5KHNpbXBsaWZpZWQsIGF0dHJpYnV0ZXMgPT4gYXR0cmlidXRlcy5zbGljZSgwLCAtMSkpIH0gICAgXG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBkZXNjZW5kYW50XG4gKlxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcHJlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHBvc3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IG9wdGltaXplRGVzY2VuZGFudCA9IChwcmUsIGN1cnJlbnQsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIC8vIHJvYnVzdG5lc3M6IGRlc2NlbmRhbnQgaW5zdGVhZCBjaGlsZCAoaGV1cmlzdGljKVxuICBpZiAoY3VycmVudC5yZWxhdGVzID09PSAnY2hpbGQnKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IHsgLi4uY3VycmVudCwgcmVsYXRlczogdW5kZWZpbmVkIH1cbiAgICBsZXQgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXRoKFsuLi5wcmUsIGRlc2NlbmRhbnQsIC4uLnBvc3RdKSlcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGFudFxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIHJlY3Vyc2l2ZSBkZXNjZW5kYW50c1xuICogXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVSZWN1cnNpdmVEZXNjZW5kYW50cyA9IChwcmUsIGN1cnJlbnQsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIGlmIChjdXJyZW50LmRlc2NlbmRhbnRzLmxlbmd0aCA+IDAgJiYgcG9zdC5sZW5ndGgpIHtcbiAgICBjb25zdCBiYXNlID0geyAuLi5jdXJyZW50LCBkZXNjZW5kYW50czogWy4uLmN1cnJlbnQuZGVzY2VuZGFudHNdIH1cbiAgICB3aGlsZSAoYmFzZS5kZXNjZW5kYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBvcHRpbWl6ZWQgPSBiYXNlLmRlc2NlbmRhbnRzLnNsaWNlKDAsIC0xKVxuICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhzZWxlY3QodG9TdHJpbmcucGF0aChbLi4ucHJlLCB7IC4uLmJhc2UsIGRlc2NlbmRhbnRzOiBvcHRpbWl6ZWQgfSwgLi4ucG9zdF0pKSwgZWxlbWVudHMpKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBiYXNlLmRlc2NlbmRhbnRzID0gb3B0aW1pemVkXG4gICAgfVxuICAgIHJldHVybiBiYXNlXG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBudGggb2YgdHlwZVxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZU50aE9mVHlwZSA9IChwcmUsIGN1cnJlbnQsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSA9PiB7XG4gIGNvbnN0IGkgPSBjdXJyZW50LnBzZXVkby5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLnN0YXJ0c1dpdGgoJ250aC1jaGlsZCcpKVxuICAvLyByb2J1c3RuZXNzOiAnbnRoLW9mLXR5cGUnIGluc3RlYWQgJ250aC1jaGlsZCcgKGhldXJpc3RpYylcbiAgaWYgKGkgPj0gMCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5wc2V1ZG9baV0ucmVwbGFjZSgvXm50aC1jaGlsZC8sICdudGgtb2YtdHlwZScpXG4gICAgY29uc3QgbnRoT2ZUeXBlID0geyAuLi5jdXJyZW50LCBwc2V1ZG86IFsuLi5jdXJyZW50LnBzZXVkby5zbGljZSgwLCBpKSwgdHlwZSwgLi4uY3VycmVudC5wc2V1ZG8uc2xpY2UoaSArIDEpXSB9XG4gICAgbGV0IHBhdHRlcm4gPSB0b1N0cmluZy5wYXRoKFsuLi5wcmUsIG50aE9mVHlwZSwgLi4ucG9zdF0pXG4gICAgbGV0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICByZXR1cm4gbnRoT2ZUeXBlXG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgY2xhc3Nlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZUNsYXNzZXMgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICAvLyBlZmZpY2llbmN5OiBjb21iaW5hdGlvbnMgb2YgY2xhc3NuYW1lIChwYXJ0aWFsIHBlcm11dGF0aW9ucylcbiAgaWYgKGN1cnJlbnQuY2xhc3Nlcy5sZW5ndGggPiAxKSB7XG4gICAgbGV0IG9wdGltaXplZCA9IGN1cnJlbnQuY2xhc3Nlcy5zbGljZSgpLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG5cbiAgICB3aGlsZSAob3B0aW1pemVkLmxlbmd0aCA+IDEpIHtcbiAgICAgIG9wdGltaXplZC5zaGlmdCgpXG4gICAgICBjb25zdCBwYXR0ZXJuID0gdG9TdHJpbmcucGF0aChbLi4ucHJlLCB7IC4uLmN1cnJlbnQsIGNsYXNzZXM6IG9wdGltaXplZCB9LCAuLi5wb3N0XSlcbiAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoc2VsZWN0KHBhdHRlcm4pLCBlbGVtZW50cykpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQuY2xhc3NlcyA9IG9wdGltaXplZFxuICAgIH1cblxuICAgIG9wdGltaXplZCA9IGN1cnJlbnQuY2xhc3Nlc1xuXG4gICAgaWYgKG9wdGltaXplZC5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCBiYXNlID0gY3JlYXRlUGF0dGVybih7IGNsYXNzZXM6IG9wdGltaXplZCB9KVxuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXRoKFsuLi5wcmUsIGJhc2VdKSlcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVmZXJlbmNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGNyZWF0ZVBhdHRlcm4oeyB0YWc6IHJlZmVyZW5jZS50YWdOYW1lIH0pXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSB0b1N0cmluZy5wYXRoKFsuLi5wcmUsIGRlc2NyaXB0aW9uLCAuLi5wb3N0XSlcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbmNvbnN0IG9wdGltaXplcnMgPSBbXG4gIG9wdGltaXplVGV4dCxcbiAgb3B0aW1pemVBdHRyaWJ1dGVzLFxuICBvcHRpbWl6ZURlc2NlbmRhbnQsXG4gIG9wdGltaXplUmVjdXJzaXZlRGVzY2VuZGFudHMsXG4gIG9wdGltaXplTnRoT2ZUeXBlLFxuICBvcHRpbWl6ZUNsYXNzZXMsXG5dXG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZVBhcnQgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT5cbiAgb3B0aW1pemVycy5yZWR1Y2UoKGFjYywgb3B0aW1pemVyKSA9PiBvcHRpbWl6ZXIocHJlLCBhY2MsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSwgY3VycmVudClcblxuLyoqXG4gKiBFdmFsdWF0ZSBtYXRjaGVzIHdpdGggZXhwZWN0ZWQgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBtYXRjaGVzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBjb21wYXJlUmVzdWx0cyA9IChtYXRjaGVzLCBlbGVtZW50cykgPT4ge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbWF0Y2hlc1xuICByZXR1cm4gbGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vcHRpbWl6ZS5qcyIsIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5IHNlbGVjdG9yIHRvIGFjY2VzcyB0aGUgc2VsZWN0ZWQgRE9NIGVsZW1lbnQocykuXG4gKiBGb3IgbG9uZ2V2aXR5IGl0IGFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcy5cbiAqL1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCwgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCB7IGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL3NlbGVjdG9yJ1xuaW1wb3J0IHsgY3JlYXRlUGF0dGVybiwgZ2V0VG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5cbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IFtyb290XSAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgcm9vdCBlbGVtZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uIHwgQXJyYXkuPEhUTUxFbGVtZW50Pn0gW3NraXBdICBTcGVjaWZ5IGVsZW1lbnRzIHRvIHNraXBcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IFtwcmlvcml0eV0gICAgICAgICAgICAgIE9yZGVyIG9mIGF0dHJpYnV0ZSBwcm9jZXNzaW5nXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsIGZ1bmN0aW9uIHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbn0gW2lnbm9yZV0gRGVmaW5lIHBhdHRlcm5zIHdoaWNoIHNob3VsZG4ndCBiZSBpbmNsdWRlZFxuICogQHByb3BlcnR5IHsoJ2Nzcyd8J3hwYXRoJ3wnanF1ZXJ5Jyl9IFtmb3JtYXRdICAgICAgT3V0cHV0IGZvcm1hdCAgICBcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqL1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPFBhdHRlcm4+fSAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNpbmdsZVNlbGVjdG9yUGF0aCA9IChlbGVtZW50LCBvcHRpb25zID0ge30pID0+IHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IHBhdGggPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWRQYXRoID0gb3B0aW1pemUocGF0aCwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICAke3BhdGh9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZFBhdGh9XG4gIC8vIGApXG5cbiAgcmV0dXJuIG9wdGltaXplZFBhdGhcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBkZXNjZW5kYW50cyBmcm9tIGFuIGFuY2VzdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdH0gZWxlbWVudHMgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48UGF0dGVybj59ICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZ2V0TXVsdGlTZWxlY3RvclBhdGggPSAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIG9ubHkgYW4gQXJyYXkgb2YgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGlzIHN1cHBvcnRlZCEnKVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG4gIGNvbnN0IHRvU3RyaW5nID0gZ2V0VG9TdHJpbmcob3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclBhdGggPSBtYXRjaChhbmNlc3Rvciwgb3B0aW9ucylcblxuICAvLyBUT0RPOiBjb25zaWRlciB1c2FnZSBvZiBtdWx0aXBsZSBzZWxlY3RvcnMgKyBwYXJlbnQtY2hpbGQgcmVsYXRpb24gKyBjaGVjayBmb3IgcGFydCByZWR1bmRhbmN5XG4gIGNvbnN0IGNvbW1vblBhdGggPSBnZXRDb21tb25QYXRoKGVsZW1lbnRzKVxuICBjb25zdCBkZXNjZW5kYW50UGF0dGVybiA9IGNvbW1vblBhdGhbMF1cblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBvcHRpbWl6ZShbLi4uYW5jZXN0b3JQYXRoLCBkZXNjZW5kYW50UGF0dGVybl0sIGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3Rvck1hdGNoZXMgPSBjb252ZXJ0Tm9kZUxpc3Qoc2VsZWN0KHRvU3RyaW5nLnBhdGgoc2VsZWN0b3JQYXRoKSkpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhbid0IGJlIGVmZmljaWVudGx5IG1hcHBlZC5cbiAgICAgIEl0cyBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhXG4gICAgYCwgZWxlbWVudHMpXG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3JQYXRoXG59XG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgZ2V0Q29tbW9uUGF0aCA9IChlbGVtZW50cykgPT4ge1xuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICByZXR1cm4gW1xuICAgIGNyZWF0ZVBhdHRlcm4oe1xuICAgICAgdGFnLFxuICAgICAgY2xhc3NlczogY2xhc3NlcyB8fCBbXSxcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMgPyBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKG5hbWUpID0+ICh7XG4gICAgICAgIG5hbWU6IGVzY2FwZVZhbHVlKG5hbWUpLFxuICAgICAgICB2YWx1ZTogZXNjYXBlVmFsdWUoYXR0cmlidXRlc1tuYW1lXSlcbiAgICAgIH0pKSA6IFtdXG4gICAgfSlcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgcGF0aCA9IChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpXG4gICAgPyBnZXRNdWx0aVNlbGVjdG9yUGF0aChpbnB1dCwgb3B0aW9ucylcbiAgICA6IGdldFNpbmdsZVNlbGVjdG9yUGF0aChpbnB1dCwgb3B0aW9ucylcblxuICByZXR1cm4gZ2V0VG9TdHJpbmcob3B0aW9ucykucGF0aChwYXRoKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdC5qcyIsIi8qIVxuICogU2l6emxlIENTUyBTZWxlY3RvciBFbmdpbmUgdjIuMy42XG4gKiBodHRwczovL3NpenpsZWpzLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vanMuZm91bmRhdGlvbi9cbiAqXG4gKiBEYXRlOiAyMDIxLTAyLTE2XG4gKi9cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcbnZhciBpLFxuXHRzdXBwb3J0LFxuXHRFeHByLFxuXHRnZXRUZXh0LFxuXHRpc1hNTCxcblx0dG9rZW5pemUsXG5cdGNvbXBpbGUsXG5cdHNlbGVjdCxcblx0b3V0ZXJtb3N0Q29udGV4dCxcblx0c29ydElucHV0LFxuXHRoYXNEdXBsaWNhdGUsXG5cblx0Ly8gTG9jYWwgZG9jdW1lbnQgdmFyc1xuXHRzZXREb2N1bWVudCxcblx0ZG9jdW1lbnQsXG5cdGRvY0VsZW0sXG5cdGRvY3VtZW50SXNIVE1MLFxuXHRyYnVnZ3lRU0EsXG5cdHJidWdneU1hdGNoZXMsXG5cdG1hdGNoZXMsXG5cdGNvbnRhaW5zLFxuXG5cdC8vIEluc3RhbmNlLXNwZWNpZmljIGRhdGFcblx0ZXhwYW5kbyA9IFwic2l6emxlXCIgKyAxICogbmV3IERhdGUoKSxcblx0cHJlZmVycmVkRG9jID0gd2luZG93LmRvY3VtZW50LFxuXHRkaXJydW5zID0gMCxcblx0ZG9uZSA9IDAsXG5cdGNsYXNzQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHR0b2tlbkNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0Y29tcGlsZXJDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRzb3J0T3JkZXIgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gMDtcblx0fSxcblxuXHQvLyBJbnN0YW5jZSBtZXRob2RzXG5cdGhhc093biA9ICgge30gKS5oYXNPd25Qcm9wZXJ0eSxcblx0YXJyID0gW10sXG5cdHBvcCA9IGFyci5wb3AsXG5cdHB1c2hOYXRpdmUgPSBhcnIucHVzaCxcblx0cHVzaCA9IGFyci5wdXNoLFxuXHRzbGljZSA9IGFyci5zbGljZSxcblxuXHQvLyBVc2UgYSBzdHJpcHBlZC1kb3duIGluZGV4T2YgYXMgaXQncyBmYXN0ZXIgdGhhbiBuYXRpdmVcblx0Ly8gaHR0cHM6Ly9qc3BlcmYuY29tL3Rob3ItaW5kZXhvZi12cy1mb3IvNVxuXHRpbmRleE9mID0gZnVuY3Rpb24oIGxpc3QsIGVsZW0gKSB7XG5cdFx0dmFyIGkgPSAwLFxuXHRcdFx0bGVuID0gbGlzdC5sZW5ndGg7XG5cdFx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRpZiAoIGxpc3RbIGkgXSA9PT0gZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fSxcblxuXHRib29sZWFucyA9IFwiY2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufFwiICtcblx0XHRcImlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWRcIixcblxuXHQvLyBSZWd1bGFyIGV4cHJlc3Npb25zXG5cblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1zZWxlY3RvcnMvI3doaXRlc3BhY2Vcblx0d2hpdGVzcGFjZSA9IFwiW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZl1cIixcblxuXHQvLyBodHRwczovL3d3dy53My5vcmcvVFIvY3NzLXN5bnRheC0zLyNpZGVudC10b2tlbi1kaWFncmFtXG5cdGlkZW50aWZpZXIgPSBcIig/OlxcXFxcXFxcW1xcXFxkYS1mQS1GXXsxLDZ9XCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIj98XFxcXFxcXFxbXlxcXFxyXFxcXG5cXFxcZl18W1xcXFx3LV18W15cXDAtXFxcXHg3Zl0pK1wiLFxuXG5cdC8vIEF0dHJpYnV0ZSBzZWxlY3RvcnM6IGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jYXR0cmlidXRlLXNlbGVjdG9yc1xuXHRhdHRyaWJ1dGVzID0gXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKihcIiArIGlkZW50aWZpZXIgKyBcIikoPzpcIiArIHdoaXRlc3BhY2UgK1xuXG5cdFx0Ly8gT3BlcmF0b3IgKGNhcHR1cmUgMilcblx0XHRcIiooWypeJHwhfl0/PSlcIiArIHdoaXRlc3BhY2UgK1xuXG5cdFx0Ly8gXCJBdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzIFtjYXB0dXJlIDVdXG5cdFx0Ly8gb3Igc3RyaW5ncyBbY2FwdHVyZSAzIG9yIGNhcHR1cmUgNF1cIlxuXHRcdFwiKig/OicoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcInwoXCIgKyBpZGVudGlmaWVyICsgXCIpKXwpXCIgK1xuXHRcdHdoaXRlc3BhY2UgKyBcIipcXFxcXVwiLFxuXG5cdHBzZXVkb3MgPSBcIjooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XFxcXCgoXCIgK1xuXG5cdFx0Ly8gVG8gcmVkdWNlIHRoZSBudW1iZXIgb2Ygc2VsZWN0b3JzIG5lZWRpbmcgdG9rZW5pemUgaW4gdGhlIHByZUZpbHRlciwgcHJlZmVyIGFyZ3VtZW50czpcblx0XHQvLyAxLiBxdW90ZWQgKGNhcHR1cmUgMzsgY2FwdHVyZSA0IG9yIGNhcHR1cmUgNSlcblx0XHRcIignKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCIpfFwiICtcblxuXHRcdC8vIDIuIHNpbXBsZSAoY2FwdHVyZSA2KVxuXHRcdFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiICsgYXR0cmlidXRlcyArIFwiKSopfFwiICtcblxuXHRcdC8vIDMuIGFueXRoaW5nIGVsc2UgKGNhcHR1cmUgMilcblx0XHRcIi4qXCIgK1xuXHRcdFwiKVxcXFwpfClcIixcblxuXHQvLyBMZWFkaW5nIGFuZCBub24tZXNjYXBlZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBjYXB0dXJpbmcgc29tZSBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXJzIHByZWNlZGluZyB0aGUgbGF0dGVyXG5cdHJ3aGl0ZXNwYWNlID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwiK1wiLCBcImdcIiApLFxuXHRydHJpbSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiK3woKD86XnxbXlxcXFxcXFxcXSkoPzpcXFxcXFxcXC4pKilcIiArXG5cdFx0d2hpdGVzcGFjZSArIFwiKyRcIiwgXCJnXCIgKSxcblxuXHRyY29tbWEgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiosXCIgKyB3aGl0ZXNwYWNlICsgXCIqXCIgKSxcblx0cmNvbWJpbmF0b3JzID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqKFs+K35dfFwiICsgd2hpdGVzcGFjZSArIFwiKVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCIqXCIgKSxcblx0cmRlc2NlbmQgPSBuZXcgUmVnRXhwKCB3aGl0ZXNwYWNlICsgXCJ8PlwiICksXG5cblx0cnBzZXVkbyA9IG5ldyBSZWdFeHAoIHBzZXVkb3MgKSxcblx0cmlkZW50aWZpZXIgPSBuZXcgUmVnRXhwKCBcIl5cIiArIGlkZW50aWZpZXIgKyBcIiRcIiApLFxuXG5cdG1hdGNoRXhwciA9IHtcblx0XHRcIklEXCI6IG5ldyBSZWdFeHAoIFwiXiMoXCIgKyBpZGVudGlmaWVyICsgXCIpXCIgKSxcblx0XHRcIkNMQVNTXCI6IG5ldyBSZWdFeHAoIFwiXlxcXFwuKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJUQUdcIjogbmV3IFJlZ0V4cCggXCJeKFwiICsgaWRlbnRpZmllciArIFwifFsqXSlcIiApLFxuXHRcdFwiQVRUUlwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIGF0dHJpYnV0ZXMgKSxcblx0XHRcIlBTRVVET1wiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHBzZXVkb3MgKSxcblx0XHRcIkNISUxEXCI6IG5ldyBSZWdFeHAoIFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIiArXG5cdFx0XHR3aGl0ZXNwYWNlICsgXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIiArIHdoaXRlc3BhY2UgKyBcIiooPzooWystXXwpXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKihcXFxcZCspfCkpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KVwiLCBcImlcIiApLFxuXHRcdFwiYm9vbFwiOiBuZXcgUmVnRXhwKCBcIl4oPzpcIiArIGJvb2xlYW5zICsgXCIpJFwiLCBcImlcIiApLFxuXG5cdFx0Ly8gRm9yIHVzZSBpbiBsaWJyYXJpZXMgaW1wbGVtZW50aW5nIC5pcygpXG5cdFx0Ly8gV2UgdXNlIHRoaXMgZm9yIFBPUyBtYXRjaGluZyBpbiBgc2VsZWN0YFxuXHRcdFwibmVlZHNDb250ZXh0XCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIipbPit+XXw6KGV2ZW58b2RkfGVxfGd0fGx0fG50aHxmaXJzdHxsYXN0KSg/OlxcXFwoXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKigoPzotXFxcXGQpP1xcXFxkKilcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpKD89W14tXXwkKVwiLCBcImlcIiApXG5cdH0sXG5cblx0cmh0bWwgPSAvSFRNTCQvaSxcblx0cmlucHV0cyA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksXG5cdHJoZWFkZXIgPSAvXmhcXGQkL2ksXG5cblx0cm5hdGl2ZSA9IC9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXG5cblx0Ly8gRWFzaWx5LXBhcnNlYWJsZS9yZXRyaWV2YWJsZSBJRCBvciBUQUcgb3IgQ0xBU1Mgc2VsZWN0b3JzXG5cdHJxdWlja0V4cHIgPSAvXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyxcblxuXHRyc2libGluZyA9IC9bK35dLyxcblxuXHQvLyBDU1MgZXNjYXBlc1xuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyMS9zeW5kYXRhLmh0bWwjZXNjYXBlZC1jaGFyYWN0ZXJzXG5cdHJ1bmVzY2FwZSA9IG5ldyBSZWdFeHAoIFwiXFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIiArIHdoaXRlc3BhY2UgKyBcIj98XFxcXFxcXFwoW15cXFxcclxcXFxuXFxcXGZdKVwiLCBcImdcIiApLFxuXHRmdW5lc2NhcGUgPSBmdW5jdGlvbiggZXNjYXBlLCBub25IZXggKSB7XG5cdFx0dmFyIGhpZ2ggPSBcIjB4XCIgKyBlc2NhcGUuc2xpY2UoIDEgKSAtIDB4MTAwMDA7XG5cblx0XHRyZXR1cm4gbm9uSGV4ID9cblxuXHRcdFx0Ly8gU3RyaXAgdGhlIGJhY2tzbGFzaCBwcmVmaXggZnJvbSBhIG5vbi1oZXggZXNjYXBlIHNlcXVlbmNlXG5cdFx0XHRub25IZXggOlxuXG5cdFx0XHQvLyBSZXBsYWNlIGEgaGV4YWRlY2ltYWwgZXNjYXBlIHNlcXVlbmNlIHdpdGggdGhlIGVuY29kZWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSA8PTExK1xuXHRcdFx0Ly8gRm9yIHZhbHVlcyBvdXRzaWRlIHRoZSBCYXNpYyBNdWx0aWxpbmd1YWwgUGxhbmUgKEJNUCksIG1hbnVhbGx5IGNvbnN0cnVjdCBhXG5cdFx0XHQvLyBzdXJyb2dhdGUgcGFpclxuXHRcdFx0aGlnaCA8IDAgP1xuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoICsgMHgxMDAwMCApIDpcblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCA+PiAxMCB8IDB4RDgwMCwgaGlnaCAmIDB4M0ZGIHwgMHhEQzAwICk7XG5cdH0sXG5cblx0Ly8gQ1NTIHN0cmluZy9pZGVudGlmaWVyIHNlcmlhbGl6YXRpb25cblx0Ly8gaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzc29tLyNjb21tb24tc2VyaWFsaXppbmctaWRpb21zXG5cdHJjc3Nlc2NhcGUgPSAvKFtcXDAtXFx4MWZcXHg3Zl18Xi0/XFxkKXxeLSR8W15cXDAtXFx4MWZcXHg3Zi1cXHVGRkZGXFx3LV0vZyxcblx0ZmNzc2VzY2FwZSA9IGZ1bmN0aW9uKCBjaCwgYXNDb2RlUG9pbnQgKSB7XG5cdFx0aWYgKCBhc0NvZGVQb2ludCApIHtcblxuXHRcdFx0Ly8gVSswMDAwIE5VTEwgYmVjb21lcyBVK0ZGRkQgUkVQTEFDRU1FTlQgQ0hBUkFDVEVSXG5cdFx0XHRpZiAoIGNoID09PSBcIlxcMFwiICkge1xuXHRcdFx0XHRyZXR1cm4gXCJcXHVGRkZEXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbnRyb2wgY2hhcmFjdGVycyBhbmQgKGRlcGVuZGVudCB1cG9uIHBvc2l0aW9uKSBudW1iZXJzIGdldCBlc2NhcGVkIGFzIGNvZGUgcG9pbnRzXG5cdFx0XHRyZXR1cm4gY2guc2xpY2UoIDAsIC0xICkgKyBcIlxcXFxcIiArXG5cdFx0XHRcdGNoLmNoYXJDb2RlQXQoIGNoLmxlbmd0aCAtIDEgKS50b1N0cmluZyggMTYgKSArIFwiIFwiO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyIHBvdGVudGlhbGx5LXNwZWNpYWwgQVNDSUkgY2hhcmFjdGVycyBnZXQgYmFja3NsYXNoLWVzY2FwZWRcblx0XHRyZXR1cm4gXCJcXFxcXCIgKyBjaDtcblx0fSxcblxuXHQvLyBVc2VkIGZvciBpZnJhbWVzXG5cdC8vIFNlZSBzZXREb2N1bWVudCgpXG5cdC8vIFJlbW92aW5nIHRoZSBmdW5jdGlvbiB3cmFwcGVyIGNhdXNlcyBhIFwiUGVybWlzc2lvbiBEZW5pZWRcIlxuXHQvLyBlcnJvciBpbiBJRVxuXHR1bmxvYWRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0c2V0RG9jdW1lbnQoKTtcblx0fSxcblxuXHRpbkRpc2FibGVkRmllbGRzZXQgPSBhZGRDb21iaW5hdG9yKFxuXHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IHRydWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImZpZWxkc2V0XCI7XG5cdFx0fSxcblx0XHR7IGRpcjogXCJwYXJlbnROb2RlXCIsIG5leHQ6IFwibGVnZW5kXCIgfVxuXHQpO1xuXG4vLyBPcHRpbWl6ZSBmb3IgcHVzaC5hcHBseSggXywgTm9kZUxpc3QgKVxudHJ5IHtcblx0cHVzaC5hcHBseShcblx0XHQoIGFyciA9IHNsaWNlLmNhbGwoIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzICkgKSxcblx0XHRwcmVmZXJyZWREb2MuY2hpbGROb2Rlc1xuXHQpO1xuXG5cdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4wXG5cdC8vIERldGVjdCBzaWxlbnRseSBmYWlsaW5nIHB1c2guYXBwbHlcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRhcnJbIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzLmxlbmd0aCBdLm5vZGVUeXBlO1xufSBjYXRjaCAoIGUgKSB7XG5cdHB1c2ggPSB7IGFwcGx5OiBhcnIubGVuZ3RoID9cblxuXHRcdC8vIExldmVyYWdlIHNsaWNlIGlmIHBvc3NpYmxlXG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0cHVzaE5hdGl2ZS5hcHBseSggdGFyZ2V0LCBzbGljZS5jYWxsKCBlbHMgKSApO1xuXHRcdH0gOlxuXG5cdFx0Ly8gU3VwcG9ydDogSUU8OVxuXHRcdC8vIE90aGVyd2lzZSBhcHBlbmQgZGlyZWN0bHlcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHR2YXIgaiA9IHRhcmdldC5sZW5ndGgsXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHQvLyBDYW4ndCB0cnVzdCBOb2RlTGlzdC5sZW5ndGhcblx0XHRcdHdoaWxlICggKCB0YXJnZXRbIGorKyBdID0gZWxzWyBpKysgXSApICkge31cblx0XHRcdHRhcmdldC5sZW5ndGggPSBqIC0gMTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBtLCBpLCBlbGVtLCBuaWQsIG1hdGNoLCBncm91cHMsIG5ld1NlbGVjdG9yLFxuXHRcdG5ld0NvbnRleHQgPSBjb250ZXh0ICYmIGNvbnRleHQub3duZXJEb2N1bWVudCxcblxuXHRcdC8vIG5vZGVUeXBlIGRlZmF1bHRzIHRvIDksIHNpbmNlIGNvbnRleHQgZGVmYXVsdHMgdG8gZG9jdW1lbnRcblx0XHRub2RlVHlwZSA9IGNvbnRleHQgPyBjb250ZXh0Lm5vZGVUeXBlIDogOTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBSZXR1cm4gZWFybHkgZnJvbSBjYWxscyB3aXRoIGludmFsaWQgc2VsZWN0b3Igb3IgY29udGV4dFxuXHRpZiAoIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiB8fCAhc2VsZWN0b3IgfHxcblx0XHRub2RlVHlwZSAhPT0gMSAmJiBub2RlVHlwZSAhPT0gOSAmJiBub2RlVHlwZSAhPT0gMTEgKSB7XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8vIFRyeSB0byBzaG9ydGN1dCBmaW5kIG9wZXJhdGlvbnMgKGFzIG9wcG9zZWQgdG8gZmlsdGVycykgaW4gSFRNTCBkb2N1bWVudHNcblx0aWYgKCAhc2VlZCApIHtcblx0XHRzZXREb2N1bWVudCggY29udGV4dCApO1xuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0aWYgKCBkb2N1bWVudElzSFRNTCApIHtcblxuXHRcdFx0Ly8gSWYgdGhlIHNlbGVjdG9yIGlzIHN1ZmZpY2llbnRseSBzaW1wbGUsIHRyeSB1c2luZyBhIFwiZ2V0KkJ5KlwiIERPTSBtZXRob2Rcblx0XHRcdC8vIChleGNlcHRpbmcgRG9jdW1lbnRGcmFnbWVudCBjb250ZXh0LCB3aGVyZSB0aGUgbWV0aG9kcyBkb24ndCBleGlzdClcblx0XHRcdGlmICggbm9kZVR5cGUgIT09IDExICYmICggbWF0Y2ggPSBycXVpY2tFeHByLmV4ZWMoIHNlbGVjdG9yICkgKSApIHtcblxuXHRcdFx0XHQvLyBJRCBzZWxlY3RvclxuXHRcdFx0XHRpZiAoICggbSA9IG1hdGNoWyAxIF0gKSApIHtcblxuXHRcdFx0XHRcdC8vIERvY3VtZW50IGNvbnRleHRcblx0XHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSwgT3BlcmEsIFdlYmtpdFxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBpZGVudGlmeSB2ZXJzaW9uc1xuXHRcdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCA9PT0gbSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBFbGVtZW50IGNvbnRleHRcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSwgT3BlcmEsIFdlYmtpdFxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdC8vIGdldEVsZW1lbnRCeUlkIGNhbiBtYXRjaCBlbGVtZW50cyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdGlmICggbmV3Q29udGV4dCAmJiAoIGVsZW0gPSBuZXdDb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkgKSAmJlxuXHRcdFx0XHRcdFx0XHRjb250YWlucyggY29udGV4dCwgZWxlbSApICYmXG5cdFx0XHRcdFx0XHRcdGVsZW0uaWQgPT09IG0gKSB7XG5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUeXBlIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWyAyIF0gKSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggc2VsZWN0b3IgKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHRcdC8vIENsYXNzIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoICggbSA9IG1hdGNoWyAzIF0gKSAmJiBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiZcblx0XHRcdFx0XHRjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKSB7XG5cblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG0gKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRha2UgYWR2YW50YWdlIG9mIHF1ZXJ5U2VsZWN0b3JBbGxcblx0XHRcdGlmICggc3VwcG9ydC5xc2EgJiZcblx0XHRcdFx0IW5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXSAmJlxuXHRcdFx0XHQoICFyYnVnZ3lRU0EgfHwgIXJidWdneVFTQS50ZXN0KCBzZWxlY3RvciApICkgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA4IG9ubHlcblx0XHRcdFx0Ly8gRXhjbHVkZSBvYmplY3QgZWxlbWVudHNcblx0XHRcdFx0KCBub2RlVHlwZSAhPT0gMSB8fCBjb250ZXh0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwib2JqZWN0XCIgKSApIHtcblxuXHRcdFx0XHRuZXdTZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRuZXdDb250ZXh0ID0gY29udGV4dDtcblxuXHRcdFx0XHQvLyBxU0EgY29uc2lkZXJzIGVsZW1lbnRzIG91dHNpZGUgYSBzY29waW5nIHJvb3Qgd2hlbiBldmFsdWF0aW5nIGNoaWxkIG9yXG5cdFx0XHRcdC8vIGRlc2NlbmRhbnQgY29tYmluYXRvcnMsIHdoaWNoIGlzIG5vdCB3aGF0IHdlIHdhbnQuXG5cdFx0XHRcdC8vIEluIHN1Y2ggY2FzZXMsIHdlIHdvcmsgYXJvdW5kIHRoZSBiZWhhdmlvciBieSBwcmVmaXhpbmcgZXZlcnkgc2VsZWN0b3IgaW4gdGhlXG5cdFx0XHRcdC8vIGxpc3Qgd2l0aCBhbiBJRCBzZWxlY3RvciByZWZlcmVuY2luZyB0aGUgc2NvcGUgY29udGV4dC5cblx0XHRcdFx0Ly8gVGhlIHRlY2huaXF1ZSBoYXMgdG8gYmUgdXNlZCBhcyB3ZWxsIHdoZW4gYSBsZWFkaW5nIGNvbWJpbmF0b3IgaXMgdXNlZFxuXHRcdFx0XHQvLyBhcyBzdWNoIHNlbGVjdG9ycyBhcmUgbm90IHJlY29nbml6ZWQgYnkgcXVlcnlTZWxlY3RvckFsbC5cblx0XHRcdFx0Ly8gVGhhbmtzIHRvIEFuZHJldyBEdXBvbnQgZm9yIHRoaXMgdGVjaG5pcXVlLlxuXHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0KCByZGVzY2VuZC50ZXN0KCBzZWxlY3RvciApIHx8IHJjb21iaW5hdG9ycy50ZXN0KCBzZWxlY3RvciApICkgKSB7XG5cblx0XHRcdFx0XHQvLyBFeHBhbmQgY29udGV4dCBmb3Igc2libGluZyBzZWxlY3RvcnNcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHQ7XG5cblx0XHRcdFx0XHQvLyBXZSBjYW4gdXNlIDpzY29wZSBpbnN0ZWFkIG9mIHRoZSBJRCBoYWNrIGlmIHRoZSBicm93c2VyXG5cdFx0XHRcdFx0Ly8gc3VwcG9ydHMgaXQgJiBpZiB3ZSdyZSBub3QgY2hhbmdpbmcgdGhlIGNvbnRleHQuXG5cdFx0XHRcdFx0aWYgKCBuZXdDb250ZXh0ICE9PSBjb250ZXh0IHx8ICFzdXBwb3J0LnNjb3BlICkge1xuXG5cdFx0XHRcdFx0XHQvLyBDYXB0dXJlIHRoZSBjb250ZXh0IElELCBzZXR0aW5nIGl0IGZpcnN0IGlmIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFx0aWYgKCAoIG5pZCA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKCBcImlkXCIgKSApICkge1xuXHRcdFx0XHRcdFx0XHRuaWQgPSBuaWQucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29udGV4dC5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgKCBuaWQgPSBleHBhbmRvICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBQcmVmaXggZXZlcnkgc2VsZWN0b3IgaW4gdGhlIGxpc3Rcblx0XHRcdFx0XHRncm91cHMgPSB0b2tlbml6ZSggc2VsZWN0b3IgKTtcblx0XHRcdFx0XHRpID0gZ3JvdXBzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGdyb3Vwc1sgaSBdID0gKCBuaWQgPyBcIiNcIiArIG5pZCA6IFwiOnNjb3BlXCIgKSArIFwiIFwiICtcblx0XHRcdFx0XHRcdFx0dG9TZWxlY3RvciggZ3JvdXBzWyBpIF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bmV3U2VsZWN0b3IgPSBncm91cHMuam9pbiggXCIsXCIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cyxcblx0XHRcdFx0XHRcdG5ld0NvbnRleHQucXVlcnlTZWxlY3RvckFsbCggbmV3U2VsZWN0b3IgKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH0gY2F0Y2ggKCBxc2FFcnJvciApIHtcblx0XHRcdFx0XHRub25uYXRpdmVTZWxlY3RvckNhY2hlKCBzZWxlY3RvciwgdHJ1ZSApO1xuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmICggbmlkID09PSBleHBhbmRvICkge1xuXHRcdFx0XHRcdFx0Y29udGV4dC5yZW1vdmVBdHRyaWJ1dGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEFsbCBvdGhlcnNcblx0cmV0dXJuIHNlbGVjdCggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGtleS12YWx1ZSBjYWNoZXMgb2YgbGltaXRlZCBzaXplXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oc3RyaW5nLCBvYmplY3QpfSBSZXR1cm5zIHRoZSBPYmplY3QgZGF0YSBhZnRlciBzdG9yaW5nIGl0IG9uIGl0c2VsZiB3aXRoXG4gKlx0cHJvcGVydHkgbmFtZSB0aGUgKHNwYWNlLXN1ZmZpeGVkKSBzdHJpbmcgYW5kIChpZiB0aGUgY2FjaGUgaXMgbGFyZ2VyIHRoYW4gRXhwci5jYWNoZUxlbmd0aClcbiAqXHRkZWxldGluZyB0aGUgb2xkZXN0IGVudHJ5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNhY2hlKCkge1xuXHR2YXIga2V5cyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGNhY2hlKCBrZXksIHZhbHVlICkge1xuXG5cdFx0Ly8gVXNlIChrZXkgKyBcIiBcIikgdG8gYXZvaWQgY29sbGlzaW9uIHdpdGggbmF0aXZlIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChzZWUgSXNzdWUgIzE1Nylcblx0XHRpZiAoIGtleXMucHVzaCgga2V5ICsgXCIgXCIgKSA+IEV4cHIuY2FjaGVMZW5ndGggKSB7XG5cblx0XHRcdC8vIE9ubHkga2VlcCB0aGUgbW9zdCByZWNlbnQgZW50cmllc1xuXHRcdFx0ZGVsZXRlIGNhY2hlWyBrZXlzLnNoaWZ0KCkgXTtcblx0XHR9XG5cdFx0cmV0dXJuICggY2FjaGVbIGtleSArIFwiIFwiIF0gPSB2YWx1ZSApO1xuXHR9XG5cdHJldHVybiBjYWNoZTtcbn1cblxuLyoqXG4gKiBNYXJrIGEgZnVuY3Rpb24gZm9yIHNwZWNpYWwgdXNlIGJ5IFNpenpsZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIG1hcmtcbiAqL1xuZnVuY3Rpb24gbWFya0Z1bmN0aW9uKCBmbiApIHtcblx0Zm5bIGV4cGFuZG8gXSA9IHRydWU7XG5cdHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBTdXBwb3J0IHRlc3RpbmcgdXNpbmcgYW4gZWxlbWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gUGFzc2VkIHRoZSBjcmVhdGVkIGVsZW1lbnQgYW5kIHJldHVybnMgYSBib29sZWFuIHJlc3VsdFxuICovXG5mdW5jdGlvbiBhc3NlcnQoIGZuICkge1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImZpZWxkc2V0XCIgKTtcblxuXHR0cnkge1xuXHRcdHJldHVybiAhIWZuKCBlbCApO1xuXHR9IGNhdGNoICggZSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZmluYWxseSB7XG5cblx0XHQvLyBSZW1vdmUgZnJvbSBpdHMgcGFyZW50IGJ5IGRlZmF1bHRcblx0XHRpZiAoIGVsLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBlbCApO1xuXHRcdH1cblxuXHRcdC8vIHJlbGVhc2UgbWVtb3J5IGluIElFXG5cdFx0ZWwgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgc2FtZSBoYW5kbGVyIGZvciBhbGwgb2YgdGhlIHNwZWNpZmllZCBhdHRyc1xuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJzIFBpcGUtc2VwYXJhdGVkIGxpc3Qgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKi9cbmZ1bmN0aW9uIGFkZEhhbmRsZSggYXR0cnMsIGhhbmRsZXIgKSB7XG5cdHZhciBhcnIgPSBhdHRycy5zcGxpdCggXCJ8XCIgKSxcblx0XHRpID0gYXJyLmxlbmd0aDtcblxuXHR3aGlsZSAoIGktLSApIHtcblx0XHRFeHByLmF0dHJIYW5kbGVbIGFyclsgaSBdIF0gPSBoYW5kbGVyO1xuXHR9XG59XG5cbi8qKlxuICogQ2hlY2tzIGRvY3VtZW50IG9yZGVyIG9mIHR3byBzaWJsaW5nc1xuICogQHBhcmFtIHtFbGVtZW50fSBhXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFJldHVybnMgbGVzcyB0aGFuIDAgaWYgYSBwcmVjZWRlcyBiLCBncmVhdGVyIHRoYW4gMCBpZiBhIGZvbGxvd3MgYlxuICovXG5mdW5jdGlvbiBzaWJsaW5nQ2hlY2soIGEsIGIgKSB7XG5cdHZhciBjdXIgPSBiICYmIGEsXG5cdFx0ZGlmZiA9IGN1ciAmJiBhLm5vZGVUeXBlID09PSAxICYmIGIubm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdGEuc291cmNlSW5kZXggLSBiLnNvdXJjZUluZGV4O1xuXG5cdC8vIFVzZSBJRSBzb3VyY2VJbmRleCBpZiBhdmFpbGFibGUgb24gYm90aCBub2Rlc1xuXHRpZiAoIGRpZmYgKSB7XG5cdFx0cmV0dXJuIGRpZmY7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBiIGZvbGxvd3MgYVxuXHRpZiAoIGN1ciApIHtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLm5leHRTaWJsaW5nICkgKSB7XG5cdFx0XHRpZiAoIGN1ciA9PT0gYiApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBhID8gMSA6IC0xO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgaW5wdXQgdHlwZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0UHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBidXR0b25zXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Qc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gKCBuYW1lID09PSBcImlucHV0XCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIiApICYmIGVsZW0udHlwZSA9PT0gdHlwZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIDplbmFibGVkLzpkaXNhYmxlZFxuICogQHBhcmFtIHtCb29sZWFufSBkaXNhYmxlZCB0cnVlIGZvciA6ZGlzYWJsZWQ7IGZhbHNlIGZvciA6ZW5hYmxlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggZGlzYWJsZWQgKSB7XG5cblx0Ly8gS25vd24gOmRpc2FibGVkIGZhbHNlIHBvc2l0aXZlczogZmllbGRzZXRbZGlzYWJsZWRdID4gbGVnZW5kOm50aC1vZi10eXBlKG4rMikgOmNhbi1kaXNhYmxlXG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdC8vIE9ubHkgY2VydGFpbiBlbGVtZW50cyBjYW4gbWF0Y2ggOmVuYWJsZWQgb3IgOmRpc2FibGVkXG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2NyaXB0aW5nLmh0bWwjc2VsZWN0b3ItZW5hYmxlZFxuXHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sI3NlbGVjdG9yLWRpc2FibGVkXG5cdFx0aWYgKCBcImZvcm1cIiBpbiBlbGVtICkge1xuXG5cdFx0XHQvLyBDaGVjayBmb3IgaW5oZXJpdGVkIGRpc2FibGVkbmVzcyBvbiByZWxldmFudCBub24tZGlzYWJsZWQgZWxlbWVudHM6XG5cdFx0XHQvLyAqIGxpc3RlZCBmb3JtLWFzc29jaWF0ZWQgZWxlbWVudHMgaW4gYSBkaXNhYmxlZCBmaWVsZHNldFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxpc3RlZFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NvbmNlcHQtZmUtZGlzYWJsZWRcblx0XHRcdC8vICogb3B0aW9uIGVsZW1lbnRzIGluIGEgZGlzYWJsZWQgb3B0Z3JvdXBcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjb25jZXB0LW9wdGlvbi1kaXNhYmxlZFxuXHRcdFx0Ly8gQWxsIHN1Y2ggZWxlbWVudHMgaGF2ZSBhIFwiZm9ybVwiIHByb3BlcnR5LlxuXHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgJiYgZWxlbS5kaXNhYmxlZCA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0Ly8gT3B0aW9uIGVsZW1lbnRzIGRlZmVyIHRvIGEgcGFyZW50IG9wdGdyb3VwIGlmIHByZXNlbnRcblx0XHRcdFx0aWYgKCBcImxhYmVsXCIgaW4gZWxlbSApIHtcblx0XHRcdFx0XHRpZiAoIFwibGFiZWxcIiBpbiBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5wYXJlbnROb2RlLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDYgLSAxMVxuXHRcdFx0XHQvLyBVc2UgdGhlIGlzRGlzYWJsZWQgc2hvcnRjdXQgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGRpc2FibGVkIGZpZWxkc2V0IGFuY2VzdG9yc1xuXHRcdFx0XHRyZXR1cm4gZWxlbS5pc0Rpc2FibGVkID09PSBkaXNhYmxlZCB8fFxuXG5cdFx0XHRcdFx0Ly8gV2hlcmUgdGhlcmUgaXMgbm8gaXNEaXNhYmxlZCwgY2hlY2sgbWFudWFsbHlcblx0XHRcdFx0XHQvKiBqc2hpbnQgLVcwMTggKi9cblx0XHRcdFx0XHRlbGVtLmlzRGlzYWJsZWQgIT09ICFkaXNhYmxlZCAmJlxuXHRcdFx0XHRcdGluRGlzYWJsZWRGaWVsZHNldCggZWxlbSApID09PSBkaXNhYmxlZDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXG5cdFx0Ly8gVHJ5IHRvIHdpbm5vdyBvdXQgZWxlbWVudHMgdGhhdCBjYW4ndCBiZSBkaXNhYmxlZCBiZWZvcmUgdHJ1c3RpbmcgdGhlIGRpc2FibGVkIHByb3BlcnR5LlxuXHRcdC8vIFNvbWUgdmljdGltcyBnZXQgY2F1Z2h0IGluIG91ciBuZXQgKGxhYmVsLCBsZWdlbmQsIG1lbnUsIHRyYWNrKSwgYnV0IGl0IHNob3VsZG4ndFxuXHRcdC8vIGV2ZW4gZXhpc3Qgb24gdGhlbSwgbGV0IGFsb25lIGhhdmUgYSBib29sZWFuIHZhbHVlLlxuXHRcdH0gZWxzZSBpZiAoIFwibGFiZWxcIiBpbiBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdH1cblxuXHRcdC8vIFJlbWFpbmluZyBlbGVtZW50cyBhcmUgbmVpdGhlciA6ZW5hYmxlZCBub3IgOmRpc2FibGVkXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgcG9zaXRpb25hbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZuICkge1xuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggYXJndW1lbnQgKSB7XG5cdFx0YXJndW1lbnQgPSArYXJndW1lbnQ7XG5cdFx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHR2YXIgaixcblx0XHRcdFx0bWF0Y2hJbmRleGVzID0gZm4oIFtdLCBzZWVkLmxlbmd0aCwgYXJndW1lbnQgKSxcblx0XHRcdFx0aSA9IG1hdGNoSW5kZXhlcy5sZW5ndGg7XG5cblx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIGZvdW5kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlc1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggc2VlZFsgKCBqID0gbWF0Y2hJbmRleGVzWyBpIF0gKSBdICkge1xuXHRcdFx0XHRcdHNlZWRbIGogXSA9ICEoIG1hdGNoZXNbIGogXSA9IHNlZWRbIGogXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGEgbm9kZSBmb3IgdmFsaWRpdHkgYXMgYSBTaXp6bGUgY29udGV4dFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdD19IGNvbnRleHRcbiAqIEByZXR1cm5zIHtFbGVtZW50fE9iamVjdHxCb29sZWFufSBUaGUgaW5wdXQgbm9kZSBpZiBhY2NlcHRhYmxlLCBvdGhlcndpc2UgYSBmYWxzeSB2YWx1ZVxuICovXG5mdW5jdGlvbiB0ZXN0Q29udGV4dCggY29udGV4dCApIHtcblx0cmV0dXJuIGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29udGV4dDtcbn1cblxuLy8gRXhwb3NlIHN1cHBvcnQgdmFycyBmb3IgY29udmVuaWVuY2VcbnN1cHBvcnQgPSBTaXp6bGUuc3VwcG9ydCA9IHt9O1xuXG4vKipcbiAqIERldGVjdHMgWE1MIG5vZGVzXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbGVtIEFuIGVsZW1lbnQgb3IgYSBkb2N1bWVudFxuICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWZmIGVsZW0gaXMgYSBub24tSFRNTCBYTUwgbm9kZVxuICovXG5pc1hNTCA9IFNpenpsZS5pc1hNTCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbmFtZXNwYWNlID0gZWxlbSAmJiBlbGVtLm5hbWVzcGFjZVVSSSxcblx0XHRkb2NFbGVtID0gZWxlbSAmJiAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkuZG9jdW1lbnRFbGVtZW50O1xuXG5cdC8vIFN1cHBvcnQ6IElFIDw9OFxuXHQvLyBBc3N1bWUgSFRNTCB3aGVuIGRvY3VtZW50RWxlbWVudCBkb2Vzbid0IHlldCBleGlzdCwgc3VjaCBhcyBpbnNpZGUgbG9hZGluZyBpZnJhbWVzXG5cdC8vIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC80ODMzXG5cdHJldHVybiAhcmh0bWwudGVzdCggbmFtZXNwYWNlIHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5ub2RlTmFtZSB8fCBcIkhUTUxcIiApO1xufTtcblxuLyoqXG4gKiBTZXRzIGRvY3VtZW50LXJlbGF0ZWQgdmFyaWFibGVzIG9uY2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IFtkb2NdIEFuIGVsZW1lbnQgb3IgZG9jdW1lbnQgb2JqZWN0IHRvIHVzZSB0byBzZXQgdGhlIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKi9cbnNldERvY3VtZW50ID0gU2l6emxlLnNldERvY3VtZW50ID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cdHZhciBoYXNDb21wYXJlLCBzdWJXaW5kb3csXG5cdFx0ZG9jID0gbm9kZSA/IG5vZGUub3duZXJEb2N1bWVudCB8fCBub2RlIDogcHJlZmVycmVkRG9jO1xuXG5cdC8vIFJldHVybiBlYXJseSBpZiBkb2MgaXMgaW52YWxpZCBvciBhbHJlYWR5IHNlbGVjdGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggZG9jID09IGRvY3VtZW50IHx8IGRvYy5ub2RlVHlwZSAhPT0gOSB8fCAhZG9jLmRvY3VtZW50RWxlbWVudCApIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQ7XG5cdH1cblxuXHQvLyBVcGRhdGUgZ2xvYmFsIHZhcmlhYmxlc1xuXHRkb2N1bWVudCA9IGRvYztcblx0ZG9jRWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0ZG9jdW1lbnRJc0hUTUwgPSAhaXNYTUwoIGRvY3VtZW50ICk7XG5cblx0Ly8gU3VwcG9ydDogSUUgOSAtIDExKywgRWRnZSAxMiAtIDE4K1xuXHQvLyBBY2Nlc3NpbmcgaWZyYW1lIGRvY3VtZW50cyBhZnRlciB1bmxvYWQgdGhyb3dzIFwicGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvcnMgKGpRdWVyeSAjMTM5MzYpXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggcHJlZmVycmVkRG9jICE9IGRvY3VtZW50ICYmXG5cdFx0KCBzdWJXaW5kb3cgPSBkb2N1bWVudC5kZWZhdWx0VmlldyApICYmIHN1YldpbmRvdy50b3AgIT09IHN1YldpbmRvdyApIHtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDExLCBFZGdlXG5cdFx0aWYgKCBzdWJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdHN1YldpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBcInVubG9hZFwiLCB1bmxvYWRIYW5kbGVyLCBmYWxzZSApO1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgOSAtIDEwIG9ubHlcblx0XHR9IGVsc2UgaWYgKCBzdWJXaW5kb3cuYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHRzdWJXaW5kb3cuYXR0YWNoRXZlbnQoIFwib251bmxvYWRcIiwgdW5sb2FkSGFuZGxlciApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFN1cHBvcnQ6IElFIDggLSAxMSssIEVkZ2UgMTIgLSAxOCssIENocm9tZSA8PTE2IC0gMjUgb25seSwgRmlyZWZveCA8PTMuNiAtIDMxIG9ubHksXG5cdC8vIFNhZmFyaSA0IC0gNSBvbmx5LCBPcGVyYSA8PTExLjYgLSAxMi54IG9ubHlcblx0Ly8gSUUvRWRnZSAmIG9sZGVyIGJyb3dzZXJzIGRvbid0IHN1cHBvcnQgdGhlIDpzY29wZSBwc2V1ZG8tY2xhc3MuXG5cdC8vIFN1cHBvcnQ6IFNhZmFyaSA2LjAgb25seVxuXHQvLyBTYWZhcmkgNi4wIHN1cHBvcnRzIDpzY29wZSBidXQgaXQncyBhbiBhbGlhcyBvZiA6cm9vdCB0aGVyZS5cblx0c3VwcG9ydC5zY29wZSA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSApO1xuXHRcdHJldHVybiB0eXBlb2YgZWwucXVlcnlTZWxlY3RvckFsbCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0IWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOnNjb3BlIGZpZWxkc2V0IGRpdlwiICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0LyogQXR0cmlidXRlc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gU3VwcG9ydDogSUU8OFxuXHQvLyBWZXJpZnkgdGhhdCBnZXRBdHRyaWJ1dGUgcmVhbGx5IHJldHVybnMgYXR0cmlidXRlcyBhbmQgbm90IHByb3BlcnRpZXNcblx0Ly8gKGV4Y2VwdGluZyBJRTggYm9vbGVhbnMpXG5cdHN1cHBvcnQuYXR0cmlidXRlcyA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGVsLmNsYXNzTmFtZSA9IFwiaVwiO1xuXHRcdHJldHVybiAhZWwuZ2V0QXR0cmlidXRlKCBcImNsYXNzTmFtZVwiICk7XG5cdH0gKTtcblxuXHQvKiBnZXRFbGVtZW50KHMpQnkqXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgcmV0dXJucyBvbmx5IGVsZW1lbnRzXG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRlbC5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlQ29tbWVudCggXCJcIiApICk7XG5cdFx0cmV0dXJuICFlbC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCIqXCIgKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvLyBTdXBwb3J0OiBJRTw5XG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDEwXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRCeUlkIHJldHVybnMgZWxlbWVudHMgYnkgbmFtZVxuXHQvLyBUaGUgYnJva2VuIGdldEVsZW1lbnRCeUlkIG1ldGhvZHMgZG9uJ3QgcGljayB1cCBwcm9ncmFtbWF0aWNhbGx5LXNldCBuYW1lcyxcblx0Ly8gc28gdXNlIGEgcm91bmRhYm91dCBnZXRFbGVtZW50c0J5TmFtZSB0ZXN0XG5cdHN1cHBvcnQuZ2V0QnlJZCA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuaWQgPSBleHBhbmRvO1xuXHRcdHJldHVybiAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUgfHwgIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCBleHBhbmRvICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0Ly8gSUQgZmlsdGVyIGFuZCBmaW5kXG5cdGlmICggc3VwcG9ydC5nZXRCeUlkICkge1xuXHRcdEV4cHIuZmlsdGVyWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0RXhwci5maW5kWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRcdHZhciBlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblx0XHRcdFx0cmV0dXJuIGVsZW0gPyBbIGVsZW0gXSA6IFtdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0RXhwci5maWx0ZXJbIFwiSURcIiBdID0gIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgbm9kZSA9IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRyZXR1cm4gbm9kZSAmJiBub2RlLnZhbHVlID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA2IC0gNyBvbmx5XG5cdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgaXMgbm90IHJlbGlhYmxlIGFzIGEgZmluZCBzaG9ydGN1dFxuXHRcdEV4cHIuZmluZFsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgbm9kZSwgaSwgZWxlbXMsXG5cdFx0XHRcdFx0ZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdFx0aWYgKCBlbGVtICkge1xuXG5cdFx0XHRcdFx0Ly8gVmVyaWZ5IHRoZSBpZCBhdHRyaWJ1dGVcblx0XHRcdFx0XHRub2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0XHRpZiAoIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gaWQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gWyBlbGVtIF07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRmFsbCBiYWNrIG9uIGdldEVsZW1lbnRzQnlOYW1lXG5cdFx0XHRcdFx0ZWxlbXMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlOYW1lKCBpZCApO1xuXHRcdFx0XHRcdGkgPSAwO1xuXHRcdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRub2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0XHRcdGlmICggbm9kZSAmJiBub2RlLnZhbHVlID09PSBpZCApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFsgZWxlbSBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Ly8gVGFnXG5cdEV4cHIuZmluZFsgXCJUQUdcIiBdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA/XG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRG9jdW1lbnRGcmFnbWVudCBub2RlcyBkb24ndCBoYXZlIGdFQlROXG5cdFx0XHR9IGVsc2UgaWYgKCBzdXBwb3J0LnFzYSApIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCggdGFnICk7XG5cdFx0XHR9XG5cdFx0fSA6XG5cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdHRtcCA9IFtdLFxuXHRcdFx0XHRpID0gMCxcblxuXHRcdFx0XHQvLyBCeSBoYXBweSBjb2luY2lkZW5jZSwgYSAoYnJva2VuKSBnRUJUTiBhcHBlYXJzIG9uIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgdG9vXG5cdFx0XHRcdHJlc3VsdHMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRmlsdGVyIG91dCBwb3NzaWJsZSBjb21tZW50c1xuXHRcdFx0aWYgKCB0YWcgPT09IFwiKlwiICkge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0dG1wLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdG1wO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHQvLyBDbGFzc1xuXHRFeHByLmZpbmRbIFwiQ0xBU1NcIiBdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGZ1bmN0aW9uKCBjbGFzc05hbWUsIGNvbnRleHQgKSB7XG5cdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0cmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggY2xhc3NOYW1lICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qIFFTQS9tYXRjaGVzU2VsZWN0b3Jcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFFTQSBhbmQgbWF0Y2hlc1NlbGVjdG9yIHN1cHBvcnRcblxuXHQvLyBtYXRjaGVzU2VsZWN0b3IoOmFjdGl2ZSkgcmVwb3J0cyBmYWxzZSB3aGVuIHRydWUgKElFOS9PcGVyYSAxMS41KVxuXHRyYnVnZ3lNYXRjaGVzID0gW107XG5cblx0Ly8gcVNhKDpmb2N1cykgcmVwb3J0cyBmYWxzZSB3aGVuIHRydWUgKENocm9tZSAyMSlcblx0Ly8gV2UgYWxsb3cgdGhpcyBiZWNhdXNlIG9mIGEgYnVnIGluIElFOC85IHRoYXQgdGhyb3dzIGFuIGVycm9yXG5cdC8vIHdoZW5ldmVyIGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBpcyBhY2Nlc3NlZCBvbiBhbiBpZnJhbWVcblx0Ly8gU28sIHdlIGFsbG93IDpmb2N1cyB0byBwYXNzIHRocm91Z2ggUVNBIGFsbCB0aGUgdGltZSB0byBhdm9pZCB0aGUgSUUgZXJyb3Jcblx0Ly8gU2VlIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMzM3OFxuXHRyYnVnZ3lRU0EgPSBbXTtcblxuXHRpZiAoICggc3VwcG9ydC5xc2EgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgKSApICkge1xuXG5cdFx0Ly8gQnVpbGQgUVNBIHJlZ2V4XG5cdFx0Ly8gUmVnZXggc3RyYXRlZ3kgYWRvcHRlZCBmcm9tIERpZWdvIFBlcmluaVxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0XHR2YXIgaW5wdXQ7XG5cblx0XHRcdC8vIFNlbGVjdCBpcyBzZXQgdG8gZW1wdHkgc3RyaW5nIG9uIHB1cnBvc2Vcblx0XHRcdC8vIFRoaXMgaXMgdG8gdGVzdCBJRSdzIHRyZWF0bWVudCBvZiBub3QgZXhwbGljaXRseVxuXHRcdFx0Ly8gc2V0dGluZyBhIGJvb2xlYW4gY29udGVudCBhdHRyaWJ1dGUsXG5cdFx0XHQvLyBzaW5jZSBpdHMgcHJlc2VuY2Ugc2hvdWxkIGJlIGVub3VnaFxuXHRcdFx0Ly8gaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzEyMzU5XG5cdFx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmlubmVySFRNTCA9IFwiPGEgaWQ9J1wiICsgZXhwYW5kbyArIFwiJz48L2E+XCIgK1xuXHRcdFx0XHRcIjxzZWxlY3QgaWQ9J1wiICsgZXhwYW5kbyArIFwiLVxcclxcXFwnIG1zYWxsb3djYXB0dXJlPScnPlwiICtcblx0XHRcdFx0XCI8b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTgsIE9wZXJhIDExLTEyLjE2XG5cdFx0XHQvLyBOb3RoaW5nIHNob3VsZCBiZSBzZWxlY3RlZCB3aGVuIGVtcHR5IHN0cmluZ3MgZm9sbG93IF49IG9yICQ9IG9yICo9XG5cdFx0XHQvLyBUaGUgdGVzdCBhdHRyaWJ1dGUgbXVzdCBiZSB1bmtub3duIGluIE9wZXJhIGJ1dCBcInNhZmVcIiBmb3IgV2luUlRcblx0XHRcdC8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvaGg0NjUzODguYXNweCNhdHRyaWJ1dGVfc2VjdGlvblxuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIlttc2FsbG93Y2FwdHVyZV49JyddXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlsqXiRdPVwiICsgd2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gQm9vbGVhbiBhdHRyaWJ1dGVzIGFuZCBcInZhbHVlXCIgYXJlIG5vdCB0cmVhdGVkIGNvcnJlY3RseVxuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbc2VsZWN0ZWRdXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86dmFsdWV8XCIgKyBib29sZWFucyArIFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IENocm9tZTwyOSwgQW5kcm9pZDw0LjQsIFNhZmFyaTw3LjArLCBpT1M8Ny4wKywgUGhhbnRvbUpTPDEuOS44K1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbaWR+PVwiICsgZXhwYW5kbyArIFwiLV1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwifj1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTUgLSAxOCtcblx0XHRcdC8vIElFIDExL0VkZ2UgZG9uJ3QgZmluZCBlbGVtZW50cyBvbiBhIGBbbmFtZT0nJ11gIHF1ZXJ5IGluIHNvbWUgY2FzZXMuXG5cdFx0XHQvLyBBZGRpbmcgYSB0ZW1wb3JhcnkgYXR0cmlidXRlIHRvIHRoZSBkb2N1bWVudCBiZWZvcmUgdGhlIHNlbGVjdGlvbiB3b3Jrc1xuXHRcdFx0Ly8gYXJvdW5kIHRoZSBpc3N1ZS5cblx0XHRcdC8vIEludGVyZXN0aW5nbHksIElFIDEwICYgb2xkZXIgZG9uJ3Qgc2VlbSB0byBoYXZlIHRoZSBpc3N1ZS5cblx0XHRcdGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcIlwiICk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZCggaW5wdXQgKTtcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW25hbWU9JyddXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqbmFtZVwiICsgd2hpdGVzcGFjZSArIFwiKj1cIiArXG5cdFx0XHRcdFx0d2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdlYmtpdC9PcGVyYSAtIDpjaGVja2VkIHNob3VsZCByZXR1cm4gc2VsZWN0ZWQgb3B0aW9uIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0Ly8gSUU4IHRocm93cyBlcnJvciBoZXJlIGFuZCB3aWxsIG5vdCBzZWUgbGF0ZXIgdGVzdHNcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmNoZWNrZWRcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmNoZWNrZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBTYWZhcmkgOCssIGlPUyA4K1xuXHRcdFx0Ly8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNjg1MVxuXHRcdFx0Ly8gSW4tcGFnZSBgc2VsZWN0b3IjaWQgc2libGluZy1jb21iaW5hdG9yIHNlbGVjdG9yYCBmYWlsc1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJhI1wiICsgZXhwYW5kbyArIFwiKypcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiLiMuK1srfl1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBGaXJlZm94IDw9My42IC0gNSBvbmx5XG5cdFx0XHQvLyBPbGQgRmlyZWZveCBkb2Vzbid0IHRocm93IG9uIGEgYmFkbHktZXNjYXBlZCBpZGVudGlmaWVyLlxuXHRcdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggXCJcXFxcXFxmXCIgKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKCBcIltcXFxcclxcXFxuXFxcXGZdXCIgKTtcblx0XHR9ICk7XG5cblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdGVsLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nJyBkaXNhYmxlZD0nZGlzYWJsZWQnPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBkaXNhYmxlZD0nZGlzYWJsZWQnPjxvcHRpb24vPjwvc2VsZWN0PlwiO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBXaW5kb3dzIDggTmF0aXZlIEFwcHNcblx0XHRcdC8vIFRoZSB0eXBlIGFuZCBuYW1lIGF0dHJpYnV0ZXMgYXJlIHJlc3RyaWN0ZWQgZHVyaW5nIC5pbm5lckhUTUwgYXNzaWdubWVudFxuXHRcdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCBcImhpZGRlblwiICk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZCggaW5wdXQgKS5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcIkRcIiApO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRThcblx0XHRcdC8vIEVuZm9yY2UgY2FzZS1zZW5zaXRpdml0eSBvZiBuYW1lIGF0dHJpYnV0ZVxuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltuYW1lPWRdXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIm5hbWVcIiArIHdoaXRlc3BhY2UgKyBcIipbKl4kfCF+XT89XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRkYgMy41IC0gOmVuYWJsZWQvOmRpc2FibGVkIGFuZCBoaWRkZW4gZWxlbWVudHMgKGhpZGRlbiBlbGVtZW50cyBhcmUgc3RpbGwgZW5hYmxlZClcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmVuYWJsZWRcIiApLmxlbmd0aCAhPT0gMiApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTktMTErXG5cdFx0XHQvLyBJRSdzIDpkaXNhYmxlZCBzZWxlY3RvciBkb2VzIG5vdCBwaWNrIHVwIHRoZSBjaGlsZHJlbiBvZiBkaXNhYmxlZCBmaWVsZHNldHNcblx0XHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpkaXNhYmxlZFwiICkubGVuZ3RoICE9PSAyICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6ZW5hYmxlZFwiLCBcIjpkaXNhYmxlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IE9wZXJhIDEwIC0gMTEgb25seVxuXHRcdFx0Ly8gT3BlcmEgMTAtMTEgZG9lcyBub3QgdGhyb3cgb24gcG9zdC1jb21tYSBpbnZhbGlkIHBzZXVkb3Ncblx0XHRcdGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiKiw6eFwiICk7XG5cdFx0XHRyYnVnZ3lRU0EucHVzaCggXCIsLio6XCIgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpZiAoICggc3VwcG9ydC5tYXRjaGVzU2VsZWN0b3IgPSBybmF0aXZlLnRlc3QoICggbWF0Y2hlcyA9IGRvY0VsZW0ubWF0Y2hlcyB8fFxuXHRcdGRvY0VsZW0ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1zTWF0Y2hlc1NlbGVjdG9yICkgKSApICkge1xuXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRvIG1hdGNoZXNTZWxlY3RvclxuXHRcdFx0Ly8gb24gYSBkaXNjb25uZWN0ZWQgbm9kZSAoSUUgOSlcblx0XHRcdHN1cHBvcnQuZGlzY29ubmVjdGVkTWF0Y2ggPSBtYXRjaGVzLmNhbGwoIGVsLCBcIipcIiApO1xuXG5cdFx0XHQvLyBUaGlzIHNob3VsZCBmYWlsIHdpdGggYW4gZXhjZXB0aW9uXG5cdFx0XHQvLyBHZWNrbyBkb2VzIG5vdCBlcnJvciwgcmV0dXJucyBmYWxzZSBpbnN0ZWFkXG5cdFx0XHRtYXRjaGVzLmNhbGwoIGVsLCBcIltzIT0nJ106eFwiICk7XG5cdFx0XHRyYnVnZ3lNYXRjaGVzLnB1c2goIFwiIT1cIiwgcHNldWRvcyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdHJidWdneVFTQSA9IHJidWdneVFTQS5sZW5ndGggJiYgbmV3IFJlZ0V4cCggcmJ1Z2d5UVNBLmpvaW4oIFwifFwiICkgKTtcblx0cmJ1Z2d5TWF0Y2hlcyA9IHJidWdneU1hdGNoZXMubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneU1hdGNoZXMuam9pbiggXCJ8XCIgKSApO1xuXG5cdC8qIENvbnRhaW5zXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0aGFzQ29tcGFyZSA9IHJuYXRpdmUudGVzdCggZG9jRWxlbS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiApO1xuXG5cdC8vIEVsZW1lbnQgY29udGFpbnMgYW5vdGhlclxuXHQvLyBQdXJwb3NlZnVsbHkgc2VsZi1leGNsdXNpdmVcblx0Ly8gQXMgaW4sIGFuIGVsZW1lbnQgZG9lcyBub3QgY29udGFpbiBpdHNlbGZcblx0Y29udGFpbnMgPSBoYXNDb21wYXJlIHx8IHJuYXRpdmUudGVzdCggZG9jRWxlbS5jb250YWlucyApID9cblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBhZG93biA9IGEubm9kZVR5cGUgPT09IDkgPyBhLmRvY3VtZW50RWxlbWVudCA6IGEsXG5cdFx0XHRcdGJ1cCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuXHRcdFx0cmV0dXJuIGEgPT09IGJ1cCB8fCAhISggYnVwICYmIGJ1cC5ub2RlVHlwZSA9PT0gMSAmJiAoXG5cdFx0XHRcdGFkb3duLmNvbnRhaW5zID9cblx0XHRcdFx0XHRhZG93bi5jb250YWlucyggYnVwICkgOlxuXHRcdFx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYnVwICkgJiAxNlxuXHRcdFx0KSApO1xuXHRcdH0gOlxuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0aWYgKCBiICkge1xuXHRcdFx0XHR3aGlsZSAoICggYiA9IGIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0XHRcdGlmICggYiA9PT0gYSApIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0LyogU29ydGluZ1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gRG9jdW1lbnQgb3JkZXIgc29ydGluZ1xuXHRzb3J0T3JkZXIgPSBoYXNDb21wYXJlID9cblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBGbGFnIGZvciBkdXBsaWNhdGUgcmVtb3ZhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHQvLyBTb3J0IG9uIG1ldGhvZCBleGlzdGVuY2UgaWYgb25seSBvbmUgaW5wdXQgaGFzIGNvbXBhcmVEb2N1bWVudFBvc2l0aW9uXG5cdFx0dmFyIGNvbXBhcmUgPSAhYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAtICFiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uO1xuXHRcdGlmICggY29tcGFyZSApIHtcblx0XHRcdHJldHVybiBjb21wYXJlO1xuXHRcdH1cblxuXHRcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpZiBib3RoIGlucHV0cyBiZWxvbmcgdG8gdGhlIHNhbWUgZG9jdW1lbnRcblx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdGNvbXBhcmUgPSAoIGEub3duZXJEb2N1bWVudCB8fCBhICkgPT0gKCBiLm93bmVyRG9jdW1lbnQgfHwgYiApID9cblx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGIgKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSB3ZSBrbm93IHRoZXkgYXJlIGRpc2Nvbm5lY3RlZFxuXHRcdFx0MTtcblxuXHRcdC8vIERpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdGlmICggY29tcGFyZSAmIDEgfHxcblx0XHRcdCggIXN1cHBvcnQuc29ydERldGFjaGVkICYmIGIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGEgKSA9PT0gY29tcGFyZSApICkge1xuXG5cdFx0XHQvLyBDaG9vc2UgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBpcyByZWxhdGVkIHRvIG91ciBwcmVmZXJyZWQgZG9jdW1lbnRcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRpZiAoIGEgPT0gZG9jdW1lbnQgfHwgYS5vd25lckRvY3VtZW50ID09IHByZWZlcnJlZERvYyAmJlxuXHRcdFx0XHRjb250YWlucyggcHJlZmVycmVkRG9jLCBhICkgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdGlmICggYiA9PSBkb2N1bWVudCB8fCBiLm93bmVyRG9jdW1lbnQgPT0gcHJlZmVycmVkRG9jICYmXG5cdFx0XHRcdGNvbnRhaW5zKCBwcmVmZXJyZWREb2MsIGIgKSApIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1haW50YWluIG9yaWdpbmFsIG9yZGVyXG5cdFx0XHRyZXR1cm4gc29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wYXJlICYgNCA/IC0xIDogMTtcblx0fSA6XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRXhpdCBlYXJseSBpZiB0aGUgbm9kZXMgYXJlIGlkZW50aWNhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHR2YXIgY3VyLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRhdXAgPSBhLnBhcmVudE5vZGUsXG5cdFx0XHRidXAgPSBiLnBhcmVudE5vZGUsXG5cdFx0XHRhcCA9IFsgYSBdLFxuXHRcdFx0YnAgPSBbIGIgXTtcblxuXHRcdC8vIFBhcmVudGxlc3Mgbm9kZXMgYXJlIGVpdGhlciBkb2N1bWVudHMgb3IgZGlzY29ubmVjdGVkXG5cdFx0aWYgKCAhYXVwIHx8ICFidXAgKSB7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cblx0XHRcdHJldHVybiBhID09IGRvY3VtZW50ID8gLTEgOlxuXHRcdFx0XHRiID09IGRvY3VtZW50ID8gMSA6XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG5cdFx0XHRcdGF1cCA/IC0xIDpcblx0XHRcdFx0YnVwID8gMSA6XG5cdFx0XHRcdHNvcnRJbnB1dCA/XG5cdFx0XHRcdCggaW5kZXhPZiggc29ydElucHV0LCBhICkgLSBpbmRleE9mKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblxuXHRcdC8vIElmIHRoZSBub2RlcyBhcmUgc2libGluZ3MsIHdlIGNhbiBkbyBhIHF1aWNrIGNoZWNrXG5cdFx0fSBlbHNlIGlmICggYXVwID09PSBidXAgKSB7XG5cdFx0XHRyZXR1cm4gc2libGluZ0NoZWNrKCBhLCBiICk7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXJ3aXNlIHdlIG5lZWQgZnVsbCBsaXN0cyBvZiB0aGVpciBhbmNlc3RvcnMgZm9yIGNvbXBhcmlzb25cblx0XHRjdXIgPSBhO1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0YXAudW5zaGlmdCggY3VyICk7XG5cdFx0fVxuXHRcdGN1ciA9IGI7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRicC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cblx0XHQvLyBXYWxrIGRvd24gdGhlIHRyZWUgbG9va2luZyBmb3IgYSBkaXNjcmVwYW5jeVxuXHRcdHdoaWxlICggYXBbIGkgXSA9PT0gYnBbIGkgXSApIHtcblx0XHRcdGkrKztcblx0XHR9XG5cblx0XHRyZXR1cm4gaSA/XG5cblx0XHRcdC8vIERvIGEgc2libGluZyBjaGVjayBpZiB0aGUgbm9kZXMgaGF2ZSBhIGNvbW1vbiBhbmNlc3RvclxuXHRcdFx0c2libGluZ0NoZWNrKCBhcFsgaSBdLCBicFsgaSBdICkgOlxuXG5cdFx0XHQvLyBPdGhlcndpc2Ugbm9kZXMgaW4gb3VyIGRvY3VtZW50IHNvcnQgZmlyc3Rcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cblx0XHRcdGFwWyBpIF0gPT0gcHJlZmVycmVkRG9jID8gLTEgOlxuXHRcdFx0YnBbIGkgXSA9PSBwcmVmZXJyZWREb2MgPyAxIDpcblx0XHRcdC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG5cdFx0XHQwO1xuXHR9O1xuXG5cdHJldHVybiBkb2N1bWVudDtcbn07XG5cblNpenpsZS5tYXRjaGVzID0gZnVuY3Rpb24oIGV4cHIsIGVsZW1lbnRzICkge1xuXHRyZXR1cm4gU2l6emxlKCBleHByLCBudWxsLCBudWxsLCBlbGVtZW50cyApO1xufTtcblxuU2l6emxlLm1hdGNoZXNTZWxlY3RvciA9IGZ1bmN0aW9uKCBlbGVtLCBleHByICkge1xuXHRzZXREb2N1bWVudCggZWxlbSApO1xuXG5cdGlmICggc3VwcG9ydC5tYXRjaGVzU2VsZWN0b3IgJiYgZG9jdW1lbnRJc0hUTUwgJiZcblx0XHQhbm9ubmF0aXZlU2VsZWN0b3JDYWNoZVsgZXhwciArIFwiIFwiIF0gJiZcblx0XHQoICFyYnVnZ3lNYXRjaGVzIHx8ICFyYnVnZ3lNYXRjaGVzLnRlc3QoIGV4cHIgKSApICYmXG5cdFx0KCAhcmJ1Z2d5UVNBICAgICB8fCAhcmJ1Z2d5UVNBLnRlc3QoIGV4cHIgKSApICkge1xuXG5cdFx0dHJ5IHtcblx0XHRcdHZhciByZXQgPSBtYXRjaGVzLmNhbGwoIGVsZW0sIGV4cHIgKTtcblxuXHRcdFx0Ly8gSUUgOSdzIG1hdGNoZXNTZWxlY3RvciByZXR1cm5zIGZhbHNlIG9uIGRpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdFx0aWYgKCByZXQgfHwgc3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCB8fFxuXG5cdFx0XHRcdC8vIEFzIHdlbGwsIGRpc2Nvbm5lY3RlZCBub2RlcyBhcmUgc2FpZCB0byBiZSBpbiBhIGRvY3VtZW50XG5cdFx0XHRcdC8vIGZyYWdtZW50IGluIElFIDlcblx0XHRcdFx0ZWxlbS5kb2N1bWVudCAmJiBlbGVtLmRvY3VtZW50Lm5vZGVUeXBlICE9PSAxMSApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9IGNhdGNoICggZSApIHtcblx0XHRcdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUoIGV4cHIsIHRydWUgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlKCBleHByLCBkb2N1bWVudCwgbnVsbCwgWyBlbGVtIF0gKS5sZW5ndGggPiAwO1xufTtcblxuU2l6emxlLmNvbnRhaW5zID0gZnVuY3Rpb24oIGNvbnRleHQsIGVsZW0gKSB7XG5cblx0Ly8gU2V0IGRvY3VtZW50IHZhcnMgaWYgbmVlZGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggKCBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dCApICE9IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdH1cblx0cmV0dXJuIGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICk7XG59O1xuXG5TaXp6bGUuYXR0ciA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKSAhPSBkb2N1bWVudCApIHtcblx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHR9XG5cblx0dmFyIGZuID0gRXhwci5hdHRySGFuZGxlWyBuYW1lLnRvTG93ZXJDYXNlKCkgXSxcblxuXHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdHZhbCA9IGZuICYmIGhhc093bi5jYWxsKCBFeHByLmF0dHJIYW5kbGUsIG5hbWUudG9Mb3dlckNhc2UoKSApID9cblx0XHRcdGZuKCBlbGVtLCBuYW1lLCAhZG9jdW1lbnRJc0hUTUwgKSA6XG5cdFx0XHR1bmRlZmluZWQ7XG5cblx0cmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkID9cblx0XHR2YWwgOlxuXHRcdHN1cHBvcnQuYXR0cmlidXRlcyB8fCAhZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKSA6XG5cdFx0XHQoIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApICkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdG51bGw7XG59O1xuXG5TaXp6bGUuZXNjYXBlID0gZnVuY3Rpb24oIHNlbCApIHtcblx0cmV0dXJuICggc2VsICsgXCJcIiApLnJlcGxhY2UoIHJjc3Nlc2NhcGUsIGZjc3Nlc2NhcGUgKTtcbn07XG5cblNpenpsZS5lcnJvciA9IGZ1bmN0aW9uKCBtc2cgKSB7XG5cdHRocm93IG5ldyBFcnJvciggXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZyApO1xufTtcblxuLyoqXG4gKiBEb2N1bWVudCBzb3J0aW5nIGFuZCByZW1vdmluZyBkdXBsaWNhdGVzXG4gKiBAcGFyYW0ge0FycmF5TGlrZX0gcmVzdWx0c1xuICovXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0Ly8gVW5sZXNzIHdlICprbm93KiB3ZSBjYW4gZGV0ZWN0IGR1cGxpY2F0ZXMsIGFzc3VtZSB0aGVpciBwcmVzZW5jZVxuXHRoYXNEdXBsaWNhdGUgPSAhc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzO1xuXHRzb3J0SW5wdXQgPSAhc3VwcG9ydC5zb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRpZiAoIGVsZW0gPT09IHJlc3VsdHNbIGkgXSApIHtcblx0XHRcdFx0aiA9IGR1cGxpY2F0ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdHJlc3VsdHMuc3BsaWNlKCBkdXBsaWNhdGVzWyBqIF0sIDEgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBDbGVhciBpbnB1dCBhZnRlciBzb3J0aW5nIHRvIHJlbGVhc2Ugb2JqZWN0c1xuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9zaXp6bGUvcHVsbC8yMjVcblx0c29ydElucHV0ID0gbnVsbDtcblxuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiBmb3IgcmV0cmlldmluZyB0aGUgdGV4dCB2YWx1ZSBvZiBhbiBhcnJheSBvZiBET00gbm9kZXNcbiAqIEBwYXJhbSB7QXJyYXl8RWxlbWVudH0gZWxlbVxuICovXG5nZXRUZXh0ID0gU2l6emxlLmdldFRleHQgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0dmFyIG5vZGUsXG5cdFx0cmV0ID0gXCJcIixcblx0XHRpID0gMCxcblx0XHRub2RlVHlwZSA9IGVsZW0ubm9kZVR5cGU7XG5cblx0aWYgKCAhbm9kZVR5cGUgKSB7XG5cblx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdHdoaWxlICggKCBub2RlID0gZWxlbVsgaSsrIF0gKSApIHtcblxuXHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSB7XG5cblx0XHQvLyBVc2UgdGV4dENvbnRlbnQgZm9yIGVsZW1lbnRzXG5cdFx0Ly8gaW5uZXJUZXh0IHVzYWdlIHJlbW92ZWQgZm9yIGNvbnNpc3RlbmN5IG9mIG5ldyBsaW5lcyAoalF1ZXJ5ICMxMTE1Mylcblx0XHRpZiAoIHR5cGVvZiBlbGVtLnRleHRDb250ZW50ID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIGVsZW0udGV4dENvbnRlbnQ7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gVHJhdmVyc2UgaXRzIGNoaWxkcmVuXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0cmV0ICs9IGdldFRleHQoIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAzIHx8IG5vZGVUeXBlID09PSA0ICkge1xuXHRcdHJldHVybiBlbGVtLm5vZGVWYWx1ZTtcblx0fVxuXG5cdC8vIERvIG5vdCBpbmNsdWRlIGNvbW1lbnQgb3IgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBub2Rlc1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5FeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblxuXHQvLyBDYW4gYmUgYWRqdXN0ZWQgYnkgdGhlIHVzZXJcblx0Y2FjaGVMZW5ndGg6IDUwLFxuXG5cdGNyZWF0ZVBzZXVkbzogbWFya0Z1bmN0aW9uLFxuXG5cdG1hdGNoOiBtYXRjaEV4cHIsXG5cblx0YXR0ckhhbmRsZToge30sXG5cblx0ZmluZDoge30sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIj5cIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiIFwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIgfSxcblx0XHRcIitcIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCJ+XCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiIH1cblx0fSxcblxuXHRwcmVGaWx0ZXI6IHtcblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0bWF0Y2hbIDEgXSA9IG1hdGNoWyAxIF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgZ2l2ZW4gdmFsdWUgdG8gbWF0Y2hbM10gd2hldGhlciBxdW90ZWQgb3IgdW5xdW90ZWRcblx0XHRcdG1hdGNoWyAzIF0gPSAoIG1hdGNoWyAzIF0gfHwgbWF0Y2hbIDQgXSB8fFxuXHRcdFx0XHRtYXRjaFsgNSBdIHx8IFwiXCIgKS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWyAyIF0gPT09IFwifj1cIiApIHtcblx0XHRcdFx0bWF0Y2hbIDMgXSA9IFwiIFwiICsgbWF0Y2hbIDMgXSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDQgKTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cblx0XHRcdC8qIG1hdGNoZXMgZnJvbSBtYXRjaEV4cHJbXCJDSElMRFwiXVxuXHRcdFx0XHQxIHR5cGUgKG9ubHl8bnRofC4uLilcblx0XHRcdFx0MiB3aGF0IChjaGlsZHxvZi10eXBlKVxuXHRcdFx0XHQzIGFyZ3VtZW50IChldmVufG9kZHxcXGQqfFxcZCpuKFsrLV1cXGQrKT98Li4uKVxuXHRcdFx0XHQ0IHhuLWNvbXBvbmVudCBvZiB4bit5IGFyZ3VtZW50IChbKy1dP1xcZCpufClcblx0XHRcdFx0NSBzaWduIG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ2IHggb2YgeG4tY29tcG9uZW50XG5cdFx0XHRcdDcgc2lnbiBvZiB5LWNvbXBvbmVudFxuXHRcdFx0XHQ4IHkgb2YgeS1jb21wb25lbnRcblx0XHRcdCovXG5cdFx0XHRtYXRjaFsgMSBdID0gbWF0Y2hbIDEgXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoIG1hdGNoWyAxIF0uc2xpY2UoIDAsIDMgKSA9PT0gXCJudGhcIiApIHtcblxuXHRcdFx0XHQvLyBudGgtKiByZXF1aXJlcyBhcmd1bWVudFxuXHRcdFx0XHRpZiAoICFtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbIDAgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbnVtZXJpYyB4IGFuZCB5IHBhcmFtZXRlcnMgZm9yIEV4cHIuZmlsdGVyLkNISUxEXG5cdFx0XHRcdC8vIHJlbWVtYmVyIHRoYXQgZmFsc2UvdHJ1ZSBjYXN0IHJlc3BlY3RpdmVseSB0byAwLzFcblx0XHRcdFx0bWF0Y2hbIDQgXSA9ICsoIG1hdGNoWyA0IF0gP1xuXHRcdFx0XHRcdG1hdGNoWyA1IF0gKyAoIG1hdGNoWyA2IF0gfHwgMSApIDpcblx0XHRcdFx0XHQyICogKCBtYXRjaFsgMyBdID09PSBcImV2ZW5cIiB8fCBtYXRjaFsgMyBdID09PSBcIm9kZFwiICkgKTtcblx0XHRcdFx0bWF0Y2hbIDUgXSA9ICsoICggbWF0Y2hbIDcgXSArIG1hdGNoWyA4IF0gKSB8fCBtYXRjaFsgMyBdID09PSBcIm9kZFwiICk7XG5cblx0XHRcdFx0Ly8gb3RoZXIgdHlwZXMgcHJvaGliaXQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWyAwIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdH0sXG5cblx0XHRcIlBTRVVET1wiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHR2YXIgZXhjZXNzLFxuXHRcdFx0XHR1bnF1b3RlZCA9ICFtYXRjaFsgNiBdICYmIG1hdGNoWyAyIF07XG5cblx0XHRcdGlmICggbWF0Y2hFeHByWyBcIkNISUxEXCIgXS50ZXN0KCBtYXRjaFsgMCBdICkgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBY2NlcHQgcXVvdGVkIGFyZ3VtZW50cyBhcy1pc1xuXHRcdFx0aWYgKCBtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRtYXRjaFsgMiBdID0gbWF0Y2hbIDQgXSB8fCBtYXRjaFsgNSBdIHx8IFwiXCI7XG5cblx0XHRcdC8vIFN0cmlwIGV4Y2VzcyBjaGFyYWN0ZXJzIGZyb20gdW5xdW90ZWQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCB1bnF1b3RlZCAmJiBycHNldWRvLnRlc3QoIHVucXVvdGVkICkgJiZcblxuXHRcdFx0XHQvLyBHZXQgZXhjZXNzIGZyb20gdG9rZW5pemUgKHJlY3Vyc2l2ZWx5KVxuXHRcdFx0XHQoIGV4Y2VzcyA9IHRva2VuaXplKCB1bnF1b3RlZCwgdHJ1ZSApICkgJiZcblxuXHRcdFx0XHQvLyBhZHZhbmNlIHRvIHRoZSBuZXh0IGNsb3NpbmcgcGFyZW50aGVzaXNcblx0XHRcdFx0KCBleGNlc3MgPSB1bnF1b3RlZC5pbmRleE9mKCBcIilcIiwgdW5xdW90ZWQubGVuZ3RoIC0gZXhjZXNzICkgLSB1bnF1b3RlZC5sZW5ndGggKSApIHtcblxuXHRcdFx0XHQvLyBleGNlc3MgaXMgYSBuZWdhdGl2ZSBpbmRleFxuXHRcdFx0XHRtYXRjaFsgMCBdID0gbWF0Y2hbIDAgXS5zbGljZSggMCwgZXhjZXNzICk7XG5cdFx0XHRcdG1hdGNoWyAyIF0gPSB1bnF1b3RlZC5zbGljZSggMCwgZXhjZXNzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJldHVybiBvbmx5IGNhcHR1cmVzIG5lZWRlZCBieSB0aGUgcHNldWRvIGZpbHRlciBtZXRob2QgKHR5cGUgYW5kIGFyZ3VtZW50KVxuXHRcdFx0cmV0dXJuIG1hdGNoLnNsaWNlKCAwLCAzICk7XG5cdFx0fVxuXHR9LFxuXG5cdGZpbHRlcjoge1xuXG5cdFx0XCJUQUdcIjogZnVuY3Rpb24oIG5vZGVOYW1lU2VsZWN0b3IgKSB7XG5cdFx0XHR2YXIgbm9kZU5hbWUgPSBub2RlTmFtZVNlbGVjdG9yLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBub2RlTmFtZVNlbGVjdG9yID09PSBcIipcIiA/XG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZTtcblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDTEFTU1wiOiBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdFx0dmFyIHBhdHRlcm4gPSBjbGFzc0NhY2hlWyBjbGFzc05hbWUgKyBcIiBcIiBdO1xuXG5cdFx0XHRyZXR1cm4gcGF0dGVybiB8fFxuXHRcdFx0XHQoIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCBcIihefFwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcdFx0XCIpXCIgKyBjbGFzc05hbWUgKyBcIihcIiArIHdoaXRlc3BhY2UgKyBcInwkKVwiICkgKSAmJiBjbGFzc0NhY2hlKFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdChcblx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgZWxlbS5jbGFzc05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWxlbS5jbGFzc05hbWUgfHxcblx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBcImNsYXNzXCIgKSB8fFxuXHRcdFx0XHRcdFx0XHRcdFwiXCJcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG5hbWUsIG9wZXJhdG9yLCBjaGVjayApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFNpenpsZS5hdHRyKCBlbGVtLCBuYW1lICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiIT1cIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoICFvcGVyYXRvciApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdCArPSBcIlwiO1xuXG5cdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuXHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiPVwiID8gcmVzdWx0ID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiIT1cIiA/IHJlc3VsdCAhPT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIl49XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA9PT0gMCA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiKj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiQ9XCIgPyBjaGVjayAmJiByZXN1bHQuc2xpY2UoIC1jaGVjay5sZW5ndGggKSA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIn49XCIgPyAoIFwiIFwiICsgcmVzdWx0LnJlcGxhY2UoIHJ3aGl0ZXNwYWNlLCBcIiBcIiApICsgXCIgXCIgKS5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcInw9XCIgPyByZXN1bHQgPT09IGNoZWNrIHx8IHJlc3VsdC5zbGljZSggMCwgY2hlY2subGVuZ3RoICsgMSApID09PSBjaGVjayArIFwiLVwiIDpcblx0XHRcdFx0XHRmYWxzZTtcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIHR5cGUsIHdoYXQsIF9hcmd1bWVudCwgZmlyc3QsIGxhc3QgKSB7XG5cdFx0XHR2YXIgc2ltcGxlID0gdHlwZS5zbGljZSggMCwgMyApICE9PSBcIm50aFwiLFxuXHRcdFx0XHRmb3J3YXJkID0gdHlwZS5zbGljZSggLTQgKSAhPT0gXCJsYXN0XCIsXG5cdFx0XHRcdG9mVHlwZSA9IHdoYXQgPT09IFwib2YtdHlwZVwiO1xuXG5cdFx0XHRyZXR1cm4gZmlyc3QgPT09IDEgJiYgbGFzdCA9PT0gMCA/XG5cblx0XHRcdFx0Ly8gU2hvcnRjdXQgZm9yIDpudGgtKihuKVxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gISFlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdH0gOlxuXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdHZhciBjYWNoZSwgdW5pcXVlQ2FjaGUsIG91dGVyQ2FjaGUsIG5vZGUsIG5vZGVJbmRleCwgc3RhcnQsXG5cdFx0XHRcdFx0XHRkaXIgPSBzaW1wbGUgIT09IGZvcndhcmQgPyBcIm5leHRTaWJsaW5nXCIgOiBcInByZXZpb3VzU2libGluZ1wiLFxuXHRcdFx0XHRcdFx0cGFyZW50ID0gZWxlbS5wYXJlbnROb2RlLFxuXHRcdFx0XHRcdFx0bmFtZSA9IG9mVHlwZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHR1c2VDYWNoZSA9ICF4bWwgJiYgIW9mVHlwZSxcblx0XHRcdFx0XHRcdGRpZmYgPSBmYWxzZTtcblxuXHRcdFx0XHRcdGlmICggcGFyZW50ICkge1xuXG5cdFx0XHRcdFx0XHQvLyA6KGZpcnN0fGxhc3R8b25seSktKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdFx0XHRpZiAoIHNpbXBsZSApIHtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCBkaXIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSBub2RlWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBSZXZlcnNlIGRpcmVjdGlvbiBmb3IgOm9ubHktKiAoaWYgd2UgaGF2ZW4ndCB5ZXQgZG9uZSBzbylcblx0XHRcdFx0XHRcdFx0XHRzdGFydCA9IGRpciA9IHR5cGUgPT09IFwib25seVwiICYmICFzdGFydCAmJiBcIm5leHRTaWJsaW5nXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN0YXJ0ID0gWyBmb3J3YXJkID8gcGFyZW50LmZpcnN0Q2hpbGQgOiBwYXJlbnQubGFzdENoaWxkIF07XG5cblx0XHRcdFx0XHRcdC8vIG5vbi14bWwgOm50aC1jaGlsZCguLi4pIHN0b3JlcyBjYWNoZSBkYXRhIG9uIGBwYXJlbnRgXG5cdFx0XHRcdFx0XHRpZiAoIGZvcndhcmQgJiYgdXNlQ2FjaGUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2VlayBgZWxlbWAgZnJvbSBhIHByZXZpb3VzbHktY2FjaGVkIGluZGV4XG5cblx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRub2RlID0gcGFyZW50O1xuXHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8ICggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleCAmJiBjYWNoZVsgMiBdO1xuXHRcdFx0XHRcdFx0XHRub2RlID0gbm9kZUluZGV4ICYmIHBhcmVudC5jaGlsZE5vZGVzWyBub2RlSW5kZXggXTtcblxuXHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEZhbGxiYWNrIHRvIHNlZWtpbmcgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0KCBkaWZmID0gbm9kZUluZGV4ID0gMCApIHx8IHN0YXJ0LnBvcCgpICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBXaGVuIGZvdW5kLCBjYWNoZSBpbmRleGVzIG9uIGBwYXJlbnRgIGFuZCBicmVha1xuXHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiArK2RpZmYgJiYgbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyB0eXBlIF0gPSBbIGRpcnJ1bnMsIG5vZGVJbmRleCwgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVXNlIHByZXZpb3VzbHktY2FjaGVkIGVsZW1lbnQgaW5kZXggaWYgYXZhaWxhYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyAuLi5pbiBhIGd6aXAtZnJpZW5kbHkgd2F5XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIHhtbCA6bnRoLWNoaWxkKC4uLilcblx0XHRcdFx0XHRcdFx0Ly8gb3IgOm50aC1sYXN0LWNoaWxkKC4uLikgb3IgOm50aCgtbGFzdCk/LW9mLXR5cGUoLi4uKVxuXHRcdFx0XHRcdFx0XHRpZiAoIGRpZmYgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXNlIHRoZSBzYW1lIGxvb3AgYXMgYWJvdmUgdG8gc2VlayBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdCggZGlmZiA9IG5vZGVJbmRleCA9IDAgKSB8fCBzdGFydC5wb3AoKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsrZGlmZiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDYWNoZSB0aGUgaW5kZXggb2YgZWFjaCBlbmNvdW50ZXJlZCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsgdHlwZSBdID0gWyBkaXJydW5zLCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIG5vZGUgPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSW5jb3Jwb3JhdGUgdGhlIG9mZnNldCwgdGhlbiBjaGVjayBhZ2FpbnN0IGN5Y2xlIHNpemVcblx0XHRcdFx0XHRcdGRpZmYgLT0gbGFzdDtcblx0XHRcdFx0XHRcdHJldHVybiBkaWZmID09PSBmaXJzdCB8fCAoIGRpZmYgJSBmaXJzdCA9PT0gMCAmJiBkaWZmIC8gZmlyc3QgPj0gMCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJQU0VVRE9cIjogZnVuY3Rpb24oIHBzZXVkbywgYXJndW1lbnQgKSB7XG5cblx0XHRcdC8vIHBzZXVkby1jbGFzcyBuYW1lcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZVxuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNwc2V1ZG8tY2xhc3Nlc1xuXHRcdFx0Ly8gUHJpb3JpdGl6ZSBieSBjYXNlIHNlbnNpdGl2aXR5IGluIGNhc2UgY3VzdG9tIHBzZXVkb3MgYXJlIGFkZGVkIHdpdGggdXBwZXJjYXNlIGxldHRlcnNcblx0XHRcdC8vIFJlbWVtYmVyIHRoYXQgc2V0RmlsdGVycyBpbmhlcml0cyBmcm9tIHBzZXVkb3Ncblx0XHRcdHZhciBhcmdzLFxuXHRcdFx0XHRmbiA9IEV4cHIucHNldWRvc1sgcHNldWRvIF0gfHwgRXhwci5zZXRGaWx0ZXJzWyBwc2V1ZG8udG9Mb3dlckNhc2UoKSBdIHx8XG5cdFx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIHBzZXVkbzogXCIgKyBwc2V1ZG8gKTtcblxuXHRcdFx0Ly8gVGhlIHVzZXIgbWF5IHVzZSBjcmVhdGVQc2V1ZG8gdG8gaW5kaWNhdGUgdGhhdFxuXHRcdFx0Ly8gYXJndW1lbnRzIGFyZSBuZWVkZWQgdG8gY3JlYXRlIHRoZSBmaWx0ZXIgZnVuY3Rpb25cblx0XHRcdC8vIGp1c3QgYXMgU2l6emxlIGRvZXNcblx0XHRcdGlmICggZm5bIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0cmV0dXJuIGZuKCBhcmd1bWVudCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBCdXQgbWFpbnRhaW4gc3VwcG9ydCBmb3Igb2xkIHNpZ25hdHVyZXNcblx0XHRcdGlmICggZm4ubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0YXJncyA9IFsgcHNldWRvLCBwc2V1ZG8sIFwiXCIsIGFyZ3VtZW50IF07XG5cdFx0XHRcdHJldHVybiBFeHByLnNldEZpbHRlcnMuaGFzT3duUHJvcGVydHkoIHBzZXVkby50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0XHRcdG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgaWR4LFxuXHRcdFx0XHRcdFx0XHRtYXRjaGVkID0gZm4oIHNlZWQsIGFyZ3VtZW50ICksXG5cdFx0XHRcdFx0XHRcdGkgPSBtYXRjaGVkLmxlbmd0aDtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZHggPSBpbmRleE9mKCBzZWVkLCBtYXRjaGVkWyBpIF0gKTtcblx0XHRcdFx0XHRcdFx0c2VlZFsgaWR4IF0gPSAhKCBtYXRjaGVzWyBpZHggXSA9IG1hdGNoZWRbIGkgXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKSA6XG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm4oIGVsZW0sIDAsIGFyZ3MgKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm47XG5cdFx0fVxuXHR9LFxuXG5cdHBzZXVkb3M6IHtcblxuXHRcdC8vIFBvdGVudGlhbGx5IGNvbXBsZXggcHNldWRvc1xuXHRcdFwibm90XCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXG5cdFx0XHQvLyBUcmltIHRoZSBzZWxlY3RvciBwYXNzZWQgdG8gY29tcGlsZVxuXHRcdFx0Ly8gdG8gYXZvaWQgdHJlYXRpbmcgbGVhZGluZyBhbmQgdHJhaWxpbmdcblx0XHRcdC8vIHNwYWNlcyBhcyBjb21iaW5hdG9yc1xuXHRcdFx0dmFyIGlucHV0ID0gW10sXG5cdFx0XHRcdHJlc3VsdHMgPSBbXSxcblx0XHRcdFx0bWF0Y2hlciA9IGNvbXBpbGUoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSApO1xuXG5cdFx0XHRyZXR1cm4gbWF0Y2hlclsgZXhwYW5kbyBdID9cblx0XHRcdFx0bWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcywgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0XHRcdHVubWF0Y2hlZCA9IG1hdGNoZXIoIHNlZWQsIG51bGwsIHhtbCwgW10gKSxcblx0XHRcdFx0XHRcdGkgPSBzZWVkLmxlbmd0aDtcblxuXHRcdFx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIHVubWF0Y2hlZCBieSBgbWF0Y2hlcmBcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gdW5tYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0c2VlZFsgaSBdID0gISggbWF0Y2hlc1sgaSBdID0gZWxlbSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApIDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0aW5wdXRbIDAgXSA9IGVsZW07XG5cdFx0XHRcdFx0bWF0Y2hlciggaW5wdXQsIG51bGwsIHhtbCwgcmVzdWx0cyApO1xuXG5cdFx0XHRcdFx0Ly8gRG9uJ3Qga2VlcCB0aGUgZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdFx0XHRpbnB1dFsgMCBdID0gbnVsbDtcblx0XHRcdFx0XHRyZXR1cm4gIXJlc3VsdHMucG9wKCk7XG5cdFx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0XCJoYXNcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBTaXp6bGUoIHNlbGVjdG9yLCBlbGVtICkubGVuZ3RoID4gMDtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0XCJjb250YWluc1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS50ZXh0Q29udGVudCB8fCBnZXRUZXh0KCBlbGVtICkgKS5pbmRleE9mKCB0ZXh0ICkgPiAtMTtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0Ly8gXCJXaGV0aGVyIGFuIGVsZW1lbnQgaXMgcmVwcmVzZW50ZWQgYnkgYSA6bGFuZygpIHNlbGVjdG9yXG5cdFx0Ly8gaXMgYmFzZWQgc29sZWx5IG9uIHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWVcblx0XHQvLyBiZWluZyBlcXVhbCB0byB0aGUgaWRlbnRpZmllciBDLFxuXHRcdC8vIG9yIGJlZ2lubmluZyB3aXRoIHRoZSBpZGVudGlmaWVyIEMgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgXCItXCIuXG5cdFx0Ly8gVGhlIG1hdGNoaW5nIG9mIEMgYWdhaW5zdCB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlIGlzIHBlcmZvcm1lZCBjYXNlLWluc2Vuc2l0aXZlbHkuXG5cdFx0Ly8gVGhlIGlkZW50aWZpZXIgQyBkb2VzIG5vdCBoYXZlIHRvIGJlIGEgdmFsaWQgbGFuZ3VhZ2UgbmFtZS5cIlxuXHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jbGFuZy1wc2V1ZG9cblx0XHRcImxhbmdcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggbGFuZyApIHtcblxuXHRcdFx0Ly8gbGFuZyB2YWx1ZSBtdXN0IGJlIGEgdmFsaWQgaWRlbnRpZmllclxuXHRcdFx0aWYgKCAhcmlkZW50aWZpZXIudGVzdCggbGFuZyB8fCBcIlwiICkgKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggXCJ1bnN1cHBvcnRlZCBsYW5nOiBcIiArIGxhbmcgKTtcblx0XHRcdH1cblx0XHRcdGxhbmcgPSBsYW5nLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIGVsZW1MYW5nO1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0aWYgKCAoIGVsZW1MYW5nID0gZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0XHRcdFx0ZWxlbS5sYW5nIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBcInhtbDpsYW5nXCIgKSB8fCBlbGVtLmdldEF0dHJpYnV0ZSggXCJsYW5nXCIgKSApICkge1xuXG5cdFx0XHRcdFx0XHRlbGVtTGFuZyA9IGVsZW1MYW5nLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbUxhbmcgPT09IGxhbmcgfHwgZWxlbUxhbmcuaW5kZXhPZiggbGFuZyArIFwiLVwiICkgPT09IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IHdoaWxlICggKCBlbGVtID0gZWxlbS5wYXJlbnROb2RlICkgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdC8vIE1pc2NlbGxhbmVvdXNcblx0XHRcInRhcmdldFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdFx0cmV0dXJuIGhhc2ggJiYgaGFzaC5zbGljZSggMSApID09PSBlbGVtLmlkO1xuXHRcdH0sXG5cblx0XHRcInJvb3RcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jRWxlbTtcblx0XHR9LFxuXG5cdFx0XCJmb2N1c1wiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmXG5cdFx0XHRcdCggIWRvY3VtZW50Lmhhc0ZvY3VzIHx8IGRvY3VtZW50Lmhhc0ZvY3VzKCkgKSAmJlxuXHRcdFx0XHQhISggZWxlbS50eXBlIHx8IGVsZW0uaHJlZiB8fCB+ZWxlbS50YWJJbmRleCApO1xuXHRcdH0sXG5cblx0XHQvLyBCb29sZWFuIHByb3BlcnRpZXNcblx0XHRcImVuYWJsZWRcIjogY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIGZhbHNlICksXG5cdFx0XCJkaXNhYmxlZFwiOiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggdHJ1ZSApLFxuXG5cdFx0XCJjaGVja2VkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBJbiBDU1MzLCA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIGJvdGggY2hlY2tlZCBhbmQgc2VsZWN0ZWQgZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHR2YXIgbm9kZU5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gKCBub2RlTmFtZSA9PT0gXCJpbnB1dFwiICYmICEhZWxlbS5jaGVja2VkICkgfHxcblx0XHRcdFx0KCBub2RlTmFtZSA9PT0gXCJvcHRpb25cIiAmJiAhIWVsZW0uc2VsZWN0ZWQgKTtcblx0XHR9LFxuXG5cdFx0XCJzZWxlY3RlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gQWNjZXNzaW5nIHRoaXMgcHJvcGVydHkgbWFrZXMgc2VsZWN0ZWQtYnktZGVmYXVsdFxuXHRcdFx0Ly8gb3B0aW9ucyBpbiBTYWZhcmkgd29yayBwcm9wZXJseVxuXHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0XHRcdFx0ZWxlbS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLnNlbGVjdGVkID09PSB0cnVlO1xuXHRcdH0sXG5cblx0XHQvLyBDb250ZW50c1xuXHRcdFwiZW1wdHlcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jZW1wdHktcHNldWRvXG5cdFx0XHQvLyA6ZW1wdHkgaXMgbmVnYXRlZCBieSBlbGVtZW50ICgxKSBvciBjb250ZW50IG5vZGVzICh0ZXh0OiAzOyBjZGF0YTogNDsgZW50aXR5IHJlZjogNSksXG5cdFx0XHQvLyAgIGJ1dCBub3QgYnkgb3RoZXJzIChjb21tZW50OiA4OyBwcm9jZXNzaW5nIGluc3RydWN0aW9uOiA3OyBldGMuKVxuXHRcdFx0Ly8gbm9kZVR5cGUgPCA2IHdvcmtzIGJlY2F1c2UgYXR0cmlidXRlcyAoMikgZG8gbm90IGFwcGVhciBhcyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA8IDYgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJwYXJlbnRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gIUV4cHIucHNldWRvc1sgXCJlbXB0eVwiIF0oIGVsZW0gKTtcblx0XHR9LFxuXG5cdFx0Ly8gRWxlbWVudC9pbnB1dCB0eXBlc1xuXHRcdFwiaGVhZGVyXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIHJoZWFkZXIudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHRcImlucHV0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIHJpbnB1dHMudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHRcImJ1dHRvblwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IFwiYnV0dG9uXCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIjtcblx0XHR9LFxuXG5cdFx0XCJ0ZXh0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGF0dHI7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgJiZcblx0XHRcdFx0ZWxlbS50eXBlID09PSBcInRleHRcIiAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFPDhcblx0XHRcdFx0Ly8gTmV3IEhUTUw1IGF0dHJpYnV0ZSB2YWx1ZXMgKGUuZy4sIFwic2VhcmNoXCIpIGFwcGVhciB3aXRoIGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCJcblx0XHRcdFx0KCAoIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKSApID09IG51bGwgfHxcblx0XHRcdFx0XHRhdHRyLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dFwiICk7XG5cdFx0fSxcblxuXHRcdC8vIFBvc2l0aW9uLWluLWNvbGxlY3Rpb25cblx0XHRcImZpcnN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFsgMCBdO1xuXHRcdH0gKSxcblxuXHRcdFwibGFzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggX21hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIFsgbGVuZ3RoIC0gMSBdO1xuXHRcdH0gKSxcblxuXHRcdFwiZXFcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIF9tYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gWyBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50IF07XG5cdFx0fSApLFxuXG5cdFx0XCJldmVuXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcIm9kZFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDE7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJsdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgP1xuXHRcdFx0XHRhcmd1bWVudCArIGxlbmd0aCA6XG5cdFx0XHRcdGFyZ3VtZW50ID4gbGVuZ3RoID9cblx0XHRcdFx0XHRsZW5ndGggOlxuXHRcdFx0XHRcdGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyAtLWkgPj0gMDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwiZ3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgKytpIDwgbGVuZ3RoOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApXG5cdH1cbn07XG5cbkV4cHIucHNldWRvc1sgXCJudGhcIiBdID0gRXhwci5wc2V1ZG9zWyBcImVxXCIgXTtcblxuLy8gQWRkIGJ1dHRvbi9pbnB1dCB0eXBlIHBzZXVkb3NcbmZvciAoIGkgaW4geyByYWRpbzogdHJ1ZSwgY2hlY2tib3g6IHRydWUsIGZpbGU6IHRydWUsIHBhc3N3b3JkOiB0cnVlLCBpbWFnZTogdHJ1ZSB9ICkge1xuXHRFeHByLnBzZXVkb3NbIGkgXSA9IGNyZWF0ZUlucHV0UHNldWRvKCBpICk7XG59XG5mb3IgKCBpIGluIHsgc3VibWl0OiB0cnVlLCByZXNldDogdHJ1ZSB9ICkge1xuXHRFeHByLnBzZXVkb3NbIGkgXSA9IGNyZWF0ZUJ1dHRvblBzZXVkbyggaSApO1xufVxuXG4vLyBFYXN5IEFQSSBmb3IgY3JlYXRpbmcgbmV3IHNldEZpbHRlcnNcbmZ1bmN0aW9uIHNldEZpbHRlcnMoKSB7fVxuc2V0RmlsdGVycy5wcm90b3R5cGUgPSBFeHByLmZpbHRlcnMgPSBFeHByLnBzZXVkb3M7XG5FeHByLnNldEZpbHRlcnMgPSBuZXcgc2V0RmlsdGVycygpO1xuXG50b2tlbml6ZSA9IFNpenpsZS50b2tlbml6ZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgcGFyc2VPbmx5ICkge1xuXHR2YXIgbWF0Y2hlZCwgbWF0Y2gsIHRva2VucywgdHlwZSxcblx0XHRzb0ZhciwgZ3JvdXBzLCBwcmVGaWx0ZXJzLFxuXHRcdGNhY2hlZCA9IHRva2VuQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXTtcblxuXHRpZiAoIGNhY2hlZCApIHtcblx0XHRyZXR1cm4gcGFyc2VPbmx5ID8gMCA6IGNhY2hlZC5zbGljZSggMCApO1xuXHR9XG5cblx0c29GYXIgPSBzZWxlY3Rvcjtcblx0Z3JvdXBzID0gW107XG5cdHByZUZpbHRlcnMgPSBFeHByLnByZUZpbHRlcjtcblxuXHR3aGlsZSAoIHNvRmFyICkge1xuXG5cdFx0Ly8gQ29tbWEgYW5kIGZpcnN0IHJ1blxuXHRcdGlmICggIW1hdGNoZWQgfHwgKCBtYXRjaCA9IHJjb21tYS5leGVjKCBzb0ZhciApICkgKSB7XG5cdFx0XHRpZiAoIG1hdGNoICkge1xuXG5cdFx0XHRcdC8vIERvbid0IGNvbnN1bWUgdHJhaWxpbmcgY29tbWFzIGFzIHZhbGlkXG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoWyAwIF0ubGVuZ3RoICkgfHwgc29GYXI7XG5cdFx0XHR9XG5cdFx0XHRncm91cHMucHVzaCggKCB0b2tlbnMgPSBbXSApICk7XG5cdFx0fVxuXG5cdFx0bWF0Y2hlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gQ29tYmluYXRvcnNcblx0XHRpZiAoICggbWF0Y2ggPSByY29tYmluYXRvcnMuZXhlYyggc29GYXIgKSApICkge1xuXHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHR0b2tlbnMucHVzaCgge1xuXHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblxuXHRcdFx0XHQvLyBDYXN0IGRlc2NlbmRhbnQgY29tYmluYXRvcnMgdG8gc3BhY2Vcblx0XHRcdFx0dHlwZTogbWF0Y2hbIDAgXS5yZXBsYWNlKCBydHJpbSwgXCIgXCIgKVxuXHRcdFx0fSApO1xuXHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hlZC5sZW5ndGggKTtcblx0XHR9XG5cblx0XHQvLyBGaWx0ZXJzXG5cdFx0Zm9yICggdHlwZSBpbiBFeHByLmZpbHRlciApIHtcblx0XHRcdGlmICggKCBtYXRjaCA9IG1hdGNoRXhwclsgdHlwZSBdLmV4ZWMoIHNvRmFyICkgKSAmJiAoICFwcmVGaWx0ZXJzWyB0eXBlIF0gfHxcblx0XHRcdFx0KCBtYXRjaCA9IHByZUZpbHRlcnNbIHR5cGUgXSggbWF0Y2ggKSApICkgKSB7XG5cdFx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0XHR0b2tlbnMucHVzaCgge1xuXHRcdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXHRcdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdFx0bWF0Y2hlczogbWF0Y2hcblx0XHRcdFx0fSApO1xuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggIW1hdGNoZWQgKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgaW52YWxpZCBleGNlc3Ncblx0Ly8gaWYgd2UncmUganVzdCBwYXJzaW5nXG5cdC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3Igb3IgcmV0dXJuIHRva2Vuc1xuXHRyZXR1cm4gcGFyc2VPbmx5ID9cblx0XHRzb0Zhci5sZW5ndGggOlxuXHRcdHNvRmFyID9cblx0XHRcdFNpenpsZS5lcnJvciggc2VsZWN0b3IgKSA6XG5cblx0XHRcdC8vIENhY2hlIHRoZSB0b2tlbnNcblx0XHRcdHRva2VuQ2FjaGUoIHNlbGVjdG9yLCBncm91cHMgKS5zbGljZSggMCApO1xufTtcblxuZnVuY3Rpb24gdG9TZWxlY3RvciggdG9rZW5zICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRzZWxlY3RvciA9IFwiXCI7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHNlbGVjdG9yICs9IHRva2Vuc1sgaSBdLnZhbHVlO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rvcjtcbn1cblxuZnVuY3Rpb24gYWRkQ29tYmluYXRvciggbWF0Y2hlciwgY29tYmluYXRvciwgYmFzZSApIHtcblx0dmFyIGRpciA9IGNvbWJpbmF0b3IuZGlyLFxuXHRcdHNraXAgPSBjb21iaW5hdG9yLm5leHQsXG5cdFx0a2V5ID0gc2tpcCB8fCBkaXIsXG5cdFx0Y2hlY2tOb25FbGVtZW50cyA9IGJhc2UgJiYga2V5ID09PSBcInBhcmVudE5vZGVcIixcblx0XHRkb25lTmFtZSA9IGRvbmUrKztcblxuXHRyZXR1cm4gY29tYmluYXRvci5maXJzdCA/XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGNsb3Nlc3QgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IDpcblxuXHRcdC8vIENoZWNrIGFnYWluc3QgYWxsIGFuY2VzdG9yL3ByZWNlZGluZyBlbGVtZW50c1xuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgb2xkQ2FjaGUsIHVuaXF1ZUNhY2hlLCBvdXRlckNhY2hlLFxuXHRcdFx0XHRuZXdDYWNoZSA9IFsgZGlycnVucywgZG9uZU5hbWUgXTtcblxuXHRcdFx0Ly8gV2UgY2FuJ3Qgc2V0IGFyYml0cmFyeSBkYXRhIG9uIFhNTCBub2Rlcywgc28gdGhleSBkb24ndCBiZW5lZml0IGZyb20gY29tYmluYXRvciBjYWNoaW5nXG5cdFx0XHRpZiAoIHhtbCApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gZWxlbVsgZXhwYW5kbyBdIHx8ICggZWxlbVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdGlmICggc2tpcCAmJiBza2lwID09PSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW0gPSBlbGVtWyBkaXIgXSB8fCBlbGVtO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggKCBvbGRDYWNoZSA9IHVuaXF1ZUNhY2hlWyBrZXkgXSApICYmXG5cdFx0XHRcdFx0XHRcdG9sZENhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgb2xkQ2FjaGVbIDEgXSA9PT0gZG9uZU5hbWUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQXNzaWduIHRvIG5ld0NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0cmV0dXJuICggbmV3Q2FjaGVbIDIgXSA9IG9sZENhY2hlWyAyIF0gKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmV1c2UgbmV3Y2FjaGUgc28gcmVzdWx0cyBiYWNrLXByb3BhZ2F0ZSB0byBwcmV2aW91cyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsga2V5IF0gPSBuZXdDYWNoZTtcblxuXHRcdFx0XHRcdFx0XHQvLyBBIG1hdGNoIG1lYW5zIHdlJ3JlIGRvbmU7IGEgZmFpbCBtZWFucyB3ZSBoYXZlIHRvIGtlZXAgY2hlY2tpbmdcblx0XHRcdFx0XHRcdFx0aWYgKCAoIG5ld0NhY2hlWyAyIF0gPSBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICkge1xuXHRyZXR1cm4gbWF0Y2hlcnMubGVuZ3RoID4gMSA/XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBpID0gbWF0Y2hlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggIW1hdGNoZXJzWyBpIF0oIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSA6XG5cdFx0bWF0Y2hlcnNbIDAgXTtcbn1cblxuZnVuY3Rpb24gbXVsdGlwbGVDb250ZXh0cyggc2VsZWN0b3IsIGNvbnRleHRzLCByZXN1bHRzICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gY29udGV4dHMubGVuZ3RoO1xuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRTaXp6bGUoIHNlbGVjdG9yLCBjb250ZXh0c1sgaSBdLCByZXN1bHRzICk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGNvbmRlbnNlKCB1bm1hdGNoZWQsIG1hcCwgZmlsdGVyLCBjb250ZXh0LCB4bWwgKSB7XG5cdHZhciBlbGVtLFxuXHRcdG5ld1VubWF0Y2hlZCA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGxlbiA9IHVubWF0Y2hlZC5sZW5ndGgsXG5cdFx0bWFwcGVkID0gbWFwICE9IG51bGw7XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoIGVsZW0gPSB1bm1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0aWYgKCAhZmlsdGVyIHx8IGZpbHRlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdG5ld1VubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdGlmICggbWFwcGVkICkge1xuXHRcdFx0XHRcdG1hcC5wdXNoKCBpICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbmV3VW5tYXRjaGVkO1xufVxuXG5mdW5jdGlvbiBzZXRNYXRjaGVyKCBwcmVGaWx0ZXIsIHNlbGVjdG9yLCBtYXRjaGVyLCBwb3N0RmlsdGVyLCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKSB7XG5cdGlmICggcG9zdEZpbHRlciAmJiAhcG9zdEZpbHRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaWx0ZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmlsdGVyICk7XG5cdH1cblx0aWYgKCBwb3N0RmluZGVyICYmICFwb3N0RmluZGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbmRlciA9IHNldE1hdGNoZXIoIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApO1xuXHR9XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCByZXN1bHRzLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0dmFyIHRlbXAsIGksIGVsZW0sXG5cdFx0XHRwcmVNYXAgPSBbXSxcblx0XHRcdHBvc3RNYXAgPSBbXSxcblx0XHRcdHByZWV4aXN0aW5nID0gcmVzdWx0cy5sZW5ndGgsXG5cblx0XHRcdC8vIEdldCBpbml0aWFsIGVsZW1lbnRzIGZyb20gc2VlZCBvciBjb250ZXh0XG5cdFx0XHRlbGVtcyA9IHNlZWQgfHwgbXVsdGlwbGVDb250ZXh0cyhcblx0XHRcdFx0c2VsZWN0b3IgfHwgXCIqXCIsXG5cdFx0XHRcdGNvbnRleHQubm9kZVR5cGUgPyBbIGNvbnRleHQgXSA6IGNvbnRleHQsXG5cdFx0XHRcdFtdXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBQcmVmaWx0ZXIgdG8gZ2V0IG1hdGNoZXIgaW5wdXQsIHByZXNlcnZpbmcgYSBtYXAgZm9yIHNlZWQtcmVzdWx0cyBzeW5jaHJvbml6YXRpb25cblx0XHRcdG1hdGNoZXJJbiA9IHByZUZpbHRlciAmJiAoIHNlZWQgfHwgIXNlbGVjdG9yICkgP1xuXHRcdFx0XHRjb25kZW5zZSggZWxlbXMsIHByZU1hcCwgcHJlRmlsdGVyLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdGVsZW1zLFxuXG5cdFx0XHRtYXRjaGVyT3V0ID0gbWF0Y2hlciA/XG5cblx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBhIHBvc3RGaW5kZXIsIG9yIGZpbHRlcmVkIHNlZWQsIG9yIG5vbi1zZWVkIHBvc3RGaWx0ZXIgb3IgcHJlZXhpc3RpbmcgcmVzdWx0cyxcblx0XHRcdFx0cG9zdEZpbmRlciB8fCAoIHNlZWQgPyBwcmVGaWx0ZXIgOiBwcmVleGlzdGluZyB8fCBwb3N0RmlsdGVyICkgP1xuXG5cdFx0XHRcdFx0Ly8gLi4uaW50ZXJtZWRpYXRlIHByb2Nlc3NpbmcgaXMgbmVjZXNzYXJ5XG5cdFx0XHRcdFx0W10gOlxuXG5cdFx0XHRcdFx0Ly8gLi4ub3RoZXJ3aXNlIHVzZSByZXN1bHRzIGRpcmVjdGx5XG5cdFx0XHRcdFx0cmVzdWx0cyA6XG5cdFx0XHRcdG1hdGNoZXJJbjtcblxuXHRcdC8vIEZpbmQgcHJpbWFyeSBtYXRjaGVzXG5cdFx0aWYgKCBtYXRjaGVyICkge1xuXHRcdFx0bWF0Y2hlciggbWF0Y2hlckluLCBtYXRjaGVyT3V0LCBjb250ZXh0LCB4bWwgKTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSBwb3N0RmlsdGVyXG5cdFx0aWYgKCBwb3N0RmlsdGVyICkge1xuXHRcdFx0dGVtcCA9IGNvbmRlbnNlKCBtYXRjaGVyT3V0LCBwb3N0TWFwICk7XG5cdFx0XHRwb3N0RmlsdGVyKCB0ZW1wLCBbXSwgY29udGV4dCwgeG1sICk7XG5cblx0XHRcdC8vIFVuLW1hdGNoIGZhaWxpbmcgZWxlbWVudHMgYnkgbW92aW5nIHRoZW0gYmFjayB0byBtYXRjaGVySW5cblx0XHRcdGkgPSB0ZW1wLmxlbmd0aDtcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoICggZWxlbSA9IHRlbXBbIGkgXSApICkge1xuXHRcdFx0XHRcdG1hdGNoZXJPdXRbIHBvc3RNYXBbIGkgXSBdID0gISggbWF0Y2hlckluWyBwb3N0TWFwWyBpIF0gXSA9IGVsZW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggc2VlZCApIHtcblx0XHRcdGlmICggcG9zdEZpbmRlciB8fCBwcmVGaWx0ZXIgKSB7XG5cdFx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIEdldCB0aGUgZmluYWwgbWF0Y2hlck91dCBieSBjb25kZW5zaW5nIHRoaXMgaW50ZXJtZWRpYXRlIGludG8gcG9zdEZpbmRlciBjb250ZXh0c1xuXHRcdFx0XHRcdHRlbXAgPSBbXTtcblx0XHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IG1hdGNoZXJPdXRbIGkgXSApICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJlc3RvcmUgbWF0Y2hlckluIHNpbmNlIGVsZW0gaXMgbm90IHlldCBhIGZpbmFsIG1hdGNoXG5cdFx0XHRcdFx0XHRcdHRlbXAucHVzaCggKCBtYXRjaGVySW5bIGkgXSA9IGVsZW0gKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCAoIG1hdGNoZXJPdXQgPSBbXSApLCB0ZW1wLCB4bWwgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE1vdmUgbWF0Y2hlZCBlbGVtZW50cyBmcm9tIHNlZWQgdG8gcmVzdWx0cyB0byBrZWVwIHRoZW0gc3luY2hyb25pemVkXG5cdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBtYXRjaGVyT3V0WyBpIF0gKSAmJlxuXHRcdFx0XHRcdFx0KCB0ZW1wID0gcG9zdEZpbmRlciA/IGluZGV4T2YoIHNlZWQsIGVsZW0gKSA6IHByZU1hcFsgaSBdICkgPiAtMSApIHtcblxuXHRcdFx0XHRcdFx0c2VlZFsgdGVtcCBdID0gISggcmVzdWx0c1sgdGVtcCBdID0gZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Ly8gQWRkIGVsZW1lbnRzIHRvIHJlc3VsdHMsIHRocm91Z2ggcG9zdEZpbmRlciBpZiBkZWZpbmVkXG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXJPdXQgPSBjb25kZW5zZShcblx0XHRcdFx0bWF0Y2hlck91dCA9PT0gcmVzdWx0cyA/XG5cdFx0XHRcdFx0bWF0Y2hlck91dC5zcGxpY2UoIHByZWV4aXN0aW5nLCBtYXRjaGVyT3V0Lmxlbmd0aCApIDpcblx0XHRcdFx0XHRtYXRjaGVyT3V0XG5cdFx0XHQpO1xuXHRcdFx0aWYgKCBwb3N0RmluZGVyICkge1xuXHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCByZXN1bHRzLCBtYXRjaGVyT3V0LCB4bWwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIG1hdGNoZXJPdXQgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Ub2tlbnMoIHRva2VucyApIHtcblx0dmFyIGNoZWNrQ29udGV4dCwgbWF0Y2hlciwgaixcblx0XHRsZW4gPSB0b2tlbnMubGVuZ3RoLFxuXHRcdGxlYWRpbmdSZWxhdGl2ZSA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgMCBdLnR5cGUgXSxcblx0XHRpbXBsaWNpdFJlbGF0aXZlID0gbGVhZGluZ1JlbGF0aXZlIHx8IEV4cHIucmVsYXRpdmVbIFwiIFwiIF0sXG5cdFx0aSA9IGxlYWRpbmdSZWxhdGl2ZSA/IDEgOiAwLFxuXG5cdFx0Ly8gVGhlIGZvdW5kYXRpb25hbCBtYXRjaGVyIGVuc3VyZXMgdGhhdCBlbGVtZW50cyBhcmUgcmVhY2hhYmxlIGZyb20gdG9wLWxldmVsIGNvbnRleHQocylcblx0XHRtYXRjaENvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBjaGVja0NvbnRleHQ7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoQW55Q29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YoIGNoZWNrQ29udGV4dCwgZWxlbSApID4gLTE7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoZXJzID0gWyBmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIHJldCA9ICggIWxlYWRpbmdSZWxhdGl2ZSAmJiAoIHhtbCB8fCBjb250ZXh0ICE9PSBvdXRlcm1vc3RDb250ZXh0ICkgKSB8fCAoXG5cdFx0XHRcdCggY2hlY2tDb250ZXh0ID0gY29udGV4dCApLm5vZGVUeXBlID9cblx0XHRcdFx0XHRtYXRjaENvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0XHRtYXRjaEFueUNvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApICk7XG5cblx0XHRcdC8vIEF2b2lkIGhhbmdpbmcgb250byBlbGVtZW50IChpc3N1ZSAjMjk5KVxuXHRcdFx0Y2hlY2tDb250ZXh0ID0gbnVsbDtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSBdO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKCBtYXRjaGVyID0gRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyBpIF0udHlwZSBdICkgKSB7XG5cdFx0XHRtYXRjaGVycyA9IFsgYWRkQ29tYmluYXRvciggZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksIG1hdGNoZXIgKSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyID0gRXhwci5maWx0ZXJbIHRva2Vuc1sgaSBdLnR5cGUgXS5hcHBseSggbnVsbCwgdG9rZW5zWyBpIF0ubWF0Y2hlcyApO1xuXG5cdFx0XHQvLyBSZXR1cm4gc3BlY2lhbCB1cG9uIHNlZWluZyBhIHBvc2l0aW9uYWwgbWF0Y2hlclxuXHRcdFx0aWYgKCBtYXRjaGVyWyBleHBhbmRvIF0gKSB7XG5cblx0XHRcdFx0Ly8gRmluZCB0aGUgbmV4dCByZWxhdGl2ZSBvcGVyYXRvciAoaWYgYW55KSBmb3IgcHJvcGVyIGhhbmRsaW5nXG5cdFx0XHRcdGogPSArK2k7XG5cdFx0XHRcdGZvciAoIDsgaiA8IGxlbjsgaisrICkge1xuXHRcdFx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyBqIF0udHlwZSBdICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzZXRNYXRjaGVyKFxuXHRcdFx0XHRcdGkgPiAxICYmIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLFxuXHRcdFx0XHRcdGkgPiAxICYmIHRvU2VsZWN0b3IoXG5cblx0XHRcdFx0XHQvLyBJZiB0aGUgcHJlY2VkaW5nIHRva2VuIHdhcyBhIGRlc2NlbmRhbnQgY29tYmluYXRvciwgaW5zZXJ0IGFuIGltcGxpY2l0IGFueS1lbGVtZW50IGAqYFxuXHRcdFx0XHRcdHRva2Vuc1xuXHRcdFx0XHRcdFx0LnNsaWNlKCAwLCBpIC0gMSApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCB7IHZhbHVlOiB0b2tlbnNbIGkgLSAyIF0udHlwZSA9PT0gXCIgXCIgPyBcIipcIiA6IFwiXCIgfSApXG5cdFx0XHRcdFx0KS5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksXG5cdFx0XHRcdFx0bWF0Y2hlcixcblx0XHRcdFx0XHRpIDwgaiAmJiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zLnNsaWNlKCBpLCBqICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIG1hdGNoZXJGcm9tVG9rZW5zKCAoIHRva2VucyA9IHRva2Vucy5zbGljZSggaiApICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIHRvU2VsZWN0b3IoIHRva2VucyApXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVycy5wdXNoKCBtYXRjaGVyICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSB7XG5cdHZhciBieVNldCA9IHNldE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0YnlFbGVtZW50ID0gZWxlbWVudE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0c3VwZXJNYXRjaGVyID0gZnVuY3Rpb24oIHNlZWQsIGNvbnRleHQsIHhtbCwgcmVzdWx0cywgb3V0ZXJtb3N0ICkge1xuXHRcdFx0dmFyIGVsZW0sIGosIG1hdGNoZXIsXG5cdFx0XHRcdG1hdGNoZWRDb3VudCA9IDAsXG5cdFx0XHRcdGkgPSBcIjBcIixcblx0XHRcdFx0dW5tYXRjaGVkID0gc2VlZCAmJiBbXSxcblx0XHRcdFx0c2V0TWF0Y2hlZCA9IFtdLFxuXHRcdFx0XHRjb250ZXh0QmFja3VwID0gb3V0ZXJtb3N0Q29udGV4dCxcblxuXHRcdFx0XHQvLyBXZSBtdXN0IGFsd2F5cyBoYXZlIGVpdGhlciBzZWVkIGVsZW1lbnRzIG9yIG91dGVybW9zdCBjb250ZXh0XG5cdFx0XHRcdGVsZW1zID0gc2VlZCB8fCBieUVsZW1lbnQgJiYgRXhwci5maW5kWyBcIlRBR1wiIF0oIFwiKlwiLCBvdXRlcm1vc3QgKSxcblxuXHRcdFx0XHQvLyBVc2UgaW50ZWdlciBkaXJydW5zIGlmZiB0aGlzIGlzIHRoZSBvdXRlcm1vc3QgbWF0Y2hlclxuXHRcdFx0XHRkaXJydW5zVW5pcXVlID0gKCBkaXJydW5zICs9IGNvbnRleHRCYWNrdXAgPT0gbnVsbCA/IDEgOiBNYXRoLnJhbmRvbSgpIHx8IDAuMSApLFxuXHRcdFx0XHRsZW4gPSBlbGVtcy5sZW5ndGg7XG5cblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0ID09IGRvY3VtZW50IHx8IGNvbnRleHQgfHwgb3V0ZXJtb3N0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgZWxlbWVudHMgcGFzc2luZyBlbGVtZW50TWF0Y2hlcnMgZGlyZWN0bHkgdG8gcmVzdWx0c1xuXHRcdFx0Ly8gU3VwcG9ydDogSUU8OSwgU2FmYXJpXG5cdFx0XHQvLyBUb2xlcmF0ZSBOb2RlTGlzdCBwcm9wZXJ0aWVzIChJRTogXCJsZW5ndGhcIjsgU2FmYXJpOiA8bnVtYmVyPikgbWF0Y2hpbmcgZWxlbWVudHMgYnkgaWRcblx0XHRcdGZvciAoIDsgaSAhPT0gbGVuICYmICggZWxlbSA9IGVsZW1zWyBpIF0gKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggYnlFbGVtZW50ICYmIGVsZW0gKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0XHRcdGlmICggIWNvbnRleHQgJiYgZWxlbS5vd25lckRvY3VtZW50ICE9IGRvY3VtZW50ICkge1xuXHRcdFx0XHRcdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0XHRcdFx0XHRcdHhtbCA9ICFkb2N1bWVudElzSFRNTDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoZXIgPSBlbGVtZW50TWF0Y2hlcnNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQgfHwgZG9jdW1lbnQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhY2sgdW5tYXRjaGVkIGVsZW1lbnRzIGZvciBzZXQgZmlsdGVyc1xuXHRcdFx0XHRpZiAoIGJ5U2V0ICkge1xuXG5cdFx0XHRcdFx0Ly8gVGhleSB3aWxsIGhhdmUgZ29uZSB0aHJvdWdoIGFsbCBwb3NzaWJsZSBtYXRjaGVyc1xuXHRcdFx0XHRcdGlmICggKCBlbGVtID0gIW1hdGNoZXIgJiYgZWxlbSApICkge1xuXHRcdFx0XHRcdFx0bWF0Y2hlZENvdW50LS07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTGVuZ3RoZW4gdGhlIGFycmF5IGZvciBldmVyeSBlbGVtZW50LCBtYXRjaGVkIG9yIG5vdFxuXHRcdFx0XHRcdGlmICggc2VlZCApIHtcblx0XHRcdFx0XHRcdHVubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGBpYCBpcyBub3cgdGhlIGNvdW50IG9mIGVsZW1lbnRzIHZpc2l0ZWQgYWJvdmUsIGFuZCBhZGRpbmcgaXQgdG8gYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIG1ha2VzIHRoZSBsYXR0ZXIgbm9ubmVnYXRpdmUuXG5cdFx0XHRtYXRjaGVkQ291bnQgKz0gaTtcblxuXHRcdFx0Ly8gQXBwbHkgc2V0IGZpbHRlcnMgdG8gdW5tYXRjaGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBOT1RFOiBUaGlzIGNhbiBiZSBza2lwcGVkIGlmIHRoZXJlIGFyZSBubyB1bm1hdGNoZWQgZWxlbWVudHMgKGkuZS4sIGBtYXRjaGVkQ291bnRgXG5cdFx0XHQvLyBlcXVhbHMgYGlgKSwgdW5sZXNzIHdlIGRpZG4ndCB2aXNpdCBfYW55XyBlbGVtZW50cyBpbiB0aGUgYWJvdmUgbG9vcCBiZWNhdXNlIHdlIGhhdmVcblx0XHRcdC8vIG5vIGVsZW1lbnQgbWF0Y2hlcnMgYW5kIG5vIHNlZWQuXG5cdFx0XHQvLyBJbmNyZW1lbnRpbmcgYW4gaW5pdGlhbGx5LXN0cmluZyBcIjBcIiBgaWAgYWxsb3dzIGBpYCB0byByZW1haW4gYSBzdHJpbmcgb25seSBpbiB0aGF0XG5cdFx0XHQvLyBjYXNlLCB3aGljaCB3aWxsIHJlc3VsdCBpbiBhIFwiMDBcIiBgbWF0Y2hlZENvdW50YCB0aGF0IGRpZmZlcnMgZnJvbSBgaWAgYnV0IGlzIGFsc29cblx0XHRcdC8vIG51bWVyaWNhbGx5IHplcm8uXG5cdFx0XHRpZiAoIGJ5U2V0ICYmIGkgIT09IG1hdGNoZWRDb3VudCApIHtcblx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdHdoaWxlICggKCBtYXRjaGVyID0gc2V0TWF0Y2hlcnNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlciggdW5tYXRjaGVkLCBzZXRNYXRjaGVkLCBjb250ZXh0LCB4bWwgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc2VlZCApIHtcblxuXHRcdFx0XHRcdC8vIFJlaW50ZWdyYXRlIGVsZW1lbnQgbWF0Y2hlcyB0byBlbGltaW5hdGUgdGhlIG5lZWQgZm9yIHNvcnRpbmdcblx0XHRcdFx0XHRpZiAoIG1hdGNoZWRDb3VudCA+IDAgKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAhKCB1bm1hdGNoZWRbIGkgXSB8fCBzZXRNYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRzZXRNYXRjaGVkWyBpIF0gPSBwb3AuY2FsbCggcmVzdWx0cyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGlzY2FyZCBpbmRleCBwbGFjZWhvbGRlciB2YWx1ZXMgdG8gZ2V0IG9ubHkgYWN0dWFsIG1hdGNoZXNcblx0XHRcdFx0XHRzZXRNYXRjaGVkID0gY29uZGVuc2UoIHNldE1hdGNoZWQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBtYXRjaGVzIHRvIHJlc3VsdHNcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2V0TWF0Y2hlZCApO1xuXG5cdFx0XHRcdC8vIFNlZWRsZXNzIHNldCBtYXRjaGVzIHN1Y2NlZWRpbmcgbXVsdGlwbGUgc3VjY2Vzc2Z1bCBtYXRjaGVycyBzdGlwdWxhdGUgc29ydGluZ1xuXHRcdFx0XHRpZiAoIG91dGVybW9zdCAmJiAhc2VlZCAmJiBzZXRNYXRjaGVkLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHQoIG1hdGNoZWRDb3VudCArIHNldE1hdGNoZXJzLmxlbmd0aCApID4gMSApIHtcblxuXHRcdFx0XHRcdFNpenpsZS51bmlxdWVTb3J0KCByZXN1bHRzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3ZlcnJpZGUgbWFuaXB1bGF0aW9uIG9mIGdsb2JhbHMgYnkgbmVzdGVkIG1hdGNoZXJzXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0QmFja3VwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5tYXRjaGVkO1xuXHRcdH07XG5cblx0cmV0dXJuIGJ5U2V0ID9cblx0XHRtYXJrRnVuY3Rpb24oIHN1cGVyTWF0Y2hlciApIDpcblx0XHRzdXBlck1hdGNoZXI7XG59XG5cbmNvbXBpbGUgPSBTaXp6bGUuY29tcGlsZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgbWF0Y2ggLyogSW50ZXJuYWwgVXNlIE9ubHkgKi8gKSB7XG5cdHZhciBpLFxuXHRcdHNldE1hdGNoZXJzID0gW10sXG5cdFx0ZWxlbWVudE1hdGNoZXJzID0gW10sXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggIWNhY2hlZCApIHtcblxuXHRcdC8vIEdlbmVyYXRlIGEgZnVuY3Rpb24gb2YgcmVjdXJzaXZlIGZ1bmN0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvIGNoZWNrIGVhY2ggZWxlbWVudFxuXHRcdGlmICggIW1hdGNoICkge1xuXHRcdFx0bWF0Y2ggPSB0b2tlbml6ZSggc2VsZWN0b3IgKTtcblx0XHR9XG5cdFx0aSA9IG1hdGNoLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdGNhY2hlZCA9IG1hdGNoZXJGcm9tVG9rZW5zKCBtYXRjaFsgaSBdICk7XG5cdFx0XHRpZiAoIGNhY2hlZFsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRzZXRNYXRjaGVycy5wdXNoKCBjYWNoZWQgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnRNYXRjaGVycy5wdXNoKCBjYWNoZWQgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWNoZSB0aGUgY29tcGlsZWQgZnVuY3Rpb25cblx0XHRjYWNoZWQgPSBjb21waWxlckNhY2hlKFxuXHRcdFx0c2VsZWN0b3IsXG5cdFx0XHRtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKVxuXHRcdCk7XG5cblx0XHQvLyBTYXZlIHNlbGVjdG9yIGFuZCB0b2tlbml6YXRpb25cblx0XHRjYWNoZWQuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0fVxuXHRyZXR1cm4gY2FjaGVkO1xufTtcblxuLyoqXG4gKiBBIGxvdy1sZXZlbCBzZWxlY3Rpb24gZnVuY3Rpb24gdGhhdCB3b3JrcyB3aXRoIFNpenpsZSdzIGNvbXBpbGVkXG4gKiAgc2VsZWN0b3IgZnVuY3Rpb25zXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gc2VsZWN0b3IgQSBzZWxlY3RvciBvciBhIHByZS1jb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uIGJ1aWx0IHdpdGggU2l6emxlLmNvbXBpbGVcbiAqIEBwYXJhbSB7RWxlbWVudH0gY29udGV4dFxuICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdHNdXG4gKiBAcGFyYW0ge0FycmF5fSBbc2VlZF0gQSBzZXQgb2YgZWxlbWVudHMgdG8gbWF0Y2ggYWdhaW5zdFxuICovXG5zZWxlY3QgPSBTaXp6bGUuc2VsZWN0ID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHR2YXIgaSwgdG9rZW5zLCB0b2tlbiwgdHlwZSwgZmluZCxcblx0XHRjb21waWxlZCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiICYmIHNlbGVjdG9yLFxuXHRcdG1hdGNoID0gIXNlZWQgJiYgdG9rZW5pemUoICggc2VsZWN0b3IgPSBjb21waWxlZC5zZWxlY3RvciB8fCBzZWxlY3RvciApICk7XG5cblx0cmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0Ly8gVHJ5IHRvIG1pbmltaXplIG9wZXJhdGlvbnMgaWYgdGhlcmUgaXMgb25seSBvbmUgc2VsZWN0b3IgaW4gdGhlIGxpc3QgYW5kIG5vIHNlZWRcblx0Ly8gKHRoZSBsYXR0ZXIgb2Ygd2hpY2ggZ3VhcmFudGVlcyB1cyBjb250ZXh0KVxuXHRpZiAoIG1hdGNoLmxlbmd0aCA9PT0gMSApIHtcblxuXHRcdC8vIFJlZHVjZSBjb250ZXh0IGlmIHRoZSBsZWFkaW5nIGNvbXBvdW5kIHNlbGVjdG9yIGlzIGFuIElEXG5cdFx0dG9rZW5zID0gbWF0Y2hbIDAgXSA9IG1hdGNoWyAwIF0uc2xpY2UoIDAgKTtcblx0XHRpZiAoIHRva2Vucy5sZW5ndGggPiAyICYmICggdG9rZW4gPSB0b2tlbnNbIDAgXSApLnR5cGUgPT09IFwiSURcIiAmJlxuXHRcdFx0Y29udGV4dC5ub2RlVHlwZSA9PT0gOSAmJiBkb2N1bWVudElzSFRNTCAmJiBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIDEgXS50eXBlIF0gKSB7XG5cblx0XHRcdGNvbnRleHQgPSAoIEV4cHIuZmluZFsgXCJJRFwiIF0oIHRva2VuLm1hdGNoZXNbIDAgXVxuXHRcdFx0XHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSwgY29udGV4dCApIHx8IFtdIClbIDAgXTtcblx0XHRcdGlmICggIWNvbnRleHQgKSB7XG5cdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHQvLyBQcmVjb21waWxlZCBtYXRjaGVycyB3aWxsIHN0aWxsIHZlcmlmeSBhbmNlc3RyeSwgc28gc3RlcCB1cCBhIGxldmVsXG5cdFx0XHR9IGVsc2UgaWYgKCBjb21waWxlZCApIHtcblx0XHRcdFx0Y29udGV4dCA9IGNvbnRleHQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zbGljZSggdG9rZW5zLnNoaWZ0KCkudmFsdWUubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmV0Y2ggYSBzZWVkIHNldCBmb3IgcmlnaHQtdG8tbGVmdCBtYXRjaGluZ1xuXHRcdGkgPSBtYXRjaEV4cHJbIFwibmVlZHNDb250ZXh0XCIgXS50ZXN0KCBzZWxlY3RvciApID8gMCA6IHRva2Vucy5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHR0b2tlbiA9IHRva2Vuc1sgaSBdO1xuXG5cdFx0XHQvLyBBYm9ydCBpZiB3ZSBoaXQgYSBjb21iaW5hdG9yXG5cdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbICggdHlwZSA9IHRva2VuLnR5cGUgKSBdICkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmICggKCBmaW5kID0gRXhwci5maW5kWyB0eXBlIF0gKSApIHtcblxuXHRcdFx0XHQvLyBTZWFyY2gsIGV4cGFuZGluZyBjb250ZXh0IGZvciBsZWFkaW5nIHNpYmxpbmcgY29tYmluYXRvcnNcblx0XHRcdFx0aWYgKCAoIHNlZWQgPSBmaW5kKFxuXHRcdFx0XHRcdHRva2VuLm1hdGNoZXNbIDAgXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLFxuXHRcdFx0XHRcdHJzaWJsaW5nLnRlc3QoIHRva2Vuc1sgMCBdLnR5cGUgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHRcblx0XHRcdFx0KSApICkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgc2VlZCBpcyBlbXB0eSBvciBubyB0b2tlbnMgcmVtYWluLCB3ZSBjYW4gcmV0dXJuIGVhcmx5XG5cdFx0XHRcdFx0dG9rZW5zLnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdHNlbGVjdG9yID0gc2VlZC5sZW5ndGggJiYgdG9TZWxlY3RvciggdG9rZW5zICk7XG5cdFx0XHRcdFx0aWYgKCAhc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBzZWVkICk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENvbXBpbGUgYW5kIGV4ZWN1dGUgYSBmaWx0ZXJpbmcgZnVuY3Rpb24gaWYgb25lIGlzIG5vdCBwcm92aWRlZFxuXHQvLyBQcm92aWRlIGBtYXRjaGAgdG8gYXZvaWQgcmV0b2tlbml6YXRpb24gaWYgd2UgbW9kaWZpZWQgdGhlIHNlbGVjdG9yIGFib3ZlXG5cdCggY29tcGlsZWQgfHwgY29tcGlsZSggc2VsZWN0b3IsIG1hdGNoICkgKShcblx0XHRzZWVkLFxuXHRcdGNvbnRleHQsXG5cdFx0IWRvY3VtZW50SXNIVE1MLFxuXHRcdHJlc3VsdHMsXG5cdFx0IWNvbnRleHQgfHwgcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHwgY29udGV4dFxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbi8vIE9uZS10aW1lIGFzc2lnbm1lbnRzXG5cbi8vIFNvcnQgc3RhYmlsaXR5XG5zdXBwb3J0LnNvcnRTdGFibGUgPSBleHBhbmRvLnNwbGl0KCBcIlwiICkuc29ydCggc29ydE9yZGVyICkuam9pbiggXCJcIiApID09PSBleHBhbmRvO1xuXG4vLyBTdXBwb3J0OiBDaHJvbWUgMTQtMzUrXG4vLyBBbHdheXMgYXNzdW1lIGR1cGxpY2F0ZXMgaWYgdGhleSBhcmVuJ3QgcGFzc2VkIHRvIHRoZSBjb21wYXJpc29uIGZ1bmN0aW9uXG5zdXBwb3J0LmRldGVjdER1cGxpY2F0ZXMgPSAhIWhhc0R1cGxpY2F0ZTtcblxuLy8gSW5pdGlhbGl6ZSBhZ2FpbnN0IHRoZSBkZWZhdWx0IGRvY3VtZW50XG5zZXREb2N1bWVudCgpO1xuXG4vLyBTdXBwb3J0OiBXZWJraXQ8NTM3LjMyIC0gU2FmYXJpIDYuMC4zL0Nocm9tZSAyNSAoZml4ZWQgaW4gQ2hyb21lIDI3KVxuLy8gRGV0YWNoZWQgbm9kZXMgY29uZm91bmRpbmdseSBmb2xsb3cgKmVhY2ggb3RoZXIqXG5zdXBwb3J0LnNvcnREZXRhY2hlZCA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdC8vIFNob3VsZCByZXR1cm4gMSwgYnV0IHJldHVybnMgNCAoZm9sbG93aW5nKVxuXHRyZXR1cm4gZWwuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZmllbGRzZXRcIiApICkgJiAxO1xufSApO1xuXG4vLyBTdXBwb3J0OiBJRTw4XG4vLyBQcmV2ZW50IGF0dHJpYnV0ZS9wcm9wZXJ0eSBcImludGVycG9sYXRpb25cIlxuLy8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNjQyOSUyOFZTLjg1JTI5LmFzcHhcbmlmICggIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRlbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCBcImhyZWZcIiApID09PSBcIiNcIjtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBcInR5cGV8aHJlZnxoZWlnaHR8d2lkdGhcIiwgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdGlmICggIWlzWE1MICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lLCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidHlwZVwiID8gMSA6IDIgKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGRlZmF1bHRWYWx1ZSBpbiBwbGFjZSBvZiBnZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKVxuaWYgKCAhc3VwcG9ydC5hdHRyaWJ1dGVzIHx8ICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0ZWwuaW5uZXJIVE1MID0gXCI8aW5wdXQvPlwiO1xuXHRlbC5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBcIlwiICk7XG5cdHJldHVybiBlbC5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiICkgPT09IFwiXCI7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggXCJ2YWx1ZVwiLCBmdW5jdGlvbiggZWxlbSwgX25hbWUsIGlzWE1MICkge1xuXHRcdGlmICggIWlzWE1MICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGVmYXVsdFZhbHVlO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBTdXBwb3J0OiBJRTw5XG4vLyBVc2UgZ2V0QXR0cmlidXRlTm9kZSB0byBmZXRjaCBib29sZWFucyB3aGVuIGdldEF0dHJpYnV0ZSBsaWVzXG5pZiAoICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0cmV0dXJuIGVsLmdldEF0dHJpYnV0ZSggXCJkaXNhYmxlZFwiICkgPT0gbnVsbDtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBib29sZWFucywgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdHZhciB2YWw7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbVsgbmFtZSBdID09PSB0cnVlID8gbmFtZS50b0xvd2VyQ2FzZSgpIDpcblx0XHRcdFx0KCB2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSApICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdFx0bnVsbDtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gRVhQT1NFXG52YXIgX3NpenpsZSA9IHdpbmRvdy5TaXp6bGU7XG5cblNpenpsZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICggd2luZG93LlNpenpsZSA9PT0gU2l6emxlICkge1xuXHRcdHdpbmRvdy5TaXp6bGUgPSBfc2l6emxlO1xuXHR9XG5cblx0cmV0dXJuIFNpenpsZTtcbn07XG5cbmlmICggdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgKSB7XG5cdGRlZmluZSggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFNpenpsZTtcblx0fSApO1xuXG4vLyBTaXp6bGUgcmVxdWlyZXMgdGhhdCB0aGVyZSBiZSBhIGdsb2JhbCB3aW5kb3cgaW4gQ29tbW9uLUpTIGxpa2UgZW52aXJvbm1lbnRzXG59IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFNpenpsZTtcbn0gZWxzZSB7XG5cdHdpbmRvdy5TaXp6bGUgPSBTaXp6bGU7XG59XG5cbi8vIEVYUE9TRVxuXG59ICkoIHdpbmRvdyApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zaXp6bGUvZGlzdC9zaXp6bGUuanMiLCJleHBvcnQgeyBkZWZhdWx0IGFzIHNlbGVjdCwgZ2V0U2luZ2xlU2VsZWN0b3IsIGdldE11bHRpU2VsZWN0b3IgfSBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWF0Y2gsIGluaXRPcHRpb25zIH0gZnJvbSAnLi9tYXRjaCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3B0aW1pemUgfSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==