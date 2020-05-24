import { PagePreset } from '@core/routes/types'

const prest: PagePreset = {
  limits: {
    $page: {
      label: '访问Dashboard',
    },
  },
  apis: {
    chart: {
      url: 'GET ovapi/stat/data',
    },
  },
}

export default prest
