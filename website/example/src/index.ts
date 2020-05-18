import { amis } from './app/amis'
import { appConstants } from './app/constants'
import { entry } from './app/entry'
import { env } from './app/env'
import { request } from './app/request'

const config = {
  env,
  request,
  constants: appConstants,
  entry,
  amis,
}

export default config
