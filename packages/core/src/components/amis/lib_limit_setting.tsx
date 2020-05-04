// /**
//  * lib-when 条件渲染器
//  * 用于不同条件，渲染不同组件的情况
//  */

// import { Renderer } from 'amis'
// import { RendererProps } from 'amis/lib/factory'
// import { SchemaNode } from 'amis/lib/types'

// import LimitSetting from '@/components/limit_setting'

// type Props = RendererProps & {
//   condition: string
//   ifTrue?: SchemaNode
//   ifFalse?: SchemaNode
//   cases?: Array<
//     SchemaNode & {
//       value: any
//     }
//   >
// }

// const LibLimitSetting = (props: Props) => {
//   const { data, render } = props

//   const limitSchema = {
//     type: 'button',
//     icon: 'fa fa-lock',
//     label: '编辑权限',
//     actionType: 'dialog',
//     body: {
//       type: 'dialog',
//       title: '测试权限设置',
//       show: limitVisible,
//       onClose: toggleLimitDialog,
//       size: 'md',
//       showCloseButton: false,
//       actions: [],
//       body: {
//         component: () => (
//           <LimitSetting
//             authLimit={getStore<string>(storage.dev.limit) || ''}
//             saveConfirmText="权限测试修改，仅对自己有效，刷新页面后可预览最新权限。清除缓存可恢复所有权限。"
//             onCancel={toggleLimitDialog}
//             onSaveLimit={(data) => {
//               setStore(storage.dev.limit, data.authLimit)
//               setStore(storage.dev.api, data.authApi)
//               setAppLimits(data.authLimit)
//               window.location.reload()
//             }}
//           />
//         ),
//       }
//     }
//   }

//   return render('body', limitSchema)
// }

// Renderer({
//   test: /(^|\/)lib-limit-setting$/,
//   name: 'lib-limit-setting',
// })(LibLimitSetting as any)
