'use strict'

/*
Port of a subset of the features of CPython's shlex module, which provides a
shell-like lexer. Original code by Eric S. Raymond and other contributors.
*/

var assert = require('assert')


class Shlexer {
  constructor (stream, posix = true, punctuation_chars = '') {
    this.i = 0
    this.stream = stream

    this.posix = posix
    if (this.posix !== true) {
      assert.fail('Only POSIX mode is implemented')
    }

    /**
     * The string of characters that are recognized as comment beginners. All
     * characters from the comment beginner to end of line are ignored.
     */
    this.commenters = ''
    if (this.commenters !== '') {
      assert.fail('Comments are not implemented yet')
    }

    /**
     * The string of characters that will accumulate into multi-character
     * tokens. By default, includes all ASCII alphanumerics and underscore. In
     * POSIX mode, the accented characters in the Latin-1 set are also included.
     */
    this.wordchars = 'abcdfeghijklmnopqrstuvwxyz' +
                     'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                     '0123456789' +
                     '_'
    if (this.posix) {
      this.wordchars += 'ßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ' +
                        'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ'
    }

    /**
     * Characters that will be considered whitespace and skipped. Whitespace
     * bounds tokens. By default, includes space, tab, linefeed and carriage
     * return.
    */
    this.whitespace = ' \t\r\n'

    /**
     * If True, tokens will only be split in whitespaces.
     */
    this.whitespace_split = false
    if (this.whitespace_split !== false) {
      assert.fail('This whitespace splitting mode is not implemented yet')
    }

    /**
     * Characters that will be considered string quotes. The token accumulates
     * until the same quote is encountered again (thus, different quote types
     * protect each other as in the shell.) By default, includes ASCII single
     * and double quotes.
    */
    this.quotes = '\'"'

    /**
     * Characters that will be considered as escape. This will be only used in
     * POSIX mode, and includes just `\` by default.
     */
    this.escapes = '\\'

    /**
     * The subset of quote types that allow escaped characters. This is only
     * used in POSIX mode, and includes just `"` by default.
    */
    this.escapedquotes = '"'

    /**
     * Characters that will be considered punctuation. Runs of punctuation
     * characters will be returned as a single token. However, note that no
     * semantic validity checking will be performed: for example, ‘>>>’ could
     *  be returned as a token, even though it may not be recognised as such by
     * shells.
     */
    this.punctuation_chars = punctuation_chars
    if (this.punctuation_chars !== '') {
      assert.fail('Punctuation characters are not implemented yet')
    }

    this.debug = 0
  }

  read_char () {
    return this.stream.charAt(this.i++)
  }

  * [Symbol.iterator] () {
    var in_quote = false
    var escaped = false
    var token

    while (true) {
      var char = this.read_char()

      if (this.debug >= 3) {
        console.log(
          'input:', '>' + char + '<',
          'accumulated:', token,
          'in_quote:', in_quote,
          'escaped:', escaped
        )
      }

      // Ran out of characters, we're done
      if (char === '') {
        assert(!in_quote, 'Got EOF while in a quoted string')
        assert(!escaped, 'Got EOF while in an escape sequence')
        if (token !== undefined) { yield token }
        return
      }

      // We were in an escape sequence, complete it
      if (escaped) {
        // In a quote, we are only allowed to escape the quote character or
        // another escape character
        if (!in_quote || char === in_quote || this.escapes.includes(char)) {
          token = (token || '') + char
        } else {
          token = (token || '') + escaped + char
        }

        escaped = false
        continue
      }

      // This is a new escape sequence
      if (this.escapes.includes(char)) {
        if (in_quote && !this.escapedquotes.includes(in_quote)) {
          // This string type doesn't use escaped characters. Ignore for now.
        } else {
          escaped = char
          continue
        }
      }

      // We were in a string
      if (in_quote !== false) {
        // String is finished. Don't grab the quote character.
        if (char === in_quote) {
          in_quote = false
          continue
        }

        // String isn't finished yet, accumulate the character
        token = (token || '') + char
        continue
      }

      // This is the start of a new string, don't accumulate the quotation mark
      if (this.quotes.includes(char)) {
        in_quote = char
        token = (token || '') // fixes blank string
        continue
      }

      // This is whitespace, so yield the token if we have one
      if (this.whitespace.includes(char)) {
        if (token !== undefined) { yield token }
        token = undefined
        continue
      }

      // Otherwise, accumulate the character
      token = (token || '') + char
    }
  }
}


/**
 * Split the string `s` using shell-like syntax.
 */
exports.split = function (s) {
  var lex = new Shlexer(s)
  lex.whitespace_split = true
  return Array.from(lex)
}


/**
 * Return a shell-escaped version of the string `s`.
 */
exports.quote = function (s) {
  if (s === '') { return '\'\'' }

  var unsafe_re = /[^\w@%\-+=:,./]/
  if (!unsafe_re.test(s)) { return s }

  return '\'' + s.replace(/'/g, '\'"\'"\'') + '\''
}
