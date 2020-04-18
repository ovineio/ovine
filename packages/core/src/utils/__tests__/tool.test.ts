import { map } from 'lodash'

import * as tools from '../tool'
import { assertSimpleInputOut, SimpleOutType } from './utils'

const testCases = {
  getQuery: new Map<string[], SimpleOutType>([
    [['', 'https://www.baidu.com'], { value: undefined }],
    [['', 'https://www.baidu.com?a'], { value: undefined }],
    [['a', 'https://www.baidu.com?a=b'], { value: 'b' }],
    [
      ['', 'https://www.baidu.com?a=b&c=d'],
      {
        value: { a: 'b', c: 'd' },
        assert: (value: any) => {
          expect(JSON.stringify({ a: 'b', c: 'd' }) === JSON.stringify(value)).toBe(true)
        },
      },
    ],
  ]),

  isSubStr: new Map<[string, string, number?], SimpleOutType>([
    [['hello', 'le'], { value: false }],
    [['hello', 'll'], { value: true }],
    [['hello', 'll', 1], { value: false }],
    [['hello', 'll', 2], { value: true }],
  ]),

  cls: new Map<any[], SimpleOutType>([
    [['a', 'b', 'c'], { value: 'a b c' }],
    [[['a', 'b'], 'c'], { value: 'a b c' }],
    [['a', { b: true }, 'c'], { value: 'a b c' }],
    [['a', { b: false }, 'c'], { value: 'a c' }],
  ]),

  formatDate: new Map<[string, any?], SimpleOutType>([
    [['yyyy-MM-dd'], { assert: (val) => expect(typeof val === 'string').toBe(true) }],
    [['yyyy-MM-dd', '1585922234496'], { value: '2020-04-03' }],
    [['yyyy/MM/dd', '1585922234496'], { value: '2020/04/03' }],
    [['yyyy/MM/dd hh:mm:ss', '1585922234496'], { value: '2020/04/03 21:57:14' }],
  ]),

  choice: new Map<[any[]], SimpleOutType>([
    [[[1, 2, 3]], { assert: (val) => [1, 2, 3].includes(val) }],
  ]),

  isExpired: new Map<[string | number, number?], SimpleOutType>([
    [[new Date('2020-01-01 10:00:00').valueOf()], { value: true }],
    [[new Date('2030-01-01 10:00:00').valueOf()], { value: false }],
    [
      [new Date('2030-01-01 10:00:00').valueOf(), new Date('2020-01-01 10:00:00').valueOf()],
      { value: false },
    ],
  ]),
}

map(testCases, (cases: Map<any, any>, funcName: string) => {
  assertSimpleInputOut({
    cases,
    name: funcName,
    exec: tools[funcName],
  })
})
