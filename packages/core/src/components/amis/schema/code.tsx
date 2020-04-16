// import { Drawer, Spinner } from 'amis'
// import { Editor } from 'amis/lib/components'
// import cloneDeep from 'lodash/cloneDeep'
// import isFunction from 'lodash/isFunction'
// import isObject from 'lodash/isObject'
// import map from 'lodash/map'
// import React, { useMemo, useRef, useState } from 'react'
// import { Portal } from 'react-overlays'

// import { storage } from '@/constants'
// import { getRouteConfig } from '@/routes/config'
// import { getStore } from '@/utils/store'
// import * as Types from '@/utils/types'

// import { LibSchema } from './types'

// const transSchema = (schema: any) => {
//   if (!isObject(schema)) {
//     return
//   }
//   map(schema, (val, key) => {
//     if (isFunction(val)) {
//       ;(schema as any)[key] = 'Function Body'
//     } else if (isObject(val)) {
//       transSchema(val)
//     }
//   })
// }

// export const containerSelector = '.navbar-nav>[data-item="header-item-code"]'

// type Props = {
//   theme: string
//   schema: LibSchema
// }

// type CodeType = 'route' | 'page' | 'limit'
// export default (props: Props) => {
//   const { theme, schema } = props

//   const [show, toggle] = useState(false)
//   const [code, setCode] = useState<CodeType>('page')
//   const [loading, toggleLoading] = useState(false)

//   const storeRef = useRef<Types.ObjectOf<any>>({})

//   const toggleDrawer = () => toggle((t) => !t)

//   const onEditorMounted = () => {
//     if (loading && (window as any).monaco) {
//       toggleLoading(false)
//     }
//   }

//   const cachedSchema = useMemo(() => {
//     let json: any = {}
//     if (storeRef.current[code]) {
//       return storeRef.current[code]
//     }
//     switch (code) {
//       case 'page':
//         json = cloneDeep(schema)
//         transSchema(json)
//         break
//       case 'route':
//         json = cloneDeep(getRouteConfig())
//         transSchema(json)
//         break
//       case 'limit':
//         json = {
//           authLimits: getStore<string>(storage.dev.limit)?.split(','),
//           authApis: getStore<string>(storage.dev.api)?.split(','),
//         }
//         break
//       default:
//     }
//     const jsonStr = JSON.stringify(json)
//     storeRef.current[code] = jsonStr
//     return jsonStr
//   }, [schema, code])

//   const viewCode = (codeType: CodeType) => {
//     setCode(codeType)
//     toggleDrawer()
//   }

//   return (
//     <Portal container={() => $(containerSelector).get(0)}>
//       <Drawer
//         closeOnOutside
//         theme={theme}
//         size="lg"
//         onHide={toggleDrawer}
//         show={show}
//         position="left"
//       >
//         <Spinner overlay show={show && loading} size="lg" />
//         {show && (
//           <Editor
//             editorDidMount={onEditorMounted}
//             options={{ readOnly: true }}
//             editorTheme={theme === 'dark' ? 'vs-dark' : 'vs'}
//             language="json"
//             value={cachedSchema}
//           />
//         )}
//       </Drawer>
//     </Portal>
//   )
// }
