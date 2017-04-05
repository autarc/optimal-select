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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

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

  if (CSS.escape) {
    return value && CSS.escape(value);
  }

  return value && value.replace(/['"`\\/:\?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '\A');
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

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
  if (/\.\S+\.\S+/.test(current)) {
    var names = current.trim().split('.').slice(1).map(function (name) {
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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

      // id: '#'
      case /^#/.test(type):
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

      // universal: '*'
      case /\*/.test(type):
        validate = function validate(node) {
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
  return getSingleSelector(input, options);
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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
  var ignoreClass = false;

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
    if (type === 'class') {
      ignoreClass = true;
    }
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

  if (ignoreClass) {
    var ignoreAttribute = ignore.attribute;
    ignore.attribute = function (name, value, defaultPredicate) {
      return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate);
    };
  }

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

    var currentIgnore = ignore[attributeName] || ignore.attribute;
    var currentDefaultIgnore = defaultIgnore[attributeName] || defaultIgnore.attribute;
    if (checkIgnore(currentIgnore, attributeName, attributeValue, currentDefaultIgnore)) {
      continue;
    }

    var pattern = '[' + attributeName + '="' + attributeValue + '"]';

    if (/\b\d/.test(attributeValue) === false) {
      if (attributeName === 'id') {
        pattern = '#' + attributeValue;
      }

      if (attributeName === 'class') {
        var className = attributeValue.trim().replace(/\s+/g, '.');
        pattern = '.' + className;
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

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxMmM2NDlhYmYyMjJjZGFkYjljZSIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWF0Y2guanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0IiwiZXNjYXBlVmFsdWUiLCJub2RlcyIsImxlbmd0aCIsImFyciIsIkFycmF5IiwiaSIsInZhbHVlIiwiQ1NTIiwiZXNjYXBlIiwicmVwbGFjZSIsImdldENvbW1vbkFuY2VzdG9yIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImVsZW1lbnRzIiwib3B0aW9ucyIsInJvb3QiLCJkb2N1bWVudCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwicGFyZW50IiwibWlzc2luZyIsInNvbWUiLCJvdGhlclBhcmVudHMiLCJvdGhlclBhcmVudCIsImwiLCJjb21tb25Qcm9wZXJ0aWVzIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJ0YWciLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwibmFtZSIsImVsZW1lbnRBdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImtleSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIm9wdGltaXplIiwic2VsZWN0b3IiLCJpc0FycmF5Iiwibm9kZVR5cGUiLCJFcnJvciIsImdsb2JhbE1vZGlmaWVkIiwicGF0aCIsIm9wdGltaXplUGFydCIsInNob3J0ZW5lZCIsInBvcCIsImN1cnJlbnQiLCJwcmVQYXJ0Iiwiam9pbiIsInBvc3RQYXJ0IiwicGF0dGVybiIsIm1hdGNoZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwic2xpY2UiLCJ0ZXN0IiwiY29tcGFyZVJlc3VsdHMiLCJyZWZlcmVuY2VzIiwicmVmZXJlbmNlIiwiY29udGFpbnMiLCJkZXNjcmlwdGlvbiIsImRlc2NlbmRhbnQiLCJ0eXBlIiwibmFtZXMiLCJtYXAiLCJwYXJ0aWFsIiwiY2hhckF0IiwibWF0Y2giLCJldmVyeSIsImFkYXB0IiwiZ2xvYmFsIiwiY29udGV4dCIsIkVsZW1lbnRQcm90b3R5cGUiLCJnZXRQcm90b3R5cGVPZiIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsImNoaWxkcmVuIiwibm9kZSIsImF0dHJpYnMiLCJOYW1lZE5vZGVNYXAiLCJjb25maWd1cmFibGUiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsIkhUTUxDb2xsZWN0aW9uIiwidHJhdmVyc2VEZXNjZW5kYW50cyIsImNoaWxkVGFncyIsInB1c2giLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwiZGVzY2VuZGFudENsYXNzTmFtZSIsImNsYXNzIiwiaW5kZXhPZiIsInNlbGVjdG9ycyIsImluc3RydWN0aW9ucyIsImdldEluc3RydWN0aW9ucyIsImRpc2NvdmVyIiwidG90YWwiLCJzdGVwIiwiaW5jbHVzaXZlIiwiZG9uZSIsInJldmVyc2UiLCJwc2V1ZG8iLCJ2YWxpZGF0ZSIsImluc3RydWN0aW9uIiwiY2hlY2tQYXJlbnQiLCJzdWJzdHIiLCJub2RlQ2xhc3NOYW1lIiwiY2hlY2tDbGFzcyIsImdldEFuY2VzdG9yIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJoYXNBdHRyaWJ1dGUiLCJjaGVja0F0dHJpYnV0ZSIsIk5vZGVMaXN0IiwiaWQiLCJjaGVja0lkIiwiY2hlY2tVbml2ZXJzYWwiLCJjaGVja1RhZyIsInJ1bGUiLCJraW5kIiwicGFyc2VJbnQiLCJ2YWxpZGF0ZVBzZXVkbyIsImNvbXBhcmVTZXQiLCJub2RlSW5kZXgiLCJmaW5kSW5kZXgiLCJjaGlsZCIsImVuaGFuY2VJbnN0cnVjdGlvbiIsIm1hdGNoZWROb2RlIiwiaGFuZGxlciIsInByb2dyZXNzIiwiZ2V0U2luZ2xlU2VsZWN0b3IiLCJnZXRNdWx0aVNlbGVjdG9yIiwiZ2V0UXVlcnlTZWxlY3RvciIsIm9wdGltaXplZCIsImFuY2VzdG9yU2VsZWN0b3IiLCJjb21tb25TZWxlY3RvcnMiLCJnZXRDb21tb25TZWxlY3RvcnMiLCJkZXNjZW5kYW50U2VsZWN0b3IiLCJzZWxlY3Rvck1hdGNoZXMiLCJjb25zb2xlIiwid2FybiIsInNlbGVjdG9yUGF0aCIsImNsYXNzU2VsZWN0b3IiLCJhdHRyaWJ1dGVTZWxlY3RvciIsInBhcnRzIiwiaW5wdXQiLCJzZWxlY3QiLCJjb21tb24iLCJkZWZhdWx0IiwiZGVmYXVsdElnbm9yZSIsInNraXAiLCJwcmlvcml0eSIsImlnbm9yZSIsImlnbm9yZUNsYXNzIiwic2tpcENvbXBhcmUiLCJza2lwQ2hlY2tzIiwiY29tcGFyZSIsInByZWRpY2F0ZSIsInRvU3RyaW5nIiwiUmVnRXhwIiwiaWdub3JlQXR0cmlidXRlIiwiZGVmYXVsdFByZWRpY2F0ZSIsImNoZWNrQXR0cmlidXRlcyIsImNoZWNrQ2hpbGRzIiwiZmluZFBhdHRlcm4iLCJmaW5kQXR0cmlidXRlc1BhdHRlcm4iLCJzb3J0ZWRLZXlzIiwiY3VyclBvcyIsIm5leHRQb3MiLCJjdXJyZW50SWdub3JlIiwiY3VycmVudERlZmF1bHRJZ25vcmUiLCJjaGVja0lnbm9yZSIsImZpbmRUYWdQYXR0ZXJuIiwiY2hpbGRQYXR0ZXJuIiwiY2hlY2siXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztRQ3BEZ0JBLGUsR0FBQUEsZTtRQWlCQUMsVyxHQUFBQSxXO0FBN0JoQjs7Ozs7O0FBTUE7Ozs7OztBQU1PLFNBQVNELGVBQVQsQ0FBeUJFLEtBQXpCLEVBQWdDO0FBQUEsTUFDN0JDLE1BRDZCLEdBQ2xCRCxLQURrQixDQUM3QkMsTUFENkI7O0FBRXJDLE1BQU1DLE1BQU0sSUFBSUMsS0FBSixDQUFVRixNQUFWLENBQVo7QUFDQSxPQUFLLElBQUlHLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsTUFBcEIsRUFBNEJHLEdBQTVCLEVBQWlDO0FBQy9CRixRQUFJRSxDQUFKLElBQVNKLE1BQU1JLENBQU4sQ0FBVDtBQUNEO0FBQ0QsU0FBT0YsR0FBUDtBQUNEOztBQUVEOzs7Ozs7OztBQVFPLFNBQVNILFdBQVQsQ0FBcUJNLEtBQXJCLEVBQTRCOztBQUVqQyxN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U0EsU0FBU3lILFdBQVQsQ0FBc0JkLFNBQXRCLEVBQWlDdEksSUFBakMsRUFBdUMxQyxLQUF2QyxFQUE4Q29MLGdCQUE5QyxFQUFnRTtBQUM5RCxNQUFJLENBQUNwTCxLQUFMLEVBQVk7QUFDVixXQUFPLElBQVA7QUFDRDtBQUNELE1BQU1pTSxRQUFRakIsYUFBYUksZ0JBQTNCO0FBQ0EsTUFBSSxDQUFDYSxLQUFMLEVBQVk7QUFDVixXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU9BLE1BQU12SixJQUFOLEVBQVkxQyxLQUFaLEVBQW1Cb0wsZ0JBQW5CLENBQVA7QUFDRCIsImZpbGUiOiJvcHRpbWFsLXNlbGVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiT3B0aW1hbFNlbGVjdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxMmM2NDlhYmYyMjJjZGFkYjljZSIsIi8qKlxuICogIyBVdGlsaXRpZXNcbiAqXG4gKiBDb252ZW5pZW5jZSBoZWxwZXJzLlxuICovXG5cbi8qKlxuICogQ3JlYXRlIGFuIGFycmF5IHdpdGggdGhlIERPTSBub2RlcyBvZiB0aGUgbGlzdFxuICpcbiAqIEBwYXJhbSAge05vZGVMaXN0fSAgICAgICAgICAgICBub2RlcyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0FycmF5LjxIVE1MRWxlbWVudD59ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnROb2RlTGlzdChub2Rlcykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbm9kZXNcbiAgY29uc3QgYXJyID0gbmV3IEFycmF5KGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGFycltpXSA9IG5vZGVzW2ldXG4gIH1cbiAgcmV0dXJuIGFyclxufVxuXG4vKipcbiAqIEVzY2FwZSBzcGVjaWFsIGNoYXJhY3RlcnMgYW5kIGxpbmUgYnJlYWtzIGFzIGEgc2ltcGxpZmllZCB2ZXJzaW9uIG9mICdDU1MuZXNjYXBlKCknXG4gKlxuICogRGVzY3JpcHRpb24gb2YgdmFsaWQgY2hhcmFjdGVyczogaHR0cHM6Ly9tYXRoaWFzYnluZW5zLmJlL25vdGVzL2Nzcy1lc2NhcGVzXG4gKlxuICogQHBhcmFtICB7U3RyaW5nP30gdmFsdWUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVZhbHVlKHZhbHVlKSB7XG5cbiAgaWYgKENTUy5lc2NhcGUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgQ1NTLmVzY2FwZSh2YWx1ZSk7XG4gIH1cblxuICByZXR1cm4gdmFsdWUgJiYgdmFsdWUucmVwbGFjZSgvWydcImBcXFxcLzpcXD8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XS9nLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvXFxuL2csICdcXEEnKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxpdGllcy5qcyIsIi8qKlxuICogIyBDb21tb25cbiAqXG4gKiBQcm9jZXNzIGNvbGxlY3Rpb25zIGZvciBzaW1pbGFyaXRpZXMuXG4gKi9cblxuLyoqXG4gKiBGaW5kIHRoZSBsYXN0IGNvbW1vbiBhbmNlc3RvciBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudHM+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vbkFuY2VzdG9yIChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IGFuY2VzdG9ycyA9IFtdXG5cbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwYXJlbnRzID0gW11cbiAgICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCkge1xuICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgICAgcGFyZW50cy51bnNoaWZ0KGVsZW1lbnQpXG4gICAgfVxuICAgIGFuY2VzdG9yc1tpbmRleF0gPSBwYXJlbnRzXG4gIH0pXG5cbiAgYW5jZXN0b3JzLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG5cbiAgY29uc3Qgc2hhbGxvd0FuY2VzdG9yID0gYW5jZXN0b3JzLnNoaWZ0KClcblxuICB2YXIgYW5jZXN0b3IgPSBudWxsXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzaGFsbG93QW5jZXN0b3IubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgcGFyZW50ID0gc2hhbGxvd0FuY2VzdG9yW2ldXG4gICAgY29uc3QgbWlzc2luZyA9IGFuY2VzdG9ycy5zb21lKChvdGhlclBhcmVudHMpID0+IHtcbiAgICAgIHJldHVybiAhb3RoZXJQYXJlbnRzLnNvbWUoKG90aGVyUGFyZW50KSA9PiBvdGhlclBhcmVudCA9PT0gcGFyZW50KVxuICAgIH0pXG5cbiAgICBpZiAobWlzc2luZykge1xuICAgICAgLy8gVE9ETzogZmluZCBzaW1pbGFyIHN1Yi1wYXJlbnRzLCBub3QgdGhlIHRvcCByb290LCBlLmcuIHNoYXJpbmcgYSBjbGFzcyBzZWxlY3RvclxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICBhbmNlc3RvciA9IHBhcmVudFxuICB9XG5cbiAgcmV0dXJuIGFuY2VzdG9yXG59XG5cbi8qKlxuICogR2V0IGEgc2V0IG9mIGNvbW1vbiBwcm9wZXJ0aWVzIG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1vblByb3BlcnRpZXMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgY29tbW9uUHJvcGVydGllcyA9IHtcbiAgICBjbGFzc2VzOiBbXSxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICB0YWc6IG51bGxcbiAgfVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcblxuICAgIHZhciB7XG4gICAgICBjbGFzc2VzOiBjb21tb25DbGFzc2VzLFxuICAgICAgYXR0cmlidXRlczogY29tbW9uQXR0cmlidXRlcyxcbiAgICAgIHRhZzogY29tbW9uVGFnXG4gICAgfSA9IGNvbW1vblByb3BlcnRpZXNcblxuICAgIC8vIH4gY2xhc3Nlc1xuICAgIGlmIChjb21tb25DbGFzc2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJylcbiAgICAgIGlmIChjbGFzc2VzKSB7XG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc2VzLnRyaW0oKS5zcGxpdCgnICcpXG4gICAgICAgIGlmICghY29tbW9uQ2xhc3Nlcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjbGFzc2VzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQ2xhc3NlcyA9IGNvbW1vbkNsYXNzZXMuZmlsdGVyKChlbnRyeSkgPT4gY2xhc3Nlcy5zb21lKChuYW1lKSA9PiBuYW1lID09PSBlbnRyeSkpXG4gICAgICAgICAgaWYgKGNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXMgPSBjb21tb25DbGFzc2VzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHJlc3RydWN0dXJlIHJlbW92YWwgYXMgMnggc2V0IC8gMnggZGVsZXRlLCBpbnN0ZWFkIG9mIG1vZGlmeSBhbHdheXMgcmVwbGFjaW5nIHdpdGggbmV3IGNvbGxlY3Rpb25cbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuY2xhc3Nlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gYXR0cmlidXRlc1xuICAgIGlmIChjb21tb25BdHRyaWJ1dGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnRBdHRyaWJ1dGVzID0gZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmtleXMoZWxlbWVudEF0dHJpYnV0ZXMpLnJlZHVjZSgoYXR0cmlidXRlcywga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGVsZW1lbnRBdHRyaWJ1dGVzW2tleV1cbiAgICAgICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgICAgIC8vIE5PVEU6IHdvcmthcm91bmQgZGV0ZWN0aW9uIGZvciBub24tc3RhbmRhcmQgcGhhbnRvbWpzIE5hbWVkTm9kZU1hcCBiZWhhdmlvdXJcbiAgICAgICAgLy8gKGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vYXJpeWEvcGhhbnRvbWpzL2lzc3Vlcy8xNDYzNClcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSAmJiBhdHRyaWJ1dGVOYW1lICE9PSAnY2xhc3MnKSB7XG4gICAgICAgICAgYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9IGF0dHJpYnV0ZS52YWx1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICB9LCB7fSlcblxuICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcylcbiAgICAgIGNvbnN0IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGNvbW1vbkF0dHJpYnV0ZXMpXG5cbiAgICAgIGlmIChhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICghY29tbW9uQXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21tb25BdHRyaWJ1dGVzID0gY29tbW9uQXR0cmlidXRlc05hbWVzLnJlZHVjZSgobmV4dENvbW1vbkF0dHJpYnV0ZXMsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gY29tbW9uQXR0cmlidXRlc1tuYW1lXVxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBhdHRyaWJ1dGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgIG5leHRDb21tb25BdHRyaWJ1dGVzW25hbWVdID0gdmFsdWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXh0Q29tbW9uQXR0cmlidXRlc1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMuYXR0cmlidXRlc1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIH4gdGFnXG4gICAgaWYgKGNvbW1vblRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCB0YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgaWYgKCFjb21tb25UYWcpIHtcbiAgICAgICAgY29tbW9uUHJvcGVydGllcy50YWcgPSB0YWdcbiAgICAgIH0gZWxzZSBpZiAodGFnICE9PSBjb21tb25UYWcpIHtcbiAgICAgICAgZGVsZXRlIGNvbW1vblByb3BlcnRpZXMudGFnXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBjb21tb25Qcm9wZXJ0aWVzXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tbW9uLmpzIiwiLyoqXG4gKiAjIE9wdGltaXplXG4gKlxuICogMS4pIEltcHJvdmUgZWZmaWNpZW5jeSB0aHJvdWdoIHNob3J0ZXIgc2VsZWN0b3JzIGJ5IHJlbW92aW5nIHJlZHVuZGFuY3lcbiAqIDIuKSBJbXByb3ZlIHJvYnVzdG5lc3MgdGhyb3VnaCBzZWxlY3RvciB0cmFuc2Zvcm1hdGlvblxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IHsgY29udmVydE5vZGVMaXN0IH0gZnJvbSAnLi91dGlsaXRpZXMnXG5cbi8qKlxuICogQXBwbHkgZGlmZmVyZW50IG9wdGltaXphdGlvbiB0ZWNobmlxdWVzXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChzZWxlY3RvciwgZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIC8vIGNvbnZlcnQgc2luZ2xlIGVudHJ5IGFuZCBOb2RlTGlzdFxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSAhZWxlbWVudHMubGVuZ3RoID8gW2VsZW1lbnRzXSA6IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmICghZWxlbWVudHMubGVuZ3RoIHx8IGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gdG8gY29tcGFyZSBIVE1MRWxlbWVudHMgaXRzIG5lY2Vzc2FyeSB0byBwcm92aWRlIGEgcmVmZXJlbmNlIG9mIHRoZSBzZWxlY3RlZCBub2RlKHMpISAobWlzc2luZyBcImVsZW1lbnRzXCIpYClcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG5cbiAgLy8gY2h1bmsgcGFydHMgb3V0c2lkZSBvZiBxdW90ZXMgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI1NjYzNzI5KVxuICB2YXIgcGF0aCA9IHNlbGVjdG9yLnJlcGxhY2UoLz4gL2csICc+Jykuc3BsaXQoL1xccysoPz0oPzooPzpbXlwiXSpcIil7Mn0pKlteXCJdKiQpLylcblxuICBpZiAocGF0aC5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIG9wdGltaXplUGFydCgnJywgc2VsZWN0b3IsICcnLCBlbGVtZW50cylcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lZCA9IFtwYXRoLnBvcCgpXVxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSAge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoLnBvcCgpXG4gICAgY29uc3QgcHJlUGFydCA9IHBhdGguam9pbignICcpXG4gICAgY29uc3QgcG9zdFBhcnQgPSBzaG9ydGVuZWQuam9pbignICcpXG5cbiAgICBjb25zdCBwYXR0ZXJuID0gYCR7cHJlUGFydH0gJHtwb3N0UGFydH1gXG4gICAgY29uc3QgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IGVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgc2hvcnRlbmVkLnVuc2hpZnQob3B0aW1pemVQYXJ0KHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cykpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLmpvaW4oJyAnKSwgZWxlbWVudHMpXG4gIHBhdGhbcGF0aC5sZW5ndGgtMV0gPSBvcHRpbWl6ZVBhcnQocGF0aC5zbGljZSgwLCAtMSkuam9pbignICcpLCBwYXRoW3BhdGgubGVuZ3RoLTFdLCAnJywgZWxlbWVudHMpXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpLnJlcGxhY2UoLz4vZywgJz4gJykudHJpbSgpXG59XG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgY3VycmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIG9wdGltaXplUGFydCAocHJlUGFydCwgY3VycmVudCwgcG9zdFBhcnQsIGVsZW1lbnRzKSB7XG4gIGlmIChwcmVQYXJ0Lmxlbmd0aCkgcHJlUGFydCA9IGAke3ByZVBhcnR9IGBcbiAgaWYgKHBvc3RQYXJ0Lmxlbmd0aCkgcG9zdFBhcnQgPSBgICR7cG9zdFBhcnR9YFxuXG4gIC8vIHJvYnVzdG5lc3M6IGF0dHJpYnV0ZSB3aXRob3V0IHZhbHVlIChnZW5lcmFsaXphdGlvbilcbiAgaWYgKC9cXFsqXFxdLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3Qga2V5ID0gY3VycmVudC5yZXBsYWNlKC89LiokLywgJ10nKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2tleX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0ga2V5XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHJvYnVzdG5lc3M6IHJlcGxhY2Ugc3BlY2lmaWMga2V5LXZhbHVlIHdpdGggYmFzZSB0YWcgKGhldXJpc3RpYylcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtrZXl9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpKSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NyaXB0aW9ufSR7cG9zdFBhcnR9YFxuICAgICAgICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmICgvPi8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjdXJyZW50LnJlcGxhY2UoLz4vLCAnJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjZW5kYW50fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmICgvOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5yZXBsYWNlKC9udGgtY2hpbGQvZywgJ250aC1vZi10eXBlJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHt0eXBlfSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSB0eXBlXG4gICAgfVxuICB9XG5cbiAgLy8gZWZmaWNpZW5jeTogY29tYmluYXRpb25zIG9mIGNsYXNzbmFtZSAocGFydGlhbCBwZXJtdXRhdGlvbnMpXG4gIGlmICgvXFwuXFxTK1xcLlxcUysvLnRlc3QoY3VycmVudCkpIHtcbiAgICB2YXIgbmFtZXMgPSBjdXJyZW50LnRyaW0oKS5zcGxpdCgnLicpLnNsaWNlKDEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuICAgIHdoaWxlIChuYW1lcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IHBhcnRpYWwgPSBjdXJyZW50LnJlcGxhY2UobmFtZXMuc2hpZnQoKSwgJycpLnRyaW0oKVxuICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7cGFydGlhbH0ke3Bvc3RQYXJ0fWAudHJpbSgpXG4gICAgICBpZiAoIXBhdHRlcm4ubGVuZ3RoIHx8IHBhdHRlcm4uY2hhckF0KDApID09PSAnPicgfHwgcGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGgtMSkgPT09ICc+Jykge1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlcywgZWxlbWVudHMpKSB7XG4gICAgICAgIGN1cnJlbnQgPSBwYXJ0aWFsXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gcm9idXN0bmVzczogZGVncmFkZSBjb21wbGV4IGNsYXNzbmFtZSAoaGV1cmlzdGljKVxuICAgIG5hbWVzID0gY3VycmVudCAmJiBjdXJyZW50Lm1hdGNoKC9cXC4vZylcbiAgICBpZiAobmFtZXMgJiYgbmFtZXMubGVuZ3RoID4gMikge1xuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cHJlUGFydH0ke2N1cnJlbnR9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpXVxuICAgICAgICBpZiAoZWxlbWVudHMuc29tZSgoZWxlbWVudCkgPT4gcmVmZXJlbmNlLmNvbnRhaW5zKGVsZW1lbnQpICkpIHtcbiAgICAgICAgICAvLyBUT0RPOlxuICAgICAgICAgIC8vIC0gY2hlY2sgdXNpbmcgYXR0cmlidXRlcyArIHJlZ2FyZCBleGNsdWRlc1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NyaXB0aW9ufSR7cG9zdFBhcnR9YFxuICAgICAgICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzLCBlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuLyoqXG4gKiBFdmFsdWF0ZSBtYXRjaGVzIHdpdGggZXhwZWN0ZWQgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBtYXRjaGVzICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVSZXN1bHRzIChtYXRjaGVzLCBlbGVtZW50cykge1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbWF0Y2hlc1xuICByZXR1cm4gbGVuZ3RoID09PSBlbGVtZW50cy5sZW5ndGggJiYgZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobWF0Y2hlc1tpXSA9PT0gZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfSlcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9vcHRpbWl6ZS5qcyIsIi8qKlxuICogIyBBZGFwdFxuICpcbiAqIENoZWNrIGFuZCBleHRlbmQgdGhlIGVudmlyb25tZW50IGZvciB1bml2ZXJzYWwgdXNhZ2UuXG4gKi9cblxuLyoqXG4gKiBNb2RpZnkgdGhlIGNvbnRleHQgYmFzZWQgb24gdGhlIGVudmlyb25tZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVMZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGFwdCAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gIC8vIGRldGVjdCBlbnZpcm9ubWVudCBzZXR1cFxuICBpZiAoZ2xvYmFsLmRvY3VtZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmRvY3VtZW50ID0gb3B0aW9ucy5jb250ZXh0IHx8ICgoKSA9PiB7XG4gICAgICB2YXIgcm9vdCA9IGVsZW1lbnRcbiAgICAgIHdoaWxlIChyb290LnBhcmVudCkge1xuICAgICAgICByb290ID0gcm9vdC5wYXJlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290XG4gICAgfSkoKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9taGFuZGxlci9ibG9iL21hc3Rlci9pbmRleC5qcyNMNzVcbiAgY29uc3QgRWxlbWVudFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwuZG9jdW1lbnQpXG5cbiAgLy8gYWx0ZXJuYXRpdmUgZGVzY3JpcHRvciB0byBhY2Nlc3MgZWxlbWVudHMgd2l0aCBmaWx0ZXJpbmcgaW52YWxpZCBlbGVtZW50cyAoZS5nLiB0ZXh0bm9kZXMpXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21lbGVtZW50dHlwZS9ibG9iL21hc3Rlci9pbmRleC5qcyNMMTJcbiAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAndGFnJyB8fCBub2RlLnR5cGUgPT09ICdzY3JpcHQnIHx8IG5vZGUudHlwZSA9PT0gJ3N0eWxlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnKSkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dHJpYnV0ZXNcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTmFtZWROb2RlTWFwXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlicyB9ID0gdGhpc1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJzKVxuICAgICAgICBjb25zdCBOYW1lZE5vZGVNYXAgPSBhdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChhdHRyaWJ1dGVzLCBhdHRyaWJ1dGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJzW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICAgIH0sIHsgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hbWVkTm9kZU1hcCwgJ2xlbmd0aCcsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBOYW1lZE5vZGVNYXBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJzW25hbWVdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHModGhpcy5jaGlsZFRhZ3MsIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50Lm5hbWUgPT09IHRhZ05hbWUgfHwgdGFnTmFtZSA9PT0gJyonKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgbmFtZXMgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKS5zcGxpdCgnICcpXG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudENsYXNzTmFtZSA9IGRlc2NlbmRhbnQuYXR0cmlicy5jbGFzc1xuICAgICAgICBpZiAoZGVzY2VuZGFudENsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gZGVzY2VuZGFudENsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvY3NzL3NlbGVjdG9yc19hcGkvcXVlcnlTZWxlY3RvckFsbFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICBFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3JzKSB7XG4gICAgICBzZWxlY3RvcnMgPSBzZWxlY3RvcnMucmVwbGFjZSgvKD4pKFxcUykvZywgJyQxICQyJykudHJpbSgpIC8vIGFkZCBzcGFjZSBmb3IgJz4nIHNlbGVjdG9yXG5cbiAgICAgIC8vIHVzaW5nIHJpZ2h0IHRvIGxlZnQgZXhlY3V0aW9uID0+IGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2Nzcy1zZWxlY3QjaG93LWRvZXMtaXQtd29ya1xuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gZ2V0SW5zdHJ1Y3Rpb25zKHNlbGVjdG9ycylcbiAgICAgIGNvbnN0IGRpc2NvdmVyID0gaW5zdHJ1Y3Rpb25zLnNoaWZ0KClcblxuICAgICAgY29uc3QgdG90YWwgPSBpbnN0cnVjdGlvbnMubGVuZ3RoXG4gICAgICByZXR1cm4gZGlzY292ZXIodGhpcykuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIHZhciBzdGVwID0gMFxuICAgICAgICB3aGlsZSAoc3RlcCA8IHRvdGFsKSB7XG4gICAgICAgICAgbm9kZSA9IGluc3RydWN0aW9uc1tzdGVwXShub2RlLCB0aGlzKVxuICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBoaWVyYXJjaHkgZG9lc24ndCBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0ZXAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5jb250YWlucykge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NvbnRhaW5zXG4gICAgRWxlbWVudFByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgaW5jbHVzaXZlID0gZmFsc2VcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudCA9PT0gZWxlbWVudCkge1xuICAgICAgICAgIGluY2x1c2l2ZSA9IHRydWVcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbmNsdXNpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRyYW5zZm9ybWF0aW9uIHN0ZXBzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59ICAgc2VsZWN0b3JzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEZ1bmN0aW9uPn0gICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnMgKHNlbGVjdG9ycykge1xuICByZXR1cm4gc2VsZWN0b3JzLnNwbGl0KCcgJykucmV2ZXJzZSgpLm1hcCgoc2VsZWN0b3IsIHN0ZXApID0+IHtcbiAgICBjb25zdCBkaXNjb3ZlciA9IHN0ZXAgPT09IDBcbiAgICBjb25zdCBbdHlwZSwgcHNldWRvXSA9IHNlbGVjdG9yLnNwbGl0KCc6JylcblxuICAgIHZhciB2YWxpZGF0ZSA9IG51bGxcbiAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBudWxsXG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcblxuICAgICAgLy8gY2hpbGQ6ICc+J1xuICAgICAgY2FzZSAvPi8udGVzdCh0eXBlKTpcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1BhcmVudCAobm9kZSkge1xuICAgICAgICAgIHJldHVybiAodmFsaWRhdGUpID0+IHZhbGlkYXRlKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGNsYXNzOiAnLidcbiAgICAgIGNhc2UgL15cXC4vLnRlc3QodHlwZSk6XG4gICAgICAgIGNvbnN0IG5hbWVzID0gdHlwZS5zdWJzdHIoMSkuc3BsaXQoJy4nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgbm9kZUNsYXNzTmFtZSA9IG5vZGUuYXR0cmlicy5jbGFzc1xuICAgICAgICAgIHJldHVybiBub2RlQ2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBub2RlQ2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQ2xhc3MgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUobmFtZXMuam9pbignICcpKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gYXR0cmlidXRlOiAnW2tleT1cInZhbHVlXCJdJ1xuICAgICAgY2FzZSAvXlxcWy8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdID0gdHlwZS5yZXBsYWNlKC9cXFt8XFxdfFwiL2csICcnKS5zcGxpdCgnPScpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBoYXNBdHRyaWJ1dGUgPSBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmluZGV4T2YoYXR0cmlidXRlS2V5KSA+IC0xXG4gICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZSkgeyAvLyByZWdhcmQgb3B0aW9uYWwgYXR0cmlidXRlVmFsdWVcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlVmFsdWUgfHwgKG5vZGUuYXR0cmlic1thdHRyaWJ1dGVLZXldID09PSBhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gaWQ6ICcjJ1xuICAgICAgY2FzZSAvXiMvLnRlc3QodHlwZSk6XG4gICAgICAgIGNvbnN0IGlkID0gdHlwZS5zdWJzdHIoMSlcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLmF0dHJpYnMuaWQgPT09IGlkXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0lkIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICAgIGRvbmUoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyB1bml2ZXJzYWw6ICcqJ1xuICAgICAgY2FzZSAvXFwqLy50ZXN0KHR5cGUpOlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB0cnVlXG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tVbml2ZXJzYWwgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4gTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gdGFnOiAnLi4uJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09IHR5cGVcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVGFnIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHNldWRvKSB7XG4gICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25cbiAgICB9XG5cbiAgICBjb25zdCBydWxlID0gcHNldWRvLm1hdGNoKC8tKGNoaWxkfHR5cGUpXFwoKFxcZCspXFwpJC8pXG4gICAgY29uc3Qga2luZCA9IHJ1bGVbMV1cbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHJ1bGVbMl0sIDEwKSAtIDFcblxuICAgIGNvbnN0IHZhbGlkYXRlUHNldWRvID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciBjb21wYXJlU2V0ID0gbm9kZS5wYXJlbnQuY2hpbGRUYWdzXG4gICAgICAgIGlmIChraW5kID09PSAndHlwZScpIHtcbiAgICAgICAgICBjb21wYXJlU2V0ID0gY29tcGFyZVNldC5maWx0ZXIodmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gY29tcGFyZVNldC5maW5kSW5kZXgoKGNoaWxkKSA9PiBjaGlsZCA9PT0gbm9kZSlcbiAgICAgICAgaWYgKG5vZGVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZW5oYW5jZUluc3RydWN0aW9uIChub2RlKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGluc3RydWN0aW9uKG5vZGUpXG4gICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoLnJlZHVjZSgoTm9kZUxpc3QsIG1hdGNoZWROb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlUHNldWRvKG1hdGNoZWROb2RlKSkge1xuICAgICAgICAgICAgTm9kZUxpc3QucHVzaChtYXRjaGVkTm9kZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgIH0sIFtdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRlUHNldWRvKG1hdGNoKSAmJiBtYXRjaFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBXYWxraW5nIHJlY3Vyc2l2ZSB0byBpbnZva2UgY2FsbGJhY2tzXG4gKlxuICogQHBhcmFtIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBub2RlcyAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gICAgICAgICAgICBoYW5kbGVyIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZURlc2NlbmRhbnRzIChub2RlcywgaGFuZGxlcikge1xuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgdmFyIHByb2dyZXNzID0gdHJ1ZVxuICAgIGhhbmRsZXIobm9kZSwgKCkgPT4gcHJvZ3Jlc3MgPSBmYWxzZSlcbiAgICBpZiAobm9kZS5jaGlsZFRhZ3MgJiYgcHJvZ3Jlc3MpIHtcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMobm9kZS5jaGlsZFRhZ3MsIGhhbmRsZXIpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIEJ1YmJsZSB1cCBmcm9tIGJvdHRvbSB0byB0b3BcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRUxlbWVudH0gbm9kZSAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRUxlbWVudH0gcm9vdCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgdmFsaWRhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRUxlbWVudH0gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEFuY2VzdG9yIChub2RlLCByb290LCB2YWxpZGF0ZSkge1xuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBub2RlID0gbm9kZS5wYXJlbnRcbiAgICBpZiAodmFsaWRhdGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgfVxuICAgIGlmIChub2RlID09PSByb290KSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FkYXB0LmpzIiwiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnkgc2VsZWN0b3IgdG8gYWNjZXNzIHRoZSBzZWxlY3RlZCBET00gZWxlbWVudChzKS5cbiAqIEZvciBsb25nZXZpdHkgaXQgYXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzLlxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuaW1wb3J0IHsgZ2V0Q29tbW9uQW5jZXN0b3IsIGdldENvbW1vblByb3BlcnRpZXMgfSBmcm9tICcuL2NvbW1vbidcblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciBmb3IgdGhlIHByb3ZpZGVkIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgPT09IDMpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIH1cblxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICAke3NlbGVjdG9yfVxuICAvLyAgIG9wdGltaXplZDogJHtvcHRpbWl6ZWR9XG4gIC8vIGApXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIG9wdGltaXplZFxufVxuXG4vKipcbiAqIEdldCBhIHNlbGVjdG9yIHRvIG1hdGNoIG11bHRpcGxlIGRlc2NlbmRhbnRzIGZyb20gYW4gYW5jZXN0b3JcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fE5vZGVMaXN0fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdWx0aVNlbGVjdG9yIChlbGVtZW50cywgb3B0aW9ucyA9IHt9KSB7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGVsZW1lbnRzKSkge1xuICAgIGVsZW1lbnRzID0gY29udmVydE5vZGVMaXN0KGVsZW1lbnRzKVxuICB9XG5cbiAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGlucHV0IC0gb25seSBhbiBBcnJheSBvZiBIVE1MRWxlbWVudHMgb3IgcmVwcmVzZW50YXRpb25zIG9mIHRoZW0gaXMgc3VwcG9ydGVkIWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnRzWzBdLCBvcHRpb25zKVxuXG4gIGNvbnN0IGFuY2VzdG9yID0gZ2V0Q29tbW9uQW5jZXN0b3IoZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IGFuY2VzdG9yU2VsZWN0b3IgPSBnZXRTaW5nbGVTZWxlY3RvcihhbmNlc3Rvciwgb3B0aW9ucylcblxuICAvLyBUT0RPOiBjb25zaWRlciB1c2FnZSBvZiBtdWx0aXBsZSBzZWxlY3RvcnMgKyBwYXJlbnQtY2hpbGQgcmVsYXRpb24gKyBjaGVjayBmb3IgcGFydCByZWR1bmRhbmN5XG4gIGNvbnN0IGNvbW1vblNlbGVjdG9ycyA9IGdldENvbW1vblNlbGVjdG9ycyhlbGVtZW50cylcbiAgY29uc3QgZGVzY2VuZGFudFNlbGVjdG9yID0gY29tbW9uU2VsZWN0b3JzWzBdXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBvcHRpbWl6ZShgJHthbmNlc3RvclNlbGVjdG9yfSAke2Rlc2NlbmRhbnRTZWxlY3Rvcn1gLCBlbGVtZW50cywgb3B0aW9ucylcbiAgY29uc3Qgc2VsZWN0b3JNYXRjaGVzID0gY29udmVydE5vZGVMaXN0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKVxuXG4gIGlmICghZWxlbWVudHMuZXZlcnkoKGVsZW1lbnQpID0+IHNlbGVjdG9yTWF0Y2hlcy5zb21lKChlbnRyeSkgPT4gZW50cnkgPT09IGVsZW1lbnQpICkpIHtcbiAgICAvLyBUT0RPOiBjbHVzdGVyIG1hdGNoZXMgdG8gc3BsaXQgaW50byBzaW1pbGFyIGdyb3VwcyBmb3Igc3ViIHNlbGVjdGlvbnNcbiAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgIFRoZSBzZWxlY3RlZCBlbGVtZW50cyBjYW5cXCd0IGJlIGVmZmljaWVudGx5IG1hcHBlZC5cbiAgICAgIEl0cyBwcm9iYWJseSBiZXN0IHRvIHVzZSBtdWx0aXBsZSBzaW5nbGUgc2VsZWN0b3JzIGluc3RlYWQhXG4gICAgYCwgZWxlbWVudHMpXG4gIH1cblxuICBpZiAoZ2xvYmFsTW9kaWZpZWQpIHtcbiAgICBkZWxldGUgZ2xvYmFsLmRvY3VtZW50XG4gIH1cblxuICByZXR1cm4gc2VsZWN0b3Jcbn1cblxuLyoqXG4gKiBHZXQgc2VsZWN0b3JzIHRvIGRlc2NyaWJlIGEgc2V0IG9mIGVsZW1lbnRzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50cz59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRDb21tb25TZWxlY3RvcnMgKGVsZW1lbnRzKSB7XG5cbiAgY29uc3QgeyBjbGFzc2VzLCBhdHRyaWJ1dGVzLCB0YWcgfSA9IGdldENvbW1vblByb3BlcnRpZXMoZWxlbWVudHMpXG5cbiAgY29uc3Qgc2VsZWN0b3JQYXRoID0gW11cblxuICBpZiAodGFnKSB7XG4gICAgc2VsZWN0b3JQYXRoLnB1c2godGFnKVxuICB9XG5cbiAgaWYgKGNsYXNzZXMpIHtcbiAgICBjb25zdCBjbGFzc1NlbGVjdG9yID0gY2xhc3Nlcy5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goY2xhc3NTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlU2VsZWN0b3IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5yZWR1Y2UoKHBhcnRzLCBuYW1lKSA9PiB7XG4gICAgICBwYXJ0cy5wdXNoKGBbJHtuYW1lfT1cIiR7YXR0cmlidXRlc1tuYW1lXX1cIl1gKVxuICAgICAgcmV0dXJuIHBhcnRzXG4gICAgfSwgW10pLmpvaW4oJycpXG4gICAgc2VsZWN0b3JQYXRoLnB1c2goYXR0cmlidXRlU2VsZWN0b3IpXG4gIH1cblxuICBpZiAoc2VsZWN0b3JQYXRoLmxlbmd0aCkge1xuICAgIC8vIFRPRE86IGNoZWNrIGZvciBwYXJlbnQtY2hpbGQgcmVsYXRpb25cbiAgfVxuXG4gIHJldHVybiBbXG4gICAgc2VsZWN0b3JQYXRoLmpvaW4oJycpXG4gIF1cbn1cblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKG11bHRpcGxlL3NpbmdsZSlcbiAqXG4gKiBOT1RFOiBleHRlbmRlZCBkZXRlY3Rpb24gaXMgdXNlZCBmb3Igc3BlY2lhbCBjYXNlcyBsaWtlIHRoZSA8c2VsZWN0PiBlbGVtZW50IHdpdGggPG9wdGlvbnM+XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8Tm9kZUxpc3R8QXJyYXkuPEhUTUxFbGVtZW50Pn0gaW5wdXQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRRdWVyeVNlbGVjdG9yIChpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmIChpbnB1dC5sZW5ndGggJiYgIWlucHV0Lm5hbWUpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICByZXR1cm4gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2VsZWN0LmpzIiwiZXhwb3J0IHNlbGVjdCwgeyBnZXRTaW5nbGVTZWxlY3RvciwgZ2V0TXVsdGlTZWxlY3RvciB9IGZyb20gJy4vc2VsZWN0J1xuZXhwb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5leHBvcnQgKiBhcyBjb21tb24gZnJvbSAnLi9jb21tb24nXG5cbmV4cG9ydCBkZWZhdWx0IGZyb20gJy4vc2VsZWN0J1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmUgc2VsZWN0b3IgZm9yIGEgbm9kZS5cbiAqL1xuXG5pbXBvcnQgeyBlc2NhcGVWYWx1ZSB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMpIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50LFxuICAgIHNraXAgPSBudWxsLFxuICAgIHByaW9yaXR5ID0gWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZSA9IHt9XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgdmFyIGlnbm9yZUNsYXNzID0gZmFsc2VcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgaWYgKHR5cGUgPT09ICdjbGFzcycpIHtcbiAgICAgIGlnbm9yZUNsYXNzID0gdHJ1ZVxuICAgIH1cbiAgICB2YXIgcHJlZGljYXRlID0gaWdub3JlW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpIHJldHVyblxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcmVkaWNhdGUgPSBuZXcgUmVnRXhwKGVzY2FwZVZhbHVlKHByZWRpY2F0ZSkucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKSlcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdib29sZWFuJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlID8gLyg/OikvIDogLy5eL1xuICAgIH1cbiAgICAvLyBjaGVjayBjbGFzcy0vYXR0cmlidXRlbmFtZSBmb3IgcmVnZXhcbiAgICBpZ25vcmVbdHlwZV0gPSAobmFtZSwgdmFsdWUpID0+IHByZWRpY2F0ZS50ZXN0KHZhbHVlKVxuICB9KVxuXG4gIGlmIChpZ25vcmVDbGFzcykge1xuICAgIGNvbnN0IGlnbm9yZUF0dHJpYnV0ZSA9IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBpZ25vcmUuYXR0cmlidXRlID0gKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSA9PiB7XG4gICAgICByZXR1cm4gaWdub3JlLmNsYXNzKHZhbHVlKSB8fCBpZ25vcmVBdHRyaWJ1dGUgJiYgaWdub3JlQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSByb290KSB7XG4gICAgaWYgKHNraXBDaGVja3MoZWxlbWVudCkgIT09IHRydWUpIHtcbiAgICAgIC8vIH4gZ2xvYmFsXG4gICAgICBpZiAoY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHJvb3QpKSBicmVha1xuICAgICAgaWYgKGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcm9vdCkpIGJyZWFrXG5cbiAgICAgIC8vIH4gbG9jYWxcbiAgICAgIGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgfVxuXG4gICAgICAvLyBkZWZpbmUgb25seSBvbmUgcGFydCBlYWNoIGl0ZXJhdGlvblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgICAgY2hlY2tDaGlsZHMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbGVtZW50ID09PSByb290KSB7XG4gICAgY29uc3QgcGF0dGVybiA9IGZpbmRQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJylcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZXMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZz99ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgY29uc3Qgc29ydGVkS2V5cyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnNvcnQoKGN1cnIsIG5leHQpID0+IHtcbiAgICBjb25zdCBjdXJyUG9zID0gcHJpb3JpdHkuaW5kZXhPZihhdHRyaWJ1dGVzW2N1cnJdLm5hbWUpXG4gICAgY29uc3QgbmV4dFBvcyA9IHByaW9yaXR5LmluZGV4T2YoYXR0cmlidXRlc1tuZXh0XS5uYW1lKVxuICAgIGlmIChuZXh0UG9zID09PSAtMSkge1xuICAgICAgaWYgKGN1cnJQb3MgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiAwXG4gICAgICB9XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJQb3MgLSBuZXh0UG9zXG4gIH0pXG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBzb3J0ZWRLZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHNvcnRlZEtleXNbaV1cbiAgICBjb25zdCBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2tleV1cbiAgICBjb25zdCBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5hbWVcbiAgICBjb25zdCBhdHRyaWJ1dGVWYWx1ZSA9IGVzY2FwZVZhbHVlKGF0dHJpYnV0ZS52YWx1ZSlcblxuICAgIGNvbnN0IGN1cnJlbnRJZ25vcmUgPSBpZ25vcmVbYXR0cmlidXRlTmFtZV0gfHwgaWdub3JlLmF0dHJpYnV0ZVxuICAgIGNvbnN0IGN1cnJlbnREZWZhdWx0SWdub3JlID0gZGVmYXVsdElnbm9yZVthdHRyaWJ1dGVOYW1lXSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHZhciBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG5cbiAgICBpZiAoKC9cXGJcXGQvKS50ZXN0KGF0dHJpYnV0ZVZhbHVlKSA9PT0gZmFsc2UpIHtcbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnaWQnKSB7XG4gICAgICAgIHBhdHRlcm4gPSBgIyR7YXR0cmlidXRlVmFsdWV9YFxuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2NsYXNzJykge1xuICAgICAgICBjb25zdCBjbGFzc05hbWUgPSBhdHRyaWJ1dGVWYWx1ZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnLicpXG4gICAgICAgIHBhdHRlcm4gPSBgLiR7Y2xhc3NOYW1lfWBcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGF0dGVyblxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnIChlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICBjb25zdCBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICBpZiAocGF0dGVybikge1xuICAgIGNvbnN0IG1hdGNoZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kVGFnUGF0dGVybiAoZWxlbWVudCwgaWdub3JlKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgbnVsbCwgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIHJldHVybiB0YWdOYW1lXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBzcGVjaWZpYyBjaGlsZCBpZGVudGlmaWVyXG4gKlxuICogTk9URTogJ2NoaWxkVGFncycgaXMgYSBjdXN0b20gcHJvcGVydHkgdG8gdXNlIGFzIGEgdmlldyBmaWx0ZXIgZm9yIHRhZ3MgdXNpbmcgJ2FkYXB0ZXIuanMnXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NoaWxkcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCkge1xuICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuY2hpbGRUYWdzIHx8IHBhcmVudC5jaGlsZHJlblxuICBmb3IgKHZhciBpID0gMCwgbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV1cbiAgICBpZiAoY2hpbGQgPT09IGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGNoaWxkUGF0dGVybiA9IGZpbmRQYXR0ZXJuKHByaW9yaXR5LCBjaGlsZCwgaWdub3JlKVxuICAgICAgaWYgKCFjaGlsZFBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICAgICAgRWxlbWVudCBjb3VsZG5cXCd0IGJlIG1hdGNoZWQgdGhyb3VnaCBzdHJpY3QgaWdub3JlIHBhdHRlcm4hXG4gICAgICAgIGAsIGNoaWxkLCBpZ25vcmUsIGNoaWxkUGF0dGVybilcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhdHRlcm4gPSBgPiAke2NoaWxkUGF0dGVybn06bnRoLWNoaWxkKCR7aSsxfSlgXG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSkge1xuICB2YXIgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKVxuICBpZiAoIXBhdHRlcm4pIHtcbiAgICBwYXR0ZXJuID0gZmluZFRhZ1BhdHRlcm4oZWxlbWVudCwgaWdub3JlKVxuICB9XG4gIHJldHVybiBwYXR0ZXJuXG59XG5cbi8qKlxuICogVmFsaWRhdGUgd2l0aCBjdXN0b20gYW5kIGRlZmF1bHQgZnVuY3Rpb25zXG4gKlxuICogQHBhcmFtICB7RnVuY3Rpb259IHByZWRpY2F0ZSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmc/fSAgbmFtZSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICB2YWx1ZSAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7RnVuY3Rpb259IGRlZmF1bHRQcmVkaWNhdGUgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tJZ25vcmUgKHByZWRpY2F0ZSwgbmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgY2hlY2sgPSBwcmVkaWNhdGUgfHwgZGVmYXVsdFByZWRpY2F0ZVxuICBpZiAoIWNoZWNrKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21hdGNoLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==