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
 * 
 * @param {Options} options 
 * @returns {ToStringApi}
 */
var getToString = exports.getToString = function getToString() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return toString[options.format || 'css'];
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
      priority = _options.priority,
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
      if (checkAttributes(priority, element, ignore, path, select, toString, root)) break;
      if (checkTag(element, ignore, path, select, toString, root)) break;

      // ~ local
      checkAttributes(priority, element, ignore, path, select, toString);
      if (path.length === length) {
        checkTag(element, ignore, path, select, toString);
      }

      if (path.length === length && [1, 'xpath'].includes(format)) {
        checkRecursiveDescendants(element, path, select, toString, options);
      }

      if (path.length === length && [1, 'xpath', 'jquery'].includes(format)) {
        checkText(priority, element, ignore, path, select, toString, format === 'jquery');
      }

      if (path.length === length) {
        checkNthChild(priority, element, ignore, path);
      }
    }

    element = element.parentNode;
    length = path.length;
  }

  if (element === root) {
    var pattern = findPattern(priority, element, ignore, select, toString);
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
 * @param  {ToStringApi}    toString - [description]
 * @param  {HTMLElement}    parent   - [description]
 * @return {boolean}                 - [description]
 */
var checkAttributes = function checkAttributes(priority, element, ignore, path, select, toString) {
  var parent = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : element.parentNode;

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
 * @param  {Object}          ignore  - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}        select  - [description]
 * @param  {ToStringApi}     toString - [description]
 * @param  {HTMLElement}     parent  - [description]
 * @return {boolean}                 - [description]
 */
var checkTag = function checkTag(element, ignore, path, select, toString) {
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
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @return {boolean}                 - [description]
 */
var checkNthChild = function checkNthChild(priority, element, ignore, path) {
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
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select   - [description]
 * @param  {ToStringApi}    toString - [description]
 * @param  {boolean}        nested   - [description]
 * @return {boolean}                 - [description]
 */
var checkText = function checkText(priority, element, ignore, path, select, toString, nested) {
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
 * @param  {HTMLElement}    element   - [description]
 * @param  {Array.<Pattern>} path    - [description]
 * @param  {function}       select    - [description]
 * @param  {ToStringApi}    toString  - [description]
 * @param  {Options}        [options] - [description]
 * @return {boolean}                  - [description]
 */
var checkRecursiveDescendants = function checkRecursiveDescendants(element, path, select, toString, options) {
  var pattern = findTagPattern(element, options.ignore);
  if (!pattern) {
    return false;
  }

  var descendants = Array.from(element.querySelectorAll('*'));
  while (descendants.length > 0) {
    var descendant = descendants.shift();
    var descendantPath = match(descendant, _extends({}, options, { root: element }));
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
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @param  {function}       select   - [description]
 * @param  {ToStringApi}    toString - [description]
 * @return {Pattern}                 - [description]
 */
var findPattern = function findPattern(priority, element, ignore, select, toString) {
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

var _common2 = __webpack_require__(3);

var _common = _interopRequireWildcard(_common2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.common = _common;

/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiYWY3OTg4MWQ3YWU5NjU3NTEwNiIsIndlYnBhY2s6Ly8vLi9zcmMvcGF0dGVybi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxpdGllcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvb3B0aW1pemUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY3JlYXRlUGF0dGVybiIsImJhc2UiLCJhdHRyaWJ1dGVzIiwiY2xhc3NlcyIsInBzZXVkbyIsImRlc2NlbmRhbnRzIiwiYXR0cmlidXRlc1RvU2VsZWN0b3IiLCJtYXAiLCJuYW1lIiwidmFsdWUiLCJqb2luIiwiY2xhc3Nlc1RvU2VsZWN0b3IiLCJsZW5ndGgiLCJwc2V1ZG9Ub1NlbGVjdG9yIiwicGF0dGVyblRvU2VsZWN0b3IiLCJwYXR0ZXJuIiwicmVsYXRlcyIsInRhZyIsInBhdGhUb1NlbGVjdG9yIiwicGF0aCIsImNvbnZlcnRFc2NhcGluZyIsInJlcGxhY2UiLCJhdHRyaWJ1dGVzVG9YUGF0aCIsImNsYXNzZXNUb1hQYXRoIiwiYyIsInBzZXVkb1RvWFBhdGgiLCJtYXRjaCIsInAiLCJwYXR0ZXJuVG9YUGF0aCIsImRlc2NlbmRhbnRzVG9YUGF0aCIsInBhdGhUb1hQYXRoIiwiY2hpbGRyZW4iLCJ0b1N0cmluZyIsImpxdWVyeSIsImNzcyIsInhwYXRoIiwiZ2V0VG9TdHJpbmciLCJvcHRpb25zIiwiZm9ybWF0IiwiU2l6emxlIiwic2VsZWN0SlF1ZXJ5Iiwic2VsZWN0b3IiLCJwYXJlbnQiLCJyZXF1aXJlIiwiZG9jdW1lbnQiLCJzZWxlY3RYUGF0aCIsImRvYyIsInBhcmVudE5vZGUiLCJzdGFydHNXaXRoIiwiaXRlcmF0b3IiLCJldmFsdWF0ZSIsImVsZW1lbnRzIiwiZWxlbWVudCIsIml0ZXJhdGVOZXh0IiwicHVzaCIsInNlbGVjdENTUyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJzZWxlY3QiLCJnZXRTZWxlY3QiLCJyb290IiwiY29udmVydE5vZGVMaXN0Iiwibm9kZXMiLCJhcnIiLCJBcnJheSIsImkiLCJlc2NhcGVWYWx1ZSIsInBhcnRpdGlvbiIsImFycmF5IiwicHJlZGljYXRlIiwicmVkdWNlIiwiaXRlbSIsImlubmVyIiwib3V0ZXIiLCJjb25jYXQiLCJnZXRDb21tb25BbmNlc3RvciIsImFuY2VzdG9ycyIsImZvckVhY2giLCJpbmRleCIsInBhcmVudHMiLCJ1bnNoaWZ0Iiwic29ydCIsImN1cnIiLCJuZXh0Iiwic2hhbGxvd0FuY2VzdG9yIiwic2hpZnQiLCJhbmNlc3RvciIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImNvbW1vblByb3BlcnRpZXMiLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwiZWxlbWVudEF0dHJpYnV0ZXMiLCJPYmplY3QiLCJrZXlzIiwia2V5IiwiYXR0cmlidXRlIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXNOYW1lcyIsImNvbW1vbkF0dHJpYnV0ZXNOYW1lcyIsIm5leHRDb21tb25BdHRyaWJ1dGVzIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiZGVmYXVsdElnbm9yZSIsImluZGV4T2YiLCJub2RlIiwic2tpcCIsInByaW9yaXR5IiwiaWdub3JlIiwic2tpcENvbXBhcmUiLCJpc0FycmF5Iiwic2tpcENoZWNrcyIsImNvbXBhcmUiLCJ0eXBlIiwiUmVnRXhwIiwidGVzdCIsIm5vZGVUeXBlIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tUYWciLCJpbmNsdWRlcyIsImNoZWNrUmVjdXJzaXZlRGVzY2VuZGFudHMiLCJjaGVja1RleHQiLCJjaGVja050aENoaWxkIiwiZmluZFBhdHRlcm4iLCJmaW5kQXR0cmlidXRlc1BhdHRlcm4iLCJjb21iaW5hdGlvbnMiLCJ2YWx1ZXMiLCJyZXN1bHQiLCJyIiwiZ2V0Q2xhc3NTZWxlY3RvciIsIm1hdGNoZXMiLCJhdHRyaWJ1dGVOYW1lcyIsInZhbCIsImEiLCJzb3J0ZWRLZXlzIiwiaXNPcHRpbWFsIiwiYXR0cmlidXRlVmFsdWUiLCJ1c2VOYW1lZElnbm9yZSIsImN1cnJlbnRJZ25vcmUiLCJjdXJyZW50RGVmYXVsdElnbm9yZSIsImNoZWNrSWdub3JlIiwiY2xhc3NOYW1lcyIsImNsYXNzSWdub3JlIiwiY2xhc3MiLCJjbGFzc05hbWUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkIiwiY2hpbGRQYXR0ZXJuIiwiY29uc29sZSIsIndhcm4iLCJuZXN0ZWQiLCJ0ZXh0Q29udGVudCIsImZpcnN0Q2hpbGQiLCJub2RlVmFsdWUiLCJ0ZXh0cyIsInRleHQiLCJjb250YWlucyIsImZyb20iLCJkZXNjZW5kYW50IiwiZGVzY2VuZGFudFBhdGgiLCJwYXJlbnRFbGVtZW50IiwiZGVmYXVsdFByZWRpY2F0ZSIsImNoZWNrIiwib3B0aW1pemUiLCJFcnJvciIsIm9wdGltaXplUGFydCIsImVuZE9wdGltaXplZCIsInNsaWNlIiwic2hvcnRlbmVkIiwicG9wIiwiY3VycmVudCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsIm9wdGltaXplVGV4dCIsInByZSIsInBvc3QiLCJvdGhlciIsIm9wdGltaXplZCIsImNvbXBhcmVSZXN1bHRzIiwib3B0aW1pemVBdHRyaWJ1dGVzIiwic2ltcGxpZnkiLCJvcmlnaW5hbCIsImdldFNpbXBsaWZpZWQiLCJzaW1wbGlmaWVkIiwib3B0aW1pemVEZXNjZW5kYW50Iiwib3B0aW1pemVSZWN1cnNpdmVEZXNjZW5kYW50cyIsIm9wdGltaXplTnRoT2ZUeXBlIiwiZmluZEluZGV4IiwibnRoT2ZUeXBlIiwib3B0aW1pemVDbGFzc2VzIiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImRlc2NyaXB0aW9uIiwib3B0aW1pemVycyIsImFjYyIsIm9wdGltaXplciIsImdldFF1ZXJ5U2VsZWN0b3IiLCJnZXRTaW5nbGVTZWxlY3RvclBhdGgiLCJvcHRpbWl6ZWRQYXRoIiwiZ2V0TXVsdGlTZWxlY3RvclBhdGgiLCJhbmNlc3RvclBhdGgiLCJjb21tb25QYXRoIiwiZ2V0Q29tbW9uUGF0aCIsImRlc2NlbmRhbnRQYXR0ZXJuIiwic2VsZWN0b3JQYXRoIiwic2VsZWN0b3JNYXRjaGVzIiwiaW5wdXQiLCJ3aW5kb3ciLCJzdXBwb3J0IiwiRXhwciIsImdldFRleHQiLCJpc1hNTCIsInRva2VuaXplIiwiY29tcGlsZSIsIm91dGVybW9zdENvbnRleHQiLCJzb3J0SW5wdXQiLCJoYXNEdXBsaWNhdGUiLCJzZXREb2N1bWVudCIsImRvY0VsZW0iLCJkb2N1bWVudElzSFRNTCIsInJidWdneVFTQSIsInJidWdneU1hdGNoZXMiLCJleHBhbmRvIiwiRGF0ZSIsInByZWZlcnJlZERvYyIsImRpcnJ1bnMiLCJkb25lIiwiY2xhc3NDYWNoZSIsImNyZWF0ZUNhY2hlIiwidG9rZW5DYWNoZSIsImNvbXBpbGVyQ2FjaGUiLCJub25uYXRpdmVTZWxlY3RvckNhY2hlIiwic29ydE9yZGVyIiwiYiIsImhhc093biIsImhhc093blByb3BlcnR5IiwicHVzaE5hdGl2ZSIsImxpc3QiLCJlbGVtIiwibGVuIiwiYm9vbGVhbnMiLCJ3aGl0ZXNwYWNlIiwiaWRlbnRpZmllciIsInBzZXVkb3MiLCJyd2hpdGVzcGFjZSIsInJ0cmltIiwicmNvbW1hIiwicmNvbWJpbmF0b3JzIiwicmRlc2NlbmQiLCJycHNldWRvIiwicmlkZW50aWZpZXIiLCJtYXRjaEV4cHIiLCJyaHRtbCIsInJpbnB1dHMiLCJyaGVhZGVyIiwicm5hdGl2ZSIsInJxdWlja0V4cHIiLCJyc2libGluZyIsInJ1bmVzY2FwZSIsImZ1bmVzY2FwZSIsImVzY2FwZSIsIm5vbkhleCIsImhpZ2giLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJyY3NzZXNjYXBlIiwiZmNzc2VzY2FwZSIsImNoIiwiYXNDb2RlUG9pbnQiLCJjaGFyQ29kZUF0IiwidW5sb2FkSGFuZGxlciIsImluRGlzYWJsZWRGaWVsZHNldCIsImFkZENvbWJpbmF0b3IiLCJkaXNhYmxlZCIsIm5vZGVOYW1lIiwiZGlyIiwiYXBwbHkiLCJjYWxsIiwiY2hpbGROb2RlcyIsImUiLCJ0YXJnZXQiLCJlbHMiLCJqIiwiY29udGV4dCIsInJlc3VsdHMiLCJzZWVkIiwibSIsIm5pZCIsImdyb3VwcyIsIm5ld1NlbGVjdG9yIiwibmV3Q29udGV4dCIsIm93bmVyRG9jdW1lbnQiLCJleGVjIiwiZ2V0RWxlbWVudEJ5SWQiLCJpZCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInFzYSIsInRlc3RDb250ZXh0Iiwic2NvcGUiLCJzZXRBdHRyaWJ1dGUiLCJ0b1NlbGVjdG9yIiwicXNhRXJyb3IiLCJyZW1vdmVBdHRyaWJ1dGUiLCJjYWNoZSIsImNhY2hlTGVuZ3RoIiwibWFya0Z1bmN0aW9uIiwiZm4iLCJhc3NlcnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEhhbmRsZSIsImF0dHJzIiwiaGFuZGxlciIsImF0dHJIYW5kbGUiLCJzaWJsaW5nQ2hlY2siLCJjdXIiLCJkaWZmIiwic291cmNlSW5kZXgiLCJuZXh0U2libGluZyIsImNyZWF0ZUlucHV0UHNldWRvIiwiY3JlYXRlQnV0dG9uUHNldWRvIiwiY3JlYXRlRGlzYWJsZWRQc2V1ZG8iLCJpc0Rpc2FibGVkIiwiY3JlYXRlUG9zaXRpb25hbFBzZXVkbyIsImFyZ3VtZW50IiwibWF0Y2hJbmRleGVzIiwibmFtZXNwYWNlIiwibmFtZXNwYWNlVVJJIiwiZG9jdW1lbnRFbGVtZW50IiwiaGFzQ29tcGFyZSIsInN1YldpbmRvdyIsImRlZmF1bHRWaWV3IiwidG9wIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVDb21tZW50IiwiZ2V0QnlJZCIsImdldEVsZW1lbnRzQnlOYW1lIiwiYXR0cklkIiwiZmluZCIsImdldEF0dHJpYnV0ZU5vZGUiLCJlbGVtcyIsInRtcCIsImlubmVySFRNTCIsIm1hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm9NYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsImRpc2Nvbm5lY3RlZE1hdGNoIiwiY29tcGFyZURvY3VtZW50UG9zaXRpb24iLCJhZG93biIsImJ1cCIsInNvcnREZXRhY2hlZCIsImF1cCIsImFwIiwiYnAiLCJleHByIiwicmV0IiwiYXR0ciIsInNwZWNpZmllZCIsInNlbCIsImVycm9yIiwibXNnIiwidW5pcXVlU29ydCIsImR1cGxpY2F0ZXMiLCJkZXRlY3REdXBsaWNhdGVzIiwic29ydFN0YWJsZSIsInNwbGljZSIsInNlbGVjdG9ycyIsImNyZWF0ZVBzZXVkbyIsInJlbGF0aXZlIiwiZmlyc3QiLCJwcmVGaWx0ZXIiLCJleGNlc3MiLCJ1bnF1b3RlZCIsIm5vZGVOYW1lU2VsZWN0b3IiLCJvcGVyYXRvciIsIndoYXQiLCJfYXJndW1lbnQiLCJsYXN0Iiwic2ltcGxlIiwiZm9yd2FyZCIsIm9mVHlwZSIsIl9jb250ZXh0IiwieG1sIiwidW5pcXVlQ2FjaGUiLCJvdXRlckNhY2hlIiwibm9kZUluZGV4Iiwic3RhcnQiLCJ1c2VDYWNoZSIsImxhc3RDaGlsZCIsInVuaXF1ZUlEIiwiYXJncyIsInNldEZpbHRlcnMiLCJpZHgiLCJtYXRjaGVkIiwibWF0Y2hlciIsInVubWF0Y2hlZCIsImxhbmciLCJlbGVtTGFuZyIsImhhc2giLCJsb2NhdGlvbiIsImFjdGl2ZUVsZW1lbnQiLCJoYXNGb2N1cyIsImhyZWYiLCJ0YWJJbmRleCIsImNoZWNrZWQiLCJzZWxlY3RlZCIsInNlbGVjdGVkSW5kZXgiLCJfbWF0Y2hJbmRleGVzIiwicmFkaW8iLCJjaGVja2JveCIsImZpbGUiLCJwYXNzd29yZCIsImltYWdlIiwic3VibWl0IiwicmVzZXQiLCJwcm90b3R5cGUiLCJmaWx0ZXJzIiwicGFyc2VPbmx5IiwidG9rZW5zIiwic29GYXIiLCJwcmVGaWx0ZXJzIiwiY2FjaGVkIiwiY29tYmluYXRvciIsImNoZWNrTm9uRWxlbWVudHMiLCJkb25lTmFtZSIsIm9sZENhY2hlIiwibmV3Q2FjaGUiLCJlbGVtZW50TWF0Y2hlciIsIm1hdGNoZXJzIiwibXVsdGlwbGVDb250ZXh0cyIsImNvbnRleHRzIiwiY29uZGVuc2UiLCJuZXdVbm1hdGNoZWQiLCJtYXBwZWQiLCJzZXRNYXRjaGVyIiwicG9zdEZpbHRlciIsInBvc3RGaW5kZXIiLCJwb3N0U2VsZWN0b3IiLCJ0ZW1wIiwicHJlTWFwIiwicG9zdE1hcCIsInByZWV4aXN0aW5nIiwibWF0Y2hlckluIiwibWF0Y2hlck91dCIsIm1hdGNoZXJGcm9tVG9rZW5zIiwiY2hlY2tDb250ZXh0IiwibGVhZGluZ1JlbGF0aXZlIiwiaW1wbGljaXRSZWxhdGl2ZSIsIm1hdGNoQ29udGV4dCIsIm1hdGNoQW55Q29udGV4dCIsIm1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyIsImVsZW1lbnRNYXRjaGVycyIsInNldE1hdGNoZXJzIiwiYnlTZXQiLCJieUVsZW1lbnQiLCJzdXBlck1hdGNoZXIiLCJvdXRlcm1vc3QiLCJtYXRjaGVkQ291bnQiLCJzZXRNYXRjaGVkIiwiY29udGV4dEJhY2t1cCIsImRpcnJ1bnNVbmlxdWUiLCJNYXRoIiwicmFuZG9tIiwidG9rZW4iLCJjb21waWxlZCIsIl9uYW1lIiwiZGVmYXVsdFZhbHVlIiwiX3NpenpsZSIsIm5vQ29uZmxpY3QiLCJkZWZpbmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZGVmYXVsdCIsImdldFNpbmdsZVNlbGVjdG9yIiwiZ2V0TXVsdGlTZWxlY3RvciIsImNvbW1vbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDaEVBOzs7Ozs7Ozs7O0FBVUE7Ozs7OztBQU1PLElBQU1BLHdDQUFnQixTQUFoQkEsYUFBZ0I7QUFBQSxNQUFDQyxJQUFELHVFQUFRLEVBQVI7QUFBQSxvQkFDeEJDLFlBQVksRUFEWSxFQUNSQyxTQUFTLEVBREQsRUFDS0MsUUFBUSxFQURiLEVBQ2lCQyxhQUFhLEVBRDlCLElBQ3FDSixJQURyQztBQUFBLENBQXRCOztBQUdQOzs7Ozs7QUFNTyxJQUFNSyxzREFBdUIsU0FBdkJBLG9CQUF1QixDQUFDSixVQUFEO0FBQUEsU0FDbENBLFdBQVdLLEdBQVgsQ0FBZSxnQkFBcUI7QUFBQSxRQUFsQkMsSUFBa0IsUUFBbEJBLElBQWtCO0FBQUEsUUFBWkMsS0FBWSxRQUFaQSxLQUFZOztBQUNsQyxRQUFJRCxTQUFTLElBQWIsRUFBbUI7QUFDakIsbUJBQVdDLEtBQVg7QUFDRDtBQUNELFFBQUlBLFVBQVUsSUFBZCxFQUFvQjtBQUNsQixtQkFBV0QsSUFBWDtBQUNEO0FBQ0QsaUJBQVdBLElBQVgsVUFBb0JDLEtBQXBCO0FBQ0QsR0FSRCxFQVFHQyxJQVJILENBUVEsRUFSUixDQURrQztBQUFBLENBQTdCOztBQVdQOzs7Ozs7QUFNTyxJQUFNQyxnREFBb0IsU0FBcEJBLGlCQUFvQixDQUFDUixPQUFEO0FBQUEsU0FBYUEsUUFBUVMsTUFBUixTQUFxQlQsUUFBUU8sSUFBUixDQUFhLEdBQWIsQ0FBckIsR0FBMkMsRUFBeEQ7QUFBQSxDQUExQjs7QUFFUDs7Ozs7O0FBTU8sSUFBTUcsOENBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ1QsTUFBRDtBQUFBLFNBQVlBLE9BQU9RLE1BQVAsU0FBb0JSLE9BQU9NLElBQVAsQ0FBWSxHQUFaLENBQXBCLEdBQXlDLEVBQXJEO0FBQUEsQ0FBekI7O0FBRVA7Ozs7OztBQU1PLElBQU1JLGdEQUFvQixTQUFwQkEsaUJBQW9CLENBQUNDLE9BQUQsRUFBYTtBQUFBLE1BQ3BDQyxPQURvQyxHQUNVRCxPQURWLENBQ3BDQyxPQURvQztBQUFBLE1BQzNCQyxHQUQyQixHQUNVRixPQURWLENBQzNCRSxHQUQyQjtBQUFBLE1BQ3RCZixVQURzQixHQUNVYSxPQURWLENBQ3RCYixVQURzQjtBQUFBLE1BQ1ZDLE9BRFUsR0FDVVksT0FEVixDQUNWWixPQURVO0FBQUEsTUFDREMsTUFEQyxHQUNVVyxPQURWLENBQ0RYLE1BREM7O0FBRTVDLE1BQU1LLGNBQ0pPLFlBQVksT0FBWixHQUFzQixJQUF0QixHQUE2QixFQUR6QixLQUdKQyxPQUFPLEVBSEgsSUFLSlgscUJBQXFCSixVQUFyQixDQUxJLEdBT0pTLGtCQUFrQlIsT0FBbEIsQ0FQSSxHQVNKVSxpQkFBaUJULE1BQWpCLENBVEY7QUFXQSxTQUFPSyxLQUFQO0FBQ0QsQ0FkTTs7QUFnQlA7Ozs7OztBQU1PLElBQU1TLDBDQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsSUFBRDtBQUFBLFNBQzVCQSxLQUFLWixHQUFMLENBQVNPLGlCQUFULEVBQTRCSixJQUE1QixDQUFpQyxHQUFqQyxDQUQ0QjtBQUFBLENBQXZCOztBQUlQLElBQU1VLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ1gsS0FBRDtBQUFBLFNBQ3RCQSxTQUFTQSxNQUFNWSxPQUFOLENBQWMsdUNBQWQsRUFBdUQsSUFBdkQsRUFDTkEsT0FETSxDQUNFLFdBREYsRUFDZSxNQURmLEVBRU5BLE9BRk0sQ0FFRSxPQUZGLEVBRVcsSUFGWCxDQURhO0FBQUEsQ0FBeEI7O0FBS0E7Ozs7OztBQU1PLElBQU1DLGdEQUFvQixTQUFwQkEsaUJBQW9CLENBQUNwQixVQUFEO0FBQUEsU0FDL0JBLFdBQVdLLEdBQVgsQ0FBZSxpQkFBcUI7QUFBQSxRQUFsQkMsSUFBa0IsU0FBbEJBLElBQWtCO0FBQUEsUUFBWkMsS0FBWSxTQUFaQSxLQUFZOztBQUNsQyxRQUFJQSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsb0JBQVlELElBQVo7QUFDRDtBQUNELGtCQUFZQSxJQUFaLFVBQXFCWSxnQkFBZ0JYLEtBQWhCLENBQXJCO0FBQ0QsR0FMRCxFQUtHQyxJQUxILENBS1EsRUFMUixDQUQrQjtBQUFBLENBQTFCOztBQVFQOzs7Ozs7QUFNTyxJQUFNYSwwQ0FBaUIsU0FBakJBLGNBQWlCLENBQUNwQixPQUFEO0FBQUEsU0FDNUJBLFFBQVFJLEdBQVIsQ0FBWTtBQUFBLG9FQUE0RGlCLENBQTVEO0FBQUEsR0FBWixFQUFpRmQsSUFBakYsQ0FBc0YsRUFBdEYsQ0FENEI7QUFBQSxDQUF2Qjs7QUFHUDs7Ozs7O0FBTU8sSUFBTWUsd0NBQWdCLFNBQWhCQSxhQUFnQixDQUFDckIsTUFBRDtBQUFBLFNBQzNCQSxPQUFPRyxHQUFQLENBQVcsYUFBSztBQUNkLFFBQU1tQixRQUFRQyxFQUFFRCxLQUFGLENBQVEsNENBQVIsQ0FBZDtBQUNBLFFBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1YsYUFBTyxFQUFQO0FBQ0Q7O0FBRUQsWUFBUUEsTUFBTSxDQUFOLENBQVI7QUFDRSxXQUFLLFdBQUw7QUFDRSx1REFBNkNBLE1BQU0sQ0FBTixDQUE3Qzs7QUFFRixXQUFLLGFBQUw7QUFDRSxxQkFBV0EsTUFBTSxDQUFOLENBQVg7O0FBRUYsV0FBSyxVQUFMO0FBQ0UscUNBQTJCQSxNQUFNLENBQU4sQ0FBM0I7O0FBRUY7QUFDRSxlQUFPLEVBQVA7QUFYSjtBQWFELEdBbkJELEVBbUJHaEIsSUFuQkgsQ0FtQlEsRUFuQlIsQ0FEMkI7QUFBQSxDQUF0Qjs7QUFzQlA7Ozs7OztBQU1PLElBQU1rQiwwQ0FBaUIsU0FBakJBLGNBQWlCLENBQUNiLE9BQUQsRUFBYTtBQUFBLE1BQ2pDQyxPQURpQyxHQUMwQkQsT0FEMUIsQ0FDakNDLE9BRGlDO0FBQUEsTUFDeEJDLEdBRHdCLEdBQzBCRixPQUQxQixDQUN4QkUsR0FEd0I7QUFBQSxNQUNuQmYsVUFEbUIsR0FDMEJhLE9BRDFCLENBQ25CYixVQURtQjtBQUFBLE1BQ1BDLE9BRE8sR0FDMEJZLE9BRDFCLENBQ1BaLE9BRE87QUFBQSxNQUNFQyxNQURGLEdBQzBCVyxPQUQxQixDQUNFWCxNQURGO0FBQUEsTUFDVUMsV0FEVixHQUMwQlUsT0FEMUIsQ0FDVVYsV0FEVjs7QUFFekMsTUFBTUksY0FDSk8sWUFBWSxPQUFaLEdBQXNCLEdBQXRCLEdBQTRCLElBRHhCLEtBR0pDLE9BQU8sR0FISCxJQUtKSyxrQkFBa0JwQixVQUFsQixDQUxJLEdBT0pxQixlQUFlcEIsT0FBZixDQVBJLEdBU0pzQixjQUFjckIsTUFBZCxDQVRJLEdBV0p5QixtQkFBbUJ4QixXQUFuQixDQVhGO0FBYUEsU0FBT0ksS0FBUDtBQUNELENBaEJNOztBQWtCUDs7Ozs7O0FBTU8sSUFBTXFCLG9DQUFjLFNBQWRBLFdBQWMsQ0FBQ1gsSUFBRDtBQUFBLGVBQWNBLEtBQUtaLEdBQUwsQ0FBU3FCLGNBQVQsRUFBeUJsQixJQUF6QixDQUE4QixFQUE5QixDQUFkO0FBQUEsQ0FBcEI7O0FBRVA7Ozs7OztBQU1PLElBQU1tQixrREFBcUIsU0FBckJBLGtCQUFxQixDQUFDRSxRQUFEO0FBQUEsU0FDaENBLFNBQVNuQixNQUFULFNBQXNCbUIsU0FBU3hCLEdBQVQsQ0FBYXVCLFdBQWIsRUFBMEJwQixJQUExQixDQUErQixJQUEvQixDQUF0QixTQUFnRSxFQURoQztBQUFBLENBQTNCOztBQUlQLElBQU1zQixXQUFXO0FBQ2YsU0FBTztBQUNMOUIsZ0JBQVlJLG9CQURQO0FBRUxILGFBQVNRLGlCQUZKO0FBR0xQLFlBQVFTLGdCQUhIO0FBSUxFLGFBQVNELGlCQUpKO0FBS0xLLFVBQU1EO0FBTEQsR0FEUTtBQVFmLFdBQVM7QUFDUGhCLGdCQUFZb0IsaUJBREw7QUFFUG5CLGFBQVNvQixjQUZGO0FBR1BuQixZQUFRcUIsYUFIRDtBQUlQVixhQUFTYSxjQUpGO0FBS1BULFVBQU1XO0FBTEMsR0FSTTtBQWVmLFlBQVU7QUFmSyxDQUFqQjs7QUFrQkFFLFNBQVNDLE1BQVQsR0FBa0JELFNBQVNFLEdBQTNCO0FBQ0FGLFNBQVMsQ0FBVCxJQUFjQSxTQUFTRSxHQUF2QjtBQUNBRixTQUFTLENBQVQsSUFBY0EsU0FBU0csS0FBdkI7O0FBRUE7Ozs7Ozs7OztBQVNBOzs7OztBQUtPLElBQU1DLG9DQUFjLFNBQWRBLFdBQWM7QUFBQSxNQUFDQyxPQUFELHVFQUFXLEVBQVg7QUFBQSxTQUN6QkwsU0FBU0ssUUFBUUMsTUFBUixJQUFrQixLQUEzQixDQUR5QjtBQUFBLENBQXBCLEM7Ozs7Ozs7Ozs7OztBQzFOUDtBQUNBLElBQUlDLGVBQUo7O0FBRUE7Ozs7OztBQU1BLElBQU1DLGVBQWUsU0FBZkEsWUFBZSxDQUFDQyxRQUFELEVBQTZCO0FBQUEsTUFBbEJDLE1BQWtCLHVFQUFULElBQVM7O0FBQ2hELE1BQUksQ0FBQ0gsTUFBTCxFQUFhO0FBQ1hBLGFBQVMsbUJBQUFJLENBQVEsQ0FBUixDQUFUO0FBQ0Q7QUFDRCxTQUFPSixPQUFPRSxRQUFQLEVBQWlCQyxVQUFVRSxRQUEzQixDQUFQO0FBQ0QsQ0FMRDs7QUFPQTs7Ozs7O0FBTUEsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLENBQUNKLFFBQUQsRUFBNkI7QUFBQSxNQUFsQkMsTUFBa0IsdUVBQVQsSUFBUzs7QUFDL0NBLFdBQVVBLFVBQVVFLFFBQXBCO0FBQ0EsTUFBSUUsTUFBTUosTUFBVjtBQUNBLFNBQU9JLElBQUlDLFVBQVgsRUFBdUI7QUFDckJELFVBQU1BLElBQUlDLFVBQVY7QUFDRDtBQUNELE1BQUlELFFBQVFKLE1BQVIsSUFBa0IsQ0FBQ0QsU0FBU08sVUFBVCxDQUFvQixHQUFwQixDQUF2QixFQUFpRDtBQUMvQ1AscUJBQWVBLFFBQWY7QUFDRDtBQUNELE1BQUlRLFdBQVdILElBQUlJLFFBQUosQ0FBYVQsUUFBYixFQUF1QkMsTUFBdkIsRUFBK0IsSUFBL0IsRUFBcUMsQ0FBckMsQ0FBZjtBQUNBLE1BQUlTLFdBQVcsRUFBZjtBQUNBLE1BQUlDLE9BQUo7QUFDQSxTQUFRQSxVQUFVSCxTQUFTSSxXQUFULEVBQWxCLEVBQTJDO0FBQ3pDRixhQUFTRyxJQUFULENBQWNGLE9BQWQ7QUFDRDtBQUNELFNBQU9ELFFBQVA7QUFDRCxDQWhCRDs7QUFrQkE7Ozs7OztBQU1BLElBQU1JLFlBQVksU0FBWkEsU0FBWSxDQUFDZCxRQUFEO0FBQUEsTUFBV0MsTUFBWCx1RUFBb0IsSUFBcEI7QUFBQSxTQUNoQixDQUFDQSxVQUFVRSxRQUFYLEVBQXFCWSxnQkFBckIsQ0FBc0NmLFFBQXRDLENBRGdCO0FBQUEsQ0FBbEI7O0FBR0EsSUFBTWdCLFNBQVM7QUFDYixTQUFPRixTQURNO0FBRWIsV0FBU1YsV0FGSTtBQUdiLFlBQVVMO0FBSEcsQ0FBZjs7QUFNQWlCLE9BQU8sQ0FBUCxJQUFZQSxPQUFPdkIsR0FBbkI7QUFDQXVCLE9BQU8sQ0FBUCxJQUFZQSxPQUFPdEIsS0FBbkI7O0FBRUE7Ozs7O0FBS08sSUFBTXVCLGdDQUFZLFNBQVpBLFNBQVk7QUFBQSxNQUFDckIsT0FBRCx1RUFBVyxFQUFYO0FBQUEsU0FDdkIsVUFBQ0ksUUFBRCxFQUFXQyxNQUFYO0FBQUEsV0FBc0JlLE9BQU9wQixRQUFRQyxNQUFSLElBQWtCLEtBQXpCLEVBQWdDRyxRQUFoQyxFQUEwQ0MsVUFBVUwsUUFBUXNCLElBQTVELENBQXRCO0FBQUEsR0FEdUI7QUFBQSxDQUFsQixDOzs7Ozs7Ozs7Ozs7Ozs7QUMvRFA7Ozs7OztBQU1BOzs7Ozs7QUFNTyxJQUFNQyw0Q0FBa0IsU0FBbEJBLGVBQWtCLENBQUNDLEtBQUQsRUFBVztBQUFBLE1BQ2hDakQsTUFEZ0MsR0FDckJpRCxLQURxQixDQUNoQ2pELE1BRGdDOztBQUV4QyxNQUFNa0QsTUFBTSxJQUFJQyxLQUFKLENBQVVuRCxNQUFWLENBQVo7QUFDQSxPQUFLLElBQUlvRCxJQUFJLENBQWIsRUFBZ0JBLElBQUlwRCxNQUFwQixFQUE0Qm9ELEdBQTVCLEVBQWlDO0FBQy9CRixRQUFJRSxDQUFKLElBQVNILE1BQU1HLENBQU4sQ0FBVDtBQUNEO0FBQ0QsU0FBT0YsR0FBUDtBQUNELENBUE07O0FBU1A7Ozs7Ozs7O0FBUU8sSUFBTUcsb0NBQWMsU0FBZEEsV0FBYyxDQUFDeEQsS0FBRDtBQUFBLFNBQ3pCQSxTQUFTQSxNQUFNWSxPQUFOLENBQWMscUNBQWQsRUFBcUQsTUFBckQsRUFDTkEsT0FETSxDQUNFLEtBREYsRUFDUyxNQURULENBRGdCO0FBQUEsQ0FBcEI7O0FBSVA7OztBQUdPLElBQU02QyxnQ0FBWSxTQUFaQSxTQUFZLENBQUNDLEtBQUQsRUFBUUMsU0FBUjtBQUFBLFNBQ3ZCRCxNQUFNRSxNQUFOLENBQ0UsZ0JBQWlCQyxJQUFqQjtBQUFBO0FBQUEsUUFBRUMsS0FBRjtBQUFBLFFBQVNDLEtBQVQ7O0FBQUEsV0FBMEJKLFVBQVVFLElBQVYsSUFBa0IsQ0FBQ0MsTUFBTUUsTUFBTixDQUFhSCxJQUFiLENBQUQsRUFBcUJFLEtBQXJCLENBQWxCLEdBQWdELENBQUNELEtBQUQsRUFBUUMsTUFBTUMsTUFBTixDQUFhSCxJQUFiLENBQVIsQ0FBMUU7QUFBQSxHQURGLEVBRUUsQ0FBQyxFQUFELEVBQUssRUFBTCxDQUZGLENBRHVCO0FBQUEsQ0FBbEIsQzs7Ozs7Ozs7Ozs7O0FDcENQOzs7Ozs7QUFNQTs7OztBQUlBOzs7Ozs7O0FBT08sSUFBTUksZ0RBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBQ3ZCLFFBQUQsRUFBNEI7QUFBQSxNQUFqQmQsT0FBaUIsdUVBQVAsRUFBTztBQUFBLHNCQUl2REEsT0FKdUQsQ0FHekRzQixJQUh5RDtBQUFBLE1BR3pEQSxJQUh5RCxpQ0FHbERmLFFBSGtEOzs7QUFNM0QsTUFBTStCLFlBQVksRUFBbEI7O0FBRUF4QixXQUFTeUIsT0FBVCxDQUFpQixVQUFDeEIsT0FBRCxFQUFVeUIsS0FBVixFQUFvQjtBQUNuQyxRQUFNQyxVQUFVLEVBQWhCO0FBQ0EsV0FBTzFCLFlBQVlPLElBQW5CLEVBQXlCO0FBQ3ZCUCxnQkFBVUEsUUFBUUwsVUFBbEI7QUFDQStCLGNBQVFDLE9BQVIsQ0FBZ0IzQixPQUFoQjtBQUNEO0FBQ0R1QixjQUFVRSxLQUFWLElBQW1CQyxPQUFuQjtBQUNELEdBUEQ7O0FBU0FILFlBQVVLLElBQVYsQ0FBZSxVQUFDQyxJQUFELEVBQU9DLElBQVA7QUFBQSxXQUFnQkQsS0FBS3JFLE1BQUwsR0FBY3NFLEtBQUt0RSxNQUFuQztBQUFBLEdBQWY7O0FBRUEsTUFBTXVFLGtCQUFrQlIsVUFBVVMsS0FBVixFQUF4Qjs7QUFFQSxNQUFJQyxXQUFXLElBQWY7O0FBckIyRDtBQXdCekQsUUFBTTNDLFNBQVN5QyxnQkFBZ0JuQixDQUFoQixDQUFmO0FBQ0EsUUFBTXNCLFVBQVVYLFVBQVVZLElBQVYsQ0FBZSxVQUFDQyxZQUFELEVBQWtCO0FBQy9DLGFBQU8sQ0FBQ0EsYUFBYUQsSUFBYixDQUFrQixVQUFDRSxXQUFEO0FBQUEsZUFBaUJBLGdCQUFnQi9DLE1BQWpDO0FBQUEsT0FBbEIsQ0FBUjtBQUNELEtBRmUsQ0FBaEI7O0FBSUEsUUFBSTRDLE9BQUosRUFBYTtBQUNYO0FBQ0E7QUFDRDs7QUFFREQsZUFBVzNDLE1BQVg7QUFsQ3lEOztBQXVCM0QsT0FBSyxJQUFJc0IsSUFBSSxDQUFSLEVBQVcwQixJQUFJUCxnQkFBZ0J2RSxNQUFwQyxFQUE0Q29ELElBQUkwQixDQUFoRCxFQUFtRDFCLEdBQW5ELEVBQXdEO0FBQUE7O0FBQUEsMEJBUXBEO0FBSUg7O0FBRUQsU0FBT3FCLFFBQVA7QUFDRCxDQXRDTTs7QUF3Q1A7Ozs7OztBQU1PLElBQU1NLG9EQUFzQixTQUF0QkEsbUJBQXNCLENBQUN4QyxRQUFELEVBQWM7O0FBRS9DLE1BQU15QyxtQkFBbUI7QUFDdkJ6RixhQUFTLEVBRGM7QUFFdkJELGdCQUFZLEVBRlc7QUFHdkJlLFNBQUs7QUFIa0IsR0FBekI7O0FBTUFrQyxXQUFTeUIsT0FBVCxDQUFpQixVQUFDeEIsT0FBRCxFQUFhO0FBQUEsUUFHakJ5QyxhQUhpQixHQU14QkQsZ0JBTndCLENBRzFCekYsT0FIMEI7QUFBQSxRQUlkMkYsZ0JBSmMsR0FNeEJGLGdCQU53QixDQUkxQjFGLFVBSjBCO0FBQUEsUUFLckI2RixTQUxxQixHQU14QkgsZ0JBTndCLENBSzFCM0UsR0FMMEI7O0FBUTVCOztBQUNBLFFBQUk0RSxrQkFBa0JHLFNBQXRCLEVBQWlDO0FBQy9CLFVBQUk3RixVQUFVaUQsUUFBUTZDLFlBQVIsQ0FBcUIsT0FBckIsQ0FBZDtBQUNBLFVBQUk5RixPQUFKLEVBQWE7QUFDWEEsa0JBQVVBLFFBQVErRixJQUFSLEdBQWVDLEtBQWYsQ0FBcUIsR0FBckIsQ0FBVjtBQUNBLFlBQUksQ0FBQ04sY0FBY2pGLE1BQW5CLEVBQTJCO0FBQ3pCZ0YsMkJBQWlCekYsT0FBakIsR0FBMkJBLE9BQTNCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wwRiwwQkFBZ0JBLGNBQWNPLE1BQWQsQ0FBcUIsVUFBQ0MsS0FBRDtBQUFBLG1CQUFXbEcsUUFBUW9GLElBQVIsQ0FBYSxVQUFDL0UsSUFBRDtBQUFBLHFCQUFVQSxTQUFTNkYsS0FBbkI7QUFBQSxhQUFiLENBQVg7QUFBQSxXQUFyQixDQUFoQjtBQUNBLGNBQUlSLGNBQWNqRixNQUFsQixFQUEwQjtBQUN4QmdGLDZCQUFpQnpGLE9BQWpCLEdBQTJCMEYsYUFBM0I7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBT0QsaUJBQWlCekYsT0FBeEI7QUFDRDtBQUNGO0FBQ0YsT0FaRCxNQVlPO0FBQ0w7QUFDQSxlQUFPeUYsaUJBQWlCekYsT0FBeEI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsUUFBSTJGLHFCQUFxQkUsU0FBekIsRUFBb0M7QUFDbEMsVUFBTU0sb0JBQW9CbEQsUUFBUWxELFVBQWxDO0FBQ0EsVUFBTUEsYUFBYXFHLE9BQU9DLElBQVAsQ0FBWUYsaUJBQVosRUFBK0JqQyxNQUEvQixDQUFzQyxVQUFDbkUsVUFBRCxFQUFhdUcsR0FBYixFQUFxQjtBQUM1RSxZQUFNQyxZQUFZSixrQkFBa0JHLEdBQWxCLENBQWxCO0FBQ0EsWUFBTUUsZ0JBQWdCRCxVQUFVbEcsSUFBaEM7QUFDQTtBQUNBO0FBQ0EsWUFBSWtHLGFBQWFDLGtCQUFrQixPQUFuQyxFQUE0QztBQUMxQ3pHLHFCQUFXeUcsYUFBWCxJQUE0QkQsVUFBVWpHLEtBQXRDO0FBQ0Q7QUFDRCxlQUFPUCxVQUFQO0FBQ0QsT0FUa0IsRUFTaEIsRUFUZ0IsQ0FBbkI7O0FBV0EsVUFBTTBHLGtCQUFrQkwsT0FBT0MsSUFBUCxDQUFZdEcsVUFBWixDQUF4QjtBQUNBLFVBQU0yRyx3QkFBd0JOLE9BQU9DLElBQVAsQ0FBWVYsZ0JBQVosQ0FBOUI7O0FBRUEsVUFBSWMsZ0JBQWdCaEcsTUFBcEIsRUFBNEI7QUFDMUIsWUFBSSxDQUFDaUcsc0JBQXNCakcsTUFBM0IsRUFBbUM7QUFDakNnRiwyQkFBaUIxRixVQUFqQixHQUE4QkEsVUFBOUI7QUFDRCxTQUZELE1BRU87QUFDTDRGLDZCQUFtQmUsc0JBQXNCeEMsTUFBdEIsQ0FBNkIsVUFBQ3lDLG9CQUFELEVBQXVCdEcsSUFBdkIsRUFBZ0M7QUFDOUUsZ0JBQU1DLFFBQVFxRixpQkFBaUJ0RixJQUFqQixDQUFkO0FBQ0EsZ0JBQUlDLFVBQVVQLFdBQVdNLElBQVgsQ0FBZCxFQUFnQztBQUM5QnNHLG1DQUFxQnRHLElBQXJCLElBQTZCQyxLQUE3QjtBQUNEO0FBQ0QsbUJBQU9xRyxvQkFBUDtBQUNELFdBTmtCLEVBTWhCLEVBTmdCLENBQW5CO0FBT0EsY0FBSVAsT0FBT0MsSUFBUCxDQUFZVixnQkFBWixFQUE4QmxGLE1BQWxDLEVBQTBDO0FBQ3hDZ0YsNkJBQWlCMUYsVUFBakIsR0FBOEI0RixnQkFBOUI7QUFDRCxXQUZELE1BRU87QUFDTCxtQkFBT0YsaUJBQWlCMUYsVUFBeEI7QUFDRDtBQUNGO0FBQ0YsT0FqQkQsTUFpQk87QUFDTCxlQUFPMEYsaUJBQWlCMUYsVUFBeEI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsUUFBSTZGLGNBQWNDLFNBQWxCLEVBQTZCO0FBQzNCLFVBQU0vRSxNQUFNbUMsUUFBUTJELE9BQVIsQ0FBZ0JDLFdBQWhCLEVBQVo7QUFDQSxVQUFJLENBQUNqQixTQUFMLEVBQWdCO0FBQ2RILHlCQUFpQjNFLEdBQWpCLEdBQXVCQSxHQUF2QjtBQUNELE9BRkQsTUFFTyxJQUFJQSxRQUFROEUsU0FBWixFQUF1QjtBQUM1QixlQUFPSCxpQkFBaUIzRSxHQUF4QjtBQUNEO0FBQ0Y7QUFDRixHQTdFRDs7QUErRUEsU0FBTzJFLGdCQUFQO0FBQ0QsQ0F4Rk0sQzs7Ozs7Ozs7Ozs7Ozs7O2tRQy9EUDs7Ozs7O2tCQWlDd0JsRSxLOztBQTNCeEI7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBTUEsSUFBTXVGLGdCQUFnQjtBQUNwQlAsV0FEb0IscUJBQ1RDLGFBRFMsRUFDTTtBQUN4QixXQUFPLENBQ0wsT0FESyxFQUVMLGNBRkssRUFHTCxxQkFISyxFQUlMTyxPQUpLLENBSUdQLGFBSkgsSUFJb0IsQ0FBQyxDQUo1QjtBQUtEO0FBUG1CLENBQXRCOztBQVVBOzs7Ozs7O0FBT2UsU0FBU2pGLEtBQVQsQ0FBZ0J5RixJQUFoQixFQUFvQztBQUFBLE1BQWQ5RSxPQUFjLHVFQUFKLEVBQUk7O0FBQ2pEQTtBQUNFc0IsVUFBTWYsUUFEUjtBQUVFd0UsVUFBTSxJQUZSO0FBR0VDLGNBQVUsQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixNQUFoQixFQUF3QixLQUF4QixDQUhaO0FBSUVDLFlBQVE7QUFKVixLQUtLakYsT0FMTDtBQURpRCxpQkFRQUEsT0FSQTtBQUFBLE1BUXpDc0IsSUFSeUMsWUFRekNBLElBUnlDO0FBQUEsTUFRbkN5RCxJQVJtQyxZQVFuQ0EsSUFSbUM7QUFBQSxNQVE3QkMsUUFSNkIsWUFRN0JBLFFBUjZCO0FBQUEsTUFRbkJDLE1BUm1CLFlBUW5CQSxNQVJtQjtBQUFBLE1BUVhoRixNQVJXLFlBUVhBLE1BUlc7OztBQVVqRCxNQUFNbkIsT0FBTyxFQUFiO0FBQ0EsTUFBSWlDLFVBQVUrRCxJQUFkO0FBQ0EsTUFBSXZHLFNBQVNPLEtBQUtQLE1BQWxCO0FBQ0EsTUFBTTZDLFNBQVMseUJBQVVwQixPQUFWLENBQWY7QUFDQSxNQUFNTCxXQUFXLDBCQUFZSyxPQUFaLENBQWpCOztBQUVBLE1BQU1rRixjQUFjSCxRQUFRLENBQUNyRCxNQUFNeUQsT0FBTixDQUFjSixJQUFkLElBQXNCQSxJQUF0QixHQUE2QixDQUFDQSxJQUFELENBQTlCLEVBQXNDN0csR0FBdEMsQ0FBMEMsVUFBQzhGLEtBQUQsRUFBVztBQUMvRSxRQUFJLE9BQU9BLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDL0IsYUFBTyxVQUFDakQsT0FBRDtBQUFBLGVBQWFBLFlBQVlpRCxLQUF6QjtBQUFBLE9BQVA7QUFDRDtBQUNELFdBQU9BLEtBQVA7QUFDRCxHQUwyQixDQUE1Qjs7QUFPQSxNQUFNb0IsYUFBYSxTQUFiQSxVQUFhLENBQUNyRSxPQUFELEVBQWE7QUFDOUIsV0FBT2dFLFFBQVFHLFlBQVloQyxJQUFaLENBQWlCLFVBQUNtQyxPQUFEO0FBQUEsYUFBYUEsUUFBUXRFLE9BQVIsQ0FBYjtBQUFBLEtBQWpCLENBQWY7QUFDRCxHQUZEOztBQUlBbUQsU0FBT0MsSUFBUCxDQUFZYyxNQUFaLEVBQW9CMUMsT0FBcEIsQ0FBNEIsVUFBQytDLElBQUQsRUFBVTtBQUNwQyxRQUFJdkQsWUFBWWtELE9BQU9LLElBQVAsQ0FBaEI7QUFDQSxRQUFJLE9BQU92RCxTQUFQLEtBQXFCLFVBQXpCLEVBQXFDO0FBQ3JDLFFBQUksT0FBT0EsU0FBUCxLQUFxQixRQUF6QixFQUFtQztBQUNqQ0Esa0JBQVlBLFVBQVVwQyxRQUFWLEVBQVo7QUFDRDtBQUNELFFBQUksT0FBT29DLFNBQVAsS0FBcUIsUUFBekIsRUFBbUM7QUFDakNBLGtCQUFZLElBQUl3RCxNQUFKLENBQVcsNEJBQVl4RCxTQUFaLEVBQXVCL0MsT0FBdkIsQ0FBK0IsS0FBL0IsRUFBc0MsTUFBdEMsQ0FBWCxDQUFaO0FBQ0Q7QUFDRCxRQUFJLE9BQU8rQyxTQUFQLEtBQXFCLFNBQXpCLEVBQW9DO0FBQ2xDQSxrQkFBWUEsWUFBWSxNQUFaLEdBQXFCLElBQWpDO0FBQ0Q7QUFDRDtBQUNBa0QsV0FBT0ssSUFBUCxJQUFlLFVBQUNuSCxJQUFELEVBQU9DLEtBQVA7QUFBQSxhQUFpQjJELFVBQVV5RCxJQUFWLENBQWVwSCxLQUFmLENBQWpCO0FBQUEsS0FBZjtBQUNELEdBZEQ7O0FBZ0JBLFNBQU8yQyxZQUFZTyxJQUFaLElBQW9CUCxRQUFRMEUsUUFBUixLQUFxQixFQUFoRCxFQUFvRDtBQUNsRCxRQUFJTCxXQUFXckUsT0FBWCxNQUF3QixJQUE1QixFQUFrQztBQUNoQztBQUNBLFVBQUkyRSxnQkFBZ0JWLFFBQWhCLEVBQTBCakUsT0FBMUIsRUFBbUNrRSxNQUFuQyxFQUEyQ25HLElBQTNDLEVBQWlEc0MsTUFBakQsRUFBeUR6QixRQUF6RCxFQUFtRTJCLElBQW5FLENBQUosRUFBOEU7QUFDOUUsVUFBSXFFLFNBQVM1RSxPQUFULEVBQWtCa0UsTUFBbEIsRUFBMEJuRyxJQUExQixFQUFnQ3NDLE1BQWhDLEVBQXdDekIsUUFBeEMsRUFBa0QyQixJQUFsRCxDQUFKLEVBQTZEOztBQUU3RDtBQUNBb0Usc0JBQWdCVixRQUFoQixFQUEwQmpFLE9BQTFCLEVBQW1Da0UsTUFBbkMsRUFBMkNuRyxJQUEzQyxFQUFpRHNDLE1BQWpELEVBQXlEekIsUUFBekQ7QUFDQSxVQUFJYixLQUFLUCxNQUFMLEtBQWdCQSxNQUFwQixFQUE0QjtBQUMxQm9ILGlCQUFTNUUsT0FBVCxFQUFrQmtFLE1BQWxCLEVBQTBCbkcsSUFBMUIsRUFBZ0NzQyxNQUFoQyxFQUF3Q3pCLFFBQXhDO0FBQ0Q7O0FBRUQsVUFBSWIsS0FBS1AsTUFBTCxLQUFnQkEsTUFBaEIsSUFBMEIsQ0FBQyxDQUFELEVBQUksT0FBSixFQUFhcUgsUUFBYixDQUFzQjNGLE1BQXRCLENBQTlCLEVBQTZEO0FBQzNENEYsa0NBQTBCOUUsT0FBMUIsRUFBbUNqQyxJQUFuQyxFQUF5Q3NDLE1BQXpDLEVBQWlEekIsUUFBakQsRUFBMkRLLE9BQTNEO0FBQ0Q7O0FBRUQsVUFBSWxCLEtBQUtQLE1BQUwsS0FBZ0JBLE1BQWhCLElBQTBCLENBQUMsQ0FBRCxFQUFJLE9BQUosRUFBYSxRQUFiLEVBQXVCcUgsUUFBdkIsQ0FBZ0MzRixNQUFoQyxDQUE5QixFQUF1RTtBQUNyRTZGLGtCQUFVZCxRQUFWLEVBQW9CakUsT0FBcEIsRUFBNkJrRSxNQUE3QixFQUFxQ25HLElBQXJDLEVBQTJDc0MsTUFBM0MsRUFBbUR6QixRQUFuRCxFQUE2RE0sV0FBVyxRQUF4RTtBQUNEOztBQUVELFVBQUluQixLQUFLUCxNQUFMLEtBQWdCQSxNQUFwQixFQUE0QjtBQUMxQndILHNCQUFjZixRQUFkLEVBQXdCakUsT0FBeEIsRUFBaUNrRSxNQUFqQyxFQUF5Q25HLElBQXpDO0FBQ0Q7QUFDRjs7QUFFRGlDLGNBQVVBLFFBQVFMLFVBQWxCO0FBQ0FuQyxhQUFTTyxLQUFLUCxNQUFkO0FBQ0Q7O0FBRUQsTUFBSXdDLFlBQVlPLElBQWhCLEVBQXNCO0FBQ3BCLFFBQU01QyxVQUFVc0gsWUFBWWhCLFFBQVosRUFBc0JqRSxPQUF0QixFQUErQmtFLE1BQS9CLEVBQXVDN0QsTUFBdkMsRUFBK0N6QixRQUEvQyxDQUFoQjtBQUNBYixTQUFLNEQsT0FBTCxDQUFhaEUsT0FBYjtBQUNEOztBQUVELFNBQU9JLElBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTTRHLGtCQUFrQixTQUFsQkEsZUFBa0IsQ0FBQ1YsUUFBRCxFQUFXakUsT0FBWCxFQUFvQmtFLE1BQXBCLEVBQTRCbkcsSUFBNUIsRUFBa0NzQyxNQUFsQyxFQUEwQ3pCLFFBQTFDLEVBQW9GO0FBQUEsTUFBaENVLE1BQWdDLHVFQUF2QlUsUUFBUUwsVUFBZTs7QUFDMUcsTUFBTWhDLFVBQVV1SCxzQkFBc0JqQixRQUF0QixFQUFnQ2pFLE9BQWhDLEVBQXlDa0UsTUFBekMsRUFBaUQ3RCxNQUFqRCxFQUF5RHpCLFFBQXpELEVBQW1FVSxNQUFuRSxDQUFoQjtBQUNBLE1BQUkzQixPQUFKLEVBQWE7QUFDWEksU0FBSzRELE9BQUwsQ0FBYWhFLE9BQWI7QUFDQSxXQUFPLElBQVA7QUFDRDtBQUNELFNBQU8sS0FBUDtBQUNELENBUEQ7O0FBU0E7Ozs7OztBQU1BLElBQU13SCxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsTUFBRCxFQUFZO0FBQy9CLE1BQUlDLFNBQVMsQ0FBQyxFQUFELENBQWI7O0FBRUFELFNBQU81RCxPQUFQLENBQWUsYUFBSztBQUNsQjZELFdBQU83RCxPQUFQLENBQWU7QUFBQSxhQUFLNkQsT0FBT25GLElBQVAsQ0FBWW9GLEVBQUVqRSxNQUFGLENBQVNqRCxDQUFULENBQVosQ0FBTDtBQUFBLEtBQWY7QUFDRCxHQUZEOztBQUlBaUgsU0FBT3JELEtBQVA7QUFDQSxTQUFPcUQsTUFBUDtBQUNELENBVEQ7O0FBV0E7Ozs7Ozs7Ozs7QUFVQSxJQUFNRSxtQkFBbUIsU0FBbkJBLGdCQUFtQixHQUFrRDtBQUFBLE1BQWpEeEksT0FBaUQsdUVBQXZDLEVBQXVDO0FBQUEsTUFBbkNzRCxNQUFtQztBQUFBLE1BQTNCekIsUUFBMkI7QUFBQSxNQUFqQlUsTUFBaUI7QUFBQSxNQUFUekMsSUFBUzs7QUFDekUsTUFBSXdJLFNBQVNGLGFBQWFwSSxPQUFiLENBQWI7O0FBRUEsT0FBSSxJQUFJNkQsSUFBSSxDQUFaLEVBQWVBLElBQUl5RSxPQUFPN0gsTUFBMUIsRUFBa0NvRCxHQUFsQyxFQUF1QztBQUNyQyxRQUFNakQsVUFBVWlCLFNBQVNqQixPQUFULGNBQXNCZCxJQUF0QixJQUE0QkUsU0FBU3NJLE9BQU96RSxDQUFQLENBQXJDLElBQWhCO0FBQ0EsUUFBTTRFLFVBQVVuRixPQUFPMUMsT0FBUCxFQUFnQjJCLE1BQWhCLENBQWhCO0FBQ0EsUUFBSWtHLFFBQVFoSSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCLGFBQU82SCxPQUFPekUsQ0FBUCxDQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQVpEOztBQWNBOzs7Ozs7Ozs7OztBQVdBLElBQU1zRSx3QkFBd0IsU0FBeEJBLHFCQUF3QixDQUFDakIsUUFBRCxFQUFXakUsT0FBWCxFQUFvQmtFLE1BQXBCLEVBQTRCN0QsTUFBNUIsRUFBb0N6QixRQUFwQyxFQUE4RTtBQUFBLE1BQWhDVSxNQUFnQyx1RUFBdkJVLFFBQVFMLFVBQWU7O0FBQzFHLE1BQU03QyxhQUFha0QsUUFBUWxELFVBQTNCO0FBQ0EsTUFBSTJJLGlCQUFpQnRDLE9BQU9DLElBQVAsQ0FBWXRHLFVBQVosRUFBd0JLLEdBQXhCLENBQTRCLFVBQUN1SSxHQUFEO0FBQUEsV0FBUzVJLFdBQVc0SSxHQUFYLEVBQWdCdEksSUFBekI7QUFBQSxHQUE1QixFQUNsQjRGLE1BRGtCLENBQ1gsVUFBQzJDLENBQUQ7QUFBQSxXQUFPMUIsU0FBU0gsT0FBVCxDQUFpQjZCLENBQWpCLElBQXNCLENBQTdCO0FBQUEsR0FEVyxDQUFyQjs7QUFHQSxNQUFJQywwQ0FBa0IzQixRQUFsQixzQkFBK0J3QixjQUEvQixFQUFKO0FBQ0EsTUFBSTlILFVBQVUsNkJBQWQ7QUFDQUEsVUFBUUUsR0FBUixHQUFjbUMsUUFBUTJELE9BQVIsQ0FBZ0JDLFdBQWhCLEVBQWQ7O0FBRUEsTUFBSWlDLFlBQVksU0FBWkEsU0FBWSxDQUFDbEksT0FBRDtBQUFBLFdBQWMwQyxPQUFPekIsU0FBU2pCLE9BQVQsQ0FBaUJBLE9BQWpCLENBQVAsRUFBa0MyQixNQUFsQyxFQUEwQzlCLE1BQTFDLEtBQXFELENBQW5FO0FBQUEsR0FBaEI7O0FBRUEsT0FBSyxJQUFJb0QsSUFBSSxDQUFSLEVBQVcwQixJQUFJc0QsV0FBV3BJLE1BQS9CLEVBQXVDb0QsSUFBSTBCLENBQTNDLEVBQThDMUIsR0FBOUMsRUFBbUQ7QUFDakQsUUFBTXlDLE1BQU11QyxXQUFXaEYsQ0FBWCxDQUFaO0FBQ0EsUUFBTTBDLFlBQVl4RyxXQUFXdUcsR0FBWCxDQUFsQjtBQUNBLFFBQU1FLGdCQUFnQiw0QkFBWUQsYUFBYUEsVUFBVWxHLElBQW5DLENBQXRCO0FBQ0EsUUFBTTBJLGlCQUFpQiw0QkFBWXhDLGFBQWFBLFVBQVVqRyxLQUFuQyxDQUF2QjtBQUNBLFFBQU0wSSxpQkFBaUJ4QyxrQkFBa0IsT0FBekM7O0FBRUEsUUFBTXlDLGdCQUFpQkQsa0JBQWtCN0IsT0FBT1gsYUFBUCxDQUFuQixJQUE2Q1csT0FBT1osU0FBMUU7QUFDQSxRQUFNMkMsdUJBQXdCRixrQkFBa0JsQyxjQUFjTixhQUFkLENBQW5CLElBQW9ETSxjQUFjUCxTQUEvRjtBQUNBLFFBQUk0QyxZQUFZRixhQUFaLEVBQTJCekMsYUFBM0IsRUFBMEN1QyxjQUExQyxFQUEwREcsb0JBQTFELENBQUosRUFBcUY7QUFDbkY7QUFDRDs7QUFFRCxZQUFRMUMsYUFBUjtBQUNFLFdBQUssT0FBTDtBQUFjO0FBQUE7QUFDWixnQkFBSTRDLGFBQWFMLGVBQWVoRCxJQUFmLEdBQXNCQyxLQUF0QixDQUE0QixNQUE1QixDQUFqQjtBQUNBLGdCQUFNcUQsY0FBY2xDLE9BQU9tQyxLQUFQLElBQWdCeEMsY0FBY3dDLEtBQWxEO0FBQ0EsZ0JBQUlELFdBQUosRUFBaUI7QUFDZkQsMkJBQWFBLFdBQVduRCxNQUFYLENBQWtCO0FBQUEsdUJBQWEsQ0FBQ29ELFlBQVlFLFNBQVosQ0FBZDtBQUFBLGVBQWxCLENBQWI7QUFDRDtBQUNELGdCQUFJSCxXQUFXM0ksTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN6QixrQkFBTVQsVUFBVXdJLGlCQUFpQlksVUFBakIsRUFBNkI5RixNQUE3QixFQUFxQ3pCLFFBQXJDLEVBQStDVSxNQUEvQyxFQUF1RDNCLE9BQXZELENBQWhCO0FBQ0Esa0JBQUlaLE9BQUosRUFBYTtBQUNYWSx3QkFBUVosT0FBUixHQUFrQkEsT0FBbEI7QUFDQSxvQkFBSThJLFVBQVVsSSxPQUFWLENBQUosRUFBd0I7QUFDdEI7QUFBQSx1QkFBT0E7QUFBUDtBQUNEO0FBQ0Y7QUFDRjtBQWRXOztBQUFBO0FBZWI7QUFDQzs7QUFFRjtBQUNFQSxnQkFBUWIsVUFBUixDQUFtQm9ELElBQW5CLENBQXdCLEVBQUU5QyxNQUFNbUcsYUFBUixFQUF1QmxHLE9BQU95SSxjQUE5QixFQUF4QjtBQUNBLFlBQUlELFVBQVVsSSxPQUFWLENBQUosRUFBd0I7QUFDdEIsaUJBQU9BLE9BQVA7QUFDRDtBQXZCTDtBQXlCRDs7QUFFRCxTQUFPLElBQVA7QUFDRCxDQXBERDs7QUF1REE7Ozs7Ozs7Ozs7O0FBV0EsSUFBTWlILFdBQVcsU0FBWEEsUUFBVyxDQUFDNUUsT0FBRCxFQUFVa0UsTUFBVixFQUFrQm5HLElBQWxCLEVBQXdCc0MsTUFBeEIsRUFBZ0N6QixRQUFoQyxFQUEwRTtBQUFBLE1BQWhDVSxNQUFnQyx1RUFBdkJVLFFBQVFMLFVBQWU7O0FBQ3pGLE1BQU1oQyxVQUFVNEksZUFBZXZHLE9BQWYsRUFBd0JrRSxNQUF4QixDQUFoQjtBQUNBLE1BQUl2RyxPQUFKLEVBQWE7QUFDWCxRQUFJNkgsVUFBVSxFQUFkO0FBQ0FBLGNBQVVuRixPQUFPekIsU0FBU2pCLE9BQVQsQ0FBaUJBLE9BQWpCLENBQVAsRUFBa0MyQixNQUFsQyxDQUFWO0FBQ0EsUUFBSWtHLFFBQVFoSSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCTyxXQUFLNEQsT0FBTCxDQUFhaEUsT0FBYjtBQUNBLFVBQUlBLFFBQVFFLEdBQVIsS0FBZ0IsUUFBcEIsRUFBOEI7QUFDNUIsZUFBTyxLQUFQO0FBQ0Q7QUFDRCxhQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBTyxLQUFQO0FBQ0QsQ0FkRDs7QUFnQkE7Ozs7Ozs7QUFPQSxJQUFNMEksaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDdkcsT0FBRCxFQUFVa0UsTUFBVixFQUFxQjtBQUMxQyxNQUFNUCxVQUFVM0QsUUFBUTJELE9BQVIsQ0FBZ0JDLFdBQWhCLEVBQWhCO0FBQ0EsTUFBSXNDLFlBQVloQyxPQUFPckcsR0FBbkIsRUFBd0IsSUFBeEIsRUFBOEI4RixPQUE5QixDQUFKLEVBQTRDO0FBQzFDLFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBTWhHLFVBQVUsNkJBQWhCO0FBQ0FBLFVBQVFFLEdBQVIsR0FBYzhGLE9BQWQ7QUFDQSxTQUFPaEcsT0FBUDtBQUNELENBUkQ7O0FBVUE7Ozs7Ozs7OztBQVNBLElBQU1xSCxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNmLFFBQUQsRUFBV2pFLE9BQVgsRUFBb0JrRSxNQUFwQixFQUE0Qm5HLElBQTVCLEVBQXFDO0FBQ3pELE1BQU11QixTQUFTVSxRQUFRTCxVQUF2QjtBQUNBLE1BQU1oQixXQUFXVyxPQUFPWCxRQUF4QjtBQUNBLE9BQUssSUFBSWlDLElBQUksQ0FBUixFQUFXMEIsSUFBSTNELFNBQVNuQixNQUE3QixFQUFxQ29ELElBQUkwQixDQUF6QyxFQUE0QzFCLEdBQTVDLEVBQWlEO0FBQy9DLFFBQU00RixRQUFRN0gsU0FBU2lDLENBQVQsQ0FBZDtBQUNBLFFBQUk0RixVQUFVeEcsT0FBZCxFQUF1QjtBQUNyQixVQUFNeUcsZUFBZUYsZUFBZUMsS0FBZixFQUFzQnRDLE1BQXRCLENBQXJCO0FBQ0EsVUFBSSxDQUFDdUMsWUFBTCxFQUFtQjtBQUNqQixlQUFPQyxRQUFRQyxJQUFSLHNGQUVKSCxLQUZJLEVBRUd0QyxNQUZILEVBRVd1QyxZQUZYLENBQVA7QUFHRDtBQUNEQSxtQkFBYTdJLE9BQWIsR0FBdUIsT0FBdkI7QUFDQTZJLG1CQUFhekosTUFBYixHQUFzQixpQkFBYzRELElBQUUsQ0FBaEIsUUFBdEI7QUFDQTdDLFdBQUs0RCxPQUFMLENBQWE4RSxZQUFiO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sS0FBUDtBQUNELENBbkJEOztBQXFCQTs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTTFCLFlBQVksU0FBWkEsU0FBWSxDQUFDZCxRQUFELEVBQVdqRSxPQUFYLEVBQW9Ca0UsTUFBcEIsRUFBNEJuRyxJQUE1QixFQUFrQ3NDLE1BQWxDLEVBQTBDekIsUUFBMUMsRUFBb0RnSSxNQUFwRCxFQUErRDtBQUMvRSxNQUFNakosVUFBVTRJLGVBQWV2RyxPQUFmLEVBQXdCa0UsTUFBeEIsQ0FBaEI7QUFDQSxNQUFJLENBQUN2RyxPQUFMLEVBQWM7QUFDWixXQUFPLEtBQVA7QUFDRDtBQUNELE1BQU1rSixjQUFlRCxTQUFTNUcsUUFBUTZHLFdBQWpCLEdBQWdDN0csUUFBUThHLFVBQVIsSUFBc0I5RyxRQUFROEcsVUFBUixDQUFtQkMsU0FBMUMsSUFBd0QsRUFBNUc7QUFDQSxNQUFJLENBQUNGLFdBQUwsRUFBa0I7QUFDaEIsV0FBTyxLQUFQO0FBQ0Q7O0FBRURsSixVQUFRQyxPQUFSLEdBQWtCLE9BQWxCO0FBQ0EsTUFBTTBCLFNBQVNVLFFBQVFMLFVBQXZCO0FBQ0EsTUFBTXFILFFBQVFILFlBQ1g1SSxPQURXLENBQ0gsTUFERyxFQUNLLElBREwsRUFFWDhFLEtBRlcsQ0FFTCxJQUZLLEVBR1g1RixHQUhXLENBR1A7QUFBQSxXQUFROEosS0FBS25FLElBQUwsRUFBUjtBQUFBLEdBSE8sRUFJWEUsTUFKVyxDQUlKO0FBQUEsV0FBUWlFLEtBQUt6SixNQUFMLEdBQWMsQ0FBdEI7QUFBQSxHQUpJLENBQWQ7O0FBTUEsTUFBTTBKLFdBQVcsRUFBakI7O0FBRUEsU0FBT0YsTUFBTXhKLE1BQU4sR0FBZSxDQUF0QixFQUF5QjtBQUN2QixRQUFNeUosT0FBT0QsTUFBTWhGLEtBQU4sRUFBYjtBQUNBLFFBQUlrRSxZQUFZaEMsT0FBT2dELFFBQW5CLEVBQTZCLElBQTdCLEVBQW1DRCxJQUFuQyxDQUFKLEVBQThDO0FBQzVDO0FBQ0Q7QUFDREMsYUFBU2hILElBQVQsZ0JBQTJCK0csSUFBM0I7O0FBRUEsUUFBTXpCLFVBQVVuRixPQUFPekIsU0FBU2pCLE9BQVQsY0FBc0JBLE9BQXRCLElBQStCWCxRQUFRa0ssUUFBdkMsSUFBUCxFQUEyRDVILE1BQTNELENBQWhCO0FBQ0EsUUFBSWtHLFFBQVFoSSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCRyxjQUFRWCxNQUFSLEdBQWlCa0ssUUFBakI7QUFDQW5KLFdBQUs0RCxPQUFMLENBQWFoRSxPQUFiO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxRQUFJNkgsUUFBUWhJLE1BQVIsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsYUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sS0FBUDtBQUNELENBdENEOztBQXdDQTs7Ozs7Ozs7OztBQVVBLElBQU1zSCw0QkFBNEIsU0FBNUJBLHlCQUE0QixDQUFDOUUsT0FBRCxFQUFVakMsSUFBVixFQUFnQnNDLE1BQWhCLEVBQXdCekIsUUFBeEIsRUFBa0NLLE9BQWxDLEVBQThDO0FBQzlFLE1BQU10QixVQUFVNEksZUFBZXZHLE9BQWYsRUFBd0JmLFFBQVFpRixNQUFoQyxDQUFoQjtBQUNBLE1BQUksQ0FBQ3ZHLE9BQUwsRUFBYztBQUNaLFdBQU8sS0FBUDtBQUNEOztBQUVELE1BQU1WLGNBQWMwRCxNQUFNd0csSUFBTixDQUFXbkgsUUFBUUksZ0JBQVIsQ0FBeUIsR0FBekIsQ0FBWCxDQUFwQjtBQUNBLFNBQU9uRCxZQUFZTyxNQUFaLEdBQXFCLENBQTVCLEVBQStCO0FBQzdCLFFBQU00SixhQUFhbkssWUFBWStFLEtBQVosRUFBbkI7QUFDQSxRQUFNcUYsaUJBQWlCL0ksTUFBTThJLFVBQU4sZUFBdUJuSSxPQUF2QixJQUFnQ3NCLE1BQU1QLE9BQXRDLElBQXZCO0FBQ0E7QUFDQSxRQUFJLENBQUNxSCxlQUFlbEYsSUFBZixDQUFvQjtBQUFBLGFBQVd4RSxRQUFRWCxNQUFSLENBQWVtRixJQUFmLENBQW9CO0FBQUEsZUFBSzVELEVBQUVxQixVQUFGLENBQWEsV0FBYixDQUFMO0FBQUEsT0FBcEIsQ0FBWDtBQUFBLEtBQXBCLENBQUwsRUFBMEY7QUFDeEYsVUFBTU4sU0FBU1UsUUFBUXNILGFBQXZCO0FBQ0EsVUFBTTlCLFVBQVVuRixPQUFPekIsU0FBU2pCLE9BQVQsY0FBc0JBLE9BQXRCLElBQStCVixhQUFhLENBQUNvSyxjQUFELENBQTVDLElBQVAsRUFBd0UvSCxNQUF4RSxDQUFoQjtBQUNBLFVBQUlrRyxRQUFRaEksTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN4QkcsZ0JBQVFWLFdBQVIsR0FBc0IsQ0FBQ29LLGNBQUQsQ0FBdEI7QUFDQXRKLGFBQUs0RCxPQUFMLENBQWFoRSxPQUFiO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQU8sS0FBUDtBQUNELENBdkJEOztBQXlCQTs7Ozs7Ozs7OztBQVVBLElBQU1zSCxjQUFjLFNBQWRBLFdBQWMsQ0FBQ2hCLFFBQUQsRUFBV2pFLE9BQVgsRUFBb0JrRSxNQUFwQixFQUE0QjdELE1BQTVCLEVBQW9DekIsUUFBcEMsRUFBaUQ7QUFDbkUsTUFBSWpCLFVBQVV1SCxzQkFBc0JqQixRQUF0QixFQUFnQ2pFLE9BQWhDLEVBQXlDa0UsTUFBekMsRUFBaUQ3RCxNQUFqRCxFQUF5RHpCLFFBQXpELENBQWQ7QUFDQSxNQUFJLENBQUNqQixPQUFMLEVBQWM7QUFDWkEsY0FBVTRJLGVBQWV2RyxPQUFmLEVBQXdCa0UsTUFBeEIsQ0FBVjtBQUNEO0FBQ0QsU0FBT3ZHLE9BQVA7QUFDRCxDQU5EOztBQVFBOzs7Ozs7Ozs7QUFTQSxJQUFNdUksY0FBYyxTQUFkQSxXQUFjLENBQUNsRixTQUFELEVBQVk1RCxJQUFaLEVBQWtCQyxLQUFsQixFQUF5QmtLLGdCQUF6QixFQUE4QztBQUNoRSxNQUFJLENBQUNsSyxLQUFMLEVBQVk7QUFDVixXQUFPLElBQVA7QUFDRDtBQUNELE1BQU1tSyxRQUFReEcsYUFBYXVHLGdCQUEzQjtBQUNBLE1BQUksQ0FBQ0MsS0FBTCxFQUFZO0FBQ1YsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPQSxNQUFNcEssSUFBTixFQUFZQyxLQUFaLEVBQW1Ca0ssZ0JBQW5CLENBQVA7QUFDRCxDQVREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ3Bad0JFLFE7O0FBbEJ4Qjs7QUFDQTs7QUFDQTs7b01BVEE7Ozs7Ozs7QUFXQTs7Ozs7O0FBTUE7Ozs7Ozs7O0FBUWUsU0FBU0EsUUFBVCxDQUFtQjFKLElBQW5CLEVBQXlCZ0MsUUFBekIsRUFBaUQ7QUFBQSxNQUFkZCxPQUFjLHVFQUFKLEVBQUk7O0FBQzlELE1BQUlsQixLQUFLUCxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLFdBQU8sRUFBUDtBQUNEOztBQUVELE1BQUlPLEtBQUssQ0FBTCxFQUFRSCxPQUFSLEtBQW9CLE9BQXhCLEVBQWlDO0FBQy9CRyxTQUFLLENBQUwsRUFBUUgsT0FBUixHQUFrQmdGLFNBQWxCO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJLENBQUNqQyxNQUFNeUQsT0FBTixDQUFjckUsUUFBZCxDQUFMLEVBQThCO0FBQzVCQSxlQUFXLENBQUNBLFNBQVN2QyxNQUFWLEdBQW1CLENBQUN1QyxRQUFELENBQW5CLEdBQWdDLGdDQUFnQkEsUUFBaEIsQ0FBM0M7QUFDRDs7QUFFRCxNQUFJLENBQUNBLFNBQVN2QyxNQUFWLElBQW9CdUMsU0FBU29DLElBQVQsQ0FBYyxVQUFDbkMsT0FBRDtBQUFBLFdBQWFBLFFBQVEwRSxRQUFSLEtBQXFCLENBQWxDO0FBQUEsR0FBZCxDQUF4QixFQUE0RTtBQUMxRSxVQUFNLElBQUlnRCxLQUFKLENBQVUsNEhBQVYsQ0FBTjtBQUNEOztBQUVELE1BQU1ySCxTQUFTLHlCQUFVcEIsT0FBVixDQUFmO0FBQ0EsTUFBTUwsV0FBVywyQkFBWUssT0FBWixDQUFqQjs7QUFFQSxNQUFJbEIsS0FBS1AsTUFBTCxLQUFnQixDQUFwQixFQUF1QjtBQUNyQixXQUFPLENBQUNtSyxhQUFhLEVBQWIsRUFBaUI1SixLQUFLLENBQUwsQ0FBakIsRUFBMEIsRUFBMUIsRUFBOEJnQyxRQUE5QixFQUF3Q00sTUFBeEMsRUFBZ0R6QixRQUFoRCxDQUFELENBQVA7QUFDRDs7QUFFRCxNQUFJZ0osZUFBZSxLQUFuQjtBQUNBLE1BQUk3SixLQUFLQSxLQUFLUCxNQUFMLEdBQVksQ0FBakIsRUFBb0JJLE9BQXBCLEtBQWdDLE9BQXBDLEVBQTZDO0FBQzNDRyxTQUFLQSxLQUFLUCxNQUFMLEdBQVksQ0FBakIsSUFBc0JtSyxhQUFhNUosS0FBSzhKLEtBQUwsQ0FBVyxDQUFYLEVBQWMsQ0FBQyxDQUFmLENBQWIsRUFBZ0M5SixLQUFLQSxLQUFLUCxNQUFMLEdBQVksQ0FBakIsQ0FBaEMsRUFBcUQsRUFBckQsRUFBeUR1QyxRQUF6RCxFQUFtRU0sTUFBbkUsRUFBMkV6QixRQUEzRSxDQUF0QjtBQUNBZ0osbUJBQWUsSUFBZjtBQUNEOztBQUVEN0osc0NBQVdBLElBQVg7QUFDQSxNQUFNK0osWUFBWSxDQUFDL0osS0FBS2dLLEdBQUwsRUFBRCxDQUFsQjs7QUFoQzhEO0FBa0M1RCxRQUFNQyxVQUFVakssS0FBS2dLLEdBQUwsRUFBaEI7QUFDQSxRQUFNdkMsVUFBVW5GLE9BQU96QixTQUFTYixJQUFULDhCQUFrQkEsSUFBbEIsR0FBMkIrSixTQUEzQixFQUFQLENBQWhCO0FBQ0EsUUFBTUcsZ0JBQWdCekMsUUFBUWhJLE1BQVIsS0FBbUJ1QyxTQUFTdkMsTUFBNUIsSUFBc0N1QyxTQUFTbUksS0FBVCxDQUFlLFVBQUNsSSxPQUFELEVBQVVZLENBQVY7QUFBQSxhQUFnQlosWUFBWXdGLFFBQVE1RSxDQUFSLENBQTVCO0FBQUEsS0FBZixDQUE1RDtBQUNBLFFBQUksQ0FBQ3FILGFBQUwsRUFBb0I7QUFDbEJILGdCQUFVbkcsT0FBVixDQUFrQmdHLGFBQWE1SixJQUFiLEVBQW1CaUssT0FBbkIsRUFBNEJGLFNBQTVCLEVBQXVDL0gsUUFBdkMsRUFBaURNLE1BQWpELEVBQXlEekIsUUFBekQsQ0FBbEI7QUFDRDtBQXZDMkQ7O0FBaUM5RCxTQUFPYixLQUFLUCxNQUFMLEdBQWMsQ0FBckIsRUFBd0I7QUFBQTtBQU92QjtBQUNEc0ssWUFBVW5HLE9BQVYsQ0FBa0I1RCxLQUFLLENBQUwsQ0FBbEI7QUFDQUEsU0FBTytKLFNBQVA7O0FBRUE7QUFDQS9KLE9BQUssQ0FBTCxJQUFVNEosYUFBYSxFQUFiLEVBQWlCNUosS0FBSyxDQUFMLENBQWpCLEVBQTBCQSxLQUFLOEosS0FBTCxDQUFXLENBQVgsQ0FBMUIsRUFBeUM5SCxRQUF6QyxFQUFtRE0sTUFBbkQsRUFBMkR6QixRQUEzRCxDQUFWO0FBQ0EsTUFBSSxDQUFDZ0osWUFBTCxFQUFtQjtBQUNqQjdKLFNBQUtBLEtBQUtQLE1BQUwsR0FBWSxDQUFqQixJQUFzQm1LLGFBQWE1SixLQUFLOEosS0FBTCxDQUFXLENBQVgsRUFBYyxDQUFDLENBQWYsQ0FBYixFQUFnQzlKLEtBQUtBLEtBQUtQLE1BQUwsR0FBWSxDQUFqQixDQUFoQyxFQUFxRCxFQUFyRCxFQUF5RHVDLFFBQXpELEVBQW1FTSxNQUFuRSxFQUEyRXpCLFFBQTNFLENBQXRCO0FBQ0Q7O0FBRUQsU0FBT2IsSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQVdBLElBQU1vSyxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsR0FBRCxFQUFNSixPQUFOLEVBQWVLLElBQWYsRUFBcUJ0SSxRQUFyQixFQUErQk0sTUFBL0IsRUFBdUN6QixRQUF2QyxFQUFvRDtBQUFBLG1CQUM3QywwQkFBVW9KLFFBQVFoTCxNQUFsQixFQUEwQixVQUFDa0UsSUFBRDtBQUFBLFdBQVVBLEtBQUt0QixVQUFMLENBQWdCLFVBQWhCLENBQVY7QUFBQSxHQUExQixDQUQ2QztBQUFBO0FBQUEsTUFDaEVzSCxRQURnRTtBQUFBLE1BQ3REb0IsS0FEc0Q7O0FBR3ZFLE1BQUlwQixTQUFTMUosTUFBVCxHQUFrQixDQUFsQixJQUF1QjZLLEtBQUs3SyxNQUFoQyxFQUF3QztBQUN0QyxRQUFNWCxvQkFBWW1MLE9BQVosSUFBcUJoTCxxQ0FBWXNMLEtBQVosc0JBQXNCcEIsUUFBdEIsRUFBckIsR0FBTjtBQUNBLFdBQU9ySyxLQUFLRyxNQUFMLENBQVlRLE1BQVosR0FBcUI4SyxNQUFNOUssTUFBbEMsRUFBMEM7QUFDeEMsVUFBTStLLFlBQVkxTCxLQUFLRyxNQUFMLENBQVk2SyxLQUFaLENBQWtCLENBQWxCLEVBQXFCLENBQUMsQ0FBdEIsQ0FBbEI7QUFDQSxVQUFJLENBQUNXLGVBQWVuSSxPQUFPekIsU0FBU2IsSUFBVCw4QkFBa0JxSyxHQUFsQixpQkFBNEJ2TCxJQUE1QixJQUFrQ0csUUFBUXVMLFNBQTFDLHlCQUEwREYsSUFBMUQsR0FBUCxDQUFmLEVBQXlGdEksUUFBekYsQ0FBTCxFQUF5RztBQUN2RztBQUNEO0FBQ0RsRCxXQUFLRyxNQUFMLEdBQWN1TCxTQUFkO0FBQ0Q7QUFDRCxXQUFPMUwsSUFBUDtBQUNEO0FBQ0QsU0FBT21MLE9BQVA7QUFDRCxDQWZEOztBQWlCQTs7Ozs7Ozs7Ozs7QUFXQSxJQUFNUyxxQkFBcUIsU0FBckJBLGtCQUFxQixDQUFDTCxHQUFELEVBQU1KLE9BQU4sRUFBZUssSUFBZixFQUFxQnRJLFFBQXJCLEVBQStCTSxNQUEvQixFQUF1Q3pCLFFBQXZDLEVBQW9EO0FBQzdFO0FBQ0EsTUFBSW9KLFFBQVFsTCxVQUFSLENBQW1CVSxNQUFuQixHQUE0QixDQUFoQyxFQUFtQztBQUNqQyxRQUFJViwwQ0FBaUJrTCxRQUFRbEwsVUFBekIsRUFBSjs7QUFFQSxRQUFNNEwsV0FBVyxTQUFYQSxRQUFXLENBQUNDLFFBQUQsRUFBV0MsYUFBWCxFQUE2QjtBQUM1QyxVQUFJaEksSUFBSStILFNBQVNuTCxNQUFULEdBQWtCLENBQTFCO0FBQ0EsYUFBT29ELEtBQUssQ0FBWixFQUFlO0FBQ2IsWUFBSTlELGNBQWE4TCxjQUFjRCxRQUFkLEVBQXdCL0gsQ0FBeEIsQ0FBakI7QUFDQSxZQUFJLENBQUM0SCxlQUNIbkksT0FBT3pCLFNBQVNiLElBQVQsOEJBQWtCcUssR0FBbEIsaUJBQTRCSixPQUE1QixJQUFxQ2xMLHVCQUFyQyx5QkFBc0R1TCxJQUF0RCxHQUFQLENBREcsRUFFSHRJLFFBRkcsQ0FBTCxFQUdHO0FBQ0Q7QUFDRDtBQUNEYTtBQUNBK0gsbUJBQVc3TCxXQUFYO0FBQ0Q7QUFDRCxhQUFPNkwsUUFBUDtBQUNELEtBZEQ7O0FBZ0JBLFFBQU1FLGFBQWFILFNBQVM1TCxVQUFULEVBQXFCLFVBQUNBLFVBQUQsRUFBYThELENBQWIsRUFBbUI7QUFBQSxVQUNqRHhELElBRGlELEdBQ3hDTixXQUFXOEQsQ0FBWCxDQUR3QyxDQUNqRHhELElBRGlEOztBQUV6RCxVQUFJQSxTQUFTLElBQWIsRUFBbUI7QUFDakIsZUFBT04sVUFBUDtBQUNEO0FBQ0QsMENBQVdBLFdBQVcrSyxLQUFYLENBQWlCLENBQWpCLEVBQW9CakgsQ0FBcEIsQ0FBWCxJQUFtQyxFQUFFeEQsVUFBRixFQUFRQyxPQUFPLElBQWYsRUFBbkMsc0JBQTZEUCxXQUFXK0ssS0FBWCxDQUFpQmpILElBQUksQ0FBckIsQ0FBN0Q7QUFDRCxLQU5rQixDQUFuQjtBQU9BLHdCQUFZb0gsT0FBWixJQUFxQmxMLFlBQVk0TCxTQUFTRyxVQUFULEVBQXFCO0FBQUEsZUFBYy9MLFdBQVcrSyxLQUFYLENBQWlCLENBQWpCLEVBQW9CLENBQUMsQ0FBckIsQ0FBZDtBQUFBLE9BQXJCLENBQWpDO0FBQ0Q7QUFDRCxTQUFPRyxPQUFQO0FBQ0QsQ0EvQkQ7O0FBaUNBOzs7Ozs7Ozs7OztBQVdBLElBQU1jLHFCQUFxQixTQUFyQkEsa0JBQXFCLENBQUNWLEdBQUQsRUFBTUosT0FBTixFQUFlSyxJQUFmLEVBQXFCdEksUUFBckIsRUFBK0JNLE1BQS9CLEVBQXVDekIsUUFBdkMsRUFBb0Q7QUFDN0U7QUFDQSxNQUFJb0osUUFBUXBLLE9BQVIsS0FBb0IsT0FBeEIsRUFBaUM7QUFDL0IsUUFBTXdKLDBCQUFrQlksT0FBbEIsSUFBMkJwSyxTQUFTZ0YsU0FBcEMsR0FBTjtBQUNBLFFBQUk0QyxXQUFVbkYsT0FBT3pCLFNBQVNiLElBQVQsOEJBQWtCcUssR0FBbEIsSUFBdUJoQixVQUF2QixzQkFBc0NpQixJQUF0QyxHQUFQLENBQWQ7QUFDQSxRQUFJRyxlQUFlaEQsUUFBZixFQUF3QnpGLFFBQXhCLENBQUosRUFBdUM7QUFDckMsYUFBT3FILFVBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBT1ksT0FBUDtBQUNELENBVkQ7O0FBWUE7Ozs7Ozs7Ozs7O0FBV0EsSUFBTWUsK0JBQStCLFNBQS9CQSw0QkFBK0IsQ0FBQ1gsR0FBRCxFQUFNSixPQUFOLEVBQWVLLElBQWYsRUFBcUJ0SSxRQUFyQixFQUErQk0sTUFBL0IsRUFBdUN6QixRQUF2QyxFQUFvRDtBQUN2RixNQUFJb0osUUFBUS9LLFdBQVIsQ0FBb0JPLE1BQXBCLEdBQTZCLENBQTdCLElBQWtDNkssS0FBSzdLLE1BQTNDLEVBQW1EO0FBQ2pELFFBQU1YLG9CQUFZbUwsT0FBWixJQUFxQi9LLDBDQUFpQitLLFFBQVEvSyxXQUF6QixFQUFyQixHQUFOO0FBQ0EsV0FBT0osS0FBS0ksV0FBTCxDQUFpQk8sTUFBakIsR0FBMEIsQ0FBakMsRUFBb0M7QUFDbEMsVUFBTStLLFlBQVkxTCxLQUFLSSxXQUFMLENBQWlCNEssS0FBakIsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBQyxDQUEzQixDQUFsQjtBQUNBLFVBQUksQ0FBQ1csZUFBZW5JLE9BQU96QixTQUFTYixJQUFULDhCQUFrQnFLLEdBQWxCLGlCQUE0QnZMLElBQTVCLElBQWtDSSxhQUFhc0wsU0FBL0MseUJBQStERixJQUEvRCxHQUFQLENBQWYsRUFBOEZ0SSxRQUE5RixDQUFMLEVBQThHO0FBQzVHO0FBQ0Q7QUFDRGxELFdBQUtJLFdBQUwsR0FBbUJzTCxTQUFuQjtBQUNEO0FBQ0QsV0FBTzFMLElBQVA7QUFDRDtBQUNELFNBQU9tTCxPQUFQO0FBQ0QsQ0FiRDs7QUFlQTs7Ozs7Ozs7Ozs7QUFXQSxJQUFNZ0Isb0JBQW9CLFNBQXBCQSxpQkFBb0IsQ0FBQ1osR0FBRCxFQUFNSixPQUFOLEVBQWVLLElBQWYsRUFBcUJ0SSxRQUFyQixFQUErQk0sTUFBL0IsRUFBdUN6QixRQUF2QyxFQUFvRDtBQUM1RSxNQUFNZ0MsSUFBSW9ILFFBQVFoTCxNQUFSLENBQWVpTSxTQUFmLENBQXlCO0FBQUEsV0FBUS9ILEtBQUt0QixVQUFMLENBQWdCLFdBQWhCLENBQVI7QUFBQSxHQUF6QixDQUFWO0FBQ0E7QUFDQSxNQUFJZ0IsS0FBSyxDQUFULEVBQVk7QUFDVjtBQUNBLFFBQU0yRCxPQUFPeUQsUUFBUWhMLE1BQVIsQ0FBZTRELENBQWYsRUFBa0IzQyxPQUFsQixDQUEwQixZQUExQixFQUF3QyxhQUF4QyxDQUFiO0FBQ0EsUUFBTWlMLHlCQUFpQmxCLE9BQWpCLElBQTBCaEwscUNBQVlnTCxRQUFRaEwsTUFBUixDQUFlNkssS0FBZixDQUFxQixDQUFyQixFQUF3QmpILENBQXhCLENBQVosSUFBd0MyRCxJQUF4QyxzQkFBaUR5RCxRQUFRaEwsTUFBUixDQUFlNkssS0FBZixDQUFxQmpILElBQUksQ0FBekIsQ0FBakQsRUFBMUIsR0FBTjtBQUNBLFFBQUlqRCxVQUFVaUIsU0FBU2IsSUFBVCw4QkFBa0JxSyxHQUFsQixJQUF1QmMsU0FBdkIsc0JBQXFDYixJQUFyQyxHQUFkO0FBQ0EsUUFBSTdDLFlBQVVuRixPQUFPMUMsT0FBUCxDQUFkO0FBQ0EsUUFBSTZLLGVBQWVoRCxTQUFmLEVBQXdCekYsUUFBeEIsQ0FBSixFQUF1QztBQUNyQyxhQUFPbUosU0FBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPbEIsT0FBUDtBQUNELENBZEQ7O0FBZ0JBOzs7Ozs7Ozs7OztBQVdBLElBQU1tQixrQkFBa0IsU0FBbEJBLGVBQWtCLENBQUNmLEdBQUQsRUFBTUosT0FBTixFQUFlSyxJQUFmLEVBQXFCdEksUUFBckIsRUFBK0JNLE1BQS9CLEVBQXVDekIsUUFBdkMsRUFBb0Q7QUFDMUU7QUFDQSxNQUFJb0osUUFBUWpMLE9BQVIsQ0FBZ0JTLE1BQWhCLEdBQXlCLENBQTdCLEVBQWdDO0FBQzlCLFFBQUkrSyxZQUFZUCxRQUFRakwsT0FBUixDQUFnQjhLLEtBQWhCLEdBQXdCakcsSUFBeEIsQ0FBNkIsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQO0FBQUEsYUFBZ0JELEtBQUtyRSxNQUFMLEdBQWNzRSxLQUFLdEUsTUFBbkM7QUFBQSxLQUE3QixDQUFoQjs7QUFFQSxXQUFPK0ssVUFBVS9LLE1BQVYsR0FBbUIsQ0FBMUIsRUFBNkI7QUFDM0IrSyxnQkFBVXZHLEtBQVY7QUFDQSxVQUFNckUsV0FBVWlCLFNBQVNiLElBQVQsOEJBQWtCcUssR0FBbEIsaUJBQTRCSixPQUE1QixJQUFxQ2pMLFNBQVN3TCxTQUE5Qyx5QkFBOERGLElBQTlELEdBQWhCO0FBQ0EsVUFBSSxDQUFDRyxlQUFlbkksT0FBTzFDLFFBQVAsQ0FBZixFQUFnQ29DLFFBQWhDLENBQUwsRUFBZ0Q7QUFDOUM7QUFDRDtBQUNEaUksY0FBUWpMLE9BQVIsR0FBa0J3TCxTQUFsQjtBQUNEOztBQUVEQSxnQkFBWVAsUUFBUWpMLE9BQXBCOztBQUVBLFFBQUl3TCxVQUFVL0ssTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN4QixVQUFNWCxPQUFPLDZCQUFjLEVBQUVFLFNBQVN3TCxTQUFYLEVBQWQsQ0FBYjtBQUNBLFVBQU1hLGFBQWEvSSxPQUFPekIsU0FBU2IsSUFBVCw4QkFBa0JxSyxHQUFsQixJQUF1QnZMLElBQXZCLEdBQVAsQ0FBbkI7O0FBRndCO0FBSXRCLFlBQU13TSxZQUFZRCxXQUFXeEksQ0FBWCxDQUFsQjtBQUNBLFlBQUliLFNBQVNvQyxJQUFULENBQWMsVUFBQ25DLE9BQUQ7QUFBQSxpQkFBYXFKLFVBQVVuQyxRQUFWLENBQW1CbEgsT0FBbkIsQ0FBYjtBQUFBLFNBQWQsQ0FBSixFQUE2RDtBQUMzRDtBQUNBO0FBQ0EsY0FBTXNKLGNBQWMsNkJBQWMsRUFBRTNGLFNBQVMwRixVQUFVMUYsT0FBckIsRUFBZCxDQUFwQjtBQUNJaEcsb0JBQVVpQixTQUFTYixJQUFULDhCQUFrQnFLLEdBQWxCLElBQXVCLDZCQUFjLEVBQUV6RSxTQUFTMEYsVUFBVTFGLE9BQXJCLEVBQWQsQ0FBdkIsc0JBQXlFMEUsSUFBekUsR0FKNkM7QUFLdkQ3QyxvQkFBVW5GLE9BQU8xQyxPQUFQLENBTDZDOztBQU0zRCxjQUFJNkssZUFBZWhELE9BQWYsRUFBd0J6RixRQUF4QixDQUFKLEVBQXVDO0FBQ3JDaUksc0JBQVVzQixXQUFWO0FBQ0Q7QUFDRDtBQUNEO0FBZnFCOztBQUd4QixXQUFLLElBQUkxSSxJQUFJLENBQWIsRUFBZ0JBLElBQUl3SSxXQUFXNUwsTUFBL0IsRUFBdUNvRCxHQUF2QyxFQUE0QztBQUFBLFlBTXBDakQsT0FOb0M7QUFBQSxZQU9wQzZILE9BUG9DOztBQUFBOztBQUFBLCtCQVd4QztBQUVIO0FBQ0Y7QUFDRjtBQUNELFNBQU93QyxPQUFQO0FBQ0QsQ0FwQ0Q7O0FBc0NBLElBQU11QixhQUFhLENBQ2pCcEIsWUFEaUIsRUFFakJNLGtCQUZpQixFQUdqQkssa0JBSGlCLEVBSWpCQyw0QkFKaUIsRUFLakJDLGlCQUxpQixFQU1qQkcsZUFOaUIsQ0FBbkI7O0FBU0E7Ozs7Ozs7Ozs7O0FBV0EsSUFBTXhCLGVBQWUsU0FBZkEsWUFBZSxDQUFDUyxHQUFELEVBQU1KLE9BQU4sRUFBZUssSUFBZixFQUFxQnRJLFFBQXJCLEVBQStCTSxNQUEvQixFQUF1Q3pCLFFBQXZDO0FBQUEsU0FDbkIySyxXQUFXdEksTUFBWCxDQUFrQixVQUFDdUksR0FBRCxFQUFNQyxTQUFOO0FBQUEsV0FBb0JBLFVBQVVyQixHQUFWLEVBQWVvQixHQUFmLEVBQW9CbkIsSUFBcEIsRUFBMEJ0SSxRQUExQixFQUFvQ00sTUFBcEMsRUFBNEN6QixRQUE1QyxDQUFwQjtBQUFBLEdBQWxCLEVBQTZGb0osT0FBN0YsQ0FEbUI7QUFBQSxDQUFyQjs7QUFHQTs7Ozs7OztBQU9PLElBQU1RLDBDQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ2hELE9BQUQsRUFBVXpGLFFBQVYsRUFBdUI7QUFBQSxNQUMzQ3ZDLE1BRDJDLEdBQ2hDZ0ksT0FEZ0MsQ0FDM0NoSSxNQUQyQzs7QUFFbkQsU0FBT0EsV0FBV3VDLFNBQVN2QyxNQUFwQixJQUE4QnVDLFNBQVNtSSxLQUFULENBQWUsVUFBQ2xJLE9BQUQsRUFBYTtBQUMvRCxTQUFLLElBQUlZLElBQUksQ0FBYixFQUFnQkEsSUFBSXBELE1BQXBCLEVBQTRCb0QsR0FBNUIsRUFBaUM7QUFDL0IsVUFBSTRFLFFBQVE1RSxDQUFSLE1BQWVaLE9BQW5CLEVBQTRCO0FBQzFCLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxXQUFPLEtBQVA7QUFDRCxHQVBvQyxDQUFyQztBQVFELENBVk0sQzs7Ozs7Ozs7Ozs7Ozs7OFFDalRQOzs7Ozs7OztrQkE4SHdCMEosZ0I7O0FBeEh4Qjs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7QUFTQTs7OztBQUlBOzs7Ozs7O0FBT08sSUFBTUMsd0RBQXdCLFNBQXhCQSxxQkFBd0IsQ0FBQzNKLE9BQUQsRUFBMkI7QUFBQSxNQUFqQmYsT0FBaUIsdUVBQVAsRUFBTzs7O0FBRTlELE1BQUllLFFBQVEwRSxRQUFSLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCMUUsY0FBVUEsUUFBUUwsVUFBbEI7QUFDRDs7QUFFRCxNQUFJSyxRQUFRMEUsUUFBUixLQUFxQixDQUF6QixFQUE0QjtBQUMxQixVQUFNLElBQUlnRCxLQUFKLGdHQUFzRzFILE9BQXRHLHlDQUFzR0EsT0FBdEcsVUFBTjtBQUNEOztBQUVELE1BQU1qQyxPQUFPLHFCQUFNaUMsT0FBTixFQUFlZixPQUFmLENBQWI7QUFDQSxNQUFNMkssZ0JBQWdCLHdCQUFTN0wsSUFBVCxFQUFlaUMsT0FBZixFQUF3QmYsT0FBeEIsQ0FBdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFPMkssYUFBUDtBQUNELENBcEJNOztBQXNCUDs7Ozs7OztBQU9PLElBQU1DLHNEQUF1QixTQUF2QkEsb0JBQXVCLENBQUM5SixRQUFELEVBQTRCO0FBQUEsTUFBakJkLE9BQWlCLHVFQUFQLEVBQU87OztBQUU5RCxNQUFJLENBQUMwQixNQUFNeUQsT0FBTixDQUFjckUsUUFBZCxDQUFMLEVBQThCO0FBQzVCQSxlQUFXLGdDQUFnQkEsUUFBaEIsQ0FBWDtBQUNEOztBQUVELE1BQUlBLFNBQVNvQyxJQUFULENBQWMsVUFBQ25DLE9BQUQ7QUFBQSxXQUFhQSxRQUFRMEUsUUFBUixLQUFxQixDQUFsQztBQUFBLEdBQWQsQ0FBSixFQUF3RDtBQUN0RCxVQUFNLElBQUlnRCxLQUFKLENBQVUsd0ZBQVYsQ0FBTjtBQUNEOztBQUVELE1BQU1ySCxTQUFTLHlCQUFVcEIsT0FBVixDQUFmO0FBQ0EsTUFBTUwsV0FBVywwQkFBWUssT0FBWixDQUFqQjs7QUFFQSxNQUFNZ0QsV0FBVywrQkFBa0JsQyxRQUFsQixFQUE0QmQsT0FBNUIsQ0FBakI7QUFDQSxNQUFNNkssZUFBZSxxQkFBTTdILFFBQU4sRUFBZ0JoRCxPQUFoQixDQUFyQjs7QUFFQTtBQUNBLE1BQU04SyxhQUFhQyxjQUFjakssUUFBZCxDQUFuQjtBQUNBLE1BQU1rSyxvQkFBb0JGLFdBQVcsQ0FBWCxDQUExQjs7QUFFQSxNQUFNRyxlQUFlLHFEQUFhSixZQUFiLElBQTJCRyxpQkFBM0IsSUFBK0NsSyxRQUEvQyxFQUF5RGQsT0FBekQsQ0FBckI7QUFDQSxNQUFNa0wsa0JBQWtCLGdDQUFnQjlKLE9BQU96QixTQUFTYixJQUFULENBQWNtTSxZQUFkLENBQVAsQ0FBaEIsQ0FBeEI7O0FBRUEsTUFBSSxDQUFDbkssU0FBU21JLEtBQVQsQ0FBZSxVQUFDbEksT0FBRDtBQUFBLFdBQWFtSyxnQkFBZ0JoSSxJQUFoQixDQUFxQixVQUFDYyxLQUFEO0FBQUEsYUFBV0EsVUFBVWpELE9BQXJCO0FBQUEsS0FBckIsQ0FBYjtBQUFBLEdBQWYsQ0FBTCxFQUF1RjtBQUNyRjtBQUNBLFdBQU8wRyxRQUFRQyxJQUFSLHlJQUdKNUcsUUFISSxDQUFQO0FBSUQ7O0FBRUQsU0FBT21LLFlBQVA7QUFDRCxDQWhDTTs7QUFrQ1A7Ozs7OztBQU1BLElBQU1GLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ2pLLFFBQUQsRUFBYztBQUFBLDZCQUNHLGlDQUFvQkEsUUFBcEIsQ0FESDtBQUFBLE1BQzFCaEQsT0FEMEIsd0JBQzFCQSxPQUQwQjtBQUFBLE1BQ2pCRCxVQURpQix3QkFDakJBLFVBRGlCO0FBQUEsTUFDTGUsR0FESyx3QkFDTEEsR0FESzs7QUFHbEMsU0FBTyxDQUNMLDRCQUFjO0FBQ1pBLFlBRFk7QUFFWmQsYUFBU0EsV0FBVyxFQUZSO0FBR1pELGdCQUFZQSxhQUFhcUcsT0FBT0MsSUFBUCxDQUFZdEcsVUFBWixFQUF3QkssR0FBeEIsQ0FBNEIsVUFBQ0MsSUFBRDtBQUFBLGFBQVc7QUFDOURBLGNBQU0sNEJBQVlBLElBQVosQ0FEd0Q7QUFFOURDLGVBQU8sNEJBQVlQLFdBQVdNLElBQVgsQ0FBWjtBQUZ1RCxPQUFYO0FBQUEsS0FBNUIsQ0FBYixHQUdOO0FBTk0sR0FBZCxDQURLLENBQVA7QUFVRCxDQWJEOztBQWVBOzs7Ozs7Ozs7QUFTZSxTQUFTc00sZ0JBQVQsQ0FBMkJVLEtBQTNCLEVBQWdEO0FBQUEsTUFBZG5MLE9BQWMsdUVBQUosRUFBSTs7QUFDN0QsTUFBTWxCLE9BQVFxTSxNQUFNNU0sTUFBTixJQUFnQixDQUFDNE0sTUFBTWhOLElBQXhCLEdBQ1R5TSxxQkFBcUJPLEtBQXJCLEVBQTRCbkwsT0FBNUIsQ0FEUyxHQUVUMEssc0JBQXNCUyxLQUF0QixFQUE2Qm5MLE9BQTdCLENBRko7O0FBSUEsU0FBTywwQkFBWUEsT0FBWixFQUFxQmxCLElBQXJCLENBQTBCQSxJQUExQixDQUFQO0FBQ0QsQzs7Ozs7Ozs7O0FDcElEOzs7Ozs7Ozs7O0FBVUEsQ0FBRSxVQUFVc00sTUFBVixFQUFtQjtBQUNyQixLQUFJekosQ0FBSjtBQUFBLEtBQ0MwSixPQUREO0FBQUEsS0FFQ0MsSUFGRDtBQUFBLEtBR0NDLE9BSEQ7QUFBQSxLQUlDQyxLQUpEO0FBQUEsS0FLQ0MsUUFMRDtBQUFBLEtBTUNDLE9BTkQ7QUFBQSxLQU9DdEssTUFQRDtBQUFBLEtBUUN1SyxnQkFSRDtBQUFBLEtBU0NDLFNBVEQ7QUFBQSxLQVVDQyxZQVZEOzs7QUFZQztBQUNBQyxZQWJEO0FBQUEsS0FjQ3ZMLFFBZEQ7QUFBQSxLQWVDd0wsT0FmRDtBQUFBLEtBZ0JDQyxjQWhCRDtBQUFBLEtBaUJDQyxTQWpCRDtBQUFBLEtBa0JDQyxhQWxCRDtBQUFBLEtBbUJDM0YsT0FuQkQ7QUFBQSxLQW9CQzBCLFFBcEJEOzs7QUFzQkM7QUFDQWtFLFdBQVUsV0FBVyxJQUFJLElBQUlDLElBQUosRUF2QjFCO0FBQUEsS0F3QkNDLGVBQWVqQixPQUFPN0ssUUF4QnZCO0FBQUEsS0F5QkMrTCxVQUFVLENBekJYO0FBQUEsS0EwQkNDLE9BQU8sQ0ExQlI7QUFBQSxLQTJCQ0MsYUFBYUMsYUEzQmQ7QUFBQSxLQTRCQ0MsYUFBYUQsYUE1QmQ7QUFBQSxLQTZCQ0UsZ0JBQWdCRixhQTdCakI7QUFBQSxLQThCQ0cseUJBQXlCSCxhQTlCMUI7QUFBQSxLQStCQ0ksWUFBWSxtQkFBVW5HLENBQVYsRUFBYW9HLENBQWIsRUFBaUI7QUFDNUIsTUFBS3BHLE1BQU1vRyxDQUFYLEVBQWU7QUFDZGpCLGtCQUFlLElBQWY7QUFDQTtBQUNELFNBQU8sQ0FBUDtBQUNBLEVBcENGOzs7QUFzQ0M7QUFDQWtCLFVBQVcsRUFBRixDQUFPQyxjQXZDakI7QUFBQSxLQXdDQ3ZMLE1BQU0sRUF4Q1A7QUFBQSxLQXlDQ3FILE1BQU1ySCxJQUFJcUgsR0F6Q1g7QUFBQSxLQTBDQ21FLGFBQWF4TCxJQUFJUixJQTFDbEI7QUFBQSxLQTJDQ0EsT0FBT1EsSUFBSVIsSUEzQ1o7QUFBQSxLQTRDQzJILFFBQVFuSCxJQUFJbUgsS0E1Q2I7OztBQThDQztBQUNBO0FBQ0EvRCxXQUFVLFNBQVZBLE9BQVUsQ0FBVXFJLElBQVYsRUFBZ0JDLElBQWhCLEVBQXVCO0FBQ2hDLE1BQUl4TCxJQUFJLENBQVI7QUFBQSxNQUNDeUwsTUFBTUYsS0FBSzNPLE1BRFo7QUFFQSxTQUFRb0QsSUFBSXlMLEdBQVosRUFBaUJ6TCxHQUFqQixFQUF1QjtBQUN0QixPQUFLdUwsS0FBTXZMLENBQU4sTUFBY3dMLElBQW5CLEVBQTBCO0FBQ3pCLFdBQU94TCxDQUFQO0FBQ0E7QUFDRDtBQUNELFNBQU8sQ0FBQyxDQUFSO0FBQ0EsRUF6REY7QUFBQSxLQTJEQzBMLFdBQVcsOEVBQ1YsbURBNURGOzs7QUE4REM7O0FBRUE7QUFDQUMsY0FBYSxxQkFqRWQ7OztBQW1FQztBQUNBQyxjQUFhLDRCQUE0QkQsVUFBNUIsR0FDWix5Q0FyRUY7OztBQXVFQztBQUNBelAsY0FBYSxRQUFReVAsVUFBUixHQUFxQixJQUFyQixHQUE0QkMsVUFBNUIsR0FBeUMsTUFBekMsR0FBa0RELFVBQWxEOztBQUVaO0FBQ0EsZ0JBSFksR0FHTUEsVUFITjs7QUFLWjtBQUNBO0FBQ0EsMkRBUFksR0FPaURDLFVBUGpELEdBTzhELE1BUDlELEdBUVpELFVBUlksR0FRQyxNQWhGZjtBQUFBLEtBa0ZDRSxVQUFVLE9BQU9ELFVBQVAsR0FBb0IsVUFBcEI7O0FBRVQ7QUFDQTtBQUNBLHdEQUpTOztBQU1UO0FBQ0EsMkJBUFMsR0FPb0IxUCxVQVBwQixHQU9pQyxNQVBqQzs7QUFTVDtBQUNBLEtBVlMsR0FXVCxRQTdGRjs7O0FBK0ZDO0FBQ0E0UCxlQUFjLElBQUlsSSxNQUFKLENBQVkrSCxhQUFhLEdBQXpCLEVBQThCLEdBQTlCLENBaEdmO0FBQUEsS0FpR0NJLFFBQVEsSUFBSW5JLE1BQUosQ0FBWSxNQUFNK0gsVUFBTixHQUFtQiw2QkFBbkIsR0FDbkJBLFVBRG1CLEdBQ04sSUFETixFQUNZLEdBRFosQ0FqR1Q7QUFBQSxLQW9HQ0ssU0FBUyxJQUFJcEksTUFBSixDQUFZLE1BQU0rSCxVQUFOLEdBQW1CLElBQW5CLEdBQTBCQSxVQUExQixHQUF1QyxHQUFuRCxDQXBHVjtBQUFBLEtBcUdDTSxlQUFlLElBQUlySSxNQUFKLENBQVksTUFBTStILFVBQU4sR0FBbUIsVUFBbkIsR0FBZ0NBLFVBQWhDLEdBQTZDLEdBQTdDLEdBQW1EQSxVQUFuRCxHQUMxQixHQURjLENBckdoQjtBQUFBLEtBdUdDTyxXQUFXLElBQUl0SSxNQUFKLENBQVkrSCxhQUFhLElBQXpCLENBdkdaO0FBQUEsS0F5R0NRLFVBQVUsSUFBSXZJLE1BQUosQ0FBWWlJLE9BQVosQ0F6R1g7QUFBQSxLQTBHQ08sY0FBYyxJQUFJeEksTUFBSixDQUFZLE1BQU1nSSxVQUFOLEdBQW1CLEdBQS9CLENBMUdmO0FBQUEsS0E0R0NTLFlBQVk7QUFDWCxRQUFNLElBQUl6SSxNQUFKLENBQVksUUFBUWdJLFVBQVIsR0FBcUIsR0FBakMsQ0FESztBQUVYLFdBQVMsSUFBSWhJLE1BQUosQ0FBWSxVQUFVZ0ksVUFBVixHQUF1QixHQUFuQyxDQUZFO0FBR1gsU0FBTyxJQUFJaEksTUFBSixDQUFZLE9BQU9nSSxVQUFQLEdBQW9CLE9BQWhDLENBSEk7QUFJWCxVQUFRLElBQUloSSxNQUFKLENBQVksTUFBTTFILFVBQWxCLENBSkc7QUFLWCxZQUFVLElBQUkwSCxNQUFKLENBQVksTUFBTWlJLE9BQWxCLENBTEM7QUFNWCxXQUFTLElBQUlqSSxNQUFKLENBQVksMkRBQ3BCK0gsVUFEb0IsR0FDUCw4QkFETyxHQUMwQkEsVUFEMUIsR0FDdUMsYUFEdkMsR0FFcEJBLFVBRm9CLEdBRVAsWUFGTyxHQUVRQSxVQUZSLEdBRXFCLFFBRmpDLEVBRTJDLEdBRjNDLENBTkU7QUFTWCxVQUFRLElBQUkvSCxNQUFKLENBQVksU0FBUzhILFFBQVQsR0FBb0IsSUFBaEMsRUFBc0MsR0FBdEMsQ0FURzs7QUFXWDtBQUNBO0FBQ0Esa0JBQWdCLElBQUk5SCxNQUFKLENBQVksTUFBTStILFVBQU4sR0FDM0Isa0RBRDJCLEdBQzBCQSxVQUQxQixHQUUzQixrQkFGMkIsR0FFTkEsVUFGTSxHQUVPLGtCQUZuQixFQUV1QyxHQUZ2QztBQWJMLEVBNUdiO0FBQUEsS0E4SENXLFFBQVEsUUE5SFQ7QUFBQSxLQStIQ0MsVUFBVSxxQ0EvSFg7QUFBQSxLQWdJQ0MsVUFBVSxRQWhJWDtBQUFBLEtBa0lDQyxVQUFVLHdCQWxJWDs7O0FBb0lDO0FBQ0FDLGNBQWEsa0NBcklkO0FBQUEsS0F1SUNDLFdBQVcsTUF2SVo7OztBQXlJQztBQUNBO0FBQ0FDLGFBQVksSUFBSWhKLE1BQUosQ0FBWSx5QkFBeUIrSCxVQUF6QixHQUFzQyxzQkFBbEQsRUFBMEUsR0FBMUUsQ0EzSWI7QUFBQSxLQTRJQ2tCLFlBQVksU0FBWkEsU0FBWSxDQUFVQyxNQUFWLEVBQWtCQyxNQUFsQixFQUEyQjtBQUN0QyxNQUFJQyxPQUFPLE9BQU9GLE9BQU83RixLQUFQLENBQWMsQ0FBZCxDQUFQLEdBQTJCLE9BQXRDOztBQUVBLFNBQU84Rjs7QUFFTjtBQUNBQSxRQUhNOztBQUtOO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLFNBQU8sQ0FBUCxHQUNDQyxPQUFPQyxZQUFQLENBQXFCRixPQUFPLE9BQTVCLENBREQsR0FFQ0MsT0FBT0MsWUFBUCxDQUFxQkYsUUFBUSxFQUFSLEdBQWEsTUFBbEMsRUFBMENBLE9BQU8sS0FBUCxHQUFlLE1BQXpELENBWEY7QUFZQSxFQTNKRjs7O0FBNkpDO0FBQ0E7QUFDQUcsY0FBYSxxREEvSmQ7QUFBQSxLQWdLQ0MsYUFBYSxTQUFiQSxVQUFhLENBQVVDLEVBQVYsRUFBY0MsV0FBZCxFQUE0QjtBQUN4QyxNQUFLQSxXQUFMLEVBQW1COztBQUVsQjtBQUNBLE9BQUtELE9BQU8sSUFBWixFQUFtQjtBQUNsQixXQUFPLFFBQVA7QUFDQTs7QUFFRDtBQUNBLFVBQU9BLEdBQUdwRyxLQUFILENBQVUsQ0FBVixFQUFhLENBQUMsQ0FBZCxJQUFvQixJQUFwQixHQUNOb0csR0FBR0UsVUFBSCxDQUFlRixHQUFHelEsTUFBSCxHQUFZLENBQTNCLEVBQStCb0IsUUFBL0IsQ0FBeUMsRUFBekMsQ0FETSxHQUMwQyxHQURqRDtBQUVBOztBQUVEO0FBQ0EsU0FBTyxPQUFPcVAsRUFBZDtBQUNBLEVBL0tGOzs7QUFpTEM7QUFDQTtBQUNBO0FBQ0E7QUFDQUcsaUJBQWdCLFNBQWhCQSxhQUFnQixHQUFXO0FBQzFCckQ7QUFDQSxFQXZMRjtBQUFBLEtBeUxDc0QscUJBQXFCQyxjQUNwQixVQUFVbEMsSUFBVixFQUFpQjtBQUNoQixTQUFPQSxLQUFLbUMsUUFBTCxLQUFrQixJQUFsQixJQUEwQm5DLEtBQUtvQyxRQUFMLENBQWM1SyxXQUFkLE9BQWdDLFVBQWpFO0FBQ0EsRUFIbUIsRUFJcEIsRUFBRTZLLEtBQUssWUFBUCxFQUFxQjNNLE1BQU0sUUFBM0IsRUFKb0IsQ0F6THRCOztBQWdNQTtBQUNBLEtBQUk7QUFDSDVCLE9BQUt3TyxLQUFMLENBQ0doTyxNQUFNbUgsTUFBTThHLElBQU4sQ0FBWXJELGFBQWFzRCxVQUF6QixDQURULEVBRUN0RCxhQUFhc0QsVUFGZDs7QUFLQTtBQUNBO0FBQ0E7QUFDQWxPLE1BQUs0SyxhQUFhc0QsVUFBYixDQUF3QnBSLE1BQTdCLEVBQXNDa0gsUUFBdEM7QUFDQSxFQVZELENBVUUsT0FBUW1LLENBQVIsRUFBWTtBQUNiM08sU0FBTyxFQUFFd08sT0FBT2hPLElBQUlsRCxNQUFKOztBQUVmO0FBQ0EsYUFBVXNSLE1BQVYsRUFBa0JDLEdBQWxCLEVBQXdCO0FBQ3ZCN0MsZUFBV3dDLEtBQVgsQ0FBa0JJLE1BQWxCLEVBQTBCakgsTUFBTThHLElBQU4sQ0FBWUksR0FBWixDQUExQjtBQUNBLElBTGM7O0FBT2Y7QUFDQTtBQUNBLGFBQVVELE1BQVYsRUFBa0JDLEdBQWxCLEVBQXdCO0FBQ3ZCLFFBQUlDLElBQUlGLE9BQU90UixNQUFmO0FBQUEsUUFDQ29ELElBQUksQ0FETDs7QUFHQTtBQUNBLFdBQVVrTyxPQUFRRSxHQUFSLElBQWdCRCxJQUFLbk8sR0FBTCxDQUExQixFQUF5QyxDQUFFO0FBQzNDa08sV0FBT3RSLE1BQVAsR0FBZ0J3UixJQUFJLENBQXBCO0FBQ0E7QUFoQkssR0FBUDtBQWtCQTs7QUFFRCxVQUFTN1AsTUFBVCxDQUFpQkUsUUFBakIsRUFBMkI0UCxPQUEzQixFQUFvQ0MsT0FBcEMsRUFBNkNDLElBQTdDLEVBQW9EO0FBQ25ELE1BQUlDLENBQUo7QUFBQSxNQUFPeE8sQ0FBUDtBQUFBLE1BQVV3TCxJQUFWO0FBQUEsTUFBZ0JpRCxHQUFoQjtBQUFBLE1BQXFCL1EsS0FBckI7QUFBQSxNQUE0QmdSLE1BQTVCO0FBQUEsTUFBb0NDLFdBQXBDO0FBQUEsTUFDQ0MsYUFBYVAsV0FBV0EsUUFBUVEsYUFEakM7OztBQUdDO0FBQ0EvSyxhQUFXdUssVUFBVUEsUUFBUXZLLFFBQWxCLEdBQTZCLENBSnpDOztBQU1Bd0ssWUFBVUEsV0FBVyxFQUFyQjs7QUFFQTtBQUNBLE1BQUssT0FBTzdQLFFBQVAsS0FBb0IsUUFBcEIsSUFBZ0MsQ0FBQ0EsUUFBakMsSUFDSnFGLGFBQWEsQ0FBYixJQUFrQkEsYUFBYSxDQUEvQixJQUFvQ0EsYUFBYSxFQURsRCxFQUN1RDs7QUFFdEQsVUFBT3dLLE9BQVA7QUFDQTs7QUFFRDtBQUNBLE1BQUssQ0FBQ0MsSUFBTixFQUFhO0FBQ1pwRSxlQUFha0UsT0FBYjtBQUNBQSxhQUFVQSxXQUFXelAsUUFBckI7O0FBRUEsT0FBS3lMLGNBQUwsRUFBc0I7O0FBRXJCO0FBQ0E7QUFDQSxRQUFLdkcsYUFBYSxFQUFiLEtBQXFCcEcsUUFBUWdQLFdBQVdvQyxJQUFYLENBQWlCclEsUUFBakIsQ0FBN0IsQ0FBTCxFQUFrRTs7QUFFakU7QUFDQSxTQUFPK1AsSUFBSTlRLE1BQU8sQ0FBUCxDQUFYLEVBQTBCOztBQUV6QjtBQUNBLFVBQUtvRyxhQUFhLENBQWxCLEVBQXNCO0FBQ3JCLFdBQU8wSCxPQUFPNkMsUUFBUVUsY0FBUixDQUF3QlAsQ0FBeEIsQ0FBZCxFQUE4Qzs7QUFFN0M7QUFDQTtBQUNBO0FBQ0EsWUFBS2hELEtBQUt3RCxFQUFMLEtBQVlSLENBQWpCLEVBQXFCO0FBQ3BCRixpQkFBUWhQLElBQVIsQ0FBY2tNLElBQWQ7QUFDQSxnQkFBTzhDLE9BQVA7QUFDQTtBQUNELFFBVEQsTUFTTztBQUNOLGVBQU9BLE9BQVA7QUFDQTs7QUFFRjtBQUNDLE9BZkQsTUFlTzs7QUFFTjtBQUNBO0FBQ0E7QUFDQSxXQUFLTSxlQUFnQnBELE9BQU9vRCxXQUFXRyxjQUFYLENBQTJCUCxDQUEzQixDQUF2QixLQUNKbEksU0FBVStILE9BQVYsRUFBbUI3QyxJQUFuQixDQURJLElBRUpBLEtBQUt3RCxFQUFMLEtBQVlSLENBRmIsRUFFaUI7O0FBRWhCRixnQkFBUWhQLElBQVIsQ0FBY2tNLElBQWQ7QUFDQSxlQUFPOEMsT0FBUDtBQUNBO0FBQ0Q7O0FBRUY7QUFDQyxNQWpDRCxNQWlDTyxJQUFLNVEsTUFBTyxDQUFQLENBQUwsRUFBa0I7QUFDeEI0QixXQUFLd08sS0FBTCxDQUFZUSxPQUFaLEVBQXFCRCxRQUFRWSxvQkFBUixDQUE4QnhRLFFBQTlCLENBQXJCO0FBQ0EsYUFBTzZQLE9BQVA7O0FBRUQ7QUFDQyxNQUxNLE1BS0EsSUFBSyxDQUFFRSxJQUFJOVEsTUFBTyxDQUFQLENBQU4sS0FBc0JnTSxRQUFRd0Ysc0JBQTlCLElBQ1hiLFFBQVFhLHNCQURGLEVBQzJCOztBQUVqQzVQLFdBQUt3TyxLQUFMLENBQVlRLE9BQVosRUFBcUJELFFBQVFhLHNCQUFSLENBQWdDVixDQUFoQyxDQUFyQjtBQUNBLGFBQU9GLE9BQVA7QUFDQTtBQUNEOztBQUVEO0FBQ0EsUUFBSzVFLFFBQVF5RixHQUFSLElBQ0osQ0FBQ2xFLHVCQUF3QnhNLFdBQVcsR0FBbkMsQ0FERyxLQUVGLENBQUM2TCxTQUFELElBQWMsQ0FBQ0EsVUFBVXpHLElBQVYsQ0FBZ0JwRixRQUFoQixDQUZiOztBQUlKO0FBQ0E7QUFDRXFGLGlCQUFhLENBQWIsSUFBa0J1SyxRQUFRVCxRQUFSLENBQWlCNUssV0FBakIsT0FBbUMsUUFObkQsQ0FBTCxFQU1xRTs7QUFFcEUyTCxtQkFBY2xRLFFBQWQ7QUFDQW1RLGtCQUFhUCxPQUFiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBS3ZLLGFBQWEsQ0FBYixLQUNGb0ksU0FBU3JJLElBQVQsQ0FBZXBGLFFBQWYsS0FBNkJ3TixhQUFhcEksSUFBYixDQUFtQnBGLFFBQW5CLENBRDNCLENBQUwsRUFDa0U7O0FBRWpFO0FBQ0FtUSxtQkFBYWpDLFNBQVM5SSxJQUFULENBQWVwRixRQUFmLEtBQTZCMlEsWUFBYWYsUUFBUXRQLFVBQXJCLENBQTdCLElBQ1pzUCxPQUREOztBQUdBO0FBQ0E7QUFDQSxVQUFLTyxlQUFlUCxPQUFmLElBQTBCLENBQUMzRSxRQUFRMkYsS0FBeEMsRUFBZ0Q7O0FBRS9DO0FBQ0EsV0FBT1osTUFBTUosUUFBUXBNLFlBQVIsQ0FBc0IsSUFBdEIsQ0FBYixFQUE4QztBQUM3Q3dNLGNBQU1BLElBQUlwUixPQUFKLENBQWE4UCxVQUFiLEVBQXlCQyxVQUF6QixDQUFOO0FBQ0EsUUFGRCxNQUVPO0FBQ05pQixnQkFBUWlCLFlBQVIsQ0FBc0IsSUFBdEIsRUFBOEJiLE1BQU1qRSxPQUFwQztBQUNBO0FBQ0Q7O0FBRUQ7QUFDQWtFLGVBQVM1RSxTQUFVckwsUUFBVixDQUFUO0FBQ0F1QixVQUFJME8sT0FBTzlSLE1BQVg7QUFDQSxhQUFRb0QsR0FBUixFQUFjO0FBQ2IwTyxjQUFRMU8sQ0FBUixJQUFjLENBQUV5TyxNQUFNLE1BQU1BLEdBQVosR0FBa0IsUUFBcEIsSUFBaUMsR0FBakMsR0FDYmMsV0FBWWIsT0FBUTFPLENBQVIsQ0FBWixDQUREO0FBRUE7QUFDRDJPLG9CQUFjRCxPQUFPaFMsSUFBUCxDQUFhLEdBQWIsQ0FBZDtBQUNBOztBQUVELFNBQUk7QUFDSDRDLFdBQUt3TyxLQUFMLENBQVlRLE9BQVosRUFDQ00sV0FBV3BQLGdCQUFYLENBQTZCbVAsV0FBN0IsQ0FERDtBQUdBLGFBQU9MLE9BQVA7QUFDQSxNQUxELENBS0UsT0FBUWtCLFFBQVIsRUFBbUI7QUFDcEJ2RSw2QkFBd0J4TSxRQUF4QixFQUFrQyxJQUFsQztBQUNBLE1BUEQsU0FPVTtBQUNULFVBQUtnUSxRQUFRakUsT0FBYixFQUF1QjtBQUN0QjZELGVBQVFvQixlQUFSLENBQXlCLElBQXpCO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBLFNBQU9oUSxPQUFRaEIsU0FBU3BCLE9BQVQsQ0FBa0IwTyxLQUFsQixFQUF5QixJQUF6QixDQUFSLEVBQXlDc0MsT0FBekMsRUFBa0RDLE9BQWxELEVBQTJEQyxJQUEzRCxDQUFQO0FBQ0E7O0FBRUQ7Ozs7OztBQU1BLFVBQVN6RCxXQUFULEdBQXVCO0FBQ3RCLE1BQUl0SSxPQUFPLEVBQVg7O0FBRUEsV0FBU2tOLEtBQVQsQ0FBZ0JqTixHQUFoQixFQUFxQmhHLEtBQXJCLEVBQTZCOztBQUU1QjtBQUNBLE9BQUsrRixLQUFLbEQsSUFBTCxDQUFXbUQsTUFBTSxHQUFqQixJQUF5QmtILEtBQUtnRyxXQUFuQyxFQUFpRDs7QUFFaEQ7QUFDQSxXQUFPRCxNQUFPbE4sS0FBS3BCLEtBQUwsRUFBUCxDQUFQO0FBQ0E7QUFDRCxVQUFTc08sTUFBT2pOLE1BQU0sR0FBYixJQUFxQmhHLEtBQTlCO0FBQ0E7QUFDRCxTQUFPaVQsS0FBUDtBQUNBOztBQUVEOzs7O0FBSUEsVUFBU0UsWUFBVCxDQUF1QkMsRUFBdkIsRUFBNEI7QUFDM0JBLEtBQUlyRixPQUFKLElBQWdCLElBQWhCO0FBQ0EsU0FBT3FGLEVBQVA7QUFDQTs7QUFFRDs7OztBQUlBLFVBQVNDLE1BQVQsQ0FBaUJELEVBQWpCLEVBQXNCO0FBQ3JCLE1BQUlFLEtBQUtuUixTQUFTb1IsYUFBVCxDQUF3QixVQUF4QixDQUFUOztBQUVBLE1BQUk7QUFDSCxVQUFPLENBQUMsQ0FBQ0gsR0FBSUUsRUFBSixDQUFUO0FBQ0EsR0FGRCxDQUVFLE9BQVE5QixDQUFSLEVBQVk7QUFDYixVQUFPLEtBQVA7QUFDQSxHQUpELFNBSVU7O0FBRVQ7QUFDQSxPQUFLOEIsR0FBR2hSLFVBQVIsRUFBcUI7QUFDcEJnUixPQUFHaFIsVUFBSCxDQUFja1IsV0FBZCxDQUEyQkYsRUFBM0I7QUFDQTs7QUFFRDtBQUNBQSxRQUFLLElBQUw7QUFDQTtBQUNEOztBQUVEOzs7OztBQUtBLFVBQVNHLFNBQVQsQ0FBb0JDLEtBQXBCLEVBQTJCQyxPQUEzQixFQUFxQztBQUNwQyxNQUFJdFEsTUFBTXFRLE1BQU1oTyxLQUFOLENBQWEsR0FBYixDQUFWO0FBQUEsTUFDQ25DLElBQUlGLElBQUlsRCxNQURUOztBQUdBLFNBQVFvRCxHQUFSLEVBQWM7QUFDYjJKLFFBQUswRyxVQUFMLENBQWlCdlEsSUFBS0UsQ0FBTCxDQUFqQixJQUE4Qm9RLE9BQTlCO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7O0FBTUEsVUFBU0UsWUFBVCxDQUF1QnZMLENBQXZCLEVBQTBCb0csQ0FBMUIsRUFBOEI7QUFDN0IsTUFBSW9GLE1BQU1wRixLQUFLcEcsQ0FBZjtBQUFBLE1BQ0N5TCxPQUFPRCxPQUFPeEwsRUFBRWpCLFFBQUYsS0FBZSxDQUF0QixJQUEyQnFILEVBQUVySCxRQUFGLEtBQWUsQ0FBMUMsSUFDTmlCLEVBQUUwTCxXQUFGLEdBQWdCdEYsRUFBRXNGLFdBRnBCOztBQUlBO0FBQ0EsTUFBS0QsSUFBTCxFQUFZO0FBQ1gsVUFBT0EsSUFBUDtBQUNBOztBQUVEO0FBQ0EsTUFBS0QsR0FBTCxFQUFXO0FBQ1YsVUFBVUEsTUFBTUEsSUFBSUcsV0FBcEIsRUFBb0M7QUFDbkMsUUFBS0gsUUFBUXBGLENBQWIsRUFBaUI7QUFDaEIsWUFBTyxDQUFDLENBQVI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQsU0FBT3BHLElBQUksQ0FBSixHQUFRLENBQUMsQ0FBaEI7QUFDQTs7QUFFRDs7OztBQUlBLFVBQVM0TCxpQkFBVCxDQUE0QmhOLElBQTVCLEVBQW1DO0FBQ2xDLFNBQU8sVUFBVTZILElBQVYsRUFBaUI7QUFDdkIsT0FBSWhQLE9BQU9nUCxLQUFLb0MsUUFBTCxDQUFjNUssV0FBZCxFQUFYO0FBQ0EsVUFBT3hHLFNBQVMsT0FBVCxJQUFvQmdQLEtBQUs3SCxJQUFMLEtBQWNBLElBQXpDO0FBQ0EsR0FIRDtBQUlBOztBQUVEOzs7O0FBSUEsVUFBU2lOLGtCQUFULENBQTZCak4sSUFBN0IsRUFBb0M7QUFDbkMsU0FBTyxVQUFVNkgsSUFBVixFQUFpQjtBQUN2QixPQUFJaFAsT0FBT2dQLEtBQUtvQyxRQUFMLENBQWM1SyxXQUFkLEVBQVg7QUFDQSxVQUFPLENBQUV4RyxTQUFTLE9BQVQsSUFBb0JBLFNBQVMsUUFBL0IsS0FBNkNnUCxLQUFLN0gsSUFBTCxLQUFjQSxJQUFsRTtBQUNBLEdBSEQ7QUFJQTs7QUFFRDs7OztBQUlBLFVBQVNrTixvQkFBVCxDQUErQmxELFFBQS9CLEVBQTBDOztBQUV6QztBQUNBLFNBQU8sVUFBVW5DLElBQVYsRUFBaUI7O0FBRXZCO0FBQ0E7QUFDQTtBQUNBLE9BQUssVUFBVUEsSUFBZixFQUFzQjs7QUFFckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFLQSxLQUFLek0sVUFBTCxJQUFtQnlNLEtBQUttQyxRQUFMLEtBQWtCLEtBQTFDLEVBQWtEOztBQUVqRDtBQUNBLFNBQUssV0FBV25DLElBQWhCLEVBQXVCO0FBQ3RCLFVBQUssV0FBV0EsS0FBS3pNLFVBQXJCLEVBQWtDO0FBQ2pDLGNBQU95TSxLQUFLek0sVUFBTCxDQUFnQjRPLFFBQWhCLEtBQTZCQSxRQUFwQztBQUNBLE9BRkQsTUFFTztBQUNOLGNBQU9uQyxLQUFLbUMsUUFBTCxLQUFrQkEsUUFBekI7QUFDQTtBQUNEOztBQUVEO0FBQ0E7QUFDQSxZQUFPbkMsS0FBS3NGLFVBQUwsS0FBb0JuRCxRQUFwQjs7QUFFTjtBQUNBO0FBQ0FuQyxVQUFLc0YsVUFBTCxLQUFvQixDQUFDbkQsUUFBckIsSUFDQUYsbUJBQW9CakMsSUFBcEIsTUFBK0JtQyxRQUxoQztBQU1BOztBQUVELFdBQU9uQyxLQUFLbUMsUUFBTCxLQUFrQkEsUUFBekI7O0FBRUQ7QUFDQTtBQUNBO0FBQ0MsSUFuQ0QsTUFtQ08sSUFBSyxXQUFXbkMsSUFBaEIsRUFBdUI7QUFDN0IsV0FBT0EsS0FBS21DLFFBQUwsS0FBa0JBLFFBQXpCO0FBQ0E7O0FBRUQ7QUFDQSxVQUFPLEtBQVA7QUFDQSxHQTlDRDtBQStDQTs7QUFFRDs7OztBQUlBLFVBQVNvRCxzQkFBVCxDQUFpQ2xCLEVBQWpDLEVBQXNDO0FBQ3JDLFNBQU9ELGFBQWMsVUFBVW9CLFFBQVYsRUFBcUI7QUFDekNBLGNBQVcsQ0FBQ0EsUUFBWjtBQUNBLFVBQU9wQixhQUFjLFVBQVVyQixJQUFWLEVBQWdCM0osT0FBaEIsRUFBMEI7QUFDOUMsUUFBSXdKLENBQUo7QUFBQSxRQUNDNkMsZUFBZXBCLEdBQUksRUFBSixFQUFRdEIsS0FBSzNSLE1BQWIsRUFBcUJvVSxRQUFyQixDQURoQjtBQUFBLFFBRUNoUixJQUFJaVIsYUFBYXJVLE1BRmxCOztBQUlBO0FBQ0EsV0FBUW9ELEdBQVIsRUFBYztBQUNiLFNBQUt1TyxLQUFRSCxJQUFJNkMsYUFBY2pSLENBQWQsQ0FBWixDQUFMLEVBQXlDO0FBQ3hDdU8sV0FBTUgsQ0FBTixJQUFZLEVBQUd4SixRQUFTd0osQ0FBVCxJQUFlRyxLQUFNSCxDQUFOLENBQWxCLENBQVo7QUFDQTtBQUNEO0FBQ0QsSUFYTSxDQUFQO0FBWUEsR0FkTSxDQUFQO0FBZUE7O0FBRUQ7Ozs7O0FBS0EsVUFBU2dCLFdBQVQsQ0FBc0JmLE9BQXRCLEVBQWdDO0FBQy9CLFNBQU9BLFdBQVcsT0FBT0EsUUFBUVksb0JBQWYsS0FBd0MsV0FBbkQsSUFBa0VaLE9BQXpFO0FBQ0E7O0FBRUQ7QUFDQTNFLFdBQVVuTCxPQUFPbUwsT0FBUCxHQUFpQixFQUEzQjs7QUFFQTs7Ozs7QUFLQUcsU0FBUXRMLE9BQU9zTCxLQUFQLEdBQWUsVUFBVTJCLElBQVYsRUFBaUI7QUFDdkMsTUFBSTBGLFlBQVkxRixRQUFRQSxLQUFLMkYsWUFBN0I7QUFBQSxNQUNDL0csVUFBVW9CLFFBQVEsQ0FBRUEsS0FBS3FELGFBQUwsSUFBc0JyRCxJQUF4QixFQUErQjRGLGVBRGxEOztBQUdBO0FBQ0E7QUFDQTtBQUNBLFNBQU8sQ0FBQzlFLE1BQU16SSxJQUFOLENBQVlxTixhQUFhOUcsV0FBV0EsUUFBUXdELFFBQWhDLElBQTRDLE1BQXhELENBQVI7QUFDQSxFQVJEOztBQVVBOzs7OztBQUtBekQsZUFBYzVMLE9BQU80TCxXQUFQLEdBQXFCLFVBQVVoSCxJQUFWLEVBQWlCO0FBQ25ELE1BQUlrTyxVQUFKO0FBQUEsTUFBZ0JDLFNBQWhCO0FBQUEsTUFDQ3hTLE1BQU1xRSxPQUFPQSxLQUFLMEwsYUFBTCxJQUFzQjFMLElBQTdCLEdBQW9DdUgsWUFEM0M7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs1TCxPQUFPRixRQUFQLElBQW1CRSxJQUFJZ0YsUUFBSixLQUFpQixDQUFwQyxJQUF5QyxDQUFDaEYsSUFBSXNTLGVBQW5ELEVBQXFFO0FBQ3BFLFVBQU94UyxRQUFQO0FBQ0E7O0FBRUQ7QUFDQUEsYUFBV0UsR0FBWDtBQUNBc0wsWUFBVXhMLFNBQVN3UyxlQUFuQjtBQUNBL0csbUJBQWlCLENBQUNSLE1BQU9qTCxRQUFQLENBQWxCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs4TCxnQkFBZ0I5TCxRQUFoQixLQUNGMFMsWUFBWTFTLFNBQVMyUyxXQURuQixLQUNvQ0QsVUFBVUUsR0FBVixLQUFrQkYsU0FEM0QsRUFDdUU7O0FBRXRFO0FBQ0EsT0FBS0EsVUFBVUcsZ0JBQWYsRUFBa0M7QUFDakNILGNBQVVHLGdCQUFWLENBQTRCLFFBQTVCLEVBQXNDakUsYUFBdEMsRUFBcUQsS0FBckQ7O0FBRUQ7QUFDQyxJQUpELE1BSU8sSUFBSzhELFVBQVVJLFdBQWYsRUFBNkI7QUFDbkNKLGNBQVVJLFdBQVYsQ0FBdUIsVUFBdkIsRUFBbUNsRSxhQUFuQztBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOUQsVUFBUTJGLEtBQVIsR0FBZ0JTLE9BQVEsVUFBVUMsRUFBVixFQUFlO0FBQ3RDM0YsV0FBUXVILFdBQVIsQ0FBcUI1QixFQUFyQixFQUEwQjRCLFdBQTFCLENBQXVDL1MsU0FBU29SLGFBQVQsQ0FBd0IsS0FBeEIsQ0FBdkM7QUFDQSxVQUFPLE9BQU9ELEdBQUd2USxnQkFBVixLQUErQixXQUEvQixJQUNOLENBQUN1USxHQUFHdlEsZ0JBQUgsQ0FBcUIscUJBQXJCLEVBQTZDNUMsTUFEL0M7QUFFQSxHQUplLENBQWhCOztBQU1BOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQThNLFVBQVF4TixVQUFSLEdBQXFCNFQsT0FBUSxVQUFVQyxFQUFWLEVBQWU7QUFDM0NBLE1BQUdySyxTQUFILEdBQWUsR0FBZjtBQUNBLFVBQU8sQ0FBQ3FLLEdBQUc5TixZQUFILENBQWlCLFdBQWpCLENBQVI7QUFDQSxHQUhvQixDQUFyQjs7QUFLQTs7O0FBR0E7QUFDQXlILFVBQVF1RixvQkFBUixHQUErQmEsT0FBUSxVQUFVQyxFQUFWLEVBQWU7QUFDckRBLE1BQUc0QixXQUFILENBQWdCL1MsU0FBU2dULGFBQVQsQ0FBd0IsRUFBeEIsQ0FBaEI7QUFDQSxVQUFPLENBQUM3QixHQUFHZCxvQkFBSCxDQUF5QixHQUF6QixFQUErQnJTLE1BQXZDO0FBQ0EsR0FIOEIsQ0FBL0I7O0FBS0E7QUFDQThNLFVBQVF3RixzQkFBUixHQUFpQ3pDLFFBQVE1SSxJQUFSLENBQWNqRixTQUFTc1Esc0JBQXZCLENBQWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0F4RixVQUFRbUksT0FBUixHQUFrQi9CLE9BQVEsVUFBVUMsRUFBVixFQUFlO0FBQ3hDM0YsV0FBUXVILFdBQVIsQ0FBcUI1QixFQUFyQixFQUEwQmYsRUFBMUIsR0FBK0J4RSxPQUEvQjtBQUNBLFVBQU8sQ0FBQzVMLFNBQVNrVCxpQkFBVixJQUErQixDQUFDbFQsU0FBU2tULGlCQUFULENBQTRCdEgsT0FBNUIsRUFBc0M1TixNQUE3RTtBQUNBLEdBSGlCLENBQWxCOztBQUtBO0FBQ0EsTUFBSzhNLFFBQVFtSSxPQUFiLEVBQXVCO0FBQ3RCbEksUUFBS3ZILE1BQUwsQ0FBYSxJQUFiLElBQXNCLFVBQVU0TSxFQUFWLEVBQWU7QUFDcEMsUUFBSStDLFNBQVMvQyxHQUFHM1IsT0FBSCxDQUFZdVAsU0FBWixFQUF1QkMsU0FBdkIsQ0FBYjtBQUNBLFdBQU8sVUFBVXJCLElBQVYsRUFBaUI7QUFDdkIsWUFBT0EsS0FBS3ZKLFlBQUwsQ0FBbUIsSUFBbkIsTUFBOEI4UCxNQUFyQztBQUNBLEtBRkQ7QUFHQSxJQUxEO0FBTUFwSSxRQUFLcUksSUFBTCxDQUFXLElBQVgsSUFBb0IsVUFBVWhELEVBQVYsRUFBY1gsT0FBZCxFQUF3QjtBQUMzQyxRQUFLLE9BQU9BLFFBQVFVLGNBQWYsS0FBa0MsV0FBbEMsSUFBaUQxRSxjQUF0RCxFQUF1RTtBQUN0RSxTQUFJbUIsT0FBTzZDLFFBQVFVLGNBQVIsQ0FBd0JDLEVBQXhCLENBQVg7QUFDQSxZQUFPeEQsT0FBTyxDQUFFQSxJQUFGLENBQVAsR0FBa0IsRUFBekI7QUFDQTtBQUNELElBTEQ7QUFNQSxHQWJELE1BYU87QUFDTjdCLFFBQUt2SCxNQUFMLENBQWEsSUFBYixJQUF1QixVQUFVNE0sRUFBVixFQUFlO0FBQ3JDLFFBQUkrQyxTQUFTL0MsR0FBRzNSLE9BQUgsQ0FBWXVQLFNBQVosRUFBdUJDLFNBQXZCLENBQWI7QUFDQSxXQUFPLFVBQVVyQixJQUFWLEVBQWlCO0FBQ3ZCLFNBQUlySSxPQUFPLE9BQU9xSSxLQUFLeUcsZ0JBQVosS0FBaUMsV0FBakMsSUFDVnpHLEtBQUt5RyxnQkFBTCxDQUF1QixJQUF2QixDQUREO0FBRUEsWUFBTzlPLFFBQVFBLEtBQUsxRyxLQUFMLEtBQWVzVixNQUE5QjtBQUNBLEtBSkQ7QUFLQSxJQVBEOztBQVNBO0FBQ0E7QUFDQXBJLFFBQUtxSSxJQUFMLENBQVcsSUFBWCxJQUFvQixVQUFVaEQsRUFBVixFQUFjWCxPQUFkLEVBQXdCO0FBQzNDLFFBQUssT0FBT0EsUUFBUVUsY0FBZixLQUFrQyxXQUFsQyxJQUFpRDFFLGNBQXRELEVBQXVFO0FBQ3RFLFNBQUlsSCxJQUFKO0FBQUEsU0FBVW5ELENBQVY7QUFBQSxTQUFha1MsS0FBYjtBQUFBLFNBQ0MxRyxPQUFPNkMsUUFBUVUsY0FBUixDQUF3QkMsRUFBeEIsQ0FEUjs7QUFHQSxTQUFLeEQsSUFBTCxFQUFZOztBQUVYO0FBQ0FySSxhQUFPcUksS0FBS3lHLGdCQUFMLENBQXVCLElBQXZCLENBQVA7QUFDQSxVQUFLOU8sUUFBUUEsS0FBSzFHLEtBQUwsS0FBZXVTLEVBQTVCLEVBQWlDO0FBQ2hDLGNBQU8sQ0FBRXhELElBQUYsQ0FBUDtBQUNBOztBQUVEO0FBQ0EwRyxjQUFRN0QsUUFBUXlELGlCQUFSLENBQTJCOUMsRUFBM0IsQ0FBUjtBQUNBaFAsVUFBSSxDQUFKO0FBQ0EsYUFBVXdMLE9BQU8wRyxNQUFPbFMsR0FBUCxDQUFqQixFQUFrQztBQUNqQ21ELGNBQU9xSSxLQUFLeUcsZ0JBQUwsQ0FBdUIsSUFBdkIsQ0FBUDtBQUNBLFdBQUs5TyxRQUFRQSxLQUFLMUcsS0FBTCxLQUFldVMsRUFBNUIsRUFBaUM7QUFDaEMsZUFBTyxDQUFFeEQsSUFBRixDQUFQO0FBQ0E7QUFDRDtBQUNEOztBQUVELFlBQU8sRUFBUDtBQUNBO0FBQ0QsSUExQkQ7QUEyQkE7O0FBRUQ7QUFDQTdCLE9BQUtxSSxJQUFMLENBQVcsS0FBWCxJQUFxQnRJLFFBQVF1RixvQkFBUixHQUNwQixVQUFVaFMsR0FBVixFQUFlb1IsT0FBZixFQUF5QjtBQUN4QixPQUFLLE9BQU9BLFFBQVFZLG9CQUFmLEtBQXdDLFdBQTdDLEVBQTJEO0FBQzFELFdBQU9aLFFBQVFZLG9CQUFSLENBQThCaFMsR0FBOUIsQ0FBUDs7QUFFRDtBQUNDLElBSkQsTUFJTyxJQUFLeU0sUUFBUXlGLEdBQWIsRUFBbUI7QUFDekIsV0FBT2QsUUFBUTdPLGdCQUFSLENBQTBCdkMsR0FBMUIsQ0FBUDtBQUNBO0FBQ0QsR0FUbUIsR0FXcEIsVUFBVUEsR0FBVixFQUFlb1IsT0FBZixFQUF5QjtBQUN4QixPQUFJN0MsSUFBSjtBQUFBLE9BQ0MyRyxNQUFNLEVBRFA7QUFBQSxPQUVDblMsSUFBSSxDQUZMOzs7QUFJQztBQUNBc08sYUFBVUQsUUFBUVksb0JBQVIsQ0FBOEJoUyxHQUE5QixDQUxYOztBQU9BO0FBQ0EsT0FBS0EsUUFBUSxHQUFiLEVBQW1CO0FBQ2xCLFdBQVV1TyxPQUFPOEMsUUFBU3RPLEdBQVQsQ0FBakIsRUFBb0M7QUFDbkMsU0FBS3dMLEtBQUsxSCxRQUFMLEtBQWtCLENBQXZCLEVBQTJCO0FBQzFCcU8sVUFBSTdTLElBQUosQ0FBVWtNLElBQVY7QUFDQTtBQUNEOztBQUVELFdBQU8yRyxHQUFQO0FBQ0E7QUFDRCxVQUFPN0QsT0FBUDtBQUNBLEdBOUJGOztBQWdDQTtBQUNBM0UsT0FBS3FJLElBQUwsQ0FBVyxPQUFYLElBQXVCdEksUUFBUXdGLHNCQUFSLElBQWtDLFVBQVV4SixTQUFWLEVBQXFCMkksT0FBckIsRUFBK0I7QUFDdkYsT0FBSyxPQUFPQSxRQUFRYSxzQkFBZixLQUEwQyxXQUExQyxJQUF5RDdFLGNBQTlELEVBQStFO0FBQzlFLFdBQU9nRSxRQUFRYSxzQkFBUixDQUFnQ3hKLFNBQWhDLENBQVA7QUFDQTtBQUNELEdBSkQ7O0FBTUE7OztBQUdBOztBQUVBO0FBQ0E2RSxrQkFBZ0IsRUFBaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBRCxjQUFZLEVBQVo7O0FBRUEsTUFBT1osUUFBUXlGLEdBQVIsR0FBYzFDLFFBQVE1SSxJQUFSLENBQWNqRixTQUFTWSxnQkFBdkIsQ0FBckIsRUFBbUU7O0FBRWxFO0FBQ0E7QUFDQXNRLFVBQVEsVUFBVUMsRUFBVixFQUFlOztBQUV0QixRQUFJdkcsS0FBSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FZLFlBQVF1SCxXQUFSLENBQXFCNUIsRUFBckIsRUFBMEJxQyxTQUExQixHQUFzQyxZQUFZNUgsT0FBWixHQUFzQixRQUF0QixHQUNyQyxjQURxQyxHQUNwQkEsT0FEb0IsR0FDViwyQkFEVSxHQUVyQyx3Q0FGRDs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUt1RixHQUFHdlEsZ0JBQUgsQ0FBcUIsc0JBQXJCLEVBQThDNUMsTUFBbkQsRUFBNEQ7QUFDM0QwTixlQUFVaEwsSUFBVixDQUFnQixXQUFXcU0sVUFBWCxHQUF3QixjQUF4QztBQUNBOztBQUVEO0FBQ0E7QUFDQSxRQUFLLENBQUNvRSxHQUFHdlEsZ0JBQUgsQ0FBcUIsWUFBckIsRUFBb0M1QyxNQUExQyxFQUFtRDtBQUNsRDBOLGVBQVVoTCxJQUFWLENBQWdCLFFBQVFxTSxVQUFSLEdBQXFCLFlBQXJCLEdBQW9DRCxRQUFwQyxHQUErQyxHQUEvRDtBQUNBOztBQUVEO0FBQ0EsUUFBSyxDQUFDcUUsR0FBR3ZRLGdCQUFILENBQXFCLFVBQVVnTCxPQUFWLEdBQW9CLElBQXpDLEVBQWdENU4sTUFBdEQsRUFBK0Q7QUFDOUQwTixlQUFVaEwsSUFBVixDQUFnQixJQUFoQjtBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQWtLLFlBQVE1SyxTQUFTb1IsYUFBVCxDQUF3QixPQUF4QixDQUFSO0FBQ0F4RyxVQUFNOEYsWUFBTixDQUFvQixNQUFwQixFQUE0QixFQUE1QjtBQUNBUyxPQUFHNEIsV0FBSCxDQUFnQm5JLEtBQWhCO0FBQ0EsUUFBSyxDQUFDdUcsR0FBR3ZRLGdCQUFILENBQXFCLFdBQXJCLEVBQW1DNUMsTUFBekMsRUFBa0Q7QUFDakQwTixlQUFVaEwsSUFBVixDQUFnQixRQUFRcU0sVUFBUixHQUFxQixPQUFyQixHQUErQkEsVUFBL0IsR0FBNEMsSUFBNUMsR0FDZkEsVUFEZSxHQUNGLGNBRGQ7QUFFQTs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxRQUFLLENBQUNvRSxHQUFHdlEsZ0JBQUgsQ0FBcUIsVUFBckIsRUFBa0M1QyxNQUF4QyxFQUFpRDtBQUNoRDBOLGVBQVVoTCxJQUFWLENBQWdCLFVBQWhCO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsUUFBSyxDQUFDeVEsR0FBR3ZRLGdCQUFILENBQXFCLE9BQU9nTCxPQUFQLEdBQWlCLElBQXRDLEVBQTZDNU4sTUFBbkQsRUFBNEQ7QUFDM0QwTixlQUFVaEwsSUFBVixDQUFnQixVQUFoQjtBQUNBOztBQUVEO0FBQ0E7QUFDQXlRLE9BQUd2USxnQkFBSCxDQUFxQixNQUFyQjtBQUNBOEssY0FBVWhMLElBQVYsQ0FBZ0IsYUFBaEI7QUFDQSxJQS9ERDs7QUFpRUF3USxVQUFRLFVBQVVDLEVBQVYsRUFBZTtBQUN0QkEsT0FBR3FDLFNBQUgsR0FBZSx3Q0FDZCxnREFERDs7QUFHQTtBQUNBO0FBQ0EsUUFBSTVJLFFBQVE1SyxTQUFTb1IsYUFBVCxDQUF3QixPQUF4QixDQUFaO0FBQ0F4RyxVQUFNOEYsWUFBTixDQUFvQixNQUFwQixFQUE0QixRQUE1QjtBQUNBUyxPQUFHNEIsV0FBSCxDQUFnQm5JLEtBQWhCLEVBQXdCOEYsWUFBeEIsQ0FBc0MsTUFBdEMsRUFBOEMsR0FBOUM7O0FBRUE7QUFDQTtBQUNBLFFBQUtTLEdBQUd2USxnQkFBSCxDQUFxQixVQUFyQixFQUFrQzVDLE1BQXZDLEVBQWdEO0FBQy9DME4sZUFBVWhMLElBQVYsQ0FBZ0IsU0FBU3FNLFVBQVQsR0FBc0IsYUFBdEM7QUFDQTs7QUFFRDtBQUNBO0FBQ0EsUUFBS29FLEdBQUd2USxnQkFBSCxDQUFxQixVQUFyQixFQUFrQzVDLE1BQWxDLEtBQTZDLENBQWxELEVBQXNEO0FBQ3JEME4sZUFBVWhMLElBQVYsQ0FBZ0IsVUFBaEIsRUFBNEIsV0FBNUI7QUFDQTs7QUFFRDtBQUNBO0FBQ0E4SyxZQUFRdUgsV0FBUixDQUFxQjVCLEVBQXJCLEVBQTBCcEMsUUFBMUIsR0FBcUMsSUFBckM7QUFDQSxRQUFLb0MsR0FBR3ZRLGdCQUFILENBQXFCLFdBQXJCLEVBQW1DNUMsTUFBbkMsS0FBOEMsQ0FBbkQsRUFBdUQ7QUFDdEQwTixlQUFVaEwsSUFBVixDQUFnQixVQUFoQixFQUE0QixXQUE1QjtBQUNBOztBQUVEO0FBQ0E7QUFDQXlRLE9BQUd2USxnQkFBSCxDQUFxQixNQUFyQjtBQUNBOEssY0FBVWhMLElBQVYsQ0FBZ0IsTUFBaEI7QUFDQSxJQWpDRDtBQWtDQTs7QUFFRCxNQUFPb0ssUUFBUTJJLGVBQVIsR0FBMEI1RixRQUFRNUksSUFBUixDQUFnQmUsVUFBVXdGLFFBQVF4RixPQUFSLElBQzFEd0YsUUFBUWtJLHFCQURrRCxJQUUxRGxJLFFBQVFtSSxrQkFGa0QsSUFHMURuSSxRQUFRb0ksZ0JBSGtELElBSTFEcEksUUFBUXFJLGlCQUp3QixDQUFqQyxFQUltQzs7QUFFbEMzQyxVQUFRLFVBQVVDLEVBQVYsRUFBZTs7QUFFdEI7QUFDQTtBQUNBckcsWUFBUWdKLGlCQUFSLEdBQTRCOU4sUUFBUW1KLElBQVIsQ0FBY2dDLEVBQWQsRUFBa0IsR0FBbEIsQ0FBNUI7O0FBRUE7QUFDQTtBQUNBbkwsWUFBUW1KLElBQVIsQ0FBY2dDLEVBQWQsRUFBa0IsV0FBbEI7QUFDQXhGLGtCQUFjakwsSUFBZCxDQUFvQixJQUFwQixFQUEwQnVNLE9BQTFCO0FBQ0EsSUFWRDtBQVdBOztBQUVEdkIsY0FBWUEsVUFBVTFOLE1BQVYsSUFBb0IsSUFBSWdILE1BQUosQ0FBWTBHLFVBQVU1TixJQUFWLENBQWdCLEdBQWhCLENBQVosQ0FBaEM7QUFDQTZOLGtCQUFnQkEsY0FBYzNOLE1BQWQsSUFBd0IsSUFBSWdILE1BQUosQ0FBWTJHLGNBQWM3TixJQUFkLENBQW9CLEdBQXBCLENBQVosQ0FBeEM7O0FBRUE7O0FBRUEyVSxlQUFhNUUsUUFBUTVJLElBQVIsQ0FBY3VHLFFBQVF1SSx1QkFBdEIsQ0FBYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQXJNLGFBQVcrSyxjQUFjNUUsUUFBUTVJLElBQVIsQ0FBY3VHLFFBQVE5RCxRQUF0QixDQUFkLEdBQ1YsVUFBVXZCLENBQVYsRUFBYW9HLENBQWIsRUFBaUI7QUFDaEIsT0FBSXlILFFBQVE3TixFQUFFakIsUUFBRixLQUFlLENBQWYsR0FBbUJpQixFQUFFcU0sZUFBckIsR0FBdUNyTSxDQUFuRDtBQUFBLE9BQ0M4TixNQUFNMUgsS0FBS0EsRUFBRXBNLFVBRGQ7QUFFQSxVQUFPZ0csTUFBTThOLEdBQU4sSUFBYSxDQUFDLEVBQUdBLE9BQU9BLElBQUkvTyxRQUFKLEtBQWlCLENBQXhCLEtBQ3ZCOE8sTUFBTXRNLFFBQU4sR0FDQ3NNLE1BQU10TSxRQUFOLENBQWdCdU0sR0FBaEIsQ0FERCxHQUVDOU4sRUFBRTROLHVCQUFGLElBQTZCNU4sRUFBRTROLHVCQUFGLENBQTJCRSxHQUEzQixJQUFtQyxFQUgxQyxDQUFILENBQXJCO0FBS0EsR0FUUyxHQVVWLFVBQVU5TixDQUFWLEVBQWFvRyxDQUFiLEVBQWlCO0FBQ2hCLE9BQUtBLENBQUwsRUFBUztBQUNSLFdBQVVBLElBQUlBLEVBQUVwTSxVQUFoQixFQUErQjtBQUM5QixTQUFLb00sTUFBTXBHLENBQVgsRUFBZTtBQUNkLGFBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNELFVBQU8sS0FBUDtBQUNBLEdBbkJGOztBQXFCQTs7O0FBR0E7QUFDQW1HLGNBQVltRyxhQUNaLFVBQVV0TSxDQUFWLEVBQWFvRyxDQUFiLEVBQWlCOztBQUVoQjtBQUNBLE9BQUtwRyxNQUFNb0csQ0FBWCxFQUFlO0FBQ2RqQixtQkFBZSxJQUFmO0FBQ0EsV0FBTyxDQUFQO0FBQ0E7O0FBRUQ7QUFDQSxPQUFJeEcsVUFBVSxDQUFDcUIsRUFBRTROLHVCQUFILEdBQTZCLENBQUN4SCxFQUFFd0gsdUJBQTlDO0FBQ0EsT0FBS2pQLE9BQUwsRUFBZTtBQUNkLFdBQU9BLE9BQVA7QUFDQTs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FBLGFBQVUsQ0FBRXFCLEVBQUU4SixhQUFGLElBQW1COUosQ0FBckIsTUFBOEJvRyxFQUFFMEQsYUFBRixJQUFtQjFELENBQWpELElBQ1RwRyxFQUFFNE4sdUJBQUYsQ0FBMkJ4SCxDQUEzQixDQURTOztBQUdUO0FBQ0EsSUFKRDs7QUFNQTtBQUNBLE9BQUt6SCxVQUFVLENBQVYsSUFDRixDQUFDZ0csUUFBUW9KLFlBQVQsSUFBeUIzSCxFQUFFd0gsdUJBQUYsQ0FBMkI1TixDQUEzQixNQUFtQ3JCLE9BRC9ELEVBQzJFOztBQUUxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBS3FCLEtBQUtuRyxRQUFMLElBQWlCbUcsRUFBRThKLGFBQUYsSUFBbUJuRSxZQUFuQixJQUNyQnBFLFNBQVVvRSxZQUFWLEVBQXdCM0YsQ0FBeEIsQ0FERCxFQUMrQjtBQUM5QixZQUFPLENBQUMsQ0FBUjtBQUNBOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBS29HLEtBQUt2TSxRQUFMLElBQWlCdU0sRUFBRTBELGFBQUYsSUFBbUJuRSxZQUFuQixJQUNyQnBFLFNBQVVvRSxZQUFWLEVBQXdCUyxDQUF4QixDQURELEVBQytCO0FBQzlCLFlBQU8sQ0FBUDtBQUNBOztBQUVEO0FBQ0EsV0FBT2xCLFlBQ0ovRyxRQUFTK0csU0FBVCxFQUFvQmxGLENBQXBCLElBQTBCN0IsUUFBUytHLFNBQVQsRUFBb0JrQixDQUFwQixDQUR0QixHQUVOLENBRkQ7QUFHQTs7QUFFRCxVQUFPekgsVUFBVSxDQUFWLEdBQWMsQ0FBQyxDQUFmLEdBQW1CLENBQTFCO0FBQ0EsR0F4RFcsR0F5RFosVUFBVXFCLENBQVYsRUFBYW9HLENBQWIsRUFBaUI7O0FBRWhCO0FBQ0EsT0FBS3BHLE1BQU1vRyxDQUFYLEVBQWU7QUFDZGpCLG1CQUFlLElBQWY7QUFDQSxXQUFPLENBQVA7QUFDQTs7QUFFRCxPQUFJcUcsR0FBSjtBQUFBLE9BQ0N2USxJQUFJLENBREw7QUFBQSxPQUVDK1MsTUFBTWhPLEVBQUVoRyxVQUZUO0FBQUEsT0FHQzhULE1BQU0xSCxFQUFFcE0sVUFIVDtBQUFBLE9BSUNpVSxLQUFLLENBQUVqTyxDQUFGLENBSk47QUFBQSxPQUtDa08sS0FBSyxDQUFFOUgsQ0FBRixDQUxOOztBQU9BO0FBQ0EsT0FBSyxDQUFDNEgsR0FBRCxJQUFRLENBQUNGLEdBQWQsRUFBb0I7O0FBRW5CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBTzlOLEtBQUtuRyxRQUFMLEdBQWdCLENBQUMsQ0FBakIsR0FDTnVNLEtBQUt2TSxRQUFMLEdBQWdCLENBQWhCO0FBQ0E7QUFDQW1VLFVBQU0sQ0FBQyxDQUFQLEdBQ0FGLE1BQU0sQ0FBTixHQUNBNUksWUFDRS9HLFFBQVMrRyxTQUFULEVBQW9CbEYsQ0FBcEIsSUFBMEI3QixRQUFTK0csU0FBVCxFQUFvQmtCLENBQXBCLENBRDVCLEdBRUEsQ0FQRDs7QUFTRDtBQUNDLElBaEJELE1BZ0JPLElBQUs0SCxRQUFRRixHQUFiLEVBQW1CO0FBQ3pCLFdBQU92QyxhQUFjdkwsQ0FBZCxFQUFpQm9HLENBQWpCLENBQVA7QUFDQTs7QUFFRDtBQUNBb0YsU0FBTXhMLENBQU47QUFDQSxVQUFVd0wsTUFBTUEsSUFBSXhSLFVBQXBCLEVBQW1DO0FBQ2xDaVUsT0FBR2pTLE9BQUgsQ0FBWXdQLEdBQVo7QUFDQTtBQUNEQSxTQUFNcEYsQ0FBTjtBQUNBLFVBQVVvRixNQUFNQSxJQUFJeFIsVUFBcEIsRUFBbUM7QUFDbENrVSxPQUFHbFMsT0FBSCxDQUFZd1AsR0FBWjtBQUNBOztBQUVEO0FBQ0EsVUFBUXlDLEdBQUloVCxDQUFKLE1BQVlpVCxHQUFJalQsQ0FBSixDQUFwQixFQUE4QjtBQUM3QkE7QUFDQTs7QUFFRCxVQUFPQTs7QUFFTjtBQUNBc1EsZ0JBQWMwQyxHQUFJaFQsQ0FBSixDQUFkLEVBQXVCaVQsR0FBSWpULENBQUosQ0FBdkIsQ0FITTs7QUFLTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FnVCxNQUFJaFQsQ0FBSixLQUFXMEssWUFBWCxHQUEwQixDQUFDLENBQTNCLEdBQ0F1SSxHQUFJalQsQ0FBSixLQUFXMEssWUFBWCxHQUEwQixDQUExQjtBQUNBO0FBQ0EsSUFiRDtBQWNBLEdBMUhEOztBQTRIQSxTQUFPOUwsUUFBUDtBQUNBLEVBMWREOztBQTRkQUwsUUFBT3FHLE9BQVAsR0FBaUIsVUFBVXNPLElBQVYsRUFBZ0IvVCxRQUFoQixFQUEyQjtBQUMzQyxTQUFPWixPQUFRMlUsSUFBUixFQUFjLElBQWQsRUFBb0IsSUFBcEIsRUFBMEIvVCxRQUExQixDQUFQO0FBQ0EsRUFGRDs7QUFJQVosUUFBTzhULGVBQVAsR0FBeUIsVUFBVTdHLElBQVYsRUFBZ0IwSCxJQUFoQixFQUF1QjtBQUMvQy9JLGNBQWFxQixJQUFiOztBQUVBLE1BQUs5QixRQUFRMkksZUFBUixJQUEyQmhJLGNBQTNCLElBQ0osQ0FBQ1ksdUJBQXdCaUksT0FBTyxHQUEvQixDQURHLEtBRUYsQ0FBQzNJLGFBQUQsSUFBa0IsQ0FBQ0EsY0FBYzFHLElBQWQsQ0FBb0JxUCxJQUFwQixDQUZqQixNQUdGLENBQUM1SSxTQUFELElBQWtCLENBQUNBLFVBQVV6RyxJQUFWLENBQWdCcVAsSUFBaEIsQ0FIakIsQ0FBTCxFQUdpRDs7QUFFaEQsT0FBSTtBQUNILFFBQUlDLE1BQU12TyxRQUFRbUosSUFBUixDQUFjdkMsSUFBZCxFQUFvQjBILElBQXBCLENBQVY7O0FBRUE7QUFDQSxRQUFLQyxPQUFPekosUUFBUWdKLGlCQUFmOztBQUVKO0FBQ0E7QUFDQWxILFNBQUs1TSxRQUFMLElBQWlCNE0sS0FBSzVNLFFBQUwsQ0FBY2tGLFFBQWQsS0FBMkIsRUFKN0MsRUFJa0Q7QUFDakQsWUFBT3FQLEdBQVA7QUFDQTtBQUNELElBWEQsQ0FXRSxPQUFRbEYsQ0FBUixFQUFZO0FBQ2JoRCwyQkFBd0JpSSxJQUF4QixFQUE4QixJQUE5QjtBQUNBO0FBQ0Q7O0FBRUQsU0FBTzNVLE9BQVEyVSxJQUFSLEVBQWN0VSxRQUFkLEVBQXdCLElBQXhCLEVBQThCLENBQUU0TSxJQUFGLENBQTlCLEVBQXlDNU8sTUFBekMsR0FBa0QsQ0FBekQ7QUFDQSxFQXpCRDs7QUEyQkEyQixRQUFPK0gsUUFBUCxHQUFrQixVQUFVK0gsT0FBVixFQUFtQjdDLElBQW5CLEVBQTBCOztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSyxDQUFFNkMsUUFBUVEsYUFBUixJQUF5QlIsT0FBM0IsS0FBd0N6UCxRQUE3QyxFQUF3RDtBQUN2RHVMLGVBQWFrRSxPQUFiO0FBQ0E7QUFDRCxTQUFPL0gsU0FBVStILE9BQVYsRUFBbUI3QyxJQUFuQixDQUFQO0FBQ0EsRUFYRDs7QUFhQWpOLFFBQU82VSxJQUFQLEdBQWMsVUFBVTVILElBQVYsRUFBZ0JoUCxJQUFoQixFQUF1Qjs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUssQ0FBRWdQLEtBQUtxRCxhQUFMLElBQXNCckQsSUFBeEIsS0FBa0M1TSxRQUF2QyxFQUFrRDtBQUNqRHVMLGVBQWFxQixJQUFiO0FBQ0E7O0FBRUQsTUFBSXFFLEtBQUtsRyxLQUFLMEcsVUFBTCxDQUFpQjdULEtBQUt3RyxXQUFMLEVBQWpCLENBQVQ7OztBQUVDO0FBQ0E4QixRQUFNK0ssTUFBTXpFLE9BQU8yQyxJQUFQLENBQWFwRSxLQUFLMEcsVUFBbEIsRUFBOEI3VCxLQUFLd0csV0FBTCxFQUE5QixDQUFOLEdBQ0w2TSxHQUFJckUsSUFBSixFQUFVaFAsSUFBVixFQUFnQixDQUFDNk4sY0FBakIsQ0FESyxHQUVMckksU0FMRjs7QUFPQSxTQUFPOEMsUUFBUTlDLFNBQVIsR0FDTjhDLEdBRE0sR0FFTjRFLFFBQVF4TixVQUFSLElBQXNCLENBQUNtTyxjQUF2QixHQUNDbUIsS0FBS3ZKLFlBQUwsQ0FBbUJ6RixJQUFuQixDQURELEdBRUMsQ0FBRXNJLE1BQU0wRyxLQUFLeUcsZ0JBQUwsQ0FBdUJ6VixJQUF2QixDQUFSLEtBQTJDc0ksSUFBSXVPLFNBQS9DLEdBQ0N2TyxJQUFJckksS0FETCxHQUVDLElBTkg7QUFPQSxFQXpCRDs7QUEyQkE4QixRQUFPdU8sTUFBUCxHQUFnQixVQUFVd0csR0FBVixFQUFnQjtBQUMvQixTQUFPLENBQUVBLE1BQU0sRUFBUixFQUFhalcsT0FBYixDQUFzQjhQLFVBQXRCLEVBQWtDQyxVQUFsQyxDQUFQO0FBQ0EsRUFGRDs7QUFJQTdPLFFBQU9nVixLQUFQLEdBQWUsVUFBVUMsR0FBVixFQUFnQjtBQUM5QixRQUFNLElBQUkxTSxLQUFKLENBQVcsNENBQTRDME0sR0FBdkQsQ0FBTjtBQUNBLEVBRkQ7O0FBSUE7Ozs7QUFJQWpWLFFBQU9rVixVQUFQLEdBQW9CLFVBQVVuRixPQUFWLEVBQW9CO0FBQ3ZDLE1BQUk5QyxJQUFKO0FBQUEsTUFDQ2tJLGFBQWEsRUFEZDtBQUFBLE1BRUN0RixJQUFJLENBRkw7QUFBQSxNQUdDcE8sSUFBSSxDQUhMOztBQUtBO0FBQ0FrSyxpQkFBZSxDQUFDUixRQUFRaUssZ0JBQXhCO0FBQ0ExSixjQUFZLENBQUNQLFFBQVFrSyxVQUFULElBQXVCdEYsUUFBUXJILEtBQVIsQ0FBZSxDQUFmLENBQW5DO0FBQ0FxSCxVQUFRdE4sSUFBUixDQUFja0ssU0FBZDs7QUFFQSxNQUFLaEIsWUFBTCxFQUFvQjtBQUNuQixVQUFVc0IsT0FBTzhDLFFBQVN0TyxHQUFULENBQWpCLEVBQW9DO0FBQ25DLFFBQUt3TCxTQUFTOEMsUUFBU3RPLENBQVQsQ0FBZCxFQUE2QjtBQUM1Qm9PLFNBQUlzRixXQUFXcFUsSUFBWCxDQUFpQlUsQ0FBakIsQ0FBSjtBQUNBO0FBQ0Q7QUFDRCxVQUFRb08sR0FBUixFQUFjO0FBQ2JFLFlBQVF1RixNQUFSLENBQWdCSCxXQUFZdEYsQ0FBWixDQUFoQixFQUFpQyxDQUFqQztBQUNBO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBbkUsY0FBWSxJQUFaOztBQUVBLFNBQU9xRSxPQUFQO0FBQ0EsRUEzQkQ7O0FBNkJBOzs7O0FBSUExRSxXQUFVckwsT0FBT3FMLE9BQVAsR0FBaUIsVUFBVTRCLElBQVYsRUFBaUI7QUFDM0MsTUFBSXJJLElBQUo7QUFBQSxNQUNDZ1EsTUFBTSxFQURQO0FBQUEsTUFFQ25ULElBQUksQ0FGTDtBQUFBLE1BR0M4RCxXQUFXMEgsS0FBSzFILFFBSGpCOztBQUtBLE1BQUssQ0FBQ0EsUUFBTixFQUFpQjs7QUFFaEI7QUFDQSxVQUFVWCxPQUFPcUksS0FBTXhMLEdBQU4sQ0FBakIsRUFBaUM7O0FBRWhDO0FBQ0FtVCxXQUFPdkosUUFBU3pHLElBQVQsQ0FBUDtBQUNBO0FBQ0QsR0FSRCxNQVFPLElBQUtXLGFBQWEsQ0FBYixJQUFrQkEsYUFBYSxDQUEvQixJQUFvQ0EsYUFBYSxFQUF0RCxFQUEyRDs7QUFFakU7QUFDQTtBQUNBLE9BQUssT0FBTzBILEtBQUt2RixXQUFaLEtBQTRCLFFBQWpDLEVBQTRDO0FBQzNDLFdBQU91RixLQUFLdkYsV0FBWjtBQUNBLElBRkQsTUFFTzs7QUFFTjtBQUNBLFNBQU11RixPQUFPQSxLQUFLdEYsVUFBbEIsRUFBOEJzRixJQUE5QixFQUFvQ0EsT0FBT0EsS0FBS2tGLFdBQWhELEVBQThEO0FBQzdEeUMsWUFBT3ZKLFFBQVM0QixJQUFULENBQVA7QUFDQTtBQUNEO0FBQ0QsR0FiTSxNQWFBLElBQUsxSCxhQUFhLENBQWIsSUFBa0JBLGFBQWEsQ0FBcEMsRUFBd0M7QUFDOUMsVUFBTzBILEtBQUtyRixTQUFaO0FBQ0E7O0FBRUQ7O0FBRUEsU0FBT2dOLEdBQVA7QUFDQSxFQWxDRDs7QUFvQ0F4SixRQUFPcEwsT0FBT3VWLFNBQVAsR0FBbUI7O0FBRXpCO0FBQ0FuRSxlQUFhLEVBSFk7O0FBS3pCb0UsZ0JBQWNuRSxZQUxXOztBQU96QmxTLFNBQU8yTyxTQVBrQjs7QUFTekJnRSxjQUFZLEVBVGE7O0FBV3pCMkIsUUFBTSxFQVhtQjs7QUFhekJnQyxZQUFVO0FBQ1QsUUFBSyxFQUFFbkcsS0FBSyxZQUFQLEVBQXFCb0csT0FBTyxJQUE1QixFQURJO0FBRVQsUUFBSyxFQUFFcEcsS0FBSyxZQUFQLEVBRkk7QUFHVCxRQUFLLEVBQUVBLEtBQUssaUJBQVAsRUFBMEJvRyxPQUFPLElBQWpDLEVBSEk7QUFJVCxRQUFLLEVBQUVwRyxLQUFLLGlCQUFQO0FBSkksR0FiZTs7QUFvQnpCcUcsYUFBVztBQUNWLFdBQVEsY0FBVXhXLEtBQVYsRUFBa0I7QUFDekJBLFVBQU8sQ0FBUCxJQUFhQSxNQUFPLENBQVAsRUFBV0wsT0FBWCxDQUFvQnVQLFNBQXBCLEVBQStCQyxTQUEvQixDQUFiOztBQUVBO0FBQ0FuUCxVQUFPLENBQVAsSUFBYSxDQUFFQSxNQUFPLENBQVAsS0FBY0EsTUFBTyxDQUFQLENBQWQsSUFDZEEsTUFBTyxDQUFQLENBRGMsSUFDQSxFQURGLEVBQ09MLE9BRFAsQ0FDZ0J1UCxTQURoQixFQUMyQkMsU0FEM0IsQ0FBYjs7QUFHQSxRQUFLblAsTUFBTyxDQUFQLE1BQWUsSUFBcEIsRUFBMkI7QUFDMUJBLFdBQU8sQ0FBUCxJQUFhLE1BQU1BLE1BQU8sQ0FBUCxDQUFOLEdBQW1CLEdBQWhDO0FBQ0E7O0FBRUQsV0FBT0EsTUFBTXVKLEtBQU4sQ0FBYSxDQUFiLEVBQWdCLENBQWhCLENBQVA7QUFDQSxJQWJTOztBQWVWLFlBQVMsZUFBVXZKLEtBQVYsRUFBa0I7O0FBRTFCOzs7Ozs7Ozs7O0FBVUFBLFVBQU8sQ0FBUCxJQUFhQSxNQUFPLENBQVAsRUFBV3NGLFdBQVgsRUFBYjs7QUFFQSxRQUFLdEYsTUFBTyxDQUFQLEVBQVd1SixLQUFYLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLE1BQTZCLEtBQWxDLEVBQTBDOztBQUV6QztBQUNBLFNBQUssQ0FBQ3ZKLE1BQU8sQ0FBUCxDQUFOLEVBQW1CO0FBQ2xCYSxhQUFPZ1YsS0FBUCxDQUFjN1YsTUFBTyxDQUFQLENBQWQ7QUFDQTs7QUFFRDtBQUNBO0FBQ0FBLFdBQU8sQ0FBUCxJQUFhLEVBQUdBLE1BQU8sQ0FBUCxJQUNmQSxNQUFPLENBQVAsS0FBZUEsTUFBTyxDQUFQLEtBQWMsQ0FBN0IsQ0FEZSxHQUVmLEtBQU1BLE1BQU8sQ0FBUCxNQUFlLE1BQWYsSUFBeUJBLE1BQU8sQ0FBUCxNQUFlLEtBQTlDLENBRlksQ0FBYjtBQUdBQSxXQUFPLENBQVAsSUFBYSxFQUFLQSxNQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLENBQWYsSUFBK0JBLE1BQU8sQ0FBUCxNQUFlLEtBQWpELENBQWI7O0FBRUE7QUFDQSxLQWZELE1BZU8sSUFBS0EsTUFBTyxDQUFQLENBQUwsRUFBa0I7QUFDeEJhLFlBQU9nVixLQUFQLENBQWM3VixNQUFPLENBQVAsQ0FBZDtBQUNBOztBQUVELFdBQU9BLEtBQVA7QUFDQSxJQWpEUzs7QUFtRFYsYUFBVSxnQkFBVUEsS0FBVixFQUFrQjtBQUMzQixRQUFJeVcsTUFBSjtBQUFBLFFBQ0NDLFdBQVcsQ0FBQzFXLE1BQU8sQ0FBUCxDQUFELElBQWVBLE1BQU8sQ0FBUCxDQUQzQjs7QUFHQSxRQUFLMk8sVUFBVyxPQUFYLEVBQXFCeEksSUFBckIsQ0FBMkJuRyxNQUFPLENBQVAsQ0FBM0IsQ0FBTCxFQUErQztBQUM5QyxZQUFPLElBQVA7QUFDQTs7QUFFRDtBQUNBLFFBQUtBLE1BQU8sQ0FBUCxDQUFMLEVBQWtCO0FBQ2pCQSxXQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLEtBQWNBLE1BQU8sQ0FBUCxDQUFkLElBQTRCLEVBQXpDOztBQUVEO0FBQ0MsS0FKRCxNQUlPLElBQUswVyxZQUFZakksUUFBUXRJLElBQVIsQ0FBY3VRLFFBQWQsQ0FBWjs7QUFFWDtBQUNFRCxhQUFTckssU0FBVXNLLFFBQVYsRUFBb0IsSUFBcEIsQ0FIQTs7QUFLWDtBQUNFRCxhQUFTQyxTQUFTbFIsT0FBVCxDQUFrQixHQUFsQixFQUF1QmtSLFNBQVN4WCxNQUFULEdBQWtCdVgsTUFBekMsSUFBb0RDLFNBQVN4WCxNQU43RCxDQUFMLEVBTTZFOztBQUVuRjtBQUNBYyxXQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLEVBQVd1SixLQUFYLENBQWtCLENBQWxCLEVBQXFCa04sTUFBckIsQ0FBYjtBQUNBelcsV0FBTyxDQUFQLElBQWEwVyxTQUFTbk4sS0FBVCxDQUFnQixDQUFoQixFQUFtQmtOLE1BQW5CLENBQWI7QUFDQTs7QUFFRDtBQUNBLFdBQU96VyxNQUFNdUosS0FBTixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBUDtBQUNBO0FBL0VTLEdBcEJjOztBQXNHekI3RSxVQUFROztBQUVQLFVBQU8sYUFBVWlTLGdCQUFWLEVBQTZCO0FBQ25DLFFBQUl6RyxXQUFXeUcsaUJBQWlCaFgsT0FBakIsQ0FBMEJ1UCxTQUExQixFQUFxQ0MsU0FBckMsRUFBaUQ3SixXQUFqRCxFQUFmO0FBQ0EsV0FBT3FSLHFCQUFxQixHQUFyQixHQUNOLFlBQVc7QUFDVixZQUFPLElBQVA7QUFDQSxLQUhLLEdBSU4sVUFBVTdJLElBQVYsRUFBaUI7QUFDaEIsWUFBT0EsS0FBS29DLFFBQUwsSUFBaUJwQyxLQUFLb0MsUUFBTCxDQUFjNUssV0FBZCxPQUFnQzRLLFFBQXhEO0FBQ0EsS0FORjtBQU9BLElBWE07O0FBYVAsWUFBUyxlQUFVbEksU0FBVixFQUFzQjtBQUM5QixRQUFJM0ksVUFBVThOLFdBQVluRixZQUFZLEdBQXhCLENBQWQ7O0FBRUEsV0FBTzNJLFdBQ04sQ0FBRUEsVUFBVSxJQUFJNkcsTUFBSixDQUFZLFFBQVErSCxVQUFSLEdBQ3ZCLEdBRHVCLEdBQ2pCakcsU0FEaUIsR0FDTCxHQURLLEdBQ0NpRyxVQURELEdBQ2MsS0FEMUIsQ0FBWixLQUNtRGQsV0FDakRuRixTQURpRCxFQUN0QyxVQUFVOEYsSUFBVixFQUFpQjtBQUMzQixZQUFPek8sUUFBUThHLElBQVIsQ0FDTixPQUFPMkgsS0FBSzlGLFNBQVosS0FBMEIsUUFBMUIsSUFBc0M4RixLQUFLOUYsU0FBM0MsSUFDQSxPQUFPOEYsS0FBS3ZKLFlBQVosS0FBNkIsV0FBN0IsSUFDQ3VKLEtBQUt2SixZQUFMLENBQW1CLE9BQW5CLENBRkQsSUFHQSxFQUpNLENBQVA7QUFNRixLQVJrRCxDQUZwRDtBQVdBLElBM0JNOztBQTZCUCxXQUFRLGNBQVV6RixJQUFWLEVBQWdCOFgsUUFBaEIsRUFBMEIxTixLQUExQixFQUFrQztBQUN6QyxXQUFPLFVBQVU0RSxJQUFWLEVBQWlCO0FBQ3ZCLFNBQUkvRyxTQUFTbEcsT0FBTzZVLElBQVAsQ0FBYTVILElBQWIsRUFBbUJoUCxJQUFuQixDQUFiOztBQUVBLFNBQUtpSSxVQUFVLElBQWYsRUFBc0I7QUFDckIsYUFBTzZQLGFBQWEsSUFBcEI7QUFDQTtBQUNELFNBQUssQ0FBQ0EsUUFBTixFQUFpQjtBQUNoQixhQUFPLElBQVA7QUFDQTs7QUFFRDdQLGVBQVUsRUFBVjs7QUFFQTs7QUFFQSxZQUFPNlAsYUFBYSxHQUFiLEdBQW1CN1AsV0FBV21DLEtBQTlCLEdBQ04wTixhQUFhLElBQWIsR0FBb0I3UCxXQUFXbUMsS0FBL0IsR0FDQTBOLGFBQWEsSUFBYixHQUFvQjFOLFNBQVNuQyxPQUFPdkIsT0FBUCxDQUFnQjBELEtBQWhCLE1BQTRCLENBQXpELEdBQ0EwTixhQUFhLElBQWIsR0FBb0IxTixTQUFTbkMsT0FBT3ZCLE9BQVAsQ0FBZ0IwRCxLQUFoQixJQUEwQixDQUFDLENBQXhELEdBQ0EwTixhQUFhLElBQWIsR0FBb0IxTixTQUFTbkMsT0FBT3dDLEtBQVAsQ0FBYyxDQUFDTCxNQUFNaEssTUFBckIsTUFBa0NnSyxLQUEvRCxHQUNBME4sYUFBYSxJQUFiLEdBQW9CLENBQUUsTUFBTTdQLE9BQU9wSCxPQUFQLENBQWdCeU8sV0FBaEIsRUFBNkIsR0FBN0IsQ0FBTixHQUEyQyxHQUE3QyxFQUFtRDVJLE9BQW5ELENBQTREMEQsS0FBNUQsSUFBc0UsQ0FBQyxDQUEzRixHQUNBME4sYUFBYSxJQUFiLEdBQW9CN1AsV0FBV21DLEtBQVgsSUFBb0JuQyxPQUFPd0MsS0FBUCxDQUFjLENBQWQsRUFBaUJMLE1BQU1oSyxNQUFOLEdBQWUsQ0FBaEMsTUFBd0NnSyxRQUFRLEdBQXhGLEdBQ0EsS0FQRDtBQVFBO0FBRUEsS0F4QkQ7QUF5QkEsSUF2RE07O0FBeURQLFlBQVMsZUFBVWpELElBQVYsRUFBZ0I0USxJQUFoQixFQUFzQkMsU0FBdEIsRUFBaUNQLEtBQWpDLEVBQXdDUSxJQUF4QyxFQUErQztBQUN2RCxRQUFJQyxTQUFTL1EsS0FBS3NELEtBQUwsQ0FBWSxDQUFaLEVBQWUsQ0FBZixNQUF1QixLQUFwQztBQUFBLFFBQ0MwTixVQUFVaFIsS0FBS3NELEtBQUwsQ0FBWSxDQUFDLENBQWIsTUFBcUIsTUFEaEM7QUFBQSxRQUVDMk4sU0FBU0wsU0FBUyxTQUZuQjs7QUFJQSxXQUFPTixVQUFVLENBQVYsSUFBZVEsU0FBUyxDQUF4Qjs7QUFFTjtBQUNBLGNBQVVqSixJQUFWLEVBQWlCO0FBQ2hCLFlBQU8sQ0FBQyxDQUFDQSxLQUFLek0sVUFBZDtBQUNBLEtBTEssR0FPTixVQUFVeU0sSUFBVixFQUFnQnFKLFFBQWhCLEVBQTBCQyxHQUExQixFQUFnQztBQUMvQixTQUFJcEYsS0FBSjtBQUFBLFNBQVdxRixXQUFYO0FBQUEsU0FBd0JDLFVBQXhCO0FBQUEsU0FBb0M3UixJQUFwQztBQUFBLFNBQTBDOFIsU0FBMUM7QUFBQSxTQUFxREMsS0FBckQ7QUFBQSxTQUNDckgsTUFBTTZHLFdBQVdDLE9BQVgsR0FBcUIsYUFBckIsR0FBcUMsaUJBRDVDO0FBQUEsU0FFQ2pXLFNBQVM4TSxLQUFLek0sVUFGZjtBQUFBLFNBR0N2QyxPQUFPb1ksVUFBVXBKLEtBQUtvQyxRQUFMLENBQWM1SyxXQUFkLEVBSGxCO0FBQUEsU0FJQ21TLFdBQVcsQ0FBQ0wsR0FBRCxJQUFRLENBQUNGLE1BSnJCO0FBQUEsU0FLQ3BFLE9BQU8sS0FMUjs7QUFPQSxTQUFLOVIsTUFBTCxFQUFjOztBQUViO0FBQ0EsVUFBS2dXLE1BQUwsRUFBYztBQUNiLGNBQVE3RyxHQUFSLEVBQWM7QUFDYjFLLGVBQU9xSSxJQUFQO0FBQ0EsZUFBVXJJLE9BQU9BLEtBQU0wSyxHQUFOLENBQWpCLEVBQWlDO0FBQ2hDLGFBQUsrRyxTQUNKelIsS0FBS3lLLFFBQUwsQ0FBYzVLLFdBQWQsT0FBZ0N4RyxJQUQ1QixHQUVKMkcsS0FBS1csUUFBTCxLQUFrQixDQUZuQixFQUV1Qjs7QUFFdEIsaUJBQU8sS0FBUDtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQW9SLGdCQUFRckgsTUFBTWxLLFNBQVMsTUFBVCxJQUFtQixDQUFDdVIsS0FBcEIsSUFBNkIsYUFBM0M7QUFDQTtBQUNELGNBQU8sSUFBUDtBQUNBOztBQUVEQSxjQUFRLENBQUVQLFVBQVVqVyxPQUFPd0gsVUFBakIsR0FBOEJ4SCxPQUFPMFcsU0FBdkMsQ0FBUjs7QUFFQTtBQUNBLFVBQUtULFdBQVdRLFFBQWhCLEVBQTJCOztBQUUxQjs7QUFFQTtBQUNBaFMsY0FBT3pFLE1BQVA7QUFDQXNXLG9CQUFhN1IsS0FBTXFILE9BQU4sTUFBcUJySCxLQUFNcUgsT0FBTixJQUFrQixFQUF2QyxDQUFiOztBQUVBO0FBQ0E7QUFDQXVLLHFCQUFjQyxXQUFZN1IsS0FBS2tTLFFBQWpCLE1BQ1hMLFdBQVk3UixLQUFLa1MsUUFBakIsSUFBOEIsRUFEbkIsQ0FBZDs7QUFHQTNGLGVBQVFxRixZQUFhcFIsSUFBYixLQUF1QixFQUEvQjtBQUNBc1IsbUJBQVl2RixNQUFPLENBQVAsTUFBZS9FLE9BQWYsSUFBMEIrRSxNQUFPLENBQVAsQ0FBdEM7QUFDQWMsY0FBT3lFLGFBQWF2RixNQUFPLENBQVAsQ0FBcEI7QUFDQXZNLGNBQU84UixhQUFhdlcsT0FBT3NQLFVBQVAsQ0FBbUJpSCxTQUFuQixDQUFwQjs7QUFFQSxjQUFVOVIsT0FBTyxFQUFFOFIsU0FBRixJQUFlOVIsSUFBZixJQUF1QkEsS0FBTTBLLEdBQU4sQ0FBdkI7O0FBRWhCO0FBQ0UyQyxjQUFPeUUsWUFBWSxDQUhMLEtBR1lDLE1BQU0vTixHQUFOLEVBSDdCLEVBRzZDOztBQUU1QztBQUNBLFlBQUtoRSxLQUFLVyxRQUFMLEtBQWtCLENBQWxCLElBQXVCLEVBQUUwTSxJQUF6QixJQUFpQ3JOLFNBQVNxSSxJQUEvQyxFQUFzRDtBQUNyRHVKLHFCQUFhcFIsSUFBYixJQUFzQixDQUFFZ0gsT0FBRixFQUFXc0ssU0FBWCxFQUFzQnpFLElBQXRCLENBQXRCO0FBQ0E7QUFDQTtBQUNEO0FBRUQsT0E5QkQsTUE4Qk87O0FBRU47QUFDQSxXQUFLMkUsUUFBTCxFQUFnQjs7QUFFZjtBQUNBaFMsZUFBT3FJLElBQVA7QUFDQXdKLHFCQUFhN1IsS0FBTXFILE9BQU4sTUFBcUJySCxLQUFNcUgsT0FBTixJQUFrQixFQUF2QyxDQUFiOztBQUVBO0FBQ0E7QUFDQXVLLHNCQUFjQyxXQUFZN1IsS0FBS2tTLFFBQWpCLE1BQ1hMLFdBQVk3UixLQUFLa1MsUUFBakIsSUFBOEIsRUFEbkIsQ0FBZDs7QUFHQTNGLGdCQUFRcUYsWUFBYXBSLElBQWIsS0FBdUIsRUFBL0I7QUFDQXNSLG9CQUFZdkYsTUFBTyxDQUFQLE1BQWUvRSxPQUFmLElBQTBCK0UsTUFBTyxDQUFQLENBQXRDO0FBQ0FjLGVBQU95RSxTQUFQO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBLFdBQUt6RSxTQUFTLEtBQWQsRUFBc0I7O0FBRXJCO0FBQ0EsZUFBVXJOLE9BQU8sRUFBRThSLFNBQUYsSUFBZTlSLElBQWYsSUFBdUJBLEtBQU0wSyxHQUFOLENBQXZCLEtBQ2QyQyxPQUFPeUUsWUFBWSxDQURMLEtBQ1lDLE1BQU0vTixHQUFOLEVBRDdCLEVBQzZDOztBQUU1QyxhQUFLLENBQUV5TixTQUNOelIsS0FBS3lLLFFBQUwsQ0FBYzVLLFdBQWQsT0FBZ0N4RyxJQUQxQixHQUVOMkcsS0FBS1csUUFBTCxLQUFrQixDQUZkLEtBR0osRUFBRTBNLElBSEgsRUFHVTs7QUFFVDtBQUNBLGNBQUsyRSxRQUFMLEVBQWdCO0FBQ2ZILHdCQUFhN1IsS0FBTXFILE9BQU4sTUFDVnJILEtBQU1xSCxPQUFOLElBQWtCLEVBRFIsQ0FBYjs7QUFHQTtBQUNBO0FBQ0F1Syx5QkFBY0MsV0FBWTdSLEtBQUtrUyxRQUFqQixNQUNYTCxXQUFZN1IsS0FBS2tTLFFBQWpCLElBQThCLEVBRG5CLENBQWQ7O0FBR0FOLHVCQUFhcFIsSUFBYixJQUFzQixDQUFFZ0gsT0FBRixFQUFXNkYsSUFBWCxDQUF0QjtBQUNBOztBQUVELGNBQUtyTixTQUFTcUksSUFBZCxFQUFxQjtBQUNwQjtBQUNBO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQWdGLGNBQVFpRSxJQUFSO0FBQ0EsYUFBT2pFLFNBQVN5RCxLQUFULElBQW9CekQsT0FBT3lELEtBQVAsS0FBaUIsQ0FBakIsSUFBc0J6RCxPQUFPeUQsS0FBUCxJQUFnQixDQUFqRTtBQUNBO0FBQ0QsS0E5SEY7QUErSEEsSUE3TE07O0FBK0xQLGFBQVUsZ0JBQVU3WCxNQUFWLEVBQWtCNFUsUUFBbEIsRUFBNkI7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBSXNFLElBQUo7QUFBQSxRQUNDekYsS0FBS2xHLEtBQUtrQyxPQUFMLENBQWN6UCxNQUFkLEtBQTBCdU4sS0FBSzRMLFVBQUwsQ0FBaUJuWixPQUFPNEcsV0FBUCxFQUFqQixDQUExQixJQUNKekUsT0FBT2dWLEtBQVAsQ0FBYyx5QkFBeUJuWCxNQUF2QyxDQUZGOztBQUlBO0FBQ0E7QUFDQTtBQUNBLFFBQUt5VCxHQUFJckYsT0FBSixDQUFMLEVBQXFCO0FBQ3BCLFlBQU9xRixHQUFJbUIsUUFBSixDQUFQO0FBQ0E7O0FBRUQ7QUFDQSxRQUFLbkIsR0FBR2pULE1BQUgsR0FBWSxDQUFqQixFQUFxQjtBQUNwQjBZLFlBQU8sQ0FBRWxaLE1BQUYsRUFBVUEsTUFBVixFQUFrQixFQUFsQixFQUFzQjRVLFFBQXRCLENBQVA7QUFDQSxZQUFPckgsS0FBSzRMLFVBQUwsQ0FBZ0JsSyxjQUFoQixDQUFnQ2pQLE9BQU80RyxXQUFQLEVBQWhDLElBQ040TSxhQUFjLFVBQVVyQixJQUFWLEVBQWdCM0osT0FBaEIsRUFBMEI7QUFDdkMsVUFBSTRRLEdBQUo7QUFBQSxVQUNDQyxVQUFVNUYsR0FBSXRCLElBQUosRUFBVXlDLFFBQVYsQ0FEWDtBQUFBLFVBRUNoUixJQUFJeVYsUUFBUTdZLE1BRmI7QUFHQSxhQUFRb0QsR0FBUixFQUFjO0FBQ2J3VixhQUFNdFMsUUFBU3FMLElBQVQsRUFBZWtILFFBQVN6VixDQUFULENBQWYsQ0FBTjtBQUNBdU8sWUFBTWlILEdBQU4sSUFBYyxFQUFHNVEsUUFBUzRRLEdBQVQsSUFBaUJDLFFBQVN6VixDQUFULENBQXBCLENBQWQ7QUFDQTtBQUNELE1BUkQsQ0FETSxHQVVOLFVBQVV3TCxJQUFWLEVBQWlCO0FBQ2hCLGFBQU9xRSxHQUFJckUsSUFBSixFQUFVLENBQVYsRUFBYThKLElBQWIsQ0FBUDtBQUNBLE1BWkY7QUFhQTs7QUFFRCxXQUFPekYsRUFBUDtBQUNBO0FBbk9NLEdBdEdpQjs7QUE0VXpCaEUsV0FBUzs7QUFFUjtBQUNBLFVBQU8rRCxhQUFjLFVBQVVuUixRQUFWLEVBQXFCOztBQUV6QztBQUNBO0FBQ0E7QUFDQSxRQUFJK0ssUUFBUSxFQUFaO0FBQUEsUUFDQzhFLFVBQVUsRUFEWDtBQUFBLFFBRUNvSCxVQUFVM0wsUUFBU3RMLFNBQVNwQixPQUFULENBQWtCME8sS0FBbEIsRUFBeUIsSUFBekIsQ0FBVCxDQUZYOztBQUlBLFdBQU8ySixRQUFTbEwsT0FBVCxJQUNOb0YsYUFBYyxVQUFVckIsSUFBVixFQUFnQjNKLE9BQWhCLEVBQXlCaVEsUUFBekIsRUFBbUNDLEdBQW5DLEVBQXlDO0FBQ3RELFNBQUl0SixJQUFKO0FBQUEsU0FDQ21LLFlBQVlELFFBQVNuSCxJQUFULEVBQWUsSUFBZixFQUFxQnVHLEdBQXJCLEVBQTBCLEVBQTFCLENBRGI7QUFBQSxTQUVDOVUsSUFBSXVPLEtBQUszUixNQUZWOztBQUlBO0FBQ0EsWUFBUW9ELEdBQVIsRUFBYztBQUNiLFVBQU93TCxPQUFPbUssVUFBVzNWLENBQVgsQ0FBZCxFQUFpQztBQUNoQ3VPLFlBQU12TyxDQUFOLElBQVksRUFBRzRFLFFBQVM1RSxDQUFULElBQWV3TCxJQUFsQixDQUFaO0FBQ0E7QUFDRDtBQUNELEtBWEQsQ0FETSxHQWFOLFVBQVVBLElBQVYsRUFBZ0JxSixRQUFoQixFQUEwQkMsR0FBMUIsRUFBZ0M7QUFDL0J0TCxXQUFPLENBQVAsSUFBYWdDLElBQWI7QUFDQWtLLGFBQVNsTSxLQUFULEVBQWdCLElBQWhCLEVBQXNCc0wsR0FBdEIsRUFBMkJ4RyxPQUEzQjs7QUFFQTtBQUNBOUUsV0FBTyxDQUFQLElBQWEsSUFBYjtBQUNBLFlBQU8sQ0FBQzhFLFFBQVFuSCxHQUFSLEVBQVI7QUFDQSxLQXBCRjtBQXFCQSxJQTlCTSxDQUhDOztBQW1DUixVQUFPeUksYUFBYyxVQUFVblIsUUFBVixFQUFxQjtBQUN6QyxXQUFPLFVBQVUrTSxJQUFWLEVBQWlCO0FBQ3ZCLFlBQU9qTixPQUFRRSxRQUFSLEVBQWtCK00sSUFBbEIsRUFBeUI1TyxNQUF6QixHQUFrQyxDQUF6QztBQUNBLEtBRkQ7QUFHQSxJQUpNLENBbkNDOztBQXlDUixlQUFZZ1QsYUFBYyxVQUFVdkosSUFBVixFQUFpQjtBQUMxQ0EsV0FBT0EsS0FBS2hKLE9BQUwsQ0FBY3VQLFNBQWQsRUFBeUJDLFNBQXpCLENBQVA7QUFDQSxXQUFPLFVBQVVyQixJQUFWLEVBQWlCO0FBQ3ZCLFlBQU8sQ0FBRUEsS0FBS3ZGLFdBQUwsSUFBb0IyRCxRQUFTNEIsSUFBVCxDQUF0QixFQUF3Q3RJLE9BQXhDLENBQWlEbUQsSUFBakQsSUFBMEQsQ0FBQyxDQUFsRTtBQUNBLEtBRkQ7QUFHQSxJQUxXLENBekNKOztBQWdEUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVF1SixhQUFjLFVBQVVnRyxJQUFWLEVBQWlCOztBQUV0QztBQUNBLFFBQUssQ0FBQ3hKLFlBQVl2SSxJQUFaLENBQWtCK1IsUUFBUSxFQUExQixDQUFOLEVBQXVDO0FBQ3RDclgsWUFBT2dWLEtBQVAsQ0FBYyx1QkFBdUJxQyxJQUFyQztBQUNBO0FBQ0RBLFdBQU9BLEtBQUt2WSxPQUFMLENBQWN1UCxTQUFkLEVBQXlCQyxTQUF6QixFQUFxQzdKLFdBQXJDLEVBQVA7QUFDQSxXQUFPLFVBQVV3SSxJQUFWLEVBQWlCO0FBQ3ZCLFNBQUlxSyxRQUFKO0FBQ0EsUUFBRztBQUNGLFVBQU9BLFdBQVd4TCxpQkFDakJtQixLQUFLb0ssSUFEWSxHQUVqQnBLLEtBQUt2SixZQUFMLENBQW1CLFVBQW5CLEtBQW1DdUosS0FBS3ZKLFlBQUwsQ0FBbUIsTUFBbkIsQ0FGcEMsRUFFb0U7O0FBRW5FNFQsa0JBQVdBLFNBQVM3UyxXQUFULEVBQVg7QUFDQSxjQUFPNlMsYUFBYUQsSUFBYixJQUFxQkMsU0FBUzNTLE9BQVQsQ0FBa0IwUyxPQUFPLEdBQXpCLE1BQW1DLENBQS9EO0FBQ0E7QUFDRCxNQVJELFFBUVUsQ0FBRXBLLE9BQU9BLEtBQUt6TSxVQUFkLEtBQThCeU0sS0FBSzFILFFBQUwsS0FBa0IsQ0FSMUQ7QUFTQSxZQUFPLEtBQVA7QUFDQSxLQVpEO0FBYUEsSUFwQk8sQ0F2REE7O0FBNkVSO0FBQ0EsYUFBVSxnQkFBVTBILElBQVYsRUFBaUI7QUFDMUIsUUFBSXNLLE9BQU9yTSxPQUFPc00sUUFBUCxJQUFtQnRNLE9BQU9zTSxRQUFQLENBQWdCRCxJQUE5QztBQUNBLFdBQU9BLFFBQVFBLEtBQUs3TyxLQUFMLENBQVksQ0FBWixNQUFvQnVFLEtBQUt3RCxFQUF4QztBQUNBLElBakZPOztBQW1GUixXQUFRLGNBQVV4RCxJQUFWLEVBQWlCO0FBQ3hCLFdBQU9BLFNBQVNwQixPQUFoQjtBQUNBLElBckZPOztBQXVGUixZQUFTLGVBQVVvQixJQUFWLEVBQWlCO0FBQ3pCLFdBQU9BLFNBQVM1TSxTQUFTb1gsYUFBbEIsS0FDSixDQUFDcFgsU0FBU3FYLFFBQVYsSUFBc0JyWCxTQUFTcVgsUUFBVCxFQURsQixLQUVOLENBQUMsRUFBR3pLLEtBQUs3SCxJQUFMLElBQWE2SCxLQUFLMEssSUFBbEIsSUFBMEIsQ0FBQzFLLEtBQUsySyxRQUFuQyxDQUZGO0FBR0EsSUEzRk87O0FBNkZSO0FBQ0EsY0FBV3RGLHFCQUFzQixLQUF0QixDQTlGSDtBQStGUixlQUFZQSxxQkFBc0IsSUFBdEIsQ0EvRko7O0FBaUdSLGNBQVcsaUJBQVVyRixJQUFWLEVBQWlCOztBQUUzQjtBQUNBO0FBQ0EsUUFBSW9DLFdBQVdwQyxLQUFLb0MsUUFBTCxDQUFjNUssV0FBZCxFQUFmO0FBQ0EsV0FBUzRLLGFBQWEsT0FBYixJQUF3QixDQUFDLENBQUNwQyxLQUFLNEssT0FBakMsSUFDSnhJLGFBQWEsUUFBYixJQUF5QixDQUFDLENBQUNwQyxLQUFLNkssUUFEbkM7QUFFQSxJQXhHTzs7QUEwR1IsZUFBWSxrQkFBVTdLLElBQVYsRUFBaUI7O0FBRTVCO0FBQ0E7QUFDQSxRQUFLQSxLQUFLek0sVUFBVixFQUF1QjtBQUN0QjtBQUNBeU0sVUFBS3pNLFVBQUwsQ0FBZ0J1WCxhQUFoQjtBQUNBOztBQUVELFdBQU85SyxLQUFLNkssUUFBTCxLQUFrQixJQUF6QjtBQUNBLElBcEhPOztBQXNIUjtBQUNBLFlBQVMsZUFBVTdLLElBQVYsRUFBaUI7O0FBRXpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBTUEsT0FBT0EsS0FBS3RGLFVBQWxCLEVBQThCc0YsSUFBOUIsRUFBb0NBLE9BQU9BLEtBQUtrRixXQUFoRCxFQUE4RDtBQUM3RCxTQUFLbEYsS0FBSzFILFFBQUwsR0FBZ0IsQ0FBckIsRUFBeUI7QUFDeEIsYUFBTyxLQUFQO0FBQ0E7QUFDRDtBQUNELFdBQU8sSUFBUDtBQUNBLElBbklPOztBQXFJUixhQUFVLGdCQUFVMEgsSUFBVixFQUFpQjtBQUMxQixXQUFPLENBQUM3QixLQUFLa0MsT0FBTCxDQUFjLE9BQWQsRUFBeUJMLElBQXpCLENBQVI7QUFDQSxJQXZJTzs7QUF5SVI7QUFDQSxhQUFVLGdCQUFVQSxJQUFWLEVBQWlCO0FBQzFCLFdBQU9nQixRQUFRM0ksSUFBUixDQUFjMkgsS0FBS29DLFFBQW5CLENBQVA7QUFDQSxJQTVJTzs7QUE4SVIsWUFBUyxlQUFVcEMsSUFBVixFQUFpQjtBQUN6QixXQUFPZSxRQUFRMUksSUFBUixDQUFjMkgsS0FBS29DLFFBQW5CLENBQVA7QUFDQSxJQWhKTzs7QUFrSlIsYUFBVSxnQkFBVXBDLElBQVYsRUFBaUI7QUFDMUIsUUFBSWhQLE9BQU9nUCxLQUFLb0MsUUFBTCxDQUFjNUssV0FBZCxFQUFYO0FBQ0EsV0FBT3hHLFNBQVMsT0FBVCxJQUFvQmdQLEtBQUs3SCxJQUFMLEtBQWMsUUFBbEMsSUFBOENuSCxTQUFTLFFBQTlEO0FBQ0EsSUFySk87O0FBdUpSLFdBQVEsY0FBVWdQLElBQVYsRUFBaUI7QUFDeEIsUUFBSTRILElBQUo7QUFDQSxXQUFPNUgsS0FBS29DLFFBQUwsQ0FBYzVLLFdBQWQsT0FBZ0MsT0FBaEMsSUFDTndJLEtBQUs3SCxJQUFMLEtBQWMsTUFEUjs7QUFHTjtBQUNBO0FBQ0UsS0FBRXlQLE9BQU81SCxLQUFLdkosWUFBTCxDQUFtQixNQUFuQixDQUFULEtBQTBDLElBQTFDLElBQ0RtUixLQUFLcFEsV0FBTCxPQUF1QixNQU5sQixDQUFQO0FBT0EsSUFoS087O0FBa0tSO0FBQ0EsWUFBUytOLHVCQUF3QixZQUFXO0FBQzNDLFdBQU8sQ0FBRSxDQUFGLENBQVA7QUFDQSxJQUZRLENBbktEOztBQXVLUixXQUFRQSx1QkFBd0IsVUFBVXdGLGFBQVYsRUFBeUIzWixNQUF6QixFQUFrQztBQUNqRSxXQUFPLENBQUVBLFNBQVMsQ0FBWCxDQUFQO0FBQ0EsSUFGTyxDQXZLQTs7QUEyS1IsU0FBTW1VLHVCQUF3QixVQUFVd0YsYUFBVixFQUF5QjNaLE1BQXpCLEVBQWlDb1UsUUFBakMsRUFBNEM7QUFDekUsV0FBTyxDQUFFQSxXQUFXLENBQVgsR0FBZUEsV0FBV3BVLE1BQTFCLEdBQW1Db1UsUUFBckMsQ0FBUDtBQUNBLElBRkssQ0EzS0U7O0FBK0tSLFdBQVFELHVCQUF3QixVQUFVRSxZQUFWLEVBQXdCclUsTUFBeEIsRUFBaUM7QUFDaEUsUUFBSW9ELElBQUksQ0FBUjtBQUNBLFdBQVFBLElBQUlwRCxNQUFaLEVBQW9Cb0QsS0FBSyxDQUF6QixFQUE2QjtBQUM1QmlSLGtCQUFhM1IsSUFBYixDQUFtQlUsQ0FBbkI7QUFDQTtBQUNELFdBQU9pUixZQUFQO0FBQ0EsSUFOTyxDQS9LQTs7QUF1TFIsVUFBT0YsdUJBQXdCLFVBQVVFLFlBQVYsRUFBd0JyVSxNQUF4QixFQUFpQztBQUMvRCxRQUFJb0QsSUFBSSxDQUFSO0FBQ0EsV0FBUUEsSUFBSXBELE1BQVosRUFBb0JvRCxLQUFLLENBQXpCLEVBQTZCO0FBQzVCaVIsa0JBQWEzUixJQUFiLENBQW1CVSxDQUFuQjtBQUNBO0FBQ0QsV0FBT2lSLFlBQVA7QUFDQSxJQU5NLENBdkxDOztBQStMUixTQUFNRix1QkFBd0IsVUFBVUUsWUFBVixFQUF3QnJVLE1BQXhCLEVBQWdDb1UsUUFBaEMsRUFBMkM7QUFDeEUsUUFBSWhSLElBQUlnUixXQUFXLENBQVgsR0FDUEEsV0FBV3BVLE1BREosR0FFUG9VLFdBQVdwVSxNQUFYLEdBQ0NBLE1BREQsR0FFQ29VLFFBSkY7QUFLQSxXQUFRLEVBQUVoUixDQUFGLElBQU8sQ0FBZixHQUFvQjtBQUNuQmlSLGtCQUFhM1IsSUFBYixDQUFtQlUsQ0FBbkI7QUFDQTtBQUNELFdBQU9pUixZQUFQO0FBQ0EsSUFWSyxDQS9MRTs7QUEyTVIsU0FBTUYsdUJBQXdCLFVBQVVFLFlBQVYsRUFBd0JyVSxNQUF4QixFQUFnQ29VLFFBQWhDLEVBQTJDO0FBQ3hFLFFBQUloUixJQUFJZ1IsV0FBVyxDQUFYLEdBQWVBLFdBQVdwVSxNQUExQixHQUFtQ29VLFFBQTNDO0FBQ0EsV0FBUSxFQUFFaFIsQ0FBRixHQUFNcEQsTUFBZCxHQUF3QjtBQUN2QnFVLGtCQUFhM1IsSUFBYixDQUFtQlUsQ0FBbkI7QUFDQTtBQUNELFdBQU9pUixZQUFQO0FBQ0EsSUFOSztBQTNNRTtBQTVVZ0IsRUFBMUI7O0FBaWlCQXRILE1BQUtrQyxPQUFMLENBQWMsS0FBZCxJQUF3QmxDLEtBQUtrQyxPQUFMLENBQWMsSUFBZCxDQUF4Qjs7QUFFQTtBQUNBLE1BQU03TCxDQUFOLElBQVcsRUFBRXdXLE9BQU8sSUFBVCxFQUFlQyxVQUFVLElBQXpCLEVBQStCQyxNQUFNLElBQXJDLEVBQTJDQyxVQUFVLElBQXJELEVBQTJEQyxPQUFPLElBQWxFLEVBQVgsRUFBc0Y7QUFDckZqTixPQUFLa0MsT0FBTCxDQUFjN0wsQ0FBZCxJQUFvQjJRLGtCQUFtQjNRLENBQW5CLENBQXBCO0FBQ0E7QUFDRCxNQUFNQSxDQUFOLElBQVcsRUFBRTZXLFFBQVEsSUFBVixFQUFnQkMsT0FBTyxJQUF2QixFQUFYLEVBQTJDO0FBQzFDbk4sT0FBS2tDLE9BQUwsQ0FBYzdMLENBQWQsSUFBb0I0USxtQkFBb0I1USxDQUFwQixDQUFwQjtBQUNBOztBQUVEO0FBQ0EsVUFBU3VWLFVBQVQsR0FBc0IsQ0FBRTtBQUN4QkEsWUFBV3dCLFNBQVgsR0FBdUJwTixLQUFLcU4sT0FBTCxHQUFlck4sS0FBS2tDLE9BQTNDO0FBQ0FsQyxNQUFLNEwsVUFBTCxHQUFrQixJQUFJQSxVQUFKLEVBQWxCOztBQUVBekwsWUFBV3ZMLE9BQU91TCxRQUFQLEdBQWtCLFVBQVVyTCxRQUFWLEVBQW9Cd1ksU0FBcEIsRUFBZ0M7QUFDNUQsTUFBSXhCLE9BQUo7QUFBQSxNQUFhL1gsS0FBYjtBQUFBLE1BQW9Cd1osTUFBcEI7QUFBQSxNQUE0QnZULElBQTVCO0FBQUEsTUFDQ3dULEtBREQ7QUFBQSxNQUNRekksTUFEUjtBQUFBLE1BQ2dCMEksVUFEaEI7QUFBQSxNQUVDQyxTQUFTdE0sV0FBWXRNLFdBQVcsR0FBdkIsQ0FGVjs7QUFJQSxNQUFLNFksTUFBTCxFQUFjO0FBQ2IsVUFBT0osWUFBWSxDQUFaLEdBQWdCSSxPQUFPcFEsS0FBUCxDQUFjLENBQWQsQ0FBdkI7QUFDQTs7QUFFRGtRLFVBQVExWSxRQUFSO0FBQ0FpUSxXQUFTLEVBQVQ7QUFDQTBJLGVBQWF6TixLQUFLdUssU0FBbEI7O0FBRUEsU0FBUWlELEtBQVIsRUFBZ0I7O0FBRWY7QUFDQSxPQUFLLENBQUMxQixPQUFELEtBQWMvWCxRQUFRc08sT0FBTzhDLElBQVAsQ0FBYXFJLEtBQWIsQ0FBdEIsQ0FBTCxFQUFvRDtBQUNuRCxRQUFLelosS0FBTCxFQUFhOztBQUVaO0FBQ0F5WixhQUFRQSxNQUFNbFEsS0FBTixDQUFhdkosTUFBTyxDQUFQLEVBQVdkLE1BQXhCLEtBQW9DdWEsS0FBNUM7QUFDQTtBQUNEekksV0FBT3BQLElBQVAsQ0FBZTRYLFNBQVMsRUFBeEI7QUFDQTs7QUFFRHpCLGFBQVUsS0FBVjs7QUFFQTtBQUNBLE9BQU8vWCxRQUFRdU8sYUFBYTZDLElBQWIsQ0FBbUJxSSxLQUFuQixDQUFmLEVBQThDO0FBQzdDMUIsY0FBVS9YLE1BQU0wRCxLQUFOLEVBQVY7QUFDQThWLFdBQU81WCxJQUFQLENBQWE7QUFDWjdDLFlBQU9nWixPQURLOztBQUdaO0FBQ0E5UixXQUFNakcsTUFBTyxDQUFQLEVBQVdMLE9BQVgsQ0FBb0IwTyxLQUFwQixFQUEyQixHQUEzQjtBQUpNLEtBQWI7QUFNQW9MLFlBQVFBLE1BQU1sUSxLQUFOLENBQWF3TyxRQUFRN1ksTUFBckIsQ0FBUjtBQUNBOztBQUVEO0FBQ0EsUUFBTStHLElBQU4sSUFBY2dHLEtBQUt2SCxNQUFuQixFQUE0QjtBQUMzQixRQUFLLENBQUUxRSxRQUFRMk8sVUFBVzFJLElBQVgsRUFBa0JtTCxJQUFsQixDQUF3QnFJLEtBQXhCLENBQVYsTUFBaUQsQ0FBQ0MsV0FBWXpULElBQVosQ0FBRCxLQUNuRGpHLFFBQVEwWixXQUFZelQsSUFBWixFQUFvQmpHLEtBQXBCLENBRDJDLENBQWpELENBQUwsRUFDNkM7QUFDNUMrWCxlQUFVL1gsTUFBTTBELEtBQU4sRUFBVjtBQUNBOFYsWUFBTzVYLElBQVAsQ0FBYTtBQUNaN0MsYUFBT2daLE9BREs7QUFFWjlSLFlBQU1BLElBRk07QUFHWmlCLGVBQVNsSDtBQUhHLE1BQWI7QUFLQXlaLGFBQVFBLE1BQU1sUSxLQUFOLENBQWF3TyxRQUFRN1ksTUFBckIsQ0FBUjtBQUNBO0FBQ0Q7O0FBRUQsT0FBSyxDQUFDNlksT0FBTixFQUFnQjtBQUNmO0FBQ0E7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxTQUFPd0IsWUFDTkUsTUFBTXZhLE1BREEsR0FFTnVhLFFBQ0M1WSxPQUFPZ1YsS0FBUCxDQUFjOVUsUUFBZCxDQUREOztBQUdDO0FBQ0FzTSxhQUFZdE0sUUFBWixFQUFzQmlRLE1BQXRCLEVBQStCekgsS0FBL0IsQ0FBc0MsQ0FBdEMsQ0FORjtBQU9BLEVBcEVEOztBQXNFQSxVQUFTc0ksVUFBVCxDQUFxQjJILE1BQXJCLEVBQThCO0FBQzdCLE1BQUlsWCxJQUFJLENBQVI7QUFBQSxNQUNDeUwsTUFBTXlMLE9BQU90YSxNQURkO0FBQUEsTUFFQzZCLFdBQVcsRUFGWjtBQUdBLFNBQVF1QixJQUFJeUwsR0FBWixFQUFpQnpMLEdBQWpCLEVBQXVCO0FBQ3RCdkIsZUFBWXlZLE9BQVFsWCxDQUFSLEVBQVl2RCxLQUF4QjtBQUNBO0FBQ0QsU0FBT2dDLFFBQVA7QUFDQTs7QUFFRCxVQUFTaVAsYUFBVCxDQUF3QmdJLE9BQXhCLEVBQWlDNEIsVUFBakMsRUFBNkNyYixJQUE3QyxFQUFvRDtBQUNuRCxNQUFJNFIsTUFBTXlKLFdBQVd6SixHQUFyQjtBQUFBLE1BQ0N6SyxPQUFPa1UsV0FBV3BXLElBRG5CO0FBQUEsTUFFQ3VCLE1BQU1XLFFBQVF5SyxHQUZmO0FBQUEsTUFHQzBKLG1CQUFtQnRiLFFBQVF3RyxRQUFRLFlBSHBDO0FBQUEsTUFJQytVLFdBQVc1TSxNQUpaOztBQU1BLFNBQU8wTSxXQUFXckQsS0FBWDs7QUFFTjtBQUNBLFlBQVV6SSxJQUFWLEVBQWdCNkMsT0FBaEIsRUFBeUJ5RyxHQUF6QixFQUErQjtBQUM5QixVQUFVdEosT0FBT0EsS0FBTXFDLEdBQU4sQ0FBakIsRUFBaUM7QUFDaEMsUUFBS3JDLEtBQUsxSCxRQUFMLEtBQWtCLENBQWxCLElBQXVCeVQsZ0JBQTVCLEVBQStDO0FBQzlDLFlBQU83QixRQUFTbEssSUFBVCxFQUFlNkMsT0FBZixFQUF3QnlHLEdBQXhCLENBQVA7QUFDQTtBQUNEO0FBQ0QsVUFBTyxLQUFQO0FBQ0EsR0FWSzs7QUFZTjtBQUNBLFlBQVV0SixJQUFWLEVBQWdCNkMsT0FBaEIsRUFBeUJ5RyxHQUF6QixFQUErQjtBQUM5QixPQUFJMkMsUUFBSjtBQUFBLE9BQWMxQyxXQUFkO0FBQUEsT0FBMkJDLFVBQTNCO0FBQUEsT0FDQzBDLFdBQVcsQ0FBRS9NLE9BQUYsRUFBVzZNLFFBQVgsQ0FEWjs7QUFHQTtBQUNBLE9BQUsxQyxHQUFMLEVBQVc7QUFDVixXQUFVdEosT0FBT0EsS0FBTXFDLEdBQU4sQ0FBakIsRUFBaUM7QUFDaEMsU0FBS3JDLEtBQUsxSCxRQUFMLEtBQWtCLENBQWxCLElBQXVCeVQsZ0JBQTVCLEVBQStDO0FBQzlDLFVBQUs3QixRQUFTbEssSUFBVCxFQUFlNkMsT0FBZixFQUF3QnlHLEdBQXhCLENBQUwsRUFBcUM7QUFDcEMsY0FBTyxJQUFQO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsSUFSRCxNQVFPO0FBQ04sV0FBVXRKLE9BQU9BLEtBQU1xQyxHQUFOLENBQWpCLEVBQWlDO0FBQ2hDLFNBQUtyQyxLQUFLMUgsUUFBTCxLQUFrQixDQUFsQixJQUF1QnlULGdCQUE1QixFQUErQztBQUM5Q3ZDLG1CQUFheEosS0FBTWhCLE9BQU4sTUFBcUJnQixLQUFNaEIsT0FBTixJQUFrQixFQUF2QyxDQUFiOztBQUVBO0FBQ0E7QUFDQXVLLG9CQUFjQyxXQUFZeEosS0FBSzZKLFFBQWpCLE1BQ1hMLFdBQVl4SixLQUFLNkosUUFBakIsSUFBOEIsRUFEbkIsQ0FBZDs7QUFHQSxVQUFLalMsUUFBUUEsU0FBU29JLEtBQUtvQyxRQUFMLENBQWM1SyxXQUFkLEVBQXRCLEVBQW9EO0FBQ25Ed0ksY0FBT0EsS0FBTXFDLEdBQU4sS0FBZXJDLElBQXRCO0FBQ0EsT0FGRCxNQUVPLElBQUssQ0FBRWlNLFdBQVcxQyxZQUFhdFMsR0FBYixDQUFiLEtBQ1hnVixTQUFVLENBQVYsTUFBa0I5TSxPQURQLElBQ2tCOE0sU0FBVSxDQUFWLE1BQWtCRCxRQUR6QyxFQUNvRDs7QUFFMUQ7QUFDQSxjQUFTRSxTQUFVLENBQVYsSUFBZ0JELFNBQVUsQ0FBVixDQUF6QjtBQUNBLE9BTE0sTUFLQTs7QUFFTjtBQUNBMUMsbUJBQWF0UyxHQUFiLElBQXFCaVYsUUFBckI7O0FBRUE7QUFDQSxXQUFPQSxTQUFVLENBQVYsSUFBZ0JoQyxRQUFTbEssSUFBVCxFQUFlNkMsT0FBZixFQUF3QnlHLEdBQXhCLENBQXZCLEVBQXlEO0FBQ3hELGVBQU8sSUFBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Q7QUFDRCxVQUFPLEtBQVA7QUFDQSxHQXpERjtBQTBEQTs7QUFFRCxVQUFTNkMsY0FBVCxDQUF5QkMsUUFBekIsRUFBb0M7QUFDbkMsU0FBT0EsU0FBU2hiLE1BQVQsR0FBa0IsQ0FBbEIsR0FDTixVQUFVNE8sSUFBVixFQUFnQjZDLE9BQWhCLEVBQXlCeUcsR0FBekIsRUFBK0I7QUFDOUIsT0FBSTlVLElBQUk0WCxTQUFTaGIsTUFBakI7QUFDQSxVQUFRb0QsR0FBUixFQUFjO0FBQ2IsUUFBSyxDQUFDNFgsU0FBVTVYLENBQVYsRUFBZXdMLElBQWYsRUFBcUI2QyxPQUFyQixFQUE4QnlHLEdBQTlCLENBQU4sRUFBNEM7QUFDM0MsWUFBTyxLQUFQO0FBQ0E7QUFDRDtBQUNELFVBQU8sSUFBUDtBQUNBLEdBVEssR0FVTjhDLFNBQVUsQ0FBVixDQVZEO0FBV0E7O0FBRUQsVUFBU0MsZ0JBQVQsQ0FBMkJwWixRQUEzQixFQUFxQ3FaLFFBQXJDLEVBQStDeEosT0FBL0MsRUFBeUQ7QUFDeEQsTUFBSXRPLElBQUksQ0FBUjtBQUFBLE1BQ0N5TCxNQUFNcU0sU0FBU2xiLE1BRGhCO0FBRUEsU0FBUW9ELElBQUl5TCxHQUFaLEVBQWlCekwsR0FBakIsRUFBdUI7QUFDdEJ6QixVQUFRRSxRQUFSLEVBQWtCcVosU0FBVTlYLENBQVYsQ0FBbEIsRUFBaUNzTyxPQUFqQztBQUNBO0FBQ0QsU0FBT0EsT0FBUDtBQUNBOztBQUVELFVBQVN5SixRQUFULENBQW1CcEMsU0FBbkIsRUFBOEJwWixHQUE5QixFQUFtQzZGLE1BQW5DLEVBQTJDaU0sT0FBM0MsRUFBb0R5RyxHQUFwRCxFQUEwRDtBQUN6RCxNQUFJdEosSUFBSjtBQUFBLE1BQ0N3TSxlQUFlLEVBRGhCO0FBQUEsTUFFQ2hZLElBQUksQ0FGTDtBQUFBLE1BR0N5TCxNQUFNa0ssVUFBVS9ZLE1BSGpCO0FBQUEsTUFJQ3FiLFNBQVMxYixPQUFPLElBSmpCOztBQU1BLFNBQVF5RCxJQUFJeUwsR0FBWixFQUFpQnpMLEdBQWpCLEVBQXVCO0FBQ3RCLE9BQU93TCxPQUFPbUssVUFBVzNWLENBQVgsQ0FBZCxFQUFpQztBQUNoQyxRQUFLLENBQUNvQyxNQUFELElBQVdBLE9BQVFvSixJQUFSLEVBQWM2QyxPQUFkLEVBQXVCeUcsR0FBdkIsQ0FBaEIsRUFBK0M7QUFDOUNrRCxrQkFBYTFZLElBQWIsQ0FBbUJrTSxJQUFuQjtBQUNBLFNBQUt5TSxNQUFMLEVBQWM7QUFDYjFiLFVBQUkrQyxJQUFKLENBQVVVLENBQVY7QUFDQTtBQUNEO0FBQ0Q7QUFDRDs7QUFFRCxTQUFPZ1ksWUFBUDtBQUNBOztBQUVELFVBQVNFLFVBQVQsQ0FBcUJoRSxTQUFyQixFQUFnQ3pWLFFBQWhDLEVBQTBDaVgsT0FBMUMsRUFBbUR5QyxVQUFuRCxFQUErREMsVUFBL0QsRUFBMkVDLFlBQTNFLEVBQTBGO0FBQ3pGLE1BQUtGLGNBQWMsQ0FBQ0EsV0FBWTNOLE9BQVosQ0FBcEIsRUFBNEM7QUFDM0MyTixnQkFBYUQsV0FBWUMsVUFBWixDQUFiO0FBQ0E7QUFDRCxNQUFLQyxjQUFjLENBQUNBLFdBQVk1TixPQUFaLENBQXBCLEVBQTRDO0FBQzNDNE4sZ0JBQWFGLFdBQVlFLFVBQVosRUFBd0JDLFlBQXhCLENBQWI7QUFDQTtBQUNELFNBQU96SSxhQUFjLFVBQVVyQixJQUFWLEVBQWdCRCxPQUFoQixFQUF5QkQsT0FBekIsRUFBa0N5RyxHQUFsQyxFQUF3QztBQUM1RCxPQUFJd0QsSUFBSjtBQUFBLE9BQVV0WSxDQUFWO0FBQUEsT0FBYXdMLElBQWI7QUFBQSxPQUNDK00sU0FBUyxFQURWO0FBQUEsT0FFQ0MsVUFBVSxFQUZYO0FBQUEsT0FHQ0MsY0FBY25LLFFBQVExUixNQUh2Qjs7O0FBS0M7QUFDQXNWLFdBQVEzRCxRQUFRc0osaUJBQ2ZwWixZQUFZLEdBREcsRUFFZjRQLFFBQVF2SyxRQUFSLEdBQW1CLENBQUV1SyxPQUFGLENBQW5CLEdBQWlDQSxPQUZsQixFQUdmLEVBSGUsQ0FOakI7OztBQVlDO0FBQ0FxSyxlQUFZeEUsY0FBZTNGLFFBQVEsQ0FBQzlQLFFBQXhCLElBQ1hzWixTQUFVN0YsS0FBVixFQUFpQnFHLE1BQWpCLEVBQXlCckUsU0FBekIsRUFBb0M3RixPQUFwQyxFQUE2Q3lHLEdBQTdDLENBRFcsR0FFWDVDLEtBZkY7QUFBQSxPQWlCQ3lHLGFBQWFqRDs7QUFFWjtBQUNBMEMsa0JBQWdCN0osT0FBTzJGLFNBQVAsR0FBbUJ1RSxlQUFlTixVQUFsRDs7QUFFQztBQUNBLEtBSEQ7O0FBS0M7QUFDQTdKLFVBVFcsR0FVWm9LLFNBM0JGOztBQTZCQTtBQUNBLE9BQUtoRCxPQUFMLEVBQWU7QUFDZEEsWUFBU2dELFNBQVQsRUFBb0JDLFVBQXBCLEVBQWdDdEssT0FBaEMsRUFBeUN5RyxHQUF6QztBQUNBOztBQUVEO0FBQ0EsT0FBS3FELFVBQUwsRUFBa0I7QUFDakJHLFdBQU9QLFNBQVVZLFVBQVYsRUFBc0JILE9BQXRCLENBQVA7QUFDQUwsZUFBWUcsSUFBWixFQUFrQixFQUFsQixFQUFzQmpLLE9BQXRCLEVBQStCeUcsR0FBL0I7O0FBRUE7QUFDQTlVLFFBQUlzWSxLQUFLMWIsTUFBVDtBQUNBLFdBQVFvRCxHQUFSLEVBQWM7QUFDYixTQUFPd0wsT0FBTzhNLEtBQU10WSxDQUFOLENBQWQsRUFBNEI7QUFDM0IyWSxpQkFBWUgsUUFBU3hZLENBQVQsQ0FBWixJQUE2QixFQUFHMFksVUFBV0YsUUFBU3hZLENBQVQsQ0FBWCxJQUE0QndMLElBQS9CLENBQTdCO0FBQ0E7QUFDRDtBQUNEOztBQUVELE9BQUsrQyxJQUFMLEVBQVk7QUFDWCxRQUFLNkosY0FBY2xFLFNBQW5CLEVBQStCO0FBQzlCLFNBQUtrRSxVQUFMLEVBQWtCOztBQUVqQjtBQUNBRSxhQUFPLEVBQVA7QUFDQXRZLFVBQUkyWSxXQUFXL2IsTUFBZjtBQUNBLGFBQVFvRCxHQUFSLEVBQWM7QUFDYixXQUFPd0wsT0FBT21OLFdBQVkzWSxDQUFaLENBQWQsRUFBa0M7O0FBRWpDO0FBQ0FzWSxhQUFLaFosSUFBTCxDQUFhb1osVUFBVzFZLENBQVgsSUFBaUJ3TCxJQUE5QjtBQUNBO0FBQ0Q7QUFDRDRNLGlCQUFZLElBQVosRUFBb0JPLGFBQWEsRUFBakMsRUFBdUNMLElBQXZDLEVBQTZDeEQsR0FBN0M7QUFDQTs7QUFFRDtBQUNBOVUsU0FBSTJZLFdBQVcvYixNQUFmO0FBQ0EsWUFBUW9ELEdBQVIsRUFBYztBQUNiLFVBQUssQ0FBRXdMLE9BQU9tTixXQUFZM1ksQ0FBWixDQUFULEtBQ0osQ0FBRXNZLE9BQU9GLGFBQWFsVixRQUFTcUwsSUFBVCxFQUFlL0MsSUFBZixDQUFiLEdBQXFDK00sT0FBUXZZLENBQVIsQ0FBOUMsSUFBOEQsQ0FBQyxDQURoRSxFQUNvRTs7QUFFbkV1TyxZQUFNK0osSUFBTixJQUFlLEVBQUdoSyxRQUFTZ0ssSUFBVCxJQUFrQjlNLElBQXJCLENBQWY7QUFDQTtBQUNEO0FBQ0Q7O0FBRUY7QUFDQyxJQTdCRCxNQTZCTztBQUNObU4saUJBQWFaLFNBQ1pZLGVBQWVySyxPQUFmLEdBQ0NxSyxXQUFXOUUsTUFBWCxDQUFtQjRFLFdBQW5CLEVBQWdDRSxXQUFXL2IsTUFBM0MsQ0FERCxHQUVDK2IsVUFIVyxDQUFiO0FBS0EsUUFBS1AsVUFBTCxFQUFrQjtBQUNqQkEsZ0JBQVksSUFBWixFQUFrQjlKLE9BQWxCLEVBQTJCcUssVUFBM0IsRUFBdUM3RCxHQUF2QztBQUNBLEtBRkQsTUFFTztBQUNOeFYsVUFBS3dPLEtBQUwsQ0FBWVEsT0FBWixFQUFxQnFLLFVBQXJCO0FBQ0E7QUFDRDtBQUNELEdBMUZNLENBQVA7QUEyRkE7O0FBRUQsVUFBU0MsaUJBQVQsQ0FBNEIxQixNQUE1QixFQUFxQztBQUNwQyxNQUFJMkIsWUFBSjtBQUFBLE1BQWtCbkQsT0FBbEI7QUFBQSxNQUEyQnRILENBQTNCO0FBQUEsTUFDQzNDLE1BQU15TCxPQUFPdGEsTUFEZDtBQUFBLE1BRUNrYyxrQkFBa0JuUCxLQUFLcUssUUFBTCxDQUFla0QsT0FBUSxDQUFSLEVBQVl2VCxJQUEzQixDQUZuQjtBQUFBLE1BR0NvVixtQkFBbUJELG1CQUFtQm5QLEtBQUtxSyxRQUFMLENBQWUsR0FBZixDQUh2QztBQUFBLE1BSUNoVSxJQUFJOFksa0JBQWtCLENBQWxCLEdBQXNCLENBSjNCOzs7QUFNQztBQUNBRSxpQkFBZXRMLGNBQWUsVUFBVWxDLElBQVYsRUFBaUI7QUFDOUMsVUFBT0EsU0FBU3FOLFlBQWhCO0FBQ0EsR0FGYyxFQUVaRSxnQkFGWSxFQUVNLElBRk4sQ0FQaEI7QUFBQSxNQVVDRSxrQkFBa0J2TCxjQUFlLFVBQVVsQyxJQUFWLEVBQWlCO0FBQ2pELFVBQU90SSxRQUFTMlYsWUFBVCxFQUF1QnJOLElBQXZCLElBQWdDLENBQUMsQ0FBeEM7QUFDQSxHQUZpQixFQUVmdU4sZ0JBRmUsRUFFRyxJQUZILENBVm5CO0FBQUEsTUFhQ25CLFdBQVcsQ0FBRSxVQUFVcE0sSUFBVixFQUFnQjZDLE9BQWhCLEVBQXlCeUcsR0FBekIsRUFBK0I7QUFDM0MsT0FBSTNCLE1BQVEsQ0FBQzJGLGVBQUQsS0FBc0JoRSxPQUFPekcsWUFBWXJFLGdCQUF6QyxDQUFGLEtBQ1QsQ0FBRTZPLGVBQWV4SyxPQUFqQixFQUEyQnZLLFFBQTNCLEdBQ0NrVixhQUFjeE4sSUFBZCxFQUFvQjZDLE9BQXBCLEVBQTZCeUcsR0FBN0IsQ0FERCxHQUVDbUUsZ0JBQWlCek4sSUFBakIsRUFBdUI2QyxPQUF2QixFQUFnQ3lHLEdBQWhDLENBSFEsQ0FBVjs7QUFLQTtBQUNBK0Qsa0JBQWUsSUFBZjtBQUNBLFVBQU8xRixHQUFQO0FBQ0EsR0FUVSxDQWJaOztBQXdCQSxTQUFRblQsSUFBSXlMLEdBQVosRUFBaUJ6TCxHQUFqQixFQUF1QjtBQUN0QixPQUFPMFYsVUFBVS9MLEtBQUtxSyxRQUFMLENBQWVrRCxPQUFRbFgsQ0FBUixFQUFZMkQsSUFBM0IsQ0FBakIsRUFBdUQ7QUFDdERpVSxlQUFXLENBQUVsSyxjQUFlaUssZUFBZ0JDLFFBQWhCLENBQWYsRUFBMkNsQyxPQUEzQyxDQUFGLENBQVg7QUFDQSxJQUZELE1BRU87QUFDTkEsY0FBVS9MLEtBQUt2SCxNQUFMLENBQWE4VSxPQUFRbFgsQ0FBUixFQUFZMkQsSUFBekIsRUFBZ0NtSyxLQUFoQyxDQUF1QyxJQUF2QyxFQUE2Q29KLE9BQVFsWCxDQUFSLEVBQVk0RSxPQUF6RCxDQUFWOztBQUVBO0FBQ0EsUUFBSzhRLFFBQVNsTCxPQUFULENBQUwsRUFBMEI7O0FBRXpCO0FBQ0E0RCxTQUFJLEVBQUVwTyxDQUFOO0FBQ0EsWUFBUW9PLElBQUkzQyxHQUFaLEVBQWlCMkMsR0FBakIsRUFBdUI7QUFDdEIsVUFBS3pFLEtBQUtxSyxRQUFMLENBQWVrRCxPQUFROUksQ0FBUixFQUFZekssSUFBM0IsQ0FBTCxFQUF5QztBQUN4QztBQUNBO0FBQ0Q7QUFDRCxZQUFPdVUsV0FDTmxZLElBQUksQ0FBSixJQUFTMlgsZUFBZ0JDLFFBQWhCLENBREgsRUFFTjVYLElBQUksQ0FBSixJQUFTdVA7O0FBRVQ7QUFDQTJILFlBQ0VqUSxLQURGLENBQ1MsQ0FEVCxFQUNZakgsSUFBSSxDQURoQixFQUVFUyxNQUZGLENBRVUsRUFBRWhFLE9BQU95YSxPQUFRbFgsSUFBSSxDQUFaLEVBQWdCMkQsSUFBaEIsS0FBeUIsR0FBekIsR0FBK0IsR0FBL0IsR0FBcUMsRUFBOUMsRUFGVixDQUhTLEVBTVB0RyxPQU5PLENBTUUwTyxLQU5GLEVBTVMsSUFOVCxDQUZILEVBU04ySixPQVRNLEVBVU4xVixJQUFJb08sQ0FBSixJQUFTd0ssa0JBQW1CMUIsT0FBT2pRLEtBQVAsQ0FBY2pILENBQWQsRUFBaUJvTyxDQUFqQixDQUFuQixDQVZILEVBV05BLElBQUkzQyxHQUFKLElBQVdtTixrQkFBcUIxQixTQUFTQSxPQUFPalEsS0FBUCxDQUFjbUgsQ0FBZCxDQUE5QixDQVhMLEVBWU5BLElBQUkzQyxHQUFKLElBQVc4RCxXQUFZMkgsTUFBWixDQVpMLENBQVA7QUFjQTtBQUNEVSxhQUFTdFksSUFBVCxDQUFlb1csT0FBZjtBQUNBO0FBQ0Q7O0FBRUQsU0FBT2lDLGVBQWdCQyxRQUFoQixDQUFQO0FBQ0E7O0FBRUQsVUFBU3NCLHdCQUFULENBQW1DQyxlQUFuQyxFQUFvREMsV0FBcEQsRUFBa0U7QUFDakUsTUFBSUMsUUFBUUQsWUFBWXhjLE1BQVosR0FBcUIsQ0FBakM7QUFBQSxNQUNDMGMsWUFBWUgsZ0JBQWdCdmMsTUFBaEIsR0FBeUIsQ0FEdEM7QUFBQSxNQUVDMmMsZUFBZSxTQUFmQSxZQUFlLENBQVVoTCxJQUFWLEVBQWdCRixPQUFoQixFQUF5QnlHLEdBQXpCLEVBQThCeEcsT0FBOUIsRUFBdUNrTCxTQUF2QyxFQUFtRDtBQUNqRSxPQUFJaE8sSUFBSjtBQUFBLE9BQVU0QyxDQUFWO0FBQUEsT0FBYXNILE9BQWI7QUFBQSxPQUNDK0QsZUFBZSxDQURoQjtBQUFBLE9BRUN6WixJQUFJLEdBRkw7QUFBQSxPQUdDMlYsWUFBWXBILFFBQVEsRUFIckI7QUFBQSxPQUlDbUwsYUFBYSxFQUpkO0FBQUEsT0FLQ0MsZ0JBQWdCM1AsZ0JBTGpCOzs7QUFPQztBQUNBa0ksV0FBUTNELFFBQVErSyxhQUFhM1AsS0FBS3FJLElBQUwsQ0FBVyxLQUFYLEVBQW9CLEdBQXBCLEVBQXlCd0gsU0FBekIsQ0FSOUI7OztBQVVDO0FBQ0FJLG1CQUFrQmpQLFdBQVdnUCxpQkFBaUIsSUFBakIsR0FBd0IsQ0FBeEIsR0FBNEJFLEtBQUtDLE1BQUwsTUFBaUIsR0FYM0U7QUFBQSxPQVlDck8sTUFBTXlHLE1BQU10VixNQVpiOztBQWNBLE9BQUs0YyxTQUFMLEVBQWlCOztBQUVoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBeFAsdUJBQW1CcUUsV0FBV3pQLFFBQVgsSUFBdUJ5UCxPQUF2QixJQUFrQ21MLFNBQXJEO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsVUFBUXhaLE1BQU15TCxHQUFOLElBQWEsQ0FBRUQsT0FBTzBHLE1BQU9sUyxDQUFQLENBQVQsS0FBeUIsSUFBOUMsRUFBb0RBLEdBQXBELEVBQTBEO0FBQ3pELFFBQUtzWixhQUFhOU4sSUFBbEIsRUFBeUI7QUFDeEI0QyxTQUFJLENBQUo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFLLENBQUNDLE9BQUQsSUFBWTdDLEtBQUtxRCxhQUFMLElBQXNCalEsUUFBdkMsRUFBa0Q7QUFDakR1TCxrQkFBYXFCLElBQWI7QUFDQXNKLFlBQU0sQ0FBQ3pLLGNBQVA7QUFDQTtBQUNELFlBQVVxTCxVQUFVeUQsZ0JBQWlCL0ssR0FBakIsQ0FBcEIsRUFBK0M7QUFDOUMsVUFBS3NILFFBQVNsSyxJQUFULEVBQWU2QyxXQUFXelAsUUFBMUIsRUFBb0NrVyxHQUFwQyxDQUFMLEVBQWlEO0FBQ2hEeEcsZUFBUWhQLElBQVIsQ0FBY2tNLElBQWQ7QUFDQTtBQUNBO0FBQ0Q7QUFDRCxTQUFLZ08sU0FBTCxFQUFpQjtBQUNoQjdPLGdCQUFVaVAsYUFBVjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxRQUFLUCxLQUFMLEVBQWE7O0FBRVo7QUFDQSxTQUFPN04sT0FBTyxDQUFDa0ssT0FBRCxJQUFZbEssSUFBMUIsRUFBbUM7QUFDbENpTztBQUNBOztBQUVEO0FBQ0EsU0FBS2xMLElBQUwsRUFBWTtBQUNYb0gsZ0JBQVVyVyxJQUFWLENBQWdCa00sSUFBaEI7QUFDQTtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBaU8sbUJBQWdCelosQ0FBaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFLcVosU0FBU3JaLE1BQU15WixZQUFwQixFQUFtQztBQUNsQ3JMLFFBQUksQ0FBSjtBQUNBLFdBQVVzSCxVQUFVMEQsWUFBYWhMLEdBQWIsQ0FBcEIsRUFBMkM7QUFDMUNzSCxhQUFTQyxTQUFULEVBQW9CK0QsVUFBcEIsRUFBZ0NyTCxPQUFoQyxFQUF5Q3lHLEdBQXpDO0FBQ0E7O0FBRUQsUUFBS3ZHLElBQUwsRUFBWTs7QUFFWDtBQUNBLFNBQUtrTCxlQUFlLENBQXBCLEVBQXdCO0FBQ3ZCLGFBQVF6WixHQUFSLEVBQWM7QUFDYixXQUFLLEVBQUcyVixVQUFXM1YsQ0FBWCxLQUFrQjBaLFdBQVkxWixDQUFaLENBQXJCLENBQUwsRUFBOEM7QUFDN0MwWixtQkFBWTFaLENBQVosSUFBa0JtSCxJQUFJNEcsSUFBSixDQUFVTyxPQUFWLENBQWxCO0FBQ0E7QUFDRDtBQUNEOztBQUVEO0FBQ0FvTCxrQkFBYTNCLFNBQVUyQixVQUFWLENBQWI7QUFDQTs7QUFFRDtBQUNBcGEsU0FBS3dPLEtBQUwsQ0FBWVEsT0FBWixFQUFxQm9MLFVBQXJCOztBQUVBO0FBQ0EsUUFBS0YsYUFBYSxDQUFDakwsSUFBZCxJQUFzQm1MLFdBQVc5YyxNQUFYLEdBQW9CLENBQTFDLElBQ0Y2YyxlQUFlTCxZQUFZeGMsTUFBN0IsR0FBd0MsQ0FEekMsRUFDNkM7O0FBRTVDMkIsWUFBT2tWLFVBQVAsQ0FBbUJuRixPQUFuQjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxPQUFLa0wsU0FBTCxFQUFpQjtBQUNoQjdPLGNBQVVpUCxhQUFWO0FBQ0E1UCx1QkFBbUIyUCxhQUFuQjtBQUNBOztBQUVELFVBQU9oRSxTQUFQO0FBQ0EsR0FySEY7O0FBdUhBLFNBQU8wRCxRQUNOekosYUFBYzJKLFlBQWQsQ0FETSxHQUVOQSxZQUZEO0FBR0E7O0FBRUR4UCxXQUFVeEwsT0FBT3dMLE9BQVAsR0FBaUIsVUFBVXRMLFFBQVYsRUFBb0JmLEtBQXBCLENBQTBCLHVCQUExQixFQUFvRDtBQUM5RSxNQUFJc0MsQ0FBSjtBQUFBLE1BQ0NvWixjQUFjLEVBRGY7QUFBQSxNQUVDRCxrQkFBa0IsRUFGbkI7QUFBQSxNQUdDOUIsU0FBU3JNLGNBQWV2TSxXQUFXLEdBQTFCLENBSFY7O0FBS0EsTUFBSyxDQUFDNFksTUFBTixFQUFlOztBQUVkO0FBQ0EsT0FBSyxDQUFDM1osS0FBTixFQUFjO0FBQ2JBLFlBQVFvTSxTQUFVckwsUUFBVixDQUFSO0FBQ0E7QUFDRHVCLE9BQUl0QyxNQUFNZCxNQUFWO0FBQ0EsVUFBUW9ELEdBQVIsRUFBYztBQUNicVgsYUFBU3VCLGtCQUFtQmxiLE1BQU9zQyxDQUFQLENBQW5CLENBQVQ7QUFDQSxRQUFLcVgsT0FBUTdNLE9BQVIsQ0FBTCxFQUF5QjtBQUN4QjRPLGlCQUFZOVosSUFBWixDQUFrQitYLE1BQWxCO0FBQ0EsS0FGRCxNQUVPO0FBQ044QixxQkFBZ0I3WixJQUFoQixDQUFzQitYLE1BQXRCO0FBQ0E7QUFDRDs7QUFFRDtBQUNBQSxZQUFTck0sY0FDUnZNLFFBRFEsRUFFUnlhLHlCQUEwQkMsZUFBMUIsRUFBMkNDLFdBQTNDLENBRlEsQ0FBVDs7QUFLQTtBQUNBL0IsVUFBTzVZLFFBQVAsR0FBa0JBLFFBQWxCO0FBQ0E7QUFDRCxTQUFPNFksTUFBUDtBQUNBLEVBaENEOztBQWtDQTs7Ozs7Ozs7O0FBU0E1WCxVQUFTbEIsT0FBT2tCLE1BQVAsR0FBZ0IsVUFBVWhCLFFBQVYsRUFBb0I0UCxPQUFwQixFQUE2QkMsT0FBN0IsRUFBc0NDLElBQXRDLEVBQTZDO0FBQ3JFLE1BQUl2TyxDQUFKO0FBQUEsTUFBT2tYLE1BQVA7QUFBQSxNQUFlNkMsS0FBZjtBQUFBLE1BQXNCcFcsSUFBdEI7QUFBQSxNQUE0QnFPLElBQTVCO0FBQUEsTUFDQ2dJLFdBQVcsT0FBT3ZiLFFBQVAsS0FBb0IsVUFBcEIsSUFBa0NBLFFBRDlDO0FBQUEsTUFFQ2YsUUFBUSxDQUFDNlEsSUFBRCxJQUFTekUsU0FBWXJMLFdBQVd1YixTQUFTdmIsUUFBVCxJQUFxQkEsUUFBNUMsQ0FGbEI7O0FBSUE2UCxZQUFVQSxXQUFXLEVBQXJCOztBQUVBO0FBQ0E7QUFDQSxNQUFLNVEsTUFBTWQsTUFBTixLQUFpQixDQUF0QixFQUEwQjs7QUFFekI7QUFDQXNhLFlBQVN4WixNQUFPLENBQVAsSUFBYUEsTUFBTyxDQUFQLEVBQVd1SixLQUFYLENBQWtCLENBQWxCLENBQXRCO0FBQ0EsT0FBS2lRLE9BQU90YSxNQUFQLEdBQWdCLENBQWhCLElBQXFCLENBQUVtZCxRQUFRN0MsT0FBUSxDQUFSLENBQVYsRUFBd0J2VCxJQUF4QixLQUFpQyxJQUF0RCxJQUNKMEssUUFBUXZLLFFBQVIsS0FBcUIsQ0FEakIsSUFDc0J1RyxjQUR0QixJQUN3Q1YsS0FBS3FLLFFBQUwsQ0FBZWtELE9BQVEsQ0FBUixFQUFZdlQsSUFBM0IsQ0FEN0MsRUFDaUY7O0FBRWhGMEssY0FBVSxDQUFFMUUsS0FBS3FJLElBQUwsQ0FBVyxJQUFYLEVBQW1CK0gsTUFBTW5WLE9BQU4sQ0FBZSxDQUFmLEVBQzdCdkgsT0FENkIsQ0FDcEJ1UCxTQURvQixFQUNUQyxTQURTLENBQW5CLEVBQ3VCd0IsT0FEdkIsS0FDb0MsRUFEdEMsRUFDNEMsQ0FENUMsQ0FBVjtBQUVBLFFBQUssQ0FBQ0EsT0FBTixFQUFnQjtBQUNmLFlBQU9DLE9BQVA7O0FBRUQ7QUFDQyxLQUpELE1BSU8sSUFBSzBMLFFBQUwsRUFBZ0I7QUFDdEIzTCxlQUFVQSxRQUFRdFAsVUFBbEI7QUFDQTs7QUFFRE4sZUFBV0EsU0FBU3dJLEtBQVQsQ0FBZ0JpUSxPQUFPOVYsS0FBUCxHQUFlM0UsS0FBZixDQUFxQkcsTUFBckMsQ0FBWDtBQUNBOztBQUVEO0FBQ0FvRCxPQUFJcU0sVUFBVyxjQUFYLEVBQTRCeEksSUFBNUIsQ0FBa0NwRixRQUFsQyxJQUErQyxDQUEvQyxHQUFtRHlZLE9BQU90YSxNQUE5RDtBQUNBLFVBQVFvRCxHQUFSLEVBQWM7QUFDYitaLFlBQVE3QyxPQUFRbFgsQ0FBUixDQUFSOztBQUVBO0FBQ0EsUUFBSzJKLEtBQUtxSyxRQUFMLENBQWlCclEsT0FBT29XLE1BQU1wVyxJQUE5QixDQUFMLEVBQThDO0FBQzdDO0FBQ0E7QUFDRCxRQUFPcU8sT0FBT3JJLEtBQUtxSSxJQUFMLENBQVdyTyxJQUFYLENBQWQsRUFBb0M7O0FBRW5DO0FBQ0EsU0FBTzRLLE9BQU95RCxLQUNiK0gsTUFBTW5WLE9BQU4sQ0FBZSxDQUFmLEVBQW1CdkgsT0FBbkIsQ0FBNEJ1UCxTQUE1QixFQUF1Q0MsU0FBdkMsQ0FEYSxFQUViRixTQUFTOUksSUFBVCxDQUFlcVQsT0FBUSxDQUFSLEVBQVl2VCxJQUEzQixLQUFxQ3lMLFlBQWFmLFFBQVF0UCxVQUFyQixDQUFyQyxJQUNDc1AsT0FIWSxDQUFkLEVBSU07O0FBRUw7QUFDQTZJLGFBQU9yRCxNQUFQLENBQWU3VCxDQUFmLEVBQWtCLENBQWxCO0FBQ0F2QixpQkFBVzhQLEtBQUszUixNQUFMLElBQWUyUyxXQUFZMkgsTUFBWixDQUExQjtBQUNBLFVBQUssQ0FBQ3pZLFFBQU4sRUFBaUI7QUFDaEJhLFlBQUt3TyxLQUFMLENBQVlRLE9BQVosRUFBcUJDLElBQXJCO0FBQ0EsY0FBT0QsT0FBUDtBQUNBOztBQUVEO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLEdBQUUwTCxZQUFZalEsUUFBU3RMLFFBQVQsRUFBbUJmLEtBQW5CLENBQWQsRUFDQzZRLElBREQsRUFFQ0YsT0FGRCxFQUdDLENBQUNoRSxjQUhGLEVBSUNpRSxPQUpELEVBS0MsQ0FBQ0QsT0FBRCxJQUFZMUIsU0FBUzlJLElBQVQsQ0FBZXBGLFFBQWYsS0FBNkIyUSxZQUFhZixRQUFRdFAsVUFBckIsQ0FBekMsSUFBOEVzUCxPQUwvRTtBQU9BLFNBQU9DLE9BQVA7QUFDQSxFQXZFRDs7QUF5RUE7O0FBRUE7QUFDQTVFLFNBQVFrSyxVQUFSLEdBQXFCcEosUUFBUXJJLEtBQVIsQ0FBZSxFQUFmLEVBQW9CbkIsSUFBcEIsQ0FBMEJrSyxTQUExQixFQUFzQ3hPLElBQXRDLENBQTRDLEVBQTVDLE1BQXFEOE4sT0FBMUU7O0FBRUE7QUFDQTtBQUNBZCxTQUFRaUssZ0JBQVIsR0FBMkIsQ0FBQyxDQUFDekosWUFBN0I7O0FBRUE7QUFDQUM7O0FBRUE7QUFDQTtBQUNBVCxTQUFRb0osWUFBUixHQUF1QmhELE9BQVEsVUFBVUMsRUFBVixFQUFlOztBQUU3QztBQUNBLFNBQU9BLEdBQUc0Qyx1QkFBSCxDQUE0Qi9ULFNBQVNvUixhQUFULENBQXdCLFVBQXhCLENBQTVCLElBQXFFLENBQTVFO0FBQ0EsRUFKc0IsQ0FBdkI7O0FBTUE7QUFDQTtBQUNBO0FBQ0EsS0FBSyxDQUFDRixPQUFRLFVBQVVDLEVBQVYsRUFBZTtBQUM1QkEsS0FBR3FDLFNBQUgsR0FBZSxrQkFBZjtBQUNBLFNBQU9yQyxHQUFHN0osVUFBSCxDQUFjakUsWUFBZCxDQUE0QixNQUE1QixNQUF5QyxHQUFoRDtBQUNBLEVBSEssQ0FBTixFQUdNO0FBQ0xpTyxZQUFXLHdCQUFYLEVBQXFDLFVBQVUxRSxJQUFWLEVBQWdCaFAsSUFBaEIsRUFBc0JxTixLQUF0QixFQUE4QjtBQUNsRSxPQUFLLENBQUNBLEtBQU4sRUFBYztBQUNiLFdBQU8yQixLQUFLdkosWUFBTCxDQUFtQnpGLElBQW5CLEVBQXlCQSxLQUFLd0csV0FBTCxPQUF1QixNQUF2QixHQUFnQyxDQUFoQyxHQUFvQyxDQUE3RCxDQUFQO0FBQ0E7QUFDRCxHQUpEO0FBS0E7O0FBRUQ7QUFDQTtBQUNBLEtBQUssQ0FBQzBHLFFBQVF4TixVQUFULElBQXVCLENBQUM0VCxPQUFRLFVBQVVDLEVBQVYsRUFBZTtBQUNuREEsS0FBR3FDLFNBQUgsR0FBZSxVQUFmO0FBQ0FyQyxLQUFHN0osVUFBSCxDQUFjb0osWUFBZCxDQUE0QixPQUE1QixFQUFxQyxFQUFyQztBQUNBLFNBQU9TLEdBQUc3SixVQUFILENBQWNqRSxZQUFkLENBQTRCLE9BQTVCLE1BQTBDLEVBQWpEO0FBQ0EsRUFKNEIsQ0FBN0IsRUFJTTtBQUNMaU8sWUFBVyxPQUFYLEVBQW9CLFVBQVUxRSxJQUFWLEVBQWdCeU8sS0FBaEIsRUFBdUJwUSxLQUF2QixFQUErQjtBQUNsRCxPQUFLLENBQUNBLEtBQUQsSUFBVTJCLEtBQUtvQyxRQUFMLENBQWM1SyxXQUFkLE9BQWdDLE9BQS9DLEVBQXlEO0FBQ3hELFdBQU93SSxLQUFLME8sWUFBWjtBQUNBO0FBQ0QsR0FKRDtBQUtBOztBQUVEO0FBQ0E7QUFDQSxLQUFLLENBQUNwSyxPQUFRLFVBQVVDLEVBQVYsRUFBZTtBQUM1QixTQUFPQSxHQUFHOU4sWUFBSCxDQUFpQixVQUFqQixLQUFpQyxJQUF4QztBQUNBLEVBRkssQ0FBTixFQUVNO0FBQ0xpTyxZQUFXeEUsUUFBWCxFQUFxQixVQUFVRixJQUFWLEVBQWdCaFAsSUFBaEIsRUFBc0JxTixLQUF0QixFQUE4QjtBQUNsRCxPQUFJL0UsR0FBSjtBQUNBLE9BQUssQ0FBQytFLEtBQU4sRUFBYztBQUNiLFdBQU8yQixLQUFNaFAsSUFBTixNQUFpQixJQUFqQixHQUF3QkEsS0FBS3dHLFdBQUwsRUFBeEIsR0FDTixDQUFFOEIsTUFBTTBHLEtBQUt5RyxnQkFBTCxDQUF1QnpWLElBQXZCLENBQVIsS0FBMkNzSSxJQUFJdU8sU0FBL0MsR0FDQ3ZPLElBQUlySSxLQURMLEdBRUMsSUFIRjtBQUlBO0FBQ0QsR0FSRDtBQVNBOztBQUVEO0FBQ0EsS0FBSTBkLFVBQVUxUSxPQUFPbEwsTUFBckI7O0FBRUFBLFFBQU82YixVQUFQLEdBQW9CLFlBQVc7QUFDOUIsTUFBSzNRLE9BQU9sTCxNQUFQLEtBQWtCQSxNQUF2QixFQUFnQztBQUMvQmtMLFVBQU9sTCxNQUFQLEdBQWdCNGIsT0FBaEI7QUFDQTs7QUFFRCxTQUFPNWIsTUFBUDtBQUNBLEVBTkQ7O0FBUUEsS0FBSyxJQUFMLEVBQWtEO0FBQ2pEOGIsRUFBQSxrQ0FBUSxZQUFXO0FBQ2xCLFVBQU85YixNQUFQO0FBQ0EsR0FGRDs7QUFJRDtBQUNDLEVBTkQsTUFNTyxJQUFLLE9BQU8rYixNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxPQUE3QyxFQUF1RDtBQUM3REQsU0FBT0MsT0FBUCxHQUFpQmhjLE1BQWpCO0FBQ0EsRUFGTSxNQUVBO0FBQ05rTCxTQUFPbEwsTUFBUCxHQUFnQkEsTUFBaEI7QUFDQTs7QUFFRDtBQUVDLENBbjZFRCxFQW02RUtrTCxNQW42RUwsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQ0NWUytRLE87Ozs7OzttQkFBbUJDLGlCOzs7Ozs7bUJBQW1CQyxnQjs7Ozs7Ozs7OzBDQUN0Q0YsTzs7Ozs7Ozs7OzZDQUNBQSxPOzs7Ozs7Ozs7Ozs7UUFDR0csTSIsImZpbGUiOiJvcHRpbWFsLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA4KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiYWY3OTg4MWQ3YWU5NjU3NTEwNiIsIi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IFBhdHRlcm5cbiAqIEBwcm9wZXJ0eSB7KCdkZXNjZW5kYW50JyB8ICdjaGlsZCcpfSAgICAgICAgICAgICAgICAgIFtyZWxhdGVzXVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhZ11cbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9Pn0gIGF0dHJpYnV0ZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBzZXVkb1xuICogQHByb3BlcnR5IHtBcnJheS48QXJyYXkuPFBhdHRlcm4+Pn0gICAgICAgICAgICAgICAgICAgZGVzY2VuZGFudHNcbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcGF0dGVybiBzdHJ1Y3R1cmVcbiAqIFxuICogQHBhcmFtIHtQYXJ0aWFsPFBhdHRlcm4+fSBwYXR0ZXJuXG4gKiBAcmV0dXJucyB7UGF0dGVybn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVBhdHRlcm4gPSAoYmFzZSA9IHt9KSA9PlxuICAoeyBhdHRyaWJ1dGVzOiBbXSwgY2xhc3NlczogW10sIHBzZXVkbzogW10sIGRlc2NlbmRhbnRzOiBbXSwgLi4uYmFzZSB9KVxuXG4vKipcbiAqIENvbnZlcnQgYXR0cmlidXRlcyB0byBDU1Mgc2VsZWN0b3JcbiAqIFxuICogQHBhcmFtIHtBcnJheS48eyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmc/IH0+fSBhdHRyaWJ1dGVzIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGF0dHJpYnV0ZXNUb1NlbGVjdG9yID0gKGF0dHJpYnV0ZXMpID0+XG4gIGF0dHJpYnV0ZXMubWFwKCh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBpZiAobmFtZSA9PT0gJ2lkJykge1xuICAgICAgcmV0dXJuIGAjJHt2YWx1ZX1gXG4gICAgfVxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGBbJHtuYW1lfV1gXG4gICAgfVxuICAgIHJldHVybiBgWyR7bmFtZX09XCIke3ZhbHVlfVwiXWBcbiAgfSkuam9pbignJylcblxuLyoqXG4gKiBDb252ZXJ0IGNsYXNzZXMgdG8gQ1NTIHNlbGVjdG9yXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNsYXNzZXMgXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgY2xhc3Nlc1RvU2VsZWN0b3IgPSAoY2xhc3NlcykgPT4gY2xhc3Nlcy5sZW5ndGggPyBgLiR7Y2xhc3Nlcy5qb2luKCcuJyl9YCA6ICcnXG5cbi8qKlxuICogQ29udmVydCBwc2V1ZG8gc2VsZWN0b3JzIHRvIENTUyBzZWxlY3RvclxuICogXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBwc2V1ZG8gXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgcHNldWRvVG9TZWxlY3RvciA9IChwc2V1ZG8pID0+IHBzZXVkby5sZW5ndGggPyBgOiR7cHNldWRvLmpvaW4oJzonKX1gIDogJydcblxuLyoqXG4gKiBDb252ZXJ0IHBhdHRlcm4gdG8gQ1NTIHNlbGVjdG9yXG4gKiBcbiAqIEBwYXJhbSB7UGF0dGVybn0gcGF0dGVybiBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwYXR0ZXJuVG9TZWxlY3RvciA9IChwYXR0ZXJuKSA9PiB7XG4gIGNvbnN0IHsgcmVsYXRlcywgdGFnLCBhdHRyaWJ1dGVzLCBjbGFzc2VzLCBwc2V1ZG8gfSA9IHBhdHRlcm5cbiAgY29uc3QgdmFsdWUgPSBgJHtcbiAgICByZWxhdGVzID09PSAnY2hpbGQnID8gJz4gJyA6ICcnXG4gIH0ke1xuICAgIHRhZyB8fCAnJ1xuICB9JHtcbiAgICBhdHRyaWJ1dGVzVG9TZWxlY3RvcihhdHRyaWJ1dGVzKVxuICB9JHtcbiAgICBjbGFzc2VzVG9TZWxlY3RvcihjbGFzc2VzKVxuICB9JHtcbiAgICBwc2V1ZG9Ub1NlbGVjdG9yKHBzZXVkbylcbiAgfWBcbiAgcmV0dXJuIHZhbHVlXG59XG5cbi8qKlxuICogQ29udmVydHMgcGF0aCB0byBzdHJpbmdcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwYXRoVG9TZWxlY3RvciA9IChwYXRoKSA9PlxuICBwYXRoLm1hcChwYXR0ZXJuVG9TZWxlY3Rvcikuam9pbignICcpXG5cblxuY29uc3QgY29udmVydEVzY2FwaW5nID0gKHZhbHVlKSA9PlxuICB2YWx1ZSAmJiB2YWx1ZS5yZXBsYWNlKC9cXFxcKFtgXFxcXC86PyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dKS9nLCAnJDEnKVxuICAgIC5yZXBsYWNlKC9cXFxcKFsnXCJdKS9nLCAnJDEkMScpXG4gICAgLnJlcGxhY2UoL1xcXFxBIC9nLCAnXFxuJylcblxuLyoqXG4qIENvbnZlcnQgYXR0cmlidXRlcyB0byBYUGF0aCBzdHJpbmdcbiogXG4qIEBwYXJhbSB7QXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9Pn0gYXR0cmlidXRlcyBcbiogQHJldHVybnMge3N0cmluZ31cbiovXG5leHBvcnQgY29uc3QgYXR0cmlidXRlc1RvWFBhdGggPSAoYXR0cmlidXRlcykgPT5cbiAgYXR0cmlidXRlcy5tYXAoKHsgbmFtZSwgdmFsdWUgfSkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGBbQCR7bmFtZX1dYFxuICAgIH1cbiAgICByZXR1cm4gYFtAJHtuYW1lfT1cIiR7Y29udmVydEVzY2FwaW5nKHZhbHVlKX1cIl1gXG4gIH0pLmpvaW4oJycpXG5cbi8qKlxuKiBDb252ZXJ0IGNsYXNzZXMgdG8gWFBhdGggc3RyaW5nXG4qIFxuKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBjbGFzc2VzVG9YUGF0aCA9IChjbGFzc2VzKSA9PlxuICBjbGFzc2VzLm1hcChjID0+IGBbY29udGFpbnMoY29uY2F0KFwiIFwiLG5vcm1hbGl6ZS1zcGFjZShAY2xhc3MpLFwiIFwiKSxcIiAke2N9IFwiKV1gKS5qb2luKCcnKVxuXG4vKipcbiogQ29udmVydCBwc2V1ZG8gc2VsZWN0b3JzIHRvIFhQYXRoIHN0cmluZ1xuKiBcbiogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gcHNldWRvIFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBwc2V1ZG9Ub1hQYXRoID0gKHBzZXVkbykgPT5cbiAgcHNldWRvLm1hcChwID0+IHtcbiAgICBjb25zdCBtYXRjaCA9IHAubWF0Y2goL14obnRoLWNoaWxkfG50aC1vZi10eXBlfGNvbnRhaW5zKVxcKCguKylcXCkkLylcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG1hdGNoWzFdKSB7XG4gICAgICBjYXNlICdudGgtY2hpbGQnOlxuICAgICAgICByZXR1cm4gYFsoY291bnQocHJlY2VkaW5nLXNpYmxpbmc6OiopKzEpID0gJHttYXRjaFsyXX1dYFxuXG4gICAgICBjYXNlICdudGgtb2YtdHlwZSc6XG4gICAgICAgIHJldHVybiBgWyR7bWF0Y2hbMl19XWBcblxuICAgICAgY2FzZSAnY29udGFpbnMnOlxuICAgICAgICByZXR1cm4gYFtjb250YWlucyh0ZXh0KCksJHttYXRjaFsyXX0pXWBcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9KS5qb2luKCcnKVxuXG4vKipcbiogQ29udmVydCBwYXR0ZXJuIHRvIFhQYXRoIHN0cmluZ1xuKiBcbiogQHBhcmFtIHtQYXR0ZXJufSBwYXR0ZXJuIFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBwYXR0ZXJuVG9YUGF0aCA9IChwYXR0ZXJuKSA9PiB7XG4gIGNvbnN0IHsgcmVsYXRlcywgdGFnLCBhdHRyaWJ1dGVzLCBjbGFzc2VzLCBwc2V1ZG8sIGRlc2NlbmRhbnRzIH0gPSBwYXR0ZXJuXG4gIGNvbnN0IHZhbHVlID0gYCR7XG4gICAgcmVsYXRlcyA9PT0gJ2NoaWxkJyA/ICcvJyA6ICcvLydcbiAgfSR7XG4gICAgdGFnIHx8ICcqJ1xuICB9JHtcbiAgICBhdHRyaWJ1dGVzVG9YUGF0aChhdHRyaWJ1dGVzKVxuICB9JHtcbiAgICBjbGFzc2VzVG9YUGF0aChjbGFzc2VzKVxuICB9JHtcbiAgICBwc2V1ZG9Ub1hQYXRoKHBzZXVkbylcbiAgfSR7XG4gICAgZGVzY2VuZGFudHNUb1hQYXRoKGRlc2NlbmRhbnRzKVxuICB9YFxuICByZXR1cm4gdmFsdWVcbn1cblxuLyoqXG4qIENvbnZlcnRzIHBhdGggdG8gWFBhdGggc3RyaW5nXG4qXG4qIEBwYXJhbSB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoIFxuKiBAcmV0dXJucyB7c3RyaW5nfVxuKi9cbmV4cG9ydCBjb25zdCBwYXRoVG9YUGF0aCA9IChwYXRoKSA9PiBgLiR7cGF0aC5tYXAocGF0dGVyblRvWFBhdGgpLmpvaW4oJycpfWBcblxuLyoqXG4qIENvbnZlcnQgY2hpbGQgc2VsZWN0b3JzIHRvIFhQYXRoIHN0cmluZ1xuKiBcbiogQHBhcmFtIHtBcnJheS48QXJyYXkuPFBhdHRlcm4+Pn0gY2hpbGRyZW4gXG4qIEByZXR1cm5zIHtzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IGRlc2NlbmRhbnRzVG9YUGF0aCA9IChjaGlsZHJlbikgPT5cbiAgY2hpbGRyZW4ubGVuZ3RoID8gYFske2NoaWxkcmVuLm1hcChwYXRoVG9YUGF0aCkuam9pbignXVsnKX1dYCA6ICcnXG5cbiAgXG5jb25zdCB0b1N0cmluZyA9IHtcbiAgJ2Nzcyc6IHtcbiAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzVG9TZWxlY3RvcixcbiAgICBjbGFzc2VzOiBjbGFzc2VzVG9TZWxlY3RvcixcbiAgICBwc2V1ZG86IHBzZXVkb1RvU2VsZWN0b3IsXG4gICAgcGF0dGVybjogcGF0dGVyblRvU2VsZWN0b3IsXG4gICAgcGF0aDogcGF0aFRvU2VsZWN0b3JcbiAgfSxcbiAgJ3hwYXRoJzoge1xuICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXNUb1hQYXRoLFxuICAgIGNsYXNzZXM6IGNsYXNzZXNUb1hQYXRoLFxuICAgIHBzZXVkbzogcHNldWRvVG9YUGF0aCxcbiAgICBwYXR0ZXJuOiBwYXR0ZXJuVG9YUGF0aCxcbiAgICBwYXRoOiBwYXRoVG9YUGF0aFxuICB9LFxuICAnanF1ZXJ5Jzoge31cbn1cblxudG9TdHJpbmcuanF1ZXJ5ID0gdG9TdHJpbmcuY3NzXG50b1N0cmluZ1swXSA9IHRvU3RyaW5nLmNzc1xudG9TdHJpbmdbMV0gPSB0b1N0cmluZy54cGF0aFxuICBcbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IFRvU3RyaW5nQXBpXG4gKiBAcHJvcGVydHkgeyhhdHRyaWJ1dGVzOiBBcnJheS48eyBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmc/IH0+KSA9PiBzdHJpbmd9IGF0dHJpYnV0ZXNcbiAqIEBwcm9wZXJ0eSB7KGNsYXNzZXM6IEFycmF5LjxzdHJpbmc+KSA9PiBzdHJpbmd9ICBjbGFzc2VzXG4gKiBAcHJvcGVydHkgeyhwc2V1ZG86IEFycmF5LjxzdHJpbmc+KSA9PiBzdHJpbmd9ICAgcHNldWRvXG4gKiBAcHJvcGVydHkgeyhwYXR0ZXJuOiBQYXR0ZXJuKSA9PiBzdHJpbmd9ICAgICAgICAgcGF0dGVyblxuICogQHByb3BlcnR5IHsocGF0aDogQXJyYXkuPFBhdHRlcm4+KSA9PiBzdHJpbmd9ICAgIHBhdGhcbiAqL1xuXG4vKipcbiAqIFxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zIFxuICogQHJldHVybnMge1RvU3RyaW5nQXBpfVxuICovXG5leHBvcnQgY29uc3QgZ2V0VG9TdHJpbmcgPSAob3B0aW9ucyA9IHt9KSA9PlxuICB0b1N0cmluZ1tvcHRpb25zLmZvcm1hdCB8fCAnY3NzJ11cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGF0dGVybi5qcyIsIi8vIGltcG9ydCBTaXp6bGUgZnJvbSAnc2l6emxlJ1xubGV0IFNpenpsZVxuXG4vKipcbiAqIFNlbGVjdCBlbGVtZW50IHVzaW5nIGpRdWVyeVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50XG4gKiBAcmV0dXJuIEFycmF5LjxIVE1MRWxlbWVudD5cbiAqL1xuY29uc3Qgc2VsZWN0SlF1ZXJ5ID0gKHNlbGVjdG9yLCBwYXJlbnQgPSBudWxsKSA9PiB7XG4gIGlmICghU2l6emxlKSB7XG4gICAgU2l6emxlID0gcmVxdWlyZSgnc2l6emxlJylcbiAgfVxuICByZXR1cm4gU2l6emxlKHNlbGVjdG9yLCBwYXJlbnQgfHwgZG9jdW1lbnQpXG59XG4gIFxuLyoqXG4gKiBTZWxlY3QgZWxlbWVudCB1c2luZyBYUGF0aFxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50XG4gKiBAcmV0dXJuIEFycmF5LjxIVE1MRWxlbWVudD5cbiAqL1xuY29uc3Qgc2VsZWN0WFBhdGggPSAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpID0+IHtcbiAgcGFyZW50ID0gKHBhcmVudCB8fCBkb2N1bWVudClcbiAgdmFyIGRvYyA9IHBhcmVudFxuICB3aGlsZSAoZG9jLnBhcmVudE5vZGUpIHtcbiAgICBkb2MgPSBkb2MucGFyZW50Tm9kZVxuICB9XG4gIGlmIChkb2MgIT09IHBhcmVudCAmJiAhc2VsZWN0b3Iuc3RhcnRzV2l0aCgnLicpKSB7XG4gICAgc2VsZWN0b3IgPSBgLiR7c2VsZWN0b3J9YFxuICB9XG4gIHZhciBpdGVyYXRvciA9IGRvYy5ldmFsdWF0ZShzZWxlY3RvciwgcGFyZW50LCBudWxsLCAwKVxuICB2YXIgZWxlbWVudHMgPSBbXVxuICB2YXIgZWxlbWVudFxuICB3aGlsZSAoKGVsZW1lbnQgPSBpdGVyYXRvci5pdGVyYXRlTmV4dCgpKSkge1xuICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudClcbiAgfVxuICByZXR1cm4gZWxlbWVudHNcbn1cbiAgXG4vKipcbiAqIFNlbGVjdCBlbGVtZW50IHVzaW5nIENTU1xuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50XG4gKiBAcmV0dXJuIEFycmF5LjxIVE1MRWxlbWVudD5cbiAqL1xuY29uc3Qgc2VsZWN0Q1NTID0gKHNlbGVjdG9yLCBwYXJlbnQgPSBudWxsKSA9PlxuICAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuXG5jb25zdCBzZWxlY3QgPSB7XG4gICdjc3MnOiBzZWxlY3RDU1MsXG4gICd4cGF0aCc6IHNlbGVjdFhQYXRoLFxuICAnanF1ZXJ5Jzogc2VsZWN0SlF1ZXJ5XG59XG5cbnNlbGVjdFswXSA9IHNlbGVjdC5jc3NcbnNlbGVjdFsxXSA9IHNlbGVjdC54cGF0aFxuXG4vKipcbiogXG4qIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyBcbiogQHJldHVybnMgeyhzZWxlY3Rvcjogc3RyaW5nLCBwYXJlbnQ6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmd9XG4qL1xuZXhwb3J0IGNvbnN0IGdldFNlbGVjdCA9IChvcHRpb25zID0ge30pID0+XG4gIChzZWxlY3RvciwgcGFyZW50KSA9PiBzZWxlY3Rbb3B0aW9ucy5mb3JtYXQgfHwgJ2NzcyddKHNlbGVjdG9yLCBwYXJlbnQgfHwgb3B0aW9ucy5yb290KVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VsZWN0b3IuanMiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBjb252ZXJ0Tm9kZUxpc3QgPSAobm9kZXMpID0+IHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG5vZGVzXG4gIGNvbnN0IGFyciA9IG5ldyBBcnJheShsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJbaV0gPSBub2Rlc1tpXVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuLyoqXG4gKiBFc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBsaW5lIGJyZWFrcyBhcyBhIHNpbXBsaWZpZWQgdmVyc2lvbiBvZiAnQ1NTLmVzY2FwZSgpJ1xuICpcbiAqIERlc2NyaXB0aW9uIG9mIHZhbGlkIGNoYXJhY3RlcnM6IGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9jc3MtZXNjYXBlc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZz99IHZhbHVlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBlc2NhcGVWYWx1ZSA9ICh2YWx1ZSkgPT5cbiAgdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvWydcImBcXFxcLzo/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL1xcbi9nLCAnXFx1MDBhMCcpXG5cbi8qKlxuICogUGFydGl0aW9uIGFycmF5IGludG8gdHdvIGdyb3VwcyBkZXRlcm1pbmVkIGJ5IHByZWRpY2F0ZVxuICovXG5leHBvcnQgY29uc3QgcGFydGl0aW9uID0gKGFycmF5LCBwcmVkaWNhdGUpID0+XG4gIGFycmF5LnJlZHVjZShcbiAgICAoW2lubmVyLCBvdXRlcl0sIGl0ZW0pID0+IHByZWRpY2F0ZShpdGVtKSA/IFtpbm5lci5jb25jYXQoaXRlbSksIG91dGVyXSA6IFtpbm5lciwgb3V0ZXIuY29uY2F0KGl0ZW0pXSxcbiAgICBbW10sIFtdXVxuICApXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIENvbW1vblxuICpcbiAqIFByb2Nlc3MgY29sbGVjdGlvbnMgZm9yIHNpbWlsYXJpdGllcy5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICovXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb21tb25BbmNlc3RvciA9IChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSA9PiB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9IFtdXG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwYXJlbnRzID0gW11cbiAgICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCkge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgICAgcGFyZW50cy51bnNoaWZ0KGVsZW1lbnQpXG4gICAgfVxuICAgIGFuY2VzdG9yc1tpbmRleF0gPSBwYXJlbnRzXG4gIH0pXG5cbiAgYW5jZXN0b3JzLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG5cbiAgY29uc3Qgc2hhbGxvd0FuY2VzdG9yID0gYW5jZXN0b3JzLnNoaWZ0KClcblxuICB2YXIgYW5jZXN0b3IgPSBudWxsXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzaGFsbG93QW5jZXN0b3IubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgcGFyZW50ID0gc2hhbGxvd0FuY2VzdG9yW2ldXG4gICAgY29uc3QgbWlzc2luZyA9IGFuY2VzdG9ycy5zb21lKChvdGhlclBhcmVudHMpID0+IHtcbiAgICAgIHJldHVybiAhb3RoZXJQYXJlbnRzLnNvbWUoKG90aGVyUGFyZW50KSA9PiBvdGhlclBhcmVudCA9PT0gcGFyZW50KVxuICAgIH0pXG5cbiAgICBpZiAobWlzc2luZykge1xuICAgICAgLy8gVE9ETzogZmluZCBzaW1pbGFyIHN1Yi1wYXJlbnRzLCBub3QgdGhlIHRvcCByb290LCBlLmcuIHNoYXJpbmcgYSBjbGFzcyBzZWxlY3RvclxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBhbmNlc3RvciA9IHBhcmVudFxuICB9XG5cbiAgcmV0dXJuIGFuY2VzdG9yXG59XG5cbi8qKlxuICogR2V0IGEgc2V0IG9mIGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldENvbW1vblByb3BlcnRpZXMgPSAoZWxlbWVudHMpID0+IHtcblxuICBjb25zdCBjb21tb25Qcm9wZXJ0aWVzID0ge1xuICAgIGNsYXNzZXM6IFtdLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIHRhZzogbnVsbFxuICB9XG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgdmFyIHtcbiAgICAgIGNsYXNzZXM6IGNvbW1vbkNsYXNzZXMsXG4gICAgICBhdHRyaWJ1dGVzOiBjb21tb25BdHRyaWJ1dGVzLFxuICAgICAgdGFnOiBjb21tb25UYWdcbiAgICB9ID0gY29tbW9uUHJvcGVydGllc1xuXG4gICAgLy8gfiBjbGFzc2VzXG4gICAgaWYgKGNvbW1vbkNsYXNzZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICAgICAgaWYgKCFjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25DbGFzc2VzID0gY29tbW9uQ2xhc3Nlcy5maWx0ZXIoKGVudHJ5KSA9PiBjbGFzc2VzLnNvbWUoKG5hbWUpID0+IG5hbWUgPT09IGVudHJ5KSlcbiAgICAgICAgICBpZiAoY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNvbW1vbkNsYXNzZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogcmVzdHJ1Y3R1cmUgcmVtb3ZhbCBhcyAyeCBzZXQgLyAyeCBkZWxldGUsIGluc3RlYWQgb2YgbW9kaWZ5IGFsd2F5cyByZXBsYWNpbmcgd2l0aCBuZXcgY29sbGVjdGlvblxuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiBhdHRyaWJ1dGVzXG4gICAgaWYgKGNvbW1vbkF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZWxlbWVudEF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3Qua2V5cyhlbGVtZW50QXR0cmlidXRlcykucmVkdWNlKChhdHRyaWJ1dGVzLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gZWxlbWVudEF0dHJpYnV0ZXNba2V5XVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICAgICAgLy8gTk9URTogd29ya2Fyb3VuZCBkZXRlY3Rpb24gZm9yIG5vbi1zdGFuZGFyZCBwaGFudG9tanMgTmFtZWROb2RlTWFwIGJlaGF2aW91clxuICAgICAgICAvLyAoaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcml5YS9waGFudG9tanMvaXNzdWVzLzE0NjM0KVxuICAgICAgICBpZiAoYXR0cmlidXRlICYmIGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlLnZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgIH0sIHt9KVxuXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKVxuICAgICAgY29uc3QgY29tbW9uQXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcylcblxuICAgICAgaWYgKGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFjb21tb25BdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChuZXh0Q29tbW9uQXR0cmlidXRlcywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb21tb25BdHRyaWJ1dGVzW25hbWVdXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGF0dHJpYnV0ZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgbmV4dENvbW1vbkF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHRDb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSwge30pXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiB0YWdcbiAgICBpZiAoY29tbW9uVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAoIWNvbW1vblRhZykge1xuICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLnRhZyA9IHRhZ1xuICAgICAgfSBlbHNlIGlmICh0YWcgIT09IGNvbW1vblRhZykge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy50YWdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGNvbW1vblByb3BlcnRpZXNcbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1vbi5qcyIsIi8qKlxuICogIyBNYXRjaFxuICpcbiAqIFJldHJpZXZlIHNlbGVjdG9yIGZvciBhIG5vZGUuXG4gKi9cblxuaW1wb3J0IHsgY3JlYXRlUGF0dGVybiwgZ2V0VG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL3NlbGVjdG9yJ1xuaW1wb3J0IHsgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlRvU3RyaW5nQXBpfSBQYXR0ZXJuXG4gKi9cblxuY29uc3QgZGVmYXVsdElnbm9yZSA9IHtcbiAgYXR0cmlidXRlIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdzdHlsZScsXG4gICAgICAnZGF0YS1yZWFjdGlkJyxcbiAgICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICAgIF0uaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoIChub2RlLCBvcHRpb25zID0ge30pIHtcbiAgb3B0aW9ucyA9IHtcbiAgICByb290OiBkb2N1bWVudCxcbiAgICBza2lwOiBudWxsLFxuICAgIHByaW9yaXR5OiBbJ2lkJywgJ2NsYXNzJywgJ2hyZWYnLCAnc3JjJ10sXG4gICAgaWdub3JlOiB7fSxcbiAgICAuLi5vcHRpb25zXG4gIH1cbiAgY29uc3QgeyByb290LCBza2lwLCBwcmlvcml0eSwgaWdub3JlLCBmb3JtYXQgfSA9IG9wdGlvbnNcblxuICBjb25zdCBwYXRoID0gW11cbiAgbGV0IGVsZW1lbnQgPSBub2RlXG4gIGxldCBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcbiAgY29uc3QgdG9TdHJpbmcgPSBnZXRUb1N0cmluZyhvcHRpb25zKVxuXG4gIGNvbnN0IHNraXBDb21wYXJlID0gc2tpcCAmJiAoQXJyYXkuaXNBcnJheShza2lwKSA/IHNraXAgOiBbc2tpcF0pLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQpID0+IGVsZW1lbnQgPT09IGVudHJ5XG4gICAgfVxuICAgIHJldHVybiBlbnRyeVxuICB9KVxuXG4gIGNvbnN0IHNraXBDaGVja3MgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiBza2lwICYmIHNraXBDb21wYXJlLnNvbWUoKGNvbXBhcmUpID0+IGNvbXBhcmUoZWxlbWVudCkpXG4gIH1cblxuICBPYmplY3Qua2V5cyhpZ25vcmUpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICB2YXIgcHJlZGljYXRlID0gaWdub3JlW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpIHJldHVyblxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcmVkaWNhdGUgPSBuZXcgUmVnRXhwKGVzY2FwZVZhbHVlKHByZWRpY2F0ZSkucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSlcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlID8gLyg/OikvIDogLy5eL1xuICAgIH1cbiAgICAvLyBjaGVjayBjbGFzcy0vYXR0cmlidXRlbmFtZSBmb3IgcmVnZXhcbiAgICBpZ25vcmVbdHlwZV0gPSAobmFtZSwgdmFsdWUpID0+IHByZWRpY2F0ZS50ZXN0KHZhbHVlKVxuICB9KVxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSByb290ICYmIGVsZW1lbnQubm9kZVR5cGUgIT09IDExKSB7XG4gICAgaWYgKHNraXBDaGVja3MoZWxlbWVudCkgIT09IHRydWUpIHtcbiAgICAgIC8vIH4gZ2xvYmFsXG4gICAgICBpZiAoY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgdG9TdHJpbmcsIHJvb3QpKSBicmVha1xuICAgICAgaWYgKGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCB0b1N0cmluZywgcm9vdCkpIGJyZWFrXG5cbiAgICAgIC8vIH4gbG9jYWxcbiAgICAgIGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHRvU3RyaW5nKVxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHRvU3RyaW5nKVxuICAgICAgfVxuXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCAmJiBbMSwgJ3hwYXRoJ10uaW5jbHVkZXMoZm9ybWF0KSkge1xuICAgICAgICBjaGVja1JlY3Vyc2l2ZURlc2NlbmRhbnRzKGVsZW1lbnQsIHBhdGgsIHNlbGVjdCwgdG9TdHJpbmcsIG9wdGlvbnMpXG4gICAgICB9XG5cbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoICYmIFsxLCAneHBhdGgnLCAnanF1ZXJ5J10uaW5jbHVkZXMoZm9ybWF0KSkge1xuICAgICAgICBjaGVja1RleHQocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCB0b1N0cmluZywgZm9ybWF0ID09PSAnanF1ZXJ5JylcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tOdGhDaGlsZChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IHJvb3QpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCB0b1N0cmluZylcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tBdHRyaWJ1dGVzID0gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgdG9TdHJpbmcsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkgPT4ge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCwgdG9TdHJpbmcsIHBhcmVudClcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjb21iaW5hdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gdmFsdWVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48c3RyaW5nPj99ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY29tYmluYXRpb25zID0gKHZhbHVlcykgPT4ge1xuICBsZXQgcmVzdWx0ID0gW1tdXVxuXG4gIHZhbHVlcy5mb3JFYWNoKGMgPT4ge1xuICAgIHJlc3VsdC5mb3JFYWNoKHIgPT4gcmVzdWx0LnB1c2goci5jb25jYXQoYykpKVxuICB9KVxuXG4gIHJlc3VsdC5zaGlmdCgpXG4gIHJldHVybiByZXN1bHRcbn1cblxuLyoqXG4gKiBHZXQgY2xhc3Mgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gY2xhc3NlcyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgYmFzZSAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+P30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBnZXRDbGFzc1NlbGVjdG9yID0gKGNsYXNzZXMgPSBbXSwgc2VsZWN0LCB0b1N0cmluZywgcGFyZW50LCBiYXNlKSA9PiB7XG4gIGxldCByZXN1bHQgPSBjb21iaW5hdGlvbnMoY2xhc3NlcylcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcGF0dGVybiA9IHRvU3RyaW5nLnBhdHRlcm4oeyAuLi5iYXNlLCBjbGFzc2VzOiByZXN1bHRbaV0gfSlcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4sIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByZXN1bHRbaV1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIExvb2t1cCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgdG9TdHJpbmcgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGFyZW50Tm9kZX0gICAgIHBhcmVudCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm4/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGZpbmRBdHRyaWJ1dGVzUGF0dGVybiA9IChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpID0+IHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKHZhbCkgPT4gYXR0cmlidXRlc1t2YWxdLm5hbWUpXG4gICAgLmZpbHRlcigoYSkgPT4gcHJpb3JpdHkuaW5kZXhPZihhKSA8IDApXG5cbiAgdmFyIHNvcnRlZEtleXMgPSBbIC4uLnByaW9yaXR5LCAuLi5hdHRyaWJ1dGVOYW1lcyBdXG4gIHZhciBwYXR0ZXJuID0gY3JlYXRlUGF0dGVybigpXG4gIHBhdHRlcm4udGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcblxuICB2YXIgaXNPcHRpbWFsID0gKHBhdHRlcm4pID0+IChzZWxlY3QodG9TdHJpbmcucGF0dGVybihwYXR0ZXJuKSwgcGFyZW50KS5sZW5ndGggPT09IDEpXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzb3J0ZWRLZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHNvcnRlZEtleXNbaV1cbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlICYmIGF0dHJpYnV0ZS5uYW1lKVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlICYmIGF0dHJpYnV0ZS52YWx1ZSlcbiAgICBjb25zdCB1c2VOYW1lZElnbm9yZSA9IGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcblxuICAgIGNvbnN0IGN1cnJlbnRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgaWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBpZ25vcmUuYXR0cmlidXRlXG4gICAgY29uc3QgY3VycmVudERlZmF1bHRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgZGVmYXVsdElnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgZGVmYXVsdElnbm9yZS5hdHRyaWJ1dGVcbiAgICBpZiAoY2hlY2tJZ25vcmUoY3VycmVudElnbm9yZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGN1cnJlbnREZWZhdWx0SWdub3JlKSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgIGNhc2UgJ2NsYXNzJzoge1xuICAgICAgICBsZXQgY2xhc3NOYW1lcyA9IGF0dHJpYnV0ZVZhbHVlLnRyaW0oKS5zcGxpdCgvXFxzKy9nKVxuICAgICAgICBjb25zdCBjbGFzc0lnbm9yZSA9IGlnbm9yZS5jbGFzcyB8fCBkZWZhdWx0SWdub3JlLmNsYXNzXG4gICAgICAgIGlmIChjbGFzc0lnbm9yZSkge1xuICAgICAgICAgIGNsYXNzTmFtZXMgPSBjbGFzc05hbWVzLmZpbHRlcihjbGFzc05hbWUgPT4gIWNsYXNzSWdub3JlKGNsYXNzTmFtZSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsYXNzTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzTmFtZXMsIHNlbGVjdCwgdG9TdHJpbmcsIHBhcmVudCwgcGF0dGVybilcbiAgICAgICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICAgICAgcGF0dGVybi5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICAgICAgaWYgKGlzT3B0aW1hbChwYXR0ZXJuKSkge1xuICAgICAgICAgICAgICByZXR1cm4gcGF0dGVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBwYXR0ZXJuLmF0dHJpYnV0ZXMucHVzaCh7IG5hbWU6IGF0dHJpYnV0ZU5hbWUsIHZhbHVlOiBhdHRyaWJ1dGVWYWx1ZSB9KVxuICAgICAgICBpZiAoaXNPcHRpbWFsKHBhdHRlcm4pKSB7XG4gICAgICAgICAgcmV0dXJuIHBhdHRlcm5cbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgICBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICBzZWxlY3QgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tUYWcgPSAoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHRvU3RyaW5nLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpID0+IHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBsZXQgbWF0Y2hlcyA9IFtdXG4gICAgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXR0ZXJuKHBhdHRlcm4pLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIGlmIChwYXR0ZXJuLnRhZyA9PT0gJ2lmcmFtZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybj99ICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGZpbmRUYWdQYXR0ZXJuID0gKGVsZW1lbnQsIGlnbm9yZSkgPT4ge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS50YWcsIG51bGwsIHRhZ05hbWUpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBjb25zdCBwYXR0ZXJuID0gY3JlYXRlUGF0dGVybigpXG4gIHBhdHRlcm4udGFnID0gdGFnTmFtZVxuICByZXR1cm4gcGF0dGVyblxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggc3BlY2lmaWMgY2hpbGQgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tOdGhDaGlsZCA9IChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKSA9PiB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBpZiAoY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNoaWxkUGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGNoaWxkLCBpZ25vcmUpXG4gICAgICBpZiAoIWNoaWxkUGF0dGVybikge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgICAgICBFbGVtZW50IGNvdWxkbid0IGJlIG1hdGNoZWQgdGhyb3VnaCBzdHJpY3QgaWdub3JlIHBhdHRlcm4hXG4gICAgICAgIGAsIGNoaWxkLCBpZ25vcmUsIGNoaWxkUGF0dGVybilcbiAgICAgIH1cbiAgICAgIGNoaWxkUGF0dGVybi5yZWxhdGVzID0gJ2NoaWxkJ1xuICAgICAgY2hpbGRQYXR0ZXJuLnBzZXVkbyA9IFtgbnRoLWNoaWxkKCR7aSsxfSlgXVxuICAgICAgcGF0aC51bnNoaWZ0KGNoaWxkUGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggY29udGFpbnNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtib29sZWFufSAgICAgICAgbmVzdGVkICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGNoZWNrVGV4dCA9IChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHRvU3RyaW5nLCBuZXN0ZWQpID0+IHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgY29uc3QgdGV4dENvbnRlbnQgPSAobmVzdGVkID8gZWxlbWVudC50ZXh0Q29udGVudCA6IChlbGVtZW50LmZpcnN0Q2hpbGQgJiYgZWxlbWVudC5maXJzdENoaWxkLm5vZGVWYWx1ZSkgfHwgJycpXG4gIGlmICghdGV4dENvbnRlbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHBhdHRlcm4ucmVsYXRlcyA9ICdjaGlsZCdcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IHRleHRzID0gdGV4dENvbnRlbnRcbiAgICAucmVwbGFjZSgvXFxuKy9nLCAnXFxuJylcbiAgICAuc3BsaXQoJ1xcbicpXG4gICAgLm1hcCh0ZXh0ID0+IHRleHQudHJpbSgpKVxuICAgIC5maWx0ZXIodGV4dCA9PiB0ZXh0Lmxlbmd0aCA+IDApXG5cbiAgY29uc3QgY29udGFpbnMgPSBbXVxuXG4gIHdoaWxlICh0ZXh0cy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgdGV4dCA9IHRleHRzLnNoaWZ0KClcbiAgICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLmNvbnRhaW5zLCBudWxsLCB0ZXh0KSkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gICAgY29udGFpbnMucHVzaChgY29udGFpbnMoXCIke3RleHR9XCIpYClcbiAgXG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXR0ZXJuKHsgLi4ucGF0dGVybiwgcHNldWRvOiBjb250YWlucyB9KSwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0dGVybi5wc2V1ZG8gPSBjb250YWluc1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGRlc2NlbmRhbnQgdGFnXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgdG9TdHJpbmcgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IGNoZWNrUmVjdXJzaXZlRGVzY2VuZGFudHMgPSAoZWxlbWVudCwgcGF0aCwgc2VsZWN0LCB0b1N0cmluZywgb3B0aW9ucykgPT4ge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgb3B0aW9ucy5pZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgZGVzY2VuZGFudHMgPSBBcnJheS5mcm9tKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnKicpKVxuICB3aGlsZSAoZGVzY2VuZGFudHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBkZXNjZW5kYW50cy5zaGlmdCgpXG4gICAgY29uc3QgZGVzY2VuZGFudFBhdGggPSBtYXRjaChkZXNjZW5kYW50LCB7IC4uLm9wdGlvbnMsIHJvb3Q6IGVsZW1lbnQgfSlcbiAgICAvLyBhdm9pZCBkZXNjZW5kYW50IHNlbGVjdG9ycyB3aXRoIG50aC1jaGlsZFxuICAgIGlmICghZGVzY2VuZGFudFBhdGguc29tZShwYXR0ZXJuID0+IHBhdHRlcm4ucHNldWRvLnNvbWUocCA9PiBwLnN0YXJ0c1dpdGgoJ250aC1jaGlsZCcpKSkpIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdCh0b1N0cmluZy5wYXR0ZXJuKHsgLi4ucGF0dGVybiwgZGVzY2VuZGFudHM6IFtkZXNjZW5kYW50UGF0aF0gfSksIHBhcmVudClcbiAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBwYXR0ZXJuLmRlc2NlbmRhbnRzID0gW2Rlc2NlbmRhbnRQYXRoXVxuICAgICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgZmluZFBhdHRlcm4gPSAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICB2YXIgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHRvU3RyaW5nKVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICB9XG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogVmFsaWRhdGUgd2l0aCBjdXN0b20gYW5kIGRlZmF1bHQgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHByZWRpY2F0ZSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgbmFtZSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259IGRlZmF1bHRQcmVkaWNhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgY2hlY2tJZ25vcmUgPSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkgPT4ge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9zZWxlY3RvcidcbmltcG9ydCB7IGNyZWF0ZVBhdHRlcm4sIGdldFRvU3RyaW5nIH0gZnJvbSAnLi9wYXR0ZXJuJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0LCBwYXJ0aXRpb24gfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlRvU3RyaW5nQXBpfSBQYXR0ZXJuXG4gKi9cblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICAgICAgICAgICAgICBwYXRoICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChwYXRoLCBlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgaWYgKHBhdGhbMF0ucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIHBhdGhbMF0ucmVsYXRlcyA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gY29udmVydCBzaW5nbGUgZW50cnkgYW5kIE5vZGVMaXN0XG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9ICFlbGVtZW50cy5sZW5ndGggPyBbZWxlbWVudHNdIDogY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50cy5sZW5ndGggfHwgZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSB0byBjb21wYXJlIEhUTUxFbGVtZW50cyBpdHMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSByZWZlcmVuY2Ugb2YgdGhlIHNlbGVjdGVkIG5vZGUocykhIChtaXNzaW5nIFwiZWxlbWVudHNcIiknKVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG4gIGNvbnN0IHRvU3RyaW5nID0gZ2V0VG9TdHJpbmcob3B0aW9ucylcblxuICBpZiAocGF0aC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gW29wdGltaXplUGFydChbXSwgcGF0aFswXSwgW10sIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKV1cbiAgfVxuXG4gIHZhciBlbmRPcHRpbWl6ZWQgPSBmYWxzZVxuICBpZiAocGF0aFtwYXRoLmxlbmd0aC0xXS5yZWxhdGVzID09PSAnY2hpbGQnKSB7XG4gICAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgW10sIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKVxuICAgIGVuZE9wdGltaXplZCA9IHRydWVcbiAgfVxuXG4gIHBhdGggPSBbLi4ucGF0aF1cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aC5wb3AoKVxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QodG9TdHJpbmcucGF0aChbLi4ucGF0aCwgLi4uc2hvcnRlbmVkXSkpXG4gICAgY29uc3QgaGFzU2FtZVJlc3VsdCA9IG1hdGNoZXMubGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQsIGkpID0+IGVsZW1lbnQgPT09IG1hdGNoZXNbaV0pXG4gICAgaWYgKCFoYXNTYW1lUmVzdWx0KSB7XG4gICAgICBzaG9ydGVuZWQudW5zaGlmdChvcHRpbWl6ZVBhcnQocGF0aCwgY3VycmVudCwgc2hvcnRlbmVkLCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KFtdLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZylcbiAgaWYgKCFlbmRPcHRpbWl6ZWQpIHtcbiAgICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCBbXSwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpXG4gIH1cblxuICByZXR1cm4gcGF0aFxufVxuXG4vKipcbiAqIE9wdGltaXplIDpjb250YWluc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZVRleHQgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICBjb25zdCBbY29udGFpbnMsIG90aGVyXSA9IHBhcnRpdGlvbihjdXJyZW50LnBzZXVkbywgKGl0ZW0pID0+IGl0ZW0uc3RhcnRzV2l0aCgnY29udGFpbnMnKSlcblxuICBpZiAoY29udGFpbnMubGVuZ3RoID4gMCAmJiBwb3N0Lmxlbmd0aCkge1xuICAgIGNvbnN0IGJhc2UgPSB7IC4uLmN1cnJlbnQsIHBzZXVkbzogWy4uLm90aGVyLCAuLi5jb250YWluc10gfVxuICAgIHdoaWxlIChiYXNlLnBzZXVkby5sZW5ndGggPiBvdGhlci5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG9wdGltaXplZCA9IGJhc2UucHNldWRvLnNsaWNlKDAsIC0xKVxuICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhzZWxlY3QodG9TdHJpbmcucGF0aChbLi4ucHJlLCB7IC4uLmJhc2UsIHBzZXVkbzogb3B0aW1pemVkIH0sIC4uLnBvc3RdKSksIGVsZW1lbnRzKSkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgYmFzZS5wc2V1ZG8gPSBvcHRpbWl6ZWRcbiAgICB9XG4gICAgcmV0dXJuIGJhc2VcbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGF0dHJpYnV0ZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVBdHRyaWJ1dGVzID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+IHtcbiAgLy8gcmVkdWNlIGF0dHJpYnV0ZXM6IGZpcnN0IHRyeSB3aXRob3V0IHZhbHVlLCB0aGVuIHJlbW92aW5nIGNvbXBsZXRlbHlcbiAgaWYgKGN1cnJlbnQuYXR0cmlidXRlcy5sZW5ndGggPiAwKSB7XG4gICAgbGV0IGF0dHJpYnV0ZXMgPSBbLi4uY3VycmVudC5hdHRyaWJ1dGVzXVxuXG4gICAgY29uc3Qgc2ltcGxpZnkgPSAob3JpZ2luYWwsIGdldFNpbXBsaWZpZWQpID0+IHtcbiAgICAgIGxldCBpID0gb3JpZ2luYWwubGVuZ3RoIC0gMVxuICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICBsZXQgYXR0cmlidXRlcyA9IGdldFNpbXBsaWZpZWQob3JpZ2luYWwsIGkpXG4gICAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoXG4gICAgICAgICAgc2VsZWN0KHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgeyAuLi5jdXJyZW50LCBhdHRyaWJ1dGVzIH0sIC4uLnBvc3RdKSksXG4gICAgICAgICAgZWxlbWVudHNcbiAgICAgICAgKSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgaS0tXG4gICAgICAgIG9yaWdpbmFsID0gYXR0cmlidXRlc1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yaWdpbmFsXG4gICAgfVxuXG4gICAgY29uc3Qgc2ltcGxpZmllZCA9IHNpbXBsaWZ5KGF0dHJpYnV0ZXMsIChhdHRyaWJ1dGVzLCBpKSA9PiB7XG4gICAgICBjb25zdCB7IG5hbWUgfSA9IGF0dHJpYnV0ZXNbaV1cbiAgICAgIGlmIChuYW1lID09PSAnaWQnKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgICByZXR1cm4gWy4uLmF0dHJpYnV0ZXMuc2xpY2UoMCwgaSksIHsgbmFtZSwgdmFsdWU6IG51bGwgfSwgLi4uYXR0cmlidXRlcy5zbGljZShpICsgMSldXG4gICAgfSlcbiAgICByZXR1cm4geyAuLi5jdXJyZW50LCBhdHRyaWJ1dGVzOiBzaW1wbGlmeShzaW1wbGlmaWVkLCBhdHRyaWJ1dGVzID0+IGF0dHJpYnV0ZXMuc2xpY2UoMCwgLTEpKSB9ICAgIFxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgZGVzY2VuZGFudFxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZURlc2NlbmRhbnQgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKGN1cnJlbnQucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSB7IC4uLmN1cnJlbnQsIHJlbGF0ZXM6IHVuZGVmaW5lZCB9XG4gICAgbGV0IG1hdGNoZXMgPSBzZWxlY3QodG9TdHJpbmcucGF0aChbLi4ucHJlLCBkZXNjZW5kYW50LCAuLi5wb3N0XSkpXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgcmV0dXJuIGRlc2NlbmRhbnRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSByZWN1cnNpdmUgZGVzY2VuZGFudHNcbiAqIFxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcHJlICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHBvc3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1RvU3RyaW5nQXBpfSAgICAgICAgIHRvU3RyaW5nIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmNvbnN0IG9wdGltaXplUmVjdXJzaXZlRGVzY2VuZGFudHMgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICBpZiAoY3VycmVudC5kZXNjZW5kYW50cy5sZW5ndGggPiAwICYmIHBvc3QubGVuZ3RoKSB7XG4gICAgY29uc3QgYmFzZSA9IHsgLi4uY3VycmVudCwgZGVzY2VuZGFudHM6IFsuLi5jdXJyZW50LmRlc2NlbmRhbnRzXSB9XG4gICAgd2hpbGUgKGJhc2UuZGVzY2VuZGFudHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3Qgb3B0aW1pemVkID0gYmFzZS5kZXNjZW5kYW50cy5zbGljZSgwLCAtMSlcbiAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoc2VsZWN0KHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgeyAuLi5iYXNlLCBkZXNjZW5kYW50czogb3B0aW1pemVkIH0sIC4uLnBvc3RdKSksIGVsZW1lbnRzKSkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgYmFzZS5kZXNjZW5kYW50cyA9IG9wdGltaXplZFxuICAgIH1cbiAgICByZXR1cm4gYmFzZVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgbnRoIG9mIHR5cGVcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVOdGhPZlR5cGUgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT4ge1xuICBjb25zdCBpID0gY3VycmVudC5wc2V1ZG8uZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5zdGFydHNXaXRoKCdudGgtY2hpbGQnKSlcbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmIChpID49IDApIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciBjb21wbGV0ZSBjb3ZlcmFnZSBvZiAnbnRoLW9mLXR5cGUnIHJlcGxhY2VtZW50XG4gICAgY29uc3QgdHlwZSA9IGN1cnJlbnQucHNldWRvW2ldLnJlcGxhY2UoL15udGgtY2hpbGQvLCAnbnRoLW9mLXR5cGUnKVxuICAgIGNvbnN0IG50aE9mVHlwZSA9IHsgLi4uY3VycmVudCwgcHNldWRvOiBbLi4uY3VycmVudC5wc2V1ZG8uc2xpY2UoMCwgaSksIHR5cGUsIC4uLmN1cnJlbnQucHNldWRvLnNsaWNlKGkgKyAxKV0gfVxuICAgIGxldCBwYXR0ZXJuID0gdG9TdHJpbmcucGF0aChbLi4ucHJlLCBudGhPZlR5cGUsIC4uLnBvc3RdKVxuICAgIGxldCBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgcmV0dXJuIG50aE9mVHlwZVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIGNsYXNzZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwcmUgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSAgICAgcG9zdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7VG9TdHJpbmdBcGl9ICAgICAgICAgdG9TdHJpbmcgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3Qgb3B0aW1pemVDbGFzc2VzID0gKHByZSwgY3VycmVudCwgcG9zdCwgZWxlbWVudHMsIHNlbGVjdCwgdG9TdHJpbmcpID0+IHtcbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmIChjdXJyZW50LmNsYXNzZXMubGVuZ3RoID4gMSkge1xuICAgIGxldCBvcHRpbWl6ZWQgPSBjdXJyZW50LmNsYXNzZXMuc2xpY2UoKS5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gICAgd2hpbGUgKG9wdGltaXplZC5sZW5ndGggPiAxKSB7XG4gICAgICBvcHRpbWl6ZWQuc2hpZnQoKVxuICAgICAgY29uc3QgcGF0dGVybiA9IHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgeyAuLi5jdXJyZW50LCBjbGFzc2VzOiBvcHRpbWl6ZWQgfSwgLi4ucG9zdF0pXG4gICAgICBpZiAoIWNvbXBhcmVSZXN1bHRzKHNlbGVjdChwYXR0ZXJuKSwgZWxlbWVudHMpKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjdXJyZW50LmNsYXNzZXMgPSBvcHRpbWl6ZWRcbiAgICB9XG5cbiAgICBvcHRpbWl6ZWQgPSBjdXJyZW50LmNsYXNzZXNcblxuICAgIGlmIChvcHRpbWl6ZWQubGVuZ3RoID4gMikge1xuICAgICAgY29uc3QgYmFzZSA9IGNyZWF0ZVBhdHRlcm4oeyBjbGFzc2VzOiBvcHRpbWl6ZWQgfSlcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBzZWxlY3QodG9TdHJpbmcucGF0aChbLi4ucHJlLCBiYXNlXSkpXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlZmVyZW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgLy8gLSBjaGVjayB1c2luZyBhdHRyaWJ1dGVzICsgcmVnYXJkIGV4Y2x1ZGVzXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBjcmVhdGVQYXR0ZXJuKHsgdGFnTmFtZTogcmVmZXJlbmNlLnRhZ05hbWUgfSlcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IHRvU3RyaW5nLnBhdGgoWy4uLnByZSwgY3JlYXRlUGF0dGVybih7IHRhZ05hbWU6IHJlZmVyZW5jZS50YWdOYW1lIH0pLCAuLi5wb3N0XSlcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbmNvbnN0IG9wdGltaXplcnMgPSBbXG4gIG9wdGltaXplVGV4dCxcbiAgb3B0aW1pemVBdHRyaWJ1dGVzLFxuICBvcHRpbWl6ZURlc2NlbmRhbnQsXG4gIG9wdGltaXplUmVjdXJzaXZlRGVzY2VuZGFudHMsXG4gIG9wdGltaXplTnRoT2ZUeXBlLFxuICBvcHRpbWl6ZUNsYXNzZXMsXG5dXG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gICAgIHByZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICBwb3N0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtUb1N0cmluZ0FwaX0gICAgICAgICB0b1N0cmluZyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5jb25zdCBvcHRpbWl6ZVBhcnQgPSAocHJlLCBjdXJyZW50LCBwb3N0LCBlbGVtZW50cywgc2VsZWN0LCB0b1N0cmluZykgPT5cbiAgb3B0aW1pemVycy5yZWR1Y2UoKGFjYywgb3B0aW1pemVyKSA9PiBvcHRpbWl6ZXIocHJlLCBhY2MsIHBvc3QsIGVsZW1lbnRzLCBzZWxlY3QsIHRvU3RyaW5nKSwgY3VycmVudClcblxuLyoqXG4gKiBFdmFsdWF0ZSBtYXRjaGVzIHdpdGggZXhwZWN0ZWQgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBtYXRjaGVzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBjb21wYXJlUmVzdWx0cyA9IChtYXRjaGVzLCBlbGVtZW50cykgPT4ge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbWF0Y2hlc1xuICByZXR1cm4gbGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vcHRpbWl6ZS5qcyIsIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5IHNlbGVjdG9yIHRvIGFjY2VzcyB0aGUgc2VsZWN0ZWQgRE9NIGVsZW1lbnQocykuXG4gKiBGb3IgbG9uZ2V2aXR5IGl0IGFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcy5cbiAqL1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCwgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCB7IGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL3NlbGVjdG9yJ1xuaW1wb3J0IHsgY3JlYXRlUGF0dGVybiwgZ2V0VG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5cbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IFtyb290XSAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgcm9vdCBlbGVtZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uIHwgQXJyYXkuPEhUTUxFbGVtZW50Pn0gW3NraXBdICBTcGVjaWZ5IGVsZW1lbnRzIHRvIHNraXBcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IFtwcmlvcml0eV0gICAgICAgICAgICAgIE9yZGVyIG9mIGF0dHJpYnV0ZSBwcm9jZXNzaW5nXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsIGZ1bmN0aW9uIHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbn0gW2lnbm9yZV0gRGVmaW5lIHBhdHRlcm5zIHdoaWNoIHNob3VsZG4ndCBiZSBpbmNsdWRlZFxuICogQHByb3BlcnR5IHsoJ2Nzcyd8J3hwYXRoJ3wnanF1ZXJ5Jyl9IFtmb3JtYXRdICAgICAgT3V0cHV0IGZvcm1hdCAgICBcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vcGF0dGVybicpLlBhdHRlcm59IFBhdHRlcm5cbiAqL1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPFBhdHRlcm4+fSAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFNpbmdsZVNlbGVjdG9yUGF0aCA9IChlbGVtZW50LCBvcHRpb25zID0ge30pID0+IHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IHBhdGggPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWRQYXRoID0gb3B0aW1pemUocGF0aCwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICAke3BhdGh9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZFBhdGh9XG4gIC8vIGApXG5cbiAgcmV0dXJuIG9wdGltaXplZFBhdGhcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBkZXNjZW5kYW50cyBmcm9tIGFuIGFuY2VzdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdH0gZWxlbWVudHMgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48UGF0dGVybj59ICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgY29uc3QgZ2V0TXVsdGlTZWxlY3RvclBhdGggPSAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIG9ubHkgYW4gQXJyYXkgb2YgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGlzIHN1cHBvcnRlZCEnKVxuICB9XG5cbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG4gIGNvbnN0IHRvU3RyaW5nID0gZ2V0VG9TdHJpbmcob3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclBhdGggPSBtYXRjaChhbmNlc3Rvciwgb3B0aW9ucylcblxuICAvLyBUT0RPOiBjb25zaWRlciB1c2FnZSBvZiBtdWx0aXBsZSBzZWxlY3RvcnMgKyBwYXJlbnQtY2hpbGQgcmVsYXRpb24gKyBjaGVjayBmb3IgcGFydCByZWR1bmRhbmN5XG4gIGNvbnN0IGNvbW1vblBhdGggPSBnZXRDb21tb25QYXRoKGVsZW1lbnRzKVxuICBjb25zdCBkZXNjZW5kYW50UGF0dGVybiA9IGNvbW1vblBhdGhbMF1cblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBvcHRpbWl6ZShbLi4uYW5jZXN0b3JQYXRoLCBkZXNjZW5kYW50UGF0dGVybl0sIGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3Rvck1hdGNoZXMgPSBjb252ZXJ0Tm9kZUxpc3Qoc2VsZWN0KHRvU3RyaW5nLnBhdGgoc2VsZWN0b3JQYXRoKSkpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhbid0IGJlIGVmZmljaWVudGx5IG1hcHBlZC5cbiAgICAgIEl0cyBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhXG4gICAgYCwgZWxlbWVudHMpXG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3JQYXRoXG59XG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuY29uc3QgZ2V0Q29tbW9uUGF0aCA9IChlbGVtZW50cykgPT4ge1xuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICByZXR1cm4gW1xuICAgIGNyZWF0ZVBhdHRlcm4oe1xuICAgICAgdGFnLFxuICAgICAgY2xhc3NlczogY2xhc3NlcyB8fCBbXSxcbiAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMgPyBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKG5hbWUpID0+ICh7XG4gICAgICAgIG5hbWU6IGVzY2FwZVZhbHVlKG5hbWUpLFxuICAgICAgICB2YWx1ZTogZXNjYXBlVmFsdWUoYXR0cmlidXRlc1tuYW1lXSlcbiAgICAgIH0pKSA6IFtdXG4gICAgfSlcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbb3B0aW9uc10gLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgY29uc3QgcGF0aCA9IChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpXG4gICAgPyBnZXRNdWx0aVNlbGVjdG9yUGF0aChpbnB1dCwgb3B0aW9ucylcbiAgICA6IGdldFNpbmdsZVNlbGVjdG9yUGF0aChpbnB1dCwgb3B0aW9ucylcblxuICByZXR1cm4gZ2V0VG9TdHJpbmcob3B0aW9ucykucGF0aChwYXRoKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdC5qcyIsIi8qIVxuICogU2l6emxlIENTUyBTZWxlY3RvciBFbmdpbmUgdjIuMy42XG4gKiBodHRwczovL3NpenpsZWpzLmNvbS9cbiAqXG4gKiBDb3B5cmlnaHQgSlMgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vanMuZm91bmRhdGlvbi9cbiAqXG4gKiBEYXRlOiAyMDIxLTAyLTE2XG4gKi9cbiggZnVuY3Rpb24oIHdpbmRvdyApIHtcbnZhciBpLFxuXHRzdXBwb3J0LFxuXHRFeHByLFxuXHRnZXRUZXh0LFxuXHRpc1hNTCxcblx0dG9rZW5pemUsXG5cdGNvbXBpbGUsXG5cdHNlbGVjdCxcblx0b3V0ZXJtb3N0Q29udGV4dCxcblx0c29ydElucHV0LFxuXHRoYXNEdXBsaWNhdGUsXG5cblx0Ly8gTG9jYWwgZG9jdW1lbnQgdmFyc1xuXHRzZXREb2N1bWVudCxcblx0ZG9jdW1lbnQsXG5cdGRvY0VsZW0sXG5cdGRvY3VtZW50SXNIVE1MLFxuXHRyYnVnZ3lRU0EsXG5cdHJidWdneU1hdGNoZXMsXG5cdG1hdGNoZXMsXG5cdGNvbnRhaW5zLFxuXG5cdC8vIEluc3RhbmNlLXNwZWNpZmljIGRhdGFcblx0ZXhwYW5kbyA9IFwic2l6emxlXCIgKyAxICogbmV3IERhdGUoKSxcblx0cHJlZmVycmVkRG9jID0gd2luZG93LmRvY3VtZW50LFxuXHRkaXJydW5zID0gMCxcblx0ZG9uZSA9IDAsXG5cdGNsYXNzQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHR0b2tlbkNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0Y29tcGlsZXJDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRzb3J0T3JkZXIgPSBmdW5jdGlvbiggYSwgYiApIHtcblx0XHRpZiAoIGEgPT09IGIgKSB7XG5cdFx0XHRoYXNEdXBsaWNhdGUgPSB0cnVlO1xuXHRcdH1cblx0XHRyZXR1cm4gMDtcblx0fSxcblxuXHQvLyBJbnN0YW5jZSBtZXRob2RzXG5cdGhhc093biA9ICgge30gKS5oYXNPd25Qcm9wZXJ0eSxcblx0YXJyID0gW10sXG5cdHBvcCA9IGFyci5wb3AsXG5cdHB1c2hOYXRpdmUgPSBhcnIucHVzaCxcblx0cHVzaCA9IGFyci5wdXNoLFxuXHRzbGljZSA9IGFyci5zbGljZSxcblxuXHQvLyBVc2UgYSBzdHJpcHBlZC1kb3duIGluZGV4T2YgYXMgaXQncyBmYXN0ZXIgdGhhbiBuYXRpdmVcblx0Ly8gaHR0cHM6Ly9qc3BlcmYuY29tL3Rob3ItaW5kZXhvZi12cy1mb3IvNVxuXHRpbmRleE9mID0gZnVuY3Rpb24oIGxpc3QsIGVsZW0gKSB7XG5cdFx0dmFyIGkgPSAwLFxuXHRcdFx0bGVuID0gbGlzdC5sZW5ndGg7XG5cdFx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRpZiAoIGxpc3RbIGkgXSA9PT0gZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIGk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiAtMTtcblx0fSxcblxuXHRib29sZWFucyA9IFwiY2hlY2tlZHxzZWxlY3RlZHxhc3luY3xhdXRvZm9jdXN8YXV0b3BsYXl8Y29udHJvbHN8ZGVmZXJ8ZGlzYWJsZWR8aGlkZGVufFwiICtcblx0XHRcImlzbWFwfGxvb3B8bXVsdGlwbGV8b3BlbnxyZWFkb25seXxyZXF1aXJlZHxzY29wZWRcIixcblxuXHQvLyBSZWd1bGFyIGV4cHJlc3Npb25zXG5cblx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1zZWxlY3RvcnMvI3doaXRlc3BhY2Vcblx0d2hpdGVzcGFjZSA9IFwiW1xcXFx4MjBcXFxcdFxcXFxyXFxcXG5cXFxcZl1cIixcblxuXHQvLyBodHRwczovL3d3dy53My5vcmcvVFIvY3NzLXN5bnRheC0zLyNpZGVudC10b2tlbi1kaWFncmFtXG5cdGlkZW50aWZpZXIgPSBcIig/OlxcXFxcXFxcW1xcXFxkYS1mQS1GXXsxLDZ9XCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIj98XFxcXFxcXFxbXlxcXFxyXFxcXG5cXFxcZl18W1xcXFx3LV18W15cXDAtXFxcXHg3Zl0pK1wiLFxuXG5cdC8vIEF0dHJpYnV0ZSBzZWxlY3RvcnM6IGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jYXR0cmlidXRlLXNlbGVjdG9yc1xuXHRhdHRyaWJ1dGVzID0gXCJcXFxcW1wiICsgd2hpdGVzcGFjZSArIFwiKihcIiArIGlkZW50aWZpZXIgKyBcIikoPzpcIiArIHdoaXRlc3BhY2UgK1xuXG5cdFx0Ly8gT3BlcmF0b3IgKGNhcHR1cmUgMilcblx0XHRcIiooWypeJHwhfl0/PSlcIiArIHdoaXRlc3BhY2UgK1xuXG5cdFx0Ly8gXCJBdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgQ1NTIGlkZW50aWZpZXJzIFtjYXB0dXJlIDVdXG5cdFx0Ly8gb3Igc3RyaW5ncyBbY2FwdHVyZSAzIG9yIGNhcHR1cmUgNF1cIlxuXHRcdFwiKig/OicoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcInwoXCIgKyBpZGVudGlmaWVyICsgXCIpKXwpXCIgK1xuXHRcdHdoaXRlc3BhY2UgKyBcIipcXFxcXVwiLFxuXG5cdHBzZXVkb3MgPSBcIjooXCIgKyBpZGVudGlmaWVyICsgXCIpKD86XFxcXCgoXCIgK1xuXG5cdFx0Ly8gVG8gcmVkdWNlIHRoZSBudW1iZXIgb2Ygc2VsZWN0b3JzIG5lZWRpbmcgdG9rZW5pemUgaW4gdGhlIHByZUZpbHRlciwgcHJlZmVyIGFyZ3VtZW50czpcblx0XHQvLyAxLiBxdW90ZWQgKGNhcHR1cmUgMzsgY2FwdHVyZSA0IG9yIGNhcHR1cmUgNSlcblx0XHRcIignKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCIpfFwiICtcblxuXHRcdC8vIDIuIHNpbXBsZSAoY2FwdHVyZSA2KVxuXHRcdFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcKClbXFxcXF1dfFwiICsgYXR0cmlidXRlcyArIFwiKSopfFwiICtcblxuXHRcdC8vIDMuIGFueXRoaW5nIGVsc2UgKGNhcHR1cmUgMilcblx0XHRcIi4qXCIgK1xuXHRcdFwiKVxcXFwpfClcIixcblxuXHQvLyBMZWFkaW5nIGFuZCBub24tZXNjYXBlZCB0cmFpbGluZyB3aGl0ZXNwYWNlLCBjYXB0dXJpbmcgc29tZSBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXJzIHByZWNlZGluZyB0aGUgbGF0dGVyXG5cdHJ3aGl0ZXNwYWNlID0gbmV3IFJlZ0V4cCggd2hpdGVzcGFjZSArIFwiK1wiLCBcImdcIiApLFxuXHRydHJpbSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiK3woKD86XnxbXlxcXFxcXFxcXSkoPzpcXFxcXFxcXC4pKilcIiArXG5cdFx0d2hpdGVzcGFjZSArIFwiKyRcIiwgXCJnXCIgKSxcblxuXHRyY29tbWEgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiosXCIgKyB3aGl0ZXNwYWNlICsgXCIqXCIgKSxcblx0cmNvbWJpbmF0b3JzID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIqKFs+K35dfFwiICsgd2hpdGVzcGFjZSArIFwiKVwiICsgd2hpdGVzcGFjZSArXG5cdFx0XCIqXCIgKSxcblx0cmRlc2NlbmQgPSBuZXcgUmVnRXhwKCB3aGl0ZXNwYWNlICsgXCJ8PlwiICksXG5cblx0cnBzZXVkbyA9IG5ldyBSZWdFeHAoIHBzZXVkb3MgKSxcblx0cmlkZW50aWZpZXIgPSBuZXcgUmVnRXhwKCBcIl5cIiArIGlkZW50aWZpZXIgKyBcIiRcIiApLFxuXG5cdG1hdGNoRXhwciA9IHtcblx0XHRcIklEXCI6IG5ldyBSZWdFeHAoIFwiXiMoXCIgKyBpZGVudGlmaWVyICsgXCIpXCIgKSxcblx0XHRcIkNMQVNTXCI6IG5ldyBSZWdFeHAoIFwiXlxcXFwuKFwiICsgaWRlbnRpZmllciArIFwiKVwiICksXG5cdFx0XCJUQUdcIjogbmV3IFJlZ0V4cCggXCJeKFwiICsgaWRlbnRpZmllciArIFwifFsqXSlcIiApLFxuXHRcdFwiQVRUUlwiOiBuZXcgUmVnRXhwKCBcIl5cIiArIGF0dHJpYnV0ZXMgKSxcblx0XHRcIlBTRVVET1wiOiBuZXcgUmVnRXhwKCBcIl5cIiArIHBzZXVkb3MgKSxcblx0XHRcIkNISUxEXCI6IG5ldyBSZWdFeHAoIFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIiArXG5cdFx0XHR3aGl0ZXNwYWNlICsgXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIiArIHdoaXRlc3BhY2UgKyBcIiooPzooWystXXwpXCIgK1xuXHRcdFx0d2hpdGVzcGFjZSArIFwiKihcXFxcZCspfCkpXCIgKyB3aGl0ZXNwYWNlICsgXCIqXFxcXCl8KVwiLCBcImlcIiApLFxuXHRcdFwiYm9vbFwiOiBuZXcgUmVnRXhwKCBcIl4oPzpcIiArIGJvb2xlYW5zICsgXCIpJFwiLCBcImlcIiApLFxuXG5cdFx0Ly8gRm9yIHVzZSBpbiBsaWJyYXJpZXMgaW1wbGVtZW50aW5nIC5pcygpXG5cdFx0Ly8gV2UgdXNlIHRoaXMgZm9yIFBPUyBtYXRjaGluZyBpbiBgc2VsZWN0YFxuXHRcdFwibmVlZHNDb250ZXh0XCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcIipbPit+XXw6KGV2ZW58b2RkfGVxfGd0fGx0fG50aHxmaXJzdHxsYXN0KSg/OlxcXFwoXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKigoPzotXFxcXGQpP1xcXFxkKilcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpKD89W14tXXwkKVwiLCBcImlcIiApXG5cdH0sXG5cblx0cmh0bWwgPSAvSFRNTCQvaSxcblx0cmlucHV0cyA9IC9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2ksXG5cdHJoZWFkZXIgPSAvXmhcXGQkL2ksXG5cblx0cm5hdGl2ZSA9IC9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXG5cblx0Ly8gRWFzaWx5LXBhcnNlYWJsZS9yZXRyaWV2YWJsZSBJRCBvciBUQUcgb3IgQ0xBU1Mgc2VsZWN0b3JzXG5cdHJxdWlja0V4cHIgPSAvXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyxcblxuXHRyc2libGluZyA9IC9bK35dLyxcblxuXHQvLyBDU1MgZXNjYXBlc1xuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9DU1MyMS9zeW5kYXRhLmh0bWwjZXNjYXBlZC1jaGFyYWN0ZXJzXG5cdHJ1bmVzY2FwZSA9IG5ldyBSZWdFeHAoIFwiXFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIiArIHdoaXRlc3BhY2UgKyBcIj98XFxcXFxcXFwoW15cXFxcclxcXFxuXFxcXGZdKVwiLCBcImdcIiApLFxuXHRmdW5lc2NhcGUgPSBmdW5jdGlvbiggZXNjYXBlLCBub25IZXggKSB7XG5cdFx0dmFyIGhpZ2ggPSBcIjB4XCIgKyBlc2NhcGUuc2xpY2UoIDEgKSAtIDB4MTAwMDA7XG5cblx0XHRyZXR1cm4gbm9uSGV4ID9cblxuXHRcdFx0Ly8gU3RyaXAgdGhlIGJhY2tzbGFzaCBwcmVmaXggZnJvbSBhIG5vbi1oZXggZXNjYXBlIHNlcXVlbmNlXG5cdFx0XHRub25IZXggOlxuXG5cdFx0XHQvLyBSZXBsYWNlIGEgaGV4YWRlY2ltYWwgZXNjYXBlIHNlcXVlbmNlIHdpdGggdGhlIGVuY29kZWQgVW5pY29kZSBjb2RlIHBvaW50XG5cdFx0XHQvLyBTdXBwb3J0OiBJRSA8PTExK1xuXHRcdFx0Ly8gRm9yIHZhbHVlcyBvdXRzaWRlIHRoZSBCYXNpYyBNdWx0aWxpbmd1YWwgUGxhbmUgKEJNUCksIG1hbnVhbGx5IGNvbnN0cnVjdCBhXG5cdFx0XHQvLyBzdXJyb2dhdGUgcGFpclxuXHRcdFx0aGlnaCA8IDAgP1xuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoICsgMHgxMDAwMCApIDpcblx0XHRcdFx0U3RyaW5nLmZyb21DaGFyQ29kZSggaGlnaCA+PiAxMCB8IDB4RDgwMCwgaGlnaCAmIDB4M0ZGIHwgMHhEQzAwICk7XG5cdH0sXG5cblx0Ly8gQ1NTIHN0cmluZy9pZGVudGlmaWVyIHNlcmlhbGl6YXRpb25cblx0Ly8gaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzc29tLyNjb21tb24tc2VyaWFsaXppbmctaWRpb21zXG5cdHJjc3Nlc2NhcGUgPSAvKFtcXDAtXFx4MWZcXHg3Zl18Xi0/XFxkKXxeLSR8W15cXDAtXFx4MWZcXHg3Zi1cXHVGRkZGXFx3LV0vZyxcblx0ZmNzc2VzY2FwZSA9IGZ1bmN0aW9uKCBjaCwgYXNDb2RlUG9pbnQgKSB7XG5cdFx0aWYgKCBhc0NvZGVQb2ludCApIHtcblxuXHRcdFx0Ly8gVSswMDAwIE5VTEwgYmVjb21lcyBVK0ZGRkQgUkVQTEFDRU1FTlQgQ0hBUkFDVEVSXG5cdFx0XHRpZiAoIGNoID09PSBcIlxcMFwiICkge1xuXHRcdFx0XHRyZXR1cm4gXCJcXHVGRkZEXCI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbnRyb2wgY2hhcmFjdGVycyBhbmQgKGRlcGVuZGVudCB1cG9uIHBvc2l0aW9uKSBudW1iZXJzIGdldCBlc2NhcGVkIGFzIGNvZGUgcG9pbnRzXG5cdFx0XHRyZXR1cm4gY2guc2xpY2UoIDAsIC0xICkgKyBcIlxcXFxcIiArXG5cdFx0XHRcdGNoLmNoYXJDb2RlQXQoIGNoLmxlbmd0aCAtIDEgKS50b1N0cmluZyggMTYgKSArIFwiIFwiO1xuXHRcdH1cblxuXHRcdC8vIE90aGVyIHBvdGVudGlhbGx5LXNwZWNpYWwgQVNDSUkgY2hhcmFjdGVycyBnZXQgYmFja3NsYXNoLWVzY2FwZWRcblx0XHRyZXR1cm4gXCJcXFxcXCIgKyBjaDtcblx0fSxcblxuXHQvLyBVc2VkIGZvciBpZnJhbWVzXG5cdC8vIFNlZSBzZXREb2N1bWVudCgpXG5cdC8vIFJlbW92aW5nIHRoZSBmdW5jdGlvbiB3cmFwcGVyIGNhdXNlcyBhIFwiUGVybWlzc2lvbiBEZW5pZWRcIlxuXHQvLyBlcnJvciBpbiBJRVxuXHR1bmxvYWRIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0c2V0RG9jdW1lbnQoKTtcblx0fSxcblxuXHRpbkRpc2FibGVkRmllbGRzZXQgPSBhZGRDb21iaW5hdG9yKFxuXHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IHRydWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImZpZWxkc2V0XCI7XG5cdFx0fSxcblx0XHR7IGRpcjogXCJwYXJlbnROb2RlXCIsIG5leHQ6IFwibGVnZW5kXCIgfVxuXHQpO1xuXG4vLyBPcHRpbWl6ZSBmb3IgcHVzaC5hcHBseSggXywgTm9kZUxpc3QgKVxudHJ5IHtcblx0cHVzaC5hcHBseShcblx0XHQoIGFyciA9IHNsaWNlLmNhbGwoIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzICkgKSxcblx0XHRwcmVmZXJyZWREb2MuY2hpbGROb2Rlc1xuXHQpO1xuXG5cdC8vIFN1cHBvcnQ6IEFuZHJvaWQ8NC4wXG5cdC8vIERldGVjdCBzaWxlbnRseSBmYWlsaW5nIHB1c2guYXBwbHlcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRhcnJbIHByZWZlcnJlZERvYy5jaGlsZE5vZGVzLmxlbmd0aCBdLm5vZGVUeXBlO1xufSBjYXRjaCAoIGUgKSB7XG5cdHB1c2ggPSB7IGFwcGx5OiBhcnIubGVuZ3RoID9cblxuXHRcdC8vIExldmVyYWdlIHNsaWNlIGlmIHBvc3NpYmxlXG5cdFx0ZnVuY3Rpb24oIHRhcmdldCwgZWxzICkge1xuXHRcdFx0cHVzaE5hdGl2ZS5hcHBseSggdGFyZ2V0LCBzbGljZS5jYWxsKCBlbHMgKSApO1xuXHRcdH0gOlxuXG5cdFx0Ly8gU3VwcG9ydDogSUU8OVxuXHRcdC8vIE90aGVyd2lzZSBhcHBlbmQgZGlyZWN0bHlcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHR2YXIgaiA9IHRhcmdldC5sZW5ndGgsXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHQvLyBDYW4ndCB0cnVzdCBOb2RlTGlzdC5sZW5ndGhcblx0XHRcdHdoaWxlICggKCB0YXJnZXRbIGorKyBdID0gZWxzWyBpKysgXSApICkge31cblx0XHRcdHRhcmdldC5sZW5ndGggPSBqIC0gMTtcblx0XHR9XG5cdH07XG59XG5cbmZ1bmN0aW9uIFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBtLCBpLCBlbGVtLCBuaWQsIG1hdGNoLCBncm91cHMsIG5ld1NlbGVjdG9yLFxuXHRcdG5ld0NvbnRleHQgPSBjb250ZXh0ICYmIGNvbnRleHQub3duZXJEb2N1bWVudCxcblxuXHRcdC8vIG5vZGVUeXBlIGRlZmF1bHRzIHRvIDksIHNpbmNlIGNvbnRleHQgZGVmYXVsdHMgdG8gZG9jdW1lbnRcblx0XHRub2RlVHlwZSA9IGNvbnRleHQgPyBjb250ZXh0Lm5vZGVUeXBlIDogOTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBSZXR1cm4gZWFybHkgZnJvbSBjYWxscyB3aXRoIGludmFsaWQgc2VsZWN0b3Igb3IgY29udGV4dFxuXHRpZiAoIHR5cGVvZiBzZWxlY3RvciAhPT0gXCJzdHJpbmdcIiB8fCAhc2VsZWN0b3IgfHxcblx0XHRub2RlVHlwZSAhPT0gMSAmJiBub2RlVHlwZSAhPT0gOSAmJiBub2RlVHlwZSAhPT0gMTEgKSB7XG5cblx0XHRyZXR1cm4gcmVzdWx0cztcblx0fVxuXG5cdC8vIFRyeSB0byBzaG9ydGN1dCBmaW5kIG9wZXJhdGlvbnMgKGFzIG9wcG9zZWQgdG8gZmlsdGVycykgaW4gSFRNTCBkb2N1bWVudHNcblx0aWYgKCAhc2VlZCApIHtcblx0XHRzZXREb2N1bWVudCggY29udGV4dCApO1xuXHRcdGNvbnRleHQgPSBjb250ZXh0IHx8IGRvY3VtZW50O1xuXG5cdFx0aWYgKCBkb2N1bWVudElzSFRNTCApIHtcblxuXHRcdFx0Ly8gSWYgdGhlIHNlbGVjdG9yIGlzIHN1ZmZpY2llbnRseSBzaW1wbGUsIHRyeSB1c2luZyBhIFwiZ2V0KkJ5KlwiIERPTSBtZXRob2Rcblx0XHRcdC8vIChleGNlcHRpbmcgRG9jdW1lbnRGcmFnbWVudCBjb250ZXh0LCB3aGVyZSB0aGUgbWV0aG9kcyBkb24ndCBleGlzdClcblx0XHRcdGlmICggbm9kZVR5cGUgIT09IDExICYmICggbWF0Y2ggPSBycXVpY2tFeHByLmV4ZWMoIHNlbGVjdG9yICkgKSApIHtcblxuXHRcdFx0XHQvLyBJRCBzZWxlY3RvclxuXHRcdFx0XHRpZiAoICggbSA9IG1hdGNoWyAxIF0gKSApIHtcblxuXHRcdFx0XHRcdC8vIERvY3VtZW50IGNvbnRleHRcblx0XHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSA5ICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSwgT3BlcmEsIFdlYmtpdFxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBpZGVudGlmeSB2ZXJzaW9uc1xuXHRcdFx0XHRcdFx0XHQvLyBnZXRFbGVtZW50QnlJZCBjYW4gbWF0Y2ggZWxlbWVudHMgYnkgbmFtZSBpbnN0ZWFkIG9mIElEXG5cdFx0XHRcdFx0XHRcdGlmICggZWxlbS5pZCA9PT0gbSApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBFbGVtZW50IGNvbnRleHRcblx0XHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSwgT3BlcmEsIFdlYmtpdFxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogaWRlbnRpZnkgdmVyc2lvbnNcblx0XHRcdFx0XHRcdC8vIGdldEVsZW1lbnRCeUlkIGNhbiBtYXRjaCBlbGVtZW50cyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdGlmICggbmV3Q29udGV4dCAmJiAoIGVsZW0gPSBuZXdDb250ZXh0LmdldEVsZW1lbnRCeUlkKCBtICkgKSAmJlxuXHRcdFx0XHRcdFx0XHRjb250YWlucyggY29udGV4dCwgZWxlbSApICYmXG5cdFx0XHRcdFx0XHRcdGVsZW0uaWQgPT09IG0gKSB7XG5cblx0XHRcdFx0XHRcdFx0cmVzdWx0cy5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUeXBlIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWyAyIF0gKSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSggc2VsZWN0b3IgKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHRcdC8vIENsYXNzIHNlbGVjdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoICggbSA9IG1hdGNoWyAzIF0gKSAmJiBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiZcblx0XHRcdFx0XHRjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgKSB7XG5cblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIG0gKSApO1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFRha2UgYWR2YW50YWdlIG9mIHF1ZXJ5U2VsZWN0b3JBbGxcblx0XHRcdGlmICggc3VwcG9ydC5xc2EgJiZcblx0XHRcdFx0IW5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXSAmJlxuXHRcdFx0XHQoICFyYnVnZ3lRU0EgfHwgIXJidWdneVFTQS50ZXN0KCBzZWxlY3RvciApICkgJiZcblxuXHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA4IG9ubHlcblx0XHRcdFx0Ly8gRXhjbHVkZSBvYmplY3QgZWxlbWVudHNcblx0XHRcdFx0KCBub2RlVHlwZSAhPT0gMSB8fCBjb250ZXh0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwib2JqZWN0XCIgKSApIHtcblxuXHRcdFx0XHRuZXdTZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRuZXdDb250ZXh0ID0gY29udGV4dDtcblxuXHRcdFx0XHQvLyBxU0EgY29uc2lkZXJzIGVsZW1lbnRzIG91dHNpZGUgYSBzY29waW5nIHJvb3Qgd2hlbiBldmFsdWF0aW5nIGNoaWxkIG9yXG5cdFx0XHRcdC8vIGRlc2NlbmRhbnQgY29tYmluYXRvcnMsIHdoaWNoIGlzIG5vdCB3aGF0IHdlIHdhbnQuXG5cdFx0XHRcdC8vIEluIHN1Y2ggY2FzZXMsIHdlIHdvcmsgYXJvdW5kIHRoZSBiZWhhdmlvciBieSBwcmVmaXhpbmcgZXZlcnkgc2VsZWN0b3IgaW4gdGhlXG5cdFx0XHRcdC8vIGxpc3Qgd2l0aCBhbiBJRCBzZWxlY3RvciByZWZlcmVuY2luZyB0aGUgc2NvcGUgY29udGV4dC5cblx0XHRcdFx0Ly8gVGhlIHRlY2huaXF1ZSBoYXMgdG8gYmUgdXNlZCBhcyB3ZWxsIHdoZW4gYSBsZWFkaW5nIGNvbWJpbmF0b3IgaXMgdXNlZFxuXHRcdFx0XHQvLyBhcyBzdWNoIHNlbGVjdG9ycyBhcmUgbm90IHJlY29nbml6ZWQgYnkgcXVlcnlTZWxlY3RvckFsbC5cblx0XHRcdFx0Ly8gVGhhbmtzIHRvIEFuZHJldyBEdXBvbnQgZm9yIHRoaXMgdGVjaG5pcXVlLlxuXHRcdFx0XHRpZiAoIG5vZGVUeXBlID09PSAxICYmXG5cdFx0XHRcdFx0KCByZGVzY2VuZC50ZXN0KCBzZWxlY3RvciApIHx8IHJjb21iaW5hdG9ycy50ZXN0KCBzZWxlY3RvciApICkgKSB7XG5cblx0XHRcdFx0XHQvLyBFeHBhbmQgY29udGV4dCBmb3Igc2libGluZyBzZWxlY3RvcnNcblx0XHRcdFx0XHRuZXdDb250ZXh0ID0gcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHQ7XG5cblx0XHRcdFx0XHQvLyBXZSBjYW4gdXNlIDpzY29wZSBpbnN0ZWFkIG9mIHRoZSBJRCBoYWNrIGlmIHRoZSBicm93c2VyXG5cdFx0XHRcdFx0Ly8gc3VwcG9ydHMgaXQgJiBpZiB3ZSdyZSBub3QgY2hhbmdpbmcgdGhlIGNvbnRleHQuXG5cdFx0XHRcdFx0aWYgKCBuZXdDb250ZXh0ICE9PSBjb250ZXh0IHx8ICFzdXBwb3J0LnNjb3BlICkge1xuXG5cdFx0XHRcdFx0XHQvLyBDYXB0dXJlIHRoZSBjb250ZXh0IElELCBzZXR0aW5nIGl0IGZpcnN0IGlmIG5lY2Vzc2FyeVxuXHRcdFx0XHRcdFx0aWYgKCAoIG5pZCA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKCBcImlkXCIgKSApICkge1xuXHRcdFx0XHRcdFx0XHRuaWQgPSBuaWQucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0Y29udGV4dC5zZXRBdHRyaWJ1dGUoIFwiaWRcIiwgKCBuaWQgPSBleHBhbmRvICkgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBQcmVmaXggZXZlcnkgc2VsZWN0b3IgaW4gdGhlIGxpc3Rcblx0XHRcdFx0XHRncm91cHMgPSB0b2tlbml6ZSggc2VsZWN0b3IgKTtcblx0XHRcdFx0XHRpID0gZ3JvdXBzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGdyb3Vwc1sgaSBdID0gKCBuaWQgPyBcIiNcIiArIG5pZCA6IFwiOnNjb3BlXCIgKSArIFwiIFwiICtcblx0XHRcdFx0XHRcdFx0dG9TZWxlY3RvciggZ3JvdXBzWyBpIF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bmV3U2VsZWN0b3IgPSBncm91cHMuam9pbiggXCIsXCIgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cyxcblx0XHRcdFx0XHRcdG5ld0NvbnRleHQucXVlcnlTZWxlY3RvckFsbCggbmV3U2VsZWN0b3IgKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH0gY2F0Y2ggKCBxc2FFcnJvciApIHtcblx0XHRcdFx0XHRub25uYXRpdmVTZWxlY3RvckNhY2hlKCBzZWxlY3RvciwgdHJ1ZSApO1xuXHRcdFx0XHR9IGZpbmFsbHkge1xuXHRcdFx0XHRcdGlmICggbmlkID09PSBleHBhbmRvICkge1xuXHRcdFx0XHRcdFx0Y29udGV4dC5yZW1vdmVBdHRyaWJ1dGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIEFsbCBvdGhlcnNcblx0cmV0dXJuIHNlbGVjdCggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICk7XG59XG5cbi8qKlxuICogQ3JlYXRlIGtleS12YWx1ZSBjYWNoZXMgb2YgbGltaXRlZCBzaXplXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb24oc3RyaW5nLCBvYmplY3QpfSBSZXR1cm5zIHRoZSBPYmplY3QgZGF0YSBhZnRlciBzdG9yaW5nIGl0IG9uIGl0c2VsZiB3aXRoXG4gKlx0cHJvcGVydHkgbmFtZSB0aGUgKHNwYWNlLXN1ZmZpeGVkKSBzdHJpbmcgYW5kIChpZiB0aGUgY2FjaGUgaXMgbGFyZ2VyIHRoYW4gRXhwci5jYWNoZUxlbmd0aClcbiAqXHRkZWxldGluZyB0aGUgb2xkZXN0IGVudHJ5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUNhY2hlKCkge1xuXHR2YXIga2V5cyA9IFtdO1xuXG5cdGZ1bmN0aW9uIGNhY2hlKCBrZXksIHZhbHVlICkge1xuXG5cdFx0Ly8gVXNlIChrZXkgKyBcIiBcIikgdG8gYXZvaWQgY29sbGlzaW9uIHdpdGggbmF0aXZlIHByb3RvdHlwZSBwcm9wZXJ0aWVzIChzZWUgSXNzdWUgIzE1Nylcblx0XHRpZiAoIGtleXMucHVzaCgga2V5ICsgXCIgXCIgKSA+IEV4cHIuY2FjaGVMZW5ndGggKSB7XG5cblx0XHRcdC8vIE9ubHkga2VlcCB0aGUgbW9zdCByZWNlbnQgZW50cmllc1xuXHRcdFx0ZGVsZXRlIGNhY2hlWyBrZXlzLnNoaWZ0KCkgXTtcblx0XHR9XG5cdFx0cmV0dXJuICggY2FjaGVbIGtleSArIFwiIFwiIF0gPSB2YWx1ZSApO1xuXHR9XG5cdHJldHVybiBjYWNoZTtcbn1cblxuLyoqXG4gKiBNYXJrIGEgZnVuY3Rpb24gZm9yIHNwZWNpYWwgdXNlIGJ5IFNpenpsZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIG1hcmtcbiAqL1xuZnVuY3Rpb24gbWFya0Z1bmN0aW9uKCBmbiApIHtcblx0Zm5bIGV4cGFuZG8gXSA9IHRydWU7XG5cdHJldHVybiBmbjtcbn1cblxuLyoqXG4gKiBTdXBwb3J0IHRlc3RpbmcgdXNpbmcgYW4gZWxlbWVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gUGFzc2VkIHRoZSBjcmVhdGVkIGVsZW1lbnQgYW5kIHJldHVybnMgYSBib29sZWFuIHJlc3VsdFxuICovXG5mdW5jdGlvbiBhc3NlcnQoIGZuICkge1xuXHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImZpZWxkc2V0XCIgKTtcblxuXHR0cnkge1xuXHRcdHJldHVybiAhIWZuKCBlbCApO1xuXHR9IGNhdGNoICggZSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0gZmluYWxseSB7XG5cblx0XHQvLyBSZW1vdmUgZnJvbSBpdHMgcGFyZW50IGJ5IGRlZmF1bHRcblx0XHRpZiAoIGVsLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBlbCApO1xuXHRcdH1cblxuXHRcdC8vIHJlbGVhc2UgbWVtb3J5IGluIElFXG5cdFx0ZWwgPSBudWxsO1xuXHR9XG59XG5cbi8qKlxuICogQWRkcyB0aGUgc2FtZSBoYW5kbGVyIGZvciBhbGwgb2YgdGhlIHNwZWNpZmllZCBhdHRyc1xuICogQHBhcmFtIHtTdHJpbmd9IGF0dHJzIFBpcGUtc2VwYXJhdGVkIGxpc3Qgb2YgYXR0cmlidXRlc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlciBUaGUgbWV0aG9kIHRoYXQgd2lsbCBiZSBhcHBsaWVkXG4gKi9cbmZ1bmN0aW9uIGFkZEhhbmRsZSggYXR0cnMsIGhhbmRsZXIgKSB7XG5cdHZhciBhcnIgPSBhdHRycy5zcGxpdCggXCJ8XCIgKSxcblx0XHRpID0gYXJyLmxlbmd0aDtcblxuXHR3aGlsZSAoIGktLSApIHtcblx0XHRFeHByLmF0dHJIYW5kbGVbIGFyclsgaSBdIF0gPSBoYW5kbGVyO1xuXHR9XG59XG5cbi8qKlxuICogQ2hlY2tzIGRvY3VtZW50IG9yZGVyIG9mIHR3byBzaWJsaW5nc1xuICogQHBhcmFtIHtFbGVtZW50fSBhXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGJcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFJldHVybnMgbGVzcyB0aGFuIDAgaWYgYSBwcmVjZWRlcyBiLCBncmVhdGVyIHRoYW4gMCBpZiBhIGZvbGxvd3MgYlxuICovXG5mdW5jdGlvbiBzaWJsaW5nQ2hlY2soIGEsIGIgKSB7XG5cdHZhciBjdXIgPSBiICYmIGEsXG5cdFx0ZGlmZiA9IGN1ciAmJiBhLm5vZGVUeXBlID09PSAxICYmIGIubm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdGEuc291cmNlSW5kZXggLSBiLnNvdXJjZUluZGV4O1xuXG5cdC8vIFVzZSBJRSBzb3VyY2VJbmRleCBpZiBhdmFpbGFibGUgb24gYm90aCBub2Rlc1xuXHRpZiAoIGRpZmYgKSB7XG5cdFx0cmV0dXJuIGRpZmY7XG5cdH1cblxuXHQvLyBDaGVjayBpZiBiIGZvbGxvd3MgYVxuXHRpZiAoIGN1ciApIHtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLm5leHRTaWJsaW5nICkgKSB7XG5cdFx0XHRpZiAoIGN1ciA9PT0gYiApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBhID8gMSA6IC0xO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgaW5wdXQgdHlwZXNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0UHNldWRvKCB0eXBlICkge1xuXHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IHR5cGU7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBidXR0b25zXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICovXG5mdW5jdGlvbiBjcmVhdGVCdXR0b25Qc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gKCBuYW1lID09PSBcImlucHV0XCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIiApICYmIGVsZW0udHlwZSA9PT0gdHlwZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIDplbmFibGVkLzpkaXNhYmxlZFxuICogQHBhcmFtIHtCb29sZWFufSBkaXNhYmxlZCB0cnVlIGZvciA6ZGlzYWJsZWQ7IGZhbHNlIGZvciA6ZW5hYmxlZFxuICovXG5mdW5jdGlvbiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggZGlzYWJsZWQgKSB7XG5cblx0Ly8gS25vd24gOmRpc2FibGVkIGZhbHNlIHBvc2l0aXZlczogZmllbGRzZXRbZGlzYWJsZWRdID4gbGVnZW5kOm50aC1vZi10eXBlKG4rMikgOmNhbi1kaXNhYmxlXG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdC8vIE9ubHkgY2VydGFpbiBlbGVtZW50cyBjYW4gbWF0Y2ggOmVuYWJsZWQgb3IgOmRpc2FibGVkXG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2NyaXB0aW5nLmh0bWwjc2VsZWN0b3ItZW5hYmxlZFxuXHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3NjcmlwdGluZy5odG1sI3NlbGVjdG9yLWRpc2FibGVkXG5cdFx0aWYgKCBcImZvcm1cIiBpbiBlbGVtICkge1xuXG5cdFx0XHQvLyBDaGVjayBmb3IgaW5oZXJpdGVkIGRpc2FibGVkbmVzcyBvbiByZWxldmFudCBub24tZGlzYWJsZWQgZWxlbWVudHM6XG5cdFx0XHQvLyAqIGxpc3RlZCBmb3JtLWFzc29jaWF0ZWQgZWxlbWVudHMgaW4gYSBkaXNhYmxlZCBmaWVsZHNldFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NhdGVnb3J5LWxpc3RlZFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NvbmNlcHQtZmUtZGlzYWJsZWRcblx0XHRcdC8vICogb3B0aW9uIGVsZW1lbnRzIGluIGEgZGlzYWJsZWQgb3B0Z3JvdXBcblx0XHRcdC8vICAgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZm9ybXMuaHRtbCNjb25jZXB0LW9wdGlvbi1kaXNhYmxlZFxuXHRcdFx0Ly8gQWxsIHN1Y2ggZWxlbWVudHMgaGF2ZSBhIFwiZm9ybVwiIHByb3BlcnR5LlxuXHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgJiYgZWxlbS5kaXNhYmxlZCA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0Ly8gT3B0aW9uIGVsZW1lbnRzIGRlZmVyIHRvIGEgcGFyZW50IG9wdGdyb3VwIGlmIHByZXNlbnRcblx0XHRcdFx0aWYgKCBcImxhYmVsXCIgaW4gZWxlbSApIHtcblx0XHRcdFx0XHRpZiAoIFwibGFiZWxcIiBpbiBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5wYXJlbnROb2RlLmRpc2FibGVkID09PSBkaXNhYmxlZDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDYgLSAxMVxuXHRcdFx0XHQvLyBVc2UgdGhlIGlzRGlzYWJsZWQgc2hvcnRjdXQgcHJvcGVydHkgdG8gY2hlY2sgZm9yIGRpc2FibGVkIGZpZWxkc2V0IGFuY2VzdG9yc1xuXHRcdFx0XHRyZXR1cm4gZWxlbS5pc0Rpc2FibGVkID09PSBkaXNhYmxlZCB8fFxuXG5cdFx0XHRcdFx0Ly8gV2hlcmUgdGhlcmUgaXMgbm8gaXNEaXNhYmxlZCwgY2hlY2sgbWFudWFsbHlcblx0XHRcdFx0XHQvKiBqc2hpbnQgLVcwMTggKi9cblx0XHRcdFx0XHRlbGVtLmlzRGlzYWJsZWQgIT09ICFkaXNhYmxlZCAmJlxuXHRcdFx0XHRcdGluRGlzYWJsZWRGaWVsZHNldCggZWxlbSApID09PSBkaXNhYmxlZDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXG5cdFx0Ly8gVHJ5IHRvIHdpbm5vdyBvdXQgZWxlbWVudHMgdGhhdCBjYW4ndCBiZSBkaXNhYmxlZCBiZWZvcmUgdHJ1c3RpbmcgdGhlIGRpc2FibGVkIHByb3BlcnR5LlxuXHRcdC8vIFNvbWUgdmljdGltcyBnZXQgY2F1Z2h0IGluIG91ciBuZXQgKGxhYmVsLCBsZWdlbmQsIG1lbnUsIHRyYWNrKSwgYnV0IGl0IHNob3VsZG4ndFxuXHRcdC8vIGV2ZW4gZXhpc3Qgb24gdGhlbSwgbGV0IGFsb25lIGhhdmUgYSBib29sZWFuIHZhbHVlLlxuXHRcdH0gZWxzZSBpZiAoIFwibGFiZWxcIiBpbiBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdH1cblxuXHRcdC8vIFJlbWFpbmluZyBlbGVtZW50cyBhcmUgbmVpdGhlciA6ZW5hYmxlZCBub3IgOmRpc2FibGVkXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgcG9zaXRpb25hbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZuICkge1xuXHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggYXJndW1lbnQgKSB7XG5cdFx0YXJndW1lbnQgPSArYXJndW1lbnQ7XG5cdFx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHR2YXIgaixcblx0XHRcdFx0bWF0Y2hJbmRleGVzID0gZm4oIFtdLCBzZWVkLmxlbmd0aCwgYXJndW1lbnQgKSxcblx0XHRcdFx0aSA9IG1hdGNoSW5kZXhlcy5sZW5ndGg7XG5cblx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIGZvdW5kIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlc1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggc2VlZFsgKCBqID0gbWF0Y2hJbmRleGVzWyBpIF0gKSBdICkge1xuXHRcdFx0XHRcdHNlZWRbIGogXSA9ICEoIG1hdGNoZXNbIGogXSA9IHNlZWRbIGogXSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGEgbm9kZSBmb3IgdmFsaWRpdHkgYXMgYSBTaXp6bGUgY29udGV4dFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdD19IGNvbnRleHRcbiAqIEByZXR1cm5zIHtFbGVtZW50fE9iamVjdHxCb29sZWFufSBUaGUgaW5wdXQgbm9kZSBpZiBhY2NlcHRhYmxlLCBvdGhlcndpc2UgYSBmYWxzeSB2YWx1ZVxuICovXG5mdW5jdGlvbiB0ZXN0Q29udGV4dCggY29udGV4dCApIHtcblx0cmV0dXJuIGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29udGV4dDtcbn1cblxuLy8gRXhwb3NlIHN1cHBvcnQgdmFycyBmb3IgY29udmVuaWVuY2VcbnN1cHBvcnQgPSBTaXp6bGUuc3VwcG9ydCA9IHt9O1xuXG4vKipcbiAqIERldGVjdHMgWE1MIG5vZGVzXG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0fSBlbGVtIEFuIGVsZW1lbnQgb3IgYSBkb2N1bWVudFxuICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWZmIGVsZW0gaXMgYSBub24tSFRNTCBYTUwgbm9kZVxuICovXG5pc1hNTCA9IFNpenpsZS5pc1hNTCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbmFtZXNwYWNlID0gZWxlbSAmJiBlbGVtLm5hbWVzcGFjZVVSSSxcblx0XHRkb2NFbGVtID0gZWxlbSAmJiAoIGVsZW0ub3duZXJEb2N1bWVudCB8fCBlbGVtICkuZG9jdW1lbnRFbGVtZW50O1xuXG5cdC8vIFN1cHBvcnQ6IElFIDw9OFxuXHQvLyBBc3N1bWUgSFRNTCB3aGVuIGRvY3VtZW50RWxlbWVudCBkb2Vzbid0IHlldCBleGlzdCwgc3VjaCBhcyBpbnNpZGUgbG9hZGluZyBpZnJhbWVzXG5cdC8vIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC80ODMzXG5cdHJldHVybiAhcmh0bWwudGVzdCggbmFtZXNwYWNlIHx8IGRvY0VsZW0gJiYgZG9jRWxlbS5ub2RlTmFtZSB8fCBcIkhUTUxcIiApO1xufTtcblxuLyoqXG4gKiBTZXRzIGRvY3VtZW50LXJlbGF0ZWQgdmFyaWFibGVzIG9uY2UgYmFzZWQgb24gdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IFtkb2NdIEFuIGVsZW1lbnQgb3IgZG9jdW1lbnQgb2JqZWN0IHRvIHVzZSB0byBzZXQgdGhlIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjdXJyZW50IGRvY3VtZW50XG4gKi9cbnNldERvY3VtZW50ID0gU2l6emxlLnNldERvY3VtZW50ID0gZnVuY3Rpb24oIG5vZGUgKSB7XG5cdHZhciBoYXNDb21wYXJlLCBzdWJXaW5kb3csXG5cdFx0ZG9jID0gbm9kZSA/IG5vZGUub3duZXJEb2N1bWVudCB8fCBub2RlIDogcHJlZmVycmVkRG9jO1xuXG5cdC8vIFJldHVybiBlYXJseSBpZiBkb2MgaXMgaW52YWxpZCBvciBhbHJlYWR5IHNlbGVjdGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggZG9jID09IGRvY3VtZW50IHx8IGRvYy5ub2RlVHlwZSAhPT0gOSB8fCAhZG9jLmRvY3VtZW50RWxlbWVudCApIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQ7XG5cdH1cblxuXHQvLyBVcGRhdGUgZ2xvYmFsIHZhcmlhYmxlc1xuXHRkb2N1bWVudCA9IGRvYztcblx0ZG9jRWxlbSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblx0ZG9jdW1lbnRJc0hUTUwgPSAhaXNYTUwoIGRvY3VtZW50ICk7XG5cblx0Ly8gU3VwcG9ydDogSUUgOSAtIDExKywgRWRnZSAxMiAtIDE4K1xuXHQvLyBBY2Nlc3NpbmcgaWZyYW1lIGRvY3VtZW50cyBhZnRlciB1bmxvYWQgdGhyb3dzIFwicGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvcnMgKGpRdWVyeSAjMTM5MzYpXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggcHJlZmVycmVkRG9jICE9IGRvY3VtZW50ICYmXG5cdFx0KCBzdWJXaW5kb3cgPSBkb2N1bWVudC5kZWZhdWx0VmlldyApICYmIHN1YldpbmRvdy50b3AgIT09IHN1YldpbmRvdyApIHtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDExLCBFZGdlXG5cdFx0aWYgKCBzdWJXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lciApIHtcblx0XHRcdHN1YldpbmRvdy5hZGRFdmVudExpc3RlbmVyKCBcInVubG9hZFwiLCB1bmxvYWRIYW5kbGVyLCBmYWxzZSApO1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgOSAtIDEwIG9ubHlcblx0XHR9IGVsc2UgaWYgKCBzdWJXaW5kb3cuYXR0YWNoRXZlbnQgKSB7XG5cdFx0XHRzdWJXaW5kb3cuYXR0YWNoRXZlbnQoIFwib251bmxvYWRcIiwgdW5sb2FkSGFuZGxlciApO1xuXHRcdH1cblx0fVxuXG5cdC8vIFN1cHBvcnQ6IElFIDggLSAxMSssIEVkZ2UgMTIgLSAxOCssIENocm9tZSA8PTE2IC0gMjUgb25seSwgRmlyZWZveCA8PTMuNiAtIDMxIG9ubHksXG5cdC8vIFNhZmFyaSA0IC0gNSBvbmx5LCBPcGVyYSA8PTExLjYgLSAxMi54IG9ubHlcblx0Ly8gSUUvRWRnZSAmIG9sZGVyIGJyb3dzZXJzIGRvbid0IHN1cHBvcnQgdGhlIDpzY29wZSBwc2V1ZG8tY2xhc3MuXG5cdC8vIFN1cHBvcnQ6IFNhZmFyaSA2LjAgb25seVxuXHQvLyBTYWZhcmkgNi4wIHN1cHBvcnRzIDpzY29wZSBidXQgaXQncyBhbiBhbGlhcyBvZiA6cm9vdCB0aGVyZS5cblx0c3VwcG9ydC5zY29wZSA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSApO1xuXHRcdHJldHVybiB0eXBlb2YgZWwucXVlcnlTZWxlY3RvckFsbCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0IWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOnNjb3BlIGZpZWxkc2V0IGRpdlwiICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0LyogQXR0cmlidXRlc1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gU3VwcG9ydDogSUU8OFxuXHQvLyBWZXJpZnkgdGhhdCBnZXRBdHRyaWJ1dGUgcmVhbGx5IHJldHVybnMgYXR0cmlidXRlcyBhbmQgbm90IHByb3BlcnRpZXNcblx0Ly8gKGV4Y2VwdGluZyBJRTggYm9vbGVhbnMpXG5cdHN1cHBvcnQuYXR0cmlidXRlcyA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGVsLmNsYXNzTmFtZSA9IFwiaVwiO1xuXHRcdHJldHVybiAhZWwuZ2V0QXR0cmlidXRlKCBcImNsYXNzTmFtZVwiICk7XG5cdH0gKTtcblxuXHQvKiBnZXRFbGVtZW50KHMpQnkqXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBDaGVjayBpZiBnZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikgcmV0dXJucyBvbmx5IGVsZW1lbnRzXG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRlbC5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlQ29tbWVudCggXCJcIiApICk7XG5cdFx0cmV0dXJuICFlbC5nZXRFbGVtZW50c0J5VGFnTmFtZSggXCIqXCIgKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvLyBTdXBwb3J0OiBJRTw5XG5cdHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDEwXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRCeUlkIHJldHVybnMgZWxlbWVudHMgYnkgbmFtZVxuXHQvLyBUaGUgYnJva2VuIGdldEVsZW1lbnRCeUlkIG1ldGhvZHMgZG9uJ3QgcGljayB1cCBwcm9ncmFtbWF0aWNhbGx5LXNldCBuYW1lcyxcblx0Ly8gc28gdXNlIGEgcm91bmRhYm91dCBnZXRFbGVtZW50c0J5TmFtZSB0ZXN0XG5cdHN1cHBvcnQuZ2V0QnlJZCA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuaWQgPSBleHBhbmRvO1xuXHRcdHJldHVybiAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUgfHwgIWRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCBleHBhbmRvICkubGVuZ3RoO1xuXHR9ICk7XG5cblx0Ly8gSUQgZmlsdGVyIGFuZCBmaW5kXG5cdGlmICggc3VwcG9ydC5nZXRCeUlkICkge1xuXHRcdEV4cHIuZmlsdGVyWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cdFx0RXhwci5maW5kWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRcdHZhciBlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblx0XHRcdFx0cmV0dXJuIGVsZW0gPyBbIGVsZW0gXSA6IFtdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0RXhwci5maWx0ZXJbIFwiSURcIiBdID0gIGZ1bmN0aW9uKCBpZCApIHtcblx0XHRcdHZhciBhdHRySWQgPSBpZC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgbm9kZSA9IHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZU5vZGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRyZXR1cm4gbm9kZSAmJiBub2RlLnZhbHVlID09PSBhdHRySWQ7XG5cdFx0XHR9O1xuXHRcdH07XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA2IC0gNyBvbmx5XG5cdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgaXMgbm90IHJlbGlhYmxlIGFzIGEgZmluZCBzaG9ydGN1dFxuXHRcdEV4cHIuZmluZFsgXCJJRFwiIF0gPSBmdW5jdGlvbiggaWQsIGNvbnRleHQgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRCeUlkICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0XHR2YXIgbm9kZSwgaSwgZWxlbXMsXG5cdFx0XHRcdFx0ZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIGlkICk7XG5cblx0XHRcdFx0aWYgKCBlbGVtICkge1xuXG5cdFx0XHRcdFx0Ly8gVmVyaWZ5IHRoZSBpZCBhdHRyaWJ1dGVcblx0XHRcdFx0XHRub2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0XHRpZiAoIG5vZGUgJiYgbm9kZS52YWx1ZSA9PT0gaWQgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gWyBlbGVtIF07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRmFsbCBiYWNrIG9uIGdldEVsZW1lbnRzQnlOYW1lXG5cdFx0XHRcdFx0ZWxlbXMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlOYW1lKCBpZCApO1xuXHRcdFx0XHRcdGkgPSAwO1xuXHRcdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbXNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRub2RlID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBcImlkXCIgKTtcblx0XHRcdFx0XHRcdGlmICggbm9kZSAmJiBub2RlLnZhbHVlID09PSBpZCApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIFsgZWxlbSBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHR9XG5cblx0Ly8gVGFnXG5cdEV4cHIuZmluZFsgXCJUQUdcIiBdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA/XG5cdFx0ZnVuY3Rpb24oIHRhZywgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUgIT09IFwidW5kZWZpbmVkXCIgKSB7XG5cdFx0XHRcdHJldHVybiBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRG9jdW1lbnRGcmFnbWVudCBub2RlcyBkb24ndCBoYXZlIGdFQlROXG5cdFx0XHR9IGVsc2UgaWYgKCBzdXBwb3J0LnFzYSApIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQucXVlcnlTZWxlY3RvckFsbCggdGFnICk7XG5cdFx0XHR9XG5cdFx0fSA6XG5cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0dmFyIGVsZW0sXG5cdFx0XHRcdHRtcCA9IFtdLFxuXHRcdFx0XHRpID0gMCxcblxuXHRcdFx0XHQvLyBCeSBoYXBweSBjb2luY2lkZW5jZSwgYSAoYnJva2VuKSBnRUJUTiBhcHBlYXJzIG9uIERvY3VtZW50RnJhZ21lbnQgbm9kZXMgdG9vXG5cdFx0XHRcdHJlc3VsdHMgPSBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCB0YWcgKTtcblxuXHRcdFx0Ly8gRmlsdGVyIG91dCBwb3NzaWJsZSBjb21tZW50c1xuXHRcdFx0aWYgKCB0YWcgPT09IFwiKlwiICkge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxICkge1xuXHRcdFx0XHRcdFx0dG1wLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gdG1wO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHQvLyBDbGFzc1xuXHRFeHByLmZpbmRbIFwiQ0xBU1NcIiBdID0gc3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICYmIGZ1bmN0aW9uKCBjbGFzc05hbWUsIGNvbnRleHQgKSB7XG5cdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50SXNIVE1MICkge1xuXHRcdFx0cmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggY2xhc3NOYW1lICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qIFFTQS9tYXRjaGVzU2VsZWN0b3Jcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIFFTQSBhbmQgbWF0Y2hlc1NlbGVjdG9yIHN1cHBvcnRcblxuXHQvLyBtYXRjaGVzU2VsZWN0b3IoOmFjdGl2ZSkgcmVwb3J0cyBmYWxzZSB3aGVuIHRydWUgKElFOS9PcGVyYSAxMS41KVxuXHRyYnVnZ3lNYXRjaGVzID0gW107XG5cblx0Ly8gcVNhKDpmb2N1cykgcmVwb3J0cyBmYWxzZSB3aGVuIHRydWUgKENocm9tZSAyMSlcblx0Ly8gV2UgYWxsb3cgdGhpcyBiZWNhdXNlIG9mIGEgYnVnIGluIElFOC85IHRoYXQgdGhyb3dzIGFuIGVycm9yXG5cdC8vIHdoZW5ldmVyIGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBpcyBhY2Nlc3NlZCBvbiBhbiBpZnJhbWVcblx0Ly8gU28sIHdlIGFsbG93IDpmb2N1cyB0byBwYXNzIHRocm91Z2ggUVNBIGFsbCB0aGUgdGltZSB0byBhdm9pZCB0aGUgSUUgZXJyb3Jcblx0Ly8gU2VlIGh0dHBzOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC8xMzM3OFxuXHRyYnVnZ3lRU0EgPSBbXTtcblxuXHRpZiAoICggc3VwcG9ydC5xc2EgPSBybmF0aXZlLnRlc3QoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwgKSApICkge1xuXG5cdFx0Ly8gQnVpbGQgUVNBIHJlZ2V4XG5cdFx0Ly8gUmVnZXggc3RyYXRlZ3kgYWRvcHRlZCBmcm9tIERpZWdvIFBlcmluaVxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdFx0XHR2YXIgaW5wdXQ7XG5cblx0XHRcdC8vIFNlbGVjdCBpcyBzZXQgdG8gZW1wdHkgc3RyaW5nIG9uIHB1cnBvc2Vcblx0XHRcdC8vIFRoaXMgaXMgdG8gdGVzdCBJRSdzIHRyZWF0bWVudCBvZiBub3QgZXhwbGljaXRseVxuXHRcdFx0Ly8gc2V0dGluZyBhIGJvb2xlYW4gY29udGVudCBhdHRyaWJ1dGUsXG5cdFx0XHQvLyBzaW5jZSBpdHMgcHJlc2VuY2Ugc2hvdWxkIGJlIGVub3VnaFxuXHRcdFx0Ly8gaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzEyMzU5XG5cdFx0XHRkb2NFbGVtLmFwcGVuZENoaWxkKCBlbCApLmlubmVySFRNTCA9IFwiPGEgaWQ9J1wiICsgZXhwYW5kbyArIFwiJz48L2E+XCIgK1xuXHRcdFx0XHRcIjxzZWxlY3QgaWQ9J1wiICsgZXhwYW5kbyArIFwiLVxcclxcXFwnIG1zYWxsb3djYXB0dXJlPScnPlwiICtcblx0XHRcdFx0XCI8b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTgsIE9wZXJhIDExLTEyLjE2XG5cdFx0XHQvLyBOb3RoaW5nIHNob3VsZCBiZSBzZWxlY3RlZCB3aGVuIGVtcHR5IHN0cmluZ3MgZm9sbG93IF49IG9yICQ9IG9yICo9XG5cdFx0XHQvLyBUaGUgdGVzdCBhdHRyaWJ1dGUgbXVzdCBiZSB1bmtub3duIGluIE9wZXJhIGJ1dCBcInNhZmVcIiBmb3IgV2luUlRcblx0XHRcdC8vIGh0dHBzOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvaGg0NjUzODguYXNweCNhdHRyaWJ1dGVfc2VjdGlvblxuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIlttc2FsbG93Y2FwdHVyZV49JyddXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlsqXiRdPVwiICsgd2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gQm9vbGVhbiBhdHRyaWJ1dGVzIGFuZCBcInZhbHVlXCIgYXJlIG5vdCB0cmVhdGVkIGNvcnJlY3RseVxuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbc2VsZWN0ZWRdXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86dmFsdWV8XCIgKyBib29sZWFucyArIFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IENocm9tZTwyOSwgQW5kcm9pZDw0LjQsIFNhZmFyaTw3LjArLCBpT1M8Ny4wKywgUGhhbnRvbUpTPDEuOS44K1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbaWR+PVwiICsgZXhwYW5kbyArIFwiLV1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwifj1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTUgLSAxOCtcblx0XHRcdC8vIElFIDExL0VkZ2UgZG9uJ3QgZmluZCBlbGVtZW50cyBvbiBhIGBbbmFtZT0nJ11gIHF1ZXJ5IGluIHNvbWUgY2FzZXMuXG5cdFx0XHQvLyBBZGRpbmcgYSB0ZW1wb3JhcnkgYXR0cmlidXRlIHRvIHRoZSBkb2N1bWVudCBiZWZvcmUgdGhlIHNlbGVjdGlvbiB3b3Jrc1xuXHRcdFx0Ly8gYXJvdW5kIHRoZSBpc3N1ZS5cblx0XHRcdC8vIEludGVyZXN0aW5nbHksIElFIDEwICYgb2xkZXIgZG9uJ3Qgc2VlbSB0byBoYXZlIHRoZSBpc3N1ZS5cblx0XHRcdGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcIlwiICk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZCggaW5wdXQgKTtcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW25hbWU9JyddXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqbmFtZVwiICsgd2hpdGVzcGFjZSArIFwiKj1cIiArXG5cdFx0XHRcdFx0d2hpdGVzcGFjZSArIFwiKig/OicnfFxcXCJcXFwiKVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFdlYmtpdC9PcGVyYSAtIDpjaGVja2VkIHNob3VsZCByZXR1cm4gc2VsZWN0ZWQgb3B0aW9uIGVsZW1lbnRzXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDExL1JFQy1jc3MzLXNlbGVjdG9ycy0yMDExMDkyOS8jY2hlY2tlZFxuXHRcdFx0Ly8gSUU4IHRocm93cyBlcnJvciBoZXJlIGFuZCB3aWxsIG5vdCBzZWUgbGF0ZXIgdGVzdHNcblx0XHRcdGlmICggIWVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmNoZWNrZWRcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmNoZWNrZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBTYWZhcmkgOCssIGlPUyA4K1xuXHRcdFx0Ly8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNjg1MVxuXHRcdFx0Ly8gSW4tcGFnZSBgc2VsZWN0b3IjaWQgc2libGluZy1jb21iaW5hdG9yIHNlbGVjdG9yYCBmYWlsc1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJhI1wiICsgZXhwYW5kbyArIFwiKypcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiLiMuK1srfl1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBGaXJlZm94IDw9My42IC0gNSBvbmx5XG5cdFx0XHQvLyBPbGQgRmlyZWZveCBkb2Vzbid0IHRocm93IG9uIGEgYmFkbHktZXNjYXBlZCBpZGVudGlmaWVyLlxuXHRcdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggXCJcXFxcXFxmXCIgKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKCBcIltcXFxcclxcXFxuXFxcXGZdXCIgKTtcblx0XHR9ICk7XG5cblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdGVsLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nJyBkaXNhYmxlZD0nZGlzYWJsZWQnPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBkaXNhYmxlZD0nZGlzYWJsZWQnPjxvcHRpb24vPjwvc2VsZWN0PlwiO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBXaW5kb3dzIDggTmF0aXZlIEFwcHNcblx0XHRcdC8vIFRoZSB0eXBlIGFuZCBuYW1lIGF0dHJpYnV0ZXMgYXJlIHJlc3RyaWN0ZWQgZHVyaW5nIC5pbm5lckhUTUwgYXNzaWdubWVudFxuXHRcdFx0dmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJpbnB1dFwiICk7XG5cdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoIFwidHlwZVwiLCBcImhpZGRlblwiICk7XG5cdFx0XHRlbC5hcHBlbmRDaGlsZCggaW5wdXQgKS5zZXRBdHRyaWJ1dGUoIFwibmFtZVwiLCBcIkRcIiApO1xuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRThcblx0XHRcdC8vIEVuZm9yY2UgY2FzZS1zZW5zaXRpdml0eSBvZiBuYW1lIGF0dHJpYnV0ZVxuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltuYW1lPWRdXCIgKS5sZW5ndGggKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIm5hbWVcIiArIHdoaXRlc3BhY2UgKyBcIipbKl4kfCF+XT89XCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRkYgMy41IC0gOmVuYWJsZWQvOmRpc2FibGVkIGFuZCBoaWRkZW4gZWxlbWVudHMgKGhpZGRlbiBlbGVtZW50cyBhcmUgc3RpbGwgZW5hYmxlZClcblx0XHRcdC8vIElFOCB0aHJvd3MgZXJyb3IgaGVyZSBhbmQgd2lsbCBub3Qgc2VlIGxhdGVyIHRlc3RzXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmVuYWJsZWRcIiApLmxlbmd0aCAhPT0gMiApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiOmVuYWJsZWRcIiwgXCI6ZGlzYWJsZWRcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTktMTErXG5cdFx0XHQvLyBJRSdzIDpkaXNhYmxlZCBzZWxlY3RvciBkb2VzIG5vdCBwaWNrIHVwIHRoZSBjaGlsZHJlbiBvZiBkaXNhYmxlZCBmaWVsZHNldHNcblx0XHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuZGlzYWJsZWQgPSB0cnVlO1xuXHRcdFx0aWYgKCBlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIjpkaXNhYmxlZFwiICkubGVuZ3RoICE9PSAyICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6ZW5hYmxlZFwiLCBcIjpkaXNhYmxlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IE9wZXJhIDEwIC0gMTEgb25seVxuXHRcdFx0Ly8gT3BlcmEgMTAtMTEgZG9lcyBub3QgdGhyb3cgb24gcG9zdC1jb21tYSBpbnZhbGlkIHBzZXVkb3Ncblx0XHRcdGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiKiw6eFwiICk7XG5cdFx0XHRyYnVnZ3lRU0EucHVzaCggXCIsLio6XCIgKTtcblx0XHR9ICk7XG5cdH1cblxuXHRpZiAoICggc3VwcG9ydC5tYXRjaGVzU2VsZWN0b3IgPSBybmF0aXZlLnRlc3QoICggbWF0Y2hlcyA9IGRvY0VsZW0ubWF0Y2hlcyB8fFxuXHRcdGRvY0VsZW0ud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG5cdFx0ZG9jRWxlbS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm9NYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1zTWF0Y2hlc1NlbGVjdG9yICkgKSApICkge1xuXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHRcdC8vIENoZWNrIHRvIHNlZSBpZiBpdCdzIHBvc3NpYmxlIHRvIGRvIG1hdGNoZXNTZWxlY3RvclxuXHRcdFx0Ly8gb24gYSBkaXNjb25uZWN0ZWQgbm9kZSAoSUUgOSlcblx0XHRcdHN1cHBvcnQuZGlzY29ubmVjdGVkTWF0Y2ggPSBtYXRjaGVzLmNhbGwoIGVsLCBcIipcIiApO1xuXG5cdFx0XHQvLyBUaGlzIHNob3VsZCBmYWlsIHdpdGggYW4gZXhjZXB0aW9uXG5cdFx0XHQvLyBHZWNrbyBkb2VzIG5vdCBlcnJvciwgcmV0dXJucyBmYWxzZSBpbnN0ZWFkXG5cdFx0XHRtYXRjaGVzLmNhbGwoIGVsLCBcIltzIT0nJ106eFwiICk7XG5cdFx0XHRyYnVnZ3lNYXRjaGVzLnB1c2goIFwiIT1cIiwgcHNldWRvcyApO1xuXHRcdH0gKTtcblx0fVxuXG5cdHJidWdneVFTQSA9IHJidWdneVFTQS5sZW5ndGggJiYgbmV3IFJlZ0V4cCggcmJ1Z2d5UVNBLmpvaW4oIFwifFwiICkgKTtcblx0cmJ1Z2d5TWF0Y2hlcyA9IHJidWdneU1hdGNoZXMubGVuZ3RoICYmIG5ldyBSZWdFeHAoIHJidWdneU1hdGNoZXMuam9pbiggXCJ8XCIgKSApO1xuXG5cdC8qIENvbnRhaW5zXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0aGFzQ29tcGFyZSA9IHJuYXRpdmUudGVzdCggZG9jRWxlbS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiApO1xuXG5cdC8vIEVsZW1lbnQgY29udGFpbnMgYW5vdGhlclxuXHQvLyBQdXJwb3NlZnVsbHkgc2VsZi1leGNsdXNpdmVcblx0Ly8gQXMgaW4sIGFuIGVsZW1lbnQgZG9lcyBub3QgY29udGFpbiBpdHNlbGZcblx0Y29udGFpbnMgPSBoYXNDb21wYXJlIHx8IHJuYXRpdmUudGVzdCggZG9jRWxlbS5jb250YWlucyApID9cblx0XHRmdW5jdGlvbiggYSwgYiApIHtcblx0XHRcdHZhciBhZG93biA9IGEubm9kZVR5cGUgPT09IDkgPyBhLmRvY3VtZW50RWxlbWVudCA6IGEsXG5cdFx0XHRcdGJ1cCA9IGIgJiYgYi5wYXJlbnROb2RlO1xuXHRcdFx0cmV0dXJuIGEgPT09IGJ1cCB8fCAhISggYnVwICYmIGJ1cC5ub2RlVHlwZSA9PT0gMSAmJiAoXG5cdFx0XHRcdGFkb3duLmNvbnRhaW5zID9cblx0XHRcdFx0XHRhZG93bi5jb250YWlucyggYnVwICkgOlxuXHRcdFx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24gJiYgYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYnVwICkgJiAxNlxuXHRcdFx0KSApO1xuXHRcdH0gOlxuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0aWYgKCBiICkge1xuXHRcdFx0XHR3aGlsZSAoICggYiA9IGIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0XHRcdGlmICggYiA9PT0gYSApIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0LyogU29ydGluZ1xuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gRG9jdW1lbnQgb3JkZXIgc29ydGluZ1xuXHRzb3J0T3JkZXIgPSBoYXNDb21wYXJlID9cblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBGbGFnIGZvciBkdXBsaWNhdGUgcmVtb3ZhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHQvLyBTb3J0IG9uIG1ldGhvZCBleGlzdGVuY2UgaWYgb25seSBvbmUgaW5wdXQgaGFzIGNvbXBhcmVEb2N1bWVudFBvc2l0aW9uXG5cdFx0dmFyIGNvbXBhcmUgPSAhYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAtICFiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uO1xuXHRcdGlmICggY29tcGFyZSApIHtcblx0XHRcdHJldHVybiBjb21wYXJlO1xuXHRcdH1cblxuXHRcdC8vIENhbGN1bGF0ZSBwb3NpdGlvbiBpZiBib3RoIGlucHV0cyBiZWxvbmcgdG8gdGhlIHNhbWUgZG9jdW1lbnRcblx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdGNvbXBhcmUgPSAoIGEub3duZXJEb2N1bWVudCB8fCBhICkgPT0gKCBiLm93bmVyRG9jdW1lbnQgfHwgYiApID9cblx0XHRcdGEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGIgKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSB3ZSBrbm93IHRoZXkgYXJlIGRpc2Nvbm5lY3RlZFxuXHRcdFx0MTtcblxuXHRcdC8vIERpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdGlmICggY29tcGFyZSAmIDEgfHxcblx0XHRcdCggIXN1cHBvcnQuc29ydERldGFjaGVkICYmIGIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGEgKSA9PT0gY29tcGFyZSApICkge1xuXG5cdFx0XHQvLyBDaG9vc2UgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBpcyByZWxhdGVkIHRvIG91ciBwcmVmZXJyZWQgZG9jdW1lbnRcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRpZiAoIGEgPT0gZG9jdW1lbnQgfHwgYS5vd25lckRvY3VtZW50ID09IHByZWZlcnJlZERvYyAmJlxuXHRcdFx0XHRjb250YWlucyggcHJlZmVycmVkRG9jLCBhICkgKSB7XG5cdFx0XHRcdHJldHVybiAtMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdGlmICggYiA9PSBkb2N1bWVudCB8fCBiLm93bmVyRG9jdW1lbnQgPT0gcHJlZmVycmVkRG9jICYmXG5cdFx0XHRcdGNvbnRhaW5zKCBwcmVmZXJyZWREb2MsIGIgKSApIHtcblx0XHRcdFx0cmV0dXJuIDE7XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1haW50YWluIG9yaWdpbmFsIG9yZGVyXG5cdFx0XHRyZXR1cm4gc29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb21wYXJlICYgNCA/IC0xIDogMTtcblx0fSA6XG5cdGZ1bmN0aW9uKCBhLCBiICkge1xuXG5cdFx0Ly8gRXhpdCBlYXJseSBpZiB0aGUgbm9kZXMgYXJlIGlkZW50aWNhbFxuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHR2YXIgY3VyLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRhdXAgPSBhLnBhcmVudE5vZGUsXG5cdFx0XHRidXAgPSBiLnBhcmVudE5vZGUsXG5cdFx0XHRhcCA9IFsgYSBdLFxuXHRcdFx0YnAgPSBbIGIgXTtcblxuXHRcdC8vIFBhcmVudGxlc3Mgbm9kZXMgYXJlIGVpdGhlciBkb2N1bWVudHMgb3IgZGlzY29ubmVjdGVkXG5cdFx0aWYgKCAhYXVwIHx8ICFidXAgKSB7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cblx0XHRcdHJldHVybiBhID09IGRvY3VtZW50ID8gLTEgOlxuXHRcdFx0XHRiID09IGRvY3VtZW50ID8gMSA6XG5cdFx0XHRcdC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG5cdFx0XHRcdGF1cCA/IC0xIDpcblx0XHRcdFx0YnVwID8gMSA6XG5cdFx0XHRcdHNvcnRJbnB1dCA/XG5cdFx0XHRcdCggaW5kZXhPZiggc29ydElucHV0LCBhICkgLSBpbmRleE9mKCBzb3J0SW5wdXQsIGIgKSApIDpcblx0XHRcdFx0MDtcblxuXHRcdC8vIElmIHRoZSBub2RlcyBhcmUgc2libGluZ3MsIHdlIGNhbiBkbyBhIHF1aWNrIGNoZWNrXG5cdFx0fSBlbHNlIGlmICggYXVwID09PSBidXAgKSB7XG5cdFx0XHRyZXR1cm4gc2libGluZ0NoZWNrKCBhLCBiICk7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXJ3aXNlIHdlIG5lZWQgZnVsbCBsaXN0cyBvZiB0aGVpciBhbmNlc3RvcnMgZm9yIGNvbXBhcmlzb25cblx0XHRjdXIgPSBhO1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIucGFyZW50Tm9kZSApICkge1xuXHRcdFx0YXAudW5zaGlmdCggY3VyICk7XG5cdFx0fVxuXHRcdGN1ciA9IGI7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRicC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cblx0XHQvLyBXYWxrIGRvd24gdGhlIHRyZWUgbG9va2luZyBmb3IgYSBkaXNjcmVwYW5jeVxuXHRcdHdoaWxlICggYXBbIGkgXSA9PT0gYnBbIGkgXSApIHtcblx0XHRcdGkrKztcblx0XHR9XG5cblx0XHRyZXR1cm4gaSA/XG5cblx0XHRcdC8vIERvIGEgc2libGluZyBjaGVjayBpZiB0aGUgbm9kZXMgaGF2ZSBhIGNvbW1vbiBhbmNlc3RvclxuXHRcdFx0c2libGluZ0NoZWNrKCBhcFsgaSBdLCBicFsgaSBdICkgOlxuXG5cdFx0XHQvLyBPdGhlcndpc2Ugbm9kZXMgaW4gb3VyIGRvY3VtZW50IHNvcnQgZmlyc3Rcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cblx0XHRcdGFwWyBpIF0gPT0gcHJlZmVycmVkRG9jID8gLTEgOlxuXHRcdFx0YnBbIGkgXSA9PSBwcmVmZXJyZWREb2MgPyAxIDpcblx0XHRcdC8qIGVzbGludC1lbmFibGUgZXFlcWVxICovXG5cdFx0XHQwO1xuXHR9O1xuXG5cdHJldHVybiBkb2N1bWVudDtcbn07XG5cblNpenpsZS5tYXRjaGVzID0gZnVuY3Rpb24oIGV4cHIsIGVsZW1lbnRzICkge1xuXHRyZXR1cm4gU2l6emxlKCBleHByLCBudWxsLCBudWxsLCBlbGVtZW50cyApO1xufTtcblxuU2l6emxlLm1hdGNoZXNTZWxlY3RvciA9IGZ1bmN0aW9uKCBlbGVtLCBleHByICkge1xuXHRzZXREb2N1bWVudCggZWxlbSApO1xuXG5cdGlmICggc3VwcG9ydC5tYXRjaGVzU2VsZWN0b3IgJiYgZG9jdW1lbnRJc0hUTUwgJiZcblx0XHQhbm9ubmF0aXZlU2VsZWN0b3JDYWNoZVsgZXhwciArIFwiIFwiIF0gJiZcblx0XHQoICFyYnVnZ3lNYXRjaGVzIHx8ICFyYnVnZ3lNYXRjaGVzLnRlc3QoIGV4cHIgKSApICYmXG5cdFx0KCAhcmJ1Z2d5UVNBICAgICB8fCAhcmJ1Z2d5UVNBLnRlc3QoIGV4cHIgKSApICkge1xuXG5cdFx0dHJ5IHtcblx0XHRcdHZhciByZXQgPSBtYXRjaGVzLmNhbGwoIGVsZW0sIGV4cHIgKTtcblxuXHRcdFx0Ly8gSUUgOSdzIG1hdGNoZXNTZWxlY3RvciByZXR1cm5zIGZhbHNlIG9uIGRpc2Nvbm5lY3RlZCBub2Rlc1xuXHRcdFx0aWYgKCByZXQgfHwgc3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCB8fFxuXG5cdFx0XHRcdC8vIEFzIHdlbGwsIGRpc2Nvbm5lY3RlZCBub2RlcyBhcmUgc2FpZCB0byBiZSBpbiBhIGRvY3VtZW50XG5cdFx0XHRcdC8vIGZyYWdtZW50IGluIElFIDlcblx0XHRcdFx0ZWxlbS5kb2N1bWVudCAmJiBlbGVtLmRvY3VtZW50Lm5vZGVUeXBlICE9PSAxMSApIHtcblx0XHRcdFx0cmV0dXJuIHJldDtcblx0XHRcdH1cblx0XHR9IGNhdGNoICggZSApIHtcblx0XHRcdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUoIGV4cHIsIHRydWUgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlKCBleHByLCBkb2N1bWVudCwgbnVsbCwgWyBlbGVtIF0gKS5sZW5ndGggPiAwO1xufTtcblxuU2l6emxlLmNvbnRhaW5zID0gZnVuY3Rpb24oIGNvbnRleHQsIGVsZW0gKSB7XG5cblx0Ly8gU2V0IGRvY3VtZW50IHZhcnMgaWYgbmVlZGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggKCBjb250ZXh0Lm93bmVyRG9jdW1lbnQgfHwgY29udGV4dCApICE9IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdH1cblx0cmV0dXJuIGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICk7XG59O1xuXG5TaXp6bGUuYXR0ciA9IGZ1bmN0aW9uKCBlbGVtLCBuYW1lICkge1xuXG5cdC8vIFNldCBkb2N1bWVudCB2YXJzIGlmIG5lZWRlZFxuXHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0Ly8gSUUvRWRnZSBzb21ldGltZXMgdGhyb3cgYSBcIlBlcm1pc3Npb24gZGVuaWVkXCIgZXJyb3Igd2hlbiBzdHJpY3QtY29tcGFyaW5nXG5cdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRpZiAoICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKSAhPSBkb2N1bWVudCApIHtcblx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHR9XG5cblx0dmFyIGZuID0gRXhwci5hdHRySGFuZGxlWyBuYW1lLnRvTG93ZXJDYXNlKCkgXSxcblxuXHRcdC8vIERvbid0IGdldCBmb29sZWQgYnkgT2JqZWN0LnByb3RvdHlwZSBwcm9wZXJ0aWVzIChqUXVlcnkgIzEzODA3KVxuXHRcdHZhbCA9IGZuICYmIGhhc093bi5jYWxsKCBFeHByLmF0dHJIYW5kbGUsIG5hbWUudG9Mb3dlckNhc2UoKSApID9cblx0XHRcdGZuKCBlbGVtLCBuYW1lLCAhZG9jdW1lbnRJc0hUTUwgKSA6XG5cdFx0XHR1bmRlZmluZWQ7XG5cblx0cmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkID9cblx0XHR2YWwgOlxuXHRcdHN1cHBvcnQuYXR0cmlidXRlcyB8fCAhZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUgKSA6XG5cdFx0XHQoIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApICkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdG51bGw7XG59O1xuXG5TaXp6bGUuZXNjYXBlID0gZnVuY3Rpb24oIHNlbCApIHtcblx0cmV0dXJuICggc2VsICsgXCJcIiApLnJlcGxhY2UoIHJjc3Nlc2NhcGUsIGZjc3Nlc2NhcGUgKTtcbn07XG5cblNpenpsZS5lcnJvciA9IGZ1bmN0aW9uKCBtc2cgKSB7XG5cdHRocm93IG5ldyBFcnJvciggXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIiArIG1zZyApO1xufTtcblxuLyoqXG4gKiBEb2N1bWVudCBzb3J0aW5nIGFuZCByZW1vdmluZyBkdXBsaWNhdGVzXG4gKiBAcGFyYW0ge0FycmF5TGlrZX0gcmVzdWx0c1xuICovXG5TaXp6bGUudW5pcXVlU29ydCA9IGZ1bmN0aW9uKCByZXN1bHRzICkge1xuXHR2YXIgZWxlbSxcblx0XHRkdXBsaWNhdGVzID0gW10sXG5cdFx0aiA9IDAsXG5cdFx0aSA9IDA7XG5cblx0Ly8gVW5sZXNzIHdlICprbm93KiB3ZSBjYW4gZGV0ZWN0IGR1cGxpY2F0ZXMsIGFzc3VtZSB0aGVpciBwcmVzZW5jZVxuXHRoYXNEdXBsaWNhdGUgPSAhc3VwcG9ydC5kZXRlY3REdXBsaWNhdGVzO1xuXHRzb3J0SW5wdXQgPSAhc3VwcG9ydC5zb3J0U3RhYmxlICYmIHJlc3VsdHMuc2xpY2UoIDAgKTtcblx0cmVzdWx0cy5zb3J0KCBzb3J0T3JkZXIgKTtcblxuXHRpZiAoIGhhc0R1cGxpY2F0ZSApIHtcblx0XHR3aGlsZSAoICggZWxlbSA9IHJlc3VsdHNbIGkrKyBdICkgKSB7XG5cdFx0XHRpZiAoIGVsZW0gPT09IHJlc3VsdHNbIGkgXSApIHtcblx0XHRcdFx0aiA9IGR1cGxpY2F0ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR3aGlsZSAoIGotLSApIHtcblx0XHRcdHJlc3VsdHMuc3BsaWNlKCBkdXBsaWNhdGVzWyBqIF0sIDEgKTtcblx0XHR9XG5cdH1cblxuXHQvLyBDbGVhciBpbnB1dCBhZnRlciBzb3J0aW5nIHRvIHJlbGVhc2Ugb2JqZWN0c1xuXHQvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9zaXp6bGUvcHVsbC8yMjVcblx0c29ydElucHV0ID0gbnVsbDtcblxuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbi8qKlxuICogVXRpbGl0eSBmdW5jdGlvbiBmb3IgcmV0cmlldmluZyB0aGUgdGV4dCB2YWx1ZSBvZiBhbiBhcnJheSBvZiBET00gbm9kZXNcbiAqIEBwYXJhbSB7QXJyYXl8RWxlbWVudH0gZWxlbVxuICovXG5nZXRUZXh0ID0gU2l6emxlLmdldFRleHQgPSBmdW5jdGlvbiggZWxlbSApIHtcblx0dmFyIG5vZGUsXG5cdFx0cmV0ID0gXCJcIixcblx0XHRpID0gMCxcblx0XHRub2RlVHlwZSA9IGVsZW0ubm9kZVR5cGU7XG5cblx0aWYgKCAhbm9kZVR5cGUgKSB7XG5cblx0XHQvLyBJZiBubyBub2RlVHlwZSwgdGhpcyBpcyBleHBlY3RlZCB0byBiZSBhbiBhcnJheVxuXHRcdHdoaWxlICggKCBub2RlID0gZWxlbVsgaSsrIF0gKSApIHtcblxuXHRcdFx0Ly8gRG8gbm90IHRyYXZlcnNlIGNvbW1lbnQgbm9kZXNcblx0XHRcdHJldCArPSBnZXRUZXh0KCBub2RlICk7XG5cdFx0fVxuXHR9IGVsc2UgaWYgKCBub2RlVHlwZSA9PT0gMSB8fCBub2RlVHlwZSA9PT0gOSB8fCBub2RlVHlwZSA9PT0gMTEgKSB7XG5cblx0XHQvLyBVc2UgdGV4dENvbnRlbnQgZm9yIGVsZW1lbnRzXG5cdFx0Ly8gaW5uZXJUZXh0IHVzYWdlIHJlbW92ZWQgZm9yIGNvbnNpc3RlbmN5IG9mIG5ldyBsaW5lcyAoalF1ZXJ5ICMxMTE1Mylcblx0XHRpZiAoIHR5cGVvZiBlbGVtLnRleHRDb250ZW50ID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0cmV0dXJuIGVsZW0udGV4dENvbnRlbnQ7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0Ly8gVHJhdmVyc2UgaXRzIGNoaWxkcmVuXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0cmV0ICs9IGdldFRleHQoIGVsZW0gKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAzIHx8IG5vZGVUeXBlID09PSA0ICkge1xuXHRcdHJldHVybiBlbGVtLm5vZGVWYWx1ZTtcblx0fVxuXG5cdC8vIERvIG5vdCBpbmNsdWRlIGNvbW1lbnQgb3IgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiBub2Rlc1xuXG5cdHJldHVybiByZXQ7XG59O1xuXG5FeHByID0gU2l6emxlLnNlbGVjdG9ycyA9IHtcblxuXHQvLyBDYW4gYmUgYWRqdXN0ZWQgYnkgdGhlIHVzZXJcblx0Y2FjaGVMZW5ndGg6IDUwLFxuXG5cdGNyZWF0ZVBzZXVkbzogbWFya0Z1bmN0aW9uLFxuXG5cdG1hdGNoOiBtYXRjaEV4cHIsXG5cblx0YXR0ckhhbmRsZToge30sXG5cblx0ZmluZDoge30sXG5cblx0cmVsYXRpdmU6IHtcblx0XHRcIj5cIjogeyBkaXI6IFwicGFyZW50Tm9kZVwiLCBmaXJzdDogdHJ1ZSB9LFxuXHRcdFwiIFwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIgfSxcblx0XHRcIitcIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCJ+XCI6IHsgZGlyOiBcInByZXZpb3VzU2libGluZ1wiIH1cblx0fSxcblxuXHRwcmVGaWx0ZXI6IHtcblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG1hdGNoICkge1xuXHRcdFx0bWF0Y2hbIDEgXSA9IG1hdGNoWyAxIF0ucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgZ2l2ZW4gdmFsdWUgdG8gbWF0Y2hbM10gd2hldGhlciBxdW90ZWQgb3IgdW5xdW90ZWRcblx0XHRcdG1hdGNoWyAzIF0gPSAoIG1hdGNoWyAzIF0gfHwgbWF0Y2hbIDQgXSB8fFxuXHRcdFx0XHRtYXRjaFsgNSBdIHx8IFwiXCIgKS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHRpZiAoIG1hdGNoWyAyIF0gPT09IFwifj1cIiApIHtcblx0XHRcdFx0bWF0Y2hbIDMgXSA9IFwiIFwiICsgbWF0Y2hbIDMgXSArIFwiIFwiO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDQgKTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cblx0XHRcdC8qIG1hdGNoZXMgZnJvbSBtYXRjaEV4cHJbXCJDSElMRFwiXVxuXHRcdFx0XHQxIHR5cGUgKG9ubHl8bnRofC4uLilcblx0XHRcdFx0MiB3aGF0IChjaGlsZHxvZi10eXBlKVxuXHRcdFx0XHQzIGFyZ3VtZW50IChldmVufG9kZHxcXGQqfFxcZCpuKFsrLV1cXGQrKT98Li4uKVxuXHRcdFx0XHQ0IHhuLWNvbXBvbmVudCBvZiB4bit5IGFyZ3VtZW50IChbKy1dP1xcZCpufClcblx0XHRcdFx0NSBzaWduIG9mIHhuLWNvbXBvbmVudFxuXHRcdFx0XHQ2IHggb2YgeG4tY29tcG9uZW50XG5cdFx0XHRcdDcgc2lnbiBvZiB5LWNvbXBvbmVudFxuXHRcdFx0XHQ4IHkgb2YgeS1jb21wb25lbnRcblx0XHRcdCovXG5cdFx0XHRtYXRjaFsgMSBdID0gbWF0Y2hbIDEgXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRpZiAoIG1hdGNoWyAxIF0uc2xpY2UoIDAsIDMgKSA9PT0gXCJudGhcIiApIHtcblxuXHRcdFx0XHQvLyBudGgtKiByZXF1aXJlcyBhcmd1bWVudFxuXHRcdFx0XHRpZiAoICFtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbIDAgXSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gbnVtZXJpYyB4IGFuZCB5IHBhcmFtZXRlcnMgZm9yIEV4cHIuZmlsdGVyLkNISUxEXG5cdFx0XHRcdC8vIHJlbWVtYmVyIHRoYXQgZmFsc2UvdHJ1ZSBjYXN0IHJlc3BlY3RpdmVseSB0byAwLzFcblx0XHRcdFx0bWF0Y2hbIDQgXSA9ICsoIG1hdGNoWyA0IF0gP1xuXHRcdFx0XHRcdG1hdGNoWyA1IF0gKyAoIG1hdGNoWyA2IF0gfHwgMSApIDpcblx0XHRcdFx0XHQyICogKCBtYXRjaFsgMyBdID09PSBcImV2ZW5cIiB8fCBtYXRjaFsgMyBdID09PSBcIm9kZFwiICkgKTtcblx0XHRcdFx0bWF0Y2hbIDUgXSA9ICsoICggbWF0Y2hbIDcgXSArIG1hdGNoWyA4IF0gKSB8fCBtYXRjaFsgMyBdID09PSBcIm9kZFwiICk7XG5cblx0XHRcdFx0Ly8gb3RoZXIgdHlwZXMgcHJvaGliaXQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCBtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRTaXp6bGUuZXJyb3IoIG1hdGNoWyAwIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdH0sXG5cblx0XHRcIlBTRVVET1wiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHR2YXIgZXhjZXNzLFxuXHRcdFx0XHR1bnF1b3RlZCA9ICFtYXRjaFsgNiBdICYmIG1hdGNoWyAyIF07XG5cblx0XHRcdGlmICggbWF0Y2hFeHByWyBcIkNISUxEXCIgXS50ZXN0KCBtYXRjaFsgMCBdICkgKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBY2NlcHQgcXVvdGVkIGFyZ3VtZW50cyBhcy1pc1xuXHRcdFx0aWYgKCBtYXRjaFsgMyBdICkge1xuXHRcdFx0XHRtYXRjaFsgMiBdID0gbWF0Y2hbIDQgXSB8fCBtYXRjaFsgNSBdIHx8IFwiXCI7XG5cblx0XHRcdC8vIFN0cmlwIGV4Y2VzcyBjaGFyYWN0ZXJzIGZyb20gdW5xdW90ZWQgYXJndW1lbnRzXG5cdFx0XHR9IGVsc2UgaWYgKCB1bnF1b3RlZCAmJiBycHNldWRvLnRlc3QoIHVucXVvdGVkICkgJiZcblxuXHRcdFx0XHQvLyBHZXQgZXhjZXNzIGZyb20gdG9rZW5pemUgKHJlY3Vyc2l2ZWx5KVxuXHRcdFx0XHQoIGV4Y2VzcyA9IHRva2VuaXplKCB1bnF1b3RlZCwgdHJ1ZSApICkgJiZcblxuXHRcdFx0XHQvLyBhZHZhbmNlIHRvIHRoZSBuZXh0IGNsb3NpbmcgcGFyZW50aGVzaXNcblx0XHRcdFx0KCBleGNlc3MgPSB1bnF1b3RlZC5pbmRleE9mKCBcIilcIiwgdW5xdW90ZWQubGVuZ3RoIC0gZXhjZXNzICkgLSB1bnF1b3RlZC5sZW5ndGggKSApIHtcblxuXHRcdFx0XHQvLyBleGNlc3MgaXMgYSBuZWdhdGl2ZSBpbmRleFxuXHRcdFx0XHRtYXRjaFsgMCBdID0gbWF0Y2hbIDAgXS5zbGljZSggMCwgZXhjZXNzICk7XG5cdFx0XHRcdG1hdGNoWyAyIF0gPSB1bnF1b3RlZC5zbGljZSggMCwgZXhjZXNzICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJldHVybiBvbmx5IGNhcHR1cmVzIG5lZWRlZCBieSB0aGUgcHNldWRvIGZpbHRlciBtZXRob2QgKHR5cGUgYW5kIGFyZ3VtZW50KVxuXHRcdFx0cmV0dXJuIG1hdGNoLnNsaWNlKCAwLCAzICk7XG5cdFx0fVxuXHR9LFxuXG5cdGZpbHRlcjoge1xuXG5cdFx0XCJUQUdcIjogZnVuY3Rpb24oIG5vZGVOYW1lU2VsZWN0b3IgKSB7XG5cdFx0XHR2YXIgbm9kZU5hbWUgPSBub2RlTmFtZVNlbGVjdG9yLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBub2RlTmFtZVNlbGVjdG9yID09PSBcIipcIiA/XG5cdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9IDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGVsZW0ubm9kZU5hbWUgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBub2RlTmFtZTtcblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDTEFTU1wiOiBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdFx0dmFyIHBhdHRlcm4gPSBjbGFzc0NhY2hlWyBjbGFzc05hbWUgKyBcIiBcIiBdO1xuXG5cdFx0XHRyZXR1cm4gcGF0dGVybiB8fFxuXHRcdFx0XHQoIHBhdHRlcm4gPSBuZXcgUmVnRXhwKCBcIihefFwiICsgd2hpdGVzcGFjZSArXG5cdFx0XHRcdFx0XCIpXCIgKyBjbGFzc05hbWUgKyBcIihcIiArIHdoaXRlc3BhY2UgKyBcInwkKVwiICkgKSAmJiBjbGFzc0NhY2hlKFxuXHRcdFx0XHRcdFx0Y2xhc3NOYW1lLCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHBhdHRlcm4udGVzdChcblx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgZWxlbS5jbGFzc05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWxlbS5jbGFzc05hbWUgfHxcblx0XHRcdFx0XHRcdFx0XHR0eXBlb2YgZWxlbS5nZXRBdHRyaWJ1dGUgIT09IFwidW5kZWZpbmVkXCIgJiZcblx0XHRcdFx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBcImNsYXNzXCIgKSB8fFxuXHRcdFx0XHRcdFx0XHRcdFwiXCJcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0fSApO1xuXHRcdH0sXG5cblx0XHRcIkFUVFJcIjogZnVuY3Rpb24oIG5hbWUsIG9wZXJhdG9yLCBjaGVjayApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IFNpenpsZS5hdHRyKCBlbGVtLCBuYW1lICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiIT1cIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoICFvcGVyYXRvciApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3VsdCArPSBcIlwiO1xuXG5cdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cblxuXHRcdFx0XHRyZXR1cm4gb3BlcmF0b3IgPT09IFwiPVwiID8gcmVzdWx0ID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiIT1cIiA/IHJlc3VsdCAhPT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIl49XCIgPyBjaGVjayAmJiByZXN1bHQuaW5kZXhPZiggY2hlY2sgKSA9PT0gMCA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiKj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIiQ9XCIgPyBjaGVjayAmJiByZXN1bHQuc2xpY2UoIC1jaGVjay5sZW5ndGggKSA9PT0gY2hlY2sgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcIn49XCIgPyAoIFwiIFwiICsgcmVzdWx0LnJlcGxhY2UoIHJ3aGl0ZXNwYWNlLCBcIiBcIiApICsgXCIgXCIgKS5pbmRleE9mKCBjaGVjayApID4gLTEgOlxuXHRcdFx0XHRcdG9wZXJhdG9yID09PSBcInw9XCIgPyByZXN1bHQgPT09IGNoZWNrIHx8IHJlc3VsdC5zbGljZSggMCwgY2hlY2subGVuZ3RoICsgMSApID09PSBjaGVjayArIFwiLVwiIDpcblx0XHRcdFx0XHRmYWxzZTtcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXG5cblx0XHRcdH07XG5cdFx0fSxcblxuXHRcdFwiQ0hJTERcIjogZnVuY3Rpb24oIHR5cGUsIHdoYXQsIF9hcmd1bWVudCwgZmlyc3QsIGxhc3QgKSB7XG5cdFx0XHR2YXIgc2ltcGxlID0gdHlwZS5zbGljZSggMCwgMyApICE9PSBcIm50aFwiLFxuXHRcdFx0XHRmb3J3YXJkID0gdHlwZS5zbGljZSggLTQgKSAhPT0gXCJsYXN0XCIsXG5cdFx0XHRcdG9mVHlwZSA9IHdoYXQgPT09IFwib2YtdHlwZVwiO1xuXG5cdFx0XHRyZXR1cm4gZmlyc3QgPT09IDEgJiYgbGFzdCA9PT0gMCA/XG5cblx0XHRcdFx0Ly8gU2hvcnRjdXQgZm9yIDpudGgtKihuKVxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gISFlbGVtLnBhcmVudE5vZGU7XG5cdFx0XHRcdH0gOlxuXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdHZhciBjYWNoZSwgdW5pcXVlQ2FjaGUsIG91dGVyQ2FjaGUsIG5vZGUsIG5vZGVJbmRleCwgc3RhcnQsXG5cdFx0XHRcdFx0XHRkaXIgPSBzaW1wbGUgIT09IGZvcndhcmQgPyBcIm5leHRTaWJsaW5nXCIgOiBcInByZXZpb3VzU2libGluZ1wiLFxuXHRcdFx0XHRcdFx0cGFyZW50ID0gZWxlbS5wYXJlbnROb2RlLFxuXHRcdFx0XHRcdFx0bmFtZSA9IG9mVHlwZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdFx0XHR1c2VDYWNoZSA9ICF4bWwgJiYgIW9mVHlwZSxcblx0XHRcdFx0XHRcdGRpZmYgPSBmYWxzZTtcblxuXHRcdFx0XHRcdGlmICggcGFyZW50ICkge1xuXG5cdFx0XHRcdFx0XHQvLyA6KGZpcnN0fGxhc3R8b25seSktKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdFx0XHRpZiAoIHNpbXBsZSApIHtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKCBkaXIgKSB7XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0d2hpbGUgKCAoIG5vZGUgPSBub2RlWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBSZXZlcnNlIGRpcmVjdGlvbiBmb3IgOm9ubHktKiAoaWYgd2UgaGF2ZW4ndCB5ZXQgZG9uZSBzbylcblx0XHRcdFx0XHRcdFx0XHRzdGFydCA9IGRpciA9IHR5cGUgPT09IFwib25seVwiICYmICFzdGFydCAmJiBcIm5leHRTaWJsaW5nXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHN0YXJ0ID0gWyBmb3J3YXJkID8gcGFyZW50LmZpcnN0Q2hpbGQgOiBwYXJlbnQubGFzdENoaWxkIF07XG5cblx0XHRcdFx0XHRcdC8vIG5vbi14bWwgOm50aC1jaGlsZCguLi4pIHN0b3JlcyBjYWNoZSBkYXRhIG9uIGBwYXJlbnRgXG5cdFx0XHRcdFx0XHRpZiAoIGZvcndhcmQgJiYgdXNlQ2FjaGUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gU2VlayBgZWxlbWAgZnJvbSBhIHByZXZpb3VzbHktY2FjaGVkIGluZGV4XG5cblx0XHRcdFx0XHRcdFx0Ly8gLi4uaW4gYSBnemlwLWZyaWVuZGx5IHdheVxuXHRcdFx0XHRcdFx0XHRub2RlID0gcGFyZW50O1xuXHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8ICggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRjYWNoZSA9IHVuaXF1ZUNhY2hlWyB0eXBlIF0gfHwgW107XG5cdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleCAmJiBjYWNoZVsgMiBdO1xuXHRcdFx0XHRcdFx0XHRub2RlID0gbm9kZUluZGV4ICYmIHBhcmVudC5jaGlsZE5vZGVzWyBub2RlSW5kZXggXTtcblxuXHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblxuXHRcdFx0XHRcdFx0XHRcdC8vIEZhbGxiYWNrIHRvIHNlZWtpbmcgYGVsZW1gIGZyb20gdGhlIHN0YXJ0XG5cdFx0XHRcdFx0XHRcdFx0KCBkaWZmID0gbm9kZUluZGV4ID0gMCApIHx8IHN0YXJ0LnBvcCgpICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBXaGVuIGZvdW5kLCBjYWNoZSBpbmRleGVzIG9uIGBwYXJlbnRgIGFuZCBicmVha1xuXHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiArK2RpZmYgJiYgbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyB0eXBlIF0gPSBbIGRpcnJ1bnMsIG5vZGVJbmRleCwgZGlmZiBdO1xuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gVXNlIHByZXZpb3VzbHktY2FjaGVkIGVsZW1lbnQgaW5kZXggaWYgYXZhaWxhYmxlXG5cdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyAuLi5pbiBhIGd6aXAtZnJpZW5kbHkgd2F5XG5cdFx0XHRcdFx0XHRcdFx0bm9kZSA9IGVsZW07XG5cdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fCAoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0XHRub2RlSW5kZXggPSBjYWNoZVsgMCBdID09PSBkaXJydW5zICYmIGNhY2hlWyAxIF07XG5cdFx0XHRcdFx0XHRcdFx0ZGlmZiA9IG5vZGVJbmRleDtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdC8vIHhtbCA6bnRoLWNoaWxkKC4uLilcblx0XHRcdFx0XHRcdFx0Ly8gb3IgOm50aC1sYXN0LWNoaWxkKC4uLikgb3IgOm50aCgtbGFzdCk/LW9mLXR5cGUoLi4uKVxuXHRcdFx0XHRcdFx0XHRpZiAoIGRpZmYgPT09IGZhbHNlICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXNlIHRoZSBzYW1lIGxvb3AgYXMgYWJvdmUgdG8gc2VlayBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9ICsrbm9kZUluZGV4ICYmIG5vZGUgJiYgbm9kZVsgZGlyIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdCggZGlmZiA9IG5vZGVJbmRleCA9IDAgKSB8fCBzdGFydC5wb3AoKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoICggb2ZUeXBlID9cblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBuYW1lIDpcblx0XHRcdFx0XHRcdFx0XHRcdFx0bm9kZS5ub2RlVHlwZSA9PT0gMSApICYmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsrZGlmZiApIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBDYWNoZSB0aGUgaW5kZXggb2YgZWFjaCBlbmNvdW50ZXJlZCBlbGVtZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggdXNlQ2FjaGUgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3V0ZXJDYWNoZSA9IG5vZGVbIGV4cGFuZG8gXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlZmVuZCBhZ2FpbnN0IGNsb25lZCBhdHRyb3BlcnRpZXMgKGpRdWVyeSBnaC0xNzA5KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsgdHlwZSBdID0gWyBkaXJydW5zLCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIG5vZGUgPT09IGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Ly8gSW5jb3Jwb3JhdGUgdGhlIG9mZnNldCwgdGhlbiBjaGVjayBhZ2FpbnN0IGN5Y2xlIHNpemVcblx0XHRcdFx0XHRcdGRpZmYgLT0gbGFzdDtcblx0XHRcdFx0XHRcdHJldHVybiBkaWZmID09PSBmaXJzdCB8fCAoIGRpZmYgJSBmaXJzdCA9PT0gMCAmJiBkaWZmIC8gZmlyc3QgPj0gMCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJQU0VVRE9cIjogZnVuY3Rpb24oIHBzZXVkbywgYXJndW1lbnQgKSB7XG5cblx0XHRcdC8vIHBzZXVkby1jbGFzcyBuYW1lcyBhcmUgY2FzZS1pbnNlbnNpdGl2ZVxuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNwc2V1ZG8tY2xhc3Nlc1xuXHRcdFx0Ly8gUHJpb3JpdGl6ZSBieSBjYXNlIHNlbnNpdGl2aXR5IGluIGNhc2UgY3VzdG9tIHBzZXVkb3MgYXJlIGFkZGVkIHdpdGggdXBwZXJjYXNlIGxldHRlcnNcblx0XHRcdC8vIFJlbWVtYmVyIHRoYXQgc2V0RmlsdGVycyBpbmhlcml0cyBmcm9tIHBzZXVkb3Ncblx0XHRcdHZhciBhcmdzLFxuXHRcdFx0XHRmbiA9IEV4cHIucHNldWRvc1sgcHNldWRvIF0gfHwgRXhwci5zZXRGaWx0ZXJzWyBwc2V1ZG8udG9Mb3dlckNhc2UoKSBdIHx8XG5cdFx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIHBzZXVkbzogXCIgKyBwc2V1ZG8gKTtcblxuXHRcdFx0Ly8gVGhlIHVzZXIgbWF5IHVzZSBjcmVhdGVQc2V1ZG8gdG8gaW5kaWNhdGUgdGhhdFxuXHRcdFx0Ly8gYXJndW1lbnRzIGFyZSBuZWVkZWQgdG8gY3JlYXRlIHRoZSBmaWx0ZXIgZnVuY3Rpb25cblx0XHRcdC8vIGp1c3QgYXMgU2l6emxlIGRvZXNcblx0XHRcdGlmICggZm5bIGV4cGFuZG8gXSApIHtcblx0XHRcdFx0cmV0dXJuIGZuKCBhcmd1bWVudCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBCdXQgbWFpbnRhaW4gc3VwcG9ydCBmb3Igb2xkIHNpZ25hdHVyZXNcblx0XHRcdGlmICggZm4ubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0YXJncyA9IFsgcHNldWRvLCBwc2V1ZG8sIFwiXCIsIGFyZ3VtZW50IF07XG5cdFx0XHRcdHJldHVybiBFeHByLnNldEZpbHRlcnMuaGFzT3duUHJvcGVydHkoIHBzZXVkby50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0XHRcdG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIG1hdGNoZXMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgaWR4LFxuXHRcdFx0XHRcdFx0XHRtYXRjaGVkID0gZm4oIHNlZWQsIGFyZ3VtZW50ICksXG5cdFx0XHRcdFx0XHRcdGkgPSBtYXRjaGVkLmxlbmd0aDtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZHggPSBpbmRleE9mKCBzZWVkLCBtYXRjaGVkWyBpIF0gKTtcblx0XHRcdFx0XHRcdFx0c2VlZFsgaWR4IF0gPSAhKCBtYXRjaGVzWyBpZHggXSA9IG1hdGNoZWRbIGkgXSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gKSA6XG5cdFx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZm4oIGVsZW0sIDAsIGFyZ3MgKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZm47XG5cdFx0fVxuXHR9LFxuXG5cdHBzZXVkb3M6IHtcblxuXHRcdC8vIFBvdGVudGlhbGx5IGNvbXBsZXggcHNldWRvc1xuXHRcdFwibm90XCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuXG5cdFx0XHQvLyBUcmltIHRoZSBzZWxlY3RvciBwYXNzZWQgdG8gY29tcGlsZVxuXHRcdFx0Ly8gdG8gYXZvaWQgdHJlYXRpbmcgbGVhZGluZyBhbmQgdHJhaWxpbmdcblx0XHRcdC8vIHNwYWNlcyBhcyBjb21iaW5hdG9yc1xuXHRcdFx0dmFyIGlucHV0ID0gW10sXG5cdFx0XHRcdHJlc3VsdHMgPSBbXSxcblx0XHRcdFx0bWF0Y2hlciA9IGNvbXBpbGUoIHNlbGVjdG9yLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSApO1xuXG5cdFx0XHRyZXR1cm4gbWF0Y2hlclsgZXhwYW5kbyBdID9cblx0XHRcdFx0bWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcywgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0XHRcdHVubWF0Y2hlZCA9IG1hdGNoZXIoIHNlZWQsIG51bGwsIHhtbCwgW10gKSxcblx0XHRcdFx0XHRcdGkgPSBzZWVkLmxlbmd0aDtcblxuXHRcdFx0XHRcdC8vIE1hdGNoIGVsZW1lbnRzIHVubWF0Y2hlZCBieSBgbWF0Y2hlcmBcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gdW5tYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0c2VlZFsgaSBdID0gISggbWF0Y2hlc1sgaSBdID0gZWxlbSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApIDpcblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0aW5wdXRbIDAgXSA9IGVsZW07XG5cdFx0XHRcdFx0bWF0Y2hlciggaW5wdXQsIG51bGwsIHhtbCwgcmVzdWx0cyApO1xuXG5cdFx0XHRcdFx0Ly8gRG9uJ3Qga2VlcCB0aGUgZWxlbWVudCAoaXNzdWUgIzI5OSlcblx0XHRcdFx0XHRpbnB1dFsgMCBdID0gbnVsbDtcblx0XHRcdFx0XHRyZXR1cm4gIXJlc3VsdHMucG9wKCk7XG5cdFx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0XCJoYXNcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBTaXp6bGUoIHNlbGVjdG9yLCBlbGVtICkubGVuZ3RoID4gMDtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0XCJjb250YWluc1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuICggZWxlbS50ZXh0Q29udGVudCB8fCBnZXRUZXh0KCBlbGVtICkgKS5pbmRleE9mKCB0ZXh0ICkgPiAtMTtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0Ly8gXCJXaGV0aGVyIGFuIGVsZW1lbnQgaXMgcmVwcmVzZW50ZWQgYnkgYSA6bGFuZygpIHNlbGVjdG9yXG5cdFx0Ly8gaXMgYmFzZWQgc29sZWx5IG9uIHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWVcblx0XHQvLyBiZWluZyBlcXVhbCB0byB0aGUgaWRlbnRpZmllciBDLFxuXHRcdC8vIG9yIGJlZ2lubmluZyB3aXRoIHRoZSBpZGVudGlmaWVyIEMgaW1tZWRpYXRlbHkgZm9sbG93ZWQgYnkgXCItXCIuXG5cdFx0Ly8gVGhlIG1hdGNoaW5nIG9mIEMgYWdhaW5zdCB0aGUgZWxlbWVudCdzIGxhbmd1YWdlIHZhbHVlIGlzIHBlcmZvcm1lZCBjYXNlLWluc2Vuc2l0aXZlbHkuXG5cdFx0Ly8gVGhlIGlkZW50aWZpZXIgQyBkb2VzIG5vdCBoYXZlIHRvIGJlIGEgdmFsaWQgbGFuZ3VhZ2UgbmFtZS5cIlxuXHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jbGFuZy1wc2V1ZG9cblx0XHRcImxhbmdcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggbGFuZyApIHtcblxuXHRcdFx0Ly8gbGFuZyB2YWx1ZSBtdXN0IGJlIGEgdmFsaWQgaWRlbnRpZmllclxuXHRcdFx0aWYgKCAhcmlkZW50aWZpZXIudGVzdCggbGFuZyB8fCBcIlwiICkgKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggXCJ1bnN1cHBvcnRlZCBsYW5nOiBcIiArIGxhbmcgKTtcblx0XHRcdH1cblx0XHRcdGxhbmcgPSBsYW5nLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICkudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0dmFyIGVsZW1MYW5nO1xuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0aWYgKCAoIGVsZW1MYW5nID0gZG9jdW1lbnRJc0hUTUwgP1xuXHRcdFx0XHRcdFx0ZWxlbS5sYW5nIDpcblx0XHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlKCBcInhtbDpsYW5nXCIgKSB8fCBlbGVtLmdldEF0dHJpYnV0ZSggXCJsYW5nXCIgKSApICkge1xuXG5cdFx0XHRcdFx0XHRlbGVtTGFuZyA9IGVsZW1MYW5nLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbUxhbmcgPT09IGxhbmcgfHwgZWxlbUxhbmcuaW5kZXhPZiggbGFuZyArIFwiLVwiICkgPT09IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IHdoaWxlICggKCBlbGVtID0gZWxlbS5wYXJlbnROb2RlICkgJiYgZWxlbS5ub2RlVHlwZSA9PT0gMSApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9O1xuXHRcdH0gKSxcblxuXHRcdC8vIE1pc2NlbGxhbmVvdXNcblx0XHRcInRhcmdldFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXHRcdFx0cmV0dXJuIGhhc2ggJiYgaGFzaC5zbGljZSggMSApID09PSBlbGVtLmlkO1xuXHRcdH0sXG5cblx0XHRcInJvb3RcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbSA9PT0gZG9jRWxlbTtcblx0XHR9LFxuXG5cdFx0XCJmb2N1c1wiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmXG5cdFx0XHRcdCggIWRvY3VtZW50Lmhhc0ZvY3VzIHx8IGRvY3VtZW50Lmhhc0ZvY3VzKCkgKSAmJlxuXHRcdFx0XHQhISggZWxlbS50eXBlIHx8IGVsZW0uaHJlZiB8fCB+ZWxlbS50YWJJbmRleCApO1xuXHRcdH0sXG5cblx0XHQvLyBCb29sZWFuIHByb3BlcnRpZXNcblx0XHRcImVuYWJsZWRcIjogY3JlYXRlRGlzYWJsZWRQc2V1ZG8oIGZhbHNlICksXG5cdFx0XCJkaXNhYmxlZFwiOiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggdHJ1ZSApLFxuXG5cdFx0XCJjaGVja2VkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBJbiBDU1MzLCA6Y2hlY2tlZCBzaG91bGQgcmV0dXJuIGJvdGggY2hlY2tlZCBhbmQgc2VsZWN0ZWQgZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHR2YXIgbm9kZU5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gKCBub2RlTmFtZSA9PT0gXCJpbnB1dFwiICYmICEhZWxlbS5jaGVja2VkICkgfHxcblx0XHRcdFx0KCBub2RlTmFtZSA9PT0gXCJvcHRpb25cIiAmJiAhIWVsZW0uc2VsZWN0ZWQgKTtcblx0XHR9LFxuXG5cdFx0XCJzZWxlY3RlZFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gQWNjZXNzaW5nIHRoaXMgcHJvcGVydHkgbWFrZXMgc2VsZWN0ZWQtYnktZGVmYXVsdFxuXHRcdFx0Ly8gb3B0aW9ucyBpbiBTYWZhcmkgd29yayBwcm9wZXJseVxuXHRcdFx0aWYgKCBlbGVtLnBhcmVudE5vZGUgKSB7XG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0XHRcdFx0ZWxlbS5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXg7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBlbGVtLnNlbGVjdGVkID09PSB0cnVlO1xuXHRcdH0sXG5cblx0XHQvLyBDb250ZW50c1xuXHRcdFwiZW1wdHlcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy8jZW1wdHktcHNldWRvXG5cdFx0XHQvLyA6ZW1wdHkgaXMgbmVnYXRlZCBieSBlbGVtZW50ICgxKSBvciBjb250ZW50IG5vZGVzICh0ZXh0OiAzOyBjZGF0YTogNDsgZW50aXR5IHJlZjogNSksXG5cdFx0XHQvLyAgIGJ1dCBub3QgYnkgb3RoZXJzIChjb21tZW50OiA4OyBwcm9jZXNzaW5nIGluc3RydWN0aW9uOiA3OyBldGMuKVxuXHRcdFx0Ly8gbm9kZVR5cGUgPCA2IHdvcmtzIGJlY2F1c2UgYXR0cmlidXRlcyAoMikgZG8gbm90IGFwcGVhciBhcyBjaGlsZHJlblxuXHRcdFx0Zm9yICggZWxlbSA9IGVsZW0uZmlyc3RDaGlsZDsgZWxlbTsgZWxlbSA9IGVsZW0ubmV4dFNpYmxpbmcgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA8IDYgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0XCJwYXJlbnRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gIUV4cHIucHNldWRvc1sgXCJlbXB0eVwiIF0oIGVsZW0gKTtcblx0XHR9LFxuXG5cdFx0Ly8gRWxlbWVudC9pbnB1dCB0eXBlc1xuXHRcdFwiaGVhZGVyXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIHJoZWFkZXIudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHRcImlucHV0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIHJpbnB1dHMudGVzdCggZWxlbS5ub2RlTmFtZSApO1xuXHRcdH0sXG5cblx0XHRcImJ1dHRvblwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5hbWUgPT09IFwiaW5wdXRcIiAmJiBlbGVtLnR5cGUgPT09IFwiYnV0dG9uXCIgfHwgbmFtZSA9PT0gXCJidXR0b25cIjtcblx0XHR9LFxuXG5cdFx0XCJ0ZXh0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGF0dHI7XG5cdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgJiZcblx0XHRcdFx0ZWxlbS50eXBlID09PSBcInRleHRcIiAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFPDhcblx0XHRcdFx0Ly8gTmV3IEhUTUw1IGF0dHJpYnV0ZSB2YWx1ZXMgKGUuZy4sIFwic2VhcmNoXCIpIGFwcGVhciB3aXRoIGVsZW0udHlwZSA9PT0gXCJ0ZXh0XCJcblx0XHRcdFx0KCAoIGF0dHIgPSBlbGVtLmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKSApID09IG51bGwgfHxcblx0XHRcdFx0XHRhdHRyLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dFwiICk7XG5cdFx0fSxcblxuXHRcdC8vIFBvc2l0aW9uLWluLWNvbGxlY3Rpb25cblx0XHRcImZpcnN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFsgMCBdO1xuXHRcdH0gKSxcblxuXHRcdFwibGFzdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggX21hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuIFsgbGVuZ3RoIC0gMSBdO1xuXHRcdH0gKSxcblxuXHRcdFwiZXFcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIF9tYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gWyBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50IF07XG5cdFx0fSApLFxuXG5cdFx0XCJldmVuXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMDtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcIm9kZFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHR2YXIgaSA9IDE7XG5cdFx0XHRmb3IgKCA7IGkgPCBsZW5ndGg7IGkgKz0gMiApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJsdFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgP1xuXHRcdFx0XHRhcmd1bWVudCArIGxlbmd0aCA6XG5cdFx0XHRcdGFyZ3VtZW50ID4gbGVuZ3RoID9cblx0XHRcdFx0XHRsZW5ndGggOlxuXHRcdFx0XHRcdGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyAtLWkgPj0gMDsgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwiZ3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHZhciBpID0gYXJndW1lbnQgPCAwID8gYXJndW1lbnQgKyBsZW5ndGggOiBhcmd1bWVudDtcblx0XHRcdGZvciAoIDsgKytpIDwgbGVuZ3RoOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApXG5cdH1cbn07XG5cbkV4cHIucHNldWRvc1sgXCJudGhcIiBdID0gRXhwci5wc2V1ZG9zWyBcImVxXCIgXTtcblxuLy8gQWRkIGJ1dHRvbi9pbnB1dCB0eXBlIHBzZXVkb3NcbmZvciAoIGkgaW4geyByYWRpbzogdHJ1ZSwgY2hlY2tib3g6IHRydWUsIGZpbGU6IHRydWUsIHBhc3N3b3JkOiB0cnVlLCBpbWFnZTogdHJ1ZSB9ICkge1xuXHRFeHByLnBzZXVkb3NbIGkgXSA9IGNyZWF0ZUlucHV0UHNldWRvKCBpICk7XG59XG5mb3IgKCBpIGluIHsgc3VibWl0OiB0cnVlLCByZXNldDogdHJ1ZSB9ICkge1xuXHRFeHByLnBzZXVkb3NbIGkgXSA9IGNyZWF0ZUJ1dHRvblBzZXVkbyggaSApO1xufVxuXG4vLyBFYXN5IEFQSSBmb3IgY3JlYXRpbmcgbmV3IHNldEZpbHRlcnNcbmZ1bmN0aW9uIHNldEZpbHRlcnMoKSB7fVxuc2V0RmlsdGVycy5wcm90b3R5cGUgPSBFeHByLmZpbHRlcnMgPSBFeHByLnBzZXVkb3M7XG5FeHByLnNldEZpbHRlcnMgPSBuZXcgc2V0RmlsdGVycygpO1xuXG50b2tlbml6ZSA9IFNpenpsZS50b2tlbml6ZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgcGFyc2VPbmx5ICkge1xuXHR2YXIgbWF0Y2hlZCwgbWF0Y2gsIHRva2VucywgdHlwZSxcblx0XHRzb0ZhciwgZ3JvdXBzLCBwcmVGaWx0ZXJzLFxuXHRcdGNhY2hlZCA9IHRva2VuQ2FjaGVbIHNlbGVjdG9yICsgXCIgXCIgXTtcblxuXHRpZiAoIGNhY2hlZCApIHtcblx0XHRyZXR1cm4gcGFyc2VPbmx5ID8gMCA6IGNhY2hlZC5zbGljZSggMCApO1xuXHR9XG5cblx0c29GYXIgPSBzZWxlY3Rvcjtcblx0Z3JvdXBzID0gW107XG5cdHByZUZpbHRlcnMgPSBFeHByLnByZUZpbHRlcjtcblxuXHR3aGlsZSAoIHNvRmFyICkge1xuXG5cdFx0Ly8gQ29tbWEgYW5kIGZpcnN0IHJ1blxuXHRcdGlmICggIW1hdGNoZWQgfHwgKCBtYXRjaCA9IHJjb21tYS5leGVjKCBzb0ZhciApICkgKSB7XG5cdFx0XHRpZiAoIG1hdGNoICkge1xuXG5cdFx0XHRcdC8vIERvbid0IGNvbnN1bWUgdHJhaWxpbmcgY29tbWFzIGFzIHZhbGlkXG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoWyAwIF0ubGVuZ3RoICkgfHwgc29GYXI7XG5cdFx0XHR9XG5cdFx0XHRncm91cHMucHVzaCggKCB0b2tlbnMgPSBbXSApICk7XG5cdFx0fVxuXG5cdFx0bWF0Y2hlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gQ29tYmluYXRvcnNcblx0XHRpZiAoICggbWF0Y2ggPSByY29tYmluYXRvcnMuZXhlYyggc29GYXIgKSApICkge1xuXHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHR0b2tlbnMucHVzaCgge1xuXHRcdFx0XHR2YWx1ZTogbWF0Y2hlZCxcblxuXHRcdFx0XHQvLyBDYXN0IGRlc2NlbmRhbnQgY29tYmluYXRvcnMgdG8gc3BhY2Vcblx0XHRcdFx0dHlwZTogbWF0Y2hbIDAgXS5yZXBsYWNlKCBydHJpbSwgXCIgXCIgKVxuXHRcdFx0fSApO1xuXHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hlZC5sZW5ndGggKTtcblx0XHR9XG5cblx0XHQvLyBGaWx0ZXJzXG5cdFx0Zm9yICggdHlwZSBpbiBFeHByLmZpbHRlciApIHtcblx0XHRcdGlmICggKCBtYXRjaCA9IG1hdGNoRXhwclsgdHlwZSBdLmV4ZWMoIHNvRmFyICkgKSAmJiAoICFwcmVGaWx0ZXJzWyB0eXBlIF0gfHxcblx0XHRcdFx0KCBtYXRjaCA9IHByZUZpbHRlcnNbIHR5cGUgXSggbWF0Y2ggKSApICkgKSB7XG5cdFx0XHRcdG1hdGNoZWQgPSBtYXRjaC5zaGlmdCgpO1xuXHRcdFx0XHR0b2tlbnMucHVzaCgge1xuXHRcdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXHRcdFx0XHRcdHR5cGU6IHR5cGUsXG5cdFx0XHRcdFx0bWF0Y2hlczogbWF0Y2hcblx0XHRcdFx0fSApO1xuXHRcdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggIW1hdGNoZWQgKSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHQvLyBSZXR1cm4gdGhlIGxlbmd0aCBvZiB0aGUgaW52YWxpZCBleGNlc3Ncblx0Ly8gaWYgd2UncmUganVzdCBwYXJzaW5nXG5cdC8vIE90aGVyd2lzZSwgdGhyb3cgYW4gZXJyb3Igb3IgcmV0dXJuIHRva2Vuc1xuXHRyZXR1cm4gcGFyc2VPbmx5ID9cblx0XHRzb0Zhci5sZW5ndGggOlxuXHRcdHNvRmFyID9cblx0XHRcdFNpenpsZS5lcnJvciggc2VsZWN0b3IgKSA6XG5cblx0XHRcdC8vIENhY2hlIHRoZSB0b2tlbnNcblx0XHRcdHRva2VuQ2FjaGUoIHNlbGVjdG9yLCBncm91cHMgKS5zbGljZSggMCApO1xufTtcblxuZnVuY3Rpb24gdG9TZWxlY3RvciggdG9rZW5zICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gdG9rZW5zLmxlbmd0aCxcblx0XHRzZWxlY3RvciA9IFwiXCI7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdHNlbGVjdG9yICs9IHRva2Vuc1sgaSBdLnZhbHVlO1xuXHR9XG5cdHJldHVybiBzZWxlY3Rvcjtcbn1cblxuZnVuY3Rpb24gYWRkQ29tYmluYXRvciggbWF0Y2hlciwgY29tYmluYXRvciwgYmFzZSApIHtcblx0dmFyIGRpciA9IGNvbWJpbmF0b3IuZGlyLFxuXHRcdHNraXAgPSBjb21iaW5hdG9yLm5leHQsXG5cdFx0a2V5ID0gc2tpcCB8fCBkaXIsXG5cdFx0Y2hlY2tOb25FbGVtZW50cyA9IGJhc2UgJiYga2V5ID09PSBcInBhcmVudE5vZGVcIixcblx0XHRkb25lTmFtZSA9IGRvbmUrKztcblxuXHRyZXR1cm4gY29tYmluYXRvci5maXJzdCA/XG5cblx0XHQvLyBDaGVjayBhZ2FpbnN0IGNsb3Nlc3QgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRcblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRyZXR1cm4gbWF0Y2hlciggZWxlbSwgY29udGV4dCwgeG1sICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IDpcblxuXHRcdC8vIENoZWNrIGFnYWluc3QgYWxsIGFuY2VzdG9yL3ByZWNlZGluZyBlbGVtZW50c1xuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgb2xkQ2FjaGUsIHVuaXF1ZUNhY2hlLCBvdXRlckNhY2hlLFxuXHRcdFx0XHRuZXdDYWNoZSA9IFsgZGlycnVucywgZG9uZU5hbWUgXTtcblxuXHRcdFx0Ly8gV2UgY2FuJ3Qgc2V0IGFyYml0cmFyeSBkYXRhIG9uIFhNTCBub2Rlcywgc28gdGhleSBkb24ndCBiZW5lZml0IGZyb20gY29tYmluYXRvciBjYWNoaW5nXG5cdFx0XHRpZiAoIHhtbCApIHtcblx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtWyBkaXIgXSApICkge1xuXHRcdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdFx0aWYgKCBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gZWxlbVsgZXhwYW5kbyBdIHx8ICggZWxlbVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgPDkgb25seVxuXHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHQoIG91dGVyQ2FjaGVbIGVsZW0udW5pcXVlSUQgXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdGlmICggc2tpcCAmJiBza2lwID09PSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW0gPSBlbGVtWyBkaXIgXSB8fCBlbGVtO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggKCBvbGRDYWNoZSA9IHVuaXF1ZUNhY2hlWyBrZXkgXSApICYmXG5cdFx0XHRcdFx0XHRcdG9sZENhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgb2xkQ2FjaGVbIDEgXSA9PT0gZG9uZU5hbWUgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gQXNzaWduIHRvIG5ld0NhY2hlIHNvIHJlc3VsdHMgYmFjay1wcm9wYWdhdGUgdG8gcHJldmlvdXMgZWxlbWVudHNcblx0XHRcdFx0XHRcdFx0cmV0dXJuICggbmV3Q2FjaGVbIDIgXSA9IG9sZENhY2hlWyAyIF0gKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmV1c2UgbmV3Y2FjaGUgc28gcmVzdWx0cyBiYWNrLXByb3BhZ2F0ZSB0byBwcmV2aW91cyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZVsga2V5IF0gPSBuZXdDYWNoZTtcblxuXHRcdFx0XHRcdFx0XHQvLyBBIG1hdGNoIG1lYW5zIHdlJ3JlIGRvbmU7IGEgZmFpbCBtZWFucyB3ZSBoYXZlIHRvIGtlZXAgY2hlY2tpbmdcblx0XHRcdFx0XHRcdFx0aWYgKCAoIG5ld0NhY2hlWyAyIF0gPSBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcbn1cblxuZnVuY3Rpb24gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICkge1xuXHRyZXR1cm4gbWF0Y2hlcnMubGVuZ3RoID4gMSA/XG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBpID0gbWF0Y2hlcnMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggIW1hdGNoZXJzWyBpIF0oIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSA6XG5cdFx0bWF0Y2hlcnNbIDAgXTtcbn1cblxuZnVuY3Rpb24gbXVsdGlwbGVDb250ZXh0cyggc2VsZWN0b3IsIGNvbnRleHRzLCByZXN1bHRzICkge1xuXHR2YXIgaSA9IDAsXG5cdFx0bGVuID0gY29udGV4dHMubGVuZ3RoO1xuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRTaXp6bGUoIHNlbGVjdG9yLCBjb250ZXh0c1sgaSBdLCByZXN1bHRzICk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGNvbmRlbnNlKCB1bm1hdGNoZWQsIG1hcCwgZmlsdGVyLCBjb250ZXh0LCB4bWwgKSB7XG5cdHZhciBlbGVtLFxuXHRcdG5ld1VubWF0Y2hlZCA9IFtdLFxuXHRcdGkgPSAwLFxuXHRcdGxlbiA9IHVubWF0Y2hlZC5sZW5ndGgsXG5cdFx0bWFwcGVkID0gbWFwICE9IG51bGw7XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoIGVsZW0gPSB1bm1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0aWYgKCAhZmlsdGVyIHx8IGZpbHRlciggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdG5ld1VubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdGlmICggbWFwcGVkICkge1xuXHRcdFx0XHRcdG1hcC5wdXNoKCBpICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbmV3VW5tYXRjaGVkO1xufVxuXG5mdW5jdGlvbiBzZXRNYXRjaGVyKCBwcmVGaWx0ZXIsIHNlbGVjdG9yLCBtYXRjaGVyLCBwb3N0RmlsdGVyLCBwb3N0RmluZGVyLCBwb3N0U2VsZWN0b3IgKSB7XG5cdGlmICggcG9zdEZpbHRlciAmJiAhcG9zdEZpbHRlclsgZXhwYW5kbyBdICkge1xuXHRcdHBvc3RGaWx0ZXIgPSBzZXRNYXRjaGVyKCBwb3N0RmlsdGVyICk7XG5cdH1cblx0aWYgKCBwb3N0RmluZGVyICYmICFwb3N0RmluZGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbmRlciA9IHNldE1hdGNoZXIoIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApO1xuXHR9XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCByZXN1bHRzLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0dmFyIHRlbXAsIGksIGVsZW0sXG5cdFx0XHRwcmVNYXAgPSBbXSxcblx0XHRcdHBvc3RNYXAgPSBbXSxcblx0XHRcdHByZWV4aXN0aW5nID0gcmVzdWx0cy5sZW5ndGgsXG5cblx0XHRcdC8vIEdldCBpbml0aWFsIGVsZW1lbnRzIGZyb20gc2VlZCBvciBjb250ZXh0XG5cdFx0XHRlbGVtcyA9IHNlZWQgfHwgbXVsdGlwbGVDb250ZXh0cyhcblx0XHRcdFx0c2VsZWN0b3IgfHwgXCIqXCIsXG5cdFx0XHRcdGNvbnRleHQubm9kZVR5cGUgPyBbIGNvbnRleHQgXSA6IGNvbnRleHQsXG5cdFx0XHRcdFtdXG5cdFx0XHQpLFxuXG5cdFx0XHQvLyBQcmVmaWx0ZXIgdG8gZ2V0IG1hdGNoZXIgaW5wdXQsIHByZXNlcnZpbmcgYSBtYXAgZm9yIHNlZWQtcmVzdWx0cyBzeW5jaHJvbml6YXRpb25cblx0XHRcdG1hdGNoZXJJbiA9IHByZUZpbHRlciAmJiAoIHNlZWQgfHwgIXNlbGVjdG9yICkgP1xuXHRcdFx0XHRjb25kZW5zZSggZWxlbXMsIHByZU1hcCwgcHJlRmlsdGVyLCBjb250ZXh0LCB4bWwgKSA6XG5cdFx0XHRcdGVsZW1zLFxuXG5cdFx0XHRtYXRjaGVyT3V0ID0gbWF0Y2hlciA/XG5cblx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBhIHBvc3RGaW5kZXIsIG9yIGZpbHRlcmVkIHNlZWQsIG9yIG5vbi1zZWVkIHBvc3RGaWx0ZXIgb3IgcHJlZXhpc3RpbmcgcmVzdWx0cyxcblx0XHRcdFx0cG9zdEZpbmRlciB8fCAoIHNlZWQgPyBwcmVGaWx0ZXIgOiBwcmVleGlzdGluZyB8fCBwb3N0RmlsdGVyICkgP1xuXG5cdFx0XHRcdFx0Ly8gLi4uaW50ZXJtZWRpYXRlIHByb2Nlc3NpbmcgaXMgbmVjZXNzYXJ5XG5cdFx0XHRcdFx0W10gOlxuXG5cdFx0XHRcdFx0Ly8gLi4ub3RoZXJ3aXNlIHVzZSByZXN1bHRzIGRpcmVjdGx5XG5cdFx0XHRcdFx0cmVzdWx0cyA6XG5cdFx0XHRcdG1hdGNoZXJJbjtcblxuXHRcdC8vIEZpbmQgcHJpbWFyeSBtYXRjaGVzXG5cdFx0aWYgKCBtYXRjaGVyICkge1xuXHRcdFx0bWF0Y2hlciggbWF0Y2hlckluLCBtYXRjaGVyT3V0LCBjb250ZXh0LCB4bWwgKTtcblx0XHR9XG5cblx0XHQvLyBBcHBseSBwb3N0RmlsdGVyXG5cdFx0aWYgKCBwb3N0RmlsdGVyICkge1xuXHRcdFx0dGVtcCA9IGNvbmRlbnNlKCBtYXRjaGVyT3V0LCBwb3N0TWFwICk7XG5cdFx0XHRwb3N0RmlsdGVyKCB0ZW1wLCBbXSwgY29udGV4dCwgeG1sICk7XG5cblx0XHRcdC8vIFVuLW1hdGNoIGZhaWxpbmcgZWxlbWVudHMgYnkgbW92aW5nIHRoZW0gYmFjayB0byBtYXRjaGVySW5cblx0XHRcdGkgPSB0ZW1wLmxlbmd0aDtcblx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRpZiAoICggZWxlbSA9IHRlbXBbIGkgXSApICkge1xuXHRcdFx0XHRcdG1hdGNoZXJPdXRbIHBvc3RNYXBbIGkgXSBdID0gISggbWF0Y2hlckluWyBwb3N0TWFwWyBpIF0gXSA9IGVsZW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICggc2VlZCApIHtcblx0XHRcdGlmICggcG9zdEZpbmRlciB8fCBwcmVGaWx0ZXIgKSB7XG5cdFx0XHRcdGlmICggcG9zdEZpbmRlciApIHtcblxuXHRcdFx0XHRcdC8vIEdldCB0aGUgZmluYWwgbWF0Y2hlck91dCBieSBjb25kZW5zaW5nIHRoaXMgaW50ZXJtZWRpYXRlIGludG8gcG9zdEZpbmRlciBjb250ZXh0c1xuXHRcdFx0XHRcdHRlbXAgPSBbXTtcblx0XHRcdFx0XHRpID0gbWF0Y2hlck91dC5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IG1hdGNoZXJPdXRbIGkgXSApICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFJlc3RvcmUgbWF0Y2hlckluIHNpbmNlIGVsZW0gaXMgbm90IHlldCBhIGZpbmFsIG1hdGNoXG5cdFx0XHRcdFx0XHRcdHRlbXAucHVzaCggKCBtYXRjaGVySW5bIGkgXSA9IGVsZW0gKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCAoIG1hdGNoZXJPdXQgPSBbXSApLCB0ZW1wLCB4bWwgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIE1vdmUgbWF0Y2hlZCBlbGVtZW50cyBmcm9tIHNlZWQgdG8gcmVzdWx0cyB0byBrZWVwIHRoZW0gc3luY2hyb25pemVkXG5cdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSBtYXRjaGVyT3V0WyBpIF0gKSAmJlxuXHRcdFx0XHRcdFx0KCB0ZW1wID0gcG9zdEZpbmRlciA/IGluZGV4T2YoIHNlZWQsIGVsZW0gKSA6IHByZU1hcFsgaSBdICkgPiAtMSApIHtcblxuXHRcdFx0XHRcdFx0c2VlZFsgdGVtcCBdID0gISggcmVzdWx0c1sgdGVtcCBdID0gZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0Ly8gQWRkIGVsZW1lbnRzIHRvIHJlc3VsdHMsIHRocm91Z2ggcG9zdEZpbmRlciBpZiBkZWZpbmVkXG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXJPdXQgPSBjb25kZW5zZShcblx0XHRcdFx0bWF0Y2hlck91dCA9PT0gcmVzdWx0cyA/XG5cdFx0XHRcdFx0bWF0Y2hlck91dC5zcGxpY2UoIHByZWV4aXN0aW5nLCBtYXRjaGVyT3V0Lmxlbmd0aCApIDpcblx0XHRcdFx0XHRtYXRjaGVyT3V0XG5cdFx0XHQpO1xuXHRcdFx0aWYgKCBwb3N0RmluZGVyICkge1xuXHRcdFx0XHRwb3N0RmluZGVyKCBudWxsLCByZXN1bHRzLCBtYXRjaGVyT3V0LCB4bWwgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIG1hdGNoZXJPdXQgKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlckZyb21Ub2tlbnMoIHRva2VucyApIHtcblx0dmFyIGNoZWNrQ29udGV4dCwgbWF0Y2hlciwgaixcblx0XHRsZW4gPSB0b2tlbnMubGVuZ3RoLFxuXHRcdGxlYWRpbmdSZWxhdGl2ZSA9IEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgMCBdLnR5cGUgXSxcblx0XHRpbXBsaWNpdFJlbGF0aXZlID0gbGVhZGluZ1JlbGF0aXZlIHx8IEV4cHIucmVsYXRpdmVbIFwiIFwiIF0sXG5cdFx0aSA9IGxlYWRpbmdSZWxhdGl2ZSA/IDEgOiAwLFxuXG5cdFx0Ly8gVGhlIGZvdW5kYXRpb25hbCBtYXRjaGVyIGVuc3VyZXMgdGhhdCBlbGVtZW50cyBhcmUgcmVhY2hhYmxlIGZyb20gdG9wLWxldmVsIGNvbnRleHQocylcblx0XHRtYXRjaENvbnRleHQgPSBhZGRDb21iaW5hdG9yKCBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBjaGVja0NvbnRleHQ7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoQW55Q29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGluZGV4T2YoIGNoZWNrQ29udGV4dCwgZWxlbSApID4gLTE7XG5cdFx0fSwgaW1wbGljaXRSZWxhdGl2ZSwgdHJ1ZSApLFxuXHRcdG1hdGNoZXJzID0gWyBmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIHJldCA9ICggIWxlYWRpbmdSZWxhdGl2ZSAmJiAoIHhtbCB8fCBjb250ZXh0ICE9PSBvdXRlcm1vc3RDb250ZXh0ICkgKSB8fCAoXG5cdFx0XHRcdCggY2hlY2tDb250ZXh0ID0gY29udGV4dCApLm5vZGVUeXBlID9cblx0XHRcdFx0XHRtYXRjaENvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0XHRtYXRjaEFueUNvbnRleHQoIGVsZW0sIGNvbnRleHQsIHhtbCApICk7XG5cblx0XHRcdC8vIEF2b2lkIGhhbmdpbmcgb250byBlbGVtZW50IChpc3N1ZSAjMjk5KVxuXHRcdFx0Y2hlY2tDb250ZXh0ID0gbnVsbDtcblx0XHRcdHJldHVybiByZXQ7XG5cdFx0fSBdO1xuXG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdGlmICggKCBtYXRjaGVyID0gRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyBpIF0udHlwZSBdICkgKSB7XG5cdFx0XHRtYXRjaGVycyA9IFsgYWRkQ29tYmluYXRvciggZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksIG1hdGNoZXIgKSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtYXRjaGVyID0gRXhwci5maWx0ZXJbIHRva2Vuc1sgaSBdLnR5cGUgXS5hcHBseSggbnVsbCwgdG9rZW5zWyBpIF0ubWF0Y2hlcyApO1xuXG5cdFx0XHQvLyBSZXR1cm4gc3BlY2lhbCB1cG9uIHNlZWluZyBhIHBvc2l0aW9uYWwgbWF0Y2hlclxuXHRcdFx0aWYgKCBtYXRjaGVyWyBleHBhbmRvIF0gKSB7XG5cblx0XHRcdFx0Ly8gRmluZCB0aGUgbmV4dCByZWxhdGl2ZSBvcGVyYXRvciAoaWYgYW55KSBmb3IgcHJvcGVyIGhhbmRsaW5nXG5cdFx0XHRcdGogPSArK2k7XG5cdFx0XHRcdGZvciAoIDsgaiA8IGxlbjsgaisrICkge1xuXHRcdFx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyBqIF0udHlwZSBdICkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBzZXRNYXRjaGVyKFxuXHRcdFx0XHRcdGkgPiAxICYmIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApLFxuXHRcdFx0XHRcdGkgPiAxICYmIHRvU2VsZWN0b3IoXG5cblx0XHRcdFx0XHQvLyBJZiB0aGUgcHJlY2VkaW5nIHRva2VuIHdhcyBhIGRlc2NlbmRhbnQgY29tYmluYXRvciwgaW5zZXJ0IGFuIGltcGxpY2l0IGFueS1lbGVtZW50IGAqYFxuXHRcdFx0XHRcdHRva2Vuc1xuXHRcdFx0XHRcdFx0LnNsaWNlKCAwLCBpIC0gMSApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCB7IHZhbHVlOiB0b2tlbnNbIGkgLSAyIF0udHlwZSA9PT0gXCIgXCIgPyBcIipcIiA6IFwiXCIgfSApXG5cdFx0XHRcdFx0KS5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksXG5cdFx0XHRcdFx0bWF0Y2hlcixcblx0XHRcdFx0XHRpIDwgaiAmJiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zLnNsaWNlKCBpLCBqICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIG1hdGNoZXJGcm9tVG9rZW5zKCAoIHRva2VucyA9IHRva2Vucy5zbGljZSggaiApICkgKSxcblx0XHRcdFx0XHRqIDwgbGVuICYmIHRvU2VsZWN0b3IoIHRva2VucyApXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0XHRtYXRjaGVycy5wdXNoKCBtYXRjaGVyICk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGVsZW1lbnRNYXRjaGVyKCBtYXRjaGVycyApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKSB7XG5cdHZhciBieVNldCA9IHNldE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0YnlFbGVtZW50ID0gZWxlbWVudE1hdGNoZXJzLmxlbmd0aCA+IDAsXG5cdFx0c3VwZXJNYXRjaGVyID0gZnVuY3Rpb24oIHNlZWQsIGNvbnRleHQsIHhtbCwgcmVzdWx0cywgb3V0ZXJtb3N0ICkge1xuXHRcdFx0dmFyIGVsZW0sIGosIG1hdGNoZXIsXG5cdFx0XHRcdG1hdGNoZWRDb3VudCA9IDAsXG5cdFx0XHRcdGkgPSBcIjBcIixcblx0XHRcdFx0dW5tYXRjaGVkID0gc2VlZCAmJiBbXSxcblx0XHRcdFx0c2V0TWF0Y2hlZCA9IFtdLFxuXHRcdFx0XHRjb250ZXh0QmFja3VwID0gb3V0ZXJtb3N0Q29udGV4dCxcblxuXHRcdFx0XHQvLyBXZSBtdXN0IGFsd2F5cyBoYXZlIGVpdGhlciBzZWVkIGVsZW1lbnRzIG9yIG91dGVybW9zdCBjb250ZXh0XG5cdFx0XHRcdGVsZW1zID0gc2VlZCB8fCBieUVsZW1lbnQgJiYgRXhwci5maW5kWyBcIlRBR1wiIF0oIFwiKlwiLCBvdXRlcm1vc3QgKSxcblxuXHRcdFx0XHQvLyBVc2UgaW50ZWdlciBkaXJydW5zIGlmZiB0aGlzIGlzIHRoZSBvdXRlcm1vc3QgbWF0Y2hlclxuXHRcdFx0XHRkaXJydW5zVW5pcXVlID0gKCBkaXJydW5zICs9IGNvbnRleHRCYWNrdXAgPT0gbnVsbCA/IDEgOiBNYXRoLnJhbmRvbSgpIHx8IDAuMSApLFxuXHRcdFx0XHRsZW4gPSBlbGVtcy5sZW5ndGg7XG5cblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0ID09IGRvY3VtZW50IHx8IGNvbnRleHQgfHwgb3V0ZXJtb3N0O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBZGQgZWxlbWVudHMgcGFzc2luZyBlbGVtZW50TWF0Y2hlcnMgZGlyZWN0bHkgdG8gcmVzdWx0c1xuXHRcdFx0Ly8gU3VwcG9ydDogSUU8OSwgU2FmYXJpXG5cdFx0XHQvLyBUb2xlcmF0ZSBOb2RlTGlzdCBwcm9wZXJ0aWVzIChJRTogXCJsZW5ndGhcIjsgU2FmYXJpOiA8bnVtYmVyPikgbWF0Y2hpbmcgZWxlbWVudHMgYnkgaWRcblx0XHRcdGZvciAoIDsgaSAhPT0gbGVuICYmICggZWxlbSA9IGVsZW1zWyBpIF0gKSAhPSBudWxsOyBpKysgKSB7XG5cdFx0XHRcdGlmICggYnlFbGVtZW50ICYmIGVsZW0gKSB7XG5cdFx0XHRcdFx0aiA9IDA7XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0XHRcdGlmICggIWNvbnRleHQgJiYgZWxlbS5vd25lckRvY3VtZW50ICE9IGRvY3VtZW50ICkge1xuXHRcdFx0XHRcdFx0c2V0RG9jdW1lbnQoIGVsZW0gKTtcblx0XHRcdFx0XHRcdHhtbCA9ICFkb2N1bWVudElzSFRNTDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoZXIgPSBlbGVtZW50TWF0Y2hlcnNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQgfHwgZG9jdW1lbnQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVHJhY2sgdW5tYXRjaGVkIGVsZW1lbnRzIGZvciBzZXQgZmlsdGVyc1xuXHRcdFx0XHRpZiAoIGJ5U2V0ICkge1xuXG5cdFx0XHRcdFx0Ly8gVGhleSB3aWxsIGhhdmUgZ29uZSB0aHJvdWdoIGFsbCBwb3NzaWJsZSBtYXRjaGVyc1xuXHRcdFx0XHRcdGlmICggKCBlbGVtID0gIW1hdGNoZXIgJiYgZWxlbSApICkge1xuXHRcdFx0XHRcdFx0bWF0Y2hlZENvdW50LS07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gTGVuZ3RoZW4gdGhlIGFycmF5IGZvciBldmVyeSBlbGVtZW50LCBtYXRjaGVkIG9yIG5vdFxuXHRcdFx0XHRcdGlmICggc2VlZCApIHtcblx0XHRcdFx0XHRcdHVubWF0Y2hlZC5wdXNoKCBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIGBpYCBpcyBub3cgdGhlIGNvdW50IG9mIGVsZW1lbnRzIHZpc2l0ZWQgYWJvdmUsIGFuZCBhZGRpbmcgaXQgdG8gYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIG1ha2VzIHRoZSBsYXR0ZXIgbm9ubmVnYXRpdmUuXG5cdFx0XHRtYXRjaGVkQ291bnQgKz0gaTtcblxuXHRcdFx0Ly8gQXBwbHkgc2V0IGZpbHRlcnMgdG8gdW5tYXRjaGVkIGVsZW1lbnRzXG5cdFx0XHQvLyBOT1RFOiBUaGlzIGNhbiBiZSBza2lwcGVkIGlmIHRoZXJlIGFyZSBubyB1bm1hdGNoZWQgZWxlbWVudHMgKGkuZS4sIGBtYXRjaGVkQ291bnRgXG5cdFx0XHQvLyBlcXVhbHMgYGlgKSwgdW5sZXNzIHdlIGRpZG4ndCB2aXNpdCBfYW55XyBlbGVtZW50cyBpbiB0aGUgYWJvdmUgbG9vcCBiZWNhdXNlIHdlIGhhdmVcblx0XHRcdC8vIG5vIGVsZW1lbnQgbWF0Y2hlcnMgYW5kIG5vIHNlZWQuXG5cdFx0XHQvLyBJbmNyZW1lbnRpbmcgYW4gaW5pdGlhbGx5LXN0cmluZyBcIjBcIiBgaWAgYWxsb3dzIGBpYCB0byByZW1haW4gYSBzdHJpbmcgb25seSBpbiB0aGF0XG5cdFx0XHQvLyBjYXNlLCB3aGljaCB3aWxsIHJlc3VsdCBpbiBhIFwiMDBcIiBgbWF0Y2hlZENvdW50YCB0aGF0IGRpZmZlcnMgZnJvbSBgaWAgYnV0IGlzIGFsc29cblx0XHRcdC8vIG51bWVyaWNhbGx5IHplcm8uXG5cdFx0XHRpZiAoIGJ5U2V0ICYmIGkgIT09IG1hdGNoZWRDb3VudCApIHtcblx0XHRcdFx0aiA9IDA7XG5cdFx0XHRcdHdoaWxlICggKCBtYXRjaGVyID0gc2V0TWF0Y2hlcnNbIGorKyBdICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlciggdW5tYXRjaGVkLCBzZXRNYXRjaGVkLCBjb250ZXh0LCB4bWwgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggc2VlZCApIHtcblxuXHRcdFx0XHRcdC8vIFJlaW50ZWdyYXRlIGVsZW1lbnQgbWF0Y2hlcyB0byBlbGltaW5hdGUgdGhlIG5lZWQgZm9yIHNvcnRpbmdcblx0XHRcdFx0XHRpZiAoIG1hdGNoZWRDb3VudCA+IDAgKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCAhKCB1bm1hdGNoZWRbIGkgXSB8fCBzZXRNYXRjaGVkWyBpIF0gKSApIHtcblx0XHRcdFx0XHRcdFx0XHRzZXRNYXRjaGVkWyBpIF0gPSBwb3AuY2FsbCggcmVzdWx0cyApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gRGlzY2FyZCBpbmRleCBwbGFjZWhvbGRlciB2YWx1ZXMgdG8gZ2V0IG9ubHkgYWN0dWFsIG1hdGNoZXNcblx0XHRcdFx0XHRzZXRNYXRjaGVkID0gY29uZGVuc2UoIHNldE1hdGNoZWQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFkZCBtYXRjaGVzIHRvIHJlc3VsdHNcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgc2V0TWF0Y2hlZCApO1xuXG5cdFx0XHRcdC8vIFNlZWRsZXNzIHNldCBtYXRjaGVzIHN1Y2NlZWRpbmcgbXVsdGlwbGUgc3VjY2Vzc2Z1bCBtYXRjaGVycyBzdGlwdWxhdGUgc29ydGluZ1xuXHRcdFx0XHRpZiAoIG91dGVybW9zdCAmJiAhc2VlZCAmJiBzZXRNYXRjaGVkLmxlbmd0aCA+IDAgJiZcblx0XHRcdFx0XHQoIG1hdGNoZWRDb3VudCArIHNldE1hdGNoZXJzLmxlbmd0aCApID4gMSApIHtcblxuXHRcdFx0XHRcdFNpenpsZS51bmlxdWVTb3J0KCByZXN1bHRzICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gT3ZlcnJpZGUgbWFuaXB1bGF0aW9uIG9mIGdsb2JhbHMgYnkgbmVzdGVkIG1hdGNoZXJzXG5cdFx0XHRpZiAoIG91dGVybW9zdCApIHtcblx0XHRcdFx0ZGlycnVucyA9IGRpcnJ1bnNVbmlxdWU7XG5cdFx0XHRcdG91dGVybW9zdENvbnRleHQgPSBjb250ZXh0QmFja3VwO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5tYXRjaGVkO1xuXHRcdH07XG5cblx0cmV0dXJuIGJ5U2V0ID9cblx0XHRtYXJrRnVuY3Rpb24oIHN1cGVyTWF0Y2hlciApIDpcblx0XHRzdXBlck1hdGNoZXI7XG59XG5cbmNvbXBpbGUgPSBTaXp6bGUuY29tcGlsZSA9IGZ1bmN0aW9uKCBzZWxlY3RvciwgbWF0Y2ggLyogSW50ZXJuYWwgVXNlIE9ubHkgKi8gKSB7XG5cdHZhciBpLFxuXHRcdHNldE1hdGNoZXJzID0gW10sXG5cdFx0ZWxlbWVudE1hdGNoZXJzID0gW10sXG5cdFx0Y2FjaGVkID0gY29tcGlsZXJDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggIWNhY2hlZCApIHtcblxuXHRcdC8vIEdlbmVyYXRlIGEgZnVuY3Rpb24gb2YgcmVjdXJzaXZlIGZ1bmN0aW9ucyB0aGF0IGNhbiBiZSB1c2VkIHRvIGNoZWNrIGVhY2ggZWxlbWVudFxuXHRcdGlmICggIW1hdGNoICkge1xuXHRcdFx0bWF0Y2ggPSB0b2tlbml6ZSggc2VsZWN0b3IgKTtcblx0XHR9XG5cdFx0aSA9IG1hdGNoLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdGNhY2hlZCA9IG1hdGNoZXJGcm9tVG9rZW5zKCBtYXRjaFsgaSBdICk7XG5cdFx0XHRpZiAoIGNhY2hlZFsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRzZXRNYXRjaGVycy5wdXNoKCBjYWNoZWQgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnRNYXRjaGVycy5wdXNoKCBjYWNoZWQgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDYWNoZSB0aGUgY29tcGlsZWQgZnVuY3Rpb25cblx0XHRjYWNoZWQgPSBjb21waWxlckNhY2hlKFxuXHRcdFx0c2VsZWN0b3IsXG5cdFx0XHRtYXRjaGVyRnJvbUdyb3VwTWF0Y2hlcnMoIGVsZW1lbnRNYXRjaGVycywgc2V0TWF0Y2hlcnMgKVxuXHRcdCk7XG5cblx0XHQvLyBTYXZlIHNlbGVjdG9yIGFuZCB0b2tlbml6YXRpb25cblx0XHRjYWNoZWQuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcblx0fVxuXHRyZXR1cm4gY2FjaGVkO1xufTtcblxuLyoqXG4gKiBBIGxvdy1sZXZlbCBzZWxlY3Rpb24gZnVuY3Rpb24gdGhhdCB3b3JrcyB3aXRoIFNpenpsZSdzIGNvbXBpbGVkXG4gKiAgc2VsZWN0b3IgZnVuY3Rpb25zXG4gKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gc2VsZWN0b3IgQSBzZWxlY3RvciBvciBhIHByZS1jb21waWxlZFxuICogIHNlbGVjdG9yIGZ1bmN0aW9uIGJ1aWx0IHdpdGggU2l6emxlLmNvbXBpbGVcbiAqIEBwYXJhbSB7RWxlbWVudH0gY29udGV4dFxuICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdHNdXG4gKiBAcGFyYW0ge0FycmF5fSBbc2VlZF0gQSBzZXQgb2YgZWxlbWVudHMgdG8gbWF0Y2ggYWdhaW5zdFxuICovXG5zZWxlY3QgPSBTaXp6bGUuc2VsZWN0ID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBjb250ZXh0LCByZXN1bHRzLCBzZWVkICkge1xuXHR2YXIgaSwgdG9rZW5zLCB0b2tlbiwgdHlwZSwgZmluZCxcblx0XHRjb21waWxlZCA9IHR5cGVvZiBzZWxlY3RvciA9PT0gXCJmdW5jdGlvblwiICYmIHNlbGVjdG9yLFxuXHRcdG1hdGNoID0gIXNlZWQgJiYgdG9rZW5pemUoICggc2VsZWN0b3IgPSBjb21waWxlZC5zZWxlY3RvciB8fCBzZWxlY3RvciApICk7XG5cblx0cmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XG5cblx0Ly8gVHJ5IHRvIG1pbmltaXplIG9wZXJhdGlvbnMgaWYgdGhlcmUgaXMgb25seSBvbmUgc2VsZWN0b3IgaW4gdGhlIGxpc3QgYW5kIG5vIHNlZWRcblx0Ly8gKHRoZSBsYXR0ZXIgb2Ygd2hpY2ggZ3VhcmFudGVlcyB1cyBjb250ZXh0KVxuXHRpZiAoIG1hdGNoLmxlbmd0aCA9PT0gMSApIHtcblxuXHRcdC8vIFJlZHVjZSBjb250ZXh0IGlmIHRoZSBsZWFkaW5nIGNvbXBvdW5kIHNlbGVjdG9yIGlzIGFuIElEXG5cdFx0dG9rZW5zID0gbWF0Y2hbIDAgXSA9IG1hdGNoWyAwIF0uc2xpY2UoIDAgKTtcblx0XHRpZiAoIHRva2Vucy5sZW5ndGggPiAyICYmICggdG9rZW4gPSB0b2tlbnNbIDAgXSApLnR5cGUgPT09IFwiSURcIiAmJlxuXHRcdFx0Y29udGV4dC5ub2RlVHlwZSA9PT0gOSAmJiBkb2N1bWVudElzSFRNTCAmJiBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIDEgXS50eXBlIF0gKSB7XG5cblx0XHRcdGNvbnRleHQgPSAoIEV4cHIuZmluZFsgXCJJRFwiIF0oIHRva2VuLm1hdGNoZXNbIDAgXVxuXHRcdFx0XHQucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKSwgY29udGV4dCApIHx8IFtdIClbIDAgXTtcblx0XHRcdGlmICggIWNvbnRleHQgKSB7XG5cdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXG5cdFx0XHQvLyBQcmVjb21waWxlZCBtYXRjaGVycyB3aWxsIHN0aWxsIHZlcmlmeSBhbmNlc3RyeSwgc28gc3RlcCB1cCBhIGxldmVsXG5cdFx0XHR9IGVsc2UgaWYgKCBjb21waWxlZCApIHtcblx0XHRcdFx0Y29udGV4dCA9IGNvbnRleHQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zbGljZSggdG9rZW5zLnNoaWZ0KCkudmFsdWUubGVuZ3RoICk7XG5cdFx0fVxuXG5cdFx0Ly8gRmV0Y2ggYSBzZWVkIHNldCBmb3IgcmlnaHQtdG8tbGVmdCBtYXRjaGluZ1xuXHRcdGkgPSBtYXRjaEV4cHJbIFwibmVlZHNDb250ZXh0XCIgXS50ZXN0KCBzZWxlY3RvciApID8gMCA6IHRva2Vucy5sZW5ndGg7XG5cdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHR0b2tlbiA9IHRva2Vuc1sgaSBdO1xuXG5cdFx0XHQvLyBBYm9ydCBpZiB3ZSBoaXQgYSBjb21iaW5hdG9yXG5cdFx0XHRpZiAoIEV4cHIucmVsYXRpdmVbICggdHlwZSA9IHRva2VuLnR5cGUgKSBdICkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmICggKCBmaW5kID0gRXhwci5maW5kWyB0eXBlIF0gKSApIHtcblxuXHRcdFx0XHQvLyBTZWFyY2gsIGV4cGFuZGluZyBjb250ZXh0IGZvciBsZWFkaW5nIHNpYmxpbmcgY29tYmluYXRvcnNcblx0XHRcdFx0aWYgKCAoIHNlZWQgPSBmaW5kKFxuXHRcdFx0XHRcdHRva2VuLm1hdGNoZXNbIDAgXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLFxuXHRcdFx0XHRcdHJzaWJsaW5nLnRlc3QoIHRva2Vuc1sgMCBdLnR5cGUgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHxcblx0XHRcdFx0XHRcdGNvbnRleHRcblx0XHRcdFx0KSApICkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgc2VlZCBpcyBlbXB0eSBvciBubyB0b2tlbnMgcmVtYWluLCB3ZSBjYW4gcmV0dXJuIGVhcmx5XG5cdFx0XHRcdFx0dG9rZW5zLnNwbGljZSggaSwgMSApO1xuXHRcdFx0XHRcdHNlbGVjdG9yID0gc2VlZC5sZW5ndGggJiYgdG9TZWxlY3RvciggdG9rZW5zICk7XG5cdFx0XHRcdFx0aWYgKCAhc2VsZWN0b3IgKSB7XG5cdFx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBzZWVkICk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIENvbXBpbGUgYW5kIGV4ZWN1dGUgYSBmaWx0ZXJpbmcgZnVuY3Rpb24gaWYgb25lIGlzIG5vdCBwcm92aWRlZFxuXHQvLyBQcm92aWRlIGBtYXRjaGAgdG8gYXZvaWQgcmV0b2tlbml6YXRpb24gaWYgd2UgbW9kaWZpZWQgdGhlIHNlbGVjdG9yIGFib3ZlXG5cdCggY29tcGlsZWQgfHwgY29tcGlsZSggc2VsZWN0b3IsIG1hdGNoICkgKShcblx0XHRzZWVkLFxuXHRcdGNvbnRleHQsXG5cdFx0IWRvY3VtZW50SXNIVE1MLFxuXHRcdHJlc3VsdHMsXG5cdFx0IWNvbnRleHQgfHwgcnNpYmxpbmcudGVzdCggc2VsZWN0b3IgKSAmJiB0ZXN0Q29udGV4dCggY29udGV4dC5wYXJlbnROb2RlICkgfHwgY29udGV4dFxuXHQpO1xuXHRyZXR1cm4gcmVzdWx0cztcbn07XG5cbi8vIE9uZS10aW1lIGFzc2lnbm1lbnRzXG5cbi8vIFNvcnQgc3RhYmlsaXR5XG5zdXBwb3J0LnNvcnRTdGFibGUgPSBleHBhbmRvLnNwbGl0KCBcIlwiICkuc29ydCggc29ydE9yZGVyICkuam9pbiggXCJcIiApID09PSBleHBhbmRvO1xuXG4vLyBTdXBwb3J0OiBDaHJvbWUgMTQtMzUrXG4vLyBBbHdheXMgYXNzdW1lIGR1cGxpY2F0ZXMgaWYgdGhleSBhcmVuJ3QgcGFzc2VkIHRvIHRoZSBjb21wYXJpc29uIGZ1bmN0aW9uXG5zdXBwb3J0LmRldGVjdER1cGxpY2F0ZXMgPSAhIWhhc0R1cGxpY2F0ZTtcblxuLy8gSW5pdGlhbGl6ZSBhZ2FpbnN0IHRoZSBkZWZhdWx0IGRvY3VtZW50XG5zZXREb2N1bWVudCgpO1xuXG4vLyBTdXBwb3J0OiBXZWJraXQ8NTM3LjMyIC0gU2FmYXJpIDYuMC4zL0Nocm9tZSAyNSAoZml4ZWQgaW4gQ2hyb21lIDI3KVxuLy8gRGV0YWNoZWQgbm9kZXMgY29uZm91bmRpbmdseSBmb2xsb3cgKmVhY2ggb3RoZXIqXG5zdXBwb3J0LnNvcnREZXRhY2hlZCA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXG5cdC8vIFNob3VsZCByZXR1cm4gMSwgYnV0IHJldHVybnMgNCAoZm9sbG93aW5nKVxuXHRyZXR1cm4gZWwuY29tcGFyZURvY3VtZW50UG9zaXRpb24oIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZmllbGRzZXRcIiApICkgJiAxO1xufSApO1xuXG4vLyBTdXBwb3J0OiBJRTw4XG4vLyBQcmV2ZW50IGF0dHJpYnV0ZS9wcm9wZXJ0eSBcImludGVycG9sYXRpb25cIlxuLy8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzNjQyOSUyOFZTLjg1JTI5LmFzcHhcbmlmICggIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRlbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9JyMnPjwvYT5cIjtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCBcImhyZWZcIiApID09PSBcIiNcIjtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBcInR5cGV8aHJlZnxoZWlnaHR8d2lkdGhcIiwgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdGlmICggIWlzWE1MICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKCBuYW1lLCBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwidHlwZVwiID8gMSA6IDIgKTtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gU3VwcG9ydDogSUU8OVxuLy8gVXNlIGRlZmF1bHRWYWx1ZSBpbiBwbGFjZSBvZiBnZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiKVxuaWYgKCAhc3VwcG9ydC5hdHRyaWJ1dGVzIHx8ICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0ZWwuaW5uZXJIVE1MID0gXCI8aW5wdXQvPlwiO1xuXHRlbC5maXJzdENoaWxkLnNldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiLCBcIlwiICk7XG5cdHJldHVybiBlbC5maXJzdENoaWxkLmdldEF0dHJpYnV0ZSggXCJ2YWx1ZVwiICkgPT09IFwiXCI7XG59ICkgKSB7XG5cdGFkZEhhbmRsZSggXCJ2YWx1ZVwiLCBmdW5jdGlvbiggZWxlbSwgX25hbWUsIGlzWE1MICkge1xuXHRcdGlmICggIWlzWE1MICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbnB1dFwiICkge1xuXHRcdFx0cmV0dXJuIGVsZW0uZGVmYXVsdFZhbHVlO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBTdXBwb3J0OiBJRTw5XG4vLyBVc2UgZ2V0QXR0cmlidXRlTm9kZSB0byBmZXRjaCBib29sZWFucyB3aGVuIGdldEF0dHJpYnV0ZSBsaWVzXG5pZiAoICFhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblx0cmV0dXJuIGVsLmdldEF0dHJpYnV0ZSggXCJkaXNhYmxlZFwiICkgPT0gbnVsbDtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBib29sZWFucywgZnVuY3Rpb24oIGVsZW0sIG5hbWUsIGlzWE1MICkge1xuXHRcdHZhciB2YWw7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbVsgbmFtZSBdID09PSB0cnVlID8gbmFtZS50b0xvd2VyQ2FzZSgpIDpcblx0XHRcdFx0KCB2YWwgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIG5hbWUgKSApICYmIHZhbC5zcGVjaWZpZWQgP1xuXHRcdFx0XHRcdHZhbC52YWx1ZSA6XG5cdFx0XHRcdFx0bnVsbDtcblx0XHR9XG5cdH0gKTtcbn1cblxuLy8gRVhQT1NFXG52YXIgX3NpenpsZSA9IHdpbmRvdy5TaXp6bGU7XG5cblNpenpsZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICggd2luZG93LlNpenpsZSA9PT0gU2l6emxlICkge1xuXHRcdHdpbmRvdy5TaXp6bGUgPSBfc2l6emxlO1xuXHR9XG5cblx0cmV0dXJuIFNpenpsZTtcbn07XG5cbmlmICggdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgKSB7XG5cdGRlZmluZSggZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIFNpenpsZTtcblx0fSApO1xuXG4vLyBTaXp6bGUgcmVxdWlyZXMgdGhhdCB0aGVyZSBiZSBhIGdsb2JhbCB3aW5kb3cgaW4gQ29tbW9uLUpTIGxpa2UgZW52aXJvbm1lbnRzXG59IGVsc2UgaWYgKCB0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzICkge1xuXHRtb2R1bGUuZXhwb3J0cyA9IFNpenpsZTtcbn0gZWxzZSB7XG5cdHdpbmRvdy5TaXp6bGUgPSBTaXp6bGU7XG59XG5cbi8vIEVYUE9TRVxuXG59ICkoIHdpbmRvdyApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9zaXp6bGUvZGlzdC9zaXp6bGUuanMiLCJleHBvcnQgeyBkZWZhdWx0IGFzIHNlbGVjdCwgZ2V0U2luZ2xlU2VsZWN0b3IsIGdldE11bHRpU2VsZWN0b3IgfSBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgbWF0Y2ggfSBmcm9tICcuL21hdGNoJ1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBvcHRpbWl6ZSB9IGZyb20gJy4vb3B0aW1pemUnXG5leHBvcnQgKiBhcyBjb21tb24gZnJvbSAnLi9jb21tb24nXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9