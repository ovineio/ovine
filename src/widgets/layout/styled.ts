import styled from 'styled-components'

import { cls } from '@constants/layui'

export const StyledLayout = styled.div`
  .layui-body {
    top: 90px;
    bottom: 0;
    left: 220px;
    padding: 15px;
    background-color: #f2f2f2;
  }

  .layui-footer {
    left: 220px;
  }

  .${cls.app_tabs_items} {
    display: none;
  }
`
