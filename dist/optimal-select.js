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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
  return value && value.replace(/['"`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '\A ');
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

  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  if (path.length < 2) {
    return optimizePart('', selector, '', elements);
  }

  var shortened = [path.pop()];

  var _loop = function _loop() {
    var current = path.pop();
    var prePart = path.join(' ');
    var postPart = shortened.join(' ');

    var pattern = prePart + ' ' + postPart;
    var matches = document.querySelectorAll(pattern);
    var hasSameResult = matches.length === elements.length && elements.every(function (element, i) {
      return element === matches[i];
    });
    if (!hasSameResult) {
      shortened.unshift(optimizePart(prePart, current, postPart, elements));
    }
  };

  while (path.length > 1) {
    _loop();
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

      var _loop2 = function _loop2() {
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

        var _ret2 = _loop2();

        if (_ret2 === 'break') break;
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

      var _loop3 = function _loop3() {
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

var _css2xpath = __webpack_require__(5);

var _css2xpath2 = _interopRequireDefault(_css2xpath);

var _adapt = __webpack_require__(3);

var _adapt2 = _interopRequireDefault(_adapt);

var _match = __webpack_require__(6);

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
  var result = getSingleSelector(input, options);

  if (!options || !options.format) {
    return result;
  }

  return (0, _css2xpath2.default)(result);
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


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = match;

var _utilities = __webpack_require__(0);

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

  while (element !== root && element.nodeType !== 11) {
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

  var pattern = findAttributesPattern(priority, element, ignore, parent);
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
 * Get class selector
 *
 * @param  {Array.<string>} classes - [description]
 * @param  {HTMLElement}    parent  - [description]
 * @return {string?}                 - [description]
 */
function getClassSelector() {
  var classes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var parent = arguments[1];

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
    var matches = parent.querySelectorAll(r);
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
function findAttributesPattern(priority, element, ignore) {
  var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : element.parentNode;

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
        pattern = getClassSelector(classNames, parent);

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
 * @param  {HTMLElement}    parent  - [description]
 * @return {boolean}                - [description]
 */
function checkTag(element, ignore, path) {
  var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : element.parentNode;

  var pattern = findTagPattern(element, ignore);
  if (pattern) {
    var matches = [];
    matches = parent.querySelectorAll(pattern);
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
/* 7 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyODQxMWM2NWRmZTBhNjU5NjJiYiIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL34vY3NzMnhwYXRoL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0IiwiZXNjYXBlVmFsdWUiLCJub2RlcyIsImxlbmd0aCIsImFyciIsIkFycmF5IiwiaSIsInZhbHVlIiwicmVwbGFjZSIsImdldENvbW1vbkFuY2VzdG9yIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImVsZW1lbnRzIiwib3B0aW9ucyIsInJvb3QiLCJkb2N1bWVudCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwicGFyZW50IiwibWlzc2luZyIsInNvbWUiLCJvdGhlclBhcmVudHMiLCJvdGhlclBhcmVudCIsImwiLCJjb21tb25Qcm9wZXJ0aWVzIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJ0YWciLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwibmFtZSIsImVsZW1lbnRBdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImtleSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIm9wdGltaXplIiwic2VsZWN0b3IiLCJzdGFydHNXaXRoIiwiaXNBcnJheSIsIm5vZGVUeXBlIiwiRXJyb3IiLCJnbG9iYWxNb2RpZmllZCIsInBhdGgiLCJvcHRpbWl6ZVBhcnQiLCJzaG9ydGVuZWQiLCJwb3AiLCJjdXJyZW50IiwicHJlUGFydCIsImpvaW4iLCJwb3N0UGFydCIsInBhdHRlcm4iLCJtYXRjaGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsInNsaWNlIiwidGVzdCIsImNvbXBhcmVSZXN1bHRzIiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImNvbnRhaW5zIiwiZGVzY3JpcHRpb24iLCJkZXNjZW5kYW50IiwidHlwZSIsIm5hbWVzIiwibWFwIiwicGFydGlhbCIsImNoYXJBdCIsIm1hdGNoIiwiYWRhcHQiLCJnbG9iYWwiLCJjb250ZXh0IiwiRWxlbWVudFByb3RvdHlwZSIsImdldFByb3RvdHlwZU9mIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiY2hpbGRyZW4iLCJub2RlIiwiYXR0cmlicyIsIk5hbWVkTm9kZU1hcCIsImNvbmZpZ3VyYWJsZSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiSFRNTENvbGxlY3Rpb24iLCJ0cmF2ZXJzZURlc2NlbmRhbnRzIiwiY2hpbGRUYWdzIiwicHVzaCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJjbGFzc05hbWUiLCJkZXNjZW5kYW50Q2xhc3NOYW1lIiwiY2xhc3MiLCJpbmRleE9mIiwic2VsZWN0b3JzIiwiaW5zdHJ1Y3Rpb25zIiwiZ2V0SW5zdHJ1Y3Rpb25zIiwiZGlzY292ZXIiLCJ0b3RhbCIsInN0ZXAiLCJpbmNsdXNpdmUiLCJkb25lIiwicmV2ZXJzZSIsInBzZXVkbyIsInZhbGlkYXRlIiwiaW5zdHJ1Y3Rpb24iLCJjaGVja1BhcmVudCIsInN1YnN0ciIsIm5vZGVDbGFzc05hbWUiLCJjaGVja0NsYXNzIiwiZ2V0QW5jZXN0b3IiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsImhhc0F0dHJpYnV0ZSIsImNoZWNrQXR0cmlidXRlIiwiTm9kZUxpc3QiLCJpZCIsImNoZWNrSWQiLCJjaGVja1VuaXZlcnNhbCIsImNoZWNrVGFnIiwicnVsZSIsImtpbmQiLCJwYXJzZUludCIsInZhbGlkYXRlUHNldWRvIiwiY29tcGFyZVNldCIsIm5vZGVJbmRleCIsImZpbmRJbmRleCIsImNoaWxkIiwiZW5oYW5jZUluc3RydWN0aW9uIiwibWF0Y2hlZE5vZGUiLCJoYW5kbGVyIiwicHJvZ3Jlc3MiLCJnZXRTaW5nbGVTZWxlY3RvciIsImdldE11bHRpU2VsZWN0b3IiLCJnZXRRdWVyeVNlbGVjdG9yIiwib3B0aW1pemVkIiwiYW5jZXN0b3JTZWxlY3RvciIsImNvbW1vblNlbGVjdG9ycyIsImdldENvbW1vblNlbGVjdG9ycyIsImRlc2NlbmRhbnRTZWxlY3RvciIsInNlbGVjdG9yTWF0Y2hlcyIsImNvbnNvbGUiLCJ3YXJuIiwic2VsZWN0b3JQYXRoIiwiY2xhc3NTZWxlY3RvciIsImF0dHJpYnV0ZVNlbGVjdG9yIiwicGFydHMiLCJpbnB1dCIsInJlc3VsdCIsImZvcm1hdCIsInhwYXRoX3RvX2xvd2VyIiwicyIsInhwYXRoX2VuZHNfd2l0aCIsInMxIiwiczIiLCJ4cGF0aF91cmwiLCJ4cGF0aF91cmxfYXR0cnMiLCJ4cGF0aF91cmxfcGF0aCIsInhwYXRoX3VybF9kb21haW4iLCJ4cGF0aF9sb3dlcl9jYXNlIiwieHBhdGhfbnNfdXJpIiwieHBhdGhfbnNfcGF0aCIsInhwYXRoX2hhc19wcm90b2NhbCIsInhwYXRoX2lzX2ludGVybmFsIiwieHBhdGhfaXNfbG9jYWwiLCJ4cGF0aF9pc19wYXRoIiwieHBhdGhfaXNfbG9jYWxfcGF0aCIsInhwYXRoX25vcm1hbGl6ZV9zcGFjZSIsInhwYXRoX2ludGVybmFsIiwieHBhdGhfZXh0ZXJuYWwiLCJlc2NhcGVfbGl0ZXJhbCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImVzY2FwZV9wYXJlbnMiLCJyZWdleF9zdHJpbmdfbGl0ZXJhbCIsInJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCIsInJlZ2V4X2Nzc193cmFwX3BzZXVkbyIsInJlZ2V4X3NwZWNhbF9jaGFycyIsInJlZ2V4X2ZpcnN0X2F4aXMiLCJyZWdleF9maWx0ZXJfcHJlZml4IiwicmVnZXhfYXR0cl9wcmVmaXgiLCJyZWdleF9udGhfZXF1YXRpb24iLCJjc3NfY29tYmluYXRvcnNfcmVnZXgiLCJjc3NfY29tYmluYXRvcnNfY2FsbGJhY2siLCJvcGVyYXRvciIsImF4aXMiLCJmdW5jIiwibGl0ZXJhbCIsImV4Y2x1ZGUiLCJvZmZzZXQiLCJvcmlnIiwicHJlZml4IiwiaXNOdW1lcmljIiwicHJldkNoYXIiLCJjc3NfYXR0cmlidXRlc19yZWdleCIsImNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrIiwic3RyIiwiYXR0ciIsImNvbXAiLCJvcCIsInZhbCIsInNlYXJjaCIsImNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCIsImNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayIsImcxIiwiZzIiLCJhcmciLCJnMyIsImc0IiwiZzUiLCJjc3MyeHBhdGgiLCJhIiwieHBhdGgiLCJwcmVwZW5kQXhpcyIsImNzc19pZHNfY2xhc3Nlc19yZWdleCIsImNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayIsInN0YXJ0Iiwic2VsZWN0b3JTdGFydCIsImRlcHRoIiwibnVtIiwiaXNOYU4iLCJlc2NhcGVDaGFyIiwib3BlbiIsImNsb3NlIiwiY2hhciIsIlJlZ0V4cCIsInJlcGVhdCIsIk51bWJlciIsImNvbnZlcnRFc2NhcGluZyIsIm5lc3RlZCIsImxpdGVyYWxzIiwic3Vic3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIndpbmRvdyIsImRlZmF1bHRJZ25vcmUiLCJza2lwIiwicHJpb3JpdHkiLCJpZ25vcmUiLCJza2lwQ29tcGFyZSIsInNraXBDaGVja3MiLCJjb21wYXJlIiwicHJlZGljYXRlIiwidG9TdHJpbmciLCJjaGVja0F0dHJpYnV0ZXMiLCJjaGVja0NoaWxkcyIsImZpbmRQYXR0ZXJuIiwiZmluZEF0dHJpYnV0ZXNQYXR0ZXJuIiwiZ2V0Q2xhc3NTZWxlY3RvciIsImMiLCJyIiwiY29uY2F0IiwiYiIsImF0dHJpYnV0ZU5hbWVzIiwic29ydGVkS2V5cyIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkUGF0dGVybiIsImRlZmF1bHRQcmVkaWNhdGUiLCJjaGVjayIsInNlbGVjdCIsImNvbW1vbiIsImRlZmF1bHQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztRQ3BEZ0JBLGUsR0FB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QSxNQUFJLENBQUNDLEtBQUwsRUFBWTtBQUNWLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBT0EsTUFBTWpQLElBQU4sRUFBWXhDLEtBQVosRUFBbUJ3UixnQkFBbkIsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkN6VGdCbkksaUI7Ozs7OztvQkFBbUJDLGdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFBN0JvSSxNO1FBQ0FyTyxRO1FBQ0tzTyxNO1FBRUxDLE8iLCJmaWxlIjoib3B0aW1hbC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjg0MTFjNjVkZmUwYTY1OTYyYmIiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0Tm9kZUxpc3QgKG5vZGVzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlVmFsdWUgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5yZXBsYWNlKC9bJ1wiYFxcXFwvOlxcPyYhIyQlXigpW1xcXXt8fSorOywuPD0+QH5dL2csICdcXFxcJCYnKVxuICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csICdcXEEgJylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsaXRpZXMuanMiLCIvKipcbiAqICMgQ29tbW9uXG4gKlxuICogUHJvY2VzcyBjb2xsZWN0aW9ucyBmb3Igc2ltaWxhcml0aWVzLlxuICovXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25BbmNlc3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25Qcm9wZXJ0aWVzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSB7XG4gICAgY2xhc3NlczogW10sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgdGFnOiBudWxsXG4gIH1cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICB2YXIge1xuICAgICAgY2xhc3NlczogY29tbW9uQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXM6IGNvbW1vbkF0dHJpYnV0ZXMsXG4gICAgICB0YWc6IGNvbW1vblRhZ1xuICAgIH0gPSBjb21tb25Qcm9wZXJ0aWVzXG5cbiAgICAvLyB+IGNsYXNzZXNcbiAgICBpZiAoY29tbW9uQ2xhc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgICBpZiAoIWNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkNsYXNzZXMgPSBjb21tb25DbGFzc2VzLmZpbHRlcigoZW50cnkpID0+IGNsYXNzZXMuc29tZSgobmFtZSkgPT4gbmFtZSA9PT0gZW50cnkpKVxuICAgICAgICAgIGlmIChjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY29tbW9uQ2xhc3Nlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiByZXN0cnVjdHVyZSByZW1vdmFsIGFzIDJ4IHNldCAvIDJ4IGRlbGV0ZSwgaW5zdGVhZCBvZiBtb2RpZnkgYWx3YXlzIHJlcGxhY2luZyB3aXRoIG5ldyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IGF0dHJpYnV0ZXNcbiAgICBpZiAoY29tbW9uQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBlbGVtZW50QXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGVsZW1lbnRBdHRyaWJ1dGVzKS5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlc1trZXldXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgICAgICAvLyBOT1RFOiB3b3JrYXJvdW5kIGRldGVjdGlvbiBmb3Igbm9uLXN0YW5kYXJkIHBoYW50b21qcyBOYW1lZE5vZGVNYXAgYmVoYXZpb3VyXG4gICAgICAgIC8vIChpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTQ2MzQpXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGUudmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfSwge30pXG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICBjb25zdCBjb21tb25BdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKVxuXG4gICAgICBpZiAoYXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIWNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKG5leHRDb21tb25BdHRyaWJ1dGVzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbW1vbkF0dHJpYnV0ZXNbbmFtZV1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gYXR0cmlidXRlc1tuYW1lXSkge1xuICAgICAgICAgICAgICBuZXh0Q29tbW9uQXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dENvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IHRhZ1xuICAgIGlmIChjb21tb25UYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICghY29tbW9uVGFnKSB7XG4gICAgICAgIGNvbW1vblByb3BlcnRpZXMudGFnID0gdGFnXG4gICAgICB9IGVsc2UgaWYgKHRhZyAhPT0gY29tbW9uVGFnKSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLnRhZ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gY29tbW9uUHJvcGVydGllc1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1vbi5qcyIsIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbnNmb3JtYXRpb25cbiAqL1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcHRpbWl6ZSAoc2VsZWN0b3IsIGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoc2VsZWN0b3Iuc3RhcnRzV2l0aCgnPiAnKSkge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgnPiAnLCAnJyk7XG4gIH1cblxuICAvLyBjb252ZXJ0IHNpbmdsZSBlbnRyeSBhbmQgTm9kZUxpc3RcbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gIWVsZW1lbnRzLmxlbmd0aCA/IFtlbGVtZW50c10gOiBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoIWVsZW1lbnRzLmxlbmd0aCB8fCBlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIHRvIGNvbXBhcmUgSFRNTEVsZW1lbnRzIGl0cyBuZWNlc3NhcnkgdG8gcHJvdmlkZSBhIHJlZmVyZW5jZSBvZiB0aGUgc2VsZWN0ZWQgbm9kZShzKSEgKG1pc3NpbmcgXCJlbGVtZW50c1wiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuXG4gIC8vIGNodW5rIHBhcnRzIG91dHNpZGUgb2YgcXVvdGVzIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTY2MzcyOSlcbiAgdmFyIHBhdGggPSBzZWxlY3Rvci5yZXBsYWNlKC8+IC9nLCAnPicpLnNwbGl0KC9cXHMrKD89KD86KD86W15cIl0qXCIpezJ9KSpbXlwiXSokKS8pXG5cbiAgaWYgKHBhdGgubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBvcHRpbWl6ZVBhcnQoJycsIHNlbGVjdG9yLCAnJywgZWxlbWVudHMpXG4gIH1cblxuICBjb25zdCBzaG9ydGVuZWQgPSBbcGF0aC5wb3AoKV1cbiAgd2hpbGUgKHBhdGgubGVuZ3RoID4gMSkgIHtcbiAgICBjb25zdCBjdXJyZW50ID0gcGF0aC5wb3AoKVxuICAgIGNvbnN0IHByZVBhcnQgPSBwYXRoLmpvaW4oJyAnKVxuICAgIGNvbnN0IHBvc3RQYXJ0ID0gc2hvcnRlbmVkLmpvaW4oJyAnKVxuXG4gICAgY29uc3QgcGF0dGVybiA9IGAke3ByZVBhcnR9ICR7cG9zdFBhcnR9YFxuICAgIGNvbnN0IG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgY29uc3QgaGFzU2FtZVJlc3VsdCA9IG1hdGNoZXMubGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQsIGkpID0+IGVsZW1lbnQgPT09IG1hdGNoZXNbaV0pO1xuICAgIGlmICghaGFzU2FtZVJlc3VsdCkge1xuICAgICAgc2hvcnRlbmVkLnVuc2hpZnQob3B0aW1pemVQYXJ0KHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cykpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLmpvaW4oJyAnKSwgZWxlbWVudHMpXG4gIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aC5zbGljZSgwLCAtMSkuam9pbignICcpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCAnJywgZWxlbWVudHMpXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpLnJlcGxhY2UoLz4vZywgJz4gJykudHJpbSgpXG59XG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplUGFydCAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzKSB7XG4gIGlmIChwcmVQYXJ0Lmxlbmd0aCkgcHJlUGFydCA9IGAke3ByZVBhcnR9IGBcbiAgaWYgKHBvc3RQYXJ0Lmxlbmd0aCkgcG9zdFBhcnQgPSBgICR7cG9zdFBhcnR9YFxuXG4gIC8vIHJvYnVzdG5lc3M6IGF0dHJpYnV0ZSB3aXRob3V0IHZhbHVlIChnZW5lcmFsaXphdGlvbilcbiAgaWYgKC9cXFsqXFxdLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3Qga2V5ID0gY3VycmVudC5yZXBsYWNlKC89LiokLywgJ10nKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2tleX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0ga2V5XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJvYnVzdG5lc3M6IHJlcGxhY2Ugc3BlY2lmaWMga2V5LXZhbHVlIHdpdGggYmFzZSB0YWcgKGhldXJpc3RpYylcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtrZXl9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NyaXB0aW9ufSR7cG9zdFBhcnR9YFxuICAgICAgICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmICgvPi8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjdXJyZW50LnJlcGxhY2UoLz4vLCAnJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjZW5kYW50fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmICgvOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5yZXBsYWNlKC9udGgtY2hpbGQvZywgJ250aC1vZi10eXBlJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHt0eXBlfSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSB0eXBlXG4gICAgfVxuICB9XG5cbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmICgvXlxcLlxcUypbXlxcc1xcXFxdXFwuXFxTKy8udGVzdChjdXJyZW50KSkge1xuICAgIHZhciBuYW1lcyA9IGN1cnJlbnQudHJpbSgpXG4gICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXnxbXlxcXFxdKVxcLi9nLCAnJDEjLicpIC8vIGVzY2FwZSBhY3R1YWwgZG90c1xuICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoJyMuJykgLy8gc3BsaXQgb25seSBvbiBhY3R1YWwgZG90c1xuICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YClcbiAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG4gICAgd2hpbGUgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFydGlhbCA9IGN1cnJlbnQucmVwbGFjZShuYW1lcy5zaGlmdCgpLCAnJykudHJpbSgpXG4gICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YC50cmltKClcbiAgICAgIGlmICghcGF0dGVybi5sZW5ndGggfHwgcGF0dGVybi5jaGFyQXQoMCkgPT09ICc+JyB8fCBwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aC0xKSA9PT0gJz4nKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcnRpYWxcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgbmFtZXMgPSBjdXJyZW50ICYmIGN1cnJlbnQubWF0Y2goL1xcLi9nKVxuICAgIGlmIChuYW1lcyAmJiBuYW1lcy5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwcmVQYXJ0fSR7Y3VycmVudH1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VzW2ldXG4gICAgICAgIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiByZWZlcmVuY2UuY29udGFpbnMoZWxlbWVudCkgKSkge1xuICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgLy8gLSBjaGVjayB1c2luZyBhdHRyaWJ1dGVzICsgcmVnYXJkIGV4Y2x1ZGVzXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2UudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIEV2YWx1YXRlIG1hdGNoZXMgd2l0aCBleHBlY3RlZCBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IG1hdGNoZXMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZVJlc3VsdHMgKG1hdGNoZXMsIGVsZW1lbnRzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBtYXRjaGVzXG4gIHJldHVybiBsZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaGVzW2ldID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29wdGltaXplLmpzIiwiLyoqXG4gKiAjIEFkYXB0XG4gKlxuICogQ2hlY2sgYW5kIGV4dGVuZCB0aGUgZW52aXJvbm1lbnQgZm9yIHVuaXZlcnNhbCB1c2FnZS5cbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRUxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG5cbiAgLy8gZGV0ZWN0IGVudmlyb25tZW50IHNldHVwXG4gIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuZG9jdW1lbnQgPSBvcHRpb25zLmNvbnRleHQgfHwgKCgpID0+IHtcbiAgICAgIHZhciByb290ID0gZWxlbWVudFxuICAgICAgd2hpbGUgKHJvb3QucGFyZW50KSB7XG4gICAgICAgIHJvb3QgPSByb290LnBhcmVudFxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3RcbiAgICB9KSgpXG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0w3NVxuICBjb25zdCBFbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbC5kb2N1bWVudClcblxuICAvLyBhbHRlcm5hdGl2ZSBkZXNjcmlwdG9yIHRvIGFjY2VzcyBlbGVtZW50cyB3aXRoIGZpbHRlcmluZyBpbnZhbGlkIGVsZW1lbnRzIChlLmcuIHRleHRub2RlcylcbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWVsZW1lbnR0eXBlL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0wxMlxuICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICd0YWcnIHx8IG5vZGUudHlwZSA9PT0gJ3NjcmlwdCcgfHwgbm9kZS50eXBlID09PSAnc3R5bGUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycpKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0cmlidXRlc1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9OYW1lZE5vZGVNYXBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJzIH0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnMpXG4gICAgICAgIGNvbnN0IE5hbWVkTm9kZU1hcCA9IGF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgYXR0cmlidXRlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnNbYXR0cmlidXRlTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgICAgfSwgeyB9KVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmFtZWROb2RlTWFwLCAnbGVuZ3RoJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIE5hbWVkTm9kZU1hcFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnNbbmFtZV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyh0aGlzLmNoaWxkVGFncywgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQubmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSAnKicpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lcyA9IGNsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNwbGl0KCcgJylcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50Q2xhc3NOYW1lID0gZGVzY2VuZGFudC5hdHRyaWJzLmNsYXNzXG4gICAgICAgIGlmIChkZXNjZW5kYW50Q2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBkZXNjZW5kYW50Q2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSkpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9jc3Mvc2VsZWN0b3JzX2FwaS9xdWVyeVNlbGVjdG9yQWxsXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvcXVlcnlTZWxlY3RvckFsbFxuICAgIEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIChzZWxlY3RvcnMpIHtcbiAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9ycy5yZXBsYWNlKC8oPikoXFxTKS9nLCAnJDEgJDInKS50cmltKCkgLy8gYWRkIHNwYWNlIGZvciAnPicgc2VsZWN0b3JcblxuICAgICAgLy8gdXNpbmcgcmlnaHQgdG8gbGVmdCBleGVjdXRpb24gPT4gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvY3NzLXNlbGVjdCNob3ctZG9lcy1pdC13b3JrXG4gICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBnZXRJbnN0cnVjdGlvbnMoc2VsZWN0b3JzKVxuICAgICAgY29uc3QgZGlzY292ZXIgPSBpbnN0cnVjdGlvbnMuc2hpZnQoKVxuXG4gICAgICBjb25zdCB0b3RhbCA9IGluc3RydWN0aW9ucy5sZW5ndGhcbiAgICAgIHJldHVybiBkaXNjb3Zlcih0aGlzKS5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIHN0ZXAgPSAwXG4gICAgICAgIHdoaWxlIChzdGVwIDwgdG90YWwpIHtcbiAgICAgICAgICBub2RlID0gaW5zdHJ1Y3Rpb25zW3N0ZXBdKG5vZGUsIHRoaXMpXG4gICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGhpZXJhcmNoeSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RlcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY29udGFpbnNcbiAgICBFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHZhciBpbmNsdXNpdmUgPSBmYWxzZVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgaW5jbHVzaXZlID0gdHJ1ZVxuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGluY2x1c2l2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogUmV0cmlldmUgdHJhbnNmb3JtYXRpb24gc3RlcHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gICBzZWxlY3RvcnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48RnVuY3Rpb24+fSAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEluc3RydWN0aW9ucyAoc2VsZWN0b3JzKSB7XG4gIHJldHVybiBzZWxlY3RvcnMuc3BsaXQoJyAnKS5yZXZlcnNlKCkubWFwKChzZWxlY3Rvciwgc3RlcCkgPT4ge1xuICAgIGNvbnN0IGRpc2NvdmVyID0gc3RlcCA9PT0gMFxuICAgIGNvbnN0IFt0eXBlLCBwc2V1ZG9dID0gc2VsZWN0b3Iuc3BsaXQoJzonKVxuXG4gICAgdmFyIHZhbGlkYXRlID0gbnVsbFxuICAgIHZhciBpbnN0cnVjdGlvbiA9IG51bGxcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAvLyBjaGlsZDogJz4nXG4gICAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrUGFyZW50IChub2RlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWxpZGF0ZSkgPT4gdmFsaWRhdGUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0eXBlLnN1YnN0cigxKS5zcGxpdCgnLicpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlQ2xhc3NOYW1lID0gbm9kZS5hdHRyaWJzLmNsYXNzXG4gICAgICAgICAgcmV0dXJuIG5vZGVDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IG5vZGVDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tDbGFzcyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcy5qb2luKCcgJykpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBhdHRyaWJ1dGU6ICdba2V5PVwidmFsdWVcIl0nXG4gICAgICBjYXNlIC9eXFxbLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gPSB0eXBlLnJlcGxhY2UoL1xcW3xcXF18XCIvZywgJycpLnNwbGl0KCc9JylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgICBpZiAoaGFzQXR0cmlidXRlKSB7IC8vIHJlZ2FyZCBvcHRpb25hbCBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSB8fCAobm9kZS5hdHRyaWJzW2F0dHJpYnV0ZUtleV0gPT09IGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBpZDogJyMnXG4gICAgICBjYXNlIC9eIy8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHRydWVcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1VuaXZlcnNhbCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpKVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyB0YWc6ICcuLi4nXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gdHlwZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tUYWcgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFdhbGtpbmcgcmVjdXJzaXZlIHRvIGludm9rZSBjYWxsYmFja3NcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxIVE1MRWxlbWVudD59IG5vZGVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgIGhhbmRsZXIgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQnViYmxlIHVwIGZyb20gYm90dG9tIHRvIHRvcFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSByb290ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICB2YWxpZGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFTGVtZW50fSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRhcHQuanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cbmltcG9ydCBjc3MyeHBhdGggZnJvbSAnY3NzMnhwYXRoJztcblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5pbXBvcnQgbWF0Y2ggZnJvbSAnLi9tYXRjaCdcbmltcG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5pbXBvcnQgeyBnZXRDb21tb25BbmNlc3RvciwgZ2V0Q29tbW9uUHJvcGVydGllcyB9IGZyb20gJy4vY29tbW9uJ1xuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIGZvciB0aGUgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNpbmdsZVNlbGVjdG9yIChlbGVtZW50LCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSA9PT0gMykge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgfVxuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gYXJlIHN1cHBvcnRlZCEgKG5vdCBcIiR7dHlwZW9mIGVsZW1lbnR9XCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICBjb25zdCBzZWxlY3RvciA9IG1hdGNoKGVsZW1lbnQsIG9wdGlvbnMpXG4gIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHNlbGVjdG9yLCBlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKGBcbiAgLy8gICBzZWxlY3RvcjogICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiAke29wdGltaXplZH1cbiAgLy8gYClcblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gb3B0aW1pemVkXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgdG8gbWF0Y2ggbXVsdGlwbGUgZGVzY2VuZGFudHMgZnJvbSBhbiBhbmNlc3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD58Tm9kZUxpc3R9IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE11bHRpU2VsZWN0b3IgKGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSBjb252ZXJ0Tm9kZUxpc3QoZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSBvbmx5IGFuIEFycmF5IG9mIEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBpcyBzdXBwb3J0ZWQhYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG5cbiAgY29uc3QgYW5jZXN0b3IgPSBnZXRDb21tb25BbmNlc3RvcihlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3QgYW5jZXN0b3JTZWxlY3RvciA9IGdldFNpbmdsZVNlbGVjdG9yKGFuY2VzdG9yLCBvcHRpb25zKVxuXG4gIC8vIFRPRE86IGNvbnNpZGVyIHVzYWdlIG9mIG11bHRpcGxlIHNlbGVjdG9ycyArIHBhcmVudC1jaGlsZCByZWxhdGlvbiArIGNoZWNrIGZvciBwYXJ0IHJlZHVuZGFuY3lcbiAgY29uc3QgY29tbW9uU2VsZWN0b3JzID0gZ2V0Q29tbW9uU2VsZWN0b3JzKGVsZW1lbnRzKVxuICBjb25zdCBkZXNjZW5kYW50U2VsZWN0b3IgPSBjb21tb25TZWxlY3RvcnNbMF1cblxuICBjb25zdCBzZWxlY3RvciA9IG9wdGltaXplKGAke2FuY2VzdG9yU2VsZWN0b3J9ICR7ZGVzY2VuZGFudFNlbGVjdG9yfWAsIGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBzZWxlY3Rvck1hdGNoZXMgPSBjb252ZXJ0Tm9kZUxpc3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpXG5cbiAgaWYgKCFlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4gc2VsZWN0b3JNYXRjaGVzLnNvbWUoKGVudHJ5KSA9PiBlbnRyeSA9PT0gZWxlbWVudCkgKSkge1xuICAgIC8vIFRPRE86IGNsdXN0ZXIgbWF0Y2hlcyB0byBzcGxpdCBpbnRvIHNpbWlsYXIgZ3JvdXBzIGZvciBzdWIgc2VsZWN0aW9uc1xuICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgVGhlIHNlbGVjdGVkIGVsZW1lbnRzIGNhblxcJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLlxuICAgICAgSXRzIHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCFcbiAgICBgLCBlbGVtZW50cylcbiAgfVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclxufVxuXG4vKipcbiAqIEdldCBzZWxlY3RvcnMgdG8gZGVzY3JpYmUgYSBzZXQgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENvbW1vblNlbGVjdG9ycyAoZWxlbWVudHMpIHtcblxuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBbXVxuXG4gIGlmICh0YWcpIHtcbiAgICBzZWxlY3RvclBhdGgucHVzaCh0YWcpXG4gIH1cblxuICBpZiAoY2xhc3Nlcykge1xuICAgIGNvbnN0IGNsYXNzU2VsZWN0b3IgPSBjbGFzc2VzLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YCkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChjbGFzc1NlbGVjdG9yKVxuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVTZWxlY3RvciA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgocGFydHMsIG5hbWUpID0+IHtcbiAgICAgIHBhcnRzLnB1c2goYFske25hbWV9PVwiJHthdHRyaWJ1dGVzW25hbWVdfVwiXWApXG4gICAgICByZXR1cm4gcGFydHNcbiAgICB9LCBbXSkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChhdHRyaWJ1dGVTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChzZWxlY3RvclBhdGgubGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogY2hlY2sgZm9yIHBhcmVudC1jaGlsZCByZWxhdGlvblxuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBzZWxlY3RvclBhdGguam9pbignJylcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCAmJiAhaW5wdXQubmFtZSkge1xuICAgIHJldHVybiBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuXG4gIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5mb3JtYXQpIHtcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICByZXR1cm4gY3NzMnhwYXRoKHJlc3VsdClcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3QuanMiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciB4cGF0aF90b19sb3dlciAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgICAgICAgKHMgfHwgJ25vcm1hbGl6ZS1zcGFjZSgpJykgK1xuICAgICAgICAgICAgICAgICcsIFxcJ0FCQ0RFRkdISklLTE1OT1BRUlNUVVZXWFlaXFwnJyArXG4gICAgICAgICAgICAgICAgJywgXFwnYWJjZGVmZ2hqaWtsbW5vcHFyc3R1dnd4eXpcXCcpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF9lbmRzX3dpdGggICAgICAgID0gZnVuY3Rpb24gKHMxLCBzMikge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZygnICsgczEgKyAnLCcgK1xuICAgICAgICAgICAgICAgICdzdHJpbmctbGVuZ3RoKCcgKyBzMSArICcpLXN0cmluZy1sZW5ndGgoJyArIHMyICsgJykrMSk9JyArIHMyO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybCAgICAgICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1iZWZvcmUoY29uY2F0KHN1YnN0cmluZy1hZnRlcignICtcbiAgICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIj9cIiksXCI/XCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfcGF0aCAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYWZ0ZXIoJyArIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2RvbWFpbiAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCI6Ly9cIiksXCIvXCIpLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2F0dHJzICAgICAgICA9ICdAaHJlZnxAc3JjJyxcbiAgICAgIHhwYXRoX2xvd2VyX2Nhc2UgICAgICAgPSB4cGF0aF90b19sb3dlcigpLFxuICAgICAgeHBhdGhfbnNfdXJpICAgICAgICAgICA9ICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0vQHVybCcsXG4gICAgICB4cGF0aF9uc19wYXRoICAgICAgICAgID0geHBhdGhfdXJsX3BhdGgoeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkpLFxuICAgICAgeHBhdGhfaGFzX3Byb3RvY2FsICAgICA9ICcoc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwOi8vXCIpIG9yIHN0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiaHR0cHM6Ly9cIikpJyxcbiAgICAgIHhwYXRoX2lzX2ludGVybmFsICAgICAgPSAnc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpICsgJykgb3IgJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF91cmxfZG9tYWluKCksIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9pc19sb2NhbCAgICAgICAgID0gJygnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkgKyAnKSknLFxuICAgICAgeHBhdGhfaXNfcGF0aCAgICAgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcIi9cIiknLFxuICAgICAgeHBhdGhfaXNfbG9jYWxfcGF0aCAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX3BhdGgoKSArICcsJyArIHhwYXRoX25zX3BhdGggKyAnKScsXG4gICAgICB4cGF0aF9ub3JtYWxpemVfc3BhY2UgID0gJ25vcm1hbGl6ZS1zcGFjZSgpJyxcbiAgICAgIHhwYXRoX2ludGVybmFsICAgICAgICAgPSAnW25vdCgnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJykgb3IgJyArIHhwYXRoX2lzX2ludGVybmFsICsgJ10nLFxuICAgICAgeHBhdGhfZXh0ZXJuYWwgICAgICAgICA9ICdbJyArIHhwYXRoX2hhc19wcm90b2NhbCArICcgYW5kIG5vdCgnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnKV0nLFxuICAgICAgZXNjYXBlX2xpdGVyYWwgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzApLFxuICAgICAgZXNjYXBlX3BhcmVucyAgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzEpLFxuICAgICAgcmVnZXhfc3RyaW5nX2xpdGVyYWwgICA9IC8oXCJbXlwiXFx4MUVdKlwifCdbXidcXHgxRV0qJ3w9XFxzKlteXFxzXFxdXFwnXFxcIl0rKS9nLFxuICAgICAgcmVnZXhfZXNjYXBlZF9saXRlcmFsICA9IC9bJ1wiXT8oXFx4MUUrKVsnXCJdPy9nLFxuICAgICAgcmVnZXhfY3NzX3dyYXBfcHNldWRvICA9IC8oXFx4MUZcXCl8W15cXCldKVxcOihmaXJzdHxsaW1pdHxsYXN0fGd0fGx0fGVxfG50aCkoW15cXC1dfCQpLyxcbiAgICAgIHJlZ2V4X3NwZWNhbF9jaGFycyAgICAgPSAvW1xceDFDLVxceDFGXSsvZyxcbiAgICAgIHJlZ2V4X2ZpcnN0X2F4aXMgICAgICAgPSAvXihbXFxzXFwoXFx4MUZdKikoXFwuP1teXFwuXFwvXFwoXXsxLDJ9W2Etel0qOiopLyxcbiAgICAgIHJlZ2V4X2ZpbHRlcl9wcmVmaXggICAgPSAvKF58XFwvfFxcOilcXFsvZyxcbiAgICAgIHJlZ2V4X2F0dHJfcHJlZml4ICAgICAgPSAvKFteXFwoXFxbXFwvXFx8XFxzXFx4MUZdKVxcQC9nLFxuICAgICAgcmVnZXhfbnRoX2VxdWF0aW9uICAgICA9IC9eKFstMC05XSopbi4qPyhbMC05XSopJC8sXG4gICAgICBjc3NfY29tYmluYXRvcnNfcmVnZXggID0gL1xccyooIT9bKz5+LF4gXSlcXHMqKFxcLj9cXC8rfFthLXpcXC1dKzo6KT8oW2EtelxcLV0rXFwoKT8oKGFuZFxccyp8b3JcXHMqfG1vZFxccyopP1teKz5+LFxccydcIlxcXVxcfFxcXlxcJFxcIVxcPFxcPVxceDFDLVxceDFGXSspPy9nLFxuICAgICAgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBvcGVyYXRvciwgYXhpcywgZnVuYywgbGl0ZXJhbCwgZXhjbHVkZSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSAnJzsgLy8gSWYgd2UgY2FuLCB3ZSdsbCBwcmVmaXggYSAnLidcblxuICAgICAgICAvLyBYUGF0aCBvcGVyYXRvcnMgY2FuIGxvb2sgbGlrZSBub2RlLW5hbWUgc2VsZWN0b3JzXG4gICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgYW5kXCIsIFwiIG9yXCIsIFwiIG1vZFwiXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJyAnICYmIGV4Y2x1ZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBPbmx5IGFsbG93IG5vZGUtc2VsZWN0aW5nIFhQYXRoIGZ1bmN0aW9uc1xuICAgICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgKyBjb3VudCguLi4pXCIsIFwiIGNvdW50KC4uLilcIiwgXCIgPiBwb3NpdGlvbigpXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoZnVuYyAhPT0gdW5kZWZpbmVkICYmIChmdW5jICE9PSAnbm9kZSgnICYmIGZ1bmMgIT09ICd0ZXh0KCcgJiYgZnVuYyAhPT0gJ2NvbW1lbnQoJykpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGl0ZXJhbCA9IGZ1bmM7XG4gICAgICAgICAgfSAvLyBIYW5kbGUgY2FzZSBcIiArIHRleHQoKVwiLCBcIiA+IGNvbW1lbnQoKVwiLCBldGMuIHdoZXJlIFwiZnVuY1wiIGlzIG91ciBcImxpdGVyYWxcIlxuXG4gICAgICAgICAgICAvLyBYUGF0aCBtYXRoIG9wZXJhdG9ycyBtYXRjaCBzb21lIENTUyBjb21iaW5hdG9yc1xuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIDFcIiwgXCIgPiAxXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGxpdGVyYWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByZXZDaGFyID0gb3JpZy5jaGFyQXQob2Zmc2V0IC0gMSk7XG5cbiAgICAgICAgICBpZiAocHJldkNoYXIubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnfCcgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSB7XG4gICAgICAgICAgICBwcmVmaXggPSAnLic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGlmIHdlIGRvbid0IGhhdmUgYSBzZWxlY3RvciB0byBmb2xsb3cgdGhlIGF4aXNcbiAgICAgICAgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvZmZzZXQgKyBtYXRjaC5sZW5ndGggPT09IG9yaWcubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gJyonO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIHJldHVybiAnLy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgcmV0dXJuICcvJyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgJy9mb2xsb3dpbmctc2libGluZzo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJywnOlxuICAgICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIH1cbiAgICAgICAgICBheGlzID0gJy4vLyc7XG4gICAgICAgICAgcmV0dXJuICd8JyArIGF4aXMgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICdeJzogLy8gZmlyc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIV4nOiAvLyBsYXN0IGNoaWxkXG4gICAgICAgICAgcmV0dXJuICcvY2hpbGQ6OipbbGFzdCgpXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISAnOiAvLyBhbmNlc3Rvci1vci1zZWxmXG4gICAgICAgICAgcmV0dXJuICcvYW5jZXN0b3Itb3Itc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyE+JzogLy8gZGlyZWN0IHBhcmVudFxuICAgICAgICAgIHJldHVybiAnL3BhcmVudDo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyErJzogLy8gYWRqYWNlbnQgcHJlY2VkaW5nIHNpYmxpbmdcbiAgICAgICAgICByZXR1cm4gJy9wcmVjZWRpbmctc2libGluZzo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIX4nOiAvLyBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgICAgIC8vIGNhc2UgJ35+J1xuICAgICAgICAgICAgLy8gcmV0dXJuICcvZm9sbG93aW5nLXNpYmxpbmc6Oiovc2VsZjo6fCcrc2VsZWN0b3JTdGFydChvcmlnLCBvZmZzZXQpKycvcHJlY2VkaW5nLXNpYmxpbmc6Oiovc2VsZjo6JytsaXRlcmFsO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfYXR0cmlidXRlc19yZWdleCA9IC9cXFsoW15cXEBcXHxcXCpcXD1cXF5cXH5cXCRcXCFcXChcXC9cXHNcXHgxQy1cXHgxRl0rKVxccyooKFtcXHxcXCpcXH5cXF5cXCRcXCFdPyk9P1xccyooXFx4MUUrKSk/XFxdL2csXG4gICAgICBjc3NfYXR0cmlidXRlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIGF0dHIsIGNvbXAsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAocHJldkNoYXIgPT09ICcvJyB8fCAvLyBmb3VuZCBhZnRlciBhbiBheGlzIHNob3J0Y3V0IChcIi9cIiwgXCIvL1wiLCBldGMuKVxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICc6JykgICAvLyBmb3VuZCBhZnRlciBhbiBheGlzIChcInNlbGY6OlwiLCBcInBhcmVudDo6XCIsIGV0Yy4pXG4gICAgICAgICAgICBheGlzID0gJyonOyovXG5cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbbm90KEAnICsgYXR0ciArICcpIG9yIEAnICsgYXR0ciArICchPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3Vic3RyaW5nKEAnICsgYXR0ciArICcsc3RyaW5nLWxlbmd0aChAJyArIGF0dHIgKyAnKS0oc3RyaW5nLWxlbmd0aChcIicgKyB2YWwgKyAnXCIpLTEpKT1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW3N0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbY29udGFpbnMoY29uY2F0KFwiIFwiLG5vcm1hbGl6ZS1zcGFjZShAJyArIGF0dHIgKyAnKSxcIiBcIiksY29uY2F0KFwiIFwiLFwiJyArIHZhbCArICdcIixcIiBcIikpXSc7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhAJyArIGF0dHIgKyAnLFwiJyArIHZhbCArICdcIildJztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiIG9yIHN0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsY29uY2F0KFwiJyArIHZhbCArICdcIixcIi1cIikpXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGF0dHIuY2hhckF0KGF0dHIubGVuZ3RoIC0gMSkgPT09ICcoJyB8fCBhdHRyLnNlYXJjaCgvXlswLTldKyQvKSAhPT0gLTEgfHwgYXR0ci5pbmRleE9mKCc6JykgIT09IC0xKSAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnXSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4ID0gLzooW2EtelxcLV0rKShcXCgoXFx4MUYrKSgoW15cXHgxRl0rKFxcM1xceDFGKyk/KSopKFxcM1xcKSkpPy9nLFxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCBnMSwgZzIsIGFyZywgZzMsIGc0LCBnNSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIGlmIChvcmlnLmNoYXJBdChvZmZzZXQgLSAxKSA9PT0gJzonICYmIG9yaWcuY2hhckF0KG9mZnNldCAtIDIpICE9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIFhQYXRoIFwiYXhpczo6bm9kZS1uYW1lXCIgd2lsbCBtYXRjaFxuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIFwiOm5vZGUtbmFtZVwiXG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgPT09ICdvZGQnIHx8IG5hbWUgPT09ICdldmVuJykge1xuICAgICAgICAgIGFyZyAgPSBuYW1lO1xuICAgICAgICAgIG5hbWUgPSAnbnRoLW9mLXR5cGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChuYW1lKSB7IC8vIG5hbWUudG9Mb3dlckNhc2UoKT9cbiAgICAgICAgY2FzZSAnYWZ0ZXInOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3ByZWNlZGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYWZ0ZXItc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZSc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdiZWZvcmUtc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2NoZWNrZWQnOlxuICAgICAgICAgIHJldHVybiAnW0BzZWxlY3RlZCBvciBAY2hlY2tlZF0nO1xuICAgICAgICBjYXNlICdjb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2ljb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX2xvd2VyX2Nhc2UgKyAnLCcgKyB4cGF0aF90b19sb3dlcihhcmcpICsgJyldJztcbiAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgIHJldHVybiAnW25vdCgqKSBhbmQgbm90KG5vcm1hbGl6ZS1zcGFjZSgpKV0nO1xuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgICAgIHJldHVybiAnW0AnICsgbmFtZSArICddJztcbiAgICAgICAgY2FzZSAnZmlyc3QtY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnZmlyc3QnOlxuICAgICAgICBjYXNlICdsaW1pdCc6XG4gICAgICAgIGNhc2UgJ2ZpcnN0LW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAnZ3QnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbHQnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPCcgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbGFzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdvbmx5LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OiopIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktb2YtdHlwZSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKSBhbmQgbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKV0nO1xuICAgICAgICBjYXNlICdudGgtY2hpbGQnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgPSAnICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKGFyZykge1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0wXSc7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgbW9kIDI9MV0nO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgYSA9IChhcmcgfHwgJzAnKS5yZXBsYWNlKHJlZ2V4X250aF9lcXVhdGlvbiwgJyQxKyQyJykuc3BsaXQoJysnKTtcblxuICAgICAgICAgICAgYVswXSA9IGFbMF0gfHwgJzEnO1xuICAgICAgICAgICAgYVsxXSA9IGFbMV0gfHwgJzAnO1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKT49JyArIGFbMV0gKyAnIGFuZCAoKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKS0nICsgYVsxXSArICcpIG1vZCAnICsgYVswXSArICc9MF0nO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnbnRoLW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCkgbW9kIDI9MV0nO1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0wIGFuZCBwb3NpdGlvbigpPj0wXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPj0nICsgYVsxXSArICcgYW5kIChwb3NpdGlvbigpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdlcSc6XG4gICAgICAgIGNhc2UgJ250aCc6XG4gICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgcmV0dXJuICdbQHR5cGU9XCJ0ZXh0XCJdJztcbiAgICAgICAgY2FzZSAnaXN0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdzdGFydHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2llbmRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnWycgKyB4cGF0aF9lbmRzX3dpdGgoeHBhdGhfbG93ZXJfY2FzZSwgeHBhdGhfdG9fbG93ZXIoYXJnKSkgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2VuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9ub3JtYWxpemVfc3BhY2UsIGFyZykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2hhcyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gcHJlcGVuZEF4aXMoY3NzMnhwYXRoKGFyZywgdHJ1ZSksICcuLy8nKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtc2libGluZyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgeHBhdGggKyAnKSA+IDAgb3IgY291bnQoZm9sbG93aW5nLXNpYmxpbmc6OicgKyB4cGF0aC5zdWJzdHIoMTkpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1wYXJlbnQnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3BhcmVudDo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLWFuY2VzdG9yJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdhbmNlc3Rvcjo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnbGFzdCc6XG4gICAgICAgIGNhc2UgJ2xhc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT5sYXN0KCktJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3NlbGVjdGVkJzogLy8gU2l6emxlOiBcIihvcHRpb24pIGVsZW1lbnRzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZFwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwib3B0aW9uXCIgYW5kIEBzZWxlY3RlZF0nO1xuICAgICAgICBjYXNlICdza2lwJzpcbiAgICAgICAgY2FzZSAnc2tpcC1maXJzdCc6XG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT4nICsgYXJnICsgJ10nO1xuICAgICAgICBjYXNlICdza2lwLWxhc3QnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW2xhc3QoKS1wb3NpdGlvbigpPj0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPGxhc3QoKV0nO1xuICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvcjo6W2xhc3QoKV0nO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgdmFyIGFyciA9IGFyZy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgcmV0dXJuICdbJyArIGFyclswXSArICc8PXBvc2l0aW9uKCkgYW5kIHBvc2l0aW9uKCk8PScgKyBhcnJbMV0gKyAnXSc7XG4gICAgICAgIGNhc2UgJ2lucHV0JzogLy8gU2l6emxlOiBcImlucHV0LCBidXR0b24sIHNlbGVjdCwgYW5kIHRleHRhcmVhIGFyZSBhbGwgY29uc2lkZXJlZCB0byBiZSBpbnB1dCBlbGVtZW50cy5cIlxuICAgICAgICAgIHJldHVybiAnW2xvY2FsLW5hbWUoKT1cImlucHV0XCIgb3IgbG9jYWwtbmFtZSgpPVwiYnV0dG9uXCIgb3IgbG9jYWwtbmFtZSgpPVwic2VsZWN0XCIgb3IgbG9jYWwtbmFtZSgpPVwidGV4dGFyZWFcIl0nO1xuICAgICAgICBjYXNlICdpbnRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2ludGVybmFsO1xuICAgICAgICBjYXNlICdleHRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2V4dGVybmFsO1xuICAgICAgICBjYXNlICdodHRwJzpcbiAgICAgICAgY2FzZSAnaHR0cHMnOlxuICAgICAgICBjYXNlICdtYWlsdG8nOlxuICAgICAgICBjYXNlICdqYXZhc2NyaXB0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZixjb25jYXQoXCInICsgbmFtZSArICdcIixcIjpcIikpXSc7XG4gICAgICAgIGNhc2UgJ2RvbWFpbic6XG4gICAgICAgICAgcmV0dXJuICdbKHN0cmluZy1sZW5ndGgoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcpPTAgYW5kIGNvbnRhaW5zKCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnLCcgKyBhcmcgKyAnKSkgb3IgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJyxzdWJzdHJpbmctYWZ0ZXIoXCInICsgYXJnICsgJ1wiLFwiL1wiKSldJ1xuICAgICAgICBjYXNlICdub3QnOlxuICAgICAgICAgIHZhciB4cGF0aCA9IGNzczJ4cGF0aChhcmcsIHRydWUpO1xuXG4gICAgICAgICAgaWYgKHhwYXRoLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgeHBhdGggPSAnc2VsZjo6bm9kZSgpJyArIHhwYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tub3QoJyArIHhwYXRoICsgJyldJztcbiAgICAgICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZiwgXCIjXCIpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnYW5jZXN0b3Itb3Itc2VsZjo6KltsYXN0KCldJztcbiAgICAgICAgICAgIC8qIGNhc2UgJ2FjdGl2ZSc6XG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6XG4gICAgICAgICAgICBjYXNlICdob3Zlcic6XG4gICAgICAgICAgICBjYXNlICdsaW5rJzpcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnJzsqL1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tAbGFuZz1cIicgKyBhcmcgKyAnXCJdJztcbiAgICAgICAgY2FzZSAncmVhZC1vbmx5JzpcbiAgICAgICAgY2FzZSAncmVhZC13cml0ZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lLnJlcGxhY2UoJy0nLCAnJykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3ZhbGlkJzpcbiAgICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICBjYXNlICdpbi1yYW5nZSc6XG4gICAgICAgIGNhc2UgJ291dC1vZi1yYW5nZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX2lkc19jbGFzc2VzX3JlZ2V4ID0gLygjfFxcLikoW15cXCNcXEBcXC5cXC9cXChcXFtcXClcXF1cXHxcXDpcXHNcXCtcXD5cXDxcXCdcXFwiXFx4MUQtXFx4MUZdKykvZyxcbiAgICAgIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICAvKiB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQtMSk7XG4gICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnLycgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnKCcpXG4gICAgICAgICAgICBheGlzID0gJyonO1xuICAgICAgICBlbHNlIGlmIChwcmV2Q2hhciA9PT0gJzonKVxuICAgICAgICAgICAgYXhpcyA9ICdub2RlKCknOyovXG4gICAgICAgIGlmIChvcCA9PT0gJyMnKSAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQGlkPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEBjbGFzcyksXCIgXCIpLFwiICcgKyB2YWwgKyAnIFwiKV0nO1xuICAgICAgfTtcblxuICAgIC8vIFByZXBlbmQgZGVzY2VuZGFudC1vci1zZWxmIGlmIG5vIG90aGVyIGF4aXMgaXMgc3BlY2lmaWVkXG4gIGZ1bmN0aW9uIHByZXBlbmRBeGlzKHMsIGF4aXMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlZ2V4X2ZpcnN0X2F4aXMsIGZ1bmN0aW9uIChtYXRjaCwgc3RhcnQsIGxpdGVyYWwpIHtcbiAgICAgIGlmIChsaXRlcmFsLnN1YnN0cihsaXRlcmFsLmxlbmd0aCAtIDIpID09PSAnOjonKSAvLyBBbHJlYWR5IGhhcyBheGlzOjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuXG4gICAgICBpZiAobGl0ZXJhbC5jaGFyQXQoMCkgPT09ICdbJykgICAgICAgICAgICB7XG4gICAgICAgIGF4aXMgKz0gJyonO1xuICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChheGlzLmNoYXJBdChheGlzLmxlbmd0aC0xKSA9PT0gJyknKVxuICAgICAgICAvLyAgICBheGlzICs9ICcvJztcbiAgICAgIHJldHVybiBzdGFydCArIGF4aXMgKyBsaXRlcmFsO1xuICAgIH0pO1xuICB9XG5cbiAgICAvLyBGaW5kIHRoZSBiZWdpbmluZyBvZiB0aGUgc2VsZWN0b3IsIHN0YXJ0aW5nIGF0IGkgYW5kIHdvcmtpbmcgYmFja3dhcmRzXG4gIGZ1bmN0aW9uIHNlbGVjdG9yU3RhcnQocywgaSkge1xuICAgIHZhciBkZXB0aCA9IDA7XG4gICAgdmFyIG9mZnNldCA9IDA7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBzd2l0Y2ggKHMuY2hhckF0KGkpKSB7XG4gICAgICBjYXNlICcgJzpcbiAgICAgIGNhc2UgZXNjYXBlX3BhcmVuczpcbiAgICAgICAgb2Zmc2V0Kys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWyc6XG4gICAgICBjYXNlICcoJzpcbiAgICAgICAgZGVwdGgtLTtcblxuICAgICAgICBpZiAoZGVwdGggPCAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICddJzpcbiAgICAgIGNhc2UgJyknOlxuICAgICAgICBkZXB0aCsrO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJywnOlxuICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGlmIChkZXB0aCA9PT0gMCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gKytpICsgb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgICAvLyBDaGVjayBpZiBzdHJpbmcgaXMgbnVtZXJpY1xuICBmdW5jdGlvbiBpc051bWVyaWMocykge1xuICAgIHZhciBudW0gPSBwYXJzZUludChzLCAxMCk7XG5cbiAgICByZXR1cm4gKCFpc05hTihudW0pICYmICcnICsgbnVtID09PSBzKTtcbiAgfVxuXG4gICAgLy8gQXBwZW5kIGVzY2FwZSBcImNoYXJcIiB0byBcIm9wZW5cIiBvciBcImNsb3NlXCJcbiAgZnVuY3Rpb24gZXNjYXBlQ2hhcihzLCBvcGVuLCBjbG9zZSwgY2hhcikge1xuICAgIHZhciBkZXB0aCA9IDA7XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXFxcJyArIG9wZW4gKyAnXFxcXCcgKyBjbG9zZSArICddJywgJ2cnKSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgIGlmIChhID09PSBvcGVuKSAgICAgICAgICAgIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGEgPT09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIGEgKyByZXBlYXQoY2hhciwgZGVwdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlcGVhdChjaGFyLCBkZXB0aC0tKSArIGE7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGVhdChzdHIsIG51bSkge1xuICAgIG51bSA9IE51bWJlcihudW0pO1xuICAgIHZhciByZXN1bHQgPSAnJztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAobnVtICYgMSkgICAgICAgICAgICB7XG4gICAgICAgIHJlc3VsdCArPSBzdHI7XG4gICAgICB9XG4gICAgICBudW0gPj4+PSAxO1xuXG4gICAgICBpZiAobnVtIDw9IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzdHIgKz0gc3RyO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0RXNjYXBpbmcgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1xcXFwoW2BcXFxcLzpcXD8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XSkvZywgJyQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcKFsnXCJdKS9nLCAnJDEkMScpXG4gICAgICAucmVwbGFjZSgvXFxcXEEgL2csICdcXG4nKVxuICB9XG5cbiAgZnVuY3Rpb24gY3NzMnhwYXRoKHMsIG5lc3RlZCkge1xuICAgIC8vIHMgPSBzLnRyaW0oKTtcblxuICAgIGlmIChuZXN0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICAvLyBUYWcgb3BlbiBhbmQgY2xvc2UgcGFyZW50aGVzaXMgcGFpcnMgKGZvciBSZWdFeHAgc2VhcmNoZXMpXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJygnLCAnKScsIGVzY2FwZV9wYXJlbnMpO1xuXG4gICAgLy8gUmVtb3ZlIGFuZCBzYXZlIGFueSBzdHJpbmcgbGl0ZXJhbHNcbiAgICB2YXIgbGl0ZXJhbHMgPSBbXTtcblxuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3RyaW5nX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICBpZiAoYS5jaGFyQXQoMCkgPT09ICc9Jykge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSkudHJpbSgpO1xuXG4gICAgICAgIGlmIChpc051bWVyaWMoYSkpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IGEuc3Vic3RyKDEsIGEubGVuZ3RoIC0gMik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBlYXQoZXNjYXBlX2xpdGVyYWwsIGxpdGVyYWxzLnB1c2goY29udmVydEVzY2FwaW5nKGEpKSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBjb21iaW5hdG9ycyAoXCIgXCIsIFwiK1wiLCBcIj5cIiwgXCJ+XCIsIFwiLFwiKSBhbmQgcmV2ZXJzZSBjb21iaW5hdG9ycyAoXCIhXCIsIFwiIStcIiwgXCIhPlwiLCBcIiF+XCIpXG4gICAgcyA9IHMucmVwbGFjZShjc3NfY29tYmluYXRvcnNfcmVnZXgsIGNzc19jb21iaW5hdG9yc19jYWxsYmFjayk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBhdHRyaWJ1dGUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2F0dHJpYnV0ZXNfcmVnZXgsIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrKTtcblxuICAgIC8vIFdyYXAgY2VydGFpbiA6cHNldWRvLWNsYXNzZXMgaW4gcGFyZW5zICh0byBjb2xsZWN0IG5vZGUtc2V0cylcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGluZGV4ID0gcy5zZWFyY2gocmVnZXhfY3NzX3dyYXBfcHNldWRvKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gcy5pbmRleE9mKCc6JywgaW5kZXgpO1xuICAgICAgdmFyIHN0YXJ0ID0gc2VsZWN0b3JTdGFydChzLCBpbmRleCk7XG5cbiAgICAgIHMgPSBzLnN1YnN0cigwLCBzdGFydCkgK1xuICAgICAgICAgICAgJygnICsgcy5zdWJzdHJpbmcoc3RhcnQsIGluZGV4KSArICcpJyArXG4gICAgICAgICAgICBzLnN1YnN0cihpbmRleCk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCwgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19pZHNfY2xhc3Nlc19yZWdleCwgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIHNhdmVkIHN0cmluZyBsaXRlcmFsc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZXNjYXBlZF9saXRlcmFsLCBmdW5jdGlvbiAocywgYSkge1xuICAgICAgdmFyIHN0ciA9IGxpdGVyYWxzW2EubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiAnXCInICsgc3RyICsgJ1wiJztcbiAgICB9KVxuXG4gICAgLy8gUmVtb3ZlIGFueSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X3NwZWNhbF9jaGFycywgJycpO1xuXG4gICAgLy8gYWRkICogdG8gc3RhbmQtYWxvbmUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZmlsdGVyX3ByZWZpeCwgJyQxKlsnKTtcblxuICAgIC8vIGFkZCBcIi9cIiBiZXR3ZWVuIEBhdHRyaWJ1dGUgc2VsZWN0b3JzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9hdHRyX3ByZWZpeCwgJyQxL0AnKTtcblxuICAgIC8qXG4gICAgQ29tYmluZSBtdWx0aXBsZSBmaWx0ZXJzP1xuXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJ1snLCAnXScsIGZpbHRlcl9jaGFyKTtcbiAgICBzID0gcy5yZXBsYWNlKC8oXFx4MUQrKVxcXVxcW1xcMSguKz9bXlxceDFEXSlcXDFcXF0vZywgJyBhbmQgKCQyKSQxXScpXG4gICAgKi9cblxuICAgIHMgPSBwcmVwZW5kQXhpcyhzLCAnLi8vJyk7IC8vIHByZXBlbmQgXCIuLy9cIiBheGlzIHRvIGJlZ2luaW5nIG9mIENTUyBzZWxlY3RvclxuICAgIHJldHVybiBzO1xuICB9XG5cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY3NzMnhwYXRoO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5jc3MyeHBhdGggPSBjc3MyeHBhdGg7XG4gIH1cblxufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzMnhwYXRoL2luZGV4LmpzIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmUgc2VsZWN0b3IgZm9yIGEgbm9kZS5cbiAqL1xuXG5pbXBvcnQgeyBlc2NhcGVWYWx1ZSB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMpIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50LFxuICAgIHNraXAgPSBudWxsLFxuICAgIHByaW9yaXR5ID0gWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZSA9IHt9XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGlnbm9yZVt0eXBlXVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnZnVuY3Rpb24nKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZS50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgcHJlZGljYXRlID0gbmV3IFJlZ0V4cChlc2NhcGVWYWx1ZShwcmVkaWNhdGUpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZSA/IC8oPzopLyA6IC8uXi9cbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gKG5hbWUsIHZhbHVlKSA9PiBwcmVkaWNhdGUudGVzdCh2YWx1ZSlcbiAgfSlcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxMSkge1xuICAgIGlmIChza2lwQ2hlY2tzKGVsZW1lbnQpICE9PSB0cnVlKSB7XG4gICAgICAvLyB+IGdsb2JhbFxuICAgICAgaWYgKGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCByb290KSkgYnJlYWtcbiAgICAgIGlmIChjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHJvb3QpKSBicmVha1xuXG4gICAgICAvLyB+IGxvY2FsXG4gICAgICBjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIH1cblxuICAgICAgLy8gZGVmaW5lIG9ubHkgb25lIHBhcnQgZWFjaCBpdGVyYXRpb25cbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrQ2hpbGRzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKVxuICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXJlbnQpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmc/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENsYXNzU2VsZWN0b3IoY2xhc3NlcyA9IFtdLCBwYXJlbnQpIHtcbiAgbGV0IHJlc3VsdCA9IFtbXV07XG5cbiAgY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uKGMpIHtcbiAgICByZXN1bHQuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgICByZXN1bHQucHVzaChyLmNvbmNhdCgnLicgKyBjKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJlc3VsdC5zaGlmdCgpO1xuXG4gIHJlc3VsdCA9IHJlc3VsdC5zb3J0KGZ1bmN0aW9uKGEsYikgeyByZXR1cm4gYS5sZW5ndGggLSBiLmxlbmd0aDsgfSk7XG5cbiAgZm9yKGxldCBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7IGkrKykge1xuICAgIGxldCByID0gcmVzdWx0W2ldLmpvaW4oJycpO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChyKTtcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIExvb2t1cCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICB2YXIgYXR0cmlidXRlTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5tYXAoKHZhbCkgPT4gYXR0cmlidXRlc1t2YWxdLm5hbWUpXG4gICAgLmZpbHRlcigoYSkgPT4gcHJpb3JpdHkuaW5kZXhPZihhKSA8IDApO1xuXG4gIHZhciBzb3J0ZWRLZXlzID0gWyAuLi5wcmlvcml0eSwgLi4uYXR0cmlidXRlTmFtZXMgXTtcblxuICB2YXIgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc29ydGVkS2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBzb3J0ZWRLZXlzW2ldXG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGUubmFtZSlcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGUudmFsdWUpXG4gICAgY29uc3QgdXNlTmFtZWRJZ25vcmUgPSBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnXG5cbiAgICBjb25zdCBjdXJyZW50SWdub3JlID0gKHVzZU5hbWVkSWdub3JlICYmIGlnbm9yZVthdHRyaWJ1dGVOYW1lXSkgfHwgaWdub3JlLmF0dHJpYnV0ZVxuICAgIGNvbnN0IGN1cnJlbnREZWZhdWx0SWdub3JlID0gKHVzZU5hbWVkSWdub3JlICYmIGRlZmF1bHRJZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlXG4gICAgaWYgKGNoZWNrSWdub3JlKGN1cnJlbnRJZ25vcmUsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlLCBjdXJyZW50RGVmYXVsdElnbm9yZSkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgdmFyIHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICBpZighYXR0cmlidXRlVmFsdWUudHJpbSgpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2lkJykge1xuICAgICAgcGF0dGVybiA9IGAjJHthdHRyaWJ1dGVWYWx1ZX1gXG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgIGxldCBjbGFzc05hbWVzID0gYXR0cmlidXRlVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpXG4gICAgICBjb25zdCBjbGFzc0lnbm9yZSA9IGlnbm9yZS5jbGFzcyB8fCBkZWZhdWx0SWdub3JlLmNsYXNzXG4gICAgICBpZiAoY2xhc3NJZ25vcmUpIHtcbiAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3NJZ25vcmUoY2xhc3NOYW1lKSlcbiAgICAgIH1cbiAgICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgcGF0dGVybiA9IGdldENsYXNzU2VsZWN0b3IoY2xhc3NOYW1lcywgcGFyZW50KVxuXG4gICAgICBpZiAoIXBhdHRlcm4pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFnTmFtZSArIHBhdHRlcm5cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBsZXQgbWF0Y2hlcyA9IFtdO1xuICAgIG1hdGNoZXMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICBpZiAocGF0dGVybiA9PT0gJ2lmcmFtZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRUYWdQYXR0ZXJuIChlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBOT1RFOiAnY2hpbGRUYWdzJyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYXMgYSB2aWV3IGZpbHRlciBmb3IgdGFncyB1c2luZyAnYWRhcHRlci5qcydcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGRzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZFRhZ3MgfHwgcGFyZW50LmNoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZCA9PT0gZWxlbWVudCkge1xuICAgICAgY29uc3QgY2hpbGRQYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGNoaWxkLCBpZ25vcmUpXG4gICAgICBpZiAoIWNoaWxkUGF0dGVybikge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgICAgICBFbGVtZW50IGNvdWxkblxcJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY29uc3QgcGF0dGVybiA9IGA+ICR7Y2hpbGRQYXR0ZXJufTpudGgtY2hpbGQoJHtpKzF9KWBcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKSB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lnbm9yZSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCJleHBvcnQgc2VsZWN0LCB7IGdldFNpbmdsZVNlbGVjdG9yLCBnZXRNdWx0aVNlbGVjdG9yIH0gZnJvbSAnLi9zZWxlY3QnXG5leHBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmV4cG9ydCAqIGFzIGNvbW1vbiBmcm9tICcuL2NvbW1vbidcblxuZXhwb3J0IGRlZmF1bHQgZnJvbSAnLi9zZWxlY3QnXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiXSwic291cmNlUm9vdCI6IiJ9