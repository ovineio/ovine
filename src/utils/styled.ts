import { css } from 'styled-components'

export const inline = (vertical: string = 'middle') => css`
  display: inline-block;
  vertical-align: ${vertical};
`
