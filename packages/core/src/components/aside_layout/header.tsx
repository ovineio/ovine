import { get } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'

import { json2reactFactory } from '@/utils/tool'

import { Amis } from '../amis/schema'
import HeadItem from './head_item'
import ItemMsg from './item_msg'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import { LayoutCommProps, HeaderProps } from './types'

const j2r = json2reactFactory({
  'header-item': HeadItem,
  'item-msg': ItemMsg,
  'item-search': ItemSearch,
  'item-setting': ItemSetting,
  'amis-render': Amis,
})

type Props = LayoutCommProps &
  Partial<HeaderProps> & {
    themeNs: string
    themeName: string
  }
export default (props: Props) => {
  const { setLayout, asideFolded, themeNs, brand, items = [], showDevItem } = props

  const toggleScreen = () => {
    setLayout((d) => {
      d.offScreen = !d.offScreen
    })
  }

  const toggleAside = () => {
    setLayout((d) => {
      d.asideFolded = !d.asideFolded
    })
  }

  const renderItems = () => {
    const lefts: any[] = []
    const rights: any = []
    items.forEach((item, index) => {
      item.key = index
      if (get(item, 'align') === 'right') {
        rights.push(item)
      } else {
        lefts.push(item)
      }
    })

    return (
      <div className="collapse navbar-collapse">
        <div data-code={showDevItem || 'true'} className="navbar-nav mr-auto">
          <HeadItem
            faIcon={asideFolded ? 'indent' : 'dedent'}
            tip={`${asideFolded ? '展开' : '收起'}侧边栏`}
            onClick={toggleAside}
          />
          {lefts.map(j2r)}
        </div>
        {rights.map(j2r)}
      </div>
    )
  }

  const renderBrand = () => {
    const { logo, title, link, className: brandCls = '' } = brand as any

    const wrapperCls = `${themeNs}Layout-brand navbar-brand text-center ${brandCls}`
    const content = (
      <>
        <img className="inline brand-logo" src={logo} alt="logo" />
        <span className="hidden-folded m-l-sm inline">{title}</span>
      </>
    )

    if (!link) {
      return <div className={wrapperCls}>{content}</div>
    }

    return (
      <Link className={wrapperCls} to={link.href} title={link.title}>
        {content}
      </Link>
    )
  }

  return (
    <>
      <div className={`${themeNs}Layout-brandBar navbar-dark`}>
        <button
          className="navbar-toggler d-block d-sm-none float-right"
          type="button"
          onClick={toggleScreen}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {brand && renderBrand()}
      </div>
      <div className={`${themeNs}Layout-headerBar navbar navbar-expand-lg`}>{renderItems()}</div>
    </>
  )
}
