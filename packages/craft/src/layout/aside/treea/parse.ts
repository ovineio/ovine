import * as acorn from 'acorn'
import * as walk from 'acorn-walk'

import serialize from '@/assets/serialize'

export const getConfigNode = (schema: any) => {
  if (!schema) {
    return null
  }

  const ast = acorn.parse(`const config = ${serialize(schema, { space: 2, unsafe: true })}`, {
    locations: true,
  })

  let configNode: any

  walk.simple(ast, {
    VariableDeclarator(node: any) {
      if (node.id.name === 'config') {
        configNode = node.init
      }
    },
  })

  return configNode
}

const locToPosition = (data: any) => {
  const { start, end } = data
  const { line: startLine, column: startCol } = start
  const { line: endLine, column: endCol } = end
  const position = [startLine, startCol + 1, endLine, endCol + 1]
  return position
}

export const createTreeData = (configNode: any) => {
  if (!configNode) {
    return []
  }

  const { properties = [] } = configNode
  const astTree = properties.map((node: any) => {
    if (!node) {
      return []
    }

    const { key, value, loc, type } = node
    // 直接使用value类型 字符串 数值 布尔值
    const basicType = ['Literal', 'ConditionalExpression', 'MemberExpression']
    const objectType = ['ObjectExpression']
    const arrayType = ['ArrayExpression']
    const funcType = ['ArrowFunctionExpression', 'FunctionExpression']
    const paramsType = ['Identifier', 'ThisExpression']

    const position = locToPosition(loc)

    const title = `${key?.name || key?.value}`
    const valueType: string = value.type

    // 方法的快捷表示法
    if (type === 'ObjectMethod') {
      return {
        title,
        value: null,
        loc: position,
        type: 'function',
      }
    }

    if (basicType.includes(valueType)) {
      let itemTitle = title
      if (['label', 'name', 'type'].includes(title) && typeof value.value === 'string') {
        itemTitle = `${title} ${value.value}`
      }
      return {
        title: itemTitle,
        value: value.value,
        loc: position,
        type: 'basic',
      }
    }

    if (objectType.includes(valueType)) {
      return {
        title,
        value: null,
        loc: position,
        children: createTreeData(value),
        type: 'object',
      }
    }

    if (arrayType.includes(valueType)) {
      return {
        title,
        value: null,
        loc: position,
        children: value.elements.map((v: any, idx: any) => {
          return {
            title: `${idx}`,
            value: null,
            type: 'object',
            loc: locToPosition(v.loc),
            children: createTreeData(v),
          }
        }),
        type: 'array',
      }
    }

    if (funcType.includes(valueType)) {
      return {
        title,
        value: null,
        loc: position,
        type: 'function',
      }
    }

    if (paramsType.includes(valueType)) {
      return {
        title,
        value: null,
        loc: position,
        type: 'param',
      }
    }

    return []
  })

  return astTree
}
