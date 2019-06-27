import React, { useEffect } from 'react'

import request from '@core/request'
import { snakeCase } from '@utils/tool'
import TableFilter from '@widgets/table_filter'

import { StyledTableView } from './styled'
import { TableViewProps } from './types'

// https://www.layui.com/doc/modules/table.html#cols

const TableView = (props: TableViewProps) => {
  const { page, request: reqOption, id, toolbar, onToolbar } = props
  const tableId = `table-${snakeCase(id, true)}`
  const filterId = `table-filter-${snakeCase(id, true)}`

  useEffect(() => {
    layui.use('table', () => {
      const { table } = layui
      const layOption = {
        ...props,
        loading: true,
        elem: `#${tableId}`,
        data: [],
      }
      const $table = table.render(layOption)
      request(reqOption).then((source: any) => {
        const { count, items } = source
        $table.reload({
          data: items,
          loading: true,
          page: {
            ...page,
            count,
          },
        })
      })
      if (toolbar && onToolbar) {
        table.on(`toolbar(${tableId})`, onToolbar)
      }
    })
  }, [])

  return (
    <StyledTableView className="layui-card">
      <div id={filterId}>
        <TableFilter />
      </div>
      <table lay-filter={tableId} id={tableId} />
    </StyledTableView>
  )
}

export default TableView
