/**
 * Amis路由
 */

import { mapTree } from 'amis/lib/utils/helper'

import { RouteItem } from '../types'

const amisRoute: RouteItem = {
  label: 'Amis 示例',
  nodePath: '/',
  children: [
    {
      label: '页面',
      icon: 'glyphicon glyphicon-th',
      badge: 3,
      badgeClassName: 'bg-info',
      nodePath: 'pages',
      children: [
        {
          label: '简单页面',
          nodePath: 'simple',
        },
        {
          label: '初始化出错',
          nodePath: 'error',
        },
        {
          label: '表单页面',
          nodePath: 'form',
        },
      ],
    },

    {
      label: '表单',
      icon: 'fa fa-list-alt',
      nodePath: 'form',
      children: [
        {
          label: '表单展示模式',
          nodePath: 'mode',
        },

        {
          label: '所有类型汇总',
          nodePath: 'full',
        },

        {
          label: '静态展示',
          nodePath: 'static',
        },

        {
          label: '输入提示',
          nodePath: 'hint',
        },

        {
          label: 'FieldSet',
          nodePath: 'fieldset',
        },

        {
          label: 'Tabs',
          nodePath: 'tabs',
        },

        {
          label: 'FieldSet Tabs 组合',
          nodePath: 'fields-tabs',
        },

        {
          label: '动态数据',
          nodePath: 'remote',
        },

        {
          label: '显隐状态联动',
          nodePath: 'reaction',
        },

        {
          label: '表单验证',
          nodePath: 'validation',
        },

        {
          label: '组合类型',
          nodePath: 'combo',
        },

        {
          label: '多功能选择器',
          nodePath: 'picker',
        },

        {
          label: '子表单',
          nodePath: 'sub-form',
        },

        {
          label: 'JSon Schema表单',
          nodePath: 'json-schema',
        },

        {
          label: '富文本',
          nodePath: 'rich-text',
        },

        {
          label: '代码编辑器',
          nodePath: 'ide',
        },

        {
          label: '自定义组件',
          nodePath: 'custom',
        },

        {
          label: '表格编辑',
          nodePath: 'table',
        },

        {
          label: '公式示例',
          nodePath: 'formula',
        },

        {
          label: '引用',
          nodePath: 'definitions',
        },

        // {
        //     label: '布局测试',
        //     nodePath: 'layout-test',
        //
        // },

        // {
        //     label: '测试',
        //     nodePath: 'test',
        //
        // },
      ],
    },

    {
      label: '增删改查',
      icon: 'fa fa-table',
      nodePath: 'crud',
      children: [
        {
          label: '表格模式',
          nodePath: 'table',
        },
        {
          label: '卡片模式',
          nodePath: 'grid',
        },
        {
          label: '列表模式',
          nodePath: 'list',
        },
        {
          label: '加载更多模式',
          nodePath: 'load-more',
        },
        {
          label: '操作交互显示',
          nodePath: 'item-actions',
        },
        {
          label: '列类型汇总',
          nodePath: 'columns',
        },
        {
          label: '可折叠',
          nodePath: 'footable',
        },
        {
          label: '嵌套',
          nodePath: 'nested',
        },
        {
          label: '合并单元格',
          nodePath: 'merge-cell',
        },
        {
          label: '表头分组',
          nodePath: 'header-group',
        },
        {
          label: '带边栏',
          nodePath: 'aside',
        },
        {
          label: '固定表头/列',
          nodePath: 'fixed',
        },
        {
          label: '键盘操作编辑',
          nodePath: 'keyboards',
        },
        {
          label: '操作并下一个',
          nodePath: 'jump-next',
        },
        {
          label: '一次性加载',
          nodePath: 'load-once',
        },
        // {
        //     label: '测试',
        //     nodePath:'test',
        //
        // }
      ],
    },

    {
      label: '弹框',
      icon: 'fa fa-bomb',
      nodePath: 'dialog',
      children: [
        {
          label: '对话框',
          nodePath: 'simple',
        },
        {
          label: '侧边弹出',
          nodePath: 'drawer',
        },
      ],
    },

    {
      label: '选项卡',
      icon: 'fa fa-clone',
      nodePath: 'tabs',
      children: [
        {
          label: '常规选项卡',
          nodePath: 'normal',
        },

        {
          label: '表单中选项卡分组',
          nodePath: 'form',
        },
        {
          label: '选项卡页面1',
          nodePath: 'tab1',
        },
        {
          label: '选项卡页面2',
          nodePath: 'tab2',
        },
        {
          label: '选项卡页面3',
          nodePath: 'tab3',
        },
      ],
    },

    {
      label: '联动',
      icon: 'fa fa-bolt',
      nodePath: 'linkpage',
      children: [
        {
          label: '地址栏变化自动更新',
          nodePath: 'page',
        },
        {
          label: '选项联动',
          nodePath: 'options-local',
        },
        {
          label: '选项远程联动',
          nodePath: 'options',
        },
        {
          label: '表单和表单联动',
          nodePath: 'form',
        },
        {
          label: '表单自动更新',
          nodePath: 'form2',
        },
        {
          label: '表单和列表联动',
          nodePath: 'crud',
        },
      ],
    },

    {
      label: '动态加载',
      icon: 'fa fa-magic',
      nodePath: 'services',
      children: [
        {
          label: '动态加载数据',
          nodePath: 'data',
        },
        {
          label: '动态加载页面',
          nodePath: 'schema',
        },
        {
          label: '动态加载部分表单',
          nodePath: 'form',
        },
      ],
    },

    {
      label: '向导',
      icon: 'fa fa-desktop',
      nodePath: 'wizard',
    },

    {
      label: '排版',
      icon: 'fa fa-columns',
      nodePath: 'horizontal',
    },

    {
      label: '图表',
      icon: 'fa fa-bar-chart',
      nodePath: 'chart',
    },
    {
      label: '轮播图',
      icon: 'fa fa-pause',
      nodePath: 'carousel',
    },
    {
      label: '音频',
      icon: 'fa fa-volume-up',
      nodePath: 'audio',
    },
    {
      label: '视频',
      icon: 'fa fa-video-camera',
      nodePath: 'video',
    },
    {
      label: '异步任务',
      icon: 'fa fa-tasks',
      nodePath: 'task',
    },
    {
      label: 'IFrame',
      icon: 'fa fa-cloud',
      nodePath: 'iframe',
    },
    {
      label: 'SDK',
      icon: 'fa fa-rocket',
      nodePath: 'sdk',
    },

    {
      label: 'Test',
      icon: 'fa fa-code',
      nodePath: 'test',
    },
  ],
}

mapTree([amisRoute], (item) => {
  // 由于 amis 只有两层，因此 这样和简单处理
  if (!item.icon) {
    item.pathToComponent = 'amis_demo'
  }
  return item
})

export default amisRoute
