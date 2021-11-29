# load-config

> Powerful tool for loading configuration files

# Features

- Support for various types of profiles：`json, ts, js, yml`
- Typescript Typed APIs
- Support wireless hierarchy nested configuration, and support mixed configuration：`json, ts, js, yml`Cross inheritance of various documents

# Install

```shell
npm install @anijs/load-config
```

# Usage

```javascript
.
├── package.json
├── src
│   ├── index.js
└── rollup.config.ts

// rollup.config.ts
export default {
  extends: '@some/config', // Inherit the wrapped configuration
  ...configs
}
```

```javascript
import loadConfig from '@anijs/loadConfig'

loadConfig('rollup') // all result
```
