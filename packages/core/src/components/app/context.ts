import { useContext, createContext } from 'react'

import { ImmerSetter } from '@/utils/hooks'

export type AppContextState = {
  locale: string
  enableRouteTabs: boolean
  setContext: ImmerSetter<AppContextState>
}

export const AppContext = createContext<AppContextState>({
  locale: 'zh-cn',
  enableRouteTabs: true,
  setContext: () => {
    //
  },
})

export const useAppContext = () => useContext(AppContext)
