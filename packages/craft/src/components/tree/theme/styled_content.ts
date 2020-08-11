import styled from 'styled-components'

/* Highlight line for pointing to dragged node destination
   ========================================================================== */
const highlightColor = '#36c2f6'
const highlightLineSize = 2 // Make it an even number for clean rendering
const arrowSize = 4

export const StyledContent = styled.div`
  .node {
    display: flex;
    position: relative;
    height: 100%;
    white-space: nowrap;

    & > * {
      box-sizing: border-box;
    }
  }

  .node-wrapper {
    height: 100%;
    box-sizing: border-box;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }

    &:active {
      opacity: 1;
    }
  }

  .node-wrapper-drag-disabled {
    cursor: default;
  }

  .node-contents-drag-disabled {
    cursor: default;
  }

  /**
 * The outline of where the element will go if dropped, displayed while dragging
 */
  .node-landing-pad {
    border: none;
    box-shadow: none;
    outline: none;

    * {
      opacity: 0 !important;
    }

    &::before {
      background-color: lightblue;
      border: 2px dotted black;
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: -1;
    }
  }

  /**
 * Alternate appearance of the landing pad when the dragged location is invalid
 */
  .node-cancel-pad {
    @extend .rowLandingPad;

    &::before {
      background-color: #e6a8ad;
    }
  }

  /**
 * Nodes matching the search conditions are highlighted
 */
  .node-search-match {
    border-bottom: 2px dashed #0080ff;
  }

  /**
 * The node that matches the search conditions and is currently focused
 */
  .node-search-focus {
    border-bottom: 2px dashed #fc6421;
  }

  .node-contents {
    position: relative;
    height: 100%;
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    display: inline-block;
    vertical-align: middle;
  }

  .node-label {
    flex: 0 1 auto;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }
  .node-title {
  }
  .node-toolbar {
    flex: 0 1 auto;
    display: flex;
    display: inline-block;
    vertical-align: middle;
  }

  .toolbar-button {
    display: inline-block;
    vertical-align: middle;
  }

  .icon-toggle {
    position: absolute;
    z-index: 2;
    width: 15px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
  }

  /**
 * Line for under a node with children
 */
  .line-children {
    height: 100%;
    display: inline-block;
  }

  /* ==========================================================================
   Scaffold
    Line-overlaid blocks used for showing the tree structure
   ========================================================================== */
  .line-block {
    height: 100%;
    position: relative;
    display: inline-block;
    flex: 0 0 auto;
  }

  .absolute-line-block {
    position: absolute;
    top: 0;
  }

  /**
 * +--+--+
 * |  |  |
 * |  |  |
 * |  |  |
 * +--+--+
 */
  .highlight-line-vertical {
    z-index: 3;

    &::before {
      content: '';
      position: absolute;
      width: ${highlightLineSize}px;
      margin-left: ${highlightLineSize / -2}px;
      left: 50%;
      top: 0;
      height: 100%;
      background-color: ${highlightColor};
    }
  }

  /**
 * +-----+
 * |     |
 * |  +--+
 * |  |  |
 * +--+--+
 */
  .highlight-top-left-corner {
    &::before {
      z-index: 3;
      content: '';
      position: absolute;
      border-top: solid ${highlightLineSize}px ${highlightColor};
      border-left: solid ${highlightLineSize}px ${highlightColor};
      box-sizing: border-box;
      top: 50%;
      margin-top: ${highlightLineSize / -2}px;
      right: 0;
      width: calc(50% + (${highlightLineSize / 2}px));
      height: calc(50% + (${highlightLineSize / 2}px));
    }
  }

  /**
 * +--+--+
 * |  |  |
 * |  |  |
 * |  +->|
 * +-----+
 */
  .highlight-bottom-left-corner {
    z-index: 3;

    &::before {
      content: '';
      position: absolute;
      box-sizing: border-box;
      top: 0;
      right: ${arrowSize}px;
      width: calc(50% - 3px);
      height: calc(100% + (${highlightLineSize / 2}px));
      border-bottom: ${highlightLineSize}px solid ${highlightColor};
      border-left: ${highlightLineSize}px solid ${highlightColor};
    }

    &::after {
      content: '';
      position: absolute;
      height: 0;
      right: 0;
      top: 100%;
      margin-top: ${-1 * arrowSize}px;
      border-top: ${arrowSize}px solid transparent;
      border-bottom: ${arrowSize}px solid transparent;
      border-left: ${arrowSize}px solid ${highlightColor};
    }
  }
`
