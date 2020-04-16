import { getModulePath } from '../utils'

describe('test utils function tools.', () => {
  test('getModulePath', () => {
    const dirAr = [
      getModulePath(__dirname, 'amis/scss/themes', true),
      getModulePath(__dirname, 'lib/core/scss', true),
    ].filter((i) => i)
    expect(dirAr.length).toBe(2)
  })
})
