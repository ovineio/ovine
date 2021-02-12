import styled, { css } from 'styled-components'

import { erdStyled } from '../../constants'

export const SettingsWrap = styled.div`
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100%;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
`

export const Header = styled.div`
  position: relative;
  z-index: 4;
  flex: 0 0 ${erdStyled.hdHeight}px;
  height: ${erdStyled.hdHeight}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 15px;
  border-bottom: ${erdStyled.divideBorder};
  background-color: ${erdStyled.hdBgColor};
  font-size: 16px;

  .hd-label {
    .anticon {
      margin-right: 4px;
    }
  }
`

export const Body = styled.div`
  flex: 1 1 auto;
  overflow: hidden;

  &.disabled {
    .os-host {
      cursor: not-allowed;
    }
    ${(p) => css`
      .${p.theme.ns}Page {
        pointer-events: none;
      }
    `}
  }

  .schema-body {
    padding: 15px;
  }
`

export const Footer = styled.div``
