import { Provider } from 'mobx-react'
import React, { useEffect } from 'react'

import Layout from '@/components/layout'
import { rootStore } from '@/stores/root'

import { EditorProps } from './types'

export default (props: EditorProps) => {
  useEffect(() => {
    rootStore.setOption(props)
  }, [props])

  return (
    <Provider store={rootStore}>
      <Layout store={rootStore} />
    </Provider>
  )
}
