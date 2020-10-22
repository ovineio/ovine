/**
 * 自定义页面
 * ----
 * 体验在线编辑页面
 */

import { toast } from 'amis'
import React, { useEffect } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import { app } from '@core/app'
import { Amis } from '@core/components/amis/schema'
import { useImmer } from '@core/utils/hooks'
import { getStore } from '@core/utils/store'
import { deserialize } from '@core/utils/tool'

import { storeKeys } from '~/app/constants'

const StyledIcon = styled.i`
  position: relative;
  padding: 0 5px 5px;
  z-index: 10;
  cursor: pointer !important;
`

const defaultSchema = {
  type: 'page',
  title: '点击 "路由标签" 上的编辑图标，可体验在线编辑页面效果～',
  body: {
    type: 'alert',
    body: '只有保存后才能看到页面效果。目前只能体验，等完成所有功能后，将可用于生产环境。',
    level: 'success',
  },
}

type State = {
  schema: any
}

const initState = () => {
  return {
    schema: deserialize(getStore<string>(storeKeys.testEditorSchema)) || defaultSchema,
  }
}

export default () => {
  const [state] = useImmer<State>(initState)
  const { schema } = state

  const getThisTab = () => document.querySelector('.chrome-tab[active] .chrome-tab-favicon')

  const goEditorPage = () => {
    if (app.theme.getName() === 'dark') {
      toast.info('编辑器对 “暗黑主题” 暂不支持，请切换为其他主题再尝试编辑！')
      return
    }
    app.routerHistory.push('/editor')
  }

  useEffect(() => {
    /** 只用于演示 */
    let $tab
    setTimeout(() => {
      $tab = getThisTab()
      $tab.removeAttribute('hidden')
      render(
        <StyledIcon
          className="fa fa-pencil"
          onClick={goEditorPage}
          data-tooltip="点击编辑页面"
          data-position="bottom"
        />,
        $tab
      )
    }, 100)

    return () => {
      $tab = $tab || getThisTab()
      $tab.setAttribute('hidden', '')
    }
  }, [])

  return <div>{schema && <Amis schema={schema} />}</div>
}
