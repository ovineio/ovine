import { toast, confirm } from 'amis'
import cls from 'classnames'
import copy from 'copy-to-clipboard'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import React, { useEffect, useRef } from 'react'

import { app } from '@core/app'
import { saveToFile } from '@core/utils/file'

import { editorStore } from '@/stores/editor'

import { StyledHeader } from './styled'

// TODO: 优化 getSchemaString

export default inject('store')(
  observer((props) => {
    const {
      isPreview,
      option,
      isDirty,
      isMobile,
      togglePreview,
      toggleViewMode,
      setLastSavedSchema,
      editorInstance,
    } = props.store

    const { breadcrumb, onExit, onSave, saveApi, saveInterval } = option
    const timerRef = useRef<number>(0)

    const hasPrevStep = editorInstance.canUndo()
    const hasNextStep = editorInstance.canRedo()

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
        let exitRes = true
        if (onExit) {
          exitRes = onExit()
        }
        if (exitRes !== false) {
          if (app.routerHistory.length) {
            app.routerHistory.goBack()
          } else {
            app.routerHistory.replace('/')
          }
        }
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

    const saveSchemaApi = (mounted: boolean = false) => {
      const value = editorStore.schema
      saveApi.data = {
        ...saveApi.data,
        schema: value,
      }
      return app
        .request(saveApi)
        .then((source) => {
          const { status, msg } = source.data
          if (!mounted) {
            if (status === 0) {
              toast.success(msg || '保存成功', '系统提示')
            } else {
              toast.error(msg || '保存失败', '系统提示')
            }
          }
          if (onSave) {
            onSave(value)
          }
          setLastSavedSchema(value)
          return source
        })
        .catch((source) => {
          toast.error(source?.msg || '保存失败', '系统提示')
        })
    }

    const onSaveClick = () => {
      const value = editorStore.schema
      if (saveApi) {
        saveSchemaApi()
        return
      }
      if (onSave) {
        onSave(value)
      }
      setLastSavedSchema(value)
      toast.success('当前编辑数据已经保存', '系统提示')
    }

    useEffect(() => {
      if (saveApi && saveInterval > 2 * 1000) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        timerRef.current = setInterval(() => {
          saveSchemaApi(true)
        }, saveInterval) as any
      }

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }, [])

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
            className={cls('toolbar-item view-mode', {
              active: !isPreview && isMobile,
            })}
            onClick={toggleViewMode}
          >
            <i className={`fa ${isMobile ? 'fa-mobile' : 'fa-desktop'}`} />
            <span>{isMobile ? '移动端' : 'PC端'}</span>
          </div>
          <div
            className={cls('toolbar-item', { disabled: isPreview || !hasPrevStep })}
            onClick={() => editorInstance.undo()}
          >
            <i className="fa fa-reply" />
            <span>撤销</span>
          </div>
          <div
            className={cls('toolbar-item', { disabled: isPreview || !hasNextStep })}
            onClick={() => editorInstance.redo()}
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
)
