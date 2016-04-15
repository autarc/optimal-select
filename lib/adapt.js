'use strict';

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
//# sourceMappingURL=data:application/json;base64,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QSxpQkFBTyxRQUFQLENBSjZDO1NBQTNCLEVBS2pCLEVBTEksQ0FBUCxDQURZO09BQWQ7QUFRQSxhQUFPLGVBQWUsS0FBZixLQUF5QixLQUF6QixDQVZpQztLQUFuQyxDQXBJcUQ7R0FBcEIsQ0FBMUMsQ0FEbUM7Q0FBckM7Ozs7Ozs7O0FBMEpBLFNBQVMsbUJBQVQsQ0FBOEIsS0FBOUIsRUFBcUMsT0FBckMsRUFBOEM7QUFDNUMsUUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVU7QUFDdEIsUUFBSSxXQUFXLElBQVgsQ0FEa0I7QUFFdEIsWUFBUSxJQUFSLEVBQWM7YUFBTSxXQUFXLEtBQVg7S0FBTixDQUFkLENBRnNCO0FBR3RCLFFBQUksS0FBSyxTQUFMLElBQWtCLFFBQWxCLEVBQTRCO0FBQzlCLDBCQUFvQixLQUFLLFNBQUwsRUFBZ0IsT0FBcEMsRUFEOEI7S0FBaEM7R0FIWSxDQUFkLENBRDRDO0NBQTlDOzs7Ozs7Ozs7QUFpQkEsU0FBUyxXQUFULENBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDLFFBQWxDLEVBQTRDO0FBQzFDLFNBQU8sS0FBSyxNQUFMLEVBQWE7QUFDbEIsV0FBTyxLQUFLLE1BQUwsQ0FEVztBQUVsQixRQUFJLFNBQVMsSUFBVCxDQUFKLEVBQW9CO0FBQ2xCLGFBQU8sSUFBUCxDQURrQjtLQUFwQjtBQUdBLFFBQUksU0FBUyxJQUFULEVBQWU7QUFDakIsWUFEaUI7S0FBbkI7R0FMRjtBQVNBLFNBQU8sSUFBUCxDQVYwQztDQUE1QyIsImZpbGUiOiJhZGFwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBVbml2ZXJzYWxcbiAqXG4gKiBDaGVjayBhbmQgZXh0ZW5kIHRoZSBlbnZpcm9ubWVudCBmb3IgdW5pdmVyc2FsIHVzYWdlXG4gKi9cblxuLyoqXG4gKiBbYWRhcHQgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGVsZW1lbnQgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBvcHRpb25zIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkYXB0IChlbGVtZW50LCBvcHRpb25zKSB7XG5cbiAgLy8gZGV0ZWN0IGVudmlyb25tZW50IHNldHVwXG4gIGlmIChnbG9iYWwuZG9jdW1lbnQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGNvbnN0IHsgY29udGV4dCB9ID0gb3B0aW9uc1xuXG4gIGdsb2JhbC5kb2N1bWVudCA9IGNvbnRleHQgfHwgKCgpID0+IHtcbiAgICB2YXIgcm9vdCA9IGVsZW1lbnRcbiAgICB3aGlsZSAocm9vdC5wYXJlbnQpIHtcbiAgICAgIHJvb3QgPSByb290LnBhcmVudFxuICAgIH1cbiAgICByZXR1cm4gcm9vdFxuICB9KSgpXG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9taGFuZGxlci9ibG9iL21hc3Rlci9pbmRleC5qcyNMNzVcbiAgY29uc3QgRWxlbWVudFByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwuZG9jdW1lbnQpXG5cbiAgLy8gYWx0ZXJuYXRpdmUgZGVzY3JpcHRvciB0byBhY2Nlc3MgZWxlbWVudHMgd2l0aCBmaWx0ZXJpbmcgaW52YWxpZCBlbGVtZW50cyAoZS5nLiB0ZXh0bm9kZXMpXG4gIGlmICghT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50UHJvdG90eXBlLCAnY2hpbGRUYWdzJykpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5maWx0ZXIoKG5vZGUpID0+IHtcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9kb21lbGVtZW50dHlwZS9ibG9iL21hc3Rlci9pbmRleC5qcyNMMTJcbiAgICAgICAgICByZXR1cm4gbm9kZS50eXBlID09PSAndGFnJyB8fCBub2RlLnR5cGUgPT09ICdzY3JpcHQnIHx8IG5vZGUudHlwZSA9PT0gJ3N0eWxlJ1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2F0dHJpYnV0ZXMnKSkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2F0dHJpYnV0ZXNcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTmFtZWROb2RlTWFwXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJywge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldCAoKSB7XG4gICAgICAgIGNvbnN0IHsgYXR0cmlicyB9ID0gdGhpc1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzTmFtZXMgPSBPYmplY3Qua2V5cyhhdHRyaWJzKVxuICAgICAgICBjb25zdCBOYW1lZE5vZGVNYXAgPSBhdHRyaWJ1dGVzTmFtZXMucmVkdWNlKChhdHRyaWJ1dGVzLCBhdHRyaWJ1dGVOYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGF0dHJpYnV0ZXNbaW5kZXhdID0ge1xuICAgICAgICAgICAgbmFtZTogYXR0cmlidXRlTmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBhdHRyaWJzW2F0dHJpYnV0ZU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGVzXG4gICAgICAgIH0sIHsgfSlcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hbWVkTm9kZU1hcCwgJ2xlbmd0aCcsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBhdHRyaWJ1dGVzTmFtZXMubGVuZ3RoXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBOYW1lZE5vZGVNYXBcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSkge1xuICAgIC8vIGh0dHBzOi8vZG9jcy53ZWJwbGF0Zm9ybS5vcmcvd2lraS9kb20vRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRBdHRyaWJ1dGVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyaWJzW25hbWVdIHx8IG51bGxcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAgICBFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgIGNvbnN0IEhUTUxDb2xsZWN0aW9uID0gW11cbiAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHModGhpcy5jaGlsZFRhZ3MsIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50Lm5hbWUgPT09IHRhZ05hbWUgfHwgdGFnTmFtZSA9PT0gJyonKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0RvY3VtZW50L2dldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgbmFtZXMgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2UoL1xccysvZywgJyAnKS5zcGxpdCgnICcpXG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgY29uc3QgZGVzY2VuZGFudENsYXNzTmFtZSA9IGRlc2NlbmRhbnQuYXR0cmlicy5jbGFzc1xuICAgICAgICBpZiAoZGVzY2VuZGFudENsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gZGVzY2VuZGFudENsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpKSB7XG4gICAgICAgICAgSFRNTENvbGxlY3Rpb24ucHVzaChkZXNjZW5kYW50KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIEhUTUxDb2xsZWN0aW9uXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvY3NzL3NlbGVjdG9yc19hcGkvcXVlcnlTZWxlY3RvckFsbFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICBFbGVtZW50UHJvdG90eXBlLnF1ZXJ5U2VsZWN0b3JBbGwgPSBmdW5jdGlvbiAoc2VsZWN0b3JzKSB7XG4gICAgICBzZWxlY3RvcnMgPSBzZWxlY3RvcnMucmVwbGFjZSgvKD4pKFxcUykvZywgJyQxICQyJykudHJpbSgpIC8vIGFkZCBzcGFjZSBmb3IgJz4nIHNlbGVjdG9yXG5cbiAgICAgIC8vIHVzaW5nIHJpZ2h0IHRvIGxlZnQgZXhlY3V0aW9uID0+IGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2Nzcy1zZWxlY3QjaG93LWRvZXMtaXQtd29ya1xuICAgICAgY29uc3QgW2Rpc2NvdmVyLCAuLi5hc2NlbmRpbmdzXSA9IGdldEluc3RydWN0aW9ucyhzZWxlY3RvcnMpXG4gICAgICBjb25zdCB0b3RhbCA9IGFzY2VuZGluZ3MubGVuZ3RoXG4gICAgICByZXR1cm4gZGlzY292ZXIodGhpcykuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgIHZhciBzdGVwID0gMFxuICAgICAgICB3aGlsZSAoc3RlcCA8IHRvdGFsKSB7XG4gICAgICAgICAgbm9kZSA9IGFzY2VuZGluZ3Nbc3RlcF0obm9kZSwgdGhpcylcbiAgICAgICAgICBpZiAoIW5vZGUpIHsgLy8gaGllcmFyY2h5IGRvZXNuJ3QgbWF0Y2hcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBzdGVwICs9IDFcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBpZiAoIUVsZW1lbnRQcm90b3R5cGUuY29udGFpbnMpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm9kZS9jb250YWluc1xuICAgIEVsZW1lbnRQcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgdmFyIGluY2x1c2l2ZSA9IGZhbHNlXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFt0aGlzXSwgKGRlc2NlbmRhbnQsIGRvbmUpID0+IHtcbiAgICAgICAgaWYgKGRlc2NlbmRhbnQgPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICBpbmNsdXNpdmUgPSB0cnVlXG4gICAgICAgICAgZG9uZSgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gaW5jbHVzaXZlXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqXG4gKiBbZ2V0SW5zdHJ1Y3Rpb25zIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBzZWxlY3RvcnMgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBnZXRJbnN0cnVjdGlvbnMgKHNlbGVjdG9ycykge1xuICByZXR1cm4gc2VsZWN0b3JzLnNwbGl0KCcgJykucmV2ZXJzZSgpLm1hcCgoc2VsZWN0b3IsIHN0ZXApID0+IHtcbiAgICBjb25zdCBkaXNjb3ZlciA9IHN0ZXAgPT09IDBcbiAgICBjb25zdCBbdHlwZSwgcHNldWRvXSA9IHNlbGVjdG9yLnNwbGl0KCc6JylcblxuICAgIHZhciB2YWxpZGF0ZSA9IG51bGxcbiAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBudWxsXG5cbiAgICBzd2l0Y2ggKHRydWUpIHtcblxuICAgICAgLy8gY2hpbGQ6ICc+J1xuICAgICAgY2FzZSAvPi8udGVzdCh0eXBlKTpcbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1BhcmVudCAobm9kZSkge1xuICAgICAgICAgIHJldHVybiAodmFsaWRhdGUpID0+IHZhbGlkYXRlKG5vZGUucGFyZW50KSAmJiBub2RlLnBhcmVudFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGNsYXNzOiAnLidcbiAgICAgIGNhc2UgL15cXC4vLnRlc3QodHlwZSk6XG4gICAgICAgIGNvbnN0IG5hbWVzID0gdHlwZS5zdWJzdHIoMSkuc3BsaXQoJy4nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3Qgbm9kZUNsYXNzTmFtZSA9IG5vZGUuYXR0cmlicy5jbGFzc1xuICAgICAgICAgIHJldHVybiBub2RlQ2xhc3NOYW1lICYmIG5hbWVzLmV2ZXJ5KChuYW1lKSA9PiBub2RlQ2xhc3NOYW1lLmluZGV4T2YobmFtZSkgPiAtMSlcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrQ2xhc3MgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUobmFtZXMuam9pbignICcpKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gYXR0cmlidXRlOiAnW2tleT1cInZhbHVlXCJdJ1xuICAgICAgY2FzZSAvXlxcWy8udGVzdCh0eXBlKTpcbiAgICAgICAgY29uc3QgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdID0gdHlwZS5yZXBsYWNlKC9cXFt8XFxdfFwiL2csICcnKS5zcGxpdCgnPScpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICBjb25zdCBoYXNBdHRyaWJ1dGUgPSBPYmplY3Qua2V5cyhub2RlLmF0dHJpYnMpLmluZGV4T2YoYXR0cmlidXRlS2V5KSA+IC0xXG4gICAgICAgICAgaWYgKGhhc0F0dHJpYnV0ZSkgeyAvLyByZWdhcmQgb3B0aW9uYWwgYXR0cmlidXRlVmFsdWVcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlVmFsdWUgfHwgKG5vZGUuYXR0cmlic1thdHRyaWJ1dGVLZXldID09PSBhdHRyaWJ1dGVWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0F0dHJpYnV0ZSAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gaWQ6ICcjJ1xuICAgICAgY2FzZSAvXiMvLnRlc3QodHlwZSk6XG4gICAgICAgIGNvbnN0IGlkID0gdHlwZS5zdWJzdHIoMSlcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLmF0dHJpYnMuaWQgPT09IGlkXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0lkIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQsIGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICAgIGRvbmUoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyB1bml2ZXJzYWw6ICcqJ1xuICAgICAgY2FzZSAvXFwqLy50ZXN0KHR5cGUpOlxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB0cnVlXG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tVbml2ZXJzYWwgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4gTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gdGFnOiAnLi4uJ1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09IHR5cGVcbiAgICAgICAgfVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVGFnIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGRlc2NlbmRhbnQpKSB7XG4gICAgICAgICAgICAgICAgTm9kZUxpc3QucHVzaChkZXNjZW5kYW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAodHlwZW9mIG5vZGUgPT09ICdmdW5jdGlvbicpID8gbm9kZSh2YWxpZGF0ZSkgOiBnZXRBbmNlc3Rvcihub2RlLCByb290LCB2YWxpZGF0ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHNldWRvKSB7XG4gICAgICByZXR1cm4gaW5zdHJ1Y3Rpb25cbiAgICB9XG5cbiAgICBjb25zdCBydWxlID0gcHNldWRvLm1hdGNoKC8tKGNoaWxkfHR5cGUpXFwoKFxcZCspXFwpJC8pXG4gICAgY29uc3Qga2luZCA9IHJ1bGVbMV1cbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHJ1bGVbMl0sIDEwKSAtIDFcblxuICAgIGNvbnN0IHZhbGlkYXRlUHNldWRvID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciBjb21wYXJlU2V0ID0gbm9kZS5wYXJlbnQuY2hpbGRUYWdzXG4gICAgICAgIGlmIChraW5kID09PSAndHlwZScpIHtcbiAgICAgICAgICBjb21wYXJlU2V0ID0gY29tcGFyZVNldC5maWx0ZXIodmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgbm9kZUluZGV4ID0gY29tcGFyZVNldC5maW5kSW5kZXgoKGNoaWxkKSA9PiBjaGlsZCA9PT0gbm9kZSlcbiAgICAgICAgaWYgKG5vZGVJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gZW5oYW5jZUluc3RydWN0aW9uIChub2RlKSB7XG4gICAgICBjb25zdCBtYXRjaCA9IGluc3RydWN0aW9uKG5vZGUpXG4gICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgcmV0dXJuIG1hdGNoLnJlZHVjZSgoTm9kZUxpc3QsIG1hdGNoZWROb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKHZhbGlkYXRlUHNldWRvKG1hdGNoZWROb2RlKSkge1xuICAgICAgICAgICAgTm9kZUxpc3QucHVzaChtYXRjaGVkTm9kZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE5vZGVMaXN0XG4gICAgICAgIH0sIFtdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbGlkYXRlUHNldWRvKG1hdGNoKSAmJiBtYXRjaFxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBSZWN1cnNpdmUgd2Fsa2lcbiAqIEBwYXJhbSAge1t0eXBlXX0gbm9kZXMgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGhhbmRsZXIgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VEZXNjZW5kYW50cyAobm9kZXMsIGhhbmRsZXIpIHtcbiAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIHZhciBwcm9ncmVzcyA9IHRydWVcbiAgICBoYW5kbGVyKG5vZGUsICgpID0+IHByb2dyZXNzID0gZmFsc2UpXG4gICAgaWYgKG5vZGUuY2hpbGRUYWdzICYmIHByb2dyZXNzKSB7XG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKG5vZGUuY2hpbGRUYWdzLCBoYW5kbGVyKVxuICAgIH1cbiAgfSlcbn1cblxuLyoqXG4gKiBbZ2V0QW5jZXN0b3IgZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IG5vZGUgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gcm9vdCAgICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSB2YWxpZGF0ZSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0QW5jZXN0b3IgKG5vZGUsIHJvb3QsIHZhbGlkYXRlKSB7XG4gIHdoaWxlIChub2RlLnBhcmVudCkge1xuICAgIG5vZGUgPSBub2RlLnBhcmVudFxuICAgIGlmICh2YWxpZGF0ZShub2RlKSkge1xuICAgICAgcmV0dXJuIG5vZGVcbiAgICB9XG4gICAgaWYgKG5vZGUgPT09IHJvb3QpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsXG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
