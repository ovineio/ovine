import styled from 'styled-components'

import TabsDark from './styled_dark'
import TabsDefault from './styled_default'

export const StyledRouteTabs = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  height: 55px;
  z-index: 2;
  background-color: #f0f3f4;

  &.cxd-RouteTabs {
    background-color: #fff;
    .chrome-tabs {
      background: #eaeaea;
      .chrome-tab[active] {
        .chrome-tab-background > svg .chrome-tab-geometry {
          fill: #fff;
        }
      }
    }
    .chrome-tabs-bottom-bar {
      color: #fff;
    }
  }

  ${TabsDark};
  ${TabsDefault};
`
