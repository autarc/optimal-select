/**
 * # Adapt
 *
 * Check and extend the environment for universal usage.
 */

/**
 * @typedef {import('./select').Options} Options
 */

/**
 * Modify the context based on the environment
 *
 * @param  {HTMLElement} element - [description]
 * @param  {Options}     options - [description]
 * @return {boolean}             - [description]
 */
export default function adapt (element, options) {
  // detect environment setup
  if (global.document) {
    return false
  } else {
    global.document = options.context || (() => {
      var root = element
      while (root.parent) {
        root = root.parent
      }
      return root
    })()
  }

  // https://github.com/fb55/domhandler/blob/master/index.js#L75
  const ElementPrototype = Object.getPrototypeOf(global.document)

  // alternative descriptor to access elements with filtering invalid elements (e.g. textnodes)
  if (!Object.getOwnPropertyDescriptor(ElementPrototype, 'childTags')) {
    Object.defineProperty(ElementPrototype, 'childTags', {
      enumerable: true,
      get () {
        return this.children.filter((node) => {
          // https://github.com/fb55/domelementtype/blob/master/index.js#L12
          return node.type === 'tag' || node.type === 'script' || node.type === 'style'
        })
      }
    })
  }

  if (!Object.getOwnPropertyDescriptor(ElementPrototype, 'attributes')) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes
    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
    Object.defineProperty(ElementPrototype, 'attributes', {
      enumerable: true,
      get () {
        const { attribs } = this
        const attributesNames = Object.keys(attribs)
        const NamedNodeMap = attributesNames.reduce((attributes, attributeName, index) => {
          attributes[index] = {
            name: attributeName,
            value: attribs[attributeName]
          }
          return attributes
        }, { })
        Object.defineProperty(NamedNodeMap, 'length', {
          enumerable: false,
          configurable: false,
          value: attributesNames.length
        })
        return NamedNodeMap
      }
    })
  }

  if (!ElementPrototype.getAttribute) {
    // https://docs.webplatform.org/wiki/dom/Element/getAttribute
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute
    ElementPrototype.getAttribute = function (name) {
      return this.attribs[name] || null
    }
  }

  if (!ElementPrototype.getElementsByTagName) {
    // https://docs.webplatform.org/wiki/dom/Document/getElementsByTagName
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName
    ElementPrototype.getElementsByTagName = function (tagName) {
      const HTMLCollection = []
      traverseDescendants(this.childTags, (descendant) => {
        if (descendant.name === tagName || tagName === '*') {
          HTMLCollection.push(descendant)
        }
      })
      return HTMLCollection
    }
  }

  if (!ElementPrototype.getElementsByClassName) {
    // https://docs.webplatform.org/wiki/dom/Document/getElementsByClassName
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName
    ElementPrototype.getElementsByClassName = function (className) {
      const names = className.trim().replace(/\s+/g, ' ').split(' ')
      const HTMLCollection = []
      traverseDescendants([this], (descendant) => {
        const descendantClassName = descendant.attribs.class
        if (descendantClassName && names.every((name) => descendantClassName.indexOf(name) > -1)) {
          HTMLCollection.push(descendant)
        }
      })
      return HTMLCollection
    }
  }

  if (!ElementPrototype.querySelectorAll) {
    // https://docs.webplatform.org/wiki/css/selectors_api/querySelectorAll
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
    ElementPrototype.querySelectorAll = function (selectors) {
      selectors = selectors.replace(/(>)(\S)/g, '$1 $2').trim() // add space for '>' selector

      // using right to left execution => https://github.com/fb55/css-select#how-does-it-work
      const instructions = getInstructions(selectors)
      const discover = instructions.shift()

      const total = instructions.length
      return discover(this).filter((node) => {
        var step = 0
        while (step < total) {
          node = instructions[step](node, this)
          if (!node) { // hierarchy doesn't match
            return false
          }
          step += 1
        }
        return true
      })
    }
  }

  if (!ElementPrototype.contains) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
    ElementPrototype.contains = function (element) {
      var inclusive = false
      traverseDescendants([this], (descendant, done) => {
        if (descendant === element) {
          inclusive = true
          done()
        }
      })
      return inclusive
    }
  }

  return true
}

/**
 * Retrieve transformation steps
 *
 * @param  {Array.<string>}   selectors - [description]
 * @return {Array.<Function>}           - [description]
 */
