/**
 * 选中元素的操作
 */

import { openContextMenus, toast } from 'amis'
import { camelCase, isArray, last } from 'lodash'

import { publish } from '@core/utils/message'

import { toggleSelector } from '@/components/selector'
import { nodeAction, message, nodeIdKey } from '@/constants'

import { previewStore } from '../store'
import { setSchemaNodeId } from '../utils'

const onNodeAction = (option) => {
  const { activeKey, actionType, schemaToAdd, isSaveStore = true, pasteType = 'next' } = option
  const { selectedCursor: cursor, setClipboard } = previewStore

  const removeNode = () => {
    if (cursor.isRoot()) {
      toast.warning('根节点不能删除', '系统提示')
      return
    }
    cursor.unset()
    // 如果 是数组 且没有内容时 继续删除
    if (cursor.up().get().length === 0) {
      cursor.up().unset()
    }
  }

  switch (actionType) {
    case nodeAction.addChild: // 添加组件
      cursor.set(activeKey, schemaToAdd)
      break
    case nodeAction.addLeftChild: // 数组最左边添加
    case nodeAction.addTopChild:
      cursor.select(activeKey).unshift(schemaToAdd)
      break
    case nodeAction.addRightChild: // 数组最右边添加
    case nodeAction.addBottomChild:
      cursor.select(activeKey).push(schemaToAdd)
      break
    case nodeAction.changePosition: // 换位置
      break
    case nodeAction.toPrev: // 左移动
    case nodeAction.toNext:
      {
        // 右移动
        // const current = cursor.get()
        const parent = cursor.up()
        if (!isArray(parent.get())) {
          return
        }
        const index = last(cursor.path)

        if (
          (nodeAction.toPrev === actionType && index === 0) ||
          (nodeAction.toNext === actionType && index === parent.get().length - 1)
        ) {
          return
        }
        const oprIndex = nodeAction.toPrev === actionType ? index - 1 : index + 1
        const opr = parent.select(oprIndex).get()

        parent.splice([oprIndex, 1])
        parent.splice([index, 0, opr])
      }
      break
    case nodeAction.copy: // 复制
      setClipboard()
      break
    case nodeAction.cut: // 前切
      setClipboard()
      removeNode()
      break
    case nodeAction.paste: // 粘贴
      {
        const current = cursor.get()
        const parent = cursor.up()
        const { clipboardSchema } = previewStore
        let index = 0
        if (!isArray(parent.get())) {
          // 不是数组先转换为数组
          parent.set([current])
        } else {
          index = last(cursor.path)
        }

        if (pasteType === 'next') {
          parent.splice([index + 1, 0, clipboardSchema])
        } else if (index === 0) {
          parent.unshift(clipboardSchema)
        } else {
          parent.splice([index, 0, clipboardSchema])
        }
      }
      break
    case nodeAction.delete: // 删除
      removeNode()
      break
    default:
  }

  if (isSaveStore) {
    previewStore.saveBaobabSchema(cursor)
  }

  // 发布 修改 消息
  publish(message.onNodeAction, option)
}

/**
 * 添加组件时的 菜单
 */
export const onAddNode = (option) => {
  const { position, node, container } = option

  const onAdd = () => {
    if (!node.template) {
      toast.warning('该组件暂未支持。。。')
      return
    }

    const { key, type } = container
    const template = setSchemaNodeId(node.template, { isClone: true })
    const isAdd = type === 'add'

    onNodeAction({
      activeKey: key,
      actionType: isAdd ? nodeAction.addChild : camelCase(`add-${type}-child`),
      schemaToAdd: isAdd ? [template] : template,
    })
    toggleSelector()

    setTimeout(() => {
      previewStore.setHoverId(template[nodeIdKey])
    }, 500)
  }

  openContextMenus(position, [
    {
      label: '添加该组件',
      icon: 'fa fa-check',
      onSelect: onAdd,
    },
    {
      label: '关闭',
      icon: 'fa fa-close',
    },
  ])
}

/**
 *  右键点击选中节点菜单
 */
export const onNodeMenus = (option) => {
  const { position } = option

  openContextMenus(position, [
    {
      label: '取消选择',
      icon: 'fa fa-close',
      onSelect: () => {
        previewStore.setSelectedId('')
      },
    },
    {
      label: '前移',
      icon: 'fa fa-close',
      onSelect: () => {
        onNodeAction({
          actionType: nodeAction.toPrev,
        })
      },
    },
    {
      label: '后移',
      icon: 'fa fa-close',
      onSelect: () => {
        onNodeAction({
          actionType: nodeAction.toNext,
        })
      },
    },
    {
      label: '复制',
      icon: 'fa fa-close',
      onSelect: () => {
        onNodeAction({
          actionType: nodeAction.copy,
          isSaveStore: false,
        })
      },
    },
    {
      label: '剪切',
      icon: 'fa fa-close',
      onSelect: () => {
        onNodeAction({
          actionType: nodeAction.cut,
        })
        previewStore.setSelectedId('')
      },
    },
    {
      label: '粘贴',
      icon: 'fa fa-close',
      children: [
        {
          label: '前方粘贴',
          icon: 'fa fa-close',
          onSelect: () => {
            onNodeAction({
              actionType: nodeAction.paste,
              pasteType: 'font',
            })
          },
        },
        {
          label: '后方粘贴',
          icon: 'fa fa-close',
          onSelect: () => {
            onNodeAction({
              actionType: nodeAction.paste,
              pasteType: 'next',
            })
          },
        },
      ],
    },
    {
      label: '删除',
      icon: 'fa fa-check',
      onSelect: () => {
        onNodeAction({
          actionType: nodeAction.delete,
        })
        previewStore.setSelectedId('')
      },
    },
  ])
}
