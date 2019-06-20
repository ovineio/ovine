const prefix = 'rtadmin-'

export const layId = 'lay-id'

export function getLayId(id: string, isCss: boolean = false) {
  const idStr = `lay-id="${id}"`
  return isCss ? `[${idStr}]` : idStr
}

export const filters = {
  routes_nav_tabs: {
    id: `${prefix}routes-nav`,
    tabs: `tab(${prefix}routes-nav)`,
  },
  app_side_nav: {
    id: `${prefix}app-side`,
    nav: `nav(${prefix}app-side)`,
  },
}

export const cls = {
  app_tabs_items: `${prefix}app-tabs-items`,
  show: 'layui-show',
  this: 'layui-this',
}

export const ids = {
  app_flexible: `${prefix}app-flexible`,
  app_body: `${prefix}app-body`,
  app_side: `${prefix}app-side`,
  routes_nav_tabs: `${prefix}routes-nav-tabs`,
  routes_nav_tabs_header: `${prefix}routes-nav-tabs-header`,
}
