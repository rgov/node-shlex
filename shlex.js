'use strict'

/*
  Port of a subset of the features of CPython's shlex module, which provides a
  shell-like lexer. Original code by Eric S. Raymond and other contributors.
*/

class Shlexer {
  constructor (string) {
    this.i = 0
    this.string = string

    /**
     * Characters that will be considered whitespace and skipped. Whitespace
     * bounds tokens. By default, includes space, tab, linefeed and carriage
     * return.
    */
    this.whitespace = ' \t\r\n'

    /**
     * Characters that will be considered string quotes. The token accumulates
     * until the same quote is encountered again (thus, different quote types
     * protect each other as in the shell.) By default, includes ASCII single
     * and double quotes.
    */
    this.quotes = `'"`

    /**
     * Characters that will be considered as escape. Just `\` by default.
     */
    this.escapes = '\\'

    /**
     * The subset of quote types that allow escaped characters. Just `"` by default.
    */
    this.escapedQuotes = '"'

    this.debug = false
  }

  readChar () {
    return this.string.charAt(this.i++)
  }

  * [Symbol.iterator] () {
    let inQuote = false
    let escaped = false
    let token

    while (true) {
      const char = this.readChar()

      if (this.debug) {
        console.log(
          'input:', '>' + char + '<',
          'accumulated:', token,
          'inQuote:', inQuote,
          'escaped:', escaped
        )
      }

      // Ran out of characters, we're done
      if (char === '') {
        if (inQuote) { throw new Error('Got EOF while in a quoted string') }
        if (escaped) { throw new Error('Got EOF while in an escape sequence') }
        if (token !== undefined) { yield token }
        return
      }

      // We were in an escape sequence, complete it
      if (escaped) {
        if (char === '\n') {
          // An escaped newline just means to continue the command on the next
          // line. We just need to ignore it.
        } else if (!inQuote || char === inQuote || this.escapes.includes(char)) {
          token = (token || '') + char
        } else {
          // In a quote, we are only allowed to escape the quote character or
          // another escape character
          token = (token || '') + escaped + char
        }

        escaped = false
        continue
      }

      // This is a new escape sequence
      if (this.escapes.includes(char)) {
        if (inQuote && !this.escapedQuotes.includes(inQuote)) {
          // This string type doesn't use escaped characters. Ignore for now.
        } else {
          escaped = char
          continue
        }
      }

      // We were in a string
      if (inQuote !== false) {
        // String is finished. Don't grab the quote character.
        if (char === inQuote) {
          inQuote = false
          continue
        }

        // String isn't finished yet, accumulate the character
        token = (token || '') + char
        continue
      }

      // This is the start of a new string, don't accumulate the quotation mark
      if (this.quotes.includes(char)) {
        inQuote = char
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
 * Splits a given string using shell-like syntax.
 *
 * @param {String} s String to split.
 * @returns {String[]}
 */
exports.split = function (s) {
  return Array.from(new Shlexer(s))
}

/**
 * Escapes a potentially shell-unsafe string using quotes.
 *
 * @param {String} s String to quote
 * @returns {String}
 */
exports.quote = function (s) {
  if (s === '') { return '\'\'' }

  var unsafeRe = /[^\w@%\-+=:,./]/
  if (!unsafeRe.test(s)) { return s }

  return '\'' + s.replace(/'/g, '\'"\'"\'') + '\''
}
