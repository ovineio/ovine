import styled from 'styled-components'

export const StyledLayout = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding-top: 60px;
  background: #f1f2f6;
`

export const StyledContent = styled.div`
  display: flex;
  align-items: flex-start; /** 子项保持自身高度 */
  height: 100%;
`
