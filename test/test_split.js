/* global describe it */
'use strict'


var assert = require('assert')

var shlex = require('../shlex')


describe('shlex.split()', function () {
  // The original test data set was from shellwords, by Hartmut Goebel

  var posix_testcases = [
    ['x', 'x'],
    ['foo bar', 'foo', 'bar'],
    [' foo bar', 'foo', 'bar'],
    [' foo bar ', 'foo', 'bar'],
    ['foo   bar    bla     fasel', 'foo', 'bar', 'bla', 'fasel'],
    ['x y  z              xxxx', 'x', 'y', 'z', 'xxxx'],
    ['\\x bar', 'x', 'bar'],
    ['\\ x bar', ' x', 'bar'],
    ['\\ bar', ' bar'],
    ['foo \\x bar', 'foo', 'x', 'bar'],
    ['foo \\ x bar', 'foo', ' x', 'bar'],
    ['foo \\ bar', 'foo', ' bar'],
    ['foo "bar" bla', 'foo', 'bar', 'bla'],
    ['"foo" "bar" "bla"', 'foo', 'bar', 'bla'],
    ['"foo" bar "bla"', 'foo', 'bar', 'bla'],
    ['"foo" bar bla', 'foo', 'bar', 'bla'],
    ["foo 'bar' bla", 'foo', 'bar', 'bla'],
    ["'foo' 'bar' 'bla'", 'foo', 'bar', 'bla'],
    ["'foo' bar 'bla'", 'foo', 'bar', 'bla'],
    ["'foo' bar bla", 'foo', 'bar', 'bla'],
    ['blurb foo"bar"bar"fasel" baz', 'blurb', 'foobarbarfasel', 'baz'],
    ["blurb foo'bar'bar'fasel' baz", 'blurb', 'foobarbarfasel', 'baz'],
    ['""', ''],
    ["''", ''],
    ['foo "" bar', 'foo', '', 'bar'],
    ["foo '' bar", 'foo', '', 'bar'],
    ['foo "" "" "" bar', 'foo', '', '', '', 'bar'],
    ["foo '' '' '' bar", 'foo', '', '', '', 'bar'],
    ['\\"', '"'],
    ['"\\""', '"'],
    ['"foo\\ bar"', 'foo\\ bar'],
    ['"foo\\\\ bar"', 'foo\\ bar'],
    ['"foo\\\\ bar\\""', 'foo\\ bar"'],
    ['"foo\\\\" bar\\"', 'foo\\', 'bar"'],
    ['"foo\\\\ bar\\" dfadf"', 'foo\\ bar" dfadf'],
    ['"foo\\\\\\ bar\\" dfadf"', 'foo\\\\ bar" dfadf'],
    ['"foo\\\\\\x bar\\" dfadf"', 'foo\\\\x bar" dfadf'],
    ['"foo\\x bar\\" dfadf"', 'foo\\x bar" dfadf'],
    ["\\'", "'"],
    ["'foo\\ bar'", 'foo\\ bar'],
    ["'foo\\\\ bar'", 'foo\\\\ bar'],
    ["\"foo\\\\\\x bar\\\" df'a\\ 'df\"", "foo\\\\x bar\" df'a\\ 'df"],
    ['\\"foo', '"foo'],
    ['\\"foo\\x', '"foox'],
    ['"foo\\x"', 'foo\\x'],
    ['"foo\\ "', 'foo\\ '],
    ['foo\\ xx', 'foo xx'],
    ['foo\\ x\\x', 'foo xx'],
    ['foo\\ x\\x\\"', 'foo xx"'],
    ['"foo\\ x\\x"', 'foo\\ x\\x'],
    ['"foo\\ x\\x\\\\"', 'foo\\ x\\x\\'],
    ['"foo\\ x\\x\\\\""foobar"', 'foo\\ x\\x\\foobar'],
    ["\"foo\\ x\\x\\\\\"\\'\"foobar\"", "foo\\ x\\x\\'foobar"],
    ["\"foo\\ x\\x\\\\\"\\'\"fo'obar\"", "foo\\ x\\x\\'fo'obar"],
    ["\"foo\\ x\\x\\\\\"\\'\"fo'obar\" 'don'\\''t'", "foo\\ x\\x\\'fo'obar", "don't"],
    ["\"foo\\ x\\x\\\\\"\\'\"fo'obar\" 'don'\\''t' \\\\", "foo\\ x\\x\\'fo'obar", "don't", '\\'],
    ["'foo\\ bar'", 'foo\\ bar'],
    ["'foo\\\\ bar'", 'foo\\\\ bar'],
    ['foo\\ bar', 'foo bar'],
    // ["foo#bar\nbaz", "foo", "baz"],  // FIXME: Comments are not implemented
    [':-) ;-)', ':-)', ';-)'],
    ['\u00e1\u00e9\u00ed\u00f3\u00fa', '\u00e1\u00e9\u00ed\u00f3\u00fa'],
    ['hello \\\n world', 'hello', 'world']
  ]

  it('should split according to POSIX rules', function () {
    posix_testcases.forEach(function (test) {
      var input = test[0]
      var expected = test.slice(1)
      assert.deepEqual(shlex.split(input), expected)
    })
  })
})
