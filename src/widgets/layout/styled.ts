import Layout from 'amis/lib/components/Layout'
import styled, { css } from 'styled-components'

import { themes } from './common'

export const StyledLayout = styled(Layout)`
  ${(p) => css`
    &.${themes[p.theme].ns}Layout--folded .${themes[p.theme].ns}Layout-brand {
      height: 3.125rem;
      display: table-cell;
    }
  `}
`
