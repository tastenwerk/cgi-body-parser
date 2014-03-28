/** 
 * @Author: David Reinisch
 * @Company: TASTENWERK e.U.
 * @Copyright: 2014 by TASTENWERK
 * @License: Commercial
 *
 * @Date:   2014-03-28 13:41:44
 *
 * @Last Modified by:   David Reinisch
 * @Last Modified time: 2014-03-28 18:53:52
 *
 * This source code is not part of the public domain
 * If server side nodejs, it is intendet to be read by
 * authorized staff, collaborator or legal partner of
 * TASTENWERK only
 */

describe( '> CGI-BODY-PARSER  TEST <', function(){
  var parser = require('../index.js');

  it('parses strings', function(){
    console.log('here', parser.parseString('d=test&y%5Bh%5D%5Bl%5D=sd%5D&y%5Bh%5D%5Bk%5D=123&y%5Bf%5D=%26quotjjj', {}));
    
  });

  it('parses arrays', function(){
    console.log('here', parser.parseString('d%5B%5D=1&d%5B%5D=2&d%5B%5D=3', {}));
    
  });

});