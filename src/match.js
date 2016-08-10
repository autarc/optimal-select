import cssesc from 'cssesc';

/**
 * # Match
 *
 * Retrieves selector
 */

const defaultIgnore = {
  attribute (attributeName) {
    return [
      'style',
      'data-reactid',
      'data-react-checksum'
    ].indexOf(attributeName) > -1
  }
}

/**
 * Get the path of the element
 * @param  {HTMLElement} node    - [description]
 * @param  {Object}      options - [description]
 * @return {String}              - [description]
 */
export default function match (node, options) {
  const path = []
  var element = node
  var length = path.length

  const { ignore = {} } = options

  var ignoreClass = !!options.classesToFilter;
  Object.keys(ignore).forEach((type) => {
    if (type === 'class') {
      ignoreClass = true
    }
    var predicate = ignore[type]
    if (typeof predicate === 'function') return
    if (typeof predicate === 'number') {
      predicate = predicate.toString()
    }
    if (typeof predicate === 'string') {
      predicate = new RegExp(predicate)
    }
    // check class-/attributename for regex
    ignore[type] = predicate.test.bind(predicate)
  })
  if (ignoreClass) {
    if (!ignore.class) {
      ignore.class = function() {
        return false;
      };
    }
    const ignoreAttribute = ignore.attribute
    ignore.attribute = (name, value, defaultPredicate) => {
      return ignore.class(value) || ignoreAttribute && ignoreAttribute(name, value, defaultPredicate)
    }
  }

  while (element !== document) {
    // global
    if (checkId(element, path, ignore)) break
    if (checkClassesGlobal(element, path, ignore, options)) break
    if (checkAttributeGlobal(element, path, ignore)) break
    if (checkTagGlobal(element, path, ignore)) break

    // local
    checkClassesLocal(element, path, ignore, options)

    // define only one selector each iteration
    if (path.length === length) {
      checkAttributeLocal(element, path, ignore)
    }
    if (path.length === length) {
      checkTagLocal(element, path, ignore)
    }

    if (path.length === length) {
      checkClassesChild(element, path, ignore, options)
    }
    if (path.length === length) {
      checkAttributeChild(element, path, ignore)
    }
    if (path.length === length) {
      checkTagChild(element, path, ignore)
    }

    element = element.parentNode
    length = path.length
  }

  if (element === document) {
    path.unshift('*')
  }

  return path.join(' ');
}


/**
 * [checkClassesGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkClassesGlobal (element, path, ignore, options) {
  return checkClasses(element, path, ignore, document, options)
}

/**
 * [checkClassesLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkClassesLocal (element, path, ignore, options) {
  return checkClasses(element, path, ignore, element.parentNode, options)
}

/**
 * [checkClassesChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkClassesChild (element, path, ignore, options) {
  const classes = _getFilteredClasses(element, ignore);
  if (!classes.length) {
    return false;
  }
  return checkChild(element, path, '.' + classes.join('.'));
}

/**
 * [checkAttributeGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeGlobal (element, path, ignore) {
  return checkAttribute(element, path, ignore, document)
}

/**
 * [checkAttributeLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeLocal (element, path, ignore) {
  return checkAttribute(element, path, ignore, element.parentNode)
}

/**
 * [checkAttributeChild description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttributeChild (element, path, ignore) {
  const attributes = _getAttributes(element);
  return attributes.some(attribute => {
    const attributeName = attribute.name;
    const attributeValue = attribute.value;
    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
      return false;
    }
    const pattern = `[${attributeName}="${attributeValue}"]`;
    return checkChild(element, path, pattern);
  })
}

/**
 * [checkTagGlobal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTagGlobal (element, path, ignore) {
  return checkTag(element, path, ignore, document)
}

/**
 * [checkTagLocal description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTagLocal (element, path, ignore) {
  return checkTag(element, path, ignore, element.parentNode)
}

/**
 * [checkTabChildren description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkTagChild (element, path, ignore) {
  const tagName = element.tagName.toLowerCase()
  if (checkIgnore(ignore.tag, tagName)) {
    return false
  }
  return checkChild(element, path, tagName)
}

/**
 * [checkId description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @return {Boolean}             - [description]
 */
function checkId (element, path, ignore) {
  const id = element.getAttribute('id')
  if (checkIgnore(ignore.id, id)) {
    return false
  }
  path.unshift(`#${id}`)
  return true
}

function _getFilteredClasses (element, ignore) {
  const className = element.className.trim();

  if (!className) {
    return [];
  }

  let classes = className.split(' ');
  if (ignore.class) {
    classes = classes.filter(c => !ignore.class(c));
  }

  return classes;
}

/**
 * [checkClasses description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkClasses (element, path, ignore, parent, options) {
  const classes = _getFilteredClasses(element, ignore);
  if (!classes.length) {
    return false;
  }
  const matches = parent.getElementsByClassName(classes.join(' '));
  if (matches.length === 1) {
    const classSelector = '.' + classes.map(c => {
      return cssesc(c, {isIdentifier: true});
    }).join('.');
    path.unshift(classSelector);
    return true;
  }

  return false;
}

function _getAttributes(element) {
  return Array.from(element.attributes).filter(attr => !['id', 'class'].includes(attr.name));
}

/**
 * [checkAttribute description]
 * @param  {HTMLElement} element - [description]
 * @param  {Array}       path    - [description]
 * @param  {Object}      ignore  - [description]
 * @param  {HTMLElement} parent  - [description]
 * @return {Boolean}             - [description]
 */
function checkAttribute (element, path, ignore, parent) {
  const attributes = _getAttributes(element);
  return attributes.some(attribute => {
    const attributeName = attribute.name;
    const attributeValue = attribute.value;
    if (checkIgnore(ignore.attribute, attributeName, attributeValue, defaultIgnore.attribute)) {
      return false;
    }
    const pattern = `[${attributeName}="${attributeValue}"]`;
    const matches = parent.querySelectorAll(pattern);
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
function checkTag (element, path, ignore, parent) {
  const tagName = element.tagName.toLowerCase()
  if (checkIgnore(ignore.tag, tagName)) {
    return false
  }
  const matches = parent.getElementsByTagName(tagName)
  if (matches.length === 1) {
    path.unshift(tagName)
    return true
  }
  return false
}

/**
 * [checkChild description]
 * Note: childTags is a custom property to use a view filter for tags on for virutal elements
 * @param  {HTMLElement} element  - [description]
 * @param  {Array}       path     - [description]
 * @param  {String}      selector - [description]
 * @return {Boolean}              - [description]
 */
function checkChild (element, path, selector) {
  const parent = element.parentNode
  const children = parent.childTags || parent.children
  for (var i = 0, l = children.length; i < l; i++) {
    if (children[i] === element) {
      path.unshift(`> ${selector}:nth-child(${i+1})`)
      return true
    }
  }
  return false
}

/**
 * [checkIgnore description]
 * @param  {Function} predicate        [description]
 * @param  {string}   name             [description]
 * @param  {string}   value            [description]
 * @param  {Function} defaultPredicate [description]
 * @return {boolean}                   [description]
 */
function checkIgnore (predicate, name, value, defaultPredicate) {
  if (!name) {
    return true
  }
  const check = predicate || defaultPredicate
  if (!check) {
    return false
  }
  return check(name, value, defaultPredicate)
}
