import Overlay from 'amis/lib/components/Overlay'
import APopOver from 'amis/lib/components/PopOver'
import React, { useRef, useState } from 'react'

import { app } from '@core/app'

type Props = {
  children: any
  Popup: any
  className?: string
  placement?: string
}
const PopOver = (props: Props) => {
  const { children, className, placement, Popup } = props

  const $wrapRef = useRef()
  const [isOpen, setOpen] = useState(false)

  const toggleOpen = (toggle: any) => {
    setOpen(typeof toggle === 'boolean' ? toggle : !isOpen)
  }

  return (
    <>
      <div className={className} ref={$wrapRef} onClick={toggleOpen}>
        {children}
      </div>
      {!isOpen ? null : (
        <Overlay
          placement={placement || 'auto'}
          target={$wrapRef.current}
          onHide={toggleOpen}
          container={() => document.getElementById('modal-root')}
          rootClose={false}
          show
        >
          <APopOver classPrefix={app.theme.getTheme().ns} onHide={toggleOpen} overlay>
            <Popup close={toggleOpen} />
          </APopOver>
        </Overlay>
      )}
    </>
  )
}

export default PopOver
