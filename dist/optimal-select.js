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
 * Query document using correct selector
 *
 * @param  {Object}               options - [description]
 * @return {(selector: string, parent: HTMLElement) => Array.<HTMLElements>} - [description]
 */
function getSelect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.format === 'jquery') {
    var Sizzle = __webpack_require__(6);
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
 * @param  {Array.<HTMLElements>} elements - [description]
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
exports.default = optimize;

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _common = __webpack_require__(0);

var _utilities = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply different optimization techniques
 *
 * @param  {string}                          selector - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element  - [description]
 * @param  {Object}                          options  - [description]
 * @return {string}                                   - [description]
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
  path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', elements, select);

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

  // can't optimize jquery expression
  if (/:contains\(/.test(current)) {
    return current;
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
/* 3 */
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
 * Modify the context based on the environment
 *
 * @param  {HTMLELement} element - [description]
 * @param  {Object}      options - [description]
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
 * @param  {HTMLELement} node     - [description]
 * @param  {HTMLELement} root     - [description]
 * @param  {Function}    validate - [description]
 * @return {HTMLELement}          - [description]
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
/* 4 */
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

var _css2xpath = __webpack_require__(5);

var _css2xpath2 = _interopRequireDefault(_css2xpath);

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _match = __webpack_require__(7);

var _match2 = _interopRequireDefault(_match);

var _optimize = __webpack_require__(2);

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = __webpack_require__(1);

var _common = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get a selector for the provided element
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Object}      options - [description]
 * @return {string}              - [description]
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
 * @param  {Array.<HTMLElement>|NodeList} elements - [description]
 * @param  {Object}                       options  - [description]
 * @return {string}                                - [description]
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
 * @param  {Array.<HTMLElements>} elements - [description]
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
 * @param  {HTMLElement|NodeList|Array.<HTMLElement>} input   - [description]
 * @param  {Object}                                   options - [description]
 * @return {string}                                           - [description]
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
/* 5 */
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
/* 6 */
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
/* 7 */
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

var defaultIgnore = {
  attribute: function attribute(attributeName) {
    return ['style', 'data-reactid', 'data-react-checksum'].indexOf(attributeName) > -1;
  }
};

/**
 * Get the path of the element
 *
 * @param  {HTMLElement} node    - [description]
 * @param  {Object}      options - [description]
 * @return {string}              - [description]
 */
function match(node, options) {
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
 * @return {boolean}                 - [description]
 */
function checkContains(priority, element, ignore, path, select) {
  var elementPattern = findPattern(priority, element, ignore, select);
  var text = element.textContent.trim();
  if (text.length > 0 && text.indexOf('\n') < 0) {
    var parent = element.parentNode;
    var children = parent.childTags || parent.children;
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      if (child !== element) {
        if (child.textContent.indexOf(text) > 0) {
          return false;
        }
      }
    }
    var pattern = elementPattern + ':contains("' + text + '")';
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.common = exports.optimize = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

var _select = __webpack_require__(4);

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

var _optimize = __webpack_require__(2);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwYWM3MGFlZjhkYzA4OWY5ZWYzYiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL34vY3NzMnhwYXRoL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vc2l6emxlL2Rpc3Qvc2l6emxlLmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiZ2V0U2VsZWN0IiwiZ2V0Q29tbW9uQW5jZXN0b3IiLCJnZXRDb21tb25Qcm9wZXJ0aWVzIiwib3B0aW9ucyIsImZvcm1hdCIsIlNpenpsZSIsInJlcXVpcmUiLCJzZWxlY3RvciIsInBhcmVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImVsZW1lbnRzIiwicm9vdCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJsZW5ndGgiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwiaSIsIm1pc3NpbmciLCJzb21lIiwib3RoZXJQYXJlbnRzIiwib3RoZXJQYXJlbnQiLCJsIiwiY29tbW9uUHJvcGVydGllcyIsImNsYXNzZXMiLCJhdHRyaWJ1dGVzIiwidGFnIiwiY29tbW9uQ2xhc3NlcyIsImNvbW1vbkF0dHJpYnV0ZXMiLCJjb21tb25UYWciLCJ1bmRlZmluZWQiLCJnZXRBdHRyaWJ1dGUiLCJ0cmltIiwic3BsaXQiLCJmaWx0ZXIiLCJlbnRyeSIsIm5hbWUiLCJlbGVtZW50QXR0cmlidXRlcyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJrZXkiLCJhdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwidmFsdWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnZlcnROb2RlTGlzdCIsImVzY2FwZVZhbHVlIiwibm9kZXMiLCJhcnIiLCJBcnJheSIsInJlcGxhY2UiLCJvcHRpbWl6ZSIsInN0YXJ0c1dpdGgiLCJpc0FycmF5Iiwibm9kZVR5cGUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwic2VsZWN0IiwicGF0aCIsIm1hdGNoIiwib3B0aW1pemVQYXJ0Iiwic2hvcnRlbmVkIiwicG9wIiwiY3VycmVudCIsInByZVBhcnQiLCJqb2luIiwicG9zdFBhcnQiLCJwYXR0ZXJuIiwibWF0Y2hlcyIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsInNsaWNlIiwidGVzdCIsImNvbXBhcmVSZXN1bHRzIiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImNvbnRhaW5zIiwiZGVzY3JpcHRpb24iLCJwYXR0ZXJuMiIsIm1hdGNoZXMyIiwiZGVzY2VuZGFudCIsInBhdHRlcm4zIiwibWF0Y2hlczMiLCJ0eXBlIiwicGF0dGVybjQiLCJtYXRjaGVzNCIsIm5hbWVzIiwibWFwIiwicGFydGlhbCIsInBhdHRlcm41IiwiY2hhckF0IiwibWF0Y2hlczUiLCJpMiIsInBhdHRlcm42IiwibWF0Y2hlczYiLCJsMiIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImNoaWxkcmVuIiwibm9kZSIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImNoaWxkVGFncyIsInB1c2giLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsImNsYXNzIiwiaW5kZXhPZiIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJwc2V1ZG8iLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJjaGVja1RhZyIsInJ1bGUiLCJraW5kIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVBzZXVkbyIsImNvbXBhcmVTZXQiLCJub2RlSW5kZXgiLCJmaW5kSW5kZXgiLCJjaGlsZCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsIm9wdGltaXplZCIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJjb25zb2xlIiwid2FybiIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJyZXN1bHQiLCJpbmNsdWRlcyIsInhwYXRoX3RvX2xvd2VyIiwicyIsInhwYXRoX2VuZHNfd2l0aCIsInMxIiwiczIiLCJ4cGF0aF91cmwiLCJ4cGF0aF91cmxfYXR0cnMiLCJ4cGF0aF91cmxfcGF0aCIsInhwYXRoX3VybF9kb21haW4iLCJ4cGF0aF9sb3dlcl9jYXNlIiwieHBhdGhfbnNfdXJpIiwieHBhdGhfbnNfcGF0aCIsInhwYXRoX2hhc19wcm90b2NhbCIsInhwYXRoX2lzX2ludGVybmFsIiwieHBhdGhfaXNfbG9jYWwiLCJ4cGF0aF9pc19wYXRoIiwieHBhdGhfaXNfbG9jYWxfcGF0aCIsInhwYXRoX25vcm1hbGl6ZV9zcGFjZSIsInhwYXRoX2ludGVybmFsIiwieHBhdGhfZXh0ZXJuYWwiLCJlc2NhcGVfbGl0ZXJhbCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImVzY2FwZV9wYXJlbnMiLCJyZWdleF9zdHJpbmdfbGl0ZXJhbCIsInJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCIsInJlZ2V4X2Nzc193cmFwX3BzZXVkbyIsInJlZ2V4X3NwZWNhbF9jaGFycyIsInJlZ2V4X2ZpcnN0X2F4aXMiLCJyZWdleF9maWx0ZXJfcHJlZml4IiwicmVnZXhfYXR0cl9wcmVmaXgiLCJyZWdleF9udGhfZXF1YXRpb24iLCJjc3NfY29tYmluYXRvcnNfcmVnZXgiLCJjc3NfY29tYmluYXRvcnNfY2FsbGJhY2siLCJvcGVyYXRvciIsImF4aXMiLCJmdW5jIiwibGl0ZXJhbCIsImV4Y2x1ZGUiLCJvZmZzZXQiLCJvcmlnIiwicHJlZml4IiwiaXNOdW1lcmljIiwicHJldkNoYXIiLCJjc3NfYXR0cmlidXRlc19yZWdleCIsImNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrIiwic3RyIiwiYXR0ciIsImNvbXAiLCJvcCIsInZhbCIsInNlYXJjaCIsImNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCIsImNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayIsImcxIiwiZzIiLCJhcmciLCJnMyIsImc0IiwiZzUiLCJjc3MyeHBhdGgiLCJhIiwieHBhdGgiLCJwcmVwZW5kQXhpcyIsImNzc19pZHNfY2xhc3Nlc19yZWdleCIsImNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayIsInN0YXJ0Iiwic2VsZWN0b3JTdGFydCIsImRlcHRoIiwibnVtIiwiaXNOYU4iLCJlc2NhcGVDaGFyIiwib3BlbiIsImNsb3NlIiwiY2hhciIsIlJlZ0V4cCIsInJlcGVhdCIsIk51bWJlciIsImNvbnZlcnRFc2NhcGluZyIsIm5lc3RlZCIsImxpdGVyYWxzIiwic3Vic3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIndpbmRvdyIsInN1cHBvcnQiLCJFeHByIiwiZ2V0VGV4dCIsImlzWE1MIiwidG9rZW5pemUiLCJjb21waWxlIiwib3V0ZXJtb3N0Q29udGV4dCIsInNvcnRJbnB1dCIsImhhc0R1cGxpY2F0ZSIsInNldERvY3VtZW50IiwiZG9jRWxlbSIsImRvY3VtZW50SXNIVE1MIiwicmJ1Z2d5UVNBIiwicmJ1Z2d5TWF0Y2hlcyIsImV4cGFuZG8iLCJEYXRlIiwicHJlZmVycmVkRG9jIiwiZGlycnVucyIsImNsYXNzQ2FjaGUiLCJjcmVhdGVDYWNoZSIsInRva2VuQ2FjaGUiLCJjb21waWxlckNhY2hlIiwibm9ubmF0aXZlU2VsZWN0b3JDYWNoZSIsInNvcnRPcmRlciIsImIiLCJoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsInB1c2hOYXRpdmUiLCJsaXN0IiwiZWxlbSIsImxlbiIsImJvb2xlYW5zIiwid2hpdGVzcGFjZSIsImlkZW50aWZpZXIiLCJwc2V1ZG9zIiwicndoaXRlc3BhY2UiLCJydHJpbSIsInJjb21tYSIsInJjb21iaW5hdG9ycyIsInJkZXNjZW5kIiwicnBzZXVkbyIsInJpZGVudGlmaWVyIiwibWF0Y2hFeHByIiwicmh0bWwiLCJyaW5wdXRzIiwicmhlYWRlciIsInJuYXRpdmUiLCJycXVpY2tFeHByIiwicnNpYmxpbmciLCJydW5lc2NhcGUiLCJmdW5lc2NhcGUiLCJlc2NhcGUiLCJub25IZXgiLCJoaWdoIiwicmNzc2VzY2FwZSIsImZjc3Nlc2NhcGUiLCJjaCIsImFzQ29kZVBvaW50IiwiY2hhckNvZGVBdCIsInRvU3RyaW5nIiwidW5sb2FkSGFuZGxlciIsImluRGlzYWJsZWRGaWVsZHNldCIsImFkZENvbWJpbmF0b3IiLCJkaXNhYmxlZCIsIm5vZGVOYW1lIiwiZGlyIiwiYXBwbHkiLCJjYWxsIiwiY2hpbGROb2RlcyIsImUiLCJ0YXJnZXQiLCJlbHMiLCJqIiwicmVzdWx0cyIsInNlZWQiLCJtIiwibmlkIiwiZ3JvdXBzIiwibmV3U2VsZWN0b3IiLCJuZXdDb250ZXh0Iiwib3duZXJEb2N1bWVudCIsImV4ZWMiLCJnZXRFbGVtZW50QnlJZCIsInFzYSIsInRlc3RDb250ZXh0Iiwic2NvcGUiLCJzZXRBdHRyaWJ1dGUiLCJ0b1NlbGVjdG9yIiwicXNhRXJyb3IiLCJyZW1vdmVBdHRyaWJ1dGUiLCJjYWNoZSIsImNhY2hlTGVuZ3RoIiwibWFya0Z1bmN0aW9uIiwiZm4iLCJhc3NlcnQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEhhbmRsZSIsImF0dHJzIiwiYXR0ckhhbmRsZSIsInNpYmxpbmdDaGVjayIsImN1ciIsImRpZmYiLCJzb3VyY2VJbmRleCIsIm5leHRTaWJsaW5nIiwiY3JlYXRlSW5wdXRQc2V1ZG8iLCJjcmVhdGVCdXR0b25Qc2V1ZG8iLCJjcmVhdGVEaXNhYmxlZFBzZXVkbyIsImlzRGlzYWJsZWQiLCJjcmVhdGVQb3NpdGlvbmFsUHNldWRvIiwiYXJndW1lbnQiLCJtYXRjaEluZGV4ZXMiLCJuYW1lc3BhY2UiLCJuYW1lc3BhY2VVUkkiLCJkb2N1bWVudEVsZW1lbnQiLCJoYXNDb21wYXJlIiwic3ViV2luZG93IiwiZG9jIiwiZGVmYXVsdFZpZXciLCJ0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZUNvbW1lbnQiLCJnZXRCeUlkIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJhdHRySWQiLCJmaW5kIiwiZ2V0QXR0cmlidXRlTm9kZSIsImVsZW1zIiwidG1wIiwiaW5uZXJIVE1MIiwibWF0Y2hlc1NlbGVjdG9yIiwid2Via2l0TWF0Y2hlc1NlbGVjdG9yIiwibW96TWF0Y2hlc1NlbGVjdG9yIiwib01hdGNoZXNTZWxlY3RvciIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwiZGlzY29ubmVjdGVkTWF0Y2giLCJjb21wYXJlRG9jdW1lbnRQb3NpdGlvbiIsImFkb3duIiwiYnVwIiwiY29tcGFyZSIsInNvcnREZXRhY2hlZCIsImF1cCIsImFwIiwiYnAiLCJleHByIiwicmV0Iiwic3BlY2lmaWVkIiwic2VsIiwiZXJyb3IiLCJtc2ciLCJ1bmlxdWVTb3J0IiwiZHVwbGljYXRlcyIsImRldGVjdER1cGxpY2F0ZXMiLCJzb3J0U3RhYmxlIiwic3BsaWNlIiwidGV4dENvbnRlbnQiLCJmaXJzdENoaWxkIiwibm9kZVZhbHVlIiwiY3JlYXRlUHNldWRvIiwicmVsYXRpdmUiLCJmaXJzdCIsInByZUZpbHRlciIsImV4Y2VzcyIsInVucXVvdGVkIiwibm9kZU5hbWVTZWxlY3RvciIsImNoZWNrIiwid2hhdCIsIl9hcmd1bWVudCIsImxhc3QiLCJzaW1wbGUiLCJmb3J3YXJkIiwib2ZUeXBlIiwiX2NvbnRleHQiLCJ4bWwiLCJ1bmlxdWVDYWNoZSIsIm91dGVyQ2FjaGUiLCJ1c2VDYWNoZSIsImxhc3RDaGlsZCIsInVuaXF1ZUlEIiwiYXJncyIsInNldEZpbHRlcnMiLCJpZHgiLCJtYXRjaGVkIiwibWF0Y2hlciIsInVubWF0Y2hlZCIsInRleHQiLCJsYW5nIiwiZWxlbUxhbmciLCJoYXNoIiwibG9jYXRpb24iLCJhY3RpdmVFbGVtZW50IiwiaGFzRm9jdXMiLCJocmVmIiwidGFiSW5kZXgiLCJjaGVja2VkIiwic2VsZWN0ZWQiLCJzZWxlY3RlZEluZGV4IiwiX21hdGNoSW5kZXhlcyIsInJhZGlvIiwiY2hlY2tib3giLCJmaWxlIiwicGFzc3dvcmQiLCJpbWFnZSIsInN1Ym1pdCIsInJlc2V0IiwicHJvdG90eXBlIiwiZmlsdGVycyIsInBhcnNlT25seSIsInRva2VucyIsInNvRmFyIiwicHJlRmlsdGVycyIsImNhY2hlZCIsImNvbWJpbmF0b3IiLCJiYXNlIiwic2tpcCIsImNoZWNrTm9uRWxlbWVudHMiLCJkb25lTmFtZSIsIm9sZENhY2hlIiwibmV3Q2FjaGUiLCJlbGVtZW50TWF0Y2hlciIsIm1hdGNoZXJzIiwibXVsdGlwbGVDb250ZXh0cyIsImNvbnRleHRzIiwiY29uZGVuc2UiLCJuZXdVbm1hdGNoZWQiLCJtYXBwZWQiLCJzZXRNYXRjaGVyIiwicG9zdEZpbHRlciIsInBvc3RGaW5kZXIiLCJwb3N0U2VsZWN0b3IiLCJ0ZW1wIiwicHJlTWFwIiwicG9zdE1hcCIsInByZWV4aXN0aW5nIiwibWF0Y2hlckluIiwibWF0Y2hlck91dCIsIm1hdGNoZXJGcm9tVG9rZW5zIiwiY2hlY2tDb250ZXh0IiwibGVhZGluZ1JlbGF0aXZlIiwiaW1wbGljaXRSZWxhdGl2ZSIsIm1hdGNoQ29udGV4dCIsIm1hdGNoQW55Q29udGV4dCIsImNvbmNhdCIsIm1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyIsImVsZW1lbnRNYXRjaGVycyIsInNldE1hdGNoZXJzIiwiYnlTZXQiLCJieUVsZW1lbnQiLCJzdXBlck1hdGNoZXIiLCJvdXRlcm1vc3QiLCJtYXRjaGVkQ291bnQiLCJzZXRNYXRjaGVkIiwiY29udGV4dEJhY2t1cCIsImRpcnJ1bnNVbmlxdWUiLCJNYXRoIiwicmFuZG9tIiwidG9rZW4iLCJjb21waWxlZCIsIl9uYW1lIiwiZGVmYXVsdFZhbHVlIiwiX3NpenpsZSIsIm5vQ29uZmxpY3QiLCJkZWZpbmUiLCJkZWZhdWx0SWdub3JlIiwicHJpb3JpdHkiLCJpZ25vcmUiLCJqcXVlcnkiLCJza2lwQ29tcGFyZSIsInNraXBDaGVja3MiLCJwcmVkaWNhdGUiLCJjaGVja0F0dHJpYnV0ZXMiLCJjaGVja0NvbnRhaW5zIiwiY2hlY2tDaGlsZHMiLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsImdldENsYXNzU2VsZWN0b3IiLCJjIiwiciIsImF0dHJpYnV0ZU5hbWVzIiwic29ydGVkS2V5cyIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkUGF0dGVybiIsImVsZW1lbnRQYXR0ZXJuIiwiZGVmYXVsdFByZWRpY2F0ZSIsImRlZmF1bHQiLCJjb21tb24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztRQ25EZ0JBLFMsR0FBQUEsUztRQW1CQUMsaUIsR0FBQUEsaUI7UUE4Q0FDLG1CLEdBQUFBLG1CO0FBOUVoQjs7Ozs7O0FBT0E7Ozs7OztBQU1PLFNBQVNGLFNBQVQsR0FBa0M7QUFBQSxNQUFkRyxPQUFjLHVFQUFKLEVBQUk7O0FBQ3ZDLE1BQUlBLFFBQVFDLE1BQVIsS0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsUUFBTUMsU0FBUyxtQkFBQUMsQ0FBUSxDQUFSLENBQWY7QUFDQSxXQUFPLFVBQVVDLFFBQVYsRUFBbUM7QUFBQSxVQUFmQyxNQUFlLHVFQUFOLElBQU07O0FBQ3hDLGFBQU9ILE9BQU9FLFFB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QlQsUUFBdEIsRUFBZ0NoaEIsT0FBaEMsRUFBeUNpaEIsTUFBekMsRUFBaUR4ZCxNQUFqRCxFQUF5RDtBQUN2RCxNQUFJVSxVQUFVdWQsc0JBQXNCVixRQUF0QixFQUFnQ2hoQixPQUFoQyxFQUF5Q2loQixNQUF6QyxFQUFpRHhkLE1BQWpELENBQWQ7QUFDQSxNQUFJLENBQUNVLE9BQUwsRUFBYztBQUNaQSxjQUFVbWUsZUFBZXRpQixPQUFmLEVBQXdCaWhCLE1BQXhCLENBQVY7QUFDRDtBQUNELFNBQU85YyxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVNBLFNBQVNnZSxXQUFULENBQXNCZCxTQUF0QixFQUFpQ3RmLElBQWpDLEVBQXVDUSxLQUF2QyxFQUE4Q2tnQixnQkFBOUMsRUFBZ0U7QUFDOUQsTUFBSSxDQUFDbGdCLEtBQUwsRUFBWTtBQUNWLFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBTXNZLFFBQVF3RyxhQUFhb0IsZ0JBQTNCO0FBQ0EsTUFBSSxDQUFDNUgsS0FBTCxFQUFZO0FBQ1YsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPQSxNQUFNOVksSUFBTixFQUFZUSxLQUFaLEVBQW1Ca2dCLGdCQUFuQixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJDQ2xXUUMsTzs7Ozs7O21CQUFtQjVZLGlCOzs7Ozs7bUJBQW1CQyxnQjs7Ozs7Ozs7OzZDQUN0QzJZLE87Ozs7Ozs7Ozs7OztRQUNHQyxNIiwiZmlsZSI6Im9wdGltYWwtc2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDBhYzcwYWVmOGRjMDg5ZjllZjNiIiwiLyoqXG4gKiAjIENvbW1vblxuICpcbiAqIFByb2Nlc3MgY29sbGVjdGlvbnMgZm9yIHNpbWlsYXJpdGllcy5cbiAqL1xuXG5cbi8qKlxuICogUXVlcnkgZG9jdW1lbnQgdXNpbmcgY29ycmVjdCBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudDogSFRNTEVsZW1lbnQpID0+IEFycmF5LjxIVE1MRWxlbWVudHM+fSAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlbGVjdCAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLmZvcm1hdCA9PT0gJ2pxdWVyeScpIHtcbiAgICBjb25zdCBTaXp6bGUgPSByZXF1aXJlKCdzaXp6bGUnKVxuICAgIHJldHVybiBmdW5jdGlvbiAoc2VsZWN0b3IsIHBhcmVudCA9IG51bGwpIHtcbiAgICAgIHJldHVybiBTaXp6bGUoc2VsZWN0b3IsIHBhcmVudCB8fCBkb2N1bWVudClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChzZWxlY3RvciwgcGFyZW50ID0gbnVsbCkge1xuICAgIHJldHVybiAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKVxuICB9IFxufVxuXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25BbmNlc3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25Qcm9wZXJ0aWVzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSB7XG4gICAgY2xhc3NlczogW10sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgdGFnOiBudWxsXG4gIH1cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICB2YXIge1xuICAgICAgY2xhc3NlczogY29tbW9uQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXM6IGNvbW1vbkF0dHJpYnV0ZXMsXG4gICAgICB0YWc6IGNvbW1vblRhZ1xuICAgIH0gPSBjb21tb25Qcm9wZXJ0aWVzXG5cbiAgICAvLyB+IGNsYXNzZXNcbiAgICBpZiAoY29tbW9uQ2xhc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgICBpZiAoIWNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkNsYXNzZXMgPSBjb21tb25DbGFzc2VzLmZpbHRlcigoZW50cnkpID0+IGNsYXNzZXMuc29tZSgobmFtZSkgPT4gbmFtZSA9PT0gZW50cnkpKVxuICAgICAgICAgIGlmIChjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY29tbW9uQ2xhc3Nlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiByZXN0cnVjdHVyZSByZW1vdmFsIGFzIDJ4IHNldCAvIDJ4IGRlbGV0ZSwgaW5zdGVhZCBvZiBtb2RpZnkgYWx3YXlzIHJlcGxhY2luZyB3aXRoIG5ldyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IGF0dHJpYnV0ZXNcbiAgICBpZiAoY29tbW9uQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBlbGVtZW50QXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGVsZW1lbnRBdHRyaWJ1dGVzKS5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlc1trZXldXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgICAgICAvLyBOT1RFOiB3b3JrYXJvdW5kIGRldGVjdGlvbiBmb3Igbm9uLXN0YW5kYXJkIHBoYW50b21qcyBOYW1lZE5vZGVNYXAgYmVoYXZpb3VyXG4gICAgICAgIC8vIChpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTQ2MzQpXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGUudmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfSwge30pXG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICBjb25zdCBjb21tb25BdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKVxuXG4gICAgICBpZiAoYXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIWNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKG5leHRDb21tb25BdHRyaWJ1dGVzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbW1vbkF0dHJpYnV0ZXNbbmFtZV1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gYXR0cmlidXRlc1tuYW1lXSkge1xuICAgICAgICAgICAgICBuZXh0Q29tbW9uQXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dENvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IHRhZ1xuICAgIGlmIChjb21tb25UYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICghY29tbW9uVGFnKSB7XG4gICAgICAgIGNvbW1vblByb3BlcnRpZXMudGFnID0gdGFnXG4gICAgICB9IGVsc2UgaWYgKHRhZyAhPT0gY29tbW9uVGFnKSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLnRhZ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gY29tbW9uUHJvcGVydGllc1xufVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tbW9uLmpzIiwiLyoqXG4gKiAjIFV0aWxpdGllc1xuICpcbiAqIENvbnZlbmllbmNlIGhlbHBlcnMuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGUgYW4gYXJyYXkgd2l0aCB0aGUgRE9NIG5vZGVzIG9mIHRoZSBsaXN0XG4gKlxuICogQHBhcmFtICB7Tm9kZUxpc3R9ICAgICAgICAgICAgIG5vZGVzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29udmVydE5vZGVMaXN0IChub2Rlcykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbm9kZXNcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFycltpXSA9IG5vZGVzW2ldXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG4vKipcbiAqIEVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIGxpbmUgYnJlYWtzIGFzIGEgc2ltcGxpZmllZCB2ZXJzaW9uIG9mICdDU1MuZXNjYXBlKCknXG4gKlxuICogRGVzY3JpcHRpb24gb2YgdmFsaWQgY2hhcmFjdGVyczogaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2Nzcy1lc2NhcGVzXG4gKlxuICogQHBhcmFtICB7U3RyaW5nP30gdmFsdWUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVZhbHVlICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvWydcImBcXFxcLzo/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL1xcbi9nLCAnXFx1MDBhMCcpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIE9wdGltaXplXG4gKlxuICogMS4pIEltcHJvdmUgZWZmaWNpZW5jeSB0aHJvdWdoIHNob3J0ZXIgc2VsZWN0b3JzIGJ5IHJlbW92aW5nIHJlZHVuZGFuY3lcbiAqIDIuKSBJbXByb3ZlIHJvYnVzdG5lc3MgdGhyb3VnaCBzZWxlY3RvciB0cmFuc2Zvcm1hdGlvblxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3B0aW1pemUgKHNlbGVjdG9yLCBlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKHNlbGVjdG9yLnN0YXJ0c1dpdGgoJz4gJykpIHtcbiAgICBzZWxlY3RvciA9IHNlbGVjdG9yLnJlcGxhY2UoJz4gJywgJycpXG4gIH1cblxuICAvLyBjb252ZXJ0IHNpbmdsZSBlbnRyeSBhbmQgTm9kZUxpc3RcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gIWVsZW1lbnRzLmxlbmd0aCA/IFtlbGVtZW50c10gOiBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoIWVsZW1lbnRzLmxlbmd0aCB8fCBlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIHRvIGNvbXBhcmUgSFRNTEVsZW1lbnRzIGl0cyBuZWNlc3NhcnkgdG8gcHJvdmlkZSBhIHJlZmVyZW5jZSBvZiB0aGUgc2VsZWN0ZWQgbm9kZShzKSEgKG1pc3NpbmcgXCJlbGVtZW50c1wiKScpXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICAvLyBjaHVuayBwYXJ0cyBvdXRzaWRlIG9mIHF1b3RlcyAoaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU2NjM3MjksIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xNjI2MTY5MylcbiAgLy8gdmFyIHBhdGggPSBzZWxlY3Rvci5yZXBsYWNlKC8+IC9nLCAnPicpLnNwbGl0KC9cXHMrKD89KD86KD86W15cIl0qXCIpezJ9KSpbXlwiXSokKS8pXG4gIHZhciBwYXRoID0gc2VsZWN0b3IucmVwbGFjZSgvPiAvZywgJz4nKS5tYXRjaCgvKD86W15cXHNcIl0rfFwiW15cIl0qXCIpKy9nKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gb3B0aW1pemVQYXJ0KCcnLCBzZWxlY3RvciwgJycsIGVsZW1lbnRzLCBzZWxlY3QpXG4gIH1cblxuICBjb25zdCBzaG9ydGVuZWQgPSBbcGF0aC5wb3AoKV1cbiAgd2hpbGUgKHBhdGgubGVuZ3RoID4gMSkgIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aC5wb3AoKVxuICAgIGNvbnN0IHByZVBhcnQgPSBwYXRoLmpvaW4oJyAnKVxuICAgIGNvbnN0IHBvc3RQYXJ0ID0gc2hvcnRlbmVkLmpvaW4oJyAnKVxuXG4gICAgY29uc3QgcGF0dGVybiA9IGAke3ByZVBhcnR9ICR7cG9zdFBhcnR9YFxuICAgIGNvbnN0IG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybilcbiAgICBjb25zdCBoYXNTYW1lUmVzdWx0ID0gbWF0Y2hlcy5sZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCwgaSkgPT4gZWxlbWVudCA9PT0gbWF0Y2hlc1tpXSlcbiAgICBpZiAoIWhhc1NhbWVSZXN1bHQpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMsIHNlbGVjdCkpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLmpvaW4oJyAnKSwgZWxlbWVudHMsIHNlbGVjdClcbiAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50cywgc2VsZWN0KVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKS5yZXBsYWNlKC8+L2csICc+ICcpLnRyaW0oKVxufVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgICAgICAgIHNlbGVjdCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplUGFydCAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzLCBzZWxlY3QpIHtcbiAgaWYgKHByZVBhcnQubGVuZ3RoKSBwcmVQYXJ0ID0gYCR7cHJlUGFydH0gYFxuICBpZiAocG9zdFBhcnQubGVuZ3RoKSBwb3N0UGFydCA9IGAgJHtwb3N0UGFydH1gXG5cbiAgLy8gY2FuJ3Qgb3B0aW1pemUganF1ZXJ5IGV4cHJlc3Npb25cbiAgaWYgKC86Y29udGFpbnNcXCgvLnRlc3QoY3VycmVudCkpIHtcbiAgICByZXR1cm4gY3VycmVudFxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogYXR0cmlidXRlIHdpdGhvdXQgdmFsdWUgKGdlbmVyYWxpemF0aW9uKVxuICBpZiAoL1xcWypcXF0vLnRlc3QoY3VycmVudCkpIHtcbiAgICBjb25zdCBrZXkgPSBjdXJyZW50LnJlcGxhY2UoLz0uKiQvLCAnXScpXG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7a2V5fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gc2VsZWN0KHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IGtleVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb2J1c3RuZXNzOiByZXBsYWNlIHNwZWNpZmljIGtleS12YWx1ZSB3aXRoIGJhc2UgdGFnIChoZXVyaXN0aWMpXG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gc2VsZWN0KGAke3ByZVBhcnR9JHtrZXl9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuMiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlczIgPSBzZWxlY3QocGF0dGVybjIpXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMyLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmICgvPi8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjdXJyZW50LnJlcGxhY2UoLz4vLCAnJylcbiAgICB2YXIgcGF0dGVybjMgPSBgJHtwcmVQYXJ0fSR7ZGVzY2VuZGFudH0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlczMgPSBzZWxlY3QocGF0dGVybjMpXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmICgvOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5yZXBsYWNlKC9udGgtY2hpbGQvZywgJ250aC1vZi10eXBlJylcbiAgICB2YXIgcGF0dGVybjQgPSBgJHtwcmVQYXJ0fSR7dHlwZX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlczQgPSBzZWxlY3QocGF0dGVybjQpXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXM0LCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSB0eXBlXG4gICAgfVxuICB9XG5cbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmICgvXlxcLlxcUypbXlxcc1xcXFxdXFwuXFxTKy8udGVzdChjdXJyZW50KSkge1xuICAgIHZhciBuYW1lcyA9IGN1cnJlbnQudHJpbSgpXG4gICAgICAucmVwbGFjZSgvKF58W15cXFxcXSlcXC4vZywgJyQxIy4nKSAvLyBlc2NhcGUgYWN0dWFsIGRvdHNcbiAgICAgIC5zcGxpdCgnIy4nKSAvLyBzcGxpdCBvbmx5IG9uIGFjdHVhbCBkb3RzXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApXG4gICAgICAuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcbiAgICB3aGlsZSAobmFtZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJ0aWFsID0gY3VycmVudC5yZXBsYWNlKG5hbWVzLnNoaWZ0KCksICcnKS50cmltKClcbiAgICAgIHZhciBwYXR0ZXJuNSA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YC50cmltKClcbiAgICAgIGlmICghcGF0dGVybjUubGVuZ3RoIHx8IHBhdHRlcm41LmNoYXJBdCgwKSA9PT0gJz4nIHx8IHBhdHRlcm41LmNoYXJBdChwYXR0ZXJuNS5sZW5ndGgtMSkgPT09ICc+Jykge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdmFyIG1hdGNoZXM1ID0gc2VsZWN0KHBhdHRlcm41KVxuICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXM1LCBlbGVtZW50cykpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcnRpYWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgbmFtZXMgPSBjdXJyZW50ICYmIGN1cnJlbnQubWF0Y2goL1xcLi9nKVxuICAgIGlmIChuYW1lcyAmJiBuYW1lcy5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gc2VsZWN0KGAke3ByZVBhcnR9JHtjdXJyZW50fWApXG4gICAgICBmb3IgKHZhciBpMiA9IDAsIGwyID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpMl1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSApKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybjYgPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXM2ID0gc2VsZWN0KHBhdHRlcm42KVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzNiwgZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gZGVzY3JpcHRpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogRXZhbHVhdGUgbWF0Y2hlcyB3aXRoIGV4cGVjdGVkIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gbWF0Y2hlcyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjb21wYXJlUmVzdWx0cyAobWF0Y2hlcywgZWxlbWVudHMpIHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG1hdGNoZXNcbiAgcmV0dXJuIGxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoICYmIGVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1hdGNoZXNbaV0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb3B0aW1pemUuanMiLCIvKipcbiAqICMgQWRhcHRcbiAqXG4gKiBDaGVjayBhbmQgZXh0ZW5kIHRoZSBlbnZpcm9ubWVudCBmb3IgdW5pdmVyc2FsIHVzYWdlLlxuICovXG5cbi8qKlxuICogTW9kaWZ5IHRoZSBjb250ZXh0IGJhc2VkIG9uIHRoZSBlbnZpcm9ubWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRhcHQgKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgLy8gZGV0ZWN0IGVudmlyb25tZW50IHNldHVwXG4gIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuZG9jdW1lbnQgPSBvcHRpb25zLmNvbnRleHQgfHwgKCgpID0+IHtcbiAgICAgIHZhciByb290ID0gZWxlbWVudFxuICAgICAgd2hpbGUgKHJvb3QucGFyZW50KSB7XG4gICAgICAgIHJvb3QgPSByb290LnBhcmVudFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3RcbiAgICB9KSgpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0w3NVxuICBjb25zdCBFbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbC5kb2N1bWVudClcblxuICAvLyBhbHRlcm5hdGl2ZSBkZXNjcmlwdG9yIHRvIGFjY2VzcyBlbGVtZW50cyB3aXRoIGZpbHRlcmluZyBpbnZhbGlkIGVsZW1lbnRzIChlLmcuIHRleHRub2RlcylcbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWVsZW1lbnR0eXBlL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0wxMlxuICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICd0YWcnIHx8IG5vZGUudHlwZSA9PT0gJ3NjcmlwdCcgfHwgbm9kZS50eXBlID09PSAnc3R5bGUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycpKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0cmlidXRlc1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9OYW1lZE5vZGVNYXBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJzIH0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnMpXG4gICAgICAgIGNvbnN0IE5hbWVkTm9kZU1hcCA9IGF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgYXR0cmlidXRlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnNbYXR0cmlidXRlTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgICAgfSwgeyB9KVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmFtZWROb2RlTWFwLCAnbGVuZ3RoJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIE5hbWVkTm9kZU1hcFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnNbbmFtZV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyh0aGlzLmNoaWxkVGFncywgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQubmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSAnKicpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lcyA9IGNsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNwbGl0KCcgJylcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50Q2xhc3NOYW1lID0gZGVzY2VuZGFudC5hdHRyaWJzLmNsYXNzXG4gICAgICAgIGlmIChkZXNjZW5kYW50Q2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBkZXNjZW5kYW50Q2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSkpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9jc3Mvc2VsZWN0b3JzX2FwaS9xdWVyeVNlbGVjdG9yQWxsXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvcXVlcnlTZWxlY3RvckFsbFxuICAgIEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIChzZWxlY3RvcnMpIHtcbiAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9ycy5yZXBsYWNlKC8oPikoXFxTKS9nLCAnJDEgJDInKS50cmltKCkgLy8gYWRkIHNwYWNlIGZvciAnPicgc2VsZWN0b3JcblxuICAgICAgLy8gdXNpbmcgcmlnaHQgdG8gbGVmdCBleGVjdXRpb24gPT4gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvY3NzLXNlbGVjdCNob3ctZG9lcy1pdC13b3JrXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBnZXRJbnN0cnVjdGlvbnMoc2VsZWN0b3JzKVxuICAgICAgY29uc3QgZGlzY292ZXIgPSBpbnN0cnVjdGlvbnMuc2hpZnQoKVxuXG4gICAgICBjb25zdCB0b3RhbCA9IGluc3RydWN0aW9ucy5sZW5ndGhcbiAgICAgIHJldHVybiBkaXNjb3Zlcih0aGlzKS5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIHN0ZXAgPSAwXG4gICAgICAgIHdoaWxlIChzdGVwIDwgdG90YWwpIHtcbiAgICAgICAgICBub2RlID0gaW5zdHJ1Y3Rpb25zW3N0ZXBdKG5vZGUsIHRoaXMpXG4gICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGhpZXJhcmNoeSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RlcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY29udGFpbnNcbiAgICBFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHZhciBpbmNsdXNpdmUgPSBmYWxzZVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgaW5jbHVzaXZlID0gdHJ1ZVxuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGluY2x1c2l2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogUmV0cmlldmUgdHJhbnNmb3JtYXRpb24gc3RlcHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gICBzZWxlY3RvcnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48RnVuY3Rpb24+fSAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEluc3RydWN0aW9ucyAoc2VsZWN0b3JzKSB7XG4gIHJldHVybiBzZWxlY3RvcnMuc3BsaXQoJyAnKS5yZXZlcnNlKCkubWFwKChzZWxlY3Rvciwgc3RlcCkgPT4ge1xuICAgIGNvbnN0IGRpc2NvdmVyID0gc3RlcCA9PT0gMFxuICAgIGNvbnN0IFt0eXBlLCBwc2V1ZG9dID0gc2VsZWN0b3Iuc3BsaXQoJzonKVxuXG4gICAgdmFyIHZhbGlkYXRlID0gbnVsbFxuICAgIHZhciBpbnN0cnVjdGlvbiA9IG51bGxcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAvLyBjaGlsZDogJz4nXG4gICAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrUGFyZW50IChub2RlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWxpZGF0ZSkgPT4gdmFsaWRhdGUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgICAvLyBjbGFzczogJy4nXG4gICAgICBjYXNlIC9eXFwuLy50ZXN0KHR5cGUpOiB7XG4gICAgICAgIGNvbnN0IG5hbWVzID0gdHlwZS5zdWJzdHIoMSkuc3BsaXQoJy4nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgbm9kZUNsYXNzTmFtZSA9IG5vZGUuYXR0cmlicy5jbGFzc1xuICAgICAgICAgIHJldHVybiBub2RlQ2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBub2RlQ2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQ2xhc3MgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUobmFtZXMuam9pbignICcpKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gYXR0cmlidXRlOiAnW2tleT1cInZhbHVlXCJdJ1xuICAgICAgY2FzZSAvXlxcWy8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gPSB0eXBlLnJlcGxhY2UoL1xcW3xcXF18XCIvZywgJycpLnNwbGl0KCc9JylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgICBpZiAoaGFzQXR0cmlidXRlKSB7IC8vIHJlZ2FyZCBvcHRpb25hbCBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSB8fCAobm9kZS5hdHRyaWJzW2F0dHJpYnV0ZUtleV0gPT09IGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyBpZDogJyMnXG4gICAgICBjYXNlIC9eIy8udGVzdCh0eXBlKToge1xuICAgICAgICBjb25zdCBpZCA9IHR5cGUuc3Vic3RyKDEpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5hdHRyaWJzLmlkID09PSBpZFxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tJZCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgICBkb25lKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgLy8gdW5pdmVyc2FsOiAnKidcbiAgICAgIGNhc2UgL1xcKi8udGVzdCh0eXBlKToge1xuICAgICAgICB2YWxpZGF0ZSA9ICgpID0+IHRydWVcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1VuaXZlcnNhbCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpKVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICAvLyB0YWc6ICcuLi4nXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gdHlwZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tUYWcgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFdhbGtpbmcgcmVjdXJzaXZlIHRvIGludm9rZSBjYWxsYmFja3NcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxIVE1MRWxlbWVudD59IG5vZGVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgIGhhbmRsZXIgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQnViYmxlIHVwIGZyb20gYm90dG9tIHRvIHRvcFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSByb290ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICB2YWxpZGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFTGVtZW50fSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRhcHQuanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cbmltcG9ydCBjc3MyeHBhdGggZnJvbSAnY3NzMnhwYXRoJ1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJ1xuaW1wb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCB7IGdldFNlbGVjdCwgZ2V0Q29tbW9uQW5jZXN0b3IsIGdldENvbW1vblByb3BlcnRpZXMgfSBmcm9tICcuL2NvbW1vbidcblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBmb3IgdGhlIHByb3ZpZGVkIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDMpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIH1cblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICAke3NlbGVjdG9yfVxuICAvLyAgIG9wdGltaXplZDogJHtvcHRpbWl6ZWR9XG4gIC8vIGApXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGRlc2NlbmRhbnRzIGZyb20gYW4gYW5jZXN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fE5vZGVMaXN0fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdWx0aVNlbGVjdG9yIChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IC0gb25seSBhbiBBcnJheSBvZiBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gaXMgc3VwcG9ydGVkIScpXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclNlbGVjdG9yID0gZ2V0U2luZ2xlU2VsZWN0b3IoYW5jZXN0b3IsIG9wdGlvbnMpXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgdXNhZ2Ugb2YgbXVsdGlwbGUgc2VsZWN0b3JzICsgcGFyZW50LWNoaWxkIHJlbGF0aW9uICsgY2hlY2sgZm9yIHBhcnQgcmVkdW5kYW5jeVxuICBjb25zdCBjb21tb25TZWxlY3RvcnMgPSBnZXRDb21tb25TZWxlY3RvcnMoZWxlbWVudHMpXG4gIGNvbnN0IGRlc2NlbmRhbnRTZWxlY3RvciA9IGNvbW1vblNlbGVjdG9yc1swXVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gb3B0aW1pemUoYCR7YW5jZXN0b3JTZWxlY3Rvcn0gJHtkZXNjZW5kYW50U2VsZWN0b3J9YCwgZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdG9yTWF0Y2hlcyA9IGNvbnZlcnROb2RlTGlzdChzZWxlY3Qoc2VsZWN0b3IpKVxuXG4gIGlmICghZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHNlbGVjdG9yTWF0Y2hlcy5zb21lKChlbnRyeSkgPT4gZW50cnkgPT09IGVsZW1lbnQpICkpIHtcbiAgICAvLyBUT0RPOiBjbHVzdGVyIG1hdGNoZXMgdG8gc3BsaXQgaW50byBzaW1pbGFyIGdyb3VwcyBmb3Igc3ViIHNlbGVjdGlvbnNcbiAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgIFRoZSBzZWxlY3RlZCBlbGVtZW50cyBjYW4ndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuXG4gICAgICBJdHMgcHJvYmFibHkgYmVzdCB0byB1c2UgbXVsdGlwbGUgc2luZ2xlIHNlbGVjdG9ycyBpbnN0ZWFkIVxuICAgIGAsIGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yXG59XG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudHM+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tbW9uU2VsZWN0b3JzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IHsgY2xhc3NlcywgYXR0cmlidXRlcywgdGFnIH0gPSBnZXRDb21tb25Qcm9wZXJ0aWVzKGVsZW1lbnRzKVxuXG4gIGNvbnN0IHNlbGVjdG9yUGF0aCA9IFtdXG5cbiAgaWYgKHRhZykge1xuICAgIHNlbGVjdG9yUGF0aC5wdXNoKHRhZylcbiAgfVxuXG4gIGlmIChjbGFzc2VzKSB7XG4gICAgY29uc3QgY2xhc3NTZWxlY3RvciA9IGNsYXNzZXMubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGNsYXNzU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IGF0dHJpYnV0ZVNlbGVjdG9yID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykucmVkdWNlKChwYXJ0cywgbmFtZSkgPT4ge1xuICAgICAgcGFydHMucHVzaChgWyR7bmFtZX09XCIke2F0dHJpYnV0ZXNbbmFtZV19XCJdYClcbiAgICAgIHJldHVybiBwYXJ0c1xuICAgIH0sIFtdKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGF0dHJpYnV0ZVNlbGVjdG9yKVxuICB9XG5cbiAgaWYgKHNlbGVjdG9yUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBUT0RPOiBjaGVjayBmb3IgcGFyZW50LWNoaWxkIHJlbGF0aW9uXG4gIH1cblxuICByZXR1cm4gW1xuICAgIHNlbGVjdG9yUGF0aC5qb2luKCcnKVxuICBdXG59XG5cbi8qKlxuICogQ2hvb3NlIGFjdGlvbiBkZXBlbmRpbmcgb24gdGhlIGlucHV0IChtdWx0aXBsZS9zaW5nbGUpXG4gKlxuICogTk9URTogZXh0ZW5kZWQgZGV0ZWN0aW9uIGlzIHVzZWQgZm9yIHNwZWNpYWwgY2FzZXMgbGlrZSB0aGUgPHNlbGVjdD4gZWxlbWVudCB3aXRoIDxvcHRpb25zPlxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fE5vZGVMaXN0fEFycmF5LjxIVE1MRWxlbWVudD59IGlucHV0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoaW5wdXQubGVuZ3RoICYmICFpbnB1dC5uYW1lKSB7XG4gICAgcmV0dXJuIGdldE11bHRpU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIGlmIChvcHRpb25zICYmIFsxLCAneHBhdGgnXS5pbmNsdWRlcyhvcHRpb25zLmZvcm1hdCkpIHtcbiAgICByZXR1cm4gY3NzMnhwYXRoKHJlc3VsdClcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3QuanMiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciB4cGF0aF90b19sb3dlciAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgICAgICAgKHMgfHwgJ25vcm1hbGl6ZS1zcGFjZSgpJykgK1xuICAgICAgICAgICAgICAgICcsIFxcJ0FCQ0RFRkdISklLTE1OT1BRUlNUVVZXWFlaXFwnJyArXG4gICAgICAgICAgICAgICAgJywgXFwnYWJjZGVmZ2hqaWtsbW5vcHFyc3R1dnd4eXpcXCcpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF9lbmRzX3dpdGggICAgICAgID0gZnVuY3Rpb24gKHMxLCBzMikge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZygnICsgczEgKyAnLCcgK1xuICAgICAgICAgICAgICAgICdzdHJpbmctbGVuZ3RoKCcgKyBzMSArICcpLXN0cmluZy1sZW5ndGgoJyArIHMyICsgJykrMSk9JyArIHMyO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybCAgICAgICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1iZWZvcmUoY29uY2F0KHN1YnN0cmluZy1hZnRlcignICtcbiAgICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIj9cIiksXCI/XCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfcGF0aCAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYWZ0ZXIoJyArIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2RvbWFpbiAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCI6Ly9cIiksXCIvXCIpLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2F0dHJzICAgICAgICA9ICdAaHJlZnxAc3JjJyxcbiAgICAgIHhwYXRoX2xvd2VyX2Nhc2UgICAgICAgPSB4cGF0aF90b19sb3dlcigpLFxuICAgICAgeHBhdGhfbnNfdXJpICAgICAgICAgICA9ICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0vQHVybCcsXG4gICAgICB4cGF0aF9uc19wYXRoICAgICAgICAgID0geHBhdGhfdXJsX3BhdGgoeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkpLFxuICAgICAgeHBhdGhfaGFzX3Byb3RvY2FsICAgICA9ICcoc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwOi8vXCIpIG9yIHN0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiaHR0cHM6Ly9cIikpJyxcbiAgICAgIHhwYXRoX2lzX2ludGVybmFsICAgICAgPSAnc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpICsgJykgb3IgJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF91cmxfZG9tYWluKCksIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9pc19sb2NhbCAgICAgICAgID0gJygnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkgKyAnKSknLFxuICAgICAgeHBhdGhfaXNfcGF0aCAgICAgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcIi9cIiknLFxuICAgICAgeHBhdGhfaXNfbG9jYWxfcGF0aCAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX3BhdGgoKSArICcsJyArIHhwYXRoX25zX3BhdGggKyAnKScsXG4gICAgICB4cGF0aF9ub3JtYWxpemVfc3BhY2UgID0gJ25vcm1hbGl6ZS1zcGFjZSgpJyxcbiAgICAgIHhwYXRoX2ludGVybmFsICAgICAgICAgPSAnW25vdCgnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJykgb3IgJyArIHhwYXRoX2lzX2ludGVybmFsICsgJ10nLFxuICAgICAgeHBhdGhfZXh0ZXJuYWwgICAgICAgICA9ICdbJyArIHhwYXRoX2hhc19wcm90b2NhbCArICcgYW5kIG5vdCgnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnKV0nLFxuICAgICAgZXNjYXBlX2xpdGVyYWwgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzApLFxuICAgICAgZXNjYXBlX3BhcmVucyAgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzEpLFxuICAgICAgcmVnZXhfc3RyaW5nX2xpdGVyYWwgICA9IC8oXCJbXlwiXFx4MUVdKlwifCdbXidcXHgxRV0qJ3w9XFxzKlteXFxzXFxdXFwnXFxcIl0rKS9nLFxuICAgICAgcmVnZXhfZXNjYXBlZF9saXRlcmFsICA9IC9bJ1wiXT8oXFx4MUUrKVsnXCJdPy9nLFxuICAgICAgcmVnZXhfY3NzX3dyYXBfcHNldWRvICA9IC8oXFx4MUZcXCl8W15cXCldKVxcOihmaXJzdHxsaW1pdHxsYXN0fGd0fGx0fGVxfG50aCkoW15cXC1dfCQpLyxcbiAgICAgIHJlZ2V4X3NwZWNhbF9jaGFycyAgICAgPSAvW1xceDFDLVxceDFGXSsvZyxcbiAgICAgIHJlZ2V4X2ZpcnN0X2F4aXMgICAgICAgPSAvXihbXFxzXFwoXFx4MUZdKikoXFwuP1teXFwuXFwvXFwoXXsxLDJ9W2Etel0qOiopLyxcbiAgICAgIHJlZ2V4X2ZpbHRlcl9wcmVmaXggICAgPSAvKF58XFwvfFxcOilcXFsvZyxcbiAgICAgIHJlZ2V4X2F0dHJfcHJlZml4ICAgICAgPSAvKFteXFwoXFxbXFwvXFx8XFxzXFx4MUZdKVxcQC9nLFxuICAgICAgcmVnZXhfbnRoX2VxdWF0aW9uICAgICA9IC9eKFstMC05XSopbi4qPyhbMC05XSopJC8sXG4gICAgICBjc3NfY29tYmluYXRvcnNfcmVnZXggID0gL1xccyooIT9bKz5+LF4gXSlcXHMqKFxcLj9cXC8rfFthLXpcXC1dKzo6KT8oW2EtelxcLV0rXFwoKT8oKGFuZFxccyp8b3JcXHMqfG1vZFxccyopP1teKz5+LFxccydcIlxcXVxcfFxcXlxcJFxcIVxcPFxcPVxceDFDLVxceDFGXSspPy9nLFxuICAgICAgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBvcGVyYXRvciwgYXhpcywgZnVuYywgbGl0ZXJhbCwgZXhjbHVkZSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSAnJzsgLy8gSWYgd2UgY2FuLCB3ZSdsbCBwcmVmaXggYSAnLidcblxuICAgICAgICAvLyBYUGF0aCBvcGVyYXRvcnMgY2FuIGxvb2sgbGlrZSBub2RlLW5hbWUgc2VsZWN0b3JzXG4gICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgYW5kXCIsIFwiIG9yXCIsIFwiIG1vZFwiXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJyAnICYmIGV4Y2x1ZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBPbmx5IGFsbG93IG5vZGUtc2VsZWN0aW5nIFhQYXRoIGZ1bmN0aW9uc1xuICAgICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgKyBjb3VudCguLi4pXCIsIFwiIGNvdW50KC4uLilcIiwgXCIgPiBwb3NpdGlvbigpXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoZnVuYyAhPT0gdW5kZWZpbmVkICYmIChmdW5jICE9PSAnbm9kZSgnICYmIGZ1bmMgIT09ICd0ZXh0KCcgJiYgZnVuYyAhPT0gJ2NvbW1lbnQoJykpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGl0ZXJhbCA9IGZ1bmM7XG4gICAgICAgICAgfSAvLyBIYW5kbGUgY2FzZSBcIiArIHRleHQoKVwiLCBcIiA+IGNvbW1lbnQoKVwiLCBldGMuIHdoZXJlIFwiZnVuY1wiIGlzIG91ciBcImxpdGVyYWxcIlxuXG4gICAgICAgICAgICAvLyBYUGF0aCBtYXRoIG9wZXJhdG9ycyBtYXRjaCBzb21lIENTUyBjb21iaW5hdG9yc1xuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIDFcIiwgXCIgPiAxXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGxpdGVyYWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByZXZDaGFyID0gb3JpZy5jaGFyQXQob2Zmc2V0IC0gMSk7XG5cbiAgICAgICAgICBpZiAocHJldkNoYXIubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnfCcgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSB7XG4gICAgICAgICAgICBwcmVmaXggPSAnLic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGlmIHdlIGRvbid0IGhhdmUgYSBzZWxlY3RvciB0byBmb2xsb3cgdGhlIGF4aXNcbiAgICAgICAgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvZmZzZXQgKyBtYXRjaC5sZW5ndGggPT09IG9yaWcubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gJyonO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIHJldHVybiAnLy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgcmV0dXJuICcvJyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgJy9mb2xsb3dpbmctc2libGluZzo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJywnOlxuICAgICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIH1cbiAgICAgICAgICBheGlzID0gJy4vLyc7XG4gICAgICAgICAgcmV0dXJuICd8JyArIGF4aXMgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICdeJzogLy8gZmlyc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIV4nOiAvLyBsYXN0IGNoaWxkXG4gICAgICAgICAgcmV0dXJuICcvY2hpbGQ6OipbbGFzdCgpXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISAnOiAvLyBhbmNlc3Rvci1vci1zZWxmXG4gICAgICAgICAgcmV0dXJuICcvYW5jZXN0b3Itb3Itc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyE+JzogLy8gZGlyZWN0IHBhcmVudFxuICAgICAgICAgIHJldHVybiAnL3BhcmVudDo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyErJzogLy8gYWRqYWNlbnQgcHJlY2VkaW5nIHNpYmxpbmdcbiAgICAgICAgICByZXR1cm4gJy9wcmVjZWRpbmctc2libGluZzo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIX4nOiAvLyBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgICAgIC8vIGNhc2UgJ35+J1xuICAgICAgICAgICAgLy8gcmV0dXJuICcvZm9sbG93aW5nLXNpYmxpbmc6Oiovc2VsZjo6fCcrc2VsZWN0b3JTdGFydChvcmlnLCBvZmZzZXQpKycvcHJlY2VkaW5nLXNpYmxpbmc6Oiovc2VsZjo6JytsaXRlcmFsO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfYXR0cmlidXRlc19yZWdleCA9IC9cXFsoW15cXEBcXHxcXCpcXD1cXF5cXH5cXCRcXCFcXChcXC9cXHNcXHgxQy1cXHgxRl0rKVxccyooKFtcXHxcXCpcXH5cXF5cXCRcXCFdPyk9P1xccyooXFx4MUUrKSk/XFxdL2csXG4gICAgICBjc3NfYXR0cmlidXRlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIGF0dHIsIGNvbXAsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAocHJldkNoYXIgPT09ICcvJyB8fCAvLyBmb3VuZCBhZnRlciBhbiBheGlzIHNob3J0Y3V0IChcIi9cIiwgXCIvL1wiLCBldGMuKVxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICc6JykgICAvLyBmb3VuZCBhZnRlciBhbiBheGlzIChcInNlbGY6OlwiLCBcInBhcmVudDo6XCIsIGV0Yy4pXG4gICAgICAgICAgICBheGlzID0gJyonOyovXG5cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbbm90KEAnICsgYXR0ciArICcpIG9yIEAnICsgYXR0ciArICchPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3Vic3RyaW5nKEAnICsgYXR0ciArICcsc3RyaW5nLWxlbmd0aChAJyArIGF0dHIgKyAnKS0oc3RyaW5nLWxlbmd0aChcIicgKyB2YWwgKyAnXCIpLTEpKT1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW3N0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbY29udGFpbnMoY29uY2F0KFwiIFwiLG5vcm1hbGl6ZS1zcGFjZShAJyArIGF0dHIgKyAnKSxcIiBcIiksY29uY2F0KFwiIFwiLFwiJyArIHZhbCArICdcIixcIiBcIikpXSc7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhAJyArIGF0dHIgKyAnLFwiJyArIHZhbCArICdcIildJztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiIG9yIHN0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsY29uY2F0KFwiJyArIHZhbCArICdcIixcIi1cIikpXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGF0dHIuY2hhckF0KGF0dHIubGVuZ3RoIC0gMSkgPT09ICcoJyB8fCBhdHRyLnNlYXJjaCgvXlswLTldKyQvKSAhPT0gLTEgfHwgYXR0ci5pbmRleE9mKCc6JykgIT09IC0xKSAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnXSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4ID0gLzooW2EtelxcLV0rKShcXCgoXFx4MUYrKSgoW15cXHgxRl0rKFxcM1xceDFGKyk/KSopKFxcM1xcKSkpPy9nLFxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCBnMSwgZzIsIGFyZywgZzMsIGc0LCBnNSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIGlmIChvcmlnLmNoYXJBdChvZmZzZXQgLSAxKSA9PT0gJzonICYmIG9yaWcuY2hhckF0KG9mZnNldCAtIDIpICE9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIFhQYXRoIFwiYXhpczo6bm9kZS1uYW1lXCIgd2lsbCBtYXRjaFxuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIFwiOm5vZGUtbmFtZVwiXG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgPT09ICdvZGQnIHx8IG5hbWUgPT09ICdldmVuJykge1xuICAgICAgICAgIGFyZyAgPSBuYW1lO1xuICAgICAgICAgIG5hbWUgPSAnbnRoLW9mLXR5cGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChuYW1lKSB7IC8vIG5hbWUudG9Mb3dlckNhc2UoKT9cbiAgICAgICAgY2FzZSAnYWZ0ZXInOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3ByZWNlZGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYWZ0ZXItc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZSc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdiZWZvcmUtc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2NoZWNrZWQnOlxuICAgICAgICAgIHJldHVybiAnW0BzZWxlY3RlZCBvciBAY2hlY2tlZF0nO1xuICAgICAgICBjYXNlICdjb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2ljb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX2xvd2VyX2Nhc2UgKyAnLCcgKyB4cGF0aF90b19sb3dlcihhcmcpICsgJyldJztcbiAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgIHJldHVybiAnW25vdCgqKSBhbmQgbm90KG5vcm1hbGl6ZS1zcGFjZSgpKV0nO1xuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgICAgIHJldHVybiAnW0AnICsgbmFtZSArICddJztcbiAgICAgICAgY2FzZSAnZmlyc3QtY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnZmlyc3QnOlxuICAgICAgICBjYXNlICdsaW1pdCc6XG4gICAgICAgIGNhc2UgJ2ZpcnN0LW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAnZ3QnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbHQnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPCcgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbGFzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdvbmx5LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OiopIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktb2YtdHlwZSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKSBhbmQgbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKV0nO1xuICAgICAgICBjYXNlICdudGgtY2hpbGQnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgPSAnICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKGFyZykge1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0wXSc7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgbW9kIDI9MV0nO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgYSA9IChhcmcgfHwgJzAnKS5yZXBsYWNlKHJlZ2V4X250aF9lcXVhdGlvbiwgJyQxKyQyJykuc3BsaXQoJysnKTtcblxuICAgICAgICAgICAgYVswXSA9IGFbMF0gfHwgJzEnO1xuICAgICAgICAgICAgYVsxXSA9IGFbMV0gfHwgJzAnO1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKT49JyArIGFbMV0gKyAnIGFuZCAoKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKS0nICsgYVsxXSArICcpIG1vZCAnICsgYVswXSArICc9MF0nO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnbnRoLW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCkgbW9kIDI9MV0nO1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0wIGFuZCBwb3NpdGlvbigpPj0wXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPj0nICsgYVsxXSArICcgYW5kIChwb3NpdGlvbigpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdlcSc6XG4gICAgICAgIGNhc2UgJ250aCc6XG4gICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgcmV0dXJuICdbQHR5cGU9XCJ0ZXh0XCJdJztcbiAgICAgICAgY2FzZSAnaXN0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdzdGFydHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2llbmRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnWycgKyB4cGF0aF9lbmRzX3dpdGgoeHBhdGhfbG93ZXJfY2FzZSwgeHBhdGhfdG9fbG93ZXIoYXJnKSkgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2VuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9ub3JtYWxpemVfc3BhY2UsIGFyZykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2hhcyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gcHJlcGVuZEF4aXMoY3NzMnhwYXRoKGFyZywgdHJ1ZSksICcuLy8nKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtc2libGluZyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgeHBhdGggKyAnKSA+IDAgb3IgY291bnQoZm9sbG93aW5nLXNpYmxpbmc6OicgKyB4cGF0aC5zdWJzdHIoMTkpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1wYXJlbnQnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3BhcmVudDo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLWFuY2VzdG9yJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdhbmNlc3Rvcjo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnbGFzdCc6XG4gICAgICAgIGNhc2UgJ2xhc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT5sYXN0KCktJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3NlbGVjdGVkJzogLy8gU2l6emxlOiBcIihvcHRpb24pIGVsZW1lbnRzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZFwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwib3B0aW9uXCIgYW5kIEBzZWxlY3RlZF0nO1xuICAgICAgICBjYXNlICdza2lwJzpcbiAgICAgICAgY2FzZSAnc2tpcC1maXJzdCc6XG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT4nICsgYXJnICsgJ10nO1xuICAgICAgICBjYXNlICdza2lwLWxhc3QnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW2xhc3QoKS1wb3NpdGlvbigpPj0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPGxhc3QoKV0nO1xuICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvcjo6W2xhc3QoKV0nO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgdmFyIGFyciA9IGFyZy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgcmV0dXJuICdbJyArIGFyclswXSArICc8PXBvc2l0aW9uKCkgYW5kIHBvc2l0aW9uKCk8PScgKyBhcnJbMV0gKyAnXSc7XG4gICAgICAgIGNhc2UgJ2lucHV0JzogLy8gU2l6emxlOiBcImlucHV0LCBidXR0b24sIHNlbGVjdCwgYW5kIHRleHRhcmVhIGFyZSBhbGwgY29uc2lkZXJlZCB0byBiZSBpbnB1dCBlbGVtZW50cy5cIlxuICAgICAgICAgIHJldHVybiAnW2xvY2FsLW5hbWUoKT1cImlucHV0XCIgb3IgbG9jYWwtbmFtZSgpPVwiYnV0dG9uXCIgb3IgbG9jYWwtbmFtZSgpPVwic2VsZWN0XCIgb3IgbG9jYWwtbmFtZSgpPVwidGV4dGFyZWFcIl0nO1xuICAgICAgICBjYXNlICdpbnRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2ludGVybmFsO1xuICAgICAgICBjYXNlICdleHRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2V4dGVybmFsO1xuICAgICAgICBjYXNlICdodHRwJzpcbiAgICAgICAgY2FzZSAnaHR0cHMnOlxuICAgICAgICBjYXNlICdtYWlsdG8nOlxuICAgICAgICBjYXNlICdqYXZhc2NyaXB0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZixjb25jYXQoXCInICsgbmFtZSArICdcIixcIjpcIikpXSc7XG4gICAgICAgIGNhc2UgJ2RvbWFpbic6XG4gICAgICAgICAgcmV0dXJuICdbKHN0cmluZy1sZW5ndGgoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcpPTAgYW5kIGNvbnRhaW5zKCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnLCcgKyBhcmcgKyAnKSkgb3IgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJyxzdWJzdHJpbmctYWZ0ZXIoXCInICsgYXJnICsgJ1wiLFwiL1wiKSldJ1xuICAgICAgICBjYXNlICdub3QnOlxuICAgICAgICAgIHZhciB4cGF0aCA9IGNzczJ4cGF0aChhcmcsIHRydWUpO1xuXG4gICAgICAgICAgaWYgKHhwYXRoLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgeHBhdGggPSAnc2VsZjo6bm9kZSgpJyArIHhwYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tub3QoJyArIHhwYXRoICsgJyldJztcbiAgICAgICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZiwgXCIjXCIpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnYW5jZXN0b3Itb3Itc2VsZjo6KltsYXN0KCldJztcbiAgICAgICAgICAgIC8qIGNhc2UgJ2FjdGl2ZSc6XG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6XG4gICAgICAgICAgICBjYXNlICdob3Zlcic6XG4gICAgICAgICAgICBjYXNlICdsaW5rJzpcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnJzsqL1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tAbGFuZz1cIicgKyBhcmcgKyAnXCJdJztcbiAgICAgICAgY2FzZSAncmVhZC1vbmx5JzpcbiAgICAgICAgY2FzZSAncmVhZC13cml0ZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lLnJlcGxhY2UoJy0nLCAnJykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3ZhbGlkJzpcbiAgICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICBjYXNlICdpbi1yYW5nZSc6XG4gICAgICAgIGNhc2UgJ291dC1vZi1yYW5nZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX2lkc19jbGFzc2VzX3JlZ2V4ID0gLygjfFxcLikoW15cXCNcXEBcXC5cXC9cXChcXFtcXClcXF1cXHxcXDpcXHNcXCtcXD5cXDxcXCdcXFwiXFx4MUQtXFx4MUZdKykvZyxcbiAgICAgIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICAvKiB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQtMSk7XG4gICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnLycgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnKCcpXG4gICAgICAgICAgICBheGlzID0gJyonO1xuICAgICAgICBlbHNlIGlmIChwcmV2Q2hhciA9PT0gJzonKVxuICAgICAgICAgICAgYXhpcyA9ICdub2RlKCknOyovXG4gICAgICAgIGlmIChvcCA9PT0gJyMnKSAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQGlkPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEBjbGFzcyksXCIgXCIpLFwiICcgKyB2YWwgKyAnIFwiKV0nO1xuICAgICAgfTtcblxuICAgIC8vIFByZXBlbmQgZGVzY2VuZGFudC1vci1zZWxmIGlmIG5vIG90aGVyIGF4aXMgaXMgc3BlY2lmaWVkXG4gIGZ1bmN0aW9uIHByZXBlbmRBeGlzKHMsIGF4aXMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlZ2V4X2ZpcnN0X2F4aXMsIGZ1bmN0aW9uIChtYXRjaCwgc3RhcnQsIGxpdGVyYWwpIHtcbiAgICAgIGlmIChsaXRlcmFsLnN1YnN0cihsaXRlcmFsLmxlbmd0aCAtIDIpID09PSAnOjonKSAvLyBBbHJlYWR5IGhhcyBheGlzOjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuXG4gICAgICBpZiAobGl0ZXJhbC5jaGFyQXQoMCkgPT09ICdbJykgICAgICAgICAgICB7XG4gICAgICAgIGF4aXMgKz0gJyonO1xuICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChheGlzLmNoYXJBdChheGlzLmxlbmd0aC0xKSA9PT0gJyknKVxuICAgICAgICAvLyAgICBheGlzICs9ICcvJztcbiAgICAgIHJldHVybiBzdGFydCArIGF4aXMgKyBsaXRlcmFsO1xuICAgIH0pO1xuICB9XG5cbiAgICAvLyBGaW5kIHRoZSBiZWdpbmluZyBvZiB0aGUgc2VsZWN0b3IsIHN0YXJ0aW5nIGF0IGkgYW5kIHdvcmtpbmcgYmFja3dhcmRzXG4gIGZ1bmN0aW9uIHNlbGVjdG9yU3RhcnQocywgaSkge1xuICAgIHZhciBkZXB0aCA9IDA7XG4gICAgdmFyIG9mZnNldCA9IDA7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBzd2l0Y2ggKHMuY2hhckF0KGkpKSB7XG4gICAgICBjYXNlICcgJzpcbiAgICAgIGNhc2UgZXNjYXBlX3BhcmVuczpcbiAgICAgICAgb2Zmc2V0Kys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWyc6XG4gICAgICBjYXNlICcoJzpcbiAgICAgICAgZGVwdGgtLTtcblxuICAgICAgICBpZiAoZGVwdGggPCAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICddJzpcbiAgICAgIGNhc2UgJyknOlxuICAgICAgICBkZXB0aCsrO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJywnOlxuICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGlmIChkZXB0aCA9PT0gMCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gKytpICsgb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgICAvLyBDaGVjayBpZiBzdHJpbmcgaXMgbnVtZXJpY1xuICBmdW5jdGlvbiBpc051bWVyaWMocykge1xuICAgIHZhciBudW0gPSBwYXJzZUludChzLCAxMCk7XG5cbiAgICByZXR1cm4gKCFpc05hTihudW0pICYmICcnICsgbnVtID09PSBzKTtcbiAgfVxuXG4gICAgLy8gQXBwZW5kIGVzY2FwZSBcImNoYXJcIiB0byBcIm9wZW5cIiBvciBcImNsb3NlXCJcbiAgZnVuY3Rpb24gZXNjYXBlQ2hhcihzLCBvcGVuLCBjbG9zZSwgY2hhcikge1xuICAgIHZhciBkZXB0aCA9IDA7XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXFxcJyArIG9wZW4gKyAnXFxcXCcgKyBjbG9zZSArICddJywgJ2cnKSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgIGlmIChhID09PSBvcGVuKSAgICAgICAgICAgIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGEgPT09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIGEgKyByZXBlYXQoY2hhciwgZGVwdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlcGVhdChjaGFyLCBkZXB0aC0tKSArIGE7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGVhdChzdHIsIG51bSkge1xuICAgIG51bSA9IE51bWJlcihudW0pO1xuICAgIHZhciByZXN1bHQgPSAnJztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAobnVtICYgMSkgICAgICAgICAgICB7XG4gICAgICAgIHJlc3VsdCArPSBzdHI7XG4gICAgICB9XG4gICAgICBudW0gPj4+PSAxO1xuXG4gICAgICBpZiAobnVtIDw9IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzdHIgKz0gc3RyO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0RXNjYXBpbmcgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1xcXFwoW2BcXFxcLzpcXD8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XSkvZywgJyQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcKFsnXCJdKS9nLCAnJDEkMScpXG4gICAgICAucmVwbGFjZSgvXFxcXEEgL2csICdcXG4nKVxuICB9XG5cbiAgZnVuY3Rpb24gY3NzMnhwYXRoKHMsIG5lc3RlZCkge1xuICAgIC8vIHMgPSBzLnRyaW0oKTtcblxuICAgIGlmIChuZXN0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICAvLyBUYWcgb3BlbiBhbmQgY2xvc2UgcGFyZW50aGVzaXMgcGFpcnMgKGZvciBSZWdFeHAgc2VhcmNoZXMpXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJygnLCAnKScsIGVzY2FwZV9wYXJlbnMpO1xuXG4gICAgLy8gUmVtb3ZlIGFuZCBzYXZlIGFueSBzdHJpbmcgbGl0ZXJhbHNcbiAgICB2YXIgbGl0ZXJhbHMgPSBbXTtcblxuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3RyaW5nX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICBpZiAoYS5jaGFyQXQoMCkgPT09ICc9Jykge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSkudHJpbSgpO1xuXG4gICAgICAgIGlmIChpc051bWVyaWMoYSkpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IGEuc3Vic3RyKDEsIGEubGVuZ3RoIC0gMik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBlYXQoZXNjYXBlX2xpdGVyYWwsIGxpdGVyYWxzLnB1c2goY29udmVydEVzY2FwaW5nKGEpKSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBjb21iaW5hdG9ycyAoXCIgXCIsIFwiK1wiLCBcIj5cIiwgXCJ+XCIsIFwiLFwiKSBhbmQgcmV2ZXJzZSBjb21iaW5hdG9ycyAoXCIhXCIsIFwiIStcIiwgXCIhPlwiLCBcIiF+XCIpXG4gICAgcyA9IHMucmVwbGFjZShjc3NfY29tYmluYXRvcnNfcmVnZXgsIGNzc19jb21iaW5hdG9yc19jYWxsYmFjayk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBhdHRyaWJ1dGUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2F0dHJpYnV0ZXNfcmVnZXgsIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrKTtcblxuICAgIC8vIFdyYXAgY2VydGFpbiA6cHNldWRvLWNsYXNzZXMgaW4gcGFyZW5zICh0byBjb2xsZWN0IG5vZGUtc2V0cylcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGluZGV4ID0gcy5zZWFyY2gocmVnZXhfY3NzX3dyYXBfcHNldWRvKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gcy5pbmRleE9mKCc6JywgaW5kZXgpO1xuICAgICAgdmFyIHN0YXJ0ID0gc2VsZWN0b3JTdGFydChzLCBpbmRleCk7XG5cbiAgICAgIHMgPSBzLnN1YnN0cigwLCBzdGFydCkgK1xuICAgICAgICAgICAgJygnICsgcy5zdWJzdHJpbmcoc3RhcnQsIGluZGV4KSArICcpJyArXG4gICAgICAgICAgICBzLnN1YnN0cihpbmRleCk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCwgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19pZHNfY2xhc3Nlc19yZWdleCwgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIHNhdmVkIHN0cmluZyBsaXRlcmFsc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZXNjYXBlZF9saXRlcmFsLCBmdW5jdGlvbiAocywgYSkge1xuICAgICAgdmFyIHN0ciA9IGxpdGVyYWxzW2EubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiAnXCInICsgc3RyICsgJ1wiJztcbiAgICB9KVxuXG4gICAgLy8gUmVtb3ZlIGFueSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X3NwZWNhbF9jaGFycywgJycpO1xuXG4gICAgLy8gYWRkICogdG8gc3RhbmQtYWxvbmUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZmlsdGVyX3ByZWZpeCwgJyQxKlsnKTtcblxuICAgIC8vIGFkZCBcIi9cIiBiZXR3ZWVuIEBhdHRyaWJ1dGUgc2VsZWN0b3JzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9hdHRyX3ByZWZpeCwgJyQxL0AnKTtcblxuICAgIC8qXG4gICAgQ29tYmluZSBtdWx0aXBsZSBmaWx0ZXJzP1xuXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJ1snLCAnXScsIGZpbHRlcl9jaGFyKTtcbiAgICBzID0gcy5yZXBsYWNlKC8oXFx4MUQrKVxcXVxcW1xcMSguKz9bXlxceDFEXSlcXDFcXF0vZywgJyBhbmQgKCQyKSQxXScpXG4gICAgKi9cblxuICAgIHMgPSBwcmVwZW5kQXhpcyhzLCAnLi8vJyk7IC8vIHByZXBlbmQgXCIuLy9cIiBheGlzIHRvIGJlZ2luaW5nIG9mIENTUyBzZWxlY3RvclxuICAgIHJldHVybiBzO1xuICB9XG5cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY3NzMnhwYXRoO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5jc3MyeHBhdGggPSBjc3MyeHBhdGg7XG4gIH1cblxufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzMnhwYXRoL2luZGV4LmpzIiwiLyohXG4gKiBTaXp6bGUgQ1NTIFNlbGVjdG9yIEVuZ2luZSB2Mi4zLjZcbiAqIGh0dHBzOi8vc2l6emxlanMuY29tL1xuICpcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cHM6Ly9qcy5mb3VuZGF0aW9uL1xuICpcbiAqIERhdGU6IDIwMjEtMDItMTZcbiAqL1xuKCBmdW5jdGlvbiggd2luZG93ICkge1xudmFyIGksXG5cdHN1cHBvcnQsXG5cdEV4cHIsXG5cdGdldFRleHQsXG5cdGlzWE1MLFxuXHR0b2tlbml6ZSxcblx0Y29tcGlsZSxcblx0c2VsZWN0LFxuXHRvdXRlcm1vc3RDb250ZXh0LFxuXHRzb3J0SW5wdXQsXG5cdGhhc0R1cGxpY2F0ZSxcblxuXHQvLyBMb2NhbCBkb2N1bWVudCB2YXJzXG5cdHNldERvY3VtZW50LFxuXHRkb2N1bWVudCxcblx0ZG9jRWxlbSxcblx0ZG9jdW1lbnRJc0hUTUwsXG5cdHJidWdneVFTQSxcblx0cmJ1Z2d5TWF0Y2hlcyxcblx0bWF0Y2hlcyxcblx0Y29udGFpbnMsXG5cblx0Ly8gSW5zdGFuY2Utc3BlY2lmaWMgZGF0YVxuXHRleHBhbmRvID0gXCJzaXp6bGVcIiArIDEgKiBuZXcgRGF0ZSgpLFxuXHRwcmVmZXJyZWREb2MgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdGRpcnJ1bnMgPSAwLFxuXHRkb25lID0gMCxcblx0Y2xhc3NDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHRva2VuQ2FjaGUgPSBjcmVhdGVDYWNoZSgpLFxuXHRjb21waWxlckNhY2hlID0gY3JlYXRlQ2FjaGUoKSxcblx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSA9IGNyZWF0ZUNhY2hlKCksXG5cdHNvcnRPcmRlciA9IGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdGlmICggYSA9PT0gYiApIHtcblx0XHRcdGhhc0R1cGxpY2F0ZSA9IHRydWU7XG5cdFx0fVxuXHRcdHJldHVybiAwO1xuXHR9LFxuXG5cdC8vIEluc3RhbmNlIG1ldGhvZHNcblx0aGFzT3duID0gKCB7fSApLmhhc093blByb3BlcnR5LFxuXHRhcnIgPSBbXSxcblx0cG9wID0gYXJyLnBvcCxcblx0cHVzaE5hdGl2ZSA9IGFyci5wdXNoLFxuXHRwdXNoID0gYXJyLnB1c2gsXG5cdHNsaWNlID0gYXJyLnNsaWNlLFxuXG5cdC8vIFVzZSBhIHN0cmlwcGVkLWRvd24gaW5kZXhPZiBhcyBpdCdzIGZhc3RlciB0aGFuIG5hdGl2ZVxuXHQvLyBodHRwczovL2pzcGVyZi5jb20vdGhvci1pbmRleG9mLXZzLWZvci81XG5cdGluZGV4T2YgPSBmdW5jdGlvbiggbGlzdCwgZWxlbSApIHtcblx0XHR2YXIgaSA9IDAsXG5cdFx0XHRsZW4gPSBsaXN0Lmxlbmd0aDtcblx0XHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdGlmICggbGlzdFsgaSBdID09PSBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIC0xO1xuXHR9LFxuXG5cdGJvb2xlYW5zID0gXCJjaGVja2VkfHNlbGVjdGVkfGFzeW5jfGF1dG9mb2N1c3xhdXRvcGxheXxjb250cm9sc3xkZWZlcnxkaXNhYmxlZHxoaWRkZW58XCIgK1xuXHRcdFwiaXNtYXB8bG9vcHxtdWx0aXBsZXxvcGVufHJlYWRvbmx5fHJlcXVpcmVkfHNjb3BlZFwiLFxuXG5cdC8vIFJlZ3VsYXIgZXhwcmVzc2lvbnNcblxuXHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXNlbGVjdG9ycy8jd2hpdGVzcGFjZVxuXHR3aGl0ZXNwYWNlID0gXCJbXFxcXHgyMFxcXFx0XFxcXHJcXFxcblxcXFxmXVwiLFxuXG5cdC8vIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9jc3Mtc3ludGF4LTMvI2lkZW50LXRva2VuLWRpYWdyYW1cblx0aWRlbnRpZmllciA9IFwiKD86XFxcXFxcXFxbXFxcXGRhLWZBLUZdezEsNn1cIiArIHdoaXRlc3BhY2UgK1xuXHRcdFwiP3xcXFxcXFxcXFteXFxcXHJcXFxcblxcXFxmXXxbXFxcXHctXXxbXlxcMC1cXFxceDdmXSkrXCIsXG5cblx0Ly8gQXR0cmlidXRlIHNlbGVjdG9yczogaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNhdHRyaWJ1dGUtc2VsZWN0b3JzXG5cdGF0dHJpYnV0ZXMgPSBcIlxcXFxbXCIgKyB3aGl0ZXNwYWNlICsgXCIqKFwiICsgaWRlbnRpZmllciArIFwiKSg/OlwiICsgd2hpdGVzcGFjZSArXG5cblx0XHQvLyBPcGVyYXRvciAoY2FwdHVyZSAyKVxuXHRcdFwiKihbKl4kfCF+XT89KVwiICsgd2hpdGVzcGFjZSArXG5cblx0XHQvLyBcIkF0dHJpYnV0ZSB2YWx1ZXMgbXVzdCBiZSBDU1MgaWRlbnRpZmllcnMgW2NhcHR1cmUgNV1cblx0XHQvLyBvciBzdHJpbmdzIFtjYXB0dXJlIDMgb3IgY2FwdHVyZSA0XVwiXG5cdFx0XCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIiArIGlkZW50aWZpZXIgKyBcIikpfClcIiArXG5cdFx0d2hpdGVzcGFjZSArIFwiKlxcXFxdXCIsXG5cblx0cHNldWRvcyA9IFwiOihcIiArIGlkZW50aWZpZXIgKyBcIikoPzpcXFxcKChcIiArXG5cblx0XHQvLyBUbyByZWR1Y2UgdGhlIG51bWJlciBvZiBzZWxlY3RvcnMgbmVlZGluZyB0b2tlbml6ZSBpbiB0aGUgcHJlRmlsdGVyLCBwcmVmZXIgYXJndW1lbnRzOlxuXHRcdC8vIDEuIHF1b3RlZCAoY2FwdHVyZSAzOyBjYXB0dXJlIDQgb3IgY2FwdHVyZSA1KVxuXHRcdFwiKCcoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcIil8XCIgK1xuXG5cdFx0Ly8gMi4gc2ltcGxlIChjYXB0dXJlIDYpXG5cdFx0XCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFwoKVtcXFxcXV18XCIgKyBhdHRyaWJ1dGVzICsgXCIpKil8XCIgK1xuXG5cdFx0Ly8gMy4gYW55dGhpbmcgZWxzZSAoY2FwdHVyZSAyKVxuXHRcdFwiLipcIiArXG5cdFx0XCIpXFxcXCl8KVwiLFxuXG5cdC8vIExlYWRpbmcgYW5kIG5vbi1lc2NhcGVkIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGNhcHR1cmluZyBzb21lIG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlcnMgcHJlY2VkaW5nIHRoZSBsYXR0ZXJcblx0cndoaXRlc3BhY2UgPSBuZXcgUmVnRXhwKCB3aGl0ZXNwYWNlICsgXCIrXCIsIFwiZ1wiICksXG5cdHJ0cmltID0gbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICsgXCIrfCgoPzpefFteXFxcXFxcXFxdKSg/OlxcXFxcXFxcLikqKVwiICtcblx0XHR3aGl0ZXNwYWNlICsgXCIrJFwiLCBcImdcIiApLFxuXG5cdHJjb21tYSA9IG5ldyBSZWdFeHAoIFwiXlwiICsgd2hpdGVzcGFjZSArIFwiKixcIiArIHdoaXRlc3BhY2UgKyBcIipcIiApLFxuXHRyY29tYmluYXRvcnMgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHdoaXRlc3BhY2UgKyBcIiooWz4rfl18XCIgKyB3aGl0ZXNwYWNlICsgXCIpXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcIipcIiApLFxuXHRyZGVzY2VuZCA9IG5ldyBSZWdFeHAoIHdoaXRlc3BhY2UgKyBcInw+XCIgKSxcblxuXHRycHNldWRvID0gbmV3IFJlZ0V4cCggcHNldWRvcyApLFxuXHRyaWRlbnRpZmllciA9IG5ldyBSZWdFeHAoIFwiXlwiICsgaWRlbnRpZmllciArIFwiJFwiICksXG5cblx0bWF0Y2hFeHByID0ge1xuXHRcdFwiSURcIjogbmV3IFJlZ0V4cCggXCJeIyhcIiArIGlkZW50aWZpZXIgKyBcIilcIiApLFxuXHRcdFwiQ0xBU1NcIjogbmV3IFJlZ0V4cCggXCJeXFxcXC4oXCIgKyBpZGVudGlmaWVyICsgXCIpXCIgKSxcblx0XHRcIlRBR1wiOiBuZXcgUmVnRXhwKCBcIl4oXCIgKyBpZGVudGlmaWVyICsgXCJ8WypdKVwiICksXG5cdFx0XCJBVFRSXCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgYXR0cmlidXRlcyApLFxuXHRcdFwiUFNFVURPXCI6IG5ldyBSZWdFeHAoIFwiXlwiICsgcHNldWRvcyApLFxuXHRcdFwiQ0hJTERcIjogbmV3IFJlZ0V4cCggXCJeOihvbmx5fGZpcnN0fGxhc3R8bnRofG50aC1sYXN0KS0oY2hpbGR8b2YtdHlwZSkoPzpcXFxcKFwiICtcblx0XHRcdHdoaXRlc3BhY2UgKyBcIiooZXZlbnxvZGR8KChbKy1dfCkoXFxcXGQqKW58KVwiICsgd2hpdGVzcGFjZSArIFwiKig/OihbKy1dfClcIiArXG5cdFx0XHR3aGl0ZXNwYWNlICsgXCIqKFxcXFxkKyl8KSlcIiArIHdoaXRlc3BhY2UgKyBcIipcXFxcKXwpXCIsIFwiaVwiICksXG5cdFx0XCJib29sXCI6IG5ldyBSZWdFeHAoIFwiXig/OlwiICsgYm9vbGVhbnMgKyBcIikkXCIsIFwiaVwiICksXG5cblx0XHQvLyBGb3IgdXNlIGluIGxpYnJhcmllcyBpbXBsZW1lbnRpbmcgLmlzKClcblx0XHQvLyBXZSB1c2UgdGhpcyBmb3IgUE9TIG1hdGNoaW5nIGluIGBzZWxlY3RgXG5cdFx0XCJuZWVkc0NvbnRleHRcIjogbmV3IFJlZ0V4cCggXCJeXCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFwiKls+K35dfDooZXZlbnxvZGR8ZXF8Z3R8bHR8bnRofGZpcnN0fGxhc3QpKD86XFxcXChcIiArIHdoaXRlc3BhY2UgK1xuXHRcdFx0XCIqKCg/Oi1cXFxcZCk/XFxcXGQqKVwiICsgd2hpdGVzcGFjZSArIFwiKlxcXFwpfCkoPz1bXi1dfCQpXCIsIFwiaVwiIClcblx0fSxcblxuXHRyaHRtbCA9IC9IVE1MJC9pLFxuXHRyaW5wdXRzID0gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaSxcblx0cmhlYWRlciA9IC9eaFxcZCQvaSxcblxuXHRybmF0aXZlID0gL15bXntdK1xce1xccypcXFtuYXRpdmUgXFx3LyxcblxuXHQvLyBFYXNpbHktcGFyc2VhYmxlL3JldHJpZXZhYmxlIElEIG9yIFRBRyBvciBDTEFTUyBzZWxlY3RvcnNcblx0cnF1aWNrRXhwciA9IC9eKD86IyhbXFx3LV0rKXwoXFx3Kyl8XFwuKFtcXHctXSspKSQvLFxuXG5cdHJzaWJsaW5nID0gL1srfl0vLFxuXG5cdC8vIENTUyBlc2NhcGVzXG5cdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL0NTUzIxL3N5bmRhdGEuaHRtbCNlc2NhcGVkLWNoYXJhY3RlcnNcblx0cnVuZXNjYXBlID0gbmV3IFJlZ0V4cCggXCJcXFxcXFxcXFtcXFxcZGEtZkEtRl17MSw2fVwiICsgd2hpdGVzcGFjZSArIFwiP3xcXFxcXFxcXChbXlxcXFxyXFxcXG5cXFxcZl0pXCIsIFwiZ1wiICksXG5cdGZ1bmVzY2FwZSA9IGZ1bmN0aW9uKCBlc2NhcGUsIG5vbkhleCApIHtcblx0XHR2YXIgaGlnaCA9IFwiMHhcIiArIGVzY2FwZS5zbGljZSggMSApIC0gMHgxMDAwMDtcblxuXHRcdHJldHVybiBub25IZXggP1xuXG5cdFx0XHQvLyBTdHJpcCB0aGUgYmFja3NsYXNoIHByZWZpeCBmcm9tIGEgbm9uLWhleCBlc2NhcGUgc2VxdWVuY2Vcblx0XHRcdG5vbkhleCA6XG5cblx0XHRcdC8vIFJlcGxhY2UgYSBoZXhhZGVjaW1hbCBlc2NhcGUgc2VxdWVuY2Ugd2l0aCB0aGUgZW5jb2RlZCBVbmljb2RlIGNvZGUgcG9pbnRcblx0XHRcdC8vIFN1cHBvcnQ6IElFIDw9MTErXG5cdFx0XHQvLyBGb3IgdmFsdWVzIG91dHNpZGUgdGhlIEJhc2ljIE11bHRpbGluZ3VhbCBQbGFuZSAoQk1QKSwgbWFudWFsbHkgY29uc3RydWN0IGFcblx0XHRcdC8vIHN1cnJvZ2F0ZSBwYWlyXG5cdFx0XHRoaWdoIDwgMCA/XG5cdFx0XHRcdFN0cmluZy5mcm9tQ2hhckNvZGUoIGhpZ2ggKyAweDEwMDAwICkgOlxuXHRcdFx0XHRTdHJpbmcuZnJvbUNoYXJDb2RlKCBoaWdoID4+IDEwIHwgMHhEODAwLCBoaWdoICYgMHgzRkYgfCAweERDMDAgKTtcblx0fSxcblxuXHQvLyBDU1Mgc3RyaW5nL2lkZW50aWZpZXIgc2VyaWFsaXphdGlvblxuXHQvLyBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3Nzb20vI2NvbW1vbi1zZXJpYWxpemluZy1pZGlvbXNcblx0cmNzc2VzY2FwZSA9IC8oW1xcMC1cXHgxZlxceDdmXXxeLT9cXGQpfF4tJHxbXlxcMC1cXHgxZlxceDdmLVxcdUZGRkZcXHctXS9nLFxuXHRmY3NzZXNjYXBlID0gZnVuY3Rpb24oIGNoLCBhc0NvZGVQb2ludCApIHtcblx0XHRpZiAoIGFzQ29kZVBvaW50ICkge1xuXG5cdFx0XHQvLyBVKzAwMDAgTlVMTCBiZWNvbWVzIFUrRkZGRCBSRVBMQUNFTUVOVCBDSEFSQUNURVJcblx0XHRcdGlmICggY2ggPT09IFwiXFwwXCIgKSB7XG5cdFx0XHRcdHJldHVybiBcIlxcdUZGRkRcIjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29udHJvbCBjaGFyYWN0ZXJzIGFuZCAoZGVwZW5kZW50IHVwb24gcG9zaXRpb24pIG51bWJlcnMgZ2V0IGVzY2FwZWQgYXMgY29kZSBwb2ludHNcblx0XHRcdHJldHVybiBjaC5zbGljZSggMCwgLTEgKSArIFwiXFxcXFwiICtcblx0XHRcdFx0Y2guY2hhckNvZGVBdCggY2gubGVuZ3RoIC0gMSApLnRvU3RyaW5nKCAxNiApICsgXCIgXCI7XG5cdFx0fVxuXG5cdFx0Ly8gT3RoZXIgcG90ZW50aWFsbHktc3BlY2lhbCBBU0NJSSBjaGFyYWN0ZXJzIGdldCBiYWNrc2xhc2gtZXNjYXBlZFxuXHRcdHJldHVybiBcIlxcXFxcIiArIGNoO1xuXHR9LFxuXG5cdC8vIFVzZWQgZm9yIGlmcmFtZXNcblx0Ly8gU2VlIHNldERvY3VtZW50KClcblx0Ly8gUmVtb3ZpbmcgdGhlIGZ1bmN0aW9uIHdyYXBwZXIgY2F1c2VzIGEgXCJQZXJtaXNzaW9uIERlbmllZFwiXG5cdC8vIGVycm9yIGluIElFXG5cdHVubG9hZEhhbmRsZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzZXREb2N1bWVudCgpO1xuXHR9LFxuXG5cdGluRGlzYWJsZWRGaWVsZHNldCA9IGFkZENvbWJpbmF0b3IoXG5cdFx0ZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gdHJ1ZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZmllbGRzZXRcIjtcblx0XHR9LFxuXHRcdHsgZGlyOiBcInBhcmVudE5vZGVcIiwgbmV4dDogXCJsZWdlbmRcIiB9XG5cdCk7XG5cbi8vIE9wdGltaXplIGZvciBwdXNoLmFwcGx5KCBfLCBOb2RlTGlzdCApXG50cnkge1xuXHRwdXNoLmFwcGx5KFxuXHRcdCggYXJyID0gc2xpY2UuY2FsbCggcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMgKSApLFxuXHRcdHByZWZlcnJlZERvYy5jaGlsZE5vZGVzXG5cdCk7XG5cblx0Ly8gU3VwcG9ydDogQW5kcm9pZDw0LjBcblx0Ly8gRGV0ZWN0IHNpbGVudGx5IGZhaWxpbmcgcHVzaC5hcHBseVxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG5cdGFyclsgcHJlZmVycmVkRG9jLmNoaWxkTm9kZXMubGVuZ3RoIF0ubm9kZVR5cGU7XG59IGNhdGNoICggZSApIHtcblx0cHVzaCA9IHsgYXBwbHk6IGFyci5sZW5ndGggP1xuXG5cdFx0Ly8gTGV2ZXJhZ2Ugc2xpY2UgaWYgcG9zc2libGVcblx0XHRmdW5jdGlvbiggdGFyZ2V0LCBlbHMgKSB7XG5cdFx0XHRwdXNoTmF0aXZlLmFwcGx5KCB0YXJnZXQsIHNsaWNlLmNhbGwoIGVscyApICk7XG5cdFx0fSA6XG5cblx0XHQvLyBTdXBwb3J0OiBJRTw5XG5cdFx0Ly8gT3RoZXJ3aXNlIGFwcGVuZCBkaXJlY3RseVxuXHRcdGZ1bmN0aW9uKCB0YXJnZXQsIGVscyApIHtcblx0XHRcdHZhciBqID0gdGFyZ2V0Lmxlbmd0aCxcblx0XHRcdFx0aSA9IDA7XG5cblx0XHRcdC8vIENhbid0IHRydXN0IE5vZGVMaXN0Lmxlbmd0aFxuXHRcdFx0d2hpbGUgKCAoIHRhcmdldFsgaisrIF0gPSBlbHNbIGkrKyBdICkgKSB7fVxuXHRcdFx0dGFyZ2V0Lmxlbmd0aCA9IGogLSAxO1xuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gU2l6emxlKCBzZWxlY3RvciwgY29udGV4dCwgcmVzdWx0cywgc2VlZCApIHtcblx0dmFyIG0sIGksIGVsZW0sIG5pZCwgbWF0Y2gsIGdyb3VwcywgbmV3U2VsZWN0b3IsXG5cdFx0bmV3Q29udGV4dCA9IGNvbnRleHQgJiYgY29udGV4dC5vd25lckRvY3VtZW50LFxuXG5cdFx0Ly8gbm9kZVR5cGUgZGVmYXVsdHMgdG8gOSwgc2luY2UgY29udGV4dCBkZWZhdWx0cyB0byBkb2N1bWVudFxuXHRcdG5vZGVUeXBlID0gY29udGV4dCA/IGNvbnRleHQubm9kZVR5cGUgOiA5O1xuXG5cdHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xuXG5cdC8vIFJldHVybiBlYXJseSBmcm9tIGNhbGxzIHdpdGggaW52YWxpZCBzZWxlY3RvciBvciBjb250ZXh0XG5cdGlmICggdHlwZW9mIHNlbGVjdG9yICE9PSBcInN0cmluZ1wiIHx8ICFzZWxlY3RvciB8fFxuXHRcdG5vZGVUeXBlICE9PSAxICYmIG5vZGVUeXBlICE9PSA5ICYmIG5vZGVUeXBlICE9PSAxMSApIHtcblxuXHRcdHJldHVybiByZXN1bHRzO1xuXHR9XG5cblx0Ly8gVHJ5IHRvIHNob3J0Y3V0IGZpbmQgb3BlcmF0aW9ucyAoYXMgb3Bwb3NlZCB0byBmaWx0ZXJzKSBpbiBIVE1MIGRvY3VtZW50c1xuXHRpZiAoICFzZWVkICkge1xuXHRcdHNldERvY3VtZW50KCBjb250ZXh0ICk7XG5cdFx0Y29udGV4dCA9IGNvbnRleHQgfHwgZG9jdW1lbnQ7XG5cblx0XHRpZiAoIGRvY3VtZW50SXNIVE1MICkge1xuXG5cdFx0XHQvLyBJZiB0aGUgc2VsZWN0b3IgaXMgc3VmZmljaWVudGx5IHNpbXBsZSwgdHJ5IHVzaW5nIGEgXCJnZXQqQnkqXCIgRE9NIG1ldGhvZFxuXHRcdFx0Ly8gKGV4Y2VwdGluZyBEb2N1bWVudEZyYWdtZW50IGNvbnRleHQsIHdoZXJlIHRoZSBtZXRob2RzIGRvbid0IGV4aXN0KVxuXHRcdFx0aWYgKCBub2RlVHlwZSAhPT0gMTEgJiYgKCBtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyggc2VsZWN0b3IgKSApICkge1xuXG5cdFx0XHRcdC8vIElEIHNlbGVjdG9yXG5cdFx0XHRcdGlmICggKCBtID0gbWF0Y2hbIDEgXSApICkge1xuXG5cdFx0XHRcdFx0Ly8gRG9jdW1lbnQgY29udGV4dFxuXHRcdFx0XHRcdGlmICggbm9kZVR5cGUgPT09IDkgKSB7XG5cdFx0XHRcdFx0XHRpZiAoICggZWxlbSA9IGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSApICkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFLCBPcGVyYSwgV2Via2l0XG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGlkZW50aWZ5IHZlcnNpb25zXG5cdFx0XHRcdFx0XHRcdC8vIGdldEVsZW1lbnRCeUlkIGNhbiBtYXRjaCBlbGVtZW50cyBieSBuYW1lIGluc3RlYWQgb2YgSURcblx0XHRcdFx0XHRcdFx0aWYgKCBlbGVtLmlkID09PSBtICkge1xuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIEVsZW1lbnQgY29udGV4dFxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFLCBPcGVyYSwgV2Via2l0XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBpZGVudGlmeSB2ZXJzaW9uc1xuXHRcdFx0XHRcdFx0Ly8gZ2V0RWxlbWVudEJ5SWQgY2FuIG1hdGNoIGVsZW1lbnRzIGJ5IG5hbWUgaW5zdGVhZCBvZiBJRFxuXHRcdFx0XHRcdFx0aWYgKCBuZXdDb250ZXh0ICYmICggZWxlbSA9IG5ld0NvbnRleHQuZ2V0RWxlbWVudEJ5SWQoIG0gKSApICYmXG5cdFx0XHRcdFx0XHRcdGNvbnRhaW5zKCBjb250ZXh0LCBlbGVtICkgJiZcblx0XHRcdFx0XHRcdFx0ZWxlbS5pZCA9PT0gbSApIHtcblxuXHRcdFx0XHRcdFx0XHRyZXN1bHRzLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFR5cGUgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggbWF0Y2hbIDIgXSApIHtcblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBjb250ZXh0LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBzZWxlY3RvciApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cblx0XHRcdFx0Ly8gQ2xhc3Mgc2VsZWN0b3Jcblx0XHRcdFx0fSBlbHNlIGlmICggKCBtID0gbWF0Y2hbIDMgXSApICYmIHN1cHBvcnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSAmJlxuXHRcdFx0XHRcdGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSApIHtcblxuXHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIGNvbnRleHQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggbSApICk7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gVGFrZSBhZHZhbnRhZ2Ugb2YgcXVlcnlTZWxlY3RvckFsbFxuXHRcdFx0aWYgKCBzdXBwb3J0LnFzYSAmJlxuXHRcdFx0XHQhbm9ubmF0aXZlU2VsZWN0b3JDYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdICYmXG5cdFx0XHRcdCggIXJidWdneVFTQSB8fCAhcmJ1Z2d5UVNBLnRlc3QoIHNlbGVjdG9yICkgKSAmJlxuXG5cdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDggb25seVxuXHRcdFx0XHQvLyBFeGNsdWRlIG9iamVjdCBlbGVtZW50c1xuXHRcdFx0XHQoIG5vZGVUeXBlICE9PSAxIHx8IGNvbnRleHQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJvYmplY3RcIiApICkge1xuXG5cdFx0XHRcdG5ld1NlbGVjdG9yID0gc2VsZWN0b3I7XG5cdFx0XHRcdG5ld0NvbnRleHQgPSBjb250ZXh0O1xuXG5cdFx0XHRcdC8vIHFTQSBjb25zaWRlcnMgZWxlbWVudHMgb3V0c2lkZSBhIHNjb3Bpbmcgcm9vdCB3aGVuIGV2YWx1YXRpbmcgY2hpbGQgb3Jcblx0XHRcdFx0Ly8gZGVzY2VuZGFudCBjb21iaW5hdG9ycywgd2hpY2ggaXMgbm90IHdoYXQgd2Ugd2FudC5cblx0XHRcdFx0Ly8gSW4gc3VjaCBjYXNlcywgd2Ugd29yayBhcm91bmQgdGhlIGJlaGF2aW9yIGJ5IHByZWZpeGluZyBldmVyeSBzZWxlY3RvciBpbiB0aGVcblx0XHRcdFx0Ly8gbGlzdCB3aXRoIGFuIElEIHNlbGVjdG9yIHJlZmVyZW5jaW5nIHRoZSBzY29wZSBjb250ZXh0LlxuXHRcdFx0XHQvLyBUaGUgdGVjaG5pcXVlIGhhcyB0byBiZSB1c2VkIGFzIHdlbGwgd2hlbiBhIGxlYWRpbmcgY29tYmluYXRvciBpcyB1c2VkXG5cdFx0XHRcdC8vIGFzIHN1Y2ggc2VsZWN0b3JzIGFyZSBub3QgcmVjb2duaXplZCBieSBxdWVyeVNlbGVjdG9yQWxsLlxuXHRcdFx0XHQvLyBUaGFua3MgdG8gQW5kcmV3IER1cG9udCBmb3IgdGhpcyB0ZWNobmlxdWUuXG5cdFx0XHRcdGlmICggbm9kZVR5cGUgPT09IDEgJiZcblx0XHRcdFx0XHQoIHJkZXNjZW5kLnRlc3QoIHNlbGVjdG9yICkgfHwgcmNvbWJpbmF0b3JzLnRlc3QoIHNlbGVjdG9yICkgKSApIHtcblxuXHRcdFx0XHRcdC8vIEV4cGFuZCBjb250ZXh0IGZvciBzaWJsaW5nIHNlbGVjdG9yc1xuXHRcdFx0XHRcdG5ld0NvbnRleHQgPSByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fFxuXHRcdFx0XHRcdFx0Y29udGV4dDtcblxuXHRcdFx0XHRcdC8vIFdlIGNhbiB1c2UgOnNjb3BlIGluc3RlYWQgb2YgdGhlIElEIGhhY2sgaWYgdGhlIGJyb3dzZXJcblx0XHRcdFx0XHQvLyBzdXBwb3J0cyBpdCAmIGlmIHdlJ3JlIG5vdCBjaGFuZ2luZyB0aGUgY29udGV4dC5cblx0XHRcdFx0XHRpZiAoIG5ld0NvbnRleHQgIT09IGNvbnRleHQgfHwgIXN1cHBvcnQuc2NvcGUgKSB7XG5cblx0XHRcdFx0XHRcdC8vIENhcHR1cmUgdGhlIGNvbnRleHQgSUQsIHNldHRpbmcgaXQgZmlyc3QgaWYgbmVjZXNzYXJ5XG5cdFx0XHRcdFx0XHRpZiAoICggbmlkID0gY29udGV4dC5nZXRBdHRyaWJ1dGUoIFwiaWRcIiApICkgKSB7XG5cdFx0XHRcdFx0XHRcdG5pZCA9IG5pZC5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb250ZXh0LnNldEF0dHJpYnV0ZSggXCJpZFwiLCAoIG5pZCA9IGV4cGFuZG8gKSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFByZWZpeCBldmVyeSBzZWxlY3RvciBpbiB0aGUgbGlzdFxuXHRcdFx0XHRcdGdyb3VwcyA9IHRva2VuaXplKCBzZWxlY3RvciApO1xuXHRcdFx0XHRcdGkgPSBncm91cHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0Z3JvdXBzWyBpIF0gPSAoIG5pZCA/IFwiI1wiICsgbmlkIDogXCI6c2NvcGVcIiApICsgXCIgXCIgK1xuXHRcdFx0XHRcdFx0XHR0b1NlbGVjdG9yKCBncm91cHNbIGkgXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXdTZWxlY3RvciA9IGdyb3Vwcy5qb2luKCBcIixcIiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLFxuXHRcdFx0XHRcdFx0bmV3Q29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCBuZXdTZWxlY3RvciApXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHRcdFx0fSBjYXRjaCAoIHFzYUVycm9yICkge1xuXHRcdFx0XHRcdG5vbm5hdGl2ZVNlbGVjdG9yQ2FjaGUoIHNlbGVjdG9yLCB0cnVlICk7XG5cdFx0XHRcdH0gZmluYWxseSB7XG5cdFx0XHRcdFx0aWYgKCBuaWQgPT09IGV4cGFuZG8gKSB7XG5cdFx0XHRcdFx0XHRjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSggXCJpZFwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWxsIG90aGVyc1xuXHRyZXR1cm4gc2VsZWN0KCBzZWxlY3Rvci5yZXBsYWNlKCBydHJpbSwgXCIkMVwiICksIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUga2V5LXZhbHVlIGNhY2hlcyBvZiBsaW1pdGVkIHNpemVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl9IFJldHVybnMgdGhlIE9iamVjdCBkYXRhIGFmdGVyIHN0b3JpbmcgaXQgb24gaXRzZWxmIHdpdGhcbiAqXHRwcm9wZXJ0eSBuYW1lIHRoZSAoc3BhY2Utc3VmZml4ZWQpIHN0cmluZyBhbmQgKGlmIHRoZSBjYWNoZSBpcyBsYXJnZXIgdGhhbiBFeHByLmNhY2hlTGVuZ3RoKVxuICpcdGRlbGV0aW5nIHRoZSBvbGRlc3QgZW50cnlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlQ2FjaGUoKSB7XG5cdHZhciBrZXlzID0gW107XG5cblx0ZnVuY3Rpb24gY2FjaGUoIGtleSwgdmFsdWUgKSB7XG5cblx0XHQvLyBVc2UgKGtleSArIFwiIFwiKSB0byBhdm9pZCBjb2xsaXNpb24gd2l0aCBuYXRpdmUgcHJvdG90eXBlIHByb3BlcnRpZXMgKHNlZSBJc3N1ZSAjMTU3KVxuXHRcdGlmICgga2V5cy5wdXNoKCBrZXkgKyBcIiBcIiApID4gRXhwci5jYWNoZUxlbmd0aCApIHtcblxuXHRcdFx0Ly8gT25seSBrZWVwIHRoZSBtb3N0IHJlY2VudCBlbnRyaWVzXG5cdFx0XHRkZWxldGUgY2FjaGVbIGtleXMuc2hpZnQoKSBdO1xuXHRcdH1cblx0XHRyZXR1cm4gKCBjYWNoZVsga2V5ICsgXCIgXCIgXSA9IHZhbHVlICk7XG5cdH1cblx0cmV0dXJuIGNhY2hlO1xufVxuXG4vKipcbiAqIE1hcmsgYSBmdW5jdGlvbiBmb3Igc3BlY2lhbCB1c2UgYnkgU2l6emxlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWFya1xuICovXG5mdW5jdGlvbiBtYXJrRnVuY3Rpb24oIGZuICkge1xuXHRmblsgZXhwYW5kbyBdID0gdHJ1ZTtcblx0cmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIFN1cHBvcnQgdGVzdGluZyB1c2luZyBhbiBlbGVtZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBQYXNzZWQgdGhlIGNyZWF0ZWQgZWxlbWVudCBhbmQgcmV0dXJucyBhIGJvb2xlYW4gcmVzdWx0XG4gKi9cbmZ1bmN0aW9uIGFzc2VydCggZm4gKSB7XG5cdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZmllbGRzZXRcIiApO1xuXG5cdHRyeSB7XG5cdFx0cmV0dXJuICEhZm4oIGVsICk7XG5cdH0gY2F0Y2ggKCBlICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fSBmaW5hbGx5IHtcblxuXHRcdC8vIFJlbW92ZSBmcm9tIGl0cyBwYXJlbnQgYnkgZGVmYXVsdFxuXHRcdGlmICggZWwucGFyZW50Tm9kZSApIHtcblx0XHRcdGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGVsICk7XG5cdFx0fVxuXG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaW4gSUVcblx0XHRlbCA9IG51bGw7XG5cdH1cbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBzYW1lIGhhbmRsZXIgZm9yIGFsbCBvZiB0aGUgc3BlY2lmaWVkIGF0dHJzXG4gKiBAcGFyYW0ge1N0cmluZ30gYXR0cnMgUGlwZS1zZXBhcmF0ZWQgbGlzdCBvZiBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBtZXRob2QgdGhhdCB3aWxsIGJlIGFwcGxpZWRcbiAqL1xuZnVuY3Rpb24gYWRkSGFuZGxlKCBhdHRycywgaGFuZGxlciApIHtcblx0dmFyIGFyciA9IGF0dHJzLnNwbGl0KCBcInxcIiApLFxuXHRcdGkgPSBhcnIubGVuZ3RoO1xuXG5cdHdoaWxlICggaS0tICkge1xuXHRcdEV4cHIuYXR0ckhhbmRsZVsgYXJyWyBpIF0gXSA9IGhhbmRsZXI7XG5cdH1cbn1cblxuLyoqXG4gKiBDaGVja3MgZG9jdW1lbnQgb3JkZXIgb2YgdHdvIHNpYmxpbmdzXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYlxuICogQHJldHVybnMge051bWJlcn0gUmV0dXJucyBsZXNzIHRoYW4gMCBpZiBhIHByZWNlZGVzIGIsIGdyZWF0ZXIgdGhhbiAwIGlmIGEgZm9sbG93cyBiXG4gKi9cbmZ1bmN0aW9uIHNpYmxpbmdDaGVjayggYSwgYiApIHtcblx0dmFyIGN1ciA9IGIgJiYgYSxcblx0XHRkaWZmID0gY3VyICYmIGEubm9kZVR5cGUgPT09IDEgJiYgYi5ub2RlVHlwZSA9PT0gMSAmJlxuXHRcdFx0YS5zb3VyY2VJbmRleCAtIGIuc291cmNlSW5kZXg7XG5cblx0Ly8gVXNlIElFIHNvdXJjZUluZGV4IGlmIGF2YWlsYWJsZSBvbiBib3RoIG5vZGVzXG5cdGlmICggZGlmZiApIHtcblx0XHRyZXR1cm4gZGlmZjtcblx0fVxuXG5cdC8vIENoZWNrIGlmIGIgZm9sbG93cyBhXG5cdGlmICggY3VyICkge1xuXHRcdHdoaWxlICggKCBjdXIgPSBjdXIubmV4dFNpYmxpbmcgKSApIHtcblx0XHRcdGlmICggY3VyID09PSBiICkge1xuXHRcdFx0XHRyZXR1cm4gLTE7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGEgPyAxIDogLTE7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBpbnB1dCB0eXBlc1xuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlSW5wdXRQc2V1ZG8oIHR5cGUgKSB7XG5cdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHR2YXIgbmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gdHlwZTtcblx0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdG8gdXNlIGluIHBzZXVkb3MgZm9yIGJ1dHRvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJ1dHRvblBzZXVkbyggdHlwZSApIHtcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdHZhciBuYW1lID0gZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiAoIG5hbWUgPT09IFwiaW5wdXRcIiB8fCBuYW1lID09PSBcImJ1dHRvblwiICkgJiYgZWxlbS50eXBlID09PSB0eXBlO1xuXHR9O1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiB0byB1c2UgaW4gcHNldWRvcyBmb3IgOmVuYWJsZWQvOmRpc2FibGVkXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRpc2FibGVkIHRydWUgZm9yIDpkaXNhYmxlZDsgZmFsc2UgZm9yIDplbmFibGVkXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURpc2FibGVkUHNldWRvKCBkaXNhYmxlZCApIHtcblxuXHQvLyBLbm93biA6ZGlzYWJsZWQgZmFsc2UgcG9zaXRpdmVzOiBmaWVsZHNldFtkaXNhYmxlZF0gPiBsZWdlbmQ6bnRoLW9mLXR5cGUobisyKSA6Y2FuLWRpc2FibGVcblx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0Ly8gT25seSBjZXJ0YWluIGVsZW1lbnRzIGNhbiBtYXRjaCA6ZW5hYmxlZCBvciA6ZGlzYWJsZWRcblx0XHQvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9zY3JpcHRpbmcuaHRtbCNzZWxlY3Rvci1lbmFibGVkXG5cdFx0Ly8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2NyaXB0aW5nLmh0bWwjc2VsZWN0b3ItZGlzYWJsZWRcblx0XHRpZiAoIFwiZm9ybVwiIGluIGVsZW0gKSB7XG5cblx0XHRcdC8vIENoZWNrIGZvciBpbmhlcml0ZWQgZGlzYWJsZWRuZXNzIG9uIHJlbGV2YW50IG5vbi1kaXNhYmxlZCBlbGVtZW50czpcblx0XHRcdC8vICogbGlzdGVkIGZvcm0tYXNzb2NpYXRlZCBlbGVtZW50cyBpbiBhIGRpc2FibGVkIGZpZWxkc2V0XG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY2F0ZWdvcnktbGlzdGVkXG5cdFx0XHQvLyAgIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Zvcm1zLmh0bWwjY29uY2VwdC1mZS1kaXNhYmxlZFxuXHRcdFx0Ly8gKiBvcHRpb24gZWxlbWVudHMgaW4gYSBkaXNhYmxlZCBvcHRncm91cFxuXHRcdFx0Ly8gICBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9mb3Jtcy5odG1sI2NvbmNlcHQtb3B0aW9uLWRpc2FibGVkXG5cdFx0XHQvLyBBbGwgc3VjaCBlbGVtZW50cyBoYXZlIGEgXCJmb3JtXCIgcHJvcGVydHkuXG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSAmJiBlbGVtLmRpc2FibGVkID09PSBmYWxzZSApIHtcblxuXHRcdFx0XHQvLyBPcHRpb24gZWxlbWVudHMgZGVmZXIgdG8gYSBwYXJlbnQgb3B0Z3JvdXAgaWYgcHJlc2VudFxuXHRcdFx0XHRpZiAoIFwibGFiZWxcIiBpbiBlbGVtICkge1xuXHRcdFx0XHRcdGlmICggXCJsYWJlbFwiIGluIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtLnBhcmVudE5vZGUuZGlzYWJsZWQgPT09IGRpc2FibGVkO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgNiAtIDExXG5cdFx0XHRcdC8vIFVzZSB0aGUgaXNEaXNhYmxlZCBzaG9ydGN1dCBwcm9wZXJ0eSB0byBjaGVjayBmb3IgZGlzYWJsZWQgZmllbGRzZXQgYW5jZXN0b3JzXG5cdFx0XHRcdHJldHVybiBlbGVtLmlzRGlzYWJsZWQgPT09IGRpc2FibGVkIHx8XG5cblx0XHRcdFx0XHQvLyBXaGVyZSB0aGVyZSBpcyBubyBpc0Rpc2FibGVkLCBjaGVjayBtYW51YWxseVxuXHRcdFx0XHRcdC8qIGpzaGludCAtVzAxOCAqL1xuXHRcdFx0XHRcdGVsZW0uaXNEaXNhYmxlZCAhPT0gIWRpc2FibGVkICYmXG5cdFx0XHRcdFx0aW5EaXNhYmxlZEZpZWxkc2V0KCBlbGVtICkgPT09IGRpc2FibGVkO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cblx0XHQvLyBUcnkgdG8gd2lubm93IG91dCBlbGVtZW50cyB0aGF0IGNhbid0IGJlIGRpc2FibGVkIGJlZm9yZSB0cnVzdGluZyB0aGUgZGlzYWJsZWQgcHJvcGVydHkuXG5cdFx0Ly8gU29tZSB2aWN0aW1zIGdldCBjYXVnaHQgaW4gb3VyIG5ldCAobGFiZWwsIGxlZ2VuZCwgbWVudSwgdHJhY2spLCBidXQgaXQgc2hvdWxkbid0XG5cdFx0Ly8gZXZlbiBleGlzdCBvbiB0aGVtLCBsZXQgYWxvbmUgaGF2ZSBhIGJvb2xlYW4gdmFsdWUuXG5cdFx0fSBlbHNlIGlmICggXCJsYWJlbFwiIGluIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kaXNhYmxlZCA9PT0gZGlzYWJsZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtYWluaW5nIGVsZW1lbnRzIGFyZSBuZWl0aGVyIDplbmFibGVkIG5vciA6ZGlzYWJsZWRcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH07XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVzZSBpbiBwc2V1ZG9zIGZvciBwb3NpdGlvbmFsc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZm4gKSB7XG5cdHJldHVybiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBhcmd1bWVudCApIHtcblx0XHRhcmd1bWVudCA9ICthcmd1bWVudDtcblx0XHRyZXR1cm4gbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcyApIHtcblx0XHRcdHZhciBqLFxuXHRcdFx0XHRtYXRjaEluZGV4ZXMgPSBmbiggW10sIHNlZWQubGVuZ3RoLCBhcmd1bWVudCApLFxuXHRcdFx0XHRpID0gbWF0Y2hJbmRleGVzLmxlbmd0aDtcblxuXHRcdFx0Ly8gTWF0Y2ggZWxlbWVudHMgZm91bmQgYXQgdGhlIHNwZWNpZmllZCBpbmRleGVzXG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCBzZWVkWyAoIGogPSBtYXRjaEluZGV4ZXNbIGkgXSApIF0gKSB7XG5cdFx0XHRcdFx0c2VlZFsgaiBdID0gISggbWF0Y2hlc1sgaiBdID0gc2VlZFsgaiBdICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9ICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgYSBub2RlIGZvciB2YWxpZGl0eSBhcyBhIFNpenpsZSBjb250ZXh0XG4gKiBAcGFyYW0ge0VsZW1lbnR8T2JqZWN0PX0gY29udGV4dFxuICogQHJldHVybnMge0VsZW1lbnR8T2JqZWN0fEJvb2xlYW59IFRoZSBpbnB1dCBub2RlIGlmIGFjY2VwdGFibGUsIG90aGVyd2lzZSBhIGZhbHN5IHZhbHVlXG4gKi9cbmZ1bmN0aW9uIHRlc3RDb250ZXh0KCBjb250ZXh0ICkge1xuXHRyZXR1cm4gY29udGV4dCAmJiB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb250ZXh0O1xufVxuXG4vLyBFeHBvc2Ugc3VwcG9ydCB2YXJzIGZvciBjb252ZW5pZW5jZVxuc3VwcG9ydCA9IFNpenpsZS5zdXBwb3J0ID0ge307XG5cbi8qKlxuICogRGV0ZWN0cyBYTUwgbm9kZXNcbiAqIEBwYXJhbSB7RWxlbWVudHxPYmplY3R9IGVsZW0gQW4gZWxlbWVudCBvciBhIGRvY3VtZW50XG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gVHJ1ZSBpZmYgZWxlbSBpcyBhIG5vbi1IVE1MIFhNTCBub2RlXG4gKi9cbmlzWE1MID0gU2l6emxlLmlzWE1MID0gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdHZhciBuYW1lc3BhY2UgPSBlbGVtICYmIGVsZW0ubmFtZXNwYWNlVVJJLFxuXHRcdGRvY0VsZW0gPSBlbGVtICYmICggZWxlbS5vd25lckRvY3VtZW50IHx8IGVsZW0gKS5kb2N1bWVudEVsZW1lbnQ7XG5cblx0Ly8gU3VwcG9ydDogSUUgPD04XG5cdC8vIEFzc3VtZSBIVE1MIHdoZW4gZG9jdW1lbnRFbGVtZW50IGRvZXNuJ3QgeWV0IGV4aXN0LCBzdWNoIGFzIGluc2lkZSBsb2FkaW5nIGlmcmFtZXNcblx0Ly8gaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzQ4MzNcblx0cmV0dXJuICFyaHRtbC50ZXN0KCBuYW1lc3BhY2UgfHwgZG9jRWxlbSAmJiBkb2NFbGVtLm5vZGVOYW1lIHx8IFwiSFRNTFwiICk7XG59O1xuXG4vKipcbiAqIFNldHMgZG9jdW1lbnQtcmVsYXRlZCB2YXJpYWJsZXMgb25jZSBiYXNlZCBvbiB0aGUgY3VycmVudCBkb2N1bWVudFxuICogQHBhcmFtIHtFbGVtZW50fE9iamVjdH0gW2RvY10gQW4gZWxlbWVudCBvciBkb2N1bWVudCBvYmplY3QgdG8gdXNlIHRvIHNldCB0aGUgZG9jdW1lbnRcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGN1cnJlbnQgZG9jdW1lbnRcbiAqL1xuc2V0RG9jdW1lbnQgPSBTaXp6bGUuc2V0RG9jdW1lbnQgPSBmdW5jdGlvbiggbm9kZSApIHtcblx0dmFyIGhhc0NvbXBhcmUsIHN1YldpbmRvdyxcblx0XHRkb2MgPSBub2RlID8gbm9kZS5vd25lckRvY3VtZW50IHx8IG5vZGUgOiBwcmVmZXJyZWREb2M7XG5cblx0Ly8gUmV0dXJuIGVhcmx5IGlmIGRvYyBpcyBpbnZhbGlkIG9yIGFscmVhZHkgc2VsZWN0ZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCBkb2MgPT0gZG9jdW1lbnQgfHwgZG9jLm5vZGVUeXBlICE9PSA5IHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50ICkge1xuXHRcdHJldHVybiBkb2N1bWVudDtcblx0fVxuXG5cdC8vIFVwZGF0ZSBnbG9iYWwgdmFyaWFibGVzXG5cdGRvY3VtZW50ID0gZG9jO1xuXHRkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHRkb2N1bWVudElzSFRNTCA9ICFpc1hNTCggZG9jdW1lbnQgKTtcblxuXHQvLyBTdXBwb3J0OiBJRSA5IC0gMTErLCBFZGdlIDEyIC0gMTgrXG5cdC8vIEFjY2Vzc2luZyBpZnJhbWUgZG9jdW1lbnRzIGFmdGVyIHVubG9hZCB0aHJvd3MgXCJwZXJtaXNzaW9uIGRlbmllZFwiIGVycm9ycyAoalF1ZXJ5ICMxMzkzNilcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCBwcmVmZXJyZWREb2MgIT0gZG9jdW1lbnQgJiZcblx0XHQoIHN1YldpbmRvdyA9IGRvY3VtZW50LmRlZmF1bHRWaWV3ICkgJiYgc3ViV2luZG93LnRvcCAhPT0gc3ViV2luZG93ICkge1xuXG5cdFx0Ly8gU3VwcG9ydDogSUUgMTEsIEVkZ2Vcblx0XHRpZiAoIHN1YldpbmRvdy5hZGRFdmVudExpc3RlbmVyICkge1xuXHRcdFx0c3ViV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoIFwidW5sb2FkXCIsIHVubG9hZEhhbmRsZXIsIGZhbHNlICk7XG5cblx0XHQvLyBTdXBwb3J0OiBJRSA5IC0gMTAgb25seVxuXHRcdH0gZWxzZSBpZiAoIHN1YldpbmRvdy5hdHRhY2hFdmVudCApIHtcblx0XHRcdHN1YldpbmRvdy5hdHRhY2hFdmVudCggXCJvbnVubG9hZFwiLCB1bmxvYWRIYW5kbGVyICk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU3VwcG9ydDogSUUgOCAtIDExKywgRWRnZSAxMiAtIDE4KywgQ2hyb21lIDw9MTYgLSAyNSBvbmx5LCBGaXJlZm94IDw9My42IC0gMzEgb25seSxcblx0Ly8gU2FmYXJpIDQgLSA1IG9ubHksIE9wZXJhIDw9MTEuNiAtIDEyLnggb25seVxuXHQvLyBJRS9FZGdlICYgb2xkZXIgYnJvd3NlcnMgZG9uJ3Qgc3VwcG9ydCB0aGUgOnNjb3BlIHBzZXVkby1jbGFzcy5cblx0Ly8gU3VwcG9ydDogU2FmYXJpIDYuMCBvbmx5XG5cdC8vIFNhZmFyaSA2LjAgc3VwcG9ydHMgOnNjb3BlIGJ1dCBpdCdzIGFuIGFsaWFzIG9mIDpyb290IHRoZXJlLlxuXHRzdXBwb3J0LnNjb3BlID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApICk7XG5cdFx0cmV0dXJuIHR5cGVvZiBlbC5xdWVyeVNlbGVjdG9yQWxsICE9PSBcInVuZGVmaW5lZFwiICYmXG5cdFx0XHQhZWwucXVlcnlTZWxlY3RvckFsbCggXCI6c2NvcGUgZmllbGRzZXQgZGl2XCIgKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvKiBBdHRyaWJ1dGVzXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBTdXBwb3J0OiBJRTw4XG5cdC8vIFZlcmlmeSB0aGF0IGdldEF0dHJpYnV0ZSByZWFsbHkgcmV0dXJucyBhdHRyaWJ1dGVzIGFuZCBub3QgcHJvcGVydGllc1xuXHQvLyAoZXhjZXB0aW5nIElFOCBib29sZWFucylcblx0c3VwcG9ydC5hdHRyaWJ1dGVzID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZWwuY2xhc3NOYW1lID0gXCJpXCI7XG5cdFx0cmV0dXJuICFlbC5nZXRBdHRyaWJ1dGUoIFwiY2xhc3NOYW1lXCIgKTtcblx0fSApO1xuXG5cdC8qIGdldEVsZW1lbnQocylCeSpcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8vIENoZWNrIGlmIGdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSByZXR1cm5zIG9ubHkgZWxlbWVudHNcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdGVsLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVDb21tZW50KCBcIlwiICkgKTtcblx0XHRyZXR1cm4gIWVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBcIipcIiApLmxlbmd0aDtcblx0fSApO1xuXG5cdC8vIFN1cHBvcnQ6IElFPDlcblx0c3VwcG9ydC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gcm5hdGl2ZS50ZXN0KCBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lICk7XG5cblx0Ly8gU3VwcG9ydDogSUU8MTBcblx0Ly8gQ2hlY2sgaWYgZ2V0RWxlbWVudEJ5SWQgcmV0dXJucyBlbGVtZW50cyBieSBuYW1lXG5cdC8vIFRoZSBicm9rZW4gZ2V0RWxlbWVudEJ5SWQgbWV0aG9kcyBkb24ndCBwaWNrIHVwIHByb2dyYW1tYXRpY2FsbHktc2V0IG5hbWVzLFxuXHQvLyBzbyB1c2UgYSByb3VuZGFib3V0IGdldEVsZW1lbnRzQnlOYW1lIHRlc3Rcblx0c3VwcG9ydC5nZXRCeUlkID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5pZCA9IGV4cGFuZG87XG5cdFx0cmV0dXJuICFkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSB8fCAhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoIGV4cGFuZG8gKS5sZW5ndGg7XG5cdH0gKTtcblxuXHQvLyBJRCBmaWx0ZXIgYW5kIGZpbmRcblx0aWYgKCBzdXBwb3J0LmdldEJ5SWQgKSB7XG5cdFx0RXhwci5maWx0ZXJbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZSggXCJpZFwiICkgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblx0XHRFeHByLmZpbmRbIFwiSURcIiBdID0gZnVuY3Rpb24oIGlkLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50QnlJZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkb2N1bWVudElzSFRNTCApIHtcblx0XHRcdFx0dmFyIGVsZW0gPSBjb250ZXh0LmdldEVsZW1lbnRCeUlkKCBpZCApO1xuXHRcdFx0XHRyZXR1cm4gZWxlbSA/IFsgZWxlbSBdIDogW107XG5cdFx0XHR9XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRFeHByLmZpbHRlclsgXCJJRFwiIF0gPSAgZnVuY3Rpb24oIGlkICkge1xuXHRcdFx0dmFyIGF0dHJJZCA9IGlkLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRcdHZhciBub2RlID0gdHlwZW9mIGVsZW0uZ2V0QXR0cmlidXRlTm9kZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0XHRcdGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggXCJpZFwiICk7XG5cdFx0XHRcdHJldHVybiBub2RlICYmIG5vZGUudmFsdWUgPT09IGF0dHJJZDtcblx0XHRcdH07XG5cdFx0fTtcblxuXHRcdC8vIFN1cHBvcnQ6IElFIDYgLSA3IG9ubHlcblx0XHQvLyBnZXRFbGVtZW50QnlJZCBpcyBub3QgcmVsaWFibGUgYXMgYSBmaW5kIHNob3J0Y3V0XG5cdFx0RXhwci5maW5kWyBcIklEXCIgXSA9IGZ1bmN0aW9uKCBpZCwgY29udGV4dCApIHtcblx0XHRcdGlmICggdHlwZW9mIGNvbnRleHQuZ2V0RWxlbWVudEJ5SWQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRcdHZhciBub2RlLCBpLCBlbGVtcyxcblx0XHRcdFx0XHRlbGVtID0gY29udGV4dC5nZXRFbGVtZW50QnlJZCggaWQgKTtcblxuXHRcdFx0XHRpZiAoIGVsZW0gKSB7XG5cblx0XHRcdFx0XHQvLyBWZXJpZnkgdGhlIGlkIGF0dHJpYnV0ZVxuXHRcdFx0XHRcdG5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdGlmICggbm9kZSAmJiBub2RlLnZhbHVlID09PSBpZCApIHtcblx0XHRcdFx0XHRcdHJldHVybiBbIGVsZW0gXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBGYWxsIGJhY2sgb24gZ2V0RWxlbWVudHNCeU5hbWVcblx0XHRcdFx0XHRlbGVtcyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeU5hbWUoIGlkICk7XG5cdFx0XHRcdFx0aSA9IDA7XG5cdFx0XHRcdFx0d2hpbGUgKCAoIGVsZW0gPSBlbGVtc1sgaSsrIF0gKSApIHtcblx0XHRcdFx0XHRcdG5vZGUgPSBlbGVtLmdldEF0dHJpYnV0ZU5vZGUoIFwiaWRcIiApO1xuXHRcdFx0XHRcdFx0aWYgKCBub2RlICYmIG5vZGUudmFsdWUgPT09IGlkICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gWyBlbGVtIF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvLyBUYWdcblx0RXhwci5maW5kWyBcIlRBR1wiIF0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlUYWdOYW1lID9cblx0XHRmdW5jdGlvbiggdGFnLCBjb250ZXh0ICkge1xuXHRcdFx0aWYgKCB0eXBlb2YgY29udGV4dC5nZXRFbGVtZW50c0J5VGFnTmFtZSAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBEb2N1bWVudEZyYWdtZW50IG5vZGVzIGRvbid0IGhhdmUgZ0VCVE5cblx0XHRcdH0gZWxzZSBpZiAoIHN1cHBvcnQucXNhICkge1xuXHRcdFx0XHRyZXR1cm4gY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKCB0YWcgKTtcblx0XHRcdH1cblx0XHR9IDpcblxuXHRcdGZ1bmN0aW9uKCB0YWcsIGNvbnRleHQgKSB7XG5cdFx0XHR2YXIgZWxlbSxcblx0XHRcdFx0dG1wID0gW10sXG5cdFx0XHRcdGkgPSAwLFxuXG5cdFx0XHRcdC8vIEJ5IGhhcHB5IGNvaW5jaWRlbmNlLCBhIChicm9rZW4pIGdFQlROIGFwcGVhcnMgb24gRG9jdW1lbnRGcmFnbWVudCBub2RlcyB0b29cblx0XHRcdFx0cmVzdWx0cyA9IGNvbnRleHQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoIHRhZyApO1xuXG5cdFx0XHQvLyBGaWx0ZXIgb3V0IHBvc3NpYmxlIGNvbW1lbnRzXG5cdFx0XHRpZiAoIHRhZyA9PT0gXCIqXCIgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgKSB7XG5cdFx0XHRcdFx0XHR0bXAucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0bXA7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9O1xuXG5cdC8vIENsYXNzXG5cdEV4cHIuZmluZFsgXCJDTEFTU1wiIF0gPSBzdXBwb3J0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgJiYgZnVuY3Rpb24oIGNsYXNzTmFtZSwgY29udGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiBjb250ZXh0LmdldEVsZW1lbnRzQnlDbGFzc05hbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnRJc0hUTUwgKSB7XG5cdFx0XHRyZXR1cm4gY29udGV4dC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBjbGFzc05hbWUgKTtcblx0XHR9XG5cdH07XG5cblx0LyogUVNBL21hdGNoZXNTZWxlY3RvclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0Ly8gUVNBIGFuZCBtYXRjaGVzU2VsZWN0b3Igc3VwcG9ydFxuXG5cdC8vIG1hdGNoZXNTZWxlY3Rvcig6YWN0aXZlKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoSUU5L09wZXJhIDExLjUpXG5cdHJidWdneU1hdGNoZXMgPSBbXTtcblxuXHQvLyBxU2EoOmZvY3VzKSByZXBvcnRzIGZhbHNlIHdoZW4gdHJ1ZSAoQ2hyb21lIDIxKVxuXHQvLyBXZSBhbGxvdyB0aGlzIGJlY2F1c2Ugb2YgYSBidWcgaW4gSUU4LzkgdGhhdCB0aHJvd3MgYW4gZXJyb3Jcblx0Ly8gd2hlbmV2ZXIgYGRvY3VtZW50LmFjdGl2ZUVsZW1lbnRgIGlzIGFjY2Vzc2VkIG9uIGFuIGlmcmFtZVxuXHQvLyBTbywgd2UgYWxsb3cgOmZvY3VzIHRvIHBhc3MgdGhyb3VnaCBRU0EgYWxsIHRoZSB0aW1lIHRvIGF2b2lkIHRoZSBJRSBlcnJvclxuXHQvLyBTZWUgaHR0cHM6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzEzMzc4XG5cdHJidWdneVFTQSA9IFtdO1xuXG5cdGlmICggKCBzdXBwb3J0LnFzYSA9IHJuYXRpdmUudGVzdCggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCApICkgKSB7XG5cblx0XHQvLyBCdWlsZCBRU0EgcmVnZXhcblx0XHQvLyBSZWdleCBzdHJhdGVneSBhZG9wdGVkIGZyb20gRGllZ28gUGVyaW5pXG5cdFx0YXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0XHRcdHZhciBpbnB1dDtcblxuXHRcdFx0Ly8gU2VsZWN0IGlzIHNldCB0byBlbXB0eSBzdHJpbmcgb24gcHVycG9zZVxuXHRcdFx0Ly8gVGhpcyBpcyB0byB0ZXN0IElFJ3MgdHJlYXRtZW50IG9mIG5vdCBleHBsaWNpdGx5XG5cdFx0XHQvLyBzZXR0aW5nIGEgYm9vbGVhbiBjb250ZW50IGF0dHJpYnV0ZSxcblx0XHRcdC8vIHNpbmNlIGl0cyBwcmVzZW5jZSBzaG91bGQgYmUgZW5vdWdoXG5cdFx0XHQvLyBodHRwczovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvMTIzNTlcblx0XHRcdGRvY0VsZW0uYXBwZW5kQ2hpbGQoIGVsICkuaW5uZXJIVE1MID0gXCI8YSBpZD0nXCIgKyBleHBhbmRvICsgXCInPjwvYT5cIiArXG5cdFx0XHRcdFwiPHNlbGVjdCBpZD0nXCIgKyBleHBhbmRvICsgXCItXFxyXFxcXCcgbXNhbGxvd2NhcHR1cmU9Jyc+XCIgK1xuXHRcdFx0XHRcIjxvcHRpb24gc2VsZWN0ZWQ9Jyc+PC9vcHRpb24+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOCwgT3BlcmEgMTEtMTIuMTZcblx0XHRcdC8vIE5vdGhpbmcgc2hvdWxkIGJlIHNlbGVjdGVkIHdoZW4gZW1wdHkgc3RyaW5ncyBmb2xsb3cgXj0gb3IgJD0gb3IgKj1cblx0XHRcdC8vIFRoZSB0ZXN0IGF0dHJpYnV0ZSBtdXN0IGJlIHVua25vd24gaW4gT3BlcmEgYnV0IFwic2FmZVwiIGZvciBXaW5SVFxuXHRcdFx0Ly8gaHR0cHM6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9oaDQ2NTM4OC5hc3B4I2F0dHJpYnV0ZV9zZWN0aW9uXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW21zYWxsb3djYXB0dXJlXj0nJ11cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiWypeJF09XCIgKyB3aGl0ZXNwYWNlICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogSUU4XG5cdFx0XHQvLyBCb29sZWFuIGF0dHJpYnV0ZXMgYW5kIFwidmFsdWVcIiBhcmUgbm90IHRyZWF0ZWQgY29ycmVjdGx5XG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltzZWxlY3RlZF1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIiooPzp2YWx1ZXxcIiArIGJvb2xlYW5zICsgXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogQ2hyb21lPDI5LCBBbmRyb2lkPDQuNCwgU2FmYXJpPDcuMCssIGlPUzw3LjArLCBQaGFudG9tSlM8MS45LjgrXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIltpZH49XCIgKyBleHBhbmRvICsgXCItXVwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCJ+PVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNSAtIDE4K1xuXHRcdFx0Ly8gSUUgMTEvRWRnZSBkb24ndCBmaW5kIGVsZW1lbnRzIG9uIGEgYFtuYW1lPScnXWAgcXVlcnkgaW4gc29tZSBjYXNlcy5cblx0XHRcdC8vIEFkZGluZyBhIHRlbXBvcmFyeSBhdHRyaWJ1dGUgdG8gdGhlIGRvY3VtZW50IGJlZm9yZSB0aGUgc2VsZWN0aW9uIHdvcmtzXG5cdFx0XHQvLyBhcm91bmQgdGhlIGlzc3VlLlxuXHRcdFx0Ly8gSW50ZXJlc3RpbmdseSwgSUUgMTAgJiBvbGRlciBkb24ndCBzZWVtIHRvIGhhdmUgdGhlIGlzc3VlLlxuXHRcdFx0aW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcblx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiXCIgKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKCBpbnB1dCApO1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCJbbmFtZT0nJ11cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiXFxcXFtcIiArIHdoaXRlc3BhY2UgKyBcIipuYW1lXCIgKyB3aGl0ZXNwYWNlICsgXCIqPVwiICtcblx0XHRcdFx0XHR3aGl0ZXNwYWNlICsgXCIqKD86Jyd8XFxcIlxcXCIpXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV2Via2l0L09wZXJhIC0gOmNoZWNrZWQgc2hvdWxkIHJldHVybiBzZWxlY3RlZCBvcHRpb24gZWxlbWVudHNcblx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTEvUkVDLWNzczMtc2VsZWN0b3JzLTIwMTEwOTI5LyNjaGVja2VkXG5cdFx0XHQvLyBJRTggdGhyb3dzIGVycm9yIGhlcmUgYW5kIHdpbGwgbm90IHNlZSBsYXRlciB0ZXN0c1xuXHRcdFx0aWYgKCAhZWwucXVlcnlTZWxlY3RvckFsbCggXCI6Y2hlY2tlZFwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6Y2hlY2tlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFNhZmFyaSA4KywgaU9TIDgrXG5cdFx0XHQvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM2ODUxXG5cdFx0XHQvLyBJbi1wYWdlIGBzZWxlY3RvciNpZCBzaWJsaW5nLWNvbWJpbmF0b3Igc2VsZWN0b3JgIGZhaWxzXG5cdFx0XHRpZiAoICFlbC5xdWVyeVNlbGVjdG9yQWxsKCBcImEjXCIgKyBleHBhbmRvICsgXCIrKlwiICkubGVuZ3RoICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCIuIy4rWyt+XVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IEZpcmVmb3ggPD0zLjYgLSA1IG9ubHlcblx0XHRcdC8vIE9sZCBGaXJlZm94IGRvZXNuJ3QgdGhyb3cgb24gYSBiYWRseS1lc2NhcGVkIGlkZW50aWZpZXIuXG5cdFx0XHRlbC5xdWVyeVNlbGVjdG9yQWxsKCBcIlxcXFxcXGZcIiApO1xuXHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwiW1xcXFxyXFxcXG5cXFxcZl1cIiApO1xuXHRcdH0gKTtcblxuXHRcdGFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0ZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPScnIGRpc2FibGVkPSdkaXNhYmxlZCc+PC9hPlwiICtcblx0XHRcdFx0XCI8c2VsZWN0IGRpc2FibGVkPSdkaXNhYmxlZCc+PG9wdGlvbi8+PC9zZWxlY3Q+XCI7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IFdpbmRvd3MgOCBOYXRpdmUgQXBwc1xuXHRcdFx0Ly8gVGhlIHR5cGUgYW5kIG5hbWUgYXR0cmlidXRlcyBhcmUgcmVzdHJpY3RlZCBkdXJpbmcgLmlubmVySFRNTCBhc3NpZ25tZW50XG5cdFx0XHR2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcblx0XHRcdGlucHV0LnNldEF0dHJpYnV0ZSggXCJ0eXBlXCIsIFwiaGlkZGVuXCIgKTtcblx0XHRcdGVsLmFwcGVuZENoaWxkKCBpbnB1dCApLnNldEF0dHJpYnV0ZSggXCJuYW1lXCIsIFwiRFwiICk7XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOFxuXHRcdFx0Ly8gRW5mb3JjZSBjYXNlLXNlbnNpdGl2aXR5IG9mIG5hbWUgYXR0cmlidXRlXG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiW25hbWU9ZF1cIiApLmxlbmd0aCApIHtcblx0XHRcdFx0cmJ1Z2d5UVNBLnB1c2goIFwibmFtZVwiICsgd2hpdGVzcGFjZSArIFwiKlsqXiR8IX5dPz1cIiApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGRiAzLjUgLSA6ZW5hYmxlZC86ZGlzYWJsZWQgYW5kIGhpZGRlbiBlbGVtZW50cyAoaGlkZGVuIGVsZW1lbnRzIGFyZSBzdGlsbCBlbmFibGVkKVxuXHRcdFx0Ly8gSUU4IHRocm93cyBlcnJvciBoZXJlIGFuZCB3aWxsIG5vdCBzZWUgbGF0ZXIgdGVzdHNcblx0XHRcdGlmICggZWwucXVlcnlTZWxlY3RvckFsbCggXCI6ZW5hYmxlZFwiICkubGVuZ3RoICE9PSAyICkge1xuXHRcdFx0XHRyYnVnZ3lRU0EucHVzaCggXCI6ZW5hYmxlZFwiLCBcIjpkaXNhYmxlZFwiICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFN1cHBvcnQ6IElFOS0xMStcblx0XHRcdC8vIElFJ3MgOmRpc2FibGVkIHNlbGVjdG9yIGRvZXMgbm90IHBpY2sgdXAgdGhlIGNoaWxkcmVuIG9mIGRpc2FibGVkIGZpZWxkc2V0c1xuXHRcdFx0ZG9jRWxlbS5hcHBlbmRDaGlsZCggZWwgKS5kaXNhYmxlZCA9IHRydWU7XG5cdFx0XHRpZiAoIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoIFwiOmRpc2FibGVkXCIgKS5sZW5ndGggIT09IDIgKSB7XG5cdFx0XHRcdHJidWdneVFTQS5wdXNoKCBcIjplbmFibGVkXCIsIFwiOmRpc2FibGVkXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gU3VwcG9ydDogT3BlcmEgMTAgLSAxMSBvbmx5XG5cdFx0XHQvLyBPcGVyYSAxMC0xMSBkb2VzIG5vdCB0aHJvdyBvbiBwb3N0LWNvbW1hIGludmFsaWQgcHNldWRvc1xuXHRcdFx0ZWwucXVlcnlTZWxlY3RvckFsbCggXCIqLDp4XCIgKTtcblx0XHRcdHJidWdneVFTQS5wdXNoKCBcIiwuKjpcIiApO1xuXHRcdH0gKTtcblx0fVxuXG5cdGlmICggKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciA9IHJuYXRpdmUudGVzdCggKCBtYXRjaGVzID0gZG9jRWxlbS5tYXRjaGVzIHx8XG5cdFx0ZG9jRWxlbS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcblx0XHRkb2NFbGVtLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ub01hdGNoZXNTZWxlY3RvciB8fFxuXHRcdGRvY0VsZW0ubXNNYXRjaGVzU2VsZWN0b3IgKSApICkgKSB7XG5cblx0XHRhc3NlcnQoIGZ1bmN0aW9uKCBlbCApIHtcblxuXHRcdFx0Ly8gQ2hlY2sgdG8gc2VlIGlmIGl0J3MgcG9zc2libGUgdG8gZG8gbWF0Y2hlc1NlbGVjdG9yXG5cdFx0XHQvLyBvbiBhIGRpc2Nvbm5lY3RlZCBub2RlIChJRSA5KVxuXHRcdFx0c3VwcG9ydC5kaXNjb25uZWN0ZWRNYXRjaCA9IG1hdGNoZXMuY2FsbCggZWwsIFwiKlwiICk7XG5cblx0XHRcdC8vIFRoaXMgc2hvdWxkIGZhaWwgd2l0aCBhbiBleGNlcHRpb25cblx0XHRcdC8vIEdlY2tvIGRvZXMgbm90IGVycm9yLCByZXR1cm5zIGZhbHNlIGluc3RlYWRcblx0XHRcdG1hdGNoZXMuY2FsbCggZWwsIFwiW3MhPScnXTp4XCIgKTtcblx0XHRcdHJidWdneU1hdGNoZXMucHVzaCggXCIhPVwiLCBwc2V1ZG9zICk7XG5cdFx0fSApO1xuXHR9XG5cblx0cmJ1Z2d5UVNBID0gcmJ1Z2d5UVNBLmxlbmd0aCAmJiBuZXcgUmVnRXhwKCByYnVnZ3lRU0Euam9pbiggXCJ8XCIgKSApO1xuXHRyYnVnZ3lNYXRjaGVzID0gcmJ1Z2d5TWF0Y2hlcy5sZW5ndGggJiYgbmV3IFJlZ0V4cCggcmJ1Z2d5TWF0Y2hlcy5qb2luKCBcInxcIiApICk7XG5cblx0LyogQ29udGFpbnNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRoYXNDb21wYXJlID0gcm5hdGl2ZS50ZXN0KCBkb2NFbGVtLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uICk7XG5cblx0Ly8gRWxlbWVudCBjb250YWlucyBhbm90aGVyXG5cdC8vIFB1cnBvc2VmdWxseSBzZWxmLWV4Y2x1c2l2ZVxuXHQvLyBBcyBpbiwgYW4gZWxlbWVudCBkb2VzIG5vdCBjb250YWluIGl0c2VsZlxuXHRjb250YWlucyA9IGhhc0NvbXBhcmUgfHwgcm5hdGl2ZS50ZXN0KCBkb2NFbGVtLmNvbnRhaW5zICkgP1xuXHRcdGZ1bmN0aW9uKCBhLCBiICkge1xuXHRcdFx0dmFyIGFkb3duID0gYS5ub2RlVHlwZSA9PT0gOSA/IGEuZG9jdW1lbnRFbGVtZW50IDogYSxcblx0XHRcdFx0YnVwID0gYiAmJiBiLnBhcmVudE5vZGU7XG5cdFx0XHRyZXR1cm4gYSA9PT0gYnVwIHx8ICEhKCBidXAgJiYgYnVwLm5vZGVUeXBlID09PSAxICYmIChcblx0XHRcdFx0YWRvd24uY29udGFpbnMgP1xuXHRcdFx0XHRcdGFkb3duLmNvbnRhaW5zKCBidXAgKSA6XG5cdFx0XHRcdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiAmJiBhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKCBidXAgKSAmIDE2XG5cdFx0XHQpICk7XG5cdFx0fSA6XG5cdFx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cdFx0XHRpZiAoIGIgKSB7XG5cdFx0XHRcdHdoaWxlICggKCBiID0gYi5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBiID09PSBhICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXHQvKiBTb3J0aW5nXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvLyBEb2N1bWVudCBvcmRlciBzb3J0aW5nXG5cdHNvcnRPcmRlciA9IGhhc0NvbXBhcmUgP1xuXHRmdW5jdGlvbiggYSwgYiApIHtcblxuXHRcdC8vIEZsYWcgZm9yIGR1cGxpY2F0ZSByZW1vdmFsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdC8vIFNvcnQgb24gbWV0aG9kIGV4aXN0ZW5jZSBpZiBvbmx5IG9uZSBpbnB1dCBoYXMgY29tcGFyZURvY3VtZW50UG9zaXRpb25cblx0XHR2YXIgY29tcGFyZSA9ICFhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uIC0gIWIuY29tcGFyZURvY3VtZW50UG9zaXRpb247XG5cdFx0aWYgKCBjb21wYXJlICkge1xuXHRcdFx0cmV0dXJuIGNvbXBhcmU7XG5cdFx0fVxuXG5cdFx0Ly8gQ2FsY3VsYXRlIHBvc2l0aW9uIGlmIGJvdGggaW5wdXRzIGJlbG9uZyB0byB0aGUgc2FtZSBkb2N1bWVudFxuXHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0Y29tcGFyZSA9ICggYS5vd25lckRvY3VtZW50IHx8IGEgKSA9PSAoIGIub3duZXJEb2N1bWVudCB8fCBiICkgP1xuXHRcdFx0YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYiApIDpcblxuXHRcdFx0Ly8gT3RoZXJ3aXNlIHdlIGtub3cgdGhleSBhcmUgZGlzY29ubmVjdGVkXG5cdFx0XHQxO1xuXG5cdFx0Ly8gRGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0aWYgKCBjb21wYXJlICYgMSB8fFxuXHRcdFx0KCAhc3VwcG9ydC5zb3J0RGV0YWNoZWQgJiYgYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggYSApID09PSBjb21wYXJlICkgKSB7XG5cblx0XHRcdC8vIENob29zZSB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IGlzIHJlbGF0ZWQgdG8gb3VyIHByZWZlcnJlZCBkb2N1bWVudFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdGlmICggYSA9PSBkb2N1bWVudCB8fCBhLm93bmVyRG9jdW1lbnQgPT0gcHJlZmVycmVkRG9jICYmXG5cdFx0XHRcdGNvbnRhaW5zKCBwcmVmZXJyZWREb2MsIGEgKSApIHtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdXBwb3J0OiBJRSAxMSssIEVkZ2UgMTcgLSAxOCtcblx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxuXHRcdFx0aWYgKCBiID09IGRvY3VtZW50IHx8IGIub3duZXJEb2N1bWVudCA9PSBwcmVmZXJyZWREb2MgJiZcblx0XHRcdFx0Y29udGFpbnMoIHByZWZlcnJlZERvYywgYiApICkge1xuXHRcdFx0XHRyZXR1cm4gMTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFpbnRhaW4gb3JpZ2luYWwgb3JkZXJcblx0XHRcdHJldHVybiBzb3J0SW5wdXQgP1xuXHRcdFx0XHQoIGluZGV4T2YoIHNvcnRJbnB1dCwgYSApIC0gaW5kZXhPZiggc29ydElucHV0LCBiICkgKSA6XG5cdFx0XHRcdDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbXBhcmUgJiA0ID8gLTEgOiAxO1xuXHR9IDpcblx0ZnVuY3Rpb24oIGEsIGIgKSB7XG5cblx0XHQvLyBFeGl0IGVhcmx5IGlmIHRoZSBub2RlcyBhcmUgaWRlbnRpY2FsXG5cdFx0aWYgKCBhID09PSBiICkge1xuXHRcdFx0aGFzRHVwbGljYXRlID0gdHJ1ZTtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdHZhciBjdXIsXG5cdFx0XHRpID0gMCxcblx0XHRcdGF1cCA9IGEucGFyZW50Tm9kZSxcblx0XHRcdGJ1cCA9IGIucGFyZW50Tm9kZSxcblx0XHRcdGFwID0gWyBhIF0sXG5cdFx0XHRicCA9IFsgYiBdO1xuXG5cdFx0Ly8gUGFyZW50bGVzcyBub2RlcyBhcmUgZWl0aGVyIGRvY3VtZW50cyBvciBkaXNjb25uZWN0ZWRcblx0XHRpZiAoICFhdXAgfHwgIWJ1cCApIHtcblxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuXHRcdFx0cmV0dXJuIGEgPT0gZG9jdW1lbnQgPyAtMSA6XG5cdFx0XHRcdGIgPT0gZG9jdW1lbnQgPyAxIDpcblx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cblx0XHRcdFx0YXVwID8gLTEgOlxuXHRcdFx0XHRidXAgPyAxIDpcblx0XHRcdFx0c29ydElucHV0ID9cblx0XHRcdFx0KCBpbmRleE9mKCBzb3J0SW5wdXQsIGEgKSAtIGluZGV4T2YoIHNvcnRJbnB1dCwgYiApICkgOlxuXHRcdFx0XHQwO1xuXG5cdFx0Ly8gSWYgdGhlIG5vZGVzIGFyZSBzaWJsaW5ncywgd2UgY2FuIGRvIGEgcXVpY2sgY2hlY2tcblx0XHR9IGVsc2UgaWYgKCBhdXAgPT09IGJ1cCApIHtcblx0XHRcdHJldHVybiBzaWJsaW5nQ2hlY2soIGEsIGIgKTtcblx0XHR9XG5cblx0XHQvLyBPdGhlcndpc2Ugd2UgbmVlZCBmdWxsIGxpc3RzIG9mIHRoZWlyIGFuY2VzdG9ycyBmb3IgY29tcGFyaXNvblxuXHRcdGN1ciA9IGE7XG5cdFx0d2hpbGUgKCAoIGN1ciA9IGN1ci5wYXJlbnROb2RlICkgKSB7XG5cdFx0XHRhcC51bnNoaWZ0KCBjdXIgKTtcblx0XHR9XG5cdFx0Y3VyID0gYjtcblx0XHR3aGlsZSAoICggY3VyID0gY3VyLnBhcmVudE5vZGUgKSApIHtcblx0XHRcdGJwLnVuc2hpZnQoIGN1ciApO1xuXHRcdH1cblxuXHRcdC8vIFdhbGsgZG93biB0aGUgdHJlZSBsb29raW5nIGZvciBhIGRpc2NyZXBhbmN5XG5cdFx0d2hpbGUgKCBhcFsgaSBdID09PSBicFsgaSBdICkge1xuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHJldHVybiBpID9cblxuXHRcdFx0Ly8gRG8gYSBzaWJsaW5nIGNoZWNrIGlmIHRoZSBub2RlcyBoYXZlIGEgY29tbW9uIGFuY2VzdG9yXG5cdFx0XHRzaWJsaW5nQ2hlY2soIGFwWyBpIF0sIGJwWyBpIF0gKSA6XG5cblx0XHRcdC8vIE90aGVyd2lzZSBub2RlcyBpbiBvdXIgZG9jdW1lbnQgc29ydCBmaXJzdFxuXHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xuXHRcdFx0YXBbIGkgXSA9PSBwcmVmZXJyZWREb2MgPyAtMSA6XG5cdFx0XHRicFsgaSBdID09IHByZWZlcnJlZERvYyA/IDEgOlxuXHRcdFx0LyogZXNsaW50LWVuYWJsZSBlcWVxZXEgKi9cblx0XHRcdDA7XG5cdH07XG5cblx0cmV0dXJuIGRvY3VtZW50O1xufTtcblxuU2l6emxlLm1hdGNoZXMgPSBmdW5jdGlvbiggZXhwciwgZWxlbWVudHMgKSB7XG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIG51bGwsIG51bGwsIGVsZW1lbnRzICk7XG59O1xuXG5TaXp6bGUubWF0Y2hlc1NlbGVjdG9yID0gZnVuY3Rpb24oIGVsZW0sIGV4cHIgKSB7XG5cdHNldERvY3VtZW50KCBlbGVtICk7XG5cblx0aWYgKCBzdXBwb3J0Lm1hdGNoZXNTZWxlY3RvciAmJiBkb2N1bWVudElzSFRNTCAmJlxuXHRcdCFub25uYXRpdmVTZWxlY3RvckNhY2hlWyBleHByICsgXCIgXCIgXSAmJlxuXHRcdCggIXJidWdneU1hdGNoZXMgfHwgIXJidWdneU1hdGNoZXMudGVzdCggZXhwciApICkgJiZcblx0XHQoICFyYnVnZ3lRU0EgICAgIHx8ICFyYnVnZ3lRU0EudGVzdCggZXhwciApICkgKSB7XG5cblx0XHR0cnkge1xuXHRcdFx0dmFyIHJldCA9IG1hdGNoZXMuY2FsbCggZWxlbSwgZXhwciApO1xuXG5cdFx0XHQvLyBJRSA5J3MgbWF0Y2hlc1NlbGVjdG9yIHJldHVybnMgZmFsc2Ugb24gZGlzY29ubmVjdGVkIG5vZGVzXG5cdFx0XHRpZiAoIHJldCB8fCBzdXBwb3J0LmRpc2Nvbm5lY3RlZE1hdGNoIHx8XG5cblx0XHRcdFx0Ly8gQXMgd2VsbCwgZGlzY29ubmVjdGVkIG5vZGVzIGFyZSBzYWlkIHRvIGJlIGluIGEgZG9jdW1lbnRcblx0XHRcdFx0Ly8gZnJhZ21lbnQgaW4gSUUgOVxuXHRcdFx0XHRlbGVtLmRvY3VtZW50ICYmIGVsZW0uZG9jdW1lbnQubm9kZVR5cGUgIT09IDExICkge1xuXHRcdFx0XHRyZXR1cm4gcmV0O1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKCBlICkge1xuXHRcdFx0bm9ubmF0aXZlU2VsZWN0b3JDYWNoZSggZXhwciwgdHJ1ZSApO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBTaXp6bGUoIGV4cHIsIGRvY3VtZW50LCBudWxsLCBbIGVsZW0gXSApLmxlbmd0aCA+IDA7XG59O1xuXG5TaXp6bGUuY29udGFpbnMgPSBmdW5jdGlvbiggY29udGV4dCwgZWxlbSApIHtcblxuXHQvLyBTZXQgZG9jdW1lbnQgdmFycyBpZiBuZWVkZWRcblx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0aWYgKCAoIGNvbnRleHQub3duZXJEb2N1bWVudCB8fCBjb250ZXh0ICkgIT0gZG9jdW1lbnQgKSB7XG5cdFx0c2V0RG9jdW1lbnQoIGNvbnRleHQgKTtcblx0fVxuXHRyZXR1cm4gY29udGFpbnMoIGNvbnRleHQsIGVsZW0gKTtcbn07XG5cblNpenpsZS5hdHRyID0gZnVuY3Rpb24oIGVsZW0sIG5hbWUgKSB7XG5cblx0Ly8gU2V0IGRvY3VtZW50IHZhcnMgaWYgbmVlZGVkXG5cdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHQvLyBJRS9FZGdlIHNvbWV0aW1lcyB0aHJvdyBhIFwiUGVybWlzc2lvbiBkZW5pZWRcIiBlcnJvciB3aGVuIHN0cmljdC1jb21wYXJpbmdcblx0Ly8gdHdvIGRvY3VtZW50czsgc2hhbGxvdyBjb21wYXJpc29ucyB3b3JrLlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdGlmICggKCBlbGVtLm93bmVyRG9jdW1lbnQgfHwgZWxlbSApICE9IGRvY3VtZW50ICkge1xuXHRcdHNldERvY3VtZW50KCBlbGVtICk7XG5cdH1cblxuXHR2YXIgZm4gPSBFeHByLmF0dHJIYW5kbGVbIG5hbWUudG9Mb3dlckNhc2UoKSBdLFxuXG5cdFx0Ly8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBPYmplY3QucHJvdG90eXBlIHByb3BlcnRpZXMgKGpRdWVyeSAjMTM4MDcpXG5cdFx0dmFsID0gZm4gJiYgaGFzT3duLmNhbGwoIEV4cHIuYXR0ckhhbmRsZSwgbmFtZS50b0xvd2VyQ2FzZSgpICkgP1xuXHRcdFx0Zm4oIGVsZW0sIG5hbWUsICFkb2N1bWVudElzSFRNTCApIDpcblx0XHRcdHVuZGVmaW5lZDtcblxuXHRyZXR1cm4gdmFsICE9PSB1bmRlZmluZWQgP1xuXHRcdHZhbCA6XG5cdFx0c3VwcG9ydC5hdHRyaWJ1dGVzIHx8ICFkb2N1bWVudElzSFRNTCA/XG5cdFx0XHRlbGVtLmdldEF0dHJpYnV0ZSggbmFtZSApIDpcblx0XHRcdCggdmFsID0gZWxlbS5nZXRBdHRyaWJ1dGVOb2RlKCBuYW1lICkgKSAmJiB2YWwuc3BlY2lmaWVkID9cblx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0bnVsbDtcbn07XG5cblNpenpsZS5lc2NhcGUgPSBmdW5jdGlvbiggc2VsICkge1xuXHRyZXR1cm4gKCBzZWwgKyBcIlwiICkucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xufTtcblxuU2l6emxlLmVycm9yID0gZnVuY3Rpb24oIG1zZyApIHtcblx0dGhyb3cgbmV3IEVycm9yKCBcIlN5bnRheCBlcnJvciwgdW5yZWNvZ25pemVkIGV4cHJlc3Npb246IFwiICsgbXNnICk7XG59O1xuXG4vKipcbiAqIERvY3VtZW50IHNvcnRpbmcgYW5kIHJlbW92aW5nIGR1cGxpY2F0ZXNcbiAqIEBwYXJhbSB7QXJyYXlMaWtlfSByZXN1bHRzXG4gKi9cblNpenpsZS51bmlxdWVTb3J0ID0gZnVuY3Rpb24oIHJlc3VsdHMgKSB7XG5cdHZhciBlbGVtLFxuXHRcdGR1cGxpY2F0ZXMgPSBbXSxcblx0XHRqID0gMCxcblx0XHRpID0gMDtcblxuXHQvLyBVbmxlc3Mgd2UgKmtub3cqIHdlIGNhbiBkZXRlY3QgZHVwbGljYXRlcywgYXNzdW1lIHRoZWlyIHByZXNlbmNlXG5cdGhhc0R1cGxpY2F0ZSA9ICFzdXBwb3J0LmRldGVjdER1cGxpY2F0ZXM7XG5cdHNvcnRJbnB1dCA9ICFzdXBwb3J0LnNvcnRTdGFibGUgJiYgcmVzdWx0cy5zbGljZSggMCApO1xuXHRyZXN1bHRzLnNvcnQoIHNvcnRPcmRlciApO1xuXG5cdGlmICggaGFzRHVwbGljYXRlICkge1xuXHRcdHdoaWxlICggKCBlbGVtID0gcmVzdWx0c1sgaSsrIF0gKSApIHtcblx0XHRcdGlmICggZWxlbSA9PT0gcmVzdWx0c1sgaSBdICkge1xuXHRcdFx0XHRqID0gZHVwbGljYXRlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHdoaWxlICggai0tICkge1xuXHRcdFx0cmVzdWx0cy5zcGxpY2UoIGR1cGxpY2F0ZXNbIGogXSwgMSApO1xuXHRcdH1cblx0fVxuXG5cdC8vIENsZWFyIGlucHV0IGFmdGVyIHNvcnRpbmcgdG8gcmVsZWFzZSBvYmplY3RzXG5cdC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L3NpenpsZS9wdWxsLzIyNVxuXHRzb3J0SW5wdXQgPSBudWxsO1xuXG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLyoqXG4gKiBVdGlsaXR5IGZ1bmN0aW9uIGZvciByZXRyaWV2aW5nIHRoZSB0ZXh0IHZhbHVlIG9mIGFuIGFycmF5IG9mIERPTSBub2Rlc1xuICogQHBhcmFtIHtBcnJheXxFbGVtZW50fSBlbGVtXG4gKi9cbmdldFRleHQgPSBTaXp6bGUuZ2V0VGV4dCA9IGZ1bmN0aW9uKCBlbGVtICkge1xuXHR2YXIgbm9kZSxcblx0XHRyZXQgPSBcIlwiLFxuXHRcdGkgPSAwLFxuXHRcdG5vZGVUeXBlID0gZWxlbS5ub2RlVHlwZTtcblxuXHRpZiAoICFub2RlVHlwZSApIHtcblxuXHRcdC8vIElmIG5vIG5vZGVUeXBlLCB0aGlzIGlzIGV4cGVjdGVkIHRvIGJlIGFuIGFycmF5XG5cdFx0d2hpbGUgKCAoIG5vZGUgPSBlbGVtWyBpKysgXSApICkge1xuXG5cdFx0XHQvLyBEbyBub3QgdHJhdmVyc2UgY29tbWVudCBub2Rlc1xuXHRcdFx0cmV0ICs9IGdldFRleHQoIG5vZGUgKTtcblx0XHR9XG5cdH0gZWxzZSBpZiAoIG5vZGVUeXBlID09PSAxIHx8IG5vZGVUeXBlID09PSA5IHx8IG5vZGVUeXBlID09PSAxMSApIHtcblxuXHRcdC8vIFVzZSB0ZXh0Q29udGVudCBmb3IgZWxlbWVudHNcblx0XHQvLyBpbm5lclRleHQgdXNhZ2UgcmVtb3ZlZCBmb3IgY29uc2lzdGVuY3kgb2YgbmV3IGxpbmVzIChqUXVlcnkgIzExMTUzKVxuXHRcdGlmICggdHlwZW9mIGVsZW0udGV4dENvbnRlbnQgPT09IFwic3RyaW5nXCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS50ZXh0Q29udGVudDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBUcmF2ZXJzZSBpdHMgY2hpbGRyZW5cblx0XHRcdGZvciAoIGVsZW0gPSBlbGVtLmZpcnN0Q2hpbGQ7IGVsZW07IGVsZW0gPSBlbGVtLm5leHRTaWJsaW5nICkge1xuXHRcdFx0XHRyZXQgKz0gZ2V0VGV4dCggZWxlbSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIGlmICggbm9kZVR5cGUgPT09IDMgfHwgbm9kZVR5cGUgPT09IDQgKSB7XG5cdFx0cmV0dXJuIGVsZW0ubm9kZVZhbHVlO1xuXHR9XG5cblx0Ly8gRG8gbm90IGluY2x1ZGUgY29tbWVudCBvciBwcm9jZXNzaW5nIGluc3RydWN0aW9uIG5vZGVzXG5cblx0cmV0dXJuIHJldDtcbn07XG5cbkV4cHIgPSBTaXp6bGUuc2VsZWN0b3JzID0ge1xuXG5cdC8vIENhbiBiZSBhZGp1c3RlZCBieSB0aGUgdXNlclxuXHRjYWNoZUxlbmd0aDogNTAsXG5cblx0Y3JlYXRlUHNldWRvOiBtYXJrRnVuY3Rpb24sXG5cblx0bWF0Y2g6IG1hdGNoRXhwcixcblxuXHRhdHRySGFuZGxlOiB7fSxcblxuXHRmaW5kOiB7fSxcblxuXHRyZWxhdGl2ZToge1xuXHRcdFwiPlwiOiB7IGRpcjogXCJwYXJlbnROb2RlXCIsIGZpcnN0OiB0cnVlIH0sXG5cdFx0XCIgXCI6IHsgZGlyOiBcInBhcmVudE5vZGVcIiB9LFxuXHRcdFwiK1wiOiB7IGRpcjogXCJwcmV2aW91c1NpYmxpbmdcIiwgZmlyc3Q6IHRydWUgfSxcblx0XHRcIn5cIjogeyBkaXI6IFwicHJldmlvdXNTaWJsaW5nXCIgfVxuXHR9LFxuXG5cdHByZUZpbHRlcjoge1xuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbWF0Y2ggKSB7XG5cdFx0XHRtYXRjaFsgMSBdID0gbWF0Y2hbIDEgXS5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBnaXZlbiB2YWx1ZSB0byBtYXRjaFszXSB3aGV0aGVyIHF1b3RlZCBvciB1bnF1b3RlZFxuXHRcdFx0bWF0Y2hbIDMgXSA9ICggbWF0Y2hbIDMgXSB8fCBtYXRjaFsgNCBdIHx8XG5cdFx0XHRcdG1hdGNoWyA1IF0gfHwgXCJcIiApLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICk7XG5cblx0XHRcdGlmICggbWF0Y2hbIDIgXSA9PT0gXCJ+PVwiICkge1xuXHRcdFx0XHRtYXRjaFsgMyBdID0gXCIgXCIgKyBtYXRjaFsgMyBdICsgXCIgXCI7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaC5zbGljZSggMCwgNCApO1xuXHRcdH0sXG5cblx0XHRcIkNISUxEXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblxuXHRcdFx0LyogbWF0Y2hlcyBmcm9tIG1hdGNoRXhwcltcIkNISUxEXCJdXG5cdFx0XHRcdDEgdHlwZSAob25seXxudGh8Li4uKVxuXHRcdFx0XHQyIHdoYXQgKGNoaWxkfG9mLXR5cGUpXG5cdFx0XHRcdDMgYXJndW1lbnQgKGV2ZW58b2RkfFxcZCp8XFxkKm4oWystXVxcZCspP3wuLi4pXG5cdFx0XHRcdDQgeG4tY29tcG9uZW50IG9mIHhuK3kgYXJndW1lbnQgKFsrLV0/XFxkKm58KVxuXHRcdFx0XHQ1IHNpZ24gb2YgeG4tY29tcG9uZW50XG5cdFx0XHRcdDYgeCBvZiB4bi1jb21wb25lbnRcblx0XHRcdFx0NyBzaWduIG9mIHktY29tcG9uZW50XG5cdFx0XHRcdDggeSBvZiB5LWNvbXBvbmVudFxuXHRcdFx0Ki9cblx0XHRcdG1hdGNoWyAxIF0gPSBtYXRjaFsgMSBdLnRvTG93ZXJDYXNlKCk7XG5cblx0XHRcdGlmICggbWF0Y2hbIDEgXS5zbGljZSggMCwgMyApID09PSBcIm50aFwiICkge1xuXG5cdFx0XHRcdC8vIG50aC0qIHJlcXVpcmVzIGFyZ3VtZW50XG5cdFx0XHRcdGlmICggIW1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdFx0U2l6emxlLmVycm9yKCBtYXRjaFsgMCBdICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBudW1lcmljIHggYW5kIHkgcGFyYW1ldGVycyBmb3IgRXhwci5maWx0ZXIuQ0hJTERcblx0XHRcdFx0Ly8gcmVtZW1iZXIgdGhhdCBmYWxzZS90cnVlIGNhc3QgcmVzcGVjdGl2ZWx5IHRvIDAvMVxuXHRcdFx0XHRtYXRjaFsgNCBdID0gKyggbWF0Y2hbIDQgXSA/XG5cdFx0XHRcdFx0bWF0Y2hbIDUgXSArICggbWF0Y2hbIDYgXSB8fCAxICkgOlxuXHRcdFx0XHRcdDIgKiAoIG1hdGNoWyAzIF0gPT09IFwiZXZlblwiIHx8IG1hdGNoWyAzIF0gPT09IFwib2RkXCIgKSApO1xuXHRcdFx0XHRtYXRjaFsgNSBdID0gKyggKCBtYXRjaFsgNyBdICsgbWF0Y2hbIDggXSApIHx8IG1hdGNoWyAzIF0gPT09IFwib2RkXCIgKTtcblxuXHRcdFx0XHQvLyBvdGhlciB0eXBlcyBwcm9oaWJpdCBhcmd1bWVudHNcblx0XHRcdH0gZWxzZSBpZiAoIG1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdFNpenpsZS5lcnJvciggbWF0Y2hbIDAgXSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0fSxcblxuXHRcdFwiUFNFVURPXCI6IGZ1bmN0aW9uKCBtYXRjaCApIHtcblx0XHRcdHZhciBleGNlc3MsXG5cdFx0XHRcdHVucXVvdGVkID0gIW1hdGNoWyA2IF0gJiYgbWF0Y2hbIDIgXTtcblxuXHRcdFx0aWYgKCBtYXRjaEV4cHJbIFwiQ0hJTERcIiBdLnRlc3QoIG1hdGNoWyAwIF0gKSApIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFjY2VwdCBxdW90ZWQgYXJndW1lbnRzIGFzLWlzXG5cdFx0XHRpZiAoIG1hdGNoWyAzIF0gKSB7XG5cdFx0XHRcdG1hdGNoWyAyIF0gPSBtYXRjaFsgNCBdIHx8IG1hdGNoWyA1IF0gfHwgXCJcIjtcblxuXHRcdFx0Ly8gU3RyaXAgZXhjZXNzIGNoYXJhY3RlcnMgZnJvbSB1bnF1b3RlZCBhcmd1bWVudHNcblx0XHRcdH0gZWxzZSBpZiAoIHVucXVvdGVkICYmIHJwc2V1ZG8udGVzdCggdW5xdW90ZWQgKSAmJlxuXG5cdFx0XHRcdC8vIEdldCBleGNlc3MgZnJvbSB0b2tlbml6ZSAocmVjdXJzaXZlbHkpXG5cdFx0XHRcdCggZXhjZXNzID0gdG9rZW5pemUoIHVucXVvdGVkLCB0cnVlICkgKSAmJlxuXG5cdFx0XHRcdC8vIGFkdmFuY2UgdG8gdGhlIG5leHQgY2xvc2luZyBwYXJlbnRoZXNpc1xuXHRcdFx0XHQoIGV4Y2VzcyA9IHVucXVvdGVkLmluZGV4T2YoIFwiKVwiLCB1bnF1b3RlZC5sZW5ndGggLSBleGNlc3MgKSAtIHVucXVvdGVkLmxlbmd0aCApICkge1xuXG5cdFx0XHRcdC8vIGV4Y2VzcyBpcyBhIG5lZ2F0aXZlIGluZGV4XG5cdFx0XHRcdG1hdGNoWyAwIF0gPSBtYXRjaFsgMCBdLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdFx0bWF0Y2hbIDIgXSA9IHVucXVvdGVkLnNsaWNlKCAwLCBleGNlc3MgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUmV0dXJuIG9ubHkgY2FwdHVyZXMgbmVlZGVkIGJ5IHRoZSBwc2V1ZG8gZmlsdGVyIG1ldGhvZCAodHlwZSBhbmQgYXJndW1lbnQpXG5cdFx0XHRyZXR1cm4gbWF0Y2guc2xpY2UoIDAsIDMgKTtcblx0XHR9XG5cdH0sXG5cblx0ZmlsdGVyOiB7XG5cblx0XHRcIlRBR1wiOiBmdW5jdGlvbiggbm9kZU5hbWVTZWxlY3RvciApIHtcblx0XHRcdHZhciBub2RlTmFtZSA9IG5vZGVOYW1lU2VsZWN0b3IucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIG5vZGVOYW1lU2VsZWN0b3IgPT09IFwiKlwiID9cblx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH0gOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRyZXR1cm4gZWxlbS5ub2RlTmFtZSAmJiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5vZGVOYW1lO1xuXHRcdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIkNMQVNTXCI6IGZ1bmN0aW9uKCBjbGFzc05hbWUgKSB7XG5cdFx0XHR2YXIgcGF0dGVybiA9IGNsYXNzQ2FjaGVbIGNsYXNzTmFtZSArIFwiIFwiIF07XG5cblx0XHRcdHJldHVybiBwYXR0ZXJuIHx8XG5cdFx0XHRcdCggcGF0dGVybiA9IG5ldyBSZWdFeHAoIFwiKF58XCIgKyB3aGl0ZXNwYWNlICtcblx0XHRcdFx0XHRcIilcIiArIGNsYXNzTmFtZSArIFwiKFwiICsgd2hpdGVzcGFjZSArIFwifCQpXCIgKSApICYmIGNsYXNzQ2FjaGUoXG5cdFx0XHRcdFx0XHRjbGFzc05hbWUsIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF0dGVybi50ZXN0KFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtLmNsYXNzTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbGVtLmNsYXNzTmFtZSB8fFxuXHRcdFx0XHRcdFx0XHRcdHR5cGVvZiBlbGVtLmdldEF0dHJpYnV0ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIFwiY2xhc3NcIiApIHx8XG5cdFx0XHRcdFx0XHRcdFx0XCJcIlxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdFwiQVRUUlwiOiBmdW5jdGlvbiggbmFtZSwgb3BlcmF0b3IsIGNoZWNrICkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gU2l6emxlLmF0dHIoIGVsZW0sIG5hbWUgKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCIhPVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICggIW9wZXJhdG9yICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzdWx0ICs9IFwiXCI7XG5cblx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5cdFx0XHRcdHJldHVybiBvcGVyYXRvciA9PT0gXCI9XCIgPyByZXN1bHQgPT09IGNoZWNrIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIhPVwiID8gcmVzdWx0ICE9PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiXj1cIiA/IGNoZWNrICYmIHJlc3VsdC5pbmRleE9mKCBjaGVjayApID09PSAwIDpcblx0XHRcdFx0XHRvcGVyYXRvciA9PT0gXCIqPVwiID8gY2hlY2sgJiYgcmVzdWx0LmluZGV4T2YoIGNoZWNrICkgPiAtMSA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwiJD1cIiA/IGNoZWNrICYmIHJlc3VsdC5zbGljZSggLWNoZWNrLmxlbmd0aCApID09PSBjaGVjayA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwifj1cIiA/ICggXCIgXCIgKyByZXN1bHQucmVwbGFjZSggcndoaXRlc3BhY2UsIFwiIFwiICkgKyBcIiBcIiApLmluZGV4T2YoIGNoZWNrICkgPiAtMSA6XG5cdFx0XHRcdFx0b3BlcmF0b3IgPT09IFwifD1cIiA/IHJlc3VsdCA9PT0gY2hlY2sgfHwgcmVzdWx0LnNsaWNlKCAwLCBjaGVjay5sZW5ndGggKyAxICkgPT09IGNoZWNrICsgXCItXCIgOlxuXHRcdFx0XHRcdGZhbHNlO1xuXHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG1heC1sZW4gKi9cblxuXHRcdFx0fTtcblx0XHR9LFxuXG5cdFx0XCJDSElMRFwiOiBmdW5jdGlvbiggdHlwZSwgd2hhdCwgX2FyZ3VtZW50LCBmaXJzdCwgbGFzdCApIHtcblx0XHRcdHZhciBzaW1wbGUgPSB0eXBlLnNsaWNlKCAwLCAzICkgIT09IFwibnRoXCIsXG5cdFx0XHRcdGZvcndhcmQgPSB0eXBlLnNsaWNlKCAtNCApICE9PSBcImxhc3RcIixcblx0XHRcdFx0b2ZUeXBlID0gd2hhdCA9PT0gXCJvZi10eXBlXCI7XG5cblx0XHRcdHJldHVybiBmaXJzdCA9PT0gMSAmJiBsYXN0ID09PSAwID9cblxuXHRcdFx0XHQvLyBTaG9ydGN1dCBmb3IgOm50aC0qKG4pXG5cdFx0XHRcdGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRcdHJldHVybiAhIWVsZW0ucGFyZW50Tm9kZTtcblx0XHRcdFx0fSA6XG5cblx0XHRcdFx0ZnVuY3Rpb24oIGVsZW0sIF9jb250ZXh0LCB4bWwgKSB7XG5cdFx0XHRcdFx0dmFyIGNhY2hlLCB1bmlxdWVDYWNoZSwgb3V0ZXJDYWNoZSwgbm9kZSwgbm9kZUluZGV4LCBzdGFydCxcblx0XHRcdFx0XHRcdGRpciA9IHNpbXBsZSAhPT0gZm9yd2FyZCA/IFwibmV4dFNpYmxpbmdcIiA6IFwicHJldmlvdXNTaWJsaW5nXCIsXG5cdFx0XHRcdFx0XHRwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGUsXG5cdFx0XHRcdFx0XHRuYW1lID0gb2ZUeXBlICYmIGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRcdHVzZUNhY2hlID0gIXhtbCAmJiAhb2ZUeXBlLFxuXHRcdFx0XHRcdFx0ZGlmZiA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0aWYgKCBwYXJlbnQgKSB7XG5cblx0XHRcdFx0XHRcdC8vIDooZmlyc3R8bGFzdHxvbmx5KS0oY2hpbGR8b2YtdHlwZSlcblx0XHRcdFx0XHRcdGlmICggc2ltcGxlICkge1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoIGRpciApIHtcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoICggbm9kZSA9IG5vZGVbIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoIG9mVHlwZSA/XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gbmFtZSA6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5vZGUubm9kZVR5cGUgPT09IDEgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdC8vIFJldmVyc2UgZGlyZWN0aW9uIGZvciA6b25seS0qIChpZiB3ZSBoYXZlbid0IHlldCBkb25lIHNvKVxuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0ID0gZGlyID0gdHlwZSA9PT0gXCJvbmx5XCIgJiYgIXN0YXJ0ICYmIFwibmV4dFNpYmxpbmdcIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c3RhcnQgPSBbIGZvcndhcmQgPyBwYXJlbnQuZmlyc3RDaGlsZCA6IHBhcmVudC5sYXN0Q2hpbGQgXTtcblxuXHRcdFx0XHRcdFx0Ly8gbm9uLXhtbCA6bnRoLWNoaWxkKC4uLikgc3RvcmVzIGNhY2hlIGRhdGEgb24gYHBhcmVudGBcblx0XHRcdFx0XHRcdGlmICggZm9yd2FyZCAmJiB1c2VDYWNoZSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBTZWVrIGBlbGVtYCBmcm9tIGEgcHJldmlvdXNseS1jYWNoZWQgaW5kZXhcblxuXHRcdFx0XHRcdFx0XHQvLyAuLi5pbiBhIGd6aXAtZnJpZW5kbHkgd2F5XG5cdFx0XHRcdFx0XHRcdG5vZGUgPSBwYXJlbnQ7XG5cdFx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBub2RlWyBleHBhbmRvIF0gfHwgKCBub2RlWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdGNhY2hlID0gdW5pcXVlQ2FjaGVbIHR5cGUgXSB8fCBbXTtcblx0XHRcdFx0XHRcdFx0bm9kZUluZGV4ID0gY2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBjYWNoZVsgMSBdO1xuXHRcdFx0XHRcdFx0XHRkaWZmID0gbm9kZUluZGV4ICYmIGNhY2hlWyAyIF07XG5cdFx0XHRcdFx0XHRcdG5vZGUgPSBub2RlSW5kZXggJiYgcGFyZW50LmNoaWxkTm9kZXNbIG5vZGVJbmRleCBdO1xuXG5cdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8gRmFsbGJhY2sgdG8gc2Vla2luZyBgZWxlbWAgZnJvbSB0aGUgc3RhcnRcblx0XHRcdFx0XHRcdFx0XHQoIGRpZmYgPSBub2RlSW5kZXggPSAwICkgfHwgc3RhcnQucG9wKCkgKSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFdoZW4gZm91bmQsIGNhY2hlIGluZGV4ZXMgb24gYHBhcmVudGAgYW5kIGJyZWFrXG5cdFx0XHRcdFx0XHRcdFx0aWYgKCBub2RlLm5vZGVUeXBlID09PSAxICYmICsrZGlmZiAmJiBub2RlID09PSBlbGVtICkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGVbIHR5cGUgXSA9IFsgZGlycnVucywgbm9kZUluZGV4LCBkaWZmIF07XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBVc2UgcHJldmlvdXNseS1jYWNoZWQgZWxlbWVudCBpbmRleCBpZiBhdmFpbGFibGVcblx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIC4uLmluIGEgZ3ppcC1mcmllbmRseSB3YXlcblx0XHRcdFx0XHRcdFx0XHRub2RlID0gZWxlbTtcblx0XHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8ICggbm9kZVsgZXhwYW5kbyBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDw5IG9ubHlcblx0XHRcdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdFx0XHR1bmlxdWVDYWNoZSA9IG91dGVyQ2FjaGVbIG5vZGUudW5pcXVlSUQgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KCBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y2FjaGUgPSB1bmlxdWVDYWNoZVsgdHlwZSBdIHx8IFtdO1xuXHRcdFx0XHRcdFx0XHRcdG5vZGVJbmRleCA9IGNhY2hlWyAwIF0gPT09IGRpcnJ1bnMgJiYgY2FjaGVbIDEgXTtcblx0XHRcdFx0XHRcdFx0XHRkaWZmID0gbm9kZUluZGV4O1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0Ly8geG1sIDpudGgtY2hpbGQoLi4uKVxuXHRcdFx0XHRcdFx0XHQvLyBvciA6bnRoLWxhc3QtY2hpbGQoLi4uKSBvciA6bnRoKC1sYXN0KT8tb2YtdHlwZSguLi4pXG5cdFx0XHRcdFx0XHRcdGlmICggZGlmZiA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHQvLyBVc2UgdGhlIHNhbWUgbG9vcCBhcyBhYm92ZSB0byBzZWVrIGBlbGVtYCBmcm9tIHRoZSBzdGFydFxuXHRcdFx0XHRcdFx0XHRcdHdoaWxlICggKCBub2RlID0gKytub2RlSW5kZXggJiYgbm9kZSAmJiBub2RlWyBkaXIgXSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0KCBkaWZmID0gbm9kZUluZGV4ID0gMCApIHx8IHN0YXJ0LnBvcCgpICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICggKCBvZlR5cGUgP1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUgOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRub2RlLm5vZGVUeXBlID09PSAxICkgJiZcblx0XHRcdFx0XHRcdFx0XHRcdFx0KytkaWZmICkge1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIENhY2hlIHRoZSBpbmRleCBvZiBlYWNoIGVuY291bnRlcmVkIGVsZW1lbnRcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCB1c2VDYWNoZSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvdXRlckNhY2hlID0gbm9kZVsgZXhwYW5kbyBdIHx8XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQoIG5vZGVbIGV4cGFuZG8gXSA9IHt9ICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gRGVmZW5kIGFnYWluc3QgY2xvbmVkIGF0dHJvcGVydGllcyAoalF1ZXJ5IGdoLTE3MDkpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5pcXVlQ2FjaGUgPSBvdXRlckNhY2hlWyBub2RlLnVuaXF1ZUlEIF0gfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgbm9kZS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyB0eXBlIF0gPSBbIGRpcnJ1bnMsIGRpZmYgXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICggbm9kZSA9PT0gZWxlbSApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBJbmNvcnBvcmF0ZSB0aGUgb2Zmc2V0LCB0aGVuIGNoZWNrIGFnYWluc3QgY3ljbGUgc2l6ZVxuXHRcdFx0XHRcdFx0ZGlmZiAtPSBsYXN0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRpZmYgPT09IGZpcnN0IHx8ICggZGlmZiAlIGZpcnN0ID09PSAwICYmIGRpZmYgLyBmaXJzdCA+PSAwICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdH0sXG5cblx0XHRcIlBTRVVET1wiOiBmdW5jdGlvbiggcHNldWRvLCBhcmd1bWVudCApIHtcblxuXHRcdFx0Ly8gcHNldWRvLWNsYXNzIG5hbWVzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG5cdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9zZWxlY3RvcnMvI3BzZXVkby1jbGFzc2VzXG5cdFx0XHQvLyBQcmlvcml0aXplIGJ5IGNhc2Ugc2Vuc2l0aXZpdHkgaW4gY2FzZSBjdXN0b20gcHNldWRvcyBhcmUgYWRkZWQgd2l0aCB1cHBlcmNhc2UgbGV0dGVyc1xuXHRcdFx0Ly8gUmVtZW1iZXIgdGhhdCBzZXRGaWx0ZXJzIGluaGVyaXRzIGZyb20gcHNldWRvc1xuXHRcdFx0dmFyIGFyZ3MsXG5cdFx0XHRcdGZuID0gRXhwci5wc2V1ZG9zWyBwc2V1ZG8gXSB8fCBFeHByLnNldEZpbHRlcnNbIHBzZXVkby50b0xvd2VyQ2FzZSgpIF0gfHxcblx0XHRcdFx0XHRTaXp6bGUuZXJyb3IoIFwidW5zdXBwb3J0ZWQgcHNldWRvOiBcIiArIHBzZXVkbyApO1xuXG5cdFx0XHQvLyBUaGUgdXNlciBtYXkgdXNlIGNyZWF0ZVBzZXVkbyB0byBpbmRpY2F0ZSB0aGF0XG5cdFx0XHQvLyBhcmd1bWVudHMgYXJlIG5lZWRlZCB0byBjcmVhdGUgdGhlIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0Ly8ganVzdCBhcyBTaXp6bGUgZG9lc1xuXHRcdFx0aWYgKCBmblsgZXhwYW5kbyBdICkge1xuXHRcdFx0XHRyZXR1cm4gZm4oIGFyZ3VtZW50ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEJ1dCBtYWludGFpbiBzdXBwb3J0IGZvciBvbGQgc2lnbmF0dXJlc1xuXHRcdFx0aWYgKCBmbi5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRhcmdzID0gWyBwc2V1ZG8sIHBzZXVkbywgXCJcIiwgYXJndW1lbnQgXTtcblx0XHRcdFx0cmV0dXJuIEV4cHIuc2V0RmlsdGVycy5oYXNPd25Qcm9wZXJ0eSggcHNldWRvLnRvTG93ZXJDYXNlKCkgKSA/XG5cdFx0XHRcdFx0bWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VlZCwgbWF0Y2hlcyApIHtcblx0XHRcdFx0XHRcdHZhciBpZHgsXG5cdFx0XHRcdFx0XHRcdG1hdGNoZWQgPSBmbiggc2VlZCwgYXJndW1lbnQgKSxcblx0XHRcdFx0XHRcdFx0aSA9IG1hdGNoZWQubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdFx0XHRcdGlkeCA9IGluZGV4T2YoIHNlZWQsIG1hdGNoZWRbIGkgXSApO1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpZHggXSA9ICEoIG1hdGNoZXNbIGlkeCBdID0gbWF0Y2hlZFsgaSBdICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSApIDpcblx0XHRcdFx0XHRmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBmbiggZWxlbSwgMCwgYXJncyApO1xuXHRcdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmbjtcblx0XHR9XG5cdH0sXG5cblx0cHNldWRvczoge1xuXG5cdFx0Ly8gUG90ZW50aWFsbHkgY29tcGxleCBwc2V1ZG9zXG5cdFx0XCJub3RcIjogbWFya0Z1bmN0aW9uKCBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG5cblx0XHRcdC8vIFRyaW0gdGhlIHNlbGVjdG9yIHBhc3NlZCB0byBjb21waWxlXG5cdFx0XHQvLyB0byBhdm9pZCB0cmVhdGluZyBsZWFkaW5nIGFuZCB0cmFpbGluZ1xuXHRcdFx0Ly8gc3BhY2VzIGFzIGNvbWJpbmF0b3JzXG5cdFx0XHR2YXIgaW5wdXQgPSBbXSxcblx0XHRcdFx0cmVzdWx0cyA9IFtdLFxuXHRcdFx0XHRtYXRjaGVyID0gY29tcGlsZSggc2VsZWN0b3IucmVwbGFjZSggcnRyaW0sIFwiJDFcIiApICk7XG5cblx0XHRcdHJldHVybiBtYXRjaGVyWyBleHBhbmRvIF0gP1xuXHRcdFx0XHRtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWVkLCBtYXRjaGVzLCBfY29udGV4dCwgeG1sICkge1xuXHRcdFx0XHRcdHZhciBlbGVtLFxuXHRcdFx0XHRcdFx0dW5tYXRjaGVkID0gbWF0Y2hlciggc2VlZCwgbnVsbCwgeG1sLCBbXSApLFxuXHRcdFx0XHRcdFx0aSA9IHNlZWQubGVuZ3RoO1xuXG5cdFx0XHRcdFx0Ly8gTWF0Y2ggZWxlbWVudHMgdW5tYXRjaGVkIGJ5IGBtYXRjaGVyYFxuXHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSB1bm1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0XHRzZWVkWyBpIF0gPSAhKCBtYXRjaGVzWyBpIF0gPSBlbGVtICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICkgOlxuXHRcdFx0XHRmdW5jdGlvbiggZWxlbSwgX2NvbnRleHQsIHhtbCApIHtcblx0XHRcdFx0XHRpbnB1dFsgMCBdID0gZWxlbTtcblx0XHRcdFx0XHRtYXRjaGVyKCBpbnB1dCwgbnVsbCwgeG1sLCByZXN1bHRzICk7XG5cblx0XHRcdFx0XHQvLyBEb24ndCBrZWVwIHRoZSBlbGVtZW50IChpc3N1ZSAjMjk5KVxuXHRcdFx0XHRcdGlucHV0WyAwIF0gPSBudWxsO1xuXHRcdFx0XHRcdHJldHVybiAhcmVzdWx0cy5wb3AoKTtcblx0XHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHRcImhhc1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdFx0cmV0dXJuIFNpenpsZSggc2VsZWN0b3IsIGVsZW0gKS5sZW5ndGggPiAwO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHRcImNvbnRhaW5zXCI6IG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHRleHQgKSB7XG5cdFx0XHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHRyZXR1cm4gKCBlbGVtLnRleHRDb250ZW50IHx8IGdldFRleHQoIGVsZW0gKSApLmluZGV4T2YoIHRleHQgKSA+IC0xO1xuXHRcdFx0fTtcblx0XHR9ICksXG5cblx0XHQvLyBcIldoZXRoZXIgYW4gZWxlbWVudCBpcyByZXByZXNlbnRlZCBieSBhIDpsYW5nKCkgc2VsZWN0b3Jcblx0XHQvLyBpcyBiYXNlZCBzb2xlbHkgb24gdGhlIGVsZW1lbnQncyBsYW5ndWFnZSB2YWx1ZVxuXHRcdC8vIGJlaW5nIGVxdWFsIHRvIHRoZSBpZGVudGlmaWVyIEMsXG5cdFx0Ly8gb3IgYmVnaW5uaW5nIHdpdGggdGhlIGlkZW50aWZpZXIgQyBpbW1lZGlhdGVseSBmb2xsb3dlZCBieSBcIi1cIi5cblx0XHQvLyBUaGUgbWF0Y2hpbmcgb2YgQyBhZ2FpbnN0IHRoZSBlbGVtZW50J3MgbGFuZ3VhZ2UgdmFsdWUgaXMgcGVyZm9ybWVkIGNhc2UtaW5zZW5zaXRpdmVseS5cblx0XHQvLyBUaGUgaWRlbnRpZmllciBDIGRvZXMgbm90IGhhdmUgdG8gYmUgYSB2YWxpZCBsYW5ndWFnZSBuYW1lLlwiXG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNsYW5nLXBzZXVkb1xuXHRcdFwibGFuZ1wiOiBtYXJrRnVuY3Rpb24oIGZ1bmN0aW9uKCBsYW5nICkge1xuXG5cdFx0XHQvLyBsYW5nIHZhbHVlIG11c3QgYmUgYSB2YWxpZCBpZGVudGlmaWVyXG5cdFx0XHRpZiAoICFyaWRlbnRpZmllci50ZXN0KCBsYW5nIHx8IFwiXCIgKSApIHtcblx0XHRcdFx0U2l6emxlLmVycm9yKCBcInVuc3VwcG9ydGVkIGxhbmc6IFwiICsgbGFuZyApO1xuXHRcdFx0fVxuXHRcdFx0bGFuZyA9IGxhbmcucmVwbGFjZSggcnVuZXNjYXBlLCBmdW5lc2NhcGUgKS50b0xvd2VyQ2FzZSgpO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0XHR2YXIgZWxlbUxhbmc7XG5cdFx0XHRcdGRvIHtcblx0XHRcdFx0XHRpZiAoICggZWxlbUxhbmcgPSBkb2N1bWVudElzSFRNTCA/XG5cdFx0XHRcdFx0XHRlbGVtLmxhbmcgOlxuXHRcdFx0XHRcdFx0ZWxlbS5nZXRBdHRyaWJ1dGUoIFwieG1sOmxhbmdcIiApIHx8IGVsZW0uZ2V0QXR0cmlidXRlKCBcImxhbmdcIiApICkgKSB7XG5cblx0XHRcdFx0XHRcdGVsZW1MYW5nID0gZWxlbUxhbmcudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0XHRcdHJldHVybiBlbGVtTGFuZyA9PT0gbGFuZyB8fCBlbGVtTGFuZy5pbmRleE9mKCBsYW5nICsgXCItXCIgKSA9PT0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gd2hpbGUgKCAoIGVsZW0gPSBlbGVtLnBhcmVudE5vZGUgKSAmJiBlbGVtLm5vZGVUeXBlID09PSAxICk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSApLFxuXG5cdFx0Ly8gTWlzY2VsbGFuZW91c1xuXHRcdFwidGFyZ2V0XCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cdFx0XHRyZXR1cm4gaGFzaCAmJiBoYXNoLnNsaWNlKCAxICkgPT09IGVsZW0uaWQ7XG5cdFx0fSxcblxuXHRcdFwicm9vdFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiBlbGVtID09PSBkb2NFbGVtO1xuXHRcdH0sXG5cblx0XHRcImZvY3VzXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiZcblx0XHRcdFx0KCAhZG9jdW1lbnQuaGFzRm9jdXMgfHwgZG9jdW1lbnQuaGFzRm9jdXMoKSApICYmXG5cdFx0XHRcdCEhKCBlbGVtLnR5cGUgfHwgZWxlbS5ocmVmIHx8IH5lbGVtLnRhYkluZGV4ICk7XG5cdFx0fSxcblxuXHRcdC8vIEJvb2xlYW4gcHJvcGVydGllc1xuXHRcdFwiZW5hYmxlZFwiOiBjcmVhdGVEaXNhYmxlZFBzZXVkbyggZmFsc2UgKSxcblx0XHRcImRpc2FibGVkXCI6IGNyZWF0ZURpc2FibGVkUHNldWRvKCB0cnVlICksXG5cblx0XHRcImNoZWNrZWRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cblx0XHRcdC8vIEluIENTUzMsIDpjaGVja2VkIHNob3VsZCByZXR1cm4gYm90aCBjaGVja2VkIGFuZCBzZWxlY3RlZCBlbGVtZW50c1xuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMS9SRUMtY3NzMy1zZWxlY3RvcnMtMjAxMTA5MjkvI2NoZWNrZWRcblx0XHRcdHZhciBub2RlTmFtZSA9IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblx0XHRcdHJldHVybiAoIG5vZGVOYW1lID09PSBcImlucHV0XCIgJiYgISFlbGVtLmNoZWNrZWQgKSB8fFxuXHRcdFx0XHQoIG5vZGVOYW1lID09PSBcIm9wdGlvblwiICYmICEhZWxlbS5zZWxlY3RlZCApO1xuXHRcdH0sXG5cblx0XHRcInNlbGVjdGVkXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXG5cdFx0XHQvLyBBY2Nlc3NpbmcgdGhpcyBwcm9wZXJ0eSBtYWtlcyBzZWxlY3RlZC1ieS1kZWZhdWx0XG5cdFx0XHQvLyBvcHRpb25zIGluIFNhZmFyaSB3b3JrIHByb3Blcmx5XG5cdFx0XHRpZiAoIGVsZW0ucGFyZW50Tm9kZSApIHtcblx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuXHRcdFx0XHRlbGVtLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGVsZW0uc2VsZWN0ZWQgPT09IHRydWU7XG5cdFx0fSxcblxuXHRcdC8vIENvbnRlbnRzXG5cdFx0XCJlbXB0eVwiOiBmdW5jdGlvbiggZWxlbSApIHtcblxuXHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvc2VsZWN0b3JzLyNlbXB0eS1wc2V1ZG9cblx0XHRcdC8vIDplbXB0eSBpcyBuZWdhdGVkIGJ5IGVsZW1lbnQgKDEpIG9yIGNvbnRlbnQgbm9kZXMgKHRleHQ6IDM7IGNkYXRhOiA0OyBlbnRpdHkgcmVmOiA1KSxcblx0XHRcdC8vICAgYnV0IG5vdCBieSBvdGhlcnMgKGNvbW1lbnQ6IDg7IHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb246IDc7IGV0Yy4pXG5cdFx0XHQvLyBub2RlVHlwZSA8IDYgd29ya3MgYmVjYXVzZSBhdHRyaWJ1dGVzICgyKSBkbyBub3QgYXBwZWFyIGFzIGNoaWxkcmVuXG5cdFx0XHRmb3IgKCBlbGVtID0gZWxlbS5maXJzdENoaWxkOyBlbGVtOyBlbGVtID0gZWxlbS5uZXh0U2libGluZyApIHtcblx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlIDwgNiApIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblx0XHRcInBhcmVudFwiOiBmdW5jdGlvbiggZWxlbSApIHtcblx0XHRcdHJldHVybiAhRXhwci5wc2V1ZG9zWyBcImVtcHR5XCIgXSggZWxlbSApO1xuXHRcdH0sXG5cblx0XHQvLyBFbGVtZW50L2lucHV0IHR5cGVzXG5cdFx0XCJoZWFkZXJcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmhlYWRlci50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiaW5wdXRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gcmlucHV0cy50ZXN0KCBlbGVtLm5vZGVOYW1lICk7XG5cdFx0fSxcblxuXHRcdFwiYnV0dG9uXCI6IGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0dmFyIG5hbWUgPSBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG5cdFx0XHRyZXR1cm4gbmFtZSA9PT0gXCJpbnB1dFwiICYmIGVsZW0udHlwZSA9PT0gXCJidXR0b25cIiB8fCBuYW1lID09PSBcImJ1dHRvblwiO1xuXHRcdH0sXG5cblx0XHRcInRleHRcIjogZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHR2YXIgYXR0cjtcblx0XHRcdHJldHVybiBlbGVtLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW5wdXRcIiAmJlxuXHRcdFx0XHRlbGVtLnR5cGUgPT09IFwidGV4dFwiICYmXG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUU8OFxuXHRcdFx0XHQvLyBOZXcgSFRNTDUgYXR0cmlidXRlIHZhbHVlcyAoZS5nLiwgXCJzZWFyY2hcIikgYXBwZWFyIHdpdGggZWxlbS50eXBlID09PSBcInRleHRcIlxuXHRcdFx0XHQoICggYXR0ciA9IGVsZW0uZ2V0QXR0cmlidXRlKCBcInR5cGVcIiApICkgPT0gbnVsbCB8fFxuXHRcdFx0XHRcdGF0dHIudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZXh0XCIgKTtcblx0XHR9LFxuXG5cdFx0Ly8gUG9zaXRpb24taW4tY29sbGVjdGlvblxuXHRcdFwiZmlyc3RcIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gWyAwIF07XG5cdFx0fSApLFxuXG5cdFx0XCJsYXN0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBfbWF0Y2hJbmRleGVzLCBsZW5ndGggKSB7XG5cdFx0XHRyZXR1cm4gWyBsZW5ndGggLSAxIF07XG5cdFx0fSApLFxuXG5cdFx0XCJlcVwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggX21hdGNoSW5kZXhlcywgbGVuZ3RoLCBhcmd1bWVudCApIHtcblx0XHRcdHJldHVybiBbIGFyZ3VtZW50IDwgMCA/IGFyZ3VtZW50ICsgbGVuZ3RoIDogYXJndW1lbnQgXTtcblx0XHR9ICksXG5cblx0XHRcImV2ZW5cIjogY3JlYXRlUG9zaXRpb25hbFBzZXVkbyggZnVuY3Rpb24oIG1hdGNoSW5kZXhlcywgbGVuZ3RoICkge1xuXHRcdFx0dmFyIGkgPSAwO1xuXHRcdFx0Zm9yICggOyBpIDwgbGVuZ3RoOyBpICs9IDIgKSB7XG5cdFx0XHRcdG1hdGNoSW5kZXhlcy5wdXNoKCBpICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWF0Y2hJbmRleGVzO1xuXHRcdH0gKSxcblxuXHRcdFwib2RkXCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCApIHtcblx0XHRcdHZhciBpID0gMTtcblx0XHRcdGZvciAoIDsgaSA8IGxlbmd0aDsgaSArPSAyICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9ICksXG5cblx0XHRcImx0XCI6IGNyZWF0ZVBvc2l0aW9uYWxQc2V1ZG8oIGZ1bmN0aW9uKCBtYXRjaEluZGV4ZXMsIGxlbmd0aCwgYXJndW1lbnQgKSB7XG5cdFx0XHR2YXIgaSA9IGFyZ3VtZW50IDwgMCA/XG5cdFx0XHRcdGFyZ3VtZW50ICsgbGVuZ3RoIDpcblx0XHRcdFx0YXJndW1lbnQgPiBsZW5ndGggP1xuXHRcdFx0XHRcdGxlbmd0aCA6XG5cdFx0XHRcdFx0YXJndW1lbnQ7XG5cdFx0XHRmb3IgKCA7IC0taSA+PSAwOyApIHtcblx0XHRcdFx0bWF0Y2hJbmRleGVzLnB1c2goIGkgKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtYXRjaEluZGV4ZXM7XG5cdFx0fSApLFxuXG5cdFx0XCJndFwiOiBjcmVhdGVQb3NpdGlvbmFsUHNldWRvKCBmdW5jdGlvbiggbWF0Y2hJbmRleGVzLCBsZW5ndGgsIGFyZ3VtZW50ICkge1xuXHRcdFx0dmFyIGkgPSBhcmd1bWVudCA8IDAgPyBhcmd1bWVudCArIGxlbmd0aCA6IGFyZ3VtZW50O1xuXHRcdFx0Zm9yICggOyArK2kgPCBsZW5ndGg7ICkge1xuXHRcdFx0XHRtYXRjaEluZGV4ZXMucHVzaCggaSApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1hdGNoSW5kZXhlcztcblx0XHR9IClcblx0fVxufTtcblxuRXhwci5wc2V1ZG9zWyBcIm50aFwiIF0gPSBFeHByLnBzZXVkb3NbIFwiZXFcIiBdO1xuXG4vLyBBZGQgYnV0dG9uL2lucHV0IHR5cGUgcHNldWRvc1xuZm9yICggaSBpbiB7IHJhZGlvOiB0cnVlLCBjaGVja2JveDogdHJ1ZSwgZmlsZTogdHJ1ZSwgcGFzc3dvcmQ6IHRydWUsIGltYWdlOiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlSW5wdXRQc2V1ZG8oIGkgKTtcbn1cbmZvciAoIGkgaW4geyBzdWJtaXQ6IHRydWUsIHJlc2V0OiB0cnVlIH0gKSB7XG5cdEV4cHIucHNldWRvc1sgaSBdID0gY3JlYXRlQnV0dG9uUHNldWRvKCBpICk7XG59XG5cbi8vIEVhc3kgQVBJIGZvciBjcmVhdGluZyBuZXcgc2V0RmlsdGVyc1xuZnVuY3Rpb24gc2V0RmlsdGVycygpIHt9XG5zZXRGaWx0ZXJzLnByb3RvdHlwZSA9IEV4cHIuZmlsdGVycyA9IEV4cHIucHNldWRvcztcbkV4cHIuc2V0RmlsdGVycyA9IG5ldyBzZXRGaWx0ZXJzKCk7XG5cbnRva2VuaXplID0gU2l6emxlLnRva2VuaXplID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBwYXJzZU9ubHkgKSB7XG5cdHZhciBtYXRjaGVkLCBtYXRjaCwgdG9rZW5zLCB0eXBlLFxuXHRcdHNvRmFyLCBncm91cHMsIHByZUZpbHRlcnMsXG5cdFx0Y2FjaGVkID0gdG9rZW5DYWNoZVsgc2VsZWN0b3IgKyBcIiBcIiBdO1xuXG5cdGlmICggY2FjaGVkICkge1xuXHRcdHJldHVybiBwYXJzZU9ubHkgPyAwIDogY2FjaGVkLnNsaWNlKCAwICk7XG5cdH1cblxuXHRzb0ZhciA9IHNlbGVjdG9yO1xuXHRncm91cHMgPSBbXTtcblx0cHJlRmlsdGVycyA9IEV4cHIucHJlRmlsdGVyO1xuXG5cdHdoaWxlICggc29GYXIgKSB7XG5cblx0XHQvLyBDb21tYSBhbmQgZmlyc3QgcnVuXG5cdFx0aWYgKCAhbWF0Y2hlZCB8fCAoIG1hdGNoID0gcmNvbW1hLmV4ZWMoIHNvRmFyICkgKSApIHtcblx0XHRcdGlmICggbWF0Y2ggKSB7XG5cblx0XHRcdFx0Ly8gRG9uJ3QgY29uc3VtZSB0cmFpbGluZyBjb21tYXMgYXMgdmFsaWRcblx0XHRcdFx0c29GYXIgPSBzb0Zhci5zbGljZSggbWF0Y2hbIDAgXS5sZW5ndGggKSB8fCBzb0Zhcjtcblx0XHRcdH1cblx0XHRcdGdyb3Vwcy5wdXNoKCAoIHRva2VucyA9IFtdICkgKTtcblx0XHR9XG5cblx0XHRtYXRjaGVkID0gZmFsc2U7XG5cblx0XHQvLyBDb21iaW5hdG9yc1xuXHRcdGlmICggKCBtYXRjaCA9IHJjb21iaW5hdG9ycy5leGVjKCBzb0ZhciApICkgKSB7XG5cdFx0XHRtYXRjaGVkID0gbWF0Y2guc2hpZnQoKTtcblx0XHRcdHRva2Vucy5wdXNoKCB7XG5cdFx0XHRcdHZhbHVlOiBtYXRjaGVkLFxuXG5cdFx0XHRcdC8vIENhc3QgZGVzY2VuZGFudCBjb21iaW5hdG9ycyB0byBzcGFjZVxuXHRcdFx0XHR0eXBlOiBtYXRjaFsgMCBdLnJlcGxhY2UoIHJ0cmltLCBcIiBcIiApXG5cdFx0XHR9ICk7XG5cdFx0XHRzb0ZhciA9IHNvRmFyLnNsaWNlKCBtYXRjaGVkLmxlbmd0aCApO1xuXHRcdH1cblxuXHRcdC8vIEZpbHRlcnNcblx0XHRmb3IgKCB0eXBlIGluIEV4cHIuZmlsdGVyICkge1xuXHRcdFx0aWYgKCAoIG1hdGNoID0gbWF0Y2hFeHByWyB0eXBlIF0uZXhlYyggc29GYXIgKSApICYmICggIXByZUZpbHRlcnNbIHR5cGUgXSB8fFxuXHRcdFx0XHQoIG1hdGNoID0gcHJlRmlsdGVyc1sgdHlwZSBdKCBtYXRjaCApICkgKSApIHtcblx0XHRcdFx0bWF0Y2hlZCA9IG1hdGNoLnNoaWZ0KCk7XG5cdFx0XHRcdHRva2Vucy5wdXNoKCB7XG5cdFx0XHRcdFx0dmFsdWU6IG1hdGNoZWQsXG5cdFx0XHRcdFx0dHlwZTogdHlwZSxcblx0XHRcdFx0XHRtYXRjaGVzOiBtYXRjaFxuXHRcdFx0XHR9ICk7XG5cdFx0XHRcdHNvRmFyID0gc29GYXIuc2xpY2UoIG1hdGNoZWQubGVuZ3RoICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCAhbWF0Y2hlZCApIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdC8vIFJldHVybiB0aGUgbGVuZ3RoIG9mIHRoZSBpbnZhbGlkIGV4Y2Vzc1xuXHQvLyBpZiB3ZSdyZSBqdXN0IHBhcnNpbmdcblx0Ly8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvciBvciByZXR1cm4gdG9rZW5zXG5cdHJldHVybiBwYXJzZU9ubHkgP1xuXHRcdHNvRmFyLmxlbmd0aCA6XG5cdFx0c29GYXIgP1xuXHRcdFx0U2l6emxlLmVycm9yKCBzZWxlY3RvciApIDpcblxuXHRcdFx0Ly8gQ2FjaGUgdGhlIHRva2Vuc1xuXHRcdFx0dG9rZW5DYWNoZSggc2VsZWN0b3IsIGdyb3VwcyApLnNsaWNlKCAwICk7XG59O1xuXG5mdW5jdGlvbiB0b1NlbGVjdG9yKCB0b2tlbnMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSB0b2tlbnMubGVuZ3RoLFxuXHRcdHNlbGVjdG9yID0gXCJcIjtcblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0c2VsZWN0b3IgKz0gdG9rZW5zWyBpIF0udmFsdWU7XG5cdH1cblx0cmV0dXJuIHNlbGVjdG9yO1xufVxuXG5mdW5jdGlvbiBhZGRDb21iaW5hdG9yKCBtYXRjaGVyLCBjb21iaW5hdG9yLCBiYXNlICkge1xuXHR2YXIgZGlyID0gY29tYmluYXRvci5kaXIsXG5cdFx0c2tpcCA9IGNvbWJpbmF0b3IubmV4dCxcblx0XHRrZXkgPSBza2lwIHx8IGRpcixcblx0XHRjaGVja05vbkVsZW1lbnRzID0gYmFzZSAmJiBrZXkgPT09IFwicGFyZW50Tm9kZVwiLFxuXHRcdGRvbmVOYW1lID0gZG9uZSsrO1xuXG5cdHJldHVybiBjb21iaW5hdG9yLmZpcnN0ID9cblxuXHRcdC8vIENoZWNrIGFnYWluc3QgY2xvc2VzdCBhbmNlc3Rvci9wcmVjZWRpbmcgZWxlbWVudFxuXHRcdGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdGlmICggZWxlbS5ub2RlVHlwZSA9PT0gMSB8fCBjaGVja05vbkVsZW1lbnRzICkge1xuXHRcdFx0XHRcdHJldHVybiBtYXRjaGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gOlxuXG5cdFx0Ly8gQ2hlY2sgYWdhaW5zdCBhbGwgYW5jZXN0b3IvcHJlY2VkaW5nIGVsZW1lbnRzXG5cdFx0ZnVuY3Rpb24oIGVsZW0sIGNvbnRleHQsIHhtbCApIHtcblx0XHRcdHZhciBvbGRDYWNoZSwgdW5pcXVlQ2FjaGUsIG91dGVyQ2FjaGUsXG5cdFx0XHRcdG5ld0NhY2hlID0gWyBkaXJydW5zLCBkb25lTmFtZSBdO1xuXG5cdFx0XHQvLyBXZSBjYW4ndCBzZXQgYXJiaXRyYXJ5IGRhdGEgb24gWE1MIG5vZGVzLCBzbyB0aGV5IGRvbid0IGJlbmVmaXQgZnJvbSBjb21iaW5hdG9yIGNhY2hpbmdcblx0XHRcdGlmICggeG1sICkge1xuXHRcdFx0XHR3aGlsZSAoICggZWxlbSA9IGVsZW1bIGRpciBdICkgKSB7XG5cdFx0XHRcdFx0aWYgKCBlbGVtLm5vZGVUeXBlID09PSAxIHx8IGNoZWNrTm9uRWxlbWVudHMgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlICggKCBlbGVtID0gZWxlbVsgZGlyIF0gKSApIHtcblx0XHRcdFx0XHRpZiAoIGVsZW0ubm9kZVR5cGUgPT09IDEgfHwgY2hlY2tOb25FbGVtZW50cyApIHtcblx0XHRcdFx0XHRcdG91dGVyQ2FjaGUgPSBlbGVtWyBleHBhbmRvIF0gfHwgKCBlbGVtWyBleHBhbmRvIF0gPSB7fSApO1xuXG5cdFx0XHRcdFx0XHQvLyBTdXBwb3J0OiBJRSA8OSBvbmx5XG5cdFx0XHRcdFx0XHQvLyBEZWZlbmQgYWdhaW5zdCBjbG9uZWQgYXR0cm9wZXJ0aWVzIChqUXVlcnkgZ2gtMTcwOSlcblx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlID0gb3V0ZXJDYWNoZVsgZWxlbS51bmlxdWVJRCBdIHx8XG5cdFx0XHRcdFx0XHRcdCggb3V0ZXJDYWNoZVsgZWxlbS51bmlxdWVJRCBdID0ge30gKTtcblxuXHRcdFx0XHRcdFx0aWYgKCBza2lwICYmIHNraXAgPT09IGVsZW0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSApIHtcblx0XHRcdFx0XHRcdFx0ZWxlbSA9IGVsZW1bIGRpciBdIHx8IGVsZW07XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCAoIG9sZENhY2hlID0gdW5pcXVlQ2FjaGVbIGtleSBdICkgJiZcblx0XHRcdFx0XHRcdFx0b2xkQ2FjaGVbIDAgXSA9PT0gZGlycnVucyAmJiBvbGRDYWNoZVsgMSBdID09PSBkb25lTmFtZSApIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBBc3NpZ24gdG8gbmV3Q2FjaGUgc28gcmVzdWx0cyBiYWNrLXByb3BhZ2F0ZSB0byBwcmV2aW91cyBlbGVtZW50c1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKCBuZXdDYWNoZVsgMiBdID0gb2xkQ2FjaGVbIDIgXSApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXVzZSBuZXdjYWNoZSBzbyByZXN1bHRzIGJhY2stcHJvcGFnYXRlIHRvIHByZXZpb3VzIGVsZW1lbnRzXG5cdFx0XHRcdFx0XHRcdHVuaXF1ZUNhY2hlWyBrZXkgXSA9IG5ld0NhY2hlO1xuXG5cdFx0XHRcdFx0XHRcdC8vIEEgbWF0Y2ggbWVhbnMgd2UncmUgZG9uZTsgYSBmYWlsIG1lYW5zIHdlIGhhdmUgdG8ga2VlcCBjaGVja2luZ1xuXHRcdFx0XHRcdFx0XHRpZiAoICggbmV3Q2FjaGVbIDIgXSA9IG1hdGNoZXIoIGVsZW0sIGNvbnRleHQsIHhtbCApICkgKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xufVxuXG5mdW5jdGlvbiBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSB7XG5cdHJldHVybiBtYXRjaGVycy5sZW5ndGggPiAxID9cblx0XHRmdW5jdGlvbiggZWxlbSwgY29udGV4dCwgeG1sICkge1xuXHRcdFx0dmFyIGkgPSBtYXRjaGVycy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0aWYgKCAhbWF0Y2hlcnNbIGkgXSggZWxlbSwgY29udGV4dCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IDpcblx0XHRtYXRjaGVyc1sgMCBdO1xufVxuXG5mdW5jdGlvbiBtdWx0aXBsZUNvbnRleHRzKCBzZWxlY3RvciwgY29udGV4dHMsIHJlc3VsdHMgKSB7XG5cdHZhciBpID0gMCxcblx0XHRsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG5cdGZvciAoIDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFNpenpsZSggc2VsZWN0b3IsIGNvbnRleHRzWyBpIF0sIHJlc3VsdHMgKTtcblx0fVxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gY29uZGVuc2UoIHVubWF0Y2hlZCwgbWFwLCBmaWx0ZXIsIGNvbnRleHQsIHhtbCApIHtcblx0dmFyIGVsZW0sXG5cdFx0bmV3VW5tYXRjaGVkID0gW10sXG5cdFx0aSA9IDAsXG5cdFx0bGVuID0gdW5tYXRjaGVkLmxlbmd0aCxcblx0XHRtYXBwZWQgPSBtYXAgIT0gbnVsbDtcblxuXHRmb3IgKCA7IGkgPCBsZW47IGkrKyApIHtcblx0XHRpZiAoICggZWxlbSA9IHVubWF0Y2hlZFsgaSBdICkgKSB7XG5cdFx0XHRpZiAoICFmaWx0ZXIgfHwgZmlsdGVyKCBlbGVtLCBjb250ZXh0LCB4bWwgKSApIHtcblx0XHRcdFx0bmV3VW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0aWYgKCBtYXBwZWQgKSB7XG5cdFx0XHRcdFx0bWFwLnB1c2goIGkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBuZXdVbm1hdGNoZWQ7XG59XG5cbmZ1bmN0aW9uIHNldE1hdGNoZXIoIHByZUZpbHRlciwgc2VsZWN0b3IsIG1hdGNoZXIsIHBvc3RGaWx0ZXIsIHBvc3RGaW5kZXIsIHBvc3RTZWxlY3RvciApIHtcblx0aWYgKCBwb3N0RmlsdGVyICYmICFwb3N0RmlsdGVyWyBleHBhbmRvIF0gKSB7XG5cdFx0cG9zdEZpbHRlciA9IHNldE1hdGNoZXIoIHBvc3RGaWx0ZXIgKTtcblx0fVxuXHRpZiAoIHBvc3RGaW5kZXIgJiYgIXBvc3RGaW5kZXJbIGV4cGFuZG8gXSApIHtcblx0XHRwb3N0RmluZGVyID0gc2V0TWF0Y2hlciggcG9zdEZpbmRlciwgcG9zdFNlbGVjdG9yICk7XG5cdH1cblx0cmV0dXJuIG1hcmtGdW5jdGlvbiggZnVuY3Rpb24oIHNlZWQsIHJlc3VsdHMsIGNvbnRleHQsIHhtbCApIHtcblx0XHR2YXIgdGVtcCwgaSwgZWxlbSxcblx0XHRcdHByZU1hcCA9IFtdLFxuXHRcdFx0cG9zdE1hcCA9IFtdLFxuXHRcdFx0cHJlZXhpc3RpbmcgPSByZXN1bHRzLmxlbmd0aCxcblxuXHRcdFx0Ly8gR2V0IGluaXRpYWwgZWxlbWVudHMgZnJvbSBzZWVkIG9yIGNvbnRleHRcblx0XHRcdGVsZW1zID0gc2VlZCB8fCBtdWx0aXBsZUNvbnRleHRzKFxuXHRcdFx0XHRzZWxlY3RvciB8fCBcIipcIixcblx0XHRcdFx0Y29udGV4dC5ub2RlVHlwZSA/IFsgY29udGV4dCBdIDogY29udGV4dCxcblx0XHRcdFx0W11cblx0XHRcdCksXG5cblx0XHRcdC8vIFByZWZpbHRlciB0byBnZXQgbWF0Y2hlciBpbnB1dCwgcHJlc2VydmluZyBhIG1hcCBmb3Igc2VlZC1yZXN1bHRzIHN5bmNocm9uaXphdGlvblxuXHRcdFx0bWF0Y2hlckluID0gcHJlRmlsdGVyICYmICggc2VlZCB8fCAhc2VsZWN0b3IgKSA/XG5cdFx0XHRcdGNvbmRlbnNlKCBlbGVtcywgcHJlTWFwLCBwcmVGaWx0ZXIsIGNvbnRleHQsIHhtbCApIDpcblx0XHRcdFx0ZWxlbXMsXG5cblx0XHRcdG1hdGNoZXJPdXQgPSBtYXRjaGVyID9cblxuXHRcdFx0XHQvLyBJZiB3ZSBoYXZlIGEgcG9zdEZpbmRlciwgb3IgZmlsdGVyZWQgc2VlZCwgb3Igbm9uLXNlZWQgcG9zdEZpbHRlciBvciBwcmVleGlzdGluZyByZXN1bHRzLFxuXHRcdFx0XHRwb3N0RmluZGVyIHx8ICggc2VlZCA/IHByZUZpbHRlciA6IHByZWV4aXN0aW5nIHx8IHBvc3RGaWx0ZXIgKSA/XG5cblx0XHRcdFx0XHQvLyAuLi5pbnRlcm1lZGlhdGUgcHJvY2Vzc2luZyBpcyBuZWNlc3Nhcnlcblx0XHRcdFx0XHRbXSA6XG5cblx0XHRcdFx0XHQvLyAuLi5vdGhlcndpc2UgdXNlIHJlc3VsdHMgZGlyZWN0bHlcblx0XHRcdFx0XHRyZXN1bHRzIDpcblx0XHRcdFx0bWF0Y2hlckluO1xuXG5cdFx0Ly8gRmluZCBwcmltYXJ5IG1hdGNoZXNcblx0XHRpZiAoIG1hdGNoZXIgKSB7XG5cdFx0XHRtYXRjaGVyKCBtYXRjaGVySW4sIG1hdGNoZXJPdXQsIGNvbnRleHQsIHhtbCApO1xuXHRcdH1cblxuXHRcdC8vIEFwcGx5IHBvc3RGaWx0ZXJcblx0XHRpZiAoIHBvc3RGaWx0ZXIgKSB7XG5cdFx0XHR0ZW1wID0gY29uZGVuc2UoIG1hdGNoZXJPdXQsIHBvc3RNYXAgKTtcblx0XHRcdHBvc3RGaWx0ZXIoIHRlbXAsIFtdLCBjb250ZXh0LCB4bWwgKTtcblxuXHRcdFx0Ly8gVW4tbWF0Y2ggZmFpbGluZyBlbGVtZW50cyBieSBtb3ZpbmcgdGhlbSBiYWNrIHRvIG1hdGNoZXJJblxuXHRcdFx0aSA9IHRlbXAubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0XHRcdGlmICggKCBlbGVtID0gdGVtcFsgaSBdICkgKSB7XG5cdFx0XHRcdFx0bWF0Y2hlck91dFsgcG9zdE1hcFsgaSBdIF0gPSAhKCBtYXRjaGVySW5bIHBvc3RNYXBbIGkgXSBdID0gZWxlbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0aWYgKCBwb3N0RmluZGVyIHx8IHByZUZpbHRlciApIHtcblx0XHRcdFx0aWYgKCBwb3N0RmluZGVyICkge1xuXG5cdFx0XHRcdFx0Ly8gR2V0IHRoZSBmaW5hbCBtYXRjaGVyT3V0IGJ5IGNvbmRlbnNpbmcgdGhpcyBpbnRlcm1lZGlhdGUgaW50byBwb3N0RmluZGVyIGNvbnRleHRzXG5cdFx0XHRcdFx0dGVtcCA9IFtdO1xuXHRcdFx0XHRcdGkgPSBtYXRjaGVyT3V0Lmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRcdGlmICggKCBlbGVtID0gbWF0Y2hlck91dFsgaSBdICkgKSB7XG5cblx0XHRcdFx0XHRcdFx0Ly8gUmVzdG9yZSBtYXRjaGVySW4gc2luY2UgZWxlbSBpcyBub3QgeWV0IGEgZmluYWwgbWF0Y2hcblx0XHRcdFx0XHRcdFx0dGVtcC5wdXNoKCAoIG1hdGNoZXJJblsgaSBdID0gZWxlbSApICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsICggbWF0Y2hlck91dCA9IFtdICksIHRlbXAsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gTW92ZSBtYXRjaGVkIGVsZW1lbnRzIGZyb20gc2VlZCB0byByZXN1bHRzIHRvIGtlZXAgdGhlbSBzeW5jaHJvbml6ZWRcblx0XHRcdFx0aSA9IG1hdGNoZXJPdXQubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdFx0XHRpZiAoICggZWxlbSA9IG1hdGNoZXJPdXRbIGkgXSApICYmXG5cdFx0XHRcdFx0XHQoIHRlbXAgPSBwb3N0RmluZGVyID8gaW5kZXhPZiggc2VlZCwgZWxlbSApIDogcHJlTWFwWyBpIF0gKSA+IC0xICkge1xuXG5cdFx0XHRcdFx0XHRzZWVkWyB0ZW1wIF0gPSAhKCByZXN1bHRzWyB0ZW1wIF0gPSBlbGVtICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHQvLyBBZGQgZWxlbWVudHMgdG8gcmVzdWx0cywgdGhyb3VnaCBwb3N0RmluZGVyIGlmIGRlZmluZWRcblx0XHR9IGVsc2Uge1xuXHRcdFx0bWF0Y2hlck91dCA9IGNvbmRlbnNlKFxuXHRcdFx0XHRtYXRjaGVyT3V0ID09PSByZXN1bHRzID9cblx0XHRcdFx0XHRtYXRjaGVyT3V0LnNwbGljZSggcHJlZXhpc3RpbmcsIG1hdGNoZXJPdXQubGVuZ3RoICkgOlxuXHRcdFx0XHRcdG1hdGNoZXJPdXRcblx0XHRcdCk7XG5cdFx0XHRpZiAoIHBvc3RGaW5kZXIgKSB7XG5cdFx0XHRcdHBvc3RGaW5kZXIoIG51bGwsIHJlc3VsdHMsIG1hdGNoZXJPdXQsIHhtbCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHVzaC5hcHBseSggcmVzdWx0cywgbWF0Y2hlck91dCApO1xuXHRcdFx0fVxuXHRcdH1cblx0fSApO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVyRnJvbVRva2VucyggdG9rZW5zICkge1xuXHR2YXIgY2hlY2tDb250ZXh0LCBtYXRjaGVyLCBqLFxuXHRcdGxlbiA9IHRva2Vucy5sZW5ndGgsXG5cdFx0bGVhZGluZ1JlbGF0aXZlID0gRXhwci5yZWxhdGl2ZVsgdG9rZW5zWyAwIF0udHlwZSBdLFxuXHRcdGltcGxpY2l0UmVsYXRpdmUgPSBsZWFkaW5nUmVsYXRpdmUgfHwgRXhwci5yZWxhdGl2ZVsgXCIgXCIgXSxcblx0XHRpID0gbGVhZGluZ1JlbGF0aXZlID8gMSA6IDAsXG5cblx0XHQvLyBUaGUgZm91bmRhdGlvbmFsIG1hdGNoZXIgZW5zdXJlcyB0aGF0IGVsZW1lbnRzIGFyZSByZWFjaGFibGUgZnJvbSB0b3AtbGV2ZWwgY29udGV4dChzKVxuXHRcdG1hdGNoQ29udGV4dCA9IGFkZENvbWJpbmF0b3IoIGZ1bmN0aW9uKCBlbGVtICkge1xuXHRcdFx0cmV0dXJuIGVsZW0gPT09IGNoZWNrQ29udGV4dDtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hBbnlDb250ZXh0ID0gYWRkQ29tYmluYXRvciggZnVuY3Rpb24oIGVsZW0gKSB7XG5cdFx0XHRyZXR1cm4gaW5kZXhPZiggY2hlY2tDb250ZXh0LCBlbGVtICkgPiAtMTtcblx0XHR9LCBpbXBsaWNpdFJlbGF0aXZlLCB0cnVlICksXG5cdFx0bWF0Y2hlcnMgPSBbIGZ1bmN0aW9uKCBlbGVtLCBjb250ZXh0LCB4bWwgKSB7XG5cdFx0XHR2YXIgcmV0ID0gKCAhbGVhZGluZ1JlbGF0aXZlICYmICggeG1sIHx8IGNvbnRleHQgIT09IG91dGVybW9zdENvbnRleHQgKSApIHx8IChcblx0XHRcdFx0KCBjaGVja0NvbnRleHQgPSBjb250ZXh0ICkubm9kZVR5cGUgP1xuXHRcdFx0XHRcdG1hdGNoQ29udGV4dCggZWxlbSwgY29udGV4dCwgeG1sICkgOlxuXHRcdFx0XHRcdG1hdGNoQW55Q29udGV4dCggZWxlbSwgY29udGV4dCwgeG1sICkgKTtcblxuXHRcdFx0Ly8gQXZvaWQgaGFuZ2luZyBvbnRvIGVsZW1lbnQgKGlzc3VlICMyOTkpXG5cdFx0XHRjaGVja0NvbnRleHQgPSBudWxsO1xuXHRcdFx0cmV0dXJuIHJldDtcblx0XHR9IF07XG5cblx0Zm9yICggOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0aWYgKCAoIG1hdGNoZXIgPSBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIGkgXS50eXBlIF0gKSApIHtcblx0XHRcdG1hdGNoZXJzID0gWyBhZGRDb21iaW5hdG9yKCBlbGVtZW50TWF0Y2hlciggbWF0Y2hlcnMgKSwgbWF0Y2hlciApIF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1hdGNoZXIgPSBFeHByLmZpbHRlclsgdG9rZW5zWyBpIF0udHlwZSBdLmFwcGx5KCBudWxsLCB0b2tlbnNbIGkgXS5tYXRjaGVzICk7XG5cblx0XHRcdC8vIFJldHVybiBzcGVjaWFsIHVwb24gc2VlaW5nIGEgcG9zaXRpb25hbCBtYXRjaGVyXG5cdFx0XHRpZiAoIG1hdGNoZXJbIGV4cGFuZG8gXSApIHtcblxuXHRcdFx0XHQvLyBGaW5kIHRoZSBuZXh0IHJlbGF0aXZlIG9wZXJhdG9yIChpZiBhbnkpIGZvciBwcm9wZXIgaGFuZGxpbmdcblx0XHRcdFx0aiA9ICsraTtcblx0XHRcdFx0Zm9yICggOyBqIDwgbGVuOyBqKysgKSB7XG5cdFx0XHRcdFx0aWYgKCBFeHByLnJlbGF0aXZlWyB0b2tlbnNbIGogXS50eXBlIF0gKSB7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHNldE1hdGNoZXIoXG5cdFx0XHRcdFx0aSA+IDEgJiYgZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICksXG5cdFx0XHRcdFx0aSA+IDEgJiYgdG9TZWxlY3RvcihcblxuXHRcdFx0XHRcdC8vIElmIHRoZSBwcmVjZWRpbmcgdG9rZW4gd2FzIGEgZGVzY2VuZGFudCBjb21iaW5hdG9yLCBpbnNlcnQgYW4gaW1wbGljaXQgYW55LWVsZW1lbnQgYCpgXG5cdFx0XHRcdFx0dG9rZW5zXG5cdFx0XHRcdFx0XHQuc2xpY2UoIDAsIGkgLSAxIClcblx0XHRcdFx0XHRcdC5jb25jYXQoIHsgdmFsdWU6IHRva2Vuc1sgaSAtIDIgXS50eXBlID09PSBcIiBcIiA/IFwiKlwiIDogXCJcIiB9IClcblx0XHRcdFx0XHQpLnJlcGxhY2UoIHJ0cmltLCBcIiQxXCIgKSxcblx0XHRcdFx0XHRtYXRjaGVyLFxuXHRcdFx0XHRcdGkgPCBqICYmIG1hdGNoZXJGcm9tVG9rZW5zKCB0b2tlbnMuc2xpY2UoIGksIGogKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgbWF0Y2hlckZyb21Ub2tlbnMoICggdG9rZW5zID0gdG9rZW5zLnNsaWNlKCBqICkgKSApLFxuXHRcdFx0XHRcdGogPCBsZW4gJiYgdG9TZWxlY3RvciggdG9rZW5zIClcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdG1hdGNoZXJzLnB1c2goIG1hdGNoZXIgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZWxlbWVudE1hdGNoZXIoIG1hdGNoZXJzICk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyggZWxlbWVudE1hdGNoZXJzLCBzZXRNYXRjaGVycyApIHtcblx0dmFyIGJ5U2V0ID0gc2V0TWF0Y2hlcnMubGVuZ3RoID4gMCxcblx0XHRieUVsZW1lbnQgPSBlbGVtZW50TWF0Y2hlcnMubGVuZ3RoID4gMCxcblx0XHRzdXBlck1hdGNoZXIgPSBmdW5jdGlvbiggc2VlZCwgY29udGV4dCwgeG1sLCByZXN1bHRzLCBvdXRlcm1vc3QgKSB7XG5cdFx0XHR2YXIgZWxlbSwgaiwgbWF0Y2hlcixcblx0XHRcdFx0bWF0Y2hlZENvdW50ID0gMCxcblx0XHRcdFx0aSA9IFwiMFwiLFxuXHRcdFx0XHR1bm1hdGNoZWQgPSBzZWVkICYmIFtdLFxuXHRcdFx0XHRzZXRNYXRjaGVkID0gW10sXG5cdFx0XHRcdGNvbnRleHRCYWNrdXAgPSBvdXRlcm1vc3RDb250ZXh0LFxuXG5cdFx0XHRcdC8vIFdlIG11c3QgYWx3YXlzIGhhdmUgZWl0aGVyIHNlZWQgZWxlbWVudHMgb3Igb3V0ZXJtb3N0IGNvbnRleHRcblx0XHRcdFx0ZWxlbXMgPSBzZWVkIHx8IGJ5RWxlbWVudCAmJiBFeHByLmZpbmRbIFwiVEFHXCIgXSggXCIqXCIsIG91dGVybW9zdCApLFxuXG5cdFx0XHRcdC8vIFVzZSBpbnRlZ2VyIGRpcnJ1bnMgaWZmIHRoaXMgaXMgdGhlIG91dGVybW9zdCBtYXRjaGVyXG5cdFx0XHRcdGRpcnJ1bnNVbmlxdWUgPSAoIGRpcnJ1bnMgKz0gY29udGV4dEJhY2t1cCA9PSBudWxsID8gMSA6IE1hdGgucmFuZG9tKCkgfHwgMC4xICksXG5cdFx0XHRcdGxlbiA9IGVsZW1zLmxlbmd0aDtcblxuXHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cblx0XHRcdFx0Ly8gU3VwcG9ydDogSUUgMTErLCBFZGdlIDE3IC0gMTgrXG5cdFx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0XHQvLyB0d28gZG9jdW1lbnRzOyBzaGFsbG93IGNvbXBhcmlzb25zIHdvcmsuXG5cdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHQgPT0gZG9jdW1lbnQgfHwgY29udGV4dCB8fCBvdXRlcm1vc3Q7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFkZCBlbGVtZW50cyBwYXNzaW5nIGVsZW1lbnRNYXRjaGVycyBkaXJlY3RseSB0byByZXN1bHRzXG5cdFx0XHQvLyBTdXBwb3J0OiBJRTw5LCBTYWZhcmlcblx0XHRcdC8vIFRvbGVyYXRlIE5vZGVMaXN0IHByb3BlcnRpZXMgKElFOiBcImxlbmd0aFwiOyBTYWZhcmk6IDxudW1iZXI+KSBtYXRjaGluZyBlbGVtZW50cyBieSBpZFxuXHRcdFx0Zm9yICggOyBpICE9PSBsZW4gJiYgKCBlbGVtID0gZWxlbXNbIGkgXSApICE9IG51bGw7IGkrKyApIHtcblx0XHRcdFx0aWYgKCBieUVsZW1lbnQgJiYgZWxlbSApIHtcblx0XHRcdFx0XHRqID0gMDtcblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQ6IElFIDExKywgRWRnZSAxNyAtIDE4K1xuXHRcdFx0XHRcdC8vIElFL0VkZ2Ugc29tZXRpbWVzIHRocm93IGEgXCJQZXJtaXNzaW9uIGRlbmllZFwiIGVycm9yIHdoZW4gc3RyaWN0LWNvbXBhcmluZ1xuXHRcdFx0XHRcdC8vIHR3byBkb2N1bWVudHM7IHNoYWxsb3cgY29tcGFyaXNvbnMgd29yay5cblx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXFlcWVxXG5cdFx0XHRcdFx0aWYgKCAhY29udGV4dCAmJiBlbGVtLm93bmVyRG9jdW1lbnQgIT0gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdFx0XHRzZXREb2N1bWVudCggZWxlbSApO1xuXHRcdFx0XHRcdFx0eG1sID0gIWRvY3VtZW50SXNIVE1MO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR3aGlsZSAoICggbWF0Y2hlciA9IGVsZW1lbnRNYXRjaGVyc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRcdGlmICggbWF0Y2hlciggZWxlbSwgY29udGV4dCB8fCBkb2N1bWVudCwgeG1sICkgKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdHMucHVzaCggZWxlbSApO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCBvdXRlcm1vc3QgKSB7XG5cdFx0XHRcdFx0XHRkaXJydW5zID0gZGlycnVuc1VuaXF1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUcmFjayB1bm1hdGNoZWQgZWxlbWVudHMgZm9yIHNldCBmaWx0ZXJzXG5cdFx0XHRcdGlmICggYnlTZXQgKSB7XG5cblx0XHRcdFx0XHQvLyBUaGV5IHdpbGwgaGF2ZSBnb25lIHRocm91Z2ggYWxsIHBvc3NpYmxlIG1hdGNoZXJzXG5cdFx0XHRcdFx0aWYgKCAoIGVsZW0gPSAhbWF0Y2hlciAmJiBlbGVtICkgKSB7XG5cdFx0XHRcdFx0XHRtYXRjaGVkQ291bnQtLTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBMZW5ndGhlbiB0aGUgYXJyYXkgZm9yIGV2ZXJ5IGVsZW1lbnQsIG1hdGNoZWQgb3Igbm90XG5cdFx0XHRcdFx0aWYgKCBzZWVkICkge1xuXHRcdFx0XHRcdFx0dW5tYXRjaGVkLnB1c2goIGVsZW0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYGlgIGlzIG5vdyB0aGUgY291bnQgb2YgZWxlbWVudHMgdmlzaXRlZCBhYm92ZSwgYW5kIGFkZGluZyBpdCB0byBgbWF0Y2hlZENvdW50YFxuXHRcdFx0Ly8gbWFrZXMgdGhlIGxhdHRlciBub25uZWdhdGl2ZS5cblx0XHRcdG1hdGNoZWRDb3VudCArPSBpO1xuXG5cdFx0XHQvLyBBcHBseSBzZXQgZmlsdGVycyB0byB1bm1hdGNoZWQgZWxlbWVudHNcblx0XHRcdC8vIE5PVEU6IFRoaXMgY2FuIGJlIHNraXBwZWQgaWYgdGhlcmUgYXJlIG5vIHVubWF0Y2hlZCBlbGVtZW50cyAoaS5lLiwgYG1hdGNoZWRDb3VudGBcblx0XHRcdC8vIGVxdWFscyBgaWApLCB1bmxlc3Mgd2UgZGlkbid0IHZpc2l0IF9hbnlfIGVsZW1lbnRzIGluIHRoZSBhYm92ZSBsb29wIGJlY2F1c2Ugd2UgaGF2ZVxuXHRcdFx0Ly8gbm8gZWxlbWVudCBtYXRjaGVycyBhbmQgbm8gc2VlZC5cblx0XHRcdC8vIEluY3JlbWVudGluZyBhbiBpbml0aWFsbHktc3RyaW5nIFwiMFwiIGBpYCBhbGxvd3MgYGlgIHRvIHJlbWFpbiBhIHN0cmluZyBvbmx5IGluIHRoYXRcblx0XHRcdC8vIGNhc2UsIHdoaWNoIHdpbGwgcmVzdWx0IGluIGEgXCIwMFwiIGBtYXRjaGVkQ291bnRgIHRoYXQgZGlmZmVycyBmcm9tIGBpYCBidXQgaXMgYWxzb1xuXHRcdFx0Ly8gbnVtZXJpY2FsbHkgemVyby5cblx0XHRcdGlmICggYnlTZXQgJiYgaSAhPT0gbWF0Y2hlZENvdW50ICkge1xuXHRcdFx0XHRqID0gMDtcblx0XHRcdFx0d2hpbGUgKCAoIG1hdGNoZXIgPSBzZXRNYXRjaGVyc1sgaisrIF0gKSApIHtcblx0XHRcdFx0XHRtYXRjaGVyKCB1bm1hdGNoZWQsIHNldE1hdGNoZWQsIGNvbnRleHQsIHhtbCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCBzZWVkICkge1xuXG5cdFx0XHRcdFx0Ly8gUmVpbnRlZ3JhdGUgZWxlbWVudCBtYXRjaGVzIHRvIGVsaW1pbmF0ZSB0aGUgbmVlZCBmb3Igc29ydGluZ1xuXHRcdFx0XHRcdGlmICggbWF0Y2hlZENvdW50ID4gMCApIHtcblx0XHRcdFx0XHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0XHRcdFx0XHRpZiAoICEoIHVubWF0Y2hlZFsgaSBdIHx8IHNldE1hdGNoZWRbIGkgXSApICkge1xuXHRcdFx0XHRcdFx0XHRcdHNldE1hdGNoZWRbIGkgXSA9IHBvcC5jYWxsKCByZXN1bHRzICk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBEaXNjYXJkIGluZGV4IHBsYWNlaG9sZGVyIHZhbHVlcyB0byBnZXQgb25seSBhY3R1YWwgbWF0Y2hlc1xuXHRcdFx0XHRcdHNldE1hdGNoZWQgPSBjb25kZW5zZSggc2V0TWF0Y2hlZCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWRkIG1hdGNoZXMgdG8gcmVzdWx0c1xuXHRcdFx0XHRwdXNoLmFwcGx5KCByZXN1bHRzLCBzZXRNYXRjaGVkICk7XG5cblx0XHRcdFx0Ly8gU2VlZGxlc3Mgc2V0IG1hdGNoZXMgc3VjY2VlZGluZyBtdWx0aXBsZSBzdWNjZXNzZnVsIG1hdGNoZXJzIHN0aXB1bGF0ZSBzb3J0aW5nXG5cdFx0XHRcdGlmICggb3V0ZXJtb3N0ICYmICFzZWVkICYmIHNldE1hdGNoZWQubGVuZ3RoID4gMCAmJlxuXHRcdFx0XHRcdCggbWF0Y2hlZENvdW50ICsgc2V0TWF0Y2hlcnMubGVuZ3RoICkgPiAxICkge1xuXG5cdFx0XHRcdFx0U2l6emxlLnVuaXF1ZVNvcnQoIHJlc3VsdHMgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBPdmVycmlkZSBtYW5pcHVsYXRpb24gb2YgZ2xvYmFscyBieSBuZXN0ZWQgbWF0Y2hlcnNcblx0XHRcdGlmICggb3V0ZXJtb3N0ICkge1xuXHRcdFx0XHRkaXJydW5zID0gZGlycnVuc1VuaXF1ZTtcblx0XHRcdFx0b3V0ZXJtb3N0Q29udGV4dCA9IGNvbnRleHRCYWNrdXA7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1bm1hdGNoZWQ7XG5cdFx0fTtcblxuXHRyZXR1cm4gYnlTZXQgP1xuXHRcdG1hcmtGdW5jdGlvbiggc3VwZXJNYXRjaGVyICkgOlxuXHRcdHN1cGVyTWF0Y2hlcjtcbn1cblxuY29tcGlsZSA9IFNpenpsZS5jb21waWxlID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBtYXRjaCAvKiBJbnRlcm5hbCBVc2UgT25seSAqLyApIHtcblx0dmFyIGksXG5cdFx0c2V0TWF0Y2hlcnMgPSBbXSxcblx0XHRlbGVtZW50TWF0Y2hlcnMgPSBbXSxcblx0XHRjYWNoZWQgPSBjb21waWxlckNhY2hlWyBzZWxlY3RvciArIFwiIFwiIF07XG5cblx0aWYgKCAhY2FjaGVkICkge1xuXG5cdFx0Ly8gR2VuZXJhdGUgYSBmdW5jdGlvbiBvZiByZWN1cnNpdmUgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHVzZWQgdG8gY2hlY2sgZWFjaCBlbGVtZW50XG5cdFx0aWYgKCAhbWF0Y2ggKSB7XG5cdFx0XHRtYXRjaCA9IHRva2VuaXplKCBzZWxlY3RvciApO1xuXHRcdH1cblx0XHRpID0gbWF0Y2gubGVuZ3RoO1xuXHRcdHdoaWxlICggaS0tICkge1xuXHRcdFx0Y2FjaGVkID0gbWF0Y2hlckZyb21Ub2tlbnMoIG1hdGNoWyBpIF0gKTtcblx0XHRcdGlmICggY2FjaGVkWyBleHBhbmRvIF0gKSB7XG5cdFx0XHRcdHNldE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWxlbWVudE1hdGNoZXJzLnB1c2goIGNhY2hlZCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENhY2hlIHRoZSBjb21waWxlZCBmdW5jdGlvblxuXHRcdGNhY2hlZCA9IGNvbXBpbGVyQ2FjaGUoXG5cdFx0XHRzZWxlY3Rvcixcblx0XHRcdG1hdGNoZXJGcm9tR3JvdXBNYXRjaGVycyggZWxlbWVudE1hdGNoZXJzLCBzZXRNYXRjaGVycyApXG5cdFx0KTtcblxuXHRcdC8vIFNhdmUgc2VsZWN0b3IgYW5kIHRva2VuaXphdGlvblxuXHRcdGNhY2hlZC5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHR9XG5cdHJldHVybiBjYWNoZWQ7XG59O1xuXG4vKipcbiAqIEEgbG93LWxldmVsIHNlbGVjdGlvbiBmdW5jdGlvbiB0aGF0IHdvcmtzIHdpdGggU2l6emxlJ3MgY29tcGlsZWRcbiAqICBzZWxlY3RvciBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSBzZWxlY3RvciBBIHNlbGVjdG9yIG9yIGEgcHJlLWNvbXBpbGVkXG4gKiAgc2VsZWN0b3IgZnVuY3Rpb24gYnVpbHQgd2l0aCBTaXp6bGUuY29tcGlsZVxuICogQHBhcmFtIHtFbGVtZW50fSBjb250ZXh0XG4gKiBAcGFyYW0ge0FycmF5fSBbcmVzdWx0c11cbiAqIEBwYXJhbSB7QXJyYXl9IFtzZWVkXSBBIHNldCBvZiBlbGVtZW50cyB0byBtYXRjaCBhZ2FpbnN0XG4gKi9cbnNlbGVjdCA9IFNpenpsZS5zZWxlY3QgPSBmdW5jdGlvbiggc2VsZWN0b3IsIGNvbnRleHQsIHJlc3VsdHMsIHNlZWQgKSB7XG5cdHZhciBpLCB0b2tlbnMsIHRva2VuLCB0eXBlLCBmaW5kLFxuXHRcdGNvbXBpbGVkID0gdHlwZW9mIHNlbGVjdG9yID09PSBcImZ1bmN0aW9uXCIgJiYgc2VsZWN0b3IsXG5cdFx0bWF0Y2ggPSAhc2VlZCAmJiB0b2tlbml6ZSggKCBzZWxlY3RvciA9IGNvbXBpbGVkLnNlbGVjdG9yIHx8IHNlbGVjdG9yICkgKTtcblxuXHRyZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcblxuXHQvLyBUcnkgdG8gbWluaW1pemUgb3BlcmF0aW9ucyBpZiB0aGVyZSBpcyBvbmx5IG9uZSBzZWxlY3RvciBpbiB0aGUgbGlzdCBhbmQgbm8gc2VlZFxuXHQvLyAodGhlIGxhdHRlciBvZiB3aGljaCBndWFyYW50ZWVzIHVzIGNvbnRleHQpXG5cdGlmICggbWF0Y2gubGVuZ3RoID09PSAxICkge1xuXG5cdFx0Ly8gUmVkdWNlIGNvbnRleHQgaWYgdGhlIGxlYWRpbmcgY29tcG91bmQgc2VsZWN0b3IgaXMgYW4gSURcblx0XHR0b2tlbnMgPSBtYXRjaFsgMCBdID0gbWF0Y2hbIDAgXS5zbGljZSggMCApO1xuXHRcdGlmICggdG9rZW5zLmxlbmd0aCA+IDIgJiYgKCB0b2tlbiA9IHRva2Vuc1sgMCBdICkudHlwZSA9PT0gXCJJRFwiICYmXG5cdFx0XHRjb250ZXh0Lm5vZGVUeXBlID09PSA5ICYmIGRvY3VtZW50SXNIVE1MICYmIEV4cHIucmVsYXRpdmVbIHRva2Vuc1sgMSBdLnR5cGUgXSApIHtcblxuXHRcdFx0Y29udGV4dCA9ICggRXhwci5maW5kWyBcIklEXCIgXSggdG9rZW4ubWF0Y2hlc1sgMCBdXG5cdFx0XHRcdC5yZXBsYWNlKCBydW5lc2NhcGUsIGZ1bmVzY2FwZSApLCBjb250ZXh0ICkgfHwgW10gKVsgMCBdO1xuXHRcdFx0aWYgKCAhY29udGV4dCApIHtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cblx0XHRcdC8vIFByZWNvbXBpbGVkIG1hdGNoZXJzIHdpbGwgc3RpbGwgdmVyaWZ5IGFuY2VzdHJ5LCBzbyBzdGVwIHVwIGEgbGV2ZWxcblx0XHRcdH0gZWxzZSBpZiAoIGNvbXBpbGVkICkge1xuXHRcdFx0XHRjb250ZXh0ID0gY29udGV4dC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnNsaWNlKCB0b2tlbnMuc2hpZnQoKS52YWx1ZS5sZW5ndGggKTtcblx0XHR9XG5cblx0XHQvLyBGZXRjaCBhIHNlZWQgc2V0IGZvciByaWdodC10by1sZWZ0IG1hdGNoaW5nXG5cdFx0aSA9IG1hdGNoRXhwclsgXCJuZWVkc0NvbnRleHRcIiBdLnRlc3QoIHNlbGVjdG9yICkgPyAwIDogdG9rZW5zLmxlbmd0aDtcblx0XHR3aGlsZSAoIGktLSApIHtcblx0XHRcdHRva2VuID0gdG9rZW5zWyBpIF07XG5cblx0XHRcdC8vIEFib3J0IGlmIHdlIGhpdCBhIGNvbWJpbmF0b3Jcblx0XHRcdGlmICggRXhwci5yZWxhdGl2ZVsgKCB0eXBlID0gdG9rZW4udHlwZSApIF0gKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCAoIGZpbmQgPSBFeHByLmZpbmRbIHR5cGUgXSApICkge1xuXG5cdFx0XHRcdC8vIFNlYXJjaCwgZXhwYW5kaW5nIGNvbnRleHQgZm9yIGxlYWRpbmcgc2libGluZyBjb21iaW5hdG9yc1xuXHRcdFx0XHRpZiAoICggc2VlZCA9IGZpbmQoXG5cdFx0XHRcdFx0dG9rZW4ubWF0Y2hlc1sgMCBdLnJlcGxhY2UoIHJ1bmVzY2FwZSwgZnVuZXNjYXBlICksXG5cdFx0XHRcdFx0cnNpYmxpbmcudGVzdCggdG9rZW5zWyAwIF0udHlwZSApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fFxuXHRcdFx0XHRcdFx0Y29udGV4dFxuXHRcdFx0XHQpICkgKSB7XG5cblx0XHRcdFx0XHQvLyBJZiBzZWVkIGlzIGVtcHR5IG9yIG5vIHRva2VucyByZW1haW4sIHdlIGNhbiByZXR1cm4gZWFybHlcblx0XHRcdFx0XHR0b2tlbnMuc3BsaWNlKCBpLCAxICk7XG5cdFx0XHRcdFx0c2VsZWN0b3IgPSBzZWVkLmxlbmd0aCAmJiB0b1NlbGVjdG9yKCB0b2tlbnMgKTtcblx0XHRcdFx0XHRpZiAoICFzZWxlY3RvciApIHtcblx0XHRcdFx0XHRcdHB1c2guYXBwbHkoIHJlc3VsdHMsIHNlZWQgKTtcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHRzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gQ29tcGlsZSBhbmQgZXhlY3V0ZSBhIGZpbHRlcmluZyBmdW5jdGlvbiBpZiBvbmUgaXMgbm90IHByb3ZpZGVkXG5cdC8vIFByb3ZpZGUgYG1hdGNoYCB0byBhdm9pZCByZXRva2VuaXphdGlvbiBpZiB3ZSBtb2RpZmllZCB0aGUgc2VsZWN0b3IgYWJvdmVcblx0KCBjb21waWxlZCB8fCBjb21waWxlKCBzZWxlY3RvciwgbWF0Y2ggKSApKFxuXHRcdHNlZWQsXG5cdFx0Y29udGV4dCxcblx0XHQhZG9jdW1lbnRJc0hUTUwsXG5cdFx0cmVzdWx0cyxcblx0XHQhY29udGV4dCB8fCByc2libGluZy50ZXN0KCBzZWxlY3RvciApICYmIHRlc3RDb250ZXh0KCBjb250ZXh0LnBhcmVudE5vZGUgKSB8fCBjb250ZXh0XG5cdCk7XG5cdHJldHVybiByZXN1bHRzO1xufTtcblxuLy8gT25lLXRpbWUgYXNzaWdubWVudHNcblxuLy8gU29ydCBzdGFiaWxpdHlcbnN1cHBvcnQuc29ydFN0YWJsZSA9IGV4cGFuZG8uc3BsaXQoIFwiXCIgKS5zb3J0KCBzb3J0T3JkZXIgKS5qb2luKCBcIlwiICkgPT09IGV4cGFuZG87XG5cbi8vIFN1cHBvcnQ6IENocm9tZSAxNC0zNStcbi8vIEFsd2F5cyBhc3N1bWUgZHVwbGljYXRlcyBpZiB0aGV5IGFyZW4ndCBwYXNzZWQgdG8gdGhlIGNvbXBhcmlzb24gZnVuY3Rpb25cbnN1cHBvcnQuZGV0ZWN0RHVwbGljYXRlcyA9ICEhaGFzRHVwbGljYXRlO1xuXG4vLyBJbml0aWFsaXplIGFnYWluc3QgdGhlIGRlZmF1bHQgZG9jdW1lbnRcbnNldERvY3VtZW50KCk7XG5cbi8vIFN1cHBvcnQ6IFdlYmtpdDw1MzcuMzIgLSBTYWZhcmkgNi4wLjMvQ2hyb21lIDI1IChmaXhlZCBpbiBDaHJvbWUgMjcpXG4vLyBEZXRhY2hlZCBub2RlcyBjb25mb3VuZGluZ2x5IGZvbGxvdyAqZWFjaCBvdGhlcipcbnN1cHBvcnQuc29ydERldGFjaGVkID0gYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cblx0Ly8gU2hvdWxkIHJldHVybiAxLCBidXQgcmV0dXJucyA0IChmb2xsb3dpbmcpXG5cdHJldHVybiBlbC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiggZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJmaWVsZHNldFwiICkgKSAmIDE7XG59ICk7XG5cbi8vIFN1cHBvcnQ6IElFPDhcbi8vIFByZXZlbnQgYXR0cmlidXRlL3Byb3BlcnR5IFwiaW50ZXJwb2xhdGlvblwiXG4vLyBodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zNTM2NDI5JTI4VlMuODUlMjkuYXNweFxuaWYgKCAhYXNzZXJ0KCBmdW5jdGlvbiggZWwgKSB7XG5cdGVsLmlubmVySFRNTCA9IFwiPGEgaHJlZj0nIyc+PC9hPlwiO1xuXHRyZXR1cm4gZWwuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoIFwiaHJlZlwiICkgPT09IFwiI1wiO1xufSApICkge1xuXHRhZGRIYW5kbGUoIFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoIG5hbWUsIG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0eXBlXCIgPyAxIDogMiApO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBTdXBwb3J0OiBJRTw5XG4vLyBVc2UgZGVmYXVsdFZhbHVlIGluIHBsYWNlIG9mIGdldEF0dHJpYnV0ZShcInZhbHVlXCIpXG5pZiAoICFzdXBwb3J0LmF0dHJpYnV0ZXMgfHwgIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRlbC5pbm5lckhUTUwgPSBcIjxpbnB1dC8+XCI7XG5cdGVsLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKCBcInZhbHVlXCIsIFwiXCIgKTtcblx0cmV0dXJuIGVsLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKCBcInZhbHVlXCIgKSA9PT0gXCJcIjtcbn0gKSApIHtcblx0YWRkSGFuZGxlKCBcInZhbHVlXCIsIGZ1bmN0aW9uKCBlbGVtLCBfbmFtZSwgaXNYTUwgKSB7XG5cdFx0aWYgKCAhaXNYTUwgJiYgZWxlbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImlucHV0XCIgKSB7XG5cdFx0XHRyZXR1cm4gZWxlbS5kZWZhdWx0VmFsdWU7XG5cdFx0fVxuXHR9ICk7XG59XG5cbi8vIFN1cHBvcnQ6IElFPDlcbi8vIFVzZSBnZXRBdHRyaWJ1dGVOb2RlIHRvIGZldGNoIGJvb2xlYW5zIHdoZW4gZ2V0QXR0cmlidXRlIGxpZXNcbmlmICggIWFzc2VydCggZnVuY3Rpb24oIGVsICkge1xuXHRyZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCBcImRpc2FibGVkXCIgKSA9PSBudWxsO1xufSApICkge1xuXHRhZGRIYW5kbGUoIGJvb2xlYW5zLCBmdW5jdGlvbiggZWxlbSwgbmFtZSwgaXNYTUwgKSB7XG5cdFx0dmFyIHZhbDtcblx0XHRpZiAoICFpc1hNTCApIHtcblx0XHRcdHJldHVybiBlbGVtWyBuYW1lIF0gPT09IHRydWUgPyBuYW1lLnRvTG93ZXJDYXNlKCkgOlxuXHRcdFx0XHQoIHZhbCA9IGVsZW0uZ2V0QXR0cmlidXRlTm9kZSggbmFtZSApICkgJiYgdmFsLnNwZWNpZmllZCA/XG5cdFx0XHRcdFx0dmFsLnZhbHVlIDpcblx0XHRcdFx0XHRudWxsO1xuXHRcdH1cblx0fSApO1xufVxuXG4vLyBFWFBPU0VcbnZhciBfc2l6emxlID0gd2luZG93LlNpenpsZTtcblxuU2l6emxlLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB3aW5kb3cuU2l6emxlID09PSBTaXp6bGUgKSB7XG5cdFx0d2luZG93LlNpenpsZSA9IF9zaXp6bGU7XG5cdH1cblxuXHRyZXR1cm4gU2l6emxlO1xufTtcblxuaWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcblx0ZGVmaW5lKCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gU2l6emxlO1xuXHR9ICk7XG5cbi8vIFNpenpsZSByZXF1aXJlcyB0aGF0IHRoZXJlIGJlIGEgZ2xvYmFsIHdpbmRvdyBpbiBDb21tb24tSlMgbGlrZSBlbnZpcm9ubWVudHNcbn0gZWxzZSBpZiAoIHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gU2l6emxlO1xufSBlbHNlIHtcblx0d2luZG93LlNpenpsZSA9IFNpenpsZTtcbn1cblxuLy8gRVhQT1NFXG5cbn0gKSggd2luZG93ICk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3NpenpsZS9kaXN0L3NpenpsZS5qcyIsIi8qKlxuICogIyBNYXRjaFxuICpcbiAqIFJldHJpZXZlIHNlbGVjdG9yIGZvciBhIG5vZGUuXG4gKi9cblxuaW1wb3J0IHsgZ2V0U2VsZWN0IH0gZnJvbSAnLi9jb21tb24nXG5pbXBvcnQgeyBlc2NhcGVWYWx1ZSB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMpIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50LFxuICAgIHNraXAgPSBudWxsLFxuICAgIHByaW9yaXR5ID0gWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZSA9IHt9LFxuICAgIGZvcm1hdFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IHBhdGggPSBbXVxuICB2YXIgZWxlbWVudCA9IG5vZGVcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIGNvbnN0IGpxdWVyeSA9IChmb3JtYXQgPT09ICdqcXVlcnknKVxuICBjb25zdCBzZWxlY3QgPSBnZXRTZWxlY3Qob3B0aW9ucylcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGlnbm9yZVt0eXBlXVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnZnVuY3Rpb24nKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZS50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgcHJlZGljYXRlID0gbmV3IFJlZ0V4cChlc2NhcGVWYWx1ZShwcmVkaWNhdGUpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZSA/IC8oPzopLyA6IC8uXi9cbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gKG5hbWUsIHZhbHVlKSA9PiBwcmVkaWNhdGUudGVzdCh2YWx1ZSlcbiAgfSlcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxMSkge1xuICAgIGlmIChza2lwQ2hlY2tzKGVsZW1lbnQpICE9PSB0cnVlKSB7XG4gICAgICAvLyB+IGdsb2JhbFxuICAgICAgaWYgKGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QsIHJvb3QpKSBicmVha1xuICAgICAgaWYgKGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0LCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdClcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgc2VsZWN0KVxuICAgICAgfVxuXG4gICAgICBpZiAoanF1ZXJ5ICYmIHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tDb250YWlucyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmluZSBvbmx5IG9uZSBwYXJ0IGVhY2ggaXRlcmF0aW9uXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NoaWxkcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJylcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgc2VsZWN0LCBwYXJlbnQpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHNlbGVjdChwYXR0ZXJuLCBwYXJlbnQpXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICAgIHNlbGVjdCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzZXMgPSBbXSwgc2VsZWN0LCBwYXJlbnQpIHtcbiAgbGV0IHJlc3VsdCA9IFtbXV1cblxuICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHIuY29uY2F0KCcuJyArIGMpKVxuICAgIH0pXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcblxuICByZXN1bHQgPSByZXN1bHQuc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGggfSlcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHIgPSByZXN1bHRbaV0uam9pbignJylcbiAgICBjb25zdCBtYXRjaGVzID0gc2VsZWN0KHIsIHBhcmVudClcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMb29rdXAgYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG5cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBhdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gIHZhciBhdHRyaWJ1dGVOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLm1hcCgodmFsKSA9PiBhdHRyaWJ1dGVzW3ZhbF0ubmFtZSlcbiAgICAuZmlsdGVyKChhKSA9PiBwcmlvcml0eS5pbmRleE9mKGEpIDwgMClcblxuICB2YXIgc29ydGVkS2V5cyA9IFsgLi4ucHJpb3JpdHksIC4uLmF0dHJpYnV0ZU5hbWVzIF1cblxuICB2YXIgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzb3J0ZWRLZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHNvcnRlZEtleXNbaV1cbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlICYmIGF0dHJpYnV0ZS5uYW1lKVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlICYmIGF0dHJpYnV0ZS52YWx1ZSlcbiAgICBjb25zdCB1c2VOYW1lZElnbm9yZSA9IGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcblxuICAgIGNvbnN0IGN1cnJlbnRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgaWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBpZ25vcmUuYXR0cmlidXRlXG4gICAgY29uc3QgY3VycmVudERlZmF1bHRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgZGVmYXVsdElnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgZGVmYXVsdElnbm9yZS5hdHRyaWJ1dGVcbiAgICBpZiAoY2hlY2tJZ25vcmUoY3VycmVudElnbm9yZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGN1cnJlbnREZWZhdWx0SWdub3JlKSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICB2YXIgcGF0dGVybiA9IGBbJHthdHRyaWJ1dGVOYW1lfT1cIiR7YXR0cmlidXRlVmFsdWV9XCJdYFxuICAgIGlmKCFhdHRyaWJ1dGVWYWx1ZS50cmltKCkpIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdpZCcpIHtcbiAgICAgIHBhdHRlcm4gPSBgIyR7YXR0cmlidXRlVmFsdWV9YFxuICAgIH1cblxuICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICBsZXQgY2xhc3NOYW1lcyA9IGF0dHJpYnV0ZVZhbHVlLnRyaW0oKS5zcGxpdCgvXFxzKy9nKVxuICAgICAgY29uc3QgY2xhc3NJZ25vcmUgPSBpZ25vcmUuY2xhc3MgfHwgZGVmYXVsdElnbm9yZS5jbGFzc1xuICAgICAgaWYgKGNsYXNzSWdub3JlKSB7XG4gICAgICAgIGNsYXNzTmFtZXMgPSBjbGFzc05hbWVzLmZpbHRlcihjbGFzc05hbWUgPT4gIWNsYXNzSWdub3JlKGNsYXNzTmFtZSkpXG4gICAgICB9XG4gICAgICBpZiAoY2xhc3NOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIHBhdHRlcm4gPSBnZXRDbGFzc1NlbGVjdG9yKGNsYXNzTmFtZXMsIHNlbGVjdCwgcGFyZW50KVxuXG4gICAgICBpZiAoIXBhdHRlcm4pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFnTmFtZSArIHBhdHRlcm5cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgc2VsZWN0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnIChlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHNlbGVjdCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgbGV0IG1hdGNoZXMgPSBbXVxuICAgIG1hdGNoZXMgPSBzZWxlY3QocGF0dGVybiwgcGFyZW50KVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICBpZiAocGF0dGVybiA9PT0gJ2lmcmFtZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRUYWdQYXR0ZXJuIChlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBOT1RFOiAnY2hpbGRUYWdzJyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYXMgYSB2aWV3IGZpbHRlciBmb3IgdGFncyB1c2luZyAnYWRhcHRlci5qcydcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGRzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkVGFncyB8fCBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkID09PSBlbGVtZW50KSB7XG4gICAgICBjb25zdCBjaGlsZFBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgY2hpbGQsIGlnbm9yZSwgc2VsZWN0KVxuICAgICAgaWYgKCFjaGlsZFBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICAgICAgRWxlbWVudCBjb3VsZG4ndCBiZSBtYXRjaGVkIHRocm91Z2ggc3RyaWN0IGlnbm9yZSBwYXR0ZXJuIVxuICAgICAgICBgLCBjaGlsZCwgaWdub3JlLCBjaGlsZFBhdHRlcm4pXG4gICAgICB9XG4gICAgICBjb25zdCBwYXR0ZXJuID0gYD4gJHtjaGlsZFBhdHRlcm59Om50aC1jaGlsZCgke2krMX0pYFxuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGNvbnRhaW5zXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NvbnRhaW5zIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBzZWxlY3QpIHtcbiAgY29uc3QgZWxlbWVudFBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gIGNvbnN0IHRleHQgPSBlbGVtZW50LnRleHRDb250ZW50LnRyaW0oKVxuICBpZiAodGV4dC5sZW5ndGggPiAwICYmIHRleHQuaW5kZXhPZignXFxuJykgPCAwKSB7XG4gICAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRUYWdzIHx8IHBhcmVudC5jaGlsZHJlblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgICBpZiAoY2hpbGQgIT09IGVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGNoaWxkLnRleHRDb250ZW50LmluZGV4T2YodGV4dCkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcGF0dGVybiA9IGAke2VsZW1lbnRQYXR0ZXJufTpjb250YWlucyhcIiR7dGV4dH1cIilgXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZFBhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHNlbGVjdCkge1xuICB2YXIgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBzZWxlY3QpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lnbm9yZSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCJleHBvcnQgeyBkZWZhdWx0IGFzIHNlbGVjdCwgZ2V0U2luZ2xlU2VsZWN0b3IsIGdldE11bHRpU2VsZWN0b3IgfSBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3B0aW1pemUgfSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==