// webpack 入口文件
import '~/index'

// Hot Module Replacement API
const { hot } = module as any
if (hot) {
  hot.accept()
}
