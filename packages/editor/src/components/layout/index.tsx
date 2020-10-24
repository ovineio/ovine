import { observer, inject } from 'mobx-react'
import React, { useEffect, useState } from 'react'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { changeAppTheme } from '@core/styled/theme'

import { editorStore } from '@/stores/editor'

import Editor from '../editor'
import Header from '../header'

import * as S from './styled'

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
      <S.StyledLayout>
        <Amis schema={placeholder} />
        <Header />
        <S.StyledBody>
          {isPreview && (
            <S.StyledPreview>
              <Amis schema={editorStore.schema as any} />
            </S.StyledPreview>
          )}
          {initEditor && <Editor editorStore={editorStore} />}
        </S.StyledBody>
      </S.StyledLayout>
    )
  })
)
