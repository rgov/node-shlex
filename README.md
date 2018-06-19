# node-shlex

`node-shlex` is a Node.js module for quoting and parsing shell commands.

The API was inspired by the [`shlex`][pyshlex] module from the Python Standard 
Library. However, the Python implementation is fairly complex, and supports a
confusing matrix of modes that is not replicated here. `node-shlex` always
operates in what the Python module calls "POSIX mode."

An existing module, [`node-shell-quote`][shell-quote], has numerous quality
issues and seems to be abandoned. However, note that `node-shlex` does not
attempt to split on or otherwise parse operators (such as `2>/dev/null`), and it
does not perform variable interpolation.

[pyshlex]: https://docs.python.org/3/library/shlex.html
[shell-quote]: https://github.com/substack/node-shell-quote

## Usage

### `shlex.quote()`

```node
var quote = require("shlex").quote
quote("abc")      // returns: abc
quote("abc def")  // returns: 'abc def'
quote("can't")    // returns: 'can'"'"'t'
```

### `shlex.split()`

```node
var split = require("shlex").split
split('ls -al /')  // returns: [ 'ls', '-al', '/' ]
split('rm -f "/Volumes/Macintosh HD"')  // returns [ 'rm', '-f', '/Volumes/Macintosh HD' ]
```
