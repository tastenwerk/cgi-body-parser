/** 
 * @Author: David Reinisch
 * @Company: TASTENWERK e.U.
 * @Copyright: 2014 by TASTENWERK
 * @License: Commercial
 *
 * @Date:   2014-03-28 13:39:44
 *
 * @Last Modified by:   David Reinisch
 * @Last Modified time: 2014-03-28 21:03:36
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
    BOOLEAN: 'boolean'
  };

  var keyValueDelimiter  = '=';
  var delimiter          = '&';

  bodyParser.parseString = function parseString( string, options ){
    setOptions( options ); 
    return parse( string );
  };

  function setOptions( options ){
    if( options ){
      if( options.keyValueDelimiter )
        keyValueDelimiter  = options.keyValueDelimiter;
      if( options.delimiter )
        delimiter = options.delimiter;
    }
  }

  function parse( string ){
    var params = getArray( string, delimiter );
    var root = {};

    params.forEach( function ( keyAndValue ){
      var splitted = keyAndValue.split( keyValueDelimiter );
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
      if( index + 1 === keys.length )
        if( !( obj[keyName] instanceof Array ) )
          obj[keyName] = [];
      obj = obj[keyName];
    });
    obj.push( parseValueToType( value) );
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
    switch( getTypeOf( value ) ){

      case Type.INTEGER:
        return parseInt( value );

      case Type.FLOAT:
        return parseFloat( value );

      case Type.BOOLEAN: 
        if( value.match(/^true$/) )
          return true;
        return false;

      case Type.STRING:
        return value;

      default: 
        return "ERROR OCCURED WHILE PARSING";
    }
  }

  function getTypeOf( value ){
    if( value.match(/(^true$|^false$)/) )
      return Type.BOOLEAN;
    if( !value.match(/(^\d*(,|.)\d+$|^\d+(,|.)\d+$|^\d+$)/) )
      return Type.STRING;
    value = value.replace(',', '.');
    if( parseFloat( value ) % 1 !== 0 )
      return Type.FLOAT;
    return Type.INTEGER;
  }

  module.exports = bodyParser;

}());