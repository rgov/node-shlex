import { assert } from 'chai'
import * as shlex from '../shlex.js'

describe('shlex.join()', () => {
  const posixTestcases = [
    [['ls', '-al', '/'], 'ls -al /'],
    [['rm', '-f', '/Volumes/Macintosh HD'], "rm -f '/Volumes/Macintosh HD'"]
  ]

  it('should join according to POSIX rules', () => {
    posixTestcases.forEach(function (test) {
      const [input, expected] = test

      assert.deepEqual(shlex.join(input), expected)
    })
  })

  it('should be undone by split()', () => {
    const testcases = [
      ['a\\\\\'b'],
      ['\\\\\'', 'x\\"\'y'],
      ['$\'\\n\'', '"\\\\"']
    ]

    testcases.forEach(function (input) {
      assert.deepEqual(shlex.split(shlex.join(input)), input)
    })
  })
})
