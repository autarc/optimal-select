'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = match;

var _utilities = require('./utilities');

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

  var ignoreAttribute = ignore.attribute;
  ignore.attribute = function (name, value, defaultPredicate) {
    return ignoreAttribute && ignoreAttribute(name, value, defaultPredicate);
  };

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdGNoLmpzIl0sIm5hbWVzIjpbIm1hdGNoIiwiZGVmYXVsdElnbm9yZSIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5hbWUiLCJpbmRleE9mIiwibm9kZSIsIm9wdGlvbnMiLCJyb290IiwiZG9jdW1lbnQiLCJza2lwIiwicHJpb3JpdHkiLCJpZ25vcmUiLCJwYXRoIiwiZWxlbWVudCIsImxlbmd0aCIsInNraXBDb21wYXJlIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwiZW50cnkiLCJza2lwQ2hlY2tzIiwic29tZSIsImNvbXBhcmUiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsInR5cGUiLCJwcmVkaWNhdGUiLCJ0b1N0cmluZyIsIlJlZ0V4cCIsInJlcGxhY2UiLCJuYW1lIiwidmFsdWUiLCJ0ZXN0IiwiaWdub3JlQXR0cmlidXRlIiwiZGVmYXVsdFByZWRpY2F0ZSIsImNoZWNrQXR0cmlidXRlcyIsImNoZWNrVGFnIiwiY2hlY2tDaGlsZHMiLCJwYXJlbnROb2RlIiwicGF0dGVybiIsImZpbmRQYXR0ZXJuIiwidW5zaGlmdCIsImpvaW4iLCJwYXJlbnQiLCJmaW5kQXR0cmlidXRlc1BhdHRlcm4iLCJtYXRjaGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImF0dHJpYnV0ZXMiLCJzb3J0ZWRLZXlzIiwic29ydCIsImN1cnIiLCJuZXh0IiwiY3VyclBvcyIsIm5leHRQb3MiLCJpIiwibCIsImtleSIsImF0dHJpYnV0ZVZhbHVlIiwiY3VycmVudElnbm9yZSIsImN1cnJlbnREZWZhdWx0SWdub3JlIiwiY2hlY2tJZ25vcmUiLCJjbGFzc05hbWUiLCJ0cmltIiwiZmluZFRhZ1BhdHRlcm4iLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInRhZyIsImNoaWxkcmVuIiwiY2hpbGRUYWdzIiwiY2hpbGQiLCJjaGlsZFBhdHRlcm4iLCJjb25zb2xlIiwid2FybiIsImNoZWNrIl0sIm1hcHBpbmdzIjoiOzs7OztrQkF5QndCQSxLOztBQW5CeEI7O0FBRUEsSUFBTUMsZ0JBQWdCO0FBQ3BCQyxXQURvQixxQkFDVEMsYUFEUyxFQUNNO0FBQ3hCLFdBQU8sQ0FDTCxPQURLLEVBRUwsY0FGSyxFQUdMLHFCQUhLLEVBSUxDLE9BSkssQ0FJR0QsYUFKSCxJQUlvQixDQUFDLENBSjVCO0FBS0Q7QUFQbUIsQ0FBdEI7O0FBVUE7Ozs7Ozs7QUFsQkE7Ozs7OztBQXlCZSxTQUFTSCxLQUFULENBQWdCSyxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7QUFBQSxzQkFPeENBLE9BUHdDLENBRzFDQyxJQUgwQztBQUFBLE1BRzFDQSxJQUgwQyxpQ0FHbkNDLFFBSG1DO0FBQUEsc0JBT3hDRixPQVB3QyxDQUkxQ0csSUFKMEM7QUFBQSxNQUkxQ0EsSUFKMEMsaUNBSW5DLElBSm1DO0FBQUEsMEJBT3hDSCxPQVB3QyxDQUsxQ0ksUUFMMEM7QUFBQSxNQUsxQ0EsUUFMMEMscUNBSy9CLENBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsQ0FMK0I7QUFBQSx3QkFPeENKLE9BUHdDLENBTTFDSyxNQU4wQztBQUFBLE1BTTFDQSxNQU4wQyxtQ0FNakMsRUFOaUM7OztBQVM1QyxNQUFNQyxPQUFPLEVBQWI7QUFDQSxNQUFJQyxVQUFVUixJQUFkO0FBQ0EsTUFBSVMsU0FBU0YsS0FBS0UsTUFBbEI7O0FBRUEsTUFBTUMsY0FBY04sUUFBUSxDQUFDTyxNQUFNQyxPQUFOLENBQWNSLElBQWQsSUFBc0JBLElBQXRCLEdBQTZCLENBQUNBLElBQUQsQ0FBOUIsRUFBc0NTLEdBQXRDLENBQTBDLFVBQUNDLEtBQUQsRUFBVztBQUMvRSxRQUFJLE9BQU9BLEtBQVAsS0FBaUIsVUFBckIsRUFBaUM7QUFDL0IsYUFBTyxVQUFDTixPQUFEO0FBQUEsZUFBYUEsWUFBWU0sS0FBekI7QUFBQSxPQUFQO0FBQ0Q7QUFDRCxXQUFPQSxLQUFQO0FBQ0QsR0FMMkIsQ0FBNUI7O0FBT0EsTUFBTUMsYUFBYSxTQUFiQSxVQUFhLENBQUNQLE9BQUQsRUFBYTtBQUM5QixXQUFPSixRQUFRTSxZQUFZTSxJQUFaLENBQWlCLFVBQUNDLE9BQUQ7QUFBQSxhQUFhQSxRQUFRVCxPQUFSLENBQWI7QUFBQSxLQUFqQixDQUFmO0FBQ0QsR0FGRDs7QUFJQVUsU0FBT0MsSUFBUCxDQUFZYixNQUFaLEVBQW9CYyxPQUFwQixDQUE0QixVQUFDQyxJQUFELEVBQVU7QUFDcEMsUUFBSUMsWUFBWWhCLE9BQU9lLElBQVAsQ0FBaEI7QUFDQSxRQUFJLE9BQU9DLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDckMsUUFBSSxPQUFPQSxTQUFQLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDQSxrQkFBWUEsVUFBVUMsUUFBVixFQUFaO0FBQ0Q7QUFDRCxRQUFJLE9BQU9ELFNBQVAsS0FBcUIsUUFBekIsRUFBbUM7QUFDakNBLGtCQUFZLElBQUlFLE1BQUosQ0FBVyw0QkFBWUYsU0FBWixFQUF1QkcsT0FBdkIsQ0FBK0IsS0FBL0IsRUFBc0MsTUFBdEMsQ0FBWCxDQUFaO0FBQ0Q7QUFDRCxRQUFJLE9BQU9ILFNBQVAsS0FBcUIsU0FBekIsRUFBb0M7QUFDbENBLGtCQUFZQSxZQUFZLE1BQVosR0FBcUIsSUFBakM7QUFDRDtBQUNEO0FBQ0FoQixXQUFPZSxJQUFQLElBQWUsVUFBQ0ssSUFBRCxFQUFPQyxLQUFQO0FBQUEsYUFBaUJMLFVBQVVNLElBQVYsQ0FBZUQsS0FBZixDQUFqQjtBQUFBLEtBQWY7QUFDRCxHQWREOztBQWdCQSxNQUFJRSxrQkFBa0J2QixPQUFPVCxTQUE3QjtBQUNBUyxTQUFPVCxTQUFQLEdBQW1CLFVBQVU2QixJQUFWLEVBQWdCQyxLQUFoQixFQUF1QkcsZ0JBQXZCLEVBQXlDO0FBQzFELFdBQU9ELG1CQUFtQkEsZ0JBQWdCSCxJQUFoQixFQUFzQkMsS0FBdEIsRUFBNkJHLGdCQUE3QixDQUExQjtBQUNELEdBRkQ7O0FBSUEsU0FBT3RCLFlBQVlOLElBQW5CLEVBQXlCO0FBQ3ZCLFFBQUlhLFdBQVdQLE9BQVgsTUFBd0IsSUFBNUIsRUFBa0M7QUFDaEM7QUFDQSxVQUFJdUIsZ0JBQWdCMUIsUUFBaEIsRUFBMEJHLE9BQTFCLEVBQW1DRixNQUFuQyxFQUEyQ0MsSUFBM0MsRUFBaURMLElBQWpELENBQUosRUFBNEQ7QUFDNUQsVUFBSThCLFNBQVN4QixPQUFULEVBQWtCRixNQUFsQixFQUEwQkMsSUFBMUIsRUFBZ0NMLElBQWhDLENBQUosRUFBMkM7O0FBRTNDO0FBQ0E2QixzQkFBZ0IxQixRQUFoQixFQUEwQkcsT0FBMUIsRUFBbUNGLE1BQW5DLEVBQTJDQyxJQUEzQztBQUNBLFVBQUlBLEtBQUtFLE1BQUwsS0FBZ0JBLE1BQXBCLEVBQTRCO0FBQzFCdUIsaUJBQVN4QixPQUFULEVBQWtCRixNQUFsQixFQUEwQkMsSUFBMUI7QUFDRDs7QUFFRDtBQUNBLFVBQUlBLEtBQUtFLE1BQUwsS0FBZ0JBLE1BQXBCLEVBQTRCO0FBQzFCd0Isb0JBQVk1QixRQUFaLEVBQXNCRyxPQUF0QixFQUErQkYsTUFBL0IsRUFBdUNDLElBQXZDO0FBQ0Q7QUFDRjs7QUFFREMsY0FBVUEsUUFBUTBCLFVBQWxCO0FBQ0F6QixhQUFTRixLQUFLRSxNQUFkO0FBQ0Q7O0FBRUQsTUFBSUQsWUFBWU4sSUFBaEIsRUFBc0I7QUFDcEIsUUFBTWlDLFVBQVVDLFlBQVkvQixRQUFaLEVBQXNCRyxPQUF0QixFQUErQkYsTUFBL0IsQ0FBaEI7QUFDQUMsU0FBSzhCLE9BQUwsQ0FBYUYsT0FBYjtBQUNEOztBQUVELFNBQU81QixLQUFLK0IsSUFBTCxDQUFVLEdBQVYsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBVUEsU0FBU1AsZUFBVCxDQUEwQjFCLFFBQTFCLEVBQW9DRyxPQUFwQyxFQUE2Q0YsTUFBN0MsRUFBcURDLElBQXJELEVBQXdGO0FBQUEsTUFBN0JnQyxNQUE2Qix1RUFBcEIvQixRQUFRMEIsVUFBWTs7QUFDdEYsTUFBTUMsVUFBVUssc0JBQXNCbkMsUUFBdEIsRUFBZ0NHLE9BQWhDLEVBQXlDRixNQUF6QyxDQUFoQjtBQUNBLE1BQUk2QixPQUFKLEVBQWE7QUFDWCxRQUFNTSxVQUFVRixPQUFPRyxnQkFBUCxDQUF3QlAsT0FBeEIsQ0FBaEI7QUFDQSxRQUFJTSxRQUFRaEMsTUFBUixLQUFtQixDQUF2QixFQUEwQjtBQUN4QkYsV0FBSzhCLE9BQUwsQ0FBYUYsT0FBYjtBQUNBLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7QUFDRCxTQUFPLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7QUFRQSxTQUFTSyxxQkFBVCxDQUFnQ25DLFFBQWhDLEVBQTBDRyxPQUExQyxFQUFtREYsTUFBbkQsRUFBMkQ7QUFDekQsTUFBTXFDLGFBQWFuQyxRQUFRbUMsVUFBM0I7QUFDQSxNQUFNQyxhQUFhMUIsT0FBT0MsSUFBUCxDQUFZd0IsVUFBWixFQUF3QkUsSUFBeEIsQ0FBNkIsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWdCO0FBQzlELFFBQU1DLFVBQVUzQyxTQUFTTixPQUFULENBQWlCNEMsV0FBV0csSUFBWCxFQUFpQnBCLElBQWxDLENBQWhCO0FBQ0EsUUFBTXVCLFVBQVU1QyxTQUFTTixPQUFULENBQWlCNEMsV0FBV0ksSUFBWCxFQUFpQnJCLElBQWxDLENBQWhCO0FBQ0EsUUFBSXVCLFlBQVksQ0FBQyxDQUFqQixFQUFvQjtBQUNsQixVQUFJRCxZQUFZLENBQUMsQ0FBakIsRUFBb0I7QUFDbEIsZUFBTyxDQUFQO0FBQ0Q7QUFDRCxhQUFPLENBQUMsQ0FBUjtBQUNEO0FBQ0QsV0FBT0EsVUFBVUMsT0FBakI7QUFDRCxHQVZrQixDQUFuQjs7QUFZQSxPQUFLLElBQUlDLElBQUksQ0FBUixFQUFXQyxJQUFJUCxXQUFXbkMsTUFBL0IsRUFBdUN5QyxJQUFJQyxDQUEzQyxFQUE4Q0QsR0FBOUMsRUFBbUQ7QUFDakQsUUFBTUUsTUFBTVIsV0FBV00sQ0FBWCxDQUFaO0FBQ0EsUUFBTXJELFlBQVk4QyxXQUFXUyxHQUFYLENBQWxCO0FBQ0EsUUFBTXRELGdCQUFnQkQsVUFBVTZCLElBQWhDO0FBQ0EsUUFBTTJCLGlCQUFpQiw0QkFBWXhELFVBQVU4QixLQUF0QixDQUF2Qjs7QUFFQSxRQUFNMkIsZ0JBQWdCaEQsT0FBT1IsYUFBUCxLQUF5QlEsT0FBT1QsU0FBdEQ7QUFDQSxRQUFNMEQsdUJBQXVCM0QsY0FBY0UsYUFBZCxLQUFnQ0YsY0FBY0MsU0FBM0U7QUFDQSxRQUFJMkQsWUFBWUYsYUFBWixFQUEyQnhELGFBQTNCLEVBQTBDdUQsY0FBMUMsRUFBMERFLG9CQUExRCxDQUFKLEVBQXFGO0FBQ25GO0FBQ0Q7O0FBRUQsUUFBSXBCLGdCQUFjckMsYUFBZCxVQUFnQ3VELGNBQWhDLE9BQUo7O0FBRUEsUUFBSyxNQUFELENBQVN6QixJQUFULENBQWN5QixjQUFkLE1BQWtDLEtBQXRDLEVBQTZDO0FBQzNDLFVBQUl2RCxrQkFBa0IsSUFBdEIsRUFBNEI7QUFDMUJxQyx3QkFBY2tCLGNBQWQ7QUFDRDs7QUFFRCxVQUFJdkQsa0JBQWtCLE9BQXRCLEVBQStCO0FBQzdCLFlBQU0yRCxZQUFZSixlQUFlSyxJQUFmLEdBQXNCakMsT0FBdEIsQ0FBOEIsTUFBOUIsRUFBc0MsR0FBdEMsQ0FBbEI7QUFDQVUsd0JBQWNzQixTQUFkO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPdEIsT0FBUDtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVNBLFNBQVNILFFBQVQsQ0FBbUJ4QixPQUFuQixFQUE0QkYsTUFBNUIsRUFBb0NDLElBQXBDLEVBQXVFO0FBQUEsTUFBN0JnQyxNQUE2Qix1RUFBcEIvQixRQUFRMEIsVUFBWTs7QUFDckUsTUFBTUMsVUFBVXdCLGVBQWVuRCxPQUFmLEVBQXdCRixNQUF4QixDQUFoQjtBQUNBLE1BQUk2QixPQUFKLEVBQWE7QUFDWCxRQUFNTSxVQUFVRixPQUFPcUIsb0JBQVAsQ0FBNEJ6QixPQUE1QixDQUFoQjtBQUNBLFFBQUlNLFFBQVFoQyxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3hCRixXQUFLOEIsT0FBTCxDQUFhRixPQUFiO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT0EsU0FBU3dCLGNBQVQsQ0FBeUJuRCxPQUF6QixFQUFrQ0YsTUFBbEMsRUFBMEM7QUFDeEMsTUFBTXVELFVBQVVyRCxRQUFRcUQsT0FBUixDQUFnQkMsV0FBaEIsRUFBaEI7QUFDQSxNQUFJTixZQUFZbEQsT0FBT3lELEdBQW5CLEVBQXdCLElBQXhCLEVBQThCRixPQUE5QixDQUFKLEVBQTRDO0FBQzFDLFdBQU8sSUFBUDtBQUNEO0FBQ0QsU0FBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztBQVdBLFNBQVM1QixXQUFULENBQXNCNUIsUUFBdEIsRUFBZ0NHLE9BQWhDLEVBQXlDRixNQUF6QyxFQUFpREMsSUFBakQsRUFBdUQ7QUFDckQsTUFBTWdDLFNBQVMvQixRQUFRMEIsVUFBdkI7QUFDQSxNQUFNOEIsV0FBV3pCLE9BQU8wQixTQUFQLElBQW9CMUIsT0FBT3lCLFFBQTVDO0FBQ0EsT0FBSyxJQUFJZCxJQUFJLENBQVIsRUFBV0MsSUFBSWEsU0FBU3ZELE1BQTdCLEVBQXFDeUMsSUFBSUMsQ0FBekMsRUFBNENELEdBQTVDLEVBQWlEO0FBQy9DLFFBQU1nQixRQUFRRixTQUFTZCxDQUFULENBQWQ7QUFDQSxRQUFJZ0IsVUFBVTFELE9BQWQsRUFBdUI7QUFDckIsVUFBTTJELGVBQWUvQixZQUFZL0IsUUFBWixFQUFzQjZELEtBQXRCLEVBQTZCNUQsTUFBN0IsQ0FBckI7QUFDQSxVQUFJLENBQUM2RCxZQUFMLEVBQW1CO0FBQ2pCLGVBQU9DLFFBQVFDLElBQVIsc0ZBRUpILEtBRkksRUFFRzVELE1BRkgsRUFFVzZELFlBRlgsQ0FBUDtBQUdEO0FBQ0QsVUFBTWhDLGlCQUFlZ0MsWUFBZixvQkFBeUNqQixJQUFFLENBQTNDLE9BQU47QUFDQTNDLFdBQUs4QixPQUFMLENBQWFGLE9BQWI7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O0FBUUEsU0FBU0MsV0FBVCxDQUFzQi9CLFFBQXRCLEVBQWdDRyxPQUFoQyxFQUF5Q0YsTUFBekMsRUFBaUQ7QUFDL0MsTUFBSTZCLFVBQVVLLHNCQUFzQm5DLFFBQXRCLEVBQWdDRyxPQUFoQyxFQUF5Q0YsTUFBekMsQ0FBZDtBQUNBLE1BQUksQ0FBQzZCLE9BQUwsRUFBYztBQUNaQSxjQUFVd0IsZUFBZW5ELE9BQWYsRUFBd0JGLE1BQXhCLENBQVY7QUFDRDtBQUNELFNBQU82QixPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztBQVNBLFNBQVNxQixXQUFULENBQXNCbEMsU0FBdEIsRUFBaUNJLElBQWpDLEVBQXVDQyxLQUF2QyxFQUE4Q0csZ0JBQTlDLEVBQWdFO0FBQzlELE1BQUksQ0FBQ0gsS0FBTCxFQUFZO0FBQ1YsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxNQUFNMkMsUUFBUWhELGFBQWFRLGdCQUEzQjtBQUNBLE1BQUksQ0FBQ3dDLEtBQUwsRUFBWTtBQUNWLFdBQU8sS0FBUDtBQUNEO0FBQ0QsU0FBT0EsTUFBTTVDLElBQU4sRUFBWUMsS0FBWixFQUFtQkcsZ0JBQW5CLENBQVA7QUFDRCIsImZpbGUiOiJtYXRjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogIyBNYXRjaFxuICpcbiAqIFJldHJpZXZlIHNlbGVjdG9yIGZvciBhIG5vZGUuXG4gKi9cblxuaW1wb3J0IHsgZXNjYXBlVmFsdWUgfSBmcm9tICcuL3V0aWxpdGllcydcblxuY29uc3QgZGVmYXVsdElnbm9yZSA9IHtcbiAgYXR0cmlidXRlIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICdzdHlsZScsXG4gICAgICAnZGF0YS1yZWFjdGlkJyxcbiAgICAgICdkYXRhLXJlYWN0LWNoZWNrc3VtJ1xuICAgIF0uaW5kZXhPZihhdHRyaWJ1dGVOYW1lKSA+IC0xXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgdGhlIHBhdGggb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gbm9kZSAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1hdGNoIChub2RlLCBvcHRpb25zKSB7XG5cbiAgY29uc3Qge1xuICAgIHJvb3QgPSBkb2N1bWVudCxcbiAgICBza2lwID0gbnVsbCxcbiAgICBwcmlvcml0eSA9IFsnaWQnLCAnY2xhc3MnLCAnaHJlZicsICdzcmMnXSxcbiAgICBpZ25vcmUgPSB7fVxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IHBhdGggPSBbXVxuICB2YXIgZWxlbWVudCA9IG5vZGVcbiAgdmFyIGxlbmd0aCA9IHBhdGgubGVuZ3RoXG5cbiAgY29uc3Qgc2tpcENvbXBhcmUgPSBza2lwICYmIChBcnJheS5pc0FycmF5KHNraXApID8gc2tpcCA6IFtza2lwXSkubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAoZWxlbWVudCkgPT4gZWxlbWVudCA9PT0gZW50cnlcbiAgICB9XG4gICAgcmV0dXJuIGVudHJ5XG4gIH0pXG5cbiAgY29uc3Qgc2tpcENoZWNrcyA9IChlbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIHNraXAgJiYgc2tpcENvbXBhcmUuc29tZSgoY29tcGFyZSkgPT4gY29tcGFyZShlbGVtZW50KSlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGlnbm9yZSkuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgIHZhciBwcmVkaWNhdGUgPSBpZ25vcmVbdHlwZV1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuXG4gICAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgPT09ICdudW1iZXInKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUudG9TdHJpbmcoKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHByZWRpY2F0ZSA9IG5ldyBSZWdFeHAoZXNjYXBlVmFsdWUocHJlZGljYXRlKS5yZXBsYWNlKC9cXFxcL2csICdcXFxcXFxcXCcpKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIHByZWRpY2F0ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBwcmVkaWNhdGUgPSBwcmVkaWNhdGUgPyAvKD86KS8gOiAvLl4vXG4gICAgfVxuICAgIC8vIGNoZWNrIGNsYXNzLS9hdHRyaWJ1dGVuYW1lIGZvciByZWdleFxuICAgIGlnbm9yZVt0eXBlXSA9IChuYW1lLCB2YWx1ZSkgPT4gcHJlZGljYXRlLnRlc3QodmFsdWUpXG4gIH0pXG5cbiAgdmFyIGlnbm9yZUF0dHJpYnV0ZSA9IGlnbm9yZS5hdHRyaWJ1dGU7XG4gIGlnbm9yZS5hdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gaWdub3JlQXR0cmlidXRlICYmIGlnbm9yZUF0dHJpYnV0ZShuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSk7XG4gIH07XG5cbiAgd2hpbGUgKGVsZW1lbnQgIT09IHJvb3QpIHtcbiAgICBpZiAoc2tpcENoZWNrcyhlbGVtZW50KSAhPT0gdHJ1ZSkge1xuICAgICAgLy8gfiBnbG9iYWxcbiAgICAgIGlmIChjaGVja0F0dHJpYnV0ZXMocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcm9vdCkpIGJyZWFrXG4gICAgICBpZiAoY2hlY2tUYWcoZWxlbWVudCwgaWdub3JlLCBwYXRoLCByb290KSkgYnJlYWtcblxuICAgICAgLy8gfiBsb2NhbFxuICAgICAgY2hlY2tBdHRyaWJ1dGVzKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja1RhZyhlbGVtZW50LCBpZ25vcmUsIHBhdGgpXG4gICAgICB9XG5cbiAgICAgIC8vIGRlZmluZSBvbmx5IG9uZSBwYXJ0IGVhY2ggaXRlcmF0aW9uXG4gICAgICBpZiAocGF0aC5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICBjaGVja0NoaWxkcyhwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGVcbiAgICBsZW5ndGggPSBwYXRoLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVsZW1lbnQgPT09IHJvb3QpIHtcbiAgICBjb25zdCBwYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgICBwYXRoLnVuc2hpZnQocGF0dGVybilcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKVxufVxuXG4vKipcbiAqIEV4dGVuZCBwYXRoIHdpdGggYXR0cmlidXRlIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgcGFyZW50ICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQXR0cmlidXRlcyAocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kQXR0cmlidXRlc1BhdHRlcm4ocHJpb3JpdHksIGVsZW1lbnQsIGlnbm9yZSlcbiAgaWYgKHBhdHRlcm4pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGF0dHJpYnV0ZSBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz59IHByaW9yaXR5IC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGlnbm9yZSAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nP30gICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBmaW5kQXR0cmlidXRlc1BhdHRlcm4gKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgYXR0cmlidXRlcyA9IGVsZW1lbnQuYXR0cmlidXRlc1xuICBjb25zdCBzb3J0ZWRLZXlzID0gT2JqZWN0LmtleXMoYXR0cmlidXRlcykuc29ydCgoY3VyciwgbmV4dCkgPT4ge1xuICAgIGNvbnN0IGN1cnJQb3MgPSBwcmlvcml0eS5pbmRleE9mKGF0dHJpYnV0ZXNbY3Vycl0ubmFtZSlcbiAgICBjb25zdCBuZXh0UG9zID0gcHJpb3JpdHkuaW5kZXhPZihhdHRyaWJ1dGVzW25leHRdLm5hbWUpXG4gICAgaWYgKG5leHRQb3MgPT09IC0xKSB7XG4gICAgICBpZiAoY3VyclBvcyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMVxuICAgIH1cbiAgICByZXR1cm4gY3VyclBvcyAtIG5leHRQb3NcbiAgfSlcblxuICBmb3IgKHZhciBpID0gMCwgbCA9IHNvcnRlZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0gc29ydGVkS2V5c1tpXVxuICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNba2V5XVxuICAgIGNvbnN0IGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubmFtZVxuICAgIGNvbnN0IGF0dHJpYnV0ZVZhbHVlID0gZXNjYXBlVmFsdWUoYXR0cmlidXRlLnZhbHVlKVxuXG4gICAgY29uc3QgY3VycmVudElnbm9yZSA9IGlnbm9yZVthdHRyaWJ1dGVOYW1lXSB8fCBpZ25vcmUuYXR0cmlidXRlXG4gICAgY29uc3QgY3VycmVudERlZmF1bHRJZ25vcmUgPSBkZWZhdWx0SWdub3JlW2F0dHJpYnV0ZU5hbWVdIHx8IGRlZmF1bHRJZ25vcmUuYXR0cmlidXRlXG4gICAgaWYgKGNoZWNrSWdub3JlKGN1cnJlbnRJZ25vcmUsIGF0dHJpYnV0ZU5hbWUsIGF0dHJpYnV0ZVZhbHVlLCBjdXJyZW50RGVmYXVsdElnbm9yZSkpIHtcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgdmFyIHBhdHRlcm4gPSBgWyR7YXR0cmlidXRlTmFtZX09XCIke2F0dHJpYnV0ZVZhbHVlfVwiXWBcblxuICAgIGlmICgoL1xcYlxcZC8pLnRlc3QoYXR0cmlidXRlVmFsdWUpID09PSBmYWxzZSkge1xuICAgICAgaWYgKGF0dHJpYnV0ZU5hbWUgPT09ICdpZCcpIHtcbiAgICAgICAgcGF0dGVybiA9IGAjJHthdHRyaWJ1dGVWYWx1ZX1gXG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGVOYW1lID09PSAnY2xhc3MnKSB7XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGF0dHJpYnV0ZVZhbHVlLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcuJylcbiAgICAgICAgcGF0dGVybiA9IGAuJHtjbGFzc05hbWV9YFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXR0ZXJuXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHRhZyBpZGVudGlmaWVyXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIGVsZW1lbnQgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0FycmF5LjxzdHJpbmc+fSBwYXRoICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICAgIHBhcmVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gY2hlY2tUYWcgKGVsZW1lbnQsIGlnbm9yZSwgcGF0aCwgcGFyZW50ID0gZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gIGNvbnN0IHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIGlmIChwYXR0ZXJuKSB7XG4gICAgY29uc3QgbWF0Y2hlcyA9IHBhcmVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcGF0aC51bnNoaWZ0KHBhdHRlcm4pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuLyoqXG4gKiBMb29rdXAgdGFnIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBpZ25vcmUgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRUYWdQYXR0ZXJuIChlbGVtZW50LCBpZ25vcmUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gIGlmIChjaGVja0lnbm9yZShpZ25vcmUudGFnLCBudWxsLCB0YWdOYW1lKSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgcGF0aCB3aXRoIHNwZWNpZmljIGNoaWxkIGlkZW50aWZpZXJcbiAqXG4gKiBOT1RFOiAnY2hpbGRUYWdzJyBpcyBhIGN1c3RvbSBwcm9wZXJ0eSB0byB1c2UgYXMgYSB2aWV3IGZpbHRlciBmb3IgdGFncyB1c2luZyAnYWRhcHRlci5qcydcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcGF0aCAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGNoZWNrQ2hpbGRzIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlLCBwYXRoKSB7XG4gIGNvbnN0IHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZVxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5jaGlsZFRhZ3MgfHwgcGFyZW50LmNoaWxkcmVuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZHJlbltpXVxuICAgIGlmIChjaGlsZCA9PT0gZWxlbWVudCkge1xuICAgICAgY29uc3QgY2hpbGRQYXR0ZXJuID0gZmluZFBhdHRlcm4ocHJpb3JpdHksIGNoaWxkLCBpZ25vcmUpXG4gICAgICBpZiAoIWNoaWxkUGF0dGVybikge1xuICAgICAgICByZXR1cm4gY29uc29sZS53YXJuKGBcbiAgICAgICAgICBFbGVtZW50IGNvdWxkblxcJ3QgYmUgbWF0Y2hlZCB0aHJvdWdoIHN0cmljdCBpZ25vcmUgcGF0dGVybiFcbiAgICAgICAgYCwgY2hpbGQsIGlnbm9yZSwgY2hpbGRQYXR0ZXJuKVxuICAgICAgfVxuICAgICAgY29uc3QgcGF0dGVybiA9IGA+ICR7Y2hpbGRQYXR0ZXJufTpudGgtY2hpbGQoJHtpKzF9KWBcbiAgICAgIHBhdGgudW5zaGlmdChwYXR0ZXJuKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlXG59XG5cbi8qKlxuICogTG9va3VwIGlkZW50aWZpZXJcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48c3RyaW5nPn0gcHJpb3JpdHkgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gICAgZWxlbWVudCAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgaWdub3JlICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmZ1bmN0aW9uIGZpbmRQYXR0ZXJuIChwcmlvcml0eSwgZWxlbWVudCwgaWdub3JlKSB7XG4gIHZhciBwYXR0ZXJuID0gZmluZEF0dHJpYnV0ZXNQYXR0ZXJuKHByaW9yaXR5LCBlbGVtZW50LCBpZ25vcmUpXG4gIGlmICghcGF0dGVybikge1xuICAgIHBhdHRlcm4gPSBmaW5kVGFnUGF0dGVybihlbGVtZW50LCBpZ25vcmUpXG4gIH1cbiAgcmV0dXJuIHBhdHRlcm5cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSB3aXRoIGN1c3RvbSBhbmQgZGVmYXVsdCBmdW5jdGlvbnNcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gcHJlZGljYXRlICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZz99ICBuYW1lICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7c3RyaW5nfSAgIHZhbHVlICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gZGVmYXVsdFByZWRpY2F0ZSAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5mdW5jdGlvbiBjaGVja0lnbm9yZSAocHJlZGljYXRlLCBuYW1lLCB2YWx1ZSwgZGVmYXVsdFByZWRpY2F0ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjb25zdCBjaGVjayA9IHByZWRpY2F0ZSB8fCBkZWZhdWx0UHJlZGljYXRlXG4gIGlmICghY2hlY2spIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gY2hlY2sobmFtZSwgdmFsdWUsIGRlZmF1bHRQcmVkaWNhdGUpXG59XG4iXX0=
