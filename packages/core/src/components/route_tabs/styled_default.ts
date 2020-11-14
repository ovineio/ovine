import { css, keyframes } from 'styled-components'

// import TabsDark from './styled_dark'

const chromeTabWsJustAdded = keyframes`
  to {
    top: 0;
    opacity: 1;
  }
`

const chromeTabSpaceAbove = '8px'
const chromeTabSpaceBelow = '4px'
const tabContentMargin = '9px'
const activeTabBackgroundColor = '#f0f3f4'

export default css`
  .chrome-tabs {
    box-sizing: border-box;
    position: relative;
    font-size: 12px;
    height: 42px;
    padding: ${chromeTabSpaceAbove} 3px ${chromeTabSpaceBelow} 3px;
    background-color: #e6e7e8;
    /* overflow: hidden; */

    .chrome-tab {
      position: absolute;
      left: 0;
      height: 36px;
      width: 240px;
      border: 0;
      margin: 0;
      z-index: 1;
      pointer-events: none;
      * {
        user-select: none;
        cursor: default;
      }

      &:first-child .chrome-tab-dividers::before,
      &:last-child .chrome-tab-dividers::after {
        opacity: 0;
      }

      &[active] {
        z-index: 5;
        .chrome-tab-background > svg .chrome-tab-geometry {
          fill: ${activeTabBackgroundColor};
        }
      }
      &:not([active]) {
        .chrome-tab-background {
          transition: opacity 0.2s ease;
          opacity: 0;
        }

        @media (hover: hover) {
          &:hover {
            z-index: 2;
            .chrome-tab-background {
              opacity: 1;
            }
          }
        }
      }

      &.chrome-tab-was-just-added {
        top: 20px;
        opacity: 0;
        animation: ${chromeTabWsJustAdded} 120ms forwards ease-in;
      }

      &[is-mini] .chrome-tab-content {
        padding-left: 2px;
        padding-right: 2px;
      }

      &[is-small] .chrome-tab-favicon {
        margin-left: 0;
      }
      &[is-mini]:not([active]) .chrome-tab-favicon {
        margin-left: auto;
        margin-right: auto;
      }
      &[is-mini][active] .chrome-tab-favicon {
        display: none;
      }
      .chrome-tab-title {
        flex: 1;
        vertical-align: top;
        overflow: hidden;
        white-space: nowrap;
        margin-left: 4px;
        color: #5f6368;
        -webkit-mask-image: linear-gradient(
          90deg,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 1) calc(100% - 24px),
          transparent
        );
        mask-image: linear-gradient(
          90deg,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 1) calc(100% - 24px),
          transparent
        );
      }
      &[is-small] .chrome-tab-title {
        margin-left: 0;
      }
      .chrome-tab-favicon + .chrome-tab-title,
      &[is-small] .chrome-tab-favicon + .chrome-tab-title {
        margin-left: 8px;
      }
      &[is-smaller] .chrome-tab-favicon + .chrome-tab-title,
      &[is-mini] .chrome-tab-title {
        display: none;
      }
      &[active] .chrome-tab-title {
        color: #45474a;
      }

      @media (hover: hover) {
        &:not([active]) .chrome-tab-close:not(:hover):not(:active) {
          opacity: 0.8;
        }
      }

      &[is-smaller] .chrome-tab-close {
        margin-left: auto;
      }
      &[is-mini]:not([active]) .chrome-tab-close {
        display: none;
      }
      &[is-mini][active] .chrome-tab-close {
        margin-left: auto;
        margin-right: auto;
      }
    }
    &.chrome-tabs-is-sorting .chrome-tab:not(.chrome-tab-is-dragging),
    &:not(.chrome-tabs-is-sorting) .chrome-tab.chrome-tab-was-just-dragged {
      transition: transform 120ms ease-in-out;
    }
  }

  .chrome-tab-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
    pointer-events: none;
    > svg {
      width: 100%;
      height: 100%;
      .chrome-tab-geometry {
        fill: #f5f5f5;
      }
    }
  }
  .chrome-tab-content {
    position: absolute;
    display: flex;
    top: 0;
    bottom: 0;
    left: ${tabContentMargin};
    right: ${tabContentMargin};
    padding: 9px 8px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    /* overflow: hidden; */
    pointer-events: all;
  }
  .chrome-tab-favicon {
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;
    height: 16px;
    max-width: 16px;
    margin-left: 4px;
    background-size: 16px;
  }
  .chrome-tab-drag-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  .chrome-tab-close {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 8px 8px;

    svg {
      width: 12px;
      height: 12px;
      fill: #666;
    }

    @media (hover: hover) {
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        svg {
          fill: rgba(255, 255, 255, 0.8);
        }
        &:active {
          background-color: rgba(255, 255, 255, 0.4);
        }
      }
    }

    @media not all and (hover: hover) {
      &:active {
        background-color: #dadce0;
      }
    }
  }
  .chrome-tab-dividers {
    position: absolute;
    top: 7px;
    bottom: 7px;
    left: ${tabContentMargin};
    right: ${tabContentMargin};
    &,
    &::before,
    &::after {
      pointer-events: none;
    }
    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #b3b3b3;
      opacity: 1;
      transition: opacity 0.2s ease;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }
  }
  .chrome-tabs-bottom-bar {
    position: absolute;
    bottom: 0;
    height: ${chromeTabSpaceBelow};
    left: 0;
    width: 100%;
    background: ${activeTabBackgroundColor};
    z-index: 10;
  }
  .chrome-tabs-content {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .chrome-tabs-optional-shadow-below-bottom-bar {
    position: relative;
    height: 1px;
    width: 100%;
    background-image: url("data:image/svg+xmlutf8,<svgxmlns='http://www.w3.org/2000/svg'width='1'height='1'viewBox='0011'><rectx='0'y='0'width='1'height='1'fill='rgba(0,0,0,.17)'></rect></svg>");
    background-size: 1px 1px;
    background-repeat: repeat-x;
    background-position: 0% 0%;

    @media screen and (-webkit-min-device-pixel-ratio: 2),
      screen and (min--moz-device-pixel-ratio: 2),
      screen and (-o-min-device-pixel-ratio: 2 / 1),
      screen and (min-device-pixel-ratio: 2),
      screen and (min-resolution: 192dpi),
      screen and (min-resolution: 2dppx) {
      background-image: url("data:image/svg+xmlutf8,<svgxmlns='http://www.w3.org/2000/svg'width='2'height='2'viewBox='0022'><rectx='0'y='0'width='2'height='1'fill='rgba(0,0,0,.27)'></rect></svg>");
    }
  }
`
