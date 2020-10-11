/**
 * 简单的列表 增删改 组件，用于 权限/请求 的编辑
 */

import { uuid } from 'amis/lib/utils/helper'
import { pick, cloneDeep } from 'lodash'
import React, { useEffect } from 'react'

import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'

import { StyledList } from './styled'

export default (props) => {
  const { list: propList = [], title = '', getControls, onListChange } = props

  const [state, setState] = useImmer({
    list: propList,
    isShowModal: false,
    editId: '',
  })

  const { isShowModal, editId, list } = state

  const ctrl = {
    toggleModal: (toggle) => {
      setState((d) => {
        const isShow = typeof toggle === 'boolean' ? toggle : !d.isShowModal
        d.isShowModal = isShow
        if (!isShow) {
          d.editId = ''
        }
      })
    },
    onEdit: (id) => {
      setState((d) => {
        d.isShowModal = true
        d.editId = id
      })
    },
    add: (item) => {
      item.id = uuid()
      setState((d) => {
        d.list.push(item)
      })
    },
    copy: (id) => {
      const itemIdx = list.findIndex((i) => i.id === id)
      const item = list[itemIdx]
      const newItem = cloneDeep(item)
      newItem.id = uuid()
      newItem.label = `${item.label}-复制`
      setState((d) => {
        d.list.splice(itemIdx + 1, 0, newItem)
      })
    },
    del: (id) => {
      setState((d) => {
        d.list.splice(
          list.findIndex((i) => i.id === id),
          1
        )
      })
    },
    edit: (item) => {
      setState((d) => {
        d.list.splice(
          list.findIndex((i) => i.id === item.id),
          1,
          item
        )
      })
    },
  }

  const controls = getControls({
    list,
    editId,
  })

  const schema = {
    type: 'dialog',
    show: isShowModal,
    onClose: ctrl.toggleModal,
    title: editId ? `编辑${title}` : `添加${title}`,
    body: {
      controls,
      type: 'form',
      data: list.find((i) => i.id === editId) || {},
      onSubmit: (values) => {
        const item = pick(
          values,
          controls.map((i) => i.name)
        )
        if (editId) {
          ctrl.edit(item)
        } else {
          ctrl.add(item)
        }
        ctrl.toggleModal()
      },
    },
  }

  const renderItem = (item) => {
    const { label, id } = item

    return (
      <div key={id} className="list-item">
        <p className="text-ellipsis" title={label}>
          {label}
        </p>
        <ul className="list-actions">
          <li onClick={() => ctrl.onEdit(id)} data-tooltip="编辑" data-position="bottom">
            <i className="fa fa-edit" />
          </li>
          <li onClick={() => ctrl.copy(id)} data-tooltip="复制" data-position="bottom">
            <i className="fa fa-copy" />
          </li>
          <li onClick={() => ctrl.del(id)} data-tooltip="删除" data-position="bottom">
            <i className="fa fa-trash-o" />
          </li>
        </ul>
      </div>
    )
  }

  useEffect(() => {
    if (onListChange) {
      onListChange(list)
    }
  }, [list])

  return (
    <StyledList>
      {!list.length && <div className="list-empty">{`暂无${title}`}</div>}
      {list.map(renderItem)}
      <div className="list-item list-add" onClick={ctrl.toggleModal}>
        <i className="fa fa-plus" />
        <span>{`添加${title}`}</span>
      </div>
      <Amis schema={schema} />
    </StyledList>
  )
}
