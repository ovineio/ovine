import React from 'react'

import { strDelimiter } from '@rtadmin/core/lib/constants'
import { getActionAddrMap } from '@rtadmin/core/lib/routes/limit'

export default (props) => {
  const { actionAddr } = props.data
  const addrMap = getActionAddrMap()
  const [actionPath, actionItems] = (addrMap[actionAddr] || '').split(strDelimiter)

  return (
    <div>
      {!actionPath ? (
        '-'
      ) : (
        <>
          <span>{actionPath}</span>
          <span>{actionItems}</span>
        </>
      )}
    </div>
  )
}
