# About

This package provides a Vue 3 hook for interacting with the Local Storage API and bind the local storage to component state.

## Installation

Install the package with npm:

```bash
npm install vue-use-local-storage-hook
```

Or with yarn:

```bash
yarn add vue-use-local-storage-hook
```

## Usage

Here is a simple example of how to use the hook:

```js
import { useLocalStorage } from "vue-use-local-storage-hook";

const data = useLocalStorage("my-key", "default value");

// Get the stored value
console.log(data.value); // 'default value'

// Set a new value
data.value = "new value";
console.log(data.value); // 'new value'
console.log(localStorage.getItem("my-key")); // 'new value'
```

In this example, useLocalStorage is used to store and retrieve a value from local storage. The stored value is reactive and can be used in your Vue components. When the value is updated, the component will be re-rendered and the new value will be stored in local storage.

## API

```js
useLocalStorage(key: string, defaultValue: string | null);
```

## Testing

```bash
npm run test
```

## License

This package is licensed under the MIT license. See the LICENSE file for more details.
