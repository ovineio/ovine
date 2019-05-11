import React, { useEffect } from 'react'
import { filters, ids, classes } from '@constants/layui'
import { StyledRouteTabs } from './styled'

const changeTab = ({ element, $, $dom }: any) => {
  const pathname = $dom.attr('lay-id')
  if (!pathname) {
    return
  }
  const layId = `lay-id="${pathname}"`
  const $item = $(`#${ids.routes_nav_tabs_header} li[${layId}]`)
  const $tabsContent: any = $(`#${ids.app_body}`)
  const tabsContentSelector = `.${classes.app_tabs_items}[${layId}]`
  if ($item.length) {
    element.tabChange(filters.routes_nav_tabs.id, pathname)
    $tabsContent
      .find(tabsContentSelector)
      .addClass(classes.show)
      .siblings()
      .removeClass(classes.show)
    return
  }
  element.tabAdd(filters.routes_nav_tabs.id, {
    id: pathname,
    title: $dom.attr('data-title'),
  })
  element.tabChange(filters.routes_nav_tabs.id, pathname)
  $tabsContent.append(`<div class="${classes.app_tabs_items}" ${layId}></div>`)
}

export default (props: { link: any }) => {
  useEffect(() => {
    layui.use('element', () => {
      if (location.pathname !== '/') {
        const $activeItem: any = layui.$(`#${ids.app_side} .layui-this`)
        changeTab({ ...layui, $dom: $activeItem.find('a') })
      }
      layui.element.on(filters.app_side_nav.nav, ($dom: any) => {
        setTimeout(() => changeTab({ ...layui, $dom: layui.$($dom) }), 100)
      })
      layui.element.on(filters.routes_nav_tabs.tabs, ($dom: any) => {
        props.link(
          layui
            .$(`#${ids.routes_nav_tabs_header} li`)
            .eq($dom.index)
            .attr('lay-id')
        )
      })
    })
  }, [])

  return (
    <StyledRouteTabs id={ids.routes_nav_tabs}>
      <div className="layui-icon rtadmin-tabs-control layui-icon-prev" rtadmin-event="leftPage" />
      <div className="layui-icon rtadmin-tabs-control layui-icon-next" rtadmin-event="rightPage" />
      <div className="layui-tab" lay-allowclose="true" lay-filter={filters.routes_nav_tabs.id}>
        <ul className="layui-tab-title" id={ids.routes_nav_tabs_header}>
          <li className="layui-this" lay-id="/">
            <i className="layui-icon layui-icon-home" />
          </li>
        </ul>
      </div>
    </StyledRouteTabs>
  )
}
