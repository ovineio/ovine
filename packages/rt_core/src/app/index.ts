import { AppInstance, AppConfig } from './types'
import get from 'lodash/get'

const source: any = {}

export const app = new Proxy<AppInstance>(
  {},
  {
    get(_, key: string) {
      return get(source, key)
    },
    set() {
      new Error(`can't change app object`)
    }
  }
)

export function create(config: AppConfig) {
  //
}

export function register(type: 'request', value: any): void
export function register(type: 'theme', value: any): void
export function register(type: 'user', value: any): void
export function register(type: string, value: any): void {
  //
}
