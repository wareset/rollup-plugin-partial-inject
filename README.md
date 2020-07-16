[npm]: https://img.shields.io/npm/v/rollup-plugin-partial-inject
[npm-url]: https://www.npmjs.com/package/rollup-plugin-partial-inject
[size]: https://packagephobia.now.sh/badge?p=rollup-plugin-partial-inject
[size-url]: https://packagephobia.now.sh/result?p=rollup-plugin-partial-inject

[![npm][npm]][npm-url]
[![size][size]][size-url]

# rollup-plugin-partial-inject

This plugin looks like a wrapper over a [@rollup/plugin-inject](https://github.com/rollup/plugins/tree/master/packages/inject). This allows you to split the package into parts and load them partially.

## Install

Using npm:

```console
npm install rollup-plugin-partial-inject --save-dev
```

or

```console
yarn add -D rollup-plugin-partial-inject
```

## Usage

```js
// src/custom_functions.js
export function foo() {
  console.log('foo');
}

export function bar() {
  console.log('bar');
}
```

```js
// src/main.js
console.log(CF.foo());
```

```js
// rollup.config.js
import partial from 'rollup-plugin-partial-inject';

export default {
  input: 'src/main.js',
  output: {
    dir: 'output',
    format: 'cjs',
  },
  plugins: [
    // ...
    partial({
      prefix: 'CF.', // custom prefix. '_.' - by default
      plugin: '', // - if package from node_modules
      path: './src/custom_functions.js', // - additional path
    }),
    // ...
  ],
};
```

### Result:

Only one function will be included in the final file.

```js
// public/bundle.js
(function () {
  'use strict';
  function foo() {
    console.log('foo');
  }
  console.log(foo());
})();
```

## Examples:

### Quickly add a [lodash-es](https://www.npmjs.com/package/lodash-es):

!The standard package lodash will not work!

```console
npm i lodash-es
```

```js
// rollup.config.js
import partial from 'rollup-plugin-partial-inject';

export default {
  // ...
  plugins: [
    // ...
    partial({ prefix: '_.', plugin: 'lodash-es' }),
    // ...
  ],
  // ...
};
```

### Quickly add a [underscore](https://www.npmjs.com/package/underscore):

```js
// rollup.config.js
// ...
partial({ prefix: '_.', plugin: 'underscore', path: 'modules' });
// ...
```

### Quickly add a [locutus](https://www.npmjs.com/package/locutus):

```js
// rollup.config.js
// ...
partial({ prefix: 'L.', plugin: 'locutus/php' });
// ...
```

### Quickly add a [rxjs](https://www.npmjs.com/package/rxjs):

```js
// rollup.config.js
// ...
partial({ prefix: 'RX.', plugin: 'rxjs' });
// ...
```

## Meta

[LICENSE (MIT)](/LICENSE)
