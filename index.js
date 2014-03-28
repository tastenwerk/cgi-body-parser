/** 
 * @Author: David Reinisch
 * @Company: TASTENWERK e.U.
 * @Copyright: 2014 by TASTENWERK
 * @License: Commercial
 *
 * @Date:   2014-03-28 13:39:44
 *
 * @Last Modified by:   David Reinisch
 * @Last Modified time: 2014-03-28 20:29:45
 *
 * This source code is not part of the public domain
 * If server side nodejs, it is intendet to be read by
 * authorized staff, collaborator or legal partner of
 * TASTENWERK only
 */

(function () {

  var bodyParser = {};
  var Type = {
    INTEGER: 'integer',
    FLOAT: 'float',
    STRING: 'string',
    ARRAY: 'array',
    BOOLEAN: 'boolean'
  }

  bodyParser.parseString = function parseString( string, options ){
    setOptions( options ); // BIG TODO
    return parse( string );
  };

  function setOptions( options ){
    if( options ){
      var keyBracketStart = options.keyBracketStart ? options.keyBracketStart : '[';
      var keyBracketEnd  = options.keyBracketEnd   ? options.keyBracketEnd   : ']';
      var valueDelimiter  = options.valueDelimiter  ? options.valueDelimiter  : '=';
      var delimiter       = options.delimiter       ? options.delimiter       : ',';
    }
  }

  function parse( string ){
    var params = getArray( string, '&');
    var root = {};

    params.forEach( function ( keyAndValue ){
      var splitted = keyAndValue.split('=');
      var key = unescape( splitted[0] );
      var value = unescape( splitted[1] );
      addKeyAndValue( root, key, value );
    });

    return root;
  }

  function addKeyAndValue( rootObject, key, value ){
    var keys = getKeys( key );
    var obj = rootObject;
    var isArray =  keys[ keys.length - 1 ].match(/\[\]/) ? true : false;

    if( isArray )
      addArrayValue( keys, obj, value );
    else  
      addValue( keys, obj, value );
    
  }

  function addArrayValue( keys, obj, value ){
      keys.pop();
      keys.forEach( function( keyName, index ){
      if( !obj[keyName] )
        obj[keyName] = {};
      if( index + 1 === keys.length ){
        if( !( obj[keyName] instanceof Array ) )
          obj[keyName] = [];
        obj = obj[keyName];
      }
      else 
        obj = obj[keyName];
        
      });
      obj.push(value);
  }

  function addValue( keys, obj, value ){
    keys.forEach( function( keyName, index ){
      if( !obj[keyName] )
        obj[keyName] = {};
      if( index + 1 === keys.length )
        obj[keyName] = parseValueToType( value );
      else 
        obj = obj[keyName];
    });
  }


  function parseKeys( value ){
    var keys = value.match(/\[[^\[\]]*\]/g);
    keys.forEach( function( key, index ){
      keys[index] = key.replace('[','').replace(']','');
    });

    return keys;
  }

  function getKeys( values ){
    var keys = [];
    var isArray =  values.match(/\[\]/) ? true : false;

    if( values.indexOf("[") > 0 ){
      var first = values.substring( 0, values.indexOf("[") );
      var last = values.substring( values.indexOf("["), values.length+1 );
      keys.push( first );
      keys = keys.concat( parseKeys( last ) );
    } else{
      keys.push( values );
    }

    if( isArray )
      keys[ keys.length - 1 ] = '[]';

    return keys;
  }

  function getArray( string, _delimiter ){
    return string.split( _delimiter );
  }

  function parseValueToType( value ){
    return value;
  }

  function parseToType( value, type ){
    switch( type ){

      case Type.INTEGER:
        return 0;

      case Type.FLOAT:
        return 0;
    }
  }

  function getTypeOf( value ){

  }

  module.exports = bodyParser;

}());