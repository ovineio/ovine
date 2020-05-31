---
id: logger
title: 日志模块
---

合理应用 Logger 模块，在某些容易出错的地放，打印日志，出现错误可以快速定位问题。

## 配置日志模块

日志的打印可以根据不同环境打印不同日志。防止过多日志，干扰错误定位。或者被不相关的人看到日志信息。

#### 入口文件中配置日志

```js title="/src/index.js Ovine入口文件"
// 在入口配置文件的 env 字段下配置
export default {
  env: {
    // 默认环境参数=变量
    default: {
      // highlight-start
      logger: {
        // 日志配置
        moduleName: 'app:*', // 只打印 app: 开头的日志
        level: 'error', // 只打印错日志
      },
      // highlight-end
    },
    // 开发环境环境
    localhost: {
      // highlight-start
      logger: {
        // 日志配置
        moduleName: '.*', // 打印任何配置
        level: 'log', // 打印 log 级别日志
      },
      // highlight-end
    },
    // 测试服环境
    stating: {
      // highlight-start
      logger: {
        // 日志配置
        moduleName: 'dev:*', // 只打印 dev: 开头的日志
        level: 'error', // 只打印错误级别日志
      },
      // highlight-end
    },
  },
}
```

#### url 参数配置日志

由于日志配置编译过后，除了重新编译才能应用不同的配置。对于某些线上错误，想定位问题，又不能看到日志，因此很麻烦。这时可以添加以下 url 查询参数，可以快速修改日志配置，在任何环境均可以查看日志。

- `loggerModule=".*"` 与 `logger.moduleName` 配置一致
- `level="log"` 与 `logger.level` 配置一致

## 打印日志

在任何模块都可以采用以下方式打印日志。日志在 release 线上环境默认不会被打印。

```js
import logger from '@/utils/logger'

// 一般采用冒号分割模块
const log = logger.getLogger('dev:amisSchema:utils')

// 和普通 console.log 参数一致，可以无限参数打印
log.log('普通日志')
log.info('一般日志信息')
log.warn('警告级别日志')
log.error('错误级别日志')

log.if(2 > 3).log('我是不会被打印的')
```
