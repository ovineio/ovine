import React from 'react'

import { usePresetContext } from '~/routes/route'
import logger from '~/utils/logger'

const log = logger.getLogger('dev:testLimit')
export default () => {
  const { checkLimit } = usePresetContext()

  log.log('test_limit==>', checkLimit('delItem'))

  return <div>123</div>
}
