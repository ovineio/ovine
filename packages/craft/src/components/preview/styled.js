import styled from 'styled-components'

export const StyledPreview = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
  /**
  * 某些元素影响预览，禁用事件
  */

  .preview-panel {
    padding: 10px;
    height: 100%;
    overflow: auto;

    input {
      pointer-events: none;
    }
  }
`
