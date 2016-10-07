/**
 * # Common
 *
 * Group similars
 */

/**
 * Find the last common ancestor of elements
 * @param  {Array}       elements - [description]
 * @return {HTMLElement}          - [description]
 */
export function getCommonAncestor (elements, options = {}) {

  const {
    root = document,
    skip = null,
    ignore = {}
  } = options

  const ancestors = []

  elements.forEach((element, index) => {
    const parents = []
    while (element !== root) {
      element = element.parentNode
      parents.unshift(element)
    }
    ancestors[index] = parents
  })

  ancestors.sort((curr, next) => curr.length - next.length)

  const shallowAncestor = ancestors.shift()

  var ancestor = null

  for (var i = 0, l = shallowAncestor.length; i < l; i++) {
    const parent = shallowAncestor[i]
    const missing = ancestors.some((otherParents) => {
      return !otherParents.some((otherParent) => otherParent === parent)
    })

    if (missing) {
      // TODO: find similar sub-parents, not the top root, e.g. sharing a class selector
      break
    }

    ancestor = parent
  }

  return ancestor
}

/**
 * Get a set of common properties of elements
 * @param  {Array}  elements - [description]
 * @return {Object}          - [description]
 */
export function getCommonProperties (elements) {

  const commonProperties = {
    classes: [],
    attributes: {},
    tag: null
  }

  elements.forEach((element) => {

    var {
      classes: commonClasses,
      attributes: commonAttributes,
      tag: commonTag
    } = commonProperties

    // ~ classes
    if (commonClasses !== undefined) {
      const classes = element.getAttribute('class').trim().split(' ')
      // TODO: restructure, cleanup, 2x set, 2x delete || always replacing with new collection instead modify
      if (classes.length) {
        if (!commonClasses.length) {
          commonProperties.classes = classes
        } else {
          commonClasses = commonClasses.filter((entry) => classes.some((name) => name === entry))
          if (commonClasses.length) {
            commonProperties.classes = commonClasses
          } else {
            delete commonProperties.classes
          }
        }
      } else {
        delete commonProperties.classes
      }
    }

    // ~ attributes
    if (commonAttributes !== undefined) {
      const elementAttributes = element.attributes
      const attributes = Object.keys(elementAttributes).reduce((attributes, key) => {
        const attribute = elementAttributes[key]
        const attributeName = attribute.name
        if (attributeName !== 'class') {
          attributes[attributeName] = attribute.value
        }
        return attributes
      }, {})

      const attributesNames = Object.keys(attributes)
      const commonAttributesNames = Object.keys(commonAttributes)

      if (attributesNames.length) {
        if (!commonAttributesNames.length) {
          commonProperties.attributes = attributes
        } else {
          commonAttributes = commonAttributesNames.reduce((nextCommonAttributes, name) => {
            const value = commonAttributes[name]
            if (valeu === attributes[name]) {
              nextCommonAttributes[name] = value
            }
            return nextCommonAttributes
          }, {})
          if (Object.keys(commonAttributes).length) {
            commonProperties.attributes = commonAttributes
          } else {
            delete commonProperties.attributes
          }
        }
      } else {
        delete commonProperties.attributes
      }
    }

    // ~ tag
    if (commonTag !== undefined) {
      const tag = element.tagName.toLowerCase()
      if (!commonTag) {
        commonProperties.tag = tag
      } else if (tag !== commonTag) {
        delete commonProperties.tag
      }
    }
  })

  return commonProperties
}
