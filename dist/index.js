'use strict';

var _babel = require('babel');

module.exports = function (babel) {
  return new babel.Transformer('react-events-shorthand', {
    JSXAttribute: function JSXAttribute(node, parent, scope) {
      var attribute = node.name.name;

      return isNullEventAttribute(node, attribute) ? isValidClassComponent(this, attribute) && createJSXAttribute(attribute) : null;
    }
  });
};

function isNullEventAttribute(node, attribute) {
  var events = ['onCopy', 'onCut', 'onPaste', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel'];

  return !node.value && events.indexOf(attribute) !== -1;
}

function isValidClassComponent(node, attribute) {
  var classPath = node.findParent(function (n, path) {
    return path.isClass();
  });

  return classPath ? hasMatchingMethod(classPath, attribute) : false;
}

function hasMatchingMethod(classPath, attribute) {
  var bodyPaths = classPath.get('body').get('body');
  var match = bodyPaths.some(function (bodyPath) {
    return bodyPath.get('key').isIdentifier({ name: attribute });
  });
  var msg = 'You declared an event property on a JSX element but didn\'t write a handler in your Component class definition. Try writing an ' + attribute + ' method on the class definition';

  if (!match) throw new Error(msg);

  return true;
}

function createJSXAttribute(attribute) {
  return _babel.types.jSXAttribute(_babel.types.identifier(attribute), _babel.types.memberExpression(_babel.types.identifier('this'), _babel.types.identifier(attribute)));
}