import { getModulePath } from '../utils'

describe('test utils function tools.', () => {
  test('getModulePath', () => {
    const dir = getModulePath(__dirname, 'amis/scss/thems') || ''
    expect(dir.indexOf('amis/scss/thems')).toBe(false)
  })
})
