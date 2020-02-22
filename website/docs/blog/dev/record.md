问题以及解决方案

- yarn 报错。 Browserslist: caniuse-lite is outdated. Please run next command `yarn upgrade`
  For what it's worth, it should be sufficient to search caniuse-lite@ in your yarn.lock, delete just those entries, and reinstall. That avoids the versions floating for all your other packages.

- 循环依赖问题
  - a -> b , b -> a 。这种情况，就将公共地方抽出一个 c, 变成 a -> c, b -> c 。或者使用消息机制，使用 on,emit 模式。
