/*
Port of a subset of the features of CPython's shlex module, which provides a
shell-like lexer. Original code by Eric S. Raymond and other contributors.
*/


exports.split = function(s) {
  
}


/**
 * Return a shell-escaped version of the string `s`.
 */
exports.quote = function(s) {
  if (s == '')
    return '\'\''
  
  var unsafe_re = /[^\w@%\-+=:,.\/]/
  if (!unsafe_re.test(s))
    return s
  
  return '\'' + s.replace(/'/g, '\'"\'"\'') + '\''
}
