(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.OptimalSelect = global.OptimalSelect || {})));
}(this, function (exports) { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  var toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

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

        var _getInstructions2 = toArray(_getInstructions);

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

      var _selector$split2 = slicedToArray(_selector$split, 2);

      var type = _selector$split2[0];
      var pseudo = _selector$split2[1];


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
            var _type$replace$split = type.replace(/\[|\]|"/g, '').split('=');

            var _type$replace$split2 = slicedToArray(_type$replace$split, 2);

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


    var ignoreClass = !!options.classesToFilter;
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
        if (!ignore.class) {
          ignore.class = function () {
            return false;
          };
        }
        var ignoreAttribute = ignore.attribute;
        ignore.attribute = function (name, value, defaultPredicate) {
          return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate);
        };
      })();
    }

    while (element !== document) {
      // global
      if (checkId(element, path, ignore)) break;
      if (checkClassGlobal(element, path, ignore, options)) break;
      if (checkAttributeGlobal(element, path, ignore)) break;
      if (checkTagGlobal(element, path, ignore)) break;

      // local
      checkClassLocal(element, path, ignore, options);

      // define only one selector each iteration
      if (path.length === length) {
        checkAttributeLocal(element, path, ignore);
      }
      if (path.length === length) {
        checkTagLocal(element, path, ignore);
      }

      if (path.length === length) {
        checkClassChild(element, path, ignore, options);
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
  function checkClassGlobal(element, path, ignore, options) {
    return checkClass(element, path, ignore, document, options);
  }

  /**
   * [checkClassLocal description]
   * @param  {HTMLElement} element - [description]
   * @param  {Array}       path    - [description]
   * @param  {Object}      ignore  - [description]
   * @return {Boolean}             - [description]
   */
  function checkClassLocal(element, path, ignore, options) {
    return checkClass(element, path, ignore, element.parentNode, options);
  }

  /**
   * [checkClassChild description]
   * @param  {HTMLElement} element - [description]
   * @param  {Array}       path    - [description]
   * @param  {Object}      ignore  - [description]
   * @return {Boolean}             - [description]
   */
  function checkClassChild(element, path, ignore, options) {
    var className = element.getAttribute('class');
    if (checkIgnore(ignore.class, className)) {
      return false;
    }
    var filteredClasses = filteredClassName(className, options);
    return checkChild(element, path, '.' + filteredClasses.trim().replace(/\s+/g, '.'));
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
  function checkClass(element, path, ignore, parent, options) {
    var className = element.getAttribute('class');
    if (checkIgnore(ignore.class, className)) {
      return false;
    }
    var filteredClasses = filteredClassName(className, options);
    var matches = parent.getElementsByClassName(filteredClasses);
    if (matches.length === 1) {
      path.unshift('.' + filteredClasses.trim().replace(/\s+/g, '.'));
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

  /**
   * Apply different optimization techniques
   * @param  {string}      selector - [description]
   * @param  {HTMLElement} element  - [description]
   * @return {string}               - [description]
   */
  function optimize(selector, element) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


    var globalModified = adapt(element, options);

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

  /**
   * Filter out specific classes from a className
   * @param {String}  className   - [description]
   * @params {Object} options     - [description]
   * @return {string}             - [description]
   */
  function filteredClassName(className) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var classesToFilter = options.classesToFilter || [];
    var filteredClasses = className.split(' ').filter(function (c) {
      return !classesToFilter.includes(c);
    });
    filteredClasses.sort();
    return filteredClasses.join(' ');
  }

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

    var globalModified = adapt(element, options);

    var selector = match(element, options);
    var optimized = optimize(selector, element, options);

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
          var similarNode = null;
          if (node1 === node2 || node1.id === node2.id) {
            similarNode = node1;
          } else if (node1.tagName === node2.tagName && filteredClassName(node1.className, options) === filteredClassName(node2.className, options)) {
            similarNode = document.createElement(node1.tagName);
            similarNode.className = filteredClassName(node1.className, options);
          }
          if (similarNode) {
            similar.push(similarNode);
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
    commonParentNodes.reverse();

    var selectors = [];
    if (commonParentNodes) {
      selectors = commonParentNodes.map(function (el) {
        var selector = el.tagName.toLowerCase();
        if (el.id !== '') {
          selector += '#' + el.id;
        } else if (el.className !== '') {
          selector += '.' + el.className.replace(/ /g, '.');
        }
        return selector;
      });
    }

    var targetSelectorParts = [];
    if (commonTagName) {
      targetSelectorParts.push('' + commonTagName.toLowerCase());
    }
    if (commonClassName) {
      targetSelectorParts.push('.' + commonClassName.replace(/ /g, '.'));
    }
    selectors.push(targetSelectorParts.join(''));

    // lets attempt to make the selector shorter
    try {
      var originalCount = document.querySelectorAll(selectors.join(' ')).length;
      while (selectors.length > 1) {
        var candidateForRemoval = selectors.shift();
        var newCount = document.querySelectorAll(selectors.join(' ')).length;
        if (newCount !== originalCount) {
          selectors.unshift(candidateForRemoval);
          break;
        }
      }
    } catch (e) {
      console.log('Unable to execute generic selector, returning explicit selector', e);
      return elements.map(function (e) {
        return getSingleSelector(e, options);
      }).join(', ');
    }

    if (selectors.length === 0) {
      selectors = elements.map(function (e) {
        return getSingleSelector(e, options);
      });
      return selectors.join(', ');
    } else {
      return selectors.join(' ');
    }
  }

  // Polyfill
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Browser_compatibility
  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
      'use strict';

      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }
      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }
      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
          // NaN !== NaN
          return true;
        }
        k++;
      }
      return false;
    };
  }

  exports.select = getQuerySelector;
  exports.optimize = optimize;

  Object.defineProperty(exports, '__esModule', { value: true });

}));