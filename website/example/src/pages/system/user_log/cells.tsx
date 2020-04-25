import React from 'react'

import { strDelimiter } from '@core/constants'
import { getActionAddrMap } from '@core/routes/limit'

export const ActionAddrCell = (props) => {
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
