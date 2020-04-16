import { app } from '@rtadmin/core/lib/app'

import { entry } from './app/entry'
import { env } from './app/env'
import { request } from './app/request'

app.create({
  env,
  entry,
  request,
})
