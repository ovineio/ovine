import React from 'react'

import Layout from './layout'

import { Provider } from './store'

const Erd = () => {
  return (
    <Provider>
      <Layout />
    </Provider>
  )
}

export default Erd
