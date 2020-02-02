import request from '~/core/request'
import logger from '~/utils/logger'

const log = logger.getLogger('dev:amisSchema:utils')

export const amisResAdapter = (res: any) => {
  return {
    data: {
      status: 0,
      msg: '',
      ...res,
    },
  }
}

export const envFetcher = (option: any) => {
  log.log('amis:fetcher', option)
  return request(option).then(amisResAdapter)
}
