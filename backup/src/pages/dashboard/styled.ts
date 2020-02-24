import { css, DefaultTheme } from 'styled-components'

export const dashboardCss = ({ colors, ns }: DefaultTheme) => css`
  .dash-grid {
    margin: 0 -8px;
    & > div {
      margin: 0 0 15px;
      padding: 0;
      & > div {
        margin: 0px 8px;
        padding-bottom: 15px;
        background-color: ${colors.layoutHeaderBg};
      }
    }
    .${ns}Spinner {
      background-repeat: no-repeat;
      width: 25px;
      height: 25px;
      opacity: 0.5;
    }
  }

  .target-card {
    .card-info {
      position: relative;
      padding: 15px 15px 0;
      height: 75px;
      h6 {
        font-size: 14px;
        margin: 0;
      }
      p {
        font-size: 24px;
      }
    }
    .tip-icon {
      position: absolute;
      right: 15px;
      top: 15px;
      height: auto;
      padding: 0;
    }
    .card-chart {
      width: 100%;
      height: 100px;
    }
  }

  .tabs-card {
    margin-bottom: 15px;
    padding: 5px 15px 0px;
    background-color: ${colors.layoutHeaderBg};

    .tab-filter {
      margin: 15px 0 30px;
    }

    .img-carousel {
      .image {
        background-size: cover !important;
        border-radius: 2px;
      }
    }

    .rain-table {
      height: 300px;
      overflow: auto;
    }
  }

  /** 调整主题 */
  .${ns}DatePicker {
    &-toggler::before {
      line-height: 1.5;
    }
  }
  .${ns}Form {
    &-item button {
      background-color: transparent;
    }
    &-control {
      & > div {
        background-color: transparent;
      }
    }
  }
  .rain-table {
    border-color: ${colors.border};
    .${ns}Table-contentWrap {
      background-color: transparent;
    }
    .${ns}Table-table {
      height: 100%;
      min-width: 300px;
      thead,
      tbody {
        tr {
          table-layout: fixed;
          display: table;
          width: 100%;
          box-sizing: content-box;
        }
      }
      tbody {
        background-color: ${colors.layoutHeaderBg};
        display: block;
        overflow-y: scroll;
        height: 100%;
      }
      th {
        border-right: 0 !important;
      }
      tr {
        border-top: 0;
        background-color: transparent !important;
      }
    }
  }
`
