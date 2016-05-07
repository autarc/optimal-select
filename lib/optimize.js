'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;

var _adapt = require('./adapt');

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
//# sourceMappingURL=data:application/json;base64,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QTFCLENBQWQ7QUFDQSxjQUFJLFFBQVEsTUFBUixLQUFtQixDQUFuQixJQUF3QixRQUFRLENBQVIsTUFBZSxPQUEzQyxFQUFvRDtBQUNsRCxzQkFBVSxZQUFWO0FBQ0Q7QUFDRDtBQUNEO0FBQ0Y7QUFDRjtBQUNGOztBQUVELFNBQU8sT0FBUDtBQUNEIiwiZmlsZSI6Im9wdGltaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiAjIE9wdGltaXplXG4gKlxuICogMS4pIEltcHJvdmUgZWZmaWNpZW5jeSB0aHJvdWdoIHNob3J0ZXIgc2VsZWN0b3JzIGJ5IHJlbW92aW5nIHJlZHVuZGFuY3lcbiAqIDIuKSBJbXByb3ZlIHJvYnVzdG5lc3MgdGhyb3VnaCBzZWxlY3RvciB0cmFuc2Zvcm1hdGlvblxuICovXG5cbmltcG9ydCBhZGFwdCBmcm9tICcuL2FkYXB0J1xuXG4vKipcbiAqIEFwcGx5IGRpZmZlcmVudCBvcHRpbWl6YXRpb24gdGVjaG5pcXVlc1xuICogQHBhcmFtICB7c3RyaW5nfSAgICAgIHNlbGVjdG9yIC0gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgIC0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgIC0gW2Rlc2NyaXB0aW9uXVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBvcHRpbWl6ZSAoc2VsZWN0b3IsIGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuXG4gIGNvbnN0IGdsb2JhbE1vZGlmaWVkID0gYWRhcHQoZWxlbWVudCwgb3B0aW9ucylcblxuICAvLyBjaHVuayBwYXJ0cyBvdXRzaWRlIG9mIHF1b3RlcyAoaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjU2NjM3MjkpXG4gIHZhciBwYXRoID0gc2VsZWN0b3IucmVwbGFjZSgvPiAvZywgJz4nKS5zcGxpdCgvXFxzKyg/PSg/Oig/OlteXCJdKlwiKXsyfSkqW15cIl0qJCkvKVxuXG4gIGlmIChwYXRoLmxlbmd0aCA8IDMpIHtcbiAgICByZXR1cm4gc2VsZWN0b3JcbiAgfVxuXG4gIGNvbnN0IHNob3J0ZW5lZCA9IFtwYXRoLnBvcCgpXVxuICB3aGlsZSAocGF0aC5sZW5ndGggPiAxKSAge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBwYXRoLnBvcCgpXG4gICAgY29uc3QgcHJlUGFydCA9IHBhdGguam9pbignICcpXG4gICAgY29uc3QgcG9zdFBhcnQgPSBzaG9ydGVuZWQuam9pbignICcpXG5cbiAgICBjb25zdCBwYXR0ZXJuID0gYCR7cHJlUGFydH0gJHtwb3N0UGFydH1gXG4gICAgY29uc3QgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHNob3J0ZW5lZC51bnNoaWZ0KG9wdGltaXplUGFydChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudCkpXG4gICAgfVxuICB9XG4gIHNob3J0ZW5lZC51bnNoaWZ0KHBhdGhbMF0pXG4gIHBhdGggPSBzaG9ydGVuZWRcblxuICAvLyBvcHRpbWl6ZSBzdGFydCArIGVuZFxuICBwYXRoWzBdID0gb3B0aW1pemVQYXJ0KCcnLCBwYXRoWzBdLCBwYXRoLnNsaWNlKDEpLmpvaW4oJyAnKSwgZWxlbWVudClcbiAgcGF0aFtwYXRoLmxlbmd0aC0xXSA9IG9wdGltaXplUGFydChwYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksIHBhdGhbcGF0aC5sZW5ndGgtMV0sICcnLCBlbGVtZW50KVxuXG4gIGlmIChnbG9iYWxNb2RpZmllZCkge1xuICAgIGRlbGV0ZSBnbG9iYWwuZG9jdW1lbnRcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oJyAnKS5yZXBsYWNlKC8+L2csICc+ICcpLnRyaW0oKVxufVxuXG4vKipcbiAqIEltcHJvdmUgYSBjaHVuayBvZiB0aGUgc2VsZWN0b3JcbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICBwcmVQYXJ0ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICBjdXJyZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge3N0cmluZ30gICAgICBwb3N0UGFydCAtIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBlbGVtZW50ICAtIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAtIFtkZXNjcmlwdGlvbl1cbiAqL1xuZnVuY3Rpb24gb3B0aW1pemVQYXJ0IChwcmVQYXJ0LCBjdXJyZW50LCBwb3N0UGFydCwgZWxlbWVudCkge1xuICBpZiAocHJlUGFydC5sZW5ndGgpIHByZVBhcnQgPSBgJHtwcmVQYXJ0fSBgXG4gIGlmIChwb3N0UGFydC5sZW5ndGgpIHBvc3RQYXJ0ID0gYCAke3Bvc3RQYXJ0fWBcblxuICAvLyByb2J1c3RuZXNzOiBhdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZSAoZ2VuZXJhbGl6YXRpb24pXG4gIGlmICgvXFxbKlxcXS8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGtleSA9IGN1cnJlbnQucmVwbGFjZSgvPS4qJC8sICddJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtrZXl9JHtwb3N0UGFydH1gXG4gICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgIGN1cnJlbnQgPSBrZXlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcm9idXN0bmVzczogcmVwbGFjZSBzcGVjaWZpYyBrZXktdmFsdWUgd2l0aCB0YWcgKGhldXJpc3RpYylcbiAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAke3ByZVBhcnR9JHtrZXl9YClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcmVmZXJlbmNlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHJlZmVyZW5jZXNbaV0uY29udGFpbnMoZWxlbWVudCkpIHtcbiAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHJlZmVyZW5jZXNbaV0udGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7ZGVzY3JpcHRpb259JHtwb3N0UGFydH1gXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHBhdHRlcm4pXG4gICAgICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBkZXNjcmlwdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gcm9idXN0bmVzczogZGVzY2VuZGFudCBpbnN0ZWFkIGNoaWxkIChoZXVyaXN0aWMpXG4gIGlmICgvPi8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IGRlc2NlbmRhbnQgPSBjdXJyZW50LnJlcGxhY2UoLz4vLCAnJylcbiAgICB2YXIgcGF0dGVybiA9IGAke3ByZVBhcnR9JHtkZXNjZW5kYW50fSR7cG9zdFBhcnR9YFxuICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSBlbGVtZW50KSB7XG4gICAgICBjdXJyZW50ID0gZGVzY2VuZGFudFxuICAgIH1cbiAgfVxuXG4gIC8vIHJvYnVzdG5lc3M6ICdudGgtb2YtdHlwZScgaW5zdGVhZCAnbnRoLWNoaWxkJyAoaGV1cmlzdGljKVxuICBpZiAoLzpudGgtY2hpbGQvLnRlc3QoY3VycmVudCkpIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciBjb21wbGV0ZSBjb3ZlcmFnZSBvZiAnbnRoLW9mLXR5cGUnIHJlcGxhY2VtZW50XG4gICAgY29uc3QgdHlwZSA9IGN1cnJlbnQucmVwbGFjZSgvbnRoLWNoaWxkL2csICdudGgtb2YtdHlwZScpXG4gICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7dHlwZX0ke3Bvc3RQYXJ0fWBcbiAgICB2YXIgbWF0Y2hlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocGF0dGVybilcbiAgICBpZiAobWF0Y2hlcy5sZW5ndGggPT09IDEgJiYgbWF0Y2hlc1swXSA9PT0gZWxlbWVudCkge1xuICAgICAgY3VycmVudCA9IHR5cGVcbiAgICB9XG4gIH1cblxuICAvLyBlZmZpY2llbmN5OiBjb21iaW5hdGlvbnMgb2YgY2xhc3NuYW1lIChwYXJ0aWFsIHBlcm11dGF0aW9ucylcbiAgaWYgKC9cXC5cXFMrXFwuXFxTKy8udGVzdChjdXJyZW50KSkge1xuICAgIGNvbnN0IG5hbWVzID0gY3VycmVudC50cmltKCkuc3BsaXQoJy4nKS5zbGljZSgxKS5tYXAoKG5hbWUpID0+IGAuJHtuYW1lfWApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zb3J0KChjdXJyLCBuZXh0KSA9PiBjdXJyLmxlbmd0aCAtIG5leHQubGVuZ3RoKVxuICAgIHdoaWxlIChuYW1lcy5sZW5ndGgpIHtcbiAgICAgIHZhciBwYXJ0aWFsID0gY3VycmVudC5yZXBsYWNlKG5hbWVzLnNoaWZ0KCksICcnKVxuICAgICAgdmFyIHBhdHRlcm4gPSBgJHtwcmVQYXJ0fSR7cGFydGlhbH0ke3Bvc3RQYXJ0fWBcbiAgICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgICAgaWYgKG1hdGNoZXMubGVuZ3RoID09PSAxICYmIG1hdGNoZXNbMF0gPT09IGVsZW1lbnQpIHtcbiAgICAgICAgY3VycmVudCA9IHBhcnRpYWxcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gcm9idXN0bmVzczogZGVncmFkZSBjb21wbGV4IGNsYXNzbmFtZSAoaGV1cmlzdGljKVxuICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQubWF0Y2goL1xcLi9nKS5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zdCByZWZlcmVuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgJHtwcmVQYXJ0fSR7Y3VycmVudH1gKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSByZWZlcmVuY2VzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBpZiAocmVmZXJlbmNlc1tpXS5jb250YWlucyhlbGVtZW50KSkge1xuICAgICAgICAgIC8vIFRPRE86XG4gICAgICAgICAgLy8gLSBjaGVjayB1c2luZyBhdHRyaWJ1dGVzICsgcmVnYXJkIGV4Y2x1ZGVzXG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSByZWZlcmVuY2VzW2ldLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIHZhciBwYXR0ZXJuID0gYCR7cHJlUGFydH0ke2Rlc2NyaXB0aW9ufSR7cG9zdFBhcnR9YFxuICAgICAgICAgIHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwYXR0ZXJuKVxuICAgICAgICAgIGlmIChtYXRjaGVzLmxlbmd0aCA9PT0gMSAmJiBtYXRjaGVzWzBdID09PSBlbGVtZW50KSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gZGVzY3JpcHRpb25cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
