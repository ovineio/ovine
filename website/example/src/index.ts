import { app } from '@core/app'

import { entry } from './app/entry'
import { env } from './app/env'
import { request } from './app/request'

app.create({
  env,
  request,
  constants: {
    loginRoute: '/login',
  },
  entry,
})
