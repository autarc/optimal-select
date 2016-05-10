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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = exports.optimize = exports.select = undefined;
	
	var _select2 = __webpack_require__(1);
	
	var _select3 = _interopRequireDefault(_select2);
	
	var _optimize2 = __webpack_require__(4);
	
	var _optimize3 = _interopRequireDefault(_optimize2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.select = _select3.default;
	exports.optimize = _optimize3.default;
	exports.default = _select3.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * # Select
	                                                                                                                                                                                                                                                   *
	                                                                                                                                                                                                                                                   * Construct a unique CSS queryselector to access the selected DOM element(s).
	                                                                                                                                                                                                                                                   * Applies different matching and optimization strategies for efficiency.
	                                                                                                                                                                                                                                                   */
	
	exports.default = getQuerySelector;
	exports.getSingleSelector = getSingleSelector;
	exports.getMultiSelector = getMultiSelector;
	
	var _adapt = __webpack_require__(2);
	
	var _adapt2 = _interopRequireDefault(_adapt);
	
	var _match = __webpack_require__(3);
	
	var _match2 = _interopRequireDefault(_match);
	
	var _optimize = __webpack_require__(4);
	
	var _optimize2 = _interopRequireDefault(_optimize);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Choose action depending on the input (single/multi)
	 * @param  {HTMLElement|Array} input   - [description]
	 * @param  {Object}            options - [description]
	 * @return {string}                    - [description]
	 */
	function getQuerySelector(input) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (Array.isArray(input)) {
	    return getMultiSelector(input, options);
	  }
	  return getSingleSelector(input, options);
	}
	
	/**
	 * Get a selector for the provided element
	 * @param  {HTMLElement} element - [description]
	 * @param  {Object}      options - [description]
	 * @return {String}              - [description]
	 */
	function getSingleSelector(element, options) {
	
	  if (element.nodeType === 3) {
	    return getSingleSelector(element.parentNode);
	  }
	  if (element.nodeType !== 1) {
	    throw new Error('Invalid input - only HTMLElements or representations of them are supported! (not "' + (typeof element === 'undefined' ? 'undefined' : _typeof(element)) + '")');
	  }
	
	  var globalModified = (0, _adapt2.default)(element, options);
	
	  var selector = (0, _match2.default)(element, options);
	  var optimized = (0, _optimize2.default)(selector, element, options);
	
	  // debug
	  // console.log(`
	  //   selector: ${selector}
	  //   optimized:${optimized}
	  // `)
	
	  if (globalModified) {
	    delete global.document;
	  }
	
	  return optimized;
	}
	
	/**
	 * Get a selector to match multiple children from a parent
	 * @param  {Array}  elements - [description]
	 * @param  {Object} options  - [description]
	 * @return {string}          - [description]
	 */
	function getMultiSelector(elements, options) {
	  var firstEl = elements[0];
	  var commonClassName = firstEl.className;
	  var commonTagName = firstEl.tagName;
	  var candidate = void 0;
	
	  var getParentNodes = function getParentNodes(el) {
	    var nodes = [];
	    while (el.parentNode && el.parentNode !== document.body) {
	      el = el.parentNode;
	      nodes.push(el);
	    }
	    return nodes;
	  };
	
	  var findSimilarParents = function findSimilarParents(props1, props2) {
	    var similar = [];
	    var i = void 0,
	        j = void 0;
	    for (i = 0; i < props1.length; i++) {
	      node1 = props1[i];
	      for (j = 0; j < props2.length; j++) {
	        node2 = props2[j];
	        if (node1 === node2 || node1.tagName === node2.tagName && node1.className === node2.className) {
	          similar.push(node1);
	          similar.concat(findSimilarParents(props1.slice(i), props2.slice(j)));
	          return similar;
	        }
	      }
	    }
	    return similar;
	  };
	
	  var commonParentNodes = getParentNodes(firstEl);
	
	  for (var i = 1; i < elements.length; i++) {
	    var _candidate = elements[i];
	    commonParentNodes = (commonParentNodes, getParentNodes(_candidate));
	    console.log(commonParentNodes);
	
	    if (_candidate.className !== commonClassName) {
	      (function () {
	        var classNames = [];
	
	        var longer = void 0,
	            shorter = void 0;
	        if (_candidate.className.length > commonClassName.length) {
	          longer = _candidate.className;
	          shorter = commonClassName;
	        } else {
	          longer = commonClassName;
	          shorter = _candidate.className;
	        }
	        shorter.split(' ').forEach(function (name) {
	          if (longer.indexOf(name) > -1) {
	            classNames.push(name);
	          }
	        });
	        commonClassName = classNames.join(' ');
	      })();
	    }
	
	    if (_candidate.tagName !== commonTagName) {
	      commonTagName = null;
	    }
	  }
	
	  var selectors = [];
	  if (commonParentNodes) {
	    var parentSelectors = commonParentNodes.map(function (el) {
	      var selector = el.tagName;
	      if (el.id !== '') {
	        selector += '#' + el.id;
	      } else if (el.className !== '') {
	        selector += '.' + el.className;
	      }
	      return selector + ' ';
	    });
	    parentSelectors.reverse();
	
	    // lets attempt to make the selector shorter
	    var originalCount = document.querySelectorAll(parentSelectors.join(' ')).length;
	    while (parentSelectors.length > 2) {
	      var candidateForRemoval = parentSelectors.shift();
	      var newCount = document.querySelectorAll(parentSelectors.join(' ')).length;
	      if (newCount !== originalCount) {
	        parentSelectors.unshift(candidateForRemoval);
	        break;
	      }
	    }
	    selectors.push(parentSelectors.join(' ') + ' ');
	  }
	  if (commonTagName) {
	    selectors.push('' + commonTagName.toLowerCase());
	  }
	  if (commonClassName) {
	    selectors.push('.' + commonClassName.replace(/ /g, '.'));
	  }
	  if (selectors.length === 0) {
	    selectors = elements.map(function (e) {
	      return getSingleSelector(e, options);
	    });
	    console.log(selectors.join(','), commonClassName, commonTagName);
	    return selectors.join(',');
	  } else {
	    console.log(selectors.join(''), commonClassName, commonTagName);
	    return selectors.join('');
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.default = adapt;
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
	
	/**
	 * # Universal
	 *
	 * Check and extend the environment for universal usage
	 */
	
	/**
	 * [adapt description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	function adapt(element, options) {
	
	  // detect environment setup
	  if (global.document) {
	    return false;
	  }
	
	  var context = options.context;
	
	
	  global.document = context || function () {
	    var root = element;
	    while (root.parent) {
	      root = root.parent;
	    }
	    return root;
	  }();
	
	  // https://github.com/fb55/domhandler/blob/master/index.js#L75
	  var ElementPrototype = Object.getPrototypeOf(global.document);
	
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
	
	      var _getInstructions = getInstructions(selectors);
	
	      var _getInstructions2 = _toArray(_getInstructions);
	
	      var discover = _getInstructions2[0];
	
	      var ascendings = _getInstructions2.slice(1);
	
	      var total = ascendings.length;
	      return discover(this).filter(function (node) {
	        var step = 0;
	        while (step < total) {
	          node = ascendings[step](node, _this);
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
	 * [getInstructions description]
	 * @param  {[type]} selectors [description]
	 * @return {[type]}           [description]
	 */
	function getInstructions(selectors) {
	  return selectors.split(' ').reverse().map(function (selector, step) {
	    var discover = step === 0;
	
	    var _selector$split = selector.split(':');
	
	    var _selector$split2 = _slicedToArray(_selector$split, 2);
	
	    var type = _selector$split2[0];
	    var pseudo = _selector$split2[1];
	
	
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
	        var _type$replace$split = type.replace(/\[|\]|"/g, '').split('=');
	
	        var _type$replace$split2 = _slicedToArray(_type$replace$split, 2);
	
	        var attributeKey = _type$replace$split2[0];
	        var attributeValue = _type$replace$split2[1];
	
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
	            var _ret = function () {
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
	
	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
	            var _ret2 = function () {
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
	
	            if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
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
	            var _ret3 = function () {
	              var NodeList = [];
	              traverseDescendants([node], function (descendant) {
	                return NodeList.push(descendant);
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
	
	      // tag: '...'
	      default:
	        validate = function validate(node) {
	          return node.name === type;
	        };
	        instruction = function checkTag(node, root) {
	          if (discover) {
	            var _ret4 = function () {
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
	
	            if ((typeof _ret4 === 'undefined' ? 'undefined' : _typeof(_ret4)) === "object") return _ret4.v;
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
	 * Recursive walki
	 * @param  {[type]} nodes   [description]
	 * @param  {[type]} handler [description]
	 * @return {[type]}         [description]
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
	 * [getAncestor description]
	 * @param  {[type]} node     [description]
	 * @param  {[type]} root     [description]
	 * @param  {[type]} validate [description]
	 * @return {[type]}          [description]
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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = match;
	/**
	 * # Match
	 *
	 * Retrieves selector
	 */
	
	var defaultIgnore = {
	  attribute: function attribute(attributeName) {
	    return ['style', 'data-reactid', 'data-react-checksum'].indexOf(attributeName) > -1;
	  }
	};
	
	/**
	 * Get the path of the element
	 * @param  {HTMLElement} node    - [description]
	 * @param  {Object}      options - [description]
	 * @return {String}              - [description]
	 */
	function match(node, options) {
	  var path = [];
	  var element = node;
	  var length = path.length;
	
	  var _options$ignore = options.ignore;
	  var ignore = _options$ignore === undefined ? {} : _options$ignore;
	
	
	  var ignoreClass = false;
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
	      predicate = new RegExp(predicate);
	    }
	    // check class-/attributename for regex
	    ignore[type] = predicate.test.bind(predicate);
	  });
	  if (ignoreClass) {
	    (function () {
	      var ignoreAttribute = ignore.attribute;
	      ignore.attribute = function (name, value, defaultPredicate) {
	        return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate);
	      };
	    })();
	  }
	
	  while (element !== document) {
	    // global
	    if (checkId(element, path, ignore)) break;
	    if (checkClassGlobal(element, path, ignore)) break;
	    if (checkAttributeGlobal(element, path, ignore)) break;
	    if (checkTagGlobal(element, path, ignore)) break;
	
	    // local
	    checkClassLocal(element, path, ignore);
	
	    // define only one selector each iteration
	    if (path.length === length) {
	      checkAttributeLocal(element, path, ignore);
	    }
	    if (path.length === length) {
	      checkTagLocal(element, path, ignore);
	    }
	
	    if (path.length === length) {
	      checkClassChild(element, path, ignore);
	    }
	    if (path.length === length) {
	      checkAttributeChild(element, path, ignore);
	    }
	    if (path.length === length) {
	      checkTagChild(element, path, ignore);
	    }
	
	    element = element.parentNode;
	    length = path.length;
	  }
	
	  if (element === document) {
	    path.unshift('*');
	  }
	
	  return path.join(' ');
	}
	
	/**
	 * [checkClassGlobal description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkClassGlobal(element, path, ignore) {
	  return checkClass(element, path, ignore, document);
	}
	
	/**
	 * [checkClassLocal description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkClassLocal(element, path, ignore) {
	  return checkClass(element, path, ignore, element.parentNode);
	}
	
	/**
	 * [checkClassChild description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkClassChild(element, path, ignore) {
	  var className = element.getAttribute('class');
	  if (checkIgnore(ignore.class, className)) {
	    return false;
	  }
	  return checkChild(element, path, '.' + className.trim().replace(/\s+/g, '.'));
	}
	
	/**
	 * [checkAttributeGlobal description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkAttributeGlobal(element, path, ignore) {
	  return checkAttribute(element, path, ignore, document);
	}
	
	/**
	 * [checkAttributeLocal description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkAttributeLocal(element, path, ignore) {
	  return checkAttribute(element, path, ignore, element.parentNode);
	}
	
	/**
	 * [checkAttributeChild description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkAttributeChild(element, path, ignore) {
	  var attributes = element.attributes;
	  return Object.keys(attributes).some(function (key) {
	    var attribute = attributes[key];
	    var attributeName = attribute.name;
	    var attributeValue = attribute.value;
	    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
	      return false;
	    }
	    var pattern = '[' + attributeName + '="' + attributeValue + '"]';
	    return checkChild(element, path, pattern);
	  });
	}
	
	/**
	 * [checkTagGlobal description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkTagGlobal(element, path, ignore) {
	  return checkTag(element, path, ignore, document);
	}
	
	/**
	 * [checkTagLocal description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkTagLocal(element, path, ignore) {
	  return checkTag(element, path, ignore, element.parentNode);
	}
	
	/**
	 * [checkTabChildren description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkTagChild(element, path, ignore) {
	  var tagName = element.tagName.toLowerCase();
	  if (checkIgnore(ignore.tag, tagName)) {
	    return false;
	  }
	  return checkChild(element, path, tagName);
	}
	
	/**
	 * [checkId description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkId(element, path, ignore) {
	  var id = element.getAttribute('id');
	  if (checkIgnore(ignore.id, id)) {
	    return false;
	  }
	  path.unshift('#' + id);
	  return true;
	}
	
	/**
	 * [checkClass description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @param  {HTMLElement} parent  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkClass(element, path, ignore, parent) {
	  var className = element.getAttribute('class');
	  if (checkIgnore(ignore.class, className)) {
	    return false;
	  }
	  var matches = parent.getElementsByClassName(className);
	  if (matches.length === 1) {
	    path.unshift('.' + className.trim().replace(/\s+/g, '.'));
	    return true;
	  }
	  return false;
	}
	
	/**
	 * [checkAttribute description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {Object}      ignore  - [description]
	 * @param  {HTMLElement} parent  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkAttribute(element, path, ignore, parent) {
	  var attributes = element.attributes;
	  return Object.keys(attributes).some(function (key) {
	    var attribute = attributes[key];
	    var attributeName = attribute.name;
	    var attributeValue = attribute.value;
	    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
	      return false;
	    }
	    var pattern = '[' + attributeName + '="' + attributeValue + '"]';
	    var matches = parent.querySelectorAll(pattern);
	    if (matches.length === 1) {
	      path.unshift(pattern);
	      return true;
	    }
	  });
	}
	
	/**
	 * [checkTag description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array}       path    - [description]
	 * @param  {HTMLElement} parent  - [description]
	 * @param  {Object}      ignore  - [description]
	 * @return {Boolean}             - [description]
	 */
	function checkTag(element, path, ignore, parent) {
	  var tagName = element.tagName.toLowerCase();
	  if (checkIgnore(ignore.tag, tagName)) {
	    return false;
	  }
	  var matches = parent.getElementsByTagName(tagName);
	  if (matches.length === 1) {
	    path.unshift(tagName);
	    return true;
	  }
	  return false;
	}
	
	/**
	 * [checkChild description]
	 * Note: childTags is a custom property to use a view filter for tags on for virutal elements
	 * @param  {HTMLElement} element  - [description]
	 * @param  {Array}       path     - [description]
	 * @param  {String}      selector - [description]
	 * @return {Boolean}              - [description]
	 */
	function checkChild(element, path, selector) {
	  var parent = element.parentNode;
	  var children = parent.childTags || parent.children;
	  for (var i = 0, l = children.length; i < l; i++) {
	    if (children[i] === element) {
	      path.unshift('> ' + selector + ':nth-child(' + (i + 1) + ')');
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * [checkIgnore description]
	 * @param  {Function} predicate        [description]
	 * @param  {string}   name             [description]
	 * @param  {string}   value            [description]
	 * @param  {Function} defaultPredicate [description]
	 * @return {boolean}                   [description]
	 */
	function checkIgnore(predicate, name, value, defaultPredicate) {
	  if (!name) {
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

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = optimize;
	
	var _adapt = __webpack_require__(2);
	
	var _adapt2 = _interopRequireDefault(_adapt);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Apply different optimization techniques
	 * @param  {string}      selector - [description]
	 * @param  {HTMLElement} element  - [description]
	 * @return {string}               - [description]
	 */
	function optimize(selector, element) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	
	  var globalModified = (0, _adapt2.default)(element, options);
	
	  // chunk parts outside of quotes (http://stackoverflow.com/a/25663729)
	  var path = selector.replace(/> /g, '>').split(/\s+(?=(?:(?:[^"]*"){2})*[^"]*$)/);
	
	  if (path.length < 3) {
	    return selector;
	  }
	
	  var shortened = [path.pop()];
	  while (path.length > 1) {
	    var current = path.pop();
	    var prePart = path.join(' ');
	    var postPart = shortened.join(' ');
	
	    var pattern = prePart + ' ' + postPart;
	    var matches = document.querySelectorAll(pattern);
	    if (matches.length !== 1) {
	      shortened.unshift(optimizePart(prePart, current, postPart, element));
	    }
	  }
	  shortened.unshift(path[0]);
	  path = shortened;
	
	  // optimize start + end
	  path[0] = optimizePart('', path[0], path.slice(1).join(' '), element);
	  path[path.length - 1] = optimizePart(path.slice(0, -1).join(' '), path[path.length - 1], '', element);
	
	  if (globalModified) {
	    delete global.document;
	  }
	
	  return path.join(' ').replace(/>/g, '> ').trim();
	}
	
	/**
	 * Improve a chunk of the selector
	 * @param  {string}      prePart  - [description]
	 * @param  {string}      current  - [description]
	 * @param  {string}      postPart - [description]
	 * @param  {HTMLElement} element  - [description]
	 * @return {string}               - [description]
	 */
	/**
	 * # Optimize
	 *
	 * 1.) Improve efficiency through shorter selectors by removing redundancy
	 * 2.) Improve robustness through selector transformation
	 */
	
	function optimizePart(prePart, current, postPart, element) {
	  if (prePart.length) prePart = prePart + ' ';
	  if (postPart.length) postPart = ' ' + postPart;
	
	  // robustness: attribute without value (generalization)
	  if (/\[*\]/.test(current)) {
	    var key = current.replace(/=.*$/, ']');
	    var pattern = '' + prePart + key + postPart;
	    var matches = document.querySelectorAll(pattern);
	    if (matches.length === 1 && matches[0] === element) {
	      current = key;
	    } else {
	      // robustness: replace specific key-value with tag (heuristic)
	      var references = document.querySelectorAll('' + prePart + key);
	      for (var i = 0, l = references.length; i < l; i++) {
	        if (references[i].contains(element)) {
	          var description = references[i].tagName.toLowerCase();
	          var pattern = '' + prePart + description + postPart;
	          var matches = document.querySelectorAll(pattern);
	          if (matches.length === 1 && matches[0] === element) {
	            current = description;
	          }
	          break;
	        }
	      }
	    }
	  }
	
	  // robustness: descendant instead child (heuristic)
	  if (/>/.test(current)) {
	    var descendant = current.replace(/>/, '');
	    var pattern = '' + prePart + descendant + postPart;
	    var matches = document.querySelectorAll(pattern);
	    if (matches.length === 1 && matches[0] === element) {
	      current = descendant;
	    }
	  }
	
	  // robustness: 'nth-of-type' instead 'nth-child' (heuristic)
	  if (/:nth-child/.test(current)) {
	    // TODO: consider complete coverage of 'nth-of-type' replacement
	    var type = current.replace(/nth-child/g, 'nth-of-type');
	    var pattern = '' + prePart + type + postPart;
	    var matches = document.querySelectorAll(pattern);
	    if (matches.length === 1 && matches[0] === element) {
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
	      var partial = current.replace(names.shift(), '');
	      var pattern = '' + prePart + partial + postPart;
	      var matches = document.querySelectorAll(pattern);
	      if (matches.length === 1 && matches[0] === element) {
	        current = partial;
	      }
	    }
	    // robustness: degrade complex classname (heuristic)
	    if (current && current.match(/\./g).length > 2) {
	      var _references = document.querySelectorAll('' + prePart + current);
	      for (var i = 0, l = _references.length; i < l; i++) {
	        if (_references[i].contains(element)) {
	          // TODO:
	          // - check using attributes + regard excludes
	          var _description = _references[i].tagName.toLowerCase();
	          var pattern = '' + prePart + _description + postPart;
	          var matches = document.querySelectorAll(pattern);
	          if (matches.length === 1 && matches[0] === element) {
	            current = _description;
	          }
	          break;
	        }
	      }
	    }
	  }
	
	  return current;
	}
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmY2Q2ZWJkNWJlNmQ4YjE5OTI3YSIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlbGVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYWRhcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21hdGNoLmpzIiwid2VicGFjazovLy8uL3NyYy9vcHRpbWl6ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQ3RDTyxNO1NBQ0EsUTtTQUVBLE87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUJDY2lCLGdCO1NBYVIsaUIsR0FBQSxpQjtTQWlDQSxnQixHQUFBLGdCOztBQXhEaEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFRZSxVQUFTLGdCQUFULENBQTJCLEtBQTNCLEVBQWdEO0FBQUEsT0FBZCxPQUFjLHlEQUFKLEVBQUk7O0FBQzdELE9BQUksTUFBTSxPQUFOLENBQWMsS0FBZCxDQUFKLEVBQTBCO0FBQ3hCLFlBQU8saUJBQWlCLEtBQWpCLEVBQXdCLE9BQXhCLENBQVA7QUFDRDtBQUNELFVBQU8sa0JBQWtCLEtBQWxCLEVBQXlCLE9BQXpCLENBQVA7QUFDRDs7Ozs7Ozs7QUFRTSxVQUFTLGlCQUFULENBQTRCLE9BQTVCLEVBQXFDLE9BQXJDLEVBQThDOztB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QXZCLENBQUosRUFBcUM7OztBQUduQyxlQUFNLGVBQWMsWUFBVyxDQUFYLEVBQWMsT0FBZCxDQUFzQixXQUF0QixFQUFwQjtBQUNBLGVBQUksZUFBYSxPQUFiLEdBQXVCLFlBQXZCLEdBQXFDLFFBQXpDO0FBQ0EsZUFBSSxVQUFVLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsQ0FBZDtBQUNBLGVBQUksUUFBUSxNQUFSLEtBQW1CLENBQW5CLElBQXdCLFFBQVEsQ0FBUixNQUFlLE9BQTNDLEVBQW9EO0FBQ2xELHVCQUFVLFlBQVY7QUFDRDtBQUNEO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7O0FBRUQsVUFBTyxPQUFQO0FBQ0QiLCJmaWxlIjoib3B0aW1hbC1zZWxlY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJPcHRpbWFsU2VsZWN0XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk9wdGltYWxTZWxlY3RcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGZjZDZlYmQ1YmU2ZDhiMTk5MjdhXG4gKiovIiwiZXhwb3J0IHNlbGVjdCBmcm9tICcuL3NlbGVjdCdcbmV4cG9ydCBvcHRpbWl6ZSBmcm9tICcuL29wdGltaXplJ1xuXG5leHBvcnQgZGVmYXVsdCBmcm9tICcuL3NlbGVjdCdcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIiwiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnlzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogQXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzIGZvciBlZmZpY2llbmN5LlxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKHNpbmdsZS9tdWx0aSlcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICByZXR1cm4gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGVsZW1lbnQucGFyZW50Tm9kZSlcbiAgfVxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiR7b3B0aW1pemVkfVxuICAvLyBgKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZWRcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBjaGlsZHJlbiBmcm9tIGEgcGFyZW50XG4gKiBAcGFyYW0gIHtBcnJheX0gIGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdWx0aVNlbGVjdG9yIChlbGVtZW50cywgb3B0aW9ucykge1xuICBjb25zdCBmaXJzdEVsID0gZWxlbWVudHNbMF07XG4gIGxldCBjb21tb25DbGFzc05hbWUgPSBmaXJzdEVsLmNsYXNzTmFtZTtcbiAgbGV0IGNvbW1vblRhZ05hbWUgPSBmaXJzdEVsLnRhZ05hbWU7XG4gIGxldCBjYW5kaWRhdGU7XG5cbiAgY29uc3QgZ2V0UGFyZW50Tm9kZXMgPSBmdW5jdGlvbihlbCkge1xuICAgIGNvbnN0IG5vZGVzID0gW107XG4gICAgd2hpbGUoZWwucGFyZW50Tm9kZSAmJiBlbC5wYXJlbnROb2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICBub2Rlcy5wdXNoKGVsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgY29uc3QgZmluZFNpbWlsYXJQYXJlbnRzID0gZnVuY3Rpb24ocHJvcHMxLCBwcm9wczIpIHtcbiAgICBjb25zdCBzaW1pbGFyID0gW107XG4gICAgbGV0IGksIGo7XG4gICAgZm9yIChpID0gMDsgaSA8IHByb3BzMS5sZW5ndGg7IGkrKykge1xuICAgICAgbm9kZTEgPSBwcm9wczFbaV07XG4gICAgICBmb3IgKGogPSAwOyBqIDwgcHJvcHMyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIG5vZGUyID0gcHJvcHMyW2pdO1xuICAgICAgICBpZiAobm9kZTEgPT09IG5vZGUyIHx8IChub2RlMS50YWdOYW1lID09PSBub2RlMi50YWdOYW1lICYmIG5vZGUxLmNsYXNzTmFtZSA9PT0gbm9kZTIuY2xhc3NOYW1lKSkge1xuICAgICAgICAgIHNpbWlsYXIucHVzaChub2RlMSk7XG4gICAgICAgICAgc2ltaWxhci5jb25jYXQoZmluZFNpbWlsYXJQYXJlbnRzKHByb3BzMS5zbGljZShpKSwgcHJvcHMyLnNsaWNlKGopKSk7XG4gICAgICAgICAgcmV0dXJuIHNpbWlsYXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNpbWlsYXI7XG4gIH1cblxuXG4gIGxldCBjb21tb25QYXJlbnROb2RlcyA9IGdldFBhcmVudE5vZGVzKGZpcnN0RWwpO1xuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBlbGVtZW50c1tpXTtcbiAgICBjb21tb25QYXJlbnROb2RlcyA9IChjb21tb25QYXJlbnROb2RlcywgZ2V0UGFyZW50Tm9kZXMoY2FuZGlkYXRlKSk7XG4gICAgY29uc29sZS5sb2coY29tbW9uUGFyZW50Tm9kZXMpO1xuXG4gICAgaWYgKGNhbmRpZGF0ZS5jbGFzc05hbWUgIT09IGNvbW1vbkNsYXNzTmFtZSkge1xuICAgICAgbGV0IGNsYXNzTmFtZXMgPSBbXTtcblxuICAgICAgbGV0IGxvbmdlciwgc2hvcnRlclxuICAgICAgaWYgKGNhbmRpZGF0ZS5jbGFzc05hbWUubGVuZ3RoID4gY29tbW9uQ2xhc3NOYW1lLmxlbmd0aCkge1xuICAgICAgICBsb25nZXIgPSBjYW5kaWRhdGUuY2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBjb21tb25DbGFzc05hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvbmdlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgICBzaG9ydGVyID0gY2FuZGlkYXRlLmNsYXNzTmFtZVxuICAgICAgfVxuICAgICAgc2hvcnRlci5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlci5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgICBjbGFzc05hbWVzLnB1c2gobmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbW1vbkNsYXNzTmFtZSA9IGNsYXNzTmFtZXMuam9pbignICcpXG4gICAgfVxuXG4gICAgaWYgKGNhbmRpZGF0ZS50YWdOYW1lICE9PSBjb21tb25UYWdOYW1lKSB7XG4gICAgICBjb21tb25UYWdOYW1lID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGxldCBzZWxlY3RvcnMgPSBbXTtcbiAgaWYgKGNvbW1vblBhcmVudE5vZGVzKSB7XG4gICAgY29uc3QgcGFyZW50U2VsZWN0b3JzID0gY29tbW9uUGFyZW50Tm9kZXMubWFwKGVsID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IGVsLnRhZ05hbWU7XG4gICAgICBpZiAoZWwuaWQgIT09ICcnKSB7XG4gICAgICAgIHNlbGVjdG9yICs9ICcjJyArIGVsLmlkO1xuICAgICAgfSBlbHNlIGlmIChlbC5jbGFzc05hbWUgIT09ICcnKSB7XG4gICAgICAgIHNlbGVjdG9yICs9ICcuJyArIGVsLmNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvciArICcgJztcbiAgICB9KTtcbiAgICBwYXJlbnRTZWxlY3RvcnMucmV2ZXJzZSgpO1xuXG4gICAgLy8gbGV0cyBhdHRlbXB0IHRvIG1ha2UgdGhlIHNlbGVjdG9yIHNob3J0ZXJcbiAgICBjb25zdCBvcmlnaW5hbENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJlbnRTZWxlY3RvcnMuam9pbignICcpKS5sZW5ndGg7XG4gICAgd2hpbGUocGFyZW50U2VsZWN0b3JzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZUZvclJlbW92YWwgPSBwYXJlbnRTZWxlY3RvcnMuc2hpZnQoKTtcbiAgICAgIGNvbnN0IG5ld0NvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJlbnRTZWxlY3RvcnMuam9pbignICcpKS5sZW5ndGg7XG4gICAgICBpZiAobmV3Q291bnQgIT09IG9yaWdpbmFsQ291bnQpIHtcbiAgICAgICAgcGFyZW50U2VsZWN0b3JzLnVuc2hpZnQoY2FuZGlkYXRlRm9yUmVtb3ZhbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxlY3RvcnMucHVzaChwYXJlbnRTZWxlY3RvcnMuam9pbignICcpICsgJyAnKTtcbiAgfVxuICBpZiAoY29tbW9uVGFnTmFtZSkge1xuICAgIHNlbGVjdG9ycy5wdXNoKGAke2NvbW1vblRhZ05hbWUudG9Mb3dlckNhc2UoKX1gKTtcbiAgfVxuICBpZiAoY29tbW9uQ2xhc3NOYW1lKSB7XG4gICAgc2VsZWN0b3JzLnB1c2goYC4ke2NvbW1vbkNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YCk7XG4gIH1cbiAgaWYgKHNlbGVjdG9ycy5sZW5ndGggPT09IDApIHtcbiAgICBzZWxlY3RvcnMgPSBlbGVtZW50cy5tYXAoZSA9PiBnZXRTaW5nbGVTZWxlY3RvcihlLCBvcHRpb25zKSk7XG4gICAgY29uc29sZS5sb2coc2VsZWN0b3JzLmpvaW4oJywnKSwgY29tbW9uQ2xhc3NOYW1lLCBjb21tb25UYWdOYW1lKTtcbiAgICByZXR1cm4gc2VsZWN0b3JzLmpvaW4oJywnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhzZWxlY3RvcnMuam9pbignJyksIGNvbW1vbkNsYXNzTmFtZSwgY29tbW9uVGFnTmFtZSk7XG4gICAgcmV0dXJuIHNlbGVjdG9ycy5qb2luKCcnKTtcbiAgfVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2VsZWN0LmpzXG4gKiovIiwiLyoqXG4gKiAjIFVuaXZlcnNhbFxuICpcbiAqIENoZWNrIGFuZCBleHRlbmQgdGhlIGVudmlyb25tZW50IGZvciB1bml2ZXJzYWwgdXNhZ2VcbiAqL1xuXG4vKipcbiAqIFthZGFwdCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gZWxlbWVudCBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IG9wdGlvbnMgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRhcHQgKGVsZW1lbnQsIG9wdGlvbnMpIHtcblxuICAvLyBkZXRlY3QgZW52aXJvbm1lbnQgc2V0dXBcbiAgaWYgKGdsb2JhbC5kb2N1bWVudCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgeyBjb250ZXh0IH0gPSBvcHRpb25zXG5cbiAgZ2xvYmFsLmRvY3VtZW50ID0gY29udGV4dCB8fCAoKCkgPT4ge1xuICAgIHZhciByb290ID0gZWxlbWVudFxuICAgIHdoaWxlIChyb290LnBhcmVudCkge1xuICAgICAgcm9vdCA9IHJvb3QucGFyZW50XG4gICAgfVxuICAgIHJldHVybiByb290XG4gIH0pKClcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21oYW5kbGVyL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0w3NVxuICBjb25zdCBFbGVtZW50UHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbC5kb2N1bWVudClcblxuICAvLyBhbHRlcm5hdGl2ZSBkZXNjcmlwdG9yIHRvIGFjY2VzcyBlbGVtZW50cyB3aXRoIGZpbHRlcmluZyBpbnZhbGlkIGVsZW1lbnRzIChlLmcuIHRleHRub2RlcylcbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWVsZW1lbnR0eXBlL2Jsb2IvbWFzdGVyL2luZGV4LmpzI0wxMlxuICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPT09ICd0YWcnIHx8IG5vZGUudHlwZSA9PT0gJ3NjcmlwdCcgfHwgbm9kZS50eXBlID09PSAnc3R5bGUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycpKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0cmlidXRlc1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9OYW1lZE5vZGVNYXBcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgY29uc3QgeyBhdHRyaWJzIH0gPSB0aGlzXG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXNOYW1lcyA9IE9iamVjdC5rZXlzKGF0dHJpYnMpXG4gICAgICAgIGNvbnN0IE5hbWVkTm9kZU1hcCA9IGF0dHJpYnV0ZXNOYW1lcy5yZWR1Y2UoKGF0dHJpYnV0ZXMsIGF0dHJpYnV0ZU5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgYXR0cmlidXRlc1tpbmRleF0gPSB7XG4gICAgICAgICAgICBuYW1lOiBhdHRyaWJ1dGVOYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGF0dHJpYnNbYXR0cmlidXRlTmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZXNcbiAgICAgICAgfSwgeyB9KVxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmFtZWROb2RlTWFwLCAnbGVuZ3RoJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IGF0dHJpYnV0ZXNOYW1lcy5sZW5ndGhcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIE5hbWVkTm9kZU1hcFxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEF0dHJpYnV0ZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHJpYnNbbmFtZV0gfHwgbnVsbFxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyh0aGlzLmNoaWxkVGFncywgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQubmFtZSA9PT0gdGFnTmFtZSB8fCB0YWdOYW1lID09PSAnKicpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRG9jdW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUgPSBmdW5jdGlvbiAoY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBuYW1lcyA9IGNsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnICcpLnNwbGl0KCcgJylcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBjb25zdCBkZXNjZW5kYW50Q2xhc3NOYW1lID0gZGVzY2VuZGFudC5hdHRyaWJzLmNsYXNzXG4gICAgICAgIGlmIChkZXNjZW5kYW50Q2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBkZXNjZW5kYW50Q2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSkpIHtcbiAgICAgICAgICBIVE1MQ29sbGVjdGlvbi5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gSFRNTENvbGxlY3Rpb25cbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9jc3Mvc2VsZWN0b3JzX2FwaS9xdWVyeVNlbGVjdG9yQWxsXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvcXVlcnlTZWxlY3RvckFsbFxuICAgIEVsZW1lbnRQcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IGZ1bmN0aW9uIChzZWxlY3RvcnMpIHtcbiAgICAgIHNlbGVjdG9ycyA9IHNlbGVjdG9ycy5yZXBsYWNlKC8oPikoXFxTKS9nLCAnJDEgJDInKS50cmltKCkgLy8gYWRkIHNwYWNlIGZvciAnPicgc2VsZWN0b3JcblxuICAgICAgLy8gdXNpbmcgcmlnaHQgdG8gbGVmdCBleGVjdXRpb24gPT4gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvY3NzLXNlbGVjdCNob3ctZG9lcy1pdC13b3JrXG4gICAgICBjb25zdCBbZGlzY292ZXIsIC4uLmFzY2VuZGluZ3NdID0gZ2V0SW5zdHJ1Y3Rpb25zKHNlbGVjdG9ycylcbiAgICAgIGNvbnN0IHRvdGFsID0gYXNjZW5kaW5ncy5sZW5ndGhcbiAgICAgIHJldHVybiBkaXNjb3Zlcih0aGlzKS5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgdmFyIHN0ZXAgPSAwXG4gICAgICAgIHdoaWxlIChzdGVwIDwgdG90YWwpIHtcbiAgICAgICAgICBub2RlID0gYXNjZW5kaW5nc1tzdGVwXShub2RlLCB0aGlzKVxuICAgICAgICAgIGlmICghbm9kZSkgeyAvLyBoaWVyYXJjaHkgZG9lc24ndCBtYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0ZXAgKz0gMVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5jb250YWlucykge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NvbnRhaW5zXG4gICAgRWxlbWVudFByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICB2YXIgaW5jbHVzaXZlID0gZmFsc2VcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW3RoaXNdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudCA9PT0gZWxlbWVudCkge1xuICAgICAgICAgIGluY2x1c2l2ZSA9IHRydWVcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBpbmNsdXNpdmVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZVxufVxuXG4vKipcbiAqIFtnZXRJbnN0cnVjdGlvbnMgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHNlbGVjdG9ycyBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEluc3RydWN0aW9ucyAoc2VsZWN0b3JzKSB7XG4gIHJldHVybiBzZWxlY3RvcnMuc3BsaXQoJyAnKS5yZXZlcnNlKCkubWFwKChzZWxlY3Rvciwgc3RlcCkgPT4ge1xuICAgIGNvbnN0IGRpc2NvdmVyID0gc3RlcCA9PT0gMFxuICAgIGNvbnN0IFt0eXBlLCBwc2V1ZG9dID0gc2VsZWN0b3Iuc3BsaXQoJzonKVxuXG4gICAgdmFyIHZhbGlkYXRlID0gbnVsbFxuICAgIHZhciBpbnN0cnVjdGlvbiA9IG51bGxcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuXG4gICAgICAvLyBjaGlsZDogJz4nXG4gICAgICBjYXNlIC8+Ly50ZXN0KHR5cGUpOlxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrUGFyZW50IChub2RlKSB7XG4gICAgICAgICAgcmV0dXJuICh2YWxpZGF0ZSkgPT4gdmFsaWRhdGUobm9kZS5wYXJlbnQpICYmIG5vZGUucGFyZW50XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gY2xhc3M6ICcuJ1xuICAgICAgY2FzZSAvXlxcLi8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgbmFtZXMgPSB0eXBlLnN1YnN0cigxKS5zcGxpdCgnLicpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBub2RlQ2xhc3NOYW1lID0gbm9kZS5hdHRyaWJzLmNsYXNzXG4gICAgICAgICAgcmV0dXJuIG5vZGVDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IG5vZGVDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tDbGFzcyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShuYW1lcy5qb2luKCcgJykpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBhdHRyaWJ1dGU6ICdba2V5PVwidmFsdWVcIl0nXG4gICAgICBjYXNlIC9eXFxbLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gPSB0eXBlLnJlcGxhY2UoL1xcW3xcXF18XCIvZywgJycpLnNwbGl0KCc9JylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGhhc0F0dHJpYnV0ZSA9IE9iamVjdC5rZXlzKG5vZGUuYXR0cmlicykuaW5kZXhPZihhdHRyaWJ1dGVLZXkpID4gLTFcbiAgICAgICAgICBpZiAoaGFzQXR0cmlidXRlKSB7IC8vIHJlZ2FyZCBvcHRpb25hbCBhdHRyaWJ1dGVWYWx1ZVxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVWYWx1ZSB8fCAobm9kZS5hdHRyaWJzW2F0dHJpYnV0ZUtleV0gPT09IGF0dHJpYnV0ZVZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBpZDogJyMnXG4gICAgICBjYXNlIC9eIy8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgaWQgPSB0eXBlLnN1YnN0cigxKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUuYXR0cmlicy5pZCA9PT0gaWRcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrSWQgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCwgZG9uZSkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgICAgZG9uZSgpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIHVuaXZlcnNhbDogJyonXG4gICAgICBjYXNlIC9cXCovLnRlc3QodHlwZSk6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHRydWVcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1VuaXZlcnNhbCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpKVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyB0YWc6ICcuLi4nXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PT0gdHlwZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tUYWcgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwc2V1ZG8pIHtcbiAgICAgIHJldHVybiBpbnN0cnVjdGlvblxuICAgIH1cblxuICAgIGNvbnN0IHJ1bGUgPSBwc2V1ZG8ubWF0Y2goLy0oY2hpbGR8dHlwZSlcXCgoXFxkKylcXCkkLylcbiAgICBjb25zdCBraW5kID0gcnVsZVsxXVxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQocnVsZVsyXSwgMTApIC0gMVxuXG4gICAgY29uc3QgdmFsaWRhdGVQc2V1ZG8gPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmVTZXQgPSBub2RlLnBhcmVudC5jaGlsZFRhZ3NcbiAgICAgICAgaWYgKGtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICAgIGNvbXBhcmVTZXQgPSBjb21wYXJlU2V0LmZpbHRlcih2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlSW5kZXggPSBjb21wYXJlU2V0LmZpbmRJbmRleCgoY2hpbGQpID0+IGNoaWxkID09PSBub2RlKVxuICAgICAgICBpZiAobm9kZUluZGV4ID09PSBpbmRleCkge1xuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBlbmhhbmNlSW5zdHJ1Y3Rpb24gKG5vZGUpIHtcbiAgICAgIGNvbnN0IG1hdGNoID0gaW5zdHJ1Y3Rpb24obm9kZSlcbiAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICByZXR1cm4gbWF0Y2gucmVkdWNlKChOb2RlTGlzdCwgbWF0Y2hlZE5vZGUpID0+IHtcbiAgICAgICAgICBpZiAodmFsaWRhdGVQc2V1ZG8obWF0Y2hlZE5vZGUpKSB7XG4gICAgICAgICAgICBOb2RlTGlzdC5wdXNoKG1hdGNoZWROb2RlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgfSwgW10pXG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsaWRhdGVQc2V1ZG8obWF0Y2gpICYmIG1hdGNoXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZSB3YWxraVxuICogQHBhcmFtICB7W3R5cGVdfSBub2RlcyAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gaGFuZGxlciBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiB0cmF2ZXJzZURlc2NlbmRhbnRzIChub2RlcywgaGFuZGxlcikge1xuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgdmFyIHByb2dyZXNzID0gdHJ1ZVxuICAgIGhhbmRsZXIobm9kZSwgKCkgPT4gcHJvZ3Jlc3MgPSBmYWxzZSlcbiAgICBpZiAobm9kZS5jaGlsZFRhZ3MgJiYgcHJvZ3Jlc3MpIHtcbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMobm9kZS5jaGlsZFRhZ3MsIGhhbmRsZXIpXG4gICAgfVxuICB9KVxufVxuXG4vKipcbiAqIFtnZXRBbmNlc3RvciBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gbm9kZSAgICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSByb290ICAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHZhbGlkYXRlIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRBbmNlc3RvciAobm9kZSwgcm9vdCwgdmFsaWRhdGUpIHtcbiAgd2hpbGUgKG5vZGUucGFyZW50KSB7XG4gICAgbm9kZSA9IG5vZGUucGFyZW50XG4gICAgaWYgKHZhbGlkYXRlKG5vZGUpKSB7XG4gICAgICByZXR1cm4gbm9kZVxuICAgIH1cbiAgICBpZiAobm9kZSA9PT0gcm9vdCkge1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2FkYXB0LmpzXG4gKiovIiwiLyoqXG4gKiAjIE1hdGNoXG4gKlxuICogUmV0cmlldmVzIHNlbGVjdG9yXG4gKi9cblxuY29uc3QgZGVmYXVsdElnbm9yZSA9IHtcbiAgYXR0cmlidXRlIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdzdHlsZScsXG4gICAgICAnZGF0YS1yZWFjdGlkJyxcbiAgICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICAgIF0uaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBub2RlICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2ggKG5vZGUsIG9wdGlvbnMpIHtcbiAgY29uc3QgcGF0aCA9IFtdXG4gIHZhciBlbGVtZW50ID0gbm9kZVxuICB2YXIgbGVuZ3RoID0gcGF0aC5sZW5ndGhcblxuICBjb25zdCB7IGlnbm9yZSA9IHt9IH0gPSBvcHRpb25zXG5cbiAgdmFyIGlnbm9yZUNsYXNzID0gZmFsc2VcbiAgT2JqZWN0LmtleXMoaWdub3JlKS5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgaWYgKHR5cGUgPT09ICdjbGFzcycpIHtcbiAgICAgIGlnbm9yZUNsYXNzID0gdHJ1ZVxuICAgIH1cbiAgICB2YXIgcHJlZGljYXRlID0gaWdub3JlW3R5cGVdXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdmdW5jdGlvbicpIHJldHVyblxuICAgIGlmICh0eXBlb2YgcHJlZGljYXRlID09PSAnbnVtYmVyJykge1xuICAgICAgcHJlZGljYXRlID0gcHJlZGljYXRlLnRvU3RyaW5nKClcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwcmVkaWNhdGUgPSBuZXcgUmVnRXhwKHByZWRpY2F0ZSlcbiAgICB9XG4gICAgLy8gY2hlY2sgY2xhc3MtL2F0dHJpYnV0ZW5hbWUgZm9yIHJlZ2V4XG4gICAgaWdub3JlW3R5cGVdID0gcHJlZGljYXRlLnRlc3QuYmluZChwcmVkaWNhdGUpXG4gIH0pXG4gIGlmIChpZ25vcmVDbGFzcykge1xuICAgIGNvbnN0IGlnbm9yZUF0dHJpYnV0ZSA9IGlnbm9yZS5hdHRyaWJ1dGVcbiAgICBpZ25vcmUuYXR0cmlidXRlID0gKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSA9PiB7XG4gICAgICByZXR1cm4gaWdub3JlLmNsYXNzKHZhbHVlKSB8fCBpZ25vcmVBdHRyaWJ1dGUgJiYgaWdub3JlQXR0cmlidXRlKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxuICAgIH1cbiAgfVxuXG4gIHdoaWxlIChlbGVtZW50ICE9PSBkb2N1bWVudCkge1xuICAgIC8vIGdsb2JhbFxuICAgIGlmIChjaGVja0lkKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkpIGJyZWFrXG4gICAgaWYgKGNoZWNrQ2xhc3NHbG9iYWwoZWxlbWVudCwgcGF0aCwgaWdub3JlKSkgYnJlYWtcbiAgICBpZiAoY2hlY2tBdHRyaWJ1dGVHbG9iYWwoZWxlbWVudCwgcGF0aCwgaWdub3JlKSkgYnJlYWtcbiAgICBpZiAoY2hlY2tUYWdHbG9iYWwoZWxlbWVudCwgcGF0aCwgaWdub3JlKSkgYnJlYWtcblxuICAgIC8vIGxvY2FsXG4gICAgY2hlY2tDbGFzc0xvY2FsKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSlcblxuICAgIC8vIGRlZmluZSBvbmx5IG9uZSBzZWxlY3RvciBlYWNoIGl0ZXJhdGlvblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja0F0dHJpYnV0ZUxvY2FsKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSlcbiAgICB9XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSBsZW5ndGgpIHtcbiAgICAgIGNoZWNrVGFnTG9jYWwoZWxlbWVudCwgcGF0aCwgaWdub3JlKVxuICAgIH1cblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja0NsYXNzQ2hpbGQoZWxlbWVudCwgcGF0aCwgaWdub3JlKVxuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgY2hlY2tBdHRyaWJ1dGVDaGlsZChlbGVtZW50LCBwYXRoLCBpZ25vcmUpXG4gICAgfVxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gbGVuZ3RoKSB7XG4gICAgICBjaGVja1RhZ0NoaWxkKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSlcbiAgICB9XG5cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gICAgbGVuZ3RoID0gcGF0aC5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbGVtZW50ID09PSBkb2N1bWVudCkge1xuICAgIHBhdGgudW5zaGlmdCgnKicpXG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKCcgJylcbn1cblxuXG4vKipcbiAqIFtjaGVja0NsYXNzR2xvYmFsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3NHbG9iYWwgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICByZXR1cm4gY2hlY2tDbGFzcyhlbGVtZW50LCBwYXRoLCBpZ25vcmUsIGRvY3VtZW50KVxufVxuXG4vKipcbiAqIFtjaGVja0NsYXNzTG9jYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDbGFzc0xvY2FsIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgcmV0dXJuIGNoZWNrQ2xhc3MoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBlbGVtZW50LnBhcmVudE5vZGUpXG59XG5cbi8qKlxuICogW2NoZWNrQ2xhc3NDaGlsZCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0NsYXNzQ2hpbGQgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICBjb25zdCBjbGFzc05hbWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLmNsYXNzLCBjbGFzc05hbWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrQ2hpbGQoZWxlbWVudCwgcGF0aCwgYC4ke2NsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnLicpfWApXG59XG5cbi8qKlxuICogW2NoZWNrQXR0cmlidXRlR2xvYmFsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlR2xvYmFsIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgcmV0dXJuIGNoZWNrQXR0cmlidXRlKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgZG9jdW1lbnQpXG59XG5cbi8qKlxuICogW2NoZWNrQXR0cmlidXRlTG9jYWwgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGVMb2NhbCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIHJldHVybiBjaGVja0F0dHJpYnV0ZShlbGVtZW50LCBwYXRoLCBpZ25vcmUsIGVsZW1lbnQucGFyZW50Tm9kZSlcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGVDaGlsZCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZUNoaWxkIChlbGVtZW50LCBwYXRoLCBpZ25vcmUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuc29tZSgoa2V5KSA9PiB7XG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGUudmFsdWVcbiAgICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLmF0dHJpYnV0ZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCBwYXR0ZXJuKVxuICB9KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZ0dsb2JhbCBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja1RhZ0dsb2JhbCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIHJldHVybiBjaGVja1RhZyhlbGVtZW50LCBwYXRoLCBpZ25vcmUsIGRvY3VtZW50KVxufVxuXG4vKipcbiAqIFtjaGVja1RhZ0xvY2FsIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrVGFnTG9jYWwgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICByZXR1cm4gY2hlY2tUYWcoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBlbGVtZW50LnBhcmVudE5vZGUpXG59XG5cbi8qKlxuICogW2NoZWNrVGFiQ2hpbGRyZW4gZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWdDaGlsZCAoZWxlbWVudCwgcGF0aCwgaWdub3JlKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2tDaGlsZChlbGVtZW50LCBwYXRoLCB0YWdOYW1lKVxufVxuXG4vKipcbiAqIFtjaGVja0lkIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWQgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSkge1xuICBjb25zdCBpZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdpZCcpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUuaWQsIGlkKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHBhdGgudW5zaGlmdChgIyR7aWR9YClcbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBbY2hlY2tDbGFzcyBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgIHBhdGggICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2xhc3MgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgcGFyZW50KSB7XG4gIGNvbnN0IGNsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUuY2xhc3MsIGNsYXNzTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVxuICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICBwYXRoLnVuc2hpZnQoYC4ke2NsYXNzTmFtZS50cmltKCkucmVwbGFjZSgvXFxzKy9nLCAnLicpfWApXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY2hlY2tBdHRyaWJ1dGUgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gcGFyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAoZWxlbWVudCwgcGF0aCwgaWdub3JlLCBwYXJlbnQpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICByZXR1cm4gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuc29tZSgoa2V5KSA9PiB7XG4gICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1trZXldXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZSA9IGF0dHJpYnV0ZS5uYW1lXG4gICAgY29uc3QgYXR0cmlidXRlVmFsdWUgPSBhdHRyaWJ1dGUudmFsdWVcbiAgICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLmF0dHJpYnV0ZSwgYXR0cmlidXRlTmFtZSwgYXR0cmlidXRlVmFsdWUsIGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogW2NoZWNrVGFnIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheX0gICAgICAgcGF0aCAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBwYXJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgIGlnbm9yZSAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIHBhdGgsIGlnbm9yZSwgcGFyZW50KSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBpZiAoY2hlY2tJZ25vcmUoaWdub3JlLnRhZywgdGFnTmFtZSkpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICBjb25zdCBtYXRjaGVzID0gcGFyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUpXG4gIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgIHBhdGgudW5zaGlmdCh0YWdOYW1lKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogW2NoZWNrQ2hpbGQgZGVzY3JpcHRpb25dXG4gKiBOb3RlOiBjaGlsZFRhZ3MgaXMgYSBjdXN0b20gcHJvcGVydHkgdG8gdXNlIGEgdmlldyBmaWx0ZXIgZm9yIHRhZ3Mgb24gZm9yIHZpcnV0YWwgZWxlbWVudHNcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5fSAgICAgICBwYXRoICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICBzZWxlY3RvciAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tDaGlsZCAoZWxlbWVudCwgcGF0aCwgc2VsZWN0b3IpIHtcbiAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlXG4gIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkVGFncyB8fCBwYXJlbnQuY2hpbGRyZW5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZiAoY2hpbGRyZW5baV0gPT09IGVsZW1lbnQpIHtcbiAgICAgIHBhdGgudW5zaGlmdChgPiAke3NlbGVjdG9yfTpudGgtY2hpbGQoJHtpKzF9KWApXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBbY2hlY2tJZ25vcmUgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgbmFtZSAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgdmFsdWUgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrSWdub3JlIChwcmVkaWNhdGUsIG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKSB7XG4gIGlmICghbmFtZSkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgY29uc3QgY2hlY2sgPSBwcmVkaWNhdGUgfHwgZGVmYXVsdFByZWRpY2F0ZVxuICBpZiAoIWNoZWNrKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIGNoZWNrKG5hbWUsIHZhbHVlLCBkZWZhdWx0UHJlZGljYXRlKVxufVxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvbWF0Y2guanNcbiAqKi8iLCIvKipcbiAqICMgT3B0aW1pemVcbiAqXG4gKiAxLikgSW1wcm92ZSBlZmZpY2llbmN5IHRocm91Z2ggc2hvcnRlciBzZWxlY3RvcnMgYnkgcmVtb3ZpbmcgcmVkdW5kYW5jeVxuICogMi4pIEltcHJvdmUgcm9idXN0bmVzcyB0aHJvdWdoIHNlbGVjdG9yIHRyYW5zZm9ybWF0aW9uXG4gKi9cblxuaW1wb3J0IGFkYXB0IGZyb20gJy4vYWRhcHQnXG5cbi8qKlxuICogQXBwbHkgZGlmZmVyZW50IG9wdGltaXphdGlvbiB0ZWNobmlxdWVzXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgc2VsZWN0b3IgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGltaXplIChzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XG5cbiAgY29uc3QgZ2xvYmFsTW9kaWZpZWQgPSBhZGFwdChlbGVtZW50LCBvcHRpb25zKVxuXG4gIC8vIGNodW5rIHBhcnRzIG91dHNpZGUgb2YgcXVvdGVzIChodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNTY2MzcyOSlcbiAgdmFyIHBhdGggPSBzZWxlY3Rvci5yZXBsYWNlKC8+IC9nLCAnPicpLnNwbGl0KC9cXHMrKD89KD86KD86W15cIl0qXCIpezJ9KSpbXlwiXSokKS8pXG5cbiAgaWYgKHBhdGgubGVuZ3RoIDwgMykge1xuICAgIHJldHVybiBzZWxlY3RvclxuICB9XG5cbiAgY29uc3Qgc2hvcnRlbmVkID0gW3BhdGgucG9wKCldXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDEpICB7XG4gICAgY29uc3QgY3VycmVudCA9IHBhdGgucG9wKClcbiAgICBjb25zdCBwcmVQYXJ0ID0gcGF0aC5qb2luKCcgJylcbiAgICBjb25zdCBwb3N0UGFydCA9IHNob3J0ZW5lZC5qb2luKCcgJylcblxuICAgIGNvbnN0IHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSAke3Bvc3RQYXJ0fWBcbiAgICBjb25zdCBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgc2hvcnRlbmVkLnVuc2hpZnQob3B0aW1pemVQYXJ0KHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50KSlcbiAgICB9XG4gIH1cbiAgc2hvcnRlbmVkLnVuc2hpZnQocGF0aFswXSlcbiAgcGF0aCA9IHNob3J0ZW5lZFxuXG4gIC8vIG9wdGltaXplIHN0YXJ0ICsgZW5kXG4gIHBhdGhbMF0gPSBvcHRpbWl6ZVBhcnQoJycsIHBhdGhbMF0sIHBhdGguc2xpY2UoMSkuam9pbignICcpLCBlbGVtZW50KVxuICBwYXRoW3BhdGgubGVuZ3RoLTFdID0gb3B0aW1pemVQYXJ0KHBhdGguc2xpY2UoMCwgLTEpLmpvaW4oJyAnKSwgcGF0aFtwYXRoLmxlbmd0aC0xXSwgJycsIGVsZW1lbnQpXG5cbiAgaWYgKGdsb2JhbE1vZGlmaWVkKSB7XG4gICAgZGVsZXRlIGdsb2JhbC5kb2N1bWVudFxuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbignICcpLnJlcGxhY2UoLz4vZywgJz4gJykudHJpbSgpXG59XG5cbi8qKlxuICogSW1wcm92ZSBhIGNodW5rIG9mIHRoZSBzZWxlY3RvclxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIHByZVBhcnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIGN1cnJlbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIHBvc3RQYXJ0IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBvcHRpbWl6ZVBhcnQgKHByZVBhcnQsIGN1cnJlbnQsIHBvc3RQYXJ0LCBlbGVtZW50KSB7XG4gIGlmIChwcmVQYXJ0Lmxlbmd0aCkgcHJlUGFydCA9IGAke3ByZVBhcnR9IGBcbiAgaWYgKHBvc3RQYXJ0Lmxlbmd0aCkgcG9zdFBhcnQgPSBgICR7cG9zdFBhcnR9YFxuXG4gIC8vIHJvYnVzdG5lc3M6IGF0dHJpYnV0ZSB3aXRob3V0IHZhbHVlIChnZW5lcmFsaXphdGlvbilcbiAgaWYgKC9cXFsqXFxdLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3Qga2V5ID0gY3VycmVudC5yZXBsYWNlKC89LiokLywgJ10nKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2tleX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgY3VycmVudCA9IGtleVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb2J1c3RuZXNzOiByZXBsYWNlIHNwZWNpZmljIGtleS12YWx1ZSB3aXRoIHRhZyAoaGV1cmlzdGljKVxuICAgICAgY29uc3QgcmVmZXJlbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYCR7cHJlUGFydH0ke2tleX1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAocmVmZXJlbmNlc1tpXS5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcmVmZXJlbmNlc1tpXS50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjcmlwdGlvbn0ke3Bvc3RQYXJ0fWBcbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICAgICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgICAgICAgY3VycmVudCA9IGRlc2NyaXB0aW9uXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyByb2J1c3RuZXNzOiBkZXNjZW5kYW50IGluc3RlYWQgY2hpbGQgKGhldXJpc3RpYylcbiAgaWYgKC8+Ly50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgZGVzY2VuZGFudCA9IGN1cnJlbnQucmVwbGFjZSgvPi8sICcnKVxuICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NlbmRhbnR9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBkZXNjZW5kYW50XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogJ250aC1vZi10eXBlJyBpbnN0ZWFkICdudGgtY2hpbGQnIChoZXVyaXN0aWMpXG4gIGlmICgvOm50aC1jaGlsZC8udGVzdChjdXJyZW50KSkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIGNvbXBsZXRlIGNvdmVyYWdlIG9mICdudGgtb2YtdHlwZScgcmVwbGFjZW1lbnRcbiAgICBjb25zdCB0eXBlID0gY3VycmVudC5yZXBsYWNlKC9udGgtY2hpbGQvZywgJ250aC1vZi10eXBlJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHt0eXBlfSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSBlbGVtZW50KSB7XG4gICAgICBjdXJyZW50ID0gdHlwZVxuICAgIH1cbiAgfVxuXG4gIC8vIGVmZmljaWVuY3k6IGNvbWJpbmF0aW9ucyBvZiBjbGFzc25hbWUgKHBhcnRpYWwgcGVybXV0YXRpb25zKVxuICBpZiAoL1xcLlxcUytcXC5cXFMrLy50ZXN0KGN1cnJlbnQpKSB7XG4gICAgY29uc3QgbmFtZXMgPSBjdXJyZW50LnRyaW0oKS5zcGxpdCgnLicpLnNsaWNlKDEpLm1hcCgobmFtZSkgPT4gYC4ke25hbWV9YClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNvcnQoKGN1cnIsIG5leHQpID0+IGN1cnIubGVuZ3RoIC0gbmV4dC5sZW5ndGgpXG4gICAgd2hpbGUgKG5hbWVzLmxlbmd0aCkge1xuICAgICAgdmFyIHBhcnRpYWwgPSBjdXJyZW50LnJlcGxhY2UobmFtZXMuc2hpZnQoKSwgJycpXG4gICAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtwYXJ0aWFsfSR7cG9zdFBhcnR9YFxuICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgICBjdXJyZW50ID0gcGFydGlhbFxuICAgICAgfVxuICAgIH1cbiAgICAvLyByb2J1c3RuZXNzOiBkZWdyYWRlIGNvbXBsZXggY2xhc3NuYW1lIChoZXVyaXN0aWMpXG4gICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC5tYXRjaCgvXFwuL2cpLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtjdXJyZW50fWApXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHJlZmVyZW5jZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGlmIChyZWZlcmVuY2VzW2ldLmNvbnRhaW5zKGVsZW1lbnQpKSB7XG4gICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAvLyAtIGNoZWNrIHVzaW5nIGF0dHJpYnV0ZXMgKyByZWdhcmQgZXhjbHVkZXNcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZXNbaV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL29wdGltaXplLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==