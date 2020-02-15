import { css, DefaultTheme } from 'styled-components'

export const dashboardCss = ({ colors, ns }: DefaultTheme) => css`
  .${ns}DatePicker-toggler::before {
    line-height: 1.5;
  }

  .dash-grid {
    margin: 0 -8px;
    & > div {
      margin: 0 0 15px;
      padding: 0;
      & > div {
        margin: 0px 8px;
        padding-bottom: 10px;
        background-color: ${colors.layoutHeaderBg};
      }
    }
    .${ns}Spinner {
      background-repeat: no-repeat;
      width: 25px;
      height: 25px;
    }
  }

  .target-card {
    .card-info {
      position: relative;
      padding: 15px 15px 0;
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
      height: 80px;
    }
  }

  .tabs-card {
    margin-bottom: 15px;
    padding: 5px 15px 0px;
    background-color: ${colors.layoutHeaderBg};
  }

  .tab-filter {
    margin: 15px 0 30px;
  }

  .img-carousel {
    .image {
      background-size: cover !important;
      border-radius: 2px;
    }
  }
`
