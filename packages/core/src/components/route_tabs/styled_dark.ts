import { css } from 'styled-components'

const dividersBackgroundColor = '#4a4d51'
const activeTabBackgroundColor = '#323639'

export default css`
  &.dark-RouteTabs {
    background-color: #333538;

    .chrome-tabs {
      background: #202124;
      .chrome-tab[active] {
        .chrome-tab-background > svg .chrome-tab-geometry {
          fill: ${activeTabBackgroundColor};
        }
        .chrome-tab-title {
          color: #f1f3f4;
        }
      }

      .chrome-tab-dividers {
        &::before,
        &::after {
          background: ${dividersBackgroundColor};
        }
      }

      .chrome-tab-background > svg .chrome-tab-geometry {
        fill: #292b2e;
      }

      .chrome-tab-title {
        color: #9ca1a7;
      }

      .chrome-tab-close {
        &:hover {
          background-color: #5f6368;
        }

        &:active {
          background-color: #80868b;
        }
      }
    }

    .chrome-tabs-bottom-bar {
      background: ${activeTabBackgroundColor};
    }
  }
`
