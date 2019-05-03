import { SimpleInterpolation } from 'styled-components'

type PxSize = number | string

const getPxSize = (size: PxSize) => (typeof size === 'string' ? size : `${size}px`)

export const inline = (): SimpleInterpolation => ({
  display: 'inline-block',
  verticalAlign: 'middle',
})

export const wh = (w: PxSize = 'auto', h: PxSize = 'auto'): SimpleInterpolation => ({
  width: getPxSize(w),
  height: getPxSize(h),
})
