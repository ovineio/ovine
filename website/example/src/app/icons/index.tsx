/**
 * 注册 SVG 图标
 * 可以从iconfont下载SVG图标 https://www.iconfont.cn/
 */

import { registerIcon } from 'amis'

import EmptyIcon from './empty.svg'
import EditIcon from './edit.svg'

registerIcon('empty', EmptyIcon)
registerIcon('edit', EditIcon)
