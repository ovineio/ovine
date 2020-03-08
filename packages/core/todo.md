### TODO

- 用该项目测试 rt_cli
- dev、dll、build

  - 默认 不需要 构建 dll, 加快构建速度，设置 fallback 目录
  - dev 能跑通最简单 demo
  - build 能够构建成功

- 思考如何自定义使用 theme 更方便

- npm 包版本管理

  - 屏蔽 amis 包，因此他的版本不能随意更新
  - 暴露其他的包
    - lodash、react、react-dom、react-router、immer、fetch

- rt_core 项目我完全依赖 rt_cli 开发
  - 重构完成之后发布 npm
- rt_init 项目我完全依赖 rt_cli 开发
  - 建立三套模版
