/**
 * 浏览器兼容文件
 */

import 'core-js/es/object'
import 'core-js/es/array'

import 'core-js/es/symbol'
import 'core-js/es/set'
import 'core-js/es/map'

import 'promise/polyfill'

import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this
    if (!document.documentElement.contains(el)) {
      return null
    }

    do {
      if (el.matches(s)) {
        return el
      }
      el = el.parentElement
    } while (el !== null)

    return null
  }
}

