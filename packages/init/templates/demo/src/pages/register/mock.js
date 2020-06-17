export default {
  'POST ovapi/user/demo_register': () => {
    // return {
    //   code: 1,
    //   message: '模拟登录出错'
    // }

    return {
      code: 0,
      data: {
        key: 'X-TOKEN',
        token: 'mockToken',
      },
    }
  },
}
