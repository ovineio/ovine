import nodesConfig from './nodes'

export const nodes = nodesConfig

export const domId = {
  editorPreview: 'preview-panel',
  editorSelector: 'components-selector',
  editorSelectorNav: 'components-selector-nav',
}

export const nodeIdKey = '$dataId'

export const message = {
  toggleSelector: 'craft:toggleSelectorMsg',
  updateSelected: 'craft:updateSelectedMsg',
  updateHover: 'craft:updateHoverMsg',
  onNodeAction: 'craft:onSelectionActionMsg',
}

export const nodeAction = {
  addChild: 'addChild',
  addLeftChild: 'addLeftChild',
  addTopChild: 'addTopChild',
  addRightChild: 'addRightChild',
  addBottomChild: 'addBottomChild',
  changePosition: 'changePosition',
  toPrev: 'toPrev',
  toNext: 'toNext',
  copy: 'copy',
  cut: 'cut',
  paste: 'paste',
  delete: 'delete',
}
