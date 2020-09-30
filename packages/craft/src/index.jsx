import React, { useEffect } from 'react'

import Layout from '@/components/layout'
import { RootProvider, rootStore } from '@/stores'

export default () => {
  return (
    <RootProvider value={rootStore}>
      <Layout />
    </RootProvider>
  )
}
