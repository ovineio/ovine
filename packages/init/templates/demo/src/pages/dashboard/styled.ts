import { css, DefaultTheme } from 'styled-components'

export default ({ colors, ns }: DefaultTheme) => css`
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
      padding: 0px 15px 0;
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
      top: 0;
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
  }

  /** 调整主题 */
  .${ns}DatePicker {
    &-toggler::before {
      line-height: 1.5;
    }
  }
  .${ns}Chart {
    min-width: 100px !important;
    min-height: 100px !important;
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
  .bar-table {
    border-color: ${colors.border};
    .${ns}Table-contentWrap {
      background-color: transparent;
    }
    .${ns}Table-content {
      height: 380px;
    }
    .${ns}Table-table {
      min-width: 300px;

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
