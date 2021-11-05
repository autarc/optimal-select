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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = match;

var _pattern = __webpack_require__(1);

var _common = __webpack_require__(0);

var _utilities = __webpack_require__(2);

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
 * @param  {function}       select   - [description]
 * @return {boolean}                 - [description]
 */
function checkChilds(priority, element, ignore, path, select) {
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
  var elementPattern = findPattern(priority, element, ignore, select);
  var parent = element.parentNode;
  var texts = element.textContent.replace(/\n+/g, '\n').split('\n').map(function (text) {
    return text.trim();
  }).filter(function (text) {
    return text.length > 0;
  });

  var pattern = _extends({}, elementPattern, { relates: 'child' });
  var found = texts.some(function (text) {
    pattern.pseudo.push('contains("' + text + '")');
    var matches = select((0, _pattern.patternToString)(pattern), parent);
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
/* 4 */
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

var _adapt = __webpack_require__(5);

var _adapt2 = _interopRequireDefault(_adapt);

var _common = __webpack_require__(0);

var _pattern2 = __webpack_require__(1);

var _utilities = __webpack_require__(2);

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
/* 5 */
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

var _adapt = __webpack_require__(5);

var _adapt2 = _interopRequireDefault(_adapt);

var _match = __webpack_require__(3);

var _match2 = _interopRequireDefault(_match);

var _optimize = __webpack_require__(4);

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = __webpack_require__(2);

var _common = __webpack_require__(0);

var _pattern = __webpack_require__(1);

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

var _match = __webpack_require__(3);

Object.defineProperty(exports, 'match', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_match).default;
  }
});

