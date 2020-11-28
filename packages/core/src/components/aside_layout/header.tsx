import { RendererProps } from 'amis/lib/factory'
import { SchemaNode } from 'amis/lib/types'
import { get, map } from 'lodash'
import React, { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

import { message } from '@/constants'
import { publish } from '@/utils/message'

import { Amis } from '../amis/schema'

import HeadItem from './head_item'
import ItemCode from './item_code'
import ItemSearch from './item_search'
import ItemSetting from './item_setting'
import { LayoutCommProps, HeaderProps } from './types'

type Props = LayoutCommProps &
  Partial<HeaderProps> & {
    children: any
    themeNs: string
    withRouteTabs: boolean
  }
export default (props: Props) => {
  const { asideFolded, withRouteTabs, themeNs, children, brand, items = [] } = props

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

  // 由于布局 z-index 冲突，导致菜单在收缩状态下，会被侧边栏图标遮挡
  const renderBrandHolder = () => {
    return createPortal(
      <div className="navbar-brand-holder">
        <img src={brand?.logo} alt="logo" />
      </div>,
      $('#app-layout>div').get(0)
    )
  }

  const renderFoldItem = () => {
    const asideItemProps = {
      faIcon: asideFolded ? 'indent' : 'dedent',
      tip: `${asideFolded ? '展开' : '收起'}侧边栏`,
      onClick: () =>
        publish(message.asideLayoutCtrl.msg, {
          key: message.asideLayoutCtrl.toggleFold,
        }),
    }
    return <HeadItem itemProps={asideItemProps} />
  }

  const headerItems = useMemo(() => {
    const itemsSchema = {
      type: 'page',
      role: 'header',
      body: {
        type: 'wrapper',
        component: (renderProps: any) => (
          <HeadItems renderFoldItem={renderFoldItem} items={items} {...renderProps} />
        ),
      },
    }

    return (
      <>
        <Amis schema={itemsSchema} />
      </>
    )
  }, [items, themeNs])

  return (
    <>
      <div className={`${themeNs}Layout-brandBar navbar-dark`}>
        <button
          className="navbar-toggler d-block d-sm-none float-right"
          type="button"
          onClick={() =>
            publish(message.asideLayoutCtrl.msg, {
              key: message.asideLayoutCtrl.toggleScreen,
            })
          }
        >
          <span className="navbar-toggler-icon" />
        </button>
        {withRouteTabs && brand && asideFolded && renderBrandHolder()}
        {brand && renderBrand()}
      </div>
      <div className={`${themeNs}Layout-headerBar navbar navbar-expand-md`}>
        {headerItems}
        {children}
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

type ItemProps = {
  render: any
  item: SchemaNode
}
const ItemComponent = (props: ItemProps) => {
  const { render, item } = props

  const getPresetComponent = (i: SchemaNode) => {
    let preset = null
    map(presetComponents, (Component, type) => {
      if (i === type || get(i, 'type') === type) {
        preset = (renderProps: RendererProps) => <Component {...renderProps} itemProps={item} />
      }
    })
    return preset
  }

  const preset = getPresetComponent(item)

  if (!preset) {
    return render('body', item)
  }

  return render('body', {
    type: 'wrapper',
    component: preset,
  })
}

function HeadItems(props: { items: SchemaNode[]; render: any; renderFoldItem: any }) {
  const { items: propItems, render, renderFoldItem } = props

  const items = useMemo(() => {
    const lefts: SchemaNode[] = []
    const rights: SchemaNode[] = []
    propItems.forEach((item) => {
      if (get(item, 'align') === 'right') {
        rights.push(item)
      } else {
        lefts.push(item)
      }
    })
    return {
      lefts: lefts.map((item, index) => <ItemComponent key={index} render={render} item={item} />),
      rights: rights.map((item, index) => (
        <ItemComponent key={index} render={render} item={item} />
      )),
    }
  }, [propItems])

  return (
    <div className="collapse navbar-collapse">
      <div className="navbar-nav mr-auto">
        <div className="head-item-fold d-flex">{renderFoldItem()}</div>
        {items.lefts}
      </div>
      {items.rights}
    </div>
  )
}
