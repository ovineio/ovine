import { RendererProps } from 'amis/lib/factory'
import { SchemaNode } from 'amis/lib/types'
import { get, map } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'

// import { json2reactFactory } from '@/utils/tool'

import { Amis } from '../amis/schema'
import HeadItem from './head_item'
import ItemCode from './item_code'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import { LayoutCommProps, HeaderProps } from './types'

type Props = LayoutCommProps &
  Partial<HeaderProps> & {
    themeNs: string
  }
export default (props: Props) => {
  const { setLayout, asideFolded, themeNs, brand, items = [] } = props

  const toggleAside = () => {
    setLayout((d) => {
      d.asideFolded = !d.asideFolded
    })
  }

  const headItemsProps = {
    toggleAside,
    asideFolded,
    items,
  }

  const itemsSchema = {
    type: 'page',
    role: 'header',
    body: {
      type: 'wrapper',
      component: (renderProps: any) => <HeadItems {...renderProps} {...headItemsProps} />,
    },
  }

  const toggleScreen = () => {
    setLayout((d) => {
      d.offScreen = !d.offScreen
    })
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
      <div className={`${themeNs}Layout-headerBar navbar navbar-expand-lg`}>
        <Amis schema={itemsSchema} />
      </div>
    </>
  )
}

const presetComponents: any = {
  'head-item': HeadItem,
  'item-search-menu': ItemSearch,
  'item-setting': ItemSetting,
  'item-dev-code': ItemCode,
}
type HeadItemsProps = {
  toggleAside: () => void
  asideFolded: boolean
  items: SchemaNode[]
  render: any
}
function HeadItems(props: HeadItemsProps) {
  const { toggleAside, asideFolded, items, render } = props

  const lefts: SchemaNode[] = []
  const rights: SchemaNode[] = []
  items.forEach((item) => {
    if (get(item, 'align') === 'right') {
      rights.push(item)
    } else {
      lefts.push(item)
    }
  })

  const getPresetComponent = (item: SchemaNode) => {
    let preset = null
    map(presetComponents, (Component, type) => {
      if (item === type || get(item, 'type') === type) {
        preset = (renderProps: RendererProps) => <Component {...renderProps} itemProps={item} />
      }
    })
    return preset
  }

  const renderItem = (item: SchemaNode) => {
    const preset = getPresetComponent(item)
    if (!preset) {
      return render('body', item)
    }

    return render('body', {
      type: 'wrapper',
      component: preset,
    })
  }

  const asideItemProps = {
    faIcon: asideFolded ? 'indent' : 'dedent',
    tip: `${asideFolded ? '展开' : '收起'}侧边栏`,
    onClick: toggleAside,
  }

  return (
    <div className="collapse navbar-collapse">
      <div className="navbar-nav mr-auto">
        <HeadItem itemProps={asideItemProps} />
        {lefts.map(renderItem)}
      </div>
      {rights.map(renderItem)}
    </div>
  )
}
