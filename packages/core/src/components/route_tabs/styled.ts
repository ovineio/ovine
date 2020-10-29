import styled from 'styled-components'

import TabsDark from './styled_dark'
import TabsDefault from './styled_default'

/**
 * TODO: 将主题相关的东西，要么写到scss中，要么定义到styled中
 * 由于主题变量太多，没有全都注入到styled中，因此先偷懒，分别对每个主题单独写
 */

export const StyledRouteTabs = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  height: 50px;
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
