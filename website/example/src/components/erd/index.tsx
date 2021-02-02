import React from 'react'

import Layout from './components/layout'

import { Provider } from './sotre'

const Erd = () => {
  return (
    <Provider>
      <Layout />
    </Provider>
  )
}

export default Erd
