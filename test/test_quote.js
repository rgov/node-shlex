var assert = require('assert');

var shlex = require('../shlex');


describe('shlex.quote()', function() {
  var safe_unquoted =  'abcdefghijklmnopqrstuvwxyz' +
                       'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
                       '0123456789' + 
                       '' //'@%_-+=:,./'
  var unicode_sample = '\xe9\xe0\xdf'  // e + acute accent, a + grave, sharp s
  var unsafe = '"`$\\!' + unicode_sample
  
  it('should escape the empty string', function () {
    assert.equal(shlex.quote(''), '\'\'')
  })
  
  it('should not escape safe strings', function () {
    assert.equal(shlex.quote(safe_unquoted), safe_unquoted)
  })
  
  it('should escape strings containing spaces', function () {
    assert.equal(shlex.quote('test file name'), '\'test file name\'')
  })
  
  it('should escape unsafe characters', function () {
    for (var i = 0; i < unsafe.length; i ++) {
      var input = 'test' + unsafe.charAt(i) + 'file'
      var expected = '\'' + input + '\''
      assert.equal(shlex.quote(input), expected)
    }
  })
  
  it('should escape single quotes', function () {
    assert.equal(shlex.quote('test\'file'), '\'test\'"\'"\'file\'')
  })
    //
  // it('should return -1 when the value is not present', function() {
  //
  //
  //
  //
  //   self.assertEqual(shlex.quote(''), "''")
  //   self.assertEqual(shlex.quote(safeunquoted), safeunquoted)
  //   self.assertEqual(shlex.quote('test file name'), "'test file name'")
  //   for u in unsafe:
  //     self.assertEqual(shlex.quote('test%sname' % u),
  //                        "'test%sname'" % u)
  //   for u in unsafe:
  //     self.assertEqual(shlex.quote("test%s'name'" % u),
  //                        "'test%s'\"'\"'name'\"'\"''" % u)
  //
  //   assert.equal([1,2,3].indexOf(4), -1);
  // });
})
