/**
 * APP 搜索
 */

import React from 'react'

import HeadItem from './head_item'

type Props = {
  theme: string
}
export default (props: Props) => {
  const { theme } = props
  return <HeadItem theme={theme} faIcon="search" />
}
