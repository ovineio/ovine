import { observer, inject } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { changeAppTheme } from '@core/styled/theme'

import { editorStore } from '@/stores/editor'

import Editor from '../editor'
import Header from '../header'

import { StyledBody, StyledLayout } from './styled'

// hack 方式给 Editor 注入 env
const placeholder = {
  type: 'html',
  className: 'd-none',
  html: 'placeholder',
}

let isLoaded = false

export default inject('store')(
  observer((props) => {
    const { isPreview } = props.store
    const [initEditor, setInitEditor] = useState(false)

    useEffect(() => {
      // 兼容非 "default" 主题，引起加载主题文件的异常
      if (!isLoaded && app.theme.getName() === 'cxd') {
        isLoaded = true
        changeAppTheme('cxd')
      }
      setInitEditor(true)
    }, [])

    return (
      <StyledLayout>
        <Amis schema={placeholder} />
        <Header />
        <StyledBody>
          {isPreview && <Amis schema={editorStore.schema as any} />}
          {initEditor && <Editor editorStore={editorStore} />}
        </StyledBody>
      </StyledLayout>
    )
  })
)
