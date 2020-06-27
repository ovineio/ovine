---
id: storage
title: 存储模块
---

存储模块简单封装了 `window.localStorage`,`window.sessionStorage`，未对 `cookie` 存储封装，如有需要请自行实现。

> **建议:** 在使用 `store` 模块时，将所有的 `key` 值，存放在某个专用于常量的文件里，比如 `src/constants.js` 中。并尽可能避免出`key` 值拼接。

### `setStore` 缓存数据

封装 `localStorage.setItem`

```js
import { setStore } from '@core/utils/store'

setStore('authData', {
  token: 'userToken',
})
```

### `getStore` 获取缓存数据

封装 `localStorage.getItem`

```js
import { getStore } from '@core/utils/store'

getStore('authData') // { token: 'userToken' }
```

### `clearStore` 清除缓存数据

封装 `localStorage.removeItem`

```js
import { clearStore } from '@core/utils/store'

clearStore('authData') // 清楚缓存
```

### `setSessionStore` 浏览器 session 缓存数据

封装 `sessionStorage.setItem`

```js
import { setSessionStore } from '@core/utils/store'

setSessionStore('authData', {
  token: 'userToken',
})
```

### `getSessionStore` 获取浏览器 session 缓存数据

封装 `sessionStorage.getItem`

```js
import { getSessionStore } from '@core/utils/store'

getSessionStore('authData') // { token: 'userToken' }
```

### `setGlobal` 运行时全局数据

主要是用于多个模块全局共享数据的情况。每次重新进入页面，数据都将会清空，没有缓存的功能，只能用于全局共享数据的情况。

```js
import { setGlobal } from '@core/utils/store'

setGlobal('authData', {
  token: 'userToken',
})
```

### `getGlobal` 获取运行时全局数据

使用该方法，一定要确认与 `setGlobal` 的调用顺序。一定要先存再取，才有数据。否则始终没有数据。

```js
import { getGlobal } from '@core/utils/store'

getGlobal('authData') // { token: 'userToken' }
```
