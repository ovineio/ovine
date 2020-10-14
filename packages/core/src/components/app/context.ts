import { useContext, createContext } from 'react'

import { storage } from '@/constants'
import { ImmerSetter } from '@/utils/hooks'
import { getStore } from '@/utils/store'

export type AppContextState = {
  lang: string
  enableRouteTabs: boolean
  setContext: ImmerSetter<AppContextState>
}

export const initAppContext = {
  lang: getStore<string>(storage.appLang) || 'zh_CN',
  enableRouteTabs: !!getStore<string>(storage.enableRouteTabs),
}

export const AppContext = createContext<AppContextState>({
  ...initAppContext,
  setContext: () => {
    //
  },
})

export const useAppContext = () => useContext(AppContext)
