const prefix = 'rtadmin_'

export const filters = {
  routes_nav_tabs: {
    id: `${prefix}routes_nav`,
    tabs: `tab(${prefix}routes_nav)`,
  },
  app_side_nav: {
    id: `${prefix}app_side`,
    nav: `nav(${prefix}app_side)`,
  },
}

export const classes = {
  app_tabs_items: `${prefix}app_tabs_items`,
  show: 'layui-show',
}

export const ids = {
  app_flexible: `${prefix}app_flexible`,
  app_body: `${prefix}app_body`,
  app_side: `${prefix}app_side`,
  routes_nav_tabs: `${prefix}routes_nav_tabs`,
  routes_nav_tabs_header: `${prefix}routes_nav_tabs_header`,
}
