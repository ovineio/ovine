/**
 * styled公用的一些 样式
 */
import { css } from 'styled-components'

export const inline = (vertical: string = 'middle') => css`
  display: inline-block;
  vertical-align: ${vertical};
`

export const ellipsis = (display?: string) => {
  return css`
    display: ${display || 'inline-block'};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `
}
