import React, { useEffect } from 'react'

import Layout from '@/components/layout'
import { RootProvider, rootStore } from '@/stores/root'

import { EditorProps } from './types'

export default (props: EditorProps) => {
  useEffect(() => {
    rootStore.setOption(props)
  }, [props])

  return (
    <RootProvider value={rootStore}>
      <Layout />
    </RootProvider>
  )
}
