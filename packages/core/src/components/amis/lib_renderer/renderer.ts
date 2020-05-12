import { ObjectOf } from '@/utils/types'

const renderers: ObjectOf<any> = {}

const libRenderer = {
  getAllRenderers: () => renderers,
  register: (key: any, renderer: any) => {
    renderers[key] = renderer
  },
}

export default libRenderer
