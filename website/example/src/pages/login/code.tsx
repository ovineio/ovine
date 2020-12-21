/**
 * 验证码
 */

import { uuid } from 'amis/lib/utils/helper'
import React, { useState, useEffect } from 'react'

import { subscribe } from '@core/utils/message'

import { msgKeys } from '~/app/constants'
import { request } from '~/app/request'

const { url: src } = request.getUrlByOption({
  url: 'ovapi/user/code',
})

export default () => {
  const [key, setKey] = useState('')

  const updateCode = () => {
    setKey(uuid())
  }

  useEffect(() => {
    subscribe(msgKeys.updateAuthLoginCode, updateCode)
  }, [])

  return <img className="code-img" alt="验证码" src={`${src}?${key}`} onClick={updateCode} />
}
