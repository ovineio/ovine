import { pick } from 'lodash'
import { observer, inject } from 'mobx-react'
import React from 'react'

// import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
// import { changeAppTheme } from '@core/styled/theme'

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

export default inject('store')(
  observer((props) => {
    const { isPreview, option } = props.store
    const previewProps = pick(option, ['data'])

    return (
      <S.StyledLayout>
        <Amis schema={placeholder} props={previewProps} />
        <Header />
        <S.StyledBody>
          {isPreview && (
            <S.StyledPreview>
              <Amis schema={editorStore.schema as any} />
            </S.StyledPreview>
          )}
          <Editor editorStore={editorStore} />
        </S.StyledBody>
      </S.StyledLayout>
    )
  })
)
