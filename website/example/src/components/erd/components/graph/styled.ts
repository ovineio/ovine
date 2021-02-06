import styled from 'styled-components'

export const GraphWrap = styled.div`
  width: 100%;
  flex: 1;

  &.read-only {
    cursor: grab;
  }

  .butterfly-react {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #f7f7fa;
  }

  .butterfly-react-container {
    position: absolute;
    height: 100%;
    width: 100%;
  }
`

const colors = {
  deep: '#5a67d8',
  active: '#ac8eec',
  light: '#f9fafc',
}

export const NodeWrap = styled.div`
  font-size: 14px;
  border: 3px solid transparent;
  border-radius: 8px 8px 6px 6px;

  &:hover {
    cursor: pointer;
  }

  &.active {
    border-color: ${colors.deep};
    .field-point {
      opacity: 1;
    }
  }

  & > div {
    border-radius: 4px;
    width: 220px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .header {
    width: 100%;
    padding: 5px;
    border-top: 8px solid rgb(52, 144, 220);
    border-bottom: 1px solid #edf2f7;
    border-radius: 4px 4px 0 0;
    font-weight: bold;
    font-size: 16px;
    color: #4b5668;
    background-color: ${colors.light};
    text-align: center;

    &:hover {
      background-color: #ebf4ff;
      color: #5b5b5b;
    }
  }

  .field-wrap {
    position: relative;
    color: #606f7b;
    background: white;
    &:last-child {
      border-radius: 0 0 4px 4px;
    }
    &.active {
      .field-content {
        background-color: rgb(193, 225, 254);
      }
    }
  }

  .field-point {
    position: absolute;
    opacity: 0;
    top: 8px;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: ${colors.deep};
    &:hover {
      background-color: rgb(230, 109, 28);
      transform: scale(1.4);
      cursor: crosshair !important;
    }

    &.point-l {
      left: -7px;
    }
    &.point-r {
      right: -7px;
    }
  }

  .field-content {
    display: flex;
    justify-content: space-between;
    padding: 2px 10px;
    &:hover {
      background-color: #f6f7fa;
      color: ${colors.active};
    }

    .type {
      color: #aaa;
    }
  }
`
