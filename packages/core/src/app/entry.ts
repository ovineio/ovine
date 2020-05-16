import './includes'
import './app'

// Hot Module Replacement API
const { hot } = module as any
if (hot) {
  hot.accept((err: Error) => {
    // eslint-disable-next-line
    console.error('An error occurred when hot reload.', err)
  })
}
