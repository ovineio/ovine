/**
 * 代码编辑器区域
 */

import { Editor } from 'amis/lib/components'
import React, { useState } from 'react'

import serialize from '@/assets/serialize'
import { useEditor } from '@/editor/context'

import { StyledCode } from './styled'

const editorOptions = {
  tabSize: 2,
}

const configMark = 'const config = '

export default () => {
  const { actions, schema } = useEditor((state: any) => ({
    schema: state.schema,
  }))

  const [code, setCode] = useState(
    () => `${configMark}${serialize(schema, { space: 2, unsafe: true })}`
  )

  const onEditorChange = (text: string) => {
    const value = text.slice(configMark.length)
    const res = eval('(' + value + ')') // eslint-disable-line

    actions.replaceSchema(res)

    setCode(text)
  }

  return (
    <StyledCode>
      <Editor
        editorTheme="vs"
        language="javascript"
        options={editorOptions}
        value={code}
        onChange={onEditorChange}
      />
    </StyledCode>
  )
}
