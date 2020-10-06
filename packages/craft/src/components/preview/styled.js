import styled from 'styled-components'

export const StyledPreview = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  margin: 20px;
  background: #fefefe;
  /**
  * 某些元素影响预览，禁用事件
  */

  .preview-panel {
    height: 100%;
    overflow: auto;

    input {
      pointer-events: none;
    }
  }
`
