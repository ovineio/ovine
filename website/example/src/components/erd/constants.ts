export const erdBfEvents = {
  endpointDrag: 'endpoint:drag',
  canvasClick: 'system.canvas.click',
  linkConnect: 'system.link.connect',
  linkDel: 'system.link.delete',
  linkClick: 'system.link.click',
  dragStart: 'system.drag.start',
  dragEnd: 'system.drag.end',
}

export const erdEvents = {
  endpointDrag: 'erd:endpoint:drag',
  updateEpCls: 'erd:endpoint:updateCls',
}

export const erdStoreKey = {
  epDragSource: 'epDragSourceStore',
  modelTemplate: 'modelTemplateStore',
}

export const erdStyled = {
  hdHeight: 40,
  hdBgColor: '#f8f9fb',
  divideBorder: '1px solid rgba(0, 0, 0, 0.08)',
}

export const erdOther = {
  epLinkKey: '~ep~',
  epRelation: [
    {
      label: '1对1',
      key: 'oneToOne',
    },
    {
      label: '1对多',
      key: 'oneToMany',
    },
    {
      label: '多对1',
      key: 'manyToOne',
    },
  ],
}
