# React Events Shorthand

Basic babel plugin inspired by new ES6 shorthand features that allows developers to write event handlers in JSX elements without having to explicitly write `onEvent={this.onEvent}`. Instead, developers can do the following:

```js
class App extends React.Component {
    onClick () { /* ... */ }
    render () {
        return <div onClick />
    }
}
```

And this will be transformed into:

```js
class App extends React.Component {
    onClick () { /* ... */ }
    render () {
        return <div onClick={this.onClick} />
    }
}
```

The plugin will also check to make sure that if you use this shorthand then a method exists on the class definition that matches the JSX attribute. For example:

```js
class App extends React.Component {
    render () {
        return <div onClick />
    }
}
```

Will throw an error telling you that you forgot to write a `onClick` method on the Component class.