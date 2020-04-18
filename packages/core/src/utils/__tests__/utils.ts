export type SimpleOutType = {
  value?: any
  describe?: string
  assert?: (...args: any) => any
}

export type SimpleInputOutOption = {
  name: string
  cases: Map<any[], SimpleOutType>
  exec: (...args: any[]) => void
}
export function assertSimpleInputOut(option: SimpleInputOutOption) {
  const { name, cases, exec } = option
  cases.forEach((out, argsArr) => {
    describe(`test "${name}" util.`, () => {
      const { value, describe, assert } = out
      const desc =
        describe ||
        `${name}(${argsArr.map((arg: any) => JSON.stringify(arg))})${
          typeof value === 'undefined' ? '' : ` => ${JSON.stringify(value)}`
        }`

      test(desc, () => {
        const testSource = exec(...argsArr)

        if (assert) {
          assert(testSource)
          return
        }

        expect(testSource).toBe(value)
      })
    })
  })
}
