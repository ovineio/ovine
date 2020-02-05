/**
 * Amis路由
 */

import { mapTree } from 'amis/lib/utils/helper'

import { RouteItem } from '../types'

const amisRoute: RouteItem = {
  label: 'Amis 示例',
  children: [
    {
      label: '页面',
      icon: 'glyphicon glyphicon-th',
      badge: 3,
      badgeClassName: 'bg-info',
      children: [
        {
          label: '简单页面',
          path: 'pages/simple',
        },
        {
          label: '初始化出错',
          path: 'pages/error',
        },
        {
          label: '表单页面',
          path: 'pages/form',
        },
      ],
    },

    {
      label: '表单',
      icon: 'fa fa-list-alt',
      children: [
        {
          label: '表单展示模式',
          path: 'form/mode',
        },

        {
          label: '所有类型汇总',
          path: 'form/full',
        },

        {
          label: '静态展示',
          path: 'form/static',
        },

        {
          label: '输入提示',
          path: 'form/hint',
        },

        {
          label: 'FieldSet',
          path: 'form/fieldset',
        },

        {
          label: 'Tabs',
          path: 'form/tabs',
        },

        {
          label: 'FieldSet Tabs 组合',
          path: 'form/fields-tabs',
        },

        {
          label: '动态数据',
          path: 'form/remote',
        },

        {
          label: '显隐状态联动',
          path: 'form/reaction',
        },

        {
          label: '表单验证',
          path: 'form/validation',
        },

        {
          label: '组合类型',
          path: 'form/combo',
        },

        {
          label: '多功能选择器',
          path: 'form/picker',
        },

        {
          label: '子表单',
          path: 'form/sub-form',
        },

        {
          label: 'JSon Schema表单',
          path: 'form/json-schema',
        },

        {
          label: '富文本',
          path: 'form/rich-text',
        },

        {
          label: '代码编辑器',
          path: 'form/ide',
        },

        {
          label: '自定义组件',
          path: 'form/custom',
        },

        {
          label: '表格编辑',
          path: 'form/table',
        },

        {
          label: '公式示例',
          path: 'form/formula',
        },

        {
          label: '引用',
          path: 'form/definitions',
        },

        // {
        //     label: '布局测试',
        //     path: 'form/layout-test',
        //
        // },

        // {
        //     label: '测试',
        //     path: 'form/test',
        //
        // },
      ],
    },

    {
      label: '增删改查',
      icon: 'fa fa-table',
      children: [
        {
          label: '表格模式',
          path: 'crud/table',
        },
        {
          label: '卡片模式',
          path: 'crud/grid',
        },
        {
          label: '列表模式',
          path: 'crud/list',
        },
        {
          label: '加载更多模式',
          path: 'crud/load-more',
        },
        {
          label: '操作交互显示',
          path: 'crud/item-actions',
        },
        {
          label: '列类型汇总',
          path: 'crud/columns',
        },
        {
          label: '可折叠',
          path: 'crud/footable',
        },
        {
          label: '嵌套',
          path: 'crud/nested',
        },
        {
          label: '合并单元格',
          path: 'crud/merge-cell',
        },
        {
          label: '表头分组',
          path: 'crud/header-group',
        },
        {
          label: '带边栏',
          path: 'crud/aside',
        },
        {
          label: '固定表头/列',
          path: 'crud/fixed',
        },
        {
          label: '键盘操作编辑',
          path: 'crud/keyboards',
        },
        {
          label: '操作并下一个',
          path: 'crud/jump-next',
        },
        {
          label: '一次性加载',
          path: 'crud/load-once',
        },
        // {
        //     label: '测试',
        //     path: 'crud/test',
        //
        // }
      ],
    },

    {
      label: '弹框',
      icon: 'fa fa-bomb',
      children: [
        {
          label: '对话框',
          path: 'dialog/simple',
        },
        {
          label: '侧边弹出',
          path: 'dialog/drawer',
        },
      ],
    },

    {
      label: '选项卡',
      icon: 'fa fa-clone',
      children: [
        {
          label: '常规选项卡',
          path: 'tabs/normal',
        },

        {
          label: '表单中选项卡分组',
          path: 'tabs/form',
        },
        {
          label: '选项卡页面1',
          path: 'tabs/tab1',
        },
        {
          label: '选项卡页面2',
          path: 'tabs/tab2',
        },
        {
          label: '选项卡页面3',
          path: 'tabs/tab3',
        },
      ],
    },

    {
      label: '联动',
      icon: 'fa fa-bolt',
      children: [
        {
          label: '地址栏变化自动更新',
          path: 'linkpage/page',
        },
        {
          label: '选项联动',
          path: 'linkpage/options-local',
        },
        {
          label: '选项远程联动',
          path: 'linkpage/options',
        },
        {
          label: '表单和表单联动',
          path: 'linkpage/form',
        },
        {
          label: '表单自动更新',
          path: 'linkpage/form2',
        },
        {
          label: '表单和列表联动',
          path: 'linkpage/crud',
        },
      ],
    },

    {
      label: '动态加载',
      icon: 'fa fa-magic',
      children: [
        {
          label: '动态加载数据',
          path: 'services/data',
        },
        {
          label: '动态加载页面',
          path: 'services/schema',
        },
        {
          label: '动态加载部分表单',
          path: 'services/form',
        },
      ],
    },

    {
      label: '向导',
      icon: 'fa fa-desktop',
      path: 'wizard',
    },

    {
      label: '排版',
      icon: 'fa fa-columns',
      path: 'horizontal',
    },

    {
      label: '图表',
      icon: 'fa fa-bar-chart',
      path: 'chart',
    },
    {
      label: '轮播图',
      icon: 'fa fa-pause',
      path: 'carousel',
    },
    {
      label: '音频',
      icon: 'fa fa-volume-up',
      path: 'audio',
    },
    {
      label: '视频',
      icon: 'fa fa-video-camera',
      path: 'video',
    },
    {
      label: '异步任务',
      icon: 'fa fa-tasks',
      path: 'task',
    },
    {
      label: 'IFrame',
      icon: 'fa fa-cloud',
      path: 'iframe',
    },
    {
      label: 'SDK',
      icon: 'fa fa-rocket',
      path: 'sdk',
    },

    {
      label: 'Test',
      icon: 'fa fa-code',
      path: 'test',
    },
  ],
}

mapTree([amisRoute], (item) => {
  if (item.path) {
    item.pathToComponent = 'amis_demo'
  }
  return item
})

export default amisRoute
