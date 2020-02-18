import { layoutLoading } from '~/constants/msg_key'
import { store } from '~/utils/message'

export const toggleLayoutLoading = (toggle: boolean) => {
  store[layoutLoading] = toggle
}

const pace = (window as any).Pace
export const togglePageLoadingBar = (toggle: boolean) => {
  if (toggle) {
    pace.restart()
  } else {
    pace.stop()
  }
}
