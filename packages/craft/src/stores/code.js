/**
 * 代码文本编辑
 */

import { types } from 'mobx-state-tree'

const Layout = types.model('Layout', {
  ren: types.maybeNull(types.number),
})
