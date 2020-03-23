import { Schema } from 'amis/lib/types'

import { LimitSchema, PagePreset } from '@/routes/types'

export type SchemaPreset = PagePreset & {
  // 所有操作列表
  actions?: Types.ObjectOf<Schema>
  // 所有的表单
  forms?: Types.ObjectOf<Schema>
}

export type RtSchema = Schema &
  LimitSchema & {
    preset?: SchemaPreset // 预设值
  }
