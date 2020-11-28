/**
 * app.auto 自动集成应用入口
 */

import './includes'
import './auto'

if (process.env.HOT) {
  // Hot Module Replacement API
  const { hot } = module as any
  if (hot) {
    hot.accept((err: Error) => {
      // eslint-disable-next-line
      console.error('An error occurred when hot reload.', err)
    })
  }
}
