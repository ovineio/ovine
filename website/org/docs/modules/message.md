---
id: message
title: 消息模块
---

消息模块主要是用于解藕模块之间的依赖。可以用于多组件的通讯，也可用于数据模块的处理。

### publish 发布消息

主动发布消息，如果该消息被订阅，则会触发订阅消息时的回调操作。对于发布消息，携带的数据，没有任何消息。可以不传第二个参数。

```js
import { publish } from '@core/utils/message'

// 发布 一条消息 “hello”
publish('hello', {
  text: 'hello world',
})

// 发布 多条消息  “hello1”, “hello2”
publish(['hello1', 'hello2'], {
  text: 'hello world',
})
```

### subscribe 订阅消息

订阅消息就是为消息添加回调操作。允许重复订阅同一个消息。

```js
import { subscribe } from '@core/utils/message'

// 订阅  “hello” 消息
subscribe('hello', (data) => {
  console.log(data)
})

// 允许重复订阅同一条消息
subscribe('hello', (data) => {
  console.log('helloHandle2')
  console.log(data)
})

// 同时订阅多条消息  “hello1”, “hello2”,
subscribe(['hello1', 'hello2'], (data, key) => {
  console.log(key) // 消息 key, 可能是 hello1 或者 hello2
  console.log(data)
})
```

### unsubscribe 取消订阅

可用于组件销毁时，取消对某些数据的订阅操作。

```js
import { unsubscribe } from '@core/utils/message'

const { unsubscribe: selfUnsubscribe } = subscribe('hello', (data) => {
  console.log(data)
})

selfUnsubscribe() // 取消对 hello 消息的订阅

unsubscribe('hello') // 取消对所有 hello 消息的订阅，发送 hello 消息将不会有任何回调

const helloHandle = (data) => {
  console.log('helloHandle')
  console.log(data)
}

subscribe('hello', helloHandle)

subscribe('hello', () => {
  console.log('customHandle')
  console.log(data)
})

unsubscribe('hello', helloHandle) // 只会取消 hello 消息的 helloHandle 订阅
```

### subscribeOnce 仅订阅一次

只是处理一次消息，便不再监听该消息。可用于一次性数据的监听，防止重复处理。

```js
import { subscribe, subscribeOnce } from '@core/utils/message'

// 订阅一次消息
subscribeOnce('hello', (data) => {
  console.log(data) // 无论发多少次 hello 消息，只会执行一次回调
})

// subscribeOnce 就是以下代码的封装
const listener = subscribe('hello', (data) => {
  console.log(data)
  listener.unsubscribe() // 第一次执行结束便取消回调
})
```

### observeStore 数据改变

数据改变，便会自动发消息。可用于监听数据变化。

:::info 特别强调
`observeStore` 对象的 key 值必须是 `$store/` 前缀才会起效。
:::

```js
import { observeStore }, subscribe from '@core/utils/message'

for (var i=0; i < 3; i++) {
  observeStore['$store/hello'] = i
}


subscribe('$store/hello', (data) => {
  console.log(data) // 回调用 3次，data 分别为 0, 1, 2
})
```
