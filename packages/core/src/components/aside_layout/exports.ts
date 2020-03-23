import { message } from '@/constants'
import { store } from '@/utils/message'

export const toggleLayoutLoading = (toggle: boolean) => {
  store[message.layoutSpinner] = toggle
}

const pace = (window as any).Pace
export const togglePageLoadingBar = (toggle: boolean) => {
  if (toggle) {
    pace.restart()
  } else {
    pace.stop()
  }
}
