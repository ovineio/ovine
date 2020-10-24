import { ReqOption } from '@core/utils/request/types'
import { AnyFunc } from '@core/utils/types'

export type EditorProps = {
  breadcrumb?: string | string[] // 路由面包屑
  schema?: any // 当前页面 schema，存在时，将不会读取 schemaApi
  schemaApi?: ReqOption // 用来获取远程 Schema 接口地址
  initFetchSchema?: boolean // 是否默认拉取 Schema
  getSchema?: AnyFunc
  // mutualExclusion?: boolean // 互斥编辑 默认为 true
  saveApi?: ReqOption // 保存API， 不存在时将存储在本地
  saveInterval?: number // 轮训时间间隔调用保存API (最低 3000)
  onSave?: (schema: any) => void // 保存时的回调
  onExit?: AnyFunc // 推出时回调
}
