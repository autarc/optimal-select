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
  return value && value.replace(/['"`\\/:?&!#$%^()[\]{|}*+;,.<=>@~]/g, '\\$&').replace(/\n/g, '\xA0');
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
          pattern2 = '' + prePart + description + postPart;
          matches2 = document.querySelectorAll(pattern2);

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
    var matches3 = document.querySelectorAll(pattern3);
    if (compareResults(matches3, elements)) {
      current = descendant;
    }
  }

  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
  if (/:nth-child/.test(current)) {
    // TODO: consider complete coverage of 'nth-of-type' replacement
    var type = current.replace(/nth-child/g, 'nth-of-type');
    var pattern4 = '' + prePart + type + postPart;
    var matches4 = document.querySelectorAll(pattern4);
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
      var matches5 = document.querySelectorAll(pattern5);
      if (compareResults(matches5, elements)) {
        current = partial;
      }
    }

    // robustness: degrade complex classname (heuristic)
    names = current && current.match(/\./g);
    if (names && names.length > 2) {
      var _references = document.querySelectorAll('' + prePart + current);

      var _loop3 = function _loop3() {
        var reference = _references[i2];
        if (elements.some(function (element) {
          return reference.contains(element);
        })) {
          // TODO:
          // - check using attributes + regard excludes
          var description = reference.tagName.toLowerCase();
          pattern6 = '' + prePart + description + postPart;
          matches6 = document.querySelectorAll(pattern6);

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
Object.keys(_select).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _select[key];
    }
  });
});

var _common2 = __webpack_require__(1);

