import { RequestOption } from '@core/request'

export type TableHeaderProps = {
  field: string
  title: string
  width?: number | string
  minWidth?: number
  type?: 'normal' | 'checkbox' | 'radio' | 'numbers' | 'space'
  LAY_CHECKED?: boolean
  fixed?: 'left' | 'right'
  hide?: boolean
  totalRow?: boolean
  totalRowText?: boolean
  sort?: boolean
  unresize?: boolean
  edit?: boolean
  event?: string
  style?: string
  align?: 'left' | 'center' | 'right'
  colspan?: number
  rowspan?: number
  templet?: string
  toolbar?: string
}

// https://www.layui.com/doc/modules/laypage.html#options
export type TablePagesProps = {
  elem?: string
  count?: number
  limit: number
  limits?: number[]
  curr?: number
  groups?: number
  prev?: string
  next?: string
  first?: string
  last?: string
  layout?: string[]
  theme?: string
  hash?: string | boolean
  jump?: (obj: any, first: boolean) => void
}

export type TableViewProps = {
  // elem: string
  request: RequestOption
  id: string
  cols: TableHeaderProps[][]
  // data: any[]
  url?: string
  toolbar?: string | boolean
  defaultToolbar?: ['filter' | 'exports' | 'exports']
  onToolbar?: (data: any) => void
  width?: number
  height?: number | string
  cellMinWidth?: number
  done?: (source: any, currPage: number, count: number) => void
  totalRow?: boolean
  page?: false | TablePagesProps
  loading?: boolean
  title?: string
  text?: {
    none: string
  }
  autoSort?: boolean
  initSort?: {
    field: string
    type: 'asc' | 'desc' | 'null'
  }
  skin?: 'line' | 'row' | 'nob'
  even?: boolean
  size?: 'sm' | 'lg'
}
