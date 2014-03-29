/** 
 * @Author: David Reinisch
 * @Company: TASTENWERK e.U.
 * @License: MIT
 *
 * @Date:   2014-03-28 13:39:44
 *
 * @Last Modified by:   David Reinisch
 * @Last Modified time: 2014-03-28 22:11:52
 *
 */

(function () {

  /**
   *
   *  @class cgi-body-parser
   *
   *
   *
   */
  var bodyParser = {};
  var Type = {
    INTEGER: 'integer',
    FLOAT: 'float',
    STRING: 'string',
    BOOLEAN: 'boolean'
  };

  var keyValueDelimiter  = '=';
  var delimiter          = '&';

  /**
   *  Gets a string and the options for the parser
   *  @method parseString
   *  @param string { String } a string of a request form with utf8 encoding
   *  @return { Object } the parsed objectect in JSON format
   */
  bodyParser.parseString = function parse( string ){
    var params = string.split( delimiter );
    var root = {};

    params.forEach( function ( keyAndValue ){
      var splitted = keyAndValue.split( keyValueDelimiter );
      var key = unescape( splitted[0] );
      var value = unescape( splitted[1] );
      addKeyAndValue( root, key, value );
    });

    return root;
  };

  /**
   *  Adds a key - value pair to the current root objectect.
   *  The deepth is automaticly given through the keys, 
   *  also an array. 
   *  @method addKeyAndValue
   *  @param root { Object } the root objectect
   *  @param key { String } the key string
   *  @param value { String } the value string
   *  @example
   *      // this call with depth 1
   *      addKeyAndValue( {}, 'first', 'foo' )
   *      // will return:
   *      // { first: 'foo' }
   *
   *      // this call with depth 2
   *      addKeyAndValue( { first: { 0: 'foo' } }, 'first[bar]', 'foo' )
   *      // will return:
   *      // { first: { 0: 'foo', 1: 'bar' } }
   *
   *      // this call with an array
   *      addKeyAndValue( { first: [ 'foo' ] }, 'first[]', 'bar' )
   *      // will return:
   *      // { first: [ 'foo', 'bar' ] }
   */
  function addKeyAndValue( root, key, value ){
    var keys = getKeys( key );
    var object = root;
    var isArray =  keys[ keys.length - 1 ].match(/\[\]/) ? true : false;

    if( isArray )
      addArrayValue( keys, object, value );
    else  
      addValue( keys, object, value );
    
  }

  /**
   *  Adds a value to an array, if the array does not exist it is created
   *  @method addArrayValue
   *  @param keys { Array } The keys discribing the position of the value
   *  @param object { Object } The object holding the values
   *  @param value { String } The value that shall be added
   */
  function addArrayValue( keys, object, value ){
    keys.pop();
    keys.forEach( function( keyName, index ){
      if( !object[keyName] )
        object[keyName] = {};
      if( index + 1 === keys.length )
        if( !( object[keyName] instanceof Array ) )
          object[keyName] = [];
      object = object[keyName];
    });
    object.push( parseValueToType( value) );
  }

  /**
   *  Adds a value to an object
   *  @method addValue
   *  @param keys { Array } The keys discribing the position of the value
   *  @param object { Object } The object holding the values
   *  @param value { String } The value that shall be added
   */
  function addValue( keys, object, value ){
    keys.forEach( function( keyName, index ){
      if( !object[keyName] )
        object[keyName] = {};
      if( index + 1 === keys.length )
        object[keyName] = parseValueToType( value );
      else 
        object = object[keyName];
    });
  }

  /**
   *  Returns an array of key values, starting with the lowest depth.
   *  If the current key is an array key, the last array entry will be
   *  '[]' to identify the return as an array.
   *  @method getKeys
   *  @param values The key values that shall be parsed to an key array
   *  @return { Array } An array of key values
   *  @example
   *      // this call depth 1
   *      getKeys( 'first' )
   *      // will return
   *      // [ 'first' ]
   *
   *      // this call with depth 2
   *      getKeys( 'first[second]' )
   *      // will return
   *      // [ 'first', 'second' ]
   *
   *      // this call with an array
   *      getKeys( 'first[]' )
   *      // will return
   *      // [ 'first', '[]' ]
   *
   */
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

  /**
   *  Produces an array of strings without brackets
   *  @method parseKeys
   *  @param value The string with different keys in it
   *  @return { Array } The array of keys
   */
  function parseKeys( value ){
    var keys = value.match(/\[[^\[\]]*\]/g);
    keys.forEach( function( key, index ){
      keys[index] = key.replace('[','').replace(']','');
    });

    return keys;
  }

  /**
   *  Returns a value as the correct datatype for JSON
   *  @method parseValueToType
   *  @param value { String } The value that shall be parsed
   *  @return { Object } The parsed Value
   */
  function parseValueToType( value ){
    switch( getTypeOf( value ) ){

      case Type.INTEGER:
        return parseInt( value );

      case Type.FLOAT:
        value = value.replace(',', '.');
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

  /**
   *  Returns the datatype as string, defined in the variable Type
   *  @method getTypeOf
   *  @param value { String } The value that shall be checked
   *  @return { String } Value for type, defined in Type
   */
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