var _common = _interopRequireWildcard(_common2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.common = _common;

/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA5YWQ1NjI3M2NjNWQ2ODM1YTc3NiIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL29wdGltaXplLmpzIiwid2VicGFjazovLy8uL3NyYy9hZGFwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2VsZWN0LmpzIiwid2VicGFjazovLy8uL34vY3NzMnhwYXRoL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9tYXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udmVydE5vZGVMaXN0IiwiZXNjYXBlVmFsdWUiLCJub2RlcyIsImxlbmd0aCIsImFyciIsIkFycmF5IiwiaSIsInZhbHVlIiwicmVwbGFjZSIsImdldENvbW1vbkFuY2VzdG9yIiwiZ2V0Q29tbW9uUHJvcGVydGllcyIsImVsZW1lbnRzIiwib3B0aW9ucyIsInJvb3QiLCJkb2N1bWVudCIsImFuY2VzdG9ycyIsImZvckVhY2giLCJlbGVtZW50IiwiaW5kZXgiLCJwYXJlbnRzIiwicGFyZW50Tm9kZSIsInVuc2hpZnQiLCJzb3J0IiwiY3VyciIsIm5leHQiLCJzaGFsbG93QW5jZXN0b3IiLCJzaGlmdCIsImFuY2VzdG9yIiwicGFyZW50IiwibWlzc2luZyIsInNvbWUiLCJvdGhlclBhcmVudHMiLCJvdGhlclBhcmVudCIsImwiLCJjb21tb25Qcm9wZXJ0aWVzIiwiY2xhc3NlcyIsImF0dHJpYnV0ZXMiLCJ0YWciLCJjb21tb25DbGFzc2VzIiwiY29tbW9uQXR0cmlidXRlcyIsImNvbW1vblRhZyIsInVuZGVmaW5lZCIsImdldEF0dHJpYnV0ZSIsInRyaW0iLCJzcGxpdCIsImZpbHRlciIsImVudHJ5IiwibmFtZSIsImVsZW1lbnRBdHRyaWJ1dGVzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImtleSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzTmFtZXMiLCJjb21tb25BdHRyaWJ1dGVzTmFtZXMiLCJuZXh0Q29tbW9uQXR0cmlidXRlcyIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsIm9wdGltaXplIiwic2VsZWN0b3IiLCJzdGFydHNXaXRoIiwiaXNBcnJheSIsIm5vZGVUeXBlIiwiRXJyb3IiLCJnbG9iYWxNb2RpZmllZCIsInBhdGgiLCJvcHRpbWl6ZVBhcnQiLCJzaG9ydGVuZWQiLCJwb3AiLCJjdXJyZW50IiwicHJlUGFydCIsImpvaW4iLCJwb3N0UGFydCIsInBhdHRlcm4iLCJtYXRjaGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImhhc1NhbWVSZXN1bHQiLCJldmVyeSIsInNsaWNlIiwidGVzdCIsImNvbXBhcmVSZXN1bHRzIiwicmVmZXJlbmNlcyIsInJlZmVyZW5jZSIsImNvbnRhaW5zIiwiZGVzY3JpcHRpb24iLCJwYXR0ZXJuMiIsIm1hdGNoZXMyIiwiZGVzY2VuZGFudCIsInBhdHRlcm4zIiwibWF0Y2hlczMiLCJ0eXBlIiwicGF0dGVybjQiLCJtYXRjaGVzNCIsIm5hbWVzIiwibWFwIiwicGFydGlhbCIsInBhdHRlcm41IiwiY2hhckF0IiwibWF0Y2hlczUiLCJtYXRjaCIsImkyIiwicGF0dGVybjYiLCJtYXRjaGVzNiIsImwyIiwiYWRhcHQiLCJnbG9iYWwiLCJjb250ZXh0IiwiRWxlbWVudFByb3RvdHlwZSIsImdldFByb3RvdHlwZU9mIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiY2hpbGRyZW4iLCJub2RlIiwiYXR0cmlicyIsIk5hbWVkTm9kZU1hcCIsImNvbmZpZ3VyYWJsZSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiSFRNTENvbGxlY3Rpb24iLCJ0cmF2ZXJzZURlc2NlbmRhbnRzIiwiY2hpbGRUYWdzIiwicHVzaCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJjbGFzc05hbWUiLCJkZXNjZW5kYW50Q2xhc3NOYW1lIiwiY2xhc3MiLCJpbmRleE9mIiwic2VsZWN0b3JzIiwiaW5zdHJ1Y3Rpb25zIiwiZ2V0SW5zdHJ1Y3Rpb25zIiwiZGlzY292ZXIiLCJ0b3RhbCIsInN0ZXAiLCJpbmNsdXNpdmUiLCJkb25lIiwicmV2ZXJzZSIsInBzZXVkbyIsInZhbGlkYXRlIiwiaW5zdHJ1Y3Rpb24iLCJjaGVja1BhcmVudCIsInN1YnN0ciIsIm5vZGVDbGFzc05hbWUiLCJjaGVja0NsYXNzIiwiZ2V0QW5jZXN0b3IiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsImhhc0F0dHJpYnV0ZSIsImNoZWNrQXR0cmlidXRlIiwiTm9kZUxpc3QiLCJpZCIsImNoZWNrSWQiLCJjaGVja1VuaXZlcnNhbCIsImNoZWNrVGFnIiwicnVsZSIsImtpbmQiLCJwYXJzZUludCIsInZhbGlkYXRlUHNldWRvIiwiY29tcGFyZVNldCIsIm5vZGVJbmRleCIsImZpbmRJbmRleCIsImNoaWxkIiwiZW5oYW5jZUluc3RydWN0aW9uIiwibWF0Y2hlZE5vZGUiLCJoYW5kbGVyIiwicHJvZ3Jlc3MiLCJnZXRTaW5nbGVTZWxlY3RvciIsImdldE11bHRpU2VsZWN0b3IiLCJnZXRRdWVyeVNlbGVjdG9yIiwib3B0aW1pemVkIiwiYW5jZXN0b3JTZWxlY3RvciIsImNvbW1vblNlbGVjdG9ycyIsImdldENvbW1vblNlbGVjdG9ycyIsImRlc2NlbmRhbnRTZWxlY3RvciIsInNlbGVjdG9yTWF0Y2hlcyIsImNvbnNvbGUiLCJ3YXJuIiwic2VsZWN0b3JQYXRoIiwiY2xhc3NTZWxlY3RvciIsImF0dHJpYnV0ZVNlbGVjdG9yIiwicGFydHMiLCJpbnB1dCIsInJlc3VsdCIsImZvcm1hdCIsInhwYXRoX3RvX2xvd2VyIiwicyIsInhwYXRoX2VuZHNfd2l0aCIsInMxIiwiczIiLCJ4cGF0aF91cmwiLCJ4cGF0aF91cmxfYXR0cnMiLCJ4cGF0aF91cmxfcGF0aCIsInhwYXRoX3VybF9kb21haW4iLCJ4cGF0aF9sb3dlcl9jYXNlIiwieHBhdGhfbnNfdXJpIiwieHBhdGhfbnNfcGF0aCIsInhwYXRoX2hhc19wcm90b2NhbCIsInhwYXRoX2lzX2ludGVybmFsIiwieHBhdGhfaXNfbG9jYWwiLCJ4cGF0aF9pc19wYXRoIiwieHBhdGhfaXNfbG9jYWxfcGF0aCIsInhwYXRoX25vcm1hbGl6ZV9zcGFjZSIsInhwYXRoX2ludGVybmFsIiwieHBhdGhfZXh0ZXJuYWwiLCJlc2NhcGVfbGl0ZXJhbCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsImVzY2FwZV9wYXJlbnMiLCJyZWdleF9zdHJpbmdfbGl0ZXJhbCIsInJlZ2V4X2VzY2FwZWRfbGl0ZXJhbCIsInJlZ2V4X2Nzc193cmFwX3BzZXVkbyIsInJlZ2V4X3NwZWNhbF9jaGFycyIsInJlZ2V4X2ZpcnN0X2F4aXMiLCJyZWdleF9maWx0ZXJfcHJlZml4IiwicmVnZXhfYXR0cl9wcmVmaXgiLCJyZWdleF9udGhfZXF1YXRpb24iLCJjc3NfY29tYmluYXRvcnNfcmVnZXgiLCJjc3NfY29tYmluYXRvcnNfY2FsbGJhY2siLCJvcGVyYXRvciIsImF4aXMiLCJmdW5jIiwibGl0ZXJhbCIsImV4Y2x1ZGUiLCJvZmZzZXQiLCJvcmlnIiwicHJlZml4IiwiaXNOdW1lcmljIiwicHJldkNoYXIiLCJjc3NfYXR0cmlidXRlc19yZWdleCIsImNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrIiwic3RyIiwiYXR0ciIsImNvbXAiLCJvcCIsInZhbCIsInNlYXJjaCIsImNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCIsImNzc19wc2V1ZG9fY2xhc3Nlc19jYWxsYmFjayIsImcxIiwiZzIiLCJhcmciLCJnMyIsImc0IiwiZzUiLCJjc3MyeHBhdGgiLCJhIiwieHBhdGgiLCJwcmVwZW5kQXhpcyIsImNzc19pZHNfY2xhc3Nlc19yZWdleCIsImNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayIsInN0YXJ0Iiwic2VsZWN0b3JTdGFydCIsImRlcHRoIiwibnVtIiwiaXNOYU4iLCJlc2NhcGVDaGFyIiwib3BlbiIsImNsb3NlIiwiY2hhciIsIlJlZ0V4cCIsInJlcGVhdCIsIk51bWJlciIsImNvbnZlcnRFc2NhcGluZyIsIm5lc3RlZCIsImxpdGVyYWxzIiwic3Vic3RyaW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIndpbmRvdyIsImRlZmF1bHRJZ25vcmUiLCJza2lwIiwicHJpb3JpdHkiLCJpZ25vcmUiLCJza2lwQ29tcGFyZSIsInNraXBDaGVja3MiLCJjb21wYXJlIiwicHJlZGljYXRlIiwidG9TdHJpbmciLCJjaGVja0F0dHJpYnV0ZXMiLCJjaGVja0NoaWxkcyIsImZpbmRQYXR0ZXJuIiwiZmluZEF0dHJpYnV0ZXNQYXR0ZXJuIiwiZ2V0Q2xhc3NTZWxlY3RvciIsImMiLCJyIiwiY29uY2F0IiwiYiIsImF0dHJpYnV0ZU5hbWVzIiwic29ydGVkS2V5cyIsInVzZU5hbWVkSWdub3JlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWVzIiwiY2xhc3NJZ25vcmUiLCJmaW5kVGFnUGF0dGVybiIsImNoaWxkUGF0dGVybiIsImRlZmF1bHRQcmVkaWNhdGUiLCJjaGVjayIsImRlZmF1bHQiLCJjb21tb24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixF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LEtBQUwsRUFBWTtBQUNWLFdBQU8sSUFBUDtBQUNEO0FBQ0QsTUFBTXFTLFFBQVF0QixhQUFhcUIsZ0JBQTNCO0FBQ0EsTUFBSSxDQUFDQyxLQUFMLEVBQVk7QUFDVixXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU9BLE1BQU03UCxJQUFOLEVBQVl4QyxLQUFaLEVBQW1Cb1MsZ0JBQW5CLENBQVA7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkNDelRRRSxPOzs7Ozs7bUJBQW1CckksaUI7Ozs7OzttQkFBbUJDLGdCOzs7Ozs7Ozs7NkNBQ3RDb0ksTzs7O0FBR1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7O1FBRllDLE0iLCJmaWxlIjoib3B0aW1hbC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOWFkNTYyNzNjYzVkNjgzNWE3NzYiLCIvKipcbiAqICMgVXRpbGl0aWVzXG4gKlxuICogQ29udmVuaWVuY2UgaGVscGVycy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZSBhbiBhcnJheSB3aXRoIHRoZSBET00gbm9kZXMgb2YgdGhlIGxpc3RcbiAqXG4gKiBAcGFyYW0gIHtOb2RlTGlzdH0gICAgICAgICAgICAgbm9kZXMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtBcnJheS48SFRNTEVsZW1lbnQ+fSAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0Tm9kZUxpc3QgKG5vZGVzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBub2Rlc1xuICBjb25zdCBhcnIgPSBuZXcgQXJyYXkobGVuZ3RoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgYXJyW2ldID0gbm9kZXNbaV1cbiAgfVxuICByZXR1cm4gYXJyXG59XG5cbi8qKlxuICogRXNjYXBlIHNwZWNpYWwgY2hhcmFjdGVycyBhbmQgbGluZSBicmVha3MgYXMgYSBzaW1wbGlmaWVkIHZlcnNpb24gb2YgJ0NTUy5lc2NhcGUoKSdcbiAqXG4gKiBEZXNjcmlwdGlvbiBvZiB2YWxpZCBjaGFyYWN0ZXJzOiBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvY3NzLWVzY2FwZXNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmc/fSB2YWx1ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlVmFsdWUgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAmJiB2YWx1ZS5yZXBsYWNlKC9bJ1wiYFxcXFwvOj8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XS9nLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvXFxuL2csICdcXHUwMGEwJylcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlsaXRpZXMuanMiLCIvKipcbiAqICMgQ29tbW9uXG4gKlxuICogUHJvY2VzcyBjb2xsZWN0aW9ucyBmb3Igc2ltaWxhcml0aWVzLlxuICovXG5cbi8qKlxuICogRmluZCB0aGUgbGFzdCBjb21tb24gYW5jZXN0b3Igb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25BbmNlc3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IHtcbiAgICByb290ID0gZG9jdW1lbnRcbiAgfSA9IG9wdGlvbnNcblxuICBjb25zdCBhbmNlc3RvcnMgPSBbXVxuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcGFyZW50cyA9IFtdXG4gICAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICAgIHBhcmVudHMudW5zaGlmdChlbGVtZW50KVxuICAgIH1cbiAgICBhbmNlc3RvcnNbaW5kZXhdID0gcGFyZW50c1xuICB9KVxuXG4gIGFuY2VzdG9ycy5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuXG4gIGNvbnN0IHNoYWxsb3dBbmNlc3RvciA9IGFuY2VzdG9ycy5zaGlmdCgpXG5cbiAgdmFyIGFuY2VzdG9yID0gbnVsbFxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gc2hhbGxvd0FuY2VzdG9yLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHBhcmVudCA9IHNoYWxsb3dBbmNlc3RvcltpXVxuICAgIGNvbnN0IG1pc3NpbmcgPSBhbmNlc3RvcnMuc29tZSgob3RoZXJQYXJlbnRzKSA9PiB7XG4gICAgICByZXR1cm4gIW90aGVyUGFyZW50cy5zb21lKChvdGhlclBhcmVudCkgPT4gb3RoZXJQYXJlbnQgPT09IHBhcmVudClcbiAgICB9KVxuXG4gICAgaWYgKG1pc3NpbmcpIHtcbiAgICAgIC8vIFRPRE86IGZpbmQgc2ltaWxhciBzdWItcGFyZW50cywgbm90IHRoZSB0b3Agcm9vdCwgZS5nLiBzaGFyaW5nIGEgY2xhc3Mgc2VsZWN0b3JcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgYW5jZXN0b3IgPSBwYXJlbnRcbiAgfVxuXG4gIHJldHVybiBhbmNlc3RvclxufVxuXG4vKipcbiAqIEdldCBhIHNldCBvZiBjb21tb24gcHJvcGVydGllcyBvZiBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21tb25Qcm9wZXJ0aWVzIChlbGVtZW50cykge1xuXG4gIGNvbnN0IGNvbW1vblByb3BlcnRpZXMgPSB7XG4gICAgY2xhc3NlczogW10sXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgdGFnOiBudWxsXG4gIH1cblxuICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG5cbiAgICB2YXIge1xuICAgICAgY2xhc3NlczogY29tbW9uQ2xhc3NlcyxcbiAgICAgIGF0dHJpYnV0ZXM6IGNvbW1vbkF0dHJpYnV0ZXMsXG4gICAgICB0YWc6IGNvbW1vblRhZ1xuICAgIH0gPSBjb21tb25Qcm9wZXJ0aWVzXG5cbiAgICAvLyB+IGNsYXNzZXNcbiAgICBpZiAoY29tbW9uQ2xhc3NlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gICAgICBpZiAoY2xhc3Nlcykge1xuICAgICAgICBjbGFzc2VzID0gY2xhc3Nlcy50cmltKCkuc3BsaXQoJyAnKVxuICAgICAgICBpZiAoIWNvbW1vbkNsYXNzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY2xhc3Nlc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbW1vbkNsYXNzZXMgPSBjb21tb25DbGFzc2VzLmZpbHRlcigoZW50cnkpID0+IGNsYXNzZXMuc29tZSgobmFtZSkgPT4gbmFtZSA9PT0gZW50cnkpKVxuICAgICAgICAgIGlmIChjb21tb25DbGFzc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzID0gY29tbW9uQ2xhc3Nlc1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgY29tbW9uUHJvcGVydGllcy5jbGFzc2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiByZXN0cnVjdHVyZSByZW1vdmFsIGFzIDJ4IHNldCAvIDJ4IGRlbGV0ZSwgaW5zdGVhZCBvZiBtb2RpZnkgYWx3YXlzIHJlcGxhY2luZyB3aXRoIG5ldyBjb2xsZWN0aW9uXG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmNsYXNzZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IGF0dHJpYnV0ZXNcbiAgICBpZiAoY29tbW9uQXR0cmlidXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBlbGVtZW50QXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IE9iamVjdC5rZXlzKGVsZW1lbnRBdHRyaWJ1dGVzKS5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGUgPSBlbGVtZW50QXR0cmlidXRlc1trZXldXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgICAgICAvLyBOT1RFOiB3b3JrYXJvdW5kIGRldGVjdGlvbiBmb3Igbm9uLXN0YW5kYXJkIHBoYW50b21qcyBOYW1lZE5vZGVNYXAgYmVoYXZpb3VyXG4gICAgICAgIC8vIChpc3N1ZTogaHR0cHM6Ly9naXRodWIuY29tL2FyaXlhL3BoYW50b21qcy9pc3N1ZXMvMTQ2MzQpXG4gICAgICAgIGlmIChhdHRyaWJ1dGUgJiYgYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJykge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGUudmFsdWVcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgfSwge30pXG5cbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICBjb25zdCBjb21tb25BdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhjb21tb25BdHRyaWJ1dGVzKVxuXG4gICAgICBpZiAoYXR0cmlidXRlc05hbWVzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIWNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tbW9uQXR0cmlidXRlcyA9IGNvbW1vbkF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKG5leHRDb21tb25BdHRyaWJ1dGVzLCBuYW1lKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGNvbW1vbkF0dHJpYnV0ZXNbbmFtZV1cbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gYXR0cmlidXRlc1tuYW1lXSkge1xuICAgICAgICAgICAgICBuZXh0Q29tbW9uQXR0cmlidXRlc1tuYW1lXSA9IHZhbHVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmV4dENvbW1vbkF0dHJpYnV0ZXNcbiAgICAgICAgICB9LCB7fSlcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoY29tbW9uQXR0cmlidXRlcykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXMgPSBjb21tb25BdHRyaWJ1dGVzXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLmF0dHJpYnV0ZXNcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB+IHRhZ1xuICAgIGlmIChjb21tb25UYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgdGFnID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmICghY29tbW9uVGFnKSB7XG4gICAgICAgIGNvbW1vblByb3BlcnRpZXMudGFnID0gdGFnXG4gICAgICB9IGVsc2UgaWYgKHRhZyAhPT0gY29tbW9uVGFnKSB7XG4gICAgICAgIGRlbGV0ZSBjb21tb25Qcm9wZXJ0aWVzLnRhZ1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gY29tbW9uUHJvcGVydGllc1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbW1vbi5qcyIsIi8qKlxuICogIyBPcHRpbWl6ZVxuICpcbiAqIDEuKSBJbXByb3ZlIGVmZmljaWVuY3kgdGhyb3VnaCBzaG9ydGVyIHNlbGVjdG9ycyBieSByZW1vdmluZyByZWR1bmRhbmN5XG4gKiAyLikgSW1wcm92ZSByb2J1c3RuZXNzIHRocm91Z2ggc2VsZWN0b3IgdHJhbnNmb3JtYXRpb25cbiAqL1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCB7IGNvbnZlcnROb2RlTGlzdCB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR8QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcHRpbWl6ZSAoc2VsZWN0b3IsIGVsZW1lbnRzLCBvcHRpb25zID0ge30pIHtcblxuICBpZiAoc2VsZWN0b3Iuc3RhcnRzV2l0aCgnPiAnKSkge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IucmVwbGFjZSgnPiAnLCAnJylcbiAgfVxuXG4gIC8vIGNvbnZlcnQgc2luZ2xlIGVudHJ5IGFuZCBOb2RlTGlzdFxuICBpZiAoIUFycmF5LmlzQXJyYXkoZWxlbWVudHMpKSB7XG4gICAgZWxlbWVudHMgPSAhZWxlbWVudHMubGVuZ3RoID8gW2VsZW1lbnRzXSA6IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmICghZWxlbWVudHMubGVuZ3RoIHx8IGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGlucHV0IC0gdG8gY29tcGFyZSBIVE1MRWxlbWVudHMgaXRzIG5lY2Vzc2FyeSB0byBwcm92aWRlIGEgcmVmZXJlbmNlIG9mIHRoZSBzZWxlY3RlZCBub2RlKHMpISAobWlzc2luZyBcImVsZW1lbnRzXCIpJylcbiAgfVxuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudHNbMF0sIG9wdGlvbnMpXG5cbiAgLy8gY2h1bmsgcGFydHMgb3V0c2lkZSBvZiBxdW90ZXMgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI1NjYzNzI5KVxuICB2YXIgcGF0aCA9IHNlbGVjdG9yLnJlcGxhY2UoLz4gL2csICc+Jykuc3BsaXQoL1xccysoPz0oPzooPzpbXlwiXSpcIil7Mn0pKlteXCJdKiQpLylcblxuICBpZiAocGF0aC5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIG9wdGltaXplUGFydCgnJywgc2VsZWN0b3IsICcnLCBlbGVtZW50cylcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lZCA9IFtwYXRoLnBvcCgpXVxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSAge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoLnBvcCgpXG4gICAgY29uc3QgcHJlUGFydCA9IHBhdGguam9pbignICcpXG4gICAgY29uc3QgcG9zdFBhcnQgPSBzaG9ydGVuZWQuam9pbignICcpXG5cbiAgICBjb25zdCBwYXR0ZXJuID0gYCR7cHJlUGFydH0gJHtwb3N0UGFydH1gXG4gICAgY29uc3QgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBjb25zdCBoYXNTYW1lUmVzdWx0ID0gbWF0Y2hlcy5sZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCwgaSkgPT4gZWxlbWVudCA9PT0gbWF0Y2hlc1tpXSlcbiAgICBpZiAoIWhhc1NhbWVSZXN1bHQpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudHMpKVxuICAgIH1cbiAgfVxuICBzaG9ydGVuZWQudW5zaGlmdChwYXRoWzBdKVxuICBwYXRoID0gc2hvcnRlbmVkXG5cbiAgLy8gb3B0aW1pemUgc3RhcnQgKyBlbmRcbiAgcGF0aFswXSA9IG9wdGltaXplUGFydCgnJywgcGF0aFswXSwgcGF0aC5zbGljZSgxKS5qb2luKCcgJyksIGVsZW1lbnRzKVxuICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLmpvaW4oJyAnKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnRzKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKS5yZXBsYWNlKC8+L2csICc+ICcpLnRyaW0oKVxufVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgICAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgICAgICAgcG9zdFBhcnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnQ+fSBlbGVtZW50cyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZVBhcnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50cykge1xuICBpZiAocHJlUGFydC5sZW5ndGgpIHByZVBhcnQgPSBgJHtwcmVQYXJ0fSBgXG4gIGlmIChwb3N0UGFydC5sZW5ndGgpIHBvc3RQYXJ0ID0gYCAke3Bvc3RQYXJ0fWBcblxuICAvLyByb2J1c3RuZXNzOiBhdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZSAoZ2VuZXJhbGl6YXRpb24pXG4gIGlmICgvXFxbKlxcXS8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGtleSA9IGN1cnJlbnQucmVwbGFjZSgvPS4qJC8sICddJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtrZXl9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMsIGVsZW1lbnRzKSkge1xuICAgICAgY3VycmVudCA9IGtleVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb2J1c3RuZXNzOiByZXBsYWNlIHNwZWNpZmljIGtleS12YWx1ZSB3aXRoIGJhc2UgdGFnIChoZXVyaXN0aWMpXG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwcmVQYXJ0fSR7a2V5fWApXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZmVyZW5jZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZXNbaV1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSkpIHtcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybjIgPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuMilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczIsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKC8+Ly50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IGN1cnJlbnQucmVwbGFjZSgvPi8sICcnKVxuICAgIHZhciBwYXR0ZXJuMyA9IGAke3ByZVBhcnR9JHtkZXNjZW5kYW50fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzMyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybjMpXG4gICAgaWYgKGNvbXBhcmVSZXN1bHRzKG1hdGNoZXMzLCBlbGVtZW50cykpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmICgvOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5yZXBsYWNlKC9udGgtY2hpbGQvZywgJ250aC1vZi10eXBlJylcbiAgICB2YXIgcGF0dGVybjQgPSBgJHtwcmVQYXJ0fSR7dHlwZX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlczQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm40KVxuICAgIGlmIChjb21wYXJlUmVzdWx0cyhtYXRjaGVzNCwgZWxlbWVudHMpKSB7XG4gICAgICBjdXJyZW50ID0gdHlwZVxuICAgIH1cbiAgfVxuXG4gIC8vIGVmZmljaWVuY3k6IGNvbWJpbmF0aW9ucyBvZiBjbGFzc25hbWUgKHBhcnRpYWwgcGVybXV0YXRpb25zKVxuICBpZiAoL15cXC5cXFMqW15cXHNcXFxcXVxcLlxcUysvLnRlc3QoY3VycmVudCkpIHtcbiAgICB2YXIgbmFtZXMgPSBjdXJyZW50LnRyaW0oKVxuICAgICAgLnJlcGxhY2UoLyhefFteXFxcXF0pXFwuL2csICckMSMuJykgLy8gZXNjYXBlIGFjdHVhbCBkb3RzXG4gICAgICAuc3BsaXQoJyMuJykgLy8gc3BsaXQgb25seSBvbiBhY3R1YWwgZG90c1xuICAgICAgLnNsaWNlKDEpXG4gICAgICAubWFwKChuYW1lKSA9PiBgLiR7bmFtZX1gKVxuICAgICAgLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG4gICAgd2hpbGUgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFydGlhbCA9IGN1cnJlbnQucmVwbGFjZShuYW1lcy5zaGlmdCgpLCAnJykudHJpbSgpXG4gICAgICB2YXIgcGF0dGVybjUgPSBgJHtwcmVQYXJ0fSR7cGFydGlhbH0ke3Bvc3RQYXJ0fWAudHJpbSgpXG4gICAgICBpZiAoIXBhdHRlcm41Lmxlbmd0aCB8fCBwYXR0ZXJuNS5jaGFyQXQoMCkgPT09ICc+JyB8fCBwYXR0ZXJuNS5jaGFyQXQocGF0dGVybjUubGVuZ3RoLTEpID09PSAnPicpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIHZhciBtYXRjaGVzNSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybjUpXG4gICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczUsIGVsZW1lbnRzKSkge1xuICAgICAgICBjdXJyZW50ID0gcGFydGlhbFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJvYnVzdG5lc3M6IGRlZ3JhZGUgY29tcGxleCBjbGFzc25hbWUgKGhldXJpc3RpYylcbiAgICBuYW1lcyA9IGN1cnJlbnQgJiYgY3VycmVudC5tYXRjaCgvXFwuL2cpXG4gICAgaWYgKG5hbWVzICYmIG5hbWVzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtjdXJyZW50fWApXG4gICAgICBmb3IgKHZhciBpMiA9IDAsIGwyID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkyIDwgbDI7IGkyKyspIHtcbiAgICAgICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlc1tpMl1cbiAgICAgICAgaWYgKGVsZW1lbnRzLnNvbWUoKGVsZW1lbnQpID0+IHJlZmVyZW5jZS5jb250YWlucyhlbGVtZW50KSApKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybjYgPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXM2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuNilcbiAgICAgICAgICBpZiAoY29tcGFyZVJlc3VsdHMobWF0Y2hlczYsIGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gY3VycmVudFxufVxuXG4vKipcbiAqIEV2YWx1YXRlIG1hdGNoZXMgd2l0aCBleHBlY3RlZCBlbGVtZW50c1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxIVE1MRWxlbWVudD59IG1hdGNoZXMgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50Pn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY29tcGFyZVJlc3VsdHMgKG1hdGNoZXMsIGVsZW1lbnRzKSB7XG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBtYXRjaGVzXG4gIHJldHVybiBsZW5ndGggPT09IGVsZW1lbnRzLmxlbmd0aCAmJiBlbGVtZW50cy5ldmVyeSgoZWxlbWVudCkgPT4ge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChtYXRjaGVzW2ldID09PSBlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZVxuICB9KVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL29wdGltaXplLmpzIiwiLyoqXG4gKiAjIEFkYXB0XG4gKlxuICogQ2hlY2sgYW5kIGV4dGVuZCB0aGUgZW52aXJvbm1lbnQgZm9yIHVuaXZlcnNhbCB1c2FnZS5cbiAqL1xuXG4vKipcbiAqIE1vZGlmeSB0aGUgY29udGV4dCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRUxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG4gIC8vIGRldGVjdCBlbnZpcm9ubWVudCBzZXR1cFxuICBpZiAoZ2xvYmFsLmRvY3VtZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsLmRvY3VtZW50ID0gb3B0aW9ucy5jb250ZXh0IHx8ICgoKSA9PiB7XG4gICAgICB2YXIgcm9vdCA9IGVsZW1lbnRcbiAgICAgIHdoaWxlIChyb290LnBhcmVudCkge1xuICAgICAgICByb290ID0gcm9vdC5wYXJlbnRcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290XG4gICAgfSkoKVxuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9taGFuZGxlci9ibG9iL21hc3Rlci9pbmRleC5qcyNMNzVcbiAgY29uc3QgRWxlbWVudFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwuZG9jdW1lbnQpXG5cbiAgLy8gYWx0ZXJuYXRpdmUgZGVzY3JpcHRvciB0byBhY2Nlc3MgZWxlbWVudHMgd2l0aCBmaWx0ZXJpbmcgaW52YWxpZCBlbGVtZW50cyAoZS5nLiB0ZXh0bm9kZXMpXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21lbGVtZW50dHlwZS9ibG9iL21hc3Rlci9pbmRleC5qcyNMMTJcbiAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAndGFnJyB8fCBub2RlLnR5cGUgPT09ICdzY3JpcHQnIHx8IG5vZGUudHlwZSA9PT0gJ3N0eWxlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnKSkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dHJpYnV0ZXNcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTmFtZWROb2RlTWFwXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlicyB9ID0gdGhpc1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJzKVxuICAgICAgICBjb25zdCBOYW1lZE5vZGVNYXAgPSBhdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChhdHRyaWJ1dGVzLCBhdHRyaWJ1dGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJzW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICAgIH0sIHsgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hbWVkTm9kZU1hcCwgJ2xlbmd0aCcsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBOYW1lZE5vZGVNYXBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJzW25hbWVdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHModGhpcy5jaGlsZFRhZ3MsIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50Lm5hbWUgPT09IHRhZ05hbWUgfHwgdGFnTmFtZSA9PT0gJyonKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgbmFtZXMgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKS5zcGxpdCgnICcpXG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudENsYXNzTmFtZSA9IGRlc2NlbmRhbnQuYXR0cmlicy5jbGFzc1xuICAgICAgICBpZiAoZGVzY2VuZGFudENsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gZGVzY2VuZGFudENsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvY3NzL3NlbGVjdG9yc19hcGkvcXVlcnlTZWxlY3RvckFsbFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICBFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3JzKSB7XG4gICAgICBzZWxlY3RvcnMgPSBzZWxlY3RvcnMucmVwbGFjZSgvKD4pKFxcUykvZywgJyQxICQyJykudHJpbSgpIC8vIGFkZCBzcGFjZSBmb3IgJz4nIHNlbGVjdG9yXG5cbiAgICAgIC8vIHVzaW5nIHJpZ2h0IHRvIGxlZnQgZXhlY3V0aW9uID0+IGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2Nzcy1zZWxlY3QjaG93LWRvZXMtaXQtd29ya1xuICAgICAgY29uc3QgaW5zdHJ1Y3Rpb25zID0gZ2V0SW5zdHJ1Y3Rpb25zKHNlbGVjdG9ycylcbiAgICAgIGNvbnN0IGRpc2NvdmVyID0gaW5zdHJ1Y3Rpb25zLnNoaWZ0KClcblxuICAgICAgY29uc3QgdG90YWwgPSBpbnN0cnVjdGlvbnMubGVuZ3RoXG4gICAgICByZXR1cm4gZGlzY292ZXIodGhpcykuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIHZhciBzdGVwID0gMFxuICAgICAgICB3aGlsZSAoc3RlcCA8IHRvdGFsKSB7XG4gICAgICAgICAgbm9kZSA9IGluc3RydWN0aW9uc1tzdGVwXShub2RlLCB0aGlzKVxuICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBoaWVyYXJjaHkgZG9lc24ndCBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0ZXAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5jb250YWlucykge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NvbnRhaW5zXG4gICAgRWxlbWVudFByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgaW5jbHVzaXZlID0gZmFsc2VcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudCA9PT0gZWxlbWVudCkge1xuICAgICAgICAgIGluY2x1c2l2ZSA9IHRydWVcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbmNsdXNpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFJldHJpZXZlIHRyYW5zZm9ybWF0aW9uIHN0ZXBzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59ICAgc2VsZWN0b3JzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7QXJyYXkuPEZ1bmN0aW9uPn0gICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnMgKHNlbGVjdG9ycykge1xuICByZXR1cm4gc2VsZWN0b3JzLnNwbGl0KCcgJykucmV2ZXJzZSgpLm1hcCgoc2VsZWN0b3IsIHN0ZXApID0+IHtcbiAgICBjb25zdCBkaXNjb3ZlciA9IHN0ZXAgPT09IDBcbiAgICBjb25zdCBbdHlwZSwgcHNldWRvXSA9IHNlbGVjdG9yLnNwbGl0KCc6JylcblxuICAgIHZhciB2YWxpZGF0ZSA9IG51bGxcbiAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBudWxsXG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcblxuICAgIC8vIGNoaWxkOiAnPidcbiAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1BhcmVudCAobm9kZSkge1xuICAgICAgICByZXR1cm4gKHZhbGlkYXRlKSA9PiB2YWxpZGF0ZShub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnRcbiAgICAgIH1cbiAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGNsYXNzOiAnLidcbiAgICBjYXNlIC9eXFwuLy50ZXN0KHR5cGUpOiB7XG4gICAgICBjb25zdCBuYW1lcyA9IHR5cGUuc3Vic3RyKDEpLnNwbGl0KCcuJylcbiAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgbm9kZUNsYXNzTmFtZSA9IG5vZGUuYXR0cmlicy5jbGFzc1xuICAgICAgICByZXR1cm4gbm9kZUNsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gbm9kZUNsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpXG4gICAgICB9XG4gICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQ2xhc3MgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcy5qb2luKCcgJykpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICAvLyBhdHRyaWJ1dGU6ICdba2V5PVwidmFsdWVcIl0nXG4gICAgY2FzZSAvXlxcWy8udGVzdCh0eXBlKToge1xuICAgICAgY29uc3QgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdID0gdHlwZS5yZXBsYWNlKC9cXFt8XFxdfFwiL2csICcnKS5zcGxpdCgnPScpXG4gICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZSkgeyAvLyByZWdhcmQgb3B0aW9uYWwgYXR0cmlidXRlVmFsdWVcbiAgICAgICAgICBpZiAoIWF0dHJpYnV0ZVZhbHVlIHx8IChub2RlLmF0dHJpYnNbYXR0cmlidXRlS2V5XSA9PT0gYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGUgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgLy8gaWQ6ICcjJ1xuICAgIGNhc2UgL14jLy50ZXN0KHR5cGUpOiB7XG4gICAgICBjb25zdCBpZCA9IHR5cGUuc3Vic3RyKDEpXG4gICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgIHJldHVybiBub2RlLmF0dHJpYnMuaWQgPT09IGlkXG4gICAgICB9XG4gICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgY2FzZSAvXFwqLy50ZXN0KHR5cGUpOiB7XG4gICAgICB2YWxpZGF0ZSA9ICgpID0+IHRydWVcbiAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tVbml2ZXJzYWwgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4gTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KSlcbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICB9XG4gICAgICBicmVha1xuICAgIH1cblxuICAgIC8vIHRhZzogJy4uLidcbiAgICBkZWZhdWx0OlxuICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSB0eXBlXG4gICAgICB9XG4gICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVGFnIChub2RlLCByb290KSB7XG4gICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFdhbGtpbmcgcmVjdXJzaXZlIHRvIGludm9rZSBjYWxsYmFja3NcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxIVE1MRWxlbWVudD59IG5vZGVzICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICAgICAgICAgIGhhbmRsZXIgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogQnViYmxlIHVwIGZyb20gYm90dG9tIHRvIHRvcFxuICpcbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSBub2RlICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFTGVtZW50fSByb290ICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICB2YWxpZGF0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0hUTUxFTGVtZW50fSAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRhcHQuanMiLCIvKipcbiAqICMgU2VsZWN0XG4gKlxuICogQ29uc3RydWN0IGEgdW5pcXVlIENTUyBxdWVyeSBzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogRm9yIGxvbmdldml0eSBpdCBhcHBsaWVzIGRpZmZlcmVudCBtYXRjaGluZyBhbmQgb3B0aW1pemF0aW9uIHN0cmF0ZWdpZXMuXG4gKi9cbmltcG9ydCBjc3MyeHBhdGggZnJvbSAnY3NzMnhwYXRoJ1xuXG5pbXBvcnQgYWRhcHQgZnJvbSAnLi9hZGFwdCdcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoJ1xuaW1wb3J0IG9wdGltaXplIGZyb20gJy4vb3B0aW1pemUnXG5pbXBvcnQgeyBjb252ZXJ0Tm9kZUxpc3QgfSBmcm9tICcuL3V0aWxpdGllcydcbmltcG9ydCB7IGdldENvbW1vbkFuY2VzdG9yLCBnZXRDb21tb25Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9jb21tb24nXG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2luZ2xlU2VsZWN0b3IgKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICB9XG5cbiAgaWYgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaW5wdXQgLSBvbmx5IEhUTUxFbGVtZW50cyBvciByZXByZXNlbnRhdGlvbnMgb2YgdGhlbSBhcmUgc3VwcG9ydGVkISAobm90IFwiJHt0eXBlb2YgZWxlbWVudH1cIilgKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50LCBvcHRpb25zKVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gbWF0Y2goZWxlbWVudCwgb3B0aW9ucylcbiAgY29uc3Qgb3B0aW1pemVkID0gb3B0aW1pemUoc2VsZWN0b3IsIGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgLy8gZGVidWdcbiAgLy8gY29uc29sZS5sb2coYFxuICAvLyAgIHNlbGVjdG9yOiAgJHtzZWxlY3Rvcn1cbiAgLy8gICBvcHRpbWl6ZWQ6ICR7b3B0aW1pemVkfVxuICAvLyBgKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZWRcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBkZXNjZW5kYW50cyBmcm9tIGFuIGFuY2VzdG9yXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPEhUTUxFbGVtZW50PnxOb2RlTGlzdH0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TXVsdGlTZWxlY3RvciAoZWxlbWVudHMsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShlbGVtZW50cykpIHtcbiAgICBlbGVtZW50cyA9IGNvbnZlcnROb2RlTGlzdChlbGVtZW50cylcbiAgfVxuXG4gIGlmIChlbGVtZW50cy5zb21lKChlbGVtZW50KSA9PiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbnB1dCAtIG9ubHkgYW4gQXJyYXkgb2YgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGlzIHN1cHBvcnRlZCEnKVxuICB9XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50c1swXSwgb3B0aW9ucylcblxuICBjb25zdCBhbmNlc3RvciA9IGdldENvbW1vbkFuY2VzdG9yKGVsZW1lbnRzLCBvcHRpb25zKVxuICBjb25zdCBhbmNlc3RvclNlbGVjdG9yID0gZ2V0U2luZ2xlU2VsZWN0b3IoYW5jZXN0b3IsIG9wdGlvbnMpXG5cbiAgLy8gVE9ETzogY29uc2lkZXIgdXNhZ2Ugb2YgbXVsdGlwbGUgc2VsZWN0b3JzICsgcGFyZW50LWNoaWxkIHJlbGF0aW9uICsgY2hlY2sgZm9yIHBhcnQgcmVkdW5kYW5jeVxuICBjb25zdCBjb21tb25TZWxlY3RvcnMgPSBnZXRDb21tb25TZWxlY3RvcnMoZWxlbWVudHMpXG4gIGNvbnN0IGRlc2NlbmRhbnRTZWxlY3RvciA9IGNvbW1vblNlbGVjdG9yc1swXVxuXG4gIGNvbnN0IHNlbGVjdG9yID0gb3B0aW1pemUoYCR7YW5jZXN0b3JTZWxlY3Rvcn0gJHtkZXNjZW5kYW50U2VsZWN0b3J9YCwgZWxlbWVudHMsIG9wdGlvbnMpXG4gIGNvbnN0IHNlbGVjdG9yTWF0Y2hlcyA9IGNvbnZlcnROb2RlTGlzdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSlcblxuICBpZiAoIWVsZW1lbnRzLmV2ZXJ5KChlbGVtZW50KSA9PiBzZWxlY3Rvck1hdGNoZXMuc29tZSgoZW50cnkpID0+IGVudHJ5ID09PSBlbGVtZW50KSApKSB7XG4gICAgLy8gVE9ETzogY2x1c3RlciBtYXRjaGVzIHRvIHNwbGl0IGludG8gc2ltaWxhciBncm91cHMgZm9yIHN1YiBzZWxlY3Rpb25zXG4gICAgcmV0dXJuIGNvbnNvbGUud2FybihgXG4gICAgICBUaGUgc2VsZWN0ZWQgZWxlbWVudHMgY2FuJ3QgYmUgZWZmaWNpZW50bHkgbWFwcGVkLlxuICAgICAgSXRzIHByb2JhYmx5IGJlc3QgdG8gdXNlIG11bHRpcGxlIHNpbmdsZSBzZWxlY3RvcnMgaW5zdGVhZCFcbiAgICBgLCBlbGVtZW50cylcbiAgfVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBzZWxlY3RvclxufVxuXG4vKipcbiAqIEdldCBzZWxlY3RvcnMgdG8gZGVzY3JpYmUgYSBzZXQgb2YgZWxlbWVudHNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48SFRNTEVsZW1lbnRzPn0gZWxlbWVudHMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENvbW1vblNlbGVjdG9ycyAoZWxlbWVudHMpIHtcblxuICBjb25zdCB7IGNsYXNzZXMsIGF0dHJpYnV0ZXMsIHRhZyB9ID0gZ2V0Q29tbW9uUHJvcGVydGllcyhlbGVtZW50cylcblxuICBjb25zdCBzZWxlY3RvclBhdGggPSBbXVxuXG4gIGlmICh0YWcpIHtcbiAgICBzZWxlY3RvclBhdGgucHVzaCh0YWcpXG4gIH1cblxuICBpZiAoY2xhc3Nlcykge1xuICAgIGNvbnN0IGNsYXNzU2VsZWN0b3IgPSBjbGFzc2VzLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YCkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChjbGFzc1NlbGVjdG9yKVxuICB9XG5cbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVTZWxlY3RvciA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLnJlZHVjZSgocGFydHMsIG5hbWUpID0+IHtcbiAgICAgIHBhcnRzLnB1c2goYFske25hbWV9PVwiJHthdHRyaWJ1dGVzW25hbWVdfVwiXWApXG4gICAgICByZXR1cm4gcGFydHNcbiAgICB9LCBbXSkuam9pbignJylcbiAgICBzZWxlY3RvclBhdGgucHVzaChhdHRyaWJ1dGVTZWxlY3RvcilcbiAgfVxuXG4gIGlmIChzZWxlY3RvclBhdGgubGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogY2hlY2sgZm9yIHBhcmVudC1jaGlsZCByZWxhdGlvblxuICB9XG5cbiAgcmV0dXJuIFtcbiAgICBzZWxlY3RvclBhdGguam9pbignJylcbiAgXVxufVxuXG4vKipcbiAqIENob29zZSBhY3Rpb24gZGVwZW5kaW5nIG9uIHRoZSBpbnB1dCAobXVsdGlwbGUvc2luZ2xlKVxuICpcbiAqIE5PVEU6IGV4dGVuZGVkIGRldGVjdGlvbiBpcyB1c2VkIGZvciBzcGVjaWFsIGNhc2VzIGxpa2UgdGhlIDxzZWxlY3Q+IGVsZW1lbnQgd2l0aCA8b3B0aW9ucz5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudHxOb2RlTGlzdHxBcnJheS48SFRNTEVsZW1lbnQ+fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFF1ZXJ5U2VsZWN0b3IgKGlucHV0LCBvcHRpb25zID0ge30pIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCAmJiAhaW5wdXQubmFtZSkge1xuICAgIHJldHVybiBnZXRNdWx0aVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuICB9XG4gIGNvbnN0IHJlc3VsdCA9IGdldFNpbmdsZVNlbGVjdG9yKGlucHV0LCBvcHRpb25zKVxuXG4gIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5mb3JtYXQpIHtcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICByZXR1cm4gY3NzMnhwYXRoKHJlc3VsdClcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zZWxlY3QuanMiLCIndXNlIHN0cmljdCc7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHZhciB4cGF0aF90b19sb3dlciAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICd0cmFuc2xhdGUoJyArXG4gICAgICAgICAgICAgICAgKHMgfHwgJ25vcm1hbGl6ZS1zcGFjZSgpJykgK1xuICAgICAgICAgICAgICAgICcsIFxcJ0FCQ0RFRkdISklLTE1OT1BRUlNUVVZXWFlaXFwnJyArXG4gICAgICAgICAgICAgICAgJywgXFwnYWJjZGVmZ2hqaWtsbW5vcHFyc3R1dnd4eXpcXCcpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF9lbmRzX3dpdGggICAgICAgID0gZnVuY3Rpb24gKHMxLCBzMikge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZygnICsgczEgKyAnLCcgK1xuICAgICAgICAgICAgICAgICdzdHJpbmctbGVuZ3RoKCcgKyBzMSArICcpLXN0cmluZy1sZW5ndGgoJyArIHMyICsgJykrMSk9JyArIHMyO1xuICAgICAgfSxcbiAgICAgIHhwYXRoX3VybCAgICAgICAgICAgICAgPSBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gJ3N1YnN0cmluZy1iZWZvcmUoY29uY2F0KHN1YnN0cmluZy1hZnRlcignICtcbiAgICAgICAgICAgICAgICAocyB8fCB4cGF0aF91cmxfYXR0cnMpICsgJyxcIjovL1wiKSxcIj9cIiksXCI/XCIpJztcbiAgICAgIH0sXG4gICAgICB4cGF0aF91cmxfcGF0aCAgICAgICAgID0gZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgcmV0dXJuICdzdWJzdHJpbmctYWZ0ZXIoJyArIChzIHx8IHhwYXRoX3VybF9hdHRycykgKyAnLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2RvbWFpbiAgICAgICA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiAnc3Vic3RyaW5nLWJlZm9yZShjb25jYXQoc3Vic3RyaW5nLWFmdGVyKCcgK1xuICAgICAgICAgICAgICAgKHMgfHwgeHBhdGhfdXJsX2F0dHJzKSArICcsXCI6Ly9cIiksXCIvXCIpLFwiL1wiKSc7XG4gICAgICB9LFxuICAgICAgeHBhdGhfdXJsX2F0dHJzICAgICAgICA9ICdAaHJlZnxAc3JjJyxcbiAgICAgIHhwYXRoX2xvd2VyX2Nhc2UgICAgICAgPSB4cGF0aF90b19sb3dlcigpLFxuICAgICAgeHBhdGhfbnNfdXJpICAgICAgICAgICA9ICdhbmNlc3Rvci1vci1zZWxmOjoqW2xhc3QoKV0vQHVybCcsXG4gICAgICB4cGF0aF9uc19wYXRoICAgICAgICAgID0geHBhdGhfdXJsX3BhdGgoeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkpLFxuICAgICAgeHBhdGhfaGFzX3Byb3RvY2FsICAgICA9ICcoc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybF9hdHRycyArICcsXCJodHRwOi8vXCIpIG9yIHN0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfYXR0cnMgKyAnLFwiaHR0cHM6Ly9cIikpJyxcbiAgICAgIHhwYXRoX2lzX2ludGVybmFsICAgICAgPSAnc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsX2RvbWFpbih4cGF0aF9uc191cmkpICsgJykgb3IgJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF91cmxfZG9tYWluKCksIHhwYXRoX3VybF9kb21haW4oeHBhdGhfbnNfdXJpKSksXG4gICAgICB4cGF0aF9pc19sb2NhbCAgICAgICAgID0gJygnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJyBhbmQgc3RhcnRzLXdpdGgoJyArIHhwYXRoX3VybCgpICsgJywnICsgeHBhdGhfdXJsKHhwYXRoX25zX3VyaSkgKyAnKSknLFxuICAgICAgeHBhdGhfaXNfcGF0aCAgICAgICAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX2F0dHJzICsgJyxcIi9cIiknLFxuICAgICAgeHBhdGhfaXNfbG9jYWxfcGF0aCAgICA9ICdzdGFydHMtd2l0aCgnICsgeHBhdGhfdXJsX3BhdGgoKSArICcsJyArIHhwYXRoX25zX3BhdGggKyAnKScsXG4gICAgICB4cGF0aF9ub3JtYWxpemVfc3BhY2UgID0gJ25vcm1hbGl6ZS1zcGFjZSgpJyxcbiAgICAgIHhwYXRoX2ludGVybmFsICAgICAgICAgPSAnW25vdCgnICsgeHBhdGhfaGFzX3Byb3RvY2FsICsgJykgb3IgJyArIHhwYXRoX2lzX2ludGVybmFsICsgJ10nLFxuICAgICAgeHBhdGhfZXh0ZXJuYWwgICAgICAgICA9ICdbJyArIHhwYXRoX2hhc19wcm90b2NhbCArICcgYW5kIG5vdCgnICsgeHBhdGhfaXNfaW50ZXJuYWwgKyAnKV0nLFxuICAgICAgZXNjYXBlX2xpdGVyYWwgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzApLFxuICAgICAgZXNjYXBlX3BhcmVucyAgICAgICAgICA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMzEpLFxuICAgICAgcmVnZXhfc3RyaW5nX2xpdGVyYWwgICA9IC8oXCJbXlwiXFx4MUVdKlwifCdbXidcXHgxRV0qJ3w9XFxzKlteXFxzXFxdXFwnXFxcIl0rKS9nLFxuICAgICAgcmVnZXhfZXNjYXBlZF9saXRlcmFsICA9IC9bJ1wiXT8oXFx4MUUrKVsnXCJdPy9nLFxuICAgICAgcmVnZXhfY3NzX3dyYXBfcHNldWRvICA9IC8oXFx4MUZcXCl8W15cXCldKVxcOihmaXJzdHxsaW1pdHxsYXN0fGd0fGx0fGVxfG50aCkoW15cXC1dfCQpLyxcbiAgICAgIHJlZ2V4X3NwZWNhbF9jaGFycyAgICAgPSAvW1xceDFDLVxceDFGXSsvZyxcbiAgICAgIHJlZ2V4X2ZpcnN0X2F4aXMgICAgICAgPSAvXihbXFxzXFwoXFx4MUZdKikoXFwuP1teXFwuXFwvXFwoXXsxLDJ9W2Etel0qOiopLyxcbiAgICAgIHJlZ2V4X2ZpbHRlcl9wcmVmaXggICAgPSAvKF58XFwvfFxcOilcXFsvZyxcbiAgICAgIHJlZ2V4X2F0dHJfcHJlZml4ICAgICAgPSAvKFteXFwoXFxbXFwvXFx8XFxzXFx4MUZdKVxcQC9nLFxuICAgICAgcmVnZXhfbnRoX2VxdWF0aW9uICAgICA9IC9eKFstMC05XSopbi4qPyhbMC05XSopJC8sXG4gICAgICBjc3NfY29tYmluYXRvcnNfcmVnZXggID0gL1xccyooIT9bKz5+LF4gXSlcXHMqKFxcLj9cXC8rfFthLXpcXC1dKzo6KT8oW2EtelxcLV0rXFwoKT8oKGFuZFxccyp8b3JcXHMqfG1vZFxccyopP1teKz5+LFxccydcIlxcXVxcfFxcXlxcJFxcIVxcPFxcPVxceDFDLVxceDFGXSspPy9nLFxuICAgICAgY3NzX2NvbWJpbmF0b3JzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBvcGVyYXRvciwgYXhpcywgZnVuYywgbGl0ZXJhbCwgZXhjbHVkZSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIHZhciBwcmVmaXggPSAnJzsgLy8gSWYgd2UgY2FuLCB3ZSdsbCBwcmVmaXggYSAnLidcblxuICAgICAgICAvLyBYUGF0aCBvcGVyYXRvcnMgY2FuIGxvb2sgbGlrZSBub2RlLW5hbWUgc2VsZWN0b3JzXG4gICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgYW5kXCIsIFwiIG9yXCIsIFwiIG1vZFwiXG4gICAgICAgIGlmIChvcGVyYXRvciA9PT0gJyAnICYmIGV4Y2x1ZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBPbmx5IGFsbG93IG5vZGUtc2VsZWN0aW5nIFhQYXRoIGZ1bmN0aW9uc1xuICAgICAgICAgIC8vIERldGVjdCBmYWxzZSBwb3NpdGl2ZSBmb3IgXCIgKyBjb3VudCguLi4pXCIsIFwiIGNvdW50KC4uLilcIiwgXCIgPiBwb3NpdGlvbigpXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoZnVuYyAhPT0gdW5kZWZpbmVkICYmIChmdW5jICE9PSAnbm9kZSgnICYmIGZ1bmMgIT09ICd0ZXh0KCcgJiYgZnVuYyAhPT0gJ2NvbW1lbnQoJykpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGl0ZXJhbCA9IGZ1bmM7XG4gICAgICAgICAgfSAvLyBIYW5kbGUgY2FzZSBcIiArIHRleHQoKVwiLCBcIiA+IGNvbW1lbnQoKVwiLCBldGMuIHdoZXJlIFwiZnVuY1wiIGlzIG91ciBcImxpdGVyYWxcIlxuXG4gICAgICAgICAgICAvLyBYUGF0aCBtYXRoIG9wZXJhdG9ycyBtYXRjaCBzb21lIENTUyBjb21iaW5hdG9yc1xuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIGZvciBcIiArIDFcIiwgXCIgPiAxXCIsIGV0Yy5cbiAgICAgICAgICBpZiAoaXNOdW1lcmljKGxpdGVyYWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHByZXZDaGFyID0gb3JpZy5jaGFyQXQob2Zmc2V0IC0gMSk7XG5cbiAgICAgICAgICBpZiAocHJldkNoYXIubGVuZ3RoID09PSAwIHx8XG4gICAgICAgICAgICAgICAgcHJldkNoYXIgPT09ICcoJyB8fFxuICAgICAgICAgICAgICAgIHByZXZDaGFyID09PSAnfCcgfHxcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9PT0gJzonKSB7XG4gICAgICAgICAgICBwcmVmaXggPSAnLic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGlmIHdlIGRvbid0IGhhdmUgYSBzZWxlY3RvciB0byBmb2xsb3cgdGhlIGF4aXNcbiAgICAgICAgaWYgKGxpdGVyYWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvZmZzZXQgKyBtYXRjaC5sZW5ndGggPT09IG9yaWcubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaXRlcmFsID0gJyonO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBzd2l0Y2ggKG9wZXJhdG9yKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgIHJldHVybiAnLy8nICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgcmV0dXJuICcvJyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgIHJldHVybiBwcmVmaXggKyAnL2ZvbGxvd2luZy1zaWJsaW5nOjoqWzFdL3NlbGY6OicgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gcHJlZml4ICsgJy9mb2xsb3dpbmctc2libGluZzo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJywnOlxuICAgICAgICAgIGlmIChheGlzID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIH1cbiAgICAgICAgICBheGlzID0gJy4vLyc7XG4gICAgICAgICAgcmV0dXJuICd8JyArIGF4aXMgKyBsaXRlcmFsO1xuICAgICAgICBjYXNlICdeJzogLy8gZmlyc3QgY2hpbGRcbiAgICAgICAgICByZXR1cm4gJy9jaGlsZDo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIV4nOiAvLyBsYXN0IGNoaWxkXG4gICAgICAgICAgcmV0dXJuICcvY2hpbGQ6OipbbGFzdCgpXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnISAnOiAvLyBhbmNlc3Rvci1vci1zZWxmXG4gICAgICAgICAgcmV0dXJuICcvYW5jZXN0b3Itb3Itc2VsZjo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyE+JzogLy8gZGlyZWN0IHBhcmVudFxuICAgICAgICAgIHJldHVybiAnL3BhcmVudDo6JyArIGxpdGVyYWw7XG4gICAgICAgIGNhc2UgJyErJzogLy8gYWRqYWNlbnQgcHJlY2VkaW5nIHNpYmxpbmdcbiAgICAgICAgICByZXR1cm4gJy9wcmVjZWRpbmctc2libGluZzo6KlsxXS9zZWxmOjonICsgbGl0ZXJhbDtcbiAgICAgICAgY2FzZSAnIX4nOiAvLyBwcmVjZWRpbmcgc2libGluZ1xuICAgICAgICAgIHJldHVybiAnL3ByZWNlZGluZy1zaWJsaW5nOjonICsgbGl0ZXJhbDtcbiAgICAgICAgICAgIC8vIGNhc2UgJ35+J1xuICAgICAgICAgICAgLy8gcmV0dXJuICcvZm9sbG93aW5nLXNpYmxpbmc6Oiovc2VsZjo6fCcrc2VsZWN0b3JTdGFydChvcmlnLCBvZmZzZXQpKycvcHJlY2VkaW5nLXNpYmxpbmc6Oiovc2VsZjo6JytsaXRlcmFsO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBjc3NfYXR0cmlidXRlc19yZWdleCA9IC9cXFsoW15cXEBcXHxcXCpcXD1cXF5cXH5cXCRcXCFcXChcXC9cXHNcXHgxQy1cXHgxRl0rKVxccyooKFtcXHxcXCpcXH5cXF5cXCRcXCFdPyk9P1xccyooXFx4MUUrKSk/XFxdL2csXG4gICAgICBjc3NfYXR0cmlidXRlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIGF0dHIsIGNvbXAsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQgLSAxKTtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAocHJldkNoYXIgPT09ICcvJyB8fCAvLyBmb3VuZCBhZnRlciBhbiBheGlzIHNob3J0Y3V0IChcIi9cIiwgXCIvL1wiLCBldGMuKVxuICAgICAgICAgICAgcHJldkNoYXIgPT09ICc6JykgICAvLyBmb3VuZCBhZnRlciBhbiBheGlzIChcInNlbGY6OlwiLCBcInBhcmVudDo6XCIsIGV0Yy4pXG4gICAgICAgICAgICBheGlzID0gJyonOyovXG5cbiAgICAgICAgc3dpdGNoIChvcCkge1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbbm90KEAnICsgYXR0ciArICcpIG9yIEAnICsgYXR0ciArICchPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICBjYXNlICckJzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbc3Vic3RyaW5nKEAnICsgYXR0ciArICcsc3RyaW5nLWxlbmd0aChAJyArIGF0dHIgKyAnKS0oc3RyaW5nLWxlbmd0aChcIicgKyB2YWwgKyAnXCIpLTEpKT1cIicgKyB2YWwgKyAnXCJdJztcbiAgICAgICAgY2FzZSAnXic6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW3N0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsXCInICsgdmFsICsgJ1wiKV0nO1xuICAgICAgICBjYXNlICd+JzpcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbY29udGFpbnMoY29uY2F0KFwiIFwiLG5vcm1hbGl6ZS1zcGFjZShAJyArIGF0dHIgKyAnKSxcIiBcIiksY29uY2F0KFwiIFwiLFwiJyArIHZhbCArICdcIixcIiBcIikpXSc7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhAJyArIGF0dHIgKyAnLFwiJyArIHZhbCArICdcIildJztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgcmV0dXJuIGF4aXMgKyAnW0AnICsgYXR0ciArICc9XCInICsgdmFsICsgJ1wiIG9yIHN0YXJ0cy13aXRoKEAnICsgYXR0ciArICcsY29uY2F0KFwiJyArIHZhbCArICdcIixcIi1cIikpXSc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKGNvbXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGF0dHIuY2hhckF0KGF0dHIubGVuZ3RoIC0gMSkgPT09ICcoJyB8fCBhdHRyLnNlYXJjaCgvXlswLTldKyQvKSAhPT0gLTEgfHwgYXR0ci5pbmRleE9mKCc6JykgIT09IC0xKSAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnXSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBheGlzICsgJ1tAJyArIGF0dHIgKyAnPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4ID0gLzooW2EtelxcLV0rKShcXCgoXFx4MUYrKSgoW15cXHgxRl0rKFxcM1xceDFGKyk/KSopKFxcM1xcKSkpPy9nLFxuICAgICAgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrID0gZnVuY3Rpb24gKG1hdGNoLCBuYW1lLCBnMSwgZzIsIGFyZywgZzMsIGc0LCBnNSwgb2Zmc2V0LCBvcmlnKSB7XG4gICAgICAgIGlmIChvcmlnLmNoYXJBdChvZmZzZXQgLSAxKSA9PT0gJzonICYmIG9yaWcuY2hhckF0KG9mZnNldCAtIDIpICE9PSAnOicpIHtcbiAgICAgICAgICAgIC8vIFhQYXRoIFwiYXhpczo6bm9kZS1uYW1lXCIgd2lsbCBtYXRjaFxuICAgICAgICAgICAgLy8gRGV0ZWN0IGZhbHNlIHBvc2l0aXZlIFwiOm5vZGUtbmFtZVwiXG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hbWUgPT09ICdvZGQnIHx8IG5hbWUgPT09ICdldmVuJykge1xuICAgICAgICAgIGFyZyAgPSBuYW1lO1xuICAgICAgICAgIG5hbWUgPSAnbnRoLW9mLXR5cGUnO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChuYW1lKSB7IC8vIG5hbWUudG9Mb3dlckNhc2UoKT9cbiAgICAgICAgY2FzZSAnYWZ0ZXInOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3ByZWNlZGluZzo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnYWZ0ZXItc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgncHJlY2VkaW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2JlZm9yZSc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nOjonICsgYXJnLCB0cnVlKSArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdiZWZvcmUtc2libGluZyc6XG4gICAgICAgICAgcmV0dXJuICdbY291bnQoJyArIGNzczJ4cGF0aCgnZm9sbG93aW5nLXNpYmxpbmc6OicgKyBhcmcsIHRydWUpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2NoZWNrZWQnOlxuICAgICAgICAgIHJldHVybiAnW0BzZWxlY3RlZCBvciBAY2hlY2tlZF0nO1xuICAgICAgICBjYXNlICdjb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2ljb250YWlucyc6XG4gICAgICAgICAgcmV0dXJuICdbY29udGFpbnMoJyArIHhwYXRoX2xvd2VyX2Nhc2UgKyAnLCcgKyB4cGF0aF90b19sb3dlcihhcmcpICsgJyldJztcbiAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgIHJldHVybiAnW25vdCgqKSBhbmQgbm90KG5vcm1hbGl6ZS1zcGFjZSgpKV0nO1xuICAgICAgICBjYXNlICdlbmFibGVkJzpcbiAgICAgICAgY2FzZSAnZGlzYWJsZWQnOlxuICAgICAgICAgIHJldHVybiAnW0AnICsgbmFtZSArICddJztcbiAgICAgICAgY2FzZSAnZmlyc3QtY2hpbGQnOlxuICAgICAgICAgIHJldHVybiAnW25vdChwcmVjZWRpbmctc2libGluZzo6KildJztcbiAgICAgICAgY2FzZSAnZmlyc3QnOlxuICAgICAgICBjYXNlICdsaW1pdCc6XG4gICAgICAgIGNhc2UgJ2ZpcnN0LW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCk8PScgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAnZ3QnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPicgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbHQnOlxuICAgICAgICAgICAgICAgIC8vIFBvc2l0aW9uIHN0YXJ0cyBhdCAwIGZvciBjb25zaXN0ZW5jeSB3aXRoIFNpenpsZSBzZWxlY3RvcnNcbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPCcgKyAocGFyc2VJbnQoYXJnLCAxMCkgKyAxKSArICddJztcbiAgICAgICAgY2FzZSAnbGFzdC1jaGlsZCc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqKV0nO1xuICAgICAgICBjYXNlICdvbmx5LWNoaWxkJzpcbiAgICAgICAgICByZXR1cm4gJ1tub3QocHJlY2VkaW5nLXNpYmxpbmc6OiopIGFuZCBub3QoZm9sbG93aW5nLXNpYmxpbmc6OiopXSc7XG4gICAgICAgIGNhc2UgJ29ubHktb2YtdHlwZSc6XG4gICAgICAgICAgcmV0dXJuICdbbm90KHByZWNlZGluZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKSBhbmQgbm90KGZvbGxvd2luZy1zaWJsaW5nOjoqW25hbWUoKT1uYW1lKHNlbGY6Om5vZGUoKSldKV0nO1xuICAgICAgICBjYXNlICdudGgtY2hpbGQnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgPSAnICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzd2l0Y2ggKGFyZykge1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKSBtb2QgMj0wXSc7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnWyhjb3VudChwcmVjZWRpbmctc2libGluZzo6KikrMSkgbW9kIDI9MV0nO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgYSA9IChhcmcgfHwgJzAnKS5yZXBsYWNlKHJlZ2V4X250aF9lcXVhdGlvbiwgJyQxKyQyJykuc3BsaXQoJysnKTtcblxuICAgICAgICAgICAgYVswXSA9IGFbMF0gfHwgJzEnO1xuICAgICAgICAgICAgYVsxXSA9IGFbMV0gfHwgJzAnO1xuICAgICAgICAgICAgcmV0dXJuICdbKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKT49JyArIGFbMV0gKyAnIGFuZCAoKGNvdW50KHByZWNlZGluZy1zaWJsaW5nOjoqKSsxKS0nICsgYVsxXSArICcpIG1vZCAnICsgYVswXSArICc9MF0nO1xuICAgICAgICAgIH1cbiAgICAgICAgY2FzZSAnbnRoLW9mLXR5cGUnOlxuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBhcmcgKyAnXSc7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN3aXRjaCAoYXJnKSB7XG4gICAgICAgICAgY2FzZSAnb2RkJzpcbiAgICAgICAgICAgIHJldHVybiAnW3Bvc2l0aW9uKCkgbW9kIDI9MV0nO1xuICAgICAgICAgIGNhc2UgJ2V2ZW4nOlxuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKSBtb2QgMj0wIGFuZCBwb3NpdGlvbigpPj0wXSc7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBhID0gKGFyZyB8fCAnMCcpLnJlcGxhY2UocmVnZXhfbnRoX2VxdWF0aW9uLCAnJDErJDInKS5zcGxpdCgnKycpO1xuXG4gICAgICAgICAgICBhWzBdID0gYVswXSB8fCAnMSc7XG4gICAgICAgICAgICBhWzFdID0gYVsxXSB8fCAnMCc7XG4gICAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPj0nICsgYVsxXSArICcgYW5kIChwb3NpdGlvbigpLScgKyBhWzFdICsgJykgbW9kICcgKyBhWzBdICsgJz0wXSc7XG4gICAgICAgICAgfVxuICAgICAgICBjYXNlICdlcSc6XG4gICAgICAgIGNhc2UgJ250aCc6XG4gICAgICAgICAgLy8gUG9zaXRpb24gc3RhcnRzIGF0IDAgZm9yIGNvbnNpc3RlbmN5IHdpdGggU2l6emxlIHNlbGVjdG9yc1xuICAgICAgICAgIGlmIChpc051bWVyaWMoYXJnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIChwYXJzZUludChhcmcsIDEwKSArIDEpICsgJ10nO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAnWzFdJztcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgcmV0dXJuICdbQHR5cGU9XCJ0ZXh0XCJdJztcbiAgICAgICAgY2FzZSAnaXN0YXJ0cy13aXRoJzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aCgnICsgeHBhdGhfbG93ZXJfY2FzZSArICcsJyArIHhwYXRoX3RvX2xvd2VyKGFyZykgKyAnKV0nO1xuICAgICAgICBjYXNlICdzdGFydHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbc3RhcnRzLXdpdGgoJyArIHhwYXRoX25vcm1hbGl6ZV9zcGFjZSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ2llbmRzLXdpdGgnOlxuICAgICAgICAgIHJldHVybiAnWycgKyB4cGF0aF9lbmRzX3dpdGgoeHBhdGhfbG93ZXJfY2FzZSwgeHBhdGhfdG9fbG93ZXIoYXJnKSkgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2VuZHMtd2l0aCc6XG4gICAgICAgICAgcmV0dXJuICdbJyArIHhwYXRoX2VuZHNfd2l0aCh4cGF0aF9ub3JtYWxpemVfc3BhY2UsIGFyZykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ2hhcyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gcHJlcGVuZEF4aXMoY3NzMnhwYXRoKGFyZywgdHJ1ZSksICcuLy8nKTtcblxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyB4cGF0aCArICcpID4gMF0nO1xuICAgICAgICBjYXNlICdoYXMtc2libGluZyc6XG4gICAgICAgICAgdmFyIHhwYXRoID0gY3NzMnhwYXRoKCdwcmVjZWRpbmctc2libGluZzo6JyArIGFyZywgdHJ1ZSk7XG5cbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgeHBhdGggKyAnKSA+IDAgb3IgY291bnQoZm9sbG93aW5nLXNpYmxpbmc6OicgKyB4cGF0aC5zdWJzdHIoMTkpICsgJykgPiAwXSc7XG4gICAgICAgIGNhc2UgJ2hhcy1wYXJlbnQnOlxuICAgICAgICAgIHJldHVybiAnW2NvdW50KCcgKyBjc3MyeHBhdGgoJ3BhcmVudDo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnaGFzLWFuY2VzdG9yJzpcbiAgICAgICAgICByZXR1cm4gJ1tjb3VudCgnICsgY3NzMnhwYXRoKCdhbmNlc3Rvcjo6JyArIGFyZywgdHJ1ZSkgKyAnKSA+IDBdJztcbiAgICAgICAgY2FzZSAnbGFzdCc6XG4gICAgICAgIGNhc2UgJ2xhc3Qtb2YtdHlwZSc6XG4gICAgICAgICAgaWYgKGFyZyAhPT0gdW5kZWZpbmVkKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT5sYXN0KCktJyArIGFyZyArICddJztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdbbGFzdCgpXSc7XG4gICAgICAgIGNhc2UgJ3NlbGVjdGVkJzogLy8gU2l6emxlOiBcIihvcHRpb24pIGVsZW1lbnRzIHRoYXQgYXJlIGN1cnJlbnRseSBzZWxlY3RlZFwiXG4gICAgICAgICAgcmV0dXJuICdbbG9jYWwtbmFtZSgpPVwib3B0aW9uXCIgYW5kIEBzZWxlY3RlZF0nO1xuICAgICAgICBjYXNlICdza2lwJzpcbiAgICAgICAgY2FzZSAnc2tpcC1maXJzdCc6XG4gICAgICAgICAgcmV0dXJuICdbcG9zaXRpb24oKT4nICsgYXJnICsgJ10nO1xuICAgICAgICBjYXNlICdza2lwLWxhc3QnOlxuICAgICAgICAgIGlmIChhcmcgIT09IHVuZGVmaW5lZCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAnW2xhc3QoKS1wb3NpdGlvbigpPj0nICsgYXJnICsgJ10nO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1twb3NpdGlvbigpPGxhc3QoKV0nO1xuICAgICAgICBjYXNlICdyb290JzpcbiAgICAgICAgICByZXR1cm4gJy9hbmNlc3Rvcjo6W2xhc3QoKV0nO1xuICAgICAgICBjYXNlICdyYW5nZSc6XG4gICAgICAgICAgdmFyIGFyciA9IGFyZy5zcGxpdCgnLCcpO1xuXG4gICAgICAgICAgcmV0dXJuICdbJyArIGFyclswXSArICc8PXBvc2l0aW9uKCkgYW5kIHBvc2l0aW9uKCk8PScgKyBhcnJbMV0gKyAnXSc7XG4gICAgICAgIGNhc2UgJ2lucHV0JzogLy8gU2l6emxlOiBcImlucHV0LCBidXR0b24sIHNlbGVjdCwgYW5kIHRleHRhcmVhIGFyZSBhbGwgY29uc2lkZXJlZCB0byBiZSBpbnB1dCBlbGVtZW50cy5cIlxuICAgICAgICAgIHJldHVybiAnW2xvY2FsLW5hbWUoKT1cImlucHV0XCIgb3IgbG9jYWwtbmFtZSgpPVwiYnV0dG9uXCIgb3IgbG9jYWwtbmFtZSgpPVwic2VsZWN0XCIgb3IgbG9jYWwtbmFtZSgpPVwidGV4dGFyZWFcIl0nO1xuICAgICAgICBjYXNlICdpbnRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2ludGVybmFsO1xuICAgICAgICBjYXNlICdleHRlcm5hbCc6XG4gICAgICAgICAgcmV0dXJuIHhwYXRoX2V4dGVybmFsO1xuICAgICAgICBjYXNlICdodHRwJzpcbiAgICAgICAgY2FzZSAnaHR0cHMnOlxuICAgICAgICBjYXNlICdtYWlsdG8nOlxuICAgICAgICBjYXNlICdqYXZhc2NyaXB0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZixjb25jYXQoXCInICsgbmFtZSArICdcIixcIjpcIikpXSc7XG4gICAgICAgIGNhc2UgJ2RvbWFpbic6XG4gICAgICAgICAgcmV0dXJuICdbKHN0cmluZy1sZW5ndGgoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcpPTAgYW5kIGNvbnRhaW5zKCcgKyB4cGF0aF91cmxfZG9tYWluKHhwYXRoX25zX3VyaSkgKyAnLCcgKyBhcmcgKyAnKSkgb3IgY29udGFpbnMoJyArIHhwYXRoX3VybF9kb21haW4oKSArICcsJyArIGFyZyArICcpXSc7XG4gICAgICAgIGNhc2UgJ3BhdGgnOlxuICAgICAgICAgIHJldHVybiAnW3N0YXJ0cy13aXRoKCcgKyB4cGF0aF91cmxfcGF0aCgpICsgJyxzdWJzdHJpbmctYWZ0ZXIoXCInICsgYXJnICsgJ1wiLFwiL1wiKSldJ1xuICAgICAgICBjYXNlICdub3QnOlxuICAgICAgICAgIHZhciB4cGF0aCA9IGNzczJ4cGF0aChhcmcsIHRydWUpO1xuXG4gICAgICAgICAgaWYgKHhwYXRoLmNoYXJBdCgwKSA9PT0gJ1snKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgeHBhdGggPSAnc2VsZjo6bm9kZSgpJyArIHhwYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gJ1tub3QoJyArIHhwYXRoICsgJyldJztcbiAgICAgICAgY2FzZSAndGFyZ2V0JzpcbiAgICAgICAgICByZXR1cm4gJ1tzdGFydHMtd2l0aChAaHJlZiwgXCIjXCIpXSc7XG4gICAgICAgIGNhc2UgJ3Jvb3QnOlxuICAgICAgICAgIHJldHVybiAnYW5jZXN0b3Itb3Itc2VsZjo6KltsYXN0KCldJztcbiAgICAgICAgICAgIC8qIGNhc2UgJ2FjdGl2ZSc6XG4gICAgICAgICAgICBjYXNlICdmb2N1cyc6XG4gICAgICAgICAgICBjYXNlICdob3Zlcic6XG4gICAgICAgICAgICBjYXNlICdsaW5rJzpcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2l0ZWQnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnJzsqL1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICByZXR1cm4gJ1tAbGFuZz1cIicgKyBhcmcgKyAnXCJdJztcbiAgICAgICAgY2FzZSAncmVhZC1vbmx5JzpcbiAgICAgICAgY2FzZSAncmVhZC13cml0ZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lLnJlcGxhY2UoJy0nLCAnJykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ3ZhbGlkJzpcbiAgICAgICAgY2FzZSAncmVxdWlyZWQnOlxuICAgICAgICBjYXNlICdpbi1yYW5nZSc6XG4gICAgICAgIGNhc2UgJ291dC1vZi1yYW5nZSc6XG4gICAgICAgICAgcmV0dXJuICdbQCcgKyBuYW1lICsgJ10nO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgY3NzX2lkc19jbGFzc2VzX3JlZ2V4ID0gLygjfFxcLikoW15cXCNcXEBcXC5cXC9cXChcXFtcXClcXF1cXHxcXDpcXHNcXCtcXD5cXDxcXCdcXFwiXFx4MUQtXFx4MUZdKykvZyxcbiAgICAgIGNzc19pZHNfY2xhc3Nlc19jYWxsYmFjayA9IGZ1bmN0aW9uIChzdHIsIG9wLCB2YWwsIG9mZnNldCwgb3JpZykge1xuICAgICAgICB2YXIgYXhpcyA9ICcnO1xuICAgICAgICAvKiB2YXIgcHJldkNoYXIgPSBvcmlnLmNoYXJBdChvZmZzZXQtMSk7XG4gICAgICAgIGlmIChwcmV2Q2hhci5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnLycgfHxcbiAgICAgICAgICAgIHByZXZDaGFyID09PSAnKCcpXG4gICAgICAgICAgICBheGlzID0gJyonO1xuICAgICAgICBlbHNlIGlmIChwcmV2Q2hhciA9PT0gJzonKVxuICAgICAgICAgICAgYXhpcyA9ICdub2RlKCknOyovXG4gICAgICAgIGlmIChvcCA9PT0gJyMnKSAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gYXhpcyArICdbQGlkPVwiJyArIHZhbCArICdcIl0nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBheGlzICsgJ1tjb250YWlucyhjb25jYXQoXCIgXCIsbm9ybWFsaXplLXNwYWNlKEBjbGFzcyksXCIgXCIpLFwiICcgKyB2YWwgKyAnIFwiKV0nO1xuICAgICAgfTtcblxuICAgIC8vIFByZXBlbmQgZGVzY2VuZGFudC1vci1zZWxmIGlmIG5vIG90aGVyIGF4aXMgaXMgc3BlY2lmaWVkXG4gIGZ1bmN0aW9uIHByZXBlbmRBeGlzKHMsIGF4aXMpIHtcbiAgICByZXR1cm4gcy5yZXBsYWNlKHJlZ2V4X2ZpcnN0X2F4aXMsIGZ1bmN0aW9uIChtYXRjaCwgc3RhcnQsIGxpdGVyYWwpIHtcbiAgICAgIGlmIChsaXRlcmFsLnN1YnN0cihsaXRlcmFsLmxlbmd0aCAtIDIpID09PSAnOjonKSAvLyBBbHJlYWR5IGhhcyBheGlzOjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfVxuXG4gICAgICBpZiAobGl0ZXJhbC5jaGFyQXQoMCkgPT09ICdbJykgICAgICAgICAgICB7XG4gICAgICAgIGF4aXMgKz0gJyonO1xuICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChheGlzLmNoYXJBdChheGlzLmxlbmd0aC0xKSA9PT0gJyknKVxuICAgICAgICAvLyAgICBheGlzICs9ICcvJztcbiAgICAgIHJldHVybiBzdGFydCArIGF4aXMgKyBsaXRlcmFsO1xuICAgIH0pO1xuICB9XG5cbiAgICAvLyBGaW5kIHRoZSBiZWdpbmluZyBvZiB0aGUgc2VsZWN0b3IsIHN0YXJ0aW5nIGF0IGkgYW5kIHdvcmtpbmcgYmFja3dhcmRzXG4gIGZ1bmN0aW9uIHNlbGVjdG9yU3RhcnQocywgaSkge1xuICAgIHZhciBkZXB0aCA9IDA7XG4gICAgdmFyIG9mZnNldCA9IDA7XG5cbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBzd2l0Y2ggKHMuY2hhckF0KGkpKSB7XG4gICAgICBjYXNlICcgJzpcbiAgICAgIGNhc2UgZXNjYXBlX3BhcmVuczpcbiAgICAgICAgb2Zmc2V0Kys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnWyc6XG4gICAgICBjYXNlICcoJzpcbiAgICAgICAgZGVwdGgtLTtcblxuICAgICAgICBpZiAoZGVwdGggPCAwKSAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgIHJldHVybiArK2kgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICddJzpcbiAgICAgIGNhc2UgJyknOlxuICAgICAgICBkZXB0aCsrO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJywnOlxuICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGlmIChkZXB0aCA9PT0gMCkgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gKytpICsgb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgICAvLyBDaGVjayBpZiBzdHJpbmcgaXMgbnVtZXJpY1xuICBmdW5jdGlvbiBpc051bWVyaWMocykge1xuICAgIHZhciBudW0gPSBwYXJzZUludChzLCAxMCk7XG5cbiAgICByZXR1cm4gKCFpc05hTihudW0pICYmICcnICsgbnVtID09PSBzKTtcbiAgfVxuXG4gICAgLy8gQXBwZW5kIGVzY2FwZSBcImNoYXJcIiB0byBcIm9wZW5cIiBvciBcImNsb3NlXCJcbiAgZnVuY3Rpb24gZXNjYXBlQ2hhcihzLCBvcGVuLCBjbG9zZSwgY2hhcikge1xuICAgIHZhciBkZXB0aCA9IDA7XG5cbiAgICByZXR1cm4gcy5yZXBsYWNlKG5ldyBSZWdFeHAoJ1tcXFxcJyArIG9wZW4gKyAnXFxcXCcgKyBjbG9zZSArICddJywgJ2cnKSwgZnVuY3Rpb24gKGEpIHtcbiAgICAgIGlmIChhID09PSBvcGVuKSAgICAgICAgICAgIHtcbiAgICAgICAgZGVwdGgrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGEgPT09IG9wZW4pIHtcbiAgICAgICAgcmV0dXJuIGEgKyByZXBlYXQoY2hhciwgZGVwdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlcGVhdChjaGFyLCBkZXB0aC0tKSArIGE7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGVhdChzdHIsIG51bSkge1xuICAgIG51bSA9IE51bWJlcihudW0pO1xuICAgIHZhciByZXN1bHQgPSAnJztcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAobnVtICYgMSkgICAgICAgICAgICB7XG4gICAgICAgIHJlc3VsdCArPSBzdHI7XG4gICAgICB9XG4gICAgICBudW0gPj4+PSAxO1xuXG4gICAgICBpZiAobnVtIDw9IDApIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBzdHIgKz0gc3RyO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb252ZXJ0RXNjYXBpbmcgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnJlcGxhY2UoL1xcXFwoW2BcXFxcLzpcXD8mISMkJV4oKVtcXF17fH0qKzssLjw9PkB+XSkvZywgJyQxJylcbiAgICAgIC5yZXBsYWNlKC9cXFxcKFsnXCJdKS9nLCAnJDEkMScpXG4gICAgICAucmVwbGFjZSgvXFxcXEEgL2csICdcXG4nKVxuICB9XG5cbiAgZnVuY3Rpb24gY3NzMnhwYXRoKHMsIG5lc3RlZCkge1xuICAgIC8vIHMgPSBzLnRyaW0oKTtcblxuICAgIGlmIChuZXN0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX3BzZXVkb19jbGFzc2VzX3JlZ2V4LCBjc3NfcHNldWRvX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICAgIHMgPSBzLnJlcGxhY2UoY3NzX2lkc19jbGFzc2VzX3JlZ2V4LCBjc3NfaWRzX2NsYXNzZXNfY2FsbGJhY2spO1xuXG4gICAgICByZXR1cm4gcztcbiAgICB9XG5cbiAgICAvLyBUYWcgb3BlbiBhbmQgY2xvc2UgcGFyZW50aGVzaXMgcGFpcnMgKGZvciBSZWdFeHAgc2VhcmNoZXMpXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJygnLCAnKScsIGVzY2FwZV9wYXJlbnMpO1xuXG4gICAgLy8gUmVtb3ZlIGFuZCBzYXZlIGFueSBzdHJpbmcgbGl0ZXJhbHNcbiAgICB2YXIgbGl0ZXJhbHMgPSBbXTtcblxuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfc3RyaW5nX2xpdGVyYWwsIGZ1bmN0aW9uIChzLCBhKSB7XG4gICAgICBpZiAoYS5jaGFyQXQoMCkgPT09ICc9Jykge1xuICAgICAgICBhID0gYS5zdWJzdHIoMSkudHJpbSgpO1xuXG4gICAgICAgIGlmIChpc051bWVyaWMoYSkpICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IGEuc3Vic3RyKDEsIGEubGVuZ3RoIC0gMik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXBlYXQoZXNjYXBlX2xpdGVyYWwsIGxpdGVyYWxzLnB1c2goY29udmVydEVzY2FwaW5nKGEpKSk7XG4gICAgfSk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBjb21iaW5hdG9ycyAoXCIgXCIsIFwiK1wiLCBcIj5cIiwgXCJ+XCIsIFwiLFwiKSBhbmQgcmV2ZXJzZSBjb21iaW5hdG9ycyAoXCIhXCIsIFwiIStcIiwgXCIhPlwiLCBcIiF+XCIpXG4gICAgcyA9IHMucmVwbGFjZShjc3NfY29tYmluYXRvcnNfcmVnZXgsIGNzc19jb21iaW5hdG9yc19jYWxsYmFjayk7XG5cbiAgICAvLyBSZXBsYWNlIENTUyBhdHRyaWJ1dGUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UoY3NzX2F0dHJpYnV0ZXNfcmVnZXgsIGNzc19hdHRyaWJ1dGVzX2NhbGxiYWNrKTtcblxuICAgIC8vIFdyYXAgY2VydGFpbiA6cHNldWRvLWNsYXNzZXMgaW4gcGFyZW5zICh0byBjb2xsZWN0IG5vZGUtc2V0cylcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGluZGV4ID0gcy5zZWFyY2gocmVnZXhfY3NzX3dyYXBfcHNldWRvKTtcblxuICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gcy5pbmRleE9mKCc6JywgaW5kZXgpO1xuICAgICAgdmFyIHN0YXJ0ID0gc2VsZWN0b3JTdGFydChzLCBpbmRleCk7XG5cbiAgICAgIHMgPSBzLnN1YnN0cigwLCBzdGFydCkgK1xuICAgICAgICAgICAgJygnICsgcy5zdWJzdHJpbmcoc3RhcnQsIGluZGV4KSArICcpJyArXG4gICAgICAgICAgICBzLnN1YnN0cihpbmRleCk7XG4gICAgfVxuXG4gICAgLy8gUmVwbGFjZSA6cHNldWRvLWNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19wc2V1ZG9fY2xhc3Nlc19yZWdleCwgY3NzX3BzZXVkb19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlcGxhY2UgI2lkcyBhbmQgLmNsYXNzZXNcbiAgICBzID0gcy5yZXBsYWNlKGNzc19pZHNfY2xhc3Nlc19yZWdleCwgY3NzX2lkc19jbGFzc2VzX2NhbGxiYWNrKTtcblxuICAgIC8vIFJlc3RvcmUgdGhlIHNhdmVkIHN0cmluZyBsaXRlcmFsc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZXNjYXBlZF9saXRlcmFsLCBmdW5jdGlvbiAocywgYSkge1xuICAgICAgdmFyIHN0ciA9IGxpdGVyYWxzW2EubGVuZ3RoIC0gMV07XG5cbiAgICAgIHJldHVybiAnXCInICsgc3RyICsgJ1wiJztcbiAgICB9KVxuXG4gICAgLy8gUmVtb3ZlIGFueSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICBzID0gcy5yZXBsYWNlKHJlZ2V4X3NwZWNhbF9jaGFycywgJycpO1xuXG4gICAgLy8gYWRkICogdG8gc3RhbmQtYWxvbmUgZmlsdGVyc1xuICAgIHMgPSBzLnJlcGxhY2UocmVnZXhfZmlsdGVyX3ByZWZpeCwgJyQxKlsnKTtcblxuICAgIC8vIGFkZCBcIi9cIiBiZXR3ZWVuIEBhdHRyaWJ1dGUgc2VsZWN0b3JzXG4gICAgcyA9IHMucmVwbGFjZShyZWdleF9hdHRyX3ByZWZpeCwgJyQxL0AnKTtcblxuICAgIC8qXG4gICAgQ29tYmluZSBtdWx0aXBsZSBmaWx0ZXJzP1xuXG4gICAgcyA9IGVzY2FwZUNoYXIocywgJ1snLCAnXScsIGZpbHRlcl9jaGFyKTtcbiAgICBzID0gcy5yZXBsYWNlKC8oXFx4MUQrKVxcXVxcW1xcMSguKz9bXlxceDFEXSlcXDFcXF0vZywgJyBhbmQgKCQyKSQxXScpXG4gICAgKi9cblxuICAgIHMgPSBwcmVwZW5kQXhpcyhzLCAnLi8vJyk7IC8vIHByZXBlbmQgXCIuLy9cIiBheGlzIHRvIGJlZ2luaW5nIG9mIENTUyBzZWxlY3RvclxuICAgIHJldHVybiBzO1xuICB9XG5cblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gY3NzMnhwYXRoO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5jc3MyeHBhdGggPSBjc3MyeHBhdGg7XG4gIH1cblxufSkoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY3NzMnhwYXRoL2luZGV4LmpzIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmUgc2VsZWN0b3IgZm9yIGEgbm9kZS5cbiAqL1xuXG5pbXBvcnQgeyBlc2NhcGVWYWx1ZSB9IGZyb20gJy4vdXRpbGl0aWVzJ1xuXG5jb25zdCBkZWZhdWx0SWdub3JlID0ge1xuICBhdHRyaWJ1dGUgKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICByZXR1cm4gW1xuICAgICAgJ3N0eWxlJyxcbiAgICAgICdkYXRhLXJlYWN0aWQnLFxuICAgICAgJ2RhdGEtcmVhY3QtY2hlY2tzdW0nXG4gICAgXS5pbmRleE9mKGF0dHJpYnV0ZU5hbWUpID4gLTFcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMpIHtcblxuICBjb25zdCB7XG4gICAgcm9vdCA9IGRvY3VtZW50LFxuICAgIHNraXAgPSBudWxsLFxuICAgIHByaW9yaXR5ID0gWydpZCcsICdjbGFzcycsICdocmVmJywgJ3NyYyddLFxuICAgIGlnbm9yZSA9IHt9XG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcblxuICBjb25zdCBza2lwQ29tcGFyZSA9IHNraXAgJiYgKEFycmF5LmlzQXJyYXkoc2tpcCkgPyBza2lwIDogW3NraXBdKS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChlbGVtZW50KSA9PiBlbGVtZW50ID09PSBlbnRyeVxuICAgIH1cbiAgICByZXR1cm4gZW50cnlcbiAgfSlcblxuICBjb25zdCBza2lwQ2hlY2tzID0gKGVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gc2tpcCAmJiBza2lwQ29tcGFyZS5zb21lKChjb21wYXJlKSA9PiBjb21wYXJlKGVsZW1lbnQpKVxuICB9XG5cbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgdmFyIHByZWRpY2F0ZSA9IGlnbm9yZVt0eXBlXVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnZnVuY3Rpb24nKSByZXR1cm5cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZS50b1N0cmluZygpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgcHJlZGljYXRlID0gbmV3IFJlZ0V4cChlc2NhcGVWYWx1ZShwcmVkaWNhdGUpLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJykpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHByZWRpY2F0ZSA9IHByZWRpY2F0ZSA/IC8oPzopLyA6IC8uXi9cbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gKG5hbWUsIHZhbHVlKSA9PiBwcmVkaWNhdGUudGVzdCh2YWx1ZSlcbiAgfSlcblxuICB3aGlsZSAoZWxlbWVudCAhPT0gcm9vdCAmJiBlbGVtZW50Lm5vZGVUeXBlICE9PSAxMSkge1xuICAgIGlmIChza2lwQ2hlY2tzKGVsZW1lbnQpICE9PSB0cnVlKSB7XG4gICAgICAvLyB+IGdsb2JhbFxuICAgICAgaWYgKGNoZWNrQXR0cmlidXRlcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCByb290KSkgYnJlYWtcbiAgICAgIGlmIChjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgsIHJvb3QpKSBicmVha1xuXG4gICAgICAvLyB+IGxvY2FsXG4gICAgICBjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrVGFnKGVsZW1lbnQsIGlnbm9yZSwgcGF0aClcbiAgICAgIH1cblxuICAgICAgLy8gZGVmaW5lIG9ubHkgb25lIHBhcnQgZWFjaCBpdGVyYXRpb25cbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICAgIGNoZWNrQ2hpbGRzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG4gIH1cblxuICBpZiAoZWxlbWVudCA9PT0gcm9vdCkge1xuICAgIGNvbnN0IHBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKVxuICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpXG59XG5cbi8qKlxuICogRXh0ZW5kIHBhdGggd2l0aCBhdHRyaWJ1dGUgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBwYXJlbnQgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRBdHRyaWJ1dGVzUGF0dGVybihwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXJlbnQpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIEdldCBjbGFzcyBzZWxlY3RvclxuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBjbGFzc2VzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmc/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldENsYXNzU2VsZWN0b3IoY2xhc3NlcyA9IFtdLCBwYXJlbnQpIHtcbiAgbGV0IHJlc3VsdCA9IFtbXV1cblxuICBjbGFzc2VzLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgIHJlc3VsdC5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHIuY29uY2F0KCcuJyArIGMpKVxuICAgIH0pXG4gIH0pXG5cbiAgcmVzdWx0LnNoaWZ0KClcblxuICByZXN1bHQgPSByZXN1bHQuc29ydChmdW5jdGlvbihhLGIpIHsgcmV0dXJuIGEubGVuZ3RoIC0gYi5sZW5ndGggfSlcblxuICBmb3IobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHIgPSByZXN1bHRbaV0uam9pbignJylcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwocilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiByXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBMb29rdXAgYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmc/fSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGVzUGF0dGVybiAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IGF0dHJpYnV0ZXMgPSBlbGVtZW50LmF0dHJpYnV0ZXNcbiAgdmFyIGF0dHJpYnV0ZU5hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykubWFwKCh2YWwpID0+IGF0dHJpYnV0ZXNbdmFsXS5uYW1lKVxuICAgIC5maWx0ZXIoKGEpID0+IHByaW9yaXR5LmluZGV4T2YoYSkgPCAwKVxuXG4gIHZhciBzb3J0ZWRLZXlzID0gWyAuLi5wcmlvcml0eSwgLi4uYXR0cmlidXRlTmFtZXMgXVxuXG4gIHZhciB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLm5hbWUpXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBlc2NhcGVWYWx1ZShhdHRyaWJ1dGUgJiYgYXR0cmlidXRlLnZhbHVlKVxuICAgIGNvbnN0IHVzZU5hbWVkSWdub3JlID0gYXR0cmlidXRlTmFtZSAhPT0gJ2NsYXNzJ1xuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBpZ25vcmVbYXR0cmlidXRlTmFtZV0pIHx8IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBjb25zdCBjdXJyZW50RGVmYXVsdElnbm9yZSA9ICh1c2VOYW1lZElnbm9yZSAmJiBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdKSB8fCBkZWZhdWx0SWdub3JlLmF0dHJpYnV0ZVxuICAgIGlmIChjaGVja0lnbm9yZShjdXJyZW50SWdub3JlLCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSwgY3VycmVudERlZmF1bHRJZ25vcmUpKSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIHZhciBwYXR0ZXJuID0gYFske2F0dHJpYnV0ZU5hbWV9PVwiJHthdHRyaWJ1dGVWYWx1ZX1cIl1gXG4gICAgaWYoIWF0dHJpYnV0ZVZhbHVlLnRyaW0oKSkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ2lkJykge1xuICAgICAgcGF0dGVybiA9IGAjJHthdHRyaWJ1dGVWYWx1ZX1gXG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgIGxldCBjbGFzc05hbWVzID0gYXR0cmlidXRlVmFsdWUudHJpbSgpLnNwbGl0KC9cXHMrL2cpXG4gICAgICBjb25zdCBjbGFzc0lnbm9yZSA9IGlnbm9yZS5jbGFzcyB8fCBkZWZhdWx0SWdub3JlLmNsYXNzXG4gICAgICBpZiAoY2xhc3NJZ25vcmUpIHtcbiAgICAgICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZXMuZmlsdGVyKGNsYXNzTmFtZSA9PiAhY2xhc3NJZ25vcmUoY2xhc3NOYW1lKSlcbiAgICAgIH1cbiAgICAgIGlmIChjbGFzc05hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgcGF0dGVybiA9IGdldENsYXNzU2VsZWN0b3IoY2xhc3NOYW1lcywgcGFyZW50KVxuXG4gICAgICBpZiAoIXBhdHRlcm4pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFnTmFtZSArIHBhdHRlcm5cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZyAoZWxlbWVudCwgaWdub3JlLCBwYXRoLCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgY29uc3QgcGF0dGVybiA9IGZpbmRUYWdQYXR0ZXJuKGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBsZXQgbWF0Y2hlcyA9IFtdXG4gICAgbWF0Y2hlcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgICAgIGlmIChwYXR0ZXJuID09PSAnaWZyYW1lJykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIExvb2t1cCB0YWcgaWRlbnRpZmllclxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZmluZFRhZ1BhdHRlcm4gKGVsZW1lbnQsIGlnbm9yZSkge1xuICBjb25zdCB0YWdOYW1lID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgaWYgKGNoZWNrSWdub3JlKGlnbm9yZS50YWcsIG51bGwsIHRhZ05hbWUpKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gdGFnTmFtZVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggc3BlY2lmaWMgY2hpbGQgaWRlbnRpZmllclxuICpcbiAqIE5PVEU6ICdjaGlsZFRhZ3MnIGlzIGEgY3VzdG9tIHByb3BlcnR5IHRvIHVzZSBhcyBhIHZpZXcgZmlsdGVyIGZvciB0YWdzIHVzaW5nICdhZGFwdGVyLmpzJ1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwcmlvcml0eSAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgICBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBpZ25vcmUgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDaGlsZHMgKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkVGFncyB8fCBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgaWYgKGNoaWxkID09PSBlbGVtZW50KSB7XG4gICAgICBjb25zdCBjaGlsZFBhdHRlcm4gPSBmaW5kUGF0dGVybihwcmlvcml0eSwgY2hpbGQsIGlnbm9yZSlcbiAgICAgIGlmICghY2hpbGRQYXR0ZXJuKSB7XG4gICAgICAgIHJldHVybiBjb25zb2xlLndhcm4oYFxuICAgICAgICAgIEVsZW1lbnQgY291bGRuJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY29uc3QgcGF0dGVybiA9IGA+ICR7Y2hpbGRQYXR0ZXJufTpudGgtY2hpbGQoJHtpKzF9KWBcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKSB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lnbm9yZSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWF0Y2guanMiLCJleHBvcnQgeyBkZWZhdWx0IGFzIHNlbGVjdCwgZ2V0U2luZ2xlU2VsZWN0b3IsIGdldE11bHRpU2VsZWN0b3IgfSBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgb3B0aW1pemUgfSBmcm9tICcuL29wdGltaXplJ1xuZXhwb3J0ICogYXMgY29tbW9uIGZyb20gJy4vY29tbW9uJ1xuXG5leHBvcnQgKiBmcm9tICcuL3NlbGVjdCdcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=