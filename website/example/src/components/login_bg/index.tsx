import { times } from 'lodash'
import React from 'react'

import { StyledLoginBg } from './styled'

export default () => {
  return (
    <StyledLoginBg>
      <ul className="bg-anime">
        {times(15, (i) => {
          return <li key={i} />
        })}
      </ul>
    </StyledLoginBg>
  )
}
