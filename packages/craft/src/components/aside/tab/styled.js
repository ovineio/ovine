import styled, { css } from 'styled-components'

export const StyledRequests = styled.div``

export const StyledPage = styled.div`
  ${({ theme: { ns } }) => css`
    .${ns}Collapse {
      margin: 0;
      &-header {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
      &-arrow {
        float: left;
        margin-left: 0;
      }
  `}
`
