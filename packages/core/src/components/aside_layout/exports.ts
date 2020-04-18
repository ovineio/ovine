import { message } from '@/constants'
import { observeStore } from '@/utils/message'

export const toggleLayoutLoading = (toggle: boolean) => {
  observeStore[message.layoutSpinner] = toggle
}

const pace = (window as any).Pace
export const togglePageLoadingBar = (toggle: boolean) => {
  if (toggle) {
    pace.restart()
  } else {
    pace.stop()
  }
}
