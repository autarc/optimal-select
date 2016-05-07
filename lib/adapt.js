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
//# sourceMappingURL=data:application/json;base64,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U0FBTCxJQUFrQixRQUF0QixFQUFnQztBQUM5QiwwQkFBb0IsS0FBSyxTQUF6QixFQUFvQyxPQUFwQztBQUNEO0FBQ0YsR0FORDtBQU9EOzs7Ozs7Ozs7QUFTRCxTQUFTLFdBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsUUFBbEMsRUFBNEM7QUFDMUMsU0FBTyxLQUFLLE1BQVosRUFBb0I7QUFDbEIsV0FBTyxLQUFLLE1BQVo7QUFDQSxRQUFJLFNBQVMsSUFBVCxDQUFKLEVBQW9CO0FBQ2xCLGFBQU8sSUFBUDtBQUNEO0FBQ0QsUUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakI7QUFDRDtBQUNGO0FBQ0QsU0FBTyxJQUFQO0FBQ0QiLCJmaWxlIjoiYWRhcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqICMgVW5pdmVyc2FsXG4gKlxuICogQ2hlY2sgYW5kIGV4dGVuZCB0aGUgZW52aXJvbm1lbnQgZm9yIHVuaXZlcnNhbCB1c2FnZVxuICovXG5cbi8qKlxuICogW2FkYXB0IGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBlbGVtZW50IFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gb3B0aW9ucyBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGFwdCAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gIC8vIGRldGVjdCBlbnZpcm9ubWVudCBzZXR1cFxuICBpZiAoZ2xvYmFsLmRvY3VtZW50KSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBjb25zdCB7IGNvbnRleHQgfSA9IG9wdGlvbnNcblxuICBnbG9iYWwuZG9jdW1lbnQgPSBjb250ZXh0IHx8ICgoKSA9PiB7XG4gICAgdmFyIHJvb3QgPSBlbGVtZW50XG4gICAgd2hpbGUgKHJvb3QucGFyZW50KSB7XG4gICAgICByb290ID0gcm9vdC5wYXJlbnRcbiAgICB9XG4gICAgcmV0dXJuIHJvb3RcbiAgfSkoKVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2RvbWhhbmRsZXIvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDc1XG4gIGNvbnN0IEVsZW1lbnRQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsLmRvY3VtZW50KVxuXG4gIC8vIGFsdGVybmF0aXZlIGRlc2NyaXB0b3IgdG8gYWNjZXNzIGVsZW1lbnRzIHdpdGggZmlsdGVyaW5nIGludmFsaWQgZWxlbWVudHMgKGUuZy4gdGV4dG5vZGVzKVxuICBpZiAoIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudFByb3RvdHlwZSwgJ2NoaWxkVGFncycpKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEVsZW1lbnRQcm90b3R5cGUsICdjaGlsZFRhZ3MnLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0ICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZiNTUvZG9tZWxlbWVudHR5cGUvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDEyXG4gICAgICAgICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ3RhZycgfHwgbm9kZS50eXBlID09PSAnc2NyaXB0JyB8fCBub2RlLnR5cGUgPT09ICdzdHlsZSdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKCFPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnRQcm90b3R5cGUsICdhdHRyaWJ1dGVzJykpIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRyaWJ1dGVzXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05hbWVkTm9kZU1hcFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50UHJvdG90eXBlLCAnYXR0cmlidXRlcycsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBnZXQgKCkge1xuICAgICAgICBjb25zdCB7IGF0dHJpYnMgfSA9IHRoaXNcbiAgICAgICAgY29uc3QgYXR0cmlidXRlc05hbWVzID0gT2JqZWN0LmtleXMoYXR0cmlicylcbiAgICAgICAgY29uc3QgTmFtZWROb2RlTWFwID0gYXR0cmlidXRlc05hbWVzLnJlZHVjZSgoYXR0cmlidXRlcywgYXR0cmlidXRlTmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBhdHRyaWJ1dGVzW2luZGV4XSA9IHtcbiAgICAgICAgICAgIG5hbWU6IGF0dHJpYnV0ZU5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogYXR0cmlic1thdHRyaWJ1dGVOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYXR0cmlidXRlc1xuICAgICAgICB9LCB7IH0pXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYW1lZE5vZGVNYXAsICdsZW5ndGgnLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICB2YWx1ZTogYXR0cmlidXRlc05hbWVzLmxlbmd0aFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gTmFtZWROb2RlTWFwXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRBdHRyaWJ1dGUpIHtcbiAgICAvLyBodHRwczovL2RvY3Mud2VicGxhdGZvcm0ub3JnL3dpa2kvZG9tL0VsZW1lbnQvZ2V0QXR0cmlidXRlXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0QXR0cmlidXRlXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cmlic1tuYW1lXSB8fCBudWxsXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9Eb2N1bWVudC9nZXRFbGVtZW50c0J5VGFnTmFtZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEVsZW1lbnRzQnlUYWdOYW1lXG4gICAgRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGZ1bmN0aW9uICh0YWdOYW1lKSB7XG4gICAgICBjb25zdCBIVE1MQ29sbGVjdGlvbiA9IFtdXG4gICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKHRoaXMuY2hpbGRUYWdzLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICBpZiAoZGVzY2VuZGFudC5uYW1lID09PSB0YWdOYW1lIHx8IHRhZ05hbWUgPT09ICcqJykge1xuICAgICAgICAgIEhUTUxDb2xsZWN0aW9uLnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBIVE1MQ29sbGVjdGlvblxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2RvbS9Eb2N1bWVudC9nZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0RWxlbWVudHNCeUNsYXNzTmFtZVxuICAgIEVsZW1lbnRQcm90b3R5cGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSA9IGZ1bmN0aW9uIChjbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IG5hbWVzID0gY2xhc3NOYW1lLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykuc3BsaXQoJyAnKVxuICAgICAgY29uc3QgSFRNTENvbGxlY3Rpb24gPSBbXVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGRlc2NlbmRhbnRDbGFzc05hbWUgPSBkZXNjZW5kYW50LmF0dHJpYnMuY2xhc3NcbiAgICAgICAgaWYgKGRlc2NlbmRhbnRDbGFzc05hbWUgJiYgbmFtZXMuZXZlcnkoKG5hbWUpID0+IGRlc2NlbmRhbnRDbGFzc05hbWUuaW5kZXhPZihuYW1lKSA+IC0xKSkge1xuICAgICAgICAgIEhUTUxDb2xsZWN0aW9uLnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJldHVybiBIVE1MQ29sbGVjdGlvblxuICAgIH1cbiAgfVxuXG4gIGlmICghRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsKSB7XG4gICAgLy8gaHR0cHM6Ly9kb2NzLndlYnBsYXRmb3JtLm9yZy93aWtpL2Nzcy9zZWxlY3RvcnNfYXBpL3F1ZXJ5U2VsZWN0b3JBbGxcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9xdWVyeVNlbGVjdG9yQWxsXG4gICAgRWxlbWVudFByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsID0gZnVuY3Rpb24gKHNlbGVjdG9ycykge1xuICAgICAgc2VsZWN0b3JzID0gc2VsZWN0b3JzLnJlcGxhY2UoLyg+KShcXFMpL2csICckMSAkMicpLnRyaW0oKSAvLyBhZGQgc3BhY2UgZm9yICc+JyBzZWxlY3RvclxuXG4gICAgICAvLyB1c2luZyByaWdodCB0byBsZWZ0IGV4ZWN1dGlvbiA9PiBodHRwczovL2dpdGh1Yi5jb20vZmI1NS9jc3Mtc2VsZWN0I2hvdy1kb2VzLWl0LXdvcmtcbiAgICAgIGNvbnN0IFtkaXNjb3ZlciwgLi4uYXNjZW5kaW5nc10gPSBnZXRJbnN0cnVjdGlvbnMoc2VsZWN0b3JzKVxuICAgICAgY29uc3QgdG90YWwgPSBhc2NlbmRpbmdzLmxlbmd0aFxuICAgICAgcmV0dXJuIGRpc2NvdmVyKHRoaXMpLmZpbHRlcigobm9kZSkgPT4ge1xuICAgICAgICB2YXIgc3RlcCA9IDBcbiAgICAgICAgd2hpbGUgKHN0ZXAgPCB0b3RhbCkge1xuICAgICAgICAgIG5vZGUgPSBhc2NlbmRpbmdzW3N0ZXBdKG5vZGUsIHRoaXMpXG4gICAgICAgICAgaWYgKCFub2RlKSB7IC8vIGhpZXJhcmNoeSBkb2Vzbid0IG1hdGNoXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RlcCArPSAxXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgaWYgKCFFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zKSB7XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY29udGFpbnNcbiAgICBFbGVtZW50UHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgIHZhciBpbmNsdXNpdmUgPSBmYWxzZVxuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbdGhpc10sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgIGlmIChkZXNjZW5kYW50ID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgaW5jbHVzaXZlID0gdHJ1ZVxuICAgICAgICAgIGRvbmUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIGluY2x1c2l2ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qKlxuICogW2dldEluc3RydWN0aW9ucyBkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gc2VsZWN0b3JzIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gZ2V0SW5zdHJ1Y3Rpb25zIChzZWxlY3RvcnMpIHtcbiAgcmV0dXJuIHNlbGVjdG9ycy5zcGxpdCgnICcpLnJldmVyc2UoKS5tYXAoKHNlbGVjdG9yLCBzdGVwKSA9PiB7XG4gICAgY29uc3QgZGlzY292ZXIgPSBzdGVwID09PSAwXG4gICAgY29uc3QgW3R5cGUsIHBzZXVkb10gPSBzZWxlY3Rvci5zcGxpdCgnOicpXG5cbiAgICB2YXIgdmFsaWRhdGUgPSBudWxsXG4gICAgdmFyIGluc3RydWN0aW9uID0gbnVsbFxuXG4gICAgc3dpdGNoICh0cnVlKSB7XG5cbiAgICAgIC8vIGNoaWxkOiAnPidcbiAgICAgIGNhc2UgLz4vLnRlc3QodHlwZSk6XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tQYXJlbnQgKG5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gKHZhbGlkYXRlKSA9PiB2YWxpZGF0ZShub2RlLnBhcmVudCkgJiYgbm9kZS5wYXJlbnRcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuXG4gICAgICAvLyBjbGFzczogJy4nXG4gICAgICBjYXNlIC9eXFwuLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBuYW1lcyA9IHR5cGUuc3Vic3RyKDEpLnNwbGl0KCcuJylcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGVDbGFzc05hbWUgPSBub2RlLmF0dHJpYnMuY2xhc3NcbiAgICAgICAgICByZXR1cm4gbm9kZUNsYXNzTmFtZSAmJiBuYW1lcy5ldmVyeSgobmFtZSkgPT4gbm9kZUNsYXNzTmFtZS5pbmRleE9mKG5hbWUpID4gLTEpXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja0NsYXNzIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKG5hbWVzLmpvaW4oJyAnKSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGF0dHJpYnV0ZTogJ1trZXk9XCJ2YWx1ZVwiXSdcbiAgICAgIGNhc2UgL15cXFsvLnRlc3QodHlwZSk6XG4gICAgICAgIGNvbnN0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSA9IHR5cGUucmVwbGFjZSgvXFxbfFxcXXxcIi9nLCAnJykuc3BsaXQoJz0nKVxuICAgICAgICB2YWxpZGF0ZSA9IChub2RlKSA9PiB7XG4gICAgICAgICAgY29uc3QgaGFzQXR0cmlidXRlID0gT2JqZWN0LmtleXMobm9kZS5hdHRyaWJzKS5pbmRleE9mKGF0dHJpYnV0ZUtleSkgPiAtMVxuICAgICAgICAgIGlmIChoYXNBdHRyaWJ1dGUpIHsgLy8gcmVnYXJkIG9wdGlvbmFsIGF0dHJpYnV0ZVZhbHVlXG4gICAgICAgICAgICBpZiAoIWF0dHJpYnV0ZVZhbHVlIHx8IChub2RlLmF0dHJpYnNbYXR0cmlidXRlS2V5XSA9PT0gYXR0cmlidXRlVmFsdWUpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tBdHRyaWJ1dGUgKG5vZGUsIHJvb3QpIHtcbiAgICAgICAgICBpZiAoZGlzY292ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IE5vZGVMaXN0ID0gW11cbiAgICAgICAgICAgIHRyYXZlcnNlRGVzY2VuZGFudHMoW25vZGVdLCAoZGVzY2VuZGFudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAodmFsaWRhdGUoZGVzY2VuZGFudCkpIHtcbiAgICAgICAgICAgICAgICBOb2RlTGlzdC5wdXNoKGRlc2NlbmRhbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIGlkOiAnIydcbiAgICAgIGNhc2UgL14jLy50ZXN0KHR5cGUpOlxuICAgICAgICBjb25zdCBpZCA9IHR5cGUuc3Vic3RyKDEpXG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5hdHRyaWJzLmlkID09PSBpZFxuICAgICAgICB9XG4gICAgICAgIGluc3RydWN0aW9uID0gZnVuY3Rpb24gY2hlY2tJZCAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50LCBkb25lKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgICBkb25lKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcblxuICAgICAgLy8gdW5pdmVyc2FsOiAnKidcbiAgICAgIGNhc2UgL1xcKi8udGVzdCh0eXBlKTpcbiAgICAgICAgdmFsaWRhdGUgPSAobm9kZSkgPT4gdHJ1ZVxuICAgICAgICBpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIGNoZWNrVW5pdmVyc2FsIChub2RlLCByb290KSB7XG4gICAgICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgICAgICBjb25zdCBOb2RlTGlzdCA9IFtdXG4gICAgICAgICAgICB0cmF2ZXJzZURlc2NlbmRhbnRzKFtub2RlXSwgKGRlc2NlbmRhbnQpID0+IE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudCkpXG4gICAgICAgICAgICByZXR1cm4gTm9kZUxpc3RcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICh0eXBlb2Ygbm9kZSA9PT0gJ2Z1bmN0aW9uJykgPyBub2RlKHZhbGlkYXRlKSA6IGdldEFuY2VzdG9yKG5vZGUsIHJvb3QsIHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG5cbiAgICAgIC8vIHRhZzogJy4uLidcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbGlkYXRlID0gKG5vZGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09PSB0eXBlXG4gICAgICAgIH1cbiAgICAgICAgaW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiBjaGVja1RhZyAobm9kZSwgcm9vdCkge1xuICAgICAgICAgIGlmIChkaXNjb3Zlcikge1xuICAgICAgICAgICAgY29uc3QgTm9kZUxpc3QgPSBbXVxuICAgICAgICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhbbm9kZV0sIChkZXNjZW5kYW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICh2YWxpZGF0ZShkZXNjZW5kYW50KSkge1xuICAgICAgICAgICAgICAgIE5vZGVMaXN0LnB1c2goZGVzY2VuZGFudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gKHR5cGVvZiBub2RlID09PSAnZnVuY3Rpb24nKSA/IG5vZGUodmFsaWRhdGUpIDogZ2V0QW5jZXN0b3Iobm9kZSwgcm9vdCwgdmFsaWRhdGUpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXBzZXVkbykge1xuICAgICAgcmV0dXJuIGluc3RydWN0aW9uXG4gICAgfVxuXG4gICAgY29uc3QgcnVsZSA9IHBzZXVkby5tYXRjaCgvLShjaGlsZHx0eXBlKVxcKChcXGQrKVxcKSQvKVxuICAgIGNvbnN0IGtpbmQgPSBydWxlWzFdXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChydWxlWzJdLCAxMCkgLSAxXG5cbiAgICBjb25zdCB2YWxpZGF0ZVBzZXVkbyA9IChub2RlKSA9PiB7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICB2YXIgY29tcGFyZVNldCA9IG5vZGUucGFyZW50LmNoaWxkVGFnc1xuICAgICAgICBpZiAoa2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgICAgICAgY29tcGFyZVNldCA9IGNvbXBhcmVTZXQuZmlsdGVyKHZhbGlkYXRlKVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGVJbmRleCA9IGNvbXBhcmVTZXQuZmluZEluZGV4KChjaGlsZCkgPT4gY2hpbGQgPT09IG5vZGUpXG4gICAgICAgIGlmIChub2RlSW5kZXggPT09IGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGVuaGFuY2VJbnN0cnVjdGlvbiAobm9kZSkge1xuICAgICAgY29uc3QgbWF0Y2ggPSBpbnN0cnVjdGlvbihub2RlKVxuICAgICAgaWYgKGRpc2NvdmVyKSB7XG4gICAgICAgIHJldHVybiBtYXRjaC5yZWR1Y2UoKE5vZGVMaXN0LCBtYXRjaGVkTm9kZSkgPT4ge1xuICAgICAgICAgIGlmICh2YWxpZGF0ZVBzZXVkbyhtYXRjaGVkTm9kZSkpIHtcbiAgICAgICAgICAgIE5vZGVMaXN0LnB1c2gobWF0Y2hlZE5vZGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBOb2RlTGlzdFxuICAgICAgICB9LCBbXSlcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWxpZGF0ZVBzZXVkbyhtYXRjaCkgJiYgbWF0Y2hcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogUmVjdXJzaXZlIHdhbGtpXG4gKiBAcGFyYW0gIHtbdHlwZV19IG5vZGVzICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBoYW5kbGVyIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIHRyYXZlcnNlRGVzY2VuZGFudHMgKG5vZGVzLCBoYW5kbGVyKSB7XG4gIG5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICB2YXIgcHJvZ3Jlc3MgPSB0cnVlXG4gICAgaGFuZGxlcihub2RlLCAoKSA9PiBwcm9ncmVzcyA9IGZhbHNlKVxuICAgIGlmIChub2RlLmNoaWxkVGFncyAmJiBwcm9ncmVzcykge1xuICAgICAgdHJhdmVyc2VEZXNjZW5kYW50cyhub2RlLmNoaWxkVGFncywgaGFuZGxlcilcbiAgICB9XG4gIH0pXG59XG5cbi8qKlxuICogW2dldEFuY2VzdG9yIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBub2RlICAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IHJvb3QgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gdmFsaWRhdGUgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGdldEFuY2VzdG9yIChub2RlLCByb290LCB2YWxpZGF0ZSkge1xuICB3aGlsZSAobm9kZS5wYXJlbnQpIHtcbiAgICBub2RlID0gbm9kZS5wYXJlbnRcbiAgICBpZiAodmFsaWRhdGUobm9kZSkpIHtcbiAgICAgIHJldHVybiBub2RlXG4gICAgfVxuICAgIGlmIChub2RlID09PSByb290KSB7XG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gbnVsbFxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
