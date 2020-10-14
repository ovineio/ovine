import { useContext, createContext } from 'react'

import { ImmerSetter } from '@/utils/hooks'

export type AppContextState = {
  lang: string
  enableRouteTabs: boolean
  setContext: ImmerSetter<AppContextState>
}

export const AppContext = createContext<AppContextState>({
  lang: 'zh_CN',
  enableRouteTabs: true,
  setContext: () => {
    //
  },
})

export const useAppContext = () => useContext(AppContext)
