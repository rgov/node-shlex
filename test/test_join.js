/* eslint-env mocha */
'use strict'

const { assert } = require('chai')
const shlex = require('../shlex')

describe('shlex.join()', () => {
  const posixTestcases = [
    [["ls", "-al", '/'], 'ls -al /'],
    [[ 'rm', '-f', '/Volumes/Macintosh HD' ], "rm -f '/Volumes/Macintosh HD'"],
  ]

  it('should join according to POSIX rules', () => {
    posixTestcases.forEach(function (test) {
      const input = test[0]
      const expected = test(1)

      assert.deepEqual(shlex.join(input), expected)
    })
  })
})
