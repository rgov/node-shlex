import * as shlex from '../shlex.js'

shlex.quote('test text')
shlex.split('test text "multi word thing"')

// Should error
shlex.join()
shlex.quote()
shlex.split()
