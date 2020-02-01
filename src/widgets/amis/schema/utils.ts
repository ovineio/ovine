import request from '~/core/request'
import logger from '~/utils/logger'

const log = logger.getLogger('dev:amisSchema:utils')

export const envFetcher = (option: any) => {
  log.log('fetcher', option)
  const { url, data, ...rest } = option
  return request({
    url,
    data,
    ...rest,
  })
}
