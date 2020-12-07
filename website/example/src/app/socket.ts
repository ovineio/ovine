/**
 * TODO: 接入Socket 对接数据
 */

// import io from 'socket.io-client'

// import { publish } from '@core/utils/message'

// const socket = io('http://localhost:3000')

// // socket.on('connect', () => {
// //   console.log(`connect ${socket.id}`)
// // })

// // 接收到 socket 信息
// socket.on('socketKey', (data: any) => {
//   // 由 core msg 模块，转发，防止到处引用 socket 模块
//   // 另外 可以将 订阅/发布 key 都放在常量 constants.ts 文件中,防止key值有变动，或者写错。
//   publish('socket:applyDialogShow', data)
// })
