/**
 * # Example
 *
 *
 */

var fs = require('fs')
var cheerio = require('cheerio')

var optimalSelect = require('../lib/index')

var indexHTML = fs.readFileSync(__dirname + '/index.html').toString()

// using cheerio which is baed on htmlparser2
var $ = cheerio.load(indexHTML)


// #1 - works
// browser: OptimalSelect.select(document.body)
//          "[onload="runTests()"]"

var node = $('body').get(0)

console.time('A')
console.log('\nA:', optimalSelect.select(node))
console.timeEnd('A')


// #2 -
// browser: OptimalSelect.select(document.querySelectorAll('.divider')[0])
//          ".dropdown-menu > .divider:nth-child(2)"
//

node = $('.divider').get(0)

console.time('B')
console.log('\nB:', optimalSelect.select(node))
console.timeEnd('B')
