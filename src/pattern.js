/**
 * @typedef  {Object} Pattern
 * @property {('descendant' | 'child')}                  [relates]
 * @property {string}                                    [tag]
 * @property {Array.<{ name: string, value: string? }>}  attributes
 * @property {Array.<string>}                            classes
 * @property {Array.<string>}                            pseudo
 */

/**
 * Convert attributes to string
 * 
 * @param {Array.<{ name: string, value: string? }>} attributes 
 * @returns {string}
 */
export const attributesToString = (attributes) =>
  attributes.map(({ name, value }) => {
    if (name === 'id') {
      return `#${value}`
    }
    if (value === null) {
      return `[${name}]`
    }
    return `[${name}="${value}"]`
  }).join('')

/**
 * Convert classes to string
 * 
 * @param {Array.<string>} classes 
 * @returns {string}
 */
 export const classesToString = (classes) => classes.length ? `.${classes.join('.')}` : ''

/**
 * Convert pseudo selectors to string
 * 
 * @param {Array.<string>} pseudo 
 * @returns {string}
 */
export const pseudoToString = (pseudo) => pseudo.length ? `:${pseudo.join(':')}` : ''

/**
 * Convert pattern to string
 * 
 * @param {Pattern} pattern 
 * @returns {string}
 */
export const patternToString = (pattern) => {
  const { relates, tag, attributes, classes, pseudo } = pattern
  const value = `${
    relates === 'child' ? '> ' : ''
  }${
    tag || ''
  }${
    attributesToString(attributes)
  }${
    classesToString(classes)
  }${
    pseudoToString(pseudo)
  }`
  return value
}

/**
 * Creates a new pattern structure
 * 
 * @param {Partial<Pattern>} pattern
 * @returns {Pattern}
 */
export const createPattern = (base = {}) =>
  ({ attributes: [], classes: [], pseudo: [], ...base })

/**
 * Converts path to string
 *
 * @param {Array.<Pattern>} path 
 * @returns {string}
 */
export const pathToString = (path) =>
  path.map(patternToString).join(' ')
