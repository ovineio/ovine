import Layout from 'amis/lib/components/Layout'
import styled, { css } from 'styled-components'

import { themes } from './common'

export const StyledLayout = styled(Layout)`
  ${(p) => css`
    &.${themes[p.theme].ns}Layout--folded .app-layout-brand {
      height: 3.125rem;
      display: table-cell;
    }
  `}

  .app-layout-brand {
    color: #fff;
    &:hover,
    &:active {
      color: #fff;
    }
  }

  .app-layout-body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .app-head-item {
    margin-top: 8px;
    margin-bottom: 8px;
  }
`
