import { app } from '@core/app'

import { appConstants } from './app/constants'
import { entry } from './app/entry'
import { env } from './app/env'
import { request } from './app/request'

app.create({
  env,
  request,
  constants: appConstants,
  entry,
})