var _optimize = __webpack_require__(4);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjY2U3MDE3NjFmMDc4Yjg4Y2RjOSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXR0ZXJuLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9vcHRpbWl6ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9+L2NzczJ4cGF0aC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0U2VsZWN0IiwiZ2V0Q29tbW9uQW5jZXN0b3IiLCJnZXRDb21tb25Qcm9wZXJ0aWVzIiwib3B0aW9ucyIsImZvcm1hdCIsIlNpenpsZSIsInJlcXVpcmUiLCJzZWxlY3RvciIsInBhcmVudCIsInJvb3QiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50cyIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJsZW5ndGgiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwiaSIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiY29tbW9uUHJvcGVydGllcyIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwiY29tbW9uQ2xhc3NlcyIsImNvbW1vbkF0dHJpYnV0ZXMiLCJjb21tb25UYWciLCJ1bmRlZmluZWQiLCJnZXRBdHRyaWJ1dGUiLCJ0cmltIiwic3BsaXQiLCJmaWx0ZXIiLCJlbnRyeSIsIm5hbWUiLCJlbGVtZW50QXR0cmlidXRlcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJrZXkiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwidmFsdWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImF0dHJpYnV0ZXNUb1N0cmluZyIsIm1hcCIsImpvaW4iLCJjbGFzc2VzVG9TdHJpbmciLCJwc2V1ZG9Ub1N0cmluZyIsInBzZXVkbyIsInBhdHRlcm5Ub1N0cmluZyIsInBhdHRlcm4iLCJyZWxhdGVzIiwiY3JlYXRlUGF0dGVybiIsImJhc2UiLCJwYXRoVG9TdHJpbmciLCJwYXRoIiwiY29udmVydE5vZGVMaXN0Iiwibm9kZXMiLCJhcnIiLCJBcnJheSIsImVzY2FwZVZhbHVlIiwicmVwbGFjZSIsInBhcnRpdGlvbiIsImFycmF5IiwicHJlZGljYXRlIiwiaXRlbSIsImlubmVyIiwib3V0ZXIiLCJjb25jYXQiLCJtYXRjaCIsImRlZmF1bHRJZ25vcmUiLCJpbmRleE9mIiwibm9kZSIsInNraXAiLCJwcmlvcml0eSIsImlnbm9yZSIsImpxdWVyeSIsInNlbGVjdCIsInNraXBDb21wYXJlIiwiaXNBcnJheSIsInNraXBDaGVja3MiLCJjb21wYXJlIiwidHlwZSIsInRvU3RyaW5nIiwiUmVnRXhwIiwidGVzdCIsIm5vZGVUeXBlIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tUYWciLCJjaGVja0NvbnRhaW5zIiwiY2hlY2tDaGlsZHMiLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsIm1hdGNoZXMiLCJnZXRDbGFzc1NlbGVjdG9yIiwicmVzdWx0IiwiYyIsInIiLCJwdXNoIiwiYSIsImIiLCJwcmVmaXgiLCJhdHRyaWJ1dGVOYW1lcyIsInZhbCIsInNvcnRlZEtleXMiLCJpc09wdGltYWwiLCJhdHRyaWJ1dGVWYWx1ZSIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJjbGFzcyIsImNsYXNzTmFtZSIsImZpbmRUYWdQYXR0ZXJuIiwiY2hpbGRyZW4iLCJjaGlsZFRhZ3MiLCJjaGlsZCIsImNoaWxkUGF0dGVybiIsImNvbnNvbGUiLCJ3YXJuIiwiZWxlbWVudFBhdHRlcm4iLCJ0ZXh0cyIsInRleHRDb250ZW50IiwidGV4dCIsImZvdW5kIiwiZGVmYXVsdFByZWRpY2F0ZSIsImNoZWNrIiwib3B0aW1pemUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwib3B0aW1pemVQYXJ0IiwiZW5kT3B0aW1pemVkIiwic2xpY2UiLCJzaG9ydGVuZWQiLCJwb3AiLCJjdXJyZW50IiwicHJlUGFydCIsInBvc3RQYXJ0IiwiaGFzU2FtZVJlc3VsdCIsImV2ZXJ5Iiwib3B0aW1pemVDb250YWlucyIsImNvbnRhaW5zIiwib3RoZXIiLCJvcHRpbWl6ZWQiLCJjb21wYXJlUmVzdWx0cyIsIm9wdGltaXplQXR0cmlidXRlcyIsInNpbXBsaWZ5Iiwib3JpZ2luYWwiLCJnZXRTaW1wbGlmaWVkIiwic2ltcGxpZmllZCIsIm9wdGltaXplRGVzY2VuZGFudCIsImRlc2NlbmRhbnQiLCJvcHRpbWl6ZU50aE9mVHlwZSIsImZpbmRJbmRleCIsInN0YXJ0c1dpdGgiLCJudGhPZlR5cGUiLCJvcHRpbWl6ZUNsYXNzZXMiLCJjaGFyQXQiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiaTIiLCJkZXNjcmlwdGlvbiIsImwyIiwib3B0aW1pemVycyIsImFjYyIsIm9wdGltaXplciIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJuYW1lcyIsImRlc2NlbmRhbnRDbGFzc05hbWUiLCJzZWxlY3RvcnMiLCJpbnN0cnVjdGlvbnMiLCJnZXRJbnN0cnVjdGlvbnMiLCJkaXNjb3ZlciIsInRvdGFsIiwic3RlcCIsImluY2x1c2l2ZSIsImRvbmUiLCJyZXZlcnNlIiwidmFsaWRhdGUiLCJpbnN0cnVjdGlvbiIsImNoZWNrUGFyZW50Iiwic3Vic3RyIiwibm9kZUNsYXNzTmFtZSIsImNoZWNrQ2xhc3MiLCJnZXRBbmNlc3RvciIsImF0dHJpYnV0ZUtleSIsImhhc0F0dHJpYnV0ZSIsImNoZWNrQXR0cmlidXRlIiwiTm9kZUxpc3QiLCJpZCIsImNoZWNrSWQiLCJjaGVja1VuaXZlcnNhbCIsInJ1bGUiLCJraW5kIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVBzZXVkbyIsImNvbXBhcmVTZXQiLCJub2RlSW5kZXgiLCJlbmhhbmNlSW5zdHJ1Y3Rpb24iLCJtYXRjaGVkTm9kZSIsImhhbmRsZXIiLCJwcm9ncmVzcyIsImdldFNpbmdsZVNlbGVjdG9yIiwiZ2V0TXVsdGlTZWxlY3RvciIsImdldFF1ZXJ5U2VsZWN0b3IiLCJhbmNlc3RvclNlbGVjdG9yIiwiY29tbW9uU2VsZWN0b3JzIiwiZ2V0Q29tbW9uU2VsZWN0b3JzIiwiZGVzY2VuZGFudFNlbGVjdG9yIiwic2VsZWN0b3JNYXRjaGVzIiwic2VsZWN0b3JQYXRoIiwiY2xhc3NTZWxlY3RvciIsImF0dHJpYnV0ZVNlbGVjdG9yIiwicGFydHMiLCJpbnB1dCIsImluY2x1ZGVzIiwieHBhdGhfdG9fbG93ZXIiLCJzIiwieHBhdGhfZW5kc193aXRoIiwiczEiLCJzMiIsInhwYXRoX3VybCIsInhwYXRoX3VybF9hdHRycyIsInhwYXRoX3VybF9wYXRoIiwieHBhdGhfdXJsX2RvbWFpbiIsInhwYXRoX2xvd2VyX2Nhc2UiLCJ4cGF0aF9uc191cmkiLCJ4cGF0aF9uc19wYXRoIiwieHBhdGhfaGFzX3Byb3RvY2FsIiwieHBhdGhfaXNfaW50ZXJuYWwiLCJ4cGF0aF9pc19sb2NhbCIsInhwYXRoX2lzX3BhdGgiLCJ4cGF0aF9pc19sb2NhbF9wYXRoIiwieHBhdGhfbm9ybWFsaXplX3NwYWNlIiwieHBhdGhfaW50ZXJuYWwiLCJ4cGF0aF9leHRlcm5hbCIsImVzY2FwZV9saXRlcmFsIiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwiZXNjYXBlX3BhcmVucyIsInJlZ2V4X3N0cmluZ19saXRlcmFsIiwicmVnZXhfZXNjYXBlZF9saXRlcmFsIiwicmVnZXhfY3NzX3dyYXBfcHNldWRvIiwicmVnZXhfc3BlY2FsX2NoYXJzIiwicmVnZXhfZmlyc3RfYXhpcyIsInJlZ2V4X2ZpbHRlcl9wcmVmaXgiLCJyZWdleF9hdHRyX3ByZWZpeCIsInJlZ2V4X250aF9lcXVhdGlvbiIsImNzc19jb21iaW5hdG9yc19yZWdleCIsImNzc19jb21iaW5hdG9yc19jYWxsYmFjayIsIm9wZXJhdG9yIiwiYXhpcyIsImZ1bmMiLCJsaXRlcmFsIiwiZXhjbHVkZSIsIm9mZnNldCIsIm9yaWciLCJpc051bWVyaWMiLCJwcmV2Q2hhciIsImNzc19hdHRyaWJ1dGVzX3JlZ2V4IiwiY3NzX2F0dHJpYnV0ZXNfY2FsbGJhY2siLCJzdHIiLCJhdHRyIiwiY29tcCIsIm9wIiwic2VhcmNoIiwiY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4IiwiY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrIiwiZzEiLCJnMiIsImFyZyIsImczIiwiZzQiLCJnNSIsImNzczJ4cGF0aCIsInhwYXRoIiwicHJlcGVuZEF4aXMiLCJjc3NfaWRzX2NsYXNzZXNfcmVnZXgiLCJjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2siLCJzdGFydCIsInNlbGVjdG9yU3RhcnQiLCJkZXB0aCIsIm51bSIsImlzTmFOIiwiZXNjYXBlQ2hhciIsIm9wZW4iLCJjbG9zZSIsImNoYXIiLCJyZXBlYXQiLCJOdW1iZXIiLCJjb252ZXJ0RXNjYXBpbmciLCJuZXN0ZWQiLCJsaXRlcmFscyIsInN1YnN0cmluZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJ3aW5kb3ciLCJzdXBwb3J0IiwiRXhwciIsImdldFRleHQiLCJpc1hNTCIsInRva2VuaXplIiwiY29tcGlsZSIsIm91dGVybW9zdENvbnRleHQiLCJzb3J0SW5wdXQiLCJoYXNEdXBsaWNhdGUiLCJzZXREb2N1bWVudCIsImRvY0VsZW0iLCJkb2N1bWVudElzSFRNTCIsInJidWdneVFTQSIsInJidWdneU1hdGNoZXMiLCJleHBhbmRvIiwiRGF0ZSIsInByZWZlcnJlZERvYyIsImRpcnJ1bnMiLCJjbGFzc0NhY2hlIiwiY3JlYXRlQ2FjaGUiLCJ0b2tlbkNhY2hlIiwiY29tcGlsZXJDYWNoZSIsIm5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUiLCJzb3J0T3JkZXIiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2hOYXRpdmUiLCJsaXN0IiwiZWxlbSIsImxlbiIsImJvb2xlYW5zIiwid2hpdGVzcGFjZSIsImlkZW50aWZpZXIiLCJwc2V1ZG9zIiwicndoaXRlc3BhY2UiLCJydHJpbSIsInJjb21tYSIsInJjb21iaW5hdG9ycyIsInJkZXNjZW5kIiwicnBzZXVkbyIsInJpZGVudGlmaWVyIiwibWF0Y2hFeHByIiwicmh0bWwiLCJyaW5wdXRzIiwicmhlYWRlciIsInJuYXRpdmUiLCJycXVpY2tFeHByIiwicnNpYmxpbmciLCJydW5lc2NhcGUiLCJmdW5lc2NhcGUiLCJlc2NhcGUiLCJub25IZXgiLCJoaWdoIiwicmNzc2VzY2FwZSIsImZjc3Nlc2NhcGUiLCJjaCIsImFzQ29kZVBvaW50IiwiY2hhckNvZGVBdCIsInVubG9hZEhhbmRsZXIiLCJpbkRpc2FibGVkRmllbGRzZXQiLCJhZGRDb21iaW5hdG9yIiwiZGlzYWJsZWQiLCJub2RlTmFtZSIsImRpciIsImFwcGx5IiwiY2FsbCIsImNoaWxkTm9kZXMiLCJlIiwidGFyZ2V0IiwiZWxzIiwiaiIsInJlc3VsdHMiLCJzZWVkIiwibSIsIm5pZCIsImdyb3VwcyIsIm5ld1NlbGVjdG9yIiwibmV3Q29udGV4dCIsIm93bmVyRG9jdW1lbnQiLCJleGVjIiwiZ2V0RWxlbWVudEJ5SWQiLCJxc2EiLCJ0ZXN0Q29udGV4dCIsInNjb3BlIiwic2V0QXR0cmlidXRlIiwidG9TZWxlY3RvciIsInFzYUVycm9yIiwicmVtb3ZlQXR0cmlidXRlIiwiY2FjaGUiLCJjYWNoZUxlbmd0aCIsIm1hcmtGdW5jdGlvbiIsImZuIiwiYXNzZXJ0IiwiZWwiLCJjcmVhdGVFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJhZGRIYW5kbGUiLCJhdHRycyIsImF0dHJIYW5kbGUiLCJzaWJsaW5nQ2hlY2siLCJjdXIiLCJkaWZmIiwic291cmNlSW5kZXgiLCJuZXh0U2libGluZyIsImNyZWF0ZUlucHV0UHNldWRvIiwiY3JlYXRlQnV0dG9uUHNldWRvIiwiY3JlYXRlRGlzYWJsZWRQc2V1ZG8iLCJpc0Rpc2FibGVkIiwiY3JlYXRlUG9zaXRpb25hbFBzZXVkbyIsImFyZ3VtZW50IiwibWF0Y2hJbmRleGVzIiwibmFtZXNwYWNlIiwibmFtZXNwYWNlVVJJIiwiZG9jdW1lbnRFbGVtZW50IiwiaGFzQ29tcGFyZSIsInN1YldpbmRvdyIsImRvYyIsImRlZmF1bHRWaWV3IiwidG9wIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFjaEV2ZW50IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVDb21tZW50IiwiZ2V0QnlJZCIsImdldEVsZW1lbnRzQnlOYW1lIiwiYXR0cklkIiwiZmluZCIsImdldEF0dHJpYnV0ZU5vZGUiLCJlbGVtcyIsInRtcCIsImlubmVySFRNTCIsIm1hdGNoZXNTZWxlY3RvciIsIndlYmtpdE1hdGNoZXNTZWxlY3RvciIsIm1vek1hdGNoZXNTZWxlY3RvciIsIm9NYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsImRpc2Nvbm5lY3RlZE1hdGNoIiwiY29tcGFyZURvY3VtZW50UG9zaXRpb24iLCJhZG93biIsImJ1cCIsInNvcnREZXRhY2hlZCIsImF1cCIsImFwIiwiYnAiLCJleHByIiwicmV0Iiwic3BlY2lmaWVkIiwic2VsIiwiZXJyb3IiLCJtc2ciLCJ1bmlxdWVTb3J0IiwiZHVwbGljYXRlcyIsImRldGVjdER1cGxpY2F0ZXMiLCJzb3J0U3RhYmxlIiwic3BsaWNlIiwiZmlyc3RDaGlsZCIsIm5vZGVWYWx1ZSIsImNyZWF0ZVBzZXVkbyIsInJlbGF0aXZlIiwiZmlyc3QiLCJwcmVGaWx0ZXIiLCJleGNlc3MiLCJ1bnF1b3RlZCIsIm5vZGVOYW1lU2VsZWN0b3IiLCJ3aGF0IiwiX2FyZ3VtZW50IiwibGFzdCIsInNpbXBsZSIsImZvcndhcmQiLCJvZlR5cGUiLCJfY29udGV4dCIsInhtbCIsInVuaXF1ZUNhY2hlIiwib3V0ZXJDYWNoZSIsInVzZUNhY2hlIiwibGFzdENoaWxkIiwidW5pcXVlSUQiLCJhcmdzIiwic2V0RmlsdGVycyIsImlkeCIsIm1hdGNoZWQiLCJtYXRjaGVyIiwidW5tYXRjaGVkIiwibGFuZyIsImVsZW1MYW5nIiwiaGFzaCIsImxvY2F0aW9uIiwiYWN0aXZlRWxlbWVudCIsImhhc0ZvY3VzIiwiaHJlZiIsInRhYkluZGV4IiwiY2hlY2tlZCIsInNlbGVjdGVkIiwic2VsZWN0ZWRJbmRleCIsIl9tYXRjaEluZGV4ZXMiLCJyYWRpbyIsImNoZWNrYm94IiwiZmlsZSIsInBhc3N3b3JkIiwiaW1hZ2UiLCJzdWJtaXQiLCJyZXNldCIsInByb3RvdHlwZSIsImZpbHRlcnMiLCJwYXJzZU9ubHkiLCJ0b2tlbnMiLCJzb0ZhciIsInByZUZpbHRlcnMiLCJjYWNoZWQiLCJjb21iaW5hdG9yIiwiY2hlY2tOb25FbGVtZW50cyIsImRvbmVOYW1lIiwib2xkQ2FjaGUiLCJuZXdDYWNoZSIsImVsZW1lbnRNYXRjaGVyIiwibWF0Y2hlcnMiLCJtdWx0aXBsZUNvbnRleHRzIiwiY29udGV4dHMiLCJjb25kZW5zZSIsIm5ld1VubWF0Y2hlZCIsIm1hcHBlZCIsInNldE1hdGNoZXIiLCJwb3N0RmlsdGVyIiwicG9zdEZpbmRlciIsInBvc3RTZWxlY3RvciIsInRlbXAiLCJwcmVNYXAiLCJwb3N0TWFwIiwicHJlZXhpc3RpbmciLCJtYXRjaGVySW4iLCJtYXRjaGVyT3V0IiwibWF0Y2hlckZyb21Ub2tlbnMiLCJjaGVja0NvbnRleHQiLCJsZWFkaW5nUmVsYXRpdmUiLCJpbXBsaWNpdFJlbGF0aXZlIiwibWF0Y2hDb250ZXh0IiwibWF0Y2hBbnlDb250ZXh0IiwibWF0Y2hlckZyb21Hcm91cE1hdGNoZXJzIiwiZWxlbWVudE1hdGNoZXJzIiwic2V0TWF0Y2hlcnMiLCJieVNldCIsImJ5RWxlbWVudCIsInN1cGVyTWF0Y2hlciIsIm91dGVybW9zdCIsIm1hdGNoZWRDb3VudCIsInNldE1hdGNoZWQiLCJjb250ZXh0QmFja3VwIiwiZGlycnVuc1VuaXF1ZSIsIk1hdGgiLCJyYW5kb20iLCJ0b2tlbiIsImNvbXBpbGVkIiwiX25hbWUiLCJkZWZhdWx0VmFsdWUiLCJfc2l6emxlIiwibm9Db25mbGljdCIsImRlZmluZSIsImRlZmF1bHQiLCJjb21tb24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJI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MkMwRSxJQUFJcVcsU0FBL0MsR0FDQ3JXLElBQUlsRSxLQURMLEdBRUMsSUFIRjtBQUlBO0FBQ0QsR0FSRDtBQVNBOztBQUVEO0FBQ0EsS0FBSW1oQixVQUFVL1AsT0FBT3JVLE1BQXJCOztBQUVBQSxRQUFPcWtCLFVBQVAsR0FBb0IsWUFBVztBQUM5QixNQUFLaFEsT0FBT3JVLE1BQVAsS0FBa0JBLE1BQXZCLEVBQWdDO0FBQy9CcVUsVUFBT3JVLE1BQVAsR0FBZ0Jva0IsT0FBaEI7QUFDQTs7QUFFRCxTQUFPcGtCLE1BQVA7QUFDQSxFQU5EOztBQVFBLEtBQUssSUFBTCxFQUFrRDtBQUNqRHNrQixFQUFBLGtDQUFRLFlBQVc7QUFDbEIsVUFBT3RrQixNQUFQO0FBQ0EsR0FGRDs7QUFJRDtBQUNDLEVBTkQsTUFNTyxJQUFLLE9BQU9tVSxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxPQUE3QyxFQUF1RDtBQUM3REQsU0FBT0MsT0FBUCxHQUFpQnBVLE1BQWpCO0FBQ0EsRUFGTSxNQUVBO0FBQ05xVSxTQUFPclUsTUFBUCxHQUFnQkEsTUFBaEI7QUFDQTs7QUFFRDtBQUVDLENBbjZFRCxFQW02RUtxVSxNQW42RUwsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQ0NWU2tRLE87Ozs7OzttQkFBbUJoVyxpQjs7Ozs7O21CQUFtQkMsZ0I7Ozs7Ozs7OzswQ0FDdEMrVixPOzs7Ozs7Ozs7NkNBQ0FBLE87Ozs7Ozs7Ozs7OztRQUNHQyxNIiwiZmlsZSI6Im9wdGltYWwtc2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGNjZTcwMTc2MWYwNzhiODhjZGM5IiwiLyoqXG4gKiAjIENvbW1vblxuICpcbiAqIFByb2Nlc3MgY29sbGVjdGlvbnMgZm9yIHNpbWlsYXJpdGllcy5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJy4vc2VsZWN0JykuT3B0aW9uc30gT3B0aW9uc1xuICovXG5cbi8qKlxuICogUXVlcnkgZG9jdW1lbnQgdXNpbmcgY29ycmVjdCBzZWxlY3RvciBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudDogSFRNTEVsZW1lbnQpID0+IEFycmF5LjxIVE1MRWxlbWVudD59IC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VsZWN0IChvcHRpb25zID0ge30pIHtcbiAgaWYgKG9wdGlvbnMuZm9ybWF0ID09PSAnanF1ZXJ5Jykge1xuICAgIGNvbnN0IFNpenpsZSA9IHJlcXVpcmUoJ3NpenpsZScpXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkge1xuICAgICAgcmV0dXJuIFNpenpsZShzZWxlY3RvciwgcGFyZW50IHx8IG9wdGlvbnMucm9vdCB8fCBkb2N1bWVudClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkge1xuICAgIHJldHVybiAocGFyZW50IHx8IG9wdGlvbnMucm9vdCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiAgfSBcbn1cblxuXG4vKipcbiAqIEZpbmQgdGhlIGxhc3QgY29tbW9uIGFuY2VzdG9yIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uQW5jZXN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgYW5jZXN0b3JzID0gW11cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHBhcmVudHMgPSBbXVxuICAgIHdoaWxlIChlbGVtZW50ICE9PSByb290KSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBwYXJlbnRzLnVuc2hpZnQoZWxlbWVudClcbiAgICB9XG4gICAgYW5jZXN0b3JzW2luZGV4XSA9IHBhcmVudHNcbiAgfSlcblxuICBhbmNlc3RvcnMuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcblxuICBjb25zdCBzaGFsbG93QW5jZXN0b3IgPSBhbmNlc3RvcnMuc2hpZnQoKVxuXG4gIHZhciBhbmNlc3RvciA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNoYWxsb3dBbmNlc3Rvci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBwYXJlbnQgPSBzaGFsbG93QW5jZXN0b3JbaV1cbiAgICBjb25zdCBtaXNzaW5nID0gYW5jZXN0b3JzLnNvbWUoKG90aGVyUGFyZW50cykgPT4ge1xuICAgICAgcmV0dXJuICFvdGhlclBhcmVudHMuc29tZSgob3RoZXJQYXJlbnQpID0+IG90aGVyUGFyZW50ID09PSBwYXJlbnQpXG4gICAgfSlcblxuICAgIGlmIChtaXNzaW5nKSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIHNpbWlsYXIgc3ViLXBhcmVudHMsIG5vdCB0aGUgdG9wIHJvb3QsIGUuZy4gc2hhcmluZyBhIGNsYXNzIHNlbGVjdG9yXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGFuY2VzdG9yID0gcGFyZW50XG4gIH1cblxuICByZXR1cm4gYW5jZXN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgYSBzZXQgb2YgY29tbW9uIHByb3BlcnRpZXMgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uUHJvcGVydGllcyAoZWxlbWVudHMpIHtcblxuICBjb25zdCBjb21tb25Qcm9wZXJ0aWVzID0ge1xuICAgIGNsYXNzZXM6IFtdLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIHRhZzogbnVsbFxuICB9XG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgdmFyIHtcbiAgICAgIGNsYXNzZXM6IGNvbW1vbkNsYXNzZXMsXG4gICAgICBhdHRyaWJ1dGVzOiBjb21tb25BdHRyaWJ1dGVzLFxuICAgICAgdGFnOiBjb21tb25UYWdcbiAgICB9ID0gY29tbW9uUHJvcGVydGllc1xuXG4gICAgLy8gfiBjbGFzc2VzXG4gICAgaWYgKGNvbW1vbkNsYXNzZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICAgICAgaWYgKCFjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25DbGFzc2VzID0gY29tbW9uQ2xhc3Nlcy5maWx0ZXIoKGVudHJ5KSA9PiBjbGFzc2VzLnNvbWUoKG5hbWUpID0+IG5hbWUgPT09IGVudHJ5KSlcbiAgICAgICAgICBpZiAoY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNvbW1vbkNsYXNzZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogcmVzdHJ1Y3R1cmUgcmVtb3ZhbCBhcyAyeCBzZXQgLyAyeCBkZWxldGUsIGluc3RlYWQgb2YgbW9kaWZ5IGFsd2F5cyByZXBsYWNpbmcgd2l0aCBuZXcgY29sbGVjdGlvblxuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiBhdHRyaWJ1dGVzXG4gICAgaWYgKGNvbW1vbkF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZWxlbWVudEF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3Qua2V5cyhlbGVtZW50QXR0cmlidXRlcykucmVkdWNlKChhdHRyaWJ1dGVzLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gZWxlbWVudEF0dHJpYnV0ZXNba2V5XVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICAgICAgLy8gTk9URTogd29ya2Fyb3VuZCBkZXRlY3Rpb24gZm9yIG5vbi1zdGFuZGFyZCBwaGFudG9tanMgTmFtZWROb2RlTWFwIGJlaGF2aW91clxuICAgICAgICAvLyAoaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcml5YS9waGFudG9tanMvaXNzdWVzLzE0NjM0KVxuICAgICAgICBpZiAoYXR0cmlidXRlICYmIGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlLnZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgIH0sIHt9KVxuXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKVxuICAgICAgY29uc3QgY29tbW9uQXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcylcblxuICAgICAgaWYgKGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFjb21tb25BdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChuZXh0Q29tbW9uQXR0cmlidXRlcywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb21tb25BdHRyaWJ1dGVzW25hbWVdXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGF0dHJpYnV0ZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgbmV4dENvbW1vbkF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHRDb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSwge30pXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiB0YWdcbiAgICBpZiAoY29tbW9uVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAoIWNvbW1vblRhZykge1xuICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLnRhZyA9IHRhZ1xuICAgICAgfSBlbHNlIGlmICh0YWcgIT09IGNvbW1vblRhZykge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy50YWdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGNvbW1vblByb3BlcnRpZXNcbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1vbi5qcyIsIi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IFBhdHRlcm5cbiAqIEBwcm9wZXJ0eSB7KCdkZXNjZW5kYW50JyB8ICdjaGlsZCcpfSAgICAgICAgICAgICAgICAgIFtyZWxhdGVzXVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3RhZ11cbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHsgbmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nPyB9Pn0gIGF0dHJpYnV0ZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXNcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59ICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBzZXVkb1xuICovXG5cbi8qKlxuICogQ29udmVydCBhdHRyaWJ1dGVzIHRvIHN0cmluZ1xuICogXG4gKiBAcGFyYW0ge0FycmF5Ljx7IG5hbWU6IHN0cmluZywgdmFsdWU6IHN0cmluZz8gfT59IGF0dHJpYnV0ZXMgXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgYXR0cmlidXRlc1RvU3RyaW5nID0gKGF0dHJpYnV0ZXMpID0+XG4gIGF0dHJpYnV0ZXMubWFwKCh7IG5hbWUsIHZhbHVlIH0pID0+IHtcbiAgICBpZiAobmFtZSA9PT0gJ2lkJykge1xuICAgICAgcmV0dXJuIGAjJHt2YWx1ZX1gXG4gICAgfVxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGBbJHtuYW1lfV1gXG4gICAgfVxuICAgIHJldHVybiBgWyR7bmFtZX09XCIke3ZhbHVlfVwiXWBcbiAgfSkuam9pbignJylcblxuLyoqXG4gKiBDb252ZXJ0IGNsYXNzZXMgdG8gc3RyaW5nXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGNsYXNzZXMgXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG4gZXhwb3J0IGNvbnN0IGNsYXNzZXNUb1N0cmluZyA9IChjbGFzc2VzKSA9PiBjbGFzc2VzLmxlbmd0aCA/IGAuJHtjbGFzc2VzLmpvaW4oJy4nKX1gIDogJydcblxuLyoqXG4gKiBDb252ZXJ0IHBzZXVkbyBzZWxlY3RvcnMgdG8gc3RyaW5nXG4gKiBcbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHBzZXVkbyBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwc2V1ZG9Ub1N0cmluZyA9IChwc2V1ZG8pID0+IHBzZXVkby5sZW5ndGggPyBgOiR7cHNldWRvLmpvaW4oJzonKX1gIDogJydcblxuLyoqXG4gKiBDb252ZXJ0IHBhdHRlcm4gdG8gc3RyaW5nXG4gKiBcbiAqIEBwYXJhbSB7UGF0dGVybn0gcGF0dGVybiBcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBwYXR0ZXJuVG9TdHJpbmcgPSAocGF0dGVybikgPT4ge1xuICBjb25zdCB7IHJlbGF0ZXMsIHRhZywgYXR0cmlidXRlcywgY2xhc3NlcywgcHNldWRvIH0gPSBwYXR0ZXJuXG4gIGNvbnN0IHZhbHVlID0gYCR7XG4gICAgcmVsYXRlcyA9PT0gJ2NoaWxkJyA/ICc+ICcgOiAnJ1xuICB9JHtcbiAgICB0YWcgfHwgJydcbiAgfSR7XG4gICAgYXR0cmlidXRlc1RvU3RyaW5nKGF0dHJpYnV0ZXMpXG4gIH0ke1xuICAgIGNsYXNzZXNUb1N0cmluZyhjbGFzc2VzKVxuICB9JHtcbiAgICBwc2V1ZG9Ub1N0cmluZyhwc2V1ZG8pXG4gIH1gXG4gIHJldHVybiB2YWx1ZVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgcGF0dGVybiBzdHJ1Y3R1cmVcbiAqIFxuICogQHBhcmFtIHtQYXJ0aWFsPFBhdHRlcm4+fSBwYXR0ZXJuXG4gKiBAcmV0dXJucyB7UGF0dGVybn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVBhdHRlcm4gPSAoYmFzZSA9IHt9KSA9PlxuICAoeyBhdHRyaWJ1dGVzOiBbXSwgY2xhc3NlczogW10sIHBzZXVkbzogW10sIC4uLmJhc2UgfSlcblxuLyoqXG4gKiBDb252ZXJ0cyBwYXRoIHRvIHN0cmluZ1xuICpcbiAqIEBwYXJhbSB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoIFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IHBhdGhUb1N0cmluZyA9IChwYXRoKSA9PlxuICBwYXRoLm1hcChwYXR0ZXJuVG9TdHJpbmcpLmpvaW4oJyAnKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhdHRlcm4uanMiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBjb252ZXJ0Tm9kZUxpc3QgPSAobm9kZXMpID0+IHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG5vZGVzXG4gIGNvbnN0IGFyciA9IG5ldyBBcnJheShsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJbaV0gPSBub2Rlc1tpXVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuLyoqXG4gKiBFc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBsaW5lIGJyZWFrcyBhcyBhIHNpbXBsaWZpZWQgdmVyc2lvbiBvZiAnQ1NTLmVzY2FwZSgpJ1xuICpcbiAqIERlc2NyaXB0aW9uIG9mIHZhbGlkIGNoYXJhY3RlcnM6IGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9jc3MtZXNjYXBlc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZz99IHZhbHVlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBjb25zdCBlc2NhcGVWYWx1ZSA9ICh2YWx1ZSkgPT5cbiAgdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvWydcImBcXFxcLzo/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL1xcbi9nLCAnXFx1MDBhMCcpXG5cbi8qKlxuICogUGFydGl0aW9uIGFycmF5IGludG8gdHdvIGdyb3VwcyBkZXRlcm1pbmVkIGJ5IHByZWRpY2F0ZVxuICovXG5leHBvcnQgY29uc3QgcGFydGl0aW9uID0gKGFycmF5LCBwcmVkaWNhdGUpID0+XG4gIGFycmF5LnJlZHVjZShcbiAgICAoW2lubmVyLCBvdXRlcl0sIGl0ZW0pID0+IHByZWRpY2F0ZShpdGVtKSA/IFtpbm5lci5jb25jYXQoaXRlbSksIG91dGVyXSA6IFtpbm5lciwgb3V0ZXIuY29uY2F0KGl0ZW0pXSxcbiAgICBbW10sIFtdXVxuICApXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmUgc2VsZWN0b3IgZm9yIGEgbm9kZS5cbiAqL1xuXG5pbXBvcnQgeyBjcmVhdGVQYXR0ZXJuLCBwYXR0ZXJuVG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5pbXBvcnQgeyBnZXRTZWxlY3QgfSBmcm9tICcuL2NvbW1vbidcbmltcG9ydCB7IGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3BhdHRlcm4nKS5QYXR0ZXJufSBQYXR0ZXJuXG4gKi9cblxuY29uc3QgZGVmYXVsdElnbm9yZSA9IHtcbiAgYXR0cmlidXRlIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdzdHlsZScsXG4gICAgICAnZGF0YS1yZWFjdGlkJyxcbiAgICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICAgIF0uaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxQYXR0ZXJuPn0gICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoIChub2RlLCBvcHRpb25zID0ge30pIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50LFxuICAgIHNraXAgPSBudWxsLFxuICAgIHByaW9yaXR5ID0gWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZSA9IHt9LFxuICAgIGZvcm1hdFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IHBhdGggPSBbXVxuICB2YXIgZWxlbWVudCA9IG5vZGVcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIGNvbnN0IGpxdWVyeSA9IChmb3JtYXQgPT09ICdqcXVlcnknKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGlnbm9yZVt0eXBlXVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnZnVuY3Rpb24nKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZS50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgcHJlZGljYXRlID0gbmV3IFJlZ0V4cChlc2NhcGVWYWx1ZShwcmVkaWNhdGUpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZSA/IC8oPzopLyA6IC8uXi9cbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gKG5hbWUsIHZhbHVlKSA9PiBwcmVkaWNhdGUudGVzdCh2YWx1ZSlcbiAgfSlcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxMSkge1xuICAgIGlmIChza2lwQ2hlY2tzKGVsZW1lbnQpICE9PSB0cnVlKSB7XG4gICAgICAvLyB+IGdsb2JhbFxuICAgICAgaWYgKGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHJvb3QpKSBicmVha1xuICAgICAgaWYgKGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KVxuICAgICAgfVxuXG4gICAgICBpZiAoanF1ZXJ5ICYmIHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tDb250YWlucyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmluZSBvbmx5IG9uZSBwYXJ0IGVhY2ggaXRlcmF0aW9uXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NoaWxkcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gIH1cblxuICByZXR1cm4gcGF0aFxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHBhcmVudClcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm5Ub1N0cmluZyhwYXR0ZXJuKSwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBHZXQgY2xhc3Mgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gY2xhc3NlcyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgYmFzZSAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxzdHJpbmc+P30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzZXMgPSBbXSwgc2VsZWN0LCBwYXJlbnQsIGJhc2UpIHtcbiAgbGV0IHJlc3VsdCA9IFtbXV1cblxuICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHIuY29uY2F0KGMpKVxuICAgIH0pXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcbiAgcmVzdWx0ID0gcmVzdWx0LnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLmxlbmd0aCAtIGIubGVuZ3RoIH0pXG5cbiAgY29uc3QgcHJlZml4ID0gcGF0dGVyblRvU3RyaW5nKGJhc2UpXG5cbiAgZm9yKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QoYCR7cHJlZml4fS4ke3Jlc3VsdFtpXS5qb2luKCcuJyl9YCwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHJlc3VsdFtpXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogTG9va3VwIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhcmVudE5vZGV9ICAgICBwYXJlbnQgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJuP30gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kQXR0cmlidXRlc1BhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykubWFwKCh2YWwpID0+IGF0dHJpYnV0ZXNbdmFsXS5uYW1lKVxuICAgIC5maWx0ZXIoKGEpID0+IHByaW9yaXR5LmluZGV4T2YoYSkgPCAwKVxuXG4gIHZhciBzb3J0ZWRLZXlzID0gWyAuLi5wcmlvcml0eSwgLi4uYXR0cmlidXRlTmFtZXMgXVxuICB2YXIgcGF0dGVybiA9IGNyZWF0ZVBhdHRlcm4oKVxuICBwYXR0ZXJuLnRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIGlzT3B0aW1hbCA9IChwYXR0ZXJuKSA9PiAoc2VsZWN0KHBhdHRlcm5Ub1N0cmluZyhwYXR0ZXJuKSwgcGFyZW50KS5sZW5ndGggPT09IDEpXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzb3J0ZWRLZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHNvcnRlZEtleXNbaV1cbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlICYmIGF0dHJpYnV0ZS5uYW1lKVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlICYmIGF0dHJpYnV0ZS52YWx1ZSlcbiAgICBjb25zdCB1c2VOYW1lZElnbm9yZSA9IGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcblxuICAgIGNvbnN0IGN1cnJlbnRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgaWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBpZ25vcmUuYXR0cmlidXRlXG4gICAgY29uc3QgY3VycmVudERlZmF1bHRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgZGVmYXVsdElnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgZGVmYXVsdElnbm9yZS5hdHRyaWJ1dGVcbiAgICBpZiAoY2hlY2tJZ25vcmUoY3VycmVudElnbm9yZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGN1cnJlbnREZWZhdWx0SWdub3JlKSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgIGNhc2UgJ2NsYXNzJzoge1xuICAgICAgICBsZXQgY2xhc3NOYW1lcyA9IGF0dHJpYnV0ZVZhbHVlLnRyaW0oKS5zcGxpdCgvXFxzKy9nKVxuICAgICAgICBjb25zdCBjbGFzc0lnbm9yZSA9IGlnbm9yZS5jbGFzcyB8fCBkZWZhdWx0SWdub3JlLmNsYXNzXG4gICAgICAgIGlmIChjbGFzc0lnbm9yZSkge1xuICAgICAgICAgIGNsYXNzTmFtZXMgPSBjbGFzc05hbWVzLmZpbHRlcihjbGFzc05hbWUgPT4gIWNsYXNzSWdub3JlKGNsYXNzTmFtZSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsYXNzTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGNvbnN0IGNsYXNzZXMgPSBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzTmFtZXMsIHNlbGVjdCwgcGFyZW50LCBwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgICAgICBwYXR0ZXJuLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgICAgICBpZiAoaXNPcHRpbWFsKHBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHBhdHRlcm4uYXR0cmlidXRlcy5wdXNoKHsgbmFtZTogYXR0cmlidXRlTmFtZSwgdmFsdWU6IGF0dHJpYnV0ZVZhbHVlIH0pXG4gICAgICAgIGlmIChpc09wdGltYWwocGF0dGVybikpIHtcbiAgICAgICAgICByZXR1cm4gcGF0dGVyblxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGwgLy8gcGF0dGVyblxufVxuXG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnIChlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgbGV0IG1hdGNoZXMgPSBbXVxuICAgIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVyblRvU3RyaW5nKHBhdHRlcm4pLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIGlmIChwYXR0ZXJuLnRhZyA9PT0gJ2lmcmFtZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybj99ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kVGFnUGF0dGVybiAoZWxlbWVudCwgaWdub3JlKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgbnVsbCwgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGNvbnN0IHBhdHRlcm4gPSBjcmVhdGVQYXR0ZXJuKClcbiAgcGF0dGVybi50YWcgPSB0YWdOYW1lXG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBzcGVjaWZpYyBjaGlsZCBpZGVudGlmaWVyXG4gKlxuICogTk9URTogJ2NoaWxkVGFncycgaXMgYSBjdXN0b20gcHJvcGVydHkgdG8gdXNlIGFzIGEgdmlldyBmaWx0ZXIgZm9yIHRhZ3MgdXNpbmcgJ2FkYXB0ZXIuanMnXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPFBhdHRlcm4+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NoaWxkcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZFRhZ3MgfHwgcGFyZW50LmNoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZCA9PT0gZWxlbWVudCkge1xuICAgICAgY29uc3QgY2hpbGRQYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oY2hpbGQsIGlnbm9yZSlcbiAgICAgIGlmICghY2hpbGRQYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgICAgIEVsZW1lbnQgY291bGRuJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY2hpbGRQYXR0ZXJuLnJlbGF0ZXMgPSAnY2hpbGQnXG4gICAgICBjaGlsZFBhdHRlcm4ucHNldWRvID0gW2BudGgtY2hpbGQoJHtpKzF9KWBdXG4gICAgICBwYXRoLnVuc2hpZnQoY2hpbGRQYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBjb250YWluc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxQYXR0ZXJuPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDb250YWlucyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KSB7XG4gIGNvbnN0IGVsZW1lbnRQYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KVxuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgdGV4dHMgPSBlbGVtZW50LnRleHRDb250ZW50XG4gICAgLnJlcGxhY2UoL1xcbisvZywgJ1xcbicpXG4gICAgLnNwbGl0KCdcXG4nKVxuICAgIC5tYXAodGV4dCA9PiB0ZXh0LnRyaW0oKSlcbiAgICAuZmlsdGVyKHRleHQgPT4gdGV4dC5sZW5ndGggPiAwKVxuXG4gIGxldCBwYXR0ZXJuID0geyAuLi5lbGVtZW50UGF0dGVybiwgcmVsYXRlczogJ2NoaWxkJyB9XG4gIGNvbnN0IGZvdW5kID0gdGV4dHMuc29tZSh0ZXh0ID0+IHtcbiAgICBwYXR0ZXJuLnBzZXVkby5wdXNoKGBjb250YWlucyhcIiR7dGV4dH1cIilgKVxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVyblRvU3RyaW5nKHBhdHRlcm4pLCBwYXJlbnQpXG4gICAgcmV0dXJuIG1hdGNoZXMubGVuZ3RoID09PSAxXG4gIH0pXG4gIGlmIChmb3VuZCkge1xuICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0KSB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdClcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgfVxuICByZXR1cm4gcGF0dGVyblxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHdpdGggY3VzdG9tIGFuZCBkZWZhdWx0IGZ1bmN0aW9uc1xuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBwcmVkaWNhdGUgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nP30gIG5hbWUgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdmFsdWUgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkZWZhdWx0UHJlZGljYXRlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWdub3JlIChwcmVkaWNhdGUsIG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGNvbnN0IGNoZWNrID0gcHJlZGljYXRlIHx8IGRlZmF1bHRQcmVkaWNhdGVcbiAgaWYgKCFjaGVjaykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVjayhuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYXRjaC5qcyIsIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbnNmb3JtYXRpb25cbiAqL1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCB7IGdldFNlbGVjdCB9IGZyb20gJy4vY29tbW9uJ1xuaW1wb3J0IHsgcGF0aFRvU3RyaW5nLCBwYXR0ZXJuVG9TdHJpbmcsIHBzZXVkb1RvU3RyaW5nLCBhdHRyaWJ1dGVzVG9TdHJpbmcsIGNsYXNzZXNUb1N0cmluZyB9IGZyb20gJy4vcGF0dGVybidcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCwgcGFydGl0aW9uIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9zZWxlY3QnKS5PcHRpb25zfSBPcHRpb25zXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3BhdHRlcm4nKS5QYXR0ZXJufSBQYXR0ZXJuXG4gKi9cblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48UGF0dGVybj59ICAgICAgICAgICAgICAgICBwYXRoICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50ICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChwYXRoLCBlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKHBhdGhbMF0ucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIHBhdGhbMF0ucmVsYXRlcyA9IHVuZGVmaW5lZFxuICB9XG5cbiAgLy8gY29udmVydCBzaW5nbGUgZW50cnkgYW5kIE5vZGVMaXN0XG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9ICFlbGVtZW50cy5sZW5ndGggPyBbZWxlbWVudHNdIDogY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50cy5sZW5ndGggfHwgZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5wdXQgLSB0byBjb21wYXJlIEhUTUxFbGVtZW50cyBpdHMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSByZWZlcmVuY2Ugb2YgdGhlIHNlbGVjdGVkIG5vZGUocykhIChtaXNzaW5nIFwiZWxlbWVudHNcIiknKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0ID0gZ2V0U2VsZWN0KG9wdGlvbnMpXG5cbiAgaWYgKHBhdGgubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBwYXR0ZXJuVG9TdHJpbmcob3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCAnJywgZWxlbWVudHMsIHNlbGVjdCkpXG4gIH1cblxuICB2YXIgZW5kT3B0aW1pemVkID0gZmFsc2VcbiAgaWYgKHBhdGhbcGF0aC5sZW5ndGgtMV0ucmVsYXRlcyA9PT0gJ2NoaWxkJykge1xuICAgIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aFRvU3RyaW5nKHBhdGguc2xpY2UoMCwgLTEpKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnRzLCBzZWxlY3QpXG4gICAgZW5kT3B0aW1pemVkID0gdHJ1ZVxuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aC5wb3AoKVxuICAgIGNvbnN0IHByZVBhcnQgPSBwYXRoVG9TdHJpbmcocGF0aClcbiAgICBjb25zdCBwb3N0UGFydCA9IHBhdGhUb1N0cmluZyhzaG9ydGVuZWQpXG5cbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KGAke3ByZVBhcnR9ICR7cG9zdFBhcnR9YClcbiAgICBjb25zdCBoYXNTYW1lUmVzdWx0ID0gbWF0Y2hlcy5sZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCwgaSkgPT4gZWxlbWVudCA9PT0gbWF0Y2hlc1tpXSlcbiAgICBpZiAoIWhhc1NhbWVSZXN1bHQpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoVG9TdHJpbmcocGF0aC5zbGljZSgxKSksIGVsZW1lbnRzLCBzZWxlY3QpXG4gIGlmICghZW5kT3B0aW1pemVkKSB7XG4gICAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoVG9TdHJpbmcocGF0aC5zbGljZSgwLCAtMSkpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCAnJywgZWxlbWVudHMsIHNlbGVjdClcbiAgfVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBwYXRoVG9TdHJpbmcocGF0aCkgLy8gcGF0aC5qb2luKCcgJykucmVwbGFjZSgvPi9nLCAnPiAnKS50cmltKClcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSA6Y29udGFpbnNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1BhdHRlcm59ICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7UGF0dGVybn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplQ29udGFpbnMgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIGNvbnN0IFtjb250YWlucywgb3RoZXJdID0gcGFydGl0aW9uKGN1cnJlbnQucHNldWRvLCAoaXRlbSkgPT4gL2NvbnRhaW5zXFwoXCIvLnRlc3QoaXRlbSkpXG4gIGNvbnN0IHByZWZpeCA9IHBhdHRlcm5Ub1N0cmluZyh7IC4uLmN1cnJlbnQsIHBzZXVkbzogW10gfSlcblxuICBpZiAoY29udGFpbnMubGVuZ3RoID4gMCAmJiBwb3N0UGFydC5sZW5ndGgpIHtcbiAgICBjb25zdCBvcHRpbWl6ZWQgPSBbLi4ub3RoZXIsIC4uLmNvbnRhaW5zXVxuICAgIHdoaWxlIChvcHRpbWl6ZWQubGVuZ3RoID4gb3RoZXIubGVuZ3RoKSB7XG4gICAgICBvcHRpbWl6ZWQucG9wKClcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7cHJlZml4fSR7cHNldWRvVG9TdHJpbmcob3B0aW1pemVkKX0ke3Bvc3RQYXJ0fWBcbiAgICAgIGlmICghY29tcGFyZVJlc3VsdHMoc2VsZWN0KHBhdHRlcm4pLCBlbGVtZW50cykpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGN1cnJlbnQucHNldWRvID0gb3B0aW1pemVkXG4gICAgfVxuICB9XG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogT3B0aW1pemUgYXR0cmlidXRlc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7UGF0dGVybn0gICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgICAgICAgc2VsZWN0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtQYXR0ZXJufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVBdHRyaWJ1dGVzIChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkge1xuICAvLyByZWR1Y2UgYXR0cmlidXRlczogZmlyc3QgdHJ5IHdpdGhvdXQgdmFsdWUsIHRoZW4gcmVtb3ZpbmcgY29tcGxldGVseVxuICBpZiAoY3VycmVudC5hdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgYXR0cmlidXRlcyA9IFsuLi5jdXJyZW50LmF0dHJpYnV0ZXNdXG4gICAgbGV0IHByZWZpeCA9IHBhdHRlcm5Ub1N0cmluZyh7IC4uLmN1cnJlbnQsIGF0dHJpYnV0ZXM6IFtdIH0pXG5cbiAgICBjb25zdCBzaW1wbGlmeSA9IChvcmlnaW5hbCwgZ2V0U2ltcGxpZmllZCkgPT4ge1xuICAgICAgbGV0IGkgPSBvcmlnaW5hbC5sZW5ndGggLSAxXG4gICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgIGxldCBhdHRyaWJ1dGVzID0gZ2V0U2ltcGxpZmllZChvcmlnaW5hbCwgaSlcbiAgICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhcbiAgICAgICAgICBzZWxlY3QoYCR7cHJlUGFydH0ke3ByZWZpeH0ke2F0dHJpYnV0ZXNUb1N0cmluZyhhdHRyaWJ1dGVzKX0ke3Bvc3RQYXJ0fWApLFxuICAgICAgICAgIGVsZW1lbnRzXG4gICAgICAgICkpIHtcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGktLVxuICAgICAgICBvcmlnaW5hbCA9IGF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmlnaW5hbFxuICAgIH1cblxuICAgIGNvbnN0IHNpbXBsaWZpZWQgPSBzaW1wbGlmeShhdHRyaWJ1dGVzLCAoYXR0cmlidXRlcywgaSkgPT4ge1xuICAgICAgY29uc3QgeyBuYW1lIH0gPSBhdHRyaWJ1dGVzW2ldXG4gICAgICBpZiAobmFtZSA9PT0gJ2lkJykge1xuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfVxuICAgICAgcmV0dXJuIFsuLi5hdHRyaWJ1dGVzLnNsaWNlKDAsIGkpLCB7IG5hbWUsIHZhbHVlOiBudWxsIH0sIC4uLmF0dHJpYnV0ZXMuc2xpY2UoaSArIDEpXVxuICAgIH0pXG5cbiAgICByZXR1cm4geyAuLi5jdXJyZW50LCBhdHRyaWJ1dGVzOiBzaW1wbGlmeShzaW1wbGlmaWVkLCBhdHRyaWJ1dGVzID0+IGF0dHJpYnV0ZXMuc2xpY2UoMCwgLTEpKSB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBkZXNjZW5kYW50XG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZURlc2NlbmRhbnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIC8vIHJvYnVzdG5lc3M6IGRlc2NlbmRhbnQgaW5zdGVhZCBjaGlsZCAoaGV1cmlzdGljKVxuICBpZiAoY3VycmVudC5yZWxhdGVzID09PSAnY2hpbGQnKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IHsgLi4uY3VycmVudCwgcmVsYXRlczogdW5kZWZpbmVkIH1cbiAgICBsZXQgbWF0Y2hlcyA9IHNlbGVjdChgJHtwcmVQYXJ0fSR7cGF0dGVyblRvU3RyaW5nKGRlc2NlbmRhbnQpfSR7cG9zdFBhcnR9YClcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICByZXR1cm4gZGVzY2VuZGFudFxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIE9wdGltaXplIG50aCBvZiB0eXBlXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZU50aE9mVHlwZSAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgY29uc3QgaSA9IGN1cnJlbnQucHNldWRvLmZpbmRJbmRleChpdGVtID0+IGl0ZW0uc3RhcnRzV2l0aCgnbnRoLWNoaWxkJykpXG4gIC8vIHJvYnVzdG5lc3M6ICdudGgtb2YtdHlwZScgaW5zdGVhZCAnbnRoLWNoaWxkJyAoaGV1cmlzdGljKVxuICBpZiAoaSA+PSAwKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgY29tcGxldGUgY292ZXJhZ2Ugb2YgJ250aC1vZi10eXBlJyByZXBsYWNlbWVudFxuICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50LnBzZXVkb1tpXS5yZXBsYWNlKC9ebnRoLWNoaWxkLywgJ250aC1vZi10eXBlJylcbiAgICBjb25zdCBudGhPZlR5cGUgPSB7IC4uLmN1cnJlbnQsIHBzZXVkbzogWy4uLmN1cnJlbnQucHNldWRvLnNsaWNlKDAsIGkpLCB0eXBlLCAuLi5jdXJyZW50LnBzZXVkby5zbGljZShpICsgMSldIH1cbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwYXR0ZXJuVG9TdHJpbmcobnRoT2ZUeXBlKX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBudGhPZlR5cGVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBPcHRpbWl6ZSBjbGFzc2VzXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZUNsYXNzZXMgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIC8vIGVmZmljaWVuY3k6IGNvbWJpbmF0aW9ucyBvZiBjbGFzc25hbWUgKHBhcnRpYWwgcGVybXV0YXRpb25zKVxuICBpZiAoY3VycmVudC5jbGFzc2VzLmxlbmd0aCA+IDEpIHtcbiAgICBsZXQgb3B0aW1pemVkID0gY3VycmVudC5jbGFzc2VzLnNsaWNlKCkuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcbiAgICBsZXQgcHJlZml4ID0gcGF0dGVyblRvU3RyaW5nKHsgLi4uY3VycmVudCwgY2xhc3NlczogW10gfSlcblxuICAgIHdoaWxlIChvcHRpbWl6ZWQubGVuZ3RoID4gMSkge1xuICAgICAgb3B0aW1pemVkLnNoaWZ0KClcbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7cHJlZml4fSR7Y2xhc3Nlc1RvU3RyaW5nKG9wdGltaXplZCl9JHtwb3N0UGFydH1gXG4gICAgICBpZiAoIXBhdHRlcm4ubGVuZ3RoIHx8IHBhdHRlcm4uY2hhckF0KDApID09PSAnPicgfHwgcGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGgtMSkgPT09ICc+Jykge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgaWYgKCFjb21wYXJlUmVzdWx0cyhzZWxlY3QocGF0dGVybiksIGVsZW1lbnRzKSkge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY3VycmVudC5jbGFzc2VzID0gb3B0aW1pemVkXG4gICAgfVxuXG4gICAgb3B0aW1pemVkID0gY3VycmVudC5jbGFzc2VzXG4gICAgaWYgKG9wdGltaXplZC5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gc2VsZWN0KGAke3ByZVBhcnR9JHtjbGFzc2VzVG9TdHJpbmcoY3VycmVudCl9YClcbiAgICAgIGZvciAodmFyIGkyID0gMCwgbDIgPSByZWZlcmVuY2VzLmxlbmd0aDsgaTIgPCBsMjsgaTIrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2kyXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgLy8gLSBjaGVjayB1c2luZyBhdHRyaWJ1dGVzICsgcmVnYXJkIGV4Y2x1ZGVzXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0geyB0YWc6IGRlc2NyaXB0aW9uIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY3VycmVudFxufVxuXG5jb25zdCBvcHRpbWl6ZXJzID0gW1xuICBvcHRpbWl6ZUNvbnRhaW5zLFxuICBvcHRpbWl6ZUF0dHJpYnV0ZXMsXG4gIG9wdGltaXplRGVzY2VuZGFudCxcbiAgb3B0aW1pemVOdGhPZlR5cGUsXG4gIG9wdGltaXplQ2xhc3Nlcyxcbl1cblxuLyoqXG4gKiBJbXByb3ZlIGEgY2h1bmsgb2YgdGhlIHNlbGVjdG9yXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtQYXR0ZXJufSAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICBzZWxlY3QgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1BhdHRlcm59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZVBhcnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSB7XG4gIGlmIChwcmVQYXJ0Lmxlbmd0aCkgcHJlUGFydCA9IGAke3ByZVBhcnR9IGBcbiAgaWYgKHBvc3RQYXJ0Lmxlbmd0aCkgcG9zdFBhcnQgPSBgICR7cG9zdFBhcnR9YFxuXG4gIHJldHVybiBvcHRpbWl6ZXJzLnJlZHVjZSgoYWNjLCBvcHRpbWl6ZXIpID0+IG9wdGltaXplcihwcmVQYXJ0LCBhY2MsIHBvc3RQYXJ0LCBlbGVtZW50cywgc2VsZWN0KSwgY3VycmVudClcbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBtYXRjaGVzIHdpdGggZXhwZWN0ZWQgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBtYXRjaGVzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVSZXN1bHRzIChtYXRjaGVzLCBlbGVtZW50cykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbWF0Y2hlc1xuICByZXR1cm4gbGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vcHRpbWl6ZS5qcyIsIi8qKlxuICogIyBBZGFwdFxuICpcbiAqIENoZWNrIGFuZCBleHRlbmQgdGhlIGVudmlyb25tZW50IGZvciB1bml2ZXJzYWwgdXNhZ2UuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3NlbGVjdCcpLk9wdGlvbnN9IE9wdGlvbnNcbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG4gIC8vIGRldGVjdCBlbnZpcm9ubWVudCBzZXR1cFxuICBpZiAoZ2xvYmFsLmRvY3VtZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmRvY3VtZW50ID0gb3B0aW9ucy5jb250ZXh0IHx8ICgoKSA9PiB7XG4gICAgICB2YXIgcm9vdCA9IGVsZW1lbnRcbiAgICAgIHdoaWxlIChyb290LnBhcmVudCkge1xuICAgICAgICByb290ID0gcm9vdC5wYXJlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290XG4gICAgfSkoKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9taGFuZGxlci9ibG9iL21hc3Rlci9pbmRleC5qcyNMNzVcbiAgY29uc3QgRWxlbWVudFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwuZG9jdW1lbnQpXG5cbiAgLy8gYWx0ZXJuYXRpdmUgZGVzY3JpcHRvciB0byBhY2Nlc3MgZWxlbWVudHMgd2l0aCBmaWx0ZXJpbmcgaW52YWxpZCBlbGVtZW50cyAoZS5nLiB0ZXh0bm9kZXMpXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21lbGVtZW50dHlwZS9ibG9iL21hc3Rlci9pbmRleC5qcyNMMTJcbiAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAndGFnJyB8fCBub2RlLnR5cGUgPT09ICdzY3JpcHQnIHx8IG5vZGUudHlwZSA9PT0gJ3N0eWxlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnKSkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dHJpYnV0ZXNcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTmFtZWROb2RlTWFwXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlicyB9ID0gdGhpc1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJzKVxuICAgICAgICBjb25zdCBOYW1lZE5vZGVNYXAgPSBhdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChhdHRyaWJ1dGVzLCBhdHRyaWJ1dGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJzW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICAgIH0sIHsgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hbWVkTm9kZU1hcCwgJ2xlbmd0aCcsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBOYW1lZE5vZGVNYXBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJzW25hbWVdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHModGhpcy5jaGlsZFRhZ3MsIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50Lm5hbWUgPT09IHRhZ05hbWUgfHwgdGFnTmFtZSA9PT0gJyonKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgbmFtZXMgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKS5zcGxpdCgnICcpXG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudENsYXNzTmFtZSA9IGRlc2NlbmRhbnQuYXR0cmlicy5jbGFzc1xuICAgICAgICBpZiAoZGVzY2VuZGFudENsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gZGVzY2VuZGFudENsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvY3NzL3NlbGVjdG9yc19hcGkvcXVlcnlTZWxlY3RvckFsbFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICBFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3JzKSB7XG4gICAgICBzZWxlY3RvcnMgPSBzZWxlY3RvcnMucmVwbGFjZSgvKD4pKFxcUykvZywgJyQxICQyJykudHJpbSgpIC8vIGFkZCBzcGFjZSBmb3IgJz4nIHNlbGVjdG9yXG5cbiAgICAgIC8vIHVzaW5nIHJpZ2h0IHRvIGxlZnQgZXhlY3V0aW9uID0+IGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2Nzcy1zZWxlY3QjaG93LWRvZXMtaXQtd29ya1xuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gZ2V0SW5zdHJ1Y3Rpb25zKHNlbGVjdG9ycylcbiAgICAgIGNvbnN0IGRpc2NvdmVyID0gaW5zdHJ1Y3Rpb25zLnNoaWZ0KClcblxuICAgICAgY29uc3QgdG90YWwgPSBpbnN0cnVjdGlvbnMubGVuZ3RoXG4gICAgICByZXR1cm4gZGlzY292ZXIodGhpcykuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIHZhciBzdGVwID0gMFxuICAgICAgICB3aGlsZSAoc3RlcCA8IHRvdGFsKSB7XG4gICAgICAgICAgbm9kZSA9IGluc3RydWN0aW9uc1tzdGVwXShub2RlLCB0aGlzKVxuICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBoaWVyYXJjaHkgZG9lc24ndCBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0ZXAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5jb250YWlucykge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NvbnRhaW5zXG4gICAgRWxlbWVudFByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgaW5jbHVzaXZlID0gZmFsc2VcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudCA9PT0gZWxlbWVudCkge1xuICAgICAgICAgIGluY2x1c2l2ZSA9IHRydWVcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbmNsdXNpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRyYW5zZm9ybWF0aW9uIHN0ZXBzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59ICAgc2VsZWN0b3JzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEZ1bmN0aW9uPn0gICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnMgKHNlbGVjdG9ycykge1xuICByZXR1cm4gc2VsZWN0b3JzLnNwbGl0KCcgJykucmV2ZXJzZSgpLm1hcCgoc2VsZWN0b3IsIHN0ZXApID0+IHtcbiAgICBjb25zdCBkaXNjb3ZlciA9IHN0ZXAgPT09IDBcbiAgICBjb25zdCBbdHlwZSwgcHNldWRvXSA9IHNlbGVjdG9yLnNwbGl0KCc6JylcblxuICAgIHZhciB2YWxpZGF0ZSA9IG51bGxcbiAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBudWxsXG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcblxuICAgICAgLy8gY2hpbGQ6ICc+J1xuICAgICAgY2FzZSAvPi8udGVzdCh0eXBlKTpcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1BhcmVudCAobm9kZSkge1xuICAgICAgICAgIHJldHVybiAodmFsaWRhdGUpID0+IHZhbGlkYXRlKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBuYW1lcyA9IHR5cGUuc3Vic3RyKDEpLnNwbGl0KCcuJylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGVDbGFzc05hbWUgPSBub2RlLmF0dHJpYnMuY2xhc3NcbiAgICAgICAgICByZXR1cm4gbm9kZUNsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gbm9kZUNsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0NsYXNzIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG5hbWVzLmpvaW4oJyAnKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIGF0dHJpYnV0ZTogJ1trZXk9XCJ2YWx1ZVwiXSdcbiAgICAgIGNhc2UgL15cXFsvLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdID0gdHlwZS5yZXBsYWNlKC9cXFt8XFxdfFwiL2csICcnKS5zcGxpdCgnPScpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBoYXNBdHRyaWJ1dGUgPSBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmluZGV4T2YoYXR0cmlidXRlS2V5KSA+IC0xXG4gICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZSkgeyAvLyByZWdhcmQgb3B0aW9uYWwgYXR0cmlidXRlVmFsdWVcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlVmFsdWUgfHwgKG5vZGUuYXR0cmlic1thdHRyaWJ1dGVLZXldID09PSBhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gaWQ6ICcjJ1xuICAgICAgY2FzZSAvXiMvLnRlc3QodHlwZSk6IHtcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6IHtcbiAgICAgICAgdmFsaWRhdGUgPSAoKSA9PiB0cnVlXG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tVbml2ZXJzYWwgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4gTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gdGFnOiAnLi4uJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09IHR5cGVcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVGFnIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHNldWRvKSB7XG4gICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25cbiAgICB9XG5cbiAgICBjb25zdCBydWxlID0gcHNldWRvLm1hdGNoKC8tKGNoaWxkfHR5cGUpXFwoKFxcZCspXFwpJC8pXG4gICAgY29uc3Qga2luZCA9IHJ1bGVbMV1cbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHJ1bGVbMl0sIDEwKSAtIDFcblxuICAgIGNvbnN0IHZhbGlkYXRlUHNldWRvID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciBjb21wYXJlU2V0ID0gbm9kZS5wYXJlbnQuY2hpbGRUYWdzXG4gICAgICAgIGlmIChraW5kID09PSAndHlwZScpIHtcbiAgICAgICAgICBjb21wYXJlU2V0ID0gY29tcGFyZVNldC5maWx0ZXIodmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gY29tcGFyZVNldC5maW5kSW5kZXgoKGNoaWxkKSA9PiBjaGlsZCA9PT0gbm9kZSlcbiAgICAgICAgaWYgKG5vZGVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZW5oYW5jZUluc3RydWN0aW9uIChub2RlKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGluc3RydWN0aW9uKG5vZGUpXG4gICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoLnJlZHVjZSgoTm9kZUxpc3QsIG1hdGNoZWROb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlUHNldWRvKG1hdGNoZWROb2RlKSkge1xuICAgICAgICAgICAgTm9kZUxpc3QucHVzaChtYXRjaGVkTm9kZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgIH0sIFtdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRlUHNldWRvKG1hdGNoKSAmJiBtYXRjaFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBXYWxraW5nIHJlY3Vyc2l2ZSB0byBpbnZva2UgY2FsbGJhY2tzXG4gKlxuICogQHBhcmFtIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBub2RlcyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgICAgICBoYW5kbGVyIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZURlc2NlbmRhbnRzIChub2RlcywgaGFuZGxlcikge1xuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgdmFyIHByb2dyZXNzID0gdHJ1ZVxuICAgIGhhbmRsZXIobm9kZSwgKCkgPT4gcHJvZ3Jlc3MgPSBmYWxzZSlcbiAgICBpZiAobm9kZS5jaGlsZFRhZ3MgJiYgcHJvZ3Jlc3MpIHtcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMobm9kZS5jaGlsZFRhZ3MsIGhhbmRsZXIpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEJ1YmJsZSB1cCBmcm9tIGJvdHRvbSB0byB0b3BcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcm9vdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgdmFsaWRhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEFuY2VzdG9yIChub2RlLCByb290LCB2YWxpZGF0ZSkge1xuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBub2RlID0gbm9kZS5wYXJlbnRcbiAgICBpZiAodmFsaWRhdGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgfVxuICAgIGlmIChub2RlID09PSByb290KSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FkYXB0LmpzIiwiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnkgc2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEZvciBsb25nZXZpdHkgaXQgYXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzLlxuICovXG5pbXBvcnQgY3NzMnhwYXRoIGZyb20gJ2NzczJ4cGF0aCdcblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRTZWxlY3QsIGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBwYXRoVG9TdHJpbmcgfSBmcm9tICcuL3BhdHRlcm4nXG5cbi8qKlxuICogQHR5cGVkZWYgIHtPYmplY3R9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IFtyb290XSAgICAgICAgICAgICAgICAgICAgIE9wdGlvbmFsbHkgc3BlY2lmeSB0aGUgcm9vdCBlbGVtZW50XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uIHwgQXJyYXkuPEhUTUxFbGVtZW50Pn0gW3NraXBdICBTcGVjaWZ5IGVsZW1lbnRzIHRvIHNraXBcbiAqIEBwcm9wZXJ0eSB7QXJyYXkuPHN0cmluZz59IFtwcmlvcml0eV0gICAgICAgICAgICAgIE9yZGVyIG9mIGF0dHJpYnV0ZSBwcm9jZXNzaW5nXG4gKiBAcHJvcGVydHkge09iamVjdDxzdHJpbmcsIGZ1bmN0aW9uIHwgbnVtYmVyIHwgc3RyaW5nIHwgYm9vbGVhbn0gW2lnbm9yZV0gRGVmaW5lIHBhdHRlcm5zIHdoaWNoIHNob3VsZG4ndCBiZSBpbmNsdWRlZFxuICogQHByb3BlcnR5IHsoJ2Nzcyd8J3hwYXRoJ3wnanF1ZXJ5Jyl9IFtmb3JtYXRdICAgICAgT3V0cHV0IGZvcm1hdCAgICBcbiAqL1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPcHRpb25zfSAgICAgW29wdGlvbnNdIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBwYXRoID0gbWF0Y2goZWxlbWVudCwgb3B0aW9ucylcbiAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemUocGF0aCwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICAke3NlbGVjdG9yfVxuICAvLyAgIG9wdGltaXplZDogJHtvcHRpbWl6ZWR9XG4gIC8vIGApXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGRlc2NlbmRhbnRzIGZyb20gYW4gYW5jZXN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fE5vZGVMaXN0fSBlbGVtZW50cyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T3B0aW9uc30gICAgICAgICAgICAgICAgICAgICAgW29wdGlvbnNdICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdWx0aVNlbGVjdG9yIChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IC0gb25seSBhbiBBcnJheSBvZiBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gaXMgc3VwcG9ydGVkIScpXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclNlbGVjdG9yID0gZ2V0U2luZ2xlU2VsZWN0b3IoYW5jZXN0b3IsIG9wdGlvbnMpXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgdXNhZ2Ugb2YgbXVsdGlwbGUgc2VsZWN0b3JzICsgcGFyZW50LWNoaWxkIHJlbGF0aW9uICsgY2hlY2sgZm9yIHBhcnQgcmVkdW5kYW5jeVxuICBjb25zdCBjb21tb25TZWxlY3RvcnMgPSBnZXRDb21tb25TZWxlY3RvcnMoZWxlbWVudHMpXG4gIGNvbnN0IGRlc2NlbmRhbnRTZWxlY3RvciA9IGNvbW1vblNlbGVjdG9yc1swXVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gb3B0aW1pemUoYCR7YW5jZXN0b3JTZWxlY3Rvcn0gJHtkZXNjZW5kYW50U2VsZWN0b3J9YCwgZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdG9yTWF0Y2hlcyA9IGNvbnZlcnROb2RlTGlzdChzZWxlY3Qoc2VsZWN0b3IpKVxuXG4gIGlmICghZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHNlbGVjdG9yTWF0Y2hlcy5zb21lKChlbnRyeSkgPT4gZW50cnkgPT09IGVsZW1lbnQpICkpIHtcbiAgICAvLyBUT0RPOiBjbHVzdGVyIG1hdGNoZXMgdG8gc3BsaXQgaW50byBzaW1pbGFyIGdyb3VwcyBmb3Igc3ViIHNlbGVjdGlvbnNcbiAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgIFRoZSBzZWxlY3RlZCBlbGVtZW50cyBjYW4ndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuXG4gICAgICBJdHMgcHJvYmFibHkgYmVzdCB0byB1c2UgbXVsdGlwbGUgc2luZ2xlIHNlbGVjdG9ycyBpbnN0ZWFkIVxuICAgIGAsIGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yXG59XG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tbW9uU2VsZWN0b3JzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IHsgY2xhc3NlcywgYXR0cmlidXRlcywgdGFnIH0gPSBnZXRDb21tb25Qcm9wZXJ0aWVzKGVsZW1lbnRzKVxuXG4gIGNvbnN0IHNlbGVjdG9yUGF0aCA9IFtdXG5cbiAgaWYgKHRhZykge1xuICAgIHNlbGVjdG9yUGF0aC5wdXNoKHRhZylcbiAgfVxuXG4gIGlmIChjbGFzc2VzKSB7XG4gICAgY29uc3QgY2xhc3NTZWxlY3RvciA9IGNsYXNzZXMubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGNsYXNzU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IGF0dHJpYnV0ZVNlbGVjdG9yID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykucmVkdWNlKChwYXJ0cywgbmFtZSkgPT4ge1xuICAgICAgcGFydHMucHVzaChgWyR7bmFtZX09XCIke2F0dHJpYnV0ZXNbbmFtZV19XCJdYClcbiAgICAgIHJldHVybiBwYXJ0c1xuICAgIH0sIFtdKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGF0dHJpYnV0ZVNlbGVjdG9yKVxuICB9XG5cbiAgaWYgKHNlbGVjdG9yUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBUT0RPOiBjaGVjayBmb3IgcGFyZW50LWNoaWxkIHJlbGF0aW9uXG4gIH1cblxuICByZXR1cm4gW1xuICAgIHNlbGVjdG9yUGF0aC5qb2luKCcnKVxuICBdXG59XG5cbi8qKlxuICogQ2hvb3NlIGFjdGlvbiBkZXBlbmRpbmcgb24gdGhlIGlucHV0IChtdWx0aXBsZS9zaW5nbGUpXG4gKlxuICogTk9URTogZXh0ZW5kZWQgZGV0ZWN0aW9uIGlzIHVzZWQgZm9yIHNwZWNpYWwgY2FzZXMgbGlrZSB0aGUgPHNlbGVjdD4gZWxlbWVudCB3aXRoIDxvcHRpb25zPlxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fE5vZGVMaXN0fEFycmF5LjxIVE1MRWxlbWVudD59IGlucHV0ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09wdGlvbnN9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvcHRpb25zXSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoaW5wdXQubGVuZ3RoICYmICFpbnB1dC5uYW1lKSB7XG4gICAgcmV0dXJuIGdldE11bHRpU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIGlmIChvcHRpb25zICYmIFsxLCAneHBhdGgnXS5pbmNsdWRlcyhvcHRpb25zLmZvcm1hdCkpIHtcbiAgICByZXR1cm4gY3NzMnhwYXRoKHJlc3VsdClcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3QuanMiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciB4cGF0aF90b19sb3dlciAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgICAgICAgKHMgfHwgJ25vcm1hbGl6ZS1zcGFjZSgpJykgK1xuICAgICAgICAgICAgICAgICcsIFxcJ0FCQ0RFRkdISklLTE1OT1BRUlNUVVZXWFlaXFwnJyArXG4gICAgICAgICAgICAgICAgJywgXFwnYWJjZGVmZ2hqaWtsbW5vcHFyc3R1dnd4eXpcXCcpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF9lbmRzX3dpdGggICAgICAgID0gZnVuY3Rpb24gKHMxLCBzMikge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZygnICsgczEgKyAnLCcgK1xuICAgICAgICAgICAgICAgICdzdHJpbmctbGVuZ3RoKCcgKyBzMSArICcpLXN0cmluZy1sZW5ndGgoJyArIHMyICsgJykrMSk9JyArIHMyO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybCAgICAgICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1iZWZvcmUoY29uY2F0KHN1YnN0cmluZy1hZnRlcignICtcbiAgICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIj9cIiksXCI/XCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfcGF0aCAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYWZ0ZXIoJyArIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2RvbWFpbiAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCI6Ly9cIiksXCIvXCIpLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2F0dHJzICAgICAgICA9ICdAaHJlZnxAc3JjJyxcbiAgICAgIHhwYXRoX2xvd2VyX2Nhc2UgICAgICAgPSB4cGF0aF90b19sb3dlcigpLFxuICAgICAgeHBhdGhfbnNfdXJpICAgICAgICAgICA9ICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0vQHVybCcsXG4gICAgICB4cGF0aF9uc19wYXRoICAgICAgICAgID0geHBhdGhfdXJsX3BhdGgoeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkpLFxuICAgICAgeHBhdGhfaGFzX3Byb3RvY2FsICAgICA9ICcoc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwOi8vXCIpIG9yIHN0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiaHR0cHM6Ly9cIikpJyxcbiAgICAgIHhwYXRoX2lzX2ludGVybmFsICAgICAgPSAnc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpICsgJykgb3IgJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF91cmxfZG9tYWluKCksIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9pc19sb2NhbCAgICAgICAgID0gJygnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkgKyAnKSknLFxuICAgICAgeHBhdGhfaXNfcGF0aCAgICAgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcIi9cIiknLFxuICAgICAgeHBhdGhfaXNfbG9jYWxfcGF0aCAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX3BhdGgoKSArICcsJyArIHhwYXRoX25zX3BhdGggKyAnKScsXG4gICAgICB4cGF0aF9ub3JtYWxpemVfc3BhY2UgID0gJ25vcm1hbGl6ZS1zcGFjZSgpJyxcbiAgICAgIHhwYXRoX2ludGVybmFsICAgICAgICAgPSAnW25vdCgnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJykgb3IgJyArIHhwYXRoX2lzX2ludGVybmFsICsgJ10nLFxuICAgICAgeHBhdGhfZXh0ZXJuYWwgICAgICAgICA9ICdbJyArIHhwYXRoX2hhc19wcm90b2NhbCArICcgYW5kIG5vdCgnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnKV0nLFxuICAgICAgZXNjYXBlX2xpdGVyYWwgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzApLFxuICAgICAgZXNjYXBlX3BhcmVucyAgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzEpLFxuICAgICAgcmVnZXhfc3RyaW5nX2xpdGVyYWwgICA9IC8oXCJbXlwiXFx4MUVdKlwifCdbXidcXHgxRV0qJ3w9XFxzKlteXFxzXFxdXFwnXFxcIl0rKS9nLFxuICAgICAgcmVnZXhfZXNjYXBlZF9saXRlcmFsICA9IC9bJ1wiXT8oXFx4MUUrKVsnXCJdPy9nLFxuICAgICAgcmVnZXhfY3NzX3dyYXBfcHNldWRvICA9IC8oXFx4MUZcXCl8W15cXCldKVxcOihmaXJzdHxsaW1pdHxsYXN0fGd0fGx0fGVxfG50aCkoW15cXC1dfCQpLyxcbiAgICAgIHJlZ2V4X3NwZWNhbF9jaGFycyAgICAgPSAvW1xceDFDLVxceDFGXSsvZyxcbiAgICAgIHJlZ2V4X2ZpcnN0X2F4aXMgICAgICAgPSAvXihbXFxzXFwoXFx4MUZdKikoXFwuP1teXFwuXFwvXFwoXXsxLDJ9W2Etel0qOiopLyxcbiAgICAgIHJlZ2V4X2ZpbHRlcl9wcmVmaXggICAgPSAvKF58XFwvfFxcOilcXFsvZyxcbiAgICAgIHJlZ2V4X2F0dHJfcHJlZml4ICAgICAgPSAvKFteXFwoXFxbXFwvXFx8XFxzXFx4MUZdKVxcQC9nLFxuICAgICAgcmVnZXhfbnRoX2VxdWF0aW9uICAgICA9IC9eKFstMC05XSopbi4qPyhbMC05XSopJC8sXG4gICAgICBjc3NfY29tYmluYXRvcnNfcmVnZXggID0gL1xccyooIT9bKz5+LF4gXSlcXHMqKFxcLj9cXC8rfFthLXpcXC1dKzo6KT8oW2EtelxcLV0rXFwoKT8oKGFuZFxccyp8b3JcXHMqfG1vZFxccyopP1teKz5+LFxccydcIlxcXVxcfFxcXlxcJFxcIVxcPFxcPVxceDFDLVxceDFGXSspPy9nLFxuICAgICAgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBvcGVyYXRvciwgYXhpcywgZnVuYywgbGl0ZXJhbCwgZXhjbHVkZSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSAnJzsgLy8gSWYgd2UgY2FuLCB3ZSdsbCBwcmVmaXggYSAnLidcblxuICAgICAgICAvLyBYUGF0aCBvcGVyYXRvcnMgY2FuIGxvb2sgbGlrZSBub2RlLW5hbWUgc2VsZWN0b3JzXG4gICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgYW5kXCIsIFwiIG9yXCIsIFwiIG1vZFwiXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJyAnICYmIGV4Y2x1ZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBPbmx5IGFsbG93IG5vZGUtc2VsZWN0aW5nIFhQYXRoIGZ1bmN0aW9uc1xuICAgICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgKyBjb3VudCguLi4pXCIsIFwiIGNvdW50KC4uLilcIiwgXCIgPiBwb3NpdGlvbigpXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoZnVuYyAhPT0gdW5kZWZpbmVkICYmIChmdW5jICE9PSAnbm9kZSgnICYmIGZ1bmMgIT09ICd0ZXh0KCcgJiYgZnVuYyAhPT0gJ2NvbW1lbnQoJykpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGl0ZXJhbCA9IGZ1bmM7XG4gICAgICAgICAgfSAvLyBIYW5kbGUgY2FzZSBcIiArIHRleHQoKVwiLCBcIiA+IGNvbW1lbnQoKVwiLCBldGMuIHdoZXJlIFwiZnVuY1wiIGlzIG91ciBcImxpdGVyYWxcIlxuXG4gICAgICAgICAgICAvLyBYUGF0aCBtYXRoIG9wZXJhdG9ycyBtYXRjaCBzb21lIENTUyBjb21iaW5hdG9yc1xuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIDFcIiwgXCIgPiAxXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGxpdGVyYWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByZXZDaGFyID0gb3JpZy5jaGFyQXQob2Zmc2V0IC0gMSk7XG5cbiAgICAgICAgICBpZiAocHJldkNoYXIubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnfCcgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSB7XG4gICAgICAgICAgICBwcmVmaXggPSAnLic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGlmIHdlIGRvbid0IGhhdmUgYSBzZWxlY3RvciB0byBmb2xsb3cgdGhlIGF4aXNcbiAgICAgICAgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvZmZzZXQgKyBtYXRjaC5sZW5ndGggPT09IG9yaWcubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gJyonO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIHJldHVybiAnLy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgcmV0dXJuICcvJyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgJy9mb2xsb3dpbmctc2libGluZzo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJywnOlxuICAgICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIH1cbiAgICAgICAgICBheGlzID0gJy4vLyc7XG4gICAgICAgICAgcmV0dXJuICd8JyArIGF4aXMgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICdeJzogLy8gZmlyc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIV4nOiAvLyBsYXN0IGNoaWxkXG4gICAgICAgICAgcmV0dXJuICcvY2hpbGQ6OipbbGFzdCgpXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISAnOiAvLyBhbmNlc3Rvci1vci1zZWxmXG4gICAgICAgICAgcmV0dXJuICcvYW5jZXN0b3Itb3Itc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyE+JzogLy8gZGlyZWN0IHBhcmVudFxuICAgICAgICAgIHJldHVybiAnL3BhcmVudDo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyErJzogLy8gYWRqYWNlbnQgcHJlY2VkaW5nIHNpYmxpbmdcbiAgICAgICAgICByZXR1cm4gJy9wcmVjZWRpbmctc2libGluZzo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIX4nOiAvLyBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgICAgIC8vIGNhc2UgJ35+J1xuICAgICAgICAgICAgLy8gcmV0dXJuICcvZm9sbG93aW5nLXNpYmxpbmc6Oiovc2VsZjo6fCcrc2VsZWN0b3JTdGFydChvcmlnLCBvZmZzZXQpKycvcHJlY2VkaW5nLXNpYmxpbmc6Oiovc2VsZjo6JytsaXRlcmFsO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfYXR0cmlidXRlc19yZWdleCA9IC9cXFsoW15cXF1cXEBcXHxcXCpcXD1cXF5cXH5cXCRcXCFcXChcXC9cXHNcXHgxQy1cXHgxRl0rKVxccyooKFtcXHxcXCpcXH5cXF5cXCRcXCFdPyk9P1xccyooXFx4MUUrKSk/XFxdL2csXG4gICAgICBjc3NfYXR0cmlidXRlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIGF0dHIsIGNvbXAsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAocHJldkNoYXIgPT09ICcvJyB8fCAvLyBmb3VuZCBhZnRlciBhbiBheGlzIHNob3J0Y3V0IChcIi9cIiwgXCIvL1wiLCBldGMuKVxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICc6JykgICAvLyBmb3VuZCBhZnRlciBhbiBheGlzIChcInNlbGY6OlwiLCBcInBhcmVudDo6XCIsIGV0Yy4pXG4gICAgICAgICAgICBheGlzID0gJyonOyovXG5cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbbm90KEAnICsgYXR0ciArICcpIG9yIEAnICsgYXR0ciArICchPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3Vic3RyaW5nKEAnICsgYXR0ciArICcsc3RyaW5nLWxlbmd0aChAJyArIGF0dHIgKyAnKS0oc3RyaW5nLWxlbmd0aChcIicgKyB2YWwgKyAnXCIpLTEpKT1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW3N0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbY29udGFpbnMoY29uY2F0KFwiIFwiLG5vcm1hbGl6ZS1zcGFjZShAJyArIGF0dHIgKyAnKSxcIiBcIiksY29uY2F0KFwiIFwiLFwiJyArIHZhbCArICdcIixcIiBcIikpXSc7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhAJyArIGF0dHIgKyAnLFwiJyArIHZhbCArICdcIildJztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiIG9yIHN0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsY29uY2F0KFwiJyArIHZhbCArICdcIixcIi1cIikpXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGF0dHIuY2hhckF0KGF0dHIubGVuZ3RoIC0gMSkgPT09ICcoJyB8fCBhdHRyLnNlYXJjaCgvXlswLTldKyQvKSAhPT0gLTEgfHwgYXR0ci5pbmRleE9mKCc6JykgIT09IC0xKSAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnXSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4ID0gLzooW2EtelxcLV0rKShcXCgoXFx4MUYrKSgoW15cXHgxRl0rKFxcM1xceDFGKyk/KSopKFxcM1xcKSkpPy9nLFxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCBnMSwgZzIsIGFyZywgZzMsIGc0LCBnNSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIGlmIChvcmlnLmNoYXJBdChvZmZzZXQgLSAxKSA9PT0gJzonICYmIG9yaWcuY2hhckF0KG9mZnNldCAtIDIpICE9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIFhQYXRoIFwiYXhpczo6bm9kZS1uYW1lXCIgd2lsbCBtYXRjaFxuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIFwiOm5vZGUtbmFtZVwiXG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgPT09ICdvZGQnIHx8IG5hbWUgPT09ICdldmVuJykge1xuICAgICAgICAgIGFyZyAgPSBuYW1lO1xuICAgICAgICAgIG5hbWUgPSAnbnRoLW9mLXR5cGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChuYW1lKSB7IC8vIG5hbWUudG9Mb3dlckNhc2UoKT9cbiAgICAgICAgY2FzZSAnYWZ0ZXInOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3ByZWNlZGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYWZ0ZXItc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZSc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdiZWZvcmUtc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2NoZWNrZWQnOlxuICAgICAgICAgIHJldHVybiAnW0BzZWxlY3RlZCBvciBAY2hlY2tlZF0nO1xuICAgICAgICBjYXNlICdjb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2ljb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX2xvd2VyX2Nhc2UgKyAnLCcgKyB4cGF0aF90b19sb3dlcihhcmcpICsgJyldJztcbiAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgIHJldHVybiAnW25vdCgqKSBhbmQgbm90KG5vcm1hbGl6ZS1zcGFjZSgpKV0nO1xuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgICAgIHJldHVybiAnW0AnICsgbmFtZSArICddJztcbiAgICAgICAgY2FzZSAnZmlyc3QtY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnZmlyc3QnOlxuICAgICAgICBjYXNlICdsaW1pdCc6XG4gICAgICAgIGNhc2UgJ2ZpcnN0LW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAnZ3QnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbHQnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPCcgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbGFzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdvbmx5LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OiopIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktb2YtdHlwZSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKSBhbmQgbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKV0nO1xuICAgICAgICBjYXNlICdudGgtY2hpbGQnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgPSAnICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKGFyZykge1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0wXSc7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgbW9kIDI9MV0nO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgYSA9IChhcmcgfHwgJzAnKS5yZXBsYWNlKHJlZ2V4X250aF9lcXVhdGlvbiwgJyQxKyQyJykuc3BsaXQoJysnKTtcblxuICAgICAgICAgICAgYVswXSA9IGFbMF0gfHwgJzEnO1xuICAgICAgICAgICAgYVsxXSA9IGFbMV0gfHwgJzAnO1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKT49JyArIGFbMV0gKyAnIGFuZCAoKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKS0nICsgYVsxXSArICcpIG1vZCAnICsgYVswXSArICc9MF0nO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnbnRoLW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCkgbW9kIDI9MV0nO1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0wIGFuZCBwb3NpdGlvbigpPj0wXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPj0nICsgYVsxXSArICcgYW5kIChwb3NpdGlvbigpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdlcSc6XG4gICAgICAgIGNhc2UgJ250aCc6XG4gICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgcmV0dXJuICdbQHR5cGU9XCJ0ZXh0XCJdJztcbiAgICAgICAgY2FzZSAnaXN0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdzdGFydHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2llbmRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnWycgKyB4cGF0aF9lbmRzX3dpdGgoeHBhdGhfbG93ZXJfY2FzZSwgeHBhdGhfdG9fbG93ZXIoYXJnKSkgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2VuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9ub3JtYWxpemVfc3BhY2UsIGFyZykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2hhcyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gcHJlcGVuZEF4aXMoY3NzMnhwYXRoKGFyZywgdHJ1ZSksICcuLy8nKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtc2libGluZyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgeHBhdGggKyAnKSA+IDAgb3IgY291bnQoZm9sbG93aW5nLXNpYmxpbmc6OicgKyB4cGF0aC5zdWJzdHIoMTkpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1wYXJlbnQnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3BhcmVudDo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLWFuY2VzdG9yJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdhbmNlc3Rvcjo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnbGFzdCc6XG4gICAgICAgIGNhc2UgJ2xhc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT5sYXN0KCktJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3NlbGVjdGVkJzogLy8gU2l6emxlOiBcIihvcHRpb24pIGVsZW1lbnRzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZFwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwib3B0aW9uXCIgYW5kIEBzZWxlY3RlZF0nO1xuICAgICAgICBjYXNlICdza2lwJzpcbiAgICAgICAgY2FzZSAnc2tpcC1maXJzdCc6XG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT4nICsgYXJnICsgJ10nO1xuICAgICAgICBjYXNlICdza2lwLWxhc3QnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW2xhc3QoKS1wb3NpdGlvbigpPj0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPGxhc3QoKV0nO1xuICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvcjo6W2xhc3QoKV0nO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgdmFyIGFyciA9IGFyZy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgcmV0dXJuICdbJyArIGFyclswXSArICc8PXBvc2l0aW9uKCkgYW5kIHBvc2l0aW9uKCk8PScgKyBhcnJbMV0gKyAnXSc7XG4gICAgICAgIGNhc2UgJ2lucHV0JzogLy8gU2l6emxlOiBcImlucHV0LCBidXR0b24sIHNlbGVjdCwgYW5kIHRleHRhcmVhIGFyZSBhbGwgY29uc2lkZXJlZCB0byBiZSBpbnB1dCBlbGVtZW50cy5cIlxuICAgICAgICAgIHJldHVybiAnW2xvY2FsLW5hbWUoKT1cImlucHV0XCIgb3IgbG9jYWwtbmFtZSgpPVwiYnV0dG9uXCIgb3IgbG9jYWwtbmFtZSgpPVwic2VsZWN0XCIgb3IgbG9jYWwtbmFtZSgpPVwidGV4dGFyZWFcIl0nO1xuICAgICAgICBjYXNlICdpbnRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2ludGVybmFsO1xuICAgICAgICBjYXNlICdleHRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2V4dGVybmFsO1xuICAgICAgICBjYXNlICdodHRwJzpcbiAgICAgICAgY2FzZSAnaHR0cHMnOlxuICAgICAgICBjYXNlICdtYWlsdG8nOlxuICAgICAgICBjYXNlICdqYXZhc2NyaXB0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZixjb25jYXQoXCInICsgbmFtZSArICdcIixcIjpcIikpXSc7XG4gICAgICAgIGNhc2UgJ2RvbWFpbic6XG4gICAgICAgICAgcmV0dXJuICdbKHN0cmluZy1sZW5ndGgoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcpPTAgYW5kIGNvbnRhaW5zKCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnLCcgKyBhcmcgKyAnKSkgb3IgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJyxzdWJzdHJpbmctYWZ0ZXIoXCInICsgYXJnICsgJ1wiLFwiL1wiKSldJ1xuICAgICAgICBjYXNlICdub3QnOlxuICAgICAgICAgIHZhciB4cGF0aCA9IGNzczJ4cGF0aChhcmcsIHRydWUpO1xuXG4gICAgICAgICAgaWYgKHhwYXRoLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgeHBhdGggPSAnc2VsZjo6bm9kZSgpJyArIHhwYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tub3QoJyArIHhwYXRoICsgJyldJztcbiAgICAgICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZiwgXCIjXCIpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnYW5jZXN0b3Itb3Itc2VsZjo6KltsYXN0KCldJztcbiAgICAgICAgICAgIC8qIGNhc2UgJ2FjdGl2ZSc6XG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6XG4gICAgICAgICAgICBjYXNlICdob3Zlcic6XG4gICAgICAgICAgICBjYXNlICdsaW5rJzpcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnJzsqL1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tAbGFuZz1cIicgKyBhcmcgKyAnXCJdJztcbiAgICAgICAgY2FzZSAncmVhZC1vbmx5JzpcbiAgICAgICAgY2FzZSAncmVhZC13cml0ZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lLnJlcGxhY2UoJy0nLCAnJykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3ZhbGlkJzpcbiAgICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICBjYXNlICdpbi1yYW5nZSc6XG4gICAgICAgIGNhc2UgJ291dC1vZi1yYW5nZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX2lkc19jbGFzc2VzX3JlZ2V4ID0gLygjfFxcLikoW15cXCNcXEBcXC5cXC9cXChcXFtcXClcXF1cXHxcXDpcXHNcXCtcXD5cXDxcXCdcXFwiXFx4MUQtXFx4MUZdKykvZyxcbiAgICAgIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICAvKiB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQtMSk7XG4gICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnLycgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnKCcpXG4gICAgICAgICAgICBheGlzID0gJyonO1xuICAgICAgICBlbHNlIGlmIChwcmV2Q2hhciA9PT0gJzonKVxuICAgICAgICAgICAgYXhpcyA9ICdub2RlKCknOyovXG4gICAgICAgIGlmIChvcCA9PT0gJyMnKSAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQGlkPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEBjbGFzcyksXCIgXCIpLFwiICcgKyB2YWwgKyAnIFwiKV0nO1xuICAgICAgfTtcblxuICAgIC8vIFByZXBlbmQgZGVzY2VuZGFudC1vci1zZWxmIGlmIG5vIG90aGVyIGF4aXMgaXMgc3BlY2lmaWVkXG4gIGZ1bmN0aW9uIHByZXBlbmRBeGlzKHMsIGF4aXMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlZ2V4X2ZpcnN0X2F4aXMsIGZ1bmN0aW9uIChtYXRjaCwgc3RhcnQsIGxpdGVyYWwpIHtcbiAgICAgIGlmIChsaXRlcmFsLnN1YnN0cihsaXRlcmFsLmxlbmd0aCAtIDIpID09PSAnOjonKSAvLyBBbHJlYWR5IGhhcyBheGlzOjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuXG4gICAgICBpZiAobGl0ZXJhbC5jaGFyQXQoMCkgPT09ICdbJykgICAgICAgICAgICB7XG4gICAgICAgIGF4aXMgKz0gJyonO1xuICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChheGlzLmNoYXJBdChheGlzLmxlbmd0aC0xKSA9PT0gJyknKVxuICAgICAgICAvLyAgICBheGlzICs9ICcvJztcbiAgICAgIHJldHVybiBzdGFydCArIGF4aXMgKyBsaXRlcmFsO1xuICAgIH0pO1xuICB9XG5cbiAgICAvLyBGaW5kIHRoZSBiZWdpbmluZyBvZiB0aGUgc2VsZWN0b3IsIHN0YXJ0aW5nIGF0IGkgYW5kIHdvcmtpbmcgYmFja3dhcmRzXG4gIGZ1bmN0aW9uIHNlbGVjdG9yU3RhcnQocywgaSkge1xuICAgIHZhciBkZXB0aCA9IDA7XG4gICAgdmFyIG9mZnNldCA9IDA7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBzd2l0Y2ggKHMuY2hhckF0KGkpKSB7XG4gICAgICBjYXNlICcgJzpcbiAgICAgIGNhc2UgZXNjYXBlX3BhcmVuczpcbiAgICAgICAgb2Zmc2V0Kys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWyc6XG4gICAgICBjYXNlICcoJzpcbiAgICAgICAgZGVwdGgtLTtcblxuICAgICAgICBpZiAoZGVwdGggPCAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICddJzpcbiAgICAgIGNhc2UgJyknOlxuICAgICAgICBkZXB0aCsrO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJywnOlxuICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGlmIChkZXB0aCA9PT0gMCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gKytpICsgb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgICAvLyBDaGVjayBpZiBzdHJpbmcgaXMgbnVtZXJpY1xuICBmdW5jdGlvbiBpc051bWVyaWMocykge1xuICAgIHZhciBudW0gPSBwYXJzZUludChzLCAxMCk7XG5cbiAgICByZXR1cm4gKCFpc05hTihudW0pICYmICcnICsgbnVtID09PSBzKTtcbiAgfVxuXG4gICAgLy8gQXBwZW5kIGVzY2FwZSBcImNoYXJcIiB0byBcIm9wZW5cIiBvciBcImNsb3NlXCJcbiAgZnVuY3Rpb24gZXNjYXBlQ2hhcihzLCBvcGVuLCBjbG9zZSwgY2hhcikge1xuICAgIHZhciBkZXB0aCA9IDA7XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXFxcJyArIG9wZW4gKyAnXFxcXCcgKyBjbG9zZSArICddJywgJ2cnKSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgIGlmIChhID09PSBvcGVuKSAgICAgICAgICAgIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGEgPT09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIGEgKyByZXBlYXQoY2hhciwgZGVwdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlcGVhdChjaGFyLCBkZXB0aC0tKSArIGE7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGVhdChzdHIsIG51bSkge1xuICAgIG51bSA9IE51bWJlcihudW0pO1xuICAgIHZhciByZXN1bHQgPSAnJztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAobnVtICYgMSkgICAgICAgICAgICB7XG4gICAgICAgIHJlc3VsdCArPSBzdHI7XG4gICAgICB9XG4gICAgICBudW0gPj4+PSAxO1xuXG4gICAgICBpZiAobnVtIDw9IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzdHIgKz0gc3RyO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0RXNjYXBpbmcgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1xcXFwoW2BcXFxcLzpcXD8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XSkvZywgJyQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcKFsnXCJdKS9nLCAnJDEkMScpXG4gICAgICAucmVwbGFjZSgvXFxcXEEgL2csICdcXG4nKVxuICB9XG5cbiAgZnVuY3Rpb24gY3NzMnhwYXRoKHMsIG5lc3RlZCkge1xuICAgIC8vIHMgPSBzLnRyaW0oKTtcblxuICAgIGlmIChuZXN0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICAvLyBUYWcgb3BlbiBhbmQgY2xvc2UgcGFyZW50aGVzaXMgcGFpcnMgKGZvciBSZWdFeHAgc2VhcmNoZXMpXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJygnLCAnKScsIGVzY2FwZV9wYXJlbnMpO1xuXG4gICAgLy8gUmVtb3ZlIGFuZCBzYXZlIGFueSBzdHJpbmcgbGl0ZXJhbHNcbiAgICB2YXIgbGl0ZXJhbHMgPSBbXTtcblxuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3RyaW5nX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICBpZiAoYS5jaGFyQXQoMCkgPT09ICc9Jykge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSkudHJpbSgpO1xuXG4gICAgICAgIGlmIChpc051bWVyaWMoYSkpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IGEuc3Vic3RyKDEsIGEubGVuZ3RoIC0gMik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBlYXQoZXNjYXBlX2xpdGVyYWwsIGxpdGVyYWxzLnB1c2goY29udmVydEVzY2FwaW5nKGEpKSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBjb21iaW5hdG9ycyAoXCIgXCIsIFwiK1wiLCBcIj5cIiwgXCJ+XCIsIFwiLFwiKSBhbmQgcmV2ZXJzZSBjb21iaW5hdG9ycyAoXCIhXCIsIFwiIStcIiwgXCIhPlwiLCBcIiF+XCIpXG4gICAgcyA9IHMucmVwbGFjZShjc3NfY29tYmluYXRvcnNfcmVnZXgsIGNzc19jb21iaW5hdG9yc19jYWxsYmFjayk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBhdHRyaWJ1dGUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2F0dHJpYnV0ZXNfcmVnZXgsIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrKTtcblxuICAgIC8vIFdyYXAgY2VydGFpbiA6cHNldWRvLWNsYXNzZXMgaW4gcGFyZW5zICh0byBjb2xsZWN0IG5vZGUtc2V0cylcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGluZGV4ID0gcy5zZWFyY2gocmVnZXhfY3NzX3dyYXBfcHNldWRvKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gcy5pbmRleE9mKCc6JywgaW5kZXgpO1xuICAgICAgdmFyIHN0YXJ0ID0gc2VsZWN0b3JTdGFydChzLCBpbmRleCk7XG5cbiAgICAgIHMgPSBzLnN1YnN0cigwLCBzdGFydCkgK1xuICAgICAgICAgICAgJygnICsgcy5zdWJzdHJpbmcoc3RhcnQsIGluZGV4KSArICcpJyArXG4gICAgICAgICAgICBzLnN1YnN0cihpbmRleCk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCwgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19pZHNfY2xhc3Nlc19yZWdleCwgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIHNhdmVkIHN0cmluZyBsaXRlcmFsc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZXNjYXBlZF9saXRlcmFsLCBmdW5jdGlvbiAocywgYSkge1xuICAgICAgdmFyIHN0ciA9IGxpdGVyYWxzW2EubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiAnXCInICsgc3RyICsgJ1wiJztcbiAgICB9KVxuXG4gICAgLy8gUmVtb3ZlIGFueSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X3NwZWNhbF9jaGFycywgJycpO1xuXG4gICAgLy8gYWRkICogdG8gc3RhbmQtYWxvbmUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZmlsdGVyX3ByZWZpeCwgJyQxKlsnKTtcblxuICAgIC8vIGFkZCBcIi9cIiBiZXR3ZWVuIEBhdHRyaWJ1dGUgc2VsZWN0b3JzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9hdHRyX3ByZWZpeCwgJyQxL0AnKTtcblxuICAgIC8qXG4gICAgQ29tYmluZSBtdWx0aXBsZSBmaWx0ZXJzP1xuXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJ1snLCAnXScsIGZpbHRlcl9jaGFyKTtcbiAgICBzID0gcy5yZXBsYWNlKC8oXFx4MUQrKVxcXVxcW1xcMSguKz9bXlxceDFEXSlcXDFcXF0vZywgJyBhbmQgKCQyKSQxXScpXG4gICAgKi9cblxuICAgIHMgPSBwcmVwZW5kQXhpcyhzLCAnLi8vJyk7IC8vIHByZXBlbmQgXCIuLy9cIiBheGlzIHRvIGJlZ2luaW5nIG9mIENTUyBzZWxlY3RvclxuICAgIHJldHVybiBzO1xuICB9XG5cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY3NzMnhwYXRoO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5jc3MyeHBhdGggPSBjc3MyeHBhdGg7XG4gIH1cblxufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzMnhwYXRoL2luZGV4LmpzIiwiLyohXG4gKiBTaXp6bGUgQ1NTIFNlbGVjdG9yIEVuZ2luZSB2Mi4zLjZcbiAqIGh0dHBzOi8vc2l6emxlanMuY29tL1xuICpcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9qcy5mb3VuZGF0aW9uL1xuICpcbiAqIERhdGU6IDIwMjEtMDItMTZcbiAqL1xuKCBmdW5jdGlvbiggd2luZG93ICkge1xudmFyIGksXG5cdHN1cHBvcnQsXG5cdEV4cHIsXG5cdGdldFRleHQsXG5cdGlzWE1MLFxuXHR0b2tlbml6ZSxcblx0Y29tcGlsZSxcblx0c2VsZWN0LFxuXHRvdXRlcm1vc3RDb250ZXh0LFxuXHRzb3J0SW5wdXQsXG5cdGhhc0R1cGxpY2F0ZSxcblxuXHQvLyBMb2NhbCBkb2N1bWVudCB2YXJzXG5cdHNldERvY3VtZW50LFxuXHRkb2N1bWVudCxcblx0ZG9jRWxlbSxcblx0ZG9jdW1lbnRJc0hUTUwsXG5cdHJidWdneVFTQSxcblx0cmJ1Z2d5TWF0Y2hlcyxcblx0bWF0Y2hlcyxcblx0Y29udGFpbnMsXG5cblx0Ly8gSW5zdGFuY2Utc3BlY2lmaWMgZGF0YVxuXHRleHBhbmRvID0gXCJzaXp6bGVcIiArIDEgKiBuZXcgRGF0ZSgpLFxuXHRwcmVmZXJyZWREb2MgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdGRpcnJ1bnMgPSAwLFxuXHRkb25lID0gMCxcblx0Y2xhc3NDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHRva2VuQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRjb21waWxlckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHNvcnRPcmRlciA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAwO1xuXHR9LFxuXG5cdC8vIEluc3RhbmNlIG1ldGhvZHNcblx0aGFzT3duID0gKCB7fSApLmhhc093blByb3BlcnR5LFxuXHRhcnIgPSBbXSxcblx0cG9wID0gYXJyLnBvcCxcblx0cHVzaE5hdGl2ZSA9IGFyci5wdXNoLFxuXHRwdXNoID0gYXJyLnB1c2gsXG5cdHNsaWNlID0gYXJyLnNsaWNlLFxuXG5cdC8vIFVzZSBhIHN0cmlwcGVkLWRvd24gaW5kZXhPZiBhcyBpdCdzIGZhc3RlciB0aGFuIG5hdGl2ZVxuXHQvLyBodHRwczovL2pzcGVyZi5jb20vdGhvci1pbmRleG9mLXZzLWZvci81XG5cdGluZGV4T2YgPSBmdW5jdGlvbiggbGlzdCwgZWxlbSApIHtcblx0XHR2YXIgaSA9IDAsXG5cdFx0XHRsZW4gPSBsaXN0Lmxlbmd0aDtcblx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdGlmICggbGlzdFsgaSBdID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9LFxuXG5cdGJvb2xlYW5zID0gXCJjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58XCIgK1xuXHRcdFwiaXNtYXB8bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZFwiLFxuXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcblxuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXNlbGVjdG9ycy8jd2hpdGVzcGFjZVxuXHR3aGl0ZXNwYWNlID0gXCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLFxuXG5cdC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3Mtc3ludGF4LTMvI2lkZW50LXRva2VuLWRpYWdyYW1cblx0aWRlbnRpZmllciA9IFwiKD86XFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIiArIHdoaXRlc3BhY2UgK1xuXHRcdFwiP3xcXFxcXFxcXFteXFxcXHJcXFxcblxcXFxmXXxbXFxcXHctXXxbXlxcMC1cXFxceDdmXSkrXCIsXG5cblx0Ly8gQXR0cmlidXRlIHNlbGVjdG9yczogaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNhdHRyaWJ1dGUtc2VsZWN0b3JzXG5cdGF0dHJpYnV0ZXMgPSBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqKFwiICsgaWRlbnRpZmllciArIFwiKSg/OlwiICsgd2hpdGVzcGFjZSArXG5cblx0XHQvLyBPcGVyYXRvciAoY2FwdHVyZSAyKVxuXHRcdFwiKihbKl4kfCF+XT89KVwiICsgd2hpdGVzcGFjZSArXG5cblx0XHQvLyBcIkF0dHJpYnV0ZSB2YWx1ZXMgbXVzdCBiZSBDU1MgaWRlbnRpZmllcnMgW2NhcHR1cmUgNV1cblx0XHQvLyBvciBzdHJpbmdzIFtjYXB0dXJlIDMgb3IgY2FwdHVyZSA0XVwiXG5cdFx0XCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIiArIGlkZW50aWZpZXIgKyBcIikpfClcIiArXG5cdFx0d2hpdGVzcGFjZSArIFwiKlxcXFxdXCIsXG5cblx0cHNldWRvcyA9IFwiOihcIiArIGlkZW50aWZpZXIgKyBcIikoPzpcXFxcKChcIiArXG5cblx0XHQvLyBUbyByZWR1Y2UgdGhlIG51bWJlciBvZiBzZWxlY3RvcnMgbmVlZGluZyB0b2tlbml6ZSBpbiB0aGUgcHJlRmlsdGVyLCBwcmVmZXIgYXJndW1lbnRzOlxuXHRcdC8vIDEuIHF1b3RlZCAoY2FwdHVyZSAzOyBjYXB0dXJlIDQgb3IgY2FwdHVyZSA1KVxuXHRcdFwiKCcoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcIil8XCIgK1xuXG5cdFx0Ly8gMi4gc2ltcGxlIChjYXB0dXJlIDYpXG5cdFx0XCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFwoKVtcXFxcXV18XCIgKyBhdHRyaWJ1dGVzICsgXCIpKil8XCIgK1xuXG5cdFx0Ly8gMy4gYW55dGhpbmcgZWxzZSAoY2FwdHVyZSAyKVxuXHRcdFwiLipcIiArXG5cdFx0XCIpXFxcXCl8KVwiLFxuXG5cdC8vIExlYWRpbmcgYW5kIG5vbi1lc2NhcGVkIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGNhcHR1cmluZyBzb21lIG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlcnMgcHJlY2VkaW5nIHRoZSBsYXR0ZXJcblx0cndoaXRlc3BhY2UgPSBuZXcgUmVnRXhwKCB3aGl0ZXNwYWNlICsgXCIrXCIsIFwiZ1wiICksXG5cdHJ0cmltID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIrfCgoPzpefFteXFxcXFxcXFxdKSg/OlxcXFxcXFxcLikqKVwiICtcblx0XHR3aGl0ZXNwYWNlICsgXCIrJFwiLCBcImdcIiApLFxuXG5cdHJjb21tYSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKixcIiArIHdoaXRlc3BhY2UgKyBcIipcIiApLFxuXHRyY29tYmluYXRvcnMgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiooWz4rfl18XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIipcIiApLFxuXHRyZGVzY2VuZCA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcInw+XCIgKSxcblxuXHRycHNldWRvID0gbmV3IFJlZ0V4cCggcHNldWRvcyApLFxuXHRyaWRlbnRpZmllciA9IG5ldyBSZWdFeHAoIFwiXlwiICsgaWRlbnRpZmllciArIFwiJFwiICksXG5cblx0bWF0Y2hFeHByID0ge1xuXHRcdFwiSURcIjogbmV3IFJlZ0V4cCggXCJeIyhcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiQ0xBU1NcIjogbmV3IFJlZ0V4cCggXCJeXFxcXC4oXCIgKyBpZGVudGlmaWVyICsgXCIpXCIgKSxcblx0XHRcIlRBR1wiOiBuZXcgUmVnRXhwKCBcIl4oXCIgKyBpZGVudGlmaWVyICsgXCJ8WypdKVwiICksXG5cdFx0XCJBVFRSXCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgYXR0cmlidXRlcyApLFxuXHRcdFwiUFNFVURPXCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgcHNldWRvcyApLFxuXHRcdFwiQ0hJTERcIjogbmV3IFJlZ0V4cCggXCJeOihvbmx5fGZpcnN0fGxhc3R8bnRofG50aC1sYXN0KS0oY2hpbGR8b2YtdHlwZSkoPzpcXFxcKFwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooZXZlbnxvZGR8KChbKy1dfCkoXFxcXGQqKW58KVwiICsgd2hpdGVzcGFjZSArIFwiKig/OihbKy1dfClcIiArXG5cdFx0XHR3aGl0ZXNwYWNlICsgXCIqKFxcXFxkKyl8KSlcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpXCIsIFwiaVwiICksXG5cdFx0XCJib29sXCI6IG5ldyBSZWdFeHAoIFwiXig/OlwiICsgYm9vbGVhbnMgKyBcIikkXCIsIFwiaVwiICksXG5cblx0XHQvLyBGb3IgdXNlIGluIGxpYnJhcmllcyBpbXBsZW1lbnRpbmcgLmlzKClcblx0XHQvLyBXZSB1c2UgdGhpcyBmb3IgUE9TIG1hdGNoaW5nIGluIGBzZWxlY3RgXG5cdFx0XCJuZWVkc0NvbnRleHRcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKls+K35dfDooZXZlbnxvZGR8ZXF8Z3R8bHR8bnRofGZpcnN0fGxhc3QpKD86XFxcXChcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqKCg/Oi1cXFxcZCk/XFxcXGQqKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfCkoPz1bXi1dfCQpXCIsIFwiaVwiIClcblx0fSxcblxuXHRyaHRtbCA9IC9IVE1MJC9pLFxuXHRyaW5wdXRzID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaSxcblx0cmhlYWRlciA9IC9eaFxcZCQvaSxcblxuXHRybmF0aXZlID0gL15bXntdK1xce1xccypcXFtuYXRpdmUgXFx3LyxcblxuXHQvLyBFYXNpbHktcGFyc2VhYmxlL3JldHJpZXZhYmxlIElEIG9yIFRBRyBvciBDTEFTUyBzZWxlY3RvcnNcblx0cnF1aWNrRXhwciA9IC9eKD86IyhbXFx3LV0rKXwoXFx3Kyl8XFwuKFtcXHctXSspKSQvLFxuXG5cdHJzaWJsaW5nID0gL1srfl0vLFxuXG5cdC8vIENTUyBlc2NhcGVzXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCNlc2NhcGVkLWNoYXJhY3RlcnNcblx0cnVuZXNjYXBlID0gbmV3IFJlZ0V4cCggXCJcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiICsgd2hpdGVzcGFjZSArIFwiP3xcXFxcXFxcXChbXlxcXFxyXFxcXG5cXFxcZl0pXCIsIFwiZ1wiICksXG5cdGZ1bmVzY2FwZSA9IGZ1bmN0aW9uKCBlc2NhcGUsIG5vbkhleCApIHtcblx0XHR2YXIgaGlnaCA9IFwiMHhcIiArIGVzY2FwZS5zbGljZSggMSApIC0gMHgxMDAwMDtcblxuXHRcdHJldHVybiBub25IZXggP1xuXG5cdFx0XHQvLyBTdHJpcCB0aGUgYmFja3NsYXNoIHByZWZpeCBmcm9tIGEgbm9uLWhleCBlc2NhcGUgc2VxdWVuY2Vcblx0XHRcdG5vbkhleCA6XG5cblx0XHRcdC8vIFJlcGxhY2UgYSBoZXhhZGVjaW1hbCBlc2NhcGUgc2VxdWVuY2Ugd2l0aCB0aGUgZW5jb2RlZCBVbmljb2RlIGNvZGUgcG9pbnRcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDw9MTErXG5cdFx0XHQvLyBGb3IgdmFsdWVzIG91dHNpZGUgdGhlIEJhc2ljIE11bHRpbGluZ3VhbCBQbGFuZSAoQk1QKSwgbWFudWFsbHkgY29uc3RydWN0IGFcblx0XHRcdC8vIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRoaWdoIDwgMCA/XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggKyAweDEwMDAwICkgOlxuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoID4+IDEwIHwgMHhEODAwLCBoaWdoICYgMHgzRkYgfCAweERDMDAgKTtcblx0fSxcblxuXHQvLyBDU1Mgc3RyaW5nL2lkZW50aWZpZXIgc2VyaWFsaXphdGlvblxuXHQvLyBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3Nzb20vI2NvbW1vbi1zZXJpYWxpemluZy1pZGlvbXNcblx0cmNzc2VzY2FwZSA9IC8oW1xcMC1cXHgxZlxceDdmXXxeLT9cXGQpfF4tJHxbXlxcMC1cXHgxZlxceDdmLVxcdUZGRkZcXHctXS9nLFxuXHRmY3NzZXNjYXBlID0gZnVuY3Rpb24oIGNoLCBhc0NvZGVQb2ludCApIHtcblx0XHRpZiAoIGFzQ29kZVBvaW50ICkge1xuXG5cdFx0XHQvLyBVKzAwMDAgTlVMTCBiZWNvbWVzIFUrRkZGRCBSRVBMQUNFTUVOVCBDSEFSQUNURVJcblx0XHRcdGlmICggY2ggPT09IFwiXFwwXCIgKSB7XG5cdFx0XHRcdHJldHVybiBcIlxcdUZGRkRcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29udHJvbCBjaGFyYWN0ZXJzIGFuZCAoZGVwZW5kZW50IHVwb24gcG9zaXRpb24pIG51bWJlcnMgZ2V0IGVzY2FwZWQgYXMgY29kZSBwb2ludHNcblx0XHRcdHJldHVybiBjaC5zbGljZSggMCwgLTEgKSArIFwiXFxcXFwiICtcblx0XHRcdFx0Y2guY2hhckNvZGVBdCggY2gubGVuZ3RoIC0gMSApLnRvU3RyaW5nKCAxNiApICsgXCIgXCI7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXIgcG90ZW50aWFsbHktc3BlY2lhbCBBU0NJSSBjaGFyYWN0ZXJzIGdldCBiYWNrc2xhc2gtZXNjYXBlZFxuXHRcdHJldHVybiBcIlxcXFxcIiArIGNoO1xuXHR9LFxuXG5cdC8vIFVzZWQgZm9yIGlmcmFtZXNcblx0Ly8gU2VlIHNldERvY3VtZW50KClcblx0Ly8gUmVtb3ZpbmcgdGhlIGZ1bmN0aW9uIHdyYXBwZXIgY2F1c2VzIGEgXCJQZXJtaXNzaW9uIERlbmllZFwiXG5cdC8vIGVycm9yIGluIElFXG5cdHVubG9hZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzZXREb2N1bWVudCgpO1xuXHR9LFxuXG5cdGluRGlzYWJsZWRGaWVsZHNldCA9IGFkZENvbWJpbmF0b3IoXG5cdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gdHJ1ZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZmllbGRzZXRcIjtcblx0XHR9LFxuXHRcdHsgZGlyOiBcInBhcmVudE5vZGVcIiwgbmV4dDogXCJsZWdlbmRcIiB9XG5cdCk7XG5cbi8vIE9wdGltaXplIGZvciBwdXNoLmFwcGx5KCBfLCBOb2RlTGlzdCApXG50cnkge1xuXHRwdXNoLmFwcGx5KFxuXHRcdCggYXJyID0gc2xpY2UuY2FsbCggcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMgKSApLFxuXHRcdHByZWZlcnJlZERvYy5jaGlsZE5vZGVzXG5cdCk7XG5cblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjBcblx0Ly8gRGV0ZWN0IHNpbGVudGx5IGZhaWxpbmcgcHVzaC5hcHBseVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdGFyclsgcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMubGVuZ3RoIF0ubm9kZVR5cGU7XG59IGNhdGNoICggZSApIHtcblx0cHVzaCA9IHsgYXBwbHk6IGFyci5sZW5ndGggP1xuXG5cdFx0Ly8gTGV2ZXJhZ2Ugc2xpY2UgaWYgcG9zc2libGVcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHRwdXNoTmF0aXZlLmFwcGx5KCB0YXJnZXQsIHNsaWNlLmNhbGwoIGVscyApICk7XG5cdFx0fSA6XG5cblx0XHQvLyBTdXBwb3J0OiBJRTw5XG5cdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZCBkaXJlY3RseVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHZhciBqID0gdGFyZ2V0Lmxlbmd0aCxcblx0XHRcdFx0aSA9IDA7XG5cblx0XHRcdC8vIENhbid0IHRydXN0IE5vZGVMaXN0Lmxlbmd0aFxuXHRcdFx0d2hpbGUgKCAoIHRhcmdldFsgaisrIF0gPSBlbHNbIGkrKyBdICkgKSB7fVxuXHRcdFx0dGFyZ2V0Lmxlbmd0aCA9IGogLSAxO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gU2l6emxlKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIG0sIGksIGVsZW0sIG5pZCwgbWF0Y2gsIGdyb3VwcywgbmV3U2VsZWN0b3IsXG5cdFx0bmV3Q29udGV4dCA9IGNvbnRleHQgJiYgY29udGV4dC5vd25lckRvY3VtZW50LFxuXG5cdFx0Ly8gbm9kZVR5cGUgZGVmYXVsdHMgdG8gOSwgc2luY2UgY29udGV4dCBkZWZhdWx0cyB0byBkb2N1bWVudFxuXHRcdG5vZGVUeXBlID0gY29udGV4dCA/IGNvbnRleHQubm9kZVR5cGUgOiA5O1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFJldHVybiBlYXJseSBmcm9tIGNhbGxzIHdpdGggaW52YWxpZCBzZWxlY3RvciBvciBjb250ZXh0XG5cdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiIHx8ICFzZWxlY3RvciB8fFxuXHRcdG5vZGVUeXBlICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICYmIG5vZGVUeXBlICE9PSAxMSApIHtcblxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0Ly8gVHJ5IHRvIHNob3J0Y3V0IGZpbmQgb3BlcmF0aW9ucyAoYXMgb3Bwb3NlZCB0byBmaWx0ZXJzKSBpbiBIVE1MIGRvY3VtZW50c1xuXHRpZiAoICFzZWVkICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdFx0Y29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0XHRpZiAoIGRvY3VtZW50SXNIVE1MICkge1xuXG5cdFx0XHQvLyBJZiB0aGUgc2VsZWN0b3IgaXMgc3VmZmljaWVudGx5IHNpbXBsZSwgdHJ5IHVzaW5nIGEgXCJnZXQqQnkqXCIgRE9NIG1ldGhvZFxuXHRcdFx0Ly8gKGV4Y2VwdGluZyBEb2N1bWVudEZyYWdtZW50IGNvbnRleHQsIHdoZXJlIHRoZSBtZXRob2RzIGRvbid0IGV4aXN0KVxuXHRcdFx0aWYgKCBub2RlVHlwZSAhPT0gMTEgJiYgKCBtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKSApICkge1xuXG5cdFx0XHRcdC8vIElEIHNlbGVjdG9yXG5cdFx0XHRcdGlmICggKCBtID0gbWF0Y2hbIDEgXSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRG9jdW1lbnQgY29udGV4dFxuXHRcdFx0XHRcdGlmICggbm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFLCBPcGVyYSwgV2Via2l0XG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHRcdC8vIGdldEVsZW1lbnRCeUlkIGNhbiBtYXRjaCBlbGVtZW50cyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdFx0aWYgKCBlbGVtLmlkID09PSBtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEVsZW1lbnQgY29udGV4dFxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFLCBPcGVyYSwgV2Via2l0XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBpZGVudGlmeSB2ZXJzaW9uc1xuXHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0aWYgKCBuZXdDb250ZXh0ICYmICggZWxlbSA9IG5ld0NvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSApICYmXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICkgJiZcblx0XHRcdFx0XHRcdFx0ZWxlbS5pZCA9PT0gbSApIHtcblxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFR5cGUgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbIDIgXSApIHtcblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBzZWxlY3RvciApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cblx0XHRcdFx0Ly8gQ2xhc3Mgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggKCBtID0gbWF0Y2hbIDMgXSApICYmIHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJlxuXHRcdFx0XHRcdGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbSApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVGFrZSBhZHZhbnRhZ2Ugb2YgcXVlcnlTZWxlY3RvckFsbFxuXHRcdFx0aWYgKCBzdXBwb3J0LnFzYSAmJlxuXHRcdFx0XHQhbm9ubmF0aXZlU2VsZWN0b3JDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdICYmXG5cdFx0XHRcdCggIXJidWdneVFTQSB8fCAhcmJ1Z2d5UVNBLnRlc3QoIHNlbGVjdG9yICkgKSAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDggb25seVxuXHRcdFx0XHQvLyBFeGNsdWRlIG9iamVjdCBlbGVtZW50c1xuXHRcdFx0XHQoIG5vZGVUeXBlICE9PSAxIHx8IGNvbnRleHQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJvYmplY3RcIiApICkge1xuXG5cdFx0XHRcdG5ld1NlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdG5ld0NvbnRleHQgPSBjb250ZXh0O1xuXG5cdFx0XHRcdC8vIHFTQSBjb25zaWRlcnMgZWxlbWVudHMgb3V0c2lkZSBhIHNjb3Bpbmcgcm9vdCB3aGVuIGV2YWx1YXRpbmcgY2hpbGQgb3Jcblx0XHRcdFx0Ly8gZGVzY2VuZGFudCBjb21iaW5hdG9ycywgd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudC5cblx0XHRcdFx0Ly8gSW4gc3VjaCBjYXNlcywgd2Ugd29yayBhcm91bmQgdGhlIGJlaGF2aW9yIGJ5IHByZWZpeGluZyBldmVyeSBzZWxlY3RvciBpbiB0aGVcblx0XHRcdFx0Ly8gbGlzdCB3aXRoIGFuIElEIHNlbGVjdG9yIHJlZmVyZW5jaW5nIHRoZSBzY29wZSBjb250ZXh0LlxuXHRcdFx0XHQvLyBUaGUgdGVjaG5pcXVlIGhhcyB0byBiZSB1c2VkIGFzIHdlbGwgd2hlbiBhIGxlYWRpbmcgY29tYmluYXRvciBpcyB1c2VkXG5cdFx0XHRcdC8vIGFzIHN1Y2ggc2VsZWN0b3JzIGFyZSBub3QgcmVjb2duaXplZCBieSBxdWVyeVNlbGVjdG9yQWxsLlxuXHRcdFx0XHQvLyBUaGFua3MgdG8gQW5kcmV3IER1cG9udCBmb3IgdGhpcyB0ZWNobmlxdWUuXG5cdFx0XHRcdGlmICggbm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdFx0XHQoIHJkZXNjZW5kLnRlc3QoIHNlbGVjdG9yICkgfHwgcmNvbWJpbmF0b3JzLnRlc3QoIHNlbGVjdG9yICkgKSApIHtcblxuXHRcdFx0XHRcdC8vIEV4cGFuZCBjb250ZXh0IGZvciBzaWJsaW5nIHNlbGVjdG9yc1xuXHRcdFx0XHRcdG5ld0NvbnRleHQgPSByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fFxuXHRcdFx0XHRcdFx0Y29udGV4dDtcblxuXHRcdFx0XHRcdC8vIFdlIGNhbiB1c2UgOnNjb3BlIGluc3RlYWQgb2YgdGhlIElEIGhhY2sgaWYgdGhlIGJyb3dzZXJcblx0XHRcdFx0XHQvLyBzdXBwb3J0cyBpdCAmIGlmIHdlJ3JlIG5vdCBjaGFuZ2luZyB0aGUgY29udGV4dC5cblx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgIT09IGNvbnRleHQgfHwgIXN1cHBvcnQuc2NvcGUgKSB7XG5cblx0XHRcdFx0XHRcdC8vIENhcHR1cmUgdGhlIGNvbnRleHQgSUQsIHNldHRpbmcgaXQgZmlyc3QgaWYgbmVjZXNzYXJ5XG5cdFx0XHRcdFx0XHRpZiAoICggbmlkID0gY29udGV4dC5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApICkgKSB7XG5cdFx0XHRcdFx0XHRcdG5pZCA9IG5pZC5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb250ZXh0LnNldEF0dHJpYnV0ZSggXCJpZFwiLCAoIG5pZCA9IGV4cGFuZG8gKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFByZWZpeCBldmVyeSBzZWxlY3RvciBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGdyb3VwcyA9IHRva2VuaXplKCBzZWxlY3RvciApO1xuXHRcdFx0XHRcdGkgPSBncm91cHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0Z3JvdXBzWyBpIF0gPSAoIG5pZCA/IFwiI1wiICsgbmlkIDogXCI6c2NvcGVcIiApICsgXCIgXCIgK1xuXHRcdFx0XHRcdFx0XHR0b1NlbGVjdG9yKCBncm91cHNbIGkgXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXdTZWxlY3RvciA9IGdyb3Vwcy5qb2luKCBcIixcIiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLFxuXHRcdFx0XHRcdFx0bmV3Q29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBuZXdTZWxlY3RvciApXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0fSBjYXRjaCAoIHFzYUVycm9yICkge1xuXHRcdFx0XHRcdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUoIHNlbGVjdG9yLCB0cnVlICk7XG5cdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0aWYgKCBuaWQgPT09IGV4cGFuZG8gKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWxsIG90aGVyc1xuXHRyZXR1cm4gc2VsZWN0KCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUga2V5LXZhbHVlIGNhY2hlcyBvZiBsaW1pdGVkIHNpemVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl9IFJldHVybnMgdGhlIE9iamVjdCBkYXRhIGFmdGVyIHN0b3JpbmcgaXQgb24gaXRzZWxmIHdpdGhcbiAqXHRwcm9wZXJ0eSBuYW1lIHRoZSAoc3BhY2Utc3VmZml4ZWQpIHN0cmluZyBhbmQgKGlmIHRoZSBjYWNoZSBpcyBsYXJnZXIgdGhhbiBFeHByLmNhY2hlTGVuZ3RoKVxuICpcdGRlbGV0aW5nIHRoZSBvbGRlc3QgZW50cnlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUoKSB7XG5cdHZhciBrZXlzID0gW107XG5cblx0ZnVuY3Rpb24gY2FjaGUoIGtleSwgdmFsdWUgKSB7XG5cblx0XHQvLyBVc2UgKGtleSArIFwiIFwiKSB0byBhdm9pZCBjb2xsaXNpb24gd2l0aCBuYXRpdmUgcHJvdG90eXBlIHByb3BlcnRpZXMgKHNlZSBJc3N1ZSAjMTU3KVxuXHRcdGlmICgga2V5cy5wdXNoKCBrZXkgKyBcIiBcIiApID4gRXhwci5jYWNoZUxlbmd0aCApIHtcblxuXHRcdFx0Ly8gT25seSBrZWVwIHRoZSBtb3N0IHJlY2VudCBlbnRyaWVzXG5cdFx0XHRkZWxldGUgY2FjaGVbIGtleXMuc2hpZnQoKSBdO1xuXHRcdH1cblx0XHRyZXR1cm4gKCBjYWNoZVsga2V5ICsgXCIgXCIgXSA9IHZhbHVlICk7XG5cdH1cblx0cmV0dXJuIGNhY2hlO1xufVxuXG4vKipcbiAqIE1hcmsgYSBmdW5jdGlvbiBmb3Igc3BlY2lhbCB1c2UgYnkgU2l6emxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWFya1xuICovXG5mdW5jdGlvbiBtYXJrRnVuY3Rpb24oIGZuICkge1xuXHRmblsgZXhwYW5kbyBdID0gdHJ1ZTtcblx0cmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgdGVzdGluZyB1c2luZyBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBQYXNzZWQgdGhlIGNyZWF0ZWQgZWxlbWVudCBhbmQgcmV0dXJucyBhIGJvb2xlYW4gcmVzdWx0XG4gKi9cbmZ1bmN0aW9uIGFzc2VydCggZm4gKSB7XG5cdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZmllbGRzZXRcIiApO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuICEhZm4oIGVsICk7XG5cdH0gY2F0Y2ggKCBlICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSBmaW5hbGx5IHtcblxuXHRcdC8vIFJlbW92ZSBmcm9tIGl0cyBwYXJlbnQgYnkgZGVmYXVsdFxuXHRcdGlmICggZWwucGFyZW50Tm9kZSApIHtcblx0XHRcdGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGVsICk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRlbCA9IG51bGw7XG5cdH1cbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBzYW1lIGhhbmRsZXIgZm9yIGFsbCBvZiB0aGUgc3BlY2lmaWVkIGF0dHJzXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0cnMgUGlwZS1zZXBhcmF0ZWQgbGlzdCBvZiBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBtZXRob2QgdGhhdCB3aWxsIGJlIGFwcGxpZWRcbiAqL1xuZnVuY3Rpb24gYWRkSGFuZGxlKCBhdHRycywgaGFuZGxlciApIHtcblx0dmFyIGFyciA9IGF0dHJzLnNwbGl0KCBcInxcIiApLFxuXHRcdGkgPSBhcnIubGVuZ3RoO1xuXG5cdHdoaWxlICggaS0tICkge1xuXHRcdEV4cHIuYXR0ckhhbmRsZVsgYXJyWyBpIF0gXSA9IGhhbmRsZXI7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgZG9jdW1lbnQgb3JkZXIgb2YgdHdvIHNpYmxpbmdzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYlxuICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyBsZXNzIHRoYW4gMCBpZiBhIHByZWNlZGVzIGIsIGdyZWF0ZXIgdGhhbiAwIGlmIGEgZm9sbG93cyBiXG4gKi9cbmZ1bmN0aW9uIHNpYmxpbmdDaGVjayggYSwgYiApIHtcblx0dmFyIGN1ciA9IGIgJiYgYSxcblx0XHRkaWZmID0gY3VyICYmIGEubm9kZVR5cGUgPT09IDEgJiYgYi5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0YS5zb3VyY2VJbmRleCAtIGIuc291cmNlSW5kZXg7XG5cblx0Ly8gVXNlIElFIHNvdXJjZUluZGV4IGlmIGF2YWlsYWJsZSBvbiBib3RoIG5vZGVzXG5cdGlmICggZGlmZiApIHtcblx0XHRyZXR1cm4gZGlmZjtcblx0fVxuXG5cdC8vIENoZWNrIGlmIGIgZm9sbG93cyBhXG5cdGlmICggY3VyICkge1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIubmV4dFNpYmxpbmcgKSApIHtcblx0XHRcdGlmICggY3VyID09PSBiICkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGEgPyAxIDogLTE7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBpbnB1dCB0eXBlc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5wdXRQc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gdHlwZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGJ1dHRvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvblBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiAoIG5hbWUgPT09IFwiaW5wdXRcIiB8fCBuYW1lID09PSBcImJ1dHRvblwiICkgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgOmVuYWJsZWQvOmRpc2FibGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRpc2FibGVkIHRydWUgZm9yIDpkaXNhYmxlZDsgZmFsc2UgZm9yIDplbmFibGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURpc2FibGVkUHNldWRvKCBkaXNhYmxlZCApIHtcblxuXHQvLyBLbm93biA6ZGlzYWJsZWQgZmFsc2UgcG9zaXRpdmVzOiBmaWVsZHNldFtkaXNhYmxlZF0gPiBsZWdlbmQ6bnRoLW9mLXR5cGUobisyKSA6Y2FuLWRpc2FibGVcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0Ly8gT25seSBjZXJ0YWluIGVsZW1lbnRzIGNhbiBtYXRjaCA6ZW5hYmxlZCBvciA6ZGlzYWJsZWRcblx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zY3JpcHRpbmcuaHRtbCNzZWxlY3Rvci1lbmFibGVkXG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2NyaXB0aW5nLmh0bWwjc2VsZWN0b3ItZGlzYWJsZWRcblx0XHRpZiAoIFwiZm9ybVwiIGluIGVsZW0gKSB7XG5cblx0XHRcdC8vIENoZWNrIGZvciBpbmhlcml0ZWQgZGlzYWJsZWRuZXNzIG9uIHJlbGV2YW50IG5vbi1kaXNhYmxlZCBlbGVtZW50czpcblx0XHRcdC8vICogbGlzdGVkIGZvcm0tYXNzb2NpYXRlZCBlbGVtZW50cyBpbiBhIGRpc2FibGVkIGZpZWxkc2V0XG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGlzdGVkXG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY29uY2VwdC1mZS1kaXNhYmxlZFxuXHRcdFx0Ly8gKiBvcHRpb24gZWxlbWVudHMgaW4gYSBkaXNhYmxlZCBvcHRncm91cFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NvbmNlcHQtb3B0aW9uLWRpc2FibGVkXG5cdFx0XHQvLyBBbGwgc3VjaCBlbGVtZW50cyBoYXZlIGEgXCJmb3JtXCIgcHJvcGVydHkuXG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSAmJiBlbGVtLmRpc2FibGVkID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHQvLyBPcHRpb24gZWxlbWVudHMgZGVmZXIgdG8gYSBwYXJlbnQgb3B0Z3JvdXAgaWYgcHJlc2VudFxuXHRcdFx0XHRpZiAoIFwibGFiZWxcIiBpbiBlbGVtICkge1xuXHRcdFx0XHRcdGlmICggXCJsYWJlbFwiIGluIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLnBhcmVudE5vZGUuZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgNiAtIDExXG5cdFx0XHRcdC8vIFVzZSB0aGUgaXNEaXNhYmxlZCBzaG9ydGN1dCBwcm9wZXJ0eSB0byBjaGVjayBmb3IgZGlzYWJsZWQgZmllbGRzZXQgYW5jZXN0b3JzXG5cdFx0XHRcdHJldHVybiBlbGVtLmlzRGlzYWJsZWQgPT09IGRpc2FibGVkIHx8XG5cblx0XHRcdFx0XHQvLyBXaGVyZSB0aGVyZSBpcyBubyBpc0Rpc2FibGVkLCBjaGVjayBtYW51YWxseVxuXHRcdFx0XHRcdC8qIGpzaGludCAtVzAxOCAqL1xuXHRcdFx0XHRcdGVsZW0uaXNEaXNhYmxlZCAhPT0gIWRpc2FibGVkICYmXG5cdFx0XHRcdFx0aW5EaXNhYmxlZEZpZWxkc2V0KCBlbGVtICkgPT09IGRpc2FibGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cblx0XHQvLyBUcnkgdG8gd2lubm93IG91dCBlbGVtZW50cyB0aGF0IGNhbid0IGJlIGRpc2FibGVkIGJlZm9yZSB0cnVzdGluZyB0aGUgZGlzYWJsZWQgcHJvcGVydHkuXG5cdFx0Ly8gU29tZSB2aWN0aW1zIGdldCBjYXVnaHQgaW4gb3VyIG5ldCAobGFiZWwsIGxlZ2VuZCwgbWVudSwgdHJhY2spLCBidXQgaXQgc2hvdWxkbid0XG5cdFx0Ly8gZXZlbiBleGlzdCBvbiB0aGVtLCBsZXQgYWxvbmUgaGF2ZSBhIGJvb2xlYW4gdmFsdWUuXG5cdFx0fSBlbHNlIGlmICggXCJsYWJlbFwiIGluIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtYWluaW5nIGVsZW1lbnRzIGFyZSBuZWl0aGVyIDplbmFibGVkIG5vciA6ZGlzYWJsZWRcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBwb3NpdGlvbmFsc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZm4gKSB7XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBhcmd1bWVudCApIHtcblx0XHRhcmd1bWVudCA9ICthcmd1bWVudDtcblx0XHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcyApIHtcblx0XHRcdHZhciBqLFxuXHRcdFx0XHRtYXRjaEluZGV4ZXMgPSBmbiggW10sIHNlZWQubGVuZ3RoLCBhcmd1bWVudCApLFxuXHRcdFx0XHRpID0gbWF0Y2hJbmRleGVzLmxlbmd0aDtcblxuXHRcdFx0Ly8gTWF0Y2ggZWxlbWVudHMgZm91bmQgYXQgdGhlIHNwZWNpZmllZCBpbmRleGVzXG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCBzZWVkWyAoIGogPSBtYXRjaEluZGV4ZXNbIGkgXSApIF0gKSB7XG5cdFx0XHRcdFx0c2VlZFsgaiBdID0gISggbWF0Y2hlc1sgaiBdID0gc2VlZFsgaiBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgYSBub2RlIGZvciB2YWxpZGl0eSBhcyBhIFNpenpsZSBjb250ZXh0XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0PX0gY29udGV4dFxuICogQHJldHVybnMge0VsZW1lbnR8T2JqZWN0fEJvb2xlYW59IFRoZSBpbnB1dCBub2RlIGlmIGFjY2VwdGFibGUsIG90aGVyd2lzZSBhIGZhbHN5IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHRlc3RDb250ZXh0KCBjb250ZXh0ICkge1xuXHRyZXR1cm4gY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb250ZXh0O1xufVxuXG4vLyBFeHBvc2Ugc3VwcG9ydCB2YXJzIGZvciBjb252ZW5pZW5jZVxuc3VwcG9ydCA9IFNpenpsZS5zdXBwb3J0ID0ge307XG5cbi8qKlxuICogRGV0ZWN0cyBYTUwgbm9kZXNcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsZW0gQW4gZWxlbWVudCBvciBhIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZmYgZWxlbSBpcyBhIG5vbi1IVE1MIFhNTCBub2RlXG4gKi9cbmlzWE1MID0gU2l6emxlLmlzWE1MID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHZhciBuYW1lc3BhY2UgPSBlbGVtICYmIGVsZW0ubmFtZXNwYWNlVVJJLFxuXHRcdGRvY0VsZW0gPSBlbGVtICYmICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKS5kb2N1bWVudEVsZW1lbnQ7XG5cblx0Ly8gU3VwcG9ydDogSUUgPD04XG5cdC8vIEFzc3VtZSBIVE1MIHdoZW4gZG9jdW1lbnRFbGVtZW50IGRvZXNuJ3QgeWV0IGV4aXN0LCBzdWNoIGFzIGluc2lkZSBsb2FkaW5nIGlmcmFtZXNcblx0Ly8gaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzQ4MzNcblx0cmV0dXJuICFyaHRtbC50ZXN0KCBuYW1lc3BhY2UgfHwgZG9jRWxlbSAmJiBkb2NFbGVtLm5vZGVOYW1lIHx8IFwiSFRNTFwiICk7XG59O1xuXG4vKipcbiAqIFNldHMgZG9jdW1lbnQtcmVsYXRlZCB2YXJpYWJsZXMgb25jZSBiYXNlZCBvbiB0aGUgY3VycmVudCBkb2N1bWVudFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gW2RvY10gQW4gZWxlbWVudCBvciBkb2N1bWVudCBvYmplY3QgdG8gdXNlIHRvIHNldCB0aGUgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqL1xuc2V0RG9jdW1lbnQgPSBTaXp6bGUuc2V0RG9jdW1lbnQgPSBmdW5jdGlvbiggbm9kZSApIHtcblx0dmFyIGhhc0NvbXBhcmUsIHN1YldpbmRvdyxcblx0XHRkb2MgPSBub2RlID8gbm9kZS5vd25lckRvY3VtZW50IHx8IG5vZGUgOiBwcmVmZXJyZWREb2M7XG5cblx0Ly8gUmV0dXJuIGVhcmx5IGlmIGRvYyBpcyBpbnZhbGlkIG9yIGFscmVhZHkgc2VsZWN0ZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCBkb2MgPT0gZG9jdW1lbnQgfHwgZG9jLm5vZGVUeXBlICE9PSA5IHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRcdHJldHVybiBkb2N1bWVudDtcblx0fVxuXG5cdC8vIFVwZGF0ZSBnbG9iYWwgdmFyaWFibGVzXG5cdGRvY3VtZW50ID0gZG9jO1xuXHRkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHRkb2N1bWVudElzSFRNTCA9ICFpc1hNTCggZG9jdW1lbnQgKTtcblxuXHQvLyBTdXBwb3J0OiBJRSA5IC0gMTErLCBFZGdlIDEyIC0gMTgrXG5cdC8vIEFjY2Vzc2luZyBpZnJhbWUgZG9jdW1lbnRzIGFmdGVyIHVubG9hZCB0aHJvd3MgXCJwZXJtaXNzaW9uIGRlbmllZFwiIGVycm9ycyAoalF1ZXJ5ICMxMzkzNilcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCBwcmVmZXJyZWREb2MgIT0gZG9jdW1lbnQgJiZcblx0XHQoIHN1YldpbmRvdyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3ICkgJiYgc3ViV2luZG93LnRvcCAhPT0gc3ViV2luZG93ICkge1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgMTEsIEVkZ2Vcblx0XHRpZiAoIHN1YldpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0c3ViV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwidW5sb2FkXCIsIHVubG9hZEhhbmRsZXIsIGZhbHNlICk7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA5IC0gMTAgb25seVxuXHRcdH0gZWxzZSBpZiAoIHN1YldpbmRvdy5hdHRhY2hFdmVudCApIHtcblx0XHRcdHN1YldpbmRvdy5hdHRhY2hFdmVudCggXCJvbnVubG9hZFwiLCB1bmxvYWRIYW5kbGVyICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3VwcG9ydDogSUUgOCAtIDExKywgRWRnZSAxMiAtIDE4KywgQ2hyb21lIDw9MTYgLSAyNSBvbmx5LCBGaXJlZm94IDw9My42IC0gMzEgb25seSxcblx0Ly8gU2FmYXJpIDQgLSA1IG9ubHksIE9wZXJhIDw9MTEuNiAtIDEyLnggb25seVxuXHQvLyBJRS9FZGdlICYgb2xkZXIgYnJvd3NlcnMgZG9uJ3Qgc3VwcG9ydCB0aGUgOnNjb3BlIHBzZXVkby1jbGFzcy5cblx0Ly8gU3VwcG9ydDogU2FmYXJpIDYuMCBvbmx5XG5cdC8vIFNhZmFyaSA2LjAgc3VwcG9ydHMgOnNjb3BlIGJ1dCBpdCdzIGFuIGFsaWFzIG9mIDpyb290IHRoZXJlLlxuXHRzdXBwb3J0LnNjb3BlID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApICk7XG5cdFx0cmV0dXJuIHR5cGVvZiBlbC5xdWVyeVNlbGVjdG9yQWxsICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHQhZWwucXVlcnlTZWxlY3RvckFsbCggXCI6c2NvcGUgZmllbGRzZXQgZGl2XCIgKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvKiBBdHRyaWJ1dGVzXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBTdXBwb3J0OiBJRTw4XG5cdC8vIFZlcmlmeSB0aGF0IGdldEF0dHJpYnV0ZSByZWFsbHkgcmV0dXJucyBhdHRyaWJ1dGVzIGFuZCBub3QgcHJvcGVydGllc1xuXHQvLyAoZXhjZXB0aW5nIElFOCBib29sZWFucylcblx0c3VwcG9ydC5hdHRyaWJ1dGVzID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZWwuY2xhc3NOYW1lID0gXCJpXCI7XG5cdFx0cmV0dXJuICFlbC5nZXRBdHRyaWJ1dGUoIFwiY2xhc3NOYW1lXCIgKTtcblx0fSApO1xuXG5cdC8qIGdldEVsZW1lbnQocylCeSpcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSByZXR1cm5zIG9ubHkgZWxlbWVudHNcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGVsLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVDb21tZW50KCBcIlwiICkgKTtcblx0XHRyZXR1cm4gIWVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcIipcIiApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDlcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gcm5hdGl2ZS50ZXN0KCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICk7XG5cblx0Ly8gU3VwcG9ydDogSUU8MTBcblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudEJ5SWQgcmV0dXJucyBlbGVtZW50cyBieSBuYW1lXG5cdC8vIFRoZSBicm9rZW4gZ2V0RWxlbWVudEJ5SWQgbWV0aG9kcyBkb24ndCBwaWNrIHVwIHByb2dyYW1tYXRpY2FsbHktc2V0IG5hbWVzLFxuXHQvLyBzbyB1c2UgYSByb3VuZGFib3V0IGdldEVsZW1lbnRzQnlOYW1lIHRlc3Rcblx0c3VwcG9ydC5nZXRCeUlkID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5pZCA9IGV4cGFuZG87XG5cdFx0cmV0dXJuICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSB8fCAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoIGV4cGFuZG8gKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvLyBJRCBmaWx0ZXIgYW5kIGZpbmRcblx0aWYgKCBzdXBwb3J0LmdldEJ5SWQgKSB7XG5cdFx0RXhwci5maWx0ZXJbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggXCJpZFwiICkgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblx0XHRFeHByLmZpbmRbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdFx0dmFyIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXHRcdFx0XHRyZXR1cm4gZWxlbSA/IFsgZWxlbSBdIDogW107XG5cdFx0XHR9XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRFeHByLmZpbHRlclsgXCJJRFwiIF0gPSAgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBub2RlID0gdHlwZW9mIGVsZW0uZ2V0QXR0cmlidXRlTm9kZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdHJldHVybiBub2RlICYmIG5vZGUudmFsdWUgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDYgLSA3IG9ubHlcblx0XHQvLyBnZXRFbGVtZW50QnlJZCBpcyBub3QgcmVsaWFibGUgYXMgYSBmaW5kIHNob3J0Y3V0XG5cdFx0RXhwci5maW5kWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRcdHZhciBub2RlLCBpLCBlbGVtcyxcblx0XHRcdFx0XHRlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblxuXHRcdFx0XHRpZiAoIGVsZW0gKSB7XG5cblx0XHRcdFx0XHQvLyBWZXJpZnkgdGhlIGlkIGF0dHJpYnV0ZVxuXHRcdFx0XHRcdG5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdGlmICggbm9kZSAmJiBub2RlLnZhbHVlID09PSBpZCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBbIGVsZW0gXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGYWxsIGJhY2sgb24gZ2V0RWxlbWVudHNCeU5hbWVcblx0XHRcdFx0XHRlbGVtcyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeU5hbWUoIGlkICk7XG5cdFx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtc1sgaSsrIF0gKSApIHtcblx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdFx0aWYgKCBub2RlICYmIG5vZGUudmFsdWUgPT09IGlkICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gWyBlbGVtIF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBUYWdcblx0RXhwci5maW5kWyBcIlRBR1wiIF0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID9cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBEb2N1bWVudEZyYWdtZW50IG5vZGVzIGRvbid0IGhhdmUgZ0VCVE5cblx0XHRcdH0gZWxzZSBpZiAoIHN1cHBvcnQucXNhICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCB0YWcgKTtcblx0XHRcdH1cblx0XHR9IDpcblxuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0dG1wID0gW10sXG5cdFx0XHRcdGkgPSAwLFxuXG5cdFx0XHRcdC8vIEJ5IGhhcHB5IGNvaW5jaWRlbmNlLCBhIChicm9rZW4pIGdFQlROIGFwcGVhcnMgb24gRG9jdW1lbnRGcmFnbWVudCBub2RlcyB0b29cblx0XHRcdFx0cmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IHBvc3NpYmxlIGNvbW1lbnRzXG5cdFx0XHRpZiAoIHRhZyA9PT0gXCIqXCIgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHR0bXAucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0bXA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9O1xuXG5cdC8vIENsYXNzXG5cdEV4cHIuZmluZFsgXCJDTEFTU1wiIF0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgZnVuY3Rpb24oIGNsYXNzTmFtZSwgY29udGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH07XG5cblx0LyogUVNBL21hdGNoZXNTZWxlY3RvclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gUVNBIGFuZCBtYXRjaGVzU2VsZWN0b3Igc3VwcG9ydFxuXG5cdC8vIG1hdGNoZXNTZWxlY3Rvcig6YWN0aXZlKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoSUU5L09wZXJhIDExLjUpXG5cdHJidWdneU1hdGNoZXMgPSBbXTtcblxuXHQvLyBxU2EoOmZvY3VzKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoQ2hyb21lIDIxKVxuXHQvLyBXZSBhbGxvdyB0aGlzIGJlY2F1c2Ugb2YgYSBidWcgaW4gSUU4LzkgdGhhdCB0aHJvd3MgYW4gZXJyb3Jcblx0Ly8gd2hlbmV2ZXIgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGlzIGFjY2Vzc2VkIG9uIGFuIGlmcmFtZVxuXHQvLyBTbywgd2UgYWxsb3cgOmZvY3VzIHRvIHBhc3MgdGhyb3VnaCBRU0EgYWxsIHRoZSB0aW1lIHRvIGF2b2lkIHRoZSBJRSBlcnJvclxuXHQvLyBTZWUgaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzEzMzc4XG5cdHJidWdneVFTQSA9IFtdO1xuXG5cdGlmICggKCBzdXBwb3J0LnFzYSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCApICkgKSB7XG5cblx0XHQvLyBCdWlsZCBRU0EgcmVnZXhcblx0XHQvLyBSZWdleCBzdHJhdGVneSBhZG9wdGVkIGZyb20gRGllZ28gUGVyaW5pXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHRcdHZhciBpbnB1dDtcblxuXHRcdFx0Ly8gU2VsZWN0IGlzIHNldCB0byBlbXB0eSBzdHJpbmcgb24gcHVycG9zZVxuXHRcdFx0Ly8gVGhpcyBpcyB0byB0ZXN0IElFJ3MgdHJlYXRtZW50IG9mIG5vdCBleHBsaWNpdGx5XG5cdFx0XHQvLyBzZXR0aW5nIGEgYm9vbGVhbiBjb250ZW50IGF0dHJpYnV0ZSxcblx0XHRcdC8vIHNpbmNlIGl0cyBwcmVzZW5jZSBzaG91bGQgYmUgZW5vdWdoXG5cdFx0XHQvLyBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTIzNTlcblx0XHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuaW5uZXJIVE1MID0gXCI8YSBpZD0nXCIgKyBleHBhbmRvICsgXCInPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBpZD0nXCIgKyBleHBhbmRvICsgXCItXFxyXFxcXCcgbXNhbGxvd2NhcHR1cmU9Jyc+XCIgK1xuXHRcdFx0XHRcIjxvcHRpb24gc2VsZWN0ZWQ9Jyc+PC9vcHRpb24+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOCwgT3BlcmEgMTEtMTIuMTZcblx0XHRcdC8vIE5vdGhpbmcgc2hvdWxkIGJlIHNlbGVjdGVkIHdoZW4gZW1wdHkgc3RyaW5ncyBmb2xsb3cgXj0gb3IgJD0gb3IgKj1cblx0XHRcdC8vIFRoZSB0ZXN0IGF0dHJpYnV0ZSBtdXN0IGJlIHVua25vd24gaW4gT3BlcmEgYnV0IFwic2FmZVwiIGZvciBXaW5SVFxuXHRcdFx0Ly8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9oaDQ2NTM4OC5hc3B4I2F0dHJpYnV0ZV9zZWN0aW9uXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW21zYWxsb3djYXB0dXJlXj0nJ11cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiWypeJF09XCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBCb29sZWFuIGF0dHJpYnV0ZXMgYW5kIFwidmFsdWVcIiBhcmUgbm90IHRyZWF0ZWQgY29ycmVjdGx5XG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltzZWxlY3RlZF1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooPzp2YWx1ZXxcIiArIGJvb2xlYW5zICsgXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lPDI5LCBBbmRyb2lkPDQuNCwgU2FmYXJpPDcuMCssIGlPUzw3LjArLCBQaGFudG9tSlM8MS45LjgrXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltpZH49XCIgKyBleHBhbmRvICsgXCItXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJ+PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNSAtIDE4K1xuXHRcdFx0Ly8gSUUgMTEvRWRnZSBkb24ndCBmaW5kIGVsZW1lbnRzIG9uIGEgYFtuYW1lPScnXWAgcXVlcnkgaW4gc29tZSBjYXNlcy5cblx0XHRcdC8vIEFkZGluZyBhIHRlbXBvcmFyeSBhdHRyaWJ1dGUgdG8gdGhlIGRvY3VtZW50IGJlZm9yZSB0aGUgc2VsZWN0aW9uIHdvcmtzXG5cdFx0XHQvLyBhcm91bmQgdGhlIGlzc3VlLlxuXHRcdFx0Ly8gSW50ZXJlc3RpbmdseSwgSUUgMTAgJiBvbGRlciBkb24ndCBzZWVtIHRvIGhhdmUgdGhlIGlzc3VlLlxuXHRcdFx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcblx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiXCIgKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKCBpbnB1dCApO1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbmFtZT0nJ11cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIipuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqPVwiICtcblx0XHRcdFx0XHR3aGl0ZXNwYWNlICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2Via2l0L09wZXJhIC0gOmNoZWNrZWQgc2hvdWxkIHJldHVybiBzZWxlY3RlZCBvcHRpb24gZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCI6Y2hlY2tlZFwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6Y2hlY2tlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA4KywgaU9TIDgrXG5cdFx0XHQvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM2ODUxXG5cdFx0XHQvLyBJbi1wYWdlIGBzZWxlY3RvciNpZCBzaWJsaW5nLWNvbWJpbmF0b3Igc2VsZWN0b3JgIGZhaWxzXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcImEjXCIgKyBleHBhbmRvICsgXCIrKlwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCIuIy4rWyt+XVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3ggPD0zLjYgLSA1IG9ubHlcblx0XHRcdC8vIE9sZCBGaXJlZm94IGRvZXNuJ3QgdGhyb3cgb24gYSBiYWRseS1lc2NhcGVkIGlkZW50aWZpZXIuXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIlxcXFxcXGZcIiApO1xuXHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiW1xcXFxyXFxcXG5cXFxcZl1cIiApO1xuXHRcdH0gKTtcblxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0ZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPScnIGRpc2FibGVkPSdkaXNhYmxlZCc+PC9hPlwiICtcblx0XHRcdFx0XCI8c2VsZWN0IGRpc2FibGVkPSdkaXNhYmxlZCc+PG9wdGlvbi8+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFdpbmRvd3MgOCBOYXRpdmUgQXBwc1xuXHRcdFx0Ly8gVGhlIHR5cGUgYW5kIG5hbWUgYXR0cmlidXRlcyBhcmUgcmVzdHJpY3RlZCBkdXJpbmcgLmlubmVySFRNTCBhc3NpZ25tZW50XG5cdFx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcblx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggXCJ0eXBlXCIsIFwiaGlkZGVuXCIgKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKCBpbnB1dCApLnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiRFwiICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gRW5mb3JjZSBjYXNlLXNlbnNpdGl2aXR5IG9mIG5hbWUgYXR0cmlidXRlXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW25hbWU9ZF1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwibmFtZVwiICsgd2hpdGVzcGFjZSArIFwiKlsqXiR8IX5dPz1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGRiAzLjUgLSA6ZW5hYmxlZC86ZGlzYWJsZWQgYW5kIGhpZGRlbiBlbGVtZW50cyAoaGlkZGVuIGVsZW1lbnRzIGFyZSBzdGlsbCBlbmFibGVkKVxuXHRcdFx0Ly8gSUU4IHRocm93cyBlcnJvciBoZXJlIGFuZCB3aWxsIG5vdCBzZWUgbGF0ZXIgdGVzdHNcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCI6ZW5hYmxlZFwiICkubGVuZ3RoICE9PSAyICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6ZW5hYmxlZFwiLCBcIjpkaXNhYmxlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0XHRcdC8vIElFJ3MgOmRpc2FibGVkIHNlbGVjdG9yIGRvZXMgbm90IHBpY2sgdXAgdGhlIGNoaWxkcmVuIG9mIGRpc2FibGVkIGZpZWxkc2V0c1xuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmRpc2FibGVkXCIgKS5sZW5ndGggIT09IDIgKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogT3BlcmEgMTAgLSAxMSBvbmx5XG5cdFx0XHQvLyBPcGVyYSAxMC0xMSBkb2VzIG5vdCB0aHJvdyBvbiBwb3N0LWNvbW1hIGludmFsaWQgcHNldWRvc1xuXHRcdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggXCIqLDp4XCIgKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKCBcIiwuKjpcIiApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGlmICggKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciA9IHJuYXRpdmUudGVzdCggKCBtYXRjaGVzID0gZG9jRWxlbS5tYXRjaGVzIHx8XG5cdFx0ZG9jRWxlbS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ub01hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ubXNNYXRjaGVzU2VsZWN0b3IgKSApICkgKSB7XG5cblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZG8gbWF0Y2hlc1NlbGVjdG9yXG5cdFx0XHQvLyBvbiBhIGRpc2Nvbm5lY3RlZCBub2RlIChJRSA5KVxuXHRcdFx0c3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCA9IG1hdGNoZXMuY2FsbCggZWwsIFwiKlwiICk7XG5cblx0XHRcdC8vIFRoaXMgc2hvdWxkIGZhaWwgd2l0aCBhbiBleGNlcHRpb25cblx0XHRcdC8vIEdlY2tvIGRvZXMgbm90IGVycm9yLCByZXR1cm5zIGZhbHNlIGluc3RlYWRcblx0XHRcdG1hdGNoZXMuY2FsbCggZWwsIFwiW3MhPScnXTp4XCIgKTtcblx0XHRcdHJidWdneU1hdGNoZXMucHVzaCggXCIhPVwiLCBwc2V1ZG9zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0cmJ1Z2d5UVNBID0gcmJ1Z2d5UVNBLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lRU0Euam9pbiggXCJ8XCIgKSApO1xuXHRyYnVnZ3lNYXRjaGVzID0gcmJ1Z2d5TWF0Y2hlcy5sZW5ndGggJiYgbmV3IFJlZ0V4cCggcmJ1Z2d5TWF0Y2hlcy5qb2luKCBcInxcIiApICk7XG5cblx0LyogQ29udGFpbnNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRoYXNDb21wYXJlID0gcm5hdGl2ZS50ZXN0KCBkb2NFbGVtLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICk7XG5cblx0Ly8gRWxlbWVudCBjb250YWlucyBhbm90aGVyXG5cdC8vIFB1cnBvc2VmdWxseSBzZWxmLWV4Y2x1c2l2ZVxuXHQvLyBBcyBpbiwgYW4gZWxlbWVudCBkb2VzIG5vdCBjb250YWluIGl0c2VsZlxuXHRjb250YWlucyA9IGhhc0NvbXBhcmUgfHwgcm5hdGl2ZS50ZXN0KCBkb2NFbGVtLmNvbnRhaW5zICkgP1xuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGFkb3duID0gYS5ub2RlVHlwZSA9PT0gOSA/IGEuZG9jdW1lbnRFbGVtZW50IDogYSxcblx0XHRcdFx0YnVwID0gYiAmJiBiLnBhcmVudE5vZGU7XG5cdFx0XHRyZXR1cm4gYSA9PT0gYnVwIHx8ICEhKCBidXAgJiYgYnVwLm5vZGVUeXBlID09PSAxICYmIChcblx0XHRcdFx0YWRvd24uY29udGFpbnMgP1xuXHRcdFx0XHRcdGFkb3duLmNvbnRhaW5zKCBidXAgKSA6XG5cdFx0XHRcdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBidXAgKSAmIDE2XG5cdFx0XHQpICk7XG5cdFx0fSA6XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGIgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBiID0gYi5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBiID09PSBhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHQvKiBTb3J0aW5nXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBEb2N1bWVudCBvcmRlciBzb3J0aW5nXG5cdHNvcnRPcmRlciA9IGhhc0NvbXBhcmUgP1xuXHRmdW5jdGlvbiggYSwgYiApIHtcblxuXHRcdC8vIEZsYWcgZm9yIGR1cGxpY2F0ZSByZW1vdmFsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdC8vIFNvcnQgb24gbWV0aG9kIGV4aXN0ZW5jZSBpZiBvbmx5IG9uZSBpbnB1dCBoYXMgY29tcGFyZURvY3VtZW50UG9zaXRpb25cblx0XHR2YXIgY29tcGFyZSA9ICFhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIC0gIWIuY29tcGFyZURvY3VtZW50UG9zaXRpb247XG5cdFx0aWYgKCBjb21wYXJlICkge1xuXHRcdFx0cmV0dXJuIGNvbXBhcmU7XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsY3VsYXRlIHBvc2l0aW9uIGlmIGJvdGggaW5wdXRzIGJlbG9uZyB0byB0aGUgc2FtZSBkb2N1bWVudFxuXHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0Y29tcGFyZSA9ICggYS5vd25lckRvY3VtZW50IHx8IGEgKSA9PSAoIGIub3duZXJEb2N1bWVudCB8fCBiICkgP1xuXHRcdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYiApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIHdlIGtub3cgdGhleSBhcmUgZGlzY29ubmVjdGVkXG5cdFx0XHQxO1xuXG5cdFx0Ly8gRGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0aWYgKCBjb21wYXJlICYgMSB8fFxuXHRcdFx0KCAhc3VwcG9ydC5zb3J0RGV0YWNoZWQgJiYgYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYSApID09PSBjb21wYXJlICkgKSB7XG5cblx0XHRcdC8vIENob29zZSB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIHJlbGF0ZWQgdG8gb3VyIHByZWZlcnJlZCBkb2N1bWVudFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdGlmICggYSA9PSBkb2N1bWVudCB8fCBhLm93bmVyRG9jdW1lbnQgPT0gcHJlZmVycmVkRG9jICYmXG5cdFx0XHRcdGNvbnRhaW5zKCBwcmVmZXJyZWREb2MsIGEgKSApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0aWYgKCBiID09IGRvY3VtZW50IHx8IGIub3duZXJEb2N1bWVudCA9PSBwcmVmZXJyZWREb2MgJiZcblx0XHRcdFx0Y29udGFpbnMoIHByZWZlcnJlZERvYywgYiApICkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFpbnRhaW4gb3JpZ2luYWwgb3JkZXJcblx0XHRcdHJldHVybiBzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBhcmUgJiA0ID8gLTEgOiAxO1xuXHR9IDpcblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBFeGl0IGVhcmx5IGlmIHRoZSBub2RlcyBhcmUgaWRlbnRpY2FsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdHZhciBjdXIsXG5cdFx0XHRpID0gMCxcblx0XHRcdGF1cCA9IGEucGFyZW50Tm9kZSxcblx0XHRcdGJ1cCA9IGIucGFyZW50Tm9kZSxcblx0XHRcdGFwID0gWyBhIF0sXG5cdFx0XHRicCA9IFsgYiBdO1xuXG5cdFx0Ly8gUGFyZW50bGVzcyBub2RlcyBhcmUgZWl0aGVyIGRvY3VtZW50cyBvciBkaXNjb25uZWN0ZWRcblx0XHRpZiAoICFhdXAgfHwgIWJ1cCApIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuXHRcdFx0cmV0dXJuIGEgPT0gZG9jdW1lbnQgPyAtMSA6XG5cdFx0XHRcdGIgPT0gZG9jdW1lbnQgPyAxIDpcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cblx0XHRcdFx0YXVwID8gLTEgOlxuXHRcdFx0XHRidXAgPyAxIDpcblx0XHRcdFx0c29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXG5cdFx0Ly8gSWYgdGhlIG5vZGVzIGFyZSBzaWJsaW5ncywgd2UgY2FuIGRvIGEgcXVpY2sgY2hlY2tcblx0XHR9IGVsc2UgaWYgKCBhdXAgPT09IGJ1cCApIHtcblx0XHRcdHJldHVybiBzaWJsaW5nQ2hlY2soIGEsIGIgKTtcblx0XHR9XG5cblx0XHQvLyBPdGhlcndpc2Ugd2UgbmVlZCBmdWxsIGxpc3RzIG9mIHRoZWlyIGFuY2VzdG9ycyBmb3IgY29tcGFyaXNvblxuXHRcdGN1ciA9IGE7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRhcC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cdFx0Y3VyID0gYjtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdGJwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblxuXHRcdC8vIFdhbGsgZG93biB0aGUgdHJlZSBsb29raW5nIGZvciBhIGRpc2NyZXBhbmN5XG5cdFx0d2hpbGUgKCBhcFsgaSBdID09PSBicFsgaSBdICkge1xuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiBpID9cblxuXHRcdFx0Ly8gRG8gYSBzaWJsaW5nIGNoZWNrIGlmIHRoZSBub2RlcyBoYXZlIGEgY29tbW9uIGFuY2VzdG9yXG5cdFx0XHRzaWJsaW5nQ2hlY2soIGFwWyBpIF0sIGJwWyBpIF0gKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSBub2RlcyBpbiBvdXIgZG9jdW1lbnQgc29ydCBmaXJzdFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuXHRcdFx0YXBbIGkgXSA9PSBwcmVmZXJyZWREb2MgPyAtMSA6XG5cdFx0XHRicFsgaSBdID09IHByZWZlcnJlZERvYyA/IDEgOlxuXHRcdFx0LyogZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cblx0XHRcdDA7XG5cdH07XG5cblx0cmV0dXJuIGRvY3VtZW50O1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdHNldERvY3VtZW50KCBlbGVtICk7XG5cblx0aWYgKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdCFub25uYXRpdmVTZWxlY3RvckNhY2hlWyBleHByICsgXCIgXCIgXSAmJlxuXHRcdCggIXJidWdneU1hdGNoZXMgfHwgIXJidWdneU1hdGNoZXMudGVzdCggZXhwciApICkgJiZcblx0XHQoICFyYnVnZ3lRU0EgICAgIHx8ICFyYnVnZ3lRU0EudGVzdCggZXhwciApICkgKSB7XG5cblx0XHR0cnkge1xuXHRcdFx0dmFyIHJldCA9IG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXG5cdFx0XHQvLyBJRSA5J3MgbWF0Y2hlc1NlbGVjdG9yIHJldHVybnMgZmFsc2Ugb24gZGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0XHRpZiAoIHJldCB8fCBzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cblx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0Ly8gZnJhZ21lbnQgaW4gSUUgOVxuXHRcdFx0XHRlbGVtLmRvY3VtZW50ICYmIGVsZW0uZG9jdW1lbnQubm9kZVR5cGUgIT09IDExICkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSggZXhwciwgdHJ1ZSApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIGRvY3VtZW50LCBudWxsLCBbIGVsZW0gXSApLmxlbmd0aCA+IDA7XG59O1xuXG5TaXp6bGUuY29udGFpbnMgPSBmdW5jdGlvbiggY29udGV4dCwgZWxlbSApIHtcblxuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCAoIGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0ICkgIT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0fVxuXHRyZXR1cm4gY29udGFpbnMoIGNvbnRleHQsIGVsZW0gKTtcbn07XG5cblNpenpsZS5hdHRyID0gZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cblx0Ly8gU2V0IGRvY3VtZW50IHZhcnMgaWYgbmVlZGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggKCBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSApICE9IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdH1cblxuXHR2YXIgZm4gPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUudG9Mb3dlckNhc2UoKSBdLFxuXG5cdFx0Ly8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBPYmplY3QucHJvdG90eXBlIHByb3BlcnRpZXMgKGpRdWVyeSAjMTM4MDcpXG5cdFx0dmFsID0gZm4gJiYgaGFzT3duLmNhbGwoIEV4cHIuYXR0ckhhbmRsZSwgbmFtZS50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0Zm4oIGVsZW0sIG5hbWUsICFkb2N1bWVudElzSFRNTCApIDpcblx0XHRcdHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgP1xuXHRcdHZhbCA6XG5cdFx0c3VwcG9ydC5hdHRyaWJ1dGVzIHx8ICFkb2N1bWVudElzSFRNTCA/XG5cdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSApIDpcblx0XHRcdCggdmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkgKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcbn07XG5cblNpenpsZS5lc2NhcGUgPSBmdW5jdGlvbiggc2VsICkge1xuXHRyZXR1cm4gKCBzZWwgKyBcIlwiICkucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xufTtcblxuU2l6emxlLmVycm9yID0gZnVuY3Rpb24oIG1zZyApIHtcblx0dGhyb3cgbmV3IEVycm9yKCBcIlN5bnRheCBlcnJvciwgdW5yZWNvZ25pemVkIGV4cHJlc3Npb246IFwiICsgbXNnICk7XG59O1xuXG4vKipcbiAqIERvY3VtZW50IHNvcnRpbmcgYW5kIHJlbW92aW5nIGR1cGxpY2F0ZXNcbiAqIEBwYXJhbSB7QXJyYXlMaWtlfSByZXN1bHRzXG4gKi9cblNpenpsZS51bmlxdWVTb3J0ID0gZnVuY3Rpb24oIHJlc3VsdHMgKSB7XG5cdHZhciBlbGVtLFxuXHRcdGR1cGxpY2F0ZXMgPSBbXSxcblx0XHRqID0gMCxcblx0XHRpID0gMDtcblxuXHQvLyBVbmxlc3Mgd2UgKmtub3cqIHdlIGNhbiBkZXRlY3QgZHVwbGljYXRlcywgYXNzdW1lIHRoZWlyIHByZXNlbmNlXG5cdGhhc0R1cGxpY2F0ZSA9ICFzdXBwb3J0LmRldGVjdER1cGxpY2F0ZXM7XG5cdHNvcnRJbnB1dCA9ICFzdXBwb3J0LnNvcnRTdGFibGUgJiYgcmVzdWx0cy5zbGljZSggMCApO1xuXHRyZXN1bHRzLnNvcnQoIHNvcnRPcmRlciApO1xuXG5cdGlmICggaGFzRHVwbGljYXRlICkge1xuXHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENsZWFyIGlucHV0IGFmdGVyIHNvcnRpbmcgdG8gcmVsZWFzZSBvYmplY3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L3NpenpsZS9wdWxsLzIyNVxuXHRzb3J0SW5wdXQgPSBudWxsO1xuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbmdldFRleHQgPSBTaXp6bGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbm9kZSxcblx0XHRyZXQgPSBcIlwiLFxuXHRcdGkgPSAwLFxuXHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRpZiAoICFub2RlVHlwZSApIHtcblxuXHRcdC8vIElmIG5vIG5vZGVUeXBlLCB0aGlzIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGFycmF5XG5cdFx0d2hpbGUgKCAoIG5vZGUgPSBlbGVtWyBpKysgXSApICkge1xuXG5cdFx0XHQvLyBEbyBub3QgdHJhdmVyc2UgY29tbWVudCBub2Rlc1xuXHRcdFx0cmV0ICs9IGdldFRleHQoIG5vZGUgKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAxIHx8IG5vZGVUeXBlID09PSA5IHx8IG5vZGVUeXBlID09PSAxMSApIHtcblxuXHRcdC8vIFVzZSB0ZXh0Q29udGVudCBmb3IgZWxlbWVudHNcblx0XHQvLyBpbm5lclRleHQgdXNhZ2UgcmVtb3ZlZCBmb3IgY29uc2lzdGVuY3kgb2YgbmV3IGxpbmVzIChqUXVlcnkgIzExMTUzKVxuXHRcdGlmICggdHlwZW9mIGVsZW0udGV4dENvbnRlbnQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS50ZXh0Q29udGVudDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBUcmF2ZXJzZSBpdHMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRyZXQgKz0gZ2V0VGV4dCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHR9XG5cblx0Ly8gRG8gbm90IGluY2x1ZGUgY29tbWVudCBvciBwcm9jZXNzaW5nIGluc3RydWN0aW9uIG5vZGVzXG5cblx0cmV0dXJuIHJldDtcbn07XG5cbkV4cHIgPSBTaXp6bGUuc2VsZWN0b3JzID0ge1xuXG5cdC8vIENhbiBiZSBhZGp1c3RlZCBieSB0aGUgdXNlclxuXHRjYWNoZUxlbmd0aDogNTAsXG5cblx0Y3JlYXRlUHNldWRvOiBtYXJrRnVuY3Rpb24sXG5cblx0bWF0Y2g6IG1hdGNoRXhwcixcblxuXHRhdHRySGFuZGxlOiB7fSxcblxuXHRmaW5kOiB7fSxcblxuXHRyZWxhdGl2ZToge1xuXHRcdFwiPlwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCIgXCI6IHsgZGlyOiBcInBhcmVudE5vZGVcIiB9LFxuXHRcdFwiK1wiOiB7IGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIiwgZmlyc3Q6IHRydWUgfSxcblx0XHRcIn5cIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIgfVxuXHR9LFxuXG5cdHByZUZpbHRlcjoge1xuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHRtYXRjaFsgMSBdID0gbWF0Y2hbIDEgXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBnaXZlbiB2YWx1ZSB0byBtYXRjaFszXSB3aGV0aGVyIHF1b3RlZCBvciB1bnF1b3RlZFxuXHRcdFx0bWF0Y2hbIDMgXSA9ICggbWF0Y2hbIDMgXSB8fCBtYXRjaFsgNCBdIHx8XG5cdFx0XHRcdG1hdGNoWyA1IF0gfHwgXCJcIiApLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cblx0XHRcdGlmICggbWF0Y2hbIDIgXSA9PT0gXCJ+PVwiICkge1xuXHRcdFx0XHRtYXRjaFsgMyBdID0gXCIgXCIgKyBtYXRjaFsgMyBdICsgXCIgXCI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaC5zbGljZSggMCwgNCApO1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblxuXHRcdFx0LyogbWF0Y2hlcyBmcm9tIG1hdGNoRXhwcltcIkNISUxEXCJdXG5cdFx0XHRcdDEgdHlwZSAob25seXxudGh8Li4uKVxuXHRcdFx0XHQyIHdoYXQgKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdDMgYXJndW1lbnQgKGV2ZW58b2RkfFxcZCp8XFxkKm4oWystXVxcZCspP3wuLi4pXG5cdFx0XHRcdDQgeG4tY29tcG9uZW50IG9mIHhuK3kgYXJndW1lbnQgKFsrLV0/XFxkKm58KVxuXHRcdFx0XHQ1IHNpZ24gb2YgeG4tY29tcG9uZW50XG5cdFx0XHRcdDYgeCBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NyBzaWduIG9mIHktY29tcG9uZW50XG5cdFx0XHRcdDggeSBvZiB5LWNvbXBvbmVudFxuXHRcdFx0Ki9cblx0XHRcdG1hdGNoWyAxIF0gPSBtYXRjaFsgMSBdLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdGlmICggbWF0Y2hbIDEgXS5zbGljZSggMCwgMyApID09PSBcIm50aFwiICkge1xuXG5cdFx0XHRcdC8vIG50aC0qIHJlcXVpcmVzIGFyZ3VtZW50XG5cdFx0XHRcdGlmICggIW1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFsgMCBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBudW1lcmljIHggYW5kIHkgcGFyYW1ldGVycyBmb3IgRXhwci5maWx0ZXIuQ0hJTERcblx0XHRcdFx0Ly8gcmVtZW1iZXIgdGhhdCBmYWxzZS90cnVlIGNhc3QgcmVzcGVjdGl2ZWx5IHRvIDAvMVxuXHRcdFx0XHRtYXRjaFsgNCBdID0gKyggbWF0Y2hbIDQgXSA/XG5cdFx0XHRcdFx0bWF0Y2hbIDUgXSArICggbWF0Y2hbIDYgXSB8fCAxICkgOlxuXHRcdFx0XHRcdDIgKiAoIG1hdGNoWyAzIF0gPT09IFwiZXZlblwiIHx8IG1hdGNoWyAzIF0gPT09IFwib2RkXCIgKSApO1xuXHRcdFx0XHRtYXRjaFsgNSBdID0gKyggKCBtYXRjaFsgNyBdICsgbWF0Y2hbIDggXSApIHx8IG1hdGNoWyAzIF0gPT09IFwib2RkXCIgKTtcblxuXHRcdFx0XHQvLyBvdGhlciB0eXBlcyBwcm9oaWJpdCBhcmd1bWVudHNcblx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbIDAgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdHZhciBleGNlc3MsXG5cdFx0XHRcdHVucXVvdGVkID0gIW1hdGNoWyA2IF0gJiYgbWF0Y2hbIDIgXTtcblxuXHRcdFx0aWYgKCBtYXRjaEV4cHJbIFwiQ0hJTERcIiBdLnRlc3QoIG1hdGNoWyAwIF0gKSApIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFjY2VwdCBxdW90ZWQgYXJndW1lbnRzIGFzLWlzXG5cdFx0XHRpZiAoIG1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdG1hdGNoWyAyIF0gPSBtYXRjaFsgNCBdIHx8IG1hdGNoWyA1IF0gfHwgXCJcIjtcblxuXHRcdFx0Ly8gU3RyaXAgZXhjZXNzIGNoYXJhY3RlcnMgZnJvbSB1bnF1b3RlZCBhcmd1bWVudHNcblx0XHRcdH0gZWxzZSBpZiAoIHVucXVvdGVkICYmIHJwc2V1ZG8udGVzdCggdW5xdW90ZWQgKSAmJlxuXG5cdFx0XHRcdC8vIEdldCBleGNlc3MgZnJvbSB0b2tlbml6ZSAocmVjdXJzaXZlbHkpXG5cdFx0XHRcdCggZXhjZXNzID0gdG9rZW5pemUoIHVucXVvdGVkLCB0cnVlICkgKSAmJlxuXG5cdFx0XHRcdC8vIGFkdmFuY2UgdG8gdGhlIG5leHQgY2xvc2luZyBwYXJlbnRoZXNpc1xuXHRcdFx0XHQoIGV4Y2VzcyA9IHVucXVvdGVkLmluZGV4T2YoIFwiKVwiLCB1bnF1b3RlZC5sZW5ndGggLSBleGNlc3MgKSAtIHVucXVvdGVkLmxlbmd0aCApICkge1xuXG5cdFx0XHRcdC8vIGV4Y2VzcyBpcyBhIG5lZ2F0aXZlIGluZGV4XG5cdFx0XHRcdG1hdGNoWyAwIF0gPSBtYXRjaFsgMCBdLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdFx0bWF0Y2hbIDIgXSA9IHVucXVvdGVkLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIG9ubHkgY2FwdHVyZXMgbmVlZGVkIGJ5IHRoZSBwc2V1ZG8gZmlsdGVyIG1ldGhvZCAodHlwZSBhbmQgYXJndW1lbnQpXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDMgKTtcblx0XHR9XG5cdH0sXG5cblx0ZmlsdGVyOiB7XG5cblx0XHRcIlRBR1wiOiBmdW5jdGlvbiggbm9kZU5hbWVTZWxlY3RvciApIHtcblx0XHRcdHZhciBub2RlTmFtZSA9IG5vZGVOYW1lU2VsZWN0b3IucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5vZGVOYW1lU2VsZWN0b3IgPT09IFwiKlwiID9cblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lO1xuXHRcdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNMQVNTXCI6IGZ1bmN0aW9uKCBjbGFzc05hbWUgKSB7XG5cdFx0XHR2YXIgcGF0dGVybiA9IGNsYXNzQ2FjaGVbIGNsYXNzTmFtZSArIFwiIFwiIF07XG5cblx0XHRcdHJldHVybiBwYXR0ZXJuIHx8XG5cdFx0XHRcdCggcGF0dGVybiA9IG5ldyBSZWdFeHAoIFwiKF58XCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFx0XHRcIilcIiArIGNsYXNzTmFtZSArIFwiKFwiICsgd2hpdGVzcGFjZSArIFwifCQpXCIgKSApICYmIGNsYXNzQ2FjaGUoXG5cdFx0XHRcdFx0XHRjbGFzc05hbWUsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF0dGVybi50ZXN0KFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtLmNsYXNzTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbGVtLmNsYXNzTmFtZSB8fFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIFwiY2xhc3NcIiApIHx8XG5cdFx0XHRcdFx0XHRcdFx0XCJcIlxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbmFtZSwgb3BlcmF0b3IsIGNoZWNrICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gU2l6emxlLmF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCIhPVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggIW9wZXJhdG9yICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzdWx0ICs9IFwiXCI7XG5cblx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5cdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCI9XCIgPyByZXN1bHQgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIhPVwiID8gcmVzdWx0ICE9PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiXj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID09PSAwIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIqPVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPiAtMSA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiJD1cIiA/IGNoZWNrICYmIHJlc3VsdC5zbGljZSggLWNoZWNrLmxlbmd0aCApID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwifj1cIiA/ICggXCIgXCIgKyByZXN1bHQucmVwbGFjZSggcndoaXRlc3BhY2UsIFwiIFwiICkgKyBcIiBcIiApLmluZGV4T2YoIGNoZWNrICkgPiAtMSA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwifD1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgfHwgcmVzdWx0LnNsaWNlKCAwLCBjaGVjay5sZW5ndGggKyAxICkgPT09IGNoZWNrICsgXCItXCIgOlxuXHRcdFx0XHRcdGZhbHNlO1xuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggdHlwZSwgd2hhdCwgX2FyZ3VtZW50LCBmaXJzdCwgbGFzdCApIHtcblx0XHRcdHZhciBzaW1wbGUgPSB0eXBlLnNsaWNlKCAwLCAzICkgIT09IFwibnRoXCIsXG5cdFx0XHRcdGZvcndhcmQgPSB0eXBlLnNsaWNlKCAtNCApICE9PSBcImxhc3RcIixcblx0XHRcdFx0b2ZUeXBlID0gd2hhdCA9PT0gXCJvZi10eXBlXCI7XG5cblx0XHRcdHJldHVybiBmaXJzdCA9PT0gMSAmJiBsYXN0ID09PSAwID9cblxuXHRcdFx0XHQvLyBTaG9ydGN1dCBmb3IgOm50aC0qKG4pXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiAhIWVsZW0ucGFyZW50Tm9kZTtcblx0XHRcdFx0fSA6XG5cblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGNhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSwgbm9kZSwgbm9kZUluZGV4LCBzdGFydCxcblx0XHRcdFx0XHRcdGRpciA9IHNpbXBsZSAhPT0gZm9yd2FyZCA/IFwibmV4dFNpYmxpbmdcIiA6IFwicHJldmlvdXNTaWJsaW5nXCIsXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0XHRuYW1lID0gb2ZUeXBlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdHVzZUNhY2hlID0gIXhtbCAmJiAhb2ZUeXBlLFxuXHRcdFx0XHRcdFx0ZGlmZiA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cblx0XHRcdFx0XHRcdC8vIDooZmlyc3R8bGFzdHxvbmx5KS0oY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0XHRcdGlmICggc2ltcGxlICkge1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIGRpciApIHtcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9IG5vZGVbIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIG9mVHlwZSA/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSA6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZVR5cGUgPT09IDEgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdC8vIFJldmVyc2UgZGlyZWN0aW9uIGZvciA6b25seS0qIChpZiB3ZSBoYXZlbid0IHlldCBkb25lIHNvKVxuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0ID0gZGlyID0gdHlwZSA9PT0gXCJvbmx5XCIgJiYgIXN0YXJ0ICYmIFwibmV4dFNpYmxpbmdcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c3RhcnQgPSBbIGZvcndhcmQgPyBwYXJlbnQuZmlyc3RDaGlsZCA6IHBhcmVudC5sYXN0Q2hpbGQgXTtcblxuXHRcdFx0XHRcdFx0Ly8gbm9uLXhtbCA6bnRoLWNoaWxkKC4uLikgc3RvcmVzIGNhY2hlIGRhdGEgb24gYHBhcmVudGBcblx0XHRcdFx0XHRcdGlmICggZm9yd2FyZCAmJiB1c2VDYWNoZSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBTZWVrIGBlbGVtYCBmcm9tIGEgcHJldmlvdXNseS1jYWNoZWQgaW5kZXhcblxuXHRcdFx0XHRcdFx0XHQvLyAuLi5pbiBhIGd6aXAtZnJpZW5kbHkgd2F5XG5cdFx0XHRcdFx0XHRcdG5vZGUgPSBwYXJlbnQ7XG5cdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBjYWNoZVsgMSBdO1xuXHRcdFx0XHRcdFx0XHRkaWZmID0gbm9kZUluZGV4ICYmIGNhY2hlWyAyIF07XG5cdFx0XHRcdFx0XHRcdG5vZGUgPSBub2RlSW5kZXggJiYgcGFyZW50LmNoaWxkTm9kZXNbIG5vZGVJbmRleCBdO1xuXG5cdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmFsbGJhY2sgdG8gc2Vla2luZyBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHQoIGRpZmYgPSBub2RlSW5kZXggPSAwICkgfHwgc3RhcnQucG9wKCkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFdoZW4gZm91bmQsIGNhY2hlIGluZGV4ZXMgb24gYHBhcmVudGAgYW5kIGJyZWFrXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICYmICsrZGlmZiAmJiBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgbm9kZUluZGV4LCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBVc2UgcHJldmlvdXNseS1jYWNoZWQgZWxlbWVudCBpbmRleCBpZiBhdmFpbGFibGVcblx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8ICggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y2FjaGUgPSB1bmlxdWVDYWNoZVsgdHlwZSBdIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0XHRkaWZmID0gbm9kZUluZGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8geG1sIDpudGgtY2hpbGQoLi4uKVxuXHRcdFx0XHRcdFx0XHQvLyBvciA6bnRoLWxhc3QtY2hpbGQoLi4uKSBvciA6bnRoKC1sYXN0KT8tb2YtdHlwZSguLi4pXG5cdFx0XHRcdFx0XHRcdGlmICggZGlmZiA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBVc2UgdGhlIHNhbWUgbG9vcCBhcyBhYm92ZSB0byBzZWVrIGBlbGVtYCBmcm9tIHRoZSBzdGFydFxuXHRcdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KCBkaWZmID0gbm9kZUluZGV4ID0gMCApIHx8IHN0YXJ0LnBvcCgpICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0KytkaWZmICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENhY2hlIHRoZSBpbmRleCBvZiBlYWNoIGVuY291bnRlcmVkIGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyB0eXBlIF0gPSBbIGRpcnJ1bnMsIGRpZmYgXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBJbmNvcnBvcmF0ZSB0aGUgb2Zmc2V0LCB0aGVuIGNoZWNrIGFnYWluc3QgY3ljbGUgc2l6ZVxuXHRcdFx0XHRcdFx0ZGlmZiAtPSBsYXN0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRpZmYgPT09IGZpcnN0IHx8ICggZGlmZiAlIGZpcnN0ID09PSAwICYmIGRpZmYgLyBmaXJzdCA+PSAwICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIlBTRVVET1wiOiBmdW5jdGlvbiggcHNldWRvLCBhcmd1bWVudCApIHtcblxuXHRcdFx0Ly8gcHNldWRvLWNsYXNzIG5hbWVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI3BzZXVkby1jbGFzc2VzXG5cdFx0XHQvLyBQcmlvcml0aXplIGJ5IGNhc2Ugc2Vuc2l0aXZpdHkgaW4gY2FzZSBjdXN0b20gcHNldWRvcyBhcmUgYWRkZWQgd2l0aCB1cHBlcmNhc2UgbGV0dGVyc1xuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCBzZXRGaWx0ZXJzIGluaGVyaXRzIGZyb20gcHNldWRvc1xuXHRcdFx0dmFyIGFyZ3MsXG5cdFx0XHRcdGZuID0gRXhwci5wc2V1ZG9zWyBwc2V1ZG8gXSB8fCBFeHByLnNldEZpbHRlcnNbIHBzZXVkby50b0xvd2VyQ2FzZSgpIF0gfHxcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIiArIHBzZXVkbyApO1xuXG5cdFx0XHQvLyBUaGUgdXNlciBtYXkgdXNlIGNyZWF0ZVBzZXVkbyB0byBpbmRpY2F0ZSB0aGF0XG5cdFx0XHQvLyBhcmd1bWVudHMgYXJlIG5lZWRlZCB0byBjcmVhdGUgdGhlIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0Ly8ganVzdCBhcyBTaXp6bGUgZG9lc1xuXHRcdFx0aWYgKCBmblsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRyZXR1cm4gZm4oIGFyZ3VtZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1dCBtYWludGFpbiBzdXBwb3J0IGZvciBvbGQgc2lnbmF0dXJlc1xuXHRcdFx0aWYgKCBmbi5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRhcmdzID0gWyBwc2V1ZG8sIHBzZXVkbywgXCJcIiwgYXJndW1lbnQgXTtcblx0XHRcdFx0cmV0dXJuIEV4cHIuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eSggcHNldWRvLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdFx0bWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcyApIHtcblx0XHRcdFx0XHRcdHZhciBpZHgsXG5cdFx0XHRcdFx0XHRcdG1hdGNoZWQgPSBmbiggc2VlZCwgYXJndW1lbnQgKSxcblx0XHRcdFx0XHRcdFx0aSA9IG1hdGNoZWQubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRcdGlkeCA9IGluZGV4T2YoIHNlZWQsIG1hdGNoZWRbIGkgXSApO1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpZHggXSA9ICEoIG1hdGNoZXNbIGlkeCBdID0gbWF0Y2hlZFsgaSBdICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApIDpcblx0XHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmbiggZWxlbSwgMCwgYXJncyApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbjtcblx0XHR9XG5cdH0sXG5cblx0cHNldWRvczoge1xuXG5cdFx0Ly8gUG90ZW50aWFsbHkgY29tcGxleCBwc2V1ZG9zXG5cdFx0XCJub3RcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cblx0XHRcdC8vIFRyaW0gdGhlIHNlbGVjdG9yIHBhc3NlZCB0byBjb21waWxlXG5cdFx0XHQvLyB0byBhdm9pZCB0cmVhdGluZyBsZWFkaW5nIGFuZCB0cmFpbGluZ1xuXHRcdFx0Ly8gc3BhY2VzIGFzIGNvbWJpbmF0b3JzXG5cdFx0XHR2YXIgaW5wdXQgPSBbXSxcblx0XHRcdFx0cmVzdWx0cyA9IFtdLFxuXHRcdFx0XHRtYXRjaGVyID0gY29tcGlsZSggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApICk7XG5cblx0XHRcdHJldHVybiBtYXRjaGVyWyBleHBhbmRvIF0gP1xuXHRcdFx0XHRtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHRcdFx0dW5tYXRjaGVkID0gbWF0Y2hlciggc2VlZCwgbnVsbCwgeG1sLCBbXSApLFxuXHRcdFx0XHRcdFx0aSA9IHNlZWQubGVuZ3RoO1xuXG5cdFx0XHRcdFx0Ly8gTWF0Y2ggZWxlbWVudHMgdW5tYXRjaGVkIGJ5IGBtYXRjaGVyYFxuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSB1bm1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpIF0gPSAhKCBtYXRjaGVzWyBpIF0gPSBlbGVtICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHRpbnB1dFsgMCBdID0gZWxlbTtcblx0XHRcdFx0XHRtYXRjaGVyKCBpbnB1dCwgbnVsbCwgeG1sLCByZXN1bHRzICk7XG5cblx0XHRcdFx0XHQvLyBEb24ndCBrZWVwIHRoZSBlbGVtZW50IChpc3N1ZSAjMjk5KVxuXHRcdFx0XHRcdGlucHV0WyAwIF0gPSBudWxsO1xuXHRcdFx0XHRcdHJldHVybiAhcmVzdWx0cy5wb3AoKTtcblx0XHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHRcImhhc1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIFNpenpsZSggc2VsZWN0b3IsIGVsZW0gKS5sZW5ndGggPiAwO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHRcImNvbnRhaW5zXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gKCBlbGVtLnRleHRDb250ZW50IHx8IGdldFRleHQoIGVsZW0gKSApLmluZGV4T2YoIHRleHQgKSA+IC0xO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHQvLyBcIldoZXRoZXIgYW4gZWxlbWVudCBpcyByZXByZXNlbnRlZCBieSBhIDpsYW5nKCkgc2VsZWN0b3Jcblx0XHQvLyBpcyBiYXNlZCBzb2xlbHkgb24gdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZVxuXHRcdC8vIGJlaW5nIGVxdWFsIHRvIHRoZSBpZGVudGlmaWVyIEMsXG5cdFx0Ly8gb3IgYmVnaW5uaW5nIHdpdGggdGhlIGlkZW50aWZpZXIgQyBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSBcIi1cIi5cblx0XHQvLyBUaGUgbWF0Y2hpbmcgb2YgQyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWUgaXMgcGVyZm9ybWVkIGNhc2UtaW5zZW5zaXRpdmVseS5cblx0XHQvLyBUaGUgaWRlbnRpZmllciBDIGRvZXMgbm90IGhhdmUgdG8gYmUgYSB2YWxpZCBsYW5ndWFnZSBuYW1lLlwiXG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNsYW5nLXBzZXVkb1xuXHRcdFwibGFuZ1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBsYW5nICkge1xuXG5cdFx0XHQvLyBsYW5nIHZhbHVlIG11c3QgYmUgYSB2YWxpZCBpZGVudGlmaWVyXG5cdFx0XHRpZiAoICFyaWRlbnRpZmllci50ZXN0KCBsYW5nIHx8IFwiXCIgKSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIGxhbmc6IFwiICsgbGFuZyApO1xuXHRcdFx0fVxuXHRcdFx0bGFuZyA9IGxhbmcucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgZWxlbUxhbmc7XG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRpZiAoICggZWxlbUxhbmcgPSBkb2N1bWVudElzSFRNTCA/XG5cdFx0XHRcdFx0XHRlbGVtLmxhbmcgOlxuXHRcdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIFwieG1sOmxhbmdcIiApIHx8IGVsZW0uZ2V0QXR0cmlidXRlKCBcImxhbmdcIiApICkgKSB7XG5cblx0XHRcdFx0XHRcdGVsZW1MYW5nID0gZWxlbUxhbmcudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtTGFuZyA9PT0gbGFuZyB8fCBlbGVtTGFuZy5pbmRleE9mKCBsYW5nICsgXCItXCIgKSA9PT0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gd2hpbGUgKCAoIGVsZW0gPSBlbGVtLnBhcmVudE5vZGUgKSAmJiBlbGVtLm5vZGVUeXBlID09PSAxICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0Ly8gTWlzY2VsbGFuZW91c1xuXHRcdFwidGFyZ2V0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cdFx0XHRyZXR1cm4gaGFzaCAmJiBoYXNoLnNsaWNlKCAxICkgPT09IGVsZW0uaWQ7XG5cdFx0fSxcblxuXHRcdFwicm9vdFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2NFbGVtO1xuXHRcdH0sXG5cblx0XHRcImZvY3VzXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiZcblx0XHRcdFx0KCAhZG9jdW1lbnQuaGFzRm9jdXMgfHwgZG9jdW1lbnQuaGFzRm9jdXMoKSApICYmXG5cdFx0XHRcdCEhKCBlbGVtLnR5cGUgfHwgZWxlbS5ocmVmIHx8IH5lbGVtLnRhYkluZGV4ICk7XG5cdFx0fSxcblxuXHRcdC8vIEJvb2xlYW4gcHJvcGVydGllc1xuXHRcdFwiZW5hYmxlZFwiOiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggZmFsc2UgKSxcblx0XHRcImRpc2FibGVkXCI6IGNyZWF0ZURpc2FibGVkUHNldWRvKCB0cnVlICksXG5cblx0XHRcImNoZWNrZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIEluIENTUzMsIDpjaGVja2VkIHNob3VsZCByZXR1cm4gYm90aCBjaGVja2VkIGFuZCBzZWxlY3RlZCBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdHZhciBub2RlTmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgISFlbGVtLmNoZWNrZWQgKSB8fFxuXHRcdFx0XHQoIG5vZGVOYW1lID09PSBcIm9wdGlvblwiICYmICEhZWxlbS5zZWxlY3RlZCApO1xuXHRcdH0sXG5cblx0XHRcInNlbGVjdGVkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBBY2Nlc3NpbmcgdGhpcyBwcm9wZXJ0eSBtYWtlcyBzZWxlY3RlZC1ieS1kZWZhdWx0XG5cdFx0XHQvLyBvcHRpb25zIGluIFNhZmFyaSB3b3JrIHByb3Blcmx5XG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uc2VsZWN0ZWQgPT09IHRydWU7XG5cdFx0fSxcblxuXHRcdC8vIENvbnRlbnRzXG5cdFx0XCJlbXB0eVwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNlbXB0eS1wc2V1ZG9cblx0XHRcdC8vIDplbXB0eSBpcyBuZWdhdGVkIGJ5IGVsZW1lbnQgKDEpIG9yIGNvbnRlbnQgbm9kZXMgKHRleHQ6IDM7IGNkYXRhOiA0OyBlbnRpdHkgcmVmOiA1KSxcblx0XHRcdC8vICAgYnV0IG5vdCBieSBvdGhlcnMgKGNvbW1lbnQ6IDg7IHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb246IDc7IGV0Yy4pXG5cdFx0XHQvLyBub2RlVHlwZSA8IDYgd29ya3MgYmVjYXVzZSBhdHRyaWJ1dGVzICgyKSBkbyBub3QgYXBwZWFyIGFzIGNoaWxkcmVuXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlIDwgNiApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHRcInBhcmVudFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiAhRXhwci5wc2V1ZG9zWyBcImVtcHR5XCIgXSggZWxlbSApO1xuXHRcdH0sXG5cblx0XHQvLyBFbGVtZW50L2lucHV0IHR5cGVzXG5cdFx0XCJoZWFkZXJcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmhlYWRlci50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiaW5wdXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmlucHV0cy50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiYnV0dG9uXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gXCJidXR0b25cIiB8fCBuYW1lID09PSBcImJ1dHRvblwiO1xuXHRcdH0sXG5cblx0XHRcInRleHRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgYXR0cjtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiAmJlxuXHRcdFx0XHRlbGVtLnR5cGUgPT09IFwidGV4dFwiICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUU8OFxuXHRcdFx0XHQvLyBOZXcgSFRNTDUgYXR0cmlidXRlIHZhbHVlcyAoZS5nLiwgXCJzZWFyY2hcIikgYXBwZWFyIHdpdGggZWxlbS50eXBlID09PSBcInRleHRcIlxuXHRcdFx0XHQoICggYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApICkgPT0gbnVsbCB8fFxuXHRcdFx0XHRcdGF0dHIudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZXh0XCIgKTtcblx0XHR9LFxuXG5cdFx0Ly8gUG9zaXRpb24taW4tY29sbGVjdGlvblxuXHRcdFwiZmlyc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gWyAwIF07XG5cdFx0fSApLFxuXG5cdFx0XCJsYXN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBfbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gWyBsZW5ndGggLSAxIF07XG5cdFx0fSApLFxuXG5cdFx0XCJlcVwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggX21hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHJldHVybiBbIGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQgXTtcblx0XHR9ICksXG5cblx0XHRcImV2ZW5cIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAwO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwib2RkXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcImx0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/XG5cdFx0XHRcdGFyZ3VtZW50ICsgbGVuZ3RoIDpcblx0XHRcdFx0YXJndW1lbnQgPiBsZW5ndGggP1xuXHRcdFx0XHRcdGxlbmd0aCA6XG5cdFx0XHRcdFx0YXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7IC0taSA+PSAwOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJndFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyArK2kgPCBsZW5ndGg7ICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9IClcblx0fVxufTtcblxuRXhwci5wc2V1ZG9zWyBcIm50aFwiIF0gPSBFeHByLnBzZXVkb3NbIFwiZXFcIiBdO1xuXG4vLyBBZGQgYnV0dG9uL2lucHV0IHR5cGUgcHNldWRvc1xuZm9yICggaSBpbiB7IHJhZGlvOiB0cnVlLCBjaGVja2JveDogdHJ1ZSwgZmlsZTogdHJ1ZSwgcGFzc3dvcmQ6IHRydWUsIGltYWdlOiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlSW5wdXRQc2V1ZG8oIGkgKTtcbn1cbmZvciAoIGkgaW4geyBzdWJtaXQ6IHRydWUsIHJlc2V0OiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlQnV0dG9uUHNldWRvKCBpICk7XG59XG5cbi8vIEVhc3kgQVBJIGZvciBjcmVhdGluZyBuZXcgc2V0RmlsdGVyc1xuZnVuY3Rpb24gc2V0RmlsdGVycygpIHt9XG5zZXRGaWx0ZXJzLnByb3RvdHlwZSA9IEV4cHIuZmlsdGVycyA9IEV4cHIucHNldWRvcztcbkV4cHIuc2V0RmlsdGVycyA9IG5ldyBzZXRGaWx0ZXJzKCk7XG5cbnRva2VuaXplID0gU2l6emxlLnRva2VuaXplID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBwYXJzZU9ubHkgKSB7XG5cdHZhciBtYXRjaGVkLCBtYXRjaCwgdG9rZW5zLCB0eXBlLFxuXHRcdHNvRmFyLCBncm91cHMsIHByZUZpbHRlcnMsXG5cdFx0Y2FjaGVkID0gdG9rZW5DYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggY2FjaGVkICkge1xuXHRcdHJldHVybiBwYXJzZU9ubHkgPyAwIDogY2FjaGVkLnNsaWNlKCAwICk7XG5cdH1cblxuXHRzb0ZhciA9IHNlbGVjdG9yO1xuXHRncm91cHMgPSBbXTtcblx0cHJlRmlsdGVycyA9IEV4cHIucHJlRmlsdGVyO1xuXG5cdHdoaWxlICggc29GYXIgKSB7XG5cblx0XHQvLyBDb21tYSBhbmQgZmlyc3QgcnVuXG5cdFx0aWYgKCAhbWF0Y2hlZCB8fCAoIG1hdGNoID0gcmNvbW1hLmV4ZWMoIHNvRmFyICkgKSApIHtcblx0XHRcdGlmICggbWF0Y2ggKSB7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgY29uc3VtZSB0cmFpbGluZyBjb21tYXMgYXMgdmFsaWRcblx0XHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hbIDAgXS5sZW5ndGggKSB8fCBzb0Zhcjtcblx0XHRcdH1cblx0XHRcdGdyb3Vwcy5wdXNoKCAoIHRva2VucyA9IFtdICkgKTtcblx0XHR9XG5cblx0XHRtYXRjaGVkID0gZmFsc2U7XG5cblx0XHQvLyBDb21iaW5hdG9yc1xuXHRcdGlmICggKCBtYXRjaCA9IHJjb21iaW5hdG9ycy5leGVjKCBzb0ZhciApICkgKSB7XG5cdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdHRva2Vucy5wdXNoKCB7XG5cdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXG5cdFx0XHRcdC8vIENhc3QgZGVzY2VuZGFudCBjb21iaW5hdG9ycyB0byBzcGFjZVxuXHRcdFx0XHR0eXBlOiBtYXRjaFsgMCBdLnJlcGxhY2UoIHJ0cmltLCBcIiBcIiApXG5cdFx0XHR9ICk7XG5cdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZpbHRlcnNcblx0XHRmb3IgKCB0eXBlIGluIEV4cHIuZmlsdGVyICkge1xuXHRcdFx0aWYgKCAoIG1hdGNoID0gbWF0Y2hFeHByWyB0eXBlIF0uZXhlYyggc29GYXIgKSApICYmICggIXByZUZpbHRlcnNbIHR5cGUgXSB8fFxuXHRcdFx0XHQoIG1hdGNoID0gcHJlRmlsdGVyc1sgdHlwZSBdKCBtYXRjaCApICkgKSApIHtcblx0XHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHRcdHRva2Vucy5wdXNoKCB7XG5cdFx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cdFx0XHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdFx0XHRtYXRjaGVzOiBtYXRjaFxuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhbWF0Y2hlZCApIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnZhbGlkIGV4Y2Vzc1xuXHQvLyBpZiB3ZSdyZSBqdXN0IHBhcnNpbmdcblx0Ly8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvciBvciByZXR1cm4gdG9rZW5zXG5cdHJldHVybiBwYXJzZU9ubHkgP1xuXHRcdHNvRmFyLmxlbmd0aCA6XG5cdFx0c29GYXIgP1xuXHRcdFx0U2l6emxlLmVycm9yKCBzZWxlY3RvciApIDpcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIHRva2Vuc1xuXHRcdFx0dG9rZW5DYWNoZSggc2VsZWN0b3IsIGdyb3VwcyApLnNsaWNlKCAwICk7XG59O1xuXG5mdW5jdGlvbiB0b1NlbGVjdG9yKCB0b2tlbnMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSB0b2tlbnMubGVuZ3RoLFxuXHRcdHNlbGVjdG9yID0gXCJcIjtcblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0c2VsZWN0b3IgKz0gdG9rZW5zWyBpIF0udmFsdWU7XG5cdH1cblx0cmV0dXJuIHNlbGVjdG9yO1xufVxuXG5mdW5jdGlvbiBhZGRDb21iaW5hdG9yKCBtYXRjaGVyLCBjb21iaW5hdG9yLCBiYXNlICkge1xuXHR2YXIgZGlyID0gY29tYmluYXRvci5kaXIsXG5cdFx0c2tpcCA9IGNvbWJpbmF0b3IubmV4dCxcblx0XHRrZXkgPSBza2lwIHx8IGRpcixcblx0XHRjaGVja05vbkVsZW1lbnRzID0gYmFzZSAmJiBrZXkgPT09IFwicGFyZW50Tm9kZVwiLFxuXHRcdGRvbmVOYW1lID0gZG9uZSsrO1xuXG5cdHJldHVybiBjb21iaW5hdG9yLmZpcnN0ID9cblxuXHRcdC8vIENoZWNrIGFnYWluc3QgY2xvc2VzdCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudFxuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdHJldHVybiBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gOlxuXG5cdFx0Ly8gQ2hlY2sgYWdhaW5zdCBhbGwgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRzXG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBvbGRDYWNoZSwgdW5pcXVlQ2FjaGUsIG91dGVyQ2FjaGUsXG5cdFx0XHRcdG5ld0NhY2hlID0gWyBkaXJydW5zLCBkb25lTmFtZSBdO1xuXG5cdFx0XHQvLyBXZSBjYW4ndCBzZXQgYXJiaXRyYXJ5IGRhdGEgb24gWE1MIG5vZGVzLCBzbyB0aGV5IGRvbid0IGJlbmVmaXQgZnJvbSBjb21iaW5hdG9yIGNhY2hpbmdcblx0XHRcdGlmICggeG1sICkge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBlbGVtWyBleHBhbmRvIF0gfHwgKCBlbGVtWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgZWxlbS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgZWxlbS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBza2lwICYmIHNraXAgPT09IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0XHRcdFx0ZWxlbSA9IGVsZW1bIGRpciBdIHx8IGVsZW07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAoIG9sZENhY2hlID0gdW5pcXVlQ2FjaGVbIGtleSBdICkgJiZcblx0XHRcdFx0XHRcdFx0b2xkQ2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBvbGRDYWNoZVsgMSBdID09PSBkb25lTmFtZSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBBc3NpZ24gdG8gbmV3Q2FjaGUgc28gcmVzdWx0cyBiYWNrLXByb3BhZ2F0ZSB0byBwcmV2aW91cyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKCBuZXdDYWNoZVsgMiBdID0gb2xkQ2FjaGVbIDIgXSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXVzZSBuZXdjYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyBrZXkgXSA9IG5ld0NhY2hlO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEEgbWF0Y2ggbWVhbnMgd2UncmUgZG9uZTsgYSBmYWlsIG1lYW5zIHdlIGhhdmUgdG8ga2VlcCBjaGVja2luZ1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3Q2FjaGVbIDIgXSA9IG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xufVxuXG5mdW5jdGlvbiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSB7XG5cdHJldHVybiBtYXRjaGVycy5sZW5ndGggPiAxID9cblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIGkgPSBtYXRjaGVycy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAhbWF0Y2hlcnNbIGkgXSggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IDpcblx0XHRtYXRjaGVyc1sgMCBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciwgY29udGV4dHMsIHJlc3VsdHMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHRzWyBpIF0sIHJlc3VsdHMgKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gY29uZGVuc2UoIHVubWF0Y2hlZCwgbWFwLCBmaWx0ZXIsIGNvbnRleHQsIHhtbCApIHtcblx0dmFyIGVsZW0sXG5cdFx0bmV3VW5tYXRjaGVkID0gW10sXG5cdFx0aSA9IDAsXG5cdFx0bGVuID0gdW5tYXRjaGVkLmxlbmd0aCxcblx0XHRtYXBwZWQgPSBtYXAgIT0gbnVsbDtcblxuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRpZiAoICggZWxlbSA9IHVubWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRpZiAoICFmaWx0ZXIgfHwgZmlsdGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0bmV3VW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0aWYgKCBtYXBwZWQgKSB7XG5cdFx0XHRcdFx0bWFwLnB1c2goIGkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBuZXdVbm1hdGNoZWQ7XG59XG5cbmZ1bmN0aW9uIHNldE1hdGNoZXIoIHByZUZpbHRlciwgc2VsZWN0b3IsIG1hdGNoZXIsIHBvc3RGaWx0ZXIsIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApIHtcblx0aWYgKCBwb3N0RmlsdGVyICYmICFwb3N0RmlsdGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbHRlciA9IHNldE1hdGNoZXIoIHBvc3RGaWx0ZXIgKTtcblx0fVxuXHRpZiAoIHBvc3RGaW5kZXIgJiYgIXBvc3RGaW5kZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmluZGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICk7XG5cdH1cblx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIHJlc3VsdHMsIGNvbnRleHQsIHhtbCApIHtcblx0XHR2YXIgdGVtcCwgaSwgZWxlbSxcblx0XHRcdHByZU1hcCA9IFtdLFxuXHRcdFx0cG9zdE1hcCA9IFtdLFxuXHRcdFx0cHJlZXhpc3RpbmcgPSByZXN1bHRzLmxlbmd0aCxcblxuXHRcdFx0Ly8gR2V0IGluaXRpYWwgZWxlbWVudHMgZnJvbSBzZWVkIG9yIGNvbnRleHRcblx0XHRcdGVsZW1zID0gc2VlZCB8fCBtdWx0aXBsZUNvbnRleHRzKFxuXHRcdFx0XHRzZWxlY3RvciB8fCBcIipcIixcblx0XHRcdFx0Y29udGV4dC5ub2RlVHlwZSA/IFsgY29udGV4dCBdIDogY29udGV4dCxcblx0XHRcdFx0W11cblx0XHRcdCksXG5cblx0XHRcdC8vIFByZWZpbHRlciB0byBnZXQgbWF0Y2hlciBpbnB1dCwgcHJlc2VydmluZyBhIG1hcCBmb3Igc2VlZC1yZXN1bHRzIHN5bmNocm9uaXphdGlvblxuXHRcdFx0bWF0Y2hlckluID0gcHJlRmlsdGVyICYmICggc2VlZCB8fCAhc2VsZWN0b3IgKSA/XG5cdFx0XHRcdGNvbmRlbnNlKCBlbGVtcywgcHJlTWFwLCBwcmVGaWx0ZXIsIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0ZWxlbXMsXG5cblx0XHRcdG1hdGNoZXJPdXQgPSBtYXRjaGVyID9cblxuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGEgcG9zdEZpbmRlciwgb3IgZmlsdGVyZWQgc2VlZCwgb3Igbm9uLXNlZWQgcG9zdEZpbHRlciBvciBwcmVleGlzdGluZyByZXN1bHRzLFxuXHRcdFx0XHRwb3N0RmluZGVyIHx8ICggc2VlZCA/IHByZUZpbHRlciA6IHByZWV4aXN0aW5nIHx8IHBvc3RGaWx0ZXIgKSA/XG5cblx0XHRcdFx0XHQvLyAuLi5pbnRlcm1lZGlhdGUgcHJvY2Vzc2luZyBpcyBuZWNlc3Nhcnlcblx0XHRcdFx0XHRbXSA6XG5cblx0XHRcdFx0XHQvLyAuLi5vdGhlcndpc2UgdXNlIHJlc3VsdHMgZGlyZWN0bHlcblx0XHRcdFx0XHRyZXN1bHRzIDpcblx0XHRcdFx0bWF0Y2hlckluO1xuXG5cdFx0Ly8gRmluZCBwcmltYXJ5IG1hdGNoZXNcblx0XHRpZiAoIG1hdGNoZXIgKSB7XG5cdFx0XHRtYXRjaGVyKCBtYXRjaGVySW4sIG1hdGNoZXJPdXQsIGNvbnRleHQsIHhtbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHBvc3RGaWx0ZXJcblx0XHRpZiAoIHBvc3RGaWx0ZXIgKSB7XG5cdFx0XHR0ZW1wID0gY29uZGVuc2UoIG1hdGNoZXJPdXQsIHBvc3RNYXAgKTtcblx0XHRcdHBvc3RGaWx0ZXIoIHRlbXAsIFtdLCBjb250ZXh0LCB4bWwgKTtcblxuXHRcdFx0Ly8gVW4tbWF0Y2ggZmFpbGluZyBlbGVtZW50cyBieSBtb3ZpbmcgdGhlbSBiYWNrIHRvIG1hdGNoZXJJblxuXHRcdFx0aSA9IHRlbXAubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggKCBlbGVtID0gdGVtcFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlck91dFsgcG9zdE1hcFsgaSBdIF0gPSAhKCBtYXRjaGVySW5bIHBvc3RNYXBbIGkgXSBdID0gZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0aWYgKCBwb3N0RmluZGVyIHx8IHByZUZpbHRlciApIHtcblx0XHRcdFx0aWYgKCBwb3N0RmluZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gR2V0IHRoZSBmaW5hbCBtYXRjaGVyT3V0IGJ5IGNvbmRlbnNpbmcgdGhpcyBpbnRlcm1lZGlhdGUgaW50byBwb3N0RmluZGVyIGNvbnRleHRzXG5cdFx0XHRcdFx0dGVtcCA9IFtdO1xuXHRcdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gbWF0Y2hlck91dFsgaSBdICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmVzdG9yZSBtYXRjaGVySW4gc2luY2UgZWxlbSBpcyBub3QgeWV0IGEgZmluYWwgbWF0Y2hcblx0XHRcdFx0XHRcdFx0dGVtcC5wdXNoKCAoIG1hdGNoZXJJblsgaSBdID0gZWxlbSApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsICggbWF0Y2hlck91dCA9IFtdICksIHRlbXAsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTW92ZSBtYXRjaGVkIGVsZW1lbnRzIGZyb20gc2VlZCB0byByZXN1bHRzIHRvIGtlZXAgdGhlbSBzeW5jaHJvbml6ZWRcblx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRpZiAoICggZWxlbSA9IG1hdGNoZXJPdXRbIGkgXSApICYmXG5cdFx0XHRcdFx0XHQoIHRlbXAgPSBwb3N0RmluZGVyID8gaW5kZXhPZiggc2VlZCwgZWxlbSApIDogcHJlTWFwWyBpIF0gKSA+IC0xICkge1xuXG5cdFx0XHRcdFx0XHRzZWVkWyB0ZW1wIF0gPSAhKCByZXN1bHRzWyB0ZW1wIF0gPSBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBBZGQgZWxlbWVudHMgdG8gcmVzdWx0cywgdGhyb3VnaCBwb3N0RmluZGVyIGlmIGRlZmluZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlck91dCA9IGNvbmRlbnNlKFxuXHRcdFx0XHRtYXRjaGVyT3V0ID09PSByZXN1bHRzID9cblx0XHRcdFx0XHRtYXRjaGVyT3V0LnNwbGljZSggcHJlZXhpc3RpbmcsIG1hdGNoZXJPdXQubGVuZ3RoICkgOlxuXHRcdFx0XHRcdG1hdGNoZXJPdXRcblx0XHRcdCk7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsIHJlc3VsdHMsIG1hdGNoZXJPdXQsIHhtbCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgbWF0Y2hlck91dCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zICkge1xuXHR2YXIgY2hlY2tDb250ZXh0LCBtYXRjaGVyLCBqLFxuXHRcdGxlbiA9IHRva2Vucy5sZW5ndGgsXG5cdFx0bGVhZGluZ1JlbGF0aXZlID0gRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyAwIF0udHlwZSBdLFxuXHRcdGltcGxpY2l0UmVsYXRpdmUgPSBsZWFkaW5nUmVsYXRpdmUgfHwgRXhwci5yZWxhdGl2ZVsgXCIgXCIgXSxcblx0XHRpID0gbGVhZGluZ1JlbGF0aXZlID8gMSA6IDAsXG5cblx0XHQvLyBUaGUgZm91bmRhdGlvbmFsIG1hdGNoZXIgZW5zdXJlcyB0aGF0IGVsZW1lbnRzIGFyZSByZWFjaGFibGUgZnJvbSB0b3AtbGV2ZWwgY29udGV4dChzKVxuXHRcdG1hdGNoQ29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGNoZWNrQ29udGV4dDtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hBbnlDb250ZXh0ID0gYWRkQ29tYmluYXRvciggZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gaW5kZXhPZiggY2hlY2tDb250ZXh0LCBlbGVtICkgPiAtMTtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hlcnMgPSBbIGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgcmV0ID0gKCAhbGVhZGluZ1JlbGF0aXZlICYmICggeG1sIHx8IGNvbnRleHQgIT09IG91dGVybW9zdENvbnRleHQgKSApIHx8IChcblx0XHRcdFx0KCBjaGVja0NvbnRleHQgPSBjb250ZXh0ICkubm9kZVR5cGUgP1xuXHRcdFx0XHRcdG1hdGNoQ29udGV4dCggZWxlbSwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRcdG1hdGNoQW55Q29udGV4dCggZWxlbSwgY29udGV4dCwgeG1sICkgKTtcblxuXHRcdFx0Ly8gQXZvaWQgaGFuZ2luZyBvbnRvIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRjaGVja0NvbnRleHQgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9IF07XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoIG1hdGNoZXIgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIGkgXS50eXBlIF0gKSApIHtcblx0XHRcdG1hdGNoZXJzID0gWyBhZGRDb21iaW5hdG9yKCBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSwgbWF0Y2hlciApIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXIgPSBFeHByLmZpbHRlclsgdG9rZW5zWyBpIF0udHlwZSBdLmFwcGx5KCBudWxsLCB0b2tlbnNbIGkgXS5tYXRjaGVzICk7XG5cblx0XHRcdC8vIFJldHVybiBzcGVjaWFsIHVwb24gc2VlaW5nIGEgcG9zaXRpb25hbCBtYXRjaGVyXG5cdFx0XHRpZiAoIG1hdGNoZXJbIGV4cGFuZG8gXSApIHtcblxuXHRcdFx0XHQvLyBGaW5kIHRoZSBuZXh0IHJlbGF0aXZlIG9wZXJhdG9yIChpZiBhbnkpIGZvciBwcm9wZXIgaGFuZGxpbmdcblx0XHRcdFx0aiA9ICsraTtcblx0XHRcdFx0Zm9yICggOyBqIDwgbGVuOyBqKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIGogXS50eXBlIF0gKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNldE1hdGNoZXIoXG5cdFx0XHRcdFx0aSA+IDEgJiYgZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksXG5cdFx0XHRcdFx0aSA+IDEgJiYgdG9TZWxlY3RvcihcblxuXHRcdFx0XHRcdC8vIElmIHRoZSBwcmVjZWRpbmcgdG9rZW4gd2FzIGEgZGVzY2VuZGFudCBjb21iaW5hdG9yLCBpbnNlcnQgYW4gaW1wbGljaXQgYW55LWVsZW1lbnQgYCpgXG5cdFx0XHRcdFx0dG9rZW5zXG5cdFx0XHRcdFx0XHQuc2xpY2UoIDAsIGkgLSAxIClcblx0XHRcdFx0XHRcdC5jb25jYXQoIHsgdmFsdWU6IHRva2Vuc1sgaSAtIDIgXS50eXBlID09PSBcIiBcIiA/IFwiKlwiIDogXCJcIiB9IClcblx0XHRcdFx0XHQpLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSxcblx0XHRcdFx0XHRtYXRjaGVyLFxuXHRcdFx0XHRcdGkgPCBqICYmIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMuc2xpY2UoIGksIGogKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgbWF0Y2hlckZyb21Ub2tlbnMoICggdG9rZW5zID0gdG9rZW5zLnNsaWNlKCBqICkgKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgdG9TZWxlY3RvciggdG9rZW5zIClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdG1hdGNoZXJzLnB1c2goIG1hdGNoZXIgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyggZWxlbWVudE1hdGNoZXJzLCBzZXRNYXRjaGVycyApIHtcblx0dmFyIGJ5U2V0ID0gc2V0TWF0Y2hlcnMubGVuZ3RoID4gMCxcblx0XHRieUVsZW1lbnQgPSBlbGVtZW50TWF0Y2hlcnMubGVuZ3RoID4gMCxcblx0XHRzdXBlck1hdGNoZXIgPSBmdW5jdGlvbiggc2VlZCwgY29udGV4dCwgeG1sLCByZXN1bHRzLCBvdXRlcm1vc3QgKSB7XG5cdFx0XHR2YXIgZWxlbSwgaiwgbWF0Y2hlcixcblx0XHRcdFx0bWF0Y2hlZENvdW50ID0gMCxcblx0XHRcdFx0aSA9IFwiMFwiLFxuXHRcdFx0XHR1bm1hdGNoZWQgPSBzZWVkICYmIFtdLFxuXHRcdFx0XHRzZXRNYXRjaGVkID0gW10sXG5cdFx0XHRcdGNvbnRleHRCYWNrdXAgPSBvdXRlcm1vc3RDb250ZXh0LFxuXG5cdFx0XHRcdC8vIFdlIG11c3QgYWx3YXlzIGhhdmUgZWl0aGVyIHNlZWQgZWxlbWVudHMgb3Igb3V0ZXJtb3N0IGNvbnRleHRcblx0XHRcdFx0ZWxlbXMgPSBzZWVkIHx8IGJ5RWxlbWVudCAmJiBFeHByLmZpbmRbIFwiVEFHXCIgXSggXCIqXCIsIG91dGVybW9zdCApLFxuXG5cdFx0XHRcdC8vIFVzZSBpbnRlZ2VyIGRpcnJ1bnMgaWZmIHRoaXMgaXMgdGhlIG91dGVybW9zdCBtYXRjaGVyXG5cdFx0XHRcdGRpcnJ1bnNVbmlxdWUgPSAoIGRpcnJ1bnMgKz0gY29udGV4dEJhY2t1cCA9PSBudWxsID8gMSA6IE1hdGgucmFuZG9tKCkgfHwgMC4xICksXG5cdFx0XHRcdGxlbiA9IGVsZW1zLmxlbmd0aDtcblxuXHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHQgPT0gZG9jdW1lbnQgfHwgY29udGV4dCB8fCBvdXRlcm1vc3Q7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCBlbGVtZW50cyBwYXNzaW5nIGVsZW1lbnRNYXRjaGVycyBkaXJlY3RseSB0byByZXN1bHRzXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTw5LCBTYWZhcmlcblx0XHRcdC8vIFRvbGVyYXRlIE5vZGVMaXN0IHByb3BlcnRpZXMgKElFOiBcImxlbmd0aFwiOyBTYWZhcmk6IDxudW1iZXI+KSBtYXRjaGluZyBlbGVtZW50cyBieSBpZFxuXHRcdFx0Zm9yICggOyBpICE9PSBsZW4gJiYgKCBlbGVtID0gZWxlbXNbIGkgXSApICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBieUVsZW1lbnQgJiYgZWxlbSApIHtcblx0XHRcdFx0XHRqID0gMDtcblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdFx0aWYgKCAhY29udGV4dCAmJiBlbGVtLm93bmVyRG9jdW1lbnQgIT0gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHRcdFx0XHRcdFx0eG1sID0gIWRvY3VtZW50SXNIVE1MO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aGlsZSAoICggbWF0Y2hlciA9IGVsZW1lbnRNYXRjaGVyc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlciggZWxlbSwgY29udGV4dCB8fCBkb2N1bWVudCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cdFx0XHRcdFx0XHRkaXJydW5zID0gZGlycnVuc1VuaXF1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUcmFjayB1bm1hdGNoZWQgZWxlbWVudHMgZm9yIHNldCBmaWx0ZXJzXG5cdFx0XHRcdGlmICggYnlTZXQgKSB7XG5cblx0XHRcdFx0XHQvLyBUaGV5IHdpbGwgaGF2ZSBnb25lIHRocm91Z2ggYWxsIHBvc3NpYmxlIG1hdGNoZXJzXG5cdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSAhbWF0Y2hlciAmJiBlbGVtICkgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVkQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMZW5ndGhlbiB0aGUgYXJyYXkgZm9yIGV2ZXJ5IGVsZW1lbnQsIG1hdGNoZWQgb3Igbm90XG5cdFx0XHRcdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0XHRcdFx0dW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYGlgIGlzIG5vdyB0aGUgY291bnQgb2YgZWxlbWVudHMgdmlzaXRlZCBhYm92ZSwgYW5kIGFkZGluZyBpdCB0byBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gbWFrZXMgdGhlIGxhdHRlciBub25uZWdhdGl2ZS5cblx0XHRcdG1hdGNoZWRDb3VudCArPSBpO1xuXG5cdFx0XHQvLyBBcHBseSBzZXQgZmlsdGVycyB0byB1bm1hdGNoZWQgZWxlbWVudHNcblx0XHRcdC8vIE5PVEU6IFRoaXMgY2FuIGJlIHNraXBwZWQgaWYgdGhlcmUgYXJlIG5vIHVubWF0Y2hlZCBlbGVtZW50cyAoaS5lLiwgYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIGVxdWFscyBgaWApLCB1bmxlc3Mgd2UgZGlkbid0IHZpc2l0IF9hbnlfIGVsZW1lbnRzIGluIHRoZSBhYm92ZSBsb29wIGJlY2F1c2Ugd2UgaGF2ZVxuXHRcdFx0Ly8gbm8gZWxlbWVudCBtYXRjaGVycyBhbmQgbm8gc2VlZC5cblx0XHRcdC8vIEluY3JlbWVudGluZyBhbiBpbml0aWFsbHktc3RyaW5nIFwiMFwiIGBpYCBhbGxvd3MgYGlgIHRvIHJlbWFpbiBhIHN0cmluZyBvbmx5IGluIHRoYXRcblx0XHRcdC8vIGNhc2UsIHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgXCIwMFwiIGBtYXRjaGVkQ291bnRgIHRoYXQgZGlmZmVycyBmcm9tIGBpYCBidXQgaXMgYWxzb1xuXHRcdFx0Ly8gbnVtZXJpY2FsbHkgemVyby5cblx0XHRcdGlmICggYnlTZXQgJiYgaSAhPT0gbWF0Y2hlZENvdW50ICkge1xuXHRcdFx0XHRqID0gMDtcblx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoZXIgPSBzZXRNYXRjaGVyc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyKCB1bm1hdGNoZWQsIHNldE1hdGNoZWQsIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzZWVkICkge1xuXG5cdFx0XHRcdFx0Ly8gUmVpbnRlZ3JhdGUgZWxlbWVudCBtYXRjaGVzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3Igc29ydGluZ1xuXHRcdFx0XHRcdGlmICggbWF0Y2hlZENvdW50ID4gMCApIHtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICEoIHVubWF0Y2hlZFsgaSBdIHx8IHNldE1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldE1hdGNoZWRbIGkgXSA9IHBvcC5jYWxsKCByZXN1bHRzICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBEaXNjYXJkIGluZGV4IHBsYWNlaG9sZGVyIHZhbHVlcyB0byBnZXQgb25seSBhY3R1YWwgbWF0Y2hlc1xuXHRcdFx0XHRcdHNldE1hdGNoZWQgPSBjb25kZW5zZSggc2V0TWF0Y2hlZCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWRkIG1hdGNoZXMgdG8gcmVzdWx0c1xuXHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBzZXRNYXRjaGVkICk7XG5cblx0XHRcdFx0Ly8gU2VlZGxlc3Mgc2V0IG1hdGNoZXMgc3VjY2VlZGluZyBtdWx0aXBsZSBzdWNjZXNzZnVsIG1hdGNoZXJzIHN0aXB1bGF0ZSBzb3J0aW5nXG5cdFx0XHRcdGlmICggb3V0ZXJtb3N0ICYmICFzZWVkICYmIHNldE1hdGNoZWQubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdCggbWF0Y2hlZENvdW50ICsgc2V0TWF0Y2hlcnMubGVuZ3RoICkgPiAxICkge1xuXG5cdFx0XHRcdFx0U2l6emxlLnVuaXF1ZVNvcnQoIHJlc3VsdHMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBPdmVycmlkZSBtYW5pcHVsYXRpb24gb2YgZ2xvYmFscyBieSBuZXN0ZWQgbWF0Y2hlcnNcblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRkaXJydW5zID0gZGlycnVuc1VuaXF1ZTtcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHRCYWNrdXA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1bm1hdGNoZWQ7XG5cdFx0fTtcblxuXHRyZXR1cm4gYnlTZXQgP1xuXHRcdG1hcmtGdW5jdGlvbiggc3VwZXJNYXRjaGVyICkgOlxuXHRcdHN1cGVyTWF0Y2hlcjtcbn1cblxuY29tcGlsZSA9IFNpenpsZS5jb21waWxlID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBtYXRjaCAvKiBJbnRlcm5hbCBVc2UgT25seSAqLyApIHtcblx0dmFyIGksXG5cdFx0c2V0TWF0Y2hlcnMgPSBbXSxcblx0XHRlbGVtZW50TWF0Y2hlcnMgPSBbXSxcblx0XHRjYWNoZWQgPSBjb21waWxlckNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF07XG5cblx0aWYgKCAhY2FjaGVkICkge1xuXG5cdFx0Ly8gR2VuZXJhdGUgYSBmdW5jdGlvbiBvZiByZWN1cnNpdmUgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY2hlY2sgZWFjaCBlbGVtZW50XG5cdFx0aWYgKCAhbWF0Y2ggKSB7XG5cdFx0XHRtYXRjaCA9IHRva2VuaXplKCBzZWxlY3RvciApO1xuXHRcdH1cblx0XHRpID0gbWF0Y2gubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0Y2FjaGVkID0gbWF0Y2hlckZyb21Ub2tlbnMoIG1hdGNoWyBpIF0gKTtcblx0XHRcdGlmICggY2FjaGVkWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHNldE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIHRoZSBjb21waWxlZCBmdW5jdGlvblxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGUoXG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdG1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyggZWxlbWVudE1hdGNoZXJzLCBzZXRNYXRjaGVycyApXG5cdFx0KTtcblxuXHRcdC8vIFNhdmUgc2VsZWN0b3IgYW5kIHRva2VuaXphdGlvblxuXHRcdGNhY2hlZC5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHR9XG5cdHJldHVybiBjYWNoZWQ7XG59O1xuXG4vKipcbiAqIEEgbG93LWxldmVsIHNlbGVjdGlvbiBmdW5jdGlvbiB0aGF0IHdvcmtzIHdpdGggU2l6emxlJ3MgY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBzZWxlY3RvciBBIHNlbGVjdG9yIG9yIGEgcHJlLWNvbXBpbGVkXG4gKiAgc2VsZWN0b3IgZnVuY3Rpb24gYnVpbHQgd2l0aCBTaXp6bGUuY29tcGlsZVxuICogQHBhcmFtIHtFbGVtZW50fSBjb250ZXh0XG4gKiBAcGFyYW0ge0FycmF5fSBbcmVzdWx0c11cbiAqIEBwYXJhbSB7QXJyYXl9IFtzZWVkXSBBIHNldCBvZiBlbGVtZW50cyB0byBtYXRjaCBhZ2FpbnN0XG4gKi9cbnNlbGVjdCA9IFNpenpsZS5zZWxlY3QgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBpLCB0b2tlbnMsIHRva2VuLCB0eXBlLCBmaW5kLFxuXHRcdGNvbXBpbGVkID0gdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgJiYgc2VsZWN0b3IsXG5cdFx0bWF0Y2ggPSAhc2VlZCAmJiB0b2tlbml6ZSggKCBzZWxlY3RvciA9IGNvbXBpbGVkLnNlbGVjdG9yIHx8IHNlbGVjdG9yICkgKTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBUcnkgdG8gbWluaW1pemUgb3BlcmF0aW9ucyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBzZWxlY3RvciBpbiB0aGUgbGlzdCBhbmQgbm8gc2VlZFxuXHQvLyAodGhlIGxhdHRlciBvZiB3aGljaCBndWFyYW50ZWVzIHVzIGNvbnRleHQpXG5cdGlmICggbWF0Y2gubGVuZ3RoID09PSAxICkge1xuXG5cdFx0Ly8gUmVkdWNlIGNvbnRleHQgaWYgdGhlIGxlYWRpbmcgY29tcG91bmQgc2VsZWN0b3IgaXMgYW4gSURcblx0XHR0b2tlbnMgPSBtYXRjaFsgMCBdID0gbWF0Y2hbIDAgXS5zbGljZSggMCApO1xuXHRcdGlmICggdG9rZW5zLmxlbmd0aCA+IDIgJiYgKCB0b2tlbiA9IHRva2Vuc1sgMCBdICkudHlwZSA9PT0gXCJJRFwiICYmXG5cdFx0XHRjb250ZXh0Lm5vZGVUeXBlID09PSA5ICYmIGRvY3VtZW50SXNIVE1MICYmIEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgMSBdLnR5cGUgXSApIHtcblxuXHRcdFx0Y29udGV4dCA9ICggRXhwci5maW5kWyBcIklEXCIgXSggdG9rZW4ubWF0Y2hlc1sgMCBdXG5cdFx0XHRcdC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLCBjb250ZXh0ICkgfHwgW10gKVsgMCBdO1xuXHRcdFx0aWYgKCAhY29udGV4dCApIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cblx0XHRcdC8vIFByZWNvbXBpbGVkIG1hdGNoZXJzIHdpbGwgc3RpbGwgdmVyaWZ5IGFuY2VzdHJ5LCBzbyBzdGVwIHVwIGEgbGV2ZWxcblx0XHRcdH0gZWxzZSBpZiAoIGNvbXBpbGVkICkge1xuXHRcdFx0XHRjb250ZXh0ID0gY29udGV4dC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnNsaWNlKCB0b2tlbnMuc2hpZnQoKS52YWx1ZS5sZW5ndGggKTtcblx0XHR9XG5cblx0XHQvLyBGZXRjaCBhIHNlZWQgc2V0IGZvciByaWdodC10by1sZWZ0IG1hdGNoaW5nXG5cdFx0aSA9IG1hdGNoRXhwclsgXCJuZWVkc0NvbnRleHRcIiBdLnRlc3QoIHNlbGVjdG9yICkgPyAwIDogdG9rZW5zLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHRva2VuID0gdG9rZW5zWyBpIF07XG5cblx0XHRcdC8vIEFib3J0IGlmIHdlIGhpdCBhIGNvbWJpbmF0b3Jcblx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgKCB0eXBlID0gdG9rZW4udHlwZSApIF0gKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCAoIGZpbmQgPSBFeHByLmZpbmRbIHR5cGUgXSApICkge1xuXG5cdFx0XHRcdC8vIFNlYXJjaCwgZXhwYW5kaW5nIGNvbnRleHQgZm9yIGxlYWRpbmcgc2libGluZyBjb21iaW5hdG9yc1xuXHRcdFx0XHRpZiAoICggc2VlZCA9IGZpbmQoXG5cdFx0XHRcdFx0dG9rZW4ubWF0Y2hlc1sgMCBdLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICksXG5cdFx0XHRcdFx0cnNpYmxpbmcudGVzdCggdG9rZW5zWyAwIF0udHlwZSApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fFxuXHRcdFx0XHRcdFx0Y29udGV4dFxuXHRcdFx0XHQpICkgKSB7XG5cblx0XHRcdFx0XHQvLyBJZiBzZWVkIGlzIGVtcHR5IG9yIG5vIHRva2VucyByZW1haW4sIHdlIGNhbiByZXR1cm4gZWFybHlcblx0XHRcdFx0XHR0b2tlbnMuc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWVkLmxlbmd0aCAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKTtcblx0XHRcdFx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ29tcGlsZSBhbmQgZXhlY3V0ZSBhIGZpbHRlcmluZyBmdW5jdGlvbiBpZiBvbmUgaXMgbm90IHByb3ZpZGVkXG5cdC8vIFByb3ZpZGUgYG1hdGNoYCB0byBhdm9pZCByZXRva2VuaXphdGlvbiBpZiB3ZSBtb2RpZmllZCB0aGUgc2VsZWN0b3IgYWJvdmVcblx0KCBjb21waWxlZCB8fCBjb21waWxlKCBzZWxlY3RvciwgbWF0Y2ggKSApKFxuXHRcdHNlZWQsXG5cdFx0Y29udGV4dCxcblx0XHQhZG9jdW1lbnRJc0hUTUwsXG5cdFx0cmVzdWx0cyxcblx0XHQhY29udGV4dCB8fCByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fCBjb250ZXh0XG5cdCk7XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gT25lLXRpbWUgYXNzaWdubWVudHNcblxuLy8gU29ydCBzdGFiaWxpdHlcbnN1cHBvcnQuc29ydFN0YWJsZSA9IGV4cGFuZG8uc3BsaXQoIFwiXCIgKS5zb3J0KCBzb3J0T3JkZXIgKS5qb2luKCBcIlwiICkgPT09IGV4cGFuZG87XG5cbi8vIFN1cHBvcnQ6IENocm9tZSAxNC0zNStcbi8vIEFsd2F5cyBhc3N1bWUgZHVwbGljYXRlcyBpZiB0aGV5IGFyZW4ndCBwYXNzZWQgdG8gdGhlIGNvbXBhcmlzb24gZnVuY3Rpb25cbnN1cHBvcnQuZGV0ZWN0RHVwbGljYXRlcyA9ICEhaGFzRHVwbGljYXRlO1xuXG4vLyBJbml0aWFsaXplIGFnYWluc3QgdGhlIGRlZmF1bHQgZG9jdW1lbnRcbnNldERvY3VtZW50KCk7XG5cbi8vIFN1cHBvcnQ6IFdlYmtpdDw1MzcuMzIgLSBTYWZhcmkgNi4wLjMvQ2hyb21lIDI1IChmaXhlZCBpbiBDaHJvbWUgMjcpXG4vLyBEZXRhY2hlZCBub2RlcyBjb25mb3VuZGluZ2x5IGZvbGxvdyAqZWFjaCBvdGhlcipcbnN1cHBvcnQuc29ydERldGFjaGVkID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0Ly8gU2hvdWxkIHJldHVybiAxLCBidXQgcmV0dXJucyA0IChmb2xsb3dpbmcpXG5cdHJldHVybiBlbC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJmaWVsZHNldFwiICkgKSAmIDE7XG59ICk7XG5cbi8vIFN1cHBvcnQ6IElFPDhcbi8vIFByZXZlbnQgYXR0cmlidXRlL3Byb3BlcnR5IFwiaW50ZXJwb2xhdGlvblwiXG4vLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM2NDI5JTI4VlMuODUlMjkuYXNweFxuaWYgKCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdGVsLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nIyc+PC9hPlwiO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwiaHJlZlwiICkgPT09IFwiI1wiO1xufSApICkge1xuXHRhZGRIYW5kbGUoIFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0eXBlXCIgPyAxIDogMiApO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBTdXBwb3J0OiBJRTw5XG4vLyBVc2UgZGVmYXVsdFZhbHVlIGluIHBsYWNlIG9mIGdldEF0dHJpYnV0ZShcInZhbHVlXCIpXG5pZiAoICFzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRlbC5pbm5lckhUTUwgPSBcIjxpbnB1dC8+XCI7XG5cdGVsLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIFwiXCIgKTtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCBcInZhbHVlXCIgKSA9PT0gXCJcIjtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBcInZhbHVlXCIsIGZ1bmN0aW9uKCBlbGVtLCBfbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kZWZhdWx0VmFsdWU7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBnZXRBdHRyaWJ1dGVOb2RlIHRvIGZldGNoIGJvb2xlYW5zIHdoZW4gZ2V0QXR0cmlidXRlIGxpZXNcbmlmICggIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRyZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCBcImRpc2FibGVkXCIgKSA9PSBudWxsO1xufSApICkge1xuXHRhZGRIYW5kbGUoIGJvb2xlYW5zLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0dmFyIHZhbDtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF0gPT09IHRydWUgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHQoIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApICkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0XHRudWxsO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBFWFBPU0VcbnZhciBfc2l6emxlID0gd2luZG93LlNpenpsZTtcblxuU2l6emxlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB3aW5kb3cuU2l6emxlID09PSBTaXp6bGUgKSB7XG5cdFx0d2luZG93LlNpenpsZSA9IF9zaXp6bGU7XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlO1xufTtcblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcblx0ZGVmaW5lKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2l6emxlO1xuXHR9ICk7XG5cbi8vIFNpenpsZSByZXF1aXJlcyB0aGF0IHRoZXJlIGJlIGEgZ2xvYmFsIHdpbmRvdyBpbiBDb21tb24tSlMgbGlrZSBlbnZpcm9ubWVudHNcbn0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gU2l6emxlO1xufSBlbHNlIHtcblx0d2luZG93LlNpenpsZSA9IFNpenpsZTtcbn1cblxuLy8gRVhQT1NFXG5cbn0gKSggd2luZG93ICk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsImV4cG9ydCB7IGRlZmF1bHQgYXMgc2VsZWN0LCBnZXRTaW5nbGVTZWxlY3RvciwgZ2V0TXVsdGlTZWxlY3RvciB9IGZyb20gJy4vc2VsZWN0J1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBtYXRjaCB9IGZyb20gJy4vbWF0Y2gnXG5leHBvcnQgeyBkZWZhdWx0IGFzIG9wdGltaXplIH0gZnJvbSAnLi9vcHRpbWl6ZSdcbmV4cG9ydCAqIGFzIGNvbW1vbiBmcm9tICcuL2NvbW1vbidcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=