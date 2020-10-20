import { toast, confirm } from 'amis'
import cls from 'classnames'
import copy from 'copy-to-clipboard'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'

import { app } from '@core/app'
import { saveToFile } from '@core/utils/file'

import { editorStore } from '@/stores/editor'
import { history } from '@/stores/history'
import { useRootStore } from '@/stores/root'

import { StyledHeader } from './styled'

export default observer(() => {
  const {
    isPreview,
    hasPrevStep,
    hasNextStep,
    option,
    isDirty,
    togglePreview,
    setLastSavedSchema,
  } = useRootStore()
  const { breadcrumb, onExit, onSave } = option

  const getBreadcrumbItems = () => {
    return typeof breadcrumb === 'string' ? [breadcrumb] : breadcrumb
  }

  const getSchemaString = (errTip: string) => {
    let value = ''
    try {
      value = JSON.stringify(editorStore.schema)
    } catch (__) {
      toast.error(errTip, 'JSON解析错误')
      return false
    }
    return value
  }

  const onExitEditor = () => {
    if (isPreview) {
      togglePreview()
      return
    }
    const exit = () => {
      if (onExit) {
        onExit()
      }
      history.reset()
      app.routerHistory.goBack()
    }

    if (isDirty) {
      confirm('当前存在未保存的改动，退出将视为放弃更改！', '确定退出编辑器？').then(
        (choose: boolean) => {
          if (choose) {
            exit()
          }
        }
      )
      return
    }

    exit()
  }

  const onCopyClick = () => {
    const value = getSchemaString('复制操作执行失败！')
    if (value) {
      copy(value)
      toast.success('复制成功')
    }
  }

  const onDownloadClick = () => {
    const value = getSchemaString('下载操作执行失败！')
    if (value) {
      saveToFile(value, 'text/plain', `${_.last(getBreadcrumbItems())}.json`)
      toast.success('文件下载成功')
    }
  }

  const onSaveClick = () => {
    const value = editorStore.schema
    if (onSave) {
      onSave(value)
    }
    setLastSavedSchema(value)
    toast.success('保存成功')
  }

  const renderBreadcrumb = () => {
    if (!breadcrumb) {
      return <span>未知页面</span>
    }

    return (
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb ">
          {getBreadcrumbItems().map((text, index) => {
            return (
              <li key={index} className="breadcrumb-item text-ellipsis">
                {text}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  return (
    <StyledHeader>
      <div className="toolbar-left">
        <i
          className="fa fa-chevron-left back-icon"
          data-tooltip="退出"
          data-position="bottom"
          onClick={onExitEditor}
        />
        {renderBreadcrumb()}
      </div>
      <div className="toolbar-main">
        <div className={cls('toolbar-item', { active: isPreview })} onClick={togglePreview}>
          <i className={`fa ${isPreview ? 'fa-eye-slash' : 'fa-eye'}`} />
          <span>预览</span>
        </div>

        <div
          className={cls('toolbar-item', { disabled: isPreview || !hasPrevStep })}
          onClick={() => history.goBack()}
        >
          <i className="fa fa-reply" />
          <span>撤销</span>
        </div>
        <div
          className={cls('toolbar-item', { disabled: isPreview || !hasNextStep })}
          onClick={() => history.goNext()}
        >
          <i className="fa fa-share" />
          <span>回退</span>
        </div>
        <div className={cls('toolbar-item')} onClick={onCopyClick}>
          <i className="fa fa-copy" />
          <span>复制</span>
        </div>
        <div className={cls('toolbar-item')} onClick={onDownloadClick}>
          <i className="fa fa-save" />
          <span>导出</span>
        </div>
        <div className={cls('toolbar-item')} onClick={onSaveClick}>
          <i className="fa fa-cloud-upload  " />
          <span>保存</span>
        </div>
      </div>
      <div className="toolbar-right" />
    </StyledHeader>
  )
})
