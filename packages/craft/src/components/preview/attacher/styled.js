import styled from 'styled-components'

export const StyledAttacher = styled.div`
  .attach {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    pointer-events: none;
    user-select: none;
  }
  .hlbox {
    position: absolute;
    border: 1px solid #4285f4;
    background: rgba(66, 133, 244, 0.05);
  }
  .tip,
  .toolbar {
    position: absolute;
    height: 25px;
    padding: 0 5px;
    border: 1px solid #4285f4;
    border-bottom: 0;
    text-align: center;
    background: rgba(66, 133, 244, 0.05);
  }

  .hover {
    border-style: dashed;
    background: transparent;
    .tip {
      border-style: dashed;
      background: transparent;
    }
  }
  .tip {
    top: -25px;
    left: -1px;
    min-width: 50px;
  }
  .toolbar {
    position: absolute;
    white-space: nowrap;
    button {
      background: transparent;
      border: 0;
      color: #666;
    }
  }
`