function getInstructions (selectors) {
  return selectors.split(' ').reverse().map((selector, step) => {
    const discover = step === 0
    const [type, pseudo] = selector.split(':')

    var validate = null
    var instruction = null

    switch (true) {

      // child: '>'
      case />/.test(type):
        instruction = function checkParent (node) {
          return (validate) => validate(node.parent) && node.parent
        }
        break

        // class: '.'
      case /^\./.test(type): {
        const names = type.substr(1).split('.')
        validate = (node) => {
          const nodeClassName = node.attribs.class
          return nodeClassName && names.every((name) => nodeClassName.indexOf(name) > -1)
        }
        instruction = function checkClass (node, root) {
          if (discover) {
            return node.getElementsByClassName(names.join(' '))
          }
          return (typeof node === 'function') ? node(validate) : getAncestor(node, root, validate)
        }
        break
      }

      // attribute: '[key="value"]'
      case /^\[/.test(type): {
        const [attributeKey, attributeValue] = type.replace(/\[|\]|"/g, '').split('=')
        validate = (node) => {
          const hasAttribute = Object.keys(node.attribs).indexOf(attributeKey) > -1
          if (hasAttribute) { // regard optional attributeValue
            if (!attributeValue || (node.attribs[attributeKey] === attributeValue)) {
              return true
            }
          }
          return false
        }
        instruction = function checkAttribute (node, root) {
          if (discover) {
            const NodeList = []
            traverseDescendants([node], (descendant) => {
              if (validate(descendant)) {
                NodeList.push(descendant)
              }
            })
            return NodeList
          }
          return (typeof node === 'function') ? node(validate) : getAncestor(node, root, validate)
        }
        break
      }

      // id: '#'
      case /^#/.test(type): {
        const id = type.substr(1)
        validate = (node) => {
          return node.attribs.id === id
        }
        instruction = function checkId (node, root) {
          if (discover) {
            const NodeList = []
            traverseDescendants([node], (descendant, done) => {
              if (validate(descendant)) {
                NodeList.push(descendant)
                done()
              }
            })
            return NodeList
          }
          return (typeof node === 'function') ? node(validate) : getAncestor(node, root, validate)
        }
        break
      }

      // universal: '*'
      case /\*/.test(type): {
        validate = () => true
        instruction = function checkUniversal (node, root) {
          if (discover) {
            const NodeList = []
            traverseDescendants([node], (descendant) => NodeList.push(descendant))
            return NodeList
          }
          return (typeof node === 'function') ? node(validate) : getAncestor(node, root, validate)
        }
        break
      }

      // tag: '...'
      default:
        validate = (node) => {
          return node.name === type
        }
        instruction = function checkTag (node, root) {
          if (discover) {
            const NodeList = []
            traverseDescendants([node], (descendant) => {
              if (validate(descendant)) {
                NodeList.push(descendant)
              }
            })
            return NodeList
          }
          return (typeof node === 'function') ? node(validate) : getAncestor(node, root, validate)
        }
    }

    if (!pseudo) {
      return instruction
    }

    const rule = pseudo.match(/-(child|type)\((\d+)\)$/)
    const kind = rule[1]
    const index = parseInt(rule[2], 10) - 1

    const validatePseudo = (node) => {
      if (node) {
        var compareSet = node.parent.childTags
        if (kind === 'type') {
          compareSet = compareSet.filter(validate)
        }
        const nodeIndex = compareSet.findIndex((child) => child === node)
        if (nodeIndex === index) {
          return true
        }
      }
      return false
    }

    return function enhanceInstruction (node) {
      const match = instruction(node)
      if (discover) {
        return match.reduce((NodeList, matchedNode) => {
          if (validatePseudo(matchedNode)) {
            NodeList.push(matchedNode)
          }
          return NodeList
        }, [])
      }
      return validatePseudo(match) && match
    }
  })
}

/**
 * Walking recursive to invoke callbacks
 *
 * @param {Array.<HTMLElement>} nodes   - [description]
 * @param {Function}            handler - [description]
 */
function traverseDescendants (nodes, handler) {
  nodes.forEach((node) => {
    var progress = true
    handler(node, () => progress = false)
    if (node.childTags && progress) {
      traverseDescendants(node.childTags, handler)
    }
  })
}

/**
 * Bubble up from bottom to top
 *
 * @param  {HTMLElement} node     - [description]
 * @param  {HTMLElement} root     - [description]
 * @param  {Function}    validate - [description]
 * @return {HTMLElement}          - [description]
 */
function getAncestor (node, root, validate) {
  while (node.parent) {
    node = node.parent
    if (validate(node)) {
      return node
    }
    if (node === root) {
      break
    }
  }
  return null
}
