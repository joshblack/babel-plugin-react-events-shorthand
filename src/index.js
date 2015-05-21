import { types } from 'babel';

module.exports = function (babel) {
  return new babel.Transformer('react-events-shorthand', {
    JSXAttribute(node, parent, scope) {
      const attribute = node.name.name;

      return isNullEventAttribute(node, attribute)
        ? isValidClassComponent(this, attribute) && createJSXAttribute(attribute)
        : null;
    }
  });
};

function isNullEventAttribute(node, attribute) {
  const events = ['onCopy', 'onCut', 'onPaste', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel'];

  return !node.value && events.indexOf(attribute) !== -1;
}

function isValidClassComponent(node, attribute) {
  const classPath = node.findParent((n, path) => path.isClass());

  return classPath ? hasMatchingMethod(classPath, attribute) : false;
}

function hasMatchingMethod(classPath, attribute) {
  const bodyPaths = classPath.get('body').get('body');
  const match = bodyPaths.some((bodyPath) =>
    bodyPath.get('key').isIdentifier({ name: attribute }));
  const msg = `You declared an event property on a JSX element but didn't write a handler in your Component class definition. Try writing an ${attribute} method on the class definition`;

  if (!match) throw new Error(msg)

  return true;
}

function createJSXAttribute(attribute) {
  return types.jSXAttribute(
    types.identifier(attribute),
    types.memberExpression(
      types.identifier('this'),
      types.identifier(attribute)));
}