import { map } from 'lodash'

import { assertSimpleInputOut, SimpleOutType } from '../../utils/__tests__/utils'

import * as routeExports from '../exports'

const testCases = {
  currPath: new Map<string[], SimpleOutType>([
    [
      ['/a/b/c'],
      {
        value: 'a/b/c',
      },
    ],
    [
      ['a/b/c'],
      {
        value: 'a/b/c',
      },
    ],
  ]),
  normalizeLink: new Map<any[], SimpleOutType>([
    [
      [
        {
          location: {
            pathname: '/a/b/c',
            search: '',
          },
          to: './d',
        },
      ],
      {
        value: {},
        assert: (value) => {
          expect(value.pathname).toBe('/a/b/d')
        },
      },
    ],
    [
      [
        {
          location: {
            pathname: '/a/b/c',
            search: '',
          },
          to: '?a=1',
        },
      ],
      {
        value: {},
        assert: (value) => {
          expect(value.href).toBe('/a/b/c?a=1')
        },
      },
    ],
  ]),
}

map(testCases, (cases: Map<any, any>, funcName: string) => {
  assertSimpleInputOut({
    cases,
    name: funcName,
    exec: routeExports[funcName],
  })
})
