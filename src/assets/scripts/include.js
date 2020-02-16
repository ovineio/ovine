//  css库文件很少改动, 需要升级 直接 copy 源码 到 lib 目录,减少项目不必要的依赖
import '../lib/bootstrap.css' // https://github.com/twbs/bootstrap/blob/master/dist/css/bootstrap.css
import '../lib/animate.css' // https://github.com/daneden/animate.css/blob/master/animate.css
import '../lib/github.css' // https://github.com/highlightjs/highlight.js/tree/master/src/styles/github.css

// 扩展全局 css
import '../styles/global.css'

// 兼容代码
import './polyfill'