import cls from 'classnames'
import { observer } from 'mobx-react'
import React, { useState } from 'react'

import { previewStore } from '@/components/preview/store'

import { useAsideStore } from '../store'

import { StyledNav } from './styled'

export default observer(() => {
  const { navs } = useAsideStore()

  const [activeId, setActiveId] = useState('')

  const onNavClick = (id) => {
    previewStore.setEditId(id)
    setActiveId(id)
  }

  return (
    <StyledNav>
      <ul>
        {navs.map((nav) => {
          const { id, label } = nav

          return (
            <li
              key={id}
              className={cls({ active: activeId === id })}
              onClick={() => onNavClick(id)}
            >
              {label}
            </li>
          )
        })}
      </ul>
    </StyledNav>
  )
})
