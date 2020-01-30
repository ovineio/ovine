import { Spinner } from 'amis'
import React, { useState } from 'react'
import styled from 'styled-components'

import { PageProps } from '~/routes/route'

export default (props: PageProps) => {
  const { path = 'docs/getting-started' } = props
  const [visible, toggleVisible] = useState(true)

  const onLoad = () => {
    toggleVisible(false)
  }

  return (
    <StyledIframe>
      <Spinner overlay key={path} show={visible} size="lg" />
      <iframe frameBorder={0} src={`https://baidu.github.io/amis/${path}`} onLoad={onLoad} />
    </StyledIframe>
  )
}

const StyledIframe = styled.div`
  position: relative;
  width: 100%;
  height: ${window.innerHeight - 50}px;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
  }
`
