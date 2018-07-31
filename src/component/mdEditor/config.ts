export default  {
  autofocus: false,
  language: 'zh',
  initialEditType: 'markdown',
  previewStyle: 'vertical',
  usageStatistics: false,
  hideModeSwitch: true,
  exts: [{
      name: 'chart',
      minWidth: 100,
      maxWidth: 600,
      minHeight: 100,
      maxHeight: 300
    },
    'scrollSync',
    'colorSyntax',
    'uml',
    'mark',
    'table'
  ],
  toolbarItems: [
    'heading',
    'bold',
    'italic',
    'strike',
    'divider',
    'hr',
    'quote',
    'divider',
    'ul',
    'ol',
    'task',
    'indent',
    'outdent',
    'divider',
    'table',
    'image',
    'link', {
      type: 'button',
      options: {
        className: 'tui-full-screen-icon',
        name: 'full',
        tooltip: '全屏',
        event: 'full'
      }
    },
  ],
};
