const assert = require('assert')

const fn = x => { return new Promise(
  resolve => { setTimeout(resolve, 3000, 2 * x) }
)};

// instead of an IIFE, you can use 'setImmediate' or 'nextTick' or 'setTimeout'
(function() {
  fn(3).then((z) => {
    describe('my suite', function() {
      it(`expected value ${z}`, function() {
        assert.strictEqual(z, 6)
      })
    })

    run()
  })

  

  
})()