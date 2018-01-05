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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
  return value && value.replace(/['"`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '\A');
}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonAncestor = getCommonAncestor;
exports.getCommonProperties = getCommonProperties;
/**
 * # Common
 *
 * Process collections for similarities.
 */

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
      (function () {
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
      })();
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _utilities = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Apply different optimization techniques
 *
 * @param  {string}                          selector - [description]
 * @param  {HTMLElement|Array.<HTMLElement>} element  - [description]
 * @param  {Object}                          options  - [description]
 * @return {string}                                   - [description]
 */
/**
 * # Optimize
 *
 * 1.) Improve efficiency through shorter selectors by removing redundancy
 * 2.) Improve robustness through selector transformation
 */

function optimize(selector, elements) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


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

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  if (path.length < 2) {
    return optimizePart('', selector, '', elements);
  }

  var shortened = [path.pop()];
  while (path.length > 1) {
    var current = path.pop();
    var prePart = path.join(' ');
    var postPart = shortened.join(' ');

    var pattern = prePart + ' ' + postPart;
    var matches = document.querySelectorAll(pattern);
    if (matches.length !== elements.length) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements));
    }
  }
  shortened.unshift(path[0]);
  path = shortened;

  // optimize start + end
  path[0] = optimizePart('', path[0], path.slice(1).join(' '), elements);
  path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', elements);

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
 * @return {string}                       - [description]
 */
