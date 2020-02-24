import path from 'path'
import { Configuration } from 'webpack'
import merge from 'webpack-merge'

import { Props } from '../types'

import { createBaseConfig } from './base'
import LogPlugin from './plugins/log_plugin'

export function createClientConfig(props: Props): Configuration {
  const isProd = process.env.NODE_ENV === 'production'
  const config = createBaseConfig(props, false)

  const clientConfig = merge(config, {
    entry: [
      // Instead of the default WebpackDevServer client, we use a custom one
      // like CRA to bring better experience.
      !isProd && require.resolve('react-dev-utils/webpackHotDevClient'),
      path.resolve(__dirname, '../client/clientEntry.js'),
    ].filter(Boolean) as string[],
    optimization: {
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      runtimeChunk: true,
    },
    plugins: [
      // Show compilation progress bar and build time.
      new LogPlugin({
        name: 'Client',
      }),
    ],
  })

  return clientConfig
}
