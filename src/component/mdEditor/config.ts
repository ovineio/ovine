export default  {
  autofocus: false,
  language: 'zh',
  initialEditType: 'markdown',
  previewStyle: 'vertical',
  usageStatistics: false,
  height: 600,
  exts: [
    'scrollSync', 'colorSyntax', 'uml', 'mark', 'table', 'flow', {
      name: 'chart',
      minWidth: 100,
      maxWidth: 600,
      minHeight: 100,
      maxHeight: 300
    }
  ],
  toolbarItems: [
    'heading', 'bold', 'italic', 'strike', 'divider', 'hr',
    'quote', 'divider', 'ul', 'ol', 'task', 'indent', 'outdent', 'divider',
    'table', 'image', 'link', {
      type: 'button',
      options: {
        className: 'tui-full-screen-icon',
        name: 'full',
        tooltip: '全屏',
        event: 'full'
      }
    }, {
      type: 'button',
      options: {
        className: 'tui-chmode-icon',
        name: 'chmode',
        tooltip: '切换模式',
        event: 'chmode'
      }
    }
  ],
};