function optimizePart(prePart, current, postPart, elements) {
  if (prePart.length) prePart = prePart + ' ';
  if (postPart.length) postPart = ' ' + postPart;

  // robustness: attribute without value (generalization)
  if (/\[*\]/.test(current)) {
    var key = current.replace(/=.*$/, ']');
    var pattern = '' + prePart + key + postPart;
    var matches = document.querySelectorAll(pattern);
    if (compareResults(matches, elements)) {
      current = key;
    } else {
      // robustness: replace specific key-value with base tag (heuristic)
      var references = document.querySelectorAll('' + prePart + key);

      var _loop = function _loop() {
        var reference = references[i];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          var description = reference.tagName.toLowerCase();
          pattern = '' + prePart + description + postPart;
          matches = document.querySelectorAll(pattern);

          if (compareResults(matches, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i = 0, l = references.length; i < l; i++) {
        var pattern;
        var matches;

        var _ret = _loop();

        if (_ret === 'break') break;
      }
    }
  }

  // robustness: descendant instead child (heuristic)
  if (/>/.test(current)) {
    var descendant = current.replace(/>/, '');
    var pattern = '' + prePart + descendant + postPart;
    var matches = document.querySelectorAll(pattern);
    if (compareResults(matches, elements)) {
      current = descendant;
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    var type = current.replace(/nth-child/g, 'nth-of-type');
    var pattern = '' + prePart + type + postPart;
    var matches = document.querySelectorAll(pattern);
    if (compareResults(matches, elements)) {
      current = type;
    }
  }

  // efficiency: combinations of classname (partial permutations)
  if (/[^\s\\]\.\S*[^\s\\]\.\S+/.test(current)) {
    var names = current.trim().replace(/([^\\])\./g, '$1..') // escape actual dots
    .split('..').slice(1).map(function (name) {
      return '.' + name;
    }).sort(function (curr, next) {
      return curr.length - next.length;
    });
    while (names.length) {
      var partial = current.replace(names.shift(), '').trim();
      var pattern = ('' + prePart + partial + postPart).trim();
      if (!pattern.length || pattern.charAt(0) === '>' || pattern.charAt(pattern.length - 1) === '>') {
        break;
      }
      var matches = document.querySelectorAll(pattern);
      if (compareResults(matches, elements)) {
        current = partial;
      }
    }

    // robustness: degrade complex classname (heuristic)
    names = current && current.match(/\./g);
    if (names && names.length > 2) {
      var _references = document.querySelectorAll('' + prePart + current);

      var _loop2 = function _loop2() {
        var reference = _references[i];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          // TODO:
          // - check using attributes + regard excludes
          var description = reference.tagName.toLowerCase();
          pattern = '' + prePart + description + postPart;
          matches = document.querySelectorAll(pattern);

          if (compareResults(matches, elements)) {
            current = description;
          }
          return 'break';
        }
      };

      for (var i = 0, l = _references.length; i < l; i++) {
        var pattern;
        var matches;

        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

    (function () {
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

        // attribute: '[key="value"]'
        case /^\[/.test(type):
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
              var _ret2 = function () {
                var NodeList = [];
                traverseDescendants([node], function (descendant) {
                  if (validate(descendant)) {
                    NodeList.push(descendant);
                  }
                });
                return {
                  v: NodeList
                };
              }();

              if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;

        // id: '#'
        case /^#/.test(type):
          var id = type.substr(1);
          validate = function validate(node) {
            return node.attribs.id === id;
          };
          instruction = function checkId(node, root) {
            if (discover) {
              var _ret3 = function () {
                var NodeList = [];
                traverseDescendants([node], function (descendant, done) {
                  if (validate(descendant)) {
                    NodeList.push(descendant);
                    done();
                  }
                });
                return {
                  v: NodeList
                };
              }();

              if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;

        // universal: '*'
        case /\*/.test(type):
          validate = function validate(node) {
            return true;
          };
          instruction = function checkUniversal(node, root) {
            if (discover) {
              var _ret4 = function () {
                var NodeList = [];
                traverseDescendants([node], function (descendant) {
                  return NodeList.push(descendant);
                });
                return {
                  v: NodeList
                };
              }();

              if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
          break;

        // tag: '...'
        default:
          validate = function validate(node) {
            return node.name === type;
          };
          instruction = function checkTag(node, root) {
            if (discover) {
              var _ret5 = function () {
                var NodeList = [];
                traverseDescendants([node], function (descendant) {
                  if (validate(descendant)) {
                    NodeList.push(descendant);
                  }
                });
                return {
                  v: NodeList
                };
              }();

              if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
            }
            return typeof node === 'function' ? node(validate) : getAncestor(node, root, validate);
          };
      }
    })();

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

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _match = __webpack_require__(5);

var _match2 = _interopRequireDefault(_match);

var _optimize = __webpack_require__(2);

var _optimize2 = _interopRequireDefault(_optimize);

var _utilities = __webpack_require__(0);

var _common = __webpack_require__(1);

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

  var ancestor = (0, _common.getCommonAncestor)(elements, options);
  var ancestorSelector = getSingleSelector(ancestor, options);

  // TODO: consider usage of multiple selectors + parent-child relation + check for part redundancy
  var commonSelectors = getCommonSelectors(elements);
  var descendantSelector = commonSelectors[0];

  var selector = (0, _optimize2.default)(ancestorSelector + ' ' + descendantSelector, elements, options);
  var selectorMatches = (0, _utilities.convertNodeList)(document.querySelectorAll(selector));

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
  return getSingleSelector(input, options);
}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = match;

var _utilities = __webpack_require__(0);

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
/**
 * # Match
 *
 * Retrieve selector for a node.
 */

function match(node, options) {
  var _options$root = options.root,
      root = _options$root === undefined ? document : _options$root,
      _options$skip = options.skip,
      skip = _options$skip === undefined ? null : _options$skip,
      _options$priority = options.priority,
      priority = _options$priority === undefined ? ['id', 'class', 'href', 'src'] : _options$priority,
      _options$ignore = options.ignore,
      ignore = _options$ignore === undefined ? {} : _options$ignore;


  var path = [];
  var element = node;
  var length = path.length;

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

  while (element !== root) {
    if (skipChecks(element) !== true) {
      // ~ global
      if (checkAttributes(priority, element, ignore, path, root)) break;
      if (checkTag(element, ignore, path, root)) break;

      // ~ local
      checkAttributes(priority, element, ignore, path);
      if (path.length === length) {
        checkTag(element, ignore, path);
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
    var pattern = findPattern(priority, element, ignore);
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
function checkAttributes(priority, element, ignore, path) {
  var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : element.parentNode;

  var pattern = findAttributesPattern(priority, element, ignore);
  if (pattern) {
    var matches = parent.querySelectorAll(pattern);
    if (matches.length === 1) {
      path.unshift(pattern);
      return true;
    }
  }
  return false;
}

/**
 * Lookup attribute identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @return {string?}                 - [description]
 */
function findAttributesPattern(priority, element, ignore) {
  var attributes = element.attributes;
  var sortedKeys = Object.keys(attributes).sort(function (curr, next) {
    var currPos = priority.indexOf(attributes[curr].name);
    var nextPos = priority.indexOf(attributes[next].name);
    if (nextPos === -1) {
      if (currPos === -1) {
        return 0;
      }
      return -1;
    }
    return currPos - nextPos;
  });

  for (var i = 0, l = sortedKeys.length; i < l; i++) {
    var key = sortedKeys[i];
    var attribute = attributes[key];
    var attributeName = attribute.name;
    var attributeValue = (0, _utilities.escapeValue)(attribute.value);
    var useNamedIgnore = attributeName !== 'class';

    var currentIgnore = useNamedIgnore && ignore[attributeName] || ignore.attribute;
    var currentDefaultIgnore = useNamedIgnore && defaultIgnore[attributeName] || defaultIgnore.attribute;
    if (checkIgnore(currentIgnore, attributeName, attributeValue, currentDefaultIgnore)) {
      continue;
    }

    var pattern = '[' + attributeName + '="' + attributeValue + '"]';

    if (/\b\d/.test(attributeValue) === false) {
      if (attributeName === 'id') {
        pattern = '#' + attributeValue;
      }

      if (attributeName === 'class') {
        (function () {
          var classNames = attributeValue.trim().split(/\s+/g);
          var classIgnore = ignore.class || defaultIgnore.class;
          if (classIgnore) {
            classNames = classNames.filter(function (className) {
              return !classIgnore(className);
            });
          }
          pattern = '.' + classNames.join('.');
        })();
      }
    }

    return pattern;
  }
  return null;
}

/**
 * Extend path with tag identifier
 *
 * @param  {HTMLElement}    element - [description]
 * @param  {Object}         ignore  - [description]
 * @param  {Array.<string>} path    - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkTag(element, ignore, path) {
  var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : element.parentNode;

  var pattern = findTagPattern(element, ignore);
  if (pattern) {
    var matches = parent.getElementsByTagName(pattern);
    if (matches.length === 1) {
      path.unshift(pattern);
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
function checkChilds(priority, element, ignore, path) {
  var parent = element.parentNode;
  var children = parent.childTags || parent.children;
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    if (child === element) {
      var childPattern = findPattern(priority, child, ignore);
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
 * Lookup identifier
 *
 * @param  {Array.<string>} priority - [description]
 * @param  {HTMLElement}    element  - [description]
 * @param  {Object}         ignore   - [description]
 * @return {string}                  - [description]
 */
function findPattern(priority, element, ignore) {
  var pattern = findAttributesPattern(priority, element, ignore);
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.common = exports.optimize = exports.getMultiSelector = exports.getSingleSelector = exports.select = undefined;

var _select2 = __webpack_require__(4);

Object.defineProperty(exports, 'getSingleSelector', {
  enumerable: true,
  get: function get() {
    return _select2.getSingleSelector;
  }
});
Object.defineProperty(exports, 'getMultiSelector', {
  enumerable: true,
  get: function get() {
    return _select2.getMultiSelector;
  }
});

var _select3 = _interopRequireDefault(_select2);

var _optimize2 = __webpack_require__(2);

var _optimize3 = _interopRequireDefault(_optimize2);

var _common2 = __webpack_require__(1);

var _common = _interopRequireWildcard(_common2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.select = _select3.default;
exports.optimize = _optimize3.default;
exports.common = _common;
exports.default = _select3.default;

/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmODYzNjIzZGEwYmIwMjQyZTNjOSIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0IiwiZXNjYXBlVmFsdWUiLCJub2RlcyIsImxlbmd0aCIsImFyciIsIkFycmF5IiwiaSIsInZhbHVlIiwicmVwbGFjZSIsImdldENvbW1vbkFuY2VzdG9yIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImVsZW1lbnRzIiwib3B0aW9ucyIsInJvb3QiLCJkb2N1bWVudCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwicGFyZW50IiwibWlzc2luZyIsInNvbWUiLCJvdGhlclBhcmVudHMiLCJvdGhlclBhcmVudCIsImwiLCJjb21tb25Qcm9wZXJ0aWVzIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJ0YWciLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwibmFtZSIsImVsZW1lbnRBdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImtleSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIm9wdGltaXplIiwic2VsZWN0b3IiLCJpc0FycmF5Iiwibm9kZVR5cGUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwicGF0aCIsIm9wdGltaXplUGFydCIsInNob3J0ZW5lZCIsInBvcCIsImN1cnJlbnQiLCJwcmVQYXJ0Iiwiam9pbiIsInBvc3RQYXJ0IiwicGF0dGVybiIsIm1hdGNoZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwic2xpY2UiLCJ0ZXN0IiwiY29tcGFyZVJlc3VsdHMiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiY29udGFpbnMiLCJkZXNjcmlwdGlvbiIsImRlc2NlbmRhbnQiLCJ0eXBlIiwibmFtZXMiLCJtYXAiLCJwYXJ0aWFsIiwiY2hhckF0IiwibWF0Y2giLCJldmVyeSIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImNoaWxkcmVuIiwibm9kZSIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImNoaWxkVGFncyIsInB1c2giLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsImNsYXNzIiwiaW5kZXhPZiIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJwc2V1ZG8iLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJjaGVja1RhZyIsInJ1bGUiLCJraW5kIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVBzZXVkbyIsImNvbXBhcmVTZXQiLCJub2RlSW5kZXgiLCJmaW5kSW5kZXgiLCJjaGlsZCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsIm9wdGltaXplZCIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJjb25zb2xlIiwid2FybiIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJkZWZhdWx0SWdub3JlIiwic2tpcCIsInByaW9yaXR5IiwiaWdub3JlIiwic2tpcENvbXBhcmUiLCJza2lwQ2hlY2tzIiwiY29tcGFyZSIsInByZWRpY2F0ZSIsInRvU3RyaW5nIiwiUmVnRXhwIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tDaGlsZHMiLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsInNvcnRlZEtleXMiLCJjdXJyUG9zIiwibmV4dFBvcyIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkUGF0dGVybiIsImRlZmF1bHRQcmVkaWNhdGUiLCJjaGVjayIsInNlbGVjdCIsImNvbW1vbiIsImRlZmF1bHQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztRQ3BEZ0JBLGUsR0FBQUEsZTtRQWlCQUMsVyxHQUFBQSxXO0FBN0JoQjs7Ozs7O0FBTUE7Ozs7OztBQU1PLFNBQVNELGVBQVQsQ0FBMEJFLEtBQTFCLEVBQWlDO0FBQUEsTUFDOUJDLE1BRDhCLEdBQ25CRCxLQURtQixDQUM5QkMsTUFEOEI7O0FBRXRDLE1BQU1DLE1BQU0sSUFBSUMsS0FBSixDQUFVRixNQUFWLENBQVo7QUFDQSxPQUFLLElBQUlHLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsTUFBcEIsRUFBNEJHLEdBQTVCLEVBQWlDO0FBQy9CRixRQUFJRSxDQUFKLElBQVNKLE1BQU1JLENBQU4sQ0FBVDtBQUNEO0FBQ0QsU0FBT0YsR0FBUDtBQUNEOztBQUVEOzs7Ozs7OztBQVFPLFNBQVNILFdBQVQsQ0FBc0JNLEtBQXRCLEVBQTZCO0FBQ2xDLFNBQU9B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QUM1TCxLQUFMLEVBQVk7QUFDVixXQUFPLElBQVA7QUFDRDtBQUNELE1BQU02TCxRQUFRbkIsYUFBYWtCLGdCQUEzQjtBQUNBLE1BQUksQ0FBQ0MsS0FBTCxFQUFZO0FBQ1YsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPQSxNQUFNckosSUFBTixFQUFZeEMsS0FBWixFQUFtQjRMLGdCQUFuQixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQ25SZ0J6QyxpQjs7Ozs7O29CQUFtQkMsZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUE3QjBDLE07UUFDQXpJLFE7UUFDSzBJLE07UUFFTEMsTyIsImZpbGUiOiJvcHRpbWFsLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmODYzNjIzZGEwYmIwMjQyZTNjOSIsIi8qKlxuICogIyBVdGlsaXRpZXNcbiAqXG4gKiBDb252ZW5pZW5jZSBoZWxwZXJzLlxuICovXG5cbi8qKlxuICogQ3JlYXRlIGFuIGFycmF5IHdpdGggdGhlIERPTSBub2RlcyBvZiB0aGUgbGlzdFxuICpcbiAqIEBwYXJhbSAge05vZGVMaXN0fSAgICAgICAgICAgICBub2RlcyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxIVE1MRWxlbWVudD59ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnROb2RlTGlzdCAobm9kZXMpIHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG5vZGVzXG4gIGNvbnN0IGFyciA9IG5ldyBBcnJheShsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJbaV0gPSBub2Rlc1tpXVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuLyoqXG4gKiBFc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBsaW5lIGJyZWFrcyBhcyBhIHNpbXBsaWZpZWQgdmVyc2lvbiBvZiAnQ1NTLmVzY2FwZSgpJ1xuICpcbiAqIERlc2NyaXB0aW9uIG9mIHZhbGlkIGNoYXJhY3RlcnM6IGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9jc3MtZXNjYXBlc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZz99IHZhbHVlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVWYWx1ZSAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1snXCJgXFxcXC86XFw/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcQScpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIENvbW1vblxuICpcbiAqIFByb2Nlc3MgY29sbGVjdGlvbnMgZm9yIHNpbWlsYXJpdGllcy5cbiAqL1xuXG4vKipcbiAqIEZpbmQgdGhlIGxhc3QgY29tbW9uIGFuY2VzdG9yIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50cz59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uQW5jZXN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgYW5jZXN0b3JzID0gW11cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHBhcmVudHMgPSBbXVxuICAgIHdoaWxlIChlbGVtZW50ICE9PSByb290KSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBwYXJlbnRzLnVuc2hpZnQoZWxlbWVudClcbiAgICB9XG4gICAgYW5jZXN0b3JzW2luZGV4XSA9IHBhcmVudHNcbiAgfSlcblxuICBhbmNlc3RvcnMuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcblxuICBjb25zdCBzaGFsbG93QW5jZXN0b3IgPSBhbmNlc3RvcnMuc2hpZnQoKVxuXG4gIHZhciBhbmNlc3RvciA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNoYWxsb3dBbmNlc3Rvci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBwYXJlbnQgPSBzaGFsbG93QW5jZXN0b3JbaV1cbiAgICBjb25zdCBtaXNzaW5nID0gYW5jZXN0b3JzLnNvbWUoKG90aGVyUGFyZW50cykgPT4ge1xuICAgICAgcmV0dXJuICFvdGhlclBhcmVudHMuc29tZSgob3RoZXJQYXJlbnQpID0+IG90aGVyUGFyZW50ID09PSBwYXJlbnQpXG4gICAgfSlcblxuICAgIGlmIChtaXNzaW5nKSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIHNpbWlsYXIgc3ViLXBhcmVudHMsIG5vdCB0aGUgdG9wIHJvb3QsIGUuZy4gc2hhcmluZyBhIGNsYXNzIHNlbGVjdG9yXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGFuY2VzdG9yID0gcGFyZW50XG4gIH1cblxuICByZXR1cm4gYW5jZXN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgYSBzZXQgb2YgY29tbW9uIHByb3BlcnRpZXMgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uUHJvcGVydGllcyAoZWxlbWVudHMpIHtcblxuICBjb25zdCBjb21tb25Qcm9wZXJ0aWVzID0ge1xuICAgIGNsYXNzZXM6IFtdLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIHRhZzogbnVsbFxuICB9XG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgdmFyIHtcbiAgICAgIGNsYXNzZXM6IGNvbW1vbkNsYXNzZXMsXG4gICAgICBhdHRyaWJ1dGVzOiBjb21tb25BdHRyaWJ1dGVzLFxuICAgICAgdGFnOiBjb21tb25UYWdcbiAgICB9ID0gY29tbW9uUHJvcGVydGllc1xuXG4gICAgLy8gfiBjbGFzc2VzXG4gICAgaWYgKGNvbW1vbkNsYXNzZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICAgICAgaWYgKCFjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25DbGFzc2VzID0gY29tbW9uQ2xhc3Nlcy5maWx0ZXIoKGVudHJ5KSA9PiBjbGFzc2VzLnNvbWUoKG5hbWUpID0+IG5hbWUgPT09IGVudHJ5KSlcbiAgICAgICAgICBpZiAoY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNvbW1vbkNsYXNzZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogcmVzdHJ1Y3R1cmUgcmVtb3ZhbCBhcyAyeCBzZXQgLyAyeCBkZWxldGUsIGluc3RlYWQgb2YgbW9kaWZ5IGFsd2F5cyByZXBsYWNpbmcgd2l0aCBuZXcgY29sbGVjdGlvblxuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiBhdHRyaWJ1dGVzXG4gICAgaWYgKGNvbW1vbkF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZWxlbWVudEF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3Qua2V5cyhlbGVtZW50QXR0cmlidXRlcykucmVkdWNlKChhdHRyaWJ1dGVzLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gZWxlbWVudEF0dHJpYnV0ZXNba2V5XVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICAgICAgLy8gTk9URTogd29ya2Fyb3VuZCBkZXRlY3Rpb24gZm9yIG5vbi1zdGFuZGFyZCBwaGFudG9tanMgTmFtZWROb2RlTWFwIGJlaGF2aW91clxuICAgICAgICAvLyAoaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcml5YS9waGFudG9tanMvaXNzdWVzLzE0NjM0KVxuICAgICAgICBpZiAoYXR0cmlidXRlICYmIGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlLnZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgIH0sIHt9KVxuXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKVxuICAgICAgY29uc3QgY29tbW9uQXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcylcblxuICAgICAgaWYgKGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFjb21tb25BdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChuZXh0Q29tbW9uQXR0cmlidXRlcywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb21tb25BdHRyaWJ1dGVzW25hbWVdXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGF0dHJpYnV0ZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgbmV4dENvbW1vbkF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHRDb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSwge30pXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiB0YWdcbiAgICBpZiAoY29tbW9uVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAoIWNvbW1vblRhZykge1xuICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLnRhZyA9IHRhZ1xuICAgICAgfSBlbHNlIGlmICh0YWcgIT09IGNvbW1vblRhZykge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy50YWdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGNvbW1vblByb3BlcnRpZXNcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24uanMiLCIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3B0aW1pemUgKHNlbGVjdG9yLCBlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgLy8gY29udmVydCBzaW5nbGUgZW50cnkgYW5kIE5vZGVMaXN0XG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9ICFlbGVtZW50cy5sZW5ndGggPyBbZWxlbWVudHNdIDogY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50cy5sZW5ndGggfHwgZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSB0byBjb21wYXJlIEhUTUxFbGVtZW50cyBpdHMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSByZWZlcmVuY2Ugb2YgdGhlIHNlbGVjdGVkIG5vZGUocykhIChtaXNzaW5nIFwiZWxlbWVudHNcIilgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcblxuICAvLyBjaHVuayBwYXJ0cyBvdXRzaWRlIG9mIHF1b3RlcyAoaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU2NjM3MjkpXG4gIHZhciBwYXRoID0gc2VsZWN0b3IucmVwbGFjZSgvPiAvZywgJz4nKS5zcGxpdCgvXFxzKyg/PSg/Oig/OlteXCJdKlwiKXsyfSkqW15cIl0qJCkvKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gb3B0aW1pemVQYXJ0KCcnLCBzZWxlY3RvciwgJycsIGVsZW1lbnRzKVxuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpICB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBwcmVQYXJ0ID0gcGF0aC5qb2luKCcgJylcbiAgICBjb25zdCBwb3N0UGFydCA9IHNob3J0ZW5lZC5qb2luKCcgJylcblxuICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSAke3Bvc3RQYXJ0fWBcbiAgICBjb25zdCBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBzaG9ydGVuZWQudW5zaGlmdChvcHRpbWl6ZVBhcnQocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzKSlcbiAgICB9XG4gIH1cbiAgc2hvcnRlbmVkLnVuc2hpZnQocGF0aFswXSlcbiAgcGF0aCA9IHNob3J0ZW5lZFxuXG4gIC8vIG9wdGltaXplIHN0YXJ0ICsgZW5kXG4gIHBhdGhbMF0gPSBvcHRpbWl6ZVBhcnQoJycsIHBhdGhbMF0sIHBhdGguc2xpY2UoMSkuam9pbignICcpLCBlbGVtZW50cylcbiAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50cylcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJykucmVwbGFjZSgvPi9nLCAnPiAnKS50cmltKClcbn1cblxuLyoqXG4gKiBJbXByb3ZlIGEgY2h1bmsgb2YgdGhlIHNlbGVjdG9yXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVQYXJ0IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMpIHtcbiAgaWYgKHByZVBhcnQubGVuZ3RoKSBwcmVQYXJ0ID0gYCR7cHJlUGFydH0gYFxuICBpZiAocG9zdFBhcnQubGVuZ3RoKSBwb3N0UGFydCA9IGAgJHtwb3N0UGFydH1gXG5cbiAgLy8gcm9idXN0bmVzczogYXR0cmlidXRlIHdpdGhvdXQgdmFsdWUgKGdlbmVyYWxpemF0aW9uKVxuICBpZiAoL1xcWypcXF0vLnRlc3QoY3VycmVudCkpIHtcbiAgICBjb25zdCBrZXkgPSBjdXJyZW50LnJlcGxhY2UoLz0uKiQvLCAnXScpXG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7a2V5fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBrZXlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcm9idXN0bmVzczogcmVwbGFjZSBzcGVjaWZpYyBrZXktdmFsdWUgd2l0aCBiYXNlIHRhZyAoaGV1cmlzdGljKVxuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cHJlUGFydH0ke2tleX1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKC8+Ly50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IGN1cnJlbnQucmVwbGFjZSgvPi8sICcnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NlbmRhbnR9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IGRlc2NlbmRhbnRcbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiAnbnRoLW9mLXR5cGUnIGluc3RlYWQgJ250aC1jaGlsZCcgKGhldXJpc3RpYylcbiAgaWYgKC86bnRoLWNoaWxkLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgY29tcGxldGUgY292ZXJhZ2Ugb2YgJ250aC1vZi10eXBlJyByZXBsYWNlbWVudFxuICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50LnJlcGxhY2UoL250aC1jaGlsZC9nLCAnbnRoLW9mLXR5cGUnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3R5cGV9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IHR5cGVcbiAgICB9XG4gIH1cblxuICAvLyBlZmZpY2llbmN5OiBjb21iaW5hdGlvbnMgb2YgY2xhc3NuYW1lIChwYXJ0aWFsIHBlcm11dGF0aW9ucylcbiAgaWYgKC9bXlxcc1xcXFxdXFwuXFxTKlteXFxzXFxcXF1cXC5cXFMrLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgdmFyIG5hbWVzID0gY3VycmVudC50cmltKClcbiAgICAgIC5yZXBsYWNlKC8oW15cXFxcXSlcXC4vZywgJyQxLi4nKSAvLyBlc2NhcGUgYWN0dWFsIGRvdHNcbiAgICAgIC5zcGxpdCgnLi4nKVxuICAgICAgLnNsaWNlKDEpXG4gICAgICAubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKVxuICAgICAgLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG4gICAgd2hpbGUgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFydGlhbCA9IGN1cnJlbnQucmVwbGFjZShuYW1lcy5zaGlmdCgpLCAnJykudHJpbSgpXG4gICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YC50cmltKClcbiAgICAgIGlmICghcGF0dGVybi5sZW5ndGggfHwgcGF0dGVybi5jaGFyQXQoMCkgPT09ICc+JyB8fCBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aC0xKSA9PT0gJz4nKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcnRpYWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgbmFtZXMgPSBjdXJyZW50ICYmIGN1cnJlbnQubWF0Y2goL1xcLi9nKVxuICAgIGlmIChuYW1lcyAmJiBuYW1lcy5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwcmVQYXJ0fSR7Y3VycmVudH1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkgKSkge1xuICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgLy8gLSBjaGVjayB1c2luZyBhdHRyaWJ1dGVzICsgcmVnYXJkIGV4Y2x1ZGVzXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIEV2YWx1YXRlIG1hdGNoZXMgd2l0aCBleHBlY3RlZCBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IG1hdGNoZXMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZVJlc3VsdHMgKG1hdGNoZXMsIGVsZW1lbnRzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBtYXRjaGVzXG4gIHJldHVybiBsZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaGVzW2ldID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29wdGltaXplLmpzIiwiLyoqXG4gKiAjIEFkYXB0XG4gKlxuICogQ2hlY2sgYW5kIGV4dGVuZCB0aGUgZW52aXJvbm1lbnQgZm9yIHVuaXZlcnNhbCB1c2FnZS5cbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRUxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG5cbiAgLy8gZGV0ZWN0IGVudmlyb25tZW50IHNldHVwXG4gIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuZG9jdW1lbnQgPSBvcHRpb25zLmNvbnRleHQgfHwgKCgpID0+IHtcbiAgICAgIHZhciByb290ID0gZWxlbWVudFxuICAgICAgd2hpbGUgKHJvb3QucGFyZW50KSB7XG4gICAgICAgIHJvb3QgPSByb290LnBhcmVudFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3RcbiAgICB9KSgpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0w3NVxuICBjb25zdCBFbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbC5kb2N1bWVudClcblxuICAvLyBhbHRlcm5hdGl2ZSBkZXNjcmlwdG9yIHRvIGFjY2VzcyBlbGVtZW50cyB3aXRoIGZpbHRlcmluZyBpbnZhbGlkIGVsZW1lbnRzIChlLmcuIHRleHRub2RlcylcbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWVsZW1lbnR0eXBlL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0wxMlxuICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICd0YWcnIHx8IG5vZGUudHlwZSA9PT0gJ3NjcmlwdCcgfHwgbm9kZS50eXBlID09PSAnc3R5bGUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycpKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0cmlidXRlc1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9OYW1lZE5vZGVNYXBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJzIH0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnMpXG4gICAgICAgIGNvbnN0IE5hbWVkTm9kZU1hcCA9IGF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgYXR0cmlidXRlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnNbYXR0cmlidXRlTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgICAgfSwgeyB9KVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmFtZWROb2RlTWFwLCAnbGVuZ3RoJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIE5hbWVkTm9kZU1hcFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnNbbmFtZV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyh0aGlzLmNoaWxkVGFncywgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQubmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSAnKicpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lcyA9IGNsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNwbGl0KCcgJylcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50Q2xhc3NOYW1lID0gZGVzY2VuZGFudC5hdHRyaWJzLmNsYXNzXG4gICAgICAgIGlmIChkZXNjZW5kYW50Q2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBkZXNjZW5kYW50Q2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSkpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9jc3Mvc2VsZWN0b3JzX2FwaS9xdWVyeVNlbGVjdG9yQWxsXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvcXVlcnlTZWxlY3RvckFsbFxuICAgIEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIChzZWxlY3RvcnMpIHtcbiAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9ycy5yZXBsYWNlKC8oPikoXFxTKS9nLCAnJDEgJDInKS50cmltKCkgLy8gYWRkIHNwYWNlIGZvciAnPicgc2VsZWN0b3JcblxuICAgICAgLy8gdXNpbmcgcmlnaHQgdG8gbGVmdCBleGVjdXRpb24gPT4gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvY3NzLXNlbGVjdCNob3ctZG9lcy1pdC13b3JrXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBnZXRJbnN0cnVjdGlvbnMoc2VsZWN0b3JzKVxuICAgICAgY29uc3QgZGlzY292ZXIgPSBpbnN0cnVjdGlvbnMuc2hpZnQoKVxuXG4gICAgICBjb25zdCB0b3RhbCA9IGluc3RydWN0aW9ucy5sZW5ndGhcbiAgICAgIHJldHVybiBkaXNjb3Zlcih0aGlzKS5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIHN0ZXAgPSAwXG4gICAgICAgIHdoaWxlIChzdGVwIDwgdG90YWwpIHtcbiAgICAgICAgICBub2RlID0gaW5zdHJ1Y3Rpb25zW3N0ZXBdKG5vZGUsIHRoaXMpXG4gICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGhpZXJhcmNoeSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RlcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY29udGFpbnNcbiAgICBFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHZhciBpbmNsdXNpdmUgPSBmYWxzZVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgaW5jbHVzaXZlID0gdHJ1ZVxuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGluY2x1c2l2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogUmV0cmlldmUgdHJhbnNmb3JtYXRpb24gc3RlcHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gICBzZWxlY3RvcnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48RnVuY3Rpb24+fSAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEluc3RydWN0aW9ucyAoc2VsZWN0b3JzKSB7XG4gIHJldHVybiBzZWxlY3RvcnMuc3BsaXQoJyAnKS5yZXZlcnNlKCkubWFwKChzZWxlY3Rvciwgc3RlcCkgPT4ge1xuICAgIGNvbnN0IGRpc2NvdmVyID0gc3RlcCA9PT0gMFxuICAgIGNvbnN0IFt0eXBlLCBwc2V1ZG9dID0gc2VsZWN0b3Iuc3BsaXQoJzonKVxuXG4gICAgdmFyIHZhbGlkYXRlID0gbnVsbFxuICAgIHZhciBpbnN0cnVjdGlvbiA9IG51bGxcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAvLyBjaGlsZDogJz4nXG4gICAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrUGFyZW50IChub2RlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWxpZGF0ZSkgPT4gdmFsaWRhdGUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0eXBlLnN1YnN0cigxKS5zcGxpdCgnLicpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlQ2xhc3NOYW1lID0gbm9kZS5hdHRyaWJzLmNsYXNzXG4gICAgICAgICAgcmV0dXJuIG5vZGVDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IG5vZGVDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tDbGFzcyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcy5qb2luKCcgJykpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBhdHRyaWJ1dGU6ICdba2V5PVwidmFsdWVcIl0nXG4gICAgICBjYXNlIC9eXFxbLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gPSB0eXBlLnJlcGxhY2UoL1xcW3xcXF18XCIvZywgJycpLnNwbGl0KCc9JylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgICBpZiAoaGFzQXR0cmlidXRlKSB7IC8vIHJlZ2FyZCBvcHRpb25hbCBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSB8fCAobm9kZS5hdHRyaWJzW2F0dHJpYnV0ZUtleV0gPT09IGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBpZDogJyMnXG4gICAgICBjYXNlIC9eIy8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHRydWVcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1VuaXZlcnNhbCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpKVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyB0YWc6ICcuLi4nXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gdHlwZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tUYWcgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFdhbGtpbmcgcmVjdXJzaXZlIHRvIGludm9rZSBjYWxsYmFja3NcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxIVE1MRWxlbWVudD59IG5vZGVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgIGhhbmRsZXIgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQnViYmxlIHVwIGZyb20gYm90dG9tIHRvIHRvcFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSByb290ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICB2YWxpZGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFTGVtZW50fSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRhcHQuanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRDb21tb25BbmNlc3RvciwgZ2V0Q29tbW9uUHJvcGVydGllcyB9IGZyb20gJy4vY29tbW9uJ1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZH1cbiAgLy8gYClcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gb3B0aW1pemVkXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSBvbmx5IGFuIEFycmF5IG9mIEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBpcyBzdXBwb3J0ZWQhYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG5cbiAgY29uc3QgYW5jZXN0b3IgPSBnZXRDb21tb25BbmNlc3RvcihlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3QgYW5jZXN0b3JTZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGFuY2VzdG9yLCBvcHRpb25zKVxuXG4gIC8vIFRPRE86IGNvbnNpZGVyIHVzYWdlIG9mIG11bHRpcGxlIHNlbGVjdG9ycyArIHBhcmVudC1jaGlsZCByZWxhdGlvbiArIGNoZWNrIGZvciBwYXJ0IHJlZHVuZGFuY3lcbiAgY29uc3QgY29tbW9uU2VsZWN0b3JzID0gZ2V0Q29tbW9uU2VsZWN0b3JzKGVsZW1lbnRzKVxuICBjb25zdCBkZXNjZW5kYW50U2VsZWN0b3IgPSBjb21tb25TZWxlY3RvcnNbMF1cblxuICBjb25zdCBzZWxlY3RvciA9IG9wdGltaXplKGAke2FuY2VzdG9yU2VsZWN0b3J9ICR7ZGVzY2VuZGFudFNlbGVjdG9yfWAsIGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3Rvck1hdGNoZXMgPSBjb252ZXJ0Tm9kZUxpc3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhblxcJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLlxuICAgICAgSXRzIHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCFcbiAgICBgLCBlbGVtZW50cylcbiAgfVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclxufVxuXG4vKipcbiAqIEdldCBzZWxlY3RvcnMgdG8gZGVzY3JpYmUgYSBzZXQgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENvbW1vblNlbGVjdG9ycyAoZWxlbWVudHMpIHtcblxuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBbXVxuXG4gIGlmICh0YWcpIHtcbiAgICBzZWxlY3RvclBhdGgucHVzaCh0YWcpXG4gIH1cblxuICBpZiAoY2xhc3Nlcykge1xuICAgIGNvbnN0IGNsYXNzU2VsZWN0b3IgPSBjbGFzc2VzLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YCkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChjbGFzc1NlbGVjdG9yKVxuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVTZWxlY3RvciA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgocGFydHMsIG5hbWUpID0+IHtcbiAgICAgIHBhcnRzLnB1c2goYFske25hbWV9PVwiJHthdHRyaWJ1dGVzW25hbWVdfVwiXWApXG4gICAgICByZXR1cm4gcGFydHNcbiAgICB9LCBbXSkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChhdHRyaWJ1dGVTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChzZWxlY3RvclBhdGgubGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogY2hlY2sgZm9yIHBhcmVudC1jaGlsZCByZWxhdGlvblxuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBzZWxlY3RvclBhdGguam9pbignJylcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCAmJiAhaW5wdXQubmFtZSkge1xuICAgIHJldHVybiBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICB9XG4gIHJldHVybiBnZXRTaW5nbGVTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3QuanMiLCIvKipcbiAqICMgTWF0Y2hcbiAqXG4gKiBSZXRyaWV2ZSBzZWxlY3RvciBmb3IgYSBub2RlLlxuICovXG5cbmltcG9ydCB7IGVzY2FwZVZhbHVlIH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbmNvbnN0IGRlZmF1bHRJZ25vcmUgPSB7XG4gIGF0dHJpYnV0ZSAoYXR0cmlidXRlTmFtZSkge1xuICAgIHJldHVybiBbXG4gICAgICAnc3R5bGUnLFxuICAgICAgJ2RhdGEtcmVhY3RpZCcsXG4gICAgICAnZGF0YS1yZWFjdC1jaGVja3N1bSdcbiAgICBdLmluZGV4T2YoYXR0cmlidXRlTmFtZSkgPiAtMVxuICB9XG59XG5cbi8qKlxuICogR2V0IHRoZSBwYXRoIG9mIHRoZSBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IG5vZGUgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXRjaCAobm9kZSwgb3B0aW9ucykge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnQsXG4gICAgc2tpcCA9IG51bGwsXG4gICAgcHJpb3JpdHkgPSBbJ2lkJywgJ2NsYXNzJywgJ2hyZWYnLCAnc3JjJ10sXG4gICAgaWdub3JlID0ge31cbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBwYXRoID0gW11cbiAgdmFyIGVsZW1lbnQgPSBub2RlXG4gIHZhciBsZW5ndGggPSBwYXRoLmxlbmd0aFxuXG4gIGNvbnN0IHNraXBDb21wYXJlID0gc2tpcCAmJiAoQXJyYXkuaXNBcnJheShza2lwKSA/IHNraXAgOiBbc2tpcF0pLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gKGVsZW1lbnQpID0+IGVsZW1lbnQgPT09IGVudHJ5XG4gICAgfVxuICAgIHJldHVybiBlbnRyeVxuICB9KVxuXG4gIGNvbnN0IHNraXBDaGVja3MgPSAoZWxlbWVudCkgPT4ge1xuICAgIHJldHVybiBza2lwICYmIHNraXBDb21wYXJlLnNvbWUoKGNvbXBhcmUpID0+IGNvbXBhcmUoZWxlbWVudCkpXG4gIH1cblxuICBPYmplY3Qua2V5cyhpZ25vcmUpLmZvckVhY2goKHR5cGUpID0+IHtcbiAgICB2YXIgcHJlZGljYXRlID0gaWdub3JlW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpIHJldHVyblxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcmVkaWNhdGUgPSBuZXcgUmVnRXhwKGVzY2FwZVZhbHVlKHByZWRpY2F0ZSkucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSlcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlID8gLyg/OikvIDogLy5eL1xuICAgIH1cbiAgICAvLyBjaGVjayBjbGFzcy0vYXR0cmlidXRlbmFtZSBmb3IgcmVnZXhcbiAgICBpZ25vcmVbdHlwZV0gPSAobmFtZSwgdmFsdWUpID0+IHByZWRpY2F0ZS50ZXN0KHZhbHVlKVxuICB9KVxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSByb290KSB7XG4gICAgaWYgKHNraXBDaGVja3MoZWxlbWVudCkgIT09IHRydWUpIHtcbiAgICAgIC8vIH4gZ2xvYmFsXG4gICAgICBpZiAoY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHJvb3QpKSBicmVha1xuICAgICAgaWYgKGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcm9vdCkpIGJyZWFrXG5cbiAgICAgIC8vIH4gbG9jYWxcbiAgICAgIGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgfVxuXG4gICAgICAvLyBkZWZpbmUgb25seSBvbmUgcGFydCBlYWNoIGl0ZXJhdGlvblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tDaGlsZHMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbGVtZW50ID09PSByb290KSB7XG4gICAgY29uc3QgcGF0dGVybiA9IGZpbmRQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJylcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgY29uc3Qgc29ydGVkS2V5cyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvcnQoKGN1cnIsIG5leHQpID0+IHtcbiAgICBjb25zdCBjdXJyUG9zID0gcHJpb3JpdHkuaW5kZXhPZihhdHRyaWJ1dGVzW2N1cnJdLm5hbWUpXG4gICAgY29uc3QgbmV4dFBvcyA9IHByaW9yaXR5LmluZGV4T2YoYXR0cmlidXRlc1tuZXh0XS5uYW1lKVxuICAgIGlmIChuZXh0UG9zID09PSAtMSkge1xuICAgICAgaWYgKGN1cnJQb3MgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAwXG4gICAgICB9XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJQb3MgLSBuZXh0UG9zXG4gIH0pXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzb3J0ZWRLZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHNvcnRlZEtleXNbaV1cbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZS52YWx1ZSlcbiAgICBjb25zdCB1c2VOYW1lZElnbm9yZSA9IGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcydcblxuICAgIGNvbnN0IGN1cnJlbnRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgaWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBpZ25vcmUuYXR0cmlidXRlXG4gICAgY29uc3QgY3VycmVudERlZmF1bHRJZ25vcmUgPSAodXNlTmFtZWRJZ25vcmUgJiYgZGVmYXVsdElnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgZGVmYXVsdElnbm9yZS5hdHRyaWJ1dGVcbiAgICBpZiAoY2hlY2tJZ25vcmUoY3VycmVudElnbm9yZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGN1cnJlbnREZWZhdWx0SWdub3JlKSkge1xuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICB2YXIgcGF0dGVybiA9IGBbJHthdHRyaWJ1dGVOYW1lfT1cIiR7YXR0cmlidXRlVmFsdWV9XCJdYFxuXG4gICAgaWYgKCgvXFxiXFxkLykudGVzdChhdHRyaWJ1dGVWYWx1ZSkgPT09IGZhbHNlKSB7XG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2lkJykge1xuICAgICAgICBwYXR0ZXJuID0gYCMke2F0dHJpYnV0ZVZhbHVlfWBcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgICAgbGV0IGNsYXNzTmFtZXMgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKCkuc3BsaXQoL1xccysvZylcbiAgICAgICAgY29uc3QgY2xhc3NJZ25vcmUgPSBpZ25vcmUuY2xhc3MgfHwgZGVmYXVsdElnbm9yZS5jbGFzc1xuICAgICAgICBpZiAoY2xhc3NJZ25vcmUpIHtcbiAgICAgICAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lcy5maWx0ZXIoY2xhc3NOYW1lID0+ICFjbGFzc0lnbm9yZShjbGFzc05hbWUpKVxuICAgICAgICB9XG4gICAgICAgIHBhdHRlcm4gPSBgLiR7Y2xhc3NOYW1lcy5qb2luKCcuJyl9YFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXR0ZXJuXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRUYWdQYXR0ZXJuIChlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBOT1RFOiAnY2hpbGRUYWdzJyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYXMgYSB2aWV3IGZpbHRlciBmb3IgdGFncyB1c2luZyAnYWRhcHRlci5qcydcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGRzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZFRhZ3MgfHwgcGFyZW50LmNoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZCA9PT0gZWxlbWVudCkge1xuICAgICAgY29uc3QgY2hpbGRQYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGNoaWxkLCBpZ25vcmUpXG4gICAgICBpZiAoIWNoaWxkUGF0dGVybikge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgICAgICBFbGVtZW50IGNvdWxkblxcJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY29uc3QgcGF0dGVybiA9IGA+ICR7Y2hpbGRQYXR0ZXJufTpudGgtY2hpbGQoJHtpKzF9KWBcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKSB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lnbm9yZSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCJleHBvcnQgc2VsZWN0LCB7IGdldFNpbmdsZVNlbGVjdG9yLCBnZXRNdWx0aVNlbGVjdG9yIH0gZnJvbSAnLi9zZWxlY3QnXG5leHBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmV4cG9ydCAqIGFzIGNvbW1vbiBmcm9tICcuL2NvbW1vbidcblxuZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi9zZWxlY3QnXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9