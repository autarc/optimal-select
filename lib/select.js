'use strict';

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

var _adapt = require('./adapt');

var _adapt2 = _interopRequireDefault(_adapt);

var _match = require('./match');

var _match2 = _interopRequireDefault(_match);

var _optimize = require('./optimize');

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
//# sourceMappingURL=data:application/json;base64,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Q0YiLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIFNlbGVjdFxuICpcbiAqIENvbnN0cnVjdCBhIHVuaXF1ZSBDU1MgcXVlcnlzZWxlY3RvciB0byBhY2Nlc3MgdGhlIHNlbGVjdGVkIERPTSBlbGVtZW50KHMpLlxuICogQXBwbGllcyBkaWZmZXJlbnQgbWF0Y2hpbmcgYW5kIG9wdGltaXphdGlvbiBzdHJhdGVnaWVzIGZvciBlZmZpY2llbmN5LlxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vbWF0Y2gnXG5pbXBvcnQgb3B0aW1pemUgZnJvbSAnLi9vcHRpbWl6ZSdcblxuLyoqXG4gKiBDaG9vc2UgYWN0aW9uIGRlcGVuZGluZyBvbiB0aGUgaW5wdXQgKHNpbmdsZS9tdWx0aSlcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fEFycmF5fSBpbnB1dCAgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgIG9wdGlvbnMgLSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UXVlcnlTZWxlY3RvciAoaW5wdXQsIG9wdGlvbnMgPSB7fSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICByZXR1cm4gZ2V0TXVsdGlTZWxlY3RvcihpbnB1dCwgb3B0aW9ucylcbiAgfVxuICByZXR1cm4gZ2V0U2luZ2xlU2VsZWN0b3IoaW5wdXQsIG9wdGlvbnMpXG59XG5cbi8qKlxuICogR2V0IGEgc2VsZWN0b3IgZm9yIHRoZSBwcm92aWRlZCBlbGVtZW50XG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge09iamVjdH0gICAgICBvcHRpb25zIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaW5nbGVTZWxlY3RvciAoZWxlbWVudCwgb3B0aW9ucykge1xuXG4gIGlmIChlbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7XG4gICAgcmV0dXJuIGdldFNpbmdsZVNlbGVjdG9yKGVsZW1lbnQucGFyZW50Tm9kZSlcbiAgfVxuICBpZiAoZWxlbWVudC5ub2RlVHlwZSAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnB1dCAtIG9ubHkgSFRNTEVsZW1lbnRzIG9yIHJlcHJlc2VudGF0aW9ucyBvZiB0aGVtIGFyZSBzdXBwb3J0ZWQhIChub3QgXCIke3R5cGVvZiBlbGVtZW50fVwiKWApXG4gIH1cblxuICBjb25zdCBnbG9iYWxNb2RpZmllZCA9IGFkYXB0KGVsZW1lbnQsIG9wdGlvbnMpXG5cbiAgY29uc3Qgc2VsZWN0b3IgPSBtYXRjaChlbGVtZW50LCBvcHRpb25zKVxuICBjb25zdCBvcHRpbWl6ZWQgPSBvcHRpbWl6ZShzZWxlY3RvciwgZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZyhgXG4gIC8vICAgc2VsZWN0b3I6ICR7c2VsZWN0b3J9XG4gIC8vICAgb3B0aW1pemVkOiR7b3B0aW1pemVkfVxuICAvLyBgKVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBvcHRpbWl6ZWRcbn1cblxuLyoqXG4gKiBHZXQgYSBzZWxlY3RvciB0byBtYXRjaCBtdWx0aXBsZSBjaGlsZHJlbiBmcm9tIGEgcGFyZW50XG4gKiBAcGFyYW0gIHtBcnJheX0gIGVsZW1lbnRzIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgLSBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNdWx0aVNlbGVjdG9yIChlbGVtZW50cywgb3B0aW9ucykge1xuICBjb25zdCBmaXJzdEVsID0gZWxlbWVudHNbMF07XG4gIGxldCBjb21tb25DbGFzc05hbWUgPSBmaXJzdEVsLmNsYXNzTmFtZTtcbiAgbGV0IGNvbW1vblRhZ05hbWUgPSBmaXJzdEVsLnRhZ05hbWU7XG4gIGxldCBjYW5kaWRhdGU7XG5cbiAgY29uc3QgZ2V0UGFyZW50Tm9kZXMgPSBmdW5jdGlvbihlbCkge1xuICAgIGNvbnN0IG5vZGVzID0gW107XG4gICAgd2hpbGUoZWwucGFyZW50Tm9kZSAmJiBlbC5wYXJlbnROb2RlICE9PSBkb2N1bWVudC5ib2R5KSB7XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICBub2Rlcy5wdXNoKGVsKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgY29uc3QgZmluZFNpbWlsYXJQYXJlbnRzID0gZnVuY3Rpb24ocHJvcHMxLCBwcm9wczIpIHtcbiAgICBjb25zdCBzaW1pbGFyID0gW107XG4gICAgbGV0IGksIGo7XG4gICAgZm9yIChpID0gMDsgaSA8IHByb3BzMS5sZW5ndGg7IGkrKykge1xuICAgICAgbm9kZTEgPSBwcm9wczFbaV07XG4gICAgICBmb3IgKGogPSAwOyBqIDwgcHJvcHMyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIG5vZGUyID0gcHJvcHMyW2pdO1xuICAgICAgICBpZiAobm9kZTEgPT09IG5vZGUyIHx8IChub2RlMS50YWdOYW1lID09PSBub2RlMi50YWdOYW1lICYmIG5vZGUxLmNsYXNzTmFtZSA9PT0gbm9kZTIuY2xhc3NOYW1lKSkge1xuICAgICAgICAgIHNpbWlsYXIucHVzaChub2RlMSk7XG4gICAgICAgICAgc2ltaWxhci5jb25jYXQoZmluZFNpbWlsYXJQYXJlbnRzKHByb3BzMS5zbGljZShpKSwgcHJvcHMyLnNsaWNlKGopKSk7XG4gICAgICAgICAgcmV0dXJuIHNpbWlsYXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNpbWlsYXI7XG4gIH1cblxuXG4gIGxldCBjb21tb25QYXJlbnROb2RlcyA9IGdldFBhcmVudE5vZGVzKGZpcnN0RWwpO1xuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjYW5kaWRhdGUgPSBlbGVtZW50c1tpXTtcbiAgICBjb21tb25QYXJlbnROb2RlcyA9IChjb21tb25QYXJlbnROb2RlcywgZ2V0UGFyZW50Tm9kZXMoY2FuZGlkYXRlKSk7XG4gICAgY29uc29sZS5sb2coY29tbW9uUGFyZW50Tm9kZXMpO1xuXG4gICAgaWYgKGNhbmRpZGF0ZS5jbGFzc05hbWUgIT09IGNvbW1vbkNsYXNzTmFtZSkge1xuICAgICAgbGV0IGNsYXNzTmFtZXMgPSBbXTtcblxuICAgICAgbGV0IGxvbmdlciwgc2hvcnRlclxuICAgICAgaWYgKGNhbmRpZGF0ZS5jbGFzc05hbWUubGVuZ3RoID4gY29tbW9uQ2xhc3NOYW1lLmxlbmd0aCkge1xuICAgICAgICBsb25nZXIgPSBjYW5kaWRhdGUuY2xhc3NOYW1lXG4gICAgICAgIHNob3J0ZXIgPSBjb21tb25DbGFzc05hbWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvbmdlciA9IGNvbW1vbkNsYXNzTmFtZVxuICAgICAgICBzaG9ydGVyID0gY2FuZGlkYXRlLmNsYXNzTmFtZVxuICAgICAgfVxuICAgICAgc2hvcnRlci5zcGxpdCgnICcpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlci5pbmRleE9mKG5hbWUpID4gLTEpIHtcbiAgICAgICAgICBjbGFzc05hbWVzLnB1c2gobmFtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGNvbW1vbkNsYXNzTmFtZSA9IGNsYXNzTmFtZXMuam9pbignICcpXG4gICAgfVxuXG4gICAgaWYgKGNhbmRpZGF0ZS50YWdOYW1lICE9PSBjb21tb25UYWdOYW1lKSB7XG4gICAgICBjb21tb25UYWdOYW1lID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGxldCBzZWxlY3RvcnMgPSBbXTtcbiAgaWYgKGNvbW1vblBhcmVudE5vZGVzKSB7XG4gICAgY29uc3QgcGFyZW50U2VsZWN0b3JzID0gY29tbW9uUGFyZW50Tm9kZXMubWFwKGVsID0+IHtcbiAgICAgIGxldCBzZWxlY3RvciA9IGVsLnRhZ05hbWU7XG4gICAgICBpZiAoZWwuaWQgIT09ICcnKSB7XG4gICAgICAgIHNlbGVjdG9yICs9ICcjJyArIGVsLmlkO1xuICAgICAgfSBlbHNlIGlmIChlbC5jbGFzc05hbWUgIT09ICcnKSB7XG4gICAgICAgIHNlbGVjdG9yICs9ICcuJyArIGVsLmNsYXNzTmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvciArICcgJztcbiAgICB9KTtcbiAgICBwYXJlbnRTZWxlY3RvcnMucmV2ZXJzZSgpO1xuXG4gICAgLy8gbGV0cyBhdHRlbXB0IHRvIG1ha2UgdGhlIHNlbGVjdG9yIHNob3J0ZXJcbiAgICBjb25zdCBvcmlnaW5hbENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJlbnRTZWxlY3RvcnMuam9pbignICcpKS5sZW5ndGg7XG4gICAgd2hpbGUocGFyZW50U2VsZWN0b3JzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZUZvclJlbW92YWwgPSBwYXJlbnRTZWxlY3RvcnMuc2hpZnQoKTtcbiAgICAgIGNvbnN0IG5ld0NvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXJlbnRTZWxlY3RvcnMuam9pbignICcpKS5sZW5ndGg7XG4gICAgICBpZiAobmV3Q291bnQgIT09IG9yaWdpbmFsQ291bnQpIHtcbiAgICAgICAgcGFyZW50U2VsZWN0b3JzLnVuc2hpZnQoY2FuZGlkYXRlRm9yUmVtb3ZhbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBzZWxlY3RvcnMucHVzaChwYXJlbnRTZWxlY3RvcnMuam9pbignICcpICsgJyAnKTtcbiAgfVxuICBpZiAoY29tbW9uVGFnTmFtZSkge1xuICAgIHNlbGVjdG9ycy5wdXNoKGAke2NvbW1vblRhZ05hbWUudG9Mb3dlckNhc2UoKX1gKTtcbiAgfVxuICBpZiAoY29tbW9uQ2xhc3NOYW1lKSB7XG4gICAgc2VsZWN0b3JzLnB1c2goYC4ke2NvbW1vbkNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyl9YCk7XG4gIH1cbiAgaWYgKHNlbGVjdG9ycy5sZW5ndGggPT09IDApIHtcbiAgICBzZWxlY3RvcnMgPSBlbGVtZW50cy5tYXAoZSA9PiBnZXRTaW5nbGVTZWxlY3RvcihlLCBvcHRpb25zKSk7XG4gICAgY29uc29sZS5sb2coc2VsZWN0b3JzLmpvaW4oJywnKSwgY29tbW9uQ2xhc3NOYW1lLCBjb21tb25UYWdOYW1lKTtcbiAgICByZXR1cm4gc2VsZWN0b3JzLmpvaW4oJywnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhzZWxlY3RvcnMuam9pbignJyksIGNvbW1vbkNsYXNzTmFtZSwgY29tbW9uVGFnTmFtZSk7XG4gICAgcmV0dXJuIHNlbGVjdG9ycy5qb2luKCcnKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
