import styled, { css } from 'styled-components'

const transPos = (p) => {
  const { t, r, b, l } = p.pos || {}
  return {
    top: t,
    right: r,
    bottom: b,
    left: l,
  }
}

export const StyledContainer = styled.div`
  padding: 10px;
  .container-content {
    margin: 10px 0 0;
    border: 1px solid #dedede;
  }
`

export const StyledCorner = styled.div`
  ${transPos};
  position: absolute;
  padding: 2px 4px;
  font-size: 12px;
  background-color: blue;
  color: #fff;
`

const baseVerHor = css`
  ${transPos};
  position: absolute;
  font-size: 20px;

  &.v-center {
    top: 50%;
    transform: translateY(-50%);
  }

  &.h-center {
    left: 50%;
    transform: translateX(-50%);
  }

  &.center {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
    cursor: pointer;
  }
`

export const StyledVertical = styled.div`
  ${baseVerHor};
  li {
    display: block;
  }
`

export const StyledHorizontal = styled.div`
  ${baseVerHor};
  li {
    display: inline-block;
  }
`
