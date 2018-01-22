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
        pattern = '.' + classNames.join('.');
      }();

      if (_ret === 'continue') continue;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA3YWViMjY0OTUyNGFkZjZmNDE0MSIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0IiwiZXNjYXBlVmFsdWUiLCJub2RlcyIsImxlbmd0aCIsImFyciIsIkFycmF5IiwiaSIsInZhbHVlIiwicmVwbGFjZSIsImdldENvbW1vbkFuY2VzdG9yIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImVsZW1lbnRzIiwib3B0aW9ucyIsInJvb3QiLCJkb2N1bWVudCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwicGFyZW50IiwibWlzc2luZyIsInNvbWUiLCJvdGhlclBhcmVudHMiLCJvdGhlclBhcmVudCIsImwiLCJjb21tb25Qcm9wZXJ0aWVzIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJ0YWciLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwibmFtZSIsImVsZW1lbnRBdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImtleSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIm9wdGltaXplIiwic2VsZWN0b3IiLCJpc0FycmF5Iiwibm9kZVR5cGUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwicGF0aCIsIm9wdGltaXplUGFydCIsInNob3J0ZW5lZCIsInBvcCIsImN1cnJlbnQiLCJwcmVQYXJ0Iiwiam9pbiIsInBvc3RQYXJ0IiwicGF0dGVybiIsIm1hdGNoZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwic2xpY2UiLCJ0ZXN0IiwiY29tcGFyZVJlc3VsdHMiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiY29udGFpbnMiLCJkZXNjcmlwdGlvbiIsImRlc2NlbmRhbnQiLCJ0eXBlIiwibmFtZXMiLCJtYXAiLCJwYXJ0aWFsIiwiY2hhckF0IiwibWF0Y2giLCJldmVyeSIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImNoaWxkcmVuIiwibm9kZSIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImNoaWxkVGFncyIsInB1c2giLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsImNsYXNzIiwiaW5kZXhPZiIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJwc2V1ZG8iLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJjaGVja1RhZyIsInJ1bGUiLCJraW5kIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVBzZXVkbyIsImNvbXBhcmVTZXQiLCJub2RlSW5kZXgiLCJmaW5kSW5kZXgiLCJjaGlsZCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsIm9wdGltaXplZCIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJjb25zb2xlIiwid2FybiIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJkZWZhdWx0SWdub3JlIiwic2tpcCIsInByaW9yaXR5IiwiaWdub3JlIiwic2tpcENvbXBhcmUiLCJza2lwQ2hlY2tzIiwiY29tcGFyZSIsInByZWRpY2F0ZSIsInRvU3RyaW5nIiwiUmVnRXhwIiwiY2hlY2tBdHRyaWJ1dGVzIiwiY2hlY2tDaGlsZHMiLCJmaW5kUGF0dGVybiIsImZpbmRBdHRyaWJ1dGVzUGF0dGVybiIsInNvcnRlZEtleXMiLCJjdXJyUG9zIiwibmV4dFBvcyIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkUGF0dGVybiIsImRlZmF1bHRQcmVkaWNhdGUiLCJjaGVjayIsInNlbGVjdCIsImNvbW1vbiIsImRlZmF1bHQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztRQ3BEZ0JBLGUsR0FBQUEsZTtRQWlCQUMsVyxHQUFBQSxXO0FBN0JoQjs7Ozs7O0FBTUE7Ozs7OztBQU1PLFNBQVNELGVBQVQsQ0FBMEJFLEtBQTFCLEVBQWlDO0FBQUEsTUFDOUJDLE1BRDhCLEdBQ25CRCxLQURtQixDQUM5QkMsTUFEOEI7O0FBRXRDLE1BQU1DLE1BQU0sSUFBSUMsS0FBSixDQUFVRixNQUFWLENBQVo7QUFDQSxPQUFLLElBQUlHLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsTUFBcEIsRUFBNEJHLEdBQTVCLEVBQWlDO0FBQy9CRixRQUFJRSxDQUFKLElBQVNKLE1BQU1JLENBQU4sQ0FBVDtBQUNEO0FBQ0QsU0FBT0YsR0FBUDtBQUNEOztBQUVEOzs7Ozs7OztBQVFPLFNBQVNILFdBQVQsQ0FBc0JNLEtBQXRCLEVBQTZCO0FBQ2xDLFNBQU9B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QUFnRTtBQUM5RCxNQUFJLENBQUM1TCxLQUFMLEVBQVk7QUFDVixXQUFPLElBQVA7QUFDRDtBQUNELE1BQU02TCxRQUFRbkIsYUFBYWtCLGdCQUEzQjtBQUNBLE1BQUksQ0FBQ0MsS0FBTCxFQUFZO0FBQ1YsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPQSxNQUFNckosSUFBTixFQUFZeEMsS0FBWixFQUFtQjRMLGdCQUFuQixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQ3BSZ0J6QyxpQjs7Ozs7O29CQUFtQkMsZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQUE3QjBDLE07UUFDQXpJLFE7UUFDSzBJLE07UUFFTEMsTyIsImZpbGUiOiJvcHRpbWFsLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3YWViMjY0OTUyNGFkZjZmNDE0MSIsIi8qKlxuICogIyBVdGlsaXRpZXNcbiAqXG4gKiBDb252ZW5pZW5jZSBoZWxwZXJzLlxuICovXG5cbi8qKlxuICogQ3JlYXRlIGFuIGFycmF5IHdpdGggdGhlIERPTSBub2RlcyBvZiB0aGUgbGlzdFxuICpcbiAqIEBwYXJhbSAge05vZGVMaXN0fSAgICAgICAgICAgICBub2RlcyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxIVE1MRWxlbWVudD59ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnROb2RlTGlzdCAobm9kZXMpIHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG5vZGVzXG4gIGNvbnN0IGFyciA9IG5ldyBBcnJheShsZW5ndGgpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBhcnJbaV0gPSBub2Rlc1tpXVxuICB9XG4gIHJldHVybiBhcnJcbn1cblxuLyoqXG4gKiBFc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGFuZCBsaW5lIGJyZWFrcyBhcyBhIHNpbXBsaWZpZWQgdmVyc2lvbiBvZiAnQ1NTLmVzY2FwZSgpJ1xuICpcbiAqIERlc2NyaXB0aW9uIG9mIHZhbGlkIGNoYXJhY3RlcnM6IGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9jc3MtZXNjYXBlc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZz99IHZhbHVlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVWYWx1ZSAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1snXCJgXFxcXC86XFw/JiEjJCVeKClbXFxde3x9Kis7LC48PT5Afl0vZywgJ1xcXFwkJicpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcQScpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbGl0aWVzLmpzIiwiLyoqXG4gKiAjIENvbW1vblxuICpcbiAqIFByb2Nlc3MgY29sbGVjdGlvbnMgZm9yIHNpbWlsYXJpdGllcy5cbiAqL1xuXG4vKipcbiAqIEZpbmQgdGhlIGxhc3QgY29tbW9uIGFuY2VzdG9yIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50cz59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uQW5jZXN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgYW5jZXN0b3JzID0gW11cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IHBhcmVudHMgPSBbXVxuICAgIHdoaWxlIChlbGVtZW50ICE9PSByb290KSB7XG4gICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgICBwYXJlbnRzLnVuc2hpZnQoZWxlbWVudClcbiAgICB9XG4gICAgYW5jZXN0b3JzW2luZGV4XSA9IHBhcmVudHNcbiAgfSlcblxuICBhbmNlc3RvcnMuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcblxuICBjb25zdCBzaGFsbG93QW5jZXN0b3IgPSBhbmNlc3RvcnMuc2hpZnQoKVxuXG4gIHZhciBhbmNlc3RvciA9IG51bGxcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNoYWxsb3dBbmNlc3Rvci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBwYXJlbnQgPSBzaGFsbG93QW5jZXN0b3JbaV1cbiAgICBjb25zdCBtaXNzaW5nID0gYW5jZXN0b3JzLnNvbWUoKG90aGVyUGFyZW50cykgPT4ge1xuICAgICAgcmV0dXJuICFvdGhlclBhcmVudHMuc29tZSgob3RoZXJQYXJlbnQpID0+IG90aGVyUGFyZW50ID09PSBwYXJlbnQpXG4gICAgfSlcblxuICAgIGlmIChtaXNzaW5nKSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIHNpbWlsYXIgc3ViLXBhcmVudHMsIG5vdCB0aGUgdG9wIHJvb3QsIGUuZy4gc2hhcmluZyBhIGNsYXNzIHNlbGVjdG9yXG4gICAgICBicmVha1xuICAgIH1cblxuICAgIGFuY2VzdG9yID0gcGFyZW50XG4gIH1cblxuICByZXR1cm4gYW5jZXN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgYSBzZXQgb2YgY29tbW9uIHByb3BlcnRpZXMgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbW9uUHJvcGVydGllcyAoZWxlbWVudHMpIHtcblxuICBjb25zdCBjb21tb25Qcm9wZXJ0aWVzID0ge1xuICAgIGNsYXNzZXM6IFtdLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIHRhZzogbnVsbFxuICB9XG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgdmFyIHtcbiAgICAgIGNsYXNzZXM6IGNvbW1vbkNsYXNzZXMsXG4gICAgICBhdHRyaWJ1dGVzOiBjb21tb25BdHRyaWJ1dGVzLFxuICAgICAgdGFnOiBjb21tb25UYWdcbiAgICB9ID0gY29tbW9uUHJvcGVydGllc1xuXG4gICAgLy8gfiBjbGFzc2VzXG4gICAgaWYgKGNvbW1vbkNsYXNzZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKVxuICAgICAgaWYgKGNsYXNzZXMpIHtcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzZXMudHJpbSgpLnNwbGl0KCcgJylcbiAgICAgICAgaWYgKCFjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNsYXNzZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25DbGFzc2VzID0gY29tbW9uQ2xhc3Nlcy5maWx0ZXIoKGVudHJ5KSA9PiBjbGFzc2VzLnNvbWUoKG5hbWUpID0+IG5hbWUgPT09IGVudHJ5KSlcbiAgICAgICAgICBpZiAoY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuY2xhc3NlcyA9IGNvbW1vbkNsYXNzZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogcmVzdHJ1Y3R1cmUgcmVtb3ZhbCBhcyAyeCBzZXQgLyAyeCBkZWxldGUsIGluc3RlYWQgb2YgbW9kaWZ5IGFsd2F5cyByZXBsYWNpbmcgd2l0aCBuZXcgY29sbGVjdGlvblxuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiBhdHRyaWJ1dGVzXG4gICAgaWYgKGNvbW1vbkF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZWxlbWVudEF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBPYmplY3Qua2V5cyhlbGVtZW50QXR0cmlidXRlcykucmVkdWNlKChhdHRyaWJ1dGVzLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlID0gZWxlbWVudEF0dHJpYnV0ZXNba2V5XVxuICAgICAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICAgICAgLy8gTk9URTogd29ya2Fyb3VuZCBkZXRlY3Rpb24gZm9yIG5vbi1zdGFuZGFyZCBwaGFudG9tanMgTmFtZWROb2RlTWFwIGJlaGF2aW91clxuICAgICAgICAvLyAoaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hcml5YS9waGFudG9tanMvaXNzdWVzLzE0NjM0KVxuICAgICAgICBpZiAoYXR0cmlidXRlICYmIGF0dHJpYnV0ZU5hbWUgIT09ICdjbGFzcycpIHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlLnZhbHVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgIH0sIHt9KVxuXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKVxuICAgICAgY29uc3QgY29tbW9uQXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcylcblxuICAgICAgaWYgKGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFjb21tb25BdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChuZXh0Q29tbW9uQXR0cmlidXRlcywgbmFtZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjb21tb25BdHRyaWJ1dGVzW25hbWVdXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGF0dHJpYnV0ZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgbmV4dENvbW1vbkF0dHJpYnV0ZXNbbmFtZV0gPSB2YWx1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5leHRDb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSwge30pXG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5hdHRyaWJ1dGVzXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gfiB0YWdcbiAgICBpZiAoY29tbW9uVGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAoIWNvbW1vblRhZykge1xuICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLnRhZyA9IHRhZ1xuICAgICAgfSBlbHNlIGlmICh0YWcgIT09IGNvbW1vblRhZykge1xuICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy50YWdcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGNvbW1vblByb3BlcnRpZXNcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb21tb24uanMiLCIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcblxuLyoqXG4gKiBBcHBseSBkaWZmZXJlbnQgb3B0aW1pemF0aW9uIHRlY2huaXF1ZXNcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvciAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3B0aW1pemUgKHNlbGVjdG9yLCBlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgLy8gY29udmVydCBzaW5nbGUgZW50cnkgYW5kIE5vZGVMaXN0XG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9ICFlbGVtZW50cy5sZW5ndGggPyBbZWxlbWVudHNdIDogY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKCFlbGVtZW50cy5sZW5ndGggfHwgZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSB0byBjb21wYXJlIEhUTUxFbGVtZW50cyBpdHMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSByZWZlcmVuY2Ugb2YgdGhlIHNlbGVjdGVkIG5vZGUocykhIChtaXNzaW5nIFwiZWxlbWVudHNcIilgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcblxuICAvLyBjaHVuayBwYXJ0cyBvdXRzaWRlIG9mIHF1b3RlcyAoaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU2NjM3MjkpXG4gIHZhciBwYXRoID0gc2VsZWN0b3IucmVwbGFjZSgvPiAvZywgJz4nKS5zcGxpdCgvXFxzKyg/PSg/Oig/OlteXCJdKlwiKXsyfSkqW15cIl0qJCkvKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gb3B0aW1pemVQYXJ0KCcnLCBzZWxlY3RvciwgJycsIGVsZW1lbnRzKVxuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpICB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBwcmVQYXJ0ID0gcGF0aC5qb2luKCcgJylcbiAgICBjb25zdCBwb3N0UGFydCA9IHNob3J0ZW5lZC5qb2luKCcgJylcblxuICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSAke3Bvc3RQYXJ0fWBcbiAgICBjb25zdCBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gZWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICBzaG9ydGVuZWQudW5zaGlmdChvcHRpbWl6ZVBhcnQocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzKSlcbiAgICB9XG4gIH1cbiAgc2hvcnRlbmVkLnVuc2hpZnQocGF0aFswXSlcbiAgcGF0aCA9IHNob3J0ZW5lZFxuXG4gIC8vIG9wdGltaXplIHN0YXJ0ICsgZW5kXG4gIHBhdGhbMF0gPSBvcHRpbWl6ZVBhcnQoJycsIHBhdGhbMF0sIHBhdGguc2xpY2UoMSkuam9pbignICcpLCBlbGVtZW50cylcbiAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50cylcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJykucmVwbGFjZSgvPi9nLCAnPiAnKS50cmltKClcbn1cblxuLyoqXG4gKiBJbXByb3ZlIGEgY2h1bmsgb2YgdGhlIHNlbGVjdG9yXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcHJlUGFydCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVQYXJ0IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMpIHtcbiAgaWYgKHByZVBhcnQubGVuZ3RoKSBwcmVQYXJ0ID0gYCR7cHJlUGFydH0gYFxuICBpZiAocG9zdFBhcnQubGVuZ3RoKSBwb3N0UGFydCA9IGAgJHtwb3N0UGFydH1gXG5cbiAgLy8gcm9idXN0bmVzczogYXR0cmlidXRlIHdpdGhvdXQgdmFsdWUgKGdlbmVyYWxpemF0aW9uKVxuICBpZiAoL1xcWypcXF0vLnRlc3QoY3VycmVudCkpIHtcbiAgICBjb25zdCBrZXkgPSBjdXJyZW50LnJlcGxhY2UoLz0uKiQvLCAnXScpXG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7a2V5fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBrZXlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcm9idXN0bmVzczogcmVwbGFjZSBzcGVjaWZpYyBrZXktdmFsdWUgd2l0aCBiYXNlIHRhZyAoaGV1cmlzdGljKVxuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cHJlUGFydH0ke2tleX1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkpKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKC8+Ly50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IGN1cnJlbnQucmVwbGFjZSgvPi8sICcnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NlbmRhbnR9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IGRlc2NlbmRhbnRcbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiAnbnRoLW9mLXR5cGUnIGluc3RlYWQgJ250aC1jaGlsZCcgKGhldXJpc3RpYylcbiAgaWYgKC86bnRoLWNoaWxkLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgY29tcGxldGUgY292ZXJhZ2Ugb2YgJ250aC1vZi10eXBlJyByZXBsYWNlbWVudFxuICAgIGNvbnN0IHR5cGUgPSBjdXJyZW50LnJlcGxhY2UoL250aC1jaGlsZC9nLCAnbnRoLW9mLXR5cGUnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3R5cGV9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IHR5cGVcbiAgICB9XG4gIH1cblxuICAvLyBlZmZpY2llbmN5OiBjb21iaW5hdGlvbnMgb2YgY2xhc3NuYW1lIChwYXJ0aWFsIHBlcm11dGF0aW9ucylcbiAgaWYgKC9eXFwuXFxTKlteXFxzXFxcXF1cXC5cXFMrLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgdmFyIG5hbWVzID0gY3VycmVudC50cmltKClcbiAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyhefFteXFxcXF0pXFwuL2csICckMSMuJykgLy8gZXNjYXBlIGFjdHVhbCBkb3RzXG4gICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnIy4nKSAvLyBzcGxpdCBvbmx5IG9uIGFjdHVhbCBkb3RzXG4gICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgICAgICAgICAgICAubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKVxuICAgICAgICAgICAgICAgICAgICAgICAuc29ydCgoY3VyciwgbmV4dCkgPT4gY3Vyci5sZW5ndGggLSBuZXh0Lmxlbmd0aClcbiAgICB3aGlsZSAobmFtZXMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXJ0aWFsID0gY3VycmVudC5yZXBsYWNlKG5hbWVzLnNoaWZ0KCksICcnKS50cmltKClcbiAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke3BhcnRpYWx9JHtwb3N0UGFydH1gLnRyaW0oKVxuICAgICAgaWYgKCFwYXR0ZXJuLmxlbmd0aCB8fCBwYXR0ZXJuLmNoYXJBdCgwKSA9PT0gJz4nIHx8IHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoLTEpID09PSAnPicpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICBjdXJyZW50ID0gcGFydGlhbFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJvYnVzdG5lc3M6IGRlZ3JhZGUgY29tcGxleCBjbGFzc25hbWUgKGhldXJpc3RpYylcbiAgICBuYW1lcyA9IGN1cnJlbnQgJiYgY3VycmVudC5tYXRjaCgvXFwuL2cpXG4gICAgaWYgKG5hbWVzICYmIG5hbWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtjdXJyZW50fWApXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZmVyZW5jZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbaV1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSApKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gZGVzY3JpcHRpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50XG59XG5cbi8qKlxuICogRXZhbHVhdGUgbWF0Y2hlcyB3aXRoIGV4cGVjdGVkIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gbWF0Y2hlcyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjb21wYXJlUmVzdWx0cyAobWF0Y2hlcywgZWxlbWVudHMpIHtcbiAgY29uc3QgeyBsZW5ndGggfSA9IG1hdGNoZXNcbiAgcmV0dXJuIGxlbmd0aCA9PT0gZWxlbWVudHMubGVuZ3RoICYmIGVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG1hdGNoZXNbaV0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0pXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvb3B0aW1pemUuanMiLCIvKipcbiAqICMgQWRhcHRcbiAqXG4gKiBDaGVjayBhbmQgZXh0ZW5kIHRoZSBlbnZpcm9ubWVudCBmb3IgdW5pdmVyc2FsIHVzYWdlLlxuICovXG5cbi8qKlxuICogTW9kaWZ5IHRoZSBjb250ZXh0IGJhc2VkIG9uIHRoZSBlbnZpcm9ubWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRhcHQgKGVsZW1lbnQsIG9wdGlvbnMpIHtcblxuICAvLyBkZXRlY3QgZW52aXJvbm1lbnQgc2V0dXBcbiAgaWYgKGdsb2JhbC5kb2N1bWVudCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9IGVsc2Uge1xuICAgIGdsb2JhbC5kb2N1bWVudCA9IG9wdGlvbnMuY29udGV4dCB8fCAoKCkgPT4ge1xuICAgICAgdmFyIHJvb3QgPSBlbGVtZW50XG4gICAgICB3aGlsZSAocm9vdC5wYXJlbnQpIHtcbiAgICAgICAgcm9vdCA9IHJvb3QucGFyZW50XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdFxuICAgIH0pKClcbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWhhbmRsZXIvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDc1XG4gIGNvbnN0IEVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsLmRvY3VtZW50KVxuXG4gIC8vIGFsdGVybmF0aXZlIGRlc2NyaXB0b3IgdG8gYWNjZXNzIGVsZW1lbnRzIHdpdGggZmlsdGVyaW5nIGludmFsaWQgZWxlbWVudHMgKGUuZy4gdGV4dG5vZGVzKVxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycpKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9tZWxlbWVudHR5cGUvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDEyXG4gICAgICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ3RhZycgfHwgbm9kZS50eXBlID09PSAnc2NyaXB0JyB8fCBub2RlLnR5cGUgPT09ICdzdHlsZSdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJykpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRyaWJ1dGVzXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05hbWVkTm9kZU1hcFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICBjb25zdCB7IGF0dHJpYnMgfSA9IHRoaXNcbiAgICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlicylcbiAgICAgICAgY29uc3QgTmFtZWROb2RlTWFwID0gYXR0cmlidXRlc05hbWVzLnJlZHVjZSgoYXR0cmlidXRlcywgYXR0cmlidXRlTmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2luZGV4XSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGF0dHJpYnV0ZU5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogYXR0cmlic1thdHRyaWJ1dGVOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgICB9LCB7IH0pXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYW1lZE5vZGVNYXAsICdsZW5ndGgnLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlc05hbWVzLmxlbmd0aFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gTmFtZWROb2RlTWFwXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0VsZW1lbnQvZ2V0QXR0cmlidXRlXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0QXR0cmlidXRlXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlic1tuYW1lXSB8fCBudWxsXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9Eb2N1bWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGZ1bmN0aW9uICh0YWdOYW1lKSB7XG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKHRoaXMuY2hpbGRUYWdzLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudC5uYW1lID09PSB0YWdOYW1lIHx8IHRhZ05hbWUgPT09ICcqJykge1xuICAgICAgICAgIEhUTUxDb2xsZWN0aW9uLnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBIVE1MQ29sbGVjdGlvblxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9Eb2N1bWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IG5hbWVzID0gY2xhc3NOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykuc3BsaXQoJyAnKVxuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlc2NlbmRhbnRDbGFzc05hbWUgPSBkZXNjZW5kYW50LmF0dHJpYnMuY2xhc3NcbiAgICAgICAgaWYgKGRlc2NlbmRhbnRDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IGRlc2NlbmRhbnRDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKSkge1xuICAgICAgICAgIEhUTUxDb2xsZWN0aW9uLnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBIVE1MQ29sbGVjdGlvblxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2Nzcy9zZWxlY3RvcnNfYXBpL3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9xdWVyeVNlbGVjdG9yQWxsXG4gICAgRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsID0gZnVuY3Rpb24gKHNlbGVjdG9ycykge1xuICAgICAgc2VsZWN0b3JzID0gc2VsZWN0b3JzLnJlcGxhY2UoLyg+KShcXFMpL2csICckMSAkMicpLnRyaW0oKSAvLyBhZGQgc3BhY2UgZm9yICc+JyBzZWxlY3RvclxuXG4gICAgICAvLyB1c2luZyByaWdodCB0byBsZWZ0IGV4ZWN1dGlvbiA9PiBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9jc3Mtc2VsZWN0I2hvdy1kb2VzLWl0LXdvcmtcbiAgICAgIGNvbnN0IGluc3RydWN0aW9ucyA9IGdldEluc3RydWN0aW9ucyhzZWxlY3RvcnMpXG4gICAgICBjb25zdCBkaXNjb3ZlciA9IGluc3RydWN0aW9ucy5zaGlmdCgpXG5cbiAgICAgIGNvbnN0IHRvdGFsID0gaW5zdHJ1Y3Rpb25zLmxlbmd0aFxuICAgICAgcmV0dXJuIGRpc2NvdmVyKHRoaXMpLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICB2YXIgc3RlcCA9IDBcbiAgICAgICAgd2hpbGUgKHN0ZXAgPCB0b3RhbCkge1xuICAgICAgICAgIG5vZGUgPSBpbnN0cnVjdGlvbnNbc3RlcF0obm9kZSwgdGhpcylcbiAgICAgICAgICBpZiAoIW5vZGUpIHsgLy8gaGllcmFyY2h5IGRvZXNuJ3QgbWF0Y2hcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBzdGVwICs9IDFcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuY29udGFpbnMpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9jb250YWluc1xuICAgIEVsZW1lbnRQcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgdmFyIGluY2x1c2l2ZSA9IGZhbHNlXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQsIGRvbmUpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICBpbmNsdXNpdmUgPSB0cnVlXG4gICAgICAgICAgZG9uZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gaW5jbHVzaXZlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSB0cmFuc2Zvcm1hdGlvbiBzdGVwc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSAgIHNlbGVjdG9ycyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxGdW5jdGlvbj59ICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0SW5zdHJ1Y3Rpb25zIChzZWxlY3RvcnMpIHtcbiAgcmV0dXJuIHNlbGVjdG9ycy5zcGxpdCgnICcpLnJldmVyc2UoKS5tYXAoKHNlbGVjdG9yLCBzdGVwKSA9PiB7XG4gICAgY29uc3QgZGlzY292ZXIgPSBzdGVwID09PSAwXG4gICAgY29uc3QgW3R5cGUsIHBzZXVkb10gPSBzZWxlY3Rvci5zcGxpdCgnOicpXG5cbiAgICB2YXIgdmFsaWRhdGUgPSBudWxsXG4gICAgdmFyIGluc3RydWN0aW9uID0gbnVsbFxuXG4gICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgIC8vIGNoaWxkOiAnPidcbiAgICAgIGNhc2UgLz4vLnRlc3QodHlwZSk6XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tQYXJlbnQgKG5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gKHZhbGlkYXRlKSA9PiB2YWxpZGF0ZShub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnRcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBjbGFzczogJy4nXG4gICAgICBjYXNlIC9eXFwuLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBuYW1lcyA9IHR5cGUuc3Vic3RyKDEpLnNwbGl0KCcuJylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGVDbGFzc05hbWUgPSBub2RlLmF0dHJpYnMuY2xhc3NcbiAgICAgICAgICByZXR1cm4gbm9kZUNsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gbm9kZUNsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0NsYXNzIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG5hbWVzLmpvaW4oJyAnKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGF0dHJpYnV0ZTogJ1trZXk9XCJ2YWx1ZVwiXSdcbiAgICAgIGNhc2UgL15cXFsvLnRlc3QodHlwZSk6XG4gICAgICAgIGNvbnN0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSA9IHR5cGUucmVwbGFjZSgvXFxbfFxcXXxcIi9nLCAnJykuc3BsaXQoJz0nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFzQXR0cmlidXRlID0gT2JqZWN0LmtleXMobm9kZS5hdHRyaWJzKS5pbmRleE9mKGF0dHJpYnV0ZUtleSkgPiAtMVxuICAgICAgICAgIGlmIChoYXNBdHRyaWJ1dGUpIHsgLy8gcmVnYXJkIG9wdGlvbmFsIGF0dHJpYnV0ZVZhbHVlXG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZVZhbHVlIHx8IChub2RlLmF0dHJpYnNbYXR0cmlidXRlS2V5XSA9PT0gYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGUgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGlkOiAnIydcbiAgICAgIGNhc2UgL14jLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBpZCA9IHR5cGUuc3Vic3RyKDEpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5hdHRyaWJzLmlkID09PSBpZFxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tJZCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgICBkb25lKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gdW5pdmVyc2FsOiAnKidcbiAgICAgIGNhc2UgL1xcKi8udGVzdCh0eXBlKTpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4gdHJ1ZVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVW5pdmVyc2FsIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudCkpXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIHRhZzogJy4uLidcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSB0eXBlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1RhZyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXBzZXVkbykge1xuICAgICAgcmV0dXJuIGluc3RydWN0aW9uXG4gICAgfVxuXG4gICAgY29uc3QgcnVsZSA9IHBzZXVkby5tYXRjaCgvLShjaGlsZHx0eXBlKVxcKChcXGQrKVxcKSQvKVxuICAgIGNvbnN0IGtpbmQgPSBydWxlWzFdXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChydWxlWzJdLCAxMCkgLSAxXG5cbiAgICBjb25zdCB2YWxpZGF0ZVBzZXVkbyA9IChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICB2YXIgY29tcGFyZVNldCA9IG5vZGUucGFyZW50LmNoaWxkVGFnc1xuICAgICAgICBpZiAoa2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgICAgICAgY29tcGFyZVNldCA9IGNvbXBhcmVTZXQuZmlsdGVyKHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVJbmRleCA9IGNvbXBhcmVTZXQuZmluZEluZGV4KChjaGlsZCkgPT4gY2hpbGQgPT09IG5vZGUpXG4gICAgICAgIGlmIChub2RlSW5kZXggPT09IGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGVuaGFuY2VJbnN0cnVjdGlvbiAobm9kZSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBpbnN0cnVjdGlvbihub2RlKVxuICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgIHJldHVybiBtYXRjaC5yZWR1Y2UoKE5vZGVMaXN0LCBtYXRjaGVkTm9kZSkgPT4ge1xuICAgICAgICAgIGlmICh2YWxpZGF0ZVBzZXVkbyhtYXRjaGVkTm9kZSkpIHtcbiAgICAgICAgICAgIE5vZGVMaXN0LnB1c2gobWF0Y2hlZE5vZGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICB9LCBbXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxpZGF0ZVBzZXVkbyhtYXRjaCkgJiYgbWF0Y2hcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogV2Fsa2luZyByZWN1cnNpdmUgdG8gaW52b2tlIGNhbGxiYWNrc1xuICpcbiAqIEBwYXJhbSB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gbm9kZXMgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgICAgICAgaGFuZGxlciAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VEZXNjZW5kYW50cyAobm9kZXMsIGhhbmRsZXIpIHtcbiAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIHZhciBwcm9ncmVzcyA9IHRydWVcbiAgICBoYW5kbGVyKG5vZGUsICgpID0+IHByb2dyZXNzID0gZmFsc2UpXG4gICAgaWYgKG5vZGUuY2hpbGRUYWdzICYmIHByb2dyZXNzKSB7XG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKG5vZGUuY2hpbGRUYWdzLCBoYW5kbGVyKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBCdWJibGUgdXAgZnJvbSBib3R0b20gdG8gdG9wXG4gKlxuICogQHBhcmFtICB7SFRNTEVMZW1lbnR9IG5vZGUgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVMZW1lbnR9IHJvb3QgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgIHZhbGlkYXRlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7SFRNTEVMZW1lbnR9ICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRBbmNlc3RvciAobm9kZSwgcm9vdCwgdmFsaWRhdGUpIHtcbiAgd2hpbGUgKG5vZGUucGFyZW50KSB7XG4gICAgbm9kZSA9IG5vZGUucGFyZW50XG4gICAgaWYgKHZhbGlkYXRlKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZVxuICAgIH1cbiAgICBpZiAobm9kZSA9PT0gcm9vdCkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hZGFwdC5qcyIsIi8qKlxuICogIyBTZWxlY3RcbiAqXG4gKiBDb25zdHJ1Y3QgYSB1bmlxdWUgQ1NTIHF1ZXJ5IHNlbGVjdG9yIHRvIGFjY2VzcyB0aGUgc2VsZWN0ZWQgRE9NIGVsZW1lbnQocykuXG4gKiBGb3IgbG9uZ2V2aXR5IGl0IGFwcGxpZXMgZGlmZmVyZW50IG1hdGNoaW5nIGFuZCBvcHRpbWl6YXRpb24gc3RyYXRlZ2llcy5cbiAqL1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJ1xuaW1wb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCB7IGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2luZ2xlU2VsZWN0b3IgKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICB9XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSBvbmx5IEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBhcmUgc3VwcG9ydGVkISAobm90IFwiJHt0eXBlb2YgZWxlbWVudH1cIilgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50LCBvcHRpb25zKVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gbWF0Y2goZWxlbWVudCwgb3B0aW9ucylcbiAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemUoc2VsZWN0b3IsIGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgLy8gZGVidWdcbiAgLy8gY29uc29sZS5sb2coYFxuICAvLyAgIHNlbGVjdG9yOiAgJHtzZWxlY3Rvcn1cbiAgLy8gICBvcHRpbWl6ZWQ6ICR7b3B0aW1pemVkfVxuICAvLyBgKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZWRcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBkZXNjZW5kYW50cyBmcm9tIGFuIGFuY2VzdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdH0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TXVsdGlTZWxlY3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgYW4gQXJyYXkgb2YgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGlzIHN1cHBvcnRlZCFgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclNlbGVjdG9yID0gZ2V0U2luZ2xlU2VsZWN0b3IoYW5jZXN0b3IsIG9wdGlvbnMpXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgdXNhZ2Ugb2YgbXVsdGlwbGUgc2VsZWN0b3JzICsgcGFyZW50LWNoaWxkIHJlbGF0aW9uICsgY2hlY2sgZm9yIHBhcnQgcmVkdW5kYW5jeVxuICBjb25zdCBjb21tb25TZWxlY3RvcnMgPSBnZXRDb21tb25TZWxlY3RvcnMoZWxlbWVudHMpXG4gIGNvbnN0IGRlc2NlbmRhbnRTZWxlY3RvciA9IGNvbW1vblNlbGVjdG9yc1swXVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gb3B0aW1pemUoYCR7YW5jZXN0b3JTZWxlY3Rvcn0gJHtkZXNjZW5kYW50U2VsZWN0b3J9YCwgZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdG9yTWF0Y2hlcyA9IGNvbnZlcnROb2RlTGlzdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblxuICBpZiAoIWVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiBzZWxlY3Rvck1hdGNoZXMuc29tZSgoZW50cnkpID0+IGVudHJ5ID09PSBlbGVtZW50KSApKSB7XG4gICAgLy8gVE9ETzogY2x1c3RlciBtYXRjaGVzIHRvIHNwbGl0IGludG8gc2ltaWxhciBncm91cHMgZm9yIHN1YiBzZWxlY3Rpb25zXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICBUaGUgc2VsZWN0ZWQgZWxlbWVudHMgY2FuXFwndCBiZSBlZmZpY2llbnRseSBtYXBwZWQuXG4gICAgICBJdHMgcHJvYmFibHkgYmVzdCB0byB1c2UgbXVsdGlwbGUgc2luZ2xlIHNlbGVjdG9ycyBpbnN0ZWFkIVxuICAgIGAsIGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHNlbGVjdG9yXG59XG5cbi8qKlxuICogR2V0IHNlbGVjdG9ycyB0byBkZXNjcmliZSBhIHNldCBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudHM+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0Q29tbW9uU2VsZWN0b3JzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IHsgY2xhc3NlcywgYXR0cmlidXRlcywgdGFnIH0gPSBnZXRDb21tb25Qcm9wZXJ0aWVzKGVsZW1lbnRzKVxuXG4gIGNvbnN0IHNlbGVjdG9yUGF0aCA9IFtdXG5cbiAgaWYgKHRhZykge1xuICAgIHNlbGVjdG9yUGF0aC5wdXNoKHRhZylcbiAgfVxuXG4gIGlmIChjbGFzc2VzKSB7XG4gICAgY29uc3QgY2xhc3NTZWxlY3RvciA9IGNsYXNzZXMubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGNsYXNzU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoYXR0cmlidXRlcykge1xuICAgIGNvbnN0IGF0dHJpYnV0ZVNlbGVjdG9yID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykucmVkdWNlKChwYXJ0cywgbmFtZSkgPT4ge1xuICAgICAgcGFydHMucHVzaChgWyR7bmFtZX09XCIke2F0dHJpYnV0ZXNbbmFtZV19XCJdYClcbiAgICAgIHJldHVybiBwYXJ0c1xuICAgIH0sIFtdKS5qb2luKCcnKVxuICAgIHNlbGVjdG9yUGF0aC5wdXNoKGF0dHJpYnV0ZVNlbGVjdG9yKVxuICB9XG5cbiAgaWYgKHNlbGVjdG9yUGF0aC5sZW5ndGgpIHtcbiAgICAvLyBUT0RPOiBjaGVjayBmb3IgcGFyZW50LWNoaWxkIHJlbGF0aW9uXG4gIH1cblxuICByZXR1cm4gW1xuICAgIHNlbGVjdG9yUGF0aC5qb2luKCcnKVxuICBdXG59XG5cbi8qKlxuICogQ2hvb3NlIGFjdGlvbiBkZXBlbmRpbmcgb24gdGhlIGlucHV0IChtdWx0aXBsZS9zaW5nbGUpXG4gKlxuICogTk9URTogZXh0ZW5kZWQgZGV0ZWN0aW9uIGlzIHVzZWQgZm9yIHNwZWNpYWwgY2FzZXMgbGlrZSB0aGUgPHNlbGVjdD4gZWxlbWVudCB3aXRoIDxvcHRpb25zPlxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fE5vZGVMaXN0fEFycmF5LjxIVE1MRWxlbWVudD59IGlucHV0ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoaW5wdXQubGVuZ3RoICYmICFpbnB1dC5uYW1lKSB7XG4gICAgcmV0dXJuIGdldE11bHRpU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG4gIH1cbiAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlbGVjdC5qcyIsIi8qKlxuICogIyBNYXRjaFxuICpcbiAqIFJldHJpZXZlIHNlbGVjdG9yIGZvciBhIG5vZGUuXG4gKi9cblxuaW1wb3J0IHsgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcblxuY29uc3QgZGVmYXVsdElnbm9yZSA9IHtcbiAgYXR0cmlidXRlIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdzdHlsZScsXG4gICAgICAnZGF0YS1yZWFjdGlkJyxcbiAgICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICAgIF0uaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoIChub2RlLCBvcHRpb25zKSB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudCxcbiAgICBza2lwID0gbnVsbCxcbiAgICBwcmlvcml0eSA9IFsnaWQnLCAnY2xhc3MnLCAnaHJlZicsICdzcmMnXSxcbiAgICBpZ25vcmUgPSB7fVxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IHBhdGggPSBbXVxuICB2YXIgZWxlbWVudCA9IG5vZGVcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG5cbiAgY29uc3Qgc2tpcENvbXBhcmUgPSBza2lwICYmIChBcnJheS5pc0FycmF5KHNraXApID8gc2tpcCA6IFtza2lwXSkubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAoZWxlbWVudCkgPT4gZWxlbWVudCA9PT0gZW50cnlcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5XG4gIH0pXG5cbiAgY29uc3Qgc2tpcENoZWNrcyA9IChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHNraXAgJiYgc2tpcENvbXBhcmUuc29tZSgoY29tcGFyZSkgPT4gY29tcGFyZShlbGVtZW50KSlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGlnbm9yZSkuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgIHZhciBwcmVkaWNhdGUgPSBpZ25vcmVbdHlwZV1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHByZWRpY2F0ZSA9IG5ldyBSZWdFeHAoZXNjYXBlVmFsdWUocHJlZGljYXRlKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUgPyAvKD86KS8gOiAvLl4vXG4gICAgfVxuICAgIC8vIGNoZWNrIGNsYXNzLS9hdHRyaWJ1dGVuYW1lIGZvciByZWdleFxuICAgIGlnbm9yZVt0eXBlXSA9IChuYW1lLCB2YWx1ZSkgPT4gcHJlZGljYXRlLnRlc3QodmFsdWUpXG4gIH0pXG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICBpZiAoc2tpcENoZWNrcyhlbGVtZW50KSAhPT0gdHJ1ZSkge1xuICAgICAgLy8gfiBnbG9iYWxcbiAgICAgIGlmIChjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcm9vdCkpIGJyZWFrXG4gICAgICBpZiAoY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmluZSBvbmx5IG9uZSBwYXJ0IGVhY2ggaXRlcmF0aW9uXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NoaWxkcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IHJvb3QpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kQXR0cmlidXRlc1BhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICBjb25zdCBzb3J0ZWRLZXlzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuc29ydCgoY3VyciwgbmV4dCkgPT4ge1xuICAgIGNvbnN0IGN1cnJQb3MgPSBwcmlvcml0eS5pbmRleE9mKGF0dHJpYnV0ZXNbY3Vycl0ubmFtZSlcbiAgICBjb25zdCBuZXh0UG9zID0gcHJpb3JpdHkuaW5kZXhPZihhdHRyaWJ1dGVzW25leHRdLm5hbWUpXG4gICAgaWYgKG5leHRQb3MgPT09IC0xKSB7XG4gICAgICBpZiAoY3VyclBvcyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gY3VyclBvcyAtIG5leHRQb3NcbiAgfSlcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlLnZhbHVlKVxuICAgIGNvbnN0IHVzZU5hbWVkSWdub3JlID0gYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBpZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBjb25zdCBjdXJyZW50RGVmYXVsdElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHZhciBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG5cbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2lkJykge1xuICAgICAgcGF0dGVybiA9IGAjJHthdHRyaWJ1dGVWYWx1ZX1gXG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgIGxldCBjbGFzc05hbWVzID0gYXR0cmlidXRlVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpXG4gICAgICBjb25zdCBjbGFzc0lnbm9yZSA9IGlnbm9yZS5jbGFzcyB8fCBkZWZhdWx0SWdub3JlLmNsYXNzXG4gICAgICBpZiAoY2xhc3NJZ25vcmUpIHtcbiAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3NJZ25vcmUoY2xhc3NOYW1lKSlcbiAgICAgIH1cbiAgICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgcGF0dGVybiA9IGAuJHtjbGFzc05hbWVzLmpvaW4oJy4nKX1gXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdHRlcm5cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZFRhZ1BhdHRlcm4gKGVsZW1lbnQsIGlnbm9yZSkge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS50YWcsIG51bGwsIHRhZ05hbWUpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gdGFnTmFtZVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggc3BlY2lmaWMgY2hpbGQgaWRlbnRpZmllclxuICpcbiAqIE5PVEU6ICdjaGlsZFRhZ3MnIGlzIGEgY3VzdG9tIHByb3BlcnR5IHRvIHVzZSBhcyBhIHZpZXcgZmlsdGVyIGZvciB0YWdzIHVzaW5nICdhZGFwdGVyLmpzJ1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDaGlsZHMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkVGFncyB8fCBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkID09PSBlbGVtZW50KSB7XG4gICAgICBjb25zdCBjaGlsZFBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgY2hpbGQsIGlnbm9yZSlcbiAgICAgIGlmICghY2hpbGRQYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgICAgIEVsZW1lbnQgY291bGRuXFwndCBiZSBtYXRjaGVkIHRocm91Z2ggc3RyaWN0IGlnbm9yZSBwYXR0ZXJuIVxuICAgICAgICBgLCBjaGlsZCwgaWdub3JlLCBjaGlsZFBhdHRlcm4pXG4gICAgICB9XG4gICAgICBjb25zdCBwYXR0ZXJuID0gYD4gJHtjaGlsZFBhdHRlcm59Om50aC1jaGlsZCgke2krMX0pYFxuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZFBhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpIHtcbiAgdmFyIHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKCFwYXR0ZXJuKSB7XG4gICAgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgfVxuICByZXR1cm4gcGF0dGVyblxufVxuXG4vKipcbiAqIFZhbGlkYXRlIHdpdGggY3VzdG9tIGFuZCBkZWZhdWx0IGZ1bmN0aW9uc1xuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBwcmVkaWNhdGUgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nP30gIG5hbWUgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdmFsdWUgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBkZWZhdWx0UHJlZGljYXRlIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWdub3JlIChwcmVkaWNhdGUsIG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIGNvbnN0IGNoZWNrID0gcHJlZGljYXRlIHx8IGRlZmF1bHRQcmVkaWNhdGVcbiAgaWYgKCFjaGVjaykge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBjaGVjayhuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9tYXRjaC5qcyIsImV4cG9ydCBzZWxlY3QsIHsgZ2V0U2luZ2xlU2VsZWN0b3IsIGdldE11bHRpU2VsZWN0b3IgfSBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5leHBvcnQgZGVmYXVsdCBmcm9tICcuL3NlbGVjdCdcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=