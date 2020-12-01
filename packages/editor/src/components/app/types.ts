import { ReqOption } from '@core/utils/request/types'
import { AnyFunc } from '@core/utils/types'

export type EditorProps = {
  // TODO: 添加互斥编辑逻辑
  // mutualExclusion?: boolean // 互斥编辑 默认为 true,同时只能编辑一个页面
  breadcrumb?: string | string[] // 路由面包屑
  // multiTheme?: boolean // 多主题 默认 true
  schema?: any // 当前页面 schema，存在时，将不会读取 schemaApi
  initApi?: ReqOption // 用来获取远程 Schema 接口地址
  saveApi?: ReqOption // 保存API， 不存在时将存储在本地
  saveInterval?: number // 轮训时间间隔调用保存API (最低 3000)
  getSchema?: AnyFunc
  onSave?: (schema: any) => void // 保存时的回调
  onExit?: AnyFunc // 退出时回调
}
